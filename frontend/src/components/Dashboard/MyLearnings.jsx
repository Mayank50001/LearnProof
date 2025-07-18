import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function useDebouncedValue(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}

const MyLearnings = () => {
    const { token } = useAuth();

    const [activeTab, setActiveTab] = useState("videos");
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [videoPagination, setVideoPagination] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const debouncedSearch = useDebouncedValue(searchQuery);

    useEffect(() => {
        if (!token) return;
        setPage(1); // reset page when search changes
    }, [debouncedSearch]);

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
                        searchQuery: debouncedSearch,
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
    }, [token, page, debouncedSearch]);

    const handleVideoDelete = async (videoId) => {
        if (!token) return;
        if (!window.confirm("Are you sure you want to delete this video?")) return;

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-video/`, {
                idToken: token,
                videoId,
            });
            toast.success("Video deleted!");

            setVideos(prev => prev.filter(v => v.vid !== videoId));

            // Also remove from playlists if needed
            setPlaylists(prev =>
                prev.map(p => ({
                    ...p,
                    videos: p.videos.filter(v => v.vid !== videoId),
                }))
            );
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete video");
        }
    };

    const handlePlaylistDelete = async (playlist, playlistId) => {
        if (!token) return;
        if (!window.confirm("Are you sure you want to delete this playlist? All videos in it will also be removed.")) return;

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-playlist/`, {
                idToken: token,
                playlistId,
            });
            toast.success("Playlist deleted!");

            setPlaylists(prev => prev.filter(p => p.pid !== playlistId));
            setVideos(prev => prev.filter(v => !playlist.videos.some(pv => pv.vid === v.vid)));
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete playlist");
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-600">
                Loading your learnings...
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-4 mb-2">
                <button
                    onClick={() => {
                        setActiveTab("videos");
                        setSearchQuery("");
                    }}
                    className={`px-4 py-2 rounded-lg ${activeTab === "videos"
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                        }`}
                >
                    Videos
                </button>
                <button
                    onClick={() => {
                        setActiveTab("playlists");
                        setSearchQuery("");
                    }}
                    className={`px-4 py-2 rounded-lg ${activeTab === "playlists"
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                        }`}
                >
                    Playlists
                </button>
            </div>

            {/* Search Bar */}
            <div>
                <input
                    type="text"
                    placeholder={`Search ${activeTab}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full max-w-xs rounded transition bg-white px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-1 focus:ring-orange-500 shadow"
                />
            </div>

            {activeTab === "videos" && (
                <div className="space-y-4">
                    {videos.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <div className="text-4xl mb-2">🎬</div>
                            <p>No videos here yet.</p>
                            <p className="text-sm">Start by importing some YouTube videos to learn!</p>
                        </div>
                    ) : (
                        <>
                            {videos.map((video) => (
                                <motion.div
                                    key={video.vid}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-4 rounded-lg shadow flex gap-4 items-center"
                                >
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
                                            <div
                                                className="h-2 bg-green-500 rounded"
                                                style={{
                                                    width: `${Math.round(video.watch_progress || 0)}%`,
                                                }}
                                            ></div>
                                        </div>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Watched: {Math.round(video.watch_progress || 0)}%
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/classroom/${video.vid}`)}
                                        className="px-4 py-1.5 bg-orange-500 text-white rounded hover:scale-110 transition text-sm"
                                    >
                                        Watch
                                    </button>
                                    <button
                                        onClick={() => handleVideoDelete(video.vid)}
                                        className="px-4 py-1.5 bg-red-500 text-white rounded hover:scale-110 transition text-sm"
                                    >
                                        Delete
                                    </button>
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
                        </>
                    )}


                </div>
            )}

            {activeTab === "playlists" && (
                <div className="space-y-4">
                    {playlists.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            <div className="text-4xl mb-2">📂</div>
                            <p>No playlists here yet.</p>
                            <p className="text-sm">You can create or import a playlist to get started.</p>
                        </div>
                    ) : (
                        <>
                            {playlists.map((pl) => (
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
                                        <button
                                            onClick={() => handlePlaylistDelete(pl, pl.pid)}
                                            className="px-4 py-1.5 bg-red-500 text-white rounded hover:scale-110 transition text-sm"
                                        >
                                            Delete
                                        </button>

                                        <div className="mt-2 space-y-2">
                                            {pl.videos.map((video) => (
                                                <div
                                                    key={video.vid}
                                                    className="flex items-center gap-4 p-2 rounded mt-4 shadow-sm"
                                                >
                                                    <img
                                                        src={`https://img.youtube.com/vi/${video.vid}/mqdefault.jpg`}
                                                        alt={video.name}
                                                        className="w-20 h-12 object-cover rounded"
                                                    />

                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-medium">{video.name}</h4>
                                                        <p className="text-xs text-gray-500 line-clamp-1">
                                                            {video.description || "No description"}
                                                        </p>

                                                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                            <div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                style={{
                                                                    width: `${Math.round(
                                                                        video.watch_progress || 0
                                                                    )}%`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => navigate(`/classroom/${video.vid}`)}
                                                        className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:scale-105 transition"
                                                    >
                                                        Watch
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </details>
                                </motion.div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyLearnings;
