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
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "case_file_record" | "refusal_taxonomy_rerun" | "referral_sourcing_check";

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

function RohanMasterSynthesisArchitectureSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Rohan Complete Master Synthesis Case-File Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Jupiter Branch */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">JUPITER (GURU) • STRENGTHEN</text>
        <rect x="15" y="35" width="130" height="40" rx="4" fill="#FFF" stroke={GREEN} strokeWidth="1" />
        <text x="80" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">Layer 1: Mantra</text>
        <text x="80" y="67" textAnchor="middle" fill={GREEN} fontSize="8" fontWeight="500">Namaskāra • 40-Day Japa</text>

        <rect x="155" y="35" width="130" height="40" rx="4" fill="#FFF" stroke={GREEN} strokeWidth="1" />
        <text x="220" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">Layer 2: Citrine Gem</text>
        <text x="220" y="67" textAnchor="middle" fill={GREEN} fontSize="8" fontWeight="500">Substituted (Ch 3.4)</text>

        <rect x="15" y="82" width="270" height="38" rx="4" fill="#FFF8E1" stroke={GOLD} strokeWidth="1" />
        <text x="150" y="98" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">EXCLUDED: Guru Yantra (Type 3 Over-Prescription)</text>
        <text x="150" y="112" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Safety-compatible, but redundant (Ch 3.1 / 6.1)</text>
      </g>

      {/* Saturn Branch */}
      <g transform="translate(355, 25)">
        <rect x="0" y="0" width="300" height="130" rx="8" fill="#F5F2FC" stroke={PURPLE} strokeWidth="1.5" />
        <text x="150" y="22" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">SATURN (ŚANI) • PACIFY</text>
        <rect x="15" y="35" width="130" height="40" rx="4" fill="#FFF" stroke={PURPLE} strokeWidth="1" />
        <text x="80" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">Layer 3: LK Totka</text>
        <text x="80" y="67" textAnchor="middle" fill={PURPLE} fontSize="8" fontWeight="500">Dog-Feeding (Saturdays)</text>

        <rect x="155" y="35" width="130" height="40" rx="4" fill="#FFF" stroke={PURPLE} strokeWidth="1" />
        <text x="220" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight="600">Layer 4: Śani Vrata</text>
        <text x="220" y="67" textAnchor="middle" fill={PURPLE} fontSize="8" fontWeight="500">Dāna + Fast + Pūjā</text>

        <rect x="15" y="82" width="270" height="38" rx="4" fill="#FDF2F0" stroke={VERMILION} strokeWidth="1" />
        <text x="150" y="98" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">REFUSED: Blue Sapphire (Type 1 Mismatch + Type 2 Safety)</text>
        <text x="150" y="112" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="500">Saturn pacify-indicated; stone is strengthen-only (Ch 1.3/3.2/6.1)</text>
      </g>
    </svg>
  );
}

export function WorkedSynthesisMasterWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("case_file_record");

  const resetAll = () => {
    setActiveView("case_file_record");
  };

  return (
    <div data-interactive="worked-synthesis-full-prescription-workflow-on-real-chart-with-safety-and-refusal-checks" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Module 21 Capstone Synthesis Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Worked Synthesis: Full Prescription Workflow on Real Chart
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Retracing Rohan’s case whole — every step, every safety check, every formal refusal, assembled into one complete professional case-file record.
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
          <p style={EYEBROW_STYLE}>Rohan Master Synthesis Case-File Record (§4.6)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>4 finished layers, 2 formal refusals, zero directional conflicts</span>
        </div>
        <RohanMasterSynthesisArchitectureSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("case_file_record")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "case_file_record" ? GREEN : HAIRLINE}`,
                background: activeView === "case_file_record" ? "#E8F5E9" : "transparent",
                color: activeView === "case_file_record" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Master Case-File Record Table (§4.6)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("refusal_taxonomy_rerun")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "refusal_taxonomy_rerun" ? VERMILION : HAIRLINE}`,
                background: activeView === "refusal_taxonomy_rerun" ? "#FDF2F0" : "transparent",
                color: activeView === "refusal_taxonomy_rerun" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Formal Refusal Taxonomy Audit (§4.3)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("referral_sourcing_check")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "referral_sourcing_check" ? GOLD : HAIRLINE}`,
                background: activeView === "referral_sourcing_check" ? "#FFF8E1" : "transparent",
                color: activeView === "referral_sourcing_check" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Citrine Referral Sourcing Check (§4.4)
            </button>
          </div>

          {/* View 1: Master Case-File Record Table */}
          {activeView === "case_file_record" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Guru (Jupiter) — Strengthen Indication
                </strong>
                <p style={{ margin: "0 0 0.3rem", fontSize: "0.85rem", color: INK_PRIMARY }}>
                  • <strong>Layer 1 (Mantra):</strong> Oṁ Bṛhaspataye Namaḥ (Pronunciation verified, no gating).
                  <br />• <strong>Layer 2 (Gemstone):</strong> Citrine substitute (Heat/hardness/allergen cleared).
                </p>
              </div>

              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.2rem" }}>
                  Śani (Saturn) — Pacify Indication
                </strong>
                <p style={{ margin: "0 0 0.3rem", fontSize: "0.85rem", color: INK_PRIMARY }}>
                  • <strong>Layer 3 (LK Totka):</strong> Feeding roti to black dog on Saturdays (Cancellation cleared).
                  <br />• <strong>Layer 4 (Unified Vrata):</strong> Dāna + Upavāsa + Pūjā (Medical screen cleared).
                </p>
              </div>
            </div>
          )}

          {/* View 2: Formal Refusal Taxonomy Audit */}
          {activeView === "refusal_taxonomy_rerun" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <strong style={{ color: VERMILION, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  1. Blue Sapphire Refusal (Type 1 + Type 2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  • <strong>Type 1 (Category-Mismatch):</strong> Saturn is pacify-indicated; Blue Sapphire is a strengthen-only stone.
                  <br />• <strong>Type 2 (Instance-Safety Failure):</strong> Fast-acting, potent stone counseling maximum caution.
                </p>
              </div>

              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  2. Guru Yantra Exclusion (Type 3 Over-Prescription)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  • <strong>Type 3 (Over-Prescription):</strong> Correctly matched & safety-compatible, but declined because Rohan’s 2-layer Jupiter plan (Mantra + Citrine) already sufficed.
                </p>
              </div>
            </div>
          )}

          {/* View 3: Citrine Referral Sourcing Check */}
          {activeView === "referral_sourcing_check" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Referral Sourcing Check for Citrine (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  The chart diagnosis (Citrine is right) and the seller referral (where to buy) are <strong>two separate decisions</strong>!
                  <br />
                  If referring to a jeweller, run Lesson 21.6.2&apos;s 4-factor test: flat compensation, cheaper options maintained, client protection purpose, and 0-benefit test.
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
                <strong>Finished Master Plan:</strong> 4 layers (Guru Mantra, Citrine, Śani Totka, Śani Vrata).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Blue Sapphire Refusal:</strong> Formal Type 1 + Type 2 grounds.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Yantra Exclusion:</strong> Formal Type 3 Over-Prescription.
              </li>
              <li>
                <strong>Referral Sourcing Check:</strong> Independent of remedy diagnosis.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
