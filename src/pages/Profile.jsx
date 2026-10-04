import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../config/auth";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Profile({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, profile: authProfile, signOut } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    age: "",
    phone_number: "",
    email: "",
  });

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

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    if (user) {
      const updates = {
        first_name: form.first_name,
        last_name: form.last_name,
        age: form.age,
      };

      const { profile: updated, error } = await updateProfile(user.uid, updates);
      if (!error && updated) {
        setProfile(updated);
        alert("✅ Profile updated successfully!");
        onClose();
      } else {
        alert("❌ Failed to update profile");
      }
    }
    setSaving(false);
  }

  async function handleLogout() {
    await signOut();
    setShowLogoutConfirm(false);
    onClose();
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black bg-opacity-40" onClick={onClose} />

      <aside className="ml-auto w-full sm:w-1/2 lg:w-2/5 bg-white h-full shadow-2xl p-6 overflow-auto rounded-l-2xl">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">{form.email || "—"}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">{form.phone_number || "—"}</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter your age"
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="mt-6 flex items-center justify-center gap-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Logout confirm modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to log out?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
