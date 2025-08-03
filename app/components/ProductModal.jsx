// components/ProductModal.jsx
"use client";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { addToCart } from "../../lib/cart"; // নতুন ইম্পোর্ট
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product ? product.productImage : ""
  );

  const router = useRouter();
  const { user } = useAuth();

  if (!product) {
    return null;
  }

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      // User is not logged in, redirect to login page
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      onClose(); // Close the modal
      return;
    }
    // localStorage-এ product id এবং quantity সেভ করা হচ্ছে
    addToCart(product._id, quantity, user._id);
    console.log(`Adding ${quantity} of ${product.name} to cart.`);
    onClose(); // Add to Cart এর পর মডাল বন্ধ করা হচ্ছে
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8 md:my-12 p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl font-bold"
          >
            &times;
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-sm">
              <img
                src={activeImage || product.productImage}
                alt={product.name}
                className="w-full h-80 object-contain rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer">
                <FaHeart className="text-red-500" />
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              {/* Product images here (if any) */}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.name}
            </h2>
            <p className="text-lg text-gray-600">{product.title}</p>
            <div className="flex items-center text-yellow-500 space-x-1">
              <span>★★★★★</span>
              <span className="text-gray-600 text-sm">
                (Ratings 60 | 11 Answered Questions)
              </span>
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Brand:</span> MY SHOPEE BD
            </p>
            <div className="flex items-end space-x-2">
              <span className="text-4xl font-bold text-green-600">
                ৳ {product.price}
              </span>
            </div>
            <p className="text-gray-700">{product.description}</p>
            <div>
              <p className="text-gray-700 font-semibold mb-2">Quantity</p>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  className="p-2 border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  className="w-full text-center border-none focus:outline-none"
                />
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="p-2 border-l border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  handleAddToCart();
                }}
                className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition duration-200"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;