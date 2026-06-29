"use client";

import { useMemo, useState } from "react";
import { IAST } from "../../chrome/typography";
import {
  DAYS,
  CHOWGHADIYA_CHARACTERS,
  CHOWGHADIYA_CYCLE,
  getCharacterMeta,
  DAY_START_INDEX,
  RAHU_KALAM_PART,
  YAMAGANDA_PART,
  SEASON_PRESETS,
  SLOKA,
  CASE_FILES,
  parseTime,
  formatTime,
  buildDaySegments,
  buildNightSegments,
  intervalsOverlap,
  type DayKey,
  type Segment,
  type CaseFile,
  type Classification,
} from "./data";

/* ─── Design tokens ─── */
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_FROSTED = "var(--gl-card-surface, rgba(255, 249, 234, 0.78))";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #4A3020)";
const INK_MUTED = "var(--gl-ink-muted, #4F351F)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GOLD = "var(--gl-gold, #9C7A2F)";

const CLASSIFICATION_META: Record<
  Classification,
  { label: string; color: string; bg: string; border: string; glyph: string }
> = {
  favourable: {
    label: "Favourable",
    color: "#2d7d46",
    bg: "#E8F5EE",
    border: "#A8D4B8",
    glyph: "✓",
  },
  unfavourable: {
    label: "Unfavourable",
    color: "#A23A1E",
    bg: "#FDE8E5",
    border: "#E8AFA8",
    glyph: "✗",
  },
  variable: {
    label: "Variable",
    color: "#B8860B",
    bg: "#FDF6E3",
    border: "#E8C98F",
    glyph: "~",
  },
};

/* ─── Geometry helpers ─── */
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function segmentPath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number
) {
  const a = polar(cx, cy, outer, start);
  const b = polar(cx, cy, outer, end);
  const c = polar(cx, cy, inner, end);
  const d = polar(cx, cy, inner, start);
  return `M ${d.x} ${d.y} L ${a.x} ${a.y} A ${outer} ${outer} 0 0 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${inner} ${inner} 0 0 0 ${d.x} ${d.y} Z`;
}

function classificationOf(name: string): Classification {
  return getCharacterMeta(name).classification;
}

function colorOf(name: string): string {
  return getCharacterMeta(name).color;
}

/* ─── Small presentational components ─── */
function ClassificationBadge({
  classification,
  compact = false,
}: {
  classification: Classification;
  compact?: boolean;
}) {
  const meta = CLASSIFICATION_META[classification];
  const short =
    classification === "favourable"
      ? "Fav"
      : classification === "unfavourable"
      ? "Avoid"
      : "Var";
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full font-bold tracking-wide uppercase shrink-0"
      style={{
        background: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        fontSize: compact ? 9 : 10,
        lineHeight: 1.1,
      }}
      title={meta.label}
    >
      <span>{meta.glyph}</span>
      <span className="hidden sm:inline">{meta.label}</span>
      <span className="sm:hidden">{short}</span>
    </span>
  );
}

function QualityDot({ name, size = 10 }: { name: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size, background: colorOf(name) }}
    />
  );
}

function Card({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{
        background: SURFACE_FROSTED,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 2px 12px rgba(107, 68, 35, 0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[11px] font-semibold uppercase tracking-[0.12em]"
      style={{ color: GOLD }}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-base font-semibold"
      style={{ color: INK_PRIMARY, fontFamily: "var(--font-serif), serif" }}
    >
      {children}
    </h3>
  );
}


/* ─── 1. The 8 named-character wheel ─── */
function CharacterRing({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string) => void;
}) {
  const CX = 200;
  const CY = 200;
  const R_OUTER = 170;
  const R_INNER = 95;
  const R_LABEL = (R_INNER + R_OUTER) / 2 + 2;
  const SEG = 360 / CHOWGHADIYA_CHARACTERS.length;

  const [hovered, setHovered] = useState<string | null>(null);
  const activeName = hovered ?? selected ?? null;

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 400 400" className="w-full max-w-[360px] h-auto">
        <defs>
          <filter id="chowGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Decorative outer rings */}
        <circle
          cx={CX}
          cy={CY}
          r={R_OUTER + 18}
          fill="none"
          stroke={HAIRLINE}
          strokeWidth={0.8}
          opacity={0.35}
        />
        <circle
          cx={CX}
          cy={CY}
          r={R_OUTER + 10}
          fill="none"
          stroke={HAIRLINE}
          strokeWidth={0.5}
          opacity={0.25}
          strokeDasharray="4 5"
        />

        {CHOWGHADIYA_CHARACTERS.map((ch, i) => {
          const start = i * SEG;
          const end = (i + 1) * SEG;
          const mid = (start + end) / 2;
          const isActive = activeName === ch.name;
          const isSelected = selected === ch.name;
          const p = polar(CX, CY, R_LABEL, mid);

          return (
            <g
              key={ch.name}
              onMouseEnter={() => setHovered(ch.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(ch.name)}
              style={{ cursor: "pointer" }}
            >
              <path
                d={segmentPath(CX, CY, R_INNER, R_OUTER, start, end)}
                fill={ch.bg}
                stroke={isActive || isSelected ? ch.color : HAIRLINE}
                strokeWidth={isActive || isSelected ? 2.5 : 1}
                opacity={isActive ? 1 : isSelected ? 0.95 : 0.82}
                style={{ transition: "all 0.25s ease" }}
              />
              {isSelected && (
                <path
                  d={segmentPath(CX, CY, R_INNER - 4, R_OUTER + 4, start - 1, end + 1)}
                  fill="none"
                  stroke={ch.color}
                  strokeWidth={2}
                  strokeDasharray="3 2"
                  opacity={0.6}
                />
              )}
              <text
                x={p.x}
                y={p.y - 4}
                textAnchor="middle"
                fill={ch.color}
                fontSize={13}
                fontWeight={700}
                style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}
              >
                {ch.name}
              </text>
              <text
                x={p.x}
                y={p.y + 11}
                textAnchor="middle"
                fill={INK_MUTED}
                fontSize={9}
                style={{ pointerEvents: "none" }}
              >
                {ch.devanagari}
              </text>
            </g>
          );
        })}

        {/* Center hub */}
        <circle cx={CX} cy={CY} r={R_INNER - 8} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
        {activeName ? (
          <g style={{ pointerEvents: "none" }}>
            <text
              x={CX}
              y={CY - 18}
              textAnchor="middle"
              fill={colorOf(activeName)}
              fontSize={22}
              fontWeight={700}
            >
              {getCharacterMeta(activeName).name}
            </text>
            <text
              x={CX}
              y={CY + 6}
              textAnchor="middle"
              fill={INK_SECONDARY}
              fontSize={10}
            >
              {getCharacterMeta(activeName).meaning}
            </text>
            <foreignObject x={CX - 55} y={CY + 14} width={110} height={30}>
              <div className="flex justify-center">
                <ClassificationBadge classification={classificationOf(activeName)} />
              </div>
            </foreignObject>
          </g>
        ) : (
          <g style={{ pointerEvents: "none" }}>
            <text
              x={CX}
              y={CY - 4}
              textAnchor="middle"
              fill={INK_MUTED}
              fontSize={11}
              fontWeight={600}
            >
              8 named
            </text>
            <text
              x={CX}
              y={CY + 12}
              textAnchor="middle"
              fill={INK_MUTED}
              fontSize={11}
              fontWeight={600}
            >
              characters
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}

function CharacterDetailCard({ name }: { name: string }) {
  const ch = getCharacterMeta(name);
  return (
    <Card className="p-5 h-full" style={{ borderLeft: `4px solid ${ch.color}` }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <Eyebrow>Character</Eyebrow>
          <h4
            className="text-2xl font-semibold mt-1"
            style={{ color: ch.color, fontFamily: "var(--font-serif), serif" }}
          >
            <IAST>{ch.name}</IAST>
          </h4>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            {ch.devanagari} · {ch.sanskrit}
          </p>
        </div>
        <ClassificationBadge classification={ch.classification} />
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: INK_SECONDARY }}>
        {ch.guidance}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {ch.bestFor.length > 0 && (
          <div className="rounded-lg p-2.5" style={{ background: "rgba(45,125,70,0.06)" }}>
            <div className="font-semibold mb-1" style={{ color: "#2d7d46" }}>
              Best for
            </div>
            <ul className="space-y-0.5" style={{ color: INK_SECONDARY }}>
              {ch.bestFor.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span style={{ color: "#2d7d46" }}>✓</span>
                  <IAST>{item}</IAST>
                </li>
              ))}
            </ul>
          </div>
        )}
        {ch.avoidFor.length > 0 && (
          <div className="rounded-lg p-2.5" style={{ background: "rgba(162,58,30,0.06)" }}>
            <div className="font-semibold mb-1" style={{ color: "#A23A1E" }}>
              Avoid for
            </div>
            <ul className="space-y-0.5" style={{ color: INK_SECONDARY }}>
              {ch.avoidFor.map((item) => (
                <li key={item} className="flex items-start gap-1.5">
                  <span style={{ color: "#A23A1E" }}>✗</span>
                  <IAST>{item}</IAST>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {ch.aliases.length > 0 && (
        <p className="mt-4 text-[11px] italic" style={{ color: INK_MUTED }}>
          Also known as: <IAST>{ch.aliases.join(", ")}</IAST> (regional variants).
        </p>
      )}
    </Card>
  );
}


/* ─── 2. Weekday pattern dial ─── */
function WeekdayDial({ day, onChange }: { day: DayKey; onChange: (d: DayKey) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {DAYS.map((d) => {
        const startName = CHOWGHADIYA_CYCLE[DAY_START_INDEX[d]];
        const meta = getCharacterMeta(startName);
        const isActive = d === day;
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className="relative flex flex-col items-center min-w-[76px] px-3 py-2.5 rounded-xl transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              border: `1px solid ${isActive ? meta.color : HAIRLINE}`,
              boxShadow: isActive ? `0 2px 10px ${meta.color}22` : "none",
              transform: isActive ? "translateY(-2px)" : "none",
            }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: isActive ? meta.color : INK_PRIMARY }}
            >
              {d.slice(0, 3)}
            </span>
            <span className="text-[10px] mt-0.5" style={{ color: INK_MUTED }}>
              starts
            </span>
            <span
              className="text-[11px] font-bold mt-0.5"
              style={{ color: meta.color }}
            >
              {startName}
            </span>
            {isActive && (
              <span
                className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: meta.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── 3. Day-night 16-segment wheel ─── */
function DayNightWheel({
  daySegments,
  nightSegments,
  rahuStart,
  rahuEnd,
  yamaStart,
  yamaEnd,
  hoverSeg,
  setHoverSeg,
}: {
  daySegments: Segment[];
  nightSegments: Segment[];
  rahuStart: number;
  rahuEnd: number;
  yamaStart: number;
  yamaEnd: number;
  hoverSeg: { type: "day" | "night"; idx: number } | null;
  setHoverSeg: (s: { type: "day" | "night"; idx: number } | null) => void;
}) {
  const CX = 220;
  const CY = 220;
  const R_OUTER = 200;
  const R_MID = 140;
  const R_INNER = 80;
  const DAY_START_ANGLE = -90; // 12 o'clock
  const TOTAL_DAY_DEG = 180;
  const TOTAL_NIGHT_DEG = 180;

  const daySlice = TOTAL_DAY_DEG / 8;
  const nightSlice = TOTAL_NIGHT_DEG / 8;

  return (
    <div className="relative flex justify-center">
      <svg viewBox="0 0 480 480" className="w-full max-w-[460px] h-auto">
        <defs>
          <filter id="segGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#6B4423" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* Outer decorative ring */}
        <circle cx={CX} cy={CY} r={R_OUTER + 14} fill="none" stroke={HAIRLINE} strokeWidth={0.8} opacity={0.3} />
        <circle cx={CX} cy={CY} r={R_OUTER + 6} fill="none" stroke={HAIRLINE} strokeWidth={0.5} opacity={0.2} strokeDasharray="4 5" />

        {/* Day arc — right semicircle (sunrise at top → sunset at bottom, clockwise) */}
        {daySegments.map((seg, i) => {
          const start = DAY_START_ANGLE + i * daySlice;
          const end = start + daySlice;
          const mid = (start + end) / 2;
          const meta = getCharacterMeta(seg.quality);
          const isHovered = hoverSeg?.type === "day" && hoverSeg.idx === i;
          const p = polar(CX, CY, (R_MID + R_OUTER) / 2 + 2, mid);
          const isRahu = intervalsOverlap(seg.start, seg.end, rahuStart, rahuEnd);
          const isYama = intervalsOverlap(seg.start, seg.end, yamaStart, yamaEnd);

          return (
            <g
              key={`day-${i}`}
              onMouseEnter={() => setHoverSeg({ type: "day", idx: i })}
              onMouseLeave={() => setHoverSeg(null)}
              style={{ cursor: "pointer" }}
            >
              <path
                d={segmentPath(CX, CY, R_MID, R_OUTER, start, end)}
                fill={meta.bg}
                stroke={isHovered ? meta.color : HAIRLINE}
                strokeWidth={isHovered ? 2.5 : 1}
                opacity={isHovered ? 1 : 0.9}
                style={{ transition: "all 0.2s ease" }}
              />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                fill={meta.color}
                fontSize={13}
                fontWeight={800}
                style={{ pointerEvents: "none" }}
              >
                {seg.quality}
              </text>
              {(isRahu || isYama) && (
                <circle
                  cx={polar(CX, CY, R_OUTER - 10, mid).x}
                  cy={polar(CX, CY, R_OUTER - 10, mid).y}
                  r={4}
                  fill="#A23A1E"
                  style={{ pointerEvents: "none" }}
                />
              )}
            </g>
          );
        })}

        {/* Night arc — left semicircle (sunset at bottom → sunrise at top, clockwise) */}
        {nightSegments.map((seg, i) => {
          const start = 90 + i * nightSlice;
          const end = start + nightSlice;
          const mid = (start + end) / 2;
          const meta = getCharacterMeta(seg.quality);
          const isHovered = hoverSeg?.type === "night" && hoverSeg.idx === i;
          const p = polar(CX, CY, (R_MID + R_OUTER) / 2 + 2, mid);

          return (
            <g
              key={`night-${i}`}
              onMouseEnter={() => setHoverSeg({ type: "night", idx: i })}
              onMouseLeave={() => setHoverSeg(null)}
              style={{ cursor: "pointer" }}
            >
              <path
                d={segmentPath(CX, CY, R_MID, R_OUTER, start, end)}
                fill={meta.bg}
                stroke={isHovered ? meta.color : HAIRLINE}
                strokeWidth={isHovered ? 2.5 : 1}
                opacity={isHovered ? 1 : 0.75}
                style={{ transition: "all 0.2s ease" }}
              />
              <text
                x={p.x}
                y={p.y}
                textAnchor="middle"
                fill={meta.color}
                fontSize={13}
                fontWeight={800}
                style={{ pointerEvents: "none" }}
              >
                {seg.quality}
              </text>
            </g>
          );
        })}

        {/* Inner hub */}
        <circle cx={CX} cy={CY} r={R_MID - 6} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />

        {/* Sunrise / sunset markers */}
        <line
          x1={polar(CX, CY, R_INNER, -90).x}
          y1={polar(CX, CY, R_INNER, -90).y}
          x2={polar(CX, CY, R_OUTER + 10, -90).x}
          y2={polar(CX, CY, R_OUTER + 10, -90).y}
          stroke={GOLD_ACCENT}
          strokeWidth={1.5}
        />
        <text
          x={CX - 72}
          y={CY + 38}
          textAnchor="middle"
          fill={GOLD_ACCENT}
          fontSize={15}
          fontWeight={800}
        >
          Sunrise
        </text>

        <line
          x1={polar(CX, CY, R_INNER, 90).x}
          y1={polar(CX, CY, R_INNER, 90).y}
          x2={polar(CX, CY, R_OUTER + 10, 90).x}
          y2={polar(CX, CY, R_OUTER + 10, 90).y}
          stroke="#5A5A7A"
          strokeWidth={1.5}
        />
        <text
          x={CX + 72}
          y={CY + 38}
          textAnchor="middle"
          fill="#5A5A7A"
          fontSize={15}
          fontWeight={800}
        >
          Sunset
        </text>

        {/* Day / Night labels */}
        <text x={CX + R_OUTER - 34} y={CY} textAnchor="middle" fill={GOLD_ACCENT} fontSize={15} fontWeight={900}>
          DAY
        </text>
        <text x={CX - R_OUTER + 34} y={CY} textAnchor="middle" fill="#5A5A7A" fontSize={15} fontWeight={900}>
          NIGHT
        </text>

        {/* Center info */}
        <text x={CX} y={CY - 48} textAnchor="middle" fill={INK_PRIMARY} fontSize={17} fontWeight={800}>
          16 Segments
        </text>
        <text x={CX} y={CY - 26} textAnchor="middle" fill={INK_MUTED} fontSize={13} fontWeight={700}>
          ~90 min each*
        </text>
      </svg>
    </div>
  );
}


/* ─── 4. Linear timeline bar ─── */
function TimelineBar({
  daySegments,
  nightSegments,
  rahuStart,
  rahuEnd,
  yamaStart,
  yamaEnd,
  sunriseDec,
  sunsetDec,
  hoverSeg,
  setHoverSeg,
  pulseRahu,
}: {
  daySegments: Segment[];
  nightSegments: Segment[];
  rahuStart: number;
  rahuEnd: number;
  yamaStart: number;
  yamaEnd: number;
  sunriseDec: number;
  sunsetDec: number;
  hoverSeg: { type: "day" | "night"; idx: number } | null;
  setHoverSeg: (s: { type: "day" | "night"; idx: number } | null) => void;
  pulseRahu: boolean;
}) {
  const W = 980;
  const H = 165;
  const PAD = 28;
  const BAR_Y = 52;
  const BAR_H = 52;
  const TOTAL_W = W - PAD * 2;

  const timeToX = (t: number) => PAD + ((t % 24) / 24) * TOTAL_W;
  const allSegments = [
    ...daySegments.map((s, i) => ({ ...s, type: "day" as const, idx: i })),
    ...nightSegments.map((s, i) => ({ ...s, type: "night" as const, idx: i })),
  ];
  const hoveredSegData = hoverSeg
    ? allSegments.find((s) => s.type === hoverSeg.type && s.idx === hoverSeg.idx)
    : null;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "100%" }}>
        <defs>
          <filter id="barShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity={0.08} />
          </filter>
        </defs>

        <rect
          x={PAD}
          y={BAR_Y}
          width={TOTAL_W}
          height={BAR_H}
          rx={6}
          fill={SURFACE}
          stroke={HAIRLINE}
          strokeWidth={1}
        />

        {allSegments.map((seg) => {
          const meta = getCharacterMeta(seg.quality);
          const sx = timeToX(seg.start);
          const ex = timeToX(seg.end);
          const isHovered = hoverSeg?.type === seg.type && hoverSeg.idx === seg.idx;
          const width = Math.max(ex - sx, 1);

          return (
            <g key={`${seg.type}-${seg.idx}`}>
              <rect
                x={sx}
                y={BAR_Y}
                width={width}
                height={BAR_H}
                fill={isHovered ? meta.color : meta.bg}
                opacity={isHovered ? 0.95 : 0.85}
                rx={seg.idx === 0 || seg.idx === 7 ? 4 : 0}
                style={{ transition: "all 0.2s ease", cursor: "pointer" }}
                onMouseEnter={() => setHoverSeg({ type: seg.type, idx: seg.idx })}
                onMouseLeave={() => setHoverSeg(null)}
              />
              {seg.idx > 0 && (
                <line
                  x1={sx}
                  y1={BAR_Y + 3}
                  x2={sx}
                  y2={BAR_Y + BAR_H - 3}
                  stroke={SURFACE}
                  strokeWidth={1}
                  opacity={0.7}
                />
              )}
              {width > 30 && (
                <text
                  x={(sx + ex) / 2}
                  y={BAR_Y + BAR_H / 2 + 6}
                  textAnchor="middle"
                  fill={isHovered ? "#fff" : meta.color}
                  fontSize={15}
                  fontWeight={900}
                  style={{ pointerEvents: "none" }}
                >
                  {seg.quality}
                </text>
              )}
            </g>
          );
        })}

        {/* Rāhu overlay */}
        <rect
          x={timeToX(rahuStart)}
          y={BAR_Y - 4}
          width={timeToX(rahuEnd) - timeToX(rahuStart)}
          height={BAR_H + 8}
          rx={3}
          fill="none"
          stroke="#A23A1E"
          strokeWidth={pulseRahu ? 3.5 : 2.5}
          strokeDasharray="5 3"
          style={{ transition: "stroke-width 0.3s ease" }}
        />
        <text
          x={timeToX((rahuStart + rahuEnd) / 2)}
          y={BAR_Y - 14}
          textAnchor="middle"
          fill="#A23A1E"
          fontSize={16}
          fontWeight={900}
        >
          RĀHU-KĀLAM
        </text>

        {/* Yama overlay */}
        <rect
          x={timeToX(yamaStart)}
          y={BAR_Y - 3}
          width={timeToX(yamaEnd) - timeToX(yamaStart)}
          height={BAR_H + 6}
          rx={3}
          fill="none"
          stroke="#A23A1E"
          strokeWidth={1.5}
          strokeDasharray="2 2"
          opacity={0.85}
        />
        <text
          x={timeToX((yamaStart + yamaEnd) / 2)}
          y={BAR_Y + BAR_H + 22}
          textAnchor="middle"
          fill="#A23A1E"
          fontSize={15}
          fontWeight={900}
        >
          YAMAGAṆḌA
        </text>

        {/* Sunrise / sunset markers */}
        <line
          x1={timeToX(sunriseDec)}
          y1={BAR_Y - 8}
          x2={timeToX(sunriseDec)}
          y2={BAR_Y + BAR_H + 8}
          stroke={GOLD_ACCENT}
          strokeWidth={2}
        />
        <text
          x={timeToX(sunriseDec)}
          y={BAR_Y + BAR_H + 44}
          textAnchor="middle"
          fill={GOLD_ACCENT}
          fontSize={15}
          fontWeight={900}
        >
          Sunrise
        </text>

        <line
          x1={timeToX(sunsetDec)}
          y1={BAR_Y - 8}
          x2={timeToX(sunsetDec)}
          y2={BAR_Y + BAR_H + 8}
          stroke="#5A5A7A"
          strokeWidth={2}
        />
        <text
          x={timeToX(sunsetDec)}
          y={BAR_Y + BAR_H + 44}
          textAnchor="middle"
          fill="#5A5A7A"
          fontSize={15}
          fontWeight={900}
        >
          Sunset
        </text>

        {/* Hour ticks */}
        {Array.from({ length: 25 }, (_, i) => i).map((h) => (
          <line
            key={h}
            x1={timeToX(h)}
            y1={BAR_Y + BAR_H}
            x2={timeToX(h)}
            y2={BAR_Y + BAR_H + 4}
            stroke={INK_MUTED}
            strokeWidth={0.5}
            opacity={0.35}
          />
        ))}
      </svg>

      {hoveredSegData && (
        <div
          className="absolute px-2.5 py-1.5 rounded-lg text-xs pointer-events-none"
          style={{
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
            top: "0px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
        >
          <span className="font-semibold" style={{ color: colorOf(hoveredSegData.quality) }}>
            {hoveredSegData.quality}
          </span>
          <span style={{ color: INK_SECONDARY }}>
            {" "}— {formatTime(hoveredSegData.start)} to {formatTime(hoveredSegData.end)}
          </span>
          <span className="ml-2" style={{ color: INK_MUTED }}>
            {hoveredSegData.isDay ? "day" : "night"} segment {hoveredSegData.index}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── 5. Segment table ─── */
function SegmentTable({
  segments,
  title,
  rahuStart,
  rahuEnd,
  yamaStart,
  yamaEnd,
  hoverSeg,
  setHoverSeg,
  type,
}: {
  segments: Segment[];
  title: string;
  rahuStart: number;
  rahuEnd: number;
  yamaStart: number;
  yamaEnd: number;
  hoverSeg: { type: "day" | "night"; idx: number } | null;
  setHoverSeg: (s: { type: "day" | "night"; idx: number } | null) => void;
  type: "day" | "night";
}) {
  return (
    <div>
      <SectionHeading>{title}</SectionHeading>
      <div
        className="rounded-xl overflow-hidden mt-2"
        style={{ border: `1px solid ${HAIRLINE}` }}
      >
        {segments.map((seg, i) => {
          const meta = getCharacterMeta(seg.quality);
          const isRahu = intervalsOverlap(seg.start, seg.end, rahuStart, rahuEnd);
          const isYama = intervalsOverlap(seg.start, seg.end, yamaStart, yamaEnd);
          const isHovered = hoverSeg?.type === type && hoverSeg.idx === i;

          return (
            <div
              key={i}
              className="px-3 py-2.5 transition-all cursor-default"
              style={{
                background: isHovered ? `${meta.color}10` : i % 2 === 0 ? SURFACE : "transparent",
                borderBottom: i < 7 ? `1px solid ${HAIRLINE}` : "none",
              }}
              onMouseEnter={() => setHoverSeg({ type, idx: i })}
              onMouseLeave={() => setHoverSeg(null)}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="text-xs font-bold w-5 shrink-0" style={{ color: INK_MUTED }}>
                  {seg.index}
                </span>
                <QualityDot name={seg.quality} size={10} />
                <span
                  className="text-sm font-semibold w-12 sm:w-14 shrink-0"
                  style={{ color: meta.color }}
                >
                  {seg.quality}
                </span>
                <span
                  className="text-xs flex-1 truncate hidden sm:block"
                  style={{ color: INK_MUTED }}
                >
                  {meta.meaning}
                </span>
                <span
                  className="text-xs font-medium tabular-nums whitespace-nowrap shrink-0"
                  style={{ color: INK_SECONDARY }}
                >
                  {formatTime(seg.start)}–{formatTime(seg.end)}
                </span>
                <div className="shrink-0">
                  {isRahu && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#A23A1E", color: "#fff" }}
                    >
                      Rāhu
                    </span>
                  )}
                  {isYama && !isRahu && (
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "#A23A1E", color: "#fff" }}
                    >
                      Yama
                    </span>
                  )}
                  {!isRahu && !isYama && (
                    <ClassificationBadge
                      classification={meta.classification}
                      compact
                    />
                  )}
                </div>
              </div>
              <div className="sm:hidden text-[11px] mt-1 pl-7" style={{ color: INK_MUTED }}>
                {meta.meaning}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ─── 6. Case-file / envelope-style cards ─── */
function CaseFileCard({
  file,
  isOpen,
  selectedOption,
  onToggle,
  onSelect,
}: {
  file: CaseFile;
  isOpen: boolean;
  selectedOption: string | null;
  onToggle: () => void;
  onSelect: (optionId: string) => void;
}) {
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === file.correctOptionId;
  const meta = CLASSIFICATION_META[isCorrect ? "favourable" : isAnswered ? "unfavourable" : "variable"];

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${isOpen ? "shadow-lg" : ""}`}
      style={{
        borderLeft: `4px solid ${file.kind === "high-stakes" ? "#A23A1E" : "#2d7d46"}`,
      }}
    >
      {/* Envelope flap header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-colors"
        style={{ background: file.kind === "high-stakes" ? "#FDE8E5" : "#E8F5EE" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider"
            style={{
              background: file.kind === "high-stakes" ? "#A23A1E" : "#2d7d46",
              color: "#fff",
            }}
          >
            {file.kind}
          </span>
          <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>
            {file.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isAnswered && (
            <span
              className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: meta.color, color: "#fff" }}
            >
              {meta.glyph}
            </span>
          )}
          <span style={{ color: INK_MUTED }}>{isOpen ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Expanded content */}
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? "800px" : "0px",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
        }}
      >
        <div className="p-4 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: INK_SECONDARY }}>
            {file.scenario}
          </p>

          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: INK_PRIMARY }}>
              {file.question}
            </p>
            <div className="space-y-2">
              {file.options.map((opt) => {
                const picked = selectedOption === opt.id;
                const isOptCorrect = opt.id === file.correctOptionId;
                const showCorrect = isAnswered && isOptCorrect;
                const showWrong = isAnswered && picked && !isOptCorrect;

                return (
                  <button
                    key={opt.id}
                    disabled={isAnswered}
                    onClick={() => onSelect(opt.id)}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all border"
                    style={{
                      background: showCorrect
                        ? "#E8F5EE"
                        : showWrong
                        ? "#FDE8E5"
                        : picked
                        ? SURFACE
                        : "transparent",
                      borderColor: showCorrect
                        ? "#2d7d46"
                        : showWrong
                        ? "#A23A1E"
                        : HAIRLINE,
                      color: INK_PRIMARY,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className="font-bold shrink-0"
                        style={{ color: showCorrect ? "#2d7d46" : showWrong ? "#A23A1E" : GOLD_ACCENT }}
                      >
                        {showCorrect ? "✓" : showWrong ? "✗" : "○"}
                      </span>
                      <div>
                        <div className="font-semibold">{opt.label}</div>
                        <div style={{ color: INK_MUTED }}>{opt.detail}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {isAnswered && (
            <div
              className="rounded-xl p-3.5"
              style={{
                background: isCorrect ? "#E8F5EE" : "#FDE8E5",
                border: `1px solid ${isCorrect ? "#A8D4B8" : "#E8AFA8"}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: meta.color, color: "#fff" }}
                >
                  {meta.glyph}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ color: isCorrect ? "#2d7d46" : "#A23A1E" }}
                >
                  {file.verdict.headline}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {file.verdict.body}
              </p>
              {file.verdict.chowghadiyaNote && (
                <p className="mt-2 text-[11px] italic" style={{ color: INK_MUTED }}>
                  {file.verdict.chowghadiyaNote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

/* ─── 7. Cumulative sub-day filter verdict panel ─── */
function CumulativeFilterPanel({
  day,
  daySegments,
  rahuStart,
  rahuEnd,
  yamaStart,
  yamaEnd,
}: {
  day: DayKey;
  daySegments: Segment[];
  rahuStart: number;
  rahuEnd: number;
  yamaStart: number;
  yamaEnd: number;
}) {
  // Use a representative "best" segment for the demo: first favourable non-overlapping.
  const bestSegment = useMemo(() => {
    return (
      daySegments.find(
        (seg) =>
          classificationOf(seg.quality) === "favourable" &&
          !intervalsOverlap(seg.start, seg.end, rahuStart, rahuEnd) &&
          !intervalsOverlap(seg.start, seg.end, yamaStart, yamaEnd)
      ) ?? null
    );
  }, [daySegments, rahuStart, rahuEnd, yamaStart, yamaEnd]);

  const favourableCount = daySegments.filter(
    (s) => classificationOf(s.quality) === "favourable"
  ).length;
  const unfavourableCount = daySegments.filter(
    (s) => classificationOf(s.quality) === "unfavourable"
  ).length;
  const variableCount = daySegments.filter(
    (s) => classificationOf(s.quality) === "variable"
  ).length;

  const checks = [
    {
      label: "Avoid Rāhu-Kālam",
      time: `${formatTime(rahuStart)}–${formatTime(rahuEnd)}`,
      ok: true,
      note: `Segment ${RAHU_KALAM_PART[day]} of daytime`,
    },
    {
      label: "Avoid Yamagaṇḍa",
      time: `${formatTime(yamaStart)}–${formatTime(yamaEnd)}`,
      ok: true,
      note: `Segment ${YAMAGANDA_PART[day]} of daytime`,
    },
    {
      label: "Prefer favourable Chowghadiya",
      time: bestSegment
        ? `${formatTime(bestSegment.start)}–${formatTime(bestSegment.end)} (${bestSegment.quality})`
        : "None today",
      ok: bestSegment !== null,
      note: `${favourableCount} favourable · ${unfavourableCount} unfavourable · ${variableCount} variable day segments`,
    },
  ];

  const allOk = checks.every((c) => c.ok);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Eyebrow>Cumulative sub-day filter</Eyebrow>
          <SectionHeading>Three-filter convergence</SectionHeading>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: allOk ? "#E8F5EE" : "#FDF6E3",
            color: allOk ? "#2d7d46" : "#B8860B",
            border: `1px solid ${allOk ? "#A8D4B8" : "#E8C98F"}`,
          }}
        >
          {allOk ? "Converged" : "Partial"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {checks.map((check, i) => (
          <div
            key={i}
            className="rounded-xl p-3.5 transition-all"
            style={{
              background: check.ok ? "rgba(45,125,70,0.05)" : "rgba(184,134,11,0.05)",
              border: `1px solid ${check.ok ? "#A8D4B8" : "#E8C98F"}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: check.ok ? "#2d7d46" : "#B8860B",
                  color: "#fff",
                }}
              >
                {check.ok ? "✓" : "~"}
              </span>
              <span className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>
                {check.label}
              </span>
            </div>
            <div className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
              {check.time}
            </div>
            <div className="text-[11px] mt-1" style={{ color: INK_MUTED }}>
              {check.note}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs italic" style={{ color: INK_MUTED }}>
        Optimal sub-day window clears all three filters simultaneously. Lesson §4.6.
      </p>
    </Card>
  );
}


/* ─── Main exported interactive component ─── */
export function ChoghadiyaRahuKalamCalculator() {
  const [day, setDay] = useState<DayKey>("Sunday");
  const [sunrise, setSunrise] = useState<string>("06:00");
  const [sunset, setSunset] = useState<string>("18:00");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>("Amṛta");
  const [hoverSeg, setHoverSeg] = useState<{ type: "day" | "night"; idx: number } | null>(null);
  const [pulseRahu, setPulseRahu] = useState(false);
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, string>>({});

  const sunriseDec = parseTime(sunrise);
  const sunsetDec = parseTime(sunset);
  const dayLength = sunsetDec - sunriseDec;
  const nightLength = 24 - dayLength;

  const daySegments = useMemo(
    () => buildDaySegments(day, sunriseDec, sunsetDec),
    [day, sunriseDec, sunsetDec]
  );
  const nightSegments = useMemo(
    () => buildNightSegments(day, sunsetDec, sunriseDec),
    [day, sunsetDec, sunriseDec]
  );

  const rahuPart = RAHU_KALAM_PART[day];
  const yamaPart = YAMAGANDA_PART[day];
  const rahuStart = sunriseDec + (rahuPart - 1) * (dayLength / 8);
  const rahuEnd = rahuStart + dayLength / 8;
  const yamaStart = sunriseDec + (yamaPart - 1) * (dayLength / 8);
  const yamaEnd = yamaStart + dayLength / 8;

  const applyPreset = (sr: string, ss: string) => {
    setSunrise(sr);
    setSunset(ss);
  };

  const handleRahuFocus = () => {
    setPulseRahu(true);
    setTimeout(() => setPulseRahu(false), 1500);
  };

  const toggleCase = (id: string) => {
    setOpenCase((prev) => (prev === id ? null : id));
  };

  const answerCase = (id: string, optionId: string) => {
    setCaseAnswers((prev) => ({ ...prev, [id]: optionId }));
  };

  const correctCount = useMemo(
    () => CASE_FILES.filter((f) => caseAnswers[f.id] === f.correctOptionId).length,
    [caseAnswers]
  );

  return (
    <div
      className="w-full"
      style={{
        background: SURFACE_FROSTED,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: "20px",
        padding: "22px",
        boxShadow: "0 4px 24px rgba(107, 68, 35, 0.06)",
      }}
      data-interactive="choghadiya-rahukalam-calculator"
    >
      {/* Header */}
      <div className="mb-6">
        <h2
          className="text-xl font-semibold"
          style={{ color: INK_PRIMARY, fontFamily: "var(--font-serif), serif" }}
        >
          <IAST>Chowghadiya &amp; Sub-Day Filter Laboratory</IAST>
        </h2>
        <p className="text-sm mt-1" style={{ color: INK_MUTED }}>
          16-segment practical-heuristic framework + weekday rotation + cumulative filter
          convergence
        </p>
      </div>

      {/* Śloka card */}
      <Card className="p-4 mb-6" style={{ background: "rgba(156,122,47,0.05)" }}>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <Eyebrow>Śloka · Muhūrta-Cintāmaṇi 7</Eyebrow>
            <p
              className="text-base mt-1 font-medium"
              style={{ color: INK_PRIMARY, fontFamily: "var(--font-devanagari), serif" }}
            >
              {SLOKA.devanagari}
            </p>
            <p className="text-xs mt-1 italic" style={{ color: INK_MUTED }}>
              {SLOKA.iast}
            </p>
          </div>
          <div className="md:max-w-[45%]">
            <p className="text-sm" style={{ color: INK_SECONDARY }}>
              “{SLOKA.english}”
            </p>
          </div>
        </div>
      </Card>

      {/* ── Section 1: Character wheel + classification ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <Eyebrow>§4.3</Eyebrow>
              <SectionHeading>The 8 named characters</SectionHeading>
            </div>
            <div className="flex gap-2">
              {(
                [
                  ["favourable", 4],
                  ["unfavourable", 3],
                  ["variable", 1],
                ] as [Classification, number][]
              ).map(([cls, count]) => (
                <div
                  key={cls}
                  className="flex flex-col items-center px-2 py-1 rounded-lg text-[10px] font-bold"
                  style={{
                    background: CLASSIFICATION_META[cls].bg,
                    color: CLASSIFICATION_META[cls].color,
                    border: `1px solid ${CLASSIFICATION_META[cls].border}`,
                  }}
                >
                  <span>{count}</span>
                  <span className="uppercase tracking-wider">{cls.slice(0, 3)}</span>
                </div>
              ))}
            </div>
          </div>
          <CharacterRing selected={selectedCharacter} onSelect={setSelectedCharacter} />
          <p className="text-[11px] text-center mt-2" style={{ color: INK_MUTED }}>
            Click a segment to inspect its discipline guidance. The 8th day/night segment repeats
            the sunrise-start character, giving 16 segments per 24 hours.
          </p>
        </Card>

        <div className="flex flex-col">
          {selectedCharacter ? (
            <CharacterDetailCard name={selectedCharacter} />
          ) : (
            <Card className="p-5 h-full flex items-center justify-center">
              <p className="text-sm" style={{ color: INK_MUTED }}>
                Select a character on the wheel to see its guidance.
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* ── Section 2: Weekday pattern + inputs ── */}
      <Card className="p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <Eyebrow>§4.4</Eyebrow>
            <SectionHeading>Weekday sunrise-start pattern</SectionHeading>
            <p className="text-xs mt-1" style={{ color: INK_MUTED }}>
              Select a weekday; the first day-segment at sunrise is highlighted. The cycle then
              follows Udveg → Char → Lābha → Amṛta → Kāla → Śubha → Roga → Udveg.
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
                Sunrise
              </label>
              <input
                type="time"
                value={sunrise}
                onChange={(e) => setSunrise(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-sm outline-none"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
                Sunset
              </label>
              <input
                type="time"
                value={sunset}
                onChange={(e) => setSunset(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg text-sm outline-none"
                style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </div>
            <div className="flex gap-1.5">
              {SEASON_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.sunrise, p.sunset)}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:opacity-80"
                  style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <WeekdayDial day={day} onChange={setDay} />

        <div className="mt-4 text-[11px]" style={{ color: INK_MUTED }}>
          Daylight: {dayLength.toFixed(1)}h · Night: {nightLength.toFixed(1)}h · Day segment: ~
          {Math.round((dayLength / 8) * 60)} min · Night segment: ~{Math.round((nightLength / 8) * 60)}{" "}
          min
        </div>
      </Card>

      {/* ── Section 3: 16-segment calculator ── */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Eyebrow>§4.2 · Calculator</Eyebrow>
            <SectionHeading>16-segment day &amp; night wheel</SectionHeading>
          </div>
          <button
            onClick={handleRahuFocus}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: "#FDE8E5", color: "#A23A1E", border: "1px solid #E8AFA8" }}
          >
            Focus Rāhu-Kālam
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-center min-w-0">
          <div className="min-w-0 xl:col-span-2">
            <TimelineBar
              daySegments={daySegments}
              nightSegments={nightSegments}
              rahuStart={rahuStart}
              rahuEnd={rahuEnd}
              yamaStart={yamaStart}
              yamaEnd={yamaEnd}
              sunriseDec={sunriseDec}
              sunsetDec={sunsetDec}
              hoverSeg={hoverSeg}
              setHoverSeg={setHoverSeg}
              pulseRahu={pulseRahu}
            />
          </div>
          <div className="min-w-0">
            <DayNightWheel
              daySegments={daySegments}
              nightSegments={nightSegments}
              rahuStart={rahuStart}
              rahuEnd={rahuEnd}
              yamaStart={yamaStart}
              yamaEnd={yamaEnd}
              hoverSeg={hoverSeg}
              setHoverSeg={setHoverSeg}
            />
          </div>
          <div className="space-y-4 min-w-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-4">
              <SegmentTable
                segments={daySegments}
                title="Day Chowghadiya"
                rahuStart={rahuStart}
                rahuEnd={rahuEnd}
                yamaStart={yamaStart}
                yamaEnd={yamaEnd}
                hoverSeg={hoverSeg}
                setHoverSeg={setHoverSeg}
                type="day"
              />
              <SegmentTable
                segments={nightSegments}
                title="Night Chowghadiya"
                rahuStart={rahuStart}
                rahuEnd={rahuEnd}
                yamaStart={yamaStart}
                yamaEnd={yamaEnd}
                hoverSeg={hoverSeg}
                setHoverSeg={setHoverSeg}
                type="night"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ── Section 4: Case files ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <Eyebrow>§6 Worked examples · Interactive</Eyebrow>
            <SectionHeading>Case files</SectionHeading>
          </div>
          <div
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
          >
            Progress: {correctCount}/{CASE_FILES.length} correct
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CASE_FILES.map((file) => (
            <CaseFileCard
              key={file.id}
              file={file}
              isOpen={openCase === file.id}
              selectedOption={caseAnswers[file.id] ?? null}
              onToggle={() => toggleCase(file.id)}
              onSelect={(optionId) => answerCase(file.id, optionId)}
            />
          ))}
        </div>
      </div>

      {/* ── Section 5: Cumulative filter verdict ── */}
      <CumulativeFilterPanel
        day={day}
        daySegments={daySegments}
        rahuStart={rahuStart}
        rahuEnd={rahuEnd}
        yamaStart={yamaStart}
        yamaEnd={yamaEnd}
      />

      {/* ── Footer legend ── */}
      <div className="mt-6 pt-4 flex flex-wrap gap-4 justify-center" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
        {(
          [
            ["Favourable", "#2d7d46"],
            ["Unfavourable", "#A23A1E"],
            ["Variable", "#B8860B"],
            ["Rāhu-Kālam", "#A23A1E"],
            ["Yamagaṇḍa", "#A23A1E"],
          ] as [string, string][]
        ).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: label === "Rāhu-Kālam" || label === "Yamagaṇḍa" ? "transparent" : color,
                border: `2px solid ${color}`,
                borderStyle: label === "Yamagaṇḍa" ? "dashed" : label === "Rāhu-Kālam" ? "dashed" : "solid",
              }}
            />
            <span className="text-xs" style={{ color: INK_SECONDARY }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-center mt-4" style={{ color: INK_MUTED }}>
        *Segment duration varies by latitude and season; actual = daylight or night duration ÷ 8.
        Use ephemeris-precise software for high-stakes or extreme-latitude contexts.
      </p>
    </div>
  );
}
