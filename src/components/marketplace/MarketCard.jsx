import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

function MarketCard({ goat }) {
  // Format Price
  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(goat.price || 0);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
        <img
          src={
            goat.mainPhoto || "https://via.placeholder.com/300?text=No+Image"
          }
          alt={goat.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-bold uppercase tracking-wider text-[#4A6741]">
            {goat.breed}
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

          <div className="flex items-center gap-1 text-gray-400 text-xs mb-4">
            <MapPin className="w-3 h-3" />
            <span>Zamboanga City</span> {/* Placeholder Location */}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="px-2 py-1 rounded border border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium capitalize">
              {goat.gender}
            </div>
            <div className="px-2 py-1 rounded border border-gray-100 bg-gray-50 text-xs text-gray-500 font-medium">
              {goat.weight}kg
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/product/${goat._id}`}
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
