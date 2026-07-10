"use client";

import { useState } from "react";
import { BookOpen, Check, X, HelpCircle, RefreshCw, Layers } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const LIGHT_BG = "#FCFAF2";

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
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Applying aspect with mutual reception">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD} />
              </marker>
            </defs>
            {/* Moon Junction */}
            <circle cx="80" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <circle cx="80" cy="90" r="28" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1.5" />
            <text x="80" y="86" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">☽</text>
            <text x="80" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="11" fontWeight="700">Moon (Fast)</text>
            
            {/* Jup Junction */}
            <circle cx="320" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <circle cx="320" cy="90" r="28" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1.5" />
            <text x="320" y="86" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♃</text>
            <text x="320" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="11" fontWeight="700">Jup (Slow)</text>

            <path d="M 116 90 L 284 90" stroke={GOLD} strokeWidth="3" strokeDasharray="5,5" markerEnd="url(#arrow)" />
            <text x="200" y="76" fill={GOLD_DEEP} textAnchor="middle" fontWeight="800" fontSize="12">Applying Aspect</text>

            <path d="M 292 112 C 230 156, 170 156, 108 112" stroke={GREEN} strokeWidth="2.5" fill="none" markerEnd="url(#arrow)" />
            <text x="200" y="152" fill={GREEN} textAnchor="middle" fontWeight="800" fontSize="11.5">Mutual Reception (Support)</text>
          </svg>
        );
      case "aspect_no_reception":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Applying aspect without reception">
            <circle cx="80" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="80" y="86" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">☽</text>
            <text x="80" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="11" fontWeight="700">Moon (Fast)</text>

            <circle cx="320" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="320" y="86" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♄</text>
            <text x="320" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="11" fontWeight="700">Sat (Slow)</text>

            <line x1="116" y1="90" x2="284" y2="90" stroke={GOLD} strokeWidth="2" strokeDasharray="4,4" />
            <text x="200" y="76" fill={GOLD_DEEP} textAnchor="middle" fontWeight="800" fontSize="12">Aspect Only</text>
            
            <path d="M 120 125 L 280 125" stroke={RED} strokeWidth="2" />
            <line x1="200" y1="117" x2="200" y2="133" stroke={RED} strokeWidth="2.5" />
            <text x="200" y="145" fill={RED} textAnchor="middle" fontWeight="800" fontSize="11">No Reception (Friction)</text>
          </svg>
        );
      case "dusthana":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Aspect reception cancelled due to Dusthana placement">
            <circle cx="80" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="80" y="86" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♀</text>
            <text x="80" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="11" fontWeight="700">Venus</text>

            <rect x="260" y="35" width="120" height="110" rx="8" fill="rgba(162, 58, 30, 0.05)" stroke={RED} strokeWidth="2" />
            <circle cx="320" cy="90" r="22" fill="#ffffff" stroke={RED} strokeWidth="2" />
            <text x="320" y="94" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="14">☿</text>
            <text x="320" y="130" fill={RED} textAnchor="middle" fontSize="9.5" fontWeight="800">6th, 8th or 12th House</text>

            <line x1="116" y1="90" x2="256" y2="90" stroke={GOLD} strokeWidth="2" strokeDasharray="4,4" />
            
            {/* Cancel cross */}
            <path d="M 175 80 L 195 100 M 195 80 L 175 100" stroke={RED} strokeWidth="3" />
            <text x="185" y="70" fill={RED} textAnchor="middle" fontWeight="850" fontSize="11.5">CANCELLED</text>
          </svg>
        );
      case "blocked":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Interrupted aspect (Raddha)">
            <circle cx="60" cy="110" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="60" y="114" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">☽</text>
            <text x="60" y="152" fill={INK_SECONDARY} textAnchor="middle" fontSize="10.5" fontWeight="700">Planet A (Fast)</text>

            <circle cx="340" cy="110" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="340" y="114" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="14">♃</text>
            <text x="340" y="152" fill={INK_SECONDARY} textAnchor="middle" fontSize="10.5" fontWeight="700">Planet B (Slow)</text>

            {/* Intervening planet */}
            <circle cx="200" cy="50" r="28" fill="#ffffff" stroke={RED} strokeWidth="2.5" />
            <text x="200" y="54" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="14">☿</text>
            <text x="200" y="92" fill={RED} textAnchor="middle" fontSize="10.5" fontWeight="800">Planet C (Intervener)</text>

            {/* Target aspect line */}
            <line x1="90" y1="110" x2="310" y2="110" stroke={INK_MUTED} strokeWidth="1.5" strokeDasharray="3,3" />

            {/* Interception paths */}
            <line x1="84" y1="95" x2="176" y2="65" stroke={RED} strokeWidth="2.5" />
            <line x1="224" y1="65" x2="316" y2="95" stroke={RED} strokeWidth="2.5" />
            <text x="200" y="128" fill={RED} textAnchor="middle" fontWeight="850" fontSize="12">Interception (Blocked)</text>
          </svg>
        );
      case "exchange":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Sign exchange (Tambeera)">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD} />
              </marker>
            </defs>
            <circle cx="100" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="100" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">☉</text>
            <text x="100" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="10.5" fontWeight="700">Sun in Jup Sign</text>

            <circle cx="300" cy="90" r="32" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="300" y="85" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♃</text>
            <text x="300" y="108" fill={INK_SECONDARY} textAnchor="middle" fontSize="10.5" fontWeight="700">Jup in Sun Sign</text>

            <path d="M 130 70 Q 200 36 270 70" fill="none" stroke={GOLD} strokeWidth="2.5" markerEnd="url(#arrow)" />
            <path d="M 270 110 Q 200 144 130 110" fill="none" stroke={GOLD} strokeWidth="2.5" markerEnd="url(#arrow)" />
            <text x="200" y="24" fill={GOLD_DEEP} textAnchor="middle" fontWeight="800" fontSize="11">Sign Exchange</text>
          </svg>
        );
      case "isolated":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Isolated planet (Dureph)">
            <circle cx="200" cy="90" r="40" fill="#ffffff" stroke={RED} strokeWidth="2.5" strokeDasharray="5,5" />
            <text x="200" y="85" fill={RED} textAnchor="middle" fontWeight="bold" fontSize="18">♄</text>
            <text x="200" y="108" fill={RED} textAnchor="middle" fontSize="11" fontWeight="800">Isolated Saturn</text>

            {/* Other planets disconnected */}
            <circle cx="60" cy="40" r="16" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />
            <circle cx="340" cy="40" r="16" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />
            <circle cx="60" cy="140" r="16" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />
            <circle cx="340" cy="140" r="16" fill="#ffffff" stroke={INK_MUTED} strokeWidth="1" />

            <text x="200" y="152" fill={RED} textAnchor="middle" fontSize="11.5" fontWeight="800">No aspecting lines form with any graha</text>
          </svg>
        );
      case "friendly_conjunction":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Conjunction of friendly planets">
            <rect x="90" y="25" width="220" height="130" rx="12" fill="rgba(47, 125, 85, 0.05)" stroke={GREEN} strokeWidth="2" />
            <text x="200" y="50" fill={GREEN} textAnchor="middle" fontWeight="800" fontSize="12">Friends in Same Sign</text>
            
            <circle cx="150" cy="100" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="150" y="104" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">☉</text>
            
            <circle cx="250" cy="100" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="250" y="104" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♃</text>

            <path d="M 180 100 L 220 100" stroke={GREEN} strokeWidth="3" />
            <text x="200" y="142" fill={GREEN} textAnchor="middle" fontWeight="800" fontSize="11.5">Sajjana: Constructive Union</text>
          </svg>
        );
      case "enemy_conjunction":
        return (
          <svg viewBox="0 0 400 180" width="100%" height="100%" aria-label="Conjunction of enemy planets">
            <rect x="90" y="25" width="220" height="130" rx="12" fill="rgba(168, 65, 43, 0.05)" stroke={RED} strokeWidth="2" />
            <text x="200" y="50" fill={RED} textAnchor="middle" fontWeight="800" fontSize="12">Enemies in Same Sign</text>
            
            <circle cx="150" cy="100" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="150" y="104" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♂</text>
            
            <circle cx="250" cy="100" r="28" fill="#ffffff" stroke={GOLD} strokeWidth="2.5" />
            <text x="250" y="104" fill={INK_PRIMARY} textAnchor="middle" fontWeight="bold" fontSize="16">♄</text>

            <path d="M 180 100 Q 200 90 220 100" stroke={RED} strokeWidth="2.5" fill="none" />
            <text x="200" y="142" fill={RED} textAnchor="middle" fontWeight="800" fontSize="11.5">Manaau: Friction & Competition</text>
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
      data-interactive="tajika-twelve-yogas-surveyor"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 2 — Lesson 3
        </span>
        <h3 style={{ margin: "4px 0 0", fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Twelve Refinement Yogas Surveyor
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
          Explore and deconstruct the twelve refinement yogas that modify base aspect timing predictions in Tājika.
        </p>
      </div>

      {/* Category Selection Tabs */}
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px" }}>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => {
              setActiveCategory(i);
              selectYoga(cat.yogas[0]);
            }}
            style={{
              border: `1.5px solid ${activeCategory === i ? GOLD : "rgba(156, 122, 47, 0.2)"}`,
              background: activeCategory === i ? GOLD : "transparent",
              color: activeCategory === i ? "#ffffff" : INK_SECONDARY,
              borderRadius: "20px",
              padding: "6px 14px",
              fontWeight: 700,
              fontSize: "12px",
              whiteSpace: "nowrap",
              cursor: "pointer",
              transition: "all 150ms ease"
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Yoga selection cards list */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {CATEGORIES[activeCategory].yogas.map((yoga) => {
          const isSelected = selectedYoga.id === yoga.id;
          return (
            <button
              key={yoga.id}
              type="button"
              onClick={() => selectYoga(yoga)}
              style={{
                textAlign: "left",
                border: `1.5px solid ${isSelected ? GOLD : "rgba(156, 122, 47, 0.15)"}`,
                background: isSelected ? "rgba(156, 122, 47, 0.08)" : "#ffffff",
                color: INK_PRIMARY,
                borderRadius: "8px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 150ms ease"
              }}
            >
              <strong style={{ color: GOLD_DEEP, fontSize: "13.5px", display: "block", marginBottom: "4px" }}>{yoga.name}</strong>
              <span style={{ fontSize: "12px", color: INK_SECONDARY, lineHeight: 1.45 }}>{yoga.definition}</span>
            </button>
          );
        })}
      </div>

      {/* Workbench Diagram */}
      {selectedYoga && (
        <div 
          style={{ 
            background: "#ffffff", 
            border: "1px solid rgba(156, 122, 47, 0.15)", 
            padding: "20px", 
            borderRadius: "8px", 
            display: "grid", 
            gridTemplateColumns: "1.1fr 1fr", 
            gap: "20px", 
            alignItems: "center" 
          }}
        >
          <div 
            style={{ 
              border: `1px solid ${HAIRLINE}`, 
              borderRadius: "6px", 
              background: LIGHT_BG, 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center", 
              minHeight: "185px",
              padding: "12px"
            }}
          >
            {renderSvgDiagram(selectedYoga.svgType)}
          </div>
          <div>
            <span style={{ color: RED, fontSize: "10.5px", textTransform: "uppercase", fontWeight: 900 }}>Yoga Analysis Parameters</span>
            <h4 style={{ margin: "4px 0 10px 0", color: INK_PRIMARY, fontSize: "18px", fontFamily: "var(--font-cormorant), serif", fontWeight: 800 }}>{selectedYoga.name}</h4>
            
            <div style={{ marginBottom: "12px" }}>
              <span style={{ display: "block", fontSize: "10.5px", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>Technical Definition:</span>
              <p style={{ margin: "2px 0 0", fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.45 }}>{selectedYoga.definition}</p>
            </div>

            <div>
              <span style={{ display: "block", fontSize: "10.5px", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>Astrological Application:</span>
              <p style={{ margin: "2px 0 0", fontSize: "13.5px", color: INK_PRIMARY, fontWeight: 700, lineHeight: 1.45 }}>{selectedYoga.astrologicalMeaning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Mini-game check card */}
      <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "6px" }}>
          <span style={{ fontSize: "13px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Definition Matcher Game</span>
          <span style={{ fontSize: "12px", color: INK_SECONDARY }}>Score: <strong>{matcherScore}</strong></span>
        </div>

        <p style={{ margin: 0, fontSize: "13.5px", fontStyle: "italic", lineHeight: 1.5, color: INK_SECONDARY }}>
          Match this definition: &ldquo;{matcherQuestion.definition}&rdquo;
        </p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {matcherOptions.map((opt) => {
            const isSelected = matcherAnswered === opt;
            const isCorrect = opt === matcherQuestion.yogaName;

            let btnStyle: React.CSSProperties = {
              border: `1.5px solid ${HAIRLINE}`,
              background: "#ffffff",
              color: INK_PRIMARY,
              borderRadius: "6px",
              padding: "6px 14px",
              fontSize: "12.5px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 150ms ease"
            };

            if (matcherAnswered) {
              if (isCorrect) {
                btnStyle.border = `1.5px solid ${GREEN}`;
                btnStyle.background = "rgba(47, 125, 85, 0.05)";
                btnStyle.color = GREEN;
              } else if (isSelected) {
                btnStyle.border = `1.5px solid ${RED}`;
                btnStyle.background = "rgba(162, 58, 30, 0.05)";
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12.5px", marginTop: "4px" }}>
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
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                textTransform: "uppercase"
              }}
            >
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
