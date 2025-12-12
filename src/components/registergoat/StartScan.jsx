import { Radio, Info } from "lucide-react";

function StartScan({ setStep }) {
  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
      <div className="p-5 flex flex-col items-center">
        {/* Main Icon */}
        <div className="p-6 rounded-full bg-[#F5F1E8] mb-6 relative">
          <Radio className="text-[#7A6E5C] h-16 w-16" />

          {/* Simulated Green LED Notification Badge */}
          <span className="absolute top-2 right-2 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </div>

        <h3 className="text-[#4A6741] font-bold text-xl mb-2">
          Initialize System
        </h3>

        {/* Step-by-Step Instructions */}
        <div className="text-center space-y-3 mb-8 max-w-sm">
          <p className="text-[#7A6E5C] text-sm">
            <span className="font-bold text-[#4A6741]">Step 1:</span> Secure the
            goat inside the chute.
          </p>
          <p className="text-[#7A6E5C] text-sm">
            <span className="font-bold text-[#4A6741]">Step 2:</span> Wait for
            the <span className="font-bold text-green-600">Green LED</span> on
            the hardware to light up (RFID Detected).
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 w-full max-w-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 text-left">
            Do not proceed until the hardware light is green. This ensures the
            Tag ID is locked.
          </p>
        </div>

        {/* Action Button */}
        <button
          className="w-full bg-[#4A6741] hover:bg-[#3a5233] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
          onClick={() => setStep(2)}
        >
          Start Process
        </button>
      </div>
    </div>
  );
}

export default StartScan;
