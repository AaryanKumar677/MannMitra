import React, { useEffect, useState, useRef } from "react";
import { getProfile, updateProfile } from "../config/auth";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, Camera, User as UserIcon, Loader2 } from "lucide-react";
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
        if (onClose) onClose();
      } else {
        alert("Failed to update profile");
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
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      >
        <motion.div 
          initial={{ scale: 0.98, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.98, y: 10, opacity: 0 }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
          className="bg-[#0a0a0a] border border-white/10 w-full max-w-[480px] rounded-2xl shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between border-b border-white/10">
            <div>
              <h2 className="text-xl font-semibold text-white tracking-tight">Account Settings</h2>
              <p className="text-[#a1a1aa] text-sm mt-0.5">Manage your profile and preferences.</p>
            </div>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8">
              <div 
                className="relative group cursor-pointer shrink-0" 
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-20 h-20 rounded-full border border-white/10 overflow-hidden bg-[#18181b] relative">
                  {form.photo_url ? (
                    <img 
                      src={form.photo_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#52525b]">
                      <UserIcon size={32} />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white" size={20} />
                  </div>

                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
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
              <div>
                <h3 className="text-white font-medium">{form.first_name || 'User'} {form.last_name}</h3>
                <p className="text-[#a1a1aa] text-sm">{form.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#a1a1aa]">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#18181b] border border-white/10 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all outline-none text-white text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#a1a1aa]">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#18181b] border border-white/10 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-[1fr_1.5fr] gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#a1a1aa]">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#18181b] border border-white/10 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all outline-none text-white text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#a1a1aa]">Phone</label>
                  <input
                    type="text"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-[#18181b] border border-white/10 rounded-lg focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all outline-none text-white text-sm"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors flex items-center gap-1.5"
                >
                  <LogOut size={16} /> Sign out
                </button>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 w-full max-w-[320px] shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-white mb-2">Sign out?</h3>
            <p className="text-[#a1a1aa] text-sm mb-6">You will need to sign back in to access your account.</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 bg-[#18181b] hover:bg-[#27272a] border border-white/10 rounded-lg text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
