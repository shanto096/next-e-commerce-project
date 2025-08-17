import { checkAuthAndAdmin } from "../../../lib/checkAuthAndAdmin";
import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request) {
    const authResult = await checkAuthAndAdmin(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: "Unauthorized or not an admin." }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const messageCollection = db.collection("message");

        const allMessages = await messageCollection.find({}).sort({ createdAt: -1 }).toArray();
        const pendingMessagesCount = allMessages.filter(msg => msg.status === "pending").length;

        return NextResponse.json({ count: pendingMessagesCount, notifications: allMessages }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
        return NextResponse.json({ message: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function PATCH(request) {
    const authResult = await checkAuthAndAdmin(request);
    if (!authResult.authorized) {
        return NextResponse.json({ message: "Unauthorized or not an admin." }, { status: 403 });
    }

    try {
        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const messageCollection = db.collection("message");

        const result = await messageCollection.updateMany({ status: "pending" }, { $set: { status: "read" } });

        return NextResponse.json({ message: "All pending messages marked as read.", modifiedCount: result.modifiedCount }, { status: 200 });
    } catch (error) {
        console.error("Failed to update notification status:", error);
        return NextResponse.json({ message: "Failed to update notification status." }, { status: 500 });
    }
}