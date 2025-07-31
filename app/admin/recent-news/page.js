'use client';
import { useEffect, useState } from "react";
// Assuming useAuth is correctly set up for admin checks if needed
// import { useAuth } from "../../context/AuthContext";

const SeeNewsModal = ({ isOpen, onClose, newsArticle }) => {
  if (!isOpen || !newsArticle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/50">
      <div className="bg-white border-2 border-black p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">News Article Details</h2>
        <img src={newsArticle.image} alt={newsArticle.title} className="w-full h-48 object-cover mb-4" />
        <p><strong>Title:</strong> {newsArticle.title}</p>
        <p><strong>Description:</strong> {newsArticle.description}</p>
        <p><strong>Created At:</strong> {new Date(newsArticle.createdAt).toLocaleString()}</p>
        <div className="flex justify-end space-x-2">
          <button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

function CreateNewsModal({ isOpen, onClose, onNewsCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newsImage, setNewsImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    setNewsImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("newsImage", newsImage);

      const res = await fetch("/api/recent-news", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create news article");

      // Reset form
      setTitle("");
      setDescription("");
      setNewsImage(null);
      onNewsCreated();
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
        <h2 className="text-xl font-semibold mb-4">Create New News Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" className="w-full border px-3 py-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border px-3 py-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">News Image</label>
            <input type="file" accept="image/*" className="w-full" onChange={handleImageChange} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <div className="flex justify-end space-x-2">
            <button type="button" className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditNewsModal({ isOpen, onClose, newsArticle, onNewsUpdated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [newsImage, setNewsImage] = useState(null); // For new image upload
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (newsArticle) {
      setTitle(newsArticle.title || "");
      setDescription(newsArticle.description || "");
      setNewsImage(null); // Clear previous image selection
    }
  }, [newsArticle]);

  const handleImageChange = (e) => {
    setNewsImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (newsImage) {
        formData.append("newsImage", newsImage);
      }

      const res = await fetch(`/api/recent-news/${newsArticle._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update news article");

      onNewsUpdated();
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
        <h2 className="text-xl font-semibold mb-4">Edit News Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image (optional)</label>
            {newsArticle.image && (
                <img src={newsArticle.image} alt="Current News Image" className="w-24 h-24 object-cover mb-2 rounded" />
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
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
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

export default function AdminNewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState("");

  const fetchNews = async (pageNum = page, search = searchQuery) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/recent-news?page=${pageNum}&limit=${limit}&search=${search}`);
      const data = await response.json();
      setNews(data.data);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(page, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleNewsCreated = () => {
    fetchNews(page, searchQuery);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news article?")) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete news article");

      if (news.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchNews(page, searchQuery);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditingNews(article);
    setEditModalOpen(true);
  };

  const handleNewsUpdated = () => {
    fetchNews(page, searchQuery);
  };

  const handleView = (article) => {
    setSelectedNews(article);
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
    setPage(1); // Reset to first page on new search
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">Admin News Management ({news?.length || 0})</h1>
      <button
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setIsCreateModalOpen(true)}
      >
        + Create News Article
      </button>
      <CreateNewsModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNewsCreated={handleNewsCreated}
      />
      <EditNewsModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        newsArticle={editingNews}
        onNewsUpdated={handleNewsUpdated}
      />
      <SeeNewsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        newsArticle={selectedNews}
      />

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search news by title..."
          className="w-full border px-3 py-2 rounded shadow-sm"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {loading && <p className="text-blue-500 text-lg animate-pulse">Loading...</p>}
      {error && <p className="text-red-500 text-lg">Error: {error.message}</p>}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto text-sm text-left text-gray-700">
          <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {news?.map((article) => (
              <tr key={article._id} className="border-b hover:bg-gray-50 transition duration-200">
                <td className="px-6 py-4">
                  <img src={article.image} alt={article.title} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="px-6 py-4 font-medium">{article.title}</td>
                <td className="px-6 py-4 truncate max-w-xs">{article.description}</td> {/* Truncate long descriptions */}
                <td className="px-6 py-4 space-x-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleEdit(article)}>
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleDelete(article._id)}>
                    Delete
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs" onClick={() => handleView(article)}>
                    View
                  </button>
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