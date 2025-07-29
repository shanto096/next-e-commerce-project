// app/api/products/[id]/route.js
import { NextResponse } from 'next/server';
// MongoDB ক্লায়েন্ট ইম্পোর্ট করুন
import { ObjectId } from 'mongodb'; // ObjectId ইম্পোর্ট করুন ID দ্বারা খোঁজার জন্য
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../../../../lib/cloudinary'; // Cloudinary আপলোড ও ডিলিট ইউটিলিটি
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';
import { cookies } from 'next/headers';

// GET রিকোয়েস্ট হ্যান্ডেল করার জন্য একটি অ্যাসিঙ্ক্রোনাস ফাংশন।
// এই এপিআই /api/products/[id] পাথে অ্যাক্সেস করা যাবে এবং একটি নির্দিষ্ট প্রোডাক্ট ফিরিয়ে দেবে।
export async function GET(request, { params }) {
    try {
        const { id } = params; // URL থেকে আইডি প্যারামিটার গ্রহণ করুন

        // আইডি একটি বৈধ ObjectId কিনা তা যাচাই করুন।
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
        const productsCollection = db.collection("products"); // 'products' কালেকশন ব্যবহার করুন

        // আইডি দ্বারা একটি নির্দিষ্ট প্রোডাক্ট খুঁজুন।
        const product = await productsCollection.findOne({ _id: new ObjectId(id) });

        // যদি প্রোডাক্ট না পাওয়া যায়।
        if (!product) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 }); // 404 Not Found
        }

        // সফল JSON রেসপন্স ফিরিয়ে দিন।
        return NextResponse.json({
            message: 'Product fetched successfully!',
            data: product
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching single product:', error);
        return NextResponse.json({
            message: 'Error fetching product.',
            error: error.message
        }, { status: 500 });
    }
}

// PUT: Update a product by ID
/**
 * Next.js API Route handler for PUT requests to /api/products/[id].
 * Handles product updates, including image upload/deletion to Cloudinary and
 * updating product data in MongoDB.
 *
 * @param {import('next/server').NextRequest} request - The incoming Next.js request object.
 * @param {{ params: { id: string } }} context - The context object containing route parameters.
 * @returns {Promise<import('next/server').NextResponse>} - The Next.js response object.
 */
export async function PUT(request, { params }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt'); // 'jwt' নামের কুকি থেকে টোকেন নেওয়া হচ্ছে

    // ১. টোকেন আছে কিনা চেক করুন
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
        // ২. টোকেন ভেরিফাই করুন।
        decoded = await verifyToken(token.value);
    } catch (error) {
        console.error('API PUT - JWT verification failed:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // ৩. রোল চেক করুন (উদাহরণস্বরূপ, শুধু অ্যাডমিনরা প্রোডাক্ট আপডেট করতে পারবে)
    if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin privilege required' }, { status: 403 });
    }

    try {
        const { id } = params;

        // প্রোডাক্ট ID এর ফরম্যাট যাচাই করুন
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        // FormData থেকে সরাসরি ডেটা পার্স করুন Next.js এর request.formData() ব্যবহার করে
        const formData = await request.formData();

        // FormData থেকে ফিল্ডগুলো নিন
        const name = formData.get('name');
        const title = formData.get('title');
        const category = formData.get('category');
        const description = formData.get('description');
        const price = formData.get('price');
        const productImage = formData.get('productImage'); // নতুন ফাইল অবজেক্ট (যদি থাকে)

        // প্রয়োজনীয় টেক্সট ফিল্ডগুলো আছে কিনা তা যাচাই করুন।
        // ছবির ফিল্ড ঐচ্ছিক কারণ এটি নাও আপডেট হতে পারে।
        if (!name || !title || !category || !description || !price) {
            return NextResponse.json({ message: 'All text fields (name, title, category, description, price) are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB"); // আপনার ডেটাবেসের নাম দিন
        const productsCollection = db.collection("products"); // 'products' কালেকশন ব্যবহার করুন

        // আপডেটের জন্য একটি অবজেক্ট তৈরি করুন
        const updateFields = {
            name,
            title,
            category,
            description,
            price: parseFloat(price), // price কে number এ রূপান্তর করুন
            updatedAt: new Date(), // শেষ আপডেটের সময়
        };

        // যদি নতুন ছবি আপলোড করা হয়
        if (productImage && productImage instanceof File && productImage.size > 0) {
            // বর্তমান প্রোডাক্টের তথ্য আনুন পুরনো ছবির URL পাওয়ার জন্য
            const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) });

            if (existingProduct && existingProduct.productImage) {
                // Cloudinary থেকে পুরনো ছবি মুছে ফেলুন (ঐচ্ছিক, কিন্তু ভালো অভ্যাস)
                await deleteImageFromCloudinary(existingProduct.productImage);
            }

            // নতুন ছবি Cloudinary-তে আপলোড করুন
            const imageBuffer = Buffer.from(await productImage.arrayBuffer());
            const imageMimeType = productImage.type;
            const newImageUrl = await uploadImageToCloudinary(imageBuffer, imageMimeType);

            updateFields.productImage = newImageUrl; // আপডেট ফিল্ডে নতুন ছবির URL যোগ করুন
        }

        // MongoDB-তে প্রোডাক্ট আপডেট করুন
        const result = await productsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({ message: 'Error updating product.', error: error.message }, { status: 500 });
    }
}


// DELETE: Delete a product by ID
/**
 * Next.js API Route handler for DELETE requests to /api/products/[id].
 * Handles product deletion, including deleting the associated image from Cloudinary
 * and removing product data from MongoDB.
 *
 * @param {import('next/server').NextRequest} request - The incoming Next.js request object.
 * @param {{ params: { id: string } }} context - The context object containing route parameters.
 * @returns {Promise<import('next/server').NextResponse>} - The Next.js response object.
 */
export async function DELETE(request, { params }) {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt');

    // ১. টোকেন আছে কিনা চেক করুন
    if (!token) {
        return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    let decoded;
    try {
        // ২. টোকেন ভেরিফাই করুন।
        decoded = await verifyToken(token.value);
    } catch (error) {
        console.error('API DELETE - JWT verification failed:', error);
        return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    // ৩. রোল চেক করুন (উদাহরণস্বরূপ, শুধু অ্যাডমিনরা প্রোডাক্ট ডিলিট করতে পারবে)
    if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Access forbidden: Admin privilege required' }, { status: 403 });
    }

    try {
        const { id } = params;

        // প্রোডাক্ট ID এর ফরম্যাট যাচাই করুন
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        // প্রোডাক্ট ডিলিট করার আগে তার তথ্য আনুন ছবির URL পাওয়ার জন্য
        const productToDelete = await productsCollection.findOne({ _id: new ObjectId(id) });

        if (!productToDelete) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
        }

        // যদি প্রোডাক্টের সাথে একটি ছবি থাকে, তাহলে Cloudinary থেকে সেটি ডিলিট করুন
        if (productToDelete.productImage) {
            await deleteImageFromCloudinary(productToDelete.productImage);
        }

        // MongoDB থেকে প্রোডাক্ট ডিলিট করুন
        const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            // এই ক্ষেত্রে সাধারণত productToDelete না থাকলে এখানে আসবে, কিন্তু সুরক্ষার জন্য রাখা হলো।
            return NextResponse.json({ message: 'Product not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Error deleting product.', error: error.message }, { status: 500 });
    }
}