// app/api/products/cart/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const { ids } = await request.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'Invalid or empty array of product IDs.' }, { status: 400 });
        }

        const objectIds = ids.map(id => {
            if (ObjectId.isValid(id)) {
                return new ObjectId(id);
            }
            return null;
        }).filter(id => id !== null);

        if (objectIds.length === 0) {
            return NextResponse.json({ message: 'No valid product IDs provided.' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("E-commerceDB");
        const productsCollection = db.collection("products");

        const products = await productsCollection.find({ _id: { $in: objectIds } }).toArray();

        return NextResponse.json({
            message: 'Products fetched successfully!',
            data: products
        }, { status: 200 });

    } catch (error) {
        console.error('Error fetching cart products:', error);
        return NextResponse.json({
            message: 'Error fetching products.',
            error: error.message
        }, { status: 500 });
    }
}