export interface StoreDetails {
  id: string;
  name: string;
  store_username: string | null;
  store_support_email: string | null;
  store_payment_email: string | null;
  store_url: string | null;
  wallet_address: string | null; 
  store_logo: string | null;
}

export interface CrmDetails {
  enabled: boolean;
  provider: string;
  apiKey: string;
  listId: string;
  tagIncomplete: string;
  tagComplete: string;
}

export interface PaymentFormProps {
  storeId: string;
  amount: number;
  currency: string;
  description: string;
  usd_amount: number;
  redirect_url?: string;
  walletAddressFromParams?: string;
  wallet_address?: string;
  crmDetails?: CrmDetails;
  gohighlevelApiKey?: string;
  productName?: string;
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  currency: string;
  amount: number;
  usd_amount: number;
  trxn_hash: string;
}
