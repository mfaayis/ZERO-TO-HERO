/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Trophy, Zap, Bell, Sparkles, Compass, ArrowUpRight, 
  Heart, Shield, Wallet, Briefcase, BookOpen, Smile, User, ChevronRight, CheckCircle2
} from "lucide-react";
import { UserProfile, Task, AppNotification } from "../types";

interface DashboardProps {
  profile: UserProfile;
  tasks: Task[];
  notifications: AppNotification[];
  aiRecommendations: string[];
  generatingRecommendations: boolean;
  onRefreshRecommendations: () => void;
  onToggleTask: (id: string) => void;
  onNavigateToTab: (tab: string) => void;
  onClearNotifications: () => void;
  onBuyPremiumUpgrade: () => void;
}

export default function Dashboard({
  profile,
  tasks,
  notifications,
  aiRecommendations,
  generatingRecommendations,
  onRefreshRecommendations,
  onToggleTask,
  onNavigateToTab,
  onClearNotifications,
  onBuyPremiumUpgrade
}: DashboardProps) {
  const [showNotificationDrop, setShowNotificationDrop] = useState(false);

  // Overall status calculation
  const overallScore = Math.round(
    (profile.lifeScores.health +
      profile.lifeScores.discipline +
      profile.lifeScores.finance +
      profile.lifeScores.career +
      profile.lifeScores.learning +
      profile.lifeScores.relationships +
      profile.lifeScores.mindset) /
      7
  );

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasksCount = tasks.length;
  const completionPercentage = totalTasksCount > 0 
    ? Math.round((completedTasks.length / totalTasksCount) * 100) 
    : 0;

  // Level classification helpers
  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1: return "Beginner Challenger";
      case 2: return "Level 2 Explorer";
      case 3: return "Level 3 Disciplined";
      case 4: return "Level 4 Warrior";
      case 5: return "Level 5 Champion";
      case 6: return "Level 6 Hero";
      default: return "Ascended Master";
    }
  };

  const areaIcons: Record<string, { icon: React.ReactNode, bg: string, text: string }> = {
    health: { icon: <Heart className="w-4 h-4" />, bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400" },
    discipline: { icon: <Shield className="w-4 h-4" />, bg: "bg-indigo-500/10 border-indigo-500/30", text: "text-indigo-400" },
    finance: { icon: <Wallet className="w-4 h-4" />, bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400" },
    career: { icon: <Briefcase className="w-4 h-4" />, bg: "bg-sky-500/10 border-sky-500/30", text: "text-sky-400" },
    learning: { icon: <BookOpen className="w-4 h-4" />, bg: "bg-cyan-500/10 border-cyan-500/30", text: "text-cyan-400" },
    relationships: { icon: <Smile className="w-4 h-4" />, bg: "bg-pink-500/10 border-pink-500/30", text: "text-pink-400" },
    mindset: { icon: <Sparkles className="w-4 h-4" />, bg: "bg-violet-500/10 border-violet-500/30", text: "text-violet-400" },
  };

  const uppercaseFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="relative space-y-8" id="dashboard-tab-root">
      
      {/* Top Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6" id="dash-top-panel">
        <div className="text-left">
          <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" /> HERO PROFILE ACTIVE
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight mt-1" id="welcome-message">
            Welcome Back, {profile.name}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Maintain your physical streak and complete tasks to maximize your daily XP earnings.
          </p>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDrop(!showNotificationDrop)}
              id="dash-bell"
              className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl transition-all relative cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border border-slate-900 animate-ping"></span>
              )}
            </button>

            {/* Notification Dropdown Drawer */}
            {showNotificationDrop && (
              <div 
                id="noti-drawer"
                className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 text-left"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h4 className="font-mono text-xs text-slate-300 uppercase tracking-wider font-bold">System Alerts</h4>
                  <button
                    onClick={() => { onClearNotifications(); setShowNotificationDrop(false); }}
                    className="text-[10px] text-indigo-400 hover:underline font-mono cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 italic text-center py-4">No active system events.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                        <div className="font-semibold text-slate-200 flex items-center gap-1.5 justify-between">
                          <span className={`${n.type === "ai" ? "text-indigo-400" : n.type === "success" ? "text-emerald-400" : "text-amber-400"}`}>
                            {n.title}
                          </span>
                          {!n.read && <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>}
                        </div>
                        <p className="text-slate-400 mt-1 font-sans">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Core Level classification Badge */}
          <div className="flex items-center gap-2 bg-indigo-950/40 border border-indigo-500/20 px-4 py-2.5 rounded-xl">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-indigo-300 uppercase tracking-widest">{getLevelLabel(profile.level)}</span>
          </div>
        </div>
      </div>

      {/* Gamification Level & XP Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="xp-panel">
        <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-slate-500 tracking-wider">GAME ENGINE CORE v2.5</div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
          <div className="text-left md:col-span-1">
            <span className="text-sm font-mono text-indigo-400 uppercase tracking-widest">Character Level</span>
            <div className="text-5xl font-extrabold text-white mt-1 font-display flex items-baseline gap-2">
              Lvl {profile.level}
              <span className="text-xs text-amber-400 font-mono font-bold uppercase tracking-wider">{getLevelLabel(profile.level).split(" ")[0]}</span>
            </div>
          </div>

          <div className="md:col-span-2 text-left">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span className="text-slate-400 uppercase tracking-wide">Experience Points (XP)</span>
              <span className="text-white font-bold">{profile.xp} / {profile.xpToNextLevel} XP</span>
            </div>
            
            {/* Animated XP progress bar */}
            <div className="w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((profile.xp / profile.xpToNextLevel) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              ★ Standard Level UP rewards: +10 Life score index buffer, unlocked master challenges.
            </p>
          </div>

          <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-left">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wide">Daily multiplier streak</span>
            <div className="text-3xl font-extrabold text-amber-400 mt-1 font-mono flex items-center gap-1.5">
              <Zap className="w-6 h-6 fill-amber-400" />
              {profile.streak} Days
            </div>
            <span className="text-[10px] text-slate-500 font-sans block mt-1">Completed habits maintain the multiplier.</span>
          </div>
        </div>
      </div>

      {/* Main Core Bento Layout Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Life Area Radar / Bento Scores */}
        <div className="lg:col-span-2 space-y-8 text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="bento-life-scores">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Active Life Score Index</h3>
                <p className="text-xs text-slate-400 mt-1">Calculated evaluation across core focus quadrants.</p>
              </div>
              <div className="bg-slate-950 px-4 py-2 border border-slate-800 rounded-xl text-center">
                <span className="text-xs font-mono text-slate-500 block uppercase tracking-wider">Overall score</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono">{overallScore}<span className="text-xs text-slate-400">/100</span></span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(profile.lifeScores).map(([key, value]) => {
                const spec = areaIcons[key] || areaIcons["discipline"];
                return (
                  <div key={key} className={`p-4 border rounded-xl text-left bg-slate-950/40 relative group overflow-hidden ${spec.bg}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`p-1.5 bg-slate-900 rounded-lg ${spec.text}`}>
                        {spec.icon}
                      </span>
                      <span className="text-lg font-extrabold font-mono text-white">{value}%</span>
                    </div>
                    <h5 className="font-bold text-sm text-slate-300 font-display">{uppercaseFirst(key)}</h5>
                    {/* Tiny micro bar */}
                    <div className="w-full h-1 bg-slate-900 rounded mt-3 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${value}%` }}></div>
                    </div>
                  </div>
                );
              })}
              
              {/* Premium Lock Upgrade card */}
              {!profile.isPremium && (
                <div 
                  onClick={onBuyPremiumUpgrade}
                  className="p-4 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 to-slate-950 rounded-xl text-left flex flex-col justify-between group overflow-hidden cursor-pointer hover:border-indigo-400 transition-all col-span-2 sm:col-span-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-1 px-2.5 bg-indigo-500/10 rounded-md text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold">Unlocking Premium</span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-3">
                    Unlock advanced bento analytics metrics and double your daily tasks XP multiplier!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Today's Mission checklist overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="dashboard-checklist-sub">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-white">Daily Priorities</h3>
                <p className="text-xs text-slate-400 mt-1">Level up your overall discipline score by completing today's checklist.</p>
              </div>
              <button 
                onClick={() => onNavigateToTab("checklist")}
                className="text-xs text-indigo-400 hover:underline font-mono flex items-center gap-1 cursor-pointer"
              >
                Go to Checklist <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {totalTasksCount === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-10 h-10 text-slate-705 mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-sans italic">Your daily checklist is empty.</p>
                <button
                  onClick={() => onNavigateToTab("checklist")}
                  className="mt-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-lg font-mono cursor-pointer"
                >
                  Create Custom Tasks
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Today's Progress</span>
                  <span className="text-emerald-400 font-bold">{completionPercentage}% Completed ({completedTasks.length}/{totalTasksCount})</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
                </div>

                <div className="pt-2 space-y-2">
                  {pendingTasks.slice(0, 3).map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => onToggleTask(task.id)}
                      className="flex items-center gap-3 bg-slate-950/40 border border-slate-800 p-3 rounded-xl hover:bg-slate-950 hover:border-slate-700 transition-all cursor-pointer text-sm"
                    >
                      <div className="w-4.5 h-4.5 border border-slate-600 rounded mr-0.5" id={`dash-checkbox-${task.id}`}></div>
                      <span className="text-slate-200 mt-0.5">{task.title}</span>
                      <span className="ml-auto text-[10px] font-mono text-indigo-400 bg-indigo-950/30 border border-indigo-900/30 px-2 py-0.5 rounded-full">
                        +{task.xpReward} XP
                      </span>
                    </div>
                  ))}
                  
                  {pendingTasks.length > 3 && (
                    <p className="text-xs text-slate-500 text-center italic mt-2">
                      + And {pendingTasks.length - 3} other active missions listed in your daily checklist.
                    </p>
                  )}

                  {pendingTasks.length === 0 && (
                    <div className="p-4 bg-emerald-950/10 border border-emerald-900/20 rounded-xl text-center">
                      <span className="text-emerald-400 text-xs font-semibold">★ Golden Multiplier Unlocked! You've completed all missions for today.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Gemini AI Advisor recommendations banner */}
        <div className="space-y-8 text-left">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="dash-coach-panel">
            {/* Ambient indicator */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-[40px] pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white font-display">AI Coach Directives</h3>
              </div>
              <button
                onClick={onRefreshRecommendations}
                disabled={generatingRecommendations}
                className="p-1 px-2.5 text-[10px] font-mono hover:bg-slate-850 rounded-lg text-indigo-400 inline-flex items-center gap-1 cursor-pointer hover:underline"
              >
                {generatingRecommendations ? "Analyzing..." : "Re-Sync"}
              </button>
            </div>

            <div className="space-y-4">
              {generatingRecommendations ? (
                <div id="recom-loading" className="py-12 text-center space-y-3">
                  <div className="w-6 h-6 border-2 border-indigo-505 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-400 font-mono italic">Syncing live dashboard parameters with Gemini Life Protocol...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {aiRecommendations.map((rec, id) => (
                      <div key={id} className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl relative overflow-hidden text-xs text-slate-300 leading-relaxed font-sans">
                        {rec}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-950/20 rounded-xl border border-slate-800">
                    <p className="text-[11px] text-slate-400 block mb-2 leading-relaxed">
                      Need custom schedules, dedicated study grids, workout planners, or mental block evaluations? Open the counselor:
                    </p>
                    <button
                      onClick={() => onNavigateToTab("coach")}
                      id="dash-btn-chat-coach"
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs text-white rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Engage AI Counselor</span>
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Access panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="dashboard-shortcuts-box">
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-widest border-b border-indigo-950/30 pb-2 mb-4">Quick Navigation Paths</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={() => onNavigateToTab("habits")}
                className="p-3 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-left font-serif text-slate-300 hover:text-white transition-all cursor-pointer font-sans"
              >
                ★ Habits Tracker
              </button>
              <button
                onClick={() => onNavigateToTab("goals")}
                className="p-3 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-left font-serif text-slate-300 hover:text-white transition-all cursor-pointer font-sans"
              >
                ★ Goals Deconstructor
              </button>
              <button
                onClick={() => onNavigateToTab("journal")}
                className="p-3 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-left font-serif text-slate-300 hover:text-white transition-all cursor-pointer font-sans"
              >
                ★ Daily Journal
              </button>
              <button
                onClick={() => onNavigateToTab("analytics")}
                className="p-3 bg-slate-950/40 hover:bg-slate-900/60 border border-slate-800 rounded-xl text-left font-serif text-slate-300 hover:text-white transition-all cursor-pointer font-sans"
              >
                ★ Graph Analytics
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
