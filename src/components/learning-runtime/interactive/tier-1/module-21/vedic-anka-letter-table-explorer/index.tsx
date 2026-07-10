"use client";

import { useState } from "react";
import { CalendarDays, GitCompare, Hash, RotateCcw, ShieldAlert, Sparkles, Table2 } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { EXAMPLES, GRAHA_ANKA, VEDIC_VECTORS, computeBhagyanka, computeHybridNamanka, computeMulanka, getGrahaAnka, grahaColor, type VedicVector } from "./data";

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

function finalOf(chain: number[]) {
  return chain.at(-1) ?? 0;
}

function GrahaAnkaSvg({ activeValue }: { activeValue: number }) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 520" className="h-auto w-full min-w-0" role="img" aria-label="Vedic graha anka correspondence map">
        <rect x="20" y="20" width="720" height="480" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="58" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          VEDIC GRAHA-AṄKA MAP: DIGITS 1-9 SPEAK THE GRAHA LANGUAGE
        </text>

        {GRAHA_ANKA.map((item, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 142 + col * 238;
          const y = 130 + row * 112;
          const color = grahaColor(item.value);
          const active = item.value === activeValue;
          return (
            <g key={item.value}>
              <rect x={x - 88} y={y - 44} width="176" height="92" rx="14" fill={active ? wash(color, "18") : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.4 : 1.2} />
              <text x={x - 66} y={y - 7} fill={color} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {item.value}
              </text>
              <text x={x - 2} y={y - 16} textAnchor="middle" fill={INK_PRIMARY} fontSize="24" fontWeight="700" style={{ fontFamily: "var(--font-devanagari), var(--font-sans), sans-serif" }}>
                {item.devanagari}
              </text>
              <text x={x - 2} y={y + 14} textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {item.grahaSlug}
              </text>
            </g>
          );
        })}

        <rect x="180" y="432" width="400" height="52" rx="26" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="458" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          <tspan x="380" dy="0">This graha map is the Vedic layer</tspan>
          <tspan x="380" dy="18">modern Indian Chaldean practice inherits.</tspan>
        </text>
      </svg>
    </section>
  );
}

function VectorResultCard({ vector, chain, active }: { vector: VedicVector; chain: number[]; active: boolean }) {
  const value = finalOf(chain);
  const graha = getGrahaAnka(value || 1);
  return (
    <article className="min-w-0 rounded-xl p-4" style={{ background: active ? wash(vector.color, "12") : SURFACE, border: `1px solid ${active ? vector.color : HAIRLINE}` }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: vector.color, letterSpacing: "0.08em" }}>{vector.source}</p>
          <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            <IAST>{vector.label}</IAST>
          </h3>
        </div>
        <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: vector.color }}>{vector.devanagari}</Devanagari>
      </div>
      <p className="m-0 text-4xl font-semibold" style={{ color: vector.color, fontFamily: "var(--font-cormorant), serif" }}>{value || "-"}</p>
      <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{chain.join(" -> ")} · {graha.devanagari}</p>
      <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{vector.depth}</p>
    </article>
  );
}

export function VedicAnkaLetterTableExplorer() {
  const [name, setName] = useState("Aniket");
  const [birthDate, setBirthDate] = useState("1985-07-22");
  const [activeVectorId, setActiveVectorId] = useState<VedicVector["id"]>("mulanka");
  const mulanka = computeMulanka(birthDate);
  const bhagyanka = computeBhagyanka(birthDate);
  const namanka = computeHybridNamanka(name);
  const activeVector = VEDIC_VECTORS.find((item) => item.id === activeVectorId) ?? VEDIC_VECTORS[0];
  const activeChain = activeVectorId === "mulanka" ? mulanka : activeVectorId === "bhagyanka" ? bhagyanka : namanka.chain;
  const activeValue = finalOf(activeChain) || 1;
  const activeGraha = getGrahaAnka(activeValue);

  const loadExample = (exampleName: string, exampleDate: string) => {
    setName(exampleName);
    setBirthDate(exampleDate);
  };

  const reset = () => {
    setName("Aniket");
    setBirthDate("1985-07-22");
    setActiveVectorId("mulanka");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vedic-anka-letter-table-explorer"
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
            Vedic Anka-Jyotisha explorer
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Read the three Vedic numbers through the graha-aṅka map
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Compute Mūlāṅka, Bhāgyāṅka, and a Roman-name hybrid Nāmāṅka, then cross-reference each result with the classical graha register.
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
            <CalendarDays size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Input</p>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full min-w-0 rounded-lg px-3 py-3 text-lg font-semibold outline-none"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif" }}
              aria-label="Roman name for hybrid Namanka calculation"
            />
            <input
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              className="w-full min-w-0 rounded-lg px-3 py-3 text-lg font-semibold outline-none"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif" }}
              aria-label="Birth date for Mulanka and Bhagyanka"
            />
          </div>
          <div className="mt-3 flex min-w-0 flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button key={example.id} type="button" onClick={() => loadExample(example.name, example.birthDate)} className="rounded-lg px-3 py-2 text-sm font-bold" style={{ background: name === example.name ? wash(GOLD, "18") : SURFACE_2, border: `1px solid ${HAIRLINE}`, color: name === example.name ? GOLD : INK_SECONDARY }}>
                {example.label}
              </button>
            ))}
          </div>
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(grahaColor(activeValue), "10"), border: `1px solid ${grahaColor(activeValue)}` }}>
          <div className="mb-2 flex items-center gap-2">
            <Hash size={17} color={grahaColor(activeValue)} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: grahaColor(activeValue), letterSpacing: "0.08em" }}>Active graha register</p>
          </div>
          <p className="m-0 text-4xl font-semibold" style={{ color: grahaColor(activeValue), fontFamily: "var(--font-cormorant), serif" }}>{activeValue}</p>
          <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{activeGraha.devanagari} · {activeGraha.register}</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{activeGraha.caveat}</p>
        </article>
      </section>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {VEDIC_VECTORS.map((vector) => {
          const selected = vector.id === activeVectorId;
          const chain = vector.id === "mulanka" ? mulanka : vector.id === "bhagyanka" ? bhagyanka : namanka.chain;
          return (
            <button key={vector.id} type="button" onClick={() => setActiveVectorId(vector.id)} className="min-w-0 text-left" style={{ border: "none", background: "transparent", padding: 0 }}>
              <VectorResultCard vector={vector} chain={chain} active={selected} />
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <GrahaAnkaSvg activeValue={activeValue} />

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Table2 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Hybrid Nāmāṅka ledger</p>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {namanka.values.map((item, index) => (
                <div key={`${item.letter}-${index}`} className="min-w-0 rounded-lg p-3 text-center" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
                  <p className="m-0 text-xl font-black" style={{ color: GOLD }}>{item.letter}</p>
                  <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{item.value}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(activeVector.color, "10"), border: `1px solid ${activeVector.color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={17} color={activeVector.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: activeVector.color, letterSpacing: "0.08em" }}>Selected vector</p>
            </div>
            <h3 className="mt-1 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{activeVector.label}</h3>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{activeVector.rule}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{activeVector.depth}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <GitCompare size={17} color={BLUE} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Hybrid pattern</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Roman name computation here uses the Vedic-Chaldean hybrid.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Chaldean letter values compute the name; Vedic graha-aṅka interprets the result. Pure Devanāgarī syllable Nāmāṅka is taught in the later computation lesson.</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Sanskrit authority guard</p>
            </div>
            <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>Classical framing does not permit guarantees.</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>A graha-aṅka mismatch can inform a reading, but it does not single-handedly cause marriage, career, or health outcomes.</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-3">
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GREEN, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GREEN, letterSpacing: "0.08em" }}>Mūlāṅka</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Birth-day root. Fixed after birth.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Bhāgyāṅka</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Full-date destiny. Fixed after birth.</p>
        </article>
        <article className="min-w-0 rounded-xl p-4" style={{ background: wash(GOLD, "0F"), border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Nāmāṅka</p>
          <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>Name register. Changeable, but never by over-claim.</p>
        </article>
      </section>
    </div>
  );
}
