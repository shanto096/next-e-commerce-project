'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';
import Image1 from '../../public/image/sale8 (1).png';
import Image2 from '../../public/image/sale8 (1).png';

export default function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (inView) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div
      className="relative p-6 lg:p-12 m-4 lg:m-8 rounded-3xl shadow-xl transition-all duration-500  ]"
      style={{
        background: 'var(--card-bg)',
        color: 'var(--foreground)',
      }}
    >
      <section
        ref={ref}
        className="flex flex-col md:flex-row items-center justify-center px-4 md:px-16 py-12 transition-colors duration-500"
       
      >
        {/* Left Image */}
        <motion.div
          key={`left-${animationKey}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 mb-6 md:mb-0"
        >
          <Image
            src={Image1}
            alt="Farmer"
            width={400}
            height={500}
            className="rounded-3xl object-cover"
          />
        </motion.div>
  
        {/* Text Content */}
        <motion.div
          key={`text-${animationKey}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/3 text-center md:text-left px-4"
        >
          <p className="text-sm font-medium mb-2">
            🌱 FRESH FROM OUR FARM
          </p>
          <h1 className="text-4xl md:text-5xl font-bold  leading-tight">
            Trusted Organic Food <br />
            Store Conscious
          </h1>
          <p className="italic text-lg  mt-4">
            Lorem ipsum dolor amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore.
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            Morbi eget congue lectus. Donec eleifend ultrices urna et euismod.
            Sed consectetur tellus eget odio aliquet, vel vestibulum tellus
            sollicitudin.
          </p>
  
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-lime-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition duration-300 hover:bg-lime-600"
          >
            Subscribe →
          </motion.button>
        </motion.div>
  
        {/* Right Image */}
        <motion.div
          key={`right-${animationKey}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/3 mt-6 md:mt-0"
        >
          <Image
            src={Image2}
            alt="Woman with veggies"
            width={400}
            height={500}
            className="rounded-3xl object-cover"
          />
        </motion.div>
      </section>
    </div>
  );
}
