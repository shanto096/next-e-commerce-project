import { checkAuth, checkAuthAndAdmin } from "../../../lib/checkAuthAndAdmin";
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request) {
    const authResult = await checkAuth(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }


    try {
        const { email, message, subject } = await request.json();
        const user = authResult.user;
        const userEmailFromToken = authResult.email;

        // Check if the email from the request body matches the logged-in user's email
        if (email !== userEmailFromToken) {
            return NextResponse.json({ message: "Email in the form does not match the logged-in user's email." }, { status: 403 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const messageCollection = db.collection("message");
        const newMessage = {
            userId: authResult.userId,
            email,
            message,
            subject,
            status: "pending",
            createdAt: new Date()
        };
        const result = await messageCollection.insertOne(newMessage);
        return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to send message" }, { status: 500 });
    }
}

export async function GET(request) {
    const authResult = await checkAuthAndAdmin(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: "Unauthorized or not an admin." }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const searchQuery = searchParams.get('search') || '';
        const statusFilter = searchParams.get('status') || '';

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const messageCollection = db.collection("message");

        let query = {};
        if (searchQuery) {
            query.$or = [
                { email: { $regex: searchQuery, $options: 'i' } },
                { subject: { $regex: searchQuery, $options: 'i' } },
                { message: { $regex: searchQuery, $options: 'i' } },
            ];
        }
        if (statusFilter) {
            query.status = statusFilter;
        }

        const totalMessages = await messageCollection.countDocuments(query);
        const totalPages = Math.ceil(totalMessages / limit);

        const messages = await messageCollection
            .find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        return NextResponse.json({ data: messages, totalPages, currentPage: page }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
    }
}

export async function DELETE(request) {
    const authResult = await checkAuthAndAdmin(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: "Unauthorized or not an admin." }, { status: 403 });
    }

    try {
        const { messageId } = await request.json();
        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const messageCollection = db.collection("message");

        const result = await messageCollection.deleteOne({ _id: new ObjectId(messageId) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: "Message not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Message deleted successfully." }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete message." }, { status: 500 });
    }
}