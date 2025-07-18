import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ContinueWatching = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            const CW = toast.loading("Loading your dedication...");
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/continue-watch/`, {
                    idToken: token,
                });

                if (res.data?.videos) {
                    setVideos(res.data.videos);
                }
                toast.success('Loaded your dedication...', { id: CW });
            } catch (err) {
                console.error('Error fetching continue watching videos: ', err);
                toast.error("Failed to fetch your history...", { id: CW });
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchVideos();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse space-y-4">
                        <div className="aspect-video bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (videos.length === 0) {
        return <div className="text-sm text-gray-600">You're all caught up! 🎉</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Continue Watching</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                    <motion.div
                        key={video.vid}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white rounded-xl border border-orange-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                    >
                        <div
                            onClick={() => navigate(`/classroom/${video.vid}`)}
                            className="aspect-video bg-gray-100 cursor-pointer relative group"
                        >
                            <img
                                src={`https://img.youtube.com/vi/${video.vid}/hqdefault.jpg`}
                                alt={video.name}
                                className="w-full h-full object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-12 w-12 text-white"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 text-md mb-1 truncate">
                                {video.name}
                            </h3>
                            <p className="text-sm text-gray-500 truncate">{video.description || 'No description available.'}</p>
                            <div className="mt-4 flex items-center  justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <Play size={16} className="text-orange-500" />
                                    <span>{Math.round(video.watch_progress)}% watched</span>
                                </div>
                                <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Resume</a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ContinueWatching;