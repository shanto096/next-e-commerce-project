
"use client";
import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaTruck } from 'react-icons/fa';
import {
  getCartItems,
  updateCartItemQuantity,
  removeCartItem,
} from "../../lib/cart"; // নতুন ইম্পোর্ট
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // যদি লগইন করা না থাকে, তাহলে লগইন পেজে রিডাইরেক্ট করবে
    if (!user) {
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const fetchCartProducts = async () => {
      try {
        const storedCart = getCartItems();
        if (storedCart.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        const productIds = storedCart.map(item => item.id);
        const response = await fetch('/api/products/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: productIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart products');
        }

        const { data: fetchedProducts } = await response.json();

        const mergedCartItems = storedCart.map(cartItem => {
          const product = fetchedProducts.find(p => p._id === cartItem.id);
          return product ? { ...product, quantity: cartItem.quantity } : null;
        }).filter(item => item !== null);

        setCartItems(mergedCartItems);
      } catch (err) {
        console.error("Failed to fetch cart data:", err);
        setError("Failed to load cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [user, router]); // user এবং router কে dependency array-তে যুক্ত করা হয়েছে

  const handleQuantityChange = (id, type) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === id) {
        const newQuantity = type === "increase"
          ? item.quantity + 1
          : Math.max(1, item.quantity - 1);
        updateCartItemQuantity(id, newQuantity); // localStorage আপডেট
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  const handleRemoveItem = (id) => {
    removeCartItem(id); // localStorage থেকে আইটেম সরান
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const salesTax = subtotal * 0.1;
    const grandTotal = subtotal + salesTax;
    return { subtotal, salesTax, grandTotal };
  };

  if (loading) {
    return <div className="text-center mt-10">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (cartItems.length === 0) {
    return <div className="text-center mt-10 text-xl font-semibold">Your cart is empty.</div>;
  }

  const { subtotal, salesTax, grandTotal } = calculateTotals();

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-semibold text-center mb-10">
        Your Cart ({cartItems.length} items)
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="hidden md:grid grid-cols-5 gap-4 font-bold text-gray-600 border-b pb-4 mb-4">
          <span className="col-span-2">Item</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
        </div>
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border-b py-4"
          >
            <div className="col-span-2 flex items-center space-x-4">
              <img
                src={item.productImage}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                {item.title && (
                  <p className="text-sm text-gray-500">{item.title}</p>
                )}
              </div>
            </div>
            <div className="text-base font-medium text-gray-700">
              ৳{item.price.toFixed(2)}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(item._id, "decrease")}
                className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <input
                type="text"
                value={item.quantity}
                readOnly
                className="w-12 text-center border border-gray-300 rounded-md p-1"
              />
              <button
                onClick={() => handleQuantityChange(item._id, "increase")}
                className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">
                ৳{(item.price * item.quantity).toFixed(2)}
              </span>
              <button onClick={() => handleRemoveItem(item._id)} className="text-gray-400 hover:text-red-500 ml-4 md:ml-0">
                <FaTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col md:flex-row justify-end space-y-4 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2 lg:w-1/3 p-6 bg-white rounded-lg shadow-lg space-y-4">
          <div className="flex justify-between font-medium">
            <span>Subtotal:</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Sales Tax:</span>
            <span>৳{salesTax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Coupon Code:</span>
            <button className="text-blue-500 hover:underline">
              Add Coupon
            </button>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-2xl font-bold">
              <span>Grand total:</span>
              <span>৳{grandTotal.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-center text-sm text-green-600 font-semibold mt-4 flex items-center justify-center space-x-2">
            <span>Congrats! you're eligible for Free Shipping</span>
            <FaTruck />
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => router.push('/checkout')} // এই লাইনটি আপডেট করা হয়েছে
          className="w-full md:w-auto px-12 py-4 bg-black text-white font-semibold text-lg rounded-md hover:bg-gray-800 transition-colors"
        >
          Check out
        </button>
      </div>
    </div>
  );
};

export default CartPage;
