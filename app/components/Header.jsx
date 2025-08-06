'use client';
import React from 'react';

export default function HeroSection() {
  return (
    <div
      className="relative p-6 lg:p-12 m-4 lg:m-8 rounded-3xl shadow-xl transition-all duration-500"
      style={{
        background: 'var(--card-bg)',
        color: 'var(--foreground)',
      }}
    >
      <section
        className="w-full h-screen py-16 px-6 flex flex-col-reverse lg:flex-row items-center justify-between transition-colors duration-500"
       
      >
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Organic Veggies & Foods <br />
            You Cook <span className="text-green-600">Healthy</span>
          </h1>

          <p className="text-base  leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
            Morbi eget congue lectus. Donec eleifend ultricies urna et euismod.
            Sed consectetur tellus eget odio aliquet, vel vestibulum tellus
            sollicitudin. Morbi maximus metus eu eros tincidunt.
          </p>

          <button className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg">
            Order product &rarr;
          </button>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mb-10 lg:mb-0 flex justify-center">
          <div className="rounded-xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRYQIOsl5L6namfbnmAuHDY-Y5FyuBIqPIKA&s"
              alt="Organic Vegetables"
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
