// app/components/RecentNewsSlider.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const newsData = [
  {
    id: 1,
    image: '/images/vegetables.jpg',
    title: 'All time fresh every time healthy',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit doli. Aenean commodo ligula eget dolor.',
  },
  {
    id: 2,
    image: '/images/almonds.jpg',
    title: 'Vegina special liquide fesh vagi',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit doli. Aenean commodo ligula eget dolor.',
  },
  {
    id: 3,
    image: '/images/salad.jpg',
    title: 'Green onion knife and salad placed',
    description:
      'Lorem ipsum dolor sit amet, consectetuer adipiscing elit doli. Aenean commodo ligula eget dolor.',
  },
];

const RecentNewsSlider = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % newsData.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full py-16 px-4 sm:px-10 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">Recent news</h2>
      <div className="relative w-full overflow-hidden h-[500px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full flex justify-center gap-6"
          >
            {newsData.slice(index, index + 3).map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md max-w-sm w-full"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="rounded-t-lg w-full h-60 object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <button className="text-black font-semibold flex items-center gap-1">
                    Read more <span className="text-lg">→</span>
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentNewsSlider;
