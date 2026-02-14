import React, { useEffect } from 'react'; // 1. Import useEffect
import { Link, useNavigate } from 'react-router-dom'; // 2. Import useNavigate
import { useAuth } from "../context/AuthContext"; // 3. Import useAuth

const LandingPage = () => {
    const { user } = useAuth(); // 4. Get the current user status
    const navigate = useNavigate();

    // 5. Add this effect to auto-redirect if logged in
    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-blue-600">TechMate AI</div>
                <div>
                    {/* Optional: You can also hide these buttons if user is logged in, 
                        though the redirect above handles the main logic */}
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 px-4 font-semibold">Login</Link>
                    <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Get Started</Link>
                </div>
            </header>

            <main className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col justify-center items-center text-center p-8">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                    Master Tech Skills with <span className="text-blue-600">AI</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mb-8">
                    Your personal AI-powered learning assistant. Generate notes, take quizzes, debug code, and track your progress—all in one place.
                </p>
                <div className="flex gap-4">
                    <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition shadow-lg">
                        Start Learning Now
                    </Link>
                    <Link to="/login" className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-50 transition shadow-md">
                        Login
                    </Link>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-4xl mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
                        <p className="text-gray-600">Get instant answers and explanations for complex technical topics.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-4xl mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">Smart Notes</h3>
                        <p className="text-gray-600">Generate concise summaries and key points from any text or topic.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="text-4xl mb-4"></div>
                        <h3 className="text-xl font-bold mb-2">Code Helper</h3>
                        <p className="text-gray-600">Debug code, get improvements, and understand logic faster.</p>
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 text-white p-6 text-center">
                <p>&copy; 2026 TechMate AI. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;