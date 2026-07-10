"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, GitBranch, Layers3, ListChecks, RotateCcw, ShieldCheck } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { ARCHITECTURE_STEPS, CHECKS, PLAN_SCENARIOS, getLayer, getScenario, getStep, type PlanScenarioKey, type PlanStepKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function readableColor(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? INK_PRIMARY : hex;
}

function ArchitectureSvg({ activeStep, scenarioKey }: { activeStep: PlanStepKey; scenarioKey: PlanScenarioKey }) {
  const active = getStep(activeStep);
  const scenario = getScenario(scenarioKey);
  const points = [
    { key: "diagnose" as const, x: 108, y: 148 },
    { key: "validate" as const, x: 292, y: 148 },
    { key: "layer" as const, x: 476, y: 148 },
    { key: "sequence" as const, x: 660, y: 148 },
  ];
  const stepLabelLines: Record<PlanStepKey, string[]> = {
    diagnose: ["Diagnose"],
    validate: ["Cross", "validate"],
    layer: ["Layer", "remedies"],
    sequence: ["Sequence"],
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 780 350" className="h-auto w-full min-w-0" role="img" aria-label="Cross stream remedy integration architecture">
        <rect x="20" y="20" width="740" height="300" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="390" y="52" textAnchor="middle" fill={GOLD} fontSize="20" fontWeight="700" letterSpacing="0.5" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DIAGNOSE SINGLE-STREAM, REMEDY CROSS-STREAM
        </text>
        <path d="M108 148 H660" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="10 9" />

        {points.map((point, index) => {
          const step = getStep(point.key);
          const selected = point.key === activeStep;
          const labelLines = stepLabelLines[point.key];
          return (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r={selected ? 58 : 52} fill={selected ? wash(step.color, "18") : SURFACE} stroke={selected ? step.color : HAIRLINE} strokeWidth={selected ? 2.4 : 1.2} />
              <text x={point.x} y={point.y - 26} textAnchor="middle" fill={selected ? readableColor(step.color) : INK_SECONDARY} fontSize="14" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                <tspan x={point.x} dy="0">{index + 1}. {labelLines[0]}</tspan>
                {labelLines[1] ? <tspan x={point.x} dy="16">{labelLines[1]}</tspan> : null}
              </text>
              <text x={point.x} y={point.y + 25} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.source}
              </text>
            </g>
          );
        })}

        <rect x="174" y="230" width="432" height="54" rx="16" fill={wash(active.color, "10")} stroke={active.color} />
        <text x="390" y="249" textAnchor="middle" fill={readableColor(active.color)} fontSize="16" fontWeight="700" letterSpacing="0.3" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ACTIVE RULE
        </text>
        <text x="390" y="272" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="500" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {active.rule}
        </text>

        <text x="390" y="90" textAnchor="middle" fill={readableColor(CHECKS[scenario.check].color)} fontSize="17" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Scenario check: {CHECKS[scenario.check].label}
        </text>
      </svg>
    </section>
  );
}

export function CrossStreamRemedyPlanner() {
  const [scenarioKey, setScenarioKey] = useState<PlanScenarioKey>("venus");
  const [activeStep, setActiveStep] = useState<PlanStepKey>("diagnose");
  const scenario = getScenario(scenarioKey);
  const step = getStep(activeStep);
  const check = CHECKS[scenario.check];
  const layers = useMemo(() => scenario.layerIds.map(getLayer).sort((a, b) => a.sequence - b.sequence), [scenario.layerIds]);

  const reset = () => {
    setScenarioKey("venus");
    setActiveStep("diagnose");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="cross-stream-remedy-planner"
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
            Cross-stream remedy integration
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Build a short layered plan, not a remedy pile
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Diagnose with Parashari, validate with the Teva, layer classical and Lal Kitab remedies, then check sequence, disclosure, contradiction, and restraint.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset plan
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {PLAN_SCENARIOS.map((item) => {
          const selected = item.key === scenarioKey;
          const status = CHECKS[item.check];
          return (
            <button key={item.key} type="button" onClick={() => setScenarioKey(item.key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(status.color, "12") : SURFACE, border: `1px solid ${selected ? status.color : HAIRLINE}` }}>
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="m-0 text-xs font-black uppercase" style={{ color: selected ? readableColor(status.color) : GOLD, letterSpacing: "0.08em" }}>{status.label}</p>
                {item.check === "coherent" ? <CheckCircle2 size={18} color={selected ? status.color : INK_MUTED} /> : <AlertTriangle size={18} color={selected ? status.color : INK_MUTED} />}
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.direction}</p>
            </button>
          );
        })}
      </section>

      <section className="mb-4 grid min-w-0 gap-2 md:grid-cols-4">
        {ARCHITECTURE_STEPS.map((item, index) => {
          const selected = item.key === activeStep;
          return (
            <button key={item.key} type="button" onClick={() => setActiveStep(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              <p className="m-0 text-xs font-black uppercase" style={{ color: selected ? readableColor(item.color) : GOLD, letterSpacing: "0.08em" }}>Step {index + 1}</p>
              <p className="mb-0 mt-1 text-sm font-bold" style={{ color: selected ? readableColor(item.color) : INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.source}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(step.color, "10"), border: `1px solid ${step.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(step.color), letterSpacing: "0.08em" }}>Active architecture step</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{step.label}: {step.source}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{step.action}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{step.rule}</p>
              </div>
              <Layers3 className="shrink-0" size={38} color={step.color} />
            </div>
          </article>

          <ArchitectureSvg activeStep={activeStep} scenarioKey={scenarioKey} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(check.color, "10"), border: `1px solid ${check.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              {scenario.check === "coherent" ? <CheckCircle2 size={17} color={check.color} /> : <AlertTriangle size={17} color={check.color} />}
              <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(check.color), letterSpacing: "0.08em" }}>{check.label}</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{check.headline}</h3>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{check.detail}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ListChecks size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Diagnosis frame</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.diagnosis}</p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{scenario.tevaCheck}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Sequenced remedy layers</p>
          </div>
          <div className="grid min-w-0 gap-3">
            {layers.map((layer) => (
              <article key={layer.id} className="min-w-0 rounded-xl p-3" style={{ background: wash(layer.color, "0F"), border: `1px solid ${HAIRLINE}` }}>
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="m-0 text-xs font-black uppercase" style={{ color: readableColor(layer.color), letterSpacing: "0.08em" }}>Layer {layer.sequence}: {layer.tradition}</p>
                    <p className="mb-0 mt-1 text-sm font-bold" style={{ color: INK_PRIMARY }}>{layer.label}</p>
                    <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{layer.purpose}</p>
                  </div>
                  <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: readableColor(layer.color) }}>
                    {layer.layer}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Correction / disclosure</p>
          </div>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.correction}</p>
          <div className="mt-4 rounded-xl p-3" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Client language</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              This layer is classical; this layer is Lal Kitab empirical-folk. Both are supportive and mitigative, not guaranteed cures.
            </p>
          </div>
        </article>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Coherence check</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Every remedy serves one diagnostic direction.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Drop contradictions</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Do not strengthen and remove the same graha at once.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Restraint</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>A good plan is short: usually one folk act and one classical remedy.</p>
        </article>
      </section>
    </div>
  );
}
