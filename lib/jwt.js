// lib/jwt.js (JWT ইউটিলিটি)
import jwt from 'jsonwebtoken';

// আপনার গোপন কী এনভায়রনমেন্ট ভেরিয়েবলে রাখুন!
// প্রোডাকশনে কখনোই হার্ডকোড করবেন না।
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'আপনার-খুব-গোপন-কী';

/**
 * একটি পেলোড থেকে JWT তৈরি করে।
 * @param {object} payload - টোকেনে অন্তর্ভুক্ত করার ডেটা (যেমন, userId, role)।
 * @returns {string} - তৈরি করা JWT।
 */
export function generateToken(payload) {
    // টোকেন 1 ঘন্টা পরে মেয়াদোত্তীর্ণ হবে।
    return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1h' });
}

/**
 * একটি JWT যাচাই করে।
 * @param {string} token - যাচাই করার JWT।
 * @returns {object|null} - যদি বৈধ হয় তাহলে ডিকোড করা পেলোড, অন্যথায় null।
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
        // টোকেন অবৈধ বা মেয়াদোত্তীর্ণ হলে null ফেরত দিন।
        console.error("JWT যাচাইকরণ ব্যর্থ:", error.message);
        return null;
    }
}