// app/create-product/page.js
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এতে ইন্টারঅ্যাকটিভিটি আছে।

import { useState } from 'react';
import Link from 'next/link';

// প্রোডাক্ট তৈরি করার পেজ কম্পোনেন্ট
export default function CreateProductPage() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState(''); // মেসেজ স্টেট (সফলতা বা ত্রুটি বার্তা দেখানোর জন্য)
  const [loading, setLoading] = useState(false); // লোডিং স্টেট

  // ফর্ম সাবমিট হ্যান্ডলার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault(); // ফর্মের ডিফল্ট সাবমিট আচরণ বন্ধ করা
    setLoading(true); // লোডিং শুরু
    setMessage(''); // পূর্বের মেসেজ পরিষ্কার করা

    // প্রয়োজনীয় ফিল্ডগুলো যাচাই করুন
    if (!name || !title || !category || !description) {
      setMessage('অনুগ্রহ করে সমস্ত ফিল্ড পূরণ করুন।');
      setLoading(false);
      return;
    }

    try {
      // /api/products এপিআইতে POST রিকোয়েস্ট পাঠানো
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, title, category, description }), // প্রোডাক্ট ডেটা JSON ফরম্যাটে পাঠানো
      });

      const data = await response.json(); // রেসপন্স JSON ফরম্যাটে পার্স করা

      if (response.ok) {
        // যদি রেসপন্স সফল হয় (স্ট্যাটাস 2xx)
        setMessage(`প্রোডাক্ট সফলভাবে তৈরি হয়েছে! ID: ${data.productId}`);
        // ফর্ম পরিষ্কার করা
        setName('');
        setTitle('');
        setCategory('');
        setDescription('');
      } else {
        // যদি রেসপন্স ব্যর্থ হয় (স্ট্যাটাস 4xx বা 5xx)
        setMessage(`প্রোডাক্ট তৈরি ব্যর্থ হয়েছে: ${data.message || 'কিছু ভুল হয়েছে।'}`);
      }
    } catch (error) {
      // নেটওয়ার্ক ত্রুটি বা অন্য কোনো ত্রুটি হলে
      console.error('প্রোডাক্ট তৈরি করার সময় ত্রুটি:', error);
      setMessage('একটি ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4 sm:p-6">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-2xl transform transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">নতুন প্রোডাক্ট তৈরি করুন</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">প্রোডাক্টের নাম:</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">শিরোনাম:</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">ক্যাটাগরি:</label>
            <input
              type="text"
              id="category"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">বর্ণনা:</label>
            <textarea
              id="description"
              rows="4"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={loading}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            disabled={loading}
          >
            {loading ? 'প্রোডাক্ট তৈরি হচ্ছে...' : 'প্রোডাক্ট তৈরি করুন'}
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center text-md font-semibold ${message.includes('সফলভাবে') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/products" className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
            সমস্ত প্রোডাক্ট দেখুন
          </Link>
        </p>
      </div>
    </div>
  );
}
