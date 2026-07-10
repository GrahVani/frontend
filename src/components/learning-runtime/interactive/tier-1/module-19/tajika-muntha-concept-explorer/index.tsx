"use client";

import { useState } from "react";
import { Info, HelpCircle, Layers, CheckCircle2, ShieldAlert, Award, ChevronLeft, ChevronRight, Compass } from "lucide-react";

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

const HOUSE_THEMES: Record<number, string> = {
  1: "Self & Identity: Personal beginnings, vitality, and physical focus.",
  2: "Speech & Finance: Wealth accumulation, family resources, and vocal expression.",
  3: "Efforts & Siblings: Self-motivation, courage, communications, and short journeys.",
  4: "Home & Emotion: Domestic environment, emotional foundations, and inner happiness.",
  5: "Intellect & Children: Creative self-expression, scholarly wisdom, and progeny.",
  6: "Service & Discipline: Healing, resolving challenges, work routine, and debt management.",
  7: "Relationship & Partnership: Legal bonds, public interaction, and business contracts.",
  8: "Depth & Transformation: Hidden knowledge, research, major changes, and longevity awareness.",
  9: "Higher Wisdom & Dharma: Philosophy, spiritual mentorship, long travel, and righteous action.",
  10: "Career & Action: Professional responsibilities, public visibility, and structural work.",
  11: "Gains & Aspirations: Fulfillment of goals, secondary income, and supportive networks.",
  12: "Retreat & Charity: Solitude, spiritual contemplation, letting go, and overseas connections."
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

interface Question {
  clientQuery: string;
  options: Array<{
    text: string;
    isCorrect: boolean;
    feedback: string;
  }>;
}

const DOJO_QUESTION: Question = {
  clientQuery: "My Munthā has progressed into my 8th house this year. I read in an online forum that this is a 'year of complete disaster, danger, and severe illness' and I'm terrified. What should I do?",
  options: [
    {
      text: "Reassure them but confirm their worst fears: 'Yes, the 8th house is extremely difficult, so you should avoid any new actions, cancel your travels, and brace yourself for a crisis.'",
      isCorrect: false,
      feedback: "Incorrect. This violates the M19 defearmongering protocol by inducing unnecessary panic and promoting deterministic dread."
    },
    {
      text: "Refuse the fear-inducing forecast and reframe: 'The 8th house is not a deterministic curse of disaster. In Tājika, it represents a year-domain focused on depth-work, research, and self-awareness. It is an excellent time to focus on health, longevity, and structural life-changes rather than panic.'",
      isCorrect: true,
      feedback: "Correct! This reframes the 8th house constructively as a theme of transformation and depth-work while rejecting fatalistic fear-mongering."
    },
    {
      text: "Give an over-promising alternative: 'Don't worry at all! The 8th house is actually the house of hidden wealth, so you are guaranteed to inherit massive fortunes and win the lottery this year.'",
      isCorrect: false,
      feedback: "Incorrect. This replaces fear-mongering with over-promising, which is equally non-compliant under the M19 framework."
    }
  ]
};

export function TajikaMunthaConceptExplorer() {
  const [natalLagna, setNatalLagna] = useState<number>(1); // 1 = Aries
  const [age, setAge] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [dojoFeedback, setDojoFeedback] = useState<string>("");

  const munthaHouse = (age % 12) + 1;
  const munthaSign = (natalLagna + munthaHouse - 2) % 12 + 1;
  const isCycleReturn = age > 0 && age % 12 === 0;

  const handleDojoAnswer = (idx: number, isCorrect: boolean, feedback: string) => {
    setSelectedOption(idx);
    setDojoFeedback(feedback);
  };

  const incrementAge = () => setAge(prev => Math.min(120, prev + 1));
  const decrementAge = () => setAge(prev => Math.max(0, prev - 1));

  // Generate progressed path timeline (next 10 years)
  const getTimelineItems = () => {
    const items = [];
    for (let i = 0; i <= 10; i++) {
      const targetAge = age + i;
      const targetHouse = (targetAge % 12) + 1;
      const targetSign = (natalLagna + targetHouse - 2) % 12 + 1;
      items.push({
        age: targetAge,
        house: targetHouse,
        sign: targetSign,
        isReturn: targetAge > 0 && targetAge % 12 === 0
      });
    }
    return items;
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.7)",
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
      data-interactive="tajika-muntha-concept-explorer"
    >
      {/* Inline styles for pulse animations and layout */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes gold-pulse {
          0% { fill: rgba(156, 122, 47, 0.1); stroke: #9C7A2F; stroke-width: 2.2px; filter: drop-shadow(0 0 2px rgba(156,122,47,0.3)); }
          50% { fill: rgba(156, 122, 47, 0.22); stroke: #D4AF37; stroke-width: 2.8px; filter: drop-shadow(0 0 6px rgba(156,122,47,0.6)); }
          100% { fill: rgba(156, 122, 47, 0.1); stroke: #9C7A2F; stroke-width: 2.2px; filter: drop-shadow(0 0 2px rgba(156,122,47,0.3)); }
        }
        .active-muntha-region {
          animation: gold-pulse 2s infinite ease-in-out;
          cursor: pointer;
        }
      `}} />

      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px", marginBottom: "4px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 4 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Munthā Progressed-Point Explorer
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Track the annual mathematical advancement of the Munthā and practice non-fatalistic counseling translations.
        </p>
      </div>

      {/* Controls Panel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "10px",
          padding: "18px",
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: "24px",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(156, 122, 47, 0.02)"
        }}
      >
        {/* Natal Lagna Selector */}
        <div>
          <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Select Natal Lagna Sign:
          </label>
          <select
            value={natalLagna}
            onChange={(e) => setNatalLagna(Number(e.target.value))}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid rgba(156, 122, 47, 0.25)",
              background: "#ffffff",
              color: INK_PRIMARY,
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
              fontWeight: 500,
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.02)"
            }}
          >
            {RASHI_NAMES.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {idx + 1} - {name}
              </option>
            ))}
          </select>
        </div>

        {/* Age completed years slider with Fine-Tuning */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <label style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Client's Completed Age (Years):
            </label>
            <strong style={{ fontSize: "15px", color: GOLD_DEEP }}>{age} Completed Years</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={decrementAge}
              disabled={age === 0}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.2)",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: age === 0 ? "not-allowed" : "pointer",
                color: age === 0 ? INK_MUTED : GOLD_DEEP,
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
              }}
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="120"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{
                flex: 1,
                cursor: "pointer",
                accentColor: GOLD
              }}
            />
            <button
              onClick={incrementAge}
              disabled={age === 120}
              style={{
                background: "#ffffff",
                border: "1px solid rgba(156, 122, 47, 0.2)",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: age === 120 ? "not-allowed" : "pointer",
                color: age === 120 ? INK_MUTED : GOLD_DEEP,
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* SVG Map and Calculations Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Side: SVG Diamond Chart */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid rgba(156, 122, 47, 0.16)",
            borderRadius: "12px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 16px rgba(156, 122, 47, 0.03)"
          }}
        >
          <div style={{ display: "flex", width: "100%", justifyItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
            <span style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
              <Compass size={16} color={GOLD} />
              North Indian Diamond Chart
            </span>
            <span style={{ fontSize: "11px", color: INK_MUTED }}>
              Lagna = {RASHI_NAMES[natalLagna - 1].split(" ")[0]}
            </span>
          </div>

          <svg width="220" height="220" viewBox="0 0 200 200">
            <rect x="0" y="0" width="200" height="200" fill="none" stroke="rgba(156, 122, 47, 0.3)" strokeWidth="1.5" rx="4" />
            {(Object.keys(HOUSE_PATHS) as Array<unknown> as number[]).map((h) => {
              const isMunthaHouse = h === munthaHouse;
              const isLagnaHouse = h === 1;
              const pathStr = HOUSE_PATHS[h as keyof typeof HOUSE_PATHS];
              const pos = HOUSE_LABEL_POS[h as keyof typeof HOUSE_LABEL_POS];
              
              // Calculate sign number for this house region
              const currentRashi = (natalLagna + h - 2) % 12 + 1;

              let fillColor = "none";
              let strokeColor = "rgba(156, 122, 47, 0.2)";
              let strokeWidth = "1";
              let className = "";

              if (isMunthaHouse) {
                className = "active-muntha-region";
              } else if (isLagnaHouse) {
                fillColor = "rgba(47, 125, 85, 0.04)";
                strokeColor = "rgba(47, 125, 85, 0.3)";
              }

              return (
                <g key={h}>
                  <path
                    d={pathStr}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className={className}
                    style={{ transition: "all 300ms ease" }}
                  />
                  {/* Render Rashi Sign Index inside */}
                  <text
                    x={pos.x}
                    y={pos.y - 6}
                    fill={isMunthaHouse ? GOLD_DEEP : INK_MUTED}
                    fontSize="9.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {currentRashi}
                  </text>
                  {/* Render House Identifier or Munthā tag */}
                  <text
                    x={pos.x}
                    y={pos.y + 6}
                    fill={isMunthaHouse ? GOLD_DEEP : "rgba(77, 65, 51, 0.45)"}
                    fontSize="7"
                    fontWeight={isMunthaHouse ? "bold" : "normal"}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {isMunthaHouse ? "MUNTHA" : `H${h}`}
                  </text>
                </g>
              );
            })}
          </svg>
          <div style={{ fontSize: "11px", color: INK_MUTED, alignSelf: "flex-start", width: "100%", borderTop: "1px solid rgba(156, 122, 47, 0.08)", paddingTop: "8px", lineHeight: "1.35" }}>
            * <strong>Outer numbers</strong> are sign indexes; <strong>H1 to H12</strong> are houses. H1 is always the center top diamond (Lagna).
          </div>
        </div>

        {/* Right Side: Math Details & Mappings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          
          {/* Arithmetic Solver Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "10px", padding: "18px", boxShadow: "0 2px 8px rgba(156,122,47,0.01)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Mathematical Advancement:
            </span>
            <div style={{ margin: "10px 0", fontSize: "13px" }}>
              <div style={{ fontFamily: "monospace", color: INK_SECONDARY, marginBottom: "4px" }}>
                Formula: Munthā House = (Completed Age % 12) + 1
              </div>
              <div style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: 700, color: GOLD_DEEP }}>
                ({age} Completed Years % 12) + 1 = House {munthaHouse}
              </div>
            </div>
            {isCycleReturn && (
              <div
                style={{
                  background: "rgba(47, 125, 85, 0.08)",
                  border: `1px solid ${GREEN}`,
                  color: GREEN,
                  borderRadius: "6px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  animation: "pulse 1.5s infinite"
                }}
              >
                <Award size={16} />
                Cycle Return / Renewal Year (Age {age})! Munthā returns to the Natal Lagna.
              </div>
            )}
          </div>

          {/* Active House Meanings */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.12)", borderRadius: "10px", padding: "18px", boxShadow: "0 2px 8px rgba(156,122,47,0.01)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Active House Theme (House {munthaHouse}):
            </span>
            <h4 style={{ fontSize: "16px", fontWeight: 700, color: INK_PRIMARY, margin: "8px 0 4px" }}>
              Rashi Sign: {RASHI_NAMES[munthaSign - 1]}
            </h4>
            <p style={{ fontSize: "13px", lineHeight: "1.5", color: INK_SECONDARY, margin: 0 }}>
              {HOUSE_THEMES[munthaHouse]}
            </p>
            
            {/* Highlight caution for 6/8/12 */}
            {[6, 8, 12].includes(munthaHouse) && (
              <div
                style={{
                  marginTop: "10px",
                  background: "rgba(217, 119, 6, 0.08)",
                  border: `1px solid ${AMBER}`,
                  color: AMBER,
                  borderRadius: "6px",
                  padding: "8px 10px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <ShieldAlert size={15} />
                Munthā is in a challenging house. Apply M19 Non-Fatalism protocol.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Age Path Scroller Timeline Carousel */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.12)",
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 2px 8px rgba(156,122,47,0.01)"
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", display: "block", marginBottom: "10px", letterSpacing: "0.05em" }}>
          Munthā Progressed Path (Next 10 Years):
        </span>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {getTimelineItems().map((item, idx) => {
            const isCurrent = idx === 0;
            return (
              <div
                key={idx}
                style={{
                  flex: "0 0 115px",
                  padding: "10px",
                  borderRadius: "8px",
                  border: `1.5px solid ${isCurrent ? GOLD : item.isReturn ? GREEN : "rgba(156, 122, 47, 0.12)"}`,
                  background: isCurrent ? "rgba(156, 122, 47, 0.05)" : item.isReturn ? "rgba(47, 125, 85, 0.03)" : "none",
                  textAlign: "center",
                  fontSize: "12px",
                  transition: "all 200ms ease"
                }}
              >
                <div style={{ fontWeight: 700, color: isCurrent ? GOLD_DEEP : INK_SECONDARY }}>Age {item.age}</div>
                <div style={{ fontSize: "11px", color: INK_MUTED, margin: "2px 0" }}>House {item.house}</div>
                <div style={{ fontWeight: 600, color: isCurrent ? GOLD_DEEP : GOLD, fontSize: "10.5px" }}>
                  {RASHI_NAMES[item.sign - 1].split(" ")[0]}
                </div>
                {item.isReturn && (
                  <div style={{ fontSize: "8px", fontWeight: "bold", color: GREEN, marginTop: "2px", textTransform: "uppercase" }}>
                    ★ Renewal
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* M19 Counseling Dojo Drill */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 4px 16px rgba(156, 122, 47, 0.02)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Layers size={18} color={GOLD} />
          <div>
            <span style={{ fontWeight: 700, color: GOLD_DEEP, fontSize: "15px" }}>M19 Counseling Dojo Drill</span>
            <p style={{ fontSize: "12px", color: INK_MUTED, margin: 0 }}>
              Practice the counseling reframe when the client presents fear of a difficult Munthā house.
            </p>
          </div>
        </div>

        <div
          style={{
            background: "rgba(156, 122, 47, 0.04)",
            borderLeft: `4px solid ${GOLD}`,
            padding: "12px 14px",
            fontSize: "13.5px",
            lineHeight: "1.5",
            fontStyle: "italic",
            color: INK_SECONDARY,
            borderRadius: "0 8px 8px 0"
          }}
        >
          <strong>Client:</strong> "{DOJO_QUESTION.clientQuery}"
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DOJO_QUESTION.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const borderCol = isSelected ? (opt.isCorrect ? GREEN : RED) : "rgba(156, 122, 47, 0.15)";
            const bgCol = isSelected ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff";
            
            return (
              <button
                key={idx}
                onClick={() => handleDojoAnswer(idx, opt.isCorrect, opt.feedback)}
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

        {selectedOption !== null && (
          <div
            style={{
              background: DOJO_QUESTION.options[selectedOption].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
              border: `1px solid ${DOJO_QUESTION.options[selectedOption].isCorrect ? GREEN : RED}`,
              color: DOJO_QUESTION.options[selectedOption].isCorrect ? GREEN : RED,
              borderRadius: "8px",
              padding: "12px 14px",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            {DOJO_QUESTION.options[selectedOption].isCorrect ? (
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            ) : (
              <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            )}
            <span>{dojoFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
}
