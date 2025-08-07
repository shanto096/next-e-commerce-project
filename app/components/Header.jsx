'use client';

import React from 'react';

export default function HeroSection() {
  return (
    <div
      className="relative m-4 lg:m-8 rounded-3xl shadow-xl transition-all duration-500"
      style={{
        background: 'var(--card-bg)',
        color: 'var(--foreground)',
      }}
    >
      <section className="w-full flex flex-col lg:flex-row items-center justify-between px-6 py-12 lg:px-16 lg:py-24 gap-10">
        {/* Mobile + Desktop Text */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Mobile-first H1 */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            Organic Veggies & Foods <br />
            You Cook <span className="text-green-600">Healthy</span>
          </h1>

          {/* Mobile Image */}
          <div className="w-full max-w-xs sm:max-w-sm mb-6 lg:hidden">
            <div className="rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYQIOsl5L6namfbnmAuHDY-Y5FyuBIqPIKA&s"
                alt="Organic Vegetables"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed mb-6 max-w-md">
            We provide fresh and organic vegetables and food items straight
            from local farms to your doorstep. Cook with love, eat with health.
          </p>

          {/* Button */}
          <button className="bg-green-600 text-white px-8 w-full py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg">
            Order product &rarr;
          </button>
        </div>

        {/* Desktop Image */}
        <div className="w-full  lg:w-1/2 hidden lg:flex justify-center">
          <div className="rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 max-w-md">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYQIOsl5L6namfbnmAuHDY-Y5FyuBIqPIKA&s"
              alt="Organic Vegetables"
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
