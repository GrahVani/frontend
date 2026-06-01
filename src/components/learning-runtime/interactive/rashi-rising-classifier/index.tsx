"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useMemo, useCallback, useEffect } from "react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

type RisingType = "śīrṣodaya" | "pṛṣṭhodaya" | "ubhayodaya";

/* Corrected to Bṛhat Jātaka standard: 6 śīrṣodaya / 5 pṛṣṭhodaya / 1 ubhayodaya */
const RISING_DATA: Record<number, RisingType> = {
  1: "pṛṣṭhodaya",   // Mesha — back-first
  2: "pṛṣṭhodaya",   // Vṛṣabha — back-first
  3: "śīrṣodaya",    // Mithuna — head-first
  4: "pṛṣṭhodaya",   // Karka — back-first
  5: "śīrṣodaya",    // Siṁha — head-first
  6: "śīrṣodaya",    // Kanyā — head-first
  7: "śīrṣodaya",    // Tulā — head-first
  8: "śīrṣodaya",    // Vṛścika — head-first (commonly mis-classified!)
  9: "pṛṣṭhodaya",   // Dhanus — back-first
  10: "pṛṣṭhodaya",  // Makara — back-first
  11: "śīrṣodaya",   // Kumbha — head-first
  12: "ubhayodaya",  // Mīna — both-ways (the sole ubhayodaya)
};

const RISING_META: Record<RisingType, { label: string; meaning: string; color: string; mnemonic: string; signs: string; count: number; muhurta: string; prashna: string }> = {
  śīrṣodaya: {
    label: "Śīrṣodaya", meaning: "Head-first rising", color: "#C9A24D", count: 6,
    signs: "Mithuna, Siṁha, Kanyā, Tulā, Vṛścika, Kumbha",
    mnemonic: "6 signs rise head-first — note Vṛścika is here (the easy-to-miss one).",
    muhurta: "Favours initiating, going out, new ventures, offensive action.",
    prashna: "Direct, prompt answer — clear forward resolution.",
  },
  pṛṣṭhodaya: {
    label: "Pṛṣṭhodaya", meaning: "Back-first rising", color: "#A23A1E", count: 5,
    signs: "Mesha, Vṛṣabha, Karka, Dhanus, Makara",
    mnemonic: "5 signs rise back-first — Mesha included (it's back-rising, not head!).",
    muhurta: "Suits concluding, retreating, reverse or winding-down work.",
    prashna: "Indirect or delayed outcome — expect a slower resolution.",
  },
  ubhayodaya: {
    label: "Ubhayodaya", meaning: "Both-ways rising", color: "#4A90A4", count: 1,
    signs: "Mīna only",
    mnemonic: "Mīna alone — the two fish swim opposite directions, fittingly both-ways.",
    muhurta: "Context-dependent, flexible — can go either way.",
    prashna: "Ambiguous or evolving situation — answer is not yet settled.",
  },
};

const ALL_ANSWERS: RisingType[] = ["śīrṣodaya", "pṛṣṭhodaya", "ubhayodaya"];

interface AppQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  risingType: RisingType;
}

const APP_QUESTIONS: AppQuestion[] = [
  {
    question: "You want to elect a Lagna for initiating a new business venture. Which rising classification is best suited?",
    options: ["Śīrṣodaya (Head-rising)", "Pṛṣṭhodaya (Back-rising)", "Ubhayodaya (Both-ways)"],
    correctIndex: 0,
    explanation: "Śīrṣodaya (head-rising) signs favor initiating, going out, and forward assertive actions.",
    risingType: "śīrṣodaya"
  },
  {
    question: "A client asks a praśna (horary question) about a missing object. The Lagna is a back-rising (Pṛṣṭhodaya) sign. What does this suggest?",
    options: ["A direct and prompt recovery", "An indirect or delayed outcome", "An evolving or dual outcome"],
    correctIndex: 1,
    explanation: "Pṛṣṭhodaya (back-rising) signs signify indirect progress or delayed outcomes in praśna.",
    risingType: "pṛṣṭhodaya"
  },
  {
    question: "A praśna is asked about a complex, dual-natured situation. The rising sign is Mīna (Ubhayodaya). What does this suggest?",
    options: ["The situation is direct and will resolve immediately", "The situation is ambiguous, evolving, or dual", "The outcome is a clear failure"],
    correctIndex: 1,
    explanation: "Ubhayodaya (both-ways) signs signify ambiguous, evolving, or dual situations.",
    risingType: "ubhayodaya"
  },
  {
    question: "Which rising classification is most appropriate for concluding, retreating, or winding down a project?",
    options: ["Śīrṣodaya (Head-rising)", "Pṛṣṭhodaya (Back-rising)", "Ubhayodaya (Both-ways)"],
    correctIndex: 1,
    explanation: "Pṛṣṭhodaya (back-rising) signs suit concluding, retreating, and reverse or winding-down work.",
    risingType: "pṛṣṭhodaya"
  },
  {
    question: "A client asks a praśna and the Lagna is Vṛścika. Since Vṛścika is a head-rising (Śīrṣodaya) sign, how will it resolve?",
    options: ["Indirectly and with significant delay", "Directly, promptly, and forward-moving", "Ambiguously with dual outcomes"],
    correctIndex: 1,
    explanation: "Vṛścika is śīrṣodaya (head-rising), which indicates a direct, prompt answer or forward resolution.",
    risingType: "śīrṣodaya"
  },
  {
    question: "For general starting activities (such as setting out on a journey), which rising class should be chosen?",
    options: ["Śīrṣodaya (Head-first)", "Pṛṣṭhodaya (Back-first)", "Ubhayodaya (Both-ways)"],
    correctIndex: 0,
    explanation: "Initiating and setting out favor Śīrṣodaya Lagnas because they rise head-first.",
    risingType: "śīrṣodaya"
  }
];

export function RashiRisingClassifier() {
  const shouldReduceMotion = useReducedMotion();
  const [mode, setMode] = useState<"quiz" | "learn" | "drill">("learn");
  const [quizType, setQuizType] = useState<"rashi" | "application">("rashi");
  const [currentRashi, setCurrentRashi] = useState<number>(1);
  const [appIdx, setAppIdx] = useState<number>(0);
  const [selected, setSelected] = useState<RisingType | null>(null);
  const [selectedAppIdx, setSelectedAppIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [history, setHistory] = useState<{ rashi: number; guess: RisingType; actual: RisingType; correct: boolean }[]>([]);

  const isAppQuiz = (mode === "quiz" || mode === "drill") && quizType === "application";
  const correctAnswer = RISING_DATA[currentRashi];
  const currentAppQuestion = APP_QUESTIONS[appIdx];
  const appCorrectAnswer = ALL_ANSWERS[currentAppQuestion.correctIndex];
  
  const meta = RISING_META[isAppQuiz ? appCorrectAnswer : correctAnswer];
  const isCorrect = isAppQuiz ? selectedAppIdx === currentAppQuestion.correctIndex : selected === correctAnswer;

  const resetQuestion = useCallback((nextRashi?: number) => {
    setSelected(null);
    setSelectedAppIdx(null);
    setRevealed(false);
    setCurrentRashi(nextRashi ?? Math.floor(Math.random() * 12) + 1);
    setAppIdx(Math.floor(Math.random() * APP_QUESTIONS.length));
  }, []);

  const handleGuess = (guess: RisingType) => {
    if (revealed) return;
    setSelected(guess);
    setRevealed(true);
    const correct = guess === correctAnswer;
    setStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setHistory((h) => [...h.slice(-19), { rashi: currentRashi, guess, actual: correctAnswer, correct }]);
    if (correct) {
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const handleAppGuess = (idx: number) => {
    if (revealed) return;
    setSelectedAppIdx(idx);
    setRevealed(true);
    const correct = idx === currentAppQuestion.correctIndex;
    setStats((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setHistory((h) => [...h.slice(-19), { rashi: currentRashi, guess: ALL_ANSWERS[idx], actual: appCorrectAnswer, correct }]);
    if (correct) {
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    resetQuestion();
  };

  // Keyboard navigation: 1, 2, 3 selection, Enter/Space = next
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (mode !== "quiz" && mode !== "drill") return;
      if (revealed) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          nextQuestion();
        }
        return;
      }
      if (isAppQuiz) {
        const idx = Number(e.key) - 1;
        if (idx >= 0 && idx < currentAppQuestion.options.length) {
          e.preventDefault();
          handleAppGuess(idx);
        }
      } else {
        const map: Record<string, RisingType> = { "1": "śīrṣodaya", "2": "pṛṣṭhodaya", "3": "ubhayodaya" };
        if (map[e.key]) {
          e.preventDefault();
          handleGuess(map[e.key]);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, revealed, currentRashi, isAppQuiz, appIdx]);

  // Progress ring
  const progressPct = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
  const circumference = 2 * Math.PI * 20;

  // Rising type breakdown
  const risingCounts = useMemo(() => {
    const counts: Record<RisingType, number[]> = { śīrṣodaya: [], pṛṣṭhodaya: [], ubhayodaya: [] };
    RASHIS.forEach((r) => counts[RISING_DATA[r.number]].push(r.number));
    return counts;
  }, []);

  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap items-center">
        {(["learn", "quiz", "drill"] as const).map((m) => (
          <motion.button
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            key={m}
            onClick={() => { setMode(m); resetQuestion(); }}
            className="px-4 py-2 text-sm rounded-lg transition-all font-semibold focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
            style={{
              background: mode === m ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
              color: mode === m ? "#1a1a2e" : "var(--gl-ink-primary)",
              border: "1px solid var(--gl-gold-accent)",
              opacity: mode === m ? 1 : 0.7,
            }}
          >
            {m === "learn" ? "Learn" : m === "quiz" ? "Quiz" : "Drill Mode"}
          </motion.button>
        ))}
        
        <div className="ml-auto flex items-center gap-3">
          <div className="relative" style={{ width: 44, height: 44 }}>
            <svg width={44} height={44} viewBox="0 0 44 44">
              <circle cx={22} cy={22} r={20} fill="none" stroke="var(--gl-border-subtle)" strokeWidth={3} />
              <circle cx={22} cy={22} r={20} fill="none" stroke="#C9A24D" strokeWidth={3} strokeDasharray={circumference} strokeDashoffset={circumference * (1 - progressPct / 100)} strokeLinecap="round" transform="rotate(-90 22 22)" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: "var(--gl-gold-accent)" }}>
              {stats.total > 0 ? Math.round(progressPct) : 0}%
            </div>
          </div>
          <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
            <div>Streak: <strong style={{ color: "#C9A24D" }}>{streak}</strong></div>
            <div>Best: <strong style={{ color: "#C9A24D" }}>{bestStreak}</strong></div>
          </div>
        </div>
      </div>

      {mode === "learn" && (
        <div className="space-y-4">
          {/* 6/5/1 Count Summary */}
          <div className="flex gap-3 justify-center">
            {(Object.entries(RISING_META) as [RisingType, typeof RISING_META[RisingType]][]).map(([type, rm]) => (
              <div key={type} className="text-center px-4 py-2 rounded-lg" style={{ background: `${rm.color}10`, border: `1px solid ${rm.color}30` }}>
                <div className="text-2xl font-bold" style={{ color: rm.color, fontFamily: "var(--font-cormorant)" }}>{rm.count}</div>
                <div className="text-xs" style={{ color: rm.color }}>{rm.label}</div>
              </div>
            ))}
            <div className="text-center px-4 py-2 rounded-lg flex items-center" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>6 + 5 + 1 = <strong style={{ color: "var(--gl-gold-accent)" }}>12</strong></div>
            </div>
          </div>

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(Object.entries(risingCounts) as [RisingType, number[]][]).map(([type, rashiNums]) => {
              const rm = RISING_META[type];
              return (
                <div key={type} className="p-4 rounded-xl space-y-2" style={{ background: `${rm.color}10`, border: `1px solid ${rm.color}30` }}>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-semibold" style={{ color: rm.color, fontFamily: "var(--font-cormorant)" }}>{rm.label}</div>
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${rm.color}20`, color: rm.color }}>{rm.count}</span>
                  </div>
                  <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{rm.meaning}</div>
                  <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{rm.mnemonic}</div>
                  <div className="text-xs pt-1" style={{ color: "var(--gl-ink-secondary)" }}>Signs: <strong>{rm.signs}</strong></div>
                  <div className="flex gap-1.5 flex-wrap pt-2">
                    {rashiNums.map((n) => {
                      const r = RASHIS[n - 1];
                      const isVrschika = n === 8 && type === "śīrṣodaya";
                      return (
                        <motion.button
                          whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                          whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                          key={n}
                          onClick={() => { setCurrentRashi(n); setMode("quiz"); setQuizType("rashi"); resetQuestion(n); }}
                          className="px-2 py-1 rounded text-xs transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                          style={{
                            background: isVrschika ? `${rm.color}30` : `${r.color}20`,
                            color: isVrschika ? rm.color : r.color,
                            border: isVrschika ? `2px solid ${rm.color}` : `1px solid ${r.color}40`,
                            fontWeight: isVrschika ? 700 : 400,
                          }}
                          title={isVrschika ? "⚠ Vṛścika is śīrṣodaya — the common slip is to count it as back-rising!" : `${r.nameIAST} — ${rm.label}`}
                        >
                          {r.nameDevanagari} {isVrschika && "⚠"}
                        </motion.button>
                      );
                    })}
                  </div>
                  {/* Muhūrta / Praśna usage */}
                  <div className="pt-2 space-y-1" style={{ borderTop: `1px dashed ${rm.color}25` }}>
                    <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                      <strong style={{ color: rm.color }}>Muhūrta:</strong> {rm.muhurta}
                    </div>
                    <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                      <strong style={{ color: rm.color }}>Praśna:</strong> {rm.prashna}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vṛścika callout */}
          <div className="p-3 rounded-lg text-sm" style={{ background: "#C9A24D10", border: "1px solid #C9A24D30" }}>
            <strong style={{ color: "#C9A24D" }}>⚠ Common mistake:</strong>{" "}
            <span style={{ color: "var(--gl-ink-secondary)" }}>
              Vṛścika (Scorpio) is <strong>śīrṣodaya</strong> (head-rising), not back-rising. Its intensity &quot;feels&quot; backward, but the classical count places it among the six head-rising signs. The split is <strong>6 head / 5 back / 1 both</strong>.
            </span>
          </div>
        </div>
      )}

      {/* Quiz / Drill */}
      {(mode === "quiz" || mode === "drill") && (
        <div className="p-5 rounded-xl space-y-4" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          {/* Quiz Type Toggle */}
          <div className="flex gap-2 border-b border-gray-200 pb-3">
            <button
              onClick={() => { setQuizType("rashi"); resetQuestion(); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${quizType === "rashi" ? "bg-amber-100 border-amber-300 text-amber-900 font-bold" : "bg-white border-gray-200 text-gray-500"}`}
            >
              Rāśi Classification
            </button>
            <button
              onClick={() => { setQuizType("application"); resetQuestion(); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${quizType === "application" ? "bg-amber-100 border-amber-300 text-amber-900 font-bold" : "bg-white border-gray-200 text-gray-500"}`}
            >
              Muhūrta & Praśna Application
            </button>
          </div>

          {!isAppQuiz ? (
            /* Standard Rashi Quiz */
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: `${RASHIS[currentRashi - 1].color}20`, color: RASHIS[currentRashi - 1].color, fontFamily: "var(--font-devanagari)" }}>
                    {RASHIS[currentRashi - 1].nameDevanagari}
                  </div>
                  <div>
                    <div className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
                      <IAST>{RASHIS[currentRashi - 1].nameIAST}</IAST>
                    </div>
                    <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Rāśi #{currentRashi} · {RASHIS[currentRashi - 1].element} · {RASHIS[currentRashi - 1].modality}</div>
                  </div>
                </div>
                {mode === "drill" && (
                  <div className="text-xs px-2 py-1 rounded" style={{ background: "#A23A1E15", color: "#A23A1E", border: "1px solid #A23A1E30" }}>
                    Speed drill — {streak > 0 ? `${streak}x streak!` : "Answer quickly!"}
                  </div>
                )}
              </div>

              <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-secondary)" }}>Which rising classification does this rāśi have?</div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {ALL_ANSWERS.map((answer, idx) => {
                  const am = RISING_META[answer];
                  const isSelected = selected === answer;
                  const showResult = revealed && answer === correctAnswer;
                  const showWrong = revealed && isSelected && !isCorrect;
                  return (
                    <motion.button
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                      key={answer}
                      onClick={() => handleGuess(answer)}
                      disabled={revealed}
                      aria-pressed={isSelected}
                      className="p-3 rounded-lg text-left text-sm transition-all border w-full focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                      style={{
                        background: showResult ? `${am.color}20` : showWrong ? "#A23A1E15" : isSelected ? `${am.color}15` : "var(--gl-surface-manuscript)",
                        border: showResult ? `2px solid ${am.color}` : showWrong ? "2px solid #A23A1E" : isSelected ? `1px solid ${am.color}` : "1px solid var(--gl-border-subtle)",
                        color: "var(--gl-ink-primary)",
                        cursor: revealed ? "default" : "pointer",
                        opacity: revealed && !showResult && !showWrong ? 0.5 : 1,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", color: "var(--gl-ink-muted)" }}>{idx + 1}</span>
                        <span className="font-semibold" style={{ color: am.color }}>{am.label}</span>
                      </div>
                      <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>{am.meaning}</div>
                      {showResult && <div className="text-xs mt-1" style={{ color: am.color }}>✓ Correct!</div>}
                      {showWrong && <div className="text-xs mt-1" style={{ color: "#A23A1E" }}>✕ Incorrect — answer is {RISING_META[correctAnswer].label}</div>}
                    </motion.button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Application Quiz */
            <>
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase font-bold tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  Muhūrta & Praśna Judgment Practice
                </div>
                {mode === "drill" && (
                  <div className="text-xs px-2 py-1 rounded" style={{ background: "#A23A1E15", color: "#A23A1E", border: "1px solid #A23A1E30" }}>
                    Speed drill — {streak > 0 ? `${streak}x streak!` : "Answer quickly!"}
                  </div>
                )}
              </div>

              <div className="text-base font-semibold text-gray-800 leading-relaxed" style={{ fontFamily: "var(--font-sans)" }}>
                {currentAppQuestion.question}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {currentAppQuestion.options.map((option, idx) => {
                  const isSelected = selectedAppIdx === idx;
                  const isCorrectAnswer = idx === currentAppQuestion.correctIndex;
                  const showResult = revealed && isCorrectAnswer;
                  const showWrong = revealed && isSelected && !isCorrectAnswer;
                  
                  // Map options to meta colors
                  const am = RISING_META[ALL_ANSWERS[idx] || "śīrṣodaya"];

                  return (
                    <motion.button
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
                      whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                      key={idx}
                      onClick={() => handleAppGuess(idx)}
                      disabled={revealed}
                      className="p-3 rounded-lg text-left text-sm transition-all border w-full focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                      style={{
                        background: showResult ? `${am.color}20` : showWrong ? "#A23A1E15" : isSelected ? `${am.color}15` : "var(--gl-surface-manuscript)",
                        border: showResult ? `2px solid ${am.color}` : showWrong ? "2px solid #A23A1E" : isSelected ? `1px solid ${am.color}` : "1px solid var(--gl-border-subtle)",
                        color: "var(--gl-ink-primary)",
                        cursor: revealed ? "default" : "pointer",
                        opacity: revealed && !showResult && !showWrong ? 0.5 : 1,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}>{idx + 1}</span>
                        <span className="font-semibold" style={{ color: am.color }}>{option}</span>
                      </div>
                      {showResult && <div className="text-xs mt-1 font-bold" style={{ color: am.color }}>✓ Correct!</div>}
                      {showWrong && <div className="text-xs mt-1 font-bold" style={{ color: "#A23A1E" }}>✕ Incorrect</div>}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}

          {revealed && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg text-sm" style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}25` }}>
                <strong style={{ color: meta.color }}>Explanation:</strong> {isAppQuiz ? currentAppQuestion.explanation : `${meta.label} — ${meta.mnemonic}`}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  onClick={nextQuestion}
                  className="px-4 py-2 rounded-lg text-sm transition-all font-semibold focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                  style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
                >
                  {mode === "drill" ? "Next →" : "Next Question →"}
                </motion.button>
                <motion.button
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  onClick={() => setMode("learn")}
                  className="px-4 py-2 rounded-lg text-sm transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                  style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", color: "var(--gl-ink-secondary)" }}
                >
                  Back to Learn
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Session History</div>
          <div className="flex gap-1.5 flex-wrap">
            {history.map((h, i) => {
              const r = RASHIS[h.rashi - 1];
              return (
                <div key={i} className="w-8 h-8 rounded flex items-center justify-center text-xs cursor-default font-bold" style={{ background: h.correct ? "#C9A24D15" : "#A23A1E15", color: h.correct ? "#C9A24D" : "#A23A1E", border: `1px solid ${h.correct ? "#C9A24D30" : "#A23A1E30"}` }} title={`${r.nameIAST}: you guessed ${h.guess}, correct is ${h.actual}`}>
                  {r.nameDevanagari}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
