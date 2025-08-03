"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const SeeProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/50">
      <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Product Details</h2>
        <img src={product.productImage} alt={product.name} className="w-full h-48 object-cover mb-4" />
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Price:</strong> ${product.price}</p>
        <p><strong>Quantity:</strong> {product.quantity} {product.unit}</p>
        <p><strong>Status:</strong> <span className={`font-semibold ${product.isTrending ? 'text-green-600' : 'text-gray-500'}`}>{product.isTrending ? "Trending" : "Not Trending"}</span></p>
        <p><strong>Description:</strong> {product.description}</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

function CreateProductModal({ isOpen, onClose, onProductCreated }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Vegetables");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [isTrending, setIsTrending] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("unit", unit);
      formData.append("isTrending", isTrending);
      formData.append("productImage", productImage);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      setName("");
      setTitle("");
      setCategory("Vegetables");
      setDescription("");
      setPrice("");
      setQuantity("");
      setUnit("pcs");
      setIsTrending(false);
      setProductImage(null);
      onProductCreated();
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/50">
      <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 ">Create New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium mb-1 ">Name</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Title</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Category</label>
            <select className="w-full border px-3 py-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Bread">Bread</option>
              <option value="Meat">Meat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Price</label>
            <input type="number" className="w-full border px-3 py-2 rounded" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 ">Quantity</label>
              <input type="number" className="w-full border px-3 py-2 rounded" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1 ">Unit</label>
              <select className="w-full border px-3 py-2 rounded" value={unit} onChange={(e) => setUnit(e.target.value)} required>
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Status</label>
            <select className="w-full border px-3 py-2 rounded" value={isTrending} onChange={(e) => setIsTrending(e.target.value === 'true')}>
              <option value={false}>Not Trending</option>
              <option value={true}>Trending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Description</label>
            <textarea className="w-full border px-3 py-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Product Image</label>
            <input type="file" accept="image/*" className="w-full" onChange={handleImageChange} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditProductModal({ isOpen, onClose, product, onProductUpdated }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [isTrending, setIsTrending] = useState(false);
  const [productImage, setProductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setTitle(product.title || "");
      setCategory(product.category || "");
      setDescription(product.description || "");
      setPrice(product.price || "");
      setQuantity(product.quantity || "");
      setUnit(product.unit || "pcs");
      setIsTrending(product.isTrending || false);
      setProductImage(product.productImage || "");
    }
  }, [product]);

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("unit", unit);
      formData.append("isTrending", isTrending);
      if (productImage) {
        formData.append("productImage", productImage);
      }

      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update product");

      onProductUpdated();
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/50">
      <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 ">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 ">Name</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Bread">Bread</option>
              <option value="Meat">Meat</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Price</label>
            <input
              type="number"
              step="0.01"
              className="w-full border px-3 py-2 rounded"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1 ">Quantity</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-sm font-medium mb-1 ">Unit</label>
              <select
                className="w-full border px-3 py-2 rounded"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              >
                <option value="pcs">pcs</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Status</label>
            <select className="w-full border px-3 py-2 rounded" value={isTrending} onChange={(e) => setIsTrending(e.target.value === 'true')}>
              <option value={false}>Not Trending</option>
              <option value={true}>Trending</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 ">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image (optional)</label>
            {productImage && (
              <img src={productImage} alt="Current News Image" className="w-24 h-24 object-cover mb-2 rounded" />
            )}
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={handleImageChange}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { users } = useAuth();
  console.log(users);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [trendingStatus, setTrendingStatus] = useState("All");

  const fetchProducts = async (pageNum = page, search = searchQuery, category = selectedCategory, trending = trendingStatus) => {
    try {
      setLoading(true);
      const url = `/api/products?page=${pageNum}&limit=${limit}&search=${search}&category=${category}&isTrending=${trending}`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page, searchQuery, selectedCategory, trendingStatus);
  }, [page, searchQuery, selectedCategory, trendingStatus]);

  const handleProductCreated = () => {
    fetchProducts(page, searchQuery, selectedCategory, trendingStatus);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete product");
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchProducts(page, searchQuery, selectedCategory, trendingStatus);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleProductUpdated = () => {
    fetchProducts(page, searchQuery, selectedCategory, trendingStatus);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleTrendingChange = (e) => {
    setTrendingStatus(e.target.value);
    setPage(1);
  };

  const productCategories = ["All", "Vegetables", "Fruits", "Bread", "Meat"];
  const trendingOptions = ["All", "Trending", "Not Trending"];

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Admin Product Management ({products?.length || 0})</h1>
      <button
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        + Create Product
      </button>

      <div className="mb-4 flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search by product name..."
          className="flex-1 border px-3 py-2 rounded shadow-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <select
          className="w-1/4 border px-3 py-2 rounded shadow-sm"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {productCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className="w-1/4 border px-3 py-2 rounded shadow-sm"
          value={trendingStatus}
          onChange={handleTrendingChange}
        >
          {trendingOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductCreated={handleProductCreated}
      />
      <EditProductModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={editingProduct}
        onProductUpdated={handleProductUpdated}
      />
      <SeeProductModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        product={selectedProduct}
      />
      {loading && <p className="text-blue-500 text-lg animate-pulse">Loading...</p>}
      {error && <p className="text-red-500 text-lg">Error: {error.message}</p>}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4">
                  <img src={product.productImage} alt={product.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">$ {product.price}</td>
                <td className="px-6 py-4">{product.quantity} {product.unit}</td>
                <td className="px-6 py-4">
                  <span className={`py-1 px-2 rounded-full text-xs font-semibold ${product.isTrending ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                    {product.isTrending ? "Trending" : "Not Trending"}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleView(product)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-2">Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}