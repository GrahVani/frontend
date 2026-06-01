"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldCheck, Microscope } from "lucide-react";

const JADE = "#3A8C5A";
const VERMILION = "#A23A1E";
const INDIGO = "#4A6FA5";
const GOLD = "#C28220";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const SCENARIOS = [
  {
    text: "Computing the ascendant (lagna) rāśi from a client's birth time and location.",
    verdict: "independent" as const,
    reasoning: "Lagna depends on birth time, location, and ayanāṁśa — not on yuga-position. Standard natal computation.",
    inputs: ["Birth time", "Location", "Ayanāṁśa"],
    category: "Natal chart",
    trap: "maximalist" as const,
  },
  {
    text: "Constructing the saṅkalpa formula for a Gṛha-praveśa (house-warming) ritual.",
    verdict: "dependent" as const,
    reasoning: "Saṅkalpa explicitly names the current Kalpa, Manvantara, and Yuga. Operationally yuga-dependent.",
    inputs: ["Current Kalpa", "Current Manvantara", "Current Yuga", "Current Saṁvatsara"],
    category: "Ritual",
    trap: "minimalist" as const,
  },
  {
    text: "Determining the Vimśottarī daśā starting lord from the Moon's nakṣatra at birth.",
    verdict: "independent" as const,
    reasoning: "Daśā lord depends on sidereal Moon position (ayanāṁśa), not yuga-position.",
    inputs: ["Natal Moon nakṣatra", "Ayanāṁśa"],
    category: "Daśā",
  },
  {
    text: "Calculating the tithi for a given date (Sun-Moon angular separation).",
    verdict: "independent" as const,
    reasoning: "Tithi depends on sidereal Sun-Moon angle, computed via ayanāṁśa. Yuga-independent.",
    inputs: ["Sun longitude", "Moon longitude", "Ayanāṁśa"],
    category: "Pañcāṅga",
  },
  {
    text: "A saṁhitā practitioner predicting annual rainfall patterns using varṣa-yuga correlations.",
    verdict: "dependent" as const,
    reasoning: "Varṣa-yuga computations in saṁhitā tradition (Bṛhat Saṁhitā) factor yuga-position into rainfall-cycle predictions.",
    inputs: ["Current Saṁvatsara", "Kali-ahargaṇa", "Yuga-position"],
    category: "Saṁhitā",
  },
  {
    text: "Selecting an auspicious nakṣatra for a wedding muhūrta.",
    verdict: "independent" as const,
    reasoning: "Nakṣatra suitability depends on Moon's sidereal position and activity type — not on yuga-position. The saṅkalpa is yuga-dependent, but nakṣatra selection itself is not.",
    inputs: ["Moon's sidereal position", "Activity type", "Muhūrta criteria"],
    category: "Muhūrta",
    trap: "maximalist" as const,
  },
  {
    text: "A muhūrta practitioner verifying the vāra (day-of-week) lord for a business opening.",
    verdict: "independent" as const,
    reasoning: "Vāra is a 7-day cycle determined by planetary lords. Yuga-independent.",
    inputs: ["Date", "Planetary lord cycle"],
    category: "Muhūrta",
  },
  {
    text: "A mundane astrologer correlating historical cycles with yuga-scale planetary patterns.",
    verdict: "dependent" as const,
    reasoning: "Mundane cycle analysis that explicitly correlates with yuga-scale historical patterns IS yuga-dependent.",
    inputs: ["Yuga-scale patterns", "Historical cycle data", "Kali-ahargaṇa"],
    category: "Mundane",
  },
  {
    text: "A researcher writing an academic paper on the history of Indian astronomy, analysing how yuga durations vary across Purāṇic texts.",
    verdict: "dependent" as const,
    reasoning: "The research TOPIC is yuga-dependent (it's about yuga cycles). The researcher's task requires direct engagement with yuga-position frameworks.",
    inputs: ["Yuga-cycle frameworks", "Purāṇic text references", "Cross-text comparison"],
    category: "Research",
  },
  {
    text: "A practitioner explaining to a culturally-curious client that we are in Kali Yuga as part of general astrological counselling.",
    verdict: "independent" as const,
    reasoning: "While the cultural explanation mentions yuga, the actual natal-chart computations are yuga-independent. The cosmological context is cultural framing, not operational computation.",
    inputs: ["Natal chart data", "Cultural context", "Client communication"],
    category: "Counselling",
    trap: "maximalist" as const,
  },
  {
    text: "Computing the Aṣṭottarī daśā (alternative 108-year daśā system) for a natal chart.",
    verdict: "independent" as const,
    reasoning: "Aṣṭottarī daśā, like Vimśottarī, depends on birth data + ayanāṁśa. Yuga-independent.",
    inputs: ["Natal data", "Ayanāṁśa", "Daśā progression"],
    category: "Daśā",
  },
  {
    text: "A temple priest constructing the full saṅkalpa for a Vedic fire ritual (homa) including Kalpa, Manvantara, Yuga, and year enumeration.",
    verdict: "dependent" as const,
    reasoning: "The full ritual saṅkalpa is the paradigmatic yuga-dependent computation. Every cosmic-epoch parameter must be correctly named.",
    inputs: ["Current Kalpa", "Current Manvantara", "Current Manu", "Current Yuga", "Current Saṁvatsara"],
    category: "Ritual",
  },
];

/* ─── Diagnostic Flowchart SVG ─── */
function DiagnosticFlowchart() {
  const W = 520;
  const H = 280;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[520px] mx-auto">
      {/* Central question box */}
      <rect x={W / 2 - 140} y={20} width={280} height={50} rx={8} fill={`${INDIGO}10`} stroke={INDIGO} strokeWidth={1.5} />
      <text x={W / 2} y={40} textAnchor="middle" fill={INDIGO} fontSize={11} fontWeight={600}>
        Does this computation require
      </text>
      <text x={W / 2} y={55} textAnchor="middle" fill={INDIGO} fontSize={11} fontWeight={600}>
        cosmic-epoch input?
      </text>

      {/* YES branch */}
      <line x1={W / 2 - 70} y1={70} x2={W / 2 - 120} y2={110} stroke={`${VERMILION}50`} strokeWidth={1.5} />
      <polygon points={`${W / 2 - 120},${110} ${W / 2 - 125},${105} ${W / 2 - 115},${105}`} fill={`${VERMILION}50`} />
      <text x={W / 2 - 100} y={92} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>YES</text>

      {/* NO branch */}
      <line x1={W / 2 + 70} y1={70} x2={W / 2 + 120} y2={110} stroke={`${JADE}50`} strokeWidth={1.5} />
      <polygon points={`${W / 2 + 120},${110} ${W / 2 + 115},${105} ${W / 2 + 125},${105}`} fill={`${JADE}50`} />
      <text x={W / 2 + 100} y={92} textAnchor="middle" fill={JADE} fontSize={10} fontWeight={600}>NO</text>

      {/* Yuga-Dependent box */}
      <rect x={20} y={110} width={220} height={145} rx={8} fill={`${VERMILION}08`} stroke={`${VERMILION}40`} strokeWidth={1.5} />
      <text x={130} y={132} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={700}>
        Yuga-Dependent
      </text>
      <text x={130} y={148} textAnchor="middle" fill={INK_MUTED} fontSize={9}>
        Requires cosmic-epoch knowledge
      </text>
      {/* Examples */}
      <text x={35} y={170} fill={VERMILION} fontSize={9} fontWeight={600}>• Saṅkalpa formulae</text>
      <text x={35} y={185} fill={VERMILION} fontSize={9} fontWeight={600}>• Varṣa-yuga correlations</text>
      <text x={35} y={200} fill={VERMILION} fontSize={9} fontWeight={600}>• Kali-ahargaṇa computations</text>
      <text x={35} y={215} fill={VERMILION} fontSize={9} fontWeight={600}>• Mundane yuga-pattern analysis</text>
      <text x={35} y={235} fill={VERMILION} fontSize={9} fontWeight={600}>• Ritual epoch enumeration</text>

      {/* Yuga-Independent box */}
      <rect x={280} y={110} width={220} height={145} rx={8} fill={`${JADE}08`} stroke={`${JADE}40`} strokeWidth={1.5} />
      <text x={390} y={132} textAnchor="middle" fill={JADE} fontSize={12} fontWeight={700}>
        Yuga-Independent
      </text>
      <text x={390} y={148} textAnchor="middle" fill={INK_MUTED} fontSize={9}>
        Birth data + ayanāṁśa only
      </text>
      {/* Examples */}
      <text x={295} y={170} fill={JADE} fontSize={9} fontWeight={600}>• Natal lagna computation</text>
      <text x={295} y={185} fill={JADE} fontSize={9} fontWeight={600}>• Vimśottarī daśā</text>
      <text x={295} y={200} fill={JADE} fontSize={9} fontWeight={600}>• Tithi calculation</text>
      <text x={295} y={215} fill={JADE} fontSize={9} fontWeight={600}>• Nakṣatra selection</text>
      <text x={295} y={235} fill={JADE} fontSize={9} fontWeight={600}>• Vāra / Horā / Muhūrta</text>
    </svg>
  );
}

export function YugaDependenceClassifier() {
  const [filter, setFilter] = useState<"all" | "dependent" | "independent">("all");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [userVerdict, setUserVerdict] = useState<"dependent" | "independent" | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const filtered = SCENARIOS.filter((s) => filter === "all" || s.verdict === filter);
  const practice = SCENARIOS[practiceIndex];
  const answered = userVerdict !== null;
  const practiceCorrect = answered && userVerdict === practice.verdict;

  const depCount = SCENARIOS.filter((s) => s.verdict === "dependent").length;
  const indCount = SCENARIOS.filter((s) => s.verdict === "independent").length;

  function submitVerdict(verdict: "dependent" | "independent") {
    if (answered) return;
    setUserVerdict(verdict);
    setScore((current) => ({
      correct: current.correct + (verdict === practice.verdict ? 1 : 0),
      total: current.total + 1,
    }));
  }

  function nextPractice() {
    setPracticeIndex((current) => (current + 1) % SCENARIOS.length);
    setUserVerdict(null);
  }

  return (
    <div className="w-full" data-interactive="yuga-dependence-classifier" style={{ color: INK_PRIMARY }}>
      {/* Diagnostic flowchart */}
      <div className="gl-surface-twilight-glass p-5 mb-4">
        <div className="text-xs font-semibold uppercase tracking-wider mb-3 text-center" style={{ color: INK_MUTED }}>
          The Diagnostic Question
        </div>
        <DiagnosticFlowchart />
      </div>

      {/* Three Positions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="gl-surface-twilight-glass p-4" style={{ borderLeft: `3px solid ${VERMILION}` }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} style={{ color: VERMILION }} />
            <span className="text-sm font-semibold" style={{ color: VERMILION }}>Maximalist</span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            Yuga affects every calculation. Over-applies cosmic-epoch framing. Operationally false.
          </p>
        </div>
        <div className="gl-surface-twilight-glass p-4" style={{ borderLeft: `3px solid ${VERMILION}80` }}>
          <div className="flex items-center gap-2 mb-2">
            <Microscope size={14} style={{ color: `${VERMILION}AA` }} />
            <span className="text-sm font-semibold" style={{ color: `${VERMILION}AA` }}>Minimalist</span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            Yuga is decorative vocabulary. Under-applies where it matters. Operationally false.
          </p>
        </div>
        <div className="gl-surface-twilight-glass p-4" style={{ borderLeft: `3px solid ${JADE}` }}>
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} style={{ color: JADE }} />
            <span className="text-sm font-semibold" style={{ color: JADE }}>Honest Weighting</span>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            Context-by-context discipline. The correct third path. Ask the diagnostic question every time.
          </p>
        </div>
      </div>

      {/* Practice classifier */}
      <div className="gl-surface-twilight-glass p-5 mb-5" aria-live="polite">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: INK_MUTED }}>
              Practice classifier
            </div>
            <div className="text-sm font-semibold" style={{ color: INDIGO }}>
              Scenario {practiceIndex + 1} of {SCENARIOS.length}
            </div>
          </div>
          <div className="text-sm font-semibold tabular-nums" style={{ color: INK_SECONDARY }}>
            Score {score.correct}/{score.total}
          </div>
        </div>
        <div className="mt-4 rounded-lg p-4" style={{ background: "var(--gl-surface-2, #F5EDD8)" }}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${INDIGO}12`, color: INDIGO }}>
              {practice.category}
            </span>
            {practice.trap && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}12`, color: GOLD }}>
                {practice.trap} trap
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
            {practice.text}
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(["dependent", "independent"] as const).map((verdict) => {
              const isDep = verdict === "dependent";
              const active = userVerdict === verdict;
              return (
                <button
                  key={verdict}
                  type="button"
                  onClick={() => submitVerdict(verdict)}
                  disabled={answered}
                  className="rounded-lg px-4 py-3 text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: active ? `${isDep ? VERMILION : JADE}18` : "rgba(255,255,255,0.62)",
                    color: isDep ? VERMILION : JADE,
                    border: `1px solid ${active ? (isDep ? VERMILION : JADE) : "transparent"}55`,
                    opacity: answered && !active ? 0.68 : 1,
                  }}
                >
                  {isDep ? "Yuga-dependent" : "Yuga-independent"}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="mt-4 rounded-lg p-3" style={{ backgroundColor: `${practiceCorrect ? JADE : VERMILION}10`, border: `1px solid ${practiceCorrect ? JADE : VERMILION}35` }}>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: practiceCorrect ? JADE : VERMILION }}>
                {practiceCorrect ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                {practiceCorrect ? "Correct diagnostic" : "Recheck the required inputs"}
              </div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {practice.inputs.map((input) => (
                  <span key={input} className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: `${INDIGO}10`, color: INDIGO }}>
                    {input}
                  </span>
                ))}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {practice.reasoning}
              </p>
              <button
                type="button"
                onClick={nextPractice}
                className="mt-3 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ backgroundColor: INDIGO, color: "#fff" }}
              >
                Next scenario
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter + Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {(["all", "dependent", "independent"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: filter === f ? (f === "dependent" ? `${VERMILION}18` : f === "independent" ? `${JADE}18` : `${INDIGO}18`) : "var(--gl-surface-2, #F5EDD8)",
                color: filter === f ? (f === "dependent" ? VERMILION : f === "independent" ? JADE : INDIGO) : INK_SECONDARY,
                border: filter === f ? `1px solid ${f === "dependent" ? VERMILION : f === "independent" ? JADE : INDIGO}40` : "1px solid transparent",
              }}
            >
              {f === "all" ? "All scenarios" : f === "dependent" ? "Yuga-Dependent" : "Yuga-Independent"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: INK_MUTED }}>
          <span><span style={{ color: VERMILION }}>{depCount}</span> dependent</span>
          <span>·</span>
          <span><span style={{ color: JADE }}>{indCount}</span> independent</span>
        </div>
      </div>

      {/* Scenario cards */}
      <div className="space-y-3">
        {filtered.map((s, i) => {
          const isOpen = expanded === i;
          const isDep = s.verdict === "dependent";
          return (
            <motion.div
              key={i}
              layout
              className="gl-surface-twilight-glass p-4 rounded-lg cursor-pointer transition-all"
              style={{
                borderLeft: `3px solid ${isDep ? VERMILION : JADE}`,
              }}
              onClick={() => setExpanded(isOpen ? null : i)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isDep ? `${VERMILION}12` : `${JADE}12`,
                        color: isDep ? VERMILION : JADE,
                      }}
                    >
                      {isDep ? "Yuga-Dependent" : "Yuga-Independent"}
                    </span>
                    <span className="text-[10px]" style={{ color: INK_MUTED }}>{s.category}</span>
                  </div>
                  <p className="text-sm" style={{ color: INK_PRIMARY }}>{s.text}</p>
                </div>
                {s.trap && (
                  <span
                    className="text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `${GOLD}10`,
                      color: GOLD,
                    }}
                  >
                    {s.trap} trap
                  </span>
                )}
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t" style={{ borderColor: `${INK_MUTED}20` }}>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {s.inputs.map((input) => (
                          <span
                            key={input}
                            className="text-[10px] px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: `${INDIGO}10`,
                              color: INDIGO,
                            }}
                          >
                            {input}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                        {s.reasoning}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
