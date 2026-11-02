# Futuric v2 — Redesign Plan

Two references, one site:
- **ghost.ai** (screenshot) gives the **page rhythm and colour**: dark hero with a glowing horizon → long grainy light-grey middle → blueprint / clouds / interiors → dark closing with an orange-to-blue horizon → giant engraved wordmark footer.
- **airform.space** (brief) gives the **object and the craft**: a giant gradient wordmark behind one hero object that rotates and **splits into its parts**, a word-by-word statement reveal, rounded lifestyle photo cards, light numerals.

Futuric has no single physical product, so the hero object becomes **the Futuric Core**: the monolith from today's hero, made 3D. On scroll it **splits into five slabs — NEXA, AugMind, Forma, HardRock, Oryx Visa**. "One group, five ventures" stops being a sentence and becomes the opening animation.

---

## 1. What's weak in v1 (why redesign)

| v1 today | Problem | v2 fix |
|---|---|---|
| Hero: headline left, small portrait image right | Reads like a template; the object is 36% of the width | One central object in front of a full-width FUTURIC wordmark |
| Light / dark sections alternate every screen | Jumpy; no sense of one journey | ghost rhythm: dark open → one long grainy light middle → dark close |
| Ventures slider = flat colour tiles | Weakest section; no pictures | Rounded photo-card carousel (airform) using the six real images |
| Ventures are separate scenes, nothing links them | The "one group" story is told, not shown | The Core splits into the five ventures, and each scene starts from its slab |
| Flat backgrounds | Feels digital and cold next to ghost | Film grain over every surface, blueprint grid behind NEXA |
| Accent blue only | Lacks ghost's warm signal | Add ghost's signal orange for the top bar, active tab and horizon |

---

## 2. Colour (sampled from the ghost screenshot)

| Role | Hex | Where |
|---|---|---|
| Paper (grainy light ground) | `#D6D5D3` | the long middle of the page |
| Paper raised | `#E2E1DF` | cards, FAQ rows, tab bar |
| Blueprint paper | `#D2D5DA` | NEXA section, with lines `#C3C7CE` |
| Ink | `#12151A` | text, dark hero |
| Night | `#0A0E19` | Forma "devices" section, finale |
| Graphite | `#2B2E35` / `#4E5157` | secondary surfaces, muted UI |
| Mute | `#A3A4A6` | light numerals, secondary text |
| **Cobalt** (action) | `#1F64D6` | primary buttons, routes, active pips |
| Cobalt light | `#5299D8` | hover, sky, horizon glow |
| **Signal orange** | `#D25C2E` | top announcement bar, active tab, horizon band, one hotspot per scene |

Your existing neutrals stay almost unchanged; the change is a more saturated cobalt plus one warm orange. (Confirm in Q1.)

## 3. Grain

One fixed full-screen layer above everything, generated in code (SVG `feTurbulence`, no image download):
- light sections: multiply, opacity ≈ 0.10
- dark sections: screen, opacity ≈ 0.06
- static (no flicker) by default; optional 2-frame shimmer at 8 fps
- `pointer-events: none`, ≈ 2 KB, zero credits

## 4. Type and shape

- Hanken Grotesk stays (or **Inter Tight / Geist**, closer to airform's Oakes Grotesk; Q3).
- Lighter hierarchy, airform-style: H2 400 weight, display 500, numerals 300 in `#A3A4A6`.
- Shapes: **pills (100px)** for nav, tabs and CTAs; **32px radius** for photo cards; square for technical panels (NEXA tags, Forma UI). Same mix as both references.
- Easing: `cubic-bezier(.22,1,.36,1)` for reveals, `cubic-bezier(.34,1.3,.64,1)` for small UI pops. Slow and smooth, never fast.

---

## 5. New page, section by section

| # | Section | Pattern from | Futuric content | Motion |
|---|---|---|---|---|
| 0 | **Signal bar** | ghost orange bar | "NEXA is live — visit nexafuturic.com →" | slides away on scroll |
| 1 | **Hero: the Core** | ghost dark hero + airform wordmark | Dark grainy ground, earth-curve glow at the bottom. Giant FUTURIC logo across the width, grey-to-transparent fill. The graphite Core stands in front. Below: "Building what comes next." + pills *Explore ventures* / *Build with us* | Pinned ~2 screens: the Core rotates, tilts and **splits into five slabs**, each label appearing (NEXA … Oryx Visa); the wordmark fades |
| 2 | **Statement** | airform word reveal | On a blurred, grainy close-up of the Core: "Futuric drives intelligent industrial ecosystems and high-performance ventures across Australia and the world. From the factory floor to the front door, we build the systems that run what comes next." | Words darken one by one as you scroll |
| 3 | **One group. Five parts.** | airform carousel + numerals | Draggable 32px-radius cards using our images: factory door, cloud lab, Forma UI, dusk living room, gate, Earth. Three columns: **01 Engineered in Perth** · **02 Built to run, not to demo** · **03 Five countries, one team** | Drag/scroll carousel, cards ease in |
| 4 | **NEXA** | ghost exploded view + blueprint | Blueprint-grid ground; factory image plus the Machines → IoT → Data → AI → Action tags; ghost's tab strip with the active tab in orange | Pinned push-in (as now), tab strip tracks the step |
| 5 | **AugMind** | ghost room in the clouds | Keep the cloud lab, flying sources and brain states | As now, plus grain |
| 6 | **HardRock** | ghost blue-tinted interiors | Living room at dusk → lit; pill toggles for Lighting / Climate / Security / Entertainment | Scroll dims → lights on; toggles change the room |
| 7 | **Forma: built for your devices** | ghost "Compatible with your devices" (dark) | The Core in the centre; the Forma laptop dashboard, phone app and IoT device panel around it (the real UI we built) | Devices slide in, scan line passes |
| 8 | **Everything we connect** | ghost tabbed grid page | Grid-paper ground; tabs **Industry / Intelligence / Living / Mobility**; small objects around the Core (robot arm, sensor, phone, thermostat, passport…) | Tabs morph the orbiting set |
| 9 | **Oryx Visa** | ghost room scenes | Dawn gate, destinations, routes from Perth | As now |
| 10 | **Finale** | ghost dark close + orange/blue horizon | The Core rises from an orange-to-cobalt horizon: "We built factories… Building what comes next." + *Build with us* | Core rises, horizon brightens |
| 11 | **Careers + FAQ** | — | Unchanged content, grainy paper, pill rows | — |
| 12 | **Footer** | ghost engraved wordmark | Engraved FUTURIC (already built), on grainy paper | Ink fill on scroll |

---

## 6. How we build it, cheaply

- **The Core (3D):** Three.js through `@react-three/fiber` + `drei`. Five bevelled graphite slabs with a brushed-metal material and a studio light, built in code. **0 credits**, loads only when the hero is near, ≈ 150 KB gz extra. Phones and reduced motion get a still render instead.
- **Blueprint, grain, grid paper:** drawn in code (SVG/CSS). **0 credits.**
- **Statement background:** CSS-blurred crop of the Core render. **0 credits.**
- **Optional Higgsfield images (~0.25 each):** a studio still of the Core for phones/reduced motion; a close-up for the statement; small object cut-outs for section 8 (≈ 8–10 images ≈ 2.5 credits).
- **No video** unless you approve a budget later.

Estimated spend: **0–3 credits** (≈ 140 available).

## 7. Build order (one section at a time, your approval each)

1. Design tokens + grain + signal bar + new nav (pills)
2. Hero Core: 3D slabs, wordmark, split-on-scroll
3. Statement word reveal
4. "One group. Five parts." carousel + numerals
5. NEXA on blueprint with tab strip
6. Forma devices (dark) + tabbed grid page
7. AugMind / HardRock / Oryx restyle (grain, pills, orange accents)
8. Finale horizon + footer
9. Inspector pass at 3 widths, production build, push

## 8. Decisions (locked 2026-11-02)

- Palette: **ghost cobalt `#1F64D6` + signal orange `#D25C2E`**, neutrals unchanged
- Hero: **3D Futuric Core in Three.js** (R3F + drei), splitting into the five ventures; phones get a vertical stack
- Font: **Hanken Grotesk**, lighter weights (300–500)
- Section 8 "Everything we connect": **build it** (≈ 2 credits for object cut-outs)
- Concept preview: `concept/v2.html` (run the `futuric-concept` server, open `/concept/v2.html?motion`)

### Original questions

1. Palette: adopt ghost's cobalt + signal orange, or keep the current blue only?
2. Hero object: the 3D **Futuric Core** splitting into five ventures, or another object?
3. Font: keep Hanken Grotesk or switch to a lighter airform-style grotesk?
4. Section 8 ("Everything we connect"): build it, or skip it to keep the page shorter?
