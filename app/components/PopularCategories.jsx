'use client';

import React, { useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';


const categories = [
  {
    name: 'Awesome Broccoli',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Fruits & Vegetables',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Grocery & Staples',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Health & Wellness',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Package Foods',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Dairy Products',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Dairy Products',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Dairy Products',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
  {
    name: 'Dairy Products',
    image: 'https://jthemes.net/themes/html/organic/assets/images/category/cat2.png',
  },
];

export default function PopularCategories() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  // Auto-scroll every 2 seconds with looping
  useEffect(() => {
    const interval = setInterval(() => {
      const container = scrollRef.current;
      if (container) {
        // শেষ পর্যন্ত চলে গেলে আবার শুরুতে আনো
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 300, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-green-600 font-semibold uppercase text-sm">
            Fresh from our farm
          </p>
          <h2 className="text-3xl font-bold text-gray-900 mt-1">Popular Categories</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-700"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full bg-lime-500 text-white flex items-center justify-center hover:bg-lime-600"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-6 scroll-smooth hide-scrollbar"
      >
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-64 h-64 rounded-full overflow-hidden relative group border-4 border-transparent hover:border-lime-500 transition"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-lime-500 text-white font-bold px-4 py-2 rounded-full">
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
