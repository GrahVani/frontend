"use client";

import { useState } from "react";
import {
  Info,
  Layers,
  CheckCircle2,
  ShieldAlert,
  Compass,
  Settings,
  AlertTriangle,
  Sparkles,
  Activity
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const RASHI_NAMES = [
  "Aries (Meṣa)", "Taurus (Vṛṣabha)", "Gemini (Mithuna)", "Cancer (Karka)",
  "Leo (Siṁha)", "Virgo (Kanyā)", "Libra (Tulā)", "Scorpio (Vṛścika)",
  "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Mīna)"
];

const HOUSE_PATHS_SMALL = {
  1: "M 65,0 L 32.5,32.5 L 65,65 L 97.5,32.5 Z",
  2: "M 0,0 L 65,0 L 32.5,32.5 Z",
  3: "M 0,0 L 0,65 L 32.5,32.5 Z",
  4: "M 0,65 L 32.5,32.5 L 65,65 L 32.5,97.5 Z",
  5: "M 0,130 L 0,65 L 32.5,97.5 Z",
  6: "M 0,130 L 65,130 L 32.5,97.5 Z",
  7: "M 65,130 L 32.5,97.5 L 65,65 L 97.5,97.5 Z",
  8: "M 130,130 L 65,130 L 97.5,97.5 Z",
  9: "M 130,130 L 130,65 L 97.5,97.5 Z",
  10: "M 130,65 L 97.5,32.5 L 65,65 L 97.5,97.5 Z",
  11: "M 130,0 L 130,65 L 97.5,32.5 Z",
  12: "M 130,0 L 65,0 L 97.5,32.5 Z"
};

const HOUSE_LABEL_POS_SMALL = {
  1: { x: 65, y: 30 },
  2: { x: 32.5, y: 15 },
  3: { x: 15, y: 32.5 },
  4: { x: 30, y: 65 },
  5: { x: 15, y: 97.5 },
  6: { x: 32.5, y: 115 },
  7: { x: 65, y: 100 },
  8: { x: 97.5, y: 115 },
  9: { x: 115, y: 97.5 },
  10: { x: 100, y: 65 },
  11: { x: 115, y: 32.5 },
  12: { x: 97.5, y: 15 }
};

interface StreamInfo {
  name: string;
  toolset: string;
  rating: number;
  description: string;
}

interface QueryPreset {
  id: string;
  title: string;
  question: string;
  streams: Record<string, StreamInfo>;
}

const QUERY_PRESETS: QueryPreset[] = [
  {
    id: "lifetime",
    title: "Lifetime Potential",
    question: "What is my constitutional baseline for wealth and career achievement throughout my life?",
    streams: {
      parashari: {
        name: "Parāśarī",
        toolset: "Lagna, 2H/10H/11H Lords, Mahādaśā",
        rating: 10,
        description: "Standard foundational model designed for lifetime promise, strength baselines, and broad life-period timing."
      },
      jaimini: {
        name: "Jaimini",
        toolset: "Ātmakāraka, Ārūḍha Pāda, Chara Daśā",
        rating: 8,
        description: "Excellent alternative baseline looking at status shifts and perception vs reality."
      },
      tajika: {
        name: "Tājika",
        toolset: "Varṣaphala, Sahams, 16 Yogas",
        rating: 2,
        description: "Weak. Tājika tools are strictly designed for year-specific solar return calculations and horary kṣaṇa, not lifetime propensities."
      },
      kp: {
        name: "KP System",
        toolset: "Sub-lords, Cuspal significators",
        rating: 6,
        description: "Useful for specific events in life, but less suited for holistic lifetime potential mapping than classical Parāśarī."
      },
      lalkitab: {
        name: "Lal Kitab",
        toolset: "House-based rules, 108 Upāyas",
        rating: 5,
        description: "Focuses on folk diagnostics and remedial stabilization rather than classical promise calculations."
      }
    }
  },
  {
    id: "precise-horary",
    title: "Precise Horary Timing",
    question: "Will my visa application be approved by this Friday at noon?",
    streams: {
      parashari: {
        name: "Parāśarī",
        toolset: "Pratyantardaśā, Gochara transits",
        rating: 4,
        description: "Lacks the fine-grained horary resolution required for hourly/daily query moment questions."
      },
      jaimini: {
        name: "Jaimini",
        toolset: "Chara Daśā sub-periods",
        rating: 3,
        description: "Not traditionally built for micro-timing of sudden daily horary questions."
      },
      tajika: {
        name: "Tājika",
        toolset: "Tājika Praśna (Ithaśāla, Sahams)",
        rating: 8.5,
        description: "Strong. Dynamic aspectual applying/separating formulas directly address yes/no horary outcomes."
      },
      kp: {
        name: "KP System",
        toolset: "Cuspal Sub-lord, Ruling Planets",
        rating: 10,
        description: "Highest precision. Systematized sub-lord mathematics are optimized specifically for precise YES/NO horary and micro-timing."
      },
      lalkitab: {
        name: "Lal Kitab",
        toolset: "Metaphorical diagnostics",
        rating: 2,
        description: "Not designed for precise timing or technical horary questions."
      }
    }
  },
  {
    id: "yearly",
    title: "Yearly Solar Return",
    question: "What are the primary developmental themes and challenges I will face between my 35th and 36th birthdays?",
    streams: {
      parashari: {
        name: "Parāśarī",
        toolset: "Vimśottarī Antardaśā, Transits",
        rating: 7.5,
        description: "Provides lifetime context periods, but lacks dedicated solar-return-moment mathematics."
      },
      jaimini: {
        name: "Jaimini",
        toolset: "Chara Daśā annual slices",
        rating: 6,
        description: "Provides broad periodic shifts, but does not construct a separate solar-return chart."
      },
      tajika: {
        name: "Tājika",
        toolset: "Varṣaphala (Munthā, Varṣeśa, Sahams)",
        rating: 10,
        description: "Ultimate fit. Varṣaphala is the canonical annual solar-return system, utilizing specialized yearly-lord and saham methods."
      },
      kp: {
        name: "KP System",
        toolset: "Cuspal transits and sub-periods",
        rating: 5,
        description: "Capable of analyzing transit events but lacks annual solar return specialized features."
      },
      lalkitab: {
        name: "Lal Kitab",
        toolset: "Lal Kitab Varṣphala, Fixed Aries Teva",
        rating: 7,
        description: "Has a dedicated folk annual chart (Varṣphala), but focuses on annual remedies rather than classical dynamics."
      }
    }
  }
];

interface DojoQuestion {
  id: number;
  scenario: string;
  query: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

const DOJO_QUESTIONS: DojoQuestion[] = [
  {
    id: 1,
    scenario: "A client consults you regarding career progression. Their Parāśarī natal chart shows a severely afflicted 10th lord (indicating major lifetime career blocks), but their current Tājika Varṣaphala shows a highly auspicious Karma Saham with an applying Ithaśāla yoga between the Lagna Lord and Varṣeśa.",
    query: "How do you reconcile this divergence in your advice?",
    options: [
      {
        text: "Tell the client that Tājika Varṣaphala completely overrides the natal chart for this year, guaranteeing massive permanent promotion.",
        isCorrect: false,
        feedback: "Incorrect. The yearly activation operates strictly within the baseline natal promise. Varṣaphala cannot deliver outcomes that the lifetime natal baseline blocks."
      },
      {
        text: "Counsel the client that the yearly chart activates a favorable window of opportunity (promoting temporary career stability or small wins), but emphasize that it operates within the constraints of the weak natal baseline. Advise realistic, sustainable growth rather than high-risk career leaps.",
        isCorrect: true,
        feedback: "Correct! This honors both streams responsibly without conflating them, framing the yearly indicators as active opportunities within a realistic lifetime baseline."
      },
      {
        text: "Average the scores of both charts to declare a completely neutral year where nothing will happen.",
        isCorrect: false,
        feedback: "Incorrect. Averaging or blending rules from different streams is cross-stream conflation, which violates methodology boundaries."
      }
    ]
  },
  {
    id: 2,
    scenario: "You consult a client who asks a high-stakes question: 'Will my business partner buy out my shares this month?' You cast a KP Horary chart and see a clear 'NO' (cuspal sub-lord denies). You also cast a Tājika Praśna chart which shows a clear 'YES' (applying Ithaśāla between 1st and 7th lords).",
    query: "How do you handle this divergence in your final verdict?",
    options: [
      {
        text: "Conflate the calculations: evaluate the KP cuspal sub-lord's strength by using the Tājika aspect orb rules.",
        isCorrect: false,
        feedback: "Incorrect. This is cross-stream conflation and invalidates the mathematical foundation of both systems."
      },
      {
        text: "Discard the Tājika result entirely because KP is a modern, systematized, and superior system.",
        isCorrect: false,
        feedback: "Incorrect. This violates the multi-streams-valid discipline. Both are legitimate canonical systems with distinct epistemic profiles."
      },
      {
        text: "Operate both systems independently. Present the divergence to the client honestly: KP indicators suggest structural denial of the buyout, while Tājika indicates active momentum at the query moment. Advise them to proceed with caution due to conflicting analytical indicators.",
        isCorrect: true,
        feedback: "Correct! This maintains clear boundary lines, runs the systems independently, and reports divergence with appropriate uncertainty expression."
      }
    ]
  }
];

export function TajikaCrossStreamSynthesis() {
  const [activeTab, setActiveTab] = useState<"selector" | "builder" | "dojo">("selector");
  
  // Tab 1 States
  const [selectedPresetId, setSelectedPresetId] = useState<string>("lifetime");
  
  // Tab 2 States
  const [natalPromise, setNatalPromise] = useState<"weak" | "moderate" | "strong">("moderate");
  const [yearActivation, setYearActivation] = useState<"challenging" | "neutral" | "favourable">("neutral");

  // Tab 3 States
  const [currentDojoIdx, setCurrentDojoIdx] = useState<number>(0);
  const [selectedDojoOpt, setSelectedDojoOpt] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  const activePreset = QUERY_PRESETS.find(p => p.id === selectedPresetId) || QUERY_PRESETS[0];
  const currentDojo = DOJO_QUESTIONS[currentDojoIdx];

  // Integration logic details
  const getIntegrationVerdict = () => {
    if (natalPromise === "weak" && yearActivation === "challenging") {
      return {
        verdict: "Challenging Baseline with Obstacles",
        color: RED,
        text: "Both the lifetime baseline and yearly return indicate structural blockages. Prioritize stability, patience, and realistic adjustments over expansion."
      };
    }
    if (natalPromise === "weak" && yearActivation === "neutral") {
      return {
        verdict: "Constrained Baseline (Slow/Neutral Year)",
        color: AMBER,
        text: "Natal baseline limits progress, and yearly energy is slow. Expect routine maintenance. Focus on refining current affairs."
      };
    }
    if (natalPromise === "weak" && yearActivation === "favourable") {
      return {
        verdict: "Qualified Yearly Opportunity",
        color: AMBER,
        text: "The year activates supportive opportunities (e.g. Varṣeśa strength, active Sahams), but outcomes operate within a limited natal baseline. Expect temporary relief or small wins; avoid massive lifetime career/financial commitments."
      };
    }
    if (natalPromise === "moderate" && yearActivation === "challenging") {
      return {
        verdict: "Testing Period within Stable Baseline",
        color: AMBER,
        text: "Average natal baseline undergoing temporary yearly tests. Manage year-specific stress points consciously, knowing the baseline baseline is secure."
      };
    }
    if (natalPromise === "moderate" && yearActivation === "neutral") {
      return {
        verdict: "Stable Routine & Steady Development",
        color: INK_SECONDARY,
        text: "Moderate baseline matching steady, neutral yearly activity. Solid period for steady work, training, and standard progression."
      };
    }
    if (natalPromise === "moderate" && yearActivation === "favourable") {
      return {
        verdict: "Favourable Activation window",
        color: GREEN,
        text: "Solid baseline energized by a positive yearly solar return. Good period to initiate new plans, seek advancement, and trust active momentum."
      };
    }
    if (natalPromise === "strong" && yearActivation === "challenging") {
      return {
        verdict: "Temporary Obstruction (Strong Baseline)",
        color: AMBER,
        text: "A strong natal potential experiences a temporary yearly speed bump (obstructed Sahams or Varṣeśa stress). Baseline potential ensures resilience. Focus on patience and steady resolve."
      };
    }
    if (natalPromise === "strong" && yearActivation === "neutral") {
      return {
        verdict: "Latent Potential (Steady Preparation)",
        color: GREEN,
        text: "Strong baseline with neutral year activation. Good time to build assets, lay groundwork, and prepare for high-momentum cycles."
      };
    }
    return {
      verdict: "High-Momentum Alignment (Breakthrough)",
      color: GREEN,
      text: "Symmetric synchronization. Strong natal promise is directly activated by highly supportive yearly indicators. Take proactive, high-confidence steps."
    };
  };

  const integrationResult = getIntegrationVerdict();

  const handleDojoOptionSelect = (idx: number) => {
    setSelectedDojoOpt(idx);
    setDojoFeedback(currentDojo.options[idx].feedback);
  };

  const handleNextDojo = () => {
    setCurrentDojoIdx(prev => (prev + 1) % DOJO_QUESTIONS.length);
    setSelectedDojoOpt(null);
    setDojoFeedback("");
  };

  // Conduit SVG variables
  const energyColor = yearActivation === "challenging" ? RED : yearActivation === "neutral" ? AMBER : GOLD;
  const gateDoorHeight = natalPromise === "weak" ? 40 : natalPromise === "moderate" ? 25 : 5;
  const outputThickness = natalPromise === "weak" ? 3 : natalPromise === "moderate" ? 7 : 14;

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.75)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-cross-stream-synthesis"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 6 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Tājika Cross-Stream Synthesis Simulator
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Explore stream fitness, build integrated Natal × Yearly forecasts, and practice client reconciliation drills.
        </p>
      </div>

      {/* Tab Swticher */}
      <div style={{ display: "flex", gap: "8px", borderBottom: "1.5px solid rgba(156,122,47,0.1)" }}>
        {[
          { id: "selector", label: "Five-Stream Selector", icon: Compass },
          { id: "builder", label: "Parāśarī × Tājika Builder", icon: Sparkles },
          { id: "dojo", label: "Reconciliation Dojo", icon: Layers }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "selector" | "builder" | "dojo")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                border: "none",
                background: isActive ? "rgba(156, 122, 47, 0.08)" : "none",
                borderBottom: isActive ? `3.5px solid ${GOLD}` : "3.5px solid transparent",
                color: isActive ? GOLD_DEEP : INK_SECONDARY,
                cursor: "pointer",
                fontSize: "13.5px",
                fontWeight: isActive ? 700 : 500,
                borderRadius: "6px 6px 0 0",
                transition: "all 200ms ease"
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Five-Stream Selector */}
      {activeTab === "selector" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Preset Buttons */}
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
              Select astrological question type:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {QUERY_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPresetId(preset.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: `1.5px solid ${selectedPresetId === preset.id ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                    background: selectedPresetId === preset.id ? "rgba(156, 122, 47, 0.05)" : "#ffffff",
                    color: selectedPresetId === preset.id ? GOLD_DEEP : INK_SECONDARY,
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "bold",
                    flex: 1,
                    transition: "all 150ms ease"
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Question Quote */}
          <div style={{ background: "rgba(156, 122, 47, 0.03)", borderLeft: `4.5px solid ${GOLD}`, borderRadius: "0 8px 8px 0", padding: "12px 16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "4px" }}>
              Sample Client Question:
            </span>
            <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic", color: INK_PRIMARY }}>
              "{activePreset.question}"
            </p>
          </div>

          {/* Stream Ratings Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
              Cross-Stream Fitness Matrix:
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {Object.entries(activePreset.streams).map(([key, info]) => {
                const barColor = info.rating >= 8 ? GREEN : info.rating >= 6 ? AMBER : RED;
                return (
                  <div
                    key={key}
                    style={{
                      background: "#ffffff",
                      border: "1px solid rgba(156, 122, 47, 0.12)",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1.5fr 2fr",
                      alignItems: "center",
                      gap: "16px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                    }}
                  >
                    <div>
                      <span style={{ fontSize: "14.5px", fontWeight: 700, color: INK_PRIMARY }}>{info.name}</span>
                      <span style={{ display: "block", fontSize: "10.5px", color: INK_MUTED, marginTop: "2px" }}>
                        Tool: {info.toolset}
                      </span>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", marginBottom: "4px" }}>
                        <span>Fit Score:</span>
                        <span style={{ color: barColor }}>{info.rating}/10</span>
                      </div>
                      <div style={{ height: "6px", background: "#f3eedf", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ width: `${info.rating * 10}%`, height: "100%", background: barColor, borderRadius: "3px" }} />
                      </div>
                    </div>
                    <div style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                      {info.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Parāśarī × Tājika Integration Builder */}
      {activeTab === "builder" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.12)",
              borderRadius: "10px",
              padding: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px"
            }}
          >
            {/* Column 1: Natal Promise */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                1. Natal Promise (Parāśarī 10H baseline):
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["weak", "moderate", "strong"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setNatalPromise(lvl)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      borderRadius: "6px",
                      border: `1.5px solid ${natalPromise === lvl ? (lvl === "strong" ? GREEN : lvl === "weak" ? RED : AMBER) : "rgba(156,122,47,0.15)"}`,
                      background: natalPromise === lvl ? (lvl === "strong" ? "rgba(47, 125, 85, 0.05)" : lvl === "weak" ? "rgba(162, 58, 30, 0.05)" : "rgba(217, 119, 6, 0.05)") : "#ffffff",
                      color: natalPromise === lvl ? (lvl === "strong" ? GREEN : lvl === "weak" ? RED : AMBER) : INK_SECONDARY,
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textTransform: "capitalize"
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Tājika Year Activation */}
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
                2. Year Activation (Tājika Varṣaphala):
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["challenging", "neutral", "favourable"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setYearActivation(lvl)}
                    style={{
                      flex: 1,
                      padding: "8px 4px",
                      borderRadius: "6px",
                      border: `1.5px solid ${yearActivation === lvl ? (lvl === "favourable" ? GREEN : lvl === "challenging" ? RED : AMBER) : "rgba(156,122,47,0.15)"}`,
                      background: yearActivation === lvl ? (lvl === "favourable" ? "rgba(47, 125, 85, 0.05)" : lvl === "challenging" ? "rgba(162, 58, 30, 0.05)" : "rgba(217, 119, 6, 0.05)") : "#ffffff",
                      color: yearActivation === lvl ? (lvl === "favourable" ? GREEN : lvl === "challenging" ? RED : AMBER) : INK_SECONDARY,
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "bold",
                      textTransform: "capitalize"
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Filtration Conduit (SVG) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "left" }}>
              Interactive Filtration Conduit:
            </span>
            <svg width="100%" height="130" viewBox="0 0 540 130" style={{ overflow: "visible", background: "#ffffff", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", padding: "10px 0" }}>
              <defs>
                <style dangerouslySetInnerHTML={{ __html: `
                  @keyframes conduit-dash {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                  .conduit-flow-line {
                    stroke-dasharray: 8,4;
                    animation: conduit-dash 1s infinite linear;
                  }
                `}} />
              </defs>

              {/* Background tracks */}
              <path d="M 30,65 L 510,65" stroke="#f1ead4" strokeWidth="20" strokeLinecap="round" opacity="0.3" />

              {/* Input Year Activation Flow (from Left to Gate at x=190) */}
              <path
                d="M 30,65 L 190,65"
                stroke={energyColor}
                strokeWidth="14"
                strokeLinecap="round"
                className="conduit-flow-line"
                opacity="0.9"
                style={{ transition: "stroke 300ms ease" }}
              />

              {/* Natal Gate drawing at x=190 */}
              <rect x="182" y="20" width="16" height="90" fill="none" stroke={GOLD} strokeWidth="2" rx="3" />
              
              {/* Gate doors (opening/closing based on natalPromise) */}
              <rect
                x="185"
                y="23"
                width="10"
                height={gateDoorHeight}
                fill={GOLD_DEEP}
                style={{ transition: "height 300ms ease" }}
              />
              <rect
                x="185"
                y={107 - gateDoorHeight}
                width="10"
                height={gateDoorHeight}
                fill={GOLD_DEEP}
                style={{ transition: "y 300ms ease, height 300ms ease" }}
              />

              {/* Filtered Output Flow (from Gate at x=190 to Right at x=510) */}
              <path
                d="M 190,65 L 510,65"
                stroke={energyColor}
                strokeWidth={outputThickness}
                strokeLinecap="round"
                className="conduit-flow-line"
                opacity="0.95"
                style={{ transition: "stroke-width 300ms ease, stroke 300ms ease" }}
              />

              {/* Text Labels */}
              <text x="40" y="30" fill={INK_SECONDARY} fontSize="11" fontWeight="bold">
                YEARLY ACTIVATION
              </text>
              <text x="40" y="44" fill={energyColor} fontSize="10" fontWeight="bold" style={{ transition: "fill 300ms ease" }}>
                {yearActivation.toUpperCase()} FLOW
              </text>

              <text x="190" y="122" fill={GOLD_DEEP} fontSize="10" fontWeight="bold" textAnchor="middle">
                NATAL GATE ({natalPromise.toUpperCase()})
              </text>

              <text x="420" y="30" fill={INK_SECONDARY} fontSize="11" fontWeight="bold">
                SYNTHESIZED OUTCOME
              </text>
              <text x="420" y="44" fill={energyColor} fontSize="10" fontWeight="bold" style={{ transition: "fill 300ms ease" }}>
                {natalPromise === "weak" && yearActivation === "favourable" ? "RESTRICTED (TEMPORARY RELIEF)" : "DELIVERED FORCE"}
              </text>
            </svg>
          </div>

          {/* Dual SVG Charts Block */}
          <div style={{ display: "flex", justifyContent: "space-around", gap: "20px", background: "#ffffff", padding: "20px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.12)" }}>
            {/* Chart 1: Natal Promise */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: GOLD_DEEP }}>Parāśarī Natal baseline (D1)</span>
              <svg width="150" height="150" viewBox="0 0 130 130" style={{ overflow: "visible" }}>
                <rect x="0" y="0" width="130" height="130" fill="none" stroke="rgba(156, 122, 47, 0.4)" strokeWidth="1.5" />
                {(Object.keys(HOUSE_PATHS_SMALL) as Array<unknown> as number[]).map((h) => {
                  const pathStr = HOUSE_PATHS_SMALL[h as keyof typeof HOUSE_PATHS_SMALL];
                  const pos = HOUSE_LABEL_POS_SMALL[h as keyof typeof HOUSE_LABEL_POS_SMALL];
                  
                  const is10H = h === 10;
                  const isLagna = h === 1;

                  let fillCol = "none";
                  let strokeCol = "rgba(156,122,47,0.2)";
                  let strokeW = "1";

                  if (isLagna) {
                    strokeCol = GOLD;
                    strokeW = "1.5";
                  } else if (is10H) {
                    fillCol = natalPromise === "strong" ? "rgba(47, 125, 85, 0.08)" : natalPromise === "weak" ? "rgba(162, 58, 30, 0.08)" : "rgba(217, 119, 6, 0.08)";
                    strokeCol = natalPromise === "strong" ? GREEN : natalPromise === "weak" ? RED : AMBER;
                    strokeW = "2";
                  }

                  return (
                    <g key={h}>
                      <path d={pathStr} fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} style={{ transition: "all 300ms ease" }} />
                      {is10H && (
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill={natalPromise === "strong" ? GREEN : natalPromise === "weak" ? RED : AMBER}
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ transition: "fill 300ms ease" }}
                        >
                          10H: {natalPromise}
                        </text>
                      )}
                      {!is10H && (
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill={isLagna ? GOLD_DEEP : "rgba(77, 65, 51, 0.25)"}
                          fontSize="8"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {isLagna ? "Lg" : h}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Chart 2: Year Solar Return */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: GOLD_DEEP }}>Tājika Solar Return (Varṣaphala)</span>
              <svg width="150" height="150" viewBox="0 0 130 130" style={{ overflow: "visible" }}>
                <rect x="0" y="0" width="130" height="130" fill="none" stroke="rgba(156, 122, 47, 0.4)" strokeWidth="1.5" />
                {(Object.keys(HOUSE_PATHS_SMALL) as Array<unknown> as number[]).map((h) => {
                  const pathStr = HOUSE_PATHS_SMALL[h as keyof typeof HOUSE_PATHS_SMALL];
                  const pos = HOUSE_LABEL_POS_SMALL[h as keyof typeof HOUSE_LABEL_POS_SMALL];
                  
                  const isMuntha = h === 4;
                  const isVarshaLagna = h === 1;

                  let fillCol = "none";
                  let strokeCol = "rgba(156,122,47,0.2)";
                  let strokeW = "1";

                  if (isVarshaLagna) {
                    strokeCol = GOLD;
                    strokeW = "1.5";
                  } else if (isMuntha) {
                    fillCol = yearActivation === "favourable" ? "rgba(47, 125, 85, 0.08)" : yearActivation === "challenging" ? "rgba(162, 58, 30, 0.08)" : "rgba(217, 119, 6, 0.08)";
                    strokeCol = yearActivation === "favourable" ? GREEN : yearActivation === "challenging" ? RED : AMBER;
                    strokeW = "2";
                  }

                  return (
                    <g key={h}>
                      <path d={pathStr} fill={fillCol} stroke={strokeCol} strokeWidth={strokeW} style={{ transition: "all 300ms ease" }} />
                      {isMuntha && (
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill={yearActivation === "favourable" ? GREEN : yearActivation === "challenging" ? RED : AMBER}
                          fontSize="9.5"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ transition: "fill 300ms ease" }}
                        >
                          MNT: {yearActivation === "favourable" ? "Fav" : yearActivation === "challenging" ? "Chal" : "Neut"}
                        </text>
                      )}
                      {!isMuntha && (
                        <text
                          x={pos.x}
                          y={pos.y}
                          fill={isVarshaLagna ? GOLD_DEEP : "rgba(77, 65, 51, 0.25)"}
                          fontSize="8"
                          textAnchor="middle"
                          dominantBaseline="central"
                        >
                          {isVarshaLagna ? "vLg" : h}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Symmetric Synthesis Output Panel */}
          <div
            style={{
              background: "#ffffff",
              border: `2px solid ${integrationResult.color}`,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              transition: "border 300ms ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Activity size={18} color={integrationResult.color} style={{ transition: "color 300ms ease" }} />
              <span style={{ fontSize: "11px", fontWeight: 700, color: integrationResult.color, textTransform: "uppercase", transition: "color 300ms ease" }}>
                Symmetric Synthesis Result (Formula: Natal Promise × Year Activation)
              </span>
            </div>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: INK_PRIMARY }}>
              {integrationResult.verdict}
            </h4>
            <p style={{ margin: 0, fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
              {integrationResult.text}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Stream Reconciliation Dojo */}
      {activeTab === "dojo" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(156, 122, 47, 0.15)",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 4px 16px rgba(156, 122, 47, 0.02)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Layers size={18} color={GOLD} />
                <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "15px" }}>
                  Dojo Case {currentDojoIdx + 1} of {DOJO_QUESTIONS.length}
                </span>
              </div>
              <button
                onClick={handleNextDojo}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: GOLD_DEEP,
                  fontSize: "12.5px",
                  fontWeight: "bold",
                  textDecoration: "underline"
                }}
              >
                Next Case
              </button>
            </div>

            {/* Scenario block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ margin: 0, fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                <strong>Scenario:</strong> {currentDojo.scenario}
              </p>
              <div
                style={{
                  background: "rgba(156, 122, 47, 0.04)",
                  borderLeft: `4px solid ${GOLD}`,
                  padding: "10px 14px",
                  fontSize: "13.5px",
                  lineHeight: "1.5",
                  fontWeight: 600,
                  color: INK_PRIMARY,
                  borderRadius: "0 6px 6px 0"
                }}
              >
                {currentDojo.query}
              </div>
            </div>

            {/* Options list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {currentDojo.options.map((opt, idx) => {
                const isSelected = selectedDojoOpt === idx;
                const borderCol = isSelected ? (opt.isCorrect ? GREEN : RED) : "rgba(156, 122, 47, 0.15)";
                const bgCol = isSelected ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff";

                return (
                  <button
                    key={idx}
                    onClick={() => handleDojoOptionSelect(idx)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      background: bgCol,
                      border: `1px solid ${borderCol}`,
                      cursor: "pointer",
                      fontSize: "13px",
                      color: INK_SECONDARY,
                      lineHeight: "1.5",
                      transition: "all 150ms ease",
                      display: "flex",
                      gap: "12px",
                      alignItems: "flex-start",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.01)"
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: `1.5px solid ${isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED}`,
                        fontSize: "11px",
                        fontWeight: "bold",
                        color: isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED,
                        flexShrink: 0,
                        marginTop: "2px"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Dojo Feedback box */}
            {selectedDojoOpt !== null && (
              <div
                style={{
                  background: currentDojo.options[selectedDojoOpt].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
                  border: `1px solid ${currentDojo.options[selectedDojoOpt].isCorrect ? GREEN : RED}`,
                  color: currentDojo.options[selectedDojoOpt].isCorrect ? GREEN : RED,
                  borderRadius: "8px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}
              >
                {currentDojo.options[selectedDojoOpt].isCorrect ? (
                  <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                ) : (
                  <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                )}
                <span>{dojoFeedback}</span>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
