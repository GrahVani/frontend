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
  Gift,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "master_plan" | "coherence_audit" | "proportionality";

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

function RohanMasterPlanArchitectureSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Rohan Complete 4-Layer Master Plan Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Jupiter Group (Strengthen) */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">JUPITER (GURU) • STRENGTHEN DIRECTION</text>
        <rect x="15" y="35" width="130" height="80" rx="6" fill="#FFF" stroke={GREEN} strokeWidth="1" />
        <text x="80" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Layer 1: Mantra</text>
        <text x="80" y="73" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Oṁ Bṛhaspataye Namaḥ</text>
        <text x="80" y="93" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Ch 2 Deliverable</text>

        <rect x="155" y="35" width="130" height="80" rx="6" fill="#FFF" stroke={GREEN} strokeWidth="1" />
        <text x="220" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Layer 2: Gemstone</text>
        <text x="220" y="73" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Citrine Uparatna</text>
        <text x="220" y="93" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="600">Ch 3 Deliverable</text>
      </g>

      {/* Saturn Group (Pacify) */}
      <g transform="translate(355, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#F5F2FC" stroke={PURPLE} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">SATURN (ŚANI) • PACIFY DIRECTION</text>
        <rect x="15" y="35" width="130" height="80" rx="6" fill="#FFF" stroke={PURPLE} strokeWidth="1" />
        <text x="80" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Layer 3: LK Totka</text>
        <text x="80" y="73" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Dog-Feeding (Saturdays)</text>
        <text x="80" y="93" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight="600">Ch 4 Deliverable</text>

        <rect x="155" y="35" width="130" height="80" rx="6" fill="#FFF" stroke={PURPLE} strokeWidth="1" />
        <text x="220" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Layer 4: Śani Vrata</text>
        <text x="220" y="73" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Dāna + Fast + Pūjā</text>
        <text x="220" y="93" textAnchor="middle" fill={PURPLE} fontSize="9" fontWeight="600">Ch 5 Deliverable</text>
      </g>
    </svg>
  );
}

export function WorkedExampleDanaPrescriptionWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("master_plan");

  const resetAll = () => {
    setActiveView("master_plan");
  };

  return (
    <div data-interactive="worked-example-dana-prescription-on-real-chart" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 5 Worked Example Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Rohan’s Master 4-Layer Remedy Plan & Whole-Plan Coherence Audit
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Assembling Rohan’s complete four-layer prescription (Mantra, Gemstone, Totka, Vrata), verifying whole-plan coherence, and evaluating cost/risk proportionality.
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
          <p style={EYEBROW_STYLE}>Rohan Complete 4-Layer Master Plan Architecture (§4.2)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>4 finished layers across 2 grahas, correctly matched to chart-diagnosed directions</span>
        </div>
        <RohanMasterPlanArchitectureSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("master_plan")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "master_plan" ? GREEN : HAIRLINE}`,
                background: activeView === "master_plan" ? "#E8F5E9" : "transparent",
                color: activeView === "master_plan" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Master 4-Layer Plan Inspector
            </button>
            <button
              type="button"
              onClick={() => setActiveView("coherence_audit")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "coherence_audit" ? BLUE : HAIRLINE}`,
                background: activeView === "coherence_audit" ? "#EBF3FA" : "transparent",
                color: activeView === "coherence_audit" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Whole-Plan Coherence Audit
            </button>
            <button
              type="button"
              onClick={() => setActiveView("proportionality")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "proportionality" ? GOLD : HAIRLINE}`,
                background: activeView === "proportionality" ? "#FDFAF2" : "transparent",
                color: activeView === "proportionality" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Cost / Risk Proportionality
            </button>
          </div>

          {/* View 1: Master 4-Layer Plan Inspector */}
          {activeView === "master_plan" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              {/* Layer 1 */}
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Layer 1: Jupiter Mantra (Strengthen - Ch 2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY }}>
                  Oṁ Bṛhaspataye Namaḥ • 40-Day Maṇḍala • Resonance Amplification
                </p>
              </div>

              {/* Layer 2 */}
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Layer 2: Citrine Gemstone (Strengthen - Ch 3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY }}>
                  Uparatna Substitute • Gold Ring • Safety-Screened (5-Lock Cleared)
                </p>
              </div>

              {/* Layer 3 */}
              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Layer 3: Saturn Dog-Feeding Totka (Pacify - Ch 4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY }}>
                  Plain Roti to Black Dog on Saturdays • Family 2 Food-Feeding • Cleared Both Screens
                </p>
              </div>

              {/* Layer 4 */}
              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Layer 4: Unified Saturday Śani Vrata (Pacify - Ch 5)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY }}>
                  Dāna (Black Sesame & Oil) + Upavāsa (Clear Screen Fast) + Śani Pūjā • 1 Kept Vow
                </p>
              </div>
            </div>
          )}

          {/* View 2: Whole-Plan Coherence Audit */}
          {activeView === "coherence_audit" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#EBF3FA", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: BLUE, marginBottom: "0.3rem" }}>
                  <ShieldCheck size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Whole-Plan Cancellation & Coherence Audit (§4.3)</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li><strong>Jupiter Layers (1 & 2):</strong> Both strengthen Jupiter via separate mechanisms (Mantra & Gem). Zero conflict.</li>
                  <li><strong>Saturn Layers (3 & 4):</strong> Both pacify Saturn via separate mechanisms (Totka & Vrata). Zero conflict.</li>
                  <li><strong>Cross-Graha Check:</strong> Jupiter & Saturn are addressed by separate remedies. No cross-contamination.</li>
                  <li><strong>Status:</strong> Whole-plan cancellation check CLEARED cleanly across all 4 layers.</li>
                </ul>
              </div>
            </div>
          )}

          {/* View 3: Cost / Risk Proportionality */}
          {activeView === "proportionality" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Layer-Count vs Cost/Risk Proportionality (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  Over-prescription caution scales with <strong>cost, physical risk, and client burden</strong>, not raw layer count!
                  <br />
                  Rohan’s 4 layers (Mantra: free; Citrine: moderate uparatna; Totka & Vrata: low-cost appeasement) for a severe debilitated Mahādaśā lord is <strong>proportionate and safe</strong>. Four expensive gemstones or initiation mantras would not be!
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
                <strong>Finished Deliverable:</strong> Unified Śani Vrata complete.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Complete 4-Layer Plan:</strong> Jupiter (Mantra, Gem) + Saturn (Totka, Vrata).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Whole-Plan Coherence:</strong> Cleared across all 4 layers.
              </li>
              <li>
                <strong>Proportionate:</strong> 4 cheap, safe layers for a severe daśā lord is safe.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
