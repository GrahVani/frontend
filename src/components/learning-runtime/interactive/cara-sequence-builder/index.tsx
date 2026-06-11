"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, CircleDot, Clock3, Moon, RotateCcw, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  RASHI_ASCII_NAMES,
  SEQUENCE_PRESETS,
  buildSequenceTimeline,
  getRashiName,
  getRashiShortName,
  periodForRashi,
  sequenceDirection,
  totalYearsForSequence,
  type AnchorMode,
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

function SequenceRibbonSvg({
  startIndex,
  activeOrder,
  onSelectOrder,
}: {
  startIndex: number;
  activeOrder: number;
  onSelectOrder: (order: number) => void;
}) {
  const steps = buildSequenceTimeline(startIndex);
  const direction = sequenceDirection(startIndex);
  const active = steps[activeOrder - 1] ?? steps[0];
  const directionColor = direction === "forward" ? grahas.budha.primary : grahas.shani.primary;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 300" className="h-auto w-full min-w-0" role="img" aria-label="Twelve rashi Cara sequence ribbon">
        <rect x="24" y="24" width="852" height="242" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="56" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          START SIGN FIXES THE WHOLE 12-RASHI ORDER
        </text>
        <path d="M110 119 H790 M790 119 C830 119 830 191 790 191 H110" fill="none" stroke={HAIRLINE} strokeWidth="5" strokeLinecap="round" />
        <path d={direction === "forward" ? "M110 119 H790" : "M790 119 H110"} fill="none" stroke={directionColor} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        <path d={direction === "forward" ? "M790 191 H110" : "M110 191 H790"} fill="none" stroke={directionColor} strokeWidth="3" strokeLinecap="round" opacity="0.75" />

        {steps.map((step, index) => {
          const col = index % 6;
          const row = Math.floor(index / 6);
          const x = row === 0 ? 96 + col * 142 : 806 - col * 142;
          const y = row === 0 ? 119 : 191;
          const selected = step.order === active.order;
          return (
            <g
              key={step.rashi.index}
              role="button"
              tabIndex={0}
              onClick={() => onSelectOrder(step.order)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelectOrder(step.order);
              }}
              style={{ cursor: "pointer" }}
            >
              <rect x={x - 46} y={y - 25} width="92" height="50" rx="12" fill={selected ? wash(step.rashi.color, "18") : SURFACE} stroke={selected ? step.rashi.color : HAIRLINE} strokeWidth={selected ? 2.4 : 1.1} />
              <text x={x - 32} y={y - 7} textAnchor="middle" fill={selected ? step.rashi.color : GOLD} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.order}
              </text>
              <text x={x + 6} y={y - 8} textAnchor="middle" fill={selected ? step.rashi.color : INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {getRashiShortName(step.rashi.index)}
              </text>
              <text x={x + 6} y={y + 10} textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.periodYears} yr
              </text>
            </g>
          );
        })}

        <rect x="250" y="228" width="400" height="28" rx="12" fill={SURFACE} stroke={HAIRLINE} />
        <text x="450" y="247" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {direction === "forward" ? "odd-footed anchor: forward sequence" : "even-footed anchor: backward sequence"}
        </text>
      </svg>
    </section>
  );
}

export function CaraSequenceBuilder() {
  const [anchorMode, setAnchorMode] = useState<AnchorMode>("lagna");
  const [lagnaIndex, setLagnaIndex] = useState(2);
  const [moonIndex, setMoonIndex] = useState(3);
  const [activeOrder, setActiveOrder] = useState(1);

  const startIndex = anchorMode === "lagna" ? lagnaIndex : moonIndex;
  const direction = sequenceDirection(startIndex);
  const steps = useMemo(() => buildSequenceTimeline(startIndex), [startIndex]);
  const activeStep = steps[activeOrder - 1] ?? steps[0];
  const totalYears = totalYearsForSequence(startIndex);
  const anchorRashi = steps[0].rashi;

  function applyPreset(preset: (typeof SEQUENCE_PRESETS)[number]) {
    setAnchorMode(preset.anchorMode);
    setLagnaIndex(preset.lagnaIndex);
    setMoonIndex(preset.moonIndex);
    setActiveOrder(1);
  }

  function reset() {
    applyPreset(SEQUENCE_PRESETS[0]);
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="cara-sequence-builder"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cara sequence builder</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Anchor once, then walk all twelve rashis
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose Lagna or Moon as the starting sign, then watch the start sign parity fix the direction for the complete twelve-sign sequence.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Mithuna
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {SEQUENCE_PRESETS.map((preset) => {
            const active = preset.anchorMode === anchorMode && preset.lagnaIndex === lagnaIndex && preset.moonIndex === moonIndex;
            return (
              <button key={preset.slug} type="button" onClick={() => applyPreset(preset)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(GOLD, "12") : SURFACE, border: `1px solid ${active ? GOLD : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: active ? GOLD : INK_PRIMARY }}>{preset.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{preset.note}</p>
              </button>
            );
          })}
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Clock3 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Anchor controls</p>
            </div>
            <div className="grid min-w-0 gap-3 md:grid-cols-2">
              {[
                { value: "lagna" as const, label: "Lagna anchor", icon: ArrowRight },
                { value: "moon" as const, label: "Moon anchor", icon: Moon },
              ].map((item) => {
                const Icon = item.icon;
                const active = anchorMode === item.value;
                return (
                  <button key={item.value} type="button" onClick={() => setAnchorMode(item.value)} className="min-w-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(GOLD, "12") : SURFACE_2, border: `1px solid ${active ? GOLD : HAIRLINE}`, color: active ? GOLD : INK_SECONDARY }}>
                    <span className="inline-flex items-center gap-2"><Icon size={16} />{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
              {[
                { label: "Lagna sign", value: lagnaIndex, onChange: setLagnaIndex },
                { label: "Moon sign", value: moonIndex, onChange: setMoonIndex },
              ].map((field) => (
                <label key={field.label} className="min-w-0">
                  <span className="mb-1 block text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>{field.label}</span>
                  <select value={field.value} onChange={(event) => { field.onChange(Number(event.target.value)); setActiveOrder(1); }} className="w-full min-w-0 rounded-lg px-3 py-2 text-sm" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                    {RASHI_ASCII_NAMES.map((name, index) => <option key={name} value={index}>{name}</option>)}
                  </select>
                </label>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(anchorRashi.color, "10"), border: `1px solid ${anchorRashi.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: anchorRashi.color, letterSpacing: "0.08em" }}>Sequence decision</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  Start from <IAST>{getRashiName(startIndex)}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  {direction === "forward" ? "Odd-footed start: move forward." : "Even-footed start: move backward."}
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  The sequence direction is fixed once by the anchor sign. Individual sign parity is used later for each period length.
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: anchorRashi.color }}>{anchorRashi.devanagari}</Devanagari>
            </div>
          </article>
        </section>

        <SequenceRibbonSvg startIndex={startIndex} activeOrder={activeOrder} onSelectOrder={setActiveOrder} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeStep.rashi.color, "10"), border: `1px solid ${activeStep.rashi.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: activeStep.rashi.color, letterSpacing: "0.08em" }}>Selected period {activeStep.order}</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{getRashiName(activeStep.rashi.index)}</IAST> dasha
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Runs from year {activeStep.cumulativeStart} to {activeStep.cumulativeEnd}.</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Period length: {activeStep.periodYears} years, from Lesson 17.6.2 sign-to-lord counting.</p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: activeStep.rashi.color }}>{activeStep.rashi.devanagari}</Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              {direction === "forward" ? <ArrowRight size={17} color={GOLD} /> : <ArrowLeft size={17} color={GOLD} />}
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Total timeline</p>
            </div>
            <p className="mt-3 text-4xl font-semibold" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>{totalYears}</p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>years across all twelve rashis</p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>This sample ledger lands in the lesson band of roughly 84-96 years, not the fixed 120-year Vimshottari cycle.</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Twelve-rashi sequence ledger</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>Showing 12 of 12</p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["#", "Dasha sign", "Direction job", "L02 period", "Timeline"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => {
                  const active = step.order === activeOrder;
                  const period = periodForRashi(step.rashi.index);
                  return (
                    <tr key={step.rashi.index} onClick={() => setActiveOrder(step.order)} style={{ background: active ? wash(step.rashi.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
                      <td className="px-4 py-3 font-bold" style={{ color: active ? step.rashi.color : GOLD }}>{step.order}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: active ? step.rashi.color : INK_PRIMARY }}>{getRashiName(step.rashi.index)}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{step.order === 1 ? "anchor fixes sequence" : "follows fixed anchor direction"}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{step.periodYears} yr via {period.direction}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>year {step.cumulativeStart}-{step.cumulativeEnd}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
