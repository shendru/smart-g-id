import { useState, useEffect } from "react";

function Details({ setStep }) {
  const [goatName, setGoatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // NEW: State for Hardware Data
  const [sensorData, setSensorData] = useState({
    weight: "",
    height: "",
    uid: "",
  });

  // 1. Load Data from LocalStorage on Mount
  useEffect(() => {
    const savedData = localStorage.getItem("goat_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSensorData({
          weight: parsed.weight || "0.00",
          height: parsed.height || "0",
          uid: parsed.uid || "Unknown",
        });
      } catch (err) {
        console.error("Failed to parse goat data", err);
      }
    }
  }, []);

  const handleRandomName = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://randomuser.me/api/?inc=name&nat=us,gb"
      );
      const data = await response.json();
      setGoatName(data.results[0].name.first);
    } catch (error) {
      console.error("Error fetching name:", error);
      setGoatName("Goaty McGoatface");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
      <div className="p-5 mt-5">
        <h3 className="text-[#4A6741] font-bold text-lg mb-4">Goat Details</h3>

        <div className="space-y-4">
          {/* 1. Goat Name */}
          <div className="space-y-2">
            <label
              htmlFor="goatName"
              className="block font-medium text-sm text-[#4A6741]"
            >
              Goat Name *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="goatName"
                value={goatName}
                onChange={(e) => setGoatName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
                placeholder="e.g. Billy"
              />
              <button
                type="button"
                onClick={handleRandomName}
                disabled={isLoading}
                className={`px-4 py-2 font-medium text-sm rounded-lg border transition-colors flex items-center gap-2
                  ${
                    isLoading
                      ? "bg-gray-100 text-gray-400 cursor-wait"
                      : "bg-gray-100 text-[#4A6741] hover:bg-gray-200 border-gray-300"
                  }`}
              >
                {isLoading ? <>Fetching...</> : <>🎲 Random</>}
              </button>
            </div>
          </div>

          {/* 2. Gender & Birth Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="gender"
                className="block font-medium text-sm text-[#4A6741]"
              >
                Gender *
              </label>
              <select
                id="gender"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white"
              >
                <option value="">Select...</option>
                <option value="Male">Male (Buck)</option>
                <option value="Female">Female (Doe)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="birthDate"
                className="block font-medium text-sm text-[#4A6741]"
              >
                Birth Date *
              </label>
              <input
                type="date"
                id="birthDate"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741]"
              />
            </div>
          </div>

          {/* 3. Breed Dropdown */}
          <div className="space-y-2">
            <label
              htmlFor="breed"
              className="block font-medium text-sm text-[#4A6741]"
            >
              Breed *
            </label>
            <select
              id="breed"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white"
            >
              <option value="">Select a breed...</option>
              <option value="Native">Native</option>
              <option value="Boer">Boer</option>
              <option value="Anglo-Nubian">Anglo-Nubian</option>
              <option value="Saanen">Saanen</option>
              <option value="Toggenburg">Toggenburg</option>
              <option value="Mixed">Mixed / Crossbreed</option>
            </select>
          </div>

          <hr className="border-gray-200 my-4" />

          {/* 4. Hardware Detected Fields (AUTO-FILLED) */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Detected from Hardware (ESP32)
          </p>
          <div className="grid grid-cols-2 gap-4">
            {/* WEIGHT */}
            <div className="space-y-2">
              <label className="block font-medium text-sm text-[#4A6741]">
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sensorData.weight}
                  readOnly
                  className="w-full p-2 pl-8 bg-green-50 border border-green-200 rounded-lg text-green-800 font-bold cursor-not-allowed"
                />
                <WeightIcon className="w-4 h-4 absolute left-2.5 top-3 text-green-600" />
              </div>
            </div>

            {/* HEIGHT */}
            <div className="space-y-2">
              <label className="block font-medium text-sm text-[#4A6741]">
                Height (cm)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sensorData.height}
                  readOnly
                  className="w-full p-2 pl-8 bg-green-50 border border-green-200 rounded-lg text-green-800 font-bold cursor-not-allowed"
                />
                <RulerIcon className="w-4 h-4 absolute left-2.5 top-3 text-green-600" />
              </div>
            </div>
          </div>

          {/* RFID */}
          <div className="space-y-2">
            <label className="block font-medium text-sm text-[#4A6741]">
              RFID Tag ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={sensorData.uid}
                readOnly
                className="w-full p-2 pl-8 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 font-mono text-sm cursor-not-allowed"
              />
              <ScanIcon className="w-4 h-4 absolute left-2.5 top-3 text-gray-500" />
            </div>
          </div>

          {/* 5. Proceed Button */}
          <div className="pt-4">
            <button
              className="w-full bg-[#4A6741] hover:bg-[#3a5233] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
              onClick={() => setStep(4)}
            >
              Proceed to Next Step
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Icons Components (to avoid import errors if you don't have Lucide here)
const WeightIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="5" r="3" />
    <path d="M6.5 8a2 2 0 0 0-1.905 1.457L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.9-2.5l-2.495-9.043A2 2 0 0 0 17.5 8z" />
  </svg>
);
const RulerIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
    <path d="m14.5 12.5 2-2" />
    <path d="m11.5 9.5 2-2" />
    <path d="m8.5 6.5 2-2" />
    <path d="m17.5 15.5 2-2" />
  </svg>
);
const ScanIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <rect width="8" height="8" x="8" y="8" rx="1" />
  </svg>
);

export default Details;
