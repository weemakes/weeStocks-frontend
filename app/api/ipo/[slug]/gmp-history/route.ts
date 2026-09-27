import { NextResponse } from "next/server";
import { getIPOGmpHistory } from "@/features/ipo/api";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  if (!/^[a-z0-9-]+$/i.test(slug)) {
    return NextResponse.json({ message: "Invalid IPO slug" }, { status: 400 });
  }

  try {
    const response = await getIPOGmpHistory(slug);
    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
    });
  } catch (error) {
    console.error(`Failed to load GMP history for ${slug}:`, error);
    return NextResponse.json({ message: "GMP history is currently unavailable" }, { status: 502 });
  }
}

