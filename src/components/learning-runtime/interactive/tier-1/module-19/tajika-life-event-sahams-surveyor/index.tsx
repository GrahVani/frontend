"use client";

import { useState } from "react";
import { Info, HelpCircle, Activity, HeartPulse, UserCheck, ShieldAlert, Sparkles, Filter } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";
const LIGHT_BG = "#FCFAF2";

interface SahamItem {
  name: string;
  sanskrit: string;
  category: string;
  meaning: string;
  crossCultural: string;
}

const SAHAMS_LIST: SahamItem[] = [
  // Relationship
  { name: "Vivāha Saham", sanskrit: "विवाह सहम", category: "Relationship", meaning: "Marriage timing, spousal harmony, and matrimonial-context for the year.", crossCultural: "Hellenistic Lot of Marriage" },
  { name: "Putra Saham", sanskrit: "पुत्र सहम", category: "Relationship", meaning: "Children prospects, childbearing-themes, and parent-child relations.", crossCultural: "Hellenistic Lot of Children" },
  { name: "Mātṛ Saham", sanskrit: "मातृ सहम", category: "Relationship", meaning: "Mother-relations, maternal health, and maternal family context.", crossCultural: "Hellenistic Lot of Mother" },
  { name: "Pitṛ Saham", sanskrit: "पितृ सहम", category: "Relationship", meaning: "Father-relations, authority figure guidance, and paternal family themes.", crossCultural: "Hellenistic Lot of Father" },
  { name: "Mitra Saham", sanskrit: "मित्र सहम", category: "Relationship", meaning: "Friendships, social circles, collaborations, and partnerships.", crossCultural: "Hellenistic Lot of Friends" },

  // Career
  { name: "Karma Saham", sanskrit: "कर्म सहम", category: "Career", meaning: "Career actions, work status, and vocational focus for the year.", crossCultural: "Hellenistic Lot of Work" },
  { name: "Rāja Saham", sanskrit: "राज सहम", category: "Career", meaning: "Stature, authority, power, promotions, and recognition from superiors.", crossCultural: "Hellenistic Lot of Stature" },
  { name: "Vyāpāra Saham", sanskrit: "व्यापार सहम", category: "Career", meaning: "Business, commerce, entrepreneurial ventures, and trade-deals.", crossCultural: "Hellenistic Lot of Commerce" },
  { name: "Vāhana Saham", sanskrit: "वाहन सहम", category: "Career", meaning: "Vehicles, assets, mobility resources, and transportation themes.", crossCultural: "Hellenistic Lot of Assets" },

  // Wealth
  { name: "Dhana Saham", sanskrit: "धन सहम", category: "Wealth", meaning: "Wealth accumulation, financial assets, savings, and resources.", crossCultural: "Hellenistic Lot of Substance" },
  { name: "Lābha Saham", sanskrit: "लाभ सहम", category: "Wealth", meaning: "Gains, revenues, returns on investments, and general benefits.", crossCultural: "Hellenistic Lot of Gain" },
  { name: "Vyaya Saham", sanskrit: "व्यय सहम", category: "Wealth", meaning: "Expenses, investments, monetary outflows, and charity contexts.", crossCultural: "Hellenistic Lot of Loss" },

  // Health
  { name: "Jīvana Saham", sanskrit: "जीवन सहम", category: "Health", meaning: "Vitality, life force, overall health index, and daily energy levels.", crossCultural: "Hellenistic Lot of Life" },
  { name: "Mṛtyu Saham", sanskrit: "मृत्यु सहम", category: "Health", meaning: "Mortality considerations, health awareness, and life-fragility themes (NOT death-prediction).", crossCultural: "Hellenistic Lot of Death" },
  { name: "Ayur Saham", sanskrit: "आयुस् सहम", category: "Health", meaning: "Longevity themes, long-term health, and physical stamina.", crossCultural: "Hellenistic Lot of Longevity" },

  // Specialized
  { name: "Dharma Saham", sanskrit: "धर्म सहम", category: "Spirituality", meaning: "Ethical duty, religious practices, and alignment with righteous paths.", crossCultural: "Hellenistic Lot of Religion" },
  { name: "Tapasvī Saham", sanskrit: "तपस्विन् सहम", category: "Spirituality", meaning: "Spiritual discipline, austerities, meditation, and detached action.", crossCultural: "Hellenistic Lot of Asceticism" },
  { name: "Tīrtha Saham", sanskrit: "तीर्थ सहम", category: "Spirituality", meaning: "Spiritual pilgrimages, travels to sacred places, and inner journeys.", crossCultural: "Hellenistic Lot of Pilgrimages" },

  // Specialized II
  { name: "Vāda Saham", sanskrit: "वाद सहम", category: "Specialized", meaning: "Debates, intellectual arguments, logic engagement, and verbal challenges.", crossCultural: "Hellenistic Lot of Dispute" },
  { name: "Vairāgya Saham", sanskrit: "वैराग्य सहम", category: "Specialized", meaning: "Renunciation, detachment, letting go of attachments, and monastic themes.", crossCultural: "Hellenistic Lot of Renunciation" },
  { name: "Roga Saham", sanskrit: "रोग सहम", category: "Specialized", meaning: "Illness-context, health vulnerability, and physical ailments (NOT illness prediction).", crossCultural: "Hellenistic Lot of Sickness" }
];

interface ClusterDefinition {
  domain: string;
  sahams: { name: string; house: number; code: string }[];
  warning: string;
  m19Focus: string;
}

const CLUSTERS: Record<"Relationship" | "Career" | "Wealth" | "Health", ClusterDefinition> = {
  Relationship: {
    domain: "Relationship-Domain Cluster",
    sahams: [
      { name: "Vivāha Saham", house: 7, code: "Vivāha" },
      { name: "Putra Saham", house: 5, code: "Putra" },
      { name: "Mitra Saham", house: 11, code: "Mitra" }
    ],
    warning: "High emotional charge regarding marriage prospects or childbearing. Refuse deterministic 'no-children' or 'guaranteed-marriage' predictions.",
    m19Focus: "Focus on opportunity-conditions. Check Venus-Saturn aspects and check if the return chart Lagna aspects these points before giving counsel."
  },
  Career: {
    domain: "Career & Action Cluster",
    sahams: [
      { name: "Karma Saham", house: 10, code: "Karma" },
      { name: "Rāja Saham", house: 1, code: "Rāja" },
      { name: "Vyāpāra Saham", house: 7, code: "Vyāpāra" }
    ],
    warning: "Risk of taking extreme steps (like quitting a job) based on a single saham placement.",
    m19Focus: "Apply convergent-independent-grounds. Cross-check against the 10th lord and yearly Munthā house placement before validating a career move."
  },
  Wealth: {
    domain: "Wealth & Material Cluster",
    sahams: [
      { name: "Dhana Saham", house: 2, code: "Dhana" },
      { name: "Lābha Saham", house: 11, code: "Lābha" },
      { name: "Vyaya Saham", house: 12, code: "Vyaya" }
    ],
    warning: "Learners often treat Dhana/Lābha as absolute guarantees of wealth increase, or Vyaya as financial ruin.",
    m19Focus: "Frame Dhana and Vyaya as contrasting flows of financial attention. Wealth is a multifactorial condition, not a single sensitive-point outcome."
  },
  Health: {
    domain: "Health & Longevity Cluster",
    sahams: [
      { name: "Jīvana Saham", house: 1, code: "Jīvana" },
      { name: "Mṛtyu Saham", house: 8, code: "Mṛtyu" },
      { name: "Ayur Saham", house: 3, code: "Ayur" },
      { name: "Roga Saham", house: 6, code: "Roga" }
    ],
    warning: "Highest fear-induction risk in astrology. Visualizing Mṛtyu or Roga in a bad house often causes client panic.",
    m19Focus: "CRITICAL M19 RULE: Mṛtyu and Roga represent health-awareness and preventive indicators, NOT death or sickness predictions. Refuse fatalism completely."
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

const HOUSE_SIGN_NAMES = {
  1: "Aries (Meṣa)",
  2: "Taurus (Vṛṣabha)",
  3: "Gemini (Mithuna)",
  4: "Cancer (Karka)",
  5: "Leo (Siṁha)",
  6: "Virgo (Kanyā)",
  7: "Libra (Tulā)",
  8: "Scorpio (Vṛścika)",
  9: "Sagittarius (Dhanu)",
  10: "Capricorn (Makara)",
  11: "Aquarius (Kumbha)",
  12: "Pisces (Mīna)"
};

export function TajikaLifeEventSahamsSurveyor() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeCluster, setActiveCluster] = useState<"Relationship" | "Career" | "Wealth" | "Health">("Health");
  const [dojoFeedback, setDojoFeedback] = useState<string | null>(null);
  const [dojoCorrect, setDojoCorrect] = useState<boolean>(false);

  const filteredSahams = activeCategory === "All"
    ? SAHAMS_LIST
    : SAHAMS_LIST.filter(s => s.category === activeCategory);

  const activeClusterData = CLUSTERS[activeCluster];

  const handleDojoAnswer = (index: number) => {
    if (index === 0) {
      setDojoFeedback("Correct! You acknowledge the client's panic, explain that Mṛtyu means 'mortality-awareness / life-fragility' rather than a physical death trigger, and encourage preventive check-ups while completely refuting the prior fatalistic reading. This complies fully with the M19 framework.");
      setDojoCorrect(true);
    } else {
      setDojoFeedback("Incorrect. This response either confirms the fatalistic prediction or uses evasive language that fails to defuse the fear. In Vedic astrology counseling, you must actively refuse fear-induction and clarify that computed lots represent opportunities for awareness, not physical death triggers.");
      setDojoCorrect(false);
    }
  };

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
      data-interactive="tajika-life-event-sahams-surveyor"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 3 — Lesson 3
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          47 Life-Event Sahams Surveyor & Cluster Dojo
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Survey the remaining 47 sahams and practice multi-saham cluster analysis and defearmongering.
        </p>
      </div>

      {/* Part 1: Category Filtering */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Filter size={16} color={GOLD} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
            Survey the 47 Sahams:
          </span>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["All", "Relationship", "Career", "Wealth", "Health", "Spirituality", "Specialized"].map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  background: isActive ? GOLD : "#ffffff",
                  color: isActive ? "#ffffff" : INK_SECONDARY,
                  border: `1.5px solid ${isActive ? GOLD : "rgba(156, 122, 47, 0.2)"}`,
                  fontWeight: 750,
                  fontSize: "12.5px",
                  cursor: "pointer",
                  transition: "all 150ms ease"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Expanded Scrollable Saham Cards container */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
            maxHeight: "300px", // Expanded height to improve readability
            overflowY: "auto",
            padding: "8px",
            border: "1px solid rgba(156, 122, 47, 0.15)",
            borderRadius: "8px",
            background: "#ffffff"
          }}
        >
          {filteredSahams.map((s, idx) => (
            <div
              key={idx}
              style={{
                background: "rgba(255, 253, 246, 0.4)",
                border: "1px solid rgba(156, 122, 47, 0.12)",
                borderRadius: "8px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "4px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "6px" }}>
                <strong style={{ fontSize: "14.5px", color: GOLD_DEEP, fontFamily: "var(--font-cormorant), serif" }}>{s.name}</strong>
                <span style={{ fontSize: "9.5px", color: INK_MUTED, backgroundColor: "rgba(156, 122, 47, 0.08)", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                  {s.category}
                </span>
              </div>
              <span style={{ fontSize: "11px", color: INK_MUTED, fontFamily: "monospace" }}>{s.sanskrit}</span>
              <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "6px 0 0", lineHeight: "1.45" }}>
                {s.meaning}
              </p>
              <div style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic", marginTop: "6px", borderTop: "1px dashed rgba(156, 122, 47, 0.08)", paddingTop: "4px" }}>
                Greek/Arab counterpart: {s.crossCultural}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 2: Multi-Saham Cluster Analyzer & SVG South Indian Chart */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={18} color={GOLD} />
          <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14.5px" }}>
            Multi-Saham Cluster Analyzer & Vedic Map
          </span>
        </div>

        {/* Cluster buttons selection with active outline/focus rings */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {(Object.keys(CLUSTERS) as Array<"Relationship" | "Career" | "Wealth" | "Health">).map((key) => {
            const isActive = key === activeCluster;
            return (
              <button
                key={key}
                onClick={() => {
                  setActiveCluster(key);
                  setDojoFeedback(null);
                }}
                style={{
                  flex: 1,
                  minWidth: "130px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: isActive ? GOLD_DEEP : "rgba(156, 122, 47, 0.05)",
                  color: isActive ? "#ffffff" : INK_SECONDARY,
                  border: `1.5px solid ${isActive ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                  outline: isActive ? `2px solid ${GOLD}` : "none", // Visible outline indicator
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "13px",
                  transition: "all 150ms ease"
                }}
              >
                {key} Cluster
              </button>
            );
          })}
        </div>

        {/* Dynamic Vedic SVG Chart and details */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "20px", alignItems: "center" }}>
          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <strong style={{ fontSize: "13.5px", color: GOLD_DEEP, display: "block", marginBottom: "6px" }}>
                Active Cluster Sahams & Houses:
              </strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {activeClusterData.sahams.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: GOLD_DEEP,
                      background: "rgba(156, 122, 47, 0.08)",
                      border: "1px solid rgba(156, 122, 47, 0.15)",
                      padding: "6px 10px",
                      borderRadius: "6px"
                    }}
                  >
                    {s.name} (H{s.house})
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: RED, textTransform: "uppercase", display: "block" }}>
                Over-claim/Fear Risks:
              </span>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.45" }}>
                {activeClusterData.warning}
              </p>
            </div>

            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: GREEN, textTransform: "uppercase", display: "block" }}>
                M19 Integration Focus:
              </span>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.45" }}>
                {activeClusterData.m19Focus}
              </p>
            </div>
          </div>

          {/* North Indian Chart Drawing */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", background: LIGHT_BG, border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "8px", padding: "12px" }}>
            <svg width="220" height="220" viewBox="0 0 200 200" aria-label="Zodiac map showing houses for active cluster sahams">
              {/* Outer boundary */}
              <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" />

              {/* Render 12 house polygons */}
              {([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const).map((h) => {
                const clusterSaham = activeClusterData.sahams.find(s => s.house === h);
                const isConcerned = clusterSaham && (h === 8 || h === 6);
                const pathStr = HOUSE_PATHS[h];
                const pos = HOUSE_LABEL_POS[h];
                return (
                  <g key={h}>
                    <path
                      d={pathStr}
                      fill={clusterSaham ? (isConcerned ? "rgba(162, 58, 30, 0.12)" : "rgba(47, 125, 85, 0.12)") : "none"}
                      stroke={clusterSaham ? (isConcerned ? RED : GREEN) : "rgba(156, 122, 47, 0.2)"}
                      strokeWidth={clusterSaham ? "3" : "1"} // Strengthened border for outline visibility
                      style={{ transition: "all 300ms ease" }}
                    />
                    
                    {/* Render active Saham code or sign names */}
                    {clusterSaham ? (
                      <>
                        <text
                          x={pos.x}
                          y={pos.y - 7}
                          fill={GOLD_DEEP}
                          fontSize="9"
                          fontWeight="800"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          H{h}
                        </text>
                        <text
                          x={pos.x}
                          y={pos.y + 7}
                          fill={isConcerned ? RED : GREEN}
                          fontSize="7.5"
                          fontWeight="800"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {clusterSaham.code}
                        </text>
                      </>
                    ) : (
                      <>
                        <text
                          x={pos.x}
                          y={pos.y - 4}
                          fill={INK_MUTED}
                          fontSize="7"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          H{h}
                        </text>
                        <text
                          x={pos.x}
                          y={pos.y + 6}
                          fill={INK_MUTED}
                          fontSize="6.5"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {HOUSE_SIGN_NAMES[h].split(" ")[0]}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Part 3: Defearmongering Dojo */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <HeartPulse size={18} color={RED} />
          <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14.5px" }}>Defearmongering Simulator (Mṛtyu Saham)</span>
        </div>

        <div style={{ background: "rgba(162, 58, 30, 0.03)", border: "1px solid rgba(162, 58, 30, 0.15)", borderRadius: "6px", padding: "14px" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", color: RED }}>
            <ShieldAlert size={16} />
            <strong>Client Scenario:</strong>
          </div>
          <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "6px 0 0", fontStyle: "italic", lineHeight: "1.5" }}>
            "An online astrologer computed my Varṣaphala return chart and said my Mṛtyu Saham falls in the 8th house, and Mars is conjunct my Roga Saham. They told me I am going to die or suffer a terrible sickness this year. Should I prepare for death?"
          </p>
        </div>

        {/* Responses options with explicit click target indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => handleDojoAnswer(0)}
            style={{
              padding: "14px",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1.5px solid rgba(156, 122, 47, 0.15)",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "13px",
              color: INK_PRIMARY,
              transition: "all 150ms ease",
              lineHeight: "1.45"
            }}
          >
            <strong>A. Compliant Reframing:</strong> Acknowledge their fear, point out that computed sensitive lots in Tājika represent opportunity-contexts and health-awareness markers rather than physical death triggers, and suggest standard wellness behaviors and doctor check-ups while rejecting the fatalistic reading entirely.
          </button>
          <button
            onClick={() => handleDojoAnswer(1)}
            style={{
              padding: "14px",
              borderRadius: "8px",
              background: "#ffffff",
              border: "1.5px solid rgba(156, 122, 47, 0.15)",
              textAlign: "left",
              cursor: "pointer",
              fontSize: "13px",
              color: INK_PRIMARY,
              transition: "all 150ms ease",
              lineHeight: "1.45"
            }}
          >
            <strong>B. Confirming / Softening:</strong> Tell the client that while the 8th house Mṛtyu Saham is indeed alarming and could represent danger, they can perform planetary donations and mantras to try and ward off the death prediction.
          </button>
        </div>

        {/* Feedback display */}
        {dojoFeedback && (
          <div
            style={{
              borderLeft: `4px solid ${dojoCorrect ? GREEN : RED}`,
              background: dojoCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)",
              padding: "14px",
              borderRadius: "0 6px 6px 0",
              marginTop: "4px",
              transition: "all 200ms ease"
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: dojoCorrect ? GREEN : RED, display: "block", marginBottom: "4px" }}>
              {dojoCorrect ? "Discipline Check Approved" : "Discipline Warning"}
            </span>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
              {dojoFeedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
