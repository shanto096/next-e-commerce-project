'use client'
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation"; // ✅ import this
import { useAuth } from "../context/AuthContext";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "User", href: "/admin/user" },
  { name: "Products", href: "/admin/products" },
  { name: "Recent News", href: "/admin/recent-news" },
  { name: "Messages", href: "/admin/messages" },
  { name: "Website", href: "/" },
];

const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname(); // ✅ use this instead of location.pathname

  return (
    <div  className="fixed ">
      <nav>
        <ul className="list-none ">
          {sidebarItems.map((item) => (
            <li
              key={item.href}
              className={`mb-4 rounded px-4 py-2 transition-colors text-black   ${
                pathname === item.href ? "bg-green-500 " : "bg-white"
              }`}
            >
              <Link href={item.href} className="no-underline text-inherit block">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
