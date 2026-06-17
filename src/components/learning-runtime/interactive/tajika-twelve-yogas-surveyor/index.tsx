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

interface YogaInfo {
  id: string;
  name: string;
  definition: string;
  astrologicalMeaning: string;
  svgType: "aspect_reception" | "aspect_no_reception" | "dusthana" | "blocked" | "exchange" | "isolated" | "friendly_conjunction" | "enemy_conjunction";
}

const CATEGORIES: { name: string; yogas: YogaInfo[] }[] = [
  {
    name: "Reception",
    yogas: [
      {
        id: "kamboola",
        name: "Kamboola",
        definition: "Aspect formed with mutual reception (one planet is in the other's sign or exaltation).",
        astrologicalMeaning: "Strong, supported timing outcomes. The resource needed is welcomed by the recipient.",
        svgType: "aspect_reception"
      },
      {
        id: "gairikamboola",
        name: "Gairikamboola",
        definition: "Aspect formed without reception (neither planet is in the sign/exaltation of the other).",
        astrologicalMeaning: "Timing occurs but with friction or lack of cooperation between resources.",
        svgType: "aspect_no_reception"
      }
    ]
  },
  {
    name: "Cancellation",
    yogas: [
      {
        id: "khallasara",
        name: "Khallasara",
        definition: "Reception is cancelled because one of the planets is debilitated or in a dusthana (6th, 8th, or 12th house).",
        astrologicalMeaning: "A promising beginning that fails or is abandoned due to structural weakness.",
        svgType: "dusthana"
      },
      {
        id: "raddha",
        name: "Raddha",
        definition: "Planet A is applying to Planet B, but a faster Planet C intervenes within the aspect orb first.",
        astrologicalMeaning: "Interruption or distraction; someone else steps in and diverts the expected result.",
        svgType: "blocked"
      }
    ]
  },
  {
    name: "Strength / Power",
    yogas: [
      {
        id: "duphali_kuttha",
        name: "Duphālī Kuttha",
        definition: "Both aspecting planets are in mutual reception (exchanging signs) and highly dignified.",
        astrologicalMeaning: "Exceptional success; two separate departments of life mutually elevate each other.",
        svgType: "exchange"
      },
      {
        id: "dutthotthadavirya",
        name: "Dutthotthadavīrya",
        definition: "One of the planets is in its sign of exaltation, bringing immense strength to the aspect.",
        astrologicalMeaning: "An uneven partnership where one highly capable factor carries the entire load.",
        svgType: "aspect_reception"
      }
    ]
  },
  {
    name: "Exchange",
    yogas: [
      {
        id: "tambeera",
        name: "Tambeera",
        definition: "Planets exchange signs directly without forming a standard degree aspect.",
        astrologicalMeaning: "A quiet exchange or trade-off; two areas of life swap states without fanfare.",
        svgType: "exchange"
      },
      {
        id: "kuttha",
        name: "Kuttha",
        definition: "An exchange of signs where one or both planets are debilitated.",
        astrologicalMeaning: "A desperate trade; exchanging resources between two weak areas, leading to minimal gain.",
        svgType: "dusthana"
      }
    ]
  },
  {
    name: "Isolation",
    yogas: [
      {
        id: "dureph",
        name: "Dureph",
        definition: "A planet occupies a sign without forming any aspect with any other planet in the return chart.",
        astrologicalMeaning: "Extreme isolation; a department of life that feels unreachable or unsupported during the year.",
        svgType: "isolated"
      },
      {
        id: "durawanga",
        name: "Durawanga",
        definition: "Aspect forms, but the degrees are at the extreme edge of the combined orb, showing weakness.",
        astrologicalMeaning: "Fading or remote influence; a possibility that barely registers and lacks concrete momentum.",
        svgType: "isolated"
      }
    ]
  },
  {
    name: "Conjunctions",
    yogas: [
      {
        id: "sajjana",
        name: "Sajjana",
        definition: "Conjunction (yuti) of mutual natural friends in the same sign.",
        astrologicalMeaning: "Harmonious blending of energies; mutual support and positive reinforcement in that house.",
        svgType: "friendly_conjunction"
      },
      {
        id: "manaau",
        name: "Manaau",
        definition: "Conjunction (yuti) of mutual natural enemies in the same sign.",
        astrologicalMeaning: "Internal friction and competition; conflict in the house occupied by the yuti.",
        svgType: "enemy_conjunction"
      }
    ]
  }
];

export function TajikaTwelveYogasSurveyor() {
  const [selectedYoga, setSelectedYoga] = useState<YogaInfo>(CATEGORIES[0].yogas[0]);
  const [activeCategory, setActiveCategory] = useState(0);

  // Matcher mini-game state
  const [matcherScore, setMatcherScore] = useState(0);
  const [matcherQuestion, setMatcherQuestion] = useState({
    yogaName: "Raddha",
    definition: "Planet A is applying to Planet B, but a faster Planet C intervenes within the aspect orb first."
  });
  const [matcherOptions, setMatcherOptions] = useState<string[]>([
    "Kamboola",
    "Raddha",
    "Dureph",
  ]);
  const [matcherAnswered, setMatcherAnswered] = useState<string | null>(null);

  const selectYoga = (yoga: YogaInfo) => {
    setSelectedYoga(yoga);
  };

  const checkMatcher = (option: string) => {
    if (matcherAnswered) return;
    setMatcherAnswered(option);
    if (option === matcherQuestion.yogaName) {
      setMatcherScore(matcherScore + 1);
    }
  };

  const nextMatcher = () => {
    const allYogas: YogaInfo[] = [];
    CATEGORIES.forEach((c) => allYogas.push(...c.yogas));
    
    const idx = Math.floor(Math.random() * allYogas.length);
    const correctYoga = allYogas[idx];

    const incorrect = allYogas
      .filter((y) => y.id !== correctYoga.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const options = [correctYoga.name, ...incorrect.map((y) => y.name)].sort(() => 0.5 - Math.random());

    setMatcherQuestion({
      yogaName: correctYoga.name,
      definition: correctYoga.definition
    });
    setMatcherOptions(options);
    setMatcherAnswered(null);
  };

  const renderSvgDiagram = (type: string) => {
    switch (type) {
      case "aspect_reception":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD} />
              </marker>
            </defs>
            <circle cx="80" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="80" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">☽</text>
            <text x="80" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="10">Moon (Fast)</text>
            
            <circle cx="320" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="320" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♃</text>
            <text x="320" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="10">Jup (Slow)</text>

            <path d="M 110 90 L 290 90" stroke={GOLD} strokeWidth="3" strokeDasharray="5,5" markerEnd="url(#arrow)" />
            <text x="200" y="75" fill={GOLD} textAnchor="middle" fontWeight="bold" fontSize="11">Applying Aspect</text>

            <path d="M 290 110 C 230 150, 170 150, 110 110" stroke={GREEN} strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
            <text x="200" y="145" fill={GREEN} textAnchor="middle" fontWeight="bold" fontSize="10">Mutual Reception</text>
          </svg>
        );
      case "aspect_no_reception":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <circle cx="80" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="80" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">☽</text>
            <text x="80" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="10">Moon (Fast)</text>

            <circle cx="320" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="320" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♄</text>
            <text x="320" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="10">Sat (Slow)</text>

            <line x1="110" y1="90" x2="290" y2="90" stroke={GOLD} strokeWidth="2" strokeDasharray="3,3" />
            <text x="200" y="75" fill={GOLD} textAnchor="middle" fontWeight="bold" fontSize="11">Aspect Only</text>
            
            <path d="M 120 120 L 280 120" stroke={RED} strokeWidth="1.5" />
            <line x1="200" y1="112" x2="200" y2="128" stroke={RED} strokeWidth="2" />
            <text x="200" y="138" fill={RED} textAnchor="middle" fontSize="10">No Mutual Reception (Friction)</text>
          </svg>
        );
      case "dusthana":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <circle cx="80" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="80" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♀</text>
            <text x="80" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="10">Venus</text>

            <rect x="270" y="45" width="100" height="90" rx="8" fill="rgba(162, 58, 30, 0.05)" stroke={RED} strokeWidth="1.5" />
            <circle cx="320" cy="90" r="18" fill="#ffffff" stroke={RED} strokeWidth="1.5" />
            <text x="320" y="94" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="11">☿</text>
            <text x="320" y="122" fill={RED} textAnchor="middle" fontSize="8" fontWeight="bold">Dusthana / Debility</text>

            <line x1="110" y1="90" x2="270" y2="90" stroke={GOLD} strokeWidth="2" strokeDasharray="4,4" />
            <path d="M 180 80 L 200 100" stroke={RED} strokeWidth="2" />
            <path d="M 200 80 L 180 100" stroke={RED} strokeWidth="2" />
            <text x="190" y="70" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="10">Reception Cancelled</text>
          </svg>
        );
      case "blocked":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <circle cx="60" cy="110" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="60" y="114" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="12">☽</text>
            <text x="60" y="148" fill={INK_SECONDARY} textAnchor="middle" fontSize="9">Planet A (Fast)</text>

            <circle cx="340" cy="110" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="340" y="114" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="12">♃</text>
            <text x="340" y="148" fill={INK_SECONDARY} textAnchor="middle" fontSize="9">Planet B (Slow)</text>

            <circle cx="200" cy="60" r="24" fill="#ffffff" stroke={RED} strokeWidth="2" />
            <text x="200" y="64" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="12">☿</text>
            <text x="200" y="98" fill={RED} textAnchor="middle" fontSize="9">Planet C (Intervener)</text>

            <line x1="84" y1="110" x2="316" y2="110" stroke={INK_MUTED} strokeWidth="1.5" strokeDasharray="3,3" />

            <line x1="80" y1="95" x2="180" y2="65" stroke={RED} strokeWidth="2" />
            <line x1="220" y1="65" x2="320" y2="95" stroke={RED} strokeWidth="2" />
            <text x="200" y="125" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="11">Interception (Blocked)</text>
          </svg>
        );
      case "exchange":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD} />
              </marker>
            </defs>
            <circle cx="100" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="100" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">☉</text>
            <text x="100" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="9">Sun in Jup Sign</text>

            <circle cx="300" cy="90" r="30" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="300" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♃</text>
            <text x="300" y="105" fill={INK_SECONDARY} textAnchor="middle" fontSize="9">Jup in Sun Sign</text>

            <path d="M 130 70 Q 200 40 270 70" fill="none" stroke={GOLD} strokeWidth="2" markerEnd="url(#arrow)" />
            <path d="M 270 110 Q 200 140 130 110" fill="none" stroke={GOLD} strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="200" y="30" fill={GOLD} textAnchor="middle" fontWeight="bold" fontSize="10">Exchanges signs</text>
          </svg>
        );
      case "isolated":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <circle cx="200" cy="90" r="35" fill="#ffffff" stroke={RED} strokeWidth="2" strokeDasharray="5,5" />
            <text x="200" y="85" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="16">♄</text>
            <text x="200" y="105" fill={RED} textAnchor="middle" fontSize="10">Saturn Isolated</text>

            <circle cx="60" cy="40" r="15" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />
            <circle cx="340" cy="40" r="15" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />
            <circle cx="60" cy="140" r="15" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />
            <circle cx="340" cy="140" r="15" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />

            <text x="200" y="150" fill={RED} textAnchor="middle" fontSize="11">No aspecting lines form with any graha</text>
          </svg>
        );
      case "friendly_conjunction":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <rect x="100" y="30" width="200" height="120" rx="12" fill="rgba(47, 125, 85, 0.05)" stroke={GREEN} strokeWidth="2" />
            <text x="200" y="55" fill={GREEN} textAnchor="middle" fontWeight="bold" fontSize="12">Friends in Same Sign</text>
            
            <circle cx="160" cy="100" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="160" y="105" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">☉</text>
            
            <circle cx="240" cy="100" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="240" y="105" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♃</text>

            <path d="M 184 100 L 216 100" stroke={GREEN} strokeWidth="3" />
            <text x="200" y="135" fill={GREEN} textAnchor="middle" fontSize="10">Sajjana: Constructive Union</text>
          </svg>
        );
      case "enemy_conjunction":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%">
            <rect x="100" y="30" width="200" height="120" rx="12" fill="rgba(168, 65, 43, 0.05)" stroke={RED} strokeWidth="2" />
            <text x="200" y="55" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="12">Enemies in Same Sign</text>
            
            <circle cx="160" cy="100" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="160" y="105" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♂</text>
            
            <circle cx="240" cy="100" r="24" fill="#ffffff" stroke={GOLD} strokeWidth="2" />
            <text x="240" y="105" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♄</text>

            <path d="M 184 100 L 200 90 L 216 100" stroke={RED} strokeWidth="2" fill="none" />
            <text x="200" y="135" fill={RED} textAnchor="middle" fontSize="10">Manaau: Friction & Conflict</text>
          </svg>
        );
      default:
        return null;
    }
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
        maxWidth: "860px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-twelve-yogas-surveyor"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          Twelve Refinement Yogas Surveyor
        </h3>
        <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Explore and deconstruct the 12 refinement yogas that modify base aspect timing in Tājika</span>
      </div>

      {/* Category Selection Tabs */}
      <div style={{ display: "flex", gap: "4px", overflowX: "auto", paddingBottom: "4px" }}>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => {
              setActiveCategory(i);
              selectYoga(cat.yogas[0]);
            }}
            style={{
              border: `1.5px solid ${activeCategory === i ? GOLD : HAIRLINE}`,
              background: activeCategory === i ? GOLD : "transparent",
              color: activeCategory === i ? "#ffffff" : INK_SECONDARY,
              borderRadius: "20px",
              padding: "4px 12px",
              fontWeight: 700,
              fontSize: "11px",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Yoga selection cards list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        {CATEGORIES[activeCategory].yogas.map((yoga) => {
          const isSelected = selectedYoga.id === yoga.id;
          return (
            <button
              key={yoga.id}
              type="button"
              onClick={() => selectYoga(yoga)}
              style={{
                textAlign: "left",
                border: `1.5px solid ${isSelected ? GOLD : HAIRLINE}`,
                background: isSelected ? "rgba(156, 122, 47, 0.08)" : "#ffffff",
                color: INK_PRIMARY,
                borderRadius: "8px",
                padding: "12px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <strong style={{ color: GOLD, fontSize: "11.5px", display: "block", marginBottom: "2px" }}>{yoga.name}</strong>
              <span style={{ fontSize: "10px", color: INK_SECONDARY, lineHeight: 1.4 }}>{yoga.definition}</span>
            </button>
          );
        })}
      </div>

      {/* Workbench Diagram */}
      {selectedYoga && (
        <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", alignItems: "center" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: "rgba(0,0,0,0.01)", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "160px" }}>
            {renderSvgDiagram(selectedYoga.svgType)}
          </div>
          <div>
            <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900 }}>Yoga details</span>
            <h4 style={{ margin: "2px 0 6px 0", color: INK_PRIMARY, fontSize: "13px" }}>{selectedYoga.name}</h4>
            
            <div style={{ marginBottom: "8px" }}>
              <span style={{ display: "block", fontSize: "10px", color: INK_MUTED, fontWeight: 700 }}>Technical Definition:</span>
              <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>{selectedYoga.definition}</p>
            </div>

            <div>
              <span style={{ display: "block", fontSize: "10px", color: INK_MUTED, fontWeight: 700 }}>Astrological Application:</span>
              <p style={{ margin: 0, fontSize: "11.5px", color: INK_PRIMARY, fontWeight: 600, lineHeight: 1.4 }}>{selectedYoga.astrologicalMeaning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mini-game check card */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "4px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP }}>Definition Matcher Game</span>
          <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Score: <strong>{matcherScore}</strong></span>
        </div>

        <p style={{ margin: 0, fontSize: "11.5px", fontStyle: "italic", lineHeight: 1.45, color: INK_SECONDARY }}>
          Match this definition: &ldquo;{matcherQuestion.definition}&rdquo;
        </p>

        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {matcherOptions.map((opt) => {
            const isSelected = matcherAnswered === opt;
            const isCorrect = opt === matcherQuestion.yogaName;

            let btnStyle: React.CSSProperties = {
              border: `1.5px solid ${HAIRLINE}`,
              background: "#ffffff",
              color: INK_PRIMARY,
              borderRadius: "6px",
              padding: "4px 12px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s"
            };

            if (matcherAnswered) {
              if (isCorrect) {
                btnStyle.border = `1.5px solid ${GREEN}`;
                btnStyle.background = `${GREEN}15`;
                btnStyle.color = GREEN;
              } else if (isSelected) {
                btnStyle.border = `1.5px solid ${RED}`;
                btnStyle.background = `${RED}15`;
                btnStyle.color = RED;
              } else {
                btnStyle.opacity = 0.5;
              }
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => checkMatcher(opt)}
                disabled={matcherAnswered !== null}
                style={btnStyle}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {matcherAnswered && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
            <span style={{ color: matcherAnswered === matcherQuestion.yogaName ? GREEN : RED, fontWeight: 700 }}>
              {matcherAnswered === matcherQuestion.yogaName ? "✓ Correct!" : `✗ Incorrect. Answer was ${matcherQuestion.yogaName}.`}
            </span>
            <button
              type="button"
              onClick={nextMatcher}
              style={{
                border: "none",
                background: GOLD,
                color: "#ffffff",
                borderRadius: "4px",
                padding: "4px 10px",
                fontSize: "10.5px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
