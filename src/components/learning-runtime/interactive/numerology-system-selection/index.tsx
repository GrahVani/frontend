"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, GitCompare, RotateCcw, ShieldAlert, SlidersHorizontal, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { CRITERIA, SCENARIOS, SYSTEMS, getSystem, scoreSystems, type CriterionId, type SystemId } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function getRecommendation(scores: ReturnType<typeof scoreSystems>) {
  const [top, second] = scores;
  const gap = (top?.score ?? 0) - (second?.score ?? 0);
  return {
    system: top ?? scores[0],
    confidence: gap >= 4 ? "Clear fit" : gap >= 2 ? "Likely fit" : "Needs explicit framing",
    gap,
  };
}

function DecisionFlowSvg({ activeSystem }: { activeSystem: SystemId }) {
  const active = getSystem(activeSystem);
  const nodes = [
    { id: "context", label: "Client context", sub: "literacy + purpose", x: 110, y: 108, color: GOLD },
    { id: "format", label: "Name format", sub: "Roman / Devanagari", x: 330, y: 108, color: BLUE },
    { id: "system", label: active.label, sub: "one selected frame", x: 550, y: 108, color: active.color },
    { id: "discipline", label: "Use consistently", sub: "no mid-reading mix", x: 330, y: 300, color: GREEN },
  ];

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 700 410" className="h-auto w-full min-w-0" role="img" aria-label="Numerology system selection flow">
        <rect x="18" y="18" width="664" height="374" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="350" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SELECT ONE SYSTEM, THEN KEEP THE READING INSIDE IT
        </text>

        <path d="M198 108 H242" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M418 108 H462" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M550 176 C550 244 458 300 418 300" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M242 300 C196 300 110 244 110 176" fill="none" stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeDasharray="8 8" />

        {nodes.map((node) => (
          <g key={node.id}>
            <rect x={node.x - 88} y={node.y - 54} width="176" height="108" rx="18" fill={wash(node.color, "12")} stroke={node.color} strokeWidth="2" />
            <text x={node.x} y={node.id === "system" ? node.y - 16 : node.y - 8} textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {node.id === "system" && node.label === "Vedic Anka-Jyotisha" ? (
                <>
                  <tspan x={node.x} dy="0">Vedic</tspan>
                  <tspan x={node.x} dy="18">Anka-Jyotisha</tspan>
                </>
              ) : (
                node.label
              )}
            </text>
            <text x={node.x} y={node.y + 24} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {node.sub}
            </text>
          </g>
        ))}

        <rect x="150" y="338" width="400" height="46" rx="23" fill={SURFACE} stroke={GOLD} />
        <text x="350" y="358" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <tspan x="350" dy="0">The Vedic-Chaldean hybrid is allowed</tspan>
          <tspan x="350" dy="18">only when named as one frame.</tspan>
        </text>
      </svg>
    </section>
  );
}

export function NumerologySystemSelection() {
  const [selectedScenarioId, setSelectedScenarioId] = useState("mumbai-chart");
  const [selectedCriteria, setSelectedCriteria] = useState<CriterionId[]>(SCENARIOS[0].selectedCriteria);
  const scores = useMemo(() => scoreSystems(selectedCriteria), [selectedCriteria]);
  const recommendation = getRecommendation(scores);
  const activeSystem = recommendation.system;
  const selectedScenario = SCENARIOS.find((scenario) => scenario.id === selectedScenarioId) ?? SCENARIOS[0];
  const mixedRisk = selectedCriteria.includes("compoundDepth") && selectedCriteria.includes("mathClarity") && selectedCriteria.includes("sanskritAuthority");

  const loadScenario = (id: string) => {
    const scenario = SCENARIOS.find((item) => item.id === id) ?? SCENARIOS[0];
    setSelectedScenarioId(id);
    setSelectedCriteria(scenario.selectedCriteria);
  };

  const toggleCriterion = (id: CriterionId) => {
    setSelectedScenarioId("custom");
    setSelectedCriteria((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const reset = () => loadScenario("mumbai-chart");

  return (
    <div
      className="w-full min-w-0"
      data-interactive="numerology-system-selection"
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
            Numerology system-selection framework
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Choose Chaldean, Pythagorean, or Vedic by client context
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Toggle the client context, watch the fit scores move, then name exactly one system before the consultation begins.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset lesson case
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-4">
        {SCENARIOS.map((scenario) => {
          const selected = selectedScenarioId === scenario.id;
          const fit = getSystem(scenario.lessonFit);
          return (
            <button key={scenario.id} type="button" onClick={() => loadScenario(scenario.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(fit.color, "12") : SURFACE, border: `1px solid ${selected ? fit.color : HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: selected ? fit.color : INK_PRIMARY }}>{scenario.label}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{scenario.brief}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <DecisionFlowSvg activeSystem={activeSystem.id} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Client-context criteria</p>
            </div>
            <div className="grid min-w-0 gap-2 md:grid-cols-3">
              {CRITERIA.map((criterion) => {
                const selected = selectedCriteria.includes(criterion.id);
                return (
                  <button key={criterion.id} type="button" onClick={() => toggleCriterion(criterion.id)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: selected ? wash(GOLD, "18") : SURFACE_2, border: `1px solid ${selected ? GOLD : HAIRLINE}` }}>
                    <p className="m-0 text-sm font-bold" style={{ color: selected ? GOLD : INK_PRIMARY }}>{criterion.label}</p>
                    <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{criterion.prompt}</p>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Four-dimension comparison</p>
            </div>
            <div className="grid min-w-0 gap-3 lg:grid-cols-3">
              {SYSTEMS.map((system) => {
                const score = scores.find((item) => item.id === system.id)?.score ?? 0;
                const selected = activeSystem.id === system.id;
                return (
                  <article key={system.id} className="min-w-0 rounded-xl p-4" style={{ background: selected ? wash(system.color, "12") : SURFACE_2, border: `1px solid ${selected ? system.color : HAIRLINE}` }}>
                    <div className="mb-2">
                      <p className="m-0 text-xs font-bold uppercase" style={{ color: system.color, letterSpacing: "0.08em" }}>Score {score}</p>
                      <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                        <IAST>{system.label}</IAST>
                      </h3>
                    </div>
                    <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{system.range}</p>
                    <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{system.shortFit}</p>
                  </article>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeSystem.color, "12"), border: `1px solid ${activeSystem.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <BadgeCheck size={17} color={activeSystem.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: activeSystem.color, letterSpacing: "0.08em" }}>Recommendation</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{activeSystem.label}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{recommendation.confidence} · {activeSystem.iast}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{activeSystem.clientPhrase}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected case</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selectedScenarioId === "custom" ? "Custom context" : selectedScenario.label}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{selectedScenarioId === "custom" ? "Your toggles create a custom consultation context. Name the selected system explicitly before reading." : selectedScenario.brief}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(mixedRisk ? VERMILION : GREEN, "0F"), border: `1px solid ${mixedRisk ? VERMILION : HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={mixedRisk ? VERMILION : GREEN} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: mixedRisk ? VERMILION : GREEN, letterSpacing: "0.08em" }}>{mixedRisk ? "Mixing risk detected" : "Discipline guard"}</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{mixedRisk ? "Do not merge three systems into one verdict." : "Pick exactly one system per consultation."}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              {mixedRisk
                ? "Offer a comparison exercise or honestly named Vedic-Chaldean hybrid, but do not produce a blended single reading."
                : "The only exception is the Vedic-Chaldean hybrid, and it remains one named frame when used honestly."}
            </p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Chaldean cue</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Roman name plus compound-depth questions favors Chaldean.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Pythagorean cue</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Western Life-Path literacy plus math clarity favors Pythagorean.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Vedic cue</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Chart integration or Devanagari/Sanskrit context favors Vedic Anka-Jyotisha.</p>
        </article>
      </section>
    </div>
  );
}
