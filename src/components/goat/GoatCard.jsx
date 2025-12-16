import React from "react";
import { Link } from "react-router-dom";
import { ScanFace } from "lucide-react";

function GoatCard({ goat }) {
  // Helper for Status Badge Colors
  const isHealthy = goat.healthStatus && goat.healthStatus.includes("Healthy");

  return (
    <Link
      to={`/goatprofile/${goat._id}`}
      // MATCHED SIZE: w-40 h-40 to match AddGoat
      className="group relative block w-40 h-40 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-transparent hover:border-[#4A6741] transition-all duration-300 cursor-pointer bg-gray-100"
    >
      {/* 1. Full Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {goat.mainPhoto ? (
          <img
            src={goat.mainPhoto}
            alt={goat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          // Fallback if no image exists
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400">
            <ScanFace className="w-8 h-8 mb-1" />
            <span className="text-[10px]">No Photo</span>
          </div>
        )}
      </div>

      {/* 2. Dark Gradient Overlay (Visibility Wrapper) */}
      {/* This ensures text is readable even on bright images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

      {/* 3. Floating Status Badge (Top Right) */}
      <div className="absolute top-2 right-2">
        <span
          className={`block w-2.5 h-2.5 rounded-full border border-white shadow-sm ${
            isHealthy ? "bg-green-500" : "bg-orange-500"
          }`}
          title={goat.healthStatus?.[0] || "Unknown"}
        />
      </div>

      {/* 4. Floating Details (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col justify-end">
        {/* Name */}
        <h4 className="font-bold text-white text-base leading-tight truncate shadow-black drop-shadow-sm">
          {goat.name}
        </h4>

        {/* RFID & Gender - Compacted for small size */}
        <div className="flex items-center gap-1 text-white/80 text-[10px] font-mono mt-0.5">
          <span className="truncate max-w-[60px]">{goat.rfidTag}</span>
          <span>•</span>
          <span className="capitalize">{goat.gender}</span>
        </div>
      </div>
    </Link>
  );
}

export default GoatCard;
