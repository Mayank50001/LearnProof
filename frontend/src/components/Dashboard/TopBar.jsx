import React, { useState } from 'react';
import { Youtube, Search } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
const TopBar = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const handleImport = async () => {
        if (!url.trim()) return;

        setLoading(true);
        try {
            
            const response = await axios.post('http://127.0.0.1:8000/api/import/', {
                idToken: token,
                url: url
            });

            if (response.data.success) {
                alert("✅ Imported successfully!");
                // You can trigger state update or navigate if needed
            } else {
                alert("⚠️ Something went wrong!");
            }
        } catch (err) {
            console.error(err);
            alert("❌ Failed to import. Check URL or token.");
        } finally {
            setLoading(false);
        }
    };

    return (
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
    );
};

export default TopBar;
