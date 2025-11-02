import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Chatbot from "../chat/Chatbot";

export default function Layout({ children, title }) {
  const [isOpen, setIsOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div
      className={`flex ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Main Area */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300 overflow-x-hidden`}
      >
        <Navbar
          title={title}
          toggleSidebar={() => setIsOpen(!isOpen)}
          sidebarOpen={isOpen}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Content */}
        <main className="pt-20 px-10 pb-16">{children}</main>

        {/* Floating Chatbot */}
        <Chatbot />
      </div>
    </div>
  );
}
