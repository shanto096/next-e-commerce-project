'use client'
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch user from API
        const fetchUser = async () => {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error('Failed to fetch user:', response.statusText);
            }
        };
        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
        // Removed localStorage logic
    };

    const logout = () => {
        setUser(null);
        // Removed localStorage logic
    };

    return (
        <AuthContext.Provider value={{ user, login, logout,   }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}