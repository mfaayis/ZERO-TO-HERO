/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  updateProfile,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider, githubProvider } from "../firebase";
import { Mail, Lock, User, Sparkles, ChevronRight, CheckCircle2, Shield, ArrowLeft, Github } from "lucide-react";

interface AuthProps {
  onAuthSuccess: (email: string, name: string, isPremium: boolean, focusArea?: string) => void;
  onBackToHome: () => void;
  defaultPlan?: string;
}

// Map Firebase error codes to friendly messages
function firebaseErrorMessage(err: AuthError): string {
  switch (err.code) {
    case "auth/email-already-in-use":      return "An account with this email already exists. Try signing in instead.";
    case "auth/invalid-email":             return "Please enter a valid email address.";
    case "auth/weak-password":             return "Password must be at least 6 characters.";
    case "auth/user-not-found":            return "No account found with this email. Register first!";
    case "auth/wrong-password":
    case "auth/invalid-credential":        return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests":         return "Too many attempts. Please wait a moment and try again.";
    case "auth/popup-closed-by-user":      return "Sign-in cancelled. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with a different sign-in method for this email.";
    default:
      return err.message || "Authentication failed. Please try again.";
  }
}

export default function Auth({ onAuthSuccess, onBackToHome, defaultPlan }: AuthProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("register");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [focusArea, setFocusArea] = useState("discipline");
  const [loading, setLoading]   = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const isPremium = defaultPlan === "premium" || defaultPlan === "enterprise";

  // ── Email / Password ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        if (!email) { setErrorStatus("Please enter your email address."); setLoading(false); return; }
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
        setLoading(false);
        return;
      }

      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Attach display name to Firebase profile
        if (name) {
          await updateProfile(cred.user, { displayName: name });
        }
        onAuthSuccess(cred.user.email!, name || email.split("@")[0], isPremium, focusArea);
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(
          cred.user.email!,
          cred.user.displayName || email.split("@")[0],
          isPremium,
          focusArea
        );
      }
    } catch (err: any) {
      setErrorStatus(firebaseErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
  };

  // ── Google Sign-In ──────────────────────────────────────────────────────────
  const handleGoogleLogin = async () => {
    setErrorStatus("");
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      onAuthSuccess(
        cred.user.email!,
        cred.user.displayName || "Hero",
        isPremium,
        focusArea
      );
    } catch (err: any) {
      setErrorStatus(firebaseErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
  };

  // ── GitHub Sign-In ──────────────────────────────────────────────────────────
  const handleGitHubLogin = async () => {
    setErrorStatus("");
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, githubProvider);
      onAuthSuccess(
        cred.user.email || `${cred.user.displayName}@github`,
        cred.user.displayName || "Hero",
        isPremium,
        focusArea
      );
    } catch (err: any) {
      setErrorStatus(firebaseErrorMessage(err as AuthError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white mb-6 uppercase tracking-wider font-mono cursor-pointer"
          id="btn-back-home-auth"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white font-display flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Zero to Hero</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            {mode === "login"   && "Sign back in to continue your self-mastery journey."}
            {mode === "register" && "Unlock your full-scale lifestyle transformation protocol."}
            {mode === "forgot"  && "Recover your game progression credential safely."}
          </p>
        </div>

        {errorStatus && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-xl mb-6 text-center">
            {errorStatus}
          </div>
        )}

        {mode === "forgot" && resetSent ? (
          <div className="text-center py-6" id="reset-success-box">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">Reset Email Sent</h4>
            <p className="text-sm text-slate-400">
              A password reset link was sent to <span className="text-indigo-400">{email}</span>. Check your inbox.
            </p>
            <button
              onClick={() => { setMode("login"); setResetSent(false); }}
              className="mt-6 text-sm text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono"
            >
              Back to Login Gate &rarr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" id="auth-form-control">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Hero Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Rivers"
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-white pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="auth-input-name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-white pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  id="auth-input-email"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">Secret Password</label>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-[11px] text-indigo-400 hover:underline font-mono"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 text-white pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    id="auth-input-pwd"
                  />
                </div>
              </div>
            )}

            {mode === "register" && (
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Prime Development Goal Area</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "health",     label: "Health & Fitness",     color: "border-emerald-500/20 hover:border-emerald-500/50" },
                    { id: "discipline", label: "Discipline Building",   color: "border-indigo-500/20 hover:border-indigo-500/50" },
                    { id: "finance",    label: "Financial Mastery",     color: "border-amber-500/20 hover:border-amber-500/50" },
                    { id: "career",     label: "Career & Tech Work",    color: "border-sky-500/20 hover:border-sky-500/50" },
                    { id: "learning",   label: "Skill & Reading",       color: "border-cyan-500/20 hover:border-cyan-500/50" },
                    { id: "mindset",    label: "Mindset & Zen Focus",   color: "border-pink-500/20 hover:border-pink-500/50" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFocusArea(f.id)}
                      className={`py-2 px-3 border rounded-xl text-left font-sans transition-all cursor-pointer ${
                        focusArea === f.id
                          ? "bg-indigo-600/20 border-indigo-500 text-white"
                          : "bg-slate-950/60 text-slate-400 " + f.color
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="auth-btn-action"
              className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login"    && "Resume Protocol"}
                  {mode === "register" && "Unlock Protocol"}
                  {mode === "forgot"   && "Transmit Recovery Pin"}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {mode !== "forgot" && (
              <>
                <div className="relative my-6 text-center">
                  <hr className="border-slate-800" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-slate-500 font-mono text-[10px] uppercase tracking-widest">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    id="auth-btn-google"
                    className="py-3 bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600 hover:bg-slate-900 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.18 1.21 15.42 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z" />
                    </svg>
                    Google
                  </button>

                  {/* GitHub */}
                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    disabled={loading}
                    id="auth-btn-github"
                    className="py-3 bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-600 hover:bg-slate-900 rounded-xl font-medium text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </button>
                </div>
              </>
            )}

            <div className="text-center mt-6 text-xs text-slate-400 font-sans" id="auth-switch-prompt">
              {mode === "login" && (
                <p>
                  New champion here?{" "}
                  <button type="button" onClick={() => setMode("register")} className="text-indigo-400 font-bold hover:underline font-mono">
                    Register Account
                  </button>
                </p>
              )}
              {mode === "register" && (
                <p>
                  Already initialized?{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-indigo-400 font-bold hover:underline font-mono">
                    Sign In Instead
                  </button>
                </p>
              )}
              {mode === "forgot" && (
                <button type="button" onClick={() => setMode("login")} className="text-indigo-400 font-bold hover:underline font-mono">
                  Return to Login
                </button>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3 text-xs text-slate-500 font-mono">
        <Shield className="w-3.5 h-3.5 text-indigo-500" />
        <span>Secured by Firebase Authentication</span>
      </div>
    </div>
  );
}
