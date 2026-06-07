import { GoogleGenAI } from "@google/genai";

export const config = { runtime: "nodejs" };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { profile, tasks, habits, goals } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.json({
      recommendations: [
        "🎯 Complete at least 3 daily tasks early in the morning to lock in a Discipline multiplier.",
        "💧 Maintain your streak by checking your daily habit logs.",
        "📚 Allocate 30 minutes tonight to break your goals into bite-sized milestones."
      ]
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
    const context = `User: Level ${profile?.level || 1}, Streak ${profile?.streak || 0}
Scores: Health:${profile?.lifeScores?.health}%, Discipline:${profile?.lifeScores?.discipline}%, Finance:${profile?.lifeScores?.finance}%, Career:${profile?.lifeScores?.career}%
Tasks: ${JSON.stringify(tasks?.map((t: any) => ({ t: t.title, done: t.completed })))}
Habits: ${JSON.stringify(habits?.map((h: any) => ({ name: h.title, streak: h.streak })))}
Goals: ${JSON.stringify(goals?.map((g: any) => ({ name: g.title, progress: g.progress })))}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Give exactly 3 high-impact recommendations based on:\n${context}\n\nReturn a JSON array of 3 strings only: ["A","B","C"]`,
      config: { systemInstruction: "You are a sharp Life Strategy Advisor. Be concise and powerful.", responseMimeType: "application/json" }
    });

    const parsed = JSON.parse(response.text?.trim() || "[]");
    res.json({ recommendations: parsed });
  } catch (error) {
    console.error("Recommendations error:", error);
    res.json({
      recommendations: [
        "⚡ Complete today's highest leverage task for a 20XP discipline reward.",
        "🌱 Keep your daily habits consistent — streaks compound into identity.",
        "📊 Review your lowest life score and draft one clear goal milestone this week."
      ]
    });
  }
}
