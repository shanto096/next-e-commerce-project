'use client'
import Link from "next/link";
import React from "react";
import { useAuth } from "../context/AuthContext";
const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "User", href: "/admin/user" },
  { name: "Products", href: "/admin/products" },
  { name: "Website", href: "/" },
];
const Sidebar = () => {
    const {user} = useAuth()

  return (
    <div>
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
    </div>
  );
};

export default Sidebar;
