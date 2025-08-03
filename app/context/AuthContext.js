'use client'
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [cartCount, setCartCount] = useState(0);

    const getCartCount = () => {
        if (typeof window !== 'undefined') {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart).reduce((total, item) => total + item.quantity, 0) : 0;
        }
        return 0;
    };

    const fetchUser = async () => {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            console.error('Failed to fetch user:', response.statusText);
        }
    };

    const updateCartCount = () => {
        setCartCount(getCartCount());
    };

    useEffect(() => {
        fetchUser();
        updateCartCount(); // Initial cart count on mount

        // Listen for changes to localStorage (e.g., from other tabs/windows or direct manipulation)
        const handleStorageChange = () => {
            updateCartCount();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('cartUpdated', updateCartCount); // Listen for custom cartUpdated event

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('cartUpdated', updateCartCount); // Clean up event listener
        };
    }, []);

    const login = (userData) => {
        setUser(userData);
        // Removed localStorage logic
    };

    const logout = async () => {
        const response = await fetch('/api/auth/logout', {
            method: 'POST',
        });
        if (response.ok) {
            setUser(null); // Clear user state
        } else {
            console.error('Failed to logout:', response.statusText);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, fetchUser, cartCount, updateCartCount }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}