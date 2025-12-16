import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Filter, ArrowRight, ChevronDown } from "lucide-react";
import { api } from "../../lib/data";
import MarketNav from "../../components/marketplace/MarketNav";

function Goats() {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest"); // newest, price-low, price-high

  useEffect(() => {
    const fetchGoats = async () => {
      try {
        // Uses your existing endpoint that filters { isForSale: true }
        const data = await api.goats.list();
        setGoats(data);
      } catch (error) {
        console.error("Failed to load goats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoats();
  }, []);

  // Filter & Sort Logic
  const filteredGoats = goats
    .filter((goat) => {
      const term = searchTerm.toLowerCase();
      return (
        goat.name.toLowerCase().includes(term) ||
        goat.breed.toLowerCase().includes(term) ||
        (goat.farmName && goat.farmName.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      if (sortOption === "price-low") return a.price - b.price;
      if (sortOption === "price-high") return b.price - a.price;
      // Default to newest (assuming listedAt exists, otherwise fallback to ID)
      return new Date(b.listedAt) - new Date(a.listedAt);
    });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MarketNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* === Header & Controls === */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Browse Goats
            </h1>
            <p className="text-gray-500 mt-2 max-w-xl">
              Discover healthy, verified goats from local breeders. All listings
              are vetted for quality and authenticity.
            </p>
          </div>
        </div>

        {/* === Content Grid === */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#4A6741] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading marketplace...</p>
          </div>
        ) : filteredGoats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGoats.map((goat) => (
              <GoatCard key={goat._id} goat={goat} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No goats found</h3>
            <p className="text-gray-500 mt-1">
              We couldn't find any listings matching your search.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSortOption("newest");
              }}
              className="mt-4 text-[#4A6741] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Reusable Card Component for Consistency
function GoatCard({ goat }) {
  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(goat.price);

  return (
    <Link
      to={`/product/${goat._id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
        <img
          src={
            goat.mainPhoto || "https://via.placeholder.com/400?text=No+Image"
          }
          alt={goat.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="self-start px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-[#4A6741] shadow-sm uppercase tracking-wide">
            {goat.breed}
          </span>
          {goat.gender && (
            <span
              className={`self-start px-2.5 py-1 backdrop-blur-sm rounded-lg text-xs font-bold shadow-sm capitalize 
              ${
                goat.gender === "Female"
                  ? "bg-pink-100/90 text-pink-700"
                  : "bg-blue-100/90 text-blue-700"
              }`}
            >
              {goat.gender}
            </span>
          )}
        </div>
      </div>

      {/* Info Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-[#4A6741] transition-colors">
            {goat.name}
          </h3>
        </div>

        {/* Farm / Location Info */}
        <div className="flex flex-col gap-1 mb-4">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            {goat.farmName || "Verified Seller"}
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" />
            <span className="truncate">
              {goat.ownerAddress || "Philippines"}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <span className="text-lg font-bold text-[#4A6741]">
            {formattedPrice}
          </span>
          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 group-hover:bg-[#4A6741] group-hover:text-white transition-colors">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default Goats;
