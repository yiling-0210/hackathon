"use client";
import React, { useEffect, useState } from "react";
import LandingPage from "./landingPage";
import MainContent from "./mainPage";

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const handleWalletCreated = (walletAddress) => {
    setWalletAddress(walletAddress); // This will trigger a re-render and show MainContent
  };

  return walletAddress ? <MainContent /> : <LandingPage onWalletCreated={handleWalletCreated} />;
}
