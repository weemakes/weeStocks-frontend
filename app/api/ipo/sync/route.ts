import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST() {
  try {
    const upstreamRes = await fetch(`${BACKEND_API_URL}/v2/ipos/sync-live-subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'WeeStox-Frontend/1.0',
      },
      cache: 'no-store',
    });

    const data = await upstreamRes.json();
    return NextResponse.json(data, { status: upstreamRes.status });
  } catch (err: any) {
    console.error('[IPO Sync Live Subscriptions Error]:', err);
    return NextResponse.json(
      { status: 0, message: 'Failed to sync live subscriptions', error: err?.message },
      { status: 502 }
    );
  }
}
