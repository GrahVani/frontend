"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, CircleDot, RotateCcw, ShieldAlert, Sun, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import { SAMPLE_PLANETS, TOOL_GATES, WORKFLOW_STEPS, getStep, type WorkflowStepKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const VERMILION = ink.vermilionAccent;
const GREEN = "#2F7D52";

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

/* ── Standard North Indian diamond chart geometry (400×400 viewBox) ── */
const NI_HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105",
};

const NI_HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },
  2: { x: 105, y: 45 },
  3: { x: 45, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 45, y: 295 },
  6: { x: 105, y: 355 },
  7: { x: 200, y: 295 },
  8: { x: 295, y: 355 },
  9: { x: 355, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 355, y: 105 },
  12: { x: 295, y: 45 },
};

const SIGN_ABBRS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];

function AnnualTevaSvg({ activeStep }: { activeStep: WorkflowStepKey }) {
  const step = getStep(activeStep);
  const showPlanets = activeStep === "applyStates" || activeStep === "readYear" || activeStep === "castTeva";

  // Build planet placement map: house number → list of planets
  const planetMap = new Map<number, typeof SAMPLE_PLANETS>();
  SAMPLE_PLANETS.forEach((p) => {
    const list = planetMap.get(p.house) || [];
    list.push(p);
    planetMap.set(p.house, list);
  });

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}>
        <svg viewBox="0 0 400 420" className="h-auto w-full min-w-0" role="img" aria-label="Lal Kitab annual fixed Aries Teva computation diagram">
          {/* Chart lines */}
          <g stroke="rgba(130, 90, 30, 0.65)" strokeWidth="1.8" fill="none">
            <rect x="10" y="10" width="380" height="380" />
            <line x1="10" y1="10" x2="390" y2="390" />
            <line x1="390" y1="10" x2="10" y2="390" />
            <line x1="200" y1="10" x2="10" y2="200" />
            <line x1="10" y1="200" x2="200" y2="390" />
            <line x1="200" y1="390" x2="390" y2="200" />
            <line x1="390" y1="200" x2="200" y2="10" />
          </g>

          {/* House polygons with labels and planets */}
          {Array.from({ length: 12 }, (_, idx) => {
            const h = idx + 1;
            const center = NI_HOUSE_CENTERS[h];
            const isH1 = h === 1;
            const housePlanets = planetMap.get(h) || [];
            const hasPlanets = housePlanets.length > 0;

            return (
              <g key={h}>
                {/* House polygon fill */}
                <polygon
                  points={NI_HOUSE_POLYGONS[h]}
                  fill={isH1 ? wash(GOLD, "0C") : "transparent"}
                  stroke={isH1 ? `${GOLD}66` : "transparent"}
                  strokeWidth={isH1 ? 1.5 : 0}
                />

                <g transform={`translate(${center.x}, ${center.y})`}>
                  {hasPlanets ? (
                    /* House has planets — show house label offset and planets centered */
                    <>
                      {/* House number small */}
                      <text
                        y={-20}
                        fill={isH1 ? GOLD : INK_SECONDARY}
                        fontSize={12}
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontFamily: "var(--font-sans), sans-serif" }}
                      >
                        H{h} · {SIGN_ABBRS[h - 1]}
                      </text>

                      {/* Planet badges */}
                      {housePlanets.map((planet, pIdx) => {
                        const active = showPlanets;
                        const badgeW = 30;
                        const badgeH = 18;
                        const gap = 3;
                        const totalW = housePlanets.length * badgeW + (housePlanets.length - 1) * gap;
                        const startX = -totalW / 2 + badgeW / 2;
                        const xOffset = startX + pIdx * (badgeW + gap);

                        return (
                          <g key={planet.id} transform={`translate(${xOffset}, 0)`}>
                            <rect
                              x={-badgeW / 2}
                              y={-badgeH / 2}
                              width={badgeW}
                              height={badgeH}
                              rx={5}
                              fill={active ? wash(planet.color, "20") : SURFACE}
                              stroke={active ? planet.color : HAIRLINE}
                              strokeWidth={active ? 1.8 : 1}
                              style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.06))" }}
                            />
                            <text
                              fill={active ? planet.color : INK_SECONDARY}
                              fontSize={10}
                              fontWeight="900"
                              textAnchor="middle"
                              dominantBaseline="central"
                              style={{ fontFamily: "var(--font-sans), sans-serif" }}
                            >
                              {planet.label.slice(0, 2)}
                            </text>
                          </g>
                        );
                      })}

                      {/* State label below planets */}
                      {showPlanets && housePlanets.length === 1 && (
                        <text
                          y={18}
                          fill={INK_MUTED}
                          fontSize={9}
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ fontFamily: "var(--font-sans), sans-serif" }}
                        >
                          {housePlanets[0].state}
                        </text>
                      )}
                    </>
                  ) : (
                    /* Empty house — centered label */
                    <>
                      <text
                        y={-12}
                        fill={isH1 ? GOLD : INK_SECONDARY}
                        fontSize={13}
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontFamily: "var(--font-sans), sans-serif" }}
                      >
                        H{h}
                      </text>
                      <text
                        y={6}
                        fill={isH1 ? GOLD : INK_PRIMARY}
                        fontSize={15}
                        fontWeight="950"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontFamily: "var(--font-sans), sans-serif" }}
                      >
                        {SIGN_ABBRS[h - 1]}
                      </text>
                    </>
                  )}
                </g>
              </g>
            );
          })}

          {/* Central step output label */}
          <rect x="150" y="176" width="100" height="48" rx="10" fill={wash(step.color, "12")} stroke={step.color} strokeWidth="1.4" />
          <text x="200" y="194" textAnchor="middle" fill={step.color} fontSize="10" fontWeight="900" letterSpacing="0.5" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            STEP OUTPUT
          </text>
          <text x="200" y="212" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="700" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {step.shortLabel}
          </text>

          {/* Footer */}
          <text x="200" y="412" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            Aries remains H1; only return-moment planet positions refresh each year.
          </text>
        </svg>
      </div>
    </section>
  );
}

export function LalKitabVarshphalaComputation() {
  const [activeStep, setActiveStep] = useState<WorkflowStepKey>("solarReturn");
  const [sunDegree, setSunDegree] = useState(28.68);
  const [gateIndex, setGateIndex] = useState(0);
  const step = getStep(activeStep);
  const gate = TOOL_GATES[gateIndex];
  const allowed = gate.group === "lalKitab";

  const yearCue = useMemo(() => {
    const degree = Math.floor(sunDegree);
    const minutes = Math.round((sunDegree - degree) * 60);
    return `${degree} deg ${minutes.toString().padStart(2, "0")} min Pisces`;
  }, [sunDegree]);

  const reset = () => {
    setActiveStep("solarReturn");
    setSunDegree(28.68);
    setGateIndex(0);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-varshphala-computation"
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
            Lal Kitab varshphala computation
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Solar return to annual Teva in four ordered steps
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Walk the casting workflow: Sun-return anchor, fixed-Aries Teva, Lal Kitab attributes and states, then the year reading.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset workflow
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-2 md:grid-cols-4">
        {WORKFLOW_STEPS.map((item, index) => {
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
                <p className="m-0 text-xs font-bold uppercase" style={{ color: step.color, letterSpacing: "0.08em" }}>Current computation step</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{step.label}</IAST>
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{step.output}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{step.detail}</p>
              </div>
              <CalendarClock className="shrink-0" size={38} color={step.color} />
            </div>
          </article>

          <AnnualTevaSvg activeStep={activeStep} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Sun size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Solar-return anchor</p>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Adjust the natal Sun longitude. The annual chart is anchored when the transiting Sun returns here.
            </p>
            <input className="mt-4 w-full" type="range" min={0} max={29.98} step={0.01} value={sunDegree} onChange={(event) => setSunDegree(Number(event.target.value))} />
            <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: GOLD }}>{yearCue}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>Sun return, not Moon return</p>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Sample annual states</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {SAMPLE_PLANETS.map((planet) => (
                <div key={planet.id} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: wash(planet.color, "0F"), border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  <strong style={{ color: planet.color }}>{planet.label} H{planet.house}</strong>
                  <span style={{ color: INK_SECONDARY }}> - {planet.state}: {planet.theme}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Toolkit gate</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TOOL_GATES.map((item, index) => {
              const selected = gateIndex === index;
              const color = item.group === "lalKitab" ? GREEN : VERMILION;
              return (
                <button key={item.label} type="button" onClick={() => setGateIndex(index)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: selected ? wash(color, "12") : SURFACE_2, border: `1px solid ${selected ? color : HAIRLINE}`, color: selected ? color : INK_SECONDARY }}>
                  {item.label}
                </button>
              );
            })}
          </div>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(allowed ? GREEN : VERMILION, "10"), border: `1px solid ${allowed ? GREEN : VERMILION}` }}>
          <div className="mb-2 flex items-center gap-2">
            {allowed ? <CheckCircle2 size={17} color={GREEN} /> : <CircleDot size={17} color={VERMILION} />}
            <p className="m-0 text-xs font-bold uppercase" style={{ color: allowed ? GREEN : VERMILION, letterSpacing: "0.08em" }}>
              {allowed ? "Lal Kitab workflow" : "Do not import"}
            </p>
          </div>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{gate.verdict}</p>
        </article>
      </section>
    </div>
  );
}
