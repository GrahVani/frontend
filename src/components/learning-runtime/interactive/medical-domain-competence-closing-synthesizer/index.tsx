"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Baby,
  CheckCircle2,
  Circle,
  GitMerge,
  GraduationCap,
  HeartPulse,
  Hourglass,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Skull,
  Stethoscope,
  Target,
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
const VERMILION = ink.vermilionAccent;
const GREEN = grahas.budha.primary;
const PURPLE = grahas.shani.primary;

type TabKey = "axes" | "throughline" | "classifier" | "pledge";

const TABS: { key: TabKey; label: string }[] = [
  { key: "axes", label: "The two axes" },
  { key: "throughline", label: "Chapter throughline" },
  { key: "classifier", label: "Claim classifier" },
  { key: "pledge", label: "Closing pledge" },
];

const AXES_STANCES = [
  {
    key: "module7",
    label: "Module 7 stance",
    depth: "high",
    license: "zero",
    color: GREEN,
    text: "Deep classical technique held with zero medical / predictive license.",
    examples: [
      "Read health houses with depth",
      "Hold longevity figures in absolute silence",
      "Route active distress to appropriate care",
    ],
  },
  {
    key: "overclaim",
    label: "Dangerous overclaim",
    depth: "any",
    license: "high",
    color: VERMILION,
    text: "Using real or pretend technique to diagnose, prognose, or predict death.",
    examples: [
      "Predict when a client will die",
      "Diagnose a disease from the chart",
      "Claim a dasha will cause a medical outcome",
    ],
  },
  {
    key: "shallow",
    label: "Shallow but safe",
    depth: "low",
    license: "zero",
    color: INK_MUTED,
    text: "Low technique with low license — unimpressive but not harmful.",
    examples: [
      "Generic disclaimers without real study",
      "Refusing to speak without understanding why",
    ],
  },
  {
    key: "pop",
    label: "Pop-astrology hubris",
    depth: "low",
    license: "high",
    color: PURPLE,
    text: "High confidence and high claims without the technique to earn them.",
    examples: [
      "Sun-sign health predictions",
      "Social-media certainty about medical timing",
    ],
  },
];

const CHAPTERS = [
  {
    number: 1,
    title: "Health houses",
    icon: HeartPulse,
    technique: "Read the health-relevant houses with real depth.",
    boundary: "Depth of house-reading is not a diagnosis.",
  },
  {
    number: 2,
    title: "Bālāriṣṭa",
    icon: Baby,
    technique: "Identify and correctly cancel Bālāriṣṭa configurations.",
    boundary: "Near-total non-disclosure default.",
  },
  {
    number: 3,
    title: "Longevity computation",
    icon: Hourglass,
    technique: "Compute longevity by three independent classical methods.",
    boundary: "Absolute figure-silence.",
  },
  {
    number: 4,
    title: "Maraka",
    icon: Skull,
    technique: "Identify maraka planets and grade severity honestly.",
    boundary: "Caution window, not pronouncement.",
  },
  {
    number: 5,
    title: "Jaimini & KP longevity",
    icon: GitMerge,
    technique: "Apply Jaimini and KP longevity doctrine.",
    boundary: "Honest handling of unresolved source disagreement.",
  },
  {
    number: 6,
    title: "Contextualisation",
    icon: Stethoscope,
    technique: "Contextualise a known medical condition within chart vocabulary.",
    boundary: "Contextualisation-not-diagnosis.",
  },
  {
    number: 7,
    title: "Synthesis & ethics",
    icon: Scale,
    technique: "Synthesise everything into one coherent internal picture.",
    boundary: "Death-prediction prohibition and medical-routing discipline.",
  },
];

type CategoryKey = "competence" | "medical-overclaim" | "predictive-overclaim" | "silence";

const CATEGORIES: Record<CategoryKey, { label: string; color: string; description: string }> = {
  competence: {
    label: "Genuine astrology competence",
    color: GREEN,
    description: "Real technique exercised within its proper boundary.",
  },
  "medical-overclaim": {
    label: "Medical overclaim — refer out",
    color: VERMILION,
    description: "Claims medical knowledge the practitioner does not have.",
  },
  "predictive-overclaim": {
    label: "Predictive overclaim — prohibited",
    color: PURPLE,
    description: "Predicts course, onset, resolution, or death.",
  },
  silence: {
    label: "Appropriate silence",
    color: INK_MUTED,
    description: "Deliberately withholds what is outside astrology's scope.",
  },
};

const CLAIMS = [
  {
    id: "c1",
    text: "I can read the health-relevant houses with real depth.",
    category: "competence" as const,
    rationale: "This is exactly the competence the module built in Chapter 1.",
  },
  {
    id: "c2",
    text: "Your chart confirms the liver diagnosis your doctor mentioned.",
    category: "medical-overclaim" as const,
    rationale: "The chart cannot confirm a medical diagnosis; that is the physician's domain.",
  },
  {
    id: "c3",
    text: "I will hold all longevity figures in absolute silence.",
    category: "silence" as const,
    rationale: "Chapter 3's discipline: compute internally, disclose nothing numerical.",
  },
  {
    id: "c4",
    text: "This maraka window makes death likely within the year.",
    category: "predictive-overclaim" as const,
    rationale: "Maraka analysis shapes tone; it must never become a death pronouncement.",
  },
  {
    id: "c5",
    text: "Jaimini and KP give different timing signals here, so I will not manufacture a single confident answer.",
    category: "competence" as const,
    rationale: "Honest handling of source disagreement is Chapter 5's real competence.",
  },
  {
    id: "c6",
    text: "The dasha suggests this is a good window to schedule your follow-up, not to skip it.",
    category: "competence" as const,
    rationale: "Timing sensitivity that reinforces, rather than replaces, medical care.",
  },
  {
    id: "c7",
    text: "I do not comment on prognosis; that belongs to your physician.",
    category: "silence" as const,
    rationale: "Clear, appropriate silence around a medical determination.",
  },
  {
    id: "c8",
    text: "Your recovery will begin after Saturn leaves this rāśi.",
    category: "predictive-overclaim" as const,
    rationale: "Predicting the onset or resolution of a medical condition is outside scope.",
  },
];

const PLEDGE_ITEMS = [
  {
    key: "physician",
    text: "A physician diagnoses, treats, and determines prognosis; I do not.",
  },
  {
    key: "axes",
    text: "Technical depth and predictive / medical license are different axes.",
  },
  {
    key: "trust",
    text: "Bounded competence strengthens trust; overclaimed competence fails when tested.",
  },
  {
    key: "throughline",
    text: "This module's restraint was one throughline, stated seven times.",
  },
];

const SLOKA = {
  devanagari: "स्वकलासीमां विद्वान् ज्योतिर्विद् सम्यगाचरेत।\nतस्याः सीमातिरिक्तं तु न वदेत् नैव कल्पयेत्॥",
  iast: "sva-kalā-sīmāṁ vidvān jyotirvid samyag ācaret |\ntasyāḥ sīmātiriktaṁ tu na vadet naiva kalpayet ||",
  english:
    "The wise astrologer should rightly practise within the boundary of their own art. Beyond that boundary, let them neither speak nor presume.",
};

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function MedicalDomainCompetenceClosingSynthesizer() {
  const [tab, setTab] = useState<TabKey>("axes");

  function reset() {
    setTab("axes");
  }

  return (
    <div
      data-interactive="medical-domain-competence-closing-synthesizer"
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
            Scope of competence
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            The medical domain, firmly bounded
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the difference between genuine classical competence and medical or predictive overclaim, and carry
            the module&apos;s closing statement forward.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Medical-domain competence sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "axes" && <AxesTab />}
      {tab === "throughline" && <ThroughlineTab />}
      {tab === "classifier" && <ClassifierTab />}
      {tab === "pledge" && <PledgeTab />}
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

function AxesTab() {
  const [activeStance, setActiveStance] = useState<string | null>("module7");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1 & §4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Two separate axes
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Technical depth and predictive / medical license are not the same thing. This module maximised the first while
          holding the second at zero.
        </p>

        <div className="mt-4 space-y-2">
          {AXES_STANCES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setActiveStance(s.key)}
              className="w-full rounded-lg p-3 text-left text-sm"
              style={{
                background: activeStance === s.key ? wash(s.color, "18") : SURFACE_2,
                border: `1px solid ${activeStance === s.key ? s.color : HAIRLINE}`,
                color: INK_PRIMARY,
                fontWeight: 500,
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: s.color }}
                  aria-hidden="true"
                />
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <AxesSvg activeStance={activeStance} />
        {activeStance && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: wash(AXES_STANCES.find((s) => s.key === activeStance)!.color, "12"),
              border: `1px solid ${wash(AXES_STANCES.find((s) => s.key === activeStance)!.color, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: AXES_STANCES.find((s) => s.key === activeStance)!.color, fontWeight: 600 }}>
              {AXES_STANCES.find((s) => s.key === activeStance)!.label}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {AXES_STANCES.find((s) => s.key === activeStance)!.text}
            </p>
            <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              {AXES_STANCES.find((s) => s.key === activeStance)!.examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function AxesSvg({ activeStance }: { activeStance: string | null }) {
  const width = 320;
  const height = 280;
  const pad = 36;
  const cx = width / 2;
  const cy = height - pad - 20;
  const rightX = width - pad;
  const topY = pad;

  const positions: Record<string, { x: number; y: number }> = {
    module7: { x: rightX - 30, y: cy },
    overclaim: { x: cx, y: topY + 30 },
    shallow: { x: pad + 30, y: cy },
    pop: { x: rightX - 30, y: topY + 30 },
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ maxHeight: 320 }}
      aria-label="Two-axis diagram: technical depth versus predictive medical license"
    >
      <defs>
        <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 z" fill={INK_MUTED} />
        </marker>
      </defs>
      {/* axes */}
      <line x1={pad} y1={cy} x2={rightX + 6} y2={cy} stroke={INK_MUTED} strokeWidth={1.5} markerEnd="url(#arrow-head)" />
      <line x1={pad} y1={cy} x2={pad} y2={topY - 6} stroke={INK_MUTED} strokeWidth={1.5} markerEnd="url(#arrow-head)" />
      {/* axis labels */}
      <text x={(pad + rightX) / 2} y={height - 8} textAnchor="middle" fontSize={12} fill={INK_SECONDARY} fontWeight={500}>
        Classical technical depth →
      </text>
      <text
        x={14}
        y={height / 2}
        textAnchor="middle"
        fontSize={12}
        fill={INK_SECONDARY}
        fontWeight={500}
        transform={`rotate(-90, 14, ${height / 2})`}
      >
        Predictive / medical license ↑
      </text>
      {/* quadrant labels */}
      <text x={pad + 10} y={cy - 10} fontSize={11} fill={INK_MUTED} fontWeight={500}>
        low depth / low license
      </text>
      <text x={rightX - 10} y={cy - 10} textAnchor="end" fontSize={11} fill={INK_MUTED} fontWeight={500}>
        deep technique
      </text>
      <text x={pad + 10} y={topY + 16} fontSize={11} fill={INK_MUTED} fontWeight={500}>
        shallow disclaimer
      </text>
      <text x={rightX - 10} y={topY + 16} textAnchor="end" fontSize={11} fill={INK_MUTED} fontWeight={500}>
        pop-astrology hubris
      </text>

      {/* stance markers */}
      {AXES_STANCES.map((s) => {
        const pos = positions[s.key];
        const isActive = activeStance === s.key;
        return (
          <g key={s.key} style={{ cursor: "pointer" }} onClick={() => {}}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 9 : 6}
              fill={s.color}
              stroke="#fff"
              strokeWidth={2}
              opacity={activeStance && !isActive ? 0.35 : 1}
            />
            {isActive && (
              <text x={pos.x} y={pos.y - 14} textAnchor="middle" fontSize={11} fill={s.color} fontWeight={600}>
                {s.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function ThroughlineTab() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          One throughline, stated seven times
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Every chapter taught real technique and then bounded it. Click a chapter to see what was taught and how it was
          bounded.
        </p>

        <div className="relative mt-4 space-y-3 pl-5">
          <div
            className="absolute left-[1.15rem] top-3 bottom-3 w-px"
            style={{ background: HAIRLINE }}
            aria-hidden="true"
          />
          {CHAPTERS.map((ch) => {
            const Icon = ch.icon;
            const isOpen = open === ch.number;
            return (
              <div key={ch.number} className="relative">
                <div
                  className="absolute -left-5 top-3 flex h-5 w-5 items-center justify-center rounded-full text-xs"
                  style={{ background: GOLD, color: "#1A1408", fontWeight: 600 }}
                >
                  {ch.number}
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : ch.number)}
                  className="w-full rounded-lg p-3 text-left"
                  style={{
                    background: isOpen ? wash(GOLD, "12") : SURFACE_2,
                    border: `1px solid ${isOpen ? GOLD : HAIRLINE}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: GOLD }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{ch.title}</span>
                  </div>
                  {isOpen && (
                    <div className="mt-2 space-y-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                      <p className="m-0">
                        <span style={{ color: GREEN, fontWeight: 500 }}>Technique:</span> {ch.technique}
                      </p>
                      <p className="m-0">
                        <span style={{ color: VERMILION, fontWeight: 500 }}>Boundary:</span> {ch.boundary}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Target size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>The pattern</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The module never added a new technique without also adding its boundary. That pairing is the discipline.
        </p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>Real depth earns professional respect.</li>
          <li>Clear boundaries earn durable trust.</li>
          <li>One without the other is either dangerous or unimpressive.</li>
        </ul>
      </aside>
    </div>
  );
}

function ClassifierTab() {
  const [judgments, setJudgments] = useState<Record<string, CategoryKey | null>>({});

  function judge(id: string, category: CategoryKey) {
    setJudgments((prev) => ({ ...prev, [id]: category }));
  }

  const done = CLAIMS.every((c) => judgments[c.id] !== undefined && judgments[c.id] !== null);
  const correctCount = CLAIMS.filter((c) => judgments[c.id] === c.category).length;

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2 & §4.5</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Classify the claim
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Each statement is either genuine astrology competence, a medical overclaim, a predictive overclaim, or
          appropriate silence. Choose the category that best fits.
        </p>

        {done && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: wash(correctCount === CLAIMS.length ? GREEN : GOLD, "12"),
              border: `1px solid ${wash(correctCount === CLAIMS.length ? GREEN : GOLD, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: correctCount === CLAIMS.length ? GREEN : GOLD, fontWeight: 500 }}>
              {correctCount === CLAIMS.length
                ? "All claims classified correctly."
                : `${correctCount} of ${CLAIMS.length} correct — review the rationales below.`}
            </p>
          </div>
        )}

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {CLAIMS.map((c) => {
            const judgment = judgments[c.id];
            const answered = judgment !== undefined && judgment !== null;
            const correct = answered && judgment === c.category;
            return (
              <div
                key={c.id}
                className="rounded-lg p-3"
                style={{
                  background: answered ? (correct ? wash(GREEN, "10") : wash(VERMILION, "10")) : SURFACE_2,
                  border: `1px solid ${answered ? (correct ? wash(GREEN, "55") : wash(VERMILION, "55")) : HAIRLINE}`,
                }}
              >
                <p className="m-0 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{c.text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => {
                    const selected = judgment === cat;
                    const meta = CATEGORIES[cat];
                    return (
                      <button
                        key={cat}
                        type="button"
                        disabled={answered}
                        onClick={() => judge(c.id, cat)}
                        className="rounded-lg px-2 py-1 text-xs"
                        style={{
                          background: selected ? meta.color : SURFACE,
                          border: `1px solid ${selected ? meta.color : HAIRLINE}`,
                          color: selected ? "#fff" : INK_SECONDARY,
                          fontWeight: 500,
                          opacity: answered && !selected ? 0.5 : 1,
                        }}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <p className="m-0 mt-2 text-sm" style={{ color: correct ? GREEN : VERMILION, lineHeight: 1.55 }}>
                    {correct ? "Correct. " : `This is ${CATEGORIES[c.category].label.toLowerCase()}. `}
                    {c.rationale}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function PledgeTab() {
  const [slokaMode, setSlokaMode] = useState<"devanagari" | "iast" | "english">("devanagari");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allChecked = PLEDGE_ITEMS.every((item) => checked[item.key]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.5 & §5</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Closing statement
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          A physician diagnoses, treats, and determines prognosis. A Vedic astrologer, however deep their technical
          mastery, does none of these things — and knows that this is the practice done correctly.
        </p>

        <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex flex-wrap gap-2">
            {(["devanagari", "iast", "english"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSlokaMode(mode)}
                className="rounded-lg px-3 py-1.5 text-xs"
                style={{
                  background: slokaMode === mode ? GOLD : SURFACE,
                  border: `1px solid ${slokaMode === mode ? GOLD : HAIRLINE}`,
                  color: slokaMode === mode ? "#1A1408" : INK_SECONDARY,
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="mt-3 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {slokaMode === "devanagari" && (
              <p
                className="m-0"
                style={{
                  fontFamily: fontFamilies.display,
                  fontSize: "1.15rem",
                  lineHeight: 1.6,
                }}
              >
                {SLOKA.devanagari}
              </p>
            )}
            {slokaMode === "iast" && <p className="m-0" style={{ fontFamily: fontFamilies.literarySerif }}>{SLOKA.iast}</p>}
            {slokaMode === "english" && <p className="m-0">{SLOKA.english}</p>}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {PLEDGE_ITEMS.map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-start gap-3 rounded-lg p-3"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
            >
              <span className="mt-0.5 shrink-0">
                {checked[item.key] ? (
                  <CheckCircle2 size={18} style={{ color: GREEN }} aria-hidden="true" />
                ) : (
                  <Circle size={18} style={{ color: INK_MUTED }} aria-hidden="true" />
                )}
              </span>
              <input
                type="checkbox"
                checked={!!checked[item.key]}
                onChange={(e) => setChecked((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                className="sr-only"
              />
              <span className="text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.55 }}>{item.text}</span>
            </label>
          ))}
        </div>

        {allChecked && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{ background: wash(GREEN, "12"), border: `1px solid ${wash(GREEN, "55")}` }}
          >
            <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 500 }}>
              Module 7 closing affirmation registered.
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              You have stated the boundary: deep classical competence, zero medical or predictive license, and the
              knowledge that this is the practice done correctly.
            </p>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <GraduationCap size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Why this matters</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          The śloka is offered as a composed teaching verse, not a verbatim scriptural quotation. It holds both halves
          together: real competence exercised rightly, and a clear refusal to speak beyond it.
        </p>
        <div className="mt-3 flex items-start gap-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <ShieldCheck size={16} style={{ color: GREEN }} className="mt-0.5 shrink-0" aria-hidden="true" />
          Bounded competence produces trust that survives being tested.
        </div>
        <div className="mt-2 flex items-start gap-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <ShieldAlert size={16} style={{ color: VERMILION }} className="mt-0.5 shrink-0" aria-hidden="true" />
          Overclaimed competence fails exactly when it matters most.
        </div>
      </aside>
    </div>
  );
}
