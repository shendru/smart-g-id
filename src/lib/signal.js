// ==========================================
// CONFIGURATION
// ==========================================
const CAMERA_IP = "http://10.15.33.35"; 
const SENSOR_IP = "http://192.168.1.106"; 

// ==========================================
// HELPERS
// ==========================================
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// CAMERA FUNCTION
// ==========================================
export const captureImage = async () => {
  try {
    console.log(`Signal: Sending capture request to ${CAMERA_IP}...`);
    
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
// SENSOR FUNCTION (Updated with Abort Logic)
// ==========================================
/**
 * Polls the Sensor ESP32.
 * @param {AbortSignal} [abortSignal] - Allows the caller to stop the loop
 */
export const waitForSensorData = async (abortSignal) => {
  console.log(`Signal: Starting poll for sensor data at ${SENSOR_IP}...`);

  while (true) {
    // 1. CHECK IF CANCELLED
    if (abortSignal?.aborted) {
      console.log("Signal: Polling stopped by user/timeout.");
      throw new Error("Polling cancelled");
    }

    try {
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
      // Ignore connection errors and keep retrying...
      // UNLESS the main signal was aborted during the fetch
      if (abortSignal?.aborted) throw new Error("Polling cancelled");
    }

    // 2. Wait 1 second before asking again
    await wait(1000);
  }
};