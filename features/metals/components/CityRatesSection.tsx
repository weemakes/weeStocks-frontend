import { getLatestMetalPrice } from '../api';
import type { City, Metal } from '../types';
import { generateSlug } from '../utils/city';
import { normalizedPrice } from '../utils/prices';
import { CityComparisonTable } from './CityComparisonTable';
export async function CityRatesSection({ cities, metal, citySlug }: { cities: City[]; metal: Metal; citySlug: string }) {
  const results = await Promise.allSettled(cities.slice(0,10).map(async city => {
    const { prices } = await getLatestMetalPrice(city.id,metal);
    return { id:city.id,name:city.name,slug:city.slug||generateSlug(city.name),price24K:normalizedPrice(prices,'10g','24K'),price22K:normalizedPrice(prices,'10g','22K'),price18K:normalizedPrice(prices,'10g','18K'),singlePrice:normalizedPrice(prices,'10g') };
  }));
  const data = results.flatMap(result=>result.status==='fulfilled'?[result.value]:[]);
  return data.length ? <CityComparisonTable metal={metal} currentCitySlug={citySlug} cities={data}/> : <p className="notice">City comparison rates are currently unavailable.</p>;
}
