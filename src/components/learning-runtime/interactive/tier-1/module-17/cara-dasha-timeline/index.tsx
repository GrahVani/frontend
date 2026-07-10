"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, GitBranch, Layers3, RotateCcw, ScanSearch, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  APPLICATION_PRESETS,
  FRAME_COLORS,
  READING_STACK,
  buildAntarSteps,
  buildWorkedTimeline,
  findRunningAntar,
  findRunningStep,
  frameHouse,
  frameLabel,
  houseTheme,
  type ReferenceFrame,
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

function formatAge(value: number) {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function TimelineSvg({
  age,
  onAgeChange,
}: {
  age: number;
  onAgeChange: (age: number) => void;
}) {
  const timeline = buildWorkedTimeline();
  const totalYears = timeline[timeline.length - 1].endAge;
  const active = findRunningStep(age, timeline);
  const markerX = 72 + (age / totalYears) * 756;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 270" className="h-auto w-full min-w-0" role="img" aria-label="Cara dasha cumulative age timeline">
        <rect x="24" y="24" width="852" height="210" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="56" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SUM PERIODS UNTIL THE TOTAL FIRST EXCEEDS THE AGE
        </text>
        <line x1="72" y1="132" x2="828" y2="132" stroke={HAIRLINE} strokeWidth="12" strokeLinecap="round" />

        {timeline.map((step) => {
          const x1 = 72 + (step.startAge / totalYears) * 756;
          const x2 = 72 + (step.endAge / totalYears) * 756;
          const selected = step.order === active.order;
          return (
            <g
              key={step.order}
              role="button"
              tabIndex={0}
              onClick={() => onAgeChange(Math.min(step.endAge - 0.1, step.startAge + step.years / 2))}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onAgeChange(Math.min(step.endAge - 0.1, step.startAge + step.years / 2));
              }}
              style={{ cursor: "pointer" }}
            >
              <rect x={x1} y="109" width={Math.max(8, x2 - x1)} height="46" rx="10" fill={selected ? wash(step.rashi.color, "22") : SURFACE} stroke={selected ? step.rashi.color : HAIRLINE} strokeWidth={selected ? 2.4 : 1.1} />
              <text x={(x1 + x2) / 2} y="128" textAnchor="middle" fill={selected ? step.rashi.color : INK_PRIMARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.order}
              </text>
              <text x={(x1 + x2) / 2} y="145" textAnchor="middle" fill={INK_SECONDARY} fontSize="8.5" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {step.startAge}-{step.endAge}
              </text>
            </g>
          );
        })}

        <line x1={markerX} y1="82" x2={markerX} y2="188" stroke={active.rashi.color} strokeWidth="3" strokeLinecap="round" />
        <circle cx={markerX} cy="82" r="13" fill={SURFACE} stroke={active.rashi.color} strokeWidth="3" />
        <text x={markerX} y="86" textAnchor="middle" fill={active.rashi.color} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {formatAge(age)}
        </text>
        <rect x="254" y="190" width="392" height="28" rx="12" fill={SURFACE} stroke={HAIRLINE} />
        <text x="450" y="209" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          active window: sign {active.order}, years {active.startAge}-{active.endAge}
        </text>
      </svg>
    </section>
  );
}

export function CaraDashaTimeline() {
  const [age, setAge] = useState(40);
  const [frame, setFrame] = useState<ReferenceFrame>("lagna");
  const timeline = useMemo(() => buildWorkedTimeline(), []);
  const active = findRunningStep(age, timeline);
  const antar = findRunningAntar(age, active);
  const antarSteps = buildAntarSteps(active);
  const house = frameHouse(active, frame);
  const frameColor = FRAME_COLORS[frame];

  function reset() {
    setAge(40);
    setFrame("lagna");
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="cara-dasha-timeline"
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
            Cara dasha timeline
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Locate the running sign, then read it
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Move the age marker through the worked sequence, then inspect houses, karakas, rashi-drishti, argala, and antar timing.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset age 40
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {APPLICATION_PRESETS.map((preset) => {
            const activePreset = Math.abs(age - preset.age) < 0.1;
            return (
              <button key={preset.slug} type="button" onClick={() => setAge(preset.age)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: activePreset ? wash(GOLD, "12") : SURFACE, border: `1px solid ${activePreset ? GOLD : HAIRLINE}` }}>
                {activePreset ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: activePreset ? GOLD : INK_PRIMARY }}>{preset.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{preset.note}</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Age marker</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Drag through the cumulative timeline.</p>
            </div>
            <p className="m-0 text-2xl font-semibold" style={{ color: active.rashi.color, fontFamily: "var(--font-cormorant), serif" }}>
              age {formatAge(age)}
            </p>
          </div>
          <input aria-label="Age marker" type="range" min="0" max="90" step="0.5" value={age} onChange={(event) => setAge(Number(event.target.value))} className="w-full min-w-0" />
        </section>

        <TimelineSvg age={age} onAgeChange={setAge} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(active.rashi.color, "10"), border: `1px solid ${active.rashi.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: active.rashi.color, letterSpacing: "0.08em" }}>
                  Running maha-dasha
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  Sign {active.order}: <IAST>{active.rashi.name}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  Years {active.startAge}-{active.endAge}; age {formatAge(age)} is {formatAge(age - active.startAge)} years into the period.
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{active.verdict}</p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: active.rashi.color }}>{active.rashi.devanagari}</Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <ScanSearch size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Reference frame</p>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-2">
              {(["lagna", "arudha"] as ReferenceFrame[]).map((item) => {
                const selected = frame === item;
                return (
                  <button key={item} type="button" onClick={() => setFrame(item)} className="min-w-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: selected ? wash(FRAME_COLORS[item], "12") : SURFACE_2, border: `1px solid ${selected ? FRAME_COLORS[item] : HAIRLINE}`, color: selected ? FRAME_COLORS[item] : INK_SECONDARY }}>
                    {frameLabel(item)}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-4xl font-semibold" style={{ color: frameColor, fontFamily: "var(--font-cormorant), serif" }}>
              H{house}
            </p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{houseTheme(house)}</p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              {frame === "lagna" ? "Experienced theme from the rising sign." : "Materialized result from Arudha Lagna."}
            </p>
          </article>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-4">
          {READING_STACK.map((item) => (
            <article key={item.label} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <Layers3 size={17} color={GOLD} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
            </article>
          ))}
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <GitBranch size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Reading verdict stack</p>
            </div>
            <div className="grid min-w-0 gap-3">
              {[
                ["Karaka / occupant", `${active.karakaCue} ${active.occupantCue}`],
                ["Rashi-drishti", active.drishtiCue],
                ["Argala", active.argalaCue],
              ].map(([label, text]) => (
                <div key={label} className="min-w-0 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.06em" }}>{label}</p>
                  <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{text}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(antar.rashi.color, "10"), border: `1px solid ${antar.rashi.color}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: antar.rashi.color, letterSpacing: "0.08em" }}>Antar-rashi refinement</p>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              Antar {antar.order}: <IAST>{antar.rashi.name}</IAST>
            </h3>
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              Offset {antar.startOffset.toFixed(1)}-{antar.endOffset.toFixed(1)} inside this maha.
            </p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{antar.cue}</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Antar windows inside active maha</p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["#", "Antar sign", "Offset", "Cue"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {antarSteps.map((step) => {
                  const selected = step.order === antar.order;
                  return (
                    <tr key={step.order} style={{ background: selected ? wash(step.rashi.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: selected ? step.rashi.color : GOLD }}>{step.order}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: selected ? step.rashi.color : INK_PRIMARY }}>{step.rashi.name}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{step.startOffset.toFixed(1)}-{step.endOffset.toFixed(1)} yr</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{step.cue}</td>
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

