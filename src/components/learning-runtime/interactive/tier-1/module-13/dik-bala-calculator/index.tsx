"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Compass, RotateCcw, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  DIK_BALA_PLANETS,
  DIRECTION_HOUSES,
  angleToHouse,
  angularDistance,
  dikBalaVirupas,
  formatVirupas,
  getDikBalaPlanet,
  normalizeAngle,
  type DikBalaPlanet,
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

function polar(cx: number, cy: number, radius: number, angle: number) {
  const radians = (angle - 90) * (Math.PI / 180);
  return { x: cx + Math.cos(radians) * radius, y: cy + Math.sin(radians) * radius };
}

function DirectionWheel({ planet, angle }: { planet: DikBalaPlanet; angle: number }) {
  const cx = 230;
  const cy = 260;
  const score = dikBalaVirupas(planet, angle);
  const current = polar(cx, cy, 140, angle);
  const home = planet.homeAngle === null ? null : polar(cx, cy, 140, planet.homeAngle);
  const oppositeAngle = planet.homeAngle === null ? null : normalizeAngle(planet.homeAngle + 180);
  const opposite = oppositeAngle === null ? null : polar(cx, cy, 140, oppositeAngle);
  const distance = planet.homeAngle === null ? 0 : angularDistance(angle, planet.homeAngle);

  return (
    <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 720 540" className="h-auto w-full" role="img" aria-label="Dik bala directional strength wheel">
        <rect x="20" y="24" width="680" height="476" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="48" y="58" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DIRECTIONAL KENDRA, OPPOSITE ZERO
        </text>

        <circle cx={cx} cy={cy} r="170" fill={SURFACE} stroke={HAIRLINE} />
        <circle cx={cx} cy={cy} r="92" fill="rgba(232, 199, 114, 0.10)" stroke={HAIRLINE} />

        {DIRECTION_HOUSES.map((direction) => {
          const point = polar(cx, cy, 150, direction.angle);
          const line = polar(cx, cy, 130, direction.angle);
          const active = planet.homeHouse === direction.house;
          const hasCurrentMarker = !planet.excluded && angularDistance(angle, direction.angle) < 8;
          const hasZeroMarker = oppositeAngle !== null && angularDistance(oppositeAngle, direction.angle) < 8;
          const showDirectionLabel = !active && !hasCurrentMarker && !hasZeroMarker;
          return (
            <g key={direction.house}>
              <line x1={cx} y1={cy} x2={line.x} y2={line.y} stroke={active ? planet.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.5} />
              {showDirectionLabel ? (
                <>
                  <circle cx={point.x} cy={point.y} r="18" fill={SURFACE} stroke={HAIRLINE} />
                  <text x={point.x} y={point.y - 2} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                    {direction.direction}
                  </text>
                  <text x={point.x} y={point.y + 13} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                    H{direction.house}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}

        {home ? (
          <circle cx={home.x} cy={home.y} r="30" fill="none" stroke={planet.color} strokeWidth="3" />
        ) : null}
        {opposite ? (
          <g>
            <circle cx={opposite.x} cy={opposite.y} r="20" fill={SURFACE_2} stroke={INK_MUTED} strokeWidth="2" strokeDasharray="4 4" />
            <text x={opposite.x} y={opposite.y + 4} textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              ZERO
            </text>
          </g>
        ) : null}

        {!planet.excluded ? (
          <>
            <line x1={cx} y1={cy} x2={current.x} y2={current.y} stroke={planet.color} strokeWidth="2" opacity="0.6" />
            <circle cx={current.x} cy={current.y} r="20" fill={wash(planet.color, "28")} stroke={planet.color} strokeWidth="3" />
            <text x={current.x} y={current.y + 5} textAnchor="middle" fill={planet.color} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              {planet.planet.slice(0, 2)}
            </text>
          </>
        ) : null}

        <circle cx={cx} cy={cy} r="66" fill={SURFACE} stroke="var(--gl-gold-accent)" strokeWidth="2" />
        <text x={cx} y={cy - 8} textAnchor="middle" fill={planet.excluded ? INK_MUTED : ink.goldAccent} fontSize="40" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {planet.excluded ? "0" : formatVirupas(score)}
        </text>
        <text x={cx} y={cy + 19} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          virupas
        </text>
        <text x={cx} y={cy + 40} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {planet.excluded ? "NODES EXCLUDED" : `${distance.toFixed(1)} DEG FROM HOME`}
        </text>

        <g>
          <rect x="490" y="152" width="164" height="130" rx="16" fill={planet.excluded ? SURFACE : wash(planet.color, "12")} stroke={planet.excluded ? HAIRLINE : planet.color} />
          <text x="572" y="184" textAnchor="middle" fill={planet.excluded ? INK_MUTED : planet.color} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            {planet.direction}
          </text>
          <text x="572" y="212" textAnchor="middle" fill={INK_PRIMARY} fontSize="28" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {planet.homeHouse ? `House ${planet.homeHouse}` : "None"}
          </text>
          <text x="572" y="244" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            {planet.excluded ? "no dik bala" : "full strength home"}
          </text>
        </g>

        <text x="360" y="470" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Full at the directional kendra, zero opposite, linear between.
        </text>
      </svg>
    </section>
  );
}

export function DikBalaCalculator() {
  const [selectedSlug, setSelectedSlug] = useState(DIK_BALA_PLANETS[0].slug);
  const selected = getDikBalaPlanet(selectedSlug);
  const [angles, setAngles] = useState(() => Object.fromEntries(DIK_BALA_PLANETS.map((planet) => [planet.slug, planet.sampleAngle])) as Record<string, number>);
  const angle = angles[selected.slug] ?? selected.sampleAngle;
  const score = dikBalaVirupas(selected, angle);
  const rows = useMemo(
    () =>
      DIK_BALA_PLANETS.map((planet) => {
        const planetAngle = angles[planet.slug] ?? planet.sampleAngle;
        return { planet, angle: planetAngle, house: angleToHouse(planetAngle), score: dikBalaVirupas(planet, planetAngle) };
      }),
    [angles],
  );

  function setAngle(value: number) {
    setAngles((current) => ({ ...current, [selected.slug]: value }));
  }

  function reset() {
    setSelectedSlug("surya");
    setAngles(Object.fromEntries(DIK_BALA_PLANETS.map((planet) => [planet.slug, planet.sampleAngle])) as Record<string, number>);
  }

  return (
    <div
      className="w-full"
      data-interactive="dik-bala-calculator"
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
            Directional strength
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Dik Bala</IAST>: compass home and opposite zero
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Move the planet around the angular wheel. Directional strength is 60 at its home kendra, 0 opposite, and linear between.
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
              Select graha
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {DIK_BALA_PLANETS.map((planet) => {
              const active = selected.slug === planet.slug;
              return (
                <button
                  key={planet.slug}
                  type="button"
                  onClick={() => setSelectedSlug(planet.slug)}
                  className="flex items-center justify-between gap-2 rounded-lg p-3 text-left"
                  style={{ background: active ? wash(planet.color, "12") : SURFACE_2, border: `1px solid ${active ? planet.color : HAIRLINE}`, color: active ? planet.color : INK_SECONDARY }}
                >
                  <span>
                    <span className="block text-sm font-bold">{planet.planet}</span>
                    <span className="block text-xs" style={{ color: active ? planet.color : INK_MUTED }}>
                      {planet.homeHouse ? `H${planet.homeHouse} ${planet.direction}` : "excluded"}
                    </span>
                  </span>
                  {active ? <CheckCircle2 size={17} /> : <CircleDot size={17} />}
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[minmax(360px,1fr)_minmax(320px,0.75fr)]">
          <DirectionWheel planet={selected} angle={angle} />

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-start justify-between gap-4 overflow-hidden">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                  Selected graha
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  {selected.planet} / <IAST>{selected.iast}</IAST>
                </h3>
                <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                  {selected.note}
                </p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
                {selected.devanagari}
              </Devanagari>
            </div>

            <div className="mt-5 rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}44` }}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
                  Position around angular wheel
                </p>
                <span className="rounded-full px-3 py-1 text-xs font-bold uppercase" style={{ background: SURFACE, color: selected.excluded ? INK_MUTED : selected.color, border: `1px solid ${selected.excluded ? HAIRLINE : selected.color}` }}>
                  {formatVirupas(score)} virupas
                </span>
              </div>
              <input type="range" min={0} max={359.9} step={0.1} value={angle} disabled={selected.excluded} onChange={(event) => setAngle(Number(event.target.value))} className="w-full accent-[var(--gl-gold-accent)] disabled:opacity-40" aria-label={`${selected.planet} directional angle`} />
              <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
                Approximate house: <strong>{angleToHouse(angle)}</strong>. {selected.excluded ? "Nodes are excluded from dik bala." : `Home house: ${selected.homeHouse}; opposite: ${selected.oppositeHouse}.`}
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button type="button" disabled={selected.excluded} onClick={() => selected.homeAngle !== null && setAngle(selected.homeAngle)} className="rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-45" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                Home
              </button>
              <button type="button" disabled={selected.excluded} onClick={() => selected.homeAngle !== null && setAngle(normalizeAngle(selected.homeAngle + 90))} className="rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-45" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                Halfway
              </button>
              <button type="button" disabled={selected.excluded} onClick={() => selected.homeAngle !== null && setAngle(normalizeAngle(selected.homeAngle + 180))} className="rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-45" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                Opposite
              </button>
            </div>
          </section>
        </div>

        <aside className="grid min-w-0 gap-4 lg:grid-cols-3">
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Compass size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Formula
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              60 at the home kendra, 0 at the 180-degree opposite point, linear by angular distance.
            </p>
          </section>
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Nodes excluded
              </p>
            </div>
            <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
              Rahu and Ketu do not receive dik bala in this lesson&apos;s rule set.
            </p>
          </section>
          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Current score
              </p>
            </div>
            <p className="mt-4 text-4xl font-bold" style={{ color: selected.excluded ? INK_MUTED : ink.goldAccent, fontFamily: "var(--font-cormorant), serif" }}>
              {formatVirupas(score)}
            </p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
              virupas
            </p>
          </section>
        </aside>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Table2 size={17} color={ink.goldAccent} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Direction table and live scores
              </p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Sun/Mars 10th · Moon/Venus 4th · Jupiter/Mercury 1st · Saturn 7th
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[820px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Graha", "Direction", "Home", "Opposite", "Current house", "Score", "Note"].map((heading) => (
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
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: active ? row.planet.color : INK_PRIMARY }}>{row.planet.planet}</p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{row.planet.devanagari}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.planet.direction}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.excluded ? INK_MUTED : row.planet.color }}>{row.planet.homeHouse ?? "-"}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.planet.oppositeHouse ?? "-"}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.planet.excluded ? "-" : row.house}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: row.planet.excluded ? INK_MUTED : row.planet.color }}>{formatVirupas(row.score)}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.planet.note}</td>
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
