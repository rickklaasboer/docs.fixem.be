---
title: Rate limiting
description: Per-key limits and the headers that report them.
---

`/api/v1/*` requests are rate-limited **per API key**, not per IP. Your quota
isn't shared with everyone behind the same NAT, and it can't be diluted by IP
spoofing.

## Headers

Every `/api/v1` response carries your current budget:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
```

- `X-RateLimit-Limit` — requests allowed per minute (the operator's
  `API_RATE_LIMIT_PER_MIN`, default 60).
- `X-RateLimit-Remaining` — how many you have left in the current window.

## When you're over

Past the limit, the request returns `429` with a `Retry-After`:

```
HTTP/1.1 429 Too Many Requests
Retry-After: 60

{ "error": "rate limited" }
```

Wait the number of seconds in `Retry-After`, then retry.

## Notes

- The window is a rolling minute.
- The limiter **fails open**: if the backing store is briefly unavailable,
  requests are allowed rather than blocked. Don't rely on it as a hard quota.
- The batch endpoint counts as **one** request against your limit regardless of
  how many URLs it carries — but each URL still runs the full resolve pipeline,
  so keep batches reasonable. The per-batch cap is `BATCH_MAX_URLS` (default 20);
  see [Batch](/api/batch/).
