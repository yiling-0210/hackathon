"use client";
import React, { useState, useEffect } from "react";
import CreateWalletModal from "./components/Create-wallet";

export default function LandingPage({ onWalletCreated }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      onWalletCreated(storedWalletAddress);
    }
  }, [onWalletCreated]);

  const handleWalletCreation = (data) => {
    setWalletAddress(data.walletAddress);
    sessionStorage.setItem("walletAddress", data.walletAddress);
    setIsModalOpen(false);
    onWalletCreated(data.walletAddress);
  };

  const handleDownloadWhitePaper = () => {
    const link = document.createElement("a");
    link.href = "/whitepaper.docx"; 
    link.download = "MedEco_WhitePaper.docx";
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen"
      style={{
        backgroundImage: "url('/background1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <h1 className="text-3xl font-bold mb-4">Welcome to MedEco System!</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        MedEco System is an economic system for healthcare using blockchain technology.
        Create your wallet to get started.
      </p>
      {walletAddress ? (
        <h2 className="text-xl font-semibold">Wallet Connected: {walletAddress}</h2>
      ) : (
        <>
          {isModalOpen && (
            <CreateWalletModal onSubmit={handleWalletCreation} onClose={() => setIsModalOpen(false)} />
          )}
          <div className="flex flex-col space-y-4 items-center">
            <button
              className="bg-blue-500 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out hover:bg-blue-600"
              onClick={handleDownloadWhitePaper}
            >
              Download White Paper
            </button>
          </div>
        </>
      )}
    </div>
  );
}
