'use client';
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Assuming AuthContext provides user.name, user.email, user.role

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserModal, setShowUserModal] = useState(false); // State to control user modal visibility
  const modalRef = useRef(null); // Ref for the modal to detect clicks outside

  // Function to toggle user modal visibility
  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  // Effect to close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowUserModal(false);
      }
    };

    // Add event listener when modal is open
    if (showUserModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Clean up event listener when modal is closed
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserModal]);

  return (
    // Navbar container with a sleek dark background
    <nav className="w-full flex items-center justify-between py-3 px-8 border-b border-gray-800 bg-gray-900 shadow-lg relative z-10 sticky top-0">
      {/* Brand/Logo */}
      <div className="text-2xl font-extrabold text-white tracking-wide">
        <Link href="/" className="hover:text-gray-300 transition duration-300">
          E-Commerce
        </Link>
      </div>

      {/* Navigation links */}
      <ul className="flex space-x-6 items-center">
        <li><Link href="/" className="text-gray-300 hover:text-white transition duration-300 text-lg">Home</Link></li>
        <li><Link href="/products" className="text-gray-300 hover:text-white transition duration-300 text-lg">Products</Link></li>
        <li><Link href="/about" className="text-gray-300 hover:text-white transition duration-300 text-lg">About</Link></li>
        <li><Link href="/contact" className="text-gray-300 hover:text-white transition duration-300 text-lg">Contact</Link></li>
        <li><Link href="/cart" className="text-gray-300 hover:text-white transition duration-300 text-lg">Cart</Link></li>

        {/* Conditional rendering for authenticated vs. unauthenticated users */}
        {!user ? (
          <>
            <li><Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-lg">Login</Link></li>
            <li><Link href="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-lg">Register</Link></li>
          </>
        ) : (
          <li className="relative">
            {/* User Avatar and Name */}
            <button
              onClick={toggleUserModal}
              className="flex items-center space-x-2 text-white  rounded-full p-1 transition duration-300 "
            >
              {/* Simple SVG Avatar */}
              <svg
                className="w-10 h-10 rounded-full bg-blue-500 text-white p-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <span className="font-semibold text-lg">{user.name || user.email.split('@')[0]}</span>
            </button>

            {/* User Modal */}
            {showUserModal && (
              <div
                ref={modalRef}
                className="absolute top-full right-0 mt-3 w-64 bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-down"
              >
                <div className="p-4 border-b border-gray-700">
                  <p className="text-white text-lg font-bold mb-1">{user.name || 'Guest User'}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-sm capitalize">Role: {user.role || 'user'}</p>
                </div>
                <div className="p-4 space-y-3">
                  {user.role === "admin" && (
                    <Link href="/admin/dashboard" className="block w-full text-left px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition duration-300 font-semibold text-base">
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 font-semibold text-base"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
