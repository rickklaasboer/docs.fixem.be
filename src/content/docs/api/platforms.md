---
title: Platforms
description: Discover supported platforms and their capabilities.
---

`GET /api/v1/platforms` lists the platforms the running instance supports, with a
capability flag set for each. Use it to drive UI or to check support without
hard-coding a list.

```bash
curl -H "Authorization: Bearer $FIXEM_API_KEY" \
  "https://fixem.be/api/v1/platforms"
```

```json
{
  "platforms": [
    {"name": "reddit",    "video": true,  "gallery": true,  "image": true, "needsCookie": false, "degradesTo": "image"},
    {"name": "instagram", "video": true,  "gallery": true,  "image": true, "needsCookie": true,  "degradesTo": "link"},
    {"name": "threads",   "video": false, "gallery": false, "image": true, "needsCookie": false, "degradesTo": "link"}
  ]
}
```

## Fields

| Field         | Meaning                                                        |
| ------------- | -------------------------------------------------------------- |
| `name`        | Platform identifier, matching the `platform` in resolve output.|
| `video`       | Whether video can be resolved.                                 |
| `gallery`     | Whether multi-image galleries are supported.                   |
| `image`       | Whether images are supported.                                  |
| `needsCookie` | Whether the operator must supply a session cookie for media.   |
| `degradesTo`  | The card `kind` used when media can't be resolved.             |

## What's actually listed

The response reflects what **this instance** has enabled. An adapter that needs
credentials the operator hasn't configured (for example Twitch without Twitch
API keys) is not registered, and won't appear here. The prose companion to this,
with per-platform notes, is [Supported platforms](/guide/platforms/).
