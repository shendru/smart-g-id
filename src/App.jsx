import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Components
import Nav from "./components/Nav";

// Pages
import Home from "./views/Home";
import RegisterGoat from "./views/RegisterGoat";
import GoatProfile from "./components/goat/GoatProfile";
import Auth from "./views/Auth";
import Sales from "./views/Sales";
import Marketplace from "./views/marketplace/Marketplace";
import ProductDetails from "./components/marketplace/ProductDetails";
import Farms from "./views/marketplace/Farms";
import Goats from "./views/marketplace/Goats";

function App() {
  // 1. Auth State: Check LocalStorage IMMEDIATELY (Lazy Init)
  // This ensures correct state before the first render
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // return true;
    return localStorage.getItem("user_token") !== null;
  });

  const location = useLocation();
  const isMarketRoute = location.pathname.startsWith("/market");

  // Optional: Listen for token changes (if you want logout to update instantly)
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("user_token");
      if (!token) setIsLoggedIn(false);
    };
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F1E8]">
      {/* 2. Show Nav only if Logged In AND not in Market */}
      {isLoggedIn && !isMarketRoute && <Nav />}

      <main
        className={`flex-1 flex flex-col gap-5 ${
          isMarketRoute
            ? "w-full p-0" // Market = Full Width
            : `w-full max-w-4xl mx-auto px-4 py-6 ${
                !isLoggedIn && "justify-center"
              }` // Dashboard = Centered
        }`}
      >
        <Routes>
          {/* 3. ROOT ROUTE LOGIC
             - Path stays "/"
             - If Logged In -> Show Dashboard (Home)
             - If Not Logged In -> Show Login (Auth)
          */}
          <Route
            path="/"
            element={
              isLoggedIn ? <Home /> : <Auth setIsLoggedIn={setIsLoggedIn} />
            }
          />

          <Route path="/sales" element={<Sales />} />

          {/* Protected Routes: Redirect back to "/" if accessed without login */}
          <Route
            path="/registergoat"
            element={isLoggedIn ? <RegisterGoat /> : <Navigate to="/" />}
          />

          <Route
            path="/goatprofile/:id"
            element={isLoggedIn ? <GoatProfile /> : <Navigate to="/" />}
          />

          {/* Market Routes */}
          <Route path="/market" element={<Marketplace />} />
          <Route path="/market/farms" element={<Farms />} />
          <Route path="/market/goats" element={<Goats />} />
          <Route path="/market/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
