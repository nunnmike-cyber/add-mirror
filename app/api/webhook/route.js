import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Access is now verified directly against Stripe in /api/verify-token,
  // so this webhook is just for logging/future use (e.g. receipt emails)
  // rather than gating access.
  if (event.type === 'checkout.session.completed') {
    console.log('Payment confirmed:', event.data.object.id);
  }

  return NextResponse.json({ received: true });
}
