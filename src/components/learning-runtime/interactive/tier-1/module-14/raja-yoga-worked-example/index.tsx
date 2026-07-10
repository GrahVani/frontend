"use client";

import { useState } from "react";
import { CheckCircle2, ListChecks, RotateCcw, ShieldCheck, SlidersHorizontal, Sparkles, Table2 } from "lucide-react";
import { grahas, ink, type GrahaSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  CANCER_LORDS,
  CHART_PLACEMENTS,
  DEFAULT_STRENGTHS,
  WORKED_RAJA_YOGAS,
  deliveryBand,
  deliveryScore,
  grahaName,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const KENDRA = grahas.shani.primary;
const TRIKONA = grahas.guru.primary;
const YOGA = ink.goldAccent;

const HOUSE_POLYGONS: Record<number, string> = {
  1: "180,18 96,102 180,186 264,102",
  2: "18,18 180,18 96,102",
  3: "18,18 96,102 18,186",
  4: "18,186 96,102 180,186 96,270",
  5: "18,186 96,270 18,354",
  6: "18,354 96,270 180,354",
  7: "180,354 96,270 180,186 264,270",
  8: "180,354 264,270 342,354",
  9: "342,186 264,270 342,354",
  10: "342,186 264,102 180,186 264,270",
  11: "342,18 264,102 342,186",
  12: "180,18 342,18 264,102",
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 180, y: 98 },
  2: { x: 102, y: 52 },
  3: { x: 54, y: 102 },
  4: { x: 102, y: 186 },
  5: { x: 54, y: 270 },
  6: { x: 102, y: 322 },
  7: { x: 180, y: 270 },
  8: { x: 258, y: 322 },
  9: { x: 306, y: 270 },
  10: { x: 258, y: 186 },
  11: { x: 306, y: 102 },
  12: { x: 258, y: 52 },
};

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function readableGrahaColor(slug: GrahaSlug) {
  const readable: Partial<Record<GrahaSlug, string>> = {
    candra: "#5F6F96",
    shukra: "#4F7FAF",
    surya: "#9C7A2F",
    guru: "#B66F12",
  };
  return readable[slug] ?? grahas[slug].primary;
}

function familyColor(house: number) {
  if (house === 1) return YOGA;
  if ([4, 7, 10].includes(house)) return KENDRA;
  if ([5, 9].includes(house)) return TRIKONA;
  return HAIRLINE;
}

function CancerChart({ activeHouses }: { activeHouses: number[] }) {
  return (
    <section className="mx-auto w-full max-w-[560px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 430 455" className="mx-auto h-auto w-full max-w-[430px]" role="img" aria-label="Cancer lagna worked raja yoga chart">
        <rect x="16" y="18" width="398" height="417" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <g transform="translate(36 32)">
          <rect x="18" y="18" width="324" height="336" rx="10" fill={SURFACE} stroke={HAIRLINE} />
          <line x1={HOUSE_CENTERS[10].x} y1={HOUSE_CENTERS[10].y} x2={HOUSE_CENTERS[5].x} y2={HOUSE_CENTERS[5].y} stroke={grahas.shani.primary} strokeWidth="2.5" strokeDasharray="7 7" opacity="0.6" />
          {Array.from({ length: 12 }, (_, index) => index + 1).map((house) => {
            const active = activeHouses.includes(house);
            const color = familyColor(house);
            const point = HOUSE_CENTERS[house];
            const placement = CHART_PLACEMENTS.find((item) => item.house === house);
            return (
              <g key={house}>
                <polygon points={HOUSE_POLYGONS[house]} fill={active ? wash(color, "22") : house === 5 || house === 9 || house === 10 ? wash(color, "10") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.1} />
                <text x={point.x} y={point.y - 15} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  H{house}
                </text>
                {placement ? (
                  <>
                    <text x={point.x} y={point.y + 4} textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                      {placement.label}
                    </text>
                    <text x={point.x} y={point.y + 21} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                      placed here
                    </text>
                  </>
                ) : (
                  <text x={point.x} y={point.y + 6} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                    {house === 1 ? "Cancer" : ""}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        <text x="215" y="414" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Saturn in H10 aspects the Mars-Jupiter conjunction in H5.
        </text>
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-bold" style={{ color: INK_SECONDARY }}>
        {[
          [KENDRA, "Kendra"],
          [TRIKONA, "Trikona"],
          [YOGA, "Active yoga"],
        ].map(([color, label]) => (
          <span key={label} className="inline-flex items-center gap-2 rounded-full px-3 py-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <span className="h-3 w-3 rounded-full" style={{ background: wash(color, "28"), border: `1px solid ${color}` }} />
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}

export function RajaYogaWorkedExample() {
  const [selectedSlug, setSelectedSlug] = useState(WORKED_RAJA_YOGAS[0].slug);
  const [strengths, setStrengths] = useState<Record<GrahaSlug, number>>({ ...DEFAULT_STRENGTHS });
  const selected = WORKED_RAJA_YOGAS.find((item) => item.slug === selectedSlug) ?? WORKED_RAJA_YOGAS[0];
  const score = deliveryScore(selected, strengths);
  const band = deliveryBand(score);
  const activeHouses = Array.from(new Set(selected.houses));

  function reset() {
    setSelectedSlug(WORKED_RAJA_YOGAS[0].slug);
    setStrengths({ ...DEFAULT_STRENGTHS });
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="raja-yoga-worked-example"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Cancer-lagna raja-yoga sweep
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Find all four yogas before judging delivery
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Sweep the chart systematically: list kendra and trikona lords, mark the relationships, then grade lord strength separately.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset chart
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Sweep steps
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {WORKED_RAJA_YOGAS.map((yoga, index) => {
              const active = selected.slug === yoga.slug;
              return (
                <button key={yoga.slug} type="button" onClick={() => setSelectedSlug(yoga.slug)} className="rounded-lg px-3 py-2 text-left text-sm font-bold" style={{ background: active ? wash(YOGA, "18") : SURFACE_2, border: `1px solid ${active ? YOGA : HAIRLINE}`, color: active ? YOGA : INK_SECONDARY }}>
                  <span className="block text-xs uppercase" style={{ letterSpacing: "0.06em", color: active ? YOGA : INK_MUTED }}>Yoga {index + 1}</span>
                  {yoga.title}
                </button>
              );
            })}
          </div>
        </section>

        <CancerChart activeHouses={activeHouses} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: YOGA, letterSpacing: "0.08em" }}>
                Selected finding
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.title}</IAST>
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selected.pattern}. {selected.relationship}.
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: YOGA }}>
              राजयोग
            </Devanagari>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(YOGA, "10"), border: `1px solid ${YOGA}55` }}>
              <Sparkles size={17} color={YOGA} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Identification</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.result}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: wash(band.color, "10"), border: `1px solid ${band.color}55` }}>
              <ShieldCheck size={17} color={band.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Delivery preview</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{score}/100: {band.label}.</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <CheckCircle2 size={17} color={grahas.budha.primary} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Rule discipline</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Finding a yoga is step one; strength and timing decide outcome.</p>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <SlidersHorizontal size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Strength sliders for delivery caveat
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {(["mangala", "guru", "shani"] as GrahaSlug[]).map((lord) => (
              <label key={lord} className="rounded-xl p-4 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                <span className="flex items-center justify-between gap-3">
                  <span style={{ color: readableGrahaColor(lord) }}>{grahaName(lord)}</span>
                  <span>{strengths[lord]}</span>
                </span>
                <input type="range" min={30} max={95} step={1} value={strengths[lord]} onChange={(event) => setStrengths((current) => ({ ...current, [lord]: Number(event.target.value) }))} className="mt-3 w-full accent-[var(--gl-gold-accent)]" />
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Cancer-lagna lords and yoga findings
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "House", width: "w-12" },
                    { label: "Family", width: "w-[100px]" },
                    { label: "Lord", width: "w-[120px]" },
                    { label: "Sign owned", width: "w-[140px]" },
                    { label: "Worked-example note", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CANCER_LORDS.map((row) => {
                  const active = activeHouses.includes(row.house);
                  const color = row.family === "kendra" ? KENDRA : row.family === "trikona" ? TRIKONA : YOGA;
                  return (
                    <tr key={row.house} style={{ background: active ? wash(color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3 font-bold" style={{ color }}>H{row.house}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.family}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: readableGrahaColor(row.lord) }}>{grahaName(row.lord)}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{row.sign}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{row.note}</td>
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
