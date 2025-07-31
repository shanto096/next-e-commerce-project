'use client'

import ProductCard from './ProductCard';

export default function ProductList({ products }) { // Removed selectedCategory prop

  // products prop will already be filtered and paginated from HomePage
  if (!products || products.length === 0) {
    return null; // Or show a message like "No products to display"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}