"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  Hammer,
  Home,
  Layers,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

type Mode = "explore" | "classify";
type TypeKey = "apūrva" | "sa-pūrva" | "dvandva";

interface GprType {
  key: TypeKey;
  label: string;
  short: string;
  description: string;
  pañcāṅga: string;
  vastu: string;
  note: string;
  color: string;
  icon: typeof Home;
}

const TYPES: GprType[] = [
  {
    key: "apūrva",
    label: "Apūrva",
    short: "New construction",
    description: "First occupation of newly-completed construction. The canonical case the classical gṛha-praveśa table was written for.",
    pañcāṅga: "Full strength",
    vastu: "Full strength — entry direction and full Vāstu status are genuinely unassessed until now.",
    note: "This is the default 'full method' case.",
    color: GREEN,
    icon: Home,
  },
  {
    key: "sa-pūrva",
    label: "Sa-pūrva",
    short: "Renovation / absence",
    description: "Re-occupation after renovation, or after an absence exceeding roughly six months. Intermediate case with regional-tradition variance.",
    pañcāṅga: "Full strength",
    vastu: "Reduced — narrow the overlay to what changed since the original Apūrva assessment (e.g., renovation touching the entry).",
    note: "Do not re-run the identical full Vāstu-overlay unless something structural changed.",
    color: BLUE,
    icon: Hammer,
  },
  {
    key: "dvandva",
    label: "Dvandva",
    short: "Post-disaster",
    description: "Re-occupation after fire or other disaster. Not merely a stronger Vāstu concern, but a cross-discipline threshold.",
    pañcāṅga: "Full strength, but secondary",
    vastu: "Elevated / mandatory — proactive referral before any timing recommendation is offered.",
    note: "Referral precedes timing; this is the exception to the two-questions-proceed-independently rule.",
    color: VERMILION,
    icon: ShieldAlert,
  },
];

const STRENGTH_MATRIX: { label: string; apūrva: string; "sa-pūrva": string; dvandva: string; apūrvaColor: string; saColor: string; dvandvaColor: string }[] = [
  {
    label: "Pañcāṅga / house-bala (Lesson 16.3.1)",
    apūrva: "Full strength",
    "sa-pūrva": "Full strength",
    dvandva: "Full strength, but secondary",
    apūrvaColor: GREEN,
    saColor: GREEN,
    dvandvaColor: GOLD,
  },
  {
    label: "Vāstu-purification overlay (Lesson 16.3.2)",
    apūrva: "Full strength",
    "sa-pūrva": "Reduced — what changed?",
    dvandva: "Elevated / mandatory referral",
    apūrvaColor: GREEN,
    saColor: BLUE,
    dvandvaColor: VERMILION,
  },
];

interface Scenario {
  id: number;
  text: string;
  answer: TypeKey;
  explanation: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    text: "The Sharma family has just completed building their first home and wants a gṛha-praveśa muhūrta.",
    answer: "apūrva",
    explanation: "Newly-completed construction, first occupation — unambiguously Apūrva. Both checks apply at full strength.",
  },
  {
    id: 2,
    text: "A family renovated their kitchen and lived elsewhere for eight months; they are now moving back in.",
    answer: "sa-pūrva",
    explanation: "Re-occupation after renovation and a long absence. Pañcāṅga/house-bala at full strength; Vāstu-overlay narrows to what the renovation changed.",
  },
  {
    id: 3,
    text: "A family's home suffered fire damage; it has now been structurally repaired and they want to re-enter.",
    answer: "dvandva",
    explanation: "Post-disaster re-occupation. This triggers proactive cross-discipline referral before any timing recommendation, per T1-23 §8 Mistake #1.",
  },
  {
    id: 4,
    text: "A family returns to their existing home after living abroad for nine months; no renovation occurred.",
    answer: "sa-pūrva",
    explanation: "Absence exceeding roughly six months qualifies as Sa-pūrva. The Vāstu-overlay narrows to whether anything changed during the absence.",
  },
];

function TypeCard({ type, selected, onSelect }: { type: GprType; selected: boolean; onSelect: () => void }) {
  const Icon = type.icon;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      style={{
        padding: "0.85rem",
        borderRadius: 8,
        border: `1px solid ${selected ? type.color : HAIRLINE}`,
        background: selected ? `${type.color}10` : SURFACE,
        cursor: "pointer",
        outline: "none",
        display: "flex",
        flexDirection: "column",
        gap: "0.4rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Icon size={20} color={type.color} />
        <span style={{ fontSize: "1.05rem", fontWeight: 600, color: selected ? type.color : INK_PRIMARY }}>{type.label}</span>
        <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: INK_MUTED, fontWeight: 500 }}>{type.short}</span>
      </div>
      <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{type.description}</div>
    </div>
  );
}

function TypeLifecycleSvg() {
  return (
    <svg viewBox="0 0 720 120" role="img" aria-label="Three gṛha-praveśa types across a building's lifecycle" style={{ width: "100%", maxHeight: 160, display: "block" }}>
      <rect x="40" y="20" width="190" height="72" rx="8" fill={`${GREEN}10`} stroke={GREEN} />
      <text x="135" y="48" textAnchor="middle" fontSize="13" fill={INK_PRIMARY} fontWeight={600}>
        Apūrva
      </text>
      <text x="135" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        New construction
      </text>
      <text x="135" y="84" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        first occupation
      </text>

      <line x1={230} y1={56} x2={280} y2={56} stroke={HAIRLINE} strokeWidth={1} />
      <polygon points="275,51 285,56 275,61" fill={HAIRLINE} />

      <rect x="290" y="20" width="190" height="72" rx="8" fill={`${BLUE}10`} stroke={BLUE} />
      <text x="385" y="48" textAnchor="middle" fontSize="13" fill={INK_PRIMARY} fontWeight={600}>
        Sa-pūrva
      </text>
      <text x="385" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        Renovation or
      </text>
      <text x="385" y="84" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        long absence
      </text>

      <line x1={480} y1={56} x2={530} y2={56} stroke={HAIRLINE} strokeWidth={1} />
      <polygon points="525,51 535,56 525,61" fill={HAIRLINE} />

      <rect x="540" y="20" width="150" height="72" rx="8" fill={`${VERMILION}10`} stroke={VERMILION} />
      <text x="615" y="48" textAnchor="middle" fontSize="13" fill={INK_PRIMARY} fontWeight={600}>
        Dvandva
      </text>
      <text x="615" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        Post-disaster
      </text>
      <text x="615" y="84" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
        re-occupation
      </text>
    </svg>
  );
}

function StrengthMatrix() {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
        <thead>
          <tr>
            <th style={thStyle}>Check</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Apūrva</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Sa-pūrva</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Dvandva</th>
          </tr>
        </thead>
        <tbody>
          {STRENGTH_MATRIX.map((row) => (
            <tr key={row.label}>
              <td style={tdStyle}>{row.label}</td>
              <td style={{ ...tdStyle, textAlign: "center", color: row.apūrvaColor, fontWeight: 600 }}>{row.apūrva}</td>
              <td style={{ ...tdStyle, textAlign: "center", color: row.saColor, fontWeight: 600 }}>{row["sa-pūrva"]}</td>
              <td style={{ ...tdStyle, textAlign: "center", color: row.dvandvaColor, fontWeight: 600 }}>{row.dvandva}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const [selected, setSelected] = useState<TypeKey | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = selected === scenario.answer;

  return (
    <div style={cardStyle}>
      <div style={{ fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.6, marginBottom: "0.65rem" }}>{scenario.text}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.65rem" }}>
        {TYPES.map((type) => (
          <button
            key={type.key}
            type="button"
            aria-pressed={selected === type.key}
            onClick={() => {
              setSelected(type.key);
              setRevealed(false);
            }}
            style={{
              padding: "0.35rem 0.65rem",
              borderRadius: 6,
              border: `1px solid ${selected === type.key ? type.color : HAIRLINE}`,
              background: selected === type.key ? `${type.color}15` : "transparent",
              color: selected === type.key ? type.color : INK_SECONDARY,
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        disabled={!selected}
        onClick={() => setRevealed(true)}
        style={{
          ...buttonStyle(false, GOLD),
          opacity: selected ? 1 : 0.5,
          cursor: selected ? "pointer" : "not-allowed",
        }}
      >
        Check classification
      </button>
      {revealed ? (
        <div
          style={{
            marginTop: "0.65rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 6,
            border: `1px solid ${correct ? GREEN : VERMILION}`,
            background: correct ? `${GREEN}10` : `${VERMILION}10`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 600, color: correct ? GREEN : VERMILION }}>
            {correct ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
            {correct ? `Correct — ${scenario.answer}` : `This scenario is ${scenario.answer}`}
          </div>
          <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55, marginTop: "0.25rem" }}>{scenario.explanation}</div>
        </div>
      ) : null}
    </div>
  );
}

export function GrhaPraveshaTypeClassifierWorkbench() {
  const [mode, setMode] = useState<Mode>("explore");
  const [selectedType, setSelectedType] = useState<TypeKey>("apūrva");

  const activeType = TYPES.find((t) => t.key === selectedType) ?? TYPES[0];

  function handleReset() {
    setMode("explore");
    setSelectedType("apūrva");
  }

  return (
    <div data-interactive="grha-pravesha-type-classifier-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>New-construction vs existing-property distinction</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              Classify the gṛha-praveśa type and see which checks apply at full strength
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`T1-23's three-type framework — Apūrva, Sa-pūrva, Dvandva — determines how strongly each check from Lessons 16.3.1-16.3.2 should be applied.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lesson 23.4.3 §4.3
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button type="button" aria-pressed={mode === "explore"} onClick={() => setMode("explore")} style={buttonStyle(mode === "explore", GOLD)}>
          <Layers size={14} />
          Explore types
        </button>
        <button type="button" aria-pressed={mode === "classify"} onClick={() => setMode("classify")} style={buttonStyle(mode === "classify", BLUE)}>
          <Sparkles size={14} />
          Classify scenarios
        </button>
      </div>

      {mode === "explore" ? (
        <>
          <section style={cardStyle}>
            <TypeLifecycleSvg />
          </section>

          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "2 1 400px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <p style={eyebrowStyle}>Select a type</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {TYPES.map((type) => (
                  <TypeCard key={type.key} type={type} selected={selectedType === type.key} onSelect={() => setSelectedType(type.key)} />
                ))}
              </div>
            </section>

            <section style={{ ...cardStyle, flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "0.75rem", borderColor: activeType.color }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <activeType.icon size={20} color={activeType.color} />
                <h3 style={{ margin: 0, color: activeType.color, fontSize: "1.1rem", fontWeight: 600 }}>{activeType.label}</h3>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.6 }}>{activeType.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: 6, background: `${GREEN}08`, border: `1px solid ${GREEN}` }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN, marginBottom: "0.2rem" }}>Pañcāṅga / house-bala</div>
                  <div style={{ fontSize: "0.85rem", color: INK_PRIMARY }}>{activeType.pañcāṅga}</div>
                </div>
                <div style={{ padding: "0.5rem", borderRadius: 6, background: `${activeType.color}08`, border: `1px solid ${activeType.color}` }}>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: activeType.color, marginBottom: "0.2rem" }}>Vāstu overlay</div>
                  <div style={{ fontSize: "0.85rem", color: INK_PRIMARY }}>{activeType.vastu}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
                <strong style={{ color: activeType.color, fontWeight: 600 }}>Note:</strong> {activeType.note}
              </div>
            </section>
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Strength matrix</p>
            <StrengthMatrix />
          </section>

          <section style={{ ...cardStyle, borderColor: `${VERMILION}50`, background: `${VERMILION}08` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 600, color: VERMILION, marginBottom: "0.35rem" }}>
              <ShieldAlert size={16} />
              Dvandva competence-boundary reminder
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {`Dvandva is the one case in this chapter where remediation-referral precedes the timing recommendation. Structural safety and qualified Vāstu purification are preconditions, not parallel options. This is a lighter-weight instance of the same competence-boundary discipline surgery muhūrta develops at its sharpest.`}
            </p>
          </section>
        </>
      ) : null}

      {mode === "classify" ? (
        <section style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {`Read each scenario, choose the gṛha-praveśa type, then reveal the answer.`}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "0.75rem" }}>
            {SCENARIOS.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.45rem 0.85rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
});

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem 0.45rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.03em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.45rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  verticalAlign: "top",
};
