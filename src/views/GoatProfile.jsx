import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Ruler,
  Weight,
  Activity,
  Dna,
  ScanLine,
} from "lucide-react";

function GoatProfile() {
  const navigate = useNavigate();

  // DUMMY DATA (Replace with real data from MongoDB later)
  const goat = {
    name: "Billy",
    rfid: "RFID-9928-XA",
    breed: "Boer",
    gender: "Male (Buck)",
    birthDate: "2023-05-12",
    age: "1 Year, 2 Months",
    weight: "45.2 kg",
    height: "78 cm",
    healthStatus: "Healthy",
    // These would come from your ESP32 uploads
    images: [
      "https://placedog.net/600/400?id=1", // Main image
      "https://placedog.net/600/400?id=2",
      "https://placedog.net/600/400?id=3",
    ],
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* --- 1. Header Container: Name and RFID --- */}
      <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100 text-[#4A6741] transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center justify-center text-center mt-2">
          <h1 className="text-3xl font-bold text-[#4A6741] mb-2">
            {goat.name}
          </h1>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5F1E8] rounded-full border border-[#4A6741]/30">
            <ScanLine className="w-4 h-4 text-[#4A6741]" />
            <span className="text-[#4A6741] font-mono font-medium tracking-wider">
              {goat.rfid}
            </span>
          </div>
        </div>
      </div>

      {/* --- 2. Images Container: Gallery --- */}
      <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md p-6">
        <h3 className="text-[#4A6741] font-bold text-lg mb-4 flex items-center gap-2">
          Captured Images
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {goat.images.length} photos
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Featured Image (Latest) */}
          <div className="md:col-span-2 h-64 rounded-xl overflow-hidden border border-gray-200 relative group">
            <img
              src={goat.images[0]}
              alt="Latest Capture"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs backdrop-blur-sm">
              Latest Capture: Today, 2:30 PM
            </div>
          </div>

          {/* Smaller History Images */}
          <div className="flex flex-col gap-4 h-64">
            {goat.images.slice(1).map((img, index) => (
              <div
                key={index}
                className="h-full rounded-xl overflow-hidden border border-gray-200"
              >
                <img
                  src={img}
                  alt="History"
                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 3. Details Container: Specific Info --- */}
      <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[#4A6741] font-bold text-lg">Goat Details</h3>

          {/* Health Status Badge */}
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
            {goat.healthStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Breed */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Dna className="w-3 h-3" /> Breed
            </p>
            <p className="text-[#4A6741] font-medium text-lg">{goat.breed}</p>
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Gender
            </p>
            <p className="text-[#4A6741] font-medium text-lg">{goat.gender}</p>
          </div>

          {/* Age/Birthday */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Age
            </p>
            <p className="text-[#4A6741] font-medium text-lg">{goat.age}</p>
            <p className="text-xs text-gray-400">Born: {goat.birthDate}</p>
          </div>

          {/* Empty slot or Owner info */}
          <div className="space-y-1">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Owner
            </p>
            <p className="text-[#4A6741] font-medium text-lg">Farmer John</p>
          </div>
        </div>

        <hr className="my-6 border-dashed border-[#4A6741]/20" />

        {/* Hardware Data Section */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Hardware Measurements (ESP32)
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#F5F1E8]/50 rounded-xl border border-[#4A6741]/10 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-[#4A6741]">
              <Weight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-xl font-bold text-[#4A6741]">{goat.weight}</p>
            </div>
          </div>

          <div className="p-4 bg-[#F5F1E8]/50 rounded-xl border border-[#4A6741]/10 flex items-center gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-[#4A6741]">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Height</p>
              <p className="text-xl font-bold text-[#4A6741]">{goat.height}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoatProfile;
