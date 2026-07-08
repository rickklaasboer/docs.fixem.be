---
title: Running your own instance
description: Point to the source and the operator configuration.
---

fixem.be is open source and self-hostable. It's a single Bun + Hono service with
Redis (or Valkey) for caching and rate limiting, and it runs behind a reverse
proxy.

The source, install steps, Docker Compose files, and the full list of
environment variables live in the repository:

**[github.com/rickklaasboer/fixem.be](https://github.com/rickklaasboer/fixem.be)**

A few things worth knowing before you run one:

- **Config is all environment variables.** Copy `.env.example` to `.env` and fill
  in what you need. Everything has a sane default; secrets stay out of source.
- **Platform credentials are optional but expand coverage.** Twitch clips need
  Twitch credentials; Instagram needs a burner session cookie; Reddit video needs
  Reddit OAuth. Without them, those platforms degrade rather than fail.
- **The video proxy is opt-in.** Set `PROXY_SECRET` to enable the signed `/v/`
  media proxy for platforms whose CDN needs forwarded headers. Serve `/v/` from a
  DNS-only record — never through a CDN's media-proxying tier.
- **The reverse proxy must forward the real client IP** (`CF-Connecting-IP` or
  `X-Forwarded-For`), or rate limiting collapses to a single bucket.

The API's `API_KEYS`, `API_RATE_LIMIT_PER_MIN`, and `BATCH_MAX_URLS` settings are
documented under [Authentication](/api/authentication/) and
[Rate limiting](/api/rate-limiting/).
