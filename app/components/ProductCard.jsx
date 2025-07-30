'use client'
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';    
import { useState } from 'react';     
export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
console.log(product);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCardClick = () => {
    setIsModalOpen(true);
  };
  return (
    <>
    <motion.div 
      whileHover={{ scale: 1.03 }} 
      className="border rounded-2xl p-5 bg-white relative"
      onClick={handleCardClick}
      >
      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
        -{20}%
        
      </div>
      <img src={product.productImage} alt={product.name} className="w-48 h-48 object-contain mx-auto my-5" />
      <div className="text-center mt-4">
        <div className="text-yellow-500 mb-1">★★★★☆ <span className="text-sm text-gray-600">(4.0)</span></div>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-green-600 font-bold">${product.price}</p>
        <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">Add to Cart</button>
      </div>
    </motion.div>
    {isModalOpen &&<ProductModal product={product} onClose={handleCloseModal} />}
    </>
  );
}
