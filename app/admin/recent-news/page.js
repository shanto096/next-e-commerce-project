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
                <p><strong>Status:</strong> <span className={`font-semibold ${newsArticle.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{newsArticle.status.toUpperCase()}</span></p>
                <p><strong>Created At:</strong> {new Date(newsArticle.createdAt).toLocaleString()}</p>
                <div className="flex justify-end space-x-2 mt-4">
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
    const [status, setStatus] = useState("active"); // New state for status, default to 'active'
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
            formData.append("status", status); // Append status to form data

            const res = await fetch("/api/recent-news", { // Changed to /api/news
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create news article");

            // Reset form
            setTitle("");
            setDescription("");
            setNewsImage(null);
            setStatus("active"); // Reset status to default
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
                    <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="not active">Not Active</option>
                        </select>
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
    const [status, setStatus] = useState(""); // State for status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (newsArticle) {
            setTitle(newsArticle.title || "");
            setDescription(newsArticle.description || "");
            setStatus(newsArticle.status || "active"); // Set initial status from newsArticle
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
            formData.append("status", status); // Append status to form data
            if (newsImage) {
                formData.append("newsImage", newsImage);
            }

            const res = await fetch(`/api/recent-news/${newsArticle._id}`, { // Changed to /api/news as per previous routes
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
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            required
                        >
                            <option value="active">Active</option>
                            <option value="not active">Not Active</option>
                        </select>
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
    const [statusFilter, setStatusFilter] = useState(""); // New state for status filter

    const fetchNews = async (pageNum = page, search = searchQuery, status = statusFilter) => {
        try {
            setLoading(true);
            let url = `/api/recent-news?page=${pageNum}&limit=${limit}`; // Changed to /api/news
            if (search) {
                url += `&search=${search}`;
            }
            // Only add status filter if it's 'active' or 'not active'.
            // If it's an empty string ("All Statuses"), don't add the parameter
            // so the backend can apply its default logic (showing all or just active).
            if (status && (status === 'active' || status === 'not active')) {
                url += `&status=${status}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch news articles");
            }
            setNews(data.data);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(page, searchQuery, statusFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchQuery, statusFilter]); // Add statusFilter to dependencies

    const handleNewsCreated = () => {
        fetchNews(1, searchQuery, statusFilter); // Fetch first page after creation
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this news article?")) return;
        try {
            setLoading(true);
            const res = await fetch(`/api/recent-news/${id}`, { // Changed to /api/news
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to delete news article");

            if (news.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                fetchNews(page, searchQuery, statusFilter);
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
        fetchNews(page, searchQuery, statusFilter);
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

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(1); // Reset to first page on new filter
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

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Search Bar */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search news by title..."
                        className="w-full border px-3 py-2 rounded shadow-sm"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                {/* Status Filter */}
                <div className="w-full sm:w-auto">
                    <select
                        className="w-full border px-3 py-2 rounded shadow-sm bg-white"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                    >
                        <option value="">All Statuses</option> {/* Value is an empty string */}
                        <option value="active">Active</option>
                        <option value="not active">Not Active</option>
                    </select>
                </div>
            </div>

            {loading && <p className="text-blue-500 text-lg animate-pulse">Loading...</p>}
            {error && <p className="text-red-500 text-lg">Error: {error.message}</p>}
            <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                <table className="min-w-full table-auto text-sm text-left text-gray-700">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Title</th>
                           
                            <th className="px-6 py-3">Status</th> {/* New column for status */}
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
                               
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${article.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                        {article.status ? article.status.toUpperCase() : 'N/A'}
                                    </span>
                                </td> {/* Display status */}
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