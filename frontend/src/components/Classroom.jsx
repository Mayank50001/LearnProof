import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  PlayCircle,
  Play,
  ArrowLeft,
  CheckCircle,
  Clock,
  BookOpen
} from "lucide-react";

const Classroom = () => {
  const { token } = useAuth();
  const { videoId } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    const fetchClassroom = async () => {
      const loader = toast.loading("Loading classroom...");
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/classroom/`,
          {
            idToken: token,
            videoId: videoId,
          }
        );

        setVideo(res.data.video);
        setPlaylist(res.data.playlist);
        toast.success("Classroom loaded", { id: loader });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load classroom", { id: loader });
      } finally {
        setLoading(false);
      }
    };

    if (token && videoId) {
      fetchClassroom();
    } else {
      navigate("/dashboard");
    }
  }, [token, videoId]);

  const markAsCompleted = async () => {
    if (!video) return;
    setMarking(true);
    const loader = toast.loading("Marking as completed...");
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mark-completed/`, {
        idToken: token,
        videoId: video.vid,
      });
      toast.success("✅ Marked as completed", { id: loader });
      setVideo({ ...video, watch_progress: 100, is_completed: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark as completed", { id: loader });
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-orange-500 mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
          <p className="text-lg text-gray-700 font-medium">Loading classroom...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your content</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
            <Eye className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Video Not Found</h2>
          <p className="text-gray-600">The requested video could not be loaded.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 text-sm font-medium transition-all hover:scale-105 group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              {/* Progress indicator */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{Math.round(video.watch_progress)}% completed</span>
              </div>

              <button
                onClick={markAsCompleted}
                disabled={marking || video.is_completed}
                className={`px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 font-medium transition-all transform hover:scale-105 ${video.is_completed
                    ? "bg-green-100 text-green-700 cursor-not-allowed shadow-sm"
                    : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-orange-200"
                  }`}
              >
                {marking ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <CheckCircle size={16} />
                )}
                {video.is_completed ? "Completed" : "Mark as Completed"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* Enhanced Video Player */}
          <div className="bg-black relative shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10"></div>
            <iframe
              src={`https://www.youtube.com/embed/${video.vid}?autoplay=1`}
              title={video.name}
              className="w-full aspect-video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Enhanced Video Details */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-5xl mx-auto p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{video.name}</h1>

              {/* Progress Bar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    style={{ width: `${Math.round(video.watch_progress)}%` }}
                    className="h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 min-w-fit">
                  {Math.round(video.watch_progress)}% watched
                </span>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <BookOpen size={18} />
                  Description
                </h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {video.description || "No description available for this video."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Playlist Sidebar */}
      {playlist && (
        <div className="w-77 bg-white/95 backdrop-blur-sm overflow-y-auto shadow-2xl">
          <div className="p-4 border-b bg-gradient-to-r from-orange-500 to-amber-500 text-white sticky top-0 z-10">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <PlayCircle size={20} />
              Playlist
            </h2>
            <p className="text-orange-100 text-sm font-medium mt-1">{playlist.name}</p>
          </div>

          <div className="divide-y divide-gray-100">
            {playlist.videos.map((v, index) => (
              <div
                key={v.vid}
                onClick={() => navigate(`/classroom/${v.vid}`)}
                className={`flex gap-3 p-4 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:scale-[1.02] ${v.vid === video.vid
                    ? "bg-gradient-to-r from-orange-100 to-amber-100 border-r-4 border-orange-400"
                    : ""
                  }`}
              >
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${v.vid}/default.jpg`}
                    alt={v.name}
                    className="w-20 h-14 object-cover rounded-lg shadow-sm"
                  />
                  {v.vid === video.vid && (
                    <div className="absolute inset-0 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Play size={16} className="text-white" />
                    </div>
                  )}
                  <div className="absolute -top-2 -left-2 bg-gray-800 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2">
                    {v.name}
                  </h3>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      style={{ width: `${Math.round(v.watch_progress)}%` }}
                      className="h-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-500"
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {Math.round(v.watch_progress)}% watched
                    </span>
                    {v.is_completed && (
                      <CheckCircle size={14} className="text-green-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
