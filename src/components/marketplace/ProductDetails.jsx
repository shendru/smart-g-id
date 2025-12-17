import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Store,
  Mail,
  Calendar,
  Weight,
  Ruler,
  Share2,
  Heart,
  Activity,
} from "lucide-react";
import { api } from "../../lib/data";
import MarketNav from "../../components/marketplace/MarketNav";

// 1. Define Backend URL
const BASE_URL = "http://localhost:5000";

// Placeholder for the Farm Banner
const FARM_PLACEHOLDER =
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1000&auto=format&fit=crop";

function ProductDetails() {
  const { id } = useParams();
  const [goat, setGoat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stores the RAW path (e.g., "uploads/img.jpg")
  const [selectedImage, setSelectedImage] = useState("");

  // --- HELPER: Process Image URL ---
  const getProcessedUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) {
      return path;
    }
    // Remove leading slash to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BASE_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchGoat = async () => {
      try {
        const data = await api.goats.get(id);
        setGoat(data);

        // Logic: Set initial selected image (Priority: Array[0] -> MainPath -> MainPhoto)
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        } else if (data.mainPhotoPath) {
          setSelectedImage(data.mainPhotoPath);
        } else if (data.mainPhoto) {
          setSelectedImage(data.mainPhoto);
        }
      } catch (error) {
        console.error("Failed to load goat:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGoat();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-[#4A6741] font-medium animate-pulse">
          Loading details...
        </div>
      </div>
    );

  if (!goat)
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-red-500 font-medium">Goat not found.</div>
      </div>
    );

  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(goat.price || 0);

  // Helper to normalize healthStatus to an array
  const healthTags = Array.isArray(goat.healthStatus)
    ? goat.healthStatus
    : goat.healthStatus
    ? [goat.healthStatus]
    : [];

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <MarketNav />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb / Back Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/market"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#4A6741] transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>

          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-all">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-[#4A6741] hover:border-[#4A6741] transition-all">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === LEFT COLUMN: IMAGES === */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm relative group">
              <img
                src={
                  getProcessedUrl(selectedImage) || // ✅ Uses the helper function
                  "https://via.placeholder.com/600?text=No+Image"
                }
                alt={goat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src =
                    "https://via.placeholder.com/600?text=Image+Error";
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider text-[#4A6741] shadow-sm">
                  {goat.breed}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {goat.images && goat.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {goat.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)} // Sets the raw path
                    className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === img
                        ? "border-[#4A6741] ring-2 ring-[#4A6741]/20"
                        : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-200"
                    }`}
                  >
                    <img
                      src={getProcessedUrl(img)} // ✅ Uses the helper function
                      alt="thumb"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === RIGHT COLUMN: DETAILS & SELLER === */}
          <div className="space-y-6">
            {/* 1. Goat Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                    {goat.name}
                  </h1>
                  <p className="text-[#4A6741] font-medium text-sm mt-1">
                    Listed{" "}
                    {new Date(goat.listedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 mb-6">
                <span className="text-3xl font-bold text-[#4A6741]">
                  {formattedPrice}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <StatItem
                  icon={Weight}
                  label="Weight"
                  value={`${goat.weight} kg`}
                />
                <StatItem
                  icon={Ruler}
                  label="Height"
                  value={goat.height ? `${goat.height} cm` : "N/A"}
                />
                <StatItem
                  icon={Calendar}
                  label="Age"
                  value={calculateAge(goat.birthDate)}
                />
                <StatItem icon={Store} label="Gender" value={goat.gender} />
              </div>

              {/* Health Status Section */}
              <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-[#4A6741]" />
                  <span className="font-bold text-gray-700 text-sm">
                    Health Status
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {healthTags.length > 0 ? (
                    healthTags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-2 py-1 rounded-full text-xs font-bold border ${
                          tag === "Healthy"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                        }`}
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">None recorded</span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Seller / Farm Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              {/* Farm Banner */}
              <div className="h-28 bg-gray-200 relative overflow-hidden">
                <img
                  src={FARM_PLACEHOLDER}
                  alt="Farm Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              <div className="p-6 relative">
                {/* Avatar */}
                <div className="absolute -top-10 left-6">
                  <div className="w-20 h-20 bg-white rounded-full p-1.5 shadow-md">
                    <div className="w-full h-full bg-[#4A6741] rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white">
                      {goat.ownerDetails?.farmName?.charAt(0) || "F"}
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="font-bold text-lg text-gray-800">
                    {goat.ownerDetails?.farmName || "Private Farm"}
                  </h3>

                  <div className="flex flex-col gap-2 mt-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>
                        {goat.ownerDetails?.address || "Location hidden"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span>Verified Breeder</span>
                    </div>
                  </div>

                  <a
                    href={`mailto:${goat.ownerDetails?.email}?subject=Inquiry about ${goat.name} (ID: ${goat.rfidTag})`}
                    className="w-full flex items-center justify-center gap-2 bg-[#4A6741] text-white py-3.5 rounded-xl font-bold hover:bg-[#3a5233] transition-all shadow-lg shadow-green-900/10 active:scale-[0.98]"
                  >
                    <Mail className="w-4 h-4" />
                    Contact Seller
                  </a>

                  <p className="text-center text-xs text-gray-400 mt-3">
                    Replies typically within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Consistent Stats Component
function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50/80 border border-gray-100 rounded-xl hover:bg-gray-100 transition-colors">
      <div className="p-2 bg-white rounded-lg text-[#4A6741] shadow-sm border border-gray-100">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
          {label}
        </p>
        <p className="font-bold text-gray-700 text-sm capitalize">{value}</p>
      </div>
    </div>
  );
}

function calculateAge(birthDate) {
  if (!birthDate) return "Unknown";
  const diff = Date.now() - new Date(birthDate).getTime();
  const ageDate = new Date(diff);
  const years = Math.abs(ageDate.getUTCFullYear() - 1970);
  const months = ageDate.getUTCMonth();

  if (years > 0) return `${years} yr ${months} mo`;
  return `${months} months`;
}

export default ProductDetails;
