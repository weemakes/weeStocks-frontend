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
    const unit = searchParams.get("unit") as MetalUnit;
    const purity = searchParams.get("purity") as MetalPurity | null;
    const duration = searchParams.get("duration") as ChartDuration;

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
      purity: purity || undefined,
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
