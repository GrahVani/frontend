"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

interface Scenario {
  id: string;
  name: string;
  desc: string;
  chartDetails: string;
  planets: { name: string; glyph: string; sign: string; deg: number; color: string; cx: number; cy: number }[];
  yogasToIdentify: { id: string; name: string; desc: string; connection: [string, string] }[];
  timingCategories: { yogaId: string; correctCategory: "vartamana" | "bhavi" | "purna" }[];
  verdictOptions: { text: string; isCorrect: boolean; feedback: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "career",
    name: "Scenario A: Career Promotion Opportunity",
    desc: "A client seeks counsel regarding a potential major promotion. They feel anxious about corporate politics.",
    chartDetails: "Varṣaphala lagna in Leo. Sun (10°) and Jupiter (15°) are in Leo. Mars (18°) and Saturn (12°) are in Leo.",
    planets: [
      { name: "Sun", glyph: "☉", sign: "Leo", deg: 10, color: GOLD, cx: 180, cy: 110 },
      { name: "Jupiter", glyph: "♃", sign: "Leo", deg: 15, color: GREEN, cx: 200, cy: 90 },
      { name: "Mars", glyph: "♂", sign: "Leo", deg: 18, color: RED, cx: 220, cy: 110 },
      { name: "Saturn", glyph: "♄", sign: "Leo", deg: 12, color: INK_PRIMARY, cx: 200, cy: 130 },
    ],
    yogasToIdentify: [
      {
        id: "sun_jupiter",
        name: "Sun-Jupiter Conjunction (Sajjana)",
        desc: "Sun and Jupiter merge energies in Leo. They form a friendly same-sign yuti.",
        connection: ["Sun", "Jupiter"]
      },
      {
        id: "mars_saturn",
        name: "Mars-Saturn Conjunction (Manaau)",
        desc: "Mars and Saturn occupy Leo. They form an enemy same-sign yuti.",
        connection: ["Mars", "Saturn"]
      }
    ],
    timingCategories: [
      { yogaId: "sun_jupiter", correctCategory: "vartamana" },
      { yogaId: "mars_saturn", correctCategory: "purna" }
    ],
    verdictOptions: [
      {
        text: "The Sun-Jupiter conjunction in Leo (Vartamāna Ithasāla) promises immediate career expansion and leadership support early in the year. The Mars-Saturn friction (Eesarphā) represents previous structural road blocks that are already separating; expect political tensions to wind down rather than escalate.",
        isCorrect: true,
        feedback: "Correct! This provides balanced, non-catastrophic timing. It points out the immediate positive opportunity while framing the conflict as separating (Eesarphā), which relieves client anxiety without making absolute claims."
      },
      {
        text: "The Mars-Saturn conjunction is a terrible omen of conflict. Even though Sun and Jupiter are together, the presence of Mars and Saturn in Leo will completely ruin your reputation. I advise declining the promotion and performing daily protective mantras to avoid bankruptcy.",
        isCorrect: false,
        feedback: "Incorrect. This violates the M19 defearmongering protocol. It catastrophizes a single bad factor (Mars-Saturn) and ignores the fact that it is separating (Eesarphā) and that a highly supportive Sun-Jupiter Ithasāla is present."
      },
      {
        text: "Sun and Jupiter guarantee you will become the CEO by next month. The Mars-Saturn aspect doesn't matter at all because Jupiter overrides everything in Leo.",
        isCorrect: false,
        feedback: "Incorrect. This is over-promising and ignores the real tension indicated by Mars and Saturn. Astrology requires balancing both factors honestly."
      }
    ]
  },
  {
    id: "relationship",
    name: "Scenario B: Relationship Friction",
    desc: "A client asks about tension in their marriage. They are worried about communication breakdown.",
    chartDetails: "Moon (22°) and Venus (27°) are in Virgo. Mercury (15°) is in Libra, flanked by Mars (12°) in Virgo and Saturn (18°) in Scorpio.",
    planets: [
      { name: "Moon", glyph: "☽", sign: "Virgo", deg: 22, color: GOLD, cx: 120, cy: 150 },
      { name: "Venus", glyph: "♀", sign: "Virgo", deg: 27, color: GREEN, cx: 140, cy: 170 },
      { name: "Mercury", glyph: "☿", sign: "Libra", deg: 15, color: AMBER, cx: 200, cy: 110 },
      { name: "Mars", glyph: "♂", sign: "Virgo", deg: 12, color: RED, cx: 100, cy: 110 },
      { name: "Saturn", glyph: "♄", sign: "Scorpio", deg: 18, color: INK_PRIMARY, cx: 300, cy: 110 },
    ],
    yogasToIdentify: [
      {
        id: "moon_venus",
        name: "Moon-Venus Conjunction (Ithasāla)",
        desc: "The Moon and Venus apply to a conjunction in Virgo within orb.",
        connection: ["Moon", "Venus"]
      },
      {
        id: "mercury_besieged",
        name: "Mercury Besieged (Induvāra)",
        desc: "Mercury in Libra is flanked by Mars in Virgo and Saturn in Scorpio, creating a besieged container.",
        connection: ["Mars", "Saturn"]
      }
    ],
    timingCategories: [
      { yogaId: "moon_venus", correctCategory: "vartamana" },
      { yogaId: "mercury_besieged", correctCategory: "purna" }
    ],
    verdictOptions: [
      {
        text: "The Moon-Venus Ithasāla brings emotional closeness and shared goals in your relationship, showing momentum towards harmony. However, Mercury is besieged between Mars and Saturn (Induvāra), suggesting you will feel communication pressure and constraint. This calls for deliberate patience and clear discussion, rather than assuming the relationship is broken.",
        isCorrect: true,
        feedback: "Correct! This honors the supportive emotional momentum (Moon-Venus) while honestly pointing out the communication strain (Induvāra) as a constructive discipline warning rather than a catastrophe."
      },
      {
        text: "Mercury is besieged, which means all communication is doomed to fail. Your spouse will stop talking to you entirely, and this Induvāra yoga guarantees divorce within 6 months. I recommend a expensive gemstone to save the marriage.",
        isCorrect: false,
        feedback: "Incorrect. This is high-fear catastrophizing. It violates the M19 framework by predicting definitive divorce from a single factor and selling remedies under fear."
      },
      {
        text: "Moon and Venus guarantee absolute bliss in your marriage. Don't worry about Mercury; it is just a minor planet and has no impact compared to the Moon and Venus.",
        isCorrect: false,
        feedback: "Incorrect. This ignores the real communication challenge indicated by the besieged Mercury. Clients need honest, practical guidance."
      }
    ]
  }
];

export function TajikaYogasApplicationWizard() {
  const [step, setStep] = useState(1);
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [isChartCast, setIsChartCast] = useState(false);
  const [identifiedYogas, setIdentifiedYogas] = useState<string[]>([]);
  const [timingClassifications, setTimingClassifications] = useState<Record<string, "vartamana" | "bhavi" | "purna">>({});
  const [selectedVerdictIdx, setSelectedVerdictIdx] = useState<number | null>(null);

  const activeScenario = SCENARIOS[selectedScenarioIdx];

  const handleCastChart = () => {
    setIsChartCast(true);
    setStep(2);
  };

  const handleIdentifyYoga = (yogaId: string) => {
    if (identifiedYogas.includes(yogaId)) {
      setIdentifiedYogas(identifiedYogas.filter((id) => id !== yogaId));
    } else {
      setIdentifiedYogas([...identifiedYogas, yogaId]);
    }
  };

  const handleClassifyTiming = (yogaId: string, category: "vartamana" | "bhavi" | "purna") => {
    setTimingClassifications({
      ...timingClassifications,
      [yogaId]: category
    });
  };

  const handleReset = () => {
    setStep(1);
    setIsChartCast(false);
    setIdentifiedYogas([]);
    setTimingClassifications({});
    setSelectedVerdictIdx(null);
  };

  const allYogasIdentified = activeScenario.yogasToIdentify.every((y) => identifiedYogas.includes(y.id));
  const allTimingCorrect = activeScenario.timingCategories.every(
    (tc) => timingClassifications[tc.yogaId] === tc.correctCategory
  );

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
        maxWidth: "860px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-yogas-application-wizard"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          Tājika Yoga Synthesis Wizard
        </h3>
        <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Practice the 4-step workflow to cast a return, identify active yogas, classify timing, and issue a verdict</span>
      </div>

      {/* Progress Wizard Header */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "10px" }}>
        {[
          { num: 1, label: "1. Cast Return" },
          { num: 2, label: "2. Identify Yogas" },
          { num: 3, label: "3. Classify Timing" },
          { num: 4, label: "4. Issue Verdict" }
        ].map((s) => (
          <div
            key={s.num}
            style={{
              color: step === s.num ? GOLD : step > s.num ? GREEN : INK_MUTED,
              fontWeight: step === s.num ? 900 : 500,
              borderBottom: `2.5px solid ${step === s.num ? GOLD : step > s.num ? GREEN : "transparent"}`,
              paddingBottom: "4px",
              flex: 1,
              textAlign: "center"
            }}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Step Panels */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "16px", borderRadius: "8px", minHeight: "180px" }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", color: GOLD, margin: "0" }}>Step 1: Choose Scenario</h4>
            <p style={{ fontSize: "11px", color: INK_SECONDARY, margin: "0" }}>
              Select a client case study to cast the annual return chart:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              {SCENARIOS.map((scen, idx) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setSelectedScenarioIdx(idx)}
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    borderRadius: "6px",
                    border: `1.5px solid ${selectedScenarioIdx === idx ? GOLD : HAIRLINE}`,
                    background: selectedScenarioIdx === idx ? "rgba(156, 122, 47, 0.04)" : "#ffffff",
                    color: INK_PRIMARY,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <strong style={{ color: GOLD, fontSize: "11.5px", display: "block" }}>{scen.name}</strong>
                  <span style={{ fontSize: "10px", color: INK_SECONDARY, display: "block", marginTop: "2px" }}>{scen.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="button"
                onClick={handleCastChart}
                style={{
                  background: GOLD,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Cast Annual Return ➔
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", color: GOLD, margin: "0" }}>Step 2: Identify Active Tājika Yogas</h4>
            <p style={{ fontSize: "11px", color: INK_SECONDARY, margin: "0" }}>
              Click on the connecting lines or items below to verify active aspects and conjunctions.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", alignItems: "center", marginTop: "4px" }}>
              {/* Circular SVG chart wheel */}
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "10px", background: "rgba(0,0,0,0.01)", display: "flex", justifyContent: "center" }}>
                <svg viewBox="0 0 400 240" width="100%" height="180">
                  <circle cx="200" cy="120" r="80" fill="none" stroke={HAIRLINE} strokeWidth="1.5" />
                  <circle cx="200" cy="120" r="55" fill="none" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="3,3" />
                  <text x="200" y="124" textAnchor="middle" fill={GOLD_DEEP} fontWeight="bold" fontSize="9" letterSpacing="0.05em">VARṢAPHALA</text>
                  
                  {/* Aspect lines */}
                  {activeScenario.yogasToIdentify.map((y) => {
                    const pA = activeScenario.planets.find((p) => p.name === y.connection[0]);
                    const pB = activeScenario.planets.find((p) => p.name === y.connection[1]);
                    if (pA && pB) {
                      const isIdentified = identifiedYogas.includes(y.id);
                      return (
                        <line
                          key={y.id}
                          x1={pA.cx}
                          y1={pA.cy}
                          x2={pB.cx}
                          y2={pB.cy}
                          stroke={isIdentified ? GOLD : `${INK_MUTED}80`}
                          strokeWidth={isIdentified ? 2.5 : 1.5}
                          strokeDasharray={isIdentified ? "none" : "2,2"}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleIdentifyYoga(y.id)}
                        />
                      );
                    }
                    return null;
                  })}

                  {/* Planets */}
                  {activeScenario.planets.map((p) => (
                    <g key={p.name} style={{ cursor: "pointer" }}>
                      <circle cx={p.cx} cy={p.cy} r="14" fill="#ffffff" stroke={p.color} strokeWidth="1.5" />
                      <text x={p.cx} y={p.cy + 4} textAnchor="middle" fill={p.color} fontWeight="bold" fontSize="12">{p.glyph}</text>
                      <text x={p.cx} y={p.cy - 16} textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="bold">{p.name}</text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Identified check cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {activeScenario.yogasToIdentify.map((y) => {
                  const isIdentified = identifiedYogas.includes(y.id);
                  return (
                    <button
                      key={y.id}
                      type="button"
                      onClick={() => handleIdentifyYoga(y.id)}
                      style={{
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: `1.5px solid ${isIdentified ? GOLD : HAIRLINE}`,
                        background: isIdentified ? "rgba(156, 122, 47, 0.04)" : "#ffffff",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "11px" }}>
                        <strong style={{ color: GOLD }}>{y.name}</strong>
                        <span style={{ color: isIdentified ? GREEN : RED, fontWeight: 700 }}>{isIdentified ? "Identified" : "Not Found"}</span>
                      </div>
                      <span style={{ fontSize: "9.5px", color: INK_SECONDARY }}>{y.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: "transparent",
                  color: INK_PRIMARY,
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!allYogasIdentified}
                style={{
                  background: allYogasIdentified ? GOLD : INK_MUTED,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 14px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: allYogasIdentified ? "pointer" : "not-allowed"
                }}
              >
                Classify Timing
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", color: GOLD, margin: "0" }}>Step 3: Classify Aspect Timing</h4>
            <p style={{ fontSize: "11px", color: INK_SECONDARY, margin: "0" }}>
              Sort the identified yogas into Vartamāna (applying) or Pūrṇa/Eesarphā (separating).
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
              {activeScenario.yogasToIdentify.map((y) => {
                const currentSel = timingClassifications[y.id];
                return (
                  <div key={y.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "10px", background: "#ffffff" }}>
                    <div>
                      <strong style={{ fontSize: "11px", color: GOLD }}>{y.name}</strong>
                      <span style={{ display: "block", fontSize: "9.5px", color: INK_MUTED }}>{y.desc}</span>
                    </div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[
                        { id: "vartamana", label: "Vartamāna (Present)" },
                        { id: "purna", label: "Pūrṇa (Completed)" }
                      ].map((cat) => {
                        const active = currentSel === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleClassifyTiming(y.id, cat.id as any)}
                            style={{
                              border: `1px solid ${active ? GOLD : HAIRLINE}`,
                              background: active ? GOLD : "transparent",
                              color: active ? "#ffffff" : INK_SECONDARY,
                              borderRadius: "4px",
                              padding: "4px 8px",
                              fontSize: "10px",
                              fontWeight: 700,
                              cursor: "pointer"
                            }}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: "transparent",
                  color: INK_PRIMARY,
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!allTimingCorrect}
                style={{
                  background: allTimingCorrect ? GOLD : INK_MUTED,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 14px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: allTimingCorrect ? "pointer" : "not-allowed"
                }}
              >
                Issue Verdict
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h4 style={{ fontSize: "12px", color: GOLD, margin: "0" }}>Step 4: Issue Synthesis Verdict (M19 compliant)</h4>
            <p style={{ fontSize: "11px", color: INK_SECONDARY, margin: "0" }}>
              Construct the client's yearly forecast. Select the correct M19 framework statement:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
              {activeScenario.verdictOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedVerdictIdx(i)}
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1.5px solid ${selectedVerdictIdx === i ? (opt.isCorrect ? GREEN : RED) : HAIRLINE}`,
                    background: selectedVerdictIdx === i ? (opt.isCorrect ? `${GREEN}08` : `${RED}08`) : "#ffffff",
                    color: INK_PRIMARY,
                    fontSize: "11px",
                    lineHeight: 1.4,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <strong>Statement {String.fromCharCode(65 + i)}:</strong> {opt.text}
                </button>
              ))}
            </div>

            {selectedVerdictIdx !== null && (
              <div style={{ 
                padding: "10px", 
                borderRadius: "6px", 
                background: activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? `${GREEN}12` : `${RED}12`,
                border: `1px solid ${activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? GREEN : RED}`,
                color: activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? GREEN : RED,
                fontSize: "11px"
              }}>
                <strong>{activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? "✓ M19 Framework Compliant" : "✗ Framework Violation"}</strong>
                <p style={{ margin: "2px 0 0", color: INK_PRIMARY }}>{activeScenario.verdictOptions[selectedVerdictIdx].feedback}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  background: "transparent",
                  color: INK_PRIMARY,
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: "4px",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Back
              </button>
              {selectedVerdictIdx !== null && activeScenario.verdictOptions[selectedVerdictIdx].isCorrect && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    background: GREEN,
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "6px 14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  Complete Capstone Case!
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
