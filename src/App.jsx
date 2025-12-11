import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./views/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Nav />

      <main className="px-4 py-6">
        <Home />
      </main>
    </>
  );
}

export default App;
