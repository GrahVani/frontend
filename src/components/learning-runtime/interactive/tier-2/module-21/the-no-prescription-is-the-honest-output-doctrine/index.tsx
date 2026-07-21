"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Lock,
  LogOut,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  StopCircle,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "workflow_exit" | "honest_vs_underdiagnosed" | "prescribing_to_please";
type CaseType = "rohan_saturn" | "well_placed_venus" | "under_diagnosed";

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

function NoPrescriptionHonestOutputSvg({ selectedCase }: { selectedCase: CaseType }) {
  const isNoPrescription = selectedCase === "well_placed_venus";

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="5-Step Workflow Honest Exit Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Step 1 Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="130" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="65" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">STEP 1: CHART-STATE</text>
        <text x="65" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Dignity & Role</text>
        <text x="65" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Examine Graha Placement</text>
        <text x="65" y="102" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Full Examination</text>
      </g>

      {/* Arrow */}
      <path d="M 155 90 L 180 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Step 2 Box (Indication Decision) */}
      <g transform="translate(180, 25)">
        <rect x="0" y="0" width="170" height="130" rx="8" fill="#FFF" stroke={GOLD} strokeWidth="2" />
        <text x="85" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">STEP 2: INDICATION DECISION</text>
        <text x="85" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Is Intervention Needed?</text>
        <text x="85" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Strengthen / Pacify / None</text>
        <text x="85" y="98" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">WORKFLOW FORK (§4.2)</text>
      </g>

      {/* Branch A: Proceed to Steps 3-5 */}
      <g transform="translate(375, 25)">
        <rect x="0" y="0" width="130" height="130" rx="8" fill={!isNoPrescription ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={!isNoPrescription ? 2 : 1} />
        <text x="65" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">INDICATION FOUND</text>
        <text x="65" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Proceed Steps 3-5</text>
        <text x="65" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Category & Safety</text>
        <text x="65" y="102" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Prescription Deliverable</text>
      </g>

      {/* Branch B: Honest Early Exit */}
      <g transform="translate(515, 25)">
        <rect x="0" y="0" width="140" height="130" rx="8" fill={isNoPrescription ? "#E8F5E9" : "#FFF"} stroke={PURPLE} strokeWidth={isNoPrescription ? 2.5 : 1} />
        <text x="70" y="22" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">NO INDICATION FOUND</text>
        <text x="70" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">HONEST EARLY EXIT</text>
        <text x="70" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">No Remedy Required</text>
        <text x="70" y="102" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight="600">Honest Output (§4.1)</text>
      </g>
    </svg>
  );
}

export function NoPrescriptionDoctrineWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("workflow_exit");
  const [selectedCase, setSelectedCase] = useState<CaseType>("well_placed_venus");

  const resetAll = () => {
    setActiveView("workflow_exit");
    setSelectedCase("well_placed_venus");
  };

  return (
    <div data-interactive="the-no-prescription-is-the-honest-output-doctrine" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Consumer Protection Doctrine Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The &ldquo;No Prescription Is the Honest Output&rdquo; Doctrine
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Reporting &ldquo;your chart does not warrant intervention right now&rdquo; is an honest, consumer-protective output — the direct parallel to T2-20’s honest-inconclusive doctrine.
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
            <p style={EYEBROW_STYLE}>Workflow Step-2 Exit Architecture (§4.2)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a chart case to test where the 5-step workflow terminates</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSelectedCase("well_placed_venus")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "well_placed_venus" ? PURPLE : HAIRLINE}`,
                background: selectedCase === "well_placed_venus" ? PURPLE : "transparent",
                color: selectedCase === "well_placed_venus" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Case 1: Well-Placed Venus (Early Exit)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCase("rohan_saturn")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "rohan_saturn" ? GREEN : HAIRLINE}`,
                background: selectedCase === "rohan_saturn" ? GREEN : "transparent",
                color: selectedCase === "rohan_saturn" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Case 2: Rohan Saturn (Full Workflow)
            </button>
          </div>
        </div>

        <NoPrescriptionHonestOutputSvg selectedCase={selectedCase} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("workflow_exit")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "workflow_exit" ? PURPLE : HAIRLINE}`,
                background: activeView === "workflow_exit" ? "#F5F2FC" : "transparent",
                color: activeView === "workflow_exit" ? PURPLE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Step-2 Honest Exit Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveView("honest_vs_underdiagnosed")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "honest_vs_underdiagnosed" ? BLUE : HAIRLINE}`,
                background: activeView === "honest_vs_underdiagnosed" ? "#EBF3FA" : "transparent",
                color: activeView === "honest_vs_underdiagnosed" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Honest Output vs Under-Diagnosis
            </button>
            <button
              type="button"
              onClick={() => setActiveView("prescribing_to_please")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "prescribing_to_please" ? VERMILION : HAIRLINE}`,
                background: activeView === "prescribing_to_please" ? "#FDF2F0" : "transparent",
                color: activeView === "prescribing_to_please" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. &ldquo;Prescribing to Please&rdquo; Malpractice
            </button>
          </div>

          {/* View 1: Step 2 Honest Exit */}
          {activeView === "workflow_exit" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Step-2 Indication Decision & Early Exit (§4.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  {selectedCase === "well_placed_venus" ? (
                    <span>
                      <strong>Client Venus Case:</strong> Venus is own-sign, well-aspected, unafflicted, causing no distress. Step 2 analysis finds NO indicated direction → <strong>Honest Early Exit!</strong> Steps 3, 4, and 5 do not run.
                    </span>
                  ) : (
                    <span>
                      <strong>Rohan Saturn Case:</strong> Saturn is debilitated in Aries (4th lord kendra), Mahādaśā-active. Step 2 analysis finds <strong>Pacify Indicated</strong> → Proceeds through Steps 3, 4, and 5 to a finished deliverable.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* View 2: Honest vs Under-Diagnosed */}
          {activeView === "honest_vs_underdiagnosed" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Earned Honest Non-Prescription (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Follows a genuine, thorough examination of Step 1 (chart-state) and Step 2 (indication). Can specifically state what was examined and found unremarkable.
                </p>
              </div>

              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Under-Diagnosis Shortcut (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Rushes or skips Step 1 & 2 analysis, giving an unexamined &ldquo;nothing to worry about&rdquo; without actually looking closely enough to know.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Prescribing to Please */}
          {activeView === "prescribing_to_please" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  &ldquo;Prescribing to Please&rdquo; as Forced Conclusion (§4.3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  Manufacturing an indication to satisfy client expectation of leaving with a remedy is the remedies-domain version of T2-20’s &ldquo;forced rectification&rdquo; trap.
                  <br />
                  A practitioner who reports <em>&ldquo;your chart does not warrant intervention right now&rdquo;</em> protects the client from unnecessary risk, cost, and burden!
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
                <strong>Honest Non-Prescription:</strong> Positive consumer-protective output.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Step-2 Honest Exit:</strong> No indication means Steps 3-5 do not run.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>No Forced Conclusions:</strong> Never &ldquo;prescribe to please&rdquo;.
              </li>
              <li>
                <strong>Earned Output:</strong> Honest exit requires thorough Step 1 & 2 audit.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
