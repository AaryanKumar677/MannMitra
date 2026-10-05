// Resources.jsx - Comprehensive Mental Health & Wellness Resources Hub
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import Profile from "../../../pages/Profile";
import {
  Search,
  BookOpen,
  Video,
  Headphones,
  PhoneCall,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  X,
  ChevronRight,
  Clock,
  ShieldCheck,
  Award,
  Stethoscope,
  User,
  LogOut,
  Check,
  Volume2,
  VolumeX,
  AlertTriangle,
  ArrowRight,
  Play,
  Pause,
  ExternalLink,
  Share2,
  Heart,
  RefreshCw,
  Sliders,
  Wind
} from "lucide-react";
import "./Resources.css";

// Comprehensive Clinical Resources Database
const resourcesData = [
  // AUDIO & MEDITATIONS
  {
    id: "aud-1",
    type: "audio",
    title: "5-Minute Grounding (5-4-3-2-1 Technique)",
    description: "An evidence-based sensory scan to interrupt racing thoughts, soothe the amygdala, and regain focus during acute anxiety.",
    category: "Audio & Meditations",
    duration: "5 min",
    concern: "Anxiety & Panic",
    instructor: "Dr. Kabir Singh, Clinical Psychologist",
    badge: "Most Popular",
    audioSrc: "https://actions.google.com/sounds/v1/water/rain_heavy.ogg",
    steps: [
      "Find a comfortable seated position with feet flat on the floor.",
      "Notice 5 things you can see around you.",
      "Notice 4 things you can physically feel (e.g. feet on floor, sweater on skin).",
      "Notice 3 distinct sounds you can hear.",
      "Notice 2 things you can smell or enjoy the scent of.",
      "Notice 1 thing you can taste or take a mindful sip of water."
    ]
  },
  {
    id: "aud-2",
    type: "audio",
    title: "Deep Sleep Yoga Nidra & Body Scan",
    description: "Progressive muscle relaxation and parasympathetic breath pacing designed to induce restorative, slow-wave sleep naturally.",
    category: "Audio & Meditations",
    duration: "15 min",
    concern: "Sleep & Insomnia",
    instructor: "Meera Joshi, Mindfulness & Somatic Guide",
    badge: "Recommended for Sleep",
    audioSrc: "https://actions.google.com/sounds/v1/water/gentle_stream_water.ogg",
    steps: [
      "Lie down in a dark, quiet room with palms facing upward.",
      "Allow the jaw to unclench and tongue to fall away from the roof of the mouth.",
      "Follow the guided body scan from the crown of your head to your toes.",
      "Breathe in for 4 seconds, exhale slowly for 7 seconds to stimulate the vagus nerve."
    ]
  },
  {
    id: "aud-3",
    type: "audio",
    title: "Box Breathing (4-4-4-4) Nervous System Reset",
    description: "The clinical square breathing technique used by medical trauma teams to rapidly lower cortisol, blood pressure, and heart rate.",
    category: "Audio & Meditations",
    duration: "4 min",
    concern: "Stress & Burnout",
    instructor: "Dr. Arvind Sametha, Senior Psychiatrist",
    badge: "Quick Reset",
    audioSrc: "https://actions.google.com/sounds/v1/weather/light_wind.ogg",
    steps: [
      "Inhale slowly through the nose for 4 counts.",
      "Hold your breath gently at the top for 4 counts.",
      "Exhale smoothly through your mouth for 4 counts.",
      "Hold your lungs empty and relaxed for 4 counts.",
      "Repeat the cycle 4 to 6 times."
    ]
  },
  {
    id: "aud-4",
    type: "audio",
    title: "Taming the Inner Critic: Self-Compassion Break",
    description: "Dr. Kristin Neff's validated psychological framework for diffusing shame, perfectionism, and excessive self-blame.",
    category: "Audio & Meditations",
    duration: "8 min",
    concern: "Emotional Regulation",
    instructor: "Anika Mehta, Senior CBT Specialist",
    badge: "Clinical CBT",
    audioSrc: "https://actions.google.com/sounds/v1/water/rain_light.ogg",
    steps: [
      "Acknowledge the moment of difficulty: 'This is a moment of suffering'.",
      "Remind yourself of common humanity: 'Suffering is part of being human; I am not alone'.",
      "Place a warm hand over your heart or chest.",
      "Speak to yourself with the same kindness you would offer a dear friend."
    ]
  },
  {
    id: "aud-5",
    type: "audio",
    title: "Pre-Work Dopamine & Focus Calibration",
    description: "Clear morning brain fog, reduce task paralysis, and prime prefrontal cognitive stamina before starting demanding tasks.",
    category: "Audio & Meditations",
    duration: "7 min",
    concern: "Focus & Productivity",
    instructor: "Dr. Riya Verma, Cognitive Neurologist",
    badge: "Neuro-Wellness",
    audioSrc: "https://actions.google.com/sounds/v1/water/river_running.ogg",
    steps: [
      "Take 10 rhythmic deep belly breaths to elevate oxygen saturation.",
      "Define exactly ONE highest-priority milestone for the next 90 minutes.",
      "Remove visual distractions and smartphone notifications.",
      "Transition into flow with non-judgmental presence."
    ]
  },

  // VIDEO MASTERCLASSES
  {
    id: "vid-1",
    type: "video",
    title: "The Neuroscience of Overthinking & Panic Loops",
    description: "Understand how the amygdala overrides logic during stress, and master 3 proven neurochemical levers to shut down rumination spirals.",
    category: "Video Masterclasses",
    duration: "12 min",
    concern: "Anxiety & Panic",
    instructor: "Dr. Arvind Sametha (AIIMS New Delhi)",
    badge: "Featured Masterclass",
    youtubeId: "30_h1fE8e6s",
    keyTakeaways: [
      "Anxiety is a physiological alarm, not a personality flaw.",
      "How catastrophic predictions activate cortisol release.",
      "The Physiological Sigh: Double inhale followed by long exhale for instant autonomic reset.",
      "Why arguing with intrusive thoughts reinforces them."
    ]
  },
  {
    id: "vid-2",
    type: "video",
    title: "CBT 101: Untangling Cognitive Distortions",
    description: "Clinical psychologist breakdown of all-or-nothing thinking, catastrophizing, and mind-reading, with practical thought reframing drills.",
    category: "Video Masterclasses",
    duration: "15 min",
    concern: "Depression & Low Mood",
    instructor: "Anika Mehta (Beck Institute Fellow)",
    badge: "Essential CBT",
    youtubeId: "G7b2tM-J66Y",
    keyTakeaways: [
      "Thoughts are hypotheses, not objective facts.",
      "How to spot emotional reasoning ('I feel like a failure, therefore I am').",
      "Constructing balanced cognitive evidence sheets.",
      "Daily 3-column thought restructuring practice."
    ]
  },
  {
    id: "vid-3",
    type: "video",
    title: "Why Scrolling Isn't Rest: True Burnout Recovery",
    description: "Why digital consumption keeps the nervous system hyper-stimulated and how Non-Sleep Deep Rest (NSDR) replenishes mental stamina.",
    category: "Video Masterclasses",
    duration: "14 min",
    concern: "Stress & Burnout",
    instructor: "Aman Singh, Workplace Psychologist",
    badge: "Career Wellness",
    youtubeId: "pL02HRFk2vo",
    keyTakeaways: [
      "Active rest vs. passive digital exhaustion.",
      "Setting non-negotiable boundaries around evening work emails.",
      "Cortisol curves and managing energy versus time.",
      "How somatic decompression unplugs high-performing brains."
    ]
  },
  {
    id: "vid-4",
    type: "video",
    title: "Managing Acute Panic Attacks in Public",
    description: "A step-by-step physical emergency toolkit: handling hyperventilation, dizziness, chest tightness, and rapid heart rates safely.",
    category: "Video Masterclasses",
    duration: "10 min",
    concern: "Anxiety & Panic",
    instructor: "Dr. Kabir Singh, Clinical Psychologist",
    badge: "Emergency Guide",
    youtubeId: "8jPQjJS3tdo",
    keyTakeaways: [
      "Panic attacks cannot cause heart attacks or suffocation.",
      "Resisting panic prolongs it; surrendering reduces duration.",
      "Using cold water stimulation on wrists and temples for mammalian dive reflex.",
      "How to step into a safe corner without feeling embarrassed."
    ]
  },

  // CBT & CLINICAL READING GUIDES
  {
    id: "guide-1",
    type: "guide",
    title: "The CBT Thought Record: 5-Step Restructuring Guide",
    description: "The gold standard cognitive behavioral exercise used by clinical therapists worldwide to dismantle irrational catastrophic beliefs.",
    category: "CBT & Self-Help Guides",
    duration: "6 min read",
    concern: "Emotional Regulation",
    instructor: "Clinical Psychology Board",
    badge: "Therapist Approved",
    content: `
### What is a CBT Thought Record?
A Thought Record is a systematic cognitive exercise created by Dr. Aaron Beck. It teaches your conscious mind to separate objective reality from emotional distortions.

---

### Step 1: Identify the Trigger Situation
*Where were you? Who was involved? What event immediately preceded your sudden drop in mood?*
Be specific and objective: e.g., *"My manager sent an email saying 'Can we talk tomorrow morning?' with no other context."*

### Step 2: Note the Automatic Thoughts
Write down the exact phrase your mind immediately screamed:
- *"I am going to get fired."*
- *"I must have messed up the presentation."*
- *"I can never do anything right."*

### Step 3: Identify the Cognitive Distortion
Which trap did your mind fall into?
- **Catastrophizing:** Jumping immediately to the worst imaginable disaster.
- **Mind Reading:** Assuming you know other people's unspoken negative judgements.
- **Mental Filter:** Discarding all your recent achievements to focus exclusively on perceived risk.

### Step 4: Examine the Concrete Evidence
- **Evidence Supporting the Thought:** Has my manager expressed dissatisfaction recently? Has my performance lagged?
- **Evidence Contradicting the Thought:** Have I completed all deadlines? Was my recent review positive? Do managers routinely meet with direct reports for routine check-ins?

### Step 5: Draft a Rational, Balanced Thought
Replace the catastrophic loop with a realistic synthesis:
> *"My manager wants to meet. It could be for regular project updates or new assignments. Even if there is feedback, it is an opportunity to improve, not an immediate catastrophe. I will wait for the facts."*
    `
  },
  {
    id: "guide-2",
    type: "guide",
    title: "The 10-3-2-1-0 Sleep Architecture Protocol",
    description: "A research-backed circadian blueprint to cure bedtime revenge procrastination and restore non-REM restorative sleep cycles.",
    category: "CBT & Self-Help Guides",
    duration: "5 min read",
    concern: "Sleep & Insomnia",
    instructor: "Dr. Riya Verma, Neurologist",
    badge: "Neurology Protocol",
    content: `
### The 10-3-2-1-0 Protocol Explained
Healthy sleep is not an on/off switch; it is an orchestrated neurochemical descent governed by melatonin, adenosine, and cortisol.

---

- **10 Hours Before Bed (No Caffeine):**
  Caffeine has an average half-life of 5 to 7 hours and a quarter-life of 12 hours. Drinking coffee at 4 PM means 25% of that stimulant is still binding adenosine receptors in your brain at midnight.

- **3 Hours Before Bed (No Heavy Food or Alcohol):**
  Digestion requires elevated metabolic core temperature, preventing your body from cooling the 1–2°F necessary for deep slow-wave sleep. Alcohol fragments REM cycles and destroys next-day cognitive agility.

- **2 Hours Before Bed (No Work or Cognitively Demanding Tasks):**
  Close your laptop, stop responding to messages, and file tomorrow's to-do list onto paper to prevent midnight ruminations.

- **1 Hour Before Bed (No Blue Light / Screens):**
  Photons of short-wavelength blue light from phone screens trigger melanopsin in retinal ganglion cells, falsely signaling daylight to your suprachiasmatic nucleus.

- **0:**
  The number of times you press the snooze button in the morning. Getting immediate natural morning sunlight within 30 minutes of waking anchors your circadian clock for the following night.
    `
  },
  {
    id: "guide-3",
    type: "guide",
    title: "Navigating Imposter Syndrome & Workplace Self-Doubt",
    description: "Practical strategies for students, engineers, and professionals to dismantle feelings of being an intellectual fraud.",
    category: "CBT & Self-Help Guides",
    duration: "7 min read",
    concern: "Focus & Productivity",
    instructor: "Aman Singh, Counseling Psychologist",
    badge: "High Performance",
    content: `
### Understanding Imposter Phenomenon
Imposter syndrome is the persistent inability to internalize your genuine success and a constant fear of being exposed as incompetent despite clear evidence of your capability.

---

### Core Realities to Internalize:
1. **Feelings are Not Facts:** Feeling unqualified does not make you unqualified.
2. **Competence Feels Uncomfortable:** Growth always occurs at the outer edge of your comfort zone.
3. **The Pluralistic Ignorance Trap:** Everyone around you is dealing with their own private uncertainties; you are simply comparing your internal doubts with their external highlight reel.

### Actionable Strategies:
- **Build a 'Proof Portfolio':** Maintain a private folder containing positive client reviews, code reviews, congratulatory messages, and finished projects. Revisit it whenever self-doubt spikes.
- **Separate Luck from Effort:** When a project succeeds, list 3 specific decisions or efforts YOU made that contributed to the positive outcome.
- **Normalize 'I Don't Know Yet':** Saying 'I need to investigate that' is a sign of high intellectual honesty, not incompetence.
    `
  }
];

// Verified 24/7 Crisis Helplines Data
const crisisHelplines = [
  {
    name: "Tele-MANAS (Govt of India & NIMHANS)",
    number: "14416",
    altNumber: "1800 891 4416",
    hours: "24 Hours / 7 Days",
    languages: "Hindi, English & 20 Regional Languages",
    tag: "National Helpline",
    description: "Free round-the-clock comprehensive mental health tele-care by Ministry of Health and Family Welfare."
  },
  {
    name: "KIRAN National Mental Health Helpline",
    number: "1800-599-0019",
    hours: "24 Hours / 7 Days",
    languages: "Hindi, English, Tamil, Telugu, Marathi, Gujarati & more",
    tag: "Dept of Empowerment of PwDs",
    description: "Toll-free psychological support, first-aid, stress management, and suicidal behavior prevention."
  },
  {
    name: "Vandrevala Foundation for Mental Health",
    number: "9999 666 555",
    hours: "24 Hours / 7 Days",
    languages: "English, Hindi & Major Indian Languages",
    tag: "Crisis Intervention",
    description: "Free, confidential 24x7 crisis counseling and emotional intervention by trained counselors."
  },
  {
    name: "AASRA Suicide Prevention Helpline",
    number: "+91 98204 66726",
    hours: "24 Hours / 7 Days",
    languages: "English, Hindi",
    tag: "Suicide Prevention",
    description: "Confidential and non-judgmental emotional support for individuals experiencing extreme despair."
  }
];

const concernFilterList = [
  "All Concerns",
  "Anxiety & Panic",
  "Sleep & Insomnia",
  "Stress & Burnout",
  "Depression & Low Mood",
  "Focus & Productivity",
  "Emotional Regulation"
];

export default function Resources({ user: propUser }) {
  const authContext = useAuth();
  const authUser = authContext?.user || propUser;
  const profile = authContext?.profile;
  const signOut = authContext?.signOut;

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.body.classList.contains("dark-mode") || localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  // Profile modal and dropdown state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all' | 'audio' | 'video' | 'guide' | 'helplines' | 'saved'
  const [selectedConcern, setSelectedConcern] = useState("All Concerns");

  // Bookmarked / Saved resources
  const [savedResourceIds, setSavedResourceIds] = useState(() => {
    try {
      const saved = localStorage.getItem("mannmitra_saved_resources");
      return saved ? JSON.parse(saved) : ["aud-1", "guide-1"];
    } catch {
      return ["aud-1", "guide-1"];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mannmitra_saved_resources", JSON.stringify(savedResourceIds));
    } catch (err) {
      console.error("Failed to save bookmarks:", err);
    }
  }, [savedResourceIds]);

  const toggleBookmark = (id, e) => {
    e?.stopPropagation();
    setSavedResourceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Modals: Audio Player, Video Player, Guide Reader, Breathing Tool
  const [activeAudioItem, setActiveAudioItem] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const audioRef = useRef(null);

  const [activeVideoItem, setActiveVideoItem] = useState(null);
  const [activeGuideItem, setActiveGuideItem] = useState(null);
  const [showBreathingWidget, setShowBreathingWidget] = useState(false);

  // Breathing tool animation state
  const [breathingPhase, setBreathingPhase] = useState("Inhale"); // Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  const [breathingCounter, setBreathingCounter] = useState(4);
  const [breathingCycles, setBreathingCycles] = useState(0);

  useEffect(() => {
    if (!showBreathingWidget) return;
    const interval = setInterval(() => {
      setBreathingCounter((prev) => {
        if (prev <= 1) {
          setBreathingPhase((currPhase) => {
            if (currPhase === "Inhale") return "Hold";
            if (currPhase === "Hold") return "Exhale";
            if (currPhase === "Exhale") return "Rest";
            if (currPhase === "Rest") {
              setBreathingCycles((c) => c + 1);
              return "Inhale";
            }
            return "Inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showBreathingWidget]);

  // Audio Playback Handler
  const handlePlayAudio = (item) => {
    if (activeAudioItem?.id === item.id) {
      if (isPlayingAudio) {
        audioRef.current?.pause();
        setIsPlayingAudio(false);
      } else {
        audioRef.current?.play().catch(() => {});
        setIsPlayingAudio(true);
      }
    } else {
      setActiveAudioItem(item);
      setIsPlayingAudio(true);
      setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 50);
    }
  };

  // Filtered resources calculation
  const filteredResources = useMemo(() => {
    return resourcesData.filter((item) => {
      // Category filter
      if (selectedCategory === "saved") {
        if (!savedResourceIds.includes(item.id)) return false;
      } else if (selectedCategory !== "all" && item.type !== selectedCategory) {
        return false;
      }

      // Concern filter
      if (selectedConcern !== "All Concerns" && item.concern !== selectedConcern) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesInstructor = item.instructor?.toLowerCase().includes(q);
        const matchesConcern = item.concern?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesInstructor && !matchesConcern) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedConcern, searchQuery, savedResourceIds]);

  return (
    <div className="resources-hub-page">
      {/* Background Ambient Glows */}
      <div className="resource-ambient-glow glow-blue" />
      <div className="resource-ambient-glow glow-teal" />

      {/* TOPBAR: Left Theme Toggle, Center Brand, Right Profile Menu */}
      <div className="resources-topbar">
        {/* Left: Theme toggle */}
        <button
          className="resources-theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          <span className="toggle-symbol">{isDarkMode ? "☀️" : "🌙"}</span>
          <span className="toggle-text">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Center: Clinical Hub Tag */}
        <div className="resources-center-brand">
          <BookOpen size={16} className="brand-book-icon" />
          <span>MannMitra Psycho-Education & Self-Care Toolkit</span>
        </div>

        {/* Right: Profile Menu */}
        <div className="resources-profile-wrapper" ref={profileDropdownRef}>
          <button
            className="resources-profile-trigger"
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            title="Account Profile"
            aria-label="Account Profile"
          >
            {profile?.photo_url || authUser?.photoURL ? (
              <img
                src={profile?.photo_url || authUser?.photoURL}
                alt="User profile"
                className="resources-profile-avatar"
              />
            ) : (
              <div className="resources-profile-avatar-fallback">
                <User size={18} />
              </div>
            )}
          </button>

          {showProfileDropdown && (
            <div className="resources-profile-menu">
              <div className="menu-user-info">
                <span className="menu-user-name">
                  {profile?.first_name 
                    ? `${profile.first_name} ${profile.last_name || ""}` 
                    : (authUser?.displayName || "MannMitra User")}
                </span>
                <span className="menu-user-email">
                  {profile?.email || authUser?.email || "Patient Account"}
                </span>
              </div>
              <div className="menu-divider" />
              <button
                className="menu-action-btn"
                onClick={() => {
                  setShowProfileDropdown(false);
                  setShowProfileModal(true);
                }}
              >
                <User size={15} /> Profile Settings
              </button>
              <div className="menu-divider" />
              <button
                className="menu-action-btn logout-btn"
                onClick={async () => {
                  setShowProfileDropdown(false);
                  if (signOut) {
                    await signOut();
                    window.location.reload();
                  }
                }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="resources-container">
        {/* HERO SECTION - Authentic, clinically validated human tone */}
        <header className="resources-hero">
          <div className="hero-pill-badge">
            <ShieldCheck size={14} className="badge-shield-icon" />
            <span>Clinically Curated Psycho-Education & Practical Toolkits</span>
          </div>

          <h1 className="hero-heading">
            Evidence-Based Guides, Audio Meditations & Self-Care
          </h1>

          <p className="hero-subtext">
            Explore clinically vetted audio meditations, video masterclasses, emergency crisis hotlines,
            and downloadable CBT worksheets designed by licensed psychologists to support your daily mental wellness.
          </p>

          {/* Quick Action Badges */}
          <div className="hero-feature-ribbon">
            <button
              className="quick-action-pill interactive-pulse"
              onClick={() => setShowBreathingWidget(true)}
            >
              <Wind size={16} className="pill-icon teal" />
              <span>Launch 4-4-4-4 Breathing Coach</span>
            </button>

            <button
              className="quick-action-pill"
              onClick={() => setSelectedCategory("helplines")}
            >
              <PhoneCall size={16} className="pill-icon red" />
              <span>24/7 Verified Crisis Helplines</span>
            </button>

            <button
              className="quick-action-pill"
              onClick={() => setSelectedCategory("audio")}
            >
              <Headphones size={16} className="pill-icon indigo" />
              <span>Somatic Audio Resets</span>
            </button>
          </div>
        </header>

        {/* 24/7 EMERGENCY CRISIS HOTLINE ACCORDION BANNER */}
        <div className="crisis-hotline-banner">
          <div className="crisis-banner-left">
            <div className="crisis-alert-icon">
              <PhoneCall size={20} />
            </div>
            <div>
              <h4>Need Immediate Help or Feeling Overwhelmed?</h4>
              <p>National 24/7 toll-free crisis counselors are available right now. 100% free and confidential.</p>
            </div>
          </div>
          <div className="crisis-banner-right">
            <a href="tel:14416" className="btn-call-helpline">
              <PhoneCall size={16} /> Call Tele-MANAS (14416)
            </a>
            <button
              className="btn-view-helplines"
              onClick={() => setSelectedCategory("helplines")}
            >
              All Helplines
            </button>
          </div>
        </div>

        {/* NAVIGATION / FILTER SUITE */}
        <div className="resources-filters-container">
          {/* Search Box & Category Pills */}
          <div className="filter-primary-row">
            <div className="resources-search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search topics, CBT techniques, audio resets, insomnia guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  title="Clear Search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="category-tabs-group">
              <button
                className={`category-tab-btn ${selectedCategory === "all" ? "active" : ""}`}
                onClick={() => setSelectedCategory("all")}
              >
                All Resources
                <span className="count-pill">{resourcesData.length}</span>
              </button>

              <button
                className={`category-tab-btn ${selectedCategory === "audio" ? "active" : ""}`}
                onClick={() => setSelectedCategory("audio")}
              >
                <Headphones size={15} /> Audio Meditations
              </button>

              <button
                className={`category-tab-btn ${selectedCategory === "video" ? "active" : ""}`}
                onClick={() => setSelectedCategory("video")}
              >
                <Video size={15} /> Video Masterclasses
              </button>

              <button
                className={`category-tab-btn ${selectedCategory === "guide" ? "active" : ""}`}
                onClick={() => setSelectedCategory("guide")}
              >
                <BookOpen size={15} /> CBT Worksheets
              </button>

              <button
                className={`category-tab-btn ${selectedCategory === "helplines" ? "active" : ""}`}
                onClick={() => setSelectedCategory("helplines")}
              >
                <PhoneCall size={15} /> Crisis Helplines
              </button>

              <button
                className={`category-tab-btn ${selectedCategory === "saved" ? "active" : ""}`}
                onClick={() => setSelectedCategory("saved")}
              >
                <Bookmark size={15} /> Saved ({savedResourceIds.length})
              </button>
            </div>
          </div>

          {/* Quick Concern Chips */}
          <div className="concern-chips-container">
            <span className="chips-title">Filter by Topic:</span>
            <div className="chips-scroll-view">
              {concernFilterList.map((concern) => (
                <button
                  key={concern}
                  className={`concern-chip-btn ${selectedConcern === concern ? "active" : ""}`}
                  onClick={() => setSelectedConcern(concern)}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        {selectedCategory !== "helplines" && (
          <div className="resources-results-meta">
            <span>
              Showing <strong>{filteredResources.length}</strong> clinical resource{filteredResources.length !== 1 ? "s" : ""}
            </span>
            {(searchQuery || selectedCategory !== "all" || selectedConcern !== "All Concerns") && (
              <button
                className="reset-all-btn"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedConcern("All Concerns");
                }}
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* CRISIS HELPLINES VIEW */}
        {selectedCategory === "helplines" && (
          <div className="crisis-helpline-grid-view">
            <div className="helpline-intro-banner">
              <h3>National Mental Health Emergency Contacts (India)</h3>
              <p>
                If you or someone you know is in acute distress or having suicidal ideation, please connect with these verified crisis lifelines immediately. They are completely free, confidential, and available 24 hours a day.
              </p>
            </div>

            <div className="helplines-cards-grid">
              {crisisHelplines.map((helpline) => (
                <div key={helpline.name} className="helpline-card">
                  <div className="helpline-card-header">
                    <span className="helpline-tag">{helpline.tag}</span>
                    <span className="helpline-hours">
                      <Clock size={13} /> {helpline.hours}
                    </span>
                  </div>

                  <h4 className="helpline-title">{helpline.name}</h4>
                  <p className="helpline-desc">{helpline.description}</p>

                  <div className="helpline-languages">
                    <strong>Languages:</strong> {helpline.languages}
                  </div>

                  <div className="helpline-action-row">
                    <a href={`tel:${helpline.number.replace(/\s+/g, "")}`} className="btn-call-number">
                      <PhoneCall size={16} /> Call {helpline.number}
                    </a>
                    {helpline.altNumber && (
                      <a href={`tel:${helpline.altNumber.replace(/\s+/g, "")}`} className="btn-call-alt">
                        Alt: {helpline.altNumber}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NORMAL RESOURCES GRID */}
        {selectedCategory !== "helplines" && (
          <>
            {filteredResources.length === 0 ? (
              <div className="empty-resources-card">
                <AlertTriangle size={48} className="empty-warn-icon" />
                <h3>No resources found matching your filter</h3>
                <p>Try clearing your search query or switching to another topic category.</p>
                <button
                  className="btn-primary-reset"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedConcern("All Concerns");
                  }}
                >
                  View All Resources
                </button>
              </div>
            ) : (
              <div className="resources-cards-grid">
                {filteredResources.map((item) => {
                  const isSaved = savedResourceIds.includes(item.id);
                  const isThisAudioPlaying = activeAudioItem?.id === item.id && isPlayingAudio;

                  return (
                    <div key={item.id} className={`resource-card ${item.type}-card`}>
                      {/* Card Header */}
                      <div className="card-header-row">
                        <div className="card-type-badge">
                          {item.type === "audio" && <Headphones size={14} />}
                          {item.type === "video" && <Video size={14} />}
                          {item.type === "guide" && <BookOpen size={14} />}
                          <span>{item.category}</span>
                        </div>

                        <button
                          className={`bookmark-btn ${isSaved ? "bookmarked" : ""}`}
                          onClick={(e) => toggleBookmark(item.id, e)}
                          title={isSaved ? "Remove from Saved" : "Save Resource"}
                          aria-label="Bookmark"
                        >
                          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                        </button>
                      </div>

                      {/* Main Title & Concern */}
                      <div className="card-headline-block">
                        <span className="concern-tag-pill">{item.concern}</span>
                        <h3 className="resource-title">{item.title}</h3>
                        <p className="resource-description">{item.description}</p>
                      </div>

                      {/* Instructor & Duration Meta */}
                      <div className="resource-meta-strip">
                        <div className="meta-instructor">
                          <Stethoscope size={13} className="meta-icon" />
                          <span>{item.instructor}</span>
                        </div>
                        <div className="meta-duration">
                          <Clock size={13} className="meta-icon" />
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      {/* Action CTA Row */}
                      <div className="card-action-footer">
                        {item.type === "audio" && (
                          <button
                            className={`btn-primary-action ${isThisAudioPlaying ? "playing" : ""}`}
                            onClick={() => handlePlayAudio(item)}
                          >
                            {isThisAudioPlaying ? (
                              <>
                                <Pause size={16} /> Pause Meditation
                              </>
                            ) : (
                              <>
                                <Play size={16} /> Listen to Audio
                              </>
                            )}
                          </button>
                        )}

                        {item.type === "video" && (
                          <button
                            className="btn-primary-action"
                            onClick={() => setActiveVideoItem(item)}
                          >
                            <Play size={16} /> Watch Masterclass
                          </button>
                        )}

                        {item.type === "guide" && (
                          <button
                            className="btn-primary-action"
                            onClick={() => setActiveGuideItem(item)}
                          >
                            <BookOpen size={16} /> Read Full Guide
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* FLOATING AUDIO PLAYER (when audio is active) */}
      {activeAudioItem && (
        <div className="floating-audio-player">
          <audio
            ref={audioRef}
            src={activeAudioItem.audioSrc}
            onEnded={() => setIsPlayingAudio(false)}
            loop
          />
          <div className="audio-player-info">
            <div className="player-track-badge">
              <Headphones size={18} className="player-pulse" />
            </div>
            <div>
              <span className="player-track-title">{activeAudioItem.title}</span>
              <span className="player-track-sub">{activeAudioItem.instructor} ({activeAudioItem.duration})</span>
            </div>
          </div>

          <div className="audio-player-controls">
            <button
              className="player-play-btn"
              onClick={() => handlePlayAudio(activeAudioItem)}
              title={isPlayingAudio ? "Pause" : "Play"}
            >
              {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <button
              className="player-mute-btn"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !audioMuted;
                  setAudioMuted(!audioMuted);
                }
              }}
              title={audioMuted ? "Unmute" : "Mute"}
            >
              {audioMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <button
              className="player-close-btn"
              onClick={() => {
                audioRef.current?.pause();
                setIsPlayingAudio(false);
                setActiveAudioItem(null);
              }}
              title="Close Player"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: VIDEO MASTERCLASS EMBED */}
      {activeVideoItem && (
        <div className="resource-modal-overlay" onClick={() => setActiveVideoItem(null)}>
          <div className="resource-modal video-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-icon"
              onClick={() => setActiveVideoItem(null)}
              aria-label="Close Video"
            >
              <X size={20} />
            </button>

            <div className="video-player-container">
              <iframe
                title={activeVideoItem.title}
                src={`https://www.youtube.com/embed/${activeVideoItem.youtubeId}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="modal-video-iframe"
              />
            </div>

            <div className="video-modal-info">
              <div className="video-info-header">
                <span className="concern-tag-pill">{activeVideoItem.concern}</span>
                <span className="video-duration-tag">
                  <Clock size={13} /> {activeVideoItem.duration}
                </span>
              </div>

              <h3>{activeVideoItem.title}</h3>
              <p className="video-modal-desc">{activeVideoItem.description}</p>
              <p className="video-instructor">
                <strong>Instructor:</strong> {activeVideoItem.instructor}
              </p>

              {activeVideoItem.keyTakeaways && (
                <div className="takeaways-box">
                  <h4>Key Clinical Takeaways:</h4>
                  <ul>
                    {activeVideoItem.keyTakeaways.map((point, idx) => (
                      <li key={idx}>
                        <Check size={14} className="check-icon" /> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CLINICAL CBT READING GUIDE */}
      {activeGuideItem && (
        <div className="resource-modal-overlay" onClick={() => setActiveGuideItem(null)}>
          <div className="resource-modal guide-reader-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-icon"
              onClick={() => setActiveGuideItem(null)}
              aria-label="Close Guide"
            >
              <X size={20} />
            </button>

            <div className="guide-reader-header">
              <span className="concern-tag-pill">{activeGuideItem.concern}</span>
              <h2>{activeGuideItem.title}</h2>
              <div className="guide-reader-meta">
                <span>By {activeGuideItem.instructor}</span>
                <span>•</span>
                <span>
                  <Clock size={13} /> {activeGuideItem.duration}
                </span>
              </div>
            </div>

            <div className="guide-reader-body">
              <div className="guide-markdown-content">
                {activeGuideItem.content.split("\n\n").map((paragraph, index) => {
                  if (paragraph.startsWith("### ")) {
                    return <h3 key={index}>{paragraph.replace("### ", "")}</h3>;
                  }
                  if (paragraph.startsWith("- ")) {
                    const items = paragraph.split("\n- ");
                    return (
                      <ul key={index}>
                        {items.map((item, itemIdx) => (
                          <li key={itemIdx}>{item.replace("- ", "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (paragraph.startsWith("> ")) {
                    return (
                      <blockquote key={index}>
                        {paragraph.replace("> ", "")}
                      </blockquote>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>
            </div>

            <div className="guide-reader-footer">
              <button
                className={`btn-bookmark-guide ${savedResourceIds.includes(activeGuideItem.id) ? "active" : ""}`}
                onClick={() => toggleBookmark(activeGuideItem.id)}
              >
                {savedResourceIds.includes(activeGuideItem.id) ? (
                  <>
                    <BookmarkCheck size={16} /> Saved to Library
                  </>
                ) : (
                  <>
                    <Bookmark size={16} /> Save for Later
                  </>
                )}
              </button>

              <button
                className="btn-primary-done"
                onClick={() => setActiveGuideItem(null)}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INTERACTIVE GUIDED BREATHING TOOL (BOX BREATHING) */}
      {showBreathingWidget && (
        <div className="resource-modal-overlay" onClick={() => setShowBreathingWidget(false)}>
          <div className="resource-modal breathing-tool-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-icon"
              onClick={() => setShowBreathingWidget(false)}
              aria-label="Close Breathing Tool"
            >
              <X size={20} />
            </button>

            <div className="breathing-tool-header">
              <span className="breathing-badge">Somatic Vagus Nerve Regulation</span>
              <h3>Interactive Box Breathing (4-4-4-4)</h3>
              <p>Sync your breathing with the expanding circle to reset high autonomic arousal.</p>
            </div>

            <div className="breathing-visual-stage">
              <div className={`breathing-circle-outer phase-${breathingPhase.toLowerCase()}`}>
                <div className="breathing-circle-inner">
                  <span className="breathing-phase-label">{breathingPhase}</span>
                  <span className="breathing-countdown">{breathingCounter}</span>
                </div>
              </div>
            </div>

            <div className="breathing-instructions">
              <p>
                {breathingPhase === "Inhale" && "Gently inhale through your nose, filling the lower diaphragm..."}
                {breathingPhase === "Hold" && "Gently hold the air in your lungs without tension..."}
                {breathingPhase === "Exhale" && "Slowly release the breath through slightly parted lips..."}
                {breathingPhase === "Rest" && "Stay relaxed and empty before the next breath begins..."}
              </p>
              <div className="cycles-pill">
                Completed Cycles: <strong>{breathingCycles}</strong>
              </div>
            </div>

            <div className="breathing-tool-footer">
              <button
                className="btn-primary-done"
                onClick={() => setShowBreathingWidget(false)}
              >
                Done Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER PROFILE MODAL */}
      {showProfileModal && (
        <Profile onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
}
