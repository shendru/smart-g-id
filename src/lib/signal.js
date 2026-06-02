// ==========================================
// CONFIGURATION
// ==========================================
// const CAMERA_IP = "http://10.10.108.66";
const SENSOR_IP = "http://10.10.108.237";

// Helper
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_GOAT_IMAGES = [
  "./assets/goats/goat1.jpg", 
  "./assets/goats/goat2.jpg", 
  "./assets/goats/goat3.jpg", 
  "./assets/goats/goat4.jpg"
];
// ==========================================
// CAMERA FUNCTION
// ==========================================
export const captureImage = async () => {
  console.log("Mock Signal: Simulating camera capture...");

  try {
    // 1. Simulate the time it takes for the camera to process and return an image
    await wait(800); 

    // 2. Randomly select one of the 4 goat images
    const randomIndex = Math.floor(Math.random() * MOCK_GOAT_IMAGES.length);
    const selectedImage = MOCK_GOAT_IMAGES[randomIndex];

    // 3. Optional: Simulate a random camera failure (10% chance) to test your UI error states
    // if (Math.random() < 0.1) {
    //   throw new Error("Camera reported internal error.");
    // }

    console.log("Mock Signal: Goat captured successfully!");
    return selectedImage;
    
  } catch (error) {
    console.error("Mock Signal (Camera) Error:", error.message);
    throw error;
  }
};

// ==========================================
// SENSOR FUNCTION (Fixing the Loop Crash)
// ==========================================
export const waitForSensorData = async (abortSignal) => {
  console.log(`Signal: Starting poll for hybrid sensor data at ${SENSOR_IP}...`);

  while (true) {
    // 1. Respect the abort signal
    if (abortSignal?.aborted) throw new Error("Polling cancelled by timeout");

    let timeoutId;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 2000);

      console.log("Signal: Fetching weight from Raspberry Pi...");

      // 2. Fetch from the REAL hardware
      const response = await fetch(`${SENSOR_IP}/get-data`, {
        method: "GET",
        signal: controller.signal,
      });

      if (response.ok) {
        const textData = await response.text();
        const data = JSON.parse(textData);

        if (data.status === "ok") {
          // 3. Generate the MOCK RFID
          const mockUid = Math.floor(100000 + Math.random() * 900000).toString();
          
          console.log(`Signal: Success! Mock UID: ${mockUid}, Real Weight: ${data.weight}`);

          // 4. Return the combined data
          return { 
            uid: mockUid, 
            weight: data.weight 
          };
        }
      }
    } catch (error) {
      console.error("Signal Loop Error:", error.message);
    } finally {
      // 5. Safely clean up the timeout to prevent memory leaks
      if (timeoutId) clearTimeout(timeoutId);
    }

    // Wait 1 second before polling the Pi again
    await wait(1000);
  }
};