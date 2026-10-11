# Stock discovery and canonical fixes

Stock list pagination changes were reverted at the user's request. The original numbered
pagination and Previous/Next buttons are restored. Crawlable batch URLs and infinite
scrolling are deferred; the remaining changes below are retained.

Sitemap inventory batches now reject on failure instead of publishing partial XML. The
hourly Next.js route cache is retained; normal failed background revalidation retains its
last successful result. A cold deployment without a successful cached sitemap can fail
generation when the backend is unavailable. Do not deploy against an unavailable backend.
Cache persistence across deployments/instances still depends on the hosting platform;
this change does not add a durable cross-deployment sitemap archive.

Named stock records are no longer excluded solely because their quote is missing/zero.
The backend stock list currently has no per-company published/active field. Explicit false
values are respected if those fields are added; otherwise symbol and company name qualify
the record. Confirm these inventory records have usable company reports.

IPO detail canonical metadata uses the returned profile slug. The root layout no longer
supplies a homepage canonical to every child; the homepage already supplies its own.
`www.weestox.com` permanently redirects to `https://weestox.com`, preserving paths/queries.
The running development server needs restarting to load the next.config redirect.

On 11 October 2026, both live hostnames served WeeStox favicon/icon bytes matching local
assets, returned 200, and allowed crawling in robots.txt. Their HTML declared those icons.
Google's old triangle display cannot be refreshed directly by this code change. After
deployment, verify the hostname redirect and request homepage indexing once.

Validation: TypeScript, focused ESLint, and sitemap/stock-loader regression tests.
The existing local server returned backend fetch errors during live
data checks; fixture validation does not confirm production backend inventory completeness.

