"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CheckCircle2,
  Info,
  MessageCircle,
  MessageSquareOff,
  RefreshCcw,
  ShieldOff,
  Stethoscope,
  UserRound,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

interface ScenarioOption {
  label: string;
  correct: boolean;
  feedback: string;
}

interface Scenario {
  id: string;
  icon: ReactNode;
  color: string;
  title: string;
  prompt: string;
  options: ScenarioOption[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "unsolicited",
    icon: <MessageSquareOff size={18} aria-hidden="true" />,
    color: GOLD,
    title: "Unsolicited disclosure",
    prompt:
      "A parent mentions their toddler has been sleeping poorly. While reviewing the chart, you notice a Bālāriṣṭa-relevant configuration. They did not ask about longevity or mortality. What do you do?",
    options: [
      {
        label: "Mention the configuration and explain it needs cancellation checking.",
        correct: false,
        feedback:
          "The default is near-total non-disclosure. Volunteering this material unprompted places anxiety on the parent that they did not ask for.",
      },
      {
        label: "Stay silent on Bālāriṣṭa and address only what the parent actually raised.",
        correct: true,
        feedback:
          "Correct. The technique's value here is internal. Do not answer a question the parent did not ask, especially not this one.",
      },
      {
        label: "Hint vaguely that there is 'something serious' worth discussing later.",
        correct: false,
        feedback:
          "Vague hints create anxiety without providing honest information. Either speak plainly when asked directly, or not at all.",
      },
    ],
  },
  {
    id: "direct-no-match",
    icon: <MessageCircle size={18} aria-hidden="true" />,
    color: GREEN,
    title: "Direct question, no configuration matched",
    prompt:
      "A parent asks directly: 'Can you check if my baby's chart shows anything worrying about whether she'll be okay?' You found none of the eight configurations.",
    options: [
      {
        label: "Say plainly that you are not seeing any of the classical patterns, while keeping the claim scoped to astrology, not medicine.",
        correct: true,
        feedback:
          "Correct. A direct question deserves an honest, bounded answer. Plain reassurance is appropriate when the analysis genuinely supports it.",
      },
      {
        label: "Decline to answer, saying this topic is outside your scope.",
        correct: false,
        feedback:
          "Evasion is not the right response to a direct question. The parent deserves honesty, delivered with care and scope limits.",
      },
      {
        label: "Explain the eight configurations in detail so they understand why nothing matched.",
        correct: false,
        feedback:
          "Over-teaching the technique to a worried parent is not necessary and can reintroduce alarm. Keep the answer plain and bounded.",
      },
    ],
  },
  {
    id: "direct-match",
    icon: <ShieldOff size={18} aria-hidden="true" />,
    color: VERMILION,
    title: "Direct question, under-cancelled configuration",
    prompt:
      "A parent asks the same direct question. This time the full analysis finds a matched configuration with only weak cancellation present.",
    options: [
      {
        label: "Tell them the child is at serious risk before age eight.",
        correct: false,
        feedback:
          "Fatalistic framing violates the curriculum's discipline. This doctrine does not support timelines or certainty.",
      },
      {
        label: "Say there is a 30% risk and recommend extra vigilance between ages one and eight.",
        correct: false,
        feedback:
          "False precision — percentages and year-windows are not supported by this classical apparatus and create disproportionate fear.",
      },
      {
        label: "Name the finding in classical vocabulary, state it is not a prediction or timeline, and pair it with ordinary attentive parenting and paediatric care.",
        correct: true,
        feedback:
          "Correct. Honest, bounded, trauma-informed language: the finding is named, its limits are stated, and the parent is left with a proportionate, useful takeaway.",
      },
    ],
  },
  {
    id: "medical",
    icon: <Stethoscope size={18} aria-hidden="true" />,
    color: BLUE,
    title: "Real medical concern surfaces",
    prompt:
      "During the reading, the parent says: 'She's had a high fever for three days and the doctor's appointment isn't until next week.'",
    options: [
      {
        label: "Continue with the chart analysis and note any health indicators you see.",
        correct: false,
        feedback:
          "A real, present medical concern is not an astrological question. Continuing the reading would be a scope error.",
      },
      {
        label: "Suggest they contact their paediatrician today, and pause the astrological conversation until the medical concern is addressed.",
        correct: true,
        feedback:
          "Correct. The same medical-routing discipline applied elsewhere in the curriculum takes priority here.",
      },
      {
        label: "Reassure them that the chart does not show anything serious.",
        correct: false,
        feedback:
          "Astrology cannot replace a clinical assessment, and false reassurance can delay needed care.",
      },
    ],
  },
];

const REWRITE_OPTIONS = [
  {
    label: "Your child is unlikely to survive the early years.",
    correct: false,
    feedback: "Fatalistic and unsupported. This collapses a graduated finding into a verdict.",
  },
  {
    label:
      "There is a traditional configuration associated with wanting extra vigilance in early childhood. It is not a prediction, percentage, or timeline. The practical takeaway is ordinary attentive parenting and regular paediatric care.",
    correct: true,
    feedback: "Correct — classical vocabulary, no false precision, paired with proportionate guidance.",
  },
  {
    label: "I see something, but I would rather not say anything about it.",
    correct: false,
    feedback: "Evasive. A direct question deserves an honest, bounded answer, not silence.",
  },
];

const USE_CASES = {
  internal: {
    label: "Internal value",
    icon: <UserRound size={18} aria-hidden="true" />,
    color: BLUE,
    points: [
      "Classical literacy — recognising and correcting mishandled fragments encountered elsewhere.",
      "Silent confidence-calibration — informing how much weight other findings deserve without naming Bālāriṣṭa to the client.",
    ],
  },
  client: {
    label: "Client-facing use",
    icon: <MessageCircle size={18} aria-hidden="true" />,
    color: VERMILION,
    points: [
      "Only when a direct, specific question is asked.",
      "Answer honestly, in classical vocabulary, with no percentages or timelines.",
      "Pair any genuine finding with ordinary attentive parenting and paediatric care.",
    ],
  },
};

const MISTAKES = [
  {
    label: "Volunteering a Bālāriṣṭa finding unprompted",
    wrong: "A practitioner mentions a configuration the parent never asked about.",
    right:
      "The default is near-total non-disclosure. Technical thoroughness is shown by restraint, not volume.",
  },
  {
    label: "Deflecting a direct parental question",
    wrong: "A parent asks directly and receives evasion instead of an honest, bounded answer.",
    right:
      "A direct question deserves a direct, honest, appropriately-bounded answer — not evasion.",
  },
  {
    label: "Attaching false precision",
    wrong: "A finding is reported with an invented probability or age-window.",
    right:
      "Use classical vocabulary only; percentages and timelines are out of scope and harmful.",
  },
  {
    label: "Treating a real medical concern as an astrological question",
    wrong: "A current symptom or diagnosis is answered with chart analysis.",
    right: "Route to a paediatrician immediately; the chart reading is not the priority.",
  },
];

export function BalaristaEthicsFramingTrainer() {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [rewriteSelection, setRewriteSelection] = useState<number | null>(null);
  const [activeUseCase, setActiveUseCase] = useState<"internal" | "client">("internal");
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const selectOption = (scenarioId: string, index: number) => {
    setSelections((prev) => ({ ...prev, [scenarioId]: index }));
    setShowFeedback((prev) => ({ ...prev, [scenarioId]: true }));
  };

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const reset = () => {
    setSelections({});
    setShowFeedback({});
    setRewriteSelection(null);
    setActiveUseCase("internal");
    setOpenMistakes({});
  };

  return (
    <div data-interactive="balarista-ethics-framing-trainer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bālāriṣṭa ethics framing trainer</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GREEN, fontSize: "1.35rem", fontWeight: 600 }}>
              Hold the technique, then hold your tongue
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              This lesson&apos;s default is near-total non-disclosure. A direct question changes the response — but never into fatalism, false precision, or medical overreach.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Decision flow</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          When to speak, what to say, and when to route to medicine
        </h3>
        <DecisionFlowSvg />
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Scenario trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Choose the response that honours the lesson&apos;s discipline
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.85rem" }}>
          {SCENARIOS.map((scenario) => {
            const selected = selections[scenario.id];
            const show = showFeedback[scenario.id];
            return (
              <div
                key={scenario.id}
                style={{
                  border: `1px solid ${scenario.color}55`,
                  borderRadius: 8,
                  background: SURFACE,
                  padding: "1rem",
                  boxShadow: SHADOW,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: scenario.color, fontWeight: 600 }}>
                  {scenario.icon}
                  {scenario.title}
                </div>
                <p style={{ margin: "0.6rem 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.9rem" }}>
                  {scenario.prompt}
                </p>
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {scenario.options.map((option, index) => {
                    const isSelected = selected === index;
                    const revealed = show && isSelected;
                    return (
                      <button
                        key={index}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectOption(scenario.id, index)}
                        style={{
                          display: "grid",
                          gap: "0.15rem",
                          textAlign: "left",
                          border: `1px solid ${revealed ? (option.correct ? GREEN : VERMILION) : HAIRLINE}`,
                          borderRadius: 8,
                          background: revealed ? (option.correct ? `${GREEN}10` : `${VERMILION}10`) : SURFACE,
                          color: revealed ? (option.correct ? GREEN : VERMILION) : INK_SECONDARY,
                          padding: "0.6rem",
                          cursor: "pointer",
                          fontWeight: 500,
                          fontSize: "0.88rem",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          {revealed ? (
                            option.correct ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />
                          ) : null}
                          {option.label}
                        </span>
                        {revealed && (
                          <span style={{ color: option.correct ? GREEN : VERMILION, fontWeight: 400, fontSize: "0.82rem", lineHeight: 1.45 }}>
                            {option.feedback}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 1fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Framing rewriter</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
            Fix the harmful statement
          </h3>
          <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}0D`, border: `1px solid ${VERMILION}55`, marginBottom: "0.75rem" }}>
            <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>Harmful framing</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              &quot;The chart shows a 70% childhood-mortality risk concentrated around age 8.&quot;
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {REWRITE_OPTIONS.map((option, index) => {
              const revealed = rewriteSelection === index;
              return (
                <button
                  key={index}
                  type="button"
                  aria-pressed={revealed}
                  onClick={() => setRewriteSelection(index)}
                  style={{
                    display: "grid",
                    gap: "0.15rem",
                    textAlign: "left",
                    border: `1px solid ${revealed ? (option.correct ? GREEN : VERMILION) : HAIRLINE}`,
                    borderRadius: 8,
                    background: revealed ? (option.correct ? `${GREEN}10` : `${VERMILION}10`) : SURFACE,
                    color: revealed ? (option.correct ? GREEN : VERMILION) : INK_SECONDARY,
                    padding: "0.65rem",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.88rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    {revealed ? (
                      option.correct ? <CheckCircle2 size={14} aria-hidden="true" /> : <XCircle size={14} aria-hidden="true" />
                    ) : null}
                    {option.label}
                  </span>
                  {revealed && (
                    <span style={{ color: option.correct ? GREEN : VERMILION, fontWeight: 400, fontSize: "0.82rem", lineHeight: 1.45 }}>
                      {option.feedback}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Value distinction</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Internal value vs. client-facing use
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <button type="button" aria-pressed={activeUseCase === "internal"} onClick={() => setActiveUseCase("internal")} style={smallChipStyle(activeUseCase === "internal", BLUE)}>
              {USE_CASES.internal.label}
            </button>
            <button type="button" aria-pressed={activeUseCase === "client"} onClick={() => setActiveUseCase("client")} style={smallChipStyle(activeUseCase === "client", VERMILION)}>
              {USE_CASES.client.label}
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: USE_CASES[activeUseCase].color, fontWeight: 600, marginBottom: "0.5rem" }}>
            {USE_CASES[activeUseCase].icon}
            {USE_CASES[activeUseCase].label}
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
            {USE_CASES[activeUseCase].points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      </div>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Four ways this can go wrong
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {MISTAKES.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 500 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 500, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function DecisionFlowSvg() {
  return (
    <svg viewBox="0 0 720 350" role="img" aria-label="Decision flow: parent asked, medical concern, configuration found, and the corresponding ethical response" style={{ width: "100%", maxHeight: 320, display: "block" }}>
      {/* Start */}
      <rect x={300} y={12} width={120} height={44} rx={8} fill={`${GOLD}15`} stroke={GOLD} strokeWidth="2" />
      <text x={360} y={40} textAnchor="middle" fill={GOLD} fontSize="13" fontWeight={600}>Parent asks?</text>

      {/* No branch */}
      <path d="M 360 56 L 360 85" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={345} y={76} textAnchor="end" fill={INK_MUTED} fontSize="11">No</text>
      <rect x={260} y={90} width={200} height={44} rx={8} fill={`${GREEN}12`} stroke={GREEN} strokeWidth="2" />
      <text x={360} y={118} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>Do not volunteer</text>

      {/* Yes branch */}
      <path d="M 420 34 L 520 34" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={470} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="11">Yes</text>
      <rect x={530} y={12} width={170} height={44} rx={8} fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x={615} y={40} textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={600}>Medical concern?</text>

      {/* Medical yes */}
      <path d="M 615 56 L 615 85" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={625} y={76} textAnchor="start" fill={INK_MUTED} fontSize="11">Yes</text>
      <rect x={520} y={90} width={190} height={44} rx={8} fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x={615} y={118} textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={600}>Route to paediatrician</text>

      {/* Medical no */}
      <path d="M 700 34 L 700 250 L 615 250" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={705} y={150} textAnchor="start" fill={INK_MUTED} fontSize="11">No</text>
      <rect x={410} y={228} width={200} height={44} rx={8} fill={`${GOLD}12`} stroke={GOLD} strokeWidth="2" />
      <text x={510} y={256} textAnchor="middle" fill={GOLD} fontSize="13" fontWeight={600}>Configuration found?</text>

      {/* Config no */}
      <path d="M 510 272 L 510 300" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={465} y={292} textAnchor="end" fill={INK_MUTED} fontSize="11">No</text>
      <rect x={380} y={305} width={260} height={44} rx={8} fill={`${GREEN}12`} stroke={GREEN} strokeWidth="2" />
      <text x={510} y={333} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>Plain, bounded reassurance</text>

      {/* Config yes */}
      <path d="M 410 250 L 260 250" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={335} y={240} textAnchor="middle" fill={INK_MUTED} fontSize="11">Yes</text>
      <rect x={20} y={228} width={240} height={44} rx={8} fill={`${VERMILION}12`} stroke={VERMILION} strokeWidth="2" />
      <text x={140} y={250} textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>Honest, classical,</text>
      <text x={140} y={266} textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight={600}>trauma-informed response</text>
    </svg>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
