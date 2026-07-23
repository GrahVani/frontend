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
  Eye,
  FileCheck2,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Unlock,
  UserCheck,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "divergent_streams" | "constructive_path";

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

function AmbiguousChartHonestInconclusiveSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Ambiguous Chart Honest-Inconclusive Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Divergent Streams Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">DIVERGENT STREAMS (§6.1)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Deepak (Gemini Lagna?)</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• 10th Lord Jupiter in 6th (Obstacle)</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Lagna Lord Merc in 8th (Obscured)</text>
        <text x="90" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• AmK Rāhu in 3rd (Directionless)</text>
        <text x="90" y="117" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">No Convergence / No Window</text>
      </g>

      {/* Foundation Crack Box */}
      <g transform="translate(225, 25)">
        <rect x="0" y="0" width="200" height="130" rx="8" fill="#FFF3E0" stroke={VERMILION} strokeWidth="1.5" strokeDasharray="3 3" />
        <text x="100" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">FOUNDATION CRACK (§6.1)</text>
        <text x="100" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Uncertain Birth Time</text>
        <text x="100" y="68" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Lagna & house boundaries shift</text>
        <text x="100" y="86" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Reading built on sand</text>
        <text x="100" y="112" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">HONEST-INCONCLUSIVE TIER</text>
      </g>

      {/* Arrow */}
      <path d="M 440 90 L 460 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Constructive Path Box */}
      <g transform="translate(460, 25)">
        <rect x="0" y="0" width="195" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="2" />
        <text x="97" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">CONSTRUCTIVE PATH FORWARD (§6.2)</text>
        <text x="97" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">4 Actionable Steps</text>
        <text x="97" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">1. Rectify Birth Time (T2-20 BTR)</text>
        <text x="97" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">2. Revisit at Next Daśā Change</text>
        <text x="97" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">3. Praśna for Bounded Decision</text>
        <text x="97" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">4. Route to Career Counsellor</text>
      </g>
    </svg>
  );
}

export function AmbiguousChartHonestInconclusiveWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentDivergence, setStudentDivergence] = useState("");
  const [studentFoundation, setStudentFoundation] = useState("");
  const [studentTier, setStudentTier] = useState("Honest-Inconclusive");
  const [studentPath, setStudentPath] = useState("");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentDivergence("");
    setStudentFoundation("");
    setStudentTier("Honest-Inconclusive");
    setStudentPath("");
  };

  return (
    <div data-interactive="career-case-5-ambiguous-chart-with-honest-inconclusive-output" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Case Study 5 Workbench (Chapter 1 Capstone)</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Career Case 5: Ambiguous Chart with Honest-Inconclusive Output (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Deepak’s ambiguous chart — recognising non-convergence across streams, diagnosing birth-time uncertainty, assigning honest-inconclusive, and providing a constructive 4-step path forward.
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
            Reset Workbench
          </button>
        </div>
      </section>

      {/* Vector Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Ambiguous Chart Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Non-convergence, birth-time uncertainty foundation crack, and 4 constructive next steps</span>
        </div>
        <AmbiguousChartHonestInconclusiveSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("attempt_compare")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "attempt_compare" ? GOLD : HAIRLINE}`,
                background: activeView === "attempt_compare" ? "#FDFAF2" : "transparent",
                color: activeView === "attempt_compare" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Sealed Attempt Protocol
            </button>
            <button
              type="button"
              onClick={() => setActiveView("divergent_streams")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "divergent_streams" ? VERMILION : HAIRLINE}`,
                background: activeView === "divergent_streams" ? "#FFF3E0" : "transparent",
                color: activeView === "divergent_streams" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Divergent Streams & Non-Convergence
            </button>
            <button
              type="button"
              onClick={() => setActiveView("constructive_path")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "constructive_path" ? GREEN : HAIRLINE}`,
                background: activeView === "constructive_path" ? "#E8F5E9" : "transparent",
                color: activeView === "constructive_path" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Constructive Path Forward (4 Steps)
            </button>
          </div>

          {/* View 1: Attempt-Then-Compare Protocol */}
          {activeView === "attempt_compare" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              {!isUnsealed ? (
                <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GOLD, marginBottom: "0.5rem" }}>
                    <Lock size={18} />
                    <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Sealed Attempt Workspace (§4.3)</strong>
                  </div>
                  <p style={{ margin: "0 0 0.8rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    Record your own findings for Deepak’s ambiguous chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Non-Convergence (10th lord 6th, Lagna lord 8th, AmK Rāhu, Moon 12th):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Streams pull in different directions, no active daśā window"
                        value={studentDivergence}
                        onChange={(e) => setStudentDivergence(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Foundation Crack (Uncertain Birth Time):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Birth time uncertain - caps confidence by itself"
                        value={studentFoundation}
                        onChange={(e) => setStudentFoundation(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Constructive Path (What to offer instead of empty hand):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. State weak tendency (persistence), route to BTR, next daśā, Praśna, career counsellor"
                        value={studentPath}
                        onChange={(e) => setStudentPath(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsUnsealed(true)}
                    style={{
                      marginTop: "1rem",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      background: GREEN,
                      color: "#FFF",
                      border: "none",
                      borderRadius: "0.4rem",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <Unlock size={16} />
                    Unseal & Compare Solution
                  </button>
                </div>
              ) : (
                <div style={{ display: "grid", gap: "0.85rem" }}>
                  <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                      <CheckCircle2 size={18} />
                      <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Solution Side-by-Side Comparison (§6.1)</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem", fontSize: "0.85rem" }}>
                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${HAIRLINE}` }}>
                        <strong style={{ color: GOLD, display: "block", marginBottom: "0.2rem" }}>Your Attempt:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Divergence:</strong> {studentDivergence || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Foundation:</strong> {studentFoundation || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Path:</strong> {studentPath || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Divergence:</strong> No convergence across Parāśari, Jaimini, KP, Daśā</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Foundation:</strong> Uncertain birth time caps confidence</p>
                        <p style={{ margin: 0 }}>• <strong>Path:</strong> Honest-Inconclusive + BTR / next daśā / Praśna / counsellor</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Divergent Streams & Non-Convergence */}
          {activeView === "divergent_streams" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF3E0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Why Streams Fail to Converge (§6.1)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  • <strong>10th Lord Jupiter in 6th:</strong> Effortful, obstacle-laden (neither clear promise nor denial).
                  <br />• <strong>Lagna Lord Mercury in 8th:</strong> Self & career direction obscured.
                  <br />• <strong>Amātyakāraka Rāhu in 3rd:</strong> Restless, directionally ambiguous.
                  <br />• <strong>Moon Mahādaśā (12th):</strong> Does NOT activate career.
                  <br />• <strong>KP 10th Sub-Lord:</strong> Signifies dusthānas (6-8-12).
                </p>
              </div>
            </div>
          )}

          {/* View 3: Constructive Path Forward */}
          {activeView === "constructive_path" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  4 Constructive Actionable Next Steps (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  1. <strong>Rectify Birth Time First:</strong> Route Deepak to Birth-Time Rectification (T2-20) to fix the ascendant.
                  <br />
                  2. <strong>Revisit at Next Daśā:</strong> Wait for a career-active period to open.
                  <br />
                  3. <strong>Use Praśna:</strong> For a specific bounded decision (e.g. &quot;should I take this specific offer&quot;).
                  <br />
                  4. <strong>Route Direction-Finding:</strong> Route vocational searching to an aptitude testing & career counsellor.
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
                <strong>Honest-Inconclusive:</strong> A legitimate tier, not a failure of skill.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>No Fabrication:</strong> Refuse to invent certainty under client pressure.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Birth Time Crack:</strong> Uncertain birth time caps confidence by itself.
              </li>
              <li>
                <strong>4 Next Steps:</strong> BTR, next daśā, Praśna, career counsellor.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
