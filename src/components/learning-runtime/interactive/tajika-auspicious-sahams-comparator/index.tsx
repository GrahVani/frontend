"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Award } from "lucide-react";
import { IAST } from "../../chrome/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";
const LIGHT_BG = "#FCFAF2";

interface SahamProfile {
  name: string;
  sanskrit: string;
  dayFormula: string;
  nightFormula: string;
  domain: string;
  crossCultural: string;
  houseMeanings: Record<number, string>;
  overPromiseSample: string;
  compliantSample: string;
}

const SAHAM_PROFILES: Record<"Punya" | "Vidya" | "Yashas", SahamProfile> = {
  Punya: {
    name: "Punya Saham",
    sanskrit: "पुण्य सहम",
    dayFormula: "(Moon − Sun + Lagna) mod 360°",
    nightFormula: "(Sun − Moon + Lagna) mod 360°",
    domain: "Accumulated spiritual merit, auspicious opportunities, good karma, overall yearly fortune context.",
    crossCultural: "Hellenistic Lot of Fortune (κλῆρος τύχης) / Latin Pars Fortunae / Arabic Lot of Fortune",
    houseMeanings: {
      1: "Auspiciousness manifesting directly in personal efforts, physical wellbeing, and self-expression.",
      2: "Opportunities for financial stability, nourishing speech, and family harmony.",
      3: "Auspicious year-context for self-motivation, writing, short travels, and sibling collaborations.",
      4: "Favorable conditions for home comforts, property acquisition, and inner emotional contentment.",
      5: "Intellectual creativity, educational milestones, and happiness regarding children.",
      6: "Auspicious conditions for overcoming obstacles, service-oriented work, and daily discipline.",
      7: "Favorable year-context for marriage partner harmony, joint ventures, and social contracts.",
      8: "Auspiciousness through research, inheritance, or inner psychological transformation.",
      9: "Higher wisdom, spiritual pilgrimages, favor from mentors, and alignment with dharma.",
      10: "Career advancements, public stature expansion, and recognition of professional actions.",
      11: "Fulfillment of desires, financial inflows, and expansion of supportive social networks.",
      12: "Inner spiritual retreat, charitable investments, and positive overseas connections."
    },
    overPromiseSample: "Since your Punya Saham is in the 10th house, you are guaranteed a major career promotion, massive raise, and absolute success in all business ventures this year.",
    compliantSample: "The Punya Saham in your 10th house indicates an auspicious ambient context for career and public actions. It provides favorable opportunity-conditions; however, concrete outcomes still depend on your practical work and overall chart convergence."
  },
  Vidya: {
    name: "Vidyā Saham",
    sanskrit: "विद्या सहम",
    dayFormula: "(Mercury − Sun + Lagna) mod 360°",
    nightFormula: "(Sun − Mercury + Lagna) mod 360°",
    domain: "Scholarly attainment, intellect development, exams, knowledge-acquisition, and educational pursuits.",
    crossCultural: "Hellenistic Lot of Learning / Arabic Lot of Knowledge",
    houseMeanings: {
      1: "Intellectual clarity and personal eagerness to learn new concepts or languages.",
      2: "Scholarly study focusing on finance, history, languages, or vocal presentation.",
      3: "Auspicious context for short courses, writing articles, and learning practical crafts.",
      4: "Comfortable academic environment, school admissions, and peaceful domestic studies.",
      5: "Deep scholarly research, creative intelligence, and success in exams or creative projects.",
      6: "Overcoming intellectual hurdles, technical problem solving, and analytical study routines.",
      7: "Collaborative studies, learning from partners, or public debates and lectures.",
      8: "Interest in occult science, deep research, secret files, and investigative scholarship.",
      9: "Higher university education, spiritual learning, philosophy, and learning from gurus.",
      10: "Applying knowledge to professional status, career-related training, and public teaching.",
      11: "Auspicious gains through scholarship, academic awards, and study groups.",
      12: "Quiet solitary study, foreign university admissions, and spiritual/metaphysical education."
    },
    overPromiseSample: "With Vidyā Saham in the 5th house, you will easily top your university class and pass your certification exams with zero effort.",
    compliantSample: "Vidyā Saham in the 5th house highlights a highly supportive intellectual context for studies and creative projects. It suggests a time ripe for learning; use this favorable atmosphere to apply focused effort to your exams."
  },
  Yashas: {
    name: "Yashas Saham",
    sanskrit: "यशस् सहम",
    dayFormula: "(Jupiter − Sun + Lagna) mod 360°",
    nightFormula: "(Sun − Jupiter + Lagna) mod 360°",
    domain: "Public reputation, social standing, fame, visibility, and recognition of actions.",
    crossCultural: "Hellenistic Lot of Honor / Arabic Lot of Reputation",
    houseMeanings: {
      1: "High visibility and personal magnetism; others recognize your character and leadership easily.",
      2: "Public recognition of speech, financial expertise, or family heritage.",
      3: "Fame through communication, publications, creative arts, or short travels.",
      4: "Respected standing within your local community, home base, or real estate sector.",
      5: "Public recognition for creative projects, educational success, or children's achievements.",
      6: "Reputation built on problem-solving, clinical service, or administrative competence.",
      7: "Public honors through business partnerships, marital connections, or public relations.",
      8: "Quiet respect earned through research, occult mastery, or crisis management.",
      9: "Recognition as a moral teacher, philosophical authority, or righteous mentor.",
      10: "Major professional accolades, public promotions, and social-standing advancement.",
      11: "Accolades within wide social networks, massive community respect, and gains from fame.",
      12: "Recognition in foreign domains, charitable leadership, or spiritual spheres."
    },
    overPromiseSample: "Yashas Saham in your 11th house means you will go viral on social media and achieve instant, guaranteed fame among thousands of followers.",
    compliantSample: "The Yashas Saham in your 11th house points to supportive conditions for visibility and social recognition. This is a favorable year-context to share your work with your community, though viral reach depends on multi-layered factors."
  }
};

const HOUSE_PATHS = {
  1: "M 100,0 L 50,50 L 100,100 L 150,50 Z",
  2: "M 0,0 L 100,0 L 50,50 Z",
  3: "M 0,0 L 0,100 L 50,50 Z",
  4: "M 0,100 L 50,50 L 100,100 L 50,150 Z",
  5: "M 0,200 L 0,100 L 50,150 Z",
  6: "M 0,200 L 100,200 L 50,150 Z",
  7: "M 100,200 L 50,150 L 100,100 L 150,150 Z",
  8: "M 200,200 L 100,200 L 150,150 Z",
  9: "M 200,200 L 200,100 L 150,150 Z",
  10: "M 200,100 L 150,50 L 100,100 L 150,150 Z",
  11: "M 200,0 L 200,100 L 150,50 Z",
  12: "M 200,0 L 100,0 L 150,50 Z"
};

const HOUSE_LABEL_POS = {
  1: { x: 100, y: 45 },
  2: { x: 50, y: 16 },
  3: { x: 16, y: 50 },
  4: { x: 45, y: 100 },
  5: { x: 16, y: 150 },
  6: { x: 50, y: 184 },
  7: { x: 100, y: 155 },
  8: { x: 150, y: 184 },
  9: { x: 184, y: 150 },
  10: { x: 155, y: 100 },
  11: { x: 184, y: 50 },
  12: { x: 150, y: 16 }
};

export function TajikaAuspiciousSahamsComparator() {
  const [activeTab, setActiveTab] = useState<"Punya" | "Vidya" | "Yashas">("Punya");
  const [selectedHouse, setSelectedHouse] = useState<number>(10);
  const [showCompliance, setShowCompliance] = useState<boolean>(true);

  const profile = SAHAM_PROFILES[activeTab];

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "rgba(255, 253, 246, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 10px 40px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-auspicious-sahams-comparator"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 3 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          Auspicious Sahams Comparator & House Scrubber
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Compare the three core auspiciousness sahams and practice the non-deterministic over-promise refutation across the twelve natal houses.
        </p>
      </div>

      {/* Tab Selectors (Expanded touch target heights to 44px) */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {(Object.keys(SAHAM_PROFILES) as Array<"Punya" | "Vidya" | "Yashas">).map((key) => {
          const isActive = key === activeTab;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                flex: 1,
                minWidth: "160px",
                height: "46px", // Exceeds 44px minimum touch target requirement
                borderRadius: "8px",
                background: isActive ? GOLD_DEEP : "#ffffff",
                color: isActive ? "#ffffff" : INK_SECONDARY,
                border: `1.5px solid ${isActive ? GOLD_DEEP : "rgba(156, 122, 47, 0.15)"}`,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "13.5px",
                transition: "all 150ms ease"
              }}
            >
              {SAHAM_PROFILES[key].name}
            </button>
          );
        })}
      </div>

      {/* Metadata Panel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "20px",
          alignItems: "center"
        }}
      >
        <div>
          <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: GOLD_DEEP }}>
            Astrological Focus:
          </span>
          <h4 style={{ fontSize: "18px", fontWeight: 800, color: INK_PRIMARY, margin: "4px 0 6px", fontFamily: "var(--font-cormorant), serif" }}>
            {profile.name}
          </h4>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5", margin: 0 }}>
            {profile.domain}
          </p>
          <div style={{ marginTop: "10px", fontSize: "11.5px", color: INK_MUTED }}>
            <strong>Cross-Cultural:</strong> {profile.crossCultural}
          </div>
        </div>

        <div style={{ borderLeft: "1px solid rgba(156, 122, 47, 0.15)", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", color: GOLD_DEEP }}>
            Mathematical Formulations:
          </span>
          <div>
            <div style={{ fontSize: "11px", color: INK_MUTED }}>Day-Birth:</div>
            <div style={{ fontFamily: "monospace", fontSize: "13px", color: GREEN, fontWeight: 700, marginTop: "2px" }}>
              {profile.dayFormula}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: INK_MUTED }}>Night-Birth:</div>
            <div style={{ fontFamily: "monospace", fontSize: "13px", color: RED, fontWeight: 700, marginTop: "2px" }}>
              {profile.nightFormula}
            </div>
          </div>
        </div>
      </div>

      {/* House Scrubber Panel & SVG North Indian Chart */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <span style={{ fontWeight: 800, color: GOLD_DEEP, fontSize: "14.5px", display: "flex", alignItems: "center", gap: "8px", fontFamily: "var(--font-cormorant), serif" }}>
            <Award size={18} color={GOLD} />
            Place {profile.name} in North Indian Diamond Chart:
          </span>
          <strong style={{ fontSize: "15px", color: GOLD_DEEP }}>
            House {selectedHouse} Delineation
          </strong>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "20px", alignItems: "center" }}>
          {/* SVG traditional North Indian Chart */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: LIGHT_BG, border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "12px" }}>
            <svg width="220" height="220" viewBox="0 0 200 200" aria-label="North Indian diamond chart highlighting selected house">
              {/* Outer boundary */}
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" />

              {/* Render 12 house polygons */}
              {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
                const isActive = h === selectedHouse;
                const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
                const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
                return (
                  <g key={h}>
                    <path
                      d={pathStr}
                      fill={isActive ? "rgba(156, 122, 47, 0.15)" : "none"}
                      stroke={isActive ? GOLD_DEEP : "rgba(156, 122, 47, 0.2)"}
                      strokeWidth={isActive ? "2.5" : "1"}
                      style={{ transition: "all 300ms ease" }}
                    />
                    {/* Render Saham short code in active house, otherwise render house number */}
                    {isActive ? (
                      <text
                        x={pos.x}
                        y={pos.y}
                        fill={RED}
                        fontSize="9.5"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {activeTab === "Punya" ? "Punya" : activeTab === "Vidya" ? "Vidyā" : "Yaśas"}
                      </text>
                    ) : (
                      <text
                        x={pos.x}
                        y={pos.y}
                        fill={INK_MUTED}
                        fontSize="8.5"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {h}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* House selector buttons & Interpretation */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
                const isSelected = h === selectedHouse;
                return (
                  <button
                    key={h}
                    onClick={() => setSelectedHouse(h)}
                    style={{
                      height: "44px", // Height meets 44px touch target guidelines
                      borderRadius: "6px",
                      background: isSelected ? GOLD : "rgba(156, 122, 47, 0.05)",
                      color: isSelected ? "#ffffff" : INK_SECONDARY,
                      border: `1.5px solid ${isSelected ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "12.5px",
                      transition: "all 150ms ease"
                    }}
                  >
                    H{h}
                  </button>
                );
              })}
            </div>

            <div style={{ background: "rgba(255, 253, 246, 0.6)", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "16px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "4px", textTransform: "uppercase" }}>
                Interpretation (Relative to Natal Lagna):
              </span>
              <p style={{ fontSize: "13.5px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
                {profile.houseMeanings[selectedHouse]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Counseling Refutation Drill */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "8px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color={GOLD} />
            <div>
              <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14.5px" }}>Over-Promise Refutation Drill</span>
              <p style={{ fontSize: "11.5px", color: INK_MUTED, margin: 0 }}>
                Compare faulty deterministic predictions with correct Vedic discipline.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCompliance(prev => !prev)}
            style={{
              backgroundColor: showCompliance ? GREEN : RED,
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "11.5px",
              textTransform: "uppercase",
              transition: "all 150ms ease"
            }}
          >
            {showCompliance ? "Show Faulty Reading" : "Show Compliant Reading"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Faulty display */}
          <div
            style={{
              border: `1.5px solid ${!showCompliance ? RED : "rgba(156, 122, 47, 0.15)"}`,
              borderRadius: "8px",
              padding: "14px",
              background: !showCompliance ? "rgba(162, 58, 30, 0.03)" : "transparent",
              transition: "all 200ms ease",
              opacity: showCompliance ? 0.6 : 1
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: RED }}>
              <ShieldAlert size={14} />
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                Faulty Over-Promise Reading
              </span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "6px 0 0" }}>
              "{profile.overPromiseSample}"
            </p>
            <div style={{ fontSize: "11px", color: INK_MUTED, marginTop: "10px", borderTop: "1px solid rgba(156, 122, 47, 0.08)", paddingTop: "6px" }}>
              *Violates discipline by treating sensitive points as absolute guarantees.
            </div>
          </div>

          {/* Compliant display */}
          <div
            style={{
              border: `1.5px solid ${showCompliance ? GREEN : "rgba(156, 122, 47, 0.15)"}`,
              borderRadius: "8px",
              padding: "14px",
              background: showCompliance ? "rgba(47, 125, 85, 0.03)" : "transparent",
              transition: "all 200ms ease",
              opacity: !showCompliance ? 0.6 : 1
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px", color: GREEN }}>
              <CheckCircle2 size={14} />
              <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                Discipline-Compliant Reading
              </span>
            </div>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "6px 0 0" }}>
              "{profile.compliantSample}"
            </p>
            <div style={{ fontSize: "11px", color: INK_MUTED, marginTop: "10px", borderTop: "1px solid rgba(156, 122, 47, 0.08)", paddingTop: "6px" }}>
              *Preserves legitimacy of year-context while protecting client proactive agency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
