"use client";

/**
 * Argala Concept Explorer -- Lesson 17.3.1 Interactive
 *
 * Conceptual orientation: bolt/intervention metaphor, reference-house principle,
 * mechanism discrimination (argala vs graha-dṛṣṭi vs rāśi-dṛṣṭi),
 * and what argala modifies vs what it does not.
 */

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import { argalaHousesFrom, RASHI_NAMES, SCENARIOS, WHAT_IT_DOES } from "./data";
import {
  Lock,
  Unlock,
  Eye,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  RotateCcw,
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

/* --- Bolt metaphor SVG --- */

function BoltMetaphor({
  positiveBolts,
  obstructingBolts,
  onTogglePositive,
  onToggleObstructing,
}: {
  positiveBolts: boolean[];
  obstructingBolts: boolean[];
  onTogglePositive: (i: number) => void;
  onToggleObstructing: (i: number) => void;
}) {
  const w = 380;
  const h = 220;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 220 }}>
      {/* Door frame */}
      <rect x={140} y={20} width={100} height={180} rx={4} fill="none" stroke={GOLD_ACCENT} strokeWidth={2.5} />
      <rect x={148} y={28} width={84} height={164} rx={2} fill={GOLD_ACCENT} fillOpacity={0.03} stroke={HAIRLINE} strokeWidth={1} />

      {/* Door panels */}
      <line x1={190} y1={28} x2={190} y2={192} stroke={HAIRLINE} strokeWidth={1} />
      <line x1={148} y1={110} x2={232} y2={110} stroke={HAIRLINE} strokeWidth={1} />

      {/* Reference label */}
      <text x={190} y={115} textAnchor="middle" fontSize={11} fontWeight={700} fill={GOLD_ACCENT}>REFERENCE</text>
      <text x={190} y={130} textAnchor="middle" fontSize={11} fill={INK_MUTED}>House under study</text>

      {/* Positive bolts (left side, sliding right) */}
      {[
        { y: 50, label: "2nd" },
        { y: 90, label: "4th" },
        { y: 160, label: "11th" },
      ].map((b, i) => (
        <g key={`pos-${i}`}>
          <rect
            x={positiveBolts[i] ? 130 : 80}
            y={b.y}
            width={24}
            height={8}
            rx={2}
            fill={GREEN} fillOpacity={positiveBolts[i] ? 0.25 : 0.08}
            stroke={GREEN}
            strokeWidth={1.5}
            style={{ cursor: "pointer", transition: "x 0.3s" }}
            onClick={() => onTogglePositive(i)}
          />
          <text x={60} y={b.y + 6} textAnchor="end" fontSize={10} fontWeight={600} fill={positiveBolts[i] ? GREEN : INK_MUTED}>{b.label}</text>
          {positiveBolts[i] && (
            <text x={160} y={b.y + 6} textAnchor="start" fontSize={11} fill={GREEN}>bolts on</text>
          )}
        </g>
      ))}

      {/* Obstructing bolts (right side, sliding left) */}
      {[
        { y: 50, label: "12th" },
        { y: 90, label: "10th" },
        { y: 160, label: "3rd" },
      ].map((b, i) => (
        <g key={`obs-${i}`}>
          <rect
            x={obstructingBolts[i] ? 226 : 276}
            y={b.y}
            width={24}
            height={8}
            rx={2}
            fill={VERMILION} fillOpacity={obstructingBolts[i] ? 0.25 : 0.08}
            stroke={VERMILION}
            strokeWidth={1.5}
            style={{ cursor: "pointer", transition: "x 0.3s" }}
            onClick={() => onToggleObstructing(i)}
          />
          <text x={320} y={b.y + 6} textAnchor="start" fontSize={10} fontWeight={600} fill={obstructingBolts[i] ? VERMILION : INK_MUTED}>{b.label}</text>
          {obstructingBolts[i] && (
            <text x={220} y={b.y + 6} textAnchor="end" fontSize={11} fill={VERMILION}>blocks</text>
          )}
        </g>
      ))}

      {/* Legend */}
      <g transform="translate(20, 195)">
        <rect x={0} y={0} width={12} height={6} rx={1} fill={GREEN} fillOpacity={0.19} stroke={GREEN} strokeWidth={1} />
        <text x={18} y={6} fontSize={11} fill={INK_SECONDARY}>Positive bolt (click to slide)</text>
        <rect x={110} y={0} width={12} height={6} rx={1} fill={VERMILION} fillOpacity={0.19} stroke={VERMILION} strokeWidth={1} />
        <text x={128} y={6} fontSize={11} fill={INK_SECONDARY}>Obstructing bolt (click to slide)</text>
      </g>
    </svg>
  );
}

/* --- Reference house explorer SVG --- */

function ReferenceExplorer({ reference }: { reference: number }) {
  const w = 300;
  const h = 320;
  const cx = w / 2;
  const cy = h / 2 - 6;
  const r = 105;
  const argala = argalaHousesFrom(reference);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 300 }}>
      {/* Sectors */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const isRef = hnum === reference;
        const isPos = argala.positive.includes(hnum);
        const isViro = argala.virodha.includes(hnum);
        const isSec = hnum === argala.secondary;

        let fill = "transparent";
        let opacity = 0;
        if (isRef) { fill = GOLD_ACCENT; opacity = 0.12; }
        else if (isPos) { fill = GREEN; opacity = 0.1; }
        else if (isViro) { fill = VERMILION; opacity = 0.1; }
        else if (isSec) { fill = GREEN; opacity = 0.05; }

        return (
          <path key={hnum} d={sectorPath(cx, cy, 38, r + 5, hnum, 26)} fill={fill} fillOpacity={opacity} stroke="none" />
        );
      })}

      {/* Rings */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 36} fill="none" stroke={HAIRLINE} strokeWidth={0.8} strokeDasharray="3 3" />

      {/* Ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = houseXY(cx, cy, r, i + 1);
        const b = houseXY(cx, cy, r - 7, i + 1);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={HAIRLINE} strokeWidth={1} />;
      })}

      {/* House numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = houseXY(cx, cy, r + 14, i + 1);
        const hnum = i + 1;
        const isRef = hnum === reference;
        return (
          <text key={i} x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={isRef ? 800 : 600} fill={isRef ? GOLD_ACCENT : INK_MUTED}>
            {hnum}
          </text>
        );
      })}

      {/* Centre label */}
      <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={GOLD_ACCENT}>REF</text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill={INK_MUTED}>H{reference}</text>

      {/* Legend */}
      <g transform={`translate(16, ${h - 52})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={GOLD_ACCENT} fillOpacity={0.15} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={15} y={9} fontSize={11} fill={INK_SECONDARY}>Reference</text>
        <rect x={65} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.15} stroke={GREEN} strokeWidth={1} />
        <text x={80} y={9} fontSize={11} fill={INK_SECONDARY}>Positive</text>
        <rect x={125} y={0} width={10} height={10} rx={2} fill={VERMILION} fillOpacity={0.15} stroke={VERMILION} strokeWidth={1} />
        <text x={140} y={9} fontSize={11} fill={INK_SECONDARY}>Virodha</text>
        <rect x={185} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.08} stroke={GREEN} strokeWidth={1} strokeDasharray="2 1" />
        <text x={200} y={9} fontSize={11} fill={INK_SECONDARY}>Secondary</text>
      </g>
    </svg>
  );
}

/* --- Main component --- */

export function ArgalaConceptExplorer() {
  const [reference, setReference] = useState(7);
  const [positiveBolts, setPositiveBolts] = useState([false, false, false]);
  const [obstructingBolts, setObstructingBolts] = useState([false, false, false]);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [functionChecks, setFunctionChecks] = useState<Record<number, boolean>>({});

  const argala = argalaHousesFrom(reference);

  const activePos = positiveBolts.filter(Boolean).length;
  const activeObs = obstructingBolts.filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Lock size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Argala</IAST> Concept Explorer
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            The bolt-intervention metaphor, reference-house principle, and Jaimini-specific distinction.
          </p>
        </div>
      </div>

      {/* === Section 1: Bolt Metaphor === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Lock size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>The Bolt Metaphor</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          <IAST>Argala</IAST> (अर्गल) names a wooden bolt slid across a door. Click the bolts below to see how
          positive argala (green) braces the reference, while virodhārgala (vermilion) blocks it.
          A bolt can hold a door firm -- or jam it shut.
        </p>
        <BoltMetaphor
          positiveBolts={positiveBolts}
          obstructingBolts={obstructingBolts}
          onTogglePositive={(i) => setPositiveBolts((p) => p.map((v, j) => (j === i ? !v : v)))}
          onToggleObstructing={(i) => setObstructingBolts((p) => p.map((v, j) => (j === i ? !v : v)))}
        />
        <div className="flex items-center gap-4 text-xs" style={{ color: INK_SECONDARY }}>
          <span>Positive bolts active: <strong style={{ color: GREEN }}>{activePos}</strong></span>
          <span>Obstructing bolts active: <strong style={{ color: VERMILION }}>{activeObs}</strong></span>
          <span>Net: <strong style={{ color: activePos > activeObs ? GREEN : activeObs > activePos ? VERMILION : AMBER }}>{activePos > activeObs ? "Supported" : activeObs > activePos ? "Blocked" : "Contested"}</strong></span>
        </div>
      </div>

      {/* === Section 2: Reference House Explorer === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Reference-House Principle</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Argala is <strong>relative, never absolute</strong>. Change the reference and the same chart yields different intervening houses.
          The designated numbers (2nd, 4th, 11th) are always counted <em>from the reference</em>.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Choose reference:</div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setReference(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: reference === i + 1 ? "rgba(156,122,47,0.09)" : "transparent",
                    border: `1.5px solid ${reference === i + 1 ? GOLD_ACCENT : HAIRLINE}`,
                    color: reference === i + 1 ? GOLD_ACCENT : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs" style={{ color: INK_SECONDARY }}>
              <div><strong style={{ color: GREEN }}>Positive argala:</strong> H{argala.positive.join(", H")}</div>
              <div><strong style={{ color: VERMILION }}>Virodhārgala:</strong> H{argala.virodha.join(", H")}</div>
              <div><strong style={{ color: "rgba(47,125,85,0.6)" }}>Secondary (5th):</strong> H{argala.secondary}</div>
            </div>
          </div>
          <div className="rounded-lg p-2" style={{ border: `1px solid ${HAIRLINE}` }}>
            <ReferenceExplorer reference={reference} />
          </div>
        </div>
      </div>

      {/* === Section 3: Mechanism Discriminator === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: BLUE }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Mechanism Discriminator</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Argala, Parāśari graha-dṛṣṭi, and Jaimini rāśi-dṛṣṭi are <strong>distinct doctrines</strong>.
          A planet may do one, two, or none -- but the claims are never interchangeable.
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {SCENARIOS.map((s, i) => (
            <button
              key={s.key}
              onClick={() => { setScenarioIndex(i); setRevealed(false); }}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
              style={{
                background: scenarioIndex === i ? `${BLUE}12` : "transparent",
                border: `1.5px solid ${scenarioIndex === i ? BLUE : HAIRLINE}`,
                color: scenarioIndex === i ? BLUE : INK_SECONDARY,
              }}
            >
              Scenario {i + 1}
            </button>
          ))}
        </div>

        <div className="rounded-md p-3 space-y-3" style={{ border: `1px solid ${HAIRLINE}` }}>
          <div className="text-xs" style={{ color: INK_SECONDARY }}>{SCENARIOS[scenarioIndex].situation}</div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "argala", label: "Argala", color: GREEN, active: SCENARIOS[scenarioIndex].isArgala },
              { key: "graha", label: "Graha-dṛṣṭi", color: BLUE, active: SCENARIOS[scenarioIndex].isGrahaDrishti },
              { key: "rashi", label: "Rāśi-dṛṣṭi", color: PURPLE, active: SCENARIOS[scenarioIndex].isRashiDrishti },
            ].map((m) => (
              <div key={m.key} className="rounded p-2 text-center space-y-1" style={{ border: `1.5px solid ${m.active ? m.color : HAIRLINE}`, background: m.active ? `${m.color}14` : "transparent" }}>
                <div className="text-xs font-bold" style={{ color: m.active ? m.color : INK_MUTED }}>{m.label}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.active ? "YES" : "no"}</div>
              </div>
            ))}
          </div>

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "rgba(156,122,47,0.06)", border: "1px solid var(--gl-gold-accent, #9C7A2F)", color: GOLD_ACCENT }}
            >
              Reveal explanation
            </button>
          ) : (
            <div className="rounded p-2.5 text-xs" style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}` }}>
              {SCENARIOS[scenarioIndex].explanation}
            </div>
          )}
        </div>
      </div>

      {/* === Section 4: What argala does / does not do === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} style={{ color: GREEN }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>What Argala Does (and Does Not)</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Click each statement. Green = correct. Vermilion = incorrect. The bolt image guards against over-reading.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {WHAT_IT_DOES.map((item, i) => {
            const checked = functionChecks[i];
            const showResult = checked !== undefined;
            const isCorrect = item.correct === checked;
            return (
              <button
                key={i}
                onClick={() => setFunctionChecks((p) => ({ ...p, [i]: !checked }))}
                className="text-left rounded-md p-2.5 flex items-start gap-2 transition-colors"
                style={{
                  background: showResult ? (isCorrect ? "rgba(47,125,85,0.03)" : "rgba(162,58,30,0.03)") : "transparent",
                  border: `1.5px solid ${showResult ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}`,
                }}
              >
                <span className="mt-0.5 shrink-0">
                  {showResult ? (
                    isCorrect ? <CheckCircle2 size={14} style={{ color: GREEN }} /> : <XCircle size={14} style={{ color: VERMILION }} />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-sm border" style={{ borderColor: HAIRLINE }} />
                  )}
                </span>
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold" style={{ color: showResult ? (isCorrect ? GREEN : VERMILION) : INK_SECONDARY }}>{item.label}</div>
                  {showResult && <div className="text-xs" style={{ color: INK_SECONDARY }}>{item.detail}</div>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* === Section 5: Common Mistakes === */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Argala = graha-dṛṣṭi", text: "Argala is intervention by occupancy of a designated house counted from the reference, not sight cast by aspect-rules. Name the mechanism explicitly." },
            { title: "Argala = rāśi-dṛṣṭi", text: "Rāśi-dṛṣṭi asks which signs see each other. Argala asks what intervenes on a reference from designated houses. Different questions." },
            { title: "Argala creates/replaces", text: "Argala modifies -- it does not create a new house, replace significations, or freeze the reference against daśās." },
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
