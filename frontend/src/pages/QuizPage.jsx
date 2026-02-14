import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw, 
  AlertCircle, Home, BrainCircuit, Timer, Sparkles, Loader2, BookOpen
} from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

const QuizPage = () => {
  // --- App States ---
  const [appState, setAppState] = useState('setup'); 
  const [topic, setTopic] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [error, setError] = useState(null);

  // --- Quiz States ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); 
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [timerActive, setTimerActive] = useState(false);

  // --- Auto-Scroll References ---
  const quizTopRef = useRef(null);
  const nextButtonRef = useRef(null);

  // --- API CALL: Generate Quiz ---
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setAppState('generating');
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() })
      });

      if (!response.ok) throw new Error("Server Error");

      const data = await response.json();
      
      if (data.quiz && data.quiz.length > 0) {
        setQuizData(data.quiz);
        setAppState('playing');
        setTimerActive(true);
        setTimeLeft(15);
      } else {
        throw new Error("Invalid quiz data received");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. The AI might be overloaded. Please try again.");
      setAppState('setup');
    }
  };

  // --- Timer Logic ---
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0 && appState === 'playing') {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedOption === null && appState === 'playing') {
      handleOptionClick(-1); // Timeout
    }
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, appState, selectedOption]);

  useEffect(() => {
    if (appState === 'playing') {
      setTimeLeft(15);
      setTimerActive(true);
    }
  }, [currentQuestion, appState]);

  // --- Quiz Actions ---
  const handleOptionClick = (index) => {
    if (selectedOption !== null) return; 
    setTimerActive(false);
    setSelectedOption(index);

    //  BUG FIX: Safe Answer Parsing (Just in case the AI returns "A" instead of 0)
    let aiAnswer = quizData[currentQuestion].answer;
    if (typeof aiAnswer === 'string') {
        const letterMatch = ['A', 'B', 'C', 'D'].indexOf(aiAnswer.toUpperCase());
        if (letterMatch !== -1) aiAnswer = letterMatch;
        else aiAnswer = parseInt(aiAnswer);
    }

    if (index !== -1) {
        const correct = index === aiAnswer;
        setIsCorrect(correct);
        if (correct) setScore(score + 1);
    } else {
        setIsCorrect(false); 
    }

    //  UX FIX: Auto-scroll down so the user can see the "Next Question" button!
    setTimeout(() => {
        nextButtonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizData.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedOption(null);
      setIsCorrect(null);

      //  UX FIX: Auto-scroll back to the top for the new question
      setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);

    } else {
      setAppState('finished');
    }
  };

  const startNewTopic = () => {
    setTopic('');
    setQuizData([]);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setAppState('setup');
  };

  const getProgressColor = () => {
    if (timeLeft > 7) return 'bg-indigo-500';
    if (timeLeft > 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  
  // RENDER PHASE 1: SETUP SCREEN
  
  if (appState === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 max-w-lg w-full">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-indigo-50 rounded-2xl">
              <Sparkles className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 mb-2">Generate a Custom Quiz</h1>
          <p className="text-center text-gray-500 mb-8 text-sm sm:text-base">Enter any topic you want to learn, and our AI will create a personalized test for you.</p>
          
          <form onSubmit={handleGenerateQuiz} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">What do you want to test?</label>
              <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., French Revolution, React Hooks, Python Basics..." 
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
              Generate My Quiz <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

 
  // RENDER PHASE 2: GENERATING (LOADING) SCREEN

  if (appState === 'generating') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crafting your Quiz...</h2>
        <p className="text-gray-500 text-center max-w-sm">Generating challenging questions about <span className="font-bold text-indigo-600">"{topic}"</span>. This usually takes 5-10 seconds.</p>
      </div>
    );
  }

  
  // RENDER PHASE 3: SCORE SCREEN

  if (appState === 'finished') {
    const percentage = (score / quizData.length) * 100;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 sm:p-10 max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
          <div className="flex justify-center">
            <div className={`p-6 rounded-full shadow-lg border animate-bounce relative ${percentage >= 80 ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' : 'bg-red-50 text-red-600 border-red-200'}`}>
                <Trophy size={56} strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{percentage >= 80 ? "Great Job!" : "Keep Practicing!"}</h2>
            <p className="text-gray-500 mt-3 text-sm sm:text-base">You completed the <span className="font-bold text-gray-700">{topic}</span> quiz.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-inner">
             <div className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-2">Final Score</div>
             <div className="text-6xl font-black text-indigo-600 flex items-baseline justify-center gap-1">
                {score}<span className="text-3xl text-gray-400 font-bold">/{quizData.length}</span>
             </div>
             <div className="text-sm font-semibold text-indigo-400 mt-2">{percentage}% Accuracy</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button 
                onClick={startNewTopic} 
                className="flex items-center justify-center py-3.5 px-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 hover:shadow-md transition-all"
            >
                <BookOpen size={18} className="mr-2" /> New Topic
            </button>
            <button 
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center justify-center py-3.5 px-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
            >
                <Home size={18} className="mr-2" /> Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

 
  // RENDER PHASE 4: QUIZ CARD (PLAYING)
  
  
  // Safe parsing for AI Answer just in case it returns "A" instead of 0
  let currentCorrectAnswer = quizData[currentQuestion].answer;
  if (typeof currentCorrectAnswer === 'string') {
      const letterMatch = ['A', 'B', 'C', 'D'].indexOf(currentCorrectAnswer.toUpperCase());
      if (letterMatch !== -1) currentCorrectAnswer = letterMatch;
      else currentCorrectAnswer = parseInt(currentCorrectAnswer);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 pb-20">
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-indigo-600 font-bold bg-indigo-50 px-4 py-2 rounded-lg capitalize">
              <BrainCircuit size={20} />
              <span>{topic}</span>
          </div>
          <button onClick={startNewTopic} className="text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors">
              Quit Quiz
          </button>
      </div>

      <div ref={quizTopRef} className="w-full max-w-3xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100 flex flex-col scroll-mt-6">
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-white">
            <div className="flex justify-between items-end mb-4">
                <div className="flex-1 mr-8">
                    <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Question {currentQuestion + 1} of {quizData.length}
                    </p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-indigo-600 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${((currentQuestion + 1) / quizData.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-sm border shrink-0 transition-colors duration-300 ${timeLeft <= 5 && timerActive ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-white border-gray-200'}`}>
                    {timeLeft <= 5 && timerActive ? <Timer size={18} className="text-red-500 animate-bounce" /> : <Clock size={18} className="text-gray-400" />}
                    <span className={`font-mono font-bold text-lg sm:text-xl tracking-tight ${timeLeft <= 5 && timerActive ? 'text-red-600' : 'text-gray-700'}`}>
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </span>
                </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-6">
                <div className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`} style={{ width: `${(timeLeft / 15) * 100}%` }}></div>
            </div>
        </div>

        <div className="p-6 sm:p-8 flex-1 bg-gray-50/30">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-8 leading-snug">
                {quizData[currentQuestion].question}
            </h2>
            <div className="space-y-3 sm:space-y-4">
                {quizData[currentQuestion].options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrectAnswer = index === currentCorrectAnswer;
                    let showCorrect = false, showWrong = false;

                    if (selectedOption !== null) {
                        if (selectedOption === -1) {
                            if (isCorrectAnswer) showCorrect = true;
                        } else {
                            if (isCorrectAnswer) showCorrect = true;
                            if (isSelected && !isCorrectAnswer) showWrong = true;
                        }
                    }

                    let baseClasses = "w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center group relative overflow-hidden ";
                    if (selectedOption === null) {
                        baseClasses += "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 hover:shadow-sm cursor-pointer bg-white";
                    } else if (showCorrect) {
                        baseClasses += "border-green-500 bg-green-50 text-green-900 shadow-sm z-10";
                    } else if (showWrong) {
                        baseClasses += "border-red-500 bg-red-50 text-red-900";
                    } else {
                        baseClasses += "border-gray-100 bg-white text-gray-400 opacity-60 cursor-not-allowed";
                    }

                    return (
                        <button key={index} onClick={() => handleOptionClick(index)} disabled={selectedOption !== null} className={baseClasses}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-4 font-bold text-sm transition-colors ${selectedOption === null ? 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600' : showCorrect ? 'bg-green-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                {OPTION_LETTERS[index]}
                            </div>
                            <span className="font-semibold text-sm sm:text-base flex-1 pr-8">{option}</span>
                            <div className="absolute right-5">
                                {showCorrect && <CheckCircle className="text-green-500" size={24} />}
                                {showWrong && <XCircle className="text-red-500" size={24} />}
                            </div>
                        </button>
                    );
                })}
            </div>

            {selectedOption !== null && (
                <div className={`mt-8 p-5 sm:p-6 rounded-2xl border-2 ${selectedOption === -1 ? 'bg-orange-50 border-orange-200' : isCorrect ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-full shrink-0 ${selectedOption === -1 ? 'bg-orange-100 text-orange-600' : isCorrect ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <p className={`font-extrabold text-base sm:text-lg mb-1 ${selectedOption === -1 ? 'text-orange-800' : isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                                {selectedOption === -1 ? "⏱ Time's Up!" : isCorrect ? 'Spot on! Correct answer.' : 'Incorrect. Let\'s review.'}
                            </p>
                            {!isCorrect && (
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                    The correct answer is <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded">Option {OPTION_LETTERS[currentCorrectAnswer]}</span>
                                </p>
                            )}
                            <p className={`text-sm sm:text-base leading-relaxed ${selectedOption === -1 ? 'text-orange-700' : isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                                {quizData[currentQuestion].explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/*  Added ref here so we can auto-scroll to this button! */}
        <div ref={nextButtonRef} className="bg-white p-6 sm:p-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 scroll-mt-6">
            <div className="text-sm font-semibold text-gray-500 w-full sm:w-auto text-center sm:text-left">
                Current Score: <span className="text-indigo-600 font-black text-lg ml-1">{score}</span>
            </div>
            <button 
                onClick={handleNext}
                disabled={selectedOption === null}
                className={`w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 ${selectedOption === null ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 shadow-lg shadow-indigo-200'}`}
            >
                {currentQuestion === quizData.length - 1 ? 'See Final Results' : 'Next Question'}
                <ArrowRight size={20} className="ml-2" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;