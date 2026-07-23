"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Apple,
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
  Milk,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "screening_audit" | "graduated_response" | "case_studio";
type ClientCaseKey = "rohan" | "diabetic_client";

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

function UpavasaMedicalScreeningSvg({ selectedCase }: { selectedCase: ClientCaseKey }) {
  const isFlagged = selectedCase === "diabetic_client";

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="5-Question Medical Screening Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* 5-Question Gate Box */}
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="210" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="105" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">5-QUESTION MANDATORY SCREEN (§4.1)</text>
        <text x="105" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Pre-Prescription Protocol</text>
        <text x="105" y="68" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">1. Diabetes  2. Pregnancy  3. Age</text>
        <text x="105" y="83" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">4. Medication  5. Recent Illness</text>
        <text x="105" y="105" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Structural Workflow Step</text>
      </g>

      {/* Fork Arrow */}
      <path d="M 240 90 L 275 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Clear Screen Branch */}
      <g transform="translate(275, 25)">
        <rect x="0" y="0" width="175" height="130" rx="8" fill={isFlagged ? "#FFF" : "#E8F5E9"} stroke={GREEN} strokeWidth={isFlagged ? 1 : 2} />
        <text x="87" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">CLEAR SCREEN (ALL NO)</text>
        <text x="87" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Standard Upavāsa</text>
        <text x="87" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Full or Comfort Fast</text>
        <text x="87" y="102" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Rohan: Saturday Fast</text>
      </g>

      {/* Flagged Screen Branch */}
      <g transform="translate(465, 25)">
        <rect x="0" y="0" width="185" height="130" rx="8" fill={isFlagged ? "#FFF8E1" : "#FFF"} stroke={GOLD} strokeWidth={isFlagged ? 2 : 1} />
        <text x="92" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">FLAGGED SCREEN (ANY YES)</text>
        <text x="92" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Graduated Response (§4.3)</text>
        <text x="92" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Modified Sattvic Fast + MD</text>
        <text x="92" y="102" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">Diabetic: Single Meal Fast</text>
      </g>
    </svg>
  );
}

export function UpavasaScreeningWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("screening_audit");
  const [selectedCase, setSelectedCase] = useState<ClientCaseKey>("rohan");

  // Screening questions state
  const [q1Diabetes, setQ1Diabetes] = useState(false);
  const [q2Pregnancy, setQ2Pregnancy] = useState(false);
  const [q3Age, setQ3Age] = useState(false);
  const [q4Medication, setQ4Medication] = useState(false);
  const [q5Illness, setQ5Illness] = useState(false);

  const resetAll = () => {
    setActiveView("screening_audit");
    setSelectedCase("rohan");
    setQ1Diabetes(false);
    setQ2Pregnancy(false);
    setQ3Age(false);
    setQ4Medication(false);
    setQ5Illness(false);
  };

  const loadPreset = (client: ClientCaseKey) => {
    setSelectedCase(client);
    if (client === "rohan") {
      setQ1Diabetes(false);
      setQ2Pregnancy(false);
      setQ3Age(false);
      setQ4Medication(false);
      setQ5Illness(false);
    } else {
      setQ1Diabetes(true); // Diabetic client
      setQ2Pregnancy(false);
      setQ3Age(false);
      setQ4Medication(true);
      setQ5Illness(false);
    }
  };

  const isAnyFlagged = q1Diabetes || q2Pregnancy || q3Age || q4Medication || q5Illness;

  return (
    <div data-interactive="upavasa-prescription-with-medical-contraindication-screening" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Structural Safety Screening Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Upavāsa Prescription with Medical-Contraindication Screening
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Converting T1-15’s medical caution list into a mandatory 5-question structural protocol and delivering the graduated modified-fasting response.
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
            <p style={EYEBROW_STYLE}>5-Question Screening Architecture (§4.1–§4.3)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a preset case to test the screening protocol fork</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => loadPreset("rohan")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "rohan" ? GREEN : HAIRLINE}`,
                background: selectedCase === "rohan" ? GREEN : "transparent",
                color: selectedCase === "rohan" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Preset 1: Rohan (Clear)
            </button>
            <button
              type="button"
              onClick={() => loadPreset("diabetic_client")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedCase === "diabetic_client" ? GOLD : HAIRLINE}`,
                background: selectedCase === "diabetic_client" ? GOLD : "transparent",
                color: selectedCase === "diabetic_client" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Preset 2: Diabetic Client (Flagged)
            </button>
          </div>
        </div>

        <UpavasaMedicalScreeningSvg selectedCase={selectedCase} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("screening_audit")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "screening_audit" ? BLUE : HAIRLINE}`,
                background: activeView === "screening_audit" ? "#EBF3FA" : "transparent",
                color: activeView === "screening_audit" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Interactive 5-Question Audit
            </button>
            <button
              type="button"
              onClick={() => setActiveView("graduated_response")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "graduated_response" ? GOLD : HAIRLINE}`,
                background: activeView === "graduated_response" ? "#FFF8E1" : "transparent",
                color: activeView === "graduated_response" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Graduated Response Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveView("case_studio")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "case_studio" ? GREEN : HAIRLINE}`,
                background: activeView === "case_studio" ? "#E8F5E9" : "transparent",
                color: activeView === "case_studio" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Case Studio (Rohan vs Contrast)
            </button>
          </div>

          {/* View 1: 5-Question Screening Audit */}
          {activeView === "screening_audit" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY }}>
                Run the mandatory pre-prescription medical screening questions (§4.1):
              </p>

              {/* Q1 */}
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FDFAF2", padding: "0.75rem", borderRadius: "0.4rem", border: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
                <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, flex: 1 }}>1. Do you have diabetes or any blood-sugar condition?</span>
                <input type="checkbox" checked={q1Diabetes} onChange={(e) => setQ1Diabetes(e.target.checked)} />
              </label>

              {/* Q2 */}
              <label style={{ display: "flex", alignItems: "center", background: "#FDFAF2", padding: "0.75rem", borderRadius: "0.4rem", border: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
                <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, flex: 1 }}>2. Are you currently pregnant or nursing?</span>
                <input type="checkbox" checked={q2Pregnancy} onChange={(e) => setQ2Pregnancy(e.target.checked)} />
              </label>

              {/* Q3 */}
              <label style={{ display: "flex", alignItems: "center", background: "#FDFAF2", padding: "0.75rem", borderRadius: "0.4rem", border: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
                <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, flex: 1 }}>3. Do you have age-related health conditions monitored by a physician?</span>
                <input type="checkbox" checked={q3Age} onChange={(e) => setQ3Age(e.target.checked)} />
              </label>

              {/* Q4 */}
              <label style={{ display: "flex", alignItems: "center", background: "#FDFAF2", padding: "0.75rem", borderRadius: "0.4rem", border: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
                <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, flex: 1 }}>4. Are you on prescription medication or do you have a diagnosed medical condition?</span>
                <input type="checkbox" checked={q4Medication} onChange={(e) => setQ4Medication(e.target.checked)} />
              </label>

              {/* Q5 */}
              <label style={{ display: "flex", alignItems: "center", background: "#FDFAF2", padding: "0.75rem", borderRadius: "0.4rem", border: `1px solid ${HAIRLINE}`, cursor: "pointer" }}>
                <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, flex: 1 }}>5. Have you had recent illness or are you currently unwell?</span>
                <input type="checkbox" checked={q5Illness} onChange={(e) => setQ5Illness(e.target.checked)} />
              </label>

              {/* Outcome Box */}
              <div style={{ marginTop: "0.5rem", padding: "0.85rem", borderRadius: "0.5rem", background: isAnyFlagged ? "#FFF8E1" : "#E8F5E9", border: `1px solid ${isAnyFlagged ? GOLD : GREEN}` }}>
                <strong style={{ color: isAnyFlagged ? GOLD : GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  {isAnyFlagged ? "Screen FLAGGED → Graduated Response Protocol" : "Screen CLEARED → Standard Upavāsa Available"}
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  {isAnyFlagged
                    ? "Offer modified fasting as default (single sattvic meal / fruit / milk) + direct client to confirm with physician. Never auto-refuse!"
                    : "Standard fasting permitted. Offer modified fast as a sustainability/comfort option."}
                </p>
              </div>
            </div>
          )}

          {/* View 2: Graduated Response Matrix */}
          {activeView === "graduated_response" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  The Graduated Response Fork (§4.3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  A flagged screen does NOT mean automatic refusal! It routes to <strong>Modified Fasting</strong> as the safe default:
                </p>
                <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  <li><strong>Option A (Fruit Fast):</strong> Fresh fruit & water throughout the day.</li>
                  <li><strong>Option B (Milk Fast):</strong> Warm milk / dairy-based nourishment.</li>
                  <li><strong>Option C (Single Sattvic Meal):</strong> One light meal timed with medication schedule.</li>
                </ul>
              </div>
            </div>
          )}

          {/* View 3: Case Studio */}
          {activeView === "case_studio" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Rohan’s Upavāsa Prescription (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Screen clears cleanly across all 5 questions. Rohan is prescribed standard Saturday upavāsa for Saturn, with a modified fast offered as a comfort option.
                </p>
              </div>

              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Diabetic Client Case Contrast (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Q1 flags diabetes. Practitioner offers a modified single sattvic meal fast timed with medication, directing the client to confirm with their physician before beginning.
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
                <strong>5 Screening Questions:</strong> Ask every client, every time.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Must be Structural:</strong> Never rely on visual assumptions or memory.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Graduated Response:</strong> Modified fasting is default for flagged screens.
              </li>
              <li>
                <strong>Rohan Clears:</strong> Standard Saturday fast available.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
