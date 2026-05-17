import React from "react";
import SendOtpComponent from "../components/SendOtpComponent";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SendOtpTest() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            OTP Testing Page
          </h1>
          <p className="text-center mb-8 text-gray-600">
            This page demonstrates the OTP functionality using the secure
            backend API.
          </p>
          <SendOtpComponent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
