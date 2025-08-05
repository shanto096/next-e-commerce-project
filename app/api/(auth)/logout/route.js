import { NextResponse } from 'next/server';

export async function POST() {
    // Clear the JWT cookie by setting it to an expired date
    const response = NextResponse.json({ message: 'Logged out successfully.' }, { status: 200 });

    response.headers.set('Set-Cookie', 'jwt=; Max-Age=0; path=/; HttpOnly;');
    return response;
}