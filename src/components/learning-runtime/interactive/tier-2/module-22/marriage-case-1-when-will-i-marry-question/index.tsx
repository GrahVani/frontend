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
  Heart,
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
  Unlock,
  Users,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt_compare" | "dasha_transit_timing" | "family_pressure_ethical";

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

function MarriageTimingSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Marriage Timing Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Promise Check Box */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">PROMISE CHECK (§4.2)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Meera (Taurus Lagna)</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• 7th Lord Mars in 11th (Fulfilment)</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Venus Kāraka in 9th (Trine)</text>
        <text x="90" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Exalted Jupiter 5th Aspect on 7th</text>
        <text x="90" y="117" textAnchor="middle" fill={BLUE} fontSize="9" fontWeight="600">Promise: Strong & Confirmed D9</text>
      </g>

      {/* Arrow */}
      <path d="M 210 90 L 230 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Daśā Window Box */}
      <g transform="translate(230, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="110" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">STEP 2: DAŚĀ WINDOW (§6.1)</text>
        <text x="110" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Venus MD + Jupiter AD (~2y 8m)</text>
        <text x="110" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Venus: Lagna Lord + Marriage Kāraka</text>
        <text x="110" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Jupiter: Husband Kāraka Aspecting 7th</text>
        <text x="110" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Joins Kāraka + 7th Husband Kāraka</text>
        <text x="110" y="117" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Favourable Season Opens</text>
      </g>

      {/* Arrow */}
      <path d="M 455 90 L 475 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Transit Trigger Box */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="2" />
        <text x="90" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">STEP 3: TRANSIT TRIGGER (§6.1)</text>
        <text x="90" y="44" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Jupiter-Saturn Double Transit</text>
        <text x="90" y="64" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Aspects 7th Axis & 7th Lord</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">• Sharpens window to 5-7 months</text>
        <text x="90" y="100" textAnchor="middle" fill={VERMILION} fontSize="8" fontWeight="600">✗ NO DECREED WEDDING DATE</text>
        <text x="90" y="117" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Openness, Not Pressure</text>
      </g>
    </svg>
  );
}

export function MarriageTimingWorkbench() {
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
    <div data-interactive="marriage-case-1-when-will-i-marry-question" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 22 Chapter 2 Case 1 Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Marriage Case 1: &quot;When Will I Marry?&quot; (Attempt-Then-Compare)
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Evaluating Meera’s marriage timing question — brief promise check, Daśā window (Venus-Jupiter), Double Transit trigger (5–7 months), and delivering with warmth without family pressure.
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
          <p style={EYEBROW_STYLE}>Marriage Timing Architecture (§4.1–§6.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>7th axis promise, Daśā window, Double-Transit trigger, and favourable season vs family deadline</span>
        </div>
        <MarriageTimingSvg activeView={activeView} />
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
              onClick={() => setActiveView("family_pressure_ethical")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "family_pressure_ethical" ? BLUE : HAIRLINE}`,
                background: activeView === "family_pressure_ethical" ? "#EBF3FA" : "transparent",
                color: activeView === "family_pressure_ethical" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Family Pressure & Gentle Framing
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
                    Record your own timing findings for Meera’s chart before unsealing the worked solution:
                  </p>

                  <div style={{ display: "grid", gap: "0.6rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        1. Brief Promise Check (7th lord Mars 11th, Venus 9th, Exalted Jupiter 3rd aspecting 7th):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Strong promise, 7th lord in 11th fulfilment, confirmed in D9 Navāṁśa"
                        value={studentPromise}
                        onChange={(e) => setStudentPromise(e.target.value)}
                        style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, fontSize: "0.85rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                        2. Step 2 Daśā Window (Venus MD + Jupiter AD):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Venus-Jupiter connects marriage kāraka with husband-kāraka on 7th (~2y 8m window)"
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
                        placeholder="e.g. Double transit on 7th axis sharpens window to 5-7 month sub-window"
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
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Promise:</strong> Strong (Mars 11th, Venus 9th, Jup 5th-aspect, D9 clear)</p>
                        <p style={{ margin: "0 0 0.3rem" }}>• <strong>Window:</strong> Venus-Jupiter AD opens ~2y 8m season</p>
                        <p style={{ margin: 0 }}>• <strong>Trigger:</strong> Double transit sharpens to 5-7m sub-window</p>
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
                  1. Daśā Window (Venus MD + Jupiter AD ~2y 8m)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Venus is Lagna lord & marriage kāraka; Jupiter is husband-kāraka aspecting 7th. The Venus–Jupiter period joins marriage kāraka with husband-significator touching the 7th!
                </p>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  2. Double-Transit Trigger (5–7 Month Sub-Window)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Transiting Jupiter & Saturn aspect the natal 7th axis & 7th lord Mars without vedha obstruction, sharpening the ~2y 8m antardaśā into a 5–7 month peak window.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Family Pressure & Gentle Framing */}
          {activeView === "family_pressure_ethical" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Defusing Family Pressure & Gentle Framing (§6.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  • <strong>Season, NOT Wedding Date:</strong> The window is a <em>favourable season for meeting and proposals</em>, NOT a scheduled wedding date or family deadline.
                  <br /><br />
                  • <strong>Protecting Consent:</strong> Refuse family demands to &quot;fix the wedding date by astrology.&quot; Deliver timing with warmth, openness, and respect for Meera&apos;s own consent.
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
                <strong>Daśā Window:</strong> Venus MD + Jupiter AD (~2y 8m) connects kāraka + husband-significator.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Double Transit:</strong> Jupiter-Saturn 7th aspect sharpens to 5-7m.
              </li>
              <li>
                <strong>Gentle Delivery:</strong> Favourable season, not a family deadline.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
