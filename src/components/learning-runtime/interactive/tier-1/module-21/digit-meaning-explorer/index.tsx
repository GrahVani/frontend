"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { BadgeCheck, GitCompare, RotateCcw, ShieldAlert, Sparkles, SunMedium, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { DIGIT_MEANINGS, READING_MODES, digitColor, getDigitMeaning, type DigitId, type ReadingMode } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function TriadSvg({ activeDigit, digits, title }: { activeDigit: DigitId; digits: DigitId[]; title: string }) {
  const points = digits.map((digit, index) => ({
    digit,
    x: 180 + index * 200,
    y: 158,
  }));

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 360" className="h-auto w-full min-w-0" role="img" aria-label="Numbers one two three graha triad">
        <rect x="20" y="20" width="720" height="320" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="62" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {title}
        </text>
        <path d="M260 158 H300" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M460 158 H500" stroke={GOLD} strokeWidth="3" strokeLinecap="round" />
        <path d="M180 238 C270 298 490 298 580 238" fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="8 8" />

        {points.map((point) => {
          const item = getDigitMeaning(point.digit);
          const color = digitColor(point.digit);
          const active = point.digit === activeDigit;
          return (
            <g key={point.digit}>
              <circle cx={point.x} cy={point.y} r={active ? 78 : 68} fill={active ? wash(color, "18") : SURFACE} stroke={color} strokeWidth={active ? 4 : 2} />
              <text x={point.x} y={point.y - 18} textAnchor="middle" fill={color} fontSize="44" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {point.digit}
              </text>
              <text x={point.x} y={point.y + 12} textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {item.graha}
              </text>
              <text x={point.x} y={point.y + 40} textAnchor="middle" fill={color} fontSize="19" fontWeight="900" style={{ fontFamily: "var(--font-devanagari), var(--font-sans), sans-serif" }}>
                {item.devanagari}
              </text>
            </g>
          );
        })}

        <rect x="150" y="286" width="460" height="50" rx="25" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="312" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <tspan x="380" dy="0">Read every digit as a register: strength plus shadow,</tspan>
          <tspan x="380" dy="18">never a single-factor verdict.</tspan>
        </text>
      </svg>
    </section>
  );
}

export function DigitMeaningExplorer() {
  const pathname = usePathname();
  const isMiddleTriad = pathname.includes("lesson-2") || pathname.includes("lesson-02");
  const isFinalTriad = pathname.includes("lesson-3") || pathname.includes("lesson-03");
  const visibleDigits = useMemo<DigitId[]>(() => {
    if (isFinalTriad) return [7, 8, 9];
    if (isMiddleTriad) return [4, 5, 6];
    return [1, 2, 3];
  }, [isFinalTriad, isMiddleTriad]);
  const triadTitle = isFinalTriad
    ? "KETU - SHANI - MANGALA: RELEASE, TIME, AND ACTION"
    : isMiddleTriad
      ? "RAHU - BUDHA - SHUKRA: SHADOW, SPEECH, AND HARMONY"
      : "SURYA - CANDRA - GURU: THE FIRST THREE DIGIT REGISTERS";
  const [activeDigit, setActiveDigit] = useState<DigitId>(visibleDigits[0]);
  const [mode, setMode] = useState<ReadingMode>("balanced");
  const active = getDigitMeaning(activeDigit);
  const activeColor = digitColor(activeDigit);
  const activeMode = READING_MODES.find((item) => item.id === mode) ?? READING_MODES[0];

  const reset = () => {
    setActiveDigit(visibleDigits[0]);
    setMode("balanced");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="digit-meaning-explorer"
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
            Digit meaning explorer
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            {isFinalTriad ? "Numbers 7, 8, 9 as graha registers" : isMiddleTriad ? "Numbers 4, 5, 6 as graha registers" : "Numbers 1, 2, 3 as graha registers"}
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select a digit, compare strengths and shadows, and practice replacing over-prescription with an honest reading frame.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset {getDigitMeaning(visibleDigits[0]).graha}
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {DIGIT_MEANINGS.filter((digit) => visibleDigits.includes(digit.digit)).map((digit) => {
          const color = digitColor(digit.digit);
          const selected = activeDigit === digit.digit;
          return (
            <button key={digit.digit} type="button" onClick={() => setActiveDigit(digit.digit)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(color, "14") : SURFACE, border: `1px solid ${selected ? color : HAIRLINE}` }}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Digit {digit.digit}</p>
                  <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                    <IAST>{digit.graha}</IAST>
                  </h3>
                </div>
                <Devanagari className="shrink-0 text-2xl font-bold" style={{ color }}>{digit.devanagari}</Devanagari>
              </div>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{digit.title}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <TriadSvg activeDigit={activeDigit} digits={visibleDigits} title={triadTitle} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <SunMedium size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Reading mode</p>
            </div>
            <div className="grid min-w-0 gap-2 md:grid-cols-4">
              {READING_MODES.map((item) => {
                const selected = mode === item.id;
                return (
                  <button key={item.id} type="button" onClick={() => setMode(item.id)} className="min-w-0 rounded-lg p-3 text-left" style={{ background: selected ? wash(item.color, "14") : SURFACE_2, border: `1px solid ${selected ? item.color : HAIRLINE}` }}>
                    <p className="m-0 text-sm font-bold" style={{ color: selected ? item.color : INK_PRIMARY }}>{item.label}</p>
                    <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{item.note}</p>
                  </button>
                );
              })}
            </div>
          </article>

          <article className="grid min-w-0 gap-4 lg:grid-cols-2">
            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles size={17} color={GREEN} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Strengths</p>
              </div>
              <div className="grid min-w-0 gap-2">
                {active.strengths.map((strength) => (
                  <p key={strength} className="m-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>{strength}</p>
                ))}
              </div>
            </section>

            <section className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert size={17} color={VERMILION} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Shadows</p>
              </div>
              <div className="grid min-w-0 gap-2">
                {active.shadows.map((shadow) => (
                  <p key={shadow} className="m-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>{shadow}</p>
                ))}
              </div>
            </section>
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeColor, "12"), border: `1px solid ${activeColor}` }}>
            <div className="mb-2 flex items-center gap-2">
              <BadgeCheck size={17} color={activeColor} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: activeColor, letterSpacing: "0.08em" }}>Selected register</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {active.digit} · <IAST>{active.graha}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{active.title}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{active.core}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeMode.color, "10"), border: `1px solid ${activeMode.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Table2 size={17} color={activeMode.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: activeMode.color, letterSpacing: "0.08em" }}>Mode output</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{activeMode.label}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              {mode === "balanced" ? active.honestFrame : mode === "strengths" ? active.strengths.join(", ") : mode === "shadows" ? active.shadows.join(", ") : active.prescription}
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Cross-system layer</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Systems compute differently; the digit register remains the foundation.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{active.crossSystem}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Over-claim guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Do not turn a digit into a life command.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Career, relationship, and life decisions are multifactorial. The number informs; it does not determine.</p>
          </article>
        </aside>
      </section>
    </div>
  );
}
