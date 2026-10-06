import React from "react";
import { MannMitraicon, MannMitraname } from "../../../assets";
import {
  Heart,
  Shield,
  Bot,
  Calendar,
  Sparkles,
  ArrowRight,
  Wind,
  CheckCircle2,
  X
} from "lucide-react";
import "./WelcomeModals.css";

export default function NewUserWelcomeModal({ isOpen, onClose, userName = "Friend" }) {
  if (!isOpen) return null;

  return (
    <div className="mm-welcome-modal-overlay" onClick={(e) => {
      if (e.target.classList.contains("mm-welcome-modal-overlay")) onClose();
    }}>
      <div className="mm-welcome-card new-user">
        {/* Subtle close button in corner */}
        <button onClick={onClose} className="mm-modal-close-btn" title="Close">
          <X className="w-5 h-5 text-zinc-400 hover:text-white" />
        </button>

        {/* Ambient Top Glow */}
        <div className="mm-card-glow-orb emerald" />

        {/* Brand Header with Logo */}
        <div className="mm-welcome-header">
          <div className="mm-welcome-logo-badge">
            <img src={MannMitraicon} alt="MannMitra" className="mm-welcome-logo-icon" />
            <img src={MannMitraname} alt="MannMitra" className="mm-welcome-logo-name" />
          </div>

          <div className="mm-safe-haven-tag">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>YOUR CONFIDENTIAL SAFE HAVEN</span>
          </div>

          <h2 className="mm-welcome-title">
            Welcome to MannMitra, <span className="mm-highlight-name">{userName}</span>! 🌸
          </h2>
          <p className="mm-welcome-subtitle">
            Taking the first step towards your mental well-being takes immense strength. We are genuinely honored to walk beside you.
          </p>
        </div>

        {/* Core Pillars / What MannMitra Offers */}
        <div className="mm-pillars-grid">
          <div className="mm-pillar-item">
            <div className="mm-pillar-icon bot">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mm-pillar-text">
              <h4>24/7 AI Companion</h4>
              <p>An empathetic friend who listens without judgment whenever you feel anxious, overwhelmed, or lonely.</p>
            </div>
          </div>

          <div className="mm-pillar-item">
            <div className="mm-pillar-icon shield">
              <Shield className="w-5 h-5 text-teal-400" />
            </div>
            <div className="mm-pillar-text">
              <h4>100% Confidential & Secure</h4>
              <p>Your thoughts and sessions are strictly private. Zero public AI training, zero advertising tracking.</p>
            </div>
          </div>

          <div className="mm-pillar-item">
            <div className="mm-pillar-icon calendar">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="mm-pillar-text">
              <h4>Verified Professional Care</h4>
              <p>Schedule one-on-one appointments with top certified psychologists and clinical therapists anytime.</p>
            </div>
          </div>
        </div>

        {/* Calming Mindfulness Note */}
        <div className="mm-breath-banner">
          <Wind className="w-5 h-5 text-emerald-300 shrink-0" />
          <div>
            <strong>A gentle reminder for today:</strong>
            <p>You don't have to carry everything by yourself anymore. Take a deep, slow breath — you are safe here.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mm-welcome-actions">
          <button onClick={onClose} className="mm-welcome-cta-btn">
            <span>Begin My Wellness Journey</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
