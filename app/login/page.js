'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

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
    <div  className="min-h-screen flex items-center justify-center  p-4">
      <div style={{
      background: 'var(--card-bg)',
      color: 'var(--foreground)',
    }} className=" p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-600  mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium  mb-1">Email:</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border  border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-4 py-2 border  border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            {loading ? 'Login...' : 'Login'}
          </button>
        </form>
        {
          message && <p className='text-center text-sm text-red-600'>{message}</p>
        }
        
        <p className="mt-6 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
