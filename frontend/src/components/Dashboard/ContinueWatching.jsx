import { useState , useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

const ContinueWatching = () => {
    const { token } = useAuth();
    const [loading , setLoading] = useState(true);
    const [videos , setVideos] = useState([]);
    const [error , setError] = useState(null);

    useEffect(()=>{
        const fetchVideos = async () => {
            try{
                const res = axios.post(`${import.meta.env.VITE_BACKEND_URL}/continue-watch/` , {
                    idToken: token,
                });

                if(res.data?.videos){
                    setVideos(res.data.videos);
                } else {
                    setError('No videos found.');
                }
            } catch (err) {
                console.error('Error fetching continue watching videos: ' , err);
                setError('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if(token){
            fetchVideos();
        }
    } , [token]);

    if (loading) {
        return <div className="text-sm text-gray-500">Loading your videos...</div>;
    }

    if (error) {
        return <div className="text-sm text-red-500">{error}</div>;
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