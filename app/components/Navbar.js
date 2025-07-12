'use client'
import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between py-4 px-8 border-b border-gray-200 bg-black">
      <div className="text-xl font-bold text-white">E-Commerce</div>
      <ul className="flex space-x-6 items-center">
        <li><Link href="/" className="hover:underline text-white">Home</Link></li>
        <li><Link href="/products" className="hover:underline text-white">Products</Link></li>
        <li><Link href="/about" className="hover:underline text-white">About</Link></li>
        <li><Link href="/contact" className="hover:underline text-white">Contact</Link></li>
        {!user && (
          <>
            <li><Link href="/login" className="hover:underline text-white">Login</Link></li>
            <li><Link href="/register" className="hover:underline text-white">Register</Link></li>
          </>
        )}
        {user && (
          <>
            <li className="text-white">{user.email}</li>
            {user.role === "admin" && (
              <li><Link href="/admin/dashboard" className="hover:underline text-yellow-400">Dashboard</Link></li>
            )}
            <li>
              <button
                onClick={logout}
                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;