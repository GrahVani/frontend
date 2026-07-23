"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  GitCompare,
  MessageSquareQuote,
  RefreshCcw,
  Route,
  Scale,
} from "lucide-react";

type TabKey = "narrative" | "case-file" | "convergence" | "client-question";
type StepKey = 0 | 1 | 2 | 3 | 4;
type AnswerKey = "settled" | "progress" | "honest" | null;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const TABS: Record<TabKey, { label: string; icon: typeof Route }> = {
  narrative: { label: "Chapter 4 narrative", icon: Route },
  "case-file": { label: "Case file", icon: Scale },
  convergence: { label: "Convergence", icon: GitCompare },
  "client-question": { label: "Client asks", icon: MessageSquareQuote },
};

const STEPS: Record<StepKey, { title: string; detail: string; color: string }> = {
  0: { title: "The question", detail: "Can RPP, repurposed from praśna to candidate birth moment, say anything useful?", color: BLUE },
  1: { title: "Classical answer", detail: "Yes — confirmatorily. Identical RP set across A/B/C; event-lords are members.", color: GREEN },
  2: { title: "Refined answer", detail: "Sub-lord breaks the tie: Rāhu (A), Jupiter (B), Mercury (C). B and C show overlap.", color: PURPLE },
  3: { title: "Honest limit", detail: "Trustworthy because candidates are well spaced; not a universal KP law.", color: GOLD },
  4: { title: "Synthesis", detail: "C stays excluded and untouched. B's lean over A strengthens; A remains plausible.", color: BLUE },
};

const CASE_STATUS = [
  { chapter: "Chapter 2", a: "plausible, tied", b: "plausible, tied", c: "excluded" },
  { chapter: "Chapter 3", a: "less favoured", b: "currently favoured", c: "excluded" },
  { chapter: "Chapter 4", a: "plausible, not excluded", b: "more strongly favoured", c: "excluded, untouched" },
];

const STATEMENTS = [
  { chapter: "Chapter 3", text: "Two of the three possible birth-time windows can now be set aside with reasonable confidence. Between the remaining two, current evidence leans toward the earlier of them, though this is not yet a final confirmation." },
  { chapter: "Chapter 4", text: "The same two possible birth-time windows remain live, and the lean toward the earlier one has strengthened — a second, independently-computed check now agrees with the first. This still isn't a final confirmation; the next stage will test this lean against the remaining methods." },
];

const ANSWERS: Record<Exclude<AnswerKey, null>, { label: string; text: string; correct: boolean; feedback: string }> = {
  settled: {
    label: "Overclaim",
    text: "Yes, we now know it is the earlier time.",
    correct: false,
    feedback: "This overstates two converging soft signals into certainty. The case is not yet settled.",
  },
  progress: {
    label: "Underclaim",
    text: "Nothing has really changed since last time.",
    correct: false,
    feedback: "This hides real progress. Two independent checks now agree, which is more than one.",
  },
  honest: {
    label: "Honest",
    text: "The lean is stronger, but it is still not a final confirmation.",
    correct: true,
    feedback: "Correct. It names the lean, names what strengthened it, and names its provisional status.",
  },
};

function NarrativeSvg({ step }: { step: StepKey }) {
  const items = Object.values(STEPS);
  return (
    <svg viewBox="0 0 620 150" role="img" aria-label="Chapter 4 narrative arc" style={{ width: "100%", maxHeight: 170, display: "block" }}>
      <rect x={10} y={10} width={600} height={130} rx={8} fill={`${STEPS[step].color}08`} stroke={HAIRLINE} />
      {items.map((s, i) => {
        const x = 70 + i * 110;
        const active = i <= step;
        return (
          <g key={s.title}>
            <circle cx={x} cy={55} r={22} fill={active ? s.color : `${INK_MUTED}33`} stroke={active ? s.color : HAIRLINE} strokeWidth={active ? 3 : 2} />
            <text x={x} y={60} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>{i + 1}</text>
            <text x={x} y={92} textAnchor="middle" fill={active ? INK_PRIMARY : INK_MUTED} fontSize={9} fontWeight={600}>{s.title}</text>
            {i < 4 && (
              <line x1={x + 26} y1={55} x2={x + 84} y2={55} stroke={active ? s.color : HAIRLINE} strokeWidth={active ? 3 : 2} strokeDasharray={active ? undefined : "6 4"} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function CaseFileSvg() {
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label="Case file status across chapters" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Candidate status across chapters</text>

      {CASE_STATUS.map((row, i) => {
        const y = 65 + i * 40;
        return (
          <g key={row.chapter}>
            <text x={80} y={y + 15} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>{row.chapter}</text>
            <circle cx={170} cy={y + 10} r={14} fill={row.a.includes("favoured") ? GOLD : `${INK_MUTED}22`} stroke={row.a.includes("favoured") ? GOLD : HAIRLINE} />
            <text x={170} y={y + 14} textAnchor="middle" fill={row.a.includes("favoured") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>A</text>
            <circle cx={230} cy={y + 10} r={14} fill={row.b.includes("favoured") ? GREEN : `${INK_MUTED}22`} stroke={row.b.includes("favoured") ? GREEN : HAIRLINE} />
            <text x={230} y={y + 14} textAnchor="middle" fill={row.b.includes("favoured") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>B</text>
            <circle cx={290} cy={y + 10} r={14} fill={row.c.includes("excluded") ? VERMILION : `${INK_MUTED}22`} stroke={row.c.includes("excluded") ? VERMILION : HAIRLINE} />
            <text x={290} y={y + 14} textAnchor="middle" fill={row.c.includes("excluded") ? "#fff" : INK_SECONDARY} fontSize={9} fontWeight={600}>C</text>
          </g>
        );
      })}

      <text x={230} y={170} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>C unchanged; B&apos;s lead grows; A stays plausible</text>
    </svg>
  );
}

function ConvergenceSvg() {
  return (
    <svg viewBox="0 0 460 200" role="img" aria-label="Three independent signals converge" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={440} height={180} rx={8} fill={`${PURPLE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Independent convergence</text>

      <circle cx={100} cy={90} r={34} fill={`${BLUE}22`} stroke={BLUE} strokeWidth={2} />
      <text x={100} y={86} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Ch 2</text>
      <text x={100} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>house lords</text>

      <circle cx={230} cy={90} r={34} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={230} y={86} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Ch 3</text>
      <text x={230} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>tattva</text>

      <circle cx={360} cy={90} r={34} fill={`${PURPLE}22`} stroke={PURPLE} strokeWidth={2} />
      <text x={360} y={86} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>Ch 4</text>
      <text x={360} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>sub-lord</text>

      <path d="M 138 90 C 170 90, 190 60, 210 70" fill="none" stroke={HAIRLINE} strokeWidth={2} />
      <path d="M 268 90 C 300 90, 270 60, 250 70" fill="none" stroke={HAIRLINE} strokeWidth={2} />

      <text x={230} y={158} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>Two independent signals now favour B</text>
      <text x={230} y={175} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Still not a verdict — A remains plausible</text>
    </svg>
  );
}

function ClientQuestionSvg({ answer }: { answer: AnswerKey }) {
  const color = answer ? (ANSWERS[answer].correct ? GREEN : VERMILION) : INK_MUTED;
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Client question scenario" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${color}08`} stroke={HAIRLINE} />
      <text x={230} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>&quot;Does that mean you now know it&apos;s the earlier time?&quot;</text>

      <circle cx={80} cy={90} r={28} fill={INK_MUTED} />
      <text x={80} y={96} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>Client</text>

      <path d="M 115 90 L 175 90" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="167,84 177,90 167,96" fill={INK_MUTED} />

      <rect x={190} y={60} width={240} height={60} rx={6} fill={SURFACE} stroke={color} />
      <text x={310} y={82} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>
        {answer ? ANSWERS[answer].text : "Choose the honest answer"}
      </text>
      <text x={310} y={102} textAnchor="middle" fill={INK_MUTED} fontSize={10}>
        {answer ? (ANSWERS[answer].correct ? "Direct, bounded" : "Review feedback") : "..."}
      </text>
    </svg>
  );
}

export function WorkedExampleKpRppWalkthrough() {
  const [activeTab, setActiveTab] = useState<TabKey>("narrative");
  const [step, setStep] = useState<StepKey>(0);
  const [answer, setAnswer] = useState<AnswerKey>(null);

  const reset = () => {
    setActiveTab("narrative");
    setStep(0);
    setAnswer(null);
  };

  return (
    <div data-interactive="worked-example-kp-rpp-walkthrough" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked example · Chapter 4 close</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              KP RPP real-chart walkthrough
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Synthesise Chapter 4&apos;s classical confirmation and sub-lord refinement, update Vikram&apos;s case file, and answer the direct client question honestly.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "narrative" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Five-step arc</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>From question to synthesis</h3>
            <NarrativeSvg step={step} />
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(STEPS) as unknown as StepKey[]).map((s) => (
                <button key={s} type="button" aria-pressed={step === s} onClick={() => setStep(s)} style={buttonStyle(step === s, STEPS[s].color)}>
                  {s + 1}. {STEPS[s].title}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Step detail</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: STEPS[step].color, fontSize: "1.15rem", fontWeight: 600 }}>{step + 1}. {STEPS[step].title}</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{STEPS[step].detail}</p>
          </section>
        </>
      )}

      {activeTab === "case-file" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Case file</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>Status after each chapter</h3>
            <CaseFileSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Client statement</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Extended, not rewritten</h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {STATEMENTS.map((s) => (
                <div key={s.chapter} style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${s.chapter === "Chapter 4" ? GREEN : BLUE}55`, background: `${s.chapter === "Chapter 4" ? GREEN : BLUE}10` }}>
                  <p style={{ margin: "0 0 0.35rem", color: s.chapter === "Chapter 4" ? GREEN : BLUE, fontWeight: 600 }}>{s.chapter}</p>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontStyle: "italic" }}>&quot;{s.text}&quot;</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: PURPLE, fontWeight: 600 }}>Continuity:</span> the candidate count and direction of lean stay the same; only the strength of the lean changes — honestly communicated as a strengthening, not a resolution.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "convergence" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Independent convergence</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>Why Chapter 4 strengthens the lean</h3>
            <ConvergenceSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Precision</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Changed:</span> B is now favoured by two independent signals (tattva + sub-lord), not one.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Untouched:</span> C remains excluded on Chapter 2 grounds. Chapter 4&apos;s RP checks are real but moot for C.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Not changed:</span> A is still plausible, not excluded. Two soft signals do not make a final verdict.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "client-question" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Client asks</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Choose the honest answer</h3>
            <ClientQuestionSvg answer={answer} />
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.55rem" }}>
              {(Object.keys(ANSWERS) as (keyof typeof ANSWERS)[]).map((key) => {
                const a = ANSWERS[key];
                const selected = answer === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAnswer(key)}
                    style={{ width: "100%", textAlign: "left", padding: "0.75rem", borderRadius: 8, border: `1px solid ${selected ? (a.correct ? GREEN : VERMILION) : HAIRLINE}`, background: selected ? (a.correct ? `${GREEN}10` : `${VERMILION}10`) : SURFACE, cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ color: selected ? (a.correct ? GREEN : VERMILION) : INK_PRIMARY, fontWeight: 600 }}>{a.text}</span>
                      <span style={{ color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>{a.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            {answer && (
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${ANSWERS[answer].correct ? GREEN : VERMILION}55`, background: `${ANSWERS[answer].correct ? GREEN : VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{ANSWERS[answer].feedback}</p>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}
