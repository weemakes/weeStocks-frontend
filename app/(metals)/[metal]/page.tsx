/**
 * Metal Index Page
 * Main page for a metal type (redirects to a default city or shows selection)
 * Route: /gold, /silver, /platinum
 */

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPopularCities } from "@/features/metals/api";
import { METAL_CONFIG, type Metal } from "@/features/metals/types";
import { MetalSelector } from "@/features/metals/components";
import Link from "next/link";

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
      title: "Page Not Found | Halal Stock",
    };
  }

  return {
    title: `${metalConfig.displayName} Price Today in India | Halal Stock`,
    description: `Check today's ${metalConfig.displayName.toLowerCase()} prices across major Indian cities. Get real-time price updates, historical trends, and market insights.`,
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

  // If we have popular cities, redirect to the first one
  if (popularCities && popularCities.length > 0) {
    const firstCity = popularCities[0];
    redirect(`/${metal}/${firstCity.slug}`);
  }

  // Fallback: show city selection page
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {metalConfig.displayName} Price in India
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Select a city to view current {metalConfig.displayName.toLowerCase()}{" "}
            prices
          </p>

          <MetalSelector currentMetal={metal} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select a City
          </h2>
          
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Unable to load cities. Please ensure the backend API is running at:
            </p>
            <code className="bg-gray-100 px-3 py-1 rounded text-sm">
              {process.env.BACKEND_API_URL || "http://localhost:3000"}
            </code>
            <p className="text-sm text-gray-500 mt-4">
              Check the terminal logs for more details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
