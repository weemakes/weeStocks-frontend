# October 2026 acquisition and FAQ plan

## Target and measurement

Target: 1,000 users in October. Define this as GA4 users, not page views or Search Console clicks. Track organic search users separately from referral/social/direct users. Search Console showed only six clicks and 148 impressions in the supplied early report; this is not enough evidence to forecast 1,000 organic users. From 10 October, about 45–50 users per day are needed if the existing total is small. Treat this as an ambitious target, not a promise.

## Work implemented on 10 October

- Shared visible FAQ component with matching FAQPage JSON-LD.
- Homepage mainstream research, freshness and Zakat questions.
- Stock directory questions; company-report fallback questions where backend FAQs are absent. Existing backend FAQs remain visible and receive matching schema.
- IPO directory and report questions, including GMP limits, subscription, registrar verification and issue terms.
- Visible Zakat FAQs replace the previous schema-only answers. Metadata no longer promises live Nisab eligibility checking or dividend purification. Arithmetic and calculator behavior are unchanged.
- About questions and contextual internal links.
- Metal-city FAQs expanded for rate lookup and calculation; unsupported precise tax/dealer claims removed from the revised answers.

Questions are based on actual page functions, the supplied query examples and common user questions. No search-volume data was available; do not describe them as the most-searched questions. FAQ rich results are generally restricted to authoritative government and health websites. Schema is not a ranking guarantee.

## Priorities after deployment

1. Verify source HTML for each page family, FAQ/schema parity, canonical URLs and current prices/dates. Request indexing once for a few key pages, not thousands of duplicates.
2. Export Search Console queries and pages. Prioritize pages with meaningful impressions and relevant queries; do not pick winners from two impressions. Separate brand queries from non-brand research searches.
3. Concentrate editorial effort on current IPO reports, useful city metal reports and calculator explanations. Add verified sources, reporting dates and genuinely specific details. Do not manufacture long-tail city pages with identical data and no useful local distinction.
4. Link related reports and calculators from relevant answers and editorial sections. Avoid creating a separate URL for every question.
5. Publish accurate product walkthroughs and links through owned channels. Seek relevant community/referral exposure through useful contributions; no purchased links, fabricated reviews or unsolicited automated messages. Nothing has been published or messaged by this task.
6. Review weekly users by acquisition channel, non-brand impressions/clicks, useful calculator/report actions, indexed eligible pages and server errors. Avoid attributing early fluctuations to one change.

## Favicon

Previously verified production favicon.ico and icon.png matched WeeStox brand files. The triangle in supplied Google screenshots can reflect an older cached icon. Preserve stable branded assets, verify accessibility, request a homepage recrawl once and allow processing time. No guaranteed refresh date.

## Sources

- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/blog/2023/08/howto-faq-changes
- https://islamic-relief.org.za/zakat/calculator/faqs/

Zakat treatment of debts, jewellery and investment holdings requires appropriate qualified guidance. The tool provides arithmetic, not an eligibility ruling.
