# Grahvani Learning Module — Gamification Rules

> The exact formulas behind XP, streaks, tier titles, badges, scholar rank, SRS, and cooldown. Implementation lives in `backend/services/learning-service/src/services/gamification.service.ts` + `quiz.service.ts` + `frontend/src/lib/learning-runtime/rank.ts`. This document specifies the rules so docs and code can be cross-verified.

**Doc owner:** Goutham Kadumuru.
**Version:** 1.0 — 2026-05-22 (LOCKED).
**Pair-read with:** `backend/services/learning-service/src/services/gamification.service.ts`, `src/config/game-constants.ts`, `frontend/src/lib/learning-runtime/rank.ts`.

---

## 0. TL;DR

There are **two parallel progression systems** by design:

1. **XP / Tier title** (backend) — measures activity. You earn points; points unlock tier titles.
2. **Scholar rank** (frontend) — measures actual learning. Based on mastered-lesson count.

You can grind points without mastering content. You can master lessons without grinding. Both are shown because they tell different stories.

Plus: **streak**, **badges**, **SRS deck**, **cooldown**.

---

## 1. XP system — backend authoritative

### 1.1 Where XP comes from

| Event | Formula | Notes |
|---|---|---|
| **Correct MCQ answer** | Base points × time bonus × streak multiplier × first-try bonus | See §1.2 |
| **Lesson mastery bonus** | Tier-scaled flat bonus on first time MASTERED | One-time per lesson per user |
| **Daily login** | 10 points | Once per calendar day; dedupe via `DailyActivity.date` |
| **Streak milestones** | Bonus at 7, 30, 100, 365-day streaks | One-time per milestone |
| **Chapter completion** | Chapter completion bonus | One-time per (user, chapter) |
| **Module completion** | Module completion bonus | One-time per (user, module) |
| **Tier completion** | Tier completion bonus + ceremony unlock | One-time per (user, tier) |

### 1.2 Per-question point formula

Defined in `quiz.service.ts`:

```
basePoints       = 10                            (per correct answer)
timeBonus        = max(0, (60 - timeSpentSec) * 0.5)   (faster = more)
streakMultiplier = 1 + (runningStreak * 0.1)     (within the current attempt)
firstTryBonus    = isFirstAttempt ? 1.5 : 1.0

points = basePoints * timeBonus * streakMultiplier * firstTryBonus
```

The streak in `streakMultiplier` is **within-attempt** consecutive correct answers, not the daily streak.

### 1.3 Lesson completion bonus

Defined in `calculateLessonCompletionBonus(score, isFirstCompletion, attemptCount)`:

```
basebonus = score >= 95 ? 50 : score >= 85 ? 30 : 20
firstAttemptBonus = (attemptCount === 1) ? 25 : 0
perfectFirstTryBonus = (isFirstCompletion && score === 100 && attemptCount === 1) ? 50 : 0

bonus = basebonus + firstAttemptBonus + perfectFirstTryBonus
```

### 1.4 Where XP is stored

- Per-event: `PointsTransaction` table (one row per award)
- Aggregate: `UserLearningProfile.totalPoints`

`addPoints(userId, amount, reason, ...)` inserts a `PointsTransaction` row AND increments the profile.

---

## 2. Tier titles (XP-based, server-side)

Defined in `src/config/game-constants.ts`:

```typescript
TIER_THRESHOLDS = [0, 500, 1500, 3000, 5000, 8000];
TIER_TITLES = {
  1: "Jyotish Novice",
  2: "Vedanga Seeker",
  3: "Graha Scholar",
  4: "Nakshatra Adept",
  5: "Yoga Master",
  6: "Jyotish Acharya",
};
```

The dashboard `GET /dashboard` returns `currentTier` (1–6) and `title`. The frontend's `GamificationPanel` displays these. Progress to next tier is `(totalPoints - prevThreshold) / (nextThreshold - prevThreshold)`.

---

## 3. Scholar rank (mastered-lesson based, client-side)

Defined in `frontend/src/lib/learning-runtime/rank.ts`:

```typescript
RANK_LADDER = [
  { name: "Aspirant",     threshold: 0,   devanagari: "जिज्ञासुः" },
  { name: "Pilgrim",      threshold: 1,   devanagari: "तीर्थयात्री" },
  { name: "Padānuga",     threshold: 3,   devanagari: "पदानुगः" },
  { name: "Adhyāyī",      threshold: 8,   devanagari: "अध्यायी" },
  { name: "Sādhaka",      threshold: 20,  devanagari: "साधकः" },
  { name: "Vidyārthī",    threshold: 50,  devanagari: "विद्यार्थी" },
  { name: "Paṇḍita",      threshold: 120, devanagari: "पण्डितः" },
  { name: "Ācārya",       threshold: 300, devanagari: "आचार्यः" },
  { name: "Tīrtha-Sūrya", threshold: 598, devanagari: "तीर्थसूर्यः" },
];
```

`getRankFor(masteredCount)` returns `{ current, next, progressToNext, remainingToNext }`. Used by the StickyRibbon ("Welcome back, Pilgrim") and progression hints.

**Difference from tier title:** tier title is XP-grindable. Scholar rank requires actual mastery (≥80% MCQ + sections viewed + interactive interacted). You can't shortcut rank.

---

## 4. Streak

Defined in `gamification.service.ts` + frontend `progress-store.ts` (kept in sync):

### 4.1 Rules

- A "streak day" is a calendar day on which the user **passed at least one MCQ** OR **logged in (daily-login endpoint)**.
- `currentStreak` increments by 1 if today's activity continues yesterday's. Resets to 1 if there's a gap of one or more days.
- `longestStreak` updates whenever `currentStreak` exceeds it.
- `lastCompletedDate` (YYYY-MM-DD) is the most recent streak-eligible day.

### 4.2 Streak milestone bonuses

| Days | XP bonus | One-time? |
|---|---|---|
| 7 | +100 | Yes |
| 30 | +500 | Yes |
| 100 | +2000 | Yes |
| 365 | +10000 | Yes |

These are awarded when `currentStreak` first hits the milestone for a given user.

### 4.3 Where streak is displayed

| Surface | Value shown |
|---|---|
| `HeroStatRibbon` "Current Streak" tile | `streakDays` from `progress-store` |
| `GamificationPanel` (XP card) | not directly; reflected in tier progression |
| Sticky-ribbon (optional v1.1) | "X-day streak" chip |

---

## 5. Badges

### 5.1 Badge schema

```typescript
BadgeDefinition {
  slug:        string;        // "first-lesson", "seven-day-streak", "module-1-mastered"
  name:        string;        // "First Light"
  description: string;        // "Master your first lesson"
  iconUrl:     string|null;
  rarity:      "common" | "rare" | "epic" | "legendary";
  unlockCondition: {
    type: "mastered_count" | "streak" | "module_mastered" | "tier_mastered" | "perfect_score" | ...;
    value: number | string;
  };
}
```

### 5.2 Default seeded badges (5)

Hard-coded in `prisma/seed.ts`. Current set:

| Slug | Name | Rarity | Unlock |
|---|---|---|---|
| `first-light` | First Light | common | Master 1 lesson |
| `seven-day-flame` | Seven-Day Flame | rare | Reach 7-day streak |
| `chapter-conqueror` | Chapter Conqueror | rare | Master all lessons in a chapter |
| `module-finisher` | Module Finisher | epic | Master all chapters in a module |
| `tier-i-foundation` | Foundation Pilgrim | legendary | Master all lessons in Tier 1 |

### 5.3 Adding a new badge

1. Edit `prisma/seed.ts` — add the BadgeDefinition entry
2. Run `npm run db:seed`
3. Implement the unlock check in `gamification.service.ts` (`checkBadgesAfter(userId, event)`)
4. Test by triggering the unlock condition

### 5.4 Displaying badges

`GET /gamification/badges/:userId` returns `{ earned: BadgeRecord[], upcoming: BadgeRecord[] }`. The frontend `GamificationPanel.tsx` renders earned as gold-rimmed wax seals and the next upcoming with progress bar.

---

## 6. Mastery gate — what passes a lesson

A lesson moves to `status: MASTERED` if and only if ALL three:

1. **MCQ pass:** score ≥ 80% (the `PASS_THRESHOLD`)
2. **All sections viewed:** the user has triggered `POST /section-view` for every `§N` the lesson defines
3. **Interactive interacted:** if the lesson has an interactive (frontmatter `interactive.enabled: true`), at least one `POST /interactive-events` recorded

If only (1) succeeds but (2) or (3) hasn't, the status becomes `COMPLETED` — intermediate. The dashboard counts only MASTERED toward `lessonsCompleted`.

The pass check is `checkLessonMasteryRequirements(userId, lessonId)` in `progress.service.ts`.

---

## 7. Cooldown

Defined in `quiz.service.ts`:

- On a failed MCQ submission (score < 80%), `cooldownUntil = now + 24 hours`
- The frontend `MCQFlow` reads `isOnCooldown(slug)` from the progress store; backend independently returns HTTP 429 if a submit comes during cooldown
- Cooldown clears once the time elapses; the lesson goes back to "idle" phase

`COOLDOWN_HOURS = 24` in both `backend/services/learning-service/src/services/quiz.service.ts` AND `frontend/src/lib/learning-runtime/progress-store.ts`. They MUST match — if you change one, change both in the same PR.

---

## 8. Daily login

`POST /gamification/daily/login/:userId` — invoked once per dashboard mount by `useLearningSync`. Response:

```
{ pointsEarned, newBalance, streakUpdated, newStreak, streakContinued }
```

Server dedupes by `DailyActivity.date === today_yyyy-mm-dd` for that userId. If today's row already exists with `hadLogin: true`, returns `{ pointsEarned: 0, streakUpdated: false }`.

---

## 9. SRS (spaced repetition) — Today's Review

### 9.1 Card generation

When a lesson is mastered for the first time:
- `progress.service.ts` calls `spaced-repetition.service.ts:generateCardsForLesson(userId, lessonId)`
- The service extracts ~3–5 concept-anchor pairs from the lesson body (or from a future explicit `sr_anchors` frontmatter field)
- Creates `SpacedRepetitionCard` rows: `front` = anchor term, `back` = explanation, `intervalDays: 1`, `dueAt: now + 1 day`

### 9.2 Card scheduling (SM-2)

After each review:

```
quality (0–5) supplied by learner
if quality < 3:
  intervalDays = 1
  easeFactor stays
else:
  if reviewCount == 0:  intervalDays = 1
  if reviewCount == 1:  intervalDays = 6
  else:                 intervalDays *= easeFactor

easeFactor += (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
easeFactor = max(1.3, easeFactor)
dueAt = now + intervalDays days
```

This is the classic SM-2 algorithm (Anki / SuperMemo). Implementation in `spaced-repetition.service.ts`.

### 9.3 Today's deck

`GET /sr/today?userId` returns cards where `dueAt <= now` AND `userId === param`. Sorted by `dueAt asc` (most overdue first).

### 9.4 Frontend SRS surface

`/learn/review` route (`src/app/learn/review/page.tsx`) lists due cards stalest-first. Each card links back to its source lesson for full re-study, or supports inline quick-review (v1.1).

---

## 10. Lock/unlock cascade

(See `HANDOFF_PLAYBOOK.md` §9 for the high-level summary.)

### 10.1 Lesson unlock

The pure function `resolveModuleStates(modules, lessonsStore)` in `LearningYatraMap.tsx` (currently unmounted but the function lives there) is the **single source of truth** for lock state. It returns one of `"mastered" | "active" | "locked"` per node.

Rule: a node is `locked` until ALL of its prior siblings are mastered (`status === MASTERED`).

### 10.2 Server enforcement

The backend independently checks via `prerequisite.service.ts:checkAccess(userId, lessonId)` before accepting any `POST /submit` or `/section-view`. If locked, returns HTTP 403. Client-side lock display is UX-only; server is the gatekeeper.

### 10.3 Why two layers

If we trusted only the client, a tampered request could submit for a locked lesson. If we trusted only the server, the UI couldn't show "locked" UI without a roundtrip. Both layers are necessary.

---

## 11. Leaderboard (v1.1)

Schema exists (`LeaderboardSnapshot`). Endpoint exists (`GET /gamification/leaderboard`). UI surface not yet built.

Plan: weekly snapshot via cron job in learning-service, top-N learners by `totalPoints`. Surface in dashboard sidebar.

---

## 12. Things planned but not built

| Feature | Status | Planned for |
|---|---|---|
| Leaderboard UI | Backend endpoint exists; no frontend | v1.1 |
| Live tier-gateway ceremony animation | Tier 1 → Tier 2 unlock celebration | v1.1 |
| Per-streak-milestone confetti UI | Backend awards exist; frontend just bumps the number | v1.1 |
| Mahā-Path component | Built then reverted; see §30 of design constitution | v1.1 |
| Badge unlock toast notification | Backend creates UserBadge; frontend just shows it in panel | v1.2 |
| Sharing achievement to social | Not started | v2.0 |
| Streak freeze (one missed day grace) | Not built | v2.0 |

---

## 13. Verifying the rules — smoke commands

```bash
JWT="$(node -e 'const j=require("jsonwebtoken"); console.log(j.sign({userId:"dev-1",sub:"dev-1"},"cd240d9031f96046b4f42411d59ea3edc90a35a769ae4096042449b5508ad8ce",{expiresIn:"30d"}))')"
BASE="http://localhost:3013/api/v1/learn"

# Trigger daily login
curl -sS -X POST -H "Authorization: Bearer $JWT" "$BASE/gamification/daily/login/dev-1" | python3 -m json.tool

# Check streak
curl -sS -H "Authorization: Bearer $JWT" "$BASE/gamification/streak/dev-1" | python3 -m json.tool

# Check profile
curl -sS -H "Authorization: Bearer $JWT" "$BASE/gamification/profile/dev-1" | python3 -m json.tool

# Check badges
curl -sS -H "Authorization: Bearer $JWT" "$BASE/gamification/badges/dev-1" | python3 -m json.tool

# Submit a quiz attempt
curl -sS -X POST -H "Authorization: Bearer $JWT" -H "Content-Type: application/json" \
  -d '{"userId":"dev-1","answers":[{"questionId":"jyotisha-vedanga-mcq-001","answer":"B","timeSpentSeconds":15}]}' \
  "$BASE/lessons/jyotisha-as-vedanga/submit" | python3 -m json.tool
```

---

*End of GAMIFICATION_RULES v1.0 — 2026-05-22.*
