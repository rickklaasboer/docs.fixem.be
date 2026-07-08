---
title: Health
description: Liveness, and end-to-end adapter checks.
---

`GET /api/v1/health` does double duty depending on whether you pass a `url`.

## Liveness — no `url`

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/health"
```

```json
{ "ok": true, "redis": true }
```

`ok` confirms the service is up; `redis` reports cache-store reachability. Note
the service runs fine with `redis: false` — the cache fails open — so treat
`redis: false` as degraded caching, not an outage.

For an unauthenticated liveness check, the public `GET /healthz` returns the same
`{ok, redis}` shape without a key.

## Adapter check — with `url`

Pass a `url` and health runs a real resolve, returning a compact,
JSONPath-friendly outcome. This is what an uptime monitor asserts on:

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/health?url=https://www.tiktok.com/@nasa/video/123"
```

```json
{
  "platform": "tiktok",
  "status": "ok",
  "kind": "video",
  "hasMedia": true,
  "cacheHit": false,
  "canonicalUrl": "https://www.tiktok.com/@nasa/video/123",
  "title": "…"
}
```

- `hasMedia` is the key signal: `true` when the adapter produced a real image or
  video. If a platform changes and the embed degrades to a bare link, `hasMedia`
  flips to `false`.
- A `no-adapter` or `degraded` outcome returns the matching shape with
  `hasMedia: false`.

A malformed `url` returns `400`.
