// components/CommentForm.jsx
"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// এটি ব্যবহারকারীদের রেটিং এবং কমেন্ট লেখার জন্য একটি ফর্ম
const CommentForm = ({ onCommentSubmitted, productId }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText || rating === 0) {
      console.error("Please provide a rating and a comment.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/products/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          text: commentText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      setCommentText("");
      setRating(0);
      // Ensure onCommentSubmitted is called to trigger a re-fetch of comments in the parent
      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center text-gray-600">
        Please <span className="font-semibold text-blue-600">log in</span> to leave a review.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Leave a Rating</h3>
        <div className="flex justify-center space-x-1">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <FaStar
                key={starValue}
                className={`text-3xl cursor-pointer transition-colors duration-200 ${
                  starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Your Comment
        </label>
        <textarea
          id="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          placeholder="Write your comment here..."
          required
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition duration-200"
      >
        {isLoading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

export default CommentForm;
