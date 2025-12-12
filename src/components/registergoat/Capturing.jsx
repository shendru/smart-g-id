import { useEffect, useState } from "react";
import captureGif from "../../assets/capturing.gif";
import { Camera, Zap } from "lucide-react";

function Capturing({ setStep }) {
  const [status, setStatus] = useState("Initializing Camera...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Progress Bar Logic (Updates every 100ms to reach 100% in 10s)
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        return prev + 1;
      });
    }, 100); // 100 steps * 100ms = 10,000ms (10s)

    // 2. Simulated Hardware Status Messages
    const statusTimers = [
      setTimeout(() => setStatus("Adjusting ISO and Focus..."), 2000),
      setTimeout(() => setStatus("Capturing Front Profile..."), 4500),
      setTimeout(() => setStatus("Capturing Side Profile..."), 7000),
      setTimeout(() => setStatus("Uploading to Database..."), 9000),
    ];

    // 3. Move to Next Step (Complete)
    const finishTimer = setTimeout(() => {
      setStep(5); // IMPORTANT: Moving to Step 5 (Complete Screen)
    }, 10000);

    // Cleanup
    return () => {
      clearInterval(progressTimer);
      clearTimeout(finishTimer);
      statusTimers.forEach(clearTimeout);
    };
  }, [setStep]);

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md overflow-hidden relative">
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        {/* The GIF Container */}
        <div className="relative mb-8">
          {/* Decorative ring */}
          <div className="absolute -inset-4 border-2 border-dashed border-[#4A6741]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>

          <div className="p-4 rounded-full bg-[#F5F1E8]">
            <img
              src={captureGif}
              alt="scanning"
              className="h-32 w-32 object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <h3 className="text-[#4A6741] font-bold text-xl mb-2 flex items-center gap-2">
          {status}
        </h3>

        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">
          Do not move the goat
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#4A6741] h-2.5 rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Percentage Text */}
        <p className="text-xs text-[#4A6741] mt-2 font-mono">{progress}%</p>
      </div>
    </div>
  );
}

export default Capturing;
