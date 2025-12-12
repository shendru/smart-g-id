import { useEffect, useState, useRef } from "react";
import captureGif from "../../assets/capturing.gif";
import { captureImage } from "../../lib/signal.js"; // Import our new helper

// Helper to pause execution (for rotation time)
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Capturing({ setStep, saveData }) {
  const [status, setStatus] = useState("Initializing Camera Connection...");
  const [progress, setProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);

  // Use a ref to ensure the sequence only runs once on mount
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runSequence = async () => {
      try {
        const images = [];

        // --- LOOP 4 TIMES ---
        for (let i = 1; i <= 4; i++) {
          // 1. PREPARE
          setStatus(`Steady... Capturing Angle ${i}/4`);
          await wait(1000); // Give user 1s to settle hands

          // 2. REAL CAPTURE (Calls ESP32)
          try {
            const base64Img = await captureImage();
            images.push(base64Img);

            // Update Progress (25% per shot)
            setProgress(i * 25);
          } catch (err) {
            console.error(err);
            setStatus(`Error on Angle ${i}. Retrying...`);
            await wait(2000);
            i--; // Decrement to retry this angle
            continue;
          }

          // 3. ROTATION PAUSE (Skip after the last one)
          if (i < 4) {
            setStatus("ROTATE GOAT NOW! (5s)");

            // Optional: Countdown logic in text could go here
            await wait(5000);
          }
        }

        // --- FINISH ---
        setStatus("Processing Data...");
        await wait(1000);

        // Save the images to parent or local storage
        if (saveData) {
          saveData(images);
        } else {
          console.log("Captured Images:", images);
          // Temporary: Save to local storage so Step 5 can read it
          localStorage.setItem("goat_photos", JSON.stringify(images));
        }

        setStatus("Upload Complete!");
        await wait(1000);
        setStep(5); // Move to "Complete" screen
      } catch (error) {
        console.error("Sequence failed:", error);
        setStatus("System Error. Check Console.");
      }
    };

    runSequence();
  }, [setStep, saveData]);

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md overflow-hidden relative">
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
        {/* The GIF Container */}
        <div className="relative mb-8">
          {/* Decorative ring (Speed depends on status) */}
          <div
            className={`absolute -inset-4 border-2 border-dashed border-[#4A6741]/30 rounded-full 
            ${
              status.includes("ROTATE")
                ? "animate-pulse"
                : "animate-[spin_10s_linear_infinite]"
            }`}
          ></div>

          <div className="p-4 rounded-full bg-[#F5F1E8]">
            <img
              src={captureGif}
              alt="scanning"
              className="h-32 w-32 object-contain mix-blend-multiply"
            />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <h3
          className={`font-bold text-xl mb-2 flex items-center gap-2 transition-colors duration-300
            ${status.includes("Error") ? "text-red-500" : "text-[#4A6741]"}`}
        >
          {status}
        </h3>

        {/* Dynamic Instructions */}
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">
          {status.includes("ROTATE")
            ? ">>> PLEASE ROTATE SUBJECT <<<"
            : "DO NOT MOVE THE GOAT"}
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#4A6741] h-2.5 rounded-full transition-all duration-500 ease-out"
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
