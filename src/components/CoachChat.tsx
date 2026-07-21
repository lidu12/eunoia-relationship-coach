import { useState, useRef, useEffect, FormEvent, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, Send, Trash2, Edit2, Download, Search, Plus, 
  Sparkles, Check, X, ShieldAlert, Heart, User, Clock, AlertCircle, HelpCircle
} from "lucide-react";
import { ChatSession, ChatMessage, User as UserType } from "../types";

interface CoachChatProps {
  userProfile: UserType;
  sessions: ChatSession[];
  onSaveSessions: (sessions: ChatSession[]) => void;
  activeSessionId: string | null;
  onSetActiveSessionId: (id: string | null) => void;
}

// Highly elegant custom markdown/text parser for rendering Eunoia's responses with luxury typography
function FormattedResponse({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-3.5 text-sm sm:text-base text-gray-200 font-light leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Subheaders
        if (trimmed.startsWith("###")) {
          return (
            <h4 key={idx} className="text-base font-semibold text-[#D4A373] tracking-wide pt-2">
              {trimmed.replace(/^###\s*/, "")}
            </h4>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h3 key={idx} className="text-lg font-medium text-white tracking-tight pt-3">
              {trimmed.replace(/^##\s*/, "")}
            </h3>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h2 key={idx} className="text-xl font-light text-[#D4A373] tracking-tight pt-4">
              {trimmed.replace(/^#\s*/, "")}
            </h2>
          );
        }

        // Bullet lists
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          // Check for bold text within the bullet
          const content = trimmed.replace(/^[-*]\s*/, "");
          return (
            <li key={idx} className="list-none pl-5 relative text-gray-300">
              <span className="absolute left-0 text-[#D4A373] font-bold">•</span>
              {renderBoldText(content)}
            </li>
          );
        }

        // Ordered lists
        if (/^\d+\.\s*/.test(trimmed)) {
          const content = trimmed.replace(/^\d+\.\s*/, "");
          const match = trimmed.match(/^(\d+)\.\s*/);
          const num = match ? match[1] : "1";
          return (
            <li key={idx} className="list-none pl-5 relative text-gray-300">
              <span className="absolute left-0 text-[#D4A373] font-mono text-xs">{num}.</span>
              {renderBoldText(content)}
            </li>
          );
        }

        return <p key={idx}>{renderBoldText(trimmed)}</p>;
      })}
    </div>
  );
}

// Helper to support bold text rendering (e.g. **text**)
function renderBoldText(raw: string) {
  const parts = raw.split(/\*\*([^*]+)\*\*/g);
  if (parts.length === 1) return raw;

  return parts.map((part, i) => {
    if (i % 2 === 1) {
      return <strong key={i} className="font-semibold text-white">{part}</strong>;
    }
    return part;
  });
}

export default function CoachChat({ 
  userProfile, 
  sessions, 
  onSaveSessions, 
  activeSessionId, 
  onSetActiveSessionId 
}: CoachChatProps) {
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, isGenerating, activeSessionId]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  // Search filtered sessions
  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: `Reflection Log ${sessions.length + 1}`,
      createdAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: `msg_welcome_${Date.now()}`,
          role: "assistant",
          content: `Welcome back, ${userProfile.name || "friend"}. 

I am **Eunoia**, your personal relationship coach. I am holding a non-judgmental, warm space for you today. 

As your coach, I am automatically guided by your unique profile traits:
- **Attachment Pattern**: ${userProfile.attachmentStyle || "Awaiting Assessment"}
- **Communication Focus**: ${userProfile.relationshipStatus || "General Connection Guidance"}

What is on your heart today? Whether it is minor friction with a loved one, a recurring pattern of self-doubt, or just an emotional check-in, let's explore it together.`,
          timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    onSaveSessions([newSession, ...sessions]);
    onSetActiveSessionId(newSession.id);
  };

  const deleteSession = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    onSaveSessions(updated);
    if (activeSessionId === id) {
      onSetActiveSessionId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const startRename = (session: ChatSession, e: MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const saveRename = (e: FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const updated = sessions.map(s => 
      s.id === editingSessionId ? { ...s, title: editTitle } : s
    );
    onSaveSessions(updated);
    setEditingSessionId(null);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;

    let currentSession = activeSession;
    let updatedSessions = [...sessions];

    // Auto-create session if none active
    if (!currentSession) {
      const newSId = `session_${Date.now()}`;
      currentSession = {
        id: newSId,
        title: inputText.slice(0, 24) + (inputText.length > 24 ? "..." : ""),
        createdAt: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        messages: []
      };
      updatedSessions = [currentSession, ...sessions];
      onSetActiveSessionId(newSId);
    }

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: "user",
      content: inputText,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    const sessionWithUser = {
      ...currentSession,
      messages: [...currentSession.messages, userMsg],
      title: currentSession.messages.length === 1 
        ? inputText.slice(0, 24) + (inputText.length > 24 ? "..." : "")
        : currentSession.title
    };

    // Save immediate user state
    const savedWithUser = updatedSessions.map(s => s.id === sessionWithUser.id ? sessionWithUser : s);
    onSaveSessions(savedWithUser);
    setInputText("");
    setIsGenerating(true);

    try {
      // API payload to custom server route
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: sessionWithUser.messages,
          userProfile: {
            attachmentStyle: userProfile.attachmentStyle,
            communicationStyle: userProfile.relationshipStatus,
            conflictStyle: userProfile.primaryGoal,
            goals: userProfile.primaryGoal ? [userProfile.primaryGoal] : []
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to secure Eunoia service");
      }

      const data = await response.json();

      const coachMsg: ChatMessage = {
        id: `msg_coach_${Date.now()}`,
        role: "assistant",
        content: data.content,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };

      const finalSession = {
        ...sessionWithUser,
        messages: [...sessionWithUser.messages, coachMsg]
      };

      onSaveSessions(savedWithUser.map(s => s.id === finalSession.id ? finalSession : s));
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg_error_${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I had a momentary lapse in my connection. Let me gather my thoughts. Please verify your GEMINI_API_KEY inside the Secrets tab or retry in a moment.",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      const finalSession = {
        ...sessionWithUser,
        messages: [...sessionWithUser.messages, errorMsg]
      };
      onSaveSessions(savedWithUser.map(s => s.id === finalSession.id ? finalSession : s));
    } finally {
      setIsGenerating(false);
    }
  };

  const exportChatHistory = () => {
    if (!activeSession) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(activeSession, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `Eunoia_Chat_Export_${activeSession.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="coach-chat-layout" className="h-[calc(100vh-80px)] flex bg-[#111111] overflow-hidden">
      
      {/* Sidebar - Sessions controller */}
      <aside id="chat-sidebar" className="w-80 border-r border-white/5 bg-[#161616] hidden md:flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-white/5 space-y-4">
          <button
            id="new-chat-btn"
            onClick={createNewSession}
            className="w-full py-3.5 px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase bg-[#6B0F1A] hover:bg-[#8E2430] text-white flex items-center justify-center gap-2 transition duration-200 shadow-md border border-[#D4A373]/15"
          >
            <Plus className="w-4 h-4" />
            New Reflection
          </button>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search reflections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-lg pl-9 pr-4 py-2 text-xs text-gray-300 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Sessions list */}
        <div id="sessions-list" className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-600 font-light font-mono">
              No entries found.
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = session.id === editingSessionId;

              return (
                <div
                  key={session.id}
                  id={`session-item-${session.id}`}
                  onClick={() => !isEditing && onSetActiveSessionId(session.id)}
                  className={`group relative p-3 rounded-xl flex items-center justify-between cursor-pointer transition ${
                    isActive 
                      ? "bg-[#1B1B1B] border border-white/5 shadow-inner" 
                      : "hover:bg-[#1B1B1B]/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-8">
                    <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#D4A373]" : "text-gray-500"}`} />
                    
                    {isEditing ? (
                      <form onSubmit={saveRename} className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="bg-[#111111] border border-white/10 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none font-sans"
                          autoFocus
                        />
                        <button type="submit" className="text-emerald-500 hover:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => setEditingSessionId(null)} className="text-rose-500 hover:text-rose-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    ) : (
                      <div className="min-w-0">
                        <p className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-gray-400"}`}>
                          {session.title}
                        </p>
                        <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                          {session.createdAt}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sidebar quick actions */}
                  {!isEditing && (
                    <div className="absolute right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                      <button
                        onClick={(e) => startRename(session, e)}
                        className="p-1 hover:text-[#D4A373] text-gray-500 transition"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => deleteSession(session.id, e)}
                        className="p-1 hover:text-rose-500 text-gray-500 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar bottom guide */}
        <div className="p-4 bg-[#111111] border-t border-white/5 text-[11px] text-gray-500 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
          <span>Attachment Style context loaded</span>
        </div>
      </aside>

      {/* Main Chat Feed */}
      <section id="chat-main" className="flex-1 flex flex-col bg-[#111111] relative">
        
        {/* Dynamic header */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-[#111111] z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#6B0F1A]/20 flex items-center justify-center border border-[#6B0F1A]/40 text-[#D4A373] font-bold text-xs">
              E
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-wide">Eunoia AI Relationship Coach</h3>
              {userProfile.attachmentStyle ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] font-mono text-[#D4A373] uppercase tracking-wider">
                    {userProfile.attachmentStyle} Coach mode active
                  </p>
                </div>
              ) : (
                <p className="text-[10px] font-mono text-gray-500">General reflection mode</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSession && (
              <button
                id="export-chat-btn"
                onClick={exportChatHistory}
                className="p-2 text-gray-400 hover:text-[#D4A373] rounded-lg hover:bg-white/5 transition"
                title="Export session data"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Chat message stream */}
        <div id="messages-container" className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeSession ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#6B0F1A]/20 border border-[#6B0F1A]/30 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#D4A373]" />
              </div>
              <h4 className="text-base font-medium text-white mb-1">Empathetic space ready</h4>
              <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
                Map out relationship anxieties, conflict triggers, or security milestones. Start a new session.
              </p>
              <button
                onClick={createNewSession}
                className="px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#6B0F1A] text-white border border-[#D4A373]/10"
              >
                New Reflection Log
              </button>
            </div>
          ) : (
            <>
              {activeSession.messages.map((msg) => {
                const isCoach = msg.role === "assistant";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-4 max-w-3xl ${isCoach ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                  >
                    {/* Message profile avatar */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 border ${
                      isCoach 
                        ? "bg-[#111111] border-[#6B0F1A]/30 text-[#D4A373]" 
                        : "bg-[#D4A373]/20 border-[#D4A373]/30 text-white"
                    }`}>
                      {isCoach ? "E" : <User className="w-4 h-4" />}
                    </div>

                    {/* Speech card */}
                    <div className={`rounded-2xl p-4 sm:p-5 border shadow-md relative ${
                      isCoach 
                        ? "bg-[#1B1B1B] border-white/5" 
                        : "bg-gradient-to-tr from-[#6B0F1A]/30 to-[#8E2430]/20 border-[#8E2430]/30"
                    }`}>
                      {isCoach ? (
                        <FormattedResponse text={msg.content} />
                      ) : (
                        <p className="text-sm text-gray-200 font-light leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}
                      <span className="block text-[9px] font-mono text-gray-500 mt-2.5 text-right uppercase">
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {/* Generating loading skeleton */}
              {isGenerating && (
                <div className="flex gap-4 max-w-xl mr-auto animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-[#1B1B1B] border border-white/5 flex items-center justify-center font-mono text-xs text-[#D4A373]">
                    E
                  </div>
                  <div className="bg-[#1B1B1B] border border-white/5 rounded-2xl p-5 space-y-3.5 flex-1">
                    <div className="h-4 bg-white/10 rounded w-1/4" />
                    <div className="h-4 bg-white/5 rounded w-full" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        {/* Input box */}
        {activeSession && (
          <form 
            id="chat-input-form"
            onSubmit={handleSendMessage} 
            className="p-4 border-t border-white/5 bg-[#161616] z-10"
          >
            <div className="max-w-4xl mx-auto flex gap-3">
              <input
                id="chat-input-field"
                type="text"
                placeholder={isGenerating ? "Reflecting on your insights..." : "Message Eunoia relationship coach..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isGenerating}
                className="flex-1 bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none placeholder-gray-500 disabled:opacity-50 font-light"
              />
              <button
                id="chat-submit-btn"
                type="submit"
                disabled={!inputText.trim() || isGenerating}
                className="w-12 h-12 rounded-xl bg-[#6B0F1A] hover:bg-[#8E2430] active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition duration-200 border border-[#D4A373]/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}
