/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Users, AlertOctagon, Send, Plus, BarChart, Database, Cpu, Check, Trash } from "lucide-react";
import { SocialPost, Challenge } from "../types";

interface AdminProps {
  posts: SocialPost[];
  challenges: Challenge[];
  onAddAdminChallenge: (title: string, desc: string, days: number) => void;
  onSendAnnouncementAll: (title: string, msg: string) => void;
  onAdminDeletePost: (id: string) => void;
  onSetPremiumOverride: (val: boolean) => void;
  isPremium: boolean;
}

export default function Admin({
  posts,
  challenges,
  onAddAdminChallenge,
  onSendAnnouncementAll,
  onAdminDeletePost,
  onSetPremiumOverride,
  isPremium
}: AdminProps) {
  const [annTitle, setAnnTitle] = useState("");
  const [annMsg, setAnnMsg] = useState("");
  const [challTitle, setChallTitle] = useState("");
  const [challDesc, setChallDesc] = useState("");
  const [challDays, setChallDays] = useState(30);

  const [notifSuccess, setNotifSuccess] = useState("");

  const triggerAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMsg.trim()) return;
    
    onSendAnnouncementAll(annTitle, annMsg);
    setAnnTitle("");
    setAnnMsg("");
    showNotif("System Broadcast Alert dispatched to all connected clients!");
  };

  const triggerAddChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challTitle.trim()) return;

    onAddAdminChallenge(challTitle, challDesc, challDays);
    setChallTitle("");
    setChallDesc("");
    setChallDays(30);
    showNotif(`Success: '${challTitle}' custom challenge generated!`);
  };

  const showNotif = (msg: string) => {
    setNotifSuccess(msg);
    setTimeout(() => {
      setNotifSuccess("");
    }, 3000);
  };

  return (
    <div className="space-y-8 text-left" id="admin-tab-root">
      
      {/* Title block */}
      <div className="border-b border-rose-900 pb-5">
        <h2 className="text-3xl font-extrabold text-white font-display flex items-center gap-2">
          <Shield className="w-8 h-8 text-rose-500" /> Admin Command Matrix
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Backdoor diagnostics hub for server orchestrations, feed moderation, and simulation protocols.
        </p>
      </div>

      {notifSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl text-center font-mono">
          {notifSuccess}
        </div>
      )}

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Broadcasting and overrides */}
        <div className="space-y-6">
          
          {/* Send Broadcast Announcement */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="boardcast-box">
            <h3 className="font-bold text-base text-white font-display inline-flex items-center gap-1.5 border-b border-indigo-950 pb-2 w-full">
              <Send className="w-4 h-4 text-indigo-400" /> Broadcast Global Announcement
            </h3>
            <p className="text-[11px] text-slate-400 mb-2">Sends a high-priority system-wide notification to your student inbox log instantly.</p>
            
            <form onSubmit={triggerAnnouncement} className="space-y-3">
              <input
                type="text"
                placeholder="Announcement Title"
                required
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                id="admin-ann-title"
              />
              <textarea
                placeholder="Alert text message..."
                required
                value={annMsg}
                onChange={(e) => setAnnMsg(e.target.value)}
                className="w-full min-h-[60px] bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                id="admin-ann-msg"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold rounded-lg cursor-pointer"
              >
                Dispatch Announcement
              </button>
            </form>
          </div>

          {/* Create custom Challenges */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="add-challenges-admin">
            <h3 className="font-bold text-base text-white font-display inline-flex items-center gap-1.5 border-b border-indigo-950 pb-2 w-full">
              <Plus className="w-4 h-4 text-emerald-400" /> Manage Challenges & Quests
            </h3>
            
            <form onSubmit={triggerAddChallenge} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Challenge Name"
                  required
                  value={challTitle}
                  onChange={(e) => setChallTitle(e.target.value)}
                  className="col-span-2 bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                  id="admin-chall-title"
                />
                <input
                  type="number"
                  placeholder="Days"
                  required
                  value={challDays}
                  onChange={(e) => setChallDays(Number(e.target.value))}
                  className="bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
                />
              </div>
              <input
                type="text"
                placeholder="Brief guidelines / criteria details..."
                value={challDesc}
                onChange={(e) => setChallDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-white p-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-lg cursor-pointer"
              >
                Publish New Challenge
              </button>
            </form>
          </div>

        </div>

        {/* Right Col: Feed Moderation & Subsystem Stats */}
        <div className="space-y-6">
          
          {/* Social Moderation panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="mod-posts-box">
            <h3 className="font-bold text-base text-white font-display inline-flex items-center gap-1.5 border-b border-rose-950 pb-2 w-full">
              <AlertOctagon className="w-4 h-4 text-rose-400" /> Community Content Moderation
            </h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              Admin audit logs: Flag or permanently delete toxic or irrelevant student social feed posts.
            </p>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {posts.map((post) => (
                <div key={post.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between items-center gap-4">
                  <div className="truncate">
                    <span className="font-bold text-slate-300 font-mono">{post.author}:</span>
                    <span className="text-slate-400 italic ml-1 truncate block">{post.content}</span>
                  </div>
                  <button
                    onClick={() => onAdminDeletePost(post.id)}
                    className="p-1 px-2.5 bg-rose-950 border border-rose-900 text-[10px] rounded hover:bg-rose-900 text-rose-300 font-mono transition inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Trash className="w-3 h-3" /> Purge
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Override parameters diagnostic */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="overrides-box">
            <h3 className="font-bold text-base text-white font-display inline-flex items-center gap-1.5 border-b border-indigo-950 pb-2 w-full">
              <Database className="w-4 h-4 text-cyan-400" /> Database & Character Backdoors
            </h3>
            
            <div className="flex justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-xl text-xs">
              <div>
                <span className="font-bold text-slate-300 font-mono uppercase block">Premium Tier Status</span>
                <span className="text-slate-500 block mt-0.5">Force unlock Premium features across all tabs.</span>
              </div>
              <button
                type="button"
                onClick={() => onSetPremiumOverride(!isPremium)}
                className={`px-4 py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${isPremium ? "bg-emerald-600 text-white" : "bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700"}`}
              >
                {isPremium ? "Premium Active" : "Force Activate"}
              </button>
            </div>

            {/* Server Specifications logs */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-[10px] space-y-1 font-mono text-slate-400 leading-relaxed">
              <span className="font-bold text-indigo-400 block mb-1">SYSTEM INSTANTIATION PARAMETERS:</span>
              <p>&bull; Container Environment: Cloud Run Sandbox Client</p>
              <p>&bull; Express Native Ingress: Host 0.0.0.0, Port 3000</p>
              <p>&bull; Database Standard: Simple JSON memory with LocalStorage mirror</p>
              <p>&bull; AI Grounding Anchor: @google/genai module</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
