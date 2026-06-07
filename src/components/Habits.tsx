/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Flame, Calendar, CheckCircle2, Award, Plus, Trash2, Sparkles, AlertCircle } from "lucide-react";
import { Habit } from "../types";

interface HabitsProps {
  habits: Habit[];
  onAddHabit: (title: string, frequency: "daily" | "weekly") => void;
  onToggleHabitDate: (id: string, dateStr: string) => void;
  onDeleteHabit: (id: string) => void;
}

export default function Habits({
  habits,
  onAddHabit,
  onToggleHabitDate,
  onDeleteHabit
}: HabitsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const todayStr = new Date().toISOString().split("T")[0];

  // Helper to generate the past 7 calendar dates for tracking
  const getPast7Days = () => {
    const arr = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateStr = d.toISOString().split("T")[0];
      const dayNum = d.getDate();
      arr.push({ dateStr, dayName, dayNum });
    }
    return arr;
  };

  const datesList = getPast7Days();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddHabit(title, frequency);
    setTitle("");
    setShowAddForm(false);
  };

  const calculateCompletionRate = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    // Calculate out of typical 30 days
    return Math.min(Math.round((habit.completedDates.length / 15) * 100), 100);
  };

  return (
    <div className="space-y-8 text-left" id="habits-tab-root">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display">Daily & Weekly Habits</h2>
          <p className="text-sm text-slate-400 mt-1">Consistency compounds. Toggle task dates below to record actions.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-mono font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          id="btn-open-create-habit"
        >
          <Plus className="w-4 h-4" /> Log New Habit
        </button>
      </div>

      {/* Creation form */}
      {showAddForm && (
        <form onSubmit={handleAddHabit} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4" id="add-habit-form">
          <h4 className="font-bold text-white font-display text-base">Initialize Habits Vector</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Habit Action Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 30 Minutes Cardio, Drink 3L Water"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                id="input-habit-title"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Frequency Standard</label>
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setFrequency("daily")}
                  className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer ${frequency === "daily" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Daily Target
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency("weekly")}
                  className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all cursor-pointer ${frequency === "weekly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Weekly Target
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-950 border border-slate-805 text-slate-400 hover:text-white rounded-xl text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs font-mono"
              id="sub-add-habit-btn"
            >
              Launch Habit
            </button>
          </div>
        </form>
      )}

      {/* Main Habits Board */}
      <div className="space-y-6">
        {habits.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-400 font-display">No habits tracked yet</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Consistency is everything. Click top right to define habits like Morning Cardio or Meditation lines.
            </p>
          </div>
        ) : (
          habits.map((habit) => {
            const completedToday = habit.completedDates.includes(todayStr);
            const rate = calculateCompletionRate(habit);
            
            return (
              <div 
                key={habit.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                id={`habit-card-${habit.id}`}
              >
                {/* Left block title */}
                <div className="space-y-2 lg:max-w-xs w-full">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-extrabold text-white font-display leading-tight">{habit.title}</h4>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-950 border border-slate-800 text-indigo-400 rounded-md">
                      {habit.frequency}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span>STREAK: <strong className="text-amber-400">{habit.streak}</strong></span>
                    </span>
                    <span>longest: <strong>{habit.longestStreak}</strong></span>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 mb-1">
                      <span>Consistency index</span>
                      <span>{rate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800/40">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rate}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Tracking Calendar Block */}
                <div className="flex flex-col sm:flex-row items-center gap-6" id={`habit-calendar-block-${habit.id}`}>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider block text-center sm:text-left mb-2">Trailing 7-Day Matrix</span>
                    <div className="flex gap-2">
                      {datesList.map((dt) => {
                        const isDone = habit.completedDates.includes(dt.dateStr);
                        return (
                          <div
                            key={dt.dateStr}
                            onClick={() => onToggleHabitDate(habit.id, dt.dateStr)}
                            className={`w-10 h-12 rounded-lg flex flex-col items-center justify-center border transition-all cursor-pointer select-none ${isDone ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}
                          >
                            <span className="text-[9px] font-mono uppercase tracking-tighter opacity-70">{dt.dayName}</span>
                            <span className="text-sm font-bold font-mono mt-0.5">{dt.dayNum}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto pt-4 sm:pt-0">
                    {/* Toggle Today button */}
                    <button
                      onClick={() => onToggleHabitDate(habit.id, todayStr)}
                      className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer ${completedToday ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" : "bg-indigo-600 hover:bg-indigo-500 text-white"}`}
                    >
                      {completedToday ? "★ Completed" : "+ Log Today"}
                    </button>

                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="p-2 border border-slate-800 hover:bg-rose-950 hover:border-rose-900 rounded-xl text-slate-500 hover:text-rose-400 transition-colors inline-flex justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
