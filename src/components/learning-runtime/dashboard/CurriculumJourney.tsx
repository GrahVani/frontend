/**
 * Curriculum Journey — Grahvani Learn dashboard at /learn.
 *
 * v4 ground-up rebuild 2026-05-22 addressing five systemic critiques:
 *   1. Alien terminology removed — English-first ("Module 1") not "Kṣetra I"
 *   2. Arabic numerals throughout — readable to every learner
 *   3. Glassmorphism + skeuomorphism as the material vocabulary
 *   4. Information hierarchy: every section answers ONE clear question
 *   5. Canvas density: less empty space, more value per scroll
 *
 * Sections (top to bottom):
 *   - StickyRibbon         identity + module progress + streak
 *   - WelcomeHero          welcome + breadcrumb + current lesson card + deck
 *   - CurrentModuleFocus   3-col: chapter tree | path | stats
 *   - ModuleGrid           all 24 modules in Tier 1 as illustrated cards
 *   - TierProgress         Tier 1 overall bar + Tier 2/3 locked previews
 *   - AchievementsStrip    earned + upcoming seals
 *
 * Type scale: 56 / 36 / 24 / 18 / 15 / 12.
 * Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
 */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Flame, Check, Lock, ArrowRight, Award, Layers, BookOpen, Target, TrendingUp, Sparkles, Clock } from "lucide-react";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";
import { getRankFor } from "@/lib/learning-runtime/rank";
import { useLearningSync } from "@/hooks/learning/useLearningSync";
import { GamificationPanel } from "./GamificationPanel";

/** Format a millisecond time-investment into a learner-readable string. */
function formatModuleTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return "0 min";
  const totalMinutes = Math.floor(ms / 60_000);
  if (totalMinutes < 1) return "< 1 min";
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}
import type { CurriculumTier, CurriculumModule } from "@/lib/learning-runtime/curriculum-index";
import { ModuleIllustration } from "./module-illustrations";
import { ScrollReveal } from "./scroll-reveal";

/* ═══════ Type scale ═══════ */
const T = {
  hero: "56px",
  display: "36px",
  title: "24px",
  body: "18px",
  caption: "15px",
  micro: "12px",
} as const;

/* ═══════ Base colors ═══════ */
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

/* ═══════ Per-module palette (24 distinct accent colors) ═══════ */
interface ModulePaletteEntry {
  accent: string;
  glow: string;
  /** Short thematic descriptor used as the module subtitle when no Sanskrit name exists. */
  hint: string;
}
/**
 * Manuscript-harmonic 24-color palette. All entries belong to the same
 * Vedic-manuscript world (warm bronzes, deep blues, jades, vermilions,
 * aubergines, terracottas). No web-default lime/pink/mint — replaced with
 * tones that sit naturally beside parchment-gold.
 */
const MODULE_PALETTE: ModulePaletteEntry[] = [
  { accent: "#C28220", glow: "rgba(194, 130, 32, 0.38)",  hint: "Begin here" },           // 1 Introduction · bronze
  { accent: "#4A6FA5", glow: "rgba(74, 111, 165, 0.34)",  hint: "Time & Calendar" },      // 2 Time · twilight
  { accent: "#2F8C5A", glow: "rgba(47, 140, 90, 0.34)",   hint: "Daily Almanac" },        // 3 Pañcāṅga · jade
  { accent: "#A23A1E", glow: "rgba(162, 58, 30, 0.34)",   hint: "Twelve Signs" },         // 4 Rāśis · vermilion
  { accent: "#6F4FA8", glow: "rgba(111, 79, 168, 0.34)",  hint: "Nine Planets" },         // 5 Grahas · amethyst
  { accent: "#CC9028", glow: "rgba(204, 144, 40, 0.38)",  hint: "Twelve Houses" },        // 6 Bhāvas · saffron
  { accent: "#2A6E80", glow: "rgba(42, 110, 128, 0.34)",  hint: "Lunar Mansions" },       // 7 Nakṣatras · teal
  { accent: "#B85050", glow: "rgba(184, 80, 80, 0.34)",   hint: "Sight Lines" },          // 8 Aspects · rose
  { accent: "#4A4A9A", glow: "rgba(74, 74, 154, 0.34)",   hint: "Sub-divisions" },        // 9 Divisional · indigo
  { accent: "#8B5A2B", glow: "rgba(139, 90, 43, 0.34)",   hint: "Time Cycles" },          // 10 Daśā · umber
  { accent: "#4A9683", glow: "rgba(74, 150, 131, 0.34)",  hint: "Planet in Motion" },     // 11 Transits · viridian
  { accent: "#A88B3F", glow: "rgba(168, 139, 63, 0.34)",  hint: "Strength Matrix" },      // 12 Aṣṭakavarga · ochre
  { accent: "#8B5C82", glow: "rgba(139, 92, 130, 0.34)",  hint: "Vital Force" },          // 13 Strengths · mulberry
  { accent: "#5F7E58", glow: "rgba(95, 126, 88, 0.34)",   hint: "Combinations" },         // 14 Yogas · moss
  { accent: "#B57340", glow: "rgba(181, 115, 64, 0.34)",  hint: "Remedies" },             // 15 Remedies · copper
  { accent: "#3A6FA8", glow: "rgba(58, 111, 168, 0.34)",  hint: "KP Stream" },            // 16 KP · steel blue
  { accent: "#704A9A", glow: "rgba(112, 74, 154, 0.34)",  hint: "Jaimini Stream" },       // 17 Jaimini · violet
  { accent: "#8E2F2F", glow: "rgba(142, 47, 47, 0.34)",   hint: "Lāl Kitāb" },            // 18 Lal Kitāb · rust
  { accent: "#3D8270", glow: "rgba(61, 130, 112, 0.34)",  hint: "Tājika Stream" },        // 19 Tājika · emerald
  { accent: "#7A8B3F", glow: "rgba(122, 139, 63, 0.34)",  hint: "Nāḍī Stream" },          // 20 Nāḍī · olive
  { accent: "#B5993F", glow: "rgba(181, 153, 63, 0.34)",  hint: "Numerology" },           // 21 Numerology · honey
  { accent: "#3F5FA8", glow: "rgba(63, 95, 168, 0.34)",   hint: "Sacred Space" },         // 22 Vastu · sapphire
  { accent: "#5A3F8B", glow: "rgba(90, 63, 139, 0.34)",   hint: "Auspicious Time" },      // 23 Muhūrta · plum
  { accent: "#A85A3F", glow: "rgba(168, 90, 63, 0.34)",   hint: "Ethics & History" },     // 24 Ethics · terracotta
];
function paletteForModule(idx: number): ModulePaletteEntry {
  return MODULE_PALETTE[idx % MODULE_PALETTE.length];
}

/* ═══════ Per-chapter palette (4 colors for chapters within a module) ═══════ */
const CHAPTER_PALETTES = [
  { accent: "#C28220", tint: "rgba(194, 130, 32, 0.10)", border: "rgba(194, 130, 32, 0.45)" },
  { accent: "#A23A1E", tint: "rgba(162, 58, 30, 0.10)",  border: "rgba(162, 58, 30, 0.45)" },
  { accent: "#4F6FA8", tint: "rgba(79, 111, 168, 0.10)", border: "rgba(79, 111, 168, 0.45)" },
  { accent: "#3A8C5A", tint: "rgba(58, 140, 90, 0.10)",  border: "rgba(58, 140, 90, 0.45)" },
];

const GOLD = "#C28220";
const GOLD_LIGHT = "#E8A85C";
const GOLD_DEEP = "#9C7A2F";

/* ═══════ Material recipes — glass + skeuomorphic surfaces ═══════ */
const glassPanel: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255, 252, 240, 0.85) 0%, rgba(255, 252, 240, 0.55) 100%)",
  backdropFilter: "blur(20px) saturate(160%)",
  WebkitBackdropFilter: "blur(20px) saturate(160%)",
  border: "1px solid rgba(255, 255, 255, 0.55)",
  borderRadius: "20px",
  boxShadow:
    "0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 rgba(139, 90, 43, 0.10) inset, 0 14px 40px rgba(62, 42, 31, 0.10), 0 4px 12px rgba(62, 42, 31, 0.06)",
};
const skeuoCard: React.CSSProperties = {
  background:
    "linear-gradient(180deg, rgba(255, 252, 240, 0.94) 0%, rgba(252, 230, 184, 0.62) 100%)",
  border: "1px solid rgba(156, 122, 47, 0.22)",
  borderRadius: "18px",
  boxShadow:
    "0 1px 0 rgba(255, 255, 255, 0.88) inset, 0 -1px 0 rgba(139, 90, 43, 0.14) inset, 0 10px 30px rgba(62, 42, 31, 0.10), 0 3px 10px rgba(62, 42, 31, 0.06)",
};

interface CurriculumJourneyProps {
  tiers: CurriculumTier[];
}

export function CurriculumJourney({ tiers }: CurriculumJourneyProps) {
  const lessons = useProgressStore((s) => s.lessons);
  const streakDays = useProgressStore((s) => s.streakDays);
  const longestStreak = useProgressStore((s) => s.longestStreak);
  const perLessonTimeMs = useProgressStore((s) => s.perLessonTimeMs);
  // Bridge the local progress store with the learning-service backend.
  // No-op when there's no JWT; transparent fallback when backend is unreachable.
  const syncStatus = useLearningSync();
  // Re-subscribe to lessons so the deck recomputes when mastery changes.
  // (We intentionally don't call getReviewDeck() directly to avoid lying about reactivity.)

  const tier1 = tiers.find((t) => t.sequence === 1);
  const focusModule = tier1?.modules.find((m) => m.totalAuthoredLessons > 0) ?? tier1?.modules[0];

  const focusLessons = useMemo(() => {
    if (!focusModule) return [];
    return focusModule.chapters.flatMap((ch, chIdx) =>
      ch.lessons.map((l, lIdxInCh) => ({ chapter: ch, lesson: l, chIdx, lIdxInCh })),
    );
  }, [focusModule]);

  const nextLesson = useMemo(() => {
    for (const r of focusLessons) {
      if (r.lesson.isAuthored && lessons[r.lesson.canonicalSlug]?.masteryStatus !== "Mastered") {
        return r;
      }
    }
    return null;
  }, [focusLessons, lessons]);

  const masteredCount = useMemo(
    () => Object.values(lessons).filter((l) => l?.masteryStatus === "Mastered").length,
    [lessons],
  );

  const moduleMasteredCount = useMemo(() => {
    if (!focusModule) return 0;
    return focusModule.chapters
      .flatMap((c) => c.lessons)
      .filter((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered").length;
  }, [focusModule, lessons]);

  // ── Live derived signals: rank, review deck, module time ───────────────
  const rank = useMemo(() => getRankFor(masteredCount), [masteredCount]);

  const reviewDeck = useMemo(() => {
    const now = Date.now();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    const items: Array<{ slug: string; lastAttemptedAt: number; stalenessMs: number }> = [];
    for (const slug in lessons) {
      const l = lessons[slug];
      if (!l || l.masteryStatus !== "Mastered" || l.attempts.length === 0) continue;
      const lastAt = l.attempts[l.attempts.length - 1].attemptedAt;
      const staleness = now - lastAt;
      if (staleness >= SEVEN_DAYS) items.push({ slug, lastAttemptedAt: lastAt, stalenessMs: staleness });
    }
    items.sort((a, b) => b.stalenessMs - a.stalenessMs);
    return items;
  }, [lessons]);

  const reviewDeckCount = reviewDeck.length;

  const moduleTimeMs = useMemo(() => {
    if (!focusModule) return 0;
    let sum = 0;
    for (const ch of focusModule.chapters) {
      for (const l of ch.lessons) {
        sum += perLessonTimeMs[l.canonicalSlug] ?? 0;
      }
    }
    return sum;
  }, [focusModule, perLessonTimeMs]);

  if (!tier1 || !focusModule) {
    return <div style={{ padding: "120px", color: INK_PRIMARY }}>Loading curriculum…</div>;
  }

  return (
    <div className="gl-surface-night" style={{ minHeight: "100vh", position: "relative", paddingBottom: "96px" }}>
      <StickyRibbon
        moduleNum={focusModule.sequence}
        moduleTitle={focusModule.title}
        moduleMastered={moduleMasteredCount}
        moduleTotal={focusModule.totalLessons}
        tierTotal={tier1.totalLessons}
        masteredCount={masteredCount}
        rankName={rank.current.name}
        syncStatus={syncStatus}
      />

      <WelcomeHero
        tier={tier1}
        module={focusModule}
        nextLesson={nextLesson}
        masteredCount={masteredCount}
        moduleMastered={moduleMasteredCount}
        streakDays={streakDays}
        longestStreak={longestStreak}
        reviewDeckCount={reviewDeckCount}
      />

      <ScrollReveal>
        <CurrentModuleFocus
          module={focusModule}
          nextSlug={nextLesson?.lesson.canonicalSlug}
          lessons={lessons}
          moduleMasteredCount={moduleMasteredCount}
          moduleTimeMs={moduleTimeMs}
          syncStatus={syncStatus}
        />
      </ScrollReveal>

      <ScrollReveal offsetPx={40}>
        <ModuleGrid tier={tier1} focusModuleSlug={focusModule.slug} lessons={lessons} />
      </ScrollReveal>

      <ScrollReveal>
        <TierProgress tier={tier1} masteredCount={masteredCount} otherTiers={tiers.filter((t) => !t.isAvailable)} />
      </ScrollReveal>

      <ScrollReveal>
        <AchievementsStrip masteredCount={masteredCount} />
      </ScrollReveal>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * 1 · STICKY RIBBON
 * ════════════════════════════════════════════════════════════════════ */
function StickyRibbon({
  moduleNum,
  moduleTitle,
  moduleMastered,
  moduleTotal,
  tierTotal: _tierTotal,
  masteredCount: _masteredCount,
  rankName,
  syncStatus,
}: {
  moduleNum: number;
  moduleTitle: string;
  moduleMastered: number;
  moduleTotal: number;
  tierTotal: number;
  masteredCount: number;
  rankName: string;
  syncStatus: { hasIdentity: boolean; isHydrated: boolean; isReachable: boolean; queuedMutationCount: number };
}) {
  const pct = moduleTotal > 0 ? (moduleMastered / moduleTotal) * 100 : 0;
  const syncLabel = !syncStatus.hasIdentity
    ? "Local only"
    : syncStatus.queuedMutationCount > 0
      ? `${syncStatus.queuedMutationCount} pending sync`
      : syncStatus.isReachable
        ? "Synced"
        : syncStatus.isHydrated
          ? "Synced"
          : "Offline";
  const syncDotColor = !syncStatus.hasIdentity
    ? "#7A6747"
    : syncStatus.queuedMutationCount > 0
      ? "#C28220"
      : syncStatus.isReachable
        ? "#3A8C5A"
        : "#A23A1E";
  return (
    <div
      style={{
        position: "sticky",
        top: "56px", // sit below the fixed GRAHVANI brand header (h-14)
        zIndex: 30,
        background: "linear-gradient(180deg, rgba(255, 249, 234, 0.92) 0%, rgba(250, 239, 216, 0.85) 100%)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: "1px solid rgba(156, 122, 47, 0.20)",
        boxShadow: "0 1px 0 rgba(255, 255, 255, 0.60) inset, 0 4px 16px rgba(62, 42, 31, 0.06)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "12px 32px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "28px", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            aria-hidden="true"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 4px 10px ${GOLD}55`,
            }}
          >
            <span lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "18px", color: "#FFF9F0" }}>ॐ</span>
          </div>
          <div>
            <p style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: T.micro, color: INK_MUTED, fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>
              The {rankName}
              <span
                title={syncLabel}
                aria-label={`Sync status: ${syncLabel}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "10px",
                  letterSpacing: "0.10em",
                  color: syncDotColor,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: syncDotColor,
                    boxShadow: `0 0 6px ${syncDotColor}`,
                  }}
                />
                {syncLabel}
              </span>
            </p>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.body, color: INK_PRIMARY, fontWeight: 500, lineHeight: 1.2 }}>
              Welcome back, {rankName}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "560px", margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <span style={{ fontSize: T.micro, color: INK_SECONDARY, fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 600 }}>
              Module {moduleNum} progress · {moduleTitle}
            </span>
            <span style={{ fontSize: T.micro, color: GOLD_DEEP, fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 700, letterSpacing: "0.06em" }}>
              {moduleMastered} / {moduleTotal} lessons
            </span>
          </div>
          <div
            style={{
              height: "6px",
              borderRadius: "999px",
              background: "rgba(156, 122, 47, 0.16)",
              boxShadow: "inset 0 1px 2px rgba(62, 42, 31, 0.16)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${Math.max(2, pct)}%`,
                background: `linear-gradient(to right, ${GOLD_LIGHT}, ${GOLD})`,
                borderRadius: "999px",
                boxShadow: `0 0 14px ${GOLD}aa, 0 1px 0 rgba(255, 255, 255, 0.6) inset`,
              }}
            />
          </div>
        </div>

        {/* Streak + mastered chips removed — duplicates of HeroSidePanel (Current Streak)
            and AchievementsStrip (Wax Seals). The ribbon stays minimal: identity + the one
            piece of info that genuinely belongs sticky-visible (current module progress). */}
      </div>
    </div>
  );
}
function RibbonChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 16px",
        borderRadius: "999px",
        background: "rgba(255, 252, 240, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.28)",
        boxShadow: "0 1px 0 rgba(255, 255, 255, 0.65) inset",
      }}
    >
      <span style={{ color: GOLD_DEEP }}>{icon}</span>
      <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: T.caption, color: INK_SECONDARY, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * 2 · WELCOME HERO — the page's anchor
 * ════════════════════════════════════════════════════════════════════ */
function WelcomeHero({
  tier,
  module: m,
  nextLesson,
  masteredCount,
  moduleMastered: _moduleMastered,
  streakDays,
  longestStreak,
  reviewDeckCount,
}: {
  tier: CurriculumTier;
  module: CurriculumModule;
  nextLesson: { chapter: CurriculumModule["chapters"][number]; lesson: CurriculumModule["chapters"][number]["lessons"][number] } | null;
  masteredCount: number;
  moduleMastered: number;
  streakDays: number;
  longestStreak: number;
  reviewDeckCount: number;
}) {
  return (
    <section style={{ position: "relative", padding: "64px 32px 48px", overflow: "hidden" }}>
      {/* Background mandala — soft */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 0 }}>
        <span lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "clamp(220px, 28vw, 380px)", color: GOLD_DEEP, opacity: 0.045, lineHeight: 1, userSelect: "none" }}>
          ज्योतिष
        </span>
      </div>
      {/* Soft radial warm light */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 40%, ${GOLD_LIGHT}1A 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1440px", margin: "0 auto" }}>
        {/* Slim eyebrow only — the H1 + subtitle were duplicating content already inside
            the hero card below. The card is the hero; the eyebrow just orients you. */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.24em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", padding: "8px 22px", borderRadius: "999px", background: "rgba(252, 230, 184, 0.55)", border: `1px solid ${GOLD}55`, boxShadow: "0 1px 0 rgba(255, 255, 255, 0.65) inset" }}>
            <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: GOLD }} />
            Tier {tier.sequence} of 3 · The {tier.title}
          </p>
        </div>

        {/* Hero card — now spans full width and uses imagery + content composition. */}
        <CurrentLessonHeroCard tier={tier} module={m} nextLesson={nextLesson} />

        {/* Horizontal 3-card data ribbon below the hero. */}
        <HeroStatRibbon
          masteredCount={masteredCount}
          tierTotal={tier.totalLessons}
          streakDays={streakDays}
          longestStreak={longestStreak}
          reviewDeckCount={reviewDeckCount}
        />
      </div>
    </section>
  );
}

function CurrentLessonHeroCard({
  tier,
  module: m,
  nextLesson,
}: {
  tier: CurriculumTier;
  module: CurriculumModule;
  nextLesson: { chapter: CurriculumModule["chapters"][number]; lesson: CurriculumModule["chapters"][number]["lessons"][number] } | null;
}) {
  if (!nextLesson) {
    return (
      <div style={{ ...skeuoCard, padding: "48px", textAlign: "center" }}>
        <Sparkles size={32} style={{ color: GOLD }} />
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.title, color: INK_PRIMARY, marginTop: "16px" }}>
          All authored lessons complete.
        </h2>
      </div>
    );
  }
  const { chapter, lesson } = nextLesson;
  return (
    <article
      className="gl-hero-card"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        background: `linear-gradient(135deg, rgba(255, 252, 240, 0.96) 0%, rgba(252, 230, 184, 0.62) 100%), url(/assets/learning/manuscript-grain.svg)`,
        backgroundBlendMode: "multiply",
        border: `1px solid ${GOLD}33`,
        boxShadow:
          "0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 rgba(139, 90, 43, 0.10) inset, 0 24px 48px rgba(62, 42, 31, 0.10), 0 6px 16px rgba(62, 42, 31, 0.06)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)",
      }}
    >
      {/* Top gold-leaf hairline ribbon across the whole card */}
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: "1px", background: `linear-gradient(to right, transparent, ${GOLD}88 30%, ${GOLD_LIGHT} 50%, ${GOLD}88 70%, transparent)` }} />

      {/* LEFT — content column */}
      <div style={{ padding: "40px 44px 36px", display: "flex", flexDirection: "column" }}>
        <p style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.24em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "18px" }}>
          <Sparkles size={13} />
          Continue your journey
        </p>

        {lesson.titleDevanagari && (
          <p lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "22px", color: GOLD_DEEP, marginBottom: "12px", fontWeight: 500, opacity: 0.85, lineHeight: 1.3 }}>
            {lesson.titleDevanagari.split(":")[0]}
          </p>
        )}

        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: `clamp(28px, 3.4vw, 40px)`, fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.1, marginBottom: "16px", letterSpacing: "0.003em" }}>
          {lesson.title}
        </h2>

        {/* Single-line breadcrumb pill */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "12px", fontSize: "13.5px", color: INK_SECONDARY, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", lineHeight: 1.4 }}>
          <span><b style={{ color: INK_PRIMARY, fontWeight: 600, fontStyle: "normal", fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em" }}>Module {m.sequence}</b> · Chapter {chapter.sequence} · Lesson {lesson.sequence} of {chapter.lessons.length}</span>
        </div>

        <p style={{ fontSize: "15px", color: INK_MUTED, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", marginBottom: "28px" }}>
          {lesson.targetMinutes} minutes · {lesson.bloomLevels.join(" + ") || "Lesson"}
        </p>

        <Link
          href={lesson.href}
          style={{
            alignSelf: "flex-start",
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 36px",
            borderRadius: "999px",
            background: `linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD_DEEP} 100%)`,
            color: "#1A1408",
            textDecoration: "none",
            fontSize: T.body,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            boxShadow: `0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 -1px 0 rgba(0, 0, 0, 0.08) inset, 0 14px 36px ${GOLD_DEEP}55, 0 4px 12px ${GOLD_DEEP}33`,
            transition: "all 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Begin lesson {lesson.sequence}
          <ArrowRight size={18} strokeWidth={2.5} />
        </Link>
      </div>

      {/* RIGHT — illustration column */}
      <div
        style={{
          position: "relative",
          padding: "32px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          borderLeft: `1px solid ${GOLD}22`,
          background: `linear-gradient(180deg, rgba(252, 230, 184, 0.40) 0%, rgba(244, 199, 123, 0.55) 100%)`,
        }}
      >
        {/* Module illustration as the hero visual */}
        <div
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, rgba(255, 252, 240, 0.95) 0%, rgba(252, 230, 184, 0.75) 100%)`,
            border: `2px solid ${GOLD}55`,
            boxShadow: `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 ${GOLD}33 inset, 0 12px 32px ${GOLD}33, 0 4px 12px ${GOLD}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ModuleIllustration index={m.sequence} accent={GOLD_DEEP} size={120} />
        </div>

        {/* Module label below the illustration */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.24em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "8px" }}>
            Module {m.sequence}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "22px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.2, marginBottom: "6px" }}>
            {m.title}
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: INK_MUTED }}>
            {m.chapters.length} chapters · {m.totalLessons} lessons
          </p>
        </div>
      </div>

      {/* Stack at narrow widths */}
      <style>{`
        @media (max-width: 900px) {
          .gl-hero-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}

/* ── Horizontal 3-card data ribbon below the hero ─────────────────── */
function HeroStatRibbon({
  masteredCount,
  tierTotal,
  streakDays,
  longestStreak,
  reviewDeckCount,
}: {
  masteredCount: number;
  tierTotal: number;
  streakDays: number;
  longestStreak: number;
  reviewDeckCount: number;
}) {
  const tierPct = tierTotal > 0 ? Math.round((masteredCount / tierTotal) * 100) : 0;

  // Review-deck copy is reactive to actual state
  const reviewValue = reviewDeckCount === 0 ? "0 cards" : reviewDeckCount === 1 ? "1 card" : `${reviewDeckCount} cards`;
  const reviewSub = masteredCount === 0
    ? "Spaced repetition begins once you master your first lesson."
    : reviewDeckCount === 0
      ? "All caught up — no lessons due for review today."
      : `Reinforce ${reviewDeckCount === 1 ? "one lesson you mastered" : "lessons you mastered"} a week or more ago.`;

  // Streak copy is reactive
  const streakValue = streakDays === 0 ? "0 days" : streakDays === 1 ? "1 day" : `${streakDays} days`;
  const streakSub = streakDays === 0
    ? "Build a streak with one focused lesson a day."
    : longestStreak > streakDays
      ? `Personal best: ${longestStreak} days. Close the gap.`
      : streakDays === longestStreak && streakDays > 1
        ? "This is your longest streak yet — keep it alive."
        : "Pass at least one lesson today to extend the streak.";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "24px" }} className="gl-hero-ribbon">
      <StatCard
        icon={<Layers size={16} />}
        accent={GOLD_DEEP}
        eyebrow="Today's Review"
        value={reviewValue}
        sub={reviewSub}
        href={reviewDeckCount > 0 ? "/learn/review" : undefined}
      />
      <StatCard
        icon={<Flame size={16} />}
        accent="#A23A1E"
        eyebrow="Current Streak"
        value={streakValue}
        sub={streakSub}
      />
      <StatCard
        icon={<TrendingUp size={16} />}
        accent="#4F6FA8"
        eyebrow={`Tier ${1} Progress`}
        value={`${tierPct}% · ${masteredCount} / ${tierTotal}`}
        sub="Master all of Tier 1 to unlock Tier 2: Practice."
      />
      <style>{`
        @media (max-width: 900px) {
          .gl-hero-ribbon { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function StatCard({ icon, accent, eyebrow, value, sub, href }: { icon: React.ReactNode; accent: string; eyebrow: string; value: string; sub: string; href?: string }) {
  const body = (
    <div
      style={{
        ...glassPanel,
        padding: "18px 22px",
        borderTop: `2px solid ${accent}88`,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        cursor: href ? "pointer" : "default",
        transition: "transform 220ms cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 220ms",
      }}
      className={href ? "gl-statcard-clickable" : undefined}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ color: accent }}>{icon}</span>
        <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.18em", color: accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
          {eyebrow}
        </p>
      </div>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "24px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.15 }}>
        {value}
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.5 }}>
        {sub}
      </p>
    </div>
  );

  if (href) {
    return (
      <>
        <Link href={href} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
          {body}
        </Link>
        <style>{`
          .gl-statcard-clickable:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(62, 42, 31, 0.16), 0 1px 0 rgba(255, 255, 255, 0.92) inset !important; }
        `}</style>
      </>
    );
  }
  return body;
}

/* ════════════════════════════════════════════════════════════════════
 * 3 · CURRENT MODULE FOCUS — 3-col deep view
 * ════════════════════════════════════════════════════════════════════ */
function CurrentModuleFocus({
  module: m,
  nextSlug,
  lessons,
  moduleMasteredCount,
  moduleTimeMs,
  syncStatus,
}: {
  module: CurriculumModule;
  nextSlug?: string;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
  moduleMasteredCount: number;
  moduleTimeMs: number;
  syncStatus: ReturnType<typeof useLearningSync>;
}) {
  const palette = paletteForModule(m.sequence - 1);

  return (
    <section style={{ padding: "32px 32px 72px" }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        {/* Section header */}
        <header style={{ marginBottom: "32px", paddingBottom: "20px", borderBottom: `1px solid ${palette.accent}33` }}>
          <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.28em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "8px" }}>
            You're learning · Module {m.sequence}
          </p>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.display, fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.15, letterSpacing: "0.003em" }}>
              {m.title}
            </h2>
            <div style={{ display: "flex", gap: "16px", alignItems: "baseline" }}>
              <p style={{ fontSize: T.caption, color: INK_SECONDARY, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
                {m.chapters.length} chapters · {m.totalLessons} lessons · {moduleMasteredCount} mastered
              </p>
            </div>
          </div>
        </header>

        {/* 3-col layout */}
        <div className="gl-focus-grid" style={{ display: "grid", gridTemplateColumns: "280px minmax(0, 1fr) 280px", gap: "32px", alignItems: "flex-start" }}>
          <ChapterTree module={m} lessons={lessons} nextSlug={nextSlug} />
          <JourneyPath module={m} lessons={lessons} nextSlug={nextSlug} />
          <ModuleSidePanel module={m} moduleMasteredCount={moduleMasteredCount} lessons={lessons} nextSlug={nextSlug} moduleTimeMs={moduleTimeMs} syncStatus={syncStatus} />
        </div>
        <style>{`
          @media (max-width: 1100px) {
            .gl-focus-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function ChapterTree({
  module: m,
  lessons,
  nextSlug,
}: {
  module: CurriculumModule;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
  nextSlug?: string;
}) {
  const totalMinutes = useMemo(
    () => m.chapters.flatMap((c) => c.lessons).reduce((acc, l) => acc + l.targetMinutes, 0),
    [m],
  );
  const totalHours = (totalMinutes / 60).toFixed(1).replace(".0", "");

  return (
    <aside style={{ position: "sticky", top: "140px", alignSelf: "flex-start", maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
      <div style={{ ...glassPanel, padding: "22px 22px 18px" }}>
        <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.22em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
          Module {m.sequence} · Your Journey
        </p>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_MUTED, marginBottom: "18px" }}>
          {m.chapters.length} chapters · {m.totalLessons} stops
        </p>

        <nav style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {m.chapters.map((ch, idx) => (
            <ChapterRow
              key={ch.slug}
              chapter={ch}
              idx={idx}
              lessons={lessons}
              nextSlug={nextSlug}
              isLast={idx === m.chapters.length - 1}
              priorChaptersMastered={m.chapters
                .slice(0, idx)
                .every((c) => c.lessons.every((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered"))}
            />
          ))}
        </nav>

        {/* Footer total */}
        <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: `1px dashed ${GOLD}33`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.16em", color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Total
          </span>
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_SECONDARY }}>
            {m.totalLessons} stops · ~{totalHours} hrs
          </span>
        </div>
      </div>
    </aside>
  );
}

function ChapterRow({
  chapter: ch,
  idx,
  lessons,
  nextSlug,
  isLast,
  priorChaptersMastered,
}: {
  chapter: CurriculumModule["chapters"][number];
  idx: number;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
  nextSlug?: string;
  isLast: boolean;
  priorChaptersMastered: boolean;
}) {
  const palette = CHAPTER_PALETTES[idx % CHAPTER_PALETTES.length];
  const masteredCount = ch.lessons.filter((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered").length;
  const isActive = ch.lessons.some((l) => l.canonicalSlug === nextSlug);
  const isComplete = masteredCount === ch.lessons.length && ch.lessons.length > 0;
  const isUnlocked = idx === 0 || priorChaptersMastered;
  const pct = ch.lessons.length > 0 ? (masteredCount / ch.lessons.length) * 100 : 0;

  // Total minutes for chapter
  const chMinutes = ch.lessons.reduce((acc, l) => acc + l.targetMinutes, 0);

  // Top 2 Bloom levels for chapter
  const bloomCounts: Record<string, number> = {};
  for (const l of ch.lessons) for (const b of l.bloomLevels) bloomCounts[b] = (bloomCounts[b] || 0) + 1;
  const topBlooms = Object.entries(bloomCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map((e) => e[0]).join(" + ") || "—";

  return (
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", paddingBottom: isLast ? "0" : "20px" }}>
      {/* Vertical timeline thread (connecting line below medallion to next chapter) */}
      {!isLast && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "21.5px",
            top: "44px",
            bottom: "0",
            width: "2px",
            background: isComplete
              ? `linear-gradient(to bottom, ${palette.accent}, ${palette.accent}55)`
              : `linear-gradient(to bottom, ${palette.accent}55, rgba(156, 122, 47, 0.20))`,
            borderRadius: "999px",
          }}
        />
      )}

      {/* LEFT — chapter medallion (mini milestone stone) */}
      <div style={{ width: "44px", height: "44px", position: "relative" }}>
        <svg viewBox="0 0 44 44" width="44" height="44">
          <defs>
            <radialGradient id={`tree-grad-${ch.slug}`} cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#FFFCF0" />
              <stop offset="100%" stopColor={isUnlocked ? palette.tint : "rgba(156, 122, 47, 0.10)"} />
            </radialGradient>
          </defs>
          {/* Octagonal silhouette */}
          <polygon
            points="22,2 34,6 42,14 42,30 34,38 22,42 10,38 2,30 2,14 10,6"
            fill="none"
            stroke={isUnlocked ? palette.accent : "rgba(156, 122, 47, 0.40)"}
            strokeWidth="1.2"
            opacity={isUnlocked ? 0.65 : 0.45}
          />
          {/* Inner circle */}
          <circle
            cx="22"
            cy="22"
            r="15"
            fill={`url(#tree-grad-${ch.slug})`}
            stroke={isUnlocked ? palette.accent : "rgba(156, 122, 47, 0.40)"}
            strokeWidth={isActive ? "2.2" : "1.6"}
            filter={isActive ? `drop-shadow(0 2px 6px ${palette.accent}77)` : "none"}
          />
          {/* Decorative dashed ring */}
          <circle cx="22" cy="22" r="11" fill="none" stroke={isUnlocked ? palette.accent : "rgba(156, 122, 47, 0.40)"} strokeWidth="0.5" strokeDasharray="1 2" opacity="0.55" />
          {/* Number or completion check */}
          {isComplete ? (
            <path d="M 16 22 L 20 26 L 28 18" stroke={palette.accent} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <text x="22" y="27" textAnchor="middle" fontSize="16" fontFamily="var(--font-cormorant), serif" fontStyle="italic" fill={isUnlocked ? palette.accent : "rgba(156, 122, 47, 0.55)"} fontWeight="500">
              {ch.sequence}
            </text>
          )}
        </svg>
        {!isUnlocked && (
          <div style={{ position: "absolute", top: "-3px", right: "-3px", width: "18px", height: "18px", borderRadius: "50%", background: "rgba(255, 252, 240, 0.95)", border: `1px solid ${INK_MUTED}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={9} style={{ color: INK_MUTED }} />
          </div>
        )}
      </div>

      {/* RIGHT — chapter content */}
      <div style={{ opacity: isUnlocked ? 1 : 0.7 }}>
        {/* Eyebrow row */}
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px", marginBottom: "2px" }}>
          <span style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Chapter {ch.sequence}
          </span>
          <span style={{ fontSize: "11px", color: INK_MUTED, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
            {masteredCount} / {ch.lessons.length}
          </span>
        </div>

        {/* Title */}
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15.5px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.3, marginBottom: "8px" }}>
          {ch.title}
        </p>

        {/* Mini progress bar */}
        <div style={{ height: "4px", borderRadius: "999px", background: `${palette.accent}1F`, position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 1px rgba(62, 42, 31, 0.10)", marginBottom: "8px" }}>
          <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${Math.max(2, pct)}%`, background: `linear-gradient(to right, ${palette.accent}, ${palette.accent}cc)`, borderRadius: "999px", boxShadow: `0 0 6px ${palette.accent}88` }} />
        </div>

        {/* Lesson-dot row */}
        <div style={{ display: "flex", gap: "5px", marginBottom: "8px", flexWrap: "wrap" }}>
          {ch.lessons.map((l) => {
            const isDone = lessons[l.canonicalSlug]?.masteryStatus === "Mastered";
            const isCurrent = l.canonicalSlug === nextSlug;
            return (
              <span
                key={l.slug}
                title={`Lesson ${l.sequence} — ${l.title}`}
                style={{
                  position: "relative",
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  background: isDone ? palette.accent : "rgba(255, 252, 240, 0.65)",
                  border: `${isCurrent ? 2 : 1}px solid ${palette.accent}${isUnlocked ? "" : "66"}`,
                  boxShadow: isCurrent ? `0 0 0 3px ${palette.accent}33` : "none",
                  animation: isCurrent ? "gl-dot-pulse 2.2s ease-in-out infinite" : undefined,
                  flexShrink: 0,
                }}
              />
            );
          })}
        </div>

        {/* Time + Bloom meta */}
        <p style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: INK_MUTED, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", lineHeight: 1.4, marginBottom: isActive ? "10px" : "0" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <Clock size={9} style={{ color: palette.accent }} />
            ~{chMinutes} min
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topBlooms}</span>
        </p>

        {isActive && (
          <p style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.16em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "8px" }}>
            <Sparkles size={10} /> You are here
          </p>
        )}

        {/* Expanded lesson list for active chapter */}
        {isActive && (
          <ul
            style={{
              listStyle: "none",
              padding: "8px 10px",
              margin: 0,
              borderRadius: "8px",
              background: palette.tint,
              border: `1px solid ${palette.accent}33`,
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            {ch.lessons.map((l) => {
              const isCurrent = l.canonicalSlug === nextSlug;
              const isMastered = lessons[l.canonicalSlug]?.masteryStatus === "Mastered";
              return (
                <li key={l.slug}>
                  {l.isAuthored ? (
                    <Link
                      href={l.href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "5px 6px",
                        borderRadius: "4px",
                        textDecoration: "none",
                        background: isCurrent ? `${palette.accent}1F` : "transparent",
                        transition: "background 180ms",
                      }}
                    >
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-sans), system-ui, sans-serif", color: palette.accent, fontWeight: 700, minWidth: "14px" }}>{l.sequence}</span>
                      {isMastered ? <Check size={11} style={{ color: palette.accent }} /> : isCurrent ? <ArrowRight size={11} style={{ color: palette.accent }} /> : <span style={{ width: "11px" }} />}
                      <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "13px", color: isCurrent ? INK_PRIMARY : INK_SECONDARY, fontWeight: isCurrent ? 600 : 500, lineHeight: 1.3 }}>
                        {l.title.length > 36 ? l.title.slice(0, 34) + "…" : l.title}
                      </span>
                    </Link>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 6px", opacity: 0.55 }}>
                      <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700, minWidth: "14px" }}>{l.sequence}</span>
                      <Lock size={10} style={{ color: INK_MUTED }} />
                      <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "13px", color: INK_MUTED }}>
                        {l.title.length > 36 ? l.title.slice(0, 34) + "…" : l.title}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <style>{`
        @keyframes gl-dot-pulse {
          0%, 100% { box-shadow: 0 0 0 3px ${palette.accent}33; }
          50%      { box-shadow: 0 0 0 6px ${palette.accent}22; }
        }
      `}</style>
    </div>
  );
}

function JourneyPath({
  module: m,
  lessons,
  nextSlug,
}: {
  module: CurriculumModule;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
  nextSlug?: string;
}) {
  type Seg = { kind: "milestone"; chapter: CurriculumModule["chapters"][number]; chIdx: number } | { kind: "lesson"; chapter: CurriculumModule["chapters"][number]; chIdx: number; lesson: CurriculumModule["chapters"][number]["lessons"][number] };
  const segments: Seg[] = useMemo(() => {
    const out: Seg[] = [];
    m.chapters.forEach((ch, chIdx) => {
      out.push({ kind: "milestone", chapter: ch, chIdx });
      ch.lessons.forEach((lesson) => out.push({ kind: "lesson", chapter: ch, chIdx, lesson }));
    });
    return out;
  }, [m]);

  const W = 820;
  const CARD_GUTTER = 14; // distance from edge of container to card column
  const CARD_W = 230;
  // Lotus winds in the centre band only, leaving fixed margins for the card columns
  const LOTUS_AMP = 140;
  const positions = useMemo(() => {
    let y = 90;
    const out: Array<{ x: number; y: number; seg: Seg; cardSide?: "left" | "right" }> = [];
    let lessonRun = 0;
    for (const seg of segments) {
      if (seg.kind === "milestone") {
        out.push({ x: W / 2, y, seg });
        y += 175;
        lessonRun = 0;
      } else {
        // Strictly alternate the card column: even index → right card, odd → left card.
        // Lotus rides a gentle S-curve in the centre.
        const sign = lessonRun % 2 === 0 ? 1 : -1;
        const x = W / 2 + Math.sin(((lessonRun + 0.5) / 4) * Math.PI) * LOTUS_AMP * sign;
        const cardSide: "left" | "right" = sign > 0 ? "left" : "right";
        out.push({ x, y, seg, cardSide });
        y += 132;
        lessonRun++;
      }
    }
    return { positions: out, totalH: y + 60 };
  }, [segments]);

  const pathD = useMemo(() => {
    if (positions.positions.length < 2) return "";
    let d = `M ${positions.positions[0].x} ${positions.positions[0].y}`;
    for (let i = 1; i < positions.positions.length; i++) {
      const a = positions.positions[i - 1];
      const b = positions.positions[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      d += ` C ${a.x + dx * 0.15} ${a.y + dy * 0.45}, ${b.x - dx * 0.15} ${a.y + dy * 0.55}, ${b.x} ${b.y}`;
    }
    return d;
  }, [positions]);

  // Build chapter-zone bands: y-range for each chapter so we can paint atmospheric haloes
  const chapterZones = useMemo(() => {
    const out: Array<{ chIdx: number; accent: string; yStart: number; yEnd: number }> = [];
    let curIdx = -1;
    let curStart = 0;
    positions.positions.forEach((pos, i) => {
      const idx = pos.seg.kind === "milestone" ? pos.seg.chIdx : pos.seg.chIdx;
      if (idx !== curIdx) {
        if (curIdx >= 0) {
          out.push({ chIdx: curIdx, accent: CHAPTER_PALETTES[curIdx % CHAPTER_PALETTES.length].accent, yStart: curStart, yEnd: (positions.positions[i - 1]?.y ?? curStart - 80) + 80 });
        }
        curIdx = idx;
        curStart = Math.max(0, pos.y - 80);
      }
    });
    if (curIdx >= 0) {
      out.push({ chIdx: curIdx, accent: CHAPTER_PALETTES[curIdx % CHAPTER_PALETTES.length].accent, yStart: curStart, yEnd: positions.totalH });
    }
    return out;
  }, [positions]);

  // Pre-compute up-to-which-position the "completed energy thread" should run.
  // Find the last mastered lesson in declaration order; the energy thread fills the path up to that point.
  const completedThroughIdx = useMemo(() => {
    let last = -1;
    positions.positions.forEach((pos, i) => {
      if (pos.seg.kind === "lesson" && lessons[pos.seg.lesson.canonicalSlug]?.masteryStatus === "Mastered") {
        last = i;
      }
    });
    return last;
  }, [positions, lessons]);

  // Path length budget for the energy-thread stroke-dashoffset cutoff
  // Build a partial path up to completedThroughIdx if any.
  const completedPathD = useMemo(() => {
    if (completedThroughIdx < 1) return "";
    let d = `M ${positions.positions[0].x} ${positions.positions[0].y}`;
    for (let i = 1; i <= completedThroughIdx; i++) {
      const a = positions.positions[i - 1];
      const b = positions.positions[i];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      d += ` C ${a.x + dx * 0.15} ${a.y + dy * 0.45}, ${b.x - dx * 0.15} ${a.y + dy * 0.55}, ${b.x} ${b.y}`;
    }
    return d;
  }, [positions, completedThroughIdx]);

  return (
    <main style={{ position: "relative" }}>
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <p style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.28em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "8px" }}>
          <span style={{ width: "32px", height: "1px", background: `linear-gradient(to right, transparent, ${GOLD_DEEP})` }} />
          The Sacred Path
          <span style={{ width: "32px", height: "1px", background: `linear-gradient(to left, transparent, ${GOLD_DEEP})` }} />
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.title, fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.2 }}>
          {m.totalLessons} stops across {m.chapters.length} chapters
        </h3>
        <p lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "16px", color: GOLD_DEEP, opacity: 0.7, marginTop: "6px" }}>
          तीर्थ — यात्रा
        </p>
      </header>

      <div style={{ position: "relative", width: "100%", maxWidth: `${W}px`, margin: "0 auto" }}>
        {/* Layer 0 — cosmic backdrop (constellation + nebula) */}
        <CosmicBackdrop width={W} height={positions.totalH} chapterZones={chapterZones} />

        {/* Layer 1 — per-chapter atmospheric halo bands */}
        <svg viewBox={`0 0 ${W} ${positions.totalH}`} width="100%" style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }} aria-hidden="true">
          {chapterZones.map((zone, i) => {
            const h = zone.yEnd - zone.yStart;
            return (
              <g key={`zone-${i}`}>
                <defs>
                  <radialGradient id={`zone-glow-${i}`} cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor={zone.accent} stopOpacity="0.13" />
                    <stop offset="60%" stopColor={zone.accent} stopOpacity="0.05" />
                    <stop offset="100%" stopColor={zone.accent} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <ellipse cx={W / 2} cy={zone.yStart + h / 2} rx={W * 0.55} ry={h * 0.55} fill={`url(#zone-glow-${i})`} />
              </g>
            );
          })}
        </svg>

        {/* Layer 2 — wayside ornaments in the margins */}
        <WaysideOrnaments width={W} height={positions.totalH} chapterZones={chapterZones} />

        {/* Layer 3 — the ornamental DIVINE-FLOW path */}
        <svg viewBox={`0 0 ${W} ${positions.totalH}`} width="100%" style={{ display: "block", position: "relative", overflow: "visible", zIndex: 1 }} aria-hidden="true">
          <defs>
            <linearGradient id="path-trail" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD_LIGHT} />
              <stop offset="100%" stopColor={GOLD_DEEP} />
            </linearGradient>
            <linearGradient id="path-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0.95" />
              <stop offset="50%" stopColor={GOLD} stopOpacity="0.85" />
              <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="path-river" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={GOLD_LIGHT} stopOpacity="0" />
              <stop offset="35%" stopColor={GOLD_LIGHT} stopOpacity="0.95" />
              <stop offset="65%" stopColor={GOLD} stopOpacity="0.95" />
              <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0" />
            </linearGradient>
            <filter id="path-bloom" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <filter id="path-bloom-soft" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
            </filter>
            <path id={`journey-path-${m.slug}`} d={pathD} />
            {/* Lumen particle — radial gradient for soft sparkle */}
            <radialGradient id="lumen-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFEF5" stopOpacity="1" />
              <stop offset="55%" stopColor={GOLD_LIGHT} stopOpacity="0.9" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer cosmic underglow — diffuse */}
          <path d={pathD} fill="none" stroke={GOLD_LIGHT} strokeWidth="14" strokeLinecap="round" opacity="0.10" filter="url(#path-bloom-soft)" />
          <path d={pathD} fill="none" stroke={GOLD} strokeWidth="6" strokeLinecap="round" opacity="0.18" filter="url(#path-bloom)" />

          {/* Main manuscript trail — gentle dashes */}
          <path d={pathD} fill="none" stroke={GOLD} strokeWidth="2.2" strokeDasharray="10 9" strokeLinecap="round" opacity="0.72" />

          {/* Two FLOWING dash layers at different speeds → "river of light" */}
          <path
            d={pathD}
            fill="none"
            stroke={GOLD_LIGHT}
            strokeWidth="1.6"
            strokeDasharray="4 18"
            strokeLinecap="round"
            opacity="0.85"
            style={{ animation: "gl-path-flow-a 5.5s linear infinite" }}
          />
          <path
            d={pathD}
            fill="none"
            stroke={GOLD_DEEP}
            strokeWidth="1"
            strokeDasharray="2 26"
            strokeLinecap="round"
            opacity="0.6"
            style={{ animation: "gl-path-flow-b 8.5s linear infinite" }}
          />

          {/* Animated drawing-in thread on first load */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#path-trail)"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={{
              strokeDasharray: 6000,
              strokeDashoffset: 6000,
              animation: "gl-path-draw 4.2s cubic-bezier(0.32, 0.72, 0.24, 1) 0.4s forwards",
            }}
          />

          {/* Completed-energy thread overlaying mastered portion */}
          {completedPathD && (
            <>
              <path d={completedPathD} fill="none" stroke={GOLD_LIGHT} strokeWidth="12" strokeLinecap="round" opacity="0.32" filter="url(#path-bloom)" />
              <path d={completedPathD} fill="none" stroke="url(#path-glow)" strokeWidth="3" strokeLinecap="round" opacity="0.95" />
            </>
          )}

          {/* Floating lumens that travel along the path — five staggered particles */}
          {Array.from({ length: 5 }, (_, i) => {
            const delay = (i * 2.4).toFixed(2);
            return (
              <g key={`lumen-${i}`}>
                <circle r="6" fill="url(#lumen-grad)" opacity="0.85">
                  <animateMotion dur="12s" begin={`${delay}s`} repeatCount="indefinite" rotate="auto">
                    <mpath href={`#journey-path-${m.slug}`} />
                  </animateMotion>
                </circle>
                <circle r="2" fill="#FFFEF5" opacity="0.95">
                  <animateMotion dur="12s" begin={`${delay}s`} repeatCount="indefinite">
                    <mpath href={`#journey-path-${m.slug}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}

          {/* LEADER lines: filigree dotted line from each lotus to its card column */}
          {positions.positions.map((pos, i) => {
            if (pos.seg.kind !== "lesson") return null;
            const side = pos.cardSide ?? "right";
            const cardEdgeX = side === "left" ? CARD_GUTTER + CARD_W : W - CARD_GUTTER - CARD_W;
            const lotusEdgeOffset = 38; // lotus radius
            const lotusEdgeX = pos.x + (side === "left" ? -lotusEdgeOffset : lotusEdgeOffset);
            const palette = CHAPTER_PALETTES[pos.seg.chIdx % CHAPTER_PALETTES.length];
            // gentle quadratic so it doesn't look like a wire
            const midX = (lotusEdgeX + cardEdgeX) / 2;
            const midY = pos.y - 4;
            return (
              <path
                key={`leader-${i}`}
                d={`M ${lotusEdgeX} ${pos.y} Q ${midX} ${midY}, ${cardEdgeX} ${pos.y}`}
                fill="none"
                stroke={palette.accent}
                strokeWidth="1"
                strokeDasharray="1.5 4"
                strokeLinecap="round"
                opacity="0.55"
              />
            );
          })}
        </svg>
        <style>{`
          @keyframes gl-path-draw {
            0% { stroke-dashoffset: 6000; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes gl-path-flow-a {
            0%   { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -660; }
          }
          @keyframes gl-path-flow-b {
            0%   { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -560; }
          }
          @keyframes gl-milestone-ripple {
            0%   { transform: scale(0.55); opacity: 0.55; }
            60%  { opacity: 0.25; }
            100% { transform: scale(1.8); opacity: 0; }
          }
          @keyframes gl-lotus-breathe {
            0%, 100% { transform: scale(1); }
            50%      { transform: scale(1.04); }
          }
        `}</style>
        {positions.positions.map((pos) => {
          const leftPct = (pos.x / W) * 100;
          const topPct = (pos.y / positions.totalH) * 100;
          if (pos.seg.kind === "milestone") {
            const palette = CHAPTER_PALETTES[pos.seg.chIdx % CHAPTER_PALETTES.length];
            const masteredInCh = pos.seg.chapter.lessons.filter((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered").length;
            return (
              <MilestoneStone
                key={`m-${pos.seg.chapter.slug}`}
                chapter={pos.seg.chapter}
                palette={palette}
                masteredInChapter={masteredInCh}
                leftPct={leftPct}
                topPct={topPct}
              />
            );
          }
          const lesson = pos.seg.lesson;
          const status = lessons[lesson.canonicalSlug]?.masteryStatus;
          const isDone = status === "Mastered";
          const isNext = lesson.canonicalSlug === nextSlug;
          const palette = CHAPTER_PALETTES[pos.seg.chIdx % CHAPTER_PALETTES.length];
          const cardSide = pos.cardSide ?? "right";
          // Card's vertical centre matches lotus y
          const cardTopPct = topPct;
          return (
            <LessonNode
              key={`l-${lesson.slug}`}
              lesson={lesson}
              state={isDone ? "done" : isNext ? "next" : "locked"}
              palette={palette}
              leftPct={leftPct}
              topPct={topPct}
              cardSide={cardSide}
              cardTopPct={cardTopPct}
              cardGutterPx={CARD_GUTTER}
              cardWidthPx={CARD_W}
            />
          );
        })}
      </div>
    </main>
  );
}

function CosmicBackdrop({
  width,
  height,
  chapterZones,
}: {
  width: number;
  height: number;
  chapterZones: Array<{ chIdx: number; accent: string; yStart: number; yEnd: number }>;
}) {
  const { stars, drift, nebulae, constellations } = useMemo(() => {
    let seed = 23;
    const r = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    const stars = Array.from({ length: 110 }, () => ({
      x: r() * width,
      y: r() * height,
      radius: 0.4 + r() * 1.4,
      opacity: 0.08 + r() * 0.28,
      twinkleDelay: r() * 6,
    }));
    const drift = Array.from({ length: 22 }, () => ({
      x: r() * width,
      y: r() * height,
      radius: 1.6 + r() * 2.4,
      opacity: 0.18 + r() * 0.22,
      driftDelay: r() * 8,
    }));
    // Two nebula puffs per chapter zone — tinted with chapter accent
    const nebulae: Array<{ cx: number; cy: number; rx: number; ry: number; color: string; opacity: number; idx: number; sub: number }> = [];
    chapterZones.forEach((zone, zi) => {
      const h = zone.yEnd - zone.yStart;
      nebulae.push({
        cx: width * 0.18 + r() * width * 0.08,
        cy: zone.yStart + h * 0.35 + r() * h * 0.2,
        rx: 140 + r() * 60,
        ry: 90 + r() * 40,
        color: zone.accent,
        opacity: 0.10 + r() * 0.04,
        idx: zi,
        sub: 0,
      });
      nebulae.push({
        cx: width * 0.82 - r() * width * 0.08,
        cy: zone.yStart + h * 0.65 + r() * h * 0.2,
        rx: 110 + r() * 60,
        ry: 80 + r() * 40,
        color: zone.accent,
        opacity: 0.08 + r() * 0.05,
        idx: zi,
        sub: 1,
      });
    });
    // Constellation polylines: faint connect-the-dots arcs in 3 patches
    const constellations: Array<{ points: Array<{ x: number; y: number }> }> = [];
    for (let c = 0; c < 4; c++) {
      const cx = r() * width;
      const cy = r() * height;
      const pts = Array.from({ length: 5 + Math.floor(r() * 3) }, () => ({
        x: cx + (r() - 0.5) * 110,
        y: cy + (r() - 0.5) * 110,
      }));
      constellations.push({ points: pts });
    }
    return { stars, drift, nebulae, constellations };
  }, [width, height, chapterZones]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} aria-hidden="true">
      <defs>
        <radialGradient id="page-cosmic-base" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor={GOLD_DEEP} stopOpacity="0.06" />
          <stop offset="60%" stopColor={GOLD_DEEP} stopOpacity="0.02" />
          <stop offset="100%" stopColor={GOLD_DEEP} stopOpacity="0" />
        </radialGradient>
        {nebulae.map((n) => (
          <radialGradient key={`neb-grad-${n.idx}-${n.sub}`} id={`neb-grad-${n.idx}-${n.sub}`} cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor={n.color} stopOpacity={n.opacity} />
            <stop offset="55%" stopColor={n.color} stopOpacity={n.opacity * 0.45} />
            <stop offset="100%" stopColor={n.color} stopOpacity="0" />
          </radialGradient>
        ))}
        <filter id="neb-blur"><feGaussianBlur stdDeviation="22" /></filter>
        <filter id="star-bloom"><feGaussianBlur stdDeviation="0.4" /></filter>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill="url(#page-cosmic-base)" />
      {/* nebula clouds tinted with each chapter zone's accent */}
      {nebulae.map((n) => (
        <ellipse key={`neb-${n.idx}-${n.sub}`} cx={n.cx} cy={n.cy} rx={n.rx} ry={n.ry} fill={`url(#neb-grad-${n.idx}-${n.sub})`} filter="url(#neb-blur)" />
      ))}
      {/* faint constellation lines */}
      {constellations.map((c, ci) => (
        <g key={`con-${ci}`} stroke={GOLD_DEEP} strokeWidth="0.45" fill="none" opacity="0.32">
          <polyline points={c.points.map((p) => `${p.x},${p.y}`).join(" ")} strokeDasharray="2 4" strokeLinecap="round" />
          {c.points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1.4" fill={GOLD} opacity="0.7" />
          ))}
        </g>
      ))}
      {/* dim ambient stars */}
      {stars.map((s, i) => (
        <circle
          key={`s-${i}`}
          cx={s.x}
          cy={s.y}
          r={s.radius}
          fill={GOLD_DEEP}
          opacity={s.opacity}
          filter="url(#star-bloom)"
          style={{ animation: `gl-twinkle 5.5s ease-in-out ${s.twinkleDelay}s infinite` }}
        />
      ))}
      {/* brighter drifting motes */}
      {drift.map((s, i) => (
        <g key={`d-${i}`} style={{ transformOrigin: `${s.x}px ${s.y}px`, animation: `gl-drift 14s ease-in-out ${s.driftDelay}s infinite` }}>
          <circle cx={s.x} cy={s.y} r={s.radius * 1.6} fill={GOLD_LIGHT} opacity={s.opacity * 0.25} />
          <circle cx={s.x} cy={s.y} r={s.radius} fill={GOLD_LIGHT} opacity={s.opacity} />
        </g>
      ))}
      <style>{`
        @keyframes gl-twinkle {
          0%, 100% { opacity: var(--tw-from, 0.2); }
          50% { opacity: 0.55; }
        }
        @keyframes gl-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(0, -6px); }
        }
      `}</style>
    </svg>
  );
}

function WaysideOrnaments({
  width,
  height,
  chapterZones,
}: {
  width: number;
  height: number;
  chapterZones: Array<{ chIdx: number; accent: string; yStart: number; yEnd: number }>;
}) {
  // Devanāgarī seed-syllables — one per chapter zone, alternating left/right margins
  const BIJA = ["ॐ", "ह्रीं", "श्रीं", "क्लीं", "ऐं", "गं", "रं", "वं"];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }} aria-hidden="true">
      {chapterZones.map((zone, i) => {
        // Anchor the seed-syllable medallion near the TOP of the chapter zone,
        // tucked into a far-margin corner, so it never collides with content.
        const isRight = i % 2 === 0;
        const cx = isRight ? width - 26 : 26;
        const cy = zone.yStart + 30;
        const syl = BIJA[i % BIJA.length];
        return (
          <g key={`wo-${i}`} opacity="0.42">
            {/* seed-syllable medallion — single, small, in the margin */}
            <g transform={`translate(${cx}, ${cy})`}>
              <circle r="15" fill="rgba(255, 249, 240, 0.35)" stroke={zone.accent} strokeWidth="0.5" strokeDasharray="1.5 2.5" opacity="0.65" />
              <circle r="11" fill="none" stroke={zone.accent} strokeWidth="0.3" opacity="0.5" />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontFamily="var(--font-devanagari), serif"
                fontSize="12"
                fill={zone.accent}
                opacity="0.8"
              >
                {syl}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}

function MilestoneStone({
  chapter,
  palette,
  masteredInChapter,
  leftPct,
  topPct,
}: {
  chapter: CurriculumModule["chapters"][number];
  palette: { accent: string; tint: string; border: string };
  masteredInChapter: number;
  leftPct: number;
  topPct: number;
}) {
  const isComplete = masteredInChapter === chapter.lessons.length;
  const pctComplete = chapter.lessons.length > 0 ? masteredInChapter / chapter.lessons.length : 0;
  const uid = chapter.slug;
  return (
    <div style={{ position: "absolute", left: `${leftPct}%`, top: `${topPct}%`, transform: "translate(-50%, -50%)", zIndex: 5, display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "min(340px, 80%)", textAlign: "center" }}>
      {/* sacred-arrival ripple rings — three concentric, staggered */}
      <div aria-hidden style={{ position: "absolute", top: "62px", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none", width: "124px", height: "124px" }}>
        {[0, 1.2, 2.4].map((delay, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1.5px solid ${palette.accent}`,
              opacity: 0,
              animation: `gl-milestone-ripple 3.6s cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}s infinite`,
              transformOrigin: "center",
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", flexShrink: 0, filter: `drop-shadow(0 14px 28px ${palette.accent}3a) drop-shadow(0 4px 8px rgba(74, 56, 24, 0.18))` }}>
        <svg width="124" height="124" viewBox="0 0 124 124">
          <defs>
            {/* Stone body — warm stratified gradient */}
            <radialGradient id={`ms-body-${uid}`} cx="35%" cy="28%" r="85%">
              <stop offset="0%" stopColor="#FFF7E2" />
              <stop offset="55%" stopColor={palette.tint} stopOpacity="0.85" />
              <stop offset="100%" stopColor={palette.accent} stopOpacity="0.22" />
            </radialGradient>
            {/* Subtle inner shading for carved depth */}
            <radialGradient id={`ms-carve-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFCF0" />
              <stop offset="100%" stopColor={palette.tint} stopOpacity="0.4" />
            </radialGradient>
            {/* Top highlight for a polished-stone sheen */}
            <linearGradient id={`ms-sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            {/* Faint manuscript grain on the stone face */}
            <pattern id={`ms-grain-${uid}`} x="0" y="0" width="3" height="3" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.35" fill={palette.accent} opacity="0.16" />
            </pattern>
          </defs>

          {/* === Lotus-cusped octagonal outer ring (carved corona) === */}
          <g opacity="0.55">
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const x1 = 62 + Math.cos(angle) * 56;
              const y1 = 62 + Math.sin(angle) * 56;
              const x2 = 62 + Math.cos(angle) * 50;
              const y2 = 62 + Math.sin(angle) * 50;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.accent} strokeWidth="1.2" strokeLinecap="round" />;
            })}
          </g>

          {/* Outer carved lotus-rim */}
          <g>
            {Array.from({ length: 16 }, (_, i) => {
              const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
              const tipX = 62 + Math.cos(angle) * 50;
              const tipY = 62 + Math.sin(angle) * 50;
              const bL = (i / 16) * Math.PI * 2 - Math.PI / 2 - 0.18;
              const bR = (i / 16) * Math.PI * 2 - Math.PI / 2 + 0.18;
              const x1 = 62 + Math.cos(bL) * 44;
              const y1 = 62 + Math.sin(bL) * 44;
              const x2 = 62 + Math.cos(bR) * 44;
              const y2 = 62 + Math.sin(bR) * 44;
              return (
                <path
                  key={`rim-${i}`}
                  d={`M ${x1} ${y1} Q ${tipX} ${tipY}, ${x2} ${y2} Z`}
                  fill={palette.accent}
                  opacity="0.18"
                />
              );
            })}
          </g>

          {/* Main stone body */}
          <circle cx="62" cy="62" r="44" fill={`url(#ms-body-${uid})`} stroke={palette.accent} strokeWidth="2.2" />
          <circle cx="62" cy="62" r="44" fill={`url(#ms-grain-${uid})`} />
          <circle cx="62" cy="62" r="44" fill={`url(#ms-sheen-${uid})`} opacity="0.45" />

          {/* Inner carved ring with dashed inscription marks */}
          <circle cx="62" cy="62" r="38" fill="none" stroke={palette.accent} strokeWidth="0.6" strokeDasharray="1.5 3" opacity="0.65" />
          <circle cx="62" cy="62" r="34" fill="none" stroke={palette.accent} strokeWidth="0.4" opacity="0.45" />

          {/* Eight cardinal hash marks — like a compass-rose carved into the stone */}
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const x1 = 62 + Math.cos(angle) * 36;
            const y1 = 62 + Math.sin(angle) * 36;
            const x2 = 62 + Math.cos(angle) * 32;
            const y2 = 62 + Math.sin(angle) * 32;
            return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.accent} strokeWidth="0.9" opacity="0.6" />;
          })}

          {/* Central inscription disc */}
          <circle cx="62" cy="62" r="26" fill={`url(#ms-carve-${uid})`} stroke={palette.accent} strokeWidth="1" opacity="0.95" />

          {/* Progress arc — sweeps clockwise from top as chapter mastery fills */}
          {pctComplete > 0 && (() => {
            const startAngle = -Math.PI / 2;
            const endAngle = startAngle + pctComplete * Math.PI * 2;
            const radius = 41;
            const x0 = 62 + Math.cos(startAngle) * radius;
            const y0 = 62 + Math.sin(startAngle) * radius;
            const x1 = 62 + Math.cos(endAngle) * radius;
            const y1 = 62 + Math.sin(endAngle) * radius;
            const largeArc = pctComplete > 0.5 ? 1 : 0;
            return (
              <path
                d={`M ${x0} ${y0} A ${radius} ${radius} 0 ${largeArc} 1 ${x1} ${y1}`}
                fill="none"
                stroke={palette.accent}
                strokeWidth="2.4"
                strokeLinecap="round"
                opacity="0.95"
              />
            );
          })()}

          {/* Chapter number — Cormorant italic, manuscript register */}
          <text x="62" y="73" textAnchor="middle" fontSize="34" fontFamily="var(--font-cormorant), serif" fill={palette.accent} fontWeight="500" fontStyle="italic">
            {chapter.sequence}
          </text>

          {/* Tiny flame/finial on top — like a stūpa */}
          <g transform="translate(62 12)">
            <path d="M 0 0 Q -3 -6 0 -10 Q 3 -6 0 0 Z" fill={palette.accent} opacity="0.75" />
            <circle cx="0" cy="-12" r="1.4" fill={GOLD_LIGHT} />
          </g>

          {/* Two carved side-fobs */}
          <g opacity="0.7">
            <circle cx="14" cy="62" r="3" fill={palette.accent} opacity="0.35" />
            <circle cx="14" cy="62" r="1.2" fill={palette.accent} />
            <circle cx="110" cy="62" r="3" fill={palette.accent} opacity="0.35" />
            <circle cx="110" cy="62" r="1.2" fill={palette.accent} />
          </g>
        </svg>
        {isComplete && (
          <div style={{ position: "absolute", top: "-2px", right: "-2px", width: "30px", height: "30px", borderRadius: "50%", background: palette.accent, border: "3px solid #FFF9F0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 10px ${palette.accent}88, 0 1px 0 rgba(255,255,255,0.5) inset` }}>
            <Check size={14} strokeWidth={3} style={{ color: "#FFF9F0" }} />
          </div>
        )}
      </div>
      {/* Title block sits CENTERED below the stone, inside a glass cartouche */}
      <div
        style={{
          position: "relative",
          maxWidth: "320px",
          padding: "10px 18px 12px",
          background: "linear-gradient(180deg, rgba(255, 252, 240, 0.94), rgba(255, 244, 220, 0.82))",
          border: `1px solid ${palette.border}`,
          borderRadius: "10px",
          boxShadow: `0 8px 22px ${palette.accent}26, 0 1px 0 rgba(255, 255, 255, 0.85) inset`,
          backdropFilter: "blur(8px) saturate(140%)",
        }}
      >
        <span aria-hidden style={{ position: "absolute", top: "4px", left: "5px", width: "10px", height: "10px", borderTop: `1.2px solid ${palette.accent}`, borderLeft: `1.2px solid ${palette.accent}`, opacity: 0.6 }} />
        <span aria-hidden style={{ position: "absolute", top: "4px", right: "5px", width: "10px", height: "10px", borderTop: `1.2px solid ${palette.accent}`, borderRight: `1.2px solid ${palette.accent}`, opacity: 0.6 }} />
        <span aria-hidden style={{ position: "absolute", bottom: "4px", left: "5px", width: "10px", height: "10px", borderBottom: `1.2px solid ${palette.accent}`, borderLeft: `1.2px solid ${palette.accent}`, opacity: 0.6 }} />
        <span aria-hidden style={{ position: "absolute", bottom: "4px", right: "5px", width: "10px", height: "10px", borderBottom: `1.2px solid ${palette.accent}`, borderRight: `1.2px solid ${palette.accent}`, opacity: 0.6 }} />

        <p style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.24em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
          <span lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "13px", letterSpacing: "0", opacity: 0.85 }}>अध्यायः</span>
          Chapter {chapter.sequence}
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.22, marginBottom: "8px" }}>
          {chapter.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          <div style={{ width: "120px", height: "4px", borderRadius: "2px", background: "rgba(74, 56, 24, 0.10)", overflow: "hidden" }}>
            <div style={{ width: `${pctComplete * 100}%`, height: "100%", background: `linear-gradient(90deg, ${palette.accent}, ${GOLD_LIGHT})`, borderRadius: "2px", transition: "width 600ms cubic-bezier(0.32, 0.72, 0.24, 1)" }} />
          </div>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: T.caption, color: INK_MUTED, whiteSpace: "nowrap" }}>
            {masteredInChapter}/{chapter.lessons.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function LessonNode({
  lesson,
  state,
  palette,
  leftPct,
  topPct,
  cardSide,
  cardTopPct,
  cardGutterPx,
  cardWidthPx,
}: {
  lesson: CurriculumModule["chapters"][number]["lessons"][number];
  state: "done" | "next" | "locked";
  palette: { accent: string; tint: string; border: string };
  leftPct: number;
  topPct: number;
  cardSide: "left" | "right";
  cardTopPct: number;
  cardGutterPx: number;
  cardWidthPx: number;
}) {
  const interactive = (state === "done" || state === "next") && lesson.isAuthored;
  const size = state === "next" ? 92 : 72;
  const uid = lesson.slug;

  // Lotus glyph — sits ON the path
  const Lotus = (
    <div
      style={{
        position: "absolute",
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 4,
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* outer halo ring — pulses only on 'next' */}
      {state === "next" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-18px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.accent}28 0%, ${palette.accent}00 65%)`,
            animation: "gl-node-pulse 2.6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          filter: state === "done"
            ? `drop-shadow(0 10px 20px ${palette.accent}55)`
            : state === "next"
              ? `drop-shadow(0 14px 28px ${palette.accent}66)`
              : "drop-shadow(0 4px 8px rgba(74, 56, 24, 0.15))",
          animation: state === "next" ? "gl-lotus-breathe 4.2s ease-in-out infinite" : undefined,
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        }}
      >
          <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block", overflow: "visible" }}>
            <defs>
              <radialGradient id={`lotus-petal-${uid}`} cx="50%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FFFCF0" />
                <stop offset="60%" stopColor={state === "done" ? palette.accent : palette.tint} />
                <stop offset="100%" stopColor={palette.accent} />
              </radialGradient>
              <radialGradient id={`lotus-petal-done-${uid}`} cx="50%" cy="35%" r="70%">
                <stop offset="0%" stopColor={GOLD_LIGHT} />
                <stop offset="50%" stopColor={palette.accent} />
                <stop offset="100%" stopColor={palette.accent} stopOpacity="0.8" />
              </radialGradient>
              <radialGradient id={`lotus-center-${uid}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFCF0" />
                <stop offset="100%" stopColor={palette.accent} />
              </radialGradient>
            </defs>

            {/* LOCKED — closed bud: only 3 visible petals + heavy outline */}
            {state === "locked" && (
              <g opacity="0.7">
                {/* base sepal triangle */}
                <path
                  d="M 50 28 Q 38 50, 50 78 Q 62 50, 50 28 Z"
                  fill="rgba(255, 249, 235, 0.55)"
                  stroke={palette.accent}
                  strokeWidth="1.6"
                  strokeDasharray="2 3"
                  opacity="0.6"
                />
                <path
                  d="M 28 55 Q 40 45, 50 78"
                  fill="none"
                  stroke={palette.accent}
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                  opacity="0.45"
                />
                <path
                  d="M 72 55 Q 60 45, 50 78"
                  fill="none"
                  stroke={palette.accent}
                  strokeWidth="1.2"
                  strokeDasharray="2 3"
                  opacity="0.45"
                />
                <circle cx="50" cy="60" r="18" fill="rgba(255, 252, 240, 0.55)" stroke="rgba(156, 122, 47, 0.45)" strokeWidth="1.5" />
              </g>
            )}

            {/* NEXT or DONE — open lotus: 8 petals around a glowing center */}
            {(state === "next" || state === "done") && (
              <g style={{ transformOrigin: "50px 50px", transformBox: "fill-box" }}>
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = (i / 8) * 360;
                  // petal tear-drop path: tip at top, base at center
                  return (
                    <g key={i} transform={`rotate(${angle} 50 50)`}>
                      <path
                        d="M 50 50 Q 42 28 50 12 Q 58 28 50 50 Z"
                        fill={state === "done" ? `url(#lotus-petal-done-${uid})` : `url(#lotus-petal-${uid})`}
                        stroke={palette.accent}
                        strokeWidth="0.8"
                        opacity={state === "done" ? 0.96 : 0.82}
                      />
                      {/* petal mid-line for hand-carved feel */}
                      <line x1="50" y1="14" x2="50" y2="46" stroke={palette.accent} strokeWidth="0.4" opacity="0.55" />
                    </g>
                  );
                })}
                {/* secondary smaller petal layer between the main petals */}
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = (i / 8) * 360 + 22.5;
                  return (
                    <g key={`b-${i}`} transform={`rotate(${angle} 50 50)`} opacity="0.55">
                      <path
                        d="M 50 50 Q 45 36 50 24 Q 55 36 50 50 Z"
                        fill={state === "done" ? GOLD_LIGHT : "#FFF9E8"}
                        stroke={palette.accent}
                        strokeWidth="0.4"
                      />
                    </g>
                  );
                })}
                {/* center disc */}
                <circle cx="50" cy="50" r="13" fill={`url(#lotus-center-${uid})`} stroke={palette.accent} strokeWidth="1.2" />
                {/* tiny seed dots around the center */}
                {Array.from({ length: 8 }, (_, i) => {
                  const a = (i / 8) * Math.PI * 2;
                  const x = 50 + Math.cos(a) * 8;
                  const y = 50 + Math.sin(a) * 8;
                  return <circle key={`seed-${i}`} cx={x} cy={y} r="0.9" fill={palette.accent} opacity="0.85" />;
                })}
              </g>
            )}
          </svg>

          {/* Inner state badge (overlaid on lotus center) */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {state === "done" && <Check size={size >= 92 ? 22 : 18} strokeWidth={3} style={{ color: "#FFF9F0", filter: "drop-shadow(0 1px 1px rgba(74,56,24,0.5))" }} />}
            {state === "next" && (
              <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "22px", color: palette.accent, fontWeight: 600, lineHeight: 1, textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>
                {lesson.sequence}
              </span>
            )}
            {state === "locked" && <Lock size={16} style={{ color: "rgba(156, 122, 47, 0.6)" }} />}
          </div>
        </div>
    </div>
  );

  // Card — pinned to a margin column, vertically centred on the lotus's path-y
  const cardPositionStyle: React.CSSProperties = {
    position: "absolute",
    top: `${cardTopPct}%`,
    transform: "translateY(-50%)",
    width: `${cardWidthPx}px`,
    zIndex: 4,
    ...(cardSide === "left"
      ? { left: `${cardGutterPx}px` }
      : { right: `${cardGutterPx}px` }),
  };

  const Card = (
    <div
      style={{
        ...cardPositionStyle,
        padding: state === "next" ? "12px 14px" : "10px 12px",
        background: state === "next"
          ? "linear-gradient(180deg, rgba(255, 252, 240, 0.96), rgba(255, 244, 220, 0.88))"
          : state === "done"
            ? "linear-gradient(180deg, rgba(255, 252, 240, 0.86), rgba(255, 244, 220, 0.76))"
            : "rgba(255, 252, 240, 0.55)",
        borderRadius: "10px",
        border: `1px solid ${state === "locked" ? "rgba(156, 122, 47, 0.22)" : palette.border}`,
        boxShadow: state === "next"
          ? `0 10px 26px ${palette.accent}33, 0 1px 0 rgba(255, 255, 255, 0.85) inset`
          : state === "done"
            ? `0 4px 14px ${palette.accent}1f, 0 1px 0 rgba(255, 255, 255, 0.65) inset`
            : "0 1px 0 rgba(255, 255, 255, 0.6) inset",
        backdropFilter: "blur(8px) saturate(140%)",
        textAlign: cardSide === "left" ? "right" : "left",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 240ms cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 240ms",
      }}
    >
      {state !== "locked" && (
        <>
          <span aria-hidden style={{ position: "absolute", top: "3px", left: "3px", width: "8px", height: "8px", borderTop: `1px solid ${palette.accent}`, borderLeft: `1px solid ${palette.accent}`, opacity: 0.6 }} />
          <span aria-hidden style={{ position: "absolute", top: "3px", right: "3px", width: "8px", height: "8px", borderTop: `1px solid ${palette.accent}`, borderRight: `1px solid ${palette.accent}`, opacity: 0.6 }} />
          <span aria-hidden style={{ position: "absolute", bottom: "3px", left: "3px", width: "8px", height: "8px", borderBottom: `1px solid ${palette.accent}`, borderLeft: `1px solid ${palette.accent}`, opacity: 0.6 }} />
          <span aria-hidden style={{ position: "absolute", bottom: "3px", right: "3px", width: "8px", height: "8px", borderBottom: `1px solid ${palette.accent}`, borderRight: `1px solid ${palette.accent}`, opacity: 0.6 }} />
        </>
      )}
      {state === "next" && (
        <p style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.20em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: palette.accent, boxShadow: `0 0 8px ${palette.accent}` }} />
          Continue here
        </p>
      )}
      {state === "done" && (
        <p style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.20em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "4px" }}>
          <Check size={11} strokeWidth={3} /> Mastered
        </p>
      )}
      <h4
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: state === "next" ? "18px" : "15.5px",
          fontWeight: 500,
          color: state === "locked" ? INK_MUTED : INK_PRIMARY,
          lineHeight: 1.28,
          marginBottom: "4px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        <span style={{ opacity: 0.65, marginRight: "6px", color: palette.accent, fontWeight: 600, fontStyle: "italic" }}>{lesson.sequence}.</span>
        {lesson.title}
      </h4>
      <div style={{ display: "flex", alignItems: "center", justifyContent: cardSide === "left" ? "flex-end" : "flex-start", gap: "8px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "12.5px", color: INK_MUTED, lineHeight: 1.4 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
          <span aria-hidden style={{ width: "3px", height: "3px", borderRadius: "50%", background: palette.accent, opacity: 0.7 }} />
          {lesson.targetMinutes} min
        </span>
        {lesson.bloomLevels.length > 0 && (
          <>
            <span aria-hidden style={{ width: "3px", height: "3px", borderRadius: "50%", background: palette.accent, opacity: 0.5 }} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "130px" }}>{lesson.bloomLevels.join(" · ")}</span>
          </>
        )}
      </div>
    </div>
  );

  const styles = (
    <style key={`lns-${uid}`}>{`
      @keyframes gl-node-pulse {
        0%, 100% { transform: scale(1); opacity: 0.55; }
        50%      { transform: scale(1.14); opacity: 0.85; }
      }
    `}</style>
  );

  if (interactive) {
    return (
      <Link href={lesson.href} style={{ display: "contents", textDecoration: "none", color: "inherit" }}>
        {Lotus}
        {Card}
        {styles}
      </Link>
    );
  }
  return (
    <>
      {Lotus}
      {Card}
      {styles}
    </>
  );
}

function ModuleSidePanel({
  module: m,
  moduleMasteredCount,
  lessons,
  nextSlug,
  moduleTimeMs,
  syncStatus,
}: {
  module: CurriculumModule;
  moduleMasteredCount: number;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
  nextSlug?: string;
  moduleTimeMs: number;
  syncStatus: ReturnType<typeof useLearningSync>;
}) {
  const palette = paletteForModule(m.sequence - 1);

  // Compute next-milestone hint
  const firstUncompletedChapter = m.chapters.find((c) =>
    c.lessons.some((l) => lessons[l.canonicalSlug]?.masteryStatus !== "Mastered"),
  );
  const nextMilestone = firstUncompletedChapter ? `Master Chapter ${firstUncompletedChapter.sequence}` : "Tier complete";

  // Bloom mix — aggregate across all lessons
  const bloomCounts: Record<string, number> = {};
  for (const ch of m.chapters) {
    for (const l of ch.lessons) {
      for (const b of l.bloomLevels) bloomCounts[b] = (bloomCounts[b] || 0) + 1;
    }
  }
  const topBlooms = Object.entries(bloomCounts).sort((a, b) => b[1] - a[1]).slice(0, 2).map((e) => e[0]).join(" + ");

  return (
    <aside style={{ position: "sticky", top: "140px", alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Server-authoritative gamification panel — XP, tier, badges */}
      <GamificationPanel
        dashboard={syncStatus.dashboard}
        hasIdentity={syncStatus.hasIdentity}
        isReachable={syncStatus.isReachable}
      />

      <div style={{ ...glassPanel, padding: "22px 22px 24px", position: "relative", overflow: "hidden" }}>
        {/* Constellation backdrop behind the mandala */}
        <ConstellationDots />

        <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.22em", color: palette.accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "16px", textAlign: "center", position: "relative", zIndex: 1 }}>
          Module {m.sequence} Mastery
        </p>

        <MasteryMandala
          module={m}
          lessons={lessons}
          nextSlug={nextSlug}
          totalMastered={moduleMasteredCount}
        />

        {/* Per-chapter mini progress bars */}
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px", position: "relative", zIndex: 1 }}>
          {m.chapters.map((ch, idx) => {
            const cp = CHAPTER_PALETTES[idx % CHAPTER_PALETTES.length];
            const chMastered = ch.lessons.filter((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered").length;
            const chPct = ch.lessons.length > 0 ? (chMastered / ch.lessons.length) * 100 : 0;
            return (
              <div key={ch.slug}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11.5px", color: INK_SECONDARY, fontFamily: "var(--font-sans), system-ui, sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cp.accent }} />
                    Ch {ch.sequence}
                  </span>
                  <span style={{ fontSize: "11.5px", color: INK_MUTED, fontFamily: "var(--font-cormorant), serif", fontStyle: "italic" }}>
                    {chMastered} / {ch.lessons.length}
                  </span>
                </div>
                <div style={{ height: "4px", borderRadius: "999px", background: `${cp.accent}1F`, position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 1px rgba(62, 42, 31, 0.10)" }}>
                  <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${Math.max(2, chPct)}%`, background: `linear-gradient(to right, ${cp.accent}, ${cp.accent}cc)`, borderRadius: "999px", boxShadow: `0 0 6px ${cp.accent}88` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Stat rows */}
        <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: `1px dashed ${palette.accent}33`, display: "flex", flexDirection: "column", gap: "10px", position: "relative", zIndex: 1 }}>
          <StatRow label="Time invested" value={formatModuleTime(moduleTimeMs)} icon={<Clock size={11} />} accent={palette.accent} />
          <StatRow label="Next milestone" value={nextMilestone} icon={<Sparkles size={11} />} accent={palette.accent} />
          <StatRow label="Bloom mix" value={topBlooms || "—"} icon={<TrendingUp size={11} />} accent={palette.accent} />
        </div>
      </div>
    </aside>
  );
}

function StatRow({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.14em", color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        <span style={{ color: accent }}>{icon}</span>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13px", color: INK_SECONDARY, textAlign: "right", lineHeight: 1.3 }}>
        {value}
      </span>
    </div>
  );
}

/** Faint star-dot backdrop behind the mandala. */
function ConstellationDots() {
  const dots = useMemo(() => {
    let s = 41;
    const r = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    return Array.from({ length: 30 }, () => ({ x: r() * 100, y: r() * 100, radius: 0.5 + r() * 1.2, opacity: 0.12 + r() * 0.18 }));
  }, []);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55 }} aria-hidden="true">
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.radius} fill={GOLD_DEEP} opacity={d.opacity} />)}
    </svg>
  );
}

/** The Mastery Mandala — 16 lesson dots arranged around a center disc, color-coded by chapter. */
function MasteryMandala({
  module: m,
  lessons,
  nextSlug,
  totalMastered,
}: {
  module: CurriculumModule;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
  nextSlug?: string;
  totalMastered: number;
}) {
  const flatLessons = useMemo(() => {
    return m.chapters.flatMap((ch, chIdx) => ch.lessons.map((l) => ({ lesson: l, chIdx, ch })));
  }, [m]);
  const N = flatLessons.length;
  const SIZE = 240;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const DOT_R = N <= 16 ? 9 : 7;
  const ORBIT_R = 84;
  const ARC_R = 100;
  const ARC_W = 6;

  // Compute the chapter-arc segments (start/end angles in degrees, -90 anchored to top)
  const chapterArcs = useMemo(() => {
    const out: Array<{ chIdx: number; accent: string; startA: number; endA: number; pct: number }> = [];
    let idx = 0;
    m.chapters.forEach((ch, chIdx) => {
      const startA = (idx / N) * 360 - 90;
      const endA = ((idx + ch.lessons.length) / N) * 360 - 90;
      const mastered = ch.lessons.filter((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered").length;
      const pct = ch.lessons.length > 0 ? mastered / ch.lessons.length : 0;
      out.push({ chIdx, accent: CHAPTER_PALETTES[chIdx % CHAPTER_PALETTES.length].accent, startA, endA, pct });
      idx += ch.lessons.length;
    });
    return out;
  }, [m, lessons, N]);

  const pct = m.totalLessons > 0 ? totalMastered / m.totalLessons : 0;

  // Convert (cx, cy, r, angle°) to (x, y)
  const polar = (cx: number, cy: number, r: number, deg: number) => {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  // Build an SVG arc path
  const arcPath = (startA: number, endA: number, r: number) => {
    const start = polar(CX, CY, r, endA);
    const end = polar(CX, CY, r, startA);
    const largeArc = endA - startA <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, margin: "0 auto" }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{ position: "relative", zIndex: 1, overflow: "visible" }}>
        <defs>
          <radialGradient id="mandala-center" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#FFFCF0" />
            <stop offset="100%" stopColor="rgba(252, 230, 184, 0.7)" />
          </radialGradient>
        </defs>

        {/* Outer chapter arcs (background tracks) */}
        {chapterArcs.map((arc, i) => (
          <path key={`tr-${i}`} d={arcPath(arc.startA, arc.endA, ARC_R)} stroke={`${arc.accent}26`} strokeWidth={ARC_W} fill="none" strokeLinecap="round" />
        ))}
        {/* Outer chapter arcs (filled by mastery) */}
        {chapterArcs.map((arc, i) => {
          if (arc.pct <= 0) return null;
          const span = arc.endA - arc.startA;
          return <path key={`fl-${i}`} d={arcPath(arc.startA, arc.startA + span * arc.pct, ARC_R)} stroke={arc.accent} strokeWidth={ARC_W} fill="none" strokeLinecap="round" />;
        })}

        {/* 12 cardinal tick marks (zodiac-style outer ornament) */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * 360 - 90;
          const p1 = polar(CX, CY, ARC_R + 9, a);
          const p2 = polar(CX, CY, ARC_R + 13, a);
          return <line key={`tick-${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={GOLD_DEEP} strokeWidth="0.8" opacity="0.45" />;
        })}

        {/* Lesson dots arranged on inner orbit */}
        {flatLessons.map((entry, i) => {
          const angle = (i / N) * 360 - 90;
          const p = polar(CX, CY, ORBIT_R, angle);
          const status = lessons[entry.lesson.canonicalSlug]?.masteryStatus;
          const isDone = status === "Mastered";
          const isNext = entry.lesson.canonicalSlug === nextSlug;
          const cp = CHAPTER_PALETTES[entry.chIdx % CHAPTER_PALETTES.length];
          return (
            <g key={`dot-${i}`} className="gl-mandala-dot">
              {/* Hover hit area */}
              <circle cx={p.x} cy={p.y} r={DOT_R + 6} fill="transparent">
                <title>{`Ch ${entry.ch.sequence} · Lesson ${entry.lesson.sequence} — ${entry.lesson.title}`}</title>
              </circle>
              {/* Pulse halo for next-lesson */}
              {isNext && (
                <circle cx={p.x} cy={p.y} r={DOT_R + 4} fill="none" stroke={cp.accent} strokeWidth="1.2" opacity="0.6">
                  <animate attributeName="r" values={`${DOT_R + 4};${DOT_R + 8};${DOT_R + 4}`} dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.15;0.6" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              {/* The dot itself */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isNext ? DOT_R + 1 : DOT_R}
                fill={isDone ? cp.accent : isNext ? "rgba(255, 252, 240, 0.95)" : "rgba(255, 252, 240, 0.7)"}
                stroke={cp.accent}
                strokeWidth={isNext ? 2 : 1.5}
              />
              {/* Check inside mastered dots */}
              {isDone && (
                <path d={`M ${p.x - 3} ${p.y} L ${p.x - 0.5} ${p.y + 2.5} L ${p.x + 3.5} ${p.y - 2.5}`} stroke="#FFFCF0" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {/* Lesson number for next dot */}
              {isNext && (
                <text x={p.x} y={p.y + 3} textAnchor="middle" fontSize="9" fontFamily="var(--font-sans), system-ui, sans-serif" fill={cp.accent} fontWeight="700">{entry.lesson.sequence}</text>
              )}
            </g>
          );
        })}

        {/* Center disc */}
        <circle cx={CX} cy={CY} r="56" fill="url(#mandala-center)" stroke={GOLD} strokeWidth="1.2" filter="drop-shadow(0 2px 6px rgba(62, 42, 31, 0.10))" />
        <circle cx={CX} cy={CY} r="50" fill="none" stroke={GOLD} strokeWidth="0.5" strokeDasharray="1 2" opacity="0.55" />

        {/* Center text */}
        <text x={CX} y={CY - 4} textAnchor="middle" fontSize="32" fontFamily="var(--font-cormorant), serif" fill="var(--gl-ink-primary)" fontWeight="500">{Math.round(pct * 100)}%</text>
        <text x={CX} y={CY + 18} textAnchor="middle" fontSize="13" fontFamily="var(--font-cormorant), serif" fontStyle="italic" fill="var(--gl-ink-muted)">{totalMastered} / {m.totalLessons}</text>
      </svg>
      <style>{`
        .gl-mandala-dot { transition: transform 220ms cubic-bezier(0.32, 0.72, 0.24, 1); transform-box: fill-box; transform-origin: center; cursor: default; }
        .gl-mandala-dot:hover { transform: scale(1.25); }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * 4 · MODULE GRID — all 24 modules in Tier 1
 * ════════════════════════════════════════════════════════════════════ */
function ModuleGrid({
  tier,
  focusModuleSlug,
  lessons,
}: {
  tier: CurriculumTier;
  focusModuleSlug: string;
  lessons: Record<string, { masteryStatus?: string } | undefined>;
}) {
  return (
    <section style={{ padding: "72px 32px", background: "rgba(252, 230, 184, 0.18)", borderTop: `1px solid ${GOLD}22`, borderBottom: `1px solid ${GOLD}22` }}>
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.28em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "10px" }}>
            Your Tier {tier.sequence} Journey
          </p>
          <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.display, fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.15, marginBottom: "12px" }}>
            {tier.modules.length} Modules · {tier.totalLessons} Lessons
          </h2>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: T.body, color: INK_SECONDARY, maxWidth: "640px", margin: "0 auto", lineHeight: 1.55 }}>
            Each module unlocks as the previous is mastered. Start with Module 1 and walk the full Foundation tier.
          </p>
        </header>

        <div className="gl-module-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {tier.modules.map((m, idx) => {
            const palette = paletteForModule(idx);
            const masteredInModule = m.chapters
              .flatMap((c) => c.lessons)
              .filter((l) => lessons[l.canonicalSlug]?.masteryStatus === "Mastered").length;
            const isCurrent = m.slug === focusModuleSlug;
            const isFirst = idx === 0;
            const isLocked = !isCurrent && !isFirst;
            const isComplete = masteredInModule === m.totalLessons && m.totalLessons > 0;
            return (
              <ScrollReveal key={m.slug} delayMs={(idx % 3) * 80} offsetPx={32}>
                <ModuleCard
                  module={m}
                  palette={palette}
                  masteredInModule={masteredInModule}
                  state={isComplete ? "complete" : isCurrent ? "current" : isLocked ? "locked" : "unlocked"}
                  lessons={lessons}
                />
              </ScrollReveal>
            );
          })}
        </div>
        <style>{`
          @media (max-width: 1100px) {
            .gl-module-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 720px) {
            .gl-module-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function ModuleCard({
  module: m,
  palette,
  masteredInModule,
  state,
  lessons: _lessons,
}: {
  module: CurriculumModule;
  palette: ModulePaletteEntry;
  masteredInModule: number;
  state: "complete" | "current" | "unlocked" | "locked";
  lessons: Record<string, { masteryStatus?: string } | undefined>;
}) {
  const pct = m.totalLessons > 0 ? (masteredInModule / m.totalLessons) * 100 : 0;
  const canEnter = state === "current" || state === "unlocked" || state === "complete";

  // Locked palette desaturates to a quiet sepia; everyone else keeps full saturation.
  const isLocked = state === "locked";
  const isCurrent = state === "current";
  const isComplete = state === "complete";
  const accent = isLocked ? "#8B7355" : palette.accent;
  const glow = isLocked ? "rgba(139, 115, 85, 0.18)" : palette.glow;

  // Card shell — strong material with skeuomorphic depth + colored shadow
  const cardStyle: React.CSSProperties = {
    position: "relative",
    background: "linear-gradient(180deg, #FFFCF0 0%, rgba(252, 245, 224, 0.96) 100%)",
    border: isCurrent ? `2.5px solid ${accent}` : `1.5px solid ${accent}55`,
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: isCurrent
      ? `0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 -1px 0 ${accent}28 inset, 0 20px 48px ${glow}, 0 8px 20px ${accent}33, 0 2px 6px ${accent}22`
      : `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 rgba(139, 90, 43, 0.10) inset, 0 14px 36px ${glow}, 0 4px 12px rgba(62, 42, 31, 0.08)`,
    opacity: isLocked ? 0.86 : 1,
    transition: "transform 280ms cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 280ms cubic-bezier(0.32, 0.72, 0.24, 1)",
    display: "flex",
    flexDirection: "column",
  };

  // Top accent band — the high-contrast color zone
  // Compact single-row top band (~60px tall vs the prior ~110px)
  const bandStyle: React.CSSProperties = {
    position: "relative",
    padding: "12px 16px",
    background: isLocked
      ? `linear-gradient(135deg, ${accent}cc 0%, ${accent}99 100%)`
      : isComplete
        ? `linear-gradient(135deg, ${accent} 0%, ${accent}dd 60%, ${accent}b8 100%)`
        : `linear-gradient(135deg, ${accent} 0%, ${accent}d9 100%)`,
    color: "#FFF9F0",
    overflow: "hidden",
  };

  const Inner = (
    <article
      style={cardStyle}
      onMouseEnter={(e) => {
        if (isLocked) return;
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = isCurrent
          ? `0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 -1px 0 ${accent}28 inset, 0 28px 60px ${glow}, 0 12px 28px ${accent}55, 0 2px 6px ${accent}22`
          : `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 rgba(139, 90, 43, 0.10) inset, 0 24px 52px ${glow}, 0 8px 20px ${accent}3a`;
      }}
      onMouseLeave={(e) => {
        if (isLocked) return;
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isCurrent
          ? `0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 -1px 0 ${accent}28 inset, 0 20px 48px ${glow}, 0 8px 20px ${accent}33, 0 2px 6px ${accent}22`
          : `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 rgba(139, 90, 43, 0.10) inset, 0 14px 36px ${glow}, 0 4px 12px rgba(62, 42, 31, 0.08)`;
      }}
    >
      {/* ═══ TOP BAND — saturated accent zone (the color identity) ═══ */}
      <div style={bandStyle}>
        {/* Top glass-edge highlight */}
        <span aria-hidden="true" style={{ position: "absolute", top: 0, left: "8%", right: "8%", height: "1px", background: "rgba(255, 255, 255, 0.55)" }} />
        {/* Diagonal sheen */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, transparent 35%, transparent 65%, rgba(0, 0, 0, 0.08) 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Manuscript grain overlay */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/learning/manuscript-grain.svg)",
            mixBlendMode: "overlay",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        />

        {/* Single horizontal row: icon · module label · status badge */}
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Icon cameo (smaller now to fit single-row band) */}
          <div
            style={{
              flexShrink: 0,
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "rgba(255, 252, 240, 0.92)",
              border: "1.5px solid rgba(255, 255, 255, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 0 rgba(255, 255, 255, 0.6) inset, 0 2px 8px rgba(0, 0, 0, 0.18)",
            }}
          >
            <ModuleIllustration index={m.sequence} accent={accent} size={28} />
          </div>

          {/* Module label takes middle */}
          <p
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.20em",
              color: "rgba(255, 252, 240, 0.95)",
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.18)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Module {m.sequence} · {palette.hint}
          </p>

          {/* Status badge — right edge */}
          <StatusBadge state={state} />
        </div>
      </div>

      {/* ═══ COMPACT BODY ═══ */}
      <div style={{ padding: "14px 18px 16px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
        <h3
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
            fontWeight: 500,
            color: INK_PRIMARY,
            lineHeight: 1.2,
            letterSpacing: "0.003em",
          }}
        >
          {m.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: INK_MUTED,
            lineHeight: 1.4,
          }}
        >
          {m.chapters.length} chapters · {m.totalLessons} lessons
        </p>

        {/* Progress bar with inline count */}
        <div style={{ marginTop: "auto" }}>
          <div
            style={{
              height: "6px",
              borderRadius: "999px",
              background: `${accent}22`,
              position: "relative",
              overflow: "hidden",
              boxShadow: "inset 0 1px 2px rgba(62, 42, 31, 0.14)",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${Math.max(2, pct)}%`,
                background: `linear-gradient(to right, ${accent}, ${accent}cc)`,
                borderRadius: "999px",
                boxShadow: `0 0 8px ${accent}aa`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "11.5px",
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: INK_MUTED,
                fontWeight: 700,
                fontFamily: "var(--font-sans), system-ui, sans-serif",
              }}
            >
              {isLocked ? `Master Module ${m.sequence - 1} to unlock` : isComplete ? "Mastered" : "Progress"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "15px",
                fontWeight: 600,
                color: accent,
                lineHeight: 1,
              }}
            >
              {masteredInModule} <span style={{ color: INK_MUTED, opacity: 0.7, fontWeight: 500, fontStyle: "italic" }}>/ {m.totalLessons}</span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );

  if (canEnter && m.totalAuthoredLessons > 0) {
    return (
      <Link href={`/learn/tier-1/module-${m.sequence}/chapter-1/lesson-1`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
        {Inner}
      </Link>
    );
  }
  // Locked / unauthored — render the card directly. The hover popover was removed:
  // it positioned absolute below the card and bled into the next grid row, overlapping
  // adjacent cards. Status badge + "Master Module N-1 to unlock" hint inside the card
  // already convey lock state without an unstable tooltip.
  return Inner;
}

function ChipMicro({ icon, label, accent }: { icon: React.ReactNode; label: string; accent: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "999px",
        background: `${accent}14`,
        border: `1px solid ${accent}33`,
        fontSize: "12.5px",
        color: INK_SECONDARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        fontWeight: 600,
        boxShadow: "0 1px 0 rgba(255, 255, 255, 0.5) inset",
      }}
    >
      <span style={{ color: accent }}>{icon}</span>
      {label}
    </span>
  );
}

function StatusBadge({ state }: { state: "complete" | "current" | "unlocked" | "locked" }) {
  const config = {
    complete:  { label: "Mastered",    icon: <Check size={12} strokeWidth={3} />, bg: "rgba(255, 252, 240, 0.95)", fg: "#1A1408" },
    current:   { label: "In Progress", icon: <Sparkles size={12} />,              bg: "rgba(255, 252, 240, 0.95)", fg: "#1A1408" },
    unlocked:  { label: "Open",        icon: <ArrowRight size={12} />,            bg: "rgba(255, 252, 240, 0.90)", fg: "#1A1408" },
    locked:    { label: "Locked",      icon: <Lock size={12} />,                  bg: "rgba(0, 0, 0, 0.25)",       fg: "rgba(255, 252, 240, 0.95)" },
  }[state];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 12px",
        borderRadius: "999px",
        background: config.bg,
        border: state === "locked" ? "1px solid rgba(255, 255, 255, 0.20)" : "1px solid rgba(255, 255, 255, 0.7)",
        fontSize: "11.5px",
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        color: config.fg,
        fontWeight: 700,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: state === "locked" ? "none" : "0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 2px 6px rgba(0, 0, 0, 0.15)",
        whiteSpace: "nowrap",
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

/* ─── Module glyph — themed SVG icon per module (renders just the SVG;
       caller provides the containing surface) ─── */
function ModuleGlyph({ index, accent }: { index: number; accent: string }) {
  const variant = (index - 1) % 8;
  return (
    <svg width="34" height="34" viewBox="0 0 28 28">
      {variant === 0 && (
        // Lotus — Module 1 (Introduction)
        <g fill={accent}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="14" cy="6" rx="3" ry="6.5" transform={`rotate(${a} 14 14)`} opacity="0.95" />
          ))}
          <circle cx="14" cy="14" r="4.2" fill={accent} />
          <circle cx="14" cy="14" r="1.8" fill="#FFF9F0" opacity="0.8" />
        </g>
      )}
      {variant === 1 && (
        // Sundial — Time
        <g fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round">
          <circle cx="14" cy="14" r="11" />
          <line x1="14" y1="5" x2="14" y2="14" />
          <line x1="14" y1="14" x2="21" y2="18" />
          <circle cx="14" cy="14" r="2.4" fill={accent} stroke="none" />
        </g>
      )}
      {variant === 2 && (
        // 5-pointed star — Pañcāṅga
        <g fill={accent}>
          <polygon points="14,1 17.5,10.5 27,11 19,17 22,26.5 14,21 6,26.5 9,17 1,11 10.5,10.5" />
        </g>
      )}
      {variant === 3 && (
        // 12-spoke wheel — Rāśis
        <g fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="14" cy="14" r="11.5" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * 2 * Math.PI;
            const x1 = 14 + Math.cos(a) * 4.5;
            const y1 = 14 + Math.sin(a) * 4.5;
            const x2 = 14 + Math.cos(a) * 11.5;
            const y2 = 14 + Math.sin(a) * 11.5;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
          <circle cx="14" cy="14" r="2.4" fill={accent} stroke="none" />
        </g>
      )}
      {variant === 4 && (
        // 9 planets cluster — Grahas
        <g fill={accent}>
          <circle cx="14" cy="14" r="5.5" />
          {[0, 60, 120, 180, 240, 300].map((a) => {
            const x = 14 + Math.cos((a * Math.PI) / 180) * 9.5;
            const y = 14 + Math.sin((a * Math.PI) / 180) * 9.5;
            return <circle key={a} cx={x} cy={y} r="2.4" />;
          })}
          <circle cx="14" cy="14" r="2" fill="#FFF9F0" opacity="0.7" />
        </g>
      )}
      {variant === 5 && (
        // North Indian chart — Bhāvas
        <g fill="none" stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2.5" y="2.5" width="23" height="23" />
          <line x1="2.5" y1="2.5" x2="25.5" y2="25.5" />
          <line x1="25.5" y1="2.5" x2="2.5" y2="25.5" />
        </g>
      )}
      {variant === 6 && (
        // Constellation — Nakṣatras
        <g fill={accent}>
          {[[14, 3], [22, 10], [20, 20], [10, 22], [4, 14], [10, 6], [18, 16]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2" />
          ))}
          <path d="M 14 3 L 22 10 L 20 20 L 10 22 L 4 14 L 10 6 L 14 3" fill="none" stroke={accent} strokeWidth="0.9" opacity="0.6" />
        </g>
      )}
      {variant === 7 && (
        // Aspect line
        <g fill={accent} stroke={accent} strokeWidth="2" strokeLinecap="round">
          <circle cx="6" cy="14" r="3.5" />
          <circle cx="22" cy="14" r="3.5" />
          <line x1="10" y1="14" x2="18" y2="14" strokeDasharray="2 2" fill="none" />
        </g>
      )}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * 5 · TIER PROGRESS — Tier 1 overall + Tier 2/3 locked previews
 * ════════════════════════════════════════════════════════════════════ */
function TierProgress({
  tier,
  masteredCount,
  otherTiers,
}: {
  tier: CurriculumTier;
  masteredCount: number;
  otherTiers: CurriculumTier[];
}) {
  const pct = tier.totalLessons > 0 ? (masteredCount / tier.totalLessons) * 100 : 0;
  return (
    <section style={{ padding: "72px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Tier 1 progress meter */}
        <div style={{ ...skeuoCard, padding: "32px 36px", marginBottom: "32px" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.24em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "6px" }}>
                Tier {tier.sequence} · {tier.title}
              </p>
              <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.title, fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.2 }}>
                Tier {tier.sequence} mastery
              </h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "36px", fontWeight: 500, color: GOLD_DEEP, lineHeight: 1, letterSpacing: "0.003em" }}>
                {Math.round(pct)}%
              </p>
              <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: T.caption, color: INK_MUTED }}>
                {masteredCount} of {tier.totalLessons} lessons mastered
              </p>
            </div>
          </header>
          <div style={{ height: "12px", borderRadius: "999px", background: "rgba(156, 122, 47, 0.18)", position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(62, 42, 31, 0.16)" }}>
            <div style={{ position: "absolute", inset: "0 auto 0 0", width: `${Math.max(2, pct)}%`, background: `linear-gradient(to right, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_DEEP})`, borderRadius: "999px", boxShadow: `0 0 16px ${GOLD}99, 0 1px 0 rgba(255, 255, 255, 0.5) inset` }} />
          </div>
          <p style={{ marginTop: "16px", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: T.caption, color: INK_SECONDARY, textAlign: "center" }}>
            Master all of Tier {tier.sequence} to unlock Tier {tier.sequence + 1}: Practice.
          </p>
        </div>

        {/* Tier 2 + Tier 3 previews — each gets its own thematic accent, custom illustration,
            module count stat, and "unlocks when" progress. No more two identical text rectangles. */}
        {otherTiers.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }} className="gl-tier-preview-grid">
            {otherTiers.map((t) => (
              <TierPreviewCard
                key={t.slug}
                tier={t}
                tier1Pct={tier.totalLessons > 0 ? Math.round((masteredCount / tier.totalLessons) * 100) : 0}
              />
            ))}
            <style>{`
              @media (max-width: 900px) {
                .gl-tier-preview-grid { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Tier Preview Card — illustrated locked-tier teaser ────────────── */
function TierPreviewCard({ tier, tier1Pct }: { tier: CurriculumTier; tier1Pct: number }) {
  const isTier2 = tier.sequence === 2;
  const accent = isTier2 ? "#4F6FA8" : "#704FC2"; // Śani indigo / amethyst
  const tint = isTier2 ? "rgba(79, 111, 168, 0.10)" : "rgba(112, 79, 194, 0.10)";
  const glow = isTier2 ? "rgba(79, 111, 168, 0.30)" : "rgba(112, 79, 194, 0.30)";

  const teaser = isTier2
    ? "Live chart-reading, predictive mechanics, and the daśā engine. Where Foundation knowledge becomes applied craft."
    : "Synthesis, judgment, and ethical practice. The lineages, schools, and edge cases that separate masters from technicians.";

  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${tint} 0%, rgba(255, 252, 240, 0.55) 100%), url(/assets/learning/manuscript-grain.svg)`,
        backgroundBlendMode: "multiply",
        border: `1.5px solid ${accent}44`,
        boxShadow: `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 ${accent}22 inset, 0 16px 36px ${glow}, 0 4px 12px rgba(62, 42, 31, 0.06)`,
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) 140px",
      }}
    >
      {/* Top accent hairline */}
      <span aria-hidden="true" style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "2px", background: `linear-gradient(to right, transparent, ${accent} 50%, transparent)`, borderRadius: "999px" }} />

      {/* LEFT — content */}
      <div style={{ padding: "28px 32px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px", borderRadius: "999px", background: `${accent}14`, border: `1px solid ${accent}44`, marginBottom: "16px" }}>
          <Lock size={11} style={{ color: accent }} />
          <span style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.20em", color: accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            Tier {tier.sequence} · Locked
          </span>
        </div>

        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "30px", fontWeight: 500, color: INK_PRIMARY, marginBottom: "10px", lineHeight: 1.15, letterSpacing: "0.003em" }}>
          The {tier.title}
        </h3>

        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "15.5px", color: INK_SECONDARY, lineHeight: 1.55, marginBottom: "18px" }}>
          {teaser}
        </p>

        {/* Unlock-progress strip */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
            <span style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.16em", color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              Unlocks at Tier 1 complete
            </span>
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "15px", fontWeight: 600, color: accent }}>
              {tier1Pct}%
            </span>
          </div>
          <div style={{ height: "6px", borderRadius: "999px", background: `${accent}22`, position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(62, 42, 31, 0.14)" }}>
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${Math.max(2, tier1Pct)}%`,
                background: `linear-gradient(to right, ${accent}, ${accent}cc)`,
                borderRadius: "999px",
                boxShadow: `0 0 8px ${accent}aa`,
              }}
            />
          </div>
        </div>
      </div>

      {/* RIGHT — thematic illustration */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "28px 16px", borderLeft: `1px solid ${accent}22`, background: `${accent}08` }}>
        {isTier2 ? <TierIconChart accent={accent} /> : <TierIconMandala accent={accent} />}
      </div>
    </article>
  );
}

/** Tier 2 illustration — astrologer's wheel-and-arrow (applied craft). */
function TierIconChart({ accent }: { accent: string }) {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <radialGradient id="t2-grad" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFCF0" />
          <stop offset="100%" stopColor={`${accent}33`} />
        </radialGradient>
      </defs>
      {/* outer 12-spoke chart */}
      <circle cx="48" cy="48" r="42" fill="url(#t2-grad)" stroke={accent} strokeWidth="1.6" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = 48 + Math.cos(a) * 14;
        const y1 = 48 + Math.sin(a) * 14;
        const x2 = 48 + Math.cos(a) * 42;
        const y2 = 48 + Math.sin(a) * 42;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth="0.8" opacity="0.55" />;
      })}
      {/* inner ring */}
      <circle cx="48" cy="48" r="14" fill={accent} opacity="0.85" />
      {/* daśā arrow */}
      <line x1="48" y1="48" x2="78" y2="28" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
      <polygon points="78,28 70,30 73,36" fill={accent} />
      {/* planet markers around the ring */}
      {[0, 90, 180, 270].map((d) => {
        const a = (d * Math.PI) / 180;
        const x = 48 + Math.cos(a) * 28;
        const y = 48 + Math.sin(a) * 28;
        return <circle key={d} cx={x} cy={y} r="2.5" fill={accent} />;
      })}
      <circle cx="48" cy="48" r="2.5" fill="#FFFCF0" />
    </svg>
  );
}

/** Tier 3 illustration — sacred mountain + mandala crown (synthesis & mastery). */
function TierIconMandala({ accent }: { accent: string }) {
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <radialGradient id="t3-grad" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#FFFCF0" />
          <stop offset="100%" stopColor={`${accent}33`} />
        </radialGradient>
      </defs>
      {/* outer mandala */}
      <circle cx="48" cy="48" r="42" fill="url(#t3-grad)" stroke={accent} strokeWidth="1.4" />
      {/* mandala petals */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((d) => (
        <ellipse key={d} cx="48" cy="14" rx="3" ry="9" fill={accent} opacity="0.55" transform={`rotate(${d} 48 48)`} />
      ))}
      {/* mountain peak (rising path) */}
      <polygon points="48,30 64,68 32,68" fill={accent} opacity="0.85" />
      <polygon points="48,30 54,48 48,46 42,48" fill="#FFFCF0" opacity="0.5" />
      {/* crown point */}
      <circle cx="48" cy="26" r="3.5" fill={accent} />
      <circle cx="48" cy="26" r="1.4" fill="#FFFCF0" />
      {/* ground line */}
      <line x1="20" y1="72" x2="76" y2="72" stroke={accent} strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
 * 6 · ACHIEVEMENTS — varied seals with progress bars
 * ════════════════════════════════════════════════════════════════════ */

type AchievementTier = "starter" | "intermediate" | "master";
interface Achievement {
  name: string;
  devanagari: string;
  threshold: number;
  hint: string;
  tier: AchievementTier;
  /** Custom SVG illustration kind. */
  icon: "step" | "tirthas" | "scroll" | "mandala" | "staff";
}

const ACHIEVEMENTS: Achievement[] = [
  { name: "First Step",         devanagari: "एकपथ",       threshold: 1,   hint: "Complete your first lesson",   tier: "starter",      icon: "step"    },
  { name: "Three Stops",        devanagari: "त्रिपथ",      threshold: 3,   hint: "Master three lessons",         tier: "starter",      icon: "tirthas" },
  { name: "One Chapter",        devanagari: "एकाध्यायी",  threshold: 4,   hint: "Finish a full chapter",        tier: "intermediate", icon: "scroll"  },
  { name: "One Module",         devanagari: "क्षेत्रपति",   threshold: 16,  hint: "Complete a whole module",      tier: "intermediate", icon: "mandala" },
  { name: "Foundation Pilgrim", devanagari: "तीर्थयात्री", threshold: 598, hint: "Master all of Tier 1",         tier: "master",       icon: "staff"   },
];

const TIER_ACCENTS: Record<AchievementTier, { accent: string; label: string }> = {
  starter:      { accent: "#C28220", label: "Starter"     },
  intermediate: { accent: "#4F6FA8", label: "Intermediate" },
  master:       { accent: "#704FC2", label: "Master"      },
};

function AchievementsStrip({ masteredCount }: { masteredCount: number }) {
  // Split out the master-tier featured seal from the rest
  const masterSeal = ACHIEVEMENTS.find((a) => a.tier === "master");
  const otherSeals = ACHIEVEMENTS.filter((a) => a.tier !== "master");

  return (
    <section style={{ padding: "72px 32px 0", textAlign: "center" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: T.micro, textTransform: "uppercase", letterSpacing: "0.28em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "10px" }}>
          Wax seals to earn
        </p>
        <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: T.display, fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.15, marginBottom: "8px" }}>
          Achievements along the path
        </h2>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: T.body, color: INK_SECONDARY, marginBottom: "40px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
          Seals you earn as you walk the path. Each one waits for a specific milestone.
        </p>

        {/* Featured master seal — wide hero card at top */}
        {masterSeal && (
          <div style={{ marginBottom: "24px" }}>
            <FeaturedMasterSeal achievement={masterSeal} masteredCount={masteredCount} />
          </div>
        )}

        {/* Remaining seals in 2×2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }} className="gl-achievement-grid">
          {otherSeals.map((a) => (
            <AchievementCard key={a.name} achievement={a} masteredCount={masteredCount} />
          ))}
          <style>{`
            @media (max-width: 1100px) {
              .gl-achievement-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 600px) {
              .gl-achievement-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

/* ─── Featured master-tier seal card ─────────────────────────────── */
function FeaturedMasterSeal({ achievement: a, masteredCount }: { achievement: Achievement; masteredCount: number }) {
  const earned = masteredCount >= a.threshold;
  const progress = Math.min(masteredCount, a.threshold);
  const pct = a.threshold > 0 ? (progress / a.threshold) * 100 : 0;
  const accent = TIER_ACCENTS.master.accent;

  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        background: earned
          ? `radial-gradient(ellipse 70% 80% at 30% 50%, ${accent}28 0%, transparent 65%), linear-gradient(135deg, rgba(255, 252, 240, 0.98) 0%, rgba(252, 230, 184, 0.55) 100%), url(/assets/learning/manuscript-grain.svg)`
          : `radial-gradient(ellipse 60% 80% at 30% 50%, ${accent}14 0%, transparent 65%), linear-gradient(135deg, rgba(255, 252, 240, 0.85) 0%, rgba(252, 230, 184, 0.40) 100%), url(/assets/learning/manuscript-grain.svg)`,
        backgroundBlendMode: "multiply",
        border: earned ? `2px solid ${accent}` : `1.5px solid ${accent}44`,
        boxShadow: earned
          ? `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 ${accent}33 inset, 0 24px 56px ${accent}44, 0 8px 20px ${accent}33`
          : `0 1px 0 rgba(255, 255, 255, 0.80) inset, 0 -1px 0 rgba(139, 90, 43, 0.10) inset, 0 16px 40px rgba(112, 79, 194, 0.16), 0 4px 12px rgba(62, 42, 31, 0.06)`,
        display: "grid",
        gridTemplateColumns: "minmax(0, 240px) minmax(0, 1fr)",
        textAlign: "left",
      }}
      className="gl-featured-seal"
    >
      {/* LEFT — ornate seal display */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "36px 24px", background: `linear-gradient(180deg, ${accent}11 0%, ${accent}1F 100%)`, borderRight: `1px solid ${accent}22` }}>
        {/* Radial corona rays behind seal */}
        <svg viewBox="0 0 200 200" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: earned ? 0.5 : 0.25 }} aria-hidden="true">
          <g stroke={accent} strokeWidth="1" strokeLinecap="round">
            {Array.from({ length: 24 }).map((_, i) => {
              const a2 = (i / 24) * 2 * Math.PI;
              const x1 = 100 + Math.cos(a2) * 64;
              const y1 = 100 + Math.sin(a2) * 64;
              const x2 = 100 + Math.cos(a2) * 88;
              const y2 = 100 + Math.sin(a2) * 88;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i % 2 === 0 ? 0.9 : 0.4} />;
            })}
          </g>
        </svg>

        {/* The big wax seal medallion */}
        <WaxSealMedallion kind="staff" accent={accent} earned={earned} size={140} />
      </div>

      {/* RIGHT — content */}
      <div style={{ padding: "32px 36px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
          <span style={{ fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.24em", color: accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", padding: "4px 12px", borderRadius: "999px", background: `${accent}14`, border: `1px solid ${accent}55`, display: "inline-flex", alignItems: "center", gap: "6px" }}>
            ⚜ Master Seal · Legendary
          </span>
          {earned && (
            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: accent, color: "#FFF9F0", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 6px ${accent}66` }}>
              <Check size={12} strokeWidth={3} />
            </span>
          )}
        </div>

        <p lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "20px", color: accent, marginBottom: "6px", opacity: 0.9, lineHeight: 1.3 }}>
          {a.devanagari}
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "32px", fontWeight: 500, color: INK_PRIMARY, lineHeight: 1.15, marginBottom: "10px", letterSpacing: "0.003em" }}>
          {a.name}
        </h3>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "16px", color: INK_SECONDARY, lineHeight: 1.55, marginBottom: "20px", maxWidth: "560px" }}>
          {a.hint}. The crowning seal of the Foundation tier — awarded to scholars who have walked every kṣetra to its end.
        </p>

        {/* Progress bar */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
            <span style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.18em", color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              {earned ? "Sealed" : "Progress toward sealing"}
            </span>
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "18px", fontWeight: 600, color: accent }}>
              {progress} <span style={{ color: INK_MUTED, opacity: 0.7, fontWeight: 500, fontStyle: "italic" }}>/ {a.threshold}</span>
            </span>
          </div>
          <div style={{ height: "10px", borderRadius: "999px", background: `${accent}1F`, position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(62, 42, 31, 0.18), inset 0 -1px 0 rgba(255, 255, 255, 0.45)" }}>
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${Math.max(2, pct)}%`,
                background: `linear-gradient(to right, ${accent}, ${accent}aa)`,
                borderRadius: "999px",
                boxShadow: `0 0 14px ${accent}cc, 0 1px 0 rgba(255, 255, 255, 0.45) inset`,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .gl-featured-seal { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
}

function AchievementCard({ achievement: a, masteredCount }: { achievement: Achievement; masteredCount: number }) {
  const earned = masteredCount >= a.threshold;
  const progress = Math.min(masteredCount, a.threshold);
  const pct = a.threshold > 0 ? (progress / a.threshold) * 100 : 0;
  const tierMeta = TIER_ACCENTS[a.tier];
  const accent = tierMeta.accent;

  return (
    <article
      style={{
        position: "relative",
        padding: "26px 24px 22px",
        borderRadius: "18px",
        background: earned
          ? `linear-gradient(180deg, rgba(255, 252, 240, 0.95) 0%, ${accent}1A 100%), url(/assets/learning/manuscript-grain.svg)`
          : `linear-gradient(180deg, rgba(255, 252, 240, 0.65) 0%, rgba(252, 230, 184, 0.30) 100%)`,
        backgroundBlendMode: "multiply",
        border: earned ? `1.5px solid ${accent}` : `1px dashed ${accent}55`,
        boxShadow: earned
          ? `0 1px 0 rgba(255, 255, 255, 0.85) inset, 0 -1px 0 ${accent}22 inset, 0 14px 32px ${accent}33, 0 4px 12px ${accent}22`
          : `0 1px 0 rgba(255, 255, 255, 0.5) inset, 0 4px 12px rgba(62, 42, 31, 0.05)`,
        transition: "all 280ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        textAlign: "center",
      }}
    >
      {/* Tier chip top-left */}
      <span style={{ position: "absolute", top: "14px", left: "14px", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.16em", color: accent, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", padding: "3px 8px", borderRadius: "999px", background: `${accent}14`, border: `1px solid ${accent}44` }}>
        {tierMeta.label}
      </span>

      {/* Earned check top-right */}
      {earned && (
        <span style={{ position: "absolute", top: "14px", right: "14px", width: "22px", height: "22px", borderRadius: "50%", background: accent, color: "#FFF9F0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 6px ${accent}66` }}>
          <Check size={12} strokeWidth={3} />
        </span>
      )}

      {/* Custom seal illustration */}
      <div style={{ marginTop: "20px", marginBottom: "16px" }}>
        <SealIllustration kind={a.icon} accent={accent} earned={earned} />
      </div>

      <p lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "16px", color: earned ? accent : INK_MUTED, marginBottom: "4px", opacity: 0.9 }}>
        {a.devanagari}
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "20px", fontWeight: 500, color: INK_PRIMARY, marginBottom: "8px", lineHeight: 1.2 }}>
        {a.name}
      </p>
      <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: 1.45, marginBottom: "18px" }}>
        {a.hint}
      </p>

      {/* Progress bar — actual signal toward earning */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
          <span style={{ fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.14em", color: INK_MUTED, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
            {earned ? "Earned" : "Progress"}
          </span>
          <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "14px", fontWeight: 600, color: accent }}>
            {progress} <span style={{ color: INK_MUTED, opacity: 0.7, fontWeight: 500, fontStyle: "italic" }}>/ {a.threshold}</span>
          </span>
        </div>
        <div style={{ height: "6px", borderRadius: "999px", background: `${accent}22`, position: "relative", overflow: "hidden", boxShadow: "inset 0 1px 2px rgba(62, 42, 31, 0.14)" }}>
          <div
            style={{
              position: "absolute",
              inset: "0 auto 0 0",
              width: `${Math.max(2, pct)}%`,
              background: `linear-gradient(to right, ${accent}, ${accent}cc)`,
              borderRadius: "999px",
              boxShadow: `0 0 8px ${accent}aa`,
            }}
          />
        </div>
      </div>
    </article>
  );
}

/** Wax-seal medallion with scalloped rim, pressed-in emblem, embossed depth. */
function WaxSealMedallion({ kind, accent, earned, size = 76 }: { kind: "step" | "tirthas" | "scroll" | "mandala" | "staff"; accent: string; earned: boolean; size?: number }) {
  // Build a wavy scalloped path for the wax-seal outer rim (12 scallops)
  const scallops = 12;
  const R = 46;
  const r = 42;
  const cx = 50;
  const cy = 50;
  let path = "";
  for (let i = 0; i < scallops * 2; i++) {
    const ang = (i / (scallops * 2)) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? R : r;
    const x = cx + Math.cos(ang) * radius;
    const y = cy + Math.sin(ang) * radius;
    path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  path += " Z";

  const emblemColor = earned ? "#FFF9F0" : accent;
  const innerOpacity = earned ? 1 : 0.55;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transition: "transform 320ms cubic-bezier(0.32, 0.72, 0.24, 1)",
      }}
      className="gl-wax-seal"
    >
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`waxgrad-${kind}-${earned ? "e" : "l"}-${accent.replace("#", "")}`} cx="32%" cy="28%" r="80%">
            {earned ? (
              <>
                <stop offset="0%" stopColor="#FFFCF0" stopOpacity="0.65" />
                <stop offset="35%" stopColor={accent} stopOpacity="0.92" />
                <stop offset="100%" stopColor={accent} />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#FFFCF0" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#F0E5C8" />
              </>
            )}
          </radialGradient>
          <filter id={`shadow-${earned ? "e" : "l"}-${accent.replace("#", "")}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy={earned ? "3" : "1"} stdDeviation={earned ? "3.5" : "1.5"} floodColor={accent} floodOpacity={earned ? "0.55" : "0.25"} />
          </filter>
        </defs>
        {/* Outer scalloped wax rim */}
        <path d={path} fill={`url(#waxgrad-${kind}-${earned ? "e" : "l"}-${accent.replace("#", "")})`} stroke={accent} strokeWidth={earned ? "1.5" : "1.2"} filter={`url(#shadow-${earned ? "e" : "l"}-${accent.replace("#", "")})`} opacity={earned ? 1 : 0.85} />
        {/* Inner darker imprint ring */}
        <circle cx="50" cy="50" r="34" fill="none" stroke={earned ? "#FFFCF0" : accent} strokeWidth={earned ? "0.8" : "0.6"} opacity={earned ? 0.45 : 0.4} strokeDasharray="0.5 1.5" />
        {/* The embossed emblem itself, scaled to seal */}
        <g transform="translate(28, 28) scale(1.1)" opacity={innerOpacity}>
          {kind === "step" && (
            <g stroke={emblemColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={emblemColor}>
              {/* lotus bud emerging */}
              <path d="M 20 8 Q 16 14 18 22 Q 20 26 22 22 Q 24 14 20 8 Z" fill={emblemColor} />
              <path d="M 12 24 Q 16 24 20 22 Q 24 24 28 24 Q 26 28 20 28 Q 14 28 12 24 Z" fill={emblemColor} opacity="0.85" />
              {/* base support */}
              <line x1="14" y1="32" x2="26" y2="32" strokeWidth="2.5" />
            </g>
          )}
          {kind === "tirthas" && (
            <g stroke={emblemColor} strokeWidth="1.8" strokeLinecap="round" fill={emblemColor}>
              {/* Three milestone cairns along a curving path */}
              <path d="M 6 30 Q 14 14 20 16 Q 26 18 34 6" fill="none" strokeDasharray="2 3" opacity="0.7" strokeWidth="1.4" />
              <polygon points="6,30 10,24 14,30" fill={emblemColor} />
              <polygon points="16,18 20,10 24,18" fill={emblemColor} />
              <polygon points="28,12 32,4 36,12" fill={emblemColor} opacity="0.95" />
              {/* tiny lotus marker on tallest cairn */}
              <circle cx="32" cy="3" r="1.2" fill={emblemColor} />
            </g>
          )}
          {kind === "scroll" && (
            <g stroke={emblemColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {/* palmyra leaf manuscript */}
              <path d="M 4 12 Q 4 8 8 8 L 32 8 Q 36 8 36 12 L 36 28 Q 36 32 32 32 L 8 32 Q 4 32 4 28 Z" fill={earned ? `${emblemColor}33` : "none"} />
              {/* string-binding */}
              <circle cx="20" cy="20" r="1.8" fill={emblemColor} />
              {/* manuscript text-lines */}
              <line x1="9" y1="14" x2="17" y2="14" strokeWidth="1.2" />
              <line x1="23" y1="14" x2="31" y2="14" strokeWidth="1.2" />
              <line x1="9" y1="20" x2="15" y2="20" strokeWidth="1.2" />
              <line x1="25" y1="20" x2="31" y2="20" strokeWidth="1.2" />
              <line x1="9" y1="26" x2="17" y2="26" strokeWidth="1.2" />
              <line x1="23" y1="26" x2="31" y2="26" strokeWidth="1.2" />
            </g>
          )}
          {kind === "mandala" && (
            <g fill={emblemColor} stroke={emblemColor} strokeWidth="0.8">
              {/* outer 12-petal mandala */}
              {Array.from({ length: 12 }).map((_, i) => (
                <ellipse key={i} cx="20" cy="6" rx="1.8" ry="5.5" transform={`rotate(${i * 30} 20 20)`} opacity={i % 2 === 0 ? 1 : 0.7} />
              ))}
              {/* inner ring of 8 dots */}
              {Array.from({ length: 8 }).map((_, i) => {
                const a2 = (i / 8) * Math.PI * 2;
                return <circle key={i} cx={20 + Math.cos(a2) * 8} cy={20 + Math.sin(a2) * 8} r="1.2" />;
              })}
              {/* center */}
              <circle cx="20" cy="20" r="3.5" />
              <circle cx="20" cy="20" r="1.2" fill={earned ? accent : "#FFF9F0"} stroke="none" />
            </g>
          )}
          {kind === "staff" && (
            <g fill={emblemColor} stroke={emblemColor} strokeWidth="1.6" strokeLinecap="round">
              {/* mountain silhouette behind */}
              <polygon points="6,32 16,12 20,18 24,8 34,32" fill={emblemColor} opacity="0.45" stroke="none" />
              {/* central pilgrim's staff */}
              <line x1="20" y1="5" x2="20" y2="35" strokeWidth="2.2" />
              {/* crown jewel on top */}
              <polygon points="20,3 23,8 20,11 17,8" fill={emblemColor} />
              <circle cx="20" cy="7" r="1.4" fill={earned ? accent : "#FFF9F0"} stroke="none" />
              {/* radiating star rays */}
              {[0, 60, 120, 180, 240, 300].map((d) => {
                const a2 = ((d - 90) * Math.PI) / 180;
                return <line key={d} x1={20 + Math.cos(a2) * 4} y1={7 + Math.sin(a2) * 4} x2={20 + Math.cos(a2) * 8} y2={7 + Math.sin(a2) * 8} strokeWidth="1.2" opacity="0.75" />;
              })}
              {/* grip wraps */}
              <line x1="16" y1="20" x2="24" y2="20" strokeWidth="1.3" />
              <line x1="16" y1="24" x2="24" y2="24" strokeWidth="1.3" />
            </g>
          )}
        </g>
      </svg>
      <style>{`
        .gl-wax-seal { transform: rotate(0deg); }
        article:hover .gl-wax-seal,
        .gl-featured-seal:hover .gl-wax-seal { transform: rotate(6deg) scale(1.05); }
      `}</style>
    </div>
  );
}

/** Legacy alias — keep for the smaller card consumer. */
function SealIllustration({ kind, accent, earned }: { kind: "step" | "tirthas" | "scroll" | "mandala" | "staff"; accent: string; earned: boolean }) {
  return <WaxSealMedallion kind={kind} accent={accent} earned={earned} size={88} />;
}
