// Read-only source probes and local production HTTP checks. Run: node qa-audit-checks.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file) {
  const exports = {};
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  vm.runInNewContext(js, { exports, require, console });
  return exports;
}
async function main() {
  const { normalizedPrice } = load('features/metals/utils/prices.ts');
  const { mapBackendStockToStockItem } = load('features/stocks/utils/mappers.ts');
  const mapped = mapBackendStockToStockItem({ id: 1, symbol: 'QA', company_name: 'QA fixture', country: 'India', latest_price: 100, metrics: {} });
  const results = {
    timestamp: new Date().toISOString(),
    note: 'HTTP elapsed times are local smoke timings, not browser Web Vitals. Fixtures test actual exported source functions.',
    sourceProbes: {
      normalized10gTo1g: normalizedPrice([{ purity: '24K', unit: '10g', price: 100000 }], '1g', '24K'),
      normalized1gTo1kg: normalizedPrice([{ unit: '1g', price: 100 }], '1kg'),
      missingPurity: normalizedPrice([{ purity: '24K', unit: '1g', price: 10000 }], '1g', '22K') ?? null,
      missingCompliance: { status: mapped.complianceStatus, score: mapped.halalScore, low52: mapped.fundamentals.week52Low, high52: mapped.fundamentals.week52High },
      unknownCompliance: mapBackendStockToStockItem({ symbol: 'QA', shariah_compliance: { status: 'UNKNOWN' } }).complianceStatus,
      responseBodyDoubleRead: null,
    },
    routes: [],
  };
  const response = new Response('upstream unavailable', { status: 503 });
  try { await response.json(); } catch { try { await response.text(); } catch (e) { results.sourceProbes.responseBodyDoubleRead = e.message; } }
  const paths = ['/', '/about', '/zakat', '/stocks', '/stocks/QA-NOT-A-REAL-TICKER', '/ipo', '/ipo/qa-not-a-real-company', '/gold', '/silver', '/platinum', '/gold/delhi', '/silver/delhi', '/platinum/delhi', '/gold/qa-not-a-real-city', '/qa-invalid-metal', '/debug', '/robots.txt', '/sitemap.xml'];
  for (let i = 0; i < paths.length; i += 3) {
    const batch = await Promise.all(paths.slice(i, i + 3).map(async (path) => {
      const start = performance.now();
      try {
        const res = await fetch('http://localhost:3107' + path, { signal: AbortSignal.timeout(20000), redirect: 'manual' });
        const html = await res.text();
        return { path, status: res.status, ms: Math.round(performance.now() - start), bytes: Buffer.byteLength(html), location: res.headers.get('location'), title: html.match(/<title>(.*?)<\/title>/s)?.[1], h1Count: (html.match(/<h1[\s>]/g) || []).length, canonical: html.includes('rel="canonical"'), noindex: /name="robots"[^>]*noindex/.test(html), errorScreen: /IPO Details Not Found|Generating institutional analysis|Something went wrong|Internal Server Error/.test(html) };
      } catch (e) { return { path, ms: Math.round(performance.now() - start), error: e.message }; }
    }));
    results.routes.push(...batch);
  }
  fs.writeFileSync('qa-audit-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
}
main().catch(e => { console.error(e); process.exitCode = 1; });
