"use client";

import { useState } from "react";
import { BookOpen, Check, X, HelpCircle, RefreshCw, Layers } from "lucide-react";

interface TantraDetails {
  name: string;
  sanskrit: string;
  focus: string;
  scope: string;
  sanskritizationExample: string;
  chapterMap: string;
  color: string; // Spine color
  accentColor: string; // Detail accent
}

const TANTRAS: TantraDetails[] = [
  {
    name: "Saṁjñā-tantra",
    sanskrit: "संज्ञा तन्त्र",
    focus: "Definitions & Technical Terminology",
    scope: "Defines the core grammar of Tājika: planetary aspects, numeric aspect ranges (orbs), friend/enemy statuses, and the basic vocabulary required to parse the rest of the text.",
    sanskritizationExample: "Systematizes Arabic aspect terminology into Sanskrit metrics (e.g. converting 'orbs of influence' into planetary 'dīptāṁśas').",
    chapterMap: "Module 19 Chapter 2 (Yoga definitions) & Chapter 3 (Saham definitions).",
    color: "#9C7A2F", // Mughal Gold
    accentColor: "#7A5E1E"
  },
  {
    name: "Varṣa-tantra",
    sanskrit: "वर्ष तन्त्र",
    focus: "Annual Return Mechanics",
    scope: "Covers solar-return mathematical calculations, Varṣaphala chart construction, and the tracking of the annual progressed ascendant (Munthā).",
    sanskritizationExample: "Integrates the Arabic solar anniversary return with the Indian sidereal calendar and ayanāṁśa calculations.",
    chapterMap: "Module 19 Chapter 4 (Munthā & Varṣaphala mechanics).",
    color: "#A23A1E", // Royal Vermilion
    accentColor: "#802D17"
  },
  {
    name: "Praśna-tantra",
    sanskrit: "प्रश्न तन्त्र",
    focus: "Tājika Horary Astrology",
    scope: "Presents a complete system for answering immediate queries based on the moment a client asks. Operates independently from natal chart history.",
    sanskritizationExample: "Adapts medieval Islamic horary methods to Vedic prasna conventions, utilizing sign-based rulers and specific Tājika aspects.",
    chapterMap: "Module 19 Chapter 5 (Tājika Praśna deep-dive).",
    color: "#2F7D55", // Jade Green
    accentColor: "#20573B"
  },
  {
    name: "Daśā-tantra",
    sanskrit: "दशा तन्त्र",
    focus: "Annual Dasha Engines",
    scope: "Formulates annual-specific dasha systems like Muddā-daśā (compressing the 120-year Vimśottarī cycle into a single year solar return) and Patyāyinī-daśā.",
    sanskritizationExample: "Compresses classic planetary periods to fit exactly into a 365-day year solar return loop.",
    chapterMap: "Module 19 Chapter 4 (Muddā Daśā computations).",
    color: "#D97706", // Amber Gold
    accentColor: "#A15502"
  },
  {
    name: "Bhāva-tantra",
    sanskrit: "भाव तन्त्र",
    focus: "Annual House Delineation",
    scope: "Evaluates the strength, modifications, and specific significance of the twelve houses in the solar return chart.",
    sanskritizationExample: "Adapts Arabic house-analysis rules to Parāśarī house significations, creating an integrated interpretive layer.",
    chapterMap: "Module 19 Chapter 3 (Sahams associated with specific houses) & Chapter 4 (Varṣa-Lagna house analysis).",
    color: "#4F46E5", // Indigo Blue
    accentColor: "#3730A3"
  },
  {
    name: "Phala-tantra",
    sanskrit: "फल तन्त्र",
    focus: "Predictive Synthesis & Yogas",
    scope: "Synthesizes calculations to formulate predictive outputs. Details the 16 Tājika Yogas (Ithasala, Isarapha, Kambūla, etc.) and the application of Sahams.",
    sanskritizationExample: "Codifies Arabic aspect-configurations into classical Sanskrit ślokas, defining precise predictive results for each combination.",
    chapterMap: "Module 19 Chapter 2 (16 Yogas) & Chapter 3 (50 Sahams).",
    color: "#B45309", // Terracotta Brown
    accentColor: "#78350F"
  }
];

interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QUIZ_ITEMS: QuizItem[] = [
  {
    question: "Which tantra is responsible for defining muddā-daśā (the Vimśottarī dasha compressed into a single year return)?",
    options: ["Saṁjñā-tantra", "Varṣa-tantra", "Daśā-tantra", "Phala-tantra"],
    correctAnswer: "Daśā-tantra",
    explanation: "Daśā-tantra specializes in Tājika-specific annual dasha systems, compressing the classic dasha loops into a 365-day solar return calendar."
  },
  {
    question: "Which tantra defines the technical meanings of the 16 Tājika aspect configurations (like Ithasala and Isarapha)?",
    options: ["Saṁjñā-tantra", "Praśna-tantra", "Bhāva-tantra", "Phala-tantra"],
    correctAnswer: "Saṁjñā-tantra",
    explanation: "Saṁjñā-tantra acts as the dictionary, establishing definitions, terminology, and aspect structures, whereas Phala-tantra synthesizes them for prediction."
  },
  {
    question: "Where in Tājika Nīlakaṇṭhī will you find instructions for casting a chart at the moment a client asks a question?",
    options: ["Varṣa-tantra", "Praśna-tantra", "Bhāva-tantra", "Daśā-tantra"],
    correctAnswer: "Praśna-tantra",
    explanation: "Praśna-tantra covers Tājika horary astrology, focusing on charts cast for the exact moment of a query."
  },
  {
    question: "Under which section are calculations for solar return moments and the tracking of the progressed Munthā explained?",
    options: ["Saṁjñā-tantra", "Varṣa-tantra", "Bhāva-tantra", "Phala-tantra"],
    correctAnswer: "Varṣa-tantra",
    explanation: "Varṣa-tantra handles all direct Varṣaphala mechanics, including solar return calculations and Munthā progressions."
  },
  {
    question: "Which section contains the rules for delineating the 16 Tājika Yogas and translating Saham positions into predictions?",
    options: ["Saṁjñā-tantra", "Praśna-tantra", "Bhāva-tantra", "Phala-tantra"],
    correctAnswer: "Phala-tantra",
    explanation: "Phala-tantra represents the predictive synthesis section, mapping yogas and sahams to final interpretive outcomes."
  }
];

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

export function TajikaNeelakanthiStructure() {
  const [activeTab, setActiveTab] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  const selectTantra = TANTRAS[activeTab];

  const handleSelectOption = (qIdx: number, option: string) => {
    if (quizSubmitted[qIdx]) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmitQuiz = (qIdx: number) => {
    if (!quizAnswers[qIdx]) return;
    setQuizSubmitted(prev => ({ ...prev, [qIdx]: true }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted({});
  };

  const getScore = () => {
    let score = 0;
    QUIZ_ITEMS.forEach((item, idx) => {
      if (quizSubmitted[idx] && quizAnswers[idx] === item.correctAnswer) {
        score++;
      }
    });
    return score;
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
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
      data-interactive="tajika-neelakanthi-structure"
    >
      {/* Header section */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 1 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          Architecture of Tājika Nīlakaṇṭhī (1587 CE)
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.4" }}>
          Pandit Nīlakaṇṭha organized the system into six structured *tantras* (sections) to build a unified Vedic reception.
        </p>
      </div>

      {/* Interactive Bookshelf SVG */}
      <div 
        style={{ 
          background: "#ffffff", 
          border: "1px solid rgba(156, 122, 47, 0.15)", 
          borderRadius: "10px", 
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>
          The Six-Tantra Manuscript Shelf (Click a spine to draw the book)
        </span>
        
        <svg 
          viewBox="0 0 640 220" 
          style={{ 
            width: "100%", 
            maxWidth: "600px",
            height: "auto"
          }}
          aria-label="Bookshelf showing six tantras of Tajika Neelakanthi"
        >
          {/* Wood Shelf Backboard */}
          <rect x="10" y="10" width="620" height="190" fill="#FAF6EE" stroke="rgba(156, 122, 47, 0.2)" strokeWidth="1.5" />
          
          {/* Wood Shelf Bottom Plank */}
          <rect x="5" y="195" width="630" height="15" fill="#E8DBC3" stroke="rgba(156, 122, 47, 0.4)" strokeWidth="1" />
          <line x1="5" y1="195" x2="635" y2="195" stroke="#BCA374" strokeWidth="1.5" />

          {/* Book Spines */}
          {TANTRAS.map((t, idx) => {
            const isActive = idx === activeTab;
            const width = 75;
            const gap = 12;
            const x = 60 + idx * (width + gap);
            
            // Draw books with custom shift if active
            return (
              <g 
                key={idx} 
                cursor="pointer" 
                onClick={() => setActiveTab(idx)}
                style={{
                  transition: "transform 250ms ease-out"
                }}
                transform={isActive ? "translate(0, -18)" : "translate(0, 0)"}
              >
                {/* Active Highlight Shadow / Aura */}
                {isActive && (
                  <rect 
                    x={x - 4} 
                    y="25" 
                    width={width + 8} 
                    height="172" 
                    fill="rgba(156, 122, 47, 0.12)" 
                    rx="4" 
                    filter="blur(3px)"
                  />
                )}

                {/* Book Main Body */}
                <rect 
                  x={x} 
                  y="30" 
                  width={width} 
                  height="165" 
                  fill={t.color} 
                  stroke={isActive ? GOLD : t.accentColor} 
                  strokeWidth={isActive ? "3.5" : "1.5"} 
                  rx="3" 
                />

                {/* Left shadow effect for depth */}
                <rect x={x} y="30" width="8" height="165" fill="rgba(0,0,0,0.15)" rx="1" />
                
                {/* Gold bands on spine */}
                <line x1={x} y1="45" x2={x + width} y2="45" stroke="#E6D3A7" strokeWidth="2" />
                <line x1={x} y1="49" x2={x + width} y2="49" stroke="#E6D3A7" strokeWidth="1" />
                <line x1={x} y1="175" x2={x + width} y2="175" stroke="#E6D3A7" strokeWidth="2" />
                <line x1={x} y1="179" x2={x + width} y2="179" stroke="#E6D3A7" strokeWidth="1" />

                {/* Sanskrit Spine Title (Rotated) */}
                <text 
                  x={x + 30} 
                  y="110" 
                  transform={`rotate(-90, ${x + 30}, 110)`} 
                  fill="#ffffff" 
                  fontSize="11" 
                  fontWeight="800" 
                  textAnchor="middle" 
                  letterSpacing="0.05em"
                  style={{ textTransform: "uppercase" }}
                >
                  {t.name.split("-")[0]}
                </text>

                {/* Small Sanskrit Script Label */}
                <text 
                  x={x + 50} 
                  y="110" 
                  transform={`rotate(-90, ${x + 50}, 110)`} 
                  fill="rgba(255,255,255,0.75)" 
                  fontSize="9.5" 
                  fontFamily="var(--font-cormorant), serif"
                  textAnchor="middle"
                >
                  {t.sanskrit}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Tantra Sheet Details */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.2)",
          borderRadius: "8px",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px"
        }}
      >
        {/* Left Column: Scope & Focus */}
        <div>
          <span style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: RED }}>
            Tantric Domain: {selectTantra.focus}
          </span>
          <h4 style={{ fontSize: "20px", fontWeight: 800, color: INK_PRIMARY, marginTop: "4px", marginBottom: "10px", fontFamily: "var(--font-cormorant), serif" }}>
            {selectTantra.name} — <span style={{ color: selectTantra.color }}>{selectTantra.sanskrit}</span>
          </h4>
          <p style={{ fontSize: "14px", lineHeight: "1.6", color: INK_SECONDARY, margin: "0 0 16px" }}>
            {selectTantra.scope}
          </p>

          <div style={{ borderTop: "1px dashed rgba(156, 122, 47, 0.2)", paddingTop: "12px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Sanskritization Adaptation
            </span>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, marginTop: "4px", margin: 0, lineHeight: "1.4" }}>
              {selectTantra.sanskritizationExample}
            </p>
          </div>
        </div>

        {/* Right Column: Mapping */}
        <div 
          style={{ 
            backgroundColor: "rgba(156, 122, 47, 0.04)", 
            padding: "18px", 
            borderRadius: "6px", 
            borderLeft: `4px solid ${selectTantra.color}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <div>
            <h5 style={{ fontSize: "12.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: selectTantra.color, margin: "0 0 8px" }}>
              Curriculum Integration
            </h5>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: "0 0 12px" }}>
              This specific section of the Nīlakaṇṭhī codifies the calculations and methodologies that you will learn step-by-step in the following parts of the course:
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", backgroundColor: "#ffffff", padding: "10px", borderRadius: "6px", border: "1px solid rgba(156, 122, 47, 0.1)" }}>
            <BookOpen size={16} color={selectTantra.color} style={{ marginTop: "2px", flexShrink: 0 }} />
            <span style={{ fontSize: "13.5px", fontWeight: 700, color: INK_PRIMARY }}>
              {selectTantra.chapterMap}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Sorting Drill */}
      <div style={{ borderTop: "1px solid rgba(156, 122, 47, 0.15)", paddingTop: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h4 style={{ fontSize: "17px", fontWeight: 800, color: INK_PRIMARY, margin: 0, fontFamily: "var(--font-cormorant), serif" }}>
              Interactive Tantra Sorting Drill
            </h4>
            <p style={{ fontSize: "12.5px", color: INK_MUTED, margin: "2px 0 0" }}>
              Test your understanding of the manuscript division by classifying calculations to their respective tantras.
            </p>
          </div>
          {Object.keys(quizSubmitted).length > 0 && (
            <button
              onClick={handleResetQuiz}
              style={{
                background: "none",
                border: "none",
                color: RED,
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "11px",
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <RefreshCw size={11} /> Reset Drill
            </button>
          )}
        </div>

        {/* Quiz list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {QUIZ_ITEMS.map((item, idx) => {
            const isSubmitted = quizSubmitted[idx];
            const chosenAnswer = quizAnswers[idx];
            const isCorrect = chosenAnswer === item.correctAnswer;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "#ffffff",
                  border: `1px solid ${isSubmitted ? (isCorrect ? "rgba(47, 125, 85, 0.3)" : "rgba(162, 58, 30, 0.3)") : "rgba(156, 122, 47, 0.15)"}`,
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 2px 6px rgba(156, 122, 47, 0.01)"
                }}
              >
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "10px" }}>
                  <HelpCircle size={16} color={GOLD} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "14px", fontWeight: 700, color: INK_PRIMARY }}>
                    Question {idx + 1}: {item.question}
                  </span>
                </div>

                {/* Options */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px", marginBottom: "10px" }}>
                  {item.options.map((option, optIdx) => {
                    const isSelected = chosenAnswer === option;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(idx, option)}
                        disabled={isSubmitted}
                        style={{
                          backgroundColor: isSelected ? "rgba(156, 122, 47, 0.08)" : "transparent",
                          border: `1.5px solid ${isSelected ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                          borderRadius: "6px",
                          padding: "10px 8px",
                          textAlign: "center",
                          cursor: isSubmitted ? "default" : "pointer",
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12.5px",
                          fontWeight: isSelected ? 700 : 400,
                          color: isSelected ? GOLD_DEEP : INK_SECONDARY,
                          transition: "all 150ms ease"
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Action / Feedback */}
                {!isSubmitted ? (
                  <button
                    onClick={() => handleSubmitQuiz(idx)}
                    disabled={!chosenAnswer}
                    style={{
                      backgroundColor: chosenAnswer ? GOLD : "rgba(156, 122, 47, 0.4)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      cursor: chosenAnswer ? "pointer" : "default",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase"
                    }}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <div
                    style={{
                      borderTop: `1px dashed ${isCorrect ? "rgba(47, 125, 85, 0.2)" : "rgba(162, 58, 30, 0.2)"}`,
                      paddingTop: "10px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start"
                    }}
                  >
                    {isCorrect ? <Check size={16} color={GREEN} /> : <X size={16} color={RED} />}
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: isCorrect ? GREEN : RED }}>
                        {isCorrect ? "Correct!" : `Incorrect. Correct answer: ${item.correctAnswer}`}
                      </span>
                      <p style={{ fontSize: "12.5px", color: INK_MUTED, margin: "2px 0 0", lineHeight: "1.4" }}>
                        {item.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final score card */}
        {Object.keys(quizSubmitted).length === QUIZ_ITEMS.length && (
          <div
            style={{
              backgroundColor: "rgba(47, 125, 85, 0.04)",
              border: "1px solid rgba(47, 125, 85, 0.2)",
              borderRadius: "8px",
              padding: "18px",
              textAlign: "center"
            }}
          >
            <h5 style={{ fontSize: "17px", fontWeight: 700, color: INK_PRIMARY, margin: 0 }}>
              Drill Completed! Your Score: {getScore()} / {QUIZ_ITEMS.length}
            </h5>
            <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "6px 0 0" }}>
              {getScore() === QUIZ_ITEMS.length
                ? "Perfect! You have successfully mastered the architectural layout of Tājika Nīlakaṇṭhī."
                : "Good effort. Review the bookshelf tabs above to consolidate your knowledge of the six tantras."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
