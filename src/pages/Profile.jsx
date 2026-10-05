import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile } from "../config/auth";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, Camera, User as UserIcon, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function Profile({ onClose }) {
  const { user, profile: authProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    phone_number: "",
    email: "",
    photo_url: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setLoading(true);
        if (authProfile) {
          setProfile(authProfile);
          setForm({
            first_name: authProfile.first_name || "",
            last_name: authProfile.last_name || "",
            age: authProfile.age || "",
            phone_number: authProfile.phone_number || "",
            email: authProfile.email || user.email || "",
            photo_url: authProfile.photo_url || user.photoURL || "",
          });
        } else {
          const { profile, error } = await getProfile(user.uid);
          if (!error && profile) {
            setProfile(profile);
            setForm({
              first_name: profile.first_name || "",
              last_name: profile.last_name || "",
              age: profile.age || "",
              phone_number: profile.phone_number || "",
              email: profile.email || user.email || "",
              photo_url: profile.photo_url || user.photoURL || "",
            });
          }
        }
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, authProfile]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    try {
      setUploadingImage(true);
      const storageRef = ref(storage, `profiles/${user.uid}/profile_pic.jpg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      setForm(prev => ({ ...prev, photo_url: downloadURL }));
      
      // Auto-save the profile picture immediately
      await updateProfile(user.uid, { photo_url: downloadURL }, user);
      
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    if (user) {
      const updates = {
        first_name: form.first_name,
        last_name: form.last_name,
        age: form.age,
        phone_number: form.phone_number,
        photo_url: form.photo_url,
      };

      const { profile: updated, error } = await updateProfile(user.uid, updates, user);
      if (!error && updated) {
        setProfile(updated);
        alert("✅ Profile updated successfully!");
        if (onClose) onClose();
      } else {
        alert("❌ Failed to update profile");
      }
    }
    setSaving(false);
  }

  async function handleLogout() {
    await signOut();
    setShowLogoutConfirm(false);
    if (onClose) onClose();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
        <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-n-8 border border-n-6 w-full max-w-[500px] rounded-[2rem] shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Decorative blobs */}
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-teal-500/20 rounded-full mix-blend-screen filter blur-[40px] pointer-events-none"></div>
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[40px] pointer-events-none"></div>

          <div className="p-8 relative z-10">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-n-4 hover:text-n-1 bg-n-7 hover:bg-n-6 p-2 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                My Profile
              </h2>
              <p className="text-n-4 text-sm mt-1">Manage your account settings</p>
            </div>

            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-28 h-28 rounded-full border-4 border-n-6 overflow-hidden bg-n-7 relative">
                  {form.photo_url ? (
                    <img 
                      src={form.photo_url} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-n-4">
                      <UserIcon size={48} />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white mb-1" size={24} />
                    <span className="text-white text-xs font-medium">Change Photo</span>
                  </div>

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center text-n-3 gap-2">
                  <Mail size={16} />
                  <span className="text-sm font-medium">{form.email}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-n-3 uppercase tracking-wider ml-1">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none text-n-1 placeholder:text-n-4"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-n-3 uppercase tracking-wider ml-1">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 bg-n-7 border border-n-6 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none text-n-1 placeholder:text-n-4"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1.5fr] gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-n-3 uppercase tracking-wider ml-1">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-n-4" />
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="Age"
                      className="w-full pl-9 pr-3 py-3 bg-n-7 border border-n-6 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none text-n-1 placeholder:text-n-4"
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-n-3 uppercase tracking-wider ml-1">Phone</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-n-4" />
                    </div>
                    <input
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="w-full pl-9 pr-3 py-3 bg-n-7 border border-n-6 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all outline-none text-n-1 placeholder:text-n-4"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-teal-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-n-6">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center justify-center gap-2 w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 py-3 rounded-xl transition-all font-medium"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-n-8 border border-n-6 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
          >
            <h3 className="text-xl font-bold text-n-1 mb-2">Sign Out</h3>
            <p className="text-n-4 text-sm mb-6">Are you sure you want to sign out of MannMitra?</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-n-6 hover:bg-n-5 text-n-1 py-2.5 rounded-xl transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition-colors font-medium shadow-lg shadow-red-500/20"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
