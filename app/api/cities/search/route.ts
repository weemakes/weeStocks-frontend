/**
 * City Search API Route
 * Next.js Route Handler for client-side city search
 */

import { NextRequest, NextResponse } from "next/server";
import { searchCities } from "@/features/metals/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ data: { cities: [] } });
    }

    const cities = await searchCities({
      search: query,
      only_metals: true,
    });

    return NextResponse.json({ data: { cities } });
  } catch (error) {
    console.error("City search API error:", error);
    return NextResponse.json(
      { error: "Failed to search cities" },
      { status: 500 }
    );
  }
}
