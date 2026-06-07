/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum MoodType {
  AMAZING = "amazing",
  GOOD = "good",
  AVERAGE = "average",
  BAD = "bad",
  TERRIBLE = "terrible"
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  xpReward: number;
  recurring: boolean;
  category: "health" | "discipline" | "finance" | "career" | "learning" | "relationships" | "mindset";
  createdAt: string;
}

export interface Habit {
  id: string;
  title: string;
  frequency: "daily" | "weekly";
  completedDates: string[]; // Keep track of dates completed, e.g. "2026-06-07"
  streak: number;
  longestStreak: number;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  category: "health" | "discipline" | "finance" | "career" | "learning" | "relationships" | "mindset";
  milestones: Milestone[];
  progress: number; // 0 to 100
  xpReward: number;
  completed: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  wins: string;
  challenges: string;
  lessons: string;
  aiSummary?: string;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  durationDays: number;
  tasks: string[]; // List of specific daily task checklist items
  joined: boolean;
  progressDays: number;
  completed: boolean;
  bannerUrl?: string;
}

export interface SocialPost {
  id: string;
  author: string;
  authorAvatar: string;
  authorTitle: string;
  content: string;
  achievementBadge?: string;
  likes: number;
  likedByCurrentUser: boolean;
  comments: {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "ai";
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  isPremium: boolean;
  lifeScores: {
    health: number;
    discipline: number;
    finance: number;
    career: number;
    learning: number;
    relationships: number;
    mindset: number;
  };
  unlockedBadges: string[];
}
