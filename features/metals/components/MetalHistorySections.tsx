import { getMetalHistoryData, getMetalLast10Days } from "../api";
import type { Metal } from "../types";
import { METAL_CONFIG } from "../types";
import { HistoryChartSection } from "./HistoryChartSection";
import { Last10DaysTable } from "./Last10DaysTable";

interface MetalHistoryProps {
  metal: Metal;
  cityId: number;
  citySlug: string;
}

export async function MetalHistorySection({ metal, citySlug }: MetalHistoryProps) {
  const config = METAL_CONFIG[metal];

  if (!config.historyEnabled) return null;

  const history = await getMetalHistoryData({
    citySlug,
    metal,
    unit: config.defaultUnit,
    purity: metal === "gold" ? config.defaultPurity : undefined,
    duration: config.defaultDuration,
  }).catch((error) => {
    console.error(`Failed to fetch initial history data for ${metal}:`, error);
    return null;
  });

  return (
    <section className="bg-panel/90 border border-line rounded-2xl p-5 md:p-6 shadow-xl">
      <HistoryChartSection
        key={`${metal}-${citySlug}`}
        metal={metal}
        citySlug={citySlug}
        initialData={history?.data ?? []}
        initialPurity={metal === "gold" ? config.defaultPurity : undefined}
        initialUnit={config.defaultUnit}
        initialDuration={config.defaultDuration}
      />
    </section>
  );
}

export async function MetalLast10DaysSection({ metal, cityId }: MetalHistoryProps) {
  const history = await getMetalLast10Days(cityId, metal).catch((error) => {
    console.error(`Failed to fetch recent ${metal} prices for city ${cityId}:`, error);
    return { metal, cityId, data: [] };
  });

  return <Last10DaysTable data={history} />;
}

