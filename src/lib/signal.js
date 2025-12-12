// ==========================================
// CONFIGURATION
// ==========================================
const CAMERA_IP = "http://10.15.33.35"; 
const SENSOR_IP = "http://192.168.1.106"; 

// Helper
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// CAMERA FUNCTION
// ==========================================
export const captureImage = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); 

    const response = await fetch(`${CAMERA_IP}/capture`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Camera Error: ${response.statusText}`);
    const data = await response.json();
    if (data.status !== "ok") throw new Error("Camera reported internal error.");

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
    // 1. Check if the UI Cancelled/Timed Out
    if (abortSignal?.aborted) {
      throw new Error("Polling cancelled by timeout");
    }

    try {
      // 2. Short request timeout (2s) so we don't hang
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); 

      const response = await fetch(`${SENSOR_IP}/get-data`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.status === "ok") {
          console.log("Signal: Sensor Data Received!", data);
          return {
            uid: data.uid,
            weight: data.weight,
            height: data.height
          };
        }
      }
    } catch (error) {
      // IMPORTANT: We swallow errors here so the loop DOES NOT break.
      // We only break if the MAIN abortSignal says so.
      // console.warn("Sensor not ready yet..."); 
    }

    // 3. Wait 1 second before retrying
    await wait(1000);
  }
};