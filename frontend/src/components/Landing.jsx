import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Award, BookOpen, Users, CheckCircle, Star, ArrowRight, Youtube, Shield, Zap, Trophy, Target, Clock, Coffee, Lightbulb, TrendingUp } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, getIdToken } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();
    const [showContent, setShowContent] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 2000);

        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        
      
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          const idToken = await getIdToken(user);
      
          // 🔁 Send token to backend
          const res = await fetch("http://localhost:8000/api/login/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
          });
      
          if (!res.ok) {
            throw new Error("Backend login failed");
          }
      
          const data = await res.json();
          console.log("User synced with backend:", data);
      
          // 🚀 Navigate to dashboard
          navigate("/dashboard");
        } catch (err) {
          console.error("Google login error:", err);
          alert("Login failed. Please try again.");
        }
      };

    

    const features = [
        {
            icon: <Youtube className="w-8 h-8" />,
            title: "Import YouTube Content",
            description: "Transform any YouTube video or playlist into a structured learning course with progress tracking."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "AI-Powered Quizzes",
            description: "Get personalized quizzes generated from video content to test your understanding."
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Verifiable Certificates",
            description: "Earn certificates that prove your learning achievements with unique verification IDs."
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Gamified Learning",
            description: "Level up with XP points, maintain learning streaks, and unlock achievements."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Progress Verification",
            description: "Unlock quizzes only after watching 90% of content to ensure genuine learning."
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Learning Analytics",
            description: "Track your learning journey with detailed analytics and progress insights."
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Import Content",
            description: "Paste any YouTube video or playlist URL to get started",
            icon: <Youtube className="w-6 h-6" />
        },
        {
            number: "02",
            title: "Watch & Learn",
            description: "Complete your learning with progress tracking",
            icon: <Play className="w-6 h-6" />
        },
        {
            number: "03",
            title: "Take Quiz",
            description: "Test your knowledge with AI-generated questions",
            icon: <Lightbulb className="w-6 h-6" />
        },
        {
            number: "04",
            title: "Get Certified",
            description: "Receive verifiable certificates for your achievements",
            icon: <Award className="w-6 h-6" />
        }
    ];

    const benefits = [
        {
            icon: <Coffee className="w-6 h-6" />,
            title: "Learn at Your Pace",
            description: "No deadlines, no pressure. Learn when it suits you best."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Verified Learning",
            description: "Prove your skills with certificates that employers trust."
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Join Community",
            description: "Connect with fellow learners and share your achievements."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 text-gray-800 overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-between px-8 lg:px-16">
                {/* Animated LearnProof Title with Enhanced Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={showContent ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="z-10 max-w-2xl"
                >
                    <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-4">
                        LearnProof
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={showContent ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <p className="text-xl lg:text-2xl text-gray-700 font-medium mb-4">
                            Transform YouTube learning into verifiable achievements
                        </p>

                        <div className="space-y-3 mb-8">
                            <motion.div
                                className="flex items-center gap-3 text-gray-600"
                                initial={{ opacity: 0, x: -20 }}
                                animate={showContent ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span>Import any YouTube video or playlist</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-3 text-gray-600"
                                initial={{ opacity: 0, x: -20 }}
                                animate={showContent ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span>Track your learning progress accurately</span>
                            </motion.div>
                            <motion.div
                                className="flex items-center gap-3 text-gray-600"
                                initial={{ opacity: 0, x: -20 }}
                                animate={showContent ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span>Earn certificates that prove your knowledge</span>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={showContent ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            onClick={handleGoogleLogin}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Start Learning Free
                        </button>
                    </motion.div>
                </motion.div>

                {/* Enhanced Right Side Design */}
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={showContent ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="hidden lg:block relative"
                >
                    <div className="relative w-96 h-96">
                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-0 right-0 bg-white/80 backdrop-blur-lg border border-orange-200 rounded-xl p-4 w-48 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Certificate Earned!</p>
                                    <p className="text-xs text-gray-600">React Fundamentals</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 10, 0], rotate: [0, -1, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute bottom-10 left-0 bg-orange-100/80 backdrop-blur-lg border border-orange-300 rounded-xl p-4 w-44 shadow-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Star className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Level Up!</p>
                                    <p className="text-xs text-gray-600">2,450 XP gained</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -5, 0], x: [0, 5, 0] }}
                            transition={{ duration: 5, repeat: Infinity }}
                            className="absolute top-1/2 right-10 bg-red-100/80 backdrop-blur-lg border border-red-300 rounded-xl p-3 w-40 shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <Youtube className="w-6 h-6 text-red-500" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Video Imported</p>
                                    <p className="text-xs text-gray-600">JavaScript Tutorial</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Central Glow */}
                        <motion.div
                            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-full blur-xl"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Benefits Section */}
            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-16 px-8 lg:px-16 bg-white/50"
            >
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-8 lg:px-16"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-800">
                            Why Choose{" "}
                            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                LearnProof?
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Transform your YouTube learning experience with verified progress tracking and achievement certification
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white/70 backdrop-blur-lg border border-orange-200 rounded-xl p-6 hover:border-orange-400 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="text-orange-600 mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-8 lg:px-16 bg-gradient-to-r from-orange-100 to-red-100"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-800">How It Works</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Get started in minutes and transform your learning journey
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="text-center relative"
                            >
                                <div className="mb-6 relative">
                                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                                        {step.number}
                                    </div>
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-orange-500 mx-auto border-2 border-orange-200">
                                        {step.icon}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-orange-400 to-red-400 opacity-30 transform translate-x-4" />
                                    )}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-800">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="py-20 px-8 lg:px-16 bg-white"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-gray-800">
                            Ready to{" "}
                            <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                Prove Your Learning?
                            </span>
                        </h2>
                        <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                            Start your journey of transforming YouTube videos into verified certificates and showcase your dedication to learning
                        </p>
                        <motion.button
                            onClick={handleGoogleLogin}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-12 py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 mx-auto shadow-lg"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Start Learning Today
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <motion.p
                            className="text-sm text-gray-500 mt-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            viewport={{ once: true }}
                        >
                            Free to use • No credit card required • Start immediately
                        </motion.p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="border-t border-orange-200 py-12 px-8 lg:px-16 bg-orange-50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                                LearnProof
                            </h3>
                            <p className="text-gray-600 mt-2">Transform YouTube learning into verifiable achievements</p>
                        </div>
                        <div className="flex space-x-8 text-gray-600">
                            <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Support</a>
                        </div>
                    </div>
                    <div className="border-t border-orange-200 mt-8 pt-8 text-center text-gray-500">
                        <p>&copy; 2025 LearnProof. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;