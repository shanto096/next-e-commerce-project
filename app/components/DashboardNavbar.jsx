'use client';
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext"; // Assuming AuthContext provides user.name, user.email, user.role
import { IoNotificationsOutline } from 'react-icons/io5';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notificationCount, setNotificationCount] = useState(0);
  const [animateBadge, setAnimateBadge] = useState(false);
  const previousCountRef = useRef(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false); // State to control user modal visibility
  const modalRef = useRef(null); // Ref for the modal to detect clicks outside
  const notificationsRef = useRef(null);

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

  // Sync notification count from localStorage and custom events
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
      // Refresh list first
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
    <nav className="w-full flex items-center justify-between py-2 px-8 border-b border-gray-800 bg-gray-900 shadow-lg relative z-10 sticky top-0">
      {/* Brand/Logo */}
      <div className="text-2xl font-extrabold text-white tracking-wide">
        <Link href="/" className="hover:text-gray-300 transition duration-300">
          E-Commerce
        </Link>
      </div>

      {/* Navigation links */}
      <ul className="flex space-x-6 items-center">
        {/* Notifications: always show icon; badge only when count > 0 */}
        <li className="relative" ref={notificationsRef}>
          <button onClick={toggleNotifications} className="relative text-white p-2 rounded-full hover:bg-gray-800 transition duration-300">
            <IoNotificationsOutline className="w-6 h-6" />
            {notificationCount > 0 && (
              <span className={`absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 min-w-[1.25rem] px-1 flex items-center justify-center ${animateBadge ? 'animate-bounce' : ''}`}>
                {notificationCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-gray-800 text-white rounded-lg shadow-xl overflow-hidden z-20">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <span className="font-semibold">Notifications</span>
                {notificationCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300">
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-700 last:border-0 ${n.read ? 'bg-gray-800' : 'bg-gray-700'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-gray-500' : 'bg-green-400'}`}></div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs text-gray-300 mt-0.5">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 bg-gray-900 text-center text-sm text-gray-300">
                You are up to date
              </div>
            </div>
          )}
        </li>

        {/* Conditional rendering for authenticated vs. unauthenticated users */}
         
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
              <span className="font-semibold text-lg">{user?.name || user?.email.split('@')[0]}</span>
            </button>

            {/* User Modal */}
            {showUserModal && (
              <div
                ref={modalRef}
                className="absolute top-full right-0 mt-3 w-64 bg-gray-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-down"
              >
                <div className="p-4 border-b border-gray-700">
                  <p className="text-white text-lg font-bold mb-1">{user?.name || 'Guest User'}</p>
                  <p className="text-gray-400 text-sm">{user?.email}</p>
                  <p className="text-gray-400 text-sm capitalize">Role: {user?.role || 'user'}</p>
                </div>
                <div className="p-4 space-y-3">
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
    
      </ul>
    </nav>
  );
};

export default Navbar;
