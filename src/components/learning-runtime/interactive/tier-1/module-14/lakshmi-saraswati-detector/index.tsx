"use client";

/**
 * Lakshmi-Sarasvati Detector - Lesson 14.4.1 Interactive
 *
 * Section 7 interactive for detecting two deity-named special yogas:
 * 1. Lakshmi Yoga - dignified 9th lord in kendra/trikona + strong lagna lord
 * 2. Sarasvati Yoga - Me/Ju/Ve well-placed in kendra/trikona/2nd, undebilitated
 *
 * North Indian chart SVG + condition checker + preset scenarios.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  RASHIS,
  PLANETS,
  DIGNITIES,
  PRESETS,
  getLordOfHouse,
  getSignOfHouse,
  getDignity,
  isKendra,
  isTrikona,
  isKendraOrTrikona,
  checkLakshmiYoga,
  checkSaraswatiYoga,
} from "./data";
import type { Dignity } from "./data";
import {
  Sparkles,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 }, 2: { x: 105, y: 45 }, 3: { x: 45, y: 105 },
  4: { x: 105, y: 200 }, 5: { x: 45, y: 295 }, 6: { x: 105, y: 355 },
  7: { x: 200, y: 295 }, 8: { x: 295, y: 355 }, 9: { x: 355, y: 295 },
  10: { x: 295, y: 200 }, 11: { x: 355, y: 105 }, 12: { x: 295, y: 45 },
};

const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105", 2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200", 4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390", 6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295", 8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390", 10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200", 12: "200,10 390,10 295,105",
};

function ChartSVG({
  lagnaSign,
  ninthLordHouse,
  mercuryHouse,
  jupiterHouse,
  venusHouse,
}: {
  lagnaSign: number;
  ninthLordHouse: number;
  mercuryHouse: number;
  jupiterHouse: number;
  venusHouse: number;
}) {
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) map[h] = ((lagnaSign - 1 + h - 1) % 12) + 1;
    return map;
  }, [lagnaSign]);

  const planetMarkers: Record<string, number[]> = {
    "9L": [ninthLordHouse],
    Me: [mercuryHouse],
    Ju: [jupiterHouse],
    Ve: [venusHouse],
  };

  return (
    <svg viewBox="0 0 400 445" className="w-full h-auto" style={{ maxHeight: 445 }}>
      {/* Background */}
      <rect x={8} y={8} width={384} height={424} rx={10} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Diagonals */}
      <g stroke={HAIRLINE} strokeWidth={1.2} fill="none">
        <rect x={10} y={10} width={380} height={380} />
        <line x1={10} y1={10} x2={390} y2={390} />
        <line x1={390} y1={10} x2={10} y2={390} />
        <line x1={200} y1={10} x2={10} y2={200} />
        <line x1={10} y1={200} x2={200} y2={390} />
        <line x1={200} y1={390} x2={390} y2={200} />
        <line x1={390} y1={200} x2={200} y2={10} />
      </g>

      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const sign = houseToSign[h];
        const isKT = isKendraOrTrikona(h);
        const is2nd = h === 2;
        const isLagna = h === 1;

        // Use fillOpacity instead of 8-digit hex for reliable transparent washes
        const fillColor = isLagna ? GOLD_ACCENT : isKT || is2nd ? GREEN : "transparent";
        const fillOp = isLagna ? 0.06 : isKT || is2nd ? 0.04 : 0;

        return (
          <g key={h}>
            <polygon
              points={HOUSE_POLYGONS[h]}
              fill={fillColor}
              fillOpacity={fillOp}
              stroke={isLagna ? GOLD_ACCENT : isKT ? GREEN : HAIRLINE}
              strokeWidth={isLagna ? 2 : isKT ? 1.5 : 1}
              strokeDasharray={is2nd && !isKT ? "4 4" : undefined}
            />
            {/* House number */}
            <text
              x={HOUSE_CENTERS[h].x}
              y={HOUSE_CENTERS[h].y - 10}
              textAnchor="middle"
              fontSize={12}
              fontWeight={700}
              fill={isLagna ? GOLD_ACCENT : isKT ? GREEN : INK_MUTED}
            >
              H{h}
            </text>
            {/* Sign name */}
            <text
              x={HOUSE_CENTERS[h].x}
              y={HOUSE_CENTERS[h].y + 6}
              textAnchor="middle"
              fontSize={11}
              fill={INK_SECONDARY}
            >
              {RASHIS[sign - 1]?.name}
            </text>
          </g>
        );
      })}

      {/* Planet markers */}
      {Object.entries(planetMarkers).map(([label, houses]) =>
        houses.map((h) => {
          const cx = HOUSE_CENTERS[h].x;
          const cy = HOUSE_CENTERS[h].y + 28;
          const col = label === "9L" ? GOLD_ACCENT : label === "Me" ? "#2F7D55" : label === "Ju" ? "#C8841E" : "#8B5A9F";
          return (
            <g key={`${label}-${h}`}>
              <rect x={cx - 20} y={cy - 10} width={40} height={20} rx={5} fill={col} opacity={0.9} />
              <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#fff">
                {label}
              </text>
            </g>
          );
        })
      )}

      {/* Center label */}
      <circle cx={200} cy={200} r={44} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={200} y={194} textAnchor="middle" fontSize={12} fontWeight={800} fill={GOLD_ACCENT}>
        LAGNA
      </text>
      <text x={200} y={212} textAnchor="middle" fontSize={11} fontWeight={600} fill={INK_SECONDARY}>
        {RASHIS[lagnaSign - 1]?.name}
      </text>

      {/* Legend */}
      <g transform="translate(38, 410)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.12} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={18} y={10} fontSize={10} fill={INK_SECONDARY}>Lagna</text>
        <rect x={65} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.1} stroke={GREEN} strokeWidth={1} />
        <text x={83} y={10} fontSize={10} fill={INK_SECONDARY}>Kendra/Trikona</text>
        <rect x={180} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.06} stroke={GREEN} strokeWidth={1} strokeDasharray="3 2" />
        <text x={198} y={10} fontSize={10} fill={INK_SECONDARY}>2nd house</text>
      </g>
    </svg>
  );
}

/* ─── Condition row helper ───────────────────────────────────────────────── */

function ConditionRow({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 size={14} style={{ color: GREEN, flexShrink: 0 }} />
      ) : (
        <XCircle size={14} style={{ color: VERMILION, flexShrink: 0 }} />
      )}
      <span className="text-xs" style={{ color: met ? INK_SECONDARY : INK_MUTED }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function LakshmiSaraswatiDetector() {
  const [lagnaSign, setLagnaSign] = useState(5);

  // Lakshmi params
  const [ninthLordHouse, setNinthLordHouse] = useState(9);
  const [ninthLordDignity, setNinthLordDignity] = useState<Dignity>("own");
  const [lagnaLordStrength, setLagnaLordStrength] = useState(80);
  const [venusStrength, setVenusStrength] = useState(70);

  // Sarasvati params
  const [mercuryHouse, setMercuryHouse] = useState(2);
  const [mercuryDignity, setMercuryDignity] = useState<Dignity>("neutral");
  const [jupiterHouse, setJupiterHouse] = useState(4);
  const [jupiterDignity, setJupiterDignity] = useState<Dignity>("exalted");
  const [venusHouse, setVenusHouse] = useState(3);
  const [venusDignity, setVenusDignity] = useState<Dignity>("neutral");

  const lakshmi = checkLakshmiYoga(lagnaSign, ninthLordHouse, ninthLordDignity, lagnaLordStrength, venusStrength);
  const saraswati = checkSaraswatiYoga(mercuryHouse, mercuryDignity, jupiterHouse, jupiterDignity, venusHouse, venusDignity);

  const ninthLordSign = getSignOfHouse(ninthLordHouse, lagnaSign);
  const ninthLordPlanet = getLordOfHouse(9, lagnaSign);
  const ninthLordName = PLANETS.find((p) => p.key === ninthLordPlanet)?.nameIAST ?? ninthLordPlanet;
  const lagnaLordPlanet = getLordOfHouse(1, lagnaSign);
  const lagnaLordName = PLANETS.find((p) => p.key === lagnaLordPlanet)?.nameIAST ?? lagnaLordPlanet;

  function applyPreset(key: string) {
    const p = PRESETS.find((pre) => pre.key === key);
    if (!p) return;
    setLagnaSign(p.lagnaSign);
    setNinthLordHouse(p.ninthLordHouse);
    setNinthLordDignity(p.ninthLordDignity);
    setLagnaLordStrength(p.lagnaLordStrength);
    setVenusStrength(p.venusStrength);
    setMercuryHouse(p.mercuryHouse);
    setMercuryDignity(p.mercuryDignity);
    setJupiterHouse(p.jupiterHouse);
    setJupiterDignity(p.jupiterDignity);
    setVenusHouse(p.venusHouse);
    setVenusDignity(p.venusDignity);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Sparkles size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Lakṣmī-Sarasvatī Detector
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Check both deity-named yogas: wealth-and-grace (Lakṣmī) and learning (Sarasvatī).
          </p>
        </div>
      </div>

      {/* ── Chart + Presets ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BookOpen size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Chart Explorer
            </span>
          </div>
          <button
            onClick={() => applyPreset("lakshmi-full")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        {/* Lagna selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Lagna:</span>
          <select
            value={lagnaSign}
            onChange={(e) => setLagnaSign(Number(e.target.value))}
            className="rounded-md px-3 py-1.5 text-sm"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          >
            {RASHIS.map((r) => (
              <option key={r.num} value={r.num}>
                {r.num}. {r.name}
              </option>
            ))}
          </select>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            9th lord: <strong style={{ color: INK_SECONDARY }}>{ninthLordName}</strong> · Lagna lord: <strong style={{ color: INK_SECONDARY }}>{lagnaLordName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSVG
            lagnaSign={lagnaSign}
            ninthLordHouse={ninthLordHouse}
            mercuryHouse={mercuryHouse}
            jupiterHouse={jupiterHouse}
            venusHouse={venusHouse}
          />

          {/* Presets */}
          <div className="space-y-2">
            <p className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Worked Presets</p>
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => applyPreset(p.key)}
                className="w-full text-left rounded-lg p-3 transition-all hover:shadow-sm"
                style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}20`, borderLeft: `3px solid ${GOLD_ACCENT}` }}
              >
                <p className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>{p.label}</p>
                <p className="text-[10px] mt-0.5" style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{p.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lakṣmī Yoga Panel ────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Lakṣmī Yoga — Wealth and Grace
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Core: 9th lord dignified (own/exaltation/mūlatrikoṇa) in a kendra or trikoṇa + strong lagna lord. Venus reinforces.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>9th lord house</label>
            <select
              value={ninthLordHouse}
              onChange={(e) => setNinthLordHouse(Number(e.target.value))}
              className="w-full rounded-md px-2 py-1.5 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>H{h} ({RASHIS[getSignOfHouse(h, lagnaSign) - 1].name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>9th lord dignity</label>
            <select
              value={ninthLordDignity}
              onChange={(e) => setNinthLordDignity(e.target.value as Dignity)}
              className="w-full rounded-md px-2 py-1.5 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {DIGNITIES.map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Lagna lord strength</label>
            <input
              type="range"
              min={0}
              max={100}
              value={lagnaLordStrength}
              onChange={(e) => setLagnaLordStrength(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: GOLD_ACCENT }}
            />
            <p className="text-xs" style={{ color: INK_MUTED }}>{lagnaLordStrength}%</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Venus strength (reinforces)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={venusStrength}
              onChange={(e) => setVenusStrength(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#8B5A9F" }}
            />
            <p className="text-xs" style={{ color: INK_MUTED }}>{venusStrength}%</p>
          </div>
        </div>

        {/* Lakshmi result */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            background: lakshmi.present ? `${GREEN}08` : `${VERMILION}06`,
            border: `1px solid ${lakshmi.present ? `${GREEN}30` : `${VERMILION}25`}`,
            borderLeft: `3px solid ${lakshmi.present ? GREEN : VERMILION}`,
          }}
        >
          <div className="flex items-center gap-2">
            {lakshmi.present ? (
              <CheckCircle2 size={16} style={{ color: GREEN }} />
            ) : (
              <XCircle size={16} style={{ color: VERMILION }} />
            )}
            <span className="text-sm font-bold" style={{ color: lakshmi.present ? GREEN : VERMILION }}>
              Lakṣmī Yoga {lakshmi.present ? "PRESENT" : "NOT PRESENT"}
              {lakshmi.present && lakshmi.strength === "strong" ? " — strong (Venus reinforces)" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <ConditionRow met={lakshmi.conditions.ninthLordDignified} label={`9th lord (${ninthLordName}) dignified`} />
            <ConditionRow met={lakshmi.conditions.ninthLordInKendraTrikona} label="9th lord in kendra/trikona" />
            <ConditionRow met={lakshmi.conditions.lagnaLordStrong} label={`Lagna lord (${lagnaLordName}) strong`} />
            <ConditionRow met={lakshmi.conditions.venusReinforces} label="Venus reinforces" />
          </div>
          {lakshmi.notes.length > 0 && (
            <div className="space-y-0.5">
              {lakshmi.notes.map((note, i) => (
                <p key={i} className="text-[10px]" style={{ color: INK_MUTED }}>• {note}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sarasvatī Yoga Panel ─────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Sarasvatī Yoga — Learning and Eloquence
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Condition: Mercury, Jupiter, and Venus well-placed in kendras, trikoṇas, or 2nd house — all undebilitated, Jupiter especially strong.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Mercury */}
          <div className="space-y-2 rounded-lg p-3" style={{ background: `${PLANETS.find(p => p.key === "mercury")?.color}06`, border: `1px solid ${PLANETS.find(p => p.key === "mercury")?.color}20` }}>
            <p className="text-xs font-bold" style={{ color: PLANETS.find(p => p.key === "mercury")?.color }}>
              <IAST size="sm">Budha</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">बुध</Devanagari></span>
            </p>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold" style={{ color: INK_SECONDARY }}>House</label>
              <select
                value={mercuryHouse}
                onChange={(e) => setMercuryHouse(Number(e.target.value))}
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendraOrTrikona(h) ? "(KT)" : h === 2 ? "(2nd)" : ""}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold" style={{ color: INK_SECONDARY }}>Dignity</label>
              <select
                value={mercuryDignity}
                onChange={(e) => setMercuryDignity(e.target.value as Dignity)}
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {DIGNITIES.map((d) => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Jupiter */}
          <div className="space-y-2 rounded-lg p-3" style={{ background: `${PLANETS.find(p => p.key === "jupiter")?.color}06`, border: `1px solid ${PLANETS.find(p => p.key === "jupiter")?.color}20` }}>
            <p className="text-xs font-bold" style={{ color: PLANETS.find(p => p.key === "jupiter")?.color }}>
              <IAST size="sm">Guru</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">गुरु</Devanagari></span>
            </p>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold" style={{ color: INK_SECONDARY }}>House</label>
              <select
                value={jupiterHouse}
                onChange={(e) => setJupiterHouse(Number(e.target.value))}
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendraOrTrikona(h) ? "(KT)" : h === 2 ? "(2nd)" : ""}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold" style={{ color: INK_SECONDARY }}>Dignity</label>
              <select
                value={jupiterDignity}
                onChange={(e) => setJupiterDignity(e.target.value as Dignity)}
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {DIGNITIES.map((d) => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Venus */}
          <div className="space-y-2 rounded-lg p-3" style={{ background: `${PLANETS.find(p => p.key === "venus")?.color}06`, border: `1px solid ${PLANETS.find(p => p.key === "venus")?.color}20` }}>
            <p className="text-xs font-bold" style={{ color: PLANETS.find(p => p.key === "venus")?.color }}>
              <IAST size="sm">Śukra</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">शुक्र</Devanagari></span>
            </p>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold" style={{ color: INK_SECONDARY }}>House</label>
              <select
                value={venusHouse}
                onChange={(e) => setVenusHouse(Number(e.target.value))}
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendraOrTrikona(h) ? "(KT)" : h === 2 ? "(2nd)" : ""}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold" style={{ color: INK_SECONDARY }}>Dignity</label>
              <select
                value={venusDignity}
                onChange={(e) => setVenusDignity(e.target.value as Dignity)}
                className="w-full rounded-md px-2 py-1 text-xs"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {DIGNITIES.map((d) => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sarasvati result */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            background: saraswati.present ? `${GREEN}08` : `${VERMILION}06`,
            border: `1px solid ${saraswati.present ? `${GREEN}30` : `${VERMILION}25`}`,
            borderLeft: `3px solid ${saraswati.present ? GREEN : VERMILION}`,
          }}
        >
          <div className="flex items-center gap-2">
            {saraswati.present ? (
              <CheckCircle2 size={16} style={{ color: GREEN }} />
            ) : (
              <XCircle size={16} style={{ color: VERMILION }} />
            )}
            <span className="text-sm font-bold" style={{ color: saraswati.present ? GREEN : VERMILION }}>
              Sarasvatī Yoga {saraswati.present ? "PRESENT" : "NOT PRESENT"}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            <ConditionRow met={saraswati.conditions.mercuryWellPlaced} label="Mercury well-placed (kendra/trikona/2nd)" />
            <ConditionRow met={saraswati.conditions.mercuryUndebilitated} label="Mercury undebilitated" />
            <ConditionRow met={saraswati.conditions.jupiterWellPlaced} label="Jupiter well-placed (kendra/trikona/2nd)" />
            <ConditionRow met={saraswati.conditions.jupiterUndebilitated} label="Jupiter undebilitated" />
            <ConditionRow met={saraswati.conditions.jupiterStrong} label="Jupiter especially strong" />
            <ConditionRow met={saraswati.conditions.venusWellPlaced} label="Venus well-placed (kendra/trikona/2nd)" />
            <ConditionRow met={saraswati.conditions.venusUndebilitated} label="Venus undebilitated" />
          </div>
          {saraswati.notes.length > 0 && (
            <div className="space-y-0.5">
              {saraswati.notes.map((note, i) => (
                <p key={i} className="text-[10px]" style={{ color: INK_MUTED }}>• {note}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Common mistakes ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        {[
          { title: "Reducing Lakṣmī to 'Venus strong'", fix: "Core = dignified 9th lord + strong lagna lord. Venus only reinforces." },
          { title: "Ignoring debilitation for Sarasvatī", fix: "Me/Ju/Ve must ALL be undebilitated. Jupiter debilitated breaks it." },
          { title: "Treating deity names as magic", fix: "The name labels the kind of blessing — wealth vs learning — nothing more." },
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
            Source variation disclosure
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            Exact Lakṣmī Yoga conditions vary slightly by source (BPHS vs Phaladīpikā). The structural core taught here —
            dignified 9th lord + strong lagna lord — is consistent; Venus reinforcement is the kāraka overlay, not the structural requirement.
          </p>
        </div>
      </div>
    </div>
  );
}
