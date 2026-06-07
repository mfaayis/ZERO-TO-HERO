/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserProfile, Task, Habit, Goal, JournalEntry, Challenge, SocialPost, AppNotification, MoodType } from "./types";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "./firebase";

// Import modular panels
import Navigation from "./components/Navigation";
import Homepage from "./components/Homepage";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Checklist from "./components/Checklist";
import Habits from "./components/Habits";
import Goals from "./components/Goals";
import AICoach from "./components/AICoach";
import Journal from "./components/Journal";
import Analytics from "./components/Analytics";
import Challenges from "./components/Challenges";
import Community from "./components/Community";
import Admin from "./components/Admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("landing"); // 'landing', 'auth', 'dashboard', 'checklist', 'habits', 'goals', 'coach', 'journal', 'analytics', 'challenges', 'community', 'admin'
  const [authPlanSelected, setAuthPlanSelected] = useState<string | undefined>(undefined);
  
  // Real active user credential focus
  const [currentUserEmail, setCurrentUserEmail] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");

  // Storage states mirroring server database
  const [profile, setProfile] = useState<UserProfile>({
    name: "Hero Challenger",
    email: "guest@zerotohero.dev",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 3,
    isPremium: false,
    lifeScores: { health: 50, discipline: 50, finance: 50, career: 50, learning: 50, relationships: 50, mindset: 50 },
    unlockedBadges: []
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [communityPosts, setCommunityPosts] = useState<SocialPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: "init",
      title: "Protocol Initialized",
      message: "Ready to go! Establish today's daily checklist tasks to claim game-XP.",
      type: "info",
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: "discipline", title: "30 Day Discipline Protocol", description: "Strictly adhere to your daily habits and goals index for 30 consecutive days without snooze logs.", durationDays: 30, tasks: [], joined: false, progressDays: 0, completed: false },
    { id: "nosugar", title: "No Sugar Challenge", description: "Eradicate standard carbonated sodas, processed sweets, and simple glucose sugars from daily routines.", durationDays: 30, tasks: [], joined: false, progressDays: 0, completed: false },
    { id: "books", title: "Read 12 Development Books", description: "Allocate consistent reading slots daily to acquire profound tactical lifestyle lessons.", durationDays: 14, tasks: [], joined: false, progressDays: 0, completed: false },
    { id: "morning", title: "Indestructible AM Morning routine", description: "Awake at 5:30 AM, drink a full glass of water, and perform core workouts before general tasks.", durationDays: 21, tasks: [], joined: false, progressDays: 0, completed: false }
  ]);

  // AI coach contextual parameters state
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "coach"; content: string; createdAt: string }[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([
    "⚡ Complete at least 3 daily tasks early in the morning to lock in your 'Discipline multiplier'.",
    "🌱 Maintain your current streak by toggling off your daily habit tracking logs.",
    "📚 Allocate 30 minutes tonight to break your active milestones down into achievable bite-sized progress chunks."
  ]);
  const [generatingRecommendations, setGeneratingRecommendations] = useState(false);

  // ── Firebase UID (needed for Firestore paths) ───────────────────────────────
  const [firebaseUid, setFirebaseUid] = useState<string>("");

  // ── Session persistence: restore logged-in user on page refresh ─────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUid(user.uid);
        setCurrentUserEmail(user.email || "");
        setCurrentUserName(user.displayName || user.email?.split("@")[0] || "Hero");
        await loadProfileData(user.uid, user.email || "", user.displayName || "");
        setActiveTab("dashboard");
      } else {
        // User signed out — reset everything
        setFirebaseUid("");
        setCurrentUserEmail("");
        setCurrentUserName("");
        setActiveTab("landing");
      }
    });
    return () => unsubscribe();
  }, []);

  // ── Firestore: load all user data ───────────────────────────────────────────
  const loadProfileData = async (uid: string, email: string, displayName: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        if (data.profile)  setProfile(data.profile);
        if (data.tasks?.length)   setTasks(data.tasks);
        if (data.habits?.length)  setHabits(data.habits);
        if (data.goals?.length)   setGoals(data.goals);
        if (data.journals?.length) setJournals(data.journals);
      } else {
        // First-time user — seed defaults
        const initialProfile: UserProfile = {
          name: displayName || email.split("@")[0],
          email,
          level: 1,
          xp: 15,
          xpToNextLevel: 100,
          streak: 1,
          isPremium: authPlanSelected === "premium" || authPlanSelected === "enterprise",
          lifeScores: { health: 60, discipline: 55, finance: 50, career: 50, learning: 65, relationships: 50, mindset: 55 },
          unlockedBadges: []
        };

        const defaultTasks: Task[] = [
          { id: "t1", title: "Wake up early without snooze logs",            completed: false, xpReward: 12, recurring: true, category: "discipline", createdAt: new Date().toISOString() },
          { id: "t2", title: "Commit to 30 Minutes Gym/Run physical exercise", completed: false, xpReward: 20, recurring: true, category: "health",     createdAt: new Date().toISOString() },
          { id: "t3", title: "Consume 3 Liters of standard water",             completed: false, xpReward: 10, recurring: true, category: "health",     createdAt: new Date().toISOString() },
          { id: "t4", title: "Read 10 pages of Self-Development text",         completed: false, xpReward: 10, recurring: true, category: "learning",   createdAt: new Date().toISOString() },
          { id: "t5", title: "Record 5 minutes evening mindful meditations",   completed: false, xpReward: 10, recurring: true, category: "mindset",    createdAt: new Date().toISOString() },
          { id: "t6", title: "Write in the Self-Thought Journal tonight",       completed: false, xpReward: 12, recurring: true, category: "mindset",    createdAt: new Date().toISOString() }
        ];

        const defaultHabits: Habit[] = [
          { id: "h1", title: "Cold showers routines", frequency: "daily", completedDates: [], streak: 0, longestStreak: 0, createdAt: new Date().toISOString() },
          { id: "h2", title: "Log spending budgets",  frequency: "daily", completedDates: [], streak: 0, longestStreak: 0, createdAt: new Date().toISOString() }
        ];

        setProfile(initialProfile);
        setTasks(defaultTasks);
        setHabits(defaultHabits);

        // Persist the seed data immediately
        await setDoc(userRef, {
          profile: initialProfile,
          tasks: defaultTasks,
          habits: defaultHabits,
          goals: [],
          journals: []
        });
      }
    } catch (error) {
      console.error("Firestore load error:", error);
    }
  };

  // ── Firestore: debounced save whenever state changes ────────────────────────
  useEffect(() => {
    if (!firebaseUid) return;
    const timer = setTimeout(async () => {
      try {
        await setDoc(doc(db, "users", firebaseUid), {
          profile,
          tasks,
          habits,
          goals,
          journals
        }, { merge: true });
      } catch (error) {
        console.error("Firestore save error:", error);
      }
    }, 1500); // 1.5 s debounce — avoids hammering Firestore on every keystroke
    return () => clearTimeout(timer);
  }, [profile, tasks, habits, goals, journals, firebaseUid]);

  // Gamified XP allocator engine
  const earnXPPoints = (points: number) => {
    setProfile(prev => {
      let nextXp = prev.xp + points;
      let nextLevel = prev.level;
      let nextToLevel = prev.xpToNextLevel;
      let alerted = false;

      while (nextXp >= nextToLevel) {
        nextXp -= nextToLevel;
        nextLevel += 1;
        // Increase difficulty progressively
        nextToLevel = Math.round(nextToLevel * 1.25);
        alerted = true;
      }

      if (alerted) {
        // Dispatch level up system notification
        pushToastNotification(
          "★ Character Level UP!",
          `Congratulations! You leveled up from Level ${prev.level} to Level ${nextLevel}! Carry on doing tasks.`,
          "success"
        );
      }

      // Check badges unlocks on XP points count
      const updatedBadges = [...prev.unlockedBadges];
      return {
        ...prev,
        level: nextLevel,
        xp: nextXp,
        xpToNextLevel: nextToLevel,
        unlockedBadges: evaluateBadgeUnlocks(updatedBadges, prev, tasks, goals)
      };
    });
  };

  const evaluateBadgeUnlocks = (currentList: string[], prof: UserProfile, tList: Task[], gList: Goal[]) => {
    const updated = [...currentList];

    // First Task Complete Badge
    if (!updated.includes("first-task") && tList.some(t => t.completed)) {
      updated.push("first-task");
      pushToastNotification("🏆 Badge Unlocked: First Victory!", "Completed your first daily priority task checklist items successfully.", "success");
    }

    // 7 days streak
    if (!updated.includes("7-day-streak") && prof.level >= 3) {
      updated.push("7-day-streak");
      pushToastNotification("🏆 Badge Unlocked: Iron Will!", "Reached Level 3 Disciplined status multiplier.", "success");
    }

    // Goal Completed badge
    if (!updated.includes("first-goal") && gList.some(g => g.completed)) {
      updated.push("first-goal");
      pushToastNotification("🏆 Badge Unlocked: Vision Manifest!", "Completed your first comprehensive long term milestone goal.", "success");
    }

    return updated;
  };

  // Helper notification toaster
  const pushToastNotification = (title: string, message: string, type: AppNotification["type"]) => {
    const newNoti: AppNotification = {
      id: Math.random().toString(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNoti, ...prev]);
  };

  // Core Auth flow handlers
  // Called by Auth.tsx after a successful Firebase sign-in/register.
  // onAuthStateChanged (above) handles the actual session state — this just
  // applies the chosen focus area boost and shows the welcome toast.
  const handleAuthSuccess = (email: string, name: string, premiumOverride: boolean, firstFocus?: string) => {
    // Inject starting multipliers based on preferred Focus Area
    setProfile(prev => {
      const scores = { ...prev.lifeScores };
      if (firstFocus && firstFocus in scores) {
        (scores as any)[firstFocus] = 80;
      }
      return {
        ...prev,
        name: name,
        email: email,
        isPremium: premiumOverride,
        lifeScores: scores
      };
    });

    pushToastNotification(
      "Connection Approved",
      `Welcome to Zero to Hero, Challenger ${name}! Your baseline statistics are now logged.`,
      "info"
    );
  };

  // Checklist actions
  const handleAddTask = (title: string, category: string, isRecurring: boolean, customXP?: number) => {
    const newTask: Task = {
      id: Math.random().toString(),
      title,
      completed: false,
      xpReward: customXP || 12,
      recurring: isRecurring,
      category: category as Task["category"],
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    
    // Increase focus metrics index
    adjustLifeScoreRating(category, 2);
  };

  const handleEditTask = (id: string, updatedTitle: string, updatedCategory: string, isRecurring: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { 
      ...t, 
      title: updatedTitle, 
      category: updatedCategory as Task["category"], 
      recurring: isRecurring 
    } : t));
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextStatus = !task.completed;
        if (nextStatus) {
          // Gained Experience points
          earnXPPoints(task.xpReward);
          adjustLifeScoreRating(task.category, 5);
        } else {
          // De-allocate XP points safely
          setProfile(p => ({ ...p, xp: Math.max(0, p.xp - task.xpReward) }));
          adjustLifeScoreRating(task.category, -5);
        }
        return { ...task, completed: nextStatus };
      }
      return task;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleResetDailyChecklist = () => {
    setTasks(prev => prev.map(t => ({ ...t, completed: false })));
    pushToastNotification("Daily Checklist Reset", "All completed checklist items are reset to open state for the morning.", "info");
  };

  // Adjust Category Scores out of 100
  const adjustLifeScoreRating = (category: string, delta: number) => {
    setProfile(prev => {
      const updated = { ...prev.lifeScores };
      if (category in updated) {
        (updated as any)[category] = Math.min(Math.max((updated as any)[category] + delta, 0), 100);
      }
      return { ...prev, lifeScores: updated };
    });
  };

  // Habits Operations
  const handleAddHabit = (title: string, frequency: "daily" | "weekly") => {
    const newHabit: Habit = {
      id: Math.random().toString(),
      title,
      frequency,
      completedDates: [],
      streak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const handleToggleHabitDate = (id: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const list = [...h.completedDates];
        if (list.includes(dateStr)) {
          // Remove completion
          const newList = list.filter(d => d !== dateStr);
          return {
            ...h,
            completedDates: newList,
            streak: Math.max(0, h.streak - 1)
          };
        } else {
          // Add completion date
          list.push(dateStr);
          // Increment streak
          const newStreak = h.streak + 1;
          const longest = Math.max(h.longestStreak, newStreak);
          earnXPPoints(10); // Habit log XP
          return {
            ...h,
            completedDates: list,
            streak: newStreak,
            longestStreak: longest
          };
        }
      }
      return h;
    }));
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  // Long-Term Goals Operations
  const handleAddGoal = (title: string, description: string, deadline: string, category: string, milestonesArr: string[]) => {
    const newGoal: Goal = {
      id: Math.random().toString(),
      title,
      description,
      deadline,
      category: category as Goal["category"],
      milestones: milestonesArr.map(m => ({ id: Math.random().toString(), title: m, completed: false })),
      progress: 0,
      xpReward: 50,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => 
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        
        const doneCount = updatedMilestones.filter(m => m.completed).length;
        const total = updatedMilestones.length;
        const pct = Math.round((doneCount / total) * 100);
        const fullyDone = pct === 100;
        
        if (fullyDone && !goal.completed) {
          earnXPPoints(goal.xpReward);
          adjustLifeScoreRating(goal.category, 15);
        }

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: pct,
          completed: fullyDone
        };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  // Coaching Conversation Handler with Server Proxy
  const handleSendCoachMessage = async (text: string) => {
    // Add user message to history
    const userMsg = { role: "user" as const, content: text, createdAt: new Date().toISOString() };
    setChatHistory(prev => [...prev, userMsg]);

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: chatHistory,
          profile,
          metricsSummary: `Tasks active: ${tasks.length}, Completed: ${tasks.filter(t => t.completed).length}. Active Habits: ${habits.length}.`
        })
      });

      const payload = await response.json();
      const coachMsg = { role: "coach" as const, content: payload.text || "Coaching metrics parsed correctly.", createdAt: new Date().toISOString() };
      setChatHistory(prev => [...prev, coachMsg]);
      return coachMsg.content;
    } catch (e) {
      console.error("Coach message dispatch fail:", e);
      const errResponse = "I'm having a brief connection drop syncing with Gemini Core services. Let's keep our focus locked on our daily checklist disciplines while the connection refreshes!";
      setChatHistory(prev => [...prev, { role: "coach", content: errResponse, createdAt: new Date().toISOString() }]);
      return errResponse;
    }
  };

  const handleResetChatHistory = () => {
    setChatHistory([]);
  };

  // AI Daily advice recommendation regenerator
  const handleRefreshRecommendations = async () => {
    setGeneratingRecommendations(true);
    try {
      const response = await fetch("/api/coach/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, tasks, habits, goals })
      });
      const data = await response.json();
      if (data.recommendations && data.recommendations.length > 0) {
        setAiRecommendations(data.recommendations);
        pushToastNotification("★ Advisor Synchronized", "Gemini advisors reconstructed a new focus vector successfully.", "ai");
      }
    } catch (e) {
      console.error("Failed to fetch custom recommendations:", e);
    } finally {
      setGeneratingRecommendations(false);
    }
  };

  // Thought journaling with sentiment analyzers
  const handleAddJournal = async (mood: MoodType, wins: string, challenges: string, lessons: string) => {
    let aiSummaryStr = "";
    
    try {
      const response = await fetch("/api/coach/analyze-journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, wins, challenges, lessons })
      });
      const data = await response.json();
      aiSummaryStr = data.summary || "";
    } catch (err) {
      console.error(err);
    }

    const newEntry: JournalEntry = {
      id: Math.random().toString(),
      date: new Date().toISOString().split("T")[0],
      mood,
      wins,
      challenges,
      lessons,
      aiSummary: aiSummaryStr || "Journal archived successfully.",
      createdAt: new Date().toISOString()
    };

    setJournals(prev => [newEntry, ...prev]);
    adjustLifeScoreRating("mindset", 10);
    earnXPPoints(15); // Journal write XP

    pushToastNotification(
      "Journal Locked In",
      "Excellent reflection practice! Gained +15 XP and boosted Mindset Score.",
      "success"
    );
  };

  const handleDeleteJournal = (id: string) => {
    setJournals(prev => prev.filter(j => j.id !== id));
  };

  // Challenges Operations
  const handleJoinChallenge = (id: string) => {
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, joined: true } : c));
    pushToastNotification("Challenge Enrolled", `You have successfully joined the ${id} challenge. Keep tracking!`, "info");
  };

  const handleIncrementChallenge = (id: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const nextProgress = c.progressDays + 1;
        const reachedEnd = nextProgress >= c.durationDays;
        
        if (reachedEnd) {
          earnXPPoints(100); // Massive challenge complete award
          pushToastNotification("🏆 Quest Complete!", `Incredible consistency! You fully completed the ${c.title} course! +100 XP Point multiplier claimed!`, "success");
        } else {
          earnXPPoints(15);
        }

        return {
          ...c,
          progressDays: nextProgress,
          completed: reachedEnd
        };
      }
      return c;
    }));
  };

  // Peer Community Board social actions
  const handleAddPost = (content: string, badgeToShare?: string) => {
    const newPost: SocialPost = {
      id: "p_" + Math.random().toString(),
      author: "You",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      authorTitle: `Level ${profile.level} Champion`,
      content,
      achievementBadge: badgeToShare,
      likes: 0,
      likedByCurrentUser: false,
      comments: [],
      createdAt: new Date().toISOString()
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    pushToastNotification("Broadcast Published", "Your operational update is published to peer boards.", "success");
  };

  const handleLikePost = (id: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === id) {
        const liked = !post.likedByCurrentUser;
        return {
          ...post,
          likedByCurrentUser: liked,
          likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1)
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Math.random().toString(),
              author: "You",
              content: commentText,
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return post;
    }));
  };

  // Admin Commands
  const handleAddNewAdminChallenge = (title: string, desc: string, days: number) => {
    const customChall: Challenge = {
      id: "custom_" + Math.random().toString(),
      title,
      description: desc,
      durationDays: days,
      tasks: [],
      joined: false,
      progressDays: 0,
      completed: false
    };
    setChallenges(prev => [...prev, customChall]);
  };

  const handleSendAnnouncementAll = (title: string, msg: string) => {
    pushToastNotification("⚡ SYSTEM ALERT: " + title, msg, "warning");
  };

  const handleAdminDeletePost = (id: string) => {
    setCommunityPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleSetPremiumOverride = (val: boolean) => {
    setProfile(prev => ({ ...prev, isPremium: val }));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out error:", err);
    }
    // onAuthStateChanged listener will clear state & redirect to landing
    setChatHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans" id="master-root">
      
      {/* Visual Navigation header */}
      {activeTab !== "landing" && activeTab !== "auth" && (
        <Navigation 
          activeTab={activeTab} 
          onSelectTab={setActiveTab} 
          profile={profile} 
          onLogout={handleLogout} 
        />
      )}

      {/* Main Container workspace viewports */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8" id="master-viewports">
        
        {/* LANDING GATE */}
        {activeTab === "landing" && (
          <Homepage 
            onStart={(plan) => { setAuthPlanSelected(plan); setActiveTab("auth"); }} 
            onNavigateToTab={(path) => { pushToastNotification("Policy Opened", `Opened ${path} documentation guidelines inside sandbox metadata context.`, "info"); }}
          />
        )}

        {/* AUTHENTICATION GATE */}
        {activeTab === "auth" && (
          <Auth 
            onAuthSuccess={handleAuthSuccess} 
            onBackToHome={() => setActiveTab("landing")} 
            defaultPlan={authPlanSelected}
          />
        )}

        {/* CORE DASHBOARD */}
        {activeTab === "dashboard" && (
          <Dashboard
            profile={profile}
            tasks={tasks}
            notifications={notifications}
            aiRecommendations={aiRecommendations}
            generatingRecommendations={generatingRecommendations}
            onRefreshRecommendations={handleRefreshRecommendations}
            onToggleTask={handleToggleTask}
            onNavigateToTab={setActiveTab}
            onClearNotifications={() => setNotifications([])}
            onBuyPremiumUpgrade={() => { setProfile(p => ({ ...p, isPremium: true })); pushToastNotification("★ Upgrade complete", "Your Account has elevated to Premium Elite successfully! Multipliers in place.", "success"); }}
          />
        )}

        {/* DAILY CHECKLIST */}
        {activeTab === "checklist" && (
          <Checklist
            tasks={tasks}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onResetDailyChecklist={handleResetDailyChecklist}
          />
        )}

        {/* HABITS TRACKER */}
        {activeTab === "habits" && (
          <Habits
            habits={habits}
            onAddHabit={handleAddHabit}
            onToggleHabitDate={handleToggleHabitDate}
            onDeleteHabit={handleDeleteHabit}
          />
        )}

        {/* LONG TERM GOALS */}
        {activeTab === "goals" && (
          <Goals
            goals={goals}
            onAddGoal={handleAddGoal}
            onToggleMilestone={handleToggleMilestone}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {/* AI LIFE COACH CHAT */}
        {activeTab === "coach" && (
          <AICoach
            profile={profile}
            chatHistory={chatHistory}
            onSendMessage={handleSendCoachMessage}
            onResetChatHistory={handleResetChatHistory}
          />
        )}

        {/* JOURNAL AND MOODS */}
        {activeTab === "journal" && (
          <Journal
            journals={journals}
            onAddJournal={handleAddJournal}
            onDeleteJournal={handleDeleteJournal}
          />
        )}

        {/* CHARTS AND PERFORMANCE ANALYTICS */}
        {activeTab === "analytics" && (
          <Analytics
            profile={profile}
            tasks={tasks}
            habits={habits}
            goals={goals}
            journals={journals}
          />
        )}

        {/* QUEST COURSES AND BADGES */}
        {activeTab === "challenges" && (
          <Challenges
            profile={profile}
            challenges={challenges}
            onJoinChallenge={handleJoinChallenge}
            onIncrementChallenge={handleIncrementChallenge}
          />
        )}

        {/* SOCIAL COMMUNITY FEEDS */}
        {activeTab === "community" && (
          <Community
            posts={communityPosts}
            onAddPost={handleAddPost}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            unlockedBadges={profile.unlockedBadges}
            userLevel={profile.level}
          />
        )}

        {/* BACKDOOR ADMIN COMMANDS */}
        {activeTab === "admin" && (
          <Admin
            posts={communityPosts}
            challenges={challenges}
            onAddAdminChallenge={handleAddNewAdminChallenge}
            onSendAnnouncementAll={handleSendAnnouncementAll}
            onAdminDeletePost={handleAdminDeletePost}
            onSetPremiumOverride={handleSetPremiumOverride}
            isPremium={profile.isPremium}
          />
        )}

      </main>

      {/* Miniature viewport toast notification */}
      {notifications.length > 0 && !notifications[0].read && (
        <div 
          onClick={() => setNotifications(prev => prev.map((n, i) => i === 0 ? { ...n, read: true } : n))}
          className="fixed bottom-6 right-6 max-w-sm bg-slate-900 border border-indigo-500/30 p-4 rounded-xl shadow-2xl z-50 text-left cursor-pointer animate-slideUp"
          id="mini-alert-toast"
        >
          <h5 className="font-bold text-xs font-mono uppercase tracking-widest text-indigo-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> 
            {notifications[0].title}
          </h5>
          <p className="text-xs text-slate-300 mt-1 font-sans">{notifications[0].message}</p>
          <span className="text-[10px] text-slate-500 font-mono block mt-2">Click toast to dismiss.</span>
        </div>
      )}
    </div>
  );
}
