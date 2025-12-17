import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, ChevronRight, Store, User } from "lucide-react";
import { api } from "../../lib/data"; // Ensure you have an endpoint for this
import MarketNav from "../../components/marketplace/MarketNav";

// Consistent Banner Placeholder
const FARM_BANNER_PLACEHOLDER =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000&auto=format&fit=crop";

function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        // You'll need to create this endpoint (e.g., /api/users/farms)
        const data = await api.farms.list();
        setFarms(data);
      } catch (error) {
        console.error("Failed to load farms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  // Filter logic
  const filteredFarms = farms.filter((farm) => {
    const term = searchTerm.toLowerCase();
    return (
      (farm.farmName && farm.farmName.toLowerCase().includes(term)) ||
      (farm.address && farm.address.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MarketNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Registered Farms
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Connect with verified breeders and local goat farms.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-[#4A6741] font-medium animate-pulse">
              Loading farms...
            </div>
          </div>
        ) : (
          /* Grid Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFarms.length > 0 ? (
              filteredFarms.map((farm) => (
                <Link
                  key={farm._id}
                  to={`/market/farm/${farm._id}`} // Added /market/ prefix here
                  className="..."
                >
                  {/* Card Banner */}
                  <div className="h-24 bg-gray-100 relative overflow-hidden">
                    <img
                      src={FARM_BANNER_PLACEHOLDER}
                      alt="Banner"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Card Content */}
                  <div className="p-5 pt-0 flex-1 flex flex-col relative">
                    {/* Avatar (Floating) */}
                    <div className="flex justify-between items-end -mt-8 mb-3">
                      <div className="w-16 h-16 bg-white rounded-xl p-1 shadow-sm">
                        <div className="w-full h-full bg-[#4A6741] rounded-lg flex items-center justify-center text-white text-xl font-bold border-2 border-white">
                          {farm.farmName ? (
                            farm.farmName.charAt(0)
                          ) : (
                            <User className="w-6 h-6" />
                          )}
                        </div>
                      </div>

                      {/* Optional: "Verified" Badge */}
                      <span className="bg-green-50 text-[#4A6741] text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border border-green-100">
                        Verified
                      </span>
                    </div>

                    {/* Farm Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-[#4A6741] transition-colors line-clamp-1">
                        {farm.farmName || "Unnamed Farm"}
                      </h3>

                      <div className="flex items-start gap-1.5 mt-2 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                        <span className="line-clamp-2">
                          {farm.address || "Location not listed"}
                        </span>
                      </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Store className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-medium">View Store</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#4A6741] group-hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                  <Store className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-gray-900 font-medium">No farms found</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Maybe there's an error
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Farms;
