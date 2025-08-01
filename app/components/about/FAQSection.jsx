// app/components/FAQSection.jsx
"use client";

import { useState } from "react";

const FAQSection = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqs = [
    {
      question: "How to buy a product?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "How can I make refund from your website?",
      answer:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      question: "I am a new user. How should I start?",
      answer:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    },
    {
      question: "Returns and refunds",
      answer:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    },
    {
      question: "Are my details secured?",
      answer:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
    },
  ];

  const toggleQuestion = (index) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side - FAQ List */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Some Questions
          </h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-md shadow-sm overflow-hidden"
            >
              <button
                className="flex items-center justify-between w-full py-3 px-4 text-left font-semibold text-gray-700 hover:bg-gray-100 focus:outline-none"
                onClick={() => toggleQuestion(index)}
                aria-expanded={expandedQuestion === index}
              >
                {faq.question}
                <span className="relative w-6 h-6">
                  <svg
                    className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 transition-transform duration-300 ${
                      expandedQuestion === index ? "rotate-45" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </button>
              {expandedQuestion === index && (
                <div className="py-3 px-4 text-gray-600 border-t border-gray-200">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Side - Image */}
        <div className="relative rounded-md overflow-hidden shadow-md aspect-w-4 aspect-h-3">
          <img
            src="	https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/bg/12.png"
            alt="Fresh Vegetables"
            className="rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
