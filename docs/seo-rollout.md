# SEO implementation and rollout

## Implemented

- Shared sitemap regenerates hourly and paginates Indian stocks and IPOs.
- Stock eligibility currently requires a nonempty symbol/name and a positive quoted price. This is a conservative filter, not a full editorial quality assessment.
- City inventory is paginated; city details determine which metal pages exist in the sitemap.
- Inventory requests have timeouts, cached responses and bounded concurrency. A failed secondary page preserves successful results; errors are logged. Monitor partial inventory failures after deployment.
- Sitemap removes duplicates and fabricated modification dates. Metal price timestamps are used where valid. Stock and IPO dates are omitted until a trustworthy aggregate page-update timestamp is available.
- Stocks directory and company reports render core data on the server. The interactive screener, charts and peer navigation remain available.
- Company canonical URLs preserve country identity. Indian reports use the clean URL; other countries retain their country query parameter.
- Homepage, stocks, IPOs and metals metadata emphasizes the mainstream offering. Features such as Shariah screening remain available.
- Metal entry pages open the detailed Delhi report, preserving the data-first experience. City reports remain discoverable through the sitemap and links within each report; redirecting entry URLs are omitted from the sitemap.
- IPO descriptions reflect declared allotment, available GMP and listed status. Missing data is not described as zero GMP. Unconfirmed declaration is labelled honestly.
- Missing stock/IPO resources return 404/noindex; upstream failures use the error boundary rather than success-status empty reports.
- Stock listing API failures do not replace real quotes with mock prices.
- About and footer copy explains delays and research limitations; unsupported audience-size claims were removed.
- Debug route has noindex metadata.
- Added GA events: open_research_report (link clicks), view_research_report (report page mount), use_metal_calculator (first calculator change per page mount). No holdings, application details or search text are sent by these events.

## Validation

- Production build against the public backend passed.
- Generated sitemap contained 2,717 URLs during the initial verification: 2,167 eligible stocks, 140 IPOs, 402 metal-city pages, eight main pages. The three redirecting metal entry URLs were subsequently removed. Counts can change as backend data changes.
- Local production checks verified stock directory/report HTML, metal-city canonicals, IPO directory titles, debug noindex, and missing stock/IPO 404s.
- Regression suite: node --test tests/seo.test.cjs. Covers pagination, eligibility, deduplication, metal availability, real dates, partial failures, missing reports versus upstream errors, and country-aware URLs.
- TypeScript and targeted ESLint checks passed. Wider lint checks found existing issues in unrelated files; they are not part of this SEO rollout.

## Deployment and account steps

1. Deploy through the project's normal release process. No production deployment was performed by this task.
2. Ensure BACKEND_API_URL points to the production API and NEXT_PUBLIC_SITE_URL points to the canonical production origin. Local environment files were not changed; verification commands used a process-scoped public backend override.
3. Check /sitemap.xml and /robots.txt on production. Confirm sitemap counts, sample report content and missing-page behavior.
4. In Search Console, inspect /stocks, one stock, /ipo, one IPO, /gold and one city page. Verify Google's rendered content and selected canonical. Request indexing selectively after important changes.
5. Confirm the existing sitemap submission is successful. Resubmit if it was missing or failed; repeated submissions are unnecessary.
6. In GA DebugView, verify the research/calculator events. Choose meaningful events to mark as key events; this requires account access. Exclude team/test traffic using the account's internal-traffic configuration.
7. Monitor weekly: non-brand clicks, impressions, indexed eligible pages, queries by section, and useful product actions. Use comparable date ranges. The site's short history is not yet a reliable ranking baseline.

## Ongoing work

Exact vendor attribution for each dataset, human reviewer identities, Search Console analysis, measured mobile Core Web Vitals, editorial supporting content and earned references require additional evidence or account work. No authors, vendors, certifications or rankings were invented. This implementation improves technical eligibility and content presentation; it does not guarantee indexing or search positions.
