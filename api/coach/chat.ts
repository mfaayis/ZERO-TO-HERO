import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history, profile, metricsSummary } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      text: `Hello ${profile?.name || "Hero"}! I am operating in Sandbox mode since no Gemini API Key is configured.\n\nYou are at **Level ${profile?.level || 1}**. Keep completing your checklist tasks to earn XP and level up!`
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    const systemPrompt = `You are a legendary AI Life Coach named "Zero to Hero Coach" who speaks with contagious energy and actionable wisdom. Help the user build relentless discipline and life mastery.
User status: Level ${profile?.level || 1}, Health:${profile?.lifeScores?.health}%, Discipline:${profile?.lifeScores?.discipline}%, Finance:${profile?.lifeScores?.finance}%, Career:${profile?.lifeScores?.career}%, Mindset:${profile?.lifeScores?.mindset}%
Context: ${metricsSummary || "Normal activity"}
Respond with crisp, powerful Markdown. No robotic preamble.`;

    const formattedContents = [
      ...history.map((h: { role: string; content: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: formattedContents as any,
      config: { systemInstruction: systemPrompt, temperature: 0.8 }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini chat error:", error);
    res.status(500).json({ error: error.message || "AI Coach unavailable" });
  }
}
