"use client";

import { useState } from "react";

interface Scenario {
  text: string;
  correct: "pancanga" | "instantaneous";
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    text: "Planning Dīpāvalī Lakṣmī Pūjā — checking which date the festival falls on this year",
    correct: "pancanga",
    explanation:
      "Festival dates are published in pañcāṅga form: the sunrise-anchored tithi that governs the ritual day. The pūjā is planned around the day's tithi, not a precise clock-moment.",
  },
  {
    text: "Recording the tithi in a client's natal (birth) chart born at 14:23",
    correct: "instantaneous",
    explanation:
      "Natal charts require the astronomical-instantaneous tithi at the exact birth moment. The pañcāṅga-tithi (sunrise-anchored) may differ if the birth occurs after a tithi transition during that day.",
  },
  {
    text: "A devotee checks today's tithi before beginning daily Sandhyāvandana",
    correct: "pancanga",
    explanation:
      "Daily ritual practice uses the pañcāṅga-tithi as published — the tithi that began at or before sunrise and governs the day's religious observances.",
  },
  {
    text: "A Jyotiṣa practitioner computes the muhūrta for a wedding ceremony scheduled at 11:47 AM",
    correct: "instantaneous",
    explanation:
      "Muhūrta election at a precise clock-time requires the astronomical-instantaneous tithi (and other limbs) at that exact moment — not the generic sunrise-anchored tithi of the day.",
  },
  {
    text: "A temple priest consults the calendar to know when Ekādaśī begins and ends for vrata observance",
    correct: "pancanga",
    explanation:
      "Vrata fasting rules are tied to the pañcāṅga-tithi and its end-time as published. The priest needs the sunrise-anchored tithi with its transition time, not an arbitrary clock-moment.",
  },
  {
    text: "Documenting the precise tithi at the moment a significant phone call began with a client",
    correct: "instantaneous",
    explanation:
      "For prashna (horary) or precise event-timing, the astronomical-instantaneous tithi at the exact event moment is operationally required.",
  },
];

export function TithiContextMatcher() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<"pancanga" | "instantaneous" | null>(null);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = SCENARIOS[index];
  const isCorrect = selected === current.correct;

  const handleChoice = (choice: "pancanga" | "instantaneous") => {
    if (selected) return;
    setSelected(choice);
    setAttempted((a) => a + 1);
    if (choice === current.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= SCENARIOS.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setAttempted(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / SCENARIOS.length) * 100);
    return (
      <div
        className="p-6 rounded-xl text-center"
        style={{
          background: "rgba(232,158,42,0.06)",
          border: "1px dashed rgba(156,122,47,0.35)",
        }}
      >
        <p
          className="text-lg mb-2"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-gold-accent)",
            fontWeight: 500,
          }}
        >
          {pct === 100 ? "Perfect discrimination." : pct >= 80 ? "Strong discrimination." : "Keep practising."}
        </p>
        <p className="text-sm mb-4" style={{ color: "var(--gl-ink-secondary)" }}>
          You correctly matched {score} of {SCENARIOS.length} scenarios ({pct}%).
        </p>
        <button
          onClick={handleRestart}
          className="px-4 py-2 rounded text-sm font-medium"
          style={{
            background: "rgba(232,158,42,0.12)",
            color: "#9C7A2F",
            border: "1px solid rgba(156,122,47,0.3)",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase" style={{ color: "#9C7A2F", letterSpacing: "0.14em", fontWeight: 700 }}>
          Scenario {index + 1} of {SCENARIOS.length}
        </p>
        <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
          Score: {score}/{attempted}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(156,122,47,0.12)" }}>
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all"
          style={{
            width: `${((index + (selected ? 1 : 0)) / SCENARIOS.length) * 100}%`,
            background: "#9C7A2F",
          }}
        />
      </div>

      {/* Scenario card */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: "rgba(232,158,42,0.04)",
          border: "1px solid rgba(156,122,47,0.15)",
        }}
      >
        <p
          className="text-base italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-primary)",
            lineHeight: 1.6,
          }}
        >
          &ldquo;{current.text}&rdquo;
        </p>
      </div>

      {/* Choice buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => handleChoice("pancanga")}
          disabled={!!selected}
          className="p-4 rounded-xl text-left transition-all"
          style={{
            background:
              selected === "pancanga"
                ? isCorrect
                  ? "rgba(46,125,50,0.08)"
                  : "rgba(212,80,46,0.08)"
                : "rgba(255,249,234,0.5)",
            border:
              selected === "pancanga"
                ? isCorrect
                  ? "1px solid rgba(46,125,50,0.4)"
                  : "1px solid rgba(212,80,46,0.4)"
                : "1px solid rgba(156,122,47,0.2)",
            cursor: selected ? "default" : "pointer",
            opacity: selected && selected !== "pancanga" ? 0.5 : 1,
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--gl-ink-primary)" }}>
            Pañcāṅga-tithi
          </p>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
            Sunrise-anchored · governs the ritual day
          </p>
        </button>

        <button
          onClick={() => handleChoice("instantaneous")}
          disabled={!!selected}
          className="p-4 rounded-xl text-left transition-all"
          style={{
            background:
              selected === "instantaneous"
                ? isCorrect
                  ? "rgba(46,125,50,0.08)"
                  : "rgba(212,80,46,0.08)"
                : "rgba(255,249,234,0.5)",
            border:
              selected === "instantaneous"
                ? isCorrect
                  ? "1px solid rgba(46,125,50,0.4)"
                  : "1px solid rgba(212,80,46,0.4)"
                : "1px solid rgba(156,122,47,0.2)",
            cursor: selected ? "default" : "pointer",
            opacity: selected && selected !== "instantaneous" ? 0.5 : 1,
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--gl-ink-primary)" }}>
            Astronomical-instantaneous
          </p>
          <p className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
            Moment-specific · for precise calculations
          </p>
        </button>
      </div>

      {/* Feedback */}
      {selected && (
        <div
          className="p-4 rounded-xl"
          style={{
            background: isCorrect ? "rgba(46,125,50,0.06)" : "rgba(212,80,46,0.06)",
            border: isCorrect ? "1px solid rgba(46,125,50,0.2)" : "1px solid rgba(212,80,46,0.2)",
          }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: isCorrect ? "#2E7D32" : "#D4502E" }}>
            {isCorrect ? "Correct." : "Not quite."}
          </p>
          <p className="text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
            {current.explanation}
          </p>
          <div className="mt-3 text-right">
            <button
              onClick={handleNext}
              className="px-4 py-1.5 rounded text-xs font-medium"
              style={{
                background: "rgba(232,158,42,0.12)",
                color: "#9C7A2F",
                border: "1px solid rgba(156,122,47,0.3)",
                cursor: "pointer",
              }}
            >
              {index + 1 >= SCENARIOS.length ? "See results" : "Next scenario"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
