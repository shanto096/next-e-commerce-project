import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../lib/jwt'; // Your JWT verification utility
import clientPromise from '../../../lib/mongodb'; // Your MongoDB connection utility
import { uploadImageToCloudinary } from '../../../lib/cloudinary'; // Your Cloudinary upload utility
import checkAuthAndAdmin from '../../../lib/checkAuthAndAdmin'; // Import the new helper

// GET request handler to fetch all news articles
export async function GET(request) {
    // No auth check needed for public GET /api/news unless specified.
    // If you want to restrict this GET to admins, uncomment the lines below.
    /*
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }
    */
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const searchQuery = searchParams.get('search') || '';
        const statusFilter = searchParams.get('status'); // New: Get status filter
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // Replace with your database name
        const newsCollection = db.collection("news"); // 'news' collection

        let query = {};
        if (searchQuery) {
            query.title = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search by title
        }
        // Apply status filter if provided and valid
        if (statusFilter && (statusFilter === 'active' || statusFilter === 'not active')) {
            query.status = statusFilter;
        } else {
            // By default, only fetch 'active' news for public facing endpoints
            // If this GET is only for admin, you might remove this line
            // or set a default to show all unless a filter is specified.
            // For general public consumption, it's common to only show active.
            // If you want admin to see all by default, remove this line.
            query.status = 'active'; // Default to active for public display
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
    // const authResult = await checkAuthAndAdmin();
    // if (!authResult.authorized) {
    //     return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    // }

    try {
        const formData = await request.formData();

        const title = formData.get('title');
        const description = formData.get('description');
        const newsImage = formData.get('newsImage'); // File object
        const status = formData.get('status') || 'active'; // New: Get status from form, default to 'active'

        if (!title || !description || !newsImage) { // Status is now part of the form, but will default if not provided
            return NextResponse.json({ message: 'Title, description, and newsImage are required.' }, { status: 400 });
        }
        // Validate status explicitly if you only allow 'active' or 'not active'
        if (status !== 'active' && status !== 'not active') {
            return NextResponse.json({ message: 'Invalid status provided. Must be "active" or "not active".' }, { status: 400 });
        }


        const imageBuffer = Buffer.from(await newsImage.arrayBuffer());
        const imageName = newsImage.name; // Use name for Cloudinary format inference, or MIME type

        const imageUrl = await uploadImageToCloudinary(imageBuffer, newsImage.type, 'news'); // Use MIME type for robust format inference

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // Replace with your database name
        const newsCollection = db.collection("news");

        const newArticle = {
            title,
            description,
            image: imageUrl,
            status, // Save the status
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