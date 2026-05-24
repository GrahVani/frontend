# Grahvani Learning Module — Images & Vector-Graphics Guide

> Standards for every visual asset that ships inside a lesson: full-bleed figure illustrations, inline SVGs, lotus glyphs, milestone stones, brand ornaments, audio pronunciation files, and the manuscript-grain overlay.

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED).

---

## 0. TL;DR

Every visual asset in Grahvani must:

1. **Fit the manuscript-cream + deep-night palette** — no neon, no Material-design pastels, no stock photography
2. **Be either an authored illustration** (PNG/WebP, ~250–800 KB) **or a procedurally-drawn SVG** (with code in `chrome/` or `interactive/`)
3. **Sit on a `<figure>` element** with a `<figcaption>` describing what it is
4. **Have `alt` text** describing the visual for screen readers
5. **Live under `frontend/public/assets/learning/` or `curriculum/.../assets/`** depending on whether it's lesson-specific or shared

---

## 1. Image categories

| Category | Where it lives | Format | Typical size |
|---|---|---|---|
| **Lesson figure** (e.g., Vedic Body painting) | `curriculum/tier-N/.../assets/<lesson-slug>/figure-N.webp` | WebP | 600-1200px wide, 250-800 KB |
| **Brand ornament** (corner flourishes, dividers, seal) | `frontend/public/assets/learning/ornaments/*.svg` | SVG | <10 KB |
| **Manuscript grain overlay** | `frontend/public/assets/learning/manuscript-grain.svg` | SVG | <30 KB |
| **Lotus / milestone glyphs** | rendered inline in chrome components | n/a | (SVG code in TSX) |
| **Audio pronunciation** | `curriculum/tier-N/.../assets/<lesson-slug>/audio/<slug>.mp3` | MP3 | 64 kbps, <500 KB per file |
| **Sacred Path nebula textures** | rendered inline in `CurriculumJourney.tsx` | n/a | (SVG radial gradients) |
| **Module illustrations** (the 24 module-card SVGs) | `dashboard/module-illustrations.tsx` | n/a | (SVG code in TSX) |
| **Interactive component static assets** | `interactive/<component>/data.ts` | data + inline SVG | varies |

---

## 2. Authoring a new lesson figure

### 2.1 Constraints

| Property | Spec |
|---|---|
| Background | Cream parchment (`#FFF9F0` to `#FAEFD8`) OR transparent (so it composites onto the page) |
| Color palette | Earth tones — sandalwood, vermilion, indigo, jade, gold. NO neon. NO web pastels. |
| Style register | Vedic manuscript illumination — flat color, soft drop shadows, hand-drawn feel; NOT 3D render, NOT photo, NOT pixel-art |
| Aspect ratio | 4:5 or 3:4 portrait OR 16:9 landscape. Avoid 1:1 unless icon |
| Min width | 600px (for retina display) |
| Max width | 1200px (file size budget) |
| Format | WebP preferred; PNG fallback if generated from raster source with transparency |
| File size | <800 KB per figure |
| Color profile | sRGB |

### 2.2 Generating a figure (LLM-assisted workflow)

For Lesson 1's "Vedic Body" figure we used: generate via diffusion model (DALL-E / Midjourney / SDXL) with a manuscript-illumination style prompt → upscale → manually retouch → export WebP. The Lesson 1 figure is at:

```
curriculum/tier-1-foundation/module-01-introduction-to-jyotisha/chapter-01-what-jyotisha-is/assets/jyotisha-as-vedanga/figure-vedic-body.webp
```

Prompt template (start here, refine):

```
A serene Vedic sage in seated meditation, flat-color manuscript illumination
style, cream parchment background, warm earth tones (sandalwood, vermilion,
gold, indigo), soft golden halo glow at six body parts (third-eye, nose,
mouth, ear, hand, foot), each radiating a faint mandala glyph;
no shadows, no realism, no photo references; hand-illuminated style
inspired by Mughal and Pahari miniature painting; flat 4-color palette
limited to: parchment #FFF9F0, sandalwood #C28220, vermilion #A23A1E,
indigo #4F6FA8, jade #3A8C5A.
```

### 2.3 Placing in a lesson

1. Save the WebP into `curriculum/.../assets/<lesson-slug>/figure-name.webp`
2. Copy to public path:
   ```bash
   cp curriculum/.../figure-vedic-body.webp \
      frontend/public/assets/learning/lesson-figures/jyotisha-as-vedanga/figure-vedic-body.webp
   ```
3. Reference in the markdown's §4 body OR pass to the lesson's interactive component as a prop
4. Always wrap in `<figure>` with `<figcaption>`:

```tsx
<figure>
  <img
    src="/assets/learning/lesson-figures/jyotisha-as-vedanga/figure-vedic-body.webp"
    alt="A Vedic figure in seated meditation with six luminous body-parts radiating mandala glyphs"
    style={{ display: "block", width: "100%", maxWidth: "640px", margin: "0 auto" }}
  />
  <figcaption
    style={{
      fontFamily: "var(--font-cormorant), serif",
      fontStyle: "italic",
      fontSize: "15px",
      color: "var(--gl-ink-on-cream-secondary)",
      textAlign: "center",
      marginTop: "12px",
    }}
  >
    Tap any of the six luminous body-parts to read its Vedāṅga.
  </figcaption>
</figure>
```

---

## 3. SVG rendering — when to inline vs. when to file

| Use case | Format | Where |
|---|---|---|
| Lotus glyph that responds to mastery state | Inline JSX SVG | `LearningYatraMap.tsx` or chrome component |
| Milestone stone with progress arc | Inline JSX SVG | `CurriculumJourney.tsx` |
| Module illustration (24 unique) | Inline JSX SVG | `module-illustrations.tsx` |
| Devanāgarī seed-syllable corner ornament | Inline JSX SVG | `CurriculumJourney.tsx` |
| Manuscript-grain background overlay | External SVG | `public/assets/learning/manuscript-grain.svg` |
| Lesson-specific decorative diagram | External SVG OR inline | author choice; inline if interactive |

### 3.1 Inline SVG conventions

- Use `viewBox` (responsive) — never fixed `width`/`height` as the only sizing
- Compose with polar/parametric coordinates when geometry is symmetric (lotus petals, mandalas)
- Re-use `<defs>` for gradients and filters; reference by `url(#id)`
- For per-instance unique IDs use `uid = props.slug` to avoid conflicts when multiple instances render

### 3.2 External SVG conventions

- File <30 KB; if it's bigger, you're probably encoding raster data — convert to WebP instead
- Sanitize with svgo (production build) — strip Inkscape metadata, viewBox-rounding to integers
- Place under `frontend/public/assets/learning/`

---

## 4. The Sacred Path geometry (reference for any "stone-on-path" recipe)

The Sacred Path is the canonical example of how Grahvani builds a procedural SVG composition. Read `CurriculumJourney.tsx` lines 965–1300 to understand the pattern. Key conventions:

- **Polar coordinates** for everything that radiates (lotus petals, milestone stone hashes, mandala dots)
- **Multiple layered paths** for "river of light" effects (3+ overlaid `<path>` elements with different stroke widths, dash patterns, opacities, animation speeds)
- **`<animateMotion>` + `<mpath>`** for particles traveling along a path — preferred over JS-driven motion when possible
- **`<defs>`** for shared gradients, filters, paths — referenced by `url(#id)`
- **Per-instance UIDs** to prevent ID conflicts when multiple modules render simultaneously
- **`prefers-reduced-motion` guards** on all keyframes via `@media (prefers-reduced-motion: no-preference)`

---

## 5. Audio pronunciation files

### 5.1 When to include

For Sanskrit terms in a `<Sloka>` block or `<TermTooltip>` where pronunciation is non-obvious. NOT required for every Sanskrit term — only where it materially helps.

### 5.2 Format

- MP3, 64 kbps mono (Sanskrit is monaural)
- Sample rate 22050 Hz
- Length <8 seconds per term, <30 seconds per śloka
- Filename: `<lesson-slug>-<term-or-sloka-anchor>.mp3`

### 5.3 Placement

```
curriculum/tier-N/.../assets/<lesson-slug>/audio/
  vedasya-cakshuh.mp3
  jyotisha.mp3
  panini-shiksha-41-42.mp3
```

Copy to `frontend/public/assets/learning/audio/<lesson-slug>/`. Reference via:

```tsx
<audio
  src="/assets/learning/audio/jyotisha-as-vedanga/vedasya-cakshuh.mp3"
  controls
  preload="none"
/>
```

The `<MuteToggle>` in the chrome breadcrumb bar toggles audio globally via `localStorage`.

### 5.4 Voice talent

Specifications:
- Native or near-native Sanskrit pronunciation
- Trained in classical recitation (any of: Vedic chanting, śāstrīya āvartana, mantric studies)
- Calm, considered cadence — NOT urgent, NOT pop-podcast bright
- Recording in a treated room (<30 dB ambient noise)

Source-of-truth pronunciation reference: any of Sastry (1985), Whitney's *Sanskrit Grammar*, or Hock's *Studies in Sanskrit Syntax* — cite in the audio file's caption.

---

## 6. The manuscript-grain overlay

`public/assets/learning/manuscript-grain.svg` is a procedural noise pattern applied as a CSS `background-image` to cream surfaces. Applied via the `--gl-grain-overlay` CSS variable in `globals.css`.

To replicate the parchment feel on a new surface:

```css
.my-cream-surface {
  background-color: #FFF9F0;
  background-image: var(--gl-grain-overlay);
  background-blend-mode: multiply;
  background-size: 200px 200px;
}
```

The overlay is intentionally low-contrast (≤5% opacity); it should not be visible on inspection — only felt.

---

## 7. The 24 module illustrations — the manuscript-icon set

In `src/components/learning-runtime/dashboard/module-illustrations.tsx`, each of 24 modules has a unique inline-SVG glyph (lotus, sundial, mandala, zodiac wheel, navagraha grid, etc.). When authoring a new module:

1. Open `module-illustrations.tsx`
2. Add a new case to the `ModuleIllustration({index, accent, size})` switch
3. Use polar/parametric SVG conventions (§4)
4. Use the chapter accent passed as `accent` prop — don't hardcode hex

The illustrations are intentionally **abstract** — Vedic-coherent symbols rather than literal pictograms. A new dev should look at the existing 24 (especially index 0-5) for style reference before adding a 25th.

---

## 8. Accessibility for all images

| Property | Required? |
|---|---|
| `alt` attribute on `<img>` | YES, always — describe visual content, not "image of" |
| `aria-hidden="true"` on purely decorative SVGs (ornaments, dividers) | YES |
| `role="img"` + `aria-label` on inline SVGs that convey information | YES |
| `<figure><figcaption>` for any image with a caption | YES |
| Min contrast 3:1 for visual elements (graphs, icons) on their background | YES |
| Caption text follows readability floors (≥14px italic Cormorant on cream) | YES |

For complex visualizations (charts, body maps), provide an accessible long-description either:
- In the prose body immediately following the image
- Via `aria-describedby` linking to a hidden `<details>` block with the long description

---

## 9. Asset file naming conventions

| Asset | Pattern | Example |
|---|---|---|
| Lesson figure | `<lesson-slug>-figure-<n>.<webp|png>` | `jyotisha-as-vedanga-figure-1.webp` |
| Lesson interactive data | `<component-slug>.ts` | `vedanga-body-map/data.ts` |
| Lesson audio | `<lesson-slug>-<anchor>.mp3` | `jyotisha-as-vedanga-vedasya-cakshuh.mp3` |
| Brand ornament | `ornament-<role>-<variant>.svg` | `ornament-corner-bronze.svg` |
| Module illustration | inline; identified by index 0-23 | (no file) |

NEVER:
- `image1.png`, `IMG_2024.jpg` — non-descriptive
- Spaces in filenames
- Uppercase (except Devanāgarī characters in `aria-label`)
- Special characters other than `-` and `.`

---

## 10. Performance budget per lesson

| Asset type | Budget per lesson |
|---|---|
| Total image transfer | ≤2 MB |
| Total audio transfer | ≤3 MB |
| Number of HTTP requests for assets | ≤15 |
| LCP (Largest Contentful Paint) target | ≤2.5 sec on 3G Slow |

If your lesson exceeds these budgets, propose splitting the lesson or lazy-loading non-critical assets. Use `<img loading="lazy">` for images below the fold.

---

## 11. Sourcing & licensing

- **Lesson figures generated via LLM:** authored by us; no third-party license issues
- **Photographic textures (e.g., paper grain):** must be CC0 or owned-license; document source in `curriculum/.../assets/<lesson-slug>/LICENSE.md`
- **Classical manuscript imagery:** prefer public-domain sources (British Library, Smithsonian, Internet Archive); attribute in the lesson §12 Citations
- **Stock photography:** PROHIBITED. Period.
- **Iconography:** Lucide (already in use) for UI icons; SVGs we author for Vedic symbols

---

## 12. Adding a new image to a lesson — checklist

- [ ] Image fits the cream + earth-tone palette
- [ ] WebP format, <800 KB
- [ ] Lives under `curriculum/.../assets/<lesson-slug>/` AND copied to `frontend/public/assets/learning/lesson-figures/<lesson-slug>/`
- [ ] Referenced in the lesson markdown OR passed to an interactive
- [ ] Wrapped in `<figure>` with `<figcaption>`
- [ ] `alt` attribute is descriptive, not "image of"
- [ ] `loading="lazy"` if below the fold
- [ ] If audio pronunciation accompanies, MP3 64kbps mono, separate file
- [ ] License documented if sourced externally

---

*End of IMAGES_AND_ASSETS v1.0 — 2026-05-22.*
