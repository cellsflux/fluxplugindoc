# fluxplugin docs

The documentation website of **fluxplugin** — built with **Vite + React + TypeScript + Tailwind CSS v4**.
No server, no CMS: pages are Markdown files, the site is fully static.

```bash
npm install
npm run dev          # http://localhost:5173 — hot reload
npm run build        # type-checks, builds to dist/ (+ 404.html SPA fallback)
npm run preview      # serve the production build
```

## Features

- Responsive layout: sidebar, **“On this page”** table of contents with scroll-spy, previous/next links
- **Search** (`Ctrl/⌘ K` or `/`) over every page and section, with highlighted snippets
- Light / dark / system theme, no flash on load
- Syntax highlighting, **copy buttons**, callouts (`> [!NOTE]`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`), responsive tables, heading anchors
- Landing page with hero, feature grid, code samples and real screenshots
- Accessible: skip link, keyboard-navigable search, visible focus, `prefers-color-scheme`

## Writing pages

Add a Markdown file under `src/content/<group>/` with a front-matter header — it appears in the sidebar, the search and the prev/next links automatically:

```md
---
title: My page
description: One sentence shown under the title and in search.
group: Guides          # Getting started | Guides | Reference
order: 4               # position inside the group
---

## A section
Text, `code`, tables, images (`/img/…`) and callouts:

> [!TIP]
> Links to other pages are normal paths: `[Quick start](/quick-start)`.
```

The page URL is the file name (`my-page.md` → `/my-page`). To add a group, edit `GROUPS` in `src/lib/content.ts`.

## Branding

Edit `src/config.ts` (name, tagline, repository URL) and the brand colours in `src/styles.css` (`--color-brand-*`). Screenshots live in `public/img/`.

## Regenerating the reference pages

`reference/manifest.md` and `reference/permissions.md` are generated from the library itself, so they cannot drift:

```bash
FLUXPLUGIN_DIST=../flux/dist/node/index.js npm run reference
```

## Deploying

Any static host works (Netlify, Vercel, Cloudflare Pages, S3…). `dist/404.html` is a copy of `index.html`, so deep links such as `/quick-start` work on hosts that need a fallback file.

**GitHub Pages (project site)** — build with the repository name as base path:

```bash
VITE_BASE=/fluxplugin/ npm run build
```

then publish `dist/` (for example with the `actions/deploy-pages` workflow).
