import { NextRequest } from 'next/server';
import http from 'node:http';
import https from 'node:https';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  const targetUrl = new URL('/v2/ipos/stream', BACKEND_URL);
  const isHttps = targetUrl.protocol === 'https:';
  const client = isHttps ? https : http;

  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;

      // Keepalive heartbeat ping every 20 seconds prevents proxy & undici timeouts
      const keepAliveInterval = setInterval(() => {
        if (isClosed) return;
        try {
          controller.enqueue(new TextEncoder().encode(': keepalive\n\n'));
        } catch {
          clearInterval(keepAliveInterval);
        }
      }, 20000);

      const backendReq = client.request(
        targetUrl,
        {
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
            'Cache-Control': 'no-cache',
          },
        },
        (backendRes) => {
          backendRes.on('data', (chunk: Buffer) => {
            if (isClosed) return;
            try {
              controller.enqueue(chunk);
            } catch {
              isClosed = true;
            }
          });

          backendRes.on('end', () => {
            if (isClosed) return;
            isClosed = true;
            clearInterval(keepAliveInterval);
            try {
              controller.close();
            } catch {}
          });

          backendRes.on('error', () => {
            if (isClosed) return;
            isClosed = true;
            clearInterval(keepAliveInterval);
            try {
              controller.close();
            } catch {}
          });
        }
      );

      backendReq.on('error', () => {
        if (isClosed) return;
        isClosed = true;
        clearInterval(keepAliveInterval);
        try {
          controller.close();
        } catch {}
      });

      backendReq.end();

      req.signal.addEventListener('abort', () => {
        isClosed = true;
        clearInterval(keepAliveInterval);
        backendReq.destroy();
        try {
          controller.close();
        } catch {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
