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
    <>
      <Nav />

      <main className="px-4 py-6 max-w-4xl mx-auto flex h-[calc(100vh-76px)] flex-col gap-5">
        <Routes>
          {/* <Route path="/" element={<Auth />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/registergoat" element={<RegisterGoat />} />

          {/* 2. Add the Dynamic Route 
            The ":id" part tells React Router that this part of the URL is a variable.
            So /goatprofile/1, /goatprofile/99, etc. will all load this component.
          */}
          <Route path="/goatprofile/:id" element={<GoatProfile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
