# Futuric Australia — Website Build Plan

Reference layout & motion: **ghost.ai** (your `futuric reference .mp4`)
Content source: **futuric.com.au** + the Futuric universe brief (NEXA → AugMind → Forma → HardRock → Oryx Visa)
Rule: borrow ghost.ai's *structure and motion*, not its look or copy. Everything visible says Futuric.

---

## 1. What the reference actually does (from the video)

| ghost.ai section | What moves | Futuric equivalent |
|---|---|---|
| Light hero, big product render, 2-line headline, one CTA | Headline split-reveal, product fades/lifts in | **Hero** — "Building what comes next." |
| Gallery slider with `01 / 04` counter | Horizontal slide, counter ticks | **Ventures strip** — 01 NEXA … 05 ORYX VISA |
| Exploded product view with spec tags (GPU, CPU, RAM) | Scroll-scrubbed frame sequence, tags pop in | **NEXA** — factory exploded: Machines → IoT → Data → AI → Action |
| "Intelligence stays yours" — room floating in clouds | Slow parallax, pinned text | **AugMind** — lab/brain in a void, "Understand. Reason. Respond." |
| Kitchen scene with hotspot tags + pills | Hotspots appear on scroll, pills switch state | **HardRock** — smart home, tags: Lighting / Climate / Security |
| Device grid (Digital / Home / Health) with scan line | Scan line sweeps, tiles light up | **Forma** — Web / Dashboard / Mobile / IoT / AI tiles |
| Dark closing "Own your intelligence." + gradient floor | Product rises, gradient glows | **Oryx Visa → Futuric finale** — globe lines, "Building what comes next." |
| Giant engraved wordmark footer | Light sweep on letters | **FUTURIC** engraved footer + contact (Perth, +61, hello@) |

---

## 2. Stack (low cost — everything free)

| Need | Tool | Cost |
|---|---|---|
| Build | Vite + React 19 | free |
| Smooth scroll | Lenis 1.3 | free |
| Scroll scenes, pin, scrub, SplitText | GSAP 3.15 + ScrollTrigger (all plugins free now) | free |
| Small UI reveals (cards, buttons, menu) | cube-motion 0.1 (rise / leave / morph / reveal) | free |
| 3D (only where it pays off: data particles, globe) | three + @react-three/fiber + drei — **lazy-loaded** | free |
| Images & short loops | Higgsfield connector | credits — see §5 |
| Hosting | Vercel or Netlify free tier, or your current host | free |

**Not doing (cost/risk):** a full Blender-modelled walking human through 6 GLB worlds. That's weeks of 3D work and a heavy site. Instead we use the ghost.ai trick: **AI-generated stills + short video loops scrubbed by scroll**, with light Three.js only for particles/globe. It looks cinematic, loads fast, works on phones.

---

## 3. Phases

**Phase 0 — Skeleton (first build, what you asked for now)**
- Scaffold Vite/React, install GSAP, Lenis, cube-motion
- Recreate ghost.ai section *order and motion* with Futuric name + real Futuric copy
- Placeholder visuals (CSS gradients / simple shapes) — no credits spent yet
- Nav: FUTURIC · PRODUCTS ▾ · ABOUT · CAREERS · CONTACT · [Build with us →]
- Right-side progress rail 01–05
- Reduced-motion + "Skip experience" support

> **Status 2026-10-31: Phase 0 built** in `web/` (`npm --prefix web run dev`, open `http://localhost:5173/?motion`).
> Placeholder slots are marked `data-slot="…"` in each section file — that's where Higgsfield images go.

**Phase 1–8 — One section at a time** (you approve each before the next)
1. Hero
2. NEXA (flagship, biggest scene, links to nexafuturic.com)
3. AugMind
4. Forma
5. HardRock
6. Oryx Visa
7. Finale + ventures grid
8. About / Careers / FAQ / Contact (plain HTML, fast)

Per section loop: I write 2–3 Higgsfield prompts → you pick one image → (optional) animate to a 5s loop → I wire scroll motion → you review → next.

**Phase 9 — Polish & ship:** mobile pass, image compression (WebP/AVIF), Lighthouse, deploy.

> **Status 2026-10-31: Phases 1–9 built.** Images chosen: hero A-portal, NEXA C-factory, AugMind A-cloud-lab,
> Forma = UI built in code, HardRock A-living, Oryx A-gate, Finale B-routes (drafts in `assets/drafts/`).
> Higgsfield spend ≈ 3.75 credits. Production build: `npm --prefix web run build` → `web/dist/` (≈133 KB JS gzipped).

### Launch checklist (open items)
- [ ] Client approves Careers line + 5 FAQ answers (`web/src/sections/Careers.jsx`)
- [ ] Confirm Kochi as the India destination (`web/src/sections/Oryx.jsx`)
- [ ] Replace or approve Forma sample data (`web/src/sections/Forma.jsx`)
- [ ] AugMind / Forma / HardRock / Oryx copy is from the brief — confirm (`web/src/lib/content.js`)
- [ ] Optional: upscale the 6 images (880–1344 px today) with Higgsfield for retina screens
- [ ] Optional: vector (SVG) logo to replace `web/public/futuric-logo.png`
- [ ] Choose hosting (Vercel / Netlify free tier, or current host) and point futuric.com.au at `web/dist/`

### Known inspector flags we accept
- `numbering` — the 01/05 counter and 01–05 rail were requested
- `covered-text` / hero 3 lines — measured mid-way through the word-rise animation; settled layout is 2 lines
- `reduced-hidden` — off-screen slides inside the ventures carousel
- `lopsided` HardRock — the photo fills the empty side by design
- `no-footage` — video loops deferred (images only for now)

---

## 4. What YOU need to do

- [ ] Send the **Futuric logo** (SVG preferred) and any NEXA / venture logos
- [ ] Confirm **brand colours / fonts** (or let me propose)
- [ ] Give real copy or approval for **AugMind, Forma, HardRock, Oryx Visa** (live site only mentions NEXA)
- [ ] Confirm which ventures are **live vs coming soon** (affects CTAs)
- [ ] Set a **Higgsfield credit budget**
- [ ] Decide hosting/domain for the preview
- [ ] Review each section within the loop above

---

## 5. Keeping Higgsfield cost low

- Images first, video only for approved images (image-to-video, 5s, loopable)
- ~1 hero image + 1 loop per section ≈ 7 images + 5–7 short clips total
- Generate drafts at low res, upscale only the winners
- Scroll-scrub a single clip instead of multiple clips per scene
- Reuse one consistent "Futuric look" prompt prefix so we don't regenerate for mismatched style

---

## Decisions (locked 2026-10-30)

- **Palette:** neutrals `#121418` `#141926` `#2B2E35` `#4E5157` `#A3A4A6` `#D0CFCF` `#DAD9D7` · blues `#3A81C9` `#3F80B9` `#5299D8`
  - Proposed roles: dark base `#121418`, deep panel `#141926`, surfaces `#2B2E35`/`#4E5157`, muted text `#A3A4A6`, text `#DAD9D7`, light sections `#D0CFCF`, accent `#3A81C9` (hover `#5299D8`, pressed `#3F80B9`)
- **3D level:** AI stills + scroll-scrubbed video, light Three.js particles/globe only
- **Higgsfield:** images only for now; video decided per section later
- **Venture copy:** use the brief's taglines, refine per section

### Style tags (from land-book, ghost.ai) — every section must hit these

| Tag | How it shows up on Futuric |
|---|---|
| Landing | One long scrolling homepage; About/Careers/FAQ are light sub-pages |
| Big Footer | Full-height footer: contact, offices, venture links, socials |
| Big Type in Footer | Edge-to-edge engraved **FUTURIC** wordmark with a light sweep (like ghost's engraved "ghost") |
| Parallax | Layered stills (foreground / object / backdrop) moving at different scroll speeds via GSAP + Lenis |
| AI | AugMind brain states, data particles, neural lines — restrained, no glowing-robot clichés |
| Tech | Spec-tag callouts (`CPU · 8 cores`-style) reused as `SENSOR · 240 Hz`, `AGV · AMR` labels |
| Sans Serif | One neo-grotesk family, tight tracking on headlines, sentence case ending in a period |
| Physical Product | Each venture has a hero "object" render (factory cell, brain core, device, smart panel, passport/aircraft) shot like a product |
| Software | Forma/AugMind UI fragments: dashboards, chat states, code — real-looking, not lorem

## 6. Content we already have (futuric.com.au)

- Title: *Building the Future of Enterprise.*
- "Futuric drives intelligent industrial ecosystems and high-performance ventures across Australia and globally."
- Flagship: **NEXA by Futuric** — smart factory transformation: industrial AI, IoT, robotics, connected operations → nexafuturic.com
- CTA: *Let's build something intelligent.*
- Engineering Office — parent group HQ overseeing industrial intelligence, robotics & software engineering
- hello@futuric.com.au · +61 469 129 200 · Perth, Western Australia
- Global: Australia · UAE · Qatar · KSA · India
