---
title: Introduction
description: What fixem.be is and how it decides what to serve.
---

When you share a social-media link, the app you paste it into (Discord, Telegram,
Slack) sends a crawler to fetch the page and build a preview card. Most social
platforms don't return usable preview tags to those crawlers, so the card comes
back broken, empty, or login-walled.

fixem.be sits in front of the link. You prepend `https://fixem.be/` to the URL,
and the service fetches the real post itself, extracts the metadata, and returns
whatever the caller actually needs.

## The crawler-vs-browser split

fixem.be branches on the `User-Agent` of whoever follows the wrapped link:

- **Known crawlers** (Discordbot, Telegram, Slack, and friends) get a small HTML
  document containing OpenGraph and Twitter-Card tags — title, description,
  image, and where possible an inline video. That's the preview card.
- **Everyone else** — a real browser — gets a `302` redirect straight to the
  original URL. A human never lands on fixem.be; they go where the link points.

A well-formed wrapped URL never returns a `5xx`. If a post can't be resolved, the
crawler still gets an honest card (a link card, or a thumbnail) rather than an
error, and the browser is still redirected.

## The metadata behind the card

The card is built from a single piece of structured metadata per post: `kind`
(`video`, `image`, `gallery`, or `link`), `title`, `description`, `author`,
`siteName`, an optional `image`, and an optional `video`. The
[API](/api/overview/) exposes exactly that structure as JSON, so anything the
embed card can show, an API client can read.

## Media that needs a proxy

Some platforms serve video from a CDN that only accepts requests carrying
specific headers or cookies — headers a chat client won't send. For those,
fixem.be signs a short-lived proxy URL (`/v/…`) that streams the media with the
right headers attached. The raw CDN URL and the secret headers never leave the
server. See [Resolving URLs](/api/resolving/) for how this surfaces in the API.
