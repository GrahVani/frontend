"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CircleDot, Hash, RotateCcw, Sparkles, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  YOGINI_PERIODS,
  YOGINI_TOTAL_YEARS,
  activeYoginiForYears,
  cumulativeYoginiPeriods,
  triangularTotal,
  yoginiYearsMnemonic,
  yearsBetween,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "#3F2D1D";
const INK_SECONDARY = "#5C4630";
const INK_MUTED = "#745D40";
const READABLE_GOLD = "#936817";
const TABLE_LINE = "rgba(139, 118, 82, 0.28)";
const SELECTED_ROW = "rgba(255, 248, 229, 0.98)";

const CX = 210;
const CY = 210;
const R_OUTER = 176;
const R_INNER = 82;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(CX, CY, R_OUTER, startAngle);
  const outerEnd = polarToCartesian(CX, CY, R_OUTER, endAngle);
  const innerStart = polarToCartesian(CX, CY, R_INNER, endAngle);
  const innerEnd = polarToCartesian(CX, CY, R_INNER, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${R_OUTER} ${R_OUTER} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    "Z",
  ].join(" ");
}

function YoginiWheel({
  selectedIndex,
  startIndex,
  cycleYear,
  onSelect,
}: {
  selectedIndex: number;
  startIndex: number;
  cycleYear: number;
  onSelect: (index: number) => void;
}) {
  const cumulative = useMemo(() => cumulativeYoginiPeriods(startIndex), [startIndex]);
  const marker = polarToCartesian(CX, CY, R_OUTER + 3, (cycleYear / YOGINI_TOTAL_YEARS) * 360);

  return (
    <svg viewBox="0 0 420 420" className="h-auto w-full" role="img" aria-label="Yogini 36-year cycle">
      <circle cx={CX} cy={CY} r={R_OUTER + 12} fill="none" stroke="var(--gl-gold-hairline)" strokeDasharray="5 7" />
      {cumulative.map(({ period, start, end }) => {
        const startAngle = (start / YOGINI_TOTAL_YEARS) * 360;
        const endAngle = (end / YOGINI_TOTAL_YEARS) * 360;
        const midAngle = (startAngle + endAngle) / 2;
        const label = polarToCartesian(CX, CY, 122, midAngle);
        const yearLabel = polarToCartesian(CX, CY, 158, midAngle);
        const selected = selectedIndex === period.index;

        return (
          <g
            key={period.index}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(period.index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(period.index);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <path
              d={describeArc(startAngle, endAngle)}
              fill={selected ? period.tint : SURFACE}
              stroke={selected ? period.color : "var(--gl-gold-hairline)"}
              strokeWidth={selected ? 2.5 : 1}
            />
            <text
              x={label.x}
              y={label.y - 1}
              textAnchor="middle"
              fill={INK_PRIMARY}
              fontSize="13"
              fontWeight={900}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {period.name}
            </text>
            <text
              x={yearLabel.x}
              y={yearLabel.y + 3}
              textAnchor="middle"
              fill={selected ? READABLE_GOLD : INK_MUTED}
              fontSize="11"
              fontWeight={800}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {period.years} yr
            </text>
          </g>
        );
      })}
      <line x1={CX} y1={CY} x2={marker.x} y2={marker.y} stroke={ink.goldAccent} strokeWidth="3" strokeLinecap="round" />
      <circle cx={marker.x} cy={marker.y} r="7" fill={ink.goldAccent} stroke={SURFACE} strokeWidth="3" />
      <circle cx={CX} cy={CY} r={R_INNER - 6} fill={SURFACE} stroke="var(--gl-gold-hairline)" />
      <text
        x={CX}
        y={CY - 12}
        textAnchor="middle"
        fill={READABLE_GOLD}
        fontSize="34"
        fontWeight={900}
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        36
      </text>
      <text
        x={CX}
        y={CY + 13}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={800}
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        years / 8 Yoginis
      </text>
    </svg>
  );
}

export function YoginiExplorer() {
  const [startIndex, setStartIndex] = useState(1);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [targetDate, setTargetDate] = useState("2038-08-15");
  const elapsedYears = yearsBetween(startDate, targetDate);
  const active = activeYoginiForYears(elapsedYears, startIndex);
  const [selectedIndex, setSelectedIndex] = useState(active.period.index);
  const selected = YOGINI_PERIODS.find((period) => period.index === selectedIndex) ?? active.period;
  const cycleYear = elapsedYears % YOGINI_TOTAL_YEARS;
  const activeStartPercent = (active.start / YOGINI_TOTAL_YEARS) * 100;
  const activeWidthPercent = ((active.end - active.start) / YOGINI_TOTAL_YEARS) * 100;

  return (
    <div
      className="w-full"
      data-interactive="yogini-explorer"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
      }}
    >
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
            Quick supplementary dasha
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Yogini</IAST> 36-year cycle
          </h2>
          <p className="mt-1 max-w-3xl text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
            Explore the eight Yoginis, their 1-to-8-year allotments, planetary links, symbolic qualities, and active period for a date.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStartIndex(1);
            setStartDate("2026-01-01");
            setTargetDate("2038-08-15");
            setSelectedIndex(1);
          }}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset example
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <YoginiWheel selectedIndex={selected.index} startIndex={startIndex} cycleYear={cycleYear} onSelect={setSelectedIndex} />
          </section>

          <section className="rounded-xl p-4" style={{ background: SELECTED_ROW, border: `1.5px solid ${selected.color}55` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Selected Yogini
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {selected.name} - {selected.planet}
                </h3>
                <p className="mt-1 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                  {selected.years} year period · {selected.quality}
                </p>
              </div>
              <Devanagari size="lg" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>
            <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
              {selected.readingCue}
            </p>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Active Yogini for a date
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="mb-1 block text-sm font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Starting Yogini
                </span>
                <select
                  value={startIndex}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setStartIndex(next);
                    setSelectedIndex(activeYoginiForYears(elapsedYears, next).period.index);
                  }}
                  className="w-full rounded-lg px-4 py-3 text-base"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                >
                  {YOGINI_PERIODS.map((period) => (
                    <option key={period.index} value={period.index}>
                      {period.name} ({period.years})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Cycle start
                </span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-base"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Target date
                </span>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(event) => setTargetDate(event.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-base"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                />
              </label>
            </div>

            <div className="mt-4 rounded-xl p-4" style={{ background: SELECTED_ROW, border: `1.5px solid ${active.period.color}55` }}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                    Active now
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    {active.period.name} / {active.period.planet}
                  </h3>
                  <p className="mt-1 text-base" style={{ color: INK_SECONDARY }}>
                    Cycle year {cycleYear.toFixed(2)} of 36 · window {active.start}-{active.end} years
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedIndex(active.period.index)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
                  style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: active.period.color }}
                >
                  <CircleDot size={16} />
                  Inspect
                </button>
              </div>
              <div className="relative mt-4 h-5 rounded-full" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{ left: `${activeStartPercent}%`, width: `${activeWidthPercent}%`, background: active.period.color, opacity: 0.28 }}
                />
                <div
                  className="absolute top-[-4px] h-7 w-1 rounded-full"
                  style={{ left: `${(cycleYear / YOGINI_TOTAL_YEARS) * 100}%`, background: ink.goldAccent }}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center gap-2">
                  <Hash size={17} color={ink.goldAccent} />
                  <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                    Triangular sum
                  </p>
                </div>
                <p className="mt-3 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {yoginiYearsMnemonic()} = {triangularTotal()}
                </p>
                <p className="mt-2 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
                  The easy 1-8 sequence is why Yogini works as a fast timing cross-check.
                </p>
              </section>

              <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={17} color={ink.goldAccent} />
                  <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                    Reading rule
                  </p>
                </div>
                <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
                  Read the Yogini through planet plus quality, then compare with Vimshottari. It is a subtle-energy supplement, not the primary dasha.
                </p>
              </section>
            </div>
          </section>
        </div>

        <section className="min-w-0 rounded-xl p-4 xl:col-span-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Eight Yoginis
              </p>
            </div>
            <p className="m-0 text-sm font-semibold" style={{ color: INK_MUTED }}>
              {"1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 = 36"}
            </p>
          </div>
          <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div
              className="grid min-w-[900px]"
              style={{
                gridTemplateColumns: "52px 170px 128px 92px 160px minmax(300px,1fr)",
                background: SURFACE_2,
                color: INK_SECONDARY,
                fontSize: "0.82rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {["#", "Yogini", "Planet", "Years", "Quality", "Reading cue"].map((header) => (
                <div key={header} className="px-3 py-2">
                  {header}
                </div>
              ))}
            </div>
            {YOGINI_PERIODS.map((period) => (
              <button
                key={period.index}
                type="button"
                onClick={() => setSelectedIndex(period.index)}
                className="grid min-w-[900px] text-left"
                style={{
                  gridTemplateColumns: "52px 170px 128px 92px 160px minmax(300px,1fr)",
                  background: selected.index === period.index ? SELECTED_ROW : SURFACE,
                  borderTop: `1px solid ${TABLE_LINE}`,
                  color: INK_PRIMARY,
                }}
              >
                <div className="px-3 py-3 text-base font-bold" style={{ color: READABLE_GOLD }}>
                  {period.index}
                </div>
                <div className="px-3 py-3">
                  <p className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                    {period.name}
                  </p>
                  <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                    {period.devanagari}
                  </p>
                </div>
                <div className="px-3 py-3 text-base font-semibold">{period.planet}</div>
                <div className="px-3 py-3 text-base font-bold">{period.years}</div>
                <div className="px-3 py-3 text-base font-semibold">{period.quality}</div>
                <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                  {period.readingCue}
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
