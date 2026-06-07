/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BarChart2, TrendingUp, Calendar, Target, DollarSign, Heart, BookOpen } from "lucide-react";
import { UserProfile, Task, Habit, Goal, JournalEntry } from "../types";

interface AnalyticsProps {
  profile: UserProfile;
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  journals: JournalEntry[];
}

export default function Analytics({
  profile,
  tasks,
  habits,
  goals,
  journals
}: AnalyticsProps) {
  const [activeChartTab, setActiveChartTab] = useState<"habits" | "finance" | "weight">("habits");

  // Summary Metrics calculations
  const totalTasksCompleted = tasks.filter(t => t.completed).length;
  const totalGoalsCompleted = goals.filter(g => g.completed).length;
  const journalMoodCounts = journals.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Interactive SVG chart mock points for finance growth
  const moneyTrendPoints = [
    { label: "Jan", val: 5000 },
    { label: "Feb", val: 6200 },
    { label: "Mar", val: 8000 },
    { label: "Apr", val: 11000 },
    { label: "May", val: 14000 },
    { label: "Jun", val: 18500 }
  ];

  // Interactive SVG points for Weight fluctuation
  const weightTrendPoints = [
    { label: "Wk 1", val: 82.5 },
    { label: "Wk 2", val: 81.8 },
    { label: "Wk 3", val: 81.2 },
    { label: "Wk 4", val: 80.5 },
    { label: "Wk 5", val: 80.1 },
    { label: "Wk 6", val: 79.4 }
  ];

  // SVG Chart Dimensions configuration
  const width = 500;
  const height = 180;
  const padding = 35;

  return (
    <div className="space-y-8 text-left" id="analytics-tab-root">
      
      {/* Overview Head */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-3xl font-extrabold text-white font-display">Performance Graphics</h2>
        <p className="text-sm text-slate-400 mt-1">Direct feedback metrics reporting your daily habits progress vectors.</p>
      </div>

      {/* Grid of Bento Summary metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="analytics-counters">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Level status</span>
            <strong className="text-xl text-white font-display">Rank {profile.level}</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-sans">goals completed</span>
            <strong className="text-xl text-white font-mono">{totalGoalsCompleted} Done</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Money saved index</span>
            <strong className="text-xl text-white font-mono">₹18,500</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl border border-pink-500/20">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">Wellness score</span>
            <strong className="text-xl text-white font-mono">{profile.lifeScores.health}%</strong>
          </div>
        </div>
      </div>

      {/* Main Chart Card switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="performance-chart-panel">
        
        {/* Toggle selectors */}
        <div className="flex border-b border-slate-800 pb-4 mb-6 gap-3" id="charts-tab-list">
          <button
            onClick={() => setActiveChartTab("habits")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition ${activeChartTab === "habits" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-950"}`}
          >
            ★ Habits completion rate
          </button>
          
          <button
            onClick={() => setActiveChartTab("finance")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition ${activeChartTab === "finance" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-950"}`}
          >
            ★ Financial compounding
          </button>

          <button
            onClick={() => setActiveChartTab("weight")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition ${activeChartTab === "weight" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-950"}`}
          >
            ★ Lean tissue weight trend
          </button>
        </div>

        {/* Visual graphs blocks rendering */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main big SVG graph col-span-2 */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 relative">
            <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span> Live vector feed
            </div>

            {activeChartTab === "habits" && (
              <div className="space-y-4" id="chart-habits-view">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wide block">Cumulative completions per habit</span>
                
                {habits.length === 0 ? (
                  <p className="py-12 text-slate-500 text-xs italic text-center">Establish active habits first.</p>
                ) : (
                  <div className="space-y-4 pt-2">
                    {habits.slice(0, 4).map((h) => {
                      const completeRate = h.completedDates.length > 0 ? Math.min(Math.round((h.completedDates.length / 10) * 100), 100) : 0;
                      return (
                        <div key={h.id} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-slate-300">{h.title}</span>
                            <span className="text-indigo-400 font-bold">{h.completedDates.length} Logged days ({completeRate}%)</span>
                          </div>
                          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${completeRate}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeChartTab === "finance" && (
              <div id="chart-finance-view">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wide block mb-4">India INR compound growth indices</span>
                <svg viewBox="0 0 500 180" className="w-full h-auto overflow-visible">
                  {/* Grid Lines */}
                  <line x1="35" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3" />
                  <line x1="35" y1="80" x2="480" y2="80" stroke="#1e293b" strokeDasharray="3" />
                  <line x1="35" y1="140" x2="480" y2="140" stroke="#1e293b" strokeDasharray="3" />
                  
                  {/* Trend Area with Gradient */}
                  <defs>
                    <linearGradient id="moneyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path
                    d={`M 35 140 L 100 130 L 180 110 L 265 80 L 370 50 L 460 20 L 460 145 Z`}
                    fill="url(#moneyGrad)"
                  />
                  
                  {/* Trend Line */}
                  <path
                    d={`M 35 140 L 100 130 L 180 110 L 265 80 L 370 50 L 460 20`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Nodes dots */}
                  <circle cx="100" cy="130" r="4.5" fill="#a5b4fc" />
                  <circle cx="180" cy="110" r="4.5" fill="#a5b4fc" />
                  <circle cx="265" cy="80" r="4.5" fill="#a5b4fc" />
                  <circle cx="370" cy="50" r="4.5" fill="#a5b4fc" />
                  <circle cx="460" cy="20" r="4.5" fill="#a5b4fc" />

                  {/* Labels text */}
                  <text x="100" y="165" fill="#64748b" fontSize="10" fontClassName="font-mono" textAnchor="middle">Feb</text>
                  <text x="180" y="165" fill="#64748b" fontSize="10" fontClassName="font-mono" textAnchor="middle">Mar</text>
                  <text x="265" y="165" fill="#64748b" fontSize="10" fontClassName="font-mono" textAnchor="middle">Apr</text>
                  <text x="370" y="165" fill="#64748b" fontSize="10" fontClassName="font-mono" textAnchor="middle">May</text>
                  <text x="460" y="165" fill="#64748b" fontSize="10" fontClassName="font-mono" textAnchor="middle">Jun</text>
                </svg>
              </div>
            )}

            {activeChartTab === "weight" && (
              <div id="chart-weight-view">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wide block mb-4">Lean tissue body mass index (Kg)</span>
                <svg viewBox="0 0 500 180" className="w-full h-auto overflow-visible">
                  {/* Grid Lines */}
                  <line x1="35" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3" />
                  <line x1="35" y1="80" x2="480" y2="80" stroke="#1e293b" strokeDasharray="3" />
                  <line x1="35" y1="140" x2="480" y2="140" stroke="#1e293b" strokeDasharray="3" />

                  {/* Trend Area with purple gradient */}
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={`M 35 25 L 100 45 L 180 65 L 265 90 L 370 105 L 460 130 L 460 145 Z`}
                    fill="url(#weightGrad)"
                  />

                  {/* Trend Line (going down nicely) */}
                  <path
                    d={`M 35 25 L 100 45 L 180 65 L 265 90 L 370 105 L 460 130`}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Nodes dots */}
                  <circle cx="100" cy="45" r="4" fill="#fbcfe8" />
                  <circle cx="180" cy="65" r="4" fill="#fbcfe8" />
                  <circle cx="265" cy="90" r="4" fill="#fbcfe8" />
                  <circle cx="370" cy="105" r="4" fill="#fbcfe8" />
                  <circle cx="460" cy="130" r="4" fill="#fbcfe8" />

                  {/* Labels text */}
                  <text x="100" y="165" fill="#64748b" fontSize="10" textAnchor="middle">Wk 2</text>
                  <text x="180" y="165" fill="#64748b" fontSize="10" textAnchor="middle">Wk 3</text>
                  <text x="265" y="165" fill="#64748b" fontSize="10" textAnchor="middle">Wk 4</text>
                  <text x="370" y="165" fill="#64748b" fontSize="10" textAnchor="middle">Wk 5</text>
                  <text x="460" y="165" fill="#64748b" fontSize="10" textAnchor="middle">Wk 6</text>
                </svg>
              </div>
            )}

          </div>

          {/* Side: Mood dispersion stats mapping */}
          <div className="space-y-4" id="analytics-mood-map">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-widest border-b border-indigo-950 pb-2 block">Mood Dispersion logs</span>
            
            {journals.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-6">Write down daily journals to trigger mood analyses.</p>
            ) : (
              <div className="space-y-3">
                {[
                  { name: "Amazing 😀", id: "amazing", count: journalMoodCounts["amazing"] || 0, color: "bg-emerald-500" },
                  { name: "Good 🙂", id: "good", count: journalMoodCounts["good"] || 0, color: "bg-indigo-500" },
                  { name: "Average 😐", id: "average", count: journalMoodCounts["average"] || 0, color: "bg-slate-500" },
                  { name: "Bad 😔", id: "bad", count: journalMoodCounts["bad"] || 0, color: "bg-amber-500" },
                  { name: "Terrible 😢", id: "terrible", count: journalMoodCounts["terrible"] || 0, color: "bg-rose-500" }
                ].map((m) => {
                  const pct = journals.length > 0 ? Math.round((m.count / journals.length) * 100) : 0;
                  return (
                    <div key={m.id} className="space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>{m.name}</span>
                        <span>{m.count} logs ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div className={`h-full ${m.color} rounded-full`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
