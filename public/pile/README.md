# Pile — Marketing Site

A small static site for the iOS app **Pile**. Deployed at `https://www.antonylt.com/pile/`.

Built with hand-written HTML/CSS. No JS, no build step.

## Structure

```
public/pile/
├── index.html          ← landing page
├── styles.css          ← shared design system
├── privacy/index.html  ← (TODO) privacy policy
├── terms/index.html    ← (TODO) terms (references Apple EULA)
├── support/index.html  ← (TODO) support page + FAQ
├── icon.png            ← (TODO) app icon (1024×1024 source recommended)
└── screenshots/        ← iPhone screenshots
```

## Design system at a glance

- **Palette:** warm cream paper (`#F2EEE6`) + warm near-black ink. No accent color — photos provide the color.
- **Display type:** Fraunces (variable italic optical serif) — editorial, modulated.
- **UI / caps labels:** Inter, tracked uppercase.
- **Dark mode:** automatic via `prefers-color-scheme`, warm charcoal palette.
- **Mood:** Print magazine. Bear / Mela / Things adjacent, but more literary.

## Things to swap in

| What | Where | Notes |
| --- | --- | --- |
| Real App Store link | `index.html` → `.appstore-placeholder` href | Replace placeholder with Apple's official badge SVG once the app is live. |
| Optimised screenshots | `screenshots/` | Current PNGs are ~3–4 MB each. Convert to WebP/AVIF or JPEG quality 85 before launch. Recommend 1170×2532 → resize. |
| App icon | `icon.png` (referenced from Open Graph + favicon when added) | Square, ideally 1024×1024 transparent PNG. |
| Sub-pages | `privacy/`, `terms/`, `support/` | To be built next. |

## Local preview

The site lives inside Create React App's `public/` directory, so anything you drop here is served as-is by the dev server.

```bash
cd portfolio
npm start                   # http://localhost:3000/pile/
```

For production, `npm run build` copies `public/` into `build/`, and Vercel serves it.

## Routing note

The portfolio's `vercel.json` currently rewrites everything to the SPA's `/index.html`. Vercel matches existing static files **first**, so `/pile/index.html` should resolve normally — but if `/pile/` (with trailing slash, no filename) doesn't, add this rule **above** the SPA catch-all in `vercel.json`:

```json
{ "source": "/pile/:path*", "destination": "/pile/:path*" }
```

## Accessibility checklist

- [x] Semantic HTML (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- [x] `alt` text on every image
- [x] Focus-visible outlines
- [x] `prefers-reduced-motion` respected
- [x] Color contrast (warm-cream ↔ warm-black) clears WCAG AA
- [ ] Skip-to-content link (add if/when adding nav anchors)
