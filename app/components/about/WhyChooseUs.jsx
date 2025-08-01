// app/components/WhyChooseUs.jsx
'use client';

const WhyChooseUs = () => {
  // SVG icons for each feature
  const icons = {
    plant: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#80d00f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5l6 6m0-6l-6 6m6-6v6a.75.75 0 01-1.5 0v-6a.75.75 0 011.5 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5V19.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 19.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.25 0-4.5.75-4.5 1.5s2.25 1.5 4.5 1.5 4.5-.75 4.5-1.5-2.25-1.5-4.5-1.5z" />
      </svg>
    ),
    carrot: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#80d00f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5zM12 14.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5zM16 14.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.5a.75.75 0 00.75.75h1.5a.75.75 0 00.75-.75v-1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15.75a3 3 0 10-6 0 3 3 0 006 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9" />
      </svg>
    ),
    apple: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#80d00f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20.25c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9" />
      </svg>
    ),
  };

  const features = [
    {
      icon: icons.plant,
      title: "All Kind Brand",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore."
    },
    {
      icon: icons.carrot,
      title: "Curated Products",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore."
    },
    {
      icon: icons.apple,
      title: "Pesticide Free Goods",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore."
    }
  ];

  return (
    <section className="bg-[#f9f9f5] py-20 md:py-24">
      {/* Section Title */}
      <div className="text-center mb-12 px-4">
        <p className="text-sm font-semibold text-[#80d00f] tracking-wide uppercase mb-2">
          // FEATURES //
        </p>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-800">
          Why Choose Us<span className="text-[#80d00f]">.</span>
        </h2>
      </div>

      {/* Feature Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;