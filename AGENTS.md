# Deep Dey — portfolio

Vite + React single-page portfolio ("The Daily Deploy", newspaper style).

## Commands

```bash
npm run dev      # dev server (default http://localhost:5173/)
npm run build    # vite build -> vite build --ssr -> node scripts/prerender.mjs -> dist/
```

## Build pipeline (SSR prerender)

`npm run build` produces static HTML per route, not just a client bundle:

1. `vite build` — client bundle.
2. `vite build --ssr src/entry-server.jsx --outDir dist-ssr` — `render(path)` via `react-dom/server`.
3. `node scripts/prerender.mjs` — renders `/` and `/work/`, injects route head tags + JSON-LD into the `<!--head-tags-->` and `<!--app-html-->` placeholders in `index.html`, writes `dist/index.html`, `dist/work/index.html`, `dist/sitemap.xml`, `dist/sitemap-images.xml`, `dist/llms.txt`, then deletes `dist-ssr`.

The client hydrates (`hydrateRoot` in `src/main.jsx`) when prerendered markup is present; in dev it falls back to `createRoot`. Keep all `window`/`document` access inside effects — render must be pure for SSR + matching hydration.

## SEO data flow

`src/data/projects.json` and `src/data/record.json` feed `scripts/prerender.mjs` directly: JSON-LD `@graph` (Person, WebSite, ProfilePage/CollectionPage, ItemList of projects), the image sitemap (every `image` in projects.json is auto-listed), and `llms.txt` (Experience bullets from record.json, Projects from projects.json). Editing the JSON updates SEO output on the next build — no component or script changes needed.

## Regenerating assets (one-off, not part of build)

Outputs are committed into `public/`; each script needs Chrome (path hardcoded):

```bash
node scripts/make-images.mjs  # src/assets/*.png -> public/images/*.webp (portrait, side, tech-stack)
node scripts/make-icons.mjs   # favicon.ico, favicon-32, apple-touch-icon, icon-192/512
node scripts/make-og.mjs      # public/og-image.jpg (1200x630 social card)
```

## Pages and navigation

- `/` is the one-page site; `/work` renders `src/components/WorkPage.jsx` (placeholder for the full project page). Routing is a pathname check in `App.jsx` (`isWorkPage()` from `Header.jsx`); no router dependency.
- Menu links: Index `/#top`, Work `/work`, About `/#about`, Contact `/#contact`. The struck-through item follows scroll position on `/` (Contact once the page bottom is reached) and is Work on `/work`.
- Direct visits to `/work` need an SPA fallback: `vercel.json` (Vercel) and `public/.htaccess` (Apache/Hostinger) rewrite unknown paths to `index.html`.

## Adding a project

Projects are data-driven — no component edits needed.

1. Drop the project image into `public/projects/` (e.g. `public/projects/my-app.jpg`).
2. Add an entry to `src/data/projects.json` (plain array, display order):

```json
{
  "slug": "my-app",
  "title": "MY APP",
  "tag": "OSS",
  "image": "/projects/my-app.jpg",
  "alt": "Artwork for the my-app project",
  "description": "One or two lines describing the project.",
  "links": [
    { "label": "GitHub", "url": "https://github.com/Deep-Dey/my-app" }
  ],
  "openSource": true,
  "featured": true,
  "spotlight": false
}
```

Field meanings:

| Field | Meaning |
| --- | --- |
| `slug` | Unique id; used as the React key. Duplicates warn in dev. |
| `title` | Displayed title, uppercase. |
| `tag` | Small rust tag box (e.g. `NPM`, `PYPI`, `OSS`). |
| `image` | Path under `public/` — keep it `/projects/...`. |
| `alt` | Image alt text. |
| `description` | 2–3 line card text. |
| `links` | Array of `{ label, url }` rendered as text links on rail cards. |
| `openSource` | Metadata only (exported as `openSourceCount`; not displayed). |
| `featured` | The first two featured projects appear in the work row (`#work`). |
| `spotlight` | The first `spotlight: true` item fills the middle card in the three-column section. Keep at most one. |

Dev-only validation logs a console warning for missing `slug`/`title`/`image`/`description` or duplicate slugs.

## Adding a record entry

"The Record" columns come from `src/data/record.json` (plain array, display order left to right, **latest first** — add new entries at the top):

```json
{ "years": "2024–2026", "title": "ROLE, COMPANY", "text": "One or two sentences." }
```

The row scrolls sideways when the entries don't fit (5 fit at 1440px; on phones about 1.3 show). A "TIP! Scroll sideways…" note appears only when it overflows; there is no auto-scroll.
