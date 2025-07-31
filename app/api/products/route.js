import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { uploadImageToCloudinary } from '../../../lib/cloudinary';
import { checkAuthAndAdmin } from '../../../lib/checkAuthAndAdmin';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const searchQuery = searchParams.get('search') || ''; // Get search query
        const categoryFilter = searchParams.get('category') || ''; // Get category filter
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        let query = {};

        // If search query exists, add it to the query
        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' }; // Case-insensitive search by name
        }

        // If category filter exists, add it to the query
        if (categoryFilter && categoryFilter !== 'All') { // Assuming 'All' is used to show all categories
            query.category = categoryFilter;
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
        const productImage = formData.get('productImage');

        if (!name || !title || !category || !description || !price || !productImage) {
            return NextResponse.json({ message: 'All fields (name, title, category, description, price, productImage) are required.' }, { status: 400 });
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