"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Lock,
  MessageCircle,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Stethoscope,
  Swords,
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
const PURPLE = "#6B5AA8";

interface ScenarioOption {
  label: string;
  correct: boolean;
  feedback: string;
}

interface Scenario {
  id: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  prompt: string;
  options: ScenarioOption[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "direct",
    icon: <MessageCircle size={18} aria-hidden="true" />,
    color: VERMILION,
    title: "Direct question",
    prompt: "Client: \"Is this a dangerous period for me?\"",
    options: [
      {
        label: "Say plainly that the 7th-lord daśā is afflicted and they should be very careful.",
        correct: false,
        feedback: "This converts an internal structural finding into a client-facing danger prediction — exactly what the doctrine forbids.",
      },
      {
        label: "Decline to answer in maraka terms and redirect to universal proactive guidance: regular checkups and not deferring medical care.",
        correct: true,
        feedback: "Correct. The client receives useful, honest guidance without a specific astrological danger claim.",
      },
      {
        label: "Refuse to discuss health at all and end the consultation.",
        correct: false,
        feedback: "Evasive and disproportionate. Health can be discussed supportively; only the maraka-specific prediction is restricted.",
      },
    ],
  },
  {
    id: "softened",
    icon: <Scale size={18} aria-hidden="true" />,
    color: GOLD,
    title: "Softened question",
    prompt: "Client: \"Is there anything I should be extra careful about health-wise this year?\"",
    options: [
      {
        label: "Mention that the chart shows a maraka-linked period, so they should be extra vigilant.",
        correct: false,
        feedback: "Even a softened framing names the finding. The guidance should be the same regardless of the chart.",
      },
      {
        label: "Answer in the universal register: stay on top of checkups and not let symptoms linger. No maraka reference is needed.",
        correct: true,
        feedback: "Correct. The response is genuinely useful and does not depend on revealing the specific astrological reasoning.",
      },
      {
        label: "Say you cannot answer any health-related question.",
        correct: false,
        feedback: "Too broad. General proactive health guidance is appropriate; only the maraka-specific claim is out of scope.",
      },
    ],
  },
  {
    id: "meta",
    icon: <Info size={18} aria-hidden="true" />,
    color: BLUE,
    title: "Meta-question",
    prompt: "Client: \"Did you check whether this is a maraka period for me?\"",
    options: [
      {
        label: "Deny that any maraka analysis was performed.",
        correct: false,
        feedback: "Dishonest. The doctrine restricts disclosure of findings, not honesty about whether the technique was applied.",
      },
      {
        label: "Confirm that maraka analysis is part of a full reading, and that its findings are never shared in client-facing form.",
        correct: true,
        feedback: "Correct. Honesty about process, paired with a clear boundary on output.",
      },
      {
        label: "Share the finding but ask the client not to act on it.",
        correct: false,
        feedback: "Sharing the specific finding violates the non-disclosure rule regardless of any caveat.",
      },
    ],
  },
  {
    id: "prior-harm",
    icon: <AlertTriangle size={18} aria-hidden="true" />,
    color: VERMILION,
    title: "Disclosed prior harm",
    prompt: "Client: \"Another astrologer told me something bad will happen in this period. I've been anxious ever since.\"",
    options: [
      {
        label: "Reassure them that your own reading does not show the same thing.",
        correct: false,
        feedback: "This still engages in prediction-by-contradiction and does not correct the harmful claim directly.",
      },
      {
        label: "Name the prior claim as an irresponsible use of the technique, explain that maraka is not a death-prediction tool, validate the distress, and offer referral if needed.",
        correct: true,
        feedback: "Correct. Correct the misinformation plainly, care for the distress, and offer a proportionate next step.",
      },
      {
        label: "Agree that the previous astrologer may have seen something real and suggest they prepare for the worst.",
        correct: false,
        feedback: "This reinforces the harm rather than undoing it.",
      },
    ],
  },
  {
    id: "sympathetic",
    icon: <Stethoscope size={18} aria-hidden="true" />,
    color: PURPLE,
    title: "Sympathetic practical request",
    prompt: "Client: \"I'm trying to plan major surgery for a safe time — can you tell me if this period is okay?\"",
    options: [
      {
        label: "Check the chart for a maraka-safe window and give a date range.",
        correct: false,
        feedback: "Surgical timing is a medical decision. Astrological claims should not substitute for clinical risk assessment.",
      },
      {
        label: "Decline the maraka-specific framing and redirect to the surgical team's own risk assessment and pre-operative care.",
        correct: true,
        feedback: "Correct. This applies the module's medical-routing discipline and avoids a false-precision claim.",
      },
      {
        label: "Say the period is fine because the maraka picture is unamplified.",
        correct: false,
        feedback: "Even a reassuring maraka-based claim is still a client-facing maraka prediction and is not allowed.",
      },
    ],
  },
];

const REWRITE_OPTIONS = [
  {
    label: "Your 7th-lord daśā is badly afflicted, so this period is dangerous for your health.",
    correct: false,
    feedback: "Direct death/danger prediction. The technique does not support this level of client-facing certainty.",
  },
  {
    label: "This is a good time to stay on top of regular checkups and not let any symptoms linger unaddressed.",
    correct: true,
    feedback: "Correct — universal, undated, proactive guidance that would be appropriate for any client, any time.",
  },
  {
    label: "I can&apos;t tell you exactly, but the chart does suggest you should be more careful than usual.",
    correct: false,
    feedback: "Still leaks the maraka-specific finding. The guidance should not hint at astrological reasoning behind it.",
  },
];

const MISTAKES = [
  {
    label: "Treating an amplified maraka finding as license to warn a client",
    wrong: "A practitioner, having found a severely afflicted maraka lord, directly warns the client about danger.",
    right: "Redirect protective intent into the universal proactive-guidance register — useful, honest, and free of false precision.",
  },
  {
    label: "Answering \"did you check\" by denying the analysis occurred",
    wrong: "A practitioner claims no maraka-related analysis was performed in order to avoid disclosure.",
    right: "Be honest that the technique was applied; decline only to share its specific findings.",
  },
  {
    label: "Letting a sympathetic practical framing create an exception",
    wrong: "Surgery timing or travel planning is treated as a low-stakes exception to the non-disclosure rule.",
    right: "Redirect practical medical-timing questions to the appropriate medical professional; astrology does not substitute for clinical judgment.",
  },
];

export function MarakaCautionWindowTrainer() {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [rewriteSelection, setRewriteSelection] = useState<number | null>(null);
  const [showAmplified, setShowAmplified] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const selectOption = (scenarioId: string, index: number) => {
    setSelections((prev) => ({ ...prev, [scenarioId]: index }));
    setShowFeedback((prev) => ({ ...prev, [scenarioId]: true }));
  };

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const reset = () => {
    setSelections({});
    setShowFeedback({});
    setRewriteSelection(null);
    setShowAmplified(false);
    setOpenMistakes({});
  };

  return (
    <div data-interactive="maraka-caution-window-trainer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Maraka caution-window trainer</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Caution-window, not death-prediction
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              A maraka daśā/bhukti is a period of heightened practitioner vigilance. It is never a client-facing statement about danger, illness, or death.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <Lock size={18} aria-hidden="true" style={{ color: VERMILION, flexShrink: 0 }} />
          <p style={{ margin: 0, color: VERMILION, fontWeight: 500 }}>
            The maraka finding stays inside the consultation. What crosses to the client is ordinary, proactive health-maintenance guidance.
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Boundary diagram</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
          The finding stays internal; only proactive guidance crosses
        </h3>
        <BoundarySvg />
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
          The client hears general, well-calibrated wellbeing advice. They do not hear that a maraka indicator was the reason.
        </p>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Why amplification still does not license a warning</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Even a strong structural finding is not a prediction
        </h3>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: INK_SECONDARY, fontWeight: 400 }}>
          <input type="checkbox" checked={showAmplified} onChange={(e) => setShowAmplified(e.target.checked)} />
          Show the heavily amplified case
        </label>
        <div style={{ marginTop: "0.6rem", padding: "0.75rem", borderRadius: 8, background: showAmplified ? `${VERMILION}10` : `${GREEN}10`, border: `1px solid ${showAmplified ? VERMILION : GREEN}55` }}>
          <p style={{ margin: 0, color: showAmplified ? VERMILION : GREEN, fontWeight: 500 }}>
            {showAmplified ? "Heavily amplified maraka picture" : "Unamplified maraka picture"}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
            {showAmplified
              ? "A natural malefic maraka lord, debilitated, conjunct a dusthāna lord. The practitioner internally increases vigilance. The client still receives only the same universal proactive guidance — never a warning, never a date, never a claim that something will happen."
              : "A well-dignified benefic maraka lord, free of dusthāna association. The caution-window framing still applies, but with low internal urgency. The client-facing guidance remains identical."}
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Question-response trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Practise the five pressure points from §4.4
        </h3>
        <div style={{ display: "grid", gap: "0.85rem" }}>
          {SCENARIOS.map((scenario) => {
            const selected = selections[scenario.id];
            const show = showFeedback[scenario.id];
            return (
              <div key={scenario.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: SURFACE }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ color: scenario.color }}>{scenario.icon}</span>
                  <strong style={{ color: scenario.color, fontWeight: 600 }}>{scenario.title}</strong>
                </div>
                <p style={{ margin: "0 0 0.6rem", color: INK_PRIMARY, lineHeight: 1.55, fontWeight: 400 }}>{scenario.prompt}</p>
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {scenario.options.map((option, index) => {
                    const isSelected = selected === index;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectOption(scenario.id, index)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "0.6rem 0.75rem",
                          borderRadius: 6,
                          border: `1px solid ${isSelected ? (option.correct ? GREEN : VERMILION) : HAIRLINE}`,
                          background: isSelected ? (option.correct ? `${GREEN}10` : `${VERMILION}10`) : "transparent",
                          cursor: "pointer",
                          color: INK_PRIMARY,
                          fontWeight: 400,
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                          {isSelected ? (
                            option.correct ? <CheckCircle2 size={16} style={{ color: GREEN, flexShrink: 0 }} /> : <XCircle size={16} style={{ color: VERMILION, flexShrink: 0 }} />
                          ) : (
                            <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${HAIRLINE}`, flexShrink: 0 }} />
                          )}
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {show && selected !== undefined && (
                  <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.75rem", borderRadius: 6, background: scenario.options[selected].correct ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${scenario.options[selected].correct ? GREEN : VERMILION}55`, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    {scenario.options[selected].feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Statement rewriter</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Choose the universal proactive response
        </h3>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, marginBottom: "0.65rem" }}>
          <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>
            Harmful statement: &quot;Your chart shows a dangerous maraka period this year, so you need to watch your health very closely.&quot;
          </p>
        </div>
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {REWRITE_OPTIONS.map((option, index) => {
            const isSelected = rewriteSelection === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRewriteSelection(index)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.6rem 0.75rem",
                  borderRadius: 6,
                  border: `1px solid ${isSelected ? (option.correct ? GREEN : VERMILION) : HAIRLINE}`,
                  background: isSelected ? (option.correct ? `${GREEN}10` : `${VERMILION}10`) : "transparent",
                  cursor: "pointer",
                  color: INK_PRIMARY,
                  fontWeight: 400,
                }}
              >
                <span style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  {isSelected ? (
                    option.correct ? <CheckCircle2 size={16} style={{ color: GREEN, flexShrink: 0 }} /> : <XCircle size={16} style={{ color: VERMILION, flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${HAIRLINE}`, flexShrink: 0 }} />
                  )}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
        {rewriteSelection !== null && (
          <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.75rem", borderRadius: 6, background: REWRITE_OPTIONS[rewriteSelection].correct ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${REWRITE_OPTIONS[rewriteSelection].correct ? GREEN : VERMILION}55`, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            {REWRITE_OPTIONS[rewriteSelection].feedback}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Three ways the boundary is crossed
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
                      <span style={{ fontWeight: 600 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 600, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <section style={{ ...panelStyle, background: `${BLUE}0A` }}>
          <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
            <ShieldCheck size={20} aria-hidden="true" style={{ color: BLUE, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>Link to Lesson 7.3.5</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                The same non-disclosure principle that governs computed longevity figures now governs maraka analysis.
              </p>
            </div>
          </div>
        </section>

        <section style={{ ...panelStyle, background: `${PURPLE}0A` }}>
          <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
            <Swords size={20} aria-hidden="true" style={{ color: PURPLE, flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>Forward to Lesson 7.7.4</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                Chapter 7&apos;s capstone will generalise this doctrine module-wide: no practitioner tells a client when they will die.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function BoundarySvg() {
  return (
    <svg
      viewBox="0 0 420 160"
      role="img"
      aria-label="Maraka finding stays internal; only universal proactive guidance reaches the client"
      style={{ display: "block", width: "min(100%, 560px)", margin: "0.85rem auto 0" }}
    >
      <rect x="20" y="20" width="130" height="120" rx="8" fill={`${VERMILION}10`} stroke={VERMILION} />
      <text x="85" y="50" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight={600}>Practitioner</text>
      <text x="85" y="75" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={500}>maraka finding</text>
      <text x="85" y="92" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>internal vigilance</text>
      <rect x="55" y="100" width="60" height="28" rx="4" fill={`${VERMILION}20`} stroke={VERMILION} />
      <text x="85" y="118" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>HOLD</text>

      <line x1="150" y1="80" x2="230" y2="80" stroke={GREEN} strokeWidth="2" strokeDasharray="4 2" />
      <polygon points="230,75 240,80 230,85" fill={GREEN} />
      <text x="195" y="70" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={500}>universal guidance</text>

      <rect x="250" y="20" width="150" height="120" rx="8" fill={`${GREEN}10`} stroke={GREEN} />
      <text x="325" y="50" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>Client experience</text>
      <text x="325" y="75" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={500}>proactive wellbeing</text>
      <text x="325" y="92" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>no prediction, no date</text>
      <rect x="290" y="100" width="70" height="28" rx="4" fill={`${GREEN}20`} stroke={GREEN} />
      <text x="325" y="118" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight={600}>CLEAR</text>
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
