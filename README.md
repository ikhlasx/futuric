# Futuric

Website for [Futuric](https://www.futuric.com.au/), the Perth-based group behind NEXA, AugMind, Forma, HardRock and Oryx Visa.

A single scrolling page: hero, ventures, then one scene per venture (NEXA, AugMind, Forma, HardRock, Oryx Visa), a finale, careers + FAQ and the footer.

## Stack

- React 19 + Vite
- GSAP + ScrollTrigger for scroll scenes, Lenis for smooth scroll, cube-motion for small reveals
- Images generated with Higgsfield, served as WebP with JPEG fallback from `public/img/`

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173. If your OS has "reduce motion" on, the site shows its static version; add `?motion` to the URL to preview the full animation.

## Production build

```bash
npm run build
```

Output goes to `dist/`. Vercel builds this automatically (`vercel.json` routes every path to `index.html`).

## Where things live

- `src/lib/content.js` — venture names, taglines, contact details
- `src/sections/` — one file per section
- `src/index.css` — palette tokens and all styles
- `PLAN.md` — build plan, decisions and the launch checklist
