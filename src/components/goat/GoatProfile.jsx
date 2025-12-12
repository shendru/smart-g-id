import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Edit2,
  Save,
  X,
  Camera,
  Trash2,
  Plus,
  RefreshCw,
  ArrowLeft,
  Ruler,
  Weight,
  Activity,
  ScanLine,
  Loader2,
} from "lucide-react";

export default function GoatProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Profile Data (Initialized empty)
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchGoat = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-goat/${id}`);
        const data = await response.json();

        if (response.ok) {
          setProfile(data);
          setEditedProfile(data);
        } else {
          console.error("Failed to load profile");
        }
      } catch (err) {
        console.error("Network Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoat();
  }, [id]);

  // --- HANDLERS ---
  const handleSave = () => {
    // Here you would PUT/PATCH the data to the backend
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-[#4A6741]">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading Profile...
      </div>
    );
  }

  if (!profile) {
    return <div className="p-8 text-center text-red-500">Goat Not Found</div>;
  }

  return (
    <div className="space-y-5 pb-20">
      {/* Back Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-[#7A6E5C] hover:text-[#4A6741] transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Herd
      </button>

      {/* =========================================================
          CONTAINER 1: IDENTITY (Name & RFID)
         ========================================================= */}
      <div className="bg-white border-2 border-[#4A6741]/20 rounded-xl shadow-md overflow-hidden relative">
        <div className="p-5">
          <div className="flex items-start justify-between">
            {/* Left: Name & RFID */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-[#4A6741] m-0">
                  {profile.name}
                </h2>
                <span className="bg-[#8B9D83] text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#7A6E5C] bg-[#F5F1E8] px-3 py-1.5 rounded-lg w-fit">
                <ScanLine className="w-4 h-4" />
                <span className="font-mono font-medium">{profile.rfidTag}</span>
              </div>
            </div>

            {/* Right: Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 border-2 border-[#4A6741]/20 rounded-lg text-[#4A6741] hover:bg-[#4A6741] hover:text-white transition-colors"
            >
              {isEditing ? (
                <X className="h-5 w-5" />
              ) : (
                <Edit2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-[#4A6741]/20"></div>
      </div>

      {/* =========================================================
          CONTAINER 2: IMAGES (From Database)
         ========================================================= */}
      <div className="bg-white border-2 border-[#4A6741]/20 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-[#4A6741]/10 flex justify-between items-center">
          <h3 className="text-[#4A6741] font-bold text-sm uppercase tracking-wider m-0 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Media Gallery
          </h3>
          {isEditing && (
            <button className="text-xs bg-[#4A6741] text-white px-2 py-1 rounded hover:bg-[#3d5535] flex items-center">
              <Plus className="w-3 h-3 mr-1" /> Add
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Map through fetched images */}
            {profile.images && profile.images.length > 0 ? (
              profile.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group cursor-pointer"
                >
                  <img
                    src={imgUrl}
                    alt={`Goat ${index}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  {isEditing && (
                    <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-80 hover:opacity-100">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                No images available.
              </div>
            )}

            {/* Add Placeholder */}
            {isEditing && (
              <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50">
                <Plus className="w-6 h-6" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTAINER 3: GOAT DETAILS (Metrics & Bio)
         ========================================================= */}
      <div className="bg-white border-2 border-[#4A6741]/20 rounded-xl shadow-md overflow-hidden">
        {/* 3A. Sensor Metrics */}
        <div className="p-5 border-b border-dashed border-[#4A6741]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#4A6741] font-bold text-lg m-0 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Physical Metrics
            </h3>
            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Last Updated: {new Date(profile.addedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SensorBox
              label="Weight"
              value={profile.weight}
              unit="kg"
              icon={<Weight className="w-4 h-4" />}
            />
            <SensorBox
              label="Height"
              value={profile.height}
              unit="cm"
              icon={<Ruler className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* 3B. Biological Info */}
        <div className="p-5">
          <h3 className="text-[#4A6741] font-bold text-lg mb-4">
            Biological Details
          </h3>

          <div className="space-y-4">
            {isEditing ? (
              // --- EDIT MODE ---
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* Breed Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4A6741]">
                      Breed
                    </label>
                    <select
                      value={editedProfile.breed}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          breed: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-[#4A6741]/30 rounded text-sm bg-white"
                    >
                      <option>Boer</option>
                      <option>Nubian</option>
                      <option>Native</option>
                      <option>Mixed</option>
                    </select>
                  </div>
                  {/* Gender Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#4A6741]">
                      Gender
                    </label>
                    <select
                      value={editedProfile.gender}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          gender: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-[#4A6741]/30 rounded text-sm bg-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                {/* Health Tags (Read-only edit for now) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#4A6741]">
                    Health Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editedProfile.healthStatus.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#4A6741] text-white py-2 rounded text-sm font-bold hover:bg-[#3d5535]"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 text-gray-600 py-2 rounded text-sm font-bold hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // --- VIEW MODE ---
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                <InfoRow
                  label="Birth Date"
                  value={new Date(profile.birthDate).toLocaleDateString()}
                />
                <InfoRow label="Gender" value={profile.gender} />
                <InfoRow label="Breed" value={profile.breed} />

                {/* Health Status Tags */}
                <div className="sm:col-span-2">
                  <p className="text-xs text-[#7A6E5C] mb-1">Health Status</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthStatus && profile.healthStatus.length > 0 ? (
                      profile.healthStatus.map((tag, i) => (
                        <span
                          key={i}
                          className={`px-2 py-1 rounded-full text-xs font-bold 
                                    ${
                                      tag === "Healthy"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                    }`}
                        >
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">
                        None recorded
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sync Button */}
      <button
        onClick={() => setShowSyncModal(true)}
        className="w-full bg-[#D4621C] hover:bg-[#b85418] text-white h-12 rounded-xl shadow-lg flex items-center justify-center font-bold text-sm transition-transform active:scale-95"
      >
        <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" />
        Sync to Marketplace
      </button>

      {/* Modal */}
      {showSyncModal && (
        <SyncConfirmModal
          goatName={profile.name}
          onClose={() => setShowSyncModal(false)}
        />
      )}
    </div>
  );
}

// --- SUB COMPONENTS ---

function SensorBox({ label, value, unit, icon }) {
  return (
    <div className="bg-[#F5F1E8] rounded-lg p-3 flex flex-col items-center justify-center text-center border border-[#4A6741]/10">
      <div className="text-[#4A6741] opacity-60 mb-1">{icon}</div>
      <div className="text-xl font-bold text-[#4A6741] leading-none">
        {value}
      </div>
      <div className="text-[10px] text-[#7A6E5C] mt-1 uppercase tracking-wide">
        {label} ({unit})
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[#7A6E5C] mb-0.5">{label}</p>
      <p className="text-base font-medium text-[#4A6741]">{value}</p>
    </div>
  );
}

function SyncConfirmModal({ goatName, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-xs w-full p-5 text-center shadow-2xl animate-in zoom-in-95">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <RefreshCw className="w-6 h-6 text-[#D4621C]" />
        </div>
        <h3 className="text-lg font-bold text-[#4A6741] mb-1">
          Sync {goatName}?
        </h3>
        <p className="text-gray-500 mb-4 text-xs">
          This will list this goat on the marketplace for sale.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 text-xs bg-[#D4621C] text-white rounded hover:bg-[#b85418]"
          >
            Sync Now
          </button>
        </div>
      </div>
    </div>
  );
}
