# 00 — Grahvani Learning Design Constitution

> The locked rules of physics for the Grahvani learning experience. Every lesson surface, every interactive, every micro-interaction across 1,500+ Tier 1 lessons and 500+ Tier 2 lessons conforms to what is written here. Where this document and the curriculum constitution (`curriculum/00-curriculum-constitution.md`) disagree, the curriculum constitution wins on *what* to teach; this constitution wins on *how* it is presented.

**Doc owner:** Goutham Kadumuru (founder).
**Version:** **1.0 — 2026-05-22 (LOCKED).**
**Status:** Founder approved Tier 1 · Module 1 · Chapter 1 · Lesson 1 as the canonical reference implementation. All §1–§24 prescriptions are now LOCKED; §25–§33 capture additions made during the v0.2 → v1.0 promotion pass (tokens, utility classes, readability floors, server wiring, Mahā-Path deferral, inheritance rules).
**Authority:** Derived from `curriculum/00-curriculum-constitution.md`, `curriculum/01-pedagogical-framework.md`, `curriculum/02-lesson-authoring-standard.md`, `curriculum/03-source-citation-standard.md`, `curriculum/04-devanagari-iast-conventions.md`, `curriculum/05-interactive-component-taxonomy.md`, `curriculum/06-assessment-design-standard.md`, and `curriculum/07-tier-progression-map.md`.
**Status legend:** **[LOCKED]** = decided with rationale, change requires constitutional amendment per §23. **[v1.1]** = revisit in a subsequent version; current value documented but not yet finalised. All `[FOUNDER]` and `[OPEN]` tags from v0.2 have been resolved into [LOCKED] in this revision.

### Version history

- **v1.0 (2026-05-22, LOCKED)** — Tier 1 / Module 1 / Chapter 1 / Lesson 1 approved as canonical. Design tokens published. HIG readability audit landed. Server-wired learning layer verified. Mahā-Path component built and deferred. Constitution promoted from "pending review" to "locked authority".
- v0.2 (2026-05-21) — Founder review pending. 24 sections drafted.
- v0.1 (2026-05) — Initial scaffolding.

---

## 1. Mission of this document

A learning module that handles PhD-level content at world-class pedagogical and visual standard cannot be authored ad-hoc. Each of the 2,000+ lessons in the eventual curriculum must feel like it belongs to one institution, like reading one carefully-typeset manuscript across thousands of pages. This document is the manuscript style guide.

It is also the engineering contract. The lesson runtime engine reads lesson markdown bodies and configures interactives by reference; everything *visual and interactional* is defined here.

### 1.1 Voice of this document

This constitution is institutional. It uses "this constitution", "the runtime engine", "Phase B", "engineering", and the inclusive plural "we" when joining the reader in inquiry. It does not use the first person singular ("I"). The voice rule matches `curriculum/00-curriculum-constitution.md` §6.

### 1.2 Relationship to other documents

- `curriculum/00-curriculum-constitution.md` — *what* is taught (vision, philosophy, what-we-will-not-do).
- `curriculum/01-pedagogical-framework.md` — *how learning happens* (Bloom, 7E, mastery gating).
- `curriculum/02-lesson-authoring-standard.md` — *how lesson markdown is structured* (12 sections, front matter, length budgets).
- `curriculum/03-source-citation-standard.md` — *how classical and modern sources are cited*.
- `curriculum/04-devanagari-iast-conventions.md` — *how Sanskrit is typeset across three registers*.
- `curriculum/05-interactive-component-taxonomy.md` — *what families of interactive components exist and how each is specced*.
- `curriculum/06-assessment-design-standard.md` — *how MCQs and tier exams are designed*.
- `curriculum/07-tier-progression-map.md` — *which lessons depend on which*.
- **This document (frontend/docs/learning-module/00-design-constitution.md)** — *how all of the above renders on screen*.

When this document references a curriculum-side rule, the rule is cited inline (e.g., "per `curriculum/05-taxonomy.md` §3").

---

## 2. Brand register — what the experience feels like

**[LOCKED]**

Three words: **scholarly · ceremonial · sidereal.**

- **Scholarly** — the visual register of a research-tier university press, not an edtech app. Typography matters more than animation. Citations are honored, not glossed.
- **Ceremonial** — every lesson has the gravity of a small ritual. Mastery is earned, not collected. Transitions are considered, not gratuitous. Gold is used sparingly, like a temple's gold rather than a casino's.
- **Sidereal** — the visual world lives under a Vedic sky. Deep night with stars visible. Time moves at the pace of constellations, not push notifications. Color comes from cosmology (planet hues from classical attribution), not from a designer's mood.

**Inspirations to study and depart from:**
- *Stripe Docs* — for the typography pleasure of reading.
- *Apple HIG / Apple TV+ aesthetic* — for material restraint and considered motion.
- *Duolingo* — for the satisfying micro-grip of progress.
- *Brilliant.org* — for manipulable interactives that teach.
- *Khan Academy mastery flow* — for honest 80%-and-cooldown progression.
- *Manuscript illumination (Śāradā, Devanāgarī, Brahmi script traditions)* — for the *visual register* of classical authority.

**Forbidden registers:**
- ❌ "Astrology stock photo" aesthetic (purple gradient with chart graphic and unicode planet symbols).
- ❌ Mystical-marketing ("unlock the secrets", glowing crystal balls, neon zodiac glyphs).
- ❌ Childish gamification (cartoon mascots, confetti explosions, candy-crush ding sounds).
- ❌ Generic edtech (Coursera-style chrome, off-the-shelf material design, no soul).
- ❌ Western astrology iconography (♈♉♊ glyphs as primary symbols — they are a different tradition).

### 2.1 The Asha-persona consideration

**[LOCKED]**

The curriculum constitution §2 names four personae the curriculum must serve simultaneously: **Asha** (entry-level seeker), **Vikram** (junior astrologer), **Priya** (formal degree-track student), and **Rajeev** (senior practitioner). The scholarly-ceremonial-sidereal register reads naturally to Priya and Rajeev. The honest question: does it intimidate Asha?

The answer this constitution commits to:

> **The lesson stretches Asha up.** It does not patronise her with a simplified visual register. The scholarly register is itself the promise — by completing this lesson, she will read like Priya does. Edtech that visually flatters the beginner ("Welcome friend! Astrology is so fun!") teaches beginners that the subject is small. We refuse that.

The accommodations that make this work in practice (each is binding on the runtime):

1. **Term tooltips on first use.** Every Sanskrit and technical term is wrapped in `<TermTooltip>` on its first appearance per lesson. Tap or hover surfaces the gloss + IAST + audio (when available) without breaking flow.
2. **Plain-English §2 prerequisites.** The 12-section template's §2 is always restated in plain English. The first lesson of the curriculum (this one) assumes literally nothing.
3. **The "things I see" reflection prompt.** Embedded after each concept-theatre interactive (see §10). Asks the learner to articulate what they observed, in their own words, before continuing. This converts passive looking into the verbal-articulation moment Asha needs.
4. **Spaced-repetition feeds the same anchors regardless of persona.** Asha and Rajeev both consolidate from the same memory anchors (§9). The anchors are short, citation-grounded, and survive translation across personae.
5. **No "skim mode."** The lesson is not paginated as "beginner / advanced" variants. One lesson, one rigorous shape; the rigour is the dignity.

The acceptance criteria (§24) include an Asha-specific check: a learner with zero prior Jyotiṣa knowledge can complete Lesson 1 to mastery within the target 25-minute total time without external help.

---

## 3. Type system

**[LOCKED]**

Three faces, used in defined registers. All three already ship in `frontend/public/fonts/`.

### 3.1 Display — *Tiro Devanagari Hindi*

Used for: Devanāgarī ślokas, lesson title-Devanāgarī subtitles, ceremonial section headers in Devanāgarī. **Never** for Latin-script English body.

```
Source: Google Fonts (already in public/fonts/)
Files: TiroDevanagariHindi-Regular.ttf, TiroDevanagariHindi-Italic.ttf
CSS family: "Tiro Devanagari Hindi", serif
Display size scale: 32 / 40 / 56 / 72 px
Line-height: 1.45 (Devanāgarī needs more leading than Latin)
Diacritic rendering: per `curriculum/04-devanagari-iast-conventions.md`
```

### 3.2 Literary serif — *Cormorant Garamond*

**[LOCKED]** Choice rationale: Cormorant Garamond is selected over Lora, EB Garamond, and Crimson Pro for three reasons — its italic carries Sanskrit terminology with notable elegance (`*nakṣatra*` reads as a proper scholarly term, not a styled English word); its display weights (600, 700) hold ceremonial weight without becoming theatrical; and its variable-font implementation keeps payload under control.

Used for: lesson title English, śloka translation lines (per `curriculum/04-conventions.md` §3.3 trilingual rendering), footnote-style citation lines, drop-caps on §1 hooks, the §11 90-second summary display.

```
Source: Google Fonts — load via next/font/google with subsets=['latin', 'latin-ext']
CSS family: "Cormorant Garamond", "Cormorant", serif
Weights: 400, 500, 600, 700 (and italic counterparts)
```

### 3.3 Body sans — *Inter*

Used for: body prose, UI chrome, MCQ stems, callouts, navigation labels, tabular data.

```
Source: Google Fonts — already in public/fonts/ (variable + static)
CSS family: "Inter", system-ui, sans-serif
Weights used: 400, 500, 600, 700
Body scale: 14 (caption) / 16 (body small) / 18 (body) / 20 (body emphasis) / 24 (sub-heading)
Line-height: 1.65 (generous; reading material, not UI)
Letter-spacing: -0.01em on body, 0 on UI, +0.02em on small-caps captions
Tabular figures: enabled for all numeric tables via font-feature-settings: 'tnum'
```

### 3.4 Type pairing rules

- Every śloka block renders all three registers — Devanāgarī (Tiro) + IAST (Cormorant italic) + English (Cormorant regular) — without exception. Per `curriculum/00-curriculum-constitution.md` §3.3.
- Sanskrit terms in body prose are *Cormorant italic* on first use (e.g., *nakṣatra*), then Inter on subsequent uses. Per `curriculum/02-lesson-authoring-standard.md` §6 voice rule.
- Numerals in tables are *Inter tabular figures* for column alignment.
- Drop-caps on §1 Hook openings are Cormorant 72px, in gold (see §4.2), positioned one full leading height below the paragraph's baseline.

### 3.5 Font loading strategy

**[LOCKED]**

To prevent FOUT (flash of unstyled text) on first-paint of any lesson:

1. **Inter** is loaded via `next/font/google` with `display: 'swap'` and a system-font fallback that closely matches metric (using `font-display` with adjusted-fallback). Variable axis used; weight subset 400-700.
2. **Cormorant Garamond** is loaded via `next/font/google` with `display: 'optional'` (prevents layout shift; if the font has not arrived within 100ms, the system serif renders permanently for that page-view — acceptable for the literary serif which is used for emphasis, not body).
3. **Tiro Devanagari Hindi** is loaded via `next/font/local` from `public/fonts/` with `display: 'swap'` and **preload: true** for any route that renders a śloka block. Subset is Devanāgarī Unicode range (U+0900-U+097F) plus Sanskrit Extended (U+1CD0-U+1CFF) plus punctuation. Critical-CSS includes the Tiro font-face declaration so it begins downloading on first byte of HTML.
4. **Preconnect to Google Fonts** is in the root layout for fast handshake.
5. **No web-font flash on the Cold Open (§1 Hook)** because Cold Open uses Cormorant — and Cormorant has `display: 'optional'`. The first paint of the hook may be in the system serif fallback briefly; this is the documented tradeoff for zero layout shift.

---

## 4. Color system

**[LOCKED]** for surfaces, grahas, rāśis, chapter-accent quartet (§4.7), and ink scale (v1.0 darkened the cream-muted ink for readability). **[v1.1]** for the 27 nakṣatra hues (defined when nakṣatra modules begin authoring) and for stream-badge polish (iteration after all six appear in one composition).

### 4.1 Surface system — four named surfaces

The entire learning module renders against these four surfaces. Nothing else. (Compare to Duolingo's two-surface system — green + cream. Ours has more registers because PhD content needs more registers.)

| Surface | Role | Hex | CSS token |
|---|---|---|---|
| **Deep Night** | The "sky" background of the lesson — outside the reading column, behind everything | `#0A0E1A` | `--surface-night-deep` |
| **Twilight Glass** | The card/surface that holds reading content; frosted, slight blur over deep-night | `rgba(20, 26, 44, 0.72)` + `backdrop-blur-2xl` | `--surface-twilight-glass` |
| **Manuscript Cream** | The śloka block background — looks like aged paper; only used inside §5 śloka blocks and §6 worked examples | `#F5EDD8` | `--surface-manuscript-cream` |
| **Dawn Accent** | The mastery-celebration surface; appears at section completion + lesson completion | `#F4C77B` → `#E8A85C` linear gradient | `--surface-dawn-accent` |

### 4.2 Ink (text on surface) — v1.0 readability-pass values

| Ink token | On Deep Night | On Twilight Glass | On Manuscript Cream | On Dawn Accent |
|---|---|---|---|---|
| **Primary text** | `#F2EBD8` | `#F2EBD8` | `#1A1408` | `#1A1408` |
| **Secondary text** | `#A39E8E` | `#A39E8E` | `#3D3115` *(v1.0: darker, ~8:1)* | `#3A2E14` |
| **Muted text** | `#5C5848` | `#5C5848` | `#5C4A2A` *(v1.0: darker, ~6.5:1)* | `#5A4E2E` |
| **Gold accent** | `#E8C772` | `#E8C772` | `#A8821E` | `#1A1408` |
| **Vermilion accent** (śloka emphasis, breath stops) | `#D4502E` | `#D4502E` | `#A23A1E` | `#7A2A14` |

All combinations are verified ≥ WCAG AA contrast at body size (4.5:1). For italic Cormorant body text the stricter 6:1 floor applies (see §27.2). v1.0 darkened `--gl-ink-on-cream-secondary` (from `#4A3E1F` → `#3D3115`) and `--gl-ink-on-cream-muted` (from `#6E5A38` → `#5C4A2A`) after the readability audit surfaced that italic serif text on warm parchment perceived noticeably faded at the v0.2 values even when they technically passed AA. The gold-on-glass hairline in §5.2 uses opacity `0.18` to remain visible across user displays.

### 4.3 The 9 Graha hues — **[LOCKED]**

Each planet has one canonical primary hue and one secondary tint (for backgrounds, gradients, glow). Derived from classical attribution (BPHS Grahanāmādhyāya 3.30 + Sāravalī Chapter 3 + Phaladīpikā 2.6), tested against accessibility, distinct enough to be reliably identified at 32px display size.

| # | Graha | Devanāgarī | Hue name | Primary | Secondary tint | Classical justification |
|---|---|---|---|---|---|---|
| 1 | Sūrya | सूर्य | Solar Gold | `#E8B845` | `#FFE9A8` | Royal gold, kāraka of self & soul (BPHS 3.30) |
| 2 | Candra | चन्द्र | Pearl Silver | `#5A6B8A` | `#D8DCE8` | White pearl, kāraka of mind & mother; darkened for text readability on parchment |
| 3 | Maṅgala | मङ्गल | Coral Red | `#C8412E` | `#F5BFAE` | Red, kāraka of energy & brothers; classical "blood-coloured" (`rakta-varṇa`) |
| 4 | Budha | बुध | Verdant Green | `#3A8C5A` | `#B8DCC4` | Green, kāraka of intellect & speech (`harita-varṇa`) |
| 5 | Guru | गुरु | Saffron Yellow | `#E89E2A` | `#F8D89E` | Yellow-orange, kāraka of wisdom & dharma (`pīta-varṇa`) |
| 6 | Śukra | शुक्र | Diamond White-Blue | `#4A7AA8` | `#B8D0E8` | White like diamond/silver, kāraka of love & art; darkened for text readability on parchment |
| 7 | Śani | शनि | Indigo Black | `#2C2C3E` (on light) / `#5A5A78` (on dark) | `#9494A8` | Black/indigo, kāraka of karma & limit (`nīla-varṇa`) |
| 8 | Rāhu | राहु | Smoke Slate | `#5A5C68` | `#8E909C` | "Smoky" per classical (`dhūmra-varṇa`); kāraka of māyā |
| 9 | Ketu | केतु | Ash Maroon | `#7A3E4A` | `#B88898` | Reddish-grey per classical; kāraka of mokṣa |

The hues are derived from classical attribution, not designer preference. Modifying any of these requires a constitution amendment (§28) and a justified appeal to a different classical source.

### 4.4 The 12 Rāśi hues — **[LOCKED]**

Derived from element (fire / earth / air / water) × modality (chara / sthira / dvi-svabhāva). Each rāśi gets one hue; shared families telegraph element membership.

| # | Rāśi | Element | Modality | Primary | Rationale |
|---|---|---|---|---|---|
| 1 | Meṣa (Aries) | Fire | Chara | `#D8472E` | Fire chara — vivid burning red |
| 2 | Vṛṣabha (Taurus) | Earth | Sthira | `#7A6B3E` | Earth sthira — deep ochre |
| 3 | Mithuna (Gemini) | Air | Dvi-svabhāva | `#D8C56C` | Air dvi — pale lemon |
| 4 | Karka (Cancer) | Water | Chara | `#5A8AC8` | Water chara — moving river-blue |
| 5 | Siṁha (Leo) | Fire | Sthira | `#E89E2A` | Fire sthira — solid amber |
| 6 | Kanyā (Virgo) | Earth | Dvi-svabhāva | `#A8A07A` | Earth dvi — wheat |
| 7 | Tulā (Libra) | Air | Chara | `#C8B888` | Air chara — light gold-air |
| 8 | Vṛścika (Scorpio) | Water | Sthira | `#3A4A6A` | Water sthira — still deep blue |
| 9 | Dhanus (Sagittarius) | Fire | Dvi-svabhāva | `#D87A3E` | Fire dvi — burnt orange |
| 10 | Makara (Capricorn) | Earth | Chara | `#4A4030` | Earth chara — slate-earth |
| 11 | Kumbha (Aquarius) | Air | Sthira | `#7A8AA8` | Air sthira — overcast |
| 12 | Mīna (Pisces) | Water | Dvi-svabhāva | `#5A7A8A` | Water dvi — sea |

### 4.7 Chapter accent quartet — **[LOCKED v1.0]**

Within every module, chapters 1–4 rotate through a fixed four-color sequence. This rotation is the single source of chromatic identity for chapter-level UI (eyebrow color, milestone-stone fill, lotus-petal gradient, energy-thread fill on the Sacred Path, ChapterTree dot color).

| Chapter | Token | Hex | Glyph register |
|---|---|---|---|
| 1 | `--gl-ch1-bronze` | `#C28220` | Warm sandalwood — beginnings |
| 2 | `--gl-ch2-vermilion` | `#A23A1E` | Sacred fire — second movement |
| 3 | `--gl-ch3-indigo` | `#4F6FA8` | Night-sky depth — analytical turn |
| 4 | `--gl-ch4-jade` | `#3A8C5A` | Forest green — synthesis |

Modules with a 5th or 6th chapter restart the rotation at bronze. The rotation is the same across Tier 1 and Tier 2 — tiers do not introduce new colors.

### 4.5 Stream badges — **[v1.1]**

| Stream | Hue | Glyph treatment | Used as |
|---|---|---|---|
| Parāśara | `#E8C772` (gold) | Classical maṇḍala | Default stream when not specified |
| KP | `#A8C8E8` (Venus tint) | 249-segment sub-ring | KP-tagged lessons |
| Jaimini | `#B88898` (Ketu tint) | Argala arrow | Jaimini-tagged lessons |
| Lal Kitab | `#C8412E` (Mars-coral) | "लाल" stamp in Punjabi script | Lal-Kitab-tagged lessons |
| Tājika | `#3A8C5A` (Budha-verdant) | Annual chart ring | Tājika-tagged lessons |
| Nāḍī | `#7A6B3E` (Vṛṣabha-ochre) | Palm-leaf icon | Nāḍī-tagged lessons |

These are first-draft. The full visual test is when all six badges appear in a single composition (T2-13 Multi-Domain Synthesis). Iteration follows that test.

### 4.6 Light mode policy

**[LOCKED]**

The Grahvani learning module is **dark-only**. Deep Night is the canonical surface; no light-mode counterpart exists. The rationale:

1. The brand register (§2) is sidereal. The visual world lives under a Vedic sky. A light-mode counterpart would dilute the register.
2. Manuscript Cream surfaces (§5.3) provide localised light registers within the dark frame — the śloka block reads as an illuminated page against a dark night, which is how palm-leaf manuscripts were historically encountered (by lamplight).
3. Phone-in-sunlight is mitigated through high-contrast ink choices (§4.2) — Primary ink at `#F2EBD8` on Deep Night meets WCAG AAA contrast for body text.
4. Devices with system-level dark/light toggle do not override this constitution. The Grahvani learning module renders dark on both.

Adding a light mode is a future constitution amendment (§28). Until then, dark is canonical.

---

## 5. Material system

**[LOCKED]**

Four material treatments. No others.

### 5.1 Deep Night sky background

The base layer behind everything. A subtle starfield renders via inline SVG — not animated, not parallaxed (motion sickness during long reading sessions). Stars are positioned according to actual sidereal star positions at a fixed reference epoch (1 January 2000, 12:00 UT). A quiet authenticity that PhD-track learners will eventually notice and appreciate.

```css
.surface-night {
  background: radial-gradient(ellipse at top, #0F1424 0%, #0A0E1A 70%, #06080F 100%);
  position: relative;
}
.surface-night::before {
  /* SVG starfield layer at 30% opacity; static positions from J2000 epoch */
  content: "";
  position: absolute;
  inset: 0;
  background: url("/assets/learning/starfield-j2000.svg");
  opacity: 0.30;
  pointer-events: none;
}
```

### 5.2 Twilight Glass cards

Frosted glass cards hold reading content. Visible blur, subtle hairline border, no drop shadow (shadow is too edtech-default).

```css
.surface-twilight-glass {
  background: rgba(20, 26, 44, 0.72);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid rgba(232, 199, 114, 0.18); /* gold-on-glass hairline */
  border-radius: 16px;
}
```

### 5.3 Manuscript Cream — śloka blocks and worked examples

The śloka block looks like a page from an illuminated manuscript. Aged cream paper, gold drop-caps, vermilion breath stops, subtle paper-grain texture (SVG noise overlay at 4% opacity).

```css
.surface-manuscript {
  background: #F5EDD8;
  background-image: url("/assets/learning/manuscript-grain.svg");
  background-blend-mode: multiply;
  border-radius: 8px;
  padding: 32px 40px;
  position: relative;
}
.surface-manuscript::before {
  /* gold-leaf left border, 4px wide */
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #E8C772 0%, #A8821E 100%);
  border-radius: 8px 0 0 8px;
}
```

### 5.4 Dawn Accent — mastery celebrations only

Used at section completion and lesson completion. Soft warm gradient, restrained shadow.

```css
.surface-dawn {
  background: linear-gradient(135deg, #F4C77B 0%, #E8A85C 100%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(232, 168, 92, 0.18);
}
```

---

## 6. Motion vocabulary

**[LOCKED]**

### 6.1 Easing curves

| Token | Curve | Use |
|---|---|---|
| `ease-grahvani` | `cubic-bezier(0.32, 0.72, 0.24, 1)` | Default for all standard transitions — Apple-derived |
| `ease-ceremonial` | `cubic-bezier(0.65, 0, 0.35, 1)` | Section completions, mastery celebrations — heavier weight |
| `ease-spring-soft` | `framer-motion type:"spring", stiffness:160, damping:22` | Interactive element drags (DragComparator, planet manipulation) |

### 6.2 Durations

| Use | Duration |
|---|---|
| Hover state | 120ms |
| Tap feedback | 180ms |
| Section open/close | 280ms |
| Page transitions | 360ms |
| Section completion ceremony | 600ms (two phases: fill 320ms + settle 280ms) |
| Lesson completion ceremony | 1,400ms (three phases: bloom 500ms + hold 600ms + recede 300ms) — full spec in §13 |

### 6.3 What motion is for

Motion in this product **teaches or rewards**. Motion that is decorative is removed.

Allowed motion:
- ✓ Reveal-on-scroll for §-headers (the section earns attention as it enters).
- ✓ Drag and drop in DragComparator scenes (motion *is* the learning act).
- ✓ Planet position changes in interactives (motion shows the model updating).
- ✓ Section-checkmark fill on completion (motion *is* the reward).
- ✓ The chapter mastery ceremony (motion marks the threshold crossing).

Forbidden motion:
- ❌ Decorative card fades on load.
- ❌ Parallax scrolling.
- ❌ Animated background gradients.
- ❌ Loading spinners that twirl indefinitely (use the calm loading state from §16).
- ❌ Hover bounces.

### 6.4 Reduced motion

Per `prefers-reduced-motion: reduce`:
- All of the above degrade to instant (durations → 0) or to fade-only.
- DragComparator becomes tap-to-place with no drag animation.
- Section reveal-on-scroll becomes instant.
- Mastery ceremonies become a static dawn-accent card with no bloom-hold-recede sequence.
- Interactive simulators remain manipulable (the manipulation is the learning, not the motion of the manipulation).

---

## 7. Sound vocabulary

**[LOCKED]**

The Grahvani learning module **has sound, used sparingly**. Sound is muted by default; the learner enables in a single toggle in the lesson chrome. When enabled, sound is restricted to four occasions:

1. **Correct-placement chime** in DragComparator scenes — a single low-pitched temple-bell tone (220Hz fundamental, 600ms decay).
2. **Section-completion swell** — a held tonic chord (E major, two-note open fifth, 800ms) at the moment the §-rail checkmark fills.
3. **Lesson-completion ceremony** — a three-note rising motif (C → E → G, 1.2 seconds total) during the bloom phase only. Silence during hold and recede.
4. **Optional śloka recitation audio** in RecitationFrame components (§11.4). When a recorded recitation is available for a śloka, tapping a word plays the corresponding word's audio. Recitations are commissioned from Sanskrit reciters; not generated by TTS.

**No sound is permitted on:**
- Hover events.
- Page transitions.
- Incorrect MCQ answers (the visual feedback is the cue; piling sound on it shames the learner).
- Drag-pickup, scroll, button-tap, modal-open, or any UI-chrome interaction.

**Sound assets:**
- File format: `.webm` with `.mp3` fallback for older browsers.
- Sample rate: 48 kHz, stereo.
- Loudness target: -16 LUFS integrated (matches Apple HIG recommendation for sparing UI sound).
- Storage path: `public/assets/learning/sound/<event-slug>.webm`.
- Asset library defined in §22.

**The mute toggle:**
- Lives in the lesson chrome top-right corner.
- Default state: muted (sound is opt-in).
- Persistence: per-user via localStorage; never auto-unmutes.

---

## 8. Iconography

**[LOCKED]**

The Grahvani learning module continues with **Lucide-React** (the icon library already used elsewhere in the Grahvani frontend). Rationale:

1. Visual consistency across the Grahvani product (workbench, calendar, learn) without forcing a custom icon set.
2. Lucide's restrained line-icon style sits well alongside the scholarly register — neither overdesigned nor stock-iconographic.
3. The icon palette is large enough (>1,000 icons) to cover every UI need across 2,000+ lessons without ever needing to commission custom icons mid-build.

**Lucide usage rules:**
- Default size: 20px in body, 24px in section headers, 16px in micro UI.
- Default stroke-width: 1.5 (Lucide default; do not adjust per-use).
- Color: inherits from text color. Never override to a graha hue unless the icon literally represents that graha.
- Icon-only buttons require `aria-label`.

**Icons that are NOT Lucide:**
- Graha glyphs (custom illustrations from the asset library §22; never Lucide stand-ins).
- Rāśi glyphs (custom).
- Nakṣatra glyphs (custom).
- Vedāṅga glyphs (custom — Lesson 1 asset L1-A7).
- Stream badges (custom).

The boundary is firm: Lucide handles UI chrome; custom assets handle pedagogical iconography.

---

## 9. Layout grammar — the 12-section choreography

**[LOCKED]**

Every lesson renders in this canonical sequence. The 12 sections of `curriculum/02-lesson-authoring-standard.md` map onto these visual phases.

```
┌──────────────────────────────────────────────────────────────────┐
│  COLD OPEN  ← §1 Hook                                            │  Full-bleed, deep-night, display
│  ─────────────────────────────────────                           │  typography. The question lands.
│                                                                  │  No chrome visible. Scroll to begin.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  ORIENTATION  ← §2 What you should know first                    │  Twin twilight-glass cards,
│                ← §3 What you'll be able to do                    │  side-by-side on desktop, stacked
│                                                                  │  on mobile. Quiet, brief.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  CONCEPT THEATRE  ← §4 Body, broken into sub-concepts            │  Each sub-concept gets:
│                                                                  │   - prose paragraph(s)
│                                                                  │   - its own interactive scene
│                                                                  │   - the "things I see" prompt
│                                                                  │  Read, then play. Read, then play.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  CLASSICAL AUTHORITY  ← §5 Śloka block                           │  Manuscript-cream surface.
│                                                                  │  Devanāgarī (Tiro display) +
│                                                                  │  IAST (Cormorant italic) +
│                                                                  │  English (Cormorant regular).
│                                                                  │  Gold drop-cap, vermilion accents.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  WORKED NARRATIVE  ← §6 Worked examples                          │  Step-revealed narrative.
│                                                                  │  Reader clicks "next step" to
│                                                                  │  advance — agency of the learner
│                                                                  │  is preserved.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  PRIMARY SIMULATOR  ← §7 Interactive component                   │  The biggest interactive of the
│                                                                  │  lesson. Full focus. Prompts to
│                                                                  │  "try this" appear alongside.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  MISTAKE PROTECTION  ← §8 Common mistakes                        │  Flippable cards. Front: the
│                                                                  │  mistake. Flip: why it happens.
│                                                                  │  Flip again: how to avoid.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  MEMORY ANCHORS  ← §9 Things to remember                         │  Flippable cards. Front: the
│                                                                  │  principle. Flip: the proof or
│                                                                  │  citation. Auto-added to SR deck.
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  MASTERY GATE  ← §10 MCQs                                        │  Full-screen quiz flow.
│                                                                  │  Detailed spec in §13.                  │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  COMPRESSION  ← §11 Summary in 90 seconds                        │  Display-typography recap.
│                                                                  │  Specific layout in §9.4.               │
└──────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────────────────────────────────┐
│  CONTINUATION  ← §12 Citations & further reading + next lesson   │  Bibliography rendered with
│                                                                  │  scholarly care. Next-lesson
│                                                                  │  ceremony: see §9.5.                    │
└──────────────────────────────────────────────────────────────────┘
```

### 9.1 The section progress rail

Down the left edge (desktop) / collapsed under a hamburger (mobile), a vertical rail shows all 12 sections grouped into four phases per `curriculum/01-pedagogical-framework.md` §3 (7E mapping):

- **Start** (§1, §2, §3) — Elicit + Engage
- **Learn** (§4, §5, §6, §7) — Explore + Explain + Elaborate
- **Practice** (§8, §9, §10) — Evaluate
- **Finish** (§11, §12) — Extend

**Rail visual specification:**
- Width: 80px on desktop, hidden behind hamburger on mobile.
- Vertical alignment: anchored top at 120px from viewport top; scrolls with page only when its bottom is at 24px from viewport bottom.
- Section node: 12px diameter circle. Filled `#E8C772` (gold) when complete, hairline outline `rgba(232, 199, 114, 0.40)` when ahead, pulsing fill `#E8C772` at 80% opacity when current.
- Connector line between nodes: 2px wide, `rgba(232, 199, 114, 0.18)` when both adjacent are incomplete, `#E8C772` when above-section is complete.
- Hover state on a node: scales to 16px, surfaces a tooltip with `§N — Section Name`.
- Focus state (keyboard): a 2px gold ring at 4px offset, surfaces the same tooltip via `aria-describedby`.
- Click/tap: scrolls smoothly to that section, focuses its heading.
- Phase labels (Start / Learn / Practice / Finish) appear at the rail's left margin in small-caps Inter 11px gold-muted, only on hover-over-rail.

**Long-lesson behavior:**
- If a lesson has sub-section interactives within §4 (e.g., 4 scenes), the rail shows §4 as a single node that expands on hover/focus to reveal 4 child nodes (§4.1, §4.2, …). Click any to scroll. The expanded state persists while §4 is the active or hovered section.

### 9.2 Reading column width

Body prose reads at **640px max-width** on twilight-glass surface, centered, with 80px side padding. This is the Stripe-Docs reading-comfort width.

Interactives may break out to 960px when they need horizontal space. Manuscript Cream śloka blocks remain at 640px (manuscripts are vertical, not wide).

### 9.3 The reflection prompt — "things I see"

**[LOCKED]**

Embedded after each Concept Theatre interactive scene. Operationalises the 7E **Explore → Explain** transition per `curriculum/01-pedagogical-framework.md` §3.

Visual specification:
- A small twilight-glass card, 480px max-width, with a thin gold left border (2px).
- Heading: "What do you notice?" in Cormorant italic 22px gold.
- Body: 2-3 specific observation prompts in Inter 16px primary text. Generic "what do you see?" is forbidden; prompts must be specific to the interactive's pedagogical point.
- Below: an optional free-text input. Placeholder: "Type a sentence in your own words (optional)…". Inter 16px. The input is voluntary; the learner is not gated on submitting.
- Below input: a single ghost button "Continue to next concept" in gold outline, becomes filled gold once the learner has either (a) typed and submitted any input, or (b) clicked "skip reflection".
- Submitted reflections are stored per-learner per-lesson and surfaced in the §11 summary view ("Your own words: …") — closing the observation→articulation→consolidation loop.

Example prompts (Lesson 1 Scene 1 — The Vedic Body):
- "Which Vedāṅga's body-part role surprises you most, and why?"
- "If Jyotiṣa is the *eye*, what does that imply about its function relative to the other limbs?"
- "Try restating in your own words: why does the Veda need 'limbs' at all?"

### 9.4 The §11 90-second summary layout

**[LOCKED]**

The §11 Summary in 90 seconds renders as **three Cormorant display cards in a 3-up grid (desktop) or stack (mobile)**, each containing one compressed principle from the lesson.

Specific layout:
- Card 1: The **central claim** of the lesson, in Cormorant 28px primary text, 1-2 sentences.
- Card 2: The **classical anchor** — the named source and one-line attribution, in Cormorant italic 22px secondary text.
- Card 3: The **operational takeaway** — what the learner can now do, in Inter 18px primary text, 1-2 sentences.

Below the 3-card grid: a single line in Cormorant italic 18px muted: "Your reflection on this lesson:" followed by any reflections the learner submitted during Concept Theatre (collapsed by default; expandable).

Below that: the gold-outlined "Begin next lesson" button (§9.5 continuation ceremony).

### 9.5 The §12 continuation ceremony

**[LOCKED]**

After the §11 summary cards, the §12 bibliography renders in a quiet scholarly footer (Cormorant 14px muted ink, citation-style hanging indents, primary sources before modern). Below the bibliography:

- A horizontal gold-leaf divider, 240px wide, centered, 8px tall.
- A line in Cormorant italic 24px gold: *"Now you are ready for:"*
- The next lesson title, in Cormorant 32px primary text.
- The next lesson subtitle, in Cormorant italic 18px secondary.
- A single button "Begin" in dawn-accent (this is one of the few places dawn-accent appears outside of celebrations — the ceremony marks the threshold crossing into the next lesson).
- Below: a secondary text-button "Return to curriculum map" in Inter 14px muted.

If this is the last lesson of a chapter, the language changes to: *"Chapter complete. You have mastered:"* and a 3-anchor compression of the chapter follows before the "Begin next chapter" button.

---

## 10. Interactive components — taxonomy alignment

**[LOCKED]**

The Grahvani learning module's interactive components conform to the **8-family taxonomy defined in `curriculum/05-interactive-component-taxonomy.md`**:

- **A. Manipulators** — change a parameter, observe the consequence
- **B. Visualisers** — see a static fact rendered spatially
- **C. Calculators** — reproduce a classical computation step-by-step
- **D. Navigators** — traverse a complex structure
- **E. Comparators** — place two or more configurations side-by-side
- **F. Synthesisers** (T2 only) — build up a multi-domain reading
- **G. Rectifiers** (T2 only) — adjust an unknown to fit known events
- **H. Quizzers** — in-context micro-assessment within a simulator

Each interactive component is specced as a separate file in `curriculum/interactive-specs/<component-slug>.md` following the spec template in `curriculum/05-taxonomy.md` §3. Lessons reference specs by file path in their front matter.

### 10.1 Lesson 1 interactive components

Lesson 1 requires four interactive components. The spec files are drafted alongside this constitution and live in `curriculum/interactive-specs/`:

| Component slug | Family | Spec file | Purpose |
|---|---|---|---|
| `vedanga-body-map` | B. Visualiser | `curriculum/interactive-specs/vedanga-body-map.md` | Visualise the six Vedāṅgas at their classical body-part metaphors; tap to reveal name, function, citation. |
| `vedanga-vs-vedanta-comparator` | E. Comparator | `curriculum/interactive-specs/vedanga-vs-vedanta-comparator.md` | Drag-place term cards into Vedāṅga or Vedānta columns; the discrimination is the learning act. |
| `vedic-ecosystem-orbital` | B. Visualiser | `curriculum/interactive-specs/vedic-ecosystem-orbital.md` | Four Vedas at center, six Vedāṅgas orbiting, time-slider scrubs from Lagadha (1400 BCE) to Pingree (1981). |
| `sloka-recitation-frame` | B. Visualiser | `curriculum/interactive-specs/sloka-recitation-frame.md` | Manuscript-cream śloka surface with tap-to-gloss word interactions; supports optional audio recitation playback. |

Each spec includes pedagogical purpose, inputs, outputs, Astro Engine endpoints (or none, for content-only components), pre-computation strategy, UI/UX requirements, pedagogical guardrails, accessibility, and engineering notes.

### 10.2 Adding new interactive component types

When a future lesson requires an interactive type not yet in `05-taxonomy.md`:

1. The lesson author drafts a spec following the §3 template.
2. The spec is filed in `curriculum/interactive-specs/<slug>.md`.
3. The component is added to the relevant family (A through H) in a future amendment to `05-taxonomy.md`.
4. Engineering builds the component per the spec.
5. Lesson references the spec by file path in front matter.

This constitution does **not** invent its own interactive vocabulary. The curriculum's `05-taxonomy.md` is canonical.

---

## 11. Lesson chrome primitives

**[LOCKED]**

These are the UI primitives that render the 12-section template of every lesson. They are **not** pedagogical interactives (those belong to §10); they are the structural components of every lesson page.

### 11.1 Section-host primitives

- `<ColdOpen>` — §1 Hook full-bleed display.
- `<OrientationCards>` — §2 + §3 twin twilight-glass.
- `<ConceptTheatre>` — §4 body container; renders sub-concept blocks with embedded interactives and reflection prompts.
- `<SlokaBlock>` — §5; renders Devanāgarī + IAST + English via the `<Sloka>` typography primitive against Manuscript Cream.
- `<WorkedExample>` — §6 step-revealed narrative.
- `<PrimarySimulator>` — §7 host frame for the lesson's biggest interactive (the actual interactive is loaded from `curriculum/interactive-specs/`).
- `<MistakeCardDeck>` — §8 flippable-card array.
- `<MemoryAnchorDeck>` — §9 flippable-card array; auto-feeds the spaced-repetition deck.
- `<MCQFlow>` — §10 mastery gate; detailed spec in §13.
- `<Summary>` — §11 three-card compression per §9.4.
- `<Continuation>` — §12 bibliography + next-lesson ceremony per §9.5.

### 11.2 Layout primitives

- `<LessonShell>` — top-level lesson route component. Manages section scrolling, progress rail, mastery state, sound toggle, lesson-progress mutation.
- `<SectionRail>` — vertical progress rail per §9.1.
- `<TwilightCard>` — standard reading surface card.
- `<ManuscriptPage>` — Manuscript Cream surface for śloka blocks and worked examples.
- `<DawnCelebration>` — section / lesson completion ceremony surface.
- `<MuteToggle>` — sound on/off per §7.
- `<ReflectionPrompt>` — the "things I see" prompt component per §9.3.

### 11.3 Typography primitives

- `<Devanagari>` — wraps Tiro Devanagari Hindi; handles line-height and IAST sibling layout.
- `<IAST>` — Cormorant italic with proper Unicode diacritic rendering (per `curriculum/04-conventions.md`).
- `<Sloka>` — composes Devanagari + IAST + English in the locked trilingual layout.
- `<DropCap>` — first-letter ornament for §1 hooks.
- `<TermTooltip>` — Sanskrit terms wrapped on first use; surface gloss + IAST + audio (if available) on tap/hover. Links to `app_knowledge` schema for the canonical term definition.

### 11.4 Reading-surface primitives

- `<Citation>` — renders one citation in the academic register defined in `curriculum/03-source-citation-standard.md`. Primary classical sources get a slightly different visual treatment than modern academic sources.
- `<Bibliography>` — renders a list of citations in §12 with scholarly hanging-indent.

### 11.5 What is NOT a chrome primitive

The following are **interactive components** (per §10) and live in `curriculum/interactive-specs/`, not in this list:

- `vedanga-body-map`, `vedanga-vs-vedanta-comparator`, `vedic-ecosystem-orbital`, `sloka-recitation-frame` (Lesson 1)
- `chart-planet-positioner`, `time-slider`, `ayanamsa-toggle`, `aspect-ray-diagram`, etc. (used by later modules)

Engineering wraps each interactive component at runtime — the chrome primitive `<PrimarySimulator>` hosts the loaded interactive but does not define its behavior.

---

## 12. Mastery flow — the §10 MCQ specification

**[LOCKED]**

This section gives the §10 MCQ flow the visual and behavioral detail it needs. Conforms to `curriculum/06-assessment-design-standard.md`.

### 12.1 Question screen

- One question per screen. No "next question" scrollable list.
- Layout: centered single column, 720px max-width on desktop.
- Surface: Twilight Glass card with gold hairline border.
- Question stem: Cormorant 24px primary text. Up to 3 lines; if longer, the stem is too complex (per `curriculum/06-assessment-standard.md` §3 question-length guidance).
- Below stem: a gold horizontal divider, 80px wide, centered, 1px tall, 24px vertical gap.
- Answer options: 4 options minimum, 5 maximum (per `curriculum/06-assessment-standard.md` §4). Each option is a card:
  - Card surface: Twilight Glass with 1px outline `rgba(232, 199, 114, 0.20)`.
  - Card padding: 20px horizontal, 16px vertical.
  - Letter indicator (A / B / C / D) in Cormorant 18px gold, left-aligned.
  - Option text in Inter 18px primary, generous line-height 1.65.
  - Hover state: outline brightens to `rgba(232, 199, 114, 0.50)`; cursor pointer.
  - Selected state: outline becomes solid `#E8C772`, card background becomes `rgba(232, 199, 114, 0.08)`.
  - Disabled state (after submission): selected option shows full state per §12.2; other options dim to 50% opacity.
- Below options: a single "Check answer" button in dawn-accent gold; disabled until an option is selected.

### 12.2 Right-answer feedback

When the learner selects the correct option and presses "Check answer":
- The selected option's outline turns Verdant Green (`#3A8C5A` — Budha hue, used here to signal correctness).
- A small Lucide `Check` icon (20px) fades in at the top-right of the selected card.
- Below the question, an expandable card slides in (280ms ease-grahvani):
  - Heading: "Why this is right" in Cormorant italic 20px gold.
  - Body: the right-answer explanation from the MCQ JSON, in Inter 18px primary.
  - If `curriculum/06-assessment-standard.md` §6 requires citation, the citation appears below in Cormorant 14px muted, with the standard `<Citation>` primitive.
- The "Check answer" button morphs (320ms ease-grahvani) into "Continue" — same gold-filled style.

### 12.3 Wrong-answer feedback

When the learner selects a wrong option:
- The selected option's outline turns Coral Red (`#C8412E` — Mars hue, used here to signal incorrectness — never harsh tabloid red).
- A small Lucide `X` icon (20px) fades in at the top-right of the selected card.
- The correct option's outline simultaneously turns Verdant Green (`#3A8C5A`) and shows the Check icon — so the learner immediately knows where right was.
- Below the question, the expandable card slides in:
  - Heading: "Why each wrong is wrong" in Cormorant italic 20px gold.
  - For each wrong option (including the one the learner selected), a sub-block:
    - The wrong option text in Inter 16px secondary.
    - Below: the wrong-answer explanation in Inter 17px primary.
    - The learner's chosen wrong option gets a subtle gold left border (4px) to distinguish.
  - Then below: "Why this is right" sub-block for the correct option.
- The "Check answer" button morphs to "Continue" as above.
- **No sound on wrong answer** (per §7).
- **No penalty for wrong answer** in this attempt. The wrong answer counts toward the attempt's percentage, but the learner continues through all questions before mastery is judged.

### 12.4 Question progression

- After the explanation card, the "Continue" button advances to the next question.
- A small progress indicator at the top: "Question 3 of 6" in Inter 14px secondary.
- The expandable explanation card remains in the question's frame even after Continue — when the learner clicks Continue, the next question's frame replaces this one entirely with a 280ms fade.
- The learner cannot go back to previous questions within an attempt (per `curriculum/06-assessment-standard.md` §7 — prevents triangulation gaming).

### 12.5 End-of-attempt — pass screen (≥ 80%)

- Surface: Dawn Accent gradient.
- Heading: Cormorant 40px primary: *"Mastered."*
- Sub: Cormorant italic 22px secondary: "You scored {X} of {Y} correctly."
- Below: a list of any wrong questions, each showing the question + the right answer + a one-sentence reinforcement. Format: Inter 16px primary text.
- A line in Cormorant italic 18px gold-muted: *"These few wrong answers will return to you in spaced repetition over the coming days."*
- Below: dawn-gold "Continue to §11 Summary" button.
- The §10 rail node fills with gold and shows the Check icon. The §11 + §12 rail nodes unlock.

### 12.6 End-of-attempt — cooldown screen (< 80%)

- Surface: Twilight Glass (deliberately NOT dawn-accent — this is not a celebration).
- Heading: Cormorant 36px primary: *"Not yet."*
- Sub: Cormorant italic 22px secondary: "You scored {X} of {Y}. Mastery requires 80% or higher."
- Below: a thoughtful paragraph in Inter 17px primary:
  > *"This is not a setback. The questions you missed are the exact questions worth returning to. Take the next 24 hours to re-read the lesson sections relevant to those misses (we've highlighted them on the rail). Tomorrow at this time you may attempt the quiz again."*
- A list of missed questions, each showing the question text, the right answer (now revealed), the one-sentence reinforcement, and a "Return to lesson §N" link that scrolls to the relevant section.
- A countdown timer in Cormorant 28px gold: *"Next attempt available in: 23h 47m 12s."*
- The countdown is real-time; the page does not auto-refresh at zero, but the "Try again" button (currently disabled gold-outline) becomes active dawn-gold at zero.
- The §10 rail node shows a soft warning-amber color (`#E8A85C`, the recede-end of dawn-accent) — visible but not alarming.

The 24-hour cooldown is enforced server-side. The learner cannot game the countdown by changing the device clock.

---

## 13. Mastery celebrations — detailed specification

**[LOCKED]**

Three ceremony types, in increasing weight: section completion, lesson completion, chapter completion. Each has a specific bloom-hold-recede choreography.

### 13.1 Section completion (per-section, after the learner finishes interacting with each §)

The simplest ceremony. Marks the moment a §-rail node fills.

- **Bloom** (320ms ease-ceremonial): the §-rail node scales from 12px to 18px while its fill saturates from outline to solid gold (`#E8C772`). A faint gold pulse ring (1px) expands from the node to 32px and fades, 320ms.
- **Settle** (280ms): the node scales back to 12px solid gold; the connector line below it (to the next §-node) fills from `rgba(232, 199, 114, 0.18)` to `#E8C772`.
- No sound unless §7 sound is enabled, in which case the section-completion swell plays.
- No screen-level disruption — the learner is still reading or interacting, and the rail celebration is peripheral. Total duration 600ms.

### 13.2 Lesson completion (after §10 mastery pass + §11 + §12 reviewed)

The substantial ceremony. Marks the lesson as mastered.

- **Bloom** (500ms ease-ceremonial): the entire §-rail's 12 nodes simultaneously pulse outward (each scales 12px → 16px → 12px in 500ms). At the same time, a Dawn Accent radial gradient fades in from the page center, 0% → 18% opacity over 500ms.
- **Hold** (600ms): full state holds. A line of Cormorant 28px gold fades in centered over the page: *"Lesson mastered."* Below it, in Cormorant italic 20px secondary: the lesson title in Devanāgarī + English. Below that, a small gold mandala mark (custom asset L0-M1 — the canonical "lesson-mastered" mark) fades in at 80px.
- **Recede** (300ms ease-grahvani): the radial gradient fades back to 0%. The mastered-line stays. The §-rail nodes settle to their gold-filled state. The §-rail's connector lines all show full gold.
- Sound: the three-note rising motif (C → E → G, 1.2s) plays during bloom only if §7 sound is enabled.
- Below the mastered-line: the §9.5 Continuation ceremony begins — bibliography, "Now you are ready for:", next-lesson title, "Begin" button.

### 13.3 Chapter completion (after the last lesson of a chapter is mastered)

The largest ceremony. Marks chapter-level mastery.

- All of §13.2 first.
- Then, after the recede, a chapter-mastery overlay slides up from the bottom of the viewport (640ms ease-ceremonial):
  - Surface: Dawn Accent gradient, full-bleed within a 720px column.
  - Heading: Cormorant 48px primary: *"Chapter complete."*
  - Sub: Cormorant italic 24px secondary: the chapter title in Devanāgarī + English.
  - A 3-anchor compression of the chapter's central claims, each in a small Dawn Accent card.
  - The classical-source anchor of the chapter (1-2 primary sources).
  - A "Begin next chapter" button in deep-night-on-dawn-gold (inverted button style for this ceremony only — the chapter ceremony is the only place this inversion appears).
  - A secondary "Return to curriculum map" text-button in Inter 14px muted.
- Below the overlay: a row of small mandala marks (one per lesson in the completed chapter), each gold-filled — a visual record of the journey.

### 13.4 Tier completion (after the Tier 1 / Tier 2 exit exam is passed)

Specced separately when tier exam authoring begins (Wave 5+). The ceremony is more substantial — likely a full-screen overlay with the Tier Certificate preview, a list of all 24 modules completed, and the option to download the certificate PDF.

---

## 14. UI primitive library (consolidated list)

**[LOCKED]**

Cross-reference of every primitive component the runtime requires. Each is built once and reused across all 2,000+ lessons. The list is canonical; new primitives require constitution amendment.

### 14.1 Layout
`<LessonShell>`, `<SectionRail>`, `<TwilightCard>`, `<ManuscriptPage>`, `<DawnCelebration>`, `<MuteToggle>`

### 14.2 Section hosts
`<ColdOpen>`, `<OrientationCards>`, `<ConceptTheatre>`, `<SlokaBlock>`, `<WorkedExample>`, `<PrimarySimulator>`, `<MistakeCardDeck>`, `<MemoryAnchorDeck>`, `<MCQFlow>`, `<Summary>`, `<Continuation>`

### 14.3 Typography
`<Devanagari>`, `<IAST>`, `<Sloka>`, `<DropCap>`, `<TermTooltip>`

### 14.4 Reading surface
`<Citation>`, `<Bibliography>`, `<ReflectionPrompt>`

### 14.5 Loading & error states
`<LessonLoadingFrame>`, `<SectionLoadingPlaceholder>`, `<InteractiveErrorBoundary>`, `<NetworkErrorBanner>`, `<OfflineNotice>` — specifications in §16.

### 14.6 Iconography
Lucide-React as the icon library; usage rules in §8.

---

## 15. Accessibility floor

**[LOCKED]**

- All text meets WCAG AA contrast at minimum (4.5:1 for body, 3:1 for ≥18pt or 14pt-bold).
- All interactives have keyboard equivalents (Tab, arrow keys, Enter, Space).
- Drag-and-drop interactives expose a tap-to-place fallback that is tested independently.
- All Devanāgarī text carries `lang="sa"` for screen readers; IAST carries `lang="sa-Latn"`.
- All images and diagrams have descriptive alt text (per `curriculum/02-lesson-authoring-standard.md` §7).
- `prefers-reduced-motion: reduce` is respected (§6.4).
- Mobile-first: every lesson is usable on a 360px-wide viewport. Interactives reflow or expose a "view in landscape" hint where necessary (per `curriculum/05-taxonomy.md` §3 spec item 7).
- Color is never the only carrier of meaning. Pattern + shape + label always accompany hue.
- Focus visible on every interactive element (2px gold ring at 4px offset).
- Skip-link at top of every lesson: "Skip to lesson content" (jumps past the rail to §1 Hook).
- ARIA live regions for: MCQ feedback, section-completion ceremony announcement, lesson-completion announcement.
- All audio (sound vocabulary §7) is opt-in; muting persists.

---

## 16. Empty, loading, and error states

**[LOCKED]**

Every state that is not the happy-path render has a designed treatment.

### 16.1 Lesson-loading state (initial page load)

- Surface: Deep Night with starfield.
- Center: a small gold mandala mark (the same L0-M1 mastery mark, here at 64px) gently pulses (opacity 0.4 → 0.7 → 0.4 in 1,800ms, ease-grahvani, infinite).
- Below: Cormorant italic 20px gold-muted: *"Loading the sidereal sky…"*
- After 4 seconds, the message changes to: *"Still here. Astro Engine is preparing the chart computations."*
- After 10 seconds, an additional line: *"If this persists, your connection may be slow. The lesson will appear when it is ready."*

### 16.2 Section-loading placeholder (within a rendered lesson)

When a §-section is being lazily fetched (e.g., the §7 PrimarySimulator's component is downloading):
- Skeleton outlines of the expected layout, in twilight-glass-with-shimmer.
- No spinners.
- Replaced by real content as soon as available (no extra fade — the content just is).

### 16.3 Interactive component error

When a `curriculum/interactive-specs/`-spec'd component fails to load or crashes:
- Caught by `<InteractiveErrorBoundary>`.
- Surface: Twilight Glass with Coral Red hairline border (signals problem state).
- Heading: Cormorant 22px primary: *"This interactive could not load."*
- Body: Inter 16px primary — short, calm, no jargon: *"You can still complete the lesson. The reading above contains everything needed to answer the §10 questions. Try this interactive again in a few minutes if you'd like to explore it."*
- A small "Try again" button (gold-outline) and a "Report this issue" link (Inter 14px secondary, muted).
- The error is logged to Sentry with the lesson slug + component slug + error stack.
- The lesson's mastery flow is **not blocked** by an interactive error. The learner can still pass §10.

### 16.4 Network error (during MCQ submission, progress save, etc.)

- A non-blocking banner slides down from the top of the viewport.
- Surface: Twilight Glass with Coral Red hairline.
- Inter 16px primary: *"Could not save your progress. We'll try again in a moment."*
- The runtime retries automatically (exponential backoff: 2s, 5s, 15s, 60s).
- On successful retry: the banner slides up and disappears.
- If retry exhausts: the banner persists with a "Reload page" button. The learner's in-memory progress is preserved across reloads via localStorage.

### 16.5 Offline state

When the browser reports `navigator.onLine === false`:
- A persistent small chip in the top chrome: a Lucide `WifiOff` icon + "Offline" in Inter 14px gold-muted.
- The lesson body remains fully readable (it was already loaded).
- Interactives that depend on Astro Engine show a per-component "Compute live when online" placeholder (per `curriculum/05-taxonomy.md` §6).
- §10 MCQ submission is queued locally; submits when connectivity returns.

### 16.6 Empty data state (e.g., lesson not yet authored)

If a learner reaches a lesson whose markdown body is empty or the lesson is `authoring_status: draft`:
- A respectful holding page rather than a 404.
- Surface: Twilight Glass.
- Heading: Cormorant 28px primary: *"This lesson is still being authored."*
- Body: a 2-line note about when the curriculum's wave-build expects this lesson, and a button to return to the curriculum map.
- For Wave 0-3 learners (internal preview), drafts are visible with a "Draft" badge; for production, drafts are hidden from the route entirely.

---

## 17. Internationalization readiness

**[LOCKED]**

The Grahvani learning module ships in English with Devanāgarī ślokas as canonical. Hindi (and possibly Tamil / Telugu / Kannada / Bengali) translations follow in later curriculum waves per the curriculum constitution open questions. The UI primitives are built for this from day one.

### 17.1 Required from day one (Phase B and onward)

1. **Every user-facing string lives in a translation catalog** (`frontend/src/i18n/locales/<lang>.json`) keyed by namespace. No hardcoded English in components.
2. **String catalog structure:**
   - `chrome.muteToggle.tooltip`
   - `mcqFlow.checkAnswer`
   - `mcqFlow.continue`
   - `mcqFlow.mastered`
   - `mcqFlow.notYet`
   - `continuation.nowYouAreReadyFor`
   - `reflectionPrompt.heading` ("What do you notice?")
   - `loading.lesson` ("Loading the sidereal sky…")
   - `loading.lessonStillWaiting` ("Still here. Astro Engine is preparing…")
   - …and so on for every user-facing string.
3. **Lesson body content** lives separately — markdown bodies are per-locale files (`lesson-01-jyotisha-as-vedanga.md` in English, `lesson-01-jyotisha-as-vedanga.hi.md` in Hindi, etc.). The translation cadence is governed by the curriculum side.
4. **MCQ banks** — per-locale JSON files (`jyotisha-as-vedanga.json` English, `jyotisha-as-vedanga.hi.json` Hindi). Same structure, translated text.
5. **Sanskrit and IAST never translate.** The Devanāgarī line and IAST line of every śloka are identical across all UI locales. Only the English translation has locale-specific variants (English / Hindi / Tamil / etc.).
6. **Date and number formatting** uses `Intl.DateTimeFormat` and `Intl.NumberFormat` with the active locale.
7. **Right-to-left script support** is not required for the curriculum's planned languages (Devanāgarī, Latin, Tamil, Telugu, Kannada, Bengali are all LTR). RTL would only matter if Urdu were added later.

### 17.2 Library selection

`next-intl` is the recommended library for Next.js 16. It supports server-component translation, message catalogs, and ICU pluralization. To be confirmed in Phase B build.

### 17.3 Translation-not-yet-available behavior

If a learner has selected Hindi but a lesson is not yet translated:
- A non-blocking chip at the top of the lesson: *"This lesson is not yet available in हिन्दी. Reading in English; Sanskrit ślokas are unchanged."* with a "Switch back to हिन्दी for other lessons" link.
- The lesson body renders in English; no auto-translation by LLM (rejected — quality unreliable, classical citation rigour would suffer).

---

## 18. Telemetry and analytics

**[LOCKED]**

Per `curriculum/05-taxonomy.md` §12.5, the runtime captures:

### 18.1 Lesson-level events

- `lesson.opened` — lesson_slug, timestamp, learner_id (if logged in)
- `lesson.section_completed` — lesson_slug, section_number, time_spent_ms
- `lesson.section_skipped` — lesson_slug, section_number (scrolled past without dwelling)
- `lesson.completed` — lesson_slug, total_time_ms, mastery_score
- `lesson.exited_before_mastery` — lesson_slug, last_section_reached, time_in_lesson_ms

### 18.2 Interactive-level events

- `interactive.opened` — component_slug, lesson_slug
- `interactive.action` — component_slug, action_type (e.g., "planet-dragged", "card-flipped", "word-tapped"), action_value, timestamp
- `interactive.completed` — component_slug, lesson_slug (where "completed" has a per-component definition, e.g., all-cards-placed for a DragComparator)
- `interactive.abandoned` — component_slug, time_engaged_ms

### 18.3 MCQ-level events

- `mcq.question_shown` — lesson_slug, question_id, attempt_number
- `mcq.question_answered` — lesson_slug, question_id, chosen_option, is_correct, time_to_answer_ms
- `mcq.attempt_completed` — lesson_slug, attempt_number, score_pct, passed (bool)
- `mcq.cooldown_started` — lesson_slug, scheduled_unlock_at

### 18.4 Reflection events

- `reflection.submitted` — lesson_slug, section_number, reflection_length_chars (the text content is stored separately, opt-in via privacy controls — see §18.6)
- `reflection.skipped` — lesson_slug, section_number

### 18.5 Mastery flow events

- `mastery.section_celebrated` — section_number
- `mastery.lesson_celebrated` — lesson_slug
- `mastery.chapter_celebrated` — chapter_slug

### 18.6 Privacy and learner choice

- All telemetry is **opt-in** at account creation; can be revoked at any time.
- Reflection text content is stored encrypted-at-rest, scoped per-learner, never combined into aggregate analytics that could be re-identified.
- Per `curriculum/05-taxonomy.md` §12.2, learner birth charts (when used in simulators) are never aggregated.
- Telemetry powers (a) Wave 7+ improvements via failure clustering, (b) per-learner spaced-repetition tuning, (c) cohort-level retention analysis. No third-party advertising attribution.

### 18.7 Implementation

Events emit to the learning-service backend via a single `/learn/telemetry/event` endpoint (batched on the frontend, flushed on visibility-change or every 30s). Server-side, events stream into a per-event table; daily aggregations populate dashboard views consumable by the curriculum team.

---

## 19. Asset library specification

**[LOCKED]** for Lesson 1 prompts. **[FOUNDER]** for the library-wide assets (graha portraits, rāśi illustrations, nakṣatra deities) which are scheduled as a separate prompt sheet authored once Lesson 1 visual register is validated.

### 19.1 Visual style brief — prepended to every generation prompt

Every asset must conform to a single visual register. The following brief is prepended to every prompt sent to Gemini, ChatGPT-image, or Midjourney:

> **Style brief** — *"Scholarly manuscript-illumination crossed with sidereal-cosmic luminosity. Inspired by classical Indian palm-leaf manuscripts and Mughal-era miniature painting, modernised for digital reading. Color palette: deep night-sky background (#0A0E1A) with warm gold accents (#E8C772), vermilion highlights (#D4502E), and parchment cream details (#F5EDD8). Never cartoonish. Never astrology-stock-photo. Never neon. Never Western zodiac glyphs as primary symbols — use distinctive Grahvani-original iconography. The output should sit comfortably on a deep navy (#0A0E1A) background. Flat illustration with subtle gold-leaf texture, not photorealistic, not 3D-rendered, not stock vector. Aspect ratio per specification. Transparent background where the spec calls for it. Subject occupies 70% of frame, centered, with breathing room. Mood: ceremonial, considered, reverent — like the frontispiece of a research manuscript on Vedic Astronomy."*

### 19.2 Lesson 1 — required assets (revised prompts with directive specificity)

The audit of v0.1 identified prompts that would produce coin-flip outputs. The following are tightened to a level where one Gemini generation should land the brief.

#### L1-A1 — The Vedic Body composite

**Format:** SVG-preferred (else PNG @ 3x). **Aspect:** 3:4 portrait. **Display size:** 480 × 640 px (renders at half scale on retina; expects 960 × 1280 source).

**Prompt** *(append to §19.1 style brief)*:

> "Compose a full-body, front-facing figure of a Vedic scholar — adult, age approximately 40, gender-ambiguous (slim build, no facial hair, hair tied in a topknot, neutral expression). Standing posture, arms relaxed at sides, palms visible. Robe: traditional Indian unstitched cloth in two layers, lower garment cream/parchment color with subtle gold thread, upper-body cloth slung diagonally across left shoulder in the *upavīta* manner, in deeper saffron-gold (#E89E2A) with subtle classical patterning. Bare feet visible. The figure should be drawn to fill ~85% of frame height, centered horizontally.
>
> Six luminous gold (#E8C772) markings indicate the six Vedāṅgas at their classical body-part metaphors. Each marking is a stylized symbolic glyph (NOT text) at the correct body part:
> 1. NOSE — a stylized breath wave (Śikṣā)
> 2. RIGHT HAND — a stylized ritual ladle (Kalpa)
> 3. MOUTH — a stylized akṣara flourish (Vyākaraṇa)
> 4. LEFT EAR — a stylized sound-ripple (Nirukta)
> 5. RIGHT FOOT — a stylized metrical foot pattern (Chandas)
> 6. THIRD EYE position (between the eyebrows) — a stylized star-cluster (Jyotiṣa) — this glyph is noticeably brighter and larger than the other five, emitting a soft warm halo.
>
> The figure's eyes are gently closed. The third-eye Jyotiṣa glyph contains a tiny eight-pointed sidereal star pattern in its center (visible only on close zoom).
>
> Background: deep night sky (#0A0E1A) with a sparse, static starfield (small white dots, ~20-30 total). NO foreground elements behind or beside the figure. NO text, NO Devanāgarī labels in the image (labels are added by CSS overlay in the runtime).
>
> Lighting: warm gold rim-light from upper-left at 30 degrees elevation; the body parts with Vedāṅga glyphs are slightly more illuminated than the rest of the figure (especially the third-eye Jyotiṣa).
>
> Style: flat 2D illustration with subtle gold-leaf textural overlay. Linework in warm gold (#E8C772) at 1.5-2px equivalent width. No gradients on the figure itself; gold-leaf texture only on the robe and Vedāṅga glyphs.
>
> Avoid: photorealism, 3D rendering, ornate ornament, multiple figures, throne or chair, jewelry beyond the *upavīta* cord, halo around the head (only around the third eye), Buddhist iconography (no Buddha similarities), Christian iconography, any non-Indic religious imagery, Western zodiac symbols, modern clothing, sandals, weapons."

#### L1-A2 — Pāṇinīya Śikṣā manuscript leaf (background only — text overlaid via CSS)

**Format:** PNG. **Aspect:** 4:3 landscape. **Size:** 1024 × 768 px.

**Prompt:**

> "A single page from an aged palm-leaf manuscript, framed for digital display. Surface: warm parchment cream (#F5EDD8) with subtle paper-grain texture and faint age-staining at edges (no holes, no major damage — gracefully aged, not destroyed).
>
> Around the page perimeter: a 24-pixel-wide ornamental border in warm gold (#E8C772) with classical Indian floral motifs (lotus + creeper patterns) at the four corners. The border should not be busy — restrained, scholarly.
>
> Vermilion margin line (#D4502E) at 48px from the left edge, running vertically full height — the classical margin where commentary would be added.
>
> In the top-left corner inside the margin: a reserved blank region (approximately 96 × 96 px) where a gold drop-cap will be rendered by CSS overlay. The region itself can have a faint gold-leaf decorative frame (an empty oval cartouche, no letter inside).
>
> The rest of the page is BLANK — no text, no script, no decorative central motif. The Sanskrit text is overlaid via CSS in the runtime; the asset is the background surface only.
>
> Style: flat 2D illustration. Warm, restrained, scholarly. Suitable as a background for actual readable text rendered on top.
>
> Avoid: text or script of any kind in the image, modern paper textures, plastic-looking gloss, busy borders, multiple decorative motifs in the center, color palette outside parchment-cream + gold + vermilion."

#### L1-A3 — Lagadha portrait

**Format:** PNG. **Aspect:** 1:1 square. **Size:** 512 × 512 px.

**Prompt:**

> "Portrait of Lagadha, the Vedic-era sage credited with the earliest surviving Indian Jyotiṣa text (approximately 1400-1200 BCE). Head-and-shoulders frame, three-quarter view facing slightly right, neutral scholarly expression.
>
> Sage appearance: elderly adult (approximately 60), male presentation, weathered scholarly face, white-grey beard reaching mid-chest, long white hair partly tied back, weathered skin. Robe: simple cream/parchment unstitched cloth, no ornament.
>
> A single vermilion (#D4502E) tilaka mark on the forehead — three vertical lines, restrained.
>
> Background: deep night sky (#0A0E1A) with a faint constellation pattern (3-4 visible stars in the *Saptarṣi* / Big Dipper configuration, very subtle). Optionally, a faint gold (#E8C772) gnomon (a vertical rod marking time by shadow — the classical Indian astronomical instrument) silhouetted in the lower right at small scale.
>
> Lighting: warm gold rim-light from upper-left.
>
> Bottom 64 pixels: leave as a faded-to-dark gradient where a Devanāgarī name label will be rendered by CSS overlay. No text in the image.
>
> Style: flat 2D illustration with subtle gold-leaf textural overlay on the rim-light. Reverent but not deified — Lagadha is a historical scholar, not a deity. No halo, no exaggerated divine markers.
>
> Avoid: deified appearance, multiple arms, weapons, throne, modern clothing, Western-classical realism, photorealism, 3D rendering, ornate ornament."

#### L1-A4 — Varāhamihira portrait

**Format:** PNG. **Aspect:** 1:1 square. **Size:** 512 × 512 px.

**Prompt:**

> "Portrait of Varāhamihira, the 6th-century CE Indian polymath (approximately 505-587 CE, Gupta-Vatsabhatti era). Head-and-shoulders frame, three-quarter view facing slightly left, contemplative scholarly expression.
>
> Sage appearance: middle-aged adult (approximately 50), male presentation, neatly trimmed black-going-grey beard, hair tied in a topknot, lighter skin tone consistent with Gupta-era courtly depictions in classical Indian painting.
>
> Garment: more refined than Lagadha — saffron-gold (#E89E2A) upper-body cloth with subtle classical pattern (small dotted motif), white lower garment visible at shoulder. Carrying a partially-unrolled palm-leaf manuscript scroll in his hands at chest level (signaling his role as the author of *Bṛhat Saṁhitā*, *Bṛhat Jātaka*, and *Pañca-siddhāntikā*).
>
> Subtle Gupta-era architectural element behind: a hint of a courtyard pillar (gold-line on deep-night) at small scale, suggesting his court astronomer position.
>
> Background: deep night sky (#0A0E1A) with a sparse, static starfield.
>
> Lighting: warm gold rim-light from upper-right.
>
> Bottom 64 pixels: faded-to-dark gradient for CSS label overlay. No text in the image.
>
> Style: flat 2D illustration with gold-leaf texture, restrained, scholarly. Reverent but not deified.
>
> Avoid: deified appearance, divine attributes, modern clothing, photorealism, 3D rendering, busy background, multiple figures."

#### L1-A5 — David Pingree representation

**Format:** PNG. **Aspect:** 1:1 square. **Size:** 512 × 512 px.

**Source approach:** Use the standard public-domain academic photograph of David Pingree (American historian of Indian astronomy, 1933-2005), then apply a single-tone sepia treatment for visual consistency with the historical figures.

**Prompt** *(for the sepia treatment if generating from scratch rather than treating a real photograph)*:

> "Sepia-toned portrait of an American academic, late 20th century, modeled after the public photographs of Professor David Pingree (Brown University historian of mathematics, 1933-2005). Head-and-shoulders frame. Middle-aged-to-elderly white American man, glasses, scholarly bearing, suit and tie of the 1970s-1990s academic register.
>
> Apply a warm sepia tone overall (parchment-cream highlights, deep-brown shadows) — NOT cold black-and-white. The sepia treatment matches the visual register of the Lagadha and Varāhamihira portraits while signaling Pingree's modern-academic context.
>
> Background: faded sepia, subtly suggesting library bookshelves at extremely low contrast.
>
> Bottom 64 pixels: faded-to-dark gradient for CSS label overlay.
>
> Style: warm photographic register applied flatly (no high-realism re-rendering); single-tone sepia processing.
>
> Avoid: harsh black-and-white, modern color photography, deified rendering, anachronistic Vedic-era clothing on Pingree (he is the modern academic anchor, intentionally different in register from Lagadha and Varāhamihira)."

If using a real public-domain photograph: import the photograph and apply the sepia treatment in post-processing. The treatment is more important than the underlying generation.

#### L1-A6 — Vedic Ecosystem Orbital central mandala (the four Vedas)

**Format:** SVG. **Aspect:** 1:1. **Size:** 512 × 512 px source.

**Prompt:**

> "An ornamental central maṇḍala depicting the four Vedic saṁhitās — Ṛg, Yajur, Sāma, Atharva — arranged at the four cardinal directions inside a circular gold-line frame.
>
> Each Veda is represented by a distinctive geometric symbol (NOT text — labels are added by CSS overlay):
> - TOP / North = Ṛg Veda = a hymn-cluster glyph (a vertical row of three short horizontal lines, suggesting verses)
> - RIGHT / East = Yajur Veda = a ritual-vessel glyph (a stylized *kuṇḍa* / fire-altar shape)
> - BOTTOM / South = Sāma Veda = a music-staff glyph (three nested arcs suggesting *gānam* / chant)
> - LEFT / West = Atharva Veda = a domestic-rite glyph (a small triple-flame above a shallow vessel)
>
> All four glyphs are warm gold (#E8C772) on the deep-night background. Each glyph occupies approximately 96 × 96 px within the 512 × 512 frame.
>
> The four glyphs are connected by a thin gold circle (the orbital ring), 2px stroke.
>
> At the center of the maṇḍala: a small gold OM (ॐ) symbol at 48 × 48 px — the unifying syllable.
>
> Around the outer edge: a 12-pixel ornamental gold border with classical Indian lotus-creeper motif.
>
> Background: transparent (SVG transparency). When placed on the deep-night runtime background, the gold glyphs should appear luminous.
>
> Style: flat 2D, restrained, scholarly, manuscript-illumination register.
>
> Avoid: text or script of any kind in the image, photorealism, 3D rendering, overly busy ornament, deities, weapons, color outside warm gold."

#### L1-A7 — Six Vedāṅga orbital glyphs

**Format:** SVG (six separate files, OR one file with six 256×256 grid cells — author's choice). **Aspect:** 1:1 each, ~256 × 256 px.

**Prompt:**

> "Six distinctive ornamental glyphs, one per Vedāṅga, all in the same illustration style. Each glyph is a stylized symbolic representation, NOT text or letterform.
>
> 1. ŚIKṢĀ — a stylized breath wave: three nested arcs sweeping from lower-left to upper-right, suggesting the path of exhaled breath in Vedic recitation.
> 2. KALPA — a stylized ritual ladle (*sruva*): a long-handled ceremonial spoon used in fire-altar rites, viewed in profile, simple silhouette.
> 3. VYĀKARAṆA — a stylized akṣara flourish: an abstract Sanskrit ligature shape (without resembling any actual akṣara), suggesting the structure of grammar.
> 4. NIRUKTA — a stylized sound-ripple: three concentric expanding semi-circles radiating from a central point, suggesting sound-meaning unpacking from a word.
> 5. CHANDAS — a stylized metrical foot pattern: alternating short and long marks (— — ⌣ — ⌣ ⌣ —) arranged in a horizontal row, suggesting Vedic prosody.
> 6. JYOTIṢA — a stylized star-cluster: a central eight-pointed star with seven smaller stars arranged around it (suggesting the Saptarṣi configuration), warm gold and very luminous.
>
> All glyphs share visual register:
> - Warm gold (#E8C772) line work
> - 1.5-2px equivalent stroke width
> - Subtle gold-leaf textural overlay
> - Sit within a 256 × 256 frame with 32px padding (subject occupies ~75% of frame)
> - Transparent background (when SVG; transparent-PNG fallback)
>
> Style: flat 2D, distinctive but legible at 32px display, manuscript-illumination register.
>
> Avoid: text or letterforms (these are SYMBOL glyphs, not script), photorealism, multiple subjects per glyph, color outside warm gold, overly busy ornament, modern iconographic styles."

### 19.3 The lesson-mastered mandala mark (L0-M1)

**Format:** SVG. **Aspect:** 1:1. **Size:** 128 × 128 px source.

This is the canonical mark that appears at lesson completion (§13.2 hold phase) and as the "lessons completed" indicator throughout the UI. Used across all 2,000+ lessons — generate once, use everywhere.

**Prompt:**

> "A small ceremonial mandala mark suitable for marking lesson mastery. Circular composition within a 128 × 128 frame.
>
> Center: a stylized eight-petal lotus in warm gold (#E8C772), occupying ~60% of frame.
>
> Around the lotus, a thin orbital ring (1.5px gold) at ~75% radius.
>
> On the orbital ring at the four cardinal directions: four small dots (3px each, gold).
>
> Background: transparent.
>
> Style: flat 2D, ceremonial, restrained, scholarly. The mark should read as 'achievement' but not 'gamification' — closer to a wax-seal stamp on a scholarly diploma than a video-game badge.
>
> Avoid: stars, badges, ribbons, video-game iconography, photorealism, color outside warm gold."

### 19.4 Sound assets — Lesson 1

| Slug | Format | Duration | Description |
|---|---|---|---|
| `chime-correct.webm` | WebM Opus + MP3 fallback | 600ms decay | Single low-pitched temple bell tone, 220 Hz fundamental, soft decay. Used in DragComparator on correct placement. |
| `swell-section.webm` | same | 800ms | Held tonic chord, E major two-note open fifth. Used at §-rail node fill. |
| `motif-lesson-complete.webm` | same | 1.2s total | Three-note rising motif: C → E → G, ~400ms per note, soft attack. Used in lesson-completion bloom phase. |

These can be commissioned from a sound designer or selected from a library; the spec gives the brief.

### 19.5 Library-wide assets — to be scheduled

Not blocking Lesson 1. Scheduled as a separate prompt sheet (`docs/learning-module/01-asset-library-prompts.md`) authored once Lesson 1 visual register is validated. Coverage:

- 9 grahas (full-figure illustrations, each in their classical iconography)
- 12 rāśis (icon set per rāśi)
- 27 nakṣatra deities
- 12 bhāva visual treatments
- 6 stream badges (Parāśara, KP, Jaimini, Lal Kitab, Tājika, Nāḍī)
- Background scenes for various lesson contexts (gurukula, observatory, royal court, etc.)

Each at 512 × 512 px minimum, SVG-preferred when geometry permits.

---

## 20. Lesson 1 interactive scenes — detailed specifications

**[LOCKED]**

The four interactive components used in Lesson 1 are specced in detail in `curriculum/interactive-specs/`. This section is a cross-reference. The full specs (per `curriculum/05-taxonomy.md` §3 template) live in those files.

| Scene name | Component spec | Family | Used in lesson sections |
|---|---|---|---|
| The Vedic Body | `curriculum/interactive-specs/vedanga-body-map.md` | B. Visualiser | §4 (Concept Theatre — sub-concept "the six limbs at body-part metaphors") |
| Vedāṅga ↔ Vedānta — The Drag Comparator | `curriculum/interactive-specs/vedanga-vs-vedanta-comparator.md` | E. Comparator | §4 (sub-concept "Vedāṅga is not Vedānta") |
| The Pāṇinīya Śikṣā Recitation | `curriculum/interactive-specs/sloka-recitation-frame.md` | B. Visualiser | §5 (Classical Authority — śloka block) |
| The Vedic Ecosystem Orbital | `curriculum/interactive-specs/vedic-ecosystem-orbital.md` | B. Visualiser | §7 (Primary Simulator — the lesson's biggest interactive) |

The §8 / §9 / §10 chrome for Lesson 1:

- **§8 Common Mistakes — 4 flippable cards.** (Per `<MistakeCardDeck>` chrome primitive.)
- **§9 Memory Anchors — 5 flippable cards.** (Per `<MemoryAnchorDeck>` chrome primitive.) Auto-fed to spaced repetition.
- **§10 MCQ Flow — 6 questions** loaded from `curriculum/assessment-bank/tier-1-mcq-bank/jyotisha-as-vedanga.json`. Renders via `<MCQFlow>` per §12.

---

## 21. Technical architecture

**[LOCKED]**

### 21.1 Source-of-truth (hybrid model, per founder decision)

- **Lesson body** lives as markdown in `curriculum/tier-X/module-XX/chapter-YY/lesson-ZZ.md`. (Already authored per the curriculum's standards.)
- **MCQ banks** live as JSON in `curriculum/assessment-bank/tier-X-mcq-bank/<slug>.json`.
- **Interactive specs** live as markdown in `curriculum/interactive-specs/<component-slug>.md`.
- **Generated assets** live in `frontend/public/assets/learning/<asset-slug>.svg|.png|.webm`.
- **Mastery state and progress** live in the `learning-service` Postgres `app_learning` schema.

### 21.2 Build pipeline — markdown ingestion

The `learning-service` runs a curriculum-ingestion job on backend boot and on filesystem watch in development:

1. Reads each lesson markdown's front matter → upserts `Lesson` row (canonical metadata, prerequisites, learning outcomes).
2. Stores the raw markdown body in `Lesson.bodyMarkdown` column.
3. Reads referenced MCQ JSON → upserts `MCQBank` + `MCQQuestion` rows.
4. Reads referenced interactive specs → registers `LessonInteractive` rows linking lesson to spec.

Body markdown is NOT parsed into structured JSON at ingestion time. Per founder decision, the frontend parses markdown at render time.

### 21.3 Frontend rendering — render-time markdown parsing

Per founder decision: the lesson body is rendered client-side via `remark` + `rehype` plugins.

- `<LessonShell>` fetches the lesson's structured metadata (`Lesson` row) and raw `bodyMarkdown` from learning-service.
- A custom remark plugin splits the body into 12 sections by `# §N` heading regex.
- Each section is passed to its dedicated chrome primitive (`<Hook>`, `<SlokaBlock>`, etc.).
- Interactive component specs are referenced by slug; the frontend lazy-loads the corresponding React component from `frontend/src/components/learning-runtime/interactive/<slug>/`.
- Static assets are imported from `/public/assets/learning/`.

This approach trades a small per-render parsing cost for development velocity: a content author saves a markdown file in `curriculum/`, and on reload the learner sees the updated lesson. No re-ingestion delay.

### 21.4 State management

- **Local component state** for in-lesson UI (which card is flipped, slider position).
- **Zustand store** for lesson-progress (current section, completion state, MCQ attempt count, mute toggle).
- **React Query** for server state (lesson data, MCQ submission, mastery state, telemetry submission queue).
- **Spaced-repetition cards** flow through learning-service `/learn/sr/cards` endpoint.

### 21.5 Component organization

```
frontend/src/
├── app/learn/
│   ├── layout.tsx                          (Lesson chrome wrapper)
│   ├── page.tsx                            (Learn index / curriculum map)
│   ├── [tier]/[module]/[chapter]/[lesson]/page.tsx  (LessonShell entry)
│   └── progress/page.tsx
├── components/learning-runtime/
│   ├── chrome/                             (§11.1-11.4 primitives)
│   │   ├── LessonShell.tsx
│   │   ├── SectionRail.tsx
│   │   ├── ColdOpen.tsx
│   │   ├── SlokaBlock.tsx
│   │   ├── MCQFlow.tsx
│   │   └── ...
│   ├── typography/
│   │   ├── Devanagari.tsx
│   │   ├── IAST.tsx
│   │   ├── Sloka.tsx
│   │   └── ...
│   ├── interactive/                        (per-component-spec implementations)
│   │   ├── vedanga-body-map/
│   │   ├── vedanga-vs-vedanta-comparator/
│   │   ├── vedic-ecosystem-orbital/
│   │   ├── sloka-recitation-frame/
│   │   └── ...
│   └── states/                             (loading/error/empty/offline)
├── design-tokens/grahvani-learning/
│   ├── colors.ts                           (§4 palette)
│   ├── surfaces.ts                         (§5 materials)
│   ├── motion.ts                           (§6 easing/durations)
│   ├── sound.ts                            (§7 sound vocabulary registry)
│   ├── typography.ts                       (§3 type system)
│   └── index.ts                            (consolidated barrel)
└── lib/learning-runtime/
    ├── markdown-parser.ts                  (remark/rehype pipeline)
    ├── lesson-loader.ts                    (API client)
    ├── telemetry.ts                        (§18 event emitter)
    └── i18n.ts                             (§17 string catalog)
```

### 21.6 Performance budget

- First contentful paint of any lesson route: ≤ 1.5s on a 4G connection.
- Interactive ready (LCP equivalent): ≤ 2.5s.
- Subsequent section scroll: instant (already in DOM).
- Interactive component lazy-loaded chunk: ≤ 200 KB gzipped per component (most should be ≤ 80 KB).

Performance budget is checked in CI via Lighthouse and bundle-size analysis.

---

## 22. Acceptance criteria — what "world-class" looks like operationally

**[LOCKED]**

A built lesson qualifies as world-class if and only if all of the following hold:

1. **Reading is a pleasure.** A learner who only reads (skips every interactive) still wants to keep reading the next lesson because the typography, spacing, and prose flow are excellent.
2. **Each interactive teaches.** Removing an interactive measurably reduces the learner's ability to answer the §10 MCQs. The interactives are not decoration.
3. **Devanāgarī is honored.** Sanskrit, IAST, and English appear together in every §5 śloka block, without exception. A Sanskrit scholar reading the lesson is not embarrassed.
4. **Citations are scholarly.** Every classical claim has a primary source. Every modern claim has a published reference. Bibliography is rendered with academic respect, not crammed at the bottom.
5. **Motion has reason.** Every animation either teaches or rewards. None is decorative.
6. **Mobile is real.** The lesson is fully usable on a 360px-wide phone, including all four Lesson 1 interactives.
7. **Accessibility is real.** Screen-reader navigation completes the lesson. Keyboard-only users complete every interactive. Color-vision-deficient users complete every interactive.
8. **The asset library is unique.** Nothing in the lesson looks like an off-the-shelf astrology stock illustration. The visual identity is Grahvani's, exclusively.
9. **The flow is felt.** A learner finishing the lesson feels they have *been somewhere* — through a ceremony, a study, a discovery — not that they have clicked through a webpage.
10. **Asha can complete it without help.** A learner with zero prior Jyotiṣa knowledge can complete Lesson 1 to mastery within the target 25-minute total time without external assistance.
11. **Sound is restrained.** With sound enabled, no audio plays at any UI-chrome interaction. Only the four occasions specified in §7 produce sound.
12. **Loading, error, and offline states are designed, not afterthoughts.** Each renders with the same scholarly-ceremonial-sidereal register as the happy path.

### 22.1 Reject conditions (any one = reject and rebuild)

- Generic edtech aesthetic.
- Western zodiac glyphs as primary symbols.
- Cartoonish illustrations.
- Decorative animations on load.
- Stock-photo "guru" images.
- Untyped fall-back lesson rendering (e.g., "this section couldn't load").
- Any uncited classical claim.
- Hover-bounces, candy-crush confetti, neon gradients.
- Sound on hover or button-tap.
- A learner reaching the §10 MCQ unable to answer because an interactive was decorative not pedagogical.

---

## 23. Amendment procedure

This document is amendable but not silently. The process:

1. Open an issue or commit with the proposed change and rationale.
2. Founder approves.
3. Version is bumped (0.2 → 0.3 → … → 1.0 when locked).
4. Affected built lessons are flagged for regression check.

Lesson 1 will be built to the first stable v1.0 of this document. Until v1.0, all builds are explicitly drafts.

---

## 24. Founder review checklist for v0.2 → v1.0 lock

When reading this v0.2 document, please mark each item as ✓ (accept) or ✗ (push back with what should change).

**Brand register and personae:**
- [ ] §2 brand register ("scholarly · ceremonial · sidereal").
- [ ] §2.1 Asha-persona policy — the "lesson stretches her up" stance and the five accommodations.

**Type and color:**
- [ ] §3.2 Cormorant Garamond as the literary serif.
- [ ] §3.5 font loading strategy.
- [ ] §4.1 four-surface palette, particularly Deep Night `#0A0E1A`.
- [ ] §4.3 the 9 graha hues (and any specific hex you wish to adjust — Śani's `#2C2C3E`, Rāhu's `#5A5C68`, Ketu's `#7A3E4A` are the likeliest candidates for adjustment).
- [ ] §4.4 the 12 rāśi hues by element × modality.
- [ ] §4.6 dark-only policy (no light mode).

**Sound, motion, icons:**
- [ ] §6 motion vocabulary (especially the durations).
- [ ] §7 sound vocabulary (sound exists, opt-in, restricted to four occasions).
- [ ] §8 iconography (Lucide-React continuation; custom for graha/rāśi/nakṣatra glyphs).

**Layout and chrome:**
- [ ] §9 layout grammar (12-section choreography).
- [ ] §9.1 section progress rail visual spec.
- [ ] §9.3 reflection prompt component.
- [ ] §9.4 §11 summary three-card layout.
- [ ] §9.5 §12 continuation ceremony.

**Interactive components:**
- [ ] §10 alignment with `curriculum/05-taxonomy.md` (the audit-driven correction from v0.1).
- [ ] §10.1 Lesson 1 components — four specs filed in `curriculum/interactive-specs/`.

**Mastery flow:**
- [ ] §12 MCQ flow detailed visual treatment.
- [ ] §13 mastery celebrations (section, lesson, chapter ceremonies).

**Cross-cutting concerns:**
- [ ] §16 empty/loading/error states.
- [ ] §17 internationalization readiness (next-intl, per-locale catalogs).
- [ ] §18 telemetry events and privacy policy.

**Assets:**
- [ ] §19.2 the 7 Lesson 1 asset prompts (specifically L1-A1 — the Vedic Body composite — is the foundational illustration of the entire learning module).
- [ ] §19.3 lesson-mastered mandala mark.
- [ ] §19.4 sound assets.

**Acceptance criteria and architecture:**
- [ ] §21 technical architecture, especially the render-time markdown parsing decision.
- [ ] §22 acceptance criteria and §22.1 reject conditions.

Mark up freely. Revision to v1.0 follows on your feedback, then Phase B (the build) begins.

---

## 25. Canonical design tokens — `chrome/lib/tokens.ts`

**[LOCKED]**

The token file `src/components/learning-runtime/chrome/lib/tokens.ts` is the **single source of truth** for typography, motion, radius, spacing, and focus-ring values across every lesson surface and the learning dashboard. No chrome component may declare raw numeric literals for any dimension covered below. Token names follow camelCase; constants exported as `const` for type-narrowing.

### 25.1 Type scale `T`

A six-rung modular scale. All values in px.

| Token | Value | Role | Sample usage |
|---|---|---|---|
| `T.micro` | 11 | Eyebrow uppercase labels, micro chip text | "TIER 1 · MODULE 1 · CHAPTER 1" |
| `T.caption` | 13 | Captions, metadata in the breadcrumb chrome only | breadcrumb separator dot |
| `T.body` | 16 | Default body prose, paragraph text | §4 Concept Theatre body |
| `T.title` | 20 | Card titles, sub-section headers | callout card titles |
| `T.display` | 28 | Lesson H2 display, section titles | "What Jyotiṣa Is" |
| `T.hero` | 40 | §1 Cold-Open hero H1 | "Jyotiṣa as a Vedāṅga: One of the Six Limbs of the Veda" |

**Forbidden:** fractional `px` literals (`13.5px`, `14.5px`, `17.5px`, etc.) and any size below `12px` for non-uppercase reading text. The post-audit reality (see §27) bumps practical floors above the bare scale.

### 25.2 Line-height scale `LH`

Three rungs. Unitless multipliers.

| Token | Value | Role |
|---|---|---|
| `LH.tight` | 1.2 | Display titles, hero H1 |
| `LH.normal` | 1.5 | Body prose (HIG recommends 1.45–1.55) |
| `LH.loose` | 1.65 | Long-form prose, citation blocks |

**Forbidden:** any of `1.35`, `1.45`, `1.55`, `1.6` — collapsed into the three rungs above during the v1.0 audit. Use `LH.normal` for anything that "feels like body".

### 25.3 Letter-spacing scale `LS`

Five rungs. Unit: `em`.

| Token | Value | Role |
|---|---|---|
| `LS.none` | `"0"` | Default running text |
| `LS.label` | `"0.05em"` | Subtle tracking for sans-serif labels |
| `LS.eyebrow` | `"0.10em"` | Standard uppercase eyebrows |
| `LS.eyebrowWide` | `"0.18em"` | Prominent uppercase section markers |
| `LS.ultra` | `"0.24em"` | Hero pills, page-section dividers |

### 25.4 Motion scale `M`

Three durations + one canonical easing.

| Token | Value | Role |
|---|---|---|
| `M.fast` | 150ms | Micro-interactions (button press, chip flip) |
| `M.default` | 250ms | Hover lifts, page reveals, state transitions |
| `M.slow` | 400ms | Larger reveals, modal entries |
| `M.easing` | `cubic-bezier(0.32, 0.72, 0.24, 1)` | The single canonical easing curve |

**Forbidden:** `160ms / 180ms / 200ms / 240ms / 280ms / 300ms / 320ms / 500ms / 600ms` — collapsed during v1.0 audit.

### 25.5 Radius scale `R`

| Token | Value | Role |
|---|---|---|
| `R.xs` | 4 | Hairline inputs, narrow chips |
| `R.sm` | 8 | Small cards, MCQ option buttons |
| `R.md` | 12 | Standard cards, callout boxes |
| `R.lg` | 16 | Glass panels, large surfaces |
| `R.xl` | 20 | Hero cards, primary feature surfaces |
| `R.pill` | 999 | Pills, badges, CTAs |
| `R.full` | `"50%"` | Circles only (medallions, avatars, lotus glyphs) |

### 25.6 Spacing scale `S` (strict 4px grid)

| Token | Value | Role |
|---|---|---|
| `S.xxs` | 4 | Inline gap inside chips |
| `S.xs` | 8 | Tight gaps |
| `S.sm` | 12 | Default small gap |
| `S.md` | 16 | Default medium gap |
| `S.lg` | 24 | Card padding, section internal |
| `S.xl` | 32 | Section-to-section breathing |
| `S.xxl` | 48 | Major section breaks |
| `S.hero` | 64 | Hero block padding |
| `S.ultra` | 96 | Page bottom padding |

**Forbidden:** any non-multiple of 4 (`1px, 3px, 5px, 6px, 7px, 10px, 14px, 18px, 22px`). Round to the nearest 4 if a non-grid value is tempting.

### 25.7 Focus ring & anchor offsets

| Constant | Value | Role |
|---|---|---|
| `FOCUS_RING` | `{ outline: "2px solid var(--gl-gold-accent)", outlineOffset: "2px" }` | Inline-style focus ring for inputs that need overrides |
| `LESSON_SECTION_SCROLL_MARGIN` | `"120px"` | Anchor scroll-margin (matches brand 56 + chrome 46 + breathing gap 18) |

### 25.8 Enforcement

When v1.1 ships, an ESLint rule will forbid raw font-size px literals + raw hex colors + non-grid spacing values inside `src/components/learning-runtime/`. Until then, the constitution is the enforcement layer; reviewer must reject PRs introducing the forbidden patterns.

---

## 26. Utility classes — global lesson-page CSS contracts

**[LOCKED]**

All three classes live in `app/globals.css` and are HMR-safe. They respect `@media (prefers-reduced-motion: reduce)`.

### 26.1 `.gl-focus-ring`

Applied to elements whose base styles set `outline: none` (textareas, custom-styled `<button>`s, SVG interactive zones with `role="button"`).

```css
.gl-focus-ring:focus-visible {
  outline: 2px solid var(--gl-gold-accent);
  outline-offset: 2px;
}
```

**Mandatory on:** every focusable element where the base style is `outline: none` or `border: none`. WCAG 2.4.7.

### 26.2 `.gl-clickable`

Uniform hover lift for all interactive elements (buttons, citation chips, CTA pills, MCQ option buttons, MistakeCard face tabs, MuteToggle, reflection submit).

```css
.gl-clickable {
  cursor: pointer;
  transition: transform 250ms cubic-bezier(0.32, 0.72, 0.24, 1),
              filter 250ms cubic-bezier(0.32, 0.72, 0.24, 1),
              box-shadow 250ms cubic-bezier(0.32, 0.72, 0.24, 1);
}
.gl-clickable:hover  { transform: translateY(-1px); filter: brightness(1.04); }
.gl-clickable:active { transform: translateY(0);    filter: brightness(0.98); }
```

**Mandatory on:** any element a learner can press. Bare `<button>` without `gl-clickable` is a constitutional violation.

### 26.3 `.gl-lesson-anchor`

`scroll-margin-top: 120px;` — the value of the sticky-stack height (§28). Apply to `<section>` elements whose `id` is a target of journey-rail anchor jumps. Inline style equivalent: `scrollMarginTop: "120px"`.

### 26.4 Reduced-motion guard

`@media (prefers-reduced-motion: reduce)` blocks transitions and animations on `.gl-clickable`, `.gl-motion`, and all `gl-surface-*` utilities. Author-introduced keyframes MUST be wrapped:

```css
@media (prefers-reduced-motion: no-preference) {
  .my-component { animation: my-keyframe 2.4s infinite; }
}
```

---

## 27. Readability floors — post-HIG audit (2026-05-22)

**[LOCKED]**

The audit pass on 2026-05-22 surfaced a class of "too small / too faded" reads. The floors below are now the minimum.

### 27.1 Font-size floors per role

| Role | Minimum | Family | Color |
|---|---|---|---|
| §1 Hero H1 | 40 | Cormorant | `--gl-ink-primary` |
| Section H2 | 28 | Cormorant | `--gl-ink-primary` |
| Card title | 20 | Cormorant | `--gl-ink-primary` |
| Body prose | **17** | Cormorant (running text), Inter (UI surfaces) | `--gl-ink-primary` |
| Caption / metadata italic | **14** | Cormorant italic | `--gl-ink-secondary` |
| Card meta row | **14** | Cormorant italic | `--gl-ink-secondary` |
| Eyebrow uppercase (LS ≥ 0.10em) | 11 | Inter 700 | chapter accent |
| Eyebrow non-uppercase | **12** | Inter 600 | `--gl-ink-secondary` |
| Button / CTA label | **15** | Inter 700 | contextual |
| Hint / tooltip italic | **13** | Cormorant italic | `--gl-ink-muted` |
| Marginalia body italic | **14** | Cormorant italic | `--gl-ink-on-cream-secondary` |

**Cormorant Garamond italic below 14px on cream parchment is a constitutional violation** unless the text is uppercase + tracked.

### 27.2 Color contrast floors

| Combination | Minimum | Reality after v1.0 |
|---|---|---|
| Body text (≥17px) on cream | 4.5:1 (WCAG AA) | `--gl-ink-primary` on cream ≈ 13:1 |
| Secondary body text on cream | 4.5:1 | `--gl-ink-on-cream-secondary` (#3D3115) ≈ 8:1 |
| Muted/caption body on cream | 4.5:1 | `--gl-ink-on-cream-muted` (#5C4A2A) ≈ 6.5:1 (was 4.6:1 in v0.2) |
| Italic Cormorant body on cream | **6:1 (stricter)** | enforced via `--gl-ink-on-cream-secondary` |
| Border / hairline | 3:1 | Use accent at `0.40–0.55` alpha (e.g., `#A23A1E66`) |
| Decorative dividers | 1.5:1 | Use accent at `0.18–0.30` alpha |

### 27.3 Italic emphasis MUST NOT change size

Inline `*italic*` emphasis renders at the surrounding text's exact size — no `1.05em` scaling, no `font-size: larger`. HIG principle: italic alone carries semantic weight; size changes are reserved for hierarchy.

### 27.4 Color promotion rule

When italic body text on a cream surface is set to `--gl-ink-muted` and the rendered size is ≤14px, **promote the color to `--gl-ink-on-cream-secondary`** (one rung darker). Italic + small + muted is the trinity of unreadability on parchment.

---

## 28. Sticky-stack geometry — the lesson-page header math

**[LOCKED]**

The lesson page has three stacked surfaces above the reading body. The math below MUST hold across all viewport widths ≥1024px.

| Layer | Top offset | Height | z-index | Source |
|---|---|---|---|---|
| GRAHVANI brand header | `fixed top: 0` | 56px (`h-14`) | 50 | `src/components/layout/GlobalHeader.tsx` |
| Lesson chrome breadcrumb bar | `sticky top: 56px` | ~46px (py-3 + 14px font) | 10 | `chrome/layout.tsx` |
| Sticky left rail + right marginalia | `sticky top: 116px` | content-driven | — | `chrome/layout.tsx` |

### 28.1 Anchor scroll-margin

Every `<section id="sec-N">` MUST set `scrollMarginTop: "120px"` (`LESSON_SECTION_SCROLL_MARGIN` in `tokens.ts`). 80px is the old v0.2 value and was eradicated during the v1.0 audit.

### 28.2 Why 116px for the rails

`56 (brand) + 46 (chrome bar height including borders) + 14 (breathing gap) = 116`. This places the rails just below the chrome bar with a small visual gap. The rail `maxHeight` is `calc(100vh - 140px)` so the rail can scroll independently without being clipped by the stack.

### 28.3 Mobile viewport (<1024px)

The left rail and right marginalia collapse out of the layout. Only the brand header + chrome bar persist; rails MAY be repositioned to top-of-page accordion blocks (v1.1 work).

---

## 29. Inline markdown conventions

**[LOCKED]**

The shared renderer is `chrome/lib/inline-markdown.tsx`. It recognises exactly four patterns and applies the styles in order:

| Pattern | Style | Use for |
|---|---|---|
| `**bold**` | `fontWeight: 600` in current color | Emphasis that survives outside its sentence |
| `*italic*` | Cormorant italic, current size, current color | Term first-introduction, semantic stress |
| `` `code` `` | Cormorant italic (same as *italic*) | Sanskrit transliterations, classical refs |
| `'quoted'` | Cormorant italic + `&lsquo;` / `&rsquo;` smart quotes | Bracketed terms ("Vedāṅga" vs "Vedānta") |

### 29.1 Apostrophe-collision invariant

The `'quoted'` pattern's regex requires the opening `'` to sit at string-start or after whitespace/punctuation, AND the closing `'` to be followed by whitespace/punctuation/string-end. This is non-negotiable: English contractions (`don't`, `we're`, `Jyotiṣa's`) MUST NOT collide with later apostrophes and italicise the gap between them. Verified test cases (locked):

| Input | Italics expected | Italics actual (v1.0) |
|---|---|---|
| `Don't think it's that simple` | 0 | 0 ✓ |
| `Distinguish 'Vedāṅga' from 'Vedānta'` | 2 | 2 ✓ |
| `What we're about to teach you` | 0 | 0 ✓ |
| `He said 'hello' to her` | 1 | 1 ✓ |

### 29.2 Italics are NOT for chromatic accent

The `ITALIC_STYLE` keeps `color: inherit`. Inline emphasis is rendered in the surrounding text's color. Chromatic accent is reserved for eyebrows and section headers; the prose stream stays monochrome.

---

## 30. Mahā-Path component — deferred to v1.1

**[v1.1]**

A `LearningYatraMap` component (`src/components/learning-runtime/dashboard/LearningYatraMap.tsx`, ~600 LOC) was built on 2026-05-22 to render the entire Tier 1 (24 modules) as a single continuous Duolingo/Candy-Crush–style pilgrimage with sequential unlocks. The file **exists on disk but is NOT imported anywhere**. It was integrated into `CurriculumJourney.tsx` initially, then **reverted within hours** because:

1. **Container-width collision** — the Sacred Path (chapter-level zoom) was designed for a full-width 1440px page hero with 280/1fr/280 columns and 820px SVG amplitude. The Mahā-Path's narrower inline expansion (1100px max + padding + gradient border) collapsed the effective width, causing absolutely-positioned chapter cards and lotus nodes to overlap.
2. **Inverse-scroll psychology** — the Mahā-Path rendered modules in reverse order (Module 24 at top, Module 1 at bottom). This forced learners to scroll past 23 locked modules to find the active one — opposite of Duolingo where the current level is visible at viewport load.
3. **Triple tier display redundancy** — three different surfaces showed "Tier 1 · X / 24 kṣetras" simultaneously (Mahā-Path header pill, HeroStatRibbon tier tile, TierProgress section). Cluttered.

### 30.1 Invariants for re-attempt (v1.1)

Before re-mounting, the next iteration MUST:

- Treat the Mahā-Path as its own top-level section, NOT a wrapper around CurrentModuleFocus. The Sacred Path stays where it is at full width. The Mahā-Path is a complementary view of the same data.
- Pick ONE of three architectures BEFORE writing code: (a) Mahā-Path replaces `ModuleGrid` only and sits below `CurrentModuleFocus`; (b) Mahā-Path is a separate `/learn/journey` route the user navigates to via a CTA; (c) Clicking a module on the Mahā-Path navigates to a `/learn/module/{slug}` detail page that hosts the Sacred Path standalone.
- Render with the **active module at viewport-top on initial load**, locked modules below (scroll down to see future).
- Show "Tier 1 progress" in **exactly one** place across the dashboard.
- Verify with a browser screenshot before declaring "shipped" — HTTP 200 and a clean typecheck are NOT proof.

### 30.2 Design spec

The full design spec lives at `frontend/docs/learning-module/MAHA_PATH_DASHBOARD.md`. It is retained for the v1.1 re-attempt.

---

## 31. Server-wired learning layer

**[LOCKED]**

As of 2026-05-22 the frontend is wired to the backend `learning-service` (Postgres + Prisma + Express, port 3013). Contracts below are **verified** against the live service via smoke test, not guessed.

### 31.1 Identity

- JWT access token in `useAuthTokenStore` (Zustand). `userId` extracted via `getUserIdFromCurrentToken()` from the token's `userId` or `sub` claim.
- JWT signed by `auth-service` with the **canonical** secret `cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce` (matches `backend/.env`). The learning-service expects the same secret.
- When no JWT is present, the dashboard operates in local-only mode; `useLearningSync` is a no-op.

### 31.2 Endpoints (all verified)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/learn/dashboard?userId=…` | Composite payload: streak, tier, points, progress[], badges |
| GET | `/api/v1/learn/lessons/:slug/quiz` | MCQ bank for client display |
| POST | `/api/v1/learn/lessons/:slug/submit` | Server-grader: body `{ userId, answers: [{ questionId, answer, timeSpentSeconds }] }` |
| POST | `/api/v1/learn/lessons/:slug/section-view` | Body `{ userId, sectionId: number }` (numeric, not string) |
| GET | `/api/v1/learn/sr/today?userId=…` | SRS deck |
| POST | `/api/v1/learn/sr/:cardId/review` | Submit SRS review |
| GET | `/api/v1/learn/gamification/streak/:userId` | Standalone streak |
| GET | `/api/v1/learn/gamification/badges/:userId` | `{ earned, upcoming }` |
| GET | `/api/v1/learn/gamification/profile/:userId` | `{ skillScore, currentTier, totalPoints, title, … }` |
| POST | `/api/v1/learn/gamification/daily/login/:userId` | Awards daily-login points + streak bump |

### 31.3 Sync architecture

- **Server is source of truth.** localStorage is the offline buffer.
- **On dashboard mount**, `useLearningSync` calls `fetchDashboard(userId)` and hydrates the Zustand progress store via `hydrateFromServer()` — server values overwrite local when timestamps disagree.
- **Daily-login** fires once per dashboard mount; backend dedupes per day.
- **MCQ submissions** call `submitLessonQuiz(slug, { userId, answers })` directly from `MCQFlow`. **The server is the grader** — client computes a local score only for optimistic UI + offline fallback. Server's `passed` verdict reconciles into the store.
- **Offline writes** queue to localStorage key `grahvani-learning-mutation-queue` via `enqueueMutation()`. `useLearningSync` drains on `online` and `focus` events.

### 31.4 Sync status indicator

The sticky-ribbon eyebrow shows a coloured dot beside the rank name:

| State | Dot color | Label |
|---|---|---|
| No JWT | grey `#7A6747` | "Local only" |
| Connected, queue empty | green `#3A8C5A` | "Synced" |
| Connected, queue non-empty | orange `#C28220` | "N pending sync" |
| Disconnected | red `#A23A1E` | "Offline" |

---

## 32. Tier 1 · Module 1 · Chapter 1 · Lesson 1 — the canonical reference

**[LOCKED]**

`/learn/tier-1/module-1/chapter-1/lesson-1` (slug `jyotisha-as-vedanga`) is the **reference implementation** that every other lesson in the Grahvani curriculum inherits from. Founder approved this lesson on 2026-05-22 as the canonical design.

### 32.1 What "canonical" means

The lesson's visual decisions are now the canonical defaults. New lessons inherit:

- The 12-section chrome order (§9 of this constitution)
- The Cormorant + Inter + Tiro Devanagari typography stack
- The chapter accent rotation (Ch1 bronze / Ch2 vermilion / Ch3 indigo / Ch4 jade)
- The corner-ornament card framing (top-left + bottom-right L-shapes)
- The dropcap on §1 hooks
- The trilingual Sloka block (Devanāgarī + IAST + English)
- The interactive-component composition (VedangaBodyMap + VedangaVsVedantaComparator pattern: title + body + image + reveal panel)
- The MCQ Flow state machine (idle / cooldown / answering / completed-pass)
- The "Anchored in …" Summary footer
- The "Continuation → next lesson" pattern

### 32.2 Inheritance invariants (NEVER change)

When authoring Lesson 2 of any chapter, you MUST:

1. Use the **same chapter's accent color** for the eyebrow + ornament tokens. Lesson 1 of Chapter 2 switches to vermilion; Lesson 1 of Chapter 3 switches to indigo.
2. Render the same 12-section chrome. A lesson can choose to leave §6 (Worked Example), §7 (Primary Simulator), §8 (Mistake Card Deck), or §9 (Memory Anchor Deck) empty if pedagogically appropriate, but §1, §2, §3, §4, §5, §10, §11, §12 are **mandatory**.
3. Use `<DropCap>` only on §1 Hook.
4. Use `<SlokaBlock>` only when a primary classical source is cited; otherwise `<WorkedExample>`.
5. Open the SectionAwareMarginalia panels in the same order: Outcomes-Ahead → Term-Glossary → Source-Authority → Recap-Glances → Coming-Next.
6. Provide an MCQ bank of 5–8 questions, ≥80% pass threshold, 24-hour cooldown on failure.

### 32.3 Variation surface

Lessons MAY:

- Introduce one custom interactive component per lesson (declared in front matter `interactive.component_type`)
- Use Devanāgarī titles + body text mid-paragraph when classical reference is essential
- Render diagrams as inline SVG when a Vedic concept benefits from it (e.g., relationship orbits, body maps, taxonomy charts)
- Use the `<TermTooltip>` primitive to reveal first-introduction term glosses on hover/tap

Lessons MUST NOT:

- Introduce a new typography rung (T tokens are the universe)
- Introduce a new color outside the chapter accent + graha palette
- Introduce a new section number (§13+ is not allowed)
- Skip §10 MCQ Flow (mastery gate is mandatory)
- Use animations that don't respect `prefers-reduced-motion`

---

## 32.4 Interactive-component invariants (added 2026-05-22 post-Lesson-2 readability fix)

**[LOCKED]**

When building a new interactive component (e.g., `VedangaRelationshipDiagram`), the following rules are non-negotiable. They were established after a Lesson 2 readability pass surfaced violations of the L1 quality bar:

1. **NEVER render a Devanāgarī śloka quotation INSIDE an interactive component.** Sanskrit ślokas belong in §5 (`SlokaBlock` chrome primitive) or §11 (`Summary` "Anchored In" footer). A duplicate śloka inside §4's interactive creates two large Devanāgarī displays on the same page and violates the visual hierarchy.

2. **NEVER add an internal `<h3>` heading inside an interactive component.** The page-level lesson route already renders an `<h3>` ABOVE the interactive (`fontSize: "26px"`, gold-accent, Cormorant 500). A duplicate h3 inside the component produces two competing headings stacked. The interactive component itself starts directly with its content (toggles, buttons, diagrams).

3. **Use the existing chrome typography sizes** — do not pick fresh px values ad-hoc. The L1 BodyMap interactive is the size-register reference for any new interactive: active-element title `22px`, body italic `15px`, eyebrow labels `12px` (uppercase, `LS.eyebrow`), table/list rows `15px`, SVG text 14-18px.

4. **`<Sloka>` typography component default is `size="md"`** (Devanāgarī 28px, IAST 20px). The previous v0.2 default was `lg` (40/24px) which is appropriate only for a hero-level standalone śloka outside the lesson chrome — never used in §5 of a real lesson.

5. **Visual review against L1 is the canonical verification.** Open the new lesson side-by-side with L1 in a browser before declaring done. Typecheck + HTTP 200 do not validate visual register.

6. **§5 śloka markdown MUST use blockquote `> ` prefix on every line.** The SlokaBlock chrome parser strips blockquote prefixes before matching its labels (Devanāgarī / IAST / English / Brief commentary). The labels themselves can be either Latin transliteration (`**देवनागरी (Devanāgarī)**`) or Devanāgarī alone (`**देवनागरī**`); both forms parse. Multi-śloka blocks separate ślokas with `---` horizontal rules. Any deviation from this template causes the parser to over-capture and render the IAST + English content inside the Devanāgarī typography — visual catastrophe.

7. **Every lesson SHOULD have a bespoke conceptual image** at the §4 Concept Theatre, mounted INSIDE the §4 interactive component as the LEFT card of a two-column composition (NOT as a standalone `<figure>` block above the interactive). Specs: 1024 × 1536 PNG, cream parchment background, hand-drawn manuscript-illumination style, palette restricted to Grahvani's chapter accents + ink. Location: `frontend/public/assets/learning/<lesson-slug>.png`. Reference exemplars: `vedic-body-composite.png` (L1) + `six-vedangas-lotus.png` (L2). Devanāgarī labels are added as a separate SVG overlay (Tiro Devanagari font) — not baked into the image — so typography stays consistent across the system. Without a bespoke image, the §4 Concept Theatre reads as a bare diagram + prose; the image is what makes a lesson feel scholarly-ceremonial rather than utilitarian.

8. **The §4 interactive component is a 2-column composition: image LEFT, paired interactive RIGHT.** Both the conceptual painting AND its paired explore mechanism live inside ONE Client Component — not as two siblings in the lesson page route. This is L1's canonical pattern (`<VedangaBodyMap>` = image + side panel together) and L2's (`<VedangaRelationshipDiagram>` = lotus + row-explorer together). A lonely standalone `<figure>` floating above an unrelated interactive ALWAYS reads as "this is just a decorative image, what am I supposed to do with it?" — the pairing is what carries the interactive register. CSS grid: `grid-cols-1 md:grid-cols-[1fr_320px]` (L1) or `[1fr_340px]` (L2).

9. **Image-as-interactive-surface (clicks ON the painting) is ONLY allowed when the image has baked-in visible affordances.** L1's `vedic-body-composite.png` has six visibly painted glowing glyphs at the nose, mouth, ear, hand, foot, and third-eye positions — users SEE those as obvious touch targets. The invisible-button overlays then sit on top of those visible glyphs and the UX is discoverable. If the bespoke PNG has NO baked-in visible affordances (e.g., L2's `six-vedangas-lotus.png`, which has smooth petals with no painted-in glyphs), DO NOT use invisible click overlays — they are undiscoverable. Instead: keep the painting as the contemplative LEFT card (no clicks on the image), and put the click targets in the RIGHT card as VISIBLE elements (legend rows, clickable cards, etc.). The 2-column composition is preserved; only the location of the click affordances shifts. Either pattern is a valid §4 design — they are NOT interchangeable on a per-painting basis.

These nine rules together prevent the most common new-lesson visual regressions: ad-hoc typography inside interactives, markdown structure that the chrome parsers can't read, lessons that ship without their visual anchor, image/interactive orphan composition, and undiscoverable click targets on paintings without baked-in glyphs.

---

## 32.5 Per-lesson §7 flagship overrides (added 2026-05-24 post-Lesson-2 §7 build)

**[LOCKED]**

Constitution §10.1 names §7 the Primary Simulator — the lesson's biggest synthesis interactive. A lesson's frontmatter `interactive.component_type` declares the §4 explorer; §7 may resolve to a DIFFERENT, richer synthesis component via the `SECTION_7_OVERRIDES` map in `frontend/src/components/learning-runtime/chrome/sections/PrimarySimulator.tsx`.

### 32.5.1 The §4 / §7 division of labour

Every lesson with both §4 and §7 enabled has TWO complementary interactive surfaces:

- **§4 Concept Theatre** hosts the *explore-each-element* surface — the painting + a paired explorer that lets the learner inspect each component (each Vedāṅga, each chakra, each daśā, etc.) one at a time. L1 → `<VedangaBodyMap>`. L2 → `<VedangaRelationshipDiagram>`.

- **§7 Primary Simulator** hosts the *synthesize-the-system* flagship — a richer mode that pulls all the elements into one composite visualisation (orbital, hub-and-spoke, scenario-explorer, time-slider, etc.) showing how they relate as a system. L1 → `<VedicEcosystemOrbital>`. L2 → `<JyotishaSangaHub>` (two tabs: hub-and-spoke + sāṅga scenarios).

Both surfaces share data files but render DIFFERENT visualisations on DIFFERENT typographies. The §4 / §7 distinction is the engine of L1's pedagogical depth and MUST be preserved in every Tier-1 lesson.

### 32.5.2 Adding a new lesson's §7

1. Decide whether §7 hosts the same component as §4 (rare — only acceptable when §4's explorer IS already the lesson's synthesis flagship and there is no richer second mode worth adding).
2. If §7 hosts a different component (the standard case), build the new flagship in `src/components/learning-runtime/interactive/<slug>/` and register it in `interactive/registry.ts`.
3. Add the lesson's slug → registry key mapping to `SECTION_7_OVERRIDES` in `PrimarySimulator.tsx`. The frontmatter's `interactive.component_type` stays pointing at the §4 explorer; the override map handles §7 resolution.
4. The §7 component must be a Client Component (`"use client"`) with its own internal composition; PrimarySimulator wraps it with the standard section header (eyebrow + title + ornament + accent).
5. Every §7 flagship MUST have a clear pedagogical purpose distinct from §4's: a second mode worth a learner switching sections for. If it's just "the same diagram, bigger," collapse it.

### 32.5.3 Anti-patterns rejected by hard experience

- **DO NOT** use a `MOUNTED_IN_SCENES` boolean set to skip §7 entirely. Every lesson must have its §7 flagship; gating §7 off creates dead pedagogical space.
- **DO NOT** mount §7's interactive in §4's `scenes` prop. The §4 and §7 sections are pedagogically distinct surfaces; moving §7's content into §4 collapses the lesson's depth.
- **DO NOT** rely on the frontmatter's `interactive.component_type` to mean "the §7 component." That field describes the §4 component (the lesson's primary explorer); §7 is the orchestrator-chosen flagship.

---

## 32.6 Debugging Client Component rendering — what curl can and cannot show

**[LOCKED]**

The lesson route is wrapped by `RoleGuard` (`src/components/auth/RoleGuard.tsx`), which renders a "Loading..." state server-side until `useAuth()` resolves from localStorage on the client. **This means `curl http://localhost:3000/learn/...` will ALWAYS return only the loading shell + the RSC streaming payload, never the rendered lesson DOM.** Counting `gl-focus-ring` or `<figure>` or image-src occurrences in the curl response and concluding "the component isn't rendering" is a false-negative diagnostic — the component IS being instantiated; it just hasn't hydrated yet at the moment curl reads the response.

### 32.6.1 The right diagnostic protocol

For "I don't see component X on lesson route Y":

1. **Open in an authenticated browser** (the user's actual Chrome with their session cookies in localStorage). Hard-reload with `Cmd+Shift+R` to clear any stale chunks.
2. **Open DevTools → Elements panel.** Search (Cmd+F) for a known marker inside the component (a class, `data-interactive="..."` attribute, or a distinctive string). If the marker is in the DOM, the component IS rendering; the bug is then visual/styling/conditional.
3. **Open DevTools → Console.** Any client-side render error appears here. Look for unhandled exceptions, `Cannot read properties of undefined`, hydration mismatches, or `[ErrorBoundary:...]` markers.
4. **Verify the route's RSC payload contains the component reference** (curl IS useful for this — grep for `data-l2-scenes-mounted` or whichever data-attribute marks the dispatch branch). If the dispatch branch fires server-side, the bug is downstream of the dispatch.
5. **NEVER** restart the Next dev server as a diagnostic shortcut unless you have first proven the failure is a Turbopack stale-state issue (e.g., `Module not found` errors in the dev log AFTER a file was demonstrably created on disk). Restart is sometimes necessary but it discards diagnostic context — try `touch <file>` to retrigger fs-watch first.

### 32.6.2 Turbopack new-file resolution lag (rare but real)

When creating a brand-new file mid-edit cycle, Turbopack occasionally fails to resolve the import for 1–2 requests even though the file exists at the expected path and the tsconfig alias is correct. Symptom: dev log shows `Module not found: Can't resolve '@/components/<...>'` even though `ls -la` confirms the file. Workaround: `touch <file>` to retrigger fs-watch, or restart the dev server. Long-term fix: avoid creating brand-new files during high-iteration sessions — prefer adding to existing files.

---

## 33. Inheritance rules — per-tier, per-chapter, per-lesson

**[LOCKED]**

### 33.1 Per-tier inheritance

| Tier | Title | Accent quartet (per chapter rotation) | Difficulty floor |
|---|---|---|---|
| 1 | Foundation | bronze / vermilion / indigo / jade | Remember + Understand |
| 2 | Practice | rotate same quartet | Apply + Analyze |
| 3 | Mastery | rotate same quartet | Evaluate + Create |

The accent quartet repeats across tiers — no new color introduced for Tier 2 or Tier 3. The differentiator is **difficulty**, not chroma.

### 33.2 Per-chapter inheritance

Within a module, chapters 1–4 follow the **strict rotation** of the chapter accent palette:

| Chapter | Accent token | Hex |
|---|---|---|
| 1 | `--gl-ch1-bronze` | `#C28220` |
| 2 | `--gl-ch2-vermilion` | `#A23A1E` |
| 3 | `--gl-ch3-indigo` | `#4F6FA8` |
| 4 | `--gl-ch4-jade` | `#3A8C5A` |

If a module has 5+ chapters, chapter 5 starts the rotation over (bronze again). 6+ chapters in a single module is a curriculum-design smell — open an authoring discussion if you find yourself there.

### 33.3 Per-lesson inheritance

| Property | Variable | Constant |
|---|---|---|
| Slug | per-lesson kebab-case | `<verb-or-noun>-<topic>` |
| Title | per-lesson | Mixed sentence case, no all-caps |
| Devanāgarī title | per-lesson | Tiro Devanagari Hindi |
| Subtitle | per-lesson | Cormorant italic, one line max |
| Frontmatter schema | per-lesson | Locked schema from §9 of this constitution |
| 12 sections | mandatory order | See §32.2 |
| MCQ bank slot | per-lesson | 5–8 questions |
| Custom interactive | optional, declared in frontmatter | One per lesson |
| Citations | per-lesson | Academic register, classical + modern |
| Reading-grade target | 12-14 | Locked |
| Total-minutes target | 20-40 | Locked range |
| Bloom levels | per-lesson, distributed across questions | At least 2 levels per MCQ bank |

### 33.4 Inheritance enforcement

For v1.1 we will land:

- A `npm run lesson:lint` script that validates a lesson's markdown against this constitution (chapter-accent correctness, mandatory sections, MCQ count, citations, etc.).
- Storybook visual stories rendering each chrome primitive at every type-scale rung — protects against drift.
- An ESLint rule package banning raw px font-size / hex color / non-grid spacing literals inside `src/components/learning-runtime/`.

Until then, the constitution is enforced by reviewer discipline. Every new lesson PR MUST be reviewed against §32.2 and §33.1–33.3.

---

## 34. Cross-references summary — where each token lives in code

**[LOCKED]**

| Constitution section | Code location |
|---|---|
| §3 Type system, §25 Tokens | `src/components/learning-runtime/chrome/lib/tokens.ts` |
| §4 Color system | `src/app/globals.css` (`:root` block) |
| §26 Utility classes | `src/app/globals.css` (`.gl-focus-ring`, `.gl-clickable`, `.gl-lesson-anchor`) |
| §28 Sticky-stack geometry | `src/components/learning-runtime/chrome/layout.tsx` |
| §29 Inline markdown | `src/components/learning-runtime/chrome/lib/inline-markdown.tsx` |
| §11 Lesson chrome primitives | `src/components/learning-runtime/chrome/` directory |
| §9 Section choreography | `src/app/learn/[tier]/[module]/[chapter]/[lesson]/page.tsx` |
| §30 Mahā-Path (deferred) | `src/components/learning-runtime/dashboard/LearningYatraMap.tsx` (file exists, NOT mounted) |
| §31 Server-wired learning layer | `src/lib/api/learning.ts`, `src/hooks/learning/useLearningSync.ts`, `src/lib/learning-runtime/mutation-queue.ts` |
| §32 Lesson 1 canonical | `curriculum/tier-1-foundation/module-01-introduction-to-jyotisha/chapter-01-what-jyotisha-is/lesson-01-jyotisha-as-vedanga.md` |
| §33 Inheritance rules | `frontend/docs/learning-module/02-lesson-authoring-standard.md` (companion doc) |

---

*End of Grahvani Learning Design Constitution v1.0 — LOCKED 2026-05-22.*

*Tier 1 / Module 1 / Chapter 1 / Lesson 1 is the canonical reference. All future lessons inherit its visual vocabulary, structural composition, and interaction model. Constitutional amendments require founder sign-off per §23.*

*This document is the design counterpart to `curriculum/00-curriculum-constitution.md` (content). The two together govern the entire Grahvani learning module.*
