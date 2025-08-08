'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';
import axios from 'axios';
import Link from 'next/link';

export default function HomePage() {
  const pathname = usePathname(); // Get current route
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
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Our Organic Products
      </h1>

      <CategoryTabs
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      {/* Only show search bar on /products */}
      {pathname === '/products' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name..."
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-xl text-gray-600">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-xl text-gray-600">
          No products found for your search / filter.
        </div>
      ) : (
        <ProductList products={products} />
      )}

      {/* If pathname is /products → show full pagination */}
      {!loading && products.length > 0 && pathname === '/products' && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-lg font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* If pathname is / → show "See More Products" button */}
      {!loading && products.length > 0 && pathname === '/' && (
        <div className="flex justify-center mt-8">
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            See More Products
          </Link>
        </div>
      )}
    </main>
  );
}
