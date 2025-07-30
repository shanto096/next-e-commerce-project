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
        <p><strong>Description:</strong> {product.description}</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600" onClick={onClose}>Close</button>
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
      formData.append("productImage", productImage);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create product");

      // Reset form
      setName("");
      setTitle("");
      setCategory("Vegetables");
      setDescription("");
      setPrice("");
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
            <button type="button" className="px-4 py-2 rounded bg-red-500 hover:bg-red-600" onClick={onClose} disabled={loading}>Cancel</button>
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
            <label className="block text-sm font-medium mb-1 ">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
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
          <div>
            <label className="block text-sm font-medium mb-1 ">Image (optional)</label>
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
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
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

  const fetchProducts = async (pageNum = page) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products?page=${pageNum}&limit=${limit}`);
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
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleProductCreated = () => {
    fetchProducts(page);
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
      // If last item on page deleted, go to previous page if not on first
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchProducts(page);
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
    fetchProducts(page);
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

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Admin Product Management ({products?.length || 0})</h1>
      <button
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        + Create Product
      </button>
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
              <th className="px-6 py-3">Image</th> {/* Column for images */}
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th> {/* New column for price */}
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product._id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4">
                  <img src={product.productImage} alt={product.name} className="w-16 h-16 object-cover" /> {/* Displaying the image */}
                </td>
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">$ {product.price}</td> {/* Displaying the price */}
                <td className="px-6 py-4 space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleView(product)}>
                    View
                  </button> {/* New View button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
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
