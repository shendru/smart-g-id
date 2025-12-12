import { useState } from "react";
import Nav from "./components/Nav";
import { Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import RegisterGoat from "./views/RegisterGoat";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Nav />

      <main className="px-4 py-6 max-w-4xl mx-auto flex h-[calc(100vh-76px)] flex-col gap-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registergoat" element={<RegisterGoat />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
