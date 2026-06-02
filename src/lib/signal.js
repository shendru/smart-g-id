// ==========================================
// CONFIGURATION
// ==========================================
// Add the port number configured in the Flask Python script
const SENSOR_IP = "http://10.173.240.246:5000";

// Helper
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_GOAT_IMAGES = [
  "/assets/goats/goat1.jpg",
  "/assets/goats/goat2.jpg",
  "/assets/goats/goat3.jpg",
  "/assets/goats/goat4.jpg",
];

// ==========================================
// CAMERA FUNCTION
// ==========================================
export const captureImage = async () => {
  console.log("Mock Signal: Simulating camera capture...");

  try {
    await wait(800);
    const randomIndex = Math.floor(Math.random() * MOCK_GOAT_IMAGES.length);
    const selectedImage = MOCK_GOAT_IMAGES[randomIndex];
    console.log("Mock Signal: Goat captured successfully!");
    return selectedImage;
  } catch (error) {
    console.error("Mock Signal (Camera) Error:", error.message);
    throw error;
  }
};

// ==========================================
// SENSOR FUNCTION
// ==========================================
export const waitForSensorData = async (abortSignal) => {
  console.log(`Signal: Starting poll for hardware data at ${SENSOR_IP}...`);

  while (true) {
    if (abortSignal?.aborted) throw new Error("Polling cancelled by timeout");

    let timeoutId;
    try {
      const controller = new AbortController();

      // CRITICAL FIX: Increased timeout to 40 seconds (40000ms).
      // The Pi might take up to 30 seconds to stabilize the weight reading.
      timeoutId = setTimeout(() => controller.abort(), 40000);

      console.log("Signal: Fetching weight from Raspberry Pi...");

      const response = await fetch(`${SENSOR_IP}/get-data`, {
        method: "GET",
        signal: controller.signal,
      });

      if (response.ok) {
        const data = await response.json(); // Cleanly parse JSON directly

        if (data.status === "ok") {
          const mockUid = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();

          console.log(
            `Signal: Success! Mock UID: ${mockUid}, Real Weight: ${data.weight}`,
          );

          return {
            uid: mockUid,
            weight: data.weight,
          };
        }
      }
    } catch (error) {
      console.error("Signal Loop Error:", error.message);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }

    // Wait 1 second before polling the Pi again
    await wait(1000);
  }
};
