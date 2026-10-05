import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, Calendar, X, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { auth } from "../config/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, linkWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function Signup({ onClose }) {
  const navigate = useNavigate();
  const { signInWithGoogle, signInAsGuest } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    // Initialize Recaptcha once
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  }, []);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{7,}$/.test(form.password))
      return "Password doesn't meet requirements.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!/^\+?[0-9]{10,14}$/.test(form.phone)) return "Enter a valid phone number (e.g. +91XXXXXXXXXX).";
    return null;
  };

  const sendPhoneOtp = async () => {
    setErrorMsg("");
    const v = validateForm();
    if (v && v !== "Password doesn't meet requirements." && v !== "Passwords do not match.") {
      return setErrorMsg("Please fill valid details before sending OTP (Phone must include country code).");
    }
    if (!form.phone.startsWith('+')) {
      return setErrorMsg("Phone number must include country code (e.g. +91).");
    }

    setOtpLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, form.phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setSuccessMsg("OTP sent to your phone!");
    } catch (err) {
      console.error("Phone OTP error:", err);
      setErrorMsg(err.message || "Failed to send OTP. Check phone number format.");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtpAndCreateAccount = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const v = validateForm();
    if (v) return setErrorMsg(v);
    
    if (!confirmationResult && !phoneVerified) {
      return setErrorMsg("Please verify your phone number first.");
    }

    setLoading(true);
    try {
      let user;
      // Step 1: Verify OTP (This signs them in via Phone)
      const result = await confirmationResult.confirm(otp);
      user = result.user;
      setPhoneVerified(true);

      // Step 2: Link Email and Password
      const credential = EmailAuthProvider.credential(form.email, form.password);
      await linkWithCredential(user, credential);

      // Step 3: Save profile to Firestore
      const profileData = {
        user_id: user.uid,
        first_name: form.firstName,
        last_name: form.lastName,
        age: form.age || null,
        phone_number: form.phone,
        email: form.email,
      };
      await setDoc(doc(db, "profiles", user.uid), profileData);

      // Step 4: Guest Migration
      localStorage.removeItem("mann_guest");
      try {
        const { migrateGuestConversations } = await import("../utils/guest");
        await migrateGuestConversations(user.uid);
      } catch (err) {
        console.warn("Guest migration skipped:", err.message);
      }

      setSuccessMsg("🎉 Account created successfully!");
      setTimeout(() => {
        if (onClose) onClose();
        navigate("/");
      }, 900);
    } catch (err) {
      console.error("Signup error:", err);
      if (err.code === 'auth/credential-already-in-use') {
        setErrorMsg("This email is already registered.");
      } else if (err.code === 'auth/invalid-verification-code') {
        setErrorMsg("Invalid OTP code.");
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
        setSuccessMsg("🎉 Logged in with Google!");
        setTimeout(() => {
          if (onClose) onClose();
          navigate("/");
        }, 900);
      }
    } catch (err) {
      setErrorMsg(err.message || "Google Sign-In failed");
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

            <form onSubmit={verifyOtpAndCreateAccount} className="space-y-3.5">
              
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
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800"
                    required
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
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Age & Email */}
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
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800"
                    required
                  />
                </div>
              </div>

              {/* Phone & OTP Send */}
              <div className="flex gap-2 items-center">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className={`h-4 w-4 transition-colors ${phoneVerified ? 'text-green-500' : 'text-gray-400 group-focus-within:text-teal-500'}`} />
                  </div>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone (e.g. +91...)"
                    disabled={phoneVerified || otpSent}
                    className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-xl transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 ${
                      phoneVerified 
                        ? 'border-green-400 focus:border-green-400 bg-green-50' 
                        : 'border-gray-300 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500'
                    }`}
                    required
                  />
                </div>
                {!phoneVerified && (
                  <button
                    type="button"
                    onClick={sendPhoneOtp}
                    disabled={otpLoading || !form.phone || otpSent}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100 disabled:opacity-50"
                  >
                    {otpLoading ? "Sending..." : otpSent ? "OTP Sent" : "Send OTP"}
                  </button>
                )}
              </div>

              <div id="recaptcha-container"></div>

              {/* OTP Input Field */}
              <AnimatePresence>
                {otpSent && !phoneVerified && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 items-center overflow-hidden"
                  >
                    <input
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none tracking-widest text-center font-mono shadow-sm"
                      maxLength={6}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

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
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 text-sm"
                    required
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
                    className="w-full pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none shadow-sm placeholder:text-gray-400 text-gray-800 text-sm"
                    required
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
              <p className="text-[11px] text-gray-500 text-center font-medium mt-1">
                Min 7 chars, 1 uppercase, 1 number, 1 special char
              </p>

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
              <button
                type="submit"
                disabled={loading || !otpSent || !otp}
                className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-5 mb-5 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Or continue with
              </div>
            </div>

            {/* Providers - Removed Phone Icon */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                title="Google"
                className="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>

              <button
                onClick={handleGuestSignIn}
                disabled={loading}
                title="Anonymous (Guest)"
                className="flex items-center justify-center py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50 text-gray-700 font-medium text-sm gap-2"
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
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
