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
  Gift,
  Globe,
  Globe2,
  Heart,
  HelpCircle,
  Info,
  Layers,
  Lock,
  MessageSquare,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "disclosure_spectrum" | "remedy_classifier" | "daniel_case";
type PathKey = "pressure" | "correct" | "exclusion";
type RemedyCategoryKey = "food_feeding" | "ordinary_dana" | "deity_mantra";

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

function CrossCulturalDisclosureSpectrumSvg({ selectedPath }: { selectedPath: PathKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Cross-Cultural Disclosure Spectrum" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Wrong Default 1: Pressure */}
      <g transform="translate(25, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill={selectedPath === "pressure" ? "#FDF2F0" : "#FFF"} stroke={VERMILION} strokeWidth={selectedPath === "pressure" ? 2.5 : 1.5} />
        <text x="90" y="22" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">WRONG DEFAULT 1 (§4.1)</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Pressure / Coercion</text>
        <text x="90" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Unconscious assumption</text>
        <text x="90" y="85" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">imposing religiously-embedded acts</text>
        <text x="90" y="105" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="600">Coercion Risk</text>
      </g>

      {/* Correct Middle Path */}
      <g transform="translate(230, 25)">
        <rect x="0" y="0" width="220" height="130" rx="8" fill={selectedPath === "correct" ? "#E8F5E9" : "#FFF"} stroke={GREEN} strokeWidth={selectedPath === "correct" ? 2.5 : 2} />
        <text x="110" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">CORRECT MIDDLE PATH (§4.1)</text>
        <text x="110" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Full Content Disclosure</text>
        <text x="110" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Disclose content & stance transparently</text>
        <text x="110" y="88" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">+ Informed Opt-In / Substitution</text>
        <text x="110" y="108" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Respect Client Autonomy</text>
      </g>

      {/* Wrong Default 2: Silent Exclusion */}
      <g transform="translate(475, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill={selectedPath === "exclusion" ? "#FFF8E1" : "#FFF"} stroke={GOLD} strokeWidth={selectedPath === "exclusion" ? 2.5 : 1.5} />
        <text x="90" y="22" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="600">WRONG DEFAULT 2 (§4.1)</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">Silent Exclusion</text>
        <text x="90" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Withholding remedies assuming</text>
        <text x="90" y="85" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">client wouldn't want them</text>
        <text x="90" y="105" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="600">Prejudges Client</text>
      </g>
    </svg>
  );
}

export function CrossCulturalCareWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("disclosure_spectrum");
  const [selectedPath, setSelectedPath] = useState<PathKey>("correct");
  const [selectedCategory, setSelectedCategory] = useState<RemedyCategoryKey>("food_feeding");

  const resetAll = () => {
    setActiveView("disclosure_spectrum");
    setSelectedPath("correct");
    setSelectedCategory("food_feeding");
  };

  return (
    <div data-interactive="cross-cultural-care-when-prescribing-upaya-to-non-hindu-clients" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Cross-Cultural Care & Informed Choice Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Cross-Cultural Care When Prescribing Upāya to Non-Hindu Clients
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Disclosure, informed choice, and honest accommodation without distortion: avoiding both pressure and silent exclusion through transparent client autonomy.
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

      {/* Vector Disclosure Spectrum Diagram */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <div>
            <p style={EYEBROW_STYLE}>Cross-Cultural Disclosure Spectrum (§4.1)</p>
            <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Select a path to evaluate its ethical implications</span>
          </div>
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSelectedPath("pressure")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedPath === "pressure" ? VERMILION : HAIRLINE}`,
                background: selectedPath === "pressure" ? VERMILION : "transparent",
                color: selectedPath === "pressure" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Default 1: Pressure
            </button>
            <button
              type="button"
              onClick={() => setSelectedPath("correct")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedPath === "correct" ? GREEN : HAIRLINE}`,
                background: selectedPath === "correct" ? GREEN : "transparent",
                color: selectedPath === "correct" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Correct Middle Path
            </button>
            <button
              type="button"
              onClick={() => setSelectedPath("exclusion")}
              style={{
                padding: "0.25rem 0.6rem",
                fontSize: "0.775rem",
                borderRadius: "0.25rem",
                border: `1px solid ${selectedPath === "exclusion" ? GOLD : HAIRLINE}`,
                background: selectedPath === "exclusion" ? GOLD : "transparent",
                color: selectedPath === "exclusion" ? "#FFF" : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Default 2: Exclusion
            </button>
          </div>
        </div>

        <CrossCulturalDisclosureSpectrumSvg selectedPath={selectedPath} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("disclosure_spectrum")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "disclosure_spectrum" ? GREEN : HAIRLINE}`,
                background: activeView === "disclosure_spectrum" ? "#E8F5E9" : "transparent",
                color: activeView === "disclosure_spectrum" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Disclosure Checklist
            </button>
            <button
              type="button"
              onClick={() => setActiveView("remedy_classifier")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "remedy_classifier" ? BLUE : HAIRLINE}`,
                background: activeView === "remedy_classifier" ? "#EBF3FA" : "transparent",
                color: activeView === "remedy_classifier" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Remedy Compatibility Classifier
            </button>
            <button
              type="button"
              onClick={() => setActiveView("daniel_case")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "daniel_case" ? PURPLE : HAIRLINE}`,
                background: activeView === "daniel_case" ? "#F5F2FC" : "transparent",
                color: activeView === "daniel_case" ? PURPLE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Case Walkthrough: Daniel
            </button>
          </div>

          {/* View 1: Disclosure Checklist */}
          {activeView === "disclosure_spectrum" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Full Content Disclosure Requirements (§4.2)
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li><strong>1. Lineage Lineage:</strong> Disclose tradition of origin (Classical Vedic, Folk Lal Kitab).</li>
                  <li><strong>2. Physical & Verbal Content:</strong> State exactly what physical acts or spoken words are involved.</li>
                  <li><strong>3. Devotional Stance:</strong> Disclose whether belief in a specific deity or ritual posture is required.</li>
                  <li><strong>4. Genuine Optionality:</strong> State clearly that declining or substituting carries zero penalty.</li>
                </ul>
              </div>
            </div>
          )}

          {/* View 2: Remedy Compatibility Classifier */}
          {activeView === "remedy_classifier" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                Distinguishing secular-compatible acts from remedies that cannot be honestly stripped of religious content (§4.3):
              </p>

              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("food_feeding")}
                  style={{
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.8rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${selectedCategory === "food_feeding" ? GREEN : HAIRLINE}`,
                    background: selectedCategory === "food_feeding" ? GREEN : "transparent",
                    color: selectedCategory === "food_feeding" ? "#FFF" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Food-Feeding Totka
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ordinary_dana")}
                  style={{
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.8rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${selectedCategory === "ordinary_dana" ? BLUE : HAIRLINE}`,
                    background: selectedCategory === "ordinary_dana" ? BLUE : "transparent",
                    color: selectedCategory === "ordinary_dana" ? "#FFF" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Secular Dāna Sibling
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("deity_mantra")}
                  style={{
                    padding: "0.3rem 0.6rem",
                    fontSize: "0.8rem",
                    borderRadius: "0.25rem",
                    border: `1px solid ${selectedCategory === "deity_mantra" ? VERMILION : HAIRLINE}`,
                    background: selectedCategory === "deity_mantra" ? VERMILION : "transparent",
                    color: selectedCategory === "deity_mantra" ? "#FFF" : INK_SECONDARY,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Deity Mantra / Pūjā
                </button>
              </div>

              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                {selectedCategory === "food_feeding" && (
                  <div>
                    <strong style={{ color: GREEN, fontSize: "0.95rem", fontWeight: 600 }}>Secular-Compatible by Action</strong>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      Feeding animals (e.g. dogs/birds) carries no required religious belief or ritual gesture. Travels easily across religious lines.
                    </p>
                  </div>
                )}
                {selectedCategory === "ordinary_dana" && (
                  <div>
                    <strong style={{ color: BLUE, fontSize: "0.95rem", fontWeight: 600 }}>Secular-Sibling Category (T1-15 15.5.4)</strong>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      Ordinary charitable giving or community support. Offered *alongside* graha-dāna as a separate option carrying similar intent.
                    </p>
                  </div>
                )}
                {selectedCategory === "deity_mantra" && (
                  <div>
                    <strong style={{ color: VERMILION, fontSize: "0.95rem", fontWeight: 600 }}>Non-Transferable Religious Content</strong>
                    <p style={{ margin: "0.4rem 0 0", fontSize: "0.875rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                      A Sanskrit deity mantra cannot be quietly &ldquo;de-religionized&rdquo; by stripping deity names. Offer transparently as-is, or substitute a separate secular sibling (Dāna/Fasting), never alter quietly!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* View 3: Case Walkthrough Daniel */}
          {activeView === "daniel_case" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#F5F2FC", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${PURPLE}` }}>
                <strong style={{ color: PURPLE, fontSize: "0.95rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Case Simulation: Daniel (Non-Hindu Client) (§4.4)
                </strong>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li style={{ marginBottom: "0.4rem" }}>
                    <strong>Food-Feeding Totka:</strong> Disclosed fully → Daniel opts in without hesitation.
                  </li>
                  <li style={{ marginBottom: "0.4rem" }}>
                    <strong>Deity Mantra / Pūjā:</strong> Disclosed transparently → Daniel politely declines.
                  </li>
                  <li>
                    <strong>Substitution:</strong> Offered non-religious dāna option addressing same graha → Daniel accepts.
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
              <p style={{ ...EYEBROW_STYLE, color: GOLD }}>Key Takeaways (§9)</p>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Disclose & Choose:</strong> Full content disclosure + client opt-in.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>No Quiet Stripping:</strong> Never quietly &ldquo;de-religionize&rdquo; a deity mantra.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Secular Siblings:</strong> Offer ordinary charity or food-feeding alongside devotional options.
              </li>
              <li>
                <strong>Individual Autonomy:</strong> Avoid monolithic assumptions about any group.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
