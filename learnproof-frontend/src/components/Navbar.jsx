import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function Navbar() {
  const [isDark, setIsDark] = useState(false);

  // Toggle dark class on <html> tag
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <nav className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700 shadow-md text-gray-900 dark:text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      
      <div className="text-2xl font-extrabold tracking-tight">
        <Link to="/" className="hover:text-blue-600 transition">LearnProof</Link>
      </div>

      <div className="flex gap-6 items-center">
        <Link
          to="/"
          className="hover:text-blue-500 dark:hover:text-blue-400 transition font-medium"
        >
          Home
        </Link>
        <Link
          to="/login"
          className="hover:text-blue-500 dark:hover:text-blue-400 transition font-medium"
        >
          Login
        </Link>
        <Link
          to="/watch"
          className="hover:text-blue-500 dark:hover:text-blue-400 transition font-medium"
        >
          Course Watcher
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:scale-110 transition"
          title="Toggle dark mode"
        >
          {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-700" />}
        </button>
      </div>
    </nav>
  );
}


export default Navbar;