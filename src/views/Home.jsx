import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/data"; // <--- Import API
import AddGoat from "../components/home/AddGoat";
import GoatCard from "../components/goat/GoatCard";
import { Loader2, LayoutGrid, Sprout } from "lucide-react";

function Home() {
  const [goats, setGoats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1. Get Local Data
        const userTokenStr = localStorage.getItem("user_token");

        const userToken = JSON.parse(userTokenStr);
        setUserName(userToken.name || "Farmer");

        // 2. Fetch via Centralized API
        // No more raw fetch calls here!
        if (userToken._id) {
          const goatList = await api.goats.list(userToken._id);
          console.log(goatList);
          setGoats(goatList);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  return (
    <div className="min-h-screen pb-20">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b-2 border-[#4A6741]/10 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Branding & Welcome */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#4A6741] flex items-center gap-2">
                <Sprout className="w-6 h-6" />
                My Herd
              </h1>
              <p className="text-xs text-[#7A6E5C] font-medium">
                Welcome back, {userName}
              </p>
            </div>

            {/* Right: Stats */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center bg-[#F5F1E8] px-3 py-1.5 rounded-full border border-[#4A6741]/20">
                <LayoutGrid className="w-4 h-4 text-[#4A6741] mr-2" />
                <span className="text-sm font-bold text-[#4A6741]">
                  {goats.length}{" "}
                  <span className="font-normal text-[#7A6E5C]">Head</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#4A6741]/70">
            <Loader2 className="w-10 h-10 animate-spin mb-3" />
            <span className="text-sm font-medium">
              Gathering your herd data...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* 1. Render Existing Goats */}
            {goats.map((goat) => (
              <div
                key={goat._id}
                className="animate-in fade-in zoom-in-95 duration-300"
              >
                <GoatCard goat={goat} />
              </div>
            ))}

            {/* 2. Add Goat Button */}
            <div className="h-full min-h-[300px]">
              <AddGoat />
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && goats.length === 0 && (
          <div className="text-center mt-4 text-[#7A6E5C]/60 text-sm">
            You don't have any goats yet. Click the card above to add your first
            one.
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
