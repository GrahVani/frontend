"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Home, RotateCcw, Ruler, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  DREKKANA_BANDS,
  HOUSE_CLASSES,
  KENDRA_DREKKANA_PLANETS,
  drekkanaScore,
  getDrekkanaBand,
  getHouseClass,
  getKendraDrekkanaPlanet,
  totalKendraDrekkana,
  type KendraDrekkanaPlanet,
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

function polar(cx: number, cy: number, radius: number, house: number) {
  const angle = ((house - 1) / 12) * Math.PI * 2 - Math.PI / 2;
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

function KendraDrekkanaDiagram({
  planet,
  house,
  degree,
}: {
  planet: KendraDrekkanaPlanet;
  house: number;
  degree: number;
}) {
  const houseClass = getHouseClass(house);
  const band = getDrekkanaBand(degree);
  const dScore = drekkanaScore(planet, degree);
  const total = totalKendraDrekkana(planet, house, degree);
  const markerX = 78 + (degree / 30) * 424;

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 860 540" className="h-auto w-full" role="img" aria-label="Kendra bala house wheel and drekkana strip">
        <rect x="20" y="24" width="820" height="492" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="46" y="58" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          HOUSE CLASS + TEN-DEGREE THIRD
        </text>

        <g transform="translate(0, 61)">
          <circle cx="190" cy="205" r="122" fill={SURFACE} stroke={HAIRLINE} />
          <circle cx="190" cy="205" r="68" fill="rgba(232, 199, 114, 0.10)" stroke={HAIRLINE} />
          {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => {
            const lineEnd = polar(190, 205, 122, item);
            const label = polar(190, 205, 146, item);
            const inClass = houseClass.houses.includes(item);
            const selected = item === house;
            return (
              <g key={item}>
                <line x1="190" y1="205" x2={lineEnd.x} y2={lineEnd.y} stroke={HAIRLINE} />
                <circle cx={label.x} cy={label.y} r={selected ? 17 : 13} fill={selected ? wash(planet.color, "26") : inClass ? "rgba(232, 199, 114, 0.14)" : SURFACE} stroke={selected ? planet.color : HAIRLINE} strokeWidth={selected ? 2 : 1} />
                <text x={label.x} y={label.y + 5} textAnchor="middle" fill={selected ? planet.color : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {item}
                </text>
              </g>
            );
          })}
          <text x="190" y="196" textAnchor="middle" fill={planet.color} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {houseClass.virupas}
          </text>
          <text x="190" y="222" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            kendra-bala
          </text>

        <g>
          <text x="408" y="116" fill={INK_PRIMARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            Drekkana-bala
          </text>
          {DREKKANA_BANDS.map((item, index) => {
            const x = 78 + index * 141 + 330;
            const matched = item.index === band.index;
            const favoured = item.favours === planet.gender;
            return (
              <g key={item.index}>
                <rect x={x} y="142" width="132" height="86" rx="14" fill={favoured ? wash(planet.color, "16") : SURFACE} stroke={matched ? planet.color : HAIRLINE} strokeWidth={matched ? 2 : 1} />
                <text x={x + 66} y="170" textAnchor="middle" fill={favoured ? planet.color : INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {item.label}
                </text>
                <text x={x + 66} y="195" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {item.range}
                </text>
                <text x={x + 66} y="217" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {item.favours}
                </text>
              </g>
            );
          })}

          <line x1="408" y1="272" x2="502" y2="272" stroke="var(--gl-gold-hairline)" strokeWidth="8" strokeLinecap="round" />
          <line x1="502" y1="272" x2="642" y2="272" stroke="var(--gl-gold-hairline)" strokeWidth="8" strokeLinecap="round" />
          <circle cx={markerX + 330} cy="272" r="12" fill={planet.color} stroke={SURFACE} strokeWidth="3" />
          <text x={markerX + 330} y="302" textAnchor="middle" fill={planet.color} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            {degree.toFixed(1)} deg
          </text>
        </g>

        <circle cx="580" cy="78" r="54" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2" />
        <text x="580" y="74" textAnchor="middle" fill={ink.goldAccent} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {total}
        </text>
        <text x="580" y="98" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          total
        </text>

        <text x="360" y="356" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Kendra-bala scores house class. Drekkana-bala scores only the matching gender third.
        </text>
        <text x="360" y="382" textAnchor="middle" fill={dScore ? planet.color : INK_MUTED} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {planet.gender} planet in {band.label}: drekkana score {dScore}
        </text>
        </g>
      </svg>
    </section>
  );
}

export function KendraDrekkanaCalculator() {
  const [selectedSlug, setSelectedSlug] = useState(KENDRA_DREKKANA_PLANETS[0].slug);
  const selected = getKendraDrekkanaPlanet(selectedSlug);
  const [placements, setPlacements] = useState(() =>
    Object.fromEntries(KENDRA_DREKKANA_PLANETS.map((planet) => [planet.slug, { house: planet.sampleHouse, degree: planet.sampleDegree }])) as Record<string, { house: number; degree: number }>,
  );
  const placement = placements[selected.slug] ?? { house: selected.sampleHouse, degree: selected.sampleDegree };
  const houseClass = getHouseClass(placement.house);
  const band = getDrekkanaBand(placement.degree);
  const dScore = drekkanaScore(selected, placement.degree);
  const rows = useMemo(
    () =>
      KENDRA_DREKKANA_PLANETS.map((planet) => {
        const row = placements[planet.slug] ?? { house: planet.sampleHouse, degree: planet.sampleDegree };
        return { planet, placement: row, houseClass: getHouseClass(row.house), band: getDrekkanaBand(row.degree), dScore: drekkanaScore(planet, row.degree), total: totalKendraDrekkana(planet, row.house, row.degree) };
      }),
    [placements],
  );

  function setPlacement(update: Partial<{ house: number; degree: number }>) {
    setPlacements((current) => ({
      ...current,
      [selected.slug]: { ...placement, ...update },
    }));
  }

  function reset() {
    setSelectedSlug("surya");
    setPlacements(Object.fromEntries(KENDRA_DREKKANA_PLANETS.map((planet) => [planet.slug, { house: planet.sampleHouse, degree: planet.sampleDegree }])) as Record<string, { house: number; degree: number }>);
  }

  return (
    <div
      className="w-full"
      data-interactive="kendra-drekkana-calculator"
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
            Sthana bala sub-components 4 and 5
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Kendra-bala</IAST> and <IAST>Drekkana-bala</IAST>
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Score the house class, then test whether the planet sits in the corrected gender-matching 10-degree third.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
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
            {KENDRA_DREKKANA_PLANETS.map((planet) => {
              const active = selected.slug === planet.slug;
              return (
                <button key={planet.slug} type="button" onClick={() => setSelectedSlug(planet.slug)} className="flex items-center justify-between gap-2 rounded-lg p-3 text-left" style={{ background: active ? wash(planet.color, "12") : SURFACE_2, border: `1px solid ${active ? planet.color : HAIRLINE}`, color: active ? planet.color : INK_SECONDARY }}>
                  <span>
                    <span className="block text-sm font-bold">{planet.planet}</span>
                    <span className="block text-xs" style={{ color: active ? planet.color : INK_MUTED }}>
                      {planet.gender} group
                    </span>
                  </span>
                  {active ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(360px,1fr)_minmax(320px,0.75fr)]">
          <KendraDrekkanaDiagram planet={selected} house={placement.house} degree={placement.degree} />

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
                  Gender class: <strong>{selected.gender}</strong>
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl p-4" style={{ background: wash(selected.color, "0D"), border: `1px solid ${HAIRLINE}` }}>
                <label className="text-sm font-bold" style={{ color: INK_PRIMARY }} htmlFor="kendra-house">
                  House occupied
                </label>
                <select id="kendra-house" value={placement.house} onChange={(event) => setPlacement({ house: Number(event.target.value) })} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {Array.from({ length: 12 }, (_, index) => index + 1).map((house) => (
                    <option key={house} value={house}>
                      House {house} - {getHouseClass(house).label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-sm font-bold" style={{ color: selected.color }}>
                  {houseClass.label}: {houseClass.virupas} virupas
                </p>
              </div>

              <div className="rounded-xl p-4" style={{ background: wash(selected.color, "0D"), border: `1px solid ${HAIRLINE}` }}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label className="text-sm font-bold" style={{ color: INK_PRIMARY }} htmlFor="drekkana-degree">
                    Degree within sign
                  </label>
                  <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: dScore ? selected.color : INK_MUTED, border: `1px solid ${dScore ? selected.color : HAIRLINE}` }}>
                    {dScore} virupas
                  </span>
                </div>
                <input id="drekkana-degree" type="range" min={0} max={29.9} step={0.1} value={placement.degree} onChange={(event) => setPlacement({ degree: Number(event.target.value) })} className="w-full accent-[var(--gl-gold-accent)]" />
                <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                  {placement.degree.toFixed(1)} deg = {band.label}; favours <strong>{band.favours}</strong>.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {[5, 15, 25].map((degree) => (
                <button key={degree} type="button" onClick={() => setPlacement({ degree })} className="rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {degree} deg
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Home size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Kendra-bala
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Kendra 60, panaphara 30, apoklima 15. House class is the larger of these two checks.
            </p>
          </section>
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Ruler size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Drekkana-bala
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              15 virupas only when the planet gender matches its 10-degree third.
            </p>
          </section>
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Correction
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Female planets match the 3rd drekkana. Neutral planets match the 2nd. Do not swap them.
            </p>
          </section>
        </aside>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Rule table and live scores
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              These two checks complete the five sthana-bala sub-components.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[840px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Planet", "Gender", "House", "Kendra", "Degree", "Drekkana", "Drekkana bala", "Total"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const active = selected.slug === row.planet.slug;
                  return (
                    <tr key={row.planet.slug} onClick={() => setSelectedSlug(row.planet.slug)} className="cursor-pointer" style={{ background: active ? wash(row.planet.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: active ? row.planet.color : INK_PRIMARY }}>
                        {row.planet.planet}
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.planet.gender}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.placement.house}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.color }}>{row.houseClass.virupas}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.placement.degree.toFixed(1)} deg</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.band.label}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.dScore ? row.planet.color : INK_MUTED }}>{row.dScore}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.color }}>{row.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>House classes</p>
              <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{HOUSE_CLASSES.map((item) => `${item.label} ${item.virupas}`).join(" · ")}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Drekkana genders</p>
              <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{DREKKANA_BANDS.map((item) => `${item.label}: ${item.favours}`).join(" · ")}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
