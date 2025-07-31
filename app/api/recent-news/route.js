import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../lib/jwt'; // Your JWT verification utility
import clientPromise from '../../../lib/mongodb'; // Your MongoDB connection utility
import { uploadImageToCloudinary } from '../../../lib/cloudinary'; // Your Cloudinary upload utility
import { checkAuthAndAdmin } from '../../../lib/checkAuthAndAdmin';

// GET request handler to fetch all news articles
export async function GET(request) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const searchQuery = searchParams.get('search') || '';
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // Replace with your database name
        const newsCollection = db.collection("news"); // 'news' collection

        let query = {};
        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search by title
        }

        const total = await newsCollection.countDocuments(query);
        const news = await newsCollection.find(query)
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .skip(skip)
            .limit(limit)
            .toArray();

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: 'News fetched successfully!',
            data: news,
            total,
            totalPages,
            page,
            limit
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json({
            message: 'Error fetching news.',
            error: error.message
        }, { status: 500 });
    }
}

// POST request handler to create a new news article
export async function POST(request) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }
    try {
        const formData = await request.formData();

        const title = formData.get('title');
        const description = formData.get('description');
        const newsImage = formData.get('newsImage'); // File object

        if (!title || !description || !newsImage) {
            return NextResponse.json({ message: 'All fields (title, description, newsImage) are required.' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await newsImage.arrayBuffer());
        const imageName = newsImage.name;

        const imageUrl = await uploadImageToCloudinary(imageBuffer, imageName, 'news'); // Specify a folder for news images

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // Replace with your database name
        const newsCollection = db.collection("news");

        const newArticle = {
            title,
            description,
            image: imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await newsCollection.insertOne(newArticle);

        return NextResponse.json({
            message: 'News article added successfully!',
            newsId: result.insertedId,
            article: newArticle
        }, { status: 201 });

    } catch (error) {
        console.error('Error adding news article:', error);
        return NextResponse.json({
            message: 'Error adding news article.',
            error: error.message
        }, { status: 500 });
    }
}