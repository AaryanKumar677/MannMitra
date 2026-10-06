// Booking.jsx - Redesigned Mental Health & Specialist Booking System
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import Profile from "../../../pages/Profile";
import {
  Search,
  Calendar,
  Clock,
  Video,
  Phone,
  Star,
  ShieldCheck,
  CheckCircle2,
  X,
  ChevronRight,
  Award,
  Globe,
  Check,
  ArrowRight,
  Trash2,
  CalendarCheck,
  Stethoscope,
  User,
  AlertCircle,
  Copy,
  LogOut
} from "lucide-react";
import "./Booking.css";

const specialistsData = [
  {
    id: "doc-1",
    name: "Dr. Arvind Sametha",
    role: "Senior Consultant Psychiatrist",
    category: "doctors",
    degree: "MBBS, MD (Psychiatry - AIIMS New Delhi)",
    experience: "10+ Yrs Exp",
    rating: 4.9,
    reviewsCount: 168,
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Punjabi"],
    specialties: ["Clinical Depression", "Anxiety & Panic", "Bipolar Disorder", "ADHD"],
    concernTags: ["Anxiety & Panic", "Depression & Low Mood", "ADHD & Focus"],
    bio: "Chief Psychiatrist with over a decade of clinical practice at apex institutes. Specializes in evidence-based medical management of mood disorders, panic conditions, and adolescent neuro-psychiatry.",
    education: "MD from AIIMS New Delhi; Fellow of Indian Psychiatric Society (FIPS)",
    nextSlot: "Today at 04:30 PM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.9/5", punctuality: "4.8/5", expertise: "5.0/5" },
    testimonial: {
      text: "Dr. Arvind was immensely patient, non-judgmental, and explained the neurochemical balance clearly. Highly recommended.",
      author: "Rahul S., Delhi"
    }
  },
  {
    id: "doc-2",
    name: "Dr. Riya Verma",
    role: "Neuro-Psychiatrist & Cognitive Specialist",
    category: "doctors",
    degree: "MD, DM (Cognitive Neurology - NIMHANS)",
    experience: "8+ Yrs Exp",
    rating: 4.8,
    reviewsCount: 142,
    avatar: "https://images.unsplash.com/photo-1594824813501-48e025816987?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi"],
    specialties: ["Cognitive Wellness", "Chronic Migraine", "Brain Fog", "Neuro-Rehabilitation"],
    concernTags: ["Stress & Burnout", "Sleep & Mindfulness"],
    bio: "Pioneering neurologist focusing on the intersection of brain physiology, cognitive stamina, and emotional burnout. Helps high-performance individuals overcome brain fog and neurological stress.",
    education: "DM in Cognitive Neurology, NIMHANS Bangalore; Gold Medalist",
    nextSlot: "Tomorrow at 11:00 AM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.8/5", punctuality: "5.0/5", expertise: "4.9/5" },
    testimonial: {
      text: "Helped me understand my chronic fatigue and cognitive burnout when no one else could pinpoint the issue.",
      author: "Pooja K., Bengaluru"
    }
  },
  {
    id: "doc-3",
    name: "Dr. Kabir Singh",
    role: "Chief Clinical Psychologist",
    category: "doctors",
    degree: "Ph.D., M.Phil in Clinical Psychology (CIP)",
    experience: "12+ Yrs Exp",
    rating: 4.9,
    reviewsCount: 210,
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Urdu"],
    specialties: ["Trauma & PTSD", "Emotional Regulation", "Crisis Intervention", "Resilience Building"],
    concernTags: ["Anxiety & Panic", "Depression & Low Mood", "Stress & Burnout"],
    bio: "Renowned clinical psychologist specializing in trauma therapy, emotional resilience, and deep psychological assessments. Passionate about destigmatizing mental health in Indian youth.",
    education: "Ph.D. Central Institute of Psychiatry; Member of British Psychological Society",
    nextSlot: "Today at 06:00 PM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "5.0/5", punctuality: "4.9/5", expertise: "4.9/5" },
    testimonial: {
      text: "Transformative sessions. He gave me concrete mental frameworks to manage panic triggers without feeling overwhelmed.",
      author: "Aakash M., Mumbai"
    }
  },
  {
    id: "doc-4",
    name: "Dr. Nisha Patel",
    role: "Relationship & Psychosocial Counselor",
    category: "doctors",
    degree: "M.Sc. Counseling Psychology, Gottman Certified",
    experience: "6+ Yrs Exp",
    rating: 4.7,
    reviewsCount: 95,
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Gujarati"],
    specialties: ["Couples & Relationships", "Family Dynamics", "Personal Growth", "Self-Esteem"],
    concernTags: ["Relationships", "Stress & Burnout"],
    bio: "Empathetic counselor focusing on healthy interpersonal boundaries, conflict de-escalation, and personal identity. Creator of popular self-acceptance and emotional well-being workshops.",
    education: "M.Sc. Counseling Psychology (TISS Mumbai); Certified Gottman Method Level 2",
    nextSlot: "Tomorrow at 02:00 PM",
    isOnline: false,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.9/5", punctuality: "4.7/5", expertise: "4.6/5" },
    testimonial: {
      text: "Dr. Nisha helped my partner and me communicate without anger for the first time in years.",
      author: "Sneha & Varun, Pune"
    }
  },
  {
    id: "doc-5",
    name: "Dr. Ishan Rao",
    role: "Adolescent & Young Adult Psychiatrist",
    category: "doctors",
    degree: "MD (Psychiatry), Child & Adolescent Fellow",
    experience: "7+ Yrs Exp",
    rating: 4.8,
    reviewsCount: 88,
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Kannada"],
    specialties: ["Teen Mental Health", "Academic Burnout", "ADHD in Youth", "Social Anxiety"],
    concernTags: ["ADHD & Focus", "Anxiety & Panic", "Stress & Burnout"],
    bio: "Passionate advocate for students and young adults navigating career pressure, peer expectations, exam phobias, and neurodivergent thinking.",
    education: "MD Psychiatry (KMC Manipal); Fellowship in Child & Adolescent Mental Health",
    nextSlot: "Today at 07:15 PM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.8/5", punctuality: "4.8/5", expertise: "4.8/5" },
    testimonial: {
      text: "Understood my college exam pressure without giving generic 'just study harder' advice. Truly listens.",
      author: "Dhruv T., Hyderabad"
    }
  },
  {
    id: "therapist-1",
    name: "Anika Mehta",
    role: "Senior Cognitive Behavioral Therapist (CBT)",
    category: "therapists",
    degree: "M.Phil Psychology (Beck Institute CBT Fellow)",
    experience: "7+ Yrs Exp",
    rating: 4.9,
    reviewsCount: 185,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi"],
    specialties: ["CBT Restructuring", "Overthinking Loops", "Social Anxiety", "Self-Criticism"],
    concernTags: ["Anxiety & Panic", "Depression & Low Mood", "Stress & Burnout"],
    bio: "Certified CBT practitioner dedicated to helping individuals identify and untangle cognitive distortions, catastrophic thinking, and imposter syndrome.",
    education: "Beck Institute for Cognitive Behavior Therapy Certified; M.Phil Delhi University",
    nextSlot: "Today at 05:00 PM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.9/5", punctuality: "4.9/5", expertise: "5.0/5" },
    testimonial: {
      text: "Her thought journaling method completely transformed my daily panic attacks within 4 weeks.",
      author: "Megha R., Gurgaon"
    }
  },
  {
    id: "therapist-2",
    name: "Raj Malhotra",
    role: "Behavioral & Habit Modification Coach",
    category: "therapists",
    degree: "M.Sc. Applied Psychology (DBT Certified)",
    experience: "9+ Yrs Exp",
    rating: 4.7,
    reviewsCount: 120,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Marathi"],
    specialties: ["Habit Building", "Addictive Behaviors", "Emotional Regulation", "Anger Management"],
    concernTags: ["Stress & Burnout", "Relationships"],
    bio: "Specializes in Dialectical Behavior Therapy (DBT) and neuroplastic habit formation. Works with people seeking radical behavioral change and emotional poise.",
    education: "M.Sc Applied Psychology (Pune University); Certified DBT Specialist",
    nextSlot: "Tomorrow at 10:00 AM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.7/5", punctuality: "4.8/5", expertise: "4.7/5" },
    testimonial: {
      text: "Action-oriented and practical. Didn't just talk in circles—gave me real systems to break unhealthy habits.",
      author: "Karan D., Mumbai"
    }
  },
  {
    id: "therapist-3",
    name: "Meera Joshi",
    role: "Mindfulness & Somatic Wellness Guide",
    category: "therapists",
    degree: "Certified MBSR Instructor, Somatic Experiencing",
    experience: "8+ Yrs Exp",
    rating: 4.8,
    reviewsCount: 154,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi"],
    specialties: ["Mindfulness-Based Stress Reduction", "Breathwork", "Insomnia / Sleep Hygiene", "Vagus Nerve Healing"],
    concernTags: ["Sleep & Mindfulness", "Stress & Burnout"],
    bio: "Holistic mental health practitioner blending modern neuroscience with Eastern mindfulness traditions. Helps calm hyperactive nervous systems and restore peaceful sleep.",
    education: "Certified MBSR by Brown Mindfulness Center; Somatic Healing Practitioner",
    nextSlot: "Today at 03:30 PM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.9/5", punctuality: "4.7/5", expertise: "4.9/5" },
    testimonial: {
      text: "The breathwork and somatic tracking exercises finally cured my chronic sleep anxiety. Incredible guide.",
      author: "Aditi S., Bangalore"
    }
  },
  {
    id: "therapist-4",
    name: "Aman Singh",
    role: "Corporate Burnout & Performance Psychologist",
    category: "therapists",
    degree: "M.A. Counseling Psychology (I/O Psychology Certified)",
    experience: "6+ Yrs Exp",
    rating: 4.8,
    reviewsCount: 112,
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Punjabi"],
    specialties: ["Work-Life Friction", "Executive Burnout", "Career Transitions", "High-Stress Performance"],
    concernTags: ["Stress & Burnout", "Anxiety & Panic"],
    bio: "Specializes in supporting engineers, founders, and corporate professionals dealing with excessive hustle culture, perfectionism, and career fatigue.",
    education: "MA Counseling Psychology; Certified Executive Mental Health Coach",
    nextSlot: "Tomorrow at 04:00 PM",
    isOnline: true,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "4.8/5", punctuality: "4.9/5", expertise: "4.8/5" },
    testimonial: {
      text: "Aman understands corporate tech pressure inside out. He helped me set boundaries without feeling guilty.",
      author: "Vivek N., Noida"
    }
  },
  {
    id: "therapist-5",
    name: "Priya Kapoor",
    role: "Expressive Arts & Trauma Recovery Therapist",
    category: "therapists",
    degree: "MA Expressive Arts Therapy, Trauma-Informed Coach",
    experience: "7+ Yrs Exp",
    rating: 4.9,
    reviewsCount: 136,
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
    languages: ["English", "Hindi", "Bengali"],
    specialties: ["Expressive Arts", "Inner Child Healing", "Grief & Loss", "Non-Verbal Emotional Release"],
    concernTags: ["Depression & Low Mood", "Anxiety & Panic", "Relationships"],
    bio: "Uses creative expression, narrative framing, and art metaphors to help clients process grief, subconscious blockages, and complex trauma when words alone aren't enough.",
    education: "Master of Expressive Arts Therapy (Lesley University affiliate); Certified Trauma Practitioner",
    nextSlot: "Today at 08:00 PM",
    isOnline: false,
    fee: "Free with MannMitra Partner Access",
    sessionModes: ["Video", "Audio"],
    ratingBreakdown: { empathy: "5.0/5", punctuality: "4.8/5", expertise: "4.9/5" },
    testimonial: {
      text: "Art therapy helped me unlock emotions I had suppressed for a decade. Priya provides such a warm, gentle presence.",
      author: "Ritu B., Kolkata"
    }
  }
];

const concernCategories = [
  "All Concerns",
  "Anxiety & Panic",
  "Depression & Low Mood",
  "Stress & Burnout",
  "Relationships",
  "ADHD & Focus",
  "Sleep & Mindfulness"
];

const timeSlots = [
  { label: "Morning", slots: ["09:30 AM", "10:30 AM", "11:45 AM"] },
  { label: "Afternoon", slots: ["02:00 PM", "03:15 PM", "04:30 PM"] },
  { label: "Evening", slots: ["06:00 PM", "07:15 PM", "08:30 PM"] }
];

export default function Booking({ user: propUser }) {
  const authContext = useAuth();
  const authUser = authContext?.user || propUser;
  const profile = authContext?.profile;
  const signOut = authContext?.signOut;

  // Theme toggle state
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

  // Active view: 'directory' or 'my-appointments'
  const [activeTab, setActiveTab] = useState("directory");

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedConcern, setSelectedConcern] = useState("All Concerns");

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewPerson, setViewPerson] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sessionMode, setSessionMode] = useState("Video");
  const [sessionDuration, setSessionDuration] = useState("45 Min");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [selectedTime, setSelectedTime] = useState("11:45 AM");
  const [patientConcern, setPatientConcern] = useState("Anxiety & Panic");
  const [notes, setNotes] = useState("");

  // Confirmed booking state
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  // Persistent appointments
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem("mannmitra_appointments");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Pre-fill user details when available
  useEffect(() => {
    if (profile) {
      if (profile.first_name || profile.firstName) setFirstName(profile.first_name || profile.firstName);
      if (profile.last_name || profile.lastName) setLastName(profile.last_name || profile.lastName);
      if (profile.age) setAge(String(profile.age));
      if (profile.email) setEmail(profile.email);
      if (profile.phone_number || profile.mobile) setPhone(profile.phone_number || profile.mobile);
    } else if (authUser) {
      if (authUser.displayName) {
        const parts = authUser.displayName.split(" ");
        setFirstName(parts[0] || "");
        setLastName(parts.slice(1).join(" ") || "");
      }
      if (authUser.email) setEmail(authUser.email);
    }
  }, [profile, authUser]);

  // Sync appointments with localStorage
  useEffect(() => {
    try {
      localStorage.setItem("mannmitra_appointments", JSON.stringify(appointments));
    } catch (err) {
      console.error("Failed to save appointments:", err);
    }
  }, [appointments]);

  // Filter specialists
  const filteredSpecialists = useMemo(() => {
    return specialistsData.filter((spec) => {
      if (selectedCategory !== "all" && spec.category !== selectedCategory) {
        return false;
      }
      if (
        selectedConcern !== "All Concerns" &&
        !spec.concernTags.includes(selectedConcern) &&
        !spec.specialties.some((s) => s.toLowerCase().includes(selectedConcern.toLowerCase()))
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = spec.name.toLowerCase().includes(q);
        const matchesRole = spec.role.toLowerCase().includes(q);
        const matchesDegree = spec.degree.toLowerCase().includes(q);
        const matchesSpecialty = spec.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesBio = spec.bio.toLowerCase().includes(q);
        if (!matchesName && !matchesRole && !matchesDegree && !matchesSpecialty && !matchesBio) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedConcern, searchQuery]);

  const handleOpenBooking = (person) => {
    setSelectedPerson(person);
    setBookingConfirmed(null);
    setBookingModalOpen(true);
    if (person.specialties?.[0]) {
      setPatientConcern(person.specialties[0]);
    }
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedPerson(null);
    setBookingConfirmed(null);
  };

  const handleOpenView = (person) => {
    setViewPerson(person);
    setViewModalOpen(true);
  };

  const handleCloseView = () => {
    setViewModalOpen(false);
    setViewPerson(null);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!firstName.trim() || !age) {
      alert("Please enter your name and age to proceed.");
      return;
    }

    const bookingId = "MM-" + Math.floor(10000 + Math.random() * 90000);
    const meetingCode = "mannmitra-" + Math.random().toString(36).substring(2, 9);
    const meetingUrl = `https://meet.jit.si/${meetingCode}`;

    const newAppointment = {
      id: bookingId,
      specialistId: selectedPerson.id,
      specialistName: selectedPerson.name,
      specialistRole: selectedPerson.role,
      specialistDegree: selectedPerson.degree,
      specialistAvatar: selectedPerson.avatar,
      patientName: `${firstName} ${lastName}`.trim(),
      patientAge: age,
      patientEmail: email,
      patientPhone: phone,
      mode: sessionMode,
      duration: sessionDuration,
      date: selectedDate,
      time: selectedTime,
      concern: patientConcern,
      notes: notes,
      meetingUrl: meetingUrl,
      status: "Confirmed",
      bookedAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setBookingConfirmed(newAppointment);
  };

  const handleCancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const copyMeetLink = (url) => {
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  const generateGoogleCalendarLink = (appt) => {
    const title = encodeURIComponent(`MannMitra Session with ${appt.specialistName}`);
    const details = encodeURIComponent(
      `Confidential Session with ${appt.specialistName} (${appt.specialistRole}).\nMeeting Link: ${appt.meetingUrl}\nPatient: ${appt.patientName}\nConcern: ${appt.concern}`
    );
    const location = encodeURIComponent(appt.meetingUrl);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const upcomingAppointment = appointments[0] || null;

  return (
    <div className="booking-page">
      {/* Background Ambient Glows */}
      <div className="booking-ambient-glow booking-glow-1" />
      <div className="booking-ambient-glow booking-glow-2" />

      {/* TOP HEADER BAR: Theme Toggle on Left, Profile Icon on Right */}
      <div className="booking-topbar">
        {/* Left: Theme toggle button */}
        <button
          className="booking-theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle Theme"
        >
          <span className="toggle-symbol">{isDarkMode ? "☀️" : "🌙"}</span>
        </button>

        {/* Center: Clinic Portal Tag */}
        <div className="booking-top-center-brand">
          <Stethoscope size={15} className="brand-steth-icon" />
          <span>MannMitra Clinical Services</span>
        </div>

        {/* Right: Profile Icon & Dropdown */}
        <div className="booking-profile-wrapper" ref={profileDropdownRef}>
          <button
            className="booking-profile-trigger"
            onClick={() => setShowProfileDropdown((prev) => !prev)}
            title="Account Profile"
            aria-label="Account Profile"
          >
            {profile?.photo_url || authUser?.photoURL ? (
              <img
                src={profile?.photo_url || authUser?.photoURL}
                alt="User profile"
                className="booking-profile-avatar"
              />
            ) : (
              <div className="booking-profile-avatar-fallback">
                <User size={18} />
              </div>
            )}
          </button>

          {showProfileDropdown && (
            <div className="booking-profile-menu">
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
      <div className="booking-container">
        {/* Top Hero Section - Professional, authentic human medical tone */}
        <header className="booking-hero">
          <div className="booking-badge">
            <Stethoscope size={14} className="badge-icon" />
            <span>MannMitra Health • Certified Clinical Practice</span>
          </div>

          <h1 className="hero-title">
            Consult with Licensed Psychiatrists & Clinical Psychologists
          </h1>

          <p className="hero-subtitle">
            Book private, one-on-one appointments for clinical diagnosis, therapy, and psychiatric guidance.
            Sessions are completely confidential and conducted through secure video or audio calls.
          </p>

          {/* Trust Value Badges */}
          <div className="hero-trust-bar">
            <div className="trust-item">
              <ShieldCheck size={17} className="trust-icon" />
              <span>100% Private & Confidential</span>
            </div>
            <div className="trust-item">
              <Award size={17} className="trust-icon" />
              <span>Verified Degrees (AIIMS, NIMHANS, CIP)</span>
            </div>
            <div className="trust-item">
              <Clock size={17} className="trust-icon" />
              <span>Flexible 30 & 50-Min Slots</span>
            </div>
            <div className="trust-item">
              <Video size={17} className="trust-icon" />
              <span>Encrypted Video & Audio Calls</span>
            </div>
          </div>
        </header>

        {/* Active Upcoming Appointment Banner (if any) */}
        {upcomingAppointment && (
          <div className="active-appt-banner">
            <div className="active-appt-pulse-dot" />
            <div className="active-appt-info">
              <span className="active-appt-label">UPCOMING SCHEDULED SESSION</span>
              <h4 className="active-appt-title">
                Session with {upcomingAppointment.specialistName}
              </h4>
              <p className="active-appt-meta">
                <Calendar size={14} /> {upcomingAppointment.date} &nbsp;•&nbsp;
                <Clock size={14} /> {upcomingAppointment.time} &nbsp;•&nbsp;
                <Video size={14} /> {upcomingAppointment.mode}
              </p>
            </div>
            <div className="active-appt-actions">
              <a
                href={upcomingAppointment.meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-join-call"
              >
                <Video size={16} /> Join Video Room
              </a>
              <button
                className="btn-banner-link"
                onClick={() => setActiveTab("my-appointments")}
              >
                View Details
              </button>
            </div>
          </div>
        )}

        {/* View Switcher Tabs (Browse vs My Appointments) */}
        <div className="booking-nav-row">
          <div className="booking-nav-tabs">
            <button
              className={`nav-tab-btn ${activeTab === "directory" ? "active" : ""}`}
              onClick={() => setActiveTab("directory")}
            >
              <Stethoscope size={16} /> Browse Specialists
              <span className="tab-counter">{specialistsData.length}</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === "my-appointments" ? "active" : ""}`}
              onClick={() => setActiveTab("my-appointments")}
            >
              <CalendarCheck size={16} /> My Scheduled Sessions
              {appointments.length > 0 && (
                <span className="tab-counter alert-counter">{appointments.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: BROWSE SPECIALISTS DIRECTORY */}
        {activeTab === "directory" && (
          <>
            {/* Filter and Search Suite */}
            <div className="booking-filters-card">
              <div className="search-and-categories">
                {/* Search Box */}
                <div className="booking-search-box">
                  <Search size={18} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search by doctor name, specialty, concern, or qualification..."
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

                {/* Category Pills */}
                <div className="category-pills">
                  <button
                    className={`cat-pill ${selectedCategory === "all" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("all")}
                  >
                    All Specialists
                  </button>
                  <button
                    className={`cat-pill ${selectedCategory === "doctors" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("doctors")}
                  >
                    Psychiatrists & MDs
                  </button>
                  <button
                    className={`cat-pill ${selectedCategory === "therapists" ? "active" : ""}`}
                    onClick={() => setSelectedCategory("therapists")}
                  >
                    Therapists & Psychologists
                  </button>
                </div>
              </div>

              {/* Concern Topic Chips */}
              <div className="concern-chips-row">
                <span className="chips-label">Quick Concerns:</span>
                <div className="chips-scroll">
                  {concernCategories.map((concern) => (
                    <button
                      key={concern}
                      className={`concern-chip ${selectedConcern === concern ? "active" : ""}`}
                      onClick={() => setSelectedConcern(concern)}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Counter & Active Filter Indicators */}
            <div className="results-header">
              <span className="results-count">
                Showing <strong>{filteredSpecialists.length}</strong> available specialists
              </span>
              {(searchQuery || selectedCategory !== "all" || selectedConcern !== "All Concerns") && (
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedConcern("All Concerns");
                  }}
                >
                  Reset all filters
                </button>
              )}
            </div>

            {/* Empty State */}
            {filteredSpecialists.length === 0 && (
              <div className="empty-specialists-state">
                <AlertCircle size={44} className="empty-icon" />
                <h3>No specialists found matching your search</h3>
                <p>Try adjusting your search query, or clear filters to view all available experts.</p>
                <button
                  className="btn-primary-gradient"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedConcern("All Concerns");
                  }}
                >
                  Show All Specialists
                </button>
              </div>
            )}

            {/* Specialists Grid */}
            <div className="specialists-grid">
              {filteredSpecialists.map((specialist) => (
                <div key={specialist.id} className="specialist-card">
                  {/* Card Header & Avatar */}
                  <div className="card-top">
                    <div className="avatar-wrapper">
                      <img
                        src={specialist.avatar}
                        alt={specialist.name}
                        className="specialist-img"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="avatar-fallback" style={{ display: "none" }}>
                        {specialist.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      {specialist.isOnline && (
                        <span className="online-indicator" title="Available for immediate booking" />
                      )}
                    </div>

                    <div className="card-primary-info">
                      <div className="name-row">
                        <h3 className="specialist-name">{specialist.name}</h3>
                        <ShieldCheck size={18} className="verified-shield" title="Verified Specialist" />
                      </div>
                      <p className="specialist-role">{specialist.role}</p>
                      <p className="specialist-degree">{specialist.degree}</p>

                      <div className="specialist-meta-strip">
                        <span className="rating-pill">
                          <Star size={13} className="star-filled" /> {specialist.rating}
                          <span className="reviews-sub">({specialist.reviewsCount})</span>
                        </span>
                        <span className="meta-pill">{specialist.experience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Languages & Next Slot */}
                  <div className="card-mid-info">
                    <div className="info-row">
                      <Globe size={14} className="info-icon" />
                      <span>{specialist.languages.join(", ")}</span>
                    </div>
                    <div className="info-row slot-row">
                      <Clock size={14} className="info-icon" />
                      <span className="slot-text">Next: <strong>{specialist.nextSlot}</strong></span>
                    </div>
                  </div>

                  {/* Specialties Pills */}
                  <div className="specialties-pills">
                    {specialist.specialties.slice(0, 3).map((tag) => (
                      <span key={tag} className="spec-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Short Bio */}
                  <p className="specialist-bio-snippet">{specialist.bio}</p>

                  {/* Card Bottom CTA Bar */}
                  <div className="card-footer-cta">
                    <div className="fee-badge">
                      <span className="fee-label">Consultation</span>
                      <span className="fee-val">{specialist.fee}</span>
                    </div>

                    <div className="card-action-btns">
                      <button
                        className="btn-view-profile"
                        onClick={() => handleOpenView(specialist)}
                      >
                        Profile
                      </button>
                      <button
                        className="btn-book-now"
                        onClick={() => handleOpenBooking(specialist)}
                      >
                        Book Slot <ChevronRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB 2: MY SCHEDULED SESSIONS */}
        {activeTab === "my-appointments" && (
          <div className="my-appointments-section">
            <div className="appointments-header">
              <div>
                <h2>Your Scheduled Sessions</h2>
                <p>Manage, join, or reschedule your confidential 1-on-1 consultations.</p>
              </div>
              <button
                className="btn-outline"
                onClick={() => setActiveTab("directory")}
              >
                + Book Another Session
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="empty-appointments-box">
                <CalendarCheck size={48} className="empty-icon" />
                <h3>No scheduled sessions yet</h3>
                <p>
                  You haven't booked any consultations yet. Find a licensed psychiatrist
                  or therapist from our verified network.
                </p>
                <button
                  className="btn-primary-gradient"
                  onClick={() => setActiveTab("directory")}
                >
                  Browse Specialists
                </button>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map((appt) => (
                  <div key={appt.id} className="appointment-card">
                    <div className="appt-card-header">
                      <div className="appt-doctor">
                        <img
                          src={appt.specialistAvatar}
                          alt={appt.specialistName}
                          className="appt-avatar"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div>
                          <h4>{appt.specialistName}</h4>
                          <p className="appt-doctor-role">{appt.specialistRole}</p>
                          <span className="appt-id-tag">Booking Ref: #{appt.id}</span>
                        </div>
                      </div>

                      <div className="appt-status-badge">
                        <CheckCircle2 size={15} /> {appt.status}
                      </div>
                    </div>

                    <div className="appt-details-grid">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <div>
                          <span className="detail-label">Date</span>
                          <span className="detail-value">{appt.date}</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <Clock size={16} />
                        <div>
                          <span className="detail-label">Time & Duration</span>
                          <span className="detail-value">
                            {appt.time} ({appt.duration})
                          </span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <Video size={16} />
                        <div>
                          <span className="detail-label">Session Mode</span>
                          <span className="detail-value">{appt.mode} Consultation</span>
                        </div>
                      </div>

                      <div className="detail-item">
                        <User size={16} />
                        <div>
                          <span className="detail-label">Patient</span>
                          <span className="detail-value">
                            {appt.patientName} (Age: {appt.patientAge})
                          </span>
                        </div>
                      </div>
                    </div>

                    {appt.concern && (
                      <div className="appt-concern-row">
                        <span className="concern-title">Primary Focus:</span>
                        <span className="concern-pill">{appt.concern}</span>
                      </div>
                    )}

                    <div className="appt-actions-bar">
                      <div className="left-actions">
                        <a
                          href={appt.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-join-room"
                        >
                          <Video size={16} /> Join Consultation Room
                        </a>
                        <button
                          className="btn-copy-meet"
                          onClick={() => copyMeetLink(appt.meetingUrl)}
                        >
                          <Copy size={15} /> {copiedLink ? "Copied!" : "Copy Link"}
                        </button>
                        <a
                          href={generateGoogleCalendarLink(appt)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-add-cal"
                        >
                          <Calendar size={15} /> Add to Calendar
                        </a>
                      </div>

                      <button
                        className="btn-cancel-appt"
                        onClick={() => handleCancelAppointment(appt.id)}
                        title="Cancel this session"
                      >
                        <Trash2 size={16} /> Cancel Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: VIEW SPECIALIST PROFILE DETAILS */}
      {viewModalOpen && viewPerson && (
        <div className="booking-modal-overlay" onClick={handleCloseView}>
          <div
            className="booking-modal view-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              onClick={handleCloseView}
              aria-label="Close Profile"
            >
              <X size={20} />
            </button>

            {/* Profile Header Backdrop */}
            <div className="view-modal-hero">
              <img
                src={viewPerson.avatar}
                alt={viewPerson.name}
                className="view-modal-avatar"
              />
              <div className="view-modal-hero-info">
                <div className="view-name-row">
                  <h3>{viewPerson.name}</h3>
                  <ShieldCheck size={20} className="verified-shield" />
                </div>
                <p className="view-role">{viewPerson.role}</p>
                <p className="view-degree">{viewPerson.degree}</p>

                <div className="view-stats-row">
                  <span className="stat-badge">
                    <Star size={13} className="star-filled" /> {viewPerson.rating} Rating
                  </span>
                  <span className="stat-badge">
                    <Award size={13} /> {viewPerson.experience}
                  </span>
                  <span className="stat-badge">
                    <Globe size={13} /> {viewPerson.languages.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="view-modal-body">
              {/* About Bio */}
              <div className="view-section">
                <h4>Clinical Overview & Philosophy</h4>
                <p className="view-bio-text">{viewPerson.bio}</p>
              </div>

              {/* Education & Accreditation */}
              <div className="view-section">
                <h4>Education & Accreditations</h4>
                <div className="view-edu-box">
                  <Award size={18} className="edu-icon" />
                  <div>
                    <strong>{viewPerson.education}</strong>
                    <p className="muted-text">Verified by MannMitra Clinical Quality Board</p>
                  </div>
                </div>
              </div>

              {/* Areas of Expertise */}
              <div className="view-section">
                <h4>Areas of Clinical Specialization</h4>
                <div className="specialties-pills">
                  {viewPerson.specialties.map((spec) => (
                    <span key={spec} className="spec-tag active">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verified Patient Feedback */}
              {viewPerson.testimonial && (
                <div className="view-section">
                  <h4>Patient Experience</h4>
                  <div className="view-testimonial-card">
                    <p className="quote">"{viewPerson.testimonial.text}"</p>
                    <span className="author">— {viewPerson.testimonial.author}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom CTA */}
            <div className="view-modal-footer">
              <div className="footer-fee">
                <span className="label">Covered Fee</span>
                <span className="val">{viewPerson.fee}</span>
              </div>
              <button
                className="btn-primary-gradient modal-cta"
                onClick={() => {
                  handleCloseView();
                  handleOpenBooking(viewPerson);
                }}
              >
                Proceed to Book Session <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: INTERACTIVE BOOKING MODAL & CONFIRMATION */}
      {bookingModalOpen && selectedPerson && (
        <div className="booking-modal-overlay" onClick={handleCloseBooking}>
          <div
            className="booking-modal booking-form-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close-icon"
              onClick={handleCloseBooking}
              aria-label="Close Modal"
            >
              <X size={20} />
            </button>

            {/* If Already Confirmed, Show Success Screen */}
            {bookingConfirmed ? (
              <div className="booking-success-view">
                <div className="success-icon-badge">
                  <CheckCircle2 size={44} />
                </div>
                <h3>Your Session is Confirmed!</h3>
                <p className="success-sub">
                  A calendar invite and consultation link have been generated for you.
                </p>

                <div className="confirmed-summary-card">
                  <div className="summary-row">
                    <span className="summary-label">Specialist:</span>
                    <span className="summary-value">
                      {bookingConfirmed.specialistName} ({bookingConfirmed.specialistRole})
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Date & Time:</span>
                    <span className="summary-value highlight">
                      {bookingConfirmed.date} @ {bookingConfirmed.time}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Session Mode:</span>
                    <span className="summary-value">
                      {bookingConfirmed.mode} Call ({bookingConfirmed.duration})
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Patient Name:</span>
                    <span className="summary-value">{bookingConfirmed.patientName}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Booking ID:</span>
                    <span className="summary-value code">#{bookingConfirmed.id}</span>
                  </div>
                </div>

                <div className="success-meeting-box">
                  <div className="link-info">
                    <span className="meet-label">Direct Video Consultation Room</span>
                    <span className="meet-url">{bookingConfirmed.meetingUrl}</span>
                  </div>
                  <div className="meet-actions">
                    <button
                      className="btn-outline-sm"
                      onClick={() => copyMeetLink(bookingConfirmed.meetingUrl)}
                    >
                      <Copy size={14} /> {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                    <a
                      href={bookingConfirmed.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary-gradient-sm"
                    >
                      <Video size={14} /> Join Now
                    </a>
                  </div>
                </div>

                <div className="success-footer-actions">
                  <a
                    href={generateGoogleCalendarLink(bookingConfirmed)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-cal-link"
                  >
                    <Calendar size={15} /> Add to Google Calendar
                  </a>
                  <button
                    className="btn-primary-gradient"
                    onClick={() => {
                      handleCloseBooking();
                      setActiveTab("my-appointments");
                    }}
                  >
                    View in My Appointments
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleConfirmBooking} className="booking-stepper-form">
                {/* Doctor Quick Summary */}
                <div className="booking-modal-header">
                  <img
                    src={selectedPerson.avatar}
                    alt={selectedPerson.name}
                    className="form-doctor-avatar"
                  />
                  <div>
                    <h4>Book with {selectedPerson.name}</h4>
                    <p className="form-doctor-role">{selectedPerson.role}</p>
                    <span className="form-doctor-fee">{selectedPerson.fee}</span>
                  </div>
                </div>

                <div className="form-scrollable-body">
                  {/* Step 1: Session Mode & Duration */}
                  <div className="form-group-block">
                    <label className="group-label">1. Select Consultation Format</label>
                    <div className="mode-toggle-grid">
                      <button
                        type="button"
                        className={`mode-btn ${sessionMode === "Video" ? "active" : ""}`}
                        onClick={() => setSessionMode("Video")}
                      >
                        <Video size={18} />
                        <div>
                          <strong>HD Video Session</strong>
                          <span>1-on-1 private video room</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`mode-btn ${sessionMode === "Audio" ? "active" : ""}`}
                        onClick={() => setSessionMode("Audio")}
                      >
                        <Phone size={18} />
                        <div>
                          <strong>Private Voice Call</strong>
                          <span>Audio-only confidential session</span>
                        </div>
                      </button>
                    </div>

                    <div className="duration-selector">
                      <span className="sub-label">Duration:</span>
                      {["30 Min", "45 Min", "60 Min"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          className={`duration-pill ${sessionDuration === d ? "active" : ""}`}
                          onClick={() => setSessionDuration(d)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Date & Time Slot */}
                  <div className="form-group-block">
                    <label className="group-label">2. Choose Consultation Date & Time</label>
                    <div className="date-selection-row">
                      <div className="field-date-input">
                        <Calendar size={16} className="field-icon" />
                        <input
                          type="date"
                          value={selectedDate}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="slots-container">
                      {timeSlots.map((group) => (
                        <div key={group.label} className="slot-group">
                          <span className="slot-group-title">{group.label}</span>
                          <div className="slot-chips">
                            {group.slots.map((s) => (
                              <button
                                key={s}
                                type="button"
                                className={`slot-chip ${selectedTime === s ? "active" : ""}`}
                                onClick={() => setSelectedTime(s)}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 3: Patient Details */}
                  <div className="form-group-block">
                    <label className="group-label">3. Patient Information</label>
                    <div className="fields-2col">
                      <div className="form-field">
                        <span>First Name *</span>
                        <input
                          type="text"
                          placeholder="Your First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <span>Last Name</span>
                        <input
                          type="text"
                          placeholder="Your Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="fields-2col">
                      <div className="form-field">
                        <span>Age *</span>
                        <input
                          type="number"
                          placeholder="Age (e.g. 24)"
                          value={age}
                          min="12"
                          max="110"
                          onChange={(e) => setAge(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-field">
                        <span>Contact Number / Email</span>
                        <input
                          type="text"
                          placeholder="Phone or Email for updates"
                          value={phone || email}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Primary Concern Selection */}
                    <div className="form-field">
                      <span>Primary Concern or Reason for Consultation</span>
                      <div className="patient-concern-chips">
                        {[
                          "Anxiety & Panic",
                          "Depression & Low Mood",
                          "Stress & Burnout",
                          "Relationship Conflict",
                          "Sleep & Insomnia",
                          "ADHD & Focus",
                          "General Wellbeing"
                        ].map((c) => (
                          <button
                            key={c}
                            type="button"
                            className={`patient-concern-pill ${patientConcern === c ? "active" : ""}`}
                            onClick={() => setPatientConcern(c)}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes / Context */}
                    <div className="form-field">
                      <span>Brief Context / Notes for Specialist (Optional)</span>
                      <textarea
                        rows="3"
                        placeholder="Share anything you'd like your doctor to know beforehand..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Submit Bar */}
                <div className="booking-modal-footer">
                  <div className="security-notice">
                    <ShieldCheck size={16} /> 100% Encrypted & Confidential
                  </div>
                  <div className="modal-cta-buttons">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={handleCloseBooking}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary-gradient modal-cta">
                      Confirm & Schedule <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </form>
            )}
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
