# Codebase review

Reviewed September 15, 2026. Scope: the current frontend working tree, including uncommitted stock integration changes. This is a source and tooling review, not a verification of the external backend or the financial/religious methodology. No application code was changed.

## Assessment

The feature organization is a useful foundation, but data integrity and incomplete interactions prevent treating this as a reliable production financial dashboard yet. Several screens present invented or missing values as actual market data. These issues take priority over styling and general refactoring.

## Architecture

| Area | Implementation | Main concerns |
| --- | --- | --- |
| Platform | Next.js 16.3.2 App Router, React 19.2.8, strict TypeScript, Tailwind 4, Lucide, Recharts | Lint failures, no automated test suite or CI configuration found |
| Shared UI | Root layout, navigation, footer, global CSS, homepage scanner preview | Hardcoded market ticker; keyboard accessibility gaps |
| Metals | Server-rendered metal/city routes, server API helpers, response mappers; browser proxies for search/history | Inconsistent unit fallbacks, stale chart state, loose city matching |
| IPOs | Server-rendered list/detail; URL filters; client subscription, broker review, and strengths/risks sections | Synthesized history; dropped pagination filters; oversized detail page |
| Stocks | Client-rendered screener; same-origin proxies to backend; country selection, movers, modal, chart | Missing-data defaults, mock fallback, request races, retained modal state, incomplete filters |
| Zakat | Local state and arithmetic in a client page | Input validation and eligibility checks are incomplete |
| Operations | Backend URL environment variable; public debug page and diagnostic API | Internal URL disclosure; no application-level fetch timeouts |

Data flow:

- Metals: server page → feature API → backend → mapper → server tables and interactive client components. Browser history/search requests go through Next.js route handlers.
- IPOs: server page → `/v2/ipos` or detail endpoint → server markup and interactive subsections.
- Stocks: browser → `/api/stocks` → `/stocks` backend endpoint, with `/company/stocks` fallback after a 404.
- Zakat: user inputs → local numeric conversion → 2.5% calculation; no backend dependency.

Metals cache latest prices for 300 seconds, popular cities and last-ten-days data for 3,600 seconds, and history for 1,800 seconds. IPO and stock requests use `no-store`. No polling or streaming makes stock quotes continuously live after loading.

## High-priority findings

### 1. Missing stock screening data becomes a positive compliance result

Source: [stock mapper](./features/stocks/utils/mappers.ts), starting at line 45.

Absent `shariah_compliance.status` defaults to `HALAL`; absent debt defaults to zero; missing sector/debt flags become `pass`. Unknown status strings also retain the initial compliant state. The mapper supplies cash ratio 8.5%, purification 0.25%, ROCE 14.2%, and estimated 52-week extremes. Debt-to-market-cap is assigned to a debt-to-equity field, although these have different denominators. Nifty 50 membership is inferred from market capitalization.

Impact: incomplete records acquire positive badges, zero-debt labels, and financial metrics unsupported by their source. Use explicit unknown states, nullable metrics, actual index membership, and documented calculations. Do not substitute estimates into fields presented as reported fundamentals.

### 2. Stock outages silently display mock records

Source: [stocks page](./app/stocks/page.tsx), lines 136–149.

A failed request loads all Indian mock stocks or an empty list for other countries. The UI does not identify this as demo data or an outage. The fallback ignores the selected search, sector, compliance filter, and sort. `backendError` is cleared but never populated or rendered.

Impact: a failed filtered request can display unfiltered sample prices and compliance results as normal results. Show an explicit error/retry state; reserve mock data for an explicitly labeled demo mode.

### 3. Stock detail state survives switching companies

Source: [stock detail modal](./features/stocks/components/StockDetailModal.tsx), lines 47–157.

The modal remains mounted when `stock` is null. Detail and audit state are not cleared when the stock changes. Once `auditData` exists, the audit effect exits before fetching another company's audit. Detail fetch failures retain the previous company's profile and quote; loading state does not hide those values.

Reproduction: open company A, load its audit, close it, then open company B. A's audit remains available under B's header. Key/reset state by company and market, and show loading/unavailable states. The audit request also omits country, unlike detail/chart/financial requests; confirm identifier uniqueness with the backend.

### 4. IPO market history is synthesized

Source: [IPO detail page](./app/ipo/[companyName]/page.tsx), lines 174–225; rendered around line 925.

The four-day history is constructed locally. Missing values fall back to GMP 143/79, subscription 1.42x/0.62x, fixed update times, and fixed dates. Older GMP values are generated by multiplying a prior value by 0.7 and 0.5. A missing rating displays as 4/5.

Impact: historical prices, subscription demand, and estimated profits can appear factual even when the backend did not supply them. Render actual dated observations, or show unavailable data. Keep illustrative scenarios visibly separate from observed history.

### 5. Metals fallbacks mix weights and invent rates

Source: [metal city page](./app/(metals)/[metal]/[citySlug]/page.tsx), lines 160–193; [calculator](./features/metals/components/SmartMetalCalculator.tsx), lines 34–52.

If a 22K or 18K 10g quote is absent but a 1g quote exists, the hero uses that 1g quote directly as the 10g amount. The 24K 1g fallback can select a quote with another weight. Missing prices also fall back to fixed amounts such as 15495 and 250, and the calculator labels fallback prices as live.

Impact: partial backend data can produce a tenfold unit error or an invented cost estimate. Normalize all prices to a known unit, convert explicitly, and disable calculations when a trustworthy rate is unavailable.

## Functional and reliability findings

### 6. Stock filters and sort controls are only partly implemented

Source: [stocks page](./app/stocks/page.tsx), lines 98–149 and 173–198.

Market-cap selection does not affect the request or local results. Zero-debt has no backend or local predicate. Nifty 50 and high-purity presets only request compliant stocks. Sorting by change, score, debt, or purification falls back to market-cap sorting. Footer `?filter=` links are not consumed by this page. Sector choices come from the current page of results rather than the whole market.

Implement these against the complete dataset before pagination, or hide unsupported controls. Preserve the selection in URL parameters if links are intended to be shareable.

### 7. Screener requests can overwrite newer selections

Source: [stocks page](./app/stocks/page.tsx), lines 98–153.

There is no cancellation or request-generation check. If request A finishes after request B, A can overwrite stocks, counts, and loading state while B's country/filter remains selected. Guard all state writes by request identity or use abortable requests.

### 8. Summary statistics describe only the current page

Source: [summary strip](./features/stocks/components/StockSummaryStrip.tsx), lines 17–47.

Counts and percentages use `stocks.length`, although only one page is loaded. Labels describe the monitored universe. Empty results compute `0 / 0`, producing `NaN%`. Use aggregate backend statistics or label these as current-page statistics and guard zero totals.

### 9. Returning to the initial metals chart controls leaves the wrong series

Source: [history chart section](./features/metals/components/HistoryChartSection.tsx), lines 89–99.

After changing from the initial timeframe to another, returning to the initial settings suppresses fetching whenever the current chart has points. It does not restore `initialData`, so the previous timeframe remains displayed under the restored controls. Requests also lack protection against out-of-order completion.

### 10. City resolution is not an exact lookup

Source: [city API](./features/metals/api/cities.server.ts), lines 77–107.

The resolver uses the first search result instead of matching the requested slug, does not ensure a slug on that record, and returns null for backend failures. This can show another city's prices, issue history requests with an empty slug, or convert an outage into a 404. Match normalized slugs and distinguish not-found from upstream failure.

### 11. IPO pagination discards filters

Source: [IPO list](./app/ipo/page.tsx), lines 469 and 477.

Previous/next links preserve only status and category. Search, halal selection, sort, type, snapshot date, and custom limit disappear. Copy the full current query and change only the page. The sort URL helper also omits snapshot date and limit.

### 12. Broker consensus can mislabel negative reviews

Source: [broker consensus](./features/ipo/components/BrokerConsensusSection.tsx), line 69.

Whenever fewer than 50% recommend Apply, the headline labels consensus Neutral. For example, all Avoid reviews produce “0% Neutral” instead of identifying the negative consensus. Derive the headline from the actual distribution, including mixed and unrated outcomes.

### 13. Zakat input changes leave a stale calculated result

Source: [Zakat page](./app/zakat/page.tsx), lines 19–35.

Editing an input does not clear or recalculate the previous result. Negative and non-finite numeric inputs are not rejected. The function calculates 2.5% of positive net assets without evaluating the eligibility conditions described elsewhere on the page. Clarify that eligibility is an assumption or collect the required eligibility inputs, and validate all amounts before calculation. This review does not independently adjudicate the religious rules.

## Security and operational quality

- [Diagnostic API](./app/api/test-backend/route.ts): publicly returns the configured backend URL and error details. Restrict diagnostics to development or an authenticated operational surface.
- [Stock proxies](./app/api/stocks/route.ts): return raw upstream error bodies to browsers and have no explicit request timeout. Sanitize public errors and bound request duration. If the fallback fails, its status is discarded and the original 404 is returned, obscuring outages.
- [History API](./app/api/metals/history/route.ts): casts arbitrary query strings to TypeScript unions without runtime enum validation. Validate metal, duration, purity, and unit combinations, and bound pagination inputs elsewhere.
- Server-only API modules rely on comments and naming rather than `import 'server-only'`. Add an enforceable boundary to avoid accidental client imports.
- Metal pages await an additional batch of up to ten city-price requests before rendering; optional comparison data can delay the primary price view. Stream that section separately and tolerate nonessential history failures.
- No route-level `error.tsx` or `loading.tsx` files were found. Error behavior differs among features: some throw, some render generic pages, and some suppress failures into empty results.

## UI, maintainability, and documentation

- Navigation's market ticker is a hardcoded array. The homepage scanner also uses sample records. Clearly label demo content or connect it to dated data.
- Stock export only opens an alert; it does not create a CSV.
- Stock cards and sortable table headings use click handlers on non-button elements. The modal lacks dialog semantics, Escape handling, focus trapping, and focus restoration. Calculator labels are not consistently associated with inputs.
- `StockCandleChart` renders a close-price area series, not candle bodies/wicks, despite its name. Every range is requested with a daily interval, including 1D; confirm and align supported intervals with the backend contract.
- IPO detail is roughly 1,430 lines and 83 KB of source; the stock modal is roughly 34 KB. Extract coherent sections and pure transformation functions after correctness fixes.
- Response interfaces do not validate runtime JSON. Extensive `any` usage and multiple guessed envelope formats weaken otherwise strict TypeScript settings.
- README and implementation notes mainly describe metals, claim successful linting, reference a nonexistent Tailwind configuration file, and specify Node 18+. The installed Next.js documentation requires Node 20.9+. Document IPO/stock contracts and clarify backend/frontend ports.
- `.env.example` exists locally but `.gitignore` excludes `.env*`, and `git ls-files .env.example` returns no entry. The documented environment template will be missing from a clean checkout.
- No automated tests, test script, or CI workflow were found. Add targeted regression coverage for missing compliance, modal identity changes, query preservation, request races, and unit conversion.

## Suggested repair order

1. Remove invented production data and represent unknown values explicitly.
2. Fix modal identity isolation, metals unit conversion, and stale request/chart behavior.
3. Complete or remove unsupported filters; preserve URL state through pagination.
4. Validate backend contracts and inputs; improve errors, timeouts, and diagnostic access.
5. Establish clean lint/build checks and focused regression tests.
6. Improve accessibility, split oversized components, stream optional sections, and update documentation.

## Verification results

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed after a network-enabled retry; the initial attempt could not download Inter from Google Fonts |
| `npm run lint` | Failed: 599 errors, 86 warnings |
| Lint breakdown | 552 reports concern JSX constructed inside try/catch (`react-hooks/error-boundaries`), principally the IPO pages; 34 concern explicit `any`; the remainder include hook patterns, navigation, escaping, and `prefer-const` |
| Working-tree check | Existing application changes preserved; only this review document was added |

The lint count is not 599 independent product bugs: most reports repeat one structural issue across many JSX nodes. Move the fetch error handling outside the JSX construction and use appropriate rendering error boundaries rather than suppressing the rule wholesale.

## Verification limits

Source findings above are based on code inspection and explicit data/control flow. Browser interaction, backend response compatibility, market-data freshness, accessibility with assistive technology, load testing, and dependency vulnerability auditing were not verified. Type checking alone cannot detect the runtime data and state issues listed here.
