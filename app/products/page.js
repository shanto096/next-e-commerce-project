 'use client';
import { useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';


export default function HomePage() {
  const [selected, setSelected] = useState("All");

  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Our Organic Products</h1>
      <CategoryTabs selected={selected} onSelect={setSelected} />
      <ProductList selectedCategory={selected} />
    </main>
  );
}
