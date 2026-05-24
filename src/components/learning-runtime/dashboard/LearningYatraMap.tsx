/**
 * LearningYatraMap — the Tīrtha-Yātrā Mahā-Path.
 *
 * The /learn entry experience as a single continuous gamified pilgrimage:
 *   bottom ⛩  ENTRANCE
 *      ▲   Module 1 (active → expands inline into the Sacred Path)
 *      │   Module 2 (locked)
 *      │   ⋮
 *      │   Module 24 (locked)
 *      │   ──── Tier 2 gateway ────  (locked silhouette)
 *      │   ──── Tier 3 gateway ────  (locked silhouette)
 *   top  🏔 SNOW PEAKS
 *
 * Sequential unlock is the law: a module unlocks only when all chapters in
 * the prior module are mastered. Locked modules show in mist with a lock
 * icon and a "Complete Module N first" tooltip — they are not clickable.
 */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Lock, Check, Sparkles, ChevronDown } from "lucide-react";
import type { CurriculumTier, CurriculumModule } from "@/lib/learning-runtime/curriculum-index";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";

/* ───────────────────── design tokens (locally scoped) ──────────────────── */

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INK_PRIMARY = "#2B1F12";
const INK_SECONDARY = "#5C4A2E";
const INK_MUTED = "#7A6747";

/** 24-module palette — manuscript-coherent, never neon. */
const MODULE_ACCENTS: string[] = [
  "#C28220", // 01 bronze   — Intro to Jyotiṣa (canonical accent)
  "#4A6FA5", // 02 indigo   — Time & Calendar
  "#3A8C5A", // 03 jade     — Pañcāṅga
  "#A23A1E", // 04 vermilion— Zodiac & Rāśi
  "#6B5B95", // 05 plum     — Navagraha
  "#B58A35", // 06 ochre    — North-Indian Chart
  "#4E7BAE", // 07 cobalt   — Lunar Mansions
  "#8C5A2F", // 08 chestnut — Aspects
  "#5B7F4B", // 09 olive    — Hexagonal Subdivision
  "#7A4E8B", // 10 mauve    — Cycles
  "#B5772C", // 11 amber    — Motion
  "#3F6FA0", // 12 steel    — Matrix
  "#9C4B3C", // 13 terracotta — Compass
  "#5F8BAE", // 14 azure    — Conjoined Orbs
  "#C88539", // 15 saffron  — Diya
  "#3A6FA8", // 16 KP steel — KP Stream
  "#7E5A2F", // 17 walnut   — Jaimini
  "#8B3F1E", // 18 burnt    — Lal Kitab
  "#5A6F8C", // 19 slate    — Persian
  "#4F8B6F", // 20 emerald  — Palm Leaf
  "#A06840", // 21 sandalwood — Numerology
  "#3B5F7A", // 22 deepsea  — Vāstu
  "#C29240", // 23 brass    — Muhūrta
  "#7A4F2A", // 24 cedar    — Tantra-Mantra
];

function paletteFor(idx: number) {
  const accent = MODULE_ACCENTS[idx % MODULE_ACCENTS.length];
  return {
    accent,
    tint: hexWithAlpha(accent, 0.10),
    border: hexWithAlpha(accent, 0.45),
    glow: hexWithAlpha(accent, 0.38),
  };
}

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
  return `${hex}${a}`;
}

/* ───────────────────── unlock logic ─────────────────────────────────────── */

type NodeState = "mastered" | "active" | "locked";

interface ModuleResolution {
  module: CurriculumModule;
  state: NodeState;
  masteredLessons: number;
  totalLessons: number;
  masteredChapters: number;
  totalChapters: number;
  isFullyMastered: boolean;
}

function resolveModuleStates(
  modules: CurriculumModule[],
  lessons: Record<string, { masteryStatus?: string } | undefined>,
): ModuleResolution[] {
  const out: ModuleResolution[] = [];
  let priorAllMastered = true; // The first module is always unlocked.

  for (const m of modules) {
    const totalLessons = m.totalLessons;
    let masteredLessons = 0;
    let masteredChapters = 0;
    const totalChapters = m.chapters.length;

    for (const ch of m.chapters) {
      let chMastered = 0;
      for (const l of ch.lessons) {
        if (lessons[l.canonicalSlug]?.masteryStatus === "Mastered") {
          masteredLessons += 1;
          chMastered += 1;
        }
      }
      if (chMastered === ch.lessons.length && ch.lessons.length > 0) {
        masteredChapters += 1;
      }
    }

    const isFullyMastered = totalLessons > 0 && masteredLessons === totalLessons;

    let state: NodeState;
    if (!priorAllMastered) {
      state = "locked";
    } else if (isFullyMastered) {
      state = "mastered";
    } else {
      state = "active";
    }

    out.push({
      module: m,
      state,
      masteredLessons,
      totalLessons,
      masteredChapters,
      totalChapters,
      isFullyMastered,
    });

    if (!isFullyMastered) priorAllMastered = false;
  }
  return out;
}

/* ───────────────────── component ────────────────────────────────────────── */

interface Props {
  tier1: CurriculumTier;
  lockedTiers: CurriculumTier[];
  /** Slug of the active-module so the parent can scroll-into-view if needed. */
  onActiveModuleResolve?: (slug: string | null) => void;
  /** Pass-through render slot for the active-module inline expansion (the Sacred Path). */
  renderActiveExpansion?: (module: CurriculumModule) => React.ReactNode;
}

export function LearningYatraMap({ tier1, lockedTiers, renderActiveExpansion }: Props) {
  const lessonsStore = useProgressStore((s) => s.lessons);

  const resolutions = useMemo(
    () => resolveModuleStates(tier1.modules, lessonsStore),
    [tier1.modules, lessonsStore],
  );

  const activeModule = resolutions.find((r) => r.state === "active") ?? null;
  const overallMastered = resolutions.filter((r) => r.state === "mastered").length;
  const overallPct = tier1.modules.length > 0 ? (overallMastered / tier1.modules.length) * 100 : 0;

  return (
    <section style={{ position: "relative", padding: "48px 32px 96px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* ─── Header ─── */}
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <p
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              color: GOLD_DEEP,
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              padding: "8px 22px",
              borderRadius: "999px",
              background: "rgba(252, 230, 184, 0.55)",
              border: `1px solid ${GOLD}55`,
              boxShadow: "0 1px 0 rgba(255, 255, 255, 0.65) inset",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={11} /> The Mahā-Path
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "44px",
              fontWeight: 500,
              color: INK_PRIMARY,
              lineHeight: 1.1,
              marginBottom: "8px",
            }}
          >
            Your pilgrimage across the curriculum
          </h2>
          <p
            lang="sa"
            style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "18px", color: GOLD_DEEP, opacity: 0.75 }}
          >
            तीर्थ — यात्रा
          </p>
          <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "16px", color: INK_MUTED, marginTop: "6px", maxWidth: "560px", marginInline: "auto", lineHeight: 1.5 }}>
            Begin at the threshold. Every kṣetra unlocks only when the one before it is mastered.
            The path is sequential — there are no shortcuts on a sacred road.
          </p>

          {/* Overall Tier 1 progress */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", marginTop: "20px", padding: "8px 20px", borderRadius: "999px", background: "rgba(255, 252, 240, 0.78)", border: `1px solid ${GOLD}44` }}>
            <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.18em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
              Tier 1 · {tier1.title}
            </span>
            <div style={{ width: "180px", height: "4px", borderRadius: "999px", background: `${GOLD}22`, overflow: "hidden" }}>
              <div style={{ width: `${Math.max(3, overallPct)}%`, height: "100%", background: `linear-gradient(to right, ${GOLD_LIGHT}, ${GOLD})`, borderRadius: "999px", boxShadow: `0 0 8px ${GOLD}aa`, transition: "width 600ms cubic-bezier(0.32, 0.72, 0.24, 1)" }} />
            </div>
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "14px", color: INK_SECONDARY, whiteSpace: "nowrap" }}>
              {overallMastered} / {tier1.modules.length} kṣetras
            </span>
          </div>
        </header>

        {/* ─── Locked tiers band (silhouettes above) ─── */}
        <LockedTiersSilhouette tiers={lockedTiers} tier1Mastered={overallMastered === tier1.modules.length} />

        {/* ─── The Mahā-Path itself: 24 module stops in reverse so #1 sits at bottom ─── */}
        <div style={{ position: "relative", marginTop: "32px" }}>
          {/* central spine glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "0",
              bottom: "0",
              width: "2px",
              transform: "translateX(-50%)",
              background: `linear-gradient(to bottom, ${GOLD}22 0%, ${GOLD}44 50%, ${GOLD}22 100%)`,
              pointerEvents: "none",
            }}
          />

          {[...resolutions].reverse().map((res, revIdx) => {
            const realIdx = resolutions.length - 1 - revIdx;
            const palette = paletteFor(res.module.sequence - 1);
            const side = realIdx % 2 === 0 ? "right" : "left";
            const isActive = res.state === "active";

            return (
              <ModuleStop
                key={res.module.slug}
                resolution={res}
                palette={palette}
                side={side}
                isLast={revIdx === resolutions.length - 1}
                expansion={isActive && renderActiveExpansion ? renderActiveExpansion(res.module) : null}
              />
            );
          })}

          {/* Entrance gateway at the bottom */}
          <EntranceGateway />
        </div>

        {/* footer hint */}
        {activeModule && (
          <p style={{ textAlign: "center", fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "14px", color: INK_MUTED, marginTop: "32px" }}>
            <Sparkles size={11} style={{ display: "inline", marginRight: "4px", color: GOLD_DEEP }} />
            Currently walking Module {activeModule.module.sequence} · {activeModule.module.title}
          </p>
        )}
      </div>
    </section>
  );
}

/* ───────────────────── module stop ──────────────────────────────────────── */

function ModuleStop({
  resolution: res,
  palette,
  side,
  isLast,
  expansion,
}: {
  resolution: ModuleResolution;
  palette: { accent: string; tint: string; border: string; glow: string };
  side: "left" | "right";
  isLast: boolean;
  expansion: React.ReactNode;
}) {
  const m = res.module;
  const isLocked = res.state === "locked";
  const isMastered = res.state === "mastered";
  const isActive = res.state === "active";

  // Module hint copy — short flavor line, can be expanded from module-overview later
  const HINTS: string[] = [
    "Build your foundation",
    "Time, calendar, and the wheel of seasons",
    "The five limbs of the day",
    "Twelve signs, twelve perspectives",
    "The nine moving lights",
    "The northern way of seeing",
    "Twenty-seven lunar mansions",
    "Geometry of relationships",
    "Six-fold subdivisions",
    "Rhythms of return",
    "Speed, retrograde, motion",
    "The matrix and its weights",
    "Six-rayed inner compass",
    "When two planets share a seat",
    "Light of the lamp",
    "KP stellar precision",
    "Jaimini's chain",
    "Lal Kitab folk-remedies",
    "Persian arches of decision",
    "Palm-leaf parameter readings",
    "Numbers as living spirits",
    "Space, direction, dwelling",
    "Election and right timing",
    "Mantra without ritual",
  ];
  const hint = HINTS[m.sequence - 1] ?? "Continue the path";

  const lessonPct = res.totalLessons > 0 ? (res.masteredLessons / res.totalLessons) * 100 : 0;

  // First authored lesson of the module — entry point for the "Begin" CTA
  const firstAuthoredLesson = m.chapters.flatMap((c) => c.lessons).find((l) => l.isAuthored);

  return (
    <div style={{ position: "relative", marginBottom: isActive ? "0" : "44px" }}>
      {/* Connector path segment to next stop (rendered above this stop) */}
      {!isLast && (
        <PathSegment
          fromSide={side}
          toSide={side === "left" ? "right" : "left"}
          variant={isMastered ? "walked" : isActive ? "current" : "locked"}
          accent={palette.accent}
        />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: side === "right" ? "1fr auto 1fr" : "1fr auto 1fr",
          alignItems: "center",
          gap: "24px",
          minHeight: "120px",
          opacity: isLocked ? 0.55 : 1,
          filter: isLocked ? "grayscale(40%)" : undefined,
          transition: "opacity 400ms, filter 400ms",
        }}
      >
        {/* Left column */}
        <div style={{ textAlign: "right", paddingRight: "24px" }}>
          {side === "left" && (
            <ModuleCard
              module={m}
              palette={palette}
              resolution={res}
              hint={hint}
              firstLesson={firstAuthoredLesson}
              lessonPct={lessonPct}
              align="right"
            />
          )}
        </div>

        {/* Center medallion */}
        <ModuleMedallion
          module={m}
          palette={palette}
          state={res.state}
          masteredLessons={res.masteredLessons}
          totalLessons={res.totalLessons}
        />

        {/* Right column */}
        <div style={{ textAlign: "left", paddingLeft: "24px" }}>
          {side === "right" && (
            <ModuleCard
              module={m}
              palette={palette}
              resolution={res}
              hint={hint}
              firstLesson={firstAuthoredLesson}
              lessonPct={lessonPct}
              align="left"
            />
          )}
        </div>
      </div>

      {/* Inline expansion for the active module — the Sacred Path */}
      {isActive && expansion && (
        <div
          style={{
            position: "relative",
            marginTop: "8px",
            marginBottom: "44px",
            padding: "32px 24px",
            borderRadius: "20px",
            background: `linear-gradient(180deg, ${palette.tint} 0%, rgba(255, 252, 240, 0.65) 100%)`,
            border: `1.5px solid ${palette.border}`,
            boxShadow: `0 1px 0 rgba(255, 255, 255, 0.75) inset, 0 14px 40px ${palette.glow}`,
          }}
        >
          {/* "Now zoom-in" indicator */}
          <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: palette.accent, color: "#FFF9F0", padding: "4px 16px", borderRadius: "999px", fontSize: "10.5px", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", display: "inline-flex", alignItems: "center", gap: "5px", boxShadow: `0 4px 12px ${palette.glow}` }}>
            <ChevronDown size={11} /> Zoomed in
          </div>
          {expansion}
        </div>
      )}
    </div>
  );
}

/* ───────────────────── medallion ────────────────────────────────────────── */

function ModuleMedallion({
  module: m,
  palette,
  state,
  masteredLessons,
  totalLessons,
}: {
  module: CurriculumModule;
  palette: { accent: string; tint: string; border: string; glow: string };
  state: NodeState;
  masteredLessons: number;
  totalLessons: number;
}) {
  const pct = totalLessons > 0 ? masteredLessons / totalLessons : 0;
  const uid = m.slug;

  return (
    <div style={{ position: "relative", width: "108px", height: "108px", flexShrink: 0 }}>
      {/* Active beacon ring */}
      {state === "active" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-22px",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${palette.accent}1f 0%, ${palette.accent}00 70%)`,
            animation: "gl-yatra-beacon 2.8s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Locked mist veil */}
      {state === "locked" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 70%, transparent 100%)",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}

      <svg width="108" height="108" viewBox="0 0 120 120" style={{ display: "block", overflow: "visible" }}>
        <defs>
          <radialGradient id={`yatra-body-${uid}`} cx="35%" cy="28%" r="80%">
            <stop offset="0%" stopColor="#FFF7E2" />
            <stop offset="55%" stopColor={palette.tint} stopOpacity="0.85" />
            <stop offset="100%" stopColor={palette.accent} stopOpacity="0.30" />
          </radialGradient>
          <linearGradient id={`yatra-sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Lotus-cusped corona */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const tipX = 60 + Math.cos(angle) * 56;
          const tipY = 60 + Math.sin(angle) * 56;
          const bL = angle - 0.18;
          const bR = angle + 0.18;
          const x1 = 60 + Math.cos(bL) * 50;
          const y1 = 60 + Math.sin(bL) * 50;
          const x2 = 60 + Math.cos(bR) * 50;
          const y2 = 60 + Math.sin(bR) * 50;
          return (
            <path
              key={`rim-${i}`}
              d={`M ${x1} ${y1} Q ${tipX} ${tipY}, ${x2} ${y2} Z`}
              fill={palette.accent}
              opacity={state === "mastered" ? 0.45 : state === "active" ? 0.32 : 0.16}
            />
          );
        })}

        {/* Main medallion body */}
        <circle cx="60" cy="60" r="48" fill={`url(#yatra-body-${uid})`} stroke={palette.accent} strokeWidth={state === "active" ? 3 : 2} />
        <circle cx="60" cy="60" r="48" fill={`url(#yatra-sheen-${uid})`} opacity="0.5" />

        {/* Inner dashed ring */}
        <circle cx="60" cy="60" r="40" fill="none" stroke={palette.accent} strokeWidth="0.7" strokeDasharray="2 3" opacity="0.55" />

        {/* Progress arc */}
        {pct > 0 && (() => {
          const start = -Math.PI / 2;
          const end = start + pct * Math.PI * 2;
          const r = 45;
          const x0 = 60 + Math.cos(start) * r;
          const y0 = 60 + Math.sin(start) * r;
          const x1 = 60 + Math.cos(end) * r;
          const y1 = 60 + Math.sin(end) * r;
          const large = pct > 0.5 ? 1 : 0;
          return (
            <path
              d={`M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`}
              fill="none"
              stroke={palette.accent}
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.92"
            />
          );
        })()}

        {/* Module sequence number */}
        <text x="60" y="73" textAnchor="middle" fontSize="32" fontFamily="var(--font-cormorant), serif" fill={palette.accent} fontWeight="500" fontStyle="italic">
          {m.sequence}
        </text>
      </svg>

      {/* State badge overlay */}
      {state === "mastered" && (
        <div
          style={{
            position: "absolute",
            top: "-2px",
            right: "-2px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: palette.accent,
            border: "3px solid #FFF9F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 4px 10px ${palette.glow}`,
          }}
        >
          <Check size={14} strokeWidth={3} style={{ color: "#FFF9F0" }} />
        </div>
      )}
      {state === "locked" && (
        <div
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            background: "rgba(74, 56, 24, 0.78)",
            border: "2.5px solid #FFF9F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(74, 56, 24, 0.35)",
          }}
        >
          <Lock size={11} strokeWidth={2.5} style={{ color: "#FFF9F0" }} />
        </div>
      )}
    </div>
  );
}

/* ───────────────────── card ─────────────────────────────────────────────── */

function ModuleCard({
  module: m,
  palette,
  resolution,
  hint,
  firstLesson,
  lessonPct,
  align,
}: {
  module: CurriculumModule;
  palette: { accent: string; tint: string; border: string; glow: string };
  resolution: ModuleResolution;
  hint: string;
  firstLesson?: { href: string; title: string; sequence: number };
  lessonPct: number;
  align: "left" | "right";
}) {
  const state = resolution.state;
  const isLocked = state === "locked";
  const isActive = state === "active";

  return (
    <div
      style={{
        display: "inline-block",
        textAlign: align,
        maxWidth: "360px",
        padding: "14px 18px",
        borderRadius: "14px",
        background: isActive
          ? `linear-gradient(180deg, ${palette.tint} 0%, rgba(255, 252, 240, 0.86) 100%)`
          : state === "mastered"
            ? "linear-gradient(180deg, rgba(255, 252, 240, 0.88) 0%, rgba(255, 244, 220, 0.72) 100%)"
            : "rgba(255, 252, 240, 0.45)",
        border: `1px solid ${isLocked ? "rgba(156, 122, 47, 0.18)" : palette.border}`,
        boxShadow: isActive
          ? `0 10px 30px ${palette.glow}, 0 1px 0 rgba(255, 255, 255, 0.85) inset`
          : "0 4px 14px rgba(62, 42, 31, 0.06), 0 1px 0 rgba(255, 255, 255, 0.65) inset",
        backdropFilter: "blur(8px) saturate(140%)",
        position: "relative",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "10.5px",
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          color: isLocked ? INK_MUTED : palette.accent,
          fontWeight: 700,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          marginBottom: "4px",
        }}
      >
        {isActive && (
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: palette.accent, boxShadow: `0 0 6px ${palette.accent}`, animation: "gl-yatra-pulse 2s ease-in-out infinite" }} />
        )}
        {state === "mastered" && <Check size={11} strokeWidth={3} />}
        {state === "locked" && <Lock size={11} />}
        Module {m.sequence}
      </p>

      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: isActive ? "22px" : "19px",
          fontWeight: 500,
          color: isLocked ? INK_MUTED : INK_PRIMARY,
          lineHeight: 1.22,
          marginBottom: "4px",
        }}
      >
        {m.title}
      </h3>

      {/* Hint */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "13.5px",
          color: INK_MUTED,
          lineHeight: 1.4,
          marginBottom: "10px",
        }}
      >
        {hint}
      </p>

      {/* Chapter dots */}
      <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", marginBottom: "10px", flexDirection: align === "right" ? "row-reverse" : "row" }}>
        {m.chapters.map((ch, idx) => {
          const isComplete = idx < resolution.masteredChapters;
          return (
            <span
              key={ch.slug}
              title={`Chapter ${ch.sequence} — ${ch.title}`}
              style={{
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: isComplete ? palette.accent : "transparent",
                border: `1.5px solid ${palette.accent}${isComplete ? "" : "66"}`,
                boxShadow: isComplete ? `0 0 6px ${palette.accent}88` : undefined,
              }}
            />
          );
        })}
      </div>

      {/* Progress meter */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: align === "right" ? "row-reverse" : "row" }}>
        <div style={{ flex: 1, height: "4px", borderRadius: "2px", background: `${palette.accent}1F`, overflow: "hidden", maxWidth: "120px" }}>
          <div style={{ width: `${Math.max(2, lessonPct)}%`, height: "100%", background: `linear-gradient(to right, ${palette.accent}, ${GOLD_LIGHT})`, borderRadius: "2px", transition: "width 600ms cubic-bezier(0.32, 0.72, 0.24, 1)" }} />
        </div>
        <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "12px", color: INK_MUTED, whiteSpace: "nowrap" }}>
          {resolution.masteredLessons} / {resolution.totalLessons}
        </p>
      </div>

      {/* Primary CTA — Active modules get "Continue here" or "Begin" */}
      {isActive && firstLesson && (
        <Link
          href={firstLesson.href}
          style={{
            display: "inline-block",
            marginTop: "12px",
            padding: "8px 16px",
            background: `linear-gradient(135deg, ${palette.accent} 0%, ${palette.accent}d0 100%)`,
            color: "#FFF9F0",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            textDecoration: "none",
            borderRadius: "999px",
            boxShadow: `0 4px 12px ${palette.glow}, 0 1px 0 rgba(255, 255, 255, 0.45) inset`,
            transition: "transform 200ms cubic-bezier(0.32, 0.72, 0.24, 1), box-shadow 200ms",
          }}
          className="gl-yatra-cta"
        >
          {resolution.masteredLessons === 0 ? "Begin →" : "Continue →"}
        </Link>
      )}

      {/* Locked tooltip */}
      {isLocked && (
        <p style={{ marginTop: "6px", fontSize: "11.5px", fontStyle: "italic", color: INK_MUTED, fontFamily: "var(--font-cormorant), serif" }}>
          Complete Module {m.sequence - 1} to unlock
        </p>
      )}

      <style>{`
        .gl-yatra-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 18px ${palette.glow}, 0 1px 0 rgba(255, 255, 255, 0.6) inset !important; }
        @keyframes gl-yatra-beacon {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50%      { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes gl-yatra-pulse {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ───────────────────── path segment ─────────────────────────────────────── */

function PathSegment({
  fromSide,
  toSide,
  variant,
  accent,
}: {
  fromSide: "left" | "right";
  toSide: "left" | "right";
  variant: "walked" | "current" | "locked";
  accent: string;
}) {
  // We render an SVG that arcs from the medallion of THIS stop up to the next stop's medallion.
  // The actual position is absolute over the central spine; only its hue varies by state.
  const stroke = variant === "walked" ? accent : variant === "current" ? GOLD : "rgba(156, 122, 47, 0.35)";
  const opacity = variant === "locked" ? 0.45 : 0.85;
  const dashes = variant === "locked" ? "3 8" : variant === "current" ? "6 10" : "10 6";

  return (
    <svg
      aria-hidden
      width="60"
      height="44"
      viewBox="0 0 60 44"
      style={{
        position: "absolute",
        left: "50%",
        top: "-46px",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
      {/* Single short S-segment connecting to the next stop above */}
      <path
        d={`M 30 44 C 30 28 ${fromSide === "left" ? 10 : 50} 22 30 0`}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeDasharray={dashes}
        strokeLinecap="round"
        opacity={opacity}
      />
      {variant === "current" && (
        <path
          d={`M 30 44 C 30 28 ${fromSide === "left" ? 10 : 50} 22 30 0`}
          fill="none"
          stroke={GOLD_LIGHT}
          strokeWidth="1"
          strokeDasharray="2 12"
          strokeLinecap="round"
          style={{ animation: "gl-yatra-flow 3.5s linear infinite" }}
        />
      )}
      <style>{`
        @keyframes gl-yatra-flow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -56; }
        }
      `}</style>
    </svg>
  );
}

/* ───────────────────── entrance gateway ────────────────────────────────── */

function EntranceGateway() {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginTop: "32px", paddingTop: "32px" }}>
      <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden style={{ filter: `drop-shadow(0 6px 14px ${GOLD}55)` }}>
        {/* Stūpa-arch (toraṇa) */}
        <path d="M 8 56 L 8 26 Q 8 8 32 8 Q 56 8 56 26 L 56 56" fill="none" stroke={GOLD_DEEP} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 14 56 L 14 30 Q 14 14 32 14 Q 50 14 50 30 L 50 56" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Finial */}
        <path d="M 32 8 Q 30 2 32 -2 Q 34 2 32 8 Z" fill={GOLD_DEEP} />
        <circle cx="32" cy="-4" r="1.5" fill={GOLD_LIGHT} />
        {/* Center dot of journey */}
        <circle cx="32" cy="32" r="3" fill={GOLD} opacity="0.9" />
      </svg>
      <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.28em", color: GOLD_DEEP, fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
        The Threshold
      </p>
      <p lang="sa" style={{ fontFamily: "var(--font-devanagari), serif", fontSize: "15px", color: INK_MUTED, opacity: 0.85 }}>
        प्रवेश-द्वारम्
      </p>
    </div>
  );
}

/* ───────────────────── locked tiers band ───────────────────────────────── */

function LockedTiersSilhouette({ tiers, tier1Mastered }: { tiers: CurriculumTier[]; tier1Mastered: boolean }) {
  if (tiers.length === 0) return null;
  return (
    <div style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {tiers.map((t, i) => (
        <div
          key={t.slug}
          style={{
            position: "relative",
            padding: "18px 24px",
            borderRadius: "14px",
            background: "linear-gradient(180deg, rgba(78, 92, 122, 0.06) 0%, rgba(78, 92, 122, 0.02) 100%)",
            border: "1px dashed rgba(78, 92, 122, 0.30)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            opacity: 0.65,
          }}
        >
          {/* Mountain silhouette */}
          <svg width="140" height="44" viewBox="0 0 140 44" aria-hidden style={{ flexShrink: 0 }}>
            <path
              d={i === 0 ? "M 0 44 L 24 22 L 40 32 L 60 14 L 80 26 L 100 10 L 120 28 L 140 18 L 140 44 Z" : "M 0 44 L 30 8 L 60 24 L 90 4 L 120 20 L 140 12 L 140 44 Z"}
              fill="rgba(78, 92, 122, 0.18)"
              stroke="rgba(78, 92, 122, 0.45)"
              strokeWidth="1"
            />
          </svg>
          <div style={{ flex: 1, textAlign: "center" }}>
            <p style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.26em", color: "#4E5C7A", fontWeight: 700, fontFamily: "var(--font-sans), system-ui, sans-serif", marginBottom: "2px" }}>
              Tier {t.sequence} · {t.title}
            </p>
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "13.5px", color: "#5C6883" }}>
              {tier1Mastered && t.sequence === 2 ? "Gateway is open" : `Master Tier ${t.sequence - 1} to glimpse this path`}
            </p>
          </div>
          <Lock size={20} style={{ color: "rgba(78, 92, 122, 0.55)", flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}
