import React from "react";
import { useNavigate } from "react-router-dom";
import { ScanLine } from "lucide-react";

function GoatCard() {
  const navigate = useNavigate();

  // --- MOCK DATA FOR BILLY ---
  const goat = {
    id: 1,
    name: "Billy",
    tag: "G-101",
    rfid: "RFID-9928-XA",
    breed: "Boer",
    gender: "Male (Buck)",
    birthDate: "2023-05-12",
    age: "1 Year, 2 Months",
    weight: "45.2 kg",
    height: "78 cm",
    status: "Healthy",
    healthStatus: "Healthy",
    img: "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1524024973431-2ad916746881?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516975591343-61a7a2e25943?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=800&q=80",
    ],
  };

  return (
    <div
      onClick={() => navigate(`/goatprofile/${goat.id}`)}
      className="group w-40 h-40 rounded-xl bg-white border-2 border-[#4A6741]/20 hover:border-[#4A6741] cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 overflow-hidden flex flex-col"
    >
      {/* 1. Image Section (Top 65%) */}
      <div className="h-24 w-full relative bg-gray-100 overflow-hidden">
        <img
          src={goat.img}
          alt={goat.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Status Dot (Top Right) */}
        <div
          className={`absolute top-2 right-2 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
            goat.status === "Healthy" ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </div>

      {/* 2. Info Section (Bottom 35%) */}
      <div className="flex-1 p-2 flex flex-col justify-center items-center bg-white text-center">
        <h3 className="text-[#4A6741] font-bold text-sm leading-tight truncate w-full px-1">
          {goat.name}
        </h3>

        <div className="flex items-center gap-1 mt-1 opacity-70">
          <ScanLine className="w-3 h-3 text-[#7A6E5C]" />
          <span className="text-[10px] text-[#7A6E5C] font-mono font-medium">
            {goat.tag}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GoatCard;
