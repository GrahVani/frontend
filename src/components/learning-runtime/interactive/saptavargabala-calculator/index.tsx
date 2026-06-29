"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Layers3, RotateCcw, Sigma, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  DIGNITY_SCORES,
  SAPTAVARGA_LAYERS,
  SAPTAVARGA_PLANETS,
  SAPTAVARGA_PRESETS,
  formatVirupas,
  getDignityScore,
  getSaptavargaPlanet,
  totalSaptavarga,
  type DignityKey,
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

function VargaStackDiagram({
  color,
  pattern,
  total,
}: {
  color: string;
  pattern: Record<string, DignityKey>;
  total: number;
}) {
  const maxDisplay = 210;
  const markerY = 300 - (60 / maxDisplay) * 220;

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 700 390" className="h-auto w-full" role="img" aria-label="Seven varga dignity stack showing summed saptavarga bala">
        <rect x="20" y="24" width="660" height="330" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="46" y="58" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SEVEN VARGAS, ONE ACCUMULATED TOTAL
        </text>

        <line x1="74" y1={markerY} x2="636" y2={markerY} stroke={ink.goldAccent} strokeWidth="2" strokeDasharray="6 6" opacity="0.75" />
        <text x="642" y={markerY + 4} fill={ink.goldAccent} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          60 is not a cap
        </text>

        {SAPTAVARGA_LAYERS.map((layer, index) => {
          const score = getDignityScore(pattern[layer.key]);
          const barHeight = Math.max(8, (score.virupas / maxDisplay) * 220);
          const x = 82 + index * 78;
          const y = 300 - barHeight;
          return (
            <g key={layer.key}>
              <rect x={x} y="80" width="46" height="220" rx="12" fill={SURFACE} stroke={HAIRLINE} />
              <rect x={x} y={y} width="46" height={barHeight} rx="12" fill={wash(color, score.tone === "high" ? "32" : "18")} stroke={color} strokeWidth={score.tone === "high" ? 1.8 : 1} />
              <text x={x + 23} y={y - 9} textAnchor="middle" fill={color} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {formatVirupas(score.virupas)}
              </text>
              <text x={x + 23} y="326" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {layer.key.toUpperCase()}
              </text>
              <text x={x + 23} y="344" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {score.label.split(" ")[0]}
              </text>
            </g>
          );
        })}

        <circle cx="578" cy="108" r="58" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2" />
        <text x="578" y="102" textAnchor="middle" fill={ink.goldAccent} fontSize="38" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {formatVirupas(total)}
        </text>
        <text x="578" y="126" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          virupas
        </text>
      </svg>
    </section>
  );
}

export function SaptavargabalaCalculator() {
  const [selectedSlug, setSelectedSlug] = useState(SAPTAVARGA_PLANETS[0].slug);
  const selected = getSaptavargaPlanet(selectedSlug);
  const [patterns, setPatterns] = useState(() =>
    Object.fromEntries(SAPTAVARGA_PLANETS.map((planet) => [planet.slug, { ...planet.pattern }])) as Record<string, Record<string, DignityKey>>,
  );
  const pattern = patterns[selected.slug] ?? selected.pattern;
  const total = totalSaptavarga(pattern);
  const rows = useMemo(
    () =>
      SAPTAVARGA_PLANETS.map((planet) => {
        const planetPattern = patterns[planet.slug] ?? planet.pattern;
        return { planet, total: totalSaptavarga(planetPattern), pattern: planetPattern };
      }),
    [patterns],
  );

  function setLayerDignity(layerKey: string, dignity: DignityKey) {
    setPatterns((current) => ({
      ...current,
      [selected.slug]: {
        ...(current[selected.slug] ?? selected.pattern),
        [layerKey]: dignity,
      },
    }));
  }

  function applyPreset(presetKey: string) {
    const preset = SAPTAVARGA_PRESETS.find((item) => item.key === presetKey) ?? SAPTAVARGA_PRESETS[0];
    setPatterns((current) => ({ ...current, [selected.slug]: { ...preset.pattern } }));
  }

  function reset() {
    setSelectedSlug("surya");
    setPatterns(Object.fromEntries(SAPTAVARGA_PLANETS.map((planet) => [planet.slug, { ...planet.pattern }])) as Record<string, Record<string, DignityKey>>);
  }

  return (
    <div
      className="w-full"
      data-interactive="saptavargabala-calculator"
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
            Sthana bala sub-component 2
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Saptavarga-bala</IAST>: seven-fold sign strength
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Score dignity in D1, D2, D3, D7, D9, D12, and D30, then add every layer. This total is accumulated, not capped at 60.
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
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Select planet
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {SAPTAVARGA_PLANETS.map((planet) => {
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
                      {formatVirupas(totalSaptavarga(patterns[planet.slug] ?? planet.pattern))} virupas
                    </span>
                  </span>
                  {active ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Layers3 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Teaching presets
            </p>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {SAPTAVARGA_PRESETS.map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => applyPreset(preset.key)}
                className="rounded-lg p-3 text-left"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                <span className="block text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  {preset.label}
                </span>
                <span className="mt-1 block text-xs">{preset.note}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
          <VargaStackDiagram color={selected.color} pattern={pattern} total={total} />

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
                  Set the dignity for each varga, then add the seven virupa values.
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>

            <div className="mt-5 space-y-2">
              {SAPTAVARGA_LAYERS.map((layer) => {
                const dignity = getDignityScore(pattern[layer.key]);
                return (
                  <div key={layer.key} className="grid gap-2 rounded-xl p-3 sm:grid-cols-[1fr_190px_76px]" style={{ background: wash(selected.color, "0D"), border: `1px solid ${HAIRLINE}` }}>
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                        {layer.name}
                      </p>
                      <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                        {layer.focus}
                      </p>
                    </div>
                    <select
                      value={pattern[layer.key]}
                      onChange={(event) => setLayerDignity(layer.key, event.target.value as DignityKey)}
                      className="rounded-lg px-3 py-2 text-sm font-semibold"
                      style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                      aria-label={`${layer.name} dignity`}
                    >
                      {DIGNITY_SCORES.map((score) => (
                        <option key={score.key} value={score.key}>
                          {score.label}
                        </option>
                      ))}
                    </select>
                    <p className="m-0 self-center text-right text-sm font-bold" style={{ color: selected.color }}>
                      {formatVirupas(dignity.virupas)}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Sigma size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Running sum
              </p>
            </div>
            <p className="mt-4 text-4xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
              {formatVirupas(total)}
            </p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              virupas across seven vargas
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                No 60 cap
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Unlike uchcha-bala, this is not a 0-60 sub-score. Seven dignity values are accumulated, so totals can exceed 60.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Source caution
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              These are commonly cited values. Exact figures can vary slightly by source, so verify engine output when computing a real chart.
            </p>
          </section>
        </aside>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Per-dignity values and planet totals
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Mulatrikona 45, own 30, then friendship scale.
            </p>
          </div>
          <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <table className="w-full min-w-[340px] border-collapse text-sm">
                <thead style={{ background: SURFACE_2 }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      Dignity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      Virupas
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DIGNITY_SCORES.map((score) => (
                    <tr key={score.key} style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: INK_PRIMARY }}>
                          {score.label}
                        </p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>
                          <IAST>{score.iast}</IAST>
                        </p>
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: ink.goldAccent }}>
                        {formatVirupas(score.virupas)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <table className="w-full min-w-[620px] border-collapse text-sm">
                <thead style={{ background: SURFACE_2 }}>
                  <tr>
                    {["Planet", "D1", "D2", "D3", "D7", "D9", "D12", "D30", "Total"].map((heading) => (
                      <th key={heading} className="px-3 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const active = selected.slug === row.planet.slug;
                    return (
                      <tr
                        key={row.planet.slug}
                        onClick={() => setSelectedSlug(row.planet.slug)}
                        className="cursor-pointer"
                        style={{ background: active ? wash(row.planet.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                      >
                        <td className="px-3 py-3 font-bold" style={{ color: active ? row.planet.color : INK_PRIMARY }}>
                          {row.planet.planet}
                        </td>
                        {SAPTAVARGA_LAYERS.map((layer) => (
                          <td key={layer.key} className="px-3 py-3" style={{ color: INK_SECONDARY }}>
                            {formatVirupas(getDignityScore(row.pattern[layer.key]).virupas)}
                          </td>
                        ))}
                        <td className="px-3 py-3 font-bold" style={{ color: row.planet.color }}>
                          {formatVirupas(row.total)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
