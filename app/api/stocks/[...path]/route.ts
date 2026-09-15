import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const subpath = (path || []).join('/');
    const search = request.nextUrl.search; // includes '?query=...'

    // Primary URL: /stocks/...
    const primaryUrl = `${BACKEND_API_URL}/stocks${subpath ? `/${subpath}` : ''}${search}`;

    try {
      const response = await fetch(primaryUrl, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'WeeStox-Frontend/1.0',
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }

      // If primary returned 404, attempt fallback to /company/stocks/...
      if (response.status === 404) {
        const fallbackUrl = `${BACKEND_API_URL}/company/stocks${subpath ? `/${subpath}` : ''}${search}`;
        const fallbackRes = await fetch(fallbackUrl, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'WeeStox-Frontend/1.0',
          },
          cache: 'no-store',
        });

        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          return NextResponse.json(fallbackData);
        }
      }

      const errorText = await response.text();
      return NextResponse.json(
        { status: 0, message: 'Backend error', error: errorText },
        { status: response.status }
      );
    } catch (networkErr: any) {
      console.error(`[Stock API Proxy Error] ${primaryUrl}:`, networkErr);
      return NextResponse.json(
        { status: 0, message: 'Backend connection failed', error: networkErr?.message },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error('[Stock Route Handler Error]:', err);
    return NextResponse.json(
      { status: 0, message: 'Internal server error', error: err?.message },
      { status: 500 }
    );
  }
}
