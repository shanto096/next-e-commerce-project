// app/api/comments/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { checkAuth } from '../../../../../lib/checkAuthAndAdmin'; // এখানে আপনার অথেন্টিকেশন লজিক যোগ করা যেতে পারে

// DELETE: একটি নির্দিষ্ট কমেন্ট ডিলিট করা
export async function DELETE(request, { params }) {
    const authResult = await checkAuth(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const { id } = params;

        if (!id || !ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid comment ID format.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const commentsCollection = db.collection("comments");

        // কমেন্টটি খুঁজে দেখা এবং ব্যবহারকারীর ID মিলিয়ে দেখা
        const commentToDelete = await commentsCollection.findOne({ _id: new ObjectId(id) });
        if (!commentToDelete) {
            return NextResponse.json({ message: 'Comment not found.' }, { status: 404 });
        }

        if (commentToDelete.userId.toString() !== authResult.userId.toString()) {
            return NextResponse.json({ message: 'You are not authorized to delete this comment.' }, { status: 403 });
        }

        const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Comment not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Comment deleted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ message: 'Error deleting comment.', error: error.message }, { status: 500 });
    }
}