import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, Calendar, X, Eye, EyeOff } from "lucide-react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

export default function Signup({ onClose }) {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, signInAsGuest } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{7,}$/.test(form.password))
      return "Password doesn't meet requirements.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (form.phone && !/^\+?[0-9]{10,14}$/.test(form.phone)) return "Enter a valid phone number.";
    return null;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    
    const v = validateForm();
    if (v) return setErrorMsg(v);

    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setOtpSent(true);
      setSuccessMsg("📩 6-digit OTP sent to your email!");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndCreateAccount = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!form.otp || form.otp.length !== 6) {
      return setErrorMsg("Please enter the 6-digit OTP.");
    }

    setLoading(true);
    try {
      // 1. Verify OTP
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Invalid OTP");

      // 2. OTP is verified! Now create the actual Firebase account
      setSuccessMsg("✅ OTP Verified! Creating account...");
      
      const { user, error } = await signUp(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
        form.age,
        form.phone
      );

      if (error) throw error;

      // Guest Migration
      localStorage.removeItem("mann_guest");
      try {
        const { migrateGuestConversations } = await import("../utils/guest");
        if (user) await migrateGuestConversations(user.uid);
      } catch (err) {
        console.warn("Guest migration skipped:", err.message);
      }

      setSuccessMsg("🎉 Account created successfully! Launching sanctuary...");
      sessionStorage.setItem("mann_auth_event", "new_registration");
      sessionStorage.setItem("mann_user_name", form.firstName || "Friend");
      sessionStorage.setItem("mann_trigger_portal", "true");
      setTimeout(() => {
        if (onClose) onClose();
        navigate("/app");
      }, 1200);

    } catch (err) {
      console.error("Signup error:", err);
      if (err.message?.includes('email-already-in-use')) {
        setErrorMsg("This email is already registered.");
      } else {
        setErrorMsg(err.message || "Account creation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { user, error } = await signInWithGoogle();
      if (error) throw error;
      if (user) {
        localStorage.removeItem("mann_guest");
        try {
          const { migrateGuestConversations } = await import("../utils/guest");
          await migrateGuestConversations(user.uid);
        } catch (e) {}
        setSuccessMsg("🎉 Logged in with Gmail!");
        sessionStorage.setItem("mann_auth_event", "new_registration");
        const gName = user.displayName ? user.displayName.split(" ")[0] : "Friend";
        sessionStorage.setItem("mann_user_name", gName);
        sessionStorage.setItem("mann_trigger_portal", "true");
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/app");
        }, 900);
      }
    } catch (err) {
      setErrorMsg(err.message || "Gmail Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const { user, error } = await signInAsGuest();
      if (error) throw error;
      if (user) {
        setSuccessMsg("🎉 Logged in as Guest!");
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/");
        }, 900);
      }
    } catch (err) {
      setErrorMsg(err.message || "Guest Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white border border-gray-200 text-gray-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-[420px] relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Decorative background blobs - made slightly softer */}
          <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

          <button
            onClick={() => onClose && onClose()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-1">
                Join MannMitra
              </h2>
              <p className="text-gray-500 text-sm">Create an account to join the community.</p>
            </div>

            <form onSubmit={otpSent ? verifyAndCreateAccount : handleSendOtp} className="space-y-3.5">
              
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 disabled:opacity-60"
                    required
                    disabled={otpSent}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 disabled:opacity-60"
                    required
                    disabled={otpSent}
                  />
                </div>
              </div>

              {/* Age & Phone */}
              <div className="grid grid-cols-[1fr_1.5fr] gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Age"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 disabled:opacity-60"
                    disabled={otpSent}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone (optional)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 disabled:opacity-60"
                    disabled={otpSent}
                  />
                </div>
              </div>

              {/* Email Only - No OTP Input */}
              <div className="relative group w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 disabled:opacity-60"
                  required
                  disabled={otpSent}
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 text-sm disabled:opacity-60"
                    required
                    disabled={otpSent}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm"
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 text-sm disabled:opacity-60"
                    required
                    disabled={otpSent}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              
              {!otpSent && (
                <p className="text-[11px] text-gray-500 text-center font-medium mt-1">
                  Min 7 chars, 1 uppercase, 1 number, 1 special char
                </p>
              )}

              {/* OTP Input Field - ONLY SHOWS AFTER OTP IS SENT */}
              <AnimatePresence>
                {otpSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-2"
                  >
                    <div className="relative group w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                      </div>
                      <input
                        name="otp"
                        type="text"
                        maxLength={6}
                        value={form.otp}
                        onChange={handleChange}
                        placeholder="Enter 6-digit OTP"
                        className="w-full pl-9 pr-3 py-3 bg-white border-2 border-teal-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm text-center tracking-[0.5em] text-lg font-bold text-gray-800"
                        required
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status Messages */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm text-center bg-red-50 py-1.5 rounded-lg border border-red-100">
                    {errorMsg}
                  </motion.p>
                )}
                {successMsg && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-teal-600 text-sm text-center bg-teal-50 py-1.5 rounded-lg font-medium border border-teal-100">
                    {successMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-10/12 relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading 
                    ? (otpSent ? "Verifying..." : "Sending OTP...") 
                    : (otpSent ? "Verify & Create Account" : "Send OTP")
                  }
                </button>
              </div>
            </form>

            {!otpSent && (
              <>
                <div className="mt-5 mb-5 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Or continue with
                  </div>
                </div>

                {/* Providers - Minimal colors and Gmail text */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    title="Gmail"
                    className="flex items-center justify-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 text-gray-700 font-semibold text-sm gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Gmail
                  </button>

                  <button
                    onClick={handleGuestSignIn}
                    disabled={loading}
                    title="Guest"
                    className="flex items-center justify-center py-2.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:bg-gray-100 transition-all active:scale-95 disabled:opacity-50 text-gray-700 font-semibold text-sm gap-2"
                  >
                    <User className="w-5 h-5" /> Guest
                  </button>
                </div>

                <p className="text-xs text-center mt-6 text-gray-500 font-medium">
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      if (onClose) onClose();
                      navigate("/login");
                    }}
                    className="font-bold text-teal-600 hover:text-teal-700 cursor-pointer hover:underline transition-colors"
                  >
                    Sign In
                  </span>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
