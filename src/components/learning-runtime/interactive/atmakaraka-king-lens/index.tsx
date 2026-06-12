"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, Crown, GitBranch, Orbit, RotateCcw, SlidersHorizontal, Table2 } from "lucide-react";
import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { AK_SCENARIOS, formatAkDegree, getAkScenario, rankAkPlanets, type AkPlanet, type AkScenarioSlug } from "./data";

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

/** Darken pale graha colors so they remain readable on cream/parchment backgrounds. */
function readableColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (luminance > 0.72) {
    const scale = (c: number) => Math.round(c * 0.5).toString(16).padStart(2, "0");
    return `#${scale(r)}${scale(g)}${scale(b)}`;
  }
  return hex;
}

function CourtSvg({
  ranked,
  selectedSlug,
  onSelect,
}: {
  ranked: AkPlanet[];
  selectedSlug: GrahaSlug;
  onSelect: (slug: GrahaSlug) => void;
}) {
  const ak = ranked[0];
  const akColor = grahas[ak.slug].primary;
  const ministers = ranked.slice(1);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 900 330" className="h-auto w-full min-w-0" role="img" aria-label="Atmakaraka as king and other planets as ministers">
        <rect x="24" y="24" width="852" height="268" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="450" y="56" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          THE HIGHEST DEGREE PLANET SITS ON THE THRONE
        </text>

        <line x1="164" y1="218" x2="736" y2="218" stroke={HAIRLINE} strokeWidth="7" strokeLinecap="round" />
        <line x1="450" y1="144" x2="450" y2="200" stroke={akColor} strokeWidth="3" strokeLinecap="round" />
        <rect x="352" y="82" width="196" height="82" rx="18" fill={wash(akColor, "16")} stroke={akColor} strokeWidth="2.4" />
        <text x="450" y="110" textAnchor="middle" fill={readableColor(akColor)} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          AK · KING
        </text>
        <text x="450" y="134" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {ak.label}
        </text>
        <text x="450" y="152" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {formatAkDegree(ak.degree)} · {ak.dignity}
        </text>

        {ministers.map((planet, index) => {
          const color = grahas[planet.slug].primary;
          const active = planet.slug === selectedSlug;
          const x = 164 + index * 114;
          return (
            <g
              key={planet.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(planet.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(planet.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <line x1={x} y1="200" x2={x} y2="236" stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.5} />
              <rect x={x - 44} y="236" width="88" height="42" rx="13" fill={active ? wash(color, "14") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2 : 1.2} />
              <text x={x} y="254" textAnchor="middle" fill={readableColor(color)} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                Minister
              </text>
              <text x={x} y="270" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {planet.label}
              </text>
            </g>
          );
        })}

        <text x="450" y="314" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ministers matter, but their reports are read through the king&apos;s agenda
        </text>
      </svg>
    </section>
  );
}

export function AtmakarakaKingLens() {
  const [scenarioSlug, setScenarioSlug] = useState<AkScenarioSlug>("saturn-hardship");
  const scenario = getAkScenario(scenarioSlug);
  const [degreeOverrides, setDegreeOverrides] = useState<Record<string, number>>({});
  const [selectedSlug, setSelectedSlug] = useState<GrahaSlug>("shani");
  const planets = scenario.planets.map((planet) => ({ ...planet, degree: degreeOverrides[planet.slug] ?? planet.degree }));
  const ranked = rankAkPlanets(planets);
  const ak = ranked[0];
  const selected = planets.find((planet) => planet.slug === selectedSlug) ?? ak;
  const selectedRank = ranked.findIndex((planet) => planet.slug === selected.slug) + 1;
  const selectedColor = grahas[selected.slug].primary;
  const akColor = grahas[ak.slug].primary;

  function chooseScenario(slug: AkScenarioSlug) {
    const next = getAkScenario(slug);
    setScenarioSlug(slug);
    setDegreeOverrides({});
    setSelectedSlug(next.planets[0].slug);
  }

  function updateDegree(slug: GrahaSlug, degree: number) {
    setDegreeOverrides((items) => ({ ...items, [slug]: degree }));
    setSelectedSlug(slug);
  }

  function reset() {
    setScenarioSlug("saturn-hardship");
    setDegreeOverrides({});
    setSelectedSlug("shani");
  }

  return (
    <div
      className="w-full min-w-0"
      data-interactive="atmakaraka-king-lens"
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
            Atmakaraka king lens
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Degree crowns the king; dignity describes the kingdom
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Test the lesson&apos;s core distinction: highest within-sign degree selects the AK, while sign, house, and dignity explain its condition.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Saturn example
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {AK_SCENARIOS.map((item) => {
            const active = item.slug === scenario.slug;
            return (
              <button key={item.slug} type="button" onClick={() => chooseScenario(item.slug)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(GOLD, "12") : SURFACE, border: `1px solid ${active ? GOLD : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={GOLD} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: active ? GOLD : INK_PRIMARY }}>{item.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.headline}</p>
              </button>
            );
          })}
        </section>

        <CourtSvg ranked={ranked} selectedSlug={selected.slug} onSelect={setSelectedSlug} />

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(akColor, "10"), border: `1px solid ${akColor}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(akColor), letterSpacing: "0.08em" }}>
                  Current Atmakaraka
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{ak.iast}</IAST> is the king
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{scenario.headline}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.teaching}</p>
              </div>
              <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: readableColor(akColor) }}>
                आत्म
              </Devanagari>
            </div>
            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-3">
              {[
                { label: "Sign", value: ak.sign },
                { label: "House", value: `House ${ak.house}` },
                { label: "Dignity", value: ak.dignity },
              ].map((item) => (
                <div key={item.label} className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD }}>{item.label}</p>
                  <p className="mt-1 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.value}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <Orbit size={17} color={GOLD} />
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Karakamsa forward link</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{scenario.karakamsa}</p>
            <p className="mt-3 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Dependency
            </p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Misidentify the AK and the later Navamsha soul-lagna points at the wrong planet.
            </p>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Move degrees, watch the crown move
            </p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {planets.map((planet) => {
              const color = grahas[planet.slug].primary;
              const rank = ranked.findIndex((item) => item.slug === planet.slug) + 1;
              const isAk = rank === 1;
              return (
                <div key={planet.slug} className="min-w-0 rounded-lg p-3" style={{ background: isAk ? wash(color, "12") : SURFACE_2, border: `1px solid ${isAk ? color : HAIRLINE}` }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="m-0 text-sm font-bold" style={{ color: readableColor(color) }}>{planet.label}</p>
                    <span className="rounded-full px-2 py-1 text-xs font-bold" style={{ color: readableColor(color), border: `1px solid ${color}`, background: SURFACE }}>
                      {isAk ? "AK" : `#${rank}`}
                    </span>
                  </div>
                  <input type="range" min="0" max="29.99" step="0.01" value={planet.degree} onChange={(event) => updateDegree(planet.slug, Number(event.target.value))} className="mt-3 w-full" aria-label={`${planet.label} within-sign degree`} />
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{formatAkDegree(planet.degree)} · {planet.dignity}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(selectedColor, "10"), border: `1px solid ${selectedColor}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: readableColor(selectedColor), letterSpacing: "0.08em" }}>
              Selected planet
            </p>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{selected.iast}</IAST> · rank {selectedRank}
            </h3>
            <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selected.condition}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.soulCue}</p>
          </article>

          <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                Selection versus condition table
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
              <table className="w-full min-w-0 border-collapse text-sm">
                <thead style={{ background: SURFACE_2 }}>
                  <tr>
                    {["Rank", "Planet", "Degree selects", "Dignity describes", "House arena"].map((heading) => (
                      <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((planet, index) => {
                    const color = grahas[planet.slug].primary;
                    return (
                      <tr key={planet.slug} onClick={() => setSelectedSlug(planet.slug)} className="cursor-pointer align-top" style={{ background: planet.slug === selected.slug ? wash(color, "0D") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                        <td className="px-4 py-3 font-bold" style={{ color: readableColor(color) }}>{index === 0 ? "AK" : index + 1}</td>
                        <td className="px-4 py-3 font-bold" style={{ color: readableColor(color) }}>{planet.label}</td>
                        <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{formatAkDegree(planet.degree)}</td>
                        <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{planet.dignity}</td>
                        <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>House {planet.house}, {planet.sign}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </section>

        <section className="grid min-w-0 gap-3 md:grid-cols-3">
          {[
            { icon: Crown, title: "Selection", text: "Highest within-sign degree alone crowns the AK." },
            { icon: GitBranch, title: "Condition", text: "Sign, house, and dignity describe how the king rules." },
            { icon: Orbit, title: "Next technique", text: "The AK's Navamsha position becomes Karakamsa later." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <Icon size={17} color={GOLD} />
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.title}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.text}</p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
