"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { sendUsdtPayment, getUsdtBalance } from "@/helpers/walletHelpers";
import WalletConnect from "./WalletConnect";

interface DirectPaymentProps {
  recipientAddress: string;
  amountUsd: number;
  onPaymentComplete: (hash: string) => void;
  onPaymentStart: () => void;
  onPaymentError: (error: Error) => void;
  onWalletDisconnect?: () => void;
  disabled?: boolean;
  timerActive: boolean;
  timeLeft: number;
  handleMoreTime: () => void;
}

// Add type for Ethereum error
interface EthereumError extends Error {
  code?: string;
  message: string;
}

// Add type guard function
const isEthereumError = (error: unknown): error is EthereumError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as EthereumError).message === "string"
  );
};

const DirectPayment: React.FC<DirectPaymentProps> = ({
  recipientAddress,
  amountUsd,
  onPaymentComplete,
  onPaymentStart,
  onPaymentError,
  onWalletDisconnect,
  disabled = false,
  timerActive,
  timeLeft,
  handleMoreTime,
}) => {
  const [connected, setConnected] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  // Add formatTime helper function
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Fetch USDT balance when wallet is connected
  useEffect(() => {
    let mounted = true;
    let loadingTimer: NodeJS.Timeout | null = null;

    const fetchBalance = async () => {
      if (connected && signer?.provider && connectedAddress) {
        try {
          // Start with loading state and ensure it stays for at least 1 second to avoid flickering
          setBalance("Loading...");
          const startTime = Date.now();

          // Fetch the balance (this might fail)
          let balanceStr;
          try {
            balanceStr = await getUsdtBalance(
              signer.provider,
              connectedAddress
            );
          } catch (err: unknown) {
            console.error("Failed to fetch balance:", err);

            if (mounted) {
              setError(
                "Could not check USDT balance. Please verify you're connected to the Polygon network."
              );
              setBalance("--");
            }
            return;
          }

          // Ensure the loading state is shown for at least 1 second to avoid flicker
          const elapsed = Date.now() - startTime;
          if (elapsed < 1000) {
            loadingTimer = setTimeout(() => {
              if (mounted) {
                setBalance(balanceStr);
                setInsufficientFunds(parseFloat(balanceStr) < amountUsd);
                setError(null);
              }
            }, 1000 - elapsed);
          } else if (mounted) {
            // If already past 1 second, update immediately
            setBalance(balanceStr);
            setInsufficientFunds(parseFloat(balanceStr) < amountUsd);
            setError(null);
          }
        } catch (err) {
          // This is a catch-all for any other errors
          console.error("Unexpected error in balance fetch:", err);
          if (mounted) {
            setBalance("--");
          }
        }
      } else {
        // Not connected or missing data
        if (mounted) {
          setBalance(null);
        }
      }
    };

    fetchBalance();

    // Clean up function
    return () => {
      mounted = false;
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }
    };
  }, [connected, signer, connectedAddress, amountUsd]);

  // Handle wallet connection
  const handleWalletConnected = (
    address: string,
    walletSigner: ethers.Signer
  ) => {
    setConnected(true);
    setConnectedAddress(address);
    setSigner(walletSigner);
    setError(null);
  };

  // Handle wallet disconnection - improved with timeout to ensure complete disconnection
  const handleWalletDisconnected = () => {
    console.log("Wallet disconnected in DirectPayment component");

    // First update local state
    setConnected(false);
    setConnectedAddress(null);
    setSigner(null);
    setBalance(null);
    setInsufficientFunds(false);
    setError(null);

    // Clean up storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("directPaymentData");
      localStorage.setItem("walletManuallyDisconnected", "true");

      // Only reload if it's an explicit disconnect, not on connection errors
      const wasConnected = localStorage.getItem("walletConnected") === "true";

      if (wasConnected) {
        // Force a connection reset with a page reload after a short delay
        // This ensures MetaMask and other wallets fully disconnect
        setTimeout(() => {
          // Call parent disconnect handler before reload
          if (onWalletDisconnect) {
            onWalletDisconnect();
          }

          // Reload the page to ensure a clean state
          window.location.reload();
        }, 100);
      } else {
        // For connection errors, just notify the parent without reloading
        if (onWalletDisconnect) {
          onWalletDisconnect();
        }
      }
    } else {
      // If window is not available, still call the parent handler
      if (onWalletDisconnect) {
        onWalletDisconnect();
      }
    }
  };

  // Process payment
  const handlePayNow = async () => {
    if (!connected || !signer?.provider || !recipientAddress || disabled) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      onPaymentStart();

      // Check if we're on the correct network before attempting payment
      try {
        const network = await signer.provider.getNetwork();
        const chainId = Number(network.chainId);

        if (chainId !== 137 && chainId !== 80001) {
          throw new Error(
            "Please switch to the Polygon/MATIC network before making a payment."
          );
        }
      } catch (networkError: unknown) {
        console.warn("Network detection error:", networkError);
        // Continue anyway, the payment will fail with a more specific error if needed
      }

      // Send the payment
      const result = await sendUsdtPayment(signer, recipientAddress, amountUsd);

      if (result.success && result.hash) {
        onPaymentComplete(result.hash);
      } else {
        throw new Error("Payment failed with no error message");
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);

      // Create a user-friendly error message
      let errorMessage = "Payment failed. Please try again.";

      if (isEthereumError(err)) {
        if (err.message.includes("insufficient funds")) {
          errorMessage =
            "Insufficient USDT balance. Please add more USDT to your wallet.";
        } else if (err.message.includes("user rejected")) {
          errorMessage =
            "Transaction was rejected in your wallet. Please try again.";
        } else if (err.message.includes("switch to the Polygon")) {
          errorMessage =
            "Please switch to the Polygon/MATIC network to make your payment.";
        } else if ("code" in err && err.code === "CALL_EXCEPTION") {
          errorMessage =
            "Contract call failed. Please ensure you're on the Polygon network.";
        } else {
          errorMessage = `Error: ${err.message}`;
        }
      }

      setError(errorMessage);
      onPaymentError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Timer Display - Moved to top */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="font-medium text-gray-700">Time Remaining:</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-lg font-bold ${
                timerActive ? "text-purple-800" : "text-red-600"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
            {!timerActive && (
              <button
                type="button"
                onClick={handleMoreTime}
                className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2"
                disabled={disabled}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Need More Time
              </button>
            )}
          </div>
        </div>
        {!timerActive && (
          <p className="text-sm text-purple-800 mt-2 flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Your payment time has expired. Click "Need More Time" to extend your
            session.
          </p>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Option 1: Quick Wallet Payment
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Connect your wallet for a one-click payment experience. Your
          transaction hash will be automatically filled in.
        </p>

        {/* Balance display */}
        {connected && balance && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">Your USDT Balance:</p>
            <p
              className={`font-medium ${
                insufficientFunds ? "text-red-600" : "text-green-600"
              }`}
            >
              ${balance} USDT
            </p>
            {insufficientFunds && (
              <p className="text-xs text-red-600 mt-1">
                Insufficient funds. Please add more USDT to continue.
              </p>
            )}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 p-3 rounded-lg mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Wallet connect button */}
        <div className="mb-4">
          <WalletConnect
            onConnected={handleWalletConnected}
            onDisconnected={handleWalletDisconnected}
            loading={processing || disabled}
          />
        </div>

        {/* Pay Now button - only shown when wallet is connected */}
        {connected && (
          <button
            type="button"
            onClick={handlePayNow}
            disabled={
              processing || insufficientFunds || disabled || !recipientAddress
            }
            className={`w-full mt-3 bg-[#4c3f84] text-white py-3 rounded-lg transition-all duration-300 flex items-center justify-center
              ${
                processing || insufficientFunds || disabled || !recipientAddress
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:opacity-90 transform hover:scale-[1.01] active:scale-[0.99]"
              }`}
          >
            {processing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Pay ${amountUsd.toFixed(2)} USDT Now
              </>
            )}
          </button>
        )}

        <p className="text-xs text-gray-500 mt-3 text-center">
          Connect your wallet to make a direct USDT payment on the Polygon
          network.
        </p>
      </div>
    </div>
  );
};

export default DirectPayment;
