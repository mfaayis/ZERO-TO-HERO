/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry headers as mandated by skill guidelines
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fallback to helper heuristics.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ── AI Life Coach Chat Endpoint ──────────────────────────────────────────────
app.post("/api/coach/chat", async (req, res) => {
  const { message, history, profile, metricsSummary } = req.body;

  if (!apiKey) {
    // Graceful offline fallback in case are no secrets configured
    return res.json({
      text: `Hello ${profile?.name || "Hero"}! I am operating in Sandbox mode since no Gemini API Key is configured in the Secrets panel.\n\nFrom reviewing your dashboard, you are currently at **Level ${profile?.level || 1}** with a focus scores of: *Health: ${profile?.lifeScores?.health || 50}%, Discipline: ${profile?.lifeScores?.discipline || 50}%*. Keep completing your checklist tasks and tracking habits to earn XP and level up from Zero to Hero!`
    });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a legendary AI Life Coach named "Zero to Hero Coach" who speaks with contagious energy, crisp directness, and profound actionable wisdom. Your mission is to help the user build relentless discipline, perfect consistency, and complete life mastery.
The user's current status:
- Level: ${profile?.level || 1}
- Current Focus Statistics: Health:${profile?.lifeScores?.health}%, Discipline:${profile?.lifeScores?.discipline}%, Finance:${profile?.lifeScores?.finance}%, Career:${profile?.lifeScores?.career}%, Learning:${profile?.lifeScores?.learning}%, Relationships:${profile?.lifeScores?.relationships}%, Mindset:${profile?.lifeScores?.mindset}%
- High level health check: ${metricsSummary || "Normal dashboard activity"}

Respond to their queries with tailored schedules, powerful study plans, workout setups, habits, and fierce motivation. Keep paragraphs punchy and readable. Avoid robotic preamble, go straight into elite mentorship. Format response in elegant Markdown.`;

    // Package the chat history with standard roles
    const formattedContents = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    // Align content query with @google/genai guidelines
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents as any,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/coach/chat:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI Coach" });
  }
});

// AI Daily Recommendations generator
app.post("/api/coach/recommendations", async (req, res) => {
  const { profile, tasks, habits, goals } = req.body;

  if (!apiKey) {
    return res.json({
      recommendations: [
        "🎯 Complete at least 3 daily tasks early in the morning to locked in a 'Discipline multiplier'.",
        "💧 Maintain your current streak by toggling off your daily habit tracking logs.",
        "📚 Allocate 30 minutes tonight to break your active milestones down into achievable bite-sized progress chunks."
      ]
    });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = "You are a sharp Life Strategy Advisor. Analyze the user's dashboard data and generate exactly 3 highly specific, hyper-actionable, bulleted recommendations to level up their life score. Be concise, direct, and powerful.";
    
    const context = `
User Profile: Level ${profile?.level || 1}, Streak ${profile?.streak || 0}
Active Life Scores: Health: ${profile?.lifeScores?.health}%, Discipline: ${profile?.lifeScores?.discipline}%, Finance: ${profile?.lifeScores?.finance}%, Career: ${profile?.lifeScores?.career}%, Learning: ${profile?.lifeScores?.learning}%, Mindset: ${profile?.lifeScores?.mindset}%
Active Tasks: ${JSON.stringify(tasks?.map((t: any) => ({ t: t.title, done: t.completed })))}
Active Habits: ${JSON.stringify(habits?.map((h: any) => ({ name: h.title, streak: h.streak })))}
Active Goals: ${JSON.stringify(goals?.map((g: any) => ({ name: g.title, progress: g.progress })))}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Draft exactly 3 high-impact habits or priority corrections based on this status:\n${context}\n\nFormat the response as a JSON array of 3 strings. Direct array layout like ["A", "B", "C"]. Do not envelope in other elements.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "[]");
    res.json({ recommendations: parsed });
  } catch (error) {
    console.error("Gemini Recommendations Error:", error);
    res.json({
      recommendations: [
        "⚡ Complete today's highest leverage task to secure a 20XP discipline reward.",
        "🌱 Keep your daily meditations in check. Consistency is the foundation of high Life Scores.",
        "📊 Review your lowest scoring life area in goals and draft one clear milestone for it this week."
      ]
    });
  }
});

// AI Journal Summarizer
app.post("/api/coach/analyze-journal", async (req, res) => {
  const { mood, wins, challenges, lessons } = req.body;

  if (!apiKey) {
    return res.json({
      summary: `Awesome work writing in your journal today! Your mood is recorded as "${mood}". Your core wins included: "${wins || "None recorded"}". Keep crushing challenges and learning from lessons like "${lessons || "N/A"}". To activate actual AI-powered journal summaries and cognitive sentiment tracking, link a valid Gemini key in Settings > Secrets!`
    });
  }

  try {
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analyze my daily journal entry:
Mood: ${mood}
Wins: ${wins}
Challenges: ${challenges}
Lessons Learned: ${lessons}

Provide a hyper-focused, energetic, and empathetic coaching review (max 120 words). Outline the hidden theme of my day, celebrate the win, and offer a precise psychological protocol to smash the challenges.`,
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Gemini Journal Summary Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze journal" });
  }
});

// Setup Vite & Static Assets routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server loaded successfully, operating on PORT ${PORT}`);
  });
}

startServer();
