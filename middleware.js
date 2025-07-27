import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
    const token = request.cookies.get('token') ? request.cookies.get('token').value : null;
    const { pathname } = request.nextUrl;
    console.log('path' + pathname);
    console.log(token);
    // 🛑 No token, trying to access protected routes → redirect to /login
    if (!token) {
        if (
            pathname.startsWith('/dashboard') ||
            pathname.startsWith('/admin') ||
            pathname.startsWith('/products')
        ) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const user = verifyToken(token);

        // ✅ If admin → allow access to all
        if (user.role === 'admin') {
            return NextResponse.next();
        }

        // 👤 If user → only allow /products
        if (user.role === 'user') {
            if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
                return NextResponse.redirect(new URL('/', request.url));
            }
            if (pathname.startsWith('/products')) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL('/', request.url));
        }

        // 🚫 Unknown or missing role → redirect to home
        return NextResponse.redirect(new URL('/', request.url));

    } catch (err) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// 👇 Apply middleware only to these routes
export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/products/:path*'],
};