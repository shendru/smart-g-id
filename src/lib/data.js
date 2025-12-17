const BASE_URL = "http://10.10.108.187:5000";

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

  market: {
    // 1. Fetch inventory for the specific User (Inventory Page)
    list: async (userId) => {
      const response = await fetch(`${BASE_URL}/get-goats/${userId}`);
      return handleResponse(response);
    },

    // 2. NEW: Fetch ALL goats (Public Marketplace)
    // No userId required. This hits the endpoint that returns everything.
    getAll: async () => {
      const response = await fetch(`${BASE_URL}/goats`);
      return handleResponse(response);
    },

    // 3. Update listing details
    updateListing: async (goatId, salesData) => {
      const response = await fetch(`${BASE_URL}/update-goat/${goatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(salesData),
      });
      return handleResponse(response);
    },
  },

  farms: {
    list: async () => {
      // This matches the backend endpoint we discussed (/api/farms)
      const response = await fetch(`${BASE_URL}/api/farms`);
      return handleResponse(response);
    },

    // Optional: Get specific farm details + their goats
    get: async (farmId) => {
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}`);
      return handleResponse(response);
    },
  },

  farms: {
    // 1. List all farms
    list: async () => {
      const response = await fetch(`${BASE_URL}/api/farms`);
      return handleResponse(response);
    },

    // 2. Get specific farm details
    // THIS IS THE MISSING PIECE FOR YOUR STORE.JSX
    get: async (farmId) => {
      // Ensure your backend has a route: router.get('/:id', ...)
      const response = await fetch(`${BASE_URL}/api/farms/${farmId}`);
      return handleResponse(response);
    },
  },

  // --- PLACEHOLDER FOR FUTURE ENDPOINTS ---
  // goats: { ... },
  // sales: { ... }
};
