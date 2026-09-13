# HELLSTAR — Unofficial Store Concept

A cinematic streetwear e-commerce design study built with React, Three.js, GSAP and WebGL.

[Live Project](https://9pvbloo.github.io/Hellstar-Store-Concept/) · [Source](https://github.com/9pvbloo/Hellstar-Store-Concept)

> Independent portfolio concept. Not affiliated with, endorsed by, or operated by Hellstar. No real transactions are processed.

## About

HELLSTAR is a visual-first reinterpretation of a high-end streetwear store. It explores a cinematic, editorial shopping experience through a dark technical aesthetic, where interaction and motion are part of the journey. This is an independent portfolio design study, not a commercial storefront.

## Experience

- Interactive WebGL entry
- Draggable 3D chrome emblem
- Monochrome Plasma background
- Cinematic Entry → Store transition
- Editorial multi-product Hero
- DROP / 001 product grid
- Immersive Product Detail
- Animated StickyNav
- Editorial Lookbook
- Cart drawer
- Conceptual Checkout flow
- Desktop + responsive mobile behavior
- `prefers-reduced-motion` support
- Keyboard-accessible modal and overlay flows

## Built with

- React 19
- TypeScript
- Vite
- Three.js
- React Three Fiber
- OGL
- GSAP
- Fontsource
- CSS

Three.js / React Three Fiber power the 3D Entry emblem; OGL renders the Plasma WebGL background; GSAP drives cinematic choreography and interface motion; React provides the storefront state and UI architecture.

## Performance work

- Product imagery converted from PNG to WebP (~87% reduction)
- Hero sticker imagery converted to WebP (~73% reduction)
- Lazy-loaded Product Detail, Cart, and Checkout
- Lazy-loaded post-entry storefront sections
- Post-transition unmounting of Entry WebGL effects
- Latin-only font subsets
- Responsive WebGL limits and reduced-motion behavior

## Accessibility

- `prefers-reduced-motion` support
- Keyboard navigation and Escape-to-close overlays
- Dialog semantics and focus trapping
- Focus restoration after overlays close
- ARIA state for interactive selections

## Run locally

```bash
git clone https://github.com/9pvbloo/Hellstar-Store-Concept.git
cd Hellstar-Store-Concept
npm install
npm run dev
```

## Production checks

```bash
npm run lint
npm run build
```

## Project structure

```css
src/
├── assets/
├── components/
│   ├── backgrounds/
│   ├── cart/
│   ├── checkout/
│   ├── drop/
│   ├── entry/
│   ├── hero/
│   ├── lookbook/
│   ├── navigation/
│   └── product/
├── data/
├── hooks/
├── App.tsx
└── main.tsx
```

Deployment configuration lives in `.github/workflows/deploy.yml`.

## Deployment

The project is hosted on GitHub Pages. Deployments run from `main` through GitHub Actions, which execute `npm ci`, `npm run lint`, and `npm run build` before publishing `dist/`.

Live URL: [https://9pvbloo.github.io/Hellstar-Store-Concept/](https://9pvbloo.github.io/Hellstar-Store-Concept/)

## Design study & disclaimer

HELLSTAR — Unofficial Store Concept is an independent portfolio and interface design study.

It is not affiliated with, endorsed by, sponsored by, or operated by Hellstar.

Product names, imagery, and brand references are used only to demonstrate a fictional interface concept. No real orders or transactions are processed.

## Usage

This repository is published as a portfolio and design-study project. No license is currently granted for reuse or redistribution of the original interface design, artwork, or project-specific creative assets. Third-party libraries remain subject to their respective licenses.
