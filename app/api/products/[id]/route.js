// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
// MongoDB ক্লায়েন্ট ইম্পোর্ট করুন
import { ObjectId } from 'mongodb'; // ObjectId ইম্পোর্ট করুন ID দ্বারা খোঁজার জন্য

import clientPromise from '../../../../lib/mongodb';

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/products/[id] পাথে অ্যাক্সেস করা যাবে এবং একটি নির্দিষ্ট প্রোডাক্ট ফিরিয়ে দেবে।
export async function GET(request, { params }) {
    try {
        const { id } = params; // URL থেকে আইডি প্যারামিটার গ্রহণ করুন

        // আইডি একটি বৈধ ObjectId কিনা তা যাচাই করুন।
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
        const productsCollection = db.collection("products"); // 'products' কালেকশন ব্যবহার করুন

        // আইডি দ্বারা একটি নির্দিষ্ট প্রোডাক্ট খুঁজুন।
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });

        // যদি প্রোডাক্ট না পাওয়া যায়।
        if (!product) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 }); // 404 Not Found
        }

        // সফল JSON রেসপন্স ফিরিয়ে দিন।
        return NextResponse.json({
            message: 'Product fetched successfully!',
            data: product
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching single product:', error);
        return NextResponse.json({
            message: 'Error fetching product.',
            error: error.message
        }, { status: 500 });
    }
}