"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Compass,
  Dog,
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
  ShieldCheck,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "totka_deliverable" | "five_step_retrace" | "integrated_plan";
type RationaleMode = "accessible" | "jargon";

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

function CrossStreamPlanArchitectureSvg({ activeView, onSelectView }: { activeView: ViewKey; onSelectView: (view: ViewKey) => void }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Rohan 3-Layer Integrated Plan Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Layer 1: Guru Mantra */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="140" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="70" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">LAYER 1: FINISHED</text>
        <text x="70" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Guru Mantra</text>
        <text x="70" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Resonance (Ch 2)</text>
        <text x="70" y="102" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">40-Day Maṇḍala</text>
      </g>

      {/* Layer 2: Citrine Gem */}
      <g transform="translate(180, 25)">
        <rect x="0" y="0" width="140" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="70" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">LAYER 2: FINISHED</text>
        <text x="70" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Citrine Gem</text>
        <text x="70" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Uparatna (Ch 3)</text>
        <text x="70" y="102" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Joint Review</text>
      </g>

      {/* Layer 3: Saturn Totka */}
      <g transform="translate(335, 25)" onClick={() => onSelectView("totka_deliverable")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="155" height="130" rx="8" fill={activeView === "totka_deliverable" ? "#FFF" : "#E8F5E9"} stroke={PURPLE} strokeWidth={2.5} />
        <text x="77" y="22" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">LAYER 3: FINISHED (§4.2)</text>
        <text x="77" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Saturn Dog Totka</text>
        <text x="77" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Food-Feeding (Ch 4)</text>
        <text x="77" y="102" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight="600">Click to Inspect</text>
      </g>

      {/* Layer 4: Saturn Dāna/Upavāsa */}
      <g transform="translate(505, 25)" onClick={() => onSelectView("integrated_plan")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="150" height="130" rx="8" fill="#FFF8E1" stroke={GOLD} strokeWidth="1.5" />
        <text x="75" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">LAYER 4: PENDING</text>
        <text x="75" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Dāna & Upavāsa</text>
        <text x="75" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Pacification (Ch 5)</text>
        <text x="75" y="102" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Chapter 5 Router</text>
      </g>
    </svg>
  );
}

export function WorkedExampleLalKitabUpayaWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("totka_deliverable");
  const [rationaleMode, setRationaleMode] = useState<RationaleMode>("accessible");

  const resetAll = () => {
    setActiveView("totka_deliverable");
    setRationaleMode("accessible");
  };

  return (
    <div data-interactive="worked-example-lal-kitab-upaya-prescription-on-real-chart" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 4 Worked Example Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Rohan’s Saturn Totka Deliverable & Integrated Plan Audit
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Carrying Rohan’s Saturn dog-feeding totka through all 5 workflow steps to a finished Step-5 deliverable, and reporting his 3-layer plan progress honestly.
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
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Rohan 3-Layer Integrated Plan Architecture (§4.4)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Click Layer 3 or Layer 4 to inspect the specific prescription status</span>
        </div>
        <CrossStreamPlanArchitectureSvg activeView={activeView} onSelectView={setActiveView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("totka_deliverable")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "totka_deliverable" ? PURPLE : HAIRLINE}`,
                background: activeView === "totka_deliverable" ? "#F5F2FC" : "transparent",
                color: activeView === "totka_deliverable" ? PURPLE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Totka Step-5 Deliverable
            </button>
            <button
              type="button"
              onClick={() => setActiveView("five_step_retrace")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "five_step_retrace" ? BLUE : HAIRLINE}`,
                background: activeView === "five_step_retrace" ? "#EBF3FA" : "transparent",
                color: activeView === "five_step_retrace" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Full 5-Step Retrace Flow
            </button>
            <button
              type="button"
              onClick={() => setActiveView("integrated_plan")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "integrated_plan" ? GREEN : HAIRLINE}`,
                background: activeView === "integrated_plan" ? "#E8F5E9" : "transparent",
                color: activeView === "integrated_plan" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. 3-Layer Plan Progress Audit
            </button>
          </div>

          {/* View 1: Totka Step-5 Deliverable */}
          {activeView === "totka_deliverable" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.4rem" }}>
                <p style={EYEBROW_STYLE}>The 4 Required Deliverable Parts for Totka (§4.2)</p>
              </div>

              {/* Part 1: The Totka & Family */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600 }}>1. The Totka & Family</strong>
                  <span style={{ fontSize: "0.75rem", color: GREEN, background: "#E8F5E9", padding: "0.15rem 0.5rem", borderRadius: "0.25rem" }}>Finished</span>
                </div>
                <p style={{ margin: "0.4rem 0 0", fontSize: "0.95rem", color: INK_PRIMARY, fontWeight: 500 }}>
                  Feeding plain roti (flatbread) to a black dog on Saturdays (Family 2: Food-Feeding)
                </p>
              </div>

              {/* Part 2: Rationale Language Toggle */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                  <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600 }}>2. Rationale Language</strong>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <button
                      type="button"
                      onClick={() => setRationaleMode("accessible")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${rationaleMode === "accessible" ? BLUE : HAIRLINE}`,
                        background: rationaleMode === "accessible" ? BLUE : "transparent",
                        color: rationaleMode === "accessible" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Accessible Client Language
                    </button>
                    <button
                      type="button"
                      onClick={() => setRationaleMode("jargon")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${rationaleMode === "jargon" ? VERMILION : HAIRLINE}`,
                        background: rationaleMode === "jargon" ? VERMILION : "transparent",
                        color: rationaleMode === "jargon" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Chart Jargon
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "0.6rem", padding: "0.75rem", background: rationaleMode === "accessible" ? "#EBF3FA" : "#FDF2F0", borderRadius: "0.4rem", borderLeft: `3px solid ${rationaleMode === "accessible" ? BLUE : VERMILION}` }}>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    {rationaleMode === "accessible" ? (
                      <span>
                        &ldquo;Saturn governs discipline, limitation, and long labor. Feeding an animal associated with Saturn in folk tradition acts as care directed toward what the planet represents, easing its harder edge without altering your deeper chart.&rdquo;
                      </span>
                    ) : (
                      <span>
                        &ldquo;Saturn is a debilitated kendra lord needing pacification; Family 2 totka delivers low-friction appeasement.&rdquo; (Opaque to client!)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Part 3: Practice Instructions */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  3. Practice Instructions & Joint 40-Day Review
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  Fresh plain roti (no salt), offered directly to any dog encountered on Saturdays. No complex mantra or ritual gesture required. Reviewed at each 40-day maṇḍala mark alongside the Guru Mantra & Citrine.
                </p>
              </div>

              {/* Part 4: Mitigation Framing */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  4. Mitigation-Not-Cure Framing
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  Offered as one supportive layer among several, not a resolution of Saturn&apos;s chart difficulty on its own, and not a substitute for real-world planning or discipline.
                </p>
              </div>
            </div>
          )}

          {/* View 2: Full 5-Step Retrace Flow */}
          {activeView === "five_step_retrace" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Step 1 (Chart State) & Step 2 (Indication)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY }}>
                  Saturn debilitated in Aries (4th lord kendra), Mahādaśā-active → <strong>Pacify indicated</strong>.
                </p>
              </div>

              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Step 3 (Category Selection) & Step 4 (Safety Check)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY }}>
                  Food-Feeding Family 2 chosen. Clears Screen 1 (Cancellation) and Screen 2 (Contraindication) cleanly.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Integrated Plan Audit */}
          {activeView === "integrated_plan" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Rohan’s 3-Layer Integrated Plan Progress (§4.4)
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li><strong>Layer 1 (Guru Mantra):</strong> Finished (Chapter 2).</li>
                  <li><strong>Layer 2 (Citrine Gemstone):</strong> Finished (Chapter 3).</li>
                  <li><strong>Layer 3 (Saturn Dog Totka):</strong> Finished (This Lesson, Chapter 4).</li>
                  <li style={{ color: GOLD }}><strong>Layer 4 (Saturn Dāna & Upavāsa):</strong> Open (Routed to Chapter 5).</li>
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
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Chapter 4 Progress Status (§4.4)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>3 of 4 Layers Finished:</strong> Mantra, Citrine, Saturn Totka.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>1 Layer Remaining:</strong> Saturn Dāna & Upavāsa (Chapter 5).
              </li>
              <li>
                <strong>Joint Review:</strong> All 3 layers reviewed at 40-day maṇḍala.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
