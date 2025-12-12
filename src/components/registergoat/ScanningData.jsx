import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Ruler, Weight, ScanLine } from "lucide-react";

function ScanningData({ setStep }) {
  // We simulate a 3-step loading process
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Start fetching RFID...
    const timer1 = setTimeout(() => setProgress(1), 1500); // After 1.5s

    // 2. Start measuring Weight...
    const timer2 = setTimeout(() => setProgress(2), 3000); // After 3s

    // 3. Start measuring Height...
    const timer3 = setTimeout(() => setProgress(3), 4500); // After 4.5s

    // 4. DONE -> Move to Details screen
    const timer4 = setTimeout(() => {
      setStep(3);
    }, 6000); // Total wait: 6 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [setStep]);

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
      <div className="p-8 flex flex-col items-center w-full max-w-sm mx-auto">
        {/* Spinner Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#4A6741]/10 rounded-full animate-ping"></div>
          <div className="relative p-4 bg-white rounded-full border-2 border-[#4A6741]/20">
            <Loader2 className="w-12 h-12 text-[#4A6741] animate-spin" />
          </div>
        </div>

        <h3 className="text-[#4A6741] font-bold text-xl mb-6">
          Syncing with Hardware...
        </h3>

        {/* The Checklist Animation */}
        <div className="w-full space-y-4">
          {/* Item 1: RFID */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 
                ${
                  progress >= 1
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100 opacity-50"
                }`}
          >
            <div className="flex items-center gap-3">
              <ScanLine
                className={`w-5 h-5 ${
                  progress >= 1 ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  progress >= 1 ? "text-green-800" : "text-gray-500"
                }`}
              >
                Reading RFID Tag
              </span>
            </div>
            {progress >= 1 && (
              <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in" />
            )}
          </div>

          {/* Item 2: Weight */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 
                ${
                  progress >= 2
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100 opacity-50"
                }`}
          >
            <div className="flex items-center gap-3">
              <Weight
                className={`w-5 h-5 ${
                  progress >= 2 ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  progress >= 2 ? "text-green-800" : "text-gray-500"
                }`}
              >
                Measuring Weight
              </span>
            </div>
            {progress >= 2 && (
              <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in" />
            )}
          </div>

          {/* Item 3: Height */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 
                ${
                  progress >= 3
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-100 opacity-50"
                }`}
          >
            <div className="flex items-center gap-3">
              <Ruler
                className={`w-5 h-5 ${
                  progress >= 3 ? "text-green-600" : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  progress >= 3 ? "text-green-800" : "text-gray-500"
                }`}
              >
                Calibrating Height
              </span>
            </div>
            {progress >= 3 && (
              <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in" />
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 animate-pulse">
          Do not remove goat from chute...
        </p>
      </div>
    </div>
  );
}

export default ScanningData;
