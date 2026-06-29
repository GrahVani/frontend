"use client";

import { useMemo, useState } from "react";
import { Calculator, CircleDot, Hash, RotateCcw, ShieldAlert, Sparkles, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { CHALDEAN_GROUPS, LETTER_VALUE, NAME_EXAMPLES, getCompoundMeaning, getGroupByValue, grahaColor, grahaLabel, reduceDigits } from "./data";

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

function cleanName(value: string) {
  return value.toUpperCase().replace(/[^A-Z]/g, "");
}

function LetterTableSvg({ activeValue, nameLetters }: { activeValue: number; nameLetters: string[] }) {
  const activeLetters = new Set(nameLetters);
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 520" className="h-auto w-full min-w-0" role="img" aria-label="Chaldean letter number table and reserved nine">
        <rect x="20" y="20" width="720" height="480" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="58" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          CHALDEAN LETTER MAP: IRREGULAR 1-8 TABLE, 9 RESERVED
        </text>

        {CHALDEAN_GROUPS.map((group, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 142 + col * 238;
          const y = 122 + row * 106;
          const color = grahaColor(group.value);
          const active = activeValue === group.value || group.letters.some((letter) => activeLetters.has(letter));
          return (
            <g key={group.value}>
              <rect x={x - 88} y={y - 42} width="176" height="86" rx="14" fill={active ? wash(color, "18") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
              <text x={x - 66} y={y - 8} fill={color} fontSize="32" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {group.value}
              </text>
              <text x={x - 4} y={y - 18} fill={INK_PRIMARY} fontSize="14" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {grahaLabel(group.value)}
              </text>
              <text x={x - 4} y={y + 6} fill={INK_SECONDARY} fontSize="15" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {group.letters.length ? group.letters.join(" ") : "no letters"}
              </text>
              {group.value === 9 ? (
                <text x={x - 4} y={y + 29} textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                  RESERVED
                </text>
              ) : null}
            </g>
          );
        })}

        <rect x="150" y="436" width="460" height="40" rx="20" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="461" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          A result may reduce to 9; no input letter is assigned 9.
        </text>
      </svg>
    </section>
  );
}

export function ChaldeanLetterTableExplorer() {
  const [name, setName] = useState("Aniket");
  const [activeValue, setActiveValue] = useState(1);
  const cleaned = cleanName(name);
  const letters = useMemo(
    () => cleaned.split("").map((letter) => ({ letter, value: LETTER_VALUE[letter] ?? 0 })),
    [cleaned],
  );
  const total = letters.reduce((sum, item) => sum + item.value, 0);
  const reductionChain = total > 0 ? reduceDigits(total) : [0];
  const single = reductionChain[reductionChain.length - 1] ?? 0;
  const activeGroup = getGroupByValue(activeValue);
  const singleGroup = getGroupByValue(single);
  const singleColor = grahaColor(single);
  const compound = getCompoundMeaning(total) ?? getCompoundMeaning(reductionChain.find((value) => value >= 10) ?? 0);

  const loadExample = (exampleName: string) => {
    setName(exampleName);
    const first = cleanName(exampleName)[0];
    setActiveValue(first ? LETTER_VALUE[first] ?? 1 : 1);
  };

  const reset = () => {
    setName("Aniket");
    setActiveValue(1);
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="chaldean-letter-table-explorer"
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
            Chaldean letter-table explorer
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Convert a name into compound number, single number, and graha register
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Enter a Roman spelling, inspect each letter value, and watch the 1-8 Chaldean table preserve 9 as a sacred result-only number.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Aniket
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Calculator size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Name input</p>
          </div>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full min-w-0 rounded-lg px-3 py-3 text-lg font-semibold outline-none"
            style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif" }}
            aria-label="Name to calculate in Chaldean numerology"
          />
          <div className="mt-3 flex min-w-0 flex-wrap gap-2">
            {NAME_EXAMPLES.map((example) => (
              <button key={example.id} type="button" onClick={() => loadExample(example.name)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: cleanName(name) === cleanName(example.name) ? wash(GOLD, "18") : SURFACE_2, border: `1px solid ${HAIRLINE}`, color: cleanName(name) === cleanName(example.name) ? GOLD : INK_SECONDARY }}>
                {example.label}
              </button>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(singleColor, "10"), border: `1px solid ${singleColor}` }}>
          <div className="mb-2 flex items-center gap-2">
            <Hash size={17} color={singleColor} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: singleColor, letterSpacing: "0.08em" }}>Current result</p>
          </div>
          <p className="m-0 text-4xl font-semibold" style={{ color: singleColor, fontFamily: "var(--font-cormorant), serif" }}>{total}</p>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
            {reductionChain.join(" -> ")} · single {single || "-"} · {single ? grahaLabel(single) : "No letters yet"}
          </p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{single ? singleGroup.note : "Type letters A-Z to begin."}</p>
        </article>
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <LetterTableSvg activeValue={activeValue} nameLetters={letters.map((item) => item.letter)} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Per-letter ledger</p>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {letters.length ? letters.map((item, index) => {
                const color = grahaColor(item.value);
                return (
                  <button key={`${item.letter}-${index}`} type="button" onClick={() => setActiveValue(item.value)} className="min-w-0 rounded-lg p-3 text-center" style={{ background: activeValue === item.value ? wash(color, "18") : SURFACE_2, border: `1px solid ${activeValue === item.value ? color : HAIRLINE}` }}>
                    <p className="m-0 text-xl font-black" style={{ color }}>{item.letter}</p>
                    <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.value}</p>
                  </button>
                );
              }) : (
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Only A-Z letters are counted.</p>
              )}
            </div>
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(grahaColor(activeValue), "10"), border: `1px solid ${grahaColor(activeValue)}` }}>
            <div className="mb-2 flex items-center gap-2">
              <CircleDot size={17} color={grahaColor(activeValue)} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: grahaColor(activeValue), letterSpacing: "0.08em" }}>Selected table value</p>
            </div>
            <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              {activeValue} · <IAST>{grahaLabel(activeValue)}</IAST>
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{activeGroup.letters.length ? activeGroup.letters.join(", ") : "No letters assigned"}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{activeGroup.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Compound layer</p>
            </div>
            {compound ? (
              <>
                <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{compound.value}: {compound.title}</h3>
                <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{compound.register}</p>
                <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{compound.caution}</p>
              </>
            ) : (
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>This total has no short teaching meaning in the local reference list. Still read the single digit and consult the full compound table later.</p>
            )}
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Over-claim guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>A name number is information, not a guarantee.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Use Chaldean as one symbolic factor, then cross-reference the natal graha. Do not promise business, marriage, or health outcomes from spelling alone.</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Irregular table</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Chaldean is vibration-based, not A-B-C sequential.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Graha bridge</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>The single digit maps back into the nine-graha vocabulary.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Reserved nine</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>9 may appear as a result, never as a letter-value.</p>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(grahas.mangala.primary, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color: grahas.mangala.primary, letterSpacing: "0.08em" }}>Reserved-sacred reminder</p>
            <p className="mb-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              Chaldean input uses 1-8. A final 9 is read as Mangala, but no letter should be assigned 9.
            </p>
          </div>
          <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: grahas.mangala.primary }}>अङ्क</Devanagari>
        </div>
      </section>
    </div>
  );
}
