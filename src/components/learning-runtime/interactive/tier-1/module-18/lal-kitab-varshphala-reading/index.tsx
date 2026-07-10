"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, RotateCcw, ShieldCheck, Sparkles, Stethoscope } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { READING_PLANETS, READING_STEPS, STATE_RULES, getReadingStep, type ReadingStepKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
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

function StateRoleDiagram({ activeStep, selectedPlanet }: { activeStep: ReadingStepKey; selectedPlanet: string }) {
  const step = getReadingStep(activeStep);
  const points = [
    { id: "jupiter", x: 155, y: 168 },
    { id: "venus", x: 270, y: 138 },
    { id: "saturn", x: 385, y: 168 },
    { id: "mercury", x: 500, y: 138 },
    { id: "sun", x: 615, y: 168 },
  ];

  return (
    <section className="w-full min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 370" className="h-auto w-full min-w-0" role="img" aria-label="Lal Kitab annual reading state to theme and upaya map">
        <rect x="20" y="30" width="720" height="310" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ANNUAL STATES DRIVE THEMES AND UPAYA
        </text>
        <path d="M120 238 H640" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <rect x="80" y="258" width="280" height="50" rx="16" fill={wash(GREEN, "10")} stroke={GREEN} />
        <text x="220" y="290" textAnchor="middle" fill={GREEN} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          active planets set year themes
        </text>
        <rect x="420" y="258" width="280" height="50" rx="16" fill={wash(VERMILION, "10")} stroke={VERMILION} />
        <text x="560" y="290" textAnchor="middle" fill={VERMILION} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          dysfunctional planets trigger upaya
        </text>

        {points.map((point) => {
          const planet = READING_PLANETS.find((item) => item.id === point.id) ?? READING_PLANETS[0];
          const selected = selectedPlanet === planet.id;
          const dysfunctional = planet.state !== "active";
          const targetX = dysfunctional
            ? { saturn: 460, mercury: 560, sun: 660 }[planet.id] ?? 560
            : { jupiter: 170, venus: 310 }[planet.id] ?? 240;
          return (
            <g key={planet.id}>
              <line x1={point.x} y1={point.y + 30} x2={targetX} y2="258" stroke={planet.color} strokeWidth={selected ? 2.6 : 1.4} opacity={selected ? 0.8 : 0.35} />
              <circle cx={point.x} cy={point.y} r={selected ? 40 : 34} fill={selected ? wash(planet.color, "18") : SURFACE} stroke={selected ? planet.color : HAIRLINE} strokeWidth={selected ? 2.6 : 1.4} />
              <text x={point.x} y={point.y - 4} textAnchor="middle" fill={readableColor(planet.color)} fontSize={15} fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {planet.label}
              </text>
              <text x={point.x} y={point.y + 16} textAnchor="middle" fill={INK_SECONDARY} fontSize={12} fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                H{planet.house} {planet.state}
              </text>
            </g>
          );
        })}

        <rect x="242" y="70" width="276" height="34" rx="17" fill={wash(step.color, "10")} stroke={step.color} />
        <text x="380" y="93" textAnchor="middle" fill={step.color} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Current step: {step.label}
        </text>
      </svg>
    </section>
  );
}

export function LalKitabVarshphalaReading() {
  const [activeStep, setActiveStep] = useState<ReadingStepKey>("states");
  const [selectedPlanet, setSelectedPlanet] = useState("jupiter");
  const step = getReadingStep(activeStep);
  const planet = READING_PLANETS.find((item) => item.id === selectedPlanet) ?? READING_PLANETS[0];

  const themePlanets = useMemo(() => READING_PLANETS.filter((item) => item.state === "active"), []);
  const remedyPlanets = useMemo(() => READING_PLANETS.filter((item) => item.state !== "active"), []);
  const crossCheckColor = planet.natalSupport === "supports" ? GREEN : planet.natalSupport === "cautions" ? VERMILION : GOLD;

  const reset = () => {
    setActiveStep("states");
    setSelectedPlanet("jupiter");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-varshphala-reading"
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
            Lal Kitab varshphala reading
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Diagnose states, name themes, prescribe the year&apos;s upaya
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Read the annual Teva as an overlay: active planets forecast the year, dysfunctional planets define the remedy work.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset reading
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-2 md:grid-cols-4">
        {READING_STEPS.map((item, index) => {
          const selected = item.key === activeStep;
          return (
            <button key={item.key} type="button" onClick={() => setActiveStep(item.key)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(item.color, "12") : SURFACE, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
              <span className="text-xs font-black" style={{ color: selected ? item.color : GOLD }}>STEP {index + 1}</span>
              <p className="mb-0 mt-1 text-sm font-bold" style={{ color: selected ? item.color : INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.output}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(step.color, "10"), border: `1px solid ${step.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: step.color, letterSpacing: "0.08em" }}>Current reading step</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{step.label}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{step.output}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{step.detail}</p>
              </div>
              {activeStep === "crossCheck" ? <ShieldCheck className="shrink-0" size={38} color={step.color} /> : activeStep === "upaya" ? <Stethoscope className="shrink-0" size={38} color={step.color} /> : <ClipboardCheck className="shrink-0" size={38} color={step.color} />}
            </div>
          </article>

          <StateRoleDiagram activeStep={activeStep} selectedPlanet={selectedPlanet} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Select annual planet</p>
            <div className="mt-3 grid min-w-0 gap-2">
              {READING_PLANETS.map((item) => {
                const selected = item.id === selectedPlanet;
                return (
                  <button key={item.id} type="button" onClick={() => setSelectedPlanet(item.id)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: selected ? wash(item.color, "12") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}`, color: selected ? item.color : INK_SECONDARY }}>
                    {item.label} H{item.house} - {item.state}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(planet.color, "10"), border: `1px solid ${planet.color}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: planet.color, letterSpacing: "0.08em" }}>Planet diagnosis</p>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{planet.iast}</IAST> in house {planet.house}
            </h3>
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{planet.significance}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{planet.yearTheme}</p>
            <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: planet.state === "active" ? GREEN : VERMILION }}>
                {planet.state === "active" ? "Theme-setting planet" : "Upaya-triggering planet"}
              </p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{planet.upaya}</p>
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Year themes</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {themePlanets.map((item) => (
              <div key={item.id} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: wash(item.color, "0F"), border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                <strong style={{ color: item.color }}>{item.label}</strong> - {item.yearTheme}
              </div>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Stethoscope size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Year upayas</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {remedyPlanets.map((item) => (
              <div key={item.id} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: wash(item.color, "0F"), border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                <strong style={{ color: item.color }}>{item.label}</strong> - {item.upaya}
              </div>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(crossCheckColor, "10"), border: `1px solid ${crossCheckColor}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={17} color={crossCheckColor} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: crossCheckColor, letterSpacing: "0.08em" }}>Natal cross-check</p>
          </div>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
            {planet.natalSupport === "supports" ? "Natal Teva supports this annual signal." : planet.natalSupport === "cautions" ? "Natal Teva asks for restraint." : "Natal Teva is neutral; keep the reading modest."}
          </p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            Annual advice modifies the lifetime baseline; it does not replace it.
          </p>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>State rule reference</p>
        <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {STATE_RULES.map((rule) => (
            <div key={rule.state} className="min-w-0 rounded-lg p-3" style={{ background: wash(rule.color, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: rule.color }}>{rule.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{rule.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
