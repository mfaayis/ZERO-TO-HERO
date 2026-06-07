import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  userProfile: UserProfile;
  onComplete: (updates: Partial<UserProfile> & { focusArea: string; challengeId: string }) => void;
}

const FOCUS_AREAS = [
  { id: 'discipline', icon: '⚡', label: 'Build Discipline', desc: 'Wake up early, stop procrastinating, build iron routines' },
  { id: 'health',     icon: '💪', label: 'Get Fit',          desc: 'Lose weight, build muscle, eat clean, feel unstoppable' },
  { id: 'mindset',    icon: '🧠', label: 'Fix My Mindset',   desc: 'Eliminate self-doubt, build confidence and mental clarity' },
  { id: 'finance',    icon: '💰', label: 'Fix My Finances',  desc: 'Save money, kill debt, build wealth habits' },
  { id: 'career',     icon: '🚀', label: 'Level Up Career',  desc: 'Learn skills, increase income, get promoted' },
  { id: 'relationships', icon: '🤝', label: 'Better Relationships', desc: 'Communicate better, build your network, find your tribe' },
];

const CHALLENGES = [
  { id: '30-discipline', days: 30, icon: '🔥', title: '30-Day Discipline Protocol', desc: 'The hardest, most transformative challenge. Cold showers, 5AM wake-ups, zero excuses.', tag: 'Most Popular', color: 'rgba(139,92,246,0.2)' },
  { id: '21-morning',    days: 21, icon: '🌅', title: '21-Day Morning Warrior',     desc: 'Transform your mornings in 21 days. Early rising, journaling, movement — every single day.', tag: 'Best for Beginners', color: 'rgba(34,211,238,0.15)' },
  { id: '90-hero',       days: 90, icon: '🏆', title: '90-Day Zero to Hero',        desc: 'The ultimate full-life transformation. Not for the faint-hearted. For people who are SERIOUS.', tag: 'Elite', color: 'rgba(251,191,36,0.12)' },
];

const QUIZ_QUESTIONS = [
  { id: 'sleep',    q: 'What time do you usually wake up?',            opts: ['Before 6 AM 🌅', '6-8 AM ☀️', '8-10 AM 😴', 'After 10 AM 🛌'], scores: [10, 7, 4, 1] },
  { id: 'exercise', q: 'How often do you exercise?',                   opts: ['Daily 💪', '3-4x/week 🏃', '1-2x/week 🚶', 'Rarely/Never 😔'], scores: [10, 7, 4, 1] },
  { id: 'phone',    q: 'How much time on your phone daily?',            opts: ['<1 hour ✅', '1-3 hours 📱', '3-5 hours 😬', '5+ hours 😱'], scores: [10, 7, 3, 1] },
  { id: 'goals',    q: 'Do you have clear written goals?',             opts: ['Yes, detailed ✍️', 'In my head 💭', 'Kind of 🤔', 'No goals 😶'], scores: [10, 6, 3, 1] },
];

export default function Onboarding({ userProfile, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [focusArea, setFocusArea] = useState('');
  const [challenge, setChallenge] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalScore = quizAnswers.reduce((a, b) => a + b, 0);
  const baselinePercent = Math.round((totalScore / (QUIZ_QUESTIONS.length * 10)) * 100);

  function nextStep() {
    setIsAnimating(true);
    setTimeout(() => { setStep(s => s + 1); setIsAnimating(false); }, 300);
  }

  function handleQuizAnswer(score: number) {
    const updated = [...quizAnswers, score];
    setQuizAnswers(updated);
    if (updated.length < QUIZ_QUESTIONS.length) return;
    setTimeout(nextStep, 400);
  }

  function handleComplete() {
    const chosenChallenge = CHALLENGES.find(c => c.id === challenge)!;
    onComplete({
      focusArea,
      challengeId: challenge,
      lifeScores: {
        ...userProfile.lifeScores,
        discipline: Math.max(userProfile.lifeScores.discipline, baselinePercent),
      }
    });
  }

  const steps = ['focus', 'quiz', 'challenge', 'ready'];
  const progress = ((step) / (steps.length)) * 100;

  return (
    <div style={{
      minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.18) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(14,165,233,0.12) 0%, transparent 60%), #05050d',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '2rem', fontFamily: "'Inter', sans-serif",
    }}>
      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 640, marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          <span>Step {step + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#7c3aed,#4f46e5,#0ea5e9)', borderRadius: 99, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
        </div>
      </div>

      <div style={{
        width: '100%', maxWidth: 640,
        opacity: isAnimating ? 0 : 1, transform: isAnimating ? 'translateY(16px)' : 'none',
        transition: 'all 0.3s ease',
      }}>

        {/* ── STEP 0: Focus area ── */}
        {step === 0 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👋</div>
              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, letterSpacing: '-0.03em', color: '#f1f0ff', marginBottom: '0.75rem' }}>
                Welcome, {userProfile.name.split(' ')[0]}!
              </h1>
              <p style={{ color: 'rgba(160,157,192,0.9)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                You're about to start your transformation.<br />
                <strong style={{ color: '#a78bfa' }}>What's the #1 area you want to transform?</strong>
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
              {FOCUS_AREAS.map(area => (
                <button key={area.id} onClick={() => { setFocusArea(area.id); nextStep(); }}
                  style={{
                    background: focusArea === area.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${focusArea === area.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 16, padding: '1.25rem', textAlign: 'left', cursor: 'pointer',
                    transition: 'all 0.2s', color: '#f1f0ff',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = focusArea === area.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)')}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.6rem' }}>{area.icon}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{area.label}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(160,157,192,0.8)', lineHeight: 1.5 }}>{area.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Quick baseline quiz ── */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#f1f0ff', marginBottom: '0.5rem' }}>
                Your Baseline Assessment
              </h2>
              <p style={{ color: 'rgba(160,157,192,0.8)', fontSize: '0.95rem' }}>
                Question {quizAnswers.length + 1} of {QUIZ_QUESTIONS.length} — Be brutally honest.
              </p>
            </div>
            {quizAnswers.length < QUIZ_QUESTIONS.length && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '2rem' }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f1f0ff', marginBottom: '1.5rem', textAlign: 'center' }}>
                  {QUIZ_QUESTIONS[quizAnswers.length].q}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {QUIZ_QUESTIONS[quizAnswers.length].opts.map((opt, i) => (
                    <button key={i} onClick={() => handleQuizAnswer(QUIZ_QUESTIONS[quizAnswers.length].scores[i])}
                      style={{
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12, padding: '0.9rem 1.2rem', textAlign: 'left', cursor: 'pointer',
                        color: '#f1f0ff', fontSize: '0.92rem', transition: 'all 0.2s',
                        fontFamily: "'Inter', sans-serif",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                    >{opt}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Choose challenge ── */}
        {step === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
              <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 900, color: '#f1f0ff', marginBottom: '0.5rem' }}>
                Your Life Score: <span style={{ background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{baselinePercent}%</span>
              </h2>
              <p style={{ color: 'rgba(160,157,192,0.8)', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                {baselinePercent < 40 ? '⚠️ Significant room to grow — but that means massive potential gains.' : baselinePercent < 70 ? '✨ Solid foundation. Time to go from good to unstoppable.' : '🔥 Already strong. Now let\'s make you elite.'}
              </p>
              <p style={{ color: 'rgba(160,157,192,0.6)', fontSize: '0.88rem' }}>Choose your transformation challenge:</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {CHALLENGES.map(ch => (
                <button key={ch.id} onClick={() => { setChallenge(ch.id); nextStep(); }}
                  style={{
                    background: ch.color, border: `1px solid ${challenge === ch.id ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 18, padding: '1.5rem', textAlign: 'left', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '1.25rem', transition: 'all 0.2s', color: '#f1f0ff',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>{ch.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: '1.05rem' }}>{ch.title}</span>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, background: 'rgba(139,92,246,0.25)', border: '1px solid rgba(139,92,246,0.35)', borderRadius: 99, padding: '0.15rem 0.6rem', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ch.tag}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(160,157,192,0.85)', lineHeight: 1.6 }}>{ch.desc}</div>
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: '1.8rem', color: '#a78bfa', flexShrink: 0 }}>{ch.days}d</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Ready! ── */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 0.6s ease' }}>🚀</div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, color: '#f1f0ff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              You're <span style={{ background: 'linear-gradient(135deg,#a78bfa,#818cf8,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Ready.</span>
            </h2>
            <p style={{ color: 'rgba(160,157,192,0.85)', fontSize: '1.05rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 480, margin: '0 auto 2.5rem' }}>
              Your <strong style={{ color: '#a78bfa' }}>{CHALLENGES.find(c => c.id === challenge)?.days}-day transformation</strong> begins today.
              Your missions are waiting. The version of you that you dream of being — it starts <em>right now.</em>
            </p>

            {/* Day 1 preview */}
            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>⚡ Day 1 Missions</div>
              {['Wake up on time — no snooze', 'Drink 500ml water immediately', 'Write 3 things you want to achieve', '15 min of movement (walk/workout)', 'No social media before 9AM'].map((task, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(139,92,246,0.4)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.88rem', color: 'rgba(160,157,192,0.9)' }}>{task}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', fontWeight: 700, color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '0.1rem 0.5rem', borderRadius: 99 }}>+10 XP</span>
                </div>
              ))}
            </div>

            <button onClick={handleComplete}
              style={{
                background: 'linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9)',
                border: 'none', borderRadius: 99, padding: '1.1rem 3rem',
                fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1.05rem',
                color: 'white', cursor: 'pointer', width: '100%',
                boxShadow: '0 0 40px rgba(139,92,246,0.5)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
            >
              Begin My Transformation →
            </button>
            <p style={{ fontSize: '0.75rem', color: 'rgba(160,157,192,0.5)', marginTop: '1rem' }}>Everything is free. No credit card. No excuses.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}`}</style>
    </div>
  );
}
