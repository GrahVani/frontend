"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Award, Compass, ArrowRight, BookOpen } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const RASHI_NAMES = [
  "Aries (Meṣa)",
  "Taurus (Vṛṣabha)",
  "Gemini (Mithuna)",
  "Cancer (Karka)",
  "Leo (Siṁha)",
  "Virgo (Kanyā)",
  "Libra (Tulā)",
  "Scorpio (Vṛścika)",
  "Sagittarius (Dhanu)",
  "Capricorn (Makara)",
  "Aquarius (Kumbha)",
  "Pisces (Mīna)"
];

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
  2: { x: 50, y: 22 },
  3: { x: 22, y: 50 },
  4: { x: 45, y: 100 },
  5: { x: 22, y: 150 },
  6: { x: 50, y: 178 },
  7: { x: 100, y: 155 },
  8: { x: 150, y: 178 },
  9: { x: 178, y: 150 },
  10: { x: 155, y: 100 },
  11: { x: 178, y: 50 },
  12: { x: 150, y: 22 }
};

interface CaseStudy {
  id: string;
  title: string;
  completedAge: number;
  natalLagna: number;
  varsaLagna: number;
  munthaHouse: number;
  varshesa: string;
  varshesaHouse: number;
  saham: string;
  sahamHouse: number;
  yoga: string;
  yogaDetails: string;
  clientQuery: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
  placements: Record<string, number>; // planet name -> house
}

const CASE_STUDIES: Record<string, CaseStudy> = {
  case1: {
    id: "case1",
    title: "Case Study 1: Career Opportunity & Network Gains",
    completedAge: 34,
    natalLagna: 9, // Sagittarius
    varsaLagna: 9, // Sagittarius
    munthaHouse: 11, // Libra (H11)
    varshesa: "Jupiter",
    varshesaHouse: 10, // Virgo (H10)
    saham: "Puṇya Saham",
    sahamHouse: 5,
    yoga: "Jupiter-Venus Ithasāla",
    yogaDetails: "Favorable applying aspect between 10th lord (career) and 11th lord (gains).",
    clientQuery: "I have a big promotion cycle coming up. Since my Varṣeśa is Jupiter in the 10th and Munthā is in the 11th with a strong Ithasāla, will I definitely get promoted this year?",
    options: [
      {
        text: "Deterministic promise: 'Yes, absolutely. Jupiter is the year-lord in your 10th house of career and Munthā is in the 11th of gains. This is a guarantee that you will get promoted with a massive raise.'",
        isCorrect: false,
        feedback: "Incorrect. Attributing a guaranteed outcome based on a single year's transit indicators violates the M19 over-promise discipline."
      },
      {
        text: "M19-compliant synthesis reframe: 'The Varṣaphala indicates an exceptionally supportive trend for career actions (Jupiter in 10th) and goals (Munthā in 11th), backed by a favorable applying Ithasāla. This means conditions are ripe for advancement. However, it is an opportunity-trend, not a deterministic guarantee. Apply focused effort, and confirm if your natal chart promises this promotion.'",
        isCorrect: true,
        feedback: "Correct! This weaves the Year Lord, Munthā, and yoga into a supportive ambient trend while reserving final outcomes and referencing the natal-promise baseline."
      },
      {
        text: "Negative warning: 'Even with these indicators, transit Saturn is still aspecting your natal chart, so you should expect delays and probably prepare for a backup plan in case it fails.'",
        isCorrect: false,
        feedback: "Incorrect. This falls into unwarranted fear-mongering despite the highly favorable annual configuration."
      }
    ],
    placements: {
      Jupiter: 10,
      Venus: 11,
      Sun: 9,
      Moon: 5
    }
  },
  case2: {
    id: "case2",
    title: "Case Study 2: Domestic Restructuring & Transformation",
    completedAge: 41,
    natalLagna: 8, // Scorpio
    varsaLagna: 8, // Scorpio
    munthaHouse: 8, // H8 (Gemini)
    varshesa: "Mars",
    varshesaHouse: 1, // Scorpio (H1)
    saham: "Sama Saham",
    sahamHouse: 8,
    yoga: "Mars-Sun Ithasāla",
    yogaDetails: "Applying Friendly aspect between 1st lord Mars and 10th lord Sun.",
    clientQuery: "My Munthā has progressed to the 8th house. I am terrified that this represents a year of crisis, serious illness, or accidents. Is this true?",
    options: [
      {
        text: "Confirming fear: 'Yes, the 8th house is the house of death and crisis. Having your Munthā progress there is a warning of severe danger. Cancel your travels and stay inside.'",
        isCorrect: false,
        feedback: "Incorrect. This violates the M19 protocol by amplifying fear and treating the 8th house as a deterministic curse."
      },
      {
        text: "M19-compliant reframe: 'The 8th house is the domain of depth-work, transformation, and physical awareness. Rather than disaster, your Munthā here anchors a year-focus on health routines, internal research, or managing joint resources. Supported by Mars as Varṣeśa in your Lagna (H1), you have the vitality and drive to restructure these areas constructively.'",
        isCorrect: true,
        feedback: "Correct! This reframes the 8th house focus area as a wellness and depth-work theme, utilizing the strong Varṣeśa Mars in H1 as the source of vitality."
      },
      {
        text: "Ignoring the challenge: 'Don't worry, Mars is your year-lord in the 1st house so you are completely immune to any health issues or accidents this year.'",
        isCorrect: false,
        feedback: "Incorrect. This over-promises safety and ignores the realistic focus on health and depth suggested by the 8th house Munthā."
      }
    ],
    placements: {
      Mars: 1,
      Sun: 5,
      Moon: 3,
      Jupiter: 8
    }
  },
  case3: {
    id: "case3",
    title: "Case Study 3: Academic Effort & Choice Integration",
    completedAge: 22,
    natalLagna: 3, // Gemini
    varsaLagna: 3, // Gemini
    munthaHouse: 7, // Sagittarius (H7)
    varshesa: "Mercury",
    varshesaHouse: 5, // Libra (H5)
    saham: "Vidyā Saham",
    sahamHouse: 5,
    yoga: "Moon-Mercury Eesarphā",
    yogaDetails: "Separating aspect showing previous study partnerships or goals transitioning.",
    clientQuery: "I have a separating yoga between my year-lord Mercury in the 5th and the Moon, and my Munthā is in the 7th house of partnerships. Does this mean my relationships will break up and I will fail my university exams?",
    options: [
      {
        text: "Severe warning: 'Separating yoga (Eesarphā) is a sign of breakups. Your relationship is definitely ending, and you will fail your classes because of the emotional stress.'",
        isCorrect: false,
        feedback: "Incorrect. This reads separating aspects as a guarantee of disaster and fails to see the constructive learning focus of Mercury in H5."
      },
      {
        text: "M19-compliant reframe: 'A separating yoga (Eesarphā) simply indicates that a past relationship dynamic or study routine is transitioning or resolving. With your Munthā in the 7th house of partnerships and Varṣeśa Mercury in the 5th house of intellect and Vidyā Saham, your primary focus is on collaborative communication and study. Use this time to establish clear academic goals.'",
        isCorrect: true,
        feedback: "Correct! This translates the separating yoga as a natural phase transition and frames the intellectual and relationship domains constructively."
      },
      {
        text: "Trivialization: 'Separating yogas don't mean anything. Just ignore it and you are guaranteed to pass your exams easily.'",
        isCorrect: false,
        feedback: "Incorrect. This ignores the Tājiika aspect rules entirely and over-promises success."
      }
    ],
    placements: {
      Mercury: 5,
      Moon: 2,
      Sun: 1,
      Jupiter: 7
    }
  }
};

export function TajikaVarshaphalaSynthesizer() {
  const [activeCaseId, setActiveCaseId] = useState<string>("case1");
  const [stepVerification, setStepVerification] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false
  });
  const [selectedDojoOption, setSelectedDojoOption] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");
  const activeCase = CASE_STUDIES[activeCaseId];
  const allStepsVerified = Object.values(stepVerification).every(v => v);
  const toggleStep = (s: number) => {
    setStepVerification(prev => ({
      ...prev,
      [s]: !prev[s]
    }));
  };

  const handleCaseChange = (caseId: string) => {
    setActiveCaseId(caseId);
    setSelectedDojoOption(null);
    setDojoFeedback("");
    setStepVerification({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false
    });
  };

  const handleDojoAnswer = (idx: number, isCorrect: boolean, feedback: string) => {
    setSelectedDojoOption(idx);
    setDojoFeedback(feedback);
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-varshaphala-synthesizer"
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .dojo-card-button {
          width: 100%;
          text-align: left;
          padding: 12px 14px;
          border-radius: 8px;
          background: #ffffff;
          border: 1.5px solid rgba(156, 122, 47, 0.15);
          cursor: pointer;
          font-size: 13px;
          color: var(--gl-ink-on-cream-secondary, #4d4133);
          line-height: 1.5;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          gap: 12px;
          align-items: flex-start;
          box-shadow: 0 2px 6px rgba(156, 122, 47, 0.01);
        }
        .dojo-card-button:hover {
          border-color: rgba(156, 122, 47, 0.45);
          background: rgba(255, 253, 246, 0.65);
          transform: translateY(-1.5px);
          box-shadow: 0 6px 16px rgba(156, 122, 47, 0.05);
        }
        .dojo-card-button.selected-correct {
          border-color: #2F7D55;
          background: rgba(47, 125, 85, 0.04);
        }
        .dojo-card-button.selected-incorrect {
          border-color: #A23A1E;
          background: rgba(162, 58, 30, 0.04);
        }
        .aspect-flow-line {
          stroke-dasharray: 6,4;
          animation: aspect-dash 1.2s infinite linear;
        }
        @keyframes aspect-dash {
          to {
            stroke-dashoffset: -20;
          }
        }
      `}} />

      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Module 19 — Chapter 4 — Lesson 4
        </span>
        <h3 style={{ fontSize: "20px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0" }}>
          Varṣaphala Capstone Interpretation Synthesizer
        </h3>
        <p style={{ fontSize: "12.5px", color: INK_SECONDARY, margin: "2px 0 0" }}>
          Practice weaving the five layers of annual return analysis into a unified, non-deterministic counseling narrative.
        </p>
      </div>

      {/* Case Studies Selector */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {Object.values(CASE_STUDIES).map((cs) => {
          const isActive = cs.id === activeCaseId;
          return (
            <button
              key={cs.id}
              onClick={() => handleCaseChange(cs.id)}
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "8px 12px",
                borderRadius: "6px",
                background: isActive ? GOLD_DEEP : "#ffffff",
                color: isActive ? "#ffffff" : INK_SECONDARY,
                border: `1px solid ${isActive ? GOLD_DEEP : "rgba(156, 122, 47, 0.15)"}`,
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 150ms ease"
              }}
            >
              {cs.title}
            </button>
          );
        })}
      </div>

      {/* Layout: Workbench & SVG Diamond Chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px", alignItems: "start" }}>
        
        {/* Left: 5-Step Synthesis Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "8px", padding: "16px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
              Five-Step Synthesis Workbook Checklist:
            </span>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Step 1 */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px" }}>
                <input
                  type="checkbox"
                  checked={stepVerification[1]}
                  onChange={() => toggleStep(1)}
                  style={{ width: "16px", height: "16px", accentColor: GOLD, marginTop: "2px", cursor: "pointer" }}
                />
                <div>
                  <strong>Step 1: Identify Year-Lord (Varṣeśa) Theme</strong>
                  <div style={{ fontSize: "11.5px", color: INK_MUTED }}>
                    Winner: {activeCase.varshesa} in H{activeCase.varshesaHouse} sets the dominant year-tone quality.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px" }}>
                <input
                  type="checkbox"
                  checked={stepVerification[2]}
                  onChange={() => toggleStep(2)}
                  style={{ width: "16px", height: "16px", accentColor: GOLD, marginTop: "2px", cursor: "pointer" }}
                />
                <div>
                  <strong>Step 2: Identify Munthā Placement</strong>
                  <div style={{ fontSize: "11.5px", color: INK_MUTED }}>
                    Munthā is in House {activeCase.munthaHouse} ({RASHI_NAMES[activeCase.munthaHouse - 1]}), anchoring the focus domain.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px" }}>
                <input
                  type="checkbox"
                  checked={stepVerification[3]}
                  onChange={() => toggleStep(3)}
                  style={{ width: "16px", height: "16px", accentColor: GOLD, marginTop: "2px", cursor: "pointer" }}
                />
                <div>
                  <strong>Step 3: Audit Varṣaphala Lagna Chart Structure</strong>
                  <div style={{ fontSize: "11.5px", color: INK_MUTED }}>
                    Lagna is {RASHI_NAMES[activeCase.varsaLagna - 1]}. Review annual houses and placements.
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px" }}>
                <input
                  type="checkbox"
                  checked={stepVerification[4]}
                  onChange={() => toggleStep(4)}
                  style={{ width: "16px", height: "16px", accentColor: GOLD, marginTop: "2px", cursor: "pointer" }}
                />
                <div>
                  <strong>Step 4: Audit Relevant Sahams</strong>
                  <div style={{ fontSize: "11.5px", color: INK_MUTED }}>
                    Active Saham: {activeCase.saham} in House {activeCase.sahamHouse} showing key topic activations.
                  </div>
                </div>
              </div>
              
              {/* Step 5 */}
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "12.5px" }}>
                <input
                  type="checkbox"
                  checked={stepVerification[5]}
                  onChange={() => toggleStep(5)}
                  style={{ width: "16px", height: "16px", accentColor: GOLD, marginTop: "2px", cursor: "pointer" }}
                />
                <div>
                  <strong>Step 5: Identify 16 Tājika Yogas</strong>
                  <div style={{ fontSize: "11.5px", color: INK_MUTED }}>
                    Yoga: {activeCase.yoga}. {activeCase.yogaDetails}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Annual Trend Card / Synthesis Summary Card */}
          {allStepsVerified ? (
            <div
              style={{
                background: "rgba(156, 122, 47, 0.05)",
                border: `1.5px solid ${GOLD}`,
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 20px rgba(156, 122, 47, 0.12)",
                animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Award size={18} color={GOLD} />
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Integrated Annual Trend Card
                </span>
              </div>
              <p style={{ fontSize: "13px", lineHeight: "1.55", color: INK_SECONDARY, margin: 0 }}>
                {activeCaseId === "case1" && (
                  "Synthesis indicates a highly structured career opportunity. Year-Lord Jupiter in the 10th establishes high intellectual capability and professional mentorship. Progressed Munthā in the 11th anchors your personal focus on network achievements and goals. Combined with the favorable Jupiter-Venus applying Ithasāla yoga, career progress is highly supported. Translate this constructively to target active promotions, while noting the final promise rests on natal chart confirmation."
                )}
                {activeCaseId === "case2" && (
                  "Synthesis highlights a year of deep transformation and wellness focus. Progressed Munthā in the 8th house structures the year's challenges around depth-work, health routines, and shared resources. Rather than fatalistic dread, Year-Lord Mars in Lagna (1st house) provides supreme physical energy and resilience. The Mars-Sun applying Ithasāla reinforces professional status through individual effort."
                )}
                {activeCaseId === "case3" && (
                  "Synthesis points to collaborative study modifications. Progressed Munthā in the 7th house anchors attention on agreements and partnerships. While the Moon-Mercury Eesarphā separating yoga signals that a prior study routine or alliance has resolved, Year-Lord Mercury in the 5th house of intellect guarantees study success and analytical clarity. Shift focus to solitary preparation."
                )}
              </p>
            </div>
          ) : (
            <div
              style={{
                background: "rgba(77, 65, 51, 0.02)",
                border: "1.5px dashed rgba(156, 122, 47, 0.22)",
                borderRadius: "8px",
                padding: "14px",
                textAlign: "center",
                fontSize: "12px",
                color: INK_MUTED,
                transition: "all 0.3s ease"
              }}
            >
              Verify all 5 checklist items above to generate the unified annual narrative.
            </div>
          )}
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.12)",
            borderRadius: "8px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px"
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, alignSelf: "flex-start" }}>
            Case Study Chart Placements
          </span>

          <svg width="220" height="220" viewBox="0 0 200 200">
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" />
            
            {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
              const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
              const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
              
              const currentRashi = (activeCase.varsaLagna + h - 2) % 12 + 1;
              const isLagna = h === 1;
              const isMuntha = h === activeCase.munthaHouse;
              const isVarshesa = h === activeCase.varshesaHouse;

              // Find planets in this house for active case
              const planets: string[] = [];
              Object.keys(activeCase.placements).forEach(p => {
                if (activeCase.placements[p] === h) planets.push(p);
              });

              let fillColor = "none";
              let strokeCol = "rgba(156, 122, 47, 0.2)";
              let strokeW = "1";

              if (isVarshesa) {
                fillColor = "rgba(156, 122, 47, 0.12)";
                strokeCol = GOLD;
                strokeW = "2";
              } else if (isLagna) {
                fillColor = "rgba(47, 125, 85, 0.04)";
              }

              return (
                <g key={h}>
                  <path
                    d={pathStr}
                    fill={fillColor}
                    stroke={strokeCol}
                    strokeWidth={strokeW}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 7}
                    fill={isVarshesa ? GOLD_DEEP : INK_MUTED}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {currentRashi}
                  </text>
                  <text
                    x={pos.x - 12}
                    y={pos.y + 7}
                    fill="rgba(77, 65, 51, 0.4)"
                    fontSize="6.5"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {`H${h}`}
                  </text>
                  <text
                    x={pos.x + 8}
                    y={pos.y + 7}
                    fill={isVarshesa ? GOLD_DEEP : INK_PRIMARY}
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {isMuntha ? "Mun" : ""} {planets.map(p => p.substring(0, 2)).join(" ")}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Synthesis / Counseling Dojo Drill */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "8px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BookOpen size={18} color={GOLD} />
          <div>
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "14px" }}>Capstone Synthesis Counseling Dojo</span>
            <p style={{ fontSize: "11.5px", color: INK_MUTED, margin: 0 }}>
              Formulate a compliant, non-fatalistic synthesis query response for this case study.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(156, 122, 47, 0.04)",
            borderLeft: `3px solid ${GOLD}`,
            padding: "10px 12px",
            fontSize: "12.5px",
            lineHeight: "1.45",
            fontStyle: "italic",
            color: INK_SECONDARY
          }}
        >
          <strong>Client Query:</strong> "{activeCase.clientQuery}"
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {activeCase.options.map((opt, idx) => {
            const isSelected = selectedDojoOption === idx;
            const className = `dojo-card-button ${isSelected ? (opt.isCorrect ? "selected-correct" : "selected-incorrect") : ""}`;

            return (
              <button
                key={idx}
                onClick={() => handleDojoAnswer(idx, opt.isCorrect, opt.feedback)}
                className={className}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: `1.5px solid ${isSelected ? (opt.isCorrect ? GREEN : RED) : INK_MUTED}`,
                    fontSize: "10px",
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

        {selectedDojoOption !== null && (
          <div
            style={{
              background: activeCase.options[selectedDojoOption].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
              border: `1px solid ${activeCase.options[selectedDojoOption].isCorrect ? GREEN : RED}`,
              color: activeCase.options[selectedDojoOption].isCorrect ? GREEN : RED,
              borderRadius: "6px",
              padding: "10px 12px",
              fontSize: "12.5px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {activeCase.options[selectedDojoOption].isCorrect ? (
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            ) : (
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            )}
            <span>{dojoFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
