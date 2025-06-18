const Landing = ({onGetStarted , user}) => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-600 mb-4">
            Learn. Watch. Get Certified. 🚀
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-xl mb-6">
                Import your favorite Youtube videos or playlists. Track your progress, take AI Generated tests, and earn certificates!
            </p>
            {!user && (
                <button
                    onClick={onGetStarted}
                    className="bg-blue-600 hover:bg-blue-900 text-white px-6 py-2 rounded-xl transition-all shadow-md"
                >
                    Get Started
                </button>
            )}
        </div>
    );
};

export default Landing;