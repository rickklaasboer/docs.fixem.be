# docs.fixem.be

Documentation site for [fixem.be](https://fixem.be), built with
[Astro](https://astro.build) + [Starlight](https://starlight.astro.build). The
API reference is generated from the fixem.be OpenAPI contract, so it never
drifts from the real API.

Live at **https://docs.fixem.be**.

## Prerequisites

- [Bun](https://bun.sh) — package manager (the lockfile is `bun.lock`)
- [Node.js](https://nodejs.org) — Astro's runtime; the OpenAPI sync script runs under it
- An OpenAPI contract source (see [API reference](#api-reference-openapi)) —
  either the backend checked out at `../fixem.be`, or `OPENAPI_URL` set.

## Getting started

```sh
bun install
bun run dev
```

The dev server runs at **http://localhost:4321**. `dev` (like `build`) first runs
`scripts/sync-openapi.mjs` to pull the current API contract, then starts Astro.

## API reference (OpenAPI)

The pages under `/api-reference` are generated at build time by
[`starlight-openapi`](https://github.com/HiDeoo/starlight-openapi) from
`src/openapi.yaml`.

That file is **generated and gitignored — never hand-edit it.**
`scripts/sync-openapi.mjs` writes it from, in order of precedence:

1. `$OPENAPI_URL` — fetched over HTTP (CI / against the deployed API, e.g.
   `https://fixem.be/openapi.yaml`)
2. `../fixem.be/openapi.yaml` — the sibling backend repo (local, works offline)

It fails loudly if neither is available. Re-sync on demand with
`bun run sync-openapi`.

## Authoring content

Pages live in `src/content/docs/` as Markdown/MDX; each file maps to a route by
its path. Current groups:

- `getting-started/` — introduction, quick start
- `guide/` — using fixem.be (fixing embeds, previewing, platforms, self-hosting)
- `api/` — hand-written API concept pages (authentication, rate limiting, errors, …)

The generated OpenAPI reference is injected as its own sidebar group. Sidebar
order and grouping are configured in `astro.config.mjs`.

## Commands

| Command | Action |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Sync the OpenAPI contract, then start the dev server at `localhost:4321` |
| `bun run build` | Sync the OpenAPI contract, then build the static site to `dist/` |
| `bun run preview` | Preview the production build locally |
| `bun run sync-openapi` | Re-sync `src/openapi.yaml` from the contract source |
| `bun run astro ...` | Run Astro CLI commands (`astro add`, `astro check`, …) |

## Deployment

The site is fully static and ships as a Docker image — a two-stage build renders
it with Bun, then nginx serves the output.

Local build:

```sh
docker compose up --build          # serves on http://127.0.0.1:8081
```

Production runs the prebuilt image from GHCR:

```sh
docker compose -f compose.prod.yaml pull
docker compose -f compose.prod.yaml up -d
```

- Image: `ghcr.io/rickklaasboer/docs.fixem.be` (pin a release with `DOCS_TAG=…`).
- Binds to `127.0.0.1:8081` only — put a reverse proxy in front to terminate TLS.
- GitHub Actions builds and pushes to GHCR on push to `main` and on tags, plus on
  a `contract-updated` dispatch so a backend OpenAPI change rebuilds the docs.
- nginx serves `/healthz` for the container healthcheck and uptime monitoring.

## Project structure

```
src/
  content/docs/       # documentation pages (Markdown/MDX)
  assets/             # images referenced from docs
  openapi.yaml        # generated — synced from the backend, gitignored
  content.config.ts
scripts/
  sync-openapi.mjs    # pulls the OpenAPI contract into src/openapi.yaml
astro.config.mjs      # Starlight config: title, sidebar, OpenAPI plugin
Dockerfile            # two-stage build (Bun → nginx)
nginx.conf
compose.yaml          # local build
compose.prod.yaml     # prebuilt GHCR image
```
