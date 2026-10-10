// IMPORTS
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://techmate-wjf7.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// HUGGING FACE CONFIGURATION
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_MODEL = "openai/gpt-oss-120b:fastest";

async function callHuggingFace(messages, maxTokens = 800) {
  if (!process.env.HF_API_KEY) {
    throw new Error("HF_API_KEY is missing from environment variables");
  }

  const response = await axios.post(
    HF_API_URL,
    {
      model: HF_MODEL,
      messages,
      max_tokens: maxTokens,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 120000,
    }
  );

  const reply = response.data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("Hugging Face returned an empty response");
  }

  return reply;
}

// MOCK DATABASE
const USER_DATA = {
  id: 1,
  name: "Alex Johnson",
  email: "student@demo.com",
  role: "student",
  level: "Intermediate Dev",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
};

const DASHBOARD_STATS = {
  topicsLearned: 42,
  quizzesTaken: 15,
  averageScore: 88,
  streak: 12,
  recentActivity: [
    {
      type: "quiz",
      title: "React Hooks Mastery",
      date: "2 hours ago",
      score: "9/10",
    },
    {
      type: "note",
      title: "Redux State Management",
      date: "5 hours ago",
      score: null,
    },
    {
      type: "video",
      title: "Intro to Tailwind CSS",
      date: "1 day ago",
      score: null,
    },
  ],
  progressData: [
    { day: "Mon", hours: 2.5 },
    { day: "Tue", hours: 4.0 },
    { day: "Wed", hours: 3.2 },
    { day: "Thu", hours: 5.5 },
    { day: "Fri", hours: 1.8 },
  ],
  courses: [
    {
      name: "Advanced React Patterns",
      progress: 75,
      total: 20,
      completed: 15,
    },
    {
      name: "Node.js Backend API",
      progress: 45,
      total: 32,
      completed: 14,
    },
  ],
};

// HELPER
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// HEALTH CHECK
app.get("/", (req, res) => {
  res.send("TechMate API is running!");
});

// DASHBOARD
app.get("/api/dashboard/stats", async (req, res) => {
  await delay(500);
  res.json({
    user: USER_DATA,
    ...DASHBOARD_STATS,
  });
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  await delay(500);

  const { email, password } = req.body;

  if (email === "student@demo.com" && password === "password") {
    return res.json({
      success: true,
      token: "fake-jwt-token",
      user: USER_DATA,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
});

// AI ROADMAP
app.post("/api/ai/roadmap", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const prompt = `
Generate a 5-step learning roadmap to master "${topic}".

Return ONLY a valid JSON array in this format:
[
  {
    "id": 1,
    "title": "Module Title",
    "description": "Short description",
    "xp": 500,
    "duration": "2h 00m",
    "topics": ["Concept 1", "Concept 2", "Concept 3", "Concept 4"]
  }
]
`;

    const content = await callHuggingFace(
      [{ role: "user", content: prompt }],
      2000
    );

    const cleanText = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleanText.indexOf("[");
    const end = cleanText.lastIndexOf("]");

    if (start === -1 || end === -1 || end < start) {
      throw new Error("AI did not return a valid JSON array");
    }

    const roadmap = JSON.parse(cleanText.substring(start, end + 1));

    return res.json({ roadmap });
  } catch (error) {
    console.error(
      "HF ROADMAP ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Roadmap generation failed",
    });
  }
});

// CODE EXECUTION
app.post("/api/code/execute", async (req, res) => {
  try {
    const { language, code } = req.body;

    const languageMap = {
      python: 71,
      javascript: 63,
      cpp: 54,
      java: 62,
    };

    if (!languageMap[language]) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    if (!code) {
      return res.status(400).json({
        message: "Code is required",
      });
    }

    const response = await axios.post(
      "https://ce.judge0.com/submissions/?base64_encoded=false&wait=true",
      {
        source_code: code,
        language_id: languageMap[language],
      },
      { timeout: 30000 }
    );

    const data = response.data;
    const isError = data.status && data.status.id !== 3;

    const output = isError
      ? data.stderr ||
        data.compile_output ||
        data.message ||
        "Unknown error"
      : data.stdout || "Program finished with no output.";

    return res.json({
      run: {
        output,
        code: isError ? 1 : 0,
      },
    });
  } catch (error) {
    console.error("CODE EXECUTION ERROR:", error.message);

    return res.status(500).json({
      run: {
        output: "Server error: Could not execute code.",
        code: 1,
      },
    });
  }
});

// AI QUIZ
app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic required" });
    }

    const prompt = `
Generate 10 multiple-choice quiz questions about "${topic}".

Return ONLY a valid JSON array in this format:
[
  {
    "id": 1,
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Explanation"
  }
]

The answer field must be an index from 0 to 3.
`;

    const content = await callHuggingFace(
      [{ role: "user", content: prompt }],
      3500
    );

    const cleanText = content
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const start = cleanText.indexOf("[");
    const end = cleanText.lastIndexOf("]");

    if (start === -1 || end === -1 || end < start) {
      throw new Error("AI did not return a valid JSON array");
    }

    const quiz = JSON.parse(cleanText.substring(start, end + 1));

    return res.json({ quiz });
  } catch (error) {
    console.error(
      "HF QUIZ ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Quiz generation failed",
    });
  }
});

// COURSE PROGRESS
app.get("/api/courses/progress", async (req, res) => {
  await delay(500);

  return res.json({
    success: true,
    courses: DASHBOARD_STATS.courses,
  });
});

// AI CHAT
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        message: "A non-empty messages array is required",
      });
    }

    const conversation = [
      {
        role: "system",
        content:
          "You are TechMate, a helpful AI learning assistant. Explain concepts clearly, use bullet points when useful, and provide code examples where relevant. Help users learn programming, computer science, and technology.",
      },
      ...messages,
    ];

    const reply = await callHuggingFace(conversation, 1000);

    return res.json({ reply });
  } catch (error) {
    console.error(
      "HF CHAT ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Chat API failed",
      error:
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unknown Hugging Face error",
    });
  }
});

// AI SMART NOTES
app.post("/api/ai/notes", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text required",
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an expert tutor. Convert the provided text into structured study notes with clear headings, key points, and examples.",
      },
      {
        role: "user",
        content: text,
      },
    ];

    const notes = await callHuggingFace(messages, 1000);

    return res.json({ notes });
  } catch (error) {
    console.error(
      "HF NOTES ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "AI notes generation failed",
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`TechMate backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
