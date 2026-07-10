"use client";

/**
 * Rāśi-Dṛṣṭi Mapper -- Lesson 17.5.2 Interactive
 *
 * Circular wheel chart. Place planets, select a target,
 * and see which signs aspect it -- with occupants and lords carried across.
 *
 * Note: Traditional Jyotiṣa consultation uses the North Indian diamond chart
 * (square with diagonal lines, houses fixed). The circle here is a teaching aid
 * for seeing the aspect geometry directly.
 */

import { useState, useMemo } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  SIGNS,
  SIGN_CLASSES,
  CLASS_LABELS,
  LORDS,
  GRAHAS,
  PRESETS,
  getAspectedSigns,
  getAspectsToTarget,
} from "./data";
import type { GrahaKey } from "./data";
import {
  Eye,
  Target,
  MapPin,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  Info,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const GRID_LINE = "rgba(138, 126, 94, 0.85)";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";

function signForHouse(lagna: number, house: number): number {
  return ((lagna - 1 + house - 1) % 12);
}


function CircularWheel({
  lagna,
  occupants,
  target,
  aspecting,
  onSelectTarget,
}: {
  lagna: number;
  occupants: GrahaKey[][];
  target: number;
  aspecting: number[];
  onSelectTarget: (signIdx: number) => void;
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

  const HOUSE_OCCUPANT_CENTERS: Record<number, { x: number; y: number }> = {
    1: { x: 200, y: 155 },
    2: { x: 155, y: 45 },
    3: { x: 45, y: 155 },
    4: { x: 155, y: 200 },
    5: { x: 45, y: 245 },
    6: { x: 155, y: 355 },
    7: { x: 200, y: 245 },
    8: { x: 245, y: 355 },
    9: { x: 355, y: 245 },
    10: { x: 245, y: 200 },
    11: { x: 355, y: 155 },
    12: { x: 245, y: 45 },
  };

  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" style={{ maxHeight: 400 }}>
      {/* Sector backgrounds */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);

        const isTarget = sIdx === target;
        const isAspecting = aspecting.includes(sIdx);
        const isLagna = hnum === 1;

        let fill = "transparent";
        let opacity = 0;
        if (isTarget) { fill = GOLD_ACCENT; opacity = 0.18; }
        else if (isAspecting) { fill = GREEN; opacity = 0.15; }
        else if (isLagna) { fill = BLUE; opacity = 0.08; }

        return (
          <polygon
            key={`sector-${hnum}`}
            points={HOUSE_POLYGONS[hnum]}
            fill={fill}
            fillOpacity={opacity > 0 ? opacity : undefined}
            stroke="none"
          />
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

      {/* House + sign labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const center = HOUSE_CENTERS[hnum];
        const isTarget = sIdx === target;
        const isAspecting = aspecting.includes(sIdx);
        return (
          <g key={`label-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            <text y={-6} textAnchor="middle" dominantBaseline="middle" fontSize={14} fontWeight={700} fill={isTarget ? GOLD_ACCENT : isAspecting ? GREEN : INK_MUTED}>
              H{hnum}
            </text>
            <text y={8} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={INK_PRIMARY}>
              {SIGNS[sIdx].slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Occupant chips */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const occ = occupants[sIdx];
        if (occ.length === 0) return null;
        const center = HOUSE_OCCUPANT_CENTERS[hnum];
        return (
          <text key={`occ-${hnum}`} x={center.x} y={center.y} textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight={700} fill={INK_SECONDARY}>
            {occ.join(" ")}
          </text>
        );
      })}

      {/* Clickable sectors */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        return (
          <polygon
            key={`hit-${hnum}`}
            points={HOUSE_POLYGONS[hnum]}
            fill="transparent"
            cursor="pointer"
            onClick={() => onSelectTarget(sIdx)}
          />
        );
      })}
    </svg>
  );
}

/* --- Component --- */

type ViewMode = "forward" | "reverse";

export function RashiDrishtiMapper() {
  const [lagna, setLagna] = useState(1);
  const [occupants, setOccupants] = useState<GrahaKey[][]>(PRESETS[0].occupants.map((a) => [...a]));
  const [target, setTarget] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("reverse");

  const aspected = useMemo(() => getAspectedSigns(target), [target]);
  const aspecting = useMemo(() => getAspectsToTarget(target), [target]);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setLagna(p.lagna);
    setOccupants(p.occupants.map((a) => [...a]));
    setTarget(p.target);
  }

  function toggleOccupant(signIdx: number, graha: GrahaKey) {
    setOccupants((prev) => {
      const next = prev.map((a) => [...a]);
      const arr = next[signIdx];
      if (arr.includes(graha)) next[signIdx] = arr.filter((g) => g !== graha);
      else next[signIdx] = [...arr, graha];
      return next;
    });
  }

  const activeAspecting = viewMode === "reverse" ? aspecting : aspected;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Target size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Rāśi-Dṛṣṭi</IAST> Mapper
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Place planets on the wheel, select a target, and see which signs aspect it.
          </p>
        </div>
      </div>

      {/* Curriculum note */}
      <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
        <Info size={14} style={{ color: PURPLE, marginTop: 2 }} />
        <div className="text-xs" style={{ color: INK_SECONDARY }}>
          <strong>Teaching note:</strong> The circular wheel makes angular relationships (adjacent signs, aspect arcs) visually obvious for learners.
          Traditional Jyotiṣa consultation uses the <strong>North Indian diamond chart</strong> (square with diagonal lines, houses fixed).
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lagna</span>
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
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[lagna - 1]}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Target sign</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setTarget(i)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: target === i ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${target === i ? GOLD_ACCENT : HAIRLINE}`,
                    color: target === i ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>
              {SIGNS[target]} ({CLASS_LABELS[SIGN_CLASSES[target]]})
            </div>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => setViewMode("reverse")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{
              background: viewMode === "reverse" ? "rgba(59,130,246,0.08)" : "transparent",
              border: `1.5px solid ${viewMode === "reverse" ? BLUE : HAIRLINE}`,
              color: viewMode === "reverse" ? BLUE : INK_SECONDARY,
            }}
          >
            <ArrowLeft size={11} className="inline mr-1" /> What aspects the target?
          </button>
          <button
            onClick={() => setViewMode("forward")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{
              background: viewMode === "forward" ? "rgba(59,130,246,0.08)" : "transparent",
              border: `1.5px solid ${viewMode === "forward" ? BLUE : HAIRLINE}`,
              color: viewMode === "forward" ? BLUE : INK_SECONDARY,
            }}
          >
            What does the target aspect? <ArrowRight size={11} className="inline ml-1" />
          </button>
        </div>

        <div>
          <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Presets</div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p, i) => (
              <button
                key={i}
                onClick={() => applyPreset(i)}
                className="px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
                style={{ background: "transparent", border: `1.5px solid ${HAIRLINE}`, color: INK_SECONDARY }}
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
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Chart + side panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <CircularWheel
            lagna={lagna}
            occupants={occupants}
            target={target}
            aspecting={activeAspecting}
            onSelectTarget={setTarget}
          />
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GOLD_ACCENT, opacity: 0.18, border: `1px solid ${GOLD_ACCENT}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Target</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GREEN, opacity: 0.15, border: `1px solid ${GREEN}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>{viewMode === "reverse" ? "Aspecting" : "Aspected"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: BLUE, opacity: 0.08, border: `1px solid ${BLUE}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Lagna</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-3">
          {/* Planet placement panel */}
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: BLUE }}>Planet placement</span>
            </div>
            <div className="space-y-2">
              {GRAHAS.map((g) => (
                <div key={g.key} className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold w-6" style={{ color: INK_PRIMARY }}>{g.key}</span>
                  {Array.from({ length: 12 }, (_, i) => {
                    const active = occupants[i].includes(g.key);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleOccupant(i, g.key)}
                        className="w-7 h-7 rounded text-xs font-bold transition-colors"
                        style={{
                          background: active ? "rgba(59,130,246,0.08)" : "transparent",
                          border: `1.5px solid ${active ? BLUE : HAIRLINE}`,
                          color: active ? BLUE : INK_SECONDARY,
                        }}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Target info */}
          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
            <div className="flex items-center gap-2">
              <Target size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Target: {SIGNS[target]}</span>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{CLASS_LABELS[SIGN_CLASSES[target]]}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>
              {viewMode === "reverse"
                ? `Aspected by ${activeAspecting.length} sign(s): ${activeAspecting.map((i) => SIGNS[i]).join(", ") || "none"}`
                : `Aspects ${activeAspecting.length} sign(s): ${activeAspecting.map((i) => SIGNS[i]).join(", ") || "none"}`}
            </div>
          </div>
        </div>
      </div>

      {/* Convergence / carried contents */}
      {viewMode === "reverse" && activeAspecting.length > 0 && (
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GREEN }} />
            <span className="text-sm font-bold" style={{ color: GREEN }}>Influence on {SIGNS[target]}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeAspecting.map((i) => (
              <div key={i} className="rounded-md p-3 space-y-1" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: BLUE }}>{SIGNS[i]}</div>
                <div className="text-xs" style={{ color: INK_MUTED }}>Lord: {LORDS[i]}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>Occupants: {occupants[i].length > 0 ? occupants[i].join(", ") : "none"}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>Carries: {LORDS[i]}{occupants[i].length > 0 ? `, ${occupants[i].join(", ")}` : ""}</div>
              </div>
            ))}
          </div>
          {activeAspecting.length >= 2 && (
            <div className="rounded-md p-3" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
              <div className="text-xs font-bold" style={{ color: GREEN }}>Multi-sign convergence</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>
                {activeAspecting.length} signs aspect {SIGNS[target]}. Converging sign-aspects reinforce one another, producing a comparatively stronger influence on the target.
              </div>
            </div>
          )}
        </div>
      )}

      {viewMode === "forward" && activeAspecting.length > 0 && (
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
          <div className="flex items-center gap-2">
            <Eye size={16} style={{ color: GREEN }} />
            <span className="text-sm font-bold" style={{ color: GREEN }}>{SIGNS[target]} aspects these signs</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeAspecting.map((i) => (
              <div key={i} className="rounded-md p-3 space-y-1" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: BLUE }}>{SIGNS[i]}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>
                  Receives from {SIGNS[target]}: lord {LORDS[target]}{occupants[target].length > 0 ? `, occupants ${occupants[target].join(", ")}` : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Using graha-dṛṣṭi instead of rāśi-dṛṣṭi", text: "Start from the sign's class, not planetary position. Planetary aspects are added in step four, never substituted." },
            { title: "Forgetting the adjacent exclusion", text: "Every sign aspects exactly three signs. If you count four, you forgot to drop the adjacent sign." },
            { title: "Not carrying occupants and lords across", text: "A sign-aspect transports significations. Ask what the aspecting sign holds and rules." },
            { title: "Treating convergence as cancellation", text: "Multiple signs aspecting one target reinforce the influence. Convergence intensifies, never neutralises." },
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
