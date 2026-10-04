import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
      alert("Logged out successfully ✅");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error.message);
      alert("Logout failed ❌");
    }
  }

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        MyApp
      </h1>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="hover:text-blue-400 transition"
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
