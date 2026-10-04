import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, Calendar, X, Eye, EyeOff, ShieldCheck } from "lucide-react";

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
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateForm = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email.";
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(form.password))
      return "Password needs 8+ chars, 1 uppercase, 1 number and 1 special char.";
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) return "Phone must be 10 digits.";
    return null;
  };

  async function safeParseResponse(res) {
    const text = await res.text();
    if (!text) return {};
    try {
      return JSON.parse(text);
    } catch (err) {
      return { _rawText: text };
    }
  }

  const sendOtp = async () => {
    setErrorMsg("");
    if (!form.email) return setErrorMsg("Please enter your email to verify.");
    setOtpLoading(true);

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const j = await safeParseResponse(res);

      if (!res.ok) {
        throw new Error(j.error || j.message || `Server error (${res.status})`);
      }

      setOtpSent(true);
      setResendCooldown(60);
      setSuccessMsg(j.message || "OTP sent — check your email (also spam).");
    } catch (err) {
      setErrorMsg(err.message || "Failed to send OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setErrorMsg("");
    if (!form.email || !otp) return setErrorMsg("Enter OTP sent to email.");
    setOtpLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code: otp }),
      });

      const j = await safeParseResponse(res);

      if (!res.ok) throw new Error(j.error || j.message || `Invalid OTP (${res.status})`);

      setEmailVerified(true);
      setSuccessMsg(j.message || "Email verified — you can now create your account.");
    } catch (err) {
      setErrorMsg(err.message || "OTP verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleAuthSuccess = async (user, msg) => {
    localStorage.removeItem("mann_guest");
    try {
      const { migrateGuestConversations } = await import("../utils/guest");
      await migrateGuestConversations(user.uid);
    } catch (e) {
      console.warn("Guest migration skipped:", e.message);
    }
    setSuccessMsg(msg);
    setTimeout(() => {
      if (onClose) onClose();
      navigate("/");
    }, 900);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!emailVerified) {
      setErrorMsg("Please verify your email first.");
      return;
    }

    const v = validateForm();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setLoading(true);
    try {
      const { user, error } = await signUp(
        form.email,
        form.password,
        form.firstName,
        form.lastName,
        form.age,
        form.phone
      );

      if (error) throw error;
      if (user) await handleAuthSuccess(user, "🎉 Account created successfully!");
    } catch (err) {
      setErrorMsg(err.message || "Account creation failed");
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
      if (user) await handleAuthSuccess(user, "🎉 Logged in with Google successfully!");
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
      if (user) await handleAuthSuccess(user, "🎉 Logged in as Guest!");
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
          className="bg-white/95 backdrop-blur-xl border border-white/20 text-gray-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-[480px] relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Decorative background blobs */}
          <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

          <button
            onClick={() => onClose && onClose()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Join MannMitra
              </h2>
              <p className="text-gray-500 text-sm">Create an account to join the community.</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              
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
                    className="w-full pl-9 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
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
                    className="w-full pl-9 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Age & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                  </div>
                  <input
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    placeholder="Age (Optional)"
                    className="w-full pl-9 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
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
                    placeholder="Phone (10 digits)"
                    inputMode="numeric"
                    className="w-full pl-9 pr-3 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Email & OTP */}
              <div className="flex gap-2 items-center">
                <div className="relative group flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-4 w-4 transition-colors ${emailVerified ? 'text-green-500' : 'text-gray-400 group-focus-within:text-teal-500'}`} />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    disabled={emailVerified}
                    className={`w-full pl-9 pr-3 py-3 bg-gray-50/50 border rounded-xl transition-all outline-none ${
                      emailVerified 
                        ? 'border-green-400 focus:border-green-400 bg-green-50/30' 
                        : 'border-gray-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500'
                    }`}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={otpLoading || resendCooldown > 0 || !form.email || emailVerified}
                  className={`px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap border ${
                    emailVerified 
                      ? 'bg-green-500 text-white border-green-500 opacity-50' 
                      : otpLoading 
                        ? 'bg-gray-100 text-gray-400 border-gray-200' 
                        : 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  {emailVerified ? <ShieldCheck size={18} /> : otpLoading ? "Sending..." : resendCooldown > 0 ? `Wait ${resendCooldown}s` : otpSent ? "Resend OTP" : "Verify Email"}
                </button>
              </div>

              {/* OTP Input Field */}
              <AnimatePresence>
                {otpSent && !emailVerified && (
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
                      className="flex-1 px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none tracking-widest text-center font-mono"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={otpLoading || !otp || otp.length < 4}
                      className="px-6 py-3 rounded-xl font-medium text-sm transition-all bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50"
                    >
                      {otpLoading ? "..." : "Confirm"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password */}
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
                  className="w-full pl-9 pr-10 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                    {errorMsg}
                  </motion.p>
                )}
                {successMsg && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-teal-600 text-sm text-center bg-teal-50 p-2 rounded-lg font-medium">
                    {successMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !emailVerified}
                className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Creating account..." : emailVerified ? "Create Account" : "Verify Email to Continue"}
              </button>
            </form>

            <div className="mt-6 mb-6 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative bg-white px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                Or continue with
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                title="Google"
                className="flex items-center justify-center py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              
              <button
                onClick={() => alert("Phone Authentication coming soon!")}
                disabled={loading}
                title="Phone"
                className="flex items-center justify-center py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50 text-gray-700"
              >
                <Phone className="w-5 h-5" />
              </button>

              <button
                onClick={handleGuestSignIn}
                disabled={loading}
                title="Anonymous (Guest)"
                className="flex items-center justify-center py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 disabled:opacity-50 text-gray-700"
              >
                <User className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-center mt-6 text-gray-500">
              Already have an account?{" "}
              <span
                onClick={() => {
                  if (onClose) onClose();
                  navigate("/login");
                }}
                className="font-semibold text-teal-600 hover:text-teal-700 cursor-pointer hover:underline transition-colors"
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
