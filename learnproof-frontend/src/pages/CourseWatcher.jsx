import { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function CourseWatcher() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [embedUrl, setEmbedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) navigate('/login');
  }, []);

  const handleFetch = async () => {
    setMessage('');
    setVideos([]);
    setEmbedUrl('');
    setSelectedVideo(null);

    if (!url.trim()) return;

    setLoading(true);
    try {
      if (url.includes('playlist?list=')) {
        setMessage('🎞 Playlist detected. Fetching...');
        const res = await API.post('/get_playlist/', { url });
        setVideos(res.data.videos || []);
        if ((res.data.videos || []).length === 0) {
          toast.error("No videos found in the playlist.");
        } else {
          toast.success("Playlist loaded successfully!");
        }
      } else {
        const res = await API.post('/get_embed/', { url });
        setEmbedUrl(res.data.embed_url);
        toast.success("Video loaded!");
      }
    } catch (err) {
      toast.error("❌ Error fetching video data");
    }
    setLoading(false);
  };

  const handleVideoSelect = async (title) => {
    const video = videos.find((v) => v.title === title);
    if (video) {
      setSelectedVideo(video);
      toast.success(`Loaded "${video.title}"`);
      try {
        const res = await API.post('/get_embed/', { url: video.url });
        setEmbedUrl(res.data.embed_url);
      } catch (err) {
        toast.error("❌ Error loading video");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-xl shadow-xl transition-all">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800 dark:text-white">
        📺 Course Watcher
      </h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter video or playlist URL"
          className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={handleFetch}
          className="px-5 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-all"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>

      {videos.length > 0 && (
        <select
          className="w-full p-3 rounded-xl mb-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white shadow-inner focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleVideoSelect(e.target.value)}
        >
          <option>Select a video</option>
          {videos.map((video, idx) => (
            <option key={idx} value={video.title}>
              {video.title}
            </option>
          ))}
        </select>
      )}

      {embedUrl && (
        <div className="mt-8 rounded-xl overflow-hidden shadow-lg transform transition hover:scale-[1.01]">
          <iframe
            width="100%"
            height="450"
            src={embedUrl}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="rounded-xl"
          ></iframe>
        </div>
      )}

      {message && (
        <div className="mt-4 text-center text-gray-700 dark:text-gray-300 font-medium">
          {message}
        </div>
      )}
    </div>
  );
}

export default CourseWatcher;
