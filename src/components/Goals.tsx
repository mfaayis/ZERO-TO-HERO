/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Target, Calendar, Plus, Trash2, CheckCircle2, Award, ChevronRight, X, AlertCircle } from "lucide-react";
import { Goal, Milestone } from "../types";

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (title: string, description: string, deadline: string, category: string, milestones: string[]) => void;
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function Goals({
  goals,
  onAddGoal,
  onToggleMilestone,
  onDeleteGoal
}: GoalsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("career");
  
  // Manage new milestone rows during adding
  const [newMilestoneText, setNewMilestoneText] = useState("");
  const [milestoneList, setMilestoneList] = useState<string[]>([]);

  const handleAddMilestone = () => {
    if (!newMilestoneText.trim()) return;
    setMilestoneList([...milestoneList, newMilestoneText.trim()]);
    setNewMilestoneText("");
  };

  const handleRemoveMilestoneRow = (idx: number) => {
    setMilestoneList(milestoneList.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;
    
    // Add default milestones if empty
    const finalMilestones = milestoneList.length > 0 
      ? milestoneList 
      : ["Define project specifications", "Achieve 50% target", "Run comprehensive checks"];
      
    onAddGoal(title, description, deadline, category, finalMilestones);
    
    // Reset form fields
    setTitle("");
    setDescription("");
    setDeadline("");
    setCategory("career");
    setMilestoneList([]);
    setShowAddForm(false);
  };

  // Preset generators to speed up onboarding
  const loadPreset = (presetName: string) => {
    setCategory("career");
    if (presetName === "code") {
      setTitle("Learn Computer Programming");
      setDescription("Master web engineering, build three full-scale applications, and land a developer gig.");
      setDeadline("2026-12-31");
      setMilestoneList([
        "Complete foundational TypeScript documentation rules",
        "Build a local Express + Vite server database proxy",
        "Publish responsive AI-assisted portfolio website",
        "Submit five distinct open-source GitHub requests"
      ]);
    } else if (presetName === "money") {
      setTitle("Become Financially Independent");
      setDescription("Construct passive indexes, regulate dynamic monthly luxury spending, and track portfolio values.");
      setDeadline("2027-06-01");
      setCategory("finance");
      setMilestoneList([
        "Curb outside eating expenditures to once per week",
        "Set up an automated monthly savings transfer of ₹10,000",
        "Examine three blue-chip ETF mutual investment guides",
        "Secure six months of emergency income in high-yield vaults"
      ]);
    } else if (presetName === "health") {
      setTitle("Achieve Target Lean Weight");
      setDescription("Adopt routine cardiac runs, restrict processing carbohydrates, and trace lean tissue parameters.");
      setDeadline("2026-09-30");
      setCategory("health");
      setMilestoneList([
        "Commit to three structured gym workouts per week",
        "Measure daily water consumption levels above 3 Liters",
        "Restrict standard sugar inputs for thirty consecutive days",
        "Perform medical body metabolism indices analysis"
      ]);
    }
  };

  return (
    <div className="space-y-8 text-left" id="goals-tab-root">
      
      {/* Target headers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display">Goal Management Quadrant</h2>
          <p className="text-sm text-slate-400 mt-1">Conquer grand visions by slicing them into accountable micro milestones.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-mono font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          id="btn-open-create-goal"
        >
          <Plus className="w-4 h-4" /> Instantiate New Goal
        </button>
      </div>

      {/* Creation dashboard form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4" id="add-goal-form">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h4 className="font-bold text-white font-display text-base">Deconstruct Life Objectives</h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Quick presets shortcut buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Apply Preset blueprints</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => loadPreset("code")}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs hover:border-slate-700 transition"
              >
                💻 Learn Programming
              </button>
              <button
                type="button"
                onClick={() => loadPreset("money")}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs hover:border-slate-700 transition"
              >
                💵 Financial Independence
              </button>
              <button
                type="button"
                onClick={() => loadPreset("health")}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded-lg text-xs hover:border-slate-700 transition"
              >
                🏃 Muscle & Health
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Goal Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master React Core Engine"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                id="input-goal-title"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Focus Area</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none cursor-pointer"
                id="select-goal-category"
              >
                <option value="career">Career & Placement</option>
                <option value="finance">Finance & Accumulations</option>
                <option value="health">Health & Strength</option>
                <option value="learning">Skill Acquisition</option>
                <option value="mindset">Mindset Alignment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Target Deadline Date</label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-805 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none cursor-pointer"
                id="input-goal-deadline"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Brief Concept Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe why this goal is central to your hero arc"
                className="w-full bg-slate-950 border border-slate-805 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                id="input-goal-desc"
              />
            </div>
          </div>

          {/* Core Milestones Builder Panel */}
          <div className="space-y-2 pt-2">
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Milestone Breakdown Checklist</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Set up database triggers"
                value={newMilestoneText}
                onChange={(e) => setNewMilestoneText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-805 focus:border-indigo-500 text-white rounded-xl px-4 py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddMilestone}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-indigo-400 font-bold rounded-xl text-xs font-mono cursor-pointer"
              >
                + Add Milestone
              </button>
            </div>

            {milestoneList.length > 0 && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-805 space-y-2">
                {milestoneList.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg text-xs">
                    <span className="text-slate-300 font-sans">{m}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestoneRow(idx)}
                      className="text-rose-400 hover:underline font-mono text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-mono cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs font-mono cursor-pointer"
              id="sub-add-goal-btn"
            >
              Instantiate Goal
            </button>
          </div>
        </form>
      )}

      {/* List display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="goals-shelf-container">
        {goals.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/25 border border-slate-800 rounded-2xl col-span-2">
            <Target className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-400 font-display">No target profiles locked in</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Select one of the quick presets or click the add button to map your first structural milestone goals!
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const milestoneRate = goal.milestones.length > 0 
              ? Math.round((goal.milestones.filter(m => m.completed).length / goal.milestones.length) * 100)
              : 0;
            return (
              <div 
                key={goal.id} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all text-left flex flex-col justify-between"
                id={`goal-item-card-${goal.id}`}
              >
                <div>
                  <div className="flex items-start justify-between border-b border-indigo-950/40 pb-3.5 mb-4">
                    <div>
                      <h4 className="font-extrabold text-white text-lg font-display leading-tight">{goal.title}</h4>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed font-sans">{goal.description}</p>
                    </div>
                    
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 px-2 border border-slate-800 hover:bg-rose-950 rounded text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-4 bg-slate-950/40 p-2 border border-slate-800 rounded-lg">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-indigo-400" /> Deadline: {goal.deadline}</span>
                    <span className="text-amber-400 text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      +{goal.xpReward} XP Reward
                    </span>
                  </div>

                  {/* Milestones grid list */}
                  <div className="space-y-2 mb-6">
                    <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Operational Milestones</span>
                    {goal.milestones.map((ms) => (
                      <div 
                        key={ms.id}
                        onClick={() => onToggleMilestone(goal.id, ms.id)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2.5 transition-colors cursor-pointer ${ms.completed ? "bg-slate-950/40 border-slate-900 text-slate-400" : "bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700"}`}
                        id={`milestone-container-${goal.id}-${ms.id}`}
                      >
                        <div className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition ${ms.completed ? "bg-emerald-500/15 border-emerald-500" : "border-slate-700"}`}>
                          {ms.completed && <div className="w-2 h-2 bg-emerald-400 rounded-sm" />}
                        </div>
                        <span className={`font-sans leading-tight ${ms.completed ? "line-through opacity-60" : ""}`}>{ms.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress bar footer */}
                <div className="border-t border-slate-900 pt-4">
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-400">
                    <span>Overall Vector Done</span>
                    <span className={`font-bold ${milestoneRate === 100 ? "text-emerald-400" : "text-indigo-400"}`}>{milestoneRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-350 ${milestoneRate === 100 ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/10" : "bg-indigo-600"}`} 
                      style={{ width: `${milestoneRate}%` }}
                    ></div>
                  </div>
                  {milestoneRate === 100 && (
                    <div className="flex items-center gap-1.5 mt-3 text-emerald-400 text-xs font-mono justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Objective Cleansed! +{goal.xpReward} XP Points Banked!</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
