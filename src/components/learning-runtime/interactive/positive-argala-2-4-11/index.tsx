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
  CheckCircle2,
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

function CountingDiagram({ reference }: { reference: number }) {
  const w = 320;
  const h = 340;
  const cx = w / 2;
  const cy = h / 2 - 6;
  const r = 105;
  const argala = argalaFrom(reference);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 300 }}>
      {Array.from({ length: 12 }, (_, i) => {
        const hnum = i + 1;
        const isRef = hnum === reference;
        const isSecond = hnum === argala.second;
        const isFourth = hnum === argala.fourth;
        const isEleventh = hnum === argala.eleventh;
        const isFifth = hnum === argala.fifth;

        let fill = "transparent";
        let opacity = 0;
        if (isRef) { fill = GOLD_ACCENT; opacity = 0.12; }
        else if (isSecond || isFourth || isEleventh) { fill = GREEN; opacity = 0.12; }
        else if (isFifth) { fill = GREEN; opacity = 0.05; }

        return <path key={hnum} d={sectorPath(cx, cy, 38, r + 5, hnum, 26)} fill={fill} fillOpacity={opacity} stroke="none" />;
      })}

      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 36} fill="none" stroke={HAIRLINE} strokeWidth={0.8} strokeDasharray="3 3" />

      {Array.from({ length: 12 }, (_, i) => {
        const a = houseXY(cx, cy, r, i + 1);
        const b = houseXY(cx, cy, r - 7, i + 1);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={HAIRLINE} strokeWidth={1} />;
      })}

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

      <text x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="middle" fontSize={11} fontWeight={700} fill={GOLD_ACCENT}>REF</text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={600} fill={INK_MUTED}>H{reference}</text>

      <g transform={`translate(16, ${h - 52})`}>
        <rect x={0} y={0} width={10} height={10} rx={2} fill={GOLD_ACCENT} fillOpacity={0.15} stroke={GOLD_ACCENT} strokeWidth={1} />
        <text x={15} y={9} fontSize={9} fill={INK_SECONDARY}>Reference</text>
        <rect x={70} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.15} stroke={GREEN} strokeWidth={1} />
        <text x={85} y={9} fontSize={9} fill={INK_SECONDARY}>Positive</text>
        <rect x={140} y={0} width={10} height={10} rx={2} fill={GREEN} fillOpacity={0.08} stroke={GREEN} strokeWidth={1} strokeDasharray="2 1" />
        <text x={155} y={9} fontSize={9} fill={INK_SECONDARY}>Secondary</text>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
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

          <div className="rounded-lg p-2" style={{ border: `1px solid ${HAIRLINE}` }}>
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
