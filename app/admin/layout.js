// app/admin/layout.js
import { cookies } from "next/headers";
import Link from "next/link";
import { verifyToken } from "../../lib/jwt"; // নিশ্চিত করুন যে 'jwt' ফাইলটি আপনার JWT ভেরিফিকেশন লজিক ধারণ করে।
import { redirect } from 'next/navigation';

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "User", href: "/admin/user" },
  { name: "Products", href: "/admin/products" },
];

export default async function AdminLayout({ children }) { // async কিওয়ার্ড যোগ করা হয়েছে
  // এখানে পরিবর্তন করা হয়েছে: cookies() ফাংশনটিকে await করা হয়েছে।
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt'); // আপনার কুকির নাম 'jwt' ধরে নিলাম।

  // 1. যদি কোনো টোকেন না থাকে, সরাসরি লগইন পেজে রিডাইরেক্ট করুন।
  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    // 2. JWT টোকেন ভেরিফাই করুন।
    // verifyToken যদি একটি async ফাংশন হয়, তাহলে await ব্যবহার করতে হবে।
    // যদি এটি sync হয়, তাহলে await বাদ দিন।
    decoded = await verifyToken(token.value);
  } catch (error) {
    // 3. যদি JWT ভেরিফিকেশনে কোনো আসল error হয় (যেমন - Invalid token, Expired token),
    // তাহলে এখানে ধরা পড়বে।
    console.error('JWT verification failed:', error);
    // টোকেন ভেরিফাই না হলে লগইন পেজে রিডাইরেক্ট করুন।
    redirect('/login');
  }

  // 4. যদি টোকেন ভেরিফাই হয় কিন্তু role 'admin' না হয়।
  if (decoded?.role !== 'admin') {
    // অ্যাডমিন না হলে হোম পেজে রিডাইরেক্ট করুন।
    redirect('/');
  }

  // 5. যদি সব চেক পাস করে, তাহলে অ্যাডমিন প্যানেলের কন্টেন্ট দেখান।
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 bg-gray-100 p-6">
        <nav>
          <ul className="list-none p-0">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-4">
                <Link href={item.href} className="no-underline text-gray-800">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
