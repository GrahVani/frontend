"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
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
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Unlock,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "dasha_transit_timing" | "false_precision_scope";

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

function MidCareerPivotTimingSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Mid-Career Pivot Timing Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Promise Check Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">PROMISE CHECK (§4.2)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Rahul (Libra Lagna)</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• 10th Lord Moon in 5th (Teaching)</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Jupiter in 5th (Teaching Kāraka)</text>
        <text x="90" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Mercury 9th Lord in 9th (Learning)</text>
        <text x="90" y="117" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Promise: Strongly Supported</text>
      </g>

      {/* Arrow */}
      <path d="M 210 90 L 230 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Daśā Window Box */}
      <g transform="translate(230, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="110" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">STEP 2: DAŚĀ WINDOW (§6.1)</text>
        <text x="110" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Moon MD + Jupiter AD (~16m)</text>
        <text x="110" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Moon: 10th Lord (Career Live)</text>
        <text x="110" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Jupiter: Teaching Kāraka in 5th</text>
        <text x="110" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Joins Career Lord + Teaching Kāraka</text>
        <text x="110" y="117" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Season Opens Now (~16 Months)</text>
      </g>

      {/* Arrow */}
      <path d="M 455 90 L 475 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Transit Trigger Box */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="2" />
        <text x="90" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">STEP 3: TRANSIT TRIGGER (§6.1)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Jupiter-Saturn Double Transit</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Aspects 5th/10th Axis</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Sharpens window to 3-4 months</text>
        <text x="90" y="100" textAnchor="middle" fill={VERMILION} fontSize="8" fontWeight="600">✗ NO SINGLE DECREED DAY</text>
        <text x="90" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Bounded Supported Span</text>
      </g>
    </svg>
  );
}

export function MidCareerPivotTimingWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt_compare");
  const [isUnsealed, setIsUnsealed] = useState(false);

  // Student Attempt State
  const [studentPromise, setStudentPromise] = useState("");
  const [studentWindow, setStudentWindow] = useState("");
  const [studentTrigger, setStudentTrigger] = useState("");

  const resetAll = () => {
    setActiveView("attempt_compare");
    setIsUnsealed(false);
    setStudentPromise("");
    setStudentWindow("");
    setStudentTrigger("");
  };

  return (
    <div data-interactive="career-case-3-mid-career-pivot-timing" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Case Study 3 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Career Case 3: Mid-Career Pivot Timing (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Rahul’s pivot into teaching — brief promise check, Daśā window (Moon-Jupiter), Double Transit trigger (3–4 months), and avoiding single-day false precision.
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
          <p style={EYEBROW_STYLE}>Mid-Career Pivot Timing Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Daśā window, Double-Transit trigger, and bounded span vs false precision</span>
        </div>
        <MidCareerPivotTimingSvg activeView={activeView} />
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
              onClick={() => setActiveView("dasha_transit_timing")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "dasha_transit_timing" ? GREEN : HAIRLINE}`,
                background: activeView === "dasha_transit_timing" ? "#E8F5E9" : "transparent",
                color: activeView === "dasha_transit_timing" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Daśā Window & Double Transit
            </button>
            <button
              type="button"
              onClick={() => setActiveView("false_precision_scope")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "false_precision_scope" ? BLUE : HAIRLINE}`,
                background: activeView === "false_precision_scope" ? "#EBF3FA" : "transparent",
                color: activeView === "false_precision_scope" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. No False Precision & Retraining Scope
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
                    Record your own timing findings for Rahul’s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Brief Promise Check (10th lord Moon & Jupiter in 5th, Mercury in 9th):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Teaching grain supported by Moon and Jupiter in 5th house"
                        value={studentPromise}
                        onChange={(e) => setStudentPromise(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Step 2 Daśā Window (Moon MD + Jupiter AD):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Moon-Jupiter connects 10th lord with teaching kāraka in 5th (~16m window)"
                        value={studentWindow}
                        onChange={(e) => setStudentWindow(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        3. Step 3 Double-Transit Trigger (Jupiter & Saturn):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Double transit on 5th/10th axis sharpens window to 3-4 month sub-window"
                        value={studentTrigger}
                        onChange={(e) => setStudentTrigger(e.target.value)}
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
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Promise:</strong> {studentPromise || "Recorded"}</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Window:</strong> {studentWindow || "Recorded"}</p>
                        <p style={{ margin: 0 }}>• <strong>Trigger:</strong> {studentTrigger || "Recorded"}</p>
                      </div>

                      <div style={{ background: "#FFF", padding: "0.6rem", borderRadius: "0.35rem", border: `1px solid ${GREEN}` }}>
                        <strong style={{ color: GREEN, display: "block", marginBottom: "0.2rem" }}>Worked Solution:</strong>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Promise:</strong> Brief check passed (Moon & Jupiter in 5th)</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Window:</strong> Moon-Jupiter AD opens ~16m season</p>
                        <p style={{ margin: 0 }}>• <strong>Trigger:</strong> Double transit sharpens to 3-4m sub-window</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* View 2: Daśā Window & Double Transit */}
          {activeView === "dasha_transit_timing" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  1. Daśā Window (Moon MD + Jupiter AD ~16 Months)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Moon is 10th lord (career live); Jupiter is teaching kāraka in 5th house. The Moon–Jupiter period joins career lord with teaching significator in the teaching house!
                </p>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Double-Transit Trigger (3–4 Month Sub-Window)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Transiting Jupiter & Saturn aspect the 5th/10th axis without vedha obstruction, sharpening the ~16-month antardaśā into a 3–4 month peak execution window.
                </p>
              </div>
            </div>
          )}

          {/* View 3: No False Precision & Scope */}
          {activeView === "false_precision_scope" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  No False Precision & Retraining Scope Fence (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  • <strong>Single Decreed Day = False Precision:</strong> Timing resolves to a <em>supported window</em>, NOT an exact single date. Birth-time uncertainty alone forbids single-day decrees!
                  <br /><br />
                  • <strong>Scope Boundary:</strong> The chart times <strong>readiness & support</strong>; it does not do the retraining! Route qualification, applications, and practical resume steps to a career counsellor.
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
                <strong>Timing Focus:</strong> Weight falls on Step 2 (Daśā) & Step 3 (Transit).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Daśā Window:</strong> Moon MD + Jupiter AD (~16m) connects 10th lord + 5th kāraka.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Double Transit:</strong> Jupiter-Saturn 5th/10th aspect sharpens to 3-4m.
              </li>
              <li>
                <strong>No False Precision:</strong> Bounded window, not single decreed date.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
