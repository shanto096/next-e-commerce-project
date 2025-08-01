'use client'

// app/components/AboutUsBanner.jsx

import Link from 'next/link';

// Placeholder for the background pattern image.
// You should replace this with your actual image path.
// import bannerPattern from '../../public/image/banner-pattern.png';

const AboutUsBanner = () => {
  return (
    <div className="relative bg-[#0b170e] text-white overflow-hidden py-24 md:py-32">
      {/* Background Pattern Image */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          src={'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/bg/5.jpg'}
          alt="Banner background pattern"
          layout="fill"
          objectFit="cover"
          objectPosition="right center"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Left Side Content */}
        <div className="text-left">
          <p className="text-sm font-semibold text-[#80d00f] tracking-wide uppercase mb-2">
            PRODUCE ORGANIC FRESH VEGETABLES
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            About Us
          </h1>
        </div>

       
       
      </div>
    </div>
  );
};

export default AboutUsBanner;


