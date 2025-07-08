// app/api/users/route.js
import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/users পাথে অ্যাক্সেস করা যাবে এবং সমস্ত ইউজার ডেটা ফিরিয়ে দেবে।
export async function GET(request) {
    try {
        // MongoDB ক্লায়েন্টের সাথে সংযোগ স্থাপন করুন।
        const client = await clientPromise;
        const db = client.db("UserDB"); // আপনার ডেটাবেসের নাম দিন

        // 'users' কালেকশন থেকে সমস্ত ডকুমেন্ট খুঁজে বের করুন।
        const users = await db.collection("users").find({}).toArray();

        // সফল JSON রেসপন্স ফিরিয়ে দিন।
        return NextResponse.json({
            message: 'Users fetched successfully!',
            data: users
        }, { status: 200 });

    } catch (error) {
        // কোনো ত্রুটি হলে 500 (Internal Server Error) স্ট্যাটাস কোড সহ রেসপন্স পাঠানো হচ্ছে।
        console.error('Error fetching users:', error);
        return NextResponse.json({
            message: 'Error fetching users.',
            error: error.message
        }, { status: 500 });
    }
}

// POST রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/users পাথে অ্যাক্সেস করা যাবে এবং নতুন ইউজার ডেটা ডেটাবেসে যোগ করবে।
export async function POST(request) {
    try {
        // রিকোয়েস্ট বডি থেকে JSON ডেটা পার্স করা হচ্ছে।
        const { name, email } = await request.json();

        // যদি নাম বা ইমেল না থাকে, তাহলে 400 (Bad Request) ত্রুটি ফিরিয়ে দিন।
        if (!name || !email) {
            return NextResponse.json({ message: 'Name and email are required.' }, { status: 400 });
        }

        // MongoDB ক্লায়েন্টের সাথে সংযোগ স্থাপন করুন।
        const client = await clientPromise;
        const db = client.db("your_database_name"); // আপনার ডেটাবেসের নাম দিন

        // 'users' কালেকশনে নতুন ডকুমেন্ট যোগ করুন।
        const result = await db.collection("users").insertOne({ name, email, createdAt: new Date() });

        // সফল JSON রেসপন্স ফিরিয়ে দিন।
        return NextResponse.json({
            message: 'User added successfully!',
            userId: result.insertedId, // নতুন যোগ করা ইউজারের ID
            data: { name, email }
        }, { status: 201 }); // 201 Created স্ট্যাটাস কোড

    } catch (error) {
        // কোনো ত্রুটি হলে 500 (Internal Server Error) স্ট্যাটাস কোড সহ রেসপন্স পাঠানো হচ্ছে।
        console.error('Error adding user:', error);
        return NextResponse.json({
            message: 'Error adding user.',
            error: error.message
        }, { status: 500 });
    }
}

// আপনি চাইলে অন্যান্য HTTP মেথড যেমন PUT, DELETE ইত্যাদিও এখানে হ্যান্ডেল করতে পারেন।
/*
export async function PUT(request) {
  // PUT রিকোয়েস্ট হ্যান্ডেল করার লজিক
}

export async function DELETE(request) {
  // DELETE রিকোয়েস্ট হ্যান্ডেল করার লজিক
}
*/