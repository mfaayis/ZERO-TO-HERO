/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Menu, X, Sparkles, LogOut, ShieldAlert,
  Trophy, Zap, Bell, Compass, ArrowUpRight, 
  Heart, Shield, Wallet, Briefcase, BookOpen, Smile, User, ChevronRight, CheckSquare
} from "lucide-react";
import { UserProfile } from "../types";

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onLogout: () => void;
}

export default function Navigation({
  activeTab,
  onSelectTab,
  profile,
  onLogout
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard Dashboard", icon: <User className="w-4 h-4" /> },
    { id: "checklist", label: "Daily Checklist", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "habits", label: "Habits Tracker", icon: <Zap className="w-4 h-4" /> },
    { id: "goals", label: "Goal Decontructor", icon: <Shield className="w-4 h-4" /> },
    { id: "coach", label: "Gemini AI Coach", icon: <Sparkles className="w-4 h-4" /> },
    { id: "journal", label: "Reflections & Mood", icon: <Smile className="w-4 h-4" /> },
    { id: "analytics", label: "Progress Analytics", icon: <BookOpen className="w-4 h-4" /> },
    { id: "challenges", label: "Discipline Challenges", icon: <Trophy className="w-4 h-4" /> },
    { id: "community", label: "Peer Feed", icon: <Compass className="w-4 h-4" /> },
    { id: "admin", label: "Admin Console", icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  const handleTabChange = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-left" id="master-top-nav">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Brand Area */}
          <div className="flex items-center gap-3">
            <span 
              onClick={() => handleTabChange("dashboard")}
              className="text-xl font-bold font-display bg-gradient-to-r from-indigo-500 to-violet-400 bg-clip-text text-transparent cursor-pointer select-none tracking-tight"
            >
              Zero to Hero
            </span>
            {profile.isPremium && (
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> PREMIUM ELITE
              </span>
            )}
          </div>

          {/* Desktop Right items */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400">
            {menuItems.map((item) => {
              const isAct = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  id={`nav-link-${item.id}`}
                  className={`px-3 py-2 rounded-lg font-semibold font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer select-none ${isAct ? "bg-indigo-650/15 text-indigo-400 border border-indigo-500/20" : "hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"}`}
                >
                  {item.icon}
                  <span>{item.label.split(" ")[0]}</span>
                </button>
              );
            })}
            
            <div className="h-4 w-[1px] bg-slate-800 mx-3"></div>
            
            <button
              onClick={onLogout}
              className="p-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-lg text-slate-400 font-mono text-[10px] uppercase transition cursor-pointer select-none"
              id="nav-logout-btn"
            >
              Logout
            </button>
          </div>

          {/* Hamburger Menu trigger */}
          <div className="xl:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
              id="mobile-nav-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Collapse Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-4 space-y-2 text-left shadow-2xl relative z-50 animate-fadeIn" id="mobile-drawer-shell">
          <div className="pb-3 mb-2 border-b border-slate-900 flex justify-between items-center text-xs font-mono">
            <span className="text-slate-500">Navigation Matrix</span>
            <span className="text-amber-400">Lvl {profile.level} Champion</span>
          </div>

          {menuItems.map((item) => {
            const isAct = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 cursor-pointer ${isAct ? "bg-indigo-650/15 text-indigo-400 border border-indigo-500/20" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-900 flex justify-end">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-slate-900 text-rose-400 border border-slate-800 rounded-xl text-xs font-mono inline-flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Terminate Session
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
