/**
 * Metal History API Route
 * Next.js Route Handler for fetching chart data
 */

import { NextRequest, NextResponse } from "next/server";
import { getMetalHistoryData } from "@/features/metals/api";
import type { Metal, MetalPurity, MetalUnit, ChartDuration } from "@/features/metals/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const metal = searchParams.get("metal") as Metal;
    const citySlug = searchParams.get("citySlug");
    const requestedUnit = searchParams.get("unit") as MetalUnit | null;
    const purity = searchParams.get("purity") as MetalPurity | null;
    const requestedDuration = searchParams.get("duration") as ChartDuration | null;

    // For platinum: default is 9m; even if 1w, 1m, 3m, 6m are requested, use 9m; 1y is 1y
    const duration: ChartDuration =
      metal === "platinum"
        ? requestedDuration === "1y"
          ? "1y"
          : "9m"
        : requestedDuration || "1w";

    // Determine unit defaults based on metal
    const unit: MetalUnit =
      requestedUnit ||
      (metal === "silver" ? "10g" : metal === "platinum" ? "1g" : "1g");

    if (!metal || !citySlug || !unit || !duration) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const historyData = await getMetalHistoryData({
      citySlug,
      metal,
      unit,
      purity: metal === "gold" && purity ? purity : undefined,
      duration,
    });

    return NextResponse.json(historyData);
  } catch (error) {
    console.error("Metal history API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history data" },
      { status: 500 }
    );
  }
}
