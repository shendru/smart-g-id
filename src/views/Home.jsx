import React from "react";
import AddGoat from "../components/home/AddGoat";
import GoatCard from "../components/goat/GoatCard";

function Home() {
  return (
    <>
      <div className="flex flex-col rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
        <div className="p-5">
          <h2 className="text-[#4A6741]">Goats saved in your account</h2>
          <p className="text-[#7A6E5C] text-sm">
            Follow the steps to add a goat to your system
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-white border-2 min-h-100 border-[#4A6741]/20 shadow-md">
        <div className="grid grid-cols-4 gap-4 p-5">
          {/* This is where we will add the goat when we check the database if there are any goat data */}
          <GoatCard />
          <AddGoat />
        </div>
      </div>
    </>
  );
}

export default Home;
