import Link from "next/link";

const sidebarItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "User", href: "/admin/user" },
  { name: "Create Product", href: "/admin/create-product" },
];

export default function AdminLayout({ children }) {
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
