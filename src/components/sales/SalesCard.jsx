import React, { useState } from "react";
import { DollarSign, ScanFace } from "lucide-react";

function SalesCard({ goat }) {
  // --- LOCAL STATE (Eventually this will come from DB) ---
  // Defaulting to false/0 for now until backend is ready
  const [isListed, setIsListed] = useState(goat.isForSale || false);
  const [price, setPrice] = useState(goat.price || "");

  // --- HANDLERS ---
  const handleToggle = () => {
    // TODO: API Call to update 'isForSale' status
    const newState = !isListed;
    setIsListed(newState);
    console.log(`Goat ${goat.name} is now ${newState ? "For Sale" : "Hidden"}`);
  };

  const handlePriceBlur = () => {
    // TODO: API Call to save price when user clicks away
    console.log(`Saved price for ${goat.name}: ${price}`);
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border transition-all duration-300 bg-white overflow-hidden ${
        isListed
          ? "border-[#4A6741] shadow-md shadow-green-100"
          : "border-gray-200 shadow-sm opacity-80 hover:opacity-100"
      }`}
    >
      {/* 1. Status Banner (Overlay) */}
      <div className="absolute top-0 left-0 w-full z-10 flex justify-between p-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm ${
            isListed
              ? "bg-green-500/90 text-white shadow-sm"
              : "bg-gray-200/90 text-gray-500"
          }`}
        >
          {isListed ? "Active Listing" : "Not Listed"}
        </span>
      </div>

      {/* 2. Image Area (Fixed Height) */}
      <div className="h-32 w-full bg-gray-100 relative">
        {goat.mainPhoto ? (
          <img
            src={goat.mainPhoto}
            alt={goat.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              !isListed ? "grayscale-[0.5]" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <ScanFace className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* 3. Controls Section */}
      <div className="p-3 flex flex-col gap-3">
        {/* Name Header */}
        <div>
          <h4 className="font-bold text-[#4A6741] text-sm leading-tight truncate">
            {goat.name}
          </h4>
          <p className="text-[10px] text-gray-400 font-mono">{goat.rfidTag}</p>
        </div>

        {/* Price Input */}
        <div className="relative group">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4A6741]">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handlePriceBlur} // Saves when you click away
            disabled={!isListed} // Disable price if not for sale? Optional.
            className={`w-full pl-7 pr-2 py-1.5 rounded-lg border text-sm font-semibold outline-none transition-colors ${
              isListed
                ? "border-gray-300 focus:border-[#4A6741] text-gray-800 bg-white"
                : "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-[10px] font-medium text-gray-400 uppercase">
            Sell this goat?
          </span>
          <button
            onClick={handleToggle}
            className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 flex items-center ${
              isListed ? "bg-[#4A6741]" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${
                isListed ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SalesCard;
