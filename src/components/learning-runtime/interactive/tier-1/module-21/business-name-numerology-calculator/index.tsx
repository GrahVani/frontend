"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, GitCompare, RotateCcw, ShieldAlert, Store, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  DEFAULT_CANDIDATES,
  INDUSTRY_PREFERENCES,
  computeCandidate,
  getIndustry,
  launchContextFrame,
  type BusinessCandidateInput,
  type BusinessCandidateResult,
  type Convention,
  type LaunchContext,
  type NumerologySystem,
} from "./data";
import { DIGIT_REGISTERS, getDigitRegister, relationLabel, type Relation } from "../numerology-compatibility-calculator/data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;
const NEUTRAL = "#8A6D2F";

const readableGrahaColor: Record<number, string> = {
  1: "#C98B12",
  2: "#2F6FB2",
  3: "#C17A15",
  4: "#555866",
  5: "#2F7D52",
  6: "#356C96",
  7: "#7A3E4A",
  8: "#2C2C3E",
  9: "#C8412E",
};

const SYSTEMS: { key: NumerologySystem; label: string }[] = [
  { key: "vedic-hybrid", label: "Vedic-Chaldean" },
  { key: "chaldean", label: "Chaldean" },
  { key: "pythagorean", label: "Pythagorean" },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function relationColor(relation: Relation) {
  if (relation === "mitra") return GREEN;
  if (relation === "shatru") return VERMILION;
  return NEUTRAL;
}

function fitColor(fit: BusinessCandidateResult["industryFit"]) {
  if (fit === "preferred") return GREEN;
  if (fit === "workable") return GOLD;
  return VERMILION;
}

function BrandFitSvg({
  candidate,
  founderMulanka,
  founderBhagyanka,
}: {
  candidate: BusinessCandidateResult;
  founderMulanka: number;
  founderBhagyanka: number;
}) {
  const brandColor = readableGrahaColor[candidate.digit];
  const root = getDigitRegister(founderMulanka);
  const destiny = getDigitRegister(founderBhagyanka);
  const rootColor = relationColor(candidate.founderRootRelation);
  const destinyColor = relationColor(candidate.founderDestinyRelation);

  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 380" className="h-auto w-full min-w-[520px]" role="img" aria-label="Founder and business-name register fit">
        <rect x="20" y="20" width="720" height="340" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="58" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          BUSINESS NAME IS ONE BRAND-CONTEXT INPUT
        </text>

        <rect x="70" y="114" width="180" height="112" rx="18" fill={wash(readableGrahaColor[founderMulanka], "10")} stroke={rootColor} strokeWidth="2.5" />
        <text x="160" y="145" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Founder root</text>
        <text x="160" y="182" textAnchor="middle" fill={readableGrahaColor[founderMulanka]} fontSize="32" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>{founderMulanka} {root.graha}</text>
        <text x="160" y="207" textAnchor="middle" fill={rootColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{relationLabel(candidate.founderRootRelation)} with brand</text>

        <rect x="510" y="114" width="180" height="112" rx="18" fill={wash(readableGrahaColor[founderBhagyanka], "10")} stroke={destinyColor} strokeWidth="2.5" />
        <text x="600" y="145" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Founder destiny</text>
        <text x="600" y="182" textAnchor="middle" fill={readableGrahaColor[founderBhagyanka]} fontSize="32" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>{founderBhagyanka} {destiny.graha}</text>
        <text x="600" y="207" textAnchor="middle" fill={destinyColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{relationLabel(candidate.founderDestinyRelation)} with brand</text>

        <path d="M258 170 H306" stroke={rootColor} strokeWidth="4" strokeLinecap="round" />
        <path d="M454 170 H502" stroke={destinyColor} strokeWidth="4" strokeLinecap="round" />
        <circle cx="380" cy="170" r="82" fill={SURFACE} stroke={brandColor} strokeWidth="4" />
        <text x="380" y="150" textAnchor="middle" fill={brandColor} fontSize="19" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Brand register</text>
        <text x="380" y="188" textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>{candidate.digit} {candidate.graha}</text>
        <text x="380" y="216" textAnchor="middle" fill={fitColor(candidate.industryFit)} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{candidate.industryFit.replace("-", " ")}</text>

        <rect x="90" y="288" width="580" height="38" rx="19" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="313" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Brand strategy, market fit, legal availability, and execution remain primary.
        </text>
      </svg>
    </section>
  );
}

export function BusinessNameNumerologyCalculator() {
  const [system, setSystem] = useState<NumerologySystem>("vedic-hybrid");
  const [convention, setConvention] = useState<Convention>("flexible");
  const [industryId, setIndustryId] = useState("commerce");
  const [launchContext, setLaunchContext] = useState<LaunchContext>("prelaunch");
  const [founderMulanka, setFounderMulanka] = useState(1);
  const [founderBhagyanka, setFounderBhagyanka] = useState(5);
  const [candidates, setCandidates] = useState<BusinessCandidateInput[]>(DEFAULT_CANDIDATES);
  const [selectedName, setSelectedName] = useState(DEFAULT_CANDIDATES[0].name);

  const industry = getIndustry(industryId);
  const contextFrame = launchContextFrame(launchContext);
  const results = useMemo(
    () =>
      candidates
        .map((candidate) => computeCandidate(candidate, system, convention, founderMulanka, founderBhagyanka, industry))
        .filter((item): item is BusinessCandidateResult => item !== null),
    [candidates, convention, founderBhagyanka, founderMulanka, industry, system]
  );
  const selected = results.find((item) => item.name === selectedName) ?? results[0];

  const reset = () => {
    setSystem("vedic-hybrid");
    setConvention("flexible");
    setIndustryId("commerce");
    setLaunchContext("prelaunch");
    setFounderMulanka(1);
    setFounderBhagyanka(5);
    setCandidates(DEFAULT_CANDIDATES);
    setSelectedName(DEFAULT_CANDIDATES[0].name);
  };

  const updateCandidate = (index: number, patch: Partial<BusinessCandidateInput>) => {
    setCandidates((current) => current.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="business-name-numerology-calculator"
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
            Business-name numerology
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Compare brand register, founder fit, and industry convention
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compute candidate business names, check founder compatibility, and keep the recommendation inside brand-strategy discipline.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset SaaS case
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Building2 size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Computation frame</p>
          </div>
          <div className="grid min-w-0 gap-3">
            <label className="min-w-0">
              <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>System</span>
              <select value={system} onChange={(event) => setSystem(event.target.value as NumerologySystem)} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {SYSTEMS.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
              </select>
            </label>
            <label className="min-w-0">
              <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>Convention</span>
              <select value={convention} onChange={(event) => setConvention(event.target.value as Convention)} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                <option value="flexible">Flexible reduce</option>
                <option value="strict">Strict preserve</option>
              </select>
            </label>
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Store size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Founder numbers</p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            {[
              ["Mulanka", founderMulanka, setFounderMulanka],
              ["Bhagyanka", founderBhagyanka, setFounderBhagyanka],
            ].map(([label, value, setter]) => {
              const digit = value as number;
              const fn = setter as (value: number) => void;
              return (
                <label key={label as string} className="min-w-0">
                  <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>{label as string}</span>
                  <select value={digit} onChange={(event) => fn(Number(event.target.value))} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: wash(readableGrahaColor[digit], "10"), border: `1px solid ${readableGrahaColor[digit]}`, color: INK_PRIMARY }}>
                    {DIGIT_REGISTERS.map((item) => <option key={item.digit} value={item.digit}>{item.digit} - {item.graha}</option>)}
                  </select>
                </label>
              );
            })}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <BriefcaseBusiness size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Business context</p>
          </div>
          <label className="min-w-0">
            <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>Industry</span>
            <select value={industryId} onChange={(event) => setIndustryId(event.target.value)} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {INDUSTRY_PREFERENCES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["prelaunch", "postlaunch"] as LaunchContext[]).map((item) => (
              <button key={item} type="button" onClick={() => setLaunchContext(item)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: launchContext === item ? wash(BLUE, "12") : SURFACE_2, border: `1px solid ${launchContext === item ? BLUE : HAIRLINE}`, color: launchContext === item ? BLUE : INK_PRIMARY }}>
                {item === "prelaunch" ? "Pre-launch" : "Post-launch"}
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-3">
        {candidates.map((candidate, index) => (
          <article key={index} className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <label className="min-w-0">
              <span className="text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Candidate {index + 1}</span>
              <input value={candidate.name} onChange={(event) => updateCandidate(index, { name: event.target.value })} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }} />
            </label>
            <label className="mt-3 block min-w-0">
              <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>Name form</span>
              <input value={candidate.nameForm} onChange={(event) => updateCandidate(index, { nameForm: event.target.value })} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }} />
            </label>
          </article>
        ))}
      </section>

      {selected && (
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <div className="grid min-w-0 gap-4">
            <BrandFitSvg candidate={selected} founderMulanka={founderMulanka} founderBhagyanka={founderBhagyanka} />

            <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <Table2 size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Candidate comparison</p>
              </div>
              <div className="grid min-w-0 gap-2">
                {results.map((item) => {
                  const selectedRow = selected.name === item.name;
                  const color = fitColor(item.industryFit);
                  return (
                    <button key={item.name} type="button" onClick={() => setSelectedName(item.name)} className="grid min-w-0 gap-3 rounded-xl p-3 text-left md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_auto]" style={{ background: selectedRow ? wash(color, "12") : SURFACE_2, border: `1px solid ${selectedRow ? color : HAIRLINE}` }}>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.name}</span>
                        <span className="block text-xs font-semibold" style={{ color: INK_SECONDARY }}>{item.nameForm}</span>
                      </span>
                      <span className="min-w-0 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                        sum {item.total} {"->"} {item.digit} {item.graha}
                      </span>
                      <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: wash(color, "18"), border: `1px solid ${color}`, color }}>
                        score {item.score}/6
                      </span>
                    </button>
                  );
                })}
              </div>
            </article>
          </div>

          <aside className="grid min-w-0 content-start gap-4">
            <article className="min-w-0 rounded-xl p-4" style={{ background: wash(readableGrahaColor[selected.digit], "12"), border: `1px solid ${readableGrahaColor[selected.digit]}` }}>
              <div className="mb-2 flex items-center gap-2">
                <BadgeCheck size={17} color={readableGrahaColor[selected.digit]} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: readableGrahaColor[selected.digit], letterSpacing: "0.08em" }}>Selected name</p>
              </div>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.name}</IAST>
              </h3>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selected.digit} {selected.graha} register</p>
              <Devanagari className="mt-2 block text-3xl font-bold" style={{ color: readableGrahaColor[selected.digit] }}>{selected.devanagari}</Devanagari>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{selected.note}</p>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-2 flex items-center gap-2">
                <GitCompare size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Industry convention</p>
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{industry.label}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{industry.rationale}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {industry.preferredDigits.map((digit) => (
                  <span key={digit} className="rounded-full px-3 py-1 text-xs font-black" style={{ background: wash(readableGrahaColor[digit], "12"), border: `1px solid ${readableGrahaColor[digit]}`, color: readableGrahaColor[digit] }}>
                    {digit} {getDigitRegister(digit).graha}
                  </span>
                ))}
              </div>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: launchContext === "prelaunch" ? wash(GREEN, "10") : wash(VERMILION, "0F"), border: `1px solid ${launchContext === "prelaunch" ? GREEN : VERMILION}` }}>
              <div className="mb-2 flex items-center gap-2">
                <ShieldAlert size={17} color={launchContext === "prelaunch" ? GREEN : VERMILION} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: launchContext === "prelaunch" ? GREEN : VERMILION, letterSpacing: "0.08em" }}>{contextFrame.label}</p>
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{contextFrame.tone}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{contextFrame.text}</p>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Over-claim guard</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Refuse guarantee language: no name number guarantees sales, market share, investor interest, or business survival.
              </p>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Register key</p>
              <div className="mt-3 grid min-w-0 grid-cols-3 gap-2">
                {DIGIT_REGISTERS.map((item) => (
                  <div key={item.digit} className="min-w-0 rounded-lg p-2 text-center" style={{ background: wash(grahas[item.slug].primary, "10"), border: `1px solid ${HAIRLINE}` }}>
                    <p className="m-0 text-base font-black" style={{ color: readableGrahaColor[item.digit] }}>{item.digit}</p>
                    <p className="m-0 text-xs font-bold" style={{ color: INK_PRIMARY }}>{item.graha}</p>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      )}
    </div>
  );
}
