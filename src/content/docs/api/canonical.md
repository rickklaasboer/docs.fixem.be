---
title: Canonical
description: Normalize a URL and detect its platform, without fetching the post.
---

`GET /api/v1/canonical` normalizes a URL and tells you which platform it belongs
to — **without** fetching the post. No upstream request, no circuit breaker,
cheap to call.

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/canonical?url=https://x.com/nasa/status/123?utm_source=share"
```

```json
{
  "platform": "twitter",
  "canonicalUrl": "https://x.com/nasa/status/123"
}
```

Canonicalization strips tracking parameters and normalizes the host, so you get
the clean, stable form of the URL.

## When no adapter matches

```json
{ "platform": "none" }
```

## Use it for

- De-duplicating or grouping links before you resolve them.
- Cheaply checking whether a URL is supported at all.
- Getting a clean canonical URL without paying for a full resolve.

A missing or malformed `url` returns `400`.
