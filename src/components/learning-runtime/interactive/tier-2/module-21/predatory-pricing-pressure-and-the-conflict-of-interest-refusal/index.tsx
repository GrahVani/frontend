"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Eye,
  FileCheck2,
  Flame,
  Gem,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "referral_audit" | "zero_benefit_test" | "disclosure_floor";
type ScenarioKey = "legitimate_flat" | "problematic_commission";

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

function ConflictOfInterestRefusalSvg({ selectedScenario }: { selectedScenario: ScenarioKey }) {
  const isProblematic = selectedScenario === "problematic_commission";

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Conflict of Interest Referral Audit Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* 4-Factor Audit Gate */}
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="200" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="100" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">4-FACTOR REFERRAL AUDIT (§4.2)</text>
        <text x="100" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Referral vs Commission</text>
        <text x="100" y="68" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">1. Fee Structure  2. Cheaper Offered</text>
        <text x="100" y="83" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">3. Primary Purpose  4. Zero-Benefit</text>
        <text x="100" y="105" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Independent Seller Audit</text>
      </g>

      {/* Arrow */}
      <path d="M 230 90 L 265 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Zero-Benefit Self Test Box */}
      <g transform="translate(265, 25)">
        <rect x="0" y="0" width="200" height="130" rx="8" fill="#FFF" stroke={GOLD} strokeWidth="1.5" />
        <text x="100" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">ZERO-BENEFIT SELF-TEST (§4.3)</text>
        <text x="100" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">&ldquo;Would I recommend this with</text>
        <text x="100" y="65" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">0% personal benefit?&rdquo;</text>
        <text x="100" y="90" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Private Practitioner Honesty</text>
        <text x="100" y="105" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Uncertainty = Diagnostic</text>
      </g>

      {/* Arrow */}
      <path d="M 465 90 L 495 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Outcome Card */}
      <g transform="translate(495, 25)">
        <rect x="0" y="0" width="155" height="130" rx="8" fill={isProblematic ? "#FDF2F0" : "#E8F5E9"} stroke={isProblematic ? VERMILION : GREEN} strokeWidth="2" />
        <text x="77" y="22" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">REFERRAL OUTCOME</text>
        <text x="77" y="52" textAnchor="middle" fill={isProblematic ? VERMILION : GREEN} fontSize="13" fontWeight="600">
          {isProblematic ? "REFUSE REFERRAL" : "SOUND NETWORK"}
        </text>
        <text x="77" y="75" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="500">
          {isProblematic ? "Fails Zero-Benefit" : "Passes All 4 Factors"}
        </text>
        <text x="77" y="100" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">
          {isProblematic ? "Disclosure != Soundness" : "Client Protected"}
        </text>
      </g>
    </svg>
  );
}

export function ConflictOfInterestRefusalWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("referral_audit");
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>("legitimate_flat");

  const resetAll = () => {
    setActiveView("referral_audit");
    setSelectedScenario("legitimate_flat");
  };

  return (
    <div data-interactive="predatory-pricing-pressure-and-the-conflict-of-interest-refusal" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Conflict-of-Interest & Referral Audit Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Predatory Pricing Pressure & Conflict-of-Interest Refusal
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Distinguishing a legitimate professional referral network from a problematic commission arrangement dressed as one using operational criteria.
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
            <p style={EYEBROW_STYLE}>Conflict-of-Interest Referral Screening (§4.2–§4.3)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a scenario to evaluate referral relationship soundness</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSelectedScenario("legitimate_flat")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedScenario === "legitimate_flat" ? GREEN : HAIRLINE}`,
                background: selectedScenario === "legitimate_flat" ? GREEN : "transparent",
                color: selectedScenario === "legitimate_flat" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Scenario 1: Sound Network (Flat Fee)
            </button>
            <button
              type="button"
              onClick={() => setSelectedScenario("problematic_commission")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedScenario === "problematic_commission" ? VERMILION : HAIRLINE}`,
                background: selectedScenario === "problematic_commission" ? VERMILION : "transparent",
                color: selectedScenario === "problematic_commission" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Scenario 2: Problematic Commission (15%)
            </button>
          </div>
        </div>

        <ConflictOfInterestRefusalSvg selectedScenario={selectedScenario} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("referral_audit")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "referral_audit" ? BLUE : HAIRLINE}`,
                background: activeView === "referral_audit" ? "#EBF3FA" : "transparent",
                color: activeView === "referral_audit" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. The 4 Distinguishing Factors
            </button>
            <button
              type="button"
              onClick={() => setActiveView("zero_benefit_test")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "zero_benefit_test" ? GOLD : HAIRLINE}`,
                background: activeView === "zero_benefit_test" ? "#FFF8E1" : "transparent",
                color: activeView === "zero_benefit_test" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. The Zero-Benefit Self-Test
            </button>
            <button
              type="button"
              onClick={() => setActiveView("disclosure_floor")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "disclosure_floor" ? VERMILION : HAIRLINE}`,
                background: activeView === "disclosure_floor" ? "#FDF2F0" : "transparent",
                color: activeView === "disclosure_floor" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Disclosure is a Floor, Not a Cure
            </button>
          </div>

          {/* View 1: 4 Distinguishing Factors */}
          {activeView === "referral_audit" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  1. Compensation Structure
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Flat annual referral fee = zero incentive to steer spend. Percentage-of-sale commission = direct incentive to push expensive stones (predatory pattern!).
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  2. Genuine Offering of Cheaper Options
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  A sound network continues offering uparatna substitutes & citrine options (Lesson 21.3.4). If referral stops cheaper mentions, it is corrupting advice.
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  3. Primary Purpose of Relationship
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Protecting client from fraud/synthetic gems vs generating practitioner revenue.
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  4. Zero-Benefit Self-Test
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  &ldquo;Would I still recommend this exact seller with 0% personal benefit?&rdquo; If no or uncertain → REFUSE referral!
                </p>
              </div>
            </div>
          )}

          {/* View 2: Zero Benefit Self Test */}
          {activeView === "zero_benefit_test" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  The Zero-Benefit Self-Test (§4.3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  Ask yourself privately before referring: <em>&ldquo;Would I recommend this jeweller to a close friend if I received absolutely zero commission or fee?&rdquo;</em>
                  <br />
                  If the answer is uncertain, the recommendation is not separable from the personal gain — refuse the referral relationship!
                </p>
              </div>
            </div>
          )}

          {/* View 3: Disclosure is a Floor */}
          {activeView === "disclosure_floor" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Disclosure is a Floor, Not a Cure (§4.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  Telling a client &ldquo;I receive 15% commission on this stone&rdquo; makes you honest about your conflict, but it does NOT make a bad arrangement sound.
                  <br />
                  Furthermore: <strong>Remedy decision and referral decision are separate!</strong> A sound remedy diagnosis (e.g. Citrine) does not launder an unsound seller referral.
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
                <strong>4 Factors:</strong> Fee structure, cheaper offered, purpose, zero-benefit test.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Zero-Benefit Test:</strong> Would I recommend with 0% benefit?
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Disclosure != Soundness:</strong> Disclosing a bad deal doesn&apos;t make it good.
              </li>
              <li>
                <strong>Separate Decisions:</strong> Remedy diagnosis vs seller referral.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
