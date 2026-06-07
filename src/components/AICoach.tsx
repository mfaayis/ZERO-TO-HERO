/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Zap, Brain, ShieldAlert, Award, Compass, MessageCircle, RefreshCw } from "lucide-react";
import { UserProfile } from "../types";

interface ChatMessage {
  role: "user" | "coach";
  content: string;
  createdAt: string;
}

interface AICoachProps {
  profile: UserProfile;
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<string>;
  onResetChatHistory: () => void;
}

export default function AICoach({
  profile,
  chatHistory,
  onSendMessage,
  onResetChatHistory
}: AICoachProps) {
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Suggestions that users can click to chat about instantly
  const coachingShortcuts = [
    { title: "Plan Weekly Study Layout", prompt: "Create a structured, 7-day technical study plan to learn web programming, with morning study blocks." },
    { title: "Generate Cardio Workout Protocol", prompt: "Build a high-performance HIIT cardio workout routine that can be completed at home under 30 minutes, prioritizing bodyweight exercises." },
    { title: "Analyze My Life Score Index", prompt: "Looking at my active Life score scores, what is my weakest area of discipline and what exact habit should I implement to fix it?" },
    { title: "Unshakable AM Morning Habit", prompt: "Generate an elite morning routine from 6:00 AM to 8:30 AM to build maximum mental toughness, sleep structure, and focus readiness." },
  ];

  // Scroll to bottom whenever history alters
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, sending]);

  const handleSend = async (text: string) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setInputText("");
    
    try {
      await onSendMessage(text);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputText);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl md:p-6 p-4 text-left grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)] min-h-[500px]" id="coach-tab-root">
      
      {/* Sidebar Info Banner */}
      <div className="lg:col-span-1 border-r border-slate-800/80 pr-6 hidden lg:flex flex-col justify-between" id="coach-sidebar-metadata">
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-indigo-950 pb-4">
            <Brain className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-white font-display text-base">Elite AI Counselor</h3>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans space-y-3">
            <div className="font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 fill-indigo-400" /> CORE CHARACTERISTICS:
            </div>
            <p><strong>Name:</strong> Zero to Hero Counselor</p>
            <p><strong>Target:</strong> Radical Accountability, Perfect Streak preservation, Cognitive focus restructuring.</p>
            <p><strong>Method:</strong> Highly energetic, empathetic but direct advice, structured bullet strategies.</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-bold text-slate-200">ACTIVE DASHBOARD VECTOR:</span>
            <p>★ Name: {profile.name}</p>
            <p>★ Level Indicator: {profile.level}</p>
            <p>★ Day Streak: {profile.streak} Days</p>
          </div>
        </div>

        <button
          onClick={onResetChatHistory}
          className="text-[10px] w-full text-slate-500 hover:text-white font-mono hover:bg-slate-950 border border-slate-800 py-2 inline-flex items-center justify-center gap-1 rounded-lg transition"
        >
          <RefreshCw className="w-3 h-3" /> Reset Brain Memory
        </button>
      </div>

      {/* Main Dialogue Console */}
      <div className="lg:col-span-3 flex flex-col justify-between h-full relative" id="coach-console-grid">
        
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar" id="chat-messages-container">
          {chatHistory.length === 0 ? (
            <div className="text-center py-16 max-w-lg mx-auto space-y-4 pt-10">
              <MessageCircle className="w-12 h-12 text-indigo-400/80 mx-auto" />
              <h4 className="font-display text-lg font-bold text-white">Initialize Coaching Protocols</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with the mentor. Ask specific workout breakdowns, customized habit setups, cognitive performance guidelines, or read the preset shortcuts to get started.
              </p>

              {/* Suggestions shelf */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left pt-4">
                {coachingShortcuts.map((sc, id) => (
                  <button
                    key={id}
                    onClick={() => handleSend(sc.prompt)}
                    className="p-3 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-xl text-left text-xs text-indigo-300 hover:text-white transition cursor-pointer"
                  >
                    💡 {sc.title}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((m, id) => (
              <div 
                key={id} 
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <span className="text-[10px] text-slate-500 font-mono mb-1 px-1">{m.role === "user" ? "CHALLENGER PROFILE" : "GEMINI AI COUNSELOR"}</span>
                <div 
                  className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[85%] font-sans whitespace-pre-wrap ${
                    m.role === "user" 
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none" 
                      : "bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none"
                  }`}
                  id={`chat-bubble-${id}`}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}

          {sending && (
            <div className="flex flex-col items-start" id="ai-typing-loader">
              <span className="text-[10px] text-slate-500 font-mono mb-1 px-1">GEMINI AI COUNSELOR</span>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl rounded-bl-none text-sm text-slate-400 inline-flex items-center gap-2">
                <div className="flex gap-1.5 items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
                <span className="text-xs font-mono italic">Computing cognitive response...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Text Input Footer Form */}
        <form onSubmit={handleFormSubmit} className="border-t border-slate-800 pt-4" id="chat-input-bar">
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 hover:border-slate-700 transition focus-within:border-indigo-500">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything or request plan generations..."
              disabled={sending}
              className="flex-1 bg-transparent border-0 text-sm text-white focus:outline-none placeholder-slate-500 disabled:opacity-50"
              id="coach-input-field"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              id="coach-send-submit"
              className="p-1 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-600 text-white rounded-lg font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>SEND</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
