import React, { useEffect, useState } from "react";
import axios from "axios";
import MarketNav from "../../components/marketplace/MarketNav";
import MarketCard from "../../components/marketplace/MarketCard";
import { Filter, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

function Marketplace() {
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        // Fetch ALL goats, then filter for "isForSale"
        // In production, your API should likely have an endpoint like /api/goats/market
        const response = await axios.get("http://localhost:5000/api/goats");

        // Filter: Only show goats that are marked for sale
        const forSale = response.data.filter((g) => g.isForSale === true);

        setGoats(forSale);
      } catch (error) {
        console.error("Error loading marketplace:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplace();
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MarketNav />

      {/* HERO SECTION */}
      <div className="relative bg-[#4A6741] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?q=80&w=2821&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <span className="text-[#E6ECD6] uppercase tracking-widest text-xs font-bold mb-4 border border-[#E6ECD6]/30 px-3 py-1 rounded-full">
            Trusted Livestock Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Premium Quality <br /> Goats for Your Farm
          </h1>
          <p className="text-lg text-[#E6ECD6] max-w-2xl mb-8">
            Directly from verified local breeders. Detailed health records,
            genetic history, and transparent pricing.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-[#D4621C] hover:bg-[#B85418] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-orange-900/20">
              Browse Inventory
            </button>
            <Link
              to="/"
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-xl font-bold transition-all backdrop-blur-sm text-center"
            >
              Sell Your Livestock
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Latest Listings</h2>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-[#4A6741] hover:text-[#4A6741] transition-colors bg-white">
            <Filter className="w-4 h-4" />
            Filter & Sort
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#4A6741]" />
            <p>Loading the best goats...</p>
          </div>
        ) : goats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {goats.map((goat) => (
              <MarketCard key={goat._id} goat={goat} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 mb-2">No goats currently for sale.</p>
            <p className="text-sm text-gray-400">
              Check back later for new listings!
            </p>
          </div>
        )}
      </main>

      {/* SIMPLE FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          &copy; 2025 GoatMarket. Secure Livestock Trading.
        </div>
      </footer>
    </div>
  );
}

export default Marketplace;
