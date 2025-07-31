'use client';
import { useEffect, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';
import axios from 'axios'; // Import axios

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All"); // Renamed for clarity
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [totalPages, setTotalPages] = useState(1); // New state for total pages
  const productsPerPage = 8; // Define how many products per page

  // Function to fetch products with pagination, search, and category filters
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products', {
        params: {
          page: currentPage,
          limit: productsPerPage,
          search: searchQuery,
          category: selectedCategory === "All" ? "" : selectedCategory, // Send empty string for "All"
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

  // Effect to fetch products whenever selectedCategory, searchQuery, or currentPage changes
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, currentPage]); // Dependencies for refetching

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle category tab click
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on new category selection
  };

  // Pagination Handlers
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
      <h1 className="text-3xl font-bold mb-4">Our Organic Products</h1>
      <CategoryTabs selected={selectedCategory} onSelect={handleCategorySelect} />

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by name..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>


      {loading ? (
        <div className="text-center py-10 text-xl text-gray-600">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-xl text-gray-600">No products found for your search/filter.</div>
      ) : (
        <ProductList products={products} />
      )}

      {/* Pagination Controls */}
      {!loading && products.length > 0 && (
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
    </main>
  );
}