"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, BriefcaseBusiness, CheckCircle2, CircleDot, Eye, Link2, RotateCcw, Sparkles, Table2 } from "lucide-react";
import { grahas, ink, rashis, type GrahaSlug, type RashiSlug } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { RASHI_ORDER } from "../raja-yoga-detector/data";
import {
  DHARMA_KARMA_MODES,
  FEATURED_LAGNAS,
  dharmaKarmaCase,
  dharmaKarmaCases,
  grahaName,
  rashiName,
  type DharmaKarmaMode,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const DHARMA = grahas.guru.primary;
const KARMA = grahas.shani.primary;
const YOGA = ink.goldAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function readableGrahaColor(slug: GrahaSlug) {
  const readable: Partial<Record<GrahaSlug, string>> = {
    candra: "#5F6F96",
    shukra: "#4F7FAF",
    surya: "#9C7A2F",
    guru: "#B66F12",
  };
  return readable[slug] ?? grahas[slug].primary;
}

function modeIcon(mode: DharmaKarmaMode) {
  if (mode === "exchange") return ArrowRightLeft;
  if (mode === "aspect") return Eye;
  return Link2;
}

function DharmaKarmaBridge({ lagna, mode }: { lagna: RashiSlug; mode: DharmaKarmaMode }) {
  const item = dharmaKarmaCase(lagna);
  const modeMeta = DHARMA_KARMA_MODES[mode];

  return (
    <section className="mx-auto w-full max-w-[620px] rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 620 360" className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label="Dharma Karmadhipati 9th and 10th lord relationship bridge">
        <rect x="18" y="20" width="584" height="316" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />

        <g>
          <rect x="54" y="76" width="168" height="178" rx="16" fill={wash(DHARMA, "10")} stroke={DHARMA} />
          <text x="138" y="108" textAnchor="middle" fill={DHARMA} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            9TH LORD
          </text>
          <text x="138" y="148" textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {grahaName(item.ninthLord)}
          </text>
          <text x="138" y="178" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            {rashis[item.ninthSign].iast} sign
          </text>
          <text x="138" y="210" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            dharma, bhagya, grace
          </text>
        </g>

        <g>
          <rect x="398" y="76" width="168" height="178" rx="16" fill={wash(KARMA, "10")} stroke={KARMA} />
          <text x="482" y="108" textAnchor="middle" fill={KARMA} fontSize="13" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            10TH LORD
          </text>
          <text x="482" y="148" textAnchor="middle" fill={INK_PRIMARY} fontSize="34" fontWeight="900" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {grahaName(item.tenthLord)}
          </text>
          <text x="482" y="178" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            {rashis[item.tenthSign].iast} sign
          </text>
          <text x="482" y="210" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
            karma, career, standing
          </text>
        </g>

        <line x1="232" y1="164" x2="388" y2="164" stroke={modeMeta.formed ? YOGA : HAIRLINE} strokeWidth="5" strokeDasharray={modeMeta.formed ? "0" : "8 8"} />
        <circle cx="310" cy="164" r="54" fill={modeMeta.formed ? wash(YOGA, "20") : SURFACE} stroke={modeMeta.formed ? YOGA : HAIRLINE} strokeWidth="2.5" />
        <text x="310" y="157" textAnchor="middle" fill={modeMeta.formed ? YOGA : INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {modeMeta.formed ? "YOGA" : "CHECK"}
        </text>
        <text x="310" y="182" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {modeMeta.label}
        </text>

        {item.yogakarakaLord ? (
          <g>
            <rect x="218" y="270" width="184" height="36" rx="18" fill={wash(grahas[item.yogakarakaLord].primary, "16")} stroke={readableGrahaColor(item.yogakarakaLord)} />
            <text x="310" y="293" textAnchor="middle" fill={readableGrahaColor(item.yogakarakaLord)} fontSize="12.5" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
              Yogakaraka note: {grahaName(item.yogakarakaLord)}
            </text>
          </g>
        ) : null}
      </svg>
    </section>
  );
}

export function DharmaKarmadhipatiDetector() {
  const [lagna, setLagna] = useState<RashiSlug>("karka");
  const [mode, setMode] = useState<DharmaKarmaMode>("conjunction");
  const current = useMemo(() => dharmaKarmaCase(lagna), [lagna]);
  const rows = useMemo(() => dharmaKarmaCases(), []);
  const modeMeta = DHARMA_KARMA_MODES[mode];

  function reset() {
    setLagna("karka");
    setMode("conjunction");
  }

  return (
    <div
      className="mx-auto w-full min-w-0"
      data-interactive="dharma-karmadhipati-detector"
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
            Dharma-Karmadhipati detector
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            9th lord fortune + 10th lord action
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            This is the highest-grade kendra-trikona bridge: the strongest trine meeting the strongest angle.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex self-start items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset Cancer
        </button>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              Choose lagna and relationship
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
            <label className="grid gap-2 text-sm font-bold" style={{ color: INK_SECONDARY }}>
              Lagna
              <select value={lagna} onChange={(event) => setLagna(event.target.value as RashiSlug)} className="rounded-lg px-3 py-2" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
                {RASHI_ORDER.map((slug) => (
                  <option key={slug} value={slug}>
                    {rashiName(slug)}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {(Object.keys(DHARMA_KARMA_MODES) as DharmaKarmaMode[]).map((key) => {
                const Icon = modeIcon(key);
                const active = mode === key;
                return (
                  <button key={key} type="button" onClick={() => setMode(key)} className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: active ? wash(YOGA, "18") : SURFACE_2, border: `1px solid ${active ? YOGA : HAIRLINE}`, color: active ? YOGA : INK_SECONDARY }}>
                    <Icon size={16} />
                    {DHARMA_KARMA_MODES[key].label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <DharmaKarmaBridge lagna={lagna} mode={mode} />

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
                Current reading
              </p>
              <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                <IAST>{rashis[lagna].iast}</IAST>: {grahaName(current.ninthLord)} + {grahaName(current.tenthLord)}
              </h3>
              <p className="mt-2 text-sm" style={{ color: INK_SECONDARY }}>
                {modeMeta.note} {modeMeta.formed ? "The yoga is structurally present; Chapter 7 judges strength." : "This is only the lord table until a relationship is present."}
              </p>
            </div>
            <Devanagari size="md" className="shrink-0 opacity-80" style={{ color: modeMeta.formed ? YOGA : INK_MUTED }}>
              धर्मकर्म
            </Devanagari>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-xl p-4" style={{ background: wash(DHARMA, "10"), border: `1px solid ${HAIRLINE}` }}>
              <Sparkles size={17} color={DHARMA} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>9th lord</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{grahaName(current.ninthLord)} rules {rashis[current.ninthSign].iast}: fortune and dharma.</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: wash(KARMA, "10"), border: `1px solid ${HAIRLINE}` }}>
              <BriefcaseBusiness size={17} color={KARMA} />
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>10th lord</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{grahaName(current.tenthLord)} rules {rashis[current.tenthSign].iast}: action and status.</p>
            </article>
            <article className="rounded-xl p-4" style={{ background: modeMeta.formed ? wash(YOGA, "14") : SURFACE_2, border: `1px solid ${modeMeta.formed ? YOGA : HAIRLINE}` }}>
              {mode === "exchange" ? (
                <ArrowRightLeft size={17} color={modeMeta.formed ? YOGA : INK_MUTED} />
              ) : mode === "aspect" ? (
                <Eye size={17} color={modeMeta.formed ? YOGA : INK_MUTED} />
              ) : (
                <Link2 size={17} color={modeMeta.formed ? YOGA : INK_MUTED} />
              )}
              <p className="mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>Result</p>
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{modeMeta.formed ? "Dharma-Karmadhipati formed." : "Not formed yet."}</p>
            </article>
          </div>
        </section>

        <section className="rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <Table2 size={17} color={ink.goldAccent} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: ink.goldAccent, letterSpacing: "0.08em" }}>
              9th and 10th lord table
            </p>
          </div>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${HAIRLINE}` }}>
            <table className="w-full min-w-0 table-fixed border-collapse text-sm">
              <thead style={{ background: SURFACE_2 }}>
                <tr>
                  {[
                    { label: "", width: "w-12" },
                    { label: "Lagna", width: "w-[140px]" },
                    { label: "9th lord", width: "w-[160px]" },
                    { label: "10th lord", width: "w-[160px]" },
                    { label: "Note", width: "" },
                  ].map((heading) => (
                    <th key={heading.label} className={`px-4 py-3 text-left text-xs font-bold uppercase ${heading.width}`} style={{ color: INK_SECONDARY, letterSpacing: "0.06em" }}>
                      {heading.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  const active = row.lagna === lagna;
                  const featured = FEATURED_LAGNAS.includes(row.lagna);
                  return (
                    <tr key={row.lagna} onClick={() => setLagna(row.lagna)} className="cursor-pointer" style={{ background: active ? wash(YOGA, "12") : SURFACE, borderTop: `1px solid ${HAIRLINE}` }}>
                      <td className="px-4 py-3">{active ? <CheckCircle2 size={17} color={YOGA} /> : <CircleDot size={17} color={INK_MUTED} />}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: INK_PRIMARY }}>{rashiName(row.lagna)}</td>
                      <td className="px-4 py-3 font-medium" style={{ color: readableGrahaColor(row.ninthLord) }}>{grahaName(row.ninthLord)} <span style={{ color: INK_SECONDARY }}>({rashis[row.ninthSign].iast})</span></td>
                      <td className="px-4 py-3 font-medium" style={{ color: readableGrahaColor(row.tenthLord) }}>{grahaName(row.tenthLord)} <span style={{ color: INK_SECONDARY }}>({rashis[row.tenthSign].iast})</span></td>
                      <td className="px-4 py-3 break-words" style={{ color: INK_SECONDARY }}>{row.yogakarakaLord ? `${grahaName(row.yogakarakaLord)} is also yogakaraka.` : featured ? "Featured in this lesson." : "Check relationship mode."}</td>
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
