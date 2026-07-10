"use client";

import { useState } from "react";
import { CalendarDays, Calculator, GitCompare, Hash, RotateCcw, ShieldAlert, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { CHALDEAN_VALUE, EXAMPLES, LETTER_VALUES, NUMBER_MODES, PYTHAGOREAN_VALUE, VOWELS, cleanName, dateDigitSum, getRegister, reduceDigits, type NumberMode } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function modeLetters(cleaned: string, mode: NumberMode["id"]) {
  if (mode === "soulUrge") return cleaned.split("").filter((letter) => VOWELS.has(letter));
  if (mode === "personality") return cleaned.split("").filter((letter) => !VOWELS.has(letter));
  return cleaned.split("");
}

function SequentialTableSvg({ activeValue, activeLetters }: { activeValue: number; activeLetters: string[] }) {
  const activeSet = new Set(activeLetters);
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 520" className="h-auto w-full min-w-0" role="img" aria-label="Pythagorean sequential letter table">
        <rect x="20" y="20" width="720" height="480" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="58" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          PYTHAGOREAN LETTER MAP: A=1 THROUGH I=9, THEN WRAP
        </text>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => {
          const letters = LETTER_VALUES.filter((item) => item.pythagorean === value).map((item) => item.letter);
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 142 + col * 238;
          const y = 128 + row * 112;
          const active = activeValue === value || letters.some((letter) => activeSet.has(letter));
          const color = value === 9 ? VERMILION : value % 2 === 0 ? BLUE : GREEN;
          return (
            <g key={value}>
              <rect x={x - 88} y={y - 44} width="176" height="92" rx="14" fill={active ? wash(color, "16") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
              <text x={x - 66} y={y - 7} fill={color} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {value}
              </text>
              <text x={x - 4} y={y - 16} fill={INK_PRIMARY} fontSize="15" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {letters.join(" ")}
              </text>
              <text x={x - 4} y={y + 12} fill={INK_SECONDARY} fontSize="13" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                pos mod 9
              </text>
            </g>
          );
        })}

        <rect x="160" y="434" width="440" height="42" rx="21" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="461" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Formula: ((alphabet position - 1) mod 9) + 1
        </text>
      </svg>
    </section>
  );
}

export function PythagoreanLetterTableExplorer() {
  const [name, setName] = useState("Aniket");
  const [birthDate, setBirthDate] = useState("1985-07-22");
  const [modeId, setModeId] = useState<NumberMode["id"]>("expression");
  const [activeValue, setActiveValue] = useState(6);
  const [preserveMaster, setPreserveMaster] = useState(false);
  const cleaned = cleanName(name);
  const mode = NUMBER_MODES.find((item) => item.id === modeId) ?? NUMBER_MODES[0];
  const selectedLetters = modeId === "lifePath" ? [] : modeLetters(cleaned, modeId);
  const pythagoreanTotal = modeId === "lifePath" ? dateDigitSum(birthDate) : selectedLetters.reduce((sum, letter) => sum + (PYTHAGOREAN_VALUE[letter] ?? 0), 0);
  const chaldeanTotal = cleaned.split("").reduce((sum, letter) => sum + (CHALDEAN_VALUE[letter] ?? 0), 0);
  const pythagoreanChain = pythagoreanTotal > 0 ? reduceDigits(pythagoreanTotal, preserveMaster) : [0];
  const chaldeanChain = chaldeanTotal > 0 ? reduceDigits(chaldeanTotal) : [0];
  const finalValue = pythagoreanChain.at(-1) ?? 0;
  const register = getRegister(finalValue);
  const activeLetters = selectedLetters.length ? selectedLetters : cleaned.split("");

  const loadExample = (exampleName: string, exampleDate: string) => {
    setName(exampleName);
    setBirthDate(exampleDate);
    const first = cleanName(exampleName)[0];
    setActiveValue(first ? PYTHAGOREAN_VALUE[first] ?? 1 : 1);
  };

  const reset = () => {
    setName("Aniket");
    setBirthDate("1985-07-22");
    setModeId("expression");
    setActiveValue(6);
    setPreserveMaster(false);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="pythagorean-letter-table-explorer"
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
            Pythagorean letter-table explorer
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            See the sequential 1-9 system beside Chaldean contrast
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Enter a name or birth date, choose a Pythagorean number mode, and watch the alphabet wrap by simple mod-9 arithmetic.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Aniket
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Calculator size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Input</p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full min-w-0 rounded-lg px-3 py-3 text-lg font-semibold outline-none"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif" }}
              aria-label="Name to calculate in Pythagorean numerology"
            />
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="w-full min-w-0 rounded-lg px-3 py-3 text-lg font-semibold outline-none"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif" }}
              aria-label="Birth date for Life Path calculation"
            />
          </div>
          <div className="mt-3 flex min-w-0 flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button key={example.id} type="button" onClick={() => loadExample(example.name, example.birthDate)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: cleanName(name) === cleanName(example.name) ? wash(GOLD, "18") : SURFACE_2, border: `1px solid ${HAIRLINE}`, color: cleanName(name) === cleanName(example.name) ? GOLD : INK_SECONDARY }}>
                {example.label}
              </button>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "10"), border: `1px solid ${GREEN}` }}>
          <div className="mb-2 flex items-center gap-2">
            <Hash size={17} color={GREEN} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Current Pythagorean result</p>
          </div>
          <p className="m-0 text-4xl font-semibold" style={{ color: GREEN, fontFamily: "var(--font-cormorant), serif" }}>{pythagoreanTotal}</p>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{pythagoreanChain.join(" -> ")} · {mode.label} {finalValue || "-"}</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{register.label}: {register.register}</p>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-2 md:grid-cols-4">
        {NUMBER_MODES.map((item) => {
          const selected = item.id === modeId;
          return (
            <button key={item.id} type="button" onClick={() => setModeId(item.id)} className="min-w-0 rounded-xl p-3 text-left" style={{ background: selected ? wash(BLUE, "12") : SURFACE, border: `1px solid ${selected ? BLUE : HAIRLINE}` }}>
              <p className="m-0 text-sm font-bold" style={{ color: selected ? BLUE : INK_PRIMARY }}>{item.label}</p>
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{item.source}</p>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <SequentialTableSvg activeValue={activeValue} activeLetters={activeLetters} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Selected ledger</p>
            </div>
            {modeId === "lifePath" ? (
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Life Path uses birth-date digits: {birthDate.replace(/\D/g, "").split("").join(" + ")} = {pythagoreanTotal}</p>
            ) : (
              <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {selectedLetters.map((letter, index) => {
                  const value = PYTHAGOREAN_VALUE[letter] ?? 0;
                  return (
                    <button key={`${letter}-${index}`} type="button" onClick={() => setActiveValue(value)} className="min-w-0 rounded-lg p-3 text-center" style={{ background: activeValue === value ? wash(GREEN, "18") : SURFACE_2, border: `1px solid ${activeValue === value ? GREEN : HAIRLINE}` }}>
                      <p className="m-0 text-xl font-black" style={{ color: GREEN }}>{letter}</p>
                      <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{value}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "10"), border: `1px solid ${BLUE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays size={17} color={BLUE} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Selected mode</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{mode.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{mode.source}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{mode.rule}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Chaldean contrast</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{cleaned || "Name"}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Pythagorean: {pythagoreanChain.join(" -> ")}</p>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Chaldean: {chaldeanChain.join(" -> ")}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Different results are expected: sequence-based 1-9 versus vibration-based 1-8 with reserved 9.</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Over-claim guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{register.caution}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Life Path, Expression, Soul Urge, and Personality numbers are symbolic context, not life verdicts.</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Sequential</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>The whole table follows alphabet position modulo 9.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>All digits assigned</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Unlike Chaldean, Pythagorean gives letters to 9.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Master convention</p>
            <button type="button" onClick={() => setPreserveMaster((value) => !value)} className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: preserveMaster ? wash(GOLD, "18") : SURFACE_2, border: `1px solid ${HAIRLINE}`, color: GOLD }}>
              {preserveMaster ? "Preserve" : "Reduce"}
            </button>
          </div>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Use one convention consistently for 11, 22, and 33.</p>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>System-selection phrase</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              Pythagorean is clean, sequential, Western-familiar, and single-digit focused; Chaldean is irregular, Indian-commercial, graha-linked, and compound-depth focused.
            </p>
          </div>
          <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: GOLD }}>अङ्क</Devanagari>
        </div>
      </section>
    </div>
  );
}
