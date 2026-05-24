# Grahvani Learning Module — Developer Handoff Playbook

> **The single entry-point document for any new developer joining the learning module.** Start here, then read the documents this points you at. Estimated time to first useful PR: 4 hours.

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED, founder-approved).
**Audience:** Frontend devs, backend devs, content authors, designers, QA engineers, and anyone reviewing learning-module PRs.

---

## 0. TL;DR — what this product is, in 60 seconds

Grahvani's learning module is a **PhD-grade Jyotiṣa curriculum** delivered as ~2,000 lessons across three tiers (Foundation → Practice → Mastery). Each lesson is a structured 12-section experience with mandatory MCQ mastery gate, classical śloka citation, custom interactive components, and gamified progression (XP, streak, badges, rank).

**Architectural one-liner:** Markdown authors write lessons → a seeder ingests them into Postgres → frontend renders from a hybrid source (filesystem for curriculum tree, DB for per-user state) → server-grader enforces mastery → client UI shows progress.

**Reference implementation:** Tier 1 · Module 1 · Chapter 1 · Lesson 1 (`jyotisha-as-vedanga`). Every other lesson in the curriculum inherits its visual vocabulary, structural composition, and interaction model.

---

## 1. The three constitutions you MUST read

These are non-negotiable authorities. They override every personal opinion.

| Document | What it governs | Lines |
|---|---|---|
| [`curriculum/00-curriculum-constitution.md`](../../../curriculum/00-curriculum-constitution.md) | **What** is taught — vision, target learners, philosophical commitments | 270 |
| [`curriculum/02-lesson-authoring-standard.md`](../../../curriculum/02-lesson-authoring-standard.md) | **How** lesson markdown is structured — 12-section template, frontmatter schema, MCQ format | 751 |
| [`frontend/docs/learning-module/00-design-constitution.md`](./00-design-constitution.md) | **How** lessons render on screen — typography, color, motion, layout, accessibility, inheritance rules | 1,924 |

If your PR contradicts any of the three, your PR is wrong. Read them first.

---

## 2. Where everything lives — the source tree

```
Grahvani/
├── curriculum/                        ← markdown source of truth (authored content)
│   ├── 00-curriculum-constitution.md
│   ├── 01-pedagogical-framework.md
│   ├── 02-lesson-authoring-standard.md   ← critical
│   ├── 03-source-citation-standard.md
│   ├── 04-devanagari-iast-conventions.md
│   ├── 05-interactive-component-taxonomy.md
│   ├── 06-assessment-design-standard.md
│   ├── 07-tier-progression-map.md
│   └── tier-1-foundation/
│       └── module-01-introduction-to-jyotisha/
│           └── chapter-01-what-jyotisha-is/
│               ├── 00-chapter-overview.md
│               ├── lesson-01-jyotisha-as-vedanga.md       ← canonical reference
│               ├── lesson-02-the-six-vedangas...md
│               └── assessment-bank/
│                   └── tier-1-mcq-bank/
│                       └── jyotisha-as-vedanga.json
│
├── backend/
│   ├── docker-compose.yml             ← grahvani-pg + grahvani-redis + meilisearch
│   ├── .env                            ← canonical JWT_SECRET lives here
│   └── services/
│       ├── learning-service/          ← THE BACKEND FOR THIS MODULE
│       │   ├── prisma/
│       │   │   ├── schema.prisma      ← 21 tables (Lesson, Progress, Badge, etc.)
│       │   │   └── seed.ts            ← markdown → DB ingestion
│       │   ├── scripts/
│       │   │   ├── import-lesson.ts   ← single-file CLI for one lesson
│       │   │   └── reset-and-reseed.ts
│       │   ├── src/
│       │   │   ├── main.ts            ← Express entry, port 3013
│       │   │   ├── interfaces/http/routes/
│       │   │   │   ├── learn.routes.ts   ← /api/v1/learn/* endpoints
│       │   │   │   └── admin.routes.ts
│       │   │   ├── routes/
│       │   │   │   └── gamification.routes.ts  ← /gamification/* endpoints
│       │   │   ├── services/
│       │   │   │   ├── progress.service.ts
│       │   │   │   ├── gamification.service.ts
│       │   │   │   ├── quiz.service.ts
│       │   │   │   ├── spaced-repetition.service.ts
│       │   │   │   └── milestone.service.ts
│       │   │   └── config/
│       │   │       └── game-constants.ts  ← tier thresholds, titles
│       │   └── README.md              ← service runbook (see SECTION 7 below)
│       ├── auth-service/              ← JWT issuer, port 3001
│       ├── user-service/              ← port 3002
│       ├── client-service/            ← port 3008
│       ├── api-gateway/               ← port 8080, routes /api/v1/* → services
│       └── ...
│
└── frontend/
    ├── docs/learning-module/
    │   ├── 00-design-constitution.md          ← v1.0 LOCKED
    │   ├── MAHA_PATH_DASHBOARD.md             ← v1.1 deferred
    │   ├── HANDOFF_PLAYBOOK.md                ← THIS FILE
    │   ├── SEEDING_AND_INGESTION.md
    │   ├── FRONTEND_COOKBOOK.md
    │   ├── GAMIFICATION_RULES.md
    │   ├── IMAGES_AND_ASSETS.md
    │   ├── QA_CHECKLIST.md
    │   └── LOCAL_DEV_QUICKSTART.md
    └── src/
        ├── app/
        │   ├── learn/
        │   │   ├── page.tsx                    ← /learn dashboard
        │   │   ├── review/page.tsx             ← /learn/review (SRS)
        │   │   └── [tier]/[module]/[chapter]/[lesson]/page.tsx   ← lesson route
        │   └── globals.css                     ← CSS variables + utility classes
        ├── components/learning-runtime/
        │   ├── chrome/                         ← lesson chrome primitives
        │   │   ├── lib/
        │   │   │   ├── tokens.ts               ← T/LH/LS/M/R/S design tokens
        │   │   │   └── inline-markdown.tsx
        │   │   ├── sections/                   ← 11 section components
        │   │   ├── layout.tsx                  ← LessonShell + breadcrumb chrome
        │   │   ├── LessonJourneyRail.tsx       ← left rail
        │   │   ├── SectionAwareMarginalia.tsx  ← right rail
        │   │   ├── typography.tsx              ← Devanagari, IAST, Sloka, TermTooltip
        │   │   └── reading.tsx                 ← Citation, Bibliography, ReflectionPrompt
        │   ├── interactive/                    ← custom lesson interactives
        │   │   ├── vedanga-body-map/
        │   │   ├── vedanga-vs-vedanta-comparator/
        │   │   ├── sloka-recitation-frame/
        │   │   └── vedic-ecosystem-orbital/
        │   ├── dashboard/                      ← /learn dashboard composition
        │   └── LessonTimeTracker.tsx
        ├── hooks/learning/
        │   └── useLearningSync.ts              ← bridges store ↔ backend
        └── lib/
            ├── api/
            │   ├── learning.ts                 ← typed client for learning-service
            │   └── jwt.ts                      ← getUserIdFromCurrentToken
            └── learning-runtime/
                ├── progress-store.ts           ← Zustand + localStorage
                ├── curriculum-index.ts         ← server-side filesystem walk
                ├── lesson-loader.ts
                ├── mcq-loader.ts
                ├── rank.ts                     ← 9-tier rank ladder
                ├── time-tracker.ts
                └── mutation-queue.ts           ← offline write queue
```

---

## 3. The hybrid data architecture

This is the most important diagram to internalize. Confusion here is the #1 source of new-dev mistakes.

```
                ┌────────────────────────────────────────────────┐
                │  CONTENT AUTHORS                               │
                │  edit markdown in `curriculum/` only           │
                │  NEVER touch the database directly             │
                └─────────────────┬──────────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────────┐
                    │  curriculum/**/*.md          │ ← canonical source of truth
                    │  + assessment-bank/*.json    │
                    └─────────────────┬───────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       ▼                              ▼
              ┌────────────────┐            ┌─────────────────────┐
              │ npm run db:seed │            │ Frontend SSR        │
              │ (Prisma seed)   │            │ curriculum-index.ts │
              └────────┬───────┘            │ lesson-loader.ts    │
                       │                    └──────────┬──────────┘
                       ▼                               │
              ┌────────────────────┐                   │
              │  Postgres          │                   │
              │  (grahvani-pg)     │                   │
              │  21 tables          │                   │
              └────────┬───────────┘                   │
                       │                               │
                       │ ←── learning-service          │
                       ▼     (port 3013)               │
              ┌────────────────────┐                   │
              │ /api/v1/learn/*    │                   │
              │ /dashboard         │                   │
              │ /lessons/:slug/    │                   │
              │   ↳ /quiz           │                   │
              │   ↳ /submit         │                   │
              │   ↳ /section-view   │                   │
              │ /sr/today          │                   │
              │ /gamification/*    │                   │
              └────────┬───────────┘                   │
                       │                               │
                       │ JWT-authenticated             │
                       ▼                               ▼
              ┌─────────────────────────────────────────────┐
              │ Frontend                                    │
              │ - useLearningSync (Zustand + offline queue)│
              │ - MCQFlow submits to server-grader          │
              │ - GamificationPanel reads dashboard payload │
              │ - CurrentModuleFocus + Sacred Path render   │
              │   curriculum tree from FILESYSTEM,          │
              │   progress from BACKEND                     │
              └─────────────────────────────────────────────┘
```

### Rules

1. **Markdown is canonical.** Never edit the DB to change lesson content — re-run the seeder instead.
2. **DB is per-user state + queryable mirror.** Treat it as derived, not authoritative for content.
3. **Frontend curriculum-tree reads from filesystem.** This is intentional: faster than a DB roundtrip, simpler dependency.
4. **Frontend per-user state reads from DB via learning-service.** Mastery, streak, points, badges, time invested.
5. **Server is the grader.** Client computes a local score for optimistic UI; server's verdict reconciles. Never trust the client.
6. **Offline writes queue locally** in `grahvani-learning-mutation-queue` localStorage key; replay on `online`/`focus` events.

For the seeding flow in detail, read [`SEEDING_AND_INGESTION.md`](./SEEDING_AND_INGESTION.md).

---

## 4. Reading order — the prescribed path for a new developer

If you spend more than 2 days on the learning module you will be expected to have read everything in this list. The estimated times below assume careful reading + skimming code.

### Day 1 (4 hours) — orientation

1. **This file (HANDOFF_PLAYBOOK.md)** — 30 min — you are here
2. **[`curriculum/00-curriculum-constitution.md`](../../../curriculum/00-curriculum-constitution.md)** — 30 min — *why* this product exists
3. **[`frontend/docs/learning-module/00-design-constitution.md`](./00-design-constitution.md)** §§1-15 — 90 min — the visual system
4. **Open `/learn/tier-1/module-1/chapter-1/lesson-1` in browser** — 30 min — experience the canonical reference
5. **Read the lesson markdown** at `curriculum/.../lesson-01-jyotisha-as-vedanga.md` — 30 min — see what authors write
6. **Skim `src/components/learning-runtime/chrome/`** — 30 min — get familiar with the component tree

### Day 2 (4 hours) — engineering depth

1. **[`curriculum/02-lesson-authoring-standard.md`](../../../curriculum/02-lesson-authoring-standard.md)** — 60 min — the frontmatter schema + 12-section template
2. **[`SEEDING_AND_INGESTION.md`](./SEEDING_AND_INGESTION.md)** — 30 min — how markdown becomes DB rows
3. **[`backend/services/learning-service/README.md`](../../../backend/services/learning-service/README.md)** — 60 min — endpoints, services, schema
4. **[`FRONTEND_COOKBOOK.md`](./FRONTEND_COOKBOOK.md)** — 60 min — how to add a new section or interactive
5. **[`LOCAL_DEV_QUICKSTART.md`](./LOCAL_DEV_QUICKSTART.md)** — 30 min — get a local stack running and submit one MCQ

### Day 3 (3 hours) — operational depth

1. **[`GAMIFICATION_RULES.md`](./GAMIFICATION_RULES.md)** — 45 min — XP formulas, streak math, badge thresholds
2. **[`IMAGES_AND_ASSETS.md`](./IMAGES_AND_ASSETS.md)** — 30 min — image standards
3. **[`QA_CHECKLIST.md`](./QA_CHECKLIST.md)** — 30 min — what to verify before merging
4. **[`curriculum/05-interactive-component-taxonomy.md`](../../../curriculum/05-interactive-component-taxonomy.md)** — 60 min — the interactive component families
5. **[`curriculum/06-assessment-design-standard.md`](../../../curriculum/06-assessment-design-standard.md)** — 30 min — MCQ authoring rules

### Day 4+ (as needed)

- [`docs/05-database.md`](../../../docs/05-database.md) — Prisma multi-schema setup
- [`docs/06-services.md`](../../../docs/06-services.md) — full microservices map
- [`docs/09-developer-guide.md`](../../../docs/09-developer-guide.md) — platform-wide dev guide
- [`MAHA_PATH_DASHBOARD.md`](./MAHA_PATH_DASHBOARD.md) — the deferred-to-v1.1 gamified world-map (read if assigned the rebuild)

---

## 5. The 12-section lesson structure (memorize this)

Every lesson in Grahvani has exactly these sections in this order. Some may be empty for a given lesson but the order never changes.

| § | Section | Chrome component | Mandatory? |
|---|---|---|---|
| 1 | Cold Open (hook) | `ColdOpen.tsx` | YES |
| 2 | Scholar's Contract (prereqs) | `OrientationCards.tsx` | YES |
| 3 | Learning Outcomes | `OrientationCards.tsx` (paired with §2) | YES |
| 4 | Concept Theatre (body + interactives) | `ConceptTheatre.tsx` + custom interactives | YES |
| 5 | Sanskrit Śloka Block | `SlokaBlock.tsx` | YES *if a primary classical source is cited* |
| 6 | Worked Example | `WorkedExample.tsx` | Optional for conceptual lessons; mandatory for procedural |
| 7 | Primary Simulator | `PrimarySimulator.tsx` | Optional for theory lessons; mandatory for chart-reading lessons |
| 8 | Mistake Card Deck | `MistakeCardDeck.tsx` | Optional |
| 9 | Memory Anchor Deck | `MemoryAnchorDeck.tsx` | Optional |
| 10 | MCQ Flow (mastery gate) | `MCQFlow.tsx` | YES — mastery is non-negotiable |
| 11 | Summary ("Anchored In") | `Summary.tsx` | YES |
| 12 | Continuation (next lesson) | `Continuation.tsx` | YES |

If you find yourself wanting a §13, you don't. Open an authoring discussion instead.

---

## 6. The frontend chrome library — what's already built

These are the visual primitives. **NEVER reinvent these.** If you need a button, use one of these. If you need a callout, use one of these. If the primitive you need doesn't exist, propose adding it as a chrome primitive — don't inline-style a one-off.

| Primitive | Purpose | File |
|---|---|---|
| `<LessonShell>` | The page frame — brand chrome, breadcrumb bar, 3-column canvas | `chrome/layout.tsx` |
| `<LessonJourneyRail>` | Left rail journey progress | `chrome/LessonJourneyRail.tsx` |
| `<SectionAwareMarginalia>` | Right rail context-aware marginalia | `chrome/SectionAwareMarginalia.tsx` |
| `<SectionHeader>` | Eyebrow + title block for every section | `chrome/SectionHeader.tsx` |
| `<SectionDivider>` | Decorative divider between sections | `chrome/SectionDivider.tsx` |
| `<RevealSection>` | IntersectionObserver-driven fade-in wrapper | `chrome/RevealSection.tsx` |
| `<MarkdownContent>` | Renders lesson body markdown to React | `chrome/MarkdownContent.tsx` |
| `<Devanagari>`, `<IAST>`, `<Sloka>`, `<DropCap>`, `<TermTooltip>` | Sanskrit-aware typography | `chrome/typography.tsx` |
| `<Citation>`, `<Bibliography>`, `<ReflectionPrompt>` | Reading-surface primitives | `chrome/reading.tsx` |
| `renderInline(text)` | Inline markdown → React (bold/italic/code/'quote') | `chrome/lib/inline-markdown.tsx` |
| `T`, `LH`, `LS`, `M`, `R`, `S` design tokens | Type/spacing/motion canonical scale | `chrome/lib/tokens.ts` |
| `.gl-focus-ring`, `.gl-clickable`, `.gl-lesson-anchor` | Utility classes | `app/globals.css` |

How to add a new section component → [`FRONTEND_COOKBOOK.md`](./FRONTEND_COOKBOOK.md) §3.

---

## 7. The backend services that touch the learning module

| Service | Port | Role | Lives in |
|---|---|---|---|
| **learning-service** | 3013 | The primary backend for everything in this module | `backend/services/learning-service/` |
| auth-service | 3001 | Issues JWTs that learning-service verifies | `backend/services/auth-service/` |
| user-service | 3002 | User profiles (separate from learning state) | `backend/services/user-service/` |
| api-gateway | 8080 | Routes `/api/v1/learn/*` → learning-service | `backend/services/api-gateway/` |
| grahvani-pg | 5432 | Postgres database (all services share one cluster, separate schemas) | Docker container |
| grahvani-redis | 6379 | Cache layer (rate limits, session) | Docker container |

For the learning-service runbook → [`backend/services/learning-service/README.md`](../../../backend/services/learning-service/README.md).

---

## 8. The 10 verified backend endpoints (smoke-tested 2026-05-22)

All under `/api/v1/learn/`. All accept JWT in `Authorization: Bearer <token>` header. The `userId` is also required as a query param or path segment — extracted from the JWT's `userId`/`sub` claim by `getUserIdFromCurrentToken()` in the frontend.

| # | Method | Path | Purpose |
|---|---|---|---|
| 1 | GET | `/dashboard?userId=…` | Composite payload: tier, streak, points, progress[], badges |
| 2 | GET | `/lessons/:slug/quiz` | Server-side MCQ bank for display |
| 3 | POST | `/lessons/:slug/submit` | Server-grader; body `{ userId, answers: [{ questionId, answer, timeSpentSeconds }] }` |
| 4 | POST | `/lessons/:slug/section-view` | Track section views; body `{ userId, sectionId: number }` |
| 5 | GET | `/sr/today?userId=…` | SRS deck for today |
| 6 | POST | `/sr/:cardId/review` | Submit SRS card review |
| 7 | GET | `/gamification/streak/:userId` | Streak details |
| 8 | GET | `/gamification/badges/:userId` | `{ earned[], upcoming[] }` |
| 9 | GET | `/gamification/profile/:userId` | Skill score, tier, points, title |
| 10 | POST | `/gamification/daily/login/:userId` | Daily login award + streak bump |

For full contracts → [`backend/services/learning-service/README.md`](../../../backend/services/learning-service/README.md). For gamification rules behind these endpoints → [`GAMIFICATION_RULES.md`](./GAMIFICATION_RULES.md).

---

## 9. The locking/unlocking model

The single most important UX rule of this product: **learners progress sequentially. There are no shortcuts on a sacred road.**

### 9.1 Lesson unlock

A lesson is `locked` until the immediately-prior lesson in its chapter is `Mastered` (MCQ pass + all sections viewed + interactive interacted). The first lesson of any chapter is always unlocked. This is enforced at TWO layers:

- **UI layer:** Locked lessons show a lock icon, desaturated styling, mist veil; the click handler is disabled.
- **Server layer:** `learning-service` rejects submission attempts for locked lessons with HTTP 403.

### 9.2 Chapter unlock

A chapter is `locked` until ALL lessons in the prior chapter are `Mastered`. Same dual-layer enforcement.

### 9.3 Module unlock

A module is `locked` until ALL chapters in the prior module are `Mastered`.

### 9.4 Tier unlock

A tier is `locked` until ALL modules in the prior tier are `Mastered`. Tier 1 → Tier 2 transition triggers a gateway ceremony (deferred to v1.1).

### 9.5 Pure-function implementation

The locking logic is a SINGLE pure function `resolveModuleStates(modules, lessonsStore)` in `src/components/learning-runtime/dashboard/LearningYatraMap.tsx`. It returns `ModuleResolution[]` with `state: "mastered" | "active" | "locked"`. If you want to change the rule (e.g., allow horizontal jumps once Tier 1 is 50% complete), you change exactly ONE function.

---

## 10. The gamification system at a glance

Detailed spec in [`GAMIFICATION_RULES.md`](./GAMIFICATION_RULES.md). Quick reference:

| Mechanism | Where it lives | Brief rule |
|---|---|---|
| **XP / points** | `learning-service/src/services/gamification.service.ts` | Earned per correct question, lesson completion bonus, daily login, streak milestones |
| **Streak** | Updated on every passed MCQ + daily login | Consecutive calendar-day count; resets on missed day |
| **Tier titles** | `src/config/game-constants.ts` | 6 tiers: Jyotish Novice → Vedanga Seeker → Graha Scholar → Nakshatra Adept → Yoga Master → Jyotish Acharya. Thresholds: 0/500/1500/3000/5000/8000 XP |
| **Badges** | `BadgeDefinition` + `UserBadge` Prisma tables | Earned on conditions (first lesson, 7-day streak, 10 lessons mastered, etc.) |
| **Scholar rank** (frontend display) | `src/lib/learning-runtime/rank.ts` | 9-tier ladder: Aspirant → Pilgrim → Padānuga → Adhyāyī → Sādhaka → Vidyārthī → Paṇḍita → Ācārya → Tīrtha-Sūrya. Derived from mastered-lesson count, NOT XP. |
| **SRS deck** | `learning-service/src/services/spaced-repetition.service.ts` + frontend `/learn/review` | Mastered lessons re-surface after 7 days for review |
| **Mastery cooldown** | `quiz.service.ts` | Failed MCQ attempts trigger 24-hour cooldown before retry |

### Two parallel rank systems — IMPORTANT

There are intentionally **two** rank-like systems:

1. **Tier title** (backend `dashboard.title`) — based on **XP**, returns from server. Used in the GamificationPanel.
2. **Scholar rank** (frontend `rank.ts`) — based on **mastered-lesson count**, computed client-side. Used in the StickyRibbon greeting ("Welcome back, Pilgrim").

These are not duplicates. XP measures activity (you can grind points without mastering). Mastered count measures actual learning. Both are displayed because they tell different stories.

---

## 11. The frontend state architecture

```
useAuthTokenStore          (Zustand, plain)
   └─ accessToken, refreshToken                    ← JWT for backend auth

useProgressStore           (Zustand + persist, localStorage)
   ├─ lessons[slug] = LessonProgress               ← per-lesson mastery, attempts
   ├─ streakDays, longestStreak, lastCompletedDate ← derived from passed MCQs
   ├─ totalTimeMs, perLessonTimeMs[slug]           ← accumulated by useTimeTracker
   └─ Migration v1 → v2 hydrates new fields on app open

useLearningSync()          (custom hook)
   ├─ on mount: fetchDashboard(userId) → hydrateFromServer
   ├─ on store mutation: write-through to backend
   ├─ on offline: enqueueMutation to mutation-queue
   └─ on online/focus: drain queue
```

Detailed component-data flow → [`FRONTEND_COOKBOOK.md`](./FRONTEND_COOKBOOK.md) §2.

---

## 12. Common workflows — what new devs will be asked to do

### 12.1 "Add a new lesson"

1. Read [`curriculum/02-lesson-authoring-standard.md`](../../../curriculum/02-lesson-authoring-standard.md)
2. Copy `lesson-01-jyotisha-as-vedanga.md` as a template
3. Edit the 12 sections + frontmatter
4. Create the MCQ bank JSON under `assessment-bank/`
5. Run `npm run import-lesson -- <path>` to validate + import
6. Verify in browser at `/learn/tier-N/module-N/chapter-N/lesson-N`
7. Submit PR; reviewer follows [`QA_CHECKLIST.md`](./QA_CHECKLIST.md)

### 12.2 "Add a new interactive component"

1. Read [`curriculum/05-interactive-component-taxonomy.md`](../../../curriculum/05-interactive-component-taxonomy.md)
2. Read [`FRONTEND_COOKBOOK.md`](./FRONTEND_COOKBOOK.md) §4
3. Create `src/components/learning-runtime/interactive/<your-component>/index.tsx`
4. Add a data file at `src/components/learning-runtime/interactive/<your-component>/data.ts` for static content
5. Register in `interactive/registry.ts`
6. Mount inside `ConceptTheatre`'s `scenes` prop for the target lesson
7. Verify aria-labels, keyboard navigation, `prefers-reduced-motion` respect (constitutional invariants)
8. Submit PR

### 12.3 "Add a new chrome primitive"

This is a constitutional change — propose first, build second. Read [`00-design-constitution.md §11`](./00-design-constitution.md) and open a design-review thread before writing code.

### 12.4 "Change a gamification rule"

Edit `backend/services/learning-service/src/services/gamification.service.ts` AND update [`GAMIFICATION_RULES.md`](./GAMIFICATION_RULES.md). Doc and code MUST move together. Update via DB migration if `BadgeDefinition` rows need to change.

### 12.5 "Run the seeder for a single new lesson"

```bash
cd backend/services/learning-service
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" \
  npm run import-lesson -- ../../../curriculum/tier-1-foundation/module-01-introduction-to-jyotisha/chapter-01-what-jyotisha-is/lesson-02-the-six-vedangas.md
```

### 12.6 "Re-seed the entire curriculum"

```bash
cd backend/services/learning-service
npm run db:seed
```

This reads ALL markdown files under `curriculum/` and upserts them into Postgres. Idempotent — safe to re-run.

### 12.7 "Reset the database and re-seed from scratch"

```bash
cd backend/services/learning-service
npm run db:reset-seed
```

Destructive — drops all tables, recreates schema, re-seeds.

---

## 13. The non-negotiables — what gets your PR rejected

| Violation | Where | Severity |
|---|---|---|
| New typography rung introduced (size/family not in `T`/`LH`/`LS`) | `src/components/learning-runtime/` | Block |
| Hex color literal in chrome (use CSS variables) | `src/components/learning-runtime/` | Block |
| `outline: none` without `gl-focus-ring` class | Anywhere accessibility matters | Block |
| Animation without `prefers-reduced-motion` guard | Any new keyframe | Block |
| `<button>` without `gl-clickable` class | Any new button | Block |
| Section without `scrollMarginTop: "120px"` | New `<section>` element with `id="sec-N"` | Block |
| Italic text size-changes (no 1.05em scaling) | Anywhere using `<em>` or `<i>` | Block |
| Skipping §10 MCQ Flow | New lesson | Block |
| New color outside the chapter accent + graha palette | Lesson | Block |
| Editing the DB to fix lesson content | Anywhere | **HARD block** — fix the markdown, re-seed |
| Hardcoded user values ("The Pilgrim", "0 days") | Dashboard | Block |
| Markdown content with un-tightened apostrophe quotes | Curriculum | Block (will mis-render) |
| Adding `[FOUNDER]` to the design constitution without sign-off | Constitution | Block |

For the full review checklist → [`QA_CHECKLIST.md`](./QA_CHECKLIST.md).

---

## 14. Contact / escalation

| Question type | Contact | Channel |
|---|---|---|
| Curriculum content (what to teach) | Goutham Kadumuru | Direct |
| Design constitution amendment | Goutham Kadumuru | Direct + design-review thread |
| Backend infrastructure | DevOps lead (TBD) | Slack #grahvani-backend |
| Production incident | On-call rotation (TBD) | PagerDuty |
| General "how do I" question | This playbook → other docs in order | Self-serve first; ask if stuck >30 min |

---

*End of HANDOFF_PLAYBOOK v1.0 — 2026-05-22.*
*If you read this and any of the doc paths broken — file an issue. This document IS the contract between Goutham and the team taking over.*
