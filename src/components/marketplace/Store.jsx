import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Star,
  Store as StoreIcon,
  Filter,
} from "lucide-react";
import { api } from "../../lib/data";
import MarketNav from "../../components/marketplace/MarketNav";

// ✅ MATCH YOUR IP: Ensures images load on mobile/other devices
const BASE_URL = "http://10.10.108.187:5000";

// Helper to format currency
const formatPrice = (price) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(price || 0);
};

// Helper for images
const getProcessedUrl = (path) => {
  if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
  if (path.startsWith("http")) return path;
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${BASE_URL}/${cleanPath}`;
};

export default function Store() {
  const { id } = useParams(); // Get Farm ID from URL
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [goats, setGoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'male', 'female'

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Farm Details
        // Using the new api.farms.get(id) endpoint we added
        const farmData = await api.farms.get(id);
        setFarm(farmData);

        // 2. Fetch Goats for this specific farm
        // We use api.market.list(id) which hits /get-goats/:userId
        const allGoats = await api.market.list(id);

        // 3. Filter: Only show goats that are actually FOR SALE
        // The backend returns all goats for the user, so we filter here.
        const saleGoats = Array.isArray(allGoats)
          ? allGoats.filter((g) => g.isForSale === true)
          : [];

        setGoats(saleGoats);
      } catch (error) {
        console.error("Failed to load store:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStoreData();
  }, [id]);

  // Filter Logic (Tabs)
  const filteredGoats = goats.filter((goat) => {
    if (activeTab === "all") return true;
    return goat.gender?.toLowerCase() === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-[#4A6741] font-medium animate-pulse flex items-center gap-2">
          <StoreIcon className="w-5 h-5" /> Loading Store...
        </div>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500">
        <p>Farm not found.</p>
        <button
          onClick={() => navigate("/market")}
          className="mt-4 text-[#4A6741] hover:underline"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MarketNav />

      {/* --- HERO / HEADER SECTION --- */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            to="/market/farms"
            className="inline-flex items-center text-gray-500 hover:text-[#4A6741] mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Farms
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-[#4A6741] rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-lg shrink-0 border-4 border-white overflow-hidden">
              {/* Use profile image if available, else initial */}
              {farm.profileImage ? (
                <img
                  src={getProcessedUrl(farm.profileImage)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : farm.farmName ? (
                farm.farmName.charAt(0)
              ) : (
                "F"
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {farm.farmName || "Unnamed Farm"}
                </h1>
                <span className="bg-green-100 text-[#4A6741] text-xs font-bold px-2 py-1 rounded-full border border-green-200 uppercase tracking-wide">
                  Verified Seller
                </span>
              </div>

              {/* Meta Details */}
              <div className="space-y-1 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{farm.address || "No address provided"}</span>
                </div>
                {(farm.phone || farm.contactNumber) && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{farm.phone || farm.contactNumber}</span>
                  </div>
                )}
                {farm.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{farm.email}</span>
                  </div>
                )}
              </div>

              {/* Stats / Badges */}
              <div className="flex gap-4">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <StoreIcon className="w-4 h-4 text-[#4A6741]" />
                  <span className="text-sm font-medium text-gray-700">
                    {goats.length} Goats Listed
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">
                    4.8 Rating
                  </span>
                </div>
              </div>
            </div>

            {/* Contact CTA (Desktop) */}
            <div className="hidden md:block">
              <button className="bg-[#4A6741] hover:bg-[#3a5232] text-white px-6 py-3 rounded-xl font-medium shadow-md transition-all flex items-center gap-2">
                <Phone className="w-4 h-4" /> Contact Farm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- INVENTORY SECTION --- */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-gray-800">Current Inventory</h2>

          <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "all"
                  ? "bg-[#4A6741] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab("male")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "male"
                  ? "bg-[#4A6741] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Males
            </button>
            <button
              onClick={() => setActiveTab("female")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "female"
                  ? "bg-[#4A6741] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Females
            </button>
          </div>
        </div>

        {/* Goat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGoats.length > 0 ? (
            filteredGoats.map((goat) => (
              <Link
                key={goat._id}
                // Link to the Goat Details page
                to={`/market/goat/${goat._id}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#4A6741]/30 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img
                    src={
                      // Use mainPhotoPath if available (from aggregation) or first item in images array
                      goat.mainPhotoPath
                        ? getProcessedUrl(goat.mainPhotoPath)
                        : goat.images && goat.images.length > 0
                        ? getProcessedUrl(goat.images[0])
                        : "https://via.placeholder.com/400?text=No+Image"
                    }
                    alt={goat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-[#4A6741] shadow-sm">
                    {goat.breed || "Mixed"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#4A6741] transition-colors">
                      {goat.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border
                      ${
                        goat.gender === "Female"
                          ? "bg-pink-50 text-pink-600 border-pink-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }
                    `}
                    >
                      {goat.gender}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xl font-bold text-[#4A6741]">
                      {goat.price
                        ? formatPrice(goat.price)
                        : "Contact for Price"}
                    </span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="block text-gray-400">Age/Birth</span>
                      {goat.birthDate
                        ? new Date(goat.birthDate).toLocaleDateString()
                        : "Unknown"}
                    </div>
                    <div>
                      <span className="block text-gray-400">Weight</span>
                      {goat.weight ? `${goat.weight}kg` : "N/A"}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Filter className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No goats found
              </h3>
              <p className="text-gray-500">
                This farm currently has no goats listed in this category.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
