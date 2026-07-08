"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  RefreshCcw,
  ShieldAlert,
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

type ScenarioId = "urgent" | "general" | "wrong-chart" | "birth-unknown";
type ScenarioChoice = "natal" | "horary" | "scope" | "decline";

type Scenario = {
  id: ScenarioId;
  prompt: string;
  correct: ScenarioChoice;
  label: string;
  explanation: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "urgent",
    prompt:
      "A client texts: 'My hearing is tomorrow morning. I need to know how it will go.' They have a reliable birth time but want a specific answer about this hearing.",
    correct: "scope",
    label: "Orientation first, then appropriate referral",
    explanation:
      "This is the natural fit for KP horary, but this lesson is scoped as orientation only. A responsible reply explains the concept and either defers to T2-15-level competence or offers what the natal chart can legitimately cover.",
  },
  {
    id: "general",
    prompt:
      "A client asks: 'What does my birth chart say about my overall tendency toward litigation and how I handle conflict?''",
    correct: "natal",
    label: "Natal cuspal analysis",
    explanation:
      "This is a life-domain question about the native's general pattern. The natal chart's 6th-house profile (Lessons 11.3.1-11.3.2) is the right tool.",
  },
  {
    id: "wrong-chart",
    prompt:
      "A learner says: 'Chart L1's 6th cusp sub-lord is Ketu, so the horary answer is NO.'",
    correct: "decline",
    label: "Reject the reframing",
    explanation:
      "Chart L1 is a natal chart. Applying horary terminology to its natal cuspal finding conflates two different chart types. The natal analysis stands on its own terms.",
  },
  {
    id: "birth-unknown",
    prompt:
      "A client says: 'I don't know my birth time, but I need guidance on a specific legal letter I'm sending today.'",
    correct: "horary",
    label: "Horary is conceptually appropriate",
    explanation:
      "KP horary is designed for exactly this situation: a specific question, a known moment, no birth details required. Operational competence still requires T2-15.",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "sufficient",
    label: "This introduction is enough to field a real case-outcome horary question.",
    correction:
      "This lesson is orientation only. Full Ruling Planets computation, the 1-249 protocol, and horary-specific disposition rules require T2-15.",
  },
  {
    key: "relabel",
    label: "A natal cuspal finding can be relabelled as a horary verdict when the logic looks similar.",
    correction:
      "Natal and horary are different chart types answering different questions. The same underlying logic applies to different charts, not across them.",
  },
  {
    key: "fabricate",
    label: "It is acceptable to invent a plausible moment of question to demonstrate horary.",
    correction:
      "This curriculum does not fabricate unverified chart-specific computations. Genuine worked examples belong in T2-15.",
  },
] as const;

const PHRASE_OPTIONS = [
  {
    key: "concept",
    label: "Horary is cast for the moment the specific question arises.",
  },
  {
    key: "birth",
    label: "It can work without an exact birth time.",
  },
  {
    key: "scope-limit",
    label: "Full case-outcome horary practice requires further dedicated training.",
  },
  {
    key: "offer-natal",
    label: "I can still offer the natal-chart litigation-domain reading we already have.",
  },
  {
    key: "narrow",
    label: "It answers a narrow, specific question rather than a general life pattern.",
  },
];

export function KpCaseOutcomeHoraryIntro() {
  const [scenarioChoices, setScenarioChoices] = useState<Record<ScenarioId, ScenarioChoice | null>>({
    urgent: null,
    general: null,
    "wrong-chart": null,
    "birth-unknown": null,
  });
  const [selectedPhraseKeys, setSelectedPhraseKeys] = useState<string[]>([
    "concept",
    "birth",
    "narrow",
    "scope-limit",
    "offer-natal",
  ]);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    sufficient: false,
    relabel: false,
    fabricate: false,
  });

  const scenarioScore = useMemo(() => {
    let score = 0;
    SCENARIOS.forEach((s) => {
      if (scenarioChoices[s.id] === s.correct) score++;
    });
    return score;
  }, [scenarioChoices]);

  function chooseScenario(id: ScenarioId, choice: ScenarioChoice) {
    setScenarioChoices((prev) => ({ ...prev, [id]: choice }));
  }

  function togglePhrase(key: string) {
    setSelectedPhraseKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setScenarioChoices({ urgent: null, general: null, "wrong-chart": null, "birth-unknown": null });
    setSelectedPhraseKeys(["concept", "birth", "narrow", "scope-limit", "offer-natal"]);
    setMistakes({ sufficient: false, relabel: false, fabricate: false });
  }

  const clientScript = useMemo(() => {
    const pieces = PHRASE_OPTIONS.filter((p) => selectedPhraseKeys.includes(p.key)).map((p) => p.label);
    if (pieces.length === 0) return "(Select at least one phrase to build a response.)";
    return pieces.join(" ");
  }, [selectedPhraseKeys]);

  return (
    <div data-interactive="kp-case-outcome-horary-intro" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart L1 — KP litigation horary introduction</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Natal cuspal analysis vs. horary: know which chart answers which question
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              This is a conceptual scoping tool. It does not cast or fabricate a horary chart; it practises distinguishing the natal method from the horary method and responding honestly to client urgency.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Natal cuspal analysis</p>
          <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.12rem", fontWeight: 600 }}>
            Chart L1 — a fixed birth chart
          </h3>
          <ul style={{ margin: "0.55rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
            <li>Reads the native&apos;s general litigation-domain condition.</li>
            <li>Uses the birth chart&apos;s own 6th cusp and significators.</li>
            <li>Answers life-pattern questions, not a single hearing.</li>
            <li>Needs an accurate birth time to be reliable.</li>
          </ul>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>KP horary</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.12rem", fontWeight: 600 }}>
            Cast for the moment of the question
          </h3>
          <ul style={{ margin: "0.55rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
            <li>Answers a specific, narrow, YES/NO-shaped question.</li>
            <li>Uses the question&apos;s own moment or a selected 1-249 number.</li>
            <li>Does not require the querent&apos;s birth details.</li>
            <li>Full methodology belongs to T2-15.</li>
          </ul>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Conceptual diagram</p>
        <MethodSvg />
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario classifier</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          Pick the most honest conceptual response for each situation. The tool shows whether your choice fits the lesson&apos;s scope.
        </p>
        <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.65rem" }}>
          {SCENARIOS.map((scenario) => {
            const choice = scenarioChoices[scenario.id];
            const isCorrect = choice === scenario.correct;
            const isAnswered = choice !== null;
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
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{scenario.prompt}</p>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
                  {[
                    { key: "natal", label: "Natal cuspal reading" },
                    { key: "horary", label: "Horary conceptually" },
                    { key: "scope", label: "Orientation + scope check" },
                    { key: "decline", label: "Reject reframing" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      aria-pressed={choice === opt.key}
                      onClick={() => chooseScenario(scenario.id, opt.key as ScenarioChoice)}
                      style={smallChipStyle(choice === opt.key, opt.key === scenario.correct ? GREEN : VERMILION)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {isAnswered ? (
                  <div style={{ marginTop: "0.65rem", display: "flex", alignItems: "start", gap: "0.5rem", color: isCorrect ? GREEN : VERMILION }}>
                    {isCorrect ? <CheckCircle2 size={16} aria-hidden="true" /> : <XCircle size={16} aria-hidden="true" />}
                    <div>
                      <span style={{ fontWeight: 600 }}>{scenario.label}</span>
                      <p style={{ margin: "0.2rem 0 0", color: isCorrect ? INK_SECONDARY : VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
                        {scenario.explanation}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.85rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: scenarioScore === SCENARIOS.length ? GREEN : GOLD,
          }}
        >
          <Clock size={16} aria-hidden="true" />
          <span style={{ fontWeight: 600 }}>
            Classified {scenarioScore} of {SCENARIOS.length} scenarios correctly
          </span>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Client-response builder</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          Toggle phrases to assemble an honest reply to a client who wants urgent case guidance. The script stays within this lesson&apos;s scope: orientation, not a fabricated prediction.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.65rem" }}>
          {PHRASE_OPTIONS.map((phrase) => (
            <button
              key={phrase.key}
              type="button"
              aria-pressed={selectedPhraseKeys.includes(phrase.key)}
              onClick={() => togglePhrase(phrase.key)}
              style={smallChipStyle(selectedPhraseKeys.includes(phrase.key), BLUE)}
            >
              {phrase.label}
            </button>
          ))}
        </div>
        <div
          style={{
            marginTop: "0.85rem",
            border: `1px solid ${BLUE}55`,
            borderRadius: 8,
            background: `${BLUE}0A`,
            padding: "0.85rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE }}>
            <MessageSquare size={16} aria-hidden="true" />
            <span style={{ fontWeight: 600, fontSize: "0.92rem" }}>Draft response</span>
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>{clientScript}</p>
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
        <p style={eyebrowStyle}>Scope gate</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.15rem", fontWeight: 600 }}>
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Can I answer a real case-outcome horary question after this lesson?
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          No. This lesson is orientation. You can explain the conceptual fit, distinguish natal from horary, and respond to a client honestly. Actually casting a horary chart, selecting Ruling Planets, applying the 1-249 protocol, and rendering a cuspal sub-lord verdict require the full T2-15 Praśna/Horary module. Treat this introduction as the boundary marker, not the toolkit.
        </p>
      </section>
    </div>
  );
}

function MethodSvg() {
  return (
    <svg viewBox="0 0 720 220" role="img" aria-label="Natal cuspal method compared with KP horary method" style={{ width: "100%", minHeight: 200, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="184" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {/* Natal track */}
      <rect x="44" y="50" width="280" height="120" rx="8" fill={`${BLUE}0A`} stroke={BLUE} strokeWidth="1.5" />
      <text x="184" y="80" textAnchor="middle" fill={BLUE} fontSize="18" fontWeight="600">Natal cuspal method</text>
      <text x="184" y="104" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">Birth chart</text>
      <text x="184" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">6th cusp + significators</text>
      <text x="184" y="144" textAnchor="middle" fill={INK_MUTED} fontSize="13">General litigation-domain condition</text>

      {/* Horary track */}
      <rect x="396" y="50" width="280" height="120" rx="8" fill={`${GOLD}0A`} stroke={GOLD} strokeWidth="1.5" />
      <text x="536" y="80" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="600">KP horary method</text>
      <text x="536" y="104" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">Moment-of-question chart</text>
      <text x="536" y="124" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">Ruling Planets + 1-249 / moment</text>
      <text x="536" y="144" textAnchor="middle" fill={INK_MUTED} fontSize="13">Specific YES/NO case question</text>

      {/* Central boundary */}
      <line x1="360" y1="60" x2="360" y2="160" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 5" />
      <text x="360" y="176" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="600">Different chart types, different questions</text>

      {/* Arrows pointing to their own questions */}
      <path d="M 184 170 L 184 185" stroke={BLUE} strokeWidth="2" markerEnd="url(#arrowBlue)" />
      <path d="M 536 170 L 536 185" stroke={GOLD} strokeWidth="2" markerEnd="url(#arrowGold)" />

      <defs>
        <marker id="arrowBlue" markerWidth="7" markerHeight="7" refX="3.5" refY="6" orient="auto">
          <path d="M0,0 L3.5,7 L7,0 Z" fill={BLUE} />
        </marker>
        <marker id="arrowGold" markerWidth="7" markerHeight="7" refX="3.5" refY="6" orient="auto">
          <path d="M0,0 L3.5,7 L7,0 Z" fill={GOLD} />
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
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
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

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
  alignItems: "stretch",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
