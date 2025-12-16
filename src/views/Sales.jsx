import React, { useEffect, useState } from "react";
import axios from "axios";
import SalesCard from "../components/sales/SalesCard";
import { Search, Filter } from "lucide-react";

function Sales() {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Goats
  useEffect(() => {
    const fetchGoats = async () => {
      try {
        const token = localStorage.getItem("user_token");
        // Using your existing endpoint - we will filter in the UI for now
        const response = await axios.get("http://localhost:5000/api/goats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGoats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      }
    };
    fetchGoats();
  }, []);

  // 2. Filter Logic (Search by Name or Tag)
  const filteredGoats = goats.filter((goat) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      goat.name.toLowerCase().includes(searchLower) ||
      goat.rfidTag.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F1E8]">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#4A6741]">
              Marketplace Inventory
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage which goats are visible for sale and set their prices.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741] outline-none w-full md:w-64 text-sm"
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading inventory...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredGoats.map((goat) => (
              <SalesCard key={goat._id} goat={goat} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Sales;
