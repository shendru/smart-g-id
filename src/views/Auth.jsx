import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, ArrowRight, Mail, Sprout, Tractor } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/registergoat"); // Redirect to your app after login
  };

  return (
    // 1. Changed outer container to h-full to fit your App.jsx <main>
    <div className="w-full h-full flex items-center justify-center">
      {/* 2. Main Card: Fits within your max-w-4xl constraint */}
      <div className="w-full h-full md:h-[550px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border-2 border-[#4A6741]/10">
        {/* --- LEFT SIDE: Branding --- */}
        <div className="hidden md:flex md:w-5/12 bg-[#4A6741] relative overflow-hidden p-8 flex-col justify-between text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0 100 L0 50 Q 50 0 100 50 L100 100 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm mb-4 border border-white/30">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2 leading-tight">
              Smart Goat <br /> Manager
            </h1>
            <p className="text-[#F5F1E8]/80 text-sm">
              Secure livestock tracking for your farm.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-2 mt-auto">
            <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 text-xs font-medium flex items-center gap-2 w-fit">
              <Tractor className="w-3 h-3" /> System Operational
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: Form --- */}
        <div className="w-full md:w-7/12 p-6 md:p-10 flex flex-col justify-center bg-white relative">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-2xl font-bold text-[#4A6741] mb-1">
              {isLogin ? "Welcome Back" : "Register Farm"}
            </h2>
            <p className="text-[#7A6E5C] text-sm mb-6">
              {isLogin
                ? "Enter your credentials to access dashboard."
                : "Create a new farm profile."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4A6741] ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    placeholder="farmer@example.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-[#4A6741] ml-1">
                    Farm Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      required
                      placeholder="Green Valley"
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:bg-white text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#4A6741] ml-1">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6741] focus:bg-white text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#4A6741] hover:bg-[#3d5535] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#4A6741]/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 text-sm"
              >
                {isLogin ? "Sign In" : "Register Farm"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 text-center pt-4 border-t border-gray-100">
              <p className="text-[#7A6E5C] text-xs">
                {isLogin ? "New user?" : "Existing user?"}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 font-bold text-[#4A6741] hover:underline"
                >
                  {isLogin ? "Create Account" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
