import { useEffect, useState, useRef } from "react";
import captureGif from "../../assets/capturing.gif";
import { captureImage } from "../../lib/signal.js";

// Helper to pause execution
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Capturing({ setStep, saveData }) {
  const [status, setStatus] = useState("Initializing Camera Connection...");
  const [progress, setProgress] = useState(0);
  // This state will hold the images for the UI to render
  const [capturedImages, setCapturedImages] = useState([]);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runSequence = async () => {
      try {
        const localImages = []; // Local array to track progress logic

        // --- LOOP 4 TIMES ---
        for (let i = 1; i <= 4; i++) {
          setStatus(`Steady... Capturing Angle ${i}/4`);
          await wait(1000);

          try {
            const base64Img = await captureImage();

            // 1. Update Local Array (for logic)
            localImages.push(base64Img);

            // 2. Update React State (for UI Rendering)
            setCapturedImages([...localImages]);

            setProgress(i * 25);
          } catch (err) {
            console.error(err);
            setStatus(`Error on Angle ${i}. Retrying...`);
            await wait(2000);
            i--;
            continue;
          }

          if (i < 4) {
            setStatus("ROTATE GOAT NOW! (5s)");
            await wait(5000);
          }
        }

        setStatus("Processing Data...");
        await wait(1000);

        if (saveData) {
          saveData(localImages);
        } else {
          localStorage.setItem("goat_photos", JSON.stringify(localImages));
        }

        setStatus("Upload Complete!");
        await wait(1000);
        setStep(5);
      } catch (error) {
        console.error("Sequence failed:", error);
        setStatus("System Error. Check Console.");
      }
    };

    runSequence();
  }, [setStep, saveData]);

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md overflow-hidden relative">
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
        {" "}
        {/* Increased min-height */}
        {/* The GIF Container */}
        <div className="relative mb-6">
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
        {/* Status Text */}
        <h3
          className={`font-bold text-xl mb-2 flex items-center gap-2 transition-colors duration-300
            ${status.includes("Error") ? "text-red-500" : "text-[#4A6741]"}`}
        >
          {status}
        </h3>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">
          {status.includes("ROTATE")
            ? ">>> PLEASE ROTATE SUBJECT <<<"
            : "DO NOT MOVE THE GOAT"}
        </p>
        {/* Progress Bar */}
        <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden mb-8">
          <div
            className="bg-[#4A6741] h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        {/* === NEW: LIVE IMAGE PREVIEW GRID === */}
        <div className="grid grid-cols-4 gap-2 w-full max-w-md">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-md overflow-hidden border-2 flex items-center justify-center bg-gray-50
                ${
                  index < capturedImages.length
                    ? "border-[#4A6741]"
                    : "border-gray-200 dashed"
                }`}
            >
              {index < capturedImages.length ? (
                // Render Captured Image
                <img
                  src={capturedImages[index]}
                  alt={`Angle ${index + 1}`}
                  className="w-full h-full object-cover animate-in fade-in zoom-in duration-300"
                />
              ) : (
                // Render Placeholder
                <span className="text-xs text-gray-300 font-bold">
                  {index + 1}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Capturing;
