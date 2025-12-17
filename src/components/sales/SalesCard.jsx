import React, { useState } from "react";
import { PhilippinePeso, ScanFace, Loader2 } from "lucide-react";
import { api } from "../../lib/data";

const BASE_URL = "http://localhost:5000";

function SalesCard({ goat, onUpdate }) {
  // --- HELPER: Calculate Image URL Once ---
  // We define this outside or inside, but we use it to initialize state
  const getStableImageUrl = (data) => {
    let targetPath = null;

    if (data.images && data.images.length > 0) {
      targetPath = data.images[0];
    } else if (data.mainPhotoPath) {
      targetPath = data.mainPhotoPath;
    } else {
      targetPath = data.mainPhoto;
    }

    if (!targetPath) return null;

    if (targetPath.startsWith("http")) return targetPath;

    const cleanPath = targetPath.startsWith("/")
      ? targetPath.slice(1)
      : targetPath;

    return `${BASE_URL}/${cleanPath}`;
  };

  // --- STATE ---
  const formatNumber = (num) => {
    if (!num) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [isListed, setIsListed] = useState(goat.isForSale || false);
  const [price, setPrice] = useState(formatNumber(goat.price || 0));
  const [saving, setSaving] = useState(false);

  // ✅ FIX: Store image in state so it never changes/reloads on prop updates
  const [stableImage] = useState(() => getStableImageUrl(goat));

  // --- SHARED UPDATE FUNCTION ---
  const updateBackend = async (changes) => {
    try {
      setSaving(true);
      const updatedGoat = await api.market.updateListing(goat._id, changes);

      if (onUpdate) {
        onUpdate(updatedGoat);
      }
      console.log("Success:", updatedGoat);
    } catch (error) {
      console.error("Failed to update listing:", error);
    } finally {
      setSaving(false);
    }
  };

  // --- HANDLERS ---
  const handlePriceChange = (e) => {
    let rawValue = e.target.value.replace(/[^0-9.]/g, "");
    const parts = rawValue.split(".");
    if (parts.length > 2) {
      rawValue = parts[0] + "." + parts.slice(1).join("");
    }
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    setPrice(parts.join("."));
  };

  const handleToggle = async () => {
    const newState = !isListed;
    setIsListed(newState); // Optimistic Update

    const cleanPrice = parseFloat(price.replace(/,/g, "")) || 0;
    const updateData = {
      isForSale: newState,
      price: cleanPrice,
    };

    if (newState === true) {
      updateData.listedAt = new Date().toISOString();
    }

    await updateBackend(updateData);
  };

  const handlePriceBlur = async () => {
    const cleanPrice = parseFloat(price.replace(/,/g, "")) || 0;
    if (cleanPrice !== goat.price) {
      await updateBackend({
        price: cleanPrice,
        isForSale: isListed,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div
      className={`relative flex flex-col rounded-xl border transition-all duration-300 bg-white overflow-hidden ${
        isListed
          ? "border-[#4A6741] shadow-md shadow-green-100"
          : "border-gray-200 shadow-sm opacity-90 hover:opacity-100"
      }`}
    >
      {/* 1. Status Banner */}
      <div className="absolute top-0 left-0 w-full z-10 flex justify-between p-2">
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide backdrop-blur-sm transition-colors ${
            isListed
              ? "bg-green-500/90 text-white shadow-sm"
              : "bg-gray-200/90 text-gray-500"
          }`}
        >
          {isListed ? "Active Listing" : "Draft"}
        </span>
        {saving && (
          <div className="bg-white/80 rounded-full p-1 shadow-sm backdrop-blur-sm">
            <Loader2 className="w-3 h-3 text-[#4A6741] animate-spin" />
          </div>
        )}
      </div>

      {/* 2. Image Area */}
      <div className="h-32 w-full bg-gray-100 relative">
        {/* ✅ Use stableImage state here instead of recalculating */}
        {stableImage ? (
          <img
            src={stableImage}
            alt={goat.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              !isListed ? "grayscale-[0.5]" : ""
            }`}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.classList.add(
                "bg-gray-200",
                "flex",
                "items-center",
                "justify-center"
              );
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <ScanFace className="w-8 h-8 opacity-20" />
          </div>
        )}
      </div>

      {/* 3. Controls Section */}
      <div className="p-3 flex flex-col gap-3">
        <div>
          <h4 className="font-bold text-[#4A6741] text-sm leading-tight truncate">
            {goat.name}
          </h4>
          <p className="text-[10px] text-gray-400 font-mono">{goat.rfidTag}</p>
        </div>

        {/* Input Field */}
        <div className="relative group">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4A6741]">
            <PhilippinePeso className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={price}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
            onKeyDown={handleKeyDown}
            className={`w-full pl-7 pr-2 py-1.5 rounded-lg border text-sm font-semibold outline-none transition-colors ${
              isListed
                ? "border-gray-300 focus:border-[#4A6741] text-gray-800 bg-white"
                : "border-gray-200 bg-gray-50/50 text-gray-500 focus:bg-white focus:border-gray-300"
            }`}
          />
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-[10px] font-medium text-gray-400 uppercase">
            Publicly Visible
          </span>
          <button
            onClick={handleToggle}
            disabled={saving}
            className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#4A6741]/20 ${
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
