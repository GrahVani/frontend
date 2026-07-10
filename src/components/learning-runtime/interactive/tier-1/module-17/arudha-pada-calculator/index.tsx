"use client";

/**
 * Ārūḍha Pāda Calculator (Upapada mode) -- Lesson 17.4.3 Interactive
 *
 * Computes the Upapada Lagna from the 12th house, shows the double-count
 * steps, the 2nd-from-UL, planet-placements, and cross-check reminders.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  SIGNS,
  LORDS,
  GRAHAS,
  PRESETS,
  computeUpapada,
  sustenanceReadings,
  UL_SIGN_READING,
} from "./data";
import type { GrahaKey } from "./data";
import {
  Heart,
  Target,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Info,
  BookOpen,
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
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";
const TEAL = "#0D9488";
const GRID_LINE = "rgba(90, 78, 46, 0.95)";



function UpapadaDiagram({
  lagna,
  sourceHouse,
  lordPos,
  ul,
  secondFromUl,
}: {
  lagna: number;
  sourceHouse: number;
  lordPos: number;
  ul: number;
  secondFromUl: number;
}) {
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

  return (
    <svg viewBox="0 0 400 456" className="w-full h-auto" style={{ maxHeight: 440, minHeight: 370 }}>
      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        let fill = "transparent";
        let opacity = 0;
        if (hnum === lagna) { fill = GOLD_ACCENT; opacity = 0.2; }
        else if (hnum === sourceHouse) { fill = BLUE; opacity = 0.2; }
        else if (hnum === lordPos) { fill = TEAL; opacity = 0.2; }
        else if (hnum === ul) { fill = GREEN; opacity = 0.22; }
        else if (hnum === secondFromUl) { fill = PURPLE; opacity = 0.2; }

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

      {/* Labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const center = HOUSE_CENTERS[hnum];
        const isKey = hnum === lagna || hnum === sourceHouse || hnum === lordPos || hnum === ul || hnum === secondFromUl;

        return (
          <g key={`lbl-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            <text y={-6} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={isKey ? 800 : 700} fill={isKey ? INK_PRIMARY : INK_SECONDARY}>
              {hnum}
            </text>
            <text y={12} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={isKey ? 800 : 600} fill={isKey ? INK_PRIMARY : INK_SECONDARY}>
              {SIGNS[i].slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(16, 414)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.3} stroke={GOLD_ACCENT} strokeWidth={1.5} />
        <text x={18} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Lagna</text>
        <rect x={82} y={0} width={12} height={12} rx={2} fill={BLUE} fillOpacity={0.3} stroke={BLUE} strokeWidth={1.5} />
        <text x={100} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>12th</text>
        <rect x={146} y={0} width={12} height={12} rx={2} fill={TEAL} fillOpacity={0.3} stroke={TEAL} strokeWidth={1.5} />
        <text x={164} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Lord</text>
        
        <rect x={0} y={24} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.3} stroke={GREEN} strokeWidth={1.5} />
        <text x={18} y={35} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>UL</text>
        <rect x={82} y={24} width={12} height={12} rx={2} fill={PURPLE} fillOpacity={0.3} stroke={PURPLE} strokeWidth={1.5} />
        <text x={100} y={35} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>2nd-from-UL</text>
      </g>
    </svg>
  );
}

/* --- Component --- */

export function ArudhaPadaCalculator() {
  const [lagna, setLagna] = useState(1);
  const [lordPos, setLordPos] = useState(4);
  const [ulOccupants, setUlOccupants] = useState<GrahaKey[]>([]);
  const [secondOccupants, setSecondOccupants] = useState<GrahaKey[]>(["Ju"]);

  const result = useMemo(() => computeUpapada(lagna, lordPos), [lagna, lordPos]);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setLagna(p.lagna);
    setLordPos(p.lordPos);
    setUlOccupants(p.ulOccupants);
    setSecondOccupants(p.secondOccupants);
  }

  function toggleOccupant(list: GrahaKey[], key: GrahaKey, set: (v: GrahaKey[]) => void) {
    if (list.includes(key)) set(list.filter((k) => k !== key));
    else set([...list, key]);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart size={22} style={{ color: GREEN }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Upapada Lagna Calculator
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Compute the <IAST>Upapada Lagna</IAST> from the 12th house, read the marriage-image, and check the 2nd-from-UL for sustenance.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Natal Lagna</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setLagna(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: lagna === i + 1 ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${lagna === i + 1 ? GOLD_ACCENT : HAIRLINE}`,
                    color: lagna === i + 1 ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[lagna - 1]} ({LORDS[lagna - 1]})</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>12th lord placement</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setLordPos(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: lordPos === i + 1 ? "rgba(59,130,246,0.08)" : "transparent",
                    border: `1.5px solid ${lordPos === i + 1 ? BLUE : HAIRLINE}`,
                    color: lordPos === i + 1 ? BLUE : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>
              12th house is {SIGNS[result.sourceHouse - 1]} (lord: {LORDS[result.sourceHouse - 1]}), currently placed in {SIGNS[lordPos - 1]}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} style={{ color: AMBER }} />
            <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Presets</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => applyPreset(i)}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
                style={{
                  background: "transparent",
                  border: `1.5px solid ${HAIRLINE}`,
                  color: INK_SECONDARY,
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => applyPreset(0)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <RotateCcw size={11} /> Reset to lesson example
        </button>
      </div>

      {/* Computation strip */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} style={{ color: GREEN }} />
          <span className="text-sm font-bold" style={{ color: GREEN }}>Double-count result</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-md p-2.5" style={{ background: "rgba(59,130,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Source (12th)</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{result.sourceHouse} {SIGNS[result.sourceHouse - 1]}</div>
          </div>
          <div className="rounded-md p-2.5" style={{ background: "rgba(13,148,136,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Lord sits in</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{result.lordPos} {SIGNS[result.lordPos - 1]}</div>
          </div>
          <div className="rounded-md p-2.5" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>First count (n)</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{result.n} sign{result.n === 1 ? "" : "s"}</div>
          </div>
          <div className="rounded-md p-2.5" style={{ background: "rgba(139,92,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Landing before exception</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{result.firstLanding} {SIGNS[result.firstLanding - 1]}</div>
          </div>
        </div>

        {result.exceptionFired ? (
          <div className="rounded-md p-3 flex items-start gap-2" style={{ background: "rgba(162,58,30,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <AlertTriangle size={14} style={{ color: VERMILION, marginTop: 2 }} />
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              <strong>1st/7th exception fired:</strong> the first count landed in the {result.exceptionType} from the 12th.
              Standard correction shifts the pāda to the 10th from that landing.
            </div>
          </div>
        ) : (
          <div className="rounded-md p-3 flex items-start gap-2" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <CheckCircle2 size={14} style={{ color: GREEN, marginTop: 2 }} />
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              No 1st/7th exception applies. The first landing is valid and becomes the Upapada Lagna.
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg p-3 space-y-1" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
            <div className="text-xs font-bold" style={{ color: GREEN }}>Upapada Lagna (UL)</div>
            <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[result.finalPada - 1]}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>House {result.finalPada}</div>
          </div>
          <div className="rounded-lg p-3 space-y-1" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
            <div className="text-xs font-bold" style={{ color: PURPLE }}>2nd-from-UL</div>
            <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[result.secondFromUl - 1]}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>House {result.secondFromUl}</div>
          </div>
          <div className="rounded-lg p-3 space-y-1" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
            <div className="text-xs font-bold" style={{ color: AMBER }}>7th from Lagna</div>
            <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[((lagna + 5) % 12)]}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>Cross-check reality-layer</div>
          </div>
        </div>
      </div>

      {/* Diagram + reading */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <UpapadaDiagram lagna={lagna} sourceHouse={result.sourceHouse} lordPos={lordPos} ul={result.finalPada} secondFromUl={result.secondFromUl} />
        </div>
        <div className="xl:col-span-3 rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
          <div className="flex items-center gap-2">
            <Heart size={16} style={{ color: GREEN }} />
            <span className="text-sm font-bold" style={{ color: GREEN }}>Marriage-image reading</span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            {UL_SIGN_READING[result.finalPada]}
          </p>

          <div className="rounded-md p-3 space-y-1" style={{ background: "rgba(139,92,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold" style={{ color: PURPLE }}>Sustenance from 2nd-from-UL</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{sustenanceReadings(secondOccupants)}</div>
          </div>

          <p className="text-xs" style={{ color: INK_MUTED }}>
            Remember: the UL describes the <strong>image</strong> of the marriage, not the underlying reality. Always triangulate with the 7th house and the Dārākāraka.
          </p>
        </div>
      </div>

      {/* Planet placement toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
          <div className="flex items-center gap-2">
            <Heart size={14} style={{ color: GREEN }} />
            <span className="text-xs font-bold" style={{ color: GREEN }}>Planets in UL ({SIGNS[result.finalPada - 1]})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GRAHAS.map((g) => {
              const active = ulOccupants.includes(g.key);
              return (
                <button
                  key={g.key}
                  onClick={() => toggleOccupant(ulOccupants, g.key, setUlOccupants)}
                  className="px-2 py-1 rounded-md text-xs font-semibold transition-colors"
                  style={{
                    background: active ? "rgba(47,125,85,0.08)" : "transparent",
                    border: `1.5px solid ${active ? GREEN : HAIRLINE}`,
                    color: active ? GREEN : INK_SECONDARY,
                  }}
                >
                  {g.key}
                </button>
              );
            })}
          </div>
          <div className="text-xs" style={{ color: INK_MUTED }}>
            Selected: {ulOccupants.length === 0 ? "none" : ulOccupants.map((k) => GRAHAS.find((g) => g.key === k)?.name).join(", ")}
          </div>
        </div>

        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
          <div className="flex items-center gap-2">
            <Target size={14} style={{ color: PURPLE }} />
            <span className="text-xs font-bold" style={{ color: PURPLE }}>Planets in 2nd-from-UL ({SIGNS[result.secondFromUl - 1]})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {GRAHAS.map((g) => {
              const active = secondOccupants.includes(g.key);
              return (
                <button
                  key={g.key}
                  onClick={() => toggleOccupant(secondOccupants, g.key, setSecondOccupants)}
                  className="px-2 py-1 rounded-md text-xs font-semibold transition-colors"
                  style={{
                    background: active ? "rgba(139,92,246,0.08)" : "transparent",
                    border: `1.5px solid ${active ? PURPLE : HAIRLINE}`,
                    color: active ? PURPLE : INK_SECONDARY,
                  }}
                >
                  {g.key}
                </button>
              );
            })}
          </div>
          <div className="text-xs" style={{ color: INK_MUTED }}>
            Selected: {secondOccupants.length === 0 ? "none" : secondOccupants.map((k) => GRAHAS.find((g) => g.key === k)?.name).join(", ")}
          </div>
        </div>
      </div>

      {/* Cross-check panel */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={16} style={{ color: AMBER }} />
          <span className="text-sm font-bold" style={{ color: AMBER }}>Triangulation reminder</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-md p-3" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold mb-1" style={{ color: GREEN }}>UL (image)</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{SIGNS[result.finalPada - 1]} -- projected image of the marriage and spouse.</div>
          </div>
          <div className="rounded-md p-3" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold mb-1" style={{ color: BLUE }}>7th house (reality)</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{SIGNS[((lagna + 5) % 12)]} -- the Parāśarī house of partnership and on-the-ground marriage.</div>
          </div>
          <div className="rounded-md p-3" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold mb-1" style={{ color: GOLD_ACCENT }}>Dārākāraka</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>The cara spouse-significator -- lowest-degree planet among the seven cara kārakas.</div>
          </div>
        </div>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          A sound Jaimini reading weighs all three independently. Agreement strengthens the conclusion; divergence demands caution.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common UL mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Computing from the 7th instead of the 12th", text: "The UL is the ārūḍha of the 12th house. A7 is a different pāda entirely." },
            { title: "Stopping at the lord's sign", text: "The double-count requires two equal projections. The lord's sign is only the midpoint." },
            { title: "Ignoring the 2nd-from-UL", text: "The 2nd-from-UL governs sustenance and continuity; never read the UL without it." },
            { title: "Forgetting the 1st/7th exception", text: "When the first landing is the 1st or 7th from the 12th, shift to the 10th from that landing." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${VERMILION}` }}>
              <div className="text-xs font-bold" style={{ color: VERMILION }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
