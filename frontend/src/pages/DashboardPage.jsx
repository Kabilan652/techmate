import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { 
    BookOpen, Trophy, TrendingUp, Flame, 
    MoreVertical, Clock, CheckCircle, PlayCircle, AlertCircle,
    LogOut 
} from 'lucide-react';

// --- MOCK DATA (All set to 0) ---
const MOCK_DATA = {
    user: { name: "Student", level: "Beginner" },
    topicsLearned: 0,
    quizzesTaken: 0,
    averageScore: 0,
    streak: 0,
    progressData: [
        { day: 'Mon', hours: 0 }, { day: 'Tue', hours: 0 },
        { day: 'Wed', hours: 0 }, { day: 'Thu', hours: 0 },
        { day: 'Fri', hours: 0 }, { day: 'Sat', hours: 0 }, { day: 'Sun', hours: 0 },
    ],
    recentActivity: [], 
    courses: []
};

const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600' },
};

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-semibold text-gray-500 mb-2">{title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">{value}</h3>
                <p className={`text-xs font-bold mt-2 ${color === 'orange' ? 'text-orange-500' : 'text-green-500'}`}>{subtext}</p>
            </div>
            <div className={`p-3 rounded-xl ${colorMap[color].bg}`}>
                <Icon className={`w-7 h-7 ${colorMap[color].text}`} strokeWidth={2.5} />
            </div>
        </div>
    </div>
);

const LoadingSkeleton = () => (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse w-full">
        <div className="h-8 bg-gray-200 w-1/4 rounded-lg"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-gray-200 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-80 bg-gray-200 rounded-2xl"></div>
            <div className="h-80 bg-gray-200 rounded-2xl"></div>
        </div>
    </div>
);

const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUsingMock, setIsUsingMock] = useState(false);
    
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate("/login");
    };

    useEffect(() => {
        // --- FORCE MOCK DATA ---
        // We set the stats to the 0-value MOCK_DATA immediately.
        setStats(MOCK_DATA);
        setIsLoading(false);
        
        // --- DISABLE BANNER ---
        // Setting this to false ensures the "Demo Mode" banner is hidden.
        setIsUsingMock(false); 
    }, []);

    if (isLoading) return <div className="h-full bg-gray-50 flex pt-4"><LoadingSkeleton /></div>;
    if (!stats) return <div className="h-full flex items-center justify-center text-red-500 font-bold">Critical Error loading application.</div>;

    return (
        <div className="w-full h-full bg-gray-50 font-sans text-gray-900 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative">
                <div className="max-w-7xl mx-auto space-y-8 pb-12">
                    
                    {/* This banner will NOT show because isUsingMock is false */}
                    {isUsingMock && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow-sm">
                            <AlertCircle size={20} className="text-amber-500 shrink-0" />
                            <span className="text-sm font-medium">Running in local demo mode. Connect backend to see live data.</span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back!</h1>
                            <p className="text-gray-500 mt-1 font-medium">Here is what's happening with your learning journey today.</p>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors shadow-sm font-medium text-sm"
                        >
                            <LogOut size={18} />
                            Log Out
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatCard title="Topics Mastered" value={stats.topicsLearned || 0} subtext="Start learning!" icon={BookOpen} color="blue" />
                        <StatCard title="Quizzes Passed" value={stats.quizzesTaken || 0} subtext="Take a quiz!" icon={Trophy} color="purple" />
                        <StatCard title="Average Score" value={`${stats.averageScore || 0}%`} subtext="Awaiting data" icon={TrendingUp} color="green" />
                        <StatCard title="Current Streak" value={`${stats.streak || 0} Days`} subtext="Build your streak!" icon={Flame} color="orange" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                            
                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-lg font-bold text-gray-900">Weekly Study Hours</h2>
                                    <select className="text-sm font-medium border-none bg-gray-50 rounded-lg text-gray-600 px-3 py-2 cursor-pointer outline-none ring-1 ring-gray-200 focus:ring-indigo-500">
                                        <option>This Week</option>
                                        <option>Last Week</option>
                                    </select>
                                </div>
                                
                                <div className="flex items-end justify-between h-56 mt-4 gap-2 sm:gap-4">
                                    {stats.progressData?.map((data, index) => {
                                        const maxHours = 8;
                                        const heightPct = data.hours > 0 ? Math.max((data.hours / maxHours) * 100, 5) : 2; 
                                        
                                        return (
                                            <div key={index} className="flex flex-col items-center group flex-1">
                                                <div className="relative w-full flex justify-center h-full items-end">
                                                    <div className="absolute -top-10 hidden group-hover:flex bg-gray-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg z-10 shadow-xl items-center gap-1">
                                                        {data.hours} <span className="text-gray-400 font-normal">hrs</span>
                                                    </div>
                                                    <div 
                                                        className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 relative overflow-hidden ${data.hours > 0 ? 'bg-indigo-50 group-hover:bg-indigo-500' : 'bg-gray-100'}`}
                                                        style={{ height: `${heightPct}%` }}
                                                    >
                                                        {data.hours > 0 && <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent"></div>}
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 mt-4 group-hover:text-gray-700 transition-colors">{data.day}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Courses in Progress</h2>
                                <div className="space-y-6">
                                    {stats.courses?.length > 0 ? stats.courses.map((course, idx) => (
                                        <div key={idx} className="group">
                                            <div className="flex justify-between items-end mb-2">
                                                <h4 className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">{course.name}</h4>
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{course.completed}/{course.total} Modules</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                                <div 
                                                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                                                    style={{ width: `${course.progress}%` }}
                                                >
                                                    {course.progress > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-gray-500 text-sm italic">No courses in progress yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                                    <button className="text-gray-400 hover:text-gray-700"><MoreVertical size={20} /></button>
                                </div>
                                <div className="space-y-6">
                                    {stats.recentActivity?.length > 0 ? stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex gap-4 group cursor-pointer">
                                            <div className={`p-3 rounded-2xl flex-shrink-0 h-min
                                                ${activity.type === 'quiz' ? 'bg-emerald-50 text-emerald-600' :
                                                  activity.type === 'note' ? 'bg-sky-50 text-sky-600' : 'bg-purple-50 text-purple-600'
                                                }`}>
                                                {activity.type === 'quiz' && <Trophy size={18} strokeWidth={2.5} />}
                                                {activity.type === 'note' && <BookOpen size={18} strokeWidth={2.5} />}
                                                {activity.type === 'video' && <PlayCircle size={18} strokeWidth={2.5} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-snug">{activity.title}</p>
                                                <div className="flex items-center text-[11px] font-semibold text-gray-400 mt-1.5 gap-2 uppercase tracking-wide">
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {activity.date}</span>
                                                    {activity.score && <span className="text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Score: {activity.score}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6">
                                            <p className="text-gray-500 text-sm font-medium">No recent activity found.</p>
                                            <Link to="/chat" className="mt-4 inline-block text-indigo-600 text-xs font-bold hover:underline">Chat with TechMate now!</Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                                <h3 className="text-indigo-800 font-bold mb-2">Quote of the Day</h3>
                                <p className="text-indigo-600/80 text-sm italic">"The beautiful thing about learning is that no one can take it away from you." <br/>- B.B. King</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;