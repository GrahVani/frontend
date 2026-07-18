"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  MessageSquareQuote,
  RefreshCcw,
  Route,
  Scale,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "process" | "verdict" | "statement" | "client-question";
type StepKey = 0 | 1 | 2 | 3 | 4;
type AnswerKey = "overclaim" | "underclaim" | "disciplined" | null;

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
  process: { label: "Chapter 3 process", icon: Route },
  verdict: { label: "Updated verdict", icon: Scale },
  statement: { label: "Client statement", icon: MessageSquareQuote },
  "client-question": { label: "Client asks", icon: MessageSquareQuote },
};

const STEPS: Record<StepKey, { title: string; detail: string; color: string }> = {
  0: { title: "Doctrine review", detail: "Lesson 20.3.1: diagnostic check, scope limit, self-referential extension.", color: BLUE },
  1: { title: "Apply to all candidates", detail: "Lesson 20.3.2: A clashes, B coheres, C clashes — full coherence table.", color: PURPLE },
  2: { title: "Integrate with Chapter 2", detail: "A/B tie becomes a lean; C clash corroborates existing exclusion.", color: GOLD },
  3: { title: "Strengths and limits", detail: "Lesson 20.3.3: same-sign value, verified gap, infrastructure gap.", color: GREEN },
  4: { title: "Updated statement", detail: "Chapter 2 statement is refined, not rewritten, with honest provisional lean.", color: BLUE },
};

const OLD_STATEMENT = [
  "We can say with real confidence that you were not born as late as 6:12am.",
  "Between the two remaining possibilities — roughly 5:48am and 6:00am — both currently fit equally well.",
  "We will need one more kind of check to narrow further between these two specific times.",
];

const NEW_STATEMENT = [
  "We can say with real confidence that you were not born as late as 6:12am; that possibility is still excluded.",
  "Since we last spoke, a second, independent check pointed toward 6:00am being the better fit of the two remaining possibilities.",
  "Both times remain technically possible, but we now have a working lean rather than a genuine coin-flip.",
  "One or two more checks remain before we would call this settled.",
];

const ANSWERS: Record<Exclude<AnswerKey, null>, { label: string; text: string; correct: boolean; feedback: string }> = {
  overclaim: {
    label: "Overclaim",
    text: "Yes, it is 6:00am.",
    correct: false,
    feedback: "This overstates one soft signal into a final confirmation. The case file supports a lean, not a verdict.",
  },
  underclaim: {
    label: "Underclaim",
    text: "We do not know anything yet.",
    correct: false,
    feedback: "This hides real progress. A coin-flip has become a lean, which is worth stating plainly.",
  },
  disciplined: {
    label: "Disciplined",
    text: "It is our current best-supported answer, not yet confirmed.",
    correct: true,
    feedback: "Correct. It names the lean plainly while naming its provisional status in the same breath.",
  },
};

function ProcessFlowSvg({ step }: { step: StepKey }) {
  const items = Object.values(STEPS);
  return (
    <svg viewBox="0 0 620 150" role="img" aria-label="Chapter 3 end-to-end process" style={{ width: "100%", maxHeight: 170, display: "block" }}>
      <rect x={10} y={10} width={600} height={130} rx={8} fill={`${STEPS[step].color}08`} stroke={HAIRLINE} />
      {items.map((s, i) => {
        const x = 70 + i * 110;
        const active = i <= step;
        return (
          <g key={s.title}>
            <circle cx={x} cy={55} r={22} fill={active ? s.color : `${INK_MUTED}33`} stroke={active ? s.color : HAIRLINE} strokeWidth={3} />
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

function VerdictComparisonSvg() {
  return (
    <svg viewBox="0 0 620 240" role="img" aria-label="Verdict comparison between Chapter 2 and Chapter 3" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={220} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />

      {/* Chapter 2 column */}
      <rect x={40} y={40} width={150} height={160} rx={6} fill={`${BLUE}18`} stroke={BLUE} />
      <text x={115} y={64} textAnchor="middle" fill={BLUE} fontSize={12} fontWeight={600}>After Chapter 2</text>
      <text x={115} y={88} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>C excluded</text>
      <text x={115} y={108} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>A/B tied</text>
      <text x={115} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>12-minute window</text>
      <text x={115} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={9}>events-based</text>

      {/* Arrow */}
      <path d="M 210 120 L 280 120" stroke={HAIRLINE} strokeWidth={2} strokeDasharray="6 4" markerEnd="url(#arrow-compare)" />
      <text x={245} y={110} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600}>Chapter 3</text>

      {/* Chapter 3 column */}
      <rect x={300} y={40} width={150} height={160} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={375} y={64} textAnchor="middle" fill={GREEN} fontSize={12} fontWeight={600}>After Chapter 3</text>
      <text x={375} y={88} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>C corroborated</text>
      <text x={375} y={108} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>B favoured over A</text>
      <text x={375} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>A still plausible</text>
      <text x={375} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={9}>tattva added</text>

      {/* Open */}
      <rect x={470} y={70} width={120} height={100} rx={6} fill={`${PURPLE}18`} stroke={PURPLE} />
      <text x={530} y={95} textAnchor="middle" fill={PURPLE} fontSize={11} fontWeight={600}>Still open</text>
      <text x={530} y={115} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>KP RPP</text>
      <text x={530} y={135} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>D60</text>
      <text x={530} y={155} textAnchor="middle" fill={INK_MUTED} fontSize={9}>final confirmation</text>

      <defs>
        <marker id="arrow-compare" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M 0 0 L 8 4 L 0 8 z" fill={INK_MUTED} />
        </marker>
      </defs>
    </svg>
  );
}

function StatementDiffSvg() {
  return (
    <svg viewBox="0 0 460 160" role="img" aria-label="Statement update" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={440} height={140} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>What changed in the client statement</text>

      <rect x={40} y={55} width={170} height={40} rx={6} fill={`${INK_MUTED}22`} stroke={HAIRLINE} />
      <text x={125} y={74} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>Chapter 2</text>
      <text x={125} y={88} textAnchor="middle" fill={INK_MUTED} fontSize={9}>two equal possibilities</text>

      <path d="M 220 75 L 240 75" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="232,69 242,75 232,81" fill={GREEN} />

      <rect x={250} y={55} width={170} height={40} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
      <text x={335} y={74} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>Chapter 3</text>
      <text x={335} y={88} textAnchor="middle" fill={INK_SECONDARY} fontSize={9}>one favoured, one plausible</text>

      <text x={230} y={128} textAnchor="middle" fill={INK_SECONDARY} fontSize={11} fontWeight={600}>The field stayed the same; the confidence inside it changed</text>
    </svg>
  );
}

function ClientQuestionSvg({ answer }: { answer: AnswerKey }) {
  const color = answer ? (ANSWERS[answer].correct ? GREEN : VERMILION) : INK_MUTED;
  return (
    <svg viewBox="0 0 460 180" role="img" aria-label="Client question scenario" style={{ width: "100%", maxHeight: 200, display: "block" }}>
      <rect x={10} y={10} width={440} height={160} rx={8} fill={`${color}08`} stroke={HAIRLINE} />
      <text x={230} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Client asks: &quot;So is it 6am or not?&quot;</text>

      <g>
        <circle cx={80} cy={90} r={28} fill={INK_MUTED} />
        <text x={80} y={96} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>Client</text>
      </g>

      <path d="M 115 90 L 175 90" stroke={HAIRLINE} strokeWidth={2} />
      <polygon points="167,84 177,90 167,96" fill={INK_MUTED} />

      <rect x={190} y={60} width={240} height={60} rx={6} fill={SURFACE} stroke={color} />
      <text x={310} y={82} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>
        {answer ? ANSWERS[answer].text : "Choose the disciplined answer"}
      </text>
      <text x={310} y={102} textAnchor="middle" fill={INK_MUTED} fontSize={10}>
        {answer ? (ANSWERS[answer].correct ? "Direct, honest, bounded" : "Review the feedback below") : "..."}
      </text>
    </svg>
  );
}

export function WorkedExampleTattvaShuddhiWalkthrough() {
  const [activeTab, setActiveTab] = useState<TabKey>("process");
  const [step, setStep] = useState<StepKey>(0);
  const [answer, setAnswer] = useState<AnswerKey>(null);

  const reset = () => {
    setActiveTab("process");
    setStep(0);
    setAnswer(null);
  };

  return (
    <div data-interactive="worked-example-tattva-shuddhi-walkthrough" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked example · Chapter 3 close</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Tattva-śuddhi real-chart walkthrough
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble the full Chapter 3 process on Vikram&apos;s case, update the client-facing statement from Chapter 2, and practise answering the direct question honestly.
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

      {activeTab === "process" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>End-to-end process</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Five steps from doctrine to updated statement</h3>
            <ProcessFlowSvg step={step} />
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

      {activeTab === "verdict" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Updated interim verdict</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>What changed after Chapter 3</h3>
            <VerdictComparisonSvg />
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Precision check</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>What the new evidence actually bought</h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Changed:</span> A and B moved from tied to B favoured, on one new converging soft signal.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Not changed:</span> C was already excluded; its tattva clash only corroborates. A is still plausible, not excluded.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: PURPLE, fontWeight: 600 }}>Still open:</span> KP RPP and D60 remain to confirm or shift the current lean.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "statement" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Updating, not replacing</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Compare the Chapter 2 and Chapter 3 statements</h3>
            <StatementDiffSvg />
          </section>

          <section style={cardStyle}>
            <div style={workbenchTwoColumnStyle}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}08` }}>
                <p style={{ margin: "0 0 0.5rem", color: BLUE, fontWeight: 600 }}>Chapter 2 statement</p>
                <ol style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
                  {OLD_STATEMENT.map((line, i) => (
                    <li key={i} style={{ marginBottom: "0.4rem" }}>{line}</li>
                  ))}
                </ol>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}08` }}>
                <p style={{ margin: "0 0 0.5rem", color: GREEN, fontWeight: 600 }}>Chapter 3 updated statement</p>
                <ol style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
                  {NEW_STATEMENT.map((line, i) => (
                    <li key={i} style={{ marginBottom: "0.4rem" }}>{line}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "client-question" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Client asks</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Choose the disciplined answer</h3>
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


