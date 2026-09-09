/**
 * Metal Index Page
 * Main page for a metal type (redirects to a default city or shows selection)
 * Route: /gold, /silver, /platinum
 */

import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPopularCities } from "@/features/metals/api";
import { METAL_CONFIG, type Metal } from "@/features/metals/types";
import { MetalSelector } from "@/features/metals/components";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface MetalPageProps {
  params: Promise<{
    metal: string;
  }>;
}

export async function generateMetadata({
  params,
}: MetalPageProps): Promise<Metadata> {
  const { metal } = await params;
  const metalConfig = METAL_CONFIG[metal as Metal];

  if (!metalConfig) {
    return {
      title: "Page Not Found | WeeStox",
    };
  }

  return {
    title: `${metalConfig.displayName} Price Today in India — Live 24K, 22K, 18K Rates | WeeStox`,
    description: `Check today's live ${metalConfig.displayName.toLowerCase()} prices across major Indian cities. Real-time spot rates, multi-city comparison, and intraday charts on WeeStox.`,
  };
}

export default async function MetalPage({ params }: MetalPageProps) {
  const { metal: metalParam } = await params;

  // Validate metal
  const metal = metalParam as Metal;
  const metalConfig = METAL_CONFIG[metal];

  if (!metalConfig) {
    notFound();
  }

  // Fetch popular cities
  const popularCities = await getPopularCities();

  // If we have popular cities, redirect to the capital / top city (e.g. delhi)
  if (popularCities && popularCities.length > 0) {
    const capitalCity = popularCities.find((c) => c.slug === "delhi") || popularCities[0];
    redirect(`/${metal}/${capitalCity.slug}`);
  }

  // Fallback: show city selection page in dark theme
  return (
    <div className="min-h-screen bg-slate-950 py-8 pb-20">
      <div className="container mx-auto">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
          <h1 className="text-3xl font-extrabold text-slate-100 mb-2">
            {metalConfig.displayName} Price Today in India
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            Select a city to view current live {metalConfig.displayName.toLowerCase()} rates and comparison tables
          </p>

          <MetalSelector currentMetal={metal} />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-bold text-slate-100 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            <span>Select a City to View Live Rates</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularCities.map((c) => (
              <Link
                key={c.slug}
                href={`/${metal}/${c.slug}`}
                className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-sky-500/50 rounded-xl text-xs font-semibold text-slate-200 transition-all text-center block"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
