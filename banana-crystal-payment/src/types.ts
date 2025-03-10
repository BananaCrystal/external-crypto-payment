export interface ThemeOptions {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
}

export interface PaymentFormProps {
  storeId: string;
  amount: number;
  currency: string;
  description: string;
  walletAddress: string;
  redirectUrl?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
  modalPosition?: 'top' | 'center' | 'bottom';
  modalSize?: 'small' | 'default' | 'large' | 'full';
  theme?: ThemeOptions;
}

export interface PaymentDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  signUpConsent: boolean;
  currency: string;
  amount: number;
  usdAmount: number;
  fees: number;
  trxnHash?: string;
  walletAddress: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CountryCode {
  code: string;
  country: string;
}

export interface Currency {
  code: string;
  name: string;
}
