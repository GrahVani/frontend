"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileCheck2,
  Flame,
  Gift,
  Heart,
  HelpCircle,
  Info,
  Layers,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "dana_lookup" | "mechanism_comparison" | "rohan_prescription";
type GrahaKey = "saturn" | "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "rahu" | "ketu";

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

interface DanaInfo {
  graha: string;
  items: string;
  recipients: string;
  day: string;
  color: string;
}

const DANA_DATA: Record<GrahaKey, DanaInfo> = {
  saturn: {
    graha: "Saturn (Śani)",
    items: "Black sesame, iron, mustard oil, black/blue cloth",
    recipients: "Laborers, the elderly, the needy or disabled",
    day: "Saturday (or during Saturn Mahādaśā)",
    color: PURPLE,
  },
  sun: {
    graha: "Sun (Sūrya)",
    items: "Wheat, jaggery, copper, gold",
    recipients: "Father-figures, leaders, community elders",
    day: "Sunday",
    color: VERMILION,
  },
  moon: {
    graha: "Moon (Candra)",
    items: "Rice, milk, silver, white cloth",
    recipients: "Mothers, women, orphanages",
    day: "Monday",
    color: BLUE,
  },
  mars: {
    graha: "Mars (Maṅgala)",
    items: "Red lentils (masoor), copper, red cloth",
    recipients: "The brave, soldiers, emergency workers",
    day: "Tuesday",
    color: VERMILION,
  },
  mercury: {
    graha: "Mercury (Budha)",
    items: "Green gram (moong), green cloth",
    recipients: "Students, schools, educational charities",
    day: "Wednesday",
    color: GREEN,
  },
  jupiter: {
    graha: "Jupiter (Bṛhaspati)",
    items: "Turmeric, chanā dāl, yellow items, gold",
    recipients: "Teachers, scholars, priests, libraries",
    day: "Thursday",
    color: GOLD,
  },
  venus: {
    graha: "Venus (Śukra)",
    items: "White/silk cloth, sugar, perfume",
    recipients: "Women, artists, cultural institutions",
    day: "Friday",
    color: BLUE,
  },
  rahu: {
    graha: "Rahu (Rāhu)",
    items: "Mustard, a blanket",
    recipients: "The destitute, shelters",
    day: "Saturday evening",
    color: GOLD,
  },
  ketu: {
    graha: "Ketu (Ketu)",
    items: "Multicoloured cloth, a blanket",
    recipients: "Ascetics, monk shelters, the needy",
    day: "Tuesday / Sunday",
    color: PURPLE,
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

function DanaRemediationArchitectureSvg({ activeView }: { activeView: ViewKey }) {
  return (
    <svg viewBox="0 0 680 180" role="img" aria-label="Karma-Balancing Dāna Architecture" style={{ width: "100%", maxHeight: 200, margin: "0.5rem auto", display: "block" }}>
      <rect x="10" y="10" width="660" height="160" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />

      {/* Resonance Box */}
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="180" height="130" rx="8" fill="#FFF" stroke={BLUE} strokeWidth="1.5" />
        <text x="90" y="22" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">RESONANCE REMEDIES</text>
        <text x="90" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Mantra • Yantra • Gem</text>
        <text x="90" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Amplifies Energy (§4.2)</text>
        <text x="90" y="98" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="600">Strengthen-Only Gate</text>
      </g>

      {/* VS Text */}
      <text x="235" y="95" textAnchor="middle" fill={GOLD} fontSize="14" fontWeight="600">VS</text>

      {/* Dāna Box */}
      <g transform="translate(260, 25)">
        <rect x="0" y="0" width="200" height="130" rx="8" fill="#FFF" stroke={GREEN} strokeWidth="1.5" />
        <text x="100" y="22" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">DĀNA / CHARITY (§4.2)</text>
        <text x="100" y="48" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Generosity / Karmic Balance</text>
        <text x="100" y="70" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight="500">Balances Kriyamāṇa/Sañcita</text>
        <text x="100" y="98" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">Universal Safety (Not Gated)</text>
      </g>

      {/* Arrow */}
      <path d="M 465 90 L 495 90" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 4" />

      {/* Rohan Saturn Dāna Status Box */}
      <g transform="translate(495, 25)">
        <rect x="0" y="0" width="155" height="130" rx="8" fill="#E8F5E9" stroke={PURPLE} strokeWidth="2" />
        <text x="77" y="22" textAnchor="middle" fill={PURPLE} fontSize="10" fontWeight="600">ROHAN SATURN DĀNA</text>
        <text x="77" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">Black Sesame & Oil</text>
        <text x="77" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Elderly / Needy Recipient</text>
        <text x="77" y="100" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">4th Layer Prescription</text>
      </g>
    </svg>
  );
}

export function DanaPrescriptionWorkbench() {
  const [activeView, setActiveView] = useState<ViewKey>("dana_lookup");
  const [selectedGraha, setSelectedGraha] = useState<GrahaKey>("saturn");

  const resetAll = () => {
    setActiveView("dana_lookup");
    setSelectedGraha("saturn");
  };

  return (
    <div data-interactive="dana-prescription-charity-as-remediation-applied" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      {/* Header section */}
      <section style={CARD_STYLE}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={EYEBROW_STYLE}>Chapter 5 Opening Workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Dāna Prescription: Charity as Remediation Applied
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontSize: "0.95rem" }}>
              Operationalising the cheapest, safest, most universally good remedy: understanding why dāna is not resonance-bound and prescribing Rohan’s Saturn dāna.
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
          <p style={EYEBROW_STYLE}>Karma-Balancing Dāna Architecture (§4.2)</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Contrasting Resonance Amplification vs Karmic Balancing Generosity</span>
        </div>
        <DanaRemediationArchitectureSvg activeView={activeView} />
      </section>

      {/* Main Interactive Layout */}
      <div style={workbenchDiagramLayoutStyle}>
        {/* Main Panel Content */}
        <section style={{ ...CARD_STYLE, flex: "2 1 480px" }}>
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.5rem", marginBottom: "1rem", gap: "0.4rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setActiveView("dana_lookup")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "dana_lookup" ? GOLD : HAIRLINE}`,
                background: activeView === "dana_lookup" ? "#FDFAF2" : "transparent",
                color: activeView === "dana_lookup" ? GOLD : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              1. Graha-Dāna Table Lookup
            </button>
            <button
              type="button"
              onClick={() => setActiveView("mechanism_comparison")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "mechanism_comparison" ? BLUE : HAIRLINE}`,
                background: activeView === "mechanism_comparison" ? "#EBF3FA" : "transparent",
                color: activeView === "mechanism_comparison" ? BLUE : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              2. Mechanism Comparison
            </button>
            <button
              type="button"
              onClick={() => setActiveView("rohan_prescription")}
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderRadius: "0.3rem",
                border: `1px solid ${activeView === "rohan_prescription" ? GREEN : HAIRLINE}`,
                background: activeView === "rohan_prescription" ? "#E8F5E9" : "transparent",
                color: activeView === "rohan_prescription" ? GREEN : INK_SECONDARY,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              3. Rohan’s Saturn Prescription
            </button>
          </div>

          {/* View 1: Graha-Dāna Table Lookup */}
          {activeView === "dana_lookup" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                Select a graha to view its traditional dāna items, recipients, and timing (§4.1 Table):
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem" }}>
                {(Object.keys(DANA_DATA) as GrahaKey[]).map((key) => {
                  const info = DANA_DATA[key];
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
                        {info.graha.split(" ")[0]}
                      </strong>
                    </button>
                  );
                })}
              </div>

              {/* Selected Graha Details Card */}
              <div style={{ background: "#FDFAF2", padding: "1rem", borderRadius: "0.5rem", border: `1px solid ${DANA_DATA[selectedGraha].color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ ...EYEBROW_STYLE, color: DANA_DATA[selectedGraha].color }}>
                    {DANA_DATA[selectedGraha].graha} Dāna Correspondence
                  </span>
                  <span style={{ fontSize: "0.75rem", color: INK_MUTED }}>T1-15 15.5.1 Continuity</span>
                </div>

                <div style={{ display: "grid", gap: "0.5rem", margin: "0.4rem 0" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Traditional Items</span>
                    <strong style={{ fontSize: "0.875rem", color: INK_PRIMARY }}>{DANA_DATA[selectedGraha].items}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Symbolic Recipients</span>
                    <strong style={{ fontSize: "0.875rem", color: INK_PRIMARY }}>{DANA_DATA[selectedGraha].recipients}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: INK_MUTED, display: "block" }}>Recommended Timing</span>
                    <strong style={{ fontSize: "0.875rem", color: GREEN }}>{DANA_DATA[selectedGraha].day}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View 2: Mechanism Comparison */}
          {activeView === "mechanism_comparison" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#FFF", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: BLUE, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Resonance Categories (Mantra / Yantra / Gemstone)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                  Work by <strong>amplifying planetary energy</strong>. Restricted to strengthen-indicated grahas to prevent amplifying harm.
                </p>
              </div>

              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <strong style={{ color: GREEN, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Karmic Balancing Category (Dāna / Charity)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.5 }}>
                  Works by <strong>generosity balancing karma</strong> (kriyamāṇa/sañcita). Not resonance-bound — safe for both pacify and strengthen indications!
                </p>
              </div>
            </div>
          )}

          {/* View 3: Rohan's Saturn Prescription */}
          {activeView === "rohan_prescription" && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ background: "#E8F5E9", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${GREEN}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, marginBottom: "0.3rem" }}>
                  <CheckCircle2 size={18} />
                  <strong style={{ fontWeight: 600, fontSize: "0.95rem" }}>Rohan’s Working Saturn Dāna Prescription (§4.3)</strong>
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <li><strong>Items:</strong> Black sesame & mustard oil.</li>
                  <li><strong>Recipients:</strong> Elderly or needy laborers.</li>
                  <li><strong>Timing:</strong> Saturdays during current Saturn Mahādaśā.</li>
                  <li><strong>Framing:</strong> Offered without expectation of commercial transaction.</li>
                </ul>
              </div>

              <div style={{ background: "#FDFAF2", padding: "0.85rem", borderRadius: "0.5rem", border: `1px solid ${HAIRLINE}` }}>
                <strong style={{ color: GOLD, fontSize: "0.9rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>
                  Without-Expectation Client Framing (§4.4)
                </strong>
                <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
                  &ldquo;This dāna is not a transaction expected to buy off Saturn&apos;s difficulty. The giving itself does real good for its recipient regardless of any astrological effect.&rdquo;
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
                <strong>Table Unchanged:</strong> Same correspondences, added selection judgment.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Not Resonance-Bound:</strong> Generosity balances karma, universally safe.
              </li>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Rohan’s Dāna:</strong> Black sesame/oil to elderly on Saturdays.
              </li>
              <li>
                <strong>Without Expectation:</strong> Delivered as plain honest client framing.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
