"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  BarChart3,
  Ruler,
  Sunrise,
  Scale,
  BookOpen,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Play,
  Square,
  Award,
} from "lucide-react";
import { YugaCosmicWheel } from "./YugaCosmicWheel";
import {
  YUGAS,
  TOTAL_PROPORTION,
  CHECKPOINTS,
  MODES,
  fmt,
  type VisualMode,
  type YugaData,
} from "./yuga-data";

/* ─── Design tokens ─── */
const GOLD = "#C28220";
const VERMILION = "#A23A1E";
const INDIGO = "#4A6FA5";
const JADE = "#3A8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const SURFACE_2 = "var(--gl-surface-2)";

/* ─── Mode icon map ─── */
const MODE_ICONS: Record<VisualMode, React.ElementType> = {
  proportion: BarChart3,
  absolute: Ruler,
  divya: Scale,
  sandhya: Sunrise,
  dharma: BookOpen,
};

/* ─── Main component ─── */
export function YugaProportionVisualiser() {
  const [mode, setMode] = useState<VisualMode>("proportion");
  const [selectedYuga, setSelectedYuga] = useState<string | null>(null);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [checkpointAnswer, setCheckpointAnswer] = useState<string | null>(null);
  const [checkpointScore, setCheckpointScore] = useState({ correct: 0, total: 0 });
  const [checkpointHistory, setCheckpointHistory] = useState<boolean[]>([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [modesExplored, setModesExplored] = useState<Set<string>>(new Set(["proportion"]));
  const [feedbackState, setFeedbackState] = useState<{
    key: string;
    isCorrect: boolean;
  } | null>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  /* Listen for reduced-motion changes */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const activeYuga = useMemo(
    () => YUGAS.find((y) => y.key === selectedYuga) ?? null,
    [selectedYuga]
  );
  const currentCheckpoint = CHECKPOINTS[checkpointIndex];
  const allCheckpointsDone = checkpointHistory.length === CHECKPOINTS.length;
  const allCorrect = allCheckpointsDone && checkpointHistory.every(Boolean);

  const handleYugaClick = useCallback(
    (key: string) => {
      setSelectedYuga(key);
      setFeedbackState(null);

      /* Checkpoint answering */
      if (checkpointAnswer === null && currentCheckpoint) {
        const isCorrect = key === currentCheckpoint.answerKey;
        setCheckpointAnswer(key);
        setCheckpointScore((s) => ({
          correct: s.correct + (isCorrect ? 1 : 0),
          total: s.total + 1,
        }));
        setCheckpointHistory((h) => [...h, isCorrect]);
        setFeedbackState({ key, isCorrect });
      }
    },
    [checkpointAnswer, currentCheckpoint]
  );

  const nextCheckpoint = useCallback(() => {
    setCheckpointIndex((i) => (i + 1) % CHECKPOINTS.length);
    setCheckpointAnswer(null);
    setFeedbackState(null);
    setSelectedYuga(null);
  }, []);

  const handleModeChange = useCallback((m: VisualMode) => {
    setMode(m);
    setSelectedYuga(null);
    setFeedbackState(null);
    setModesExplored((prev) => new Set(prev).add(m));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((p) => !p);
  }, []);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-stretch"
      data-interactive="yuga-proportion-visualiser"
    >
      {/* ─── LEFT: Visualiser ─── */}
      <div className="gl-surface-twilight-glass p-5 flex flex-col" style={{ minHeight: 600 }}>
        {/* Header */}
        <p
          className="uppercase mb-3"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          The Four Yugas within One Mahā-Yuga
        </p>

        {/* Mode toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {MODES.map((m) => {
            const isActive = mode === m.key;
            const Icon = MODE_ICONS[m.key];
            const explored = modesExplored.has(m.key);
            return (
              <button
                key={m.key}
                onClick={() => handleModeChange(m.key)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? INDIGO : "rgba(156, 122, 47, 0.12)",
                  color: isActive ? "#fff" : INK_SECONDARY,
                  border: isActive ? "none" : "1px solid rgba(156, 122, 47, 0.25)",
                  position: "relative",
                }}
                aria-pressed={isActive}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{m.label}</span>
                <span className="sm:hidden">{m.shortLabel}</span>
                {explored && !isActive && (
                  <span
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: JADE }}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Cosmic Wheel -- mode context lives in the detail panel, not here */}
        <div className="flex-1 flex items-center justify-center">
          <YugaCosmicWheel
            mode={mode}
            selectedYuga={selectedYuga}
            onSelectYuga={handleYugaClick}
            isAutoPlaying={isAutoPlaying}
            reducedMotion={reducedMotion}
            feedbackState={feedbackState}
          />
        </div>

        {/* Auto-play + legend row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: isAutoPlaying ? VERMILION : "rgba(156, 122, 47, 0.15)",
              color: isAutoPlaying ? "#fff" : INK_SECONDARY,
              border: isAutoPlaying ? "none" : "1px solid rgba(156, 122, 47, 0.25)",
            }}
            aria-pressed={isAutoPlaying}
          >
            {isAutoPlaying ? <Square size={12} /> : <Play size={12} />}
            {isAutoPlaying ? "Stop cycle" : "Animate cycle"}
          </button>

          {mode === "sandhya" && (
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: INK_SECONDARY }}>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${GOLD}50` }} />
                <span>Saṁdhyā (dawn) — 1/12</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: GOLD }} />
                <span>Core — 10/12</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${GOLD}50` }} />
                <span>Saṁdhyāṁśa (dusk) — 1/12</span>
              </div>
            </div>
          )}
        </div>

        {/* Hint text */}
        <p
          className="text-center italic mt-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_SECONDARY,
            fontSize: 15,
            lineHeight: 1.5,
          }}
        >
          Tap any sector to reveal its detail. Toggle modes to see proportion, duration, twilight, and dharma.
        </p>

        {/* Formative checkpoints */}
        <div className="mt-auto pt-4" style={{ borderTop: "1px solid rgba(156, 122, 47, 0.2)" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Formative Checkpoint {Math.min(checkpointIndex + 1, CHECKPOINTS.length)} of {CHECKPOINTS.length}
            </span>
            <span className="text-xs" style={{ color: INK_SECONDARY }}>
              Score: {checkpointScore.correct} / {checkpointScore.total}
            </span>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 mb-3">
            {CHECKPOINTS.map((_, i) => {
              const status =
                i < checkpointHistory.length
                  ? checkpointHistory[i]
                    ? "correct"
                    : "wrong"
                  : i === checkpointIndex
                  ? "current"
                  : "future";
              return (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: status === "current" ? 10 : 8,
                    height: status === "current" ? 10 : 8,
                    backgroundColor:
                      status === "correct"
                        ? JADE
                        : status === "wrong"
                        ? VERMILION
                        : status === "current"
                        ? GOLD
                        : "rgba(156, 122, 47, 0.25)",
                    border: status === "current" ? "2px solid #fff" : "none",
                    boxShadow: status === "current" ? `0 0 0 1px ${GOLD}` : "none",
                  }}
                  aria-hidden="true"
                />
              );
            })}
          </div>

          {/* Celebration on completion */}
          {allCorrect && (
            <div
              className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "rgba(58, 140, 90, 0.1)", border: `1px solid ${JADE}40` }}
            >
              <Award size={18} style={{ color: JADE }} />
              <span className="text-sm font-semibold" style={{ color: JADE }}>
                All checkpoints mastered! +25 XP
              </span>
            </div>
          )}

          <p className="text-sm mb-3" style={{ color: INK_PRIMARY }}>
            {allCheckpointsDone
              ? "All checkpoints complete. You can restart to practice again."
              : currentCheckpoint.question}
          </p>

          {checkpointAnswer !== null && !allCheckpointsDone && (
            <div className="mb-3">
              {checkpointAnswer === currentCheckpoint.answerKey ? (
                <div className="flex items-center gap-2 text-sm" style={{ color: JADE }}>
                  <CheckCircle2 size={16} />
                  <span>Correct! Well done.</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm" style={{ color: VERMILION }}>
                    <XCircle size={16} />
                    <span>Not quite. {currentCheckpoint.hint}</span>
                  </div>
                </div>
              )}
              <button
                onClick={nextCheckpoint}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ backgroundColor: INDIGO, color: "#fff" }}
              >
                <RotateCcw size={12} />
                {checkpointIndex < CHECKPOINTS.length - 1 ? "Next question" : "Restart checkpoints"}
              </button>
            </div>
          )}

          {checkpointAnswer === null && !allCheckpointsDone && (
            <p className="text-xs" style={{ color: INK_MUTED }}>
              Click the correct yuga sector on the wheel to answer.
            </p>
          )}

          {allCheckpointsDone && (
            <button
              onClick={() => {
                setCheckpointIndex(0);
                setCheckpointAnswer(null);
                setCheckpointScore({ correct: 0, total: 0 });
                setCheckpointHistory([]);
                setFeedbackState(null);
                setSelectedYuga(null);
              }}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: INDIGO, color: "#fff" }}
            >
              <RotateCcw size={12} />
              Restart checkpoints
            </button>
          )}
        </div>
      </div>

      {/* ─── RIGHT: Detail panel ─── */}
      <aside
        className="gl-surface-twilight-glass p-6 flex flex-col"
        aria-live="polite"
        style={{ minHeight: 600 }}
      >
        {activeYuga ? (
          <ActiveDetail yuga={activeYuga} mode={mode} />
        ) : (
          <GuidancePanel modesExplored={modesExplored} />
        )}
      </aside>
    </div>
  );
}

/* ─── Sub-components ─── */

function GuidancePanel({
  modesExplored,
}: {
  modesExplored: Set<string>;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p
        className="uppercase"
        style={{
          color: GOLD,
          letterSpacing: "0.16em",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        Four Ages, One Great Cycle
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: 20,
          lineHeight: 1.4,
          color: INK_PRIMARY,
        }}
      >
        The Mahā-Yuga is the complete four-yuga unit — 4.32 million human years — recurring continuously across cosmic time.
      </p>

      {/* Try this callout */}
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(232, 199, 114, 0.12)",
          borderLeft: "3px solid #A23A1E",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="text-xs uppercase mb-1"
          style={{
            color: VERMILION,
            letterSpacing: "0.12em",
            fontWeight: 600,
          }}
        >
          Try this
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: 16,
            color: INK_PRIMARY,
            lineHeight: 1.55,
          }}
        >
          Start with <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Proportion mode</strong> to feel the 4:3:2:1 relationship. Then switch to{" "}
          <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Absolute Duration</strong> to register the cosmic scale. Explore{" "}
          <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Saṁdhyā</strong> for twilight transitions and{" "}
          <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Dharma</strong> to see the quality descent.
        </p>
      </div>

      {/* Mode exploration tracker */}
      <div
        aria-hidden="false"
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          padding: "16px 18px",
          border: "1px dashed rgba(156, 122, 47, 0.32)",
          borderRadius: 10,
          background: "rgba(255, 252, 240, 0.45)",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: 12,
            color: INK_SECONDARY,
            letterSpacing: "0.18em",
            fontWeight: 700,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Exploration progress
        </p>
        <div className="flex flex-col gap-2">
          {MODES.map((m) => {
            const explored = modesExplored.has(m.key);
            const Icon = MODE_ICONS[m.key];
            return (
              <div
                key={m.key}
                className="flex items-center gap-2 text-sm"
                style={{
                  color: explored ? INK_PRIMARY : INK_MUTED,
                  transition: "color 300ms ease",
                }}
              >
                <Icon size={14} style={{ color: explored ? GOLD : INK_MUTED, transition: "color 300ms ease" }} />
                <span style={{ flex: 1 }}>{m.label}</span>
                {explored ? (
                  <CheckCircle2 size={14} style={{ color: JADE }} />
                ) : (
                  <span style={{ fontSize: 10, color: INK_MUTED }}>pending</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick reference list */}
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {YUGAS.map((y, i) => (
          <li
            key={y.key}
            style={{
              fontSize: 15,
              color: INK_SECONDARY,
              padding: "6px 0",
              borderBottom: i < YUGAS.length - 1 ? "1px solid rgba(156, 122, 47, 0.18)" : "none",
              display: "grid",
              gridTemplateColumns: "72px 64px 1fr",
              gap: 8,
              alignItems: "baseline",
            }}
          >
            <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{y.name}</span>
            <span style={{ fontFamily: "var(--font-devanagari), serif", color: INK_MUTED }}>{y.devanagari}</span>
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: INK_MUTED }}>
              {y.proportion} leg{y.dharmaLegs > 1 ? "s" : ""}, {(y.proportion / TOTAL_PROPORTION) * 100}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActiveDetail({ yuga, mode }: { yuga: YugaData; mode: VisualMode }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Header with proportion badge */}
      <div className="flex items-center gap-2">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${yuga.color} 0%, ${yuga.color}dd 100%)`,
            color: "#fff",
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: `0 2px 8px ${yuga.color}55`,
          }}
        >
          {yuga.proportion}
        </span>
        <span
          className="text-xs uppercase"
          style={{
            color: VERMILION,
            letterSpacing: "0.14em",
            fontWeight: 700,
          }}
        >
          {yuga.proportion} of {TOTAL_PROPORTION} parts
        </span>
      </div>

      {/* Devanagari name */}
      <p
        style={{
          fontFamily: "var(--font-devanagari), serif",
          fontSize: 32,
          lineHeight: 1.2,
          color: INK_PRIMARY,
        }}
      >
        {yuga.devanagari}
      </p>

      {/* Roman name */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: 22,
          color: INK_SECONDARY,
        }}
      >
        {yuga.name}
        {yuga.altName && (
          <span style={{ color: INK_MUTED, fontSize: 16 }}> (also {yuga.altName})</span>
        )}
      </p>

      {/* Dharma legs */}
      <p
        className="text-sm"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          color: VERMILION,
          fontWeight: 500,
        }}
      >
        {yuga.dharmaLegs} leg{yuga.dharmaLegs > 1 ? "s" : ""} of dharma
      </p>

      {/* Gloss */}
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: 16,
          lineHeight: 1.65,
          color: INK_PRIMARY,
        }}
      >
        {yuga.gloss}
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <StatCard label="Human years" value={fmt(yuga.humanYears)} />
        <StatCard label="Divya-varṣa" value={fmt(yuga.divyaYears)} />
        <StatCard label="Share of Mahā-Yuga" value={`${(yuga.proportion / TOTAL_PROPORTION) * 100}%`} />
        <StatCard label="Multiple of Kali" value={`${yuga.proportion}×`} />
      </div>

      {/* Saṁdhyā breakdown (visible in sandhya mode or always) */}
      {(mode === "sandhya" || true) && (
        <div className="mt-1 p-3 rounded-lg" style={{ backgroundColor: "rgba(156, 122, 47, 0.06)" }}>
          <p className="text-xs uppercase mb-2" style={{ color: INK_MUTED, letterSpacing: "0.1em", fontWeight: 600 }}>
            Saṁdhyā breakdown
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Saṁdhyā</div>
              <div className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>{fmt(yuga.sandhya)}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Core</div>
              <div className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>{fmt(yuga.core)}</div>
            </div>
            <div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Saṁdhyāṁśa</div>
              <div className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>{fmt(yuga.sandhyamsa)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Classical anchor footer */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 14,
          borderTop: "1px solid rgba(156, 122, 47, 0.25)",
        }}
      >
        <p className="text-xs uppercase mb-1" style={{ color: INK_MUTED, letterSpacing: "0.12em", fontWeight: 600 }}>
          Classical anchor
        </p>
        <p
          className="text-xs italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          Bṛhat Saṁhitā 8 · Mahābhārata Vana Parva 188 · Manusmṛti 1.69-71
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded" style={{ backgroundColor: SURFACE_2 }}>
      <div className="text-xs" style={{ color: INK_MUTED }}>{label}</div>
      <div className="font-semibold text-sm" style={{ color: INK_PRIMARY }}>{value}</div>
    </div>
  );
}
