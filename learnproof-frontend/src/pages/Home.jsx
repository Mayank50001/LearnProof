import { Link } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";

function Home() {
  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 relative overflow-hidden">
        
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 opacity-30 rounded-full blur-3xl animate-pulse"></div>

        {/* Hero Section */}
        <div className="text-center z-10 p-6 bg-white/30 backdrop-blur-md rounded-xl shadow-xl max-w-2xl mx-auto border border-white/40">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Welcome to <span className="text-blue-600">LearnProof</span>
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            🚀 Track your YouTube learning. Earn recognition. Prove you’ve completed what you start.
          </p>

          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/watch"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
            >
              Watch Courses
            </Link>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Home;
