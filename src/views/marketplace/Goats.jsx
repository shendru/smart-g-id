import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ScanFace } from "lucide-react";
import { api } from "../../lib/data";
import MarketNav from "../../components/marketplace/MarketNav";

// 1. Define Backend URL
const BASE_URL = "http://localhost:5000";

function Goats() {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    const fetchGoats = async () => {
      try {
        const data = await api.market.getAll();
        // Filter client-side for "isForSale"
        const forSale = data.filter((g) => g.isForSale === true);
        setGoats(forSale);
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
      const name = goat.name?.toLowerCase() || "";
      const breed = goat.breed?.toLowerCase() || "";
      const farm = goat.farmName?.toLowerCase() || "";
      return name.includes(term) || breed.includes(term) || farm.includes(term);
    })
    .sort((a, b) => {
      if (sortOption === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortOption === "price-high") return (b.price || 0) - (a.price || 0);
      return (
        new Date(b.createdAt || b.listedAt) -
        new Date(a.createdAt || a.listedAt)
      );
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
              Discover healthy, verified goats from local breeders.
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredGoats.map((goat) => (
              <GoatCard key={goat._id} goat={goat} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 w-full col-span-full">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No goats found</h3>
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

// === FIXED GOAT CARD COMPONENT ===
function GoatCard({ goat }) {
  // Helper for Status Badge
  const isHealthy = goat.healthStatus && goat.healthStatus.includes("Healthy");

  // === 1. IMAGE PATH LOGIC ===
  // We prioritize 'mainPhoto' because that is what your Aggregation returns
  let rawPath =
    goat.mainPhoto || // <--- THIS IS THE FIX
    goat.mainPhotoPath ||
    (goat.images && goat.images[0]) ||
    goat.image;

  // Fix Windows Backslashes if present
  if (rawPath && typeof rawPath === "string") {
    rawPath = rawPath.replace(/\\/g, "/");
  }

  // Construct Final URL
  let fullImageUrl = null;
  if (rawPath) {
    if (rawPath.startsWith("http")) {
      fullImageUrl = rawPath;
    } else {
      // Remove leading slash if present
      const cleanPath = rawPath.startsWith("/") ? rawPath.slice(1) : rawPath;
      fullImageUrl = `${BASE_URL}/${cleanPath}`;
    }
  }

  // Format Price
  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(goat.price || 0);

  return (
    <Link
      to={`/market/product/${goat._id}`}
      className="group relative block w-full aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-transparent hover:border-[#4A6741] transition-all duration-300 cursor-pointer bg-gray-100"
    >
      {/* 1. Full Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {fullImageUrl ? (
          <img
            src={fullImageUrl}
            alt={goat.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              // Hide image on error
              e.target.style.display = "none";
              // Show placeholder background
              e.target.parentElement.classList.add(
                "bg-gray-200",
                "flex",
                "items-center",
                "justify-center"
              );
            }}
          />
        ) : (
          // Fallback if no URL
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-400">
            <ScanFace className="w-8 h-8 mb-1" />
            <span className="text-[10px]">No Photo</span>
          </div>
        )}
      </div>

      {/* 2. Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

      {/* 3. Floating Status Badge */}
      <div className="absolute top-2 right-2 flex gap-1">
        <span
          className={`block w-2.5 h-2.5 rounded-full border border-white shadow-sm ${
            isHealthy ? "bg-green-500" : "bg-orange-500"
          }`}
          title={goat.healthStatus?.[0] || "Unknown"}
        />
      </div>

      {/* 4. Floating Details */}
      <div className="absolute bottom-0 left-0 w-full p-3 flex flex-col justify-end">
        <div className="flex justify-between items-end">
          <div>
            <h4 className="font-bold text-white text-base leading-tight truncate shadow-black drop-shadow-sm">
              {goat.name}
            </h4>

            <div className="flex items-center gap-1 text-white/80 text-[10px] font-mono mt-0.5">
              <span className="truncate max-w-[60px]">{goat.breed}</span>
              <span>•</span>
              <span className="capitalize">{goat.gender}</span>
            </div>
          </div>

          <div className="text-white font-bold text-sm">{formattedPrice}</div>
        </div>
      </div>
    </Link>
  );
}

export default Goats;
