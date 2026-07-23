"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  MessageCircleWarning,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type CategoryKey = "mantra" | "yantraRatna" | "lalKitab" | "danaUpavasa";
type CommitmentKey = "categoryNotSafety" | "pressure" | "provisional";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const CREAM = "#FAF5E8";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const CATEGORIES: Record<CategoryKey, {
  label: string;
  chapter: string;
  dimension: string;
  items: string[];
  color: string;
}> = {
  mantra: {
    label: "Mantra",
    chapter: "Chapter 2",
    dimension: "Pronunciation & initiation",
    items: ["Can the client be taught to pronounce it correctly?", "Does this specific mantra require dīkṣā (initiation) the client does not have?"],
    color: GREEN,
  },
  yantraRatna: {
    label: "Yantra / Ratna",
    chapter: "Chapter 3",
    dimension: "Heat, hardness, allergen, cost",
    items: ["Heat compatibility with the client", "Hardness and durability of the setting", "Allergic reaction or skin-contact screening", "Cost affordability and quality authenticity"],
    color: VERMILION,
  },
  lalKitab: {
    label: "Lal Kitab upāya",
    chapter: "Chapter 4",
    dimension: "Cancellation & cultural fit",
    items: ["Cancellation conditions between upāyas", "Cultural or religious appropriateness for the client"],
    color: PURPLE,
  },
  danaUpavasa: {
    label: "Dāna / Upavāsa / Vrata",
    chapter: "Chapter 5",
    dimension: "Medical & financial screening",
    items: ["Medical contraindications (diabetes, pregnancy, eating-disorder history, medication timing)", "Financial sustainability of the giving"],
    color: BLUE,
  },
};

const ROHAN_LAYERS = [
  {
    key: "dana",
    graha: "Saturn",
    label: "Dāna",
    category: "danaUpavasa" as CategoryKey,
    note: "Leading layer. Recipient legitimacy and financial sustainability still pending.",
  },
  {
    key: "upavasa",
    graha: "Saturn",
    label: "Upavāsa",
    category: "danaUpavasa" as CategoryKey,
    note: "Second layer. Medical-contraindication screening in Chapter 5 before it becomes prescribable.",
  },
  {
    key: "guruMantra",
    graha: "Jupiter",
    label: "Guru mantra",
    category: "mantra" as CategoryKey,
    note: "Leading layer. Pronunciation teachability and initiation check pending Chapter 2.",
  },
  {
    key: "yellowSapphire",
    graha: "Jupiter",
    label: "Yellow sapphire",
    category: "yantraRatna" as CategoryKey,
    note: "Second layer. Most provisional: heat, hardness, allergen, cost, and ethics all pending Chapter 3.",
  },
];

const COMMITMENTS: Record<CommitmentKey, { label: string; detail: string }> = {
  categoryNotSafety: {
    label: "Category-correctness is not instance-safety evidence",
    detail: "A clean derivation in steps 1–3 gives no information about the safety of the specific remedy.",
  },
  pressure: {
    label: "Urgency does not compress the workflow",
    detail: "Sequencing can bend to convenience; safety is a fixed gate that cannot bend under pressure.",
  },
  provisional: {
    label: "Report provisional remedies as provisional",
    detail: "A remedy that has cleared steps 1–3 but not step 4 is a proposal, not a finished prescription.",
  },
};

const PRESSURE_SCENARIOS = [
  { label: "No pressure", detail: "Normal workflow pace." },
  { label: "\"Just tell me what to wear\"", detail: "Client is impatient after a clean Jupiter-strengthen derivation." },
  { label: "\"Can we start this today?\"", detail: "Client is in distress and wants immediate action." },
];

function PipelineDiagram({ scenario }: { scenario: number }) {
  const stepFill = "#FDFAF2";
  const stepStroke = HAIRLINE;
  const gateFill = "#FFF8E1";
  const gateStroke = GOLD;
  const pressureLabel = PRESSURE_SCENARIOS[scenario].label;

  return (
    <svg width="100%" height="100%" viewBox="0 0 720 180" style={{ maxWidth: 720 }}>
      {/* Step 1-3 block */}
      <rect x={20} y={50} width={200} height={80} rx={8} fill={stepFill} stroke={stepStroke} strokeWidth={2} />
      <text x={120} y={80} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Steps 1–3</text>
      <text x={120} y={98} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">Right category</text>
      <text x={120} y={116} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">Chart-state → direction → family</text>

      {/* Arrow to gate */}
      <line x1={220} y1={90} x2={280} y2={90} stroke={stepStroke} strokeWidth={2} />
      <polygon points="280,90 270,85 270,95" fill={stepStroke} />

      {/* Gate */}
      <rect x={300} y={40} width={120} height={100} rx={8} fill={gateFill} stroke={gateStroke} strokeWidth={2} />
      <text x={360} y={70} fontSize={12} fill={GOLD} fontWeight={600} textAnchor="middle">
        Step 4 gate
      </text>
      <text x={360} y={95} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        Locked
      </text>
      <text x={360} y={125} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        {pressureLabel}
      </text>

      {/* Lock icon */}
      <Lock x={345} y={135} size={18} color={GOLD} />

      {/* Arrow to prescription */}
      <line x1={420} y1={90} x2={480} y2={90} stroke={stepStroke} strokeWidth={2} />
      <polygon points="480,90 470,85 470,95" fill={stepStroke} />

      {/* Prescription block */}
      <rect x={500} y={50} width={200} height={80} rx={8} fill={stepFill} stroke={stepStroke} strokeWidth={2} />
      <text x={600} y={80} fontSize={12} fill={INK_MUTED} fontWeight={600} textAnchor="middle">Outcome</text>
      <text x={600} y={98} fontSize={11} fill={INK_PRIMARY} fontWeight={600} textAnchor="middle">
        Provisional proposal
      </text>
      <text x={600} y={116} fontSize={10} fill={INK_SECONDARY} textAnchor="middle">
        Step 4 still pending
      </text>
    </svg>
  );
}

function CategoryCard({
  categoryKey,
  selected,
  onClick,
}: {
  categoryKey: CategoryKey;
  selected: boolean;
  onClick: () => void;
}) {
  const cat = CATEGORIES[categoryKey];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...cardStyle,
        border: `1.5px solid ${selected ? cat.color : HAIRLINE}`,
        background: selected ? CREAM : SURFACE,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
        <span style={{ color: cat.color, fontWeight: 600 }}>{cat.label}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>— {cat.chapter}</span>
      </div>
      <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.95rem" }}>{cat.dimension}</p>
      <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
        {cat.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </button>
  );
}

function CommitmentToggle({
  held,
  onToggle,
  label,
  detail,
}: {
  held: boolean;
  onToggle: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        ...togglePanelStyle(held, held ? GREEN : VERMILION),
        width: "100%",
        textAlign: "left",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        {held ? <CheckCircle2 size={18} color={GREEN} /> : <XCircle size={18} color={VERMILION} />}
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{label}</span>
      </span>
      <span style={{ color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0.3rem" }}>
        {held ? detail : <span style={{ color: VERMILION }}>Released — discipline gap open.</span>}
      </span>
    </button>
  );
}

export function SafetyCheckNonNegotiable() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("mantra");
  const [pressureScenario, setPressureScenario] = useState(0);
  const [commitments, setCommitments] = useState<Record<CommitmentKey, boolean>>({
    categoryNotSafety: true,
    pressure: true,
    provisional: true,
  });

  const reset = () => {
    setSelectedCategory("mantra");
    setPressureScenario(0);
    setCommitments({ categoryNotSafety: true, pressure: true, provisional: true });
  };

  return (
    <div data-interactive="safety-check-non-negotiable" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Safety-check as non-negotiable step</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Right category and safe instance are two different questions
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Steps 1–3 choose the remedy family. Step 4 audits whether this specific instance can be prescribed safely.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={{ ...cardStyle, background: CREAM }}>
        <p style={eyebrowStyle}>Workflow pipeline</p>
        <div style={workbenchDiagramLayoutStyle}>
          <PipelineDiagram scenario={pressureScenario} />
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, flex: "1 1 360px" }}>
          <p style={eyebrowStyle}>Category-specific safety dimensions</p>
          <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
            Select a category to see what step 4 must screen before prescription.
          </p>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => (
              <CategoryCard key={key} categoryKey={key} selected={selectedCategory === key} onClick={() => setSelectedCategory(key)} />
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <div style={cardStyle}>
            <p style={eyebrowStyle}>Rohan Mehta — four provisional remedy-layers</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              All have cleared steps 1–3. None has yet cleared step 4.
            </p>
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {ROHAN_LAYERS.map((layer) => (
                <div
                  key={layer.key}
                  style={{
                    border: `1.5px solid ${HAIRLINE}`,
                    borderRadius: 8,
                    padding: "0.75rem",
                    background: SURFACE,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: CATEGORIES[layer.category].color, fontWeight: 600 }}>{layer.label}</span>
                    <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{layer.graha}</span>
                  </div>
                  <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {layer.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <p style={eyebrowStyle}>Pressure scenario</p>
            <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
              The gate does not move regardless of urgency or confidence in steps 1–3.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {PRESSURE_SCENARIOS.map((s, idx) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setPressureScenario(idx)}
                  style={smallChipStyle(pressureScenario === idx, idx === 0 ? GREEN : VERMILION)}
                >
                  {idx === 0 ? <ShieldCheck size={14} aria-hidden="true" /> : <MessageCircleWarning size={14} aria-hidden="true" />}
                  {s.label}
                </button>
              ))}
            </div>
            {pressureScenario > 0 && (
              <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: "#FFF8E1", border: `1.5px solid ${GOLD}` }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, fontWeight: 600, fontSize: "0.9rem" }}>
                  <AlertTriangle size={16} aria-hidden="true" />
                  Gate unchanged
                </span>
                <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {PRESSURE_SCENARIOS[pressureScenario].detail} The safety-check remains locked until the category-specific checks are actually completed.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline commitments</p>
        <p style={{ margin: "0.3rem 0 0.75rem", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          Hold all three to keep the structural gate closed until safety is verified.
        </p>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {(Object.keys(COMMITMENTS) as CommitmentKey[]).map((key) => (
            <CommitmentToggle
              key={key}
              held={commitments[key]}
              onToggle={() => setCommitments((prev) => ({ ...prev, [key]: !prev[key] }))}
              label={COMMITMENTS[key].label}
              detail={COMMITMENTS[key].detail}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: "var(--gl-card-surface-solid)",
  border: "1.5px solid var(--gl-gold-hairline)",
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.72rem",
  fontWeight: 700,
  color: "var(--gl-gold-accent)",
  margin: 0,
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.45rem 0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.85rem",
});

const smallChipStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  padding: "0.4rem 0.65rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontWeight: 600,
  cursor: "pointer",
  fontSize: "0.82rem",
});

const togglePanelStyle = (active: boolean, color: string): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.2rem",
  padding: "0.75rem",
  borderRadius: 8,
  border: `1.5px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}08` : "transparent",
  cursor: "pointer",
});

SafetyCheckNonNegotiable.displayName = "SafetyCheckNonNegotiable";
