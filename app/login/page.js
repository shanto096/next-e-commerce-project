'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false); // alert trigger করার জন্য আলাদা state
  const router = useRouter();
   const {fetchUser}= useAuth()
  useEffect(() => {
    if (showAlert) {
      alert('Login Successfully');
      setShowAlert(false);
    }
  }, [showAlert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchUser()
        setMessage(`Login successful: ${data.message}. Welcome, ${data.user.email}!`);
        setShowAlert(true); // alert trigger করো
        router.push('/'); // রিডাইরেক্ট করো
      } else {
        setMessage(`Login failed: ${data.message || 'Invalid credentials.'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
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
