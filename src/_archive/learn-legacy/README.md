# Legacy Learn-Module — Archived 2026-05-21

This folder contains the **first-and-second-pass** implementation of the Grahvani learning module, authored by two prior developers. It was archived (not deleted) at the founder's direction on 2026-05-21 after a fresh-start decision: the prior work did not clear the world-class bar that the curriculum constitution demands (PhD-level content fidelity + Duolingo/Byju's-grade interactive pedagogy + brand-locked design system + every-concept-has-a-code-based-simulator commitment).

## What's here

| Path inside this folder | Original location in repo |
|---|---|
| `app/` | `src/app/learn/` (route tree: `learn`, `learn/daily`, `learn/progress`, `learn/lesson/[id]`) |
| `components/` | `src/components/learn/` (LessonSection, GenericLessonSidebar, LessonMetadataBar, MarkdownContent, InteractiveQuiz, plus per-module folders `module1/` through `module13/` with several `LessonNNInteractive.tsx` files and the `VedangaWheel`) |
| `api-learn.ts` | `src/lib/api/learn.ts` (typed API client for the legacy learn-service routes) |
| `lesson-parser.ts` | `src/lib/lesson-parser.ts` (markdown → typed structures parser; included `ParsedVedanga`, `ParsedComparison`, `ParsedSloka`, etc.) |
| `learningTokens.ts` | `src/design-tokens/learningTokens.ts` (a design-tokens file citing "Duolingo, Notion, Coursera" as inspirations; WCAG luminance helpers; never reached the bar) |

The `learnApi` re-export was also removed from `src/lib/api/index.ts` at the same time.

## Why archive instead of delete

- The new build will use this as a reference point for what *not* to do, and occasionally to lift small primitives (e.g., the markdown-parsing approach may inform — though not be copied into — the new lesson-runtime engine).
- The founder may want to compare the two builds side-by-side once the new lesson is live.
- Deletion is irreversible; archive is one `git mv` away from restoration if anything was misjudged.

## Important

- Nothing under `src/_archive/` should be imported by live application code. The `tsconfig.json` excludes this directory from typecheck.
- Do not edit files in here. If you find yourself wanting to fix something in `_archive/`, you almost certainly want to be editing the new lesson runtime instead.

The new lesson runtime lives at `src/app/learn/` (route), `src/components/learn/` (components), and `src/design-tokens/grahvani-learning/` (the new locked design system).
