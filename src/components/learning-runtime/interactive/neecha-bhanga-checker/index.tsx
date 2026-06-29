"use client";

/**
 * Neecha-Bhaṅga Checker — Lesson 14.5.1 Interactive
 *
 * §7 interactive: test the 5 classical cancellation conditions for a
 * debilitated planet. Planet selector + house controls + aspect/conjunction
 * toggles + strength slider. Rescue-chain SVG + house-ring diagram.
 * Honest debate: neutralisation vs extraordinary success.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import {
  PLANETS,
  SIGN_LORDS,
  EXALTED_IN_SIGN,
  KENDRA_HOUSES,
  TRIKONA_HOUSES,
  DUSTHANA_HOUSES,
  checkNeechaBhanga,
  PRESETS,
} from "./data";
import type { PlanetKey } from "./data";
import {
  Shield,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Eye,
  ChevronRight,
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

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function grahaColor(slug: string) {
  return (grahas as Record<string, { primary: string }>)[slug]?.primary ?? INK_MUTED;
}

/* ─── SVG: Rescue chain diagram ──────────────────────────────────────────── */

function RescueChain({
  planet,
  dispositorHouse,
  exaltedPlanetHouse,
  debilitatedPlanetHouse,
  dispositorAspects,
  dispositorConjunct,
  exaltedAspects,
  exaltedConjunct,
}: {
  planet: PlanetKey;
  dispositorHouse: number;
  exaltedPlanetHouse: number;
  debilitatedPlanetHouse: number;
  dispositorAspects: boolean;
  dispositorConjunct: boolean;
  exaltedAspects: boolean;
  exaltedConjunct: boolean;
}) {
  const pInfo = PLANETS.find((p) => p.key === planet)!;
  const dispositor = SIGN_LORDS[pInfo.debilitationSign];
  const exalted = EXALTED_IN_SIGN[pInfo.debilitationSign];
  const w = 420;
  const h = 200;

  // Node positions
  const fallenX = 70;
  const signX = 210;
  const dispX = 350;
  const exaltX = 350;
  const row1Y = 70;
  const row2Y = 150;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 200 }}>
      <text x={w / 2} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Rescue chain: fallen planet → debilitation sign → rescue agents
      </text>

      {/* Fallen planet node */}
      <rect x={fallenX - 50} y={row1Y - 28} width={100} height={56} rx={10} fill={SURFACE} stroke={VERMILION} strokeWidth={2} />
      <text x={fallenX} y={row1Y - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={VERMILION}>
        {pInfo.iast}
      </text>
      <text x={fallenX} y={row1Y + 8} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        H{debilitatedPlanetHouse} (fallen)
      </text>

      {/* Arrow: fallen → sign */}
      <line x1={fallenX + 50} y1={row1Y} x2={signX - 50} y2={row1Y} stroke={HAIRLINE} strokeWidth={1.5} />
      <polygon points={`${signX - 50},${row1Y - 4} ${signX - 50},${row1Y + 4} ${signX - 44},${row1Y}`} fill={HAIRLINE} />

      {/* Debilitation sign node */}
      <rect x={signX - 50} y={row1Y - 28} width={100} height={56} rx={10} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={signX} y={row1Y - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill={GOLD_ACCENT}>
        {pInfo.debilitationSignIAST}
      </text>
      <text x={signX} y={row1Y + 8} textAnchor="middle" fontSize={8} fontFamily="var(--font-cormorant), serif" fontStyle="italic" fill={INK_MUTED}>
        Sign {pInfo.debilitationSign}
      </text>

      {/* Arrow: sign → dispositor */}
      <line x1={signX + 50} y1={row1Y - 12} x2={dispX - 50} y2={row1Y - 12} stroke={HAIRLINE} strokeWidth={1.5} />
      <polygon points={`${dispX - 50},${row1Y - 16} ${dispX - 50},${row1Y - 8} ${dispX - 44},${row1Y - 12}`} fill={HAIRLINE} />
      <text x={(signX + dispX) / 2} y={row1Y - 18} textAnchor="middle" fontSize={7} fill={INK_MUTED}>lord</text>

      {/* Arrow: sign → exalted planet */}
      <line x1={signX + 50} y1={row1Y + 12} x2={exaltX - 50} y2={row1Y + 12} stroke={HAIRLINE} strokeWidth={1.5} />
      <polygon points={`${exaltX - 50},${row1Y + 8} ${exaltX - 50},${row1Y + 16} ${exaltX - 44},${row1Y + 12}`} fill={HAIRLINE} />
      <text x={(signX + exaltX) / 2} y={row1Y + 24} textAnchor="middle" fontSize={7} fill={INK_MUTED}>exalted</text>

      {/* Dispositor node */}
      <rect x={dispX - 44} y={row1Y - 50} width={88} height={48} rx={8} fill={SURFACE} stroke={grahaColor(dispositor.grahaSlug)} strokeWidth={2} />
      <text x={dispX} y={row1Y - 30} textAnchor="middle" fontSize={10} fontWeight={700} fill={grahaColor(dispositor.grahaSlug)}>
        {dispositor.iast}
      </text>
      <text x={dispX} y={row1Y - 16} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        H{dispositorHouse}
      </text>

      {/* Exalted planet node */}
      <rect x={exaltX - 44} y={row1Y + 10} width={88} height={48} rx={8} fill={SURFACE} stroke={grahaColor(exalted.grahaSlug)} strokeWidth={2} />
      <text x={exaltX} y={row1Y + 30} textAnchor="middle" fontSize={10} fontWeight={700} fill={grahaColor(exalted.grahaSlug)}>
        {exalted.iast}
      </text>
      <text x={exaltX} y={row1Y + 44} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        H{exaltedPlanetHouse}
      </text>

      {/* Rescue arrows back to fallen planet (if active) */}
      {(dispositorAspects || dispositorConjunct) && (
        <path
          d={`M ${dispX - 44} ${row1Y - 26} Q ${dispX - 90} ${row1Y - 20} ${fallenX + 50} ${row1Y - 10}`}
          fill="none"
          stroke={grahaColor(dispositor.grahaSlug)}
          strokeWidth={1.5}
          strokeDasharray={dispositorConjunct ? undefined : "4 3"}
        />
      )}
      {(exaltedAspects || exaltedConjunct) && (
        <path
          d={`M ${exaltX - 44} ${row1Y + 34} Q ${exaltX - 90} ${row1Y + 40} ${fallenX + 50} ${row1Y + 10}`}
          fill="none"
          stroke={grahaColor(exalted.grahaSlug)}
          strokeWidth={1.5}
          strokeDasharray={exaltedConjunct ? undefined : "4 3"}
        />
      )}

      {/* Legend */}
      <g transform="translate(16, 180)">
        <line x1={0} y1={0} x2={16} y2={0} stroke={INK_MUTED} strokeWidth={1.5} />
        <text x={22} y={4} fontSize={8} fill={INK_MUTED}>Aspect</text>
        <line x1={60} y1={0} x2={76} y2={0} stroke={INK_MUTED} strokeWidth={1.5} strokeDasharray="4 3" />
        <text x={82} y={4} fontSize={8} fill={INK_MUTED}>Aspect (dashed)</text>
        <line x1={160} y1={0} x2={176} y2={0} stroke={INK_MUTED} strokeWidth={2} />
        <text x={182} y={4} fontSize={8} fill={INK_MUTED}>Conjunction</text>
      </g>
    </svg>
  );
}

/* ─── SVG: House position ring ───────────────────────────────────────────── */

function HouseRing({
  dispositorHouse,
  exaltedPlanetHouse,
  debilitatedPlanetHouse,
  moonHouse,
}: {
  dispositorHouse: number;
  exaltedPlanetHouse: number;
  debilitatedPlanetHouse: number;
  moonHouse: number;
}) {
  const w = 280;
  const h = 280;
  const cx = w / 2;
  const cy = h / 2;
  const r = 90;

  const polar = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const houses = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 280 }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        House positions (kendras highlighted)
      </text>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 22} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" />

      {/* House ticks and labels */}
      {houses.map((h) => {
        const pos = polar(h);
        const isKendra = KENDRA_HOUSES.includes(h);
        const isTrikona = TRIKONA_HOUSES.includes(h);
        const isDusthana = DUSTHANA_HOUSES.includes(h);

        return (
          <g key={h}>
            <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={isKendra ? GREEN : HAIRLINE} strokeWidth={isKendra ? 2 : 1} />
            <text
              x={pos.x * 0.85 + cx * 0.15}
              y={pos.y * 0.85 + cy * 0.15 + 4}
              textAnchor="middle"
              fontSize={isKendra ? 11 : 9}
              fontWeight={isKendra ? 800 : 600}
              fill={h === debilitatedPlanetHouse ? VERMILION : h === moonHouse ? "#6D7FA8" : isKendra ? GREEN : isTrikona ? AMBER : INK_MUTED}
            >
              {h === debilitatedPlanetHouse ? "F" : h === dispositorHouse ? "D" : h === exaltedPlanetHouse ? "E" : h === moonHouse ? "M" : `H${h}`}
            </text>
          </g>
        );
      })}

      {/* Center: lagna */}
      <circle cx={cx} cy={cy} r={20} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={GOLD_ACCENT}>Lagna</text>

      {/* Legend */}
      <g transform={`translate(20, ${h - 44})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={VERMILION} fillOpacity={0.2} stroke={VERMILION} strokeWidth={1} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Fallen (F)</text>
        <rect x={65} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.2} stroke={GREEN} strokeWidth={1} />
        <text x={81} y={9} fontSize={8} fill={INK_SECONDARY}>Dispositor (D)</text>
        <rect x={165} y={0} width={10} height={10} rx={2} fill={AMBER} fillOpacity={0.2} stroke={AMBER} strokeWidth={1} />
        <text x={181} y={9} fontSize={8} fill={INK_SECONDARY}>Exalted (E)</text>
      </g>
      <g transform={`translate(20, ${h - 28})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill="#6D7FA8" fillOpacity={0.2} stroke="#6D7FA8" strokeWidth={1} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Moon (M)</text>
        <rect x={65} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.1} stroke={GREEN} strokeWidth={1} />
        <text x={81} y={9} fontSize={8} fill={INK_SECONDARY}>Kendra</text>
      </g>
    </svg>
  );
}

/* ─── Toggle row helper ──────────────────────────────────────────────────── */

function ToggleRow({
  label,
  checked,
  onChange,
  accent,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-xs" style={{ color: INK_SECONDARY }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? (accent ?? GREEN) : HAIRLINE }}
        aria-pressed={checked}
      >
        <span
          className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
          style={{ transform: checked ? "translateX(14px)" : "translateX(2px)", marginTop: 3 }}
        />
      </button>
    </label>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function NeechaBhangaChecker() {
  const [planet, setPlanet] = useState<PlanetKey>("Saturn");
  const [dispositorHouse, setDispositorHouse] = useState(3);
  const [exaltedPlanetHouse, setExaltedPlanetHouse] = useState(4);
  const [debilitatedPlanetHouse, setDebilitatedPlanetHouse] = useState(1);
  const [moonHouse, setMoonHouse] = useState(1);
  const [dispositorAspects, setDispositorAspects] = useState(false);
  const [dispositorConjunct, setDispositorConjunct] = useState(false);
  const [exaltedAspects, setExaltedAspects] = useState(false);
  const [exaltedConjunct, setExaltedConjunct] = useState(false);
  const [mutualKendra, setMutualKendra] = useState(false);
  const [planetStrength, setPlanetStrength] = useState(75);

  const result = useMemo(
    () =>
      checkNeechaBhanga(
        planet,
        dispositorHouse,
        exaltedPlanetHouse,
        debilitatedPlanetHouse,
        moonHouse,
        dispositorAspects,
        dispositorConjunct,
        exaltedAspects,
        exaltedConjunct,
        mutualKendra,
        planetStrength,
      ),
    [
      planet,
      dispositorHouse,
      exaltedPlanetHouse,
      debilitatedPlanetHouse,
      moonHouse,
      dispositorAspects,
      dispositorConjunct,
      exaltedAspects,
      exaltedConjunct,
      mutualKendra,
      planetStrength,
    ],
  );

  const pInfo = PLANETS.find((p) => p.key === planet)!;
  const dispositor = SIGN_LORDS[pInfo.debilitationSign];
  const exalted = EXALTED_IN_SIGN[pInfo.debilitationSign];

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setPlanet(preset.planet);
    setDispositorHouse(preset.dispositorHouse);
    setExaltedPlanetHouse(preset.exaltedPlanetHouse);
    setDebilitatedPlanetHouse(preset.debilitatedPlanetHouse);
    setMoonHouse(preset.moonHouse);
    setDispositorAspects(preset.dispositorAspects);
    setDispositorConjunct(preset.dispositorConjunct);
    setExaltedAspects(preset.exaltedAspects);
    setExaltedConjunct(preset.exaltedConjunct);
    setMutualKendra(preset.mutualKendra);
    setPlanetStrength(preset.planetStrength);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Neecha-Bhaṅga Checker
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Test cancellation conditions for a debilitated planet. Any one condition suffices.
          </p>
        </div>
      </div>

      {/* Planet selector + Presets */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Select Planet</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => applyPreset("exalted-in-kendra")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        {/* Planet buttons */}
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {PLANETS.map((p) => {
            const active = p.key === planet;
            return (
              <button
                key={p.key}
                onClick={() => setPlanet(p.key)}
                className="flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-bold"
                style={{
                  background: active ? `${grahaColor(p.grahaSlug)}15` : "transparent",
                  border: `1px solid ${active ? grahaColor(p.grahaSlug) : HAIRLINE}`,
                  color: active ? grahaColor(p.grahaSlug) : INK_SECONDARY,
                }}
              >
                <span>{p.iast}</span>
                <Devanagari size="sm" style={{ fontSize: "10px", opacity: 0.7, color: active ? grahaColor(p.grahaSlug) : INK_MUTED }}>
                  {p.devanagari}
                </Devanagari>
              </button>
            );
          })}
        </div>

        {/* Planet info bar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: INK_SECONDARY }}>
          <span>
            Debilitated in:{" "}
            <strong style={{ color: VERMILION }}>
              {pInfo.debilitationSignIAST}
            </strong>{" "}
            <Devanagari size="sm" style={{ fontSize: "10px", color: INK_MUTED }}>{pInfo.debilitationSignDevanagari}</Devanagari>
          </span>
          <span>
            Dispositor:{" "}
            <strong style={{ color: grahaColor(dispositor.grahaSlug) }}>{dispositor.iast}</strong>
          </span>
          <span>
            Exalted there:{" "}
            <strong style={{ color: grahaColor(exalted.grahaSlug) }}>{exalted.iast}</strong>
          </span>
        </div>
      </div>

      {/* Controls + Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls panel */}
        <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>House Placements</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Dispositor house</span>
              <select
                value={dispositorHouse}
                onChange={(e) => setDispositorHouse(Number(e.target.value))}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>H{i + 1}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Exalted planet house</span>
              <select
                value={exaltedPlanetHouse}
                onChange={(e) => setExaltedPlanetHouse(Number(e.target.value))}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>H{i + 1}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Debilitated planet house</span>
              <select
                value={debilitatedPlanetHouse}
                onChange={(e) => setDebilitatedPlanetHouse(Number(e.target.value))}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>H{i + 1}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Moon house</span>
              <select
                value={moonHouse}
                onChange={(e) => setMoonHouse(Number(e.target.value))}
                className="w-full rounded-md px-3 py-1.5 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>H{i + 1}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Planet strength</span>
            <input
              type="range"
              min={0}
              max={100}
              value={planetStrength}
              onChange={(e) => setPlanetStrength(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs font-bold w-8 text-right" style={{ color: planetStrength >= 60 ? GREEN : planetStrength >= 30 ? AMBER : VERMILION }}>
              {planetStrength}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Aspects & Conjunctions</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ToggleRow label="Dispositor aspects fallen planet" checked={dispositorAspects} onChange={setDispositorAspects} accent={grahaColor(dispositor.grahaSlug)} />
              <ToggleRow label="Dispositor conjunct fallen planet" checked={dispositorConjunct} onChange={setDispositorConjunct} accent={grahaColor(dispositor.grahaSlug)} />
              <ToggleRow label="Exalted planet aspects fallen" checked={exaltedAspects} onChange={setExaltedAspects} accent={grahaColor(exalted.grahaSlug)} />
              <ToggleRow label="Exalted planet conjunct fallen" checked={exaltedConjunct} onChange={setExaltedConjunct} accent={grahaColor(exalted.grahaSlug)} />
              <ToggleRow label="Dispositor & exalted in mutual kendras" checked={mutualKendra} onChange={setMutualKendra} />
            </div>
          </div>
        </div>

        {/* Diagrams */}
        <div className="space-y-3">
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <RescueChain
              planet={planet}
              dispositorHouse={dispositorHouse}
              exaltedPlanetHouse={exaltedPlanetHouse}
              debilitatedPlanetHouse={debilitatedPlanetHouse}
              dispositorAspects={dispositorAspects}
              dispositorConjunct={dispositorConjunct}
              exaltedAspects={exaltedAspects}
              exaltedConjunct={exaltedConjunct}
            />
          </div>
          <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <HouseRing
              dispositorHouse={dispositorHouse}
              exaltedPlanetHouse={exaltedPlanetHouse}
              debilitatedPlanetHouse={debilitatedPlanetHouse}
              moonHouse={moonHouse}
            />
          </div>
        </div>
      </div>

      {/* Result panel */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.verdictColor}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ChevronRight size={16} style={{ color: result.verdictColor }} />
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Cancellation Result</h4>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `${result.verdictColor}15`, color: result.verdictColor }}
          >
            {result.verdictLabel}
          </span>
        </div>

        {/* Conditions grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {result.conditions.map((c) => (
            <div
              key={c.number}
              className="rounded-md p-2.5 space-y-1"
              style={{
                background: c.met ? `${GREEN}08` : "transparent",
                border: `1px solid ${c.met ? GREEN : HAIRLINE}`,
                borderLeft: `3px solid ${c.met ? GREEN : VERMILION}`,
              }}
            >
              <div className="flex items-center gap-1.5">
                {c.met ? (
                  <CheckCircle2 size={12} style={{ color: GREEN, flexShrink: 0 }} />
                ) : (
                  <XCircle size={12} style={{ color: VERMILION, flexShrink: 0 }} />
                )}
                <span className="text-xs font-semibold" style={{ color: c.met ? INK_SECONDARY : INK_MUTED }}>
                  {c.number}. {c.label}
                </span>
              </div>
              <div className="text-xs pl-5" style={{ color: INK_MUTED }}>
                {c.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        {result.notes.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {result.notes.map((n, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Honest debate panel */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>Honest Debate</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Sources <strong>disagree</strong> on the payoff. One tradition reads neecha-bhaṅga as a powerful
          <em> rāja-yoga of reversal</em> — extraordinary success. A conservative reading (K. N. Rao and others)
          holds it <strong>neutralises the harm</strong> of debilitation but does <strong>not</strong> automatically
          grant greatness. The planet must also be well-disposed (good house, strength, daśā).
        </p>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          <strong>Practice:</strong> report neecha-bhaṅga as a <strong>redemption of the debility</strong>,
          and reserve &ldquo;extraordinary success&rdquo; for cases where strength and timing genuinely support it.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Requiring an aspect", text: "A kendra placement of the dispositor or exalted-planet alone suffices. No aspect is needed for conditions 1 and 2." },
            { title: "Promising greatness automatically", text: "Neecha-bhaṅga neutralises harm; 'extraordinary' needs supporting strength and good house placement." },
            { title: "Confusing dispositor vs exaltation-planet", text: "Dispositor = lord of the debilitation sign. Exaltation-planet = the one exalted in that sign. They are usually different planets." },
          ].map((m, i) => (
            <div
              key={i}
              className="rounded-lg p-3 space-y-1.5"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}
            >
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
