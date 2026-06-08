"use client";

/**
 * Cross-Stream Strength Map — The Multi-Stream Strength Interactive
 *
 * §7 interactive for Lesson 13.6.3.
 *
 * Lays the four stream strength conceptions side by side: Parāśarī,
 * KP, Jaimini, and Tājika. Rich SVG diagrams visualise the parallel
 * tracks, convergence/divergence, and the pañcavargīya breakdown.
 */

import { useState } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import {
  STREAMS,
  PANCVARGIYA,
  SCENARIOS,
  PRESETS,
} from "./data";
import {
  Map,
  ArrowRightLeft,
  GitMerge,
  GitBranch,
  ChevronRight,
  Info,
  BookOpen,
  Layers,
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

/* ─── SVG Diagram: Parallel tracks ───────────────────────────────────────── */

function ParallelTracks({ activeKey }: { activeKey?: string }) {
  /* Vertical spacing: each track gets 44px. Label sits on the line Y;
     description sits 14px below so it never overlaps the track line. */
  const trackY = [28, 72, 116, 160];
  const chartH = 195;

  return (
    <svg viewBox={`0 0 420 ${chartH}`} className="w-full h-auto" style={{ maxHeight: 220 }}>
      <text x={210} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Four parallel strength systems — each internally complete
      </text>

      {STREAMS.map((s, i) => {
        const y = trackY[i];
        const isActive = activeKey === s.key;
        return (
          <g key={s.key}>
            {/* Stream label — left side, right-aligned, never touches the line */}
            <text
              x={100}
              y={y + 4}
              textAnchor="end"
              fontSize={10}
              fill={isActive ? s.color : INK_MUTED}
              fontWeight={isActive ? 700 : 500}
              fontFamily="var(--font-cormorant), serif"
              fontStyle="italic"
            >
              {s.name}
            </text>

            {/* Track line — starts after label column (x=108) so text never sits on it */}
            <line
              x1={108}
              y1={y}
              x2={400}
              y2={y}
              stroke={s.color}
              strokeWidth={isActive ? 3 : 2}
              opacity={isActive ? 0.7 : 0.35}
            />

            {/* Description — placed BELOW the line (y+14) so zero overlap */}
            <text
              x={108}
              y={y + 14}
              fontSize={8}
              fill={isActive ? INK_SECONDARY : INK_MUTED}
            >
              {s.strengthEnglish}
            </text>

            {/* End marker */}
            <circle cx={400} cy={y} r={isActive ? 5 : 4} fill={s.color} opacity={isActive ? 0.8 : 0.4} />
          </g>
        );
      })}

      <text x={254} y={185} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
        parallel instruments — not averaged
      </text>
    </svg>
  );
}

/* ─── SVG Diagram: Convergence vs Divergence ─────────────────────────────── */

function ConvergenceDivergence() {
  const chartW = 420;
  const chartH = 140;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 160 }}>
      <text x={chartW / 2} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Convergence raises confidence; divergence informs
      </text>

      {/* Convergence */}
      <g transform="translate(40, 32)">
        <rect x={0} y={0} width={160} height={90} rx={8} fill={`${GREEN}08`} stroke={`${GREEN}35`} strokeWidth={1.5} />
        <text x={80} y={22} textAnchor="middle" fontSize={10} fill={GREEN} fontWeight={700}>
          Convergence
        </text>
        {/* Two arrows merging */}
        <line x1={40} y1={45} x2={80} y2={65} stroke={GREEN} strokeWidth={2} opacity={0.6} />
        <line x1={120} y1={45} x2={80} y2={65} stroke={GREEN} strokeWidth={2} opacity={0.6} />
        <circle cx={80} cy={65} r={5} fill={GREEN} opacity={0.7} />
        <text x={80} y={82} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          Confidence ↑
        </text>
      </g>

      {/* Divergence */}
      <g transform="translate(220, 32)">
        <rect x={0} y={0} width={160} height={90} rx={8} fill={`${AMBER}08`} stroke={`${AMBER}35`} strokeWidth={1.5} />
        <text x={80} y={22} textAnchor="middle" fontSize={10} fill={AMBER} fontWeight={700}>
          Divergence
        </text>
        {/* Two arrows diverging */}
        <line x1={80} y1={45} x2={40} y2={65} stroke={AMBER} strokeWidth={2} opacity={0.6} />
        <line x1={80} y1={45} x2={120} y2={65} stroke={AMBER} strokeWidth={2} opacity={0.6} />
        <circle cx={80} cy={45} r={5} fill={AMBER} opacity={0.7} />
        <text x={80} y={82} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          Tension noted
        </text>
      </g>
    </svg>
  );
}

/* ─── HTML Diagram: Pañcavargīya breakdown ───────────────────────────────── */

function PancavargiyaDiagram() {
  const col = "#3A8C5A";
  return (
    <div className="space-y-3">
      <p className="text-center text-xs font-semibold" style={{ color: INK_SECONDARY }}>
        Pañcavargīya Bala — the five-fold strength (Tājika)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {PANCVARGIYA.map((p) => (
          <div
            key={p.key}
            className="rounded-lg p-2.5 text-center space-y-1"
            style={{
              background: `${col}10`,
              border: `1px solid ${col}35`,
            }}
          >
            <p
              className="text-xs font-bold leading-tight"
              style={{
                color: col,
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
              }}
            >
              {p.nameIAST}
            </p>
            <p className="text-[11px] font-medium leading-tight" style={{ color: INK_SECONDARY }}>
              {p.english}
            </p>
            <p className="text-[10px] leading-snug" style={{ color: INK_MUTED }}>
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function CrossStreamStrengthMap() {
  const [activeKey, setActiveKey] = useState<string | undefined>("parashari");

  const active = activeKey ? STREAMS.find((s) => s.key === activeKey) : null;

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setActiveKey(p.streamKey);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Map size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Cross-Stream Strength Map
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            How each stream measures strength — parallel, not averaged.
          </p>
        </div>
      </div>

      {/* ── Stream selector ──────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        {STREAMS.map((s) => {
          const active = s.key === activeKey;
          return (
            <button
              key={s.key}
              onClick={() => setActiveKey(s.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: active ? `${s.color}10` : "transparent",
                color: active ? s.color : INK_SECONDARY,
                border: `1.5px solid ${active ? `${s.color}40` : HAIRLINE}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: s.color, opacity: active ? 1 : 0.5 }} />
              <IAST size="sm">{s.name}</IAST>
            </button>
          );
        })}
      </div>

      {/* ── Active stream detail ─────────────────────────────────────────── */}
      {active && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `3px solid ${active.color}`,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full" style={{ background: active.color }} />
              <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
                <IAST size="md">{active.name}</IAST>
                <span className="ml-2" style={{ color: INK_MUTED }}>
                  <Devanagari size="sm" style={{ fontSize: "16px", opacity: 0.7 }}>
                    {active.nameDevanagari}
                  </Devanagari>
                </span>
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: `${active.color}10`,
                color: active.color,
                border: `1px solid ${active.color}35`,
              }}
            >
              {active.deepModule}
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
              Strength Conception
            </p>
            <p className="text-sm font-medium" style={{ color: INK_SECONDARY }}>
              <IAST size="sm">{active.strengthIAST}</IAST>
              <span className="mx-1.5" style={{ color: INK_MUTED }}>—</span>
              {active.strengthEnglish}
            </p>
          </div>

          <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            {active.description}
          </p>

          <div className="flex items-center gap-4 text-xs" style={{ color: INK_MUTED }}>
            <span>
              Unit: <strong style={{ color: INK_SECONDARY }}>{active.unit}</strong>
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={11} />
              Deep dive: {active.deepModuleRef}
            </span>
          </div>
        </div>
      )}

      {/* ── Parallel tracks diagram ──────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Parallel Systems
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Each stream has its own internally complete strength measure. They run in parallel — not to be averaged.
        </p>
        <ParallelTracks activeKey={activeKey} />
      </div>

      {/* ── Convergence / divergence diagram ─────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <GitMerge size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Convergence vs. Divergence
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          When systems agree, confidence rises. When they disagree, the tension itself informs the reading.
        </p>
        <ConvergenceDivergence />
      </div>

      {/* ── Scenarios ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SCENARIOS.map((sc) => (
          <div
            key={sc.label}
            className="rounded-lg p-4 space-y-2"
            style={{
              background: SURFACE,
              border: `1px solid ${HAIRLINE}`,
              borderLeft: `3px solid ${sc.resultColor}`,
            }}
          >
            <div className="flex items-center gap-2">
              {sc.icon === "converge" ? (
                <GitMerge size={16} style={{ color: sc.resultColor }} />
              ) : (
                <GitBranch size={16} style={{ color: sc.resultColor }} />
              )}
              <span className="text-sm font-semibold" style={{ color: sc.resultColor }}>
                {sc.label}
              </span>
            </div>
            <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
              {sc.description}
            </p>
            <p className="text-xs font-medium" style={{ color: sc.resultColor }}>
              {sc.result}
            </p>
          </div>
        ))}
      </div>

      {/* ── Pañcavargīya diagram ─────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Tājika's Five-Fold Strength
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Pañcavargīya bala — the five divisional dignities that Tājika sums for annual-chart strength.
        </p>
        <PancavargiyaDiagram />
      </div>

      {/* ── Honest note banner ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <Info size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Tier-1 is awareness; technique lives in deep modules
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            This lesson maps the landscape. The actual computation and interpretation techniques for KP, Jaimini, and Tājika strength are developed in each stream's own deep module. At Tier-1, know they exist and that convergence builds confidence.
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
