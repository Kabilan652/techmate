import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Trash2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your AI learning assistant. What topic would you like to explore today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input.trim() };
        
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const apiMessages = newMessages.filter(msg => 
            !msg.content.includes("Hello! I'm your AI learning assistant") && 
            !msg.content.includes("Chat cleared!")
        );

        try {
            const response = await fetch("http://localhost:5000/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!response.ok) throw new Error("Server Error");

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: " *Connection error.* I couldn't reach the server. Please try again in a moment." 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearChat = () => {
        setMessages([{ role: 'assistant', content: "Chat cleared! Let's start fresh. What shall we talk about next?" }]);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 w-full relative">
            
            {/* Top Bar - Sleek & Minimal */}
            <div className="px-4 sm:px-6 py-3 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">TechMate Assistant</span>
                </div>
                <button 
                    onClick={handleClearChat}
                    className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-all px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear Chat
                </button>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar">
                {messages.map((msg, idx) => (
                    //  ALIGNMENT FIX: Changed to items-start so avatars stay at the top of long messages
                    <div key={idx} className={`flex gap-3 sm:gap-4 items-start w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        
                        {/* Avatar */}
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1 
                            ${msg.role === 'user' 
                                ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white' 
                                : 'bg-white border border-gray-200 text-indigo-600'}`}>
                            {msg.role === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 sm:px-5 sm:py-4 shadow-sm 
                            ${msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-sm' // Tail points right
                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm' // Tail points left
                        }`}>
                            {msg.role === 'user' ? (
                                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <div className="text-sm sm:text-base leading-relaxed">
                                    <ReactMarkdown
                                        components={{
                                            p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                            code: ({node, inline, ...props}) => 
                                                inline ? (
                                                    <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md text-sm font-medium" {...props} />
                                                ) : (
                                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto my-3 text-sm shadow-inner"><code {...props} /></pre>
                                                )
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="flex gap-3 sm:gap-4 items-start flex-row animate-in fade-in duration-300">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0 mt-1">
                            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 animate-pulse" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5 h-[52px]">
                            <span className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                            <span className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <div className="p-4 sm:p-5 bg-white border-t border-gray-100 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.05)] z-10">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-end gap-2">
                    <div className="relative flex-1">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                // Allow sending with "Enter" (but Shift+Enter makes a new line)
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="Message TechMate... (Press Enter to send)"
                            className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm sm:text-base rounded-2xl py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-inner resize-none min-h-[52px] max-h-[120px]"
                            rows={1}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200 ${
                                !input.trim() || isLoading 
                                    ? 'bg-transparent text-gray-300' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-md'
                            }`}
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
                <div className="text-center mt-2.5">
                    <span className="text-[11px] font-medium text-gray-400 tracking-wide">
                        TechMate can make mistakes. Consider verifying important code or facts.
                    </span>
                </div>
            </div>
            
        </div>
    );
};

export default ChatInterface;