// app/register/page.js
'use client'; // এটি একটি ক্লায়েন্ট কম্পোনেন্ট, কারণ এতে ইন্টারঅ্যাকটিভিটি আছে।

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
  // রেজিস্ট্রেশন পেজ কম্পোনেন্ট
export default function RegisterPage() {
  const [name, setName] = useState(''); // নতুন নাম স্টেট
  const [email, setEmail] = useState(''); // ইমেল স্টেট
  const [password, setPassword] = useState(''); // পাসওয়ার্ড স্টেট
  const [message, setMessage] = useState(''); // মেসেজ স্টেট (সফলতা বা ত্রুটি বার্তা দেখানোর জন্য)
  const [loading, setLoading] = useState(false); // লোডিং স্টেট
  const router = useRouter();

  // কাস্টম মেসেজ বক্স ফাংশন
  const showMessage = (msg, type) => {
    setMessage(msg);
    // আপনি এখানে একটি কাস্টম মডেল বা টোস্ট নোটিফিকেশন ব্যবহার করতে পারেন
    // আপাতত, এটি শুধু মেসেজ স্টেট সেট করবে
  };

  // ফর্ম সাবমিট হ্যান্ডলার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault(); // ফর্মের ডিফল্ট সাবমিট আচরণ বন্ধ করা
    setLoading(true); // লোডিং শুরু
    setMessage(''); // পূর্বের মেসেজ পরিষ্কার করা

    try {
      // /api/auth/register এপিআইতে POST রিকোয়েস্ট পাঠানো
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // নাম, ইমেল এবং পাসওয়ার্ড JSON ফরম্যাটে পাঠানো
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json(); // রেসপন্স JSON ফরম্যাটে পার্স করা

      if (response.ok) {
        // যদি রেসপন্স সফল হয় (স্ট্যাটাস 2xx)
        showMessage(`Registration successful for ${data.name}! ${data.message}.`, 'success');
        // alert('Register Successfully'); // alert() ব্যবহার করা এড়িয়ে চলুন
        setEmail(''); // ফর্ম পরিষ্কার করা
        setPassword(''); // ফর্ম পরিষ্কার করা
        setName(''); // নাম ফিল্ড পরিষ্কার করা
        router.push('/login');
      } else {
        // যদি রেসপন্স ব্যর্থ হয় (স্ট্যাটাস 4xx বা 5xx)
        showMessage(`Registration failed: ${data.message || 'Something went wrong.'}`, 'error');
      }
    } catch (error) {
      // নেটওয়ার্ক ত্রুটি বা অন্য কোনো ত্রুটি হলে
      console.error('Error during registration:', error);
      showMessage('An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false); // লোডিং শেষ
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div  style={{
      background: 'var(--card-bg)',
      color: 'var(--foreground)',
    }} className=" p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-8">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* নাম ইনপুট ফিল্ড */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium  mb-1">Name:</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full px-4 py-2 border k border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium  mb-1">Email:</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium  mb-1">Password:</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-8 w-full py-2 rounded-md text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
          {
          message && <p className='text-center text-sm text-red-600'>{message}</p>
        }
          <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
