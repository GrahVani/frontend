"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, GitBranch, GitCompare, RotateCcw, ShieldCheck, SlidersHorizontal, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import {
  DEFAULT_FRAMEWORK_STATE,
  EMPTY_FRAMEWORK_STATE,
  FRAMEWORK_STEPS,
  OTHER_DECISION_FRAMEWORKS,
  type FrameworkState,
  activeStepIndexes,
  convergenceLabel,
  frameworkStatement,
  selectedSystems,
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
const ACTIVE_SURFACE = "rgba(255, 250, 240, 0.98)";

function StepRail({ state }: { state: FrameworkState }) {
  const active = activeStepIndexes(state);

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-4 flex items-center gap-2">
        <GitBranch size={17} color={ink.goldAccent} />
        <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
          Five-step routine
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-5">
        {FRAMEWORK_STEPS.map((step) => {
          const isActive = active.has(step.index);
          return (
            <div
              key={step.index}
              className="rounded-xl p-4"
              style={{
                background: isActive ? ACTIVE_SURFACE : SURFACE_2,
                border: `1.5px solid ${isActive ? step.color : HAIRLINE}`,
                boxShadow: isActive ? `0 8px 24px ${step.color}18` : "none",
              }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={{ background: isActive ? step.color : SURFACE, color: isActive ? "#FFF9F0" : INK_MUTED }}
                >
                  {step.index}
                </div>
                {isActive ? <CheckCircle2 size={18} color={step.color} /> : <CircleDot size={18} color={INK_MUTED} />}
              </div>
              <h3 className="m-0 text-base font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {step.shortTitle}
              </h3>
              <p className="mt-2 text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
                {step.rule}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ToggleButton({
  active,
  label,
  description,
  onClick,
}: {
  active: boolean;
  label: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="rounded-xl p-4 text-left"
      style={{
        background: active ? "rgba(232, 199, 114, 0.16)" : SURFACE,
        border: `1.5px solid ${active ? ink.goldAccent : HAIRLINE}`,
        color: INK_PRIMARY,
      }}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="text-sm font-bold">{label}</span>
        {active ? <CheckCircle2 size={18} color={ink.goldAccent} /> : <CircleDot size={18} color={INK_MUTED} />}
      </span>
      <span className="mt-2 block text-sm leading-snug" style={{ color: INK_SECONDARY }}>
        {description}
      </span>
    </button>
  );
}

export function DashaDecisionFramework() {
  const [state, setState] = useState<FrameworkState>(DEFAULT_FRAMEWORK_STATE);
  const systems = selectedSystems(state);

  return (
    <div
      className="w-full"
      data-interactive="dasha-decision-framework"
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
            Dasha system selection
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            One five-step <IAST>dasha</IAST> decision framework
          </h2>
          <p className="mt-1 max-w-3xl text-base leading-relaxed" style={{ color: INK_SECONDARY }}>
            Start with Vimshottari, add systems only by condition or training relevance, then apply two-yes convergence.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setState(DEFAULT_FRAMEWORK_STATE)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            <RotateCcw size={16} />
            Mixed example
          </button>
          <button
            type="button"
            onClick={() => setState(EMPTY_FRAMEWORK_STATE)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            Default only
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <StepRail state={state} />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Chart / context switches
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <ToggleButton
                active={state.rahuCondition}
                label="Rahu condition met"
                description="Step 2 adds Ashtottari when the Rahu gate is verified."
                onClick={() => setState((current) => ({ ...current, rahuCondition: !current.rahuCondition }))}
              />
              <ToggleButton
                active={state.jaiminiRelevant}
                label="Jaimini practitioner / trained context"
                description="Step 3 adds Cara/Sthira when the reader is trained in Jaimini logic."
                onClick={() => setState((current) => ({ ...current, jaiminiRelevant: !current.jaiminiRelevant }))}
              />
              <ToggleButton
                active={state.signHouseQuestion}
                label="Sign or house question"
                description="A sign/house emphasis can make Jaimini dashas relevant."
                onClick={() => setState((current) => ({ ...current, signHouseQuestion: !current.signHouseQuestion }))}
              />
              <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold" style={{ color: INK_PRIMARY }}>
                    BPHS 51-58 conditional matches
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    value={state.conditionalMatches}
                    onChange={(event) => setState((current) => ({ ...current, conditionalMatches: Number(event.target.value) }))}
                    className="w-full"
                    style={{ accentColor: ink.goldAccent }}
                  />
                </label>
                <p className="mt-2 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                  {state.conditionalMatches} matching condition{state.conditionalMatches === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <GitCompare size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Two-yes result
              </p>
            </div>
            <div className="mt-4 space-y-2">
              {(["aligned", "mixed", "unknown"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setState((current) => ({ ...current, convergence: mode }))}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold"
                  style={{
                    background: state.convergence === mode ? "rgba(232, 199, 114, 0.16)" : SURFACE_2,
                    border: `1px solid ${state.convergence === mode ? ink.goldAccent : HAIRLINE}`,
                    color: INK_SECONDARY,
                  }}
                >
                  <span>{mode === "aligned" ? "Systems align" : mode === "mixed" ? "Systems diverge" : "Not checked yet"}</span>
                  {state.convergence === mode ? <CheckCircle2 size={17} color={ink.goldAccent} /> : null}
                </button>
              ))}
            </div>
            <p className="mt-4 rounded-xl p-3 text-sm font-semibold" style={{ background: SURFACE_2, color: INK_PRIMARY }}>
              {convergenceLabel(state)}
            </p>
          </section>
        </div>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
                Framework output
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: INK_MUTED }}>
              <ShieldCheck size={15} color={ink.goldAccent} />
              {systems.length} selected system{systems.length === 1 ? "" : "s"}
            </div>
          </div>
          <p className="mb-4 rounded-xl p-3 text-base font-semibold leading-relaxed" style={{ background: SURFACE_2, color: INK_PRIMARY }}>
            {frameworkStatement(state)}
          </p>
          <div className="max-w-full overflow-x-auto overflow-y-hidden rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <div
              className="grid min-w-[760px]"
              style={{
                gridTemplateColumns: "64px 180px 220px minmax(280px,1fr)",
                background: SURFACE_2,
                color: INK_SECONDARY,
                fontSize: "0.82rem",
                fontWeight: 900,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {["Step", "System", "Why selected", "Reading discipline"].map((header) => (
                <div key={header} className="px-3 py-2">
                  {header}
                </div>
              ))}
            </div>
            {[
              { step: 1, system: "Vimshottari", why: "Conditionless default", discipline: "Always baseline the reading here." },
              ...(state.rahuCondition
                ? [{ step: 2, system: "Ashtottari", why: "Rahu condition met", discipline: "Cross-check, never replace Vimshottari." }]
                : []),
              ...(state.jaiminiRelevant || state.signHouseQuestion
                ? [{ step: 3, system: "Cara / Sthira", why: "Jaimini relevance marked", discipline: "Use only if trained in the Jaimini method." }]
                : []),
              ...(state.conditionalMatches > 0
                ? [{ step: 4, system: `${state.conditionalMatches} BPHS conditionals`, why: "Selection condition(s) met", discipline: "Add each qualified conditional transparently." }]
                : []),
            ].map((row) => {
              return (
                <div
                  key={`${row.step}-${row.system}`}
                  className="grid min-w-[760px]"
                  style={{
                    gridTemplateColumns: "64px 180px 220px minmax(280px,1fr)",
                    background: SELECTED_ROW,
                    borderTop: `1px solid ${TABLE_LINE}`,
                  }}
                >
                  <div className="px-3 py-3 text-base font-bold" style={{ color: READABLE_GOLD }}>
                    {row.step}
                  </div>
                  <div className="px-3 py-3 text-base font-bold" style={{ color: INK_PRIMARY }}>
                    {row.system}
                  </div>
                  <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                    {row.why}
                  </div>
                  <div className="px-3 py-3 text-base" style={{ color: INK_SECONDARY }}>
                    {row.discipline}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm font-bold uppercase" style={{ color: READABLE_GOLD, letterSpacing: "0.08em" }}>
            Recurring curriculum pattern
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-5">
            {OTHER_DECISION_FRAMEWORKS.map((name, index) => (
              <div
                key={name}
                className="rounded-xl p-3"
                style={{ background: index === 4 ? "rgba(232, 199, 114, 0.16)" : SURFACE_2, border: `1px solid ${index === 4 ? ink.goldAccent : HAIRLINE}` }}
              >
                <p className="m-0 text-sm font-bold uppercase" style={{ color: index === 4 ? READABLE_GOLD : INK_MUTED, letterSpacing: "0.06em" }}>
                  Framework {index + 1}
                </p>
                <p className="mt-1 text-base font-semibold" style={{ color: INK_SECONDARY }}>
                  {name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
