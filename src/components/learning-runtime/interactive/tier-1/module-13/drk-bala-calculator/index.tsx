"use client";

/**
 * Dṛk Bala Calculator — The Aspectual-Strength Interactive
 *
 * §7 interactive for Lesson 13.5.1.
 *
 * Lets the learner add benefic and malefic aspects onto a target planet,
 * see the signed net (can be negative), and understand dṛk bala as the
 * sixth and final ṣaḍbala component. Rich SVG diagrams visualise the
 * aspect net, the signed number line, and the six-component overview.
 */

import { useState, useCallback } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  GRAHA_NATURES,
  GRAHA_NATURE_MAP,
  ASPECT_PRESETS,
  SHADBALA_COMPONENTS,
  type AspectEntry,
} from "./data";
import {
  Eye,
  Plus,
  Minus,
  Trash2,
  Info,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Layers,
  AlertTriangle,
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

function natureColor(nature: string): string {
  return nature === "benefic" ? GREEN : nature === "malefic" ? VERMILION : GOLD_ACCENT;
}

function natureBg(nature: string): string {
  return nature === "benefic" ? `${GREEN}10` : nature === "malefic" ? `${VERMILION}10` : `${GOLD_ACCENT}10`;
}

/* ─── SVG Diagram: Aspect Net ────────────────────────────────────────────── */

function AspectNetDiagram({
  targetSlug,
  aspects,
}: {
  targetSlug: GrahaSlug;
  aspects: AspectEntry[];
}) {
  const cx = 150;
  const cy = 120;
  const targetR = 32;
  const orbitR = 95;

  // Position aspect sources around the orbit
  function sourcePos(index: number, total: number) {
    const angle = ((index * 360) / Math.max(total, 1) - 90) * (Math.PI / 180);
    return {
      x: cx + orbitR * Math.cos(angle),
      y: cy + orbitR * Math.sin(angle),
    };
  }

  const targetCol = grahaColor(targetSlug);

  return (
    <svg viewBox="0 0 300 285" className="w-full h-auto" style={{ maxHeight: 305 }}>
      {/* Orbit circle (subtle) */}
      <circle cx={cx} cy={cy} r={orbitR} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" opacity={0.5} />

      {/* Aspect arrows */}
      {aspects.map((a, i) => {
        const pos = sourcePos(i, aspects.length);
        const col = a.isBenefic ? GREEN : VERMILION;
        const strokeW = Math.max(1.5, a.strength * 3);

        // Calculate arrow endpoint on target circle edge
        const dx = cx - pos.x;
        const dy = cy - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const endX = pos.x + (dx / dist) * (dist - targetR - 4);
        const endY = pos.y + (dy / dist) * (dist - targetR - 4);

        return (
          <g key={a.id}>
            <line
              x1={pos.x}
              y1={pos.y}
              x2={endX}
              y2={endY}
              stroke={col}
              strokeWidth={strokeW}
              opacity={0.7}
              markerEnd={a.isBenefic ? "url(#arrowBenefic)" : "url(#arrowMalefic)"}
            />
            {/* Source planet circle */}
            <circle cx={pos.x} cy={pos.y} r={16} fill={`${grahaColor(a.sourceSlug)}18`} stroke={`${grahaColor(a.sourceSlug)}40`} strokeWidth={1.5} />
            <text x={pos.x} y={pos.y - 2} textAnchor="middle" fontSize={8} fill={grahaColor(a.sourceSlug)} fontWeight={700}>
              <IAST size="sm">{GRAHA_NATURE_MAP[a.sourceSlug].nameIAST}</IAST>
            </text>
            <text x={pos.x} y={pos.y + 9} textAnchor="middle" fontSize={8} fill={a.isBenefic ? GREEN : VERMILION} fontWeight={600}>
              {a.isBenefic ? "+" : "−"}{a.strength.toFixed(1)}
            </text>
          </g>
        );
      })}

      {/* Target planet */}
      <circle cx={cx} cy={cy} r={targetR} fill={`${targetCol}20`} stroke={targetCol} strokeWidth={2} />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize={10} fill={INK_PRIMARY} fontWeight={700}>
        <IAST size="sm">{GRAHA_NATURE_MAP[targetSlug].nameIAST}</IAST>
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
        Target
      </text>

      {/* Legend */}
      <g transform="translate(10, 260)">
        <line x1={0} y1={5} x2={20} y2={5} stroke={GREEN} strokeWidth={2} opacity={0.7} />
        <text x={26} y={9} fontSize={9} fill={INK_MUTED}>Benefic (+)</text>
        <line x1={90} y1={5} x2={110} y2={5} stroke={VERMILION} strokeWidth={2} opacity={0.7} />
        <text x={116} y={9} fontSize={9} fill={INK_MUTED}>Malefic (−)</text>
      </g>

      <defs>
        <marker id="arrowBenefic" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={GREEN} />
        </marker>
        <marker id="arrowMalefic" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={VERMILION} />
        </marker>
      </defs>
    </svg>
  );
}

/* ─── SVG Diagram: Signed number line ────────────────────────────────────── */

function SignedNumberLine({ net }: { net: number }) {
  const cx = 220;
  const cy = 50;
  const lineW = 360;
  const scale = 18; // pixels per unit

  const minX = cx - lineW / 2;
  const maxX = cx + lineW / 2;
  const zeroX = cx;
  const markerX = cx + net * scale;

  // Clamp marker visually
  const clampedX = Math.max(minX + 8, Math.min(maxX - 8, markerX));

  return (
    <svg viewBox="0 0 440 100" className="w-full h-auto" style={{ maxHeight: 120 }}>
      {/* Number line */}
      <line x1={minX} y1={cy} x2={maxX} y2={cy} stroke={INK_MUTED} strokeWidth={1.5} />

      {/* Zero tick */}
      <line x1={zeroX} y1={cy - 8} x2={zeroX} y2={cy + 8} stroke={INK_SECONDARY} strokeWidth={2} />
      <text x={zeroX} y={cy + 24} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={700}>
        0
      </text>

      {/* Ticks */}
      {[-10, -5, 5, 10].map((t) => {
        const tx = cx + t * scale;
        if (tx < minX || tx > maxX) return null;
        return (
          <g key={t}>
            <line x1={tx} y1={cy - 5} x2={tx} y2={cy + 5} stroke={HAIRLINE} strokeWidth={1} />
            <text x={tx} y={cy + 20} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
              {t > 0 ? `+${t}` : t}
            </text>
          </g>
        );
      })}

      {/* Positive / negative labels */}
      <text x={maxX - 10} y={cy - 14} textAnchor="end" fontSize={9} fill={GREEN} fontWeight={600}>
        Positive →
      </text>
      <text x={minX + 10} y={cy - 14} textAnchor="start" fontSize={9} fill={VERMILION} fontWeight={600}>
        ← Negative
      </text>

      {/* Net marker */}
      <polygon
        points={`${clampedX},${cy - 14} ${clampedX - 6},${cy - 26} ${clampedX + 6},${cy - 26}`}
        fill={net >= 0 ? GREEN : VERMILION}
        opacity={0.85}
      />
      <text
        x={clampedX}
        y={cy - 30}
        textAnchor="middle"
        fontSize={11}
        fill={net >= 0 ? GREEN : VERMILION}
        fontWeight={700}
      >
        Net: {net > 0 ? "+" : ""}{net.toFixed(2)}
      </text>
    </svg>
  );
}

/* ─── SVG Diagram: Six components overview ───────────────────────────────── */

function SixComponentsOverview() {
  const items = SHADBALA_COMPONENTS;
  const boxW = 120;
  const boxH = 54;
  const gapX = 10;
  const gapY = 10;
  const cols = 3;
  const chartW = cols * boxW + (cols - 1) * gapX + 40;
  const rows = Math.ceil(items.length / cols);
  const chartH = rows * boxH + (rows - 1) * gapY + 40;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 160 }}>
      <text x={chartW / 2} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        The Six Ṣaḍbala Components
      </text>

      {items.map((comp, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 20 + col * (boxW + gapX);
        const y = 28 + row * (boxH + gapY);
        const isDrk = comp.key === "drk";

        return (
          <g key={comp.key}>
            <rect
              x={x}
              y={y}
              width={boxW}
              height={boxH}
              rx={6}
              fill={isDrk ? `${VERMILION}10` : SURFACE}
              stroke={isDrk ? `${VERMILION}45` : HAIRLINE}
              strokeWidth={isDrk ? 2 : 1}
            />
            <text x={x + boxW / 2} y={y + 18} textAnchor="middle" fontSize={9} fill={isDrk ? VERMILION : INK_SECONDARY} fontWeight={700}>
              {i + 1}. <IAST size="sm">{comp.nameIAST}</IAST>
            </text>
            <text x={x + boxW / 2} y={y + 34} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
              {comp.english}
            </text>
            {isDrk && (
              <text x={x + boxW / 2} y={y + 48} textAnchor="middle" fontSize={8} fill={VERMILION} fontWeight={600}>
                Can be negative
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function DrkBalaCalculator() {
  const [targetSlug, setTargetSlug] = useState<GrahaSlug>("candra");
  const [aspects, setAspects] = useState<AspectEntry[]>(ASPECT_PRESETS[2]);
  const [newSource, setNewSource] = useState<GrahaSlug>("guru");
  const [newStrength, setNewStrength] = useState<number>(1.0);
  const [newIsBenefic, setNewIsBenefic] = useState<boolean>(true);

  const net = aspects.reduce((sum, a) => sum + (a.isBenefic ? a.strength : -a.strength), 0);

  const addAspect = useCallback(() => {
    if (newSource === targetSlug) return; // can't aspect self
    const entry: AspectEntry = {
      id: `${Date.now()}-${Math.random()}`,
      sourceSlug: newSource,
      strength: newStrength,
      isBenefic: newIsBenefic,
      aspectLabel: newStrength >= 0.9 ? "Full aspect" : "Partial aspect",
    };
    setAspects((prev) => [...prev, entry]);
  }, [newSource, newStrength, newIsBenefic, targetSlug]);

  const removeAspect = useCallback((id: string) => {
    setAspects((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const applyPreset = useCallback((idx: number) => {
    setAspects(ASPECT_PRESETS[idx]);
  }, []);

  const targetCol = grahaColor(targetSlug);

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Eye size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Dṛk Bala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Calculator
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Net of benefic (+) and malefic (−) aspects. The only ṣaḍbala that can go negative.
          </p>
        </div>
      </div>

      {/* ── Target planet selector ───────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <p className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
          Select target planet:
        </p>
        <div className="flex flex-wrap gap-2">
          {GRAHA_NATURES.map((g) => {
            const active = g.grahaSlug === targetSlug;
            const col = grahaColor(g.grahaSlug);
            return (
              <button
                key={g.grahaSlug}
                onClick={() => {
                  setTargetSlug(g.grahaSlug);
                  setAspects((prev) => prev.filter((a) => a.sourceSlug !== g.grahaSlug));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
                style={{
                  background: active ? `${col}12` : "transparent",
                  color: active ? col : INK_SECONDARY,
                  border: `1.5px solid ${active ? `${col}45` : HAIRLINE}`,
                  fontWeight: active ? 600 : 500,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: col, opacity: active ? 1 : 0.5 }} />
                <IAST size="sm">{g.nameIAST}</IAST>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Aspect net diagram ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Aspect Net
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Green arrows = benefic aspects adding strength. Red arrows = malefic aspects subtracting.
        </p>
        <AspectNetDiagram targetSlug={targetSlug} aspects={aspects} />
      </div>

      {/* ── Net result display ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderLeft: `3px solid ${net >= 0 ? GREEN : VERMILION}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: net >= 0 ? GREEN : VERMILION }}
            />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Net Dṛk Bala (illustrative)
            </span>
          </div>
          <span
            className="text-lg font-bold font-mono"
            style={{ color: net >= 0 ? GREEN : VERMILION }}
          >
            {net > 0 ? "+" : ""}{net.toFixed(2)}
          </span>
        </div>

        <SignedNumberLine net={net} />

        {net < 0 && (
          <div className="flex items-start gap-2" style={{ color: VERMILION }}>
            <AlertTriangle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
            <p className="text-xs" style={{ lineHeight: 1.5 }}>
              Negative dṛk bala — this planet receives more malefic than benefic gaze. The only ṣaḍbala component that can reduce total strength below zero.
            </p>
          </div>
        )}
      </div>

      {/* ── Aspect list ──────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Aspects on <IAST size="sm">{GRAHA_NATURE_MAP[targetSlug].nameIAST}</IAST>
            </span>
          </div>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            {aspects.length} aspect{aspects.length !== 1 ? "s" : ""}
          </span>
        </div>

        {aspects.length === 0 ? (
          <p className="text-sm" style={{ color: INK_MUTED }}>
            No aspects added. Use the form below to add benefic or malefic aspects.
          </p>
        ) : (
          <div className="space-y-2">
            {aspects.map((a) => {
              const col = grahaColor(a.sourceSlug);
              const nat = GRAHA_NATURE_MAP[a.sourceSlug];
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-md px-3 py-2"
                  style={{
                    background: a.isBenefic ? `${GREEN}06` : `${VERMILION}06`,
                    border: `1px solid ${a.isBenefic ? `${GREEN}25` : `${VERMILION}25`}`,
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
                    <span className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
                      <IAST size="sm">{nat.nameIAST}</IAST>
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded"
                      style={{
                        background: natureBg(nat.nature),
                        color: natureColor(nat.nature),
                      }}
                    >
                      {nat.nature}
                    </span>
                    <span className="text-xs" style={{ color: INK_MUTED }}>
                      {a.aspectLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-sm font-mono font-bold"
                      style={{ color: a.isBenefic ? GREEN : VERMILION }}
                    >
                      {a.isBenefic ? "+" : "−"}{a.strength.toFixed(1)}
                    </span>
                    <button
                      onClick={() => removeAspect(a.id)}
                      className="p-1 rounded transition-colors hover:opacity-70"
                      style={{ color: INK_MUTED }}
                      aria-label="Remove aspect"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add aspect form ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <p className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
          Add an aspect:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Source planet */}
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
              Source planet
            </span>
            <select
              value={newSource}
              onChange={(e) => setNewSource(e.target.value as GrahaSlug)}
              className="w-full rounded-lg px-2.5 py-2 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {GRAHA_NATURES.filter((g) => g.grahaSlug !== targetSlug).map((g) => (
                <option key={g.grahaSlug} value={g.grahaSlug}>
                  {g.nameIAST} ({g.nature})
                </option>
              ))}
            </select>
          </label>

          {/* Strength */}
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
              Strength
            </span>
            <select
              value={newStrength}
              onChange={(e) => setNewStrength(Number(e.target.value))}
              className="w-full rounded-lg px-2.5 py-2 text-sm"
              style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              <option value={1.0}>Full (1.0)</option>
              <option value={0.75}>¾ (0.75)</option>
              <option value={0.5}>½ (0.50)</option>
              <option value={0.25}>¼ (0.25)</option>
            </select>
          </label>

          {/* Benefic / Malefic */}
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: INK_MUTED }}>
              Effect
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setNewIsBenefic(true)}
                className="flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all"
                style={{
                  background: newIsBenefic ? `${GREEN}15` : "transparent",
                  color: newIsBenefic ? GREEN : INK_MUTED,
                  border: `1.5px solid ${newIsBenefic ? `${GREEN}45` : HAIRLINE}`,
                }}
              >
                <Plus size={14} className="inline mr-1" />
                Benefic
              </button>
              <button
                onClick={() => setNewIsBenefic(false)}
                className="flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all"
                style={{
                  background: !newIsBenefic ? `${VERMILION}15` : "transparent",
                  color: !newIsBenefic ? VERMILION : INK_MUTED,
                  border: `1.5px solid ${!newIsBenefic ? `${VERMILION}45` : HAIRLINE}`,
                }}
              >
                <Minus size={14} className="inline mr-1" />
                Malefic
              </button>
            </div>
          </label>

          {/* Add button */}
          <div className="flex items-end">
            <button
              onClick={addAspect}
              className="w-full rounded-lg px-3 py-2 text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: GOLD_ACCENT,
                color: "#fff",
              }}
            >
              Add aspect
            </button>
          </div>
        </div>
      </div>

      {/* ── Six components overview ──────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Dṛk Bala: the Sixth and Final Component
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Dṛk bala completes the six-fold strength. It is the only component that can subtract from the total.
        </p>
        <SixComponentsOverview />
      </div>

      {/* ── Engine deferral banner ───────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}25` }}
      >
        <Info size={16} style={{ color: BLUE, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Exact values come from the Astro Engine
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            The precise drishti-piṇḍa (graded aspect value), which bodies cast aspects for dṛk bala (7 planets; node-handling varies), and the scaling factor (commonly ÷4) are engine details that vary by source. This calculator uses illustrative strengths for concept-teaching.
          </p>
        </div>
      </div>

      {/* ── Presets ──────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <p className="text-sm font-semibold" style={{ color: INK_SECONDARY }}>
          Try these worked examples:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: "Benefic-dominated", desc: "Jupiter + Venus aspect → positive net.", idx: 0, takeaway: "Benefic gaze adds strength." },
            { label: "Malefic-dominated", desc: "Saturn + Mars aspect → negative net.", idx: 1, takeaway: "Can go below zero." },
            { label: "Mixed net", desc: "Jupiter AND Saturn aspect → signed sum.", idx: 2, takeaway: "Net = benefic − malefic." },
          ].map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p.idx)}
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
                {p.desc}
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
