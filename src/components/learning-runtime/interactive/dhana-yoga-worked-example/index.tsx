"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, Coins, Gauge, ListChecks, RotateCcw, ShieldCheck, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  ARIES_WEALTH_LORDS,
  STRENGTH_PRESETS,
  WORKED_YOGAS,
  getWorkedYoga,
  grahaLabel,
  type StrengthPresetSlug,
  type WorkedYogaSlug,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const DHANA = ink.goldAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function getDeliveryScore(shadbalaAverage: number, savAverage: number) {
  return Math.round(shadbalaAverage * 0.65 + savAverage * 2 * 0.35);
}

function deliveryLabel(score: number) {
  if (score >= 70) return "Reliable";
  if (score >= 58) return "Moderate";
  return "Underdelivers";
}

function AriesWealthCircuit({
  activeHouses,
}: {
  activeHouses: number[];
}) {
  const points: Record<number, { x: number; y: number }> = {
    2: { x: 120, y: 124 },
    5: { x: 380, y: 124 },
    9: { x: 380, y: 242 },
    11: { x: 120, y: 242 },
  };

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 372" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="Aries lagna dhana yoga worked example">
        <rect x="18" y="18" width="484" height="326" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={DHANA} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          ARIES LAGNA: 2 / 5 / 9 / 11 LORD CIRCUIT
        </text>
        <path d="M120 124 L380 124 L380 242 L120 242 Z" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="7 8" />
        <path d="M120 124 C88 176 88 202 120 242" fill="none" stroke={WORKED_YOGAS[0].color} strokeWidth="3" opacity="0.55" />
        <path d="M380 124 C420 176 420 202 380 242" fill="none" stroke={WORKED_YOGAS[1].color} strokeWidth="3" opacity="0.55" />
        <circle cx="260" cy="184" r="47" fill={wash(DHANA, "12")} stroke={DHANA} strokeWidth="2" />
        <text x="260" y="178" textAnchor="middle" fill={DHANA} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          PRESENCE
        </text>
        <text x="260" y="200" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          then grade
        </text>
        {ARIES_WEALTH_LORDS.map((lord) => {
          const point = points[lord.house];
          const active = activeHouses.includes(lord.house);
          return (
            <g key={lord.house}>
              <circle cx={point.x} cy={point.y} r={active ? 47 : 39} fill={active ? wash(lord.color, "18") : SURFACE} stroke={active ? lord.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={point.x} y={point.y - 22} textAnchor="middle" fill={active ? lord.color : INK_MUTED} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                H{lord.house}
              </text>
              <text x={point.x} y={point.y} textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {grahaLabel(lord.lord)}
              </text>
              <text x={point.x} y={point.y + 18} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {lord.sign}
              </text>
            </g>
          );
        })}
        <line x1="84" y1="306" x2="436" y2="306" stroke={HAIRLINE} strokeWidth="1" />
        <text x="260" y="326" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Two relationships are found; shadbala and SAV decide delivery strength.
        </text>
      </svg>
    </section>
  );
}

export function DhanaYogaWorkedExample() {
  const [selectedYogaSlug, setSelectedYogaSlug] = useState<WorkedYogaSlug>("pure-dhana");
  const [presetSlug, setPresetSlug] = useState<StrengthPresetSlug>("reliable");
  const selectedYoga = getWorkedYoga(selectedYogaSlug);
  const preset = STRENGTH_PRESETS.find((item) => item.slug === presetSlug) ?? STRENGTH_PRESETS[0];

  const participatingStrengths = selectedYoga.lords.map((lord) => preset.shadbala[lord]);
  const participatingSav = selectedYoga.houses.map((house) => preset.sav[house]);
  const shadbalaAverage = Math.round(participatingStrengths.reduce((sum, value) => sum + value, 0) / participatingStrengths.length);
  const savAverage = Math.round(participatingSav.reduce((sum, value) => sum + value, 0) / participatingSav.length);
  const deliveryScore = getDeliveryScore(shadbalaAverage, savAverage);
  const delivery = deliveryLabel(deliveryScore);

  function reset() {
    setSelectedYogaSlug("pure-dhana");
    setPresetSlug("reliable");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="dhana-yoga-worked-example"
      style={{
        maxWidth: 860,
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
      }}
    >
      <div className="mb-5 flex flex-col gap-4">
        <div>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
            Dhana-yoga worked example
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Aries chart: identify first, grade second
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            List the Aries wealth lords, mark the two yogas, then overlay shadbala and SAV to test whether the promise delivers.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset example
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={17} color={DHANA} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
              Step 1: Aries wealth lords
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {ARIES_WEALTH_LORDS.map((lord) => (
              <article key={lord.house} className="rounded-xl p-4" style={{ background: wash(lord.color, "10"), border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: lord.color, letterSpacing: "0.08em" }}>
                  H{lord.house} lord
                </p>
                <p className="mt-2 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                  {grahaLabel(lord.lord)}
                </p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                  {lord.sign} · {lord.role}
                </p>
              </article>
            ))}
          </div>
        </section>

        <AriesWealthCircuit activeHouses={[...selectedYoga.houses]} />

        <section className="grid gap-4 md:grid-cols-2">
          {WORKED_YOGAS.map((yoga) => {
            const active = selectedYoga.slug === yoga.slug;
            return (
              <button key={yoga.slug} type="button" onClick={() => setSelectedYogaSlug(yoga.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(yoga.color, "14") : SURFACE, border: `1px solid ${active ? yoga.color : HAIRLINE}`, color: INK_PRIMARY }}>
                {active ? <CheckCircle2 size={17} color={yoga.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                <p className="mt-2 text-sm font-bold" style={{ color: yoga.color }}>{yoga.classification}</p>
                <h3 className="m-0 text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{yoga.iast}</IAST>
                </h3>
                <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>{yoga.identification}</p>
              </button>
            );
          })}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedYoga.color, letterSpacing: "0.08em" }}>
                Selected yoga
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {selectedYoga.label}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selectedYoga.reading}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selectedYoga.color }}>
              {selectedYoga.devanagari}
            </Devanagari>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Gauge size={17} color={DHANA} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
              Step 2: Strength overlay
            </p>
          </div>
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            {STRENGTH_PRESETS.map((item) => {
              const active = preset.slug === item.slug;
              return (
                <button key={item.slug} type="button" onClick={() => setPresetSlug(item.slug)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(selectedYoga.color, "14") : SURFACE_2, border: `1px solid ${active ? selectedYoga.color : HAIRLINE}`, color: active ? selectedYoga.color : INK_SECONDARY }}>
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
                Shadbala average
              </p>
              <p className="mt-3 text-4xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {shadbalaAverage}
              </p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                participating lords
              </p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
                SAV average
              </p>
              <p className="mt-3 text-4xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {savAverage}
              </p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                occupied wealth houses
              </p>
            </article>
            <article className="rounded-xl p-4" style={{ background: wash(selectedYoga.color, "12"), border: `1px solid ${selectedYoga.color}` }}>
              <ShieldCheck size={17} color={selectedYoga.color} />
              <p className="mt-2 text-xs font-bold uppercase" style={{ color: selectedYoga.color, letterSpacing: "0.08em" }}>
                Delivery
              </p>
              <p className="mt-2 text-3xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                {delivery}
              </p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                score {deliveryScore} / 100
              </p>
            </article>
          </div>
          <p className="mt-4 rounded-xl p-4 text-sm" style={{ background: wash(DHANA, "10"), border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
            {preset.note} Presence is the first question; strength is the reading discipline.
          </p>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={DHANA} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
              Strength ledger
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {["Yoga", "Participating lords", "Shadbala", "SAV houses", "Reading"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-left text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORKED_YOGAS.map((yoga) => {
                  const active = selectedYoga.slug === yoga.slug;
                  const yogaShadbala = yoga.lords.map((lord) => preset.shadbala[lord]).join(" / ");
                  const yogaSav = yoga.houses.map((house) => `H${house}: ${preset.sav[house]}`).join(" / ");
                  return (
                    <tr key={yoga.slug} onClick={() => setSelectedYogaSlug(yoga.slug)} className="cursor-pointer align-top" style={{ background: active ? wash(yoga.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color: yoga.color }}><IAST>{yoga.iast}</IAST></td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{yoga.lords.map(grahaLabel).join(" + ")}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{yogaShadbala}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{yogaSav}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{yoga.classification}: {yoga.reading}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: wash(grahas.guru.primary, "10"), border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Coins size={17} color={grahas.guru.primary} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: grahas.guru.primary, letterSpacing: "0.08em" }}>
              Reading principle
            </p>
          </div>
          <p className="mt-3 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Yoga-presence is not yoga-strength.
          </p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            A practitioner first names the relationship, then grades the lords and the houses before promising results.
          </p>
        </section>
      </div>
    </div>
  );
}
