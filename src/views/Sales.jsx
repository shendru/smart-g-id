import React, { useEffect, useState, useCallback } from "react";
import SalesCard from "../components/sales/SalesCard";
import { Search, Filter, RefreshCcw, Sprout, ShoppingBag } from "lucide-react"; // Added ShoppingBag/Sprout
import { api } from "../lib/data";

function Sales() {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Helper to get User ID
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user_token"));
      return user ? user._id : null;
    } catch (e) {
      console.error("Error parsing user from local storage", e);
      return null;
    }
  };

  // Fetch Market Data
  const fetchMarketData = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.market.list(userId);
      setGoats(data);
    } catch (error) {
      console.error("Error fetching market inventory:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Handle Updates from Child
  const handleLocalUpdate = (updatedGoat) => {
    setGoats((prevGoats) =>
      prevGoats.map((goat) =>
        goat._id === updatedGoat._id ? updatedGoat : goat
      )
    );
  };

  // Filter Logic
  const filteredGoats = goats.filter((goat) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      goat.name.toLowerCase().includes(searchLower) ||
      goat.rfidTag.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      {/* === NEW STICKY HEADER === */}
      <div className="bg-white border-b-2 border-[#4A6741]/10 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-20 py-4 md:py-0 gap-4">
            {/* Left: Branding & Title */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-[#4A6741] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />{" "}
                {/* Changed Icon to represent Market */}
                Marketplace
              </h1>
              <p className="text-xs text-[#7A6E5C] font-medium">
                Manage visible stock & prices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT === */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A6741] mb-2"></div>
            <p>Loading inventory...</p>
          </div>
        ) : filteredGoats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGoats.map((goat) => (
              <SalesCard
                key={goat._id}
                goat={goat}
                onUpdate={handleLocalUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium">No goats found</h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search terms.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Sales;
