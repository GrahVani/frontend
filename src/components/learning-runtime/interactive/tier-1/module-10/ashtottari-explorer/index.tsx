"use client";

import { useMemo, useState } from "react";
import { Ban, CheckCircle2, CircleDot, Hash, RotateCcw, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  ASHTOTTARI_LORDS,
  ASHTOTTARI_TOTAL_YEARS,
  OMITTED_KETU,
  ashtottariSequenceMnemonic,
  ashtottariYearsMnemonic,
  cumulativeAshtottariYears,
  getAshtottariLord,
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
const R_INNER = 92;

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

function AshtottariWheel({
  selectedIndex,
  onSelect,
}: {
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const cumulative = useMemo(() => cumulativeAshtottariYears(), []);

  return (
    <svg
      viewBox="0 0 420 420"
      className="h-auto w-full"
      role="img"
      aria-label="Ashtottari 108-year cycle with eight periods"
      style={{ display: "block" }}
    >
      <circle cx={CX} cy={CY} r={R_OUTER + 12} fill="none" stroke="var(--gl-gold-hairline)" strokeDasharray="5 7" />
      {cumulative.map(({ lord, start, end }) => {
        const startAngle = (start / ASHTOTTARI_TOTAL_YEARS) * 360;
        const endAngle = (end / ASHTOTTARI_TOTAL_YEARS) * 360;
        const midAngle = (startAngle + endAngle) / 2;
        const label = polarToCartesian(CX, CY, 132, midAngle);
        const yearLabel = polarToCartesian(CX, CY, 162, midAngle);
        const selected = selectedIndex === lord.index;

        return (
          <g
            key={lord.index}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(lord.index)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(lord.index);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <path
              d={describeArc(startAngle, endAngle)}
              fill={selected ? lord.colorTint : SURFACE}
              stroke={selected ? lord.color : "var(--gl-gold-hairline)"}
              strokeWidth={selected ? 2.5 : 1}
            />
            <text
              x={label.x}
              y={label.y + 4}
              textAnchor="middle"
              fill={INK_PRIMARY}
              fontSize="14"
              fontWeight={800}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {lord.abbr}
            </text>
            <text
              x={yearLabel.x}
              y={yearLabel.y + 3}
              textAnchor="middle"
              fill={selected ? READABLE_GOLD : INK_MUTED}
              fontSize="11"
              fontWeight={700}
              style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
            >
              {lord.years}y
            </text>
          </g>
        );
      })}

      <circle cx={CX} cy={CY} r={R_INNER - 6} fill={SURFACE} stroke="var(--gl-gold-hairline)" />
      <text
        x={CX}
        y={CY - 12}
        textAnchor="middle"
        fill={READABLE_GOLD}
        fontSize="34"
        fontWeight={800}
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        108
      </text>
      <text
        x={CX}
        y={CY + 13}
        textAnchor="middle"
        fill={INK_MUTED}
        fontSize="12"
        fontWeight={700}
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        years / 8 periods
      </text>
    </svg>
  );
}

export function AshtottariExplorer() {
  const [selectedIndex, setSelectedIndex] = useState(8);
  const selected = getAshtottariLord(selectedIndex);
  const total = ASHTOTTARI_LORDS.reduce((sum, lord) => sum + lord.years, 0);

  return (
    <div
      className="w-full"
      data-interactive="ashtottari-explorer"
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
            Conditional dasha reference
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Ashtottari</IAST> 108-year cycle
          </h2>
          <p className="mt-1 max-w-3xl text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
            Explore the eight-period sequence, compare each allotment with Vimshottari, and see why 108 is structurally meaningful.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSelectedIndex(8)}
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Venus contrast
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <AshtottariWheel selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
          </section>

          <section className="rounded-xl p-4" style={{ background: SELECTED_ROW, border: `1.5px solid ${selected.color}45` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Selected period
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {selected.nameIAST} - {selected.years} years
                </h3>
              </div>
              <Devanagari size="lg" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>
            <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
              {selected.contrast}
            </p>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={ink.goldAccent} />
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Eight allotments
                </p>
              </div>
              <p className="m-0 text-sm font-semibold" style={{ color: INK_MUTED, overflowWrap: "anywhere" }}>
                {ashtottariSequenceMnemonic()}
              </p>
            </div>

            <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <div
                className="grid min-w-[680px]"
                style={{
                  gridTemplateColumns: "48px 132px 110px 130px minmax(220px,1fr)",
                  background: SURFACE_2,
                  color: INK_SECONDARY,
                  fontSize: "0.82rem",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {["#", "Planet", "Ashtottari", "Vimshottari", "Contrast"].map((heading) => (
                  <div key={heading} className="px-3 py-2">
                    {heading}
                  </div>
                ))}
              </div>

              {ASHTOTTARI_LORDS.map((lord) => {
                const selectedRow = lord.index === selectedIndex;
                const diff = lord.vimshottariYears == null ? null : lord.years - lord.vimshottariYears;
                return (
                  <button
                    key={lord.index}
                    type="button"
                    onClick={() => setSelectedIndex(lord.index)}
                    className="grid min-w-[680px] text-left"
                    style={{
                      gridTemplateColumns: "48px 132px 110px 130px minmax(220px,1fr)",
                      background: selectedRow ? SELECTED_ROW : SURFACE,
                      borderTop: `1px solid ${TABLE_LINE}`,
                    }}
                  >
                    <div className="px-3 py-3 text-base font-bold" style={{ color: READABLE_GOLD }}>
                      {lord.index}
                    </div>
                    <div className="px-3 py-3">
                      <span className="block text-base font-bold" style={{ color: INK_PRIMARY }}>
                        {lord.nameIAST}
                      </span>
                      <span className="block text-sm" style={{ color: INK_SECONDARY }}>
                        {lord.abbr}
                      </span>
                    </div>
                    <div className="px-3 py-3 text-base font-bold" style={{ color: INK_PRIMARY }}>
                      {lord.years} years
                    </div>
                    <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                      {lord.vimshottariYears} years {diff === 0 ? "(same)" : diff && diff > 0 ? `(+${diff})` : `(${diff})`}
                    </div>
                    <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                      {lord.contrast}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            <section className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 size={17} color={ink.goldAccent} />
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Sum
                </p>
              </div>
              <p className="m-0 text-2xl font-bold" style={{ color: total === ASHTOTTARI_TOTAL_YEARS ? READABLE_GOLD : ink.vermilionAccent }}>
                {ashtottariYearsMnemonic()} = {total}
              </p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Eight allotments return to 108.
              </p>
            </section>

            <section className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Ban size={17} color={ink.vermilionAccent} />
                <p className="m-0 text-sm font-bold uppercase" style={{ color: ink.vermilionAccent, letterSpacing: "0.08em" }}>
                  Ketu test
                </p>
              </div>
              <p className="m-0 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                {OMITTED_KETU?.nameIAST ?? "Ketu"} is omitted
              </p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Ashtottari has eight periods, not nine.
              </p>
            </section>

            <section className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <Hash size={17} color={ink.goldAccent} />
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  108
                </p>
              </div>
              <p className="m-0 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                27 x 4 = 108
              </p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Nakshatras multiplied by their four padas.
              </p>
            </section>
          </div>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <CircleDot size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Structural takeaway
              </p>
            </div>
            <p className="m-0 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
              Ashtottari is not Vimshottari scaled down to 108. It has a different sequence, different allotments,
              and a different planet set. Use it only when its conditions apply.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
