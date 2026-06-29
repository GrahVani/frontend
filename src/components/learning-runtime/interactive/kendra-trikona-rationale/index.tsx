"use client";

import { useState } from "react";
import { AlertTriangle, CircleDot, Crown, Flame, RotateCcw, Scale, ShieldCheck, Table2 } from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { DOCTRINE_CARDS, EXAMPLES, HOUSE_FAMILIES, getDoctrineCard, type DoctrineMode } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const KENDRA = grahas.shani.primary;
const TRIKONA = grahas.guru.primary;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function doctrineIcon(mode: DoctrineMode, color: string, size = 16) {
  if (mode === "benefic-kendra") return <Scale size={size} color={color} />;
  if (mode === "malefic-kendra") return <Flame size={size} color={color} />;
  if (mode === "yogakaraka") return <ShieldCheck size={size} color={color} />;
  return <Crown size={size} color={color} />;
}

function RationaleDiagram({ mode }: { mode: DoctrineMode }) {
  const card = getDoctrineCard(mode);
  return (
    <section className="mx-auto w-full max-w-[640px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 640 390" className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label="Kendra Trikona rationale diagram">
        <rect x="18" y="20" width="604" height="344" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="320" y="54" textAnchor="middle" fill={ink.goldAccent} fontSize="13" fontWeight="900" letterSpacing="1.1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          WHY THE UNION IS ROYAL
        </text>

        <g>
          <rect x="56" y="94" width="174" height="170" rx="16" fill={wash(KENDRA, "10")} stroke={KENDRA} />
          <text x="143" y="125" textAnchor="middle" fill={KENDRA} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            KENDRA
          </text>
          <text x="143" y="162" textAnchor="middle" fill={INK_PRIMARY} fontSize="30" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Vishnu
          </text>
          <text x="143" y="192" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            H1 H4 H7 H10
          </text>
          <text x="143" y="222" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            power / action
          </text>
        </g>

        <g>
          <rect x="410" y="94" width="174" height="170" rx="16" fill={wash(TRIKONA, "10")} stroke={TRIKONA} />
          <text x="497" y="125" textAnchor="middle" fill={TRIKONA} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            TRIKONA
          </text>
          <text x="497" y="162" textAnchor="middle" fill={INK_PRIMARY} fontSize="30" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Lakshmi
          </text>
          <text x="497" y="192" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            H1 H5 H9
          </text>
          <text x="497" y="222" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            dharma / grace
          </text>
        </g>

        <line x1="238" y1="176" x2="402" y2="176" stroke={card.color} strokeWidth="4" strokeDasharray={mode === "union" || mode === "yogakaraka" ? "0" : "8 8"} opacity="0.75" />
        <circle cx="320" cy="176" r="58" fill={wash(card.color, "18")} stroke={card.color} strokeWidth="2.5" />
        <text x="320" y="164" textAnchor="middle" fill={card.color} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {mode === "yogakaraka" ? "ONE PLANET" : "UNION"}
        </text>
        <text x="320" y="192" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {card.label}
        </text>

        <text x="320" y="314" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Power without grace is hollow; grace without power may remain unrealised.
        </text>
      </svg>
    </section>
  );
}

export function KendraTrikonaRationale() {
  const [mode, setMode] = useState<DoctrineMode>("union");
  const selected = getDoctrineCard(mode);

  function reset() {
    setMode("union");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="kendra-trikona-rationale"
      style={{
        maxWidth: 840,
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
            Kendra-trikona rationale
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Vishnu&apos;s power meeting Lakshmi&apos;s grace
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore why this house-family interaction is called royal, and how the same logic explains kendradhipati dosha.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset union
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Choose the doctrine lens
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {DOCTRINE_CARDS.map((card) => {
              const active = mode === card.slug;
              return (
                <button key={card.slug} type="button" onClick={() => setMode(card.slug)} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(card.color, "18") : SURFACE_2, border: `1px solid ${active ? card.color : HAIRLINE}`, color: active ? card.color : INK_SECONDARY }}>
                  {doctrineIcon(card.slug, active ? card.color : INK_SECONDARY)}
                  {card.label}
                </button>
              );
            })}
          </div>
        </section>

        <RationaleDiagram mode={mode} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: selected.color, letterSpacing: "0.08em" }}>
                Selected doctrine
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{selected.iast}</IAST>
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {selected.principle}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: selected.color }}>
              {selected.devanagari}
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(selected.color, "10"), border: `1px solid ${selected.color}55` }}>
              {doctrineIcon(mode, selected.color, 17)}
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{selected.title}</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.result}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <AlertTriangle size={17} color={ink.goldAccent} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Reader caution</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{selected.caution}</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: mode === "yogakaraka" ? wash(grahas.budha.primary, "12") : SURFACE_2, border: `1px solid ${mode === "yogakaraka" ? grahas.budha.primary : HAIRLINE}` }}>
              <ShieldCheck size={17} color={mode === "yogakaraka" ? grahas.budha.primary : INK_MUTED} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Yogakaraka rule</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>Kendra power plus trikona grace in one planet escapes the angle-lord blemish.</p>
            </article>
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {EXAMPLES.map((example) => (
            <article key={example.title} className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                {example.title}
              </p>
              <p className="mt-3 text-sm" style={{ color: INK_SECONDARY }}>{example.body}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              House-family reference
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "Family", width: "w-[120px]" },
                    { label: "Houses", width: "w-[100px]" },
                    { label: "Deity name", width: "w-[130px]" },
                    { label: "Function", width: "w-[140px]" },
                    { label: "Raja-yoga role", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOUSE_FAMILIES.map((family) => (
                  <tr key={family.slug} style={{ background: SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                    <td className="px-4 py-3 font-bold" style={{ color: family.color }}>{family.label}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}>{family.houses}</td>
                    <td className="px-4 py-3" style={{ color: INK_SECONDARY }}><IAST>{family.iast}</IAST></td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{family.meaning}</td>
                    <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{family.slug === "kendra" ? "Gives power to act." : "Gives grace and dharmic legitimacy."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
