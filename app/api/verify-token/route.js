import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Ask Stripe directly whether this checkout session was actually paid.
    // We never trust the client-supplied token on its own.
    const session = await stripe.checkout.sessions.retrieve(token);
    const valid = session.payment_status === 'paid';

    return NextResponse.json({ valid });
  } catch (error) {
    console.error('Token verification error:', error.message);
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
