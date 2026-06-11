"use client";

/**
 * Ārūḍha Pāda Finder -- Lesson 17.4.1 Interactive
 *
 * Double-count computation, 1st/7th exception detection,
 * reality-vs-perception comparison, and step-by-step walker.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import { SIGNS, computeArudha, PRESETS, REALITY_PERCEPTION } from "./data";
import type { ArudhaResult } from "./data";
import {
  Eye,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
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

/* --- SVG helpers --- */

function houseXY(cx: number, cy: number, r: number, house: number) {
  const angleDeg = (house - 1) * 30 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function sectorPath(cx: number, cy: number, rIn: number, rOut: number, house: number, widthDeg = 28) {
  const mid = (house - 1) * 30 - 90;
  const start = ((mid - widthDeg / 2) * Math.PI) / 180;
  const end = ((mid + widthDeg / 2) * Math.PI) / 180;
  const x1 = cx + rIn * Math.cos(start);
  const y1 = cy + rIn * Math.sin(start);
  const x2 = cx + rOut * Math.cos(start);
  const y2 = cy + rOut * Math.sin(start);
  const x3 = cx + rOut * Math.cos(end);
  const y3 = cy + rOut * Math.sin(end);
  const x4 = cx + rIn * Math.cos(end);
  const y4 = cy + rIn * Math.sin(end);
  return `M ${x1} ${y1} L ${x2} ${y2} A ${rOut} ${rOut} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rIn} ${rIn} 0 0 0 ${x1} ${y1} Z`;
}

/* --- Circular diagram --- */

function ArudhaDiagram({ result }: { result: ArudhaResult }) {
  const w = 420;
  const h = 440;
  const cx = w / 2;
  const cy = h / 2 - 8;
  const r = 140;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 400 }}>
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

        return <path key={hnum} d={sectorPath(cx, cy, 48, r + 6, hnum, 26)} fill={fill} fillOpacity={opacity} stroke="none" />;
      })}

      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 46} fill="none" stroke={HAIRLINE} strokeWidth={0.8} strokeDasharray="3 3" />

      {Array.from({ length: 12 }, (_, i) => {
        const a = houseXY(cx, cy, r, i + 1);
        const b = houseXY(cx, cy, r - 9, i + 1);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={HAIRLINE} strokeWidth={1} />;
      })}

      {Array.from({ length: 12 }, (_, i) => {
        const pos = houseXY(cx, cy, r + 24, i + 1);
        const hnum = i + 1;
        const isHouse = hnum === result.house;
        const isLord = hnum === result.lord;
        const isPada = hnum === result.finalPada;
        let color = INK_MUTED;
        if (isHouse) color = GOLD_ACCENT;
        else if (isLord) color = BLUE;
        else if (isPada) color = GREEN;
        return (
          <text key={i} x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={isHouse || isLord || isPada ? 700 : 600} fill={color}>
            {hnum}
          </text>
        );
      })}

      {/* Sign names inside */}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = houseXY(cx, cy, r - 26, i + 1);
        const hnum = i + 1;
        const isKey = hnum === result.house || hnum === result.lord || hnum === result.finalPada;
        return (
          <text key={`sig-${i}`} x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={isKey ? 700 : 400} fill={isKey ? INK_SECONDARY : INK_MUTED}>
            {SIGNS[i].slice(0, 3)}
          </text>
        );
      })}

      {/* Centre */}
      <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={INK_MUTED}>Double-count</text>
      <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_MUTED}>n = {result.n}</text>

      {/* Legend */}
      <g transform={`translate(20, ${h - 44})`}>
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.15} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={18} y={11} fontSize={11} fill={INK_SECONDARY}>House</text>
        <rect x={68} y={0} width={12} height={12} rx={2} fill={BLUE} fillOpacity={0.15} stroke={BLUE} strokeWidth={1} />
        <text x={86} y={11} fontSize={11} fill={INK_SECONDARY}>Lord</text>
        <rect x={130} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.15} stroke={GREEN} strokeWidth={1} />
        <text x={148} y={11} fontSize={11} fill={INK_SECONDARY}>Pada</text>
        {result.exceptionFired && (
          <>
            <rect x={192} y={0} width={12} height={12} rx={2} fill={VERMILION} fillOpacity={0.08} stroke={VERMILION} strokeWidth={1} strokeDasharray="2 1" />
            <text x={210} y={11} fontSize={11} fill={INK_SECONDARY}>Prohibited</text>
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
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lord's position</span>
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
