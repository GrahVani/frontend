"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Equal, FunctionSquare, RotateCcw, Sigma, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST, Devanagari } from "../../chrome/typography";
import { DASHA_LORDS, SEQUENCE_MNEMONIC, TOTAL_CYCLE_YEARS, YEARS_MNEMONIC } from "../dasha-timeline/data";
import {
  RATIO_PRESETS,
  computeRatioSubPeriods,
  formatDecimalYears,
  formatYearsMonthsDays,
  getLordByIndex,
  sumSubPeriods,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

export function VimshottariRatioCalculator() {
  const [parentLordIndex, setParentLordIndex] = useState(8);
  const [parentYears, setParentYears] = useState(19);
  const [selectedSubLordIndex, setSelectedSubLordIndex] = useState(8);

  const parentLord = getLordByIndex(parentLordIndex);
  const subPeriods = useMemo(() => computeRatioSubPeriods(parentLordIndex, parentYears), [parentLordIndex, parentYears]);
  const selectedSubPeriod =
    subPeriods.find((subPeriod) => subPeriod.lord.index === selectedSubLordIndex) ?? subPeriods[0];
  const total = sumSubPeriods(subPeriods);
  const sumDifference = Math.abs(total - parentYears);
  const ketu = subPeriods.find((subPeriod) => subPeriod.lord.name === "Ketu");
  const mars = subPeriods.find((subPeriod) => subPeriod.lord.name === "Mars");

  const applyPreset = (slug: string) => {
    const preset = RATIO_PRESETS.find((item) => item.slug === slug);
    if (!preset) return;
    setParentLordIndex(preset.parentLordIndex);
    setParentYears(Number(preset.parentYears.toFixed(4)));
    setSelectedSubLordIndex(preset.parentLordIndex);
  };

  return (
    <div
      className="w-full"
      data-interactive="vimshottari-ratio-calculator"
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
          <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Formula lab
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Vimshottari</IAST> recursive ratio calculator
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Build the nine sub-periods from any parent: parent period multiplied by the sub-lord years,
            divided by 120. The running total must return to the parent.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setParentLordIndex(8);
            setParentYears(19);
            setSelectedSubLordIndex(8);
          }}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Saturn example
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <FunctionSquare size={17} color={ink.goldAccent} />
              <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Parent period
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                Parent lord
              </span>
              <select
                value={parentLordIndex}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  setParentLordIndex(next);
                  setSelectedSubLordIndex(next);
                }}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {DASHA_LORDS.map((lord) => (
                  <option key={lord.index} value={lord.index}>
                    {lord.nameIAST} ({lord.abbr}) - {lord.years} years
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-3 block">
              <span className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                Parent length in years
              </span>
              <input
                type="number"
                min={0.01}
                max={25}
                step={0.001}
                value={parentYears}
                onChange={(event) => setParentYears(Math.max(0.01, Number(event.target.value)))}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </label>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {RATIO_PRESETS.map((preset) => (
                <button
                  key={preset.slug}
                  type="button"
                  onClick={() => applyPreset(preset.slug)}
                  className="rounded-lg p-2 text-left text-xs font-semibold"
                  style={{
                    background: preset.parentLordIndex === parentLordIndex && Math.abs(preset.parentYears - parentYears) < 0.001 ? parentLord.colorTint : SURFACE_2,
                    border: `1px solid ${HAIRLINE}`,
                    color: INK_SECONDARY,
                    minHeight: 58,
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: parentLord.colorTint, border: `1.5px solid ${parentLord.color}45` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase" style={{ color: parentLord.color, letterSpacing: "0.08em" }}>
                  Current formula
                </p>
                <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {parentLord.nameIAST} parent
                </h3>
              </div>
              <Devanagari size="lg" style={{ color: parentLord.color }}>
                {parentLord.devanagari}
              </Devanagari>
            </div>

            <div className="mt-4 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.62)" }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-mono), monospace" }}>
                ({parentYears} x {selectedSubPeriod.lord.years}) / {TOTAL_CYCLE_YEARS}
              </p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selectedSubPeriod.lord.nameIAST} receives {selectedSubPeriod.percentOfParent.toFixed(2)}% of the parent,
                so this sub-period is <strong>{formatYearsMonthsDays(selectedSubPeriod.years)}</strong>.
              </p>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Equal size={17} color={grahas.mangala.primary} />
              <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Equal lord-years
              </p>
            </div>
            <p className="text-sm" style={{ color: INK_SECONDARY }}>
              Mars and Ketu both have 7 years in the 120-year cycle, so they always produce equal sub-periods
              inside the same parent.
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[ketu, mars].map((subPeriod) =>
                subPeriod ? (
                  <button
                    key={subPeriod.lord.index}
                    type="button"
                    onClick={() => setSelectedSubLordIndex(subPeriod.lord.index)}
                    className="rounded-lg p-3 text-left"
                    style={{ background: subPeriod.lord.colorTint, border: `1px solid ${subPeriod.lord.color}40` }}
                  >
                    <span className="block text-sm font-bold" style={{ color: subPeriod.lord.color }}>
                      {subPeriod.lord.nameIAST}
                    </span>
                    <span className="block text-xs" style={{ color: INK_SECONDARY }}>
                      {formatYearsMonthsDays(subPeriod.years)}
                    </span>
                  </button>
                ) : null
              )}
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={ink.goldAccent} />
                <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Rotated sub-period table
                </p>
              </div>
              <p className="m-0 text-xs font-semibold" style={{ color: INK_MUTED }}>
                Order: {subPeriods.map((subPeriod) => subPeriod.lord.abbr).join(" -> ")}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: "56px minmax(128px,1fr) minmax(150px,1fr) minmax(104px,0.7fr) minmax(110px,0.7fr)",
                  background: SURFACE_2,
                  color: INK_MUTED,
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {["#", "Sub-lord", "Formula", "Length", "Running"].map((heading) => (
                  <div key={heading} className="px-3 py-2">
                    {heading}
                  </div>
                ))}
              </div>

              {subPeriods.map((subPeriod) => {
                const selected = selectedSubLordIndex === subPeriod.lord.index;

                return (
                  <button
                    key={subPeriod.lord.index}
                    type="button"
                    onClick={() => setSelectedSubLordIndex(subPeriod.lord.index)}
                    className="grid w-full text-left"
                    style={{
                      gridTemplateColumns: "56px minmax(128px,1fr) minmax(150px,1fr) minmax(104px,0.7fr) minmax(110px,0.7fr)",
                      background: selected ? subPeriod.lord.colorTint : SURFACE,
                      borderTop: `1px solid ${HAIRLINE}`,
                      color: INK_PRIMARY,
                    }}
                  >
                    <div className="px-3 py-3 text-sm font-bold" style={{ color: subPeriod.lord.color }}>
                      {subPeriod.sequenceNumber}
                    </div>
                    <div className="px-3 py-3">
                      <span className="block text-sm font-bold" style={{ color: subPeriod.lord.color }}>
                        {subPeriod.lord.nameIAST}
                      </span>
                      <span className="block text-xs" style={{ color: INK_MUTED }}>
                        {subPeriod.lord.years} of 120 years
                      </span>
                    </div>
                    <div className="px-3 py-3 text-sm font-semibold" style={{ color: INK_SECONDARY, fontFamily: "var(--font-mono), monospace" }}>
                      ({parentYears} x {subPeriod.lord.years}) / 120 = {formatDecimalYears(subPeriod.years)}
                    </div>
                    <div className="px-3 py-3 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                      {formatYearsMonthsDays(subPeriod.years)}
                    </div>
                    <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                      {formatDecimalYears(subPeriod.endYears)}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: sumDifference < 0.000001 ? grahas.budha.secondaryTint : `${ink.vermilionAccent}10`, border: `1.5px solid ${sumDifference < 0.000001 ? grahas.budha.primary : ink.vermilionAccent}55` }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                {sumDifference < 0.000001 ? (
                  <CheckCircle2 size={22} color={grahas.budha.primary} />
                ) : (
                  <Sigma size={22} color={ink.vermilionAccent} />
                )}
                <div>
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: sumDifference < 0.000001 ? grahas.budha.primary : ink.vermilionAccent, letterSpacing: "0.08em" }}>
                    Sum-to-parent check
                  </p>
                  <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                    The nine sub-periods add to <strong>{formatDecimalYears(total)}</strong>; parent is{" "}
                    <strong>{formatDecimalYears(parentYears)}</strong>.
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-4 py-3 text-center" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Difference
                </p>
                <p className="m-0 text-xl font-bold" style={{ color: sumDifference < 0.000001 ? grahas.budha.primary : ink.vermilionAccent }}>
                  {sumDifference.toFixed(8)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Memorise the invariant
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              <span>{SEQUENCE_MNEMONIC}</span>
              <span style={{ color: INK_MUTED }}>|</span>
              <span>{YEARS_MNEMONIC}</span>
              <span style={{ color: INK_MUTED }}>|</span>
              <span>divide by 120 every time</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
