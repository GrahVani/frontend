"use client";

import { useState } from "react";
import { ArrowDownWideNarrow, CheckCircle2, CircleDot, GitBranch, RotateCcw, SlidersHorizontal, Table2 } from "lucide-react";
import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { SAMPLE_CARA_PLANETS, effectiveCaraDegree, formatDegree, rankCaraPlanets, type CaraPlanet, type CaraScheme } from "./data";

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

const READABLE_GRAHA_ACCENTS: Partial<Record<GrahaSlug, string>> = {
  candra: "#5E6F9E",
  shukra: "#527DA4",
};

function grahaAccent(slug: GrahaSlug) {
  return READABLE_GRAHA_ACCENTS[slug] ?? grahas[slug].primary;
}

function LadderSvg({ ranked, scheme }: { ranked: ReturnType<typeof rankCaraPlanets>; scheme: CaraScheme }) {
  const top = ranked[0];
  const topColor = grahaAccent(top.planet.slug);
  return (
    <section className="mx-auto w-full max-w-[600px] min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 540 320" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label="Cara karaka degree ranking ladder">
        <rect x="18" y="18" width="504" height="270" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="270" y="48" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          HIGHEST DEGREE WINS THE TOP ROLE
        </text>
        <line x1="88" y1="84" x2="452" y2="84" stroke={HAIRLINE} strokeWidth="10" strokeLinecap="round" />
        <text x="88" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          0°
        </text>
        <text x="452" y="70" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          30°
        </text>
        {ranked.map(({ planet, role, effectiveDegree }, index) => {
          const color = grahaAccent(planet.slug);
          const x = 88 + (effectiveDegree / 30) * 364;
          const y = 116 + index * 22;
          return (
            <g key={planet.slug}>
              <line x1={x} y1="84" x2={x} y2={y - 8} stroke={color} strokeWidth={index === 0 ? 2.4 : 1.2} opacity={index === 0 ? 0.9 : 0.45} />
              <circle cx={x} cy="84" r={index === 0 ? 8 : 5} fill={SURFACE} stroke={color} strokeWidth={index === 0 ? 3 : 1.5} />
              <rect x="94" y={y - 12} width="352" height="19" rx="8" fill={index === 0 ? wash(color, "16") : SURFACE} stroke={index === 0 ? color : HAIRLINE} />
              <text x="112" y={y + 2} fill={color} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {role.short}
              </text>
              <text x="168" y={y + 2} fill={INK_PRIMARY} fontSize="9" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {planet.label}
              </text>
              <text x="410" y={y + 2} textAnchor="end" fill={INK_SECONDARY} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {formatDegree(effectiveDegree)}
              </text>
            </g>
          );
        })}
        <rect x="110" y="258" width="320" height="28" rx="12" fill={wash(topColor, "12")} stroke={topColor} />
        <text x="270" y="277" textAnchor="middle" fill={topColor} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {top.planet.label} is Atmakaraka at {formatDegree(top.effectiveDegree)}
        </text>
        {scheme === "eight" ? (
          <text x="270" y="304" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            Rahu uses effective degree = 30° - raw degree
          </text>
        ) : null}
      </svg>
    </section>
  );
}

export function CaraKarakaRanker() {
  const [planets, setPlanets] = useState<CaraPlanet[]>(SAMPLE_CARA_PLANETS);
  const [selectedSlug, setSelectedSlug] = useState<GrahaSlug>("candra");
  const [scheme, setScheme] = useState<CaraScheme>("seven");
  const ranked = rankCaraPlanets(planets, scheme);
  const selected = planets.find((planet) => planet.slug === selectedSlug) ?? planets[0];
  const selectedRank = ranked.findIndex(({ planet }) => planet.slug === selected.slug) + 1;
  const selectedRole = ranked[selectedRank - 1]?.role;
  const atmakaraka = ranked[0];

  function updateDegree(slug: GrahaSlug, degree: number) {
    setPlanets((items) => items.map((planet) => (planet.slug === slug ? { ...planet, degree } : planet)));
  }

  function reset() {
    setPlanets(SAMPLE_CARA_PLANETS);
    setSelectedSlug("candra");
    setScheme("seven");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="cara-karaka-ranker"
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
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Cara-karaka ranker
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Compute the cara-karaka table by descending degree
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Use the seven-planet worked example, then toggle the eight-planet Rahu variant.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset seven-planet example
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ArrowDownWideNarrow size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Computation scheme
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { value: "seven" as const, label: "Seven planets", note: "Sun through Saturn; no nodes. This lesson's assessment scheme." },
              { value: "eight" as const, label: "Eight with Rahu", note: "Adds Rahu using effective degree 30° - raw degree." },
            ].map((item) => {
              const active = scheme === item.value;
              return (
                <button key={item.value} type="button" onClick={() => setScheme(item.value)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(GOLD, "12") : SURFACE_2, border: `1px solid ${active ? GOLD : HAIRLINE}` }}>
                  {active ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                  <p className="mt-2 text-sm font-bold" style={{ color: active ? GOLD : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.note}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          {planets.map((planet) => {
            if (scheme === "seven" && !planet.includeInSeven) return null;
            const active = planet.slug === selected.slug;
            const color = grahaAccent(planet.slug);
            const effectiveDegree = effectiveCaraDegree(planet, scheme);
            return (
              <button key={planet.slug} type="button" onClick={() => setSelectedSlug(planet.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(color, "12") : SURFACE, border: `1px solid ${active ? color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color }}>{planet.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
                  {planet.sign} {formatDegree(planet.degree)}
                  {planet.slug === "rahu" ? ` -> ${formatDegree(effectiveDegree)}` : ""}
                </p>
              </button>
            );
          })}
        </section>

        <LadderSvg ranked={ranked} scheme={scheme} />

        <section className="rounded-xl p-4" style={{ background: wash(grahaAccent(atmakaraka.planet.slug), "12"), border: `1px solid ${grahaAccent(atmakaraka.planet.slug)}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: grahaAccent(atmakaraka.planet.slug), letterSpacing: "0.08em" }}>
                Atmakaraka
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{atmakaraka.planet.iast}</IAST> holds the highest degree
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Highest effective degree wins. In the seven-planet scheme this is plain within-sign degree; in the eight-planet variant Rahu is reverse-counted.
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: grahaAccent(atmakaraka.planet.slug) }}>
              आत्म
            </Devanagari>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Adjust selected planet
            </p>
          </div>
          <p className="m-0 text-sm font-bold" style={{ color: grahaAccent(selected.slug) }}>
            {selected.label}: {selectedRank > 0 ? `rank ${selectedRank}, ${selectedRole?.iast}` : "not included in the seven-planet scheme"}
          </p>
          <input type="range" min="0" max="29.99" step="0.01" value={selected.degree} onChange={(event) => updateDegree(selected.slug, Number(event.target.value))} className="mt-3 w-full" />
          <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
            Raw degree: <strong>{formatDegree(selected.degree)}</strong>
            {selected.slug === "rahu" ? `; effective degree: ${formatDegree(effectiveCaraDegree(selected, scheme))}` : ""}. Natural significator remains: {selected.naisargika}.
          </p>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <GitBranch size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Cara karaka</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Movable, chart-specific, assigned by degree-rank in this one nativity.</p>
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <ArrowDownWideNarrow size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Naisargika karaka</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Fixed by planetary nature; Sun remains father, Moon mother, Venus spouse.</p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Ranked role table
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Rank", width: "w-[60px]" },
                    { label: "Role", width: "w-[120px]" },
                    { label: "Planet", width: "w-[100px]" },
                    { label: "Raw degree", width: "w-[100px]" },
                    { label: "Effective degree", width: "w-[110px]" },
                    { label: "Cara domain", width: "w-[120px]" },
                    { label: "Natural meaning", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ranked.map(({ planet, role, effectiveDegree }) => {
                  const color = grahaAccent(planet.slug);
                  return (
                    <tr key={planet.slug} onClick={() => setSelectedSlug(planet.slug)} className="cursor-pointer align-top" style={{ background: planet.slug === selected.slug ? wash(color, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color }}>{role.rank}</td>
                      <td className="px-4 py-3 break-words font-bold" style={{ color }}>{role.short} / {role.iast}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{planet.label}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{formatDegree(planet.degree)}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{formatDegree(effectiveDegree)}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{role.domain}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{planet.naisargika}</td>
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
