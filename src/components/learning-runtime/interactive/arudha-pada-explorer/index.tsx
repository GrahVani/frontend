"use client";

/**
 * Ārūḍha Pāda Explorer -- Lesson 17.4.4 Interactive
 *
 * Computes all twelve ārūḍha padas, lets the learner click any pada
 * to inspect occupants, compare image vs reality, and build a focused
 * reading from AL + relevant A-padas.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  LORDS,
  GRAHAS,
  PRESETS,
  FOCUS_MODES,
  computeAllPadas,
  occupantNatureScore,
  imageReading,
  divergencePhrase,
} from "./data";
import type { GrahaKey, FocusMode } from "./data";
import {
  Eye,
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
const GRID_LINE = "rgba(90, 78, 46, 0.95)";



function PadaDiagram({
  lagna,
  selectedIndices,
  padas,
}: {
  lagna: number;
  selectedIndices: number[];
  padas: { finalPada: number }[];
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
    <svg viewBox="0 0 400 448" className="w-full h-auto" style={{ maxHeight: 430, minHeight: 360 }}>
      {/* Houses */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const isLagna = hnum === lagna;
        const isSelected = selectedIndices.some((idx) => padas[idx]?.finalPada === hnum);
        let fill = "transparent";
        let opacity = 0;
        if (isLagna) { fill = GOLD_ACCENT; opacity = 0.2; }
        else if (isSelected) { fill = GREEN; opacity = 0.22; }

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
        const isKey = isLagna || selectedIndices.some((idx) => padas[idx]?.finalPada === hnum);

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
      <g transform="translate(16, 418)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.3} stroke={GOLD_ACCENT} strokeWidth={1.5} />
        <text x={18} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Lagna</text>
        <rect x={86} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.3} stroke={GREEN} strokeWidth={1.5} />
        <text x={104} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Selected pādas</text>
      </g>
    </svg>
  );
}

/* --- Component --- */

export function ArudhaPadaExplorer() {
  const [lagna, setLagna] = useState(1);
  const [lordPositions, setLordPositions] = useState<number[]>([5, 3, 7, 10, 1, 9, 11, 2, 6, 12, 8, 4]);
  const [occupants, setOccupants] = useState<GrahaKey[][]>(PRESETS[0].occupants);
  const [selectedPada, setSelectedPada] = useState<number | null>(0);
  const [focusMode, setFocusMode] = useState<FocusMode>("general");

  const padas = useMemo(() => computeAllPadas(lagna, lordPositions), [lagna, lordPositions]);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setLagna(p.lagna);
    setLordPositions(p.lordPositions);
    setOccupants(p.occupants.map((arr) => [...arr]));
    setSelectedPada(0);
  }

  function toggleOccupant(padaIdx: number, key: GrahaKey) {
    setOccupants((prev) => {
      const next = prev.map((arr) => [...arr]);
      const arr = next[padaIdx];
      if (arr.includes(key)) next[padaIdx] = arr.filter((k) => k !== key);
      else next[padaIdx] = [...arr, key];
      return next;
    });
  }

  const focus = FOCUS_MODES.find((f) => f.key === focusMode)!;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Eye size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Ārūḍha Pāda</IAST> Explorer
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Compute all twelve pādas, click any to inspect occupants, and compare image against reality.
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
                  onClick={() => { setLagna(i + 1); }}
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
        </div>

        <button
          onClick={() => applyPreset(0)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <RotateCcw size={11} /> Reset to lesson example
        </button>
      </div>

      {/* Focus mode */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: BLUE }} />
          <span className="text-sm font-bold" style={{ color: BLUE }}>Focused reading</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FOCUS_MODES.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFocusMode(f.key); setSelectedPada(f.padaIndices[0]); }}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={{
                background: focusMode === f.key ? "rgba(59,130,246,0.08)" : "transparent",
                border: `1.5px solid ${focusMode === f.key ? BLUE : HAIRLINE}`,
                color: focusMode === f.key ? BLUE : INK_SECONDARY,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          <strong>Question:</strong> {focus.question}
        </p>
      </div>

      {/* Diagram + selected detail — top row for spatial orientation */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-2 rounded-lg p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <PadaDiagram lagna={lagna} selectedIndices={focus.padaIndices} padas={padas} />
        </div>

        <div className="xl:col-span-3">
          {selectedPada !== null && (
            <div className="rounded-lg p-4 space-y-3 h-full" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye size={14} style={{ color: GREEN }} />
                  <span className="text-sm font-bold" style={{ color: GREEN }}>
                    A{selectedPada + 1}{selectedPada === 0 ? " (AL)" : selectedPada === 11 ? " (UL)" : ""}
                  </span>
                </div>
                {padas[selectedPada].exceptionFired && (
                  <span className="text-xs font-semibold" style={{ color: VERMILION }}>Exception</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md p-2.5 space-y-1" style={{ background: "rgba(59,130,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Source house (reality)</div>
                  <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{padas[selectedPada].house} {SIGNS[padas[selectedPada].house - 1]}</div>
                </div>
                <div className="rounded-md p-2.5 space-y-1" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Pāda sign (image)</div>
                  <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[padas[selectedPada].finalPada - 1]}</div>
                </div>
              </div>

              <div className="text-xs" style={{ color: INK_SECONDARY }}>
                {imageReading(selectedPada, occupantNatureScore(occupants[selectedPada]))}
              </div>

              <div className="text-xs" style={{ color: INK_MUTED }}>
                {divergencePhrase(selectedPada, occupantNatureScore(occupants[selectedPada]))}
              </div>

              <div>
                <div className="text-xs font-bold mb-1.5" style={{ color: INK_PRIMARY }}>Occupants</div>
                <div className="flex flex-wrap gap-1">
                  {GRAHAS.map((g) => {
                    const active = occupants[selectedPada].includes(g.key);
                    return (
                      <button
                        key={g.key}
                        onClick={() => toggleOccupant(selectedPada, g.key)}
                        className="px-1.5 py-0.5 rounded text-xs font-semibold transition-colors"
                        style={{
                          background: active ? "rgba(59,130,246,0.08)" : "transparent",
                          border: `1px solid ${active ? BLUE : HAIRLINE}`,
                          color: active ? BLUE : INK_SECONDARY,
                        }}
                      >
                        {g.key}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pada grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>All twelve pādas — click any to inspect</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {padas.map((p, i) => {
            const isAl = i === 0;
            const isUl = i === 11;
            const isSelected = selectedPada === i;
            const inFocus = focus.padaIndices.includes(i);
            const score = occupantNatureScore(occupants[i]);
            let accent = GOLD_ACCENT;
            if (isAl) accent = GREEN;
            else if (isUl) accent = PURPLE;
            else if (inFocus) accent = BLUE;

            return (
              <button
                key={i}
                onClick={() => setSelectedPada(i)}
                className="rounded-lg p-2.5 text-left space-y-1 transition-colors"
                style={{
                  background: SURFACE,
                  border: `1.5px solid ${isSelected ? accent : HAIRLINE}`,
                  borderLeft: `3px solid ${accent}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold" style={{ color: accent }}>A{i + 1}{isAl ? " (AL)" : isUl ? " (UL)" : ""}</span>
                  {p.exceptionFired && <AlertTriangle size={10} style={{ color: VERMILION }} />}
                </div>
                <div className="text-xs" style={{ color: INK_MUTED }}>H{p.house}</div>
                <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[p.finalPada - 1]}</div>
                <div className="flex items-center gap-1">
                  {score > 0 && <CheckCircle2 size={10} style={{ color: GREEN }} />}
                  {score < 0 && <AlertTriangle size={10} style={{ color: VERMILION }} />}
                  <span className="text-xs" style={{ color: INK_MUTED }}>
                    {occupants[i].length > 0 ? `${occupants[i].length} graha${occupants[i].length > 1 ? "s" : ""}` : "empty"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Synthesis panel */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={16} style={{ color: AMBER }} />
          <span className="text-sm font-bold" style={{ color: AMBER }}>Synthesis</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {focus.padaIndices.map((idx) => {
            const p = padas[idx];
            const score = occupantNatureScore(occupants[idx]);
            return (
              <div key={idx} className="rounded-md p-3 space-y-1" style={{ border: `1px solid ${HAIRLINE}` }}>
                <div className="text-xs font-bold" style={{ color: idx === 0 ? GREEN : idx === 11 ? PURPLE : BLUE }}>
                  A{idx + 1}{idx === 0 ? " (AL)" : idx === 11 ? " (UL)" : ""}
                </div>
                <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[p.finalPada - 1]}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>{imageReading(idx, score)}</div>
              </div>
            );
          })}
        </div>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          Compare the pāda layer (image) with the source houses (reality). Where they diverge, the gap itself is the finding.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Reading one pāda in isolation", text: "Compute all twelve pādas plus the UL before interpreting. Cherry-picking invites false precision." },
            { title: "Confusing AL with UL", text: "AL = social image (self). UL = marriage / spouse. They answer different questions." },
            { title: "Treating pāda as reality", text: "A pāda is the projection of a house, not the house itself. Planets on a pāda colour the image, not the substance." },
            { title: "Skipping the synthesis step", text: "Always weigh pāda findings against the natal houses. The most valuable readings live in the gap between image and reality." },
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
