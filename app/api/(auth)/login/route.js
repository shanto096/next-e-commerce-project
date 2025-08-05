import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb'; // MongoDB ক্লায়েন্ট ইম্পোর্ট করুন
import bcrypt from 'bcryptjs'; // পাসওয়ার্ড তুলনা করার জন্য bcryptjs ইম্পোর্ট করুন
import { serialize } from 'cookie';
import { generateToken } from '../../../../lib/jwt';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // ইমেল এবং পাসওয়ার্ড আছে কিনা তা যাচাই করুন।
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
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

        // 3. JWT তৈরি করুন
        const token = generateToken({ userId: user._id, role: user.role, email: user.email });

        // 4. JWT কে HTTP-only কুকি হিসাবে সেট করুন
        const cookieOptions = {
            httpOnly: true, // ক্লায়েন্ট-সাইড জাভাস্ক্রিপ্ট দ্বারা অ্যাক্সেসযোগ্য নয়
            secure: process.env.NODE_ENV === 'production', // শুধুমাত্র HTTPS এ পাঠান
            sameSite: 'Lax', // CSRF সুরক্ষা
            maxAge: 60 * 60 * 24 * 7, // 1 সপ্তাহ (সেকেন্ডে)
            path: '/', // সমস্ত পাথের জন্য উপলব্ধ
        };

        const serializedCookie = serialize('jwt', token, cookieOptions);

        // 5. প্রতিক্রিয়াতে কুকি সেট করুন
        const response = NextResponse.json({
            message: 'সফলভাবে লগইন করা হয়েছে',
            user: { id: user.id, email: user.email, role: user.role }
        }, { status: 200 });

        response.headers.set('Set-Cookie', serializedCookie);
        return response;

    } catch (error) {
        console.error('Error during login:', error);
        return NextResponse.json({
            message: 'Error during login.',
            error: error.message
        }, { status: 500 });
    }
}