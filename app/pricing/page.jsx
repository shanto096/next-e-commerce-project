'use client';


export default function PricingCard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto p-12 md:p-16 rounded-3xl shadow-2xl text-white text-center space-y-8"
      style={{
        background: `
          radial-gradient(ellipse at top left, rgba(160, 71, 255, 0.7) 20%, transparent 70%),
          radial-gradient(ellipse at top right, rgba(0, 0, 0, 0.5) 20%, transparent 70%),
          linear-gradient(to bottom, rgba(49, 46, 129, 0.6) 0%, rgba(17, 24, 39, 1) 80%)
        `,
        backgroundBlendMode: "overlay"
      }}
    >
      <div className="text-center mb-12">
        <p className="text-blue-400 text-lg font-semibold mb-2">Pricing</p>
        <h1 className="font-bold mb-4 ">Sprint to MVP in 1 month</h1>
        <p className="text-6xl md:text-7xl font-extrabold text-white mb-6">$9,999</p>
        <p className="text-gray-400 text-sm max-w-xl mx-auto">
          By the conclusion, you'll possess a fully functional product prepared for a global launch.
        </p>
        <button className="mt-8 px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-semibold shadow-xl hover:bg-gray-200 transition duration-300">
          Launch my MVP &gt;
        </button>
      </div>
    
      <div className="w-full max-w-2xl mb-10">
        <hr className="text-gray-600" />
      </div>

      <div className="w-full max-w-2xl bg-gray-800 border border-gray-600 rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl text-left font-semibold mb-2">Book a call</h2>
          <p className="text-gray-400">Book a 15 min call with our team</p>
        </div>
        <button className="px-6 py-3 bg-white text-gray-900 rounded-full text-md font-semibold shadow-md hover:bg-gray-200 transition duration-300 flex items-center justify-center w-full sm:w-auto">
          <img src="/image/team-member.png" alt="Team Member" className="w-8 h-8 rounded-full mr-3" />
          Book a call
        </button>
      </div>
    </div>
  );
}