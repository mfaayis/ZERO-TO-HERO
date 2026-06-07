/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Award, Flame, CheckCircle2, Shield, Calendar, BookOpen, Coffee, Skull, Gift } from "lucide-react";
import { UserProfile, Challenge } from "../types";

interface ChallengesProps {
  profile: UserProfile;
  challenges: Challenge[];
  onJoinChallenge: (id: string) => void;
  onIncrementChallenge: (id: string) => void;
}

export default function Challenges({
  profile,
  challenges,
  onJoinChallenge,
  onIncrementChallenge
}: ChallengesProps) {
  const [filter, setFilter] = useState<"all" | "active" | "community">("all");

  const badgeTemplates = [
    { id: "first-task", name: "First Victory", desc: "Completed your first daily priority task", icon: "🎯", rarity: "Common" },
    { id: "7-day-streak", name: "Iron Will", desc: "Achieved a solid 7-Day streak multiplier", icon: "🔥", rarity: "Rare" },
    { id: "30-day-streak", name: "Monk Discipline", desc: "Stuck with habits for 30 consecutive days", icon: "🧘", rarity: "Epic" },
    { id: "100-day-streak", name: "Titan Focus", desc: "Secured a flawless 100 days streak", icon: "👑", rarity: "Legendary" },
    { id: "first-goal", name: "Vision Manifest", desc: "Completed your first long-term objective", icon: "🏆", rarity: "Epic" },
    { id: "weight-achieved", name: "Lean Machine", desc: "Completed the target weight routine", icon: "⚡", rarity: "Rare" },
    { id: "book-finished", name: "Brain Buff", desc: "Finished reading a self-development book", icon: "📚", rarity: "Common" },
    { id: "saved-money", name: "Wealth Alchemist", desc: "Saved more than ₹10,000 threshold", icon: "💰", rarity: "Epic" }
  ];

  return (
    <div className="space-y-10 text-left" id="challenges-tab-root">
      
      {/* Tab Header */}
      <div className="border-b border-slate-900 pb-5">
        <h2 className="text-3xl font-extrabold text-white font-display">Discipline Quests & Badges</h2>
        <p className="text-sm text-slate-400 mt-1">Enroll in elite lifestyle challenges and unlock glorious trophies representing your milestones.</p>
      </div>

      {/* Main Grid: Left challenges, Right Achievements showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Challenges Shelf */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-850 pb-3">
            <h3 className="text-xl font-bold font-display text-white">Operational Challenges</h3>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 font-mono rounded-lg transition-all cursor-pointer ${filter === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-3 py-1.5 font-mono rounded-lg transition-all cursor-pointer ${filter === "active" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"}`}
              >
                Joined ({challenges.filter(c => c.joined).length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges
              .filter(c => filter === "all" || (filter === "active" && c.joined))
              .map((challenge) => {
                const isMax = challenge.progressDays >= challenge.durationDays;
                const percentage = Math.round((challenge.progressDays / challenge.durationDays) * 100);
                
                return (
                  <div 
                    key={challenge.id} 
                    className={`bg-slate-900 border rounded-2xl p-6 hover:border-slate-700 transition flex flex-col justify-between ${challenge.joined ? "border-indigo-500/40" : "border-slate-800"}`}
                    id={`challenge-card-${challenge.id}`}
                  >
                    <div>
                      <div className="flex items-start justify-between border-b border-indigo-950/40 pb-3 mb-4">
                        <div>
                          <h4 className="font-extrabold text-white text-base font-display">{challenge.title}</h4>
                          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest">{challenge.durationDays} Days Duration</span>
                        </div>
                        <span className="text-xl">
                          {challenge.id === "discipline" && "🥋"}
                          {challenge.id === "nosugar" && "🍩"}
                          {challenge.id === "books" && "📚"}
                          {challenge.id === "morning" && "🌅"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                        {challenge.description}
                      </p>
                    </div>

                    {challenge.joined ? (
                      /* If active enrolled status */
                      <div className="space-y-4 border-t border-slate-900 pt-4" id={`joined-widget-${challenge.id}`}>
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-slate-400">Progression Vector</span>
                          <span className="text-emerald-400 font-bold">{challenge.progressDays} / {challenge.durationDays} Days ({percentage}%)</span>
                        </div>
                        
                        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => onIncrementChallenge(challenge.id)}
                            disabled={isMax}
                            className={`flex-1 py-2 text-xs font-bold font-mono rounded-xl transition ${isMax ? "bg-slate-950 border border-slate-900 text-slate-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"}`}
                          >
                            {isMax ? "★ Completed" : "+ Log Active Day"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Join prompt */
                      <button
                        onClick={() => onJoinChallenge(challenge.id)}
                        id={`btn-join-${challenge.id}`}
                        className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl font-mono text-xs font-semibold transition cursor-pointer"
                      >
                        Enroll in Challenge
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right 1 Col: Badges & Achievements cabinets */}
        <div className="space-y-6">
          <div className="border-b border-slate-850 pb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xl font-bold font-display text-white">Achievements Cabin</h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="text-center pb-4 border-b border-indigo-950 flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Trophy count:</span>
              <span className="text-amber-400 font-extrabold">{profile.unlockedBadges.length} / {badgeTemplates.length} UNLOCKED</span>
            </div>

            <div className="grid grid-cols-2 gap-3" id="badges-grid">
              {badgeTemplates.map((badge) => {
                const isUnlocked = profile.unlockedBadges.includes(badge.id);
                
                return (
                  <div 
                    key={badge.id}
                    title={`${badge.name}: ${badge.desc}`}
                    className={`p-3 border rounded-xl text-center flex flex-col items-center justify-between transition-all relative ${isUnlocked ? "bg-slate-950 border-amber-500/30 text-white shadow-lg" : "bg-slate-950/40 border-slate-900 text-slate-600 opacity-40 select-none"}`}
                    id={`badge-cell-${badge.id}`}
                  >
                    <div className="text-3.5xl mb-2">{badge.icon}</div>
                    
                    <div>
                      <h5 className="font-bold text-xs truncate max-w-[100px] leading-tight font-display">{badge.name}</h5>
                      <span className={`text-[8px] font-mono uppercase tracking-wider block mt-1 font-bold ${badge.rarity === "Legendary" ? "text-purple-400" : badge.rarity === "Epic" ? "text-pink-400" : badge.rarity === "Rare" ? "text-indigo-400" : "text-slate-500"}`}>
                        {badge.rarity}
                      </span>
                    </div>

                    {isUnlocked && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-slate-950"></span>
                    )}
                  </div>
                );
              })}
            </div>
            
            <p className="text-[10px] text-slate-500 tracking-normal text-center pt-2 font-mono leading-relaxed">
              ★ Trophies automatically link to your dashboard when criteria (streak thresholds, completed goals) are locked in.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
