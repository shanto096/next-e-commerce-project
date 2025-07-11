// app/api/users/route.js
import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/users পাথে অ্যাক্সেস করা যাবে এবং সমস্ত ইউজার ডেটা ফিরিয়ে দেবে।
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const usersCollection = db.collection("users");

        const total = await usersCollection.countDocuments();
        const users = await usersCollection.find({})
            .skip(skip)
            .limit(limit)
            .toArray();
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: 'Users fetched successfully!',
            data: users,
            total,
            totalPages,
            page,
            limit
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
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন

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
export async function PUT(request) {
    try {
        const { id, name, email } = await request.json();
        if (!id || (!name && !email)) {
            return NextResponse.json({ message: 'User ID and at least one field (name or email) required.' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const update = {};
        if (name) update.name = name;
        if (email) update.email = email;
        const result = await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: update });
        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User updated successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ message: 'Error updating user.', error: error.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: 'User ID is required.' }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }
        return NextResponse.json({ message: 'User deleted successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ message: 'Error deleting user.', error: error.message }, { status: 500 });
    }
}