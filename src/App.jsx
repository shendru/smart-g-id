import { useState } from "react";
import Nav from "./components/Nav";
import { Routes, Route } from "react-router-dom";

// 1. Import the new page
import Home from "./views/Home";
import RegisterGoat from "./views/RegisterGoat";
import GoatProfile from "./components/goat/GoatProfile";
import Auth from "./views/Auth";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5">
        <Routes>
          {/* <Route path="/" element={<Auth />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/registergoat" element={<RegisterGoat />} />
          <Route path="/goatprofile/:id" element={<GoatProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
