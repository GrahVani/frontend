"use client";

import { useState } from "react";

/* ─── Types & Data ─── */
type QualityKey = "nanda" | "bhadra" | "jaya" | "rikta" | "purna" | "multi";

interface QualityDef {
  key: QualityKey;
  label: string;
  sanskrit: string;
  meaning: string;
  color: string;
  bg: string;
  border: string;
}

const QUALITIES: QualityDef[] = [
  {
    key: "nanda",
    label: "Nandā",
    sanskrit: "नन्दा",
    meaning: "Joyful / Delight",
    color: "#2d7d46",
    bg: "rgba(45,125,70,0.08)",
    border: "#2d7d46",
  },
  {
    key: "bhadra",
    label: "Bhadrā",
    sanskrit: "भद्रा",
    meaning: "Gentle / Auspicious",
    color: "#1a6fb0",
    bg: "rgba(26,111,176,0.08)",
    border: "#1a6fb0",
  },
  {
    key: "jaya",
    label: "Jayā",
    sanskrit: "जया",
    meaning: "Victorious",
    color: "#b85c00",
    bg: "rgba(184,92,0,0.08)",
    border: "#b85c00",
  },
  {
    key: "rikta",
    label: "Riktā",
    sanskrit: "रिक्ता",
    meaning: "Empty / Void",
    color: "#a83232",
    bg: "rgba(168,50,50,0.08)",
    border: "#a83232",
  },
  {
    key: "purna",
    label: "Pūrṇā",
    sanskrit: "पूर्णा",
    meaning: "Full / Complete",
    color: "#6b3fa0",
    bg: "rgba(107,63,160,0.08)",
    border: "#6b3fa0",
  },
  {
    key: "multi",
    label: "Multi-element",
    sanskrit: "—",
    meaning: "Tithi alone is not sufficient",
    color: "var(--gl-gold-accent)",
    bg: "rgba(201,162,77,0.08)",
    border: "var(--gl-gold-accent)",
  },
];

interface ScenarioDef {
  id: number;
  question: string;
  correct: QualityKey;
  explanation: string;
  teaching: string;
}

const SCENARIOS: ScenarioDef[] = [
  {
    id: 1,
    question: "Client wants to open a business next Tuesday — what tithi-quality should you look for?",
    correct: "nanda",
    explanation:
      "Nandā (joyful) tithis are ideal for new ventures, business openings, and any beginning that seeks growth and prosperity.",
    teaching:
      "Business openings thrive on the 'joyful' energy of Nandā. Bhadrā can also support long-term stability, but Nandā is the primary choice.",
  },
  {
    id: 2,
    question: "Marriage muhūrta enquiry — which quality is most auspicious?",
    correct: "jaya",
    explanation:
      "Jayā (victorious) tithis carry the energy of triumph and are traditionally favoured for marriage muhūrta.",
    teaching:
      "Marriage is a ceremonial victory. Jayā is the classic choice; Bhadrā adds gentleness and can be paired for a fuller muhūrta.",
  },
  {
    id: 3,
    question: "House-warming ceremony — which tithi-quality is most appropriate?",
    correct: "bhadra",
    explanation:
      "Bhadrā (gentle / auspicious) tithis are ideal for foundation-laying, house-warming, and long-term commitments.",
    teaching:
      "House-warming is a 'foundation' act. Bhadrā provides the steady, blessed ground on which a home rests.",
  },
  {
    id: 4,
    question: "Ancestor-worship rite (Śrāddha) — which tithi-quality aligns best?",
    correct: "purna",
    explanation:
      "Pūrṇā (full / complete) tithis govern cycle-completion rites, ancestor worship on Amāvāsyā, and full-moon observances.",
    teaching:
      "Ancestor worship reaches its natural closure under Pūrṇā. The 'fullness' quality honours the completed cycle of life.",
  },
  {
    id: 5,
    question: "Gaṇeśa Caturthī vrata — what is your quality judgment?",
    correct: "rikta",
    explanation:
      "Riktā (empty / void) is generally avoided, yet contextually highly auspicious for Gaṇeśa-worship on Caturthī.",
    teaching:
      "This is the 'contextual override' principle: Riktā tithis are inauspicious for most new ventures, but sacred for specific deity observances.",
  },
  {
    id: 6,
    question: "Journey initiation — which tithi-quality should be avoided?",
    correct: "rikta",
    explanation: "Riktā (empty / void) tithis are generally avoided for travel and journey initiation.",
    teaching:
      "Avoid Riktā for journeys. Instead, look for Nandā (joyful travel) or Bhadrā (safe passage) tithis.",
  },
];

/* ─── Sub-components ─── */
function MuhurtaSynthesisPreview() {
  const limbs = [
    { name: "Tithi", active: true, desc: "Lunar day quality" },
    { name: "Vāra", active: false, desc: "Weekday lord" },
    { name: "Nakṣatra", active: false, desc: "Lunar mansion" },
    { name: "Yoga", active: false, desc: "Sun-Moon combination" },
    { name: "Karaṇa", active: false, desc: "Half-tithi division" },
  ];

  return (
    <div className="space-y-4">
      <h3
        className="text-sm font-semibold uppercase tracking-wider"
        style={{ color: "var(--gl-gold-accent)" }}
      >
        Multi-element Synthesis Preview
      </h3>
      <div className="flex flex-wrap gap-3">
        {limbs.map((limb) => (
          <div
            key={limb.name}
            className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all"
            style={{
              background: limb.active ? "rgba(201,162,77,0.12)" : "var(--gl-surface-card)",
              border: `1.5px solid ${limb.active ? "var(--gl-gold-accent)" : "var(--gl-border-subtle)"}`,
              minWidth: 100,
            }}
          >
            <span
              className="text-lg font-bold"
              style={{ color: limb.active ? "var(--gl-gold-accent)" : "var(--gl-ink-secondary)" }}
            >
              {limb.name}
            </span>
            <span className="text-xs text-center" style={{ color: "var(--gl-ink-muted)" }}>
              {limb.desc}
            </span>
            {limb.active && (
              <span className="text-xs font-semibold mt-1" style={{ color: "var(--gl-gold-accent)" }}>
                Highlighted
              </span>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)" }}>
        A complete muhūrta judgment synthesizes all five limbs. Tithi-quality is the entry point,
        but vāra, nakṣatra, yoga and karaṇa must also be examined for a robust election.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function TithiMuhurtaIntroductoryJudgment() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<QualityKey | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [shake, setShake] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const scenario = SCENARIOS[index];
  const isCorrect = selected === scenario.correct;

  const handleSelect = (key: QualityKey) => {
    if (showFeedback) return;
    setSelected(key);
  };

  const handleSubmit = () => {
    if (!selected || showFeedback) return;
    setShowFeedback(true);
    if (selected === scenario.correct) {
      if (!answered.has(scenario.id)) {
        setScore((s) => s + 1);
        setAnswered((prev) => new Set(prev).add(scenario.id));
      }
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowFeedback(false);
    setIndex((i) => (i + 1) % SCENARIOS.length);
  };

  const handlePrev = () => {
    setSelected(null);
    setShowFeedback(false);
    setIndex((i) => (i - 1 + SCENARIOS.length) % SCENARIOS.length);
  };

  const progress = Math.round((answered.size / SCENARIOS.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--gl-gold-accent)" }}
          >
            Scenario {index + 1} of {SCENARIOS.length}
          </h3>
          <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
            Score: {score} / {SCENARIOS.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-2 w-32 rounded-full overflow-hidden"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progress}%`,
                background: "var(--gl-gold-accent)",
              }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: "var(--gl-ink-muted)" }}>
            {progress}%
          </span>
        </div>
      </div>

      {/* Scenario card */}
      <div
        className="rounded-xl p-6 space-y-5"
        style={{
          background: "var(--gl-surface-card)",
          border: "1px solid var(--gl-border-subtle)",
        }}
      >
        <p className="text-base font-medium leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>
          {scenario.question}
        </p>

        {/* Quality options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUALITIES.map((q) => {
            const isSelected = selected === q.key;
            const disabled = showFeedback;
            return (
              <button
                key={q.key}
                onClick={() => handleSelect(q.key)}
                disabled={disabled}
                className="p-3 rounded-lg text-left transition-all disabled:opacity-60"
                style={{
                  background: isSelected ? q.bg : "rgba(0,0,0,0.1)",
                  border: `2px solid ${isSelected ? q.border : "transparent"}`,
                  opacity: disabled && !isSelected ? 0.5 : 1,
                }}
              >
                <div className="text-lg font-bold" style={{ color: q.color }}>
                  {q.sanskrit}
                </div>
                <div className="text-sm font-semibold" style={{ color: q.color }}>
                  {q.label}
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                  {q.meaning}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSubmit}
            disabled={!selected || showFeedback}
            className="px-5 py-2 rounded-md text-sm font-medium transition-all disabled:opacity-50"
            style={{
              background: "var(--gl-gold-accent)",
              color: "#0a0a0f",
              border: "1px solid var(--gl-gold-accent)",
            }}
          >
            Submit Judgment
          </button>
          <button
            onClick={handlePrev}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: "rgba(0,0,0,0.1)",
              color: "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-border-subtle)",
            }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-md text-sm font-medium transition-all"
            style={{
              background: "rgba(0,0,0,0.1)",
              color: "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-border-subtle)",
            }}
          >
            Next
          </button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div
            className={`rounded-lg p-4 space-y-2 transition-all ${shake ? "animate-shake" : ""}`}
            style={{
              background: isCorrect ? "rgba(201,162,77,0.08)" : "rgba(212,80,46,0.08)",
              border: `1.5px solid ${isCorrect ? "var(--gl-gold-accent)" : "#D4502E"}`,
            }}
          >
            <p className="text-sm font-semibold" style={{ color: isCorrect ? "var(--gl-gold-accent)" : "#D4502E" }}>
              {isCorrect ? "Correct — well judged!" : "Not quite — teaching note below"}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
              {isCorrect ? scenario.explanation : scenario.teaching}
            </p>
          </div>
        )}
      </div>

      {/* Synthesis preview */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--gl-surface-card)",
          border: "1px solid var(--gl-border-subtle)",
        }}
      >
        <MuhurtaSynthesisPreview />
      </div>

      {/* Inline shake animation */}
      <style>{`
        @keyframes coral-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: coral-shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
