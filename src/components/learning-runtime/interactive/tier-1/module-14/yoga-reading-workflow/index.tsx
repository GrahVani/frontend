"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, ClipboardCheck, Gauge, GitBranch, RotateCcw, ShieldCheck, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  WORKFLOW_SCENARIOS,
  WORKFLOW_STEPS,
  getWorkflowScenario,
  getWorkflowStep,
  type WorkflowScenario,
  type WorkflowScenarioSlug,
  type WorkflowStepSlug,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function WorkflowSvg({
  selectedStepSlug,
  scenario,
  twoYesCount,
  onSelectStep,
}: {
  selectedStepSlug: WorkflowStepSlug;
  scenario: WorkflowScenario;
  twoYesCount: number;
  onSelectStep: (slug: WorkflowStepSlug) => void;
}) {
  const points = WORKFLOW_STEPS.map((step, index) => ({
    step,
    x: 56 + index * 70,
    y: index % 2 === 0 ? 106 : 160,
  }));

  return (
    <section className="mx-auto w-full max-w-[640px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 540 285" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="Seven-step yoga reading workflow">
        <rect x="18" y="18" width="504" height="236" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="270" y="48" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SEVEN-STEP YOGA READING WORKFLOW
        </text>

        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          return <line key={point.step.slug} x1={point.x + 22} y1={point.y} x2={next.x - 22} y2={next.y} stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />;
        })}

        {points.map(({ step, x, y }) => {
          const active = step.slug === selectedStepSlug;
          const complete =
            step.slug === "identify" ||
            (step.slug === "cancel" && scenario.cancellationClear) ||
            (step.slug === "strength" && scenario.strengthClear) ||
            (step.slug === "dasha" && scenario.dashaClear) ||
            (step.slug === "transit" && scenario.transitClear) ||
            (step.slug === "two-yes" && twoYesCount >= 2) ||
            step.slug === "frame";
          return (
            <g
              key={step.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelectStep(step.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectStep(step.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy={y} r={active ? 25 : 21} fill={active ? wash(step.color, "18") : SURFACE} stroke={active ? step.color : complete ? scenario.color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
              <text x={x} y={y - 2} textAnchor="middle" fill={active ? step.color : INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.number}
              </text>
              <text x={x} y={y + 36} textAnchor="middle" fill={active ? step.color : INK_SECONDARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.shortLabel}
              </text>
            </g>
          );
        })}

        <rect x="92" y="216" width="356" height="28" rx="12" fill={twoYesCount >= 2 ? wash(scenario.color, "14") : SURFACE} stroke={twoYesCount >= 2 ? scenario.color : HAIRLINE} />
        <text x="270" y="235" textAnchor="middle" fill={twoYesCount >= 2 ? scenario.color : INK_MUTED} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          two-yes count: {twoYesCount} independent indicator{twoYesCount === 1 ? "" : "s"}
        </text>
        <text x="270" y="273" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          find before grade, cancel before predict, time before commit
        </text>
      </svg>
    </section>
  );
}

export function YogaReadingWorkflow() {
  const [scenarioSlug, setScenarioSlug] = useState<WorkflowScenarioSlug>("strong-timed-raja");
  const [selectedStepSlug, setSelectedStepSlug] = useState<WorkflowStepSlug>("identify");
  const scenario = getWorkflowScenario(scenarioSlug);
  const [cancellationClear, setCancellationClear] = useState(scenario.cancellationClear);
  const [strengthClear, setStrengthClear] = useState(scenario.strengthClear);
  const [dashaClear, setDashaClear] = useState(scenario.dashaClear);
  const [transitClear, setTransitClear] = useState(scenario.transitClear);
  const selectedStep = getWorkflowStep(selectedStepSlug);
  const twoYesCount = [strengthClear, dashaClear, transitClear].filter(Boolean).length;
  const commitReady = cancellationClear && twoYesCount >= 2;

  function applyScenario(slug: WorkflowScenarioSlug) {
    const nextScenario = getWorkflowScenario(slug);
    setScenarioSlug(slug);
    setSelectedStepSlug("identify");
    setCancellationClear(nextScenario.cancellationClear);
    setStrengthClear(nextScenario.strengthClear);
    setDashaClear(nextScenario.dashaClear);
    setTransitClear(nextScenario.transitClear);
  }

  function reset() {
    applyScenario("strong-timed-raja");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="yoga-reading-workflow"
      style={{
        maxWidth: 860,
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
      }}
    >
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Yoga reading workflow
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Seven steps from chart signal to responsible statement
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Run identification, cancellation, strength, timing, transit, two-yes, and honest framing in one disciplined order.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset workflow
        </button>
      </div>

      <div className="grid gap-4">
        <section className="grid gap-3 md:grid-cols-3">
          {WORKFLOW_SCENARIOS.map((item) => {
            const active = item.slug === scenario.slug;
            return (
              <button key={item.slug} type="button" onClick={() => applyScenario(item.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(item.color, "12") : SURFACE, border: `1px solid ${active ? item.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={item.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: item.color }}>{item.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.honestFrame}</p>
              </button>
            );
          })}
        </section>

        <WorkflowSvg selectedStepSlug={selectedStep.slug} scenario={{ ...scenario, cancellationClear, strengthClear, dashaClear, transitClear }} twoYesCount={twoYesCount} onSelectStep={setSelectedStepSlug} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedStep.color, letterSpacing: "0.08em" }}>
                Step {selectedStep.number}: {selectedStep.engine}
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {selectedStep.label}
              </h3>
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selectedStep.question}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selectedStep.action}</p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: scenario.color }}>
              {scenario.devanagari}
            </Devanagari>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ClipboardCheck size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Evidence switches
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: "Cancellation clear", value: cancellationClear, setter: setCancellationClear, color: grahas.budha.primary },
              { label: "Strength passes", value: strengthClear, setter: setStrengthClear, color: grahas.surya.primary },
              { label: "Dasha agrees", value: dashaClear, setter: setDashaClear, color: grahas.shani.primary },
              { label: "Transit confirms", value: transitClear, setter: setTransitClear, color: grahas.candra.primary },
            ].map((item) => (
              <button key={item.label} type="button" onClick={() => item.setter(!item.value)} className="rounded-xl p-4 text-left" style={{ background: item.value ? wash(item.color, "12") : SURFACE_2, border: `1px solid ${item.value ? item.color : HAIRLINE}` }}>
                {item.value ? <CheckCircle2 size={17} color={item.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: item.value ? item.color : INK_SECONDARY }}>{item.label}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: commitReady ? wash(scenario.color, "12") : wash(grahas.rahu.primary, "0D"), border: `1px solid ${commitReady ? scenario.color : HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: commitReady ? scenario.color : GOLD, letterSpacing: "0.08em" }}>
                Final framing
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{scenario.iast}</IAST>
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{scenario.chartSignal}</p>
              <p className="mt-3 text-sm font-bold" style={{ color: commitReady ? scenario.color : grahas.rahu.primary }}>
                {commitReady ? scenario.honestFrame : "Withhold or soften: the two-yes gate is not fully satisfied."}
              </p>
            </div>
            {commitReady ? <ShieldCheck className="shrink-0" size={28} color={scenario.color} /> : <Gauge className="shrink-0" size={28} color={GOLD} />}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Seven-step reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "#", width: "w-12" },
                    { label: "Step", width: "w-[130px]" },
                    { label: "Engine layer", width: "w-[160px]" },
                    { label: "Reader discipline", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORKFLOW_STEPS.map((step) => {
                  const active = step.slug === selectedStep.slug;
                  return (
                    <tr key={step.slug} onClick={() => setSelectedStepSlug(step.slug)} className="cursor-pointer align-top" style={{ background: active ? wash(step.color, "10") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: step.color }}>{step.number}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: active ? step.color : INK_PRIMARY }}>{step.label}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{step.engine}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{step.action}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(scenario.color, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <GitBranch size={17} color={scenario.color} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: scenario.color, letterSpacing: "0.08em" }}>
              Module 14 synthesis
            </p>
          </div>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Find before grade, cancel before predict, grade before time, time before commit.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            This closes the yoga-doctrine layer by tying yogas, doshas, shadbala, SAV, dasha, and transit into one repeatable reading order.
          </p>
        </section>
      </div>
    </div>
  );
}
