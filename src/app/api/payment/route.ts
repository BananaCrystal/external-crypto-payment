import { NextResponse } from 'next/server';
import type { PaymentDetails, ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const data: PaymentDetails = await request.json();
    
    // Transform the data to match BananaCrystal's API format
    const paymentData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phoneNumber,
      address: data.address,
      signup_consent: data.signUpConsent,
      amount: data.amount,
      currency: data.currency,
      usd_amount: data.usd_amount,
      fees: data.fees,
      trxn_hash: data.trxn_hash,
    };
    
    const response = await fetch(
      `https://app.bananacrystal.com/api/v1/stores/${data.store_id}/external_store_payments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Payment verification failed');
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      data: result
    } as ApiResponse);
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Payment verification failed'
      } as ApiResponse,
      { status: 500 }
    );
  }
}
