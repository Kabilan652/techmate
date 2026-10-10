const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const chatController = {
    chat: async (req, res) => {
        try {
            const { message } = req.body;

            if (!message || typeof message !== "string") {
                return res.status(400).json({
                    error: "Please provide a valid message.",
                });
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: message,
            });

            res.json({
                reply: response.text,
            });

        } catch (error) {
            console.error("GEMINI CHAT ERROR:", error.message);

            res.status(500).json({
                error: "Failed to generate an AI response.",
            });
        }
    },
};

module.exports = chatController;
