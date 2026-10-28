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
            path: `/api/stocks/${subpath}`,
          },
          { status: response.status }
        );
      }
    } catch (networkErr: any) {
      console.error(`[Stock API Proxy Error] ${primaryUrl}:`, networkErr);
      return NextResponse.json(
        {
          status: 0,
          statusCode: 502,
          message: 'Backend connection failed',
          error: networkErr?.message,
          timestamp: new Date().toISOString(),
          path: `/api/stocks/${subpath}`,
        },
        { status: 502 }
      );
    }
  } catch (err: any) {
    console.error('[Stock Route Handler Error]:', err);
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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const subpath = (path || []).join('/');
    const search = request.nextUrl.search;
    const primaryUrl = `${BACKEND_API_URL}/stocks${subpath ? `/${subpath}` : ''}${search}`;

    let bodyData: string | undefined = undefined;
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        bodyData = JSON.stringify(await request.json());
      }
    } catch {
      // Body may be empty for query-param based POST requests
    }

    try {
      const response = await fetch(primaryUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'WeeStox-Frontend/1.0',
        },
        body: bodyData,
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }

      if (response.status === 404) {
        const fallbackUrl = `${BACKEND_API_URL}/company/stocks${subpath ? `/${subpath}` : ''}${search}`;
        const fallbackRes = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'WeeStox-Frontend/1.0',
          },
          body: bodyData,
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
            path: `/api/stocks/${subpath}`,
          },
          { status: response.status }
        );
      }
    } catch (networkErr: unknown) {
      console.error(`[Stock API Proxy POST Error] ${primaryUrl}:`, networkErr);
      const message = networkErr instanceof Error ? networkErr.message : 'Backend connection failed';
      return NextResponse.json(
        {
          status: 0,
          statusCode: 502,
          message: 'Backend connection failed',
          error: message,
          timestamp: new Date().toISOString(),
          path: `/api/stocks/${subpath}`,
        },
        { status: 502 }
      );
    }
  } catch (err: unknown) {
    console.error('[Stock Route Handler POST Error]:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      {
        status: 0,
        statusCode: 500,
        message: 'Internal server error',
        error: message,
        timestamp: new Date().toISOString(),
        path: '/api/stocks',
      },
      { status: 500 }
    );
  }
}
