"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Calculator, CheckCircle2, CircleDot, RotateCcw, Scale, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  GRADE_BANDS,
  SHADBALA_MINIMA,
  formatRupas,
  getGradeBand,
  getMinimum,
  getRatio,
  type ShadbalaMinimum,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function RatioGauge({
  planet,
  actualRupas,
  ratio,
}: {
  planet: ShadbalaMinimum;
  actualRupas: number;
  ratio: number;
}) {
  const grade = getGradeBand(ratio);
  const actualX = 72 + Math.min(352, Math.max(0, (ratio / 1.5) * 352));
  const requiredX = 72 + (1 / 1.5) * 352;
  const halfX = 72 + (0.5 / 1.5) * 352;

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 310" className="h-auto w-full" role="img" aria-label="Shadbala ratio gauge">
        <rect x="18" y="20" width="484" height="270" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="44" y="58" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.2" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ACTUAL DIVIDED BY REQUIRED
        </text>
        <text x="44" y="88" fill={INK_PRIMARY} fontSize="28" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {formatRupas(actualRupas)} / {formatRupas(planet.requiredRupas)} = {ratio.toFixed(2)}
        </text>

        <line x1="72" y1="160" x2="424" y2="160" stroke="var(--gl-gold-hairline)" strokeWidth="18" strokeLinecap="round" />
        <line x1="72" y1="160" x2={halfX} y2="160" stroke={GRADE_BANDS[0].color} strokeWidth="18" strokeLinecap="round" opacity="0.22" />
        <line x1={halfX} y1="160" x2={requiredX} y2="160" stroke={GRADE_BANDS[1].color} strokeWidth="18" opacity="0.22" />
        <line x1={requiredX} y1="160" x2="424" y2="160" stroke={GRADE_BANDS[2].color} strokeWidth="18" strokeLinecap="round" opacity="0.22" />

        <line x1={halfX} y1="133" x2={halfX} y2="190" stroke={INK_MUTED} strokeWidth="1.5" strokeDasharray="4 5" />
        <line x1={requiredX} y1="126" x2={requiredX} y2="198" stroke={ink.goldAccent} strokeWidth="2.5" />
        <text x={halfX} y="220" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          0.50
        </text>
        <text x={requiredX} y="220" textAnchor="middle" fill={ink.goldAccent} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          1.00 required
        </text>

        <circle cx={actualX} cy="160" r="20" fill={wash(planet.color, "24")} stroke={planet.color} strokeWidth="3" />
        <text x={actualX} y="166" textAnchor="middle" fill={planet.color} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {planet.planet.slice(0, 2)}
        </text>

        <rect x="294" y="42" width="168" height="70" rx="14" fill={wash(grade.color, "12")} stroke={grade.color} strokeWidth="1.5" />
        <text x="378" y="70" textAnchor="middle" fill={grade.color} fontSize="23" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {grade.label}
        </text>
        <text x="378" y="92" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {grade.ratioRange}
        </text>

        <text x="44" y="262" fill={INK_SECONDARY} fontSize="14" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Grade the ratio, not the raw rupa total.
        </text>
      </svg>
    </section>
  );
}

export function ShadbalaGrader() {
  const [selectedSlug, setSelectedSlug] = useState(SHADBALA_MINIMA[0].slug);
  const selected = getMinimum(selectedSlug);
  const [actualByPlanet, setActualByPlanet] = useState(() =>
    Object.fromEntries(SHADBALA_MINIMA.map((planet) => [planet.slug, planet.sampleActual])) as Record<string, number>,
  );
  const actualRupas = actualByPlanet[selected.slug] ?? selected.sampleActual;
  const ratio = getRatio(actualRupas, selected.requiredRupas);
  const grade = getGradeBand(ratio);
  const sortedRows = useMemo(
    () =>
      SHADBALA_MINIMA.map((planet) => {
        const actual = actualByPlanet[planet.slug] ?? planet.sampleActual;
        return { planet, actual, ratio: getRatio(actual, planet.requiredRupas), grade: getGradeBand(getRatio(actual, planet.requiredRupas)) };
      }),
    [actualByPlanet],
  );

  function reset() {
    setSelectedSlug("surya");
    setActualByPlanet(Object.fromEntries(SHADBALA_MINIMA.map((planet) => [planet.slug, planet.sampleActual])) as Record<string, number>);
  }

  return (
    <div
      className="w-full"
      data-interactive="shadbala-grader"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
      }}
    >
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Required minimum grader
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Uttama</IAST>, <IAST>Madhya</IAST>, <IAST>Adhama</IAST> by ratio
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Pick a planet, enter its actual shadbala in rupas, then compare it with that planet&apos;s required minimum.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={16} />
          Reset Sun
        </button>
      </div>

      <div className="grid gap-4">
        <div className="min-w-0 space-y-4">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <CircleDot size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Select planet
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {SHADBALA_MINIMA.map((planet) => {
                const active = selected.slug === planet.slug;
                return (
                  <button
                    key={planet.slug}
                    type="button"
                    onClick={() => setSelectedSlug(planet.slug)}
                    className="flex items-center justify-between gap-2 rounded-lg p-3 text-left"
                    style={{
                      background: active ? wash(planet.color, "12") : SURFACE_2,
                      border: `1px solid ${active ? planet.color : HAIRLINE}`,
                      color: active ? planet.color : INK_SECONDARY,
                    }}
                  >
                    <span>
                      <span className="block text-sm font-bold">{planet.planet}</span>
                      <span className="block text-xs" style={{ color: active ? planet.color : INK_MUTED }}>
                        req {formatRupas(planet.requiredRupas)}
                      </span>
                    </span>
                    {active ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.9fr)_minmax(300px,1fr)]">
            <RatioGauge planet={selected} actualRupas={actualRupas} ratio={ratio} />

            <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-start justify-between gap-4 overflow-hidden">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                    Selected planet
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    {selected.planet} / <IAST>{selected.iast}</IAST>
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                    Required minimum: <strong>{formatRupas(selected.requiredRupas)} rupas</strong>
                  </p>
                </div>
                <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                  {selected.devanagari}
                </Devanagari>
              </div>

              <div className="mt-5 rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}44` }}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                    Actual shadbala in rupas
                  </p>
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: grade.color, border: `1px solid ${grade.color}33` }}>
                    {grade.label}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={actualRupas}
                  onChange={(event) => setActualByPlanet((current) => ({ ...current, [selected.slug]: Number(event.target.value) }))}
                  className="w-full accent-[var(--gl-gold-accent)]"
                  aria-label={`${selected.planet} actual shadbala rupas`}
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="m-0 text-sm font-bold" style={{ color: selected.color }}>
                    {actualRupas.toFixed(1)} actual
                  </p>
                  <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                    {actualRupas.toFixed(1)} / {formatRupas(selected.requiredRupas)} = {ratio.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[0.4, 0.75, 1.1].map((multiplier) => (
                  <button
                    key={multiplier}
                    type="button"
                    onClick={() => setActualByPlanet((current) => ({ ...current, [selected.slug]: Number((selected.requiredRupas * multiplier).toFixed(1)) }))}
                    className="rounded-lg px-3 py-2 text-sm font-semibold"
                    style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                  >
                    {multiplier < 0.5 ? "Adhama" : multiplier < 1 ? "Madhya" : "Uttama"} sample
                  </button>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={ink.goldAccent} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                  Required-minimum table
                </p>
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                Commonly cited values; verify exact minima by source.
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <table className="w-full min-w-[760px] border-collapse text-sm">
                <thead style={{ background: SURFACE_2 }}>
                  <tr>
                    {["Planet", "Required", "Actual", "Ratio", "Grade", "Karaka register"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row) => {
                    const active = selected.slug === row.planet.slug;
                    return (
                      <tr
                        key={row.planet.slug}
                        onClick={() => setSelectedSlug(row.planet.slug)}
                        className="cursor-pointer"
                        style={{ background: active ? wash(row.planet.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                      >
                        <td className="px-4 py-3">
                          <p className="m-0 font-bold" style={{ color: active ? row.planet.color : INK_PRIMARY }}>
                            {row.planet.planet}
                          </p>
                          <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                            {row.planet.devanagari}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                          {formatRupas(row.planet.requiredRupas)}
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                          {row.actual.toFixed(1)}
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: row.grade.color }}>
                          {row.ratio.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-bold" style={{ color: row.grade.color }}>
                          {row.grade.label}
                        </td>
                        <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                          {row.planet.karakaRegister}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Calculator size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Formula
              </p>
            </div>
            <p className="mt-4 text-3xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
              actual / required
            </p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              The ratio is the grade. A raw total of 6 rupas means different things for Mercury than for Sun.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Scale size={17} color={grade.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: grade.color, letterSpacing: "0.08em" }}>
                Interpretive register
              </p>
            </div>
            <h3 className="mt-3 text-2xl font-semibold" style={{ color: grade.color, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{grade.iast}</IAST>
            </h3>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              {grade.interpretation}
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Source caution
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              These are commonly cited minima. Exact values and tier cutoffs can vary slightly by source, so verify in the engine or reference edition.
            </p>
            {selected.correction ? (
              <p className="mt-3 rounded-lg p-3 text-sm font-bold" style={{ background: "rgba(232, 199, 114, 0.12)", border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {selected.correction}
              </p>
            ) : null}
          </section>
        </aside>
      </div>
    </div>
  );
}
