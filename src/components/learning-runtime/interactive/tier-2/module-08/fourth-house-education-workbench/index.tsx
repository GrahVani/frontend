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
  Layers,
  Moon,
  RotateCcw,
  Scale,
  Sparkles,
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
const PURPLE = grahas.shani.primary;

type TabKey = "ladder" | "karaka" | "four-step" | "compare";

const TABS: { key: TabKey; label: string }[] = [
  { key: "ladder", label: "Three-tier ladder" },
  { key: "karaka", label: "Karaka selector" },
  { key: "four-step", label: "Four-step reading" },
  { key: "compare", label: "Compare readings" },
];

const TIERS = [
  {
    house: 2,
    title: "Earliest learning",
    focus: "Speech, first alphabet, the very beginning of formal instruction.",
    examples: [
      "Will my toddler start speaking on time?",
      "How did I first learn to read?",
    ],
  },
  {
    house: 4,
    title: "Foundational / middle schooling",
    focus: "Primary and secondary schooling — the structured base a student stands on.",
    examples: [
      "Will my child do well in school?",
      "How was my foundational schooling?",
    ],
  },
  {
    house: 9,
    title: "Higher learning",
    focus: "University, advanced study, dharma-guru transmission.",
    examples: [
      "Should I pursue a PhD?",
      "Is higher education indicated?",
    ],
  },
];

const KARAKAS = [
  {
    key: "moon",
    name: "Moon",
    devanagari: "चन्द्र",
    color: grahas.candra.primary,
    area: "Mother, emotional security, home, general 4th-house matters",
    educationNote: "Not the education-specific karaka. Using the Moon for a schooling question would read the wrong thread.",
  },
  {
    key: "mercury",
    name: "Mercury",
    devanagari: "बुध",
    color: grahas.budha.primary,
    area: "Education, speech, learning, intellect",
    educationNote: "The correct karaka for a foundational-education question in the 4th house.",
  },
  {
    key: "mars-saturn",
    name: "Mars / Saturn",
    devanagari: "मङ्गल / शनि",
    color: grahas.mangala.primary,
    area: "Land, property, immovable assets",
    educationNote: "Relevant for land and property questions, not schooling.",
  },
  {
    key: "venus",
    name: "Venus",
    devanagari: "शुक्र",
    color: grahas.shukra.primary,
    area: "Vehicles, comforts, luxuries",
    educationNote: "Relevant for vehicles and comforts, not schooling.",
  },
];

const STEPS = [
  {
    key: "sign-lord",
    title: "Sign on the 4th and its lord",
    icon: Scale,
    detail: "Sagittarius rises in the 4th. Its lord Jupiter sits in the 7th house, in its own sign Pisces — a kendra, and a genuinely strong placement.",
    implication: "The container of foundational schooling is structurally sound: resources, institutional support, and family investment are not the limiting factor.",
  },
  {
    key: "occupants",
    title: "Occupants of the 4th",
    icon: CircleDot,
    detail: "Saturn occupies the 4th house in Sagittarius, a neutral sign for Saturn.",
    implication: "A malefic occupant does not mean failure. It means the foundational years likely required real structure, discipline, and sustained effort rather than arriving effortlessly.",
  },
  {
    key: "aspects",
    title: "Aspects on the 4th",
    icon: Layers,
    detail: "No remaining graha casts a classical full aspect onto Sagittarius from these Chart E1 positions.",
    implication: "A clean aspect picture keeps the first two steps unmuddied. The absence of complicating aspects is itself a meaningful, positive fact.",
  },
  {
    key: "karaka",
    title: "Mercury's own condition",
    icon: GraduationCap,
    detail: "Mercury, the education-specific karaka, sits in the 1st house in Virgo at 15° — its own sign and exact classical exaltation degree.",
    implication: "Mercury is at peak classical strength in the native's own Lagna, indicating genuine intellectual aptitude for foundational learning.",
  },
];

const COMPARISON_CHARTS = [
  {
    key: "e1",
    label: "Chart E1",
    fourthSign: "Sagittarius",
    lord: "Jupiter in Pisces (own sign, 7th house)",
    occupant: "Saturn in Sagittarius (neutral sign)",
    aspects: "None",
    karaka: "Mercury exalted at 15° Virgo in Lagna",
    reading:
      "A genuinely capable, well-resourced foundational education realised through structure and sustained effort rather than unearned ease.",
  },
  {
    key: "example2",
    label: "Example 2 chart",
    fourthSign: "—",
    lord: "4th lord in the 12th house, in an enemy sign",
    occupant: "Debilitated Mars in the 4th",
    aspects: "No benefic aspect",
    karaka: "Mercury poorly placed / afflicted",
    reading:
      "Foundational schooling likely involved real obstacles — disrupted schooling, a difficult environment, or a harder road — honestly read as tendency, not fixed verdict.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function FourthHouseEducationWorkbench() {
  const [tab, setTab] = useState<TabKey>("ladder");

  function reset() {
    setTab("ladder");
  }

  return (
    <div
      data-interactive="fourth-house-education-workbench"
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
            4th house — foundational education
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Education reading workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the three-tier education scheme, isolate Mercury as the schooling karaka, and apply the four-step
            method to Chart E1.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="4th-house education sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "ladder" && <LadderTab />}
      {tab === "karaka" && <KarakaTab />}
      {tab === "four-step" && <FourStepTab />}
      {tab === "compare" && <CompareTab />}
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
  const [activeTier, setActiveTier] = useState<number | null>(4);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Three-tier education scheme
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Jyotiṣa does not read education as one undifferentiated topic. Click each rung to see which questions belong to
          which house.
        </p>

        <div className="mt-4 space-y-3">
          {TIERS.map((tier) => (
            <button
              key={tier.house}
              type="button"
              onClick={() => setActiveTier(tier.house)}
              className="w-full rounded-lg p-3 text-left"
              style={{
                background: activeTier === tier.house ? wash(GOLD, "18") : SURFACE_2,
                border: `1px solid ${activeTier === tier.house ? GOLD : HAIRLINE}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs"
                  style={{ background: activeTier === tier.house ? GOLD : INK_MUTED, color: "#fff", fontWeight: 600 }}
                >
                  {tier.house}
                </span>
                <span className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{tier.title}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {activeTier && (
          <>
            <LadderSvg activeHouse={activeTier} />
            <div className="mt-4">
              {TIERS.filter((t) => t.house === activeTier).map((tier) => (
                <div key={tier.house}>
                  <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>{tier.title}</p>
                  <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{tier.focus}</p>
                  <p className="m-0 mt-3 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Sample questions</p>
                  <ul className="m-0 mt-1 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                    {tier.examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function LadderSvg({ activeHouse }: { activeHouse: number }) {
  const rungs = [2, 4, 9];
  return (
    <svg viewBox="0 0 240 160" className="w-full" style={{ maxHeight: 180 }} aria-label="Three-tier education ladder">
      {/* vertical rail */}
      <line x1={60} y1={20} x2={60} y2={140} stroke={HAIRLINE} strokeWidth={4} strokeLinecap="round" />
      {rungs.map((h, idx) => {
        const y = 130 - idx * 45;
        const isActive = h === activeHouse;
        return (
          <g key={h}>
            <rect
              x={80}
              y={y - 14}
              width={140}
              height={28}
              rx={6}
              fill={isActive ? GOLD : "transparent"}
              stroke={isActive ? GOLD : HAIRLINE}
              strokeWidth={1.5}
            />
            <text
              x={150}
              y={y + 4}
              textAnchor="middle"
              fontSize={12}
              fill={isActive ? "#1A1408" : INK_SECONDARY}
              fontWeight={500}
            >
              {h}nd house — {TIERS.find((t) => t.house === h)?.title}
            </text>
            <circle cx={60} cy={y} r={isActive ? 8 : 5} fill={isActive ? GOLD : INK_MUTED} />
            <line x1={60} y1={y} x2={80} y2={y} stroke={isActive ? GOLD : HAIRLINE} strokeWidth={2} />
          </g>
        );
      })}
    </svg>
  );
}

function KarakaTab() {
  const [selected, setSelected] = useState<string | null>("mercury");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Let the question pick the karaka
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The 4th house has a multi-karaka pattern. For a schooling question, select the karaka that actually governs
          education.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {KARAKAS.map((k) => {
            const active = selected === k.key;
            return (
              <button
                key={k.key}
                type="button"
                onClick={() => setSelected(k.key)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: active ? wash(k.color, "18") : SURFACE_2,
                  border: `1px solid ${active ? k.color : HAIRLINE}`,
                  color: INK_PRIMARY,
                  fontWeight: 500,
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full text-xs" style={{ background: k.color, color: "#fff", fontWeight: 600 }}>
                    {k.name[0]}
                  </span>
                  <span style={{ color: active ? k.color : INK_PRIMARY, fontWeight: 600 }}>
                    {k.name} <span style={{ fontFamily: fontFamilies.display }}>({k.devanagari})</span>
                  </span>
                </span>
                <p className="m-0 mt-2" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{k.area}</p>
              </button>
            );
          })}
        </div>

        {selected && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: wash(KARAKAS.find((k) => k.key === selected)!.color, "12"),
              border: `1px solid ${wash(KARAKAS.find((k) => k.key === selected)!.color, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: KARAKAS.find((k) => k.key === selected)!.color, fontWeight: 600 }}>
              {selected === "mercury" ? "Correct choice for education" : "Not the education karaka"}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {KARAKAS.find((k) => k.key === selected)!.educationNote}
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Moon size={18} style={{ color: grahas.candra.primary }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: grahas.candra.primary, fontWeight: 600 }}>Common mistake</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Learners often default to the Moon because it is the 4th&apos;s primary karaka. For a schooling question, that
          reads mother and emotional security instead of education.
        </p>
        <div className="mt-3 flex items-start gap-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <GraduationCap size={16} style={{ color: GREEN }} className="mt-0.5 shrink-0" aria-hidden="true" />
          Mercury governs learning, speech, and intellect — the correct thread for foundational education.
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
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3 & §4.5</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Four-step reading on Chart E1
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Move through the four steps. Each step adds one layer to the final reading.
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
              A strongly dignified 4th lord and a maximally strong Mercury together indicate capable, well-resourced
              foundational schooling — with Saturn&apos;s occupancy as the honest note of structure and effort. Both
              threads are real; neither cancels the other.
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
      <svg viewBox="0 0 260 220" className="w-full" style={{ maxHeight: 240 }} aria-label="4th house education snapshot">
        {/* Lagna */}
        <rect x={20} y={140} width={60} height={50} rx={8} fill={wash(BLUE, "12")} stroke={BLUE} strokeWidth={1.5} />
        <text x={50} y={160} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>Lagna</text>
        <text x={50} y={178} textAnchor="middle" fontSize={12} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>कन्या</tspan>
        </text>
        <circle cx={50} cy={152} r={5} fill={grahas.budha.primary} />

        {/* 4th house */}
        <rect x={140} y={20} width={100} height={90} rx={8} fill={wash(PURPLE, "10")} stroke={PURPLE} strokeWidth={step >= 1 ? 2 : 1.5} />
        <text x={190} y={42} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>4th house</text>
        <text x={190} y={62} textAnchor="middle" fontSize={13} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>धनुः</tspan> (Sagittarius)
        </text>
        <circle cx={190} cy={82} r={6} fill={grahas.shani.primary} />
        <text x={190} y={98} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Saturn</text>

        {/* Lord arrow */}
        {step >= 0 && (
          <>
            <path d="M 160 75 Q 110 75 85 145" fill="none" stroke={GREEN} strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#arrow-green)" />
            <defs>
              <marker id="arrow-green" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} />
              </marker>
            </defs>
            <rect x={110} y={125} width={0} height={0} />
          </>
        )}

        {/* Jupiter in 7th */}
        <rect x={160} y={150} width={80} height={55} rx={8} fill={wash(GREEN, "12")} stroke={GREEN} strokeWidth={1.5} />
        <text x={200} y={170} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>7th house</text>
        <circle cx={200} cy={182} r={5} fill={grahas.guru.primary} />
        <text x={200} y={198} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Jupiter</text>

        {/* labels */}
        {step === 0 && (
          <text x={130} y={120} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={500}>
            4th lord → own sign, kendra
          </text>
        )}
        {step === 1 && (
          <text x={190} y={112} textAnchor="middle" fontSize={11} fill={PURPLE} fontWeight={500}>
            Malefic occupant = effort
          </text>
        )}
        {step === 2 && (
          <text x={190} y={112} textAnchor="middle" fontSize={11} fill={INK_MUTED} fontWeight={500}>
            No complicating aspects
          </text>
        )}
        {step === 3 && (
          <text x={70} y={135} textAnchor="middle" fontSize={11} fill={grahas.budha.primary} fontWeight={500}>
            Mercury exalted
          </text>
        )}
      </svg>
    </div>
  );
}

function CompareTab() {
  const [selected, setSelected] = useState<string>("e1");
  const chart = COMPARISON_CHARTS.find((c) => c.key === selected)!;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Compare two 4th-house readings
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The four-step method exists to distinguish a strong container with effort from a genuinely weaker picture.
          Toggle between Chart E1 and the lesson&apos;s Example 2.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {COMPARISON_CHARTS.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setSelected(c.key)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: selected === c.key ? GOLD : SURFACE_2,
                border: `1px solid ${selected === c.key ? GOLD : HAIRLINE}`,
                color: selected === c.key ? "#1A1408" : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          {[
            { label: "4th sign", value: chart.fourthSign },
            { label: "4th lord", value: chart.lord },
            { label: "Occupant", value: chart.occupant },
            { label: "Aspects", value: chart.aspects },
            { label: "Education karaka", value: chart.karaka },
          ].map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 rounded-lg p-2 sm:flex-row sm:gap-4"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
            >
              <span className="min-w-[120px] text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>{row.label}</span>
              <span className="text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div
          className="mt-4 rounded-lg p-3"
          style={{
            background: selected === "e1" ? wash(GREEN, "10") : wash(VERMILION, "10"),
            border: `1px solid ${selected === "e1" ? wash(GREEN, "55") : wash(VERMILION, "55")}`,
          }}
        >
          <p className="m-0 text-sm" style={{ color: selected === "e1" ? GREEN : VERMILION, fontWeight: 600 }}>
            Reading
          </p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{chart.reading}</p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Critical insight</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          House strength and occupant condition are read together, not collapsed into a single &ldquo;malefic present =
          bad&rdquo; shortcut.
        </p>
        <div className="mt-3 flex items-start gap-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <CheckCircle2 size={16} style={{ color: GREEN }} className="mt-0.5 shrink-0" aria-hidden="true" />
          Chart E1: effort inside a strong container.
        </div>
        <div className="mt-2 flex items-start gap-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <BookOpen size={16} style={{ color: VERMILION }} className="mt-0.5 shrink-0" aria-hidden="true" />
          Example 2: obstacle because the container itself is weakened.
        </div>
      </aside>
    </div>
  );
}
