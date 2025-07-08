// lib/mongodb.js
import { MongoClient } from 'mongodb';

// MongoDB সংযোগের URI আপনার .env.local ফাইলে সংরক্ষণ করুন।
// উদাহরণ: MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

// যদি MongoDB URI সেট না থাকে, তাহলে একটি ত্রুটি নিক্ষেপ করুন।
if (!uri) {
    throw new Error('Please add your Mongo URI to .env.local');
}

// ডেভেলপমেন্ট মোডে গ্লোবাল ভেরিয়েবল ব্যবহার করে হট-রিলোডিং এর সময় নতুন সংযোগ এড়ানো।
if (process.env.NODE_ENV === 'development') {
    // গ্লোবাল ভেরিয়েবলে ক্লায়েন্ট ক্যাশ করুন।
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // প্রোডাকশন মোডে নতুন ক্লায়েন্ট তৈরি করুন।
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// ক্লায়েন্ট প্রমিস এক্সপোর্ট করুন, যাতে এটি আপনার এপিআই রুট থেকে ব্যবহার করা যায়।
export default clientPromise;