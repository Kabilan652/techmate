import React, { useState } from 'react';
import { 
    Play, Copy, Check, Terminal, RotateCcw, 
    Code2, Sparkles, X, ChevronDown, Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- CONFIG: Supported Languages & Templates ---
const LANGUAGES = {
    javascript: {
        name: "JavaScript",
        version: "18.15.0",
        template: `console.log("Hello from JavaScript!");`
    },
    python: {
        name: "Python",
        version: "3.10.0",
        template: `print("Hello from Python!")`
    },
    java: {
        name: "Java",
        version: "15.0.2",
        template: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`
    },
    cpp: {
        name: "C++",
        version: "10.2.0",
        template: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`
    }
};

const CodePage = () => {
    const [selectedLang, setSelectedLang] = useState('javascript');
    const [code, setCode] = useState(LANGUAGES['javascript'].template);
    
    const [output, setOutput] = useState(null);
    const [isErrorOutput, setIsErrorOutput] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // AI Explanation States
    const [showExplanation, setShowExplanation] = useState(false);
    const [explanationText, setExplanationText] = useState('');
    const [isExplaining, setIsExplaining] = useState(false);

    // --- REAL CODE EXECUTION VIA BACKEND ---
    const handleRun = async () => {
        setIsRunning(true);
        setOutput(null);
        setIsErrorOutput(false);

        try {
            //  FIX: React fetches from your backend, it doesn't define app.post!
            const response = await fetch("http://localhost:5000/api/code/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language: selectedLang,
                    version: LANGUAGES[selectedLang].version,
                    code: code 
                })
            });

            if (!response.ok) throw new Error("Backend connection failed.");

            const data = await response.json();
            
            // Piston returns compile output (if failed) or run output
            if (data.compile && data.compile.code !== 0) {
                setOutput(data.compile.output);
                setIsErrorOutput(true);
            } else if (data.run) {
                setOutput(data.run.output || "Program finished with no output.");
                setIsErrorOutput(data.run.code !== 0);
            } else {
                setOutput("Unknown execution error.");
                setIsErrorOutput(true);
            }
        } catch (error) {
            console.error(error);
            setOutput("Network Error: Could not connect to your backend on port 5000.");
            setIsErrorOutput(true);
        } finally {
            setIsRunning(false);
        }
    };

    // --- GET AI EXPLANATION FROM YOUR BACKEND ---
    const handleExplain = async () => {
        if (!showExplanation) setShowExplanation(true);
        if (!code.trim()) return;

        setIsExplaining(true);
        setExplanationText('');

        const prompt = `Please briefly explain this ${LANGUAGES[selectedLang].name} code. Keep it under 3 paragraphs and explain what it does step-by-step:\n\n\`\`\`${selectedLang}\n${code}\n\`\`\``;

        try {
            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] })
            });

            if (!response.ok) throw new Error("Backend connection failed.");
            
            const data = await response.json();
            setExplanationText(data.reply);
        } catch (error) {
            setExplanationText(" Could not connect to your AI backend. Ensure port 5000 is running.");
        } finally {
            setIsExplaining(false);
        }
    };

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLang(lang);
        setCode(LANGUAGES[lang].template);
        setOutput(null);
        setShowExplanation(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setCode(LANGUAGES[selectedLang].template);
        setOutput(null);
        setShowExplanation(false);
    };

    // Allows the "Tab" key to insert spaces instead of leaving the textarea
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newCode = code.substring(0, start) + "    " + code.substring(end);
            setCode(newCode);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    return (
        <div className="h-full bg-gray-50 flex items-center justify-center p-4 sm:p-8 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 font-mono text-sm flex flex-col my-auto">
                
                {/* --- Toolbar --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700 gap-4 sm:gap-0">
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
                        <div className="flex space-x-1.5 group shrink-0">
                            <div className="w-3 h-3 rounded-full bg-red-500 group-hover:bg-red-600 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500 group-hover:bg-yellow-600 transition-colors"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500 group-hover:bg-green-600 transition-colors"></div>
                        </div>
                        
                        <div className="relative">
                            <select 
                                value={selectedLang}
                                onChange={handleLanguageChange}
                                className="appearance-none bg-gray-700 text-gray-200 font-semibold text-xs uppercase tracking-wider py-1.5 pl-3 pr-8 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer border border-gray-600"
                            >
                                {Object.keys(LANGUAGES).map(key => (
                                    <option key={key} value={key}>{LANGUAGES[key].name}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full sm:w-auto justify-end shrink-0">
                        <button 
                            onClick={handleExplain}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all font-sans font-bold text-xs ${showExplanation ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'text-indigo-400 bg-indigo-950/30 hover:bg-indigo-900/50 hover:text-indigo-300 border border-indigo-900/50'}`}
                        >
                            {isExplaining ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                            <span>{isExplaining ? 'Thinking...' : 'AI Explain'}</span>
                        </button>
                        <button 
                            onClick={handleCopy} 
                            className="flex items-center space-x-1 text-gray-400 hover:text-white hover:bg-gray-700 px-3 py-1.5 rounded transition-all font-sans font-medium text-xs"
                        >
                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                {/* --- Main Area: Editor & Explanation --- */}
                <div className="relative flex flex-col md:flex-row min-h-[400px]">
                    
                    <div className="hidden sm:block w-12 bg-gray-900 text-gray-600 text-right pr-3 pt-4 select-none border-r border-gray-800 leading-6 shrink-0">
                        {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>

                    <div className="flex-1 relative">
                        <textarea 
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full h-full min-h-[300px] bg-transparent text-gray-300 p-4 focus:outline-none resize-none leading-6 font-mono custom-scrollbar"
                            spellCheck="false"
                        />
                    </div>

                    {showExplanation && (
                        <div className="w-full md:w-80 bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 p-5 shadow-2xl flex flex-col overflow-y-auto max-h-[300px] md:max-h-none custom-scrollbar">
                            <div className="flex justify-between items-center mb-4 shrink-0">
                                <h4 className="text-indigo-400 font-bold flex items-center gap-2 font-sans">
                                    <Sparkles size={16} /> TechMate Analysis
                                </h4>
                                <button onClick={() => setShowExplanation(false)} className="text-gray-500 hover:text-white p-1 bg-gray-700 rounded-md">
                                    <X size={14} />
                                </button>
                            </div>
                            
                            <div className="text-gray-300 text-sm leading-relaxed font-sans prose prose-invert prose-sm">
                                {isExplaining ? (
                                    <div className="flex items-center gap-2 text-indigo-400 mt-4">
                                        <Loader2 size={16} className="animate-spin" /> Analyzing syntax...
                                    </div>
                                ) : explanationText ? (
                                    <ReactMarkdown>{explanationText}</ReactMarkdown>
                                ) : (
                                    <p className="text-gray-500 italic">Click the AI Explain button to analyze your code.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* --- Output Console --- */}
                <div className="bg-black p-4 sm:p-5 border-t border-gray-800 shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center">
                            <Terminal size={14} className="mr-2" /> Output Console
                        </span>
                        <div className="flex space-x-3">
                            <button 
                                onClick={handleReset}
                                className="text-gray-500 hover:text-white p-1.5 hover:bg-gray-800 rounded transition-colors"
                                title="Reset Code"
                            >
                                <RotateCcw size={14} />
                            </button>
                            <button 
                                onClick={handleRun}
                                disabled={isRunning}
                                className={`flex items-center space-x-1.5 px-4 py-1.5 rounded font-bold font-sans text-xs transition-all ${
                                    isRunning 
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                                }`}
                            >
                                {isRunning ? (
                                    <><Loader2 size={14} className="animate-spin" /> <span>Compiling...</span></>
                                ) : (
                                    <><Play size={14} fill="currentColor" /> <span>Run Code</span></>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`font-mono text-sm sm:text-base min-h-[80px] max-h-40 overflow-y-auto custom-scrollbar p-3 rounded bg-gray-900/50 ${isRunning ? 'opacity-50' : ''}`}>
                        {isRunning ? (
                            <span className="text-yellow-500 animate-pulse"> Executing on remote server...</span>
                        ) : output ? (
                            <pre className={`whitespace-pre-wrap ${isErrorOutput ? 'text-red-400' : 'text-green-400'}`}>
                                {output}
                            </pre>
                        ) : (
                            <span className="text-gray-600 italic">// Code output will appear here</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePage;