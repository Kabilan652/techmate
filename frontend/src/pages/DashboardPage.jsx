import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
// 👇 Make sure this path matches your Supabase client
import { supabase } from '../lib/supabase'; 
import { 
    BookOpen, Trophy, TrendingUp, Flame, 
    MoreVertical, Clock, PlayCircle, AlertCircle,
    LogOut, Sparkles, Compass, MessageSquare
} from 'lucide-react';

// --- ZEROED MOCK DATA (New User State) ---
const MOCK_DATA = {
    topicsLearned: 0,
    quizzesTaken: 0,
    averageScore: 0,
    streak: 0,
    progressData: [
        { day: 'Mon', hours: 0 }, { day: 'Tue', hours: 0 },
        { day: 'Wed', hours: 0 }, { day: 'Thu', hours: 0 },
        { day: 'Fri', hours: 0 }, { day: 'Sat', hours: 0 }, { day: 'Sun', hours: 0 },
    ],
    recentActivity: [], // Empty array for new user
    courses: [] // Empty array for new user
};

const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'group-hover:text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', hover: 'group-hover:text-purple-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600', hover: 'group-hover:text-green-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'group-hover:text-orange-600' },
};

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
                <h3 className={`text-3xl font-extrabold text-gray-900 transition-colors ${colorMap[color].hover}`}>{value}</h3>
                <p className={`text-xs font-semibold mt-2 ${color === 'orange' ? 'text-orange-500' : 'text-emerald-500'} flex items-center gap-1`}>
                    {color === 'orange' ? <Flame size={14}/> : <TrendingUp size={14}/>}
                    {subtext}
                </p>
            </div>
            <div className={`p-4 rounded-2xl ${colorMap[color].bg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                <Icon className={`w-6 h-6 ${colorMap[color].text}`} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse w-full">
        <div className="h-10 bg-gray-200 w-1/3 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-40 bg-gray-200 rounded-3xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-3xl"></div>
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUsingMock, setIsUsingMock] = useState(false);
    
    const [userName, setUserName] = useState("Student");
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    // Fetch user name from Supabase
    useEffect(() => {
        const fetchUserName = async () => {
            if (!user) return;
            try {
                const { data, error } = await supabase
                    .from('profiles') 
                    .select('full_name') 
                    .eq('id', user.id)
                    .single();

                if (error) throw error;
                
                if (data && data.full_name) {
                    setUserName(data.full_name);
                }
            } catch (error) {
                console.error("Error fetching user name:", error.message);
                if (user?.user_metadata?.fullName) {
                    setUserName(user.user_metadata.fullName);
                }
            }
        };

        fetchUserName();
    }, [user]);

    useEffect(() => {
        setTimeout(() => {
            setStats(MOCK_DATA);
            setIsLoading(false);
            setIsUsingMock(false); 
        }, 600);
    }, []);

    if (isLoading) return <div className="min-h-screen bg-slate-50 flex pt-4"><LoadingSkeleton /></div>;
    if (!stats) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Critical Error loading application.</div>;

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-sans text-gray-900 flex flex-col overflow-hidden selection:bg-indigo-100">
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative">
                <div className="max-w-7xl mx-auto space-y-8 pb-12">
                    
                    {/* Demo Banner */}
                    {isUsingMock && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
                            <AlertCircle size={20} className="text-amber-500 shrink-0" />
                            <span className="text-sm font-medium">Running in local demo mode. Connect backend to see live data.</span>
                        </div>
                    )}

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{userName}</span>! 👋
                            </h1>
                            <p className="text-gray-500 mt-2 font-medium flex items-center gap-2 text-sm sm:text-base">
                                <Sparkles size={18} className="text-amber-400" />
                                Your learning journey awaits. Let's make today count!
                            </p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm font-bold text-sm w-fit"
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>

                    {/* Stats Grid - Updated subtexts for new users */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatCard title="Topics Mastered" value={stats.topicsLearned} subtext="Start your journey" icon={BookOpen} color="blue" />
                        <StatCard title="Quizzes Passed" value={stats.quizzesTaken} subtext="Take a practice quiz" icon={Trophy} color="purple" />
                        <StatCard title="Average Score" value={`${stats.averageScore}%`} subtext="Awaiting first score" icon={TrendingUp} color="green" />
                        <StatCard title="Current Streak" value={`${stats.streak} Days`} subtext="Start building today" icon={Flame} color="orange" />
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        
                        {/* Left Column (Charts & Courses) */}
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            
                            {/* Bar Chart Section */}
                            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-xl font-bold text-gray-900">Weekly Study Hours</h2>
                                    <select className="text-sm font-bold border-none bg-slate-50 rounded-xl text-gray-600 px-4 py-2 cursor-pointer outline-none ring-1 ring-gray-200 focus:ring-indigo-500 transition-shadow">
                                        <option>This Week</option>
                                        <option>Last Week</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-end justify-between h-64 mt-4 gap-2 sm:gap-4">
                                    {stats.progressData?.map((data, index) => {
                                        const maxHours = 8;
                                        // If hours are 0, render a tiny minimum bar (2%) so it's visible, otherwise calculate height
                                        const heightPct = data.hours > 0 ? Math.max((data.hours / maxHours) * 100, 5) : 2; 
                                        
                                        return (
                                            <div key={index} className="flex flex-col items-center group flex-1">
                                                <div className="relative w-full flex justify-center h-full items-end">
                                                    <div className="absolute -top-12 hidden group-hover:flex bg-gray-900 text-white text-xs font-bold py-2 px-3 rounded-lg z-10 shadow-xl items-center gap-1 transition-all">
                                                        {data.hours} <span className="text-gray-400 font-normal">hrs</span>
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                    </div>
                                                    <div 
                                                        className={`w-full max-w-[56px] rounded-xl transition-all duration-300 relative overflow-hidden ${data.hours > 0 ? 'bg-indigo-50 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                                                        style={{ height: `${heightPct}%` }}
                                                    >
                                                        {data.hours > 0 && (
                                                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold mt-4 transition-colors ${data.hours > 0 ? 'text-gray-600 group-hover:text-indigo-600' : 'text-gray-400'}`}>
                                                    {data.day}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Courses Section */}
                            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Courses in Progress</h2>
                                
                                {stats.courses?.length > 0 ? (
                                    <div className="space-y-6">
                                        {stats.courses.map((course, idx) => (
                                            <div key={idx} className="group cursor-pointer">
                                                {/* ... (Previous course code omitted for brevity since it's empty in this state) ... */}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // Beautiful Empty State for Courses
                                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center bg-slate-50 rounded-2xl border border-dashed border-gray-200">
                                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                                            <Compass className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <h3 className="text-gray-900 font-bold text-lg mb-2">No courses started yet</h3>
                                        <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">
                                            Ready to dive in? Generate an AI learning roadmap to kickstart your journey.
                                        </p>
                                        <Link to="/roadmap" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center gap-2">
                                            <BookOpen size={16} />
                                            Explore Courses
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column (Activity & Quote) */}
                        <div className="space-y-6 sm:space-y-8">
                            
                            {/* Activity Feed */}
                            <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                                    <button className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-xl">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                                
                                {stats.recentActivity?.length > 0 ? (
                                    <div className="space-y-5">
                                        {stats.recentActivity.map((activity, index) => (
                                             <div key={index}>{/* List items */}</div>
                                        ))}
                                    </div>
                                ) : (
                                    // Beautiful Empty State for Activity
                                    <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
                                        <div className="bg-indigo-50 p-4 rounded-2xl mb-4 text-indigo-500">
                                            <MessageSquare className="w-8 h-8" />
                                        </div>
                                        <p className="text-gray-800 font-bold text-lg mb-1">It's quiet here...</p>
                                        <p className="text-gray-500 text-sm mb-6">Ask TechMate a question to get your learning history started.</p>
                                        <Link to="/chat" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-indigo-100">
                                            Chat with AI
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Quote Section */}
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2rem] shadow-md text-white relative overflow-hidden">
                                <Sparkles className="absolute top-4 right-4 text-white/10 w-24 h-24 rotate-12" />
                                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                
                                <h3 className="font-bold mb-5 flex items-center gap-2 text-indigo-100 uppercase tracking-widest text-xs">
                                    Motivation
                                </h3>
                                <p className="text-xl font-medium leading-relaxed italic relative z-10 text-white/95">
                                    "The beautiful thing about learning is that no one can take it away from you."
                                </p>
                                <p className="mt-6 text-sm font-bold text-indigo-200">— B.B. King</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;   