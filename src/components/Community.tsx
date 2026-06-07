/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Heart, MessageSquare, Share2, Plus, UserPlus, Check, Award, CornerDownRight } from "lucide-react";
import { SocialPost } from "../types";

interface CommunityProps {
  posts: SocialPost[];
  onAddPost: (content: string, badgeToShare?: string) => void;
  onLikePost: (id: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  unlockedBadges: string[];
  userLevel: number;
}

export default function Community({
  posts,
  onAddPost,
  onLikePost,
  onAddComment,
  unlockedBadges,
  userLevel
}: CommunityProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedBadgeShare, setSelectedBadgeShare] = useState<string>("");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [followingUsers, setFollowingUsers] = useState<string[]>([]);

  const badgeEmojis: Record<string, string> = {
    "first-task": "🎯 First Victory",
    "7-day-streak": "🔥 Iron Will",
    "30-day-streak": "🧘 Monk Discipline",
    "first-goal": "🏆 Vision Manifest",
    "saved-money": "💰 Wealth Alchemist"
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    
    onAddPost(
      newPostContent, 
      selectedBadgeShare ? badgeEmojis[selectedBadgeShare] : undefined
    );
    setNewPostContent("");
    setSelectedBadgeShare("");
  };

  const submitComment = (postId: string) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const toggleFollowUser = (authorName: string) => {
    if (followingUsers.includes(authorName)) {
      setFollowingUsers(followingUsers.filter(u => u !== authorName));
    } else {
      setFollowingUsers([...followingUsers, authorName]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left" id="community-tab-root">
      
      {/* Feed Area: Left 2 Cols */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Creation Box */}
        <form onSubmit={handleCreatePost} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="community-create-post">
          <div className="flex gap-1.5 items-center pb-2 border-b border-indigo-950/40">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white font-display">Broadcast Lifestyle Victory</h3>
          </div>

          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Share your breakthrough, routine updates, workout summaries, or mental milestones with fellow champions..."
            required
            className="w-full min-h-[80px] bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-sm text-white focus:outline-none placeholder:text-slate-600"
            id="community-input-text"
          />

          {/* Option to share unlocked badge */}
          {unlockedBadges.length > 0 && (
            <div className="space-y-1 pt-1">
              <span className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest">Attach Unlocked Badge</span>
              <select
                value={selectedBadgeShare}
                onChange={(e) => setSelectedBadgeShare(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg p-2 text-xs focus:outline-none cursor-pointer"
                id="community-choose-badge"
              >
                <option value="">No badge attached</option>
                {unlockedBadges.map((bid) => (
                  <option key={bid} value={bid}>{badgeEmojis[bid] || bid}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end p-1">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs font-mono cursor-pointer transition-colors"
              id="sub-share-post-btn"
            >
              Publish Update
            </button>
          </div>
        </form>

        {/* Dynamic Social Feed */}
        <div className="space-y-6" id="social-tweets-feed">
          {posts.map((post) => {
            const isFollowing = followingUsers.includes(post.author);
            return (
              <div 
                key={post.id} 
                className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 hover:border-slate-750 transition"
                id={`social-card-${post.id}`}
              >
                {/* Author Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={post.authorAvatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-2">
                        {post.author}
                        <span className="text-[10px] bg-slate-950 border border-slate-800 text-indigo-400 font-mono px-2 py-0.5 rounded">
                          {post.authorTitle}
                        </span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">Broadcasted: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {post.author !== "You" && (
                    <button
                      onClick={() => toggleFollowUser(post.author)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1 cursor-pointer ${isFollowing ? "bg-slate-950 border-emerald-500/20 text-emerald-400" : "bg-indigo-650 hover:bg-indigo-550 border-indigo-700 text-white"}`}
                      id={`follow-bt-${post.id}`}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" /> Follow Companion
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-slate-350 leading-relaxed font-sans">
                  {post.content}
                </p>

                {/* Attached Badge visual */}
                {post.achievementBadge && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-mono">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Unlocked Badge: <strong>{post.achievementBadge}</strong></span>
                  </div>
                )}

                {/* Action buttons (Likes / Replies toggle) */}
                <div className="flex items-center gap-6 border-t border-b border-indigo-950/40 py-2 text-xs font-mono">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 hover:text-rose-400 transition cursor-pointer select-none ${post.likedByCurrentUser ? "text-rose-400 font-extrabold" : "text-slate-500"}`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? "fill-rose-500" : ""}`} />
                    <span>{post.likes} Likes</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </div>
                </div>

                {/* Comments Thread list */}
                <div className="space-y-2.5 pt-1" id={`comment-thread-${post.id}`}>
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-2.5 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800 text-xs">
                      <CornerDownRight className="w-4 h-4 text-slate-650 mt-1 shrink-0" />
                      <div>
                        <div className="font-semibold text-indigo-400 font-mono inline mr-1">{comment.author}:</div>
                        <span className="text-slate-300 font-sans leading-relaxed">{comment.content}</span>
                      </div>
                    </div>
                  ))}

                  {/* Add comment form input */}
                  <div className="flex gap-2 pt-1.5">
                    <input
                      type="text"
                      placeholder="Post supportive encouragement..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={() => submitComment(post.id)}
                      className="px-3 bg-slate-950 border border-slate-800 hover:bg-slate-850 text-indigo-400 font-bold rounded-lg text-xs font-mono cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Side: Leaderboard Simulation: Right 1 Col */}
      <div className="space-y-6">
        <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-bold font-display text-white">Global Standings</h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4" id="leaderboard">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest border-b border-indigo-950 pb-2 flex justify-between">
            <span>Champion Candidate</span>
            <span>Game level</span>
          </div>

          <div className="space-y-3.5">
            {[
              { rank: 1, name: "Sam Wilson", lvl: 8, xp: "Master Hero", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80", me: false },
              { rank: 2, name: "Zara Lin", lvl: 6, xp: "Disciplined Warrior", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", me: false },
              { rank: 3, name: "Alex Rivers", lvl: 5, xp: "Champion Builder", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80", me: false },
              { rank: 4, name: "You", lvl: userLevel, xp: "Challenger Status", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80", me: true },
              { rank: 5, name: "Karthik K.", lvl: 3, xp: "Focused Rookie", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", me: false }
            ].map((usr) => (
              <div 
                key={usr.rank} 
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${usr.me ? "bg-indigo-950/40 border-indigo-500/40 text-indigo-300" : "bg-slate-950/40 border-slate-900 text-slate-400"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 text-center font-mono font-extrabold ${usr.rank === 1 ? "text-amber-400" : usr.rank === 2 ? "text-slate-300" : usr.rank === 3 ? "text-amber-600" : ""}`}>
                    #{usr.rank}
                  </span>
                  <img src={usr.avatar} alt={usr.name} className="w-8 h-8 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-bold text-white leading-tight">{usr.name}</h5>
                    <span className="text-[9px] font-mono block mt-0.5 text-slate-500">{usr.xp}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-extrabold text-slate-200">Lvl {usr.lvl}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
