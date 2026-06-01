"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Orbit,
  BarChart3,
  Trophy,
  Eye,
  Compass,
  Scroll,
  Sun,
  Sparkles,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { CelestialBackground } from "./CelestialBackground";
import { OrbitalDiagram } from "./OrbitalDiagram";
import { useLessonProgress } from "./hooks/useLessonProgress";
import {
  DAY_TYPES,
  QUIZ_SCENARIOS,
  ACHIEVEMENTS,
  BASELINE_SEC,
  INK_PRIMARY,
  INK_SECONDARY,
  INK_MUTED,
  GOLD,
} from "./data";
import type { DayType } from "./data";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type Mode = "explore" | "compare" | "quiz";

/* ------------------------------------------------------------------ */
/* Utility                                                             */
/* ------------------------------------------------------------------ */

function modeLabel(mode: Mode): string {
  switch (mode) {
    case "explore":
      return "Explore";
    case "compare":
      return "Compare";
    case "quiz":
      return "Quiz";
  }
}

function modeIcon(mode: Mode) {
  switch (mode) {
    case "explore":
      return <Orbit size={14} />;
    case "compare":
      return <BarChart3 size={14} />;
    case "quiz":
      return <Compass size={14} />;
  }
}

function achievementIcon(icon: string, size = 16) {
  switch (icon) {
    case "eye":
      return <Eye size={size} />;
    case "compass":
      return <Compass size={size} />;
    case "scroll":
      return <Scroll size={size} />;
    case "sun":
      return <Sun size={size} />;
    case "mandala":
      return <Sparkles size={size} />;
    default:
      return <Trophy size={size} />;
  }
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function AchievementToast({
  achievementId,
  onDismiss,
}: {
  achievementId: string;
  onDismiss: () => void;
}) {
  const ach = ACHIEVEMENTS.find((a) => a.id === achievementId);
  if (!ach) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0.24, 1] }}
      className="fixed bottom-6 right-6 z-50"
      style={{ maxWidth: "320px" }}
    >
      <div
        className="gl-surface-twilight-glass p-4 flex items-start gap-3"
        style={{ borderLeft: `4px solid ${ach.color}` }}
      >
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${ach.color}20`, color: ach.color }}
        >
          {achievementIcon(ach.icon, 18)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            Achievement Unlocked
          </div>
          <div className="text-sm font-medium" style={{ color: ach.color }}>
            {ach.title}
          </div>
          <div className="text-xs mt-0.5" style={{ color: INK_MUTED }}>
            {ach.description}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 mt-0.5"
          aria-label="Dismiss achievement"
          style={{ color: INK_MUTED }}
        >
          <X size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function DayTypeDetailCard({
  dayType,
  onClose,
}: {
  dayType: DayType;
  onClose?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0.24, 1] }}
      className="gl-surface-twilight-glass p-5"
      style={{ borderTop: `3px solid ${dayType.color}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3
            className="text-xl font-medium"
            style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}
          >
            {dayType.name}{" "}
            <span className="text-sm font-normal" style={{ color: INK_MUTED }}>
              {dayType.devanagari}
            </span>
          </h3>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close detail" style={{ color: INK_MUTED }}>
            <X size={16} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: INK_MUTED }}>
            Reference Event
          </div>
          <div className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            {dayType.referenceEvent}
          </div>
        </div>
        <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: INK_MUTED }}>
            Duration
          </div>
          <div className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            {dayType.duration}
          </div>
        </div>
        <div className="p-2.5 rounded-md" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
          <div className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: INK_MUTED }}>
            Operational Scope
          </div>
          <div className="text-sm font-medium" style={{ color: INK_PRIMARY }}>
            {dayType.scope}
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
        {dayType.detail}
      </p>
    </motion.div>
  );
}

function DurationBars({ selected }: { selected: DayType["key"] | null }) {
  return (
    <div className="space-y-3">
      {DAY_TYPES.map((dt) => {
        const isSel = selected === dt.key;
        const barPct = Math.min((dt.durationSec / BASELINE_SEC) * 100, 100);
        return (
          <div key={dt.key} className="flex items-center gap-3">
            <div className="w-20 text-xs font-medium text-right" style={{ color: INK_PRIMARY }}>
              {dt.name}
            </div>
            <div className="flex-1 h-6 rounded-full overflow-hidden relative" style={{ backgroundColor: `${dt.color}15` }}>
              <motion.div
                className="h-full rounded-full flex items-center px-2"
                style={{ backgroundColor: dt.color }}
                initial={{ width: 0 }}
                animate={{ width: `${barPct}%` }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0.24, 1], delay: 0.1 }}
              >
                {barPct > 15 && (
                  <span className="text-[10px] font-semibold text-white whitespace-nowrap">
                    {dt.duration}
                  </span>
                )}
              </motion.div>
              {dt.key === "solar" && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold" style={{ color: dt.color }}>
                  ~30 days
                </span>
              )}
            </div>
            <div className="w-12 text-xs" style={{ color: INK_MUTED }}>
              {isSel ? "●" : ""}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { dim: "Reference", vals: ["Sunrise", "Star meridian", "12° elongation", "Saṅkrānti"] },
    { dim: "Duration", vals: ["~24h", "~23h 56m", "~23.62h (var)", "~30 sāvana days"] },
    { dim: "Primary use", vals: ["Civil time", "Planetary motion", "Pañcāṅga / festivals", "Solar calendars"] },
    { dim: "Variability", vals: ["Seasonal ±min", "Constant", "Kepler-driven ±3h", "Fixed ~30-day"] },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: `1px solid ${INK_MUTED}` }}>
            <th className="text-left py-2 px-2 font-semibold" style={{ color: INK_PRIMARY }}>
              Dimension
            </th>
            {DAY_TYPES.map((d) => (
              <th key={d.key} className="text-left py-2 px-2 font-semibold" style={{ color: d.color }}>
                {d.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${INK_MUTED}20` }}>
              <td className="py-2 px-2 font-medium" style={{ color: INK_PRIMARY }}>
                {row.dim}
              </td>
              {row.vals.map((v, j) => (
                <td key={j} className="py-2 px-2" style={{ color: INK_SECONDARY }}>
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContextQuiz({
  onRecord,
  score,
  total,
}: {
  onRecord: (correct: boolean) => void;
  score: number;
  total: number;
}) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [answer, setAnswer] = useState<DayType["key"] | null>(null);
  const scenario = QUIZ_SCENARIOS[quizIndex];
  const answered = answer !== null;
  const correct = answered && answer === scenario.answer;
  const correctDayType = DAY_TYPES.find((dayType) => dayType.key === scenario.answer);

  function submit(dayType: DayType["key"]) {
    if (answered) return;
    setAnswer(dayType);
    onRecord(dayType === scenario.answer);
  }

  function nextQuestion() {
    setQuizIndex((current) => (current + 1) % QUIZ_SCENARIOS.length);
    setAnswer(null);
  }

  return (
    <div className="gl-surface-twilight-glass p-5" aria-live="polite">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: INK_MUTED }}>
            Context challenge
          </div>
          <div className="text-sm font-semibold" style={{ color: GOLD }}>
            Scenario {quizIndex + 1} of {QUIZ_SCENARIOS.length}
          </div>
        </div>
        <div className="text-sm font-semibold tabular-nums" style={{ color: INK_SECONDARY }}>
          Score {score}/{total}
        </div>
      </div>

      <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${GOLD}14`, color: GOLD }}>
            {scenario.difficulty}
          </span>
        </div>
        <p className="text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
          {scenario.text}
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {DAY_TYPES.map((dayType) => {
            const active = answer === dayType.key;
            const isCorrectChoice = answered && scenario.answer === dayType.key;
            return (
              <button
                key={dayType.key}
                type="button"
                disabled={answered}
                onClick={() => submit(dayType.key)}
                className="rounded-lg px-3 py-3 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: active || isCorrectChoice ? `${dayType.color}18` : "rgba(255,255,255,0.62)",
                  color: dayType.color,
                  border: `1px solid ${active || isCorrectChoice ? dayType.color : "transparent"}55`,
                  opacity: answered && !active && !isCorrectChoice ? 0.65 : 1,
                }}
              >
                {dayType.name}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              backgroundColor: `${correct ? "#2F8C5A" : "#A23A1E"}10`,
              border: `1px solid ${correct ? "#2F8C5A" : "#A23A1E"}35`,
            }}
          >
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold" style={{ color: correct ? "#2F8C5A" : "#A23A1E" }}>
              {correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {correct ? "Correct context match" : `Use ${correctDayType?.name ?? "the correct day-type"} here`}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {scenario.reason}
            </p>
            <button
              type="button"
              onClick={nextQuestion}
              className="mt-3 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ backgroundColor: GOLD, color: "#fff" }}
            >
              Next context
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* Main Export                                                         */
/* ------------------------------------------------------------------ */

export function DayTypeComparator() {
  const [mode, setMode] = useState<Mode>("explore");
  const [selected, setSelected] = useState<DayType["key"] | null>(null);
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [progress, actions, newAchievement] = useLessonProgress();

  const activeDayType = useMemo(
    () => DAY_TYPES.find((d) => d.key === selected) ?? null,
    [selected]
  );

  const handleSelect = useCallback(
    (key: DayType["key"]) => {
      setSelected((prev) => (prev === key ? null : key));
      actions.explore(key);
    },
    [actions]
  );

  return (
    <div className="relative w-full" data-interactive="day-type-comparator" style={{ color: INK_PRIMARY }}>
      {/* Celestial ambient background */}
      <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ zIndex: 0 }}>
        <CelestialBackground reducedMotion={reducedMotion} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        {/* Header: mode tabs + progress */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex flex-wrap gap-2">
            {(["explore", "compare"] as Mode[]).map((m) =>(
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: mode === m ? "#4A6FA5" : "var(--gl-surface-2, #F5EDD8)",
                  color: mode === m ? "#fff" : INK_SECONDARY,
                  boxShadow: mode === m ? "0 2px 8px rgba(74,111,165,0.25)" : "none",
                }}
              >
                {modeIcon(m)}
                {modeLabel(m)}
              </button>
            ))}
          </div>


        </div>

        {/* Mode content */}
        <AnimatePresence mode="wait">
          {mode === "explore" && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0.24, 1] }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                <div className="gl-surface-twilight-glass p-4">
                  <OrbitalDiagram
                    selected={selected}
                    explored={progress.explored}
                    onSelect={handleSelect}
                    reducedMotion={reducedMotion}
                  />
                </div>

                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {activeDayType ? (
                      <DayTypeDetailCard
                        key={activeDayType.key}
                        dayType={activeDayType}
                        onClose={() => setSelected(null)}
                      />
                    ) : (
                      <motion.div
                        key="hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="gl-surface-twilight-glass p-5 text-center"
                      >
                        <div
                          className="text-lg font-medium mb-2"
                          style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}
                        >
                          Explore the Four Day-Types
                        </div>
                        <p className="text-sm" style={{ color: INK_SECONDARY }}>
                          Click any orbital ring to discover its reference-event, duration, and operational scope.
                          Each day-type is a distinct astronomical definition of &ldquo;day.&rdquo;
                        </p>
                        <div className="flex justify-center gap-4 mt-3">
                          {DAY_TYPES.map((dt) => (
                            <button
                              key={dt.key}
                              onClick={() => handleSelect(dt.key)}
                              className="w-3 h-3 rounded-full transition-transform hover:scale-125"
                              style={{ backgroundColor: dt.color }}
                              aria-label={`Select ${dt.name}`}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Mini duration bars in explore mode */}
                  <div className="gl-surface-twilight-glass p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
                      Duration Comparison
                    </div>
                    <DurationBars selected={selected} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {mode === "compare" && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0.24, 1] }}
              className="space-y-4"
            >
              <div className="gl-surface-twilight-glass p-5">
                <h3
                  className="text-lg font-medium mb-1"
                  style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}
                >
                  Duration at a Glance
                </h3>
                <p className="text-sm mb-4" style={{ color: INK_SECONDARY }}>
                  Each bar is proportional to the sāvana-day baseline (~24 hours). Notice how the sidereal day is just slightly shorter — that ~3m 56s gap accumulates to one full rotation per year.
                </p>
                <DurationBars selected={selected} />
              </div>

              <div className="gl-surface-twilight-glass p-5">
                <h3
                  className="text-lg font-medium mb-3"
                  style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}
                >
                  Side-by-Side Comparison
                </h3>
                <ComparisonTable />
              </div>
            </motion.div>
          )}

          {mode === "quiz" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0.24, 1] }}
            >
              <ContextQuiz
                onRecord={actions.recordChallenge}
                score={progress.challengeScore}
                total={progress.challengeTotal}
              />
            </motion.div>
          )}


        </AnimatePresence>

        {/* Achievements strip */}
        {progress.achievements.size > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: `1px solid ${INK_MUTED}20` }}>
            <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: INK_MUTED }}>
              Achievements
            </div>
            <div className="flex flex-wrap gap-2">
              {ACHIEVEMENTS.map((ach) => {
                const unlocked = progress.achievements.has(ach.id);
                return (
                  <div
                    key={ach.id}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-opacity"
                    style={{
                      backgroundColor: unlocked ? `${ach.color}15` : `${INK_MUTED}10`,
                      color: unlocked ? ach.color : INK_MUTED,
                      opacity: unlocked ? 1 : 0.5,
                    }}
                    title={ach.description}
                  >
                    {achievementIcon(ach.icon, 12)}
                    {ach.title}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating achievement toast */}
      <AnimatePresence>
        {newAchievement && (
          <AchievementToast achievementId={newAchievement} onDismiss={() => {}} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* Re-export for page.tsx import compatibility */
export default DayTypeComparator;
