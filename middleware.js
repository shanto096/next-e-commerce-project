import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
    const token = request.cookies.get('token') ? request.cookies.get('token').value : null;
    const { pathname } = request.nextUrl;

    if (!token) {
        // Protect dashboard & admin pages
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        const user = verifyToken(token);

        // Prevent non-admins from accessing /admin
        if (pathname.startsWith('/admin') && user.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        return NextResponse.next();
    } catch (e) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', ],
};