"use client";

/**
 * Argala Concept Explorer -- Lesson 17.3.1 Interactive
 *
 * Conceptual orientation: bolt/intervention metaphor, reference-house principle,
 * mechanism discrimination (argala vs graha-dṛṣṭi vs rāśi-dṛṣṭi),
 * and what argala modifies vs what it does not.
 */

import { useState } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { argalaHousesFrom, SCENARIOS, WHAT_IT_DOES } from "./data";
import {
  Lock,
  Eye,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
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

    </svg>
  );
}

/* --- Reference house explorer SVG --- */

function ReferenceExplorer({ reference }: { reference: number }) {
  const argala = argalaHousesFrom(reference);

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
        const isRef = hnum === reference;
        const isPos = argala.positive.includes(hnum);
        const isViro = argala.virodha.includes(hnum);
        const isSec = hnum === argala.secondary;

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

      {/* Labels */}
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const center = HOUSE_CENTERS[hnum];
        const isRef = hnum === reference;
        return (
          <g key={`lbl-${hnum}`} transform={`translate(${center.x}, ${center.y})`}>
            {isRef && (
              <text y="-10" textAnchor="middle" dominantBaseline="middle" fontSize={15} fontWeight={800} fill={GOLD_ACCENT}>REF</text>
            )}
            <text y={isRef ? 9 : 0} textAnchor="middle" dominantBaseline="middle" fontSize={isRef ? 14 : 18} fontWeight={isRef ? 800 : 700} fill={isRef ? GOLD_ACCENT : INK_SECONDARY}>
              {isRef ? `H${hnum}` : hnum}
            </text>
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(16, 418)">
        <rect x={0} y={0} width={12} height={12} rx={2} fill={GOLD_ACCENT} fillOpacity={0.32} stroke={GOLD_ACCENT} strokeWidth={1.5} />
        <text x={18} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Reference</text>
        <rect x={94} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.32} stroke={GREEN} strokeWidth={1.5} />
        <text x={112} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Positive</text>
        <rect x={174} y={0} width={12} height={12} rx={2} fill={VERMILION} fillOpacity={0.3} stroke={VERMILION} strokeWidth={1.5} />
        <text x={192} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Virodha</text>
        <rect x={254} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.16} stroke={GREEN} strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={272} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Secondary</text>
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs" style={{ color: INK_SECONDARY }}>
          <span className="inline-flex items-center gap-2">
            <span style={{ width: 12, height: 6, borderRadius: 2, background: `${GREEN}30`, border: `1px solid ${GREEN}` }} />
            Positive bolt (click to slide)
          </span>
          <span className="inline-flex items-center gap-2">
            <span style={{ width: 12, height: 6, borderRadius: 2, background: `${VERMILION}30`, border: `1px solid ${VERMILION}` }} />
            Obstructing bolt (click to slide)
          </span>
        </div>
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

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3">
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
          <div className="xl:col-span-2 rounded-lg p-4" style={{ border: `1px solid ${HAIRLINE}` }}>
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
