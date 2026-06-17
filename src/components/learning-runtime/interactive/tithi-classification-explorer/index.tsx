"use client";

import React, { useState, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  Layers,
  ListChecks,
  RotateCcw,
  Scale,
  Sparkles,
  Sun,
  Moon,
  Star,
  ArrowRight,
  XCircle,
  FileText,
  Inbox,
  Target,
  Eye,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  CATEGORIES,
  EVENT_TYPES,
  INTEGRATION_STEPS,
  ISSUE_OPTIONS,
  SCENARIOS,
  TITHIS,
  categoryFor,
  getCategory,
  getEventType,
  issueLabel,
  verdictColor,
  verdictLabel,
  type CategoryKey,
  type EventTypeKey,
  type IssueKey,
  type PakshaKey,
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
const PURPLE = "#6B4C9A";

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232,199,114,0.12)";
}

function catColor(key: CategoryKey): string {
  const cat = getCategory(key);
  return cat?.color ?? GOLD;
}

/* ── Tab Navigation ────────────────────────────────────── */
type TabKey = "matcher" | "wheel" | "screener" | "integration";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "matcher", label: "Matcher", icon: <Target size={15} /> },
  { key: "wheel", label: "Tithi Wheel", icon: <Sun size={15} /> },
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
              color: isActive ? TEAL : INK_SECONDARY,
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
   SVG TITHI WHEEL — Dual-ring (Śukla outer, Kṛṣṇa inner)
   ══════════════════════════════════════════════════════════ */

const WHEEL_SIZE = 420;
const WC = WHEEL_SIZE / 2; // center
const OUTER_R1 = 185; // śukla outer edge
const OUTER_R2 = 135; // śukla inner edge / kṛṣṇa outer edge
const INNER_R = 85; // kṛṣṇa inner edge
const LABEL_R_SHUKLA = (OUTER_R1 + OUTER_R2) / 2;
const LABEL_R_KRISHNA = (OUTER_R2 + INNER_R) / 2;
const WEDGE_ANGLE = 360 / 15; // 24 degrees for each of 15 tithis

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const oS = polarToXY(cx, cy, rOuter, startAngle);
  const oE = polarToXY(cx, cy, rOuter, endAngle);
  const iS = polarToXY(cx, cy, rInner, endAngle);
  const iE = polarToXY(cx, cy, rInner, startAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${oS.x} ${oS.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${oE.x} ${oE.y}`,
    `L ${iS.x} ${iS.y}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${iE.x} ${iE.y}`,
    `Z`,
  ].join(" ");
}

/** Lighten/darken a hex color for pakṣa distinction */
function adjustColor(hex: string, isKrishna: boolean): string {
  if (!isKrishna) return hex;
  // darken by mixing with black
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const f = 0.65;
  return `rgb(${Math.round(r * f)}, ${Math.round(g * f)}, ${Math.round(b * f)})`;
}

/** Special-status marker character */
function specialMarker(tithi: typeof TITHIS[number]): string | null {
  if (tithi.specialStatus === "purnima") return "☽";
  if (tithi.specialStatus === "amavasya") return "●";
  if (tithi.specialStatus === "vrata") return "◎";
  if (tithi.specialStatus === "mixed") return "◇";
  return null;
}

interface WheelSelection {
  number: number;
  paksha: PakshaKey;
}

function TithiWheel({
  selected,
  onSelect,
}: {
  selected: WheelSelection | null;
  onSelect: (s: WheelSelection) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const shuklaTithis = TITHIS.filter((t) => t.paksha === "shukla");
  const krishnaTithis = TITHIS.filter((t) => t.paksha === "krishna");

  const renderRing = (
    tithis: typeof TITHIS,
    rOuter: number,
    rInner: number,
    labelR: number,
    isKrishna: boolean,
  ) =>
    tithis.map((t, i) => {
      const startAngle = i * WEDGE_ANGLE;
      const endAngle = startAngle + WEDGE_ANGLE;
      const isActive = selected?.number === t.number && selected?.paksha === t.paksha;
      const hoverKey = `${t.paksha}-${t.number}`;
      const isHover = hovered === hoverKey;
      const baseColor = catColor(t.category);
      const fill = adjustColor(baseColor, isKrishna);
      const midAngle = startAngle + WEDGE_ANGLE / 2;
      const labelPos = polarToXY(WC, WC, labelR, midAngle);
      const marker = specialMarker(t);

      return (
        <g key={hoverKey}>
          <path
            d={arcPath(WC, WC, rOuter, rInner, startAngle, endAngle)}
            fill={fill}
            stroke={isActive ? "#FFF" : "rgba(255,255,255,0.2)"}
            strokeWidth={isActive ? 2.5 : 0.6}
            opacity={isActive ? 1 : isHover ? 0.92 : 0.8}
            style={{
              cursor: "pointer",
              transition: "opacity 0.15s, stroke-width 0.12s",
              filter: isActive ? "brightness(1.15)" : "none",
            }}
            onClick={() => onSelect({ number: t.number, paksha: t.paksha })}
            onMouseEnter={() => setHovered(hoverKey)}
            onMouseLeave={() => setHovered(null)}
          />
          {/* Number label */}
          <text
            x={labelPos.x}
            y={labelPos.y - (marker ? 4 : 0)}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FFF"
            fontSize={isKrishna ? 9 : 10.5}
            fontWeight={isActive ? 900 : 600}
            style={{ pointerEvents: "none", userSelect: "none", textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
          >
            {t.number}
          </text>
          {/* Special marker */}
          {marker && (
            <text
              x={labelPos.x}
              y={labelPos.y + (isKrishna ? 8 : 9)}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFF"
              fontSize={7}
              style={{ pointerEvents: "none", userSelect: "none", opacity: 0.8 }}
            >
              {marker}
            </text>
          )}
        </g>
      );
    });

  // Center info
  const selDef = selected ? TITHIS.find((t) => t.number === selected.number && t.paksha === selected.paksha) : null;
  const selCat = selDef ? getCategory(selDef.category) : null;

  return (
    <svg
      viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
      width="100%"
      style={{ maxWidth: WHEEL_SIZE, overflow: "visible" }}
      role="img"
      aria-label="Tithi Classification Wheel showing 30 tithis across śukla and kṛṣṇa pakṣas"
    >
      <defs>
        <radialGradient id="tw-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F0" />
          <stop offset="100%" stopColor="#F5EDD8" />
        </radialGradient>
        <filter id="tw-glow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer background */}
      <circle cx={WC} cy={WC} r={OUTER_R1 + 2} fill="none" stroke={HAIRLINE} strokeWidth={1} />

      {/* Śukla ring (outer) */}
      {renderRing(shuklaTithis, OUTER_R1, OUTER_R2, LABEL_R_SHUKLA, false)}

      {/* Ring divider */}
      <circle cx={WC} cy={WC} r={OUTER_R2} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />

      {/* Kṛṣṇa ring (inner) */}
      {renderRing(krishnaTithis, OUTER_R2, INNER_R, LABEL_R_KRISHNA, true)}

      {/* Center circle */}
      <circle cx={WC} cy={WC} r={INNER_R - 2} fill="url(#tw-center)" stroke="rgba(232,199,114,0.3)" strokeWidth={1.5} />

      {/* Ring labels */}
      <text x={WC} y={WC - OUTER_R1 - 10} textAnchor="middle" fill={GOLD} fontSize={9} fontWeight={700} letterSpacing="0.1em">
        ŚUKLA (OUTER) · KṚṢṆA (INNER)
      </text>

      {/* Center text */}
      {selDef && selCat ? (
        <>
          <text x={WC} y={WC - 22} textAnchor="middle" fill={selCat.color} fontSize={13} fontWeight={800}>
            {selCat.devanagari}
          </text>
          <text x={WC} y={WC - 6} textAnchor="middle" fill={selCat.color} fontSize={10.5} fontWeight={700}>
            {selCat.name}
          </text>
          <text x={WC} y={WC + 10} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>
            {selDef.paksha === "shukla" ? "Ś" : "K"}-{selDef.name}
          </text>
          <text x={WC} y={WC + 24} textAnchor="middle" fill={INK_SECONDARY} fontSize={8.5} fontWeight={500}>
            Tithi {selDef.number} · {selDef.paksha === "shukla" ? "Śukla" : "Kṛṣṇa"}
          </text>
          {selDef.specialStatus && (
            <text x={WC} y={WC + 37} textAnchor="middle" fill={VERMILION} fontSize={7.5} fontWeight={700}>
              {selDef.specialStatus === "purnima"
                ? "☽ PŪRṆIMĀ"
                : selDef.specialStatus === "amavasya"
                  ? "● AMĀVASYĀ"
                  : selDef.specialStatus === "vrata"
                    ? "◎ VRATA-DAY"
                    : "◇ MIXED"}
            </text>
          )}
        </>
      ) : (
        <>
          <text x={WC} y={WC - 8} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={700}>
            Click a wedge
          </text>
          <text x={WC} y={WC + 8} textAnchor="middle" fill={INK_SECONDARY} fontSize={9} fontWeight={500}>
            to explore tithis
          </text>
        </>
      )}
    </svg>
  );
}

/* ── Tithi Detail Card (for Wheel tab) ─────────────────── */
function TithiDetailCard({ tithiDef }: { tithiDef: typeof TITHIS[number] }) {
  const cat = getCategory(tithiDef.category)!;
  const specialNote = cat.specialTithiNotes.find((n) => n.tithi === tithiDef.number);

  return (
    <article
      className="min-w-0 rounded-xl p-5"
      style={{
        background: wash(cat.color, "08"),
        border: `1.5px solid ${cat.color}`,
      }}
    >
      {/* Header badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase"
          style={{ background: wash(cat.color, "20"), color: cat.color, letterSpacing: "0.06em" }}
        >
          <Circle size={10} fill={cat.color} stroke="none" />
          {cat.name}
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: wash(GOLD, "12"), color: GOLD }}
        >
          {tithiDef.paksha === "shukla" ? <Sun size={12} /> : <Moon size={12} />}
          {tithiDef.paksha === "shukla" ? "Śukla-pakṣa" : "Kṛṣṇa-pakṣa"}
        </span>
        {tithiDef.specialStatus && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase"
            style={{ background: wash(VERMILION, "14"), color: VERMILION, letterSpacing: "0.05em" }}
          >
            <Star size={10} />
            {tithiDef.specialStatus === "purnima"
              ? "Pūrṇimā"
              : tithiDef.specialStatus === "amavasya"
                ? "Amāvasyā"
                : tithiDef.specialStatus === "vrata"
                  ? "Vrata-day"
                  : "Mixed"}
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="m-0 text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}>
        <Devanagari size="md">{cat.devanagari}</Devanagari>{" "}
        <span style={{ opacity: 0.7 }}>{tithiDef.name} ({tithiDef.number})</span>
      </h3>

      {/* Character */}
      <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>
        <strong>Character:</strong> {cat.character}
      </p>
      <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
        <strong>Meaning:</strong> {cat.meaning}
      </p>

      {/* Affinities */}
      <div className="mt-3 rounded-lg p-3" style={{ background: wash(cat.color, "10"), border: `1px solid ${wash(cat.color, "20")}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: cat.color, letterSpacing: "0.06em", marginBottom: 4 }}>
          Favourable for
        </p>
        <div className="flex flex-wrap gap-1.5">
          {cat.affinities.map((a, i) => (
            <span key={i} className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ background: wash(cat.color, "14"), color: cat.color }}>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Aversions */}
      {cat.aversions.length > 0 && (
        <div className="mt-2 rounded-lg p-3" style={{ background: wash(VERMILION, "06"), border: `1px solid ${wash(VERMILION, "15")}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.06em", marginBottom: 4 }}>
            Avoid for
          </p>
          <p className="m-0 text-xs" style={{ color: VERMILION }}>{cat.aversions.join("; ")}</p>
        </div>
      )}

      {/* Pakṣa note */}
      <p className="mb-0 mt-3 text-xs italic" style={{ color: INK_SECONDARY }}>
        <strong>Pakṣa note:</strong> {cat.pakshaNote}
      </p>

      {/* Special-tithi note */}
      {specialNote && (
        <div className="mt-2 flex items-start gap-2 rounded-lg p-2.5" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "20")}` }}>
          <AlertTriangle size={14} color={GOLD} className="mt-0.5 shrink-0" />
          <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>{specialNote.note}</p>
        </div>
      )}
    </article>
  );
}

/* ── Category Legend ───────────────────────────────────── */
function CategoryLegend() {
  return (
    <div className="grid gap-1.5 sm:grid-cols-5">
      {CATEGORIES.map((c) => (
        <div
          key={c.key}
          className="flex items-center gap-2 rounded-lg p-2"
          style={{ background: wash(c.color, "10"), border: `1px solid ${wash(c.color, "18")}` }}
        >
          <div className="h-3 w-3 shrink-0 rounded-full" style={{ background: c.color }} />
          <div className="min-w-0">
            <span className="text-xs font-bold" style={{ color: c.color }}>{c.name}</span>
            <span className="ml-1 text-[10px]" style={{ color: INK_SECONDARY }}>({c.positions.join(",")})</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MATCHER TAB — Event Case-File Cards
   ══════════════════════════════════════════════════════════ */

function MatcherTab() {
  const [eventKey, setEventKey] = useState<EventTypeKey>("wedding");
  const [paksha, setPaksha] = useState<PakshaKey | "either">("either");
  const [selectedCategories, setSelectedCategories] = useState<CategoryKey[]>([]);
  const [exceptionMarked, setExceptionMarked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const event = getEventType(eventKey)!;

  const toggleCategory = (key: CategoryKey) => {
    setSelectedCategories((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const reset = () => {
    setSelectedCategories([]);
    setExceptionMarked(false);
    setShowAnswer(false);
  };

  const expectedCategories = event.categoryRank;
  const categoriesCorrect =
    selectedCategories.length === expectedCategories.length &&
    expectedCategories.every((k) => selectedCategories.includes(k));
  const exceptionCorrect = exceptionMarked === !!event.exceptionContext;
  const allCorrect = categoriesCorrect && exceptionCorrect;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      {/* Left: Event selector */}
      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-2 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <Inbox size={17} color={TEAL} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: TEAL, letterSpacing: "0.08em" }}>
            Select event type
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {EVENT_TYPES.map((e) => {
            const isActive = e.key === eventKey;
            const topCat = getCategory(e.categoryRank[0]);
            const borderColor = topCat?.color ?? TEAL;
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
                  transform: isActive ? "scale(1.01)" : "scale(1)",
                }}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: wash(borderColor, "18"), color: borderColor }}
                >
                  <FileText size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-sm font-bold" style={{ color: isActive ? borderColor : INK_PRIMARY }}>
                    {e.label}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {e.categoryRank.slice(0, 3).map((ck) => (
                      <span
                        key={ck}
                        className="rounded px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ background: wash(catColor(ck), "16"), color: catColor(ck) }}
                      >
                        {getCategory(ck)?.name}
                      </span>
                    ))}
                    {e.avoid.length > 0 && (
                      <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: wash(VERMILION, "14"), color: VERMILION }}>
                        ✗ {e.avoid.map((a) => getCategory(a)?.name).join(",")}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: isActive ? borderColor : INK_MUTED, opacity: isActive ? 1 : 0.3 }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Classification panel */}
      <div className="min-w-0">
        {/* Pakṣa toggle */}
        <div className="mb-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Pakṣa context
          </p>
          <div className="flex gap-2">
            {([
              { key: "shukla" as const, label: "Śukla-pakṣa", icon: <Sun size={14} />, desc: "Waxing · Growth" },
              { key: "krishna" as const, label: "Kṛṣṇa-pakṣa", icon: <Moon size={14} />, desc: "Waning · Completion" },
              { key: "either" as const, label: "Either", icon: <Star size={14} />, desc: "No preference" },
            ]).map((p) => {
              const isActive = paksha === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPaksha(p.key)}
                  className="flex flex-1 flex-col items-center gap-1 rounded-lg p-2.5 transition-all duration-150"
                  style={{
                    background: isActive ? wash(GOLD, "14") : SURFACE_2,
                    border: `1.5px solid ${isActive ? GOLD : HAIRLINE}`,
                    cursor: "pointer",
                    color: isActive ? GOLD : INK_SECONDARY,
                  }}
                >
                  {p.icon}
                  <span className="text-xs font-bold">{p.label}</span>
                  <span className="text-[10px]" style={{ color: INK_MUTED }}>{p.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category tiles */}
        <div className="mb-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Which tithi-categories are favourable for this event?
          </p>
          <div className="grid gap-2 sm:grid-cols-5">
            {CATEGORIES.map((c) => {
              const isSelected = selectedCategories.includes(c.key);
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => toggleCategory(c.key)}
                  className="flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-150"
                  style={{
                    background: isSelected ? wash(c.color, "18") : SURFACE_2,
                    border: `2px solid ${isSelected ? c.color : HAIRLINE}`,
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <Devanagari size="sm"><span style={{ color: isSelected ? c.color : INK_SECONDARY, fontWeight: 700 }}>{c.devanagari}</span></Devanagari>
                  <span className="text-xs font-bold" style={{ color: isSelected ? c.color : INK_PRIMARY }}>{c.name}</span>
                  <span className="text-[10px]" style={{ color: INK_MUTED }}>({c.positions.join(",")})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exception toggle */}
        <div className="mb-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Does a Riktā-exception context apply?
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
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-150"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Answer reveal */}
        {showAnswer && (
          <article
            className="rounded-xl p-5"
            style={{
              background: wash(allCorrect ? GREEN : VERMILION, "06"),
              border: `1.5px solid ${allCorrect ? GREEN : VERMILION}`,
            }}
          >
            <div className="mb-3 flex items-center gap-2">
              {allCorrect ? <CheckCircle2 size={18} color={GREEN} /> : <AlertTriangle size={18} color={VERMILION} />}
              <span className="text-sm font-bold" style={{ color: allCorrect ? GREEN : VERMILION }}>
                {allCorrect ? "All selections match!" : "Some selections differ"}
              </span>
            </div>

            <div className="mb-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg p-2.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-[10px] font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.05em" }}>Favourable</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {event.categoryRank.map((k) => (
                    <span key={k} className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: wash(catColor(k), "16"), color: catColor(k) }}>
                      {getCategory(k)?.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-lg p-2.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-[10px] font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.05em" }}>Avoided</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {event.avoid.length > 0
                    ? event.avoid.map((k) => (
                        <span key={k} className="rounded px-1.5 py-0.5 text-xs font-bold" style={{ background: wash(VERMILION, "14"), color: VERMILION }}>
                          {getCategory(k)?.name}
                        </span>
                      ))
                    : <span className="text-xs" style={{ color: INK_MUTED }}>None</span>}
                </div>
              </div>
            </div>

            {event.exceptionContext && (
              <div className="mb-3 flex items-start gap-2 rounded-lg p-2.5" style={{ background: wash(TEAL, "10"), border: `1px solid ${wash(TEAL, "20")}` }}>
                <Sparkles size={14} color={TEAL} className="mt-0.5 shrink-0" />
                <p className="m-0 text-xs" style={{ color: TEAL }}><strong>Exception:</strong> {event.exceptionContext}</p>
              </div>
            )}

            <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>{event.explanation}</p>

            {paksha !== "either" && event.pakshaPreference !== "either" && (
              <p className="mb-0 mt-2 text-xs italic" style={{ color: INK_MUTED }}>
                <strong>Pakṣa:</strong>{" "}
                {paksha === event.pakshaPreference
                  ? "Selected pakṣa aligns with the event's preferred context."
                  : "Selected pakṣa is not the preferred context; the tithi-classification still operates but pakṣa-modulation may reduce favourability."}
              </p>
            )}
          </article>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   WHEEL TAB — Full SVG Wheel + Detail Card
   ══════════════════════════════════════════════════════════ */

function WheelTab() {
  const [selected, setSelected] = useState<WheelSelection | null>(null);

  const selectedDef = selected
    ? TITHIS.find((t) => t.number === selected.number && t.paksha === selected.paksha) ?? null
    : null;

  return (
    <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* Wheel */}
      <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <Sun size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            30-Tithi Classification Wheel
          </p>
        </div>
        <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
          Outer ring = Śukla-pakṣa (waxing) · Inner ring = Kṛṣṇa-pakṣa (waning). Colours show the five-fold Nandā-Bhadrā-Jayā-Riktā-Pūrṇā classification.
        </p>
        <TithiWheel selected={selected} onSelect={setSelected} />
        <div className="mt-4">
          <CategoryLegend />
        </div>
      </div>

      {/* Detail */}
      <div className="min-w-0">
        {selectedDef ? (
          <TithiDetailCard tithiDef={selectedDef} />
        ) : (
          <div
            className="flex h-full items-center justify-center rounded-xl p-8"
            style={{ background: wash(GOLD, "06"), border: `1px dashed ${HAIRLINE}` }}
          >
            <div className="text-center">
              <Sun size={32} color={GOLD} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
              <p className="m-0 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                Click any wedge on the wheel to explore its category, character, and event affinities.
              </p>
            </div>
          </div>
        )}

        {/* Dual-pakṣa summary */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg p-3" style={{ background: wash(GOLD, "08"), border: `1px solid ${wash(GOLD, "18")}` }}>
            <div className="flex items-center gap-1.5">
              <Sun size={13} color={GOLD} />
              <span className="text-xs font-bold" style={{ color: GOLD }}>Śukla (Outer)</span>
            </div>
            <p className="m-0 mt-1 text-[11px]" style={{ color: INK_SECONDARY }}>
              Waxing fortnight · Growth & expansion energy · Brighter colours on the wheel.
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: wash(BLUE, "08"), border: `1px solid ${wash(BLUE, "18")}` }}>
            <div className="flex items-center gap-1.5">
              <Moon size={13} color={BLUE} />
              <span className="text-xs font-bold" style={{ color: BLUE }}>Kṛṣṇa (Inner)</span>
            </div>
            <p className="m-0 mt-1 text-[11px]" style={{ color: INK_SECONDARY }}>
              Waning fortnight · Completion & conclusion energy · Deeper colours on the wheel.
            </p>
          </div>
        </div>
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
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueKey | null>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<Verdict | null>(null);
  const [completedScenarios, setCompletedScenarios] = useState<Set<number>>(new Set());

  const scenario = SCENARIOS[scenarioIndex];

  const resetScenario = () => {
    setShowAnswer(false);
    setSelectedCategory(null);
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

  const categoryCorrect = selectedCategory === scenario.expectedCategory;
  const issueCorrect = selectedIssue === scenario.expectedIssue;
  const verdictCorrect = selectedVerdict === scenario.expectedVerdict;
  const allCorrect = categoryCorrect && issueCorrect && verdictCorrect;

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
            <p className="m-0 text-xs font-bold uppercase" style={{ color: TEAL, letterSpacing: "0.08em" }}>
              Case files
            </p>
          </div>
          <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: wash(GREEN, "16"), color: GREEN }}>
            {completedScenarios.size}/{SCENARIOS.length}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {SCENARIOS.map((s, i) => {
            const isActive = scenarioIndex === i;
            const isDone = completedScenarios.has(i);
            const vColor = verdictColor(s.expectedVerdict);
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
                  style={{
                    background: isDone ? wash(GREEN, "20") : wash(TEAL, "14"),
                    color: isDone ? GREEN : TEAL,
                  }}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="m-0 truncate text-xs font-bold" style={{ color: isActive ? TEAL : INK_PRIMARY }}>
                    {s.title}
                  </p>
                  <p className="m-0 text-[10px]" style={{ color: INK_MUTED }}>{s.event}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Case dossier */}
      <div className="min-w-0">
        {/* Case header */}
        <article className="mb-4 rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: wash(TEAL, "16"), color: TEAL, letterSpacing: "0.06em" }}>
              <FileText size={12} />
              Case #{scenario.id}
            </span>
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: wash(GOLD, "12"), color: GOLD }}>
              {scenario.event}
            </span>
            <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: wash(BLUE, "12"), color: BLUE }}>
              {scenario.tithiName}
            </span>
          </div>
          <h3 className="m-0 text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}>
            {scenario.title}
          </h3>
          <div className="mt-3 rounded-lg p-3" style={{ background: wash(GOLD, "06"), border: `1px solid ${wash(GOLD, "15")}` }}>
            <p className="m-0 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
              "{scenario.situation}"
            </p>
          </div>
        </article>

        {/* Diagnosis panel */}
        <div className="mb-4 grid gap-4 lg:grid-cols-3">
          {/* 1. Category */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
              1. Tithi category
            </p>
            <div className="grid grid-cols-1 gap-1.5">
              {CATEGORIES.map((c) => {
                const isSel = selectedCategory === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setSelectedCategory(c.key)}
                    className="flex items-center gap-2 rounded-lg p-2 text-left transition-all duration-150"
                    style={{
                      background: isSel ? wash(c.color, "16") : SURFACE_2,
                      border: `1.5px solid ${isSel ? c.color : HAIRLINE}`,
                      cursor: "pointer",
                    }}
                  >
                    <Circle size={10} fill={isSel ? c.color : "transparent"} stroke={c.color} strokeWidth={2} />
                    <span className="text-xs font-bold" style={{ color: isSel ? c.color : INK_PRIMARY }}>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Issue */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
              2. Issue present
            </p>
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
                    style={{
                      background: isSel ? wash(iColor, "14") : SURFACE_2,
                      border: `1.5px solid ${isSel ? iColor : HAIRLINE}`,
                      cursor: "pointer",
                    }}
                  >
                    {key === "none" ? <CheckCircle2 size={13} color={isSel ? GREEN : INK_MUTED} /> : <AlertTriangle size={13} color={isSel ? VERMILION : INK_MUTED} />}
                    <span className="text-xs font-semibold" style={{ color: isSel ? iColor : INK_PRIMARY }}>
                      {issueLabel(key)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Verdict */}
          <div className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 mb-2 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
              3. Verdict
            </p>
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
                    style={{
                      background: isSel ? wash(vColor, "14") : SURFACE_2,
                      border: `1.5px solid ${isSel ? vColor : HAIRLINE}`,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: isSel ? vColor : INK_MUTED }}>{verdictIcons[v]}</span>
                    <span className="text-xs font-semibold" style={{ color: isSel ? vColor : INK_PRIMARY }}>
                      {verdictLabel(v)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={revealAnswer}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all duration-150"
            style={{ background: TEAL, color: "#fff", border: "none", cursor: "pointer" }}
          >
            <Eye size={15} />
            Reveal diagnosis
          </button>
          <button
            type="button"
            onClick={resetScenario}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Model answer */}
        {showAnswer && (
          <article className="rounded-xl p-5" style={{ background: wash(GOLD, "06"), border: `1.5px solid ${GOLD}` }}>
            {/* Per-dimension check */}
            {selectedCategory !== null && selectedIssue !== null && selectedVerdict !== null && (
              <div className="mb-4 grid gap-2 sm:grid-cols-3">
                <DiagnosisCheck label="Category" correct={categoryCorrect} expected={getCategory(scenario.expectedCategory)?.name ?? ""} got={selectedCategory ? getCategory(selectedCategory)?.name ?? "" : "—"} />
                <DiagnosisCheck label="Issue" correct={issueCorrect} expected={issueLabel(scenario.expectedIssue)} got={selectedIssue ? issueLabel(selectedIssue) : "—"} />
                <DiagnosisCheck label="Verdict" correct={verdictCorrect} expected={verdictLabel(scenario.expectedVerdict)} got={selectedVerdict ? verdictLabel(selectedVerdict) : "—"} />
              </div>
            )}

            <div className="mb-3 flex items-center gap-2">
              <Award size={17} color={GOLD} />
              <span className="text-sm font-bold" style={{ color: GOLD }}>Model Diagnosis</span>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: wash(catColor(scenario.expectedCategory), "16"), color: catColor(scenario.expectedCategory) }}>
                {getCategory(scenario.expectedCategory)?.name}
              </span>
              <span className="rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: wash(issueDisplayColor(scenario.expectedIssue), "14"), color: issueDisplayColor(scenario.expectedIssue) }}>
                {issueLabel(scenario.expectedIssue)}
              </span>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-bold"
                style={{ background: wash(verdictColor(scenario.expectedVerdict), "16"), color: verdictColor(scenario.expectedVerdict) }}
              >
                {verdictLabel(scenario.expectedVerdict)}
              </span>
            </div>

            <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
              <strong>Why:</strong> {scenario.explanation}
            </p>
            <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
              <strong>Discipline-compliant response:</strong> {scenario.response}
            </p>
          </article>
        )}

        {/* Completion */}
        {completedScenarios.size === SCENARIOS.length && (
          <div className="mt-4 flex items-center gap-3 rounded-xl p-4" style={{ background: wash(GREEN, "10"), border: `1.5px solid ${GREEN}` }}>
            <CheckCircle2 size={22} color={GREEN} />
            <div>
              <p className="m-0 text-sm font-bold" style={{ color: GREEN }}>All {SCENARIOS.length} cases diagnosed!</p>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                You've practised the five-fold framework, Riktā-exception discipline, vrata-modulation, and single-limb-dominance avoidance.
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
        {correct ? (
          <p className="m-0 text-xs font-semibold" style={{ color: GREEN }}>✓ {expected}</p>
        ) : (
          <p className="m-0 text-xs" style={{ color: VERMILION }}>Expected: <strong>{expected}</strong></p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   INTEGRATION TAB — Visual 6-Step Pipeline
   ══════════════════════════════════════════════════════════ */

const STEP_ICONS = [
  <Target size={16} key="s1" />,
  <Layers size={16} key="s2" />,
  <Moon size={16} key="s3" />,
  <Shield size={16} key="s4" />,
  <Star size={16} key="s5" />,
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
            Integration workflow — tithi is one limb
          </p>
        </div>
        <p className="mb-4 mt-0 text-sm" style={{ color: INK_SECONDARY }}>
          Tithi-classification is one input among the five pañcāṅga-limbs. Click each step to understand the integration discipline.
        </p>

        <div className="flex flex-col gap-0">
          {INTEGRATION_STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            const stepColors = [GREEN, BLUE, PURPLE, VERMILION, GOLD, TEAL];
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
                  {/* Step number */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: isActive ? color : wash(color, "16"),
                      color: isActive ? "#fff" : color,
                    }}
                  >
                    {STEP_ICONS[idx]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="m-0 text-sm font-bold" style={{ color: isActive ? color : INK_PRIMARY }}>
                      {step.title}
                    </p>
                    {isActive && (
                      <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
                        {step.text}
                      </p>
                    )}
                  </div>

                  <ChevronRight
                    size={16}
                    className="mt-1 shrink-0 transition-transform"
                    style={{
                      color: isActive ? color : INK_MUTED,
                      transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Connector line */}
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
        {/* Five pillars visualization */}
        <div className="mb-4 rounded-xl p-5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 mb-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>
            Pañcāṅga — five limbs
          </p>
          <div className="flex items-end justify-center gap-2">
            {[
              { label: "Tithi", height: 90, color: GREEN, active: true },
              { label: "Vāra", height: 72, color: BLUE, active: false },
              { label: "Nakṣatra", height: 78, color: PURPLE, active: false },
              { label: "Yoga", height: 68, color: GOLD, active: false },
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
                <span
                  className="text-[10px] font-bold"
                  style={{ color: pillar.active ? pillar.color : INK_MUTED }}
                >
                  {pillar.label}
                </span>
              </div>
            ))}
          </div>
          <p className="m-0 mt-3 text-center text-xs italic" style={{ color: INK_SECONDARY }}>
            Tithi (highlighted) is the limb this lesson develops. All five must be integrated before a recommendation.
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
                नन्दा-भद्रा-जया-रिक्ता-पूर्णा तिथयः स्मृताः।
              </span>
            </Devanagari>
            <br />
            <Devanagari size="md">
              <span style={{ color: INK_PRIMARY, lineHeight: 1.8, fontSize: "1.05rem" }}>
                यथासङ्ख्यं प्रत्येकं षट्षट् पक्षद्वये स्थिताः॥
              </span>
            </Devanagari>
          </div>
          <div className="mb-3 rounded-lg p-2.5" style={{ background: wash(TEAL, "06"), border: `1px solid ${wash(TEAL, "15")}` }}>
            <IAST>
              <span style={{ color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.6 }}>
                nandā-bhadrā-jayā-riktā-pūrṇā tithayaḥ smṛtāḥ |<br />
                yathā-saṅkhyaṁ pratyekaṁ ṣaṭ-ṣaṭ pakṣa-dvaye sthitāḥ ||
              </span>
            </IAST>
          </div>
          <p className="mb-0 mt-2 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
            "The tithis are remembered as Nandā, Bhadrā, Jayā, Riktā, and Pūrṇā; each respectively occupying six positions across the two pakṣas (three per pakṣa)."
          </p>
          <p className="mb-0 mt-2 text-xs italic" style={{ color: INK_MUTED }}>
            Per Muhūrta-Cintāmaṇi of Rāma Daivajña, Chapter 2 (standard-edition paraphrase).
          </p>
        </article>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */

export function TithiClassificationExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("wheel");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("wheel");
  };

  return (
    <div
      data-interactive="tithi-classification-explorer"
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
            Lesson 23.2.1 — Tithi Classification
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Tithi Classification Explorer
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore the Nandā-Bhadrā-Jayā-Riktā-Pūrṇā five-fold framework on the interactive wheel, then practise event-type-specific classification and single-limb-dominance avoidance.
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
        {activeTab === "wheel" && <WheelTab />}
        {activeTab === "matcher" && <MatcherTab />}
        {activeTab === "screener" && <ScreenerTab />}
        {activeTab === "integration" && <IntegrationTab />}
      </div>
    </div>
  );
}
