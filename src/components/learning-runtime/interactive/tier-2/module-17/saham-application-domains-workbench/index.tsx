"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Eye,
  HelpCircle,
  Home,
  Layers,
  MapPinned,
  MinusCircle,
  RotateCcw,
  Scale,
  XCircle
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#D97706";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const MUTED_TINT = "#F4EFE4";
const GOLD_TINT = "#FFF8E8";
const GREEN_TINT = "#EAF4EE";
const VERMILION_TINT = "#FDEBE6";
const AMBER_TINT = "#FFF4DE";
const BLUE_TINT = "#EAF0F8";
const PURPLE_TINT = "#F1EEFA";
const TEAL_TINT = "#EAF6F5";
const BROWN_TINT = "#F7EFE8";
const SLATE_TINT = "#EEF1F4";
const OLIVE_TINT = "#F1F5E8";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

type ExampleKey = "kavya-career" | "meera-relationship" | "kavya-health-nohit";
type StepKey = 1 | 2 | 3 | 4 | 5;
type LayerStatus = "support" | "silent" | "unavailable";

interface Example {
  key: ExampleKey;
  label: string;
  native: string;
  domain: string;
  domainModule: string;
  question: string;
  isDay: boolean;
  sun: number;
  moon: number;
  lagna: number;
  varsaLagna: number;
  punya: number;
  punyaHouse: number;
  aspects: { planet: string; deg: number; orb: number; exact?: boolean; note: string }[];
  layers: {
    saham: LayerStatus;
    sahamText: string;
    yogas: LayerStatus;
    yogasText: string;
    muntha: LayerStatus;
    munthaText: string;
    planetary: LayerStatus;
    planetaryText: string;
    natal: LayerStatus;
    natalText: string;
  };
  verdict: "STRONG" | "PARTIAL" | "NO-HIT";
  verdictText: string;
}

const EXAMPLES: Record<ExampleKey, Example> = {
  "kavya-career": {
    key: "kavya-career",
    label: "Kavya — career domain",
    native: "Kavya",
    domain: "Career & Profession",
    domainModule: "T2-03 Career & Profession",
    question: "What are my career prospects this year?",
    isDay: true,
    sun: 110,
    moon: 15,
    lagna: 280,
    varsaLagna: 280,
    punya: 185,
    punyaHouse: 10,
    aspects: [
      { planet: "Mars", deg: 200, orb: 15, note: "Mars in Libra at 20°; 15° separation exceeds Mars's own 8° deeptāṃśa orb. No active aspect." }
    ],
    layers: {
      saham: "support",
      sahamText: "Punya falls in the 10th house — a direct domain hit for the career question.",
      yogas: "support",
      yogasText: "Venus is in Vartamāna Ithasala with the Sun. Venus is also the 10th lord, so the yoga layer supports the career domain.",
      muntha: "silent",
      munthaText: "Year-30 muntha sits in the 6th house (Sagittarius), a different domain; neither supports nor contradicts.",
      planetary: "support",
      planetaryText: "Venus carries four convergent roles: Punya-pati, Varṣeśa, Ithasala partner, and 10th lord.",
      natal: "unavailable",
      natalText: "Kavya's natal 10th-house data was not built out in this module; disclosed rather than silently skipped."
    },
    verdict: "STRONG",
    verdictText: "Strong convergence among the available layers. The career domain is well-supported, though the verdict remains non-deterministic."
  },
  "meera-relationship": {
    key: "meera-relationship",
    label: "Meera — relationship domain",
    native: "Meera",
    domain: "Marriage & Relationships",
    domainModule: "T2-04 Marriage & Relationships",
    question: "Will I get married this year?",
    isDay: false,
    sun: 260,
    moon: 80,
    lagna: 320,
    varsaLagna: 320,
    punya: 140,
    punyaHouse: 7,
    aspects: [
      { planet: "Saturn", deg: 140, orb: 0, exact: true, note: "Saturn at exactly 20° Leo — a 0.00° conjunction with Punya." }
    ],
    layers: {
      saham: "support",
      sahamText: "Punya falls in the 7th house — a direct domain hit — and is in exact conjunction with Saturn.",
      yogas: "silent",
      yogasText: "Saturn is not involved in an Ithasala/Eesarpha configuration this year; Mercury-Sun forms the one same-sign pair.",
      muntha: "silent",
      munthaText: "Year-25 muntha sits in the 1st house (Libra), a self/identity domain rather than relationship directly.",
      planetary: "support",
      planetaryText: "Saturn in Leo is in neutral dignity; its involvement adds structure, delay, and endurance themes.",
      natal: "unavailable",
      natalText: "Meera's natal table beyond Lagna and Sun was not built out; disclosed as unavailable."
    },
    verdict: "PARTIAL",
    verdictText: "Partial convergence with one high-salience exact finding. The relationship domain carries a structural, Saturn-toned quality this year, offered as thematic context rather than a specific outcome."
  },
  "kavya-health-nohit": {
    key: "kavya-health-nohit",
    label: "Kavya — health domain (no-hit)",
    native: "Kavya",
    domain: "Health & Longevity",
    domainModule: "T2-07 Health & Longevity",
    question: "Should I be worried about my health this year?",
    isDay: true,
    sun: 110,
    moon: 15,
    lagna: 280,
    varsaLagna: 280,
    punya: 185,
    punyaHouse: 10,
    aspects: [],
    layers: {
      saham: "silent",
      sahamText: "Punya falls in the 10th house, which does not touch the health domain (6th/8th/12th). A clean miss.",
      yogas: "unavailable",
      yogasText: "No saham-domain link to validate against the yoga layer.",
      muntha: "silent",
      munthaText: "Muntha in the 6th house is health-relevant, but the question is not answered by Punya's placement.",
      planetary: "silent",
      planetaryText: "Planetary positions must be read through standard house/lord technique, not through Punya.",
      natal: "unavailable",
      natalText: "Natal health data not built out in this module."
    },
    verdict: "NO-HIT",
    verdictText: "No-hit domain. The saham finding does not address the question. Redirect to standard house/lord reading for the 1st, 6th, and 8th houses."
  }
};

const DOMAIN_MODULES = [
  "T2-03 Career & Profession",
  "T2-04 Marriage & Relationships",
  "T2-05 Wealth & Finance",
  "T2-06 Children",
  "T2-07 Health & Longevity",
  "T2-08 Education & Learning",
  "T2-09 Property & Real Estate",
  "T2-10 Travel & Foreign Settlement",
  "T2-11 Litigation & Conflict",
  "T2-12 Spiritual Path & Moksha"
];

function normalize(value: number): number {
  let v = value % 360;
  if (v < 0) v += 360;
  return v;
}

function signName(deg: number): string {
  return SIGNS[Math.floor(normalize(deg) / 30) % 12];
}

function lordName(deg: number): string {
  return SIGN_LORD[signName(deg)] ?? "—";
}

function formatDeg(deg: number): string {
  const d = normalize(deg);
  const s = Math.floor(d / 30);
  const rest = d - s * 30;
  const degInSign = Math.floor(rest);
  const minutes = Math.floor((rest - degInSign) * 60);
  const seconds = Math.round((((rest - degInSign) * 60) - minutes) * 60);
  return `${degInSign}° ${SIGNS[s % 12]} ${minutes}′ ${seconds}″`;
}

export function SahamApplicationDomainsWorkbench() {
  const [tab, setTab] = useState<"domains" | "runner">("domains");
  const [example, setExample] = useState<ExampleKey>("kavya-career");
  const [step, setStep] = useState<StepKey>(1);

  const ex = EXAMPLES[example];

  function reset() {
    setTab("domains");
    setExample("kavya-career");
    setStep(1);
  }

  return (
    <div data-interactive="saham-application-domains-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Saham application across use-case domains</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Run the five-step workflow with the one computable saham
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Ground the inherited &quot;12 use-case domains&quot; framing in this curriculum&apos;s ten domain modules, then apply T1-19&apos;s five-step workflow using Punya alone — with every unavailable layer disclosed.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "domains", label: "Use-case domains", icon: Layers },
          { key: "runner", label: "Five-step runner", icon: ArrowRight }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as typeof tab)}
              style={{
                ...smallChipStyle(active, active ? GOLD_DEEP : INK_MUTED),
                height: "44px",
                padding: "0 1rem",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "domains" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <HelpCircle size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Grounding the inherited title</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              The module overview names &quot;12 use-case domains,&quot; but this curriculum&apos;s own Tier-2 structure contains ten named domain modules (T2-03 through T2-12). Rather than invent two extra domains, this lesson grounds the framing in the ten verified modules and discloses the mismatch.
            </p>
            <DomainDiagram />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Ten grounded domain modules</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.5rem" }}>
              {DOMAIN_MODULES.map((mod, i) => (
                <span
                  key={mod}
                  style={{
                    padding: "0.45rem 0.75rem",
                    borderRadius: "8px",
                    background: tintForColor(domainColor(i)),
                    border: `1px solid ${domainColor(i)}`,
                    color: domainColor(i),
                    fontSize: "0.85rem",
                    fontWeight: 600
                  }}
                >
                  {mod}
                </span>
              ))}
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
              These are the domains this curriculum actually teaches in depth. A saham application question maps onto one of them; if the computed saham does not touch the corresponding house(s), the honest result is a no-hit redirect.
            </p>
          </section>
        </>
      )}

      {tab === "runner" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Worked example</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(EXAMPLES) as ExampleKey[]).map((key) => (
                <button key={key} type="button" onClick={() => { setExample(key); setStep(1); }} style={smallChipStyle(example === key, example === key ? GOLD_DEEP : INK_MUTED)}>
                  {EXAMPLES[key].label}
                </button>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: "10px", background: BLUE_TINT, border: `1px solid ${BLUE}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
              <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Client question:</strong>{" "}
              {ex.question} <span style={{ color: INK_MUTED }}>({ex.domainModule})</span>
            </div>
          </section>

          <Stepper step={step} setStep={setStep} />

          {step === 1 && (
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Step 1 — Identify</p>
              <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem" }}>Only Punya is computable in this module</h3>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                T1-19&apos;s own worked example uses a five-saham cluster for a wealth question. Here, only Punya carries a verified formula. The other sahams that conceptually relate to {ex.domain.toLowerCase()} are named, but their formulas are unavailable.
              </p>
              <div style={{ marginTop: "0.85rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ padding: "0.5rem 0.85rem", borderRadius: "999px", background: GREEN_TINT, border: `1.5px solid ${GREEN}`, color: GREEN, fontWeight: 600 }}>Punya Saham — computable</span>
                <span style={{ padding: "0.5rem 0.85rem", borderRadius: "999px", background: AMBER_TINT, border: `1.5px solid ${AMBER}`, color: AMBER, fontWeight: 600 }}>Related sahams — formula unavailable</span>
              </div>
              {ex.verdict === "NO-HIT" && (
                <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: "10px", background: VERMILION_TINT, border: `1px solid ${VERMILION}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <AlertTriangle size={16} color={VERMILION} style={{ display: "inline", marginRight: "0.35rem", verticalAlign: "middle" }} />
                  This example deliberately asks a domain question that Punya&apos;s placement does not touch, to practise the no-hit discipline.
                </div>
              )}
            </section>
          )}

          {step === 2 && (
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Step 2 — Compute</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "0.85rem" }}>
                <MiniFact icon={<Calculator size={16} />} title="Formula" body={ex.isDay ? "(Moon − Sun + Lagna) mod 360°" : "(Sun − Moon + Lagna) mod 360°"} color={BLUE} />
                <MiniFact icon={<Scale size={16} />} title="Birth sect" body={ex.isDay ? "Day birth" : "Night birth"} color={GOLD} />
                <MiniFact icon={<MapPinned size={16} />} title="Punya Saham" body={formatDeg(ex.punya)} color={GREEN} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.55rem" }}>
                <ValueBox label="Sun" value={`${ex.sun}°`} />
                <ValueBox label="Moon" value={`${ex.moon}°`} />
                <ValueBox label="Lagna" value={`${ex.lagna}°`} />
                <ValueBox label="Varṣa Lagna" value={`${ex.varsaLagna}°`} />
              </div>
              <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
                Computation follows the day/night reversal rule from Lesson 17.3.1. The same formula is applied consistently across all three examples.
              </p>
            </section>
          )}

          {step === 3 && (
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Step 3 — Check house-placement</p>
              <div style={workbenchDiagramLayoutStyle}>
                <section style={{ ...cardStyle, flex: "1 1 260px", borderColor: GREEN }}>
                  <MiniFact icon={<Home size={16} />} title="Punya house" body={`House ${ex.punyaHouse} from Varṣa Lagna`} color={GREEN} />
                  <MiniFact icon={<MapPinned size={16} />} title="Sign" body={signName(ex.punya)} color={BLUE} />
                  <MiniFact icon={<Eye size={16} />} title="Sign lord" body={lordName(ex.punya)} color={PURPLE} />
                  <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    Whole-sign counting from the Varṣa Lagna sign. House {ex.punyaHouse} {ex.verdict === "NO-HIT" ? "does not map to the health domain." : "directly maps to the question asked."}
                  </p>
                </section>
                <section style={{ ...cardStyle, flex: "2 1 360px" }}>
                  <ChartHighlight punyaHouse={ex.punyaHouse} />
                </section>
              </div>
            </section>
          )}

          {step === 4 && (
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Step 4 — Check aspects + Ithasala</p>
              {ex.aspects.length === 0 ? (
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                  No planetary aspect check is needed for a no-hit domain. The saham finding does not address the question, so step 4 is bypassed in favour of the fallback redirect.
                </p>
              ) : (
                <>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                    Scan the varṣaphala planets for same-sign proximity to Punya within their own deeptāṃśa orbs. Exact conjunctions are flagged separately from wide-orb aspects.
                  </p>
                  <div style={{ marginTop: "0.85rem" }}>
                    {ex.aspects.map((a) => (
                      <OrbGauge key={a.planet} punya={ex.punya} aspect={a} />
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {step === 5 && (
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Step 5 — Synthesize year-verdict</p>
              <ConvergenceDashboard layers={ex.layers} verdict={ex.verdict} verdictText={ex.verdictText} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function Stepper({ step, setStep }: { step: StepKey; setStep: (s: StepKey) => void }) {
  const steps: { num: StepKey; label: string }[] = [
    { num: 1, label: "Identify" },
    { num: 2, label: "Compute" },
    { num: 3, label: "Placement" },
    { num: 4, label: "Aspect" },
    { num: 5, label: "Synthesize" }
  ];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", justifyContent: "space-between" }}>
      {steps.map(({ num, label }, idx) => {
        const isCurrent = step === num;
        const isDone = step > num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => setStep(num)}
            style={{
              flex: 1,
              minWidth: "110px",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.55rem 0.75rem",
              borderRadius: "10px",
              border: `1.5px solid ${isCurrent ? GOLD : HAIRLINE}`,
              background: isCurrent ? GOLD_TINT : SURFACE,
              cursor: "pointer"
            }}
          >
            <span
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isCurrent ? GOLD : isDone ? GREEN : MUTED_TINT,
                color: isCurrent || isDone ? "#fff" : INK_MUTED,
                fontSize: "11px",
                fontWeight: 700
              }}
            >
              {isDone ? <CheckCircle2 size={14} /> : num}
            </span>
            <span style={{ fontSize: "12px", fontWeight: isCurrent ? 600 : 500, color: isCurrent ? GOLD_DEEP : INK_SECONDARY }}>
              {label}
            </span>
            {idx < steps.length - 1 && <ArrowRight size={14} color={GOLD} style={{ marginLeft: "auto" }} />}
          </button>
        );
      })}
    </div>
  );
}

function DomainDiagram() {
  return (
    <svg viewBox="0 0 760 190" role="img" aria-label="Twelve use-case domains title grounded in ten curriculum modules" style={{ width: "100%", maxHeight: 220, marginTop: "0.75rem" }}>
      <text x="20" y="22" fill={INK_MUTED} fontSize="12" fontWeight={600}>Inherited module-overview framing</text>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={20 + i * 58} y="36" width="48" height="36" rx="5" fill={MUTED_TINT} stroke={INK_MUTED} />
      ))}
      <text x="357" y="94" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>12 use-case domains</text>

      <path d="M 357 104 L 357 122" stroke={GOLD} strokeWidth="2" />
      <polygon points="357,122 352,116 362,116" fill={GOLD} />

      <text x="20" y="142" fill={GOLD_DEEP} fontSize="12" fontWeight={600}>Grounded in this curriculum</text>
      {DOMAIN_MODULES.map((mod, i) => (
        <g key={mod}>
          <rect x={20 + i * 70} y="150" width="64" height="22" rx="4" fill={tintForColor(domainColor(i))} stroke={domainColor(i)} />
          <text x={52 + i * 70} y="165" textAnchor="middle" fill={domainColor(i)} fontSize="8" fontWeight={600}>{mod.split(" ")[0]}</text>
        </g>
      ))}
      <rect x="724" y="150" width="18" height="22" rx="4" fill="none" stroke={INK_MUTED} strokeDasharray="3 2" />
      <text x="733" y="165" textAnchor="middle" fill={INK_MUTED} fontSize="10">?</text>

      <text x="380" y="132" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>10 traced modules + 2 disclosed gap</text>
    </svg>
  );
}

function ChartHighlight({ punyaHouse }: { punyaHouse: number }) {
  const HOUSE_PATHS: Record<number, string> = {
    1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
    2: "M 0,0 L 100,0 L 50,50 Z",
    3: "M 0,0 L 0,100 L 50,50 Z",
    4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
    5: "M 0,200 L 0,100 L 50,150 Z",
    6: "M 0,200 L 100,200 L 50,150 Z",
    7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
    8: "M 200,200 L 100,200 L 150,150 Z",
    9: "M 200,200 L 200,100 L 150,150 Z",
    10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
    11: "M 200,0 L 200,100 L 150,50 Z",
    12: "M 200,0 L 100,0 L 150,50 Z"
  };
  const LABEL_POS: Record<number, { x: number; y: number }> = {
    1: { x: 100, y: 45 }, 2: { x: 50, y: 16 }, 3: { x: 16, y: 50 }, 4: { x: 45, y: 100 },
    5: { x: 16, y: 150 }, 6: { x: 50, y: 184 }, 7: { x: 100, y: 155 }, 8: { x: 150, y: 184 },
    9: { x: 184, y: 150 }, 10: { x: 155, y: 100 }, 11: { x: 184, y: 50 }, 12: { x: 150, y: 16 }
  };

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`North Indian chart with house ${punyaHouse} highlighted`} style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x="0" y="0" width="200" height="200" fill="rgba(156, 122, 47, 0.04)" stroke={HAIRLINE} />
      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
        <path
          key={h}
          d={HOUSE_PATHS[h]}
          fill={h === punyaHouse ? GREEN_TINT : "transparent"}
          stroke={h === punyaHouse ? GREEN : HAIRLINE}
          strokeWidth={h === punyaHouse ? 2 : 1}
        />
      ))}
      {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
        <text key={h} x={LABEL_POS[h].x} y={LABEL_POS[h].y} textAnchor="middle" fill={h === punyaHouse ? GREEN : INK_MUTED} fontSize="10" fontWeight={600}>
          {h}
        </text>
      ))}
      {punyaHouse && (
        <g>
          <circle cx={LABEL_POS[punyaHouse].x} cy={LABEL_POS[punyaHouse].y - 18} r="10" fill={GREEN} />
          <text x={LABEL_POS[punyaHouse].x} y={LABEL_POS[punyaHouse].y - 14} textAnchor="middle" fill="#fff" fontSize="8" fontWeight={700}>P</text>
        </g>
      )}
    </svg>
  );
}

function OrbGauge({ punya, aspect }: { punya: number; aspect: { planet: string; deg: number; orb: number; exact?: boolean; note: string } }) {
  const maxOrb = 20;
  const offset = normalize(aspect.deg - punya);
  const signedOffset = offset > 180 ? offset - 360 : offset;
  const scaled = Math.max(-maxOrb, Math.min(maxOrb, signedOffset));
  const percent = ((scaled + maxOrb) / (maxOrb * 2)) * 100;
  const orbLimit = aspect.planet === "Mars" ? 8 : 9;
  const leftLimit = (( -orbLimit + maxOrb) / (maxOrb * 2)) * 100;
  const rightLimit = ((orbLimit + maxOrb) / (maxOrb * 2)) * 100;

  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{aspect.planet}</span>
        <span style={{ fontSize: "0.85rem", color: aspect.exact ? GOLD : INK_MUTED }}>
          {aspect.exact ? "Exact 0.00° conjunction" : `${aspect.orb.toFixed(1)}° separation`}
        </span>
        {aspect.exact ? (
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: GOLD, background: GOLD_TINT, padding: "0.2rem 0.5rem", borderRadius: "999px" }}>EXACT</span>
        ) : Math.abs(signedOffset) <= orbLimit ? (
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: GREEN, background: GREEN_TINT, padding: "0.2rem 0.5rem", borderRadius: "999px" }}>WITHIN ORB</span>
        ) : (
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: INK_MUTED, background: MUTED_TINT, padding: "0.2rem 0.5rem", borderRadius: "999px" }}>OUTSIDE ORB</span>
        )}
      </div>
      <div style={{ position: "relative", height: "34px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.08)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: `${leftLimit}%`, right: `${100 - rightLimit}%`, top: 0, bottom: 0, background: GREEN_TINT }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: GOLD, transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: `${percent}%`, top: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: aspect.exact ? GOLD : Math.abs(signedOffset) <= orbLimit ? GREEN : INK_MUTED, border: "2px solid #fff" }} />
        </div>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{aspect.note}</p>
    </div>
  );
}

function ConvergenceDashboard({ layers, verdict, verdictText }: { layers: Example["layers"]; verdict: Example["verdict"]; verdictText: string }) {
  const items: { key: keyof Example["layers"]; label: string; status: LayerStatus; text: string }[] = [
    { key: "saham", label: "Saham finding", status: layers.saham, text: layers.sahamText },
    { key: "yogas", label: "16 Tajika yogas", status: layers.yogas, text: layers.yogasText },
    { key: "muntha", label: "Munthā placement", status: layers.muntha, text: layers.munthaText },
    { key: "planetary", label: "Planetary positions", status: layers.planetary, text: layers.planetaryText },
    { key: "natal", label: "Natal Parasari context", status: layers.natal, text: layers.natalText }
  ];

  const verdictColor = verdict === "STRONG" ? GREEN : verdict === "PARTIAL" ? AMBER : VERMILION;

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem" }}>
        {items.map(({ key, label, status, text }) => (
          <div key={key} style={{ ...cardStyle, borderColor: layerColor(status), background: tintForColor(layerColor(status)) }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
              {status === "support" ? <CheckCircle2 size={16} color={GREEN} /> : status === "silent" ? <MinusCircle size={16} color={INK_MUTED} /> : <AlertCircle size={16} color={AMBER} />}
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: layerColor(status), textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, borderColor: verdictColor, background: tintForColor(verdictColor) }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
          {verdict === "NO-HIT" ? <XCircle size={18} color={verdictColor} /> : <CheckCircle2 size={18} color={verdictColor} />}
          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: verdictColor }}>Verdict: {verdict} CONVERGENCE</span>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>{verdictText}</p>
      </div>
    </div>
  );
}

function ValueBox({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", border: `1px solid ${HAIRLINE}`, textAlign: "center" }}>
      <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
      <p style={{ margin: "0.25rem 0 0", color: INK_PRIMARY, fontWeight: 600 }}>{value}</p>
    </div>
  );
}

function layerColor(status: LayerStatus): string {
  switch (status) {
    case "support": return GREEN;
    case "silent": return INK_MUTED;
    case "unavailable": return AMBER;
    default: return INK_MUTED;
  }
}

function domainColor(index: number): string {
  const colors = [BLUE, GREEN, GOLD, VERMILION, PURPLE, AMBER, "#2E8B8B", "#8B4513", "#708090", "#556B2F"];
  return colors[index % colors.length];
}

function tintForColor(color: string): string {
  switch (color) {
    case BLUE: return BLUE_TINT;
    case GREEN: return GREEN_TINT;
    case GOLD: return GOLD_TINT;
    case VERMILION: return VERMILION_TINT;
    case PURPLE: return PURPLE_TINT;
    case AMBER: return AMBER_TINT;
    case "#2E8B8B": return TEAL_TINT;
    case "#8B4513": return BROWN_TINT;
    case "#708090": return SLATE_TINT;
    case "#556B2F": return OLIVE_TINT;
    default: return MUTED_TINT;
  }
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "start", gap: "0.55rem", padding: "0.65rem", borderRadius: "8px", background: tintForColor(color), border: `1px solid ${color}` }}>
      <span style={{ color, marginTop: "0.1rem" }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.4 }}>{body}</p>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "12px",
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: GOLD_DEEP,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 0.35rem"
};

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.45rem 0.75rem",
    borderRadius: "999px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? tintForColor(color) : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 150ms ease"
  };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.5rem 0.85rem",
    borderRadius: "8px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? tintForColor(color) : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer"
  };
}
