import { useState, FormEvent } from "react";
import { User, AttachmentStyle } from "../types";
import { User as UserIcon, Heart, Compass, Eye, ShieldAlert, Check, RefreshCw, Settings, LogOut } from "lucide-react";

interface ProfileProps {
  userProfile: User;
  onSaveProfile: (profile: User) => void;
  onResetAssessment: () => void;
  onLogout: () => void;
}

export default function Profile({ userProfile, onSaveProfile, onResetAssessment, onLogout }: ProfileProps) {
  const [name, setName] = useState(userProfile.name || "");
  const [relationshipStatus, setRelationshipStatus] = useState(userProfile.relationshipStatus || "Single");
  const [primaryGoal, setPrimaryGoal] = useState(userProfile.primaryGoal || "Improve general communication");
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...userProfile,
      name,
      relationshipStatus,
      primaryGoal
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div id="profile-container-layout" className="max-w-3xl mx-auto px-4 py-8 font-sans">
      
      {/* Title */}
      <div className="mb-8">
        <span className="text-xs font-mono text-[#D4A373] tracking-widest uppercase">Self & Bond Registry</span>
        <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">Your Profile & Settings</h1>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card Form */}
        <form onSubmit={handleSave} className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-6">
            <div className="w-14 h-14 rounded-full bg-[#6B0F1A]/20 flex items-center justify-center border border-[#6B0F1A]/30 text-white font-bold text-xl font-mono">
              {name.slice(0, 2).toUpperCase() || "EU"}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{name || "Self-Explorer"}</h3>
              <p className="text-xs font-mono text-gray-500">{userProfile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-mono">Display Name</label>
              <input
                id="profile-name-field"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none"
              />
            </div>

            {/* Relationship Status */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 block font-mono">Current Bond Status</label>
              <select
                id="profile-status-select"
                value={relationshipStatus}
                onChange={(e) => setRelationshipStatus(e.target.value)}
                className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none"
              >
                <option value="Single">Single / Self-Regulating</option>
                <option value="In a relationship">In a Relationship / Bonded</option>
                <option value="Married">Married / Anchored</option>
                <option value="Complicated">It's Complicated</option>
                <option value="Navigating space">Navigating Space / Separated</option>
              </select>
            </div>
          </div>

          {/* Primary Connection Goal */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 block font-mono">Primary Relationship Intention</label>
            <input
              id="profile-goal-field"
              type="text"
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              placeholder="E.g., Practice vulnerability, reduce conflict withdrawals..."
              className="w-full bg-[#111111] border border-white/5 focus:border-[#D4A373]/30 rounded-xl px-4 py-3 text-xs text-gray-300 focus:outline-none font-light"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-xs text-gray-500 font-light font-mono flex items-center gap-1">
              <Settings className="w-4 h-4 text-gray-500" /> Settings secured
            </span>
            <div className="flex items-center gap-3">
              {isSaved && (
                <span className="text-xs text-emerald-500 font-mono flex items-center gap-1">
                  <Check className="w-4 h-4" /> Changes Applied
                </span>
              )}
              <button
                id="save-profile-btn"
                type="submit"
                className="px-6 py-3 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#D4A373] text-black hover:bg-white transition"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </form>

        {/* Attachment Profile History */}
        <div className="bg-[#1B1B1B] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <h3 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2">
            <Compass className="text-[#D4A373] w-4.5 h-4.5" />
            Attachment Style History
          </h3>

          <div className="bg-[#111111] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/5">
            <div>
              <p className="text-[10px] font-mono text-[#D4A373] uppercase tracking-wider">ACTIVE BLUEPRINT</p>
              <h4 className="text-xl font-light text-white mt-1">
                {userProfile.attachmentStyle || "No Assessment Conducted"}
              </h4>
              <p className="text-xs text-gray-500 font-light mt-1.5 leading-relaxed">
                Determines how Eunoia AI structures your reflection feedback and challenges.
              </p>
            </div>
            <button
              id="profile-retake-btn"
              onClick={onResetAssessment}
              className="py-3 px-5 rounded-full text-xs font-mono font-bold tracking-wider uppercase border border-[#8E2430]/30 hover:bg-[#8E2430]/10 text-[#D4A373] flex items-center justify-center gap-2 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset & Retake
            </button>
          </div>
        </div>

        {/* Logout control */}
        <div className="bg-[#1B1B1B]/40 border border-white/5 rounded-3xl p-6 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">End Current Session</h4>
            <p className="text-xs text-gray-500 font-light mt-0.5">Disconnect safely from the Eunoia platform.</p>
          </div>
          <button
            id="profile-logout-btn"
            onClick={onLogout}
            className="py-3 px-5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#8E2430]/10 border border-[#8E2430]/20 hover:bg-[#8E2430]/20 text-rose-400 flex items-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
