// Define a more complete Ethereum provider interface
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (
    eventName: string,
    callback: (...args: any[]) => void
  ) => void;
  selectedAddress: string | null;
  networkVersion: string;
  chainId: string;
  isConnected: () => boolean;
  enable: () => Promise<string[]>;
}

// Update the Window interface
interface Window {
  ethereum?: EthereumProvider;
}
