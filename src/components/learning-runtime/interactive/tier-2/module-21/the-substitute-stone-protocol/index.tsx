"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Coins,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Gem,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "uparatna_matrix" | "protocol_simulator" | "rohan_resolution";
type GemPairKey = "jupiter" | "sun" | "mercury" | "saturn" | "venus" | "mars" | "moon" | "rahu" | "ketu";

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

interface UparatnaPair {
  graha: string;
  primaryGem: string;
  sanskritPrimary: string;
  substitutes: string[];
  intensity: string;
  costRatio: string;
  color: string;
}

const UPARATNA_DATA: Record<GemPairKey, UparatnaPair> = {
  jupiter: {
    graha: "Jupiter",
    primaryGem: "Yellow Sapphire",
    sanskritPrimary: "Puṣparāga",
    substitutes: ["Citrine (Sunela)", "Yellow Topaz"],
    intensity: "Moderate Primary → Milder/Gentle Substitute",
    costRatio: "~5%–10% of Primary Cost",
    color: GOLD,
  },
  sun: {
    graha: "Sun",
    primaryGem: "Ruby",
    sanskritPrimary: "Māṇikya",
    substitutes: ["Red Garnet (Tāmra)", "Red Spinel"],
    intensity: "High Primary → Milder/Gentle Substitute",
    costRatio: "~10% of Primary Cost",
    color: VERMILION,
  },
  mercury: {
    graha: "Mercury",
    primaryGem: "Emerald",
    sanskritPrimary: "Marakata",
    substitutes: ["Peridot", "Green Tourmaline"],
    intensity: "High Primary → Milder/Gentle Substitute",
    costRatio: "~15% of Primary Cost",
    color: GREEN,
  },
  saturn: {
    graha: "Saturn",
    primaryGem: "Blue Sapphire",
    sanskritPrimary: "Nīlam",
    substitutes: ["Amethyst (Jamunia)", "Blue Tourmaline"],
    intensity: "Very High Primary → Gentler/Safer Substitute",
    costRatio: "~5% of Primary Cost",
    color: PURPLE,
  },
  venus: {
    graha: "Venus",
    primaryGem: "Diamond",
    sanskritPrimary: "Vajra",
    substitutes: ["White Sapphire", "Zircon (White Topaz)"],
    intensity: "Very High Primary → Milder/Gentle Substitute",
    costRatio: "~10%–20% of Primary Cost",
    color: BLUE,
  },
  mars: {
    graha: "Mars",
    primaryGem: "Red Coral",
    sanskritPrimary: "Pravāla",
    substitutes: ["Carnelian"],
    intensity: "Moderate Primary → Milder Substitute",
    costRatio: "~20% of Primary Cost",
    color: VERMILION,
  },
  moon: {
    graha: "Moon",
    primaryGem: "Pearl",
    sanskritPrimary: "Muktā",
    substitutes: ["Moonstone (Chandrakanta)"],
    intensity: "Mild Primary → Soft/Gentle Substitute",
    costRatio: "~25% of Primary Cost",
    color: BLUE,
  },
  rahu: {
    graha: "Rahu",
    primaryGem: "Hessonite",
    sanskritPrimary: "Gomeda",
    substitutes: ["Lower-grade Hessonite Garnet"],
    intensity: "Moderate Primary → Milder Substitute",
    costRatio: "~30% of Primary Cost",
    color: GOLD,
  },
  ketu: {
    graha: "Ketu",
    primaryGem: "Cat's Eye",
    sanskritPrimary: "Vaidūrya",
    substitutes: ["Quartz Cat's Eye / Chrysoberyl"],
    intensity: "Moderate Primary → Milder Substitute",
    costRatio: "~30% of Primary Cost",
    color: PURPLE,
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

function SubstituteDecisionMatrixSvg({
  severity,
  costConstraint,
  sensitivity,
}: {
  severity: "moderate" | "acute";
  costConstraint: "limited" | "unconstrained";
  sensitivity: "normal" | "caution";
}) {
  const isSubstituteIndicated = costConstraint === "limited" || (severity === "moderate" && sensitivity === "normal");
  const resultColor = isSubstituteIndicated ? GREEN : GOLD;

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="3-Factor Decision Protocol Matrix" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* 3 Factor Inputs Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="110" y="22" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">3 PROTOCOL FACTORS (§4.2)</text>
        <text x="15" y="48" fill={INK_PRIMARY} fontSize="11" fontWeight="500">1. Severity: <tspan fill={BLUE} fontWeight="600">{severity.toUpperCase()}</tspan></text>
        <text x="15" y="75" fill={INK_PRIMARY} fontSize="11" fontWeight="500">2. Cost Means: <tspan fill={costConstraint === "limited" ? GOLD : GREEN} fontWeight="600">{costConstraint.toUpperCase()}</tspan></text>
        <text x="15" y="102" fill={INK_PRIMARY} fontSize="11" fontWeight="500">3. Sensitivity: <tspan fill={sensitivity === "caution" ? VERMILION : INK_MUTED} fontWeight="600">{sensitivity.toUpperCase()}</tspan></text>
      </g>

      {/* Connection arrow */}
      <path d="M 245 90 L 285 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Decision Balance Scale Box */}
      <g transform="translate(285, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF" stroke={PURPLE} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">DECISION BALANCE</text>
        <text x="90" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Cheaper-First Discipline</text>
        <text x="90" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Applied within Ratna (§4.3)</text>
        <text x="90" y="102" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">Weighs Factors Together</text>
      </g>

      {/* Connection arrow */}
      <path d="M 465 90 L 500 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Outcome Verdict Box */}
      <g transform="translate(500, 25)">
        <rect x="0" y="0" width="155" height="130" rx="8" fill={isSubstituteIndicated ? "#E8F5E9" : "#FFF8E1"} stroke={resultColor} strokeWidth="2" />
        <text x="77" y="22" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">PRESCRIPTION OUTCOME</text>
        <text x="77" y="58" textAnchor="middle" fill={resultColor} fontSize="14" fontWeight="600">
          {isSubstituteIndicated ? "UPARATNA" : "PRIMARY GEM"}
        </text>
        <text x="77" y="82" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="500">
          {isSubstituteIndicated ? "(Citrine / Uparatna)" : "(Yellow Sapphire)"}
        </text>
        <text x="77" y="105" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">
          {isSubstituteIndicated ? "Lighter starting choice" : "Full intensity warranted"}
        </text>
      </g>
    </svg>
  );
}

export function SubstituteStoneProtocolWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("uparatna_matrix");
  const [selectedPair, setSelectedPair] = useState<GemPairKey>("jupiter");
  const [severity, setSeverity] = useState<"moderate" | "acute">("moderate");
  const [costConstraint, setCostConstraint] = useState<"limited" | "unconstrained">("limited");
  const [sensitivity, setSensitivity] = useState<"normal" | "caution">("normal");

  const resetAll = () => {
    setActiveView("uparatna_matrix");
    setSelectedPair("jupiter");
    setSeverity("moderate");
    setCostConstraint("limited");
    setSensitivity("normal");
  };

  return (
    <div data-interactive="the-substitute-stone-protocol" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Substitute-Stone Protocol Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The Substitute-Stone Protocol: Primary Gem vs Uparatna
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Operationalising the uparatna table at prescription depth: applying cheaper-first sequencing one level deeper (primary vs substitute) and resolving Rohan’s open cost question with Citrine.
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

      {/* Vector Decision Matrix SVG */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div>
            <p style={EYEBROW_STYLE}>3-Factor Decision Protocol Architecture (§4.2)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Weighing Severity, Cost Means, and Sensitivity together</span>
          </div>
        </div>

        <SubstituteDecisionMatrixSvg severity={severity} costConstraint={costConstraint} sensitivity={sensitivity} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("uparatna_matrix")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "uparatna_matrix" ? GOLD : HAIRLINE}`,
                background: activeView === "uparatna_matrix" ? "#FDFAF2" : "transparent",
                color: activeView === "uparatna_matrix" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Uparatna Table Lookup
            </button>
            <button
              type="button"
              onClick={() => setActiveView("protocol_simulator")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "protocol_simulator" ? BLUE : HAIRLINE}`,
                background: activeView === "protocol_simulator" ? "#EBF3FA" : "transparent",
                color: activeView === "protocol_simulator" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. 3-Factor Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveView("rohan_resolution")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "rohan_resolution" ? GREEN : HAIRLINE}`,
                background: activeView === "rohan_resolution" ? "#E8F5E9" : "transparent",
                color: activeView === "rohan_resolution" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Rohan’s Citrine Resolution
            </button>
          </div>

          {/* View 1: Uparatna Table Lookup */}
          {activeView === "uparatna_matrix" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                Substitutes carry the <strong>same graha-resonance at lower intensity and cost</strong> (§4.1). Select a graha pair:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem" }}>
                {(Object.keys(UPARATNA_DATA) as GemPairKey[]).map((key) => {
                  const pair = UPARATNA_DATA[key];
                  const isSelected = selectedPair === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPair(key)}
                      style={{
                        padding: "0.55rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: `1px solid ${isSelected ? pair.color : HAIRLINE}`,
                        background: isSelected ? "#FDFAF2" : SURFACE,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "0.85rem", color: isSelected ? pair.color : INK_PRIMARY, fontWeight: 600 }}>
                        {pair.graha}
                      </strong>
                      <span style={{ fontSize: "0.775rem", color: INK_MUTED }}>{pair.primaryGem}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Pair Card */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${UPARATNA_DATA[selectedPair].color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ ...EYEBROW_STYLE, color: UPARATNA_DATA[selectedPair].color }}>
                    {UPARATNA_DATA[selectedPair].graha} Correspondence Pair
                  </span>
                  <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>T1-15 15.4.2 Continuity</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.5rem 0" }}>
                  <strong style={{ fontSize: "1rem", color: INK_PRIMARY }}>
                    {UPARATNA_DATA[selectedPair].primaryGem} ({UPARATNA_DATA[selectedPair].sanskritPrimary})
                  </strong>
                  <ArrowRight size={16} color={GOLD} />
                  <strong style={{ fontSize: "1rem", color: GREEN }}>
                    {UPARATNA_DATA[selectedPair].substitutes.join(", ")}
                  </strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <div style={{ background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}` }}>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Intensity Profile</span>
                    <strong style={{ fontSize: "0.825rem", color: INK_PRIMARY }}>{UPARATNA_DATA[selectedPair].intensity}</strong>
                  </div>
                  <div style={{ background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}` }}>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Affordability Safeguard</span>
                    <strong style={{ fontSize: "0.825rem", color: GREEN }}>{UPARATNA_DATA[selectedPair].costRatio}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 2: 3-Factor Protocol Simulator */}
          {activeView === "protocol_simulator" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
                  Interactive Protocol Factor Controls (§4.2)
                </strong>

                {/* Factor 1 Control */}
                <div style={{ marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.825rem", color: INK_SECONDARY, display: "block", marginBottom: "0.2rem" }}>
                    1. Severity of Under-Support:
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setSeverity("moderate")}
                      style={{
                        padding: "0.25rem 0.6rem",
                        fontSize: "0.775rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${severity === "moderate" ? GREEN : HAIRLINE}`,
                        background: severity === "moderate" ? GREEN : "transparent",
                        color: severity === "moderate" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Moderate (Timely Antardaśā)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSeverity("acute")}
                      style={{
                        padding: "0.25rem 0.6rem",
                        fontSize: "0.775rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${severity === "acute" ? VERMILION : HAIRLINE}`,
                        background: severity === "acute" ? VERMILION : "transparent",
                        color: severity === "acute" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Acute / Severe Crisis
                    </button>
                  </div>
                </div>

                {/* Factor 2 Control */}
                <div style={{ marginBottom: "0.6rem" }}>
                  <span style={{ fontSize: "0.825rem", color: INK_SECONDARY, display: "block", marginBottom: "0.2rem" }}>
                    2. Cost Relative to Client Means:
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setCostConstraint("limited")}
                      style={{
                        padding: "0.25rem 0.6rem",
                        fontSize: "0.775rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${costConstraint === "limited" ? GOLD : HAIRLINE}`,
                        background: costConstraint === "limited" ? GOLD : "transparent",
                        color: costConstraint === "limited" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Financial Strain (Primary Expensive)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCostConstraint("unconstrained")}
                      style={{
                        padding: "0.25rem 0.6rem",
                        fontSize: "0.775rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${costConstraint === "unconstrained" ? GREEN : HAIRLINE}`,
                        background: costConstraint === "unconstrained" ? GREEN : "transparent",
                        color: costConstraint === "unconstrained" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      No Cost Barrier
                    </button>
                  </div>
                </div>

                {/* Factor 3 Control */}
                <div>
                  <span style={{ fontSize: "0.825rem", color: INK_SECONDARY, display: "block", marginBottom: "0.2rem" }}>
                    3. Sensitivity / First-Time Caution:
                  </span>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      type="button"
                      onClick={() => setSensitivity("normal")}
                      style={{
                        padding: "0.25rem 0.6rem",
                        fontSize: "0.775rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${sensitivity === "normal" ? GREEN : HAIRLINE}`,
                        background: sensitivity === "normal" ? GREEN : "transparent",
                        color: sensitivity === "normal" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Normal Sensitivity
                    </button>
                    <button
                      type="button"
                      onClick={() => setSensitivity("caution")}
                      style={{
                        padding: "0.25rem 0.6rem",
                        fontSize: "0.775rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${sensitivity === "caution" ? VERMILION : HAIRLINE}`,
                        background: sensitivity === "caution" ? VERMILION : "transparent",
                        color: sensitivity === "caution" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Borderline Caution / First Wear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 3: Rohan's Resolution */}
          {activeView === "rohan_resolution" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                  <CheckCircle2 size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Rohan’s Resolved Gemstone Choice: Citrine (Sunela)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Rohan&apos;s Jupiter is timely (Antardaśā-active) but not acute/severe. Cost was Lesson 21.3.3&apos;s open dimension. All three factors point to <strong>Citrine (or Yellow Topaz)</strong> as his actual gemstone-layer prescription, with Yellow Sapphire reserved as an available future upgrade (§4.4).
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  When Would Primary Yellow Sapphire Be Correct Instead? (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  The primary stone is correct for a case with acute/severe presenting difficulty, Mahādaśā-level activation, unconstrained cost means, and where milder measures have already been tried and found insufficient.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Sidebar Summary Card */}
        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Key Takeaways (§9)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Same Resonance:</strong> Substitutes hold same graha energy at lower intensity & cost.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>3 Factors:</strong> Severity, cost relative to means, sensitivity weighed together.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Recursive Cheaper-First:</strong> Cheaper-first applied within ratna category.
              </li>
              <li>
                <strong>Rohan’s Choice:</strong> Citrine (Sunela), with Yellow Sapphire as a future upgrade.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
