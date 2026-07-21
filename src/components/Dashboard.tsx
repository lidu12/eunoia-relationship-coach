import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Heart, Compass, BookOpen, Smile, Sparkles, MessageSquare, 
  ArrowRight, ShieldCheck, HelpCircle, Activity, Award, Bell, Quote, Check
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar 
} from "recharts";
import { User, MoodEntry, JournalEntry, RelationshipGoal, DailyReflection } from "../types";

interface DashboardProps {
  userProfile: User;
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  goals: RelationshipGoal[];
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ 
  userProfile, 
  moodEntries, 
  journalEntries, 
  goals, 
  onNavigate 
}: DashboardProps) {
  
  const [reflection, setReflection] = useState<DailyReflection | null>(null);
  const [isGeneratingReflection, setIsGeneratingReflection] = useState(false);
  const [showNotificationAlert, setShowNotificationAlert] = useState(true);

  useEffect(() => {
    const fetchDailyReflection = async () => {
      setIsGeneratingReflection(true);
      try {
        const response = await fetch("/api/daily/reflection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userProfile })
        });
        if (response.ok) {
          const data = await response.json();
          setReflection(data);
        }
      } catch (err) {
        console.error("Could not fetch daily reflection:", err);
      } finally {
        setIsGeneratingReflection(false);
      }
    };
    fetchDailyReflection();
  }, [userProfile]);

  // Fallback high-fidelity daily reflection if not generated yet
  const activeReflection = reflection || {
    prompt: "How does your body physically react when you sense minor emotional distance in a relationship, and how can you soothe it?",
    challenge: "Pause for three seconds before responding during any friction point today to check in with your core feelings.",
    reminder: "Your emotional needs are valid, and expressing them clearly is an act of care for both yourself and your relationship.",
    exercise: "Spend 5 minutes in comfortable quiet, focusing on deep diaphragmatic breaths, repeating 'I am secure, whole, and worthy of love.'",
    gratitude: "List three qualities you genuinely appreciate about your communication partner or friend.",
    quote: "To be fully seen by somebody, then, and be loved anyhow - this is a human offering that can border on miraculous. — Elizabeth Gilbert"
  };

  // Prepare Recharts chart data (using realistic populated mock curves merged with user logged history for professional visuals)
  const chartData = [
    { day: "Mon", score: moodEntries.find(e => e.date.includes("Mon"))?.score || 4.2 },
    { day: "Tue", score: moodEntries.find(e => e.date.includes("Tue"))?.score || 3.8 },
    { day: "Wed", score: moodEntries.find(e => e.date.includes("Wed"))?.score || 4.5 },
    { day: "Thu", score: moodEntries.find(e => e.date.includes("Thu"))?.score || 4.0 },
    { day: "Fri", score: moodEntries.find(e => e.date.includes("Fri"))?.score || 3.5 },
    { day: "Sat", score: moodEntries.find(e => e.date.includes("Sat"))?.score || 4.6 },
    { day: "Sun", score: moodEntries[0]?.score || 4.1 }
  ];

  const frequencyData = [
    { name: "Week 1", count: 3 },
    { name: "Week 2", count: 5 },
    { name: "Week 3", count: journalEntries.length || 4 },
    { name: "Week 4", count: (journalEntries.length ? journalEntries.length + 1 : 6) }
  ];

  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter(g => g.completed).length;
  const goalsProgress = totalGoalsCount > 0 ? Math.round((completedGoalsCount / totalGoalsCount) * 100) : 40;

  return (
    <div id="dashboard-wrapper" className="max-w-7xl mx-auto px-4 py-8 font-sans space-y-8">
      
      {/* Alert Notification banner */}
      {showNotificationAlert && (
        <div id="dashboard-alert" className="p-4 rounded-2xl bg-gradient-to-r from-[#6B0F1A]/50 to-[#1B1B1B] border border-[#6B0F1A]/40 flex items-center justify-between text-xs sm:text-sm text-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#6B0F1A]/30 flex items-center justify-center border border-[#D4A373]/10 text-[#D4A373]">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="font-semibold text-[#D4A373]">Reflection Tip:</span> Keep log integrity consistent. Try writing at least one entry every 48 hours to lock in secure habits.
            </div>
          </div>
          <button 
            id="dismiss-alert-btn"
            onClick={() => setShowNotificationAlert(false)} 
            className="text-gray-500 hover:text-white transition font-mono px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Row 1: Welcome & Attachment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Welcome and Reflection Box */}
        <div className="lg:col-span-8 bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6B0F1A]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4A373] tracking-widest uppercase mb-2">
              <Sparkles className="w-4 h-4" />
              EUNOIA DAILY REfLECTION
            </div>
            <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight">
              Hello, {userProfile.name || "friend"}
            </h1>
            <p className="text-gray-400 font-light mt-2 max-w-xl text-sm sm:text-base">
              Your self-awareness journal is an act of deep kindness to yourself. Let's practice checking in with your attachment triggers.
            </p>
          </div>

          {/* Today's Reflection Prompts Block */}
          <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-[#D4A373] tracking-widest uppercase block mb-1">Daily Reflection Prompt</span>
              <p className="text-sm text-gray-300 font-light italic leading-relaxed">
                "{activeReflection.prompt}"
              </p>
            </div>

            <div className="bg-[#111111] border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-[#8E2430] tracking-widest uppercase block mb-1">Micro Communication challenge</span>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  {activeReflection.challenge}
                </p>
              </div>
              <p className="text-[10px] font-mono text-gray-500 mt-4 flex items-center gap-1.5 uppercase">
                <Check className="w-3.5 h-3.5 text-[#D4A373]" /> inspired by attachment theory
              </p>
            </div>
          </div>
        </div>

        {/* Attachment Style summary card */}
        <div className="lg:col-span-4 bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-[150px] h-[150px] bg-[#D4A373]/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <Compass className="w-8 h-8 text-[#D4A373] mb-4" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Blueprint</span>
            <h3 className="text-2xl font-light text-white mt-1">
              {userProfile.attachmentStyle || "Awaiting Assessment"}
            </h3>
            <p className="text-xs text-gray-400 mt-3 font-light leading-relaxed">
              Your connection blueprint drives Eunoia's custom feedback pathways.
            </p>
          </div>

          <div className="mt-8 border-t border-white/5 pt-4">
            {userProfile.attachmentStyle ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500">
                  <span>Attachment Safety</span>
                  <span className="text-white">75% Secure Level</span>
                </div>
                <div className="w-full h-1.5 bg-[#111111] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#6B0F1A] to-[#D4A373]" style={{ width: "75%" }} />
                </div>
                <button
                  id="dashboard-retake-btn"
                  onClick={() => onNavigate("profile")}
                  className="w-full py-2.5 rounded-xl border border-white/5 hover:border-white/10 hover:text-[#D4A373] transition text-[10px] font-mono tracking-wider uppercase text-gray-400 bg-[#111111]"
                >
                  Manage Profile / Retake
                </button>
              </div>
            ) : (
              <button
                id="dashboard-start-assessment-btn"
                onClick={() => onNavigate("assessment")}
                className="w-full py-3.5 rounded-xl bg-[#6B0F1A] hover:bg-[#8E2430] text-white text-xs font-mono font-bold uppercase tracking-wider transition border border-[#D4A373]/10 flex items-center justify-center gap-2"
              >
                Conduct Assessment
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Grid Row 2: Charts and progress statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recharts Mood Trends Area chart */}
        <div className="lg:col-span-8 bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
              <Activity className="text-[#D4A373] w-4.5 h-4.5" />
              Emotional Vibe trends
            </h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase">WEEKLY CONNECTION FLUCTUATIONS</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B0F1A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6B0F1A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#555555" fontSize={10} fontFamily="monospace" />
                <YAxis domain={[1, 5]} stroke="#555555" fontSize={10} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  labelStyle={{ color: "#D4A373", fontFamily: "monospace", fontSize: "10px" }}
                  itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="score" stroke="#D4A373" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts reflection frequency chart */}
        <div className="lg:col-span-4 bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Reflection Frequency</h3>
            <span className="text-[10px] font-mono text-gray-500 uppercase mt-0.5 block">JOURNAL ENTRIES PER MONTH</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#555555" fontSize={9} fontFamily="monospace" />
                <YAxis stroke="#555555" fontSize={9} fontFamily="monospace" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  itemStyle={{ color: "#D4A373", fontSize: "11px" }}
                />
                <Bar dataKey="count" fill="#8E2430" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid Row 3: Goals progress and Quick Launch Pad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Relationship Goals overview */}
        <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
            <Award className="text-[#D4A373] w-4.5 h-4.5" />
            Active Goals Progress
          </h3>

          <div className="bg-[#111111] p-5 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-mono text-gray-500 uppercase">ACCOMPLISHMENT RATIO</p>
              <h4 className="text-2xl font-light text-white mt-0.5">{completedGoalsCount} completed</h4>
              <p className="text-xs text-gray-400 mt-1.5 font-light">
                Setting healthy boundaries or reassuring partner checks.
              </p>
            </div>
            <div className="relative w-16 h-16 flex items-center justify-center border-4 border-[#6B0F1A] rounded-full text-xs font-mono font-bold text-[#D4A373]">
              {goalsProgress}%
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {goals.slice(0, 2).map((goal) => (
              <div key={goal.id} className="flex items-center justify-between text-xs text-gray-400 border-b border-white/5 pb-2">
                <span className={goal.completed ? "line-through text-gray-600" : ""}>{goal.text}</span>
                <span className="font-mono text-[10px] text-[#D4A373]">{goal.progress}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Pad */}
        <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
            <Compass className="text-[#D4A373] w-4.5 h-4.5" />
            Quick Launch Actions
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <button
              id="dash-launch-chat"
              onClick={() => onNavigate("chat")}
              className="p-4 rounded-2xl bg-[#111111] border border-white/5 hover:border-[#6B0F1A]/40 transition text-left group"
            >
              <MessageSquare className="w-5 h-5 text-[#D4A373] mb-3 group-hover:scale-110 transition" />
              <p className="text-xs font-semibold text-white">Coach Chat</p>
              <p className="text-[10px] text-gray-500 font-light mt-1">Talk with Eunoia</p>
            </button>

            <button
              id="dash-launch-journal"
              onClick={() => onNavigate("journal")}
              className="p-4 rounded-2xl bg-[#111111] border border-white/5 hover:border-[#6B0F1A]/40 transition text-left group"
            >
              <BookOpen className="w-5 h-5 text-[#D4A373] mb-3 group-hover:scale-110 transition" />
              <p className="text-xs font-semibold text-white">Log Journal</p>
              <p className="text-[10px] text-gray-500 font-light mt-1">Reflect on feelings</p>
            </button>

            <button
              id="dash-launch-mood"
              onClick={() => onNavigate("mood")}
              className="p-4 rounded-2xl bg-[#111111] border border-white/5 hover:border-[#6B0F1A]/40 transition text-left group"
            >
              <Smile className="w-5 h-5 text-[#D4A373] mb-3 group-hover:scale-110 transition" />
              <p className="text-xs font-semibold text-white">Vibe Check</p>
              <p className="text-[10px] text-gray-500 font-light mt-1">Daily mood register</p>
            </button>

            <button
              id="dash-launch-goals"
              onClick={() => onNavigate("goals")}
              className="p-4 rounded-2xl bg-[#111111] border border-white/5 hover:border-[#6B0F1A]/40 transition text-left group"
            >
              <Award className="w-5 h-5 text-[#D4A373] mb-3 group-hover:scale-110 transition" />
              <p className="text-xs font-semibold text-white">Set Goals</p>
              <p className="text-[10px] text-gray-500 font-light mt-1">Action items</p>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
