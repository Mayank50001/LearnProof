import React, { useState } from 'react';
import { Youtube, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
const TopBar = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [importData, setImportData] = useState(null);
    const { token } = useAuth();

    const handleImport = async () => {
        if (!url.trim()) {
            toast.error("Please enter a Youtube URL");
            return;
        }

        setLoading(true);
        try {

            const response = await axios.post('http://127.0.0.1:8000/api/import/', {
                idToken: token,
                url: url
            });

            if (response.data.success) {
                setImportData(response.data.data);
                toast.success("Imported successfully");
                // You can trigger state update or navigate if needed
            } else {
                toast.error("⚠️ Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            toast.error("❌ Failed to import. Check URL or token.");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!importData) return;

        const toastId = toast.loading("Saving...");
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/save-learning/`, {
                idToken: token,
                data: importData,
            });

            toast.dismiss(toastId);
            toast.success("Learning Saved!");
            setImportData(null);
            setUrl('');
        } catch (err) {
            toast.dismiss(toastId);
            toast.error("Failed to save learning.");
            console.error(err);
        }
    };

    const handleCancel = () => {
        setImportData(null);
        setUrl('');
    }

    return (
        <>
            <div className="flex items-center justify-between bg-white border-b border-orange-100 p-4 shadow-sm sticky top-0 z-10">
                <div className="flex items-center w-full max-w-xl bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 gap-3">
                    <Youtube className="text-orange-500" />
                    <input
                        type="text"
                        placeholder="Paste YouTube video or playlist URL..."
                        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-500"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    />
                    <button
                        onClick={handleImport}
                        disabled={loading}
                        className="text-white bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1.5 rounded-lg text-sm font-medium hover:scale-105 transition"
                    >
                        {loading ? "Importing..." : "Import"}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {importData && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 space-y-4"
                        >
                            <h2 className="text-lg font-semibold">
                                Imported {importData.type === "playlist" ? "Playlist" : "Video"} Details
                            </h2>

                            <div className="space-y-2 text-sm text-gray-700">
                                <p>
                                    <strong>Title:</strong> {importData.title}
                                </p>
                                <p className="break-words">
                                    <strong>Description:</strong>{" "}
                                    {importData.description || "No description"}
                                </p>
                                <p>
                                    <strong>URL:</strong>{" "}
                                    <a
                                        href={importData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-orange-600 hover:underline break-all"
                                    >
                                        Open
                                    </a>
                                </p>
                                {importData.type === "playlist" && (
                                    <p>
                                        <strong>Videos:</strong> {importData.videos?.length || 0}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded hover:scale-105"
                                >
                                    Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TopBar;
