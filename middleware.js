// middleware.js (রুট এবং পেজ সুরক্ষিত করার জন্য)
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt'; // আপনার JWT ইউটিলিটি

// এই মিডলওয়্যারটি কোন রুটগুলির জন্য চলবে তা কনফিগার করুন
export const config = {
    matcher: ['/admin/:path*', '/api/products/:path*'], // /admin এবং /api/admin এর অধীনে সমস্ত রুট
};

export async function middleware(request) {
    const token = request.cookies.get('jwt')?.value; // কুকি থেকে JWT নিন

    // 1. যদি কোন টোকেন না থাকে
    if (!token) {
        // লগইন পেজে রিডাইরেক্ট করুন
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // 2. টোকেন যাচাই করুন
    const decoded = verifyToken(token);

    // 3. যদি টোকেন অবৈধ হয় বা অ্যাডমিন রোল না থাকে
    if (!decoded || decoded.role !== 'admin') {
        // লগইন পেজে রিডাইরেক্ট করুন বা একটি অননুমোদিত পেজে
        const url = request.nextUrl.clone();
        url.pathname = '/login'; // অথবা '/unauthorized'
        return NextResponse.redirect(url);
    }

    // 4. যদি সব ঠিক থাকে, অনুরোধ চালিয়ে যেতে দিন
    return NextResponse.next();
}
