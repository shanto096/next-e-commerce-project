 'use client';
import { useEffect, useState } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductList from '../components/ProductList';
import axios from 'axios'; // Import axios

export default function HomePage() {
  const [selected, setSelected] = useState("All");
  const [products, setProducts] = useState([]); // State to hold products
  const [loading, setLoading] = useState(true); // State to manage loading


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products'); // Use axios to fetch products
        setProducts(response.data.data); // Assuming the products are in data.data
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProducts();
  }, []); // Empty dependency array to run once on mount
  // console.log( products);
  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Our Organic Products</h1>
      <CategoryTabs selected={selected} onSelect={setSelected} />
       <ProductList selectedCategory={selected} products={products} /> 
     
    </main>
  );
}
