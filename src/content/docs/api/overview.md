---
title: Overview
description: Base URL, versioning, and the response contract.
---

The API turns a social-media URL into the same structured metadata that powers
the embed cards — as JSON, single or batched, plus canonicalization, platform
discovery, and health.

## Base URL and versioning

```
https://fixem.be/api/v1
```

The version is in the path. Breaking changes ship under a new prefix (`/api/v2`);
`/api/v1` stays stable.

Every `/api/v1` request needs a bearer token — see
[Authentication](/api/authentication/). The public
[`GET /openapi.yaml`](https://fixem.be/openapi.yaml) and `GET /oembed` are the
exceptions and need no key.

## The response contract

Every resolvable request returns **`200` with a `status` field**. You branch on
`status`, never on an HTTP error, because a well-formed URL never returns a
`5xx`:

- `ok` — resolved. The metadata fields are present.
- `degraded` — the post was reachable but couldn't be fully resolved (login
  wall, upstream failure, breaker open). You get a `kind: "link"` card and a
  `reason`.
- `no-adapter` — no platform adapter matched the URL's host.

```json
{ "status": "ok", "platform": "reddit", "kind": "image", "title": "…", "…": "…" }
{ "status": "degraded", "platform": "threads", "reason": "blocked", "kind": "link" }
{ "status": "no-adapter", "platform": "none" }
```

HTTP status codes are reserved for the request being wrong (`400`), unauthorized
(`401`), the namespace being closed (`404`), or throttled (`429`). See
[Errors](/api/errors/).

## Endpoints

| Method | Path                 | Purpose                                   |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/api/v1/resolve`    | Resolve one URL to metadata               |
| POST   | `/api/v1/resolve`    | Resolve a batch of URLs                   |
| GET    | `/api/v1/canonical`  | Canonical URL + platform, no fetch        |
| GET    | `/api/v1/platforms`  | Supported platforms + capability flags    |
| GET    | `/api/v1/health`     | Adapter health, or liveness               |

The full schema for each is in the [API reference](/api-reference/), generated
from the OpenAPI document.
