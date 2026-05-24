# Tīrtha-Yātrā Mahā-Path — Learning Dashboard

**Approved 2026-05-22. Reference template: Tier 1 · Module 1 · Chapter 1 · Lesson 1.**

The `/learn` entry experience is a single continuous gamified pilgrimage in the Duolingo / Candy Crush idiom, rendered in Vedic-manuscript register. Sequential unlocks ARE the UI: nothing is reachable except along the path, and the path enforces the curriculum's prerequisite graph.

## The fractal

The curriculum is a 4-level tree (Tier → Module → Chapter → Lesson). The dashboard renders all four levels on **one canvas**, each as a self-similar segment of the same path:

| Level | Visual | Unlock rule | Count |
|---|---|---|---|
| Tier | Mountain band / sky region | All modules in prior tier mastered | 3 |
| Module | Kṣetra (village/temple-stop) along the river | All chapters in prior module mastered | 24 in Tier 1 |
| Chapter | Stūpa-milestone within a module | All lessons in prior chapter mastered | 3-6 per module |
| Lesson | Lotus-node on the chapter's micro-path | Prior lesson mastered | 3-7 per chapter |

The **Sacred Path** (already approved) is the chapter-level zoom — a tight S-curve with milestone stones and lotus nodes. The Mahā-Path *contains* this view at its deepest zoom; the higher zooms are new.

## Visual states

Every node — module, chapter, or lesson — has exactly three states:

| State | Visual | Interaction |
|---|---|---|
| **Mastered** | Full accent color, lotus open, drop-shadow glow, ✓ check seal | Clickable for review |
| **Active** | "You are here" beacon, pulsing halo, accent ring, breathing scale | Clickable, primary CTA |
| **Locked** | Desaturated, mist overlay, lock icon, "Complete X first" tooltip | Tooltip only, no nav |

## Path treatment

The path between nodes is a single SVG `<path>` rendered four times:

1. **Outer underglow** — 14px blurred halo, 10% opacity
2. **Main trail** — 2.6px dashed manuscript gold, 78% opacity
3. **Flowing dashes** — two animated layers at 5.5s and 8.5s loops (the "river of light")
4. **Lumen particles** — five small `<circle>` elements traveling with `<animateMotion>` + `<mpath>`, staggered every 2.4s

A **completed-energy thread** (3.2px stroke with bloom filter) overlays the *mastered* portion of the path so the walked road literally glows brighter than the unwalked road.

## Per-tier "skybox"

- **Tier 1 — Foundation**: river plains. Warm parchment cream, manuscript grain, soft cosmic backdrop.
- **Tier 2 — Practice**: foothills band visible above Tier 1, gauzy and locked until Tier 1 is 100%. Once unlocked, the band brightens.
- **Tier 3 — Mastery**: snow peaks at the top of the scroll. Only ever silhouettes until Tier 2 is complete.

Each tier transition is a "gateway" — a stūpa-arch (toraṇa) you pass through. Currently rendered as a dimmed silhouette with the tier title and "Master Tier N to unlock" copy.

## Per-module composition

A module-stop along the river is a tight composition:

```
┌──────────────────────────────────────────┐
│  ❶  Module 1 · Introduction to Jyotiṣa   │
│      ━━━━━━━━━━━━━━━━━━━━ 0 / 16 lessons │
│      ◯◯◯◯ Chapter dots                    │
│      "Build your foundation"             │
└──────────────────────────────────────────┘
```

- **Numeric medallion** — circular wax-seal-style stamp with module number
- **Title + Devanāgarī subtitle** — Cormorant serif
- **Progress bar** — chapter-mastery proportion
- **Chapter dots** — one small circle per chapter, filled when chapter mastered, accent-colored
- **Hint copy** — a one-line "why this module" snippet from `module-overview.md`

For the **active** module, the composition expands inline to show the Sacred Path sub-component — the existing chapter milestones + lotus lessons. For locked modules, the composition stays compact and mist-overlaid.

## Layout — the full /learn page from top to bottom

```
┌─────────────────────────────────────────────────────────────────┐
│  Sticky Ribbon  ·  Rank · Sync · Module Progress · 0/16 lessons │  ←  exists
├─────────────────────────────────────────────────────────────────┤
│  Welcome Hero  ·  Tier 1 of 3 · Continue here ▶ Lesson 1        │  ←  exists, kept compact
├─────────────────────────────────────────────────────────────────┤
│  Stats Triplet  ·  Streak · Today's Review · Tier 1 Progress    │  ←  exists
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│              ╔═══════════════════════════════════╗               │
│              ║  T H E   M A H Ā - P A T H        ║               │
│              ║                                    ║               │
│              ║      Tier 3 silhouette (locked)   ║               │
│              ║      Tier 2 silhouette (locked)   ║               │
│              ║      ──── Tier 3 gateway ────     ║               │
│              ║      ──── Tier 2 gateway ────     ║               │
│              ║       Module 24 (locked)          ║               │
│              ║       Module 23 (locked)          ║               │
│              ║            ⋮                       ║               │
│              ║       Module  2 (locked)          ║               │
│              ║   ★   Module  1 (ACTIVE — expands)║               │
│              ║       ⛩  ENTRANCE                  ║               │
│              ╚═══════════════════════════════════╝               │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Achievements Strip  ·  earned badges (wax seals)                │  ←  exists
└─────────────────────────────────────────────────────────────────┘
```

The right rail throughout the scroll holds the **GamificationPanel** (server XP, tier title, badges). The left rail (in the active-module zoom) holds the **ChapterTree** that's already built.

## Engineering invariants

- Path geometry uses polar/parametric coordinates so re-scaling for narrow viewports is one constant change
- All visual state derives from `useProgressStore` + `useLearningSync` — **zero hardcoded scalars**
- Sequential-unlock logic is computed by a single pure function `getNodeState(node, prior, progress) → "mastered" | "active" | "locked"`
- The Sacred Path becomes a *prop-driven sub-component* that the active module expands into — no duplicated code
- Server is source of truth for mastery; local store is the offline buffer; merge policy in `hydrateFromServer` is server-wins-on-conflict

## Implementation phases

1. **Build `LearningYatraMap`** with all 24 modules of Tier 1 + Tier 2/3 silhouettes + sequential unlock + visual states (this PR)
2. **Inline-expand the active module** into the existing Sacred Path component (this PR)
3. **Migrate all 24 modules to inherit Lesson 1's canonical design** (separate PR — content task)
4. **Add the tier-gateway ceremony animation** when Tier 1 completes (separate PR)
5. **Add zoom-out world-view** that fits all 3 tiers on screen (separate PR)
