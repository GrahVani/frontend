"use client";

/**
 * Argala Explorer -- Chapter 3 (Argala) Interactive
 *
 * Module 17, Chapter 3 chapter-level component.
 * Covers: argala concept, positive argala (2/4/11), virodhārgala (12/10/3),
 * net-effect computation, and the five-step workflow.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { computeArgala, GRAHAS, PRESETS, WORKFLOW_STEPS } from "./data";
import type { GrahaKey } from "./data";
import {
  RotateCcw,
  AlertTriangle,
  Info,
  ArrowRight,
  Target,
  Plus,
  Minus,
  Scale,
} from "lucide-react";

/* --- Design tokens --- */

/** Darken pale graha colors so they remain readable on cream/parchment backgrounds. */
function readableColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.72) {
    const scale = (c: number) => Math.round(c * 0.5).toString(16).padStart(2, "0");
    return `#${scale(r)}${scale(g)}${scale(b)}`;
  }
  return hex;
}

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";
const GRID_LINE = "rgba(90, 78, 46, 0.95)";



function ArgalaDiagram({
  referenceHouse,
  placements,
  result,
}: {
  referenceHouse: number;
  placements: Partial<Record<GrahaKey, number>>;
  result: ReturnType<typeof computeArgala>;
}) {
  const positiveHouses = new Set([result.pairs[0].positiveHouse, result.pairs[1].positiveHouse, result.pairs[2].positiveHouse]);
  const virodhaHouses = new Set([result.pairs[0].virodhaHouse, result.pairs[1].virodhaHouse, result.pairs[2].virodhaHouse]);
  const secHouse = result.secondaryPositive.house;

  const HOUSE_POLYGONS: Record<number, string> = {
    1: "200,10 105,105 200,200 295,105",
    2: "10,10 200,10 105,105",
    3: "10,10 105,105 10,200",
    4: "10,200 105,105 200,200 105,295",
    5: "10,200 105,295 10,390",
    6: "10,390 105,295 200,390",
    7: "200,390 105,295 200,200 295,295",
    8: "200,390 295,295 390,390",
    9: "390,200 295,295 390,390",
    10: "390,200 295,105 200,200 295,295",
    11: "390,10 295,105 390,200",
    12: "200,10 390,10 295,105",
  };

  const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
    1: { x: 200, y: 105 },
    2: { x: 105, y: 45 },
    3: { x: 45, y: 105 },
    4: { x: 105, y: 200 },
    5: { x: 45, y: 295 },
    6: { x: 105, y: 355 },
    7: { x: 200, y: 295 },
    8: { x: 295, y: 355 },
    9: { x: 355, y: 295 },
    10: { x: 295, y: 200 },
    11: { x: 355, y: 105 },
    12: { x: 295, y: 45 },
  };

  const grahasByHouse = GRAHAS.reduce((acc, g) => {
    const h = placements[g.key];
    if (h) {
      acc[h] = acc[h] || [];
      acc[h].push(g);
    }
    return acc;
  }, {} as Record<number, (typeof GRAHAS)[number][]>);

  return (
    <svg viewBox="0 0 400 448" className="w-full h-auto" style={{ maxHeight: 430, minHeight: 360 }}>
      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const isRef = hnum === referenceHouse;
        const isPos = positiveHouses.has(hnum);
        const isViro = virodhaHouses.has(hnum);
        const isSec = hnum === secHouse;

        let fill = "transparent";
        let opacity = 0;
        if (isRef) { fill = GOLD_ACCENT; opacity = 0.22; }
        else if (isPos) { fill = GREEN; opacity = 0.2; }
        else if (isViro) { fill = VERMILION; opacity = 0.18; }
        else if (isSec) { fill = GREEN; opacity = 0.1; }

        return (
          <g key={hnum}>
            <polygon
              points={HOUSE_POLYGONS[hnum]}
              fill={fill}
              fillOpacity={opacity > 0 ? opacity : undefined}
              stroke="none"
            />
          </g>
        );
      })}

      {/* Grid Lines */}
      <g stroke={GRID_LINE} strokeWidth="2.2" fill="none">
        <rect x="10" y="10" width="380" height="380" />
        <line x1="10" y1="10" x2="390" y2="390" />
        <line x1="390" y1="10" x2="10" y2="390" />
        <line x1="200" y1="10" x2="10" y2="200" />
        <line x1="10" y1="200" x2="200" y2="390" />
        <line x1="200" y1="390" x2="390" y2="200" />
        <line x1="390" y1="200" x2="200" y2="10" />
      </g>

      {/* Labels & Planets */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const center = HOUSE_CENTERS[hnum];
        const isRef = hnum === referenceHouse;
        const hGrahas = grahasByHouse[hnum] || [];
        
        return (
          <g key={`lbl-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            {isRef && (
              <text y="-20" textAnchor="middle" dominantBaseline="middle" fontSize={15} fontWeight={800} fill={GOLD_ACCENT}>REF</text>
            )}
            <text y={isRef ? -4 : -8} textAnchor="middle" dominantBaseline="middle" fontSize={isRef ? 14 : 18} fontWeight={isRef ? 800 : 700} fill={isRef ? GOLD_ACCENT : INK_SECONDARY}>
              {isRef ? `H${hnum}` : hnum}
            </text>
            {/* Display Planets */}
            {hGrahas.map((g, idx) => {
              const yOffset = 8 + (idx * 14);
              return (
                <text key={g.key} y={yOffset} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={800} fill={readableColor(g.color)}>
                  {g.label}
                </text>
              );
            })}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(16, 418)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.32} stroke={GOLD_ACCENT} strokeWidth={1.5} />
        <text x={18} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Reference</text>
        <rect x={96} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.32} stroke={GREEN} strokeWidth={1.5} />
        <text x={114} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Positive</text>
        <rect x={176} y={0} width={12} height={12} rx={2} fill={VERMILION} fillOpacity={0.3} stroke={VERMILION} strokeWidth={1.5} />
        <text x={194} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Virodha</text>
        <rect x={256} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.16} stroke={GREEN} strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={274} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Secondary</text>
      </g>
    </svg>
  );
}

/* --- Main component --- */

export function ArgalaExplorer() {
  const [referenceHouse, setReferenceHouse] = useState(7);
  const [placements, setPlacements] = useState<Partial<Record<GrahaKey, number>>>({ Venus: 8, Mars: 9, Moon: 10, Jupiter: 1, Mercury: 8, Saturn: 12 });

  const result = useMemo(() => computeArgala(referenceHouse, placements), [referenceHouse, placements]);

  function setGrahaHouse(graha: GrahaKey, house: number) {
    setPlacements((prev) => ({ ...prev, [graha]: house }));
  }

  function removeGraha(graha: GrahaKey) {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[graha];
      return next;
    });
  }

  function applyPreset(key: string) {
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    setReferenceHouse(p.referenceHouse);
    setPlacements({ ...p.placements });
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Target size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Argala</IAST> Explorer
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Jaimini&apos;s bolt-and-intervention doctrine: positive argala (2/4/11) vs virodhārgala (12/10/3).
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: INK_MUTED }}>Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p.key)}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            title={p.description}
          >
            {p.label}
          </button>
        ))}
        <button
          onClick={() => applyPreset("clear")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <RotateCcw size={11} />
          Clear
        </button>
      </div>

      {/* Reference + Diagram row */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Left: Reference selector + Planet placement */}
        <div className="xl:col-span-3 rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          {/* Reference */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Reference house</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setReferenceHouse(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: referenceHouse === i + 1 ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${referenceHouse === i + 1 ? GOLD_ACCENT : HAIRLINE}`,
                    color: referenceHouse === i + 1 ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Planet placement */}
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Planet placement</div>
            <div className="space-y-1.5">
              {GRAHAS.map((g) => {
                const current = placements[g.key];
                return (
                  <div key={g.key} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-16" style={{ color: readableColor(g.color) }}>{g.label}</span>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: 12 }, (_, i) => {
                        const h = i + 1;
                        const active = current === h;
                        return (
                          <button
                            key={h}
                            onClick={() => active ? removeGraha(g.key) : setGrahaHouse(g.key, h)}
                            className="w-7 h-7 rounded text-xs font-bold transition-colors"
                            style={{
                              background: active ? `${g.color}18` : "transparent",
                              border: `1.5px solid ${active ? g.color : HAIRLINE}`,
                              color: active ? g.color : INK_MUTED,
                            }}
                          >
                            {h}
                          </button>
                        );
                      })}
                    </div>
                    {current && (
                      <button onClick={() => removeGraha(g.key)} className="text-xs px-1.5 py-0.5 rounded" style={{ color: VERMILION, border: `1px solid ${HAIRLINE}` }}>
                        x
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Diagram + Overall result */}
        <div className="xl:col-span-2 space-y-3">
          <div className="rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <ArgalaDiagram referenceHouse={referenceHouse} placements={placements} result={result} />
          </div>

          <div
            className="rounded-lg p-3 space-y-2"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.overallColor}` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Overall Net</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${result.overallColor}12`, color: result.overallColor }}>
                {result.overallVerdict}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: INK_SECONDARY }}>
              <span>Positive: <strong style={{ color: GREEN }}>{result.totalPositive}</strong></span>
              <span>Obstructing: <strong style={{ color: VERMILION }}>{result.totalVirodha}</strong></span>
              <span>Net: <strong style={{ color: result.overallColor }}>{result.overallNet > 0 ? `+${result.overallNet}` : result.overallNet}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Pair breakdown */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Scale size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Pair-by-Pair Net</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {result.pairs.map((pair, i) => (
            <div key={i} className="rounded-lg p-3 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold" style={{ color: INK_SECONDARY }}>Channel {i + 1}</span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${pair.net === "positive" ? GREEN : pair.net === "negative" ? VERMILION : AMBER}12`, color: pair.net === "positive" ? GREEN : pair.net === "negative" ? VERMILION : AMBER }}>
                  {pair.net === "positive" ? "Survives" : pair.net === "negative" ? "Obstructed" : "Neutral"}
                </span>
              </div>

              {/* Positive */}
              <div className="rounded p-2 space-y-1" style={{ background: `${GREEN}06`, border: `1px solid ${GREEN}` }}>
                <div className="flex items-center gap-1.5">
                  <Plus size={10} style={{ color: GREEN }} />
                  <span className="text-xs font-bold" style={{ color: GREEN }}>H{pair.positiveHouse} ({pair.positiveLabel})</span>
                  <span className="text-xs ml-auto font-bold" style={{ color: GREEN }}>{pair.positiveCount}</span>
                </div>
                {pair.positiveGrahas.length > 0 && (
                  <div className="text-xs" style={{ color: INK_SECONDARY }}>
                    {pair.positiveGrahas.map((g) => GRAHAS.find((gg) => gg.key === g)!.label).join(", ")}
                  </div>
                )}
              </div>

              {/* Virodha */}
              <div className="rounded p-2 space-y-1" style={{ background: `${VERMILION}06`, border: `1px solid ${VERMILION}` }}>
                <div className="flex items-center gap-1.5">
                  <Minus size={10} style={{ color: VERMILION }} />
                  <span className="text-xs font-bold" style={{ color: VERMILION }}>H{pair.virodhaHouse} ({pair.virodhaLabel})</span>
                  <span className="text-xs ml-auto font-bold" style={{ color: VERMILION }}>{pair.virodhaCount}</span>
                </div>
                {pair.virodhaGrahas.length > 0 && (
                  <div className="text-xs" style={{ color: INK_SECONDARY }}>
                    {pair.virodhaGrahas.map((g) => GRAHAS.find((gg) => gg.key === g)!.label).join(", ")}
                  </div>
                )}
              </div>

              <div className="text-xs" style={{ color: INK_MUTED }}>{pair.netLabel}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary 5th */}
      <div
        className="rounded-lg p-3 flex items-center justify-between flex-wrap gap-2"
        style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GREEN}` }}
      >
        <div className="flex items-center gap-2">
          <Info size={12} style={{ color: GREEN }} />
          <span className="text-xs font-bold" style={{ color: INK_SECONDARY }}>
            Secondary positive: H{result.secondaryPositive.house} ({result.secondaryPositive.label})
          </span>
          {result.secondaryPositive.grahas.length > 0 && (
            <span className="text-xs" style={{ color: INK_SECONDARY }}>
              {result.secondaryPositive.grahas.map((g) => GRAHAS.find((gg) => gg.key === g)!.label).join(", ")} ({result.secondaryPositive.count})
            </span>
          )}
        </div>
        <span className="text-xs" style={{ color: INK_MUTED }}>Some authorities add the 5th as a softer supporting position.</span>
      </div>

      {/* 5-step workflow */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ArrowRight size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Five-Step Workflow</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {WORKFLOW_STEPS.map((step) => (
            <div key={step.num} className="rounded-lg p-2.5 space-y-1" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderTop: `3px solid ${GOLD_ACCENT}` }}>
              <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>{step.num}. {step.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{step.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Concept note */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>Key Discipline</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Argala is <strong>relative, never absolute</strong>. No house is inherently an argala house -- it becomes one only relative to the reference you choose.
          The same physical house can be positive argala for one reference and virodhārgala for another. Always count from the reference, never assume from the lagna.
          A planet&apos;s nature (benefic/malefic) colours the <em>quality</em> of the argala, but argala itself is generated by <em>position</em>.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Counting from the lagna by default", text: "Argala houses are relative to the chosen reference, not fixed chart positions. From the 7th, the argala houses are 8, 10, and 5 -- not 2, 4, 11." },
            { title: "Ignoring virodhārgala", text: "Never stop at positive argala. Always check the counter-house. The house receives only the net intervention." },
            { title: "Wrong obstruction pairs", text: "The pairs are fixed: 12th obstructs 2nd, 10th obstructs 4th, 3rd obstructs 11th. Each obstructor has exactly one target." },
            { title: "Treating argala as the whole verdict", text: "Argala sharpens the reading; it does not replace it. The house lord, occupants, and aspects still matter." },
            { title: "Benefic-only argala", text: "Any planet in an argala house gives argala by position. Nature colours quality, not existence." },
            { title: "Cancelling by even counts", text: "Positive argala occupants compound; they never cancel each other. Only virodhārgala cancels." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}>
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
