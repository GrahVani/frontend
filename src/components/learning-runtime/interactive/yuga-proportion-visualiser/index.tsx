"use client";

import { useState, useCallback } from "react";
import { BarChart3, Ruler, Sunrise, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

/* ─── Design tokens ─── */
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "#F4C77B";
const VERMILION = "#A23A1E";
const INDIGO = "#4A6FA5";
const JADE = "#3A8C5A";
const KALI_SLATE = "#4A4A5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const SURFACE_2 = "var(--gl-surface-2)";

/* ─── Data ─── */
interface YugaData {
  key: string;
  name: string;
  altName: string;
  devanagari: string;
  color: string;
  proportion: number;
  humanYears: number;
  divyaYears: number;
  dharmaLegs: number;
  gloss: string;
}

const YUGAS: YugaData[] = [
  {
    key: "satya",
    name: "Satya",
    altName: "Kṛta",
    devanagari: "सत्य",
    color: GOLD,
    proportion: 4,
    humanYears: 1728000,
    divyaYears: 4800,
    dharmaLegs: 4,
    gloss: "Universal righteousness; truth predominates",
  },
  {
    key: "treta",
    name: "Tretā",
    altName: "",
    devanagari: "त्रेता",
    color: VERMILION,
    proportion: 3,
    humanYears: 1296000,
    divyaYears: 3600,
    dharmaLegs: 3,
    gloss: "Dharma slightly diminished; some unrighteousness emerges",
  },
  {
    key: "dvapara",
    name: "Dvāpara",
    altName: "",
    devanagari: "द्वापर",
    color: INDIGO,
    proportion: 2,
    humanYears: 864000,
    divyaYears: 2400,
    dharmaLegs: 2,
    gloss: "Dharma half-eroded; mixed righteousness and unrighteousness",
  },
  {
    key: "kali",
    name: "Kali",
    altName: "",
    devanagari: "कलि",
    color: KALI_SLATE,
    proportion: 1,
    humanYears: 432000,
    divyaYears: 1200,
    dharmaLegs: 1,
    gloss: "Dharma severely diminished; unrighteousness predominates",
  },
];

const TOTAL_PROPORTION = 10;
const MAHAYUGA_HUMAN = 4320000;

const SVG_WIDTH = 720;
const SVG_HEIGHT = 340;
const BAR_H = 44;
const BAR_GAP = 20;
const BAR_MAX_W = 560;
const BAR_X = 140;
const BAR_Y_START = 28;

function fmt(n: number): string {
  return n.toLocaleString();
}

const CHECKPOINTS = [
  {
    question: "Click the yuga that has 3 legs of dharma.",
    answerKey: "treta",
    hint: "Remember: Satya = 4, Tretā = 3, Dvāpara = 2, Kali = 1.",
  },
  {
    question: "Click the yuga that lasts 432,000 human years.",
    answerKey: "kali",
    hint: "Kali is the base unit. All other yugas are multiples of Kali's duration.",
  },
  {
    question: "Click the yuga that occupies 40% of the Mahā-Yuga.",
    answerKey: "satya",
    hint: "Satya has proportion 4 out of 10 total = 40%.",
  },
];

/* ─── Component ─── */
export function YugaProportionVisualiser() {
  const [mode, setMode] = useState<"proportion" | "absolute" | "sandhya">("proportion");
  const [selectedYuga, setSelectedYuga] = useState<string | null>(null);
  const [checkpointIndex, setCheckpointIndex] = useState(0);
  const [checkpointAnswer, setCheckpointAnswer] = useState<string | null>(null);
  const [checkpointScore, setCheckpointScore] = useState({ correct: 0, total: 0 });
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const activeYuga = YUGAS.find((y) => y.key === selectedYuga) ?? null;
  const currentCheckpoint = CHECKPOINTS[checkpointIndex];

  const handleYugaClick = useCallback(
    (key: string) => {
      setSelectedYuga(key);
      if (checkpointAnswer === null && currentCheckpoint) {
        const isCorrect = key === currentCheckpoint.answerKey;
        setCheckpointAnswer(key);
        setCheckpointScore((s) => ({
          correct: s.correct + (isCorrect ? 1 : 0),
          total: s.total + 1,
        }));
      }
    },
    [checkpointAnswer, currentCheckpoint]
  );

  const nextCheckpoint = useCallback(() => {
    setCheckpointIndex((i) => (i + 1) % CHECKPOINTS.length);
    setCheckpointAnswer(null);
    setSelectedYuga(null);
  }, []);

  const modes = [
    { key: "proportion" as const, label: "Proportion", icon: BarChart3 },
    { key: "absolute" as const, label: "Absolute Duration", icon: Ruler },
    { key: "sandhya" as const, label: "Saṁdhyā", icon: Sunrise },
  ];

  /* Keyboard navigation for the SVG bars */
  const handleBarKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleYugaClick(YUGAS[idx].key);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const next = (idx + 1) % YUGAS.length;
      document.getElementById(`yuga-bar-${YUGAS[next].key}`)?.focus();
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = (idx - 1 + YUGAS.length) % YUGAS.length;
      document.getElementById(`yuga-bar-${YUGAS[prev].key}`)?.focus();
    } else if (e.key === "Escape") {
      setSelectedYuga(null);
    }
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-stretch"
      data-interactive="yuga-proportion-visualiser"
    >
      {/* ─── LEFT: SVG visualiser ─── */}
      <div
        className="gl-surface-twilight-glass p-5 flex flex-col"
        style={{ minHeight: "560px" }}
      >
        <p
          className="uppercase mb-3"
          style={{
            color: GOLD,
            letterSpacing: "0.16em",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          The Four Yugas within One Mahā-Yuga
        </p>

        {/* Mode toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {modes.map((m) => {
            const isActive = mode === m.key;
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => {
                  setMode(m.key);
                  setSelectedYuga(null);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? INDIGO : "rgba(156, 122, 47, 0.12)",
                  color: isActive ? "#fff" : INK_SECONDARY,
                  border: isActive ? "none" : "1px solid rgba(156, 122, 47, 0.25)",
                }}
                aria-pressed={isActive}
              >
                <Icon size={14} />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Mode description */}
        <p className="text-sm mb-4" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          {mode === "proportion" &&
            "Proportion mode shows the 4:3:2:1 ratio structure. Each bar's width reflects its share of the Mahā-Yuga."}
          {mode === "absolute" &&
            "Absolute-duration mode shows the actual human-year durations. The bars keep the same proportions but display the cosmic-scale numbers."}
          {mode === "sandhya" &&
            "Saṁdhyā mode shows each yuga's internal structure: dawn-twilight (saṁdhyā), core period, and dusk-twilight (saṁdhyāṁśa). Each twilight is 1/12 of the yuga."}
        </p>

        {/* SVG */}
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            className="w-full"
            style={{ minWidth: "320px", maxWidth: "720px", display: "block", margin: "0 auto" }}
            role="img"
            aria-label="Interactive bar chart showing the four yugas within one Mahā-Yuga. Click a bar to reveal details."
          >
            <defs>
              {YUGAS.map((y) => (
                <linearGradient id={`grad-${y.key}`} key={y.key} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={y.color} stopOpacity={0.95} />
                  <stop offset="100%" stopColor={y.color} stopOpacity={0.75} />
                </linearGradient>
              ))}
              <pattern id="sandhya-pattern" width="4" height="4" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="4" y2="4" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Background track lines */}
            {YUGAS.map((_, i) => {
              const y = BAR_Y_START + i * (BAR_H + BAR_GAP);
              return (
                <rect
                  key={`track-${i}`}
                  x={BAR_X}
                  y={y}
                  width={BAR_MAX_W}
                  height={BAR_H}
                  rx={6}
                  fill="rgba(156, 122, 47, 0.06)"
                />
              );
            })}

            {/* Yuga bars */}
            {YUGAS.map((yuga, i) => {
              const y = BAR_Y_START + i * (BAR_H + BAR_GAP);
              const barW = (yuga.proportion / TOTAL_PROPORTION) * BAR_MAX_W;
              const isSelected = selectedYuga === yuga.key;
              const transition = reducedMotion ? "none" : "all 400ms cubic-bezier(0.32, 0.72, 0.24, 1)";

              return (
                <g
                  key={yuga.key}
                  role="button"
                  tabIndex={0}
                  id={`yuga-bar-${yuga.key}`}
                  aria-label={`${yuga.name} — ${yuga.devanagari}. Proportion ${yuga.proportion} of ${TOTAL_PROPORTION}. Click to reveal details.`}
                  aria-pressed={isSelected}
                  onClick={() => handleYugaClick(yuga.key)}
                  onKeyDown={(e) => handleBarKey(e, i)}
                  style={{ cursor: "pointer", outline: "none" }}
                  className="gl-focus-ring"
                >
                  {/* Glow / selection ring */}
                  {isSelected && (
                    <rect
                      x={BAR_X - 3}
                      y={y - 3}
                      width={barW + 6}
                      height={BAR_H + 6}
                      rx={8}
                      fill="none"
                      stroke={GOLD_LIGHT}
                      strokeWidth={2}
                      opacity={0.9}
                      style={{ transition }}
                    />
                  )}

                  {/* Bar fill */}
                  {mode === "sandhya" ? (
                    <g style={{ transition }}>
                      {/* saṁdhyā */}
                      <rect
                        x={BAR_X}
                        y={y}
                        width={barW / 12}
                        height={BAR_H}
                        rx={6}
                        fill={`${yuga.color}50`}
                        style={{ transition }}
                      />
                      <rect
                        x={BAR_X}
                        y={y}
                        width={barW / 12}
                        height={BAR_H}
                        rx={6}
                        fill="url(#sandhya-pattern)"
                        fillOpacity={0.35}
                        style={{ transition }}
                      />
                      {/* core */}
                      <rect
                        x={BAR_X + barW / 12}
                        y={y}
                        width={(barW * 10) / 12}
                        height={BAR_H}
                        rx={0}
                        fill={`url(#grad-${yuga.key})`}
                        style={{ transition }}
                      />
                      {/* saṁdhyāṁśa */}
                      <rect
                        x={BAR_X + (barW * 11) / 12}
                        y={y}
                        width={barW / 12}
                        height={BAR_H}
                        rx={6}
                        fill={`${yuga.color}50`}
                        style={{ transition }}
                      />
                      <rect
                        x={BAR_X + (barW * 11) / 12}
                        y={y}
                        width={barW / 12}
                        height={BAR_H}
                        rx={6}
                        fill="url(#sandhya-pattern)"
                        fillOpacity={0.35}
                        style={{ transition }}
                      />
                    </g>
                  ) : (
                    <rect
                      x={BAR_X}
                      y={y}
                      width={barW}
                      height={BAR_H}
                      rx={6}
                      fill={`url(#grad-${yuga.key})`}
                      style={{ transition }}
                    />
                  )}

                  {/* Label inside bar */}
                  <text
                    x={BAR_X + 10}
                    y={y + BAR_H / 2 + 5}
                    fill="#fff"
                    fontSize={13}
                    fontWeight={600}
                    style={{ pointerEvents: "none", textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    {mode === "proportion"
                      ? `${yuga.proportion}:1`
                      : `${fmt(yuga.humanYears)} yrs`}
                  </text>

                  {/* Yuga name to the left of bar */}
                  <text
                    x={BAR_X - 10}
                    y={y + BAR_H / 2 + 5}
                    textAnchor="end"
                    fill={INK_PRIMARY}
                    fontSize={14}
                    fontWeight={600}
                    style={{ pointerEvents: "none" }}
                  >
                    {yuga.name}
                  </text>
                  <text
                    x={BAR_X - 10}
                    y={y + BAR_H / 2 + 20}
                    textAnchor="end"
                    fill={INK_MUTED}
                    fontSize={11}
                    style={{ pointerEvents: "none" }}
                  >
                    {yuga.devanagari}
                  </text>

                  {/* Percentage / detail to the right of bar */}
                  <text
                    x={BAR_X + barW + 8}
                    y={y + BAR_H / 2 + 5}
                    fill={INK_SECONDARY}
                    fontSize={12}
                    fontWeight={500}
                    style={{ pointerEvents: "none", transition }}
                  >
                    {mode === "proportion" && `${(yuga.proportion / TOTAL_PROPORTION) * 100}%`}
                    {mode === "absolute" && `${fmt(yuga.divyaYears)} divya-v.`}
                    {mode === "sandhya" && `${fmt(yuga.humanYears)} total`}
                  </text>
                </g>
              );
            })}

            {/* Total label */}
            <text
              x={BAR_X + BAR_MAX_W}
              y={SVG_HEIGHT - 8}
              textAnchor="end"
              fill={INK_MUTED}
              fontSize={11}
              fontStyle="italic"
            >
              Mahā-Yuga = {fmt(MAHAYUGA_HUMAN)} human years
            </text>
          </svg>
        </div>

        {/* Saṁdhyā legend */}
        {mode === "sandhya" && (
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs" style={{ color: INK_SECONDARY }}>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: `${GOLD}50` }} />
              <span>Saṁdhyā (dawn) — 1/12</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: GOLD }} />
              <span>Core — 10/12</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-3 rounded" style={{ backgroundColor: `${GOLD}50` }} />
              <span>Saṁdhyāṁśa (dusk) — 1/12</span>
            </div>
          </div>
        )}

        <p
          className="text-center italic mt-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: INK_SECONDARY,
            fontSize: "15px",
            lineHeight: 1.5,
          }}
        >
          Tap any bar to reveal its full detail. Toggle modes to see proportion, absolute duration, and saṁdhyā structure.
        </p>

        {/* Formative checkpoints */}
        <div
          className="mt-auto pt-4"
          style={{ borderTop: "1px solid rgba(156, 122, 47, 0.2)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
              Formative Checkpoint {checkpointIndex + 1} of {CHECKPOINTS.length}
            </span>
            <span className="text-xs" style={{ color: INK_SECONDARY }}>
              Score: {checkpointScore.correct} / {checkpointScore.total}
            </span>
          </div>
          <p className="text-sm mb-3" style={{ color: INK_PRIMARY }}>
            {currentCheckpoint.question}
          </p>

          {checkpointAnswer !== null && (
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
                Next question
              </button>
            </div>
          )}

          {checkpointAnswer === null && (
            <p className="text-xs" style={{ color: INK_MUTED }}>
              Click the correct yuga bar above to answer.
            </p>
          )}
        </div>
      </div>

      {/* ─── RIGHT: Detail panel ─── */}
      <aside
        className="gl-surface-twilight-glass p-6 flex flex-col"
        aria-live="polite"
        style={{ minHeight: "560px" }}
      >
        {activeYuga ? (
          <ActiveDetail yuga={activeYuga} />
        ) : (
          <GuidancePanel />
        )}
      </aside>
    </div>
  );
}

/* ─── Sub-components ─── */

function GuidancePanel() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p
        className="uppercase"
        style={{
          color: GOLD,
          letterSpacing: "0.16em",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        Four Ages, One Great Cycle
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          lineHeight: 1.4,
          color: INK_PRIMARY,
        }}
      >
        The Mahā-Yuga is the complete four-yuga unit — 4.32 million human years — recurring continuously across cosmic time.
      </p>
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
            fontSize: "16px",
            color: INK_PRIMARY,
            lineHeight: 1.55,
          }}
        >
          Start with <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Proportion mode</strong> to feel the 4:3:2:1 relationship. Then switch to <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Absolute Duration</strong> to register the cosmic scale. Finally, explore <strong style={{ fontStyle: "normal", color: VERMILION, fontWeight: 600 }}>Saṁdhyā mode</strong> to see the twilight transitions.
        </p>
      </div>

      <div
        aria-hidden="true"
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          padding: "16px 18px",
          border: "1px dashed rgba(156, 122, 47, 0.32)",
          borderRadius: "10px",
          background: "rgba(255, 252, 240, 0.45)",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "12px",
            color: INK_SECONDARY,
            letterSpacing: "0.18em",
            fontWeight: 700,
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Each tap reveals
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            ["देवनागरी", "the yuga's name in script"],
            ["IAST", "the romanised transliteration"],
            ["Duration", "human years + divya-varṣa"],
            ["Dharma legs", "quality-progression marker"],
            ["Gloss", "symbolic meaning"],
          ].map(([label, gloss]) => (
            <li
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(90px, 100px) 1fr",
                gap: "10px",
                fontSize: "15px",
                lineHeight: 1.45,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: label === "देवनागरी" ? "var(--font-devanagari), serif" : "var(--font-cormorant), serif",
                  fontStyle: label === "देवनागरी" ? "normal" : "italic",
                  fontSize: label === "देवनागरी" ? "15px" : "14px",
                  color: INK_SECONDARY,
                  textAlign: "right",
                }}
              >
                {label}
              </span>
              <span style={{ color: INK_SECONDARY }}>{gloss}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {[
          ["Satya", "सत्य", "4 legs, 40%"],
          ["Tretā", "त्रेता", "3 legs, 30%"],
          ["Dvāpara", "द्वापर", "2 legs, 20%"],
          ["Kali", "कलि", "1 leg, 10%"],
        ].map(([name, dev, info], i) => (
          <li
            key={i}
            style={{
              fontSize: "15px",
              color: INK_SECONDARY,
              padding: "6px 0",
              borderBottom: i < 3 ? "1px solid rgba(156, 122, 47, 0.18)" : "none",
              display: "grid",
              gridTemplateColumns: "72px 64px 1fr",
              gap: "8px",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{name}</span>
            <span style={{ fontFamily: "var(--font-devanagari), serif", color: INK_MUTED }}>{dev}</span>
            <span style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: INK_MUTED }}>
              {info}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActiveDetail({ yuga }: { yuga: YugaData }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${yuga.color} 0%, ${yuga.color}dd 100%)`,
            color: "#fff",
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 600,
            fontSize: "16px",
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
          {yuga.proportion} of 10 parts
        </span>
      </div>

      <p
        style={{
          fontFamily: "var(--font-devanagari), serif",
          fontSize: "28px",
          lineHeight: 1.3,
          color: INK_PRIMARY,
        }}
      >
        {yuga.devanagari}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "20px",
          color: INK_SECONDARY,
        }}
      >
        {yuga.name}
        {yuga.altName && (
          <span style={{ color: INK_MUTED, fontSize: "16px" }}> (also {yuga.altName})</span>
        )}
      </p>

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

      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.65,
          color: INK_PRIMARY,
        }}
      >
        {yuga.gloss}
      </p>

      <div
        className="grid grid-cols-2 gap-2 mt-1"
      >
        <div className="p-2 rounded" style={{ backgroundColor: SURFACE_2 }}>
          <div className="text-xs" style={{ color: INK_MUTED }}>Human years</div>
          <div className="font-semibold text-sm">{fmt(yuga.humanYears)}</div>
        </div>
        <div className="p-2 rounded" style={{ backgroundColor: SURFACE_2 }}>
          <div className="text-xs" style={{ color: INK_MUTED }}>Divya-varṣa</div>
          <div className="font-semibold text-sm">{fmt(yuga.divyaYears)}</div>
        </div>
        <div className="p-2 rounded" style={{ backgroundColor: SURFACE_2 }}>
          <div className="text-xs" style={{ color: INK_MUTED }}>Share of Mahā-Yuga</div>
          <div className="font-semibold text-sm">{(yuga.proportion / TOTAL_PROPORTION) * 100}%</div>
        </div>
        <div className="p-2 rounded" style={{ backgroundColor: SURFACE_2 }}>
          <div className="text-xs" style={{ color: INK_MUTED }}>Multiple of Kali</div>
          <div className="font-semibold text-sm">{yuga.proportion}×</div>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid rgba(156, 122, 47, 0.25)",
        }}
      >
        <p
          className="text-xs uppercase mb-1"
          style={{ color: INK_MUTED, letterSpacing: "0.12em", fontWeight: 600 }}
        >
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
