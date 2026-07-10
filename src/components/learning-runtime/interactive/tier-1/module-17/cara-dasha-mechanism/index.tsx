"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, Clock, GitCompare, Layers3, RotateCcw, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { CARA_ARCHITECTURE, MECHANISM_RASHIS, VIMSHOTTARI_ARCHITECTURE, buildRashiSequence, getRashi, type ClockMode } from "./data";

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

function RashiClockSvg({
  startIndex,
  activeIndex,
  onSelect,
}: {
  startIndex: number;
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  const sequence = buildRashiSequence(startIndex);
  const active = getRashi(activeIndex);
  const centerX = 450;
  const centerY = 164;
  const radiusX = 310;
  const radiusY = 88;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 350" className="h-auto w-full min-w-0" role="img" aria-label="Cara Dasha sign clock with sign periods and sign sub-periods">
        <rect x="24" y="24" width="852" height="300" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="46" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          CARA DAŚĀ IS A SIGN CLOCK
        </text>
        <ellipse cx={centerX} cy={centerY} rx={radiusX} ry={radiusY} fill="none" stroke={HAIRLINE} strokeWidth="8" />
        <ellipse cx={centerX} cy={centerY} rx="122" ry="42" fill={SURFACE} stroke={active.color} strokeWidth="2.5" />
        <text x={centerX} y={centerY - 6} textAnchor="middle" fill={active.color} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          MAHĀ-RĀŚI DAŚĀ
        </text>
        <text x={centerX} y={centerY + 20} textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {active.name}
        </text>

        {sequence.map((rashi, step) => {
          const angle = -Math.PI / 2 + (step / 12) * Math.PI * 2;
          const x = centerX + Math.cos(angle) * radiusX;
          const y = centerY + Math.sin(angle) * radiusY;
          const selected = rashi.index === active.index;
          return (
            <g
              key={rashi.index}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(rashi.index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(rashi.index);
              }}
              style={{ cursor: "pointer" }}
            >
              <circle cx={x} cy={y} r={selected ? 24 : 22} fill={selected ? wash(rashi.color, "18") : SURFACE} stroke={selected ? rashi.color : HAIRLINE} strokeWidth={selected ? 3 : 1.3} />
              <text x={x} y={y - 2} textAnchor="middle" fill={selected ? rashi.color : INK_PRIMARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {rashi.iast}
              </text>
              <text x={x} y={y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                sign {step + 1}
              </text>
            </g>
          );
        })}

        <line x1="286" y1="280" x2="614" y2="280" stroke={HAIRLINE} strokeWidth="4" strokeLinecap="round" />
        <text x="450" y="300" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          inside every main sign-period: twelve antar-rāśi sub-periods, still signs
        </text>
      </svg>
    </section>
  );
}

export function CaraDashaMechanism() {
  const [mode, setMode] = useState<ClockMode>("cara");
  const [startIndex, setStartIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = getRashi(activeIndex);
  const activeLord = grahas[active.lord];
  const activeOccupant = grahas[active.occupant];

  function reset() {
    setMode("cara");
    setStartIndex(0);
    setActiveIndex(0);
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="cara-dasha-mechanism"
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
            Cara daśā mechanism
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            A daśā that belongs to rāśis, not planets
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore the architecture only: sign periods, sign sub-periods, variable sign-to-lord lengths, and planets as occupants or lords.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset to Meṣa
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          {[
            { value: "cara" as const, title: "Cara sign-clock", text: "Periods are twelve rāśis; planets do not hold periods." },
            { value: "vimshottari" as const, title: "Vimśottarī contrast", text: "Periods are nine planets with fixed 120-year constants." },
          ].map((item) => {
            const activeMode = mode === item.value;
            return (
              <button key={item.value} type="button" onClick={() => setMode(item.value)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: activeMode ? wash(GOLD, "12") : SURFACE, border: `1px solid ${activeMode ? GOLD : HAIRLINE}` }}>
                {activeMode ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: activeMode ? GOLD : INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </button>
            );
          })}
        </section>

        <RashiClockSvg startIndex={startIndex} activeIndex={activeIndex} onSelect={setActiveIndex} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(active.color, "10"), border: `1px solid ${active.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: active.color, letterSpacing: "0.08em" }}>
                  Running sign-period
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{active.iast}</IAST> daśā
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  The period-holder is the sign itself.
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  Read occupants, sign aspects, and the lord as supporting evidence. Do not rename this as {activeLord.iast} daśā.
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: active.color }}>
                {active.devanagari}
              </Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Layers3 size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>How planets enter</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Lord: <strong style={{ color: activeLord.primary }}>{activeLord.iast}</strong>; occupant example: <strong style={{ color: activeOccupant.primary }}>{activeOccupant.iast}</strong>.
            </p>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>{active.durationCue}. {active.aspectCue}.</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Clock size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Choose conceptual starting sign
            </p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {MECHANISM_RASHIS.map((rashi) => {
              const activeStart = rashi.index === startIndex;
              return (
                <button
                  key={rashi.index}
                  type="button"
                  onClick={() => {
                    setStartIndex(rashi.index);
                    setActiveIndex(rashi.index);
                  }}
                  className="min-w-0 rounded-lg px-3 py-2 text-sm font-bold"
                  style={{ background: activeStart ? wash(rashi.color, "12") : SURFACE_2, border: `1px solid ${activeStart ? rashi.color : HAIRLINE}`, color: activeStart ? rashi.color : INK_SECONDARY }}
                >
                  {rashi.iast}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-4">
          {(mode === "cara" ? CARA_ARCHITECTURE : VIMSHOTTARI_ARCHITECTURE).map((item) => (
            <article key={item.label} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{item.label}</p>
              <p className="mt-2 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{item.value}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.note}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Mechanism contrast
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Feature", "Cara daśā", "Vimśottarī daśā", "Lesson discipline"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Period-holder", "Sign", "Planet", "Do not translate Meṣa daśā into Mars daśā."],
                  ["Sub-period", "Antar-rāśi", "Bhukti planet", "Cara stays sign-based at every level."],
                  ["Length", "Variable by sign-to-lord count", "Fixed constants", "Computation begins in the next lesson."],
                  ["Anchor", "Jaimini sign grammar", "Moon nakṣatra", "Use each clock for its own architecture."],
                ].map((row) => (
                  <tr key={row[0]} style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    {row.map((cell, index) => (
                      <td key={cell} className={index === 0 ? "px-4 py-3 font-bold" : "px-4 py-3"} style={{ color: index === 0 ? GOLD : INK_SECONDARY }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {[
            { icon: GitCompare, title: "Architectural contrast", text: "Cara and Vimśottarī are different clocks, not variants of one clock." },
            { icon: Layers3, title: "Nested signs", text: "Mahā-rāśi daśā contains antar-rāśi sub-periods." },
            { icon: Clock, title: "Deferred arithmetic", text: "Durations and sequence rules are taught in Lessons 17.6.2 and 17.6.3." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={17} color={GOLD} />
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
