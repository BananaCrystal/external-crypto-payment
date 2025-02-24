export interface PaymentDetails {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  signUpConsent: boolean;
  currency: string;
  amount: number;
  usd_amount: number;
  fees: number;
  store_id: string;
  trxn_hash?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}
