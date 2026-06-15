"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { AlertTriangle, ArrowRight, BadgeCheck, Building2, Flag, GitBranch, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  DEPTHS,
  FLAG_GROUNDS,
  REMEDY_TIERS,
  SCENARIOS,
  evaluateDecision,
  findOption,
  findScenario,
  type DecisionMode,
  type DecisionStep,
  type DepthKey,
  type FlagGroundKey,
  type Option,
  type RemedyTierKey,
  type ScenarioKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function modeColor(mode: DecisionMode) {
  if (mode === "flag") return GREEN;
  if (mode === "defer") return BLUE;
  return VERMILION;
}

function stepColor(status: DecisionStep["status"]) {
  if (status === "pass") return GREEN;
  if (status === "caution") return AMBER;
  return VERMILION;
}

function stepIcon(step: DecisionStep) {
  if (step.key === "ground") return <Flag size={16} />;
  if (step.key === "scope") return <Building2 size={16} />;
  if (step.key === "refusal") return <ShieldCheck size={16} />;
  return <GitBranch size={16} />;
}

function DecisionFlow({ steps }: { steps: DecisionStep[] }) {
  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Consultation decision flow
        </p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
          flag -&gt; defer -&gt; refuse -&gt; cascade
        </p>
      </div>
      <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => {
          const color = stepColor(step.status);
          return (
            <article key={step.key} className="relative min-w-0 rounded-xl p-4" style={{ background: wash(color, "0F"), border: `1px solid ${color}` }}>
              {index < steps.length - 1 ? (
                <ArrowRight className="absolute -right-3 top-1/2 hidden -translate-y-1/2 xl:block" size={20} color={GOLD} />
              ) : null}
              <div className="flex min-w-0 items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase" style={{ color }}>
                  {stepIcon(step)}
                  Gate {index + 1}
                </span>
                <span className="rounded-full px-2 py-1 text-[11px] font-black uppercase" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>
                  {step.status}
                </span>
              </div>
              <h3 className="m-0 mt-3 text-base font-bold" style={{ color: INK_PRIMARY }}>
                {step.label}
              </h3>
              <p className="mb-0 mt-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {step.result}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function CascadeDiagram({ tierKey }: { tierKey: RemedyTierKey }) {
  const selectedIndex = REMEDY_TIERS.findIndex((item) => item.key === tierKey);
  const colors = [GREEN, BLUE, AMBER, VERMILION];

  return (
    <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
        Four-tier remediation cascade
      </p>
      <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {REMEDY_TIERS.map((tier, index) => {
          const color = colors[index];
          const active = index <= selectedIndex;
          return (
            <article key={tier.key} className="min-w-0 rounded-xl p-3" style={{ background: active ? wash(color, "12") : SURFACE, border: `1px solid ${active ? color : HAIRLINE}` }}>
              <p className="m-0 text-xs font-black uppercase" style={{ color }}>
                T{index + 1}
              </p>
              <h4 className="m-0 mt-1 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                {tier.label.replace(/^T\d\s/, "")}
              </h4>
              <p className="mb-0 mt-2 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
                {tier.note}
              </p>
            </article>
          );
        })}
      </div>
      <p className="mb-0 mt-3 text-xs font-semibold" style={{ color: INK_SECONDARY }}>
        Always begin with T1; T3 and T4 need honest attribution and should never be pushed as guarantees.
      </p>
    </section>
  );
}

export function VastuDecisionFramework() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("careerChart");
  const scenario = useMemo(() => findScenario(scenarioKey), [scenarioKey]);
  const [groundKey, setGroundKey] = useState<FlagGroundKey>(scenario.defaultGround);
  const [depthKey, setDepthKey] = useState<DepthKey>(scenario.defaultDepth);
  const [tierKey, setTierKey] = useState<RemedyTierKey>(scenario.defaultTier);

  const result = useMemo(() => evaluateDecision(scenario, groundKey, depthKey, tierKey), [scenario, groundKey, depthKey, tierKey]);
  const mode = modeColor(result.mode);
  const ground = useMemo(() => findOption(FLAG_GROUNDS, groundKey), [groundKey]);
  const depth = useMemo(() => findOption(DEPTHS, depthKey), [depthKey]);
  const tier = useMemo(() => findOption(REMEDY_TIERS, tierKey), [tierKey]);

  const chooseScenario = (key: ScenarioKey) => {
    const next = findScenario(key);
    setScenarioKey(key);
    setGroundKey(next.defaultGround);
    setDepthKey(next.defaultDepth);
    setTierKey(next.defaultTier);
  };

  const reset = () => chooseScenario("careerChart");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-decision-framework"
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
            Vastu decision framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Decide when to flag, defer, or refuse
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Run the client moment through scope, refusal, and remedy-cascade gates before offering any Vastu statement.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset framework
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <Selector title="Consultation moment" icon={<AlertTriangle size={16} />} options={SCENARIOS} value={scenarioKey} onChange={chooseScenario} />
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(mode, "12"), border: `1px solid ${mode}` }}>
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: mode, letterSpacing: "0.08em" }}>
              {result.mode}
            </p>
            <BadgeCheck size={18} color={mode} />
          </div>
          <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {result.title}
          </h3>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            {scenario.prompt}
          </p>
          <p className="mb-0 mt-3 text-sm font-semibold" style={{ color: mode }}>
            {result.practitionerLine}
          </p>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-3">
        <Selector title="Flag ground" icon={<Flag size={16} />} options={FLAG_GROUNDS} value={groundKey} onChange={setGroundKey} compact />
        <Selector title="Scope depth" icon={<Building2 size={16} />} options={DEPTHS} value={depthKey} onChange={setDepthKey} compact />
        <Selector title="Remedy tier" icon={<GitBranch size={16} />} options={REMEDY_TIERS} value={tierKey} onChange={setTierKey} compact />
      </section>

      <section className="grid min-w-0 gap-4">
        <DecisionFlow steps={result.steps} />
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <CascadeDiagram tierKey={tierKey} />
          <aside className="grid min-w-0 content-start gap-3">
            <InfoCard title="Current inputs" icon={<ShieldCheck size={16} />}>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}><strong>{ground.label}:</strong> {ground.note}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}><strong>{depth.label}:</strong> {depth.note}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}><strong>{tier.label}:</strong> {tier.note}</p>
            </InfoCard>
            <InfoCard title="Action sentence" icon={<BadgeCheck size={16} />}>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{result.nextAction}</p>
              <p className="mb-0 mt-2 text-sm font-semibold" style={{ color: mode }}>{result.tierAdvice}</p>
            </InfoCard>
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      {children}
    </article>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
  compact = false,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className={`grid min-w-0 gap-2 ${compact ? "" : "sm:grid-cols-2 xl:grid-cols-3"}`}>
        {options.map((option) => {
          const selected = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{
                color: selected ? INK_PRIMARY : INK_SECONDARY,
                background: selected ? wash(GOLD, "12") : SURFACE_2,
                border: `1px solid ${selected ? GOLD : HAIRLINE}`,
              }}
            >
              <span className="block">{option.label}</span>
              {!compact ? (
                <span className="mt-1 block text-xs font-normal leading-snug" style={{ color: INK_SECONDARY }}>{option.note}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}
