/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Smile, PenTool, Sparkles, Calendar, BookOpen, Clock, Lightbulb, Trash2, Check } from "lucide-react";
import { JournalEntry, MoodType } from "../types";

interface JournalProps {
  journals: JournalEntry[];
  onAddJournal: (mood: MoodType, wins: string, challenges: string, lessons: string) => Promise<void>;
  onDeleteJournal: (id: string) => void;
}

export default function Journal({
  journals,
  onAddJournal,
  onDeleteJournal
}: JournalProps) {
  const [mood, setMood] = useState<MoodType>(MoodType.GOOD);
  const [wins, setWins] = useState("");
  const [challenges, setChallenges] = useState("");
  const [lessons, setLessons] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const moodSpecs: Record<MoodType, { label: string; emoji: string; color: string; border: string }> = {
    [MoodType.AMAZING]: { label: "Amazing", emoji: "😀", color: "text-emerald-400 bg-emerald-500/10", border: "border-emerald-500/40" },
    [MoodType.GOOD]: { label: "Good", emoji: "🙂", color: "text-indigo-400 bg-indigo-500/10", border: "border-indigo-500/40" },
    [MoodType.AVERAGE]: { label: "Average", emoji: "😐", color: "text-slate-400 bg-slate-500/10", border: "border-slate-500/40" },
    [MoodType.BAD]: { label: "Bad", emoji: "😔", color: "text-amber-400 bg-amber-500/10", border: "border-amber-500/40" },
    [MoodType.TERRIBLE]: { label: "Terrible", emoji: "😢", color: "text-rose-400 bg-rose-500/10", border: "border-rose-500/40" }
  };

  const todayStr = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const handleCreateJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wins.trim() && !challenges.trim()) return;
    setAnalyzing(true);
    
    try {
      await onAddJournal(mood, wins, challenges, lessons);
      setWins("");
      setChallenges("");
      setLessons("");
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left" id="journal-tab-root">
      
      {/* Left side: Add today's log form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl" id="journal-input-card">
          <div className="border-b border-indigo-950 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-white font-display flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-400" /> Daily Thought Journal
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-sans">{todayStr}</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md">
              COGNITIVE HEALTH RADAR
            </span>
          </div>

          <form onSubmit={handleCreateJournal} className="space-y-6" id="journal-fields-form">
            
            {/* Mood selector */}
            <div className="space-y-3">
              <label className="block text-xs font-mono text-indigo-400 uppercase tracking-widest font-bold">Select Mood Vector Area</label>
              <div className="grid grid-cols-5 gap-2">
                {(Object.entries(moodSpecs) as [MoodType, typeof moodSpecs[MoodType]][]).map(([key, spec]) => {
                  const isSelect = mood === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setMood(key)}
                      className={`py-3.5 border rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none ${isSelect ? spec.color + " " + spec.border + " scale-102 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-600/5" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                      id={`mood-button-${key}`}
                    >
                      <span className="text-2xl" role="img" aria-label={spec.label}>{spec.emoji}</span>
                      <span className="text-[10px] font-mono mt-1 tracking-tight">{spec.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wins text area */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" /> Core Wins (What went right today?)
              </label>
              <textarea
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="List achievements, task breakthroughs, consistency loops, or positive feelings..."
                className="w-full min-h-[70px] bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white focus:outline-none placeholder:text-slate-650"
                id="input-wins"
              />
            </div>

            {/* Challenges text area */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-indigo-400" /> Daily Weaknesses & Challenges
              </label>
              <textarea
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="Analyze friction, procrastinations, emotional slumps, or scheduling gaps..."
                className="w-full min-h-[70px] bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white focus:outline-none placeholder:text-slate-650"
                id="input-challenges"
              />
            </div>

            {/* Lessons learned */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-pink-400" /> Lessons Learned & Actions
              </label>
              <textarea
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="What protocol modification will you lock in tomorrow to avoid today's mistakes?"
                className="w-full min-h-[70px] bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white focus:outline-none placeholder:text-slate-650"
                id="input-lessons"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || (!wins.trim() && !challenges.trim())}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-indigo-600/30 text-white font-semibold rounded-xl text-center shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              id="sub-add-journal-btn"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="font-mono text-xs">Generating Cognitive AI Journal Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Submit Log & Trigger Gemini Summary</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right side: Historic Journal Database */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold font-display text-white border-b border-slate-900 pb-3">Reflection Archives</h3>
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-1" id="journal-history-list">
          {journals.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/30 border border-slate-805 rounded-2xl">
              <BookOpen className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-sans italic">Archives are empty.</p>
            </div>
          ) : (
            journals.map((entry) => {
              const spec = moodSpecs[entry.mood] || moodSpecs[MoodType.GOOD];
              const dateObj = new Date(entry.createdAt);
              const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              
              return (
                <div 
                  key={entry.id} 
                  className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 text-sm relative hover:border-slate-700 transition"
                  id={`archive-item-${entry.id}`}
                >
                  <div className="flex items-center justify-between border-b border-indigo-950 pb-2 mb-2">
                    <span className="text-xs font-mono text-indigo-400 font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm" title={`Mood: ${spec.label}`}>{spec.emoji}</span>
                      <button
                        onClick={() => onDeleteJournal(entry.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {entry.wins && (
                      <p className="text-slate-200">
                        <strong className="text-emerald-400 font-sans font-semibold">★ Wins:</strong> {entry.wins}
                      </p>
                    )}
                    {entry.challenges && (
                      <p className="text-slate-300">
                        <strong className="text-indigo-400 font-sans font-semibold">★ Friction:</strong> {entry.challenges}
                      </p>
                    )}
                    {entry.lessons && (
                      <p className="text-slate-300">
                        <strong className="text-pink-400 font-sans font-semibold">★ Lesson:</strong> {entry.lessons}
                      </p>
                    )}
                  </div>

                  {entry.aiSummary && (
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] leading-relaxed italic text-indigo-300">
                      <div className="flex items-center gap-1 mb-1 font-mono text-[9px] uppercase tracking-wider text-indigo-400 font-bold">
                        <Sparkles className="w-3.5 h-3.5" /> Cognitive recap summary:
                      </div>
                      "{entry.aiSummary}"
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
