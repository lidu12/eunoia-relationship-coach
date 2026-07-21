import { useState, FormEvent, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Check, MessageSquare, Shield, Eye, Heart, Calendar, Trash2, Award, Sparkles } from "lucide-react";
import { RelationshipGoal } from "../types";

interface GoalsProps {
  goals: RelationshipGoal[];
  onSaveGoals: (goals: RelationshipGoal[]) => void;
}

const CATEGORY_ICONS = {
  communication: <MessageSquare className="w-4 h-4 text-[#D4A373]" />,
  trust: <Eye className="w-4 h-4 text-[#D4A373]" />,
  boundaries: <Shield className="w-4 h-4 text-[#D4A373]" />,
  intimacy: <Heart className="w-4 h-4 text-[#D4A373]" />,
  "self-care": <Award className="w-4 h-4 text-[#D4A373]" />
};

export default function Goals({ goals, onSaveGoals }: GoalsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<RelationshipGoal["category"]>("communication");
  const [targetDate, setTargetDate] = useState("");

  const handleAddGoal = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newGoal: RelationshipGoal = {
      id: `goal_${Date.now()}`,
      text: text.trim(),
      category,
      targetDate: targetDate || new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split("T")[0], // default 2 weeks out
      progress: 0,
      completed: false
    };

    onSaveGoals([newGoal, ...goals]);
    setText("");
    setTargetDate("");
    setIsAdding(false);
  };

  const handleToggleGoal = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        const completed = !g.completed;
        return { ...g, completed, progress: completed ? 100 : 0 };
      }
      return g;
    });
    onSaveGoals(updated);
  };

  const handleIncreaseProgress = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const updated = goals.map(g => {
      if (g.id === id) {
        const nextProgress = Math.min(g.progress + 25, 100);
        return { ...g, progress: nextProgress, completed: nextProgress === 100 };
      }
      return g;
    });
    onSaveGoals(updated);
  };

  const handleDeleteGoal = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    onSaveGoals(goals.filter(g => g.id !== id));
  };

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div id="goals-tracker-layout" className="max-w-5xl mx-auto px-4 py-8 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-mono text-[#D4A373] tracking-widest uppercase">Actionable Growth</span>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Relationship Goals</h1>
        </div>
        {!isAdding && (
          <button
            id="add-goal-btn"
            onClick={() => setIsAdding(true)}
            className="py-3 px-5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#6B0F1A] hover:bg-[#8E2430] text-white flex items-center gap-2 transition border border-[#D4A373]/10"
          >
            <Plus className="w-4 h-4" />
            Add Goal
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Main goals list / creation block */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {isAdding && (
              <motion.form
                key="goal-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                onSubmit={handleAddGoal}
                className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Set Relationship Intention</h3>
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="text-xs text-gray-500 hover:text-white transition font-mono"
                  >
                    Cancel
                  </button>
                </div>

                {/* Text input */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 block font-mono">Goal Statement</label>
                  <input
                    id="goal-statement-field"
                    type="text"
                    required
                    placeholder="E.g., Practice pauses during conflict triggers or schedule visual touch times."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none placeholder-gray-600 font-light"
                  />
                </div>

                {/* Row: Category & Target Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block font-mono">Theme Category</label>
                    <select
                      id="goal-category-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as RelationshipGoal["category"])}
                      className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none"
                    >
                      <option value="communication">Communication Mastery</option>
                      <option value="trust">Trust Building</option>
                      <option value="boundaries">Healthy Boundaries</option>
                      <option value="intimacy">Emotional Intimacy</option>
                      <option value="self-care">Emotional Self-care</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 block font-mono">Target Deadline Date</label>
                    <input
                      id="goal-target-date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="submit-goal-btn"
                  type="submit"
                  className="w-full py-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-[#D4A373] text-black hover:bg-white transition shadow-md"
                >
                  Confirm Relationship Goal
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Goal cards stream */}
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
                <Heart className="w-10 h-10 text-gray-600 mb-4" />
                <h3 className="text-base font-medium text-white mb-1">No active goals</h3>
                <p className="text-xs text-gray-500 max-w-xs font-light leading-relaxed">
                  Establish custom relationship goals to track communication, boundary setting, or emotional connection.
                </p>
              </div>
            ) : (
              goals.map((goal) => (
                <div
                  key={goal.id}
                  id={`goal-item-${goal.id}`}
                  onClick={() => handleToggleGoal(goal.id)}
                  className={`p-5 rounded-2xl border transition duration-200 cursor-pointer relative group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    goal.completed 
                      ? "bg-[#1B1B1B]/40 border-[#D4A373]/20" 
                      : "bg-[#1B1B1B] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Toggle Circle */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleGoal(goal.id); }}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition ${
                        goal.completed 
                          ? "border-[#D4A373] bg-[#D4A373] text-[#111111]" 
                          : "border-gray-600 hover:border-gray-400 bg-[#111111]"
                      }`}
                    >
                      {goal.completed && <Check className="w-4.5 h-4.5" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[10px] font-mono text-[#D4A373] uppercase tracking-wider bg-[#111111] px-2 py-0.5 rounded border border-white/5">
                          {CATEGORY_ICONS[goal.category]}
                          {goal.category}
                        </span>
                        <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          BY: {goal.targetDate}
                        </span>
                      </div>
                      <p className={`text-sm mt-2 font-light leading-relaxed ${goal.completed ? "text-gray-500 line-through" : "text-white"}`}>
                        {goal.text}
                      </p>

                      {/* Progress slider bar */}
                      <div className="mt-3.5 flex items-center gap-3">
                        <div className="w-32 h-1.5 bg-[#111111] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#6B0F1A] to-[#D4A373]" style={{ width: `${goal.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{goal.progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 sm:self-center">
                    {!goal.completed && (
                      <button
                        onClick={(e) => handleIncreaseProgress(goal.id, e)}
                        className="py-1.5 px-3 rounded-lg text-[10px] font-mono border border-white/5 hover:border-white/10 hover:text-[#D4A373] transition text-gray-400 bg-[#111111]"
                      >
                        +25% Progress
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteGoal(goal.id, e)}
                      className="p-2 rounded-lg hover:text-rose-500 text-gray-500 transition hover:bg-white/5 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Goals Progress Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
              <Award className="text-[#D4A373] w-4.5 h-4.5" />
              Goal Achievements
            </h3>

            <div className="bg-[#111111] p-4 rounded-2xl text-center">
              <span className="text-[10px] font-mono text-gray-500 uppercase block">Goals Accomplished</span>
              <span className="text-4xl font-light text-[#D4A373] block mt-1">{completedCount}</span>
              <span className="text-xs text-gray-400 mt-2 block font-light">
                Out of {goals.length} target goals total
              </span>
            </div>

            {/* Achievement dynamic badge */}
            {completedCount > 0 && (
              <div className="bg-[#D4A373]/10 border border-[#D4A373]/30 p-4 rounded-2xl flex gap-3 relative overflow-hidden">
                <Sparkles className="w-5 h-5 text-[#D4A373] flex-shrink-0" />
                <div>
                  <p className="text-xs font-mono text-[#D4A373] uppercase">Achievement Badge Unlocked</p>
                  <p className="text-xs text-gray-300 font-semibold mt-0.5">Secure Pioneer</p>
                  <p className="text-[11px] text-gray-400 font-light mt-1">
                    You have successfully reached milestone markers in your attachment self-regulation journey!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
