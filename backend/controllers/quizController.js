const Quiz = require('../models/Quiz');

const quizController = {
    generateQuiz: async (req, res) => {
        const { topic, difficulty } = req.body;

        // Mock AI Quiz Generation
        const questions = [
            {
                question: `What is a key feature of ${topic}?`,
                options: ["Feature A", "Feature B", "Feature C", "Feature D"],
                correctAnswer: "Feature A",
                explanation: "Feature A is a primary characteristic."
            },
            {
                question: `Which command is used to init a project in ${topic}?`,
                options: ["init", "start", "create", "new"],
                correctAnswer: "init",
                explanation: "The init command initializes the project."
            }
        ];

        const newQuiz = {
            topic,
            questions
        };

        // Simulate delay
        setTimeout(() => {
            res.json(newQuiz);
        }, 1000);
    }
};

module.exports = quizController;
