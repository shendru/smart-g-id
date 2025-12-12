import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Home from "./views/Home";
import RegisterGoat from "./views/RegisterGoat";
import GoatProfile from "./components/goat/GoatProfile";
import Auth from "./views/Auth";

function App() {
  // 1. Auth State: Check if user is logged in (e.g., check LocalStorage)
  // For now, we default to false (Not Logged In)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // OPTIONAL: Check for saved login token on app load
  useEffect(() => {
    const token = localStorage.getItem("user_token"); // or whatever you save
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggedIn && <Nav />}

      <main
        className={`flex-1 w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-5 ${
          !isLoggedIn && "justify-center"
        }`}
      >
        <Routes>
          {/* 2. CONDITIONAL ROUTING FOR "/" 
            If logged in -> Show Home
            If NOT logged in -> Show Auth
          */}
          <Route
            path="/"
            element={
              isLoggedIn ? <Home /> : <Auth setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* 3. PROTECTED ROUTES 
            (Optional) If you want to block these pages when logged out, 
            wrap them like this: 
            element={isLoggedIn ? <Page /> : <Navigate to="/" />}
          */}
          <Route
            path="/registergoat"
            element={isLoggedIn ? <RegisterGoat /> : <Navigate to="/" />}
          />

          <Route
            path="/goatprofile/:id"
            element={isLoggedIn ? <GoatProfile /> : <Navigate to="/" />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
