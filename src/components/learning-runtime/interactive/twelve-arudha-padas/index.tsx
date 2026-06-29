"use client";

/**
 * Twelve Ārūḍha Padas -- Lesson 17.4.2 Interactive
 *
 * Computes all twelve ārūḍha padas from a Lagna and lord-position pattern.
 * Highlights AL (A1) and UL (A12) and visualises the Lagna-AL gap.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import { SIGNS, wrap, computePada, HOUSE_SIGNIFICATIONS, PATTERNS } from "./data";
import type { LordPattern } from "./data";
import {
  Eye,
  Target,
  MapPin,
  AlertTriangle,
  RotateCcw,
  Info,
  Heart,
  User,
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
const PURPLE = "#8B5CF6";
const BLUE = "#3B82F6";
const GRID_LINE = "rgba(90, 78, 46, 0.95)";



function PadaMap({ lagna, al, ul }: { lagna: number; al: number; ul: number }) {
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
    <svg viewBox="0 0 400 448" className="w-full h-auto" style={{ maxHeight: 430, minHeight: 360 }}>
      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const isLagna = hnum === lagna;
        const isAl = hnum === al;
        const isUl = hnum === ul;
        
        let fill = "transparent";
        let opacity = 0;
        if (isLagna) { fill = GOLD_ACCENT; opacity = 0.2; }
        else if (isAl) { fill = GREEN; opacity = 0.22; }
        else if (isUl) { fill = PURPLE; opacity = 0.2; }

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
        const isLagna = hnum === lagna;
        const isAl = hnum === al;
        const isUl = hnum === ul;
        const isKey = isLagna || isAl || isUl;

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

      {/* Centre */}
      <text x={200} y={190} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK_PRIMARY}>AL-UL</text>

      {/* Legend */}
      <g transform="translate(16, 418)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.3} stroke={GOLD_ACCENT} strokeWidth={1.5} />
        <text x={18} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Lagna</text>
        <rect x={78} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.3} stroke={GREEN} strokeWidth={1.5} />
        <text x={96} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>AL</text>
        <rect x={128} y={0} width={12} height={12} rx={2} fill={PURPLE} fillOpacity={0.3} stroke={PURPLE} strokeWidth={1.5} />
        <text x={146} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>UL</text>
      </g>
    </svg>
  );
}

/* --- Main component --- */

export function TwelveArudhaPadas() {
  const [lagna, setLagna] = useState(1);
  const [pattern, setPattern] = useState<LordPattern>("random");
  const [lordPositions, setLordPositions] = useState<number[]>([5, 3, 7, 10, 1, 9, 11, 2, 6, 12, 8, 4]);

  const padas = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const house = wrap(lagna + i);
      const lordPos = lordPositions[i];
      return computePada(house, lordPos);
    });
  }, [lagna, lordPositions]);

  const al = padas[0].finalPada;
  const ul = padas[11].finalPada;

  function applyPattern(key: LordPattern) {
    setPattern(key);
    if (key === "custom") return;
    const p = PATTERNS.find((x) => x.key === key)!;
    const next = p.get(lagna);
    if (next.length === 12) setLordPositions(next);
  }

  function setLord(i: number, pos: number) {
    setLordPositions((prev) => {
      const next = [...prev];
      next[i] = pos;
      return next;
    });
    setPattern("custom");
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Eye size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            The Twelve <IAST>Ārūḍha Padas</IAST>
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            One image-pāda per house. AL (A1) = image of self. UL (A12) = image of spouse.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lagna (natal rising sign)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => { setLagna(i + 1); applyPattern(pattern); }}
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
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[lagna - 1]}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lord placement pattern</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PATTERNS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => applyPattern(p.key)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
                  style={{
                    background: pattern === p.key ? "rgba(59,130,246,0.08)" : "transparent",
                    border: `1.5px solid ${pattern === p.key ? BLUE : HAIRLINE}`,
                    color: pattern === p.key ? BLUE : INK_SECONDARY,
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{PATTERNS.find((p) => p.key === pattern)?.description}</div>
          </div>
        </div>

        <button
          onClick={() => applyPattern("random")}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <RotateCcw size={11} /> Reset pattern
        </button>
      </div>

      {/* AL + UL hero */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-lg p-3 space-y-1" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
          <div className="flex items-center gap-2">
            <User size={14} style={{ color: GOLD_ACCENT }} />
            <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Natal Lagna</span>
          </div>
          <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{lagna} ({SIGNS[lagna - 1]})</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>{HOUSE_SIGNIFICATIONS[0].reality}</div>
        </div>

        <div className="rounded-lg p-3 space-y-1" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
          <div className="flex items-center gap-2">
            <Eye size={14} style={{ color: GREEN }} />
            <span className="text-xs font-bold" style={{ color: GREEN }}>Ārūḍha Lagna (A1)</span>
          </div>
          <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{al} ({SIGNS[al - 1]})</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>{HOUSE_SIGNIFICATIONS[0].pada}</div>
        </div>

        <div className="rounded-lg p-3 space-y-1" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
          <div className="flex items-center gap-2">
            <Heart size={14} style={{ color: PURPLE }} />
            <span className="text-xs font-bold" style={{ color: PURPLE }}>Upapada (A12)</span>
          </div>
          <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{ul} ({SIGNS[ul - 1]})</div>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>{HOUSE_SIGNIFICATIONS[11].pada}</div>
        </div>
      </div>

      {/* Lagna-AL-UL map */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <PadaMap lagna={lagna} al={al} ul={ul} />
        </div>
        <div className="xl:col-span-3 rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
          <div className="flex items-center gap-2">
            <Info size={14} style={{ color: AMBER }} />
            <span className="text-xs font-bold" style={{ color: AMBER }}>Reading the Lagna-AL Gap</span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            The distance between the natal Lagna and the Ārūḍha Lagna measures how far the native&apos;s <strong>reality</strong> diverges from their <strong>public image</strong>.
          </p>
          <ul className="text-xs space-y-1" style={{ color: INK_SECONDARY }}>
            <li><strong>Same sign:</strong> image and reality coincide -- what people see is what there is.</li>
            <li><strong>Wide gap:</strong> reputation and substance may diverge; read both layers carefully.</li>
            <li><strong>AL stronger / better placed:</strong> the native appears more successful than they feel.</li>
            <li><strong>Lagna stronger / better placed:</strong> the native is more capable than the world recognises.</li>
          </ul>
          <p className="text-xs" style={{ color: INK_MUTED }}>
            The Upapada (A12) is the second most-used pāda. It shows the <strong>image of marriage and the spouse</strong>, not the marriage itself (7th house).
          </p>
        </div>
      </div>

      {/* All 12 padas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>All Twelve Pādas</h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {padas.map((p, i) => {
            const sig = HOUSE_SIGNIFICATIONS[i];
            const isAl = i === 0;
            const isUl = i === 11;
            const accent = isAl ? GREEN : isUl ? PURPLE : GOLD_ACCENT;
            return (
              <div
                key={i}
                className="rounded-lg p-2.5 space-y-1.5"
                style={{
                  background: SURFACE,
                  border: `1px solid ${HAIRLINE}`,
                  borderLeft: `3px solid ${accent}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: accent }}>A{i + 1}</span>
                  {p.exceptionFired && <AlertTriangle size={10} style={{ color: VERMILION }} />}
                </div>
                <div className="text-xs" style={{ color: INK_MUTED }}>H{p.house} ({SIGNS[p.house - 1].slice(0, 3)})</div>

                <label className="block">
                  <span className="text-xs" style={{ color: INK_MUTED }}>Lord</span>
                  <select
                    value={p.lordPos}
                    onChange={(e) => setLord(i, Number(e.target.value))}
                    className="w-full mt-0.5 rounded px-1.5 py-1 text-xs font-semibold"
                    style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                  >
                    {Array.from({ length: 12 }, (_, j) => (
                      <option key={j + 1} value={j + 1}>H{j + 1}</option>
                    ))}
                  </select>
                </label>

                <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  {SIGNS[p.finalPada - 1]}
                </div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>{sig.pada}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Using only AL and ignoring the rest", text: "AL and UL are the most-used, but each A1-A12 has a distinct image-role. Do not reduce the doctrine to two points." },
            { title: "Reading A7 as the real marriage", text: "A7 is the IMAGE of partnership. The real marriage is the 7th house itself. The Upapada (A12) is the spouse-image." },
            { title: "Confusing A12 with the 12th house", text: "The 12th house is loss/liberation. A12 (Upapada) is the image of the spouse and marriage -- a completely different meaning." },
            { title: "Forgetting the 1st/7th exception", text: "When computing padas in bulk, it is easy to miss an exception. Always check if the first landing is the 1st or 7th from the source house." },
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
