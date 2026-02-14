import React, { useState } from 'react';
import { Send, Loader2, Copy, CheckCircle, FileText, AlertCircle, Trash2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const NotesGenerator = () => {
    const [inputText, setInputText] = useState('');
    const [generatedNotes, setGeneratedNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    // Calculate word count for the new feature
    const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;

    const handleGenerate = async () => {
        if (!inputText.trim()) return;
        
        setIsLoading(true);
        setError(null);
        setGeneratedNotes('');

        try {
            const response = await fetch("http://localhost:5000/api/ai/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: inputText })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.notes) {
                setGeneratedNotes(data.notes);
            } else {
                throw new Error("Did not receive notes from the server.");
            }

        } catch (err) {
            console.error("Generation Error:", err);
            setError("Failed to connect to the AI. Please make sure your backend server is running on port 5000.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (generatedNotes) {
            navigator.clipboard.writeText(generatedNotes);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClear = () => {
        setInputText('');
        setGeneratedNotes('');
        setError(null);
    };

    return (
        // Changed to gap-6 for better mobile spacing, added lg:h-[600px] to lock the height on desktop
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 lg:h-[650px]">
            
            {/* LEFT COLUMN: Input Area */}
            <div className="flex flex-col h-full space-y-3 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                    <label className="text-sm md:text-base font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 rounded-md">
                            <FileText className="w-4 h-4 text-indigo-600" />
                        </div>
                        Source Material
                    </label>
                    {/* New Clear Button */}
                    {inputText && (
                        <button 
                            onClick={handleClear}
                            className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-red-50"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Clear
                        </button>
                    )}
                </div>

                {/* Textarea with custom scrollbar styling */}
                <textarea
                    className="w-full flex-1 min-h-[200px] lg:min-h-0 p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none outline-none text-gray-700 text-sm md:text-base leading-relaxed"
                    placeholder="Paste a lecture transcript, an article, or type a topic (e.g., 'Explain Quantum Computing')..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                
                {/* Word Count Feature */}
                <div className="text-right text-xs text-gray-400 font-medium px-1">
                    {wordCount} words
                </div>
                
                {error && (
                    <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-100">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{error}</span>
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !inputText.trim()}
                    className={`w-full py-4 px-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
                        ${isLoading || !inputText.trim() 
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing & Summarizing...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Generate Smart Notes
                        </>
                    )}
                </button>
            </div>

            {/* RIGHT COLUMN: Output Area */}
            <div className="flex flex-col h-full space-y-3 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center">
                    <label className="text-sm md:text-base font-bold text-gray-800 flex items-center gap-2">
                        <div className="p-1.5 bg-green-50 rounded-md">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        Generated Notes
                    </label>
                    
                    {generatedNotes && (
                        <button 
                            onClick={handleCopy}
                            className={`text-xs font-semibold flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg border
                                ${copied 
                                    ? 'bg-green-50 border-green-200 text-green-700' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                }`}
                        >
                            {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? 'Copied to Clipboard!' : 'Copy Notes'}
                        </button>
                    )}
                </div>

                {/* Output Container with independent scrolling */}
                <div className={`flex-1 min-h-[300px] lg:min-h-0 rounded-xl overflow-hidden relative ${generatedNotes ? 'bg-gray-50/50 border border-gray-200' : 'bg-gray-50 border-2 border-gray-200 border-dashed'}`}>
                    
                    {/* Scrollable interior */}
                    <div className="absolute inset-0 overflow-y-auto p-5 md:p-6 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 animate-in fade-in duration-500">
                                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-gray-600">Generating Magic</p>
                                    <p className="text-xs mt-1">This usually takes about 3-5 seconds...</p>
                                </div>
                            </div>
                        ) : generatedNotes ? (
                            /*  ReactMarkdown is used here to parse the AI's bolding and bullet points */
                            <div className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4">
                                <ReactMarkdown
                                    components={{
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-4" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-900 mt-5 mb-3" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-lg font-bold text-gray-800 mt-4 mb-2" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-4 text-gray-600" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 text-gray-600" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-2 text-gray-600" {...props} />,
                                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-gray-800" {...props} />,
                                    }}
                                >
                                    {generatedNotes}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                                    <FileText className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="text-sm font-medium">Your generated notes will appear here.</p>
                                <p className="text-xs mt-1 max-w-[200px]">Add text to the left and click generate to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default NotesGenerator;