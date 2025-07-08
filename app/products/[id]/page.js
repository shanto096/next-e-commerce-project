// app/product/[id]/page.js
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এতে ইন্টারঅ্যাকটিভিটি আছে।

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // URL প্যারামিটার থেকে আইডি পাওয়ার জন্য
import Link from 'next/link'; // নেভিগেশনের জন্য Link কম্পোনেন্ট
// import Image from 'next/image'; // ইমেজ কম্পোনেন্ট আপাতত প্রয়োজন নেই
// একক প্রোডাক্টের বিস্তারিত পেজ কম্পোনেন্ট
export default function SingleProductPage() {
  const { id } = useParams(); // URL থেকে প্রোডাক্ট আইডি গ্রহণ করা
  const [product, setProduct] = useState(null); // প্রোডাক্ট ডেটা সংরক্ষণের জন্য স্টেট
  const [loading, setLoading] = useState(true); // লোডিং স্টেট
  const [error, setError] = useState(null); // ত্রুটি মেসেজ সংরক্ষণের জন্য স্টেট

  useEffect(() => {
    // আইডি থাকলে ডেটা ফেচ করার ফাংশন কল করা
    if (id) {
      fetchProduct();
    }
  }, [id]); // আইডি পরিবর্তন হলে useEffect আবার চলবে

  const fetchProduct = async () => {
    setLoading(true); // লোডিং শুরু
    setError(null); // পূর্বের ত্রুটি পরিষ্কার করা

    try {
      // /api/products/[id] এপিআইতে GET রিকোয়েস্ট পাঠানো
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json(); // রেসপন্স JSON ফরম্যাটে পার্স করা

      if (response.ok) {
        // যদি রেসপন্স সফল হয় (স্ট্যাটাস 2xx)
        setProduct(data.data); // প্রোডাক্ট ডেটা সেট করা
      } else {
        // যদি রেসপন্স ব্যর্থ হয় (স্ট্যাটাস 4xx বা 5xx)
        setError(data.message || 'Failed to fetch product.');
        setProduct(null); // প্রোডাক্ট ডেটা পরিষ্কার করা
      }
    } catch (err) {
      // নেটওয়ার্ক ত্রুটি বা অন্য কোনো ত্রুটি হলে
      console.error('Error fetching product:', err);
      setError('An error occurred while fetching the product. Please try again.');
      setProduct(null); // প্রোডাক্ট ডেটা পরিষ্কার করা
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
        <p className="text-2xl font-semibold text-gray-700 animate-pulse">প্রোডাক্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
        <p className="text-2xl text-red-700 font-bold">{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl text-gray-700 font-semibold">প্রোডাক্ট পাওয়া যায়নি।</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:p-8">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row gap-8 md:gap-12 animate-fade-in">
        {/* প্রোডাক্ট ইমেজ সেকশন প্রয়োজন নেই, তাই এটি বাদ দেওয়া হয়েছে */}

        {/* প্রোডাক্টের বিস্তারিত তথ্য সেকশন */}
        <div className="md:w-1/2 flex flex-col justify-center text-gray-800">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{product.title}</h1>
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">{product.name}</h2>
          <p className="text-lg text-gray-600 mb-4">
            <span className="font-bold text-gray-700">ক্যাটাগরি:</span> {product.category}
          </p>
          <p className="text-gray-800 leading-relaxed text-base sm:text-lg mb-6">
            <span className="font-bold text-gray-700">বর্ণনা:</span> {product.description}
          </p>
          <div className="text-sm text-gray-500 border-t pt-4 mt-4">
            <p className="mb-1">যোগ করা হয়েছে: <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</span></p>
            <p>শেষ আপডেট: <span className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</span></p>
          </div>
          <div className="mt-8">
            <Link href="/products" passHref className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1">
              <span className="font-semibold text-lg">সমস্ত প্রোডাক্ট দেখুন</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Link href="/" passHref className="text-blue-600 hover:text-blue-800 font-medium text-lg transition duration-150 ease-in-out">
          হোমপেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}
