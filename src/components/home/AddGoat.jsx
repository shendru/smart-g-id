import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

function AddGoat() {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/registergoat")}
      className="group w-40 h-40 rounded-xl border-2 border-dashed border-[#4A6741]/40 hover:border-[#4A6741] bg-[#F5F1E8]/30 hover:bg-[#F5F1E8] cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
    >
      {/* Icon Circle */}
      <div className="p-3 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300">
        <Plus className="w-6 h-6 text-[#4A6741]" />
      </div>

      {/* Label */}
      <span className="text-[#4A6741] font-bold text-sm">Add New Goat</span>
    </div>
  );
}

export default AddGoat;
