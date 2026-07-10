"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  MapPinned,
  RotateCcw,
  Scale,
  School,
  ShieldCheck,
  XCircle,
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
const CORAL = grahas.mangala.primary;
const MAROON = grahas.ketu.primary;
const SAFFRON = grahas.guru.primary;

type ScenarioKey = "learning" | "admissions" | "career" | "curriculum";
type OptionStatus = "overreach" | "neglect" | "balanced";

interface Option {
  label: string;
  text: string;
  status: OptionStatus;
  feedback: string;
}

interface Scenario {
  key: ScenarioKey;
  title: string;
  icon: ReactNode;
  professional: string;
  context: string;
  options: Option[];
}

const SCENARIOS: Scenario[] = [
  {
    key: "learning",
    title: "Learning/developmental assessment",
    icon: <BrainCircuit size={18} />,
    professional: "Educational psychologist or relevant clinician",
    context: "A parent asks: 'Does the chart show whether my child has ADHD or dyslexia?'",
    options: [
      {
        label: "Replacement overreach",
        text: "Point to a Mercury affliction and say the chart itself indicates dyslexia, so a formal assessment is unnecessary.",
        status: "overreach",
        feedback: "This diagnoses a clinical condition from the chart. No technique in this module can do that. Route the parent to an educational psychologist or clinician and keep the chart supplementary.",
      },
      {
        label: "Svadharma neglect",
        text: "Refuse to discuss the question at all, saying astrology has nothing useful to say about learning.",
        status: "neglect",
        feedback: "This abandons a legitimate astrological lens. The chart's aptitude tendencies can still support the parent's understanding once a proper evaluation is in place.",
      },
      {
        label: "Complement, not replace",
        text: "Acknowledge the chart-supported strengths already discussed, then urge a proper evaluation by an educational psychologist and offer the chart as a supplementary lens.",
        status: "balanced",
        feedback: "Correct. The astrological observation is preserved and placed in its proper, supporting role; the qualified professional is named clearly.",
      },
    ],
  },
  {
    key: "admissions",
    title: "Specific admission outcome",
    icon: <GraduationCap size={18} />,
    professional: "Admissions counsellor / the client's own academic record",
    context: "A client asks: 'Given my strong Tier 3 exam reading, will I get into [named university]?'",
    options: [
      {
        label: "Replacement overreach",
        text: "Say the strong domain finding means admission to that specific university is very likely.",
        status: "overreach",
        feedback: "A domain-level finding does not license a specific named outcome. Grades, essays, test scores, and the applicant pool are outside the chart's scope.",
      },
      {
        label: "Svadharma neglect",
        text: "Refuse to answer and withdraw the entire exam-outcome finding as irrelevant.",
        status: "neglect",
        feedback: "This discards a genuine, well-corroborated astrological observation. The client can still hear the domain-level finding while the specific-institution question is routed appropriately.",
      },
      {
        label: "Complement, not replace",
        text: "Restate the domain-level favourability honestly, then explain that a named institution's decision depends on non-astrological factors and route to an admissions counsellor.",
        status: "balanced",
        feedback: "Correct. The chart answers the domain; the specific outcome belongs to the client's record and a qualified admissions professional.",
      },
    ],
  },
  {
    key: "career",
    title: "Professional career counselling",
    icon: <BriefcaseBusiness size={18} />,
    professional: "Qualified career counsellor",
    context: "A client asks: 'So which exact career path should I choose?'",
    options: [
      {
        label: "Replacement overreach",
        text: "Use the Venus structural link to prescribe a single named profession such as 'design researcher'.",
        status: "overreach",
        feedback: "Tendencies are not job titles. Matching a person to a concrete career path requires labour-market knowledge, aptitude testing, and professional judgement beyond astrology.",
      },
      {
        label: "Svadharma neglect",
        text: "Say career questions belong only in T2-03 and refuse to discuss them here.",
        status: "neglect",
        feedback: "This under-uses the chart's legitimate capacity language. T2-03 extends the astrological picture but does not remove the need to communicate tendencies helpfully now.",
      },
      {
        label: "Complement, not replace",
        text: "Offer the chart's tendency categories as useful input, then route to a qualified career counsellor for concrete pathway decisions.",
        status: "balanced",
        feedback: "Correct. Astrology supplies capacity language; the career counsellor supplies matching expertise. T2-03 remains subject to the same discipline.",
      },
    ],
  },
  {
    key: "curriculum",
    title: "Curriculum/pedagogical decision",
    icon: <School size={18} />,
    professional: "Educators and clinicians",
    context: "A parent asks: 'Should my child be in a specialised, unstructured programme because of Ketu in the 9th?'",
    options: [
      {
        label: "Replacement overreach",
        text: "Advise the parent to reject conventional schooling and choose a fully unstructured homeschool curriculum based on the Ketu thread.",
        status: "overreach",
        feedback: "A character-level finding (unconventional, self-directed) is not a pathway-level prescription. Curriculum design belongs to educators and clinicians who know the child.",
      },
      {
        label: "Svadharma neglect",
        text: "Say curriculum choices are not astrological and offer no observation at all.",
        status: "neglect",
        feedback: "The chart's shape can usefully inform educators about the child's learning style, even if it cannot choose the programme.",
      },
      {
        label: "Complement, not replace",
        text: "Share the chart's self-directed learning shape with the educators, then leave the actual curriculum decision to them and any relevant clinicians.",
        status: "balanced",
        feedback: "Correct. Astrology supplies a descriptive input; the professionals who know the child's formal needs make the pedagogical decision.",
      },
    ],
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

function statusColor(status: OptionStatus) {
  if (status === "balanced") return GREEN;
  if (status === "overreach") return CORAL;
  return MAROON;
}

function statusIcon(status: OptionStatus) {
  if (status === "balanced") return <CheckCircle2 size={18} />;
  if (status === "overreach") return <XCircle size={18} />;
  return <AlertTriangle size={18} />;
}

export function EducationScopeOfCompetenceWorkbench() {
  const [active, setActive] = useState<ScenarioKey>("learning");
  const [selections, setSelections] = useState<Partial<Record<ScenarioKey, OptionStatus>>>({});

  function select(status: OptionStatus) {
    setSelections((prev) => ({ ...prev, [active]: status }));
  }

  function reset() {
    setSelections({});
    setActive("learning");
  }

  const current = SCENARIOS.find((s) => s.key === active)!;
  const selected = selections[active];
  const complete = SCENARIOS.every((s) => selections[s.key] === "balanced");

  return (
    <div
      data-interactive="education-scope-of-competence-workbench"
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
            When education questions exceed astrology
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Practise the four education-domain refer-out cases. Choose the response that keeps the chart in its proper
            supporting role without either overreaching or neglecting the astrological observation.
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

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Education competence scenarios">
        {SCENARIOS.map((s) => (
          <ScenarioButton key={s.key} active={active === s.key} onClick={() => setActive(s.key)} icon={s.icon}>
            {s.title}
          </ScenarioButton>
        ))}
      </nav>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
        <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <span style={{ color: GOLD }}>{current.icon}</span>
            <p className="m-0 text-xs uppercase" style={{ color: GOLD, fontWeight: 600 }}>§4.2 refer-out case</p>
          </div>
          <h3
            className="mt-1 text-lg"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            {current.title}
          </h3>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
            {current.context}
          </p>

          <div className="mt-4 space-y-3">
            {current.options.map((opt) => {
              const isSelected = selected === opt.status;
              return (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => select(opt.status)}
                  className="w-full rounded-lg p-3 text-left"
                  style={{
                    background: isSelected ? wash(statusColor(opt.status), "10") : SURFACE_2,
                    border: `1px solid ${isSelected ? statusColor(opt.status) : HAIRLINE}`,
                  }}
                >
                  <div className="flex items-center gap-2" style={{ color: statusColor(opt.status) }}>
                    {statusIcon(opt.status)}
                    <span className="text-sm" style={{ fontWeight: 600 }}>{opt.label}</span>
                  </div>
                  <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                    {opt.text}
                  </p>
                </button>
              );
            })}
          </div>

          {selected && (
            <div
              className="mt-4 rounded-lg p-3"
              style={{ background: wash(statusColor(selected), "10"), border: `1px solid ${wash(statusColor(selected), "55")}` }}
            >
              <div className="flex items-start gap-2">
                <span style={{ color: statusColor(selected), flexShrink: 0 }}>{statusIcon(selected)}</span>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
                  {current.options.find((o) => o.status === selected)?.feedback}
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="min-w-0 space-y-4">
          <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <MapPinned size={18} style={{ color: SAFFRON }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: SAFFRON, fontWeight: 600 }}>Routes to</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{current.professional}</strong>
            </p>
            <BoundaryScaleSvg status={selected} />
          </div>

          <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} style={{ color: GOLD }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Progress</p>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SCENARIOS.map((s) => {
                const sel = selections[s.key];
                return (
                  <span
                    key={s.key}
                    className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs"
                    style={{
                      background: sel === "balanced" ? wash(GREEN, "18") : sel ? wash(statusColor(sel), "18") : SURFACE,
                      border: `1px solid ${sel === "balanced" ? GREEN : sel ? statusColor(sel) : HAIRLINE}`,
                      color: sel === "balanced" ? GREEN : sel ? statusColor(sel) : INK_MUTED,
                      fontWeight: 500,
                    }}
                  >
                    {sel === "balanced" ? <CheckCircle2 size={12} /> : sel ? statusIcon(sel) : <Scale size={12} />}
                    {s.title}
                  </span>
                );
              })}
            </div>
            {complete && (
              <p className="m-0 mt-3 text-sm" style={{ color: GREEN }}>
                All four cases answered with the complement-not-replace discipline.
              </p>
            )}
          </div>

          <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <div className="flex items-center gap-2">
              <BookOpen size={18} style={{ color: GOLD }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Bhagavad Gītā 3.35</p>
            </div>
            <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              śreyān svadharmo viguṇaḥ paradharmāt svanuṣṭhitāt | svadharme nidhanaṁ śreyaḥ paradharmo
              bhayāvahaḥ ||
            </p>
            <p className="m-0 mt-1 text-xs" style={{ color: INK_MUTED, lineHeight: 1.5 }}>
              The daivajña&apos;s svadharma is chart-interpretation; clinical diagnosis, admissions decisions, career
              counselling, and curriculum choices are paradharma without separate qualification.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ScenarioButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      <span style={{ color: active ? "#1A1408" : GOLD }}>{icon}</span>
      {children}
    </button>
  );
}

function BoundaryScaleSvg({ status }: { status?: OptionStatus }) {
  let chartWeight = 0;
  let profWeight = 0;
  let message = "Select a response to see the balance.";
  if (status === "balanced") {
    chartWeight = 30;
    profWeight = 60;
    message = "Chart supports; qualified professional leads.";
  } else if (status === "overreach") {
    chartWeight = 70;
    profWeight = 10;
    message = "Chart is overweighted — replacement overreach.";
  } else if (status === "neglect") {
    chartWeight = 5;
    profWeight = 0;
    message = "Chart contribution neglected.";
  }

  const max = Math.max(chartWeight, profWeight, 1);
  const chartH = (chartWeight / max) * 50;
  const profH = (profWeight / max) * 50;
  const centerY = 80;
  const leftBarX = 90;
  const rightBarX = 210;

  return (
    <svg viewBox="0 0 320 130" role="img" aria-label="Balance between astrological observation and qualified professional" style={{ width: "100%", maxHeight: 150, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="90" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <line x1="160" y1={centerY} x2="160" y2="35" stroke={INK_MUTED} strokeWidth="2" />
      <line x1={leftBarX} y1={centerY} x2={rightBarX} y2={centerY} stroke={INK_MUTED} strokeWidth="2" />

      <circle cx="160" cy="35" r="4" fill={GOLD} />

      <rect x={leftBarX - 18} y={centerY - chartH} width="36" height={chartH} rx="4" fill={wash(GOLD, "25")} stroke={GOLD} strokeWidth="1.5" />
      <text x={leftBarX} y={centerY - chartH - 6} textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={600}>Chart</text>

      <rect x={rightBarX - 18} y={centerY - profH} width="36" height={profH} rx="4" fill={wash(SAFFRON, "25")} stroke={SAFFRON} strokeWidth="1.5" />
      <text x={rightBarX} y={centerY - profH - 6} textAnchor="middle" fill={SAFFRON} fontSize="9" fontWeight={600}>Professional</text>

      <text x="160" y="112" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>{message}</text>
    </svg>
  );
}
