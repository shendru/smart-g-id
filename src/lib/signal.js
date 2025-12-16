// ==========================================
// CONFIGURATION
// ==========================================
const CAMERA_IP = "http://10.109.254.35";
const SENSOR_IP = "http://10.109.254.48";

// Helper
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================
// CAMERA FUNCTION
// ==========================================
export const captureImage = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${CAMERA_IP}/capture`, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Camera Error: ${response.statusText}`);
    const data = await response.json();
    if (data.status !== "ok")
      throw new Error("Camera reported internal error.");

    return data.image;
  } catch (error) {
    console.error("Signal (Camera) Error:", error);
    throw error;
  }
};

// ==========================================
// SENSOR FUNCTION (Fixing the Loop Crash)
// ==========================================
export const waitForSensorData = async (abortSignal) => {
  console.log(`Signal: Starting poll for sensor data at ${SENSOR_IP}...`);

  while (true) {
    if (abortSignal?.aborted) throw new Error("Polling cancelled by timeout");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      // 1. Log that we are trying to fetch
      console.log("Signal: Fetching...");

      const response = await fetch(`${SENSOR_IP}/get-data`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // 2. Log the raw status
      console.log(`Signal: Response Status: ${response.status}`);

      if (response.ok) {
        // 3. Log the raw text BEFORE parsing JSON (Catches format errors)
        const textData = await response.text();
        console.log("Signal: Raw Body:", textData);

        const data = JSON.parse(textData);
        if (data.status === "ok") {
          return { uid: data.uid, weight: data.weight, height: data.height };
        }
      }
    } catch (error) {
      // === CRITICAL DEBUG LOG ===
      // This will tell us WHY React rejected the data
      console.error("Signal Loop Error:", error);
    }

    await wait(1000);
  }
};
