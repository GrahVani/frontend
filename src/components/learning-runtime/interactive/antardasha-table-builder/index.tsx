"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ListOrdered, MapPinned, RotateCcw, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST, Devanagari } from "../../chrome/typography";
import { DASHA_LORDS, SEQUENCE_MNEMONIC } from "../dasha-timeline/data";
import {
  ANTARDASHA_PRESETS,
  addYearsAsDays,
  buildAntardashaRows,
  formatDate,
  formatShortNumber,
  formatYearsMonthsDays,
  getLordByIndex,
  sumAntardashaRows,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

export function AntardashaTableBuilder() {
  const [mdLordIndex, setMdLordIndex] = useState(3);
  const [mdYears, setMdYears] = useState(6);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [selectedRowNumber, setSelectedRowNumber] = useState(1);

  const mdLord = getLordByIndex(mdLordIndex);
  const rows = useMemo(() => buildAntardashaRows(mdLordIndex, mdYears, startDate), [mdLordIndex, mdYears, startDate]);
  const selectedRow = rows.find((row) => row.sequenceNumber === selectedRowNumber) ?? rows[0];
  const total = sumAntardashaRows(rows);
  const mdEndDate = addYearsAsDays(new Date(`${startDate}T00:00:00`), mdYears);
  const finalRow = rows[rows.length - 1];
  const sumMatches = Math.abs(total - mdYears) < 0.000001;
  const dateMatches = finalRow ? finalRow.endDate.toDateString() === mdEndDate.toDateString() : false;

  const applyPreset = (slug: string) => {
    const preset = ANTARDASHA_PRESETS.find((item) => item.slug === slug);
    if (!preset) return;
    setMdLordIndex(preset.mdLordIndex);
    setMdYears(preset.mdYears);
    setStartDate(preset.startDate);
    setSelectedRowNumber(1);
  };

  return (
    <div
      className="w-full"
      data-interactive="antardasha-table-builder"
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
            Four-step table builder
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Constructing an <IAST>Antardasha</IAST> ledger
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose the mahadasha lord and start date, then stack the nine bhuktis in order. Each row&apos;s end
            becomes the next row&apos;s start.
          </p>
        </div>

        <button
          type="button"
          onClick={() => applyPreset("sun-md")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Sun example
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <MapPinned size={17} color={ink.goldAccent} />
              <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Step 1 and 2
              </p>
            </div>

            <label className="block">
              <span className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                Locate MD lord
              </span>
              <select
                value={mdLordIndex}
                onChange={(event) => {
                  setMdLordIndex(Number(event.target.value));
                  setSelectedRowNumber(1);
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
                MD length
              </span>
              <input
                type="number"
                min={0.01}
                max={25}
                step={0.001}
                value={mdYears}
                onChange={(event) => setMdYears(Math.max(0.01, Number(event.target.value)))}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </label>

            <label className="mt-3 block">
              <span className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                MD start date
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              />
            </label>

            <div className="mt-3 rounded-lg p-3" style={{ background: mdLord.colorTint, border: `1px solid ${mdLord.color}40` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: mdLord.color, letterSpacing: "0.08em" }}>
                    Sequence starts here
                  </p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    {rows.map((row) => row.lord.abbr).join(" -> ")}
                  </p>
                </div>
                <Devanagari size="lg" style={{ color: mdLord.color }}>
                  {mdLord.devanagari}
                </Devanagari>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ListOrdered size={17} color={grahas.budha.primary} />
              <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Worked presets
              </p>
            </div>
            <div className="grid gap-2">
              {ANTARDASHA_PRESETS.map((preset) => (
                <button
                  key={preset.slug}
                  type="button"
                  onClick={() => applyPreset(preset.slug)}
                  className="rounded-lg p-3 text-left"
                  style={{
                    background: preset.mdLordIndex === mdLordIndex && Math.abs(preset.mdYears - mdYears) < 0.001 ? getLordByIndex(preset.mdLordIndex).colorTint : SURFACE_2,
                    border: `1px solid ${HAIRLINE}`,
                    color: INK_SECONDARY,
                  }}
                >
                  <span className="block text-sm font-bold" style={{ color: getLordByIndex(preset.mdLordIndex).color }}>
                    {preset.label}
                  </span>
                  <span className="mt-1 block text-xs" style={{ color: INK_MUTED }}>
                    {preset.note}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: selectedRow.lord.colorTint, border: `1.5px solid ${selectedRow.lord.color}45` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedRow.lord.color, letterSpacing: "0.08em" }}>
              Selected bhukti
            </p>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {mdLord.nameIAST}-{selectedRow.lord.nameIAST}
            </h3>
            <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(255,255,255,0.56)", border: "1px solid rgba(255,255,255,0.62)" }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-mono), monospace" }}>
                {selectedRow.formula} = {formatShortNumber(selectedRow.years)} yr
              </p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Runs {formatDate(selectedRow.startDate)} to {formatDate(selectedRow.endDate)}.
              </p>
            </div>
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={ink.goldAccent} />
                <p style={{ margin: 0, color: ink.goldAccent, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Step 3 and 4: compute and stack
                </p>
              </div>
              <p className="m-0 text-xs font-semibold" style={{ color: INK_MUTED, overflowWrap: "anywhere" }}>
                {SEQUENCE_MNEMONIC}, rotated to {mdLord.abbr}
              </p>
            </div>

            <div
              className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl"
              style={{ border: `1px solid ${HAIRLINE}` }}
            >
              <div
                className="grid min-w-[850px]"
                style={{
                  gridTemplateColumns: "52px 132px 150px 110px 150px 150px 105px",
                  background: SURFACE_2,
                  color: INK_MUTED,
                  fontSize: "0.72rem",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {["#", "Bhukti", "Formula", "Length", "Start", "End", "Running"].map((heading) => (
                  <div key={heading} className="px-3 py-2">
                    {heading}
                  </div>
                ))}
              </div>

              {rows.map((row) => {
                const selected = selectedRow.sequenceNumber === row.sequenceNumber;
                return (
                  <button
                    key={row.sequenceNumber}
                    type="button"
                    onClick={() => setSelectedRowNumber(row.sequenceNumber)}
                    className="grid min-w-[850px] text-left"
                    style={{
                      gridTemplateColumns: "52px 132px 150px 110px 150px 150px 105px",
                      background: selected ? row.lord.colorTint : SURFACE,
                      borderTop: `1px solid ${HAIRLINE}`,
                      color: INK_PRIMARY,
                    }}
                  >
                    <div className="px-3 py-3 text-sm font-bold" style={{ color: row.lord.color }}>
                      {row.sequenceNumber}
                    </div>
                    <div className="px-3 py-3">
                      <span className="block text-sm font-bold" style={{ color: row.lord.color }}>
                        {mdLord.abbr}-{row.lord.abbr}
                      </span>
                      <span className="block text-xs" style={{ color: INK_MUTED }}>
                        {row.lord.nameIAST}
                      </span>
                    </div>
                    <div className="px-3 py-3 text-sm font-semibold" style={{ color: INK_SECONDARY, fontFamily: "var(--font-mono), monospace" }}>
                      {row.formula}
                    </div>
                    <div className="px-3 py-3 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                      {formatYearsMonthsDays(row.years)}
                    </div>
                    <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                      {formatDate(row.startDate)}
                    </div>
                    <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                      {formatDate(row.endDate)}
                    </div>
                    <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                      {formatShortNumber(row.endOffsetYears)} yr
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="rounded-xl p-4"
            style={{
              background: sumMatches && dateMatches ? grahas.budha.secondaryTint : `${ink.vermilionAccent}10`,
              border: `1.5px solid ${sumMatches && dateMatches ? grahas.budha.primary : ink.vermilionAccent}55`,
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={22} color={sumMatches && dateMatches ? grahas.budha.primary : ink.vermilionAccent} />
                <div>
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: sumMatches && dateMatches ? grahas.budha.primary : ink.vermilionAccent, letterSpacing: "0.08em" }}>
                    Table verification
                  </p>
                  <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                    Nine bhuktis sum to <strong>{formatShortNumber(total)} years</strong>. The final row ends on{" "}
                    <strong>{finalRow ? formatDate(finalRow.endDate) : "n/a"}</strong>; MD end is{" "}
                    <strong>{formatDate(mdEndDate)}</strong>.
                  </p>
                </div>
              </div>
              <div className="rounded-lg px-4 py-3 text-center" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Difference
                </p>
                <p className="m-0 text-xl font-bold" style={{ color: sumMatches ? grahas.budha.primary : ink.vermilionAccent }}>
                  {Math.abs(total - mdYears).toFixed(8)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <CalendarDays size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Ledger rule
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              The construction is a ledger: compute each duration, then chain it. If one date is wrong,
              every later bhukti inherits the error.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
