"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Compass,
  FileText,
  Heart,
  Home,
  RotateCcw,
  Scale,
  ShieldAlert,
  Sun,
  Watch,
  XCircle,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CASE_FILES,
  DAILY_PATTERNS,
  PORTION_TIMES,
  WEEKDAYS,
  WINDOW_META,
  type CaseFile,
  type EventType,
  type Verdict,
  type WeekdayKey,
  type WindowType,
  evaluateTime,
  findCase,
  findEventProfile,
  findPattern,
  formatTime,
  getCaseVerdict,
  getWindowsForTime,
  parseTime,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-manuscript-cream, #F5EDD8)";
const SURFACE_3 = "var(--gl-surface-warm, #FAF6ED)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #3D3115)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #5C4A2A)";
const GOLD = "var(--gl-gold, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const VERMILION = ink.vermilionAccent ?? "#A23A1E";
const JADE = "#2F7D55";
const AMBER = "#B9801E";
const INDIGO = "#4F6FA8";

const WINDOW_ORDER: WindowType[] = ["rahu", "yamaganda", "gulika"];
const WINDOW_COLORS: Record<WindowType, string> = {
  rahu: VERMILION,
  yamaganda: "#7A3E1E",
  gulika: "#5C3D2E",
};

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#")
    ? `${color}${alphaHex}`
    : `rgba(156,122,47,${Number.parseInt(alphaHex, 16) / 255})`;
}

function eventIcon(key: EventType, size = 16) {
  const props = { size, style: { color: GOLD } };
  switch (key) {
    case "wedding":
      return <Heart {...props} />;
    case "business-launch":
      return <Briefcase {...props} />;
    case "griha-pravesha":
      return <Home {...props} />;
    case "travel":
      return <Compass {...props} />;
    case "education":
      return <BookOpen {...props} />;
  }
}

function verdictBadge(verdict: Verdict) {
  if (verdict === "avoid")
    return { label: "AVOID", color: VERMILION, icon: XCircle };
  if (verdict === "boundary")
    return { label: "BOUNDARY", color: AMBER, icon: AlertCircle };
  return { label: "CLEAR", color: JADE, icon: CheckCircle2 };
}

/* ── SVG geometry helpers ──────────────────────────────── */
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  rInner: number,
  rOuter: number,
  startDeg: number,
  endDeg: number
) {
  const startOuter = polar(cx, cy, rOuter, startDeg);
  const endOuter = polar(cx, cy, rOuter, endDeg);
  const startInner = polar(cx, cy, rInner, endDeg);
  const endInner = polar(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

/* ── Portion Wheel ─────────────────────────────────────── */
function PortionWheel({
  weekday,
  activeTime,
  onHover,
  hoveredPortion,
}: {
  weekday: WeekdayKey;
  activeTime: number;
  onHover: (portion: number | null) => void;
  hoveredPortion: number | null;
}) {
  const size = 420;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 190;
  const rInner = 110;
  const rLabel = (rOuter + rInner) / 2;
  const step = 360 / 8;
  const gap = 2;

  const pattern = findPattern(weekday);
  const windowsByPortion = useMemo(() => {
    const map: Record<number, WindowType[]> = {};
    for (let i = 1; i <= 8; i++) {
      const mid = parseTime(PORTION_TIMES[i].start) + 0.75;
      map[i] = getWindowsForTime(weekday, mid);
    }
    return map;
  }, [weekday]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Eight portions of daylight with daily inauspicious windows"
        style={{ maxWidth: size, overflow: "visible" }}
      >
        <defs>
          <radialGradient id="daylight-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={GOLD} stopOpacity="0.12" />
            <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={rOuter + 4} fill="url(#daylight-glow)" />
        <circle cx={cx} cy={cy} r={rOuter + 3} fill="none" stroke={HAIRLINE} strokeWidth={1} />

        {Array.from({ length: 8 }, (_, i) => i + 1).map((portion) => {
          const start = (portion - 1) * step + gap / 2;
          const end = portion * step - gap / 2;
          const mid = (start + end) / 2;
          const windows = windowsByPortion[portion];
          const isHovered = hoveredPortion === portion;
          const isActive =
            activeTime >= parseTime(PORTION_TIMES[portion].start) &&
            activeTime < parseTime(PORTION_TIMES[portion].end);
          const labelPos = polar(cx, cy, rLabel, mid);
          const timePos = polar(cx, cy, rInner - 22, mid);

          let fill = SURFACE_3;
          if (windows.length > 0) {
            fill = wash(WINDOW_COLORS[windows[0]], isHovered ? "30" : "18");
          } else if (isHovered) {
            fill = wash(GOLD, "16");
          }

          return (
            <g key={portion}>
              <path
                d={arcPath(cx, cy, rInner, rOuter, start, end)}
                fill={fill}
                stroke={isHovered || isActive ? GOLD : HAIRLINE}
                strokeWidth={isHovered || isActive ? 2.5 : 1}
                style={{ cursor: "pointer", transition: "all 180ms ease" }}
                onMouseEnter={() => onHover(portion)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onHover(portion)}
              />
              <text
                x={labelPos.x}
                y={labelPos.y - 6}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid > 180 ? mid + 90 : mid - 90}, ${labelPos.x}, ${labelPos.y - 6})`}
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  fill: windows.length > 0 ? WINDOW_COLORS[windows[0]] : INK_PRIMARY,
                  pointerEvents: "none",
                }}
              >
                {windows.length > 0 ? WINDOW_META[windows[0]].labelDevanagari : `${portion}`}
              </text>
              <text
                x={timePos.x}
                y={timePos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid > 180 ? mid + 90 : mid - 90}, ${timePos.x}, ${timePos.y})`}
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  fill: INK_MUTED,
                  pointerEvents: "none",
                }}
              >
                {PORTION_TIMES[portion].start}
              </text>
            </g>
          );
        })}

        {/* Center disc */}
        <circle cx={cx} cy={cy} r={rInner - 10} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "0.75rem", fontWeight: 800, fill: GOLD_DEEP, letterSpacing: "0.04em" }}
        >
          {pattern.weekdayDevanagari}
        </text>
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "1.1rem", fontWeight: 800, fill: INK_PRIMARY }}
        >
          {pattern.weekdayLabel}
        </text>
        <text
          x={cx}
          y={cy + 24}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "0.65rem", fontWeight: 700, fill: INK_MUTED }}
        >
          Mnemonic: {pattern.mnemonic}
        </text>
      </svg>

      {/* Hover info card */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 14,
          background: SURFACE,
          padding: "1rem 1.1rem",
          minHeight: 110,
        }}
      >
        {hoveredPortion ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            key={hoveredPortion}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.4rem",
              }}
            >
              <span style={{ fontSize: "1.2rem", fontWeight: 800, color: GOLD_DEEP }}>
                Portion {hoveredPortion}
              </span>
              <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>
                {PORTION_TIMES[hoveredPortion].start} – {PORTION_TIMES[hoveredPortion].end}
              </span>
            </div>
            {windowsByPortion[hoveredPortion].length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {windowsByPortion[hoveredPortion].map((w) => (
                  <span
                    key={w}
                    style={{
                      padding: "0.25rem 0.55rem",
                      borderRadius: 999,
                      background: wash(WINDOW_COLORS[w], "14"),
                      color: WINDOW_COLORS[w],
                      fontSize: "0.72rem",
                      fontWeight: 800,
                    }}
                  >
                    {WINDOW_META[w].label} — {WINDOW_META[w].character}
                  </span>
                ))}
              </div>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: 999,
                  background: wash(JADE, "12"),
                  color: JADE,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                <CheckCircle2 size={12} />
                Clear of all three windows
              </span>
            )}
          </motion.div>
        ) : (
          <div
            style={{
              color: INK_MUTED,
              fontSize: "0.85rem",
              textAlign: "center",
              paddingTop: "0.5rem",
            }}
          >
            Hover or click a portion to inspect its inauspicious-window status.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Daylight Timeline ─────────────────────────────────── */
function DaylightTimeline({
  weekday,
  activeTime,
}: {
  weekday: WeekdayKey;
  activeTime: number;
}) {
  const W = 720;
  const H = 140;
  const PAD = 24;
  const BAR_Y = 42;
  const BAR_H = 44;
  const TOTAL_W = W - PAD * 2;

  const pattern = findPattern(weekday);
  const timeToX = (t: number) => {
    const clamped = Math.min(Math.max(t, 6), 18);
    return PAD + ((clamped - 6) / 12) * TOTAL_W;
  }; // 6:00–18:00

  const windows: { type: WindowType; start: number; end: number }[] = [
    { type: "rahu", start: parseTime(pattern.rahu.start), end: parseTime(pattern.rahu.end) },
    {
      type: "yamaganda",
      start: parseTime(pattern.yamaganda.start),
      end: parseTime(pattern.yamaganda.end),
    },
    { type: "gulika", start: parseTime(pattern.gulika.start), end: parseTime(pattern.gulika.end) },
  ];

  return (
    <div style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "100%" }}>
        <defs>
          <filter id="windowShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Daylight track */}
        <rect
          x={PAD}
          y={BAR_Y}
          width={TOTAL_W}
          height={BAR_H}
          rx={6}
          fill={SURFACE_3}
          stroke={HAIRLINE}
          strokeWidth={1}
        />

        {/* Hour markers */}
        {Array.from({ length: 13 }, (_, i) => 6 + i).map((h) => (
          <line
            key={h}
            x1={timeToX(h)}
            y1={BAR_Y + BAR_H}
            x2={timeToX(h)}
            y2={BAR_Y + BAR_H + 8}
            stroke={INK_MUTED}
            strokeWidth={0.5}
            opacity={0.4}
          />
        ))}

        {/* Window bands */}
        {windows.map((w) => {
          const sx = timeToX(w.start);
          const ex = timeToX(w.end);
          return (
            <g key={w.type}>
              <rect
                x={sx}
                y={BAR_Y - 4}
                width={Math.max(ex - sx, 1)}
                height={BAR_H + 8}
                rx={4}
                fill={wash(WINDOW_COLORS[w.type], "22")}
                stroke={WINDOW_COLORS[w.type]}
                strokeWidth={2}
                strokeDasharray="4 2"
                style={{ filter: "url(#windowShadow)" }}
              />
              <text
                x={(sx + ex) / 2}
                y={BAR_Y + BAR_H / 2 + 5}
                textAnchor="middle"
                fill={WINDOW_COLORS[w.type]}
                fontSize={15}
                fontWeight={800}
                style={{ pointerEvents: "none" }}
              >
                {WINDOW_META[w.type].labelDevanagari}
              </text>
            </g>
          );
        })}

        {/* Active time cursor */}
        <line
          x1={timeToX(activeTime)}
          y1={BAR_Y - 8}
          x2={timeToX(activeTime)}
          y2={BAR_Y + BAR_H + 8}
          stroke={GOLD_DEEP}
          strokeWidth={2.5}
        />
        <polygon
          points={`${timeToX(activeTime) - 5},${BAR_Y - 8} ${timeToX(activeTime) + 5},${BAR_Y - 8} ${timeToX(activeTime)},${BAR_Y - 2}`}
          fill={GOLD_DEEP}
        />
        <text
          x={timeToX(activeTime)}
          y={BAR_Y - 12}
          textAnchor="middle"
          fill={GOLD_DEEP}
          fontSize={13}
          fontWeight={800}
        >
          {formatTime(activeTime)}
        </text>

        {/* Sunrise / Sunset labels */}
        <text x={PAD} y={BAR_Y + BAR_H + 28} textAnchor="start" fill={GOLD_DEEP} fontSize={13} fontWeight={800}>
          Sunrise 06:00
        </text>
        <text x={W - PAD} y={BAR_Y + BAR_H + 28} textAnchor="end" fill={GOLD_DEEP} fontSize={13} fontWeight={800}>
          Sunset 18:00
        </text>
      </svg>
    </div>
  );
}

/* ── Case-file envelope card ───────────────────────────── */
function CaseFileCard({
  caseFile,
  selected,
  solved,
  onClick,
}: {
  caseFile: CaseFile;
  selected: boolean;
  solved: boolean;
  onClick: () => void;
}) {
  const profile = findEventProfile(caseFile.eventKey);
  return (
    <button
      type="button"
      onClick={onClick}
      className="gl-focus-ring gl-clickable"
      style={{
        width: "100%",
        textAlign: "left",
        border: `1px solid ${selected ? GOLD : HAIRLINE}`,
        borderRadius: 14,
        background: selected ? "#FFFCF7" : SURFACE,
        padding: 0,
        cursor: "pointer",
        transition: "all 180ms ease",
        boxShadow: selected ? `0 0 0 2px ${wash(GOLD, "20")}` : "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: 5,
          background: solved ? JADE : selected ? GOLD : HAIRLINE,
          opacity: solved ? 0.9 : 1,
        }}
      />
      <div style={{ padding: "0.85rem 1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={16} style={{ color: GOLD }} />
            <span
              style={{
                fontSize: "0.78rem",
                fontWeight: 800,
                color: GOLD_DEEP,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {caseFile.client}
            </span>
          </div>
          {solved && <CheckCircle2 size={18} style={{ color: JADE }} />}
        </div>
        <p
          style={{
            margin: "0.35rem 0 0",
            fontWeight: 700,
            color: INK_PRIMARY,
            fontSize: "0.92rem",
            lineHeight: 1.4,
          }}
        >
          {caseFile.request}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.45rem",
          }}
        >
          {eventIcon(caseFile.eventKey, 13)}
          <span style={{ fontSize: "0.75rem", color: INK_MUTED, fontWeight: 700 }}>
            {profile.sanskrit}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ── Verdict selector ──────────────────────────────────── */
function VerdictSelector({
  correct,
  selected,
  onSelect,
  disabled,
}: {
  correct: Verdict;
  selected: Verdict | null;
  onSelect: (v: Verdict) => void;
  disabled: boolean;
}) {
  const options: Verdict[] = ["avoid", "clear", "boundary"];
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {options.map((opt) => {
        const isSelected = selected === opt;
        const showResult = selected !== null;
        const isCorrect = opt === correct;
        const meta = verdictBadge(opt);
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt)}
            style={{
              flex: "1 1 100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              padding: "0.55rem 0.7rem",
              borderRadius: 10,
              border: `1.5px solid ${
                showResult
                  ? isCorrect
                    ? meta.color
                    : isSelected
                      ? VERMILION
                      : HAIRLINE
                  : isSelected
                    ? GOLD
                    : HAIRLINE
              }`,
              background: showResult
                ? isCorrect
                  ? wash(meta.color, "18")
                  : isSelected
                    ? wash(VERMILION, "14")
                    : SURFACE
                : isSelected
                  ? wash(GOLD, "14")
                  : SURFACE,
              color: showResult
                ? isCorrect
                  ? meta.color
                  : isSelected
                    ? VERMILION
                    : INK_MUTED
                : isSelected
                  ? GOLD_DEEP
                  : INK_PRIMARY,
              fontWeight: 800,
              fontSize: "0.78rem",
              cursor: disabled ? "default" : "pointer",
              transition: "all 150ms ease",
            }}
          >
            {showResult && (isCorrect ? <CheckCircle2 size={14} /> : isSelected ? <XCircle size={14} /> : null)}
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Progress dots ─────────────────────────────────────── */
function ProgressDots({ total, solved }: { total: number; solved: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i < solved ? JADE : wash(GOLD, "20"),
            transition: "background 200ms ease",
          }}
        />
      ))}
    </div>
  );
}

/* ── Pattern table row ─────────────────────────────────── */
function PatternRow({ pattern }: { pattern: (typeof DAILY_PATTERNS)[number] }) {
  return (
    <tr>
      <td style={{ padding: "0.6rem 0.75rem", fontWeight: 700, color: INK_PRIMARY, fontSize: "0.82rem" }}>
        {pattern.weekdayLabel}
      </td>
      <td style={{ padding: "0.6rem 0.75rem", color: INK_MUTED, fontSize: "0.78rem" }}>
        {pattern.mnemonic}
      </td>
      <td style={{ padding: "0.6rem 0.75rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.2rem 0.5rem",
            borderRadius: 999,
            background: wash(VERMILION, "12"),
            color: VERMILION,
            fontSize: "0.7rem",
            fontWeight: 800,
          }}
        >
          {pattern.rahu.start}–{pattern.rahu.end}
        </span>
      </td>
      <td style={{ padding: "0.6rem 0.75rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.2rem 0.5rem",
            borderRadius: 999,
            background: wash("#7A3E1E", "12"),
            color: "#7A3E1E",
            fontSize: "0.7rem",
            fontWeight: 800,
          }}
        >
          {pattern.yamaganda.start}–{pattern.yamaganda.end}
        </span>
      </td>
      <td style={{ padding: "0.6rem 0.75rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.2rem 0.5rem",
            borderRadius: 999,
            background: wash("#5C3D2E", "12"),
            color: "#5C3D2E",
            fontSize: "0.7rem",
            fontWeight: 800,
          }}
        >
          {pattern.gulika.start}–{pattern.gulika.end}
        </span>
      </td>
    </tr>
  );
}

/* ── Main component ────────────────────────────────────── */
type TabKey = "wheel" | "cases" | "pattern" | "seasonal";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "wheel", label: "Daylight Wheel", sublabel: "8-portion filter", icon: <Sun size={15} /> },
  { key: "cases", label: "Case Files", sublabel: "Verdict practice", icon: <FileText size={15} /> },
  { key: "pattern", label: "7-Day Pattern", sublabel: "Mnemonic tables", icon: <Calendar size={15} /> },
  { key: "seasonal", label: "Seasonal Shift", sublabel: "Latitude/season", icon: <Scale size={15} /> },
];

export function RahuKalaYamagandaExplorer() {
  const [tab, setTab] = useState<TabKey>("wheel");
  const [weekday, setWeekday] = useState<WeekdayKey>("sunday");
  const [time, setTime] = useState<string>("16:00");
  const [hoveredPortion, setHoveredPortion] = useState<number | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>(CASE_FILES[0].id);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, Verdict | null>>({});
  const [daylightHours, setDaylightHours] = useState<number>(12);

  const timeDec = parseTime(time);
  const pattern = findPattern(weekday);
  const liveEvaluation = evaluateTime(weekday, timeDec);
  const liveBadge = verdictBadge(liveEvaluation.verdict);

  const activeCase = findCase(selectedCase) ?? CASE_FILES[0];
  const caseEvaluation = getCaseVerdict(activeCase);
  const caseAnswered = caseAnswers[activeCase.id];
  const caseCorrect = caseAnswered === activeCase.correctVerdict;

  const solvedCount = useMemo(
    () =>
      CASE_FILES.filter((cf) => {
        const ans = caseAnswers[cf.id];
        if (!ans) return false;
        return getCaseVerdict(cf).verdict === ans;
      }).length,
    [caseAnswers]
  );

  const segmentMinutes = Math.round((daylightHours / 8) * 60);

  return (
    <div
      style={{
        width: "100%",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 18,
        background: SURFACE,
        overflow: "hidden",
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
      data-interactive="rahu-kala-yamaganda-explorer"
    >
      {/* Header */}
      <div
        style={{
          padding: "1.1rem 1.25rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          background: "linear-gradient(135deg, #FFFDF8 0%, #F9F2E3 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.35rem",
                fontWeight: 700,
                color: INK_PRIMARY,
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Daily Inauspicious-Window Discipline
            </h2>
            <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
              Rāhu-Kāla · Yamagaṇḍa · Gulika-Kāla — the three daily ~90-minute windows to avoid.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ProgressDots total={CASE_FILES.length} solved={solvedCount} />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: GOLD_DEEP }}>
              {solvedCount}/{CASE_FILES.length} cases
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, background: SURFACE_2 }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: "0.7rem 0.5rem",
                background: active ? SURFACE : "transparent",
                border: "none",
                borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                color: active ? GOLD_DEEP : INK_MUTED,
                fontWeight: active ? 800 : 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
                transition: "all 150ms ease",
              }}
            >
              {t.icon}
              <span>{t.label}</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.8, fontWeight: 600 }}>{t.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem" }}>
        <AnimatePresence mode="wait">
          {tab === "wheel" && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Controls */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  padding: "0.85rem 1rem",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 14,
                  background: SURFACE,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: INK_MUTED,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Weekday
                  </label>
                  <select
                    value={weekday}
                    onChange={(e) => setWeekday(e.target.value as WeekdayKey)}
                    style={{
                      padding: "0.45rem 0.7rem",
                      borderRadius: 8,
                      border: `1px solid ${HAIRLINE}`,
                      background: SURFACE_2,
                      color: INK_PRIMARY,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    {WEEKDAYS.map((d) => (
                      <option key={d} value={d}>
                        {findPattern(d).weekdayLabel}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <label
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: INK_MUTED,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Event time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    style={{
                      padding: "0.4rem 0.7rem",
                      borderRadius: 8,
                      border: `1px solid ${HAIRLINE}`,
                      background: SURFACE_2,
                      color: INK_PRIMARY,
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  />
                </div>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      padding: "0.55rem 0.9rem",
                      borderRadius: 12,
                      background: wash(liveBadge.color, "12"),
                      border: `1px solid ${wash(liveBadge.color, "30")}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                    }}
                  >
                    <liveBadge.icon size={18} style={{ color: liveBadge.color }} />
                    <span style={{ fontWeight: 800, color: liveBadge.color, fontSize: "0.92rem" }}>
                      {liveBadge.label}
                    </span>
                  </div>
                  {liveEvaluation.windows.length > 0 && (
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {liveEvaluation.windows.map((w) => (
                        <span
                          key={w}
                          style={{
                            padding: "0.25rem 0.55rem",
                            borderRadius: 999,
                            background: wash(WINDOW_COLORS[w], "14"),
                            color: WINDOW_COLORS[w],
                            fontSize: "0.72rem",
                            fontWeight: 800,
                          }}
                        >
                          {WINDOW_META[w].label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(300px, 420px)", gap: "1.5rem", alignItems: "start" }}>
                <div>
                  <DaylightTimeline weekday={weekday} activeTime={timeDec} />
                  <div
                    style={{
                      marginTop: "1.25rem",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: "0.75rem",
                    }}
                  >
                    {WINDOW_ORDER.map((w) => {
                      const window = pattern[w];
                      const active = liveEvaluation.windows.includes(w);
                      return (
                        <motion.div
                          key={w}
                          animate={active ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ duration: 0.4 }}
                          style={{
                            padding: "0.85rem 1rem",
                            borderRadius: 14,
                            background: active ? wash(WINDOW_COLORS[w], "14") : SURFACE,
                            border: `1px solid ${active ? WINDOW_COLORS[w] : HAIRLINE}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.45rem",
                              marginBottom: "0.3rem",
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: WINDOW_COLORS[w],
                              }}
                            />
                            <span
                              style={{
                                fontWeight: 800,
                                color: WINDOW_COLORS[w],
                                fontSize: "0.85rem",
                              }}
                            >
                              {WINDOW_META[w].label}
                            </span>
                          </div>
                          <p style={{ margin: "0.2rem 0 0", color: INK_PRIMARY, fontWeight: 700, fontSize: "0.92rem" }}>
                            {window.start} – {window.end}
                          </p>
                          <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.72rem", lineHeight: 1.45 }}>
                            {WINDOW_META[w].character}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <PortionWheel
                  weekday={weekday}
                  activeTime={timeDec}
                  onHover={setHoveredPortion}
                  hoveredPortion={hoveredPortion}
                />
              </div>
            </motion.div>
          )}

          {tab === "cases" && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 320px) 1fr", gap: "1.25rem", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {CASE_FILES.map((cf) => (
                    <CaseFileCard
                      key={cf.id}
                      caseFile={cf}
                      selected={selectedCase === cf.id}
                      solved={caseAnswers[cf.id] === getCaseVerdict(cf).verdict}
                      onClick={() => setSelectedCase(cf.id)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setCaseAnswers({})}
                    style={{
                      marginTop: "0.25rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.55rem 1rem",
                      borderRadius: 10,
                      border: `1px dashed ${HAIRLINE}`,
                      background: "transparent",
                      color: INK_MUTED,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={13} />
                    Reset cases
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div
                    style={{
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: 16,
                      background: SURFACE,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.85rem 1.1rem",
                        borderBottom: `1px solid ${HAIRLINE}`,
                        background: SURFACE_2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          fontSize: "0.82rem",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        Active Case File
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 999,
                          background: wash(INDIGO, "12"),
                          color: INDIGO,
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        <Watch size={10} />
                        {activeCase.time}
                      </span>
                    </div>
                    <div style={{ padding: "1.1rem" }}>
                      <p style={{ margin: "0 0 0.2rem", fontSize: "0.8rem", color: INK_MUTED, fontWeight: 700 }}>
                        {activeCase.client}
                      </p>
                      <p
                        style={{
                          margin: "0 0 0.7rem",
                          fontWeight: 800,
                          color: INK_PRIMARY,
                          fontSize: "1.05rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {activeCase.request}
                      </p>
                      <p style={{ margin: "0 0 1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                        {activeCase.scenario}
                      </p>

                      <div style={{ marginBottom: "1rem" }}>
                        <p
                          style={{
                            margin: "0 0 0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: GOLD_DEEP,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Event Type
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          {eventIcon(activeCase.eventKey)}
                          <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 700 }}>
                            {findEventProfile(activeCase.eventKey).sanskrit} ·{" "}
                            {findEventProfile(activeCase.eventKey).devanagari}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <p
                          style={{
                            margin: "0 0 0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            color: GOLD_DEEP,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {activeCase.question}
                        </p>
                        <VerdictSelector
                          correct={caseEvaluation.verdict}
                          selected={caseAnswered}
                          onSelect={(v) => setCaseAnswers((prev) => ({ ...prev, [activeCase.id]: v }))}
                          disabled={!!caseAnswered}
                        />
                      </div>

                      {caseAnswered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{
                            borderRadius: 12,
                            padding: "0.85rem 1rem",
                            background: caseCorrect ? wash(JADE, "12") : wash(VERMILION, "12"),
                            border: `1px solid ${caseCorrect ? wash(JADE, "30") : wash(VERMILION, "30")}`,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {caseCorrect ? (
                              <CheckCircle2 size={18} style={{ color: JADE }} />
                            ) : (
                              <XCircle size={18} style={{ color: VERMILION }} />
                            )}
                            <span
                              style={{
                                fontWeight: 800,
                                color: caseCorrect ? JADE : VERMILION,
                                fontSize: "0.92rem",
                              }}
                            >
                              {caseCorrect ? "Correct" : "Not quite"} —{" "}
                              {verdictBadge(caseEvaluation.verdict).label}
                            </span>
                          </div>
                          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                            {activeCase.explanation}
                          </p>
                          <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.5 }}>
                            <strong>Recommendation:</strong> {activeCase.recommendedShift}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "pattern" && (
            <motion.div
              key="pattern"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 14,
                  background: SURFACE,
                  overflow: "hidden",
                  marginBottom: "1.25rem",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: SURFACE_2 }}>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Weekday
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Mnemonic
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Rāhu-Kāla
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Yamagaṇḍa
                      </th>
                      <th
                        style={{
                          padding: "0.75rem",
                          textAlign: "left",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Gulika-Kāla
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAILY_PATTERNS.map((p) => (
                      <PatternRow key={p.weekday} pattern={p} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
                {WINDOW_ORDER.map((w) => (
                  <div
                    key={w}
                    style={{
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: 14,
                      background: wash(WINDOW_COLORS[w], "08"),
                      padding: "0.9rem 1rem",
                      borderLeft: `4px solid ${WINDOW_COLORS[w]}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: WINDOW_COLORS[w],
                        }}
                      />
                      <span style={{ fontWeight: 800, color: WINDOW_COLORS[w], fontSize: "0.95rem" }}>
                        {WINDOW_META[w].label} {WINDOW_META[w].labelDevanagari}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {WINDOW_META[w].description}
                    </p>
                    <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
                      {WINDOW_META[w].character}
                    </p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 14,
                  background: SURFACE,
                  padding: "0.85rem 1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <ShieldAlert size={16} style={{ color: VERMILION }} />
                  <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.9rem" }}>
                    Universal-daily-applicability discipline
                  </span>
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                  All three windows are avoided for auspicious initiations across every event-type — wedding, business-launch,
                  gṛha-praveśa, travel-commencement, and education-initiation — regardless of integrated four-pillar evaluation.
                </p>
              </div>
            </motion.div>
          )}

          {tab === "seasonal" && (
            <motion.div
              key="seasonal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: 14,
                    background: SURFACE,
                    padding: "1rem 1.1rem",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 0.6rem",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: GOLD_DEEP,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    Seasonal Duration Explorer
                  </h3>
                  <p style={{ margin: "0 0 1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                    The ~90-minute approximation holds for a temperate ~12-hour day. Adjust daylight hours to see how each
                    portion stretches or compresses.
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                      <label
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          color: GOLD_DEEP,
                          textTransform: "uppercase",
                        }}
                      >
                        Daylight duration
                      </label>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: INK_PRIMARY }}>
                        {daylightHours.toFixed(1)}h
                      </span>
                    </div>
                    <input
                      type="range"
                      min={8}
                      max={16}
                      step={0.5}
                      value={daylightHours}
                      onChange={(e) => setDaylightHours(Number(e.target.value))}
                      style={{ width: "100%", accentColor: GOLD }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
                      <span style={{ fontSize: "0.7rem", color: INK_MUTED }}>Winter ~8h</span>
                      <span style={{ fontSize: "0.7rem", color: INK_MUTED }}>Equinox ~12h</span>
                      <span style={{ fontSize: "0.7rem", color: INK_MUTED }}>Summer ~16h</span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: 12,
                      background: SURFACE_2,
                      border: `1px solid ${HAIRLINE}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "0.78rem", color: INK_MUTED }}>Portion duration</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: INK_PRIMARY }}>
                        {segmentMinutes} min
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.78rem", color: INK_MUTED }}>Rāhu/Yama/Gulika window</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800, color: VERMILION }}>
                        ~{segmentMinutes} min
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  <div
                    style={{
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: 14,
                      background: SURFACE,
                      padding: "0.9rem 1rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: GOLD_DEEP,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      High-latitude caution
                    </h3>
                    <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.55 }}>
                      At latitudes above 60° N or S, daylight variation becomes extreme. Use ephemeris-precise computation
                      (Drik or Vakya tradition) rather than the ~90-minute approximation.
                    </p>
                  </div>

                  <div
                    style={{
                      border: `1px solid ${HAIRLINE}`,
                      borderRadius: 14,
                      background: SURFACE,
                      padding: "0.9rem 1rem",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        color: GOLD_DEEP,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      Brahma-muhūrta override variance
                    </h3>
                    <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.55 }}>
                      Some traditions permit Brahma-muhūrta (pre-dawn ~4:00–5:00 AM) to override these daily windows; others
                      maintain avoidance. Default to the conservative position per <em>samatvam</em>.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
