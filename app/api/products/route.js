// app/api/products/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // কুকি অ্যাক্সেস করার জন্য
import { verifyToken } from '../../../lib/jwt'; // আপনার JWT ভেরিফিকেশন ইউটিলিটি
import clientPromise from '../../../lib/mongodb'; // সঠিক রিলেটিভ পাথ ব্যবহার করা হয়েছে
import { uploadImageToCloudinary } from '../../../lib/cloudinary'; // Cloudinary আপলোড ইউটিলিটি

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/products পাথে অ্যাক্সেস করা যাবে এবং সমস্ত প্রোডাক্ট ডেটা ফিরিয়ে দেবে।
export async function GET(request) {

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
/**
 * Next.js API Route handler for POST requests to /api/products.
 * Handles product creation, including image upload to Cloudinary and
 * saving product data to MongoDB.
 *
 * @param {import('next/server').NextRequest} request - The incoming Next.js request object.
 * @returns {Promise<import('next/server').NextResponse>} - The Next.js response object.
 */
export async function POST(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt'); // 'jwt' নামের কুকি থেকে টোকেন নেওয়া হচ্ছে

    // ১. টোকেন আছে কিনা চেক করুন
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
        // ২. টোকেন ভেরিফাই করুন। verifyToken যদি একটি async ফাংশন হয়, তাহলে await ব্যবহার করতে হবে।
        decoded = await verifyToken(token.value);
        // console.log('API POST - Decoded Token:', decoded); // ডিবাগিংয়ের জন্য
    } catch (error) {
        console.error('API POST - JWT verification failed:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // ৩. রোল চেক করুন (উদাহরণস্বরূপ, শুধু অ্যাডমিনরা প্রোডাক্ট তৈরি করতে পারবে)
    // আপনার JWT টোকেনে 'role' ফিল্ড আছে ধরে নেওয়া হচ্ছে।
    if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin privilege required' }, { status: 403 });
    }

    // ৪. যদি সব চেক পাস করে, তাহলে ডেটা প্রসেস করুন
    try {
        // FormData থেকে সরাসরি ডেটা পার্স করুন Next.js এর request.formData() ব্যবহার করে
        const formData = await request.formData();

        // FormData থেকে ফিল্ডগুলো নিন
        const name = formData.get('name');
        const title = formData.get('title');
        const category = formData.get('category');
        const description = formData.get('description');
        const price = formData.get('price');
        const productImage = formData.get('productImage'); // ফাইল অবজেক্ট

        // প্রয়োজনীয় ফিল্ডগুলো আছে কিনা তা যাচাই করুন।
        // productImage একটি File অবজেক্ট হওয়া উচিত, তাই এটি null বা undefined হবে না যদি ফাইল আপলোড করা হয়।
        if (!name || !title || !category || !description || !price || !productImage) {
            return NextResponse.json({ message: 'All fields (name, title, category, description, price, productImage) are required.' }, { status: 400 }); // 400 Bad Request
        }

        // productImage (File অবজেক্ট) থেকে বাফার এবং ফাইলের নাম নিন
        const imageBuffer = Buffer.from(await productImage.arrayBuffer());
        const imageName = productImage.name;

        // Cloudinary-তে ছবি আপলোড করুন
        const imageUrl = await uploadImageToCloudinary(imageBuffer, imageName);

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
            price: parseFloat(price), // price কে number এ রূপান্তর করুন
            productImage: imageUrl, // Cloudinary থেকে প্রাপ্ত URL
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

// Multer আর ব্যবহার হচ্ছে না, তাই bodyParser: false এর প্রয়োজন নেই।
// তবে, যদি অন্য কোনো কারণে bodyParser নিষ্ক্রিয় রাখতে চান, তাহলে রেখে দিতে পারেন।
// এখানে এটি সরিয়ে দেওয়া হলো কারণ এটি আর Multer এর জন্য প্রয়োজনীয় নয়।
// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };