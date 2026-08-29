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
  MetalPriceCard,
  MetalPriceTable,
  Last10DaysTable,
  HistoryChartSection,
  GoldCalculator,
} from "@/features/metals/components";
import { METAL_CONFIG, type Metal } from "@/features/metals/types";
import { formatPrice } from "@/features/metals/utils";

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
      title: "City Not Found | Halal Stock",
    };
  }

  const metalConfig = METAL_CONFIG[metal as Metal];
  if (!metalConfig) {
    return {
      title: "Page Not Found | Halal Stock",
    };
  }

  const capitalizedCity = city.name;
  const metalName = metalConfig.displayName;

  return {
    title: `${metalName} Price in ${capitalizedCity} Today | Halal Stock`,
    description: `Check today's ${metalName.toLowerCase()} price in ${capitalizedCity}${
      metalConfig.purityOptions.length > 0
        ? ` for ${metalConfig.purityOptions.join(", ")} gold`
        : ""
    }, including historical prices and the latest 10-day price trends.`,
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
      getMetalLast10Days(city.id, metal),
      metalConfig.historyEnabled
        ? getMetalHistoryData({
            citySlug: city?.slug||"",
            metal,
            unit: metalConfig.defaultUnit,
            purity: metalConfig.defaultPurity,
            duration: metalConfig.defaultDuration,
          })
        : Promise.resolve(null),
    ]);

  // Get primary prices for display cards (first few prices based on purity/unit)
  const primaryPrices = latestPrice.prices.slice(0, 3);

  // Metal-specific theme colors
  const metalTheme = {
    gold: {
      gradient: 'from-yellow-900/30 via-gray-900 to-gray-950',
      border: 'border-yellow-600/50',
      text: 'text-yellow-500',
      glow: 'shadow-yellow-500/20',
      cardBorder: 'border-yellow-600/30',
      cardBg: 'bg-gradient-to-br from-yellow-950/20 to-gray-900',
    },
    silver: {
      gradient: 'from-gray-700/30 via-gray-900 to-gray-950',
      border: 'border-gray-400/50',
      text: 'text-gray-300',
      glow: 'shadow-gray-400/20',
      cardBorder: 'border-gray-400/30',
      cardBg: 'bg-gradient-to-br from-gray-800/20 to-gray-900',
    },
    platinum: {
      gradient: 'from-blue-900/30 via-gray-900 to-gray-950',
      border: 'border-blue-400/50',
      text: 'text-blue-300',
      glow: 'shadow-blue-400/20',
      cardBorder: 'border-blue-400/30',
      cardBg: 'bg-gradient-to-br from-blue-950/20 to-gray-900',
    },
  };

  const theme = metalTheme[metal];

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header Section with Metal Theme */}
      <div className={`bg-gradient-to-br ${theme.gradient} border-b-2 ${theme.border} ${theme.glow}`}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-blue-500 transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${metal}`} className="hover:text-blue-500 transition-colors">
              {metalConfig.displayName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{city.name}</span>
          </nav>

          {/* Page Title with Metal Color */}
          <h1 className={`text-4xl font-bold mb-2 ${theme.text}`}>
            {metalConfig.displayName} Price in {city.name} Today
          </h1>
          <p className="text-lg text-gray-400 mb-6">
            Current {metalConfig.displayName.toLowerCase()} prices, historical
            trends, and market data for {city.name}
          </p>

          {/* Metal & City Selectors */}
          <div className="flex flex-wrap items-center gap-4">
            <MetalSelector currentMetal={metal} citySlug={city.slug} />
            <CitySelector
              currentCity={city}
              popularCities={popularCities}
              metal={metal}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Current Price Cards */}
        <section>
          <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>
            Today&apos;s {metalConfig.displayName} Price
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {primaryPrices.map((price, idx) => (
              <div
                key={`${price.purity}-${price.unit}`}
                className={`rounded-lg border-2 ${idx === 0 ? theme.cardBorder + ' ' + theme.cardBg + ' ' + theme.glow : 'border-gray-800 bg-gray-900'} p-6 transition-all hover:${theme.glow}`}
              >
                <div className="text-sm font-medium text-gray-400 mb-1">
                  {price.purity || metalConfig.displayName}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {formatPrice(price.price)}
                  <span className="text-base font-normal text-gray-400 ml-2">
                    / {price.unit}
                  </span>
                </div>
                {price.change && (
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 ${
                      price.change.direction === 'up' ? 'text-green-500' :
                      price.change.direction === 'down' ? 'text-red-500' :
                      'text-gray-500'
                    }`}>
                      <span className="font-medium">
                        {price.change.direction === 'up' ? '↑' : price.change.direction === 'down' ? '↓' : '—'} ₹{price.change.value}
                      </span>
                    </span>
                    {price.previousPrice && (
                      <span className="text-sm text-gray-500">
                        vs ₹{price.previousPrice}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Price Table */}
        <section>
          <MetalPriceTable data={latestPrice} />
        </section>

        {/* Gold Calculator - Only for Gold */}
        {metal === 'gold' && (
          <section>
            <GoldCalculator
              prices={{
                '24K': latestPrice.prices.find(p => p.purity === '24K')?.price || 0,
                '22K': latestPrice.prices.find(p => p.purity === '22K')?.price || 0,
                '18K': latestPrice.prices.find(p => p.purity === '18K')?.price || 0,
              }}
            />
          </section>
        )}

        {/* History Chart */}
        {metalConfig.historyEnabled && historyData && (
          <section>
            <HistoryChartSection
              metal={metal}
              citySlug={city?.slug || ""}
              initialData={historyData.data}
              initialPurity={metalConfig.defaultPurity}
              initialUnit={metalConfig.defaultUnit}
              initialDuration={metalConfig.defaultDuration}
            />
          </section>
        )}

        {/* Last 10 Days */}
        <section>
          <Last10DaysTable data={last10Days} />
        </section>

        {/* SEO Content / FAQ Section (Placeholder) */}
        <section className="card">
          <h2 className="text-2xl font-bold text-white mb-4">
            About {metalConfig.displayName} Prices in {city.name}
          </h2>
          <div className="prose max-w-none text-gray-400">
            <p>
              Stay updated with the latest {metalConfig.displayName.toLowerCase()}{" "}
              prices in {city.name}. Our platform provides real-time price
              updates, historical trends, and comprehensive market data to help
              you make informed decisions.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
