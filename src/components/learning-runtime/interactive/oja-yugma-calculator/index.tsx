"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, RotateCcw, SplitSquareHorizontal, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  DEFAULT_OJA_YUGMA_PLACEMENTS,
  OJA_YUGMA_PLANETS,
  OJA_YUGMA_POINTS_PER_LAYER,
  OJA_YUGMA_SIGNS,
  getOjaYugmaPlanet,
  getSign,
  scoreLayer,
  scoresPlacement,
  totalOjaYugma,
  type ChartLayerKey,
  type OjaYugmaPlacement,
  type OjaYugmaPlanet,
  type SignParity,
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

function ParityBoard({
  planet,
  placement,
}: {
  planet: OjaYugmaPlanet;
  placement: OjaYugmaPlacement;
}) {
  const layers: Array<{ key: ChartLayerKey; label: string; signIndex: number; y: number }> = [
    { key: "rashi", label: "Rashi / D1", signIndex: placement.rashi, y: 112 },
    { key: "navamsa", label: "Navamsa / D9", signIndex: placement.navamsa, y: 232 },
  ];
  const total = totalOjaYugma(planet, placement);

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 700 390" className="h-auto w-full" role="img" aria-label="Oja-yugma odd even sign scoring board">
        <rect x="20" y="24" width="660" height="330" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="46" y="58" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          TWO CHECKS: RASHI + NAVAMSA
        </text>

        <rect x="170" y="76" width="190" height="210" rx="18" fill={planet.preferredParity === "odd" ? wash(planet.color, "16") : SURFACE} stroke={planet.preferredParity === "odd" ? planet.color : HAIRLINE} />
        <rect x="388" y="76" width="190" height="210" rx="18" fill={planet.preferredParity === "even" ? wash(planet.color, "16") : SURFACE} stroke={planet.preferredParity === "even" ? planet.color : HAIRLINE} />
        <text x="265" y="104" textAnchor="middle" fill={planet.preferredParity === "odd" ? planet.color : INK_SECONDARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Oja / Odd
        </text>
        <text x="483" y="104" textAnchor="middle" fill={planet.preferredParity === "even" ? planet.color : INK_SECONDARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Yugma / Even
        </text>

        {layers.map((layer) => {
          const sign = getSign(layer.signIndex);
          const matched = scoresPlacement(planet, layer.signIndex);
          const x = sign.parity === "odd" ? 265 : 483;
          return (
            <g key={layer.key}>
              <text x="76" y={layer.y + 5} fill={INK_PRIMARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {layer.label}
              </text>
              <circle cx={x} cy={layer.y} r="29" fill={matched ? wash(planet.color, "28") : SURFACE_2} stroke={matched ? planet.color : HAIRLINE} strokeWidth={matched ? 2.5 : 1.5} />
              <text x={x} y={layer.y + 5} textAnchor="middle" fill={matched ? planet.color : INK_SECONDARY} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {sign.short}
              </text>
              <text x="610" y={layer.y + 5} textAnchor="end" fill={matched ? planet.color : INK_MUTED} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {matched ? "+15" : "0"}
              </text>
            </g>
          );
        })}

        <circle cx="108" cy="286" r="50" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2" />
        <text x="108" y="282" textAnchor="middle" fill={ink.goldAccent} fontSize="35" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {total}
        </text>
        <text x="108" y="305" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          virupas
        </text>

        <text x="350" y="332" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Moon and Venus score in even signs. All other planets score in odd signs.
        </text>
      </svg>
    </section>
  );
}

export function OjaYugmaCalculator() {
  const [selectedSlug, setSelectedSlug] = useState(OJA_YUGMA_PLANETS[0].slug);
  const selected = getOjaYugmaPlanet(selectedSlug);
  const [placements, setPlacements] = useState<Record<string, OjaYugmaPlacement>>(() =>
    Object.fromEntries(Object.entries(DEFAULT_OJA_YUGMA_PLACEMENTS).map(([slug, placement]) => [slug, { ...placement }])) as Record<string, OjaYugmaPlacement>,
  );
  const placement = placements[selected.slug] ?? DEFAULT_OJA_YUGMA_PLACEMENTS[selected.slug];
  const total = totalOjaYugma(selected, placement);
  const rows = useMemo(
    () =>
      OJA_YUGMA_PLANETS.map((planet) => {
        const rowPlacement = placements[planet.slug] ?? DEFAULT_OJA_YUGMA_PLACEMENTS[planet.slug];
        return {
          planet,
          placement: rowPlacement,
          total: totalOjaYugma(planet, rowPlacement),
        };
      }),
    [placements],
  );

  function setLayer(layer: ChartLayerKey, signIndex: number) {
    setPlacements((current) => ({
      ...current,
      [selected.slug]: {
        ...(current[selected.slug] ?? DEFAULT_OJA_YUGMA_PLACEMENTS[selected.slug]),
        [layer]: signIndex,
      },
    }));
  }

  function jumpTo(parity: SignParity) {
    const sign = OJA_YUGMA_SIGNS.find((item) => item.parity === parity) ?? OJA_YUGMA_SIGNS[0];
    setPlacements((current) => ({
      ...current,
      [selected.slug]: { rashi: sign.index, navamsa: sign.index },
    }));
  }

  function reset() {
    setSelectedSlug("surya");
    setPlacements(Object.fromEntries(Object.entries(DEFAULT_OJA_YUGMA_PLACEMENTS).map(([slug, value]) => [slug, { ...value }])) as Record<string, OjaYugmaPlacement>);
  }

  return (
    <div
      className="w-full"
      data-interactive="oja-yugma-calculator"
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
            Sthana bala sub-component 3
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Oja-yugma-bala</IAST>: odd/even sign match
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Score the rashi and navamsa separately. Moon and Venus prefer even signs; Sun, Mars, Mercury, Jupiter, and Saturn prefer odd signs.
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
            {OJA_YUGMA_PLANETS.map((planet) => {
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
                      {planet.preferredParity} group
                    </span>
                  </span>
                  {active ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.95fr)_minmax(320px,1fr)]">
          <ParityBoard planet={selected} placement={placement} />

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
                  {selected.groupNote}. Preferred sign type: <strong>{selected.preferredParity}</strong>.
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>

            <div className="mt-5 space-y-3">
              {(["rashi", "navamsa"] as ChartLayerKey[]).map((layer) => {
                const sign = getSign(placement[layer]);
                const score = scoreLayer(selected, placement[layer]);
                return (
                  <div key={layer} className="rounded-xl p-4" style={{ background: wash(selected.color, "0D"), border: `1px solid ${HAIRLINE}` }}>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                        {layer === "rashi" ? "Rashi / D1" : "Navamsa / D9"}
                      </p>
                      <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: score ? selected.color : INK_MUTED, border: `1px solid ${score ? selected.color : HAIRLINE}` }}>
                        {score} virupas
                      </span>
                    </div>
                    <select
                      value={placement[layer]}
                      onChange={(event) => setLayer(layer, Number(event.target.value))}
                      className="w-full rounded-lg px-3 py-2 text-sm font-semibold"
                      style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
                      aria-label={`${layer} sign`}
                    >
                      {OJA_YUGMA_SIGNS.map((item) => (
                        <option key={item.index} value={item.index}>
                          {item.index}. {item.name} ({item.parity})
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                      {sign.name} is {sign.parity}; {scoresPlacement(selected, sign.index) ? "matched" : "not matched"}.
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => jumpTo(selected.preferredParity)}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                Match both charts
              </button>
              <button
                type="button"
                onClick={() => jumpTo(selected.preferredParity === "odd" ? "even" : "odd")}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                Miss both charts
              </button>
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <SplitSquareHorizontal size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Running score
              </p>
            </div>
            <p className="mt-4 text-4xl font-bold" style={{ color: ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
              {total}
            </p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              of {OJA_YUGMA_POINTS_PER_LAYER * 2} virupas
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Mercury/Saturn correction
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Mercury and Saturn are not variable here. They score with the odd-sign group.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <CircleDot size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Small component
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              This is the smallest sthana-bala sub-component: about 15 virupas each for D1 and D9.
            </p>
          </section>
        </aside>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Rule table and live placements
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Odd signs: Ar, Ge, Le, Li, Sg, Aq. Even signs: Ta, Cn, Vi, Sc, Cp, Pi.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Planet", "Preferred", "Rashi", "D1", "Navamsa", "D9", "Total"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const active = selected.slug === row.planet.slug;
                  const rashi = getSign(row.placement.rashi);
                  const navamsa = getSign(row.placement.navamsa);
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
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.color }}>
                        {row.planet.preferredParity}
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {rashi.name} ({rashi.parity})
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: scoreLayer(row.planet, rashi.index) ? row.planet.color : INK_MUTED }}>
                        {scoreLayer(row.planet, rashi.index)}
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {navamsa.name} ({navamsa.parity})
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: scoreLayer(row.planet, navamsa.index) ? row.planet.color : INK_MUTED }}>
                        {scoreLayer(row.planet, navamsa.index)}
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.color }}>
                        {row.total}
                      </td>
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
