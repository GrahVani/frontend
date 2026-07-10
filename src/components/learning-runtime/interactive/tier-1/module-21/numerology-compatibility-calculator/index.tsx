"use client";

import { useMemo, useState } from "react";
import { GitCompare, HeartHandshake, ListChecks, RotateCcw, ShieldAlert, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  COMPATIBILITY_PAIRS,
  DEFAULT_A,
  DEFAULT_B,
  DIGIT_REGISTERS,
  classifyRelation,
  getDigitRegister,
  getVectorValue,
  relationLabel,
  summarizeProfile,
  vectorLabel,
  type PersonProfile,
  type Relation,
  type VectorKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
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

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function relationColor(relation: Relation) {
  if (relation === "mitra") return GREEN;
  if (relation === "shatru") return VERMILION;
  return NEUTRAL;
}

function updateVector(profile: PersonProfile, key: VectorKey, value: number): PersonProfile {
  return { ...profile, [key]: value };
}

function CompatibilityBridge({
  a,
  b,
  selectedPair,
}: {
  a: PersonProfile;
  b: PersonProfile;
  selectedPair: (typeof COMPATIBILITY_PAIRS)[number];
}) {
  const aDigit = getVectorValue(a, selectedPair.aVector);
  const bDigit = getVectorValue(b, selectedPair.bVector);
  const aRegister = getDigitRegister(aDigit);
  const bRegister = getDigitRegister(bDigit);
  const relation = classifyRelation(aDigit, bDigit);
  const color = relationColor(relation);

  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 360" className="h-auto w-full min-w-[520px]" role="img" aria-label="Two-person numerology compatibility bridge">
        <rect x="20" y="20" width="720" height="320" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="58" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          CROSS-COMPARE ONE VECTOR AT A TIME
        </text>

        <rect x="76" y="115" width="190" height="130" rx="18" fill={wash(readableGrahaColor[aDigit], "12")} stroke={readableGrahaColor[aDigit]} strokeWidth="2.5" />
        <text x="171" y="150" textAnchor="middle" fill={readableGrahaColor[aDigit]} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {a.name}
        </text>
        <text x="171" y="188" textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {aDigit} {aRegister.graha}
        </text>
        <text x="171" y="216" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {vectorLabel(selectedPair.aVector)}
        </text>

        <rect x="494" y="115" width="190" height="130" rx="18" fill={wash(readableGrahaColor[bDigit], "12")} stroke={readableGrahaColor[bDigit]} strokeWidth="2.5" />
        <text x="589" y="150" textAnchor="middle" fill={readableGrahaColor[bDigit]} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {b.name}
        </text>
        <text x="589" y="188" textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          {bDigit} {bRegister.graha}
        </text>
        <text x="589" y="216" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {vectorLabel(selectedPair.bVector)}
        </text>

        <path d="M276 180 H484" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={relation === "sama" ? "10 9" : "0"} />
        <circle cx="380" cy="180" r="70" fill={SURFACE} stroke={color} strokeWidth="4" />
        <text x="380" y="165" textAnchor="middle" fill={color} fontSize="20" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {relationLabel(relation)}
        </text>
        <text x="380" y="197" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {selectedPair.primary ? "primary vector" : "secondary vector"}
        </text>

        <rect x="100" y="278" width="560" height="34" rx="17" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="301" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          A compatibility profile is chart-context information, not a relationship verdict.
        </text>
      </svg>
    </section>
  );
}

function PersonEditor({
  profile,
  onChange,
}: {
  profile: PersonProfile;
  onChange: (next: PersonProfile) => void;
}) {
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3">
        <label className="text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
          Person label
        </label>
        <input
          value={profile.name}
          onChange={(event) => onChange({ ...profile, name: event.target.value })}
          className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}
        />
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-3">
        {(["mulanka", "bhagyanka", "namanka"] as VectorKey[]).map((key) => {
          const digit = getVectorValue(profile, key);
          const register = getDigitRegister(digit);
          return (
            <label key={key} className="min-w-0">
              <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                {vectorLabel(key)}
              </span>
              <select
                value={digit}
                onChange={(event) => onChange(updateVector(profile, key, Number(event.target.value)))}
                className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold"
                style={{ background: wash(readableGrahaColor[digit], "10"), border: `1px solid ${readableGrahaColor[digit]}`, color: INK_PRIMARY }}
              >
                {DIGIT_REGISTERS.map((item) => (
                  <option key={item.digit} value={item.digit}>
                    {item.digit} - {item.graha}
                  </option>
                ))}
              </select>
              <span className="mt-1 block text-xs font-semibold" style={{ color: readableGrahaColor[digit] }}>
                {register.role}
              </span>
            </label>
          );
        })}
      </div>
    </article>
  );
}

export function NumerologyCompatibilityCalculator() {
  const [personA, setPersonA] = useState<PersonProfile>(DEFAULT_A);
  const [personB, setPersonB] = useState<PersonProfile>(DEFAULT_B);
  const [activePairId, setActivePairId] = useState("root-root");
  const [showAllVectors, setShowAllVectors] = useState(true);

  const rows = useMemo(
    () =>
      COMPATIBILITY_PAIRS.map((pair) => {
        const aDigit = getVectorValue(personA, pair.aVector);
        const bDigit = getVectorValue(personB, pair.bVector);
        return {
          ...pair,
          aDigit,
          bDigit,
          aRegister: getDigitRegister(aDigit),
          bRegister: getDigitRegister(bDigit),
          relation: classifyRelation(aDigit, bDigit),
        };
      }),
    [personA, personB]
  );

  const visibleRows = showAllVectors ? rows : rows.filter((row) => row.primary);
  const activePair = COMPATIBILITY_PAIRS.find((pair) => pair.id === activePairId) ?? COMPATIBILITY_PAIRS[0];
  const activeRow = rows.find((row) => row.id === activePair.id) ?? rows[0];
  const summary = summarizeProfile(rows.map((row) => row.relation));
  const activeColor = relationColor(activeRow.relation);

  const reset = () => {
    setPersonA(DEFAULT_A);
    setPersonB(DEFAULT_B);
    setActivePairId("root-root");
    setShowAllVectors(true);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="numerology-compatibility-calculator"
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
            Two-person numerology compatibility
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Compare Mulanka, Bhagyanka, and Name-number as chart-context
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select each person&apos;s three numbers, inspect MITRA / SHATRU / SAMA vectors, then practise refusing relationship-outcome over-claims.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset hook case
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-4 lg:grid-cols-2">
        <PersonEditor profile={personA} onChange={setPersonA} />
        <PersonEditor profile={personB} onChange={setPersonB} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <CompatibilityBridge a={personA} b={personB} selectedPair={activePair} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Table2 size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cross-vector matrix</p>
              </div>
              <button type="button" onClick={() => setShowAllVectors((value) => !value)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                <GitCompare size={15} />
                {showAllVectors ? "Show primary only" : "Show all nine"}
              </button>
            </div>
            <div className="grid min-w-0 gap-2">
              {visibleRows.map((row) => {
                const selected = row.id === activePairId;
                const color = relationColor(row.relation);
                return (
                  <button key={row.id} type="button" onClick={() => setActivePairId(row.id)} className="grid min-w-0 gap-3 rounded-xl p-3 text-left sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto]" style={{ background: selected ? wash(color, "12") : SURFACE_2, border: `1px solid ${selected ? color : HAIRLINE}` }}>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold" style={{ color: INK_PRIMARY }}>{row.label}</span>
                      <span className="block text-xs font-semibold" style={{ color: INK_SECONDARY }}>
                        {vectorLabel(row.aVector)} to {vectorLabel(row.bVector)}
                      </span>
                    </span>
                    <span className="min-w-0 text-sm font-semibold" style={{ color: INK_SECONDARY }}>
                      {row.aDigit} {row.aRegister.graha} {"->"} {row.bDigit} {row.bRegister.graha}
                    </span>
                    <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: wash(color, "18"), border: `1px solid ${color}`, color }}>
                      {relationLabel(row.relation)}
                    </span>
                  </button>
                );
              })}
            </div>
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeColor, "12"), border: `1px solid ${activeColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <HeartHandshake size={17} color={activeColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: activeColor, letterSpacing: "0.08em" }}>Selected vector</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {relationLabel(activeRow.relation)}: {activeRow.aRegister.graha} to {activeRow.bRegister.graha}
            </h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              {activeRow.aRegister.cue} meets {activeRow.bRegister.cue}. Read the actual relationship through conduct, repair, values, and history.
            </p>
            <Devanagari className="mt-3 block text-3xl font-bold" style={{ color: activeColor }}>
              {activeRow.aRegister.devanagari} - {activeRow.bRegister.devanagari}
            </Devanagari>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ListChecks size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Integrated profile</p>
            </div>
            <p className="m-0 text-3xl font-semibold" style={{ color: GOLD, fontFamily: "var(--font-cormorant), serif" }}>{summary.score}/18</p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{summary.band}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{summary.framing}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <span className="rounded-lg p-2" style={{ background: wash(GREEN, "10"), color: GREEN }}>Mitra {summary.counts.mitra}</span>
              <span className="rounded-lg p-2" style={{ background: wash(NEUTRAL, "10"), color: NEUTRAL }}>Sama {summary.counts.sama}</span>
              <span className="rounded-lg p-2" style={{ background: wash(VERMILION, "10"), color: VERMILION }}>Shatru {summary.counts.shatru}</span>
            </div>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Refusal discipline</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Never prescribe marriage, separation, or commitment from compatibility alone.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              Compatibility is a register-fit conversation input. Major relationship decisions need convergent independent grounds.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Graha register key</p>
            <div className="mt-3 grid min-w-0 grid-cols-3 gap-2">
              {DIGIT_REGISTERS.map((item) => (
                <div key={item.digit} className="min-w-0 rounded-lg p-2 text-center" style={{ background: wash(grahas[item.slug].primary, "10"), border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-base font-black" style={{ color: readableGrahaColor[item.digit] }}>{item.digit}</p>
                  <p className="m-0 text-xs font-bold" style={{ color: INK_PRIMARY }}><IAST>{item.graha}</IAST></p>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
