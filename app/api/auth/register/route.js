import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb'; // MongoDB ক্লায়েন্ট ইম্পোর্ট করুন
import bcrypt from 'bcryptjs'; // পাসওয়ার্ড হ্যাশ করার জন্য bcryptjs ইম্পোর্ট করুন

export async function POST(request) {
    try {
        // রিকোয়েস্ট বডি থেকে email, password এবং name গ্রহণ করুন
        const { name, email, password } = await request.json();

        // নাম, ইমেল এবং পাসওয়ার্ড আছে কিনা তা যাচাই করুন।
        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
        const usersCollection = db.collection("users");

        // ইউজারটি ইতিমধ্যে বিদ্যমান কিনা তা পরীক্ষা করুন (ইমেল দিয়ে)।
        const existingUser = await usersCollection.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 }); // 409 Conflict
        }

        // পাসওয়ার্ড হ্যাশ করুন।
        const hashedPassword = await bcrypt.hash(password, 10); // 10 হলো সল্ট রাউন্ড

        // নতুন ইউজার তৈরি করুন এবং ডেটাবেসে সংরক্ষণ করুন।
        const result = await usersCollection.insertOne({
            name, // নতুন যোগ করা হয়েছে
            email,
            password: hashedPassword,
            role: 'user',
            createdAt: new Date(),
        });

        return NextResponse.json({
            message: 'User registered successfully!',
            userId: result.insertedId,
            name: name, // প্রতিক্রিয়াতে নাম অন্তর্ভুক্ত করুন
            email: email
        }, { status: 201 }); // 201 Created

    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({
            message: 'Error during registration.',
            error: error.message
        }, { status: 500 });
    }
}