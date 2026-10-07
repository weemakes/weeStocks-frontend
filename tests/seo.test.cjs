const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function load(file, dependencies = {}) {
  const filename = path.resolve(file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled)((name) => {
    if (name === 'server-only') return {};
    if (name in dependencies) return dependencies[name];
    return require(name);
  }, module, module.exports);
  return module.exports;
}

function fixtureFetch({ failStockPage = false, failIPOPage = false } = {}) {
  return async (input) => {
    const url = new URL(input);
    let payload;
    const page = Number(url.searchParams.get('page'));
    if (url.pathname === '/stocks') {
      if (failStockPage && page === 2) return new Response('', { status: 503 });
      payload = { data: page === 1
        ? [{ symbol: 'TCS', company_name: 'TCS', latest_price: 100 }, { symbol: 'EMPTY', company_name: 'Empty', latest_price: null }]
        : [{ symbol: 'INFY', company_name: 'Infosys', latest_price: 200 }, { symbol: 'TCS', company_name: 'TCS', latest_price: 100 }], meta: { totalPages: 2 } };
    } else if (url.pathname === '/v2/ipos') {
      if (failIPOPage && page === 2) return new Response('', { status: 503 });
      payload = { data: { total_pages: 2, ipos: [{ slug: page === 1 ? 'first-ipo' : 'second-ipo' }] } };
    } else if (url.pathname === '/cities') {
      payload = { data: { totalPages: 2, cities: [{ id: page, slug: page === 1 ? 'delhi' : 'mumbai', name: page === 1 ? 'Delhi' : 'Mumbai' }] } };
    } else {
      payload = { data: { latestMetalRates: url.pathname === '/cities/1'
        ? [{ metal: 'gold', last_updated_at: '2026-01-01T00:00:00Z' }, { metal: 'silver' }]
        : [{ metal: 'silver' }] } };
    }
    return Response.json({ status: 1, ...payload });
  };
}

test('sitemap paginates inventories, deduplicates and includes only available metals', async () => {
  const original = global.fetch;
  global.fetch = fixtureFetch();
  try {
    const inventory = load('lib/seo/inventory.ts');
    const sitemap = load('app/sitemap.ts', { '@/lib/seo/inventory': inventory }).default;
    const entries = await sitemap();
    const urls = entries.map((entry) => new URL(entry.url).pathname);
    assert.ok(urls.includes('/stocks/INFY'));
    assert.ok(urls.includes('/ipo/second-ipo'));
    assert.ok(urls.includes('/silver/mumbai'));
    assert.ok(!urls.includes('/gold/mumbai'));
    assert.ok(!urls.includes('/stocks/EMPTY'));
    assert.equal(urls.filter((url) => url === '/stocks/TCS').length, 1);
    assert.equal(entries.find((entry) => entry.url.endsWith('/gold/delhi')).lastModified.toISOString(), '2026-01-01T00:00:00.000Z');
    assert.equal(entries.find((entry) => entry.url.endsWith('/about')).lastModified, undefined);
  } finally { global.fetch = original; }
});

test('failed inventory pages preserve other pages and sections', async () => {
  const original = global.fetch;
  const originalError = console.error;
  global.fetch = fixtureFetch({ failStockPage: true, failIPOPage: true });
  console.error = () => {};
  try {
    const inventory = load('lib/seo/inventory.ts');
    const entries = await load('app/sitemap.ts', { '@/lib/seo/inventory': inventory }).default();
    assert.ok(entries.some((entry) => entry.url.endsWith('/stocks/TCS')));
    assert.ok(entries.some((entry) => entry.url.endsWith('/ipo/first-ipo')));
    assert.ok(entries.some((entry) => entry.url.endsWith('/silver/mumbai')));
  } finally { global.fetch = original; console.error = originalError; }
});

test('stock loader distinguishes missing reports from upstream failures and preserves country identity', async () => {
  const original = global.fetch;
  const detail = load('features/stocks/api/detail.server.ts', {
    react: { cache: (fn) => fn }, './index': { normalizeStockDetail: (data) => data?.company ? data : null },
  });
  try {
    global.fetch = async () => new Response('', { status: 404 });
    assert.equal(await detail.getServerStockDetail('MISSING', 'India'), null);
    global.fetch = async () => new Response('', { status: 503 });
    await assert.rejects(detail.getServerStockDetail('TCS', 'India'), /temporarily unavailable/);
    global.fetch = async () => Response.json({ status: 1, data: {} });
    await assert.rejects(detail.getServerStockDetail('TCS', 'India'), /incomplete/);
    assert.equal(detail.stockPath('tcs', 'India'), '/stocks/TCS');
    assert.equal(detail.stockPath('abc', 'United States'), '/stocks/ABC?country=United+States');
  } finally { global.fetch = original; }
});
