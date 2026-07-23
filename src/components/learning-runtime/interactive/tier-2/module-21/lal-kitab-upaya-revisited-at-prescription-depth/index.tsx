"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Dog,
  Eye,
  Feather,
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

type ViewKey = "families_matrix" | "resonance_vs_totke" | "entry_sequence";
type FamilyKey = "throwing" | "feeding" | "wearing" | "burial" | "donation" | "behavioral";

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

interface FamilyInfo {
  title: string;
  hindiTerm: string;
  actionDesc: string;
  versatilityExample: string;
  directionalFlexibility: string;
  icon: ReactNode;
  color: string;
}

const UPAYA_FAMILIES: Record<FamilyKey, FamilyInfo> = {
  throwing: {
    title: "Object-Throwing",
    hindiTerm: "जल प्रवाह (Jal Pravāha)",
    actionDesc: "Releasing an item into clean, flowing water to release or ease planetary afflictions.",
    versatilityExample: "Silver coins or barley immersed into flowing river.",
    directionalFlexibility: "Per-act check: Can be pacify-aligned (releasing malefic energy).",
    icon: <Waves size={16} aria-hidden="true" />,
    color: BLUE,
  },
  feeding: {
    title: "Food-Feeding",
    hindiTerm: "जीव सेवा (Jīva Sevā)",
    actionDesc: "Giving specific food items to animals, birds, or specific living recipients.",
    versatilityExample: "Oiled rotis to black dogs (Saturn) or grain to cows/birds.",
    directionalFlexibility: "Per-act check: Highly accessible pacify-aligned household act.",
    icon: <Dog size={16} aria-hidden="true" />,
    color: GREEN,
  },
  wearing: {
    title: "Item-Wearing",
    hindiTerm: "धारण (Dhāraṇa)",
    actionDesc: "Keeping a small metal or natural element directly on the body.",
    versatilityExample: "Wearing a solid silver square/ring on neck or finger.",
    directionalFlexibility: "Per-act check: Can be strengthen-supporting or protective.",
    icon: <Sparkles size={16} aria-hidden="true" />,
    color: GOLD,
  },
  burial: {
    title: "Item-Burial",
    hindiTerm: "भूमि प्रवाह / दबाना",
    actionDesc: "Fixing or burying a small elemental item in unpaved soil or isolated ground.",
    versatilityExample: "Burying surma (kohl) or mustard oil in ground.",
    directionalFlexibility: "Per-act check: Pacify-aligned (anchoring or neutralizing malefic influence).",
    icon: <MapPin size={16} aria-hidden="true" />,
    color: PURPLE,
  },
  donation: {
    title: "Item-Donation",
    hindiTerm: "दान (Dāna / Bheṇṭa)",
    actionDesc: "Transferring a specific item to a traditional recipient on a fixed weekday.",
    versatilityExample: "Donating black mustard seeds or iron on Saturday.",
    directionalFlexibility: "Per-act check: Pacify-aligned (transferring debt/affliction).",
    icon: <Gift size={16} aria-hidden="true" />,
    color: VERMILION,
  },
  behavioral: {
    title: "Behavioral",
    hindiTerm: "नियम / परहेज (Niyama)",
    actionDesc: "An ongoing personal rule of conduct, restraint, or lifestyle discipline.",
    versatilityExample: "Avoiding alcohol/non-veg, respecting elders, avoiding false speech.",
    directionalFlexibility: "Per-act check: Universal protective & moral discipline.",
    icon: <Heart size={16} aria-hidden="true" />,
    color: GOLD,
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

function LalKitabEntryFrameworkSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Lal Kitab Decision Framework Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Box 1: Resonance Gate */}
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="600">RESONANCE CATEGORIES</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Mantra • Yantra • Ratna</text>
        <text x="90" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Amplifies Energy (§4.2)</text>
        <text x="90" y="98" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">Strengthen-Only Gate</text>
      </g>

      {/* VS Arrow */}
      <text x="235" y="95" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="600">VS</text>

      {/* Box 2: Lal Kitab Empirical Totke */}
      <g transform="translate(260, 25)">
        <rect x="0" y="0" width="200" height="130" rx="8" fill="#FFF" stroke={GREEN} strokeWidth="1.5" />
        <text x="100" y="22" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="600">LAL KITAB TOTKE (§4.2)</text>
        <text x="100" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">6 Household Action Families</text>
        <text x="100" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Debt-Settling / Neutralizing</text>
        <text x="100" y="98" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Per-Act Direction Alignment</text>
      </g>

      {/* Arrow to Entry Sequence */}
      <path d="M 465 90 L 495 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Box 3: Rohan Entry Status */}
      <g transform="translate(495, 25)">
        <rect x="0" y="0" width="155" height="130" rx="8" fill="#EBF3FA" stroke={PURPLE} strokeWidth="2" />
        <text x="77" y="22" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">ROHAN ENTRY DISCIPLINE</text>
        <text x="77" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Saturn (Pacify)</text>
        <text x="77" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Parāśarī Single-Stream</text>
        <text x="77" y="100" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">Lowest-Friction 1st Step</text>
      </g>
    </svg>
  );
}

export function LalKitabUpayaRevisitedWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("families_matrix");
  const [selectedFamily, setSelectedFamily] = useState<FamilyKey>("feeding");

  const resetAll = () => {
    setActiveView("families_matrix");
    setSelectedFamily("feeding");
  };

  return (
    <div data-interactive="lal-kitab-upaya-revisited-at-prescription-depth" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 4 Opening Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Lal Kitab Upāya Revisited at Prescription Depth
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              From recognizing totke to prescribing them: understanding why Lal Kitab upāyas do not follow mantra/yantra/ratna’s strengthen-only gate, and inheriting the single-stream entry discipline.
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

      {/* Vector Decision Framework Architecture Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={EYEBROW_STYLE}>Decision Framework & Category Gate Architecture (§4.2)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Contrasting Resonance Categories vs Lal Kitab Household Totke</span>
        </div>
        <LalKitabEntryFrameworkSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("families_matrix")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "families_matrix" ? GREEN : HAIRLINE}`,
                background: activeView === "families_matrix" ? "#E8F5E9" : "transparent",
                color: activeView === "families_matrix" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. 6 Action Families Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveView("resonance_vs_totke")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "resonance_vs_totke" ? BLUE : HAIRLINE}`,
                background: activeView === "resonance_vs_totke" ? "#EBF3FA" : "transparent",
                color: activeView === "resonance_vs_totke" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Resonance vs Totke Mechanisms
            </button>
            <button
              type="button"
              onClick={() => setActiveView("entry_sequence")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "entry_sequence" ? PURPLE : HAIRLINE}`,
                background: activeView === "entry_sequence" ? "#F5F2FC" : "transparent",
                color: activeView === "entry_sequence" ? PURPLE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Entry Discipline Simulator
            </button>
          </div>

          {/* View 1: 6 Action Families Matrix */}
          {activeView === "families_matrix" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                Lal Kitab totke sort by <strong>action</strong>, not by material or planet (§4.1). Select a family to inspect its mechanism:
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem" }}>
                {(Object.keys(UPAYA_FAMILIES) as FamilyKey[]).map((key) => {
                  const info = UPAYA_FAMILIES[key];
                  const isSelected = selectedFamily === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedFamily(key)}
                      style={{
                        padding: "0.55rem 0.6rem",
                        borderRadius: "0.4rem",
                        border: `1px solid ${isSelected ? info.color : HAIRLINE}`,
                        background: isSelected ? "#FDFAF2" : SURFACE,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ color: info.color, display: "flex", justifyContent: "center", marginBottom: "0.2rem" }}>
                        {info.icon}
                      </div>
                      <strong style={{ display: "block", fontSize: "0.85rem", color: isSelected ? info.color : INK_PRIMARY, fontWeight: 600 }}>
                        {info.title}
                      </strong>
                    </button>
                  );
                })}
              </div>

              {/* Selected Family Details Card */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${UPAYA_FAMILIES[selectedFamily].color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ ...EYEBROW_STYLE, color: UPAYA_FAMILIES[selectedFamily].color }}>
                    {UPAYA_FAMILIES[selectedFamily].title} Family
                  </span>
                  <span style={{ fontSize: "0.775rem", color: INK_MUTED }}>{UPAYA_FAMILIES[selectedFamily].hindiTerm}</span>
                </div>
                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  {UPAYA_FAMILIES[selectedFamily].actionDesc}
                </p>
                <div style={{ fontSize: "0.825rem", color: INK_SECONDARY, background: "#FFF", padding: "0.5rem", borderRadius: "0.3rem", border: `1px solid ${HAIRLINE}`, marginBottom: "0.4rem" }}>
                  <strong>Example Act:</strong> {UPAYA_FAMILIES[selectedFamily].versatilityExample}
                </div>
                <div style={{ fontSize: "0.8rem", color: UPAYA_FAMILIES[selectedFamily].color, fontWeight: 500 }}>
                  {UPAYA_FAMILIES[selectedFamily].directionalFlexibility}
                </div>
              </div>
            </div>
          )}

          {/* View 2: Resonance vs Totke Mechanisms */}
          {activeView === "resonance_vs_totke" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Why Mantra, Yantra, & Ratna are Strengthen-Only (§4.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  These categories work by <strong>resonance amplification</strong>. They increase the planetary energy flowing into the native. Amplifying a functional malefic increases harm — hence the strict strengthen-only gate.
                </p>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Why Lal Kitab Totke Hold Per-Act Directional Alignment (§4.2)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Totke work by <strong>debt-settling, neutralizing, or environmental balancing</strong>. Individual totke carry their own directional character (strengthen-aligned vs pacify-aligned). The rule is per-totka consistency with the diagnosed direction!
                </p>
              </div>
            </div>
          )}

          {/* View 3: Entry Sequence Simulator */}
          {activeView === "entry_sequence" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Inherited Cross-Stream Entry Discipline (§4.3)
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li style={{ marginBottom: "0.4rem" }}>
                    <strong>Step 1 (Single-Stream Diagnosis):</strong> Diagnosis stands on Parāśarī alone. Rohan’s Saturn = Pacify indicated.
                  </li>
                  <li style={{ marginBottom: "0.4rem" }}>
                    <strong>Step 2 (Teva Cross-Validation):</strong> Lal Kitab Teva angle cross-checks the finding.
                  </li>
                  <li>
                    <strong>Step 3 (Per-Totka Direction Check):</strong> Choose a pacify-aligned totka matching Saturn easing.
                  </li>
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
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Rohan’s Saturn Preview (§4.4)</p>
            </div>
            <p style={{ margin: "0 0 0.6rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Rohan’s Saturn is pacify-indicated. A Lal Kitab Saturn totka (e.g. food-feeding to black dogs) provides the <strong>lowest-friction first step</strong> in his Saturn plan, ahead of Chapter 5&apos;s Dāna and Upavāsa.
            </p>
            <div style={{ fontSize: "0.775rem", color: INK_MUTED, borderTop: `1px solid ${HAIRLINE}`, paddingTop: "0.4rem" }}>
              Detailed totka prescription selection follows in Lesson 21.4.2.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
