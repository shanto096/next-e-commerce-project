// app/components/TrustedOrganic.jsx
"use client";



const TrustedOrganic = () => {
  // Using only one image URL
  const singleImageUrl =
    "https://tunatheme.com/tf/html/broccoli-preview/broccoli/img/others/6.png";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left Side - Single Image */}
        <div className="rounded-lg overflow-hidden shadow-md aspect-[4/3] w-full">
          <img
            src={singleImageUrl}
            alt="Organic food"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Right Side - Text Content */}
        <div className="text-left">
          <p className="text-sm font-semibold text-[#80d00f] tracking-wide uppercase mb-4">
            KNOW MORE ABOUT SHOP
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
            Trusted Organic Food Store
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Sellers who aspire to be good, do good, and spread goodness. We
            democratic, self-sustaining, two-sided marketplace which thrives on
            trust and is built on community and quality content.
          </p>
          <div className="flex items-center">
            <div className="mr-4">
              <p className="font-semibold text-gray-900">Jerry Henson</p>
              <p className="text-sm text-gray-500">/ Shop Director</p>
            </div>
            {/* ছবির সাথে মিলিয়ে একটি SVG বা ইমেজ সিগনেচার */}
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8 text-[#80d00f]"
              >
                <path d="M7.75 3.5a.75.75 0 00-1.5 0v17a.75.75 0 001.5 0v-17z" />
                <path
                  fillRule="evenodd"
                  d="M12.384 19.5h-.768a.75.75 0 01-.768-.667l-.234-1.398c.414-.15.823-.323 1.228-.52.404-.197.803-.42 1.196-.67l.385.666c.207.359.712.592 1.157.592h.001c.445 0 .95-.233 1.157-.592l.385-.666c.393.25.792.473 1.196.67.405.197.814.37 1.228.52l-.234 1.398a.75.75 0 01-.768.667h-.768a.75.75 0 01-.662-.439l-.364-.63c-.34.218-.684.417-1.026.594l.364.63a.75.75 0 01-.662.439zm2.42-3.75l-.364-.63c.34-.218.684-.417 1.026-.594l-.364.63a.75.75 0 01.364.63z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedOrganic;
