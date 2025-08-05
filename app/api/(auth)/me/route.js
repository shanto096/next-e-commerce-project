import { verifyToken } from '../../../../lib/jwt';
import { NextResponse } from 'next/server';


export async function GET(req) {
    const token = req.cookies.get('jwt')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const user = verifyToken(token);
        return NextResponse.json(user);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}