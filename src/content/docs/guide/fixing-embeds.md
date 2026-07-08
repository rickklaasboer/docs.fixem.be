---
title: Fixing embeds
description: The prepend pattern, and what each request returns.
---

To fix a link preview, prepend `https://fixem.be/` to the original URL:

```
https://fixem.be/<original-url>
```

The original URL goes in verbatim, including its `https://`. fixem.be parses
everything after the first slash as the target.

## What comes back

fixem.be looks at the `User-Agent` of the client following the link:

- A **known crawler** (Discord, Telegram, Slack, …) receives an HTML document of
  OpenGraph and Twitter-Card tags. That's the unfurled card: title, description,
  image, and — where the platform allows it — an inline, playable video.
- A **browser** receives a `302` redirect to the original post. Humans are never
  shown a fixem.be page.

The wrapped URL is canonicalized first (tracking parameters stripped, host
normalized), so the redirect lands on the clean version of the post.

## Query parameters are preserved

Anything the target URL needs is kept. fixem.be only strips its own reserved
parameters before redirecting, so the original post never sees fixem.be-specific
query junk.

## When a post can't be resolved

Resolution can fail — a post is deleted, a platform is login-walled from the
server's network, or an upstream is briefly down. fixem.be never returns an error
card. Instead it degrades:

- To a **thumbnail or link card** with whatever it could extract, or
- To an **informative link card** naming the platform, when nothing else is
  available.

The browser is still redirected to the original either way. See
[Supported platforms](/guide/platforms/) for what each platform yields and where
it degrades.
