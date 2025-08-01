// app/api/users/route.js
import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../../lib/jwt';
import { cookies } from 'next/headers';

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/users পাথে অ্যাক্সেস করা যাবে এবং সমস্ত ইউজার ডেটা ফিরিয়ে দেবে।
export async function GET(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt'); // 'jwt' নামের কুকি থেকে টোকেন নেওয়া হচ্ছে

    // ১. টোকেন আছে কিনা চেক করুন
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
        // ২. টোকেন ভেরিফাই করুন।
        decoded = await verifyToken(token.value);
    } catch (error) {
        console.error('API PUT - JWT verification failed:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // ৩. রোল চেক করুন (উদাহরণস্বরূপ, শুধু অ্যাডমিনরা প্রোডাক্ট আপডেট করতে পারবে)
    if (decoded?.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin privilege required' }, { status: 403 });
    }
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



// আপনি চাইলে অন্যান্য HTTP মেথড যেমন PUT, DELETE ইত্যাদিও এখানে হ্যান্ডেল করতে পারেন।

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