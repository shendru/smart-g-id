import React from "react";
import Goat from "../components/home/goat";

function Home() {
  return (
    <>
      <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
        <div className="grid grid-cols-8 gap-4 p-5">
          <Goat />
          <Goat />
          <Goat />
          <Goat />
          <Goat />
          <Goat />
          <Goat />
          <Goat />
          <Goat />
          <Goat />
        </div>
      </div>
    </>
  );
}

export default Home;
