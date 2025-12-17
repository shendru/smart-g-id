import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Store, ScanFace } from "lucide-react";

// 1. Define Backend URL
const BASE_URL = "http://localhost:5000";

function MarketCard({ goat }) {
  // --- IMAGE LOGIC START ---
  let targetPath = null;

  // A. Check for images array (Primary) -> Get the FIRST image
  if (goat.images && goat.images.length > 0) {
    targetPath = goat.images[0];
  }
  // B. Check for mainPhotoPath (Secondary)
  else if (goat.mainPhotoPath) {
    targetPath = goat.mainPhotoPath;
  }
  // C. Check for mainPhoto (Legacy/Fallback)
  else {
    targetPath = goat.mainPhoto;
  }

  // Construct the proper Image URL
  let fullImageUrl = null;
  if (targetPath) {
    if (targetPath.startsWith("http")) {
      fullImageUrl = targetPath;
    } else {
      // Remove leading slash if present to avoid double slashes
      const cleanPath = targetPath.startsWith("/")
        ? targetPath.slice(1)
        : targetPath;
      fullImageUrl = `${BASE_URL}/${cleanPath}`;
    }
  }
  // --- IMAGE LOGIC END ---

  // Format Price
  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(goat.price || 0);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={goat.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = "none";
              e.target.parentElement.classList.add(
                "flex",
                "items-center",
                "justify-center",
                "text-gray-400"
              );
              // We can inject the placeholder icon here dynamically if we want,
              // but showing the gray box is often cleaner or handled by the parent div logic
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
            <ScanFace className="w-8 h-8 mb-1 opacity-50" />
            <span className="text-[10px]">No Photo</span>
          </div>
        )}

        {/* Breed Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-[#4A6741]">
            {goat.breed || "Mixed"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-800 text-lg">{goat.name}</h3>
            <span className="font-bold text-[#4A6741] bg-green-50 px-2 py-1 rounded-lg text-sm">
              {formattedPrice}
            </span>
          </div>

          {/* --- ADDRESS & FARM SECTION --- */}
          <div className="flex flex-col gap-1 mb-4">
            {/* Address */}
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-medium truncate">
                {goat.ownerAddress || "Address not listed"}
              </span>
            </div>

            {/* Farm Name (Optional) */}
            {goat.farmName && (
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px]">
                <Store className="w-3 h-3" />
                <span className="truncate">{goat.farmName}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="px-2 py-1 rounded border border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium capitalize">
              {goat.gender}
            </div>
            <div className="px-2 py-1 rounded border border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium">
              {goat.weight ? `${goat.weight}kg` : "N/A"}
            </div>
          </div>
        </div>

        <Link
          to={`/market/product/${goat._id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#4A6741] text-[#4A6741] font-bold text-sm group-hover:bg-[#4A6741] group-hover:text-white transition-all"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default MarketCard;
