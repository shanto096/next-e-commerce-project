// app/api/products/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // কুকি অ্যাক্সেস করার জন্য
import { verifyToken } from '../../../lib/jwt'; // আপনার JWT ভেরিফিকেশন ইউটিলিটি
import clientPromise from '../../../lib/mongodb'; // সঠিক রিলেটিভ পাথ ব্যবহার করা হয়েছে

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/products পাথে অ্যাক্সেস করা যাবে এবং সমস্ত প্রোডাক্ট ডেটা ফিরিয়ে দেবে।
export async function GET(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt'); // আপনার কুকির নাম

    // 1. টোকেন আছে কিনা চেক করুন
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
        // 2. টোকেন ভেরিফাই করুন। verifyToken যদি একটি async ফাংশন হয়, তাহলে await ব্যবহার করতে হবে।
        decoded = await verifyToken(token.value);
        // console.log('API GET - Decoded Token:', decoded); // ডিবাগিংয়ের জন্য
    } catch (error) {
        console.error('API GET - JWT verification failed:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // 3. রোল চেক করুন (উদাহরণস্বরূপ, শুধু অ্যাডমিনরা সব প্রোডাক্ট দেখতে পারবে)
    // যদি এই API টি শুধুমাত্র অ্যাডমিনদের জন্য হয়:
    if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin privilege required' }, { status: 403 });
    }

    // 4. যদি সব চেক পাস করে, তাহলে ডেটা প্রসেস করুন
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        const total = await productsCollection.countDocuments();
        const products = await productsCollection.find({})
            .skip(skip)
            .limit(limit)
            .toArray();
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: 'Products fetched successfully!',
            data: products,
            total,
            totalPages,
            page,
            limit
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            message: 'Error fetching products.',
            error: error.message
        }, { status: 500 });
    }
}

// POST রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/products পাথে অ্যাক্সেস করা যাবে এবং নতুন প্রোডাক্ট ডেটা ডেটাবেসে যোগ করবে।
export async function POST(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt'); // আপনার কুকির নাম

    // 1. টোকেন আছে কিনা চেক করুন
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
        // 2. টোকেন ভেরিফাই করুন। verifyToken যদি একটি async ফাংশন হয়, তাহলে await ব্যবহার করতে হবে।
        decoded = await verifyToken(token.value);
        // console.log('API POST - Decoded Token:', decoded); // ডিবাগিংয়ের জন্য
    } catch (error) {
        console.error('API POST - JWT verification failed:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // 3. রোল চেক করুন (উদাহরণস্বরূপ, শুধু অ্যাডমিনরা প্রোডাক্ট তৈরি করতে পারবে)
    if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin privilege required' }, { status: 403 });
    }

    // 4. যদি সব চেক পাস করে, তাহলে ডেটা প্রসেস করুন
    try {
        // রিকোয়েস্ট বডি থেকে JSON ডেটা পার্স করা হচ্ছে।
        const { name, title, category, description } = await request.json();

        // console.log(name, title, category, description); // ডিবাগিংয়ের জন্য

        // প্রয়োজনীয় ফিল্ডগুলো আছে কিনা তা যাচাই করুন।
        if (!name || !title || !category || !description) {
            return NextResponse.json({ message: 'All fields (name, title, category, description) are required.' }, { status: 400 }); // 400 Bad Request
        }

        // MongoDB ক্লায়েন্টের সাথে সংযোগ স্থাপন করুন।
        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
        const productsCollection = db.collection("products"); // 'products' কালেকশন ব্যবহার করুন

        // নতুন প্রোডাক্ট ডকুমেন্ট তৈরি করুন।
        const newProduct = {
            name,
            title,
            category,
            description,
            createdAt: new Date(), // প্রোডাক্ট তৈরির সময়
            updatedAt: new Date(), // শেষ আপডেটের সময়
        };

        // 'products' কালেকশনে নতুন ডকুমেন্ট যোগ করুন।
        const result = await productsCollection.insertOne(newProduct);

        // সফল JSON রেসপন্স ফিরিয়ে দিন।
        return NextResponse.json({
            message: 'Product added successfully!',
            productId: result.insertedId, // নতুন যোগ করা প্রোডাক্টের ID
            product: newProduct // যোগ করা প্রোডাক্টের ডেটা
        }, { status: 201 }); // 201 Created স্ট্যাটাস কোড

    } catch (error) {
        // কোনো ত্রুটি হলে 500 (Internal Server Error) স্ট্যাটাস কোড সহ রেসপন্স পাঠানো হচ্ছে।
        console.error('Error adding product:', error);
        return NextResponse.json({
            message: 'Error adding product.',
            error: error.message
        }, { status: 500 });
    }
}