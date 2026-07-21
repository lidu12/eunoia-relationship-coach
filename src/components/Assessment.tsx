import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, ArrowLeft, ArrowRight, HelpCircle, CheckCircle, Sparkles, BookOpen, RefreshCw, Star, Heart, MessageSquare, AlertCircle } from "lucide-react";
import { AttachmentStyle } from "../types";

// List of questions inspired by attachment theory (36 questions across 6 key dimensions)
const QUESTIONS = [
  // 1. Trust & Intimacy (Avoidance dimension, reverse scored)
  { id: 1, dimension: "avoidance", text: "I find it relatively easy to get close to others and trust them." },
  { id: 2, dimension: "avoidance", text: "I often feel comfortable sharing my deepest worries and fears with a partner." },
  { id: 3, dimension: "avoidance", text: "It makes me nervous or uncomfortable when others get too close to me emotionally." },
  { id: 4, dimension: "avoidance", text: "I find it difficult to fully open up and let others see my vulnerable side." },
  { id: 5, dimension: "avoidance", text: "I prefer to rely entirely on myself rather than asking others for help." },
  { id: 6, dimension: "avoidance", text: "When a partner seeks a deep emotional connection, I tend to feel suffocated or pressured." },

  // 2. Fear of Abandonment & Reassurance Seeking (Anxiety dimension)
  { id: 7, dimension: "anxiety", text: "I often worry that people I care about will lose interest in me or leave me." },
  { id: 8, dimension: "anxiety", text: "I frequently need verbal reassurance from others that they still care about me." },
  { id: 9, dimension: "anxiety", text: "If a partner is unusually quiet, I immediately assume they are upset with me." },
  { id: 10, dimension: "anxiety", text: "I feel incredibly restless or anxious when I am away from my partner for long." },
  { id: 11, dimension: "anxiety", text: "I sometimes over-analyze small shifts in my partner's tone of voice or text messages." },
  { id: 12, dimension: "anxiety", text: "I worry that if I express my true needs, others will find me needy or high-maintenance." },

  // 3. Emotional Regulation
  { id: 13, dimension: "anxiety", text: "My emotions in relationships feel very intense, sometimes completely taking over my focus." },
  { id: 14, dimension: "avoidance", text: "When relationship tension arises, my instinct is to shut down or physically detach." },
  { id: 15, dimension: "avoidance", text: "I believe it is better to manage my pain quietly rather than discuss it with others." },
  { id: 16, dimension: "anxiety", text: "I find it extremely hard to calm myself down when my partner and I disagree." },
  { id: 17, dimension: "avoidance", text: "I tend to pride myself on being emotionally independent and detached from dramas." },
  { id: 18, dimension: "anxiety", text: "I am highly sensitive to any sign of rejection or distance from people close to me." },

  // 4. Independence vs. Closeness
  { id: 19, dimension: "avoidance", text: "I feel anxious when a partner depends on me too much for their happiness." },
  { id: 20, dimension: "anxiety", text: "I prefer constant emotional closeness and wish others wanted as much intimacy as I do." },
  { id: 21, dimension: "avoidance", text: "I worry that committing to someone means losing my personal freedom." },
  { id: 22, dimension: "anxiety", text: "I would happily adjust my goals and lifestyle just to keep a partner happy." },
  { id: 23, dimension: "avoidance", text: "I value my independence far more than emotional dependency on anyone." },
  { id: 24, dimension: "anxiety", text: "I want to be completely merged with another person, even if it scares them off." },

  // 5. Communication & Vulnerability
  { id: 25, dimension: "anxiety", text: "When I want closeness, I might drop hints or act distant instead of stating it directly." },
  { id: 26, dimension: "avoidance", text: "I prefer to change the subject or make light of situations when topics get too emotional." },
  { id: 27, dimension: "avoidance", text: "I feel exposed and weak when I have to ask someone else for emotional comfort." },
  { id: 28, dimension: "anxiety", text: "I find myself talking excessively to explain my actions during a minor friction." },
  { id: 29, dimension: "avoidance", text: "When partners start asking about my childhood or past, I feel guarded." },
  { id: 30, dimension: "anxiety", text: "I feel like I am always the one initiating emotional check-ins or deep talks." },

  // 6. Conflict & Conflict Resolution
  { id: 31, dimension: "avoidance", text: "During disagreements, my primary goal is to get away and cool down by myself." },
  { id: 32, dimension: "anxiety", text: "During disagreements, I feel an urgent need to resolve things immediately, or I can't sleep." },
  { id: 33, dimension: "avoidance", text: "I find myself thinking that my partners are overly dramatic during conflicts." },
  { id: 34, dimension: "anxiety", text: "I often find myself crying, raised-voice, or emotionally overwhelmed in heat of conflict." },
  { id: 35, dimension: "avoidance", text: "I rarely hold grudges because I just detach and forget about the issue completely." },
  { id: 36, dimension: "anxiety", text: "After a conflict, I stay highly anxious for days, questioning if the connection is ruined." }
];

const LIKERT_OPTIONS = [
  { value: 5, label: "Strongly Agree", color: "border-[#6B0F1A] bg-[#6B0F1A]/10 text-white" },
  { value: 4, label: "Agree", color: "border-[#8E2430]/60 bg-[#8E2430]/5 text-gray-200" },
  { value: 3, label: "Neutral", color: "border-white/10 bg-white/5 text-gray-300" },
  { value: 2, label: "Disagree", color: "border-gray-500/30 bg-[#111111] text-gray-400" },
  { value: 1, label: "Strongly Disagree", color: "border-gray-500/10 bg-[#111111] text-gray-500" }
];

interface AssessmentProps {
  onComplete: (result: {
    attachmentStyle: AttachmentStyle;
    communicationStyle: string;
    conflictStyle: string;
    goals: string[];
  }) => void;
  onCancel: () => void;
}

export default function Assessment({ onComplete, onCancel }: AssessmentProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Score computation states
  const [calculatedStyle, setCalculatedStyle] = useState<AttachmentStyle>("Secure");
  const [anxietyScore, setAnxietyScore] = useState(0);
  const [avoidanceScore, setAvoidanceScore] = useState(0);

  const handleSelectOption = (value: number) => {
    const q = QUESTIONS[currentIdx];
    setAnswers(prev => ({ ...prev, [q.id]: value }));

    // Auto-advance with delay for premium feel
    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
      }
    }, 200);
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleNext = () => {
    const q = QUESTIONS[currentIdx];
    if (answers[q.id] && currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const calculateReport = () => {
    let anxSum = 0;
    let anxCount = 0;
    let avoSum = 0;
    let avoCount = 0;

    QUESTIONS.forEach(q => {
      const score = answers[q.id] || 3;
      if (q.dimension === "anxiety") {
        anxSum += score;
        anxCount++;
      } else if (q.dimension === "avoidance") {
        // Some avoidance questions are trust-oriented (reverse coded: Q1 and Q2)
        if (q.id === 1 || q.id === 2) {
          avoSum += (6 - score); // Reverse score: 5 becomes 1, 1 becomes 5
        } else {
          avoSum += score;
        }
        avoCount++;
      }
    });

    const finalAnxiety = anxSum / anxCount; // 1 to 5 scale
    const finalAvoidance = avoSum / avoCount; // 1 to 5 scale

    setAnxietyScore(finalAnxiety);
    setAvoidanceScore(finalAvoidance);

    // Scoring boundary threshold (middle point is 3)
    let style: AttachmentStyle = "Secure";
    if (finalAnxiety >= 3.1 && finalAvoidance >= 3.1) {
      style = "Fearful Avoidant";
    } else if (finalAnxiety >= 3.1 && finalAvoidance < 3.1) {
      style = "Anxious";
    } else if (finalAnxiety < 3.1 && finalAvoidance >= 3.1) {
      style = "Avoidant";
    } else if (finalAnxiety >= 2.8 && finalAvoidance >= 2.8) {
      style = "Mixed";
    } else {
      style = "Secure";
    }

    setCalculatedStyle(style);
    setShowResults(true);
    setShowConfetti(true);

    // Turn off confetti after 4 seconds
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const submitFinalResult = () => {
    // Generate styles based on computed assessment
    let commStyle = "Needs constant touch and reassurance";
    let confStyle = "Hyper-focuses on unresolved space";
    let goals = ["Build healthy boundaries", "Recognize emotional triggers"];

    if (calculatedStyle === "Anxious") {
      commStyle = "Needs active verbal reassurance, overthinks pauses";
      confStyle = "Urgent need for resolution, experiences high fear of disconnection";
      goals = ["Manage overthinking", "Cultivate self-soothing practices", "Communicate needs directly"];
    } else if (calculatedStyle === "Avoidant") {
      commStyle = "Guarded, prefers independent self-regulation";
      confStyle = "Withdraws, shuts down under perceived criticism";
      goals = ["Express vulnerability safely", "Recognize avoidant triggers", "Build secure interdependence"];
    } else if (calculatedStyle === "Fearful Avoidant") {
      commStyle = "Wants closeness but fears vulnerability; highly volatile";
      confStyle = "Fluctuates between intense pursuit and distant self-protection";
      goals = ["Cultivate emotional regulation", "Establish emotional safety", "De-escalate high-intensity conflicts"];
    } else if (calculatedStyle === "Secure") {
      commStyle = "Direct, transparent, comfortable with emotional gaps";
      confStyle = "Constructive problem solving, seeks mutual understanding";
      goals = ["Deepen emotional vulnerability", "Support partner growth", "Active boundary keeping"];
    } else {
      commStyle = "Dynamic communication balancing emotional depth and spacing";
      confStyle = "Varies depending on emotional states";
      goals = ["Integrate self-soothing with safe connection", "Pace vulnerability"];
    }

    onComplete({
      attachmentStyle: calculatedStyle,
      communicationStyle: commStyle,
      conflictStyle: confStyle,
      goals
    });
  };

  const getStyleReport = (style: AttachmentStyle) => {
    switch (style) {
      case "Secure":
        return {
          title: "The Secure Connector",
          desc: "You generally feel comfortable with vulnerability, trust easily, and are capable of establishing supportive, mutual interdependencies. You view conflicts as opportunities for mutual understanding rather than direct attacks.",
          strengths: ["Highly collaborative during disputes", "Comfortable expressing clear personal boundaries", "Able to offer reliable emotional soothing to others"],
          challenges: ["May occasionally overlook a highly anxious partner's deep panic", "Can assume others possess the same emotional regulatory tools", "Sometimes needs to practice patience with slow disclosures"],
          habits: ["Keep sharing clear boundaries in loving ways", "Engage in active, non-judgmental listening", "Hold space for your partner's specific fear spikes without taking them personally"]
        };
      case "Anxious":
        return {
          title: "The Sensitive Craver",
          desc: "You possess a powerful radar for connection but are prone to hyper-vigilance. You have a persistent fear of abandonment, requiring frequent reassurance, and can get highly overwhelmed by quietness or sudden spacing.",
          strengths: ["Incredibly empathetic and tuned into partner shifts", "Deeply values closeness and values commitment", "Highly expressive of love and affirmation"],
          challenges: ["Prone to overthinking and catastrophic spirals over silence", "Tends to compromise personal boundaries to secure acceptance", "May engage in protest behaviors (e.g., pulling away, hyper-calling)"],
          habits: ["Incorporate structured self-soothing rituals when separation anxiety peaks", "Use 'I-statements' to express fear instead of assigning blame", "Allow 10 minutes of self-regulation before reacting to communication gaps"]
        };
      case "Avoidant":
        return {
          title: "The Self-Sufficient Protector",
          desc: "You prioritize personal freedom and self-reliance as primary defensive tools. When closeness gets intense or conflicts arise, your instinct is to withdraw, shut down, or view others as overly demanding.",
          strengths: ["Highly capable of managing high-stress personal environments", "Provides calm, rational responses during intense emotional dramas", "Strong sense of individual purpose and focus"],
          challenges: ["Equates vulnerability with loss of freedom or weakness", "Struggles to express emotional distress, leading to quiet resentment", "Can make partners feel neglected or emotionally frozen out"],
          habits: ["Practice sharing one micro-vulnerability daily", "When needing quiet space, explicitly say: 'I need 20 minutes to cool down, but I will return'", "Acknowledge and sit with emotions instead of immediately rationalizing them away"]
        };
      case "Fearful Avoidant":
        return {
          title: "The Guarded Longing",
          desc: "Also known as disorganized attachment. You deeply crave warm intimacy but are intensely terrified of being hurt or controlled. This creates a volatile 'come close, go away' dynamic where closeness triggers severe panic.",
          strengths: ["Possesses high sensitivity to complex interpersonal dynamics", "Intensely passionate and capable of emotional depth", "Understands vulnerability pain intimately"],
          challenges: ["Extremely volatile emotional regulatory swings", "Fluctuates between intense pursuit and sudden detachment", "Views relationships as inherently unsafe and untrustworthy"],
          habits: ["Create a list of trusted emotional triggers and review them during calm moments", "Formulate clear personal cues to let partners know when you are in panic mode", "Engage in daily mindfulness and groundings to regulate core nervous system spikes"]
        };
      default:
        return {
          title: "The Dynamic Explorer",
          desc: "You possess a blended set of relationship habits that adapt dynamically. You show a healthy desire for secure connection alongside standard protective spacing patterns.",
          strengths: ["Extremely flexible conflict approach", "High situational awareness", "Balanced view of independence and intimacy"],
          challenges: ["Can be unpredictable during highly intense crises", "Struggles to pinpoint unified goals", "Inconsistent reassurance cues"],
          habits: ["Keep a steady journal of what triggers space versus security", "Maintain consistent communication rhythms", "Establish stable personal self-care structures"]
        };
    }
  };

  const report = getStyleReport(calculatedStyle);
  const progressPercent = Math.round(((currentIdx + 1) / QUESTIONS.length) * 100);
  const currentQuestion = QUESTIONS[currentIdx];

  return (
    <div id="assessment-container" className="min-h-screen bg-[#111111] text-gray-100 py-12 px-4 sm:px-6 relative flex flex-col items-center justify-center font-sans">
      
      {/* Confetti Celebration Particle Burst */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(40)].map((_, i) => {
            const randomX = Math.random() * 100;
            const randomDelay = Math.random() * 2;
            const randomColor = ["#6B0F1A", "#8E2430", "#D4A373", "#FFFFFF"][Math.floor(Math.random() * 4)];
            return (
              <motion.div
                key={i}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  left: `${randomX}%`,
                  top: `-10px`,
                  backgroundColor: randomColor,
                }}
                animate={{
                  y: ["0vh", "100vh"],
                  x: [`${randomX}%`, `${randomX + (Math.random() * 20 - 10)}%`],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2.5 + Math.random() * 2,
                  delay: randomDelay,
                  ease: "linear",
                  repeat: 1
                }}
              />
            );
          })}
        </div>
      )}

      {/* Radiant Glow background */}
      <div className="absolute top-1/4 w-[400px] h-[400px] bg-[#6B0F1A]/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 w-[400px] h-[400px] bg-[#D4A373]/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {!showResults ? (
        <div className="w-full max-w-2xl bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#111111] rounded-t-3xl overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#6B0F1A] via-[#8E2430] to-[#D4A373]"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Wizard Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              id="assessment-back-btn"
              onClick={currentIdx === 0 ? onCancel : handleBack}
              className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              {currentIdx === 0 ? "Cancel" : "Back"}
            </button>
            <div className="text-xs font-mono text-[#D4A373]">
              QUESTION {currentIdx + 1} OF {QUESTIONS.length}
            </div>
          </div>

          {/* Question Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="min-h-[140px] flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#6B0F1A]/20 border border-[#6B0F1A]/30 text-[10px] font-mono text-[#D4A373] tracking-wider uppercase mb-4 self-start">
                <Compass className="w-3.5 h-3.5" />
                {currentQuestion.dimension} self-check
              </div>
              <h2 id={`question-text-${currentQuestion.id}`} className="text-xl sm:text-2xl font-light text-white leading-relaxed">
                {currentQuestion.text}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Likert Scale Options */}
          <div className="mt-8 space-y-3.5">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  id={`option-${opt.value}-${currentQuestion.id}`}
                  onClick={() => handleSelectOption(opt.value)}
                  className={`w-full py-4 px-6 rounded-2xl border text-sm font-medium transition-all duration-300 text-left flex items-center justify-between group ${
                    isSelected 
                      ? "border-[#D4A373] bg-gradient-to-r from-[#6B0F1A]/30 to-[#8E2430]/20 text-white shadow-lg shadow-[#6B0F1A]/10" 
                      : "border-white/5 bg-[#111111]/60 hover:bg-[#1B1B1B] hover:border-white/10 text-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-mono ${
                      isSelected 
                        ? "border-[#D4A373] bg-[#D4A373] text-[#111111]" 
                        : "border-gray-600 group-hover:border-gray-400"
                    }`}>
                      {isSelected && "✓"}
                    </span>
                    {opt.label}
                  </span>
                  <span className="text-xs font-mono text-gray-600 group-hover:text-gray-400">
                    {opt.value === 5 ? "Agree Strongly" : opt.value === 1 ? "Disagree Strongly" : ""}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-light flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Inspired by attachment theory. Take your time.
            </p>
            {currentIdx === QUESTIONS.length - 1 ? (
              <button
                id="assessment-submit-btn"
                onClick={calculateReport}
                disabled={!answers[currentQuestion.id]}
                className="px-6 py-3 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#D4A373] text-black hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-lg"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                id="assessment-next-btn"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="px-5 py-3 rounded-full text-xs font-mono font-medium tracking-wider uppercase border border-white/10 hover:border-white/20 text-gray-300 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1.5"
              >
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Detailed Report Section */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-10 shadow-2xl relative"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A373]/10 border border-[#D4A373]/30 text-xs text-[#D4A373] font-mono tracking-wider uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              Your Connection Profile
            </div>
            <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
              {report.title}
            </h1>
            <p className="mt-4 text-sm font-mono text-gray-500">
              ATTACHMENT ASSESSMENT RESULTS (EDUCATIONAL SELF-REFLECTION)
            </p>
          </div>

          {/* Scoring Visualizer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Anxiety dimension card */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#D4A373] tracking-widest uppercase">Anxiety Dimension</span>
                <h4 className="text-2xl font-light text-white mt-1">Fear of Disconnection</h4>
                <p className="text-xs text-gray-400 mt-2 font-light">
                  Measures vigilance toward relationship security, need for verbal reassurance, and sensitivity to distance.
                </p>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-1.5">
                  <span>SECURE (1.0)</span>
                  <span className="text-white font-medium">YOUR SCORE: {anxietyScore.toFixed(1)} / 5.0</span>
                  <span>HYPER-VIGILANT (5.0)</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4A373] to-[#8E2430]" 
                    style={{ width: `${(anxietyScore / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Avoidance dimension card */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-[#D4A373] tracking-widest uppercase">Avoidance Dimension</span>
                <h4 className="text-2xl font-light text-white mt-1">Fear of Vulnerability</h4>
                <p className="text-xs text-gray-400 mt-2 font-light">
                  Measures reliance on self-soothing, resistance to emotional dependency, and withdrawal triggers.
                </p>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 mb-1.5">
                  <span>VULNERABLE (1.0)</span>
                  <span className="text-white font-medium">YOUR SCORE: {avoidanceScore.toFixed(1)} / 5.0</span>
                  <span>INDEPENDENT (5.0)</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#D4A373] to-[#6B0F1A]" 
                    style={{ width: `${(avoidanceScore / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Text */}
          <div className="bg-[#111111]/80 border border-[#D4A373]/10 rounded-2xl p-6 sm:p-8 mb-10">
            <h3 className="text-xs font-mono text-[#D4A373] tracking-widest uppercase mb-2">Profile Overview</h3>
            <p className="text-base sm:text-lg text-gray-300 font-light leading-relaxed">
              {report.desc}
            </p>
          </div>

          {/* Strengths & Challenges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Strengths */}
            <div>
              <h3 className="text-sm font-semibold text-[#D4A373] tracking-widest uppercase mb-4 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Connection Strengths
              </h3>
              <ul className="space-y-3.5">
                {report.strengths.map((str, i) => (
                  <li key={i} className="text-sm text-gray-300 font-light leading-relaxed flex items-start gap-2.5">
                    <span className="text-emerald-500 font-mono text-base select-none">✓</span>
                    {str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="text-sm font-semibold text-[#8E2430] tracking-widest uppercase mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Blind Spots & Challenges
              </h3>
              <ul className="space-y-3.5">
                {report.challenges.map((chal, i) => (
                  <li key={i} className="text-sm text-gray-300 font-light leading-relaxed flex items-start gap-2.5">
                    <span className="text-[#8E2430] font-mono text-base select-none">!</span>
                    {chal}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommended Habits / Growth Suggestions */}
          <div className="border-t border-white/5 pt-10">
            <h3 className="text-sm font-semibold text-white tracking-widest uppercase mb-6 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-[#D4A373]" />
              Your Path to Secure Connection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {report.habits.map((habit, i) => (
                <div key={i} className="bg-[#111111] border border-white/5 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#D4A373]" />
                  <span className="text-[10px] font-mono text-[#D4A373] uppercase tracking-wider block mb-2">HABIT {i + 1}</span>
                  <p className="text-xs text-gray-300 font-light leading-relaxed">{habit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final Action Bar */}
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              id="report-retake-btn"
              onClick={() => {
                setAnswers({});
                setCurrentIdx(0);
                setShowResults(false);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-mono text-gray-400 hover:text-white transition flex items-center justify-center gap-2 border border-white/5 hover:border-white/10"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retake Assessment
            </button>
            <button
              id="report-dashboard-btn"
              onClick={submitFinalResult}
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#6B0F1A] to-[#8E2430] hover:scale-105 transition-all text-white shadow-lg shadow-[#6B0F1A]/20"
            >
              Apply Profile & Unlock Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
