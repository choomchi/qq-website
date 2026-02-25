# Instructions Operation Log

This is the append-only operation log referenced by `instructions.md`.

## Rules

- Add new entries at the end of the file.
- Do not edit or delete previous entries unless explicitly requested by the project owner.
- After each operation, first update stale sections in `instructions.md` (if needed), then append a log entry here.

## Entry template

```md
### YYYY-MM-DD HH:mm (local)

- Agent: <name>
- Operation type: <analysis | code change | refactor | bugfix | docs>
- Summary: <what was done>
- Files changed: <comma-separated list>
- Validation: <lint/build/manual/none>
- Notes/Risks: <optional>
```

### 2026-02-24 15:03 (local)

- Agent: Cascade
- Operation type: docs
- Summary: Created `instructions.md` with architecture, stack, standards, API proxy details, and agent workflow guidance.
- Files changed: `instructions.md`
- Validation: none
- Notes/Risks: Keep this file updated after every operation.

### 2026-02-24 15:09 (local)

- Agent: Cascade
- Operation type: docs
- Summary: Added mandatory responsive design requirement: every new UI element must be responsive across mobile/tablet/desktop.
- Files changed: `instructions.md`
- Validation: none
- Notes/Risks: Apply this rule to all future UI work.

### 2026-02-24 15:11 (local)

- Agent: Cascade
- Operation type: docs
- Summary: Clarified maintenance rule: agents must keep `instructions.md` up to date with the most recent modified/added/deleted project changes, not only append operation logs.
- Files changed: `instructions.md`
- Validation: none
- Notes/Risks: Any stale guidance should be corrected immediately after relevant code changes.

### 2026-02-24 15:13 (local)

- Agent: Cascade
- Operation type: docs
- Summary: Moved operation logging to dedicated root-level `instructions-log.md` and updated `instructions.md` to require writing logs there only.
- Files changed: `instructions.md`, `instructions-log.md`
- Validation: none
- Notes/Risks: Ensure future agents append entries here instead of `instructions.md`.

### 2026-02-24 15:24 (local)

- Agent: Antigravity
- Operation type: code change
- Summary: Made all core homepage components responsive for mobile and tablet devices. Adjusted flex layouts, search bar bounds, aspect ratios on HeroSlider, and dynamic scrolling widths for carousel cards (category, series, persons). Fixed product card font sizing on small screens.
- Files changed: `header.tsx`, `header-actions.tsx`, `search-bar.tsx`, `nav-bar.tsx`, `hero-slider-track.tsx`, `category-links.tsx`, `category-carousel.tsx`, `persons-carousel-track.tsx`, `series-carousel-track.tsx`, `ebook-platforms.tsx`, `product-card.tsx`, `product-card-detail.tsx`
- Validation: build
- Notes/Risks: The header layout on mobile relies on flex-wrap breaking searchbar to next row; ensure no overlap with other UI elements when user is logged in vs out.

### 2026-02-24 15:35 (local)

- Agent: Antigravity
- Operation type: code change
- Summary: Refactored `PersonsCarouselTrack` and `SeriesCarouselTrack` to display items in a horizontally scrollable 2-row layout using CSS grid (`grid-rows-2 grid-flow-col`). Matched `SeriesCarouselTrack` styling (`bg-dark-gray`, white text, borders) entirely to `PersonsCarouselTrack` as per design request.
- Files changed: `persons-carousel-track.tsx`, `series-carousel-track.tsx`
- Validation: build
- Notes/Risks: Ensure grid layout maintains responsiveness across various screen sizes.

### 2026-02-24 16:55 (local)

- Agent: Antigravity
- Operation type: code change
- Summary: Redesigned the `Footer` component to exactly match the provided visual mockups. Added a new Top Features section using Lucide icons. Splitted the middle section into robust grids handling Contacts, multiple Publishers/Distributors logos, and an eNamad trust script snippet. Set Bottom Address layout identically to mockup text and structure. Fixed pathing for images where basePath routing (`/mysecretpreview/`) caused native next/image fetches to 404 missing public extensions.
- Files changed: `components/layout/footer/footer.tsx`, `components/layout/header/logo.tsx`, `components/features/ebook-platforms/ebook-platforms.tsx`
- Validation: next build
- Notes/Risks: Any newly acquired badges/certificates for the trust section should simply drop in the grid using standard `<img>` wrapper styles predefined across `Footer`.

### 2026-02-25 08:45 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Added an end-of-page "در دست انتشار" carousel sourced from category slug `در-دست-انتشار` with a distinct wide card design, removed price/cart UI in this section, added `اطلاعات بیشتر` CTA, and added social media links row below the carousel.
- Files changed: `app/(shop)/page.tsx`, `components/features/upcoming-books-carousel/index.ts`, `components/features/upcoming-books-carousel/upcoming-books-carousel.tsx`, `components/features/upcoming-books-carousel/upcoming-books-carousel-track.tsx`, `components/features/upcoming-books-carousel/upcoming-book-card.tsx`, `instructions.md`
- Validation: lint
- Notes/Risks: If the upstream category slug changes, this section will not render until `UPCOMING_BOOKS_SLUG` is updated.

### 2026-02-25 08:49 (local)

- Agent: Cascade
- Operation type: bugfix
- Summary: Fixed upcoming books carousel showing partial/half cards by making each slide full-width, enabling mandatory snap points, and scrolling one full viewport width per arrow click.
- Files changed: `components/features/upcoming-books-carousel/upcoming-books-carousel-track.tsx`
- Validation: lint
- Notes/Risks: None.

### 2026-02-25 08:52 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Redesigned upcoming books card to better match app visual consistency (token colors, border style, typography, divider usage, and rounded pill CTA) while keeping the `اطلاعات بیشتر` action and no price/cart behavior.
- Files changed: `components/features/upcoming-books-carousel/upcoming-book-card.tsx`
- Validation: lint
- Notes/Risks: None.

### 2026-02-25 08:58 (local)

- Agent: Cascade
- Operation type: bugfix
- Summary: Adjusted upcoming book card layout so book image is on the right side before title/details in RTL at `sm+` breakpoints.
- Files changed: `components/features/upcoming-books-carousel/upcoming-book-card.tsx`
- Validation: lint
- Notes/Risks: None.

### 2026-02-25 09:00 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Updated upcoming books carousel to display two cards per viewport/page on `md+` breakpoints while keeping single-card layout on small screens.
- Files changed: `components/features/upcoming-books-carousel/upcoming-books-carousel-track.tsx`
- Validation: lint
- Notes/Risks: None.

### 2026-02-25 09:07 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Moved the `در دست انتشار` badge to the left side of the card and reduced spacing between upcoming carousel cards.
- Files changed: `components/features/upcoming-books-carousel/upcoming-book-card.tsx`, `components/features/upcoming-books-carousel/upcoming-books-carousel-track.tsx`
- Validation: lint
- Notes/Risks: None.

### 2026-02-25 09:40 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Implemented a hierarchical product categories menu and integrated it into `NavBar` using a desktop Sheet (`md+`) and mobile Drawer (`<md`), including expand/collapse nested nodes and links to category pages.
- Files changed: `components/features/nav-bar/nav-bar.tsx`, `components/features/product-categories-menu/index.ts`, `components/features/product-categories-menu/product-categories-menu.tsx`, `components/features/product-categories-menu/product-categories-menu-panel.tsx`, `services/categories/categories-api.ts`, `types/category.ts`, `instructions.md`, `instructions-log.md`
- Validation: lint
- Notes/Risks: Category tree fetch uses paginated GraphQL requests to avoid missing categories when total count exceeds a single page.

### 2026-02-25 09:48 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Updated categories menu UX to use step-based drill-down with a back button, forced desktop Sheet to anchor on the physical right side in RTL, removed uncategorized nodes, and flattened top-level `سايت/سایت` node by showing its children at root.
- Files changed: `components/features/product-categories-menu/product-categories-menu.tsx`, `components/features/product-categories-menu/product-categories-menu-panel.tsx`, `instructions.md`, `instructions-log.md`
- Validation: lint
- Notes/Risks: Category-name/slug filtering includes common Persian and English variants; if upstream labels change significantly, update normalization constants.

### 2026-02-25 09:51 (local)

- Agent: Cascade
- Operation type: bugfix
- Summary: Fixed non-opening categories menu trigger on both desktop and mobile by replacing custom trigger component under `asChild` with direct button elements so Sheet/Drawer trigger handlers attach correctly.
- Files changed: `components/features/product-categories-menu/product-categories-menu-panel.tsx`, `instructions-log.md`
- Validation: lint
- Notes/Risks: If trigger UI is refactored again with `asChild`, ensure custom components forward all props/ref to the underlying DOM element.

### 2026-02-25 09:59 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Added an end-of-page news/blog carousel to the homepage using latest posts from GraphQL, with responsive cards (image, date, excerpt, external read-more), carousel controls, and a fallback skeleton.
- Files changed: `app/(shop)/page.tsx`, `components/features/news-carousel/index.ts`, `components/features/news-carousel/news-carousel.tsx`, `components/features/news-carousel/news-carousel-track.tsx`, `components/features/news-carousel/news-card.tsx`, `services/blogs/blogs-api.ts`, `types/blog.ts`, `instructions.md`, `instructions-log.md`
- Validation: lint
- Notes/Risks: Blog URLs currently point to `https://qoqnoos.ir` (`/blog` and per-post `uri`); update constants if publishing domain/path changes.

### 2026-02-25 10:12 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Implemented ISR/tag caching for homepage data services, added server-only cached category-tree wrapper with `unstable_cache`, enabled page-level `revalidate` for home route, and added secure `POST /api/revalidate` endpoint for tag-based on-demand cache invalidation.
- Files changed: `app/(shop)/page.tsx`, `app/api/revalidate/route.ts`, `components/features/product-categories-menu/product-categories-menu.tsx`, `lib/cache.ts`, `services/home-sliders/home-sliders-api.ts`, `services/categories/categories-api.ts`, `services/categories/categories-server-cache.ts`, `services/persons/persons-api.ts`, `services/series/series-api.ts`, `services/blogs/blogs-api.ts`, `instructions.md`, `instructions-log.md`
- Validation: lint
- Notes/Risks: Lint still reports one pre-existing warning in `app/api/[...path]/route.ts` for unused `context`; unrelated to this change.

### 2026-02-25 10:31 (local)

- Agent: Cascade
- Operation type: bugfix
- Summary: Updated header search API request URL to include configured basePath so client search calls resolve to `/mysecretpreview/api/search` in deployed environments.
- Files changed: `components/layout/header/search-bar.tsx`, `instructions-log.md`
- Validation: none
- Notes/Risks: IDE currently reports pre-existing TypeScript errors in `app/(shop)/page.tsx` about `cardVariant` (`"details"` vs `"detail"`), unrelated to this change.

### 2026-02-25 10:33 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Reordered homepage sections so the remaining category block (including `پرفروشها`) renders above `PersonsCarousel`.
- Files changed: `app/(shop)/page.tsx`, `instructions.md`, `instructions-log.md`
- Validation: none
- Notes/Risks: None.

### 2026-02-25 10:35 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Reduced hero banner height across breakpoints and added ~10px (`mt-2.5`) spacing between header and banner on homepage.
- Files changed: `components/features/home-slider/hero-slider-track.tsx`, `app/(shop)/page.tsx`, `instructions-log.md`
- Validation: lint
- Notes/Risks: One pre-existing lint warning remains in `app/api/[...path]/route.ts` for unused `context`.

### 2026-02-25 10:39 (local)

- Agent: Cascade
- Operation type: code change
- Summary: Expanded search behavior to match writers/translators/categories/series/publishers and enriched search dropdown cards with metadata badges for these taxonomies.
- Files changed: `app/api/search/route.ts`, `components/layout/header/search-bar.tsx`, `instructions.md`, `instructions-log.md`
- Validation: lint
- Notes/Risks: Search endpoint still returns product hits only (now with richer taxonomy matching and metadata).
