"use client"
import { useState, useEffect } from 'react';
import { NextResponse } from 'next/server';

const AdminMessagePage = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserMessages, setSelectedUserMessages] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/message');
                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const handleDelete = async (messageId) => {
        try {
            const res = await fetch('/api/message', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messageId }),
            });
            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }
            setMessages(messages.filter(msg => msg._id !== messageId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleViewUserMessages = (email) => {
        const userMessages = messages.filter(msg => msg.email === email);
        setSelectedUserMessages(userMessages);
    };

    const handleCloseUserMessages = () => {
        setSelectedUserMessages(null);
    };

    if (loading) return <div>Loading messages...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Messages</h1>
            {selectedUserMessages ? (
                <div className=" shadow-md rounded p-4 mb-4">
                    <h2 className="text-xl font-semibold mb-2">Messages from {selectedUserMessages[0]?.email}</h2>
                    <button
                        onClick={handleCloseUserMessages}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mb-4"
                    >
                        Back to all messages
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedUserMessages.map((message) => (
                            <div key={message._id} className="bg-gray-100 p-3 rounded">
                                <p><strong>Subject:</strong> {message.subject}</p>
                                <p><strong>Message:</strong> {message.message}</p>
                                <p><strong>Status:</strong> {message.status}</p>
                                <p><strong>Sent At:</strong> {new Date(message.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Subject</th>
                                <th className="py-2 px-4 border-b">Message</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Sent At</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((message) => (
                                <tr key={message._id}>
                                    <td className="py-2 px-4 border-b">{message.email}</td>
                                    <td className="py-2 px-4 border-b">{message.subject}</td>
                                    <td className="py-2 px-4 border-b">{message.message}</td>
                                    <td className="py-2 px-4 border-b">{message.status}</td>
                                    <td className="py-2 px-4 border-b">{new Date(message.createdAt).toLocaleString()}</td>
                                    <td className="py-2 px-4 border-b flex space-x-2">
                                        <button
                                            onClick={() => handleDelete(message._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => handleViewUserMessages(message.email)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                                        >
                                            View All User Messages
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminMessagePage;
