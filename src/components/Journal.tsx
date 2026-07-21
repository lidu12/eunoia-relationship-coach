import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Plus, Calendar, Smile, ShieldCheck, Sparkles, 
  ArrowRight, BookMarked, Brain, Eye, Compass, Heart 
} from "lucide-react";
import { JournalEntry, User } from "../types";

interface JournalProps {
  userProfile: User;
  entries: JournalEntry[];
  onSaveEntries: (entries: JournalEntry[]) => void;
}

const EMOJI_OPTS = ["😊", "😔", "😠", "🥺", "😑", "😳", "🤗", "😴"];

export default function Journal({ userProfile, entries, onSaveEntries }: JournalProps) {
  const [isWriting, setIsWriting] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);

  const activeEntry = entries.find(e => e.id === activeEntryId) || null;

  const handleCreateEntry = async () => {
    if (!journalText.trim()) return;
    setIsAnalyzing(true);

    try {
      // API call to Express backend
      const response = await fetch("/api/journal/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: journalText,
          userProfile: {
            attachmentStyle: userProfile.attachmentStyle
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not analyze insights");
      }

      const insights = await response.json();

      const newEntry: JournalEntry = {
        id: `journal_${Date.now()}`,
        date: new Date().toLocaleDateString(undefined, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        text: journalText,
        mood: selectedEmoji,
        insights
      };

      const updated = [newEntry, ...entries];
      onSaveEntries(updated);
      setJournalText("");
      setIsWriting(false);
      setActiveEntryId(newEntry.id);
    } catch (err) {
      console.error(err);
      // Fallback fallback static insights
      const newEntry: JournalEntry = {
        id: `journal_${Date.now()}`,
        date: new Date().toLocaleDateString(),
        text: journalText,
        mood: selectedEmoji,
        insights: {
          summary: "An emotional journal check-in that highlights deep interpersonal focus.",
          emotionalInsights: [
            "Highlights subtle anxiety regarding connection consistency.",
            "Indicates a strong longing for close, supportive feedback."
          ],
          communicationPatterns: [
            "Shows deep introspection but perhaps hesitant direct voicing of needs.",
            "Reflects protective overthinking over slight tone shifts."
          ],
          reflectionQuestions: [
            "How can you soothingly voice your core need without assuming withdrawal?",
            "What physical cues did you experience during this moment?"
          ],
          growthSuggestions: [
            "Practice writing a micro draft expressing your core boundary.",
            "Take 5 grounding breaths before responding to any distance."
          ]
        }
      };
      const updated = [newEntry, ...entries];
      onSaveEntries(updated);
      setJournalText("");
      setIsWriting(false);
      setActiveEntryId(newEntry.id);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div id="journal-module-layout" className="max-w-6xl mx-auto px-4 py-8 font-sans">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono text-[#D4A373] tracking-widest uppercase">Secured Logbook</span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Emotional Journal</h1>
        </div>
        {!isWriting && (
          <button
            id="new-journal-btn"
            onClick={() => setIsWriting(true)}
            className="py-3 px-5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#6B0F1A] hover:bg-[#8E2430] text-white flex items-center gap-2 transition border border-[#D4A373]/10"
          >
            <Plus className="w-4 h-4" />
            New Reflection
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Writing or Active Entry view */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {isWriting ? (
              <motion.div
                key="writing-box"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#D4A373] tracking-wider uppercase flex items-center gap-2">
                    <BookMarked className="w-4 h-4" />
                    Reflective Entry
                  </h3>
                  <button 
                    id="cancel-journal-btn"
                    onClick={() => setIsWriting(false)}
                    className="text-xs text-gray-500 hover:text-white transition font-mono"
                  >
                    Cancel
                  </button>
                </div>

                {/* Emoji Selector */}
                <div>
                  <label className="text-xs text-gray-400 block mb-2 font-mono">Current Mood Core</label>
                  <div className="flex flex-wrap gap-2.5">
                    {EMOJI_OPTS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border transition ${
                          selectedEmoji === emoji 
                            ? "border-[#D4A373] bg-[#6B0F1A]/20" 
                            : "border-white/5 bg-[#111111] hover:bg-white/5"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main textarea */}
                <div>
                  <textarea
                    id="journal-input-textarea"
                    rows={8}
                    placeholder="Describe your feelings, conflicts, or communication milestones. Try to focus on emotional triggers and how you navigated them..."
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-2xl p-4 text-sm text-gray-200 focus:outline-none placeholder-gray-600 leading-relaxed font-light resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs text-gray-500 font-light flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#D4A373]" />
                    AI-powered insights safely generated via Gemini
                  </span>
                  <button
                    id="analyze-journal-btn"
                    onClick={handleCreateEntry}
                    disabled={journalText.trim().length < 5 || isAnalyzing}
                    className="px-6 py-3.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#D4A373] text-black hover:bg-white transition disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-black" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Save & Analyze
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : activeEntry ? (
              <motion.div
                key="entry-view"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Journal Entry Body */}
                <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-[#111111] w-10 h-10 rounded-full flex items-center justify-center border border-white/5">
                        {activeEntry.mood}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{activeEntry.date}</p>
                        <p className="text-[10px] text-[#D4A373] font-mono uppercase tracking-wider">SAVED ENTRY</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed whitespace-pre-wrap">
                    {activeEntry.text}
                  </p>
                </div>

                {/* AI Analysis Cards */}
                {activeEntry.insights && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#1B1B1B] border border-[#D4A373]/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative"
                  >
                    <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/30 text-[10px] font-mono text-[#D4A373] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      EUNOIA REFLECTIVE REPORT
                    </div>

                    {/* Summary */}
                    <div>
                      <h4 className="text-xs font-mono text-[#D4A373] tracking-widest uppercase mb-2 flex items-center gap-1.5">
                        <Brain className="w-4 h-4 text-[#D4A373]" />
                        Emotional Core
                      </h4>
                      <p className="text-sm text-gray-300 font-light italic leading-relaxed">
                        "{activeEntry.insights.summary}"
                      </p>
                    </div>

                    {/* Insights block */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      {/* Emotional Dynamics */}
                      <div>
                        <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-[#D4A373]" />
                          Detected Dynamics
                        </h4>
                        <ul className="space-y-2">
                          {activeEntry.insights.emotionalInsights.map((insight, idx) => (
                            <li key={idx} className="text-xs text-gray-400 font-light leading-relaxed flex items-start gap-2">
                              <span className="text-[#D4A373] font-bold">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Communication Patterns */}
                      <div>
                        <h4 className="text-xs font-semibold text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
                          <Compass className="w-4 h-4 text-[#D4A373]" />
                          Communication Style
                        </h4>
                        <ul className="space-y-2">
                          {activeEntry.insights.communicationPatterns.map((insight, idx) => (
                            <li key={idx} className="text-xs text-gray-400 font-light leading-relaxed flex items-start gap-2">
                              <span className="text-[#D4A373] font-bold">•</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Questions & Exercise Suggestions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                      {/* Questions */}
                      <div>
                        <h4 className="text-xs font-semibold text-[#D4A373] tracking-wider uppercase mb-3">
                          Self-Reflective Prompts
                        </h4>
                        <ul className="space-y-2">
                          {activeEntry.insights.reflectionQuestions.map((q, idx) => (
                            <li key={idx} className="text-xs text-gray-300 italic font-light leading-relaxed flex items-start gap-2">
                              <span className="text-white font-mono">{idx + 1}.</span>
                              "{q}"
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Suggestions */}
                      <div>
                        <h4 className="text-xs font-semibold text-[#D4A373] tracking-wider uppercase mb-3">
                          Path to Secure Action
                        </h4>
                        <ul className="space-y-2">
                          {activeEntry.insights.growthSuggestions.map((s, idx) => (
                            <li key={idx} className="text-xs text-gray-300 font-light leading-relaxed flex items-start gap-2">
                              <span className="text-emerald-500">✓</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[350px]">
                <div className="w-12 h-12 rounded-full bg-[#6B0F1A]/20 flex items-center justify-center mb-4 border border-white/5">
                  <BookOpen className="w-6 h-6 text-[#D4A373]" />
                </div>
                <h3 className="text-base font-medium text-white mb-1">No entry selected</h3>
                <p className="text-xs text-gray-500 max-w-xs font-light leading-relaxed">
                  Choose a previous journal log from the sidebar or write a new reflection to trigger AI insights.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Archive list list */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono text-gray-400 tracking-widest uppercase pl-1">Past Reflections</h3>
          
          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
            {entries.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-600 font-light font-mono bg-[#1B1B1B] border border-white/5 rounded-xl">
                Archive empty.
              </div>
            ) : (
              entries.map((entry) => {
                const isActive = entry.id === activeEntryId;
                return (
                  <button
                    key={entry.id}
                    id={`journal-archive-item-${entry.id}`}
                    onClick={() => {
                      setIsWriting(false);
                      setActiveEntryId(entry.id);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex gap-3.5 ${
                      isActive 
                        ? "border-[#D4A373] bg-[#1B1B1B] shadow-lg" 
                        : "border-white/5 bg-[#1B1B1B]/40 hover:bg-[#1B1B1B]"
                    }`}
                  >
                    <span className="text-xl bg-[#111111] w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-white/5">
                      {entry.mood}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-mono text-gray-500">{entry.date.split(",")[1] || entry.date}</p>
                      <p className="text-xs font-medium text-white truncate mt-1">{entry.text}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
