"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { IAST } from "@/components/learning-runtime/chrome/typography";
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const READABLE_INK = "#3F2D1D";
const READABLE_SECONDARY = "#5C4630";
const READABLE_MUTED = "#745D40";
const CARD_SURFACE = "rgba(255, 250, 240, 0.96)";

const MODALITIES = [
  { key: "Chara", label: "Chara (Cardinal)", devanagari: "चर", icon: "↗", color: "#C9A24D", description: "Initiating, active, moving" },
  { key: "Sthira", label: "Sthira (Fixed)", devanagari: "स्थिर", icon: "■", color: "#5A8A9A", description: "Persisting, stable, maintaining" },
  { key: "Dvi-svabhāva", label: "Dvi-svabhāva (Mutable)", devanagari: "द्विस्वभाव", icon: "~", color: "#8A6BB5", description: "Adapting, transitional, flexible" },
];

const CROSS_QUESTIONS = [
  { question: "Which fire rāśi is Sthira?", answer: "Siṁha", options: ["Meṣa", "Siṁha", "Dhanus"] },
  { question: "How many Chara rāśis are feminine?", answer: "2", options: ["1", "2", "3", "4"] },
  { question: "Which element has one rāśi of each modality?", answer: "All four", options: ["Fire only", "Water only", "All four", "None"] },
  { question: "Name the Sthira water rāśi.", answer: "Vṛścika", options: ["Karka", "Vṛścika", "Mīna"] },
  { question: "Which modality has no fire rāśi?", answer: "None — all modalities have fire", options: ["Chara", "Sthira", "Dvi-svabhāva", "None — all modalities have fire"] },
];

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type GamePhase = "learn" | "menu" | "playing" | "cross" | "result" | "review";
type Difficulty = "apprentice" | "scholar" | "pundit";

export function RashiModalityClassifier() {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<GamePhase>("learn");
  const [difficulty, setDifficulty] = useState<Difficulty>("scholar");
  const [queue, setQueue] = useState<typeof RASHIS>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<Array<{ rashi: typeof RASHIS[0]; guessed: string; correct: string }>>([]);
  const [crossIndex, setCrossIndex] = useState(0);
  const [crossScore, setCrossScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);

  const current = queue[index];

  // Group rāśis by modality for Learn mode
  const modalityCounts = useMemo(() => {
    const counts: Record<string, number[]> = { Chara: [], Sthira: [], "Dvi-svabhāva": [] };
    RASHIS.forEach((r) => counts[r.modality].push(r.number));
    return counts;
  }, []);

  const startGame = useCallback((diff: Difficulty) => {
    setDifficulty(diff);
    let pool = RASHIS;
    if (diff === "apprentice") {
      pool = RASHIS.filter((r) => r.modality === "Chara");
    }
    setQueue(shuffleArray(pool));
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWrongAnswers([]);
    setFeedback(null);
    setResponseTimes([]);
    setQuestionStartTime(Date.now());
    setTimeLeft(10);
    setPhase("playing");
  }, []);

  const startTargetedGame = useCallback((rashiNum: number) => {
    setDifficulty("scholar");
    const otherRashis = RASHIS.filter((r) => r.number !== rashiNum);
    setQueue([RASHIS[rashiNum - 1], ...shuffleArray(otherRashis)]);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setWrongAnswers([]);
    setFeedback(null);
    setResponseTimes([]);
    setQuestionStartTime(Date.now());
    setTimeLeft(10);
    setPhase("playing");
  }, []);

  const handleGuess = useCallback((modality: string) => {
    if (!current || feedback) return;
    const elapsed = (Date.now() - questionStartTime) / 1000;
    setResponseTimes((t) => [...t, elapsed]);
    const correct = current.modality === modality;
    const speedBonus = elapsed < 2 ? 5 : 0;
    if (correct) {
      setScore((s) => s + 10 + (streak >= 2 ? 5 : 0) + speedBonus);
      setStreak((s) => {
        const ns = s + 1;
        setBestStreak((b) => Math.max(b, ns));
        return ns;
      });
      setFeedback("correct");
    } else {
      setStreak(0);
      setWrongAnswers((w) => [...w, { rashi: current, guessed: modality, correct: current.modality }]);
      setFeedback("wrong");
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 < queue.length) {
        setIndex((i) => i + 1);
        setQuestionStartTime(Date.now());
      } else {
        if (difficulty === "pundit") {
          setCrossIndex(0);
          setCrossScore(0);
          setPhase("cross");
        } else {
          setPhase("result");
        }
      }
    }, 800);
  }, [current, feedback, questionStartTime, streak, index, queue.length, difficulty]);

  const handleCrossAnswer = (answer: string) => {
    const q = CROSS_QUESTIONS[crossIndex];
    if (answer === q.answer) {
      setCrossScore((s) => s + 10);
    }
    if (crossIndex + 1 < CROSS_QUESTIONS.length) {
      setCrossIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  };

  // Timer effect
  useEffect(() => {
    if (phase !== "playing" || !!feedback || !timerEnabled) return;

    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, 10 - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        // Timeout handling
        setStreak(0);
        setWrongAnswers((w) => [...w, { rashi: current, guessed: "Timed Out", correct: current.modality }]);
        setFeedback("wrong");
        setScore((s) => Math.max(0, s - 5));

        setTimeout(() => {
          setFeedback(null);
          if (index + 1 < queue.length) {
            setIndex((i) => i + 1);
            setQuestionStartTime(Date.now());
          } else {
            if (difficulty === "pundit") {
              setCrossIndex(0);
              setCrossScore(0);
              setPhase("cross");
            } else {
              setPhase("result");
            }
          }
        }, 1500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [phase, index, feedback, timerEnabled, queue.length, difficulty, current]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (phase !== "playing" || !!feedback) return;
      const keyMap: Record<string, string> = {
        "1": "Chara",
        "2": "Sthira",
        "3": "Dvi-svabhāva",
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        handleGuess(keyMap[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, feedback, handleGuess]);

  /* ─── Render phases ─── */
  return (
    <div className="w-full space-y-4" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap items-center">
        {(["learn", "play", "review"] as const).map((m) => {
          const isActive = m === "learn" ? phase === "learn" : m === "review" ? phase === "review" : (phase !== "learn" && phase !== "review");
          return (
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              key={m}
              onClick={() => {
                if (m === "learn") setPhase("learn");
                else if (m === "review") setPhase("review");
                else {
                  if (phase !== "playing" && phase !== "cross" && phase !== "result") {
                    setPhase("menu");
                  }
                }
              }}
              className="px-4 py-2 text-sm rounded-lg transition-all font-semibold focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
              style={{
                background: isActive ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
                color: isActive ? "#1a1a2e" : "var(--gl-ink-primary)",
                border: "1px solid var(--gl-gold-accent)",
                opacity: isActive ? 1 : 0.7,
              }}
            >
              {m === "learn" ? "Learn" : m === "play" ? "Play / Quiz" : "Reference Review"}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {phase === "learn" && (
          <motion.div
            key="learn"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-4"
          >
            <h3 className="text-xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "#8F6818" }}>
              Rāśi Modality Classifier
            </h3>
            <p className="text-base leading-relaxed" style={{ color: READABLE_SECONDARY }}>
              Explore the three modalities: Chara (Cardinal), Sthira (Fixed), and Dvi-svabhāva (Mutable).
              Click any rāśi card below to launch a play round starting with that sign.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(Object.entries(modalityCounts) as [string, number[]][]).map(([type, rashiNums]) => {
                const m = MODALITIES.find((item) => item.key === type)!;
                return (
                  <div key={type} className="p-4 rounded-xl space-y-3 flex flex-col" style={{ background: `${m.color}10`, border: `1px solid ${m.color}55` }}>
                    <div className="flex items-center gap-2 pb-2 border-b" style={{ borderColor: `${m.color}40` }}>
                      <span className="text-2xl" style={{ color: READABLE_INK }}>{m.icon}</span>
                      <div>
                        <div className="text-lg font-bold" style={{ color: m.color, fontFamily: "var(--font-cormorant)" }}>{m.label}</div>
                        <div className="text-sm font-medium" style={{ color: READABLE_MUTED }}>{m.description}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      {rashiNums.map((n) => {
                        const r = RASHIS[n - 1];
                        return (
                          <motion.button
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            key={n}
                            onClick={() => startTargetedGame(n)}
                            className="p-4 rounded-xl text-left transition-all border flex flex-col gap-2 w-full focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                            style={{
                              background: CARD_SURFACE,
                              border: `1px solid ${r.color}60`,
                              color: READABLE_INK,
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${r.color}24`, color: r.color, fontFamily: "var(--font-devanagari)" }}>
                                  {r.nameDevanagari}
                                </span>
                                <span className="font-semibold text-base"><IAST>{r.nameIAST}</IAST></span>
                                <span className="text-sm" style={{ color: READABLE_MUTED }}>({r.nameEnglish})</span>
                              </div>
                              <span className="text-[11px] px-2 py-1 rounded font-bold uppercase tracking-wider" style={{ background: `${r.color}18`, color: r.color }}>
                                {r.element}
                              </span>
                            </div>
                            <div className="text-sm leading-snug pl-10" style={{ color: READABLE_SECONDARY }}>
                              {r.mnemonic}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Difficulty selector quick start */}
            <div className="p-4 rounded-xl space-y-3" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: READABLE_MUTED }}>
                Or start a full graded game:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    { key: "apprentice" as const, label: "Apprentice", desc: "4 Chara rāśis only", color: "#6B8E6B" },
                    { key: "scholar" as const, label: "Scholar", desc: "All 12 rāśis", color: "#7BA7C0" },
                    { key: "pundit" as const, label: "Pundit", desc: "All 12 + cross-questions", color: "#A23A1E" },
                  ]
                ).map((d) => (
                  <motion.button
                    key={d.key}
                    onClick={() => startGame(d.key)}
                    className="p-3 rounded-lg text-left transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                    style={{ background: "var(--gl-surface-manuscript)", border: `1px solid ${d.color}40` }}
                  >
                    <div className="font-semibold text-sm" style={{ color: d.color }}>{d.label}</div>
                    <div className="text-xs mt-0.5" style={{ color: READABLE_SECONDARY }}>{d.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "menu" && (
          <motion.div
            key="menu"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-4"
          >
            <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
              Rāśi Modality Classifier
            </h3>
            <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
              Test your knowledge of the three modalities: Chara (Cardinal), Sthira (Fixed), and Dvi-svabhāva (Mutable).
              The 12 rāśis are distributed 4-4-4 across these three modalities.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                { key: "apprentice" as const, label: "Apprentice", desc: "4 Chara rāśis only", color: "#6B8E6B" },
                { key: "scholar" as const, label: "Scholar", desc: "All 12 rāśis", color: "#7BA7C0" },
                { key: "pundit" as const, label: "Pundit", desc: "All 12 + cross-questions", color: "#A23A1E" },
              ]).map((d) => (
                <motion.button
                  key={d.key}
                  onClick={() => startGame(d.key)}
                  className="p-4 rounded-xl text-left transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  style={{ background: "var(--gl-surface-twilight-glass)", border: `2px solid ${d.color}40` }}
                >
                  <div className="font-semibold" style={{ color: d.color }}>{d.label}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--gl-ink-secondary)" }}>{d.desc}</div>
                </motion.button>
              ))}
            </div>
            {/* Reference table */}
            <div className="mt-3 p-3 rounded-xl" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
              <div className="text-xs font-medium mb-2" style={{ color: "var(--gl-ink-muted)" }}>Quick Reference</div>
              <div className="grid grid-cols-3 gap-2">
                {MODALITIES.map((m) => (
                  <div key={m.key} className="text-xs p-2 rounded" style={{ background: `${m.color}12`, border: `1px solid ${m.color}30`, color: m.color }}>
                    <strong>{m.icon} {m.label}</strong>
                    <div style={{ color: "var(--gl-ink-secondary)" }}>{m.description}</div>
                    <div className="mt-1 flex gap-1 flex-wrap">
                      {RASHIS.filter((r) => r.modality === m.key).map((r) => (
                        <span key={r.number} style={{ fontFamily: "var(--font-devanagari)" }}>{r.nameDevanagari}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {phase === "playing" && current && (
          <motion.div
            key="playing"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full space-y-4"
          >
            {/* Stats bar */}
            <div className="flex justify-between items-center text-sm">
              <div style={{ color: "var(--gl-ink-secondary)" }}>
                Score: <strong style={{ color: "var(--gl-gold-accent)" }}>{score}</strong>
              </div>
              <div style={{ color: "var(--gl-ink-secondary)" }}>
                {index + 1} / {queue.length}
              </div>
              <div className="flex items-center gap-4">
                <div style={{ color: streak >= 3 ? "#C9A24D" : "var(--gl-ink-muted)" }}>
                  🔥 Streak: {streak}
                </div>
                {/* Timer toggle */}
                <button
                  onClick={() => setTimerEnabled((e) => !e)}
                  className="text-xs px-2 py-0.5 rounded border transition-all hover:bg-[var(--gl-surface-manuscript)]"
                  style={{
                    background: timerEnabled ? "rgba(201, 162, 77, 0.12)" : "transparent",
                    borderColor: "var(--gl-gold-hairline)",
                    color: timerEnabled ? "var(--gl-gold-accent)" : "var(--gl-ink-muted)",
                  }}
                >
                  ⏱️ {timerEnabled ? "Timer: On" : "Timer: Off"}
                </button>
              </div>
            </div>

            {/* Timer bar */}
            {timerEnabled && (
              <div className="h-1.5 rounded-full overflow-hidden w-full relative" style={{ background: "var(--gl-surface-manuscript)" }}>
                <div
                  className="h-full rounded-full transition-all duration-100 ease-linear"
                  style={{
                    width: `${(timeLeft / 10) * 100}%`,
                    background: timeLeft > 3 ? "var(--gl-gold-accent)" : "#A23A1E",
                  }}
                />
              </div>
            )}

            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--gl-surface-manuscript)" }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${((index) / queue.length) * 100}%`, background: "var(--gl-gold-accent)" }}
              />
            </div>

            {/* Rāśi card */}
            <div
              className="p-6 rounded-xl text-center transition-all"
              style={{
                background: feedback === "correct" ? "#4A8A4A20" : feedback === "wrong" ? "#A23A1E20" : "var(--gl-surface-twilight-glass)",
                border: `2px solid ${feedback === "correct" ? "#4A8A4A" : feedback === "wrong" ? "#A23A1E" : "var(--gl-gold-hairline)"}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="text-4xl mb-2"
                style={{ fontFamily: "var(--font-devanagari)", color: "var(--gl-gold-accent)" }}
              >
                {current.nameDevanagari}
              </div>
              <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-ink-primary)" }}>
                <IAST>{current.nameIAST}</IAST>
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                {current.element} element · Rāśi #{current.number}
              </div>
              {feedback === "wrong" && (
                <div className="mt-2 text-sm" style={{ color: "#A23A1E" }}>
                  Correct: <strong>{current.modality}</strong>
                </div>
              )}
              {feedback === "correct" && (
                <div className="mt-2 text-sm" style={{ color: "#4A8A4A" }}>
                  Correct! +{streak >= 3 ? 15 : 10} points
                </div>
              )}
            </div>

            {/* Modality buttons */}
            <div className="grid grid-cols-3 gap-3">
              {MODALITIES.map((m) => (
                <motion.button
                  key={m.key}
                  onClick={() => handleGuess(m.key)}
                  disabled={!!feedback}
                  className="p-3 rounded-xl text-center transition-all disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                  style={{
                    background: `${m.color}15`,
                    border: `2px solid ${m.color}50`,
                    color: m.color,
                  }}
                >
                  <div className="text-2xl mb-1">{m.icon}</div>
                  <div className="text-xs font-semibold">{m.label}</div>
                  <div className="text-xs opacity-70">{m.description}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

      {phase === "cross" && (
        <motion.div
          key="cross"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full space-y-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {(() => {
            const q = CROSS_QUESTIONS[crossIndex];
            return (
              <>
                <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
                  Bonus Round: {crossIndex + 1} / {CROSS_QUESTIONS.length}
                </div>
                <div className="p-5 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div className="text-lg font-medium mb-4" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant)" }}>
                    {q.question}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt) => (
                      <motion.button
                        key={opt}
                        onClick={() => handleCrossAnswer(opt)}
                        className="p-3 rounded-lg text-sm text-left transition-all focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                        style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}

      {phase === "result" && (
        <motion.div
          key="result"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full space-y-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {(() => {
            const total = queue.length + (difficulty === "pundit" ? CROSS_QUESTIONS.length : 0);
            const finalScore = score + crossScore;
            const accuracy = Math.round((finalScore / (total * 10)) * 100);
            const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;
            const avgTime = responseTimes.length > 0 ? (responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(1) : "—";
            const fastCount = responseTimes.filter((t) => t < 2).length;

            // Weak-spot analysis: find confusion patterns
            const confusionMap: Record<string, number> = {};
            wrongAnswers.forEach((w) => {
              const key = `${w.rashi.element}: guessed ${w.guessed} instead of ${w.correct}`;
              confusionMap[key] = (confusionMap[key] || 0) + 1;
            });
            const topConfusions = Object.entries(confusionMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .filter(([, count]) => count > 0);

            return (
              <>
                <div className="text-center p-5 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div className="text-3xl mb-2">
                    {stars >= 3 ? "⭐⭐⭐" : stars >= 2 ? "⭐⭐" : stars >= 1 ? "⭐" : "💪"}
                  </div>
                  <div className="text-xl font-semibold" style={{ color: "var(--gl-gold-accent)", fontFamily: "var(--font-cormorant)" }}>
                    {accuracy >= 90 ? "Mastered!" : accuracy >= 70 ? "Well done!" : accuracy >= 50 ? "Good effort!" : "Keep practicing!"}
                  </div>
                  <div className="text-sm mt-2" style={{ color: "var(--gl-ink-secondary)" }}>
                    Score: <strong>{finalScore}</strong> · Accuracy: <strong>{accuracy}%</strong> · Best streak: <strong>{bestStreak}</strong>
                  </div>
                  <div className="text-xs mt-2 flex gap-3 justify-center" style={{ color: "var(--gl-ink-muted)" }}>
                    <span>⏱ Avg: <strong>{avgTime}s</strong></span>
                    <span>⚡ Fast (&lt;2s): <strong>{fastCount}/{responseTimes.length}</strong></span>
                  </div>
                </div>

                {topConfusions.length > 0 && (
                  <div className="p-3 rounded-xl" style={{ background: "#A23A1E08", border: "1px solid #A23A1E20" }}>
                    <div className="text-sm font-medium mb-1" style={{ color: "#A23A1E" }}>🔍 Weak Spots Identified</div>
                    {topConfusions.map(([pattern, count], i) => (
                      <div key={i} className="text-xs py-1" style={{ color: "var(--gl-ink-secondary)" }}>
                        • {pattern} ({count}×)
                      </div>
                    ))}
                    <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>Tip: Focus on these patterns in your next round.</div>
                  </div>
                )}

                {wrongAnswers.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium" style={{ color: "var(--gl-ink-muted)" }}>Review mistakes ({wrongAnswers.length})</div>
                    {wrongAnswers.map((w, i) => (
                      <div key={i} className="p-3 rounded-xl text-sm flex justify-between items-center" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                        <span>
                          <span style={{ fontFamily: "var(--font-devanagari)", color: "var(--gl-gold-accent)" }}>{w.rashi.nameDevanagari}</span>{" "}
                          <IAST>{w.rashi.nameIAST}</IAST> — You guessed <span style={{ color: "#A23A1E" }}>{w.guessed}</span>
                        </span>
                        <span style={{ color: "#4A8A4A" }}>Correct: {w.correct}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => setPhase("review")}
                    className="flex-1 px-4 py-2 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}
                  >
                    Review All
                  </motion.button>
                  <motion.button
                    onClick={() => startGame(difficulty)}
                    className="flex-1 px-4 py-2 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                    style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
                  >
                    Play Again
                  </motion.button>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}

      {phase === "review" && (
        <motion.div
          key="review"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="w-full space-y-3"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          <div className="text-sm font-medium" style={{ color: "var(--gl-gold-accent)", fontFamily: "var(--font-cormorant)" }}>
            All 12 Rāśis — Modality Reference
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {RASHIS.map((r) => {
              const mod = MODALITIES.find((m) => m.key === r.modality)!;
              return (
                <div key={r.number} className="p-3 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: `1px solid ${mod.color}30`, boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontFamily: "var(--font-devanagari)", color: "var(--gl-gold-accent)", fontSize: 16 }}>{r.nameDevanagari}</span>
                    <span style={{ color: "var(--gl-ink-primary)", fontSize: 13 }}><IAST>{r.nameIAST}</IAST></span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: `${mod.color}20`, color: mod.color }}>
                      {mod.icon} {r.modality}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>{r.mnemonic}</div>
                </div>
              );
            })}
          </div>
          <motion.button
            onClick={() => setPhase("menu")}
            className="px-4 py-2 rounded-lg text-sm focus-visible:ring-2 focus-visible:ring-[var(--gl-gold-accent)] outline-none"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
          >
            Back to Menu
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
}
