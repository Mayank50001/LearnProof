import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Quiz = () => {
    const { token } = useAuth();

    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(300); // 5 min
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!token) return;

        const fetchQuizTargets = async () => {
            setLoading(true);
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/quiz-list/`, { idToken: token });
                setVideos(res.data.videos || []);
                setPlaylists(res.data.playlists || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load quiz options");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizTargets();
    }, [token]);

    useEffect(() => {
        if (!quizData) return;

        const timer = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // auto-submit when time runs out
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizData]);

    const handleStartQuiz = async (type, id) => {
        try {
            
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/start-quiz/`, {
                idToken: token,
                contentType : type,
                contentId: id,
            });
            toast.dismiss();
            setQuizData(res.data.quiz);
            setAnswers({});
            setTimeLeft(300); // reset timer
        } catch (err) {
            console.error(err);
            toast.error("Failed to start quiz");
        }
    };

    const handleAnswer = (qIdx, value) => {
        setAnswers(prev => ({ ...prev, [qIdx]: value }));
    };

    const handleSubmit = async () => {
        if (!quizData) return;

        setSubmitting(true);
        try {
            const answerList = quizData.questions.map((_, idx) => answers[idx] || "");
            console.log(token, quizData.id, answerList);
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/submit-quiz/`, {
                idToken: token,
                quizId: quizData.quiz_id,
                answers : answerList,
            });
            setResult(res.data);
            toast.success("Quiz submitted!");
            setQuizData(null); // close quiz modal
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit quiz");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="h-screen flex items-center justify-center">Loading quiz options...</div>;
    }

    if (quizData) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="max-w-2xl w-full bg-white rounded shadow p-6">
                    <h2 className="text-xl font-semibold mb-2">Quiz</h2>
                    <p className="text-sm text-gray-500 mb-4">Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>
                    {quizData.questions.map((q, idx) => (
                        <div key={idx} className="mb-4">
                            <p className="font-medium">{idx + 1}. {q.question}</p>
                            <input
                                type="text"
                                value={answers[idx] || ""}
                                onChange={e => handleAnswer(idx, e.target.value)}
                                className="mt-1 w-full p-2 border rounded"
                            />
                        </div>
                    ))}
                    <button
                        disabled={submitting}
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                        {submitting ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded shadow max-w-md text-center"
                >
                    <h2 className="text-xl font-bold mb-2">{result.passed ? "🎉 Congratulations!" : "Better luck next time!"}</h2>
                    <p className="mb-4">Your Score: {result.score}%</p>
                    {result.passed && result.certificate_url && (
                        <a
                            href={result.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Download Certificate
                        </a>
                    )}
                    <button
                        onClick={() => setResult(null)}
                        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Back to Quiz
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Take a Quiz</h2>
            <div className="space-y-4">
                <h3 className="font-medium">Standalone Videos</h3>
                <div className="grid gap-4">
                    {videos.map(video => (
                        <motion.div
                            key={video.vid}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-center p-3 bg-white shadow rounded"
                        >
                            <div>
                                <p className="font-medium">{video.name}</p>
                            </div>
                            <button
                                onClick={() => handleStartQuiz("video",video.vid)}
                                className="px-3 py-1 bg-orange-500 text-white rounded"
                            >
                                Take Quiz
                            </button>
                        </motion.div>
                    ))}
                </div>

                <h3 className="font-medium mt-6">Completed Playlists</h3>
                <div className="space-y-4">
                    {playlists.map(pl => (
                        <motion.div
                            key={pl.pid}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-between items-center p-3 bg-white shadow rounded"
                        >
                            <div>
                                <p className="font-medium">{pl.name}</p>
                            </div>
                            <button
                                onClick={() => handleStartQuiz("playlist",pl.pid)}
                                className="px-3 py-1 bg-orange-500 text-white rounded"
                            >
                                Take Quiz
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Quiz;
