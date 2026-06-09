"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, MessageSquareText, RotateCcw, Scale, ShieldCheck, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { getPmpy } from "../pmpy-archetype-explorer/data";
import { GRADE_SCENARIOS, getGradeScenario, gradeScore, type PmpyGrade } from "./data";

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

function GradeSpectrum({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: PmpyGrade;
  onSelect: (slug: PmpyGrade) => void;
}) {
  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 260" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="Pure to diluted Pancha Mahapurusha grade spectrum">
        <rect x="18" y="18" width="484" height="212" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          PURE TO DILUTED: REPORT THE GRADE
        </text>
        <line x1="92" y1="132" x2="428" y2="132" stroke={HAIRLINE} strokeWidth="12" strokeLinecap="round" />
        {GRADE_SCENARIOS.map((scenario, index) => {
          const x = 92 + index * 168;
          const active = scenario.slug === selectedSlug;
          return (
            <g
              key={scenario.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(scenario.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(scenario.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy="132" r={active ? 30 : 23} fill={active ? wash(scenario.color, "20") : SURFACE} stroke={active ? scenario.color : HAIRLINE} strokeWidth={active ? 3 : 1.3} />
              <text x={x} y="137" textAnchor="middle" fill={active ? scenario.color : INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {gradeScore(scenario)}
              </text>
              <text x={x} y="184" textAnchor="middle" fill={scenario.color} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {scenario.title}
              </text>
              <text x={x} y="202" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {scenario.grade}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

export function PmpyGradeScenario() {
  const [selectedSlug, setSelectedSlug] = useState<PmpyGrade>("pure");
  const [reportMode, setReportMode] = useState<"over" | "honest" | "dismiss">("honest");
  const selected = getGradeScenario(selectedSlug);
  const yoga = getPmpy(selected.yoga);
  const score = gradeScore(selected);
  const report = reportMode === "over" ? selected.overClaim : reportMode === "dismiss" ? selected.dismissive : selected.honest;

  function reset() {
    setSelectedSlug("pure");
    setReportMode("honest");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="pmpy-grade-scenario"
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
            PMPY grade scenario
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Pure, mixed, diluted: speak the grade honestly
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare structurally valid Mahapurusha yogas and practice the report: neither dramatic over-claiming nor false dismissal.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset pure
        </button>
      </div>

      <div className="grid gap-4">
        <GradeSpectrum selectedSlug={selectedSlug} onSelect={setSelectedSlug} />

        <section className="grid gap-4 md:grid-cols-3">
          {GRADE_SCENARIOS.map((scenario) => {
            const active = selected.slug === scenario.slug;
            return (
              <button key={scenario.slug} type="button" onClick={() => setSelectedSlug(scenario.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(scenario.color, "14") : SURFACE, border: `1px solid ${active ? scenario.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={scenario.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: scenario.color }}>{scenario.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.placement}</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Current scenario
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{yoga.iast}</IAST>: {selected.grade}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{selected.archetype}</p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
              {yoga.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}55` }}>
              <Scale size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Grade score</p>
              <p className="mt-2 text-4xl font-semibold" style={{ color: selected.color, fontFamily: "var(--font-cormorant), serif" }}>{score}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <ShieldCheck size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Strength</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Shadbala {selected.shadbala}; support {selected.support}; dilution factors {selected.dilutionCount}.</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <AlertTriangle size={17} color={GOLD} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Rule</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Diluted does not mean absent. It means partial expression.</p>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <MessageSquareText size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Communication drill
            </p>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            {[
              { key: "over" as const, label: "Over-claim" },
              { key: "honest" as const, label: "Honest report" },
              { key: "dismiss" as const, label: "Dismiss" },
            ].map((mode) => {
              const active = reportMode === mode.key;
              return (
                <button key={mode.key} type="button" onClick={() => setReportMode(mode.key)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(selected.color, "14") : SURFACE_2, border: `1px solid ${active ? selected.color : HAIRLINE}`, color: active ? selected.color : INK_SECONDARY }}>
                  {mode.label}
                </button>
              );
            })}
          </div>
          <article className="rounded-xl p-4" style={{ background: reportMode === "honest" ? wash(selected.color, "10") : SURFACE_2, border: `1px solid ${reportMode === "honest" ? selected.color : HAIRLINE}` }}>
            <p className="m-0 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {report}
            </p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Scenario reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Scenario", "Yoga", "Strength", "Grade", "Honest report"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GRADE_SCENARIOS.map((scenario) => (
                  <tr key={scenario.slug} onClick={() => setSelectedSlug(scenario.slug)} className="cursor-pointer align-top" style={{ background: selected.slug === scenario.slug ? wash(scenario.color, "10") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: scenario.color }}>{scenario.title}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{getPmpy(scenario.yoga).yoga}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>Score {gradeScore(scenario)}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{scenario.grade}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{scenario.honest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
