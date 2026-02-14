import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col">
                <div className="p-4 text-xl font-bold text-blue-600 border-b">TechMate AI</div>
                <nav className="flex-1 overflow-y-auto mt-4">
                    <ul>
                        <li>
                            <Link to="/dashboard" className="block p-4 hover:bg-gray-100 font-semibold text-gray-700">
                                 Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/chat" className="block p-4 hover:bg-gray-100 font-semibold text-blue-500">
                                 AI Chat
                            </Link>
                        </li>
                        <li>
                            <Link to="/notes" className="block p-4 hover:bg-gray-100 font-semibold text-green-500">
                                 Notes
                            </Link>
                        </li>
                        <li>
                            <Link to="/quiz" className="block p-4 hover:bg-gray-100 font-semibold text-purple-500">
                                 Quiz
                            </Link>
                        </li>
                        <li>
                            <Link to="/code" className="block p-4 hover:bg-gray-100 font-semibold text-indigo-500">
                                 Code Helper
                            </Link>
                        </li>
                        <li>
                            <Link to="/roadmap" className="block p-4 hover:bg-gray-100 font-semibold text-teal-500">
                                 Roadmap
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full text-left p-2 hover:bg-red-50 text-red-600 font-semibold rounded"
                    >
                         Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col">
                <header className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center">
                    <div className="font-bold text-blue-600">TechMate AI</div>
                    <button onClick={handleLogout} className="text-red-600 text-sm">Logout</button>
                </header>
                <div className="flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
