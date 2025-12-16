import { useEffect, useState, useRef } from "react";
import captureGif from "../../assets/capturing.gif";
import { captureImage } from "../../lib/signal.js";
import { RefreshCw, ArrowRight, Loader2 } from "lucide-react";

// 1. IMPORT YOUR CENTRALIZED API
import { api } from "../../lib/data.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Capturing({ setStep, saveData }) {
  const [status, setStatus] = useState("Initializing Camera Connection...");
  const [progress, setProgress] = useState(0);
  const [capturedImages, setCapturedImages] = useState([]);

  const [isComplete, setIsComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0);

  const hasRun = useRef(false);

  // ... (useEffect logic stays exactly the same) ...
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runSequence = async () => {
      try {
        setIsComplete(false);
        const localImages = [];

        for (let i = 1; i <= 4; i++) {
          setStatus(`[CoreXY] Aligning Gantry to Vector ${i}/4...`);
          await wait(1500);

          setStatus(`Optical Lock Acquired. Capturing Frame ${i}...`);
          await wait(500);

          try {
            const base64Img = await captureImage();
            localImages.push(base64Img);
            setCapturedImages([...localImages]);
            setProgress(i * 25);
          } catch (err) {
            console.error(err);
            setStatus(`[ERR] Sensor Fault on Vector ${i}. Retrying...`);
            await wait(2000);
            i--;
            continue;
          }

          if (i < 4) {
            setStatus(
              `Sequence Pending... Actuating Motors to Quadrant ${i + 1}`
            );
            await wait(2000);
          }
        }

        setStatus("Scan Logic Complete. Parking Sensors.");

        if (saveData) {
          saveData(localImages);
        } else {
          localStorage.setItem("goat_photos", JSON.stringify(localImages));
        }

        setIsComplete(true);
      } catch (error) {
        console.error("Sequence failed:", error);
        setStatus("System Critical Error. Check Console.");
      }
    };

    runSequence();
  }, [saveData, retryTrigger]);

  const handleRetry = () => {
    setCapturedImages([]);
    setProgress(0);
    setStatus("Restarting Camera...");
    setIsComplete(false);
    hasRun.current = false;
    setRetryTrigger((prev) => prev + 1);
  };

  // === 2. REFACTORED FINISH HANDLER ===
  const handleFinish = async () => {
    setIsUploading(true);
    setStatus("Uploading Data to Server...");

    try {
      // Get Data from LocalStorage
      const registrationData = JSON.parse(
        localStorage.getItem("goat_registration_data") || "{}"
      );
      const userToken = JSON.parse(localStorage.getItem("user_token") || "{}");

      if (!userToken._id) throw new Error("User not logged in (Missing ID)");

      // Construct Payload
      const payload = {
        ...registrationData,
        owner: userToken._id,
        photos: capturedImages,
      };

      console.log("🚀 Sending Payload via api.goats.add:", payload);

      // --- NEW CLEAN CALL ---
      // No need to check response.ok or do .json(), data.js does it.
      const data = await api.goats.add(payload);

      console.log("✅ Success:", data);
      setStatus("Upload Successful!");

      // Move to Final Screen
      setStep(5);
    } catch (error) {
      console.error("Upload Error:", error);
      setStatus(`Upload Failed: ${error.message}`);
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md overflow-hidden relative">
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
        {/* GIF Container */}
        {!isComplete && (
          <div className="relative mb-6">
            <div
              className={`absolute -inset-4 border-2 border-dashed border-[#4A6741]/30 rounded-full ${
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
          className={`font-bold text-xl mb-2 flex items-center gap-2 transition-colors duration-300 text-center ${
            status.includes("Error") || status.includes("Failed")
              ? "text-red-500"
              : "text-[#4A6741]"
          }`}
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

        {/* Progress Bar */}
        {!isComplete && (
          <div className="w-full max-w-xs bg-gray-100 rounded-full h-2.5 overflow-hidden mb-8">
            <div
              className="bg-[#4A6741] h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Live Image Grid */}
        <div
          className={`grid grid-cols-4 gap-2 w-full max-w-md ${
            isComplete ? "mb-8" : ""
          }`}
        >
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`aspect-square rounded-md overflow-hidden border-2 flex items-center justify-center bg-gray-50 ${
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

        {/* Buttons */}
        {isComplete && (
          <div className="flex gap-4 w-full max-w-md animate-in slide-in-from-bottom-4 fade-in">
            <button
              onClick={handleRetry}
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5" /> Retake All
            </button>
            <button
              onClick={handleFinish}
              disabled={isUploading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#4A6741] text-white rounded-xl font-bold shadow-lg hover:bg-[#3a5233] transition-all active:scale-95 hover:shadow-xl disabled:opacity-70 disabled:cursor-wait"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" /> Finish & Save
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Capturing;
