---
title: Supported platforms
description: Which platforms are supported, what each yields, and where they degrade.
---

fixem.be picks an adapter by the URL's host. Each adapter turns a post into the
same metadata shape, so a Reddit gallery and a TikTok video come out looking the
same to a crawler or an API client.

The live list, with capability flags, is always available from the API at
[`GET /api/v1/platforms`](/api/platforms/). The table below is the current set.

| Platform  | Video | Gallery | Image | Needs cookie | Degrades to |
| --------- | :---: | :-----: | :---: | :----------: | ----------- |
| Reddit    |  yes  |   yes   |  yes  |      no      | image       |
| Bluesky   |  yes  |   yes   |  yes  |      no      | link        |
| X/Twitter |  yes  |   yes   |  yes  |      no      | link        |
| Twitch    |  yes  |   no    |  yes  |      no      | link        |
| Threads   |  no   |   no    |  yes  |      no      | link        |
| TikTok    |  yes  |   yes   |  yes  |      no      | link        |
| Instagram |  yes  |   yes   |  yes  |     yes      | link        |

- **Needs cookie** means the operator must supply a session cookie for the media
  path to work (see per-platform notes). It is not a per-request setting.
- **Degrades to** is the card kind fixem.be falls back to when it can reach the
  post but can't get the media.

## Per-platform notes

These are the realities of each source, not aspirations:

- **Reddit** — Images, galleries, and text resolve from the public web HTML.
  Video degrades to a poster image unless the operator has configured Reddit
  OAuth credentials, which unlock the full-video path.
- **Bluesky** — Images, video, and quote posts resolve from the public API. No
  credentials needed.
- **X/Twitter** — Photos and video resolve via the syndication endpoint.
  Deleted or protected posts degrade to a link card.
- **Twitch** — Clips resolve to a direct, playable MP4 (no proxy needed).
  Requires the operator to configure Twitch credentials; without them the
  adapter is disabled and won't appear in `/platforms`.
- **Threads** — Frequently bot-challenged from a datacenter IP, so it usually
  degrades to an informative link card. When it resolves, images work; video
  does not.
- **TikTok** — Video and photo posts resolve from the web page. Playback URLs
  are IP/cookie-locked, so video is streamed through the signed `/v/` proxy.
- **Instagram** — Login-walled from datacenter and residential IPs alike. Works
  only when the operator supplies a burner session cookie; otherwise it degrades
  to a link card.

If a host has no adapter, the API returns `{"status": "no-adapter"}` and the
embed path simply redirects a browser to the URL unchanged.
