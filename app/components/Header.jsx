import React from 'react';

export default function HeroSection() {
  return (
    <section
      className="w-full h-screen  bg-cover bg-center py-16 px-4 flex flex-col lg:flex-row items-center justify-between"
      style={{
        backgroundImage:
          "url('https://jthemes.net/themes/html/organic/assets/images/banner/banner6.png')",
      }}
    >
      {/* Left Content */}
      <div className="lg:w-1/2 text-center lg:text-left text-gray-800">
        <span className="inline-block bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
          100% ORGANIC FOODS
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Organic Veggies & Foods <br />
          You Cook <span className="text-green-600">Healthy</span>
        </h1>

        <p className="text-gray-600 text-base leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
          Morbi eget congue lectus. Donec eleifend ultricies urna et euismod.
          Sed consectetur tellus eget odio aliquet, vel vestibulum tellus
          sollicitudin. Morbi maximus metus eu eros tincidunt
        </p>

        <button className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-all duration-300">
          Subscribe &rarr;
        </button>
      </div>

      {/* Right Side Jar Image */}
      
    </section>
  );
}
