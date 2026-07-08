"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  BookOpen,
  List,
  Map,
  RotateCcw,
  Search,
  ShieldCheck,
  ShieldX,
  Siren,
  Target,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const SAFE = "#2F7D55";
const CAUTION = ink.vermilionAccent;

type TabKey = "roadmap" | "findings" | "router" | "sequence";

const TABS: { key: TabKey; label: string }[] = [
  { key: "roadmap", label: "Seven-lesson roadmap" },
  { key: "findings", label: "Chart H1 findings" },
  { key: "router", label: "Question router" },
  { key: "sequence", label: "Capability → restraint" },
];

const LESSONS = [
  {
    id: "7.7.1",
    title: "Overview",
    contribution: "Orientation to the chapter's two halves.",
    type: "orientation",
  },
  {
    id: "7.7.2",
    title: "Worked Synthesis: Overall vitality trend",
    contribution: "Master synthesis — every technique, one chart, one client question.",
    type: "synthesis",
  },
  {
    id: "7.7.3",
    title: "Worked Synthesis: Supporting a client through known illness",
    contribution: "Contextualisation discipline in a full, emotionally-realistic consultation.",
    type: "synthesis",
  },
  {
    id: "7.7.4",
    title: "The Death-Prediction Prohibition",
    contribution: "Absolute rule and scripted responses that operationalise it.",
    type: "ethics",
  },
  {
    id: "7.7.5",
    title: "The Medical-Routing Decision Tree",
    contribution: "When and how to route a client to medical care.",
    type: "operations",
  },
  {
    id: "7.7.6",
    title: "Consultation Handling for Active Medical Distress",
    contribution: "Trauma-informed handling for a live, present crisis.",
    type: "operations",
  },
  {
    id: "7.7.7",
    title: "Scope of Competence",
    contribution: "Where astrology's competence ends and medicine's begins.",
    type: "ethics",
  },
];

const TYPE_META: Record<string, { label: string; color: string; icon: typeof Activity }> = {
  orientation: { label: "Orientation", color: GOLD, icon: Map },
  synthesis: { label: "Synthesis", color: "#5A8AC8", icon: Search },
  ethics: { label: "Ethics", color: CAUTION, icon: ShieldX },
  operations: { label: "Operations", color: SAFE, icon: Siren },
};

const CHAPTER_FINDINGS = [
  {
    chapter: 1,
    title: "Constitution & houses",
    findings: [
      "1st/6th/8th/12th houses read for health signification",
      "Chart H1 constitution structurally sound",
      "8th/12th registers introduced at signification level only",
    ],
  },
  {
    chapter: 2,
    title: "Bālāriṣṭa",
    findings: ["No configuration matched", "Moon unafflicted, own sign"],
  },
  {
    chapter: 3,
    title: "Longevity computations",
    findings: [
      "Piṇḍāyu 70.909 solar years",
      "Aṁśāyu 68.326 solar years",
      "Naisargikāyu 56.738 solar years",
      "Primary method (Naisargikāyu) is the numerical outlier",
    ],
  },
  {
    chapter: 4,
    title: "Maraka",
    findings: [
      "Unamplified",
      "2nd lord Moon in own sign",
      "7th lord Jupiter exalted, conjunct Moon",
      "No association with dusthāna lords",
    ],
  },
  {
    chapter: 5,
    title: "Jaimini & KP",
    findings: [
      "Jaimini Rudra = Moon",
      "Maheśvara = Saturn (moderate confidence)",
      "KP Bhādhakeśa = Jupiter",
      "Saturn's KP sub-lord = Mars (mixed signal)",
    ],
  },
  {
    chapter: 6,
    title: "Disease-house mapping",
    findings: [
      "Clean Saturn/11th-house correspondence",
      "Bone-joint / calves-ankles theme",
      "Bounded by contextualisation-not-diagnosis discipline",
    ],
  },
];

const ROUTER_SCENARIOS = [
  {
    quote: "How's my health looking overall these days?",
    lesson: "7.7.2",
    label: "Overall vitality trend",
  },
  {
    quote: "Can you support me through my diagnosed illness?",
    lesson: "7.7.3",
    label: "Known-illness support",
  },
  {
    quote: "When will I die?",
    lesson: "7.7.4",
    label: "Death-prediction prohibition",
  },
  {
    quote: "Should I go to the doctor for this symptom?",
    lesson: "7.7.5",
    label: "Medical-routing decision tree",
  },
  {
    quote: "I'm in crisis right now — something is seriously wrong.",
    lesson: "7.7.6",
    label: "Active medical distress",
  },
  {
    quote: "What can astrology actually say about my body?",
    lesson: "7.7.7",
    label: "Scope of competence",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function HealthSynthesisOverviewMap() {
  const [tab, setTab] = useState<TabKey>("roadmap");

  function reset() {
    setTab("roadmap");
  }

  return (
    <div
      data-interactive="health-synthesis-overview-map"
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
            Chapter 7 overview
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            Health synthesis capstone map
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Orient to the seven-lesson structure, recall Chart H1&apos;s findings, and practise matching client questions
            to the right lesson.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Capstone overview sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "roadmap" && <RoadmapTab />}
      {tab === "findings" && <FindingsTab />}
      {tab === "router" && <RouterTab />}
      {tab === "sequence" && <SequenceTab />}
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

function RoadmapTab() {
  const [selected, setSelected] = useState<string>("7.7.1");
  const lesson = LESSONS.find((l) => l.id === selected) ?? LESSONS[0];
  const meta = TYPE_META[lesson.type];
  const Icon = meta.icon;

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
      <div className="space-y-2">
        {LESSONS.map((l) => {
          const active = l.id === selected;
          const m = TYPE_META[l.type];
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => setSelected(l.id)}
              className="w-full rounded-xl p-3 text-left"
              style={{
                background: active ? wash(m.color, "12") : SURFACE_2,
                border: `1px solid ${active ? m.color : HAIRLINE}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: m.color, fontWeight: 600 }}>{l.id}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{ background: wash(m.color, "18"), color: m.color, fontWeight: 500 }}
                >
                  {m.label}
                </span>
              </div>
              <p className="m-0 mt-1 text-sm" style={{ color: INK_PRIMARY, lineHeight: 1.4 }}>{l.title}</p>
            </button>
          );
        })}
      </div>

      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Icon size={20} style={{ color: meta.color }} aria-hidden="true" />
          <span className="text-xs uppercase" style={{ color: meta.color, fontWeight: 600 }}>{meta.label}</span>
        </div>
        <h3 className="mt-2 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          {lesson.id}: {lesson.title}
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>{lesson.contribution}</p>

        <div className="mt-4 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Why it matters</p>
          <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            {lesson.type === "orientation" && "Sets up the whole chapter so the syntheses and ethics lessons are read as one intentional structure."}
            {lesson.type === "synthesis" && "Demonstrates technical capability on a real client question before the closing restraint lessons."}
            {lesson.type === "ethics" && "States absolute limits that must override any technical pattern, however compelling."}
            {lesson.type === "operations" && "Gives concrete, repeatable procedures for situations where a client needs non-astrological care."}
          </p>
        </div>
      </section>
    </div>
  );
}

function FindingsTab() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.2</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Chart H1 findings across Chapters 1–6
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Click a chapter to recall its finding before moving to the syntheses.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTER_FINDINGS.map((c) => {
            const active = open === c.chapter;
            return (
              <button
                key={c.chapter}
                type="button"
                onClick={() => setOpen(active ? null : c.chapter)}
                className="rounded-xl p-4 text-left"
                style={{
                  background: active ? wash(GOLD, "12") : SURFACE_2,
                  border: `1px solid ${active ? GOLD : HAIRLINE}`,
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={16} style={{ color: active ? GOLD : INK_MUTED }} aria-hidden="true" />
                  <span className="text-xs uppercase" style={{ color: active ? GOLD : INK_MUTED, fontWeight: 600 }}>Chapter {c.chapter}</span>
                </div>
                <p className="m-0 mt-2 text-sm" style={{ color: INK_PRIMARY, fontWeight: 600 }}>{c.title}</p>
                {active && (
                  <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                    {c.findings.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function RouterTab() {
  const [index, setIndex] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const scenario = ROUTER_SCENARIOS[index];
  const correct = selectedLesson === scenario.lesson;

  function choose(lesson: string) {
    setSelectedLesson(lesson);
  }

  function next() {
    setSelectedLesson(null);
    setIndex((i) => (i + 1) % ROUTER_SCENARIOS.length);
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Match the client question to the right lesson
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Correctly identifying the situation is itself part of the discipline.
        </p>

        <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-base italic" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, lineHeight: 1.55 }}>
            &ldquo;{scenario.quote}&rdquo;
          </p>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {LESSONS.filter((l) => l.id !== "7.7.1").map((l) => {
            const selected = selectedLesson === l.id;
            return (
              <button
                key={l.id}
                type="button"
                disabled={selectedLesson !== null}
                onClick={() => choose(l.id)}
                className="rounded-lg p-3 text-left text-sm"
                style={{
                  background: selected ? (correct ? SAFE : CAUTION) : SURFACE_2,
                  border: `1px solid ${selected ? (correct ? SAFE : CAUTION) : HAIRLINE}`,
                  color: selected ? "#fff" : INK_SECONDARY,
                  fontWeight: 500,
                  opacity: selectedLesson !== null && !selected ? 0.55 : 1,
                }}
              >
                <span className="block text-xs" style={{ opacity: 0.85 }}>{l.id}</span>
                {l.title}
              </button>
            );
          })}
        </div>

        {selectedLesson !== null && (
          <div
            className="mt-4 rounded-lg p-3"
            style={{
              background: correct ? wash(SAFE, "10") : wash(CAUTION, "10"),
              border: `1px solid ${correct ? wash(SAFE, "55") : wash(CAUTION, "55")}`,
            }}
          >
            <p className="m-0 text-sm" style={{ color: correct ? SAFE : CAUTION, fontWeight: 500 }}>
              {correct ? "Correct match" : "Not the best fit"}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              This question points to <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{scenario.lesson}</strong> — {scenario.label}.
            </p>
            <button
              type="button"
              onClick={next}
              className="mt-3 rounded-lg px-3 py-2 text-sm"
              style={{ background: GOLD, color: "#1A1408", fontWeight: 500 }}
            >
              Next question
            </button>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>Clues</p>
        <ul className="m-0 mt-2 list-disc space-y-2 pl-5 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          <li>General vitality trend → synthesis</li>
          <li>Known, stable diagnosis → contextualisation support</li>
          <li>Death or life-span question → absolute prohibition</li>
          <li>Whether to seek care → routing decision tree</li>
          <li>Active, unfolding crisis → trauma-informed handling</li>
          <li>Boundary of astrology itself → scope of competence</li>
        </ul>
      </aside>
    </div>
  );
}

function SequenceTab() {
  return (
    <div className="grid min-w-0 gap-4">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3 className="mt-1 text-lg" style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}>
          Capability is demonstrated first, then bounded
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          This chapter inverts the common pattern of treating ethics as a footnote. The syntheses show what the toolkit
          can do; the closing lessons state, with final weight, what it must never do.
        </p>

        <div className="mt-4 overflow-x-auto rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <svg viewBox="0 0 720 200" className="h-auto w-full min-w-[560px]" role="img" aria-label="Synthesis then ethics sequence">
            <defs>
              <marker id="seqArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill={INK_MUTED} />
              </marker>
            </defs>

            {/* Synthesis block */}
            <rect x="40" y="60" width="220" height="80" rx="14" fill={wash("#5A8AC8", "18")} stroke="#5A8AC8" strokeWidth="1.5" />
            <text x="150" y="92" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              Synthesis lessons
            </text>
            <text x="150" y="112" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" style={{ fontFamily: fontFamilies.body }}>
              7.7.2 + 7.7.3
            </text>
            <text x="150" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
              capability on display
            </text>

            <line x1="270" y1="100" x2="320" y2="100" stroke={HAIRLINE} strokeWidth="2" markerEnd="url(#seqArrow)" />

            {/* Ethics/operations block */}
            <rect x="340" y="60" width="340" height="80" rx="14" fill={wash(CAUTION, "12")} stroke={CAUTION} strokeWidth="1.5" />
            <text x="510" y="92" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              Ethics + operations lessons
            </text>
            <text x="510" y="112" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" style={{ fontFamily: fontFamilies.body }}>
              7.7.4 → 7.7.7
            </text>
            <text x="510" y="128" textAnchor="middle" fill={INK_MUTED} fontSize="9" style={{ fontFamily: fontFamilies.body }}>
              final, absolute restraint doctrine
            </text>

            {/* Closing brace */}
            <path d="M 700 70 Q 720 100 700 130" stroke={GOLD} strokeWidth="2" fill="none" />
            <text x="710" y="140" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600" style={{ fontFamily: fontFamilies.body }}>
              closing statement
            </text>
          </svg>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-lg p-3" style={{ background: wash("#5A8AC8", "10"), border: `1px solid ${wash("#5A8AC8", "55")}` }}>
            <div className="flex items-center gap-2">
              <Target size={16} style={{ color: "#5A8AC8" }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: "#5A8AC8", fontWeight: 600 }}>Show capability</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>The syntheses demonstrate the full toolkit on realistic questions.</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: wash(CAUTION, "10"), border: `1px solid ${wash(CAUTION, "55")}` }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} style={{ color: CAUTION }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: CAUTION, fontWeight: 600 }}>State limits</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>The ethics lessons make the boundary explicit and absolute.</p>
          </div>
          <div className="rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
            <div className="flex items-center gap-2">
              <List size={16} style={{ color: GOLD }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Provide procedures</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>The operations lessons give repeatable routing and handling steps.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
