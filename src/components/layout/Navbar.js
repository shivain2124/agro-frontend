import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Navbar({ title = "Dashboard", toggleSidebar }) {
  const nav = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    nav("/");
  };

  return (
    <div className="bg-white px-6 py-4 shadow top-0 z-10 flex justify-between items-center w-full">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-2xl">
          ☰
        </button>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      {/* Right Side: Profile Avatar */}
      <div className="relative" ref={dropdownRef}>
        <img
          src="https://api.dicebear.com/7.x/thumbs/svg?seed=AgroUser"
          alt="avatar"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded p-2 z-50">
            <button
              onClick={() => nav("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              👤 Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
