"use client";

/**
 * Naisargika Rationale — The Fixed-Values Rationale Interactive
 *
 * §7 interactive for Lesson 13.4.3.
 *
 * Explains WHY the naisargika order runs Sun → Saturn: the graha hierarchy
 * (soul → restriction), the luminosity correlate, and the Venus>Jupiter
 * puzzle. Purely conceptual — no repeated value tables from 13.4.2.
 */

import { useState } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  GRAHA_RATIONALE,
  PRESETS,
  VARIABLE_BALAS,
} from "./data";
import {
  ArrowDownWideNarrow,
  Sun,
  Scale,
  ChevronRight,
  Lightbulb,
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
const BLUE = "#356CAB";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: GrahaSlug): string {
  return grahas[slug].primary;
}

/* ─── SVG Diagram: Hierarchy Flow (soul → restriction) ───────────────────── */

function HierarchyFlow() {
  const nodeR = 26;
  const gapY = 56;
  const cx = 120;
  const startY = 40;
  const rightX = 260;
  const chartH = GRAHA_RATIONALE.length * gapY + 30;

  return (
    <svg viewBox={`0 0 420 ${chartH}`} className="w-full h-auto" style={{ maxHeight: 440 }}>
      {/* Connecting spine */}
      <line
        x1={cx}
        y1={startY}
        x2={cx}
        y2={startY + (GRAHA_RATIONALE.length - 1) * gapY}
        stroke={HAIRLINE}
        strokeWidth={2}
        strokeDasharray="4 4"
      />

      {GRAHA_RATIONALE.map((g, i) => {
        const y = startY + i * gapY;
        const col = grahaColor(g.grahaSlug);

        return (
          <g key={g.grahaSlug}>
            {/* Rank */}
            <text x={cx - nodeR - 14} y={y + 4} textAnchor="end" fontSize={11} fill={INK_MUTED} fontWeight={600}>
              #{i + 1}
            </text>

            {/* Node circle */}
            <circle cx={cx} cy={y} r={nodeR} fill={`${col}12`} stroke={`${col}45`} strokeWidth={1.5} />
            <text x={cx} y={y - 2} textAnchor="middle" fontSize={9} fill={col} fontWeight={700}>
              <IAST size="sm">{g.nameIAST}</IAST>
            </text>
            <text x={cx} y={y + 10} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
              {g.naisargikaFormatted}
            </text>

            {/* Significance label */}
            <text x={rightX} y={y - 4} textAnchor="start" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
              {g.significanceEnglish}
            </text>
            <text x={rightX} y={y + 10} textAnchor="start" fontSize={10} fill={INK_MUTED}>
              <IAST size="sm">{g.significanceIAST}</IAST>
              <tspan dx={6} fill={INK_MUTED} opacity={0.7}>
                <Devanagari size="sm" style={{ fontSize: "11px" }}>{g.significanceDevanagari}</Devanagari>
              </tspan>
            </text>
          </g>
        );
      })}

      {/* Top label */}
      <text x={cx} y={18} textAnchor="middle" fontSize={10} fill={GOLD_ACCENT} fontWeight={700}>
        ĀTMĀ ↑
      </text>
      {/* Bottom label */}
      <text x={cx} y={chartH - 8} textAnchor="middle" fontSize={10} fill={INK_MUTED} fontWeight={600}>
        RESTRAINT ↓
      </text>
    </svg>
  );
}

/* ─── SVG Diagram: Luminosity match ──────────────────────────────────────── */

function LuminosityMatch() {
  const rowH = 38;
  const gap = 6;
  const leftPad = 90;
  const dotR = 5;
  const chartW = 420;
  const chartH = GRAHA_RATIONALE.length * (rowH + gap) + 40;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 340 }}>
      {/* Title */}
      <text x={chartW / 2} y={18} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        The same order tracks apparent brightness
      </text>

      {GRAHA_RATIONALE.map((g, i) => {
        const y = 32 + i * (rowH + gap);
        const col = grahaColor(g.grahaSlug);
        const brightnessStars = 8 - g.luminosityRank; // 6 down to 0

        return (
          <g key={g.grahaSlug}>
            {/* Planet label */}
            <text x={leftPad - 10} y={y + rowH / 2 + 4} textAnchor="end" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
              <IAST size="sm">{g.nameIAST}</IAST>
            </text>

            {/* Brightness dots (stars) */}
            {Array.from({ length: 7 }).map((_, j) => {
              const filled = j <= brightnessStars;
              const bx = leftPad + j * 22;
              return (
                <circle
                  key={j}
                  cx={bx}
                  cy={y + rowH / 2}
                  r={dotR}
                  fill={filled ? GOLD_ACCENT : SURFACE}
                  opacity={filled ? 0.7 : 0.3}
                  stroke={filled ? `${GOLD_ACCENT}60` : HAIRLINE}
                  strokeWidth={1}
                />
              );
            })}

            {/* Brightness note */}
            <text x={leftPad + 7 * 22 + 10} y={y + rowH / 2 + 4} fontSize={9} fill={INK_MUTED}>
              {g.luminosityNote.length > 30 ? g.luminosityNote.slice(0, 30) + "…" : g.luminosityNote}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <text x={leftPad} y={chartH - 8} fontSize={9} fill={INK_MUTED}>
        ● = brightness rank (more dots = brighter)
      </text>
    </svg>
  );
}

/* ─── SVG Diagram: Venus vs Jupiter ──────────────────────────────────────── */

function VenusJupiterCompare() {
  const venus = GRAHA_RATIONALE.find((g) => g.grahaSlug === "shukra")!;
  const jupiter = GRAHA_RATIONALE.find((g) => g.grahaSlug === "guru")!;
  const vCol = grahaColor("shukra");
  const jCol = grahaColor("guru");

  return (
    <svg viewBox="0 0 420 170" className="w-full h-auto" style={{ maxHeight: 190 }}>
      {/* Title */}
      <text x={210} y={18} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Why Venus (42.86) outranks Jupiter (34.29)
      </text>

      {/* Venus column */}
      <g transform="translate(55, 32)">
        <circle cx={55} cy={28} r={28} fill={`${vCol}12`} stroke={`${vCol}45`} strokeWidth={1.5} />
        <text x={55} y={24} textAnchor="middle" fontSize={10} fill={vCol} fontWeight={700}>
          <IAST size="sm">{venus.nameIAST}</IAST>
        </text>
        <text x={55} y={38} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          <Devanagari size="sm" style={{ fontSize: "12px" }}>{venus.nameDevanagari}</Devanagari>
        </text>

        {/* Value */}
        <text x={55} y={72} textAnchor="middle" fontSize={13} fill={vCol} fontWeight={700}>
          {venus.naisargikaFormatted}
        </text>

        {/* Significance */}
        <text x={55} y={92} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          {venus.significanceEnglish}
        </text>

        {/* Brightness callout */}
        <rect x={5} y={102} width={100} height={22} rx={5} fill={`${GOLD_ACCENT}12`} stroke={`${GOLD_ACCENT}35`} strokeWidth={1} />
        <text x={55} y={117} textAnchor="middle" fontSize={9} fill={GOLD_ACCENT} fontWeight={600}>
          Brightest planet
        </text>
      </g>

      {/* VS / greater-than */}
      <text x={210} y={95} textAnchor="middle" fontSize={18} fill={INK_MUTED} fontWeight={700}>
        &gt;
      </text>
      <text x={210} y={115} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
        not rank
      </text>

      {/* Jupiter column */}
      <g transform="translate(255, 32)">
        <circle cx={55} cy={28} r={28} fill={`${jCol}12`} stroke={`${jCol}45`} strokeWidth={1.5} />
        <text x={55} y={24} textAnchor="middle" fontSize={10} fill={jCol} fontWeight={700}>
          <IAST size="sm">{jupiter.nameIAST}</IAST>
        </text>
        <text x={55} y={38} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          <Devanagari size="sm" style={{ fontSize: "12px" }}>{jupiter.nameDevanagari}</Devanagari>
        </text>

        {/* Value */}
        <text x={55} y={72} textAnchor="middle" fontSize={13} fill={jCol} fontWeight={700}>
          {jupiter.naisargikaFormatted}
        </text>

        {/* Significance */}
        <text x={55} y={92} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          {jupiter.significanceEnglish}
        </text>

        {/* Brightness callout */}
        <rect x={5} y={102} width={100} height={22} rx={5} fill={`${INK_MUTED}10`} stroke={`${INK_MUTED}25`} strokeWidth={1} />
        <text x={55} y={117} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          Less bright
        </text>
      </g>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function NaisargikaRationale() {
  const [highlightedSlug, setHighlightedSlug] = useState<GrahaSlug | undefined>("surya");
  const [compareSlug, setCompareSlug] = useState<GrahaSlug | undefined>("shani");

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setHighlightedSlug(p.grahaSlug);
    setCompareSlug(p.compareSlug);
  }

  const selected = highlightedSlug
    ? GRAHA_RATIONALE.find((g) => g.grahaSlug === highlightedSlug)
    : null;

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Lightbulb size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Naisargika Bala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Rationale
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Why the order is not arbitrary: hierarchy, luminosity, and the baseline concept.
          </p>
        </div>
      </div>

      {/* ── Planet selector ──────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        {GRAHA_RATIONALE.map((g) => {
          const active = g.grahaSlug === highlightedSlug;
          const col = grahaColor(g.grahaSlug);
          return (
            <button
              key={g.grahaSlug}
              onClick={() => setHighlightedSlug(g.grahaSlug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: active ? `${col}10` : "transparent",
                color: active ? col : INK_SECONDARY,
                border: `1.5px solid ${active ? `${col}40` : HAIRLINE}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: col, opacity: active ? 1 : 0.5 }} />
              <IAST size="sm">{g.nameIAST}</IAST>
            </button>
          );
        })}
      </div>

      {/* ── Selected planet detail card ──────────────────────────────────── */}
      {selected && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            borderLeft: `3px solid ${grahaColor(selected.grahaSlug)}`,
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full" style={{ background: grahaColor(selected.grahaSlug) }} />
              <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
                <IAST size="md">{selected.nameIAST}</IAST>
                <span className="ml-2" style={{ color: INK_MUTED }}>
                  <Devanagari size="sm" style={{ fontSize: "16px", opacity: 0.7 }}>
                    {selected.nameDevanagari}
                  </Devanagari>
                </span>
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: `${GOLD_ACCENT}10`,
                color: GOLD_ACCENT,
                border: `1px solid ${GOLD_ACCENT}35`,
              }}
            >
              {selected.naisargikaFormatted} virūpas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
                Hierarchy role
              </p>
              <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
                <IAST size="sm">{selected.significanceIAST}</IAST>
                <span className="mx-1.5" style={{ color: INK_MUTED }}>—</span>
                {selected.significanceEnglish}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
                Apparent brightness
              </p>
              <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
                Rank #{selected.luminosityRank} — {selected.luminosityNote}
              </p>
            </div>
          </div>

          <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            {selected.doctrineNote}
          </p>
        </div>
      )}

      {/* ── Hierarchy flow diagram ───────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowDownWideNarrow size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Significance Hierarchy
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          From soul (Sun) down to restriction (Saturn). The naisargika value follows the same descent.
        </p>
        <HierarchyFlow />
      </div>

      {/* ── Luminosity match diagram ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Sun size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Luminosity Correlate
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          The same order tracks how bright each planet appears to the naked eye. More gold dots = brighter.
        </p>
        <LuminosityMatch />
      </div>

      {/* ── Venus vs Jupiter comparison ──────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Puzzle: Venus above Jupiter
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Jupiter is the greater benefic, yet Venus ranks higher. The answer is not beneficence — it is brightness.
        </p>
        <VenusJupiterCompare />
      </div>

      {/* ── Side-by-side comparison (preset-driven) ──────────────────────── */}
      {compareSlug && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
        >
          <div className="flex items-center gap-2">
            <Scale size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Comparison
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[highlightedSlug, compareSlug].filter(Boolean).map((slug) => {
              const g = GRAHA_RATIONALE.find((x) => x.grahaSlug === slug)!;
              const col = grahaColor(g.grahaSlug);
              return (
                <div
                  key={g.grahaSlug}
                  className="rounded-lg p-3 space-y-2"
                  style={{ background: `${col}06`, border: `1px solid ${col}25` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
                    <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                      <IAST size="sm">{g.nameIAST}</IAST>
                    </span>
                    <span className="ml-auto text-xs font-mono font-bold" style={{ color: col }}>
                      {g.naisargikaFormatted}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                    <strong>{g.significanceEnglish}</strong> — {g.doctrineNote}
                  </p>
                  <p className="text-xs" style={{ color: INK_MUTED }}>
                    {g.luminosityNote}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Baseline reminder ────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GREEN}` }}
      >
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: GREEN }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Operational Role: The Constant Baseline
          </span>
        </div>
        <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Naisargika bala is <strong>identical in every chart</strong> — it sets the innate floor. The five variable balas add chart-specific differences on top:
        </p>
        <div className="flex flex-wrap gap-2">
          {VARIABLE_BALAS.map((vb) => (
            <span
              key={vb.key}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: `${BLUE}10`, color: BLUE, border: `1px solid ${BLUE}30` }}
            >
              <IAST size="sm">{vb.nameIAST}</IAST>
            </span>
          ))}
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
