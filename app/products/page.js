'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';
import axios from 'axios';

export default function HomePage() {
  const pathname = usePathname();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const productsPerPage = 8;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products', {
        params: {
          page: currentPage,
          limit: productsPerPage,
          search: searchQuery,
          category: selectedCategory === 'All' ? '' : selectedCategory,
        },
      });
      setProducts(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4 text-center sm:text-left">
        Our Organic Products
      </h1>

      {/* Category Tabs */}
      <CategoryTabs selected={selectedCategory} onSelect={handleCategorySelect} />

      {/* Search Bar */}
      {pathname === '/products' && (
        <div className="mb-6 mt-4">
          <input
            type="text"
            placeholder="Search products by name..."
            className="w-full p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {/* Product List / Loader */}
      {loading ? (
        <div className="text-center py-10 text-lg sm:text-xl text-gray-600">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-lg sm:text-xl text-gray-600">
          No products found for your search / filter.
        </div>
      ) : (
        <ProductList products={products} />
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && pathname === '/products' && (
        <div className="mt-8 flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-sm sm:text-base">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span className="px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}

      {/* See More Button */}
      {!loading && products.length > 0 && pathname === '/' && (
        <div className="flex justify-center mt-8">
          <a
            href="/products"
            className="inline-block px-5 py-2.5 text-sm sm:text-base bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            See More Products
          </a>
        </div>
      )}
    </main>
  );
}
