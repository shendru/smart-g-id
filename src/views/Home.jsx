import React, { useState, useEffect } from "react";
import AddGoat from "../components/home/AddGoat";
import GoatCard from "../components/goat/GoatCard";
import { Loader2 } from "lucide-react"; // Optional loader icon

function Home() {
  const [goats, setGoats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoats = async () => {
      try {
        // 1. Get User ID from Local Storage
        const userToken = JSON.parse(
          localStorage.getItem("user_token") || "{}"
        );
        const userId = userToken._id; // Assuming your login response includes the _id

        if (!userId) {
          console.warn("No user ID found. Are you logged in?");
          setIsLoading(false);
          return;
        }

        // 2. Fetch from Backend
        const response = await fetch(
          `http://localhost:5000/get-goats/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setGoats(data); // Set the array of goats
        } else {
          console.error("Failed to fetch goats:", data.error);
        }
      } catch (error) {
        console.error("Network error fetching goats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoats();
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md mb-6">
        <div className="p-5">
          <h2 className="text-[#4A6741] font-bold text-xl">
            Goats saved in your account
          </h2>
          <p className="text-[#7A6E5C] text-sm mt-1">
            Overview of your livestock database.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="rounded-xl bg-white border-2 min-h-[400px] border-[#4A6741]/20 shadow-md">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-[#4A6741]">
            <Loader2 className="w-8 h-8 animate-spin mr-2" />
            <span>Loading your herd...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
            {/* 1. Render Existing Goats */}
            {goats.length > 0 &&
              goats.map((goat) => <GoatCard key={goat._id} goat={goat} />)}

            {/* 2. Always show Add Goat Button at the end */}
            <AddGoat />
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
