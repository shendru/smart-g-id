const BASE_URL = "http://172.21.192.1:5000";

// Helper to handle the response logic repeatedly
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || "API Request Failed");
  }

  // === CENTRALIZED DATA NORMALIZATION ===
  // We do the cleanup here so the UI doesn't have to worry about it.
  // If the backend returns { user: ... }, we return that. 
  // If it returns the raw object, we return that.
  return data.user ? data.user : data;
};

export const api = {
  // --- AUTH ENDPOINTS ---
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    },

    register: async (formData) => {
      // formData should include: email, farmName, address, password
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      return handleResponse(response);
    },
  },

  goats: {
    add: async (goatData) => {
      const response = await fetch(`${BASE_URL}/add-goat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goatData),
      });
      return handleResponse(response);
    },
    // List all (used in Home)
    list: async (userId) => {
      const response = await fetch(`${BASE_URL}/get-goats/${userId}`);
      return handleResponse(response);
    },

    // Get Single Profile
    get: async (goatId) => {
      const response = await fetch(`${BASE_URL}/get-goat/${goatId}`);
      return handleResponse(response);
    },

    // Update Profile
    update: async (goatId, goatData) => {
      const response = await fetch(`${BASE_URL}/update-goat/${goatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(goatData),
      });
      return handleResponse(response);
    },

    // Delete Profile
    delete: async (goatId) => {
      const response = await fetch(`${BASE_URL}/delete-goat/${goatId}`, {
        method: "DELETE",
      });
      // Delete often returns just a success message, but we run it through handleResponse to catch errors
      return handleResponse(response);
    },
  },

  // --- PLACEHOLDER FOR FUTURE ENDPOINTS ---
  // goats: { ... },
  // sales: { ... }
};