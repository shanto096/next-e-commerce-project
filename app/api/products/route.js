import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // ObjectId ইম্পোর্ট করুন
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../../../lib/cloudinary';
import { checkAuthAndAdmin } from '../../../lib/checkAuthAndAdmin';

// GET: পণ্য তালিকা আনা এবং ফিল্টার করা
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const searchQuery = searchParams.get('search') || '';
        const categoryFilter = searchParams.get('category') || 'All';
        const trendingStatus = searchParams.get('isTrending') || 'All'; // নতুন Trending Status ফিল্টার
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        let query = {};

        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' };
        }

        if (categoryFilter && categoryFilter !== 'All') {
            query.category = categoryFilter;
        }

        // নতুন Trending Status ফিল্টার লজিক যোগ করা হয়েছে
        if (trendingStatus !== 'All') {
            query.isTrending = trendingStatus === 'Trending';
        }

        const total = await productsCollection.countDocuments(query);
        const products = await productsCollection.find(query)
            .skip(skip)
            .limit(limit)
            .toArray();
        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            message: 'Products fetched successfully!',
            data: products,
            total,
            totalPages,
            page,
            limit
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            message: 'Error fetching products.',
            error: error.message
        }, { status: 500 });
    }
}

// POST: নতুন পণ্য যোগ করা
export async function POST(request) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const formData = await request.formData();

        const name = formData.get('name');
        const title = formData.get('title');
        const category = formData.get('category');
        const description = formData.get('description');
        const price = formData.get('price');
        const quantity = formData.get('quantity'); // নতুন Quantity ফিল্ড
        const unit = formData.get('unit'); // নতুন Unit ফিল্ড
        const isTrending = formData.get('isTrending') === 'true'; // নতুন Trending Status ফিল্ড
        const productImage = formData.get('productImage');

        if (!name || !title || !category || !description || !price || !productImage || !quantity || !unit) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        const imageBuffer = Buffer.from(await productImage.arrayBuffer());
        const imageName = productImage.name;

        const imageUrl = await uploadImageToCloudinary(imageBuffer, imageName);

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        const newProduct = {
            name,
            title,
            category,
            description,
            price: parseFloat(price),
            quantity: parseFloat(quantity), // Quantity কে number এ রূপান্তর করা হয়েছে
            unit,
            isTrending,
            productImage: imageUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await productsCollection.insertOne(newProduct);

        return NextResponse.json({
            message: 'Product added successfully!',
            productId: result.insertedId,
            product: newProduct
        }, { status: 201 });

    } catch (error) {
        console.error('Error adding product:', error);
        return NextResponse.json({
            message: 'Error adding product.',
            error: error.message
        }, { status: 500 });
    }
}