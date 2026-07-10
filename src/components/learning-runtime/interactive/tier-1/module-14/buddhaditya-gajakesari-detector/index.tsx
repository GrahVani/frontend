"use client";

/**
 * Buddhāditya-Gaja-Kesari Detector — Lesson 14.4.3 Interactive
 *
 * §7 interactive revisiting both common yogas with depth:
 * 1. Buddhāditya — Sun + Mercury same sign, combustion orb nuance
 * 2. Gaja-Kesari — Jupiter in kendra (1/4/7/10) from Moon, NOT 5th/9th
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  COMBUSTION_ORB,
  DIGNITIES,
  PRESETS,
  checkBuddhaditya,
  checkGajaKesari,
  getDistance,
  isKendraFromMoon,
  isTrikonaFromMoon,
} from "./data";
import type { Dignity } from "./data";
import {
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Flame,
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
const SUN_COLOR = "#D99622";
const MERCURY_COLOR = "#2F7D55";
const JUPITER_COLOR = "#C8841E";
const MOON_COLOR = "#6D7FA8";

/* ─── SVG: Buddhāditya orb diagram ───────────────────────────────────────── */

function BuddhadtiyaOrb({ sunDeg, mercuryDeg }: { sunDeg: number; mercuryDeg: number }) {
  const w = 360;
  const h = 180;
  const cx = w / 2;
  const cy = h / 2 + 8;
  const r = 55;
  const separation = Math.abs(sunDeg - mercuryDeg);
  const sameSign = Math.floor(sunDeg / 30) === Math.floor(mercuryDeg / 30);
  const combust = separation <= COMBUSTION_ORB;

  // Map degrees to positions on a line
  const degToX = (deg: number) => cx + ((deg % 30) - 15) * 5;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 200 }}>
      <text x={cx} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Buddhāditya — same-sign check + combustion orb
      </text>

      {/* Sign boundary markers */}
      <line x1={cx - 75} y1={cy} x2={cx + 75} y2={cy} stroke={HAIRLINE} strokeWidth={2} />
      <line x1={cx - 75} y1={cy - 6} x2={cx - 75} y2={cy + 6} stroke={INK_MUTED} strokeWidth={1} />
      <line x1={cx + 75} y1={cy - 6} x2={cx + 75} y2={cy + 6} stroke={INK_MUTED} strokeWidth={1} />
      <text x={cx - 75} y={cy + 20} textAnchor="middle" fontSize={8} fill={INK_MUTED}>Sign start</text>
      <text x={cx + 75} y={cy + 20} textAnchor="middle" fontSize={8} fill={INK_MUTED}>Sign end</text>

      {/* Combustion zone */}
      <rect x={cx - COMBUSTION_ORB * 2.5} y={cy - 18} width={COMBUSTION_ORB * 5} height={36} rx={4} fill={VERMILION} fillOpacity={0.08} stroke={VERMILION} strokeWidth={1} strokeDasharray="4 3" />
      <text x={cx} y={cy - 22} textAnchor="middle" fontSize={8} fill={VERMILION}>Combustion zone (~{COMBUSTION_ORB}°)</text>

      {/* Sun */}
      <circle cx={cx} cy={cy} r={10} fill={SUN_COLOR} />
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fontWeight={700} fill="#fff">Su</text>

      {/* Mercury */}
      <circle
        cx={cx + (separation <= 15 ? separation * 2.5 : separation <= 28 ? separation * 2.2 : 60)}
        cy={cy}
        r={8}
        fill={MERCURY_COLOR}
      />
      <text
        x={cx + (separation <= 15 ? separation * 2.5 : separation <= 28 ? separation * 2.2 : 60)}
        y={cy + 3}
        textAnchor="middle"
        fontSize={7}
        fontWeight={700}
        fill="#fff"
      >
        Me
      </text>

      {/* Separation label */}
      <text x={cx} y={cy + 38} textAnchor="middle" fontSize={10} fontWeight={700} fill={combust ? VERMILION : sameSign ? GREEN : INK_MUTED}>
        {separation.toFixed(1)}° {sameSign ? (combust ? "— combust" : "— uncombust ✓") : "— different signs"}
      </text>
    </svg>
  );
}

/* ─── SVG: Gaja-Kesari kendra diagram ────────────────────────────────────── */

function GajaKesariDiagram({ moonHouse, jupiterHouse }: { moonHouse: number; jupiterHouse: number }) {
  const w = 320;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2;
  const r = 110;

  const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const polar = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const distance = getDistance(moonHouse, jupiterHouse);
  const isKendra = isKendraFromMoon(distance);
  const isTrikona = isTrikonaFromMoon(distance);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 340 }}>
      <text x={cx} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Gaja-Kesari — kendras from the Moon
      </text>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 28} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" />

      {/* House positions */}
      {houses.map((h) => {
        const pos = polar(h);
        const dist = getDistance(moonHouse, h);
        const isK = isKendraFromMoon(dist);
        const isT = isTrikonaFromMoon(dist);
        const isMoon = h === moonHouse;
        const isJupiter = h === jupiterHouse;

        return (
          <g key={h}>
            {/* House tick */}
            <line x1={cx} y1={cy} x2={pos.x} y2={pos.y} stroke={isK ? GREEN : HAIRLINE} strokeWidth={isK ? 2 : 1} />
            {/* House label */}
            <text
              x={polar(h).x * 0.82 + cx * 0.18}
              y={polar(h).y * 0.82 + cy * 0.18 + 4}
              textAnchor="middle"
              fontSize={isK ? 11 : 9}
              fontWeight={isK ? 800 : 600}
              fill={isMoon ? MOON_COLOR : isJupiter ? JUPITER_COLOR : isK ? GREEN : isT ? AMBER : INK_MUTED}
            >
              {isMoon ? "Mo" : isJupiter ? "Ju" : `H${h}`}
            </text>
          </g>
        );
      })}

      {/* Moon at center */}
      <circle cx={cx} cy={cy} r={18} fill={MOON_COLOR} opacity={0.9} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">Moon</text>

      {/* Jupiter marker */}
      {jupiterHouse !== moonHouse && (
        <g>
          <circle cx={polar(jupiterHouse).x * 0.72 + cx * 0.28} cy={polar(jupiterHouse).y * 0.72 + cy * 0.28} r={14} fill={JUPITER_COLOR} opacity={0.9} />
          <text x={polar(jupiterHouse).x * 0.72 + cx * 0.28} y={polar(jupiterHouse).y * 0.72 + cy * 0.28 + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill="#fff">Ju</text>
        </g>
      )}

      {/* Result label */}
      <text x={cx} y={cy + r + 24} textAnchor="middle" fontSize={10} fontWeight={700} fill={isKendra ? GREEN : isTrikona ? AMBER : INK_MUTED}>
        Jupiter is {distance === 1 ? "conjunct" : distance + "th from"} Moon
        {isKendra ? " — KENDRA ✓" : isTrikona ? " — trikoṇa ✗ (not kendra)" : ""}
      </text>

      {/* Legend */}
      <g transform={`translate(20, ${h - 36})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.2} stroke={GREEN} strokeWidth={1} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Kendra (1/4/7/10)</text>
        <rect x={95} y={0} width={10} height={10} rx={2} fill={AMBER} fillOpacity={0.15} stroke={AMBER} strokeWidth={1} />
        <text x={111} y={9} fontSize={8} fill={INK_SECONDARY}>Trikoṇa (1/5/9)</text>
      </g>
    </svg>
  );
}

/* ─── Strength badge ─────────────────────────────────────────────────────── */

function StrengthBadge({ strength }: { strength: "strong" | "moderate" | "weak" | "absent" }) {
  const colors: Record<string, string> = {
    strong: GREEN,
    moderate: AMBER,
    weak: INK_MUTED,
    absent: VERMILION,
  };
  const col = colors[strength];
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
      style={{ background: `${col}15`, color: col, border: `1px solid ${col}40` }}
    >
      {strength}
    </span>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function BuddhadityaGajakesariDetector() {
  // Buddhāditya state
  const [sunLongitude, setSunLongitude] = useState(125);
  const [mercuryLongitude, setMercuryLongitude] = useState(140);
  const [sunDignity, setSunDignity] = useState<Dignity>("own");
  const [mercuryDignity, setMercuryDignity] = useState<Dignity>("own");

  // Gaja-Kesari state
  const [moonHouse, setMoonHouse] = useState(4);
  const [jupiterHouse, setJupiterHouse] = useState(7);
  const [moonDignity, setMoonDignity] = useState<Dignity>("exalted");
  const [jupiterDignity, setJupiterDignity] = useState<Dignity>("exalted");

  const buddha = checkBuddhaditya(sunLongitude, mercuryLongitude, sunDignity, mercuryDignity);
  const gk = checkGajaKesari(moonHouse, jupiterHouse, moonDignity, jupiterDignity);

  function applyPreset(key: string) {
    const p = PRESETS.find((pre) => pre.key === key);
    if (!p) return;
    setSunLongitude(p.sunLongitude);
    setMercuryLongitude(p.mercuryLongitude);
    setSunDignity(p.sunDignity);
    setMercuryDignity(p.mercuryDignity);
    setMoonHouse(p.moonHouse);
    setJupiterHouse(p.jupiterHouse);
    setMoonDignity(p.moonDignity);
    setJupiterDignity(p.jupiterDignity);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Sparkles size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Buddhāditya-Gaja-Kesari Detector
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Two common yogas — handle combustion for one, kendra-from-Moon for the other.
          </p>
        </div>
      </div>

      {/* ── Presets ──────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Worked Presets</span>
          <button
            onClick={() => applyPreset("clean-buddhaditya")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className="text-left rounded-lg p-3 transition-all hover:shadow-sm"
              style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}20`, borderLeft: `3px solid ${GOLD_ACCENT}` }}
            >
              <p className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>{p.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{p.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Buddhāditya Panel ────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Sun size={16} style={{ color: SUN_COLOR }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Buddhāditya — Sun + Mercury Intelligence Yoga
          </span>
          <StrengthBadge strength={buddha.strength} />
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Sun and Mercury in the same sign → intellect and sharp speech. But Mercury is often combust.
          Best form: same sign, outside the combustion orb (~{COMBUSTION_ORB}°).
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <BuddhadtiyaOrb sunDeg={sunLongitude} mercuryDeg={mercuryLongitude} />

          <div className="space-y-3">
            {/* Sun controls */}
            <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${SUN_COLOR}08`, border: `1px solid ${SUN_COLOR}25` }}>
              <p className="text-xs font-bold" style={{ color: SUN_COLOR }}>
                <IAST size="sm">Sūrya</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">सूर्य</Devanagari></span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: INK_MUTED }}>Longitude:</span>
                <input
                  type="range" min={0} max={360} value={sunLongitude}
                  onChange={(e) => setSunLongitude(Number(e.target.value))}
                  className="flex-1" style={{ accentColor: SUN_COLOR }}
                />
                <span className="text-xs font-mono" style={{ color: INK_SECONDARY }}>{sunLongitude}°</span>
              </div>
              <select value={sunDignity} onChange={(e) => setSunDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>

            {/* Mercury controls */}
            <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${MERCURY_COLOR}06`, border: `1px solid ${MERCURY_COLOR}25` }}>
              <p className="text-xs font-bold" style={{ color: MERCURY_COLOR }}>
                <IAST size="sm">Budha</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">बुध</Devanagari></span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: INK_MUTED }}>Longitude:</span>
                <input
                  type="range" min={0} max={360} value={mercuryLongitude}
                  onChange={(e) => setMercuryLongitude(Number(e.target.value))}
                  className="flex-1" style={{ accentColor: MERCURY_COLOR }}
                />
                <span className="text-xs font-mono" style={{ color: INK_SECONDARY }}>{mercuryLongitude}°</span>
              </div>
              <select value={mercuryDignity} onChange={(e) => setMercuryDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Buddhāditya result */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            background: buddha.clean ? `${GREEN}08` : buddha.present ? `${AMBER}06` : `${VERMILION}06`,
            border: `1px solid ${buddha.clean ? `${GREEN}30` : buddha.present ? `${AMBER}25` : `${VERMILION}25`}`,
            borderLeft: `3px solid ${buddha.clean ? GREEN : buddha.present ? AMBER : VERMILION}`,
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {buddha.clean ? <CheckCircle2 size={16} style={{ color: GREEN }} /> : buddha.combust ? <Flame size={16} style={{ color: VERMILION }} /> : <XCircle size={16} style={{ color: VERMILION }} />}
            <span className="text-sm font-bold" style={{ color: buddha.clean ? GREEN : buddha.present ? AMBER : VERMILION }}>
              {buddha.clean ? "Clean Buddhāditya — uncombust, same sign" : buddha.combust ? "Combust Buddhāditya — weakened" : "Buddhāditya absent"}
            </span>
            <StrengthBadge strength={buddha.strength} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div className="flex items-center gap-2">
              {buddha.sameSign ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <XCircle size={12} style={{ color: VERMILION }} />}
              <span className="text-xs" style={{ color: buddha.sameSign ? INK_SECONDARY : INK_MUTED }}>Same sign: {buddha.sameSign ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center gap-2">
              {!buddha.combust ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <Flame size={12} style={{ color: VERMILION }} />}
              <span className="text-xs" style={{ color: !buddha.combust ? INK_SECONDARY : INK_MUTED }}>Combust: {buddha.combust ? `Yes (${buddha.separation.toFixed(1)}°)` : `No (${buddha.separation.toFixed(1)}°)`}</span>
            </div>
            <div className="flex items-center gap-2">
              {buddha.sunDignityStrong ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <XCircle size={12} style={{ color: INK_MUTED }} />}
              <span className="text-xs" style={{ color: buddha.sunDignityStrong ? INK_SECONDARY : INK_MUTED }}>Sun strong</span>
            </div>
            <div className="flex items-center gap-2">
              {buddha.mercuryDignityStrong ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <XCircle size={12} style={{ color: INK_MUTED }} />}
              <span className="text-xs" style={{ color: buddha.mercuryDignityStrong ? INK_SECONDARY : INK_MUTED }}>Mercury strong</span>
            </div>
          </div>
          {buddha.notes.length > 0 && (
            <div className="space-y-0.5">
              {buddha.notes.map((note, i) => (
                <p key={i} className="text-[10px]" style={{ color: INK_MUTED }}>• {note}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Gaja-Kesari Panel ────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Moon size={16} style={{ color: MOON_COLOR }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Gaja-Kesari — Jupiter from the Moon
          </span>
          <StrengthBadge strength={gk.strength} />
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Jupiter in a kendra (1st/4th/7th/10th) from the Moon → wisdom and repute.
          <strong> Not</strong> the 5th or 9th — those are trikoṇas, not kendras.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <GajaKesariDiagram moonHouse={moonHouse} jupiterHouse={jupiterHouse} />

          <div className="space-y-3">
            {/* Moon controls */}
            <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${MOON_COLOR}08`, border: `1px solid ${MOON_COLOR}25` }}>
              <p className="text-xs font-bold" style={{ color: MOON_COLOR }}>
                <IAST size="sm">Candra</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">चन्द्र</Devanagari></span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
                <select value={moonHouse} onChange={(e) => setMoonHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>H{h}</option>
                  ))}
                </select>
              </div>
              <select value={moonDignity} onChange={(e) => setMoonDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>

            {/* Jupiter controls */}
            <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${JUPITER_COLOR}08`, border: `1px solid ${JUPITER_COLOR}25` }}>
              <p className="text-xs font-bold" style={{ color: JUPITER_COLOR }}>
                <IAST size="sm">Guru</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">गुरु</Devanagari></span>
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
                <select value={jupiterHouse} onChange={(e) => setJupiterHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>H{h}</option>
                  ))}
                </select>
              </div>
              <select value={jupiterDignity} onChange={(e) => setJupiterDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Gaja-Kesari result */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            background: gk.isKendra ? `${GREEN}08` : gk.isTrikona ? `${AMBER}06` : `${VERMILION}06`,
            border: `1px solid ${gk.isKendra ? `${GREEN}30` : gk.isTrikona ? `${AMBER}25` : `${VERMILION}25`}`,
            borderLeft: `3px solid ${gk.isKendra ? GREEN : gk.isTrikona ? AMBER : VERMILION}`,
          }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            {gk.isKendra ? <CheckCircle2 size={16} style={{ color: GREEN }} /> : <XCircle size={16} style={{ color: VERMILION }} />}
            <span className="text-sm font-bold" style={{ color: gk.isKendra ? GREEN : VERMILION }}>
              Gaja-Kesari {gk.isKendra ? "PRESENT" : "NOT PRESENT"}
              {gk.isTrikona && !gk.isKendra ? " — trikoṇa misread" : ""}
            </span>
            <StrengthBadge strength={gk.strength} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            <div className="flex items-center gap-2">
              {gk.isKendra ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <XCircle size={12} style={{ color: VERMILION }} />}
              <span className="text-xs" style={{ color: gk.isKendra ? INK_SECONDARY : INK_MUTED }}>Kendra from Moon: {gk.isKendra ? "Yes" : "No"}</span>
            </div>
            <div className="flex items-center gap-2">
              {!gk.isTrikona || gk.isKendra ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <AlertTriangle size={12} style={{ color: AMBER }} />}
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Trikoṇa from Moon: {gk.isTrikona ? "Yes (not enough)" : "No"}</span>
            </div>
            <div className="flex items-center gap-2">
              {gk.moonDignityStrong ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <XCircle size={12} style={{ color: INK_MUTED }} />}
              <span className="text-xs" style={{ color: gk.moonDignityStrong ? INK_SECONDARY : INK_MUTED }}>Moon strong</span>
            </div>
            <div className="flex items-center gap-2">
              {gk.jupiterDignityStrong ? <CheckCircle2 size={12} style={{ color: GREEN }} /> : <XCircle size={12} style={{ color: INK_MUTED }} />}
              <span className="text-xs" style={{ color: gk.jupiterDignityStrong ? INK_SECONDARY : INK_MUTED }}>Jupiter strong</span>
            </div>
          </div>
          {gk.notes.length > 0 && (
            <div className="space-y-0.5">
              {gk.notes.map((note, i) => (
                <p key={i} className="text-[10px]" style={{ color: INK_MUTED }}>• {note}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Common mistakes ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        {[
          { title: "Ignoring Mercury's combustion", fix: "Best form = same sign, outside ~12–14° orb. Combust = weakened." },
          { title: "Wrong Gaja-Kesari positions", fix: "Only kendras from Moon (1/4/7/10). 5th/9th are trikoṇas — do not count." },
          { title: "Treating presence as enough", fix: "Both yogas are common — grade strength and dignity before reading." },
        ].map((m, i) => (
          <div
            key={i}
            className="rounded-lg p-3 flex items-start gap-2.5"
            style={{ background: `${AMBER}05`, border: `1px solid ${AMBER}18`, borderLeft: `3px solid ${AMBER}` }}
          >
            <AlertTriangle size={14} style={{ color: AMBER, marginTop: 1, flexShrink: 0 }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: AMBER }}>{m.title}</p>
              <p className="text-[11px] mt-0.5" style={{ color: INK_SECONDARY }}>{m.fix}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Honest note ──────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <Info size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Both are common — strength decides value
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            Sun-Mercury conjunctions and Jupiter-in-kendra-from-Moon occur in a large fraction of charts.
            A <strong>weak</strong> or <strong>combust</strong> Buddhāditya, or a <strong>debilitated</strong> Gaja-Kesari, is background noise.
            Grade the participating planets' strength and dignity (Chapter 7) before giving the yoga weight in a reading.
          </p>
        </div>
      </div>
    </div>
  );
}
