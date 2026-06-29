"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, CheckCircle2, CircleDot, Coins, Eye, Landmark, PiggyBank, RotateCcw, Sparkles, Table2 } from "lucide-react";
import { grahas, ink, rashis, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  DHANA_RELATION_MODES,
  RASHI_ORDER,
  WEALTH_HOUSES,
  dhanaPairs,
  grahaName,
  rashiName,
  wealthLordsForLagna,
  type DhanaRelationMode,
} from "./data";

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

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const DHANA = ink.goldAccent;
const RAJA_OVERLAP = grahas.guru.primary;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function relationIcon(mode: DhanaRelationMode, color: string) {
  if (mode === "exchange") return <ArrowRightLeft size={16} color={color} />;
  if (mode === "aspect") return <Eye size={16} color={color} />;
  return <Coins size={16} color={color} />;
}

function WealthCircuit({
  lagna,
  activeHouses,
}: {
  lagna: RashiSlug;
  activeHouses: number[];
}) {
  const lords = wealthLordsForLagna(lagna);
  const positions: Record<number, { x: number; y: number }> = {
    2: { x: 150, y: 114 },
    5: { x: 350, y: 114 },
    9: { x: 350, y: 254 },
    11: { x: 150, y: 254 },
  };

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 560 390" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="Dhana yoga four wealth house circuit">
        <rect x="18" y="20" width="524" height="344" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="280" y="54" textAnchor="middle" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          2 - 5 - 9 - 11 WEALTH-HOUSE LORD CIRCUIT
        </text>
        <path d="M150 114 L350 114 L350 254 L150 254 Z" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="7 8" />
        <path d="M350 114 C386 156 386 212 350 254" fill="none" stroke={RAJA_OVERLAP} strokeWidth="3" opacity="0.55" />
        {lords.map((lord) => {
          const point = positions[lord.house];
          const active = activeHouses.includes(lord.house);
          const color = lord.wealthHouse.color;
          return (
            <g key={lord.house}>
              <circle cx={point.x} cy={point.y} r={active ? 52 : 44} fill={active ? wash(color, "24") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.7 : 1.4} />
              <text x={point.x} y={point.y - 23} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                H{lord.house}
              </text>
              <text x={point.x} y={point.y - 2} textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {lord.wealthHouse.label}
              </text>
              <text x={point.x} y={point.y + 19} textAnchor="middle" fill={readableColor(grahas[lord.lord].primary)} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {grahaName(lord.lord)}
              </text>
              <text x={point.x} y={point.y + 35} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {rashis[lord.sign].iast}
              </text>
            </g>
          );
        })}
        <circle cx="268" cy="184" r="48" fill={wash(DHANA, "16")} stroke={DHANA} strokeWidth="2.5" />
        <text x="268" y="176" textAnchor="middle" fill={DHANA} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          DHANA
        </text>
        <text x="268" y="201" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          relationship
        </text>
        <text x="280" y="326" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          H5-H9 is also a trikona-trikona raja-grade overlap.
        </text>
      </svg>
    </section>
  );
}

export function DhanaYogaDetector() {
  const [lagna, setLagna] = useState<RashiSlug>("vrishabha");
  const [mode, setMode] = useState<DhanaRelationMode>("conjunction");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lords = useMemo(() => wealthLordsForLagna(lagna), [lagna]);
  const pairs = useMemo(() => dhanaPairs(lagna), [lagna]);
  const selectedPair = pairs[selectedIndex] ?? pairs[0];
  const activeHouses = selectedPair ? [selectedPair.first.house, selectedPair.second.house] : [];
  const modeMeta = DHANA_RELATION_MODES[mode];

  function reset() {
    setLagna("vrishabha");
    setMode("conjunction");
    setSelectedIndex(0);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="dhana-yoga-detector"
      style={{
        maxWidth: 840,
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
            Dhana-yoga detector
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Wealth lords: 2nd, 5th, 9th, and 11th
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose a lagna, read the four wealth-house lords, then mark their conjunction, aspect, or exchange.
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
              Lagna and relationship
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
                    {rashiName(slug)}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {(Object.keys(DHANA_RELATION_MODES) as DhanaRelationMode[]).map((key) => {
                const active = mode === key;
                return (
                  <button key={key} type="button" onClick={() => setMode(key)} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(DHANA, "18") : SURFACE_2, border: `1px solid ${active ? DHANA : HAIRLINE}`, color: active ? DHANA : INK_SECONDARY }}>
                    {relationIcon(key, active ? DHANA : INK_SECONDARY)}
                    {DHANA_RELATION_MODES[key].label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <WealthCircuit lagna={lagna} activeHouses={activeHouses} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: DHANA, letterSpacing: "0.08em" }}>
                Current pair
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                H{selectedPair.first.house} {grahaName(selectedPair.first.lord)} + H{selectedPair.second.house} {grahaName(selectedPair.second.lord)}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {modeMeta.note} {selectedPair.dualRaja ? "This is the special 5th-9th pair: dhana and raja-grade together." : "This is a wealth-house relationship candidate."}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: DHANA }}>
              धन
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(WEALTH_HOUSES[0].color, "10"), border: `1px solid ${HAIRLINE}` }}>
              <PiggyBank size={17} color={WEALTH_HOUSES[0].color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Primary wealth</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>2nd holds wealth; 11th brings gains and income.</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: wash(RAJA_OVERLAP, "10"), border: `1px solid ${HAIRLINE}` }}>
              <Sparkles size={17} color={RAJA_OVERLAP} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Fortune houses</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>5th and 9th add Lakshmi, merit, grace, and bhagya.</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: selectedPair.dualRaja ? wash(RAJA_OVERLAP, "16") : SURFACE_2, border: `1px solid ${selectedPair.dualRaja ? RAJA_OVERLAP : HAIRLINE}` }}>
              <Landmark size={17} color={selectedPair.dualRaja ? RAJA_OVERLAP : INK_MUTED} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Dual classification</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selectedPair.dualRaja ? "5th-9th is both dhana and raja-grade." : "Only the 5th-9th pair carries this overlap."}</p>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Dhana-yoga relationship candidates
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "", width: "w-12" },
                    { label: "First wealth lord", width: "w-[180px]" },
                    { label: "Second wealth lord", width: "w-[180px]" },
                    { label: "Mode", width: "w-[110px]" },
                    { label: "Classification", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair, index) => {
                  const active = index === selectedIndex;
                  return (
                    <tr key={`${pair.first.house}-${pair.second.house}`} onClick={() => setSelectedIndex(index)} className="cursor-pointer" style={{ background: active ? wash(DHANA, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3">{active ? <CheckCircle2 size={17} color={DHANA} /> : <CircleDot size={17} color={INK_MUTED} />}</td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: pair.first.wealthHouse.color }}>H{pair.first.house} {grahaName(pair.first.lord)}</p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{rashis[pair.first.sign].iast}: {pair.first.wealthHouse.label}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="m-0 font-bold" style={{ color: pair.second.wealthHouse.color }}>H{pair.second.house} {grahaName(pair.second.lord)}</p>
                        <p className="m-0 text-xs" style={{ color: INK_MUTED }}>{rashis[pair.second.sign].iast}: {pair.second.wealthHouse.label}</p>
                      </td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{DHANA_RELATION_MODES[mode].label}</td>
                      <td className="px-4 py-3 break-words" style={{ color: pair.dualRaja ? RAJA_OVERLAP : INK_SECONDARY }}>{pair.dualRaja ? "Dhana + raja-grade" : "Dhana yoga candidate"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Coins size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Wealth-house lord table
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {lords.map((lord) => (
              <article key={lord.house} className="rounded-xl p-4" style={{ background: wash(lord.wealthHouse.color, "10"), border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: lord.wealthHouse.color, letterSpacing: "0.08em" }}>
                  H{lord.house} <IAST>{lord.wealthHouse.iast}</IAST>
                </p>
                <p className="mt-2 text-lg font-bold" style={{ color: INK_PRIMARY }}>{grahaName(lord.lord)} rules {rashis[lord.sign].iast}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{lord.wealthHouse.meaning}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
