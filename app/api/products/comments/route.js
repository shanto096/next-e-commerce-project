// app/api/comments/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';; // এখানে আপনার অথেন্টিকেশন লজিক যোগ করা যেতে পারে
import { checkAuth } from '../../../../lib/checkAuthAndAdmin';
// GET: পণ্য ID দিয়ে কমেন্ট আনা
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId || !ObjectId.isValid(productId)) {
            return NextResponse.json({ message: 'Invalid product ID.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const commentsCollection = db.collection("comments");

        const productComments = await commentsCollection.find({ productId: new ObjectId(productId) }).toArray();

        return NextResponse.json(productComments, { status: 200 });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ message: 'Error fetching comments.', error: error.message }, { status: 500 });
    }
}

// POST: নতুন কমেন্ট যোগ করা
export async function POST(request) {
    // এখানে অথেন্টিকেশন চেক করা যেতে পারে
    const authResult = await checkAuth(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const newComment = await request.json();
        const { productId, rating, text } = newComment;

        if (!productId || !ObjectId.isValid(productId) || !rating || !text) {
            return NextResponse.json({ message: 'Missing required fields or invalid product ID.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const commentsCollection = db.collection("comments");

        const commentToInsert = {
            ...newComment,
            productId: new ObjectId(productId),
            userId: new ObjectId(authResult.userId), // Authenticated user ID ব্যবহার করা হয়েছে
            userName: authResult.userName, // Authenticated user name ব্যবহার করা হয়েছে
            date: new Date(),
        };

        const result = await commentsCollection.insertOne(commentToInsert);

        const insertedComment = {
            ...commentToInsert,
            _id: result.insertedId,
        };

        return NextResponse.json(insertedComment, { status: 201 });

    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ message: 'Error adding comment.', error: error.message }, { status: 500 });
    }
}