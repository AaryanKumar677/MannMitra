import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { migrateGuestConversations } from "../utils/guest";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Phone, User, X } from "lucide-react";

const Login = ({ onClose }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signInAsGuest } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAuthSuccess = async (user, successMessage) => {
    localStorage.removeItem("mann_guest");
    try {
      await migrateGuestConversations(user.uid);
    } catch (e) {
      console.warn("Migration failed:", e);
    }
    if (onClose) onClose();
    navigate("/app");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { user, error } = await signIn(form.email, form.password);
      if (error) throw error;
      if (user) await handleAuthSuccess(user, "Logged in successfully!");
    } catch (err) {
      setError(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user, error } = await signInWithGoogle();
      if (error) throw error;
      if (user) await handleAuthSuccess(user, "Logged in with Google!");
    } catch (err) {
      setError(err.message || "Failed to log in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { user, error } = await signInAsGuest();
      if (error) throw error;
      if (user) await handleAuthSuccess(user, "Logged in as Guest!");
    } catch (err) {
      setError(err.message || "Failed to log in as Guest");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = () => {
    alert("Phone Authentication UI coming soon! Please use Email, Google, or Guest for now.");
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
          className="bg-white/95 backdrop-blur-xl border border-white/20 text-gray-900 p-8 rounded-[2rem] shadow-2xl w-full max-w-[420px] relative overflow-hidden"
        >
          {/* Decorative background blobs */}
          <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-colors z-10"
          >
            <X size={18} />
          </button>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm">We're so glad to see you again.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  required
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Sign In"
                )}
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
                onClick={handlePhoneSignIn}
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

            <p className="text-sm text-center mt-8 text-gray-500">
              New to MannMitra?{" "}
              <span
                onClick={() => {
                  if (onClose) onClose();
                  navigate("/signup");
                }}
                className="font-semibold text-teal-600 hover:text-teal-700 cursor-pointer hover:underline transition-colors"
              >
                Create an account
              </span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Login;
