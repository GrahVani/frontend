"use client";

/**
 * DashaTimeline — Interactive 120-Year Vimśottarī Cycle Visualizer
 *
 * §7 interactive for Lesson 10.1.1 & 10.1.4
 *
 * Three-zone layout:
 *   1. SVG Wheel — 9 proportional arcs (clickable/hoverable)
 *   2. Detail Panel — selected lord info with Devanāgarī, significations
 *   3. Linear Timeline — horizontal bar with lifespan overlay slider
 *
 * Design system: Grahvani Learning Design System
 */

import { useState, useMemo, useCallback } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";
import {
  DASHA_LORDS,
  TOTAL_CYCLE_YEARS,
  cumulativeYears,
  rotatedSequence,
  DASHA_GROUPINGS,
  type GroupingRationale,
  type DashaLord,
} from "./data";
import { ink } from "@/design-tokens/grahvani-learning/colors";

/* ─── Constants ────────────────────────────────────────────────────────── */

const CX = 200;
const CY = 200;
const R_OUTER = 175;
const R_INNER = 90;
const R_ABBR = R_INNER + 22;
const R_YEARS = R_OUTER - 18;

/* ─── SVG Geometry Helpers ─────────────────────────────────────────────── */

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number
): string {
  const sweep = endAngle - startAngle;
  const largeArc = sweep > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, rOuter, startAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, endAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    `Z`,
  ].join(" ");
}

/* ─── Sub-Components ───────────────────────────────────────────────────── */

/** The SVG circular wheel */
function DashaWheel({
  startIndex,
  selected,
  hovered,
  lifespanYears,
  grouping,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  startIndex: number;
  selected: number | null;
  hovered: number | null;
  lifespanYears: number;
  grouping: GroupingRationale;
  onSelect: (idx: number) => void;
  onHover: (idx: number) => void;
  onHoverEnd: () => void;
}) {
  const sequence = useMemo(() => rotatedSequence(startIndex), [startIndex]);
  const cumYears = useMemo(() => cumulativeYears(startIndex), [startIndex]);

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-auto"
      style={{ maxWidth: "100%", display: "block", margin: "0 auto" }}
      role="img"
      aria-label="Vimśottarī 120-year daśā wheel with nine planetary lords"
    >
      {/* Outer decorative ring */}
      <circle
        cx={CX}
        cy={CY}
        r={R_OUTER + 10}
        fill="none"
        stroke="var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"
        strokeWidth={1}
        opacity={0.4}
      />
      <circle
        cx={CX}
        cy={CY}
        r={R_OUTER + 5}
        fill="none"
        stroke="var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"
        strokeWidth={0.5}
        opacity={0.25}
        strokeDasharray="4 4"
      />

      {/* Arc segments */}
      {sequence.map((lord, i) => {
        const startAngle = i === 0 ? 0 : (cumYears[i - 1] / TOTAL_CYCLE_YEARS) * 360;
        const endAngle = (cumYears[i] / TOTAL_CYCLE_YEARS) * 360;
        const midAngle = (startAngle + endAngle) / 2;

        const isGrouped = grouping !== "none" && DASHA_GROUPINGS[grouping].slugs.includes(lord.grahaSlug);
        const isSelected = selected === lord.index;
        const isHovered = hovered === lord.index;
        const isActive = isSelected || isHovered || isGrouped;

        // Lifespan dimming: cumulative year at end of this segment
        const segmentEndYear = cumYears[i];
        const segmentStartYear = i === 0 ? 0 : cumYears[i - 1];
        const isFullyCovered = segmentEndYear <= Math.min(lifespanYears, TOTAL_CYCLE_YEARS);
        const isPartiallyCovered =
          segmentStartYear < lifespanYears && segmentEndYear > lifespanYears;
        
        const isDimmed = (!isFullyCovered && !isPartiallyCovered) || (grouping !== "none" && !isGrouped);

        // Label positions
        const abbrPos = polarToCartesian(CX, CY, R_ABBR, midAngle);
        const yearsPos = polarToCartesian(CX, CY, R_YEARS, midAngle);

        // Compute display opacity
        const segOpacity = isDimmed ? 0.22 : 1;

        return (
          <g
            key={lord.index}
            style={{
              cursor: "pointer",
              opacity: segOpacity,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={() => onHover(lord.index)}
            onMouseLeave={onHoverEnd}
            onClick={() => onSelect(lord.index)}
            role="button"
            tabIndex={0}
            aria-label={`${lord.nameIAST} daśā — ${lord.years} years`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(lord.index);
              }
            }}
          >
            {/* Arc segment */}
            <path
              d={describeArc(CX, CY, R_OUTER, R_INNER, startAngle, endAngle)}
              fill={isActive ? lord.colorTint : "var(--gl-card-surface-solid, #FFF9F0)"}
              stroke={isActive ? lord.color : "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"}
              strokeWidth={isActive ? 2 : 0.8}
              style={{ transition: "all 0.2s ease" }}
            />

            {/* Partial coverage overlay (diagonal hatch) */}
            {isPartiallyCovered && lifespanYears < TOTAL_CYCLE_YEARS && (
              <path
                d={describeArc(
                  CX,
                  CY,
                  R_OUTER,
                  R_INNER,
                  startAngle + ((lifespanYears - segmentStartYear) / lord.years) * (endAngle - startAngle),
                  endAngle
                )}
                fill="var(--gl-card-surface-solid, #FFF9F0)"
                opacity={0.6}
                style={{ pointerEvents: "none" }}
              />
            )}

            {/* Lord abbreviation */}
            <text
              x={abbrPos.x}
              y={abbrPos.y + 4}
              textAnchor="middle"
              fill={isActive ? lord.color : ink.primaryOnDark}
              fontSize={11}
              fontWeight={isActive ? 700 : 600}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                pointerEvents: "none",
                transition: "fill 0.2s ease",
              }}
            >
              {lord.abbr}
            </text>

            {/* Years number */}
            <text
              x={yearsPos.x}
              y={yearsPos.y + 4}
              textAnchor="middle"
              fill={isActive ? lord.color : ink.mutedOnDark}
              fontSize={9}
              fontWeight={isActive ? 700 : 500}
              style={{
                fontFamily: "var(--font-sans), sans-serif",
                pointerEvents: "none",
                transition: "fill 0.2s ease",
              }}
            >
              {lord.years}y
            </text>
          </g>
        );
      })}

      {/* Inner/outer ring borders */}
      <circle
        cx={CX}
        cy={CY}
        r={R_OUTER}
        fill="none"
        stroke="var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"
        strokeWidth={0.5}
        opacity={0.4}
      />
      <circle
        cx={CX}
        cy={CY}
        r={R_INNER}
        fill="none"
        stroke="var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"
        strokeWidth={0.5}
        opacity={0.4}
      />

      {/* Center mandala */}
      <g>
        <circle
          cx={CX}
          cy={CY}
          r={R_INNER - 4}
          fill="var(--gl-card-surface-solid, #FFF9F0)"
          stroke="var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"
          strokeWidth={1}
        />
        {/* Decorative rotating inner ring */}
        <g opacity={0.1}>
          <circle cx={CX} cy={CY} r={R_INNER - 18} fill="none" stroke={ink.goldAccent} strokeWidth={1}>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${CX} ${CY}`}
              to={`360 ${CX} ${CY}`}
              dur="90s"
              repeatCount="indefinite"
            />
          </circle>
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((a) => {
            const p1 = polarToCartesian(CX, CY, R_INNER - 30, a);
            const p2 = polarToCartesian(CX, CY, R_INNER - 16, a);
            return (
              <line
                key={a}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={ink.goldAccent}
                strokeWidth={0.8}
              />
            );
          })}
        </g>

        {/* Center text */}
        <text
          x={CX}
          y={CY - 14}
          textAnchor="middle"
          fill={ink.goldAccent}
          fontSize={13}
          fontWeight={700}
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          120
        </text>
        <text
          x={CX}
          y={CY + 2}
          textAnchor="middle"
          fill={ink.goldAccent}
          fontSize={10}
          fontWeight={600}
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Years
        </text>
        <text
          x={CX}
          y={CY + 16}
          textAnchor="middle"
          fill={ink.mutedOnDark}
          fontSize={8}
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          Pūrṇāyus
        </text>

        {/* Lifespan indicator inside center */}
        {lifespanYears !== TOTAL_CYCLE_YEARS && (
          <text
            x={CX}
            y={CY + 32}
            textAnchor="middle"
            fill={ink.vermilionAccent}
            fontSize={8}
            fontWeight={600}
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          >
            Lifespan: {lifespanYears}y
          </text>
        )}
      </g>

      {/* Start indicator arrow at 12 o'clock */}
      <g>
        <polygon
          points={`${CX - 5},${CY - R_OUTER - 14} ${CX + 5},${CY - R_OUTER - 14} ${CX},${CY - R_OUTER - 4}`}
          fill={ink.goldAccent}
          opacity={0.7}
        />
      </g>
    </svg>
  );
}

/** Linear horizontal timeline bar */
function LinearTimeline({
  startIndex,
  selected,
  hovered,
  lifespanYears,
  grouping,
  onSelect,
  onHover,
  onHoverEnd,
}: {
  startIndex: number;
  selected: number | null;
  hovered: number | null;
  lifespanYears: number;
  grouping: GroupingRationale;
  onSelect: (idx: number) => void;
  onHover: (idx: number) => void;
  onHoverEnd: () => void;
}) {
  const baseSequence = useMemo(() => rotatedSequence(startIndex), [startIndex]);
  const maxYears = Math.max(TOTAL_CYCLE_YEARS, lifespanYears);

  // Generate extended sequence to cover maxYears
  const { extendedSequence, extendedCumYears } = useMemo(() => {
    const seq: (DashaLord & { uniqueKey: string })[] = [];
    const cum: number[] = [];
    let currentSum = 0;
    let cycle = 0;

    while (currentSum < maxYears) {
      for (const lord of baseSequence) {
        if (currentSum >= maxYears) break;
        seq.push({ ...lord, uniqueKey: `${lord.index}-${cycle}` });
        currentSum += lord.years;
        cum.push(currentSum);
      }
      cycle++;
    }
    return { extendedSequence: seq, extendedCumYears: cum };
  }, [baseSequence, maxYears]);

  return (
    <div className="w-full">
      {/* Bar segments */}
      <div className="flex w-full rounded-lg overflow-hidden" style={{ height: "40px" }}>
        {extendedSequence.map((lord, i) => {
          const widthPct = (lord.years / maxYears) * 100;
          const isGrouped = grouping !== "none" && DASHA_GROUPINGS[grouping].slugs.includes(lord.grahaSlug);
          const isSelected = selected === lord.index;
          const isHovered = hovered === lord.index;
          const isActive = isSelected || isHovered || isGrouped;

          const segEnd = extendedCumYears[i];
          const segStart = i === 0 ? 0 : extendedCumYears[i - 1];
          const isDimmed = segStart >= lifespanYears || (grouping !== "none" && !isGrouped);

          return (
            <button
              key={lord.uniqueKey}
              style={{
                width: `${widthPct}%`,
                backgroundColor: isActive ? lord.color : lord.colorTint,
                opacity: isDimmed ? 0.2 : 1,
                borderRight:
                  i < extendedSequence.length - 1
                    ? "1px solid var(--gl-card-surface-solid, #FFF9F0)"
                    : "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              onMouseEnter={() => onHover(lord.index)}
              onMouseLeave={onHoverEnd}
              onClick={() => onSelect(lord.index)}
              aria-label={`${lord.nameIAST} — ${lord.years} years`}
            >
              <span
                style={{
                  fontSize: widthPct > 6 ? "10px" : "8px",
                  fontWeight: 700,
                  color: isActive ? "#fff" : lord.color,
                  fontFamily: "var(--font-sans), sans-serif",
                  lineHeight: 1,
                  textAlign: "center",
                }}
              >
                {lord.abbr}
                {widthPct > 8 && (
                  <>
                    <br />
                    <span style={{ fontSize: "8px", fontWeight: 500, opacity: 0.8 }}>
                      {lord.years}y
                    </span>
                  </>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* Year markers below */}
      <div className="flex w-full mt-1" style={{ position: "relative", height: "14px" }}>
        <span
          className="absolute left-0"
          style={{ fontSize: "9px", color: ink.mutedOnDark, fontFamily: "var(--font-sans), sans-serif" }}
        >
          0
        </span>
        {extendedCumYears.map((yr, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${(yr / maxYears) * 100}%`,
              transform: "translateX(-50%)",
              fontSize: "9px",
              color: ink.mutedOnDark,
              fontFamily: "var(--font-sans), sans-serif",
            }}
          >
            {yr}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────────── */

export function DashaTimeline() {
  const slug = useLessonSlug();
  const showAdvanced = slug !== "the-vimshottari-cycle";

  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [startIndex, setStartIndex] = useState(0); // 0 = Ketu (default)
  const [lifespanYears, setLifespanYears] = useState(TOTAL_CYCLE_YEARS); // 120 = full
  const [grouping, setGrouping] = useState<GroupingRationale>("none");

  const activeLord = useMemo(() => {
    const idx = hovered ?? selected;
    return idx != null ? DASHA_LORDS.find((l) => l.index === idx) ?? null : null;
  }, [hovered, selected]);

  // Cumulative total up to the active lord (from the current start)
  const cumulativeToActive = useMemo(() => {
    if (!activeLord) return null;
    const seq = rotatedSequence(startIndex);
    const cum = cumulativeYears(startIndex);
    const posInSeq = seq.findIndex((l) => l.index === activeLord.index);
    if (posInSeq === -1) return null;
    return cum[posInSeq];
  }, [activeLord, startIndex]);

  const handleSelect = useCallback(
    (idx: number) => {
      setSelected((prev) => (prev === idx ? null : idx));
    },
    []
  );

  const handleHover = useCallback((idx: number) => setHovered(idx), []);
  const handleHoverEnd = useCallback(() => setHovered(null), []);

  return (
    <div
      className="w-full"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline, rgba(232, 199, 114, 0.18)))",
        borderRadius: "16px",
        padding: "20px",
      }}
      data-interactive="dasha-timeline"
    >
      {/* Header */}
      <div className="mb-4">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant), serif" }}
        >
          <IAST>Vimśottarī Daśā</IAST> — 120-Year Cycle
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          Click a segment to explore each lord&apos;s mahādaśā. Rotate the starting lord to see how the cycle shifts.
        </p>
      </div>

      {/* Toggles Row: Starting Lord & Grouping */}
      <div className="flex flex-col xl:flex-row xl:items-start gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.06em" }}
            >
              Starting Lord:
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DASHA_LORDS.map((lord, i) => {
              const isActive = startIndex === i;
              return (
                <button
                  key={lord.index}
                  onClick={() => setStartIndex(i)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: isActive ? lord.color : "var(--gl-card-surface-solid, #FFF9F0)",
                    color: isActive ? "#fff" : lord.color,
                    border: `1.5px solid ${isActive ? lord.color : lord.colorTint}`,
                    boxShadow: isActive ? `0 2px 8px ${lord.color}30` : "none",
                  }}
                >
                  {lord.abbr} · {lord.nameIAST}
                </button>
              );
            })}
          </div>
        </div>

        {showAdvanced && (
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.06em" }}
              >
                Grouping Rationale:
              </span>
              <span className="text-[10px] italic" style={{ color: ink.vermilionAccent }}>
                (Traditional sense, not derivation)
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setGrouping("none")}
                className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: grouping === "none" ? ink.mutedOnDark : "var(--gl-card-surface-solid, #FFF9F0)",
                  color: grouping === "none" ? "#fff" : ink.mutedOnDark,
                  border: `1.5px solid ${grouping === "none" ? ink.mutedOnDark : "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"}`,
                }}
              >
                None
              </button>
              {Object.values(DASHA_GROUPINGS).map((g) => {
                const isActive = grouping === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGrouping(g.id)}
                    className="px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1"
                    style={{
                      background: isActive ? ink.goldAccent : "var(--gl-card-surface-solid, #FFF9F0)",
                      color: isActive ? "#fff" : ink.goldAccent,
                      border: `1.5px solid ${isActive ? ink.goldAccent : "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))"}`,
                      boxShadow: isActive ? `0 2px 8px ${ink.goldAccent}30` : "none",
                    }}
                  >
                    {g.label} 
                    <span className="opacity-75 font-semibold">({g.sum}y)</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main content: Wheel + Detail */}
      <div className="flex flex-col xl:flex-row gap-4 mb-4">
        {/* SVG Wheel */}
        <div
          className="flex-1 rounded-xl p-3"
          style={{
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
          }}
        >
          <DashaWheel
            startIndex={startIndex}
            selected={selected}
            hovered={hovered}
            lifespanYears={lifespanYears}
            grouping={grouping}
            onSelect={handleSelect}
            onHover={handleHover}
            onHoverEnd={handleHoverEnd}
          />
        </div>

        {/* Detail Panel */}
        <div
          className="w-full xl:w-80 shrink-0 rounded-xl p-4 space-y-3"
          style={{
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
          }}
        >
          {activeLord ? (
            <>
              {/* Lord header */}
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: activeLord.color }}
                  >
                    Lord {activeLord.index} of 9
                  </p>
                  <h4
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      color: "var(--gl-ink-primary)",
                    }}
                  >
                    <IAST>{activeLord.nameIAST}</IAST>
                  </h4>
                </div>
                <Devanagari size="lg" style={{ color: activeLord.color }}>
                  {activeLord.devanagari}
                </Devanagari>
              </div>

              {/* Year allotment card */}
              <div
                className="rounded-lg p-3 text-center"
                style={{
                  background: activeLord.colorTint,
                  border: `1.5px solid ${activeLord.color}30`,
                }}
              >
                <div
                  className="text-3xl font-bold"
                  style={{
                    color: activeLord.color,
                    fontFamily: "var(--font-cormorant), serif",
                  }}
                >
                  {activeLord.years}
                </div>
                <div className="text-xs uppercase tracking-wide mt-1" style={{ color: "var(--gl-ink-muted)" }}>
                  Years allotted
                </div>
              </div>

              {/* Cumulative running total */}
              {cumulativeToActive != null && (
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: "var(--gl-surface-2, #F5EDD8)",
                    border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>
                        Cumulative total
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{
                          color: ink.goldAccent,
                          fontFamily: "var(--font-cormorant), serif",
                        }}
                      >
                        {cumulativeToActive} / {TOTAL_CYCLE_YEARS} years
                      </div>
                    </div>
                    <div
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: `${ink.goldAccent}15`,
                        color: ink.goldAccent,
                      }}
                    >
                      {((cumulativeToActive / TOTAL_CYCLE_YEARS) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              )}

              {/* Significations */}
              <div>
                <p
                  className="text-xs font-bold uppercase tracking-wider mb-1.5"
                  style={{ color: ink.goldAccent }}
                >
                  Significations
                </p>
                <p className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
                  {activeLord.signification}
                </p>
              </div>

              {/* Cycle position visual */}
              <div
                className="rounded-lg p-3"
                style={{
                  background: "var(--gl-surface-2, #F5EDD8)",
                  border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
                }}
              >
                <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--gl-ink-muted)" }}>
                  Position in cycle
                </div>
                <div className="flex gap-1">
                  {DASHA_LORDS.map((lord) => (
                    <div
                      key={lord.index}
                      className="flex-1 rounded-sm"
                      style={{
                        height: "6px",
                        background: lord.index === activeLord.index ? lord.color : lord.colorTint,
                        opacity: lord.index === activeLord.index ? 1 : 0.4,
                        transition: "all 0.2s ease",
                      }}
                      title={`${lord.abbr} — ${lord.years}y`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: "8px", color: "var(--gl-ink-muted)" }}>Ke</span>
                  <span style={{ fontSize: "8px", color: "var(--gl-ink-muted)" }}>Me</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div style={{ fontSize: "36px", marginBottom: "8px", opacity: 0.3 }}>☉</div>
              <p className="text-sm italic" style={{ color: "var(--gl-ink-muted)" }}>
                Click or hover a segment on the wheel to explore each lord&apos;s mahādaśā.
              </p>
              <p className="text-xs mt-3" style={{ color: "var(--gl-ink-muted)" }}>
                <strong>Tip:</strong> Try changing the starting lord or toggling a grouping rationale.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Linear Timeline */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "var(--gl-card-surface-solid, #FFF9F0)",
          border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>
            Linear timeline — {Math.max(TOTAL_CYCLE_YEARS, lifespanYears)} years
          </div>
          {lifespanYears !== TOTAL_CYCLE_YEARS && (
            <div
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${ink.vermilionAccent}15`, color: ink.vermilionAccent }}
            >
              Lifespan: {lifespanYears}y
            </div>
          )}
        </div>

        <LinearTimeline
          startIndex={startIndex}
          selected={selected}
          hovered={hovered}
          lifespanYears={lifespanYears}
          grouping={grouping}
          onSelect={handleSelect}
          onHover={handleHover}
          onHoverEnd={handleHoverEnd}
        />
      </div>

      {/* Lifespan overlay slider */}
      <div
        className="mt-4 rounded-xl p-4"
        style={{
          background: "var(--gl-card-surface-solid, #FFF9F0)",
          border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="lifespan-slider"
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--gl-ink-muted)" }}
          >
            Overlay a lifespan (max {showAdvanced ? 150 : 120})
          </label>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: ink.vermilionAccent, fontFamily: "var(--font-cormorant), serif" }}
          >
            {lifespanYears} years
          </span>
        </div>
        <input
          id="lifespan-slider"
          type="range"
          min={0}
          max={showAdvanced ? 150 : 120}
          value={lifespanYears}
          onChange={(e) => setLifespanYears(Number(e.target.value))}
          className="w-full"
          style={{
            accentColor: ink.vermilionAccent,
            cursor: "pointer",
          }}
          aria-label={`Lifespan overlay: ${lifespanYears} years`}
        />
        <div className="flex justify-between">
          <span style={{ fontSize: "9px", color: "var(--gl-ink-muted)" }}>0 years</span>
          <span style={{ fontSize: "9px", color: "var(--gl-ink-muted)" }}>120 years (pūrṇāyus)</span>
          {showAdvanced && <span style={{ fontSize: "9px", color: "var(--gl-ink-muted)" }}>150 years</span>}
        </div>
      </div>

      {/* Mnemonic strip */}
      <div
        className="mt-4 rounded-xl p-4"
        style={{
          background: "var(--gl-surface-2, #F5EDD8)",
          border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
        }}
      >
        <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: ink.goldAccent }}>
          Memorise
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-sans), sans-serif" }}>
            <span style={{ color: ink.goldAccent }}>Sequence:</span>{" "}
            {DASHA_LORDS.map((lord, i) => (
              <span key={lord.index}>
                <span
                  style={{
                    color: lord.color,
                    fontWeight: selected === lord.index ? 700 : 500,
                    textDecoration: selected === lord.index ? "underline" : "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => handleHover(lord.index)}
                  onMouseLeave={handleHoverEnd}
                  onClick={() => handleSelect(lord.index)}
                >
                  {lord.abbr}
                </span>
                {i < DASHA_LORDS.length - 1 ? "–" : ""}
              </span>
            ))}
            {" → "}
            <span style={{ color: DASHA_LORDS[0].color, opacity: 0.5 }}>(Ke)</span>
          </p>
          <p className="text-sm font-medium" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-sans), sans-serif" }}>
            <span style={{ color: ink.goldAccent }}>Years:</span>{" "}
            {DASHA_LORDS.map((lord, i) => (
              <span key={lord.index}>
                <span
                  style={{
                    color: lord.color,
                    fontWeight: selected === lord.index ? 700 : 500,
                    cursor: "pointer",
                  }}
                  onMouseEnter={() => handleHover(lord.index)}
                  onMouseLeave={handleHoverEnd}
                  onClick={() => handleSelect(lord.index)}
                >
                  {lord.years}
                </span>
                {i < DASHA_LORDS.length - 1 ? "–" : ""}
              </span>
            ))}
            {" = "}
            <span style={{ color: ink.goldAccent, fontWeight: 700 }}>{TOTAL_CYCLE_YEARS}</span>
          </p>
        </div>
      </div>

      {/* Reset button */}
      <div className="mt-3 text-center">
        <button
          onClick={() => {
            setSelected(null);
            setHovered(null);
            setStartIndex(0);
            setLifespanYears(TOTAL_CYCLE_YEARS);
            setGrouping("none");
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--gl-surface-2, #F5EDD8)",
            color: "var(--gl-ink-secondary)",
            border: "1px solid var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))",
          }}
        >
          ↺ Reset view
        </button>
      </div>
    </div>
  );
}
