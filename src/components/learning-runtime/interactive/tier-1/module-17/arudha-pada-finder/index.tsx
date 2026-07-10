"use client";

/**
 * Ārūḍha Pāda Finder -- Lesson 17.4.1 Interactive
 *
 * Double-count computation, 1st/7th exception detection,
 * reality-vs-perception comparison, and step-by-step walker.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { SIGNS, computeArudha, PRESETS, REALITY_PERCEPTION } from "./data";
import type { ArudhaResult } from "./data";
import {
  Eye,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Info,
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
const GRID_LINE = "rgba(138, 126, 94, 0.85)";



function ArudhaDiagram({ result }: { result: ArudhaResult }) {
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
    <svg viewBox="0 0 400 440" className="w-full h-auto" style={{ maxHeight: 320 }}>
      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const isHouse = hnum === result.house;
        const isLord = hnum === result.lord;
        const isPada = hnum === result.finalPada;
        const isFirstLanding = result.exceptionFired && hnum === result.shiftedFrom;

        let fill = "transparent";
        let opacity = 0;
        if (isHouse) { fill = GOLD_ACCENT; opacity = 0.12; }
        else if (isLord) { fill = BLUE; opacity = 0.12; }
        else if (isPada) { fill = GREEN; opacity = 0.15; }
        else if (isFirstLanding) { fill = VERMILION; opacity = 0.08; }

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
      <g stroke={GRID_LINE} strokeWidth="1.5" fill="none">
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
        const isHouse = hnum === result.house;
        const isLord = hnum === result.lord;
        const isPada = hnum === result.finalPada;
        const isFirstLanding = result.exceptionFired && hnum === result.shiftedFrom;
        const isKey = isHouse || isLord || isPada || isFirstLanding;
        
        let color = INK_SECONDARY;
        if (isHouse) color = GOLD_ACCENT;
        else if (isLord) color = BLUE;
        else if (isPada) color = GREEN;

        return (
          <g key={`lbl-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            <text y={-4} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={isKey ? 800 : 600} fill={color}>
              {hnum}
            </text>
            <text y={10} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={isKey ? 700 : 400} fill={INK_SECONDARY}>
              {SIGNS[i].slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Centre */}
      <text x={200} y={190} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={INK_SECONDARY}>Double-count</text>
      <text x={200} y={205} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_SECONDARY}>n = {result.n}</text>

      {/* Legend */}
      <g transform="translate(16, 415)">
        <rect x={0} y={0} width={10} height={10} rx={2} fill={GOLD_ACCENT} fillOpacity={0.15} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={15} y={9} fontSize={11} fill={INK_SECONDARY}>House</text>
        <rect x={65} y={0} width={10} height={10} rx={2} fill={BLUE} fillOpacity={0.15} stroke={BLUE} strokeWidth={1} />
        <text x={80} y={9} fontSize={11} fill={INK_SECONDARY}>Lord</text>
        <rect x={125} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.15} stroke={GREEN} strokeWidth={1} />
        <text x={140} y={9} fontSize={11} fill={INK_SECONDARY}>Pada</text>
        {result.exceptionFired && (
          <>
            <rect x={185} y={0} width={10} height={10} rx={2} fill={VERMILION} fillOpacity={0.08} stroke={VERMILION} strokeWidth={1} strokeDasharray="2 1" />
            <text x={200} y={9} fontSize={11} fill={INK_SECONDARY}>Prohibited</text>
          </>
        )}
      </g>
    </svg>
  );
}

/* --- Main component --- */

export function ArudhaPadaFinder() {
  const [house, setHouse] = useState(1);
  const [lord, setLord] = useState(5);
  const [showSteps, setShowSteps] = useState(true);

  const result = useMemo(() => computeArudha(house, lord), [house, lord]);
  const rp = REALITY_PERCEPTION[house - 1];

  function applyPreset(key: string) {
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    setHouse(p.house);
    setLord(p.lord);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Eye size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Ārūḍha Pāda</IAST> Finder
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            The double-count: house to lord, then the same again from the lord.
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
      </div>

      {/* Controls + Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Controls */}
        <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>House (reference)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setHouse(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: house === i + 1 ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${house === i + 1 ? GOLD_ACCENT : HAIRLINE}`,
                    color: house === i + 1 ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[house - 1]} -- {rp.reality}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lord&apos;s position</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setLord(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: lord === i + 1 ? "rgba(59,130,246,0.08)" : "transparent",
                    border: `1.5px solid ${lord === i + 1 ? BLUE : HAIRLINE}`,
                    color: lord === i + 1 ? BLUE : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[lord - 1]} -- {lord === house ? "Lord in own sign" : lord === wrap(house + 6) ? "Lord in 7th from house" : `Lord in ${wrap(lord - house + 1)}${wrap(lord - house + 1) === 1 ? 'st' : wrap(lord - house + 1) === 2 ? 'nd' : wrap(lord - house + 1) === 3 ? 'rd' : 'th'} from house`}</div>
          </div>
        </div>

        {/* Diagram */}
        <div className="rounded-lg p-2" style={{ border: `1px solid ${HAIRLINE}` }}>
          <ArudhaDiagram result={result} />
        </div>
      </div>

      {/* Step-by-step */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <ArrowRight size={16} style={{ color: GOLD_ACCENT }} />
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Step-by-Step Computation</h4>
          </div>
          <button onClick={() => setShowSteps((v) => !v)} className="px-2 py-1 rounded text-xs font-semibold" style={{ border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>
            {showSteps ? "Hide steps" : "Show steps"}
          </button>
        </div>

        {showSteps && (
          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded-md p-2" style={{ background: "rgba(156,122,47,0.04)", border: `1px solid ${GOLD_ACCENT}` }}>
              <span className="text-xs font-bold mt-0.5" style={{ color: GOLD_ACCENT }}>1</span>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>
                Count from <strong>H{result.house}</strong> ({SIGNS[result.house - 1]}) to the lord at <strong>H{result.lord}</strong> ({SIGNS[result.lord - 1]}).
                Inclusive count: <strong>n = {result.n}</strong>.
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-md p-2" style={{ background: "rgba(59,130,246,0.04)", border: `1px solid ${BLUE}` }}>
              <span className="text-xs font-bold mt-0.5" style={{ color: BLUE }}>2</span>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>
                Count <strong>n = {result.n}</strong> signs forward from the lord (H{result.lord}, {SIGNS[result.lord - 1]}).
                First landing: <strong>H{result.firstLanding}</strong> ({SIGNS[result.firstLanding - 1]}).
              </div>
            </div>

            {result.exceptionFired && (
              <div className="flex items-start gap-2 rounded-md p-2" style={{ background: "rgba(162,58,30,0.04)", border: `1px solid ${VERMILION}` }}>
                <AlertTriangle size={14} style={{ color: VERMILION, marginTop: 2, flexShrink: 0 }} />
                <div className="text-xs" style={{ color: INK_SECONDARY }}>
                  <strong style={{ color: VERMILION }}>Exception fired!</strong> The landing (H{result.shiftedFrom}, {SIGNS[result.shiftedFrom! - 1]}) is the <strong>{result.exceptionType}</strong> from the house -- prohibited.
                  Shift to the <strong>10th from that landing</strong> = H{result.finalPada} ({SIGNS[result.finalPada - 1]}).
                </div>
              </div>
            )}

            {!result.exceptionFired && (
              <div className="flex items-start gap-2 rounded-md p-2" style={{ background: "rgba(47,125,85,0.04)", border: `1px solid ${GREEN}` }}>
                <CheckCircle2 size={14} style={{ color: GREEN, marginTop: 2, flexShrink: 0 }} />
                <div className="text-xs" style={{ color: INK_SECONDARY }}>
                  <strong style={{ color: GREEN }}>No exception.</strong> H{result.firstLanding} is neither the 1st nor the 7th from H{result.house}. The pada stands.
                </div>
              </div>
            )}

            <div
              className="rounded-md p-3 flex items-center gap-2"
              style={{ background: "rgba(47,125,85,0.06)", border: `1px solid ${GREEN}`, borderLeft: `3px solid ${GREEN}` }}
            >
              <Target size={16} style={{ color: GREEN }} />
              <span className="text-sm font-bold" style={{ color: GREEN }}>
                Final Pāda: H{result.finalPada} ({SIGNS[result.finalPada - 1]})
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reality vs Perception */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Reality vs Perception -- H{house}</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-md p-3 space-y-1" style={{ background: "rgba(156,122,47,0.04)", border: `1px solid ${GOLD_ACCENT}` }}>
            <div className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Reality (the house itself)</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{rp.reality}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>Sign: {SIGNS[house - 1]}</div>
          </div>
          <div className="rounded-md p-3 space-y-1" style={{ background: "rgba(47,125,85,0.04)", border: `1px solid ${GREEN}` }}>
            <div className="text-xs font-bold" style={{ color: GREEN }}>Perception (the ārūḍha)</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{rp.perception}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>Sign: {SIGNS[result.finalPada - 1]}</div>
          </div>
        </div>
      </div>

      {/* Exception note */}
      <div className="rounded-lg p-3 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>The 1st/7th Exception</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          A sign cannot be its own image (1st from house = the house itself). The 7th is the direct mirror, treated as an unstable reflection.
          When the double-count lands on either, shift to the <strong>10th from that landing</strong>.
          Full treatment in Lesson 17.4.5.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Single count only", text: "Counting to the lord and stopping. The ārūḍha is the DOUBLE count: to the lord, then the same again from the lord." },
            { title: "Confusing ārūḍha with the house", text: "The ārūḍha is the image (māyā), not the reality. The house = what is true; the ārūḍha = what appears." },
            { title: "Reversing the second count", text: "Both counts go forward in zodiacal order. Never reverse the second count." },
            { title: "Ignoring the lord's role", text: "The ārūḍha is anchored to the lord's placement. Any method that ignores the lord is not the ārūḍha." },
            { title: "Forgetting the exception", text: "If the landing is the 1st or 7th from the house, shift to the 10th from that point. Always check." },
            { title: "Over-literalising the image", text: "The ārūḍha is an interpretive layer. Neither dismiss it as decorative nor read it as the whole truth." },
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

function wrap(n: number): number {
  return ((n - 1) % 12) + 1;
}
