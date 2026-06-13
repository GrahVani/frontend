"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, GitCompareArrows, Orbit, RotateCcw, ShieldAlert } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { DIGIT_REGISTERS, type VectorKey } from "../numerology-compatibility-calculator/data";
import {
  INTEGRATION_VECTORS,
  PRESET_PROFILES,
  buildVectorReading,
  classifyAlignment,
  strengthLabel,
  strengthShortLabel,
  type AlignmentReading,
  type ChartStrength,
  type VectorReading,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;
const INDIGO = "#2C2C3E";
const AMBER = "#C98B12";

const readableGrahaColor: Record<number, string> = {
  1: "#C98B12",
  2: "#2F6FB2",
  3: "#C17A15",
  4: "#555866",
  5: "#2F7D52",
  6: "#356C96",
  7: "#7A3E4A",
  8: "#2C2C3E",
  9: "#C8412E",
};

const toneColor: Record<AlignmentReading["tone"], string> = {
  support: GREEN,
  caution: VERMILION,
  mixed: AMBER,
  structural: BLUE,
};

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function strengthColor(strength: ChartStrength) {
  if (strength === "strong") return GREEN;
  if (strength === "weak") return VERMILION;
  return AMBER;
}

function vectorLabel(key: VectorKey) {
  return INTEGRATION_VECTORS.find((item) => item.key === key)?.label ?? key;
}

function IntegrationSvg({ readings, alignment }: { readings: VectorReading[]; alignment: AlignmentReading }) {
  const centerColor = toneColor[alignment.tone];
  const points = [
    { x: 168, y: 122, reading: readings[0] },
    { x: 380, y: 246, reading: readings[1] },
    { x: 592, y: 122, reading: readings[2] },
  ];

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 360" className="h-auto w-full min-w-0" role="img" aria-label="Chart numerology integration triangle">
        <rect x="18" y="18" width="724" height="324" rx="22" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="54" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          THREE NUMBERS, THREE CHART CROSS-REFERENCES
        </text>
        <path d="M168 122 L380 246 L592 122 Z" fill="none" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="10 12" />

        <circle cx="380" cy="166" r="76" fill={SURFACE} stroke={centerColor} strokeWidth="4" />
        <text x="380" y="142" textAnchor="middle" fill={centerColor} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {alignment.label}
        </text>
        <text x="380" y="178" textAnchor="middle" fill={INK_PRIMARY} fontSize="29" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          register-fit
        </text>
        <text x="380" y="207" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          chart context, not life outcome
        </text>

        {points.map(({ x, y, reading }) => {
          const color = readableGrahaColor[reading.digit];
          const statusColor = strengthColor(reading.strength);
          const vector = vectorLabel(reading.key);
          return (
            <g key={reading.key}>
              <rect x={x - 86} y={y - 48} width="172" height="96" rx="18" fill={wash(color, "10")} stroke={statusColor} strokeWidth="2.5" />
              <text x={x} y={y - 22} textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{vector}</text>
              <text x={x} y={y + 7} textAnchor="middle" fill={color} fontSize="25" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {reading.digit} {reading.graha}
              </text>
              <text x={x} y={y + 31} textAnchor="middle" fill={statusColor} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {strengthShortLabel(reading.strength)}
              </text>
            </g>
          );
        })}

        <rect x="140" y="304" width="480" height="34" rx="17" fill={SURFACE} stroke={centerColor} />
        <text x="380" y="326" textAnchor="middle" fill={centerColor} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Refuse: mismatch causes life-problems. Use: cross-reference information.
        </text>
      </svg>
    </section>
  );
}

export function ChartNumerologyIntegrationTool() {
  const firstPreset = PRESET_PROFILES[0];
  const [mulanka, setMulanka] = useState(firstPreset.mulanka);
  const [bhagyanka, setBhagyanka] = useState(firstPreset.bhagyanka);
  const [namanka, setNamanka] = useState(firstPreset.namanka);
  const [strengths, setStrengths] = useState<Record<VectorKey, ChartStrength>>(firstPreset.strengths);
  const [structuralDivergence, setStructuralDivergence] = useState(false);

  const readings = useMemo(
    () => [
      buildVectorReading("mulanka", mulanka, strengths.mulanka),
      buildVectorReading("bhagyanka", bhagyanka, strengths.bhagyanka),
      buildVectorReading("namanka", namanka, strengths.namanka),
    ],
    [bhagyanka, mulanka, namanka, strengths],
  );
  const alignment = useMemo(() => classifyAlignment(readings, structuralDivergence), [readings, structuralDivergence]);
  const activeColor = toneColor[alignment.tone];

  const setStrength = (key: VectorKey, strength: ChartStrength) => {
    setStrengths((current) => ({ ...current, [key]: strength }));
  };

  const loadPreset = (id: string) => {
    const preset = PRESET_PROFILES.find((item) => item.id === id) ?? PRESET_PROFILES[0];
    setMulanka(preset.mulanka);
    setBhagyanka(preset.bhagyanka);
    setNamanka(preset.namanka);
    setStrengths(preset.strengths);
    setStructuralDivergence(preset.id === "mixed" ? true : false);
  };

  const reset = () => loadPreset(firstPreset.id);

  return (
    <div
      className="w-full min-w-0"
      data-interactive="chart-numerology-integration-tool"
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
            Chart-numerology integration
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Cross-reference numbers with natal graha strength
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Map Mulanka, Bhagyanka, and Name-number to chart indicators, then classify the alignment without turning it into a life-outcome claim.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset hook chart
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {PRESET_PROFILES.map((preset) => (
          <button key={preset.id} type="button" onClick={() => loadPreset(preset.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <span className="block text-sm font-bold" style={{ color: INK_PRIMARY }}>{preset.label}</span>
            <span className="mt-2 block text-xs font-semibold" style={{ color: INK_SECONDARY }}>
              {preset.mulanka} / {preset.bhagyanka} / {preset.namanka}
            </span>
          </button>
        ))}
      </section>

      <section className="mb-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Orbit size={18} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Three personal numbers</p>
          </div>
          <div className="grid min-w-0 gap-3 md:grid-cols-3">
            {[
              ["mulanka", mulanka, setMulanka],
              ["bhagyanka", bhagyanka, setBhagyanka],
              ["namanka", namanka, setNamanka],
            ].map(([key, value, setter]) => {
              const vectorKey = key as VectorKey;
              const digit = value as number;
              const fn = setter as (value: number) => void;
              return (
                <label key={vectorKey} className="min-w-0">
                  <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>{vectorLabel(vectorKey)}</span>
                  <select value={digit} onChange={(event) => fn(Number(event.target.value))} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: wash(readableGrahaColor[digit], "10"), border: `1px solid ${readableGrahaColor[digit]}`, color: INK_PRIMARY }}>
                    {DIGIT_REGISTERS.map((item) => <option key={item.digit} value={item.digit}>{item.digit} - {item.graha}</option>)}
                  </select>
                </label>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <GitCompareArrows size={18} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Structural divergence</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {[false, true].map((value) => (
              <button key={String(value)} type="button" onClick={() => setStructuralDivergence(value)} className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-bold" style={{ background: structuralDivergence === value ? wash(BLUE, "12") : SURFACE_2, border: `1px solid ${structuralDivergence === value ? BLUE : HAIRLINE}`, color: structuralDivergence === value ? BLUE : INK_PRIMARY }}>
                {value ? "Strong chart grahas differ" : "Registers mirror chart"}
              </button>
            ))}
          </div>
          <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>
            Use this when the chart&apos;s strongest grahas are not one of the three personal-number registers.
          </p>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-4 lg:grid-cols-3">
        {readings.map((reading) => {
          const vector = INTEGRATION_VECTORS.find((item) => item.key === reading.key) ?? INTEGRATION_VECTORS[0];
          const color = readableGrahaColor[reading.digit];
          return (
            <article key={reading.key} className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{vector.shortLabel}</p>
                  <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    <IAST>{reading.digit} {reading.graha}</IAST>
                  </h3>
                </div>
                <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: readableGrahaColor[reading.digit] }}>
                  {grahas[reading.slug].devanagari}
                </Devanagari>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>{vector.chartReference}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {(["strong", "mixed", "weak"] as ChartStrength[]).map((strength) => {
                  const selected = reading.strength === strength;
                  const sColor = strengthColor(strength);
                  return (
                    <button key={strength} type="button" onClick={() => setStrength(reading.key, strength)} className="rounded-lg px-2 py-2 text-xs font-black" style={{ background: selected ? wash(sColor, "14") : SURFACE, border: `1px solid ${selected ? sColor : HAIRLINE}`, color: selected ? sColor : INK_PRIMARY }}>
                      {strengthShortLabel(strength)}
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <IntegrationSvg readings={readings} alignment={alignment} />

          <article className="grid min-w-0 gap-3 md:grid-cols-3">
            {readings.map((reading) => (
              <section key={reading.key} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: strengthColor(reading.strength), letterSpacing: "0.08em" }}>{strengthLabel(reading.strength)}</p>
                <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                  <strong style={{ color: INK_PRIMARY }}>{vectorLabel(reading.key)} {reading.digit}</strong> foregrounds {reading.role}; chart context decides how easy that register is to use.
                </p>
              </section>
            ))}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeColor, "12"), border: `1px solid ${activeColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <BadgeCheck size={17} color={activeColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: activeColor, letterSpacing: "0.08em" }}>Alignment class</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {alignment.label}
            </h3>
            <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{alignment.headline}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{alignment.explanation}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Over-claim guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Refuse: chart-numerology mismatch causes life-problems.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Use: chart-numerology mapping gives register-fit information within a multifactorial chart reading.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Practitioner line</p>
            <p className="mb-0 mt-2 text-sm font-semibold" style={{ color: INK_PRIMARY }}>{alignment.practitionerLine}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Four configurations</p>
            <div className="mt-3 grid min-w-0 gap-2">
              {[
                ["Convergent strong", GREEN],
                ["Convergent weak", VERMILION],
                ["Divergent mixed", AMBER],
                ["Structural divergence", BLUE],
              ].map(([label, color]) => (
                <div key={label} className="min-w-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: wash(color, "10"), border: `1px solid ${HAIRLINE}`, color: color }}>
                  {label}
                </div>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(INDIGO, "08"), border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Bidirectional discipline</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Chart informs numerology by grounding each register. Numerology informs chart by pointing attention to grahas the reader might underweight.
            </p>
          </article>
        </aside>
      </section>
    </div>
  );
}
