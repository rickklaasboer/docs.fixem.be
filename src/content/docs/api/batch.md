---
title: Batch
description: Resolve many URLs in one request.
---

`POST /api/v1/resolve` resolves a list of URLs in a single request. Results come
back in the same order you sent them, and one bad URL never fails the batch.

```bash
curl -X POST "https://fixem.be/api/v1/resolve" \
  -H "Authorization: Bearer $FIXEM_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://x.com/nasa/status/123",
      "https://www.tiktok.com/@nasa/video/456"
    ],
    "media": "proxied"
  }'
```

## Request body

| Field   | Required | Description                                              |
| ------- | -------- | -------------------------------------------------------- |
| `urls`  | yes      | Non-empty array of URLs. Bounded by `BATCH_MAX_URLS`.    |
| `media` | no       | `proxied` applies to every item, same as the GET.        |

An empty list, a non-array `urls`, or a list longer than `BATCH_MAX_URLS`
(default 20) returns `400` for the whole request.

## Response

```json
{
  "results": [
    { "url": "https://x.com/nasa/status/123", "status": "ok", "platform": "twitter", "kind": "image", "…": "…" },
    { "url": "https://bad", "status": "error", "error": "malformed url" },
    { "url": "https://unknown.dev/x", "status": "no-adapter", "platform": "none" }
  ]
}
```

Each item is the same shape as a single [resolve](/api/resolving/) result, with
the input `url` echoed back so you can match results to requests regardless of
ordering assumptions. A malformed URL becomes a per-item
`{"status": "error", "error": "malformed url"}` — it doesn't abort the others.

## Cost

The batch is **one** request against your [rate limit](/api/rate-limiting/), but
each URL runs the full resolve pipeline (cache, dedup, breaker, timeout) on its
own. Keep batches within `BATCH_MAX_URLS`.
