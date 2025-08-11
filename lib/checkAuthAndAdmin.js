const { cookies } = require("next/headers");
const { verifyToken } = require("./jwt");

export async function checkAuthAndAdmin(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt');

    if (!token) {
        return { authorized: false, message: 'Authentication required', status: 401 };
    }

    let decoded;
    try {
        decoded = await verifyToken(token.value);
    } catch (error) {
        console.error('JWT verification failed:', error);
        return { authorized: false, message: 'Invalid or expired token', status: 401 };
    }

    if (decoded.role !== 'admin') {
        return { authorized: false, message: 'Access forbidden: Admin privilege required', status: 403 };
    }
    return { authorized: true, decoded };
}

export async function checkAuth(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt');

    if (!token) {
        return { authorized: false, message: 'Authentication required', status: 401 };
    }

    let decoded;
    try {
        decoded = await verifyToken(token.value);
    } catch (error) {
        console.error('JWT verification failed:', error);
        return { authorized: false, message: 'Invalid or expired token', status: 401 };
    }
    return { authorized: true, decoded };
}