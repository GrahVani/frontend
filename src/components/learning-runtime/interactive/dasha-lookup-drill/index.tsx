"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Gauge, ListChecks, RotateCcw, Search, ShieldCheck, XCircle } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST, Devanagari } from "../../chrome/typography";
import { DASHA_LORDS, type DashaLord } from "../dasha-timeline/data";
import {
  LOOKUP_SCENARIOS,
  ageFromParts,
  computeLookup,
  formatAge,
  formatAgeSpan,
  isSameLord,
  type LookupRow,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function LordPicker({
  label,
  selected,
  correct,
  checked,
  onSelect,
}: {
  label: string;
  selected: DashaLord | null;
  correct: DashaLord;
  checked: boolean;
  onSelect: (lord: DashaLord) => void;
}) {
  const correctSelected = checked && isSameLord(selected, correct);
  const wrongSelected = checked && selected && !isSameLord(selected, correct);

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
          {label}
        </p>
        {checked &&
          (correctSelected ? (
            <CheckCircle2 size={18} color={grahas.budha.primary} />
          ) : (
            <XCircle size={18} color={ink.vermilionAccent} />
          ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DASHA_LORDS.map((lord) => {
          const active = selected?.index === lord.index;
          const reveal = checked && lord.index === correct.index;
          return (
            <button
              key={lord.index}
              type="button"
              onClick={() => onSelect(lord)}
              className="rounded-lg p-2 text-left"
              style={{
                background: active || reveal ? lord.colorTint : SURFACE_2,
                border: `1.5px solid ${active ? lord.color : reveal ? grahas.budha.primary : HAIRLINE}`,
                minHeight: 62,
              }}
            >
              <span className="block text-sm font-bold" style={{ color: lord.color }}>
                {lord.abbr}
              </span>
              <span className="block text-xs" style={{ color: INK_SECONDARY }}>
                {lord.nameIAST}
              </span>
            </button>
          );
        })}
      </div>
      {wrongSelected && (
        <p className="mt-3 text-sm font-semibold" style={{ color: ink.vermilionAccent }}>
          Correct: {correct.nameIAST}
        </p>
      )}
    </section>
  );
}

function LookupTable({
  title,
  rows,
  active,
  reveal,
}: {
  title: string;
  rows: LookupRow[];
  active: LookupRow;
  reveal: boolean;
}) {
  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <p className="mb-3 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
        {title}
      </p>
      <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
        <div
          className="grid min-w-[520px]"
          style={{
            gridTemplateColumns: "48px 130px 150px 100px",
            background: SURFACE_2,
            color: INK_MUTED,
            fontSize: "0.72rem",
            fontWeight: 900,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {["#", "Lord", "Age span", "Length"].map((heading) => (
            <div key={heading} className="px-3 py-2">
              {heading}
            </div>
          ))}
        </div>

        {rows.map((row) => {
          const activeRow = reveal && row.lord.index === active.lord.index && row.startAge === active.startAge;
          return (
            <div
              key={`${title}-${row.sequenceNumber}-${row.lord.index}`}
              className="grid min-w-[520px]"
              style={{
                gridTemplateColumns: "48px 130px 150px 100px",
                background: activeRow ? row.lord.colorTint : SURFACE,
                borderTop: `1px solid ${HAIRLINE}`,
              }}
            >
              <div className="px-3 py-3 text-sm font-bold" style={{ color: row.lord.color }}>
                {row.sequenceNumber}
              </div>
              <div className="px-3 py-3">
                <span className="block text-sm font-bold" style={{ color: row.lord.color }}>
                  {row.lord.nameIAST}
                </span>
                <span className="block text-xs" style={{ color: INK_MUTED }}>
                  {row.lord.abbr}
                </span>
              </div>
              <div className="px-3 py-3 text-sm" style={{ color: INK_SECONDARY }}>
                {formatAgeSpan(row)}
              </div>
              <div className="px-3 py-3 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                {formatAge(row.years)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DashaLookupDrill() {
  const [ageYears, setAgeYears] = useState(25);
  const [ageMonths, setAgeMonths] = useState(4);
  const [selectedMd, setSelectedMd] = useState<DashaLord | null>(null);
  const [selectedAd, setSelectedAd] = useState<DashaLord | null>(null);
  const [selectedPd, setSelectedPd] = useState<DashaLord | null>(null);
  const [checked, setChecked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const age = useMemo(() => ageFromParts(ageYears, ageMonths), [ageYears, ageMonths]);
  const lookup = useMemo(() => computeLookup(age), [age]);
  const allCorrect =
    isSameLord(selectedMd, lookup.md.lord) &&
    isSameLord(selectedAd, lookup.ad.lord) &&
    isSameLord(selectedPd, lookup.pd.lord);

  const resetAnswers = () => {
    setSelectedMd(null);
    setSelectedAd(null);
    setSelectedPd(null);
    setChecked(false);
  };

  const applyScenario = (slug: string) => {
    const scenario = LOOKUP_SCENARIOS.find((item) => item.slug === slug);
    if (!scenario) return;
    setAgeYears(scenario.ageYears);
    setAgeMonths(scenario.ageMonths);
    resetAnswers();
  };

  return (
    <div
      className="w-full"
      data-interactive="dasha-lookup-drill"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Lookup fluency drill
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Reading a <IAST>dasha</IAST> table level by level
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Convert age, find the covering mahadasha, zoom into its bhukti, then zoom again into the PD.
          </p>
        </div>
        <button
          type="button"
          onClick={() => applyScenario("worked-example")}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Worked example
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Gauge size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Age from birth
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Years
                </span>
                <input
                  type="number"
                  min={0}
                  max={119}
                  value={ageYears}
                  onChange={(event) => {
                    setAgeYears(Math.max(0, Number(event.target.value)));
                    resetAnswers();
                  }}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.06em" }}>
                  Months
                </span>
                <input
                  type="number"
                  min={0}
                  max={11}
                  value={ageMonths}
                  onChange={(event) => {
                    setAgeMonths(Math.max(0, Math.min(11, Number(event.target.value))));
                    resetAnswers();
                  }}
                  className="mt-1 w-full rounded-lg px-3 py-2 text-sm"
                  style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
                />
              </label>
            </div>
            <div className="mt-3 rounded-lg p-3" style={{ background: grahas.candra.secondaryTint, border: `1px solid ${grahas.candra.primary}40` }}>
              <p className="m-0 text-sm font-semibold" style={{ color: INK_PRIMARY }}>
                {ageYears}y {ageMonths}m = {age.toFixed(2)} years
              </p>
              <p className="mt-1 text-xs" style={{ color: INK_MUTED }}>
                Months divide by 12, not by 10.
              </p>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Search size={17} color={grahas.budha.primary} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Practice scenarios
              </p>
            </div>
            <div className="grid gap-2">
              {LOOKUP_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.slug}
                  type="button"
                  onClick={() => applyScenario(scenario.slug)}
                  className="rounded-lg p-3 text-left"
                  style={{ background: ageYears === scenario.ageYears && ageMonths === scenario.ageMonths ? grahas.budha.secondaryTint : SURFACE_2, border: `1px solid ${HAIRLINE}` }}
                >
                  <span className="block text-sm font-bold" style={{ color: INK_PRIMARY }}>
                    {scenario.label}
                  </span>
                  <span className="mt-1 block text-xs" style={{ color: INK_MUTED }}>
                    {scenario.note}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <LordPicker label="Step 2: Active MD" selected={selectedMd} correct={lookup.md.lord} checked={checked} onSelect={setSelectedMd} />
          <LordPicker label="Step 3: Active AD" selected={selectedAd} correct={lookup.ad.lord} checked={checked} onSelect={setSelectedAd} />
          <LordPicker label="Step 4: Active PD" selected={selectedPd} correct={lookup.pd.lord} checked={checked} onSelect={setSelectedPd} />

          <section
            className="rounded-xl p-4"
            style={{
              background: checked ? (allCorrect ? grahas.budha.secondaryTint : `${ink.vermilionAccent}10`) : SURFACE,
              border: `1.5px solid ${checked ? (allCorrect ? grahas.budha.primary : ink.vermilionAccent) : HAIRLINE}`,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setChecked(true);
                setAttempts((value) => value + 1);
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold"
              style={{ background: checked && allCorrect ? grahas.budha.primary : ink.goldAccent, color: "#fff", border: "none" }}
            >
              <ListChecks size={16} />
              Check lookup
            </button>
            {checked && (
              <p className="mt-3 text-sm font-semibold" style={{ color: allCorrect ? grahas.budha.primary : ink.vermilionAccent }}>
                {allCorrect
                  ? `Confirmed in ${attempts} attempt${attempts === 1 ? "" : "s"}: ${lookup.md.lord.nameIAST} / ${lookup.ad.lord.nameIAST} / ${lookup.pd.lord.nameIAST}.`
                  : `Engine confirms: ${lookup.md.lord.nameIAST} / ${lookup.ad.lord.nameIAST} / ${lookup.pd.lord.nameIAST}.`}
              </p>
            )}
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: lookup.md.lord.colorTint, border: `1.5px solid ${lookup.md.lord.color}45` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: lookup.md.lord.color, letterSpacing: "0.08em" }}>
                  Engine confirmation
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {checked ? `${lookup.md.lord.nameIAST} / ${lookup.ad.lord.nameIAST} / ${lookup.pd.lord.nameIAST}` : "Check your hand lookup"}
                </h3>
              </div>
              <Devanagari size="lg" style={{ color: lookup.md.lord.color }}>
                {lookup.md.lord.devanagari}
              </Devanagari>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              The drill uses the lesson&apos;s Ketu balance of 3.5 years. The first MD is partial; all later MDs are full periods.
            </p>
          </section>

          <LookupTable title="Mahadasha lookup" rows={lookup.mdRows.slice(0, 6)} active={lookup.md} reveal={checked} />
          <LookupTable title={`${lookup.md.lord.nameIAST} antardasha lookup`} rows={lookup.adRows} active={lookup.ad} reveal={checked} />
          <LookupTable title={`${lookup.md.lord.nameIAST}-${lookup.ad.lord.nameIAST} pratyantardasha lookup`} rows={lookup.pdRows} active={lookup.pd} reveal={checked} />

          <section className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Lookup discipline
              </p>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Ask the same question at every level: which span covers the target age? Do not jump from MD to PD.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
