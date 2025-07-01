// Dashboard/CompletedSection.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const CompletedSection = () => {
    const { token } = useAuth();
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompleted = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/dashboard/completed/`, {
                    params: { idToken: token },
                });

                if (res.data) {
                    setVideos(res.data.videos || []);
                    setPlaylists(res.data.playlists || []);
                }
            } catch (err) {
                console.error('Error fetching completed data:', err);
                setError('Failed to load completed content.');
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchCompleted();
    }, [token]);

    if (loading) return <div className="text-sm text-gray-500">Loading your completed content...</div>;
    if (error) return <div className="text-sm text-red-500">{error}</div>;

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
                                <div className="aspect-video bg-gray-100">
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${video.vid}`}
                                        title={video.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
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
