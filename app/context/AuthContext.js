'use client'
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
            const userData = await response.json();
            setUser(userData);
        } else {
            console.error('Failed to fetch user:', response.statusText);
        }
    };

    useEffect(() => {
        fetchUser();
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
        <AuthContext.Provider value={{ user, login, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}