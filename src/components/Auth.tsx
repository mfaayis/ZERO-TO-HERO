/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

interface AuthProps {
  onAuthSuccess: (email: string, name: string, isPremium: boolean, focusArea?: string) => void;
  onBackToHome: () => void;
  defaultPlan?: string;
}

const FOCUS_AREAS = [
  { id: "discipline", label: "⚡", name: "Discipline",    desc: "Build iron routines" },
  { id: "health",     label: "💪", name: "Get Fit",       desc: "Transform your body" },
  { id: "mindset",    label: "🧠", name: "Mindset",       desc: "Fix your thinking" },
  { id: "finance",    label: "💰", name: "Finances",      desc: "Build wealth habits" },
  { id: "career",     label: "🚀", name: "Career",        desc: "Level up your skills" },
  { id: "relationships", label: "🤝", name: "Connections", desc: "Build your network" },
];

export default function Auth({ onAuthSuccess, onBackToHome }: AuthProps) {
  const [focusArea, setFocusArea]   = useState("discipline");
  const [name, setName]             = useState("");
  const [loading, setLoading]       = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [nameError, setNameError]   = useState("");
  const [showNameForm, setShowNameForm] = useState(false);

  // ── Google Sign-In ──────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setGoogleError("");
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const user = cred.user;
      onAuthSuccess(
        user.email || "",
        user.displayName || user.email?.split("@")[0] || "Hero",
        true,
        focusArea
      );
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/configuration-not-found" || err.code === "auth/operation-not-allowed") {
        setGoogleError("Google Sign-In isn't enabled yet in Firebase Console. Use your name below instead.");
        setShowNameForm(true);
      } else if (err.code === "auth/popup-closed-by-user") {
        setGoogleError("Sign-in cancelled. Try again.");
      } else {
        setGoogleError("Something went wrong. Try again or use your name below.");
        setShowNameForm(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Name-only fallback ──────────────────────────────────────────
  const handleNameStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setNameError("Enter your name to begin."); return; }
    setLoading(true);
    setTimeout(() => {
      onAuthSuccess(`${name.toLowerCase().replace(/\s+/g, "")}@limitless.app`, name.trim(), true, focusArea);
    }, 500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 30% 20%, rgba(124,58,237,0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(14,165,233,0.12) 0%, transparent 60%), #05050d",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "2rem", fontFamily: "'Inter', sans-serif",
    }}>
      <button onClick={onBackToHome} style={{
        position: "absolute", top: "1.5rem", left: "1.5rem",
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 99, padding: "0.45rem 1rem", color: "rgba(160,157,192,0.8)",
        fontSize: "0.78rem", cursor: "pointer",
      }}>← Back</button>

      <div style={{ width: "100%", maxWidth: 480 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>⚡</div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(1.8rem,5vw,2.5rem)",
            fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f0ff",
            marginBottom: "0.4rem", lineHeight: 1.1,
          }}>
            Start Your <span style={{ background: "linear-gradient(135deg,#a78bfa,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Transformation</span>
          </h1>
          <p style={{ color: "rgba(160,157,192,0.7)", fontSize: "0.9rem" }}>
            Free forever. No credit card. No excuses.
          </p>
        </div>

        {/* Focus Area Picker */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.6rem" }}>
            What do you want to transform?
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
            {FOCUS_AREAS.map(f => (
              <button key={f.id} type="button" onClick={() => setFocusArea(f.id)}
                style={{
                  background: focusArea === f.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${focusArea === f.id ? "rgba(139,92,246,0.55)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, padding: "0.7rem 0.4rem", textAlign: "center",
                  cursor: "pointer", transition: "all 0.2s", color: "#f1f0ff",
                }}>
                <div style={{ fontSize: "1.3rem", marginBottom: "0.2rem" }}>{f.label}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: focusArea === f.id ? "#a78bfa" : "rgba(160,157,192,0.85)" }}>{f.name}</div>
                <div style={{ fontSize: "0.6rem", color: "rgba(160,157,192,0.45)", marginTop: "0.1rem" }}>{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Google Sign-In — Primary */}
        <button onClick={handleGoogleLogin} disabled={loading}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem",
            background: loading ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14,
            padding: "0.95rem", cursor: loading ? "not-allowed" : "pointer",
            color: "#f1f0ff", fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "1rem",
            transition: "all 0.2s", marginBottom: "0.75rem",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
        >
          {loading ? (
            <div style={{ width: 22, height: 22, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          ) : (
            <>
              {/* Google logo SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        {googleError && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "0.65rem 1rem", marginBottom: "0.75rem", fontSize: "0.78rem", color: "#fca5a5", lineHeight: 1.5 }}>
            {googleError}
          </div>
        )}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{ fontSize: "0.7rem", color: "rgba(160,157,192,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Name-only form */}
        <form onSubmit={handleNameStart} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div>
            <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(167,139,250,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.45rem" }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(""); }}
              placeholder="e.g. Fayis"
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)",
                border: `1px solid ${nameError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 12, padding: "0.85rem 1.1rem", color: "#f1f0ff",
                fontSize: "0.95rem", fontFamily: "'Inter', sans-serif", outline: "none",
                boxSizing: "border-box" as const, transition: "border-color 0.2s",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = nameError ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)")}
            />
            {nameError && <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.3rem" }}>{nameError}</p>}
          </div>
          <button type="submit" disabled={loading}
            style={{
              background: "linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9)",
              border: "none", borderRadius: 99, padding: "1rem",
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1rem",
              color: "white", cursor: loading ? "not-allowed" : "pointer", width: "100%",
              boxShadow: "0 0 30px rgba(139,92,246,0.35)", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}
          >
            {loading
              ? <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              : "Begin My Transformation →"
            }
          </button>
          <p style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(160,157,192,0.4)", marginTop: "-0.1rem" }}>
            No signup. No password. Just start. 🚀
          </p>
        </form>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
