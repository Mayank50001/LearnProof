import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import axios from "axios";
import { motion } from "framer-motion";
// optional icon

const MyCertificates = () => {
  const { token } = useAuth();

  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/certs/`,
          { idToken: token }
        );
        setCerts(res.data || []); // assuming backend returns a list
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch certificates");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [token]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading your certificates...
      </div>
    );
  }

  if (certs.length === 0){
    return (
        <div className="flex flex-col items-center  text-gray-400 space-y-4 flex-1 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{opacity : 1, scale: 1}}
                transition={{ duration: 0.3 }}
            >
                 <div className="text-6xl">🎓</div>
            </motion.div>

            <h2 className="text-xl font-semibold text-gray-800">
                No Certificates Yet.
            </h2>

            <p className="text-center text-sm text-gray-500 max-w-xs">
                You haven't earned any certificates yet. Keep learning and completing courses to earn your first certificate!
            </p>

            <a href="/dashboard" className="px-4 py-2 text-white bg-orange-500 rounded scale:105 transition mt-4">
                Start Learning
            </a>
        </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Certificates</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert, index) => (
          <motion.div
            key={cert.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow border p-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-3 mb-2">
              
              <h3 className="font-semibold text-lg text-gray-800 truncate">
                {cert.title || "Certificate"}
              </h3>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {cert.description || "No description available."}
            </p>

            <p className="text-xs text-gray-500 mb-4">
              Issued on:{" "}
              {cert.issued_at
                ? new Date(cert.issued_at).toLocaleDateString()
                : "N/A"}
            </p>

            <a
              href={cert.url || `/certificate/${cert.id}`} // fallback if no URL
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block text-center px-4 py-2 bg-orange-500 text-white rounded hover:scale-105 transition"
            >
              View Certificate
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
