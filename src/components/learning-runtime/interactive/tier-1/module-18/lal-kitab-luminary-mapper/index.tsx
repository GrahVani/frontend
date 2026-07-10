"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Droplets, Landmark, RotateCcw, ShieldAlert, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { CLUSTER_GUARDS, HOUSE_NUMBERS, getLuminary, otherLuminary, type LuminaryKey } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const READABLE_MOON = "#356CAB";

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function readableLuminaryColor(key: LuminaryKey, color: string) {
  return key === "moon" ? READABLE_MOON : color;
}

/* ── Standard North Indian diamond chart geometry (400×400 viewBox) ── */
const NI_HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105",
};

const NI_HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },
  2: { x: 105, y: 45 },
  3: { x: 45, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 45, y: 295 },
  6: { x: 105, y: 355 },
  7: { x: 200, y: 295 },
  8: { x: 295, y: 355 },
  9: { x: 355, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 355, y: 105 },
  12: { x: 295, y: 45 },
};

const SIGN_ABBRS = ["Ar", "Ta", "Ge", "Cn", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"];
const SIGN_NAMES = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

function TevaLuminarySvg({
  selected,
  house,
  onHouseChange,
}: {
  selected: LuminaryKey;
  house: number;
  onHouseChange: (house: number) => void;
}) {
  const profile = getLuminary(selected);
  const accentColor = readableLuminaryColor(profile.key, profile.color);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}>
        <svg viewBox="0 0 400 420" className="h-auto w-full min-w-0" role="img" aria-label="Fixed North Indian Teva chart for Lal Kitab luminary placement">
          {/* Chart lines */}
          <g stroke="rgba(130, 90, 30, 0.65)" strokeWidth="1.8" fill="none">
            <rect x="10" y="10" width="380" height="380" />
            <line x1="10" y1="10" x2="390" y2="390" />
            <line x1="390" y1="10" x2="10" y2="390" />
            <line x1="200" y1="10" x2="10" y2="200" />
            <line x1="10" y1="200" x2="200" y2="390" />
            <line x1="200" y1="390" x2="390" y2="200" />
            <line x1="390" y1="200" x2="200" y2="10" />
          </g>

          {/* Clickable house polygons */}
          {Array.from({ length: 12 }, (_, idx) => {
            const h = idx + 1;
            const active = h === house;
            const signAbbr = SIGN_ABBRS[h - 1];
            const signName = SIGN_NAMES[h - 1];
            const center = NI_HOUSE_CENTERS[h];

            const polyFill = active
              ? wash(profile.color, "20")
              : "transparent";
            const polyStroke = active
              ? accentColor
              : "transparent";

            return (
              <g
                key={h}
                role="button"
                tabIndex={0}
                onClick={() => onHouseChange(h)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onHouseChange(h);
                }}
                style={{ cursor: "pointer" }}
              >
                {/* Hit area polygon */}
                <polygon
                  points={NI_HOUSE_POLYGONS[h]}
                  fill={polyFill}
                  stroke={polyStroke}
                  strokeWidth={active ? 2.2 : 0}
                  style={{ transition: "fill 0.2s ease" }}
                />

                {/* House label + sign info vertically stacked */}
                <g transform={`translate(${center.x}, ${center.y})`}>
                  {/* House number */}
                  <text
                    y={-18}
                    fill={active ? accentColor : INK_SECONDARY}
                    fontSize={13}
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    H{h}
                  </text>

                  {/* Sign abbreviation */}
                  <text
                    y={0}
                    fill={active ? accentColor : INK_PRIMARY}
                    fontSize={16}
                    fontWeight="950"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    {signAbbr}
                  </text>

                  {/* Sign name */}
                  <text
                    y={16}
                    fill={active ? accentColor : INK_MUTED}
                    fontSize={11}
                    fontWeight="600"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    {signName}
                  </text>

                  {/* Planet indicator when this house is selected */}
                  {active && (
                    <>
                      <rect
                        x={-20}
                        y={25}
                        width={40}
                        height={18}
                        rx={4}
                        fill={accentColor}
                        opacity={0.15}
                      />
                      <text
                        y={34}
                        fill={accentColor}
                        fontSize={10}
                        fontWeight="900"
                        textAnchor="middle"
                        dominantBaseline="central"
                        style={{ fontFamily: "var(--font-sans), sans-serif" }}
                      >
                        {profile.label}
                      </text>
                    </>
                  )}
                </g>
              </g>
            );
          })}

          {/* Chart title */}
          <text x="200" y="412" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            Click a house to read its Lal Kitab luminary tendency
          </text>
        </svg>
      </div>
    </section>
  );
}

export function LalKitabLuminaryMapper() {
  const [selected, setSelected] = useState<LuminaryKey>("sun");
  const [house, setHouse] = useState(10);
  const [clusterIndex, setClusterIndex] = useState(0);
  const profile = getLuminary(selected);
  const profileAccent = readableLuminaryColor(profile.key, profile.color);
  const opposite = getLuminary(otherLuminary(selected));
  const cluster = CLUSTER_GUARDS[clusterIndex];
  const clusterMatches = cluster.belongsTo === profile.label;
  const tendency = profile.houseTendencies[house - 1];

  const remedyIcon = selected === "sun" ? Landmark : Droplets;
  const RemedyIcon = remedyIcon;

  const reset = () => {
    setSelected("sun");
    setHouse(10);
    setClusterIndex(0);
  };

  const summary = useMemo(() => {
    return selected === "sun"
      ? "Same classical core, Lal Kitab paternal-authority remedy apparatus."
      : "Same classical core, Lal Kitab maternal-water remedy apparatus.";
  }, [selected]);

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-luminary-mapper"
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
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Lal Kitab luminary mapper
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Same parent core, different remedy grammar
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Toggle the Sun and Moon, place them in the Teva, and guard against importing neighbouring planet clusters.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Sun
        </button>
      </div>

      <div className="grid min-w-0 gap-4">
        <section className="grid min-w-0 gap-3 md:grid-cols-2">
          {(["sun", "moon"] as LuminaryKey[]).map((key) => {
            const item = getLuminary(key);
            const itemAccent = readableLuminaryColor(item.key, item.color);
            const active = selected === key;
            return (
              <button key={key} type="button" onClick={() => setSelected(key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(item.color, "12") : SURFACE, border: `1px solid ${active ? itemAccent : HAIRLINE}` }}>
                {active ? <CheckCircle2 size={17} color={itemAccent} /> : <CircleDot size={17} color={INK_MUTED} />}
                <div className="mt-2 flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="m-0 text-sm font-bold" style={{ color: active ? itemAccent : INK_PRIMARY }}>{item.label}</p>
                    <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.axis}</p>
                  </div>
                  <Devanagari size="sm" className="shrink-0" style={{ color: itemAccent }}>{item.devanagari}</Devanagari>
                </div>
              </button>
            );
          })}
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(profile.color, "10"), border: `1px solid ${profileAccent}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: profileAccent, letterSpacing: "0.08em" }}>
                  Selected luminary
                </p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{profile.iast}</IAST>: {profile.axis}
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{summary}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{profile.lalKitabDistinctive}</p>
              </div>
              <Devanagari size="md" className="shrink-0" style={{ color: profileAccent }}>{profile.devanagari}</Devanagari>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Partial-overlap guard</p>
            <p className="mt-3 text-sm font-bold" style={{ color: INK_PRIMARY }}>{profile.classicalCore}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Do not invert it into {opposite.label.toLowerCase()} meanings. Lal Kitab differs through Teva tendency and upaya, not by swapping parents.
            </p>
          </article>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <div className="min-w-0">
            <TevaLuminarySvg selected={selected} house={house} onHouseChange={setHouse} />
          </div>
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>House tendency</p>
            <h3 className="mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              House {house}
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: profileAccent }}>{tendency}</p>
            <div className="mt-4 grid min-w-0 grid-cols-4 gap-2">
              {HOUSE_NUMBERS.map((item) => (
                <button key={item} type="button" onClick={() => setHouse(item)} className="min-w-0 rounded-lg px-2 py-2 text-sm font-bold" style={{ background: house === item ? wash(profile.color, "14") : SURFACE_2, border: `1px solid ${house === item ? profileAccent : HAIRLINE}`, color: house === item ? profileAccent : INK_SECONDARY }}>
                  H{item}
                </button>
              ))}
            </div>
          </article>
        </section>

        <section className="grid min-w-0 gap-4 lg:grid-cols-2">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Signification table</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {profile.significations.map((item) => (
                <div key={item} className="min-w-0 rounded-lg p-3 text-sm font-bold" style={{ background: wash(profile.color, "0E"), border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <RemedyIcon size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Upaya family</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {profile.remedies.map((item) => (
                <div key={item} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {item}
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Neighbour-cluster guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: clusterMatches ? profileAccent : INK_SECONDARY }}>
              {clusterMatches ? "Matches selected light" : "Belongs elsewhere"}
            </p>
          </div>
          <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
            <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {CLUSTER_GUARDS.map((item, index) => (
                <button key={item.label} type="button" onClick={() => setClusterIndex(index)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: clusterIndex === index ? wash(GOLD, "12") : SURFACE_2, border: `1px solid ${clusterIndex === index ? GOLD : HAIRLINE}`, color: clusterIndex === index ? GOLD : INK_SECONDARY }}>
                  {item.label}
                </button>
              ))}
            </div>
            <article className="min-w-0 rounded-xl p-4" style={{ background: clusterMatches ? wash(profile.color, "10") : SURFACE_2, border: `1px solid ${clusterMatches ? profileAccent : HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: clusterMatches ? profileAccent : GOLD, letterSpacing: "0.08em" }}>{cluster.belongsTo}</p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>{cluster.correction}</p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
