import { ethers } from "ethers";

// Interface for wallet connection state
interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  provider: any | null;
  signer: ethers.Signer | null;
}

// Polygon/MATIC network chain ID
export const POLYGON_CHAIN_ID = 137;
export const POLYGON_TESTNET_CHAIN_ID = 80001; // Mumbai testnet
export const POLYGON_MUMBAI_CHAIN_ID = 80001;

// Token contract addresses per network
export const CONTRACT_ADDRESSES = {
  // Polygon Mainnet
  [POLYGON_CHAIN_ID]: {
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  },
  // Polygon Mumbai Testnet
  [POLYGON_TESTNET_CHAIN_ID]: {
    USDT: "0x3813e82e6f7098b9583FC0F33a962D02018B6803", // Mumbai USDT - if you're on testnet
  },
};

// Default to mainnet if network not supported
export const getContractAddress = (chainId: number, token: string) => {
  if (CONTRACT_ADDRESSES[chainId] && CONTRACT_ADDRESSES[chainId][token]) {
    return CONTRACT_ADDRESSES[chainId][token];
  }
  console.warn(
    `No contract address for ${token} on chain ID ${chainId}, falling back to Polygon Mainnet`
  );
  return CONTRACT_ADDRESSES[POLYGON_CHAIN_ID][token];
};

// ERC20 USDT ABI (minimal for transfers)
export const USDT_ABI = [
  "function transfer(address to, uint value) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// USDT contract address on Polygon - use this as a fallback
export const USDT_CONTRACT_ADDRESS = CONTRACT_ADDRESSES[POLYGON_CHAIN_ID].USDT;

/**
 * Connect to MetaMask or other Web3 provider
 * @returns {Promise<WalletState>} Connected wallet state
 */
export const connectWallet = async (): Promise<WalletState> => {
  if (!window.ethereum) {
    throw new Error("No Ethereum wallet found. Please install MetaMask.");
  }

  try {
    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    return {
      address: accounts[0],
      isConnected: true,
      chainId,
      provider,
      signer,
    };
  } catch (error) {
    console.error("Failed to connect wallet:", error);
    throw error;
  }
};

/**
 * Switch to Polygon network
 * @param {any} provider Ethereum provider
 * @returns {Promise<boolean>} Success status
 */
export const switchToPolygonNetwork = async (
  provider: any
): Promise<boolean> => {
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${POLYGON_CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
              chainName: "Polygon Mainnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              rpcUrls: ["https://polygon-rpc.com/"],
              blockExplorerUrls: ["https://polygonscan.com/"],
            },
          ],
        });
        return true;
      } catch (addError) {
        console.error("Failed to add Polygon network:", addError);
        return false;
      }
    }
    console.error("Failed to switch to Polygon network:", switchError);
    return false;
  }
};

/**
 * Send USDT payment
 * @param {ethers.Signer} signer Wallet signer
 * @param {string} recipient Recipient address
 * @param {number} amount Amount in USD
 * @returns {Promise<{hash: string, success: boolean}>} Transaction result
 */
export const sendUsdtPayment = async (
  signer: ethers.Signer,
  recipient: string,
  amount: number
): Promise<{ hash: string; success: boolean }> => {
  try {
    // Get the current network
    let chainId = POLYGON_CHAIN_ID; // Default to Polygon Mainnet

    try {
      const network = await signer.provider.getNetwork();
      chainId = Number(network.chainId);
      console.log(`Connected to network with chain ID: ${chainId}`);
    } catch (networkError) {
      console.warn(
        "Failed to get network, defaulting to Polygon Mainnet:",
        networkError
      );
    }

    // Get the appropriate contract address for this network
    const contractAddress = getContractAddress(chainId, "USDT");
    console.log(`Using USDT contract address: ${contractAddress} for payment`);

    const contract = new ethers.Contract(contractAddress, USDT_ABI, signer);

    // Get decimals
    const decimals = await contract.decimals();
    console.log(`USDT decimals: ${decimals}, sending amount: ${amount}`);

    // Convert amount to correct decimals (usually 6 for USDT)
    const amountInWei = ethers.parseUnits(amount.toString(), decimals);
    console.log(`Amount in wei: ${amountInWei.toString()}`);

    console.log(`Sending ${amount} USDT to ${recipient}`);
    // Send transaction
    const transaction = await contract.transfer(recipient, amountInWei);
    console.log(`Transaction hash: ${transaction.hash}`);

    // Wait for transaction confirmation
    console.log("Waiting for transaction confirmation...");
    const receipt = await transaction.wait();
    console.log("Transaction confirmed:", receipt);

    return {
      hash: receipt.hash,
      success: true,
    };
  } catch (error) {
    console.error("Failed to send USDT payment:", error);

    // Try to provide more helpful error messages
    if (error.message && error.message.includes("insufficient funds")) {
      throw new Error(
        "Insufficient funds to complete the transaction. Please check your USDT balance."
      );
    }

    if (error.message && error.message.includes("user rejected")) {
      throw new Error(
        "Transaction was rejected. Please try again and confirm the transaction in your wallet."
      );
    }

    throw error;
  }
};

/**
 * Get USDT balance
 * @param {ethers.Provider} provider Ethereum provider
 * @param {string} address Wallet address
 * @returns {Promise<string>} USDT balance formatted with 2 decimals
 */
export const getUsdtBalance = async (
  provider: ethers.Provider,
  address: string
): Promise<string> => {
  try {
    // First, get the current network to use the right contract address
    let chainId = POLYGON_CHAIN_ID; // Default to Polygon Mainnet

    try {
      const network = await provider.getNetwork();
      chainId = Number(network.chainId);
      console.log(`Connected to network with chain ID: ${chainId}`);
    } catch (networkError) {
      console.warn(
        "Failed to get network, defaulting to Polygon Mainnet:",
        networkError
      );
      // Continue with default chain ID
    }

    // Get the appropriate contract address for this network
    const contractAddress = getContractAddress(chainId, "USDT");
    console.log(
      `Using USDT contract address: ${contractAddress} for chain ID: ${chainId}`
    );

    // Create contract instance
    const contract = new ethers.Contract(contractAddress, USDT_ABI, provider);

    try {
      // Get decimals first - this is where most errors happen
      let decimals;
      try {
        decimals = await contract.decimals();
        console.log(`USDT decimals: ${decimals}`);
      } catch (decimalsError) {
        console.error("Failed to get token decimals:", decimalsError);
        // Default to 6 decimals for USDT if we can't get it from the contract
        decimals = 6;

        // If we're not on Polygon, provide a clear message
        if (
          chainId !== POLYGON_CHAIN_ID &&
          chainId !== POLYGON_TESTNET_CHAIN_ID
        ) {
          throw new Error(
            `Please switch to Polygon network for USDT balance. Current chain: ${chainId}`
          );
        } else {
          throw new Error(
            "Could not access USDT contract. Please try again later."
          );
        }
      }

      // Then get balance - wrap this in a separate try/catch for more specific error handling
      let balance;
      try {
        balance = await contract.balanceOf(address);
        console.log(`Raw balance: ${balance.toString()}`);
      } catch (balanceError) {
        console.error("Failed to get token balance:", balanceError);

        if (
          balanceError.message &&
          balanceError.message.includes("call exception")
        ) {
          throw new Error(
            "Network error while checking balance. Please try again."
          );
        }

        throw new Error(
          "Could not retrieve your USDT balance. Please check your connection."
        );
      }

      // Format the balance with 2 decimal places for display
      try {
        const formatted = ethers.formatUnits(balance, decimals);
        // Return with 2 decimal places
        return parseFloat(formatted).toFixed(2);
      } catch (formatError) {
        console.error("Error formatting balance:", formatError);
        return "0.00";
      }
    } catch (contractError) {
      console.error("Contract call error:", contractError);

      // If we're not on Polygon, show a more helpful error
      if (
        chainId !== POLYGON_CHAIN_ID &&
        chainId !== POLYGON_TESTNET_CHAIN_ID
      ) {
        throw new Error(
          `Please switch to Polygon network for USDT balance. Current chain: ${chainId}`
        );
      }

      throw new Error(
        "Could not check USDT balance. Please verify your connection."
      );
    }
  } catch (error) {
    console.error("Failed to get USDT balance:", error);

    // Convert technical error messages to user-friendly ones
    if (error.message) {
      if (
        error.message.includes("network") ||
        error.message.includes("chain")
      ) {
        throw new Error(
          "Please connect to the Polygon network to check your balance."
        );
      }
    }

    // For all other errors, just return a generic message
    throw new Error("Could not check USDT balance. Please try again later.");
  }
};
