# WeeStox QA audit

Audit date: 26 September 2026. Repository: `D:\halal-stock-frontend`. Framework: Next.js 16.3.2 / React 19.2.8.

**Release assessment: fixes required before presenting this as a reliable live financial screening product.** The production build passes, but data fallbacks can invent prices and compliance results, calculators have reproducible validation defects, and important routes have SEO and interaction gaps.

This report covers every page template, the five API route handlers, shared navigation, stock/IPO/metal data flows, calculators, charts, and configuration. Dynamic routes were sampled; this is not a claim that every company and city was tested. Existing working-tree changes were included in the review and left intact. No application fixes were made.

## 1. Verification and limits

| Check | Result |
|---|---|
| `npx tsc --noEmit` | PASS |
| `npm run build` | PASS after rerunning with network access. Initial sandboxed attempt failed downloading Inter from Google Fonts. |
| `npm run lint` | FAIL: 635 errors, 95 warnings |
| Source-only lint of `app components features api types` | Same 635 errors / 95 warnings across 79 files examined; detailed output in `qa-eslint-results.json` |
| Local production HTTP smoke check | 20 recorded route responses covering public route templates, valid/invalid resources, sitemap and robots; 18 baseline probes plus two follow-up detail probes |
| Actual exported function probes | Unit conversion works for tested fixtures; missing and unknown compliance both become compliant; synthetic 52-week prices reproduced |
| Browser spot checks | Zakat input/result behavior; platinum calculator, comparison table, FAQs; desktop screenshot inspection |
| Automated regression tests in repository | No existing test/spec files or test script found in application inventory |

Evidence files: [HTTP and function results](./qa-audit-results.json), [repeatable probe script](./qa-audit-checks.cjs), [lint results](./qa-eslint-results.json).

The browser checks used synthetic input values, not personal financial information. API results are snapshots of the configured backend, not independently verified exchange data. No production-domain crawl, Lighthouse run, field Core Web Vitals, full mobile/device matrix, screen-reader session, load test, or backend calculation audit was performed. Performance measurements below are **local complete-response elapsed times**, including body consumption, with three concurrent requests; they are not TTFB, LCP, INP, CLS, or production scores. HTML sizes are decoded response bytes and include Next.js payloads; they are not compressed transfer sizes or JavaScript bundle sizes.

The installed Next.js metadata and fetch documentation was consulted. Financial/religious policy and tax claims were checked for internal consistency, not certified as correct current guidance. Select and document the intended methodology with appropriate subject-matter review.

## 2. Page-by-page performance, SEO and UX

All public pages inherit the shared header/footer concerns in findings F02, F20 and F23. No tested page emitted a canonical link. Client Components are not inherently unindexable; the specific stock routes here defer useful data until client fetches, and the initial HTML checks showed no H1 on those stock responses.

| Page / route family | Local response | Performance assessment | SEO assessment | UX / correctness assessment |
|---|---|---|---|---|
| `/` | 200; 151 ms; 104,124 bytes | Static with 60-second revalidation. Four feeds awaited together before page content; no explicit request deadline. | One H1; root title/description appropriate broadly; no canonical/social metadata. | Hardcoded feed fallbacks and screening ratios can appear live. F01–F03. |
| `/about` | 200; 123 ms; 68,496 bytes | Static, little page-specific interaction. Native internal anchor causes full navigation. | One H1, but same title/description as home. | Clear content structure; advertised user/coverage counts need evidence; policy links point here without corresponding policies. F15, F20, F30. |
| `/zakat` | 200; 124 ms; 61,510 bytes | Static initial form, client calculation; no backend needed. | One H1; generic home metadata. | Missing threshold gating, inconsistent methodology, stale results, unnamed inputs and placeholder educational links. F06–F08, F21. |
| `/stocks` | 200; 235 ms; 43,031 bytes | Static shell; data appears after hydration and several independent client requests. Recharts/detail imports should be profiled. | Generic metadata; no H1 in tested initial HTML; row navigation uses clicks. | Silent mock fallback, request races, partial-page tier filtering, export stub, URL state gaps. F01, F04, F12–F14, F19, F22. |
| `/stocks/[symbol]` | TCS shell: 200; 40 ms; 49,370 bytes. Invalid fixture: 200; 229 ms | Client fetch after hydration; chart/detail content adds client work. The shell timing does not measure loaded report performance. | Generic title even for a ticker; no H1 in initial response; no server resource validation. | Error conflates outage and missing ticker; overlapping requests and optimistic clipboard feedback. F12, F16, F24. |
| `/ipo` | 200; 712 ms; 264,381 bytes | Slowest and largest response in this sample; server fetch uses `no-store`; full list markup plus client filters. | Specific title/description and H1; filter/sort URL indexing policy absent. | Pagination loses criteria; zero GMP displayed as missing. F13, F25. |
| `/ipo/[companyName]` | Listed link `/ipo/vishal-nirmiti`: 200; 206 ms; 155,696 bytes. Invalid fixture: 200; 123 ms | Server fetch uses `no-store`; large template (about 94 KB of source, not bundle size). Follow-up valid sample returned detail content with one H1. | Slug-derived metadata exists, but invalid resource produces indexable success response. | Fabricated historical GMP, invented issue defaults, outage shown as missing company. F05, F16, F26. |
| `/gold` | 307 → `/gold/delhi`; 193 ms | Fetches popular cities before redirect. | National landing page is a temporary redirect, not a substantive India page. | Backend failure leaves an empty selection grid. F17, F27. |
| `/silver` | 307 → `/silver/delhi`; 203 ms | Same redirect dependency. | Redirect metadata incorrectly advertises 24K/22K/18K rates. | Same empty fallback risk. F17, F27. |
| `/platinum` | 307 → `/platinum/delhi`; 66 ms | Same redirect dependency. | Same gold-purity metadata mistake. | Same empty fallback risk. F17, F27. |
| `/gold/[citySlug]` | Delhi: 200; 476 ms; 166,020 bytes | Server lookup then four parallel fetches; history delays main content; city comparison is streamed separately. | Specific title/description and H1; fuzzy city lookup can mismatch URL/content. | Calculator uses invented fallback rates; negative input accepted; comparison changes lost. F09–F11, F18, F28. |
| `/silver/[citySlug]` | Delhi: 200; 533 ms; 152,868 bytes | Same dependency chain; cached rates/history are a positive. | Specific title/description and H1. | Same calculator/comparison concerns; missing daily change is called flat. F09, F11, F28–F29. |
| `/platinum/[citySlug]` | Delhi: 200; 230 ms; 167,713 bytes | Same dependency chain; all short chart selections request nine months. | Specific title/H1; silver FAQs and gold hallmark content undermine topic accuracy. | Reproduced negative total, conflicting Nisab weights, wrong FAQs and zero comparison movement. F09–F11, F18, F28–F29. |
| `/debug` | 200; 66 ms; 42,861 bytes | Static shell plus a diagnostic request on mount. | Indexable with home metadata. Should not be a public search landing page. | Public diagnostic endpoint returns backend configuration. F23. |

Additional status checks: `/qa-invalid-metal` returned 404 with noindex. `/gold/qa-not-a-real-city` returned a streamed 200 with noindex and “City Not Found”; do not confuse this with the indexable IPO soft-404. `/robots.txt` and `/sitemap.xml` returned 404.

## 3. Prioritized findings

Severity: **P1** = high-priority accuracy/reliability issue; **P2** = material functional/SEO/accessibility problem; **P3** = improvement. “Verified” identifies direct source evidence; “reproduced” adds executed function, HTTP or browser evidence. Suggested fixes are not implemented.

### F01 — P1 — Missing screening data becomes compliant

**Evidence:** `features/stocks/utils/mappers.ts:78` defaults missing status to `HALAL`, initializes compliance to `compliant`, and only overrides for two recognized negative statuses. Missing boolean checks also become pass. Actual function probes returned `compliant` with score `100` for absent screening and `compliant` for `UNKNOWN`.

**Impact:** A stock without an audit can appear approved. **Fix:** Model unknown/pending explicitly, map all supported statuses, and require affirmative backend evidence for a pass. **Acceptance:** Absent, null, unknown and malformed status fixtures never produce compliant badges or a successful score.

### F02 — P1 — Static and fallback market numbers are presented as live

**Evidence:** `components/layout/Navigation.tsx:18` hardcodes the market ticker. `app/page.tsx:43` onward substitutes TCS prices, gold prices, IPO data, and Nisab inputs when feed fields are missing. The footer says data is updated in real time. Browser confirmed the static ticker appears on other pages too.

**Impact:** Simultaneously displayed prices can conflict, with no source timestamp or unavailable indicator. **Fix:** Use verified feed values, preserve freshness timestamps, and show unavailable/stale states. Restrict demo numbers to an explicitly labeled demo. **Acceptance:** Feed failure or absent fields never silently produce an apparently live quote.

### F03 — P1 — Home screening metrics are synthesized; valid zero change is replaced

**Evidence:** `app/page.tsx:47` uses `change_percentage || 2.28`, replacing a real zero with +2.28%. Around lines 110–143, debt-to-equity can substitute for debt-to-market-cap, cash ratios are fixed by status, and purification is assigned by compliant status rather than underlying income data.

**Fix:** Use null-aware handling, correctly named ratios, and actual screening metrics. Do not infer purification from a general badge. **Acceptance:** A zero-change stock displays 0.00%; missing metrics show unavailable; the UI names the actual denominator used.

### F04 — P1 — Screener failures silently switch to mock data

**Evidence:** `app/stocks/page.tsx:150` catches API errors and displays `mockStocksData` for India; other countries become empty. It never sets `backendError` in the catch, and fallback data ignores search, sector, status, preset and tier filters.

**Reproduce:** Fail `/api/stocks` while filters are active. **Fix:** Show a retryable error or timestamped last successful result; do not substitute fabricated financial results. **Acceptance:** Outages are distinguishable from no matches and filtered data remains truthful.

### F05 — P1 — IPO historical GMP is fabricated

**Evidence:** `app/ipo/[companyName]/page.tsx:186` constructs four historical rows. Fallback GMP values include 143 and 79; earlier rows multiply previous GMP by 0.7 and 0.5; subscription values and update times are hardcoded.

**Impact:** Historical trend, estimated listing price and per-lot profit can be invented even when the rest of the profile is real. **Fix:** Render only actual dated backend history; use unavailable states for missing observations. **Acceptance:** Every historical row maps to a source snapshot and no invented row appears when history is missing.

### F06 — P1 — Zakat form does not enforce its stated eligibility conditions

**Evidence:** `app/zakat/page.tsx:25` only totals assets minus liabilities and multiplies by 0.025. Its explanatory text says a minimum threshold and a lunar year apply. **Browser reproduction:** cash `100`, all other inputs blank → “YOUR ZAKAT OBLIGATION ₹2.5”.

**Fix:** Either collect/confirm eligibility and the selected threshold methodology or clearly label this as a percentage estimate for already-qualifying wealth. **Acceptance:** Below-threshold and unconfirmed eligibility scenarios cannot display an unconditional obligation.

### F07 — P1 — Nisab assumptions conflict across pages; platinum uses its own rate as silver

**Evidence:** `app/zakat/page.tsx:397` shows gold 87.48g / silver 612.36g; home and the metal calculator use 85g / 595g. `SmartMetalCalculator.tsx:49` labels platinum 85g but line 52 computes 595 × `prices.perGram`, which is the platinum price on this page. Browser showed “85g” and ₹32,48,700 at ₹5,460/g, while the hero labels the same value 595g.

**Fix:** Centralize a documented methodology; label variants explicitly if supported. Do not derive a silver benchmark from platinum's rate. **Acceptance:** Labels, formulas and cross-page values agree for the selected method, including platinum.

### F08 — P2 — Zakat result becomes stale when inputs change

**Evidence:** `app/zakat/page.tsx:20` updates inputs without clearing/recomputing `result`. **Browser reproduction:** calculate cash 100 → ₹2.5; change cash to 200 → result remains ₹2.5.

**Fix:** Recompute continuously or visibly mark/clear outdated results. **Acceptance:** Displayed values always correspond to current inputs or explicitly require recalculation.

### F09 — P1 — Metal calculator accepts negative weights and invents unavailable rates

**Evidence:** `SmartMetalCalculator.tsx:36` uses hardcoded rates when actual prices are absent; line 42 parses weight without a finite, positive check; line 153 stores any input. An HTML `min` attribute does not block this immediate calculation. **Browser reproduction:** platinum weight -10 → estimated purchase cost -₹60,737 with negative making charge and GST.

**Fix:** Require positive finite weight and a verified rate; disable totals on invalid/missing input. Validate boundaries beyond HTML attributes. **Acceptance:** Negative, empty, non-finite and missing-price fixtures cannot produce valid-looking purchase estimates.

### F10 — P2 — Platinum chart controls misrepresent the selected timeframe

**Evidence:** `HistoryChartSection.tsx:71` converts every platinum duration except 1Y to 9M, while the UI offers 1D, 1W, 1M, 3M and 6M. The API helper and proxy repeat this behavior. Chart labels retain the user's selected duration.

**Fix:** Show only supported durations or return the selected interval. **Acceptance:** Requested range, highlighted control and chart data interval agree.

### F11 — P1 — City comparison always loses daily movement

**Evidence:** `CityRatesSection.tsx:12` maps prices without passing `change` or `changeDirection`; `CityComparisonTable.tsx:132` renders missing movement as ₹0.00. **Browser reproduction:** Delhi platinum matrix shows +₹850 for 10g, but Delhi comparison shows ₹0.00.

**Fix:** Pass a change normalized to the same metal/purity/weight as the quote, and distinguish missing from zero. **Acceptance:** Comparison and matrix agree for the same quote; unavailable movement is not shown as flat.

### F12 — P2 — Overlapping requests can overwrite newer selections

**Evidence:** Stock list fetch (`app/stocks/page.tsx:118`), stock detail load (`app/stocks/[symbol]/page.tsx:45`), metal history fetch (`HistoryChartSection.tsx:65`) and city search (`CitySelector.tsx:49`) write results without aborting old requests or checking a request ID. Stock chart loading follows a similar pattern.

**Reproduce:** Delay an earlier search/range/country response until after a newer response. **Fix:** Abort superseded requests or ignore stale completions, including their loading/error updates. **Acceptance:** The visible data always belongs to the current selection under reversed response ordering.

### F13 — P2 — IPO pagination discards active filters

**Evidence:** `app/ipo/page.tsx:471` and 479 preserve only status/category in next/previous links. Search, sort, type, halal, snapshot date and custom limit are lost. The sort URL builder also omits snapshot date and limit.

**Fix:** Clone current query parameters and modify only the intended field; reset page when changing criteria. **Acceptance:** Search + halal + sort + snapshot remain unchanged across next/back navigation.

### F14 — P2 — Market-tier filtering happens after pagination

**Evidence:** `app/stocks/page.tsx:139` filters only the returned page, then retains the backend's unfiltered total and page count.

**Impact:** Empty or short pages can occur despite matching stocks elsewhere; totals are misleading. **Fix:** Apply tier in the backend query before pagination or paginate a complete filtered dataset. **Acceptance:** Page contents and totals represent the same filter.

### F15 — P2 — Important pages share the homepage metadata

**Evidence:** `app/layout.tsx:14` is the only metadata for about, zakat, stocks and stock detail. Local HTTP checks confirm identical titles. Stock list/detail initial responses have no H1.

**Fix:** Add page-specific server metadata and meaningful server-rendered stock identity/content. Wrap client interactions inside server route components. **Acceptance:** Each valid page has an accurate unique title, description and primary heading; a stock share preview identifies the company.

### F16 — P2 — Invalid IPOs are indexable soft-404s; stock identity is not server-validated

**Evidence:** `app/ipo/[companyName]/page.tsx:1414` returns normal JSX for every failure. Invalid IPO URL reproduced HTTP 200 without noindex. Invalid stock URL also returns 200 with a generic loading shell; the API wrapper returns null for both network failure and 404.

**Fix:** Distinguish genuine not-found responses from outages, use framework not-found handling for absent resources, and provide retryable outage UI. Validate stock identity server-side. **Acceptance:** Invalid resources are not indexable success pages; valid resources during outages are not falsely classified as permanently missing.

### F17 — P2 — Discovery, canonicalization and social metadata are incomplete

**Evidence:** No sitemap/robots/OG/Twitter/canonical implementation found; `/sitemap.xml` and `/robots.txt` returned 404. Metal index titles reuse gold purity terminology for silver/platinum (`app/(metals)/[metal]/page.tsx:38`).

**Fix:** Add a sitemap of verified public URLs, robots policy, metadata base, canonical strategy, social previews, and metal-specific titles. Decide which filter pages should be indexed and retain distinct paginated pages where appropriate. Add truthful breadcrumb/organization structured data where useful. Missing robots.txt does not by itself prevent indexing, and structured data is an enhancement, not a ranking guarantee.

### F18 — P2 — City slug lookup can display the wrong city's content

**Evidence:** `features/metals/api/cities.server.ts:88` searches by slug and returns `cities[0]` without an exact normalized slug match. All errors return null, so an outage is treated as a missing city.

**Fix:** Resolve exact canonical slugs; reject unrelated search results; separate lookup failure from absence. **Acceptance:** A partial/ambiguous slug never serves another city's rates under the requested URL.

### F19 — P2 — Export is a placeholder

**Evidence:** `app/stocks/page.tsx:270` only runs `alert(...)`; no file is generated.

**Fix:** Implement a real export with explicit current-page/all-filtered scope, or remove/disable the action until available. **Acceptance:** Export produces a CSV with correct headers, currency, filters and row count.

### F20 — P2 — Navigation promises destinations that do not exist

**Evidence:** `components/layout/Footer.tsx:43` links to `?filter=zero_debt` and `?filter=nifty50`, but stocks reads only `country` from the URL. Privacy and Terms point to About; the dividend purification link points to the generic screener. Zakat “Learn More” links use `#`. Header advertises Ctrl/Command+K without a corresponding keyboard handler in Navigation.

**Fix:** Implement the intended destinations/state or remove misleading labels. Keep URL filters synchronized with state, including country selection and browser history. **Acceptance:** Every labeled destination performs the advertised task and survives refresh/back navigation.

### F21 — P2 — Calculator controls lack accessible names

**Evidence:** Zakat labels are separate elements without `htmlFor`/input `id`; the browser accessibility tree exposes eight unnamed steppers. SmartMetalCalculator weight and slider have similar missing associations.

**Fix:** Associate labels, describe units/errors, and expose updated results through an appropriate live region. **Acceptance:** Each input has a unique meaningful accessible name and validation is announced.

### F22 — P2 — Stock interactions are not fully keyboard/semantic controls

**Evidence:** `StockTableView.tsx:141` attaches sorting to table headers without buttons/`aria-sort`; row navigation at line 235 and `StockCardView.tsx:113` uses click handlers on non-link containers.

**Fix:** Use real links for details and buttons for sort, with visible focus and `aria-sort`. Audit city dropdown keyboard dismissal, focus and expanded state. **Acceptance:** Keyboard users can sort, open details and operate selectors without pointer input.

### F23 — P2 — Debug configuration is publicly exposed

**Evidence:** `/debug` is indexable. `app/api/test-backend/route.ts:17` and 47 return the backend URL, including any URL configuration embedded in it, without an environment/authentication gate.

**Fix:** Disable public diagnostics in production or restrict access and redact configuration. Noindex alone is not access control. **Acceptance:** An unauthenticated production request cannot retrieve internal endpoint configuration.

### F24 — P3 — Share feedback reports success before clipboard completion

**Evidence:** `app/stocks/[symbol]/page.tsx:79` invokes `navigator.clipboard.writeText` without awaiting/catching, then immediately shows Copied.

**Fix:** Await success and show an actionable fallback on denial. **Acceptance:** Denied clipboard access never reports success.

### F25 — P2 — Zero GMP is conflated with missing GMP

**Evidence:** `app/ipo/page.tsx:91` makes `gmp.value === 0` a no-data state.

**Fix:** Distinguish null/undefined from a reported zero. **Acceptance:** A true zero premium displays ₹0 / 0% as available information; absent data remains unavailable.

### F26 — P1 — Stock and IPO defaults invent financial inputs

**Evidence:** `features/stocks/utils/mappers.ts:142` onward supplies fixed cash/purification/ROCE values, derives missing 52-week high/low as ±15%, maps debt-to-market-cap into debt-to-equity, and infers NIFTY membership from market cap. Exported-function fixture with price 100 and missing range returned 85 and approximately 115; these ranges are used by stock cards/tables. `app/ipo/[companyName]/page.tsx:160` defaults missing lot size to 1 and upper price to 100 before deriving investments and lot limits.

**Fix:** Preserve absence, validate units and source actual membership/financial inputs. Do not derive unrelated ratios or market observations. **Acceptance:** Missing fields cannot produce a fabricated historical range, index membership or investment requirement. Some mapper fields are legacy/latent; prioritize those displayed in active cards/tables.

### F27 — P2 — Data requests can delay or fail entire pages without a useful recovery boundary

**Evidence:** Home waits for all four feeds before returning; metal city waits for city lookup and then history alongside core rates; IPO calls use uncached fetches; shared fetch/proxies have no explicit timeout. No application `error.tsx` found; only metal city has a route loading file. Metal index failure returns an empty city selector because `getPopularCities` swallows errors.

**Fix:** Set bounded deadlines, isolate optional sections with streaming/loading/error states, and provide retries. Cache by an explicit freshness contract where suitable. **Acceptance:** Slow historical/secondary feeds do not block useful primary content and errors are distinguishable from empty results.

### F28 — P2 — Platinum page reuses silver FAQs and gold-specific guidance

**Evidence:** `features/metals/components/MetalInvestorGuide.tsx:10` branches only gold versus everything else. Browser platinum page asks “How is silver priced in Delhi?” and lists gold purity/hallmark guidance. Metal tables and calculator also label 10g as Tola without a distinct unit conversion.

**Fix:** Write separate gold/silver/platinum content and define weight units precisely. Review current policy/tax/investment copy with appropriate sources; do not copy gold-specific rules across metals. **Acceptance:** Every heading, FAQ, benchmark and guidance paragraph matches the active metal and declared unit.

### F29 — P2 — Missing historical movement is labeled flat; timestamps need reconciliation

**Evidence:** `Last10DaysTable.tsx:159` onward labels absent change “Flat”. `mapLast10Days` passes through data without normalizing or preserving top-level unit/city metadata. Browser platinum showed current 26 Sept rate ₹5,460 but the history row for 26 Sept showed ₹5,375. The discrepancy is observed; its backend/caching cause is not established.

**Fix:** Normalize the response contract, distinguish absent/zero change, display snapshot times and reconcile same-date records. **Acceptance:** Missing change is unknown, not flat; differing intraday/daily-close snapshots are clearly labeled.

### F30 — P3 — Readability, motion and content credibility need refinement

**Evidence:** Dense 10–12px labels across financial tables; large detail templates; continuous shared ticker; no `prefers-reduced-motion` CSS found. About's user/coverage counts are literals. Desktop platinum screenshot showed coherent layout, but many secondary labels are visually small/light; contrast ratios were not measured.

**Fix:** Increase critical label sizes, test contrast/zoom, offer reduced motion, simplify detail navigation and attach sources/dates to credibility claims. Verify mobile menu expanded state and focus behavior. **Acceptance:** Test 320/375/768px widths, 200% zoom, keyboard access, both themes and reduced-motion preferences; do not treat this audit as a WCAG certification.

### F31 — P2 — Proxy error bodies are consumed twice

**Evidence:** Stock route handlers call `response.json()` and then `response.text()` when JSON parsing fails (`app/api/stocks/route.ts:41`, catch-all line 48). Actual standard Response probe confirms the second read throws “Body has already been read”.

**Impact:** A plain-text/HTML upstream HTTP error can be mislabeled a network 502 and lose its original message/status. **Fix:** Read once as text and parse conditionally, or clone before parsing. **Acceptance:** JSON, text and empty error bodies preserve the intended safe status/message. Also define which error to return when primary 404 fallback fails.

### F32 — P2 — Runtime API validation is incomplete

**Evidence:** `app/api/metals/history/route.ts:16` casts arbitrary query strings to types, checking presence only. `mapLatestPrice` directly iterates nested arrays; `mapLast10Days` can return an object where the component expects an array. Stock API helpers do not consistently handle HTTP-200 `status:0`; only some clients implement it. `api/client.ts` is not the universal client used by active stock/IPO paths.

**Fix:** Validate enums, pagination bounds, array shape, numeric finiteness and application-level success at shared boundaries. Normalize errors consistently. **Acceptance:** Invalid requests produce controlled 400s, malformed responses produce controlled unavailable states, and `status:0` cannot be treated as successful financial data.

### F33 — P2 — Lint gate fails and no regression suite protects calculations

**Evidence:** 635 errors / 95 warnings. Breakdown: 552 `react-hooks/error-boundaries`, 61 explicit-any, 11 set-state-in-effect, 8 internal-anchor errors, plus immutability/prefer-const/unescaped-entity errors. Warnings: 87 unused variables, five effect dependencies, three image warnings. Many JSX diagnostics repeat across large try/catch-render blocks; **730 diagnostics do not mean 730 independent runtime bugs**.

**Fix:** Refactor render error handling, address actual hook dependencies/mutations, type response boundaries and add targeted regression checks. Keep build, TypeScript and lint as separate CI gates. **Acceptance:** All gates pass, with regression tests for financial data absence, validation, query state and race conditions.

## 4. Calculation audit

| Calculation | Result / boundary case | Assessment |
|---|---|---|
| `normalizedPrice`: 10g at 100,000 → 1g | Executed result 10,000 | PASS for tested fixture |
| `normalizedPrice`: 1g at 100 → 1kg | Executed result 100,000 | PASS for tested fixture |
| Missing 22K when only 24K exists | Executed undefined | Good preservation of absence; downstream calculator defeats this with a hardcoded fallback |
| Purchase formula | `weight × rate × (1 + making%/100) × 1.03` when GST selected | Arithmetic matches its declared model. At 10g × 5,460 with 8% making: 54,600 + 4,368 + 1,769.04 = 60,737.04; browser rounds total to 60,737. Tax applicability not independently certified. |
| Negative purchase weight | Browser -10g → -60,737 | FAIL validation |
| Zakat percentage | `(assets - liabilities) × 0.025`, clamped to zero | Arithmetic straightforward; eligibility incomplete and edited result stale |
| Zakat threshold consistency | 87.48/612.36 vs 85/595 | FAIL internal consistency unless deliberately labeled as different methods |
| Platinum threshold | Label 85g; result equals 595 × platinum/g | FAIL label/formula/reference consistency |
| Stock change | `0 || 2.28` | FAIL: zero becomes positive change |
| Stock debt ratio | Debt-to-market-cap assigned as debt-to-equity | FAIL semantic calculation mapping |
| IPO GMP estimates | Upper price + GMP; GMP × lot size | Arithmetic sensible only with valid inputs; synthetic history/default price/lot invalidate reliability |
| IPO lot limits | Floor of budget / lot cost, minimum forced to one | Needs boundary coverage: missing/zero cost, lot above budget, SME/mainboard policy and backend-provided distribution precedence. Current regulatory correctness is not established. |
| ROE/ROCE/yield/debt formatting | Several backend fields multiplied by 100 | Confirm whether backend units are fractions or percentages; not enough evidence to call the multiplication itself wrong |
| GoldCalculator legacy component | Similar purchase formula; state derived in an effect | Exported but no active route usage found. Consolidate with the active calculator to prevent divergent behavior. |
| Technical indicators / Shariah audit | Mostly backend fields displayed | Backend formulas, denominators, reporting period and methodology cannot be certified from this frontend repository |

Use integer minor units or an explicitly chosen decimal/rounding policy for money where exact totals are required. Define whether displayed components must sum exactly to the displayed total; currently whole-rupee display can hide fractional differences.

## 5. Performance improvement order

1. **Measure actual browser performance before choosing optimizations.** Run production Lighthouse/mobile traces and collect field LCP/INP/CLS. Track cold and warm loads separately with representative real stock and IPO details; local response samples are only a starting point.
2. **Shorten dependency chains.** Render home/metal primary content while optional history and secondary panels resolve. Keep the existing parallel fetches and streamed city comparison, which are good foundations.
3. **Profile client bundles.** Stock detail and metal charts import Recharts eagerly. Load optional/below-fold chart or report sections on demand where it improves measurements; do not infer bundle size from source size. Preserve accessible summaries and meaningful initial HTML.
4. **Set request budgets and freshness rules.** IPO pages and stock proxy requests are uncached; metal rates cache 300 seconds, history 1,800 seconds, daily history 3,600 seconds. These are not equivalent to real-time updates. Use source timestamps and appropriate refresh UX.
5. **Reduce avoidable work.** Fix request races, avoid unnecessary repeated tier fetches, keep data transformations outside repeated rendering where measurable, and remove genuinely unused legacy components after confirming usage.
6. **Make builds dependable.** Current Google font download requires build-time network access. Consider a locally hosted font for offline/restricted build environments; runtime font loading already uses `display: swap`.

## 6. Suggested release acceptance checklist

| Area | Required verification |
|---|---|
| Truthful data | Every displayed quote/compliance status has a real source or explicit unavailable/demo label; no generated history |
| Calculators | Positive/negative/zero/blank/decimal/extreme values, missing rates, threshold boundaries, edited results, consistent methodology |
| API behavior | 200 success, 200 business failure, 404, 429, 500, text/empty/malformed JSON, timeout, stale and out-of-order responses |
| Stocks | Country + search + tier + halal + sort + pagination; refresh/back/forward; keyboard links; real CSV |
| IPOs | Valid/missing company, zero/negative/missing GMP, unavailable lot/price, all filters retained on pagination |
| Metals | All three metals across multiple exact city slugs; units/purities, missing history, supported durations, consistent daily change |
| SEO | Unique metadata/H1, valid canonicals, sitemap/robots, resource-not-found behavior, social previews, filter URL policy |
| UX/accessibility | Mobile widths, 200% zoom, both themes, readable contrast, labeled controls, keyboard focus, reduced motion, no placeholder links |
| Performance | Cold/warm production browser measurements for every route family; no invented aggregate score |
| CI | Build + TypeScript + lint + targeted regression suite |

Recommended order: resolve **F01–F07, F09, F11 and F26** first for trustworthy data and calculations; then repair query/state/error behavior, SEO, accessibility and export; finally profile and optimize with measured browser evidence.
