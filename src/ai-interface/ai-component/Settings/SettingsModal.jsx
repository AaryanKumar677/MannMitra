import React, { useState, useEffect, useContext, useRef } from "react";
import {
  X,
  Search,
  User,
  Shield,
  Bot,
  Bell,
  Palette,
  Accessibility,
  Globe,
  Sparkles,
  Lock,
  Download,
  Trash2,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Copy,
  ExternalLink,
  Moon,
  Sun,
  Laptop,
  Heart,
  Save,
  LogOut,
  Camera,
  Activity,
  Compass,
  Check,
  ShieldAlert,
  Flame,
  Wind
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Context } from "../../context/Context";
import { updateProfile } from "../../../config/auth";
import "./SettingsModal.css";

const SETTINGS_SECTIONS = [
  {
    id: "account",
    label: "My Account",
    category: "USER PROFILE",
    icon: User,
    badge: null,
    desc: "Personal info, anonymous alias & emergency contact"
  },
  {
    id: "ai_companion",
    label: "AI Companion",
    category: "EXPERIENCE",
    icon: Bot,
    badge: "SMART",
    desc: "Companion empathy tone, response depth & guardrails"
  },
  {
    id: "privacy",
    label: "Data & Privacy",
    category: "EXPERIENCE",
    icon: Shield,
    badge: "ENCRYPTED",
    desc: "Confidentiality, chat retention & data export"
  },
  {
    id: "notifications",
    label: "Notifications",
    category: "APP PREFERENCES",
    icon: Bell,
    badge: null,
    desc: "Daily wellness check-ins & quiet hours"
  },
  {
    id: "appearance",
    label: "Appearance",
    category: "APP PREFERENCES",
    icon: Palette,
    badge: "NEW",
    desc: "Dark/Light mode, calming color palettes & fonts"
  },
  {
    id: "accessibility",
    label: "Accessibility & Safety",
    category: "APP PREFERENCES",
    icon: Accessibility,
    badge: "SAFETY",
    desc: "Panic quick-exit, contrast & breathwork tool"
  },
  {
    id: "helplines",
    label: "Language & SOS",
    category: "SYSTEM & SUPPORT",
    icon: Globe,
    badge: "24/7 SOS",
    desc: "Multilingual AI support & verified crisis hotlines"
  }
];

export default function SettingsModal({
  isOpen,
  onClose,
  initialSection = "account",
  onTriggerPortal,
  onTriggerNewUserModal,
  onTriggerWelcomeBackModal
}) {
  const { user, profile: authProfile, signOut } = useAuth() || {};
  const { conversations, setConversations, setCurrentChatId } = useContext(Context) || {};

  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale");
  const [breathingTimer, setBreathingTimer] = useState(4);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    email: ""
  });

  // AI Preferences state
  const [aiSettings, setAiSettings] = useState({
    persona: "empathetic",
    responseLength: "balanced",
    crisisBanner: true,
    suggestStarters: true,
    includeAffirmations: true
  });

  // Privacy & Data state
  const [privacySettings, setPrivacySettings] = useState({
    retention: "forever",
    incognito: false,
    analyticsOptOut: true,
    encryptLocally: true
  });

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    morningCheckIn: true,
    morningTime: "08:30",
    eveningCheckIn: true,
    eveningTime: "21:30",
    bookingAlerts: true,
    quietHours: true,
    soundChime: true
  });

  // Appearance state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "dark",
    accentColor: "emerald",
    fontSize: "standard",
    relaxedSpacing: false,
    reducedMotion: false
  });

  // Accessibility state
  const [accessSettings, setAccessSettings] = useState({
    panicButton: true,
    highContrast: false,
    dyslexicFont: false,
    screenReaderHelper: false
  });

  // Language & SOS state
  const [langSettings, setLangSettings] = useState({
    aiLanguage: "english_hinglish",
    timeFormat: "12h"
  });

  // Load saved preferences from localStorage & Auth on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("theme") || "dark";
      const savedAi = localStorage.getItem("mann_ai_settings");
      const savedPrivacy = localStorage.getItem("mann_privacy_settings");
      const savedNotif = localStorage.getItem("mann_notif_settings");
      const savedAppearance = localStorage.getItem("mann_appearance_settings");
      const savedAccess = localStorage.getItem("mann_access_settings");
      const savedLang = localStorage.getItem("mann_lang_settings");
      const savedNickname = localStorage.getItem("mann_user_nickname") || "";
      const savedEmergName = localStorage.getItem("mann_emerg_name") || "";
      const savedEmergPhone = localStorage.getItem("mann_emerg_phone") || "";

      if (savedAi) setAiSettings(prev => ({ ...prev, ...JSON.parse(savedAi) }));
      if (savedPrivacy) setPrivacySettings(prev => ({ ...prev, ...JSON.parse(savedPrivacy) }));
      if (savedNotif) setNotifSettings(prev => ({ ...prev, ...JSON.parse(savedNotif) }));
      if (savedAppearance) {
        const parsed = JSON.parse(savedAppearance);
        setAppearanceSettings(prev => ({ ...prev, ...parsed, theme: savedTheme }));
      } else {
        setAppearanceSettings(prev => ({ ...prev, theme: savedTheme }));
      }
      if (savedAccess) setAccessSettings(prev => ({ ...prev, ...JSON.parse(savedAccess) }));
      if (savedLang) setLangSettings(prev => ({ ...prev, ...JSON.parse(savedLang) }));

      if (authProfile) {
        setProfileForm({
          firstName: authProfile.first_name || "",
          lastName: authProfile.last_name || "",
          nickname: savedNickname || authProfile.nickname || "MindfulFriend",
          emergencyContactName: savedEmergName || authProfile.emergency_contact_name || "",
          emergencyContactPhone: savedEmergPhone || authProfile.emergency_contact_phone || "",
          email: authProfile.email || (user ? user.email : "guest@mannmitra.org")
        });
      } else if (user) {
        setProfileForm({
          firstName: user.displayName ? user.displayName.split(" ")[0] : "Friend",
          lastName: user.displayName ? user.displayName.split(" ").slice(1).join(" ") : "",
          nickname: savedNickname || "MindfulFriend",
          emergencyContactName: savedEmergName,
          emergencyContactPhone: savedEmergPhone,
          email: user.email || "guest@mannmitra.org"
        });
      } else {
        setProfileForm(prev => ({
          ...prev,
          firstName: "Guest",
          lastName: "User",
          nickname: savedNickname || "MindfulFriend",
          emergencyContactName: savedEmergName,
          emergencyContactPhone: savedEmergPhone,
          email: "guest@mannmitra.org"
        }));
      }
    } catch (err) {
      console.warn("Failed loading saved settings:", err);
    }
  }, [authProfile, user, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (showBreathingModal) {
          setShowBreathingModal(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showBreathingModal, onClose]);

  // Breathing Guide Animation
  useEffect(() => {
    let interval = null;
    if (showBreathingModal) {
      let currentSec = 4;
      let phase = "Inhale";
      setBreathingPhase("Inhale");
      setBreathingTimer(4);

      interval = setInterval(() => {
        currentSec -= 1;
        if (currentSec <= 0) {
          if (phase === "Inhale") {
            phase = "Hold";
            currentSec = 7;
          } else if (phase === "Hold") {
            phase = "Exhale";
            currentSec = 8;
          } else {
            phase = "Inhale";
            currentSec = 4;
          }
          setBreathingPhase(phase);
        }
        setBreathingTimer(currentSec);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showBreathingModal]);

  if (!isOpen) return null;

  // Sound chime test
  const playMeditationChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio Love/Healing frequency
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(532, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.6);
      osc2.stop(ctx.currentTime + 2.6);
    } catch (err) {
      console.log("Audio preview not available", err);
    }
  };

  // Theme change handler
  const handleThemeChange = (newTheme) => {
    setAppearanceSettings(prev => ({ ...prev, theme: newTheme }));
    if (newTheme === "dark") {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else if (newTheme === "light") {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      // System
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
      }
    }
  };

  // Save changes
  const saveAllSettings = async () => {
    try {
      setSaveStatus("saving");

      // Save localStorage preferences
      localStorage.setItem("mann_ai_settings", JSON.stringify(aiSettings));
      localStorage.setItem("mann_privacy_settings", JSON.stringify(privacySettings));
      localStorage.setItem("mann_notif_settings", JSON.stringify(notifSettings));
      localStorage.setItem("mann_appearance_settings", JSON.stringify(appearanceSettings));
      localStorage.setItem("mann_access_settings", JSON.stringify(accessSettings));
      localStorage.setItem("mann_lang_settings", JSON.stringify(langSettings));
      localStorage.setItem("mann_user_nickname", profileForm.nickname);
      localStorage.setItem("mann_emerg_name", profileForm.emergencyContactName);
      localStorage.setItem("mann_emerg_phone", profileForm.emergencyContactPhone);

      // Save profile to Auth if logged in
      if (user && updateProfile) {
        await updateProfile(user.uid, {
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          nickname: profileForm.nickname,
          emergency_contact_name: profileForm.emergencyContactName,
          emergency_contact_phone: profileForm.emergencyContactPhone
        }, user);
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  // Export conversations to JSON/Text
  const handleExportData = () => {
    try {
      const dataToExport = {
        platform: "MannMitra AI Mental Wellness Companion",
        exportDate: new Date().toISOString(),
        userNickname: profileForm.nickname || "Anonymous",
        activeConversationsCount: conversations ? conversations.length : 0,
        conversations: (conversations || []).map(chat => ({
          title: chat.title,
          id: chat.id,
          messageCount: chat.messages ? chat.messages.length : 0,
          messages: chat.messages || []
        })),
        privacyNotice: "This file contains your confidential self-care data. Keep it secure."
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `MannMitra_Confidential_Export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setCopyFeedback("Data exported successfully!");
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export chat data.");
    }
  };

  // Clear all conversations
  const handleClearConversations = () => {
    if (setConversations) {
      setConversations([]);
    }
    if (setCurrentChatId) {
      setCurrentChatId(null);
    }
    setShowClearConfirm(false);
    setCopyFeedback("All conversation transcripts cleared securely.");
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Copy helpline number
  const handleCopy = (text, name) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${name}: ${text}`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Filter sections by search query
  const filteredSections = SETTINGS_SECTIONS.filter(section => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      section.label.toLowerCase().includes(q) ||
      section.desc.toLowerCase().includes(q) ||
      section.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mm-settings-overlay" onClick={(e) => {
      if (e.target.classList.contains("mm-settings-overlay")) onClose();
    }}>
      <div className="mm-settings-window">
        {/* TOP BAR / DISCORD & CHATGPT STYLE MODAL HEADER */}
        <div className="mm-settings-topbar">
          <div className="mm-settings-brand">
            <div className="mm-brand-icon">
              <Heart className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="mm-brand-title">MannMitra Settings & Preferences</h2>
              <p className="mm-brand-subtitle">
                Confidential Mental Health Care, AI Companion & Privacy Controls
              </p>
            </div>
          </div>

          {/* TOP SECTION PILLS / HORIZONTAL SECTIONS NAVIGATION */}
          <div className="mm-settings-top-tabs custom-scrollbar">
            {SETTINGS_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    setSearchQuery("");
                  }}
                  className={`mm-top-tab-btn ${isActive ? "active" : ""}`}
                  title={sec.label}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{sec.label}</span>
                  {sec.badge && (
                    <span className={`mm-tab-badge ${sec.badge.toLowerCase().replace(/[^a-z]/g, "")}`}>
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* DISCORD-STYLE CLOSE BUTTON (ESC) */}
          <div className="mm-esc-container" onClick={onClose} title="Close settings (Esc)">
            <div className="mm-esc-btn">
              <X className="w-5 h-5" />
            </div>
            <span className="mm-esc-label">ESC</span>
          </div>
        </div>

        {/* FEEDBACK TOAST BANNER */}
        {copyFeedback && (
          <div className="mm-toast-banner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{copyFeedback}</span>
          </div>
        )}

        {/* MAIN BODY: 2-COLUMN LAYOUT (DISCORD SIDEBAR + RIGHT CONTENT PANE) */}
        <div className="mm-settings-body">
          {/* LEFT SIDEBAR */}
          <div className="mm-settings-sidebar custom-scrollbar">
            {/* Search Input (Discord style) */}
            <div className="mm-sidebar-search">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="mm-clear-search">
                  <X className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              )}
            </div>

            {/* Navigation List grouped by Category */}
            <div className="mm-sidebar-nav">
              {filteredSections.length === 0 ? (
                <div className="mm-no-results">No settings match "{searchQuery}"</div>
              ) : (
                filteredSections.map((sec, idx) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  const prevSec = filteredSections[idx - 1];
                  const showCategoryHeader = !prevSec || prevSec.category !== sec.category;

                  return (
                    <React.Fragment key={sec.id}>
                      {showCategoryHeader && (
                        <div className="mm-sidebar-category-header">
                          {sec.category}
                        </div>
                      )}
                      <button
                        onClick={() => setActiveSection(sec.id)}
                        className={`mm-sidebar-item ${isActive ? "active" : ""}`}
                      >
                        <div className="mm-item-left">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="mm-item-label">{sec.label}</span>
                        </div>
                        {sec.badge && (
                          <span className={`mm-badge ${sec.badge.toLowerCase().replace(/[^a-z]/g, "")}`}>
                            {sec.badge}
                          </span>
                        )}
                      </button>
                    </React.Fragment>
                  );
                })
              )}
            </div>

            {/* MINI PROFILE FOOTER */}
            <div className="mm-sidebar-profile-card">
              <div className="mm-profile-avatar-wrap">
                <div className="mm-avatar-circle">
                  {profileForm.firstName ? profileForm.firstName[0].toUpperCase() : "M"}
                </div>
                <div className="mm-online-dot" title="Confidential Session Online" />
              </div>
              <div className="mm-profile-info">
                <div className="mm-user-display-name">
                  {profileForm.nickname || profileForm.firstName || "MannMitra Friend"}
                </div>
                <div className="mm-user-status-text">
                  {user ? "Encrypted Account" : "Guest Mode"}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT PANE */}
          <div className="mm-settings-content custom-scrollbar">
            {/* ========================================================
                SECTION 1: MY ACCOUNT & PROFILE
               ======================================================== */}
            {activeSection === "account" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>My Account & Profile</h3>
                  <p>Manage your identity, anonymous alias, and crisis contact information.</p>
                </div>

                <div className="mm-security-badge-banner">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong>End-to-End Confidentiality</strong>
                    <p>Your mental health discussions are private. We never sell your personal data.</p>
                  </div>
                </div>

                {/* Profile Avatar & Identity Card */}
                <div className="mm-card">
                  <div className="mm-card-row">
                    <div className="mm-avatar-large">
                      <span>{profileForm.firstName ? profileForm.firstName[0].toUpperCase() : "M"}</span>
                    </div>
                    <div className="mm-card-col">
                      <h4>{profileForm.firstName || "Friend"} {profileForm.lastName || ""}</h4>
                      <p className="text-zinc-400 text-sm">{profileForm.email}</p>
                      <span className="mm-pill-badge">
                        {user ? "Verified Member" : "Anonymous Guest Session"}
                      </span>
                    </div>
                  </div>

                  <div className="mm-grid-2">
                    <div className="mm-form-group">
                      <label>First Name</label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        placeholder="Your first name"
                      />
                    </div>
                    <div className="mm-form-group">
                      <label>Last Name</label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div className="mm-form-group">
                    <label>
                      Anonymous Alias / Safe Nickname
                      <span className="mm-field-tip">Used when you want full privacy in conversations</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.nickname}
                      onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                      placeholder="e.g. CalmSky, SereneHeart, Phoenix"
                    />
                  </div>
                </div>

                {/* Emergency Contact Card */}
                <div className="mm-card">
                  <div className="mm-card-title">
                    <PhoneCall className="w-4 h-4 text-rose-400" />
                    <h4>Crisis Emergency Contact</h4>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">
                    In moments of acute distress, having a designated trusted person can save lives.
                  </p>

                  <div className="mm-grid-2">
                    <div className="mm-form-group">
                      <label>Trusted Person's Name</label>
                      <input
                        type="text"
                        value={profileForm.emergencyContactName}
                        onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                        placeholder="e.g. Mother, Best Friend, Counselor"
                      />
                    </div>
                    <div className="mm-form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileForm.emergencyContactPhone}
                        onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>{saveStatus === "saving" ? "Saving..." : "Save Account Changes"}</span>
                  </button>
                  {user && (
                    <button
                      onClick={async () => {
                        if (signOut) {
                          await signOut();
                          window.location.reload();
                        }
                      }}
                      className="mm-btn-danger-outline"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 2: AI COMPANION PREFERENCES
               ======================================================== */}
            {activeSection === "ai_companion" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>AI Companion & Conversational Tone</h3>
                  <p>Fine-tune MannMitra's empathy style, response depth, and safety guardrails.</p>
                </div>

                {/* Tone Presets */}
                <div className="mm-card">
                  <h4>Companion Persona & Empathy Tone</h4>
                  <p className="text-zinc-400 text-sm mb-4">Select how MannMitra should speak and support you:</p>

                  <div className="mm-tone-grid">
                    {[
                      {
                        id: "empathetic",
                        title: "🌸 Empathetic & Gentle (Default)",
                        desc: "Warm, compassionate, emotionally validating, and soothing."
                      },
                      {
                        id: "structured",
                        title: "🎯 Solution-Focused & Actionable",
                        desc: "Step-by-step guidance, CBT exercises, stress breakdown."
                      },
                      {
                        id: "mindful",
                        title: "🧘 Mindful & Reflective",
                        desc: "Zen, slow-paced, grounding questions, breathwork pacing."
                      },
                      {
                        id: "friend",
                        title: "🤝 Friendly Peer & Best Friend",
                        desc: "Informal, conversational, relatable peer-to-peer listening."
                      }
                    ].map((tone) => (
                      <div
                        key={tone.id}
                        onClick={() => setAiSettings({ ...aiSettings, persona: tone.id })}
                        className={`mm-radio-card ${aiSettings.persona === tone.id ? "selected" : ""}`}
                      >
                        <div className="mm-radio-header">
                          <span className="font-semibold">{tone.title}</span>
                          {aiSettings.persona === tone.id && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-zinc-400 text-xs mt-1">{tone.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Response Length */}
                <div className="mm-card">
                  <h4>Response Detail & Length</h4>
                  <div className="mm-segmented-control">
                    {[
                      { id: "concise", label: "Concise & Light", desc: "Short, quick soothing points" },
                      { id: "balanced", label: "Balanced (Recommended)", desc: "4-5 key actionable insights" },
                      { id: "deep", label: "Deep Therapeutic", desc: "Comprehensive exploration" }
                    ].map((len) => (
                      <button
                        key={len.id}
                        onClick={() => setAiSettings({ ...aiSettings, responseLength: len.id })}
                        className={`mm-segment-btn ${aiSettings.responseLength === len.id ? "active" : ""}`}
                      >
                        <span className="font-medium text-sm">{len.label}</span>
                        <span className="text-[11px] opacity-70 block">{len.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Safety Guardrails */}
                <div className="mm-card">
                  <h4>Safety Guardrails & Wellness Prompts</h4>
                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Crisis Helpline Banner</div>
                      <p className="text-zinc-400 text-xs">
                        Instantly display 24/7 verified SOS helplines when distress or self-harm keywords are detected.
                      </p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={aiSettings.crisisBanner}
                        onChange={(e) => setAiSettings({ ...aiSettings, crisisBanner: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>

                  <div className="mm-divider" />

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Show Daily Conversation Starters</div>
                      <p className="text-zinc-400 text-xs">
                        Present supportive mental wellness suggestions (e.g. "Calm my anxiety", "Exam stress relief") on blank chats.
                      </p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={aiSettings.suggestStarters}
                        onChange={(e) => setAiSettings({ ...aiSettings, suggestStarters: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>
                </div>

                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>Save AI Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 3: DATA & PRIVACY
               ======================================================== */}
            {activeSection === "privacy" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>Data, Privacy & Confidentiality</h3>
                  <p>You have full ownership of your mental wellness records. Configure data retention and exports.</p>
                </div>

                {/* Confidentiality Commitment */}
                <div className="mm-card mm-privacy-highlight">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-emerald-400">Zero Public AI Training Guarantee</h4>
                      <p className="text-zinc-300 text-xs leading-relaxed mt-1">
                        Your private conversations, vulnerabilities, and therapist bookings are never fed into open AI training corpora. All sessions adhere to strict digital confidentiality standards.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Retention Policy */}
                <div className="mm-card">
                  <h4>Chat History Retention</h4>
                  <p className="text-zinc-400 text-sm mb-3">
                    Choose how long MannMitra stores your session conversations on this device:
                  </p>

                  <div className="mm-radio-stack">
                    {[
                      { id: "forever", label: "Store indefinitely (until manual clearing)", tip: "Keep your healing journey history" },
                      { id: "30days", label: "Auto-delete chats after 30 days", tip: "Balanced privacy & continuity" },
                      { id: "7days", label: "Auto-delete chats after 7 days", tip: "Enhanced confidentiality" },
                      { id: "zero", label: "Zero-Retention / Incognito Mode", tip: "Wipes conversations as soon as tab closes" }
                    ].map((opt) => (
                      <label key={opt.id} className="mm-radio-pill">
                        <input
                          type="radio"
                          name="retention"
                          checked={privacySettings.retention === opt.id}
                          onChange={() => setPrivacySettings({ ...privacySettings, retention: opt.id })}
                        />
                        <div className="mm-pill-content">
                          <span className="font-medium text-sm">{opt.label}</span>
                          <span className="text-zinc-400 text-xs">{opt.tip}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Export Data */}
                <div className="mm-card">
                  <h4>Export Your Wellness Records</h4>
                  <p className="text-zinc-400 text-sm mb-4">
                    Download a clean, structured JSON record of your conversations and reflections to take to your personal psychologist or keep for your notes.
                  </p>
                  <button onClick={handleExportData} className="mm-btn-secondary">
                    <Download className="w-4 h-4" />
                    <span>Download Confidential Chat Transcript (.JSON)</span>
                  </button>
                </div>

                {/* Danger Zone: Clear History */}
                <div className="mm-card mm-danger-card">
                  <h4 className="text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1 mb-4">
                    Permanently delete all active chat sessions from your session and local storage. This action cannot be reversed.
                  </p>

                  {!showClearConfirm ? (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="mm-btn-danger"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Clear All Conversation History</span>
                    </button>
                  ) : (
                    <div className="mm-confirm-box">
                      <p className="text-rose-300 text-xs font-semibold">
                        Are you sure? All current chat messages will be permanently wiped.
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={handleClearConversations} className="mm-btn-danger-confirm">
                          Yes, Delete Forever
                        </button>
                        <button onClick={() => setShowClearConfirm(false)} className="mm-btn-cancel">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>Save Privacy Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 4: NOTIFICATIONS & REMINDERS
               ======================================================== */}
            {activeSection === "notifications" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>Notifications & Wellness Reminders</h3>
                  <p>Gentle pings for daily mood check-ins, scheduled counseling, and silent quiet hours.</p>
                </div>

                <div className="mm-card">
                  <h4>Daily Mindful Check-Ins</h4>

                  {/* Morning Check-In */}
                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Morning Gratitude & Mood Check</div>
                      <p className="text-zinc-400 text-xs">Uplifting morning intention and grounding exercise.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        value={notifSettings.morningTime}
                        onChange={(e) => setNotifSettings({ ...notifSettings, morningTime: e.target.value })}
                        className="mm-time-input"
                      />
                      <label className="mm-switch">
                        <input
                          type="checkbox"
                          checked={notifSettings.morningCheckIn}
                          onChange={(e) => setNotifSettings({ ...notifSettings, morningCheckIn: e.target.checked })}
                        />
                        <span className="mm-slider round"></span>
                      </label>
                    </div>
                  </div>

                  <div className="mm-divider" />

                  {/* Evening Reflection */}
                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Evening Decompression & Reflection</div>
                      <p className="text-zinc-400 text-xs">End-of-day gentle unwind and stress relief check-in.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        value={notifSettings.eveningTime}
                        onChange={(e) => setNotifSettings({ ...notifSettings, eveningTime: e.target.value })}
                        className="mm-time-input"
                      />
                      <label className="mm-switch">
                        <input
                          type="checkbox"
                          checked={notifSettings.eveningCheckIn}
                          onChange={(e) => setNotifSettings({ ...notifSettings, eveningCheckIn: e.target.checked })}
                        />
                        <span className="mm-slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Appointment & Therapy Alerts */}
                <div className="mm-card">
                  <h4>Session & Appointment Reminders</h4>
                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Therapy Session Alerts</div>
                      <p className="text-zinc-400 text-xs">Remind me 1 hour prior to any scheduled counselor booking.</p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={notifSettings.bookingAlerts}
                        onChange={(e) => setNotifSettings({ ...notifSettings, bookingAlerts: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>
                </div>

                {/* Quiet Hours & Sound */}
                <div className="mm-card">
                  <h4>Quiet Hours & Audio Chimes</h4>

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Quiet Hours (Do Not Disturb)</div>
                      <p className="text-zinc-400 text-xs">Mute non-urgent alerts between 10:00 PM and 08:00 AM.</p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={notifSettings.quietHours}
                        onChange={(e) => setNotifSettings({ ...notifSettings, quietHours: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>

                  <div className="mm-divider" />

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Calming Meditation Chime on AI Responses</div>
                      <p className="text-zinc-400 text-xs">Subtle 528Hz Solfeggio sound when a companion message completes.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={playMeditationChime} className="mm-btn-icon-test" title="Play preview chime">
                        <Volume2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs">Test Sound</span>
                      </button>
                      <label className="mm-switch">
                        <input
                          type="checkbox"
                          checked={notifSettings.soundChime}
                          onChange={(e) => setNotifSettings({ ...notifSettings, soundChime: e.target.checked })}
                        />
                        <span className="mm-slider round"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>Save Notifications</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 5: APPEARANCE & THEME
               ======================================================== */}
            {activeSection === "appearance" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>Appearance, Color & Sensory Themes</h3>
                  <p>Tailor your visual ambiance to reduce visual fatigue, anxiety, and sensory overload.</p>
                </div>

                {/* Theme Mode Selector */}
                <div className="mm-card">
                  <h4>Theme Mode</h4>
                  <div className="mm-theme-grid">
                    <button
                      onClick={() => handleThemeChange("dark")}
                      className={`mm-theme-card ${appearanceSettings.theme === "dark" ? "active" : ""}`}
                    >
                      <div className="mm-theme-preview dark">
                        <Moon className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div className="font-medium text-sm mt-2">Midnight Slate</div>
                      <span className="text-zinc-400 text-xs">Easy on tired eyes</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("light")}
                      className={`mm-theme-card ${appearanceSettings.theme === "light" ? "active" : ""}`}
                    >
                      <div className="mm-theme-preview light">
                        <Sun className="w-6 h-6 text-amber-500" />
                      </div>
                      <div className="font-medium text-sm mt-2">Serene Dawn</div>
                      <span className="text-zinc-400 text-xs">Bright & uplifting</span>
                    </button>

                    <button
                      onClick={() => handleThemeChange("system")}
                      className={`mm-theme-card ${appearanceSettings.theme === "system" ? "active" : ""}`}
                    >
                      <div className="mm-theme-preview system">
                        <Laptop className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="font-medium text-sm mt-2">Sync with System</div>
                      <span className="text-zinc-400 text-xs">Matches OS settings</span>
                    </button>
                  </div>
                </div>

                {/* Calming Accent Palette */}
                <div className="mm-card">
                  <h4>Calming Mood Palette</h4>
                  <p className="text-zinc-400 text-xs mb-3">Choose the accent hue that feels most grounding:</p>
                  <div className="mm-accent-grid">
                    {[
                      { id: "emerald", label: "Emerald Oasis", hex: "#10b981", tag: "Healing & Calm" },
                      { id: "lavender", label: "Lavender Bloom", hex: "#8b5cf6", tag: "Serene & Peaceful" },
                      { id: "ocean", label: "Ocean Sky", hex: "#0ea5e9", tag: "Clarity & Space" },
                      { id: "amber", label: "Sunset Amber", hex: "#f59e0b", tag: "Warmth & Hope" }
                    ].map((accent) => (
                      <div
                        key={accent.id}
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, accentColor: accent.id })}
                        className={`mm-accent-card ${appearanceSettings.accentColor === accent.id ? "active" : ""}`}
                      >
                        <div className="mm-color-swatch" style={{ backgroundColor: accent.hex }} />
                        <div className="text-left">
                          <div className="font-medium text-xs text-white">{accent.label}</div>
                          <div className="text-[10px] text-zinc-400">{accent.tag}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Size & Spacing */}
                <div className="mm-card">
                  <h4>Reading Comfort & Font Size</h4>
                  <div className="mm-segmented-control mb-4">
                    {[
                      { id: "compact", label: "Standard (14px)" },
                      { id: "standard", label: "Comfortable (16px)" },
                      { id: "large", label: "Large (18px)" }
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, fontSize: sz.id })}
                        className={`mm-segment-btn ${appearanceSettings.fontSize === sz.id ? "active" : ""}`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Relaxed Chat Spacing</div>
                      <p className="text-zinc-400 text-xs">Generous margins between messages to avoid feeling overwhelmed.</p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={appearanceSettings.relaxedSpacing}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, relaxedSpacing: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>

                  <div className="mm-divider" />

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Reduce Motion & Sensory Animations</div>
                      <p className="text-zinc-400 text-xs">Turns off rapid transitions and pulsing effects for ADHD and sensory ease.</p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={appearanceSettings.reducedMotion}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, reducedMotion: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>
                </div>

                {/* 3-Second Loop Hole Wormhole Preview & Modals Test */}
                <div className="mm-card">
                  <h4>Cosmic Loop Hole Portal & Welcome Animations</h4>
                  <p className="text-zinc-400 text-xs mb-3">
                    Experience the 3-second quantum wormhole portal transition and onboarding greetings:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onTriggerPortal) onTriggerPortal();
                      }}
                      className="mm-btn-secondary"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Play 3s Loop Hole Portal</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onTriggerNewUserModal) onTriggerNewUserModal();
                      }}
                      className="mm-btn-secondary"
                    >
                      <span>Preview New User Note</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onTriggerWelcomeBackModal) onTriggerWelcomeBackModal();
                      }}
                      className="mm-btn-secondary"
                    >
                      <span>Preview Welcome Back</span>
                    </button>
                  </div>
                </div>

                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>Apply Appearance</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 6: ACCESSIBILITY & PANIC SAFETY
               ======================================================== */}
            {activeSection === "accessibility" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>Accessibility & Panic Safety Tools</h3>
                  <p>Safety mechanisms for discretion, emergency breathwork, and reading aids.</p>
                </div>

                {/* Discreet Quick-Exit / Panic Button */}
                <div className="mm-card mm-safety-highlight">
                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-semibold text-rose-300 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" />
                        Discreet "Quick-Exit" Panic Button
                      </div>
                      <p className="text-zinc-300 text-xs mt-1 leading-relaxed">
                        If you share your room or device and need to instantly hide this mental wellness window, this keeps a discrete button active that instantly redirects to Google Weather or BBC News.
                      </p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={accessSettings.panicButton}
                        onChange={(e) => setAccessSettings({ ...accessSettings, panicButton: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>
                </div>

                {/* 60-Second Guided Breathing Exercise */}
                <div className="mm-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>Instant 4-7-8 Breathing Guide</h4>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Scientifically proven rapid parasympathetic nervous system calming technique.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBreathingModal(true)}
                      className="mm-btn-secondary shrink-0"
                    >
                      <Wind className="w-4 h-4 text-emerald-400" />
                      <span>Start 60s Breathing</span>
                    </button>
                  </div>
                </div>

                {/* Readability & Contrast */}
                <div className="mm-card">
                  <h4>Contrast & Readability Enhancements</h4>

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">High Contrast Mode</div>
                      <p className="text-zinc-400 text-xs">Sharper border outlines and pure black/white contrast for visual impairment.</p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={accessSettings.highContrast}
                        onChange={(e) => setAccessSettings({ ...accessSettings, highContrast: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>

                  <div className="mm-divider" />

                  <div className="mm-toggle-row">
                    <div>
                      <div className="font-medium">Dyslexia-Friendly Letterforms</div>
                      <p className="text-zinc-400 text-xs">Weighted bottoms and distinct character shapes to prevent letter reversals.</p>
                    </div>
                    <label className="mm-switch">
                      <input
                        type="checkbox"
                        checked={accessSettings.dyslexicFont}
                        onChange={(e) => setAccessSettings({ ...accessSettings, dyslexicFont: e.target.checked })}
                      />
                      <span className="mm-slider round"></span>
                    </label>
                  </div>
                </div>

                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>Save Accessibility Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================
                SECTION 7: LANGUAGE & 24/7 HELPLINES (SOS)
               ======================================================== */}
            {activeSection === "helplines" && (
              <div className="mm-content-panel">
                <div className="mm-panel-header">
                  <h3>Language, Region & 24/7 Verified Helplines</h3>
                  <p>Choose your communication dialect and access government-verified psychological emergency numbers.</p>
                </div>

                {/* AI Language Selection */}
                <div className="mm-card">
                  <h4>AI Companion Conversation Language</h4>
                  <p className="text-zinc-400 text-sm mb-3">
                    MannMitra understands and communicates fluently across multiple Indian and international languages:
                  </p>

                  <select
                    value={langSettings.aiLanguage}
                    onChange={(e) => setLangSettings({ ...langSettings, aiLanguage: e.target.value })}
                    className="mm-select"
                  >
                    <option value="english_hinglish">English & Hinglish (Hindi + English natural colloquial)</option>
                    <option value="hindi">हिन्दी (Pure Hindi)</option>
                    <option value="marathi">मराठी (Marathi)</option>
                    <option value="bengali">বাংলা (Bengali)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="telugu">తెలుగు (Telugu)</option>
                    <option value="kannada">ಕನ್ನಡ (Kannada)</option>
                    <option value="gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="global_english">International English</option>
                  </select>
                </div>

                {/* Verified Helplines Directory */}
                <div className="mm-card">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="flex items-center gap-2 text-rose-300">
                        <Flame className="w-4 h-4 text-rose-400" />
                        24/7 Verified Crisis Lifelines (Free & Confidential)
                      </h4>
                      <p className="text-zinc-400 text-xs">If you or someone you know is in acute distress, please reach out:</p>
                    </div>
                  </div>

                  <div className="mm-helpline-list">
                    {[
                      {
                        name: "Tele-MANAS (Govt. of India)",
                        number: "14416",
                        alt: "1800-891-4416",
                        detail: "Toll-free 24/7 national mental health helpline, 20+ regional languages."
                      },
                      {
                        name: "KIRAN Helpline",
                        number: "1800-599-0019",
                        alt: null,
                        detail: "Ministry of Social Justice, 24x7 psychological support & anxiety relief."
                      },
                      {
                        name: "Vandrevala Foundation",
                        number: "9999-666-555",
                        alt: null,
                        detail: "Free round-the-clock professional crisis counseling & suicide prevention."
                      },
                      {
                        name: "AASRA Crisis Intervention",
                        number: "+91-9820466726",
                        alt: null,
                        detail: "Dedicated confidential emotional first aid."
                      },
                      {
                        name: "National Emergency Helpline",
                        number: "112",
                        alt: null,
                        detail: "All-in-one emergency response for medical and police assistance."
                      }
                    ].map((line, idx) => (
                      <div key={idx} className="mm-helpline-card">
                        <div className="mm-helpline-info">
                          <div className="font-semibold text-sm text-white">{line.name}</div>
                          <div className="text-zinc-400 text-xs mt-0.5">{line.detail}</div>
                          <div className="font-mono text-emerald-400 text-sm font-bold mt-1">
                            {line.number} {line.alt && ` / ${line.alt}`}
                          </div>
                        </div>
                        <div className="mm-helpline-actions">
                          <button
                            onClick={() => handleCopy(line.number, line.name)}
                            className="mm-btn-helpline"
                            title="Copy number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </button>
                          <a
                            href={`tel:${line.number.replace(/[^0-9+]/g, "")}`}
                            className="mm-btn-helpline call"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mm-action-bar">
                  <button onClick={saveAllSettings} className="mm-btn-primary">
                    <Save className="w-4 h-4" />
                    <span>Save Language & SOS Directory</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GUIDED BREATHING MINI-MODAL */}
        {showBreathingModal && (
          <div className="mm-breathing-overlay">
            <div className="mm-breathing-card">
              <button
                onClick={() => setShowBreathingModal(false)}
                className="mm-breathing-close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">4-7-8 Calming Breathwork</h3>
                <p className="text-zinc-400 text-xs mb-6">Focus on the circle. Inhale peace, exhale tension.</p>

                <div className={`mm-breathing-circle-wrap ${breathingPhase.toLowerCase()}`}>
                  <div className="mm-breathing-circle">
                    <div className="text-2xl font-bold text-white tracking-wider uppercase">
                      {breathingPhase}
                    </div>
                    <div className="text-3xl font-mono text-emerald-300 font-bold mt-1">
                      {breathingTimer}s
                    </div>
                  </div>
                </div>

                <p className="text-zinc-400 text-xs mt-6">
                  {breathingPhase === "Inhale" && "Inhale deeply through your nose for 4 seconds..."}
                  {breathingPhase === "Hold" && "Gently hold your breath for 7 seconds..."}
                  {breathingPhase === "Exhale" && "Release completely through your mouth for 8 seconds..."}
                </p>

                <button
                  onClick={() => setShowBreathingModal(false)}
                  className="mm-btn-secondary mt-5 mx-auto"
                >
                  I Feel Centered Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
