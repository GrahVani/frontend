"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, CircleDot, Flame, Gauge, RotateCcw, ShieldCheck, Sparkles, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { getPmpy, type PmpySlug } from "../pmpy-archetype-explorer/data";
import {
  DILUTION_FACTORS,
  DILUTION_PRESETS,
  RETROGRADE_BOOST,
  getPmpyOptions,
  gradeFromScore,
  type DilutionFactorSlug,
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

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function DilutionMeter({
  score,
  selectedColor,
  activeFactors,
  retrograde,
}: {
  score: number;
  selectedColor: string;
  activeFactors: DilutionFactorSlug[];
  retrograde: boolean;
}) {
  const scoreX = 78 + score * 3.56;
  const activeCount = activeFactors.length;

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 520 270" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label="PMPY dilution strength meter">
        <rect x="18" y="18" width="484" height="222" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="260" y="50" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          PRESENCE IS STRUCTURAL; DELIVERY IS GRADED
        </text>
        <line x1="78" y1="128" x2="434" y2="128" stroke={HAIRLINE} strokeWidth="12" strokeLinecap="round" />
        <line x1="78" y1="128" x2={scoreX} y2="128" stroke={selectedColor} strokeWidth="12" strokeLinecap="round" />
        <circle cx={scoreX} cy="128" r="18" fill={SURFACE} stroke={selectedColor} strokeWidth="3" />
        <text x={scoreX} y="133" textAnchor="middle" fill={selectedColor} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {score}
        </text>
        <text x="78" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          weak
        </text>
        <text x="256" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          diluted
        </text>
        <text x="434" y="160" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          pristine
        </text>
        <rect x="72" y="184" width="166" height="34" rx="12" fill={activeCount > 0 ? wash(grahas.mangala.primary, "12") : SURFACE} stroke={activeCount > 0 ? grahas.mangala.primary : HAIRLINE} />
        <text x="155" y="206" textAnchor="middle" fill={activeCount > 0 ? grahas.mangala.primary : INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {activeCount} dilution factor{activeCount === 1 ? "" : "s"}
        </text>
        <rect x="282" y="184" width="166" height="34" rx="12" fill={retrograde ? wash(RETROGRADE_BOOST.color, "12") : SURFACE} stroke={retrograde ? RETROGRADE_BOOST.color : HAIRLINE} />
        <text x="365" y="206" textAnchor="middle" fill={retrograde ? RETROGRADE_BOOST.color : INK_SECONDARY} fontSize="11" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          retrograde {retrograde ? "strengthens" : "off"}
        </text>
      </svg>
    </section>
  );
}

export function PmpyDilutionChecker() {
  const [selectedSlug, setSelectedSlug] = useState<PmpySlug>("bhadra");
  const [activeFactors, setActiveFactors] = useState<DilutionFactorSlug[]>(["combustion"]);
  const [retrograde, setRetrograde] = useState(false);
  const [shadbala, setShadbala] = useState(58);

  const selected = getPmpy(selectedSlug);
  const dilutionPenalty = DILUTION_FACTORS.filter((factor) => activeFactors.includes(factor.slug)).reduce((sum, factor) => sum + factor.weight, 0);
  const score = clampScore(shadbala - dilutionPenalty + (retrograde ? RETROGRADE_BOOST.boost : 0));
  const grade = gradeFromScore(score);

  function toggleFactor(slug: DilutionFactorSlug) {
    setActiveFactors((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]));
  }

  function applyPreset(index: number) {
    const preset = DILUTION_PRESETS[index] ?? DILUTION_PRESETS[0];
    setSelectedSlug(preset.yoga);
    setActiveFactors(preset.activeFactors);
    setRetrograde(preset.retrograde);
    setShadbala(preset.shadbala);
  }

  function reset() {
    setSelectedSlug("bhadra");
    setActiveFactors(["combustion"]);
    setRetrograde(false);
    setShadbala(58);
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="pmpy-dilution-checker"
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
            PMPY dilution checker
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            A great-person yoga is graded, not mechanically cancelled
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Start with a structurally valid PMPY, then apply combustion, affliction, shadbala, dispositor condition, and the retrogression correction.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Bhadra
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Choose the formed PMPY
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {getPmpyOptions().map((item) => {
              const active = selected.slug === item.slug;
              return (
                <button key={item.slug} type="button" onClick={() => setSelectedSlug(item.slug)} className="rounded-xl p-3 text-left" style={{ background: active ? wash(item.color, "14") : SURFACE_2, border: `1px solid ${active ? item.color : HAIRLINE}`, color: INK_PRIMARY }}>
                  {active ? <CheckCircle2 size={16} color={item.color} /> : <CircleDot size={16} color={INK_MUTED} />}
                  <p className="mt-2 text-sm font-bold" style={{ color: item.color }}><IAST>{item.iast}</IAST></p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.planetLabel}</p>
                </button>
              );
            })}
          </div>
        </section>

        <DilutionMeter score={score} selectedColor={selected.color} activeFactors={activeFactors} retrograde={retrograde} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Current grade
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.iast}</IAST>: {grade}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Structural recipe remains present, but delivery changes after dilution factors are applied. Combustion is checked first.
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
              {selected.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}55` }}>
              <Gauge size={17} color={selected.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Shadbala baseline</p>
              <input type="range" min="35" max="95" value={shadbala} onChange={(event) => setShadbala(Number(event.target.value))} className="mt-3 w-full" />
              <p className="m-0 text-sm font-bold" style={{ color: selected.color }}>{shadbala} strength points</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: retrograde ? wash(RETROGRADE_BOOST.color, "12") : SURFACE_2, border: `1px solid ${retrograde ? RETROGRADE_BOOST.color : HAIRLINE}` }}>
              <Sparkles size={17} color={RETROGRADE_BOOST.color} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Retrogression correction</p>
              <button type="button" onClick={() => setRetrograde((value) => !value)} className="mt-3 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: retrograde ? wash(RETROGRADE_BOOST.color, "16") : SURFACE, border: `1px solid ${retrograde ? RETROGRADE_BOOST.color : HAIRLINE}`, color: retrograde ? RETROGRADE_BOOST.color : INK_SECONDARY }}>
                {retrograde ? "Retrograde strengthens" : "Retrograde off"}
              </button>
              <p className="mt-2 text-xs" style={{ color: INK_SECONDARY }}>{RETROGRADE_BOOST.description}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <Flame size={17} color={grahas.surya.primary} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Combustion first</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
                If the yoga planet is burnt, do not announce a pristine Mahapurusha result.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Dilution factors
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {DILUTION_FACTORS.map((factor) => {
              const active = activeFactors.includes(factor.slug);
              return (
                <button key={factor.slug} type="button" onClick={() => toggleFactor(factor.slug)} className="rounded-xl p-4 text-left" style={{ background: active ? wash(factor.color, "12") : SURFACE_2, border: `1px solid ${active ? factor.color : HAIRLINE}`, color: INK_PRIMARY }}>
                  {active ? <CheckCircle2 size={17} color={factor.color} /> : <CircleDot size={17} color={INK_MUTED} />}
                  <p className="mt-2 text-sm font-bold" style={{ color: active ? factor.color : INK_PRIMARY }}>
                    {factor.label} <span style={{ color: INK_MUTED }}>(-{factor.weight})</span>
                  </p>
                  <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{factor.description}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {DILUTION_PRESETS.map((preset, index) => (
            <button key={preset.label} type="button" onClick={() => applyPreset(index)} className="rounded-xl p-4 text-left" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              <p className="m-0 text-sm font-bold" style={{ color: GOLD }}>{preset.label}</p>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {getPmpy(preset.yoga).yoga}; {preset.activeFactors.length} dilution factor{preset.activeFactors.length === 1 ? "" : "s"}; retrograde {preset.retrograde ? "on" : "off"}.
              </p>
            </button>
          ))}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
              Dilution reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Factor", width: "w-[140px]" },
                    { label: "Type", width: "w-[150px]" },
                    { label: "Effect", width: "w-[160px]" },
                    { label: "Reading cue", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DILUTION_FACTORS.map((factor) => (
                  <tr key={factor.slug} style={{ background: activeFactors.includes(factor.slug) ? wash(factor.color, "10") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: factor.color }}><IAST>{factor.iast}</IAST></td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{factor.label}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>Dilutes PMPY delivery</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{factor.cue}</td>
                  </tr>
                ))}
                <tr style={{ background: retrograde ? wash(RETROGRADE_BOOST.color, "10") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                  <td className="px-4 py-3 font-bold" style={{ color: RETROGRADE_BOOST.color }}><IAST>{RETROGRADE_BOOST.iast}</IAST></td>
                  <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{RETROGRADE_BOOST.label}</td>
                  <td className="px-4 py-3" style={{ color: RETROGRADE_BOOST.color }}>Strengthens, not dilutes</td>
                  <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{RETROGRADE_BOOST.description}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
