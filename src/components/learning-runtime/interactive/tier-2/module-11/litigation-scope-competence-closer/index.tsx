"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  RefreshCcw,
  Scale,
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

type ScenarioId = "plea-deal" | "settlement" | "custody-safety" | "chart-timing" | "fire-lawyer";
type ScenarioCategory = "criminal" | "legal-strategy" | "custody-safety" | "in-scope" | "legal-strategy";

type Scenario = {
  id: ScenarioId;
  question: string;
  detail: string;
  category: ScenarioCategory;
  response: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "plea-deal",
    question: "Should I take the plea deal my lawyer is recommending?",
    detail: "Client is facing criminal charges.",
    category: "criminal",
    response:
      "This is exactly the kind of decision I'm not the right person to weigh in on. Whether to take a plea depends on the specific evidence, charges, and your defense attorney's professional judgment. I can speak to the period's general character, but please don't let that factor into the plea decision — that belongs with your lawyer.",
  },
  {
    id: "settlement",
    question: "Should I accept the settlement offer in my contract dispute?",
    detail: "Civil commercial litigation.",
    category: "legal-strategy",
    response:
      "Settlement decisions need your attorney's case-specific judgment. What I can offer is a read on the chart's structural pattern around this conflict and the timing windows that look significant — useful information, but not legal-strategy information.",
  },
  {
    id: "custody-safety",
    question: "I'm worried my child isn't safe with the other parent. Will I win custody?",
    detail: "Family-court dispute with a safety concern.",
    category: "custody-safety",
    response:
      "That safety concern takes priority over the chart reading right now. Please raise it immediately with your family-law attorney and, if there is any immediate danger, with emergency or protective services. The custody outcome question itself is also outside what astrology can answer.",
  },
  {
    id: "chart-timing",
    question: "What does my chart show about the timing pressure in this dispute?",
    detail: "Client accepts the legal-strategy boundary.",
    category: "in-scope",
    response:
      "That is in scope. I can discuss the daśā windows that look most significant for a turn in the matter and the structural theme-strength of the 6th house — stated with the appropriate confidence tiers and disclosed tensions.",
  },
  {
    id: "fire-lawyer",
    question: "Should I fire my lawyer and represent myself?",
    detail: "Active litigation, financial and trust strain.",
    category: "legal-strategy",
    response:
      "That's not a question I can answer from a chart. The decision needs legal expertise and your own judgment about your specific situation. I can offer structural and timing insight, and I hear that money and trust are wearing on you — those concerns deserve attention on their own terms.",
  },
];

const CATEGORY_CHOICES: Array<{ key: ScenarioCategory; label: string; color: string }> = [
  { key: "criminal", label: "Criminal defense — zero-softening refusal", color: VERMILION },
  { key: "legal-strategy", label: "General legal strategy — refer out", color: GOLD },
  { key: "custody-safety", label: "Custody + safety concern — safety first", color: PURPLE },
  { key: "in-scope", label: "In scope — structural / timing reading", color: GREEN },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "hedge-criminal",
    label: "In criminal-defense contexts, hedged language is safer than a direct refusal.",
    correction:
      "Heightened stakes require zero softening on the boundary itself, even while the response stays warm.",
  },
  {
    key: "safety-momentum",
    label: "If a safety concern arises, it is okay to finish the chart reading before addressing it.",
    correction:
      "A genuine safety concern takes priority immediately. The consultation format should not delay routing to legal/protective help.",
  },
  {
    key: "custody-complete",
    label: "This lesson fully prepares a practitioner for regular custody-battle consultations.",
    correction:
      "The curriculum has disclosed that further trauma-informed specialist input is still needed for this specific sub-case.",
  },
] as const;

export function LitigationScopeCompetenceCloser() {
  const [classifications, setClassifications] = useState<Record<ScenarioId, ScenarioCategory | null>>({
    "plea-deal": null,
    settlement: null,
    "custody-safety": null,
    "chart-timing": null,
    "fire-lawyer": null,
  });
  const [expandedScenario, setExpandedScenario] = useState<ScenarioId | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "hedge-criminal": false,
    "safety-momentum": false,
    "custody-complete": false,
  });

  const correctCount = useMemo(() => {
    let count = 0;
    SCENARIOS.forEach((s) => {
      if (classifications[s.id] === s.category) count++;
    });
    return count;
  }, [classifications]);

  function classify(id: ScenarioId, category: ScenarioCategory) {
    setClassifications((prev) => ({ ...prev, [id]: category }));
    setExpandedScenario(id);
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setClassifications({ "plea-deal": null, settlement: null, "custody-safety": null, "chart-timing": null, "fire-lawyer": null });
    setExpandedScenario(null);
    setMistakes({ "hedge-criminal": false, "safety-momentum": false, "custody-complete": false });
  }

  return (
    <div data-interactive="litigation-scope-competence-closer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 11 closure — scope of competence</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Legal strategy, criminal defense, and family-court boundaries
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Classify each client question into the correct scope category and see the response template. This closer reinforces that the discipline cuts both ways: against over-reach and against cold under-engagement.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Competence map</p>
        <CompetenceMapSvg />
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario classifier</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          For each question, select the correct scope category. The tool reveals the response template and explains why.
        </p>
        <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.65rem" }}>
          {SCENARIOS.map((scenario) => {
            const chosen = classifications[scenario.id];
            const isCorrect = chosen === scenario.category;
            const isAnswered = chosen !== null;
            const expanded = expandedScenario === scenario.id;
            return (
              <div
                key={scenario.id}
                style={{
                  border: `1px solid ${isAnswered ? (isCorrect ? GREEN : VERMILION) : HAIRLINE}`,
                  borderRadius: 8,
                  background: isAnswered ? (isCorrect ? `${GREEN}0A` : `${VERMILION}0A`) : "transparent",
                  padding: "0.85rem",
                }}
              >
                <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600 }}>{scenario.question}</p>
                <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.86rem" }}>{scenario.detail}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                  {CATEGORY_CHOICES.map((cat) => {
                    const selected = chosen === cat.key;
                    return (
                      <button
                        key={cat.key}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => classify(scenario.id, cat.key)}
                        style={smallChipStyle(selected, cat.color)}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
                {isAnswered ? (
                  <div style={{ marginTop: "0.65rem" }}>
                    <p style={{ margin: 0, color: isCorrect ? GREEN : VERMILION, fontWeight: 600 }}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Correct category
                        </>
                      ) : (
                        <>
                          <XCircle size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Incorrect category
                        </>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => setExpandedScenario(expanded ? null : scenario.id)}
                      style={{
                        marginTop: "0.45rem",
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        color: BLUE,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "0.88rem",
                      }}
                    >
                      {expanded ? "Hide response template" : "Show response template"}
                    </button>
                    {expanded ? (
                      <div
                        style={{
                          marginTop: "0.55rem",
                          border: `1px solid ${BLUE}44`,
                          borderRadius: 8,
                          background: `${BLUE}0A`,
                          padding: "0.75rem",
                        }}
                      >
                        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.7 }}>{scenario.response}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === SCENARIOS.length ? GREEN : GOLD }}>
          <ShieldCheck size={16} aria-hidden="true" />
          <span style={{ fontWeight: 600 }}>
            Classified {correctCount} of {SCENARIOS.length} correctly
          </span>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Response template guide</p>
        <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.55rem" }}>
          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: VERMILION }}>
              <ShieldAlert size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Criminal defense</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.6 }}>
              State the boundary with zero softening. Plea deals, testimony strategy, and case-outcome likelihood belong only to the defense attorney. Offer general chart character only after the boundary is crystal clear.
            </p>
          </div>
          <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GOLD }}>
              <Scale size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>General legal strategy</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.6 }}>
              Motions, settlements, evidence response, witness choice, contract interpretation, firing a lawyer — all refer out. Offer structural and timing insight that remains in scope.
            </p>
          </div>
          <div style={{ border: `1px solid ${PURPLE}44`, borderRadius: 8, background: `${PURPLE}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: PURPLE }}>
              <HeartHandshake size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Custody + safety concern</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.6 }}>
              Safety takes priority over the consultation. Route immediately to the family-law attorney and, if needed, protective services. Be gentle, but do not delay. Acknowledge the curriculum&apos;s own disclosed limit on trauma-informed specialist input.
            </p>
          </div>
          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: GREEN }}>
              <CheckCircle2 size={16} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>In scope</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.6 }}>
              Structural theme-strength, timing windows, emotional support, and principle-level resource routing remain genuinely available once legal-strategy questions are set aside.
            </p>
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
        <p style={eyebrowStyle}>Module 11 throughline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Discipline cuts both ways
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          Across four chapters, Module 11 built a rich technical case: a strong classical 6th house, a precise Mars–Saturn dynamic, an honestly-disclosed KP divergence, and tested daśā windows. None of that richness licenses a chart to answer a lawyer&apos;s question. The same discipline also refuses a cold, minimal engagement that abandons a client&apos;s need for structural insight, timing guidance, and warm support. The module closes by holding both boundaries: no over-reach into legal strategy, no under-reach into the human being in front of us.
        </p>
      </section>
    </div>
  );
}

function CompetenceMapSvg() {
  return (
    <svg viewBox="0 0 720 260" role="img" aria-label="Competence map: in-scope circle surrounded by refer-out legal strategy ring, with criminal and custody safety zones highlighted" style={{ width: "100%", minHeight: 220, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="224" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {/* In-scope center */}
      <circle cx="360" cy="130" r={48} fill={`${GREEN}16`} stroke={GREEN} strokeWidth="2" />
      <text x="360" y="125" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="600">In scope</text>
      <text x="360" y="143" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">structure / timing</text>

      {/* Legal-strategy ring */}
      <circle cx="360" cy="130" r={88} fill="none" stroke={GOLD} strokeWidth="2" strokeDasharray="6 5" />
      <text x="360" y="60" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="600">Legal strategy — refer out</text>

      {/* Criminal zone */}
      <path d="M 445 130 A 88 88 0 0 1 520 80" fill="none" stroke={VERMILION} strokeWidth="6" strokeLinecap="round" />
      <circle cx="540" cy="70" r={24} fill={`${VERMILION}16`} stroke={VERMILION} strokeWidth="2" />
      <text x="540" y="66" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="600">Criminal</text>
      <text x="540" y="79" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="600">defense</text>

      {/* Custody zone */}
      <path d="M 275 130 A 88 88 0 0 1 200 80" fill="none" stroke={PURPLE} strokeWidth="6" strokeLinecap="round" />
      <circle cx="180" cy="70" r={24} fill={`${PURPLE}16`} stroke={PURPLE} strokeWidth="2" />
      <text x="180" y="66" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">Custody</text>
      <text x="180" y="79" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">safety</text>

      {/* Legend */}
      <g transform={`translate(40, 210)`}>
        {[
          { label: "In scope", color: GREEN },
          { label: "Refer out", color: GOLD },
          { label: "Criminal — zero softening", color: VERMILION },
          { label: "Custody — safety first", color: PURPLE },
        ].map((item, i) => (
          <g key={item.label} transform={`translate(${i * 160}, 0)`}>
            <rect width="14" height="14" rx="3" fill={item.color} />
            <text x="20" y="12" fill={INK_SECONDARY} fontSize="11" fontWeight="600">
              {item.label}
            </text>
          </g>
        ))}
      </g>
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
