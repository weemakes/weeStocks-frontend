import { Suspense } from 'react';
import { CityRatesSection } from '@/features/metals/components/CityRatesSection';
import { normalizedPrice } from '@/features/metals/utils/prices';
/**
 * Metal City Page
 * Dynamic page for displaying metal prices in a specific city
 * Route: /gold/[citySlug], /silver/[citySlug], /platinum/[citySlug]
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getCityBySlug,
  getPopularCities,
  getLatestMetalPrice,
  getMetalLast10Days,
  getMetalHistoryData,
} from "@/features/metals/api";
import {
  MetalSelector,
  CitySelector,
  MetalPriceTable,
  Last10DaysTable,
  HistoryChartSection,
  SmartMetalCalculator,
  CityComparisonTable,
  MetalInvestorGuide,
  type CityMetalPriceItem,
} from "@/features/metals/components";
import { METAL_CONFIG, type Metal } from "@/features/metals/types";
import { formatPrice } from "@/features/metals/utils";
import {
  Coins,
  Sparkles,
  Gem,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Clock,
  MapPin,
  Scale,
  ShieldCheck,
} from "lucide-react";

interface MetalCityPageProps {
  params: Promise<{
    metal: string;
    citySlug: string;
  }>;
}

export async function generateMetadata({
  params,
}: MetalCityPageProps): Promise<Metadata> {
  const { metal, citySlug } = await params;

  const city = await getCityBySlug(citySlug);
  if (!city) {
    return {
      title: "City Not Found | WeeStox",
    };
  }

  const metalConfig = METAL_CONFIG[metal as Metal];
  if (!metalConfig) {
    return {
      title: "Page Not Found | WeeStox",
    };
  }

  const capitalizedCity = city.name;
  const metalName = metalConfig.displayName;

  return {
    title: `${metalName} Rate Today in ${capitalizedCity} (10g, 1g) - Prices | WeeStox`,
    description: `Check live ${metalName.toLowerCase()} price in ${capitalizedCity} today. Reported per-gram and multi-weight rates. Compare across all Indian cities with historical trends on WeeStox.`,
  };
}

export default async function MetalCityPage({ params }: MetalCityPageProps) {
  const { metal: metalParam, citySlug } = await params;

  // Validate metal
  const metal = metalParam as Metal;
  const metalConfig = METAL_CONFIG[metal];

  if (!metalConfig) {
    notFound();
  }

  // Fetch city data
  const city = await getCityBySlug(citySlug);
  if (!city) {
    notFound();
  }

  // Fetch all required data in parallel
  const [popularCities, latestPrice, last10Days, historyData] =
    await Promise.all([
      getPopularCities(),
      getLatestMetalPrice(city.id, metal),
      getMetalLast10Days(city.id, metal).catch(() => ({ metal, cityId: city.id, data: [] })),
      metalConfig.historyEnabled
        ? getMetalHistoryData({
            citySlug,
            metal,
            unit: metalConfig.defaultUnit,
            purity: metal === "gold" ? metalConfig.defaultPurity : undefined,
            duration: metalConfig.defaultDuration,
          }).catch((err) => {
            console.error(`Failed to fetch initial history data for ${metal}:`, err);
            return null;
          })
        : Promise.resolve(null),
    ]);

  const isGold = metal === 'gold';
  const rate1g_24K = normalizedPrice(latestPrice.prices,'1g','24K');
  const rate10g_24K = normalizedPrice(latestPrice.prices,'10g','24K');
  const rate10g_22K = normalizedPrice(latestPrice.prices,'10g','22K');
  const rate10g_18K = normalizedPrice(latestPrice.prices,'10g','18K');
  const rate8g_24K = normalizedPrice(latestPrice.prices,'8g','24K');
  const rate100g_24K = normalizedPrice(latestPrice.prices,'100g','24K');
  const rateSilver1g = normalizedPrice(latestPrice.prices,'1g');
  const rateSilver10g = normalizedPrice(latestPrice.prices,'10g');
  const rateSilver1kg = normalizedPrice(latestPrice.prices,'1kg');
  const mainChange = latestPrice.prices[0]?.change?.value || 0;
  const mainDirection = latestPrice.prices[0]?.change?.direction || "neutral";
  const isUp = mainDirection === "up";
  const isDown = mainDirection === "down";

  // Quick popular city chips to show in the hero bar
  const quickHubCities = ["delhi", "mumbai", "chennai", "kolkata", "bangalore", "hyderabad", "ahmedabad", "pune"];

  return (
    <div className="min-h-screen bg-canvas py-6 md:py-8 pb-20">
      <div className="container mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4 mb-3 text-xs text-muted">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href={`/${metal}`} className="hover:text-ink capitalize transition-colors">
              {metalConfig.displayName}
            </Link>
            <span>/</span>
            <span className="text-ink font-semibold">{city.name}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-quiet">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span>Updated: {new Date(latestPrice.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>

        {/* 1. Pro Hero Banner with Metal & City Selectors */}
        <div className="bg-panel/90 border border-line rounded-2xl p-5 md:p-6 mb-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink tracking-tight">
                  {metalConfig.displayName} Rate in {city.name} Today
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-positive border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Spot Market
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
                Check today&apos;s real-time {metalConfig.displayName.toLowerCase()} rates per gram, 8g sovereign, 10g, and 100g bar in {city.name}. Multi-city comparison, intraday trend charts, and BIS hallmarking insights.
              </p>
            </div>

            {/* Metal Switcher Tabs & City Dropdown */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <MetalSelector currentMetal={metal} citySlug={citySlug} />
              <CitySelector
                currentCity={city}
                popularCities={popularCities}
                metal={metal}
              />
            </div>
          </div>

          {/* Quick Popular City Pills (StockeZee & GoodReturns Fast Jump) */}
          <div className="flex items-center gap-1.5 pt-4 mt-4 border-t border-line/80 overflow-x-auto no-scrollbar text-xs">
            <span className="text-quiet font-semibold uppercase text-[10px] shrink-0 mr-1">
              Top Hubs:
            </span>
            {popularCities.map((c) => {
              const currentSlug = city.slug || citySlug;
              const isSelected = (c.slug || "").toLowerCase() === currentSlug.toLowerCase();
              return (
                <Link
                  key={c.slug || c.id}
                  href={`/${metal}/${c.slug || c.name.toLowerCase()}`}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20"
                      : "bg-canvas/60 text-body hover:text-ink hover:bg-well border border-line"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 2. Top Highlights Strip (Investor Key Benchmarks) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {isGold ? (
            <>
              {/* 24K 10g */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  24K Gold (10g / Tola)
                </span>
                <div className="text-lg sm:text-xl font-bold text-warning tabular-nums">
                  {formatPrice(rate10g_24K)}
                </div>
                <div className="text-[10px] text-quiet mt-1 flex items-center gap-1">
                  <span>99.9% Fine Bullion</span>
                </div>
              </div>

              {/* 22K 10g */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  22K Gold (10g / Jewellery)
                </span>
                <div className="text-lg sm:text-xl font-bold text-ink tabular-nums">
                  {formatPrice(rate10g_22K)}
                </div>
                <div className="text-[10px] text-muted mt-1">
                  BIS 916 Standard
                </div>
              </div>

              {/* 18K 10g */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  18K Gold (10g / Diamond)
                </span>
                <div className="text-lg sm:text-xl font-bold text-body tabular-nums">
                  {formatPrice(rate10g_18K)}
                </div>
                <div className="text-[10px] text-quiet mt-1">
                  75.0% Ornament
                </div>
              </div>

              {/* 1 Gram 24K */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  1 Gram (24K Spot)
                </span>
                <div className="text-lg sm:text-xl font-bold text-ink tabular-nums">
                  {formatPrice(rate1g_24K)}
                </div>
                <div className="text-[10px] text-quiet mt-1">
                  Unit Spot Price
                </div>
              </div>

              {/* 8 Grams (1 Sovereign) */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  8 Grams (1 Sovereign)
                </span>
                <div className="text-lg sm:text-xl font-bold text-ink tabular-nums">
                  {formatPrice(rate8g_24K)}
                </div>
                <div className="text-[10px] text-quiet mt-1">
                  Pavan Benchmark
                </div>
              </div>

              {/* 100 Grams Bar */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  100 Grams (Bullion Bar)
                </span>
                <div className="text-lg sm:text-xl font-bold text-accent tabular-nums">
                  {formatPrice(rate100g_24K)}
                </div>
                <div className="text-[10px] text-quiet mt-1">
                  Minted Bullion Bar
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Silver / Platinum Metrics */}
              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  1 Gram Spot
                </span>
                <div className="text-lg sm:text-xl font-bold text-ink tabular-nums">
                  {formatPrice(rateSilver1g)}
                </div>
                <div className="text-[10px] text-quiet mt-1">Unit Reference</div>
              </div>

              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  10 Grams
                </span>
                <div className="text-lg sm:text-xl font-bold text-ink tabular-nums">
                  {formatPrice(rateSilver10g)}
                </div>
                <div className="text-[10px] text-quiet mt-1">10-gram benchmark</div>
              </div>

              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  100 Grams
                </span>
                <div className="text-lg sm:text-xl font-bold text-ink tabular-nums">
                  {formatPrice(normalizedPrice(latestPrice.prices,'100g'))}
                </div>
                <div className="text-[10px] text-quiet mt-1">Bar Benchmark</div>
              </div>

              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  1 Kilogram (1000g)
                </span>
                <div className="text-lg sm:text-xl font-bold text-accent tabular-nums">
                  {formatPrice(rateSilver1kg)}
                </div>
                <div className="text-[10px] text-quiet mt-1">Commercial Bar</div>
              </div>

              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  Today&apos;s Net Movement
                </span>
                <div className={`text-lg sm:text-xl font-bold tabular-nums ${isUp ? "text-positive" : isDown ? "text-negative" : "text-body"}`}>
                  {isUp ? "+" : ""}{formatPrice(mainChange)}
                </div>
                <div className="text-[10px] text-quiet mt-1 capitalize">{mainDirection}</div>
              </div>

              <div className="bg-panel/90 border border-line rounded-xl p-3.5 text-left">
                <span className="text-[11px] font-medium text-muted block mb-1">
                  Zakat Reference (595g)
                </span>
                <div className="text-lg sm:text-xl font-bold text-positive tabular-nums">
                  {formatPrice(rateSilver1g === undefined ? undefined : rateSilver1g * 595)}
                </div>
                <div className="text-[10px] text-quiet mt-1">Nisab Threshold</div>
              </div>
            </>
          )}
        </div>

        <div className="space-y-6">
          {/* ========================================================================= */}
          {/* ROW 1: TWO TABLES SIDE-BY-SIDE (Chittorgarh / Pro Investor Rhythm)         */}
          {/* Left: Weight Rate Matrix | Right: Smart Calculator & Zakat Check           */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
            {/* Left: Comprehensive Price Matrix Table */}
            <MetalPriceTable data={latestPrice} />

            {/* Right: Smart Bullion & Jewellery Calculator */}
            <SmartMetalCalculator
              metal={metal}
              cityName={city.name}
              prices={{
                "24K": rate1g_24K,
                "22K": normalizedPrice(latestPrice.prices,'1g','22K'),
                "18K": normalizedPrice(latestPrice.prices,'1g','18K'),
                perGram: rateSilver1g,
              }}
            />
          </div>

          {/* ========================================================================= */}
          {/* FULL WIDTH: Interactive Multi-Timeframe Historical Price Chart             */}
          {/* ========================================================================= */}
          {metalConfig.historyEnabled && (
            <section className="bg-panel/90 border border-line rounded-2xl p-5 md:p-6 shadow-xl">
              <HistoryChartSection key={metal+city.slug}
                metal={metal}
                citySlug={city?.slug || ""}
                initialData={historyData?.data || []}
                initialPurity={metal === "gold" ? metalConfig.defaultPurity : undefined}
                initialUnit={metalConfig.defaultUnit}
                initialDuration={metalConfig.defaultDuration}
              />
            </section>
          )}

          {/* ========================================================================= */}
          {/* FULL WIDTH: Major Indian Cities Rate Comparison Table                      */}
          {/* ========================================================================= */}
          <Suspense fallback={<div className="skeleton h-48" />}><CityRatesSection cities={popularCities} metal={metal} citySlug={city.slug}/></Suspense>

          {/* ========================================================================= */}
          {/* FULL WIDTH: Last 10 Days Historical Trend Table                            */}
          {/* ========================================================================= */}
          <Last10DaysTable data={last10Days} />

          {/* ========================================================================= */}
          {/* FULL WIDTH: Investor Guide, BIS Hallmarking Standards & FAQs               */}
          {/* ========================================================================= */}
          <MetalInvestorGuide metal={metal} cityName={city.name} />
        </div>
      </div>
    </div>
  );
}
