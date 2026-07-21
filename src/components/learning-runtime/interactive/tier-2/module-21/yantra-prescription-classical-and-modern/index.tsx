"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Hammer,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PillarKey = "gate" | "roles" | "warrant";
type GrahaSelection = "jupiter" | "saturn";
type SourcingMode = "authentic" | "printout";

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

const PILLARS: Record<PillarKey, { title: string; subtitle: string; icon: ReactNode; color: string }> = {
  gate: {
    title: "Strengthen-Only Gate",
    subtitle: "Resonance mechanism amplifies energy → Gated to strengthen indication only",
    icon: <ShieldCheck size={16} aria-hidden="true" />,
    color: BLUE,
  },
  roles: {
    title: "Prescribing vs Constructing",
    subtitle: "Practitioner prescribes & verifies sourcing; Specialist builds & consecrates",
    icon: <Stethoscope size={16} aria-hidden="true" />,
    color: PURPLE,
  },
  warrant: {
    title: "Available ≠ Warranted",
    subtitle: "Rohan’s Guru yantra is matched & cleared — but declined to avoid over-prescription",
    icon: <FileCheck2 size={16} aria-hidden="true" />,
    color: GREEN,
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

function YantraRoleArchitectureSvg({ activePillar, onSelectPillar }: { activePillar: PillarKey; onSelectPillar: (pillar: PillarKey) => void }) {
  return (
    <svg viewBox="0 0 680 170" role="img" aria-label="Yantra Prescription Role Architecture" style={{ width: "100%", maxHeight: 190, margin: "0.4mn auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="150" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Pillar 1 Node */}
      <g transform="translate(25, 25)" onClick={() => onSelectPillar("gate")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="190" height="120" rx="8" fill={activePillar === "gate" ? "#EBF3FA" : "#FFF"} stroke={BLUE} strokeWidth={activePillar === "gate" ? 2.5 : 1} />
        <text x="95" y="25" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">PILLAR 1: SAFETY GATE</text>
        <text x="95" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Strengthen-Only Rule</text>
        <text x="95" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Resonance Amplifies Energy</text>
        <text x="95" y="98" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">Click to Inspect</text>
      </g>

      {/* Connecting Arrow 1 */}
      <path d="M 222 85 L 245 85" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Pillar 2 Node */}
      <g transform="translate(250, 25)" onClick={() => onSelectPillar("roles")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="190" height="120" rx="8" fill={activePillar === "roles" ? "#F5F2FC" : "#FFF"} stroke={PURPLE} strokeWidth={activePillar === "roles" ? 2.5 : 1} />
        <text x="95" y="25" textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="600">PILLAR 2: ROLE SPLIT</text>
        <text x="95" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Prescribe vs Build</text>
        <text x="95" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Practitioner vs Specialist</text>
        <text x="95" y="98" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">Click to Inspect</text>
      </g>

      {/* Connecting Arrow 2 */}
      <path d="M 447 85 L 470 85" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Pillar 3 Node */}
      <g transform="translate(475, 25)" onClick={() => onSelectPillar("warrant")} style={{ cursor: "pointer" }}>
        <rect x="0" y="0" width="180" height="120" rx="8" fill={activePillar === "warrant" ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={activePillar === "warrant" ? 2.5 : 1} />
        <text x="90" y="25" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="600">PILLAR 3: THRESHOLD</text>
        <text x="90" y="55" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Available ≠ Warranted</text>
        <text x="90" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Rohan’s Declined Layer</text>
        <text x="90" y="98" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Click to Inspect</text>
      </g>
    </svg>
  );
}

export function YantraPrescriptionWorkbench() {
  const [activePillar, setActivePillar] = useState<PillarKey>("gate");
  const [selectedGraha, setSelectedGraha] = useState<GrahaSelection>("jupiter");
  const [sourcingMode, setSourcingMode] = useState<SourcingMode>("authentic");
  const [includeYantraLayer, setIncludeYantraLayer] = useState<boolean>(false);

  const resetAll = () => {
    setActivePillar("gate");
    setSelectedGraha("jupiter");
    setSourcingMode("authentic");
    setIncludeYantraLayer(false);
  };

  return (
    <div data-interactive="yantra-prescription-classical-and-modern" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Classical & Modern Yantra Prescription Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Yantra Prescription: Gate Logic, Medical Roles, & Declining Layers
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Explore the three core principles of yantra prescription: why yantra is strengthen-only, how prescribing differs from specialist construction, and why Rohan’s matched yantra layer is correctly declined.
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

      {/* SVG Role Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Yantra Prescription Architecture (§4.1–§4.4)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Click any pillar box below to inspect its detailed rules</span>
        </div>
        <YantraRoleArchitectureSvg activePillar={activePillar} onSelectPillar={setActivePillar} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Pillar Content Panel */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ color: PILLARS[activePillar].color }}>{PILLARS[activePillar].icon}</div>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 600, color: PILLARS[activePillar].color }}>
                {PILLARS[activePillar].title}
              </h3>
            </div>
            <span style={{ fontSize: "0.8rem", background: "#FDFAF2", border: `1px solid ${HAIRLINE}`, borderRadius: "0.4rem", padding: "0.2rem 0.6rem", color: INK_SECONDARY }}>
              Lesson 21.3.1 Principle
            </span>
          </div>

          <p style={{ margin: "0 0 1.25rem", color: INK_SECONDARY, fontSize: "0.925rem", lineHeight: 1.55 }}>
            {PILLARS[activePillar].subtitle}
          </p>

          {/* Pillar 1: Strengthen-Only Gate */}
          {activePillar === "gate" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.4rem" }}>
                  Select Graha Case to Screen:
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setSelectedGraha("jupiter")}
                    style={{
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.85rem",
                      borderRadius: "0.3rem",
                      border: `1px solid ${selectedGraha === "jupiter" ? GREEN : HAIRLINE}`,
                      background: selectedGraha === "jupiter" ? GREEN : "transparent",
                      color: selectedGraha === "jupiter" ? "#FFF" : INK_PRIMARY,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Rohan’s Jupiter (5th Lord, Weak → Strengthen)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGraha("saturn")}
                    style={{
                      padding: "0.35rem 0.75rem",
                      fontSize: "0.85rem",
                      borderRadius: "0.3rem",
                      border: `1px solid ${selectedGraha === "saturn" ? VERMILION : HAIRLINE}`,
                      background: selectedGraha === "saturn" ? VERMILION : "transparent",
                      color: selectedGraha === "saturn" ? "#FFF" : INK_PRIMARY,
                      cursor: "pointer",
                      fontWeight: 500,
                    }}
                  >
                    Rohan’s Saturn (Debilitated Malefic → Pacify)
                  </button>
                </div>
              </div>

              {selectedGraha === "jupiter" ? (
                <div style={{ background: "#E8F5E9", padding: "0.9rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                    <CheckCircle2 size={18} />
                    <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Direction Gate PASSED — Guru Yantra Compatible</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    Jupiter is a functional-benefic (5th lord) indicated for <strong>strengthening</strong>. Because Yantra belongs to the resonance family (amplifying planetary energy via geometry), a Guru yantra is safety-cleared and eligible in principle (§4.1).
                  </p>
                </div>
              ) : (
                <div style={{ background: "#FDF2F0", padding: "0.9rem", borderRadius: "0.5rem", border: `1px solid ${VERMILION}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, marginBottom: "0.3rem" }}>
                    <ShieldAlert size={18} />
                    <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Direction Gate BLOCKED — Saturn Yantra Prohibited!</strong>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                    Saturn is a functional malefic indicated for <strong>pacification</strong>. Yantras amplify energy — prescribing a Saturn yantra would amplify its difficult affliction, exactly like a Saturn gemstone or mantra! (Common Mistake #1).
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pillar 2: Roles Comparison */}
          {activePillar === "roles" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${BLUE}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: BLUE, marginBottom: "0.4rem" }}>
                    <Stethoscope size={18} />
                    <strong style={{ fontSize: "0.9rem", fontWeight: 600 }}>Practitioner Role</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.825rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                    <li>Matches graha to correct yantra.</li>
                    <li>Verifies authentic sourcing & consecration.</li>
                    <li>Provides usage & altar gazing guidance.</li>
                    <li>Does <strong>NOT</strong> build or consecrate personally.</li>
                  </ul>
                </div>

                <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: PURPLE, marginBottom: "0.4rem" }}>
                    <Hammer size={18} />
                    <strong style={{ fontSize: "0.9rem", fontWeight: 600 }}>Specialist Role</strong>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.825rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                    <li>Computes precise sacred geometry (bhūpura/bindu).</li>
                    <li>Crafts physically on metal plate/wood.</li>
                    <li>Performs ritual prāṇa-pratiṣṭhā consecration.</li>
                    <li>Requires dedicated priest/craftsperson training.</li>
                  </ul>
                </div>
              </div>

              {/* Sourcing Verification Toggle */}
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ color: GOLD, fontSize: "0.875rem", fontWeight: 600 }}>Sourcing Verification Checklist (§4.3)</strong>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    <button
                      type="button"
                      onClick={() => setSourcingMode("authentic")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${sourcingMode === "authentic" ? GREEN : HAIRLINE}`,
                        background: sourcingMode === "authentic" ? GREEN : "transparent",
                        color: sourcingMode === "authentic" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Authentic Sourcing
                    </button>
                    <button
                      type="button"
                      onClick={() => setSourcingMode("printout")}
                      style={{
                        padding: "0.2rem 0.5rem",
                        fontSize: "0.75rem",
                        borderRadius: "0.25rem",
                        border: `1px solid ${sourcingMode === "printout" ? VERMILION : HAIRLINE}`,
                        background: sourcingMode === "printout" ? VERMILION : "transparent",
                        color: sourcingMode === "printout" ? "#FFF" : INK_SECONDARY,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Copy-Shop Print (Avoid)
                    </button>
                  </div>
                </div>

                {sourcingMode === "authentic" ? (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                    <strong>Correct:</strong> Practitioner verifies the yantra is crafted on proper metal/wood with precise proportions and consecrated by a trained priest before guiding the client in altar placement.
                  </p>
                ) : (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: VERMILION, lineHeight: 1.45 }}>
                    <strong>Common Mistake #2:</strong> Treating a mass-produced uncertified paper printout as an active yantra or drawing a casual self-made diagram. Sourcing quality is essential!
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Pillar 3: Warrant Threshold & Rohan's Case */}
          {activePillar === "warrant" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FAF5E8", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ display: "block", color: GOLD, fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.3rem" }}>
                  Rohan’s Existing Jupiter Remedial Plan
                </strong>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.4rem" }}>
                  <div style={{ background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${GREEN}` }}>
                    <span style={{ fontSize: "0.75rem", color: GREEN, fontWeight: 600, display: "block" }}>Layer 1 (Leading)</span>
                    <strong style={{ fontSize: "0.85rem", color: INK_PRIMARY }}>Guru Mantra (Active)</strong>
                  </div>
                  <div style={{ background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${GOLD}` }}>
                    <span style={{ fontSize: "0.75rem", color: GOLD, fontWeight: 600, display: "block" }}>Layer 2 (Secondary)</span>
                    <strong style={{ fontSize: "0.85rem", color: INK_PRIMARY }}>Yellow Sapphire (Pending)</strong>
                  </div>
                </div>
              </div>

              {/* Over-prescription Test */}
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <strong style={{ color: PURPLE, fontSize: "0.875rem", fontWeight: 600 }}>Test Adding Layer 3 (Guru Yantra):</strong>
                  <button
                    type="button"
                    onClick={() => setIncludeYantraLayer(!includeYantraLayer)}
                    style={{
                      padding: "0.25rem 0.6rem",
                      fontSize: "0.775rem",
                      borderRadius: "0.25rem",
                      border: `1px solid ${includeYantraLayer ? VERMILION : GREEN}`,
                      background: includeYantraLayer ? "#FDF2F0" : "#E8F5E9",
                      color: includeYantraLayer ? VERMILION : GREEN,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {includeYantraLayer ? "Remove Yantra Layer" : "Add Yantra Layer to Plan"}
                  </button>
                </div>

                {!includeYantraLayer ? (
                  <div style={{ background: "#E8F5E9", padding: "0.75rem", borderRadius: "0.4rem", borderLeft: `3px solid ${GREEN}` }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                      <strong>Disciplined Act:</strong> Guru Yantra is available and safety-compatible, but <strong>DECLINED</strong> for Rohan. His existing 2-layer plan is sufficient for his chart-state. Availability ≠ Warrant! (§4.4)
                    </p>
                  </div>
                ) : (
                  <div style={{ background: "#FDF2F0", padding: "0.75rem", borderRadius: "0.4rem", borderLeft: `3px solid ${VERMILION}` }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: VERMILION, lineHeight: 1.45 }}>
                      <strong>Common Mistake #3 (Over-prescription):</strong> Layering mantra, yantra, and ratna together simply because all three are eligible. Do not add remedies beyond what the chart-state actually warrants!
                    </p>
                  </div>
                )}
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
                <strong>Strengthen-Only:</strong> Yantra is resonance-based; reserved exclusively for functional benefics.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Role Distinction:</strong> Practitioner matches & verifies; specialist builds & consecrates.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Mantra & Yantra:</strong> Used together to reinforce the same graha through sound & geometry.
              </li>
              <li>
                <strong>Rohan’s Case:</strong> Guru yantra is matched & cleared, but <strong>correctly declined</strong>.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
