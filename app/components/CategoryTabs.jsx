'use client';
import { categories } from '../data/products';

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center mb-6 overflow-x-auto pb-2 px-1 sm:px-0 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 text-sm sm:text-base rounded-full font-medium transition-colors duration-300 whitespace-nowrap ${
            selected === cat
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
