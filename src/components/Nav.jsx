import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  ScanLine,
  LayoutGrid,
  Store,
  Activity,
  Calendar,
} from "lucide-react";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user_token");
      navigate("/");
    }
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-[#3A5233] text-white shadow-inner"
      : "text-[#E6ECD6] hover:bg-[#5C7D52] hover:text-white";
  };

  return (
    <header className="h-[76px] w-full bg-[#4A6741] shadow-lg sticky top-0 z-50">
      {/* Container needs relative positioning for the absolute center nav to work */}
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* --- LEFT: BRAND --- */}
        {/* z-10 ensures this stays clickable above any potential overlaps */}
        <Link to="/" className="flex items-center gap-3 group z-10">
          <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-wide leading-none">
              Smart G-ID
            </h1>
            <span className="text-[10px] text-[#E6ECD6] uppercase tracking-wider opacity-80">
              Livestock Tracking
            </span>
          </div>
        </Link>

        {/* --- CENTER: MAIN NAV --- */}
        {/* Absolute positioning guarantees true center regardless of side element widths */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
          {/* ACTIVE: Dashboard */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${isActive(
              "/"
            )}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </Link>

          {/* DISABLED ITEMS */}
          <DisabledNavItem
            icon={<Activity className="w-4 h-4" />}
            label="Activity Logs"
          />
          <DisabledNavItem
            icon={<Calendar className="w-4 h-4" />}
            label="Tasks"
          />
          <DisabledNavItem
            icon={<Store className="w-4 h-4" />}
            label="Marketplace"
          />
        </nav>

        {/* --- RIGHT: LOGOUT --- */}
        <div className="flex items-center gap-3 z-10">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-[#D4621C] hover:bg-[#B85418] text-white p-2 rounded-lg shadow-md transition-transform active:scale-95 group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}

// --- HELPER COMPONENT FOR DISABLED ITEMS ---
function DisabledNavItem({ icon, label }) {
  return (
    <div className="relative group cursor-not-allowed opacity-50 hover:opacity-60 transition-opacity">
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#E6ECD6] text-sm font-medium cursor-not-allowed"
      >
        {icon}
        {label}
      </button>
      {/* "Coming Soon" Badge */}
      <span className="absolute -top-2 -right-1 bg-[#4A6741] border border-[#E6ECD6]/30 text-[#E6ECD6] text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-sm pointer-events-none">
        SOON
      </span>
    </div>
  );
}

export default Nav;
