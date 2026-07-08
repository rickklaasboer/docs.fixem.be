---
title: Authentication
description: Bearer tokens on every /api/v1 request.
---

Every `/api/v1/*` request is authenticated with a bearer token:

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/resolve?url=https://x.com/nasa/status/1234567890"
```

## Getting a key

Keys are issued by the operator. On a self-hosted instance, they're the
comma-separated values of the `API_KEYS` environment variable — generate each
with `openssl rand -hex 32`. Self-serve key issuance and a dashboard are not part
of v1.

## How it's checked

- The token is compared against the configured key set in constant time. A match
  on any configured key passes.
- A **missing or wrong** token returns `401`.
- If the operator has configured **no keys at all**, the entire `/api/v1/*`
  namespace returns `404` — closed by default, never reachable unauthenticated.
  A `404` here means the API is switched off, not that your URL was wrong.

## What stays public

Two things are intentionally unauthenticated:

- `GET /oembed` — chat clients fetch it while building a card and can't send a
  key. It stays public and rate-limited at its own path.
- `GET /openapi.yaml` — the contract itself, so tooling and this documentation
  can consume it.

Rate limits attach to your key, not your IP — see [Rate limiting](/api/rate-limiting/).
