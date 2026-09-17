import { getLatestMetalPrice } from '../api';
import type { City, Metal } from '../types';
import { generateSlug } from '../utils/city';
import { normalizedPrice } from '../utils/prices';
import { CityComparisonTable } from './CityComparisonTable';

export async function CityRatesSection({ cities, metal, citySlug }: { cities: City[]; metal: Metal; citySlug: string }) {
  // Benchmark the top 6 regional hub cities for fast, responsive rendering
  const comparisonCities = cities.slice(0, 6);
  
  const results = await Promise.allSettled(
    comparisonCities.map(async (city) => {
      const { prices } = await getLatestMetalPrice(city.id, metal);
      return {
        id: city.id,
        name: city.name,
        slug: city.slug || generateSlug(city.name),
        price24K: normalizedPrice(prices, '10g', '24K'),
        price22K: normalizedPrice(prices, '10g', '22K'),
        price18K: normalizedPrice(prices, '10g', '18K'),
        singlePrice: normalizedPrice(prices, '10g'),
      };
    })
  );

  const data = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
  
  return data.length ? (
    <CityComparisonTable metal={metal} currentCitySlug={citySlug} cities={data} />
  ) : (
    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
      Regional comparison rates are currently being updated.
    </div>
  );
}
