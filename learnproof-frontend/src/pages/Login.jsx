import { useState } from "react";
import { loginUser, signupUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AnimatedPage from "../components/AnimatedPage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    try {
      let user;
      if (mode === "login") {
        user = await loginUser(email, password);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Logged in successfully");
        navigate("/watch");
      } else {
        user = await signupUser(email, password);
        toast.success("Signed up successfully");
        setMode("login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-200 to-pink-100 p-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            {mode === "login" ? "🔐 Login to LearnProof" : "🚀 Create an Account"}
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <div className="text-red-600 text-sm mb-3">{error}</div>}

          <button
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
            onClick={handleSubmit}
          >
            {mode === "login" ? "Login" : "Create Account"}
          </button>

          <p className="mt-4 text-center text-sm text-gray-700">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "Sign up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Login;
