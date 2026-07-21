"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Gem,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "navaratna_matrix" | "blue_sapphire_refusal" | "tentative_pipeline";
type GrahaKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";

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

interface NavaratnaInfo {
  graha: string;
  sanskritGraha: string;
  gemstone: string;
  sanskritGem: string;
  color: string;
  element: string;
  direction: "strengthen" | "pacify";
  indication: string;
}

const NAVARATNA_TABLE: Record<GrahaKey, NavaratnaInfo> = {
  sun: { graha: "Sun", sanskritGraha: "Sūrya", gemstone: "Ruby", sanskritGem: "Māṇikya", color: VERMILION, element: "Fire", direction: "strengthen", indication: "Strengthen (Functional Benefic)" },
  moon: { graha: "Moon", sanskritGraha: "Candra", gemstone: "Pearl", sanskritGem: "Muktā", color: BLUE, element: "Water", direction: "strengthen", indication: "Strengthen (Functional Benefic)" },
  mars: { graha: "Mars", sanskritGraha: "Maṅgala", gemstone: "Red Coral", sanskritGem: "Pravāla", color: VERMILION, element: "Fire", direction: "strengthen", indication: "Strengthen (Functional Benefic)" },
  mercury: { graha: "Mercury", sanskritGraha: "Budha", gemstone: "Emerald", sanskritGem: "Marakata", color: GREEN, element: "Earth", direction: "strengthen", indication: "Strengthen (Functional Benefic)" },
  jupiter: { graha: "Jupiter", sanskritGraha: "Bṛhaspati", gemstone: "Yellow Sapphire", sanskritGem: "Puṣparāga", color: GOLD, element: "Ether / Wisdom", direction: "strengthen", indication: "Rohan’s Strengthen Case (Tentative Match)" },
  venus: { graha: "Venus", sanskritGraha: "Śukra", gemstone: "Diamond", sanskritGem: "Vajra", color: BLUE, element: "Water / Beauty", direction: "strengthen", indication: "Strengthen (Functional Benefic)" },
  saturn: { graha: "Saturn", sanskritGraha: "Śani", gemstone: "Blue Sapphire", sanskritGem: "Nīlam", color: PURPLE, element: "Air / Structure", direction: "pacify", indication: "Rohan’s Pacify Case (EXCLUDED at Category Level)" },
  rahu: { graha: "Rahu", sanskritGraha: "Rāhu", gemstone: "Hessonite", sanskritGem: "Gomeda", color: GOLD, element: "Shadow / Desire", direction: "strengthen", indication: "Strengthen (Conditional)" },
  ketu: { graha: "Ketu", sanskritGraha: "Ketu", gemstone: "Cat's Eye", sanskritGem: "Vaidūrya", color: PURPLE, element: "Shadow / Mokṣa", direction: "strengthen", indication: "Strengthen (Conditional)" },
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

function GemstoneDecisionFlowSvg({ selectedGraha }: { selectedGraha: GrahaKey }) {
  const info = NAVARATNA_TABLE[selectedGraha];
  const isStrengthen = info.direction === "strengthen";

  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Gemstone Directional Decision Flow" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      {/* Background card */}
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Node 1: Graha Chart State */}
      <g transform="translate(30, 35)">
        <rect x="0" y="0" width="160" height="110" rx="8" fill="#FFF" stroke={info.color} strokeWidth="2" />
        <text x="80" y="25" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="600">GRAHA CHART STATE</text>
        <text x="80" y="55" textAnchor="middle" fill={info.color} fontSize="15" fontWeight="600">{info.graha} ({info.sanskritGraha})</text>
        <text x="80" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight="500">
          {selectedGraha === "jupiter" ? "5th Lord Weak → Beneficial" : selectedGraha === "saturn" ? "Debilitated 4th Lord → Malefic" : "Natal Evaluation"}
        </text>
      </g>

      {/* Connection 1 */}
      <path d="M 190 90 L 240 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="238,86 246,90 238,94" fill={GOLD} />

      {/* Node 2: Direction Gate */}
      <g transform="translate(250, 35)">
        <rect x="0" y="0" width="180" height="110" rx="8" fill={isStrengthen ? "#E8F5E9" : "#FDF2F0"} stroke={isStrengthen ? GREEN : VERMILION} strokeWidth="2" />
        <text x="90" y="25" textAnchor="middle" fill={isStrengthen ? GREEN : VERMILION} fontSize="11" fontWeight="600">DIRECTION GATE (§4.1)</text>
        <text x="90" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">
          {isStrengthen ? "STRENGTHEN INDICATED" : "PACIFY INDICATED"}
        </text>
        <text x="90" y="80" textAnchor="middle" fill={isStrengthen ? GREEN : VERMILION} fontSize="11" fontWeight="600">
          {isStrengthen ? "Resonance Allowed" : "Resonance Excluded"}
        </text>
      </g>

      {/* Connection 2 */}
      <path d="M 430 90 L 480 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />
      <polygon points="478,86 486,90 478,94" fill={isStrengthen ? GREEN : VERMILION} />

      {/* Node 3: Prescription Outcome */}
      <g transform="translate(490, 35)">
        <rect x="0" y="0" width="160" height="110" rx="8" fill="#FFF" stroke={isStrengthen ? GREEN : VERMILION} strokeWidth="2" />
        <text x="80" y="25" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="600">NAVARATNA VERDICT</text>
        <text x="80" y="55" textAnchor="middle" fill={isStrengthen ? GREEN : VERMILION} fontSize="14" fontWeight="600">
          {isStrengthen ? info.gemstone : "BLOCKED"}
        </text>
        <text x="80" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">
          {isStrengthen ? "Tentative Match (§4.4)" : "Category Exclusion (§4.3)"}
        </text>
      </g>
    </svg>
  );
}

export function GemstonePrescriptionWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("navaratna_matrix");
  const [selectedGraha, setSelectedGraha] = useState<GrahaKey>("jupiter");
  const [showPriorAstrologerView, setShowPriorAstrologerView] = useState<boolean>(false);

  const resetAll = () => {
    setActiveView("navaratna_matrix");
    setSelectedGraha("jupiter");
    setShowPriorAstrologerView(false);
  };

  return (
    <div data-interactive="gemstone-prescription-the-9-graha-correspondences-applied" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Navaratna Prescription Depth Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Gemstone Prescription: The 9-Graha Correspondences Applied
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Explore the navaratna table at prescription depth: why table-correctness differs from prescription-correctness, why Rohan’s Blue Sapphire was refused at the category level, and why Yellow Sapphire is a tentative match.
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

      {/* Interactive Vector Decision Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div>
            <p style={EYEBROW_STYLE}>Directional Decision Flow Diagram (§4.1–§4.3)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a graha below to see its chart state pass through the Direction Gate</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSelectedGraha("jupiter")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedGraha === "jupiter" ? GREEN : HAIRLINE}`,
                background: selectedGraha === "jupiter" ? GREEN : "transparent",
                color: selectedGraha === "jupiter" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Rohan’s Jupiter Case
            </button>
            <button
              type="button"
              onClick={() => setSelectedGraha("saturn")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedGraha === "saturn" ? VERMILION : HAIRLINE}`,
                background: selectedGraha === "saturn" ? VERMILION : "transparent",
                color: selectedGraha === "saturn" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Rohan’s Saturn Case
            </button>
          </div>
        </div>

        <GemstoneDecisionFlowSvg selectedGraha={selectedGraha} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("navaratna_matrix")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "navaratna_matrix" ? GOLD : HAIRLINE}`,
                background: activeView === "navaratna_matrix" ? "#FDFAF2" : "transparent",
                color: activeView === "navaratna_matrix" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Navaratna Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveView("blue_sapphire_refusal")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "blue_sapphire_refusal" ? VERMILION : HAIRLINE}`,
                background: activeView === "blue_sapphire_refusal" ? "#FDF2F0" : "transparent",
                color: activeView === "blue_sapphire_refusal" ? VERMILION : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Blue Sapphire Refusal
            </button>
            <button
              type="button"
              onClick={() => setActiveView("tentative_pipeline")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "tentative_pipeline" ? GREEN : HAIRLINE}`,
                background: activeView === "tentative_pipeline" ? "#E8F5E9" : "transparent",
                color: activeView === "tentative_pipeline" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Tentative Match Tracker
            </button>
          </div>

          {/* View 1: Navaratna Matrix */}
          {activeView === "navaratna_matrix" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                The 9 classical graha-gemstone correspondences (Bṛhat Saṁhitā 79 & Garuḍa Purāṇa). Click any graha card:
              </p>

              {/* Grid of 9 Grahas */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem" }}>
                {(Object.keys(NAVARATNA_TABLE) as GrahaKey[]).map((key) => {
                  const info = NAVARATNA_TABLE[key];
                  const isSelected = selectedGraha === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedGraha(key)}
                      style={{
                        padding: "0.55rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: `1px solid ${isSelected ? info.color : HAIRLINE}`,
                        background: isSelected ? "#FDFAF2" : SURFACE,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <strong style={{ display: "block", fontSize: "0.85rem", color: isSelected ? info.color : INK_PRIMARY, fontWeight: 600 }}>
                        {info.graha} ({info.sanskritGraha})
                      </strong>
                      <span style={{ fontSize: "0.775rem", color: INK_MUTED }}>{info.gemstone}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Gemstone Details Card */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${NAVARATNA_TABLE[selectedGraha].color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ ...EYEBROW_STYLE, color: NAVARATNA_TABLE[selectedGraha].color }}>
                    {NAVARATNA_TABLE[selectedGraha].graha} Correspondence
                  </span>
                  <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>Bṛhat Saṁhitā 79</span>
                </div>
                <h4 style={{ margin: "0 0 0.4rem", fontSize: "1.1rem", fontWeight: 600, color: INK_PRIMARY }}>
                  {NAVARATNA_TABLE[selectedGraha].gemstone} ({NAVARATNA_TABLE[selectedGraha].sanskritGem})
                </h4>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  <strong>Element / Energy:</strong> {NAVARATNA_TABLE[selectedGraha].element}
                </p>
                <div style={{ fontSize: "0.825rem", color: INK_PRIMARY, background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}` }}>
                  <strong>Indication Gating:</strong> {NAVARATNA_TABLE[selectedGraha].indication}
                </div>
              </div>
            </div>
          )}

          {/* View 2: Blue Sapphire Refusal */}
          {activeView === "blue_sapphire_refusal" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600 }}>Rohan’s Saturn Evaluation Case</strong>
                  <button
                    type="button"
                    onClick={() => setShowPriorAstrologerView(!showPriorAstrologerView)}
                    style={{
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.775rem",
                      borderRadius: "0.25rem",
                      border: `1px solid ${showPriorAstrologerView ? VERMILION : BLUE}`,
                      background: showPriorAstrologerView ? "#FDF2F0" : "#EBF3FA",
                      color: showPriorAstrologerView ? VERMILION : BLUE,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {showPriorAstrologerView ? "View Correct Discipline" : "View Prior Astrologer Mistake"}
                  </button>
                </div>

                {!showPriorAstrologerView ? (
                  <div style={{ background: "#FDF2F0", padding: "0.85rem", borderRadius: "0.4rem", borderLeft: `3px solid ${VERMILION}` }}>
                    <h4 style={{ margin: "0 0 0.3rem", fontSize: "0.95rem", color: VERMILION, fontWeight: 600 }}>
                      Correct Discipline: Category-Level Refusal (§4.3)
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      <li><strong>Table Lookup:</strong> Saturn = Blue Sapphire (Nīlam). Textually correct!</li>
                      <li><strong>Direction Gate Check:</strong> Rohan&apos;s Saturn is a functional malefic (4th lord only), debilitated, Mahādaśā-active → <strong>PACIFY-INDICATED</strong>.</li>
                      <li><strong>Category Rule:</strong> Gemstones are resonance-based and amplify energy (Strengthen only).</li>
                      <li><strong>Verdict:</strong> Blue Sapphire is <strong>EXCLUDED at the category level</strong> before asking any stone-specific safety questions!</li>
                    </ul>
                  </div>
                ) : (
                  <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.4rem", borderLeft: `3px solid ${GOLD}` }}>
                    <h4 style={{ margin: "0 0 0.3rem", fontSize: "0.95rem", color: GOLD, fontWeight: 600 }}>
                      Prior Astrologer Mistake: Table-Correctness ≠ Prescription-Correctness
                    </h4>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      The prior astrologer looked up Saturn in the table, saw &ldquo;Blue Sapphire,&rdquo; and prescribed it urgently. They mistook text-level correspondence for directional validity — failing to check if Rohan&apos;s Saturn was strengthen-indicated or pacify-indicated! (Common Mistake #1).
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View 3: Tentative Match Tracker */}
          {activeView === "tentative_pipeline" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                  <CheckCircle2 size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Rohan’s Jupiter: Tentative Match Found</strong>
                </div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Jupiter (5th lord, weak, Antardaśā-active) → Strengthen-indicated → Navaratna table matches <strong>Yellow Sapphire (Puṣparāga)</strong> (§4.4).
                </p>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ display: "block", color: GOLD, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Why This Is NOT Yet a Finished Prescription (Lessons 21.3.3–21.3.4 Ahead)
                </strong>

                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <div style={{ background: "#FFF", padding: "0.5rem 0.75rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}` }}>
                    <strong style={{ fontSize: "0.825rem", color: BLUE }}>Lesson 21.3.3 Screening Pending:</strong>
                    <span style={{ fontSize: "0.825rem", color: INK_SECONDARY, display: "block" }}>Heat, hardness, allergen, and cost-ethics safety check.</span>
                  </div>
                  <div style={{ background: "#FFF", padding: "0.5rem 0.75rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}` }}>
                    <strong style={{ fontSize: "0.825rem", color: PURPLE }}>Lesson 21.3.4 Decision Pending:</strong>
                    <span style={{ fontSize: "0.825rem", color: INK_SECONDARY, display: "block" }}>Primary gemstone vs Uparatna substitute evaluation.</span>
                  </div>
                </div>
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
                <strong>Same Rule:</strong> Ratna is resonance-based & strengthen-only (4th time restated).
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Table vs Prescription:</strong> Table-correctness ≠ prescription-correctness.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Category Refusal:</strong> Blue Sapphire refused for Saturn at category level without needing stone-specific tests.
              </li>
              <li>
                <strong>Jupiter Match:</strong> Yellow Sapphire is a tentative match; safety screening & substitute check remain ahead.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
