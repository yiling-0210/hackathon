"use client";
import { useState, useEffect } from "react";
import MintTokenModal from "./components/Mint-token";
import TransferTokenModal from "./components/Transfer-token";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainContent() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [lastTransactionHash, setLastTransactionHash] = useState(null); // New state for last transaction hash


  const openMintModal = () => {
    setIsMintModalOpen(true);
  };

  const closeMintModal = () => {
    setIsMintModalOpen(false);
  };

  const openTransferModal = () => {
    setIsTransferModalOpen(true);
  };

  const closeTransferModal = () => {
    setIsTransferModalOpen(false);
  };

  useEffect(() => {
    const storedWalletAddress = sessionStorage.getItem("walletAddress");
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }
  }, []);

  const clearWalletAddress = () => {
    sessionStorage.removeItem("walletAddress");
    setWalletAddress(null);
  };

  const handleMintSubmit = async (data) => {
    try {
      console.log("Submitting data:", data); // Debugging line
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/mint`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: data.walletAddress,     // Correct field name
            contract_address: data.contractAddress, // Correct field name
            callback_url: data.fallbackUrl,         // Correct field name
            to: data.to,                            // Include 'to' field
            amount: data.amount,                    // Include 'amount' field
          }),
        }
      );
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to mint token: ${errorDetails}`);
      }
  
      const result = await response.json();
      console.log("API response:", result);
  
      // Extract walletAddress from the result
      const wallet_address = data.to;
      const transactionHash = result.result.transactionHash;
  
      if (!wallet_address) {
        throw new Error("Wallet address not found in the response");
      }

      setLastTransactionHash(transactionHash);
  
      toast.success(
        `🦄 Minted token successfully!
        Wallet address: ${wallet_address}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      closeMintModal();
    } catch (error) {
      console.error("Error minting token:", error);
      toast.error(`🦄 Error minting token: ${error.message}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  };
  
  
  const handleTransferSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/token/token-transfer`,
        {
          method: "POST",
          headers: {
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: data.walletAddress,     // Correct field name
            contract_address: data.contractAddress, // Correct field name
            callback_url: data.fallbackUrl,         // Correct field name
            to: data.to,                            // Include 'to' field
            amount: data.amount,                    // Include 'amount' field
          }),
        }
      );
  
      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to transfer token: ${errorDetails}`);
      }
  
      const result = await response.json();
      console.log("Transferred Token:", result);
  
      // Extract walletAddress
      const walletAddress = data.to;
      const transactionHash = result.result.transactionHash;
  
      if (!walletAddress) {
        throw new Error("Wallet address not found in the response");
      }
  
      // Optionally store the wallet address in sessionStorage
      sessionStorage.setItem("walletAddress", walletAddress);
      setLastTransactionHash(transactionHash); // Update state with transaction hash
  
      toast.success(
        `🦄 Token transferred successfully!
        Wallet address: ${walletAddress}`,
        {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
  
      closeTransferModal();
    } catch (error) {
      console.error("Error transferring token:", error);
      toast.error(`🦄 Error transferring token: ${error.message}`, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

    // Function to copy text to clipboard
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        toast.success('Transaction hash copied to clipboard!', {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }, (err) => {
        console.error('Failed to copy: ', err);
      });
    };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-center "
    style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <h1 className="text-3xl font-bold text-center">
        <h1 className="text-3xl font-bold mb-4">MedEco System：</h1>
        <h1 className="text-3xl font-bold mb-4">Economic System for Health Care using Blockchain Tech</h1>
      </h1>
      <p className="text-sm text-gray-500 lowercase font-normal mt-4 text-center">
        {walletAddress ? (
          <>
            {`Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(
              -4
            )}`}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={clearWalletAddress}
                style={{ width: '730.76px', height: '37.38px' }}
                className="w-full mt-4 border rounded-md py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Disconnect Wallet
              </button>
              <button
                onClick={openMintModal}
                style={{ width: '730.76px', height: '37.38px' }}
                className="mt-4 border w-full rounded-md py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Mint Token
              </button>

              <button
                onClick={openTransferModal}
                style={{ width: '730.76px', height: '37.38px' }}
                className="mt-4 w-full border rounded-md py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Transfer Token
              </button>
              </div>
              <div className="flex flex-col items-center justify-center">
              {lastTransactionHash && (
                <div className="mt-4 text-sm text-gray-700 flex items-center">
                  <strong>Last Transaction:</strong>
                  <span className="ml-2">{lastTransactionHash}</span>
                  <button
                    onClick={() => copyToClipboard(lastTransactionHash)}
                    className="ml-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Copy
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          "Create Wallet to Get Started"
        )}
      </p>
      <AnimatePresence>
        {isMintModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MintTokenModal
              onSubmit={handleMintSubmit}
              onClose={closeMintModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTransferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <TransferTokenModal
              onSubmit={handleTransferSubmit}
              onClose={closeTransferModal}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
}
