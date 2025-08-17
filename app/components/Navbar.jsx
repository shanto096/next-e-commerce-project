'use client';
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Assuming AuthContext provides user.name, user.email, user.role
import { useTheme } from "../context/ThemeContext";
import { FaShoppingCart } from 'react-icons/fa'; // কার্ট আইকন ইম্পোর্ট করুন
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { HiMenu, HiX } from 'react-icons/hi'; // Import hamburger and close icons
import { IoNotificationsOutline } from 'react-icons/io5';

const Navbar = () => {
  const { user, logout, cartCount  } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false); // State for mobile menu
  const modalRef = useRef(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [animateBadge, setAnimateBadge] = useState(false);
  const previousCountRef = useRef(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);

  const toggleUserModal = () => {
    setShowUserModal(!showUserModal);
  };

  const toggleMobileMenu = () => { // Function to toggle mobile menu
    setShowMobileMenu(!showMobileMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowUserModal(false);
      }
    };

    if (showUserModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserModal]);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Sync notification count and list with localStorage
  useEffect(() => {
    const seedDummyNotifications = () => {
      const dummy = [
        { id: 'n1', title: 'New Order', message: 'Order #1024 placed successfully.', time: '2 min ago', read: false },
        { id: 'n2', title: 'Stock Alert', message: 'Product Maca Root is low on stock.', time: '15 min ago', read: false },
        { id: 'n3', title: 'New User', message: 'A new user registered: john@example.com', time: '1 hr ago', read: true },
        { id: 'n4', title: 'Payout', message: 'Your weekly payout has been processed.', time: 'Yesterday', read: true },
      ];
      localStorage.setItem('notifications', JSON.stringify(dummy));
      const unread = dummy.filter(n => !n.read).length;
      localStorage.setItem('notificationsCount', String(unread));
      return dummy;
    };

    const getNotificationsCount = () => {
      if (typeof window === 'undefined') return 0;
      const stored = localStorage.getItem('notificationsCount');
      const parsed = stored ? parseInt(stored, 10) : 0;
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    const updateCount = () => {
      let list = [];
      try {
        const raw = localStorage.getItem('notifications');
        list = raw ? JSON.parse(raw) : [];
      } catch {}
      if (!Array.isArray(list) || list.length === 0) {
        list = seedDummyNotifications();
      }
      setNotifications(list);
      const unreadLen = list.filter(n => !n.read).length;
      localStorage.setItem('notificationsCount', String(unreadLen));

      const nextCount = getNotificationsCount();
      const prevCount = previousCountRef.current;
      setNotificationCount(nextCount);
      if (nextCount > prevCount) {
        setAnimateBadge(true);
        setTimeout(() => setAnimateBadge(false), 300);
      }
      previousCountRef.current = nextCount;
    };

    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('notificationsUpdated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('notificationsUpdated', updateCount);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
    localStorage.setItem('notificationsCount', '0');
    window.dispatchEvent(new Event('notificationsUpdated'));
  };

  return (
    // Navbar container with a sleek dark background
    <nav style={{
      background: 'var(--card-bg)',
      color: 'var(--foreground)',
    }} className="w-full flex items-center justify-between py-3 px-8  shadow-xl z-10 sticky top-0 ">
      {/* Brand/Logo */}
        <div className="text-2xl font-extrabold text-green-600 tracking-wide">
        <Link href="/" className=" transition duration-300">
         AmarShop
        </Link>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-gray-300 hover:text-white focus:outline-none"
        >
          {showMobileMenu ? (
            <HiX size={30} /> // Close icon when menu is open
          ) : (
            <HiMenu size={30} /> // Hamburger icon when menu is closed
          )}
        </button>
      </div>

      {/* Navigation links */}
      <ul className="hidden md:flex space-x-6 items-center">
        {/* Notifications: always show icon; badge when count > 0 */}
        <li className="relative" ref={notificationsRef}>
          <button onClick={toggleNotifications} className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition duration-300">
            <IoNotificationsOutline className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center ${animateBadge ? 'animate-bounce' : ''}`}>
                {notificationCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-lg shadow-xl overflow-hidden z-20" style={{ background: 'var(--card-bg)', color: 'var(--foreground)' }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'rgba(125,125,125,0.25)' }}>
                <span className="font-semibold">Notifications</span>
                {notificationCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-blue-500 hover:opacity-80">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 opacity-70 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b last:border-0`} style={{ borderColor: 'rgba(125,125,125,0.2)', background: n.read ? 'transparent' : 'rgba(0,0,0,0.05)' }}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-gray-400' : 'bg-green-500'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
                          <p className="text-[10px] opacity-60 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 text-center text-sm opacity-80">
                You are up to date
              </div>
            </div>
          )}
        </li>
        <li><Link href="/" className=" hover:text-white transition duration-300 text-lg">Home</Link></li>
        <li><Link href="/products" className=" hover:text-white transition duration-300 text-lg">Products</Link></li>
        <li><Link href="/about" className=" hover:text-white transition duration-300 text-lg">About</Link></li>
        <li><Link href="/contact" className=" hover:text-white transition duration-300 text-lg">Contact</Link></li>
        
        {/* Cart Item with count badge */}
        {user && (
          <li className="relative">
            <Link href="/cart" className="flex items-center transition duration-300 text-lg">
              <FaShoppingCart className="mr-2" />
            
              {cartCount > 0 && (
                <span className="absolute -top-3 left-4 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
        )}

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
              className="flex items-center space-x-2 text-white rounded-full p-1 transition duration-300"
            >
              {/* Simple SVG Avatar */}
              <svg
                className="w-10 h-10 rounded-full bg-blue-500 text-white p-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
             
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

        {/* Theme Toggle Button */}
        <li>
          <button
            onClick={toggleTheme}
            className=" transition duration-300 text-lg "
          >
            {theme === 'dark' ? (
              <MdLightMode size={24} className="text-yellow-400" />
            ) : (
              <MdDarkMode size={24} className="text-gray-800" />
            )}
          </button>
        </li>
      </ul>

      {/* Mobile Menu (conditionally rendered) */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-[64px] left-0 w-full bg-gray-900 shadow-lg py-4 px-8 z-20 transition-transform duration-300 ease-in-out transform origin-top ">
          <ul className="flex flex-col space-y-4">
            <li><Link href="/" onClick={toggleMobileMenu} className="block text-gray-300 hover:text-white transition duration-300 text-lg py-2">Home</Link></li>
            <li><Link href="/products" onClick={toggleMobileMenu} className="block text-gray-300 hover:text-white transition duration-300 text-lg py-2">Products</Link></li>
            <li><Link href="/about" onClick={toggleMobileMenu} className="block text-gray-300 hover:text-white transition duration-300 text-lg py-2">About</Link></li>
            <li><Link href="/contact" onClick={toggleMobileMenu} className="block text-gray-300 hover:text-white transition duration-300 text-lg py-2">Contact</Link></li>

            {user && (
              <li className="relative">
                <Link href="/cart" onClick={toggleMobileMenu} className="flex items-center   transition duration-300 text-lg py-2">
                  <FaShoppingCart className="mr-2" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 left-12 bg-red-600  text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {!user ? (
              <>
                <li><Link href="/login" onClick={toggleMobileMenu} className="block px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 text-lg">Login</Link></li>
                <li><Link href="/register" onClick={toggleMobileMenu} className="block px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 text-lg">Register</Link></li>
              </>
            ) : (
              <>
                {user.role === "admin" && (
                  <li>
                    <Link href="/admin/dashboard" onClick={toggleMobileMenu} className="block w-full text-left px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-600 transition duration-300 font-semibold text-base">
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => { logout(); toggleMobileMenu(); }}
                    className="block w-full text-left px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 font-semibold text-base"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            <li>
              <button
                onClick={toggleTheme}
                className="transition duration-300 text-lg "
              >
                {theme === 'dark' ? (
                  <MdLightMode size={24} className="text-yellow-400" />
                ) : (
                  <MdDarkMode size={24} className="text-gray-800" />
                )}
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
