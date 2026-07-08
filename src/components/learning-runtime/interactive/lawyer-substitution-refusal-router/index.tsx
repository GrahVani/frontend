"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const GREEN = "#2F7D55";

type ScenarioId = "fire-lawyer" | "self-represent" | "settlement" | "afford";

type Scenario = {
  id: ScenarioId;
  question: string;
  detail: string;
  correctKeys: string[];
  options: Array<{ keys: string[]; label: string; correct: boolean; feedback: string }>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "fire-lawyer",
    question: "Should I fire my lawyer?",
    detail: "The client is frustrated and three months behind on fees.",
    correctKeys: ["boundary", "available", "distress"],
    options: [
      {
        keys: ["encouraging"],
        label: "The chart looks encouraging, so trust your instincts.",
        correct: false,
        feedback: "This offers an implicit steer on a legal-strategy question and risks being heard as advice about the lawyer.",
      },
      {
        keys: ["boundary"],
        label: "That's not a question I can answer from a chart.",
        correct: false,
        feedback: "Boundary is correct but alone can feel cold and does not offer what is available or acknowledge distress.",
      },
      {
        keys: ["boundary", "available", "distress"],
        label: "Name the boundary, offer what is available, and take the distress seriously.",
        correct: true,
        feedback: "The full three-part refusal: honest boundary, in-scope offer, and recognition of the financial/trust strain.",
      },
    ],
  },
  {
    id: "self-represent",
    question: "Should I represent myself instead?",
    detail: "The client believes the case is simple enough to handle alone.",
    correctKeys: ["boundary", "available", "distress"],
    options: [
      {
        keys: ["boundary", "available"],
        label: "I can't answer that, but I can read your chart's structural pattern.",
        correct: false,
        feedback: "Misses the distress component; the client is anxious and may feel dismissed.",
      },
      {
        keys: ["boundary", "available", "distress"],
        label: "Refuse the strategy question, offer structural/timing insight, and acknowledge the frustration.",
        correct: true,
        feedback: "Complete refusal: boundary, available content, and emotional support.",
      },
      {
        keys: ["specific-org"],
        label: "Call the Legal Aid Society at this number — they'll help you represent yourself.",
        correct: false,
        feedback: "Names a specific organisation as if universally applicable and crosses into procedural advice.",
      },
    ],
  },
  {
    id: "settlement",
    question: "Should I accept the settlement offer?",
    detail: "The client wants a yes or no on a concrete legal decision.",
    correctKeys: ["boundary", "available"],
    options: [
      {
        keys: ["boundary", "available"],
        label: "Settlement decisions need your lawyer's judgement; I can only speak to chart structure and timing.",
        correct: true,
        feedback: "Clear boundary plus offer of what is legitimately in scope.",
      },
      {
        keys: ["answer"],
        label: "Saturn is strong in your 6th house, so accepting would be the safer path.",
        correct: false,
        feedback: "Directly answers a legal-strategy question using chart content — a competence-boundary violation.",
      },
      {
        keys: ["distress"],
        label: "You sound really stressed. Let's talk about how you're feeling.",
        correct: false,
        feedback: "Emotional support is in scope, but silence on the directly-asked legal question is not neutral.",
      },
    ],
  },
  {
    id: "afford",
    question: "I can't afford my lawyer anymore. What should I do?",
    detail: "Financial distress is central; the client is looking for practical help.",
    correctKeys: ["boundary", "resource-category", "distress"],
    options: [
      {
        keys: ["specific-org"],
        label: "Contact XYZ Legal Aid Hotline — they handle this everywhere.",
        correct: false,
        feedback: "Names a specific, unverified organisation as universally applicable.",
      },
      {
        keys: ["boundary", "resource-category", "distress"],
        label: "I can't make that decision, but many jurisdictions have legal-aid services, bar-referral panels, or clinics; your local bar association can verify what's actually available. And the financial pressure is real — it deserves its own attention.",
        correct: true,
        feedback: "Honest boundary, principle-level resource routing, and distress recognition.",
      },
      {
        keys: ["discount"],
        label: "I'll reduce my fee, and the chart looks like things will turn around.",
        correct: false,
        feedback: "Financial kindness is fine, but it substitutes for addressing the legal-strategy question and offers false reassurance.",
      },
    ],
  },
];

const RESPONSE_PARTS = [
  {
    key: "boundary",
    label: "Name the boundary",
    phrases: [
      "Whether to keep or change your lawyer is a decision that needs legal expertise, not a chart reading.",
      "I can't responsibly tell you what to do about your case strategy.",
      "That question is outside what astrology can answer.",
    ],
  },
  {
    key: "available",
    label: "Offer what is available",
    phrases: [
      "What I can offer is a read on the structural pattern around this conflict and the daśā windows that look most significant.",
      "I can speak to the chart's timing indications and the character of the matter.",
      "The structural and timing reading is real information — just not legal-strategy information.",
    ],
  },
  {
    key: "distress",
    label: "Take the distress seriously",
    phrases: [
      "It sounds like you're exhausted and unsure you're being represented well — that's worth naming on its own.",
      "Money and trust wearing on you at the same time is genuinely hard.",
      "A second legal opinion may address the trust issue directly, separate from anything the chart says.",
    ],
  },
  {
    key: "resource-category",
    label: "Principle-level resource routing",
    phrases: [
      "Many jurisdictions have publicly-funded legal aid, bar-referral panels, law-school clinics, or sliding-scale networks.",
      "Your local bar association or court clerk's office is usually the most reliable source for what's available where you live.",
      "I can't name a specific program, but those categories of resources commonly exist.",
    ],
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "distress-answer",
    label: "Client distress is a good reason to answer a legal-strategy question directly.",
    correction:
      "Distress increases substitution risk; it does not expand competence. The three-part refusal applies especially when the client is stressed.",
  },
  {
    key: "specific-org",
    label: "Naming a specific legal-aid hotline is helpful even if I don't know the client's jurisdiction.",
    correction:
      "Specific, unverified referrals may be wrong or inapplicable. Stay at the principle level and route to local, verifiable sources.",
  },
  {
    key: "silence",
    label: "If I focus on emotional support, I can leave the legal question unaddressed.",
    correction:
      "Silence on a directly-asked legal-strategy question is not neutral. The boundary must be stated explicitly every time.",
  },
] as const;

export function LawyerSubstitutionRefusalRouter() {
  const [scenarioChoices, setScenarioChoices] = useState<Record<ScenarioId, string | null>>({
    "fire-lawyer": null,
    "self-represent": null,
    "settlement": null,
    afford: null,
  });
  const [selectedPhrases, setSelectedPhrases] = useState<string[]>([
    RESPONSE_PARTS[0].phrases[0],
    RESPONSE_PARTS[1].phrases[0],
    RESPONSE_PARTS[2].phrases[0],
  ]);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "distress-answer": false,
    "specific-org": false,
    silence: false,
  });

  const correctCount = useMemo(() => {
    let count = 0;
    SCENARIOS.forEach((s) => {
      const choice = scenarioChoices[s.id];
      const option = s.options.find((o) => o.keys.join(",") === choice);
      if (option?.correct) count++;
    });
    return count;
  }, [scenarioChoices]);

  function chooseScenario(id: ScenarioId, keys: string[]) {
    setScenarioChoices((prev) => ({ ...prev, [id]: keys.join(",") }));
  }

  function togglePhrase(phrase: string) {
    setSelectedPhrases((prev) =>
      prev.includes(phrase) ? prev.filter((p) => p !== phrase) : [...prev, phrase]
    );
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setScenarioChoices({ "fire-lawyer": null, "self-represent": null, settlement: null, afford: null });
    setSelectedPhrases([RESPONSE_PARTS[0].phrases[0], RESPONSE_PARTS[1].phrases[0], RESPONSE_PARTS[2].phrases[0]]);
    setMistakes({ "distress-answer": false, "specific-org": false, silence: false });
  }

  const draftResponse = useMemo(() => {
    if (selectedPhrases.length === 0) return "(Select at least one phrase to build a response.)";
    return selectedPhrases.join(" ");
  }, [selectedPhrases]);

  return (
    <div data-interactive="lawyer-substitution-refusal-router" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart L1 — scope routing</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              The lawyer-substitution refusal router
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Practise refusing legal-strategy questions without refusing the client. Route financial distress to principle-level resources, and keep structural/timing insight in scope.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Decision flow</p>
        <DecisionFlowSvg />
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario router</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          Choose the best response for each client question. The tool flags overreach, omission, and incomplete refusal.
        </p>
        <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.65rem" }}>
          {SCENARIOS.map((scenario) => {
            const choice = scenarioChoices[scenario.id];
            const selectedOption = scenario.options.find((o) => o.keys.join(",") === choice);
            return (
              <div
                key={scenario.id}
                style={{
                  border: `1px solid ${selectedOption ? (selectedOption.correct ? GREEN : VERMILION) : HAIRLINE}`,
                  borderRadius: 8,
                  background: selectedOption ? (selectedOption.correct ? `${GREEN}0A` : `${VERMILION}0A`) : "transparent",
                  padding: "0.85rem",
                }}
              >
                <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600 }}>{scenario.question}</p>
                <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.86rem" }}>{scenario.detail}</p>
                <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.65rem" }}>
                  {scenario.options.map((opt) => {
                    const selected = choice === opt.keys.join(",");
                    return (
                      <button
                        key={opt.keys.join(",")}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => chooseScenario(scenario.id, opt.keys)}
                        style={scenarioOptionStyle(selected, opt.correct)}
                      >
                        <span style={{ flex: "0 0 auto", marginTop: 2 }}>
                          {selected ? (
                            opt.correct ? (
                              <CheckCircle2 size={18} color={GREEN} aria-hidden="true" />
                            ) : (
                              <XCircle size={18} color={VERMILION} aria-hidden="true" />
                            )
                          ) : (
                            <span style={{ display: "inline-block", width: 18, height: 18, borderRadius: 999, border: `2px solid ${HAIRLINE}` }} />
                          )}
                        </span>
                        <span style={{ textAlign: "left", lineHeight: 1.5 }}>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedOption ? (
                  <p style={{ margin: "0.65rem 0 0", color: selectedOption.correct ? GREEN : VERMILION, fontSize: "0.88rem", lineHeight: 1.55 }}>
                    {selectedOption.correct ? <CheckCircle2 size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> : <AlertTriangle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />} {selectedOption.feedback}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === SCENARIOS.length ? GREEN : GOLD }}>
          <ShieldCheck size={16} aria-hidden="true" />
          <span style={{ fontWeight: 600 }}>
            Routed {correctCount} of {SCENARIOS.length} scenarios correctly
          </span>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Refusal-script builder</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          Toggle phrases from each of the three refusal parts. A complete response includes boundary, available content, and distress recognition.
        </p>
        <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.65rem" }}>
          {RESPONSE_PARTS.map((part) => (
            <div key={part.key}>
              <p style={{ margin: 0, color: part.key === "boundary" ? VERMILION : part.key === "available" ? BLUE : part.key === "distress" ? PURPLE : GOLD, fontWeight: 600, fontSize: "0.9rem" }}>
                {part.label}
              </p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.45rem" }}>
                {part.phrases.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    aria-pressed={selectedPhrases.includes(phrase)}
                    onClick={() => togglePhrase(phrase)}
                    style={smallChipStyle(selectedPhrases.includes(phrase), part.key === "boundary" ? VERMILION : part.key === "available" ? BLUE : part.key === "distress" ? PURPLE : GOLD)}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.85rem",
            border: `1px solid ${PURPLE}55`,
            borderRadius: 8,
            background: `${PURPLE}0A`,
            padding: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: PURPLE }}>
            <MessageSquare size={16} aria-hidden="true" />
            <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Draft response</span>
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.75 }}>{draftResponse}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>What stays in scope</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.75rem", marginTop: "0.55rem" }}>
          <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.75rem" }}>
            <span style={{ color: BLUE, fontWeight: 600 }}>Structural reading</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Theme-level confidence for conflict/litigation in the chart.</p>
          </div>
          <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.75rem" }}>
            <span style={{ color: BLUE, fontWeight: 600 }}>Timing windows</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Daśā periods worth watching, stated at their earned confidence tier.</p>
          </div>
          <div style={{ border: `1px solid ${PURPLE}44`, borderRadius: 8, background: `${PURPLE}0A`, padding: "0.75rem" }}>
            <span style={{ color: PURPLE, fontWeight: 600 }}>Emotional support</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Acknowledging distress and the difficulty of litigation.</p>
          </div>
          <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.75rem" }}>
            <span style={{ color: GOLD, fontWeight: 600 }}>Resource categories</span>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>Principle-level routing to local, verifiable legal-aid sources.</p>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}0A` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" checked={active} onChange={() => toggleMistake(s.key)} />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Core discipline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Refuse the question, not the client
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          When a client asks a legal-strategy question — fire the lawyer, self-represent, accept a settlement — the practitioner states the boundary explicitly every time, offers the structural and timing reading that is genuinely available, and acknowledges the underlying distress. Financial stress is routed to principle-level resource categories, never to a specific unverified organisation. Silence is not neutral; the boundary must be named. What remains in scope is real and useful: chart structure, timing windows, and emotional support.
        </p>
      </section>
    </div>
  );
}

function DecisionFlowSvg() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Decision flow for lawyer-substitution questions" style={{ width: "100%", minHeight: 220, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="224" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {/* Client question */}
      <rect x="280" y="30" width="160" height="44" rx="8" fill={`${PURPLE}16`} stroke={PURPLE} />
      <text x="360" y="58" textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="600">Client asks a legal-strategy question</text>

      {/* Diamond */}
      <polygon points="360,100 430,135 360,170 290,135" fill={`${GOLD}16`} stroke={GOLD} strokeWidth="2" />
      <text x="360" y="131" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">Is it about</text>
      <text x="360" y="147" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">legal strategy?</text>

      {/* Yes branch */}
      <path d="M 430 135 L 500 135" stroke={VERMILION} strokeWidth="2" markerEnd="url(#arrowRed)" />
      <text x="465" y="128" fill={VERMILION} fontSize="12" fontWeight="600">Yes</text>
      <rect x="510" y="110" width="170" height="50" rx="8" fill={`${VERMILION}12`} stroke={VERMILION} />
      <text x="595" y="135" textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight="600">Refuse explicitly</text>
      <text x="595" y="151" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">boundary + available + distress</text>

      {/* No branch */}
      <path d="M 290 135 L 220 135" stroke={GREEN} strokeWidth="2" markerEnd="url(#arrowGreen)" />
      <text x="255" y="128" fill={GREEN} fontSize="12" fontWeight="600">No</text>
      <rect x="40" y="110" width="170" height="50" rx="8" fill={`${GREEN}12`} stroke={GREEN} />
      <text x="125" y="135" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="600">Answer normally</text>
      <text x="125" y="151" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">structural / timing</text>

      {/* Bottom note */}
      <rect x="180" y="200" width="360" height="32" rx="8" fill={`${BLUE}0A`} stroke={BLUE} />
      <text x="360" y="221" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight="600">What stays in scope: structure, timing, emotional support, principle-level routing</text>

      <defs>
        <marker id="arrowRed" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill={VERMILION} />
        </marker>
        <marker id="arrowGreen" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} />
        </marker>
      </defs>
    </svg>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  };
}

function scenarioOptionStyle(selected: boolean, correct: boolean): CSSProperties {
  const color = selected ? (correct ? GREEN : VERMILION) : HAIRLINE;
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.7rem",
    textAlign: "left",
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: selected ? (correct ? `${GREEN}0A` : `${VERMILION}0A`) : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
