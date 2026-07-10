"use client";

/**
 * Ṣaḍbala–Bhāva Bala Synthesis — The Integrative Interactive
 *
 * §7 interactive for Lesson 13.6.2.
 *
 * Lets the learner pick a life-domain, set house and planet strengths,
 * and see the four-cell synthesis verdict. Rich SVG diagrams visualise
 * the 2×2 matrix, the confidence dial, and the leading-lens rule.
 */

import { useState } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas } from "@/design-tokens/grahvani-learning/colors";
import {
  DOMAINS,
  getCell,
  PRESETS,
  type StrengthLevel,
} from "./data";
import {
  GitMerge,
  Eye,
  Home,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Info,
  Crosshair,
} from "lucide-react";

/* ─── Design tokens ──────────────────────────────────────────────────────── */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";
const BLUE = "#356CAB";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: string): string {
  return grahas[slug as keyof typeof grahas]?.primary ?? INK_MUTED;
}

/* ─── SVG Diagram: Four-cell matrix ──────────────────────────────────────── */

function FourCellMatrix({
  activeHouse,
  activePlanet,
}: {
  activeHouse: StrengthLevel;
  activePlanet: StrengthLevel;
}) {
  const cellW = 140;
  const cellH = 80;
  const gap = 12;
  const leftPad = 70;
  const topPad = 40;
  const chartW = leftPad + 2 * cellW + gap + 20;
  const chartH = topPad + 2 * cellH + gap + 20;

  const cells = [
    { house: "strong" as StrengthLevel, planet: "strong" as StrengthLevel, x: 0, y: 0, label: "Reliable", col: GREEN },
    { house: "strong" as StrengthLevel, planet: "weak" as StrengthLevel, x: 1, y: 0, label: "Mixed", col: AMBER },
    { house: "weak" as StrengthLevel, planet: "strong" as StrengthLevel, x: 0, y: 1, label: "Mixed", col: AMBER },
    { house: "weak" as StrengthLevel, planet: "weak" as StrengthLevel, x: 1, y: 1, label: "Unreliable", col: VERMILION },
  ];

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 260 }}>
      {/* Y-axis label */}
      <text x={16} y={topPad + cellH + gap / 2 + 4} textAnchor="middle" fontSize={10} fill={INK_MUTED} transform={`rotate(-90, 16, ${topPad + cellH + gap / 2 + 4})`}>
        House strength →
      </text>

      {/* X-axis label */}
      <text x={leftPad + cellW + gap / 2} y={chartH - 4} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
        Planet strength →
      </text>

      {/* Axis ticks */}
      <text x={leftPad - 8} y={topPad + cellH / 2 + 4} textAnchor="end" fontSize={10} fill={INK_SECONDARY} fontWeight={600}>Strong</text>
      <text x={leftPad - 8} y={topPad + cellH + gap + cellH / 2 + 4} textAnchor="end" fontSize={10} fill={INK_SECONDARY} fontWeight={600}>Weak</text>
      <text x={leftPad + cellW / 2} y={topPad - 6} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={600}>Strong</text>
      <text x={leftPad + cellW + gap + cellW / 2} y={topPad - 6} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={600}>Weak</text>

      {cells.map((c) => {
        const x = leftPad + c.x * (cellW + gap);
        const y = topPad + c.y * (cellH + gap);
        const isActive = activeHouse === c.house && activePlanet === c.planet;
        return (
          <g key={`${c.house}-${c.planet}`}>
            <rect
              x={x}
              y={y}
              width={cellW}
              height={cellH}
              rx={8}
              fill={`${c.col}${isActive ? "18" : "08"}`}
              stroke={isActive ? c.col : HAIRLINE}
              strokeWidth={isActive ? 2.5 : 1}
            />
            <text x={x + cellW / 2} y={y + cellH / 2 + 4} textAnchor="middle" fontSize={12} fill={isActive ? c.col : INK_MUTED} fontWeight={isActive ? 700 : 500}>
              {c.label}
            </text>
            {isActive && (
              <circle cx={x + cellW - 12} cy={y + 12} r={5} fill={c.col} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Diagram: Confidence dial ───────────────────────────────────────── */

function ConfidenceDial({ percent, color }: { percent: number; color: string }) {
  const cx = 100;
  const cy = 70;
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const dash = (percent / 100) * circumference;

  return (
    <svg viewBox="0 0 200 150" className="w-full h-auto">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={7} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference - dash}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity={0.55}
      />
      <text x={cx - r - 16} y={cy + 4} textAnchor="middle" fontSize={9} fill={INK_MUTED}>Low</text>
      <text x={cx + r + 16} y={cy + 4} textAnchor="middle" fontSize={9} fill={INK_MUTED}>High</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize={22} fill={color} fontWeight={700}>
        {percent}%
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
        confidence
      </text>
    </svg>
  );
}
/* ─── Main component ─────────────────────────────────────────────────────── */

export function ShadbalaBhavabalaSynthesis() {
  const [domainKey, setDomainKey] = useState("career");
  const [houseStrong, setHouseStrong] = useState(true);
  const [planetStrong, setPlanetStrong] = useState(true);

  const domain = DOMAINS.find((d) => d.key === domainKey)!;
  const cell = getCell(houseStrong ? "strong" : "weak", planetStrong ? "strong" : "weak");

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setDomainKey(p.domainKey);
    setHouseStrong(p.houseStrong);
    setPlanetStrong(p.planetStrong);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <GitMerge size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Ṣaḍbala</IAST> + <IAST size="md">Bhāva Bala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Synthesis
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Pick a domain, set strengths, and read the four-cell verdict.
          </p>
        </div>
      </div>

      {/* ── Domain selector ──────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        {DOMAINS.map((d) => {
          const active = d.key === domainKey;
          return (
            <button
              key={d.key}
              onClick={() => setDomainKey(d.key)}
              className="px-3 py-1.5 rounded-md text-sm transition-all"
              style={{
                background: active ? `${BLUE}12` : "transparent",
                color: active ? BLUE : INK_SECONDARY,
                border: `1.5px solid ${active ? `${BLUE}45` : HAIRLINE}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              {d.label}
            </button>
          );
        })}
      </div>

      {/* ── Domain detail card ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${BLUE}` }}
      >
        <div className="flex items-center gap-2">
          <Crosshair size={16} style={{ color: BLUE }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            {domain.label}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" style={{ color: INK_SECONDARY }}>
          <div className="flex items-center gap-2">
            <Home size={14} style={{ color: INK_MUTED }} />
            <span>
              House: <strong><IAST size="sm">{domain.houseIAST}</IAST></strong> ({domain.houseNumber})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} style={{ color: INK_MUTED }} />
            <span>
              Kāraka: <strong><IAST size="sm">{domain.planetIAST}</IAST></strong>
            </span>
          </div>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          {domain.note}
        </p>
      </div>

      {/* ── Strength toggles ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* House strength */}
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
        >
          <div className="flex items-center gap-2">
            <Home size={16} style={{ color: BLUE }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              House <IAST size="sm">{domain.houseIAST}</IAST> Strength
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHouseStrong(true)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                background: houseStrong ? `${GREEN}15` : "transparent",
                color: houseStrong ? GREEN : INK_MUTED,
                border: `1.5px solid ${houseStrong ? `${GREEN}45` : HAIRLINE}`,
              }}
            >
              <CheckCircle2 size={14} className="inline mr-1.5" />
              Strong
            </button>
            <button
              onClick={() => setHouseStrong(false)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                background: !houseStrong ? `${VERMILION}15` : "transparent",
                color: !houseStrong ? VERMILION : INK_MUTED,
                border: `1.5px solid ${!houseStrong ? `${VERMILION}45` : HAIRLINE}`,
              }}
            >
              <XCircle size={14} className="inline mr-1.5" />
              Weak
            </button>
          </div>
        </div>

        {/* Planet strength */}
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
        >
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: grahaColor(domain.planetSlug) }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Planet <IAST size="sm">{domain.planetIAST}</IAST> Strength
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPlanetStrong(true)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                background: planetStrong ? `${GREEN}15` : "transparent",
                color: planetStrong ? GREEN : INK_MUTED,
                border: `1.5px solid ${planetStrong ? `${GREEN}45` : HAIRLINE}`,
              }}
            >
              <CheckCircle2 size={14} className="inline mr-1.5" />
              Strong
            </button>
            <button
              onClick={() => setPlanetStrong(false)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all"
              style={{
                background: !planetStrong ? `${VERMILION}15` : "transparent",
                color: !planetStrong ? VERMILION : INK_MUTED,
                border: `1.5px solid ${!planetStrong ? `${VERMILION}45` : HAIRLINE}`,
              }}
            >
              <XCircle size={14} className="inline mr-1.5" />
              Weak
            </button>
          </div>
        </div>
      </div>

      {/* ── Four-cell matrix ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <GitMerge size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Four-Cell Synthesis
          </span>
        </div>
        <FourCellMatrix
          activeHouse={houseStrong ? "strong" : "weak"}
          activePlanet={planetStrong ? "strong" : "weak"}
        />
      </div>

      {/* ── Verdict card ─────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderLeft: `3px solid ${cell.verdictColor}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full" style={{ background: cell.verdictColor }} />
          <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
            Verdict: <span style={{ color: cell.verdictColor }}>{cell.verdict}</span>
          </span>
        </div>

        <div className="mx-auto" style={{ maxWidth: 220 }}>
          <ConfidenceDial percent={cell.confidencePercent} color={cell.verdictColor} />
        </div>

        <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          {cell.guidance}
        </p>

        <div
          className="rounded-md p-2.5 flex items-start gap-2"
          style={{ background: `${cell.verdictColor}08`, border: `1px solid ${cell.verdictColor}30` }}
        >
          {cell.verdict === "Reliable" ? (
            <CheckCircle2 size={14} style={{ color: cell.verdictColor, marginTop: 1, flexShrink: 0 }} />
          ) : cell.verdict === "Unreliable" ? (
            <XCircle size={14} style={{ color: cell.verdictColor, marginTop: 1, flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={14} style={{ color: cell.verdictColor, marginTop: 1, flexShrink: 0 }} />
          )}
          <p className="text-xs font-medium" style={{ color: cell.verdictColor, lineHeight: 1.5 }}>
            {cell.action}
          </p>
        </div>
      </div>

      {/* ── Graded confidence reminder ───────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <Info size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Graded confidence, not binary
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            The verdict is a <strong>dial of confidence</strong>, not a yes/no. Strong-strong earns a firm reading; mixed cells call for cross-validation; weak-weak means say little or qualify heavily.
          </p>
        </div>
      </div>

      {/* ── Presets ──────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
          Try these worked examples:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => applyPreset(i)}
              className="text-left rounded-lg p-3 transition-all hover:shadow-sm"
              style={{
                background: SURFACE,
                border: `1.5px solid ${HAIRLINE}`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <ChevronRight size={14} style={{ color: GOLD_ACCENT }} />
                <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                  {p.label}
                </span>
              </div>
              <p className="text-xs mb-2" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                {p.description}
              </p>
              <p className="text-xs font-medium" style={{ color: GREEN }}>
                {p.takeaway}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
