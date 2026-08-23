# KILN® — Digital Craft Studio

> *Raw ideas, fired until they're unbreakable.*

An Awwwards-caliber 3D interactive showcase: a fictional independent digital
studio whose entire identity is built on one metaphor — ceramics fired at
extreme heat. Built as a pitch piece for high-ticket web design + development.

**100% standalone.** Everything (code, deps, configs, fonts) lives in this
folder. Nothing outside it is read, modified or required.

---

## Quickstart

```bash
npm install
npm run dev        # → http://localhost:5177
```

Production:

```bash
npm run build      # outputs ./dist
npm run preview    # serves the production build on :5177
```

Requires Node ≥ 18.

---

## The experience

| Chapter | Section | Signature moment |
|---|---|---|
| Ignition | Preloader → Hero | Cinematic counter, curtain lift, char-level type reveal over a living GLSL core |
| Manifesto | 01 | Word-by-word scrub reveal of the studio creed |
| Fired pieces | 02 | Work index with cursor-following procedural artwork + expanding case rows |
| The firing | 03 | Pinned five-chapter scroll — the kiln core **morphs palette & turbulence per chapter** |
| Proof | — | Count-up stats while the core recedes to a distant glow |
| Capabilities | 04 | Inverted-fill hover rows + infinite marquee |
| Summon | 05 | Giant outlined finale, magnetic email, live Lisbon studio clock |

The WebGL layer is a single persistent fixed canvas behind the DOM. Sections
never touch Three.js objects directly — they declare intent into a shared
store (`src/lib/store.js`) and `Rig` eases the scene toward it every frame.
Scrolling fast literally stokes the fire (velocity feeds shader turbulence +
ember surge).

## Stack

- **Vite 5** — build/dev
- **React 18** — UI shell
- **Three.js** via **@react-three/fiber** + **drei**
- **@react-three/postprocessing** — bloom · grain · vignette
- **GSAP + ScrollTrigger** — choreography
- **Lenis** — inertia scrolling

## Structure

```
├── index.html                  # meta, boot paint, font preloads
├── public/fonts/               # self-hosted Syne / Space Grotesk / JetBrains Mono
└── src/
    ├── App.jsx                 # composition root + global motion plumbing
    ├── lib/
    │   ├── store.js            # mutable shared state (60fps-safe, zero re-renders)
    │   ├── lenis.js            # smooth-scroll singleton
    │   ├── split.jsx           # masked-line split-text engine
    │   └── useMagnetic.js      # magnetic attachment hook
    ├── three/
    │   ├── Experience.jsx      # persistent canvas + post-FX stage
    │   ├── KilnCore.jsx        # noise-displaced molten icosphere (chapter palettes)
    │   ├── Embers.jsx          # rising ember particle field
    │   ├── Rig.jsx             # frame-rate-independent easing toward layout targets
    │   └── shaders/kiln.glsl.js# simplex displacement + heat-ramp fragment
    ├── components/             # Preloader · Cursor · Grain · Nav · Hero · …
    └── styles/global.css       # full design system
```

## Craft notes

- **Reduced motion respected**: Lenis stays but heavy loops, grain animation,
  marquee and custom cursor disable themselves under
  `prefers-reduced-motion`.
- **Touch fallbacks**: lower DPR/particle counts/mesh density, no custom
  cursor, no hover previews; layout retargets for portrait viewports.
- **No image assets**: all case artwork is generated SVG (`CoverArt.jsx`,
  seeded PRNG); textures are canvas-generated.
- **A11y**: split-text renders `aria-hidden` lines with real labels on
  parents, focus-visible rings, semantic landmarks, `role="status"`
  preloader.
- KILN® is a fictional brand created for this showcase.

## Live

**Production:** https://kiln-digital-craft-studio.vercel.app

Deployed on Vercel (`vercel --prod`). Repo: [naveeneppalapally/kiln-digital-craft-studio](https://github.com/naveeneppalapally/kiln-digital-craft-studio).
