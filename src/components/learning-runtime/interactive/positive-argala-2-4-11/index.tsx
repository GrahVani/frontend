"use client";

/**
 * Positive Argala 2/4/11 -- Lesson 17.3.2 Interactive
 *
 * Counting drill, self-check challenges, strength visualisation,
 * and common-trap spotter for positive argala.
 */

import { useState } from "react";
import { IAST } from "../../chrome/typography";
import { argalaFrom, CHALLENGES, STRENGTH_EXAMPLES, TRAPS } from "./data";
import {
  XCircle,
  AlertTriangle,
  Target,
  ArrowRight,
  Plus,
  RotateCcw,
  Eye,
  Lightbulb,
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
const GRID_LINE = "rgba(90, 78, 46, 0.95)";



function CountingDiagram({ reference }: { reference: number }) {
  const argala = argalaFrom(reference);

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
        const isSecond = hnum === argala.second;
        const isFourth = hnum === argala.fourth;
        const isEleventh = hnum === argala.eleventh;
        const isFifth = hnum === argala.fifth;

        let fill = "transparent";
        let opacity = 0;
        if (isRef) { fill = GOLD_ACCENT; opacity = 0.22; }
        else if (isSecond || isFourth || isEleventh) { fill = GREEN; opacity = 0.22; }
        else if (isFifth) { fill = GREEN; opacity = 0.1; }

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
        <rect x={100} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.32} stroke={GREEN} strokeWidth={1.5} />
        <text x={118} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Positive</text>
        <rect x={184} y={0} width={12} height={12} rx={2} fill={GREEN} fillOpacity={0.16} stroke={GREEN} strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={202} y={11} fontSize={13} fontWeight={700} fill={INK_PRIMARY}>Secondary</text>
      </g>
    </svg>
  );
}

/* --- Strength bar SVG --- */

function StrengthBar({ count }: { count: number }) {
  const w = 200;
  const h = 32;
  const slots = 4;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 32 }}>
      {Array.from({ length: slots }, (_, i) => {
        const filled = i < count;
        const x = i * 46 + 10;
        return (
          <g key={i}>
            <rect x={x} y={6} width={36} height={20} rx={4} fill={filled ? GREEN : "transparent"} stroke={filled ? GREEN : HAIRLINE} strokeWidth={1.5} />
            {filled && <text x={x + 18} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">+</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* --- Main component --- */

export function PositiveArgala2411() {
  const [reference, setReference] = useState(7);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [inputs, setInputs] = useState({ second: "", fourth: "", eleventh: "" });
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [trapRevealed, setTrapRevealed] = useState<Record<string, boolean>>({});

  const argala = argalaFrom(reference);
  const ch = CHALLENGES[challengeIndex];
  const correct = submitted &&
    parseInt(inputs.second) === ch.answer.second &&
    parseInt(inputs.fourth) === ch.answer.fourth &&
    parseInt(inputs.eleventh) === ch.answer.eleventh;

  function nextChallenge() {
    setChallengeIndex((i) => (i + 1) % CHALLENGES.length);
    setInputs({ second: "", fourth: "", eleventh: "" });
    setSubmitted(false);
    setShowHint(false);
  }

  function resetChallenge() {
    setInputs({ second: "", fourth: "", eleventh: "" });
    setSubmitted(false);
    setShowHint(false);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Plus size={22} style={{ color: GREEN }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            Positive <IAST>Argala</IAST> -- 2nd, 4th, 11th
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Counting drill: find the positive-argala houses from any reference.
          </p>
        </div>
      </div>

      {/* === Section 1: Reference + Counting Diagram === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Target size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Counting from the Reference</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Pick a reference house. The positive-argala houses are the <strong>2nd (+1), 4th (+3), and 11th (+10)</strong> counted forward from it.
          The 5th (+4) is a secondary position by some authorities.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 space-y-3">
            <div>
              <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Reference house:</div>
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
            </div>

            <div className="space-y-2 text-xs" style={{ color: INK_SECONDARY }}>
              <div className="flex items-center gap-2 rounded-md p-2" style={{ background: "rgba(47,125,85,0.04)", border: `1px solid ${GREEN}` }}>
                <ArrowRight size={12} style={{ color: GREEN }} />
                <span><strong style={{ color: GREEN }}>2nd-from-ref</strong> = H{reference} + 1 = <strong>H{argala.second}</strong></span>
              </div>
              <div className="flex items-center gap-2 rounded-md p-2" style={{ background: "rgba(47,125,85,0.04)", border: `1px solid ${GREEN}` }}>
                <ArrowRight size={12} style={{ color: GREEN }} />
                <span><strong style={{ color: GREEN }}>4th-from-ref</strong> = H{reference} + 3 = <strong>H{argala.fourth}</strong></span>
              </div>
              <div className="flex items-center gap-2 rounded-md p-2" style={{ background: "rgba(47,125,85,0.04)", border: `1px solid ${GREEN}` }}>
                <ArrowRight size={12} style={{ color: GREEN }} />
                <span><strong style={{ color: GREEN }}>11th-from-ref</strong> = H{reference} + 10 = <strong>H{argala.eleventh}</strong> (wrap past 12)</span>
              </div>
              <div className="flex items-center gap-2 rounded-md p-2" style={{ background: "rgba(47,125,85,0.02)", border: `1px dashed ${GREEN}` }}>
                <ArrowRight size={12} style={{ color: `${GREEN}99` }} />
                <span><strong style={{ color: `${GREEN}99` }}>5th-from-ref (secondary)</strong> = H{reference} + 4 = <strong>H{argala.fifth}</strong></span>
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 rounded-lg p-4" style={{ border: `1px solid ${HAIRLINE}` }}>
            <CountingDiagram reference={reference} />
          </div>
        </div>
      </div>

      {/* === Section 2: Self-Check Challenges === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Lightbulb size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Self-Check Challenge</h4>
          <span className="text-xs" style={{ color: INK_MUTED }}>({challengeIndex + 1} / {CHALLENGES.length})</span>
        </div>

        <div className="text-xs" style={{ color: INK_SECONDARY }}>{ch.question}</div>

        <div className="grid grid-cols-3 gap-2">
          {(["second", "fourth", "eleventh"] as const).map((field) => (
            <label key={field} className="space-y-1">
              <span className="text-xs font-semibold" style={{ color: INK_SECONDARY }}>{field === "second" ? "2nd" : field === "fourth" ? "4th" : "11th"} from ref</span>
              <input
                type="text"
                inputMode="numeric"
                value={inputs[field]}
                onChange={(e) => setInputs((p) => ({ ...p, [field]: e.target.value }))}
                className="w-full rounded-md px-2 py-1.5 text-sm font-bold text-center"
                style={{ background: SURFACE, border: `1.5px solid ${submitted ? (parseInt(inputs[field]) === ch.answer[field] ? GREEN : VERMILION) : HAIRLINE}`, color: INK_PRIMARY }}
                disabled={submitted}
              />
            </label>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="px-4 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "rgba(47,125,85,0.08)", border: `1px solid ${GREEN}`, color: GREEN }}
            >
              Check answer
            </button>
          ) : (
            <>
              <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: correct ? "rgba(47,125,85,0.08)" : "rgba(162,58,30,0.08)", color: correct ? GREEN : VERMILION }}>
                {correct ? "Correct" : "Incorrect -- see below"}
              </span>
              <button onClick={nextChallenge} className="px-3 py-1.5 rounded-md text-xs font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                Next challenge
              </button>
            </>
          )}
          <button onClick={() => setShowHint((v) => !v)} className="px-2.5 py-1.5 rounded-md text-xs font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>
            {showHint ? "Hide hint" : "Hint"}
          </button>
          <button onClick={resetChallenge} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold" style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        {showHint && (
          <div className="rounded p-2.5 text-xs" style={{ background: "rgba(200,132,30,0.05)", border: `1px solid ${AMBER}` }}>
            <strong style={{ color: AMBER }}>Hint:</strong> {ch.hint}
          </div>
        )}

        {submitted && !correct && (
          <div className="rounded p-2.5 text-xs space-y-1" style={{ background: "rgba(162,58,30,0.04)", border: `1px solid ${VERMILION}` }}>
            <div style={{ color: VERMILION }}><strong>Correct answers:</strong> 2nd = H{ch.answer.second}, 4th = H{ch.answer.fourth}, 11th = H{ch.answer.eleventh}</div>
          </div>
        )}
      </div>

      {/* === Section 3: Strength Visualizer === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Plus size={16} style={{ color: GREEN }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Strength: More Planets Compound</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          Positive argala is not all-or-nothing. Its strength scales with the <strong>number of planets</strong> occupying the argala houses.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STRENGTH_EXAMPLES.map((ex) => (
            <div key={ex.key} className="rounded-lg p-3 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${ex.occupants > 0 ? GREEN : INK_MUTED}` }}>
              <div className="text-xs font-bold" style={{ color: ex.occupants > 0 ? GREEN : INK_MUTED }}>{ex.label}</div>
              <StrengthBar count={ex.occupants} />
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{ex.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* === Section 4: Trap Spotter === */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Eye size={16} style={{ color: VERMILION }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Spot the Error</h4>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>Each statement below contains a common mistake. Click to reveal the error and correction.</p>
        <div className="space-y-2">
          {TRAPS.map((trap) => {
            const rev = trapRevealed[trap.key];
            return (
              <button
                key={trap.key}
                onClick={() => setTrapRevealed((p) => ({ ...p, [trap.key]: !p[trap.key] }))}
                className="w-full text-left rounded-md p-3 space-y-1 transition-colors"
                style={{
                  background: rev ? "rgba(162,58,30,0.03)" : "transparent",
                  border: `1.5px solid ${rev ? VERMILION : HAIRLINE}`,
                }}
              >
                <div className="flex items-start gap-2">
                  {rev ? <XCircle size={14} style={{ color: VERMILION, marginTop: 2, flexShrink: 0 }} /> : <AlertTriangle size={14} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />}
                  <span className="text-xs font-semibold" style={{ color: rev ? VERMILION : INK_SECONDARY }}>{trap.statement}</span>
                </div>
                {rev && (
                  <div className="pl-5 space-y-1">
                    <div className="text-xs" style={{ color: VERMILION }}><strong>Error:</strong> {trap.error}</div>
                    <div className="text-xs" style={{ color: GREEN }}><strong>Correction:</strong> {trap.correction}</div>
                  </div>
                )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: "Using the wrong house-set", text: "Positive argala is exactly 2, 4, 11 (5th secondary). The 3rd, 10th, 12th are virodhārgala -- not positive." },
            { title: "Counting from the lagna by default", text: "Always restate the question: 'argala to which reference?' Count 2/4/11 forward from that house." },
            { title: "Off-by-one when wrapping past 12", text: "Use shortcuts: +1, +3, +10. Then subtract 12 if over. From 7th: 7+10=17 -> 17-12 = 5th." },
            { title: "Treating houses as absolute", text: "The 7th gives positive argala to the 4th (it is the 4th-from-the-4th). Position relative to reference decides everything." },
            { title: "Even counts cancel", text: "Positive argala occupants compound -- they add, never cancel. Only virodhārgala cancels." },
            { title: "Benefic-only argala", text: "Any planet in an argala house gives argala by position. Nature colours quality, not existence." },
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
