const { GoogleGenAI } = require("@google/genai");
const Note = require("../models/Note");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const noteController = {
    generateNotes: async (req, res) => {
        try {
            const { topic, text } = req.body;

            if (!topic || !text) {
                return res.status(400).json({
                    error: "Topic and text are required.",
                });
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `
                    Create clear, well-organized study notes.

                    Topic: ${topic}

                    Source text:
                    ${text}

                    Return:
                    1. A concise summary.
                    2. Important key points.
                    3. Important terms and definitions.

                    Format the response using readable headings and bullet points.
                `,
            });

            const newNote = {
                topic,
                content: response.text || "No summary generated.",
                keyPoints: [],
            };

            res.json(newNote);
        } catch (error) {
            console.error("GEMINI NOTES ERROR:", error.message);

            res.status(500).json({
                error: "Failed to generate notes.",
            });
        }
    },

    getAllNotes: async (req, res) => {
        try {
            const notes = await Note.find().sort({ _id: -1 });
            res.json(notes);
        } catch (error) {
            console.error("GET NOTES ERROR:", error.message);

            res.status(500).json({
                error: "Failed to fetch notes.",
            });
        }
    },
};

module.exports = noteController;
