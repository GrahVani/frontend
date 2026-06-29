"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Link2, Repeat2, RotateCcw, Sparkles, Table2 } from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  RASHI_ORDER,
  RELATIONSHIP_MODES,
  grahaLabel,
  grahaShort,
  housesForLagna,
  rajaYogaPairs,
  rashiLabel,
  signForHouse,
  yogakarakas,
  type HouseLord,
  type RelationshipMode,
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

function relationIcon(mode: RelationshipMode) {
  if (mode === "exchange") return Repeat2;
  return Link2;
}

function houseFill(house: HouseLord, activeHouse: number | null) {
  if (house.house === activeHouse) return wash(YOGA, "22");
  if (house.kind === "both") return "rgba(232, 199, 114, 0.18)";
  if (house.kind === "kendra") return wash(KENDRA, "10");
  if (house.kind === "trikona") return wash(TRIKONA, "12");
  return SURFACE;
}

function RajaYogaChart({
  houses,
  activePair,
  onSelectHouse,
}: {
  houses: HouseLord[];
  activePair: { kendraHouse: number; trikonaHouse: number } | null;
  onSelectHouse: (house: number) => void;
}) {
  const activeHouses = activePair ? [activePair.kendraHouse, activePair.trikonaHouse] : [];
  const kendraPoint = activePair ? HOUSE_CENTERS[activePair.kendraHouse] : null;
  const trikonaPoint = activePair ? HOUSE_CENTERS[activePair.trikonaHouse] : null;

  return (
    <section className="mx-auto w-full max-w-[560px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 430 455" className="mx-auto h-auto w-full max-w-[430px]" role="img" aria-label="Kendra and trikona lords in a North Indian chart diagram">
        <rect x="16" y="18" width="398" height="417" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <g transform="translate(36 32)">
          <rect x="18" y="18" width="324" height="336" rx="10" fill={SURFACE} stroke={HAIRLINE} />
          {kendraPoint && trikonaPoint ? <line x1={kendraPoint.x} y1={kendraPoint.y} x2={trikonaPoint.x} y2={trikonaPoint.y} stroke={YOGA} strokeWidth="3" strokeDasharray="8 7" opacity="0.75" /> : null}
          {houses.map((house) => {
            const point = HOUSE_CENTERS[house.house];
            const active = activeHouses.includes(house.house);
            const sign = rashis[house.sign];
            const lordColor = readableGrahaColor(house.lord);
            return (
              <g
                key={house.house}
                onClick={() => onSelectHouse(house.house)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelectHouse(house.house);
                }}
                style={{ cursor: "pointer" }}
              >
                <polygon points={HOUSE_POLYGONS[house.house]} fill={houseFill(house, active ? house.house : null)} stroke={active ? YOGA : HAIRLINE} strokeWidth={active ? 2.5 : 1.1} />
                <text x={point.x} y={point.y - 12} textAnchor="middle" fill={active ? YOGA : INK_MUTED} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  H{house.house}
                </text>
                <text x={point.x} y={point.y + 6} textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {sign.number}
                </text>
                <text x={point.x} y={point.y + 23} textAnchor="middle" fill={lordColor} fontSize="10.5" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  {grahaShort(house.lord)}
                </text>
              </g>
            );
          })}
        </g>
        <text x="215" y="414" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Select a pair below to see the kendra-trikona bridge.
        </text>
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-bold" style={{ color: INK_SECONDARY }}>
        {[
          [KENDRA, "Kendra 1/4/7/10"],
          [TRIKONA, "Trikona 1/5/9"],
          [YOGA, "Active yoga link"],
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

export function RajaYogaDetector() {
  const [lagna, setLagna] = useState<RashiSlug>("vrishabha");
  const [mode, setMode] = useState<RelationshipMode>("conjunction");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const houses = useMemo(() => housesForLagna(lagna), [lagna]);
  const pairs = useMemo(() => rajaYogaPairs(lagna), [lagna]);
  const classicYogakarakas = useMemo(() => yogakarakas(lagna), [lagna]);
  const selectedPair = pairs[selectedIndex] ?? pairs[0];
  const activePair = selectedPair ? { kendraHouse: selectedPair.kendra.house, trikonaHouse: selectedPair.trikona.house } : null;
  const activeMode = RELATIONSHIP_MODES[mode];
  const lagnaRashi = rashis[lagna];

  function reset() {
    setLagna("vrishabha");
    setMode("conjunction");
    setSelectedIndex(0);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="raja-yoga-detector"
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
            Foundational Raja Yoga detector
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>Kendra</IAST> lord + <IAST>Trikoṇa</IAST> lord in relationship
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose a lagna, inspect the angle and trine lords, then toggle the relationship mode that turns the pair into a raja yoga.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Taurus
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Lagna and relationship mode
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <label className="grid gap-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Select lagna
              <select
                value={lagna}
                onChange={(event) => {
                  setLagna(event.target.value as RashiSlug);
                  setSelectedIndex(0);
                }}
                className="rounded-lg px-3 py-2"
                style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
              >
                {RASHI_ORDER.map((slug) => (
                  <option key={slug} value={slug}>
                    {rashiLabel(slug)}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(RELATIONSHIP_MODES) as RelationshipMode[]).map((key) => {
                const Icon = relationIcon(key);
                const active = mode === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setMode(key)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold"
                    style={{ background: active ? wash(YOGA, "18") : SURFACE_2, border: `1px solid ${active ? YOGA : HAIRLINE}`, color: active ? YOGA : INK_SECONDARY }}
                  >
                    <Icon size={16} />
                    {RELATIONSHIP_MODES[key].label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <RajaYogaChart houses={houses} activePair={activePair} onSelectHouse={(house) => {
          const found = pairs.findIndex((pair) => pair.kendra.house === house || pair.trikona.house === house);
          if (found >= 0) setSelectedIndex(found);
        }} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Selected lagna
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{lagnaRashi.iast}</IAST> / {lagnaRashi.english}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                The 1st house is both a kendra and a trikona, so the lagna lord can participate in either side of the pattern.
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: ink.goldAccent }}>
              राजयोग
            </Devanagari>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl p-4" style={{ background: wash(YOGA, "10"), border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center gap-2">
                <Sparkles size={17} color={YOGA} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: YOGA, letterSpacing: "0.08em" }}>
                  Active relationship
                </p>
              </div>
              <p className="mt-3 text-lg font-bold" style={{ color: INK_PRIMARY }}>
                {activeMode.label} <span style={{ color: INK_MUTED }}>({activeMode.iast})</span>
              </p>
              <p className="mt-1 text-sm" style={{ color: INK_SECONDARY }}>
                {activeMode.description}
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Yogakaraka scan
              </p>
              {classicYogakarakas.length > 0 ? (
                classicYogakarakas.map((item) => (
                  <p key={`${item.lord}-${item.kendraHouse}-${item.trikonaHouse}`} className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
                    <strong style={{ color: readableGrahaColor(item.lord) }}>{grahaLabel(item.lord)}</strong> owns kendra H{item.kendraHouse} and trikona H{item.trikonaHouse}: a raja yoga in one planet.
                  </p>
                ))
              ) : (
                <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
                  No classic non-lagna yogakaraka for this lagna. Use the pair detector below.
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Raja-yoga relationship candidates
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "", width: "w-12" },
                    { label: "Kendra side", width: "w-[140px]" },
                    { label: "Trikona side", width: "w-[140px]" },
                    { label: "Relationship", width: "w-[120px]" },
                    { label: "Reading cue", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pairs.slice(0, 12).map((pair, index) => {
                  const active = index === selectedIndex;
                  const kendraLordColor = readableGrahaColor(pair.kendra.lord);
                  const trikonaLordColor = readableGrahaColor(pair.trikona.lord);
                  return (
                    <tr
                      key={`${pair.kendra.house}-${pair.trikona.house}-${index}`}
                      onClick={() => setSelectedIndex(index)}
                      className="cursor-pointer"
                      style={{ background: active ? wash(YOGA, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}
                    >
                      <td className="px-4 py-3">
                        {active ? <CheckCircle2 size={17} color={YOGA} /> : <CircleDot size={17} color={INK_MUTED} />}
                      </td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: kendraLordColor }}>
                          H{pair.kendra.house} {grahaLabel(pair.kendra.lord)}
                        </p>
                        <p className="m-0 text-xs font-medium" style={{ color: INK_SECONDARY }}>
                          {rashis[pair.kendra.sign].iast}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: trikonaLordColor }}>
                          H{pair.trikona.house} {grahaLabel(pair.trikona.lord)}
                        </p>
                        <p className="m-0 text-xs font-medium" style={{ color: INK_SECONDARY }}>
                          {rashis[pair.trikona.sign].iast}
                        </p>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>
                        {RELATIONSHIP_MODES[mode].label}
                      </td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>
                        {pair.samePlanet ? "Single lord binds both sides; inspect yogakaraka quality." : "If these lords relate by the selected mode, the foundational pattern is active."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {[
            ["Pattern", "Kendra lord plus trikona lord in relationship."],
            ["Modes", "Conjunction, mutual aspect, exchange, or one-way aspect all count."],
            ["Next skill", `After detection, judge strength and timing; this lesson only proves the structure. H10 sign for this lagna is ${rashis[signForHouse(lagna, 10)].iast}.`],
          ].map(([title, body]) => (
            <article key={title} className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                {title}
              </p>
              <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>
                {body}
              </p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
