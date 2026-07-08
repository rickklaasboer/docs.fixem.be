---
title: Resolving URLs
description: The core endpoint — turn one URL into metadata.
---

`GET /api/v1/resolve` is the core of the API. Give it a wrapped social URL, get
back structured metadata.

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/resolve?url=https://www.tiktok.com/@nasa/video/123"
```

## Parameters

| Parameter | Required | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| `url`     | yes      | The social-media URL to resolve.                       |
| `media`   | no       | Set to `proxied` to include a playable proxied URL.    |

A missing or malformed `url` returns `400`.

## The `ok` response

```json
{
  "status": "ok",
  "platform": "tiktok",
  "canonicalUrl": "https://www.tiktok.com/@nasa/video/123",
  "cacheHit": true,
  "kind": "video",
  "title": "…",
  "description": "…",
  "author": {"name": "NASA", "url": "https://www.tiktok.com/@nasa"},
  "siteName": "TikTok",
  "nsfw": false,
  "image": {"url": "https://…/cover.jpg", "width": 720, "height": 1280},
  "video": {
    "url": "https://…cdn…/play.mp4",
    "width": 720,
    "height": 1280,
    "mimeType": "video/mp4",
    "needsProxy": true
  }
}
```

`kind` is one of `video`, `image`, `gallery`, or `link`. `cacheHit` tells you
whether the result came from cache.

## Media: raw versus proxied

By default, `video.url` is the **raw upstream URL**, and `needsProxy` tells you
whether that URL will actually play for an arbitrary client:

- `needsProxy: false` — the URL is public and plays anywhere.
- `needsProxy: true` — the CDN requires headers or cookies a normal client won't
  send, so the raw URL will fail to play on its own.

When `needsProxy` is `true` and you want something playable, add `media=proxied`:

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/resolve?media=proxied&url=https://www.tiktok.com/@nasa/video/123"
```

fixem.be then adds a signed, playable proxy URL alongside the raw one:

```json
"video": {
  "url": "https://…cdn…/play.mp4",
  "mimeType": "video/mp4",
  "needsProxy": true,
  "playableUrl": "https://fixem.be/v/eyJ…"
}
```

- `url` is still the raw upstream URL, in both modes.
- `playableUrl` is a short-lived signed `/v/` URL that streams the media with the
  right headers attached. Play this one.

`playableUrl` is only added when the proxy is enabled on the instance and the
media host is https and allowlisted. If it can't be produced, the field is simply
omitted — you'll never get a `playableUrl` that returns a 403.

## Security: secret headers never leak

Some CDNs require credentials to serve media — a session cookie, a signed token.
fixem.be holds those internally and **never** serializes them. The response tells
you only the boolean `needsProxy`; the actual headers are sealed inside the
signed `/v/` token and never appear in any API response.

## Other outcomes

```json
{ "status": "degraded", "platform": "threads", "canonicalUrl": "…", "reason": "blocked", "kind": "link" }
{ "status": "no-adapter", "platform": "none" }
```

Both are `200`. See the [overview](/api/overview/) for the contract and
[Errors](/api/errors/) for the non-`200` cases.
