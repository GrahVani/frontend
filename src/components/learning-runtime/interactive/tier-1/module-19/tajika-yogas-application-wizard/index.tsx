"use client";

import { useState } from "react";
import { BookOpen, Check, X, HelpCircle, RefreshCw, Sparkles, Navigation } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";
const LIGHT_BG = "#FCFAF2";

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
      { name: "Jupiter", glyph: "♃", sign: "Leo", deg: 15, color: GREEN, cx: 200, cy: 80 },
      { name: "Mars", glyph: "♂", sign: "Leo", deg: 18, color: RED, cx: 220, cy: 110 },
      { name: "Saturn", glyph: "♄", sign: "Leo", deg: 12, color: INK_PRIMARY, cx: 200, cy: 140 },
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
      { name: "Moon", glyph: "☽", sign: "Virgo", deg: 22, color: GOLD, cx: 120, cy: 160 },
      { name: "Venus", glyph: "♀", sign: "Virgo", deg: 27, color: GREEN, cx: 140, cy: 180 },
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
        text: "Mercury is besieged, which means all communication is doomed to fail. Your spouse will stop talking to you entirely, and this Induvāra yoga guarantees divorce within 6 months. I recommend an expensive gemstone to save the marriage.",
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
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [hoveredYoga, setHoveredYoga] = useState<string | null>(null);

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
        gap: "16px"
      }}
      data-interactive="tajika-yogas-application-wizard"
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(156,122,47,0.15)", paddingBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Module 19 — Chapter 2 — Lesson 4
          </span>
          <h3 style={{ margin: "4px 0 0", fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Tājika Yoga Synthesis Wizard
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: "13.5px", color: INK_SECONDARY }}>
            Synthesize solar return timing, identify active yogas, classify time-horizons, and formulate a client verdict.
          </p>
        </div>
        
        {/* Universal Reset button */}
        {(step > 1 || isChartCast) && (
          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: `1px solid ${GOLD}`,
              color: GOLD_DEEP,
              borderRadius: "6px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              transition: "all 150ms ease"
            }}
          >
            <RefreshCw size={12} /> Restart Case
          </button>
        )}
      </div>

      {/* Progress Wizard Header */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "12px" }}>
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
              paddingBottom: "6px",
              flex: 1,
              textAlign: "center"
            }}
          >
            {s.label}
          </div>
        ))}
      </div>

      {/* Step Panels */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "20px", borderRadius: "8px" }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "14px", color: GOLD, margin: "0", fontWeight: 700, textTransform: "uppercase" }}>Step 1: Choose Scenario</h4>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "0" }}>
              Select a real-world client case study to cast the annual return chart and synthesize planetary inputs:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
              {SCENARIOS.map((scen, idx) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => setSelectedScenarioIdx(idx)}
                  style={{
                    textAlign: "left",
                    padding: "14px",
                    borderRadius: "8px",
                    border: `1.5px solid ${selectedScenarioIdx === idx ? GOLD : "rgba(156,122,47,0.2)"}`,
                    background: selectedScenarioIdx === idx ? "rgba(156, 122, 47, 0.04)" : "#ffffff",
                    color: INK_PRIMARY,
                    cursor: "pointer",
                    transition: "all 150ms ease"
                  }}
                >
                  <strong style={{ color: GOLD_DEEP, fontSize: "14px", display: "block" }}>{scen.name}</strong>
                  <span style={{ fontSize: "12.5px", color: INK_SECONDARY, display: "block", marginTop: "4px", lineHeight: "1.4" }}>{scen.desc}</span>
                </button>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
              <button
                type="button"
                onClick={handleCastChart}
                style={{
                  background: GOLD,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 20px",
                  fontSize: "12.5px",
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
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "14px", color: GOLD, margin: "0", fontWeight: 700, textTransform: "uppercase" }}>Step 2: Identify Active Tājika Yogas</h4>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "0" }}>
              Click on the aspect lines in the SVG chart wheel or select target buttons on the right to identify the correct configurations.
            </p>

            {/* Compute dynamic coordinates of planets */}
            {(() => {
              const SIGN_ORDER = [
                "Aries", "Taurus", "Gemini", "Cancer", 
                "Leo", "Virgo", "Libra", "Scorpio", 
                "Sagittarius", "Capricorn", "Aquarius", "Pisces"
              ];

              const planetsBySign: Record<string, typeof activeScenario.planets> = {};
              activeScenario.planets.forEach((p) => {
                if (!planetsBySign[p.sign]) {
                  planetsBySign[p.sign] = [];
                }
                planetsBySign[p.sign].push(p);
              });

              Object.keys(planetsBySign).forEach((sign) => {
                planetsBySign[sign].sort((a, b) => a.deg - b.deg);
              });

              const planetsWithCoords = activeScenario.planets.map((p) => {
                const signIdx = SIGN_ORDER.indexOf(p.sign);
                const siblings = planetsBySign[p.sign];
                const siblingIdx = siblings.findIndex((sib) => sib.name === p.name);
                const N = siblings.length;

                const centerAngle = -75 + signIdx * 30;

                let angle = centerAngle;
                if (N > 1) {
                  const sectorSpan = 26; // degrees
                  const startAngle = centerAngle - sectorSpan / 2;
                  const step = sectorSpan / (N - 1);
                  angle = startAngle + siblingIdx * step;
                }

                let radius = 82;
                if (N > 1) {
                  radius = siblingIdx % 2 === 0 ? 66 : 98;
                }

                const rad = angle * Math.PI / 180;
                const cx = 200 + radius * Math.cos(rad);
                const cy = 140 + radius * Math.sin(rad);

                return {
                  ...p,
                  cx,
                  cy,
                  angle,
                  radius
                };
              });

              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "center", marginTop: "8px" }}>
                  {/* Circular SVG chart wheel */}
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", padding: "14px", background: LIGHT_BG, display: "flex", justifyContent: "center" }}>
                    <svg 
                      viewBox="0 0 400 280" 
                      style={{ width: "100%", height: "auto", maxHeight: "260px" }}
                      aria-label="Varsaphala return chart placement mapping active aspects"
                    >
                      {/* Outer boundary of chart */}
                      <circle cx="200" cy="140" r="110" fill="none" stroke={GOLD} strokeWidth="1.5" />
                      
                      {/* Inner hub */}
                      <circle cx="200" cy="140" r="55" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
                      
                      {/* Center label */}
                      <text x="200" y="136" textAnchor="middle" fill={GOLD_DEEP} fontWeight="bold" fontSize="9.5" letterSpacing="0.08em">TĀJIKA</text>
                      <text x="200" y="148" textAnchor="middle" fill={INK_SECONDARY} fontWeight="bold" fontSize="7.5" letterSpacing="0.04em">CHART WHEEL</text>
                      
                      {/* Spoke lines dividing the 12 signs */}
                      {SIGN_ORDER.map((sign, index) => {
                        const boundaryAngle = -90 + index * 30;
                        const boundaryRad = boundaryAngle * Math.PI / 180;
                        const x1 = 200 + 55 * Math.cos(boundaryRad);
                        const y1 = 140 + 55 * Math.sin(boundaryRad);
                        const x2 = 200 + 110 * Math.cos(boundaryRad);
                        const y2 = 140 + 110 * Math.sin(boundaryRad);
                        return (
                          <line
                            key={`spoke-${sign}`}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="rgba(156, 122, 47, 0.22)"
                            strokeWidth="1.2"
                          />
                        );
                      })}

                      {/* Sign outer abbreviations */}
                      {SIGN_ORDER.map((sign, index) => {
                        const shortNames: Record<string, string> = {
                          Aries: "ARI", Taurus: "TAU", Gemini: "GEM", Cancer: "CAN",
                          Leo: "LEO", Virgo: "VIR", Libra: "LIB", Scorpio: "SCO",
                          Sagittarius: "SAG", Capricorn: "CAP", Aquarius: "AQU", Pisces: "PIS"
                        };
                        const labelAngle = -75 + index * 30;
                        const labelRad = labelAngle * Math.PI / 180;
                        const lx = 200 + 125 * Math.cos(labelRad);
                        const ly = 140 + 125 * Math.sin(labelRad);
                        
                        const hasPlanets = planetsWithCoords.some((p) => p.sign === sign);
                        
                        return (
                          <text
                            key={`lbl-${sign}`}
                            x={lx}
                            y={ly + 3}
                            textAnchor="middle"
                            fill={hasPlanets ? GOLD_DEEP : INK_MUTED}
                            fontWeight={hasPlanets ? "800" : "500"}
                            fontSize={hasPlanets ? "9.5" : "8"}
                            style={{ userSelect: "none", transition: "all 150ms ease" }}
                          >
                            {shortNames[sign]}
                          </text>
                        );
                      })}

                      {/* Aspect lines */}
                      {activeScenario.yogasToIdentify.map((y) => {
                        const pA = planetsWithCoords.find((p) => p.name === y.connection[0]);
                        const pB = planetsWithCoords.find((p) => p.name === y.connection[1]);
                        if (pA && pB) {
                          const isIdentified = identifiedYogas.includes(y.id);
                          const isLineHovered = hoveredYoga === y.id || 
                                                (hoveredPlanet && y.connection.includes(hoveredPlanet));
                          const isLineActive = isIdentified || isLineHovered;
                          return (
                            <g key={y.id}>
                              {/* Visible line */}
                              <line
                                x1={pA.cx}
                                y1={pA.cy}
                                x2={pB.cx}
                                y2={pB.cy}
                                stroke={isLineActive ? GOLD : "rgba(77, 65, 51, 0.22)"}
                                strokeWidth={isLineHovered ? 4.5 : isIdentified ? 3 : 1.5}
                                strokeDasharray={isLineActive ? "none" : "3,3"}
                                style={{ transition: "all 150ms ease" }}
                              />
                              {/* Glow backdrop on hover */}
                              {isLineHovered && (
                                <line
                                  x1={pA.cx}
                                  y1={pA.cy}
                                  x2={pB.cx}
                                  y2={pB.cy}
                                  stroke="rgba(156, 122, 47, 0.25)"
                                  strokeWidth="10"
                                  strokeLinecap="round"
                                  style={{ transition: "all 150ms ease" }}
                                />
                              )}
                              {/* Wide invisible click target */}
                              <line
                                x1={pA.cx}
                                y1={pA.cy}
                                x2={pB.cx}
                                y2={pB.cy}
                                stroke="transparent"
                                strokeWidth="16"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleIdentifyYoga(y.id)}
                                onMouseEnter={() => setHoveredYoga(y.id)}
                                onMouseLeave={() => setHoveredYoga(null)}
                              />
                            </g>
                          );
                        }
                        return null;
                      })}

                      {/* Planets (staggered & collision-free) */}
                      {planetsWithCoords.map((p) => {
                        const isPlanetHighlighted = hoveredPlanet === p.name || 
                                                    (hoveredYoga && activeScenario.yogasToIdentify.find(y => y.id === hoveredYoga)?.connection.includes(p.name));
                        return (
                          <g 
                            key={p.name} 
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => setHoveredPlanet(p.name)}
                            onMouseLeave={() => setHoveredPlanet(null)}
                          >
                            {/* Hover concentric outline */}
                            {isPlanetHighlighted && (
                              <circle 
                                cx={p.cx} 
                                cy={p.cy} 
                                r="18" 
                                fill="none" 
                                stroke={GOLD} 
                                strokeWidth="2.5" 
                                opacity="0.8"
                                style={{ transition: "all 150ms ease" }}
                              />
                            )}
                            {/* Planet circle badge */}
                            <circle 
                              cx={p.cx} 
                              cy={p.cy} 
                              r="14.5" 
                              fill="#ffffff" 
                              stroke={isPlanetHighlighted ? GOLD_DEEP : p.color} 
                              strokeWidth={isPlanetHighlighted ? "2.5" : "1.8"} 
                              style={{ transition: "all 150ms ease" }}
                            />
                            {/* Planet Glyph */}
                            <text 
                              x={p.cx} 
                              y={p.cy - 1} 
                              textAnchor="middle" 
                              fill={isPlanetHighlighted ? GOLD_DEEP : p.color} 
                              fontWeight="bold" 
                              fontSize="11.5"
                              style={{ userSelect: "none" }}
                            >
                              {p.glyph}
                            </text>
                            {/* Planet Abbreviated Title */}
                            <text 
                              x={p.cx} 
                              y={p.cy + 9} 
                              textAnchor="middle" 
                              fill={INK_SECONDARY} 
                              fontSize="7.5" 
                              fontWeight="800"
                              style={{ userSelect: "none", letterSpacing: "0.02em" }}
                            >
                              {p.name.toUpperCase()}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Identified check cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {activeScenario.yogasToIdentify.map((y) => {
                      const isIdentified = identifiedYogas.includes(y.id);
                      const isCardHovered = hoveredYoga === y.id;
                      
                      return (
                        <button
                          key={y.id}
                          type="button"
                          onClick={() => handleIdentifyYoga(y.id)}
                          onMouseEnter={() => setHoveredYoga(y.id)}
                          onMouseLeave={() => setHoveredYoga(null)}
                          style={{
                            textAlign: "left",
                            padding: "12px 14px",
                            borderRadius: "8px",
                            border: `1.5px solid ${isCardHovered || isIdentified ? GOLD : "rgba(156,122,47,0.15)"}`,
                            background: isCardHovered || isIdentified ? "rgba(156, 122, 47, 0.04)" : "#ffffff",
                            boxShadow: isCardHovered ? "0 4px 12px rgba(156, 122, 47, 0.08)" : "none",
                            cursor: "pointer",
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            transition: "all 150ms ease"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", fontSize: "12px", alignItems: "center" }}>
                            <strong style={{ color: GOLD_DEEP }}>{y.name}</strong>
                            <span style={{ color: isIdentified ? GREEN : RED, fontWeight: 700 }}>{isIdentified ? "✓ Identified" : "? Analyze"}</span>
                          </div>
                          <span style={{ fontSize: "11px", color: INK_SECONDARY, lineHeight: "1.4" }}>{y.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: "transparent",
                  color: INK_PRIMARY,
                  border: `1px solid ${GOLD}`,
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "12px",
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
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: allYogasIdentified ? "pointer" : "not-allowed"
                }}
              >
                Classify Timing &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "14px", color: GOLD, margin: "0", fontWeight: 700, textTransform: "uppercase" }}>Step 3: Classify Aspect Timing Horizons</h4>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "0" }}>
              Based on planetary speeds, classify the active configurations to their proper timing states.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
              {activeScenario.yogasToIdentify.map((y) => {
                const currentSel = timingClassifications[y.id];
                return (
                  <div 
                    key={y.id} 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      border: `1px solid rgba(156,122,47,0.15)`, 
                      borderRadius: "8px", 
                      padding: "14px", 
                      background: "#ffffff",
                      flexWrap: "wrap",
                      gap: "10px"
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: "13px", color: GOLD_DEEP }}>{y.name}</strong>
                      <span style={{ display: "block", fontSize: "11px", color: INK_MUTED, marginTop: "2px" }}>{y.desc}</span>
                    </div>
                    <div style={{ display: "flex", gap: "6px" }}>
                      {[
                        { id: "vartamana", label: "Vartamāna (Applying / Future)" },
                        { id: "purna", label: "Pūrṇa (Separating / Past)" }
                      ].map((cat) => {
                        const active = currentSel === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleClassifyTiming(y.id, cat.id as any)}
                            style={{
                              border: `1.5px solid ${active ? GOLD : "rgba(156,122,47,0.2)"}`,
                              background: active ? GOLD : "transparent",
                              color: active ? "#ffffff" : INK_SECONDARY,
                              borderRadius: "6px",
                              padding: "6px 12px",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              cursor: "pointer",
                              transition: "all 150ms ease"
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

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: "transparent",
                  color: INK_PRIMARY,
                  border: `1px solid ${GOLD}`,
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "12px",
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
                  borderRadius: "6px",
                  padding: "8px 16px",
                  fontSize: "12.5px",
                  fontWeight: 700,
                  cursor: allTimingCorrect ? "pointer" : "not-allowed"
                }}
              >
                Issue Verdict &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "14px", color: GOLD, margin: "0", fontWeight: 700, textTransform: "uppercase" }}>Step 4: Issue Synthesis Verdict (M19 Compliant)</h4>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "0" }}>
              Formulate the final counseling evaluation. Select the statement that accurately states the timing without inducing anxiety:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
              {activeScenario.verdictOptions.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedVerdictIdx(i)}
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: `1.5px solid ${selectedVerdictIdx === i ? (opt.isCorrect ? GREEN : RED) : "rgba(156,122,47,0.2)"}`,
                    background: selectedVerdictIdx === i ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff",
                    color: INK_PRIMARY,
                    fontSize: "12.5px",
                    lineHeight: 1.5,
                    cursor: "pointer",
                    transition: "all 150ms ease"
                  }}
                >
                  <strong>Statement {String.fromCharCode(65 + i)}:</strong> {opt.text}
                </button>
              ))}
            </div>

            {selectedVerdictIdx !== null && (
              <div style={{ 
                padding: "14px", 
                borderRadius: "8px", 
                background: activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
                border: `1.5px solid ${activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? GREEN : RED}`,
                color: activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? GREEN : RED,
                fontSize: "13px",
                lineHeight: "1.4"
              }}>
                <strong>{activeScenario.verdictOptions[selectedVerdictIdx].isCorrect ? "✓ M19 Framework Compliant" : "✗ Framework Violation"}</strong>
                <p style={{ margin: "4px 0 0", color: INK_PRIMARY }}>{activeScenario.verdictOptions[selectedVerdictIdx].feedback}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "12px" }}>
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  background: "transparent",
                  color: INK_PRIMARY,
                  border: `1px solid ${GOLD}`,
                  borderRadius: "6px",
                  padding: "6px 14px",
                  fontSize: "12px",
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
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "12.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Sparkles size={14} /> Complete Capstone Case!
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
