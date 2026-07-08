"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
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

type TabKey = "domains" | "purva-punya" | "four-step" | "occupant";

const TABS: { key: TabKey; label: string }[] = [
  { key: "domains", label: "Three intelligences" },
  { key: "purva-punya", label: "Pūrva-puṇya reservoir" },
  { key: "four-step", label: "Four-step reading" },
  { key: "occupant", label: "Occupant style lab" },
];

const DOMAINS = [
  {
    key: "mercury",
    title: "Mercury",
    devanagari: "बुध",
    subtitle: "Raw mental faculty",
    icon: Lightbulb,
    color: grahas.budha.primary,
    description:
      "Processing speed, verbal and analytical capacity — the basic hardware of thought. A graha, not a house.",
    examples: [
      "Can the native learn languages quickly?",
      "Is the mind nimble with data and detail?",
    ],
  },
  {
    key: "fourth",
    title: "4th house",
    devanagari: "चतुर्थभाव",
    subtitle: "Foundational schooling container",
    icon: Home,
    color: grahas.candra.primary,
    description:
      "The institutional and emotional container in which formal schooling happens — primary and secondary education.",
    examples: [
      "Did the native have a supportive school environment?",
      "Was foundational schooling structured or disrupted?",
    ],
  },
  {
    key: "fifth",
    title: "5th house",
    devanagari: "पञ्चमभाव",
    subtitle: "Applied intellect & discernment",
    icon: Sparkles,
    color: GOLD,
    description:
      "The capacity to apply the mind well — judgment, creative application, turning knowledge into effective decisions.",
    examples: [
      "Can the native turn what they know into sound judgment?",
      "Is discernment decisive or hesitant under pressure?",
    ],
  },
];

const CLASSIFIER_ITEMS = [
  { id: "q1", text: "This native processes new information very quickly.", answer: "mercury" },
  { id: "q2", text: "The native's primary schooling was disciplined and well-resourced.", answer: "fourth" },
  { id: "q3", text: "When faced with a problem, the native acts decisively on a judgment.", answer: "fifth" },
  { id: "q4", text: "The native can explain complex ideas in clear language.", answer: "mercury" },
  { id: "q5", text: "The native's discernment is suited to competitive, technical fields.", answer: "fifth" },
];

const RESERVOIR_STATES = [
  {
    key: "strong",
    label: "Strong 5th house",
    level: 80,
    color: GREEN,
    summary: "Reservoir appears substantially full.",
    detail:
      "Applied intellect and discernment arrive relatively readily. Present effort still matters, but the native starts from a fuller store of past-life merit in this area.",
  },
  {
    key: "mixed",
    label: "Mixed 5th house",
    level: 50,
    color: GOLD,
    summary: "Reservoir is partially filled.",
    detail:
      "Some natural aptitude is present, but consistent present effort is needed to develop reliable applied judgment.",
  },
  {
    key: "weak",
    label: "Weak or afflicted 5th house",
    level: 20,
    color: VERMILION,
    summary: "Reservoir asks to be replenished.",
    detail:
      "Sharpening applied judgment may take deliberate, sustained work. This is a call to present effort, not a fixed ceiling or punishment.",
  },
];

const STEPS = [
  {
    key: "sign-lord",
    title: "Sign on the 5th and its lord",
    icon: Scale,
    detail: "The 5th house from Virgo Lagna is Capricorn, ruled by Saturn. Saturn sits in the 4th house in Sagittarius.",
    implication:
      "Applied intellect is structurally tied to the foundational-schooling process — discernment is built through the same disciplined, effortful process Saturn indicated in the 4th.",
  },
  {
    key: "occupants",
    title: "Occupants of the 5th",
    icon: CircleDot,
    detail: "Mars occupies the 5th in Capricorn, where it is exalted.",
    implication:
      "Exalted Mars gives sharp, competitive, decisive discernment — the capacity to act quickly and correctly on a judgment, especially in quantitative, technical, or fast-paced domains.",
  },
  {
    key: "aspects",
    title: "Aspects on the 5th",
    icon: Layers,
    detail: "No graha casts a classical full aspect onto Capricorn from its Chart E1 position.",
    implication:
      "A clean aspect picture leaves Mars's occupancy and Saturn's lordship-link as the two dominant, uncomplicated threads.",
  },
  {
    key: "karaka",
    title: "Jupiter's own condition",
    icon: GraduationCap,
    detail: "Jupiter, the 5th's karaka, sits in the 7th house in its own sign Pisces.",
    implication:
      "A strongly dignified karaka in a kendra reinforces the whole picture; Jupiter does double duty as the strong 4th lord and strong 5th karaka.",
  },
];

const OCCUPANTS = [
  {
    key: "mars",
    name: "Mars exalted",
    devanagari: "मङ्गल",
    color: grahas.mangala.primary,
    style: "Decisive, competitive, technical, fast-acting under pressure.",
    note: "This is Chart E1's actual occupant.",
  },
  {
    key: "mercury",
    name: "Mercury",
    devanagari: "बुध",
    color: grahas.budha.primary,
    style: "Analytical, communicative, quick-witted, detail-oriented discernment.",
    note: "Brings raw mental faculty into the applied arena.",
  },
  {
    key: "jupiter",
    name: "Jupiter",
    devanagari: "गुरु",
    color: grahas.guru.primary,
    style: "Broad, philosophical, generous, wise judgment; sees the larger pattern.",
    note: "Natural karaka of the 5th — doubly reinforcing.",
  },
  {
    key: "venus",
    name: "Venus",
    devanagari: "शुक्र",
    color: grahas.shukra.primary,
    style: "Harmonious, aesthetic, relational discernment; values balance.",
    note: "Turns applied intellect toward art, design, and negotiation.",
  },
  {
    key: "saturn",
    name: "Saturn",
    devanagari: "शनि",
    color: grahas.shani.primary,
    style: "Slow, disciplined, careful, methodical judgment built over time.",
    note: "Effortful but reliable; maturity improves results.",
  },
  {
    key: "sun",
    name: "Sun",
    devanagari: "सूर्य",
    color: grahas.surya.primary,
    style: "Authoritative, clear, leadership-oriented discernment; wants visibility.",
    note: "Decisive, but may dominate rather than collaborate.",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function FifthHouseIntellectWorkbench() {
  const [tab, setTab] = useState<TabKey>("domains");

  function reset() {
    setTab("domains");
  }

  return (
    <div
      data-interactive="fifth-house-intellect-workbench"
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
            5th house — applied intellect
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Intellect and discernment workbench
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Distinguish Mercury, the 4th, and the 5th; practise the pūrva-puṇya framing; and read Chart E1&apos;s 5th
            house step by step.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="5th-house intellect sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "domains" && <DomainsTab />}
      {tab === "purva-punya" && <PurvaPunyaTab />}
      {tab === "four-step" && <FourStepTab />}
      {tab === "occupant" && <OccupantTab />}
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

function DomainsTab() {
  const [active, setActive] = useState<string | null>("fifth");
  const [judgments, setJudgments] = useState<Record<string, string | null>>({});

  function judge(id: string, answer: string) {
    setJudgments((prev) => ({ ...prev, [id]: answer }));
  }

  const currentDomain = DOMAINS.find((d) => d.key === active);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Three distinct intelligences
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Mercury, the 4th house, and the 5th house can sound like one vague &ldquo;intelligence&rdquo; reading. Click
          each card to see how they differ.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {DOMAINS.map((d) => {
            const Icon = d.icon;
            const isActive = active === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setActive(d.key)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: isActive ? wash(d.color, "18") : SURFACE_2,
                  border: `1px solid ${isActive ? d.color : HAIRLINE}`,
                  color: INK_PRIMARY,
                  fontWeight: 500,
                }}
              >
                <Icon size={18} style={{ color: d.color }} aria-hidden="true" />
                <p className="m-0 mt-2" style={{ color: isActive ? d.color : INK_PRIMARY, fontWeight: 600 }}>
                  {d.title} <span style={{ fontFamily: fontFamilies.display }}>({d.devanagari})</span>
                </p>
                <p className="m-0 mt-1" style={{ color: INK_SECONDARY, lineHeight: 1.5 }}>{d.subtitle}</p>
              </button>
            );
          })}
        </div>

        {currentDomain && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: wash(currentDomain.color, "10"),
              border: `1px solid ${wash(currentDomain.color, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: currentDomain.color, fontWeight: 600 }}>{currentDomain.title}</p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{currentDomain.description}</p>
            <p className="m-0 mt-2 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Example questions</p>
            <ul className="m-0 mt-1 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {currentDomain.examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Quick classifier</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Classify each statement as Mercury, 4th house, or 5th house.
        </p>
        <div className="mt-3 space-y-2">
          {CLASSIFIER_ITEMS.map((item) => {
            const judged = judgments[item.id];
            const correct = judged === item.answer;
            return (
              <div
                key={item.id}
                className="rounded-lg p-2"
                style={{
                  background: judged ? (correct ? wash(GREEN, "10") : wash(VERMILION, "10")) : "transparent",
                  border: `1px solid ${judged ? (correct ? wash(GREEN, "55") : wash(VERMILION, "55")) : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.5 }}>{item.text}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {DOMAINS.map((d) => {
                    const selected = judged === d.key;
                    return (
                      <button
                        key={d.key}
                        type="button"
                        disabled={!!judged}
                        onClick={() => judge(item.id, d.key)}
                        className="rounded px-2 py-1 text-xs"
                        style={{
                          background: selected ? d.color : SURFACE,
                          border: `1px solid ${selected ? d.color : HAIRLINE}`,
                          color: selected ? "#fff" : INK_SECONDARY,
                          fontWeight: 500,
                          opacity: judged && !selected ? 0.5 : 1,
                        }}
                      >
                        {d.title}
                      </button>
                    );
                  })}
                </div>
                {judged && (
                  <p className="m-0 mt-1 text-sm" style={{ color: correct ? GREEN : VERMILION, lineHeight: 1.5 }}>
                    {correct ? "Correct." : `This belongs to the ${DOMAINS.find((d) => d.key === item.answer)?.title}.`}
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

function PurvaPunyaTab() {
  const [state, setState] = useState<string>("strong");
  const current = RESERVOIR_STATES.find((s) => s.key === state)!;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Pūrva-puṇya as a reservoir
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The 5th&apos;s signature doctrine reframes strength and weakness without fatalism. Select a reservoir state to
          see how to speak about it.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {RESERVOIR_STATES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setState(s.key)}
              className="rounded-lg px-3 py-2 text-sm"
              style={{
                background: state === s.key ? s.color : SURFACE_2,
                border: `1px solid ${state === s.key ? s.color : HAIRLINE}`,
                color: state === s.key ? "#fff" : INK_SECONDARY,
                fontWeight: 500,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <ReservoirSvg level={current.level} color={current.color} />
        </div>

        <div
          className="mt-4 rounded-lg p-3"
          style={{ background: wash(current.color, "12"), border: `1px solid ${wash(current.color, "55")}` }}
        >
          <p className="m-0 text-sm" style={{ color: current.color, fontWeight: 600 }}>{current.summary}</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{current.detail}</p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Avoid the fatalism trap</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          A weak 5th is never a fixed ceiling. It is an honest description of where present effort is most needed.
        </p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Strong 5th: full reservoir, still shaped by discipline.</li>
          <li>Weak 5th: replenishment through effort, not resignation.</li>
          <li>Both are read alongside the 4th-house effort-thread.</li>
        </ul>
      </aside>
    </div>
  );
}

function ReservoirSvg({ level, color }: { level: number; color: string }) {
  const height = 180;
  const width = 120;
  const waterY = height - 16 - (level / 100) * (height - 32);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ height: 200, width: 120 }} aria-label="Pūrva-puṇya reservoir">
      <rect x={10} y={10} width={width - 20} height={height - 20} rx={8} fill={wash(color, "10")} stroke={color} strokeWidth={2} />
      <rect x={14} y={waterY} width={width - 28} height={height - 24 - waterY} rx={4} fill={color} opacity={0.35} />
      <line x1={10} y1={height / 2} x2={width - 10} y2={height / 2} stroke={HAIRLINE} strokeWidth={1} strokeDasharray="4 2" />
      <text x={width / 2} y={24} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>
        full
      </text>
      <text x={width / 2} y={height - 10} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>
        empty
      </text>
      <text x={width / 2} y={height / 2 - 6} textAnchor="middle" fontSize={10} fill={INK_MUTED} fontWeight={500}>
        present effort
      </text>
    </svg>
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
          Move through the four steps. Each step adds one layer to the applied-intellect reading.
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
              Chart E1&apos;s 5th house shows genuinely strong applied intellect — exalted Mars gives sharp, decisive
              discernment; Saturn as 5th lord links it to disciplined foundational schooling; and strong Jupiter
              reinforces the whole. The Saturn thread means this shows as hard-won rather than effortless.
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
      <svg viewBox="0 0 280 230" className="w-full" style={{ maxHeight: 260 }} aria-label="5th house applied intellect snapshot">
        {/* Lagna */}
        <rect x={20} y={150} width={60} height={50} rx={8} fill={wash(BLUE, "12")} stroke={BLUE} strokeWidth={1.5} />
        <text x={50} y={170} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>Lagna</text>
        <text x={50} y={188} textAnchor="middle" fontSize={12} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>कन्या</tspan>
        </text>

        {/* 4th house */}
        <rect x={160} y={20} width={90} height={70} rx={8} fill={wash(PURPLE, "10")} stroke={PURPLE} strokeWidth={1.5} />
        <text x={205} y={40} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>4th house</text>
        <text x={205} y={58} textAnchor="middle" fontSize={12} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>धनुः</tspan>
        </text>
        <circle cx={205} cy={72} r={5} fill={grahas.shani.primary} />

        {/* 5th house */}
        <rect x={40} y={20} width={90} height={80} rx={8} fill={wash(grahas.mangala.primary, "10")} stroke={grahas.mangala.primary} strokeWidth={step >= 1 ? 2.5 : 1.5} />
        <text x={85} y={42} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>5th house</text>
        <text x={85} y={62} textAnchor="middle" fontSize={13} fill={INK_PRIMARY} fontWeight={600}>
          <tspan style={{ fontFamily: fontFamilies.display }}>मकर</tspan> (Capricorn)
        </text>
        <circle cx={85} cy={80} r={7} fill={grahas.mangala.primary} />
        <text x={85} y={96} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Mars</text>

        {/* Lord link 5th -> 4th */}
        {step >= 0 && (
          <path d="M 110 55 Q 140 30 165 55" fill="none" stroke={PURPLE} strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#arrow-purple)" />
        )}

        {/* 7th house Jupiter */}
        <rect x={180} y={140} width={80} height={55} rx={8} fill={wash(GREEN, "12")} stroke={GREEN} strokeWidth={1.5} />
        <text x={220} y={160} textAnchor="middle" fontSize={11} fill={INK_SECONDARY} fontWeight={600}>7th house</text>
        <circle cx={220} cy={172} r={5} fill={grahas.guru.primary} />
        <text x={220} y={188} textAnchor="middle" fontSize={10} fill={INK_SECONDARY} fontWeight={500}>Jupiter</text>

        {/* Jupiter arrow to 5th */}
        {step >= 3 && (
          <path d="M 185 165 Q 130 165 110 100" fill="none" stroke={GREEN} strokeWidth={1.5} strokeDasharray="4 2" markerEnd="url(#arrow-green)" />
        )}

        <defs>
          <marker id="arrow-purple" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={PURPLE} />
          </marker>
          <marker id="arrow-green" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} />
          </marker>
        </defs>

        {/* step labels */}
        {step === 0 && (
          <text x={140} y={16} textAnchor="middle" fontSize={11} fill={PURPLE} fontWeight={500}>
            5th lord → 4th house
          </text>
        )}
        {step === 1 && (
          <text x={85} y={12} textAnchor="middle" fontSize={11} fill={grahas.mangala.primary} fontWeight={500}>
            Exalted Mars occupant
          </text>
        )}
        {step === 2 && (
          <text x={85} y={12} textAnchor="middle" fontSize={11} fill={INK_MUTED} fontWeight={500}>
            No complicating aspects
          </text>
        )}
        {step === 3 && (
          <text x={150} y={200} textAnchor="middle" fontSize={11} fill={GREEN} fontWeight={500}>
            Strong Jupiter karaka
          </text>
        )}
      </svg>
    </div>
  );
}

function OccupantTab() {
  const [selected, setSelected] = useState<string>("mars");
  const occupant = OCCUPANTS.find((o) => o.key === selected)!;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4 & §8</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Occupant style lab
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The occupant&apos;s nature shapes the *style* of applied intellect, not just its strength. Toggle occupants to
          see how the reading changes.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {OCCUPANTS.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setSelected(o.key)}
              className="rounded-lg p-2 text-left text-sm"
              style={{
                background: selected === o.key ? wash(o.color, "18") : SURFACE_2,
                border: `1px solid ${selected === o.key ? o.color : HAIRLINE}`,
                color: INK_PRIMARY,
                fontWeight: 500,
              }}
            >
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ background: o.color }} aria-hidden="true" />
                <span style={{ color: selected === o.key ? o.color : INK_PRIMARY, fontWeight: 600 }}>
                  {o.name} <span style={{ fontFamily: fontFamilies.display }}>({o.devanagari})</span>
                </span>
              </span>
            </button>
          ))}
        </div>

        <div
          className="mt-4 rounded-lg p-3"
          style={{ background: wash(occupant.color, "12"), border: `1px solid ${wash(occupant.color, "55")}` }}
        >
          <p className="m-0 text-sm" style={{ color: occupant.color, fontWeight: 600 }}>{occupant.name}</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>
            <span style={{ fontWeight: 500 }}>Style of discernment:</span> {occupant.style}
          </p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>{occupant.note}</p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Critical insight</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          Dignity tells you how well the planet can perform; the planet&apos;s nature tells you *what* it performs.
          Exalted Mars and exalted Jupiter in the 5th would both be strong, but they would produce very different kinds
          of applied intellect.
        </p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Read dignity and nature together.</li>
          <li>Do not stop at &ldquo;strong 5th&rdquo;; name the style.</li>
          <li>Always relate the occupant back to the question asked.</li>
        </ul>
      </aside>
    </div>
  );
}
