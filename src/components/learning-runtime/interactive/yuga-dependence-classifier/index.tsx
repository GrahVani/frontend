"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Zap, Brain, Mountain } from "lucide-react";

const JADE = "#2F8C5A";
const VERMILION = "#A23A1E";
const INDIGO = "#4A6FA5";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

interface Scenario {
  text: string;
  verdict: "dependent" | "independent";
  reasoning: string;
}

const SCENARIOS: Record<string, Scenario[]> = {
  easy: [
    {
      text: "Computing the ascendant (lagna) rāśi from a client's birth time and location.",
      verdict: "independent",
      reasoning: "Lagna depends on birth time, location, and ayanāṁśa — not on yuga-position. Standard natal computation.",
    },
    {
      text: "Constructing the saṅkalpa formula for a Gṛha-praveśa (house-warming) ritual.",
      verdict: "dependent",
      reasoning: "Saṅkalpa explicitly names the current Kalpa, Manvantara, and Yuga. Operationally yuga-dependent.",
    },
    {
      text: "Determining the Vimśottarī daśā starting lord from the Moon's nakṣatra at birth.",
      verdict: "independent",
      reasoning: "Daśā lord depends on sidereal Moon position (ayanāṁśa), not yuga-position.",
    },
    {
      text: "Calculating the tithi for a given date (Sun-Moon angular separation).",
      verdict: "independent",
      reasoning: "Tithi depends on sidereal Sun-Moon angle, computed via ayanāṁśa. Yuga-independent.",
    },
  ],
  medium: [
    {
      text: "A saṁhitā practitioner predicting annual rainfall patterns using varṣa-yuga correlations.",
      verdict: "dependent",
      reasoning: "Varṣa-yuga computations in saṁhitā tradition (Bṛhat Saṁhitā) factor yuga-position into rainfall-cycle predictions.",
    },
    {
      text: "Selecting an auspicious nakṣatra for a wedding muhūrta.",
      verdict: "independent",
      reasoning: "Nakṣatra suitability depends on Moon's sidereal position and activity type — not on yuga-position. (The saṅkalpa is yuga-dependent, but nakṣatra selection itself is not.)",
    },
    {
      text: "A muhūrta practitioner verifying the vāra (day-of-week) lord for a business opening.",
      verdict: "independent",
      reasoning: "Vāra is a 7-day cycle determined by planetary lords. Yuga-independent.",
    },
    {
      text: "A mundane astrologer correlating historical cycles with yuga-scale planetary patterns.",
      verdict: "dependent",
      reasoning: "Mundane cycle analysis that explicitly correlates with yuga-scale historical patterns IS yuga-dependent.",
    },
  ],
  hard: [
    {
      text: "A researcher writing an academic paper on the history of Indian astronomy, analysing how yuga durations vary across Purāṇic texts.",
      verdict: "dependent",
      reasoning: "The research TOPIC is yuga-dependent (it's about yuga cycles). The researcher's task requires direct engagement with yuga-position frameworks.",
    },
    {
      text: "A practitioner explaining to a culturally-curious client that we are in Kali Yuga as part of general astrological counselling.",
      verdict: "independent",
      reasoning: "While the cultural explanation mentions yuga, the actual natal-chart computations the practitioner performs are yuga-independent. The cosmological context is cultural framing, not operational computation.",
    },
    {
      text: "Computing the Aṣṭottarī daśā (alternative 108-year daśā system) for a natal chart.",
      verdict: "independent",
      reasoning: "Aṣṭottarī daśā, like Vimśottarī, depends on birth data + ayanāṁśa. Yuga-independent.",
    },
    {
      text: "A temple priest constructing the full saṅkalpa for a Vedic fire ritual (homa) including Kalpa, Manvantara, Yuga, and year enumeration.",
      verdict: "dependent",
      reasoning: "The full ritual saṅkalpa is the paradigmatic yuga-dependent computation. Every cosmic-epoch parameter must be correctly named.",
    },
  ],
};

export function YugaDependenceClassifier() {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [index, setIndex] = useState(0);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);

  const scenarios = SCENARIOS[difficulty];
  const current = scenarios[index];
  const answered = verdict !== null;
  const isCorrect = answered && verdict === current.verdict;

  function handleVerdict(v: "dependent" | "independent") {
    if (answered) return;
    setVerdict(v);
    const correct = v === current.verdict;
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setStreak((s) => (correct ? s + 1 : 0));
  }

  function next() {
    setVerdict(null);
    setIndex((i) => (i + 1) % scenarios.length);
  }

  function reset() {
    setVerdict(null);
    setIndex(0);
    setScore({ correct: 0, total: 0 });
    setStreak(0);
  }

  const difficulties = [
    { key: "easy" as const, label: "Easy", icon: Zap },
    { key: "medium" as const, label: "Medium", icon: Brain },
    { key: "hard" as const, label: "Hard", icon: Mountain },
  ];

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Difficulty selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {difficulties.map((d) => {
          const active = difficulty === d.key;
          const Icon = d.icon;
          return (
            <button
              key={d.key}
              onClick={() => {
                setDifficulty(d.key);
                setIndex(0);
                setVerdict(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? INDIGO : "var(--gl-surface-2)",
                color: active ? "#fff" : INK_SECONDARY,
              }}
            >
              <Icon size={14} />
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Score bar */}
      <div className="flex items-center justify-between mb-4 text-xs" style={{ color: INK_SECONDARY }}>
        <span>
          Score: <strong>{score.correct}</strong> / {score.total}
        </span>
        <span>Streak: {streak} 🔥</span>
        <span>
          Card {index + 1} of {scenarios.length}
        </span>
      </div>

      {/* Scenario card */}
      <div
        className="p-5 rounded-lg mb-4"
        style={{ backgroundColor: "var(--gl-surface-1)" }}
      >
        <p className="text-sm leading-relaxed mb-4">{current.text}</p>

        <div className="flex gap-3">
          <button
            onClick={() => handleVerdict("dependent")}
            disabled={answered}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            style={{
              backgroundColor: answered && current.verdict === "dependent" ? `${VERMILION}20` : "var(--gl-surface-2)",
              color: answered && current.verdict === "dependent" ? VERMILION : INK_PRIMARY,
              border: answered && current.verdict === "dependent" ? `2px solid ${VERMILION}` : "2px solid transparent",
            }}
          >
            Yuga-Dependent
          </button>
          <button
            onClick={() => handleVerdict("independent")}
            disabled={answered}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            style={{
              backgroundColor: answered && current.verdict === "independent" ? `${JADE}20` : "var(--gl-surface-2)",
              color: answered && current.verdict === "independent" ? JADE : INK_PRIMARY,
              border: answered && current.verdict === "independent" ? `2px solid ${JADE}` : "2px solid transparent",
            }}
          >
            Yuga-Independent
          </button>
        </div>
      </div>

      {/* Feedback */}
      {answered && (
        <div className="space-y-3 mb-4">
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: isCorrect ? `${JADE}10` : `${VERMILION}10`,
              borderLeft: `4px solid ${isCorrect ? JADE : VERMILION}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? (
                <CheckCircle2 size={16} style={{ color: JADE }} />
              ) : (
                <XCircle size={16} style={{ color: VERMILION }} />
              )}
              <span className="text-sm font-semibold">
                {isCorrect ? "Correct!" : "Not quite."}
              </span>
            </div>
            <p className="text-sm" style={{ color: INK_SECONDARY }}>
              {current.reasoning}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={next}
              className="px-4 py-2 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: INDIGO }}
            >
              Next scenario
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm"
              style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs" style={{ color: INK_MUTED }}>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: VERMILION }} />
          <span>Yuga-Dependent = operationally requires cosmic-epoch knowledge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: JADE }} />
          <span>Yuga-Independent = computed from birth data + ayanāṁśa only</span>
        </div>
      </div>
    </div>
  );
}
