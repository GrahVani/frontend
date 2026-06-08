"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2, CircleDot, MapPinned, RotateCcw, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  RASHIS,
  UCHCHABALA_PLANETS,
  angularDistance,
  formatDegree,
  getUchchabalaPlanet,
  longitudeToRashi,
  uchchabalaVirupas,
  type UchchabalaPlanet,
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

function polar(cx: number, cy: number, radius: number, longitude: number) {
  const angle = (longitude - 90) * (Math.PI / 180);
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
}

function describeArc(cx: number, cy: number, radius: number, startLongitude: number, endLongitude: number) {
  const start = polar(cx, cy, radius, startLongitude);
  const end = polar(cx, cy, radius, endLongitude);
  const distance = angularDistance(startLongitude, endLongitude);
  const largeArc = distance > 180 ? 1 : 0;
  const sweep = ((endLongitude - startLongitude + 360) % 360) <= 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function ZodiacDistanceWheel({
  planet,
  longitude,
  distance,
  virupas,
}: {
  planet: UchchabalaPlanet;
  longitude: number;
  distance: number;
  virupas: number;
}) {
  const cx = 220;
  const cy = 220;
  const deb = polar(cx, cy, 148, planet.debilitation.longitude);
  const exalt = polar(cx, cy, 148, planet.exaltation.longitude);
  const current = polar(cx, cy, 148, longitude);
  const labels = RASHIS.map((rashi) => ({ ...rashi, point: polar(cx, cy, 184, rashi.start + 15) }));

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 440 470" className="h-auto w-full" role="img" aria-label="Uchchabala exaltation and debilitation distance wheel">
        <circle cx={cx} cy={cy} r="188" fill={SURFACE_2} stroke={HAIRLINE} />
        <circle cx={cx} cy={cy} r="148" fill={SURFACE} stroke={HAIRLINE} />
        <circle cx={cx} cy={cy} r="82" fill="rgba(232, 199, 114, 0.10)" stroke={HAIRLINE} />

        {RASHIS.map((rashi) => {
          const p1 = polar(cx, cy, 148, rashi.start);
          const p2 = polar(cx, cy, 188, rashi.start);
          return <line key={rashi.short} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={HAIRLINE} strokeWidth="1" />;
        })}
        {labels.map((label) => (
          <text key={label.short} x={label.point.x} y={label.point.y + 4} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            {label.short}
          </text>
        ))}

        <path d={describeArc(cx, cy, 128, planet.debilitation.longitude, longitude)} fill="none" stroke={planet.color} strokeWidth="8" strokeLinecap="round" opacity="0.42" />
        <line x1={cx} y1={cy} x2={deb.x} y2={deb.y} stroke={INK_MUTED} strokeWidth="2" strokeDasharray="4 5" />
        <line x1={cx} y1={cy} x2={exalt.x} y2={exalt.y} stroke={ink.goldAccent} strokeWidth="2.5" />

        <circle cx={deb.x} cy={deb.y} r="18" fill={SURFACE} stroke={INK_MUTED} strokeWidth="2" />
        <text x={deb.x} y={deb.y + 4} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DEB
        </text>
        <circle cx={exalt.x} cy={exalt.y} r="20" fill="rgba(232, 199, 114, 0.18)" stroke={ink.goldAccent} strokeWidth="2.5" />
        <text x={exalt.x} y={exalt.y + 4} textAnchor="middle" fill={ink.goldAccent} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          EX
        </text>
        <circle cx={current.x} cy={current.y} r="22" fill={wash(planet.color, "24")} stroke={planet.color} strokeWidth="3" />
        <text x={current.x} y={current.y + 5} textAnchor="middle" fill={planet.color} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {planet.planet.slice(0, 2)}
        </text>

        <text x={cx} y={cy - 20} textAnchor="middle" fill={planet.color} fontSize="44" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {virupas.toFixed(1)}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          virupas
        </text>
        <text x={cx} y={cy + 31} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {distance.toFixed(1)} DEG / 3
        </text>

        <text x="220" y="438" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Measure from debilitation. Exact exaltation is 180 degrees away.
        </text>
      </svg>
    </section>
  );
}

export function UchchabalaCalculator() {
  const [selectedSlug, setSelectedSlug] = useState(UCHCHABALA_PLANETS[0].slug);
  const selected = getUchchabalaPlanet(selectedSlug);
  const [longitudes, setLongitudes] = useState(() =>
    Object.fromEntries(UCHCHABALA_PLANETS.map((planet) => [planet.slug, planet.sampleLongitude])) as Record<string, number>,
  );
  const longitude = longitudes[selected.slug] ?? selected.sampleLongitude;
  const rashiPosition = longitudeToRashi(longitude);
  const distance = angularDistance(longitude, selected.debilitation.longitude);
  const virupas = uchchabalaVirupas(longitude, selected.debilitation.longitude);
  const rows = useMemo(
    () =>
      UCHCHABALA_PLANETS.map((planet) => {
        const actualLongitude = longitudes[planet.slug] ?? planet.sampleLongitude;
        const actualDistance = angularDistance(actualLongitude, planet.debilitation.longitude);
        return {
          planet,
          position: longitudeToRashi(actualLongitude),
          distance: actualDistance,
          virupas: uchchabalaVirupas(actualLongitude, planet.debilitation.longitude),
        };
      }),
    [longitudes],
  );

  function setLongitude(value: number) {
    setLongitudes((current) => ({ ...current, [selected.slug]: value }));
  }

  function reset() {
    setSelectedSlug("surya");
    setLongitudes(Object.fromEntries(UCHCHABALA_PLANETS.map((planet) => [planet.slug, planet.sampleLongitude])) as Record<string, number>);
  }

  return (
    <div
      className="w-full"
      data-interactive="uchchabala-calculator"
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
            Sthana bala sub-component 1
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Uchcha-bala</IAST>: distance from debilitation
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Slide the planet around the zodiac. The score rises linearly from 0 virupas at debilitation to 60 at exaltation.
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
            {UCHCHABALA_PLANETS.map((planet) => {
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
                      {formatDegree(planet.exaltation.degree)} deg {planet.exaltation.short}
                    </span>
                  </span>
                  {active ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.9fr)_minmax(300px,1fr)]">
          <ZodiacDistanceWheel planet={selected} longitude={longitude} distance={distance} virupas={virupas} />

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
                  Position: <strong>{formatDegree(rashiPosition.degree)} deg {rashiPosition.sign}</strong>
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>

            <div className="mt-5 rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}44` }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  Zodiac longitude
                </p>
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: selected.color, border: `1px solid ${selected.color}33` }}>
                  {virupas.toFixed(1)} virupas
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={359.9}
                step={0.1}
                value={longitude}
                onChange={(event) => setLongitude(Number(event.target.value))}
                className="w-full accent-[var(--gl-gold-accent)]"
                aria-label={`${selected.planet} zodiac longitude`}
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 text-sm font-bold" style={{ color: selected.color }}>
                  Distance from debilitation: {distance.toFixed(1)} deg
                </p>
                <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
                  {distance.toFixed(1)} / 3 = {virupas.toFixed(1)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setLongitude(selected.debilitation.longitude)}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                Debilitation
              </button>
              <button
                type="button"
                onClick={() => setLongitude((selected.debilitation.longitude + 90) % 360)}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                Halfway
              </button>
              <button
                type="button"
                onClick={() => setLongitude(selected.exaltation.longitude)}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                Exaltation
              </button>
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
              distance / 3
            </p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Measure the 0 to 180 degree distance from debilitation, then divide by 3 for virupas.
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <MapPinned size={17} color={selected.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Anchor points
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Exaltation: <strong>{formatDegree(selected.exaltation.degree)} deg {selected.exaltation.sign}</strong>
            </p>
            <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Debilitation: <strong>{formatDegree(selected.debilitation.degree)} deg {selected.debilitation.sign}</strong>
            </p>
          </section>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <CircleDot size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Range discipline
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Uchcha-bala is capped by geometry: 0 virupas at fall, 60 virupas at exaltation, linear between.
            </p>
          </section>
        </aside>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Exaltation / debilitation table
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Debilitation is always 180 degrees opposite exaltation.
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Planet", "Exaltation", "Debilitation", "Current", "Distance", "Uchcha-bala"].map((heading) => (
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
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {formatDegree(row.planet.exaltation.degree)} deg {row.planet.exaltation.sign}
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {formatDegree(row.planet.debilitation.degree)} deg {row.planet.debilitation.sign}
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                        {formatDegree(row.position.degree)} deg {row.position.sign}
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>
                        {row.distance.toFixed(1)} deg
                      </td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.color }}>
                        {row.virupas.toFixed(1)}
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
