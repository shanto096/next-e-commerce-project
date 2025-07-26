import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';

export async function GET(req) {
    const token = req.cookies.get('token') ? req.cookies.get('token').value : null;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const user = verifyToken(token);
        return NextResponse.json(user);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}