"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  GraduationCap,
  Home,
  Layers,
  Lightbulb,
  RotateCcw,
  Scale,
  Sparkles,
  Sun,
  User,
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
const GREEN = grahas.budha.primary;
const VERMILION = ink.vermilionAccent;
const BLUE = grahas.shukra.primary;

type TabKey = "ladder" | "karakas" | "four-step" | "ketu";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ladder", label: "Top of the ladder" },
  { key: "karakas", label: "Dual kārakas" },
  { key: "four-step", label: "Four-step reading" },
  { key: "ketu", label: "Ketu's shape" },
];

const TIERS = [
  {
    house: 4,
    title: "Foundational schooling",
    icon: Home,
    focus: "Primary and secondary education; the base a student stands on.",
  },
  {
    house: 5,
    title: "Applied intellect",
    icon: Lightbulb,
    focus: "Judgment, creative application, turning knowledge into results.",
  },
  {
    house: 9,
    title: "Higher learning & guru",
    icon: GraduationCap,
    focus: "University, advanced study, and the dharma-guru transmission.",
  },
];

const QUESTIONS = [
  { id: "q1", text: "Will my child do well in primary school?", answer: 4 },
  { id: "q2", text: "Is this the right PhD supervisor for me?", answer: 9 },
  { id: "q3", text: "Can the native act decisively on what they know?", answer: 5 },
  { id: "q4", text: "Should I pursue postgraduate study abroad?", answer: 9 },
  { id: "q5", text: "How was the native's early schooling environment?", answer: 4 },
];

const KARAKAS = [
  {
    key: "sun",
    name: "Sun",
    devanagari: "सूर्य",
    color: grahas.surya.primary,
    facet: "Father / authority facet",
    chart: "Sun sits in the 12th house, in its own sign Leo.",
    reading:
      "The father-figure is capable and present in himself, but his influence on higher learning operates at a remove rather than through close, hands-on guidance.",
  },
  {
    key: "jupiter",
    name: "Jupiter",
    devanagari: "गुरु",
    color: grahas.guru.primary,
    facet: "Dharma / guru facet",
    chart: "Jupiter sits in the 7th house, in its own sign Pisces.",
    reading:
      "A robust personal orientation toward dharma, wisdom, and meaning — even where the specific guru-relationship may be unconventional.",
  },
];

const STEPS = [
  {
    key: "sign-lord",
    title: "Sign on the 9th and its lord",
    icon: Scale,
    detail: "The 9th house from Virgo Lagna is Taurus, ruled by Venus. Venus sits in the 2nd house in its own sign Libra.",
    implication:
      "A dignified 9th lord, well-placed. Venus is also a co-former of the chart's Sarasvatī yoga, linking higher-learning strength to the whole module's learning arc.",
  },
  {
    key: "occupants",
    title: "Occupant of the 9th",
    icon: CircleDot,
    detail: "Ketu occupies the 9th in Taurus.",
    implication:
      "Ketu shapes the form: detachment from convention, a self-directed or research-oriented path, perhaps less closeness to a single orthodox guru-lineage.",
  },
  {
    key: "aspects",
    title: "Aspects on the 9th",
    icon: Layers,
    detail: "No remaining graha casts a classical aspect onto Taurus from its Chart E1 position.",
    implication:
      "The reading rests on the lord-and-occupant picture alone; no additional reinforcing or complicating aspect layer is present.",
  },
  {
    key: "karaka",
    title: "Dual kārakas independently",
    icon: Sun,
    detail: "Sun (father facet) is own-sign in the 12th; Jupiter (dharma/guru facet) is own-sign in the 7th.",
    implication:
      "Read separately first: paternal support is real but distant; personal dharma-orientation is strong and angular. Then combine with §1–§3.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function NinthHouseHigherLearningWorkbench() {
  const [tab, setTab] = useState<TabKey>("ladder");

  function reset() {
    setTab("ladder");
  }

  return (
    <div
      data-interactive="ninth-house-higher-learning-workbench"
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
            9th house — higher learning
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Higher learning & dharma-guru workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the top tier of the education scheme, the dual Sun/Jupiter kārakas, and how Ketu shapes a strong
            9th house without negating it.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="9th-house higher-learning sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "ladder" && <LadderTab />}
      {tab === "karakas" && <KarakasTab />}
      {tab === "four-step" && <FourStepTab />}
      {tab === "ketu" && <KetuTab />}
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

function LadderTab() {
  const [activeTier, setActiveTier] = useState<number | null>(9);
  const [judgments, setJudgments] = useState<Record<string, number | null>>({});

  function judge(id: string, answer: number) {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Top of the three-tier ladder
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The 9th house completes the education scheme. Click each tier to see its focus.
        </p>

        <div className="mt-4 space-y-3">
          {TIERS.map((tier) => {
            const Icon = tier.icon;
            const active = activeTier === tier.house;
            return (
              <button
                key={tier.house}
                type="button"
                onClick={() => setActiveTier(tier.house)}
                className="w-full rounded-lg p-3 text-left"
                style={{
                  background: active ? wash(GOLD, "18") : SURFACE_2,
                  border: `1px solid ${active ? GOLD : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs"
                    style={{ background: active ? GOLD : INK_MUTED, color: "#fff", fontWeight: 600 }}
                  >
                    {tier.house}
                  </span>
                  <div>
                    <p className="m-0 text-sm" style={{ color: active ? GOLD : INK_PRIMARY, fontWeight: 600 }}>
                      <Icon size={14} className="mr-1 inline" aria-hidden="true" />
                      {tier.title}
                    </p>
                    <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>{tier.focus}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Question router</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Route each client question to the correct education tier.
        </p>
        <div className="mt-3 space-y-2">
          {QUESTIONS.map((q) => {
            const judged = judgments[q.id];
            const correct = judged === q.answer;
            return (
              <div
                key={q.id}
                className="rounded-lg p-2"
                style={{
                  background: judged !== undefined && judged !== null ? (correct ? wash(GREEN, "10") : wash(VERMILION, "10")) : "transparent",
                  border: `1px solid ${judged !== undefined && judged !== null ? (correct ? wash(GREEN, "55") : wash(VERMILION, "55")) : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.5 }}>{q.text}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {TIERS.map((t) => {
                    const selected = judged === t.house;
                    return (
                      <button
                        key={t.house}
                        type="button"
                        disabled={judged !== undefined && judged !== null}
                        onClick={() => judge(q.id, t.house)}
                        className="rounded px-2 py-1 text-xs"
                        style={{
                          background: selected ? GOLD : SURFACE,
                          border: `1px solid ${selected ? GOLD : HAIRLINE}`,
                          color: selected ? "#1A1408" : INK_SECONDARY,
                          fontWeight: 500,
                          opacity: judged !== undefined && judged !== null && !selected ? 0.5 : 1,
                        }}
                      >
                        {t.house}th
                      </button>
                    );
                  })}
                </div>
                {judged !== undefined && judged !== null && (
                  <p className="m-0 mt-1 text-sm" style={{ color: correct ? GREEN : VERMILION, lineHeight: 1.5 }}>
                    {correct ? "Correct." : `This belongs to the ${q.answer}th house.`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

function KarakasTab() {
  const [active, setActive] = useState<string | null>("jupiter");
  const current = KARAKAS.find((k) => k.key === active);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Two kārakas, two facets
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The 9th is a dual-kāraka house. Read the Sun and Jupiter independently before combining them.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {KARAKAS.map((k) => {
            const Icon = k.key === "sun" ? Sun : Sparkles;
            const isActive = active === k.key;
            return (
              <button
                key={k.key}
                type="button"
                onClick={() => setActive(k.key)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: isActive ? wash(k.color, "18") : SURFACE_2,
                  border: `1px solid ${isActive ? k.color : HAIRLINE}`,
                  color: INK_PRIMARY,
                  fontWeight: 500,
                }}
              >
                <span className="flex items-center gap-2">
                  <Icon size={18} style={{ color: k.color }} aria-hidden="true" />
                  <span style={{ color: isActive ? k.color : INK_PRIMARY, fontWeight: 600 }}>
                    {k.name} <span style={{ fontFamily: fontFamilies.display }}>({k.devanagari})</span>
                  </span>
                </span>
                <p className="m-0 mt-2" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>{k.facet}</p>
              </button>
            );
          })}
        </div>

        {current && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{ background: wash(current.color, "12"), border: `1px solid ${wash(current.color, "55")}` }}
          >
            <p className="m-0 text-sm" style={{ color: current.color, fontWeight: 600 }}>{current.name} in Chart E1</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{current.chart}</p>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <span style={{ color: current.color, fontWeight: 500 }}>Facet reading:</span> {current.reading}
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <User size={18} style={{ color: grahas.surya.primary }} aria-hidden="true" />
          <Sparkles size={18} style={{ color: grahas.guru.primary }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>Combined reading</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Together: paternal/authority support is real but distant; personal dharma-guru orientation is strong and
          angular. Both are then shaped by Ketu&apos;s unconventional occupancy and Venus&apos;s structural strength.
        </p>
        <div className="mt-3 rounded-lg p-2 text-sm" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}`, color: INK_SECONDARY, lineHeight: 1.55 }}>
          Do not average the two kārakas into one score. Keep their distinct facets visible until the final synthesis.
        </div>
      </aside>
    </div>
  );
}

function FourStepTab() {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const Icon = current.icon;

  function next() {
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function prev() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Four-step reading on Chart E1
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The 9th uses the standard four steps, extended to read both kārakas independently before combining.
        </p>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm"
            style={{
              background: SURFACE_2,
              border: `1px solid ${HAIRLINE}`,
              color: INK_SECONDARY,
              fontWeight: 500,
              opacity: step === 0 ? 0.5 : 1,
            }}
          >
            <ChevronLeft size={16} aria-hidden="true" /> Previous
          </button>
          <span className="text-xs" style={{ color: INK_MUTED, fontWeight: 500 }}>
            Step {step + 1} of {STEPS.length}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={step === STEPS.length - 1}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm"
            style={{
              background: SURFACE_2,
              border: `1px solid ${HAIRLINE}`,
              color: INK_SECONDARY,
              fontWeight: 500,
              opacity: step === STEPS.length - 1 ? 0.5 : 1,
            }}
          >
            Next <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>

        <div
          className="mt-4 rounded-lg p-4"
          style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}
        >
          <div className="flex items-center gap-2">
            <Icon size={18} style={{ color: GOLD }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>{current.title}</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.6 }}>{current.detail}</p>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            <span style={{ color: GREEN, fontWeight: 500 }}>Reading implication:</span> {current.implication}
          </p>
        </div>

        {step === STEPS.length - 1 && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{ background: wash(GREEN, "10"), border: `1px solid ${wash(GREEN, "55")}` }}
          >
            <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Synthesis</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Chart E1&apos;s 9th is genuinely strong at the structural level — dignified Venus lord and strong Jupiter
              — but takes an atypical shape: Ketu points toward unconventional, self-directed higher learning, and the
              Sun in the 12th places paternal support at a remove.
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Chart E1 snapshot</p>
        <HouseSnapshot step={step} />
      </aside>
    </div>
  );
}

function HouseSnapshot({ step }: { step: number }) {
  return (
    <div className="mt-3 flex flex-col items-center">
      <svg viewBox="0 0 300 240" className="w-full" style={{ maxHeight: 280 }} aria-label="9th house higher learning snapshot">
        {/* Lagna */}
        <rect x={20} y={160} width={60} height={50} rx={8} fill={wash(BLUE, "12")} stroke={BLUE} strokeWidth={1.5} />
        <text x={50} y={180} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>Lagna</text>
        <text x={50} y={198} textAnchor="middle" fontSize={12} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>कन्या</tspan>
        </text>

        {/* 2nd house Venus */}
        <rect x={160} y={160} width={80} height={55} rx={8} fill={wash(BLUE, "12")} stroke={BLUE} strokeWidth={step >= 0 ? 2.5 : 1.5} />
        <text x={200} y={180} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>2nd house</text>
        <circle cx={200} cy={192} r={5} fill={grahas.shukra.primary} />
        <text x={200} y={208} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Venus</text>

        {/* 7th house Jupiter */}
        <rect x={210} y={20} width={80} height={55} rx={8} fill={wash(GREEN, "12")} stroke={GREEN} strokeWidth={step >= 3 ? 2.5 : 1.5} />
        <text x={250} y={40} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>7th house</text>
        <circle cx={250} cy={52} r={5} fill={grahas.guru.primary} />
        <text x={250} y={68} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Jupiter</text>

        {/* 9th house Ketu */}
        <rect x={40} y={20} width={90} height={80} rx={8} fill={wash(grahas.ketu.primary, "10")} stroke={grahas.ketu.primary} strokeWidth={step >= 1 ? 2.5 : 1.5} />
        <text x={85} y={42} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>9th house</text>
        <text x={85} y={62} textAnchor="middle" fontSize={13} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>वृष</tspan> (Taurus)
        </text>
        <circle cx={85} cy={80} r={7} fill={grahas.ketu.primary} />
        <text x={85} y={96} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Ketu</text>

        {/* Venus arrow to 9th */}
        {step >= 0 && (
          <path d="M 175 160 Q 150 110 115 100" fill="none" stroke={BLUE} strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#arrow-blue)" />
        )}

        {/* Jupiter arrow to 9th */}
        {step >= 3 && (
          <path d="M 215 55 Q 150 55 120 55" fill="none" stroke={GREEN} strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#arrow-green)" />
        )}

        {/* 12th house Sun */}
        <rect x={120} y={160} width={0} height={0} />
        <text x={90} y={185} textAnchor="middle" fontSize={10} fill={INK_MUTED} fontWeight={500}>
          Sun in 12th
        </text>
        <circle cx={90} cy={175} r={4} fill={grahas.surya.primary} />

        <defs>
          <marker id="arrow-blue" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={BLUE} />
          </marker>
          <marker id="arrow-green" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} />
          </marker>
        </defs>

        {step === 0 && (
          <text x={145} y={130} textAnchor="middle" fontSize={11} fill={BLUE} fontWeight={500}>
            9th lord → own sign
          </text>
        )}
        {step === 1 && (
          <text x={85} y={12} textAnchor="middle" fontSize={11} fill={grahas.ketu.primary} fontWeight={500}>
            Ketu occupant
          </text>
        )}
        {step === 2 && (
          <text x={85} y={12} textAnchor="middle" fontSize={11} fill={INK_MUTED} fontWeight={500}>
            No aspects
          </text>
        )}
        {step === 3 && (
          <text x={200} y={120} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={500}>
            Dual kārakas read separately
          </text>
        )}
      </svg>
    </div>
  );
}

function KetuTab() {
  const [hasKetu, setHasKetu] = useState(true);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4 & §6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Ketu shapes, it does not negate
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Toggle Ketu in and out of the 9th house to see how the same strong structural signature changes its expression.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setHasKetu(true)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: hasKetu ? grahas.ketu.primary : SURFACE_2,
              border: `1px solid ${hasKetu ? grahas.ketu.primary : HAIRLINE}`,
              color: hasKetu ? "#fff" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            With Ketu in the 9th
          </button>
          <button
            type="button"
            onClick={() => setHasKetu(false)}
            className="rounded-lg px-3 py-2 text-sm"
            style={{
              background: !hasKetu ? GOLD : SURFACE_2,
              border: `1px solid ${!hasKetu ? GOLD : HAIRLINE}`,
              color: !hasKetu ? "#1A1408" : INK_SECONDARY,
              fontWeight: 500,
            }}
          >
            Without Ketu in the 9th
          </button>
        </div>

        <div
          className="mt-4 rounded-lg p-3"
          style={{
            background: hasKetu ? wash(grahas.ketu.primary, "12") : wash(GOLD, "12"),
            border: `1px solid ${hasKetu ? wash(grahas.ketu.primary, "55") : wash(GOLD, "55")}`,
          }}
        >
          <p className="m-0 text-sm" style={{ color: hasKetu ? grahas.ketu.primary : GOLD, fontWeight: 600 }}>
            {hasKetu ? "Strong but atypical" : "Strong and conventional"}
          </p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {hasKetu
              ? "The native has genuine higher-learning capability (dignified Venus lord, strong Jupiter), but the path is likely unconventional, self-directed, or research-oriented rather than a standard institutional track with a single guru."
              : "With Ketu removed, the same dignified Venus and strong Jupiter would read as a more conventional, smoothly-supported higher-learning path — but this would miss the actual chart's honest complication."}
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Discipline check</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          A &ldquo;difficult-sounding&rdquo; occupant is read for the *character* it lends the house, not translated
          automatically into good or bad.
        </p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Ketu does not cancel Venus or Jupiter.</li>
          <li>It changes the *shape* of how that strength expresses.</li>
          <li>The four-step method prevents single-factor verdicts.</li>
        </ul>
      </aside>
    </div>
  );
}
