"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Info,
  Lock,
  MessageCircle,
  RefreshCcw,
  Scale,
  ShieldCheck,
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
  icon: ReactNode;
  color: string;
  title: string;
  prompt: string;
  options: ScenarioOption[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "direct",
    icon: <MessageCircle size={18} aria-hidden="true" />,
    color: BLUE,
    title: "Direct request",
    prompt: "Client: \"How long do you think I have?\"",
    options: [
      {
        label: "Give a cautious decade-range based on the cross-check.",
        correct: false,
        feedback: "Any client-facing figure — range, rounded, or hedged — violates the absolute rule.",
      },
      {
        label: "Refuse plainly: the computation is an internal tool, not a figure shared with clients.",
        correct: true,
        feedback: "Correct. A direct request is refused with clarity and respect, without partial disclosure.",
      },
      {
        label: "Explain the three methods and why they disagree, then offer a rough sense.",
        correct: false,
        feedback: "Methodological explanation is fine; a rough sense is still a client-facing figure and is not allowed.",
      },
    ],
  },
  {
    id: "softened",
    icon: <Scale size={18} aria-hidden="true" />,
    color: GOLD,
    title: "Softened request",
    prompt: "Client: \"Just give me a rough idea, I can handle it.\"",
    options: [
      {
        label: "Agree to a rough idea since they are prepared for it.",
        correct: false,
        feedback: "The rule does not soften with the client's framing. A rough figure is still a figure.",
      },
      {
        label: "Refuse with the same clarity as a direct request, without entering a negotiation.",
        correct: true,
        feedback: "Correct. The answer does not change based on how politely the request is phrased.",
      },
      {
        label: "Say you will discuss it only if the number turns out favourable.",
        correct: false,
        feedback: "Selective disclosure based on result is still disclosure, and it hides the rule rather than stating it.",
      },
    ],
  },
  {
    id: "meta",
    icon: <Info size={18} aria-hidden="true" />,
    color: BLUE,
    title: "Meta-question",
    prompt: "Client: \"Did you compute something? What did it say?\"",
    options: [
      {
        label: "Acknowledge that computation is part of a full reading and that its output is never client-facing.",
        correct: true,
        feedback: "Correct. Honesty about process, paired with a clear boundary on output.",
      },
      {
        label: "Deny that any computation was done.",
        correct: false,
        feedback: "Dishonest. The doctrine is about non-disclosure, not about pretending the technique does not exist.",
      },
      {
        label: "Share the figure but ask them not to act on it.",
        correct: false,
        feedback: "Sharing the figure is the thing the rule forbids; a caveat does not undo it.",
      },
    ],
  },
  {
    id: "prior-harm",
    icon: <AlertTriangle size={18} aria-hidden="true" />,
    color: VERMILION,
    title: "Disclosed prior harm",
    prompt: "Client, visibly anxious: \"Another astrologer told me I wouldn't live past sixty. I'm fifty-eight now and I can't stop thinking about it.\"",
    options: [
      {
        label: "Move past it and continue with the current reading.",
        correct: false,
        feedback: "The harm must be named and corrected directly, with appropriate emotional care.",
      },
      {
        label: "Correct it plainly: no responsible practitioner shares a computed age as fact; the figure is not reliable enough to treat that way; suggest counselling if the distress persists.",
        correct: true,
        feedback: "Correct. Correct the misinformation, validate the distress, and offer a proportionate referral.",
      },
      {
        label: "Compute a new figure to reassure them they will live longer.",
        correct: false,
        feedback: "Replacing one unsupported number with another, even a comforting one, repeats the same error.",
      },
    ],
  },
  {
    id: "sympathetic",
    icon: <HeartPulse size={18} aria-hidden="true" />,
    color: PURPLE,
    title: "Sympathetic reason",
    prompt: "Client: \"I just want to plan my finances and say goodbye to people — I need a number.\"",
    options: [
      {
        label: "Share a number because the purpose is genuine and compassionate.",
        correct: false,
        feedback: "The rule holds regardless of stated purpose; the figure is not reliable enough to serve any real decision.",
      },
      {
        label: "Explain that the methods can disagree by a decade or more, so a number would be false precision; redirect to a financial advisor and to attending to relationships regardless of any number.",
        correct: true,
        feedback: "Correct. Take the purpose seriously, explain the methodological limit, and point toward what genuinely serves the need.",
      },
      {
        label: "Offer to compute it privately and never tell them.",
        correct: false,
        feedback: "Computing it for their benefit still treats the figure as meaningful to the client's life decision — the same misuse the rule prevents.",
      },
    ],
  },
];

const REWRITE_OPTIONS = [
  {
    label: "The computation says you have about seventy-two years, give or take a few.",
    correct: false,
    feedback: "Still a client-facing number, however hedged. The rule applies to any figure.",
  },
  {
    label: "That's not something I share. Longevity computation is an internal calibration tool in this tradition, not a figure I hand a client.",
    correct: true,
    feedback: "Correct — clear refusal, no partial disclosure, no false precision.",
  },
  {
    label: "I can't tell you the exact age, but the cross-check is fairly close, so you probably don't need to worry.",
    correct: false,
    feedback: "Hinting at the result with qualitative reassurance still leaks the figure and its apparent reliability.",
  },
];

const MODULATION_CASES = {
  longer: {
    label: "Longer computed figure",
    color: GREEN,
    reading: "Maraka caution window",
    shift: "The same transit or period is noted, but framed with slightly less urgency; the practitioner holds a modestly higher prior that the window may pass without event.",
  },
  shorter: {
    label: "Shorter computed figure",
    color: VERMILION,
    reading: "Health-house synthesis",
    shift: "The same ambiguous health-house indication is taken a little more seriously; the practitioner leans toward recommending medical follow-through, without ever explaining why.",
  },
};

const MISTAKES = [
  {
    label: "Softening the rule for \"just a range\" or \"just roughly\"",
    wrong: "A practitioner refuses a specific age but offers a decade-range or vague qualitative figure instead.",
    right: "The rule applies to any client-facing figure, however rounded or hedged — refuse the request itself, not only its most precise form.",
  },
  {
    label: "Treating a sympathetic reason as an exception",
    wrong: "A client's stated reason is treated as grounds for an exception to the rule.",
    right: "The rule holds regardless of stated purpose, because the figure is not reliable enough to serve any purpose responsibly — redirect to what genuinely serves the need.",
  },
  {
    label: "Not addressing a disclosed prior harm directly",
    wrong: "A client reveals a previous practitioner's specific-age claim, and the current practitioner moves past it without correction.",
    right: "Name the prior harm plainly and correct it, alongside appropriate emotional care and referral if distress is present.",
  },
];

export function LongevityEthicsResponseTrainer() {
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [rewriteSelection, setRewriteSelection] = useState<number | null>(null);
  const [modulation, setModulation] = useState<"longer" | "shorter">("longer");
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
    setModulation("longer");
    setOpenMistakes({});
  };

  return (
    <div data-interactive="longevity-ethics-response-trainer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Longevity computation ethics</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Silent calibration, not pronouncement
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              A computed Piṇḍāyu, Aṁśāyu, or Naisargikāyu figure is never shared with a client. Its only legitimate use is internal, silent confidence-modulation.
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
            Absolute rule: no computed figure — precise, rounded, ranged, or hedged — is ever client-facing.
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Boundary diagram</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
          The number stays inside; only calm calibration crosses
        </h3>
        <BoundarySvg />
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400, fontSize: "0.88rem" }}>
          The client experiences a well-calibrated practitioner. They never experience the specific number behind that calibration.
        </p>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Silent confidence-modulation</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
          How the same reading shifts, without the client knowing why
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button type="button" aria-pressed={modulation === "longer"} onClick={() => setModulation("longer")} style={smallChipStyle(modulation === "longer", GREEN)}>
            Longer computed figure
          </button>
          <button type="button" aria-pressed={modulation === "shorter"} onClick={() => setModulation("shorter")} style={smallChipStyle(modulation === "shorter", VERMILION)}>
            Shorter computed figure
          </button>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: `${MODULATION_CASES[modulation].color}10`, border: `1px solid ${MODULATION_CASES[modulation].color}55` }}>
          <p style={{ margin: 0, color: MODULATION_CASES[modulation].color, fontWeight: 500 }}>
            {MODULATION_CASES[modulation].label} → {MODULATION_CASES[modulation].reading}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            {MODULATION_CASES[modulation].shift}
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Question-response trainer</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Practise the five pressure points from the lesson
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
          Choose the honest, bounded response
        </h3>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, marginBottom: "0.65rem" }}>
          <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>
            Harmful statement: &quot;I ran the longevity computation. It came out around seventy-two, but I&apos;m not supposed to tell you that exactly.&quot;
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
          Three ways the rule is weakened
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

      <section style={{ ...panelStyle, background: `${PURPLE}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <ShieldCheck size={20} aria-hidden="true" style={{ color: PURPLE, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: PURPLE, fontWeight: 600 }}>Forward link to Chapter 7</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              This lesson is the computational half of the module&apos;s operational capstone: the practitioner never tells a client when they will die. Chapter 7 will restate that doctrine as the module&apos;s final binding rule.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BoundarySvg() {
  return (
    <svg viewBox="0 0 420 160" role="img" aria-label="Computed number stays with the practitioner; only calibrated influence reaches the client">
      <rect x="20" y="20" width="130" height="120" rx="8" fill={`${BLUE}15`} stroke={BLUE} />
      <text x="85" y="50" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Practitioner</text>
      <text x="85" y="75" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={500}>computed figure</text>
      <text x="85" y="92" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>never shared</text>
      <rect x="55" y="100" width="60" height="28" rx="4" fill={`${VERMILION}20`} stroke={VERMILION} />
      <text x="85" y="118" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>LOCKED</text>

      <line x1="150" y1="80" x2="230" y2="80" stroke={GOLD} strokeWidth="2" strokeDasharray="4 2" />
      <polygon points="230,75 240,80 230,85" fill={GOLD} />
      <text x="195" y="70" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight={500}>silent modulation</text>

      <rect x="250" y="20" width="150" height="120" rx="8" fill={`${GREEN}10`} stroke={GREEN} />
      <text x="325" y="50" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>Client experience</text>
      <text x="325" y="75" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={500}>well-calibrated reading</text>
      <text x="325" y="92" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>no number, no hint</text>
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
