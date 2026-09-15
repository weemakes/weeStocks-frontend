import type { StockItem } from '../types';
export function csvCell(value: unknown) {
  let text = value == null ? '' : String(value);
  if (typeof value === 'string' && /^[=+\-@\t\r]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"', '""') + '"';
}
export function exportStocksCsv(stocks: StockItem[], country: string) {
  const rows: unknown[][] = [['Symbol','Company','Country','Currency','Price','Change %','Market capitalization','P/E','Debt / market cap %','Screening','Source date'],
    ...stocks.map(s => [s.symbol,s.name,s.country,s.currency,s.price,s.changePercent,s.marketCapCr === null ? null : s.marketCapCr*10000000,s.fundamentals.peRatio,s.shariah.debtRatioPercent,s.complianceStatus,s.lastUpdated])];
  const url = URL.createObjectURL(new Blob(['\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')], {type:'text/csv;charset=utf-8;'}));
  const anchor = document.createElement('a'); anchor.href=url; anchor.download=`weestox-${country.toLowerCase().replaceAll(' ','-')}-${new Date().toISOString().slice(0,10)}.csv`;
  anchor.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}
