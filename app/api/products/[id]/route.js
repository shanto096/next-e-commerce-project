import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // ObjectId ইম্পোর্ট করুন
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '../../../../lib/cloudinary';
import { checkAuthAndAdmin } from '../../../../lib/checkAuthAndAdmin';


// GET: নির্দিষ্ট ID দ্বারা পণ্য আনা
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        const product = await productsCollection.findOne({ _id: new ObjectId(id) });

        if (!product) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
        }

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

// PUT: একটি নির্দিষ্ট পণ্য আপডেট করা
export async function PUT(request, { params }) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }

    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        const formData = await request.formData();

        const name = formData.get('name');
        const title = formData.get('title');
        const category = formData.get('category');
        const description = formData.get('description');
        const price = formData.get('price');
        const quantity = formData.get('quantity');
        const unit = formData.get('unit');
        const isTrending = formData.get('isTrending') === 'true';
        const productImage = formData.get('productImage');

        if (!name || !title || !category || !description || !price || !quantity || !unit) {
            return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        const updateFields = {
            name,
            title,
            category,
            description,
            price: parseFloat(price),
            quantity: parseFloat(quantity),
            unit,
            isTrending,
            updatedAt: new Date(),
        };

        if (productImage && productImage instanceof File && productImage.size > 0) {
            const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) });

            if (existingProduct && existingProduct.productImage) {
                await deleteImageFromCloudinary(existingProduct.productImage);
            }

            const imageBuffer = Buffer.from(await productImage.arrayBuffer());
            const imageMimeType = productImage.type;
            const newImageUrl = await uploadImageToCloudinary(imageBuffer, imageMimeType);

            updateFields.productImage = newImageUrl;
        }

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


// DELETE: একটি নির্দিষ্ট পণ্য ডিলিট করা
export async function DELETE(request, { params }) {
    const authResult = await checkAuthAndAdmin();
    if (!authResult.authorized) {
        return NextResponse.json({ message: authResult.message }, { status: authResult.status });
    }
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: 'Invalid product ID format.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        const productToDelete = await productsCollection.findOne({ _id: new ObjectId(id) });

        if (!productToDelete) {
            return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
        }

        if (productToDelete.productImage) {
            await deleteImageFromCloudinary(productToDelete.productImage);
        }

        const result = await productsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json({ message: 'Product not found or already deleted.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product deleted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ message: 'Error deleting product.', error: error.message }, { status: 500 });
    }
}