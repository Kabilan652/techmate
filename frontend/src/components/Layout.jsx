import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';

import {
    LayoutDashboard,
    MessageSquare,
    FileText,
    CheckSquare,
    Code,
    Map,
    BookOpen,
    LogOut,
    Menu,
    X,
    Sparkles,
    BrainCircuit,
    Radio,
    BriefcaseBusiness,
} from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Sidebar navigation items
    const navItems = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            color: 'text-blue-600',
        },
        {
            path: '/chat',
            label: 'AI Chat',
            icon: MessageSquare,
            color: 'text-indigo-500',
        },
        {
            path: '/notes',
            label: 'Notes',
            icon: FileText,
            color: 'text-green-500',
        },
        {
            path: '/quiz',
            label: 'Quiz',
            icon: CheckSquare,
            color: 'text-purple-500',
        },
        {
            path: '/code',
            label: 'Code Helper',
            icon: Code,
            color: 'text-orange-500',
        },
        {
            path: '/roadmap',
            label: 'Roadmap',
            icon: Map,
            color: 'text-teal-500',
        },
        {
            path: '/adaptive',
            label: 'Adaptive',
            icon: BrainCircuit,
            color: 'text-pink-500',
        },
        {
            path: '/course',
            label: 'Course',
            icon: BookOpen,
            color: 'text-rose-500',
        },
        {
            path: '/live-classroom',
            label: 'Live Classroom',
            icon: Radio,
            color: 'text-cyan-500',
        },
        {
            path: '/job-matching',
            label: 'AI Job Matching',
            icon: BriefcaseBusiness,
            color: 'text-indigo-600',
        },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans selection:bg-indigo-100">

            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-20 bg-gray-900/50 backdrop-blur-sm transition-opacity md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-white shadow-xl transition-transform duration-300 md:relative md:translate-x-0 md:border-r md:border-gray-100 md:shadow-none ${
                    isMobileMenuOpen
                        ? 'translate-x-0'
                        : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="flex shrink-0 items-center justify-between p-6">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-black text-transparent">
                        <Sparkles className="text-blue-600" size={24} />
                        TechMate AI
                    </div>

                    <button
                        type="button"
                        className="p-1 text-gray-400 hover:text-gray-700 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto px-4 py-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) => `
                                        flex w-full items-center gap-3 rounded-xl p-3
                                        font-bold transition-all duration-200
                                        ${
                                            isActive
                                                ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon
                                                size={20}
                                                className={`shrink-0 transition-transform duration-200 ${
                                                    isActive
                                                        ? item.color
                                                        : 'text-gray-400 group-hover:scale-110'
                                                }`}
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />

                                            <span className="whitespace-nowrap">
                                                {item.label}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout */}
                <div className="shrink-0 border-t border-gray-100 p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 font-bold text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main application area */}
            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* Mobile header */}
                <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-md md:hidden">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-black text-transparent">
                        <Sparkles className="text-blue-600" size={20} />
                        TechMate AI
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="-mr-2 rounded-lg p-2 text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                        aria-label="Open navigation menu"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Page content */}
                <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
