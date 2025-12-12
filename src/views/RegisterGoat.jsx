import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XOctagon } from "lucide-react"; // Using Octagon (Stop Sign shape) for "Terminate"

import StartScan from "../components/registergoat/StartScan";
import Capturing from "../components/registergoat/Capturing";
import Details from "../components/registergoat/Details";
import Complete from "../components/registergoat/Complete";
import ScanningData from "../components/registergoat/ScanningData";

function RegisterGoat() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER CARD WITH TERMINATE BUTTON */}
      <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Text Section */}
          <div>
            <h2 className="text-[#4A6741] font-bold text-xl m-0">
              Register New Goat
            </h2>
            <p className="text-[#7A6E5C] text-sm mt-1">
              Follow the steps to add a goat to your system
            </p>
          </div>

          {/* Terminate Button */}
          <button
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure you want to terminate the registration process?"
                )
              ) {
                navigate("/");
              }
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-sm uppercase tracking-wide"
          >
            <XOctagon className="w-5 h-5" />
            Terminate Process
          </button>
        </div>
      </div>

      {/* STEPPER */}
      <div className="flex justify-between">
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 1
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } h-10 w-10 flex items-center justify-center font-bold`}
          >
            1
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1 font-medium">
            Scan
          </p>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 3
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } text-gray-400 h-10 w-10 flex items-center justify-center font-bold`}
          >
            2
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1 font-medium">
            Details
          </p>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 4
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } text-gray-400 h-10 w-10 flex items-center justify-center font-bold`}
          >
            3
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1 font-medium">
            Capture
          </p>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 5
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } text-gray-400 h-10 w-10 flex items-center justify-center font-bold`}
          >
            4
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1 font-medium">
            Complete
          </p>
        </div>
      </div>

      {/* DYNAMIC STEPS */}
      {step === 1 && <StartScan setStep={setStep} />}
      {step === 2 && <ScanningData setStep={setStep} />}
      {step === 3 && <Details setStep={setStep} />}
      {step === 4 && <Capturing setStep={setStep} />}
      {step === 5 && <Complete />}
    </div>
  );
}

export default RegisterGoat;
