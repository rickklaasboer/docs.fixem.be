# syntax=docker/dockerfile:1

# ---- Build stage: render the static site with Bun (mirrors ../fixem.be) ------
FROM oven/bun:1 AS build
WORKDIR /app

# Install against the committed lockfile for reproducible builds. Everything the
# build needs lives under "dependencies", so no --production pruning here.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# src/openapi.yaml is gitignored and never committed (see scripts/sync-openapi.mjs);
# the contract is fetched at build time. Defaults to the live API — override with
#   --build-arg OPENAPI_URL=...
ARG OPENAPI_URL=https://fixem.be/openapi.yaml
ENV OPENAPI_URL=${OPENAPI_URL}

COPY . .
# sync-openapi.mjs is plain ESM (only node: builtins), so Bun runs it directly —
# the oven/bun image ships no Node binary, so we bypass the npm "build" script.
RUN bun scripts/sync-openapi.mjs && bun run astro build

# ---- Runtime stage: serve the static output with nginx -----------------------
FROM nginx:1.31.9-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
