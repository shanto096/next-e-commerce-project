// components/AllComments.jsx
"use client";
import { FaStar, FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// এটি একটি পণ্যের সমস্ত কমেন্ট দেখাবে
const AllComments = ({ comments, onDeleteComment }) => {
  const { user } = useAuth();

  if (comments.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No reviews yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="p-5 bg-white rounded-lg shadow-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-lg text-gray-800">{comment.userName}</span>
              {/* Star rating display */}
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, index) => (
                  <FaStar key={index} className={index < comment.rating ? '' : 'text-gray-300'} />
                ))}
              </div>
            </div>
            {user && user._id === comment.userId && (
              <button
                onClick={() => onDeleteComment(comment.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                title="Delete your comment"
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
          <p className="text-gray-600 mb-2">{comment.text}</p>
          <span className="text-xs text-gray-400">Reviewed on: {comment.date}</span>
        </div>
      ))}
    </div>
  );
};

export default AllComments;
