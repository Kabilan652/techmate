const Note = require('../models/Note');

const noteController = {
    generateNotes: async (req, res) => {
        const { topic, text } = req.body;

        // Mock AI Note Generation
        // In reality, this would call an AI service to summarize the text

        const summary = `Generated notes for: ${topic}\n\nSummary of text: ${text.substring(0, 50)}...`;
        const keyPoints = ["Key Point 1", "Key Point 2", "Important Term"];

        const newNote = {
            topic,
            content: summary,
            keyPoints
        };

        // If we had a database connection, we would save it here
        // const savedNote = await Note.create(newNote);

        // Simulate delay
        setTimeout(() => {
            res.json(newNote);
        }, 1000);
    },

    getAllNotes: async (req, res) => {
        // Mock fetching notes
        const notes = [
            { _id: '1', topic: 'React Hooks', content: 'Summary of React Hooks...', keyPoints: ['useState', 'useEffect'] },
            { _id: '2', topic: 'Node.js', content: 'Intro to Node.js...', keyPoints: ['Event Loop', 'Modules'] }
        ];
        res.json(notes);
    }
};

module.exports = noteController;
