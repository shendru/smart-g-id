// src/lib/signal.js

// CONFIGURATION
// Ideally, put this in a .env file later (e.g., process.env.REACT_APP_ESP32_IP)
const ESP32_IP = "http://10.15.33.35"; 

/**
 * Triggers the ESP32 to take a photo and returns the Base64 image data.
 * @returns {Promise<string>} The base64 image string (data:image/jpeg;base64,...)
 */
export const captureImage = async () => {
  try {
    console.log(`Signal: Sending capture request to ${ESP32_IP}...`);
    
    // 1. Send Request
    // We use a timeout signal so the app doesn't freeze if ESP32 is offline
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${ESP32_IP}/capture`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ESP32 Error: ${response.statusText}`);
    }

    // 2. Parse JSON
    const data = await response.json();
    
    if (data.status !== "ok") {
      throw new Error("ESP32 reported an internal error.");
    }

    // 3. Return the image string
    return data.image;

  } catch (error) {
    console.error("Signal Error:", error);
    throw error; // Re-throw so the UI knows something failed
  }
};