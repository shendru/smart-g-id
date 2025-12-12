import { useEffect, useState, useRef } from "react";
import {
  Loader2,
  CheckCircle2,
  Ruler,
  Weight,
  ScanLine,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { waitForSensorData } from "../../lib/signal.js";

// Simple helper for animation delays
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function ScanningData({ setStep }) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [retryTrigger, setRetryTrigger] = useState(0); // Used to force re-run

  const abortControllerRef = useRef(null);

  useEffect(() => {
    // 1. Reset State on Start
    setError(false);
    setProgress(0);

    // 2. Create a new AbortController for this specific attempt
    abortControllerRef.current = new AbortController();
    const currentSignal = abortControllerRef.current.signal;

    const syncHardware = async () => {
      try {
        console.log("Starting 20s Scan Window...");

        // --- PHASE 1: POLLING WITH 20s TIMEOUT ---
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 20000)
        );

        // Pass 'currentSignal' to waitForSensorData
        const data = await Promise.race([
          waitForSensorData(currentSignal),
          timeoutPromise,
        ]);

        // --- PHASE 2: SAVE DATA ---
        console.log("Saving Sensor Data:", data);
        localStorage.setItem(
          "goat_data",
          JSON.stringify({
            uid: data.uid,
            weight: data.weight,
            height: data.height,
          })
        );

        // --- PHASE 3: ANIMATION ---
        setProgress(1);
        await wait(600);
        setProgress(2);
        await wait(600);
        setProgress(3);
        await wait(800);

        // --- PHASE 4: FINISH ---
        setStep(3);
      } catch (err) {
        console.error("Sync failed:", err);
        // Only show error if we haven't unmounted/reset
        if (!currentSignal.aborted) {
          setError(true);
        }
      }
    };

    syncHardware();

    // CLEANUP: Stop the loop if user leaves or clicks retry
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [setStep, retryTrigger]);

  // --- RETRY HANDLER ---
  const handleRetry = () => {
    setError(false); // Hide error screen immediately
    setProgress(0); // Reset progress
    setRetryTrigger((prev) => prev + 1); // Trigger useEffect again
  };

  return (
    <div
      className={`rounded-xl bg-white border-2 shadow-md transition-colors duration-300
        ${error ? "border-red-200" : "border-[#4A6741]/20"}`}
    >
      <div className="p-8 mt-8 flex flex-col items-center w-full max-w-sm mx-auto min-h-[400px]">
        {/* === ERROR VIEW === */}
        {error ? (
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 rounded-full bg-red-50 mb-6">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>

            <h3 className="text-red-600 font-bold text-xl mb-2">Scan Failed</h3>
            <p className="text-center text-gray-500 text-sm mb-8 px-4">
              We couldn't detect the sensor data in time (20s). Please check if
              the hardware is powered on.
            </p>

            <button
              onClick={handleRetry}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-all active:scale-95 shadow-lg shadow-red-200"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          </div>
        ) : (
          /* === LOADING VIEW === */
          <>
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-[#4A6741]/10 rounded-full animate-ping"></div>
              <div className="relative p-4 bg-white rounded-full border-2 border-[#4A6741]/20">
                <Loader2 className="w-12 h-12 text-[#4A6741] animate-spin" />
              </div>
            </div>

            <h3 className="text-[#4A6741] font-bold text-xl mb-6">
              {progress === 0 ? "Waiting for Tag Scan..." : "Syncing Data..."}
            </h3>

            {/* Checklist items */}
            <div className="w-full space-y-4">
              <div
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
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
                    RFID Tag Detected
                  </span>
                </div>
                {progress >= 1 && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in" />
                )}
              </div>

              <div
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
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
                    Weight Captured
                  </span>
                </div>
                {progress >= 2 && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in" />
                )}
              </div>

              <div
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-500 ${
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
                    Height Calibrated
                  </span>
                </div>
                {progress >= 3 && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in" />
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-6 animate-pulse">
              {progress === 0
                ? "Please scan RFID tag on the reader..."
                : "Do not remove goat from chute..."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ScanningData;
