import { useState } from "react";
import StartScan from "../components/registergoat/StartScan";
import Capturing from "../components/registergoat/Capturing";
import Details from "../components/registergoat/Details";
import Complete from "../components/registergoat/Complete";
import ScanningData from "../components/registergoat/ScanningData";

function RegisterGoat() {
  const [step, setStep] = useState(1);

  return (
    <>
      <div className="flex flex-col rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
        <div className="p-5">
          <h2 className="text-[#4A6741]">Register New Goat</h2>
          <p className="text-[#7A6E5C] text-sm">
            Follow the steps to add a goat to your system
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 1
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } h-10 w-10 flex items-center justify-center`}
          >
            1
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1">Scan</p>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 3
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } text-gray-400 h-10 w-10 flex items-center justify-center`}
          >
            2
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1">Details</p>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 4
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } text-gray-400 h-10 w-10 flex items-center justify-center`}
          >
            3
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1">Capture</p>
        </div>
        <div className="flex flex-col flex-1 items-center">
          <div
            className={`rounded-full ${
              step >= 5
                ? "bg-[#4A6741] text-white"
                : "bg-gray-200 text-gray-400"
            } text-gray-400 h-10 w-10 flex items-center justify-center`}
          >
            4
          </div>
          <p className="text-xs text-[#7A6E5C] text-center mt-1">Complete</p>
        </div>
      </div>

      {step === 1 && <StartScan setStep={setStep} />}
      {step === 2 && <ScanningData setStep={setStep} />}
      {step === 3 && <Details setStep={setStep} />}
      {step === 4 && <Capturing setStep={setStep} />}
      {step === 5 && <Complete />}

      {/* This is where the screen will change every process */}
      {/* <div className="rounded-xl bg-white border-2 border-[#4A6741]/20 shadow-md">
        <div className="p-5 flex flex-col items-center">
          <div className="p-6 rounded-full bg-[#F5F1E8] mb-6">
            <Radio className="text-[#7A6E5C] h-16 w-16" />
          </div>
          <h3 className="text-[#4A6741] mb-2">Ready to Scan</h3>
          <p className="text-[#7A6E5C] mb-6">
            Place the RFID tag near the reader to begin
          </p>

          <button
            className="px-4 py-2 max-w-xs inline-flex rounded-md cursor-pointer bg-[#4A6741] text-sm w-full items-center justify-center h-12 font-medium text-white hover:bg-[#3b5232]"
            onClick={() => setStep(2)}
          >
            Start Scan
          </button>
        </div>
      </div> */}
    </>
  );
}

export default RegisterGoat;
