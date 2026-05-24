# Grahvani Learning Module — QA & PR Review Checklist

> The explicit list of what every reviewer must verify before approving a learning-module PR. Use this as a copy-pasteable PR comment template.

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED).

---

## 0. TL;DR

Three personas review every learning-module PR:

1. **Technical reviewer** — code quality, type-safety, no constitutional violations
2. **Pedagogical reviewer** — content correctness, citations, Bloom-level distribution
3. **Visual reviewer** — design constitution compliance, accessibility, polish

This checklist combines all three. Run through it top-to-bottom.

---

## 1. Pre-flight (before opening the PR)

- [ ] Local typecheck is clean: `cd frontend && npx tsc --noEmit`
- [ ] Local lint passes: `cd frontend && npm run lint` (if configured)
- [ ] Local pages return 200 for relevant routes
  - [ ] `/learn` (200)
  - [ ] `/learn/tier-N/module-N/chapter-N/lesson-N` (200)
  - [ ] `/learn/review` if SRS-related (200)
- [ ] If backend changed: `learning-service` `/health` returns 200
- [ ] If schema changed: `npm run db:reset-seed && npm run db:seed` runs without error
- [ ] If curriculum changed: `npm run import-lesson -- <path> --dry-run` validates clean
- [ ] No new commit messages contain `console.log`, `TODO`, `FIXME`, `WIP` for permanent additions

---

## 2. Code quality — chrome / frontend

- [ ] No raw `fontSize: "X.5px"` literals — all sizes from `T` tokens
- [ ] No raw hex colors in chrome/ — all from CSS variables (`var(--gl-...)`)
- [ ] No `outline: none` without paired `.gl-focus-ring` class
- [ ] No `<button>` without `gl-clickable` class
- [ ] Every animated keyframe wrapped in `@media (prefers-reduced-motion: no-preference)` or uses `useReducedMotion` pattern
- [ ] Every `<section id="sec-N">` has `scrollMarginTop: "120px"`
- [ ] Every `<em>` / `<strong>` via `renderInline()` — not bare tags
- [ ] No `useState` for data that belongs in `progress-store`
- [ ] Every `lineHeight` is from `LH` tokens (1.2 / 1.5 / 1.65)
- [ ] Every `letterSpacing` is from `LS` tokens
- [ ] Every transition uses `M.fast` (150ms) / `M.default` (250ms) / `M.slow` (400ms)
- [ ] No new file in `chrome/` without a JSDoc block at the top explaining its role
- [ ] If introducing a new chrome primitive: founder sign-off documented in PR description
- [ ] If introducing a new utility class: added to `globals.css` AND documented in design constitution §26

---

## 3. Code quality — backend / learning-service

- [ ] Every new endpoint wraps body in try/catch
- [ ] Every new endpoint returns `{ success: bool, data | error }` envelope
- [ ] Every required input validated explicitly → 400 on missing
- [ ] Every error logged via Pino with structured context
- [ ] If new Prisma model: `npx prisma generate` ran, types updated downstream
- [ ] If new route: typed client added to `frontend/src/lib/api/learning.ts` in same PR
- [ ] If schema migration: `npx prisma migrate dev` (NOT `db push`) for production-bound changes
- [ ] No `Buffer.from(..., 'binary')` or other unsafe encodings
- [ ] No new `JWT_SECRET` defaults outside test mode

---

## 4. Curriculum / content (lesson markdown PRs)

- [ ] Frontmatter validates per [`02-lesson-authoring-standard.md`](../../../curriculum/02-lesson-authoring-standard.md)
- [ ] All 12 sections present (or §6/§7/§8/§9 explicitly empty with rationale in PR description)
- [ ] §1 Hook uses `<DropCap>` if rendered (auto-applied)
- [ ] §5 Sloka Block includes Devanāgarī + IAST + English (trilingual rule)
- [ ] §10 MCQ Flow: 5-8 questions, ≥2 Bloom levels distributed, ≥80% pass threshold
- [ ] §11 Summary's "Anchored In" references a primary classical source
- [ ] §12 Continuation links to a real next-lesson markdown file
- [ ] Citations follow [`03-source-citation-standard.md`](../../../curriculum/03-source-citation-standard.md) (academic register)
- [ ] Devanāgarī / IAST follows [`04-devanagari-iast-conventions.md`](../../../curriculum/04-devanagari-iast-conventions.md)
- [ ] Reading-grade target 12-14 (estimate via reading-ease analyzer)
- [ ] Total-minutes target 20-40 (use `target_minutes_total` frontmatter field)
- [ ] At least one stream declared (`streams: [parashari]` at minimum)
- [ ] Markdown apostrophes use `'X'` (matching pair) for quoted terms — single apostrophes safe for contractions (regex-tightened)
- [ ] No raw ASCII quotes for emphasis — use `*italic*` or `**bold**` or `'quoted'`
- [ ] Image references resolve (no 404s)
- [ ] Audio references resolve (no 404s)

---

## 5. MCQ bank (json file accompanying lesson)

- [ ] JSON validates against MCQ schema in [`curriculum/06-assessment-design-standard.md`](../../../curriculum/06-assessment-design-standard.md)
- [ ] Each `questionId` is globally unique
- [ ] Each question has exactly one `isCorrect: true` option (for `single-best`)
- [ ] Each question has 3-4 options (typically 4)
- [ ] Each question has `explanation` referencing classical source where applicable
- [ ] Distractor quality: each wrong option represents a real misconception, not a strawman
- [ ] Bloom levels distributed (not all questions are Remember-level)
- [ ] Citation field present where the question relates to a primary source

---

## 6. Interactive component (if PR adds one)

- [ ] Lives under `src/components/learning-runtime/interactive/<slug>/`
- [ ] Has `index.tsx` + `data.ts` + `README.md`
- [ ] Registered in `interactive/registry.ts`
- [ ] All interactive zones have `aria-label`
- [ ] All buttons have `aria-pressed` if they have selectable state
- [ ] Keyboard navigation works (Enter/Space activate; Arrow keys for grid)
- [ ] `prefers-reduced-motion: reduce` disables animations
- [ ] `gl-focus-ring` on all clickables with `outline: none`
- [ ] `gl-clickable` on all `<button>`s
- [ ] Tested on a real device (not just devtools mobile emulation)
- [ ] Visual register matches Lesson 1's existing interactives (manuscript style, gold halos, cream surfaces)

### 6.1 §4 / §7 division of labour (LOCKED 2026-05-24)

If the PR adds OR modifies the lesson's interactive layer, verify:

- [ ] Lesson has a **§4 explorer** component (the "explore each element" surface)
- [ ] Lesson has a **§7 flagship** component (the "synthesize the system" surface) — DISTINCT from §4
- [ ] §7 is wired via `SECTION_7_OVERRIDES` in `PrimarySimulator.tsx`, NOT by overloading §4's component slot
- [ ] §4 component is a 2-column composition: image LEFT + paired interactive RIGHT (single Client Component, not two siblings)
- [ ] Click affordances live in EXACTLY ONE half of the §4 composition:
  - **On the painting** ONLY if the PNG has baked-in visible glyphs/mandalas at each click position (L1 pattern)
  - **On the right card** if the PNG has no baked-in affordances (L2 pattern) — invisible click overlays on a decorative painting are an anti-pattern
- [ ] §7 component has a clear pedagogical purpose distinct from §4 — not just "the same explorer, bigger"
- [ ] No usage of a `MOUNTED_IN_SCENES` boolean set to skip §7 — every lesson must have its §7 flagship

### 6.2 Diagnostic protocol when a component "isn't rendering"

`curl` of any `/learn/...` route ALWAYS returns only the RoleGuard "Loading..." shell — the lesson DOM hydrates on the client. Counting `gl-focus-ring` / `<figure>` / image-src in curl output to conclude "component isn't rendering" is a **false negative**. To verify:

- [ ] Hard-reload the lesson route in an authenticated browser (`Cmd+Shift+R`)
- [ ] Open DevTools Elements panel, Cmd+F search for the component's `data-interactive="..."` or a distinctive marker
- [ ] Check DevTools Console for client-side render errors
- [ ] Restart `next dev` ONLY if the dev log shows `Module not found` AFTER a file was demonstrably created (Turbopack new-file lag) — not as a generic diagnostic shortcut

---

## 7. Visual review (designer / founder)

- [ ] Typography hierarchy obvious at a glance — no flat-text walls
- [ ] All eyebrows in chapter accent color (per chapter rotation)
- [ ] All section dividers use `<SectionDivider>` chrome primitive
- [ ] Margins / padding match the 4pt grid (no 7px, 11px, 13px, etc.)
- [ ] No new color invented outside the chapter accent + graha + ink palettes
- [ ] Devanāgarī text uses Tiro Devanagari Hindi font; IAST uses Cormorant italic
- [ ] No flat-color icons that look out of register
- [ ] Hover affordance visible on every clickable
- [ ] Focus ring visible when tabbing through with keyboard
- [ ] Side rails (journey + marginalia) sit cleanly under the sticky chrome bar
- [ ] Mobile viewport (<1024px) gracefully degrades — no horizontal scroll

---

## 8. Accessibility audit

- [ ] WCAG AA contrast holds for all text (≥4.5:1 for body, ≥3:1 for large display)
- [ ] Italic Cormorant on cream parchment: contrast ≥6:1 (stricter)
- [ ] Every focusable element shows a visible focus indicator
- [ ] Every interactive has appropriate `aria-*` attributes
- [ ] Tab order is logical (top-to-bottom, left-to-right)
- [ ] Screen reader test: VoiceOver / NVDA can read the lesson and navigate sections
- [ ] Animations respect `prefers-reduced-motion: reduce`
- [ ] No information conveyed by color alone (e.g., mastery state has both color + icon)
- [ ] Image `alt` text is descriptive
- [ ] Decorative images / SVGs are `aria-hidden="true"`

---

## 9. Performance audit

- [ ] Total lesson page transfer ≤3 MB (excluding fonts)
- [ ] No image >800 KB
- [ ] `<img loading="lazy">` on all below-fold images
- [ ] No `useState` triggering re-renders on every animation frame
- [ ] No `setInterval` faster than 250ms without a clear reason
- [ ] LCP target ≤2.5s on 3G Slow (verify via Lighthouse)
- [ ] No N+1 queries in backend route handlers (use `prisma.include`)

---

## 10. Smoke commands — copy-paste verification

```bash
# 1. Frontend builds clean
cd frontend && npx tsc --noEmit && npm run build

# 2. Backend builds clean
cd backend/services/learning-service && npm run build

# 3. All 3 pages return 200
sleep 2
curl -sS -o /dev/null -w 'learn: %{http_code}\n'  "http://localhost:3000/learn?_=$(date +%s)"
curl -sS -o /dev/null -w 'review: %{http_code}\n' "http://localhost:3000/learn/review?_=$(date +%s)"
curl -sS -o /dev/null -w 'lesson: %{http_code}\n' "http://localhost:3000/learn/tier-1/module-1/chapter-1/lesson-1?_=$(date +%s)"

# 4. Service /health
curl -sS http://localhost:3013/health

# 5. Audit grep — should all be 0
cd frontend/src/components/learning-runtime
echo "Fractional fontSize:       $(grep -rhcE 'fontSize: "[0-9]+\.[0-9]+px"' chrome/sections chrome/*.tsx 2>/dev/null | awk -F: '{s+=$1} END {print s+0}')"
echo "Stale scrollMarginTop 80:  $(grep -rhcE 'scrollMarginTop: "80px"' chrome/sections 2>/dev/null | awk -F: '{s+=$1} END {print s+0}')"
echo "Bare outline:none:         $(grep -rlnE 'outline: \"none\"' chrome --include='*.tsx' | xargs grep -L 'gl-focus-ring' 2>/dev/null | wc -l | xargs)"
echo "Hardcoded 'The Pilgrim':   $(grep -rlnE '\"The Pilgrim\"' chrome/sections dashboard 2>/dev/null | wc -l | xargs)"

# 6. Manual browser walkthrough
echo "Open browser, hard-reload (Cmd+Shift+R), and walk through:"
echo " 1. /learn dashboard — verify sticky ribbon, hero, stats, sacred path, modules, achievements"
echo " 2. /learn/tier-1/module-1/chapter-1/lesson-1 — read all 12 sections, take the MCQ"
echo " 3. /learn/review — verify SRS deck (empty if no mastered lessons aged 7+ days)"
```

---

## 11. Constitutional checklist (the existential review)

If ANY of these are true, the PR is constitutionally non-conformant:

- [ ] The PR introduces a new typography rung outside `T` tokens
- [ ] The PR introduces a new color outside the chapter accent + graha + ink + dawn palettes
- [ ] The PR introduces a new section number (§13+)
- [ ] The PR makes a lesson passable without the §10 MCQ Flow
- [ ] The PR removes the trilingual register from §5 Sloka Block
- [ ] The PR adds gamification rules that aren't documented in `GAMIFICATION_RULES.md`
- [ ] The PR adds frontend state that doesn't respect the offline-buffer pattern
- [ ] The PR adds animations without `prefers-reduced-motion` guard

A constitutional non-conformance requires an amendment per design constitution §23 — not a PR comment.

---

## 12. Reviewer's PR comment template

Copy this into your review comment, check the boxes as you verify:

```markdown
**Reviewing per QA_CHECKLIST.md v1.0.**

**Pre-flight:**
- [ ] Typecheck clean
- [ ] All routes 200
- [ ] Seeder dry-run clean (if curriculum change)

**Code quality (frontend):**
- [ ] Token usage (T/LH/LS/M/R/S) consistent
- [ ] No raw hex / fractional px / outline:none / bare buttons
- [ ] prefers-reduced-motion respected

**Code quality (backend):**
- [ ] try/catch around handlers; envelope-shaped responses
- [ ] Input validation explicit
- [ ] Typed client wired

**Content (if curriculum):**
- [ ] Frontmatter validates
- [ ] 12 sections + MCQ bank present
- [ ] Citations academic register

**Visual:**
- [ ] Hierarchy obvious
- [ ] Chapter accent rotation correct
- [ ] Mobile graceful

**Accessibility:**
- [ ] Contrast ≥ AA
- [ ] Focus rings visible
- [ ] Screen reader passes

**Constitutional:**
- [ ] No constitutional violations

Approve / Request changes: …
```

---

*End of QA_CHECKLIST v1.0 — 2026-05-22.*
