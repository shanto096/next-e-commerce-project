// app/register/page.js
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এতে ইন্টারঅ্যাকটিভিটি আছে।

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// রেজিস্ট্রেশন পেজ কম্পোনেন্ট
export default function RegisterPage() {
  const [email, setEmail] = useState(''); // ইমেল স্টেট
  const [password, setPassword] = useState(''); // পাসওয়ার্ড স্টেট
  const [message, setMessage] = useState(''); // মেসেজ স্টেট (সফলতা বা ত্রুটি বার্তা দেখানোর জন্য)
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const router = useRouter();
  // ফর্ম সাবমিট হ্যান্ডলার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault(); // ফর্মের ডিফল্ট সাবমিট আচরণ বন্ধ করা
    setLoading(true); // লোডিং শুরু
    setMessage(''); // পূর্বের মেসেজ পরিষ্কার করা

    try {
      // /api/auth/register এপিআইতে POST রিকোয়েস্ট পাঠানো
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // ইমেল এবং পাসওয়ার্ড JSON ফরম্যাটে পাঠানো
      });

      const data = await response.json(); // রেসপন্স JSON ফরম্যাটে পার্স করা

      if (response.ok) {
        // যদি রেসপন্স সফল হয় (স্ট্যাটাস 2xx)
        setMessage(`Registration successful: ${data.message}. User ID: ${data.userId}`);
        alert('Register Successfully');
        setEmail(''); // ফর্ম পরিষ্কার করা
        setPassword(''); // ফর্ম পরিষ্কার করা
        router.push('/login');
      } else {
        // যদি রেসপন্স ব্যর্থ হয় (স্ট্যাটাস 4xx বা 5xx)
        setMessage(`Registration failed: ${data.message || 'Something went wrong.'}`);
      }
    } catch (error) {
      // নেটওয়ার্ক ত্রুটি বা অন্য কোনো ত্রুটি হলে
      console.error('Error during registration:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">রেজিস্টার করুন</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">ইমেল:</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">পাসওয়ার্ড:</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border  text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'রেজিস্টার হচ্ছে...' : 'রেজিস্টার করুন'}
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center text-md font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          ইতিমধ্যে একটি অ্যাকাউন্ট আছে?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            লগইন করুন
          </a>
        </p>
      </div>
    </div>
  );
}
