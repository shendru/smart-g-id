import React from "react";
import { Link } from "react-router-dom";
import { ScanFace } from "lucide-react";

function GoatCard({ goat }) {
  return (
    <Link
      to={`/goatprofile/${goat._id}`}
      className="group relative flex flex-col justify-between rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#4A6741] transition-all duration-300 overflow-hidden cursor-pointer h-full min-h-[180px]"
    >
      {/* 1. Status Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm
          ${
            goat.healthStatus && goat.healthStatus.includes("Healthy")
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-orange-100 text-orange-700 border border-orange-200"
          }`}
        >
          {goat.healthStatus && goat.healthStatus.length > 0
            ? goat.healthStatus[0]
            : "Unknown"}
        </span>
      </div>

      {/* 2. Image Section */}
      <div className="h-32 w-full bg-gray-100 flex items-center justify-center overflow-hidden group-hover:bg-[#4A6741]/5 transition-colors">
        {goat.mainPhoto ? (
          // REAL IMAGE
          <img
            src={goat.mainPhoto}
            alt={goat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          // FALLBACK ICON
          <ScanFace className="w-10 h-10 text-gray-300 group-hover:text-[#4A6741] transition-colors" />
        )}
      </div>

      {/* 3. Info Section */}
      <div className="p-4 flex flex-col gap-1">
        <h4 className="font-bold text-[#4A6741] text-lg leading-tight group-hover:underline truncate">
          {goat.name}
        </h4>
        <p className="text-xs text-gray-400 font-mono truncate">
          ID: {goat.rfidTag}
        </p>
        <p className="text-xs text-gray-500 mt-1 font-medium">
          {goat.breed} • {goat.gender}
        </p>
      </div>
    </Link>
  );
}

export default GoatCard;
