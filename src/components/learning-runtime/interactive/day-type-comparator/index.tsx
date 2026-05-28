"use client";

import { useState } from "react";
import { Columns3, Brain, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const DAY_TYPES = [
  {
    key: "savana",
    name: "Sāvana",
    devanagari: "सावन",
    color: GOLD,
    reference: "Sunrise → Sunrise",
    duration: "~24 hours",
    durationSec: 86400,
    scope: "Civil time, vāra (day-of-week), muhūrta timing, daily rituals",
    detail:
      "The sāvana day is the civil day of Vedic tradition. It begins and ends at sunrise (not midnight). The vāra (day-of-week) changes at sunrise, which creates important edge cases for births and events occurring before sunrise. All everyday scheduling, civil timekeeping, and muhūrta selection operate against the sāvana day.",
  },
  {
    key: "sidereal",
    name: "Sidereal",
    devanagari: "नक्षत्र",
    color: INDIGO,
    reference: "Fixed-star meridian → Same star meridian",
    duration: "~23h 56m 4s",
    durationSec: 86164,
    scope: "Planetary mean-motion, nakṣatra-timing, sidereal-position computation",
    detail:
      "The sidereal day is the time for Earth to complete one 360° rotation relative to fixed stars (or vernal equinox). It is ~3m 56s shorter than the sāvana day because Earth must rotate ~361° to realign with the Sun after moving ~1° in its orbit. Using sidereal-day reckoning prevents ~1°/year cumulative error in multi-year planetary computations.",
  },
  {
    key: "lunar",
    name: "Lunar (Tithi)",
    devanagari: "चान्द्र / तिथि",
    color: VERMILION,
    reference: "Sun-Moon 12° elongation increment",
    duration: "Mean ~23.62h; variable 19–26h",
    durationSec: 85000,
    scope: "Pañcāṅga, Vedic-festival timing, muhūrta election, tithi-based rituals",
    detail:
      "The lunar day (tithi) is defined by the Sun-Moon angular elongation increasing by 12°. There are 30 tithis in a lunar synodic month (~29.53 sāvana days). Tithi duration varies due to Keplerian orbital mechanics — perigee tithis can be ~19–20h, apogee tithis ~25–26h. This variability causes kṣaya (skipped) and vṛddhi (doubled) tithis.",
  },
  {
    key: "solar",
    name: "Solar",
    devanagari: "सौर",
    color: JADE,
    reference: "Saṅkrānti → Next saṅkrānti",
    duration: "~24h × 30 = ~30 sāvana days",
    durationSec: 2592000,
    scope: "Solar-month calendars, saṅkrānti festivals, Tājika annual-return, saṁhitā mundane cycles",
    detail:
      "The solar day-type is defined by the Sun's transit from one rāśi to the next (saṅkrānti). There are 12 saṅkrāntis in a solar year. The solar 'day' is thus ~30 sāvana days long. It is operationally used for solar-month regional calendars (e.g., Tamil calendar), Makara/Meṣa Saṅkrānti festivals, and Tājika annual-return (solar return) charts.",
  },
];

const BASELINE = 86400; // sāvana seconds

const QUIZ_SCENARIOS = [
  { text: "Computing the ascendant (lagna) from birth time and location.", answer: "savana", reason: "Lagna computation uses birth time (civil/sāvana time) + location + ayanāṁśa. The sidereal zodiac is used for positions, but the time input is sāvana civil time." },
  { text: "Computing planetary mean-motion over a 100-year period per Sūrya Siddhānta.", answer: "sidereal", reason: "Mean-motion computations in Sūrya Siddhānta use sidereal-day reckoning. Using sāvana days would accumulate ~1°/year error." },
  { text: "Determining the tithi for Śravaṇa Pūrnimā festival.", answer: "lunar", reason: "Tithi computation uses the lunar day-type (Sun-Moon elongation). Festivals like Pūrnimā are tithi-based." },
  { text: "Constructing a Tamil solar-month calendar.", answer: "solar", reason: "Solar-month calendars are anchored to saṅkrāntis (Sun's rāśi entry). The solar day-type is normative." },
  { text: "Finding when the Moon will enter Aśvinī nakṣatra for electional timing.", answer: "sidereal", reason: "Nakṣatra-timing uses the sidereal day-type. The Moon's sidereal position and transit through nakṣatras are computed against sidereal reckoning." },
  { text: "Selecting the vāra (day-of-week) for a business opening.", answer: "savana", reason: "Vāra is a 7-day cycle based on planetary lords, operating within the sāvana civil-day framework." },
];

export function DayTypeComparator() {
  const [mode, setMode] = useState<"compare" | "quiz">("compare");
  const [selected, setSelected] = useState<string | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const active = DAY_TYPES.find((d) => d.key === selected);
  const scenario = QUIZ_SCENARIOS[quizIndex];
  const answered = quizAnswer !== null;
  const isCorrect = answered && quizAnswer === scenario.answer;

  function handleQuizAnswer(key: string) {
    if (answered) return;
    setQuizAnswer(key);
    const correct = key === scenario.answer;
    setQuizScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  }

  function nextQuiz() {
    setQuizAnswer(null);
    setQuizIndex((i) => (i + 1) % QUIZ_SCENARIOS.length);
  }

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Mode toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("compare")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: mode === "compare" ? INDIGO : "var(--gl-surface-2)",
            color: mode === "compare" ? "#fff" : INK_SECONDARY,
          }}
        >
          <Columns3 size={14} />
          Compare
        </button>
        <button
          onClick={() => setMode("quiz")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: mode === "quiz" ? INDIGO : "var(--gl-surface-2)",
            color: mode === "quiz" ? "#fff" : INK_SECONDARY,
          }}
        >
          <Brain size={14} />
          Quiz ({quizScore.correct}/{quizScore.total})
        </button>
      </div>

      {/* ─── Compare mode ─── */}
      {mode === "compare" && (
        <div className="space-y-4">
          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DAY_TYPES.map((dt) => {
              const isSel = selected === dt.key;
              const barPct = Math.min((dt.durationSec / BASELINE) * 100, 100);
              return (
                <button
                  key={dt.key}
                  onClick={() => setSelected(isSel ? null : dt.key)}
                  className="text-left rounded-lg overflow-hidden transition-all"
                  style={{
                    backgroundColor: "var(--gl-surface-1)",
                    borderTop: `4px solid ${dt.color}`,
                    border: isSel ? `2px solid ${dt.color}` : "2px solid transparent",
                  }}
                >
                  <div className="p-3">
                    <div className="font-semibold text-sm">{dt.name}</div>
                    <div className="text-xs mb-2" style={{ color: INK_MUTED }}>
                      {dt.devanagari}
                    </div>
                    <div className="text-xs mb-1" style={{ color: INK_SECONDARY }}>
                      <strong>Ref:</strong> {dt.reference}
                    </div>
                    <div className="text-xs mb-2" style={{ color: INK_SECONDARY }}>
                      <strong>Dur:</strong> {dt.duration}
                    </div>
                    {/* Duration bar */}
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${dt.color}20` }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${barPct}%`, backgroundColor: dt.color }}
                      />
                    </div>
                    {dt.key === "solar" && (
                      <div className="text-[10px] mt-1" style={{ color: INK_MUTED }}>
                        Bar shows 30× scale relative to others
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          {active && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: `${active.color}10`,
                borderLeft: `4px solid ${active.color}`,
              }}
            >
              <div className="font-semibold text-base mb-1">
                {active.name}{" "}
                <span className="text-sm font-normal" style={{ color: INK_MUTED }}>
                  {active.devanagari}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-2">
                <div className="p-2 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Reference event</div>
                  <div className="font-medium">{active.reference}</div>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Duration</div>
                  <div className="font-medium">{active.duration}</div>
                </div>
                <div className="p-2 rounded" style={{ backgroundColor: "var(--gl-surface-2)" }}>
                  <div className="text-xs" style={{ color: INK_MUTED }}>Operational scope</div>
                  <div className="font-medium">{active.scope}</div>
                </div>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>{active.detail}</p>
            </div>
          )}

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
                  <th className="text-left py-2 px-2 font-semibold">Dimension</th>
                  {DAY_TYPES.map((d) => (
                    <th key={d.key} className="text-left py-2 px-2 font-semibold" style={{ color: d.color }}>
                      {d.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { dim: "Reference", vals: ["Sunrise", "Star meridian", "12° elongation", "Saṅkrānti"] },
                  { dim: "Duration", vals: ["~24h", "~23h 56m", "~23.62h (var)", "~30 sāvana days"] },
                  { dim: "Primary use", vals: ["Civil time", "Planetary motion", "Pañcāṅga / festivals", "Solar calendars"] },
                  { dim: "Variability", vals: ["Seasonal ±min", "Constant", "Kepler-driven ±3h", "Fixed 30-day"] },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${INK_MUTED}20` }}>
                    <td className="py-2 px-2 font-medium">{row.dim}</td>
                    {row.vals.map((v, j) => (
                      <td key={j} className="py-2 px-2" style={{ color: INK_SECONDARY }}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Quiz mode ─── */}
      {mode === "quiz" && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
            <div className="text-xs mb-2" style={{ color: INK_MUTED }}>
              Scenario {quizIndex + 1} of {QUIZ_SCENARIOS.length}
            </div>
            <p className="text-sm mb-4">{scenario.text}</p>

            <div className="grid grid-cols-2 gap-2">
              {DAY_TYPES.map((dt) => (
                <button
                  key={dt.key}
                  onClick={() => handleQuizAnswer(dt.key)}
                  disabled={answered}
                  className="p-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
                  style={{
                    backgroundColor: answered && scenario.answer === dt.key ? `${dt.color}20` : "var(--gl-surface-2)",
                    color: answered && scenario.answer === dt.key ? dt.color : INK_PRIMARY,
                    border: answered && scenario.answer === dt.key ? `2px solid ${dt.color}` : "2px solid transparent",
                  }}
                >
                  {dt.name}
                </button>
              ))}
            </div>
          </div>

          {answered && (
            <div
              className="p-4 rounded-lg"
              style={{
                backgroundColor: isCorrect ? `${JADE}10` : `${VERMILION}10`,
                borderLeft: `4px solid ${isCorrect ? JADE : VERMILION}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? <CheckCircle2 size={16} style={{ color: JADE }} /> : <XCircle size={16} style={{ color: VERMILION }} />}
                <span className="text-sm font-semibold">{isCorrect ? "Correct" : "Not quite"}</span>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>{scenario.reason}</p>
              <button
                onClick={nextQuiz}
                className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: INDIGO }}
              >
                <RotateCcw size={12} />
                Next scenario
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
