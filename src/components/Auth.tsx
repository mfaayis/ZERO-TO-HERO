/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";

interface AuthProps {
  onAuthSuccess: (email: string, name: string, isPremium: boolean, focusArea?: string) => void;
  onBackToHome: () => void;
  defaultPlan?: string;
}

const FOCUS_AREAS = [
  { id: "discipline", label: "⚡ Discipline",   desc: "Build iron routines" },
  { id: "health",     label: "💪 Get Fit",       desc: "Transform your body" },
  { id: "mindset",    label: "🧠 Mindset",       desc: "Fix your thinking" },
  { id: "finance",    label: "💰 Finances",      desc: "Build wealth habits" },
  { id: "career",     label: "🚀 Career",        desc: "Level up your skills" },
  { id: "relationships", label: "🤝 Connections", desc: "Build your network" },
];

export default function Auth({ onAuthSuccess, onBackToHome }: AuthProps) {
  const [name, setName]           = useState("");
  const [focusArea, setFocusArea] = useState("discipline");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name to begin."); return; }
    setLoading(true);
    // Small delay for feel
    setTimeout(() => {
      onAuthSuccess(`${name.toLowerCase().replace(/\s+/g, "")}@limitless.app`, name.trim(), true, focusArea);
    }, 600);
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
        fontSize: "0.78rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
      }}>← Back</button>

      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>⚡</div>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontSize: "clamp(2rem,5vw,2.8rem)",
            fontWeight: 900, letterSpacing: "-0.03em", color: "#f1f0ff",
            marginBottom: "0.5rem", lineHeight: 1.1,
          }}>
            Start Your<br />
            <span style={{ background: "linear-gradient(135deg,#a78bfa,#818cf8,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Transformation
            </span>
          </h1>
          <p style={{ color: "rgba(160,157,192,0.75)", fontSize: "0.95rem" }}>
            Free forever. No credit card. No excuses.
          </p>
        </div>

        <form onSubmit={handleStart} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Name input */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(167,139,250,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.5rem" }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              placeholder="e.g. Fayis"
              autoFocus
              style={{
                width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 14, padding: "0.95rem 1.25rem", color: "#f1f0ff",
                fontSize: "1.05rem", fontFamily: "'Inter', sans-serif", outline: "none",
                transition: "border-color 0.2s", boxSizing: "border-box",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "rgba(139,92,246,0.6)")}
              onBlur={e => (e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)")}
            />
            {error && <p style={{ color: "#f87171", fontSize: "0.78rem", marginTop: "0.4rem" }}>{error}</p>}
          </div>

          {/* Focus area */}
          <div>
            <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "rgba(167,139,250,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.75rem" }}>
              What do you want to transform first?
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
              {FOCUS_AREAS.map(f => (
                <button key={f.id} type="button" onClick={() => setFocusArea(f.id)}
                  style={{
                    background: focusArea === f.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${focusArea === f.id ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 12, padding: "0.75rem 0.5rem", textAlign: "center",
                    cursor: "pointer", transition: "all 0.2s", color: "#f1f0ff",
                  }}>
                  <div style={{ fontSize: "1.2rem", marginBottom: "0.2rem" }}>{f.label.split(" ")[0]}</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: focusArea === f.id ? "#a78bfa" : "rgba(160,157,192,0.8)" }}>
                    {f.label.split(" ").slice(1).join(" ")}
                  </div>
                  <div style={{ fontSize: "0.63rem", color: "rgba(160,157,192,0.5)", marginTop: "0.1rem" }}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            style={{
              background: loading ? "rgba(139,92,246,0.4)" : "linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9)",
              border: "none", borderRadius: 99, padding: "1.1rem",
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.05rem",
              color: "white", cursor: loading ? "not-allowed" : "pointer", width: "100%",
              boxShadow: "0 0 40px rgba(139,92,246,0.4)", transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "none")}
          >
            {loading ? (
              <div style={{ width: 20, height: 20, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            ) : (
              <>"Begin My Transformation →"</>
            )}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(160,157,192,0.4)", marginTop: "-0.25rem" }}>
            No signup. No password. Just start. 🚀
          </p>
        </form>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
