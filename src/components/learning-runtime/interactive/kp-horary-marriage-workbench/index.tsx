"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const CRIMSON = "#A23A1E";

interface StageDetail {
  title: string;
  subtitle: string;
  activeHouses: number[];
  activePlanets: string[];
}

const STAGES: StageDetail[] = [
  {
    title: "1. Anchor Lagna",
    subtitle: "Convert Number 127 to Scorpio Lagna (Anurādhā / Saturn sub)",
    activeHouses: [1],
    activePlanets: ["Saturn", "Mars"]
  },
  {
    title: "2. 7th Cusp Sub-Lord",
    subtitle: "Determine sub-lord of 7th cusp (24°48' Taurus ➔ Rāhu sub)",
    activeHouses: [7],
    activePlanets: ["Rahu"]
  },
  {
    title: "3. Signification Chain",
    subtitle: "Map Rāhu's houses (occupies 11th, owns 2nd via Jupiter)",
    activeHouses: [2, 7, 11],
    activePlanets: ["Rahu", "Jupiter", "Mercury"]
  },
  {
    title: "4. RP Cross-Check",
    subtitle: "Check if RPs (Jupiter, Mercury) include the significators",
    activeHouses: [1, 7, 11],
    activePlanets: ["Jupiter", "Mercury", "Venus"]
  },
  {
    title: "5. Verdict & Timing",
    subtitle: "Affirm YES verdict with Venus-Jupiter timing window",
    activeHouses: [2, 7, 11],
    activePlanets: ["Venus", "Jupiter"]
  }
];

export function KpHoraryMarriageWorkbench() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);

  const activeStage = STAGES[currentStage];

  // North Indian Chart House Paths (400x400)
  const housePaths = [
    { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 70, numberX: 200, numberY: 30, sign: "8 (Scorpio)" },
    { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 40, numberX: 50, numberY: 30, sign: "9 (Sagittarius)" },
    { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 40, textY: 100, numberX: 30, numberY: 50, sign: "10 (Capricorn)" },
    { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 70, textY: 200, numberX: 30, numberY: 200, sign: "11 (Aquarius)" },
    { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 40, textY: 300, numberX: 30, numberY: 350, sign: "12 (Pisces)" },
    { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 360, numberX: 50, numberY: 375, sign: "1 (Aries)" },
    { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 330, numberX: 200, numberY: 370, sign: "2 (Taurus)" },
    { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 360, numberX: 350, numberY: 375, sign: "3 (Gemini)" },
    { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 360, textY: 300, numberX: 370, numberY: 350, sign: "4 (Cancer)" },
    { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 330, textY: 200, numberX: 370, numberY: 200, sign: "5 (Leo)" },
    { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 360, textY: 100, numberX: 370, numberY: 50, sign: "6 (Virgo)" },
    { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 40, numberX: 350, numberY: 30, sign: "7 (Libra)" }
  ];

  // Pre-configured planet coordinates for Case Study 1
  const stagePlanets = [
    { name: "Rahu", house: 11, sign: "Virgo", desc: "CSL Decider (occupies 11th)" },
    { name: "Jupiter", house: 2, sign: "Sagittarius", desc: "CSL Star Lord (owns 2nd)" },
    { name: "Venus", house: 7, sign: "Taurus", desc: "Kāraka (occupies 7th)" },
    { name: "Saturn", house: 3, sign: "Capricorn", desc: "RP Moon Lord (occupies 3rd)" }
  ];

  const handleStageChange = (idx: number) => {
    setCurrentStage(idx);
    setUserAnswer(null);
  };

  const currentQuestion = useMemo(() => {
    switch (currentStage) {
      case 0:
        return {
          text: "What does the named number 127 fix in this horary chart?",
          options: ["The whole chart", "The Ascendant sub-position only", "The question date"],
          correct: 1,
          feedback: "Correct! The number fixes the Lagna sub-position alone. Other houses and planets come from the moment."
        };
      case 1:
        return {
          text: "Which cusp is decisive for marriage queries?",
          options: ["1st Cusp", "7th Cusp", "11th Cusp"],
          correct: 1,
          feedback: "Correct! The 7th cuspal sub-lord (CSL) decides the marriage query verdict."
        };
      case 2:
        return {
          text: "Is Rāhu signifying any negation houses (1, 6, or 10) in this chart?",
          options: ["Yes, Mars is in 6th", "No, it signifies 11 and 2 cleanly", "Yes, Ketu in 12th"],
          correct: 1,
          feedback: "Correct! Rāhu cleanly signifies the supporting 11th (occupies) and 2nd (via Jupiter), with no 1/6/10 interference."
        };
      case 3:
        return {
          text: "Are the marriage significators present in the Ruling Planets?",
          options: ["No, completely absent", "Yes, Jupiter and Mercury are present", "Only Mars is present"],
          correct: 1,
          feedback: "Correct! Jupiter and Mercury confirm the verdict as Ruling Planets at call time."
        };
      default:
        return {
          text: "What is the final verdict of this horary case study?",
          options: ["NO verdict", "CONDITIONAL verdict", "YES verdict"],
          correct: 2,
          feedback: "Correct! Favourable CSL Venus/Rahu plus RP corroboration yields a clear YES."
        };
    }
  }, [currentStage]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-horary-marriage-workbench">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 7 · Lesson 4</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>Worked Marriage Horary Case Workbench</h1>
      </section>

      {/* Wizard Stepper */}
      <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "12px", marginBottom: "20px", gap: "8px", overflowX: "auto" }}>
        {STAGES.map((s, idx) => {
          const isSelected = currentStage === idx;
          return (
            <button
              key={idx}
              onClick={() => handleStageChange(idx)}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: `1.5px solid ${isSelected ? GOLD : HAIRLINE}`,
                background: isSelected ? `${GOLD}22` : SURFACE,
                color: isSelected ? GOLD : INK_PRIMARY,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: "0.82rem"
              }}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Column: Stage Detail & Prompt Question */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Stage Detail Panel */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <span style={{ color: GOLD, fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 900 }}>Active Resolution Stage</span>
            <h2 style={{ fontSize: "1.2rem", color: GOLD, margin: "4px 0 8px" }}>{activeStage.title}</h2>
            <p style={{ margin: 0, fontSize: "0.9rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {activeStage.subtitle}
            </p>
          </div>

          {/* Prompt Question */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <span style={{ color: GOLD, fontSize: "0.75rem", textTransform: "uppercase", fontWeight: 900 }}>Check Your Understanding</span>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, margin: "6px 0 12px" }}>{currentQuestion.text}</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {currentQuestion.options.map((opt, oIdx) => {
                const isCorrect = oIdx === currentQuestion.correct;
                const isSelected = userAnswer === opt;
                
                let btnBorder = HAIRLINE;
                if (userAnswer) {
                  btnBorder = isSelected ? (isCorrect ? GOLD : CRIMSON) : HAIRLINE;
                }
                
                return (
                  <button
                    key={oIdx}
                    onClick={() => setUserAnswer(opt)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 6,
                      border: `1.5px solid ${btnBorder}`,
                      background: userAnswer && isSelected 
                        ? (isCorrect ? `${GOLD}22` : `${CRIMSON}22`)
                        : SURFACE,
                      color: INK_PRIMARY,
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: "0.85rem"
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {userAnswer && (
              <div style={{
                marginTop: "12px",
                padding: "8px 12px",
                borderRadius: 6,
                background: userAnswer === currentQuestion.options[currentQuestion.correct] ? `${GOLD}11` : `${CRIMSON}11`,
                fontSize: "0.82rem",
                color: userAnswer === currentQuestion.options[currentQuestion.correct] ? GOLD : CRIMSON,
                fontWeight: 600
              }}>
                {userAnswer === currentQuestion.options[currentQuestion.correct] 
                  ? currentQuestion.feedback 
                  : "Try again! Think about the specific rules of the lesson."}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Mini-Kundali Visualization */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0 0 12px", width: "100%" }}>Horary Map (127 Lagna)</h2>
          
          <div style={{ position: "relative", width: "240px", height: "240px" }}>
            <svg viewBox="0 0 400 400" width="100%" height="100%">
              <rect x="0" y="0" width="400" height="400" fill="none" stroke={GOLD} strokeWidth="3" />
              <line x1="0" y1="0" x2="400" y2="400" stroke={GOLD} strokeWidth="1.5" />
              <line x1="400" y1="0" x2="0" y2="400" stroke={GOLD} strokeWidth="1.5" />
              <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={GOLD} strokeWidth="1.5" />

              {housePaths.map((hp) => {
                const isActive = activeStage.activeHouses.includes(hp.id);
                return (
                  <g key={hp.id}>
                    {isActive && (
                      <path d={hp.path} fill={`${GOLD}2b`} stroke={GOLD} strokeWidth="2.5" />
                    )}
                    <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="12" fill={isActive ? GOLD : INK_MUTED} fontWeight="900">
                      {hp.sign.split(" ")[0]}
                    </text>
                    <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="12" fill={isActive ? GOLD : INK_PRIMARY} fontWeight="bold">
                      H{hp.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div style={{ marginTop: "12px", fontSize: "0.76rem", color: INK_MUTED, fontStyle: "italic", textAlign: "center" }}>
            Gold highlighted houses represent the focal houses in the current stage.
          </div>
        </div>

      </div>

      {/* Diagnostics Coordinates Grid */}
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, marginTop: "24px" }}>
        <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px" }}>Worked Case Study Coordinates (No Logs)</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
              <th style={{ textAlign: "left", padding: "6px" }}>Item</th>
              <th style={{ textAlign: "left", padding: "6px" }}>Position / Lord</th>
              <th style={{ textAlign: "left", padding: "6px" }}>Role in Verdict</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>1st Cusp (Lagna)</td>
              <td style={{ padding: "6px" }}>Virgo (Anurādhā, Saturn sub)</td>
              <td style={{ padding: "6px" }}>Ascendant anchor fixed by querent's number 127.</td>
            </tr>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>7th Cusp (Spouse)</td>
              <td style={{ padding: "6px" }}>24°48' Taurus (Star: Mars, Sub: Rāhu)</td>
              <td style={{ padding: "6px" }}>Marriage query-house cusp degree.</td>
            </tr>
            <tr style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
              <td style={{ padding: "6px", fontWeight: 700 }}>7th CSL (Rāhu)</td>
              <td style={{ padding: "6px" }}>Occupies 11th, owns 2nd (via Jupiter)</td>
              <td style={{ padding: "6px", color: GOLD, fontWeight: 700 }}>Promises marriage cleanly (YES).</td>
            </tr>
            <tr>
              <td style={{ padding: "6px", fontWeight: 700 }}>Ruling Planets</td>
              <td style={{ padding: "6px" }}>Venus (Lagna), Jupiter (Moon), Mercury (Day)</td>
              <td style={{ padding: "6px" }}>Corroborates the timing window of mahādaśā.</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
