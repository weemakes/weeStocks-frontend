import { apiRequest,buildQueryString } from './api-client';
import { ensureCitySlugs,generateSlug } from '../utils';
import type { City,CitySearchParams } from '../types';
function extract(value:unknown):City[] {
  const obj=value as {data?:{cities?:unknown}|unknown[]};
  const raw=Array.isArray(value)?value:Array.isArray(obj?.data)?obj.data:(obj?.data as {cities?:unknown})?.cities;
  if(!Array.isArray(raw))throw new Error('Invalid cities response');
  return ensureCitySlugs(raw.filter((c):c is City=>!!c&&typeof c==='object'&&typeof c.id==='number'&&typeof c.name==='string'));
}
export async function getPopularCities():Promise<City[]> { return extract(await apiRequest<unknown>('/cities/popular',{revalidate:3600})); }
export async function searchCities(params:CitySearchParams):Promise<City[]> { return extract(await apiRequest<unknown>('/cities'+buildQueryString({search:params.search,only_metals:params.only_metals}),{cache:'no-store'})); }
export async function getCityBySlug(slug:string):Promise<City|null> {
  const cities=await searchCities({search:slug.replaceAll('-',' '),only_metals:true});
  return cities.find(c=>c.slug===slug||generateSlug(c.name)===slug)||null;
}
