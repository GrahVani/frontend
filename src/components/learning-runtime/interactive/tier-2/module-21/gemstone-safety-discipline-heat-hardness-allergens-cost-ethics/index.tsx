"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Gem,
  Hammer,
  HelpCircle,
  Info,
  Layers,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StoneKey = "yellow_sapphire" | "blue_sapphire" | "pearl";
type DimensionKey = "heat" | "hardness" | "allergens" | "cost";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

interface SafetyDimension {
  question: string;
  yellow_sapphire: string;
  blue_sapphire: string;
  pearl: string;
  clearedYellow: boolean | "open";
  icon: ReactNode;
}

const SAFETY_DIMENSIONS: Record<DimensionKey, SafetyDimension> = {
  heat: {
    question: "Astrological Heat (Intensity & Potency)",
    yellow_sapphire: "Moderate potency. Does not belong to the high-intensity pair (Blue Sapphire & Diamond). No urgent test-period required.",
    blue_sapphire: "High potency & fast-acting. Classical tradition mandates a ~3-day operational test-period before permanent mounting.",
    pearl: "Gentle/mild potency. Safe for continuous wear without trial period.",
    clearedYellow: true,
    icon: <Flame size={16} aria-hidden="true" />,
  },
  hardness: {
    question: "Physical Hardness & Mineral Durability",
    yellow_sapphire: "Corundum (9 Mohs hardness). Extremely durable, tolerates daily wear without special protective handling.",
    blue_sapphire: "Corundum (9 Mohs hardness). Extremely durable.",
    pearl: "Organic gem (2.5–4.5 Mohs). Soft & porous — requires protective handling guidance (avoid chemicals & water exposure).",
    clearedYellow: true,
    icon: <Hammer size={16} aria-hidden="true" />,
  },
  allergens: {
    question: "Metal Setting & Skin Allergen Risk",
    yellow_sapphire: "Stone itself carries zero allergen risk. Setting requires hypoallergenic metal (gold/platinum, avoiding nickel-heavy alloys).",
    blue_sapphire: "Setting requires hypoallergenic metal (silver/gold/platinum).",
    pearl: "Setting typically in silver or gold.",
    clearedYellow: true,
    icon: <ShieldCheck size={16} aria-hidden="true" />,
  },
  cost: {
    question: "Cost & Ethical Financial Impact",
    yellow_sapphire: "High expense. A genuine, gem-quality natural yellow sapphire represents significant cost — OPEN dimension triggering Lesson 21.3.4.",
    blue_sapphire: "High expense.",
    pearl: "Low to moderate cost.",
    clearedYellow: "open",
    icon: <Coins size={16} aria-hidden="true" />,
  },
};

const CARD_STYLE: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "0.75rem",
  padding: "1.25rem",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const EYEBROW_STYLE: CSSProperties = {
  fontSize: "0.725rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: INK_MUTED,
  margin: 0,
};

function TwoIndependentLocksSvg({ activeStone }: { activeStone: StoneKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Two Independent Locks Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Lock 1: Category Direction Gate */}
      <g transform="translate(30, 30)">
        <rect x="0" y="0" width="200" height="120" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="2" />
        <text x="100" y="25" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">LOCK 1: CATEGORY GATE</text>
        <text x="100" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Directional Safety (§4.1)</text>
        <text x="100" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Strengthen vs Pacify Indication</text>
        <text x="100" y="96" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">Checks Chart Role</text>
      </g>

      {/* Connection arrow */}
      <path d="M 230 90 L 260 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Lock 2: Instance 4-Dimension Screening */}
      <g transform="translate(260, 30)">
        <rect x="0" y="0" width="220" height="120" rx="8" fill="#FFF" stroke={PURPLE} strokeWidth="2" />
        <text x="110" y="25" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">LOCK 2: INSTANCE SCREENING</text>
        <text x="110" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">4-Dimension Protocol (§4.1)</text>
        <text x="110" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Heat • Hardness • Allergen • Cost</text>
        <text x="110" y="96" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">Checks Stone & Client</text>
      </g>

      {/* Connection arrow */}
      <path d="M 480 90 L 505 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Final Verdict */}
      <g transform="translate(505, 30)">
        <rect x="0" y="0" width="145" height="120" rx="8" fill={activeStone === "yellow_sapphire" ? "#E8F5E9" : activeStone === "blue_sapphire" ? "#FDF2F0" : "#FFF"} stroke={activeStone === "yellow_sapphire" ? GREEN : VERMILION} strokeWidth="2" />
        <text x="72" y="25" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">CLIENT VERDICT</text>
        <text x="72" y="55" textAnchor="middle" fill={activeStone === "yellow_sapphire" ? GREEN : VERMILION} fontSize="12" fontWeight="600">
          {activeStone === "yellow_sapphire" ? "3 Cleared / 1 Open" : activeStone === "blue_sapphire" ? "Double Lock Block" : "Soft Gem Caution"}
        </text>
        <text x="72" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">
          {activeStone === "yellow_sapphire" ? "Cost Open → Ch 3.4" : activeStone === "blue_sapphire" ? "Blocked by both locks" : "Requires care guidance"}
        </text>
      </g>
    </svg>
  );
}

export function GemstoneSafetyDisciplineWorkbench() {
  const [activeStone, setActiveStone] = useState<StoneKey>("yellow_sapphire");
  const [activeDimension, setActiveDimension] = useState<DimensionKey>("heat");
  const [testPeriodCompleted, setTestPeriodCompleted] = useState<boolean>(false);

  const resetAll = () => {
    setActiveStone("yellow_sapphire");
    setActiveDimension("heat");
    setTestPeriodCompleted(false);
  };

  return (
    <div data-interactive="gemstone-safety-discipline-heat-hardness-allergens-cost-ethics" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Gemstone Safety Screening Protocol Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Gemstone Safety Discipline: Heat, Hardness, Allergens, & Cost-Ethics
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Operationalising T1-15&apos;s four safety considerations into concrete per-stone, per-client screening questions, and understanding why category-safety and instance-safety are two independent locks.
            </p>
          </div>
          <button
            type="button"
            onClick={resetAll}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "transparent",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: "0.5rem",
              padding: "0.4rem 0.8rem",
              fontSize: "0.85rem",
              color: GOLD,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Reset View
          </button>
        </div>
      </section>

      {/* Custom Vector Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div>
            <p style={EYEBROW_STYLE}>Two Independent Locks Architecture (§4.3)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a gemstone case below to observe how both locks process the prescription</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setActiveStone("yellow_sapphire")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${activeStone === "yellow_sapphire" ? GREEN : HAIRLINE}`,
                background: activeStone === "yellow_sapphire" ? GREEN : "transparent",
                color: activeStone === "yellow_sapphire" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Rohan’s Yellow Sapphire
            </button>
            <button
              type="button"
              onClick={() => setActiveStone("blue_sapphire")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${activeStone === "blue_sapphire" ? VERMILION : HAIRLINE}`,
                background: activeStone === "blue_sapphire" ? VERMILION : "transparent",
                color: activeStone === "blue_sapphire" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Blue Sapphire (Hypothetical)
            </button>
            <button
              type="button"
              onClick={() => setActiveStone("pearl")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${activeStone === "pearl" ? BLUE : HAIRLINE}`,
                background: activeStone === "pearl" ? BLUE : "transparent",
                color: activeStone === "pearl" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Pearl (Soft Gem)
            </button>
          </div>
        </div>

        <TwoIndependentLocksSvg activeStone={activeStone} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Screening Content Panel */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            {(Object.keys(SAFETY_DIMENSIONS) as DimensionKey[]).map((dim) => {
              const info = SAFETY_DIMENSIONS[dim];
              const isSelected = activeDimension === dim;

              return (
                <button
                  key={dim}
                  type="button"
                  onClick={() => setActiveDimension(dim)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.35rem 0.7rem",
                    fontSize: "0.825rem",
                    borderRadius: "0.3rem",
                    border: `1px solid ${isSelected ? GOLD : HAIRLINE}`,
                    background: isSelected ? "#FDFAF2" : "transparent",
                    color: isSelected ? GOLD : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {info.icon}
                  <span>{dim.charAt(0).toUpperCase() + dim.slice(1)}</span>
                </button>
              );
            })}
          </div>

          {/* Active Dimension Details */}
          <div style={{ display: "grid", gap: "1rem" }}>
            <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
              <span style={{ ...EYEBROW_STYLE, color: GOLD }}>Prescription Screening Question (§4.1)</span>
              <h4 style={{ margin: "0.2rem 0 0", fontSize: "1rem", fontWeight: 600, color: INK_PRIMARY }}>
                {SAFETY_DIMENSIONS[activeDimension].question}
              </h4>
            </div>

            <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600 }}>
                  Selected Stone Evaluation: {activeStone === "yellow_sapphire" ? "Yellow Sapphire" : activeStone === "blue_sapphire" ? "Blue Sapphire" : "Pearl"}
                </strong>
                {activeStone === "yellow_sapphire" && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.15rem 0.45rem",
                      borderRadius: "0.25rem",
                      fontWeight: 600,
                      background: SAFETY_DIMENSIONS[activeDimension].clearedYellow === true ? "#E8F5E9" : "#FFF8E1",
                      color: SAFETY_DIMENSIONS[activeDimension].clearedYellow === true ? GREEN : GOLD,
                      border: `1px solid ${SAFETY_DIMENSIONS[activeDimension].clearedYellow === true ? GREEN : GOLD}`,
                    }}
                  >
                    {SAFETY_DIMENSIONS[activeDimension].clearedYellow === true ? "CLEARED" : "OPEN (Ch 3.4)"}
                  </span>
                )}
              </div>

              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                {SAFETY_DIMENSIONS[activeDimension][activeStone]}
              </p>
            </div>

            {/* Test Period Protocol Section for High Potency Stones */}
            {activeDimension === "heat" && activeStone === "blue_sapphire" && (
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: GOLD }}>
                    <Clock size={16} />
                    <strong style={{ fontSize: "0.875rem", fontWeight: 600 }}>Operational ~3-Day Test Period Protocol (§4.2)</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTestPeriodCompleted(!testPeriodCompleted)}
                    style={{
                      padding: "0.2rem 0.5rem",
                      fontSize: "0.75rem",
                      borderRadius: "0.25rem",
                      border: `1px solid ${testPeriodCompleted ? GREEN : GOLD}`,
                      background: testPeriodCompleted ? GREEN : "transparent",
                      color: testPeriodCompleted ? "#FFF" : GOLD,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    {testPeriodCompleted ? "Trial Passed" : "Simulate Trial Wear"}
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: "0.825rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  High-potency gems must not be mounted permanently on day one. Instruct the client to wear the stone temporarily (e.g. taped to arm or in pocket) for ~3 days to observe effects before final setting.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Summary Card */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Rohan’s Safety Outcome (§4.4)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Heat:</strong> Moderate potency (Cleared).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Hardness:</strong> Corundum 9 Mohs (Cleared).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Allergens:</strong> Hypoallergenic metal (Cleared).
              </li>
              <li>
                <strong>Cost:</strong> High expense (<strong>OPEN</strong> → Motivates Lesson 21.3.4 Substitute Protocol).
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
