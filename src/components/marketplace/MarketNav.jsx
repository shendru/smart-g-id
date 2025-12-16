import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Search, Menu } from "lucide-react";

function MarketNav() {
  return (
    <nav className="h-20 bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Brand */}
        <Link to="/market" className="flex items-center gap-2">
          <div className="bg-[#4A6741] p-2 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#4A6741] tracking-tight">
            GoatMarket
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link to="/market" className="text-[#4A6741]">
            Home
          </Link>
          <Link
            to="/market/goats"
            className="hover:text-[#4A6741] transition-colors"
          >
            Goats
          </Link>
          <Link
            to="/market/farms"
            className="hover:text-[#4A6741] transition-colors"
          >
            Farms
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search goats..."
              className="pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-1 focus:ring-[#4A6741]"
            />
          </div>
          <button className="px-5 py-2 rounded-full bg-[#4A6741] text-white text-sm font-bold shadow-md hover:bg-[#3A5233] transition-all">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
}

export default MarketNav;
