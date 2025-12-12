import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react"; // Ensure you have lucide-react installed

function Complete() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(10);

  // Timer Logic
  useEffect(() => {
    // 1. Create the countdown interval
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // 2. Redirect when time hits 0
    if (timeLeft === 0) {
      navigate("/");
    }

    // 3. Cleanup on unmount
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  return (
    <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md overflow-hidden relative">
      {/* Animated Progress Bar at the top */}
      <div
        className="absolute top-0 left-0 h-1 bg-[#4A6741] transition-all duration-1000 ease-linear"
        style={{ width: `${(timeLeft / 10) * 100}%` }}
      />

      <div className="p-8 flex flex-col items-center text-center">
        {/* Success Icon with Bounce Animation */}
        <div className="p-6 rounded-full bg-[#E8F5E9] mb-6 animate-bounce">
          <CheckCircle className="text-[#4A6741] h-16 w-16" />
        </div>

        <h3 className="text-[#4A6741] font-bold text-2xl mb-2">
          Registration Complete!
        </h3>

        <p className="text-[#7A6E5C] mb-8 max-w-xs">
          The goat has been successfully added to the database and all data has
          been synced.
        </p>

        {/* Countdown Text */}
        <p className="text-sm text-gray-400 mb-4 animate-pulse">
          Returning to home in {timeLeft} seconds...
        </p>

        {/* Return Button */}
        <button
          className="w-full bg-[#4A6741] hover:bg-[#3a5233] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-2"
          onClick={() => navigate("/")}
        >
          <Home className="w-5 h-5" />
          Return Home Now
        </button>
      </div>
    </div>
  );
}

export default Complete;
