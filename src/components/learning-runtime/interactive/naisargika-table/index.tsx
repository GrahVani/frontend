"use client";

/**
 * Naisargika Bala Table — The Fixed Natural-Strength Interactive
 *
 * §7 interactive for Lesson 13.4.2.
 *
 * Shows the seven fixed naisargika bala values, the 60×k/7 pattern,
 * and the baseline concept. Rich SVG diagrams visualise the descending
 * scale, the fraction ladder, and how variable balas accumulate on top.
 */

/* eslint-disable react/no-unescaped-entities */

import { useState } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  NAISARGIKA_VALUES,
  MAX_VIRUPAS,
  FORMULA_BASE,
  FORMULA_DIVISOR,
  PRESETS,
  VARIABLE_BALAS,
} from "./data";
import {
  Table,
  TrendingDown,
  BarChart3,
  Layers,
  Divide,
  ChevronRight,
  Info,
  Sparkles,
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

/* ─── SVG Diagram: Descending horizontal bar chart ───────────────────────── */

function DescendingBarChart({ highlightedSlug }: { highlightedSlug?: GrahaSlug }) {
  const barH = 28;
  const gap = 10;
  const leftPad = 100;
  const rightPad = 80;
  const chartW = 560;
  const barMaxW = chartW - leftPad - rightPad;
  const chartH = NAISARGIKA_VALUES.length * (barH + gap) + 20;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 320 }}>
      {/* Grid line at 60 */}
      <line
        x1={leftPad}
        y1={8}
        x2={leftPad + barMaxW}
        y2={8}
        stroke={HAIRLINE}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
      <text x={leftPad + barMaxW + 6} y={12} fontSize={9} fill={INK_MUTED}>
        60
      </text>

      {NAISARGIKA_VALUES.map((entry, i) => {
        const y = 20 + i * (barH + gap);
        const barW = (entry.virupas / MAX_VIRUPAS) * barMaxW;
        const col = grahaColor(entry.grahaSlug);
        const isHighlight = highlightedSlug === entry.grahaSlug;

        return (
          <g key={entry.grahaSlug}>
            {/* Planet label */}
            <text x={leftPad - 10} y={y + barH / 2 + 4} textAnchor="end" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
              <IAST size="sm">{entry.nameIAST}</IAST>
            </text>

            {/* Bar */}
            <rect
              x={leftPad}
              y={y}
              width={barW}
              height={barH}
              rx={5}
              fill={col}
              opacity={isHighlight ? 0.85 : 0.5}
              stroke={isHighlight ? col : "none"}
              strokeWidth={isHighlight ? 2 : 0}
            />

            {/* Value label */}
            <text
              x={leftPad + barW + 8}
              y={y + barH / 2 + 4}
              fontSize={11}
              fill={isHighlight ? col : INK_SECONDARY}
              fontWeight={isHighlight ? 700 : 500}
            >
              {entry.virupasFormatted}
            </text>

            {/* Fraction label */}
            <text
              x={leftPad + barW + 50}
              y={y + barH / 2 + 4}
              fontSize={10}
              fill={INK_MUTED}
            >
              60 × {entry.fraction}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Diagram: 60÷7 fraction ladder (stepped blocks) ────────────────── */

function FractionLadder() {
  const stepW = 52;
  const stepH = 36;
  const gap = 6;
  const leftPad = 90;
  const chartW = leftPad + 7 * stepW + 80;
  const chartH = NAISARGIKA_VALUES.length * (stepH + gap) + 40;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 340 }}>
      {/* Title */}
      <text x={chartW / 2} y={18} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        The 60 × k/7 ladder — each step down loses one seventh
      </text>

      {NAISARGIKA_VALUES.map((entry, i) => {
        const y = 32 + i * (stepH + gap);
        const col = grahaColor(entry.grahaSlug);
        const numBlocks = entry.k;

        return (
          <g key={entry.grahaSlug}>
            {/* Planet label */}
            <text x={leftPad - 10} y={y + stepH / 2 + 4} textAnchor="end" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
              <IAST size="sm">{entry.nameIAST}</IAST>
            </text>

            {/* Blocks representing k/7 */}
            {Array.from({ length: 7 }).map((_, j) => {
              const filled = j < numBlocks;
              const bx = leftPad + j * stepW;
              return (
                <rect
                  key={j}
                  x={bx}
                  y={y}
                  width={stepW - 3}
                  height={stepH}
                  rx={4}
                  fill={filled ? col : SURFACE}
                  opacity={filled ? 0.6 : 0.4}
                  stroke={filled ? `${col}50` : HAIRLINE}
                  strokeWidth={1}
                />
              );
            })}

            {/* Value */}
            <text x={leftPad + 7 * stepW + 10} y={y + stepH / 2 + 4} fontSize={11} fill={col} fontWeight={700}>
              {entry.virupasFormatted}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── SVG Diagram: Baseline stack (naisargika + variable balas) ──────────── */

function BaselineStackDiagram() {
  const barW = 120;
  const baseH = 40;
  const layerH = 22;
  const leftPad = 80;
  const chartW = 420;
  const chartH = baseH + VARIABLE_BALAS.length * layerH + 60;

  const variableColors = [
    "#C8841E", // sthana — gold
    "#5A7A8A", // dik — slate
    "#7A6B3E", // kala — olive
    "#A23A1E", // cheshta — vermilion
    "#356CAB", // drik — blue
  ];

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 260 }}>
      {/* Naisargika base block */}
      <rect
        x={leftPad}
        y={chartH - baseH - 20}
        width={barW}
        height={baseH}
        rx={5}
        fill={GOLD_ACCENT}
        opacity={0.25}
        stroke={`${GOLD_ACCENT}60`}
        strokeWidth={1.5}
      />
      <text
        x={leftPad + barW / 2}
        y={chartH - baseH / 2 - 8}
        textAnchor="middle"
        fontSize={10}
        fill={GOLD_ACCENT}
        fontWeight={700}
      >
        Naisargika
      </text>
      <text
        x={leftPad + barW / 2}
        y={chartH - baseH / 2 + 6}
        textAnchor="middle"
        fontSize={9}
        fill={INK_MUTED}
      >
        (fixed baseline)
      </text>

      {/* Variable bala layers */}
      {VARIABLE_BALAS.map((vb, i) => {
        const y = chartH - baseH - 20 - (i + 1) * layerH;
        const col = variableColors[i];
        return (
          <g key={vb.key}>
            <rect
              x={leftPad}
              y={y}
              width={barW}
              height={layerH - 2}
              rx={4}
              fill={col}
              opacity={0.18}
              stroke={`${col}50`}
              strokeWidth={1}
            />
            <text
              x={leftPad + barW / 2}
              y={y + (layerH - 2) / 2 + 4}
              textAnchor="middle"
              fontSize={9}
              fill={col}
              fontWeight={600}
            >
              <IAST size="sm">{vb.nameIAST}</IAST>
            </text>
          </g>
        );
      })}

      {/* Label column */}
      <text x={leftPad + barW + 20} y={chartH - 10} fontSize={10} fill={GOLD_ACCENT} fontWeight={700}>
        ← Same in every chart
      </text>
      <text x={leftPad + barW + 20} y={30} fontSize={10} fill={INK_SECONDARY} fontWeight={600}>
        ← Vary by chart
      </text>

      {/* Total strength indicator */}
      <line
        x1={leftPad - 10}
        y1={20}
        x2={leftPad - 10}
        y2={chartH - 20}
        stroke={INK_MUTED}
        strokeWidth={1.5}
        markerStart="url(#arrowUp)"
        markerEnd="url(#arrowDown)"
      />
      <text
        x={leftPad - 18}
        y={chartH / 2 + 4}
        textAnchor="end"
        fontSize={9}
        fill={INK_MUTED}
        transform={`rotate(-90, ${leftPad - 18}, ${chartH / 2 + 4})`}
      >
        Total Ṣaḍbala
      </text>

      <defs>
        <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="1" orient="auto">
          <path d="M3,0 L6,3 L0,3 Z" fill={INK_MUTED} />
        </marker>
        <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="5" orient="auto">
          <path d="M0,3 L6,3 L3,6 Z" fill={INK_MUTED} />
        </marker>
      </defs>
    </svg>
  );
}

/* ─── SVG Diagram: Circular fraction wheel (Sun = full circle) ───────────── */

function FractionWheel() {
  const cx = 130;
  const cy = 130;
  const r = 90;
  const innerR = 55;
  const chartW = 340;
  const chartH = 260;

  // 7 equal sectors, each 360/7 ≈ 51.43 degrees
  const sectorAngle = 360 / 7;

  function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
  }

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 280 }}>
      {/* Sectors */}
      {NAISARGIKA_VALUES.map((entry, i) => {
        const startAngle = i * sectorAngle;
        const endAngle = (i + 1) * sectorAngle;
        const col = grahaColor(entry.grahaSlug);
        const path = describeArc(cx, cy, r, startAngle, endAngle);
        const midAngle = startAngle + sectorAngle / 2;
        const valuePos = polarToCartesian(cx, cy, innerR + 11, midAngle);

        return (
          <g key={entry.grahaSlug}>
            <path d={path} fill={col} opacity={0.35} stroke={`${col}60`} strokeWidth={1} />
            <circle cx={valuePos.x} cy={valuePos.y} r="18" fill={SURFACE} opacity="0.88" stroke={`${col}70`} strokeWidth="1" />
            <text
              x={valuePos.x}
              y={valuePos.y + 4}
              textAnchor="middle"
              fontSize={11}
              fill={col}
              fontWeight={900}
            >
              {entry.virupasFormatted}
            </text>
          </g>
        );
      })}

      {/* Center label */}
      <circle cx={cx} cy={cy} r={innerR - 12} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.2} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={12} fill={INK_SECONDARY} fontWeight={800}>
        60 virūpas
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize={10} fill={INK_MUTED} fontWeight={700}>
        = 7 × 60/7
      </text>

      {/* Legend */}
      <text x={chartW - 10} y={20} textAnchor="end" fontSize={10} fill={INK_MUTED}>
        Each sector = 60/7 ≈ 8.57
      </text>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function NaisargikaTable() {
  const [highlightedSlug, setHighlightedSlug] = useState<GrahaSlug | undefined>("surya");

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setHighlightedSlug(p.grahaSlug);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Table size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Naisargika Bala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Table
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Fixed natural strength — identical in every chart. Seven values, one pattern.
          </p>
        </div>
      </div>

      {/* ── Reference table ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              The Seven Fixed Values
            </span>
          </div>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            Click a row to highlight
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
                <th className="text-left py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Planet
                </th>
                <th className="text-center py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Rank
                </th>
                <th className="text-center py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  k
                </th>
                <th className="text-center py-2 pr-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Formula
                </th>
                <th className="text-right py-2 pl-3 font-semibold" style={{ color: INK_SECONDARY, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                  Virūpas
                </th>
              </tr>
            </thead>
            <tbody>
              {NAISARGIKA_VALUES.map((entry) => {
                const active = highlightedSlug === entry.grahaSlug;
                const col = grahaColor(entry.grahaSlug);
                return (
                  <tr
                    key={entry.grahaSlug}
                    onClick={() => setHighlightedSlug(active ? undefined : entry.grahaSlug)}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: `1px solid ${HAIRLINE}`,
                      borderLeft: active ? `3px solid ${col}` : "3px solid transparent",
                      background: active ? `${col}06` : "transparent",
                    }}
                  >
                    <td className="py-2.5 pr-3 pl-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
                        <span className="font-medium" style={{ color: INK_PRIMARY }}>
                          <IAST size="sm">{entry.nameIAST}</IAST>
                        </span>
                        <span style={{ color: INK_MUTED }}>
                          <Devanagari size="sm" style={{ fontSize: "14px", opacity: 0.7 }}>
                            {entry.nameDevanagari}
                          </Devanagari>
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-3 text-center" style={{ color: INK_MUTED }}>
                      #{entry.rank}
                    </td>
                    <td className="py-2.5 pr-3 text-center font-mono text-xs" style={{ color: INK_SECONDARY }}>
                      {entry.k}
                    </td>
                    <td className="py-2.5 pr-3 text-center font-mono text-xs" style={{ color: INK_MUTED }}>
                      60 × {entry.fraction}
                    </td>
                    <td
                      className="py-2.5 pl-3 text-right font-mono text-sm"
                      style={{
                        color: active ? col : INK_PRIMARY,
                        fontWeight: active ? 700 : 600,
                      }}
                    >
                      {entry.virupasFormatted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Descending bar chart ─────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <TrendingDown size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Descending Scale
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Each planet's naisargika bala visualised as a proportion of the Sun's full 60 virūpas.
        </p>
        <DescendingBarChart highlightedSlug={highlightedSlug} />
      </div>

      {/* ── Fraction ladder diagram ──────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Divide size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The 60 × k/7 Pattern
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Each row shows how many of the seven equal parts (each = 60/7 ≈ 8.57) the planet receives. Filled blocks = counted; empty = not counted.
        </p>
        <FractionLadder />
      </div>

      {/* ── Fraction wheel diagram ───────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Full 60 Divided into Seven
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Circular view: the Sun claims all 7 sectors (60), the Moon claims 6 (51.43), down to Saturn with 1 (8.57). Each sector = 60/7 virūpas.
        </p>
        <FractionWheel />
      </div>

      {/* ── Baseline concept diagram ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Naisargika as the Constant Baseline
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Naisargika bala is the fixed floor. The five variable balas (sthāna, dik, kāla, cheṣṭā, dṛk) add chart-specific strength on top. Every chart starts from the same base.
        </p>
        <BaselineStackDiagram />
      </div>

      {/* ── Fixed-data note ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}25` }}
      >
        <Info size={16} style={{ color: GREEN, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            These values are fixed — no engine needed
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            Naisargika bala is the same in every chart. The seven values are classical constants from BPHS; they do not vary by birth data.
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
