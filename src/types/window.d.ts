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

// Twitter pixel interface
interface TwitterPixelData {
  value?: number;
  currency?: string;
  conversion_id?: string;
  email_address?: string;
  phone_number?: string;
  contents?: Array<{
    content_type?: string;
    content_id?: string;
    content_name?: string;
    content_price?: number;
    num_items?: number;
    content_group_id?: string;
  }>;
}

// Update the Window interface
interface Window {
  ethereum?: EthereumProvider;
  twq?: (action: string, eventId: string, data?: TwitterPixelData) => void;
}
