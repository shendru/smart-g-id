import React from "react";
import { Link } from "react-router-dom"; // Use Link to make it clickable
import { ScanFace } from "lucide-react"; // Or any icon you like

// Now accepts "goat" data as a prop
function GoatCard({ goat }) {
  return (
    <Link
      to={`/goatprofile/${goat._id}`} // Click to go to profile
      className="group relative flex flex-col justify-between rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#4A6741] transition-all duration-300 overflow-hidden cursor-pointer h-full min-h-[180px]"
    >
      {/* 1. Status Badge (Dynamic) */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
          ${
            goat.healthStatus && goat.healthStatus.includes("Healthy")
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {goat.healthStatus ? goat.healthStatus[0] : "Unknown"}
        </span>
      </div>

      {/* 2. Image Placeholder (or Real Image if you have it) */}
      <div className="h-28 bg-gray-100 w-full flex items-center justify-center group-hover:bg-[#4A6741]/5 transition-colors">
        {/* If you have an image URL in goat.photos, render it here. For now, an icon: */}
        <ScanFace className="w-10 h-10 text-gray-300 group-hover:text-[#4A6741] transition-colors" />
      </div>

      {/* 3. Info Section */}
      <div className="p-4 flex flex-col gap-1">
        <h4 className="font-bold text-[#4A6741] text-lg leading-tight group-hover:underline">
          {goat.name}
        </h4>
        <p className="text-xs text-gray-400 font-mono">ID: {goat.rfidTag}</p>
        <p className="text-xs text-gray-500 mt-1">
          {goat.breed} • {goat.gender}
        </p>
      </div>
    </Link>
  );
}

export default GoatCard;
