'use client'
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }} 
      className="border rounded-2xl p-5 bg-white relative"
    >
      <div className="absolute top-3 left-3 bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
        {product.tag}
      </div>
      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        -{product.discount}%
      </div>
      <img src={product.image} alt={product.name} className="w-48 h-48 object-contain mx-auto my-5" />
      <div className="text-center mt-4">
        <div className="text-yellow-500 mb-1">★★★★☆ <span className="text-sm text-gray-600">(4.0)</span></div>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-green-600 font-bold">${product.price.toFixed(2)} <span className="text-gray-400 line-through ml-2">${product.oldPrice.toFixed(2)}</span></p>
      </div>
    </motion.div>
  );
}
