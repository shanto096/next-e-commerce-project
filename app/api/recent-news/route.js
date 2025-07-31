// app/api/news/route.js
import { NextResponse } from 'next/server';

import clientPromise from '../../../lib/mongodb';
import { uploadImageToCloudinary } from '../../../lib/cloudinary';
import { checkAuthAndAdmin } from '../../../lib/checkAuthAndAdmin';


// GET request handler to fetch all news articles
export async function GET(request) {
    // const authResult = await checkAuthAndAdmin();
    // if (!authResult.authorized) {
    //     return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    // }

    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const searchQuery = searchParams.get('search') || '';
        const statusFilter = searchParams.get('status'); // Get status filter from query param
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const newsCollection = db.collection("news");

        let query = {};
        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search by title
        }

        // --- MODIFIED LOGIC HERE ---
        // If statusFilter is 'active' or 'not active', apply the filter.
        // If statusFilter is empty/null/undefined (representing "All Statuses"),
        // DO NOT add a status to the query, which will fetch all documents.
        if (statusFilter === 'active' || statusFilter === 'not active') {
            query.status = statusFilter;
        }
        // If statusFilter is '', it means "All Statuses", so no 'status' field is added to the query.
        // This will allow `newsCollection.find(query)` to return documents regardless of their 'status' field.
        // --- END MODIFIED LOGIC ---

        const total = await newsCollection.countDocuments(query);
        const news = await newsCollection.find(query)
            .sort({ createdAt: -1 })
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

// POST request handler (No changes needed for this specific request based on your current request)
export async function POST(request) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const formData = await request.formData();

        const title = formData.get('title');
        const description = formData.get('description');
        const newsImage = formData.get('newsImage');
        const status = formData.get('status') || 'active';

        if (!title || !description || !newsImage) {
            return NextResponse.json({ message: 'Title, description, and newsImage are required.' }, { status: 400 });
        }
        if (status !== 'active' && status !== 'not active') {
            return NextResponse.json({ message: 'Invalid status provided. Must be "active" or "not active".' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await newsImage.arrayBuffer());
        const imageUrl = await uploadImageToCloudinary(imageBuffer, newsImage.type, 'news');

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const newsCollection = db.collection("news");

        const newArticle = {
            title,
            description,
            image: imageUrl,
            status,
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