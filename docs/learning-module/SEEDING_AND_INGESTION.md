# Grahvani Learning Module — Seeding & Ingestion Flow

> **The definitive answer to the question: "Markdown? DB? Hybrid?"** Read this and you will know exactly where every piece of lesson data lives, when it moves, and who/what owns it at every stage.

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED).
**Read time:** ~30 minutes.

---

## 0. TL;DR

**It is a HYBRID model with a strict directional rule:**

- **Markdown is the source of truth.** Lesson content (body, frontmatter, MCQ bank) lives in `curriculum/**/*.md` and `assessment-bank/**/*.json`.
- **The Postgres database is a downstream mirror** populated by a seed script that reads the markdown.
- **The frontend reads from BOTH** — curriculum tree from the filesystem (for navigation), per-user state from the database (for progress).
- **Content authors NEVER touch the DB.** Period. To publish a new lesson, you edit markdown and re-run the seeder.

---

## 1. The mental model

The hybrid is intentional and motivated:

| If we were | We'd have to |
|---|---|
| Markdown-only | Build a custom query layer to answer "which lessons has user X mastered" — slow, ad-hoc |
| DB-only | Lose the diff-able, git-tracked, reviewable-as-prose authoring workflow — slow, error-prone for content authors |
| **Hybrid (us)** | Authors edit markdown comfortably; runtime queries hit indexed Postgres; markdown stays canonical |

**The data flow always runs ONE DIRECTION at content-time:** `markdown → seeder → DB`. The DB is **never** the master copy of content. If the DB diverges from the markdown, the markdown wins; you re-seed.

**The data flow at runtime is bidirectional but role-specific:** the frontend reads progress *from* the DB (via learning-service) and writes mastery events *to* the DB. The frontend never writes lesson content; only per-user state.

---

## 2. What lives where — exhaustive map

### 2.1 In the markdown files (canonical, git-tracked)

| Asset | Path pattern |
|---|---|
| Lesson body + frontmatter | `curriculum/tier-N-name/module-NN-name/chapter-NN-name/lesson-NN-name.md` |
| Module overview | `.../module-NN-name/00-module-overview.md` |
| Chapter overview | `.../chapter-NN-name/00-chapter-overview.md` |
| MCQ bank for a lesson | `.../chapter-NN-name/assessment-bank/tier-N-mcq-bank/<lesson-slug>.json` |
| Interactive component specs | `.../chapter-NN-name/interactive-specs/<spec-name>.md` |
| Module README | `.../module-NN-name/README.md` (optional) |
| Constitutions, standards | `curriculum/00-*.md` through `curriculum/07-*.md` |

### 2.2 In the database (downstream, queryable)

Schema lives at `backend/services/learning-service/prisma/schema.prisma`. 21 tables; the lesson-content-derived ones are:

| Table | Source markdown field | Source MCQ JSON field |
|---|---|---|
| `Tier` | tier number + name from `curriculum/tier-N-*/` directory | — |
| `Module` | `module-NN-*/00-module-overview.md` heading + `00-module-overview.md` body | — |
| `Chapter` | `chapter-NN-*/00-chapter-overview.md` heading + body | — |
| `Lesson` | `lesson-NN-*.md` frontmatter (full schema) + section bodies | — |
| `LessonSection` | each `# §N Title` block in the lesson body | — |
| `McqBank` | — | `assessment-bank/.../<lesson-slug>.json` |
| `McqQuestion` | — | each question object inside the bank JSON |
| `BadgeDefinition` | hard-coded in `prisma/seed.ts` | — |

The per-user state tables are:

| Table | Populated by |
|---|---|
| `UserLearningProfile` | First time a `userId` interacts with any lesson |
| `LessonProgress` | `POST /lessons/:slug/section-view` and `POST /lessons/:slug/submit` |
| `ChapterProgress`, `ModuleProgress` | Computed by `progress.service.ts` after lesson mastery |
| `QuizAttempt` | Every `POST /lessons/:slug/submit` |
| `UserBadge` | When `gamification.service.ts` detects unlock |
| `PointsTransaction` | Every points-earning event |
| `SpacedRepetitionCard`, `UserSRSession` | After a lesson is mastered, cards generated for the lesson |
| `DailyActivity` | One row per user per day |
| `LeaderboardSnapshot` | Periodic recompute (cron, future) |
| `InteractiveEvent`, `InteractiveComponent` | Per-interactive analytics |

### 2.3 In the frontend (filesystem reads + DB reads)

| Frontend surface | Reads from |
|---|---|
| `/learn` dashboard module/chapter/lesson tree | **Filesystem** via `src/lib/learning-runtime/curriculum-index.ts` (server component) |
| `/learn/tier-N/module-N/chapter-N/lesson-N` lesson body | **Filesystem** via `src/lib/learning-runtime/lesson-loader.ts` (server component reads markdown) |
| MCQ bank inside that lesson | **Filesystem** via `src/lib/learning-runtime/mcq-loader.ts` (reads JSON) |
| Per-user progress (mastery, streak, points, badges) | **Database** via `useLearningSync` → `GET /api/v1/learn/dashboard` |
| MCQ submission grading | **Database** via `POST /api/v1/learn/lessons/:slug/submit` (server is the grader) |
| SRS deck "Today's Review" | **Database** via `GET /api/v1/learn/sr/today` |
| Gamification tiles (XP, badges, tier title) | **Database** via the dashboard payload |

### 2.4 The Astro Engine + Knowledge service

Some lessons (especially in Tier 1 module 4+ and Tier 2) call out to `astro-engine` for chart calculations or `knowledge-service` for lookups. Those services are **not** part of seeding — they're called at runtime. Lessons that need those services declare it in their frontmatter:

```yaml
interactive:
  enabled: true
  astro_engine_endpoints:
    - /panchanga
    - /rashi-chart
  fallback_if_offline: "..."
```

If `astro-engine` is down, the frontend should degrade gracefully — show the fallback message.

---

## 3. The seeding script — what it does step-by-step

Script: `backend/services/learning-service/prisma/seed.ts`. ~600 lines. Entry point: `npm run db:seed`.

```
1. Read curriculum root → discover tier-N directories
2. For each tier:
   a. Upsert into `Tier` table
   b. Discover module-NN directories inside
3. For each module:
   a. Read 00-module-overview.md → parse heading + body
   b. Upsert into `Module` table (denormalised: tier number, sequence)
   c. Discover chapter-NN directories inside
4. For each chapter:
   a. Read 00-chapter-overview.md → parse heading + body
   b. Upsert into `Chapter` table
   c. Discover lesson-NN-*.md files
5. For each lesson:
   a. gray-matter parses frontmatter + body
   b. Extract sections by `# §N Title` regex
   c. Upsert into `Lesson` table (one row per lesson)
   d. Upsert each section into `LessonSection` (one row per § block)
6. For each MCQ JSON file in assessment-bank/:
   a. Parse + validate against the MCQ schema (see curriculum/06)
   b. Upsert `McqBank` (one row per file)
   c. Upsert `McqQuestion` rows (one row per question)
7. Hard-coded list: 5 `BadgeDefinition` rows
8. Log summary: tiers, modules, chapters, lessons, badges seeded
```

**Smoke run on 2026-05-22:** 2 tiers, 48 modules, 146 chapters, 598 lessons, 5 badges. Idempotent — running twice produces zero changes.

### 3.1 The `import-lesson` CLI — single-file mode

Script: `backend/services/learning-service/scripts/import-lesson.ts`. Use this when you've just authored one lesson and don't want to re-seed everything.

```bash
JWT_SECRET="..." npm run import-lesson -- <path/to/lesson.md> [--dry-run] [--force]
```

- `--dry-run` — validate only, don't write to DB
- `--force` — skip non-fatal warnings (use only when you understand them)

Validates the lesson against `02-lesson-authoring-standard.md` rules before importing. If validation fails, the lesson is NOT imported and errors are printed.

### 3.2 The `reset-and-reseed` script — nuclear option

Script: `backend/services/learning-service/scripts/reset-and-reseed.ts`.

```bash
JWT_SECRET="..." npm run db:reset-seed
```

DROPS ALL TABLES, recreates the schema via `prisma db push`, then re-seeds. **Destroys per-user data.** Use only in dev environments — never in production.

---

## 4. The frontend's filesystem walk — `curriculum-index.ts`

The dashboard tree (modules → chapters → lessons with progress %) is built from the filesystem on every request because Next.js server components can read files at request time.

```
Source: src/lib/learning-runtime/curriculum-index.ts

Function: getCurriculumIndex(): CurriculumTier[]

What it does:
1. Resolves curriculum/ relative to the frontend's `process.cwd()`
2. Walks tier-N → module-NN → chapter-NN → lesson-NN-*.md
3. For each lesson file, runs gray-matter to extract frontmatter only
4. Returns a fully-typed tree:
   CurriculumTier[]
     └─ modules: CurriculumModule[]
         └─ chapters: CurriculumChapter[]
             └─ lessons: CurriculumLesson[]
                 (slug, sequence, title, titleDevanagari, targetMinutes,
                  bloomLevels, isAuthored, href, canonicalSlug)
5. Memoised at module level → reads filesystem once per process boot
```

`isAuthored` is `true` iff the file has `title` frontmatter + body length > 200 chars. This lets the dashboard show placeholder lessons differently from real ones.

---

## 5. Per-lesson runtime — how a page is served

When a learner visits `/learn/tier-1/module-1/chapter-1/lesson-1`:

```
1. Next.js routes to src/app/learn/[tier]/[module]/[chapter]/[lesson]/page.tsx (server component)
2. The page calls loadLesson(tier, module, chapter, lesson):
   a. Reads the markdown file from curriculum/
   b. gray-matter parses frontmatter
   c. Splits body by `# §N Title` regex into 12 sections
   d. Returns { frontMatter, sections }
3. If frontMatter.mcqBankFile is set, calls loadMcqBank() which:
   a. Reads the JSON file
   b. Validates against McqBank schema
   c. Returns the parsed bank
4. The page renders <LessonShell> with each section dispatched to its chrome component
5. <LessonTimeTracker slug={fm.slug} /> mounts client-side and starts accumulating time
6. <MCQFlow> in §10 reads the bank prop and renders the quiz idle screen
```

**At no point does the frontend touch the DB for content.** Content comes from the filesystem. The DB is consulted ONLY for per-user state.

---

## 6. Submission flow — what happens when a learner passes a quiz

```
1. Learner clicks "Check" on the last MCQ question
2. MCQFlow.finishQuiz() computes a local score (for optimistic UI)
3. Calls store.recordAttempt(slug, localScore, wrongIds) → local Zustand store updates
4. Calls submitLessonQuiz(slug, { userId, answers })
5. learning-service:
   a. Looks up the lesson by slug
   b. Loads the MCQ bank from DB
   c. Re-scores the submission using the DB bank (server is grader)
   d. Checks mastery requirements: ≥80% AND all sections viewed AND interactive interacted
   e. Updates LessonProgress, ChapterProgress, ModuleProgress
   f. Calculates points (correct answers × first-try bonus × time bonus + lesson completion bonus)
   g. Awards points via PointsTransaction
   h. Updates DailyActivity for the user-day
   i. Updates UserLearningProfile streak fields
   j. Checks if any badges unlock; creates UserBadge rows if so
   k. Returns full result: { score, passed, mastered, status, newStreak, newBadges, … }
6. MCQFlow reconciles:
   a. If server score differs from local → store.recordAttempt re-runs with server values
   b. Phase transitions to "completed-pass" or "cooldown"
7. useLearningSync's subscription detects the new attempt and ALSO fires section-view writes for the §s the learner just touched
8. Next call to fetchDashboard reflects the new state
```

If the server is unreachable, step 4 throws; MCQFlow's catch block calls `enqueueMutation` which writes the submission to localStorage; `useLearningSync` drains the queue on next `online` or `focus` event.

---

## 7. When markdown and DB disagree

This will happen. Possible causes:

| Cause | Symptom | Fix |
|---|---|---|
| Author edited markdown, didn't re-seed | New content not visible in dashboard search; mastered-lesson count miscounts | Run `npm run db:seed` |
| Author edited markdown, only ran import-lesson on one file | Other lessons in same chapter still old | Run `npm run db:seed` |
| Author deleted a lesson file | Stale DB row with no source | Run `npm run db:reset-seed` (destructive — only in dev) |
| Author renamed a lesson slug | New slug not in DB; old slug orphaned | Run `npm run db:reset-seed` OR manually delete the old row + import the new |
| DB row was hand-edited (forbidden) | Markdown re-seed overwrites the manual edit | Don't hand-edit. Fix the markdown. |

**The golden rule:** Run `npm run db:seed` after any markdown change. The seeder is idempotent and fast (~30 seconds for 598 lessons on a local machine). There is no reason to skip it.

---

## 8. The frontmatter schema (lesson-level)

This is what every lesson markdown file declares at the top. Every field flows into the `Lesson` table.

```yaml
---
# === Identity ===
slug: jyotisha-as-vedanga                                # MUST be globally unique
title: "Jyotiṣa as a Vedāṅga: One of the Six Limbs of the Veda"
title_devanagari: "ज्योतिष — वेद का एक अङ्ग..."
subtitle: "What Jyotiṣa actually is — placed within its proper textual home"

# === Placement ===
tier: 1
module: 1
module_slug: introduction-to-jyotisha
chapter: 1
chapter_slug: what-jyotisha-is
sequence: 1
canonical_path: "tier-1/module-1/chapter-1/lesson-01"

# === Pedagogical metadata ===
lesson_type: conceptual    # conceptual | procedural | practical
bloom_levels: [Remember, Understand]
target_minutes_reading: 14
target_minutes_total: 25

# === Stream coverage ===
streams: [parashari]       # parashari | kp | jaimini | lal-kitab | tajika | nadi
stream_neutrality: true

# === Dependencies ===
prerequisites: []
postrequisites:
  - tier-1/module-1/chapter-1/lesson-02-the-six-vedangas...

# === Learning outcomes ===
learning_outcomes:
  - "State that Jyotiṣa is one of the six Vedāṅgas..."
  - "Recite the six Vedāṅgas (Śikṣā, Kalpa, Vyākaraṇa, Nirukta, Chandas, Jyotiṣa)..."
  # 3-5 outcomes total, observable+measurable verbs only

# === Sources cited ===
primary_sources:
  - { ref: "Pāṇinīya Śikṣā 41-42", note: "The foundational śloka enumerating the six Vedāṅgas" }
modern_sources:
  - { ref: "Pingree (1981), HIL Vol VI", note: "Academic reference..." }

# === Interactive component (optional) ===
interactive:
  enabled: true
  component_type: vedanga-relationship-diagram
  spec_file: interactive-specs/vedanga-relationship-diagram.md
  astro_engine_endpoints: []
  fallback_if_offline: "Pre-rendered static diagram"

# === MCQ count ===
mcq_count: 6
mcq_bank_file: assessment-bank/tier-1-mcq-bank/jyotisha-as-vedanga.json

# === Audit & versioning ===
authoring_status: draft    # draft | technical-audit | pedagogical-audit | published
version: 1.0
last_updated: 2026-05-14
authors: ["Goutham Kadumuru"]
technical_reviewer: ""
pedagogical_reviewer: ""

# === Accessibility ===
has_devanagari: true
has_diagrams: true
has_audio_pronunciation: false
estimated_reading_grade: 13
---
```

For the full field-by-field spec → [`curriculum/02-lesson-authoring-standard.md`](../../../curriculum/02-lesson-authoring-standard.md).

---

## 9. The MCQ bank JSON schema

```json
{
  "lesson_slug": "jyotisha-as-vedanga",
  "version": "1.0",
  "questions": [
    {
      "id": "jyotisha-vedanga-mcq-001",
      "stem": "Which of the following is the **classical** reason Jyotiṣa is called the 'eye' of the Veda?",
      "question_type": "single-best",
      "bloom_level": "Understand",
      "difficulty": "medium",
      "options": [
        { "id": "A", "text": "...", "isCorrect": false },
        { "id": "B", "text": "...", "isCorrect": true },
        { "id": "C", "text": "...", "isCorrect": false },
        { "id": "D", "text": "...", "isCorrect": false }
      ],
      "explanation": "The 'eye' metaphor in *Pāṇinīya Śikṣā* 41-42...",
      "citation": "Pāṇinīya Śikṣā 41-42",
      "stream_neutral": true
    }
  ]
}
```

For full MCQ design rules → [`curriculum/06-assessment-design-standard.md`](../../../curriculum/06-assessment-design-standard.md).

---

## 10. Running the seeder — operational quickstart

### 10.1 First-time setup

```bash
# 1. Start Postgres + Redis
cd backend
docker compose up -d postgres redis

# 2. Push the Prisma schema to the DB
cd services/learning-service
npm install
npx prisma generate
npx prisma db push

# 3. Run the seeder
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" \
  NODE_ENV=development \
  npm run db:seed

# 4. Boot the service
JWT_SECRET="cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce" \
  NODE_ENV=development \
  npm run dev
```

### 10.2 After every markdown change

```bash
cd backend/services/learning-service
JWT_SECRET="..." npm run db:seed
```

### 10.3 Adding a single new lesson

```bash
cd backend/services/learning-service
JWT_SECRET="..." npm run import-lesson -- \
  ../../../curriculum/tier-1-foundation/module-01-introduction-to-jyotisha/chapter-01-what-jyotisha-is/lesson-02-the-six-vedangas.md
```

### 10.4 Validating a lesson WITHOUT importing

```bash
JWT_SECRET="..." npm run import-lesson -- <path> --dry-run
```

### 10.5 Linting all curricula

```bash
cd backend/services/learning-service
JWT_SECRET="..." npm run curriculum:lint
```

Runs structural checks against every lesson markdown (frontmatter completeness, section presence, MCQ bank existence, etc.).

---

## 11. The 21 Prisma tables — full list

For the schema definitions read `backend/services/learning-service/prisma/schema.prisma` directly. The list:

**Curriculum hierarchy (content):**
1. `Tier`
2. `Module`
3. `Chapter`
4. `Lesson`
5. `LessonSection` (12 rows per lesson typically; some lessons skip optional sections)

**Assessment:**
6. `McqBank`
7. `McqQuestion`
8. `QuizAttempt`

**Per-user progress:**
9. `UserLearningProfile`
10. `LessonProgress`
11. `ChapterProgress`
12. `ModuleProgress`

**Gamification:**
13. `BadgeDefinition`
14. `UserBadge`
15. `PointsTransaction`
16. `DailyActivity`
17. `LeaderboardSnapshot`

**Spaced repetition:**
18. `SpacedRepetitionCard`
19. `UserSRSession`

**Interactive analytics:**
20. `InteractiveComponent`
21. `InteractiveEvent`

**Bibliographic:**
22. `BibliographyEntry` (extra — for cross-lesson source registry, planned use in v1.1)

---

## 12. Edge cases & FAQs

### Q: A lesson appears in the filesystem but not in `/learn`. Why?

The lesson's frontmatter probably has `authoring_status: draft` or `isAuthored` evaluated to `false` (no `title` field, or body shorter than 200 chars). Check the frontmatter. To force display anyway, set `ALLOW_UNAPPROVED_SEED=true` env var on the frontend (dev only).

### Q: I changed an MCQ option's text. Will it reflect?

Only after `npm run import-lesson -- <lesson-path>` or `npm run db:seed`. The frontend lesson body reads the markdown directly, BUT the MCQ bank presented to learners is **the DB copy** because the server is the grader. So a markdown-only change to an MCQ option is invisible until re-seed.

### Q: I see a lesson with no MCQ bank. What happens at §10?

`MCQFlow` renders "MCQ bank not loaded for this lesson." The lesson is effectively un-passable. Author the bank, re-seed.

### Q: Two lessons have the same `slug`. What happens?

The seeder will violate the `Lesson.slug @@unique` constraint and fail. The Prisma error will name the colliding slug. Fix one lesson's slug and re-run.

### Q: Can I delete a lesson?

In dev: delete the markdown file, then `npm run db:reset-seed`. In production: do a proper DB migration that soft-deletes (`status: ARCHIVED`) rather than hard-deletes — `LessonProgress` rows reference the lesson.

### Q: How do interactive specs (`interactive-specs/*.md`) get into the DB?

They don't, currently. The component is implemented as a React file in `frontend/src/components/learning-runtime/interactive/`; the markdown spec is a design reference for the implementer. v1.1 plans an `InteractiveComponent` row that the interactive registers against for analytics.

---

## 13. Why we chose hybrid — the rationale (for the curious)

A markdown-only system would mean either: (a) recomputing aggregate progress (chapter %, module %, tier %) on every request by walking every file, which is slow; or (b) caching aggregate progress in some other store, which is just a DB by another name. Markdown is great for editing prose; it is awful for querying.

A DB-only system would mean lesson authoring happens in a CMS (Strapi, Sanity, etc.), or directly in psql. Neither survives a non-engineer author. Neither survives `git blame`. Neither survives 50 PRs a week reviewing prose. The markdown affordances — version control, diffs, pull-request review, branch-per-feature, full-text search via grep — are non-negotiable for a curriculum of this scale.

The hybrid eats the cost of one extra step (the seeder) to get the best of both. The seeder is the cost we pay.

---

*End of SEEDING_AND_INGESTION v1.0 — 2026-05-22.*
