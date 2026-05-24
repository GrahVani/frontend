# Grahvani Learning Module — Frontend Cookbook

> Practical recipes for extending the learning-module frontend without violating the design constitution. Read this AFTER you've read [`00-design-constitution.md`](./00-design-constitution.md) and the [`HANDOFF_PLAYBOOK.md`](./HANDOFF_PLAYBOOK.md).

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED).

---

## 0. TL;DR

The frontend is **Next.js 16 + React 19 + Turbopack + TypeScript 5.9 + Tailwind 4**. State lives in **Zustand**. Server data flows through a **typed API client** (`src/lib/api/learning.ts`). The lesson page is composed of **chrome primitives** (~20 files in `chrome/`) that render sections of lesson markdown. Custom **interactive components** mount inside `<ConceptTheatre>`'s scenes prop.

If you need to add a new thing: a section component, an interactive, a chrome primitive, a route — find the closest existing example and copy its shape.

---

## 1. The component tree at a glance

```
/learn/tier-1/module-1/chapter-1/lesson-1
  └─ src/app/learn/[tier]/[module]/[chapter]/[lesson]/page.tsx       (server component)
      ├─ loadLesson() reads markdown via lesson-loader
      ├─ loadMcqBank() reads JSON via mcq-loader
      └─ <LessonShell>                                               (chrome/layout.tsx)
          ├─ <LessonTimeTracker slug={fm.slug}/>                     (mounts the time-accumulator hook)
          ├─ Top breadcrumb chrome bar (sticky top:56px)
          ├─ 3-column grid:
          │   ├─ <LessonJourneyRail/>                                (left rail, sticky top:116px)
          │   ├─ <main>                                              (the section sequence)
          │   │   ├─ <RevealSection><ColdOpen/>                      (§1)
          │   │   ├─ <RevealSection><OrientationCards/>              (§2 + §3)
          │   │   ├─ <ConceptTheatre scenes={...custom}/>            (§4)
          │   │   ├─ <SectionDivider/><SlokaBlock/>                  (§5)
          │   │   ├─ <SectionDivider/><WorkedExample/>               (§6 — optional)
          │   │   ├─ <SectionDivider/><PrimarySimulator/>            (§7 — optional)
          │   │   ├─ <SectionDivider/><MistakeCardDeck/>             (§8 — optional)
          │   │   ├─ <SectionDivider/><MemoryAnchorDeck/>            (§9 — optional)
          │   │   ├─ <SectionDivider/><MCQFlow/>                     (§10 — mandatory mastery gate)
          │   │   ├─ <SectionDivider/><Summary/>                     (§11)
          │   │   └─ <SectionDivider/><Continuation/>                (§12)
          │   └─ <SectionAwareMarginalia/>                           (right rail, sticky top:116px)
          └─ </LessonShell>
```

---

## 2. State architecture

```
src/store/useAuthTokenStore.ts             Zustand — accessToken, refreshToken
src/lib/learning-runtime/progress-store.ts Zustand + persist — lessons[], streak, time, etc.
src/hooks/learning/useLearningSync.ts      Custom — bridges store ↔ backend, write-through, offline queue
src/lib/learning-runtime/time-tracker.ts   Custom hook — Page Visibility–aware time accumulator
src/lib/learning-runtime/rank.ts           Pure — derives scholar rank from masteredCount
src/lib/learning-runtime/mutation-queue.ts Shared queue helper (localStorage)
```

### 2.1 Data flow on lesson page mount

1. Server component reads markdown + MCQ JSON from filesystem
2. Server component renders the lesson chrome (server-rendered HTML)
3. Client hydrates; `LessonTimeTracker` starts accumulating time
4. `MCQFlow` reads `progress-store` to determine phase (idle / cooldown / completed)
5. If user submits a quiz, MCQFlow optimistically writes to store + POSTs to server
6. `useLearningSync` (mounted on the dashboard at `/learn`) syncs server ↔ store; on the lesson page, store mutations replay via the mutation queue

### 2.2 Why the lesson page doesn't mount `useLearningSync`

The sync hook is mounted once at `/learn` (the dashboard). On the lesson page we don't re-mount it — that would trigger a redundant `GET /dashboard`. Instead, store mutations during the lesson go into the offline queue and replay when the user returns to the dashboard.

If you build a new page that needs sync semantics, mount `useLearningSync()` at the top of that page's client component.

---

## 3. Recipe: Add a new chrome section component

Use this when the 12 existing sections don't cover a pattern you need. ALWAYS get founder sign-off first — chrome additions are constitutional.

```typescript
// src/components/learning-runtime/chrome/sections/MyNewSection.tsx

"use client";

import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import { SectionHeader } from "../SectionHeader";
import { renderInline } from "../lib/inline-markdown";

interface MyNewSectionProps {
  section: LessonSection;
  frontMatter: LessonFrontMatter;
}

export function MyNewSection({ section, frontMatter: fm }: MyNewSectionProps) {
  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      <SectionHeader
        eyebrow={`§${section.number}`}
        title={section.title}
        accentHex="#C28220"  // ← inherit from chapter accent rotation
      />
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "17px",
          lineHeight: 1.5,
          color: "var(--gl-ink-primary)",
        }}
      >
        {renderInline(section.body)}
      </p>
    </section>
  );
}
```

Then export from `chrome/index.ts`:

```typescript
export { MyNewSection } from "./sections/MyNewSection";
```

Then mount in the lesson page:

```typescript
// src/app/learn/[tier]/[module]/[chapter]/[lesson]/page.tsx
import { MyNewSection } from "@/components/learning-runtime/chrome";

// inside the LessonShell:
{sec13 && (
  <RevealSection>
    <MyNewSection section={sec13} frontMatter={fm} />
  </RevealSection>
)}
```

### Required invariants

- `scrollMarginTop: "120px"` (matches the sticky stack height)
- `id={\`sec-${section.number}\`}` so the journey rail can anchor to it
- Use tokens from `chrome/lib/tokens.ts`, NEVER raw px font sizes
- Use CSS variables for colors, NEVER raw hex
- Reading-content max-width 880px (the canonical reading column)
- Body italic/emphasis via `renderInline()` — never bare `<em>` or `<strong>`

---

## 4. Recipe: Add a new interactive component

Read [`curriculum/05-interactive-component-taxonomy.md`](../../../curriculum/05-interactive-component-taxonomy.md) first to confirm your idea matches an existing family.

### 4.1 File structure

```
src/components/learning-runtime/interactive/<your-component>/
├── index.tsx     — the React component
├── data.ts       — static lesson data (positions, labels, options)
└── README.md     — what it does, how it's used
```

### 4.2 Skeleton

```typescript
// src/components/learning-runtime/interactive/my-interactive/index.tsx

"use client";

import { useState, useEffect } from "react";
import { MY_DATA } from "./data";

export function MyInteractive() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      role="region"
      aria-label="My interactive title"
    >
      {MY_DATA.items.map((item, idx) => {
        const isActive = idx === activeIdx;
        return (
          <button
            key={item.slug}
            onClick={() => setActiveIdx(idx)}
            aria-pressed={isActive}
            className="gl-focus-ring gl-clickable"
            style={{
              transition: reducedMotion ? "none" : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              // ... rest of styling
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
```

### 4.3 Register in `interactive/registry.ts`

```typescript
import { MyInteractive } from "./my-interactive";
export const interactiveRegistry = {
  "my-interactive": MyInteractive,
  // ... others
};
```

### 4.4 Mount inside a lesson's ConceptTheatre

In the lesson page, pass it as a scene:

```typescript
<ConceptTheatre
  section={sec4}
  scenes={
    fm.slug === "my-lesson-slug" ? (
      <div className="space-y-8">
        <MyInteractive />
      </div>
    ) : undefined
  }
/>
```

### 4.5 Required invariants

- Full keyboard nav: `Enter` / `Space` activates the focused item; arrow keys move focus (if applicable)
- Every interactive button has `aria-label` (descriptive — not just "click here")
- Every interactive button has `aria-pressed` if it has a selected state
- `prefers-reduced-motion: reduce` must disable animations
- `gl-focus-ring` on every clickable that has `outline: none` or `border: none` in its base style
- `gl-clickable` on every `<button>` (default hover lift)
- Use `gl-surface-twilight-glass` for the container background

### 4.6 §4 vs §7 — what goes where (LOCKED 2026-05-24)

Every lesson with both §4 and §7 enabled has **two distinct interactive surfaces**, each with its own component:

| Section | Pedagogical purpose | L1 example | L2 example |
|---|---|---|---|
| **§4 Concept Theatre** | *explore each element* — painting + paired explorer that inspects one sub-concept at a time | `<VedangaBodyMap>` (image w/ baked-in clickable glyphs + side panel) | `<VedangaRelationshipDiagram>` (lotus image LEFT + 6 clickable Vedāṅga rows RIGHT) |
| **§7 Primary Simulator** | *synthesize the system* — richer mode that pulls all elements into ONE composite visualisation | `<VedicEcosystemOrbital>` (time-slider orbital) | `<JyotishaSangaHub>` (hub-and-spoke + sāṅga scenarios in 2 tabs) |

**Decision rule:** when adding a new lesson, you MUST build a §4 explorer. If the lesson has pedagogical depth worth a second mode (almost always true for Tier-1), you MUST also build a distinct §7 flagship. The two MUST share data files but render different visualisations. **Do not collapse them into one component.**

### 4.7 Routing §7 to a different component than §4 (the `SECTION_7_OVERRIDES` map)

The lesson frontmatter's `interactive.component_type` declares the §4 component. §7 may resolve to a different component via the `SECTION_7_OVERRIDES` map in `PrimarySimulator.tsx`:

```typescript
// src/components/learning-runtime/chrome/sections/PrimarySimulator.tsx

const SECTION_7_OVERRIDES: Readonly<Record<string, string>> = {
  "jyotisha-as-vedanga":                    "vedic-ecosystem-orbital",
  "the-six-vedangas-and-their-relationship": "jyotisha-sanga-hub",
  // Add new lessons: <slug>: <registry-key>
};
```

The slug is the lesson's frontmatter `slug`; the value is the key in `interactive/registry.ts`. `PrimarySimulator` looks up the override first; if no entry, it falls back to the frontmatter `interactive.component_type`.

To add a new lesson's §7:

1. Build the new component in `src/components/learning-runtime/interactive/<slug>/`
2. Register it in `interactive/registry.ts`
3. Add the lesson-slug → registry-key entry to `SECTION_7_OVERRIDES`
4. The lesson markdown's `interactive.component_type` stays pointing at the §4 explorer; the override map handles §7

### 4.8 Image-as-interactive-surface — when it's allowed and when it isn't (LOCKED 2026-05-24)

The §4 interactive is a 2-column composition: image LEFT, paired interactive RIGHT. The click affordances can live in EITHER half but never both — pick one based on the painting's baked-in visual content:

- **Clicks ON the painting (L1 pattern):** allowed ONLY when the bespoke PNG has baked-in visible affordances (glowing glyphs, icons, mandalas, etc.) at each click position. L1's `vedic-body-composite.png` has six painted glyphs that users SEE as touch targets, so invisible-button overlays on top are discoverable. The RIGHT card then carries guidance, a TRY THIS prompt, and a non-interactive legend.

- **Clicks ON the right card (L2 pattern):** required when the bespoke PNG has NO baked-in visible affordances (smooth shapes, decorative composition only). L2's `six-vedangas-lotus.png` has smooth petals, so invisible click overlays on the painting are undiscoverable. The painting stays as the contemplative LEFT card (no clicks), and the click targets become visible interactive rows / cards / chips in the RIGHT card.

**Critical anti-pattern:** putting invisible click overlays on a painting that lacks baked-in affordances. Users have no way to know the image is interactive — they read it as decorative and miss the entire interactive layer. This was the L2 mistake that took multiple iterations to correct. **When in doubt, put the clicks in the right card.**

---

## 5. Recipe: Add a chrome primitive

Don't. Open a design-review thread first; the existing primitives cover almost everything. If founder approves a new primitive:

1. Create at `src/components/learning-runtime/chrome/MyPrimitive.tsx`
2. Export from `chrome/index.ts`
3. Document in `chrome/MyPrimitive.tsx` with a JSDoc block explaining its role
4. Update [`00-design-constitution.md`](./00-design-constitution.md) §11 to add a row in the primitives table
5. Add a usage example in this cookbook

---

## 6. Recipe: Add a route under /learn

Use this pattern when you need a new dashboard page (e.g., `/learn/leaderboard`, `/learn/badges`, etc.).

```typescript
// src/app/learn/my-new-route/page.tsx

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My route · Grahvani",
};

export default function MyRoutePage() {
  // Server component: read from filesystem / call learning-service if you have a service token
  return (
    <MyClientComponent /* pass server-rendered props */ />
  );
}
```

```typescript
// src/components/learning-runtime/dashboard/MyClientComponent.tsx

"use client";

import { useLearningSync } from "@/hooks/learning/useLearningSync";

export function MyClientComponent() {
  const syncStatus = useLearningSync();   // if this page needs server-synced state
  // ... render
}
```

---

## 7. Recipe: Wire a new backend endpoint to the frontend

1. **Implement the endpoint in learning-service** (`src/interfaces/http/routes/learn.routes.ts`)
2. **Smoke-test with curl** — capture the real response shape (don't guess types from your imagination)
3. **Add the typed client** in `src/lib/api/learning.ts`:

```typescript
export interface MyPayload { /* match real shape */ }

export async function fetchMyThing(userId: string): Promise<MyPayload> {
  return apiFetch<{ success: true; data: MyPayload } | MyPayload>(
    url(`/learn/my-endpoint?userId=${encodeURIComponent(userId)}`),
  ).then(unwrap<MyPayload>);
}
```

4. **Consume in the component or hook**:

```typescript
const userId = getUserIdFromCurrentToken();
if (userId) {
  const data = await fetchMyThing(userId);
  // use data
}
```

5. **If it's a mutation**, also wire offline queueing via `enqueueMutation`:

```typescript
try {
  await postMyMutation({ userId, foo });
} catch {
  enqueueMutation({
    kind: "my-mutation",
    payload: { userId, foo },
    enqueuedAt: Date.now(),
    attempts: 0,
  });
}
```

And teach `useLearningSync` to handle `kind: "my-mutation"` in its dispatch switch.

---

## 8. Recipe: Use the design tokens

NEVER inline raw px font-size or hex colors. Always reference tokens.

```typescript
import { T, LH, LS, M, R, S } from "@/components/learning-runtime/chrome/lib/tokens";

// In a style object:
style={{
  fontSize: `${T.body}px`,           // 16px
  lineHeight: LH.normal,             // 1.5
  letterSpacing: LS.eyebrow,         // "0.10em"
  transition: `transform ${M.default}ms ${M.easing}`,
  borderRadius: `${R.md}px`,
  padding: `${S.md}px ${S.lg}px`,
}}
```

When the tokens don't fit your case, that's a signal to talk to the founder — not to invent a new value.

---

## 9. Recipe: Use the chapter accent palette

```typescript
// In a chrome component:
const CHAPTER_ACCENTS = ["#C28220", "#A23A1E", "#4F6FA8", "#3A8C5A"];
const accent = CHAPTER_ACCENTS[(frontMatter.chapter - 1) % 4];

// Or via CSS variable:
style={{ color: "var(--gl-ch1-bronze)" }}
```

The chapter accent flows through eyebrows, dividers, milestone-stone fills, lotus-petal gradients, and the energy-thread overlay on the Sacred Path.

---

## 10. Recipe: Render inline markdown safely

```typescript
import { renderInline } from "@/components/learning-runtime/chrome/lib/inline-markdown";

<p>{renderInline("Lorem **bold** *italic* `Vedāṅga` 'quoted-term' text.")}</p>
```

The renderer handles:
- `**bold**` → `<strong>`
- `*italic*` → `<em>` (italic Cormorant)
- `` `code` `` → `<em>` (italic Cormorant; Sanskrit terms)
- `'quoted'` → `<em>‘quoted’</em>` (with smart curly quotes, regex-guarded against apostrophe contractions)

Never bypass `renderInline` for in-line text — direct `<em>` would skip the apostrophe regex guard and the design-constitution-conformant styling.

---

## 11. Recipe: Use the journey rail

The left rail (`LessonJourneyRail.tsx`) is built once and shared by every lesson. To customise the rail meta for a section, edit the `presentationFor()` helper in `src/components/learning-runtime/lib/section-meta.ts`. Per-section accent color, eyebrow label, and time estimate all live there.

---

## 12. Recipe: Use the marginalia

The right rail (`SectionAwareMarginalia.tsx`) is also shared. It renders different cards depending on which section the learner is currently scrolling. To add a new marginalia card type:

1. Define the card component inside `SectionAwareMarginalia.tsx` (e.g., `function MyMarginalia({...})`)
2. Wire it into the `activeSection` switch logic
3. Each marginalia card uses `<MarginCard eyebrow ornament accentHex>` as its base

---

## 13. Recipe: Persist new fields in the progress store

If you need a new client-side field (e.g., `dailyStreakReminderDismissedAt`):

1. Add the field to `ProgressState` interface in `progress-store.ts`
2. Initialize it in the `create` block
3. Add an action to mutate it
4. **Bump the persist version** and add a migration:

```typescript
{
  name: "grahvani-learning-progress",
  version: 3,   // ← was 2; bump
  migrate: (persistedState, version) => {
    if (version < 3) {
      // ... safely hydrate the new field
    }
    return persistedState;
  },
}
```

Without the version bump, existing learners' localStorage will not get the new field hydrated.

---

## 14. Recipe: Add a new gamification metric to the dashboard

If the backend grows to expose `dashboard.somethingNew`, surface it in the frontend:

1. Update `DashboardPayload` type in `src/lib/api/learning.ts` to include the new field
2. Surface it in `useLearningSync` via the existing `dashboard` state in `syncStatus`
3. Read it in the `GamificationPanel.tsx` or a new dashboard sub-component
4. Display dynamically — no hardcoded fallbacks

---

## 15. Recipe: Run the full local stack

```bash
# 1. Backend (Postgres + Redis + learning-service)
cd backend
docker compose up -d postgres redis
cd services/learning-service
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" \
  NODE_ENV=development npm run dev
# Service now on :3013

# 2. Frontend
cd ../../../frontend
echo 'NEXT_PUBLIC_LEARNING_SERVICE_URL=http://localhost:3013/api/v1' >> .env.local
npm install
npm run dev
# Frontend now on :3000

# 3. Forge a JWT, inject into browser localStorage (see LOCAL_DEV_QUICKSTART.md §3)

# 4. Visit http://localhost:3000/learn/tier-1/module-1/chapter-1/lesson-1
```

---

## 16. The forbidden patterns (PR rejection)

| Pattern | Why it's forbidden |
|---|---|
| Raw `fontSize: "X.5px"` literal | Fractional sizes broke after the audit; use tokens |
| `color: "#A23A1E"` (raw hex) | Use `var(--gl-ch2-vermilion)` or a CSS var |
| `outline: none` without `gl-focus-ring` | A11y violation |
| `<button>` without `gl-clickable` | No hover affordance — inconsistent UX |
| Animation without `prefers-reduced-motion` guard | A11y violation |
| Inline-styled `<em>` instead of `renderInline()` | Bypasses apostrophe regex; can mis-render |
| `<section>` with `id="sec-N"` without `scrollMarginTop: "120px"` | Anchor lands behind chrome bar |
| Hardcoded "The Pilgrim" / "0 days" / "0 min" | Use dynamic store/server values |
| Editing chrome primitives without founder sign-off | Constitutional change requires amendment |
| New `useState` for data that should be in the progress store | State sprawl |

---

*End of FRONTEND_COOKBOOK v1.0 — 2026-05-22.*
