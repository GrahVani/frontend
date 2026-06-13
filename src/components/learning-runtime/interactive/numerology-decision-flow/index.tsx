"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, GitBranch, HelpCircle, PauseCircle, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import {
  APPLY_CONTEXTS,
  DEFER_TRIGGERS,
  REFUSE_TRIGGERS,
  SCENARIOS,
  evaluateDecision,
  outcomeCopy,
  type ContextKey,
  type DecisionOutcome,
  type DecisionState,
  type DeferKey,
  type RefuseKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;
const NEUTRAL = "#5A4E2E";

const toneColors = {
  support: GREEN,
  danger: VERMILION,
  defer: BLUE,
  neutral: NEUTRAL,
};

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function outcomeColor(outcome: DecisionOutcome) {
  return toneColors[outcomeCopy(outcome).tone];
}

function toggleItem<T extends string>(items: T[], key: T): T[] {
  return items.includes(key) ? items.filter((item) => item !== key) : [...items, key];
}

function FlowSvg({ state, outcome }: { state: DecisionState; outcome: DecisionOutcome }) {
  const steps = [
    { id: "apply", label: "Apply?", value: state.contexts.length > 0, x: 128 },
    { id: "refuse", label: "Refuse?", value: state.refuses.length > 0, x: 316 },
    { id: "defer", label: "Defer?", value: state.defers.length > 0, x: 504 },
    { id: "mode", label: "Mode", value: outcome === "mode1" || outcome === "mode2", x: 660 },
  ];
  const activeColor = outcomeColor(outcome);
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 300" className="h-auto w-full min-w-0" role="img" aria-label="Numerology decision flow">
        <rect x="20" y="20" width="720" height="260" rx="22" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          APPLY, REFUSE, DEFER, THEN MODE
        </text>
        <path d="M128 142 H660" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
        {steps.map((step, index) => {
          const color = step.id === "apply" && !step.value ? NEUTRAL : step.id === "refuse" && step.value ? VERMILION : step.id === "defer" && step.value ? BLUE : step.value ? GREEN : GOLD;
          const label = step.id === "refuse" || step.id === "defer" ? (step.value ? "YES" : "NO") : step.value ? "YES" : "NO";
          return (
            <g key={step.id}>
              <circle cx={step.x} cy="142" r="46" fill={wash(color, "12")} stroke={color} strokeWidth="3" />
              <text x={step.x} y="130" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{step.label}</text>
              <text x={step.x} y="158" textAnchor="middle" fill={color} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{index === 3 ? outcomeCopy(outcome).label : label}</text>
            </g>
          );
        })}
        <rect x="174" y="218" width="412" height="38" rx="19" fill={SURFACE} stroke={activeColor} />
        <text x="380" y="243" textAnchor="middle" fill={activeColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Numerology is a contribution, never a cause: no fear, no guarantee.
        </text>
      </svg>
    </section>
  );
}

function TriggerButton({ active, label, detail, color, onClick }: { active: boolean; label: string; detail: string; color: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="min-w-0 rounded-xl p-3 text-left" style={{ background: active ? wash(color, "12") : SURFACE, border: `1px solid ${active ? color : HAIRLINE}` }}>
      <span className="flex items-start justify-between gap-2">
        <span className="text-sm font-bold" style={{ color: active ? color : INK_PRIMARY }}>{label}</span>
        {active ? <CheckCircle2 size={17} color={color} /> : <HelpCircle size={17} color={GOLD} />}
      </span>
      <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{detail}</span>
    </button>
  );
}

export function NumerologyDecisionFlow() {
  const firstScenario = SCENARIOS[0];
  const [state, setState] = useState<DecisionState>(firstScenario.state);
  const outcome = useMemo(() => evaluateDecision(state), [state]);
  const copy = outcomeCopy(outcome);
  const color = outcomeColor(outcome);

  const loadScenario = (id: string) => {
    const scenario = SCENARIOS.find((item) => item.id === id) ?? firstScenario;
    setState({
      contexts: [...scenario.state.contexts],
      refuses: [...scenario.state.refuses],
      defers: [...scenario.state.defers],
      bookedWithChart: scenario.state.bookedWithChart,
    });
  };

  const reset = () => loadScenario(firstScenario.id);

  return (
    <div
      className="w-full min-w-0"
      data-interactive="numerology-decision-flow"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Numerology decision framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Decide when to apply, defer, or refuse
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Walk any numerology moment through the three gates, then choose the authorised Tier-1 consultation mode.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Monday case
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-5">
        {SCENARIOS.map((scenario) => (
          <button key={scenario.id} type="button" onClick={() => loadScenario(scenario.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <span className="block text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.label}</span>
            <span className="mt-2 block text-xs" style={{ color: INK_SECONDARY }}>{scenario.situation}</span>
          </button>
        ))}
      </section>

      <section className="mb-4 grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <FlowSvg state={state} outcome={outcome} />
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "12"), border: `1px solid ${color}` }}>
          <div className="mb-2 flex items-center gap-2">
            {outcome === "refuse" ? <AlertTriangle size={18} color={color} /> : outcome === "defer" ? <PauseCircle size={18} color={color} /> : <ShieldCheck size={18} color={color} />}
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Decision</p>
          </div>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{copy.label}</IAST>
          </h3>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{copy.headline}</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{copy.text}</p>
        </article>
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Apply contexts</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {(Object.keys(APPLY_CONTEXTS) as ContextKey[]).map((key) => (
              <TriggerButton key={key} active={state.contexts.includes(key)} label={APPLY_CONTEXTS[key].label} detail={APPLY_CONTEXTS[key].detail} color={GREEN} onClick={() => setState((current) => ({ ...current, contexts: toggleItem(current.contexts, key) }))} />
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={17} color={VERMILION} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Refuse triggers</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {(Object.keys(REFUSE_TRIGGERS) as RefuseKey[]).map((key) => (
              <TriggerButton key={key} active={state.refuses.includes(key)} label={REFUSE_TRIGGERS[key].label} detail={REFUSE_TRIGGERS[key].detail} color={VERMILION} onClick={() => setState((current) => ({ ...current, refuses: toggleItem(current.refuses, key) }))} />
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <PauseCircle size={17} color={BLUE} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Defer triggers</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {(Object.keys(DEFER_TRIGGERS) as DeferKey[]).map((key) => (
              <TriggerButton key={key} active={state.defers.includes(key)} label={DEFER_TRIGGERS[key].label} detail={DEFER_TRIGGERS[key].detail} color={BLUE} onClick={() => setState((current) => ({ ...current, defers: toggleItem(current.defers, key) }))} />
            ))}
          </div>
        </article>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Mode 1</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Chart-contextual mention: most common. Chart stays primary; numerology is brief and subordinate.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Mode 2</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Standalone numerology with chart on file. Never full consulting depth; keep chart grounding active.</p>
          <button type="button" onClick={() => setState((current) => ({ ...current, bookedWithChart: !current.bookedWithChart }))} className="mt-3 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: state.bookedWithChart ? wash(GREEN, "14") : SURFACE, border: `1px solid ${state.bookedWithChart ? GREEN : HAIRLINE}`, color: state.bookedWithChart ? GREEN : INK_PRIMARY }}>
            {state.bookedWithChart ? "Chart on file" : "No chart on file"}
          </button>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Not Tier-1 scope</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Standalone numerology with no chart, full consulting engagements, guarantee claims, and single-factor major decisions.</p>
        </article>
      </section>
    </div>
  );
}
