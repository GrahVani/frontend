"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  Info,
  MinusCircle,
  RotateCcw,
  Scale,
  ShieldAlert,
} from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const CORAL = grahas.mangala.primary;
const BLUE = grahas.shukra.primary;
const GREEN = grahas.budha.primary;
const MAROON = grahas.ketu.primary;

type TabKey = "indicators" | "map" | "tier" | "reading";
type Technique = "whole-sign" | "d24" | "kp" | "transit";

const TABS: { key: TabKey; label: string }[] = [
  { key: "indicators", label: "Indicator list" },
  { key: "map", label: "Technique map" },
  { key: "tier", label: "Confidence tier" },
  { key: "reading", label: "Client reading" },
];

const TECHNIQUE_META: Record<Technique, { label: string; color: string; short: string }> = {
  "whole-sign": { label: "Whole-sign / D1", color: CORAL, short: "WS" },
  "d24": { label: "D24 varga", color: GREEN, short: "D24" },
  "kp": { label: "KP", color: BLUE, short: "KP" },
  "transit": { label: "Transit (stipulated)", color: GREEN, short: "Tr" },
};

const DEFAULT_INDICATORS = [
  {
    id: "mars-d1",
    label: "Mars exalted in natal 5th house",
    technique: "whole-sign" as Technique,
    counts: true,
    color: CORAL,
    active: true,
  },
  {
    id: "mars-d24",
    label: "Mars reconfirmed in D24",
    technique: "d24" as Technique,
    counts: true,
    color: CORAL,
    active: true,
  },
  {
    id: "venus-csl",
    label: "Venus as 5th cuspal sub-lord",
    technique: "kp" as Technique,
    counts: true,
    color: BLUE,
    active: true,
  },
  {
    id: "venus-sig",
    label: "Venus as 5th cuspal strongest significator",
    technique: "kp" as Technique,
    counts: true,
    color: BLUE,
    active: true,
  },
  {
    id: "venus-dasha",
    label: "Venus as running MD/AD lord in the window",
    technique: "kp" as Technique,
    counts: true,
    color: BLUE,
    active: true,
  },
  {
    id: "mars-karaka",
    label: "Mars kāraka-flavour reading (competitive edge)",
    technique: "whole-sign" as Technique,
    counts: false,
    caveat: "Restatement of Mars-in-5th; does not add a new indicator",
    color: CORAL,
    active: false,
  },
  {
    id: "transit",
    label: "Transit overlay on the 5th house",
    technique: "transit" as Technique,
    counts: false,
    caveat: "Stipulated illustration, not a computed real transit",
    color: GREEN,
    active: true,
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function ExamOutcomeConfidenceWorkbench() {
  const [tab, setTab] = useState<TabKey>("indicators");
  const [indicators, setIndicators] = useState(DEFAULT_INDICATORS);
  const [transitWeight, setTransitWeight] = useState<"caveated" | "full">("caveated");

  const counted = useMemo(
    () =>
      indicators.filter((i) => {
        if (!i.active || !i.counts) return false;
        if (i.id === "transit") return transitWeight === "full";
        return true;
      }),
    [indicators, transitWeight]
  );

  const techniques = useMemo(() => Array.from(new Set(counted.map((i) => i.technique))), [counted]);
  const independentCount = counted.length;

  const tier = useMemo(() => {
    if (independentCount <= 1) return 1;
    if (techniques.length >= 2) return 3;
    return 2;
  }, [independentCount, techniques.length]);

  function toggle(id: string) {
    setIndicators((prev) => prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i)));
  }

  function reset() {
    setIndicators(DEFAULT_INDICATORS);
    setTransitWeight("caveated");
    setTab("indicators");
  }

  return (
    <div
      data-interactive="exam-outcome-confidence-workbench"
      className="w-full min-w-0"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.08em", fontWeight: 600 }}>
            Worked synthesis
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Exam-outcome confidence worksheet
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Count Chart E1&apos;s exam-outcome indicators honestly, remove them one at a time, and watch the three-tier
            confidence framework move. The illustrative transit indicator can be caveated or full-weight without changing
            the Tier 3 result.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Exam outcome confidence sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "indicators" && (
        <IndicatorsTab indicators={indicators} toggle={toggle} transitWeight={transitWeight} setTransitWeight={setTransitWeight} tier={tier} counted={counted} techniques={techniques} />
      )}
      {tab === "map" && <MapTab counted={counted} techniques={techniques} tier={tier} />}
      {tab === "tier" && <TierTab tier={tier} independentCount={independentCount} techniques={techniques} />}
      {tab === "reading" && <ReadingTab tier={tier} />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function IndicatorsTab({
  indicators,
  toggle,
  transitWeight,
  setTransitWeight,
  tier,
  counted,
  techniques,
}: {
  indicators: typeof DEFAULT_INDICATORS;
  toggle: (id: string) => void;
  transitWeight: "caveated" | "full";
  setTransitWeight: (w: "caveated" | "full") => void;
  tier: number;
  counted: typeof DEFAULT_INDICATORS;
  techniques: Technique[];
}) {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Count the indicators honestly
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Toggle each item to see what counts toward the confidence tier. The Mars kāraka-flavour reading is a
          restatement, not a new indicator. The transit overlay is illustrative and is caveated by default.
        </p>

        <div className="mt-4 space-y-3">
          {indicators.map((i) => {
            const isTransit = i.id === "transit";
            return (
              <div
                key={i.id}
                className="rounded-lg p-3"
                style={{
                  background: i.active ? wash(i.color, "10") : SURFACE_2,
                  border: `1px solid ${i.active ? wash(i.color, "55") : HAIRLINE}`,
                  opacity: i.active ? 1 : 0.85,
                }}
              >
                <div className="flex items-start gap-3">
                  <input
                    id={i.id}
                    type="checkbox"
                    checked={i.active}
                    onChange={() => toggle(i.id)}
                    className="mt-1 h-4 w-4 rounded border"
                    style={{ accentColor: i.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <label htmlFor={i.id} className="block cursor-pointer text-sm" style={{ color: INK_PRIMARY, fontWeight: 500 }}>
                      {i.label}
                    </label>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded px-2 py-0.5 text-xs" style={{ background: wash(i.color, "18"), color: i.color, fontWeight: 500 }}>
                        {TECHNIQUE_META[i.technique].label}
                      </span>
                      {i.counts ? (
                        <span className="flex items-center gap-1 text-xs" style={{ color: GREEN }}>
                          <CheckCircle2 size={12} aria-hidden="true" />
                          Counts when active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs" style={{ color: MAROON }}>
                          <AlertCircle size={12} aria-hidden="true" />
                          Does not count
                        </span>
                      )}
                    </div>
                    {i.caveat && <p className="m-0 mt-1 text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>{i.caveat}</p>}
                    {isTransit && i.active && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setTransitWeight("caveated")}
                          className="rounded-lg px-3 py-1.5 text-xs"
                          style={{
                            background: transitWeight === "caveated" ? GREEN : SURFACE,
                            border: `1px solid ${transitWeight === "caveated" ? GREEN : HAIRLINE}`,
                            color: transitWeight === "caveated" ? "#fff" : INK_SECONDARY,
                            fontWeight: 500,
                          }}
                        >
                          Caveated
                        </button>
                        <button
                          type="button"
                          onClick={() => setTransitWeight("full")}
                          className="rounded-lg px-3 py-1.5 text-xs"
                          style={{
                            background: transitWeight === "full" ? GREEN : SURFACE,
                            border: `1px solid ${transitWeight === "full" ? GREEN : HAIRLINE}`,
                            color: transitWeight === "full" ? "#fff" : INK_SECONDARY,
                            fontWeight: 500,
                          }}
                        >
                          Full weight
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Live count</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Independent counted indicators: <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{counted.length}</strong>
        </p>
        <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Techniques represented: <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{techniques.map((t) => TECHNIQUE_META[t].short).join(", ") || "none"}</strong>
        </p>
        <div className="mt-4 rounded-lg p-3" style={{ background: wash(tierColor(tier), "10"), border: `1px solid ${wash(tierColor(tier), "55")}` }}>
          <p className="m-0 text-sm" style={{ color: tierColor(tier), fontWeight: 600 }}>Current tier: Tier {tier}</p>
          <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{tierLabel(tier)}</p>
        </div>
        <IndicatorStackSvg counted={counted} />
      </aside>
    </div>
  );
}

function MapTab({ counted, techniques, tier }: { counted: typeof DEFAULT_INDICATORS; techniques: Technique[]; tier: number }) {
  const byTechnique = useMemo(() => {
    const map: Record<Technique, number> = { "whole-sign": 0, d24: 0, kp: 0, transit: 0 };
    counted.forEach((i) => {
      map[i.technique] += 1;
    });
    return map;
  }, [counted]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1-4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Technique-span map
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Tier 2 needs two or more independent indicators. Tier 3 needs two or more indicators that span genuinely
          independent techniques or streams. Watch how removing a single technique can drop the tier.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(Object.keys(TECHNIQUE_META) as Technique[]).map((tech) => (
            <div key={tech} className="rounded-lg p-3" style={{ background: wash(TECHNIQUE_META[tech].color, "10"), border: `1px solid ${wash(TECHNIQUE_META[tech].color, "55")}` }}>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: TECHNIQUE_META[tech].color, fontWeight: 600 }}>{TECHNIQUE_META[tech].label}</span>
                <span className="rounded px-2 py-0.5 text-xs" style={{ background: wash(TECHNIQUE_META[tech].color, "18"), color: TECHNIQUE_META[tech].color, fontWeight: 600 }}>
                  {byTechnique[tech]}
                </span>
              </div>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>
                {byTechnique[tech] === 0
                  ? "No active counted indicators in this stream."
                  : byTechnique[tech] === 1
                  ? "One active counted indicator."
                  : `${byTechnique[tech]} active counted indicators.`}
              </p>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <TechniqueMapSvg byTechnique={byTechnique} tier={tier} />
        <div className="mt-4 rounded-lg p-3" style={{ background: wash(tierColor(tier), "10"), border: `1px solid ${wash(tierColor(tier), "55")}` }}>
          <p className="m-0 text-sm" style={{ color: tierColor(tier), fontWeight: 600 }}>Tier {tier}</p>
          <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
            {techniques.length >= 2
              ? "Indicators span at least two independent techniques — Tier 3 threshold met."
              : tier === 2
              ? "Two or more indicators, all within one technique — Tier 2."
              : "Fewer than two independent indicators — Tier 1, uncertain."}
          </p>
        </div>
      </aside>
    </div>
  );
}

function TierTab({ tier, independentCount, techniques }: { tier: number; independentCount: number; techniques: Technique[] }) {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Three-tier confidence framework
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The tiers extend the two-yes principle. Each tier describes how much independent corroboration a finding has,
          never the certainty of its outcome.
        </p>

        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((t) => (
            <div
              key={t}
              className="rounded-lg p-3"
              style={{
                background: tier === t ? wash(tierColor(t), "10") : SURFACE_2,
                border: `1px solid ${tier === t ? wash(tierColor(t), "55") : HAIRLINE}`,
              }}
            >
              <div className="flex items-center gap-2">
                {tier === t ? <CheckCircle2 size={18} style={{ color: tierColor(t) }} aria-hidden="true" /> : <MinusCircle size={18} style={{ color: INK_MUTED }} aria-hidden="true" />}
                <span className="text-sm" style={{ color: tier === t ? tierColor(t) : INK_PRIMARY, fontWeight: 600 }}>
                  Tier {t} — {t === 1 ? "Insufficient" : t === 2 ? "Corroborated" : "Strongly corroborated"}
                </span>
              </div>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                {t === 1 && "0-1 independent indicator. Report uncertain; do not predict."}
                {t === 2 && "≥2 independent indicators from one technique or closely-related techniques. Report as a reliable tendency."}
                {t === 3 && "≥2 independent indicators spanning genuinely independent techniques or streams. Report as a high-probability, well-corroborated tendency — still not a guarantee."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <TierMeterSvg tier={tier} />
        <div className="mt-4 rounded-lg p-3" style={{ background: wash(tierColor(tier), "10"), border: `1px solid ${wash(tierColor(tier), "55")}` }}>
          <p className="m-0 text-sm" style={{ color: tierColor(tier), fontWeight: 600 }}>Current assignment: Tier {tier}</p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Counted indicators: <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{independentCount}</strong>
          </p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Techniques spanned: <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{techniques.length}</strong>
          </p>
        </div>
        <p className="m-0 mt-3 text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
          Even Tier 3 is a statement about evidence, not outcome certainty. The bidirectional discipline still applies.
        </p>
      </aside>
    </div>
  );
}

function ReadingTab({ tier }: { tier: number }) {
  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6 Example 1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Client-ready Tier 3 reading
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          This reading communicates genuine, earned confidence without overclaiming. It names the strength, names the
          honest gap, and keeps the bidirectional discipline intact.
        </p>

        <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.7 }}>
            “Your chart shows an unusually deep, multi-technique alignment on this exact question. Five independent lines
            of evidence, across three different analytical methods, all point toward strength in exactly the domain —
            applied intellect and competitive performance — that exam success depends on, during exactly the years
            (roughly ages 16.5 to 20) when this kind of exam typically falls. This is among the most strongly
            corroborated findings this kind of analysis can produce. That said, even this level of agreement is a
            high-probability indication, not a guarantee — your own preparation, the specific exam&apos;s difficulty, and
            factors no chart can see all still matter, and one honest gap exists too: the more traditional
            house-lord/occupant daśā timing does not itself point to this exact window, even though every other
            technique does.”
          </p>
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(MAROON, "10"), border: `1px solid ${wash(MAROON, "55")}` }}>
          <div className="flex items-start gap-2">
            <ShieldAlert size={18} style={{ color: MAROON, flexShrink: 0 }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Do not drop the “not a guarantee” framing just because the finding is Tier 3. The tier measures
              corroboration, not outcome certainty.
            </p>
          </div>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Info size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Honest gap</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The whole-sign 5th lord (Saturn) and occupant (Mars) are not running their own mahādaśā or antardaśā during the
          exact Venus-Venus window (age 16.5625-19.8958). Mars antardaśā falls later (age 22.5625-23.7292) and Saturn
          antardaśā later still (age 29.3958-32.5625).
        </p>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(tierColor(tier), "10"), border: `1px solid ${wash(tierColor(tier), "55")}` }}>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} style={{ color: tierColor(tier) }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: tierColor(tier), fontWeight: 600 }}>Current tier: Tier {tier}</p>
          </div>
          <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
            {tier === 3
              ? "Chart E1 reaches Tier 3 with the five core indicators alone."
              : tier === 2
              ? "You have removed enough indicators to drop to Tier 2."
              : "You have removed enough indicators to reach Tier 1 (uncertain)."}
          </p>
        </div>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Checklist</p>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY }}>
            <li>Count genuinely independent indicators only.</li>
            <li>Exclude restatements of the same fact.</li>
            <li>Caveat stipulated illustrations.</li>
            <li>Name honest gaps plainly.</li>
            <li>Frame Tier 3 as evidence strength, not certainty.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function tierColor(tier: number) {
  if (tier === 3) return GREEN;
  if (tier === 2) return BLUE;
  return MAROON;
}

function tierLabel(tier: number) {
  if (tier === 3) return "Strongly corroborated — high-probability tendency, not a guarantee.";
  if (tier === 2) return "Corroborated — reliable tendency from one stream or closely related streams.";
  return "Insufficient — below the two-yes bar; report uncertain.";
}

function IndicatorStackSvg({ counted }: { counted: typeof DEFAULT_INDICATORS }) {
  return (
    <svg viewBox="0 0 320 120" role="img" aria-label="Stack of currently counted indicators" style={{ width: "100%", maxHeight: 140, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="80" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      {counted.length === 0 && (
        <text x="160" y="65" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>No counted indicators</text>
      )}
      {counted.map((i, idx) => {
        const y = 35 + idx * 14;
        return (
          <g key={i.id}>
            <rect x="40" y={y} width="240" height="10" rx="4" fill={wash(i.color, "22")} stroke={i.color} strokeWidth="1" />
            <text x="45" y={y + 8} fill={INK_PRIMARY} fontSize="8" fontWeight={600}>{i.label}</text>
          </g>
        );
      })}
      <text x="160" y="98" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        {counted.length} counted indicator{counted.length === 1 ? "" : "s"}
      </text>
    </svg>
  );
}

function TechniqueMapSvg({ byTechnique, tier }: { byTechnique: Record<Technique, number>; tier: number }) {
  const keys: Technique[] = ["whole-sign", "d24", "kp", "transit"];
  const max = Math.max(1, ...keys.map((k) => byTechnique[k]));

  return (
    <svg viewBox="0 0 320 180" role="img" aria-label="Active indicators grouped by analytical technique" style={{ width: "100%", maxHeight: 200, margin: "0 auto", display: "block" }}>
      <rect x="20" y="20" width="280" height="140" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      {keys.map((key, idx) => {
        const x = 55 + idx * 65;
        const h = (byTechnique[key] / max) * 70;
        const y = 110 - h;
        const color = TECHNIQUE_META[key].color;
        return (
          <g key={key}>
            <rect x={x - 18} y={y} width="36" height={h} rx="4" fill={wash(color, "25")} stroke={color} strokeWidth="1.5" />
            <text x={x} y={125} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>{TECHNIQUE_META[key].short}</text>
            <text x={x} y={y - 6} textAnchor="middle" fill={color} fontSize="10" fontWeight={600}>{byTechnique[key]}</text>
          </g>
        );
      })}

      <text x="160" y="158" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        {tier === 3 ? "Multi-technique span — Tier 3" : tier === 2 ? "Single-technique depth — Tier 2" : "Below two-yes bar — Tier 1"}
      </text>
    </svg>
  );
}

function TierMeterSvg({ tier }: { tier: number }) {
  return (
    <svg viewBox="0 0 320 120" role="img" aria-label="Confidence tier meter" style={{ width: "100%", maxHeight: 140, margin: "0 auto", display: "block" }}>
      <rect x="20" y="20" width="280" height="80" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <rect x="40" y="60" width="70" height="20" rx="4" fill={tier === 1 ? tierColor(1) : wash(MAROON, "18")} stroke={MAROON} strokeWidth={tier === 1 ? 2 : 1} />
      <text x="75" y="74" textAnchor="middle" fill={tier === 1 ? "#fff" : INK_MUTED} fontSize="10" fontWeight={600}>Tier 1</text>

      <rect x="125" y="60" width="70" height="20" rx="4" fill={tier === 2 ? tierColor(2) : wash(BLUE, "18")} stroke={BLUE} strokeWidth={tier === 2 ? 2 : 1} />
      <text x="160" y="74" textAnchor="middle" fill={tier === 2 ? "#fff" : INK_MUTED} fontSize="10" fontWeight={600}>Tier 2</text>

      <rect x="210" y="60" width="70" height="20" rx="4" fill={tier === 3 ? tierColor(3) : wash(GREEN, "18")} stroke={GREEN} strokeWidth={tier === 3 ? 2 : 1} />
      <text x="245" y="74" textAnchor="middle" fill={tier === 3 ? "#fff" : INK_MUTED} fontSize="10" fontWeight={600}>Tier 3</text>

      <text x="160" y="98" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Tier measures corroboration, not certainty</text>
    </svg>
  );
}
