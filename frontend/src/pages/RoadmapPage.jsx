import React, { useState } from 'react';
import { 
  Check, Lock, Play, Map, Star, Clock, ChevronRight,
  Trophy, Award, Sparkles, Loader2, ArrowRight, AlertCircle, BookOpen
} from 'lucide-react';

const RoadmapPage = () => {
  // --- App States ---
  // 'setup' -> 'generating' -> 'roadmap'
  const [appState, setAppState] = useState('setup'); 
  const [topic, setTopic] = useState('');
  const [roadmapData, setRoadmapData] = useState([]);
  const [error, setError] = useState(null);

  // --- API CALL: Generate Roadmap ---
  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setAppState('generating');
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() })
      });

      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      
      if (data.roadmap && data.roadmap.length > 0) {
        // We receive the data, but we need to assign statuses
        // The first module is 'current', the rest are 'locked'
        const initializedData = data.roadmap.map((mod, index) => ({
            ...mod,
            status: index === 0 ? 'current' : 'locked'
        }));
        
        setRoadmapData(initializedData);
        setAppState('roadmap');
      } else {
        throw new Error("Invalid roadmap data received");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate roadmap. The AI might be overloaded. Please try again.");
      setAppState('setup');
    }
  };

  // --- INTERACTIVITY: Mark Module as Complete ---
  const handleCompleteModule = (index) => {
      const newData = [...roadmapData];
      
      // Mark current as completed
      newData[index].status = 'completed';
      
      // Unlock the next one (if it exists)
      if (index + 1 < newData.length) {
          newData[index + 1].status = 'current';
      }
      
      setRoadmapData(newData);
  };

  const startNewTopic = () => {
    setTopic('');
    setRoadmapData([]);
    setAppState('setup');
  };

  
  // RENDER PHASE 1: SETUP SCREEN
  
  if (appState === 'setup') {
    return (
      <div className="h-full bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-50 rounded-2xl">
              <Map className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-2">Create a Learning Path</h1>
          <p className="text-center text-gray-500 mb-8 text-sm sm:text-base">Enter a skill or domain, and AI will generate a step-by-step roadmap to master it.</p>
          
          <form onSubmit={handleGenerateRoadmap} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What do you want to learn?</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Data Science, UI/UX Design, Docker..." 
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={!topic.trim()}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:bg-gray-300 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              Generate Roadmap <Sparkles className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  
  // RENDER PHASE 2: GENERATING (LOADING)
  
  if (appState === 'generating') {
    return (
      <div className="h-full bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Charting your Path...</h2>
        <p className="text-gray-500 text-center max-w-sm">Designing a structured learning curriculum for <span className="font-bold text-indigo-600">"{topic}"</span>. This takes a few seconds.</p>
      </div>
    );
  }

  
  // RENDER PHASE 3: ROADMAP VIEW
  
  const totalSteps = roadmapData.length;
  const completedSteps = roadmapData.filter(i => i.status === 'completed').length;
  const progressPercent = (completedSteps / totalSteps) * 100;
  const totalXP = roadmapData.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.xp : 0), 0);

  return (
    <div className="h-full bg-gray-50 overflow-y-auto custom-scrollbar p-4 sm:p-6 lg:p-8 pb-20">
      
      {/* Top Navigation */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-lg capitalize">
              <BookOpen size={20} />
              <span>{topic} Curriculum</span>
          </div>
          <button onClick={startNewTopic} className="text-sm font-semibold text-gray-400 hover:text-indigo-600 transition-colors">
              Create New Roadmap
          </button>
      </div>

      <div className="max-w-4xl mx-auto mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
          <Map className="text-indigo-600 hidden sm:block" size={40} />
          Your Learning Roadmap
        </h1>

        {/* Progress Summary Card */}
        <div className="mt-8 bg-white p-6 sm:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row justify-between items-center max-w-3xl mx-auto">
           <div className="flex items-center gap-4 mb-6 md:mb-0">
              <div className="p-4 bg-yellow-100 text-yellow-600 rounded-2xl">
                <Trophy size={28} strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total XP Earned</p>
                <p className="text-3xl font-black text-gray-900">{totalXP.toLocaleString()}</p>
              </div>
           </div>

           <div className="w-full md:w-1/2">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-500">Course Progress</span>
                <span className="text-indigo-600">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out relative" 
                  style={{ width: `${progressPercent}%` }}
                >
                    {progressPercent > 0 && <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>}
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- TIMELINE --- */}
      <div className="max-w-3xl mx-auto relative animate-in fade-in duration-700 delay-200">
        
        {/* The Vertical Line (Background) */}
        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 rounded-full hidden md:block"></div>

        <div className="space-y-8 relative">
          {roadmapData.map((item, index) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';
            const isLocked = item.status === 'locked';

            return (
              <div key={item.id || index} className={`relative flex flex-col md:flex-row gap-6 ${isLocked ? 'opacity-60 grayscale' : ''}`}>
                
                {/* Visual Node (Circle on the line) */}
                <div className="hidden md:flex flex-col items-center absolute left-0 w-16 h-full z-10">
                   <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 bg-white shadow-sm
                      ${isCompleted ? 'border-green-500 text-green-500 bg-green-50' : 
                        isCurrent ? 'border-indigo-600 text-indigo-600 scale-110 shadow-indigo-200' : 
                        'border-gray-200 text-gray-300'}
                   `}>
                      {isCompleted && <Check size={32} strokeWidth={3} />}
                      {isCurrent && <Play size={32} fill="currentColor" className="ml-1" />}
                      {isLocked && <Lock size={28} />}
                   </div>
                   
                   {/* Connector Line Coloring */}
                   {index !== roadmapData.length - 1 && (
                      <div className={`w-1 flex-1 mt-2 mb-2 rounded transition-colors duration-1000 ${isCompleted ? 'bg-green-500' : 'bg-transparent'}`}></div>
                   )}
                </div>

                {/* Mobile Line Fix (Hidden on Desktop) */}
                <div className="md:hidden flex items-center gap-3 mb-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${
                        isCompleted ? 'bg-green-50 border-green-500 text-green-600' :
                        isCurrent ? 'bg-indigo-50 border-indigo-600 text-indigo-600' :
                        'bg-gray-50 border-gray-200 text-gray-400'
                    }`}>
                         {isCompleted ? <Check size={20} strokeWidth={3} /> : isCurrent ? <Play size={20} fill="currentColor" className="ml-1"/> : <Lock size={20} />}
                    </div>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Module {index + 1}</span>
                </div>

                {/* Content Card */}
                <div className={`flex-1 md:ml-24 bg-white p-6 sm:p-8 rounded-3xl border transition-all duration-300 group
                    ${isCurrent ? 'border-indigo-500 shadow-xl shadow-indigo-100/50 transform scale-[1.02]' : 'border-gray-100 shadow-sm'}
                `}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={`text-xl sm:text-2xl font-bold ${isCurrent ? 'text-indigo-700' : 'text-gray-900'}`}>
                                {item.title}
                            </h3>
                            <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-yellow-200 shrink-0">
                            <Star size={14} fill="currentColor" />
                            {item.xp} XP
                        </div>
                    </div>

                    {/* Topics Tags */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        {item.topics.map((topic, i) => (
                            <span key={i} className={`px-3 py-1 text-xs font-bold rounded-lg border 
                                ${isCompleted ? 'bg-green-50 border-green-200 text-green-700' : 
                                  isCurrent ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                                  'bg-gray-50 border-gray-200 text-gray-500'}`}>
                                {topic}
                            </span>
                        ))}
                    </div>

                    {/* Footer / Action Area */}
                    <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center text-gray-400 text-sm font-bold">
                            <Clock size={16} className="mr-1.5" />
                            {item.duration}
                        </div>

                        {/* Interactive Buttons */}
                        {isCurrent ? (
                            <button 
                                onClick={() => handleCompleteModule(index)}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 shadow-md shadow-indigo-200"
                            >
                                Complete Module <Check size={18} strokeWidth={3} />
                            </button>
                        ) : isCompleted ? (
                            <button className="flex items-center gap-2 text-green-600 bg-green-50 px-5 py-2.5 rounded-xl font-bold hover:bg-green-100 transition-colors">
                                Completed <Check size={18} strokeWidth={3} />
                            </button>
                        ) : (
                            <button disabled className="flex items-center gap-2 text-gray-400 px-5 py-2.5 rounded-xl font-bold bg-gray-50 cursor-not-allowed border border-gray-100">
                                <Lock size={16} /> Locked
                            </button>
                        )}
                    </div>
                </div>

              </div>
            );
          })}
        </div>
        
        {/* End of Road Reward */}
        <div className={`mt-16 flex flex-col items-center justify-center text-center transition-all duration-1000
            ${progressPercent === 100 ? 'opacity-100 scale-110' : 'opacity-40'}
        `}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-lg
                ${progressPercent === 100 ? 'bg-gradient-to-tr from-yellow-400 to-amber-600 text-white shadow-yellow-200 animate-bounce' : 'bg-gray-200 text-gray-400'}
            `}>
                <Award size={48} strokeWidth={1.5} />
            </div>
            <h3 className={`text-2xl font-black ${progressPercent === 100 ? 'text-gray-900' : 'text-gray-400'}`}>
                {topic} Certification
            </h3>
            <p className={`text-sm mt-1 font-semibold ${progressPercent === 100 ? 'text-indigo-600' : 'text-gray-400'}`}>
                {progressPercent === 100 ? 'Mastery Achieved! 🎉' : 'Complete all modules to unlock'}
            </p>
        </div>

      </div>
    </div>
  );
};

export default RoadmapPage;