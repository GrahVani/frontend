"use client";

import { useState } from "react";
import { HelpCircle, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_LIGHT = "rgba(156, 122, 47, 0.08)";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";

interface KandaDetail {
  num: number;
  name: string;
  theme: string;
  narrative: string;
  gridRow: number;
  gridCol: number;
}

// Mapping of Kandas to South Indian chart boxes (clockwise grid boundary)
const KANDAS: KandaDetail[] = [
  { num: 1, name: "General / Identity", theme: "Self, family", narrative: "The native is born under a planetary configuration that brings early struggles followed by rise in status.", gridRow: 1, gridCol: 2 },
  { num: 2, name: "Wealth", theme: "Finances, speech", narrative: "Accumulation of family wealth will stabilize after the 28th year through independent trade.", gridRow: 1, gridCol: 3 },
  { num: 3, name: "Siblings", theme: "Brothers, sisters", narrative: "The native has two younger siblings. Cordial relations will be maintained across distance.", gridRow: 1, gridCol: 4 },
  { num: 4, name: "Mother / Home", theme: "Mother, property", narrative: "Mother of virtuous character. Property matters resolve in mid-life, bringing comfort.", gridRow: 2, gridCol: 4 },
  { num: 5, name: "Children", theme: "Offspring, intellect", narrative: "Blessed with two children, both attaining high learning and professional success.", gridRow: 3, gridCol: 4 },
  { num: 6, name: "Obstacles / Health", theme: "Enemies, debts, health", narrative: "No major chronic illnesses, but minor digestive sensitivity will require discipline after 40.", gridRow: 4, gridCol: 4 },
  { num: 7, name: "Marriage", theme: "Spouse, partnership", narrative: "Marriage in the 26th/27th year to a spouse from the southern direction of sharp intellect.", gridRow: 4, gridCol: 3 },
  { num: 8, name: "Death / Hidden", theme: "Lifespan, legacy", narrative: "A long and healthy life is indicated. Transition occurs peacefully in the 81st year.", gridRow: 4, gridCol: 2 },
  { num: 9, name: "Fortune / Dharma", theme: "Father, spirituality", narrative: "Father enjoys a respected position. Native possesses deep spiritual inclinations.", gridRow: 4, gridCol: 1 },
  { num: 10, name: "Career", theme: "Profession, reputation", narrative: "Professional life centered on teaching, advice, or administration, with public honors post-50.", gridRow: 3, gridCol: 1 },
  { num: 11, name: "Gains", theme: "Elder siblings, profits", narrative: "Steady streams of revenue from multiple sources. Friends yield supportive partnerships.", gridRow: 2, gridCol: 1 },
  { num: 12, name: "Losses / Moksha", theme: "Expenditure, travel", narrative: "High expenditure on charitable deeds. Foreign travel is indicated in later years.", gridRow: 1, gridCol: 1 }
];

interface ThumbprintPattern {
  id: string;
  label: string;
  categories: string;
  drawing: React.ReactNode;
}

export function AgastyaFlow() {
  const [activeTab, setActiveTab] = useState<"flow" | "dojo">("flow");
  const [step, setStep] = useState<number>(1);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [yesNoAnswers, setYesNoAnswers] = useState<Record<string, "Yes" | "No">>({});
  const [activeKanda, setActiveKanda] = useState<KandaDetail | null>(null);

  // Define SVG patterns for thumbprints
  const THUMBPRINT_PATTERNS: ThumbprintPattern[] = [
    {
      id: "tp-1",
      label: "Shankha Loop (Conch shell whorl)",
      categories: "32-A to 32-D",
      drawing: (
        <svg viewBox="0 0 100 100" width="60" height="60">
          <circle cx="50" cy="50" r="45" fill="none" stroke={GOLD} strokeWidth="1.5" />
          {/* Loop lines */}
          <path d="M 50,85 C 50,40 20,40 20,60 C 20,75 35,75 40,60 C 45,45 35,30 50,30 C 65,30 80,45 80,60 C 80,85 50,85 50,85" fill="none" stroke={GOLD_DEEP} strokeWidth="2" />
          <path d="M 50,75 C 50,48 30,48 30,60 C 30,68 40,68 44,60 C 48,52 42,40 50,40" fill="none" stroke={GOLD_DEEP} strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: "tp-2",
      label: "Chakra Whorl (Spiral core)",
      categories: "07-A to 07-E",
      drawing: (
        <svg viewBox="0 0 100 100" width="60" height="60">
          <circle cx="50" cy="50" r="45" fill="none" stroke={GOLD} strokeWidth="1.5" />
          {/* Spiral lines */}
          <path d="M 50,50 A 5,5 0 0,0 55,45 A 10,10 0 0,0 45,40 A 15,15 0 0,0 60,55 A 20,20 0 0,0 40,60 A 25,25 0 0,0 65,35 A 30,30 0 0,0 35,65" fill="none" stroke={GOLD_DEEP} strokeWidth="2" />
        </svg>
      )
    },
    {
      id: "tp-3",
      label: "Lotus Leaf (Arch layout)",
      categories: "88-A to 88-C",
      drawing: (
        <svg viewBox="0 0 100 100" width="60" height="60">
          <circle cx="50" cy="50" r="45" fill="none" stroke={GOLD} strokeWidth="1.5" />
          {/* Arch lines */}
          <path d="M 15,80 Q 50,20 85,80" fill="none" stroke={GOLD_DEEP} strokeWidth="2" />
          <path d="M 25,80 Q 50,35 75,80" fill="none" stroke={GOLD_DEEP} strokeWidth="1.7" />
          <path d="M 35,80 Q 50,50 65,80" fill="none" stroke={GOLD_DEEP} strokeWidth="1.3" />
        </svg>
      )
    }
  ];

  const [thumbPrint, setThumbPrint] = useState<ThumbprintPattern>(THUMBPRINT_PATTERNS[0]);

  // Questions to narrow down leaf
  const QUESTIONS = [
    { id: "q1", text: "Are you the eldest sibling in your family?", expect: "Yes" },
    { id: "q2", text: "Does your father's name carry a solar meaning (e.g. Surya, Bhanu)?", expect: "Yes" },
    { id: "q3", text: "Is Saturn placed in the 7th house of your natal chart?", expect: "Yes" }
  ];

  // Dojo state
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showDojoFeedback, setShowDojoFeedback] = useState<boolean>(false);

  const handleYesNo = (qid: string, val: "Yes" | "No") => {
    setYesNoAnswers((prev) => ({ ...prev, [qid]: val }));
    const answeredCount = Object.keys(yesNoAnswers).length + 1;
    if (answeredCount === QUESTIONS.length) {
      setStep(3); // Leaf matched!
    }
  };

  const currentUnanswered = QUESTIONS.find((q) => !yesNoAnswers[q.id]);

  const resetFlow = () => {
    setStep(1);
    setYesNoAnswers({});
    setActiveKanda(null);
  };

  const handleDojoSelect = (idx: number) => {
    setSelectedChoice(idx);
    setShowDojoFeedback(true);
  };

  const resetDojo = () => {
    setSelectedChoice(null);
    setShowDojoFeedback(false);
  };

  const DOJO_QUESTION = {
    text: "A client states: 'Agastya is the great Tamil sage, so Agastya Nāḍī is inherently more authoritative and reliable than other sub-lineages at Vaitheeswarankoil, such as Śiva-Vāk or Kaushika.' How do you guide them?",
    choices: [
      {
        text: "Agree with the client. Since Agastya founded the Sangam literature, his sub-lineage outranks all others.",
        type: "mystification",
        feedback: "Incorrect. This is Mystification. Wider cultural prestige does not make one Nāḍī sub-lineage superior. All sub-lineages operate under equal authority."
      },
      {
        text: "Disagree. Explain that all sub-lineages (Agastya, Śiva-Vāk, Kaushika) operate under equal authority. None outranks the other, and cross-sage attributions are normal in diverse classical traditions.",
        type: "balanced",
        feedback: "Correct! This is the 'one-true-school' refusal applied within a centre. Each lineage is independent, and we must refuse any superiority ranking."
      },
      {
        text: "Tell the client that since all palm-leaf readings are unscientific, discussing authority between them is meaningless.",
        type: "scoffing",
        feedback: "Incorrect. This is Scoffing. It uses a lack of scientific verification (Layer C) to dismiss the client's question and ignore the documented lineage structures (Layer A)."
      }
    ]
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 246, 0.8)",
        border: "1px solid rgba(156, 122, 47, 0.25)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto"
      }}
      data-interactive="agastya-flow"
    >
      {/* Header Banner */}
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "12px", marginBottom: "20px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 20 — Chapter 2 — Lesson 2
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 700, color: INK_PRIMARY, margin: "4px 0 0", letterSpacing: "-0.01em" }}>
          Agastya Nāḍī Consultation Conduit
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0" }}>
          Trace the thumb-print-based retrieval flow of the South-Indian Tamil Nāḍī, explore the 12-kāṇḍa map, and test lineage-equality reasoning.
        </p>
      </div>

      {/* Tab Menu */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("flow")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "flow" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "flow" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Consultation Simulator
        </button>
        <button
          onClick={() => setActiveTab("dojo")}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            background: activeTab === "dojo" ? GOLD : "rgba(156, 122, 47, 0.06)",
            color: activeTab === "dojo" ? "#fff" : GOLD_DEEP,
            border: "none",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Authority-Ranking Dojo
        </button>
      </div>

      {activeTab === "flow" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "24px", minHeight: "440px" }}>
          {/* Left Panel: Step Flow */}
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
              Consultation Pipeline
            </span>

            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Client Gender (Print Convention):</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => setGender("male")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: `1.5px solid ${gender === "male" ? GOLD : "rgba(156,122,47,0.15)"}`,
                        background: gender === "male" ? "rgba(156,122,47,0.06)" : "#fff",
                        color: INK_PRIMARY,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Male (Right Thumb)
                    </button>
                    <button
                      onClick={() => setGender("female")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "6px",
                        border: `1.5px solid ${gender === "female" ? GOLD : "rgba(156,122,47,0.15)"}`,
                        background: gender === "female" ? "rgba(156,122,47,0.06)" : "#fff",
                        color: INK_PRIMARY,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      Female (Left Thumb)
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: INK_SECONDARY }}>Click a Thumb-print Pattern to select:</label>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
                    {THUMBPRINT_PATTERNS.map((tp) => (
                      <button
                        key={tp.id}
                        onClick={() => setThumbPrint(tp)}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: `1.5px solid ${thumbPrint.id === tp.id ? GOLD : "rgba(156,122,47,0.15)"}`,
                          background: thumbPrint.id === tp.id ? "rgba(156,122,47,0.04)" : "#fff",
                          cursor: "pointer"
                        }}
                      >
                        {tp.drawing}
                        <span style={{ fontSize: "11px", fontWeight: "bold", color: INK_PRIMARY, textAlign: "center" }}>
                          {tp.label.split(" ")[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px",
                    borderRadius: "6px",
                    background: GOLD,
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  Retrieve Palm Leaf Bundle <ArrowRight size={14} />
                </button>
              </div>
            )}

            {step === 2 && currentUnanswered && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>NARROWING BUNDLE MANUSCRIPTS</span>
                
                <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "8px", padding: "16px" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "11px", color: INK_MUTED, fontWeight: 700, letterSpacing: "0.05em" }}>
                    Nāḍī Reader Question:
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: INK_PRIMARY }}>
                    "{currentUnanswered.text}"
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => handleYesNo(currentUnanswered.id, "Yes")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "6px",
                      background: GREEN,
                      color: "#fff",
                      border: "none",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleYesNo(currentUnanswered.id, "No")}
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "6px",
                      background: RED,
                      color: "#fff",
                      border: "none",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: GREEN, display: "flex", alignItems: "center", gap: "4px" }}>
                  <CheckCircle2 size={14} /> LEAF MATCH FOUND & CONFIRMED
                </span>

                <div style={{ border: `1px solid ${GOLD}`, borderRadius: "8px", padding: "14px", background: "#fff" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "11px", color: GOLD_DEEP, fontWeight: 700 }}>MATCH PARAMETERS</p>
                  <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "12.5px", color: INK_PRIMARY, display: "flex", flexDirection: "column", gap: "4px" }}>
                    <li><strong>Thumbprint Pattern:</strong> {thumbPrint.label}</li>
                    <li><strong>Category:</strong> {thumbPrint.categories}</li>
                    <li><strong>Lineage Status:</strong> Standard Vaitheeswarankoil Agastya Leaf</li>
                  </ul>
                </div>

                <p style={{ fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.45" }}>
                  The leaf contains <strong>12 chapters (kāṇḍas)</strong>. Select any house box on the South Indian chart layout on the right to read.
                </p>

                <button
                  onClick={resetFlow}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    background: GOLD,
                    color: "#fff",
                    border: "none",
                    fontWeight: 600,
                    cursor: "pointer"
                  }}
                >
                  Match New thumb-print
                </button>
              </div>
            )}
          </div>

          {/* Right Panel: South Indian Chart Grid */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {step === 3 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
                  South Indian Chart Map (Click Houses)
                </span>

                {/* 4x4 Grid Representation of South Indian Chart */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gridTemplateRows: "repeat(4, 1fr)",
                    gap: "4px",
                    background: GOLD_LIGHT,
                    border: `1.5px solid ${GOLD}`,
                    borderRadius: "8px",
                    padding: "6px",
                    aspectRatio: "1/1"
                  }}
                >
                  {/* Row 1 */}
                  {/* Pisces / H12 */}
                  {renderKandaBox(12)}
                  {/* Aries / H1 */}
                  {renderKandaBox(1)}
                  {/* Taurus / H2 */}
                  {renderKandaBox(2)}
                  {/* Gemini / H3 */}
                  {renderKandaBox(3)}

                  {/* Row 2 */}
                  {/* Aquarius / H11 */}
                  {renderKandaBox(11)}
                  {/* Merged Center */}
                  <div style={{ gridColumn: "span 2", gridRow: "span 2", background: "#FAF6EB", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed rgba(156,122,47,0.15)" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD_DEEP, textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Vaithees<br />warankoil
                    </span>
                  </div>
                  {/* Cancer / H4 */}
                  {renderKandaBox(4)}

                  {/* Row 3 */}
                  {/* Capricorn / H10 */}
                  {renderKandaBox(10)}
                  {/* Leo / H5 */}
                  {renderKandaBox(5)}

                  {/* Row 4 */}
                  {/* Sagittarius / H9 */}
                  {renderKandaBox(9)}
                  {/* Scorpio / H8 */}
                  {renderKandaBox(8)}
                  {/* Libra / H7 */}
                  {renderKandaBox(7)}
                  {/* Virgo / H6 */}
                  {renderKandaBox(6)}
                </div>

                {activeKanda && (
                  <div
                    style={{
                      background: "#fff",
                      borderLeft: `3px solid ${GOLD}`,
                      padding: "12px",
                      borderRadius: "0 8px 8px 0",
                      boxShadow: "0 2px 8px rgba(156,122,47,0.05)"
                    }}
                  >
                    <h5 style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>
                      Kāṇḍa {activeKanda.num}: {activeKanda.name} ({activeKanda.theme})
                    </h5>
                    <p style={{ margin: 0, fontSize: "12px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                      {activeKanda.narrative}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: GOLD_DEEP }}>
                    Thumb-print Categorisation
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                    Tamil Nāḍī readers categorise client thumbprints (left for women, right for men) into one of the **134 patterns** before retrieving matching leaf bundles.
                  </p>
                </div>

                <div style={{ background: "#fff", border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "16px" }}>
                  <h4 style={{ margin: "0 0 8px", fontSize: "14px", fontWeight: 700, color: GOLD_DEEP }}>
                    Twelve Kāṇḍa Chapters
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: INK_SECONDARY, lineHeight: "1.5" }}>
                    Readings are structured into twelve chapters that correspond directly to the twelve houses of the horoscope (e.g. Kāṇḍa 7 represents Marriage, Kāṇḍa 10 represents Career).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Tab 2: Dojo */
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", minHeight: "440px" }}>
          <div style={{ background: "#FAF6EB", border: "1px solid rgba(156, 122, 47, 0.15)", borderRadius: "12px", padding: "20px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>
              Authority-Ranking Dojo
            </span>
            <p style={{ fontSize: "14.5px", color: INK_PRIMARY, fontWeight: 600, margin: "12px 0 20px" }}>
              {DOJO_QUESTION.text}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {DOJO_QUESTION.choices.map((c, idx) => {
                const isSelected = selectedChoice === idx;
                let borderColor = "rgba(156, 122, 47, 0.25)";
                let bg = "#fff";
                if (showDojoFeedback && isSelected) {
                  borderColor = c.type === "balanced" ? GREEN : RED;
                  bg = c.type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)";
                } else if (isSelected) {
                  borderColor = GOLD;
                  bg = "rgba(156,122,47,0.04)";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleDojoSelect(idx)}
                    style={{
                      textAlign: "left",
                      padding: "14px",
                      borderRadius: "8px",
                      border: `1.5px solid ${borderColor}`,
                      background: bg,
                      fontSize: "13.5px",
                      color: INK_PRIMARY,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px"
                    }}
                  >
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        border: `1.5px solid ${GOLD}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "bold",
                        background: isSelected ? GOLD : "transparent",
                        color: isSelected ? "#fff" : GOLD,
                        flexShrink: 0,
                        marginTop: "1px"
                      }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ lineHeight: "1.4" }}>{c.text}</span>
                  </button>
                );
              })}
            </div>

            {showDojoFeedback && selectedChoice !== null && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  borderRadius: "8px",
                  background: DOJO_QUESTION.choices[selectedChoice].type === "balanced" ? "rgba(47,125,85,0.06)" : "rgba(162,58,30,0.06)",
                  border: `1px solid ${DOJO_QUESTION.choices[selectedChoice].type === "balanced" ? GREEN : RED}`,
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start"
                }}
              >
                {DOJO_QUESTION.choices[selectedChoice].type === "balanced" ? (
                  <CheckCircle2 size={20} style={{ color: GREEN, flexShrink: 0 }} />
                ) : (
                  <AlertTriangle size={20} style={{ color: RED, flexShrink: 0 }} />
                )}
                <div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 700, color: DOJO_QUESTION.choices[selectedChoice].type === "balanced" ? GREEN : RED }}>
                    {DOJO_QUESTION.choices[selectedChoice].type === "balanced" ? "CORRECT REFUSAL" : "DOCTRINAL CONFLATION"}
                  </h4>
                  <p style={{ margin: 0, fontSize: "13.5px", color: INK_PRIMARY, lineHeight: "1.45" }}>
                    {DOJO_QUESTION.choices[selectedChoice].feedback}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  function renderKandaBox(num: number) {
    const kanda = KANDAS.find((k) => k.num === num) || KANDAS[0];
    const isSelected = activeKanda?.num === num;
    return (
      <button
        onClick={() => setActiveKanda(kanda)}
        style={{
          border: `1.5px solid ${isSelected ? GOLD : "rgba(156,122,47,0.15)"}`,
          background: isSelected ? GOLD : "#fff",
          color: isSelected ? "#fff" : INK_PRIMARY,
          borderRadius: "4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          padding: "2px",
          transition: "all 0.2s"
        }}
      >
        <span style={{ fontSize: "8px", fontWeight: "bold", color: isSelected ? "#FAF6EB" : GOLD_DEEP }}>
          K{num}
        </span>
        <span style={{ fontSize: "9px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%", textAlign: "center" }}>
          {kanda.name.split(" ")[0]}
        </span>
      </button>
    );
  }
}
