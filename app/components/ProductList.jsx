'use client'

import ProductCard from './ProductCard';
import { products } from '../data/products';

export default function ProductList({ selectedCategory }) {
  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {filtered.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
