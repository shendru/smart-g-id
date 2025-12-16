import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/data"; // <--- Import API
import {
  Edit2,
  Save,
  X,
  Camera,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Ruler,
  Weight,
  Activity,
  ScanLine,
  Loader2,
  Calendar,
} from "lucide-react";

export default function GoatProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);

  // Profile Data
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);

  // Health Status Logic State
  const [healthInput, setHealthInput] = useState("");
  const commonStatuses = [
    "Healthy",
    "Sick",
    "Injured",
    "Pregnant",
    "Quarantined",
    "Under Observation",
  ];

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchGoat = async () => {
      try {
        const data = await api.goats.get(id); // <--- API Call

        setProfile(data);
        setEditedProfile({
          ...data,
          healthStatus: Array.isArray(data.healthStatus)
            ? data.healthStatus
            : [data.healthStatus],
        });
      } catch (err) {
        console.error("Network Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoat();
  }, [id]);

  // --- HEALTH TAG HANDLERS ---
  const addTag = (tag) => {
    if (tag && editedProfile && !editedProfile.healthStatus.includes(tag)) {
      setEditedProfile((prev) => ({
        ...prev,
        healthStatus: [...prev.healthStatus, tag],
      }));
      setHealthInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setEditedProfile((prev) => ({
      ...prev,
      healthStatus: prev.healthStatus.filter((t) => t !== tagToRemove),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(healthInput.trim());
    }
  };

  // --- MAIN HANDLERS ---
  const handleSave = async () => {
    try {
      setLoading(true);

      const updatePayload = {
        ...editedProfile,
        owner: profile.owner,
      };

      // <--- API Call
      const result = await api.goats.update(id, updatePayload);

      // Backend returns { goat: ... }
      if (result.goat) {
        setProfile(result.goat);
        setEditedProfile(result.goat);
        setIsEditing(false);
      } else {
        // Fallback if backend returns the object directly
        setProfile(result);
        setEditedProfile(result);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Error saving profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setHealthInput("");
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this goat profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await api.goats.delete(id); // <--- API Call
      navigate(-1);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Failed to delete goat: " + error.message);
      setLoading(false);
    }
  };

  // Helper alias for JSX readability
  const healthTags = editedProfile?.healthStatus || [];

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
            <div className="flex-1 mr-4">
              <div className="flex items-center gap-3 mb-2">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) =>
                      setEditedProfile({
                        ...editedProfile,
                        name: e.target.value,
                      })
                    }
                    className="text-2xl font-bold text-[#4A6741] border-b-2 border-[#4A6741]/30 focus:outline-none focus:border-[#4A6741] bg-transparent w-full"
                    placeholder="Goat Name"
                  />
                ) : (
                  <h2 className="text-3xl font-bold text-[#4A6741] m-0">
                    {profile.name}
                  </h2>
                )}
                {!isEditing && (
                  <span className="bg-[#8B9D83] text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
                    Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-[#7A6E5C] bg-[#F5F1E8] px-3 py-1.5 rounded-lg w-fit">
                <ScanLine className="w-4 h-4" />
                <span className="font-mono font-medium">{profile.rfidTag}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleDelete}
                    className="p-2 border-2 border-red-100 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 border-2 border-[#4A6741]/20 rounded-lg text-[#4A6741] hover:bg-[#4A6741] hover:text-white transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCancel}
                  className="p-2 border-2 border-gray-200 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-1 w-full bg-[#4A6741]/20"></div>
      </div>

      {/* =========================================================
          CONTAINER 2: IMAGES (View Only)
         ========================================================= */}
      <div className="bg-white border-2 border-[#4A6741]/20 rounded-xl shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-[#4A6741]/10 flex justify-between items-center">
          <h3 className="text-[#4A6741] font-bold text-sm uppercase tracking-wider m-0 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Media Gallery
          </h3>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.images && profile.images.length > 0 ? (
              profile.images.map((imgUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                >
                  <img
                    src={imgUrl}
                    alt={`Goat ${index}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400 text-sm">
                No images available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTAINER 3: GOAT DETAILS
         ========================================================= */}
      <div className="bg-white border-2 border-[#4A6741]/20 rounded-xl shadow-md overflow-hidden">
        {/* 3A. Sensor Metrics (Read Only) */}
        <div className="p-5 border-b border-dashed border-[#4A6741]/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#4A6741] font-bold text-lg m-0 flex items-center gap-2">
              <Activity className="w-5 h-5" /> Physical Metrics
            </h3>
            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              Sensor Data (Read-Only)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 opacity-90">
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

        {/* 3B. Biological Info (Editable) */}
        <div className="p-5">
          <h3 className="text-[#4A6741] font-bold text-lg mb-4">
            Biological Details
          </h3>

          <div className="space-y-4">
            {isEditing ? (
              // --- EDIT MODE ---
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-2 gap-4">
                  {/* --- BREED SELECT --- */}
                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-[#4A6741]">
                      Breed *
                    </label>
                    <select
                      value={editedProfile.breed}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          breed: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white"
                    >
                      {!editedProfile.breed && (
                        <option value="">Select a breed...</option>
                      )}
                      <option value="Native">Native</option>
                      <option value="Boer">Boer</option>
                      <option value="Anglo-Nubian">Anglo-Nubian</option>
                      <option value="Saanen">Saanen</option>
                      <option value="Toggenburg">Toggenburg</option>
                      <option value="Mixed">Mixed / Crossbreed</option>
                    </select>
                  </div>

                  {/* Gender Select */}
                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-[#4A6741]">
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
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white"
                    >
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>

                  {/* Birth Date Input */}
                  <div className="space-y-2">
                    <label className="block font-medium text-sm text-[#4A6741]">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={
                        editedProfile.birthDate
                          ? new Date(editedProfile.birthDate)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          birthDate: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A6741] bg-white"
                    />
                  </div>
                </div>

                {/* --- HEALTH STATUS INPUT SECTION --- */}
                <div className="space-y-2">
                  <label className="block font-medium text-sm text-[#4A6741]">
                    Health Status *
                  </label>
                  <div className="p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-[#4A6741] flex flex-wrap gap-2">
                    {healthTags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium 
                          ${
                            tag === "Healthy"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black/10"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={healthInput}
                      onChange={(e) => setHealthInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                      placeholder={
                        healthTags.length === 0 ? "Type & Hit Enter..." : ""
                      }
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commonStatuses.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => addTag(status)}
                        className={`text-xs px-3 py-1 rounded-full border transition-all ${
                          healthTags.includes(status)
                            ? "bg-[#4A6741] text-white opacity-50 cursor-default"
                            : "bg-gray-50 text-gray-600 hover:border-[#4A6741] hover:text-[#4A6741]"
                        }`}
                        disabled={healthTags.includes(status)}
                      >
                        + {status}
                      </button>
                    ))}
                  </div>
                </div>
                <hr className="border-gray-200 my-4" />
                {/* --------------------------------------- */}

                {/* Save / Cancel Action Bar */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-[#4A6741] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-[#3d5535] flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-50"
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
                  icon={<Calendar className="w-3 h-3" />}
                />
                <InfoRow label="Gender" value={profile.gender} />
                <InfoRow label="Breed" value={profile.breed} />

                {/* Health Status Tags (Read Only) */}
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
      {!isEditing && (
        <button
          onClick={() => setShowSyncModal(true)}
          className="w-full bg-[#D4621C] hover:bg-[#b85418] text-white h-12 rounded-xl shadow-lg flex items-center justify-center font-bold text-sm transition-transform active:scale-95"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync to Marketplace
        </button>
      )}

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
      <p className="text-xs text-[#7A6E5C] mb-0.5 flex items-center gap-1">
        {label}
      </p>
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
