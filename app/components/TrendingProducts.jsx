'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    name: 'Orange juice natural',
    price: 66,
    originalPrice: null,
    rating: 0,
    image: '/products/orange-juice.png',
  },
  {
    id: 2,
    name: 'Healthy papaya 100% organic',
    price: 20,
    originalPrice: null,
    rating: 0,
    image: '/products/papaya.png',
  },
  {
    id: 3,
    name: 'Fruits banana 100% organic',
    price: 22,
    originalPrice: 44,
    rating: 0,
    image: '/products/banana.png',
    discount: '50%',
  },
  {
    id: 4,
    name: 'Fresh seafoods',
    price: 18,
    originalPrice: 44,
    rating: 0,
    image: '/products/seafood.png',
    discount: '59%',
  },
  {
    id: 5,
    name: 'Fresh organic reachter',
    price: 44,
    originalPrice: 65,
    rating: 0,
    image: '/products/peach.png',
    discount: '32%',
  },
];

export default function TrendingProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = products.length;
  const containerRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  // Create an extended array for infinite scrolling
  const extendedProducts = [...products, ...products];

  return (
    <section className="w-full py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold mb-8">Trending products</h2>

        <div className="relative overflow-hidden">
          <motion.div
            ref={containerRef}
            className="flex gap-6"
            animate={{ x: `-${currentIndex * 260}px` }}
            transition={{ ease: 'easeInOut', duration: 0.8 }}
          >
            {extendedProducts.map((product, idx) => (
              <div key={idx} className="w-[250px] flex-shrink-0 bg-white shadow-md rounded-xl p-4 relative">
                {product.discount && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                    {product.discount}
                  </span>
                )}
                <img src={product.image} alt={product.name} className="w-full h-40 object-contain mb-4" />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-green-600 text-lg font-bold">
                  €{product.price.toFixed(2)}{' '}
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through text-sm ml-2">
                      €{product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </p>
                <p className="text-gray-400 text-sm mt-1">⭐️⭐️⭐️⭐️⭐️ No reviews</p>
              </div>
            ))}
          </motion.div>
        </div>

        <button className="mt-10 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
          See all products
        </button>
      </div>
    </section>
  );
}
