import { useEffect, useState, useRef } from "react";
import captureGif from "../../assets/capturing.gif";
import { captureImage } from "../../lib/signal.js";
import { RefreshCw, CheckCircle, ArrowRight } from "lucide-react"; // Import Icons

// Helper to pause execution
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Capturing({ setStep, saveData }) {
  const [status, setStatus] = useState("Initializing Camera Connection...");
  const [progress, setProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);
  const [isComplete, setIsComplete] = useState(false); // New state for completion
  const [retryTrigger, setRetryTrigger] = useState(0); // To trigger re-runs

  const hasRun = useRef(false);

  useEffect(() => {
    // Reset flags on retry
    if (hasRun.current) return;
    hasRun.current = true;

    const runSequence = async () => {
      try {
        setIsComplete(false);
        const localImages = [];

        // --- LOOP 4 TIMES ---
        for (let i = 1; i <= 4; i++) {
          setStatus(`Steady... Capturing Angle ${i}/4`);
          await wait(1000);

          try {
            const base64Img = await captureImage();

            // 1. Update Local Array
            localImages.push(base64Img);

            // 2. Update React State
            setCapturedImages([...localImages]);

            setProgress(i * 25);
          } catch (err) {
            console.error(err);
            setStatus(`Error on Angle ${i}. Retrying...`);
            await wait(2000);
            i--; // Retry this index
            continue;
          }

          // Rotation Pause (except after last shot)
          if (i < 4) {
            setStatus("ROTATE GOAT NOW! (5s)");
            await wait(5000);
          }
        }

        // --- FINISH SEQUENCE ---
        setStatus("Sequence Complete! Review Images.");

        // Save locally immediately so data isn't lost
        if (saveData) {
          saveData(localImages);
        } else {
          localStorage.setItem("goat_photos", JSON.stringify(localImages));
        }

        setIsComplete(true); // Show the buttons
      } catch (error) {
        console.error("Sequence failed:", error);
        setStatus("System Error. Check Console.");
      }
    };

    runSequence();
  }, [saveData, retryTrigger]); // Re-run when retryTrigger changes

  // --- HANDLERS ---
  const handleRetry = () => {
    setCapturedImages([]);
    setProgress(0);
    setStatus("Restarting Camera...");
    setIsComplete(false);
    hasRun.current = false; // Allow useEffect to run again
    setRetryTrigger((prev) => prev + 1);
  };

  const handleFinish = () => {
    setStep(5); // Move to next step manually
  };

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md overflow-hidden relative">
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
        {/* GIF Container - Hide when complete to reduce clutter */}
        {!isComplete && (
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
        )}

        {/* Status Text */}
        <h3
          className={`font-bold text-xl mb-2 flex items-center gap-2 transition-colors duration-300
            ${status.includes("Error") ? "text-red-500" : "text-[#4A6741]"}`}
        >
          {status}
        </h3>

        {!isComplete && (
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-6">
            {status.includes("ROTATE")
              ? ">>> PLEASE ROTATE SUBJECT <<<"
              : "DO NOT MOVE THE GOAT"}
          </p>
        )}

        {/* Progress Bar (Hide when complete) */}
        {!isComplete && (
          <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden mb-8">
            <div
              className="bg-[#4A6741] h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* === LIVE IMAGE PREVIEW GRID === */}
        <div
          className={`grid grid-cols-4 gap-2 w-full max-w-md ${
            isComplete ? "mb-8" : ""
          }`}
        >
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
                <img
                  src={capturedImages[index]}
                  alt={`Angle ${index + 1}`}
                  className="w-full h-full object-cover animate-in fade-in zoom-in duration-300"
                />
              ) : (
                <span className="text-xs text-gray-300 font-bold">
                  {index + 1}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* === ACTION BUTTONS (Only show when complete) === */}
        {isComplete && (
          <div className="flex gap-4 w-full max-w-md animate-in slide-in-from-bottom-4 fade-in">
            {/* RETRY BUTTON */}
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-95"
            >
              <RefreshCw className="w-5 h-5" />
              Retake All
            </button>

            {/* FINISH BUTTON */}
            <button
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#4A6741] text-white rounded-xl font-bold shadow-lg hover:bg-[#3a5233] transition-all active:scale-95 hover:shadow-xl"
            >
              Finish & Save
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Capturing;
