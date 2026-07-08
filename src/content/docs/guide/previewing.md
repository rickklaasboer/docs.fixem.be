---
title: Previewing
description: Inspect exactly what a crawler receives with /preview/.
---

Prepend `/preview/` instead of `/` to see what fixem.be resolves for a URL,
rendered as a diagnostic page in your browser:

```
https://fixem.be/preview/<original-url>
```

Unlike the normal path, `/preview/` does **not** redirect a browser away. It
renders a report so you can debug an embed without pasting it into a chat app.

## What the report shows

- **Embed card** — the preview as a crawler would render it.
- **Metadata** — the structured fields fixem.be extracted (platform, kind,
  title, author, image/video).
- **Resolution status** — whether it was an `ok`, `degraded`, or `no-adapter`
  result, a cache hit or miss, and the degrade reason if any.
- **Crawler HTML** — the exact OpenGraph/Twitter-Card markup served to crawlers,
  shown escaped for inspection. The auto-refresh is disabled here so the page
  doesn't navigate away while you read it.

## Notes

- `/preview/` is rate-limited like a browser request, and never cached
  (`Cache-Control: no-store`). It's a debugging hatch, not a production surface.
- For machine-readable checks, use the API's
  [health endpoint](/api/health/) instead — it returns the same resolution
  outcome as single-line JSON.
