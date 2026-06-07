import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface JourneyProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

const DAY_MISSIONS: Record<number, { title: string; xp: number; category: string }[]> = {
  1:  [{ title: 'Wake up on time — no snooze', xp: 12, category: 'discipline' }, { title: 'Drink 500ml water immediately', xp: 8, category: 'health' }, { title: 'Write your 3 main goals for this journey', xp: 15, category: 'mindset' }, { title: '15 minutes of movement or workout', xp: 20, category: 'health' }, { title: 'No social media before 9AM', xp: 10, category: 'discipline' }],
  2:  [{ title: 'Wake up — no alarm snooze', xp: 12, category: 'discipline' }, { title: 'Cold shower (min 30 seconds)', xp: 20, category: 'discipline' }, { title: 'Plan your top 3 tasks for today', xp: 10, category: 'career' }, { title: '30 min workout', xp: 25, category: 'health' }, { title: 'Read 10 pages of a book', xp: 15, category: 'learning' }],
  3:  [{ title: '5AM wake-up (or 1hr earlier than usual)', xp: 20, category: 'discipline' }, { title: 'Journal: What went well yesterday?', xp: 12, category: 'mindset' }, { title: 'Workout — push harder than day 2', xp: 25, category: 'health' }, { title: 'Track every penny you spend today', xp: 10, category: 'finance' }, { title: 'No junk food all day', xp: 15, category: 'health' }],
  7:  [{ title: 'One-week review: score yourself 1-10', xp: 20, category: 'mindset' }, { title: 'Intense 45-min workout', xp: 30, category: 'health' }, { title: 'Cold shower — 2 full minutes', xp: 25, category: 'discipline' }, { title: 'Write your why — why are you doing this?', xp: 20, category: 'mindset' }, { title: 'Text someone who inspires you', xp: 10, category: 'relationships' }],
  14: [{ title: '2-week milestone workout (PR attempt)', xp: 40, category: 'health' }, { title: 'Review finances — what can you cut?', xp: 25, category: 'finance' }, { title: 'Cold shower — no hesitation', xp: 20, category: 'discipline' }, { title: 'Meditate for 10 minutes', xp: 15, category: 'mindset' }, { title: 'Plan next 2 weeks: set 5 specific goals', xp: 25, category: 'career' }],
  30: [{ title: '30-DAY COMPLETION WORKOUT 🏆', xp: 100, category: 'health' }, { title: 'Write your transformation story', xp: 50, category: 'mindset' }, { title: 'Share your win with someone', xp: 30, category: 'relationships' }, { title: 'Plan your next 30 days', xp: 40, category: 'discipline' }],
};

function getMissionsForDay(day: number) {
  const keys = Object.keys(DAY_MISSIONS).map(Number).sort((a,b) => a - b);
  for (let i = keys.length - 1; i >= 0; i--) {
    if (day >= keys[i]) return DAY_MISSIONS[keys[i]];
  }
  return DAY_MISSIONS[1];
}

const MILESTONES = [
  { day: 1,  label: 'Day 1',       icon: '🌱', done: false },
  { day: 7,  label: 'Week 1',      icon: '⚡', done: false },
  { day: 14, label: '2 Weeks',     icon: '🔥', done: false },
  { day: 21, label: '3 Weeks',     icon: '💪', done: false },
  { day: 30, label: '1 Month',     icon: '🏆', done: false },
  { day: 60, label: '2 Months',    icon: '💎', done: false },
  { day: 90, label: 'HERO',        icon: '👑', done: false },
];

const MOTIVATIONAL_QUOTES = [
  "The pain you feel today is the strength you'll feel tomorrow.",
  "Discipline is choosing what you want most over what you want now.",
  "Every champion was once a contender who refused to give up.",
  "You don't rise to the level of your goals. You fall to the level of your systems.",
  "The only bad workout is the one that didn't happen.",
  "Your future self is watching you right now through your memories.",
  "Hard days are the best days because that's when champions are made.",
];

export default function Journey({ userProfile, onUpdateProfile }: JourneyProps) {
  const [day] = useState(() => Math.max(1, userProfile.streak || 1));
  const [completedToday, setCompletedToday] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const missions = getMissionsForDay(day);
  const quote = MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
  const completedCount = completedToday.length;
  const totalMissions = missions.length;
  const dayProgress = Math.round((completedCount / totalMissions) * 100);
  const isMilestone = [1, 7, 14, 21, 30, 60, 90].includes(day);

  function toggleMission(title: string, xp: number) {
    if (completedToday.includes(title)) {
      setCompletedToday(prev => prev.filter(t => t !== title));
    } else {
      setCompletedToday(prev => [...prev, title]);
      if (completedToday.length + 1 === totalMissions) {
        setTimeout(() => setShowCelebration(true), 400);
      }
      onUpdateProfile({ xp: userProfile.xp + xp });
    }
  }

  const lifeScoreAvg = Math.round(Object.values(userProfile.lifeScores).reduce((a,b) => a+b, 0) / 7);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1rem', fontFamily: "'Inter', sans-serif" }}>

      {/* Celebration overlay */}
      {showCelebration && (
        <div onClick={() => setShowCelebration(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(5,5,13,0.9)', zIndex: 999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem', animation: 'bounce 0.5s ease infinite alternate' }}>🎉</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '2.5rem', fontWeight: 900, color: '#f1f0ff', marginBottom: '0.75rem' }}>
              Day {day} Complete!
            </h2>
            <p style={{ color: 'rgba(160,157,192,0.9)', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
              You did what most people won't. <strong style={{ color: '#a78bfa' }}>That's why you'll get what most people don't.</strong>
            </p>
            <div style={{ fontSize: '0.8rem', color: 'rgba(160,157,192,0.5)' }}>Tap anywhere to continue</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
              {isMilestone ? '🏆 MILESTONE DAY!' : '⚡ YOUR JOURNEY'}
            </div>
            <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f1f0ff', lineHeight: 1.1 }}>
              Day {day} <span style={{ background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>of Your Transformation</span>
            </h1>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 16, padding: '0.75rem 1.25rem' }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '2rem', background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{lifeScoreAvg}%</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(160,157,192,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Life Score</div>
          </div>
        </div>

        {/* Quote */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1rem 1.25rem', borderLeft: '3px solid #7c3aed' }}>
          <p style={{ fontSize: '0.88rem', color: 'rgba(160,157,192,0.85)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>"{quote}"</p>
        </div>
      </div>

      {/* Today's progress */}
      <div style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#f1f0ff' }}>
            Today's Missions
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.1rem', color: dayProgress === 100 ? '#22d3ee' : '#a78bfa' }}>
            {completedCount}/{totalMissions} {dayProgress === 100 ? '✓' : ''}
          </div>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden', marginBottom: '1.25rem' }}>
          <div style={{ height: '100%', width: `${dayProgress}%`, background: 'linear-gradient(90deg,#7c3aed,#0ea5e9)', borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {missions.map((mission, i) => {
            const done = completedToday.includes(mission.title);
            return (
              <div key={i} onClick={() => toggleMission(mission.title, mission.xp)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  background: done ? 'rgba(34,211,238,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${done ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 12, padding: '0.85rem 1rem', cursor: 'pointer',
                  transition: 'all 0.2s', opacity: done ? 0.75 : 1,
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: done ? 'linear-gradient(135deg,#7c3aed,#0ea5e9)' : 'transparent',
                  border: `2px solid ${done ? 'transparent' : 'rgba(139,92,246,0.4)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', color: 'white', transition: 'all 0.2s',
                }}>{done ? '✓' : ''}</div>
                <span style={{ flex: 1, fontSize: '0.88rem', color: done ? 'rgba(160,157,192,0.6)' : '#f1f0ff', textDecoration: done ? 'line-through' : 'none', transition: 'all 0.2s' }}>{mission.title}</span>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: done ? '#22d3ee' : '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '0.15rem 0.55rem', borderRadius: 99, whiteSpace: 'nowrap' }}>+{mission.xp} XP</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone progress */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#f1f0ff', marginBottom: '1.25rem', fontSize: '0.95rem' }}>🗺️ Your Journey Map</div>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, left: '7%', right: '7%', height: 2, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ position: 'absolute', top: 16, left: '7%', height: 2, width: `${Math.min(100, (day / 90) * 100)}%`, background: 'linear-gradient(90deg,#7c3aed,#0ea5e9)', transition: 'width 0.5s ease' }} />
          {MILESTONES.map((m) => {
            const reached = day >= m.day;
            const current = day >= m.day && (MILESTONES.find(x => x.day > day) ? true : m.day === 90);
            return (
              <div key={m.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: reached ? 'linear-gradient(135deg,#7c3aed,#0ea5e9)' : 'rgba(255,255,255,0.06)', border: `2px solid ${reached ? 'transparent' : 'rgba(255,255,255,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', boxShadow: reached ? '0 0 12px rgba(139,92,246,0.5)' : 'none', marginBottom: '0.4rem' }}>{m.icon}</div>
                <div style={{ fontSize: '0.6rem', color: reached ? '#a78bfa' : 'rgba(160,157,192,0.4)', fontWeight: 600, textAlign: 'center' }}>{m.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Life scores */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem' }}>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, color: '#f1f0ff', marginBottom: '1rem', fontSize: '0.95rem' }}>📊 Life Score Dashboard</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {Object.entries(userProfile.lifeScores).map(([key, val]) => (
            <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '0.75rem 1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(160,157,192,0.7)', textTransform: 'capitalize' }}>{key}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a78bfa' }}>{val}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${val}%`, background: 'linear-gradient(90deg,#7c3aed,#0ea5e9)', borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes bounce{0%{transform:scale(1)}100%{transform:scale(1.1)}}`}</style>
    </div>
  );
}
