"use client";

/**
 * Ārūḍha Caveat Lab -- Lesson 17.4.5 Interactive
 *
 * Step-by-step exception detector, dual-lordship convention switcher
 * (Scorpio / Aquarius), and tradition-disclosure statement generator.
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  SIGNS,
  PARASHARI_LORDS,
  JAIMINI_LORDS,
  PRESETS,
  computeCaveat,
  isDualLordship,
} from "./data";
import type { Convention } from "./data";
import {
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  RotateCcw,
  Info,
  Shield,
  Scale,
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

/* --- Component --- */

export function ArudhaCaveatLab() {
  const [house, setHouse] = useState(1);
  const [lordPos, setLordPos] = useState(1);
  const [convention, setConvention] = useState<Convention>("parashari");

  const result = useMemo(() => computeCaveat(house, lordPos, convention), [house, lordPos, convention]);
  const dual = isDualLordship(house);

  function applyPreset(idx: number) {
    const p = PRESETS[idx];
    setHouse(p.house);
    setLordPos(p.lordPos);
    setConvention(p.convention);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Ārūḍha</IAST> Exception &amp; Tradition Lab
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Watch when the 1st/7th exception fires, switch lordship conventions for Scorpio and Aquarius, and generate a disclosure statement.
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} style={{ color: GOLD_ACCENT }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Source house</span>
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
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[house - 1]}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scale size={14} style={{ color: BLUE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lord placement</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setLordPos(i + 1)}
                  className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                  style={{
                    background: lordPos === i + 1 ? "rgba(59,130,246,0.08)" : "transparent",
                    border: `1.5px solid ${lordPos === i + 1 ? BLUE : HAIRLINE}`,
                    color: lordPos === i + 1 ? BLUE : INK_SECONDARY,
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="text-xs mt-1" style={{ color: INK_MUTED }}>{SIGNS[lordPos - 1]}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} style={{ color: PURPLE }} />
              <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Lordship convention</span>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setConvention("parashari")}
                className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                style={{
                  background: convention === "parashari" ? "rgba(59,130,246,0.08)" : "transparent",
                  border: `1.5px solid ${convention === "parashari" ? BLUE : HAIRLINE}`,
                  color: convention === "parashari" ? BLUE : INK_SECONDARY,
                }}
              >
                Parāśarī
              </button>
              <button
                onClick={() => setConvention("jaimini")}
                className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
                style={{
                  background: convention === "jaimini" ? "rgba(139,92,246,0.08)" : "transparent",
                  border: `1.5px solid ${convention === "jaimini" ? PURPLE : HAIRLINE}`,
                  color: convention === "jaimini" ? PURPLE : INK_SECONDARY,
                }}
              >
                Jaimini
              </button>
            </div>
            {dual ? (
              <div className="text-xs mt-1" style={{ color: INK_SECONDARY }}>
                {SIGNS[house - 1]}: {convention === "parashari" ? PARASHARI_LORDS[house - 1] : JAIMINI_LORDS[house - 1]}
              </div>
            ) : (
              <div className="text-xs mt-1" style={{ color: INK_MUTED }}>
                Lord: {PARASHARI_LORDS[house - 1]} (same in both conventions)
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs font-bold mb-2" style={{ color: INK_PRIMARY }}>Presets</div>
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

        <button
          onClick={() => applyPreset(0)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_MUTED }}
        >
          <RotateCcw size={11} /> Reset
        </button>
      </div>

      {/* Step-by-step trace */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.exceptionFired ? VERMILION : GREEN}` }}>
        <div className="flex items-center gap-2">
          {result.exceptionFired ? <AlertTriangle size={16} style={{ color: VERMILION }} /> : <CheckCircle2 size={16} style={{ color: GREEN }} />}
          <span className="text-sm font-bold" style={{ color: result.exceptionFired ? VERMILION : GREEN }}>
            {result.exceptionFired ? "Exception detected" : "No exception"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-md p-2.5 space-y-1" style={{ background: "rgba(156,122,47,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Source house</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{result.house} {SIGNS[result.house - 1]}</div>
          </div>
          <div className="rounded-md p-2.5 space-y-1" style={{ background: "rgba(59,130,246,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Lord ({result.lordName})</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{result.lordPos} {SIGNS[result.lordPos - 1]}</div>
          </div>
          <div className="rounded-md p-2.5 space-y-1" style={{ background: "rgba(47,125,85,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>First count (n)</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{result.n} sign{result.n === 1 ? "" : "s"}</div>
          </div>
          <div className="rounded-md p-2.5 space-y-1" style={{ background: "rgba(162,58,30,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Landing before exception</div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>H{result.landing} {SIGNS[result.landing - 1]}</div>
          </div>
        </div>

        {result.exceptionFired && (
          <div className="rounded-md p-3 space-y-2" style={{ background: "rgba(162,58,30,0.05)", border: `1px solid ${HAIRLINE}` }}>
            <div className="text-xs font-bold" style={{ color: VERMILION }}>
              {result.exceptionType === "1st" ? "1st-from-house exception" : "7th-from-house exception"}
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              {result.exceptionType === "1st"
                ? "The landing is the source house itself. A sign cannot be its own image, so the pāda shifts to the 10th from the landing."
                : "The landing is the 7th from the source house -- the unstable opposition axis. The pāda shifts to the 10th from the landing for a stable seat."}
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>
              Shift: 10th from {SIGNS[result.shiftFrom - 1]} = <strong>{SIGNS[result.correctedPada - 1]}</strong>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg p-3 space-y-1" style={{ border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
            <div className="text-xs font-bold" style={{ color: GREEN }}>Corrected pāda</div>
            <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{SIGNS[result.correctedPada - 1]}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>House {result.correctedPada}</div>
          </div>
          <div className="rounded-lg p-3 space-y-1" style={{ border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
            <div className="text-xs font-bold" style={{ color: AMBER }}>Convention used</div>
            <div className="text-lg font-bold" style={{ color: INK_PRIMARY }}>{convention === "parashari" ? "Parāśarī" : "Jaimini"}</div>
            <div className="text-xs" style={{ color: INK_MUTED }}>Lord: {result.lordName}</div>
          </div>
        </div>
      </div>

      {/* Dual-lordship comparison */}
      {dual && (
        <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${PURPLE}` }}>
          <div className="flex items-center gap-2">
            <Scale size={16} style={{ color: PURPLE }} />
            <span className="text-sm font-bold" style={{ color: PURPLE }}>Dual-lordship comparison — {SIGNS[house - 1]}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(["parashari", "jaimini"] as Convention[]).map((conv) => {
              const r = computeCaveat(house, lordPos, conv);
              return (
                <div key={conv} className="rounded-md p-3 space-y-1" style={{ border: `1.5px solid ${conv === convention ? (conv === "parashari" ? BLUE : PURPLE) : HAIRLINE}` }}>
                  <div className="text-xs font-bold" style={{ color: conv === "parashari" ? BLUE : PURPLE }}>
                    {conv === "parashari" ? "Parāśarī" : "Jaimini"}
                  </div>
                  <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Lord: {r.lordName}</div>
                  <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Pāda: {SIGNS[r.correctedPada - 1]}</div>
                  {r.exceptionFired && <div className="text-xs" style={{ color: VERMILION }}>Exception: {r.exceptionType}</div>}
                </div>
              );
            })}
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            The same chart, same house, different conventions -- {SIGNS[house - 1]} yields different padas depending on which lord you count to. Neither is wrong; the divergence lives in the rule, not the sky.
          </p>
        </div>
      )}

      {/* Disclosure statement */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${BLUE}` }}>
        <div className="flex items-center gap-2">
          <Info size={16} style={{ color: BLUE }} />
          <span className="text-sm font-bold" style={{ color: BLUE }}>Disclosure statement</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          This pāda was computed using the <strong>{convention === "parashari" ? "Parāśarī" : "Jaimini cara"}</strong> lordship convention
          {dual ? ` for ${SIGNS[house - 1]} (lord: ${result.lordName})` : ""}.
          The double-count method was applied {result.exceptionFired ? `with the 1st/7th exception shifting the landing to the 10th from ${SIGNS[result.shiftFrom - 1]}` : "without exception"}.
        </p>
        <p className="text-xs" style={{ color: INK_MUTED }}>
          Copy this into your reading notes. A pāda reported without its convention is not reproducible.
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
            { title: "Leaving the pada on the 1st/7th landing", text: "A sign cannot be its own image. Always shift to the 10th from the landing sign when the exception fires." },
            { title: "Shifting from the wrong anchor", text: "The shift is 10th from the landing sign, not from the lord or the house. For a 1st landing that equals 10th from the house; for a 7th landing it is 10th from the 7th sign." },
            { title: "Using Parāśarī lordship for Scorpio/Aquarius without disclosure", text: "Consciously choose and name which lord you count to. The silence is the fault, not the choice." },
            { title: "Blaming the chart when two readings disagree", text: "The chart is fixed by the ephemeris. Divergence lives in the rule -- exception-handling or lordship convention." },
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
