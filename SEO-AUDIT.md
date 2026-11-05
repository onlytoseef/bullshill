# Bullshill SEO audit — 5 November 2026

**Overall SEO readiness: 5/10.** This is an editorial audit score, not a Google, Lighthouse, or keyword-ranking score. Basic technical eligibility is good; production blog delivery and the depth of commercially important pages are the largest weaknesses.

Scope: all 19 URLs in the live https://bullshill.com/sitemap.xml, robots.txt, public CMS availability, invalid URL handling, HTTP/HTTPS normalization, server HTML, internal links, metadata, selected mobile browser renders, and the local Next.js/Payload implementation. No application code was changed for this audit.

The audit does not establish actual Google index coverage. Search Console, server logs, backlink data and CrUX/Core Web Vitals field data were not available. No known published article URL was supplied, and no article URLs were publicly discoverable during the audit. Article templates and publishing behavior were reviewed in code; individual published articles could not be verified.

## Score rationale

| Area | Score | Weight | Reason |
| --- | --- | --- | --- |
| Basic crawl/index eligibility | 8/10 | 30% | All sitemap pages work and have correct basic metadata; blog service availability is separately scored below. |
| Blog publishing and availability | 2/10 | 25% | Production CMS endpoints fail; the public blog is empty and the sitemap contains no posts. |
| Page content and differentiation | 4/10 | 25% | Service detail content mostly repeats existing summaries; case studies are extremely brief and reuse generic metrics. |
| Metadata and structured information | 5/10 | 10% | Unique titles/canonicals exist; service descriptions are unwieldy, structured data is absent, most OG images are absent. |
| Discovery and internal linking | 6/10 | 10% | Existing sitemap pages have inbound links, but the home blog teaser links to itself and the publishing queries stop at 200 posts. |

Weighted result: 5.0/10. Performance is a risk requiring measurement, rather than an invented numeric performance grade.

## What already works

- All 19 sitemap URLs returned HTTP 200 during the crawl.
- All 19 had unique titles, one main H1, and a matching self-referencing canonical.
- None of those pages had a noindex directive in the HTML or X-Robots-Tag response header.
- robots.txt allows crawling and declares the correct HTTPS sitemap.
- No sitemap URL was orphaned within the crawled site's HTML link graph. This is not a guarantee that every historical URL is linked.
- Main page text is present in the server HTML rather than existing only in canvas graphics.
- Invalid service and blog probes returned HTTP 404, not a success page masquerading as an error. The error HTML included noindex.
- HTTP requests to the apex domain and the tested trailing-slash service URL resolved to the preferred HTTPS, non-trailing-slash URL.
- Payload publication status is explicitly filtered when reading posts. Draft protection is implemented.
- Publication hooks already invalidate the blog, sitemap and affected old/new article paths.
- No image was missing an alt attribute in the crawled HTML. Empty decorative alt text is not inherently an error; meaningful cover images still need useful editor-provided alt text.

## P0 — Restore the production blog/CMS pipeline

**Live evidence:**

| Check | Observed result |
| --- | --- |
| `/blog` | HTTP 200, but displays "No articles published yet" and has no article links. |
| `/sitemap.xml` | HTTP 200; 19 URLs; zero `/blog/{slug}` entries. |
| Public `/api/blog-posts` query restricted to published posts | HTTP 500. |
| `/admin` | HTTP 500. The page is already marked noindex/nofollow. |

This supports a production CMS availability/configuration problem. It does **not** establish whether any posts actually exist in the production database, nor identify the exact configuration failure. An empty public listing cannot currently be interpreted as proof that the database contains zero published posts.

**Required work:** inspect deployment logs and validate the production database connection, migrations/schema, Payload secret, permissions and runtime configuration. Confirm the application and CMS point to the intended production database. Do not expose connection strings or secrets in diagnostic output. Then verify at least one known published post end to end.

Relevant implementation: `payload.config.ts`, `lib/cms/client.ts`, `lib/cms/posts.ts`, `app/(frontend)/blog/page.tsx`, `app/(frontend)/blog/[slug]/page.tsx`.

## P0 — Stop treating a CMS outage as missing content

`getCms()` returns null on configuration/database failure. Listing and sitemap queries turn this into an empty array. The article query returns null, which the page turns into `notFound()`.

**Risk:** during an outage, a real published article can be represented as a 404, while the listing and sitemap remove its discovery links. Those incorrect responses can also enter page caches. This failure path is confirmed in code; it was not demonstrated against a known published article because none was supplied or discoverable.

Distinguish three cases:

1. Healthy CMS, real published post: serve its content with HTTP 200.
2. Healthy CMS, unknown/unpublished post: return a real HTTP 404.
3. CMS failure: retain last-known-good content where available; otherwise use appropriate temporary unavailability handling rather than claiming the article does not exist. Preserve/serve the last successful sitemap instead of silently publishing an empty blog sitemap.

Do not cache an outage as a successful empty listing or a permanent missing post. Keep error monitoring on the blog API, a representative published URL and sitemap article count. Google explains how [HTTP errors affect crawling and indexing](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes).

## P1 — Make published posts discoverable everywhere

The homepage blog section still renders static content from `lib/content.ts`. Its teaser cards use `href="#blog"` rather than article URLs. Clicking a teaser stays on the homepage.

Replace this teaser data with the latest published CMS posts and actual `/blog/{slug}` links. Link relevant articles from service pages, and add contextual related-service/related-article links in articles. Keep a crawlable default all-articles listing; do not make articles accessible only after clicking a filter.

There is also a **200-post ceiling** in both `getPublishedPosts()` and `getPublishedPostEntries()`. After that threshold, older posts can fall out of the listing and sitemap even if their detail URLs still work. Use complete paginated CMS traversal for the sitemap and crawlable archive pagination for the listing.

Editing a post slug currently invalidates the old path but does not create an old-to-new redirect. Store slug history and provide permanent redirects when a published URL changes. Cache invalidation is not a replacement for a redirect.

Google's [link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) explains the role of real anchor links in discovery. Its [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) also makes clear that inclusion is a discovery hint, not an indexing guarantee.

## P1 — Give each service detail page its own useful substance

The seven live detail pages contain approximately 114–141 extracted main-content words each, including shared sections. Much of the useful text repeats summaries already displayed on the homepage and service listing.

There is no Google minimum word count. The concern is limited distinct value and lack of answers for someone evaluating a specific service.

For each service, add real, distinct information about deliverables, channels, client/project fit, process, realistic timelines, measurement, relevant evidence, service-specific FAQs and a relevant case study. Include pricing context only if accurate and commercially appropriate. Avoid padding every page with the same paragraphs or generic keyword lists.

Examples of better search-intent alignment:

- Main Services title/H1: explain that these are crypto/Web3 marketing services rather than only "Services" / "What We Do".
- Blog index title/H1: describe crypto/Web3 marketing insights rather than a generic company-inside-story heading.
- Each service: one primary intent with natural related terminology and descriptive internal links. Do not repeatedly force every keyword into headings.

## P1 — Turn the case-study pages into actual case studies

The four live detail pages contain approximately 57–64 extracted main-content words each. Their title, summary and artwork differ, but every page renders the same metric set from `caseStudyDetail.metrics`.

Use each project's real achievements rather than the shared placeholder metrics. Explain the starting situation, objectives, dates, campaign actions, measurement method, results and limitations. Include permission-cleared evidence and attributable client feedback when available. Verify broad client/partner claims and make agency identity/location information consistent and factual.

These are content/trust weaknesses, not a claim of a Google penalty. Changing schema alone will not supply the missing evidence.

## P1 — Fix rendering resilience and measure performance

The live homepage mobile H1 was visible after a normal browser load, but remained at computed opacity 0 after a reduced-motion load, even after the loader disappeared. Its text is present in server HTML, so this is a confirmed visibility/accessibility bug, not proof that Google cannot index the page. Review `components/motion/split-headline.tsx` and make essential text visible without depending on successful animation.

The loader is configured for an initial 2.3-second charge plus a 1-second reveal. Multiple page effects also involve GSAP, motion and WebGL particle canvases. The homepage's raw, decoded HTML was approximately 436 KiB with 15 external script tags; most other crawled pages had 14 script tags. Script count and decoded HTML size are observations, not equivalent to transferred JS bytes or a measured Core Web Vitals failure.

Measure representative production pages with PageSpeed Insights/Lighthouse and Search Console/CrUX. Prioritize LCP, INP and CLS; avoid delaying meaningful text/interaction for decorative loading; defer offscreen/nonessential effects; preserve real server-rendered content. Google's [Core Web Vitals guidance](https://developers.google.com/search/docs/appearance/core-web-vitals) recommends LCP within 2.5s, INP below 200ms and CLS below 0.1. Field performance was not measured in this audit.

Google renders JavaScript, but critical content should not require scrolling or clicking to be created. See [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) and [lazy-loaded content guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading).

## P2 — Improve metadata, structured data and credibility

- **Descriptions:** all seven service detail descriptions are the entire service paragraph: 377–522 characters. Write concise, distinct summaries suited to search intent, rather than simply copying the body. Around 140–160 characters can be an editorial target, not a Google rule or an indexing threshold; snippets are query-dependent and may be rewritten. See [Google's snippet documentation](https://developers.google.com/search/docs/appearance/snippet).
- **Structured data:** no JSON-LD was found on any of the 19 crawled pages. Add accurate Organization/WebSite information, visible BreadcrumbList trails, and Article/BlogPosting on real blog posts, including actual author, image and publication/modification dates. This helps describe content and can enable eligible search appearances; it is not required for basic indexing. Do not manufacture ratings or assume FAQ/self-serving review markup will produce stars. See [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article).
- **Social metadata:** the homepage has an `og:image`, but the other 18 live crawled pages did not. The CMS exposes `seo.ogImage`, yet the view model/metadata mapping does not use it. Wire up per-post images and a correct absolute fallback image. This primarily improves sharing; it is not an indexing fix.
- **Article dates:** retain machine-readable ISO publication and modification timestamps in the article view, render `time datetime`, and use those same timestamps in schema and sitemap entries. `publishedAt` is currently optional and no automatic publication-date hook is shown in the collection.
- **Legal credibility:** live Terms still contains `[Legal business name]`; Privacy Policy contains an analytics-provider placeholder. Complete and verify these details. This is a credibility/launch-readiness issue, not evidence of an automatic ranking penalty.
- **Testimonials:** the review wall mainly exposes screenshot imagery rather than substantial review text. Include accurate accessible text/attribution alongside the evidence where appropriate; do not assume search engines will interpret all screenshot text as useful review copy.
- **Host normalization:** the `www` HTTPS variant failed certificate validation in this audit environment (`DEPTH_ZERO_SELF_SIGNED_CERT`), and the independent web tool could not open it. Verify its actual DNS/certificate/redirect setup externally, then ensure a valid HTTPS redirect to the preferred apex host. This is a verification item, not a proven global outage.
- **Robots hygiene:** normal pages are already crawlable. The admin is already noindex in the tested response. Do not blindly block URLs in robots.txt and expect that to serve as noindex; do not add broad disallow rules as an indexing fix.

## Live URL inventory

Every URL below returned 200, had a unique title, matching canonical, one main H1 and no noindex. Word counts are approximate extracted main HTML text, including some shared page content; they are not recommended content quotas.

| Path | Main words | Description characters | Main action |
| --- | ---: | ---: | --- |
| `/` | 2577 | 127 | Connect teaser articles; fix reduced-motion H1; measure loading. |
| `/services` | 728 | 148 | Clarify search-intent title/H1 and link into expanded service details. |
| `/case-studies` | 503 | 141 | Verify claims and link to complete project evidence. |
| `/blog` | 53 | 131 | Restore CMS delivery and real published-post links. |
| `/testimonials` | 78 | 177 | Add accessible review text and attribution. |
| `/contact` | 65 | 92 | Verify business/contact information; maintain clear crawlable navigation. |
| `/privacy-policy` | 972 | 102 | Complete placeholders. |
| `/terms` | 1816 | 94 | Complete business and jurisdiction placeholders. |
| `/services/ico-token-launches` | 114 | 377 | Add unique deliverables, process and evidence; rewrite description. |
| `/services/memecoin-marketing` | 117 | 428 | Add unique deliverables, process and evidence; rewrite description. |
| `/services/ai-product-marketing` | 122 | 433 | Add unique deliverables, process and evidence; rewrite description. |
| `/services/nft-marketing` | 118 | 404 | Add unique deliverables, process and evidence; rewrite description. |
| `/services/community-growth` | 122 | 437 | Add unique deliverables, process and evidence; rewrite description. |
| `/services/x-marketing` | 136 | 487 | Add unique deliverables, process and evidence; rewrite description. |
| `/services/reddit-marketing` | 141 | 522 | Add unique deliverables, process and evidence; rewrite description. |
| `/case-studies/xera` | 58 | 218 | Replace generic metrics; write the campaign story and evidence. |
| `/case-studies/amalas` | 64 | 216 | Replace generic metrics; write the campaign story and evidence. |
| `/case-studies/avx` | 57 | 199 | Replace generic metrics; write the campaign story and evidence. |
| `/case-studies/pcp` | 62 | 205 | Replace generic metrics; write the campaign story and evidence. |

## Publication acceptance checklist

After restoring production CMS access, test a newly published post without relying on a fresh deployment:

1. Publish a complete article in the intended production CMS; confirm `_status` is published.
2. Its canonical HTTPS URL returns HTTP 200 to unauthenticated desktop and mobile requests.
3. Title, description, canonical, article heading and full article text are present in server HTML; no noindex is emitted.
4. The article appears on `/blog`, in the homepage teaser and in relevant internal links.
5. Its canonical URL appears in the sitemap, with an accurate last-modified timestamp.
6. The post's real author, publication/modification dates, image and structured data agree with visible content.
7. Simulate a CMS outage in an isolated environment: an existing post must not become a cached false 404 or silently disappear from the last successful sitemap.
8. Test edits, unpublishing, deletion and slug changes. A renamed published URL should redirect to the new canonical; removed/unpublished content should follow the chosen intentional removal behavior.
9. Verify a Google Search Console Domain property, submit the sitemap once, and use URL Inspection for representative pages. Compare the last crawl response, Google-selected canonical and rendered content with the intended page.
10. Track valid indexed pages and reasons for exclusion, published-vs-sitemap counts, CMS errors and performance over time. Avoid repeatedly submitting unchanged URLs.

Google's [technical requirements](https://developers.google.com/search/docs/essentials/technical) describe eligibility; its [recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) explains requests and timing. Sitemaps and indexing requests do not guarantee inclusion. The [Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api) is restricted to supported job/livestream pages and is not a general-purpose blog indexing shortcut.

## Work order

1. Restore CMS health and confirm one known published article.
2. Separate outages from genuine missing posts; preserve last-known-good content/sitemap.
3. Fix homepage article links and ensure complete post discovery/pagination/slug redirects.
4. Verify Search Console coverage and submit the working sitemap.
5. Expand service and case-study content with original, factual detail.
6. Fix heading visibility; measure and improve real performance.
7. Add accurate structured data, concise metadata, social images and completed business information.

No claim is made that every page will be indexed or achieve a specific ranking after these changes. The objective is to make every intended public page discoverable, reliable, useful and technically eligible, then use Search Console to diagnose Google's remaining decisions.
