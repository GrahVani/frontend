"use client";

/**
 * Ṣaḍbala Summation — The Six-Fold Total Interactive
 *
 * §7 interactive for Lesson 13.5.2.
 *
 * Lets the learner enter the six ṣaḍbala components for any planet,
 * see the sum in virūpas, convert to rūpas (÷60), and compare against
 * the required minimum. Rich SVG diagrams visualise the waterfall
 * stack, the threshold gauge, and the all-planets reference.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  COMPONENTS,
  REQUIRED_MINIMA,
  REQUIRED_MAP,
  PRESETS,
  type ComponentValues,
} from "./data";
import {
  Calculator,
  Plus,
  Divide,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Info,
  AlertTriangle,
  BarChart3,
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
const BLUE = "#356CAB";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: GrahaSlug): string {
  return grahas[slug].primary;
}

/* ─── SVG Diagram: Waterfall stack ───────────────────────────────────────── */

function WaterfallStack({ values }: { values: ComponentValues }) {
  const barW = 70;
  const unitH = 0.65; // pixels per virupa
  const leftPad = 100;
  const chartW = 640;

  // Calculate cumulative positions
  let cumulative = 0;
  const segments = COMPONENTS.map((comp) => {
    const val = values[comp.key as keyof ComponentValues];
    const yStart = cumulative;
    cumulative += val;
    return { comp, val, yStart };
  });

  const maxV = Math.max(cumulative, ...segments.map((s) => s.yStart + s.val), 0);
  const minV = Math.min(cumulative, ...segments.map((s) => s.yStart + s.val), 0);
  const range = maxV - minV;
  const chartH = Math.max(range * unitH + 60, 140);
  const zeroY = (maxV / range) * chartH * (range > 0 ? 1 : 0.5) + 20;

  // Better zero-line calculation
  const baselineY = 20 + (maxV * unitH);
  const totalY = baselineY - cumulative * unitH;

  // Simpler approach: fixed scale
  const scale = 0.5;
  const baseY = 210;
  const topY = 30;

  let currentY = baseY;
  const segData = COMPONENTS.map((comp) => {
    const val = values[comp.key as keyof ComponentValues];
    const h = Math.abs(val) * scale;
    const y = currentY - (val >= 0 ? h : 0);
    currentY -= val * scale;
    return { comp, val, h, y, endY: currentY };
  });

  const finalY = currentY;

  return (
    <svg viewBox={`0 0 ${chartW} 300`} className="w-full h-auto" style={{ maxHeight: 320 }}>
      <g transform="translate(0, 30)">
      {/* Zero baseline */}
      <line x1={20} y1={baseY} x2={580} y2={baseY} stroke={HAIRLINE} strokeWidth={1} />
      <text x={10} y={baseY + 4} textAnchor="end" fontSize={10} fill={INK_MUTED}>
        0
      </text>

      {/* Component segments */}
      {segData.map((s, i) => {
        const x = leftPad + i * (barW + 8);
        const col = s.comp.key === "drk" && s.val < 0 ? VERMILION : s.comp.key === "drk" ? GREEN : BLUE;
        return (
          <g key={s.comp.key}>
            {/* Bar */}
            <rect
              x={x}
              y={s.y}
              width={barW}
              height={Math.max(s.h, 2)}
              rx={4}
              fill={col}
              opacity={0.55}
              stroke={`${col}50`}
              strokeWidth={1}
            />

            {/* Value label */}
            <text
              x={x + barW / 2}
              y={s.val >= 0 ? s.y - 14 : s.y + s.h + 14}
              textAnchor="middle"
              fontSize={12}
              fill={col}
              fontWeight={700}
              stroke={SURFACE}
              strokeWidth={3}
              paintOrder="stroke"
            >
              {s.val > 0 ? "+" : ""}{s.val.toFixed(1)}
            </text>

            {/* Component label */}
            <text x={x + barW / 2} y={baseY + 18} textAnchor="middle" fontSize={10} fill={INK_MUTED}>
              <IAST size="sm">{s.comp.nameIAST.split(" ")[0]}</IAST>
            </text>
          </g>
        );
      })}

      {/* Total line */}
      <line x1={20} y1={finalY} x2={580} y2={finalY} stroke={GOLD_ACCENT} strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={10} y={finalY + 4} textAnchor="end" fontSize={11} fill={GOLD_ACCENT} fontWeight={700} stroke={SURFACE} strokeWidth={3} paintOrder="stroke">
        {segData.reduce((s, d) => s + d.val, 0).toFixed(1)} v
      </text>
      </g>
    </svg>
  );
}

/* ─── SVG Diagram: Threshold gauge ───────────────────────────────────────── */

function ThresholdGauge({ totalRupas, requiredRupas }: { totalRupas: number; requiredRupas: number }) {
  const chartW = 400;
  const chartH = 70;
  const barMaxW = 300;
  const leftPad = 50;
  const barY = 30;
  const barH = 22;

  const maxScale = Math.max(totalRupas, requiredRupas) * 1.3;
  const barW = (totalRupas / maxScale) * barMaxW;
  const thresholdX = leftPad + (requiredRupas / maxScale) * barMaxW;
  const passes = totalRupas >= requiredRupas;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 90 }}>
      {/* Background track */}
      <rect x={leftPad} y={barY} width={barMaxW} height={barH} rx={11} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />

      {/* Total bar */}
      <rect
        x={leftPad}
        y={barY + 2}
        width={Math.max(barW, 4)}
        height={barH - 4}
        rx={9}
        fill={passes ? GREEN : VERMILION}
        opacity={0.6}
      />

      {/* Threshold marker */}
      <line x1={thresholdX} y1={barY - 6} x2={thresholdX} y2={barY + barH + 6} stroke={GOLD_ACCENT} strokeWidth={2} strokeDasharray="3 3" />
      <text x={thresholdX} y={barY - 10} textAnchor="middle" fontSize={9} fill={GOLD_ACCENT} fontWeight={700}>
        Required: {requiredRupas}
      </text>

      {/* Total label */}
      <text x={leftPad + barW + 6} y={barY + barH / 2 + 4} fontSize={11} fill={passes ? GREEN : VERMILION} fontWeight={700}>
        {totalRupas.toFixed(2)} rūpas
      </text>
    </svg>
  );
}

/* ─── SVG Diagram: All-planets reference table (mini bars) ───────────────── */

function AllPlanetsReference({ highlightedSlug }: { highlightedSlug?: GrahaSlug }) {
  const chartW = 420;
  const rowH = 32;
  const gap = 6;
  const leftPad = 80;
  const barMaxW = 180;
  const chartH = REQUIRED_MINIMA.length * (rowH + gap) + 30;

  const maxReq = Math.max(...REQUIRED_MINIMA.map((r) => r.requiredRupas));

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 280 }}>
      <text x={chartW / 2} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Required minima (rūpas)
      </text>

      {REQUIRED_MINIMA.map((r, i) => {
        const y = 26 + i * (rowH + gap);
        const col = grahaColor(r.grahaSlug);
        const barW = (r.requiredRupas / maxReq) * barMaxW;
        const isHighlight = highlightedSlug === r.grahaSlug;

        return (
          <g key={r.grahaSlug}>
            {/* Planet label */}
            <text x={leftPad - 8} y={y + rowH / 2 + 4} textAnchor="end" fontSize={11} fill={isHighlight ? col : INK_SECONDARY} fontWeight={isHighlight ? 700 : 600}>
              <IAST size="sm">{r.nameIAST}</IAST>
            </text>

            {/* Bar */}
            <rect
              x={leftPad}
              y={y + 6}
              width={barW}
              height={rowH - 12}
              rx={5}
              fill={col}
              opacity={isHighlight ? 0.7 : 0.4}
              stroke={isHighlight ? col : "none"}
              strokeWidth={isHighlight ? 2 : 0}
            />

            {/* Value */}
            <text x={leftPad + barW + 8} y={y + rowH / 2 + 4} fontSize={11} fill={isHighlight ? col : INK_SECONDARY} fontWeight={isHighlight ? 700 : 500}>
              {r.requiredRupas}
            </text>

            {/* Fork note */}
            {r.hasFork && (
              <text x={leftPad + barW + 40} y={y + rowH / 2 + 4} fontSize={9} fill={GOLD_ACCENT} fontWeight={600}>
                ⚠ source-fork
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function ShadbalaSummation() {
  const [selectedSlug, setSelectedSlug] = useState<GrahaSlug>("guru");
  const [values, setValues] = useState<ComponentValues>({
    sthana: 120,
    dik: 40,
    kala: 150,
    cheshta: 30,
    naisargika: 240 / 7,
    drk: 20,
  });

  const required = REQUIRED_MAP[selectedSlug];
  const totalVirupas = Object.values(values).reduce((s, v) => s + v, 0);
  const totalRupas = totalVirupas / 60;
  const passes = totalRupas >= required.requiredRupas;
  const diff = totalRupas - required.requiredRupas;

  function updateValue(key: keyof ComponentValues, val: number) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setSelectedSlug(p.grahaSlug);
    setValues({ ...p.values });
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Calculator size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Ṣaḍbala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Summation
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Add the six components, convert to rūpas, and compare to the required minimum.
          </p>
        </div>
      </div>

      {/* ── Planet selector ──────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        {REQUIRED_MINIMA.map((r) => {
          const active = r.grahaSlug === selectedSlug;
          const col = grahaColor(r.grahaSlug);
          return (
            <button
              key={r.grahaSlug}
              onClick={() => setSelectedSlug(r.grahaSlug)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: active ? `${col}10` : "transparent",
                color: active ? col : INK_SECONDARY,
                border: `1.5px solid ${active ? `${col}40` : HAIRLINE}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: col, opacity: active ? 1 : 0.5 }} />
              <IAST size="sm">{r.nameIAST}</IAST>
            </button>
          );
        })}
      </div>

      {/* ── Component inputs ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Enter the six components (virūpas)
            </span>
          </div>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            Naisargika is fixed; dṛk can be negative
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COMPONENTS.map((comp) => {
            const val = values[comp.key as keyof ComponentValues];
            const isNaisargika = comp.key === "naisargika";
            const isDrk = comp.key === "drk";
            return (
              <label key={comp.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
                    <IAST size="sm">{comp.nameIAST}</IAST>
                  </span>
                  {isNaisargika && (
                    <span className="text-xs" style={{ color: INK_MUTED }}>fixed</span>
                  )}
                  {isDrk && (
                    <span className="text-xs" style={{ color: VERMILION }}>can be −</span>
                  )}
                </div>
                <input
                  type="number"
                  step={isNaisargika ? "0.01" : "1"}
                  value={val.toFixed(isNaisargika ? 2 : 0)}
                  onChange={(e) => updateValue(comp.key as keyof ComponentValues, Number(e.target.value))}
                  readOnly={isNaisargika}
                  className="w-full rounded-lg px-2.5 py-2 text-sm font-mono"
                  style={{
                    background: isNaisargika ? `${HAIRLINE}30` : "var(--gl-surface-2, #F5EDD8)",
                    border: `1px solid ${HAIRLINE}`,
                    color: isDrk && val < 0 ? VERMILION : INK_PRIMARY,
                  }}
                />
                <p className="text-xs" style={{ color: INK_MUTED }}>{comp.description}</p>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Waterfall diagram ────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Plus size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Waterfall Stack
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Each bar adds to the running total. A negative dṛk pulls the stack downward.
        </p>
        <WaterfallStack values={values} />
      </div>

      {/* ── Total and conversion ─────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderLeft: `3px solid ${passes ? GREEN : VERMILION}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full" style={{ background: passes ? GREEN : VERMILION }} />
            <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
              Total for <IAST size="sm">{required.nameIAST}</IAST>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {passes ? (
              <CheckCircle2 size={18} style={{ color: GREEN }} />
            ) : (
              <XCircle size={18} style={{ color: VERMILION }} />
            )}
            <span className="text-lg font-bold font-mono" style={{ color: passes ? GREEN : VERMILION }}>
              {totalRupas.toFixed(2)} rūpas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm" style={{ color: INK_SECONDARY }}>
          <span>
            <strong>{totalVirupas.toFixed(2)}</strong> virūpas
          </span>
          <Divide size={14} style={{ color: INK_MUTED }} />
          <span>60</span>
          <span>=</span>
          <span className="font-bold font-mono" style={{ color: passes ? GREEN : VERMILION }}>
            {totalRupas.toFixed(2)} rūpas
          </span>
        </div>

        <ThresholdGauge totalRupas={totalRupas} requiredRupas={required.requiredRupas} />

        <div className="flex items-start gap-2">
          {passes ? (
            <CheckCircle2 size={14} style={{ color: GREEN, marginTop: 2, flexShrink: 0 }} />
          ) : (
            <XCircle size={14} style={{ color: VERMILION, marginTop: 2, flexShrink: 0 }} />
          )}
          <p className="text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            <strong style={{ color: passes ? GREEN : VERMILION }}>
              {passes ? "Clears" : "Below"}
            </strong>{" "}
            the required minimum of <strong>{required.requiredRupas}</strong> rūpas
            {passes ? " by " : " by "}
            <strong>{Math.abs(diff).toFixed(2)}</strong> rūpas.
          </p>
        </div>

        {/* Source-fork note */}
        {required.hasFork && (
          <div
            className="rounded-md p-2.5 flex items-start gap-2"
            style={{ background: `${GOLD_ACCENT}08`, border: `1px solid ${GOLD_ACCENT}30` }}
          >
            <AlertTriangle size={14} style={{ color: GOLD_ACCENT, marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
              <strong>Source-fork:</strong> {required.forkNote}
            </p>
          </div>
        )}
      </div>

      {/* ── All-planets reference ────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <BarChart3 size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Required Minima — All Planets
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Compare each planet against its own bar. Strength is relative, not raw.
        </p>
        <AllPlanetsReference highlightedSlug={selectedSlug} />
      </div>

      {/* ── Engine deferral banner ───────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}25` }}
      >
        <Info size={16} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Exact component values come from the Astro Engine
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            Sthāna, dik, kāla, cheṣṭā, and dṛk bala are computed from the chart. Naisargika is fixed (from Lesson 13.4.2). This calculator uses illustrative inputs for concept-teaching.
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
