"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, CircleDot, Compass, Handshake, RotateCcw, ShieldAlert, Swords, Workflow } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { CLUSTER_GUARDS, MERCURY_NET, RASHIS, getProfile, getRashi, isMarsNek, type FocusPlanet } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const NEK = "#2F7D52";
const BAD = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
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

function MarsSignStrip({ selectedSign, onSignChange }: { selectedSign: number; onSignChange: (sign: number) => void }) {
  const selectedRashi = getRashi(selectedSign);
  const nek = isMarsNek(selectedSign);
  const color = nek ? NEK : BAD;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Swords size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Mars sign-key finder</p>
        </div>
        <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(color, "18"), border: `1px solid ${color}`, color }}>
          {nek ? "Maṅgal nek" : "Maṅgal bad tendency"}
        </span>
      </div>

      {/* North Indian diamond chart for sign selection */}
      <div style={{ width: "100%", maxWidth: 460, margin: "0 auto" }}>
        <svg viewBox="0 0 400 420" className="h-auto w-full min-w-0" role="img" aria-label="Mars sign-key finder North Indian chart">
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

          {/* Clickable house/sign polygons */}
          {RASHIS.map((rashi) => {
            const active = rashi.id === selectedSign;
            const own = isMarsNek(rashi.id);
            const center = NI_HOUSE_CENTERS[rashi.id];

            const fillColor = active
              ? wash(color, "25")
              : own
              ? wash(NEK, "12")
              : "transparent";
            const strokeColor = active ? color : own ? `${NEK}55` : "transparent";

            return (
              <g
                key={rashi.id}
                role="button"
                tabIndex={0}
                onClick={() => onSignChange(rashi.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSignChange(rashi.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <polygon
                  points={NI_HOUSE_POLYGONS[rashi.id]}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={active ? 2.2 : 1}
                  style={{ transition: "fill 0.2s ease" }}
                />

                <g transform={`translate(${center.x}, ${center.y})`}>
                  {/* Sign number */}
                  <text
                    y={-18}
                    fill={active ? color : own ? NEK : INK_SECONDARY}
                    fontSize={13}
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    #{rashi.id}
                  </text>

                  {/* Sign IAST name */}
                  <text
                    y={0}
                    fill={active ? color : own ? NEK : INK_PRIMARY}
                    fontSize={15}
                    fontWeight="950"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    <IAST>{rashi.iast.length > 5 ? rashi.iast.slice(0, 5) + "…" : rashi.iast}</IAST>
                  </text>

                  {/* Own/other sign label */}
                  <text
                    y={16}
                    fill={active ? color : INK_MUTED}
                    fontSize={10}
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: "var(--font-sans), sans-serif" }}
                  >
                    {own ? "own sign" : "other sign"}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Chart footer */}
          <text x="200" y="412" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            Click a sign to check Maṅgal nek / bad classification
          </text>
        </svg>
      </div>

      {/* Selected sign details */}
      <div className="mt-4 grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,280px)]">
        <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected sign</p>
          <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{selectedRashi.iast}</IAST> / {selectedRashi.name}
          </h3>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            Mars in Meṣa or Vṛścika is classified first as Maṅgal nek. Other signs incline toward Maṅgal bad before deeper house and association work.
          </p>
        </div>
        <div className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "12"), border: `1px solid ${color}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Remedy triage</p>
          <p className="mt-2 text-lg font-bold" style={{ color: INK_PRIMARY }}>{nek ? "Preserve Mars strength" : "Inspect Mars pacification"}</p>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
            {nek ? "The Mars cluster can protect courage, brothers, and land." : "The Mars cluster may need careful remedial handling."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function LalKitabMarsMercuryMapper() {
  const [focus, setFocus] = useState<FocusPlanet>("mars");
  const [selectedSign, setSelectedSign] = useState(8);
  const [clusterIndex, setClusterIndex] = useState(0);
  const profile = getProfile(focus);
  const marsNek = isMarsNek(selectedSign);
  const cluster = CLUSTER_GUARDS[clusterIndex];
  const clusterMatches = cluster.belongsTo === profile.label;

  const focusSummary = useMemo(() => {
    if (focus === "mars") {
      return marsNek
        ? "Own-sign Mars: classify as Maṅgal nek before reading the brother-courage-land cluster."
        : "Other-sign Mars: classify as Maṅgal bad tendency before remedy triage.";
    }
    return "Mercury keeps business and communication, then widens to in-laws and sister.";
  }, [focus, marsNek]);

  const reset = () => {
    setFocus("mars");
    setSelectedSign(8);
    setClusterIndex(0);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-mars-mercury-mapper"
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
            Lal Kitab Mars-Mercury mapper
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Split Mars first; route Mercury relations precisely
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Classify Maṅgal nek/bad by sign, then compare it with Budha&apos;s business-communication-family net.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Scorpio Mars
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2">
        {(["mars", "mercury"] as FocusPlanet[]).map((key) => {
          const item = getProfile(key);
          const active = focus === key;
          return (
            <button key={key} type="button" onClick={() => setFocus(key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: active ? wash(item.color, "12") : SURFACE, border: `1px solid ${active ? item.color : HAIRLINE}` }}>
              {active ? <CheckCircle2 size={17} color={item.color} /> : <CircleDot size={17} color={INK_MUTED} />}
              <div className="mt-2 flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-sm font-bold" style={{ color: active ? item.color : INK_PRIMARY }}>{item.label}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.headline}</p>
                </div>
                <Devanagari size="sm" className="shrink-0" style={{ color: item.color }}>{item.devanagari}</Devanagari>
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(profile.color, "10"), border: `1px solid ${profile.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: profile.color, letterSpacing: "0.08em" }}>Selected planet</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{profile.iast}</IAST>: {profile.headline}
                </h3>
                <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{focusSummary}</p>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{profile.lalKitabMove}</p>
              </div>
              <Devanagari size="md" className="shrink-0" style={{ color: profile.color }}>{profile.devanagari}</Devanagari>
            </div>
          </article>

          <MarsSignStrip selectedSign={selectedSign} onSignChange={setSelectedSign} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Workflow size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Portfolio boundary</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{profile.classicalOverlap}</p>
            <div className="mt-3 grid min-w-0 gap-2">
              {profile.significations.map((item) => (
                <div key={item} className="min-w-0 rounded-lg p-3 text-sm font-bold" style={{ background: wash(profile.color, "0E"), border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Compass size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Upāya hook</p>
            </div>
            <div className="grid min-w-0 gap-2">
              {profile.remedyHooks.map((item) => (
                <div key={item} className="min-w-0 rounded-lg p-3 text-sm" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
                  {item}
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Handshake size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Mercury family net</p>
          </div>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {MERCURY_NET.map((item) => (
              <div key={item.label} className="min-w-0 rounded-lg p-3" style={{ background: item.keep ? wash(getProfile("mercury").color, "10") : SURFACE_2, border: `1px solid ${item.keep ? getProfile("mercury").color : HAIRLINE}` }}>
                <p className="m-0 text-sm font-bold" style={{ color: item.keep ? getProfile("mercury").color : INK_SECONDARY }}>{item.label}</p>
                <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.cue}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cluster guard</p>
          </div>
          <div className="grid min-w-0 gap-2">
            {CLUSTER_GUARDS.map((item, index) => (
              <button key={item.label} type="button" onClick={() => setClusterIndex(index)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: clusterIndex === index ? wash(profile.color, "10") : SURFACE_2, border: `1px solid ${clusterIndex === index ? profile.color : HAIRLINE}`, color: clusterIndex === index ? profile.color : INK_SECONDARY }}>
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-lg p-3" style={{ background: clusterMatches ? wash(profile.color, "12") : SURFACE_2, border: `1px solid ${clusterMatches ? profile.color : HAIRLINE}` }}>
            <p className="m-0 text-sm font-bold" style={{ color: clusterMatches ? profile.color : GOLD }}>{cluster.belongsTo}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{cluster.correction}</p>
          </div>
        </article>
      </section>
    </div>
  );
}
