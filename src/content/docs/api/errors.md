---
title: Errors
description: When you get an HTTP error instead of a status field.
---

fixem.be reserves HTTP error codes for the request being wrong — not for a post
that couldn't be resolved. A resolvable URL always returns `200` and you branch
on its `status` field (see [Overview](/api/overview/)).

## Status codes

| Status | When                                                                 |
| ------ | -------------------------------------------------------------------- |
| `200`  | Resolvable request. Branch on the `status` field in the body.        |
| `400`  | Malformed request — missing/invalid `url`, bad JSON, oversized batch.|
| `401`  | Missing or invalid bearer token.                                     |
| `404`  | The `/api/v1` namespace is closed (no keys configured on the server).|
| `429`  | Rate limit exceeded — see the `Retry-After` header.                  |

No well-formed request returns a `5xx`. A `404` on `/api/v1` doesn't mean your
URL was wrong — it means the API is switched off on that instance.

## Error body

Non-`200` responses carry a short JSON reason:

```json
{ "error": "missing or malformed url" }
```

## Not to be confused with `status`

Inside a `200`, a `degraded` or `no-adapter` `status` is a normal outcome, not an
error — the post simply couldn't be fully resolved, or no adapter matched. Handle
those by reading `status`, and reserve your HTTP-error handling for the codes
above.
