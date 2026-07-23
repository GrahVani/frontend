"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Link,
  Lock,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "unification_decision" | "structural_discipline" | "universal_disclosure";
type OptionKey = "stacking_error" | "recommended_unification" | "separate_acts";

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

function VrataUnificationArchitectureSvg({ selectedOption }: { selectedOption: OptionKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Structural Over-Prescription & Vrata Unification Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Option 1: Redundant Stacking */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill={selectedOption === "stacking_error" ? "#FDF2F0" : "#FFF"} stroke={VERMILION} strokeWidth={selectedOption === "stacking_error" ? 2.5 : 1.5} />
        <text x="90" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">OPTION 1: STACKING ERROR</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">3 Separate Layers</text>
        <text x="90" y="68" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Dāna + Upavāsa + Vrata</text>
        <text x="90" y="85" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Duplicate structural work</text>
        <text x="90" y="105" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">Redundant Structure (§4.3)</text>
      </g>

      {/* Option 2: Recommended Unification */}
      <g transform="translate(230, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill={selectedOption === "recommended_unification" ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={selectedOption === "recommended_unification" ? 2.5 : 2} />
        <text x="110" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">OPTION 2: UNIFIED VRATA (RECOMMENDED)</text>
        <text x="110" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Single Saturday Śani Vrata</text>
        <text x="110" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Fast (Upavāsa) + Oil (Dāna) + Pūjā</text>
        <text x="110" y="88" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">1 Kept Vow Observance</text>
        <text x="110" y="108" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Rohan Plan Integration (§4.3)</text>
      </g>

      {/* Option 3: Separate Acts */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill={selectedOption === "separate_acts" ? "#EBF3FA" : "#FFF"} stroke={BLUE} strokeWidth={selectedOption === "separate_acts" ? 2.5 : 1.5} />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">OPTION 3: SEPARATE ACTS</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Independent Habits</text>
        <text x="90" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Dāna & Upavāsa kept separate</text>
        <text x="90" y="85" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">No formal vow structure</text>
        <text x="90" y="105" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Legitimate Client Preference</text>
      </g>
    </svg>
  );
}

export function PujaVrataPrescriptionWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("unification_decision");
  const [selectedOption, setSelectedOption] = useState<OptionKey>("recommended_unification");

  const resetAll = () => {
    setActiveView("unification_decision");
    setSelectedOption("recommended_unification");
  };

  return (
    <div data-interactive="puja-and-vrata-prescription-with-religious-respect" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 5 Structural Integration Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Pūjā & Vrata Prescription with Religious-Respect Framing
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating whether Rohan’s separately prescribed Dāna and Upavāsa should be unified into a single Saturday Śani Vrata or left as separate acts.
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

      {/* Vector Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div>
            <p style={EYEBROW_STYLE}>Structural Unification Architecture (§4.3)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a structural option to compare prescription outcomes</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSelectedOption("stacking_error")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedOption === "stacking_error" ? VERMILION : HAIRLINE}`,
                background: selectedOption === "stacking_error" ? VERMILION : "transparent",
                color: selectedOption === "stacking_error" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Option 1: Stacking Error
            </button>
            <button
              type="button"
              onClick={() => setSelectedOption("recommended_unification")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedOption === "recommended_unification" ? GREEN : HAIRLINE}`,
                background: selectedOption === "recommended_unification" ? GREEN : "transparent",
                color: selectedOption === "recommended_unification" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Option 2: Unified Vrata
            </button>
            <button
              type="button"
              onClick={() => setSelectedOption("separate_acts")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedOption === "separate_acts" ? BLUE : HAIRLINE}`,
                background: selectedOption === "separate_acts" ? BLUE : "transparent",
                color: selectedOption === "separate_acts" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Option 3: Separate Acts
            </button>
          </div>
        </div>

        <VrataUnificationArchitectureSvg selectedOption={selectedOption} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("unification_decision")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "unification_decision" ? GREEN : HAIRLINE}`,
                background: activeView === "unification_decision" ? "#E8F5E9" : "transparent",
                color: activeView === "unification_decision" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Unify vs Separate Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveView("structural_discipline")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "structural_discipline" ? PURPLE : HAIRLINE}`,
                background: activeView === "structural_discipline" ? "#F5F2FC" : "transparent",
                color: activeView === "structural_discipline" ? PURPLE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Structural Over-Prescription Rule
            </button>
            <button
              type="button"
              onClick={() => setActiveView("universal_disclosure")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "universal_disclosure" ? BLUE : HAIRLINE}`,
                background: activeView === "universal_disclosure" ? "#EBF3FA" : "transparent",
                color: activeView === "universal_disclosure" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Universal Disclosure & Consent
            </button>
          </div>

          {/* View 1: Unify vs Separate Simulator */}
          {activeView === "unification_decision" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Selected Option Analysis: {selectedOption === "recommended_unification" ? "Unified Vrata (Recommended)" : selectedOption === "stacking_error" ? "Redundant Stacking Error" : "Separate Acts"}
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {selectedOption === "recommended_unification" && (
                    <span>
                      Reorganizes Rohan’s already-justified Dāna (21.5.1) and Upavāsa (21.5.2) into a single formal Saturday Śani Vrata. Adds a brief Śani pūjā and kept-vow structure without adding unneeded burden.
                    </span>
                  )}
                  {selectedOption === "stacking_error" && (
                    <span style={{ color: VERMILION }}>
                      Prescribes Dāna, Upavāsa, and Vrata as 3 separate additive layers. This commits structural over-prescription by duplicating work already justified!
                    </span>
                  )}
                  {selectedOption === "separate_acts" && (
                    <span>
                      Keeps Dāna and Upavāsa as two independent Saturday habits without a formal vow or pūjā. Legitimate if the client prefers simplicity without a formal vow.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* View 2: Structural Over-Prescription Rule */}
          {activeView === "structural_discipline" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Over-Prescription of Structure (§4.3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Over-prescription discipline (T1-18 18.6.4 §4.6) applies to <strong>redundant structure</strong>, not only to redundant content!
                  <br />
                  When fasting and charity are already justified, unifying them into 1 Vrata provides structure without stacking new burden.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Universal Disclosure & Consent */}
          {activeView === "universal_disclosure" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Universal Devotional Disclosure Rule (§4.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Lesson 21.4.5’s disclosure discipline applies to <strong>ALL clients</strong> (including Hindu clients like Rohan):
                  <br />
                  Cultural familiarity is NOT consent to a specific vow. Always disclose what the Vrata/Pūjā involves and confirm explicit opt-in!
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
                <strong>Vrata = Kept Vow:</strong> Combines fasting + worship + charity.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Rohan Unification:</strong> Combines Dāna + Upavāsa into 1 Saturday Śani Vrata.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Redundant Structure:</strong> Avoid stacking Vrata as a 3rd separate layer.
              </li>
              <li>
                <strong>Universal Disclosure:</strong> Familiarity != consent for any client.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
