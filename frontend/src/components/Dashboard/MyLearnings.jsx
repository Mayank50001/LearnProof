import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const MyLearnings = () => {
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState("videos");
    const [videos, setVideos] = useState([]);
    const [videoPagination, setVideoPagination] = useState({});
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!token) return;

        const fetchLearnings = async () => {
            setLoading(true);
            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/my-learnings/`,
                    {
                        idToken: token,
                        page: page,
                    }
                );
                setVideos(res.data.videos.results);
                setVideoPagination(res.data.videos);
                setPlaylists(res.data.playlists);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch learnings");
            } finally {
                setLoading(false);
            }
        };

        fetchLearnings();
    }, [token, page]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-600">
                Loading your learnings...
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab("videos")}
                    className={`px-4 py-2 rounded-lg ${activeTab === "videos"
                        ? "bg-orange-500 text-white"
                        : "bg-white "
                        }`}
                >
                    Videos
                </button>
                <button
                    onClick={() => setActiveTab("playlists")}
                    className={`px-4 py-2 rounded-lg ${activeTab === "playlists"
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                        }`}
                >
                    Playlists
                </button>
            </div>

            {activeTab === "videos" && (
                <div className="space-y-4">
                    {videos.map((video) => (
                        <motion.div
                            key={video.vid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white- p-4 rounded-lg shadow flex gap-4 items-center "
                        >

                            {/* Thumbnail */}
                            <img
                                src={`https://img.youtube.com/vi/${video.vid}/mqdefault.jpg`}
                                alt={video.name}
                                className="w-24 h-16 rounded object-cover flex-shrink-0"
                            />

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800">{video.name}</h3>
                                <p className="text-sm text-gray-600 truncate max-w-xs">
                                    {video.description || "No description"}
                                </p>

                                <div className="mt-2 w-full bg-gray-200 h-2 rounded">
                                    <div className="h-2 bg-green-500 rounded" style={{ width: `${video.watch_progress || 0}%` }}></div>
                                </div>

                                <p className="text-xs text-gray-500 mt-1">
                                    Watched: {Math.round(video.watch_progress || 0)}%
                                </p>
                            </div>

                            <a href={`/watch/${video.vid}`} className="px-4 py-1.5 bg-orange-500 text-white rounded hover:scale-150 transition text-sm">
                                Watch
                            </a>
                        </motion.div>
                    ))}

                    {/* Pagination Controls */}
                    <div className="flex gap-4 mt-4">
                        {videoPagination.previous && (
                            <button
                                onClick={() => setPage(page - 1)}
                                className="px-3 py-1 bg-white rounded hover:bg-orange-100"
                            >
                                Previous
                            </button>
                        )}
                        {videoPagination.next && (
                            <button
                                onClick={() => setPage(page + 1)}
                                className="px-3 py-1 bg-white rounded hover:bg-orange-100"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "playlists" && (
                <div className="space-y-4">
                    {playlists.map((pl, idx) => (
                        <motion.div
                            key={pl.pid}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <details>
                                <summary className="font-semibold cursor-pointer">
                                    {pl.name}
                                </summary>

                                <div className="mt-2 space-y-2">
                                    {pl.videos.map((video) => (
                                        <div
                                            key={video.vid}
                                            className="flex items-center gap-4 p-2 rounded mt-4 shadow-sm"
                                        >
                                            {/* Thumbnail */}
                                            <img
                                                src={`https://img.youtube.com/vi/${video.vid}/mqdefault.jpg`}
                                                alt={video.name}
                                                className="w-20 h-12 object-cover rounded"
                                            />

                                            {/* Info */}
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium">{video.name}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                    {video.description || "No description"}
                                                </p>

                                                {/* Progress bar */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{ width: `${Math.round(video.watch_progress || 0)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Watch Button */}
                                            <a
                                                href={`/watch/${video.vid}`}
                                                className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:scale-105 transition"
                                            >
                                                Watch
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </details>
                        </motion.div>
                    ))}
                </div>
            )}

        </>

    );
};

export default MyLearnings;
