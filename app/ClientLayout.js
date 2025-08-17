'use client';
import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }) {
    const pathname = usePathname();

    // /admin এবং তার সব সাবরাউটে navbar লুকাবে
    const shouldShowNavbar = !pathname.startsWith('/admin');

    return ( <
        Suspense fallback = { < div > Loading... < /div>}> <
            ThemeProvider >
            <
            AuthProvider > { shouldShowNavbar && < Navbar / > } { children } { shouldShowNavbar && < Footer / > } <
            Toaster position = "top-center" / >
            <
            /AuthProvider> <
            /ThemeProvider> <
            /Suspense>
        );
    }