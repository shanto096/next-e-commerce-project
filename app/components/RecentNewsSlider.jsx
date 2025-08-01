// app/components/RecentNewsSlider.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
 // Fallback image

const RecentNewsSlider = () => {
  const [news, setNews] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
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
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % news.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [news]);

  const handleOpenModal = (item) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

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
    <>
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
                    key={item._id}
                    className="bg-white rounded-lg shadow-md max-w-sm w-full"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="rounded-t-lg w-full h-60 object-cover"
                    />
                    <div className="p-5">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="text-black font-semibold flex items-center gap-1"
                      >
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

      {/* News Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-300/75  bg-opacity-75 flex justify-center items-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative"
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              >
                &times;
              </button>
              <h3 className="text-2xl font-bold mb-4">{selectedNews.title}</h3>
              <div className="relative w-full h-64 mb-4">
                <img
                  src={selectedNews.image}
                  alt={selectedNews.title}
                  width={500}
                      height={300}
                      className="rounded-t-lg h-60 object-cover"
                />
              </div>
              <p className="text-gray-700 whitespace-pre-line">{selectedNews.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecentNewsSlider;