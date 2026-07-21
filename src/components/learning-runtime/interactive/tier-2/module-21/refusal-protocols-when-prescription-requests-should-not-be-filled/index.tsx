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
  Eye,
  FileCheck2,
  Flame,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "taxonomy_explorer" | "precedent_matrix" | "scenario_classifier";
type RefusalTypeKey = "type_1_mismatch" | "type_2_instance" | "type_3_overprescription" | "type_4_cancellation" | "type_5_contraindication" | "type_6_scope";

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

interface RefusalInfo {
  title: string;
  rule: string;
  precedent: string;
  explanation: string;
  color: string;
}

const REFUSAL_TAXONOMY: Record<RefusalTypeKey, RefusalInfo> = {
  type_1_mismatch: {
    title: "1. Category-Mismatch",
    rule: "Remedy category contradicts chart indication (e.g., resonance remedy for pacify-indicated graha).",
    precedent: "Blue Sapphire refused because Saturn is pacify-indicated (Lessons 21.1.3, 21.3.2).",
    explanation: "“This category amplifies energy, but your chart indicates this planet needs easing.”",
    color: VERMILION,
  },
  type_2_instance: {
    title: "2. Instance-Safety Failure",
    rule: "Category is matched, but this specific instance fails safety (heat, cost, allergen, medical risk).",
    precedent: "Primary Yellow Sapphire replaced by Citrine (Lesson 21.3.4); Medically-flagged fast (Lesson 21.5.2).",
    explanation: "“The category fits, but this specific option carries unnecessary physical or financial risk.”",
    color: GOLD,
  },
  type_3_overprescription: {
    title: "3. Over-Prescription",
    rule: "Remedy is matched and safe, but redundant because existing plan is already sufficient.",
    precedent: "Guru Yantra declined because 2-layer Jupiter plan already sufficed (Lesson 21.3.1).",
    explanation: "“Your existing plan already addresses this need; adding another layer adds unnecessary burden.”",
    color: BLUE,
  },
  type_4_cancellation: {
    title: "4. Cancellation",
    rule: "Remedy would contradict another co-prescribed remedy in the plan (strengthening while pacifying).",
    precedent: "T1-18 18.6.4 §4.5 incompatible-mixing rule (Lesson 21.4.3).",
    explanation: "“This act would work directly against another remedy already in your plan.”",
    color: PURPLE,
  },
  type_5_contraindication: {
    title: "5. Category Contraindication",
    rule: "Whole category is unsuitable for this case, independent of individual instance safety.",
    precedent: "Tantric Dīkṣā-gating (Lesson 21.1.3); Lal Kitab avoid-when conditions (Lesson 21.4.3).",
    explanation: "“This entire framework is not well-suited to your situation or requirements.”",
    color: GOLD,
  },
  type_6_scope: {
    title: "6. Competence / Scope Refusal",
    rule: "Request falls outside astrological qualification / adhikāra (e.g. replacing medical/legal treatment).",
    precedent: "BG 3.35 svadharma & Caraka Saṁhitā 9; Mitigation-not-cure framing across all lessons.",
    explanation: "“This request asks astrology to replace medical or legal care, which falls outside my scope.”",
    color: VERMILION,
  },
};

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

function RefusalProtocolTaxonomySvg({ selectedType }: { selectedType: RefusalTypeKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="6-Branch Refusal Protocol Taxonomy" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Grid of 6 Refusal Branches */}
      <g transform="translate(25, 25)">
        {/* Row 1 */}
        <rect x="0" y="0" width="195" height="55" rx="6" fill={selectedType === "type_1_mismatch" ? "#FDF2F0" : "#FFF"} stroke={VERMILION} strokeWidth={selectedType === "type_1_mismatch" ? 2 : 1} />
        <text x="97" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">1. Category-Mismatch</text>
        <text x="97" y="38" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Blue Sapphire (Ch 1/3)</text>

        <rect x="210" y="0" width="195" height="55" rx="6" fill={selectedType === "type_2_instance" ? "#FFF8E1" : "#FFF"} stroke={GOLD} strokeWidth={selectedType === "type_2_instance" ? 2 : 1} />
        <text x="307" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">2. Instance-Safety</text>
        <text x="307" y="38" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Yellow Sapphire / Fast (Ch 3/5)</text>

        <rect x="420" y="0" width="195" height="55" rx="6" fill={selectedType === "type_3_overprescription" ? "#EBF3FA" : "#FFF"} stroke={BLUE} strokeWidth={selectedType === "type_3_overprescription" ? 2 : 1} />
        <text x="517" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">3. Over-Prescription</text>
        <text x="517" y="38" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Declined Yantra (Ch 3)</text>

        {/* Row 2 */}
        <rect x="0" y="70" width="195" height="55" rx="6" fill={selectedType === "type_4_cancellation" ? "#F5F2FC" : "#FFF"} stroke={PURPLE} strokeWidth={selectedType === "type_4_cancellation" ? 2 : 1} />
        <text x="97" y="92" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">4. Cancellation</text>
        <text x="97" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Incompatible Totka (Ch 4)</text>

        <rect x="210" y="70" width="195" height="55" rx="6" fill={selectedType === "type_5_contraindication" ? "#FFF8E1" : "#FFF"} stroke={GOLD} strokeWidth={selectedType === "type_5_contraindication" ? 2 : 1} />
        <text x="307" y="92" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">5. Category Contraindication</text>
        <text x="307" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Tantra Dīkṣā / LK Avoid (Ch 1/4)</text>

        <rect x="420" y="70" width="195" height="55" rx="6" fill={selectedType === "type_6_scope" ? "#FDF2F0" : "#FFF"} stroke={VERMILION} strokeWidth={selectedType === "type_6_scope" ? 2 : 1} />
        <text x="517" y="92" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">6. Competence / Scope</text>
        <text x="517" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">BG 3.35 Svadharma (Ch 6)</text>
      </g>
    </svg>
  );
}

export function RefusalProtocolWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("taxonomy_explorer");
  const [selectedType, setSelectedType] = useState<RefusalTypeKey>("type_1_mismatch");

  const resetAll = () => {
    setActiveView("taxonomy_explorer");
    setSelectedType("type_1_mismatch");
  };

  return (
    <div data-interactive="refusal-protocols-when-prescription-requests-should-not-be-filled" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 6 Taxonomy Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Refusal Protocols: When Prescription Requests Should NOT Be Filled
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Systematizing the six named refusal reasons demonstrated across Chapters 1–5 into one unified professional taxonomy.
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

      {/* Vector Taxonomy Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>6-Branch Refusal Taxonomy Architecture (§4.1)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Click any refusal type to inspect its rule, precedent, and client explanation</span>
        </div>
        <RefusalProtocolTaxonomySvg selectedType={selectedType} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("taxonomy_explorer")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "taxonomy_explorer" ? GOLD : HAIRLINE}`,
                background: activeView === "taxonomy_explorer" ? "#FDFAF2" : "transparent",
                color: activeView === "taxonomy_explorer" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Taxonomy Explorer (6 Types)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("precedent_matrix")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "precedent_matrix" ? BLUE : HAIRLINE}`,
                background: activeView === "precedent_matrix" ? "#EBF3FA" : "transparent",
                color: activeView === "precedent_matrix" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Module Precedent Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveView("scenario_classifier")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "scenario_classifier" ? VERMILION : HAIRLINE}`,
                background: activeView === "scenario_classifier" ? "#FDF2F0" : "transparent",
                color: activeView === "scenario_classifier" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Novel Case Classifier (§4.3)
            </button>
          </div>

          {/* View 1: Taxonomy Explorer */}
          {activeView === "taxonomy_explorer" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY }}>
                Select a refusal branch to inspect its diagnostic criteria:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem" }}>
                {(Object.keys(REFUSAL_TAXONOMY) as RefusalTypeKey[]).map((key) => {
                  const info = REFUSAL_TAXONOMY[key];
                  const isSelected = selectedType === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedType(key)}
                      style={{
                        padding: "0.55rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: `1px solid ${isSelected ? info.color : HAIRLINE}`,
                        background: isSelected ? "#FDFAF2" : SURFACE,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "0.825rem", color: isSelected ? info.color : INK_PRIMARY, fontWeight: 600 }}>
                        {info.title.split(" ")[1] || info.title}
                      </strong>
                    </button>
                  );
                })}
              </div>

              {/* Selected Refusal Info Card */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${REFUSAL_TAXONOMY[selectedType].color}` }}>
                <strong style={{ color: REFUSAL_TAXONOMY[selectedType].color, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  {REFUSAL_TAXONOMY[selectedType].title}
                </strong>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  <strong>Diagnostic Rule:</strong> {REFUSAL_TAXONOMY[selectedType].rule}
                </p>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  <strong>Module Precedent:</strong> {REFUSAL_TAXONOMY[selectedType].precedent}
                </p>
                <div style={{ padding: "0.6rem", background: "#FFF", borderRadius: "0.35rem", borderLeft: `3px solid ${REFUSAL_TAXONOMY[selectedType].color}` }}>
                  <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Client Explanation Rationale</span>
                  <em style={{ fontSize: "0.85rem", color: INK_PRIMARY }}>{REFUSAL_TAXONOMY[selectedType].explanation}</em>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Precedent Matrix */}
          {activeView === "precedent_matrix" && (
            <div style={{ display: "grid", gap: "0.85rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Precedents Gathered Across Chapters 1–5 (§4.1)
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li><strong>Type 1 (Mismatch):</strong> Blue Sapphire refused for pacify-indicated Saturn (Ch 1/3).</li>
                  <li><strong>Type 2 (Instance Safety):</strong> Primary Yellow Sapphire replaced by Citrine; Medically flagged fast (Ch 3/5).</li>
                  <li><strong>Type 3 (Over-Prescription):</strong> Guru Yantra declined (Ch 3).</li>
                  <li><strong>Type 4 (Cancellation):</strong> Incompatible mixing check (Ch 4).</li>
                  <li><strong>Type 5 (Contraindication):</strong> Tantra Dīkṣā-gating (Ch 1); Lal Kitab avoid-when (Ch 4).</li>
                  <li><strong>Type 6 (Scope):</strong> BG 3.35 Svadharma & Caraka Saṁhitā 9; Mitigation framing (Ch 6).</li>
                </ul>
              </div>
            </div>
          )}

          {/* View 3: Scenario Classifier */}
          {activeView === "scenario_classifier" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, marginBottom: "0.3rem" }}>
                  <AlertTriangle size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Novel Case: Medical-Replacement Request (§4.3)</strong>
                </div>
                <p style={{ margin: "0 0 0.4rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  A client asks for a yantra to &ldquo;cure&rdquo; a chronic medical condition already being treated by a physician.
                </p>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  <li><strong>Ground 1 (Type 6 - Scope):</strong> Asking astrology to replace medical treatment violates daivajña adhikāra / svadharma (BG 3.35, Caraka Saṁhitā 9).</li>
                  <li><strong>Ground 2 (Type 1 - Mismatch):</strong> If the graha is pacify-indicated, a yantra is also a category-mismatch.</li>
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
                <strong>6 Refusal Types:</strong> Systematizes past refusals into 1 taxonomy.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Type Affects Script:</strong> Clients deserve specific, honest reasons.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Multi-Ground Refusal:</strong> Name every applicable ground.
              </li>
              <li>
                <strong>BG 3.35 Svadharma:</strong> Grounding for competence-boundary refusal.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
