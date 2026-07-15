"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  Calculator,
  HelpCircle,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "kpReady" | "partial" | "missing" | "repeat" | "overlay";
type CriterionKey = "compute" | "failureModes" | "selfLocation" | "stakes";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "var(--gl-vermilion-accent)";
const PURPLE = "#6B5AA8";

const CRITERIA: Record<CriterionKey, { label: string; body: string; icon: ReactNode; color: string }> = {
  compute: {
    label: "Verified computation",
    body: "Can run the selected system unaided and cross-check a real worked example.",
    icon: <Calculator size={16} />,
    color: BLUE,
  },
  failureModes: {
    label: "Failure-mode fluency",
    body: "Can name why overlay override, mixed lagna sources, and silent non-confirmation fail.",
    icon: <BookOpenCheck size={16} />,
    color: GOLD,
  },
  selfLocation: {
    label: "Honest self-location",
    body: "Discloses which systems are independently usable and which are only recognized.",
    icon: <UserCheck size={16} />,
    color: GREEN,
  },
  stakes: {
    label: "Elevated-stakes readiness",
    body: "Already knows lost-object and missing-person consultation discipline before live pressure.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
};

const SCENARIOS: Record<
  ScenarioKey,
  {
    label: string;
    prompt: string;
    questionSide: string;
    practitionerSide: string;
    recommendation: string;
    defaultChecks: Record<CriterionKey, boolean>;
    spontaneous: boolean;
    nonRepeated: boolean;
    color: string;
    icon: ReactNode;
  }
> = {
  kpReady: {
    label: "KP-only readiness",
    prompt: "A marriage question arrives. The learner can independently run KP, but not Parashari or Tajika.",
    questionSide: "Genuine, bounded, first-time question.",
    practitionerSide: "Qualified for KP only; scope must be disclosed.",
    recommendation: "Proceed as a disclosed KP-only reading.",
    defaultChecks: { compute: true, failureModes: true, selfLocation: true, stakes: true },
    spontaneous: true,
    nonRepeated: true,
    color: GREEN,
    icon: <BadgeCheck size={16} />,
  },
  partial: {
    label: "Partial scaffolding",
    prompt: "The learner recognizes all three systems but has never computed a fresh Parashari or Tajika example.",
    questionSide: "Question is valid, but the promised multi-system reading exceeds competence.",
    practitionerSide: "Literacy exists; multi-system authority does not.",
    recommendation: "Narrow the offer or refer for unsupported systems.",
    defaultChecks: { compute: false, failureModes: true, selfLocation: true, stakes: true },
    spontaneous: true,
    nonRepeated: true,
    color: GOLD,
    icon: <Route size={16} />,
  },
  missing: {
    label: "Missing-person pressure",
    prompt: "A distressed querent asks where a missing person is and whether they are alive.",
    questionSide: "Urgent and real, but ethically elevated.",
    practitionerSide: "Must already know authority involvement, no life-or-death verdict, and careful wording.",
    recommendation: "Refer to real authorities and avoid chart-derived life/death claims.",
    defaultChecks: { compute: true, failureModes: true, selfLocation: true, stakes: false },
    spontaneous: true,
    nonRepeated: true,
    color: VERMILION,
    icon: <AlertTriangle size={16} />,
  },
  repeat: {
    label: "Repeated anxiety question",
    prompt: "The same querent asks the same question again after not liking the first answer.",
    questionSide: "Fails the non-repetition bar.",
    practitionerSide: "Even a skilled practitioner should not cast again.",
    recommendation: "Do not cast; reframe toward support and prior answer discipline.",
    defaultChecks: { compute: true, failureModes: true, selfLocation: true, stakes: true },
    spontaneous: true,
    nonRepeated: false,
    color: VERMILION,
    icon: <HelpCircle size={16} />,
  },
  overlay: {
    label: "RP overclaim",
    prompt: "An RP overlay confirms a primary verdict and the learner wants to upgrade confidence.",
    questionSide: "Valid question, but method boundaries are at risk.",
    practitionerSide: "Overlay may confirm or tension-check; it cannot inflate the verdict.",
    recommendation: "Proceed only with disclosed overlay limits and unchanged confidence.",
    defaultChecks: { compute: true, failureModes: false, selfLocation: true, stakes: true },
    spontaneous: true,
    nonRepeated: true,
    color: PURPLE,
    icon: <Scale size={16} />,
  },
};

export function PrashnaEthicalLiteracyBar() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("partial");
  const [checks, setChecks] = useState<Record<CriterionKey, boolean>>(SCENARIOS.partial.defaultChecks);
  const [spontaneous, setSpontaneous] = useState(SCENARIOS.partial.spontaneous);
  const [nonRepeated, setNonRepeated] = useState(SCENARIOS.partial.nonRepeated);

  const scenario = SCENARIOS[scenarioKey];
  const clearedCount = Object.values(checks).filter(Boolean).length;
  const practitionerClears = clearedCount === 4;
  const questionClears = spontaneous && nonRepeated;

  const outcome = useMemo(() => {
    if (!questionClears) return { label: "Do not cast", color: VERMILION, body: "The question-side bar fails. Competence cannot substitute for non-spontaneous or repeated asking." };
    if (!checks.stakes && scenarioKey === "missing") return { label: "Refer and protect", color: VERMILION, body: "The missing-person discipline must already be automatic before the consultation begins." };
    if (!practitionerClears) return { label: "Narrow or refer", color: GOLD, body: "Literacy is not the same as authority. Disclose the boundary and offer only the stream you can run." };
    return { label: "Proceed with disclosure", color: GREEN, body: scenario.recommendation };
  }, [checks.stakes, practitionerClears, questionClears, scenario.recommendation, scenarioKey]);

  const selectScenario = (key: ScenarioKey) => {
    const next = SCENARIOS[key];
    setScenarioKey(key);
    setChecks(next.defaultChecks);
    setSpontaneous(next.spontaneous);
    setNonRepeated(next.nonRepeated);
  };

  return (
    <div data-interactive="prashna-ethical-literacy-bar" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Prashna literacy bar</p>
            <h2 style={headingStyle}>Check competence, question fitness, and disclosed scope before casting</h2>
            <p style={bodyStyle}>
              Use the lesson&apos;s four practitioner criteria alongside the mirrored question-side bar: genuine, spontaneous, and not repeatedly re-asked.
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectScenario("partial")}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <p style={eyebrowStyle}>Two-sided gate</p>
          <LiteracyGateDiagram
            scenario={scenario}
            practitionerClears={practitionerClears}
            questionClears={questionClears}
            outcomeColor={outcome.color}
            outcomeLabel={outcome.label}
            clearedCount={clearedCount}
          />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: scenario.color }}>
            {scenario.icon}
            <p style={eyebrowStyle}>{scenario.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{scenario.prompt}</h3>
          <p style={bodyStyle}>Question side: {scenario.questionSide}</p>
          <p style={bodyStyle}>Practitioner side: {scenario.practitionerSide}</p>
          <div style={{ ...noticeStyle(outcome.color), marginTop: "1rem" }}>
            {outcome.color === GREEN ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{outcome.body}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scenario selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" onClick={() => selectScenario(key)} aria-pressed={scenarioKey === key} style={choiceButtonStyle(scenarioKey === key, SCENARIOS[key].color)}>
                {SCENARIOS[key].icon}
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{SCENARIOS[key].label}</span>
                  <span style={smallTextStyle}>{SCENARIOS[key].recommendation}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Practitioner-side criteria</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            {(Object.keys(CRITERIA) as CriterionKey[]).map((key) => (
              <ToggleRow
                key={key}
                checked={checks[key]}
                onChange={(checked) => setChecks((current) => ({ ...current, [key]: checked }))}
                label={CRITERIA[key].label}
                body={CRITERIA[key].body}
                icon={CRITERIA[key].icon}
                color={CRITERIA[key].color}
              />
            ))}
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Question-side mirror bar</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={spontaneous} onChange={setSpontaneous} label="Genuine and spontaneous" body="Asked because the querent truly wants to know, not as a test or performance." icon={<Sparkles size={16} />} color={BLUE} />
            <ToggleRow checked={nonRepeated} onChange={setNonRepeated} label="Not repeatedly re-asked" body="A second chart cannot be used to escape the first answer." icon={<RefreshCw size={16} />} color={GOLD} />
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
            {outcome.color === GREEN ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={outcome.color} />}
            <div>
              <p style={eyebrowStyle}>Ethical frame</p>
              <h3 style={{ ...panelTitleStyle, color: outcome.color }}>{outcome.label}</h3>
              <p style={bodyStyle}>{outcome.body}</p>
              <p style={smallTextStyle}>
                The bar is per system: readiness in KP does not silently become readiness in Parashari or Tajika.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrashnaEthicalLiteracyBar;

function LiteracyGateDiagram({
  scenario,
  practitionerClears,
  questionClears,
  outcomeColor,
  outcomeLabel,
  clearedCount,
}: {
  scenario: (typeof SCENARIOS)[ScenarioKey];
  practitionerClears: boolean;
  questionClears: boolean;
  outcomeColor: string;
  outcomeLabel: string;
  clearedCount: number;
}) {
  return (
    <svg viewBox="0 0 860 430" role="img" aria-label="Prashna literacy bar gate diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="840" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="430" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Both sides must clear before a prashna chart is cast</text>

      <path d="M176 116 C240 82, 312 82, 376 116" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M484 116 C548 82, 620 82, 684 116" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <line x1="376" y1="185" x2="484" y2="185" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="7 8" />
      <line x1="430" y1="232" x2="430" y2="302" stroke={outcomeColor} strokeWidth="2" strokeDasharray="7 8" />

      <circle cx="276" cy="182" r="86" fill={softFill(questionClears ? GREEN : VERMILION)} stroke={questionClears ? GREEN : VERMILION} strokeWidth="1.8" />
      <text x="276" y="160" textAnchor="middle" fill={questionClears ? GREEN : VERMILION} fontSize="13" fontWeight="500">Question bar</text>
      <text x="276" y="184" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{questionClears ? "spontaneous + non-repeated" : "repair before casting"}</text>
      <text x="276" y="207" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">{scenario.questionSide}</text>

      <circle cx="584" cy="182" r="86" fill={softFill(practitionerClears ? GREEN : GOLD)} stroke={practitionerClears ? GREEN : GOLD} strokeWidth="1.8" />
      <text x="584" y="160" textAnchor="middle" fill={practitionerClears ? GREEN : GOLD} fontSize="13" fontWeight="500">Practitioner bar</text>
      <text x="584" y="184" textAnchor="middle" fill={INK_MUTED} fontSize="10.5">{clearedCount}/4 criteria clear</text>
      <text x="584" y="207" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">scope must match competence</text>

      <rect x="285" y="302" width="290" height="58" rx="8" fill={softFill(outcomeColor)} stroke={outcomeColor} />
      <text x="430" y="326" textAnchor="middle" fill={outcomeColor} fontSize="13" fontWeight="500">{outcomeLabel}</text>
      <text x="430" y="348" textAnchor="middle" fill={INK_MUTED} fontSize="10">{scenario.label}</text>
    </svg>
  );
}

function ToggleRow({
  checked,
  onChange,
  label,
  body,
  icon,
  color,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  body: string;
  icon: ReactNode;
  color: string;
}) {
  return (
    <label style={toggleStyle(checked, color)}>
      <span style={{ color: checked ? color : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: ACCENT }} />
    </label>
  );
}

function softFill(color: string) {
  if (color.startsWith("#")) return `${color}18`;
  return "rgba(184, 132, 33, 0.12)";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.76rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 920,
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_SECONDARY,
  padding: "0.55rem 0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  cursor: "pointer",
  fontWeight: 500,
};

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : "#FFFFFF",
    color: active ? color : INK_SECONDARY,
    padding: "0.7rem",
    cursor: "pointer",
    display: "flex",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
  };
}

function toggleStyle(checked: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${checked ? color : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? softFill(color) : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};
