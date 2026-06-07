/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, ChevronRight, Check, Star, Target, Flame, Brain, Users, Award, Shield, Gift } from "lucide-react";

interface HomepageProps {
  onStart: (planSelected?: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export default function Homepage({ onStart, onNavigateToTab }: HomepageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-indigo-400" />,
      title: "AI Coach & Counselor",
      description: "Receive 24/7 personalized feedback, study schedules, workout logs, and journal breakdown analysis.",
    },
    {
      icon: <Flame className="w-6 h-6 text-amber-500" />,
      title: "Gamified Habits Tracker",
      description: "Tick daily actions off, maintain critical streaks, grow XP multipliers, and level up your character.",
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: "Dynamic Goal Mapping",
      description: "Deconstruct major life achievements into micro milestones with responsive completion tracking bars.",
    },
    {
      icon: <Award className="w-6 h-6 text-cyan-400" />,
      title: "Achievement Recognition",
      description: "Earn custom high-fidelity badges for specific triggers like 7-Day streaks and savings thresholds.",
    },
    {
      icon: <Users className="w-6 h-6 text-violet-400" />,
      title: "Simulated Peer Community",
      description: "Share victories on a global board, like status posts, leave comments, and track companion achievements.",
    },
    {
      icon: <Shield className="w-6 h-6 text-pink-400" />,
      title: "Cognitive Mood Analytics",
      description: "Map psychological moods over time to understand correlation with discipline and work streaks.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Establish Your Baseline",
      desc: "Register a profile and answer a standard brief life score assessment regarding money, discipline, and energy.",
    },
    {
      num: "02",
      title: "Map Visionary Objectives",
      desc: "Outline specific goals (e.g. Code project, Weight target) and partition them into milestone increments.",
    },
    {
      num: "03",
      title: "Receive Gemini AI Protocols",
      desc: "The coach computes a weekly recommendation vector matching your target schedule and current scores.",
    },
    {
      num: "04",
      title: "Secure Daily Milestones",
      desc: "Check off items in your checklist, complete habits, report mood variables, and bank continuous game XP.",
    },
    {
      num: "05",
      title: "Ascend Zero to Hero",
      desc: "Unlock master level statuses, claim elite badges, and build indestructible lifestyle discipline.",
    },
  ];

  const pricingPlans = [
    {
      name: "Free Plan",
      price: "₹0",
      description: "Standard self-guided transformation metrics.",
      features: [
        "Interactive Daily Checklist",
        "Habit Tracking Engine (Standard)",
        "Goals Planner (Up to 3 Active)",
        "Monthly Progress Statistics",
        "Simulated Community social feed",
        "Simple XP Level System",
      ],
      cta: "Activate Free Tier",
      popular: false,
      tierId: "free"
    },
    {
      name: "Premium Plan",
      price: billingCycle === "monthly" ? "₹299" : "₹199",
      period: "/month",
      description: "Uncapped brain-power for accelerated growth.",
      features: [
        "Unlimited Gemini AI Coaching (24/7 Chat)",
        "Advanced Interactive bento dashboards",
        "Custom AI Transformation recommendations",
        "Infinite Active Goals & Recurring tasks",
        "Deep journal cognitive analysis",
        "Exclusive premium group challenges",
        "Double XP points multipliers!",
      ],
      cta: "Unlock Hero Potential",
      popular: true,
      tierId: "premium"
    },
    {
      name: "Enterprise Elite",
      price: billingCycle === "monthly" ? "₹799" : "₹549",
      period: "/month",
      description: "Designed for leaders, builders, and elite players.",
      features: [
        "Everything in Premium Tier",
        "Professional Human-AI hybrid check-ins",
        "Full workspace organization planners",
        "Custom corporate discipline reports",
        "Instant unlock of all historic badges",
        "1-on-1 performance audit protocols",
      ],
      cta: "Secure Elite Credentials",
      popular: false,
      tierId: "enterprise"
    }
  ];

  const testimonials = [
    {
      text: "Zero to Hero changed my life. I went from snoozing my alarm to run-routines and coding 3 hours a day. The XP levels make it feel like my favorite game.",
      author: "Rahul S.",
      role: "Software Developer, Level 5 Champion",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
    },
    {
      text: "The AI Coach workout plans are so precise. I actually look forward to journaling because the Gemini recap summarizes my emotional energy and prompts great reflections.",
      author: "Priya M.",
      role: "Digital Artist, Level 4 Warrior",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
    },
    {
      text: "As a student, staying organized on finance and study goals was chaos. The milestones layout broke down my anxiety. Claiming badges feels so rewarding!",
      author: "Karthik K.",
      role: "Undergrad Student, Level 3 Disciplined",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-slate-950 text-slate-100 min-h-screen">
      {/* Background radial overlays */}
      <div className="absolute top-0 left-1/4 -translate-x-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" id="bg-radial-1"></div>
      <div className="absolute top-1/2 right-1/4 translate-x-12 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" id="bg-radial-2"></div>

      {/* Hero Container */}
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 text-center relative z-10" id="hero-sec">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-500/30 rounded-full text-indigo-300 text-sm mb-6 animate-pulse" id="pinnacle-badge">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Level Up Your Life, Instantly</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight font-display text-white max-w-4xl mx-auto leading-tight" id="hero-heading">
          Become the Best <br/>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Version of Yourself.
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed" id="hero-p">
          Track habits, achieve goals, build discipline, and transform your life with a game-like XP engine and personalized AI Coaching.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4" id="hero-btns">
          <button
            onClick={() => onStart("premium")}
            id="btn-start-free"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            Start Free
            <ChevronRight className="w-5 h-5" />
          </button>
          <a
            href="#features-sec"
            id="btn-learn-more"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Learn More
          </a>
        </div>

        {/* Floating preview card mimicking game board */}
        <div className="mt-16 border border-slate-800 bg-slate-900/60 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto shadow-2xl backdrop-blur-sm" id="game-preview-widget">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4" id="preview-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 flex items-center justify-center rounded-lg font-mono font-bold text-lg">Z</div>
              <div className="text-left">
                <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Active Character</p>
                <h3 className="font-semibold text-white">Hero Challenger</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <div>STREAK: <span className="text-amber-400 font-bold">★ 7 DAYS</span></div>
              <div className="text-slate-600">|</div>
              <div>LIFE SCORE: <span className="text-emerald-400 font-bold">84 / 100</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-left" id="preview-body">
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">Today's Missions</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300 line-through">Complete 30M Cardio <span className="text-indigo-400 text-xs font-mono">+20 XP</span></span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300 line-through">Read 10 pages of Philosophy <span className="text-indigo-400 text-xs font-mono">+10 XP</span></span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
                  <div className="w-4 h-4 border border-slate-700 rounded mr-0.5"></div>
                  <span className="text-sm text-slate-200">Study TypeScript coding rules <span className="text-indigo-400 text-xs font-mono">+15 XP</span></span>
                </div>
              </div>
            </div>
            <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/85">
              <p className="text-xs font-mono text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                Coach recommendation
              </p>
              <p className="text-sm text-slate-300 leading-relaxed font-sans italic">
                \"Excellent consistency this week. Your discipline rating increased to 88%! Focus on small financial metrics today: tracking your daily expense takes only 2 minutes and levels up your Finance score!\"
              </p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-500">Gemini AI Coach</span>
                <span className="text-indigo-400 font-mono hover:underline cursor-pointer" onClick={() => onStart("premium")}>Talk to Coach &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Bento Grid */}
      <section className="py-24 bg-slate-950 relative z-10 border-t border-slate-900" id="features-sec">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest font-mono text-indigo-400">Tactical Modules</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white mt-2">
            The Complete Transformation Engine
          </h2>
          <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
            Zero to Hero fuses gamified checklist progression with real-time AI mentoring tools to target every spectrum of self-discipline.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16" id="features-grid">
            {features.map((feat, idx) => (
              <div
                key={idx}
                id={`feature-card-${idx}`}
                className="bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all p-8 rounded-2xl text-left shadow-lg group hover:-translate-y-1 transform duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:bg-indigo-950 group-hover:border-indigo-800 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold font-display text-white mt-6">{feat.title}</h3>
                <p className="text-slate-400 mt-2 font-sans text-sm leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Stepper */}
      <section className="py-24 bg-slate-900/50 relative z-10 border-t border-slate-900" id="how-it-works-sec">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest font-mono text-indigo-400">The Blueprint</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white mt-2">
              Your Path to Level 10 Hero
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
              Follow this step-by-step roadmap to override bad habits and establish structured daily output.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-12 items-stretch" id="how-steps">
            {steps.map((st, idx) => (
              <div key={idx} id={`step-item-${idx}`} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
                <div>
                  <div className="text-4xl font-extrabold font-mono text-slate-800 mb-4">{st.num}</div>
                  <h4 className="text-lg font-bold text-white mb-2 font-display">{st.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">{st.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-indigo-500/30 z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Testimonials */}
      <section className="py-24 bg-slate-950 relative z-10 border-t border-slate-900" id="testimonials-sec">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest font-mono text-indigo-400">True Accounts</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white mt-2">
              Real Heroes. Real Journeys.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="testimonials-grid">
            {testimonials.map((test, idx) => (
              <div key={idx} id={`testimonial-${idx}`} className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800 relative flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 font-sans italic text-sm leading-relaxed">
                    "{test.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-800">
                  <img src={test.avatar} alt={test.author} className="w-10 h-10 rounded-full object-cover border border-slate-700" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-bold text-white text-sm">{test.author}</h5>
                    <p className="text-xs text-indigo-400 font-mono">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Tier Pricing Tables */}
      <section className="py-24 bg-slate-900/30 relative z-10 border-t border-slate-900" id="pricing-sec">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest font-mono text-indigo-400">Pricing Models</p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white mt-2">
            The Right Frequency For Your Goals
          </h2>
          
          {/* Billing SwitcherToggle */}
          <div className="mt-8 inline-flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800" id="billing-switcher">
            <button
              onClick={() => setBillingCycle("monthly")}
              id="billing-monthly"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              id="billing-yearly"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${billingCycle === "yearly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              Yearly Saving
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-md font-mono">SAVE 33%</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 max-w-5xl mx-auto items-stretch" id="pricing-cards">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                id={`pricing-plan-${plan.tierId}`}
                className={`bg-slate-950 p-8 rounded-3xl border text-left relative flex flex-col justify-between ${plan.popular ? "border-indigo-500 shadow-xl shadow-indigo-600/10 scale-105 z-10" : "border-slate-800"}`}
              >
                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full font-mono flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3 h-3" /> MOST POPULAR
                  </span>
                )}
                
                <div>
                  <h4 className="text-xl font-bold text-white font-display mb-1">{plan.name}</h4>
                  <p className="text-sm text-slate-400 mb-6 font-sans">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1.5 text-white mb-6">
                    <span className="text-4xl font-extrabold font-mono tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 font-sans text-sm">{plan.period}</span>}
                  </div>
                  
                  <div className="border-t border-slate-900 pt-6 mb-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-sm font-sans text-slate-300">
                          <Check className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onStart(plan.tierId)}
                  id={`cta-btn-${plan.tierId}`}
                  className={`w-full py-3.5 px-4 font-semibold rounded-xl text-center transition-all cursor-pointer ${plan.popular ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md" : "bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"}`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer block */}
      <footer className="py-12 bg-slate-950 border-t border-slate-900 relative z-20 text-center" id="foot-landing">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold font-display bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Zero to Hero</span>
          </div>
          <p className="text-sm text-slate-500">
            &copy; 2026 Zero to Hero Inc. Powered by Gemini Core and React. Absolute craftsmanship.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="hover:underline cursor-pointer" onClick={() => onNavigateToTab("terms")}>Terms of Protocol</span>
            <span>&bull;</span>
            <span className="hover:underline cursor-pointer" onClick={() => onNavigateToTab("privacy")}>Privacy Matrix</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
