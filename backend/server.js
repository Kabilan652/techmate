// ============================================
// TECHMATE AI - BACKEND SERVER
// ============================================

// IMPORTS
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();  
const PORT = process.env.PORT || 5000;

// ============================================
// GEMINI CONFIGURATION
// ============================================

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

// Keep this model only if it is available to your API key.
const GEMINI_MODEL = "gemini-2.5-flash";
// Maximum time to wait for Gemini.
const GEMINI_TIMEOUT = 20000;

// ============================================
// MIDDLEWARE
// ============================================

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

app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

// ============================================
// GEMINI HELPER
// ============================================

async function callGemini(messages, maxTokens = 256) {
  if (!ai) {
    const error = new Error(
      "GEMINI_API_KEY is missing from environment variables"
    );

    error.status = 500;
    throw error;
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("A non-empty messages array is required");
  }

  // Extract system instructions.
  const systemInstruction = messages
    .filter((msg) => msg.role === "system")
    .map((msg) => String(msg.content ?? ""))
    .join("\n");

  // Convert messages into Gemini format.
  const contents = messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => {
      if (!["user", "assistant", "model"].includes(msg.role)) {
        throw new Error(`Unsupported message role: ${msg.role}`);
      }

      return {
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [
          {
            text: String(msg.content ?? ""),
          },
        ],
      };
    });

  if (contents.length === 0) {
    throw new Error("At least one user message is required");
  }

  const startTime = Date.now();

  let timeoutId;

  try {
    console.log(`Gemini request started: ${GEMINI_MODEL}`);

    // Race the API request against a timeout.
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        const error = new Error(
          `Gemini request timed out after ${GEMINI_TIMEOUT / 1000} seconds`
        );

        error.status = 504;
        reject(error);
      }, GEMINI_TIMEOUT);
    });

    const responsePromise = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        maxOutputTokens: maxTokens,
        ...(systemInstruction
          ? { systemInstruction }
          : {}),
      },
    });

    const response = await Promise.race([
      responsePromise,
      timeoutPromise,
    ]);

    console.log(
      `Gemini response received in ${Date.now() - startTime}ms`
    );

    const reply = response.text;

    if (!reply || !reply.trim()) {
      throw new Error("Gemini returned an empty response");
    }

    return reply.trim();
  } catch (error) {
    console.error(
      `Gemini failed after ${Date.now() - startTime}ms:`,
      error.message
    );

    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

// ============================================
// GEMINI ERROR HANDLER
// ============================================

function handleGeminiError(label, error, res, defaultMessage) {
  console.error(`${label}:`, error.message);

  const status = Number(error.status || error.statusCode);

  if (status === 429) {
    return res.status(429).json({
      message: "AI usage limit reached. Please try again later.",
    });
  }

  if (status === 503) {
    return res.status(503).json({
      message:
        "Gemini is temporarily busy. Please try again shortly.",
    });
  }

  if (status === 504) {
    return res.status(504).json({
      message:
        "The AI response took too long. Please try again.",
    });
  }

  if (status === 400 || status === 404) {
    return res.status(502).json({
      message:
        "The AI request or model configuration is invalid.",
    });
  }

  if (status === 401 || status === 403) {
    return res.status(502).json({
      message:
        "Gemini authentication or permission failed.",
    });
  }

  return res.status(500).json({
    message: defaultMessage,
  });
}

// ============================================
// MOCK USER DATA
// ============================================

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

// ============================================
// HEALTH CHECK
// ============================================

app.get("/", (req, res) => {
  res.status(200).send("TechMate API is running!");
});

// ============================================
// DASHBOARD
// ============================================

app.get("/api/dashboard/stats", (req, res) => {
  return res.json({
    user: USER_DATA,
    ...DASHBOARD_STATS,
  });
});

// ============================================
// LOGIN
// ============================================

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "student@demo.com" &&
    password === "password"
  ) {
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

// ============================================
// AI ROADMAP
// ============================================

app.post("/api/ai/roadmap", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({
        message: "A valid topic is required",
      });
    }

    const prompt = `
Create a concise 5-step learning roadmap for "${topic}".

Return ONLY a valid JSON array in this format:

[
  {
    "id": 1,
    "title": "Module Title",
    "description": "Short description",
    "xp": 500,
    "duration": "2h 00m",
    "topics": [
      "Concept 1",
      "Concept 2",
      "Concept 3",
      "Concept 4"
    ]
  }
]

Do not include Markdown code fences.
`;

    const content = await callGemini(
      [{ role: "user", content: prompt }],
      1200
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

    const roadmap = JSON.parse(
      cleanText.substring(start, end + 1)
    );

    if (!Array.isArray(roadmap)) {
      throw new Error("Roadmap response must be an array");
    }

    return res.json({ roadmap });
  } catch (error) {
    return handleGeminiError(
      "GEMINI ROADMAP ERROR",
      error,
      res,
      "Roadmap generation failed"
    );
  }
});

// ============================================
// CODE EXECUTION
// ============================================

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

    if (typeof code !== "string" || !code.trim()) {
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
      {
        timeout: 30000,
      }
    );

    const data = response.data;

    const isError =
      data.status && data.status.id !== 3;

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
    console.error(
      "CODE EXECUTION ERROR:",
      error.message
    );

    return res.status(500).json({
      run: {
        output: "Server error: Could not execute code.",
        code: 1,
      },
    });
  }
});

// ============================================
// AI QUIZ
// ============================================

app.post("/api/ai/quiz", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== "string") {
      return res.status(400).json({
        message: "A valid topic is required",
      });
    }

    const prompt = `
Generate 10 multiple-choice quiz questions about "${topic}".

Return ONLY a valid JSON array in this format:

[
  {
    "id": 1,
    "question": "Question text",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "answer": 0,
    "explanation": "Short explanation"
  }
]

The answer must be an index from 0 to 3.
Do not include Markdown code fences.
`;

    const content = await callGemini(
      [{ role: "user", content: prompt }],
      2500
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

    const quiz = JSON.parse(
      cleanText.substring(start, end + 1)
    );

    if (!Array.isArray(quiz)) {
      throw new Error("Quiz response must be an array");
    }

    return res.json({ quiz });
  } catch (error) {
    return handleGeminiError(
      "GEMINI QUIZ ERROR",
      error,
      res,
      "Quiz generation failed"
    );
  }
});

// ============================================
// COURSE PROGRESS
// ============================================

app.get("/api/courses/progress", (req, res) => {
  return res.json({
    success: true,
    courses: DASHBOARD_STATS.courses,
  });
});

// ============================================
// AI CHAT
// ============================================

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, message } = req.body;

    let conversation;

    if (Array.isArray(messages) && messages.length > 0) {
      conversation = [
        {
          role: "system",
          content:
            "You are TechMate, a fast and helpful programming assistant. " +
            "Answer directly in 3-5 sentences. " +
            "Use short examples when useful.",
        },
        ...messages,
      ];
    } else if (
      typeof message === "string" &&
      message.trim()
    ) {
      conversation = [
        {
          role: "system",
          content:
            "You are TechMate, a fast and helpful programming assistant. " +
            "Answer directly in 3-5 sentences. " +
            "Use short examples when useful.",
        },
        {
          role: "user",
          content: message.trim(),
        },
      ];
    } else {
      return res.status(400).json({
        message:
          "A message or non-empty messages array is required",
      });
    }

    // Keep the system instruction and latest 6 messages.
    const systemMessage = conversation.find(
      (item) => item.role === "system"
    );

    const recentMessages = conversation
      .filter((item) => item.role !== "system")
      .slice(-6);

    const optimizedConversation = [
      ...(systemMessage ? [systemMessage] : []),
      ...recentMessages,
    ];

    // Short responses can reduce generation time.
    const reply = await callGemini(
      optimizedConversation,
      256
    );

    return res.json({ reply });
  } catch (error) {
    return handleGeminiError(
      "GEMINI CHAT ERROR",
      error,
      res,
      "Chat API failed"
    );
  }
});

// ============================================
// AI SMART NOTES
// ============================================

app.post("/api/ai/notes", async (req, res) => {
  try {
    const { text, topic } = req.body;

    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({
        message: "Text required",
      });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are an expert tutor. Create concise study notes " +
          "with headings, key points, definitions, and short examples.",
      },
      {
        role: "user",
        content: topic
          ? `Topic: ${topic}\n\nSource text:\n${text}`
          : text,
      },
    ];

    const notes = await callGemini(messages, 1000);

    return res.json({ notes });
  } catch (error) {
    return handleGeminiError(
      "GEMINI NOTES ERROR",
      error,
      res,
      "AI notes generation failed"
    );
  }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`TechMate backend running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
