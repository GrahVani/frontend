"use client";

/**
 * Kala Sarpa Detector -- Lesson 14.6.3 Interactive
 *
 * Section 7 interactive: checks if all seven planets are hemmed on one side
 * of the Rahu-Ketu axis. Distinguishes complete/broken/none + KSY vs
 * Kala Amrita. Surfaces the doctrinal debate (absent from BPHS) and
 * honest handling rules.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { grahas } from "@/design-tokens/grahvani-learning/colors";
import { PLANETS, getKetu, checkKSY, PRESETS } from "./data";
import type { PlanetKey } from "./data";
import {
  RotateCcw,
  AlertTriangle,
  Info,
  ChevronRight,
  Eye,
  Shield,
  Sparkles,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";
const RAHU_COLOR = "#5A5C68";
const KETU_COLOR = "#7A3E4A";

function grahaColor(slug: string) {
  return (grahas as Record<string, { primary: string }>)[slug]?.primary ?? INK_MUTED;
}

/* --- SVG: Nodal axis ring --- */

function AxisRing({
  rahuHouse,
  planetHouses,
  result,
}: {
  rahuHouse: number;
  planetHouses: Record<PlanetKey, number>;
  result: ReturnType<typeof checkKSY>;
}) {
  const w = 320;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2;
  const r = 100;

  const polar = (house: number) => {
    const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const ketuHouse = getKetu(rahuHouse);

  const isKsy = result.variant === "ksy-complete" || result.variant === "ksy-broken";
  const isAmrita = result.variant === "amrita-complete" || result.variant === "amrita-broken";
  const highlightColor = isKsy ? VERMILION : isAmrita ? KETU_COLOR : "transparent";

  const arcHousesRK: number[] = [];
  for (let i = 0; i <= 6; i++) {
    const h = rahuHouse + i;
    arcHousesRK.push(h > 12 ? h - 12 : h);
  }

  const arcHousesKR: number[] = [];
  for (let i = 1; i <= 5; i++) {
    const h = ketuHouse + i;
    arcHousesKR.push(h > 12 ? h - 12 : h);
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 320 }}>
      <text x={cx} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Nodal axis -- Rahu H{rahuHouse} / Ketu H{ketuHouse}
      </text>

      <circle cx={cx} cy={cy} r={r} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 24} fill="none" stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 4" />

      {(isKsy || isAmrita) && (
        <>
          {(isKsy ? arcHousesRK : arcHousesKR).map((h) => {
            const pos = polar(h);
            return (
              <line
                key={`hl-${h}`}
                x1={cx}
                y1={cy}
                x2={pos.x}
                y2={pos.y}
                stroke={highlightColor}
                strokeWidth={3}
                opacity={0.3}
              />
            );
          })}
        </>
      )}

      {Array.from({ length: 12 }, (_, i) => {
        const h = i + 1;
        const pos = polar(h);
        const isRahu = h === rahuHouse;
        const isKetu = h === ketuHouse;
        const planetHere = PLANETS.find((p) => planetHouses[p.key] === h);

        return (
          <g key={h}>
            <line
              x1={cx}
              y1={cy}
              x2={pos.x}
              y2={pos.y}
              stroke={isRahu || isKetu ? highlightColor || INK_MUTED : HAIRLINE}
              strokeWidth={isRahu || isKetu ? 2 : 1}
            />
            <text
              x={pos.x * 0.82 + cx * 0.18}
              y={pos.y * 0.82 + cy * 0.18 + 4}
              textAnchor="middle"
              fontSize={isRahu || isKetu ? 11 : 9}
              fontWeight={isRahu || isKetu ? 800 : 600}
              fill={isRahu ? RAHU_COLOR : isKetu ? KETU_COLOR : planetHere ? grahaColor(planetHere.grahaSlug) : INK_MUTED}
            >
              {isRahu ? "Ra" : isKetu ? "Ke" : planetHere ? planetHere.short : `H${h}`}
            </text>
          </g>
        );
      })}

      <circle cx={polar(rahuHouse).x * 0.72 + cx * 0.28} cy={polar(rahuHouse).y * 0.72 + cy * 0.28} r={14} fill={RAHU_COLOR} opacity={0.9} />
      <text x={polar(rahuHouse).x * 0.72 + cx * 0.28} y={polar(rahuHouse).y * 0.72 + cy * 0.28 + 4} textAnchor="middle" fontSize={8} fontWeight={700} fill="#fff">Rahu</text>

      <circle cx={polar(ketuHouse).x * 0.72 + cx * 0.28} cy={polar(ketuHouse).y * 0.72 + cy * 0.28} r={12} fill={KETU_COLOR} opacity={0.9} />
      <text x={polar(ketuHouse).x * 0.72 + cx * 0.28} y={polar(ketuHouse).y * 0.72 + cy * 0.28 + 4} textAnchor="middle" fontSize={8} fontWeight={700} fill="#fff">Ketu</text>

      <circle cx={cx} cy={cy} r={18} fill={SURFACE} stroke={GOLD_ACCENT} strokeWidth={2} />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={9} fontWeight={700} fill={GOLD_ACCENT}>Axis</text>

      <g transform={`translate(20, ${h - 44})`}>
        <circle cx={6} cy={5} r={6} fill={RAHU_COLOR} />
        <text x={18} y={9} fontSize={8} fill={INK_SECONDARY}>Rahu</text>
        <circle cx={60} cy={5} r={6} fill={KETU_COLOR} />
        <text x={72} y={9} fontSize={8} fill={INK_SECONDARY}>Ketu</text>
        <rect x={115} y={0} width={10} height={10} rx={2} fill={VERMILION} fillOpacity={0.2} stroke={VERMILION} strokeWidth={1} />
        <text x={131} y={9} fontSize={8} fill={INK_SECONDARY}>KSY arc</text>
      </g>
    </svg>
  );
}

/* --- Main component --- */

export function KalaSarpaDetector() {
  const [rahuHouse, setRahuHouse] = useState(1);
  const [planetHouses, setPlanetHouses] = useState<Record<PlanetKey, number>>({
    sun: 2, moon: 3, mars: 4, mercury: 5, jupiter: 6, venus: 7, saturn: 7,
  });

  const result = useMemo(
    () => checkKSY(rahuHouse, planetHouses),
    [rahuHouse, planetHouses],
  );

  function setPlanetHouse(key: PlanetKey, house: number) {
    setPlanetHouses((prev) => ({ ...prev, [key]: house }));
  }

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setRahuHouse(preset.rahuHouse);
    setPlanetHouses({ ...preset.planets });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Kala Sarpa Detector
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Check the nodal-axis configuration. Recognise the shape -- withhold the doom.
          </p>
        </div>
      </div>

      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Chart Setup</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className="px-2 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => applyPreset("complete-ksy")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: RAHU_COLOR }}>Rahu</span>
            <select
              value={rahuHouse}
              onChange={(e) => setRahuHouse(Number(e.target.value))}
              className="w-full rounded-md px-2 py-1.5 text-sm"
              style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>H{i + 1}</option>
              ))}
            </select>
          </label>
          {PLANETS.map((p) => (
            <label key={p.key} className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: grahaColor(p.grahaSlug) }}>{p.name}</span>
              <select
                value={planetHouses[p.key]}
                onChange={(e) => setPlanetHouse(p.key, Number(e.target.value))}
                className="w-full rounded-md px-2 py-1.5 text-sm"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>H{i + 1}</option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="text-xs" style={{ color: INK_MUTED }}>
          Ketu is automatically opposite Rahu: H{rahuHouse} -- H{getKetu(rahuHouse)}.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <AxisRing rahuHouse={rahuHouse} planetHouses={planetHouses} result={result} />
        </div>

        <div className="space-y-3">
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.variantColor}` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
                <IAST>Kala Sarpa</IAST> Result
              </h4>
              <span
                className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: `${result.variantColor}15`, color: result.variantColor }}
              >
                {result.variantLabel}
              </span>
            </div>

            <div className="space-y-1.5 text-xs" style={{ color: INK_SECONDARY }}>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-20">Rahu:</span>
                <span>H{result.rahuHouse}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold w-20">Ketu:</span>
                <span>H{result.ketuHouse}</span>
              </div>
              {result.planetsInArcRK.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-20">Rahu-Ketu:</span>
                  <span>{result.planetsInArcRK.join(", ")}</span>
                </div>
              )}
              {result.planetsInArcKR.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-20">Ketu-Rahu:</span>
                  <span>{result.planetsInArcKR.join(", ")}</span>
                </div>
              )}
              {result.planetsOnAxis.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold w-20">On axis:</span>
                  <span style={{ color: AMBER }}>{result.planetsOnAxis.join(", ")}</span>
                </div>
              )}
            </div>

            {result.notes.length > 0 && (
              <div className="space-y-1 pt-1">
                {result.notes.map((n, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${VERMILION}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: VERMILION }} />
              <span className="text-xs font-bold" style={{ color: VERMILION }}>Doctrinal Debate</span>
            </div>
            <p className="text-xs" style={{ color: INK_SECONDARY }}>
              <strong>Kala Sarpa Yoga does NOT appear in the Brihat Parashara Hora Shastra.</strong>
              Modern teachers are divided: some accept it; others reject it.
              Many serious authorities (notably <strong>K. N. Rao</strong>) regard it as a
              <strong> 20th-century construction</strong> and a vehicle for fearmongering and remedy-commerce.
            </p>
            <p className="text-xs" style={{ color: INK_MUTED }}>
              In short: KSY is <strong>not</strong> an established classical dosha, and its very status is contested.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: GREEN }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Honest Handling Rules</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { num: "1", text: "Present both positions -- that KSY is contested and absent from BPHS." },
            { num: "2", text: "Never predict a specific catastrophe from KSY alone." },
            { num: "3", text: "If you read it, check for the 'broken' condition and the rest of the chart." },
            { num: "4", text: "Frame any reading constructively -- a period emphasising the nodes' themes." },
            { num: "5", text: "Refuse fear-extraction and remedy up-selling -- the most common abuse." },
          ].map((rule) => (
            <div key={rule.num} className="flex items-start gap-2 rounded-md p-2" style={{ background: `${GREEN}06`, border: `1px solid ${HAIRLINE}` }}>
              <span className="text-xs font-bold shrink-0" style={{ color: GREEN }}>{rule.num}.</span>
              <span className="text-xs" style={{ color: INK_SECONDARY }}>{rule.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Presenting as classical doctrine", text: "KSY is absent from BPHS and contested by many serious teachers. Always say so." },
            { title: "Predicting catastrophe", text: "Never forecast specific disaster from KSY alone. The configuration does not justify doom." },
            { title: "Up-selling remedies", text: "Refuse fear/fee extraction -- the signature abuse attached to this label." },
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
