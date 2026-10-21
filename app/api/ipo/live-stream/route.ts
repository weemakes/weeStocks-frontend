import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const backendStreamUrl = `${BACKEND_API_URL}/v2/ipos/stream`;

  try {
    const upstreamRes = await fetch(backendStreamUrl, {
      headers: {
        Accept: 'text/event-stream',
        'User-Agent': 'WeeStox-Frontend/1.0',
      },
      cache: 'no-store',
    });

    if (!upstreamRes.ok || !upstreamRes.body) {
      return new NextResponse(`Upstream stream error: ${upstreamRes.status}`, {
        status: upstreamRes.status || 502,
      });
    }

    // Pipe upstream SSE body directly to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstreamRes.body!.getReader();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err: any) {
    console.error('[IPO Live Stream Proxy Error]:', err);
    return new NextResponse(`SSE connection failed: ${err?.message || 'unknown error'}`, {
      status: 502,
    });
  }
}
