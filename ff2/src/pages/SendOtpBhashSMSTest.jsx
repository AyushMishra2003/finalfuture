import React from "react";
import SendOtpBhashSMS from "../components/SendOtpBhashSMS";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SendOtpBhashSMSTest() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            BhashSMS OTP Testing Page
          </h1>
          <p className="text-center mb-8 text-gray-600">
            This page demonstrates the secure OTP functionality using BhashSMS
            via the backend API.
          </p>
          <SendOtpBhashSMS />
        </div>
      </main>
      <Footer />
    </div>
  );
}
