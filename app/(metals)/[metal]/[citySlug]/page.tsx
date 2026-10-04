import { Suspense } from "react";
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
} from "@/features/metals/api";
import {
  MetalSelector,
  CitySelector,
  MetalPriceTable,
  SmartMetalCalculator,
  MetalInvestorGuide,
  MetalHistorySection,
  MetalLast10DaysSection,
} from "@/features/metals/components";
import { METAL_CONFIG, type Metal } from "@/features/metals/types";
import { formatPrice } from "@/features/metals/utils";
import {
  Clock,
} from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weestox.com";

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
      robots: { index: false, follow: false },
    };
  }

  const metalConfig = METAL_CONFIG[metal as Metal];
  if (!metalConfig) {
    return {
      title: "Page Not Found | WeeStox",
      robots: { index: false, follow: false },
    };
  }

  const capitalizedCity = city.name;
  const metalName = metalConfig.displayName;

  const title = `${metalName} Rate Today in ${capitalizedCity} (1g, 10g) | WeeStox`;
  const description = `Check today's ${metalName.toLowerCase()} rate in ${capitalizedCity} per gram and 10 grams, with recent price history and rates across major Indian cities.`;
  const canonicalPath = `/${metal}/${city.slug || citySlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      url: canonicalPath,
      siteName: "WeeStox",
      title,
      description,
    },
    twitter: { card: "summary", title, description },
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

  // Start independent lookups together so the first response is not serialized.
  const [city, popularCities] = await Promise.all([
    getCityBySlug(citySlug),
    getPopularCities(),
  ]);
  if (!city) {
    notFound();
  }

  // Only the current quote blocks the useful above-the-fold response. Historical
  // and regional data stream below through their own Suspense boundaries.
  const latestPrice = await getLatestMetalPrice(city.id, metal);

  const isGold = metal === 'gold';
  const rate1g_24K = normalizedPrice(latestPrice.prices, '1g', '24K');
  const rate10g_24K = normalizedPrice(latestPrice.prices, '10g', '24K');
  const rate10g_22K = normalizedPrice(latestPrice.prices, '10g', '22K');
  const rate10g_18K = normalizedPrice(latestPrice.prices, '10g', '18K');
  const rate8g_24K = normalizedPrice(latestPrice.prices, '8g', '24K');
  const rate100g_24K = normalizedPrice(latestPrice.prices, '100g', '24K');
  const rateSilver1g = normalizedPrice(latestPrice.prices, '1g');
  const rateSilver10g = normalizedPrice(latestPrice.prices, '10g');
  const rateSilver1kg = normalizedPrice(latestPrice.prices, '1kg');
  const mainChange = latestPrice.prices[0]?.change?.value || 0;
  const mainDirection = latestPrice.prices[0]?.change?.direction || "neutral";
  const isUp = mainDirection === "up";
  const isDown = mainDirection === "down";

  const canonicalPath = `/${metal}/${city.slug || citySlug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}${canonicalPath}#webpage`,
        url: `${SITE_URL}${canonicalPath}`,
        name: `${metalConfig.displayName} Rate Today in ${city.name}`,
        description: `Current ${metalConfig.displayName.toLowerCase()} rates in ${city.name}, recent history, and city comparisons.`,
        dateModified: latestPrice.date,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: metalConfig.displayName, item: `${SITE_URL}/${metal}` },
          { "@type": "ListItem", position: 3, name: city.name, item: `${SITE_URL}${canonicalPath}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-canvas py-6 md:py-8 pb-20 overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4 mb-4 text-xs text-muted">
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

        {/* 1. Open Hero Header (No boxed dabba - sitting directly on page canvas) */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-ink tracking-tight">
                  {metalConfig.displayName} Rate in {city.name} Today
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-positive border border-emerald-500/30 flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Spot Market
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted mt-1.5 max-w-2xl leading-relaxed">
                Real-time {metalConfig.displayName.toLowerCase()} spot benchmarks across purities and weights in {city.name}. Excludes retail making charges &amp; 3% GST.
              </p>
            </div>

            {/* Metal Switcher Tabs & City Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <MetalSelector currentMetal={metal} citySlug={citySlug} />
              <CitySelector
                currentCity={city}
                popularCities={popularCities}
                metal={metal}
              />
            </div>
          </div>

          {/* Quick Popular City Hub Pills */}
          <div className="flex items-center gap-1.5 pt-2.5 border-t border-line/60 overflow-x-auto no-scrollbar text-xs">
            <span className="text-quiet font-bold uppercase text-[10px] shrink-0 mr-1">
              Top Hubs:
            </span>
            {popularCities.map((c) => {
              const currentSlug = city.slug || citySlug;
              const isSelected = (c.slug || "").toLowerCase() === currentSlug.toLowerCase();
              return (
                <Link
                  key={c.slug || c.id}
                  href={`/${metal}/${c.slug || c.name.toLowerCase()}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${isSelected
                    ? "bg-sky-600 text-white dark:bg-sky-500 dark:text-slate-950 font-bold shadow-xs"
                    : "bg-panel text-body hover:text-ink hover:bg-well border border-line"
                    }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>

          {/* Seamless Live Spot Ticker Strip (Bounded by clean hairline borders) */}
          <div className="border-y border-line/80 py-3 sm:py-3.5 my-4 bg-panel/40 dark:bg-panel/20 rounded-xl overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-line/60 min-w-full">
              {isGold ? (
                <>
                  {/* 24K 10g */}
                  <div className="p-3 sm:p-3.5 bg-amber-500/[0.05] dark:bg-amber-400/[0.04]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                        24K (10g / Tola)
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-amber-500/15 text-[#B68214] dark:text-[#FCD34D] border border-amber-400/30">
                        Bullion
                      </span>
                    </div>
                    <div className="text-base sm:text-lg font-black text-[#B68214] dark:text-[#FCD34D] tabular-nums mt-0.5">
                      {formatPrice(rate10g_24K)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">99.9% Fine Spot</span>
                  </div>

                  {/* 22K 10g */}
                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      22K (10g / Jewellery)
                    </span>
                    <div className="text-base sm:text-lg font-black text-ink tabular-nums mt-0.5">
                      {formatPrice(rate10g_22K)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">BIS 916 Standard</span>
                  </div>

                  {/* 18K 10g */}
                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      18K (10g / Diamond)
                    </span>
                    <div className="text-base sm:text-lg font-black text-body tabular-nums mt-0.5">
                      {formatPrice(rate10g_18K)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">75.0% Ornament</span>
                  </div>

                  {/* 1 Gram 24K */}
                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      1 Gram (24K Spot)
                    </span>
                    <div className="text-base sm:text-lg font-black text-ink tabular-nums mt-0.5">
                      {formatPrice(rate1g_24K)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">Unit Spot Price</span>
                  </div>

                  {/* 8 Grams Sovereign */}
                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      8 Grams (1 Sovereign)
                    </span>
                    <div className="text-base sm:text-lg font-black text-ink tabular-nums mt-0.5">
                      {formatPrice(rate8g_24K)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">Pavan Benchmark</span>
                  </div>

                  {/* 100 Grams Bar */}
                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                      100 Grams (Bullion Bar)
                    </span>
                    <div className="text-base sm:text-lg font-black text-[#B68214] dark:text-[#FCD34D] tabular-nums mt-0.5">
                      {formatPrice(rate100g_24K)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">Minted Bullion Bar</span>
                  </div>
                </>
              ) : (
                <>
                  {/* Silver / Platinum Metrics */}
                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">1 Gram Spot</span>
                    <div className="text-base sm:text-lg font-black text-ink tabular-nums mt-0.5">
                      {formatPrice(rateSilver1g)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">Unit Reference</span>
                  </div>

                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">10 Grams</span>
                    <div className="text-base sm:text-lg font-black text-ink tabular-nums mt-0.5">
                      {formatPrice(rateSilver10g)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">10g Benchmark</span>
                  </div>

                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">100 Grams</span>
                    <div className="text-base sm:text-lg font-black text-ink tabular-nums mt-0.5">
                      {formatPrice(normalizedPrice(latestPrice.prices, '100g'))}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">Bar Benchmark</span>
                  </div>

                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">1 Kilogram (1000g)</span>
                    <div className="text-base sm:text-lg font-black text-accent tabular-nums mt-0.5">
                      {formatPrice(rateSilver1kg)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5">Commercial Bar</span>
                  </div>

                  <div className="p-3 sm:p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Today&apos;s Net Movement</span>
                    <div className={`text-base sm:text-lg font-black tabular-nums mt-0.5 ${isUp ? "text-positive" : isDown ? "text-negative" : "text-body"}`}>
                      {isUp ? "+" : ""}{formatPrice(mainChange)}
                    </div>
                    <span className="text-[10px] text-quiet block mt-0.5 capitalize">{mainDirection}</span>
                  </div>

                  {metal === "silver" ? (
                    <div className="p-3 sm:p-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Zakat Nisab (595g)</span>
                      <div className="text-base sm:text-lg font-black text-positive tabular-nums mt-0.5">
                        {formatPrice(rateSilver1g === undefined ? undefined : rateSilver1g * 595)}
                      </div>
                      <span className="text-[10px] text-quiet block mt-0.5">Silver Threshold</span>
                    </div>
                  ) : (
                    <div className="p-3 sm:p-3.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">Quote Basis</span>
                      <div className="text-base sm:text-lg font-black text-ink mt-0.5">Per gram</div>
                      <span className="text-[10px] text-quiet block mt-0.5">Standard Spot</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Cohesive Editorial Sections with Signature Golden Headline Accents */}
        <div className="space-y-8 sm:space-y-10 mt-6 sm:mt-8">
          {/* ========================================================================= */}
          {/* SECTION 1: INTERACTIVE PRICE CHART — FRONT & CENTER FOR TRADERS            */}
          {/* ========================================================================= */}
          {metalConfig.historyEnabled && (
            <section>
              <div className="flex items-center gap-2.5 pb-2.5 mb-4 border-b border-line/80">
                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#FFEBA3] via-[#E8B931] to-[#C88D11] shadow-xs shadow-amber-400/30 shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-black text-ink tracking-tight">
                    Historical Price Trend &amp; Spot Analysis
                  </h2>
                  <p className="text-xs text-muted">
                    Interactive multi-timeframe spot movements with live benchmark rates in {city.name}
                  </p>
                </div>
              </div>
              <Suspense fallback={<div className="skeleton h-[28rem] rounded-xl" aria-label="Loading historical prices" />}>
                <MetalHistorySection metal={metal} cityId={city.id} citySlug={city.slug || citySlug} />
              </Suspense>
            </section>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: CORE TRADING TOOLS (Side-by-Side: Matrix & Calculator)          */}
          {/* ========================================================================= */}
          <section>
            <div className="flex items-center gap-2.5 pb-2.5 mb-4 border-b border-line/80">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#FFEBA3] via-[#E8B931] to-[#C88D11] shadow-xs shadow-amber-400/30 shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-ink tracking-tight">
                  Benchmark Rates Matrix &amp; Purchase Calculator
                </h2>
                <p className="text-xs text-muted">
                  Compare rates across purities (24K, 22K, 18K) and calculate accurate buying costs with GST and making charges
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
              <MetalPriceTable data={latestPrice} />
              <SmartMetalCalculator
                metal={metal}
                cityName={city.name}
                prices={{
                  "24K": rate1g_24K,
                  "22K": normalizedPrice(latestPrice.prices, '1g', '22K'),
                  "18K": normalizedPrice(latestPrice.prices, '1g', '18K'),
                  perGram: rateSilver1g,
                }}
              />
            </div>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 3: MAJOR INDIAN CITIES RATE COMPARISON TABLE                       */}
          {/* ========================================================================= */}
          <section>
            <div className="flex items-center gap-2.5 pb-2.5 mb-4 border-b border-line/80">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#FFEBA3] via-[#E8B931] to-[#C88D11] shadow-xs shadow-amber-400/30 shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-ink tracking-tight">
                  {metalConfig.displayName} Rates Across Major Indian Cities
                </h2>
                <p className="text-xs text-muted">
                  Compare live 10-gram benchmark prices across major business hubs in India
                </p>
              </div>
            </div>
            <Suspense fallback={<div className="skeleton h-64 rounded-xl" aria-label="Loading city comparison" />}>
              <CityRatesSection cities={popularCities} metal={metal} citySlug={city.slug || citySlug} />
            </Suspense>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 4: LAST 10 DAYS HISTORICAL TREND TABLE                             */}
          {/* ========================================================================= */}
          <section>
            <div className="flex items-center gap-2.5 pb-2.5 mb-4 border-b border-line/80">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#FFEBA3] via-[#E8B931] to-[#C88D11] shadow-xs shadow-amber-400/30 shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-ink tracking-tight">
                  10-Day Historical Trend &amp; Daily Movements
                </h2>
                <p className="text-xs text-muted">
                  Day-by-day spot rate movements, price revisions, and percentage swings in {city.name}
                </p>
              </div>
            </div>
            <Suspense fallback={<div className="skeleton h-72 rounded-xl" aria-label="Loading recent prices" />}>
              <MetalLast10DaysSection metal={metal} cityId={city.id} citySlug={city.slug || citySlug} />
            </Suspense>
          </section>

          {/* ========================================================================= */}
          {/* SECTION 5: INVESTOR GUIDE, BIS STANDARDS & FAQs                            */}
          {/* ========================================================================= */}
          <section>
            <div className="flex items-center gap-2.5 pb-2.5 mb-4 border-b border-line/80">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-[#FFEBA3] via-[#E8B931] to-[#C88D11] shadow-xs shadow-amber-400/30 shrink-0" />
              <div>
                <h2 className="text-base sm:text-lg font-black text-ink tracking-tight">
                  Investor Guide, BIS Hallmarking (HUID) &amp; FAQs
                </h2>
                <p className="text-xs text-muted">
                  Essential verification standards, purity markings, macroeconomic drivers, and common queries
                </p>
              </div>
            </div>
            <MetalInvestorGuide metal={metal} cityName={city.name} />
          </section>
        </div>
      </div>
    </div>
  );
}
