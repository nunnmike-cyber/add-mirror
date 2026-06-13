import { NextResponse } from 'next/server';
import { paidSessions } from '../webhook/route';

export async function POST(request) {
  try {
    const { token } = await request.json();
    const valid = paidSessions.has(token);
    return NextResponse.json({ valid });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
