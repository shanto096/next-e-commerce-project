'use client';
import { useState } from 'react';
import { categories } from '../data/products';

export default function CategoryTabs({ selected, onSelect }) {
  return (
    <div className="flex gap-3 justify-center mb-6">
      {categories.map(cat => (
        <button 
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full font-semibold ${selected === cat ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
