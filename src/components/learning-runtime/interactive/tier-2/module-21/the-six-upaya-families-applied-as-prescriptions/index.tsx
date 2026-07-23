"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Coins,
  Compass,
  Dog,
  Eye,
  FileCheck2,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Waves,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "material_branching" | "verb_sorter" | "rohan_candidate";
type SilverActKey = "wearing" | "burial" | "donation";

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

function UpayaFamilySorterSvg({ activeSilverAct }: { activeSilverAct: SilverActKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Material Versatility Action Diagram" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Material Input Box */}
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="150" height="90" rx="8" fill="#FFF" stroke={GOLD} strokeWidth="1.5" />
        <text x="75" y="25" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="600">MATERIAL INPUT</text>
        <text x="75" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="600">Silver Coin / Ring</text>
        <text x="75" y="72" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="500">Read the Verb (§4.3)</text>
      </g>

      {/* Branch lines */}
      <path d="M 180 90 L 220 45" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 180 90 L 220 90" stroke={HAIRLINE} strokeWidth="2" />
      <path d="M 180 90 L 220 135" stroke={HAIRLINE} strokeWidth="2" />

      {/* Branch 1: Wearing */}
      <g transform="translate(220, 25)">
        <rect x="0" y="0" width="230" height="40" rx="6" fill={activeSilverAct === "wearing" ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={activeSilverAct === "wearing" ? 2 : 1} />
        <text x="15" y="25" fill={GREEN} fontSize="11" fontWeight="600">VERB: WEAR</text>
        <text x="95" y="25" fill={INK_PRIMARY} fontSize="11" fontWeight="500">→ Family 3 (Item-Wearing)</text>
      </g>

      {/* Branch 2: Burial */}
      <g transform="translate(220, 70)">
        <rect x="0" y="0" width="230" height="40" rx="6" fill={activeSilverAct === "burial" ? "#F5F2FC" : "#FFF"} stroke={PURPLE} strokeWidth={activeSilverAct === "burial" ? 2 : 1} />
        <text x="15" y="25" fill={PURPLE} fontSize="11" fontWeight="600">VERB: BURY</text>
        <text x="95" y="25" fill={INK_PRIMARY} fontSize="11" fontWeight="500">→ Family 4 (Item-Burial)</text>
      </g>

      {/* Branch 3: Donation */}
      <g transform="translate(220, 115)">
        <rect x="0" y="0" width="230" height="40" rx="6" fill={activeSilverAct === "donation" ? "#FDF2F0" : "#FFF"} stroke={VERMILION} strokeWidth={activeSilverAct === "donation" ? 2 : 1} />
        <text x="15" y="25" fill={VERMILION} fontSize="11" fontWeight="600">VERB: DONATE</text>
        <text x="95" y="25" fill={INK_PRIMARY} fontSize="11" fontWeight="500">→ Family 5 (Item-Donation)</text>
      </g>

      {/* Outcome box */}
      <g transform="translate(470, 40)">
        <rect x="0" y="0" width="180" height="100" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">TAKEAWAY RULE</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Action Dictates Family</text>
        <text x="90" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Material alone never</text>
        <text x="90" y="85" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">identifies the family (§4.3)</text>
      </g>
    </svg>
  );
}

export function SixUpayaFamiliesAppliedWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("material_branching");
  const [activeSilverAct, setActiveSilverAct] = useState<SilverActKey>("wearing");

  const resetAll = () => {
    setActiveView("material_branching");
    setActiveSilverAct("wearing");
  };

  return (
    <div data-interactive="the-six-upaya-families-applied-as-prescriptions" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Six Upāya Families Prescription Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              The Six Upāya Families Applied as Prescriptions
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Understanding why action verbs (not materials) define the six Lal Kitab families, and selecting a candidate Saturn food-feeding totka for Rohan.
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

      {/* Material Branching Vector Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Material Versatility & Action Verb Branching (§4.3)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select an action verb below to see how silver branches across 3 different families</span>
        </div>
        <UpayaFamilySorterSvg activeSilverAct={activeSilverAct} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("material_branching")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "material_branching" ? GOLD : HAIRLINE}`,
                background: activeView === "material_branching" ? "#FDFAF2" : "transparent",
                color: activeView === "material_branching" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Silver Versatility Suite
            </button>
            <button
              type="button"
              onClick={() => setActiveView("verb_sorter")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "verb_sorter" ? BLUE : HAIRLINE}`,
                background: activeView === "verb_sorter" ? "#EBF3FA" : "transparent",
                color: activeView === "verb_sorter" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. 6-Family Action Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveView("rohan_candidate")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "rohan_candidate" ? GREEN : HAIRLINE}`,
                background: activeView === "rohan_candidate" ? "#E8F5E9" : "transparent",
                color: activeView === "rohan_candidate" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Rohan’s Candidate Selection
            </button>
          </div>

          {/* View 1: Silver Versatility Suite */}
          {activeView === "material_branching" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                The exact same material (<strong>Silver</strong>) spans 3 different families depending on the action verb (§4.3):
              </p>

              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => setActiveSilverAct("wearing")}
                  style={{
                    padding: "0.3rem 0.7rem",
                    fontSize: "0.8rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${activeSilverAct === "wearing" ? GREEN : HAIRLINE}`,
                    background: activeSilverAct === "wearing" ? GREEN : "transparent",
                    color: activeSilverAct === "wearing" ? "#FFF" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Verb: WEAR (Family 3)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSilverAct("burial")}
                  style={{
                    padding: "0.3rem 0.7rem",
                    fontSize: "0.8rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${activeSilverAct === "burial" ? PURPLE : HAIRLINE}`,
                    background: activeSilverAct === "burial" ? PURPLE : "transparent",
                    color: activeSilverAct === "burial" ? "#FFF" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Verb: BURY (Family 4)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSilverAct("donation")}
                  style={{
                    padding: "0.3rem 0.7rem",
                    fontSize: "0.8rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${activeSilverAct === "donation" ? VERMILION : HAIRLINE}`,
                    background: activeSilverAct === "donation" ? VERMILION : "transparent",
                    color: activeSilverAct === "donation" ? "#FFF" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Verb: DONATE (Family 5)
                </button>
              </div>

              {/* Active Silver Act Card */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                {activeSilverAct === "wearing" && (
                  <div>
                    <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600 }}>Family 3: Item-Wearing (धारण)</strong>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      <strong>Act:</strong> Wearing a solid silver ring or square piece around the neck or finger.
                      <br />
                      <strong>Mechanism:</strong> Serves as a visible, continuous reminder & protective element directly on the body.
                    </p>
                  </div>
                )}
                {activeSilverAct === "burial" && (
                  <div>
                    <strong style={{ color: PURPLE, fontSize: "0.95rem", fontWeight: 600 }}>Family 4: Item-Burial (भूमि प्रवाह)</strong>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      <strong>Act:</strong> Burying a silver coin under an unpaved tree or soil.
                      <br />
                      <strong>Mechanism:</strong> Anchors or fixes planetary energy into the earth, letting go of an affliction&apos;s grip.
                    </p>
                  </div>
                )}
                {activeSilverAct === "donation" && (
                  <div>
                    <strong style={{ color: VERMILION, fontSize: "0.95rem", fontWeight: 600 }}>Family 5: Item-Donation (दान)</strong>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      <strong>Act:</strong> Gifting a silver item to a recipient on a specific weekday.
                      <br />
                      <strong>Mechanism:</strong> Transfers the burden of an affliction outward to a symbolic recipient.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View 2: 6-Family Action Matrix */}
          {activeView === "verb_sorter" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  The 6 Action Families (§4.1 Table)
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li><strong>1. Object-Throwing:</strong> Releasing item into flowing water (Jal Pravāha).</li>
                  <li><strong>2. Food-Feeding:</strong> Giving food to recipients/animals (Jīva Sevā).</li>
                  <li><strong>3. Item-Wearing:</strong> Keeping item on body (Dhāraṇa).</li>
                  <li><strong>4. Item-Burial:</strong> Fixing item in unpaved ground (Bhūmi Pravāha).</li>
                  <li><strong>5. Item-Donation:</strong> Transferring item to recipient on weekday (Dāna).</li>
                  <li><strong>6. Behavioral:</strong> Ongoing lifestyle or conduct rule (Niyama).</li>
                </ul>
              </div>
            </div>
          )}

          {/* View 3: Rohan's Candidate Selection */}
          {activeView === "rohan_candidate" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                  <CheckCircle2 size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Working Candidate: Feeding Black Dogs on Saturdays (Family 2)</strong>
                </div>
                <p style={{ margin: 0, fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Rohan’s Saturn is pacify-indicated. Between Family 2 (Food-Feeding) and Family 5 (Item-Donation of black items), <strong>Food-Feeding</strong> is selected as the lower-friction, repeatable weekly practice (§4.4).
                </p>
              </div>

              <div style={{ background: "#FFF8E1", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GOLD}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Selection vs Finalization Caution (§4.4 & §8 Mistake 3)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.45 }}>
                  Selecting a working candidate is NOT a finished prescription yet! Lesson 21.4.3 will screen this candidate for cancellations and contraindications before Lesson 21.4.4 writes out the deliverable.
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
                <strong>Six Families:</strong> Object-throwing, food-feeding, wearing, burial, donation, behavioral.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Read the Verb:</strong> Material alone never identifies a family.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Orientations:</strong> Loose tendencies, not rigid rules.
              </li>
              <li>
                <strong>Rohan’s Candidate:</strong> Feeding black dogs on Saturdays (Family 2, pending screening).
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
