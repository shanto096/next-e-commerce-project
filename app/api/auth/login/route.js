// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // MongoDB ক্লায়েন্ট ইম্পোর্ট করুন
import bcrypt from 'bcryptjs'; // পাসওয়ার্ড তুলনা করার জন্য bcryptjs ইম্পোর্ট করুন

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // ইমেল এবং পাসওয়ার্ড আছে কিনা তা যাচাই করুন।
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("UserDB"); // আপনার ডেটাবেসের নাম দিন
        const usersCollection = db.collection("users");

        // ইমেল দ্বারা ইউজার খুঁজুন।
        const user = await usersCollection.findOne({ email });

        // ইউজার না পাওয়া গেলে ত্রুটি ফিরিয়ে দিন।
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 }); // 401 Unauthorized
        }

        // প্রদত্ত পাসওয়ার্ড হ্যাশকৃত পাসওয়ার্ডের সাথে তুলনা করুন।
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // পাসওয়ার্ড সঠিক না হলে ত্রুটি ফিরিয়ে দিন।
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 }); // 401 Unauthorized
        }

        // লগইন সফল হলে রেসপন্স ফিরিয়ে দিন।
        // একটি বাস্তব অ্যাপ্লিকেশনে, এখানে একটি JWT (JSON Web Token) তৈরি করে পাঠানো হবে।
        return NextResponse.json({
            message: 'Login successful!',
            user: {
                id: user._id,
                email: user.email,
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({
            message: 'Error during login.',
            error: error.message
        }, { status: 500 });
    }
}