import React from 'react';
import { MessageSquare } from 'lucide-react';
import ChatInterface from '../components/ChatInterface';

const ChatPage = () => {
    return (
        // Adjusted padding (pt-8) to ensure it clears any sticky top-nav you might have
        <div className="h-full min-h-screen bg-gray-50 p-4 pt-6 sm:p-8 flex flex-col">
            
            {/* Added pb-12 to ensure the bottom doesn't hit the floor of the browser */}
            <div className="max-w-5xl mx-auto w-full h-full flex flex-col space-y-6 pb-12">
                
                {/* Header Section */}
                {/*  FIX: Added `shrink-0` so Flexbox is forbidden from squishing this header */}
                <div className="shrink-0 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-xl shrink-0 mt-1 sm:mt-0">
                        <MessageSquare className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        {/*  FIX: Added `leading-tight` and `pt-1` to prevent font clipping at the top */}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight pt-1">
                            TechMate AI Assistant
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base mt-1.5">
                            Ask questions, clarify complex topics, or debug your code in real-time.
                        </p>
                    </div>
                </div>

                {/* Main Chat Area Wrapper */}
                {/*  FIX: Removed fixed heights (like h-[700px]) and let flex-1 handle it dynamically */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col min-h-[500px]">
                    <ChatInterface />
                </div>
                
            </div>
        </div>
    );
};

export default ChatPage;