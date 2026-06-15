"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { AlertTriangle, BadgeCheck, IndianRupee, Layers3, RotateCcw, Scale, ShieldAlert } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  CLAIM_STRENGTH,
  FEASIBILITY,
  SCENARIOS,
  auditScenario,
  finalVerdict,
  findOption,
  findScenario,
  type ClaimStrengthKey,
  type FeasibilityKey,
  type Option,
  type ScenarioKey,
  type TestResult,
  type TestStatus,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function statusColor(status: TestStatus) {
  if (status === "pass") return GREEN;
  if (status === "caution") return AMBER;
  return VERMILION;
}

function verdictColor(verdict: string) {
  if (verdict === "Safe to offer") return GREEN;
  if (verdict === "Offer with caveats") return AMBER;
  return VERMILION;
}

function testIcon(key: TestResult["key"]) {
  if (key === "empirical") return <Layers3 size={16} />;
  if (key === "demolition") return <ShieldAlert size={16} />;
  if (key === "costBenefit") return <IndianRupee size={16} />;
  return <AlertTriangle size={16} />;
}

function AuditDiagram({ results }: { results: TestResult[] }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Four-test screen</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>Any fail means revise</p>
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {results.map((result, index) => {
          const color = statusColor(result.status);
          return (
            <article key={result.key} className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
              <div className="flex min-w-0 items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-sm font-black uppercase" style={{ color }}>
                  {testIcon(result.key)}
                  Test {index + 1}
                </span>
                <span className="rounded-full px-2 py-1 text-[11px] font-black uppercase" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>
                  {result.status}
                </span>
              </div>
              <h3 className="m-0 mt-3 text-base font-bold" style={{ color: INK_PRIMARY }}>{result.label}</h3>
              <p className="mb-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>{result.finding}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function VastuHonestHandlingAudit() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("demolition");
  const scenario = useMemo(() => findScenario(scenarioKey), [scenarioKey]);
  const [feasibilityKey, setFeasibilityKey] = useState<FeasibilityKey>(scenario.defaultFeasibility);
  const [claimKey, setClaimKey] = useState<ClaimStrengthKey>(scenario.defaultClaimStrength);

  const feasibility = useMemo(() => findOption(FEASIBILITY, feasibilityKey), [feasibilityKey]);
  const claim = useMemo(() => findOption(CLAIM_STRENGTH, claimKey), [claimKey]);
  const results = useMemo(() => auditScenario(scenario, feasibilityKey, claimKey), [scenario, feasibilityKey, claimKey]);
  const verdict = finalVerdict(results);
  const color = verdictColor(verdict);

  const chooseScenario = (key: ScenarioKey) => {
    const next = findScenario(key);
    setScenarioKey(key);
    setFeasibilityKey(next.defaultFeasibility);
    setClaimKey(next.defaultClaimStrength);
  };

  const reset = () => chooseScenario("demolition");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-honest-handling-audit"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Honest-handling audit</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Run every Vastu prescription through four gates
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Separate empirical kernel from symbolic layer, block Vastu-only demolition, check cost-benefit, and refuse inflated causal promises.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset audit
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Selector title="Client claim" icon={<Scale size={16} />} options={SCENARIOS} value={scenarioKey} onChange={chooseScenario} />
        <Selector title="Feasibility" icon={<IndianRupee size={16} />} options={FEASIBILITY} value={feasibilityKey} onChange={setFeasibilityKey} />
        <Selector title="Claim strength" icon={<AlertTriangle size={16} />} options={CLAIM_STRENGTH} value={claimKey} onChange={setClaimKey} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <AuditDiagram results={results} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>{verdict}</p>
              <BadgeCheck size={18} color={color} />
            </div>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{scenario.label}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{scenario.claim}</p>
            <p className="mb-0 mt-3 text-sm font-semibold" style={{ color }}>{scenario.recommendation}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Two-layer framing</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}><strong>Kernel:</strong> {scenario.empiricalKernel}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}><strong>Symbolic:</strong> {scenario.symbolicLayer}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Client-agency check</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{feasibility.note}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{claim.note}</p>
          </article>
        </aside>
      </section>
    </div>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className="grid min-w-0 gap-2">
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
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
