import React, { useState } from "react";


// Pincode Availability Checker
// - Single-file React component
// - Uses Tailwind CSS for styling (assumes Tailwind is set up)
// - Default export is the component so you can import it directly
// - Mock "API" checks against a sample list of pincodes and simulates network delay

export default function PincodeChecker() {
  // sample list of pincodes where home collection service is available
  const availablePincodes = new Set(["671121", "671122", "671123", "110001", "560001"]);

  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState(null); // 'available' | 'unavailable' | 'error' | null
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Basic frontend validation: Indian PIN is 6 digits
  function validatePincode(input) {
    return /^\d{6}$/.test(input.trim());
  }

  // Simulated async check (replace with real API call as needed)
  function checkPincodeAPI(pin) {
    return new Promise((resolve) => {
      // simulate network latency
      setTimeout(() => {
        if (availablePincodes.has(pin)) resolve({ ok: true, available: true });
        else resolve({ ok: true, available: false });
      }, 900 + Math.random() * 600); // random delay between ~900-1500ms
    });
  }

  async function handleCheck(e) {
    e && e.preventDefault();
    setStatus(null);
    setMessage("");

    const pin = pincode.trim();
    if (!validatePincode(pin)) {
      setStatus("error");
      setMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await checkPincodeAPI(pin);
      if (res.ok) {
        if (res.available) {
          setStatus("available");
          setMessage(`Good news — service is available at ${pin}!`);
        } else {
          setStatus("unavailable");
          setMessage(
            `Sorry — service not available at ${pin}. You can request coverage or try another pincode.`
          );
        }
      } else {
        setStatus("error");
        setMessage("Something went wrong. Please try again later.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error — please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuickPick(pin) {
    setPincode(pin);
    // automatically check when user clicks quick pick
    setTimeout(() => handleCheck(), 0);
  }

  return (
    <div className="min-h-[320px] max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100 mb-4 mt-4">
      <header className="flex items-center gap-4 mb-4">
        {/* <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" viewBox="5 5 5 5" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2v6m0 8v6m4-10h6M2 12h6m2-7l-3 3m10 10l3-3" />
          </svg>
        </div> */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Pincode Availability</h2>
          <p className="text-sm text-gray-500">Check if home sample collection is available in your area</p>
        </div>
      </header>

   <form
  onSubmit={handleCheck}
  className="flex flex-col items-center justify-center gap-4 text-center"
>
  <label
    htmlFor="pincode-input"
    className="font-medium text-gray-700 text-base "
  >
    Enter Pincode
  </label>

<div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md 
                bg-white p-4 rounded-xl border border-gray-200 shadow-md 
                transition-transform duration-300 ease-out transform hover:scale-105 hover:shadow-xl">
  {/* Input Label */}
 

  {/* Input Field */}
  
  <input
    id="pincode-input"
    inputMode="numeric"
    pattern="\d*"
    value={pincode}
    onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ""))}
    placeholder="6-digit pincode (e.g. 671121)"
    className="flex-1 w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-center text-lg 
               focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-500 
               transition-all duration-300 ms-4"
    aria-label="Pincode"
    aria-describedby="pincode-help"
  />

  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 
             bg-[#77d9cf] text-teal-600 border-2 border-teal-900 
             rounded-xl shadow-md text-base font-medium
             hover:bg-teal-600 hover:text-white transition-all duration-300
             disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {loading ? (
      <svg
        className="animate-spin w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    ) : (
      "Check"
    )}
  </button>
</div>


  {/* <p id="pincode-help" className="text-xs text-gray-500">
    We currently support home collection in selected areas only.
  </p> */}

  {/* Result area */}
  <div aria-live="polite" className="min-h-[56px] max-w-lg w-full">
    {status === "available" && (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
        <div className="text-green-600 text-2xl">✅</div>
        <div>
          <p className="font-semibold text-green-800">Service available</p>
          <p className="text-sm text-green-700">{message}</p>
        </div>
      </div>
    )}

    {status === "unavailable" && (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
        <div className="text-amber-700 text-2xl">📭</div>
        <div>
          <p className="font-semibold text-amber-900">Not available</p>
          <p className="text-sm text-amber-800">{message}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() =>
                alert("Thanks — we have recorded a coverage request for this pincode.")
              }
              className="text-sm px-3 py-1 rounded-md border border-amber-200 bg-amber-100"
            >
              Request coverage
            </button>

            <button
              type="button"
              onClick={() => {
                setPincode("");
                setStatus(null);
                setMessage("");
              }}
              className="text-sm px-3 py-1 rounded-md border border-gray-200 bg-white"
            >
              Check another
            </button>
          </div>
        </div>
      </div>
    )}

    {status === "error" && (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
        <div className="text-red-600 text-2xl">⚠️</div>
        <div>
          <p className="font-semibold text-red-800">Error</p>
          <p className="text-sm text-red-700">{message}</p>
        </div>
      </div>
    )}

    {!status && !loading && (
      <div className="text-sm text-gray-500">
        Enter your pincode to see if home collection is available.
      </div>
    )}
  </div>

  {/* Quick picks: popular pincodes */}
  {/* <div className="pt-2 text-center">
    <p className="text-xs text-gray-400 mb-2">Popular pincodes</p>
    <div className="flex flex-wrap justify-center gap-2">
      {Array.from(availablePincodes)
        .slice(0, 5)
        .map((pin) => (
          <button
            key={pin}
            type="button"
            onClick={() => handleQuickPick(pin)}
            className="px-3 py-1 text-sm rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100"
          >
            {pin}
          </button>
        ))}
    </div>
  </div> */}
</form>

    </div>
  );
}

