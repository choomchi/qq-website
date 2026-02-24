# QQ Website — Agent Instructions

> Purpose: This document gives AI agents and developers enough context to safely work on this codebase.
> Read this file before making changes.

## 1) Project Snapshot

- **Project name:** `nashre-qoqnoos`
- **Framework:** Next.js App Router
- **Language:** TypeScript (strict mode)
- **UI direction/language:** Persian (RTL), `lang="fa"`
- **Deployment base path:** `/mysecretpreview`
- **Primary data source:** GraphQL upstream (through Next.js API proxy)
- **Secondary data source:** Elasticsearch (search API route)

---

## 2) Technology Stack

### Core
- Next.js `16.1.6`
- React `19.2.3`
- TypeScript `^5` (`strict: true`)

### Styling/UI
- Tailwind CSS `v4`
- `tw-animate-css`
- shadcn setup (`components.json`)
- `lucide-react` icons
- `class-variance-authority`, `clsx`, `tailwind-merge`
- Local font via `next/font/local` (Farhang family)

### Data Layer
- `@tanstack/react-query` (providers + optional hooks in `services/*/queries.ts`)
- Domain service modules for GraphQL requests

### Linting/Tooling
- ESLint v9 with `eslint-config-next` (core-web-vitals + typescript)
- PostCSS with `@tailwindcss/postcss`

---

## 3) High-Level Architecture

```text
UI Components (RSC + Client Components)
  -> Domain Services (services/*/*-api.ts)
    -> Local API endpoint (/api/graphql via catch-all route)
      -> Upstream API_BASE_URL (GraphQL backend)

Header Search Input (client)
  -> /api/search
    -> Elasticsearch (ELASTIC_BASE_URL)
```

### Rendering strategy
- **Server Components first** for page/section data fetch.
- **Client Components** only when needed for interactivity (carousels, search dropdown, slider controls).
- Suspense fallbacks used in homepage composition.

---

## 4) Directory Architecture

```text
app/
  (shop)/page.tsx                 # Main homepage composition
  api/
    [...path]/route.ts            # Catch-all proxy to API_BASE_URL
    search/route.ts               # Elasticsearch search endpoint
  globals.css                     # Tailwind imports + design tokens
  layout.tsx                      # Root layout, font, Header/Footer shell
  providers.tsx                   # React Query provider

components/
  layout/
    header/                       # Logo, search bar, actions
    footer/
  features/
    home-slider/
    nav-bar/
    category-links/
    category-section/
    product-card/
    series-carousel/
    persons-carousel/
    ebook-platforms/
  ui/
    button.tsx                    # shadcn-style UI primitive

services/
  categories/
  home-sliders/
  persons/
  series/
  query-keys.ts

types/
  graphql.ts
  home-slider.ts
  category.ts
  product.ts
  person.ts
  series.ts

lib/
  utils.ts                        # cn() helper

public/
  qoqnoos-logo.png
  carousel-card-bg.svg
  ...
```

---

## 5) Route Map

### UI Routes
- `/(shop)` page is the main storefront homepage.

### API Routes
- `GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS /api/[...path]`
  - Proxies to `API_BASE_URL`
  - Path segments are ignored intentionally; query string is preserved.
- `GET /api/search?q=...`
  - Queries Elasticsearch index `qoqnoosir-post-1`
  - Returns normalized search hits.

---

## 6) API Proxy & Backend Integration

## 6.1 Catch-all proxy behavior (`app/api/[...path]/route.ts`)

- Runtime: `nodejs`
- Dynamic mode: `force-dynamic`
- Timeout: `15_000ms`
- Forwards most headers except hop-by-hop and `host`
- Adds forwarded headers: `x-forwarded-host`, `x-forwarded-proto`
- JWT forwarding logic:
  - Checks `Authorization: Bearer ...`
  - Fallback cookies: `jwt`, `token`, `auth_token`
  - Forwards bearer token if not already set
- Error handling:
  - Missing `API_BASE_URL` => JSON 500
  - Timeout => JSON 504
  - Upstream unreachable => JSON 502
  - Non-JSON upstream error => wrapped JSON error payload

## 6.2 Service-layer GraphQL pattern (`services/*/*-api.ts`)

Each domain service generally follows this shape:
1. GraphQL query string constant
2. `getProxyEndpoint()`
   - Client-side: returns `/api/graphql`
   - Server-side: builds absolute URL from:
     - `NEXT_PUBLIC_APP_URL` or `APP_URL`
     - `NEXT_PUBLIC_BASE_PATH` (fallback `/mysecretpreview`)
3. Generic `graphqlRequest<TData, TVariables>()`
4. Exported API object with typed methods

### Domain service modules
- `home-sliders-api.ts`
- `categories-api.ts`
- `persons-api.ts`
- `series-api.ts`

### Notes
- Most service fetches use `cache: "no-store"`.
- Errors are normalized with `ApiClientError` (`types/graphql.ts`).

## 6.3 Search API (`app/api/search/route.ts`)

- Upstream base: `ELASTIC_BASE_URL` (default `http://localhost:9201`)
- Rejects short queries (`q.length < 2`) with empty hits.
- Returns simplified hit objects:
  - `id`, `title`, `slug`, `thumbnail`, `writer`

---

## 7) Base Path & Asset Rules (Critical)

Project uses `basePath: '/mysecretpreview'` in `next.config.ts`.

### Rules for agents
1. **Do not remove or bypass basePath assumptions.**
2. For server-side service calls, ensure URL includes basePath when constructing absolute URLs.
3. For public assets, avoid hardcoding root paths that break with basePath.
4. When using `next/image` with local string paths, verify they resolve correctly under basePath.
5. If creating helper utilities for URLs, make them basePath-aware.

---

## 8) Component Architecture

## 8.1 App shell
- `app/layout.tsx` wraps everything with:
  - local Farhang font variable
  - `Providers` (`QueryClientProvider`)
  - global `Header` and `Footer`

## 8.2 Homepage composition (`app/(shop)/page.tsx`)
Section order:
1. HeroSlider
2. NavBar
3. CategoryLinks
4. First 4 CategorySection blocks
5. SeriesCarousel
6. EbookPlatforms
7. PersonsCarousel
8. Remaining CategorySection blocks

## 8.3 Pattern used in features
- Server component fetches domain data.
- Passes plain typed props to a client track/UI component when interaction needed.
- Example: `series-carousel.tsx` (server) -> `series-carousel-track.tsx` (client).

## 8.4 Carousels and cards
- Native horizontal scrolling with `scrollBy` and custom prev/next controls.
- Shared card visual style in series/person carousels uses `public/carousel-card-bg.svg`.

---

## 9) Styling, Theme, and RTL Standards

- Global tokens in `app/globals.css` (`--primary-red`, `--dark-gray`, etc.).
- `--font-farhang` is mapped to Tailwind `font-sans`.
- Most components explicitly set `dir="rtl"` at section/container level.
- Use semantic token classes where possible (`bg-dark-gray`, `text-muted-foreground`, etc.).
- Keep visual consistency with existing spacing scale and rounded corners.

### Responsive Design Requirement (Mandatory)
- **Every new UI element must be responsive.**
- All newly created or updated UI should work correctly on **mobile, tablet, and desktop**.
- Avoid fixed dimensions that cause overflow/cropping on small screens unless a strict design requirement exists.
- Validate responsive behavior before finalizing UI changes.

---

## 10) TypeScript and Code Standards

1. Prefer explicit types for props and service responses.
2. Reuse domain types from `types/`.
3. Keep imports using alias style: `@/...`.
4. Keep components functional and small.
5. Use `"use client"` only where required.
6. Return `null` for empty data sections instead of rendering empty wrappers.
7. Preserve current architecture (service -> proxy -> upstream).
8. Avoid introducing direct backend calls from components that bypass service modules.

---

## 11) React Query Standards

- Query client configured in `app/providers.tsx`:
  - `staleTime: 60_000`
  - `retry: 1`
  - `refetchOnWindowFocus: false`
- `services/query-keys.ts` is the source of truth for cache keys.
- Domain hooks in `services/*/queries.ts` and invalidation hooks in `services/*/mutations.ts`.

---

## 12) Environment Variables

### Required for proxy
- `API_BASE_URL` — full upstream API endpoint used by catch-all proxy.

### Required/expected for server-side service requests
- `NEXT_PUBLIC_APP_URL` or `APP_URL`
- `NEXT_PUBLIC_BASE_PATH` (defaults to `/mysecretpreview` if missing)

### Optional (search)
- `ELASTIC_BASE_URL` (defaults to `http://localhost:9201`)

---

## 13) Known Gotchas / Review Checklist

Before opening a PR or finalizing agent output, verify:
- [ ] Base path compatibility for links, API calls, and images
- [ ] No direct backend calls bypassing `/api` proxy conventions
- [ ] Types updated when GraphQL fields change
- [ ] RTL behavior preserved
- [ ] New/updated UI is responsive on mobile, tablet, and desktop (no unintended horizontal overflow)
- [ ] No accidental regressions in homepage section composition
- [ ] `npm run lint` passes (when available)

---

## 14) Agent Workflow (Recommended)

1. Read this file first.
2. Locate target feature directory under `components/features/*`.
3. If data-related, update `services/*` + `types/*` together.
4. Respect server/client boundaries.
5. Keep changes scoped and minimal.
6. Add or update loading/skeleton state only when needed.
7. **If anything was modified/added/deleted, update this file wherever it became outdated** (architecture, routes, directories, components, APIs, standards, env vars, etc.).
8. Confirm that all new UI is responsive across mobile/tablet/desktop breakpoints.
9. Append an operation log entry in **`instructions-log.md`** **every time**.

---

## 15) MANDATORY DOCUMENT MAINTENANCE + OPERATION LOG

### 15.1 Keep this file accurate (Required)

`instructions.md` is a **living source of truth**.

After each change or operation, agents must:
1. Review whether recent code changes made any part of this document stale.
2. Update all affected sections (not just the log), including when items were **modified, added, or deleted**.
3. Remove or rewrite outdated statements so future agents are not misled.

### 15.2 Operation log (Append-only)

- After updating affected sections, append the operation log entry in **root-level `instructions-log.md` only**.
- Do **not** add operation log entries inside `instructions.md`.
- Keep the log append-only (never rewrite or delete previous entries).
- Use the entry template defined in `instructions-log.md`.
