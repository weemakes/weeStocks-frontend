import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.search; // '?country=India&page=1...'
    const primaryUrl = `${BACKEND_API_URL}/stocks${search}`;

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

      // Fallback to /company/stocks if primary returned 404
      if (response.status === 404) {
        const fallbackUrl = `${BACKEND_API_URL}/company/stocks${search}`;
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

      try {
        const errorJson = await response.json();
        return NextResponse.json(errorJson, { status: response.status });
      } catch {
        const errorText = await response.text();
        return NextResponse.json(
          {
            status: 0,
            statusCode: response.status,
            message: 'Backend error',
            error: errorText,
            timestamp: new Date().toISOString(),
            path: '/api/stocks',
          },
          { status: response.status }
        );
      }
    } catch (networkErr: any) {
      console.error(`[Stock Root API Proxy Error] ${primaryUrl}:`, networkErr);
      return NextResponse.json(
        {
          status: 0,
          statusCode: 502,
          message: 'Backend connection failed',
          error: networkErr?.message,
          timestamp: new Date().toISOString(),
          path: '/api/stocks',
        },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error('[Stock Root Route Handler Error]:', err);
    return NextResponse.json(
      {
        status: 0,
        statusCode: 500,
        message: 'Internal server error',
        error: err?.message,
        timestamp: new Date().toISOString(),
        path: '/api/stocks',
      },
      { status: 500 }
    );
  }
}
