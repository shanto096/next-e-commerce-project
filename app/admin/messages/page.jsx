"use client"
import { useState, useEffect, useCallback } from 'react';
import { NextResponse } from 'next/server';



const ViewMessageAndUserDetailModal = ({ isOpen, onClose, message }) => {
    if (!isOpen || !message) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/50">
            <div className="bg-white border-2 text-black border-black p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Message and User Details</h2>
                <p><strong>Email:</strong> {message.email}</p>
                <p><strong>User ID:</strong> {message.userId}</p>
                <p><strong>Subject:</strong> {message.subject}</p>
                <p><strong>Message:</strong> {message.message}</p>
                <p><strong>Status:</strong> {message.status}</p>
                <p><strong>Sent At:</strong> {new Date(message.createdAt).toLocaleString()}</p>
                <div className="flex justify-end space-x-2 mt-4">
                    <button className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const AdminMessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserMessages, setSelectedUserMessages] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedMessageDetail, setSelectedMessageDetail] = useState(null); // New state for individual message detail
    const [isMessageDetailModalOpen, setIsMessageDetailModalOpen] = useState(false); // New state for message detail modal

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Number of messages per page
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // 'pending', 'read', or '' for all

    const fetchMessages = useCallback(async (pageNum = page, search = searchQuery, status = statusFilter) => {
        try {
            setLoading(true);
            let url = `/api/message?page=${pageNum}&limit=${limit}`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }
            if (status && (status === 'pending' || status === 'read')) {
                url += `&status=${encodeURIComponent(status)}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || `Error: ${res.status}`);
            }
            setMessages(data.data);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [page, searchQuery, statusFilter]);

    useEffect(() => {
        fetchMessages(page, searchQuery, statusFilter);
    }, [fetchMessages, page, searchQuery, statusFilter]);

    const handleDelete = async (messageId) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            setLoading(true);
            const res = await fetch('/api/message', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || `Error: ${res.status}`);
            }

            // If the last message on the current page is deleted, go to the previous page
            if (messages.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                // Otherwise, refetch messages for the current page
                fetchMessages(page, searchQuery, statusFilter);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleViewUserMessages = (email) => {
        const userMessages = messages.filter(msg => msg.email === email);
        setSelectedUserMessages(userMessages);
        setIsViewModalOpen(true);
    };

    const handleCloseUserMessages = () => {
        setSelectedUserMessages(null);
        setIsViewModalOpen(false);
    };

    const handleViewMessageDetail = async (message) => {
        setSelectedMessageDetail(message);
        setIsMessageDetailModalOpen(true);

        // Update message status to 'read' if it's 'pending'
        if (message.status === 'pending') {
            try {
                const res = await fetch('/api/message', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ messageId: message._id, status: 'read' }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error('Failed to update message status:', errorData.message);
                    // Optionally, show an error to the user
                } else {
                    // Update local state to reflect the 'read' status
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg._id === message._id ? { ...msg, status: 'read' } : msg
                        )
                    );
                }
            } catch (err) {
                console.error('Error updating message status:', err);
                // Optionally, show an error to the user
            }
        }
    };

    const handleCloseMessageDetail = () => {
        setSelectedMessageDetail(null);
        setIsMessageDetailModalOpen(false);
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

    if (loading) return <div className="p-6 min-h-screen"><p className="text-blue-500 text-lg animate-pulse">Loading messages...</p></div>;
    if (error) return <div className="p-6 min-h-screen"><p className="text-red-500 text-lg">Error: {error}</p></div>;

    return (
        <div className="p-6 min-h-screen">
            <h1 className="text-2xl font-semibold mb-4">Admin Messages ({messages?.length || 0})</h1>
            

            <ViewMessageAndUserDetailModal
                isOpen={isMessageDetailModalOpen}
                onClose={handleCloseMessageDetail}
                message={selectedMessageDetail}
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {/* Search Bar */}
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search messages by email or subject..."
                        className="w-full border px-3 py-2 rounded shadow-sm"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                {/* Status Filter */}
                <div className="w-full sm:w-auto">
                    <select
                        className="w-full border px-3 py-2 rounded shadow-sm bg-green-600"
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                <table className="min-w-full table-auto text-sm text-left text-gray-700">
                    <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Sent At</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <tr key={message._id} className="border-b hover:bg-gray-50 transition duration-200">
                                    <td className="px-6 py-4 font-medium">{message.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${message.status === 'read' ? 'text-green-600' : 'text-red-600'}`}>
                                            {message.status ? message.status.toUpperCase() : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{new Date(message.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => handleDelete(message._id)}
                                            className="text-red-500 hover:text-red-700"
                                            title="Delete Message"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.927a2.25 2.25 0 0 1-2.244-2.077L4.74 5.91a2.25 2.25 0 0 1-.346-1.022l-1.022-.165m1.022.165 2.244-2.244m0 0 2.244-2.244m-2.244 2.244 2.244 2.244m0 0 2.244 2.244m-2.244-2.244-2.244-2.244m0 0 2.244-2.244m0 0 2.244 2.244M3 6h18" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleViewMessageDetail(message)}
                                            className="text-green-500 hover:text-green-700 ml-2"
                                            title="View Message and User Detail"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-4">No messages found.</td>
                            </tr>
                        )}
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
};

export default AdminMessagePage;