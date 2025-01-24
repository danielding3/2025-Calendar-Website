import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const SHIPPING_RATES = {
  US: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 500,
          currency: 'usd',
        },
        display_name: 'US Standard Shipping (USPS Ground)',
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: 3,
          },
          maximum: {
            unit: 'business_day',
            value: 5,
          },
        },
      },
    },
  ],
  KR: [
    {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
          amount: 200,
          currency: 'usd',
        },
        display_name: 'Korea International Shipping (EMS)',
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: 7,
          },
          maximum: {
            unit: 'business_day',
            value: 10,
          },
        },
      },
    },
  ],
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address } = body;

    if (!address || !address.country) {
      return NextResponse.json(
        { error: 'No address provided' },
        { status: 400 }
      );
    }

    const countryCode = address.country;
    const availableRates = SHIPPING_RATES[countryCode as keyof typeof SHIPPING_RATES] || [];

    return NextResponse.json({ shipping_options: availableRates });
  } catch (err) {
    console.error('Error calculating shipping rates:', err);
    return NextResponse.json(
      { error: 'Error calculating shipping rates' },
      { status: 500 }
    );
  }
}