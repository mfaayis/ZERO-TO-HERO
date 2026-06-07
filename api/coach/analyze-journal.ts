import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs18.x" };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { mood, wins, challenges, lessons } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      summary: `Great work journaling today! Mood: "${mood}". Wins: "${wins || "None recorded"}". To unlock AI-powered journal analysis, add your Gemini API key in Vercel environment variables.`
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Analyze this daily journal entry:
Mood: ${mood}
Wins: ${wins}
Challenges: ${challenges}
Lessons: ${lessons}

Provide a hyper-focused, energetic coaching review (max 120 words). Celebrate the win, identify the hidden theme of the day, and give a precise protocol to overcome the challenge.`
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Journal analysis error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze journal" });
  }
}
