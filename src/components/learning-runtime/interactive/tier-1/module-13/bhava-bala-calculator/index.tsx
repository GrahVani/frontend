"use client";

/**
 * Bhāva Bala Calculator — The House-Strength Interactive
 *
 * §7 interactive for Lesson 13.6.1.
 *
 * Lets the learner pick a house, enter the three bhāva-bala components,
 * see the sum in rūpas, and understand the parallel to ṣaḍbala.
 * Rich SVG diagrams visualise the house model, the ṣaḍbala parallel,
 * and the component stack.
 */

import { useState } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { grahas, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import {
  BHAVAS,
  BHAVA_COMPONENTS,
  PARALLELS,
  PRESETS,
} from "./data";
import {
  Home,
  Plus,
  Divide,
  ChevronRight,
  Info,
  AlertTriangle,
  ArrowRightLeft,
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
const BLUE = "#356CAB";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: GrahaSlug): string {
  return grahas[slug].primary;
}

/* ─── SVG Diagram: House with three inputs ───────────────────────────────── */

function HouseDiagram({ house, values }: { house: typeof BHAVAS[0]; values: { adhipati: number; drishti: number; digbala: number } }) {
  const houseCol = grahaColor(house.lordSlug);

  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" style={{ maxHeight: 220 }}>
      {/* House box */}
      <rect x={110} y={70} width={100} height={80} rx={8} fill={`${houseCol}10`} stroke={houseCol} strokeWidth={2} />
      <text x={160} y={100} textAnchor="middle" fontSize={12} fill={INK_PRIMARY} fontWeight={700}>
        House {house.number}
      </text>
      <text x={160} y={116} textAnchor="middle" fontSize={10} fill={houseCol} fontWeight={600}>
        <IAST size="sm">{house.nameIAST}</IAST>
      </text>
      <text x={160} y={132} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
        {house.english}
      </text>

      {/* Lord input (top) */}
      <line x1={160} y1={30} x2={160} y2={70} stroke={BLUE} strokeWidth={2} markerEnd="url(#arrowBlue)" />
      <rect x={100} y={5} width={120} height={24} rx={5} fill={`${BLUE}10`} stroke={`${BLUE}40`} strokeWidth={1} />
      <text x={160} y={21} textAnchor="middle" fontSize={9} fill={BLUE} fontWeight={600}>
        Lord: <IAST size="sm">{house.nameIAST}</IAST> ({values.adhipati.toFixed(0)}v)
      </text>

      {/* Aspect input (left) */}
      <line x1={50} y1={110} x2={110} y2={110} stroke={GREEN} strokeWidth={2} markerEnd="url(#arrowGreen)" />
      <rect x={5} y={98} width={42} height={24} rx={5} fill={`${GREEN}10`} stroke={`${GREEN}40`} strokeWidth={1} />
      <text x={26} y={114} textAnchor="middle" fontSize={8} fill={GREEN} fontWeight={600}>
        +{values.drishti.toFixed(0)}v
      </text>

      {/* Direction input (right) */}
      <line x1={270} y1={110} x2={210} y2={110} stroke={GOLD_ACCENT} strokeWidth={2} markerEnd="url(#arrowGold)" />
      <rect x={273} y={98} width={42} height={24} rx={5} fill={`${GOLD_ACCENT}10`} stroke={`${GOLD_ACCENT}40`} strokeWidth={1} />
      <text x={294} y={114} textAnchor="middle" fontSize={8} fill={GOLD_ACCENT} fontWeight={600}>
        +{values.digbala.toFixed(0)}v
      </text>

      {/* Direction label */}
      <text x={294} y={145} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        {house.direction}
      </text>

      {/* Legend */}
      <g transform="translate(70, 175)">
        <rect x={0} y={0} width={10} height={8} rx={2} fill={BLUE} opacity={0.5} />
        <text x={16} y={7} fontSize={8} fill={INK_MUTED}>Bhāvādhipati</text>
        <rect x={80} y={0} width={10} height={8} rx={2} fill={GREEN} opacity={0.5} />
        <text x={96} y={7} fontSize={8} fill={INK_MUTED}>Bhāva-dṛṣṭi</text>
        <rect x={160} y={0} width={10} height={8} rx={2} fill={GOLD_ACCENT} opacity={0.5} />
        <text x={176} y={7} fontSize={8} fill={INK_MUTED}>Bhāva-digbala</text>
      </g>

      <defs>
        <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 L1,3 Z" fill={BLUE} />
        </marker>
        <marker id="arrowGreen" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 L1,3 Z" fill={GREEN} />
        </marker>
        <marker id="arrowGold" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 L1,3 Z" fill={GOLD_ACCENT} />
        </marker>
      </defs>
    </svg>
  );
}

/* ─── SVG Diagram: Ṣaḍbala vs Bhāva Bala parallel ────────────────────────── */

function ParallelComparison() {
  const chartW = 420;
  const chartH = 160;

  return (
    <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto" style={{ maxHeight: 180 }}>
      <text x={chartW / 2} y={16} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>
        Planet strength vs. House strength
      </text>

      {/* Ṣaḍbala column */}
      <g transform="translate(30, 28)">
        <rect x={0} y={0} width={160} height={120} rx={8} fill={`${BLUE}06`} stroke={`${BLUE}30`} strokeWidth={1.5} />
        <text x={80} y={22} textAnchor="middle" fontSize={11} fill={BLUE} fontWeight={700}>
          <IAST size="sm">Ṣaḍbala</IAST>
        </text>
        <text x={80} y={38} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          Planet strength
        </text>
        <text x={80} y={56} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          6 components
        </text>
        <text x={80} y={72} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          Sthāna + Dik + Kāla
        </text>
        <text x={80} y={88} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          + Cheṣṭā + Naisargika
        </text>
        <text x={80} y={104} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          + Dṛk
        </text>
      </g>

      {/* Parallel arrows */}
      <text x={210} y={75} textAnchor="middle" fontSize={10} fill={GOLD_ACCENT} fontWeight={600}>
        mirrors
      </text>
      <text x={210} y={90} textAnchor="middle" fontSize={10} fill={GOLD_ACCENT} fontWeight={600}>
        →
      </text>
      <text x={210} y={105} textAnchor="middle" fontSize={10} fill={GOLD_ACCENT} fontWeight={600}>
        parallels
      </text>

      {/* Bhāva Bala column */}
      <g transform="translate(230, 28)">
        <rect x={0} y={0} width={160} height={120} rx={8} fill={`${GREEN}06`} stroke={`${GREEN}30`} strokeWidth={1.5} />
        <text x={80} y={22} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={700}>
          <IAST size="sm">Bhāva Bala</IAST>
        </text>
        <text x={80} y={38} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
          House strength
        </text>
        <text x={80} y={56} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          3 components
        </text>
        <text x={80} y={72} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          Bhāvādhipati
        </text>
        <text x={80} y={88} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          + Bhāva-dṛṣṭi
        </text>
        <text x={80} y={104} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
          + Bhāva-digbala
        </text>
      </g>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function BhavaBalaCalculator() {
  const [houseNumber, setHouseNumber] = useState(10);
  const [values, setValues] = useState({ adhipati: 180, drishti: 30, digbala: 40 });

  const house = BHAVAS.find((b) => b.number === houseNumber)!;
  const totalVirupas = values.adhipati + values.drishti + values.digbala;
  const totalRupas = totalVirupas / 60;

  function updateValue(key: keyof typeof values, val: number) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setHouseNumber(p.houseNumber);
    setValues({ ...p.values });
  }

  const houseCol = grahaColor(house.lordSlug);

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Home size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST size="md">Bhāva Bala</IAST>{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 600 }}>
              Calculator
            </span>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            House strength — the three-component parallel to ṣaḍbala.
          </p>
        </div>
      </div>

      {/* ── House selector ───────────────────────────────────────────────── */}
      <div
        className="flex flex-wrap gap-2 p-3 rounded-lg"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        {BHAVAS.map((b) => {
          const active = b.number === houseNumber;
          const col = grahaColor(b.lordSlug);
          return (
            <button
              key={b.number}
              onClick={() => setHouseNumber(b.number)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
              style={{
                background: active ? `${col}10` : "transparent",
                color: active ? col : INK_SECONDARY,
                border: `1.5px solid ${active ? `${col}40` : HAIRLINE}`,
                fontWeight: active ? 600 : 500,
              }}
            >
              <span className="text-xs font-mono font-bold" style={{ opacity: active ? 1 : 0.6 }}>
                {b.number}
              </span>
              <IAST size="sm">{b.nameIAST}</IAST>
            </button>
          );
        })}
      </div>

      {/* ── Selected house card ──────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderLeft: `3px solid ${houseCol}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full" style={{ background: houseCol }} />
          <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
            House {house.number} — <IAST size="md">{house.nameIAST}</IAST>
            <span className="ml-2" style={{ color: INK_MUTED }}>
              <Devanagari size="sm" style={{ fontSize: "16px", opacity: 0.7 }}>
                {house.nameDevanagari}
              </Devanagari>
            </span>
          </span>
        </div>
        <p className="text-sm" style={{ color: INK_SECONDARY }}>
          {house.english} — {house.significations}
        </p>
        <div className="flex items-center gap-4 text-xs" style={{ color: INK_MUTED }}>
          <span>
            Lord:{" "}
            <strong style={{ color: INK_SECONDARY }}>
              <IAST size="sm">{grahas[house.lordSlug].iast}</IAST>
            </strong>
          </span>
          <span>
            Direction:{" "}
            <strong style={{ color: INK_SECONDARY }}>{house.direction}</strong>
          </span>
        </div>
      </div>

      {/* ── House diagram ────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Home size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            The Three Inputs on a House
          </span>
        </div>
        <HouseDiagram house={house} values={values} />
      </div>

      {/* ── Component inputs ─────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Layers size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Enter the Three Components (virūpas)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BHAVA_COMPONENTS.map((comp) => {
            const val = values[comp.key as keyof typeof values];
            const parallel = PARALLELS.find((p) => p.bhavaKey === comp.key)!;
            const col = comp.key === "adhipati" ? BLUE : comp.key === "drishti" ? GREEN : GOLD_ACCENT;
            return (
              <div
                key={comp.key}
                className="rounded-lg p-3 space-y-2"
                style={{ background: `${col}06`, border: `1px solid ${col}25` }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: col }}>
                    <IAST size="sm">{comp.nameIAST}</IAST>
                  </span>
                </div>
                <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                  {comp.description}
                </p>
                <p className="text-xs" style={{ color: INK_MUTED }}>
                  <ArrowRightLeft size={10} className="inline mr-1" />
                  {parallel.shadbalaIAST}
                </p>
                <input
                  type="number"
                  step="1"
                  value={Math.round(val)}
                  onChange={(e) => updateValue(comp.key as keyof typeof values, Number(e.target.value))}
                  className="w-full rounded-lg px-2.5 py-2 text-sm font-mono"
                  style={{ background: "var(--gl-surface-2, #F5EDD8)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Total card ───────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
          borderLeft: `3px solid ${GREEN}`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-base font-semibold" style={{ color: INK_PRIMARY }}>
            Total <IAST size="sm">Bhāva Bala</IAST>
          </span>
          <span className="text-lg font-bold font-mono" style={{ color: GREEN }}>
            {totalRupas.toFixed(2)} rūpas
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm" style={{ color: INK_SECONDARY }}>
          <span>
            <strong>{totalVirupas.toFixed(0)}</strong> virūpas
          </span>
          <Divide size={14} style={{ color: INK_MUTED }} />
          <span>60</span>
          <span>=</span>
          <span className="font-bold font-mono" style={{ color: GREEN }}>
            {totalRupas.toFixed(2)} rūpas
          </span>
        </div>
      </div>

      {/* ── Parallel comparison diagram ──────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <ArrowRightLeft size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Parallel to <IAST size="sm">Ṣaḍbala</IAST>
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Bhāva bala reuses the planet-strength logic. Bhāva-dṛṣṭi mirrors dṛk bala; bhāva-digbala mirrors dik bala.
        </p>
        <ParallelComparison />
      </div>

      {/* ── Source-fork banner ───────────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <AlertTriangle size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Source-fork: the component set varies
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            The three-component set (lord + aspect + direction) is the most widely taught, but some texts expand it (e.g. adding occupant strength). Take exact figures from a verified engine.
          </p>
        </div>
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
            The precise bhāvādhipati, bhāva-dṛṣṭi, and bhāva-digbala values are computed from the chart. This calculator uses illustrative inputs for concept-teaching.
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
