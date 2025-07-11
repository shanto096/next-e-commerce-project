// app/api/products/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb'; // সঠিক রিলেটিভ পাথ ব্যবহার করা হয়েছে

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/products পাথে অ্যাক্সেস করা যাবে এবং সমস্ত প্রোডাক্ট ডেটা ফিরিয়ে দেবে।
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
        const products = await db.collection("products").find({}).toArray();

        return NextResponse.json({
            message: 'Products fetched successfully!',
            data: products
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
    try {
        // রিকোয়েস্ট বডি থেকে JSON ডেটা পার্স করা হচ্ছে।
        const { name, title, category, description } = await request.json();

        console.log(name, title, category, description);

        // // প্রয়োজনীয় ফিল্ডগুলো আছে কিনা তা যাচাই করুন।
        if (!name || !title || !category || !description) { // এখানে একটি অতিরিক্ত ! ছিল, সেটিও ঠিক করা হয়েছে
            return NextResponse.json({ message: 'All fields (name, title, category, description) are required.' }, { status: 400 } // 400 Bad Request
            );
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