"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, CircleDot, GitBranch, Library, RotateCcw, Scale, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  JAIMINI_DIVERGENCES,
  JAIMINI_INTERPRETERS,
  getJaiminiDivergence,
  getJaiminiInterpreter,
  type DivergenceSlug,
  type InterpreterSlug,
  type JaiminiInterpreter,
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

function InterpreterSvg({
  selectedSlug,
  selectedDivergence,
  onSelect,
}: {
  selectedSlug: InterpreterSlug;
  selectedDivergence: DivergenceSlug;
  onSelect: (slug: InterpreterSlug) => void;
}) {
  const selected = getJaiminiInterpreter(selectedSlug);
  const divergence = getJaiminiDivergence(selectedDivergence);
  const nodes = [
    { slug: "raman" as const, x: 132, y: 118 },
    { slug: "rath" as const, x: 270, y: 86 },
    { slug: "rao" as const, x: 408, y: 118 },
  ];

  return (
    <section className="mx-auto w-full max-w-[600px] min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 540 300" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="Modern Jaimini interpreter comparison map">
        <rect x="18" y="18" width="504" height="250" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="270" y="48" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          THREE MODERN READINGS OF ONE TERSE SOURCE
        </text>

        <line x1="160" y1="118" x2="242" y2="86" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="298" y1="86" x2="380" y2="118" stroke={HAIRLINE} strokeWidth="3" strokeLinecap="round" />
        <line x1="160" y1="118" x2="380" y2="118" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 6" />

        <rect x="96" y="178" width="348" height="48" rx="16" fill={wash(selected.color, "10")} stroke={selected.color} />
        <text x="270" y="198" textAnchor="middle" fill={selected.color} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          disclose source: {selected.label} lens
        </text>
        <text x="270" y="216" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          current divergence: {divergence.label}
        </text>

        {nodes.map((point) => {
          const interpreter = getJaiminiInterpreter(point.slug);
          const active = interpreter.slug === selected.slug;
          return (
            <g
              key={interpreter.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(interpreter.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(interpreter.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={point.x} cy={point.y} r={active ? 34 : 28} fill={active ? wash(interpreter.color, "18") : SURFACE} stroke={active ? interpreter.color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
              <text x={point.x} y={point.y - 3} textAnchor="middle" fill={active ? interpreter.color : INK_PRIMARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {interpreter.label}
              </text>
              <text x={point.x} y={point.y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                lineage
              </text>
            </g>
          );
        })}

        <text x="270" y="272" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          plurality is disciplined: label the framework before comparing results
        </text>
      </svg>
    </section>
  );
}

function InterpreterDetail({ interpreter }: { interpreter: JaiminiInterpreter }) {
  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: interpreter.color, letterSpacing: "0.08em" }}>
            Selected interpreter
          </p>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{interpreter.fullName}</IAST>
          </h3>
          <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{interpreter.signatureWork}</p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{interpreter.emphasis}</p>
        </div>
        <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: interpreter.color }}>
          {interpreter.devanagari}
        </Devanagari>
      </div>
    </section>
  );
}

export function JaiminiInterpreterComparator() {
  const [selectedInterpreterSlug, setSelectedInterpreterSlug] = useState<InterpreterSlug>("raman");
  const [selectedDivergenceSlug, setSelectedDivergenceSlug] = useState<DivergenceSlug>("karaka-count");
  const selectedInterpreter = getJaiminiInterpreter(selectedInterpreterSlug);
  const selectedDivergence = getJaiminiDivergence(selectedDivergenceSlug);

  function reset() {
    setSelectedInterpreterSlug("raman");
    setSelectedDivergenceSlug("karaka-count");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="jaimini-interpreter-comparator"
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
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Jaimini interpreter comparator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Ask whose rule before asking which rule
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compare Raman, Rath, and Rao as legitimate modern readings of the terse Jaimini source.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Raman
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {JAIMINI_INTERPRETERS.map((interpreter) => {
            const active = interpreter.slug === selectedInterpreter.slug;
            return (
              <button key={interpreter.slug} type="button" onClick={() => setSelectedInterpreterSlug(interpreter.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(interpreter.color, "12") : SURFACE, border: `1px solid ${active ? interpreter.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={interpreter.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: interpreter.color }}>{interpreter.fullName}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{interpreter.signatureWork}</p>
              </button>
            );
          })}
        </section>

        <InterpreterSvg selectedSlug={selectedInterpreter.slug} selectedDivergence={selectedDivergence.slug} onSelect={setSelectedInterpreterSlug} />

        <InterpreterDetail interpreter={selectedInterpreter} />

        <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Scale size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Divergence point
            </p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            {JAIMINI_DIVERGENCES.map((point) => {
              const active = point.slug === selectedDivergence.slug;
              return (
                <button key={point.slug} type="button" onClick={() => setSelectedDivergenceSlug(point.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(selectedInterpreter.color, "12") : SURFACE_2, border: `1px solid ${active ? selectedInterpreter.color : HAIRLINE}` }}>
                  {active ? <CheckCircle2 size={17} color={selectedInterpreter.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                  <p className="mt-2 text-sm font-bold" style={{ color: active ? selectedInterpreter.color : INK_PRIMARY }}>{point.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{point.question}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(selectedInterpreter.color, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start gap-3">
            <BookOpen className="shrink-0" size={18} color={selectedInterpreter.color} />
            <div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selectedDivergence.question}</p>
              <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{selectedDivergence.whyItMatters}</p>
              <p className="m-0 text-sm font-semibold" style={{ color: selectedInterpreter.color }}>
                {selectedDivergence[selectedInterpreter.slug]}
              </p>
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Library size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Contribution</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selectedInterpreter.contribution}</p>
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <GitBranch size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Source discipline</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selectedInterpreter.discipline}</p>
          </article>
          <article className="rounded-xl p-4 md:col-span-2" style={{ background: wash(selectedInterpreter.color, "10"), border: `1px solid ${HAIRLINE}` }}>
            <FileTextIcon color={selectedInterpreter.color} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Rewrite</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Say: using {selectedInterpreter.label}&apos;s framework, this rule is applied here.</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Rule-variant reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Divergence", "Raman", "Rath", "Rao", "Why disclose"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {JAIMINI_DIVERGENCES.map((point) => {
                  const active = point.slug === selectedDivergence.slug;
                  return (
                    <tr key={point.slug} onClick={() => setSelectedDivergenceSlug(point.slug)} className="cursor-pointer align-top" style={{ background: active ? wash(selectedInterpreter.color, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: selectedInterpreter.color }}>{point.label}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{point.raman}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{point.rath}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{point.rao}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{point.whyItMatters}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(selectedInterpreter.color, "10"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedInterpreter.color, letterSpacing: "0.08em" }}>
            Professional habit
          </p>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Disclose the source before defending the result.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            A mismatch between two Jaimini readings is often a method label problem, not an arithmetic error.
          </p>
        </section>
      </div>
    </div>
  );
}

function FileTextIcon({ color }: { color: string }) {
  return <BookOpen size={17} color={color} />;
}
