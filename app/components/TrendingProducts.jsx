'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';


export default function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef();
  const total = trendingProducts.length;

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch('/api/products?isTrending=Trending');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrendingProducts(data.data);
      } catch (error) {
        console.error('Error fetching trending products:', error);
      }
    };

    fetchTrendingProducts();
  }, []);

  useEffect(() => {
    if (total === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const extendedProducts = [...trendingProducts, ...trendingProducts];

  return (
    <section
      className="w-full py-12 transition-colors duration-500 mb-20"
      style={{
        background: 'var(--card-bg)',
        color: 'var(--foreground)',
      }}
    >
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
              <div
                key={product._id || idx}
                className="w-[250px] flex-shrink-0 shadow-md rounded-xl p-4 relative transition-colors duration-500"
                style={{
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                }}
              >
                {product.discount && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded">
                    {product.discount}
                  </span>
                )}
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-4"
                />
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

        <Link href={'/products'}>
          <button className="mt-10 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            See all products
          </button>
        </Link>
      </div>
    </section>
  );
}
