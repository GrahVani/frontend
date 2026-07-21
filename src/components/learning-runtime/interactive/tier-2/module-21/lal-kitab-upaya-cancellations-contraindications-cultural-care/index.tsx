"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Compass,
  Dog,
  Eye,
  FileCheck2,
  Flame,
  Globe,
  Globe2,
  HelpCircle,
  Info,
  Layers,
  Lock,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "cancellation_check" | "contraindication_check" | "cultural_preview" | "rohan_certificate";
type CandidateCaseKey = "rohan_dogs" | "flawed_mixed_saturn" | "scriptural_client";

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

function LalKitabSafetyScreeningSvg({ selectedCase }: { selectedCase: CandidateCaseKey }) {
  const isCancellationFail = selectedCase === "flawed_mixed_saturn";
  const isContraindicationFail = selectedCase === "scriptural_client";
  const isPassedAll = selectedCase === "rohan_dogs";

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Two-Screen Safety Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Screen 1: Cancellation Check Box */}
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="200" height="130" rx="8" fill={isCancellationFail ? "#FDF2F0" : "#FFF"} stroke={isCancellationFail ? VERMILION : BLUE} strokeWidth="1.5" />
        <text x="100" y="22" textAnchor="middle" fill={isCancellationFail ? VERMILION : BLUE} fontSize="10" fontWeight="600">SCREEN 1: CANCELLATION</text>
        <text x="100" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Internal Plan Consistency</text>
        <text x="100" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Incompatible-Mixing Rule (§4.1)</text>
        <text x="100" y="95" textAnchor="middle" fill={isCancellationFail ? VERMILION : GREEN} fontSize="10" fontWeight="600">
          {isCancellationFail ? "FAIL: Contradicts Plan" : "PASS: No Conflict"}
        </text>
      </g>

      {/* Arrow */}
      <path d="M 230 90 L 260 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Screen 2: Contraindication Check Box */}
      <g transform="translate(260, 25)">
        <rect x="0" y="0" width="210" height="130" rx="8" fill={isContraindicationFail ? "#FFF8E1" : "#FFF"} stroke={isContraindicationFail ? GOLD : PURPLE} strokeWidth="1.5" />
        <text x="105" y="22" textAnchor="middle" fill={isContraindicationFail ? GOLD : PURPLE} fontSize="10" fontWeight="600">SCREEN 2: CONTRAINDICATION</text>
        <text x="105" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">External Tool Suitability</text>
        <text x="105" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Avoid-When Framework (§4.1)</text>
        <text x="105" y="95" textAnchor="middle" fill={isContraindicationFail ? GOLD : GREEN} fontSize="10" fontWeight="600">
          {isContraindicationFail ? "FAIL: Scriptural Demand" : "PASS: Tool Suitable"}
        </text>
      </g>

      {/* Arrow */}
      <path d="M 470 90 L 495 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Outcome Certificate Box */}
      <g transform="translate(495, 25)">
        <rect x="0" y="0" width="155" height="130" rx="8" fill={isPassedAll ? "#E8F5E9" : "#FDF2F0"} stroke={isPassedAll ? GREEN : VERMILION} strokeWidth="2" />
        <text x="77" y="22" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">SAFETY OUTCOME</text>
        <text x="77" y="58" textAnchor="middle" fill={isPassedAll ? GREEN : VERMILION} fontSize="13" fontWeight="600">
          {isPassedAll ? "CLEARED" : "REJECTED"}
        </text>
        <text x="77" y="80" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="500">
          {isPassedAll ? "Ready for Step 5" : "Fix / Drop Layer"}
        </text>
        <text x="77" y="102" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">
          {isPassedAll ? "Rohan Saturn Totka" : "Screening failed"}
        </text>
      </g>
    </svg>
  );
}

export function LalKitabSafetyScreeningWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("cancellation_check");
  const [selectedCase, setSelectedCase] = useState<CandidateCaseKey>("rohan_dogs");

  const resetAll = () => {
    setActiveView("cancellation_check");
    setSelectedCase("rohan_dogs");
  };

  return (
    <div data-interactive="lal-kitab-upaya-cancellations-contraindications-cultural-care" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Safety Screening Protocol Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Lal Kitab Upāya: Cancellations, Contraindications, & Cultural Care
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Screening candidate totke through two separate locks: Screen 1 (Plan Cancellation Check) and Screen 2 (Case Contraindication Check), plus cultural care framing.
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

      {/* Vector Safety Screening Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div>
            <p style={EYEBROW_STYLE}>Two-Screen Safety Architecture (§4.1)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a candidate case below to test how both screens process the prescription</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSelectedCase("rohan_dogs")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "rohan_dogs" ? GREEN : HAIRLINE}`,
                background: selectedCase === "rohan_dogs" ? GREEN : "transparent",
                color: selectedCase === "rohan_dogs" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Rohan’s Dog-Feeding Totka
            </button>
            <button
              type="button"
              onClick={() => setSelectedCase("flawed_mixed_saturn")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "flawed_mixed_saturn" ? VERMILION : HAIRLINE}`,
                background: selectedCase === "flawed_mixed_saturn" ? VERMILION : "transparent",
                color: selectedCase === "flawed_mixed_saturn" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Flawed Mixed Saturn Case
            </button>
            <button
              type="button"
              onClick={() => setSelectedCase("scriptural_client")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "scriptural_client" ? GOLD : HAIRLINE}`,
                background: selectedCase === "scriptural_client" ? GOLD : "transparent",
                color: selectedCase === "scriptural_client" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Scriptural Demand Client
            </button>
          </div>
        </div>

        <LalKitabSafetyScreeningSvg selectedCase={selectedCase} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("cancellation_check")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "cancellation_check" ? BLUE : HAIRLINE}`,
                background: activeView === "cancellation_check" ? "#EBF3FA" : "transparent",
                color: activeView === "cancellation_check" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Screen 1: Cancellation Check
            </button>
            <button
              type="button"
              onClick={() => setActiveView("contraindication_check")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "contraindication_check" ? PURPLE : HAIRLINE}`,
                background: activeView === "contraindication_check" ? "#F5F2FC" : "transparent",
                color: activeView === "contraindication_check" ? PURPLE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Screen 2: Contraindication Check
            </button>
            <button
              type="button"
              onClick={() => setActiveView("cultural_preview")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "cultural_preview" ? GOLD : HAIRLINE}`,
                background: activeView === "cultural_preview" ? "#FDFAF2" : "transparent",
                color: activeView === "cultural_preview" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Cultural Care Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveView("rohan_certificate")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "rohan_certificate" ? GREEN : HAIRLINE}`,
                background: activeView === "rohan_certificate" ? "#E8F5E9" : "transparent",
                color: activeView === "rohan_certificate" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              4. Rohan’s Clearance Certificate
            </button>
          </div>

          {/* View 1: Screen 1 Cancellation Check */}
          {activeView === "cancellation_check" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Screen 1: Cancellation & Incompatible-Mixing Rule (T1-18 18.6.4 §4.5)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  <strong>Question:</strong> Does this totka contradict another remedy already in the client&apos;s plan?
                  <br />
                  <strong>Rule:</strong> Never strengthen a graha with one remedy while simultaneously prescribing an act that pacifies or removes that same graha.
                </p>
              </div>

              {selectedCase === "flawed_mixed_saturn" && (
                <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, marginBottom: "0.3rem" }}>
                    <AlertTriangle size={16} />
                    <strong style={{ fontSize: "0.875rem", fontWeight: 600 }}>Screen 1 FAILED: Incompatible Contradiction Caught</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                    This flawed plan paired a strengthening Śani mantra with a Saturn-removing folk act. The cancellation check catches the contradiction and drops the removal act.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View 2: Screen 2 Contraindication Check */}
          {activeView === "contraindication_check" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Screen 2: Contraindication & Avoid-When Framework (T1-18 18.6.3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  <strong>Question:</strong> Should Lal Kitab be used at all in this case?
                  <br />
                  <strong>Avoid When:</strong> A client demands scriptural sanction, deep spiritual transformation, or carries elevated over-promising risk.
                </p>
              </div>

              {selectedCase === "scriptural_client" && (
                <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.3rem" }}>
                    <AlertTriangle size={16} />
                    <strong style={{ fontSize: "0.875rem", fontWeight: 600 }}>Screen 2 FAILED: Tool Contraindicated</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                    Client demands scriptural sanction. Lal Kitab is a 20th-century folk-empirical tradition and is contraindicated for this client; a classical Parāśarī remedy must be used instead.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View 3: Cultural Care Preview */}
          {activeView === "cultural_preview" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.3rem" }}>
                  <Globe2 size={16} />
                  <strong style={{ fontSize: "0.9rem", fontWeight: 600 }}>Cultural Care Dimension (§4.4 Preview)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Feeding dogs on Saturdays carries no restrictive temple-ritual or denominational barrier. It is culturally neutral and accessible across diverse backgrounds. (Full development follows in Lesson 21.4.5).
                </p>
              </div>
            </div>
          )}

          {/* View 4: Rohan's Clearance Certificate */}
          {activeView === "rohan_certificate" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                  <ShieldCheck size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Rohan’s Saturn Candidate Fully Cleared (§4.2–§4.3)</strong>
                </div>
                <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  <li><strong>Screen 1 (Cancellation):</strong> PASSED (No conflict with Jupiter strengthen plan).</li>
                  <li><strong>Screen 2 (Contraindication):</strong> PASSED (No avoid-when conditions apply).</li>
                  <li><strong>Status:</strong> CLEARED for Lesson 21.4.4&apos;s worked prescription deliverable.</li>
                </ul>
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
                <strong>Cancellation:</strong> Does totka contradict plan? (T1-18 18.6.4 §4.5).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Contraindication:</strong> Should Lal Kitab be used at all? (T1-18 18.6.3).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Two Independent Screens:</strong> A candidate can pass one and fail the other.
              </li>
              <li>
                <strong>Rohan’s Candidate:</strong> Clears both screens, ready for Lesson 21.4.4.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
