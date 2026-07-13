"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Handshake,
  MapPinned,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  Swords,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ScenarioKey = "exam" | "merger" | "competitor" | "flight";
type TypeKey = "achievement" | "cooperative" | "adversarial" | "recovery" | "novel";

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

const TYPES: Record<TypeKey, { label: string; shape: string; template: string; support: string; negate: string; color: string; icon: ReactNode }> = {
  achievement: { label: "Personal achievement", shape: "One party, no counterpart", template: "Job template", support: "6 / 10 / 11", negate: "5 / 9 / 12", color: BLUE, icon: <BriefcaseBusiness size={16} /> },
  cooperative: { label: "Cooperative dyadic bond", shape: "Two parties, aligned outcome", template: "Marriage template", support: "2 / 7 / 11", negate: "1 / 6 / 10", color: GREEN, icon: <Handshake size={16} /> },
  adversarial: { label: "Adversarial contest", shape: "Two parties, opposed interests", template: "Litigation template", support: "1 / 6 / 11", negate: "5 / 8 / 12", color: VERMILION, icon: <Swords size={16} /> },
  recovery: { label: "Object/location recovery", shape: "Thing or place, not a person", template: "Lost-object template", support: "2 / 11", negate: "6 / 8 / 12", color: GOLD, icon: <MapPinned size={16} /> },
  novel: { label: "Boundary construction", shape: "Scheduled process or new structure", template: "Disclosed fresh set", support: "3 / 11", negate: "8 / 12", color: PURPLE, icon: <Route size={16} /> },
};

const SCENARIOS: Record<ScenarioKey, { label: string; question: string; type: TypeKey; why: string }> = {
  exam: {
    label: "Exam result",
    question: "Will this specific competitive exam result favour me?",
    type: "achievement",
    why: "Competitors exist, but the question is about the querent&apos;s own performance.",
  },
  merger: {
    label: "Merger",
    question: "Will my proposed merger with a named rival company go through on favourable terms?",
    type: "cooperative",
    why: "A second party is present, but the intended outcome is mutual formation.",
  },
  competitor: {
    label: "Competitor bid",
    question: "Will my competitor underbid me and win this contract?",
    type: "adversarial",
    why: "One side&apos;s success is structurally the other side&apos;s loss.",
  },
  flight: {
    label: "Flight timing",
    question: "Will the flight I am about to board depart and arrive on schedule?",
    type: "novel",
    why: "This is a scheduled process, not a relationship and not a recoverable object.",
  },
};

export function KpHoraryEventOutcomeClassifierWorkbench() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("exam");
  const [selectedType, setSelectedType] = useState<TypeKey>("achievement");
  const [classifyFirst, setClassifyFirst] = useState(true);
  const [reuseTemplate, setReuseTemplate] = useState(true);
  const [eleventhSupport, setEleventhSupport] = useState(true);
  const [bhavatForAdversary, setBhavatForAdversary] = useState(true);
  const [discloseFresh, setDiscloseFresh] = useState(true);

  const scenario = SCENARIOS[scenarioKey];
  const chosen = TYPES[selectedType];
  const expected = TYPES[scenario.type];
  const matches = selectedType === scenario.type;
  const ready = classifyFirst && reuseTemplate && eleventhSupport && bhavatForAdversary && discloseFresh && matches;

  const feedback = useMemo(() => {
    if (!matches) return `Repair: this scenario is ${expected.label}, not ${chosen.label}. Classify by relational structure, not surface topic.`;
    if (!classifyFirst) return "Repair: run the classification questions before selecting a house-set.";
    if (!reuseTemplate && selectedType !== "novel") return "Repair: reuse a precedent template whenever the structural type already exists.";
    if (!eleventhSupport) return "Repair: the 11th house belongs in the supporting set as fulfilment of desire.";
    if (!bhavatForAdversary && selectedType === "adversarial") return "Repair: adversarial second-party logic needs bhavat-bhavam, not guessed houses.";
    if (!discloseFresh && selectedType === "novel") return "Repair: a fresh house-set must be disclosed as reasoned synthesis, not direct citation.";
    if (selectedType === "novel") return "Boundary case handled cleanly: construct narrowly, include the 11th, and disclose the synthesis.";
    return "Clean classification: the existing precedent template fits, so no new house-set is needed.";
  }, [bhavatForAdversary, chosen.label, classifyFirst, discloseFresh, eleventhSupport, expected.label, matches, reuseTemplate, selectedType]);

  return (
    <div data-interactive="kp-horary-event-outcome-classifier-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP event-outcome classifier</p>
            <h2 style={headingStyle}>Classify the relationship shape before building the house-set</h2>
            <p style={bodyStyle}>
              Choose a question, walk its structural type, and reuse the matching template unless the case is genuinely novel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenarioKey("exam");
              setSelectedType("achievement");
              setClassifyFirst(true);
              setReuseTemplate(true);
              setEleventhSupport(true);
              setBhavatForAdversary(true);
              setDiscloseFresh(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <p style={eyebrowStyle}>Four-type decision tree</p>
          <ClassifierDiagram selected={selectedType} expected={scenario.type} matches={matches} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: chosen.color }}>
            {chosen.icon}
            <p style={eyebrowStyle}>{chosen.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{chosen.template}</h3>
          <p style={bodyStyle}>{chosen.shape}</p>
          <div style={{ ...noticeStyle(chosen.color), marginTop: "1rem" }}>
            <Scale size={18} />
            <span>Support {chosen.support}; negate {chosen.negate}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Scenario selector</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setScenarioKey(key);
                  setSelectedType(SCENARIOS[key].type);
                }}
                aria-pressed={scenarioKey === key}
                style={choiceButtonStyle(scenarioKey === key, TYPES[SCENARIOS[key].type].color)}
              >
                <span style={{ color: TYPES[SCENARIOS[key].type].color }}>{TYPES[SCENARIOS[key].type].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{SCENARIOS[key].label}</span>
                  <span style={smallTextStyle}>{SCENARIOS[key].question}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Type override drill</p>
          <p style={bodyStyle}>{scenario.why}</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
            {(Object.keys(TYPES) as TypeKey[]).map((key) => (
              <button key={key} type="button" onClick={() => setSelectedType(key)} aria-pressed={selectedType === key} style={typeButtonStyle(selectedType === key, TYPES[key].color)}>
                {TYPES[key].icon}
                <span>{TYPES[key].label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Sanity checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={classifyFirst} onChange={setClassifyFirst} label="Classify before constructing" body="Second party? Cooperative or adversarial? Person or object/process?" icon={<Route size={16} />} />
            <ToggleRow checked={reuseTemplate} onChange={setReuseTemplate} label="Reuse matching template" body="Do not derive a new set when one of the four types fits." icon={<BadgeCheck size={16} />} />
            <ToggleRow checked={eleventhSupport} onChange={setEleventhSupport} label="Keep 11th as support" body="Fulfilment of desire is the universal constant." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={bhavatForAdversary} onChange={setBhavatForAdversary} label="Use bhavat-bhavam for adversary" body="Adversarial contests need opponent-derived negation logic." icon={<Swords size={16} />} />
            <ToggleRow checked={discloseFresh} onChange={setDiscloseFresh} label="Disclose fresh constructions" body="Boundary cases are reasoned synthesis, not direct citation." icon={<Scale size={16} />} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Classification result</p>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", marginTop: "0.8rem" }}>
            {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
            <div>
              <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "House-set choice is defensible" : "Repair before judging the chart"}</h3>
              <p style={bodyStyle}>{feedback}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default KpHoraryEventOutcomeClassifierWorkbench;

function ClassifierDiagram({ selected, expected, matches }: { selected: TypeKey; expected: TypeKey; matches: boolean }) {
  const keys: TypeKey[] = ["achievement", "cooperative", "adversarial", "recovery", "novel"];

  return (
    <svg viewBox="0 0 820 430" role="img" aria-label="KP horary event outcome four type decision tree" style={{ width: "100%", minHeight: 350, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Classify by relational structure, then select the precedent template</text>
      <rect x="300" y="76" width="220" height="46" rx="8" fill="#FFFFFF" stroke={HAIRLINE} />
      <text x="410" y="104" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="500">Is a second party involved?</text>
      <path d="M 356 122 C 230 158, 154 188, 118 230 M 464 122 C 584 158, 660 188, 704 230 M 410 122 L 410 206" fill="none" stroke={HAIRLINE} strokeWidth="2" />
      {keys.map((key, index) => {
        const type = TYPES[key];
        const x = [74, 214, 354, 494, 634][index];
        const active = selected === key;
        const correct = expected === key;
        return (
          <g key={key}>
            <rect x={x} y="226" width="112" height="104" rx="8" fill={active ? softFill(type.color) : "#FFFFFF"} stroke={active ? type.color : correct ? GREEN : HAIRLINE} strokeWidth={active || correct ? 1.8 : 1} />
            <text x={x + 56} y="252" textAnchor="middle" fill={active ? type.color : INK_SECONDARY} fontSize="10" fontWeight="500">{type.label}</text>
            <text x={x + 56} y="274" textAnchor="middle" fill={INK_MUTED} fontSize="8.5">{type.template}</text>
            <text x={x + 56} y="296" textAnchor="middle" fill={INK_MUTED} fontSize="8">S: {type.support}</text>
            <text x={x + 56} y="314" textAnchor="middle" fill={INK_MUTED} fontSize="8">N: {type.negate}</text>
          </g>
        );
      })}
      <rect x="252" y="366" width="316" height="36" rx="8" fill={matches ? "#E8F5E9" : "#F9E8E3"} stroke={matches ? GREEN : VERMILION} strokeWidth="1.4" />
      <text x="410" y="389" textAnchor="middle" fill={matches ? GREEN : VERMILION} fontSize="12" fontWeight="500">{matches ? "Selected type matches the scenario" : "Selected type does not fit the structure"}</text>
    </svg>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function softFill(color: string) {
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#EAF1F8";
  if (color === VERMILION) return "#F9E8E3";
  if (color === PURPLE) return "#F0EDF8";
  return "#F7F0E1";
}

const cardStyle: CSSProperties = { background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "1rem", boxShadow: "0 10px 26px rgba(90, 62, 18, 0.07)" };
const eyebrowStyle: CSSProperties = { margin: 0, color: ACCENT, textTransform: "uppercase", letterSpacing: 0, fontSize: "0.78rem", fontWeight: 500 };
const headingStyle: CSSProperties = { margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "clamp(1.35rem, 2vw, 1.85rem)", lineHeight: 1.2, fontWeight: 500 };
const panelTitleStyle: CSSProperties = { margin: "0.45rem 0 0", color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.25, fontWeight: 500 };
const bodyStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.95rem" };
const smallTextStyle: CSSProperties = { display: "block", marginTop: 3, color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.35 };
const softButtonStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, background: "#FFFFFF", color: INK_PRIMARY, borderRadius: 8, padding: "0.6rem 0.85rem", display: "inline-flex", gap: "0.45rem", alignItems: "center", cursor: "pointer", fontWeight: 500 };
const twoColumnStyle: CSSProperties = { display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" };

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", textAlign: "left", display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.65rem", alignItems: "start", border: `1px solid ${active ? color : HAIRLINE}`, background: active ? softFill(color) : "#FFFFFF", color: INK_PRIMARY, borderRadius: 8, padding: "0.72rem", cursor: "pointer" };
}

function typeButtonStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.55rem", alignItems: "center", border: `1px solid ${active ? color : HAIRLINE}`, background: active ? softFill(color) : "#FFFFFF", color: active ? color : INK_SECONDARY, borderRadius: 8, padding: "0.58rem 0.7rem", cursor: "pointer", fontWeight: 500, textAlign: "left" };
}

function toggleStyle(checked: boolean): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr auto", gap: "0.65rem", alignItems: "start", border: `1px solid ${checked ? ACCENT : HAIRLINE}`, background: checked ? "#F7F0E1" : "#FFFFFF", borderRadius: 8, padding: "0.7rem", color: INK_PRIMARY };
}

function noticeStyle(color: string): CSSProperties {
  return { display: "grid", gridTemplateColumns: "22px 1fr", gap: "0.55rem", alignItems: "start", border: `1px solid ${color}`, background: softFill(color), borderRadius: 8, padding: "0.75rem", color, lineHeight: 1.45, fontSize: "0.9rem" };
}
