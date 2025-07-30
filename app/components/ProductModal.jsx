
'use client'
import { motion } from 'framer-motion';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black  bg-opacity-100 flex justify-center items-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: "-100vh" }} 
        animate={{ y: 0 }} 
        exit={{ y: "-100vh" }} 
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
        <img src={product.productImage} alt={product.name} className="w-64 h-64 object-contain mx-auto my-5" />
        <p className="text-gray-700 mb-2">{product.description}</p>
        <p className="text-green-600 font-bold text-xl">${product.price}</p>
        <div className="text-yellow-500 mt-2">
          ★★★★☆ <span className="text-sm text-gray-600">({product.rating || 4.0})</span>
        </div>
        <button className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300 w-full">
          Add to Cart
        </button>
      </motion.div>
    </div>
  );
} 