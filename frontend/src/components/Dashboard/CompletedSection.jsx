// Dashboard/CompletedSection.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CompletedSection = () => {
    const { token } = useAuth();
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompleted = async () => {
            const CS = toast.loading("Fetching your completions....");
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/complete/`, {
                    idToken: token,
                });

                if (res.data) {
                    setVideos(res.data.videos || []);
                    setPlaylists(res.data.playlists || []);
                }
                toast.success("✅ Completed content loaded!", { id: CS });
            } catch (err) {
                toast.error("❌ Failed to load completed content.", { id: loadingToast });
                console.log('Failed to load completed content.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchCompleted();
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

    return (
        <div className="space-y-10">
            {/* Completed Videos */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Completed Videos</h2>
                {videos.length === 0 ? (
                    <p className="text-sm text-gray-600">No completed videos yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video, index) => (
                            <motion.div
                                key={video.vid}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-300"
                            >
                                <div
                                    onClick={() => navigate(`/classroom/${video.vid}`)}
                                    className='aspect-video bg-gray-100 cursor-pointer relative group'
                                >
                                    <img src={`https://img.youtube.com/vi/${video.vid}/hqdefault.jpg`} alt={video.name} className='w-full h-full object-cover rounded' />
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
                                    <h3 className="font-semibold text-gray-800 text-md truncate">{video.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{video.description || 'No description available.'}</p>
                                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                                        <CheckCircle size={16} />
                                        Completed
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Completed Playlists */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Completed Playlists</h2>
                {playlists.length === 0 ? (
                    <p className="text-sm text-gray-600">No completed playlists yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {playlists.map((playlist, index) => (
                            <motion.div
                                key={playlist.playlist_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 p-5"
                            >
                                <h3 className="font-semibold text-lg text-gray-800 truncate mb-1">
                                    {playlist.title}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">{playlist.description || 'No description'}</p>
                                <div className="mt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <CheckCircle size={16} />
                                    All videos completed
                                </div>
                                <a
                                    href={`https://youtube.com/playlist?list=${playlist.playlist_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-orange-600 mt-2 inline-block hover:underline"
                                >
                                    View Playlist
                                </a>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompletedSection;
