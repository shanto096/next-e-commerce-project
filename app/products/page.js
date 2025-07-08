// app/products/page.js
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এতে ইন্টারঅ্যাকটিভিটি আছে।

import { useEffect, useState } from 'react';
import Link from 'next/link'; // নেভিগেশনের জন্য Link কম্পোনেন্ট

// import Image from 'next/image'; // ইমেজ কম্পোনেন্ট আপাতত প্রয়োজন নেই
import { useRouter } from 'next/navigation';
// সমস্ত প্রোডাক্টের পেজ কম্পোনেন্ট
export default function AllProductsPage() {
  const [products, setProducts] = useState([]); // প্রোডাক্ট ডেটা সংরক্ষণের জন্য স্টেট
  const [loading, setLoading] = useState(true); // লোডিং স্টেট
  const [error, setError] = useState(null); // ত্রুটি মেসেজ সংরক্ষণের জন্য স্টেট

  useEffect(() => {
    fetchProducts(); // কম্পোনেন্ট মাউন্ট হওয়ার পর প্রোডাক্ট ফেচ করা
  }, []);

  const fetchProducts = async () => {
    setLoading(true); // লোডিং শুরু
    setError(null); // পূর্বের ত্রুটি পরিষ্কার করা

    try {
      // /api/products এপিআইতে GET রিকোয়েস্ট পাঠানো
      const response = await fetch('/api/products');
      const data = await response.json(); // রেসপন্স JSON ফরম্যাটে পার্স করা

      if (response.ok) {
        // যদি রেসপন্স সফল হয় (স্ট্যাটাস 2xx)
        setProducts(data.data); // প্রোডাক্ট ডেটা সেট করা
      } else {
        // যদি রেসপন্স ব্যর্থ হয় (স্ট্যাটাস 4xx বা 5xx)
        setError(data.message || 'Failed to fetch products.');
        setProducts([]); // প্রোডাক্ট ডেটা পরিষ্কার করা
      }
    } catch (err) {
      // নেটওয়ার্ক ত্রুটি বা অন্য কোনো ত্রুটি হলে
      console.error('Error fetching products:', err);
      setError('An error occurred while fetching products. Please try again.');
      setProducts([]); // প্রোডাক্ট ডেটা পরিষ্কার করা
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">প্রোডাক্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100 p-4">
        <p className="text-xl text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-10">আমাদের সমস্ত প্রোডাক্ট</h1>

        {products.length === 0 ? (
          <div className="text-center text-xl text-gray-700">কোনো প্রোডাক্ট পাওয়া যায়নি।</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product._id} href={`/products/${product._id}`} passHref>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer flex flex-col h-full">
                  {/* ইমেজ সেকশন প্রয়োজন নেই, তাই এটি বাদ দেওয়া হয়েছে */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.title}</h2>
                    <p className="text-md text-gray-600 mb-3">{product.name}</p>
                    <p className="text-sm text-gray-500 mb-4 flex-grow">ক্যাটাগরি: {product.category}</p>
                    <button className="mt-auto w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
                      বিস্তারিত দেখুন
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
