import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Search,
  User,
  Shield,
  Bot,
  Bell,
  Accessibility,
  Globe,
  Lock,
  Download,
  Trash2,
  Volume2,
  AlertTriangle,
  PhoneCall,
  Copy,
  Save,
  LogOut,
  Camera,
  CheckCircle2,
  X,
  Wind,
  ShieldAlert,
  Flame,
  Sparkles,
  Upload
} from "lucide-react";
import MannMitraicon from "../../../assets/MannMitraicon.png";
import { useAuth } from "../../../context/AuthContext";
import { Context } from "../../context/Context";
import { updateProfile, deleteAccount, getProfile } from "../../../config/auth";
import { storage } from "../../../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./SettingsPage.css";

const SETTINGS_SECTIONS = [
  {
    id: "account",
    label: "My Account & Profile",
    category: "USER PROFILE",
    icon: User,
    desc: "Personal profile, photo, anonymous alias & emergency contact"
  },
  {
    id: "ai_companion",
    label: "AI Companion",
    category: "EXPERIENCE",
    icon: Bot,
    desc: "Empathy style, response detail & crisis guardrails"
  },
  {
    id: "privacy",
    label: "Data & Privacy",
    category: "EXPERIENCE",
    icon: Shield,
    desc: "Confidentiality, retention, export & data clearing"
  },
  {
    id: "notifications",
    label: "Notifications & Reminders",
    category: "PREFERENCES",
    icon: Bell,
    desc: "Daily check-ins, therapy alerts & quiet hours"
  },
  {
    id: "accessibility",
    label: "Accessibility & Safety",
    category: "PREFERENCES",
    icon: Accessibility,
    desc: "Panic quick-exit, contrast & 4-7-8 breathwork"
  },
  {
    id: "helplines",
    label: "Language & 24/7 SOS",
    category: "SYSTEM & SUPPORT",
    icon: Globe,
    desc: "Multilingual AI support & verified crisis hotlines"
  }
];

export default function SettingsPage({ initialSection = "account", onBack, onTriggerPortal }) {
  const { user, profile: authProfile, signOut } = useAuth() || {};
  const { conversations, setConversations, setCurrentChatId } = useContext(Context) || {};

  const [activeSection, setActiveSection] = useState(initialSection);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Guided breathing mini modal
  const [showBreathingModal, setShowBreathingModal] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("Inhale");
  const [breathingTimer, setBreathingTimer] = useState(4);

  // File upload ref for profile photo
  const photoInputRef = useRef(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Expanded Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    email: "",
    phone: "",
    age: "",
    gender: "prefer_not_to_say",
    wellnessGoal: "anxiety",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bio: "",
    photoUrl: ""
  });

  // AI Preferences state
  const [aiSettings, setAiSettings] = useState({
    persona: "empathetic",
    responseLength: "balanced",
    crisisBanner: true,
    suggestStarters: true
  });

  // Privacy & Data state
  const [privacySettings, setPrivacySettings] = useState({
    retention: "forever",
    incognito: false,
    analyticsOptOut: true
  });

  // Notifications state
  const [notifSettings, setNotifSettings] = useState({
    morningCheckIn: true,
    morningTime: "08:30",
    eveningCheckIn: true,
    eveningTime: "21:30",
    bookingAlerts: true,
    quietHours: true
  });

  // Accessibility state
  const [accessSettings, setAccessSettings] = useState({
    panicButton: true,
    highContrast: false,
    dyslexicFont: false
  });

  // Language & SOS state
  const [langSettings, setLangSettings] = useState({
    aiLanguage: "english_hinglish",
    timeFormat: "12h"
  });

  // Load profile & settings on mount
  useEffect(() => {
    try {
      const savedPhoto = localStorage.getItem("mann_profile_photo") || "";
      const savedNickname = localStorage.getItem("mann_user_nickname") || "";
      const savedEmergName = localStorage.getItem("mann_emerg_name") || "";
      const savedEmergPhone = localStorage.getItem("mann_emerg_phone") || "";
      const savedBio = localStorage.getItem("mann_user_bio") || "";
      const savedGoal = localStorage.getItem("mann_wellness_goal") || "anxiety";
      const savedGender = localStorage.getItem("mann_gender") || "prefer_not_to_say";
      const savedAge = localStorage.getItem("mann_age") || "";
      const savedPhone = localStorage.getItem("mann_phone") || "";

      const savedAi = localStorage.getItem("mann_ai_settings");
      const savedPrivacy = localStorage.getItem("mann_privacy_settings");
      const savedNotif = localStorage.getItem("mann_notif_settings");
      const savedAccess = localStorage.getItem("mann_access_settings");
      const savedLang = localStorage.getItem("mann_lang_settings");

      if (savedAi) setAiSettings(prev => ({ ...prev, ...JSON.parse(savedAi) }));
      if (savedPrivacy) setPrivacySettings(prev => ({ ...prev, ...JSON.parse(savedPrivacy) }));
      if (savedNotif) setNotifSettings(prev => ({ ...prev, ...JSON.parse(savedNotif) }));
      if (savedAccess) setAccessSettings(prev => ({ ...prev, ...JSON.parse(savedAccess) }));
      if (savedLang) setLangSettings(prev => ({ ...prev, ...JSON.parse(savedLang) }));

      if (authProfile) {
        setProfileForm({
          firstName: authProfile.first_name || "",
          lastName: authProfile.last_name || "",
          nickname: savedNickname || authProfile.nickname || "MindfulFriend",
          email: authProfile.email || (user ? user.email : "guest@mannmitra.org"),
          phone: authProfile.phone_number || savedPhone || "",
          age: authProfile.age || savedAge || "",
          gender: authProfile.gender || savedGender,
          wellnessGoal: authProfile.wellness_goal || savedGoal,
          emergencyContactName: authProfile.emergency_contact_name || savedEmergName || "",
          emergencyContactPhone: authProfile.emergency_contact_phone || savedEmergPhone || "",
          bio: authProfile.bio || savedBio || "",
          photoUrl: authProfile.photo_url || user?.photoURL || savedPhoto || ""
        });
      } else if (user) {
        const parts = user.displayName ? user.displayName.split(" ") : ["Friend"];
        setProfileForm({
          firstName: parts[0] || "Friend",
          lastName: parts.slice(1).join(" ") || "",
          nickname: savedNickname || "MindfulFriend",
          email: user.email || "guest@mannmitra.org",
          phone: savedPhone,
          age: savedAge,
          gender: savedGender,
          wellnessGoal: savedGoal,
          emergencyContactName: savedEmergName,
          emergencyContactPhone: savedEmergPhone,
          bio: savedBio,
          photoUrl: user.photoURL || savedPhoto || ""
        });
      } else {
        setProfileForm(prev => ({
          ...prev,
          firstName: "Guest",
          lastName: "User",
          nickname: savedNickname || "MindfulFriend",
          email: "guest@mannmitra.org",
          phone: savedPhone,
          age: savedAge,
          gender: savedGender,
          wellnessGoal: savedGoal,
          emergencyContactName: savedEmergName,
          emergencyContactPhone: savedEmergPhone,
          bio: savedBio,
          photoUrl: savedPhoto
        }));
      }
    } catch (err) {
      console.warn("Settings loading error:", err);
    }
  }, [authProfile, user]);

  // Handle Photo File Upload
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image file size should be less than 5MB.");
      return;
    }

    try {
      setUploadingPhoto(true);

      // Local base64 / blob preview immediately
      const reader = new FileReader();
      reader.onload = async (uploadEvent) => {
        const base64Url = uploadEvent.target.result;
        setProfileForm(prev => ({ ...prev, photoUrl: base64Url }));
        localStorage.setItem("mann_profile_photo", base64Url);

        // Upload to Firebase Storage if logged in
        if (user && storage) {
          try {
            const storageReference = ref(storage, `profiles/${user.uid}/profile_pic.jpg`);
            await uploadBytes(storageReference, file);
            const downloadUrl = await getDownloadURL(storageReference);
            setProfileForm(prev => ({ ...prev, photoUrl: downloadUrl }));
            localStorage.setItem("mann_profile_photo", downloadUrl);

            await updateProfile(user.uid, { photo_url: downloadUrl }, user);
          } catch (storageErr) {
            console.warn("Storage upload fallback:", storageErr.message);
          }
        }
      };
      reader.readAsDataURL(file);

      setCopyFeedback("Profile photo updated successfully!");
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch (err) {
      console.error("Photo error:", err);
      alert("Failed to update profile photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setProfileForm(prev => ({ ...prev, photoUrl: "" }));
    localStorage.removeItem("mann_profile_photo");
    if (user) {
      updateProfile(user.uid, { photo_url: "" }, user);
    }
    setCopyFeedback("Profile photo removed.");
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Breathing guide timer
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

  // Save all settings
  const saveAllSettings = async () => {
    try {
      setSaveStatus("saving");

      localStorage.setItem("mann_ai_settings", JSON.stringify(aiSettings));
      localStorage.setItem("mann_privacy_settings", JSON.stringify(privacySettings));
      localStorage.setItem("mann_notif_settings", JSON.stringify(notifSettings));
      localStorage.setItem("mann_access_settings", JSON.stringify(accessSettings));
      localStorage.setItem("mann_lang_settings", JSON.stringify(langSettings));

      localStorage.setItem("mann_user_nickname", profileForm.nickname);
      localStorage.setItem("mann_emerg_name", profileForm.emergencyContactName);
      localStorage.setItem("mann_emerg_phone", profileForm.emergencyContactPhone);
      localStorage.setItem("mann_user_bio", profileForm.bio);
      localStorage.setItem("mann_wellness_goal", profileForm.wellnessGoal);
      localStorage.setItem("mann_gender", profileForm.gender);
      localStorage.setItem("mann_age", profileForm.age);
      localStorage.setItem("mann_phone", profileForm.phone);

      if (user) {
        await updateProfile(user.uid, {
          first_name: profileForm.firstName,
          last_name: profileForm.lastName,
          nickname: profileForm.nickname,
          phone_number: profileForm.phone,
          age: profileForm.age,
          gender: profileForm.gender,
          wellness_goal: profileForm.wellnessGoal,
          emergency_contact_name: profileForm.emergencyContactName,
          emergency_contact_phone: profileForm.emergencyContactPhone,
          bio: profileForm.bio,
          photo_url: profileForm.photoUrl
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

  // Permanent Delete Account
  const handlePermanentDeleteAccount = async () => {
    if (deleteConfirmText.trim().toUpperCase() !== "DELETE") {
      alert("Please type DELETE to confirm permanent account deletion.");
      return;
    }

    try {
      setIsDeletingAccount(true);

      if (user) {
        const res = await deleteAccount(user);
        if (res.error) throw res.error;
      }

      // Clear all client cache and local storage
      localStorage.clear();
      sessionStorage.clear();

      setShowDeleteModal(false);
      alert("Your account and all associated mental health records have been permanently erased.");
      window.location.href = "/";
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Failed to delete account. You may need to sign out and log in again before deleting.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Export data
  const handleExportData = () => {
    try {
      const exportObject = {
        platform: "MannMitra AI Mental Wellness Companion",
        timestamp: new Date().toISOString(),
        user: {
          name: `${profileForm.firstName} ${profileForm.lastName}`.trim(),
          nickname: profileForm.nickname,
          wellnessGoal: profileForm.wellnessGoal
        },
        conversations: (conversations || []).map(chat => ({
          id: chat.id,
          title: chat.title,
          messages: chat.messages || []
        }))
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `MannMitra_Health_Records_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setCopyFeedback("Data exported successfully!");
      setTimeout(() => setCopyFeedback(null), 3000);
    } catch (e) {
      alert("Failed to export conversations.");
    }
  };

  // Clear conversations
  const handleClearConversations = () => {
    if (setConversations) setConversations([]);
    if (setCurrentChatId) setCurrentChatId(null);
    setShowClearConfirm(false);
    setCopyFeedback("All conversations cleared.");
    setTimeout(() => setCopyFeedback(null), 3000);
  };

  // Copy helpline
  const handleCopy = (text, name) => {
    navigator.clipboard.writeText(text);
    setCopyFeedback(`Copied ${name}: ${text}`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Filter sections by search
  const filteredSections = SETTINGS_SECTIONS.filter(sec => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sec.label.toLowerCase().includes(q) ||
      sec.desc.toLowerCase().includes(q) ||
      sec.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mm-settings-page-wrapper">
      {/* Toast Feedback */}
      {copyFeedback && (
        <div className="mm-page-toast">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* TOP HEADER (Minimalist Black with User's Brain Logo) */}
      <div className="mm-settings-page-header">
        <div className="mm-header-brand-group">
          {/* User's Official Brain Logo - Direct without box */}
          <img src={MannMitraicon} alt="MannMitra Brain" className="mm-brain-logo-clean" />

          <div>
            <h1 className="mm-settings-page-title">MannMitra Settings & Preferences</h1>
            <p className="mm-settings-page-subtitle">
              Account Profile, AI Companion, Privacy Controls & Safety
            </p>
          </div>
        </div>

        {saveStatus === "success" && (
          <div className="mm-save-badge success">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Changes Saved</span>
          </div>
        )}
      </div>

      {/* MAIN 2-COLUMN SETTINGS CONTAINER (ChatGPT STYLE) */}
      <div className="mm-settings-page-container">
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="mm-settings-nav-sidebar">
          {/* Search bar */}
          <div className="mm-nav-search-box">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="mm-nav-clear-btn">
                <X className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            )}
          </div>

          {/* Sections List */}
          <div className="mm-nav-list custom-scrollbar">
            {filteredSections.map((sec, idx) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const prevSec = filteredSections[idx - 1];
              const showCategory = !prevSec || prevSec.category !== sec.category;

              return (
                <React.Fragment key={sec.id}>
                  {showCategory && (
                    <div className="mm-nav-category-label">
                      {sec.category}
                    </div>
                  )}
                  <button
                    onClick={() => setActiveSection(sec.id)}
                    className={`mm-nav-item-btn ${isActive ? "active" : ""}`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                    <span className="mm-nav-item-text">{sec.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {/* User Mini Identity Footer */}
          <div className="mm-nav-user-footer">
            <div className="mm-nav-avatar">
              {profileForm.photoUrl ? (
                <img src={profileForm.photoUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span>{profileForm.firstName ? profileForm.firstName[0].toUpperCase() : "M"}</span>
              )}
            </div>
            <div className="mm-nav-user-text">
              <div className="mm-nav-user-name">
                {profileForm.firstName} {profileForm.lastName}
              </div>
              <div className="mm-nav-user-meta">
                {user ? "Verified Member" : "Guest Mode"}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT PANE */}
        <div className="mm-settings-main-pane custom-scrollbar">
          {/* ========================================================
              SECTION 1: MY ACCOUNT & PROFILE (EXPANDED)
             ======================================================== */}
          {activeSection === "account" && (
            <div className="mm-section-content">
              <div className="mm-content-title-bar">
                <h2>My Account & Profile</h2>
                <p>Manage your identity, personal wellness preferences, avatar, and crisis contacts.</p>
              </div>

              {/* Profile Photo Upload Card */}
              <div className="mm-chatgpt-card">
                <h3>Profile Picture</h3>
                <div className="mm-photo-upload-row">
                  <div className="mm-large-avatar-preview">
                    {profileForm.photoUrl ? (
                      <img src={profileForm.photoUrl} alt="Profile" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {profileForm.firstName ? profileForm.firstName[0].toUpperCase() : "M"}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="mm-avatar-camera-btn"
                      title="Upload new photo"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <div className="mm-photo-controls">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="mm-btn-dark"
                      disabled={uploadingPhoto}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingPhoto ? "Uploading..." : "Change Photo"}</span>
                    </button>
                    {profileForm.photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="mm-btn-ghost-danger"
                      >
                        Remove
                      </button>
                    )}
                    <p className="text-zinc-500 text-xs mt-1">
                      JPG, PNG or GIF up to 5MB.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details Form */}
              <div className="mm-chatgpt-card">
                <h3>Personal & Identity Details</h3>

                <div className="mm-form-row-2">
                  <div className="mm-input-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                      placeholder="e.g. Aaryan"
                    />
                  </div>
                  <div className="mm-input-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                      placeholder="e.g. Kumar"
                    />
                  </div>
                </div>

                <div className="mm-form-row-2">
                  <div className="mm-input-field">
                    <label>
                      Anonymous Safe Nickname
                      <span className="mm-label-sub">Used when speaking anonymously</span>
                    </label>
                    <input
                      type="text"
                      value={profileForm.nickname}
                      onChange={(e) => setProfileForm({ ...profileForm, nickname: e.target.value })}
                      placeholder="e.g. MindfulFriend, CalmSky"
                    />
                  </div>
                  <div className="mm-input-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      readOnly
                      className="opacity-70 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="mm-form-row-3">
                  <div className="mm-input-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="mm-input-field">
                    <label>Age</label>
                    <input
                      type="number"
                      value={profileForm.age}
                      onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      placeholder="e.g. 21"
                    />
                  </div>
                  <div className="mm-input-field">
                    <label>Gender / Pronouns</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    >
                      <option value="prefer_not_to_say">Prefer not to say</option>
                      <option value="male">Male (He/Him)</option>
                      <option value="female">Female (She/Her)</option>
                      <option value="non_binary">Non-Binary (They/Them)</option>
                    </select>
                  </div>
                </div>

                <div className="mm-input-field">
                  <label>Primary Mental Wellness Goal</label>
                  <select
                    value={profileForm.wellnessGoal}
                    onChange={(e) => setProfileForm({ ...profileForm, wellnessGoal: e.target.value })}
                  >
                    <option value="anxiety">Managing Anxiety & Panic Attacks</option>
                    <option value="exam_stress">Academic Pressure & Exam Stress</option>
                    <option value="depression">Overcoming Depression & Low Mood</option>
                    <option value="burnout">Workplace / Career Burnout & Fatigue</option>
                    <option value="sleep">Restoring Healthy Sleep Cycles</option>
                    <option value="mindfulness">Daily Mindfulness & Self-Compassion</option>
                  </select>
                </div>

                <div className="mm-input-field">
                  <label>
                    Personal Bio / Safe Journal Note
                    <span className="mm-label-sub">A brief note for your therapist or daily reflection</span>
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    placeholder="Write a few words about what brings you to MannMitra..."
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mm-chatgpt-card">
                <h3>Crisis Emergency Contact</h3>
                <p className="text-zinc-400 text-xs mb-4">
                  Designate a trusted loved one or counselor who can be contacted in case of severe acute distress.
                </p>

                <div className="mm-form-row-2">
                  <div className="mm-input-field">
                    <label>Trusted Person's Name</label>
                    <input
                      type="text"
                      value={profileForm.emergencyContactName}
                      onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                      placeholder="e.g. Mother, Counselor, Best Friend"
                    />
                  </div>
                  <div className="mm-input-field">
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

              {/* Save & Logout Actions */}
              <div className="mm-actions-flex">
                <button onClick={saveAllSettings} className="mm-btn-white">
                  <Save className="w-4 h-4" />
                  <span>{saveStatus === "saving" ? "Saving..." : "Save Profile Details"}</span>
                </button>

                {user && (
                  <button
                    onClick={async () => {
                      if (signOut) {
                        await signOut();
                        window.location.reload();
                      }
                    }}
                    className="mm-btn-dark-outline"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>

              {/* PERMANENT DELETE ACCOUNT DANGER ZONE */}
              <div className="mm-danger-card">
                <div className="mm-danger-header">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <div>
                    <h4 className="text-red-400 font-semibold text-sm">Permanent Account Deletion</h4>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Permanently delete your MannMitra account and all associated mental wellness data, chat transcripts, and appointments. This action is irreversible.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="mm-btn-danger"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account Permanently</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 2: AI COMPANION
             ======================================================== */}
          {activeSection === "ai_companion" && (
            <div className="mm-section-content">
              <div className="mm-content-title-bar">
                <h2>AI Companion & Conversational Tone</h2>
                <p>Configure MannMitra's personality style, depth, and safety guardrails.</p>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Companion Persona & Tone</h3>
                <div className="mm-tone-list">
                  {[
                    { id: "empathetic", title: "Empathetic & Gentle (Recommended)", desc: "Warm, compassionate, emotionally validating, and soothing." },
                    { id: "structured", title: "Solution-Focused & Actionable", desc: "Structured CBT exercises, stress breakdown, and actionable steps." },
                    { id: "mindful", title: "Mindful & Reflective", desc: "Zen, reflective questions, slow breathwork pacing." },
                    { id: "friend", title: "Friendly Peer", desc: "Informal, conversational, relatable peer listening." }
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setAiSettings({ ...aiSettings, persona: t.id })}
                      className={`mm-tone-item ${aiSettings.persona === t.id ? "selected" : ""}`}
                    >
                      <div className="font-semibold text-sm text-zinc-100">{t.title}</div>
                      <div className="text-zinc-400 text-xs mt-0.5">{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Response Detail & Length</h3>
                <div className="mm-radio-group">
                  {[
                    { id: "concise", label: "Concise & Light (Quick reassuring points)" },
                    { id: "balanced", label: "Balanced (Recommended 4-5 actionable points)" },
                    { id: "deep", label: "Deep Therapeutic (In-depth emotional breakdown)" }
                  ].map((len) => (
                    <label key={len.id} className="mm-radio-label">
                      <input
                        type="radio"
                        name="responseLength"
                        checked={aiSettings.responseLength === len.id}
                        onChange={() => setAiSettings({ ...aiSettings, responseLength: len.id })}
                      />
                      <span>{len.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Safety Guardrails</h3>
                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Instant Crisis Helpline Banner</div>
                    <div className="text-zinc-500 text-xs">Always pin verified helplines when acute distress is detected.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.crisisBanner}
                    onChange={(e) => setAiSettings({ ...aiSettings, crisisBanner: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>

                <div className="mm-divider-dark" />

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Daily Conversation Starters</div>
                    <div className="text-zinc-500 text-xs">Display supportive wellness suggestions on blank chats.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSettings.suggestStarters}
                    onChange={(e) => setAiSettings({ ...aiSettings, suggestStarters: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>
              </div>

              <div className="mm-actions-flex">
                <button onClick={saveAllSettings} className="mm-btn-white">
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
            <div className="mm-section-content">
              <div className="mm-content-title-bar">
                <h2>Data, Privacy & Confidentiality</h2>
                <p>Manage conversation retention, export transcripts, and clear session logs.</p>
              </div>

              <div className="mm-chatgpt-card">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-zinc-100">Zero Public AI Training Guarantee</h3>
                    <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Your deeply personal thoughts and sessions are never sold or trained on public models. All records adhere to strict digital mental health confidentiality.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Chat History Retention</h3>
                <div className="mm-radio-group">
                  {[
                    { id: "forever", label: "Keep indefinitely (until manual clearing)" },
                    { id: "30days", label: "Auto-delete chats after 30 days" },
                    { id: "7days", label: "Auto-delete chats after 7 days" },
                    { id: "zero", label: "Zero-Retention / Incognito Mode (Clear on tab close)" }
                  ].map((ret) => (
                    <label key={ret.id} className="mm-radio-label">
                      <input
                        type="radio"
                        name="retention"
                        checked={privacySettings.retention === ret.id}
                        onChange={() => setPrivacySettings({ ...privacySettings, retention: ret.id })}
                      />
                      <span>{ret.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Export My Data</h3>
                <p className="text-zinc-400 text-xs mb-3">
                  Download a structured confidential JSON file of your chats and health logs to share with your personal psychologist.
                </p>
                <button onClick={handleExportData} className="mm-btn-dark">
                  <Download className="w-4 h-4" />
                  <span>Download Chat Records (.JSON)</span>
                </button>
              </div>

              <div className="mm-chatgpt-card">
                <h3 className="text-red-400">Clear All Chat History</h3>
                <p className="text-zinc-400 text-xs mb-3">
                  Wipe all active and saved conversation transcripts from this device.
                </p>
                {!showClearConfirm ? (
                  <button onClick={() => setShowClearConfirm(true)} className="mm-btn-ghost-danger">
                    <Trash2 className="w-4 h-4" />
                    <span>Clear All Conversations</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-red-400">Are you sure?</span>
                    <button onClick={handleClearConversations} className="mm-btn-danger">
                      Yes, Clear All
                    </button>
                    <button onClick={() => setShowClearConfirm(false)} className="mm-btn-dark">
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="mm-actions-flex">
                <button onClick={saveAllSettings} className="mm-btn-white">
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
            <div className="mm-section-content">
              <div className="mm-content-title-bar">
                <h2>Notifications & Wellness Reminders</h2>
                <p>Gentle pings for daily mindfulness and upcoming doctor appointments.</p>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Daily Mindful Check-Ins</h3>

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Morning Gratitude & Mood Check</div>
                    <div className="text-zinc-500 text-xs">Uplifting morning intention and grounding exercise.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={notifSettings.morningTime}
                      onChange={(e) => setNotifSettings({ ...notifSettings, morningTime: e.target.value })}
                      className="mm-time-picker"
                    />
                    <input
                      type="checkbox"
                      checked={notifSettings.morningCheckIn}
                      onChange={(e) => setNotifSettings({ ...notifSettings, morningCheckIn: e.target.checked })}
                      className="mm-checkbox"
                    />
                  </div>
                </div>

                <div className="mm-divider-dark" />

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Evening Decompression & Reflection</div>
                    <div className="text-zinc-500 text-xs">End-of-day stress release and mindfulness review.</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={notifSettings.eveningTime}
                      onChange={(e) => setNotifSettings({ ...notifSettings, eveningTime: e.target.value })}
                      className="mm-time-picker"
                    />
                    <input
                      type="checkbox"
                      checked={notifSettings.eveningCheckIn}
                      onChange={(e) => setNotifSettings({ ...notifSettings, eveningCheckIn: e.target.checked })}
                      className="mm-checkbox"
                    />
                  </div>
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Appointments & Quiet Hours</h3>

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Therapy Session Alerts</div>
                    <div className="text-zinc-500 text-xs">Alert 1 hour prior to scheduled doctor/therapist appointments.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.bookingAlerts}
                    onChange={(e) => setNotifSettings({ ...notifSettings, bookingAlerts: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>

                <div className="mm-divider-dark" />

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Quiet Hours (Do Not Disturb)</div>
                    <div className="text-zinc-500 text-xs">Mute non-critical notifications between 10:00 PM and 08:00 AM.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.quietHours}
                    onChange={(e) => setNotifSettings({ ...notifSettings, quietHours: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>
              </div>

              <div className="mm-actions-flex">
                <button onClick={saveAllSettings} className="mm-btn-white">
                  <Save className="w-4 h-4" />
                  <span>Save Notifications</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 5: ACCESSIBILITY & SAFETY
             ======================================================== */}
          {activeSection === "accessibility" && (
            <div className="mm-section-content">
              <div className="mm-content-title-bar">
                <h2>Accessibility & Safety Tools</h2>
                <p>Discreet privacy safety, guided breathwork, and reading aids.</p>
              </div>

              <div className="mm-chatgpt-card">
                <div className="mm-setting-row">
                  <div>
                    <div className="font-semibold text-sm text-zinc-100 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400" />
                      Discreet "Quick-Exit" Panic Button
                    </div>
                    <div className="text-zinc-400 text-xs mt-1 leading-relaxed">
                      Places a discreet button on screen that instantly redirects your browser to Google Weather if someone enters your room.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessSettings.panicButton}
                    onChange={(e) => setAccessSettings({ ...accessSettings, panicButton: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <div className="flex items-center justify-between">
                  <div>
                    <h3>Instant 4-7-8 Breathing Guide</h3>
                    <p className="text-zinc-400 text-xs mt-0.5">
                      Scientifically proven calming technique to lower heart rate and reduce panic.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBreathingModal(true)}
                    className="mm-btn-dark shrink-0"
                  >
                    <Wind className="w-4 h-4 text-emerald-400" />
                    <span>Start 60s Breathing</span>
                  </button>
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <h3>Readability Enhancements</h3>

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">High Contrast Mode</div>
                    <div className="text-zinc-500 text-xs">Sharper border outlines and enhanced contrast for visually impaired reading.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessSettings.highContrast}
                    onChange={(e) => setAccessSettings({ ...accessSettings, highContrast: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>

                <div className="mm-divider-dark" />

                <div className="mm-setting-row">
                  <div>
                    <div className="font-medium text-sm text-zinc-200">Dyslexia-Friendly Letterforms</div>
                    <div className="text-zinc-500 text-xs">Weighted characters to prevent letter confusion and improve flow.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={accessSettings.dyslexicFont}
                    onChange={(e) => setAccessSettings({ ...accessSettings, dyslexicFont: e.target.checked })}
                    className="mm-checkbox"
                  />
                </div>
              </div>

              {/* Loophole Portal Preview if requested */}
              {onTriggerPortal && (
                <div className="mm-chatgpt-card">
                  <h3>Cosmic Loop Hole Portal</h3>
                  <p className="text-zinc-400 text-xs mb-3">
                    Replay the 3-second quantum wormhole entrance animation:
                  </p>
                  <button
                    type="button"
                    onClick={onTriggerPortal}
                    className="mm-btn-dark"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Replay 3s Loop Hole Portal</span>
                  </button>
                </div>
              )}

              <div className="mm-actions-flex">
                <button onClick={saveAllSettings} className="mm-btn-white">
                  <Save className="w-4 h-4" />
                  <span>Save Accessibility Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================
              SECTION 6: LANGUAGE & 24/7 HELPLINES (SOS)
             ======================================================== */}
          {activeSection === "helplines" && (
            <div className="mm-section-content">
              <div className="mm-content-title-bar">
                <h2>Language, Region & 24/7 Crisis Helplines</h2>
                <p>AI response language and verified government/NGO emergency hotlines.</p>
              </div>

              <div className="mm-chatgpt-card">
                <h3>AI Companion Language</h3>
                <div className="mm-input-field">
                  <label>Select preferred dialect</label>
                  <select
                    value={langSettings.aiLanguage}
                    onChange={(e) => setLangSettings({ ...langSettings, aiLanguage: e.target.value })}
                  >
                    <option value="english_hinglish">English & Hinglish (Natural Indian colloquial)</option>
                    <option value="hindi">हिन्दी (Hindi)</option>
                    <option value="marathi">मराठी (Marathi)</option>
                    <option value="bengali">বাংলা (Bengali)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="telugu">తెలుగు (Telugu)</option>
                    <option value="global_english">Standard Global English</option>
                  </select>
                </div>
              </div>

              <div className="mm-chatgpt-card">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4 h-4 text-red-400" />
                  <h3 className="text-zinc-100">24/7 Verified Emergency Helplines</h3>
                </div>
                <p className="text-zinc-400 text-xs mb-4">
                  Free, confidential, and available round the clock:
                </p>

                <div className="mm-helpline-grid">
                  {[
                    { name: "Tele-MANAS (Govt. of India)", number: "14416", alt: "1800-891-4416", desc: "National 24x7 toll-free mental health support in 20+ languages." },
                    { name: "KIRAN Mental Health Helpline", number: "1800-599-0019", alt: null, desc: "Ministry of Social Justice, 24x7 anxiety & depression assistance." },
                    { name: "Vandrevala Foundation", number: "9999-666-555", alt: null, desc: "Free professional psychological counseling & crisis support." },
                    { name: "AASRA Suicide Prevention", number: "+91-9820466726", alt: null, desc: "Immediate confidential emotional first aid." },
                    { name: "National Emergency SOS", number: "112", alt: null, desc: "All-in-one national emergency helpline for urgent safety." }
                  ].map((line, idx) => (
                    <div key={idx} className="mm-helpline-row">
                      <div className="mm-helpline-info">
                        <div className="font-semibold text-sm text-zinc-100">{line.name}</div>
                        <div className="text-zinc-500 text-xs">{line.desc}</div>
                        <div className="font-mono text-zinc-300 text-xs font-bold mt-1">
                          {line.number} {line.alt && ` / ${line.alt}`}
                        </div>
                      </div>
                      <div className="mm-helpline-btns">
                        <button
                          type="button"
                          onClick={() => handleCopy(line.number, line.name)}
                          className="mm-btn-dark-sm"
                          title="Copy phone number"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </button>
                        <a
                          href={`tel:${line.number.replace(/[^0-9+]/g, "")}`}
                          className="mm-btn-call"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mm-actions-flex">
                <button onClick={saveAllSettings} className="mm-btn-white">
                  <Save className="w-4 h-4" />
                  <span>Save Language Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PERMANENT DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="mm-modal-dialog-overlay">
          <div className="mm-delete-confirm-box">
            <div className="flex items-center gap-3 text-red-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">Permanently Delete Account?</h3>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed mb-4">
              This action is permanent and cannot be undone. All your chat history, journal notes, doctor appointments, and account details will be irreversibly deleted.
            </p>

            <div className="mb-4">
              <label className="text-xs text-zinc-400 block mb-1">
                Please type <strong className="text-red-400">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE"
                className="mm-delete-text-input"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
                className="mm-btn-dark"
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDeleteAccount}
                disabled={deleteConfirmText.trim().toUpperCase() !== "DELETE" || isDeletingAccount}
                className="mm-btn-danger"
              >
                {isDeletingAccount ? "Purging Account..." : "Confirm & Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-7-8 BREATHING GUIDE MODAL */}
      {showBreathingModal && (
        <div className="mm-modal-dialog-overlay">
          <div className="mm-breathing-modal-card">
            <button
              onClick={() => setShowBreathingModal(false)}
              className="mm-breathing-close-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">4-7-8 Calming Breathwork</h3>
              <p className="text-zinc-400 text-xs mb-6">Focus on the circle. Inhale peace, exhale tension.</p>

              <div className={`mm-breath-circle ${breathingPhase.toLowerCase()}`}>
                <div className="text-2xl font-bold text-white uppercase">{breathingPhase}</div>
                <div className="text-3xl font-mono text-zinc-100 font-bold mt-1">{breathingTimer}s</div>
              </div>

              <p className="text-zinc-400 text-xs mt-6">
                {breathingPhase === "Inhale" && "Inhale gently through your nose for 4 seconds..."}
                {breathingPhase === "Hold" && "Hold your breath calmly for 7 seconds..."}
                {breathingPhase === "Exhale" && "Exhale completely through your mouth for 8 seconds..."}
              </p>

              <button
                type="button"
                onClick={() => setShowBreathingModal(false)}
                className="mm-btn-dark mt-6 mx-auto"
              >
                I Feel Centered Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
