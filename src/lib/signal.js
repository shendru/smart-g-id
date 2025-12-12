// ==========================================
// CONFIGURATION
// ==========================================

// 1. ESP32-CAM (Camera) IP Address
const CAMERA_IP = "http://10.15.33.35"; 

// 2. ESP32-SENSOR (RFID/Weight/Height) IP Address
// CHECK YOUR SERIAL MONITOR FOR THIS IP!
const SENSOR_IP = "http://192.168.1.106"; 


// ==========================================
// HELPERS
// ==========================================
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// ==========================================
// CAMERA FUNCTION (Step 4)
// ==========================================
/**
 * Triggers the ESP32-CAM to take a photo.
 * @returns {Promise<string>} Base64 image string
 */
export const captureImage = async () => {
  try {
    console.log(`Signal: Sending capture request to ${CAMERA_IP}...`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
// SENSOR FUNCTION (Step 2)
// ==========================================
/**
 * Polls the Sensor ESP32 every 1 second until a tag is scanned.
 * @returns {Promise<Object>} { uid, weight, height }
 */
export const waitForSensorData = async () => {
  console.log(`Signal: Starting poll for sensor data at ${SENSOR_IP}...`);

  // Loop forever until we get valid data
  while (true) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout

      const response = await fetch(`${SENSOR_IP}/get-data`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        // If status is "ok", the user scanned a card!
        if (data.status === "ok") {
          console.log("Signal: Sensor Data Received!", data);
          return {
            uid: data.uid,
            weight: data.weight,
            height: data.height
          };
        }
        // If status is "waiting", just loop again...
      }

    } catch (error) {
      console.warn("Signal: Sensor not connected yet...", error);
    }

    // Wait 1 second before asking again
    await wait(1000);
  }
};