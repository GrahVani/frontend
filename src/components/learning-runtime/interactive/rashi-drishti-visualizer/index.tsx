"use client";

/**
 * Rāśi-Dṛṣṭi Visualizer -- Lesson 17.5.1 Interactive
 *
 * Circular wheel chart: sign positions are arranged radially so the angular
 * relationships (adjacent signs, which three are aspected) are visually obvious.
 *
 * Note: Traditional Jyotiṣa consultation uses the North Indian diamond chart
 * (square with diagonal lines, houses fixed). The circle here is a teaching aid
 * for seeing the aspect geometry directly.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  SIGN_CLASSES,
  CLASS_LABELS,
  getAspectedSigns,
  getExcludedSign,
  DRILL_QUESTIONS,
} from "./data";
import {
  Eye,
  Target,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Info,
  MapPin,
} from "lucide-react";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
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

/* --- Circular wheel --- */

const CX = 190;
const CY = 190;
const R_OUTER = 170;
const R_INNER = 100;
const R_LABEL = 135;

function angleForHouse(house: number): number {
  // House 1 at top (-90 deg), then clockwise
  return (house - 1) * 30 - 90;
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function sectorPath(cx: number, cy: number, r1: number, r2: number, deg1: number, deg2: number) {
  const a1 = (deg1 * Math.PI) / 180;
  const a2 = (deg2 * Math.PI) / 180;
  const x1 = cx + r2 * Math.cos(a1);
  const y1 = cy + r2 * Math.sin(a1);
  const x2 = cx + r2 * Math.cos(a2);
  const y2 = cy + r2 * Math.sin(a2);
  const x3 = cx + r1 * Math.cos(a2);
  const y3 = cy + r1 * Math.sin(a2);
  const x4 = cx + r1 * Math.cos(a1);
  const y4 = cy + r1 * Math.sin(a1);
  return `M ${x1} ${y1} A ${r2} ${r2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${r1} ${r1} 0 0 0 ${x4} ${y4} Z`;
}

function CircularWheel({
  lagna,
  selected,
  highlighted,
  excluded,
  onSelect,
}: {
  lagna: number;
  selected: number | null;
  highlighted: number[];
  excluded: number | null;
  onSelect: (signIdx: number) => void;
}) {
  return (
    <svg viewBox="0 0 380 380" className="w-full h-auto" style={{ maxHeight: 400 }}>
      {/* Outer ring */}
      <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke={HAIRLINE} strokeWidth={1} />

      {/* Sector dividers */}
      {Array.from({ length: 12 }, (_, i) => {
        const deg = angleForHouse(i + 1) - 15;
        const pOuter = polar(CX, CY, R_OUTER, deg);
        const pInner = polar(CX, CY, R_INNER, deg);
        return <line key={`div-${i}`} x1={pInner.x} y1={pInner.y} x2={pOuter.x} y2={pOuter.y} stroke={HAIRLINE} strokeWidth={0.8} />;
      })}

      {/* Sector backgrounds */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg1 = angleForHouse(hnum) - 15;
        const deg2 = angleForHouse(hnum) + 15;

        const isSelected = selected === sIdx;
        const isHighlighted = highlighted.includes(sIdx);
        const isExcluded = excluded === sIdx;

        if (!isSelected && !isHighlighted && !isExcluded) return null;

        let fill = "transparent";
        let opacity = 0;
        if (isSelected) { fill = GOLD_ACCENT; opacity = 0.18; }
        else if (isHighlighted) { fill = GREEN; opacity = 0.15; }
        else if (isExcluded) { fill = VERMILION; opacity = 0.08; }

        return (
          <path
            key={`sector-${hnum}`}
            d={sectorPath(CX, CY, R_INNER, R_OUTER, deg1, deg2)}
            fill={fill}
            fillOpacity={opacity}
          />
        );
      })}

      {/* Labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg = angleForHouse(hnum);
        const pos = polar(CX, CY, R_LABEL, deg);
        const isKey = selected === sIdx || highlighted.includes(sIdx) || excluded === sIdx;
        return (
          <g key={`label-${hnum}`}>
            <text x={pos.x} y={pos.y - 7} textAnchor="middle" dominantBaseline="middle" fontSize={13} fontWeight={700} fill={isKey ? INK_SECONDARY : INK_MUTED}>
              H{hnum}
            </text>
            <text x={pos.x} y={pos.y + 7} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={600} fill={isKey ? INK_PRIMARY : INK_SECONDARY}>
              {SIGNS[sIdx].slice(0, 3)}
            </text>
          </g>
        );
      })}

      {/* Clickable sectors */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const sIdx = signForHouse(lagna, hnum);
        const deg1 = angleForHouse(hnum) - 15;
        const deg2 = angleForHouse(hnum) + 15;
        return (
          <path
            key={`hit-${hnum}`}
            d={sectorPath(CX, CY, R_INNER, R_OUTER, deg1, deg2)}
            fill="transparent"
            cursor="pointer"
            onClick={() => onSelect(sIdx)}
          />
        );
      })}

      {/* Center dot */}
      <circle cx={CX} cy={CY} r={3} fill={HAIRLINE} />
    </svg>
  );
}

type Mode = "explore" | "drill";

export function RashiDrishtiVisualizer() {
  const [lagna, setLagna] = useState(1);
  const [selected, setSelected] = useState<number | null>(0);
  const [mode, setMode] = useState<Mode>("explore");
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillPicks, setDrillPicks] = useState<number[]>([]);
  const [drillChecked, setDrillChecked] = useState(false);

  const aspected = useMemo(() => selected !== null ? getAspectedSigns(selected) : [], [selected]);
  const excluded = useMemo(() => selected !== null ? getExcludedSign(selected) : null, [selected]);

  const currentDrill = DRILL_QUESTIONS[drillIndex];
  const correctDrill = getAspectedSigns(currentDrill.signIdx);

  function handleSelect(idx: number) {
    setSelected(idx);
    if (mode === "drill" && !drillChecked) {
      if (drillPicks.includes(idx)) {
        setDrillPicks(drillPicks.filter((k) => k !== idx));
      } else if (drillPicks.length < 3) {
        setDrillPicks([...drillPicks, idx]);
      }
    }
  }

  function nextDrill() {
    setDrillIndex((i) => (i + 1) % DRILL_QUESTIONS.length);
    setDrillPicks([]);
    setDrillChecked(false);
    setSelected(null);
  }

  function resetDrill() {
    setDrillPicks([]);
    setDrillChecked(false);
    setSelected(null);
  }

  const allCorrect = drillChecked && drillPicks.length === 3 && correctDrill.every((i) => drillPicks.includes(i));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Eye size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Rāśi-Dṛṣṭi</IAST> Visualizer
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Click any house on the wheel to see the three signs it aspects.
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

      <div className="flex gap-1.5">
        {(["explore", "drill"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setDrillPicks([]); setDrillChecked(false); setSelected(m === "explore" ? 0 : null); }}
            className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{
              background: mode === m ? "rgba(59,130,246,0.08)" : "transparent",
              border: `1.5px solid ${mode === m ? BLUE : HAIRLINE}`,
              color: mode === m ? BLUE : INK_SECONDARY,
            }}
          >
            {m === "explore" ? "Explore" : "Drill"}
          </button>
        ))}
      </div>

      {mode === "drill" && (
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
          <div className="flex items-center gap-2">
            <Target size={16} style={{ color: BLUE }} />
            <span className="text-sm font-bold" style={{ color: BLUE }}>{currentDrill.question}</span>
          </div>
          <div className="text-xs" style={{ color: INK_MUTED }}>Select exactly 3 signs on the wheel, then check your answer.</div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setDrillChecked(true)}
              disabled={drillPicks.length !== 3}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
              style={{
                background: drillPicks.length === 3 ? "rgba(47,125,85,0.08)" : "transparent",
                border: `1px solid ${drillPicks.length === 3 ? GREEN : HAIRLINE}`,
                color: drillPicks.length === 3 ? GREEN : INK_MUTED,
                opacity: drillPicks.length === 3 ? 1 : 0.6,
              }}
            >
              Check answer
            </button>
            <button onClick={resetDrill} className="px-2.5 py-1.5 rounded-md text-xs font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>
              <RotateCcw size={11} className="inline mr-1" /> Reset
            </button>
            <button onClick={nextDrill} className="px-2.5 py-1.5 rounded-md text-xs font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>
              Next question
            </button>
          </div>
          {drillChecked && (
            <div className="rounded-md p-3 flex items-start gap-2" style={{ background: allCorrect ? "rgba(47,125,85,0.05)" : "rgba(162,58,30,0.05)", border: `1px solid ${HAIRLINE}` }}>
              {allCorrect ? <CheckCircle2 size={14} style={{ color: GREEN, marginTop: 2 }} /> : <AlertTriangle size={14} style={{ color: VERMILION, marginTop: 2 }} />}
              <div className="text-xs" style={{ color: INK_SECONDARY }}>
                {allCorrect
                  ? `Correct! ${SIGNS[currentDrill.signIdx]} aspects ${correctDrill.map((i) => SIGNS[i]).join(", ")}.`
                  : `Not quite. ${SIGNS[currentDrill.signIdx]} aspects ${correctDrill.map((i) => SIGNS[i]).join(", ")}. You selected ${drillPicks.map((i) => SIGNS[i]).join(", ")}.`}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <CircularWheel
            lagna={lagna}
            selected={mode === "drill" && drillChecked ? currentDrill.signIdx : selected}
            highlighted={mode === "drill" && drillChecked ? correctDrill : aspected}
            excluded={mode === "drill" && drillChecked ? getExcludedSign(currentDrill.signIdx) : excluded}
            onSelect={handleSelect}
          />
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GOLD_ACCENT, opacity: 0.3, border: `1px solid ${GOLD_ACCENT}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: GREEN, opacity: 0.25, border: `1px solid ${GREEN}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Aspected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: VERMILION, opacity: 0.15, border: `1px solid ${VERMILION}` }} />
              <span className="text-xs" style={{ color: INK_SECONDARY }}>Excluded</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-3">
          <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GOLD_ACCENT}` }}>
            <div className="flex items-center gap-2">
              <MapPin size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: GOLD_ACCENT }}>Lagna</span>
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
            <div className="text-xs" style={{ color: INK_MUTED }}>{SIGNS[lagna - 1]}</div>
          </div>

          {selected !== null && mode === "explore" && (
            <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
              <div className="flex items-center gap-2">
                <MapPin size={14} style={{ color: GREEN }} />
                <span className="text-sm font-bold" style={{ color: GREEN }}>{SIGNS[selected]}</span>
              </div>
              <div className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>{CLASS_LABELS[SIGN_CLASSES[selected]]}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{getRuleText(selected)}</div>
              <div className="text-xs" style={{ color: INK_MUTED }}>{getExplanationText(selected)}</div>
            </div>
          )}

          {mode === "drill" && drillChecked && (
            <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${allCorrect ? GREEN : VERMILION}` }}>
              <div className="flex items-center gap-2">
                {allCorrect ? <CheckCircle2 size={14} style={{ color: GREEN }} /> : <AlertTriangle size={14} style={{ color: VERMILION }} />}
                <span className="text-sm font-bold" style={{ color: allCorrect ? GREEN : VERMILION }}>{allCorrect ? "Correct" : "Review"}</span>
              </div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{getExplanationText(currentDrill.signIdx)}</div>
            </div>
          )}

          <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
            <div className="flex items-center gap-2">
              <Info size={14} style={{ color: PURPLE }} />
              <span className="text-xs font-bold" style={{ color: PURPLE }}>Rāśi-dṛṣṭi vs Graha-dṛṣṭi</span>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}><strong>Rāśi-dṛṣṭi:</strong> signs aspect signs by class rule. Permanent, chart-independent web.</div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}><strong>Graha-dṛṣṭi:</strong> planets aspect houses/planets by position. Changes with every chart.</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>The two are complementary layers, not rivals.</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: GOLD_ACCENT }} />
          <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Sign-class reference</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([
            { key: "movable", label: "Cara (Movable)", color: BLUE, signs: [0, 3, 6, 9] },
            { key: "fixed", label: "Sthira (Fixed)", color: GOLD_ACCENT, signs: [1, 4, 7, 10] },
            { key: "dual", label: "Dvisvabhāva (Dual)", color: PURPLE, signs: [2, 5, 8, 11] },
          ] as const).map((c) => (
            <div key={c.key} className="rounded-lg p-3 space-y-1" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${c.color}` }}>
              <div className="text-xs font-bold" style={{ color: c.color }}>{c.label}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{c.signs.map((i) => SIGNS[i]).join(", ")}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Confusing rāśi-dṛṣṭi with graha-dṛṣṭi", text: "Sign-aspect is sign-to-sign by class. Planetary aspect is planet-to-point by position. Ask which object is doing the looking." },
            { title: "Forgetting the adjacent exclusion", text: "Every sign aspects exactly three signs. If you count four, you forgot to drop the adjacent sign." },
            { title: "Applying cross-class rule to dual signs", text: "Dual aspects dual -- within its own class. No adjacent sign to drop; only the sign itself is excluded." },
            { title: "Missing mutuality", text: "Movable and fixed aspect each other. If A aspects B, then B aspects A. Use this as a free verification." },
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

function getRuleText(signIdx: number): string {
  const cls = SIGN_CLASSES[signIdx];
  if (cls === "movable") return "Movable aspects fixed signs, except the adjacent fixed sign.";
  if (cls === "fixed") return "Fixed aspects movable signs, except the adjacent movable sign.";
  return "Dual aspects the other dual signs, except its own self.";
}

function getExplanationText(signIdx: number): string {
  const cls = SIGN_CLASSES[signIdx];
  const aspected = getAspectedSigns(signIdx);
  const excluded = getExcludedSign(signIdx);
  if (cls === "dual") {
    return `${SIGNS[signIdx]} is dual. It aspects the other three dual signs: ${aspected.map((i) => SIGNS[i]).join(", ")}. No adjacent dual sign exists to exclude; the only exclusion is ${SIGNS[signIdx]} itself.`;
  }
  if (cls === "movable") {
    return `${SIGNS[signIdx]} is movable. It aspects three of the four fixed signs: ${aspected.map((i) => SIGNS[i]).join(", ")}. The adjacent fixed sign ${excluded !== null ? SIGNS[excluded] : ""} is excluded.`;
  }
  return `${SIGNS[signIdx]} is fixed. It aspects three of the four movable signs: ${aspected.map((i) => SIGNS[i]).join(", ")}. The adjacent movable sign ${excluded !== null ? SIGNS[excluded] : ""} is excluded.`;
}
