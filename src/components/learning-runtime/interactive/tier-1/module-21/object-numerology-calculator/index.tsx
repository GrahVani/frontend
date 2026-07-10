"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Car, Home, Phone, RotateCcw, ShieldAlert, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import {
  OBJECT_CONTEXT,
  OBJECT_EXAMPLES,
  computeObjectResult,
  resultNote,
  stageFrame,
  type ChoiceStage,
  type ObjectType,
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

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function relationColor(relation: Relation) {
  if (relation === "mitra") return GREEN;
  if (relation === "shatru") return VERMILION;
  return NEUTRAL;
}

function typeIcon(type: ObjectType) {
  if (type === "house") return <Home size={17} />;
  if (type === "phone") return <Phone size={17} />;
  if (type === "vehicle") return <Car size={17} />;
  return <Table2 size={17} />;
}

function ObjectRegisterSvg({
  value,
  mulanka,
  bhagyanka,
}: {
  value: NonNullable<ReturnType<typeof computeObjectResult>>;
  mulanka: number;
  bhagyanka: number;
}) {
  const objectColor = readableGrahaColor[value.reduced];
  const root = getDigitRegister(mulanka);
  const destiny = getDigitRegister(bhagyanka);
  const rootColor = relationColor(value.rootRelation);
  const destinyColor = relationColor(value.destinyRelation);

  return (
    <section className="w-full min-w-0 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 360" className="h-auto w-full min-w-[520px]" role="img" aria-label="Object number register and personal compatibility">
        <rect x="20" y="20" width="720" height="320" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="58" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          SUM DIGITS, READ REGISTER, REFUSE FEAR
        </text>

        <rect x="82" y="116" width="172" height="112" rx="18" fill={wash(readableGrahaColor[mulanka], "10")} stroke={rootColor} strokeWidth="2.5" />
        <text x="168" y="148" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Mulanka</text>
        <text x="168" y="184" textAnchor="middle" fill={readableGrahaColor[mulanka]} fontSize="31" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>{mulanka} {root.graha}</text>
        <text x="168" y="207" textAnchor="middle" fill={rootColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{relationLabel(value.rootRelation)}</text>

        <rect x="506" y="116" width="172" height="112" rx="18" fill={wash(readableGrahaColor[bhagyanka], "10")} stroke={destinyColor} strokeWidth="2.5" />
        <text x="592" y="148" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Bhagyanka</text>
        <text x="592" y="184" textAnchor="middle" fill={readableGrahaColor[bhagyanka]} fontSize="31" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>{bhagyanka} {destiny.graha}</text>
        <text x="592" y="207" textAnchor="middle" fill={destinyColor} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{relationLabel(value.destinyRelation)}</text>

        <path d="M263 172 H302" stroke={rootColor} strokeWidth="4" strokeLinecap="round" />
        <path d="M458 172 H497" stroke={destinyColor} strokeWidth="4" strokeLinecap="round" />
        <circle cx="380" cy="172" r="82" fill={SURFACE} stroke={objectColor} strokeWidth="4" />
        <text x="380" y="149" textAnchor="middle" fill={objectColor} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>Object register</text>
        <text x="380" y="187" textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="800" style={{ fontFamily: "var(--font-cormorant), serif" }}>{value.reduced} {value.graha}</text>
        <text x="380" y="216" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>{value.digits} sum {value.total}</text>

        <rect x="100" y="282" width="560" height="38" rx="19" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="307" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Object-number fit is a tie-breaker, not a reason to move, panic, or prescribe.
        </text>
      </svg>
    </section>
  );
}

export function ObjectNumerologyCalculator() {
  const [objectType, setObjectType] = useState<ObjectType>("house");
  const [objectValue, setObjectValue] = useState("408");
  const [method, setMethod] = useState("Unit number");
  const [stage, setStage] = useState<ChoiceStage>("pre-acquisition");
  const [mulanka, setMulanka] = useState(6);
  const [bhagyanka, setBhagyanka] = useState(9);

  const context = OBJECT_CONTEXT[objectType];
  const frame = stageFrame(stage);
  const result = useMemo(() => computeObjectResult(objectValue, mulanka, bhagyanka), [bhagyanka, mulanka, objectValue]);
  const activeColor = result ? readableGrahaColor[result.reduced] : GOLD;

  const reset = () => {
    setObjectType("house");
    setObjectValue("408");
    setMethod("Unit number");
    setStage("pre-acquisition");
    setMulanka(6);
    setBhagyanka(9);
  };

  const loadExample = (id: string) => {
    const example = OBJECT_EXAMPLES.find((item) => item.id === id) ?? OBJECT_EXAMPLES[0];
    setObjectType(example.type);
    setObjectValue(example.value);
    setMethod(example.method);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="object-numerology-calculator"
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
            Object numerology calculator
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            House, phone, and vehicle numbers without fear claims
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Sum the object digits, compare the register with personal numbers, and keep practical choice-costs visible.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset house case
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {OBJECT_EXAMPLES.map((example) => {
          const selected = objectValue === example.value && objectType === example.type;
          return (
            <button key={example.id} type="button" onClick={() => loadExample(example.id)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(BLUE, "12") : SURFACE, border: `1px solid ${selected ? BLUE : HAIRLINE}` }}>
              <span className="mb-2 inline-flex items-center gap-2 text-sm font-bold" style={{ color: selected ? BLUE : INK_PRIMARY }}>
                {typeIcon(example.type)}
                {example.label}
              </span>
              <span className="block text-xs font-semibold" style={{ color: INK_SECONDARY }}>{example.method}</span>
            </button>
          );
        })}
      </section>

      <section className="mb-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Object input</p>
          <label className="mt-3 block min-w-0">
            <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>Object type</span>
            <select value={objectType} onChange={(event) => setObjectType(event.target.value as ObjectType)} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {Object.entries(OBJECT_CONTEXT).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}
            </select>
          </label>
          <label className="mt-3 block min-w-0">
            <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>Number string</span>
            <input value={objectValue} onChange={(event) => setObjectValue(event.target.value)} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }} />
          </label>
          <label className="mt-3 block min-w-0">
            <span className="text-xs font-bold uppercase" style={{ color: INK_SECONDARY }}>Named method</span>
            <input value={method} onChange={(event) => setMethod(event.target.value)} className="mt-2 w-full rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }} />
          </label>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Personal cross-check</p>
          <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-2">
            {[
              ["Mulanka", mulanka, setMulanka],
              ["Bhagyanka", bhagyanka, setBhagyanka],
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
          {result && (
            <p className="mb-0 mt-4 rounded-lg p-3 text-sm font-semibold" style={{ background: wash(activeColor, "10"), border: `1px solid ${activeColor}`, color: INK_PRIMARY }}>
              {resultNote(result)}
            </p>
          )}
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Choice stage</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["pre-acquisition", "already-owned"] as ChoiceStage[]).map((item) => (
              <button key={item} type="button" onClick={() => setStage(item)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: stage === item ? wash(stage === "pre-acquisition" ? GREEN : VERMILION, "12") : SURFACE_2, border: `1px solid ${stage === item ? (stage === "pre-acquisition" ? GREEN : VERMILION) : HAIRLINE}`, color: stage === item ? (stage === "pre-acquisition" ? GREEN : VERMILION) : INK_PRIMARY }}>
                {item === "pre-acquisition" ? "Pre-choice" : "Owned"}
              </button>
            ))}
          </div>
          <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{context.scope}</p>
        </article>
      </section>

      {result && (
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <div className="grid min-w-0 gap-4">
            <ObjectRegisterSvg value={result} mulanka={mulanka} bhagyanka={bhagyanka} />

            <article className="grid min-w-0 gap-3 md:grid-cols-3">
              <section className="min-w-0 rounded-xl p-4" style={{ background: wash(activeColor, "10"), border: `1px solid ${activeColor}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: activeColor, letterSpacing: "0.08em" }}>Digit path</p>
                <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{result.digits.split("").join(" + ")} = {result.total} {"->"} {result.reduced}</p>
              </section>
              <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Method</p>
                <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{method}</p>
              </section>
              <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Fit score</p>
                <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{result.score}/4 personal register-fit</p>
              </section>
            </article>
          </div>

          <aside className="grid min-w-0 content-start gap-4">
            <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeColor, "12"), border: `1px solid ${activeColor}` }}>
              <div className="mb-2 flex items-center gap-2">
                <BadgeCheck size={17} color={activeColor} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: activeColor, letterSpacing: "0.08em" }}>Object register</p>
              </div>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{result.reduced} {result.graha}</IAST>
              </h3>
              <Devanagari className="mt-2 block text-3xl font-bold" style={{ color: activeColor }}>{result.devanagari}</Devanagari>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{resultNote(result)}</p>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: stage === "pre-acquisition" ? wash(GREEN, "10") : wash(VERMILION, "0F"), border: `1px solid ${stage === "pre-acquisition" ? GREEN : VERMILION}` }}>
              <div className="mb-2 flex items-center gap-2">
                <ShieldAlert size={17} color={stage === "pre-acquisition" ? GREEN : VERMILION} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: stage === "pre-acquisition" ? GREEN : VERMILION, letterSpacing: "0.08em" }}>{frame.label}</p>
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{frame.title}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{frame.text}</p>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>4 / 8 fear refusal</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                Rahu-4 and Shani-8 are multivalent registers, not curse labels. Do not reject a home, phone, or vehicle on shadow-graha fear alone.
              </p>
            </article>

            <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{context.label}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{context.cost}</p>
              <p className="mb-0 mt-2 text-sm font-bold" style={{ color: VERMILION }}>{context.caution}</p>
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
