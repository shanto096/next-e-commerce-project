import Image from "next/image";
import Link from "next/link";
import Header from "./components/Header"

export default function Home() {
  return (
    <>
    <Header/>
    <main className="min-h-screen flex flex-row items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">Welcome to Our E-commerce Store</h1>
        <p className="mt-4 text-lg">Discover amazing products and enjoy a seamless shopping experience.</p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex items-center justify-center rounded-md border border-transparent bg-gray-200 px-8 py-3 text-base font-medium text-gray-800 hover:bg-gray-300 md:py-4 md:px-10 md:text-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
    </>
  );
}