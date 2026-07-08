---
title: Quick start
description: Fix an embed in a chat app, then make your first API call.
---

## Fix an embed

Take any supported social-media URL:

```
https://x.com/nasa/status/1234567890
```

Prepend `https://fixem.be/`:

```
https://fixem.be/https://x.com/nasa/status/1234567890
```

Paste that into Discord (or Telegram, or Slack). The message unfurls with the
post's image or video instead of a broken card. Nothing to install.

To see exactly what a crawler receives — the resolved metadata, the card, and the
raw HTML — put `/preview/` in front instead:

```
https://fixem.be/preview/https://x.com/nasa/status/1234567890
```

That's covered in [Previewing](/guide/previewing/).

## Make an API call

The API lives at `https://fixem.be/api/v1` and needs a bearer token. Ask the
operator for an API key, then resolve a URL:

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/resolve?url=https://x.com/nasa/status/1234567890"
```

You get back JSON with a `status` field to branch on:

```json
{
  "status": "ok",
  "platform": "twitter",
  "canonicalUrl": "https://x.com/nasa/status/1234567890",
  "cacheHit": false,
  "kind": "image",
  "title": "…",
  "siteName": "X",
  "image": {"url": "https://…/photo.jpg", "width": 1200, "height": 675}
}
```

A well-formed URL always returns `200` — you branch on `status`
(`ok` / `degraded` / `no-adapter`), never on a `5xx`. Read the
[API overview](/api/overview/) next for the full contract, or jump to
[Authentication](/api/authentication/).
