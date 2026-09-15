/** Pure calculations. Values are rounded only at monetary output boundaries. */
export function nonNegative(value: unknown): number | null {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 && n <= 1e12 ? n : null;
}
export const money = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export function purchaseEstimate(rate: number | null, weight: number | null, makingPercent: number, taxPercent: number) {
  if (rate === null || weight === null || rate <= 0 || weight <= 0 || [rate,weight,makingPercent,taxPercent].some(n => nonNegative(n) === null) || makingPercent > 100 || taxPercent > 100) return null;
  const base = money(rate * weight);
  const making = money(base * makingPercent / 100);
  const tax = money((base + making) * taxPercent / 100);
  return { base, making, tax, total: money(base + making + tax) };
}
export function zakatEstimate(assets: number[], liabilities: number, nisab: number | null, lunarYear: boolean) {
  if ([...assets,liabilities].some(n=>nonNegative(n)===null) || (nisab!==null&&nonNegative(nisab)===null)) return null;
  const gross = money(assets.reduce((sum,value)=>sum+value,0));
  const net = money(Math.max(0,gross-liabilities));
  const eligible = nisab !== null && nisab > 0 && net >= nisab && lunarYear;
  return { gross, net, eligible, amount: nisab === null || nisab <= 0 || !lunarYear ? null : eligible ? money(net * .025) : 0 };
}
