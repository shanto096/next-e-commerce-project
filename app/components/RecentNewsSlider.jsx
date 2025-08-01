// app/components/RecentNewsSlider.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';




const RecentNewsSlider = () => {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API থেকে ডেটা আনার জন্য একটি async ফাংশন
    const fetchNews = async () => {
      try {
        // API কল: শুধুমাত্র 'active' স্ট্যাটাসের নিউজগুলো আনা হচ্ছে।
        // এখানে pagination limit সেট করা হয়নি, যাতে সব active নিউজ চলে আসে।
        const response = await fetch('/api/recent-news?status=active');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []); // কম্পোনেন্টটি প্রথমবার লোড হওয়ার সময় এটি শুধুমাত্র একবার চলবে।

  useEffect(() => {
    if (news.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news]);

  if (isLoading) {
    return <div className="text-center py-16">Loading recent news...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">Error: {error}</div>;
  }

  if (news.length === 0) {
    return <div className="text-center py-16">No active news found.</div>;
  }

  return (
    <div className="w-full py-16 px-4 sm:px-10 bg-white">
      <h2 className="text-3xl font-bold text-center mb-10">Recent News</h2>
      <div className="relative w-full overflow-hidden h-[500px]">
        <AnimatePresence initial={false}>
          {news.length > 0 && (
            <motion.div
              key={index}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute top-0 left-0 w-full flex justify-center gap-6"
            >
              {news.slice(index, index + 3).map((item) => (
                <div
                  key={item._id} // MongoDB-এর জন্য _id ব্যবহার করা উচিত
                  className="bg-white rounded-lg shadow-md max-w-sm w-full"
                >
                  <img
                    src={item?.image}
                    alt={item?.title}
                    width={400}
                    height={300}
                    className="rounded-t-lg w-full h-60 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <button className="text-black font-semibold flex items-center gap-1">
                      Read more <span className="text-lg">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RecentNewsSlider;