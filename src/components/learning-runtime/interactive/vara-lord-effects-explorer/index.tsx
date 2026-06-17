"use client";

import React, { useState, useMemo } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Circle,
  Layers,
  ListChecks,
  RotateCcw,
  Scale,
  Sun,
  Moon,
  Star,
  Sparkles,
  ArrowRight,
  XCircle,
  FileText,
  Inbox,
  Target,
  Eye,
  Zap,
  Shield,
  Award,
  Swords,
} from "lucide-react";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  EVENT_TYPES,
  INTEGRATION_STEPS,
  ISSUE_OPTIONS,
  SCENARIOS,
  VARAS,
  getEventType,
  getVara,
  issueLabel,
  verdictColor,
  verdictLabel,
  type EventTypeKey,
  type IssueKey,
  type VaraKey,
  type Verdict,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "#A23A1E";
const TEAL = "#2E7D7B";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232,199,114,0.12)";
}

/* ── Tab Navigation ────────────────────────────────────── */
type TabKey = "lords" | "matcher" | "screener" | "integration";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "lords", label: "Planetary Lords", icon: <Sun size={15} /> },
  { key: "matcher", label: "Matcher", icon: <Target size={15} /> },
  { key: "screener", label: "Screener", icon: <Scale size={15} /> },
  { key: "integration", label: "Integration", icon: <Layers size={15} /> },
];

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  return (
    <div className="mb-5 flex gap-1 rounded-xl p-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? GOLD : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SVG PLANETARY WEEK RING — 7 planets in a heptagonal orbit
   ══════════════════════════════════════════════════════════ */

const RING_SIZE = 400;
const RC = RING_SIZE / 2;
const ORBIT_R = 140;
const NODE_R = 38;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

/** Planetary glyph symbols */
const PLANET_GLYPHS: Record<VaraKey, string> = {
  ravi: "☉",
  soma: "☽",
  mangala: "♂",
  budha: "☿",
  guru: "♃",
  shukra: "♀",
  shani: "♄",
};

function PlanetaryWeekRing({
  selected,
  onSelect,
}: {
  selected: VaraKey;
  onSelect: (key: VaraKey) => void;
}) {
  const [hovered, setHovered] = useState<VaraKey | null>(null);

  return (
    <svg
      viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
      width="100%"
      style={{ maxWidth: RING_SIZE, overflow: "visible" }}
      role="img"
      aria-label="Seven-day Planetary Week Ring showing the 7 vāra lords"
    >
      <defs>
        <radialGradient id="vr-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F0" />
          <stop offset="100%" stopColor="#F5EDD8" />
        </radialGradient>
        <filter id="vr-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orbit ring */}
      <circle cx={RC} cy={RC} r={ORBIT_R} fill="none" stroke={HAIRLINE} strokeWidth={1.5} strokeDasharray="4 3" />

      {/* Connecting lines between adjacent nodes */}
      {VARAS.map((v, i) => {
        const nextIdx = (i + 1) % 7;
        const angle1 = (i / 7) * 360;
        const angle2 = (nextIdx / 7) * 360;
        const p1 = polarToXY(RC, RC, ORBIT_R, angle1);
        const p2 = polarToXY(RC, RC, ORBIT_R, angle2);
        return (
          <line
            key={`line-${i}`}
            x1={p1.x}
            y1={p1.y}
            x2={p2.x}
            y2={p2.y}
            stroke="rgba(232,199,114,0.15)"
            strokeWidth={1}
          />
        );
      })}

      {/* Planet nodes */}
      {VARAS.map((v, i) => {
        const angle = (i / 7) * 360;
        const pos = polarToXY(RC, RC, ORBIT_R, angle);
        const isActive = v.key === selected;
        const isHover = v.key === hovered;
        const isAvoided = v.generalStance === "avoid";

        return (
          <g
            key={v.key}
            onClick={() => onSelect(v.key)}
            onMouseEnter={() => setHovered(v.key)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          >
            {/* Node circle */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? NODE_R + 3 : NODE_R}
              fill={isActive ? v.color : wash(v.color, "20")}
              stroke={isActive ? "#FFF" : v.color}
              strokeWidth={isActive ? 3 : 1.5}
              opacity={isActive ? 1 : isHover ? 0.9 : 0.75}
              style={{
                transition: "all 0.2s",
                filter: isActive ? "url(#vr-glow)" : "none",
              }}
            />

            {/* Planetary glyph */}
            <text
              x={pos.x}
              y={pos.y - 6}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? "#FFF" : v.color}
              fontSize={18}
              fontWeight={700}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {PLANET_GLYPHS[v.key]}
            </text>

            {/* Day abbreviation */}
            <text
              x={pos.x}
              y={pos.y + 12}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isActive ? "rgba(255,255,255,0.85)" : v.color}
              fontSize={9}
              fontWeight={700}
              style={{ pointerEvents: "none", userSelect: "none" }}
            >
              {v.english.slice(0, 3).toUpperCase()}
            </text>

            {/* Avoided marker */}
            {isAvoided && !isActive && (
              <text
                x={pos.x + NODE_R - 6}
                y={pos.y - NODE_R + 8}
                textAnchor="middle"
                dominantBaseline="central"
                fill={VERMILION}
                fontSize={12}
                fontWeight={900}
                style={{ pointerEvents: "none" }}
              >
                ⚠
              </text>
            )}
          </g>
        );
      })}

      {/* Center circle */}
      <circle cx={RC} cy={RC} r={50} fill="url(#vr-center)" stroke="rgba(232,199,114,0.25)" strokeWidth={1.5} />

      {/* Center text — selected vāra */}
      {(() => {
        const v = getVara(selected)!;
        return (
          <>
            <text x={RC} y={RC - 14} textAnchor="middle" fill={v.color} fontSize={14} fontWeight={800}>
              {v.planetDevanagari}
            </text>
            <text x={RC} y={RC + 2} textAnchor="middle" fill={v.color} fontSize={10} fontWeight={700}>
              {v.name}
            </text>
            <text x={RC} y={RC + 16} textAnchor="middle" fill={INK_SECONDARY} fontSize={8.5} fontWeight={500}>
              {v.english}
            </text>
            <text x={RC} y={RC + 28} textAnchor="middle" fill={v.generalStance === "avoid" ? VERMILION : GREEN} fontSize={7.5} fontWeight={700}>
              {v.generalStance === "avoid" ? "⚠ CLASSICALLY AVOIDED" : v.generalStance === "favourable" ? "✓ FAVOURABLE" : "◇ MIXED"}
            </text>
          </>
        );
      })()}
    </svg>
  );
}

/* ── Vāra Detail Card ──────────────────────────────────── */
function VaraDetailCard({ varaKey }: { varaKey: VaraKey }) {
  const v = getVara(varaKey)!;
  const stanceColor = v.generalStance === "avoid" ? VERMILION : v.generalStance === "favourable" ? GREEN : GOLD;

  return (
    <article
      className="min-w-0 rounded-xl p-5"
      style={{
        background: wash(v.color, "06"),
        border: `1.5px solid ${v.color}`,
      }}
    >
      {/* Badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase"
          style={{ background: wash(v.color, "20"), color: v.color, letterSpacing: "0.06em" }}
        >
          <span style={{ fontSize: 14 }}>{PLANET_GLYPHS[varaKey]}</span>
          {v.name}
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ background: wash(stanceColor, "14"), color: stanceColor }}
        >
          {v.generalStance === "avoid" ? "Classically avoided" : v.generalStance === "favourable" ? "Favourable" : "Mixed"}
        </span>
      </div>

      {/* Title */}
      <h3 className="m-0 text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}>
        <Devanagari size="md">{v.devanagari}</Devanagari>{" "}
        <span style={{ opacity: 0.7, fontSize: "0.8em" }}>{v.english}</span>
      </h3>

      {/* Planet */}
      <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
        <strong>Planetary Lord:</strong> {v.planet}{" "}
        <Devanagari size="sm"><span style={{ color: v.color }}>{v.planetDevanagari}</span></Devanagari>
      </p>

      {/* Character */}
      <div className="mt-3 rounded-lg p-3" style={{ background: wash(v.color, "10"), border: `1px solid ${wash(v.color, "20")}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: v.color, letterSpacing: "0.06em", marginBottom: 4 }}>
          Planetary character (BPHS Ch. 3)
        </p>
        <p className="m-0 text-sm" style={{ color: INK_PRIMARY }}>{v.character}</p>
      </div>

      {/* Affinities */}
      <div className="mt-3 rounded-lg p-3" style={{ background: wash(GREEN, "06"), border: `1px solid ${wash(GREEN, "15")}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.06em", marginBottom: 4 }}>
          Event-type affinities
        </p>
        <div className="flex flex-wrap gap-1.5">
          {v.affinities.map((a, i) => (
            <span key={i} className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: wash(GREEN, "12"), color: GREEN }}>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Exception context */}
      {v.exceptionContext && (
        <div className="mt-3 flex items-start gap-2 rounded-lg p-3" style={{ background: wash(TEAL, "08"), border: `1px solid ${wash(TEAL, "18")}` }}>
          <Sparkles size={14} color={TEAL} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: TEAL, letterSpacing: "0.06em", marginBottom: 2 }}>
              Exception context
            </p>
            <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>{v.exceptionContext}</p>
          </div>
        </div>
      )}
    </article>
  );
}

/* ══════════════════════════════════════════════════════════
   LORDS TAB — SVG Ring + Detail Card
   ══════════════════════════════════════════════════════════ */

function LordsTab() {
  const [selected, setSelected] = useState<VaraKey>("guru");

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Ring */}
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Sun size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Seven Planetary Weekday Lords
          </p>
        </div>
        <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
          Click any planet to explore its character, event-type affinities, and exception contexts. Nodes with ⚠ are classically avoided for most auspicious initiations.
        </p>
        <PlanetaryWeekRing selected={selected} onSelect={setSelected} />

        {/* Legend */}
        <div className="mt-4 grid gap-1.5 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: wash(GREEN, "08"), border: `1px solid ${wash(GREEN, "15")}` }}>
            <div className="h-3 w-3 rounded-full" style={{ background: GREEN }} />
            <span className="text-xs font-semibold" style={{ color: GREEN }}>Favourable for auspicious initiations</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg p-2" style={{ background: wash(VERMILION, "08"), border: `1px solid ${wash(VERMILION, "15")}` }}>
            <div className="h-3 w-3 rounded-full" style={{ background: VERMILION }} />
            <span className="text-xs font-semibold" style={{ color: VERMILION }}>Avoided (with exceptions)</span>
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="min-w-0">
        <VaraDetailCard varaKey={selected} />

        {/* Quick reference bar */}
        <div className="mt-4 grid gap-1.5" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
          {VARAS.map((v) => {
            const isActive = v.key === selected;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => setSelected(v.key)}
                className="flex flex-col items-center gap-0.5 rounded-lg p-1.5 transition-all duration-150"
                style={{
                  background: isActive ? wash(v.color, "18") : SURFACE_2,
                  border: `1.5px solid ${isActive ? v.color : HAIRLINE}`,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 14, color: isActive ? v.color : INK_MUTED }}>{PLANET_GLYPHS[v.key]}</span>
                <span className="text-[9px] font-bold" style={{ color: isActive ? v.color : INK_MUTED }}>
                  {v.english.slice(0, 3)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MATCHER TAB — Event Case-File Cards + Vāra Tiles
   ══════════════════════════════════════════════════════════ */

function MatcherTab() {
  const [eventKey, setEventKey] = useState<EventTypeKey>("wedding");
  const [selectedVaras, setSelectedVaras] = useState<VaraKey[]>([]);
  const [exceptionMarked, setExceptionMarked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const event = getEventType(eventKey)!;

  const toggleVara = (key: VaraKey) => {
    setSelectedVaras((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const reset = () => {
    setSelectedVaras([]);
    setExceptionMarked(false);
    setShowAnswer(false);
  };

  const expectedVaras = event.favourableVaras;
  const varasCorrect =
    selectedVaras.length === expectedVaras.length &&
    expectedVaras.every((k) => selectedVaras.includes(k));
  const hasException = !!event.exceptionVara;
  const exceptionCorrect = exceptionMarked === hasException;
  const allCorrect = varasCorrect && exceptionCorrect;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {/* Left: Event selector */}
      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-2 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <Inbox size={17} color={TEAL} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: TEAL, letterSpacing: "0.08em" }}>Select event type</p>
        </div>
        <div className="flex flex-col gap-2">
          {EVENT_TYPES.map((e) => {
            const isActive = e.key === eventKey;
            const topVara = getVara(e.favourableVaras[0]);
            const borderColor = topVara?.color ?? TEAL;
            return (
              <button
                key={e.key}
                type="button"
                onClick={() => { setEventKey(e.key); reset(); }}
                className="group flex min-w-0 items-center gap-3 rounded-xl p-3 text-left transition-all duration-200"
                style={{
                  background: isActive ? wash(borderColor, "10") : SURFACE,
                  border: `1.5px solid ${isActive ? borderColor : HAIRLINE}`,
                  cursor: "pointer",
                }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: wash(borderColor, "18"), color: borderColor }}>
                  <FileText size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-sm font-bold" style={{ color: isActive ? borderColor : INK_PRIMARY }}>{e.label}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {e.favourableVaras.slice(0, 3).map((vk) => {
                      const vd = getVara(vk);
                      return (
                        <span key={vk} className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: wash(vd?.color ?? GOLD, "16"), color: vd?.color ?? GOLD }}>
                          {PLANET_GLYPHS[vk]} {vd?.english?.slice(0, 3)}
                        </span>
                      );
                    })}
                    {e.avoidVaras.length > 0 && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: wash(VERMILION, "14"), color: VERMILION }}>
                        ✗ {e.avoidVaras.map((a) => getVara(a)?.english?.slice(0, 3)).join(",")}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: isActive ? borderColor : INK_MUTED, opacity: isActive ? 1 : 0.3 }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Classification panel */}
      <div className="min-w-0">
        {/* Vāra tiles */}
        <div className="mb-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Which vāras are favourable for this event?
          </p>
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))" }}>
            {VARAS.map((v) => {
              const isSelected = selectedVaras.includes(v.key);
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => toggleVara(v.key)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-150"
                  style={{
                    background: isSelected ? wash(v.color, "18") : SURFACE_2,
                    border: `2px solid ${isSelected ? v.color : HAIRLINE}`,
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span style={{ fontSize: 20, color: isSelected ? v.color : INK_MUTED }}>{PLANET_GLYPHS[v.key]}</span>
                  <Devanagari size="sm"><span style={{ color: isSelected ? v.color : INK_SECONDARY, fontWeight: 700, fontSize: "0.8rem" }}>{v.planetDevanagari}</span></Devanagari>
                  <span className="text-xs font-bold" style={{ color: isSelected ? v.color : INK_PRIMARY }}>{v.english.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exception toggle */}
        <div className="mb-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Does a Tuesday/Saturday exception apply?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setExceptionMarked(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2.5 text-sm font-semibold transition-all duration-150"
              style={{
                background: exceptionMarked ? wash(TEAL, "16") : SURFACE_2,
                border: `1.5px solid ${exceptionMarked ? TEAL : HAIRLINE}`,
                color: exceptionMarked ? TEAL : INK_SECONDARY,
                cursor: "pointer",
              }}
            >
              <CheckCircle2 size={15} />
              Yes — exception
            </button>
            <button
              type="button"
              onClick={() => setExceptionMarked(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg p-2.5 text-sm font-semibold transition-all duration-150"
              style={{
                background: !exceptionMarked ? wash(GOLD, "12") : SURFACE_2,
                border: `1.5px solid ${!exceptionMarked ? GOLD : HAIRLINE}`,
                color: !exceptionMarked ? GOLD : INK_SECONDARY,
                cursor: "pointer",
              }}
            >
              <Shield size={15} />
              No — general rule
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setShowAnswer(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-150"
            style={{ background: TEAL, color: "#fff", border: "none", cursor: "pointer" }}
          >
            <Eye size={15} />
            Reveal model answer
          </button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}>
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Answer reveal */}
        {showAnswer && (
          <article className="rounded-xl p-5" style={{ background: wash(allCorrect ? GREEN : VERMILION, "06"), border: `1.5px solid ${allCorrect ? GREEN : VERMILION}` }}>
            <div className="mb-3 flex items-center gap-2">
              {allCorrect ? <CheckCircle2 size={18} color={GREEN} /> : <AlertTriangle size={18} color={VERMILION} />}
              <span className="text-sm font-bold" style={{ color: allCorrect ? GREEN : VERMILION }}>
                {allCorrect ? "All selections match!" : "Some selections differ"}
              </span>
            </div>

            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg p-2.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-[10px] font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.05em" }}>Favourable</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {event.favourableVaras.map((k) => {
                    const vd = getVara(k);
                    return (
                      <span key={k} className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: wash(vd?.color ?? GOLD, "16"), color: vd?.color ?? GOLD }}>
                        {PLANET_GLYPHS[k]} {vd?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-lg p-2.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-[10px] font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.05em" }}>Avoided</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {event.avoidVaras.length > 0
                    ? event.avoidVaras.map((k) => {
                        const vd = getVara(k);
                        return (
                          <span key={k} className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: wash(VERMILION, "14"), color: VERMILION }}>
                            {PLANET_GLYPHS[k]} {vd?.name}
                          </span>
                        );
                      })
                    : <span className="text-xs" style={{ color: INK_MUTED }}>None</span>}
                </div>
              </div>
            </div>

            {event.exceptionVara && (
              <div className="mb-3 flex items-start gap-2 rounded-lg p-2.5" style={{ background: wash(TEAL, "10"), border: `1px solid ${wash(TEAL, "20")}` }}>
                <Sparkles size={14} color={TEAL} className="mt-0.5 shrink-0" />
                <p className="m-0 text-xs" style={{ color: TEAL }}>
                  <strong>Exception:</strong> {getVara(event.exceptionVara)?.name} is the exception-context vāra for this event type.
                </p>
              </div>
            )}

            <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{event.explanation}</p>
          </article>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   SCREENER TAB — Diagnostic Case-File Dossiers
   ══════════════════════════════════════════════════════════ */

function ScreenerTab() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<IssueKey | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(new Set());

  const scenario = SCENARIOS[scenarioIndex];

  const resetScenario = () => {
    setShowAnswer(false);
    setSelectedIssue(null);
    setSelectedVerdict(null);
  };

  const goToScenario = (idx: number) => {
    setScenarioIndex(idx);
    resetScenario();
  };

  const revealAnswer = () => {
    setShowAnswer(true);
    setCompletedScenarios((prev) => new Set(prev).add(scenarioIndex));
  };

  const issueCorrect = selectedIssue === scenario.expectedIssue;
  const verdictCorrect = selectedVerdict === scenario.expectedVerdict;
  const allCorrect = issueCorrect && verdictCorrect;

  const issueDisplayColor = (key: IssueKey) => (key === "none" ? GREEN : VERMILION);

  const verdictIcons: Record<Verdict, React.ReactNode> = {
    favourable: <CheckCircle2 size={14} />,
    avoid: <XCircle size={14} />,
    "exception-applies": <Sparkles size={14} />,
    "needs-context": <AlertTriangle size={14} />,
  };

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)]">
      {/* Scenario selector */}
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Scale size={16} color={TEAL} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: TEAL, letterSpacing: "0.08em" }}>Case files</p>
          </div>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: wash(GREEN, "16"), color: GREEN }}>
            {completedScenarios.size}/{SCENARIOS.length}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {SCENARIOS.map((s, i) => {
            const isActive = scenarioIndex === i;
            const isDone = completedScenarios.has(i);
            const varaData = getVara(s.vara);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToScenario(i)}
                className="flex min-w-0 items-center gap-3 rounded-xl p-3 text-left transition-all duration-200"
                style={{
                  background: isActive ? wash(TEAL, "10") : SURFACE,
                  border: `1.5px solid ${isActive ? TEAL : HAIRLINE}`,
                  cursor: "pointer",
                }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: isDone ? wash(GREEN, "20") : wash(varaData?.color ?? TEAL, "14"), color: isDone ? GREEN : varaData?.color ?? TEAL }}
                >
                  {isDone ? "✓" : PLANET_GLYPHS[s.vara]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-xs font-bold" style={{ color: isActive ? TEAL : INK_PRIMARY }}>{s.title}</p>
                  <p className="m-0 text-[10px]" style={{ color: INK_MUTED }}>{s.event}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case dossier */}
      <div className="min-w-0">
        <article className="mb-4 rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: wash(TEAL, "16"), color: TEAL, letterSpacing: "0.06em" }}>
              <FileText size={12} />
              Case #{scenario.id}
            </span>
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: wash(GOLD, "12"), color: GOLD }}>{scenario.event}</span>
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: wash(getVara(scenario.vara)?.color ?? BLUE, "14"), color: getVara(scenario.vara)?.color ?? BLUE }}>
              {PLANET_GLYPHS[scenario.vara]} {getVara(scenario.vara)?.name}
            </span>
          </div>
          <h3 className="m-0 text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}>{scenario.title}</h3>
          <div className="mt-3 rounded-lg p-3" style={{ background: wash(GOLD, "06"), border: `1px solid ${wash(GOLD, "15")}` }}>
            <p className="m-0 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>"{scenario.situation}"</p>
          </div>
        </article>

        {/* Diagnosis panel */}
        <div className="mb-4 grid gap-4 lg:grid-cols-2">
          {/* Issue */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>1. Issue present</p>
            <div className="grid grid-cols-1 gap-1.5">
              {ISSUE_OPTIONS.map((key) => {
                const isSel = selectedIssue === key;
                const iColor = issueDisplayColor(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedIssue(key)}
                    className="flex items-center gap-2 rounded-lg p-2 text-left transition-all duration-150"
                    style={{ background: isSel ? wash(iColor, "14") : SURFACE_2, border: `1.5px solid ${isSel ? iColor : HAIRLINE}`, cursor: "pointer" }}
                  >
                    {key === "none" ? <CheckCircle2 size={13} color={isSel ? GREEN : INK_MUTED} /> : <AlertTriangle size={13} color={isSel ? VERMILION : INK_MUTED} />}
                    <span className="text-xs font-semibold" style={{ color: isSel ? iColor : INK_PRIMARY }}>{issueLabel(key)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Verdict */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>2. Verdict</p>
            <div className="grid grid-cols-1 gap-1.5">
              {(["favourable", "avoid", "exception-applies", "needs-context"] as Verdict[]).map((v) => {
                const isSel = selectedVerdict === v;
                const vColor = verdictColor(v);
                return (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setSelectedVerdict(v)}
                    className="flex items-center gap-2 rounded-lg p-2 text-left transition-all duration-150"
                    style={{ background: isSel ? wash(vColor, "14") : SURFACE_2, border: `1.5px solid ${isSel ? vColor : HAIRLINE}`, cursor: "pointer" }}
                  >
                    <span style={{ color: isSel ? vColor : INK_MUTED }}>{verdictIcons[v]}</span>
                    <span className="text-xs font-semibold" style={{ color: isSel ? vColor : INK_PRIMARY }}>{verdictLabel(v)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-4 flex gap-2">
          <button type="button" onClick={revealAnswer} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold" style={{ background: TEAL, color: "#fff", border: "none", cursor: "pointer" }}>
            <Eye size={15} />
            Reveal diagnosis
          </button>
          <button type="button" onClick={resetScenario} className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}>
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Model answer */}
        {showAnswer && (
          <article className="rounded-xl p-5" style={{ background: wash(GOLD, "06"), border: `1.5px solid ${GOLD}` }}>
            {selectedIssue !== null && selectedVerdict !== null && (
              <div className="mb-4 grid gap-2 sm:grid-cols-2">
                <DiagnosisCheck label="Issue" correct={issueCorrect} expected={issueLabel(scenario.expectedIssue)} got={selectedIssue ? issueLabel(selectedIssue) : "—"} />
                <DiagnosisCheck label="Verdict" correct={verdictCorrect} expected={verdictLabel(scenario.expectedVerdict)} got={selectedVerdict ? verdictLabel(selectedVerdict) : "—"} />
              </div>
            )}
            <div className="mb-3 flex items-center gap-2">
              <Award size={17} color={GOLD} />
              <span className="text-sm font-bold" style={{ color: GOLD }}>Model Diagnosis</span>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: wash(issueDisplayColor(scenario.expectedIssue), "14"), color: issueDisplayColor(scenario.expectedIssue) }}>
                {issueLabel(scenario.expectedIssue)}
              </span>
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: wash(verdictColor(scenario.expectedVerdict), "16"), color: verdictColor(scenario.expectedVerdict) }}>
                {verdictLabel(scenario.expectedVerdict)}
              </span>
            </div>
            <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}><strong>Why:</strong> {scenario.explanation}</p>
            <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}><strong>Discipline-compliant response:</strong> {scenario.response}</p>
          </article>
        )}

        {completedScenarios.size === SCENARIOS.length && (
          <div className="mt-4 flex items-center gap-3 rounded-xl p-4" style={{ background: wash(GREEN, "10"), border: `1.5px solid ${GREEN}` }}>
            <CheckCircle2 size={22} color={GREEN} />
            <div>
              <p className="m-0 text-sm font-bold" style={{ color: GREEN }}>All {SCENARIOS.length} cases diagnosed!</p>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                You've practised the planetary-character framework, Tuesday/Saturday exception disciplines, and single-limb-dominance avoidance.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DiagnosisCheck({ label, correct, expected, got }: { label: string; correct: boolean; expected: string; got: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg p-2.5" style={{ background: wash(correct ? GREEN : VERMILION, "08"), border: `1px solid ${wash(correct ? GREEN : VERMILION, "18")}` }}>
      {correct ? <CheckCircle2 size={14} color={GREEN} /> : <XCircle size={14} color={VERMILION} />}
      <div className="min-w-0">
        <p className="m-0 text-[10px] font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.05em" }}>{label}</p>
        {correct
          ? <p className="m-0 text-xs font-semibold" style={{ color: GREEN }}>✓ {expected}</p>
          : <p className="m-0 text-xs" style={{ color: VERMILION }}>Expected: <strong>{expected}</strong></p>}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTEGRATION TAB — Visual 6-Step Pipeline
   ══════════════════════════════════════════════════════════ */

const STEP_ICONS = [
  <Target size={16} key="s1" />,
  <Sun size={16} key="s2" />,
  <Shield size={16} key="s3" />,
  <Star size={16} key="s4" />,
  <Layers size={16} key="s5" />,
  <Zap size={16} key="s6" />,
];

function IntegrationTab() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      {/* Pipeline */}
      <div className="min-w-0">
        <div className="mb-4 flex items-center gap-2 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <Layers size={17} color={TEAL} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: TEAL, letterSpacing: "0.08em" }}>
            Integration workflow — vāra is one limb
          </p>
        </div>
        <p className="mb-4 mt-0 text-sm" style={{ color: INK_SECONDARY }}>
          Vāra-lord-effects are grounded in the planetary-character framework, but vāra is still only one of five pañcāṅga-limbs. Click each step to explore.
        </p>

        <div className="flex flex-col gap-0">
          {INTEGRATION_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            const stepColors = [GREEN, GOLD, VERMILION, TEAL, BLUE, "#6B4C9A"];
            const color = stepColors[idx % stepColors.length];
            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => setActiveStep(isActive ? null : idx)}
                  className="flex w-full min-w-0 items-start gap-3 rounded-xl p-4 text-left transition-all duration-200"
                  style={{
                    background: isActive ? wash(color, "10") : SURFACE,
                    border: `1.5px solid ${isActive ? color : HAIRLINE}`,
                    cursor: "pointer",
                    marginBottom: idx < INTEGRATION_STEPS.length - 1 ? -1 : 0,
                  }}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: isActive ? color : wash(color, "16"), color: isActive ? "#fff" : color }}>
                    {STEP_ICONS[idx]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-sm font-bold" style={{ color: isActive ? color : INK_PRIMARY }}>{step.title}</p>
                    {isActive && <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{step.text}</p>}
                  </div>
                  <ChevronRight size={16} className="mt-1 shrink-0 transition-transform" style={{ color: isActive ? color : INK_MUTED, transform: isActive ? "rotate(90deg)" : "rotate(0deg)" }} />
                </button>
                {idx < INTEGRATION_STEPS.length - 1 && (
                  <div className="ml-[26px] h-4 w-0.5" style={{ background: wash(color, "30") }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Śloka + Five Pillars */}
      <div className="min-w-0">
        {/* Five pillars */}
        <div className="mb-4 rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Pañcāṅga — five limbs
          </p>
          <div className="flex items-end justify-center gap-2">
            {[
              { label: "Tithi", height: 72, color: GREEN, active: false },
              { label: "Vāra", height: 90, color: GOLD, active: true },
              { label: "Nakṣatra", height: 78, color: "#6B4C9A", active: false },
              { label: "Yoga", height: 68, color: BLUE, active: false },
              { label: "Karaṇa", height: 64, color: TEAL, active: false },
            ].map((pillar, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-12 rounded-t-lg transition-all duration-300"
                  style={{
                    height: pillar.height,
                    background: pillar.active
                      ? `linear-gradient(to top, ${pillar.color}, ${wash(pillar.color, "80")})`
                      : wash(pillar.color, "20"),
                    border: `1.5px solid ${pillar.active ? pillar.color : wash(pillar.color, "30")}`,
                    borderBottom: "none",
                  }}
                />
                <span className="text-[10px] font-bold" style={{ color: pillar.active ? pillar.color : INK_MUTED }}>{pillar.label}</span>
              </div>
            ))}
          </div>
          <p className="m-0 mt-3 text-center text-xs italic" style={{ color: INK_SECONDARY }}>
            Vāra (highlighted) is the limb this lesson develops. All five must be integrated before a recommendation.
          </p>
        </div>

        {/* Śloka card */}
        <article className="rounded-xl p-5" style={{ background: wash(GOLD, "06"), border: `1.5px solid ${GOLD}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={17} color={GOLD} />
            <span className="text-sm font-bold" style={{ color: GOLD }}>Foundational Śloka — MC 2.x</span>
          </div>
          <div className="mb-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Devanagari size="md">
              <span style={{ color: INK_PRIMARY, lineHeight: 1.8, fontSize: "1.05rem" }}>
                रवि-सोम-कुज-बुध-गुरु-शुक्र-शनैश्चराः।
              </span>
            </Devanagari>
            <br />
            <Devanagari size="md">
              <span style={{ color: INK_PRIMARY, lineHeight: 1.8, fontSize: "1.05rem" }}>
                वाराः सप्तैव निर्दिष्टाः स्व-स्वामि-गुण-योगतः॥
              </span>
            </Devanagari>
          </div>
          <div className="mb-3 rounded-lg p-2.5" style={{ background: wash(TEAL, "06"), border: `1px solid ${wash(TEAL, "15")}` }}>
            <IAST>
              <span style={{ color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.6 }}>
                ravi-soma-kuja-budha-guru-śukra-śanaiścarāḥ |<br />
                vārāḥ saptaiva nirdiṣṭāḥ sva-svāmi-guṇa-yogataḥ ||
              </span>
            </IAST>
          </div>
          <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
            "Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn — these seven are designated as vāras, by virtue of the qualities of their respective planetary-lords."
          </p>
          <p className="mb-0 mt-2 text-xs italic" style={{ color: INK_MUTED }}>
            Per Muhūrta-Cintāmaṇi of Rāma Daivajña, Chapter 2 (standard-edition paraphrase). The <em>sva-svāmi-guṇa-yogataḥ</em> construction grounds each vāra-effect in planetary-character.
          </p>
        </article>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */

export function VaraLordEffectsExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("lords");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("lords");
  };

  return (
    <div
      data-interactive="vara-lord-effects-explorer"
      className="w-full min-w-0"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Lesson 23.2.2 — Vāra (Weekday) Lord Effects
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Vāra Lord Effects Explorer
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore the seven planetary weekday-lords on the interactive ring, then practise event-type-specific vāra selection and planetary-character-grounded articulation.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Tabs */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      <div key={resetKey}>
        {activeTab === "lords" && <LordsTab />}
        {activeTab === "matcher" && <MatcherTab />}
        {activeTab === "screener" && <ScreenerTab />}
        {activeTab === "integration" && <IntegrationTab />}
      </div>
    </div>
  );
}
