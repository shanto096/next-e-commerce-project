import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import { verifyToken } from '../../../../lib/jwt';
import clientPromise from '../../../../lib/mongodb';
import checkAuthAndAdmin from '../../../../lib/checkAuthAndAdmin';
// Make sure these are properly implemented in your lib/cloudinary.js
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../../../../lib/cloudinary';



// GET request handler to fetch a single news article by ID
export async function GET(request, { params }) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }
    try {
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid News ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const newsCollection = db.collection("news");

        const newsArticle = await newsCollection.findOne({ _id: new ObjectId(id) });

        if (!newsArticle) {
            return NextResponse.json({ message: 'News article not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'News article fetched successfully!',
            data: newsArticle
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching news article:', error);
        return NextResponse.json({
            message: 'Error fetching news article.',
            error: error.message
        }, { status: 500 });
    }
}

// PUT request handler to update a news article by ID
export async function PUT(request, { params }) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const { id } = await params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid News ID' }, { status: 400 });
        }

        const formData = await request.formData();
        const title = formData.get('title');
        const description = formData.get('description');
        const newsImage = formData.get('newsImage'); // This will be a File object if updated, or null/undefined if not

        if (!title || !description) {
            return NextResponse.json({ message: 'Title and description are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const newsCollection = db.collection("news");

        const updateData = {
            title,
            description,
            updatedAt: new Date(),
        };

        // Handle image update
        if (newsImage && newsImage instanceof File && newsImage.size > 0) {
            const existingArticle = await newsCollection.findOne({ _id: new ObjectId(id) });

            if (existingArticle && existingArticle.image) {
                // Delete old image from Cloudinary using the full URL
                await deleteImageFromCloudinary(existingArticle.image);
            }

            const imageBuffer = Buffer.from(await newsImage.arrayBuffer());
            const imageMimeType = newsImage.type;
            const imageUrl = await uploadImageToCloudinary(imageBuffer, imageMimeType, 'news-articles'); // Use a consistent folder
            updateData.image = imageUrl;
        }

        const result = await newsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'News article not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'News article updated successfully!',
            modifiedCount: result.modifiedCount
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating news article:', error);
        return NextResponse.json({
            message: 'Error updating news article.',
            error: error.message
        }, { status: 500 });
    }
}

// DELETE request handler to delete a news article by ID
export async function DELETE(request, { params }) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const { id } = params;
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid News ID' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const newsCollection = db.collection("news");

        const newsArticleToDelete = await newsCollection.findOne({ _id: new ObjectId(id) });

        if (!newsArticleToDelete) {
            return NextResponse.json({ message: 'News article not found' }, { status: 404 });
        }

        // Delete image from Cloudinary before deleting the record using the full URL
        if (newsArticleToDelete.image) {
            await deleteImageFromCloudinary(newsArticleToDelete.image);
        }

        const result = await newsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'News article not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'News article deleted successfully!',
            deletedCount: result.deletedCount
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting news article:', error);
        return NextResponse.json({
            message: 'Error deleting news article.',
            error: error.message
        }, { status: 500 });
    }
}