import { useState } from "react";

function Details({ setStep }) {
  const [goatName, setGoatName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-[#4A6741]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Fetching...
                  </>
                ) : (
                  <>🎲 Random</>
                )}
              </button>
            </div>
          </div>

          {/* 2. Gender & Birth Date (Side by Side for better layout) */}
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

          {/* 4. Hardware Detected Fields */}
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Detected from Hardware (ESP32)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium text-sm text-[#4A6741]">
                Weight (kg)
              </label>
              <input
                type="text"
                value="Waiting..."
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed select-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block font-medium text-sm text-[#4A6741]">
                Height (cm)
              </label>
              <input
                type="text"
                value="Waiting..."
                readOnly
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed select-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm text-[#4A6741]">
              RFID Tag ID
            </label>
            <input
              type="text"
              value="SCAN_WAITING..."
              readOnly
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 font-mono text-sm cursor-not-allowed select-none"
            />
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

export default Details;
