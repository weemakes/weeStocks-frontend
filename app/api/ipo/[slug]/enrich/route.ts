import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const upstreamUrl = `${BACKEND_API_URL}/v2/ipos/${encodeURIComponent(slug)}/enrich-premium`;

    const upstreamRes = await fetch(upstreamUrl, {
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
    console.error('[IPO Enrich Premium Error]:', err);
    return NextResponse.json(
      { status: 0, message: 'Failed to enrich IPO details', error: err?.message },
      { status: 502 }
    );
  }
}
