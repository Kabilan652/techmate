import React, { useState } from 'react';

const NotesGenerator = () => {
    const [topic, setTopic] = useState("");
    const [text, setText] = useState("");
    const [generatedNote, setGeneratedNote] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic || !text) return;

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/notes/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, text }),
            });
            const data = await response.json();
            setGeneratedNote(data);
        } catch (error) {
            console.error("Error generating notes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Topic</label>
                <input
                    type="text"
                    className="w-full p-2 border rounded-lg"
                    placeholder="e.g., React Hooks"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Content to Summarize</label>
                <textarea
                    className="w-full p-2 border rounded-lg h-32"
                    placeholder="Paste text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? 'Generating Notes...' : 'Generate Notes'}
            </button>

            {generatedNote && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                    <h2 className="text-xl font-bold mb-4">{generatedNote.topic}</h2>
                    <p className="mb-4 text-gray-700 whitespace-pre-line">{generatedNote.content}</p>

                    {generatedNote.keyPoints && (
                        <div>
                            <h3 className="font-semibold mb-2">Key Points:</h3>
                            <ul className="list-disc list-inside text-gray-600">
                                {generatedNote.keyPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotesGenerator;
