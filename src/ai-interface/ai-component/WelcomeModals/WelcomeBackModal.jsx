import React, { useState } from "react";
import { MannMitraBrainLogo, MannMitraname } from "../../../assets";
import {
  Heart,
  Sparkles,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  CloudRain,
  Flame,
  X,
  CheckCircle2
} from "lucide-react";
import "./WelcomeModals.css";

export default function WelcomeBackModal({ isOpen, onClose, userName = "Friend", onSelectMood }) {
  const [selectedMood, setSelectedMood] = useState(null);

  if (!isOpen) return null;

  const moods = [
    { id: "peaceful", label: "Peaceful", emoji: "🌸", desc: "Feeling calm & steady" },
    { id: "overwhelmed", label: "A Bit Overwhelmed", emoji: "🌊", desc: "Too much on my mind" },
    { id: "stressed", label: "Stressed / Exam Pressure", emoji: "⚡", desc: "Under high tension" },
    { id: "low", label: "Low & Need to Vent", emoji: "💭", desc: "Want a listening ear" },
    { id: "hopeful", label: "Hopeful & Ready", emoji: "✨", desc: "Ready to make progress" }
  ];

  const handleContinue = () => {
    if (selectedMood && onSelectMood) {
      onSelectMood(selectedMood);
    }
    onClose();
  };

  return (
    <div className="mm-welcome-modal-overlay" onClick={(e) => {
      if (e.target.classList.contains("mm-welcome-modal-overlay")) onClose();
    }}>
      <div className="mm-welcome-card welcome-back">
        {/* Close Button */}
        <button onClick={onClose} className="mm-modal-close-btn" title="Close">
          <X className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>

        {/* Ambient Top Glow */}
        <div className="mm-card-glow-orb purple" />

        {/* Brand Header */}
        <div className="mm-welcome-header">
          <div className="mm-welcome-logo-badge">
            <img src={MannMitraBrainLogo} alt="MannMitra" className="mm-welcome-logo-icon" />
            <img src={MannMitraname} alt="MannMitra" className="mm-welcome-logo-name" />
          </div>

          <div className="mm-safe-haven-tag back">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>SESSION SYNCHRONIZED</span>
          </div>

          <h2 className="mm-welcome-title">
            Welcome Back, <span className="mm-highlight-name">{userName}</span>! 🌿
          </h2>
          <p className="mm-welcome-subtitle">
            Taking time out of your day to check in with yourself is a quiet superpower. How are you feeling in this moment?
          </p>
        </div>

        {/* Interactive Mood Quick Check-In */}
        <div className="mm-mood-checkin-section">
          <div className="mm-mood-header">
            <span>Quick Mood Check-In</span>
            {selectedMood && <span className="mm-mood-selected-tag">Selected</span>}
          </div>

          <div className="mm-mood-pills-grid">
            {moods.map((m) => {
              const isSelected = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedMood(m.id)}
                  className={`mm-mood-pill ${isSelected ? "selected" : ""}`}
                >
                  <span className="mm-mood-emoji">{m.emoji}</span>
                  <div className="mm-mood-text">
                    <span className="font-semibold text-xs">{m.label}</span>
                    <span className="text-[10px] text-zinc-400">{m.desc}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Thoughtful Quote Banner */}
        <div className="mm-thought-quote">
          <Heart className="w-4 h-4 text-rose-400 shrink-0" />
          <p>
            "You don't have to control your thoughts. You just have to stop letting them control you."
          </p>
        </div>

        {/* Actions */}
        <div className="mm-welcome-actions">
          <button onClick={handleContinue} className="mm-welcome-cta-btn purple">
            <span>Continue to My Sanctuary</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
