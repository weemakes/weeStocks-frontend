import type { MetadataRoute } from "next";
import { getIPOList } from "@/features/ipo/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://weestox.com";
const METALS = ["gold", "silver", "platinum"] as const;
const CITIES = [
  "delhi",
  "mumbai",
  "bangalore",
  "chennai",
  "kolkata",
  "hyderabad",
  "ahmedabad",
  "pune",
  "jaipur",
  "lucknow",
  "chandigarh",
  "surat",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/stocks`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ipo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/zakat`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const metalPages: MetadataRoute.Sitemap = METALS.flatMap((metal) =>
    CITIES.map((city) => ({
      url: `${SITE_URL}/${metal}/${city}`,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );

  let ipoPages: MetadataRoute.Sitemap = [];
  try {
    const firstPage = await getIPOList({ page: 1, limit: 100, sort: "newest" });
    const remaining = firstPage.data.total_pages > 1
      ? await Promise.all(
          Array.from({ length: firstPage.data.total_pages - 1 }, (_, index) =>
            getIPOList({ page: index + 2, limit: 100, sort: "newest" })
          )
        )
      : [];
    const ipos = [firstPage, ...remaining].flatMap((response) => response.data.ipos);
    ipoPages = Array.from(new Map(ipos.map((ipo) => [ipo.slug, ipo])).values()).map((ipo) => ({
      url: `${SITE_URL}/ipo/${encodeURIComponent(ipo.slug)}`,
      changeFrequency: ipo.status.toLowerCase() === "listed" ? "weekly" : "daily",
      priority: ipo.status.toLowerCase() === "listed" ? 0.6 : 0.8,
    }));
  } catch {
    // Keep the static sitemap available when the upstream IPO service is unavailable.
  }

  return [...staticPages, ...metalPages, ...ipoPages];
}
