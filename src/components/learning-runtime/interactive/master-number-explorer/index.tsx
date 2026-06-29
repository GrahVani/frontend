"use client";

import { useState } from "react";
import { BadgeCheck, GitCompare, Hash, RotateCcw, ShieldAlert, Sparkles, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { CONVENTIONS, MASTER_NUMBERS, getMasterNumber, grahaColor, type ConventionId, type MasterNumberId } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function MasterFlowSvg({ activeValue, convention }: { activeValue: MasterNumberId; convention: ConventionId }) {
  const active = getMasterNumber(activeValue);
  const color = grahaColor(active);
  const resultLabel = convention === "preserve" ? `${active.value}` : `${active.reducesTo}`;
  const resultSub = convention === "preserve" ? active.label : active.underlying;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 410" className="h-auto w-full min-w-0" role="img" aria-label="Master number preserve versus reduce flow">
        <rect x="20" y="20" width="720" height="370" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="55" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <tspan x="380" dy="0">MASTER NUMBER: PRESERVE THE AMPLIFIED REGISTER</tspan>
          <tspan x="380" dy="22">OR REDUCE TO THE ROOT</tspan>
        </text>

        <rect x="70" y="125" width="170" height="120" rx="18" fill={wash(color, "12")} stroke={color} strokeWidth="2.5" />
        <text x="155" y="174" textAnchor="middle" fill={color} fontSize="50" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {active.value}
        </text>
        <text x="155" y="207" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {active.label}
        </text>

        <path d="M252 184 H330" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
        <text x="291" y="164" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          convention
        </text>

        <rect x="342" y="108" width="164" height="64" rx="16" fill={convention === "preserve" ? wash(GOLD, "18") : SURFACE} stroke={convention === "preserve" ? GOLD : HAIRLINE} strokeWidth="2" />
        <text x="424" y="148" textAnchor="middle" fill={convention === "preserve" ? GOLD : INK_SECONDARY} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Preserve
        </text>

        <rect x="342" y="196" width="164" height="64" rx="16" fill={convention === "reduce" ? wash(GREEN, "18") : SURFACE} stroke={convention === "reduce" ? GREEN : HAIRLINE} strokeWidth="2" />
        <text x="424" y="236" textAnchor="middle" fill={convention === "reduce" ? GREEN : INK_SECONDARY} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Reduce
        </text>

        <path d="M520 184 H576" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
        <rect x="588" y="125" width="140" height="120" rx="18" fill={wash(color, "12")} stroke={color} strokeWidth="2.5" />
        <text x="658" y="176" textAnchor="middle" fill={color} fontSize="44" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {resultLabel}
        </text>
        <text x="658" y={resultSub.includes(" ") ? 204 : 210} textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {resultSub.split(" ").map((word, i) => (
            <tspan key={word} x="658" dy={i === 0 ? 0 : 18}>
              {word}
            </tspan>
          ))}
        </text>

        <rect x="155" y="324" width="450" height="48" rx="24" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="347" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <tspan x="380" dy="0">Pick one convention for the consultation;</tspan>
          <tspan x="380" dy="18">do not switch mid-reading.</tspan>
        </text>
      </svg>
    </section>
  );
}

export function MasterNumberExplorer() {
  const [activeValue, setActiveValue] = useState<MasterNumberId>(11);
  const [convention, setConvention] = useState<ConventionId>("preserve");
  const active = getMasterNumber(activeValue);
  const color = grahaColor(active);
  const selectedConvention = CONVENTIONS.find((item) => item.id === convention) ?? CONVENTIONS[0];

  const reset = () => {
    setActiveValue(11);
    setConvention("preserve");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="master-number-explorer"
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
            Master number explorer
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Preserve 11/22/33 or reduce to the root graha digit
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose a master number, select a convention, and see how the reading changes without turning intensity into special destiny.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset 11
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {MASTER_NUMBERS.map((item) => {
          const itemColor = grahaColor(item);
          const selected = item.value === activeValue;
          return (
            <button key={item.value} type="button" onClick={() => setActiveValue(item.value)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(itemColor, "14") : SURFACE, border: `1px solid ${selected ? itemColor : HAIRLINE}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: itemColor, letterSpacing: "0.08em" }}>Master {item.value}</p>
                  <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    <IAST>{item.label}</IAST>
                  </h3>
                </div>
                <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: itemColor }}>{item.devanagari}</Devanagari>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{item.underlying} intensified</p>
            </button>
          );
        })}
      </section>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2">
        {CONVENTIONS.map((item) => {
          const selected = item.id === convention;
          return (
            <button key={item.id} type="button" onClick={() => setConvention(item.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(item.color, "14") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: selected ? item.color : INK_PRIMARY }}>{item.label}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{item.note}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <MasterFlowSvg activeValue={activeValue} convention={convention} />

          <article className="grid min-w-0 gap-4 lg:grid-cols-2">
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={17} color={GREEN} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Amplified strengths</p>
              </div>
              <div className="grid min-w-0 gap-2">
                {active.strengths.map((strength) => (
                  <p key={strength} className="m-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>{strength}</p>
                ))}
              </div>
            </section>

            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert size={17} color={VERMILION} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Amplified shadows</p>
              </div>
              <div className="grid min-w-0 gap-2">
                {active.shadows.map((shadow) => (
                  <p key={shadow} className="m-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>{shadow}</p>
                ))}
              </div>
            </section>
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "12"), border: `1px solid ${color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <BadgeCheck size={17} color={color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Active reading</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {convention === "preserve" ? `Master ${active.value}` : active.underlying}
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{convention === "preserve" ? active.title : `Reduced root: ${active.underlying}`}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{convention === "preserve" ? active.intensification : `Continue ${active.value} -> ${active.reducesTo} and read the foundational graha register.`}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(selectedConvention.color, "10"), border: `1px solid ${selectedConvention.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Hash size={17} color={selectedConvention.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedConvention.color, letterSpacing: "0.08em" }}>Convention</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selectedConvention.label}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{selectedConvention.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Layering rule</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Master reading includes the root digit; it does not replace it.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Preserve gives root plus intensification. Reduce gives the root graha register only.</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Over-claim guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{active.overclaim}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{active.honestFrame}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Chapter 2 completion</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              The nine single digits are now complete; master numbers are the special-case convention layered on top.
            </p>
          </div>
          <Table2 className="shrink-0" size={28} color={GOLD} />
        </div>
      </section>
    </div>
  );
}
