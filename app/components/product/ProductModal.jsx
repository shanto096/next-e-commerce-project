// components/ProductModal.jsx
"use client";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { addToCart } from "../../../lib/cart";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import CommentForm from "./CommentForm"; // নতুন ইম্পোর্ট
import AllComments from "./AllComments"; // নতুন ইম্পোর্ট

// মূল ProductModal কম্পোনেন্ট
const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(
    product ? product.productImage : ""
  );
  // Mock comments state for demonstration
  const [comments, setComments] = useState([
    { id: '1', userId: 'mock-user-123', userName: 'Jane Doe', rating: 5, text: 'This is an amazing product, I highly recommend it!', date: '2023-10-27' },
    { id: '2', userId: 'another-user-456', userName: 'John Smith', rating: 4, text: 'Good quality for the price, fast delivery.', date: '2023-10-26' },
  ]);

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
      router.push(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      onClose();
      return;
    }
    addToCart(product._id, quantity, user._id);
    console.log('Product added to cart!');
    onClose();
  };

  // Handler for adding a new comment (mock function)
  const handleCommentSubmit = (newComment) => {
    const newId = crypto.randomUUID();
    setComments(prevComments => [...prevComments, { ...newComment, id: newId }]);
    console.log('Review submitted successfully!');
  };

  // Handler for deleting a comment (mock function)
  const handleDeleteComment = (commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    console.log('Comment deleted successfully!');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end p-4 sticky top-0 bg-white z-10">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          {/* Product Details Section */}
          <div className="mb-8 pb-4 border-b border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-sm">
                  <img
                    src={activeImage || product.productImage}
                    alt={product.name}
                    className="w-full h-80 object-contain rounded-lg border border-gray-200 p-2"
                  />
                  <div className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform">
                    <FaHeart className="text-red-500 text-xl" />
                  </div>
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
                      className="p-2 border-r border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
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
                      className="p-2 border-l border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
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

          {/* Reviews & Ratings Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800">Reviews & Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Write a Review</h3>
                <CommentForm onCommentSubmit={handleCommentSubmit} productId={product._id} />
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-800">Customer Reviews</h3>
                <div className="max-h-96 overflow-y-auto pr-2">
                  <AllComments comments={comments} onDeleteComment={handleDeleteComment} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
