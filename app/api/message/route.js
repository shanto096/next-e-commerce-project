import { checkAuth } from "../../../lib/checkAuthAndAdmin";
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    const authResult = await checkAuth(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }


    try {
        const { email, message, subject } = await request.json();
        const user = authResult.user;
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