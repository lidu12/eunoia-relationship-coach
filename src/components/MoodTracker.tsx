import { useState } from "react";
import { motion } from "motion/react";
import { Smile, Calendar, TrendingUp, AlertCircle, Sparkles, Check, ChevronRight, Activity, Award } from "lucide-react";
import { MoodEntry } from "../types";

interface MoodTrackerProps {
  entries: MoodEntry[];
  onSaveEntries: (entries: MoodEntry[]) => void;
}

const MOODS = [
  { score: 5, emoji: "😊", label: "Secure & Joyful", desc: "Feeling deeply connected, calm, and safe in your self/bonds." },
  { score: 4, emoji: "🤗", label: "Warm & Open", desc: "Receptive, warm, ready to share close moments and hold space." },
  { score: 3, emoji: "😐", label: "Neutral / Calm", desc: "Balanced, quietly reflective, centered but stable." },
  { score: 2, emoji: "😳", label: "Overthinking / Anxious", desc: "Vigilant, worrying about shifts or silence, needing soothing." },
  { score: 1, emoji: "😔", label: "Guarded / Disconnected", desc: "Urge to withdraw, feeling emotionally heavy or frozen." }
];

export default function MoodTracker({ entries, onSaveEntries }: MoodTrackerProps) {
  const [selectedScore, setSelectedScore] = useState<number>(3);
  const [note, setNote] = useState("");
  const [isLoggedToday, setIsLoggedToday] = useState(false);

  const handleLogMood = () => {
    const selectedMood = MOODS.find(m => m.score === selectedScore)!;
    const newEntry: MoodEntry = {
      id: `mood_${Date.now()}`,
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      score: selectedScore,
      emoji: selectedMood.emoji,
      note: note.trim() || selectedMood.label
    };

    // Filter out previous entries for today to allow updates
    const filtered = entries.filter(e => e.date !== newEntry.date);
    onSaveEntries([newEntry, ...filtered]);
    setIsLoggedToday(true);
    setNote("");
  };

  // Compute insights
  const averageScore = entries.length > 0 
    ? entries.reduce((acc, curr) => acc + curr.score, 0) / entries.length 
    : 3;

  const anxiousDays = entries.filter(e => e.score === 2).length;
  const secureDays = entries.filter(e => e.score >= 4).length;

  return (
    <div id="mood-tracker-container" className="max-w-5xl mx-auto px-4 py-8 font-sans">
      
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-mono text-[#D4A373] tracking-widest uppercase">Intimacy Vibe Check</span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Emotional Vibe Check-in</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Daily check-in panel */}
        <div className="lg:col-span-7 bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
            <Smile className="text-[#D4A373] w-4.5 h-4.5" />
            How do you feel connected today?
          </h3>

          {/* Emoji row */}
          <div className="grid grid-cols-5 gap-3">
            {MOODS.map((m) => {
              const isSelected = selectedScore === m.score;
              return (
                <button
                  key={m.score}
                  id={`mood-btn-${m.score}`}
                  type="button"
                  onClick={() => setSelectedScore(m.score)}
                  className={`py-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-1.5 ${
                    isSelected 
                      ? "border-[#D4A373] bg-[#6B0F1A]/20" 
                      : "border-white/5 bg-[#111111]/60 hover:bg-[#1B1B1B]"
                  }`}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className={`text-[10px] font-mono tracking-wide ${isSelected ? "text-white" : "text-gray-500"}`}>
                    LEVEL {m.score}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected mood description */}
          <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
            <p className="text-xs font-mono text-[#D4A373] uppercase tracking-wider">
              {MOODS.find(m => m.score === selectedScore)?.label}
            </p>
            <p className="text-xs text-gray-400 font-light leading-relaxed mt-1">
              {MOODS.find(m => m.score === selectedScore)?.desc}
            </p>
          </div>

          {/* Check-in note */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block font-mono">Check-in Reflection Note (Optional)</label>
            <input
              id="mood-note-field"
              type="text"
              placeholder="E.g., Felt nervous during silence but practiced breathing."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none placeholder-gray-600 font-light"
            />
          </div>

          <button
            id="log-mood-btn"
            onClick={handleLogMood}
            className="w-full py-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-[#6B0F1A] to-[#8E2430] hover:scale-102 transition text-white border border-[#D4A373]/10 shadow-md shadow-[#6B0F1A]/10"
          >
            {isLoggedToday ? "Update Today's Vibe" : "Log Daily Connection Vibe"}
          </button>

          {isLoggedToday && (
            <p className="text-[11px] text-emerald-500 font-mono text-center flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Checked in successfully!
            </p>
          )}
        </div>

        {/* Right Side: Vibe insights and weekly stats */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Metrics */}
          <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
              <TrendingUp className="text-[#D4A373] w-4.5 h-4.5" />
              Attachment Health Cues
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Average Core Vibe</span>
                <span className="text-3xl font-light text-white block mt-1">{averageScore.toFixed(1)}</span>
                <span className="text-[9px] font-mono text-[#D4A373] uppercase mt-1 block">
                  {averageScore >= 3.5 ? "Secure Bonded" : averageScore >= 2.5 ? "Stable Balance" : "Needs Reassurance"}
                </span>
              </div>

              <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl text-center">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Secure Streak Days</span>
                <span className="text-3xl font-light text-white block mt-1">{secureDays}</span>
                <span className="text-[9px] font-mono text-[#D4A373] uppercase mt-1 block">Vulnerability open</span>
              </div>
            </div>

            {/* AI Generated Vibe Recommendation */}
            <div className="bg-[#6B0F1A]/10 border border-[#6B0F1A]/30 p-4 rounded-2xl flex gap-3 relative overflow-hidden">
              <Sparkles className="w-5 h-5 text-[#D4A373] flex-shrink-0" />
              <div>
                <p className="text-xs font-mono text-[#D4A373] uppercase">AI Vibe Recommendation</p>
                <p className="text-xs text-gray-300 font-light leading-relaxed mt-1">
                  {averageScore >= 3.5 
                    ? "Your emotional field is safe and open. Keep initiating direct, transparent checks!"
                    : "You are experiencing self-protective tension or anxiety spikes. Pause and write a micro journal to ground your nervous system."}
                </p>
              </div>
            </div>
          </div>

          {/* Past Log Archives */}
          <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl">
            <h4 className="text-xs font-mono text-gray-400 tracking-widest uppercase mb-4 pl-1">Vibe Log Archive</h4>
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-2">
              {entries.length === 0 ? (
                <div className="text-center p-4 text-xs text-gray-600 font-mono font-light">
                  No logs recorded yet.
                </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="bg-[#111111]/80 border border-white/5 p-3 rounded-xl flex items-start gap-3 justify-between">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <span className="text-xl">{entry.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{entry.note}</p>
                        <p className="text-[9px] text-gray-500 font-mono">{entry.date}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-gray-600 border border-white/5 rounded px-1.5 py-0.5">
                      LV {entry.score}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
