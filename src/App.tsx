import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, Compass, MessageSquare, BookOpen, Smile, Award, 
  User as UserIcon, LogOut, Sparkles, AlertCircle, Eye, EyeOff, ShieldCheck
} from "lucide-react";

import { User, ChatSession, JournalEntry, MoodEntry, RelationshipGoal, AttachmentStyle } from "./types";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Assessment from "./components/Assessment";
import CoachChat from "./components/CoachChat";
import Journal from "./components/Journal";
import MoodTracker from "./components/MoodTracker";
import Goals from "./components/Goals";
import Profile from "./components/Profile";

export default function App() {
  // Session / Session persistence states
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [activeTab, setActiveTab] = useState<string>("landing");

  // Input states for login form
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Application database storage (Client-side localStorage synced state)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [goals, setGoals] = useState<RelationshipGoal[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // Load state on mount
  useEffect(() => {
    const cachedUser = localStorage.getItem("eunoia_user");
    if (cachedUser) {
      const parsed = JSON.parse(cachedUser);
      setUser(parsed);
      setActiveTab(parsed.attachmentStyle ? "dashboard" : "assessment");
    }

    const cachedChats = localStorage.getItem("eunoia_chats");
    if (cachedChats) setChatSessions(JSON.parse(cachedChats));

    const cachedJournals = localStorage.getItem("eunoia_journals");
    if (cachedJournals) setJournalEntries(JSON.parse(cachedJournals));

    const cachedMoods = localStorage.getItem("eunoia_moods");
    if (cachedMoods) setMoodEntries(JSON.parse(cachedMoods));

    const cachedGoals = localStorage.getItem("eunoia_goals");
    if (cachedGoals) setGoals(JSON.parse(cachedGoals));
  }, []);

  // Save utility triggers
  const saveUser = (updatedUser: User | null) => {
    setUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem("eunoia_user", JSON.stringify(updatedUser));
    } else {
      localStorage.removeItem("eunoia_user");
    }
  };

  const handleSaveChats = (updated: ChatSession[]) => {
    setChatSessions(updated);
    localStorage.setItem("eunoia_chats", JSON.stringify(updated));
  };

  const handleSaveJournals = (updated: JournalEntry[]) => {
    setJournalEntries(updated);
    localStorage.setItem("eunoia_journals", JSON.stringify(updated));
  };

  const handleSaveMoods = (updated: MoodEntry[]) => {
    setMoodEntries(updated);
    localStorage.setItem("eunoia_moods", JSON.stringify(updated));
  };

  const handleSaveGoals = (updated: RelationshipGoal[]) => {
    setGoals(updated);
    localStorage.setItem("eunoia_goals", JSON.stringify(updated));
  };

  // REST API simulated JWT handling with offline fallback
  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please fill out all required fields.");
      return;
    }
    setAuthError("");
    setAuthLoading(true);

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = authMode === "login" 
        ? { email: authEmail, password: authPassword }
        : { email: authEmail, password: authPassword, name: authName };

      let authenticatedUser: User;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          authenticatedUser = {
            email: authEmail,
            name: authMode === "login" ? (data.user?.name || authEmail.split("@")[0]) : authName,
            attachmentStyle: undefined,
            relationshipStatus: "Single",
            primaryGoal: "Improve connection intimacy"
          };
        } else {
          const errData = await response.json().catch(() => null);
          if (response.status < 500 && errData?.error) {
            throw new Error(errData.error);
          }
          // Server error or cold start fallback: log in locally
          authenticatedUser = {
            email: authEmail,
            name: authMode === "login" ? authEmail.split("@")[0] : authName,
            attachmentStyle: undefined,
            relationshipStatus: "Single",
            primaryGoal: "Improve connection intimacy"
          };
        }
      } catch (networkErr: any) {
        if (networkErr.message && !networkErr.message.includes("fetch")) {
          throw networkErr;
        }
        // Offline / network failure fallback
        authenticatedUser = {
          email: authEmail,
          name: authMode === "login" ? authEmail.split("@")[0] : authName,
          attachmentStyle: undefined,
          relationshipStatus: "Single",
          primaryGoal: "Improve connection intimacy"
        };
      }

      saveUser(authenticatedUser);
      setShowAuthModal(false);
      
      // Determine if they need assessment
      setActiveTab("assessment");
    } catch (err: any) {
      setAuthError(err.message || "Credential verification failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAssessmentComplete = (result: {
    attachmentStyle: AttachmentStyle;
    communicationStyle: string;
    conflictStyle: string;
    goals: string[];
  }) => {
    if (!user) return;
    const updated: User = {
      ...user,
      attachmentStyle: result.attachmentStyle,
      relationshipStatus: user.relationshipStatus || "In a relationship",
      primaryGoal: result.conflictStyle
    };
    saveUser(updated);

    // Bootstrap initial relationship goals
    const initialGoals: RelationshipGoal[] = result.goals.map((g, idx) => ({
      id: `goal_init_${idx}_${Date.now()}`,
      text: g,
      category: idx % 2 === 0 ? "communication" : "self-care",
      targetDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0],
      progress: 0,
      completed: false
    }));
    handleSaveGoals(initialGoals);

    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    saveUser(null);
    localStorage.removeItem("eunoia_user");
    // Optionally keep other items or clear them for standard security
    setActiveTab("landing");
  };

  const handleResetAssessment = () => {
    if (!user) return;
    const updated = { ...user, attachmentStyle: undefined };
    saveUser(updated);
    setActiveTab("assessment");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-gray-100 flex flex-col font-sans relative selection:bg-[#6B0F1A] selection:text-white">
      
      {/* Dynamic Background visual aesthetic points */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#6B0F1A]/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8E2430]/5 rounded-full blur-[150px] -z-10 pointer-events-none" />

      {/* Primary header navbar if logged in */}
      {user && activeTab !== "landing" && (
        <nav id="app-main-navbar" className="bg-[#161616] border-b border-white/5 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6B0F1A] to-[#D4A373] p-[1.5px]">
                <div className="w-full h-full bg-[#111111] rounded-full flex items-center justify-center">
                  <Heart className="w-4.5 h-4.5 text-[#D4A373]" />
                </div>
              </div>
              <div>
                <span className="text-base font-semibold tracking-wider text-white">EUNOIA</span>
                <p className="text-[8px] text-[#D4A373] tracking-widest uppercase font-mono">Relationship Coach</p>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex items-center gap-1.5 bg-[#111111] border border-white/5 p-1 rounded-full">
              {[
                { id: "dashboard", label: "Dashboard", icon: <Compass className="w-4 h-4" /> },
                { id: "chat", label: "Coach Chat", icon: <MessageSquare className="w-4 h-4" /> },
                { id: "journal", label: "Journal", icon: <BookOpen className="w-4 h-4" /> },
                { id: "mood", label: "Vibe Tracker", icon: <Smile className="w-4 h-4" /> },
                { id: "goals", label: "Goals", icon: <Award className="w-4 h-4" /> },
                { id: "profile", label: "Profile", icon: <UserIcon className="w-4 h-4" /> }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-btn-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs font-mono font-medium tracking-wide flex items-center gap-2 transition duration-200 ${
                      isActive 
                        ? "bg-[#1B1B1B] text-[#D4A373] shadow-md border border-white/5" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile / Tablet Quick View indicators */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                id="mobile-menu-btn"
                onClick={() => setActiveTab("profile")}
                className="w-9 h-9 rounded-full bg-[#1B1B1B] border border-white/5 flex items-center justify-center text-xs text-[#D4A373] font-bold"
              >
                {user.name.slice(0, 1).toUpperCase()}
              </button>
            </div>
          </div>

          {/* Mobile sub-tabs */}
          <div className="lg:hidden flex items-center justify-around border-t border-white/5 bg-[#111111] py-3.5">
            {[
              { id: "dashboard", icon: <Compass className="w-4.5 h-4.5" />, label: "Home" },
              { id: "chat", icon: <MessageSquare className="w-4.5 h-4.5" />, label: "Chat" },
              { id: "journal", icon: <BookOpen className="w-4.5 h-4.5" />, label: "Journal" },
              { id: "mood", icon: <Smile className="w-4.5 h-4.5" />, label: "Vibe" },
              { id: "goals", icon: <Award className="w-4.5 h-4.5" />, label: "Goals" }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`mobile-tab-btn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 transition ${
                    isActive ? "text-[#D4A373]" : "text-gray-500"
                  }`}
                >
                  {tab.icon}
                  <span className="text-[9px] font-mono tracking-wide uppercase">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Main app viewport container */}
      <main className="flex-1">
        {activeTab === "landing" && (
          <LandingPage onGetStarted={() => { setAuthMode("login"); setShowAuthModal(true); }} />
        )}

        {user && activeTab === "dashboard" && (
          <Dashboard 
            userProfile={user} 
            moodEntries={moodEntries} 
            journalEntries={journalEntries} 
            goals={goals} 
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        )}

        {user && activeTab === "assessment" && (
          <Assessment 
            onComplete={handleAssessmentComplete} 
            onCancel={() => setActiveTab(user.attachmentStyle ? "dashboard" : "landing")} 
          />
        )}

        {user && activeTab === "chat" && (
          <CoachChat 
            userProfile={user} 
            sessions={chatSessions} 
            onSaveSessions={handleSaveChats} 
            activeSessionId={activeSessionId} 
            onSetActiveSessionId={(id) => setActiveSessionId(id)} 
          />
        )}

        {user && activeTab === "journal" && (
          <Journal 
            userProfile={user} 
            entries={journalEntries} 
            onSaveEntries={handleSaveJournals} 
          />
        )}

        {user && activeTab === "mood" && (
          <MoodTracker 
            entries={moodEntries} 
            onSaveEntries={handleSaveMoods} 
          />
        )}

        {user && activeTab === "goals" && (
          <Goals 
            goals={goals} 
            onSaveGoals={handleSaveGoals} 
          />
        )}

        {user && activeTab === "profile" && (
          <Profile 
            userProfile={user} 
            onSaveProfile={(profile) => saveUser(profile)} 
            onResetAssessment={handleResetAssessment} 
            onLogout={handleLogout} 
          />
        )}
      </main>

      {/* Sleek Burgundy Authentication Modal Overlay */}
      <AnimatePresence>
        {showAuthModal && (
          <div id="auth-modal-overlay" className="fixed inset-0 bg-[#111111]/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-[#1B1B1B] border border-white/5 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                id="close-auth-modal-btn"
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition font-mono p-1"
              >
                ✕
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-11 h-11 rounded-full bg-[#6B0F1A]/20 flex items-center justify-center mx-auto mb-4 border border-[#6B0F1A]/40 text-[#D4A373]">
                  <Heart className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-2xl font-light text-white tracking-tight">
                  {authMode === "login" ? "Welcome Back to Eunoia" : "Begin Your Connection Journey"}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 font-light">
                  {authMode === "login" 
                    ? "Log in to synchronize your reflection dashboard." 
                    : "Register to unlock attachment assessments and custom AI logs."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "register" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase">Your Name</label>
                    <input
                      id="register-name-field"
                      type="text"
                      required
                      placeholder="E.g., Alexander"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Email Address</label>
                  <input
                    id="auth-email-field"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-gray-400 uppercase">Password</label>
                  <div className="relative">
                    <input
                      id="auth-password-field"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl pl-4 pr-10 py-3 text-xs text-gray-200 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-white transition">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="rounded border-white/5 bg-[#111111] text-[#6B0F1A] focus:ring-0 w-3.5 h-3.5"
                    />
                    Remember Me
                  </label>
                  <span className="text-gray-500 hover:text-gray-400 transition cursor-pointer">Forgot password?</span>
                </div>

                {authError && (
                  <p className="text-[11px] text-rose-500 font-mono flex items-center gap-1.5 justify-center bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {authError}
                  </p>
                )}

                <button
                  id="auth-submit-btn"
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-[#D4A373] text-black hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center gap-2 mt-2 shadow-md"
                >
                  {authLoading ? (
                    <div className="w-4.5 h-4.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : authMode === "login" ? (
                    "Authorize Session"
                  ) : (
                    "Create Secure Account"
                  )}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center text-xs text-gray-500">
                {authMode === "login" ? (
                  <>
                    Don't have an account?{" "}
                    <button 
                      onClick={() => { setAuthError(""); setAuthMode("register"); }}
                      className="text-[#D4A373] hover:underline font-semibold"
                    >
                      Sign Up Free
                    </button>
                  </>
                ) : (
                  <>
                    Already registered?{" "}
                    <button 
                      onClick={() => { setAuthError(""); setAuthMode("login"); }}
                      className="text-[#D4A373] hover:underline font-semibold"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>

              {/* Secure statement */}
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-gray-500 flex items-center gap-1.5 justify-center">
                <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                Simulated secure JWT session protocol
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
