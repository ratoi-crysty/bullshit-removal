# Hybrid Rule sync: bundle plus hash-prefix lookup

The extension syncs a versioned bundle of Published Rules (ETag-cached in `chrome.storage.local`) covering the most-visited Sites, and for Sites outside the bundle performs an on-demand lookup that is cached with a TTL, including negative ("no Rule") results. Lookups send only a short hash prefix of the hostname; the API returns every Rule whose Site hash shares that prefix and the extension matches locally, so the server does not learn Members' browsing history. Pure per-Site lookup leaked every hostname and delayed every page load; a pure full bundle grows without bound.

## Consequences

- A Site outside the bundle can show its Obstruction on the first visit while the lookup is in flight; after that it is served from cache.
- Matching logic lives in the shared executor lib and runs client-side; the API never decides which Rule applies to a page.
- Which Sites make the bundle is a server-side policy (e.g. by Breakage Report or lookup volume) and can change without an extension release.
