"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, GitCompare, RotateCcw, ShieldCheck, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  CONDITIONAL_CRITERIA,
  DEFAULT_CRITERIA_STATE,
  EMPTY_CRITERIA_STATE,
  type CriteriaKey,
  type CriteriaState,
  getCriterion,
  recommendationSummary,
  selectedCriteria,
  twoYesMode,
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
const ACTIVE_SURFACE = "rgba(245, 252, 240, 0.96)";

function toggleCriteria(state: CriteriaState, key: CriteriaKey): CriteriaState {
  return { ...state, [key]: !state[key] };
}

function CriteriaButton({
  criterion,
  active,
  onToggle,
  onInspect,
}: {
  criterion: (typeof CONDITIONAL_CRITERIA)[number];
  active: boolean;
  onToggle: () => void;
  onInspect: () => void;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: active ? ACTIVE_SURFACE : SURFACE,
        border: `1.5px solid ${active ? criterion.color : HAIRLINE}`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={onInspect} className="min-w-0 flex-1 text-left">
          <p className="m-0 text-sm font-bold uppercase" style={{ color: active ? "#2F7A4F" : READABLE_GOLD, letterSpacing: "0.08em" }}>
            {criterion.conditionType}
          </p>
          <h3 className="mt-1 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {criterion.name}
          </h3>
          <p className="mt-1 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
            {criterion.conditionSummary}
          </p>
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          aria-pressed={active}
          style={{ background: active ? criterion.color : SURFACE_2, border: `1px solid ${active ? criterion.color : HAIRLINE}` }}
        >
          {active ? <CheckCircle2 size={19} color={SURFACE} /> : <CircleDot size={19} color={INK_MUTED} />}
        </button>
      </div>
    </div>
  );
}

function OperationalFlow({ activeCount }: { activeCount: number }) {
  const steps = [
    { label: "Run Vimshottari", state: "always" },
    { label: "Check conditions", state: "always" },
    { label: activeCount > 0 ? `Add ${activeCount} conditional${activeCount === 1 ? "" : "s"}` : "Add none", state: activeCount > 0 ? "active" : "quiet" },
    { label: "Two-yes cross-validate", state: activeCount > 0 ? "active" : "quiet" },
  ];

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-4 flex items-center gap-2">
        <GitCompare size={17} color={ink.goldAccent} />
        <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
          Operational discipline
        </p>
      </div>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const active = step.state !== "quiet";
          return (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                style={{
                  background: active ? "rgba(232, 199, 114, 0.18)" : SURFACE_2,
                  border: `1px solid ${active ? ink.goldAccent : HAIRLINE}`,
                  color: active ? ink.goldAccent : INK_MUTED,
                }}
              >
                {index + 1}
              </div>
              <p className="m-0 flex-1 rounded-xl px-3 py-2 text-base font-semibold" style={{ background: SURFACE_2, color: INK_SECONDARY }}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ConditionalCriteriaChecker() {
  const [state, setState] = useState<CriteriaState>(DEFAULT_CRITERIA_STATE);
  const [inspectedKey, setInspectedKey] = useState<CriteriaKey>("ashtottariRahu");
  const active = selectedCriteria(state);
  const inspected = getCriterion(inspectedKey);

  return (
    <div
      className="w-full"
      data-interactive="conditional-criteria-checker"
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
            Parashara selection routine
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Conditional <IAST>dasha</IAST> criteria checker
          </h2>
          <p className="mt-1 max-w-3xl text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
            Mark which broad chart conditions are verified. Vimshottari stays active; every checked conditional becomes a supplementary cross-validation lens.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setState(DEFAULT_CRITERIA_STATE);
              setInspectedKey("ashtottariRahu");
            }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={16} />
            Example
          </button>
          <button
            type="button"
            onClick={() => setState(EMPTY_CRITERIA_STATE)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Recommendation
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {recommendationSummary(state)}
                </h3>
                <p className="mt-1 text-base" style={{ color: INK_SECONDARY }}>
                  {twoYesMode(state)}
                </p>
              </div>
              <div className="rounded-xl px-4 py-3 text-center" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, minWidth: 128 }}>
                <p className="m-0 text-sm font-bold uppercase" style={{ color: INK_MUTED, letterSpacing: "0.08em" }}>
                  Matches
                </p>
                <p className="m-0 text-3xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
                  {active.length}
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-3 md:grid-cols-2">
            {CONDITIONAL_CRITERIA.map((criterion) => (
              <CriteriaButton
                key={criterion.key}
                criterion={criterion}
                active={state[criterion.key]}
                onInspect={() => setInspectedKey(criterion.key)}
                onToggle={() => {
                  setInspectedKey(criterion.key);
                  setState((current) => toggleCriteria(current, criterion.key));
                }}
              />
            ))}
          </section>
        </div>

        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SELECTED_ROW, border: `1.5px solid ${inspected.color}55` }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                  Inspecting
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {inspected.name}
                </h3>
                <p className="mt-1 text-base font-semibold" style={{ color: INK_SECONDARY }}>
                  {inspected.cycle} - {inspected.chapterCue}
                </p>
              </div>
              <Devanagari size="lg" style={{ color: inspected.color }}>
                {inspected.devanagari}
              </Devanagari>
            </div>
            <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
              {inspected.conditionSummary}
            </p>
            <p className="mt-2 text-base font-semibold" style={{ color: INK_PRIMARY }}>
              {inspected.caution}
            </p>
          </section>

          <OperationalFlow activeCount={active.length} />

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Recension honesty
              </p>
            </div>
            <p className="mt-3 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
              These toggles teach the type of condition. The exact wording varies by text, so a real chart must be checked with the curriculum&apos;s chosen source before a conditional daśā is used.
            </p>
          </section>
        </div>

        <section className="min-w-0 rounded-xl p-4 xl:col-span-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Selection criteria table
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: INK_MUTED }}>
              <ShieldCheck size={15} color={ink.goldAccent} />
              Vimshottari baseline remains active
            </div>
          </div>
          <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div
              className="grid min-w-[940px]"
              style={{
                gridTemplateColumns: "58px 170px 132px 190px minmax(280px,1fr)",
                background: SURFACE_2,
                color: INK_SECONDARY,
                fontSize: "0.82rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {["Run?", "Dasha", "Cycle", "Condition type", "Selection summary"].map((header) => (
                <div key={header} className="px-3 py-2">
                  {header}
                </div>
              ))}
            </div>
            {CONDITIONAL_CRITERIA.map((criterion) => {
              const checked = state[criterion.key];
              return (
                <button
                  key={criterion.key}
                  type="button"
                  onClick={() => {
                    setInspectedKey(criterion.key);
                    setState((current) => toggleCriteria(current, criterion.key));
                  }}
                  className="grid min-w-[940px] text-left"
                  style={{
                    gridTemplateColumns: "58px 170px 132px 190px minmax(280px,1fr)",
                    background: checked ? ACTIVE_SURFACE : SURFACE,
                    borderTop: `1px solid ${TABLE_LINE}`,
                    color: INK_PRIMARY,
                  }}
                >
                  <div className="px-3 py-3">{checked ? <CheckCircle2 size={18} color={criterion.color} /> : <CircleDot size={18} color={INK_MUTED} />}</div>
                  <div className="px-3 py-3">
                    <p className="m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
                      {criterion.name}
                    </p>
                    <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                      {criterion.devanagari}
                    </p>
                  </div>
                  <div className="px-3 py-3 text-base font-semibold">{criterion.cycle}</div>
                  <div className="px-3 py-3 text-base font-semibold">{criterion.conditionType}</div>
                  <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                    {criterion.conditionSummary}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
