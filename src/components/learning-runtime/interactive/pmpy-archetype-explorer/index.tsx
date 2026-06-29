"use client";

import { useState } from "react";
import { CheckCircle2, CircleDot, Compass, Crown, EyeOff, RotateCcw, ShieldCheck, Sparkles, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import {
  EXCLUSION_CHECKS,
  KENDRA_HOUSES,
  PMPY_ARCHETYPES,
  getPmpy,
  type PmpySlug,
  type ReckoningSource,
} from "./data";

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

function ArchetypeWheel({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: PmpySlug;
  onSelect: (slug: PmpySlug) => void;
}) {
  const positions: Record<PmpySlug, { x: number; y: number }> = {
    ruchaka: { x: 260, y: 86 },
    bhadra: { x: 392, y: 180 },
    hamsa: { x: 342, y: 318 },
    malavya: { x: 178, y: 318 },
    shasha: { x: 128, y: 180 },
  };

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 400" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label="Pancha Mahapurusha archetype explorer">
        <rect x="18" y="18" width="484" height="354" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          FIVE GREAT-PERSON ARCHETYPES
        </text>
        <circle cx="260" cy="212" r="90" fill={wash(GOLD, "10")} stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 8" />
        <circle cx="260" cy="212" r="52" fill={SURFACE} stroke={GOLD} strokeWidth="2" />
        <text x="260" y="205" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          PMPY
        </text>
        <text x="260" y="228" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          own/exalt + kendra
        </text>
        {PMPY_ARCHETYPES.map((item) => {
          const point = positions[item.slug];
          const active = item.slug === selectedSlug;
          return (
            <g
              key={item.slug}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(item.slug);
              }}
              style={{ cursor: "pointer" }}
            >
              <line x1="260" y1="212" x2={point.x} y2={point.y} stroke={HAIRLINE} strokeWidth="1.4" strokeDasharray="5 7" />
              <rect x={point.x - 58} y={point.y - 32} width="116" height="64" rx="14" fill={active ? wash(item.color, "18") : SURFACE} stroke={active ? item.color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
              <text x={point.x} y={point.y - 10} textAnchor="middle" fill={active ? item.color : INK_PRIMARY} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {item.yoga}
              </text>
              <text x={point.x} y={point.y + 8} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {item.planetLabel}
              </text>
              <text x={point.x} y={point.y + 24} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {item.archetype}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}

export function PmpyArchetypeExplorer() {
  const [selectedSlug, setSelectedSlug] = useState<PmpySlug>("ruchaka");
  const [reckoning, setReckoning] = useState<ReckoningSource>("lagna");
  const [house, setHouse] = useState(10);
  const selected = getPmpy(selectedSlug);
  const isKendra = KENDRA_HOUSES.includes(house);
  const forms = isKendra;

  function reset() {
    setSelectedSlug("ruchaka");
    setReckoning("lagna");
    setHouse(10);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="pmpy-archetype-explorer"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Pancha Mahapurusha archetype explorer
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            The recipe, the five portraits, and their aptitudes
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Choose one of the five tara-grahas, read its own/exaltation signs, and treat the yoga as a whole character portrait.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Ruchaka
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Compass size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Recipe test
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)]">
            <label className="grid gap-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Reckon kendra from
              <select value={reckoning} onChange={(event) => setReckoning(event.target.value as ReckoningSource)} className="rounded-lg px-3 py-2" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                <option value="lagna">Lagna</option>
                <option value="moon">Moon</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              House from {reckoning === "lagna" ? "Lagna" : "Moon"}
              <select value={house} onChange={(event) => setHouse(Number(event.target.value))} className="rounded-lg px-3 py-2" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {Array.from({ length: 12 }, (_, index) => index + 1).map((item) => (
                  <option key={item} value={item}>
                    {item}{KENDRA_HOUSES.includes(item) ? " - kendra" : ""}
                  </option>
                ))}
              </select>
            </label>
            <article className="rounded-xl p-4" style={{ background: forms ? wash(selected.color, "12") : SURFACE_2, border: `1px solid ${forms ? selected.color : HAIRLINE}` }}>
              {forms ? <CheckCircle2 size={17} color={selected.color} /> : <CircleDot size={17} color={INK_MUTED} />}
              <p className="mt-2 text-sm font-bold" style={{ color: forms ? selected.color : INK_PRIMARY }}>
                {forms ? `${selected.yoga} can form` : "Kendra condition missing"}
              </p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                {selected.planetLabel} must be in {selected.ownSigns.join(" / ")} or exalted in {selected.exaltation}, and in a kendra.
              </p>
            </article>
          </div>
        </section>

        <ArchetypeWheel selectedSlug={selectedSlug} onSelect={setSelectedSlug} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Selected archetype
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.iast}</IAST> · {selected.archetype}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selected.reading}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
              {selected.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}55` }}>
              <Crown size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Dignity signs</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                Own: {selected.ownSigns.join(", ")}. Exaltation: {selected.exaltation}.
              </p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <Sparkles size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Temperament</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.temperament}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <ShieldCheck size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Body cue</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.bodyCue}</p>
            </article>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                Career aptitudes
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {selected.aptitudes.map((aptitude) => (
                <div key={aptitude} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: wash(selected.color, "10"), border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                  {aptitude}
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <EyeOff size={17} color={grahas.shani.primary} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                Exclusions
              </p>
            </div>
            <div className="grid gap-2">
              {EXCLUSION_CHECKS.map((item) => (
                <article key={item.planet} className="rounded-lg p-3" style={{ background: item.eligible ? wash(grahas.guru.primary, "10") : SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-sm font-bold" style={{ color: item.eligible ? grahas.guru.primary : INK_PRIMARY }}>{item.planet}</p>
                  <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{item.reason}</p>
                </article>
              ))}
            </div>
          </article>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Five-yoga reference table
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "", width: "w-12" },
                    { label: "Yoga", width: "w-[120px]" },
                    { label: "Planet", width: "w-[100px]" },
                    { label: "Own / exalt signs", width: "w-[200px]" },
                    { label: "Archetype", width: "w-[130px]" },
                    { label: "Aptitudes", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PMPY_ARCHETYPES.map((item) => {
                  const active = selected.slug === item.slug;
                  return (
                    <tr key={item.slug} onClick={() => setSelectedSlug(item.slug)} className="cursor-pointer align-top" style={{ background: active ? wash(item.color, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3">{active ? <CheckCircle2 size={17} color={item.color} /> : <CircleDot size={17} color={INK_MUTED} />}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: item.color }}><IAST>{item.iast}</IAST></td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{item.planetLabel}</td>
                      <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>Own: {item.ownSigns.join(", ")}; exalt: {item.exaltation}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{item.archetype}</td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{item.aptitudes.join(", ")}</td>
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
