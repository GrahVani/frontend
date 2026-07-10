"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const READABLE_INK = "#3F2D1D";
const READABLE_SECONDARY = "#5C4630";
const READABLE_MUTED = "#745D40";
const CARD_SURFACE = "rgba(255, 250, 240, 0.96)";
const TABLE_LINE = "rgba(139, 118, 82, 0.28)";

const STREAMS = [
  {
    key: "parashari",
    name: "Parāśari",
    devanagari: "पाराशर्य",
    color: "#C9A24D",
    founded: "Classical (BPHS)",
    description: "Foundational stream — standard 12-rāśi sidereal system",
  },
  {
    key: "jaimini",
    name: "Jaimini",
    devanagari: "जैमिनीय",
    color: "#6B8E6B",
    founded: "Classical (Jaimini Sūtra)",
    description: "Same rāśis as Parāśari; diverges in technique (rāśi-dṛṣṭi, cāra-kāraka)",
  },
  {
    key: "kp",
    name: "KP",
    devanagari: "केपी",
    color: "#7BA7C0",
    founded: "Modern (K.S. Krishnamurti, 1965)",
    description: "Same rāśis; cusp-based bhāvas + sub-lord refinement",
  },
  {
    key: "tajika",
    name: "Tājika",
    devanagari: "ताजिक",
    color: "#5A8A9A",
    founded: "Indo-Persian synthesis",
    description: "Same rāśis; varṣaphala-specialised with saham overlays",
  },
  {
    key: "lalkitab",
    name: "Lal Kitab",
    devanagari: "लाल किताब",
    color: "#A23A1E",
    founded: "20th-century Urdu tradition",
    description: "Fundamental departure — fixed Meṣa = House 1 regardless of Lagna",
  },
];

const TOPICS = [
  {
    key: "rashi-system",
    label: "Rāśi System",
    data: {
      parashari: { text: "12 × 30° sidereal ecliptic. Standard BPHS rāśi-lords.", convergence: "base" },
      jaimini: { text: "Identical to Parāśari. Same 12 rāśis, same lords, same elements/modalities.", convergence: "same" },
      kp: { text: "Identical to Parāśari. Same 12 rāśis, same lords, same dignities.", convergence: "same" },
      tajika: { text: "Identical to Parāśari. Same 12 rāśis with Tājika-specific dignity additions.", convergence: "same" },
      lalkitab: { text: "Same 12 rāśis and same lords, BUT house-rāśi mapping is fixed: Meṣa = 1st house always.", convergence: "divergent" },
    },
  },
  {
    key: "house-system",
    label: "House System",
    data: {
      parashari: { text: "Whole-sign bhāva: rāśi containing Lagna = 1st house. Each subsequent rāśi = subsequent house.", convergence: "base" },
      jaimini: { text: "Whole-sign bhāva, same as Parāśari. Rāśi = house.", convergence: "same" },
      kp: { text: "Placidus-based cusps. Rāśi ≠ house. A graha can be in one rāśi but a different house.", convergence: "divergent" },
      tajika: { text: "Whole-sign or cusp-based depending on practitioner. Generally follows Parāśari whole-sign.", convergence: "same" },
      lalkitab: { text: "Fixed-Mesha-house-1: Meṣa = 1st house, Vṛṣabha = 2nd, etc. regardless of computed Lagna.", convergence: "departure" },
    },
  },
  {
    key: "dignities",
    label: "Dignities",
    data: {
      parashari: { text: "Full dignity doctrine: exaltation, debilitation, mūla-trikoṇa, own-sign, friend, enemy, neutral.", convergence: "base" },
      jaimini: { text: "Same full dignity doctrine as Parāśari.", convergence: "same" },
      kp: { text: "Same full dignity doctrine as Parāśari.", convergence: "same" },
      tajika: { text: "Same dignities + Tājika-specific additions (e.g., certain strength calculations for varṣaphala).", convergence: "same" },
      lalkitab: { text: "Simplified dignity framework. Some classical dignities are ignored or reinterpreted.", convergence: "divergent" },
    },
  },
  {
    key: "aspects",
    label: "Aspect System",
    data: {
      parashari: { text: "Graha-dṛṣṭi: 7 planets cast aspects based on their individual rules (Saturn 3rd/10th, Mars 4th/8th, etc.).", convergence: "base" },
      jaimini: { text: "Rāśi-dṛṣṭi: sign-based aspects. Chara↔Sthira (non-adjacent), Dvi-svabhāva↔Dvi-svabhāva.", convergence: "divergent" },
      kp: { text: "Graha-dṛṣṭi same as Parāśari, but aspects read through cusp-based house positions.", convergence: "same" },
      tajika: { text: "Tājika aspects: different aspect orbs and rules, influenced by Persian astrology.", convergence: "divergent" },
      lalkitab: { text: "Aspect system is de-emphasised. Interpretation is primarily house-based with unique Lal Kitab rules.", convergence: "divergent" },
    },
  },
  {
    key: "dasha",
    label: "Daśā System",
    data: {
      parashari: { text: "Vimśottarī (primary), Aṣṭottarī, Yoginī, etc. — nakṣatra-based or rāśi-based period systems.", convergence: "base" },
      jaimini: { text: "Jaimini rāśi-daśās: Chara daśā (primary), plus Sthira, Niryāṇa, etc. — rāśi-based rather than nakṣatra-based.", convergence: "divergent" },
      kp: { text: "KP uses Vimśottarī refined by the nakṣatra star-lord and sub-lord for precise timing.", convergence: "divergent" },
      tajika: { text: "Standard Vimśottarī for natal; Tājika-specific annual techniques (varṣaphala) for yearly predictions.", convergence: "same" },
      lalkitab: { text: "Lal Kitab uses its own timing system (years of planets) distinct from classical daśā.", convergence: "divergent" },
    },
  },
  {
    key: "application",
    label: "Primary Application",
    data: {
      parashari: { text: "Natal + predictive (general). The all-purpose foundation for most Jyotiṣa practice.", convergence: "base" },
      jaimini: { text: "Natal + predictive, with emphasis on rāśi-dṛṣṭi and cāra-kāraka techniques.", convergence: "same" },
      kp: { text: "Natal + predictive, with emphasis on precise timing through sub-lords and cusp-based houses.", convergence: "same" },
      tajika: { text: "Varṣaphala (annual charts) is the primary domain. Natal used secondarily.", convergence: "divergent" },
      lalkitab: { text: "Natal + remedial (upāya-heavy). Focus on practical solutions rather than theoretical precision.", convergence: "divergent" },
    },
  },
];

const CONVERGENCE_META: Record<string, { label: string; color: string; bg: string }> = {
  base: { label: "Reference", color: "#C9A24D", bg: "#C9A24D15" },
  same: { label: "Convergent", color: "#6B8E6B", bg: "#6B8E6B15" },
  divergent: { label: "Divergent", color: "#7BA7C0", bg: "#7BA7C015" },
  departure: { label: "Major Departure", color: "#A23A1E", bg: "#A23A1E15" },
};

const QUIZ_QUESTIONS = [
  { q: "Which stream uses rāśi-dṛṣṭi (sign-based aspects)?", a: "Jaimini", options: ["Parāśari", "Jaimini", "KP", "Tājika"] },
  { q: "Which stream fixes Meṣa as the 1st house regardless of Lagna?", a: "Lal Kitab", options: ["Parāśari", "KP", "Lal Kitab", "Tājika"] },
  { q: "Which stream uses Placidus-based cusp houses?", a: "KP", options: ["Jaimini", "KP", "Tājika", "Lal Kitab"] },
  { q: "Which stream is primarily used for varṣaphala (annual charts)?", a: "Tājika", options: ["Parāśari", "Jaimini", "KP", "Tājika"] },
  { q: "Which streams share rāśi-fundamentals completely with Parāśari?", a: "Jaimini + KP + Tājika", options: ["Jaimini only", "Jaimini + KP + Tājika", "All five", "None"] },
];

export function RashiStreamComparator() {
  const shouldReduceMotion = useReducedMotion();
  const [selectedStream, setSelectedStream] = useState("parashari");
  const [selectedTopic, setSelectedTopic] = useState("rashi-system");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [showQuiz, setShowQuiz] = useState(false);

  // Track explored cells as "{streamKey}_{topicKey}"
  const [exploredCells, setExploredCells] = useState<string[]>(["parashari_rashi-system"]);

  const markCellExplored = (streamKey: string, topicKey: string) => {
    const key = `${streamKey}_${topicKey}`;
    setExploredCells((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const selectCell = (streamKey: string, topicKey: string) => {
    setSelectedStream(streamKey);
    setSelectedTopic(topicKey);
    markCellExplored(streamKey, topicKey);
  };

  const stream = STREAMS.find((s) => s.key === selectedStream)!;
  const topic = TOPICS.find((t) => t.key === selectedTopic)!;
  const cell = topic.data[selectedStream as keyof typeof topic.data];
  const conv = CONVERGENCE_META[cell.convergence];

  const handleQuizGuess = (opt: string) => {
    if (quizAnswer) return;
    const q = QUIZ_QUESTIONS[quizIndex];
    const correct = opt === q.a;
    setQuizAnswer(opt);
    setQuizScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const nextQuiz = () => {
    setQuizAnswer(null);
    setQuizIndex((i) => (i + 1) % QUIZ_QUESTIONS.length);
  };

  // Criteria: at least 15 unique combinations explored and at least 4 quiz questions answered correctly
  const isCompleted = exploredCells.length >= 15 && quizScore.correct >= 4;

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Completion Status Panel */}
      <div 
        className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm transition-all"
        style={{ 
          background: isCompleted ? "rgba(107, 142, 107, 0.10)" : CARD_SURFACE, 
          border: `1px solid ${isCompleted ? "#6B8E6B" : "var(--gl-gold-hairline)"}` 
        }}
      >
        <div>
          <div className="font-semibold text-base flex items-center gap-1.5 animate-pulse" style={{ color: isCompleted ? "#3F7A52" : "#936817" }}>
            {isCompleted ? "✓ Interactive Lesson Completed!" : "🎯 Interactive Lesson Objectives"}
          </div>
          <div className="mt-1 leading-relaxed" style={{ color: READABLE_SECONDARY }}>
            Explore at least 15 stream-topic combinations (currently {exploredCells.length}/30) and score 4/5 or higher on the quiz.
          </div>
        </div>
        <div className="flex gap-4 font-medium sm:text-right flex-shrink-0">
          <div>
            <span style={{ color: READABLE_MUTED }}>Explored:</span>{" "}
            <span style={{ color: exploredCells.length >= 15 ? "#3F7A52" : "#936817" }}>{exploredCells.length} / 30</span>
          </div>
          <div>
            <span style={{ color: READABLE_MUTED }}>Quiz Score:</span>{" "}
            <span style={{ color: quizScore.correct >= 4 ? "#3F7A52" : READABLE_MUTED }}>{quizScore.correct} / {Math.max(5, quizScore.total)}</span>
          </div>
        </div>
      </div>

      {/* Stream selector */}
      <div className="flex gap-2 flex-wrap">
        {STREAMS.map((s) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={s.key}
            onClick={() => selectCell(s.key, selectedTopic)}
            className="px-4 py-3 rounded-xl text-left transition-all"
            style={{
              background: selectedStream === s.key ? `${s.color}22` : CARD_SURFACE,
              border: `1px solid ${selectedStream === s.key ? s.color : TABLE_LINE}`,
              color: selectedStream === s.key ? s.color : READABLE_INK,
              minWidth: 136,
              boxShadow: selectedStream === s.key ? `0 8px 22px ${s.color}18` : "0 6px 18px rgba(63, 45, 29, 0.05)",
            }}
          >
            <div className="font-semibold" style={{ fontFamily: "var(--font-devanagari)", fontSize: 15 }}>{s.devanagari}</div>
            <div className="font-semibold text-base">{s.name}</div>
            <div className="text-sm leading-snug mt-1" style={{ color: READABLE_MUTED }}>{s.founded}</div>
          </motion.button>
        ))}
      </div>

      {/* Topic selector */}
      <div className="flex gap-2 flex-wrap">
        {TOPICS.map((t) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={t.key}
            onClick={() => selectCell(selectedStream, t.key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: selectedTopic === t.key ? "#A97818" : CARD_SURFACE,
              color: selectedTopic === t.key ? "#FFF9EA" : READABLE_SECONDARY,
              border: "1px solid var(--gl-gold-accent)",
            }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="p-5 rounded-xl space-y-4 animate-fade-in" style={{ background: CARD_SURFACE, border: `1px solid ${conv.color}55`, boxShadow: "0 10px 28px rgba(63, 45, 29, 0.07)" }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: conv.color }} />
          <span className="font-semibold text-base" style={{ color: conv.color, fontFamily: "var(--font-cormorant)" }}>
            {stream.name} · {topic.label}
          </span>
          <span className="ml-auto px-3 py-1 rounded-lg text-sm font-semibold" style={{ background: conv.bg, color: conv.color, border: `1px solid ${conv.color}55` }}>
            {conv.label}
          </span>
        </div>
        <p className="text-base" style={{ color: READABLE_SECONDARY, lineHeight: 1.65 }}>
          {cell.text}
        </p>
      </div>

      {/* Full matrix summary */}
      <div className="overflow-x-auto">
        <table role="grid" aria-label="Streams and Topics Comparison Matrix" className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr role="row">
              <th role="columnheader" className="text-left p-3 font-semibold" style={{ color: READABLE_INK, borderBottom: `1px solid ${TABLE_LINE}` }}>Stream \ Topic</th>
              {TOPICS.map((t) => (
                <th role="columnheader" key={t.key} className="text-center p-3 font-semibold" style={{ color: "#936817", borderBottom: `1px solid ${TABLE_LINE}`, minWidth: 112 }}>{t.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STREAMS.map((s) => (
              <tr role="row" key={s.key}>
                <th role="rowheader" className="p-3 font-semibold text-left" style={{ color: s.color, borderBottom: `1px solid ${TABLE_LINE}` }}>
                  <span style={{ fontFamily: "var(--font-devanagari)" }}>{s.devanagari}</span> {s.name}
                </th>
                {TOPICS.map((t) => {
                  const c = t.data[s.key as keyof typeof t.data].convergence;
                  const cm = CONVERGENCE_META[c];
                  const isCellSelected = selectedStream === s.key && selectedTopic === t.key;
                  return (
                    <td role="gridcell" key={t.key} className="p-3 text-center" style={{ borderBottom: `1px solid ${TABLE_LINE}` }}>
                      <motion.button
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                        onClick={() => selectCell(s.key, t.key)}
                        className="w-9 h-9 rounded-full inline-flex items-center justify-center text-base font-bold transition-all"
                        style={{ 
                          background: cm.bg, 
                          color: cm.color, 
                          border: isCellSelected ? `2px solid ${s.color}` : `1px solid ${cm.color}60`,
                          boxShadow: isCellSelected ? `0 0 0 3px ${s.color}22` : "0 4px 12px rgba(63, 45, 29, 0.07)",
                        }}
                        aria-label={`${s.name} ${t.label} convergence: ${cm.label}`}
                        aria-selected={isCellSelected}
                      >
                        {c === "base" ? "★" : c === "same" ? "✓" : c === "divergent" ? "~" : "✕"}
                      </motion.button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 text-sm flex-wrap font-medium" style={{ color: READABLE_MUTED }}>
        <span><span style={{ color: "#C9A24D" }}>★</span> Reference</span>
        <span><span style={{ color: "#6B8E6B" }}>✓</span> Convergent</span>
        <span><span style={{ color: "#7BA7C0" }}>~</span> Divergent</span>
        <span><span style={{ color: "#A23A1E" }}>✕</span> Major Departure</span>
      </div>

      {/* Mini quiz toggle */}
      <motion.button
        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        onClick={() => setShowQuiz((s) => !s)}
        className="px-5 py-3 rounded-lg text-base font-medium transition-all"
        style={{ background: showQuiz ? "#A97818" : CARD_SURFACE, color: showQuiz ? "#FFF9EA" : READABLE_INK, border: "1px solid var(--gl-gold-accent)" }}
      >
        {showQuiz ? "Hide Spot-the-Divergence Quiz" : "🎯 Spot-the-Divergence Quiz"}
      </motion.button>

      {showQuiz && (
        <div className="p-5 rounded-xl space-y-4" style={{ background: CARD_SURFACE, border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 8px 24px rgba(63,45,29,0.07)" }}>
          <div className="flex justify-between text-sm font-medium" style={{ color: READABLE_SECONDARY }}>
            <span>Question {quizIndex + 1} / {QUIZ_QUESTIONS.length}</span>
            <span>Score: <strong style={{ color: "var(--gl-gold-accent)" }}>{quizScore.correct}/{quizScore.total}</strong></span>
          </div>
          <div className="text-xl font-semibold" style={{ color: READABLE_INK, fontFamily: "var(--font-cormorant)" }}>
            {QUIZ_QUESTIONS[quizIndex].q}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {QUIZ_QUESTIONS[quizIndex].options.map((opt) => {
              const isAnswered = quizAnswer !== null;
              const isCorrect = opt === QUIZ_QUESTIONS[quizIndex].a;
              return (
                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  key={opt}
                  onClick={() => handleQuizGuess(opt)}
                  disabled={isAnswered}
                  className="p-3 rounded-lg text-base text-left transition-all"
                  style={{
                    background: isAnswered && isCorrect ? "#6B8E6B20" : isAnswered && quizAnswer === opt ? "#A23A1E20" : "var(--gl-surface-manuscript)",
                    border: `1px solid ${isAnswered && isCorrect ? "#6B8E6B" : isAnswered && quizAnswer === opt ? "#A23A1E" : "var(--gl-border-subtle)"}`,
                    color: isAnswered && isCorrect ? "#3F7A52" : isAnswered && quizAnswer === opt ? "#A23A1E" : READABLE_INK,
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
          {quizAnswer && (
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={nextQuiz}
              className="px-4 py-2 rounded-lg text-sm"
              style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
            >
              Next →
            </motion.button>
          )}
        </div>
      )}

      {/* Cross-references */}
      <div className="text-sm p-3 rounded-lg leading-relaxed" style={{ background: CARD_SURFACE, border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", color: READABLE_MUTED }}>
        Cross-references:{" "}
        <span style={{ color: READABLE_SECONDARY }}>
          Stream overviews → KP → Module 16 · Jaimini → Module 17 · Lal Kitab → Module 18 · Tājika → Module 19 (Nāḍī → Module 20)
        </span>
      </div>
    </div>
  );
}
