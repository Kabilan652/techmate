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
    Sparkles
} from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Navigation configuration to easily map through links and apply active states
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
        { path: '/chat', label: 'AI Chat', icon: MessageSquare, color: 'text-indigo-500' },
        { path: '/notes', label: 'Notes', icon: FileText, color: 'text-green-500' },
        { path: '/quiz', label: 'Quiz', icon: CheckSquare, color: 'text-purple-500' },
        { path: '/code', label: 'Code Helper', icon: Code, color: 'text-orange-500' },
        { path: '/roadmap', label: 'Roadmap', icon: Map, color: 'text-teal-500' },
        { path: '/course', label: 'Course', icon: BookOpen, color: 'text-rose-500' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100">
            
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-gray-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar (Desktop & Mobile) */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-white shadow-xl md:shadow-none md:border-r md:border-gray-100 md:relative md:flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                
                {/* Logo Area */}
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        <Sparkles className="text-blue-600" size={24} />
                        TechMate AI
                    </div>
                    {/* Close button for mobile */}
                    <button 
                        className="md:hidden text-gray-400 hover:text-gray-700 p-1"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink 
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on mobile click
                                    className={({ isActive }) => `
                                        flex items-center gap-3 p-3 rounded-xl font-bold transition-all duration-200 group
                                        ${isActive 
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon 
                                                size={20} 
                                                className={`transition-transform duration-200 ${isActive ? item.color : 'text-gray-400 group-hover:scale-110'}`} 
                                                strokeWidth={isActive ? 2.5 : 2}
                                            />
                                            {item.label}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Area */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full p-3 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold rounded-xl transition-colors border border-gray-200 hover:border-red-200 shadow-sm active:scale-95"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <main className="flex-1 overflow-hidden flex flex-col relative w-full">
                
                {/* Mobile Header */}
                <header className="md:hidden bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 p-4 flex justify-between items-center z-10 sticky top-0">
                    <div className="flex items-center gap-2 font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 text-xl">
                        <Sparkles className="text-blue-600" size={20} />
                        TechMate AI
                    </div>
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)} 
                        className="p-2 -mr-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                </header>

                {/* Outlet for nested routes */}
                <div className="flex-1 overflow-hidden">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;