'use client';

import { useRef, useState, useEffect } from 'react';

const testimonials = [
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/2.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Jerry Henson',
    title: 'Shop Director',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/3.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Jane Doe',
    title: 'Client',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },
  {
        image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/4.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'John Smith',
    title: 'Client',
  }, {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/3.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Jane Doe',
    title: 'Client',
  },
  {
    image: 'https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/team/1.jpg',
    feedback: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod te mp or incididunt ut labore et dolore magna aliqua.',
    name: 'Rosalina D. William',
    title: 'Founder',
  },// ... same as before (unchanged testimonial data)
];

const Testimonials = () => {
  const sliderRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let scrollInterval;
    const scrollStep = 3;

    const startAutoScroll = () => {
      if (!sliderRef.current) return;
      scrollInterval = setInterval(() => {
        const slider = sliderRef.current;
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        } else {
          slider.scrollLeft += scrollStep;
        }
      }, 20);
    };

    if (!isHovered) {
      startAutoScroll();
    }

    return () => clearInterval(scrollInterval);
  }, [isHovered]);

  return (
    <section  style={{
      background: 'var(--card-bg)',
      color: 'var(--foreground)',
    }}className=" py-20 md:py-24 relative">
      {/* Section Title */}
      <div className="text-center mb-12 px-4">
       
        <h2 className="text-4xl lg:text-5xl font-bold">
          Clients Feedbacks<span className="text-green-600">.</span>
        </h2>
      </div>

      {/* Slider */}
      <div className="container mx-auto px-4 relative">
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex overflow-x-auto space-x-6 scroll-smooth hide-scrollbar"
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-none w-[80%] sm:w-[50%] md:w-[40%] lg:w-[30%] snap-start"
            >
              <div
               style={{
                background: 'var(--background)',
                color: 'var(--foreground)',
              }} className=" p-6 md:p-8 rounded-lg shadow-md relative overflow-hidden h-full">
                <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-48 w-48 "
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5h-1v2.5L7.5 17 7 17v-5zm5-3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </div>

                <div className="flex items-start mb-4 relative z-10">
                  <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className=" leading-relaxed text-sm">
                      {testimonial.feedback}
                    </p>
                  </div>
                </div>

                <div className="relative z-10">
                  <p className="font-bold  mt-4">{testimonial.name}</p>
                  <p className="text-[#80d00f] text-sm">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
