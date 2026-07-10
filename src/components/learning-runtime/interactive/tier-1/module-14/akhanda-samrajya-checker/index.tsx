"use client";

/**
 * Akhanda Sāmrājya Checker — Lesson 14.4.2 Interactive
 *
 * §7 interactive for detecting Akhanda Sāmrājya Yoga across
 * multiple source definitions. Teaches source-variation discipline.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  RASHIS,
  DIGNITIES,
  SOURCE_VERSIONS,
  PRESETS,
  getLordOfHouse,
  getSignOfHouse,
  isKendra,
  isTrikona,
  checkAkhanda,
} from "./data";
import type { Dignity, CheckParams } from "./data";
import {
  Crown,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  GitBranch,
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
const INDIGO = "#4F6FA8";

/* ─── SVG Diagram: Sovereignty Stack ─────────────────────────────────────── */

function SovereigntyStack({ results }: { results: { label: string; met: boolean }[] }) {
  const w = 360;
  const h = 160;
  const barW = 200;
  const barH = 18;
  const gap = 8;
  const startY = 20;
  const startX = 120;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 180 }}>
      <text x={w / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        The sovereignty stack — all must hold
      </text>

      {results.map((r, i) => {
        const y = startY + i * (barH + gap);
        const col = r.met ? GREEN : VERMILION;
        return (
          <g key={i}>
            <rect
              x={startX}
              y={y}
              width={barW}
              height={barH}
              rx={4}
              fill={col}
              fillOpacity={0.12}
              stroke={col}
              strokeWidth={1.2}
            />
            <text x={startX + 8} y={y + barH / 2 + 4} fontSize={9} fontWeight={700} fill={col}>
              {r.met ? "✓" : "✗"} {r.label}
            </text>
            {/* Icon */}
            <circle cx={startX - 16} cy={y + barH / 2} r={7} fill={col} fillOpacity={0.2} stroke={col} strokeWidth={1} />
            <text x={startX - 16} y={y + barH / 2 + 3} textAnchor="middle" fontSize={8} fontWeight={900} fill={col}>
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Total */}
      <text x={startX + barW + 12} y={startY + (results.length * (barH + gap)) / 2 - 8} fontSize={9} fontWeight={700} fill={INK_MUTED}>
        {results.filter((r) => r.met).length}/{results.length}
      </text>
      <text x={startX + barW + 12} y={startY + (results.length * (barH + gap)) / 2 + 6} fontSize={8} fill={INK_MUTED}>
        conditions
      </text>
    </svg>
  );
}

/* ─── SVG Mini Chart: Houses 2-4-9-11 ────────────────────────────────────── */

function MiniChart({
  lagnaSign,
  lord2ndHouse,
  lord9thHouse,
  lord11thHouse,
  jupiterHouse,
  lord4thHouse,
}: {
  lagnaSign: number;
  lord2ndHouse: number;
  lord9thHouse: number;
  lord11thHouse: number;
  jupiterHouse: number;
  lord4thHouse: number;
}) {
  const relevant = [1, 2, 4, 9, 10, 11];
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) map[h] = ((lagnaSign - 1 + h - 1) % 12) + 1;
    return map;
  }, [lagnaSign]);

  // Angular positions for 12 houses on a circle
  const polar = (angle: number, r: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 180 + r * Math.cos(rad), y: 140 + r * Math.sin(rad) };
  };

  const houseAngles: Record<number, number> = {
    1: 270, 2: 300, 3: 330, 4: 0, 5: 30, 6: 60,
    7: 90, 8: 120, 9: 150, 10: 180, 11: 210, 12: 240,
  };

  const planetAt: Record<string, number[]> = {
    "2L": [lord2ndHouse],
    "4L": [lord4thHouse],
    "9L": [lord9thHouse],
    "11L": [lord11thHouse],
    Ju: [jupiterHouse],
  };

  return (
    <svg viewBox="0 0 360 280" className="w-full h-auto" style={{ maxHeight: 300 }}>
      {/* Outer ring */}
      <circle cx={180} cy={140} r={110} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={180} cy={140} r={80} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" />

      {/* House ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const a = houseAngles[h];
        const outer = polar(a, 110);
        const inner = polar(a, 80);
        const isRel = relevant.includes(h);
        return (
          <g key={h}>
            <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={isRel ? GOLD_ACCENT : HAIRLINE} strokeWidth={isRel ? 2 : 1} />
            {/* House label */}
            {isRel && (
              <text
                x={polar(a, 124).x}
                y={polar(a, 124).y + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={800}
                fill={h === 1 ? GOLD_ACCENT : h === 9 ? GREEN : INDIGO}
              >
                H{h}
              </text>
            )}
          </g>
        );
      })}

      {/* House sign names inside */}
      {relevant.map((h) => {
        const a = houseAngles[h];
        const pos = polar(a, 95);
        const sign = RASHIS[houseToSign[h] - 1];
        return (
          <text key={`sign-${h}`} x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize={9} fill={INK_MUTED}>
            {sign.name.slice(0, 3)}
          </text>
        );
      })}

      {/* Planet markers */}
      {Object.entries(planetAt).map(([label, houses]) =>
        houses.map((h) => {
          const a = houseAngles[h];
          const pos = polar(a, 60);
          const col = label === "Ju" ? "#C8841E" : label === "9L" ? GREEN : label === "2L" ? INDIGO : "#8B5A9F";
          return (
            <g key={`${label}-${h}`}>
              <circle cx={pos.x} cy={pos.y} r={14} fill={col} opacity={0.85} />
              <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
                {label}
              </text>
            </g>
          );
        })
      )}

      {/* Center */}
      <circle cx={180} cy={140} r={26} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={1.5} />
      <text x={180} y={136} textAnchor="middle" fontSize={9} fontWeight={700} fill={GOLD_ACCENT}>
        {RASHIS[lagnaSign - 1].name}
      </text>
      <text x={180} y={150} textAnchor="middle" fontSize={8} fill={INK_MUTED}>
        Lagna
      </text>
    </svg>
  );
}

/* ─── Condition row ──────────────────────────────────────────────────────── */

function ConditionRow({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? <CheckCircle2 size={14} style={{ color: GREEN, flexShrink: 0 }} /> : <XCircle size={14} style={{ color: VERMILION, flexShrink: 0 }} />}
      <span className="text-xs break-words" style={{ color: met ? INK_SECONDARY : INK_MUTED }}>{label}</span>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export function AkhandaSamrajyaChecker() {
  const [sourceKey, setSourceKey] = useState("stub");
  const [lagnaSign, setLagnaSign] = useState(5);

  const [lord2ndHouse, setLord2ndHouse] = useState(10);
  const [lord2ndDignity, setLord2ndDignity] = useState<Dignity>("own");
  const [lord9thHouse, setLord9thHouse] = useState(1);
  const [lord9thDignity, setLord9thDignity] = useState<Dignity>("moolatrikona");
  const [lord11thHouse, setLord11thHouse] = useState(4);
  const [lord11thDignity, setLord11thDignity] = useState<Dignity>("own");
  const [jupiterHouse, setJupiterHouse] = useState(9);
  const [jupiterDignity, setJupiterDignity] = useState<Dignity>("exalted");
  const [lord4thHouse, setLord4thHouse] = useState(7);
  const [lord4thDignity, setLord4thDignity] = useState<Dignity>("own");

  const params: CheckParams = {
    lagnaSign,
    lord2ndHouse,
    lord2ndDignity,
    lord9thHouse,
    lord9thDignity,
    lord11thHouse,
    lord11thDignity,
    jupiterHouse,
    jupiterDignity,
    lord4thHouse,
    lord4thDignity,
  };

  const result = checkAkhanda(sourceKey, params);
  const source = SOURCE_VERSIONS.find((s) => s.key === sourceKey)!;

  const lord2ndName = getLordOfHouse(2, lagnaSign);
  const lord9thName = getLordOfHouse(9, lagnaSign);
  const lord11thName = getLordOfHouse(11, lagnaSign);
  const lord4thName = getLordOfHouse(4, lagnaSign);

  function applyPreset(key: string) {
    const p = PRESETS.find((pre) => pre.key === key);
    if (!p) return;
    setLagnaSign(p.lagnaSign);
    setLord2ndHouse(p.lord2ndHouse);
    setLord2ndDignity(p.lord2ndDignity);
    setLord9thHouse(p.lord9thHouse);
    setLord9thDignity(p.lord9thDignity);
    setLord11thHouse(p.lord11thHouse);
    setLord11thDignity(p.lord11thDignity);
    setJupiterHouse(p.jupiterHouse);
    setJupiterDignity(p.jupiterDignity);
    setLord4thHouse(p.lord4thHouse);
    setLord4thDignity(p.lord4thDignity);
  }

  return (
    <div className="space-y-5">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Crown size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Akhanda Sāmrājya Checker
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            "Unbroken sovereignty" — test the multi-lord stack, and note how the rule varies by source.
          </p>
        </div>
      </div>

      {/* ── Source selector ──────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-3"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2">
          <GitBranch size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Select Source Definition
          </span>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          The exact conditions vary by source. Pick a version — the checker adjusts. This is the core discipline.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SOURCE_VERSIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setSourceKey(s.key)}
              className="text-left rounded-lg p-3 transition-all hover:shadow-sm"
              style={{
                background: sourceKey === s.key ? `${GOLD_ACCENT}10` : SURFACE,
                border: `1.5px solid ${sourceKey === s.key ? GOLD_ACCENT : HAIRLINE}`,
                borderLeft: `3px solid ${sourceKey === s.key ? GOLD_ACCENT : HAIRLINE}`,
              }}
            >
              <p className="text-xs font-bold" style={{ color: sourceKey === s.key ? GOLD_ACCENT : INK_PRIMARY }}>
                {s.label}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>
                {s.description}
              </p>
              <p className="text-[10px] mt-1" style={{ color: INK_MUTED }}>
                Source: {s.source}
              </p>
            </button>
          ))}
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
            onClick={() => applyPreset("full-stack")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>Lagna:</span>
          <select
            value={lagnaSign}
            onChange={(e) => setLagnaSign(Number(e.target.value))}
            className="rounded-md px-3 py-1.5 text-sm"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          >
            {RASHIS.map((r) => (
              <option key={r.num} value={r.num}>{r.num}. {r.name}</option>
            ))}
          </select>
          <span className="text-xs" style={{ color: INK_MUTED }}>
            2nd: <strong style={{ color: INK_SECONDARY }}>{lord2ndName}</strong> ·
            9th: <strong style={{ color: INK_SECONDARY }}>{lord9thName}</strong> ·
            11th: <strong style={{ color: INK_SECONDARY }}>{lord11thName}</strong> ·
            4th: <strong style={{ color: INK_SECONDARY }}>{lord4thName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <MiniChart
            lagnaSign={lagnaSign}
            lord2ndHouse={lord2ndHouse}
            lord9thHouse={lord9thHouse}
            lord11thHouse={lord11thHouse}
            jupiterHouse={jupiterHouse}
            lord4thHouse={lord4thHouse}
          />
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

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg p-4 space-y-4"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}
      >
        <p className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>
          Configure placements for <IAST size="sm">{source.label}</IAST>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* 2nd lord */}
          <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${INDIGO}06`, border: `1px solid ${INDIGO}20` }}>
            <p className="text-xs font-bold" style={{ color: INDIGO }}>2nd lord ({lord2ndName})</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
              <select value={lord2ndHouse} onChange={(e) => setLord2ndHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendra(h) ? "(K)" : isTrikona(h) ? "(T)" : ""}</option>
                ))}
              </select>
            </div>
            <select value={lord2ndDignity} onChange={(e) => setLord2ndDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>

          {/* 9th lord */}
          <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}20` }}>
            <p className="text-xs font-bold" style={{ color: GREEN }}>9th lord ({lord9thName})</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
              <select value={lord9thHouse} onChange={(e) => setLord9thHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendra(h) ? "(K)" : isTrikona(h) ? "(T)" : ""}</option>
                ))}
              </select>
            </div>
            <select value={lord9thDignity} onChange={(e) => setLord9thDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>

          {/* 11th lord */}
          <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${AMBER}06`, border: `1px solid ${AMBER}20` }}>
            <p className="text-xs font-bold" style={{ color: AMBER }}>11th lord ({lord11thName})</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
              <select value={lord11thHouse} onChange={(e) => setLord11thHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendra(h) ? "(K)" : isTrikona(h) ? "(T)" : ""}</option>
                ))}
              </select>
            </div>
            <select value={lord11thDignity} onChange={(e) => setLord11thDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>

          {/* Jupiter */}
          <div className="space-y-1.5 rounded-lg p-3" style={{ background: "#C8841E10", border: `1px solid #C8841E30` }}>
            <p className="text-xs font-bold" style={{ color: "#C8841E" }}>
              <IAST size="sm">Guru</IAST> <span style={{ opacity: 0.6 }}><Devanagari size="sm">गुरु</Devanagari></span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
              <select value={jupiterHouse} onChange={(e) => setJupiterHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendra(h) ? "(K)" : isTrikona(h) ? "(T)" : ""}</option>
                ))}
              </select>
            </div>
            <select value={jupiterDignity} onChange={(e) => setJupiterDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>

          {/* 4th lord */}
          <div className="space-y-1.5 rounded-lg p-3" style={{ background: `${VERMILION}05`, border: `1px solid ${VERMILION}20` }}>
            <p className="text-xs font-bold" style={{ color: VERMILION }}>4th lord ({lord4thName})</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px]" style={{ color: INK_MUTED }}>House:</span>
              <select value={lord4thHouse} onChange={(e) => setLord4thHouse(Number(e.target.value))} className="flex-1 rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>H{h} {isKendra(h) ? "(K)" : isTrikona(h) ? "(T)" : ""}</option>
                ))}
              </select>
            </div>
            <select value={lord4thDignity} onChange={(e) => setLord4thDignity(e.target.value as Dignity)} className="w-full rounded-md px-2 py-1 text-xs" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {DIGNITIES.map((d) => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Stack diagram */}
        <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <SovereigntyStack results={result.conditionResults.map((r) => ({ label: r.label, met: r.met }))} />
        </div>

        {/* Verdict card */}
        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            background: result.present ? `${GREEN}08` : `${VERMILION}06`,
            border: `1px solid ${result.present ? `${GREEN}30` : `${VERMILION}25`}`,
            borderLeft: `3px solid ${result.present ? GREEN : VERMILION}`,
          }}
        >
          <div className="flex items-center gap-2">
            {result.present ? <CheckCircle2 size={18} style={{ color: GREEN }} /> : <XCircle size={18} style={{ color: VERMILION }} />}
            <span className="text-base font-bold" style={{ color: result.present ? GREEN : VERMILION }}>
              Akhanda Sāmrājya {result.present ? "PRESENT" : "NOT PRESENT"}
            </span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            Using <strong>{source.label}</strong> — {result.metCount}/{result.totalCount} conditions met.
          </p>
          <div className="space-y-1">
            {result.conditionResults.map((r, i) => (
              <ConditionRow key={i} met={r.met} label={`${r.label} — ${r.detail}`} />
            ))}
          </div>
          {result.notes.length > 0 && (
            <div className="space-y-0.5">
              {result.notes.map((note, i) => (
                <p key={i} className="text-[10px]" style={{ color: INK_MUTED }}>• {note}</p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Rarity + discipline note ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${AMBER}06`, border: `1px solid ${AMBER}20`, borderLeft: `3px solid ${AMBER}` }}
      >
        <AlertTriangle size={16} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Rare and weighty — strength and timing still matter
          </p>
          <p className="text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
            Because Akhanda Sāmrājya stacks several strong-lord conditions, it is genuinely <strong>rare</strong>.
            Even when present, its delivery depends on the strength of the participating planets and the timing
            of their daśās. Do not promise lifelong sovereignty from structure alone.
          </p>
        </div>
      </div>

      {/* ── Source discipline banner ─────────────────────────────────────── */}
      <div
        className="rounded-lg p-3 flex items-start gap-2.5"
        style={{ background: `${GOLD_ACCENT}06`, border: `1px solid ${GOLD_ACCENT}25` }}
      >
        <Info size={16} style={{ color: GOLD_ACCENT, marginTop: 2, flexShrink: 0 }} />
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            Source-variation discipline
          </p>
          <p className="text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
            When you claim Akhanda Sāmrājya, <strong>state which source's definition you are applying</strong>.
            The Phaladīpikā and BPHS give differing forms. There is no single canonical rule —
            presenting one version as universal is a common mistake. Switch the source selector above
            to see how the verdict changes.
          </p>
        </div>
      </div>
    </div>
  );
}
