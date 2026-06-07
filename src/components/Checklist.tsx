/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Trash2, Edit2, RotateCcw, Flame, Check, Shield, Save, X } from "lucide-react";
import { Task } from "../types";

interface ChecklistProps {
  tasks: Task[];
  onAddTask: (title: string, category: string, isRecurring: boolean, customXP?: number) => void;
  onEditTask: (id: string, updatedTitle: string, updatedCategory: string, isRecurring: boolean) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onResetDailyChecklist: () => void;
}

export default function Checklist({
  tasks,
  onAddTask,
  onEditTask,
  onToggleTask,
  onDeleteTask,
  onResetDailyChecklist
}: ChecklistProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Task["category"]>("discipline");
  const [recurring, setRecurring] = useState(true);

  // States for editing a task
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<Task["category"]>("discipline");
  const [editRecurring, setEditRecurring] = useState(true);

  // Category classification styles
  const categoryStyles: Record<Task["category"], { text: string; bg: string; label: string }> = {
    health: { text: "text-emerald-400 border-emerald-500/20", bg: "bg-emerald-500/10", label: "Health & Workout" },
    discipline: { text: "text-indigo-400 border-indigo-500/20", bg: "bg-indigo-500/10", label: "Discipline & Habit" },
    finance: { text: "text-amber-400 border-amber-500/20", bg: "bg-amber-500/10", label: "Finance & Saving" },
    career: { text: "text-sky-400 border-sky-500/20", bg: "bg-sky-500/10", label: "Career & Tech" },
    learning: { text: "text-cyan-400 border-cyan-500/20", bg: "bg-cyan-500/10", label: "Skills & Reading" },
    relationships: { text: "text-pink-400 border-pink-500/20", bg: "bg-pink-500/10", label: "Social ties" },
    mindset: { text: "text-violet-400 border-violet-500/20", bg: "bg-violet-500/10", label: "Mindset & Zen" }
  };

  const getXPValue = (cat: string) => {
    switch (cat) {
      case "health": return 20; // Workout
      case "learning": return 10; // Reading or general books
      case "career": return 15; // Learning Programming/Tech
      case "mindset": return 10; // Meditation
      case "finance": return 10; // Saving money
      default: return 12;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title, category, recurring, getXPValue(category));
    setTitle("");
    setShowAddForm(false);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditRecurring(task.recurring);
  };

  const handleSaveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onEditTask(id, editTitle, editCategory, editRecurring);
    setEditingId(null);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressRatio = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-8 text-left" id="checklist-tab-root">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display">Daily Mission Board</h2>
          <p className="text-sm text-slate-400 mt-1">Check off tasks to gain XP. Recurring tasks refresh in the morning.</p>
        </div>
        
        <div className="flex gap-2 self-start sm:self-center">
          <button
            onClick={() => onResetDailyChecklist()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-750 text-slate-350 hover:text-white rounded-xl text-xs font-mono transition-all inline-flex items-center gap-1.5 cursor-pointer"
            id="btn-reset-checklist"
          >
            <RotateCcw className="w-4 h-4" /> Reset Completed Tasks
          </button>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-mono font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
            id="btn-open-create-task"
          >
            <Plus className="w-4 h-4" /> Add Custom Task
          </button>
        </div>
      </div>

      {/* Progress ticker panel matches 'Extra Features' requirement */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5" id="todays-progress-ticker">
        <div className="flex items-center justify-between font-mono text-sm mb-2.5">
          <span className="text-slate-300 font-bold uppercase tracking-wider">Today's Progression Vector</span>
          <span className="text-emerald-400 font-bold">Progress: {completedCount}/{totalCount} ({progressRatio}%)</span>
        </div>
        <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-300"
            style={{ width: `${progressRatio}%` }}
          ></div>
        </div>
      </div>

      {/* Adding Task Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4" id="add-task-form">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-2">
            <h4 className="font-bold text-white font-display text-base">New Operational Mission</h4>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white cursor-pointer select-none">
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Mission Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Read 15 pages of book"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                id="input-task-title"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider">Target Focus Metric Area</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Task["category"])}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none cursor-pointer"
                id="select-task-category"
              >
                <option value="discipline">Discipline (e.g. Wake up early)</option>
                <option value="health">Health & Fitness (e.g. Workout, Gym)</option>
                <option value="finance">Finance (e.g. Saving / Log expenses)</option>
                <option value="career">Career & Tech (e.g. Code coding hours)</option>
                <option value="learning">Skills & Reading (e.g. Study or Research)</option>
                <option value="relationships">Relationships (e.g. Call my parents)</option>
                <option value="mindset">Mindset (e.g. Meditate, Journal)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="task-recurring-toggle"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                className="w-4 h-4 bg-slate-950 border-slate-800 rounded accent-indigo-500 cursor-pointer"
              />
              <label htmlFor="task-recurring-toggle" className="text-xs text-slate-300 font-sans select-none cursor-pointer">
                Recurring Daily Task (Auto-resets daily)
              </label>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Computed Reward Factor: <span className="text-indigo-400 font-bold">+{getXPValue(category)} XP</span>
            </div>
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
              id="sub-add-task-btn"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs font-mono cursor-pointer"
            >
              Add to Board
            </button>
          </div>
        </form>
      )}

      {/* Task checklist entries board */}
      <div className="space-y-3" id="task-checklist-container">
        {tasks.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/20 border border-slate-800 rounded-2xl">
            <Shield className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-slate-400 font-display">No tasks scheduled</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Add some of your prime personal objectives. For speed, initialize standard tasks.
            </p>
          </div>
        ) : (
          tasks.map((task) => {
            const isEditing = editingId === task.id;
            const meta = categoryStyles[task.category] || categoryStyles["discipline"];
            
            return (
              <div
                key={task.id}
                className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4 transition-all relative group shadow-sm ${task.completed ? "border-slate-900 bg-slate-900/20" : "border-slate-800 bg-slate-900/40 hover:border-slate-705"}`}
                id={`task-item-card-${task.id}`}
              >
                {isEditing ? (
                  /* Edit Box */
                  <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none"
                    />
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as Task["category"])}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    >
                      <option value="discipline">Discipline</option>
                      <option value="health">Health</option>
                      <option value="finance">Finance</option>
                      <option value="career">Career</option>
                      <option value="learning">Learning</option>
                      <option value="relationships">Relationships</option>
                      <option value="mindset">Mindset</option>
                    </select>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="p-1 px-3 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold text-white inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1 px-3 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded text-xs text-slate-400 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard display */
                  <>
                    <div className="flex items-center gap-4.5">
                      {/* Checkbox circle trigger */}
                      <div 
                        onClick={() => onToggleTask(task.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors ${task.completed ? "bg-emerald-500/10 border-emerald-500" : "border-slate-700 hover:border-indigo-500"}`}
                        id={`checkbox-element-${task.id}`}
                      >
                        {task.completed && <Check className="w-4 h-4 text-emerald-400 font-bold" />}
                      </div>

                      <div className="text-left">
                        <p className={`font-semibold md:text-base text-sm ${task.completed ? "text-slate-500 line-through" : "text-slate-100"}`}>
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`${meta.bg} ${meta.text} border border-indigo-950 text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-lg`}>
                            {meta.label}
                          </span>
                          {task.recurring && (
                            <span className="text-slate-500 font-mono text-[9px] uppercase border border-slate-900 bg-slate-950/40 px-1.5 py-0.5 rounded-lg">
                              ★ Daily Recurring
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                      {/* Reward indicator */}
                      <span className="font-mono text-xs text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full">
                        +{task.xpReward} XP
                      </span>

                      {/* Editing Actions */}
                      <div className="flex items-center gap-1 text-slate-500 opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEdit(task)}
                          title="Edit Task"
                          className="p-2 hover:bg-slate-800 rounded hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          title="Delete Task"
                          className="p-2 hover:bg-rose-950 rounded hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
