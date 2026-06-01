"use client";

import { motion, AnimatePresence } from "framer-motion";

import { useState, useMemo, useCallback, useEffect } from "react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

type RisingType = "śīrṣodaya" | "pṛṣṭhodaya" | "ubhayodaya";

const RISING_DATA: Record<number, RisingType> = {
  1: "śīrṣodaya", 2: "śīrṣodaya", 3: "ubhayodaya", 4: "pṛṣṭhodaya",
  5: "śīrṣodaya", 6: "ubhayodaya", 7: "śīrṣodaya", 8: "pṛṣṭhodaya",
  9: "ubhayodaya", 10: "pṛṣṭhodaya", 11: "śīrṣodaya", 12: "pṛṣṭhodaya",
};

const RISING_META: Record<RisingType, { label: string; meaning: string; color: string; mnemonic: string }> = {
  śīrṣodaya: { label: "Śīrṣodaya", meaning: "Head-first rising", color: "#C9A24D", mnemonic: "Aries, Taurus, Leo, Libra, Aquarius — head rises first, visible in East." },
  pṛṣṭhodaya: { label: "Pṛṣṭhodaya", meaning: "Back-first rising", color: "#A23A1E", mnemonic: "Cancer, Scorpio, Capricorn, Pisces — back rises first, visible in South/West." },
  ubhayodaya: { label: "Ubhayodaya", meaning: "Both (head & back)", color: "#4A90A4", mnemonic: "Gemini, Virgo, Sagittarius — dual nature, rises with both ends visible." },
};

const ALL_ANSWERS: RisingType[] = ["śīrṣodaya", "pṛṣṭhodaya", "ubhayodaya"];

export function RashiRisingClassifier() {
  const [mode, setMode] = useState<"quiz" | "learn" | "drill">("learn");
  const [currentRashi, setCurrentRashi] = useState<number>(1);
  const [selected, setSelected] = useState<RisingType | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [history, setHistory] = useState<{ rashi: number; guess: RisingType; actual: RisingType; correct: boolean }[]>([]);

  const correctAnswer = RISING_DATA[currentRashi];
  const meta = RISING_META[correctAnswer];
  const isCorrect = selected === correctAnswer;

  const resetQuestion = useCallback((nextRashi?: number) => {
    setSelected(null);
    setRevealed(false);
    setCurrentRashi(nextRashi ?? Math.floor(Math.random() * 12) + 1);
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

  const nextQuestion = () => {
    resetQuestion();
  };

  // Keyboard navigation: 1=śīrṣodaya, 2=pṛṣṭhodaya, 3=ubhayodaya, Enter/Space=next
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
      const map: Record<string, RisingType> = { "1": "śīrṣodaya", "2": "pṛṣṭhodaya", "3": "ubhayodaya" };
      if (map[e.key]) {
        e.preventDefault();
        handleGuess(map[e.key]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mode, revealed, currentRashi]);

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
      <div className="flex gap-2 flex-wrap">
        {(["learn", "quiz", "drill"] as const).map((m) => (
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            key={m}
            onClick={() => { setMode(m); resetQuestion(); }}
            className="px-4 py-2 text-sm rounded-lg transition-all"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(Object.entries(risingCounts) as [RisingType, number[]][]).map(([type, rashiNums]) => {
            const rm = RISING_META[type];
            return (
              <div key={type} className="p-4 rounded-xl space-y-2" style={{ background: `${rm.color}10`, border: `1px solid ${rm.color}30` }}>
                <div className="text-lg font-semibold" style={{ color: rm.color, fontFamily: "var(--font-cormorant)" }}>{rm.label}</div>
                <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{rm.meaning}</div>
                <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>Mnemonic: {rm.mnemonic}</div>
                <div className="flex gap-1.5 flex-wrap pt-2">
                  {rashiNums.map((n) => {
                    const r = RASHIS[n - 1];
                    return (
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        key={n}
                        onClick={() => { setCurrentRashi(n); setMode("quiz"); resetQuestion(n); }}
                        className="px-2 py-1 rounded text-xs transition-all hover:scale-105"
                        style={{ background: `${r.color}20`, color: r.color, border: `1px solid ${r.color}40` }}
                      >
                        {r.nameDevanagari}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quiz / Drill */}
      {(mode === "quiz" || mode === "drill") && (
        <div className="p-5 rounded-xl space-y-4" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
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

          <div className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>Which rising classification does this rāśi have?</div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ALL_ANSWERS.map((answer, idx) => {
              const am = RISING_META[answer];
              const isSelected = selected === answer;
              const showResult = revealed && answer === correctAnswer;
              const showWrong = revealed && isSelected && !isCorrect;
              return (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  key={answer}
                  onClick={() => handleGuess(answer)}
                  disabled={revealed}
                  aria-pressed={isSelected}
                  className="p-3 rounded-lg text-left text-sm transition-all hover:scale-[1.01]"
                  style={{
                    background: showResult ? `${am.color}20` : showWrong ? "#A23A1E15" : isSelected ? `${am.color}15` : "var(--gl-surface-manuscript)",
                    border: showResult ? `2px solid ${am.color}` : showWrong ? "2px solid #A23A1E" : isSelected ? `1px solid ${am.color}` : "1px solid var(--gl-border-subtle)",
                    color: "var(--gl-ink-primary)",
                    cursor: revealed ? "default" : "pointer",
                    opacity: revealed && !showResult && !showWrong ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 16px rgba(0,0,0,0.04)", color: "var(--gl-ink-muted)" }}>{idx + 1}</span>
                    <span className="font-semibold" style={{ color: am.color }}>{am.label}</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>{am.meaning}</div>
                  {showResult && <div className="text-xs mt-1" style={{ color: am.color }}>✓ Correct!</div>}
                  {showWrong && <div className="text-xs mt-1" style={{ color: "#A23A1E" }}>✕ Incorrect — answer is {RISING_META[correctAnswer].label}</div>}
                </motion.button>
              );
            })}
          </div>

          {revealed && (
            <div className="space-y-2">
              <div className="p-3 rounded-lg text-sm" style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}25` }}>
                <strong style={{ color: meta.color }}>{meta.label}</strong> — {meta.mnemonic}
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={nextQuestion}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
                >
                  {mode === "drill" ? "Next →" : "Next Question →"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMode("learn")}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
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
                <div key={i} className="w-8 h-8 rounded flex items-center justify-center text-xs cursor-default" style={{ background: h.correct ? "#C9A24D15" : "#A23A1E15", color: h.correct ? "#C9A24D" : "#A23A1E", border: `1px solid ${h.correct ? "#C9A24D30" : "#A23A1E30"}` }} title={`${r.nameIAST}: you chose ${RISING_META[h.guess].label}, correct is ${RISING_META[h.actual].label}`}>
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
