# Unimozer Next Install Website

This repository contains the public install website for Unimozer Next.
It is focused on students and teachers installing at home, with clear download
choices and platform-specific install guidance.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Single-page app (SPA), static build

## Local Development

```bash
npm install
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
npm run check:links
```

`check:links` validates the required stable alias download URLs and release fallback.

## Screenshot Processing

```bash
npm run images:process
```

Current processing pipeline generates optimized carousel assets:

- `src/assets/screenshots/feature-uml-diagram.webp`
- `src/assets/screenshots/feature-uml-diagram.jpg` (fallback for non-WebP browsers)
- `src/assets/screenshots/feature-wizard.webp`
- `src/assets/screenshots/feature-wizard.jpg` (fallback for non-WebP browsers)
- `src/assets/screenshots/feature-structogram.webp`
- `src/assets/screenshots/feature-structogram.jpg` (fallback for non-WebP browsers)
- `src/assets/screenshots/feature-object-bench.webp`
- `src/assets/screenshots/feature-object-bench.jpg` (fallback for non-WebP browsers)

## Build

```bash
npm run build
```

Output is generated in `dist/` and can be hosted as static files.

## Deploy Notes (Self-hosted at Domain Root)

- This site is intended for root deployment (`/`).
- Default Vite config is used, so asset URLs are built for root path hosting.
- Serve `dist/` directly from your web server document root.

## Updating Download Links

Update link labels and URLs in:

- `src/data/downloads.ts`

The link check script should be re-run after any changes:

```bash
npm run check:links
```

## Replacing Screenshots

Current screenshots are placeholders in:

- `src/assets/screenshots/`
- `src/assets/screenshots/sources/` (input images for processing)

To replace them:

1. Replace source images in `src/assets/screenshots/sources/`.
2. Run `npm run images:process`.
3. Keep file names the same, or update imports in the related components.
4. Keep meaningful alt text in components for accessibility.

Related components:

- `src/components/FeatureCarousel.tsx`
- `src/components/DownloadCards.tsx` (macOS tutorials/guides are in the macOS tab)

## Runtime Logo Assets

Logo parallax assets are generated from source files in `src/assets/logo-sources/`:

- Source files:
  - `src/assets/logo-sources/icon.png`
  - `src/assets/logo-sources/icon_depthmap.png` (depth source)
- Generated runtime files:
  - `public/icon_runtime.png`
  - `public/icon_depthmap_runtime.png`

Generate runtime assets with:

```bash
npm run assets:logo
```

The hero 3D logo effect expects these runtime files for best edge quality and performance.

## Branding Asset

 - Site icon source is `src/assets/logo-sources/icon.png`.
 - Runtime icon used by the site is `public/icon_runtime.png`.
