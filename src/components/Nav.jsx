import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  ScanLine,
  LayoutGrid,
  Store,
  ShoppingBag, // Import ShoppingBag icon
} from "lucide-react";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("user_token");
      // This goes to "/" AND reloads the page automatically
      window.location.href = "/";
    }
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-[#3A5233] text-white shadow-inner border border-white/10"
      : "text-[#E6ECD6] hover:bg-[#5C7D52] hover:text-white border border-transparent";
  };

  return (
    <header className="h-[76px] w-full bg-[#4A6741] border-b border-[#3A5233] shadow-lg sticky top-0 z-50">
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* --- LEFT: BRAND --- */}
        <Link to="/" className="flex items-center gap-3 group z-10">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/5 group-hover:bg-white/20 transition-all duration-300">
            <ScanLine className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white tracking-wide leading-none drop-shadow-sm">
              Smart G-ID
            </h1>
            <span className="text-[10px] text-[#E6ECD6] uppercase tracking-wider opacity-80 font-medium">
              Livestock Tracking
            </span>
          </div>
        </Link>

        {/* --- CENTER: MAIN NAV (Admin Tabs) --- */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-2">
          {/* 1. DASHBOARD */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide ${isActive(
              "/"
            )}`}
          >
            <LayoutGrid className="w-4 h-4" />
            Dashboard
          </Link>

          {/* 2. SALES */}
          <Link
            to="/sales"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold tracking-wide ${isActive(
              "/sales"
            )}`}
          >
            <Store className="w-4 h-4" />
            Sales
          </Link>
        </nav>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-3 z-10">
          {/* NEW: Switch to Marketplace View */}
          <Link
            to="/market"
            className="hidden sm:flex items-center gap-2 bg-[#3A5233] hover:bg-[#2F4229] border border-[#3A5233] text-[#E6ECD6] px-4 py-2.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 group"
            title="View Public Marketplace"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide">
              Visit Shop
            </span>
          </Link>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center bg-[#D4621C] hover:bg-[#B85418] border border-[#B85418] text-white p-2.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg active:scale-95 group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Nav;
