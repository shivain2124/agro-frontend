import { Link } from "react-router-dom";

export default function Sidebar({ isOpen }) {
  return (
    <div
      className={`bg-green-800 text-white h-screen top-0 transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      {isOpen && (
        <div className="p-5">
          <h1 className="text-2xl font-bold mb-10">🌿 AgroBot</h1>
          <nav className="flex flex-col gap-6">
            <Link to="/welcome">🏠 Welcome</Link>
            <Link to="/dashboard">📊 Dashboard</Link>
            <Link to="/irrigation">💧 Irrigation</Link>
            <Link to="/MLMmodel">🤖 ML Model</Link>
            <Link to="/profile">👤 Profile</Link>
            <Link to="/">🚪 Logout</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
