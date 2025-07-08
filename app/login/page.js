// app/login/page.js
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এতে ইন্টারঅ্যাকটিভিটি আছে।

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // যদি লগইনের পর রিডাইরেক্ট করতে চান

// লগইন পেজ কম্পোনেন্ট
export default function LoginPage() {
  const [email, setEmail] = useState(''); // ইমেল স্টেট
  const [password, setPassword] = useState(''); // পাসওয়ার্ড স্টেট
  const [message, setMessage] = useState(''); // মেসেজ স্টেট (সফলতা বা ত্রুটি বার্তা দেখানোর জন্য)
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const router = useRouter(); // যদি লগইনের পর রিডাইরেক্ট করতে চান

  // ফর্ম সাবমিট হ্যান্ডলার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault(); // ফর্মের ডিফল্ট সাবমিট আচরণ বন্ধ করা
    setLoading(true); // লোডিং শুরু
    setMessage(''); // পূর্বের মেসেজ পরিষ্কার করা

    try {
      // /api/auth/login এপিআইতে POST রিকোয়েস্ট পাঠানো
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), // ইমেল এবং পাসওয়ার্ড JSON ফরম্যাটে পাঠানো
      });

      const data = await response.json(); // রেসপন্স JSON ফরম্যাটে পার্স করা

      if (response.ok) {
        // যদি রেসপন্স সফল হয় (স্ট্যাটাস 2xx)
        setMessage(`Login successful: ${data.message}. Welcome, ${data.user.email}!`);
        alert('Login Successfully');
        router.push('/');
        // এখানে আপনি ইউজারের সেশন ম্যানেজমেন্ট করতে পারেন, যেমন JWT টোকেন সংরক্ষণ করা
        // উদাহরণস্বরূপ: localStorage.setItem('token', data.token);
        // router.push('/dashboard'); // লগইনের পর ড্যাশবোর্ড পেজে রিডাইরেক্ট করা
      } else {
        // যদি রেসপন্স ব্যর্থ হয় (স্ট্যাটাস 4xx বা 5xx)
        setMessage(`Login failed: ${data.message || 'Invalid credentials.'}`);
      }
    } catch (error) {
      // নেটওয়ার্ক ত্রুটি বা অন্য কোনো ত্রুটি হলে
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">লগইন করুন</h2>
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
              className="mt-1 block w-full px-4 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center text-md font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          একটি অ্যাকাউন্ট নেই?{' '}
          <a href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            রেজিস্টার করুন
          </a>
        </p>
      </div>
    </div>
  );
}
