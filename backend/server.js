
// IMPORTS

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const axios = require("axios"); // Using Axios for Hugging Face

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// MIDDLEWARE

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));


// MOCK DATABASE

const USER_DATA = {
    id: 1,
    name: "Alex Johnson",
    email: "student@demo.com",
    role: "student",
    level: "Intermediate Dev",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
};

const DASHBOARD_STATS = {
    topicsLearned: 42,
    quizzesTaken: 15,
    averageScore: 88,
    streak: 12,
    recentActivity: [
        { type: 'quiz', title: 'React Hooks Mastery', date: '2 hours ago', score: '9/10' },
        { type: 'note', title: 'Redux State Management', date: '5 hours ago', score: null },
        { type: 'video', title: 'Intro to Tailwind CSS', date: '1 day ago', score: null },
    ],
    progressData: [
        { day: 'Mon', hours: 2.5 }, { day: 'Tue', hours: 4.0 },
        { day: 'Wed', hours: 3.2 }, { day: 'Thu', hours: 5.5 },
        { day: 'Fri', hours: 1.8 },
    ],
    courses: [
        { name: "Advanced React Patterns", progress: 75, total: 20, completed: 15 },
        { name: "Node.js Backend API", progress: 45, total: 32, completed: 14 },
    ]
};


// HELPER DELAY FUNCTION

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// ROUTES


// HEALTH CHECK
app.get('/', (req, res) => {
    res.send(' EduDash API is running...');
});

// DASHBOARD ROUTE
app.get('/api/dashboard/stats', async (req, res) => {
    await delay(1000);
    res.json({ user: USER_DATA, ...DASHBOARD_STATS });
});

// LOGIN ROUTE
app.post('/api/auth/login', async (req, res) => {
    await delay(1500);
    const { email, password } = req.body;

    if (email === "student@demo.com" && password === "password") {
        return res.json({ success: true, token: "fake-jwt-token", user: USER_DATA });
    }
    res.status(401).json({ success: false, message: "Invalid email or password" });
});


// AI ROADMAP GENERATOR ROUTE

app.post("/api/ai/roadmap", async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ message: "Topic required" });

        const prompt = `
Generate a 5-step learning roadmap to master "${topic}".
Return ONLY valid JSON like this:
[
  {
    "id": 1,
    "title": "Module Title",
    "description": "Short description of what will be learned.",
    "xp": 500,
    "duration": "2h 00m",
    "topics": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"]
  }
]
`;

        const response = await axios.post(
            "https://router.huggingface.co/v1/chat/completions",
            {
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1500
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let rawText = response.data.choices[0].message.content;
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const jsonStart = rawText.indexOf('[');
        const jsonEnd = rawText.lastIndexOf(']') + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
           throw new Error("AI did not return a valid JSON array");
        }

        const cleanJsonString = rawText.substring(jsonStart, jsonEnd);
        const roadmapData = JSON.parse(cleanJsonString);

        res.json({ roadmap: roadmapData });

    } catch (error) {
        console.error("🔥 HF ROADMAP ERROR:", error.response?.data || error.message);
        res.status(500).json({ message: "Roadmap generation failed" });
    }
});
app.post("/api/code/execute", async (req, res) => {
    try {
        const { language, version, code } = req.body;

        //  FIX: Updated to the new, official Piston API domain (emkc.org)
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: language,
            version: version,
            files: [{ content: code }]
        });

        res.json(response.data);
    } catch (error) {
        console.error("🔥 EXECUTION ERROR:", error.message);
        res.status(500).json({ message: "Code execution engine failed." });
    }
});

app.post("/api/ai/quiz", async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) return res.status(400).json({ message: "Topic required" });

        //  CHANGED: Explicitly ask for 10 questions here
        const prompt = `
Generate 10 MCQ quiz questions about "${topic}".

Return ONLY valid JSON like this:
[
  {
    "id": 1,
    "question": "...",
    "options": ["A","B","C","D"],
    "answer": 0,
    "explanation": "..."
  }
]
`;

        const response = await axios.post(
            "https://router.huggingface.co/v1/chat/completions",
            {
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [{ role: "user", content: prompt }],
                // CHANGED: Increased max_tokens to 2500 so the AI doesn't get cut off while generating 10 questions!
                max_tokens: 2500
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        let rawText = response.data.choices[0].message.content;

        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

        //  ADDED: Extra safety check to ensure it extracts the array properly even if the AI adds chatty text at the beginning/end
        const jsonStart = rawText.indexOf('[');
        const jsonEnd = rawText.lastIndexOf(']') + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
           throw new Error("AI did not return a valid JSON array");
        }

        const cleanJsonString = rawText.substring(jsonStart, jsonEnd);
        const quizData = JSON.parse(cleanJsonString);

        res.json({ quiz: quizData });

    } catch (error) {
        console.error("🔥 HF QUIZ ERROR:", error.response?.data || error.message);
        res.status(500).json({
            message: "Quiz generation failed"
        });
    }
});

// AI CHATBOT ROUTE (100% Hugging Face)

app.post("/api/ai/chat", async (req, res) => {
    try {
        const { messages } = req.body;
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ message: "Messages array required" });
        }

        const response = await axios.post(
            "https://router.huggingface.co/v1/chat/completions",
            {
                // Using Microsoft Phi-3 because it is very stable on HF's free tier
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                messages: [
                    { 
                        role: "system", 
                        content: "You are TechMate, a helpful, encouraging, and expert AI learning assistant. Explain concepts clearly, use bullet points, and provide code examples where relevant." 
                    },
                    ...messages
                ],
                max_tokens: 800
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ reply: response.data.choices[0].message.content });

    } catch (error) {
        console.error("🔥 HF CHAT ERROR:", error.response?.data || error.message);
        res.status(500).json({ message: "Chat API failed" });
    }
});


// AI SMART NOTES ROUTE (100% Hugging Face)

app.post("/api/ai/notes", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text required" });

    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "mistralai/Mistral-7B-Instruct-v0.2",
        messages: [
          { role: "system", content: "You are an expert tutor who creates structured study notes." },
          { role: "user", content: text }
        ],
        max_tokens: 500
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ notes: response.data.choices[0].message.content });

  } catch (error) {
    console.error("🔥 HF NOTES ERROR:", error.response?.data || error.message);
    res.status(500).json({ message: "HuggingFace AI failed" });
  }
});


// START SERVER

app.listen(PORT, () => {
    console.log(`
🚀 Server Running Successfully

Local: http://localhost:${PORT}
Dashboard: http://localhost:${PORT}/api/dashboard/stats
AI Chat: http://localhost:${PORT}/api/ai/chat
AI Notes: http://localhost:${PORT}/api/ai/notes
`);
});