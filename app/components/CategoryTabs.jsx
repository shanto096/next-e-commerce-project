'use client';
import { useState } from 'react';
import { categories } from '../data/products'; // Assuming this defines your categories

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="flex gap-3 justify-center mb-6 overflow-x-auto pb-2"> {/* Added overflow for small screens */}
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap ${selected === cat ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}