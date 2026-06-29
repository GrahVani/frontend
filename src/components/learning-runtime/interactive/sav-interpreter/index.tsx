"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, Sparkles, Navigation, Award, ShieldAlert, CheckSquare, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

type Tab = "natal" | "transit";

interface HouseInfo {
  number: number;
  signName: string;
  sanskritName: string;
  signification: string;
  karaka: string;
  karakaSymbol: string;
  defaultBav: number;
}

const HOUSE_DATA: HouseInfo[] = [
  { number: 1, signName: "Aries", sanskritName: "Tanu Bhava", signification: "Self, physical body, health, vitality, character, and overall constitution.", karaka: "Sun", karakaSymbol: "☉", defaultBav: 5 },
  { number: 2, signName: "Taurus", sanskritName: "Dhana Bhava", signification: "Wealth, savings, speech, family assets, food, and lineage wealth.", karaka: "Jupiter", karakaSymbol: "♃", defaultBav: 5 },
  { number: 3, signName: "Gemini", sanskritName: "Sahaja Bhava", signification: "Courage, self-efforts, younger siblings, communications, and short journeys.", karaka: "Mars", karakaSymbol: "♂", defaultBav: 4 },
  { number: 4, signName: "Cancer", sanskritName: "Bandhu Bhava", signification: "Mother, home, comfort, emotions, vehicles, and real estate.", karaka: "Moon", karakaSymbol: "☽", defaultBav: 5 },
  { number: 5, signName: "Leo", sanskritName: "Putra Bhava", signification: "Children, intellect, education, creativity, romance, and past-life merits (purvapunya).", karaka: "Jupiter", karakaSymbol: "♃", defaultBav: 6 },
  { number: 6, signName: "Virgo", sanskritName: "Ari Bhava", signification: "Debts, disease, enemies, obstacles, competitive results, and daily service (Upachaya).", karaka: "Mars", karakaSymbol: "♂", defaultBav: 4 },
  { number: 7, signName: "Libra", sanskritName: "Yuvati Bhava", signification: "Marriage, spouse, partnerships, business relationships, and public interactions.", karaka: "Venus", karakaSymbol: "♀", defaultBav: 5 },
  { number: 8, signName: "Scorpio", sanskritName: "Randhra Bhava", signification: "Longevity, sudden transformations, obstacles, occult sciences, and secrets.", karaka: "Saturn", karakaSymbol: "♄", defaultBav: 3 },
  { number: 9, signName: "Sagittarius", sanskritName: "Dharma Bhava", signification: "Dharma, father, guru, higher learning, fortune, and long journeys.", karaka: "Jupiter", karakaSymbol: "♃", defaultBav: 6 },
  { number: 10, signName: "Capricorn", sanskritName: "Karma Bhava", signification: "Career, profession, public status, authority, fame, and reputation.", karaka: "Sun", karakaSymbol: "☉", defaultBav: 5 },
  { number: 11, signName: "Aquarius", sanskritName: "Labha Bhava", signification: "Gains, profits, elder siblings, social networks, and goals (Upachaya).", karaka: "Jupiter", karakaSymbol: "♃", defaultBav: 6 },
  { number: 12, signName: "Pisces", sanskritName: "Vyaya Bhava", signification: "Losses, expenditure, foreign travel, isolation, hospitals, and liberation (moksha).", karaka: "Saturn", karakaSymbol: "♄", defaultBav: 3 }
];

interface PlanetTransitData {
  key: string;
  name: string;
  symbol: string;
  description: string;
}

const PLANETS: PlanetTransitData[] = [
  { key: "saturn", name: "Saturn", symbol: "♄", description: "Transit of structure, delays, discipline, and karmic boundaries." },
  { key: "jupiter", name: "Jupiter", symbol: "♃", description: "Transit of expansion, wisdom, grace, and opportunities." },
  { key: "mars", name: "Mars", symbol: "♂", description: "Transit of energy, action, conflict, and initiative." },
  { key: "sun", name: "Sun", symbol: "☉", description: "Transit of authority, visibility, vitality, and ego." },
  { key: "venus", name: "Venus", symbol: "♀", description: "Transit of harmony, comfort, luxury, and partnership." },
  { key: "mercury", name: "Mercury", symbol: "☿", description: "Transit of intellect, communication, transactions, and logic." },
  { key: "moon", name: "Moon", symbol: "☽", description: "Transit of emotional focus, mind, and immediate comfort." }
];

// Preset SAV grid aligned with lesson worked examples (10H = 32, 7H = 16, sum = 337)
const SAV_GRID = [28, 27, 24, 33, 26, 28, 16, 23, 33, 32, 29, 38];

export function SavInterpreter() {
  const [activeTab, setActiveTab] = useState<Tab>("natal");
  
  // Natal Mode States
  const [selectedHouse, setSelectedHouse] = useState<number>(10); // Default to 10H Capricorn
  const [bavValue, setBavValue] = useState<number>(5); // Default BAV for Capricorn (Sun)
  
  // Transit Mode States
  const [selectedTransitPlanet, setSelectedTransitPlanet] = useState<string>("jupiter");
  const [transitSignNum, setTransitSignNum] = useState<number>(10); // Default to Capricorn (index 10)
  
  const [showThresholdHelp, setShowThresholdHelp] = useState<boolean>(false);

  const getThresholdColor = (val: number, alpha: boolean = false) => {
    if (val >= 30) return alpha ? "color-mix(in srgb, #16a34a 10%, transparent)" : "#16a34a"; // Green (Abundant)
    if (val >= 25) return alpha ? "color-mix(in srgb, #84cc16 10%, transparent)" : "#84cc16"; // Light Green (Strong)
    if (val >= 22) return alpha ? "color-mix(in srgb, #eab308 10%, transparent)" : "#eab308";  // Yellow (Moderate)
    if (val >= 18) return alpha ? "color-mix(in srgb, #f97316 10%, transparent)" : "#f97316";  // Orange (Weak)
    return alpha ? "color-mix(in srgb, #ef4444 10%, transparent)" : "#ef4444"; // Red (Very Weak)
  };

  const getThresholdText = (val: number) => {
    if (val >= 30) return "Abundant";
    if (val >= 25) return "Strong";
    if (val >= 22) return "Moderate";
    if (val >= 18) return "Weak";
    return "Very Weak";
  };

  const handleReset = () => {
    setActiveTab("natal");
    setSelectedHouse(10);
    setBavValue(5);
    setSelectedTransitPlanet("jupiter");
    setTransitSignNum(10);
    setShowThresholdHelp(false);
  };

  const handleHouseChange = (num: number) => {
    setSelectedHouse(num);
    setBavValue(HOUSE_DATA[num - 1].defaultBav);
  };

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 140, cy = 140, r = 95;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiNum: i + 1 });
    }
    return points;
  }, []);

  const currentHouseObj = HOUSE_DATA[selectedHouse - 1];

  const synthesisFeedback = useMemo(() => {
    const savVal = SAV_GRID[selectedHouse - 1];
    const hInfo = HOUSE_DATA[selectedHouse - 1];
    
    let relationText = "";
    let detailsText = "";
    
    if (savVal >= 30 && bavValue >= 5) {
      relationText = "Double Abundance & High Success";
      detailsText = `Excellent synthesis. The house has abundant support (${savVal} SAV) and its significator (${hInfo.karaka}) has high strength (${bavValue}/8 BAV). Opportunities flow naturally, and you possess the capability to utilize them fully. High success.`;
    } else if (savVal >= 30 && bavValue === 4) {
      relationText = "Supportive Environment, Balanced Capability";
      detailsText = `Positive synthesis. The environment is highly supportive (${savVal} SAV), and the significator (${hInfo.karaka}) has moderate strength (${bavValue}/8 BAV). Standard efforts will yield very good results.`;
    } else if (savVal >= 30 && bavValue <= 3) {
      relationText = "Restricted Capability in Supportive Environment";
      detailsText = `Delayed outcomes. While the house has abundant support (${savVal} SAV), the significator (${hInfo.karaka}) is weak (${bavValue}/8 BAV). Opportunities exist in your life, but you may lack the personal drive, focus, or strength to seize them. Strengthening ${hInfo.karaka} via remedies will unlock this house's full potential.`;
    } else if (savVal >= 25 && bavValue >= 5) {
      relationText = "Auspicious Environment, Strong Executor";
      detailsText = `Auspicious synthesis. The environment provides strong support (${savVal} SAV), and the planet has high capacity (${bavValue}/8 BAV). Promotes steady growth and positive results in house matters.`;
    } else if (savVal >= 22 && savVal < 30 && bavValue >= 5) {
      relationText = "Strong Executor in Moderate Environment";
      detailsText = `Progressive synthesis. The general support of the house is moderate/mixed (${savVal} SAV), but the significator (${hInfo.karaka}) is highly resourceful (${bavValue}/8 BAV). Your personal intelligence and initiative will successfully overcome any average external circumstances.`;
    } else if (savVal >= 22 && savVal < 30 && bavValue <= 4) {
      relationText = "Steady / Average Synthesis";
      detailsText = `Standard outcomes. The house has moderate support (${savVal} SAV) and the planet has average capability (${bavValue}/8 BAV). Progress occurs through regular effort, discipline, and consistent actions.`;
    } else if (savVal < 22 && bavValue >= 5) {
      relationText = "Resourceful Planet in Restrictive Environment";
      detailsText = `Resilient synthesis. The house has low/restricted support (${savVal} SAV), but the significator (${hInfo.karaka}) is strong (${bavValue}/8 BAV). Though you face external delays, obstacles, or friction, your personal capacity ensures you will ultimately prevail.`;
    } else { // savVal < 22 && bavValue <= 3
      relationText = "Double Restriction / High Friction";
      detailsText = `Challenging synthesis. Both the house environment (${savVal} SAV) and the significator planet ${hInfo.karaka} (${bavValue}/8 BAV) are weak. Signifies delays, struggle, and heavy friction. Astrological remedies for ${hInfo.karaka} and patience are highly recommended.`;
    }
    
    return { relationText, detailsText };
  }, [selectedHouse, bavValue]);

  const transitFeedback = useMemo(() => {
    const savVal = SAV_GRID[transitSignNum - 1];
    const signName = RASHIS[transitSignNum - 1].nameEnglish;
    const pName = PLANETS.find(p => p.key === selectedTransitPlanet)?.name || "Jupiter";
    
    let rating = "";
    let color = "";
    let desc = "";
    
    if (savVal >= 30) {
      rating = "Auspicious Transit";
      color = "#16a34a"; // Green
      if (selectedTransitPlanet === "saturn") {
        desc = `Saturn (♄) transiting through ${signName} (${savVal} SAV). Protected structure. The high SAV acts as a buffer, providing the outer support needed to ground Saturn's heavy energy into constructive work, career focus, and responsibility without causing burnout or exhaustion.`;
      } else if (selectedTransitPlanet === "jupiter") {
        desc = `Jupiter (♃) transiting through ${signName} (${savVal} SAV). Golden era! Jupiter's grace multiplies in a highly supportive environment. Expect easy expansion, wisdom, luck, and positive development of this house's themes.`;
      } else if (selectedTransitPlanet === "mars") {
        desc = `Mars (♂) transiting through ${signName} (${savVal} SAV). Dynamic action. High drive and victory in competitions. Excellent for physical efforts or initiating projects related to this house.`;
      } else if (selectedTransitPlanet === "sun") {
        desc = `Sun (☉) transiting through ${signName} (${savVal} SAV). Public recognition. A spotlight shines on this house, bringing authority, professional respect, and clear visibility.`;
      } else if (selectedTransitPlanet === "venus") {
        desc = `Venus (♀) transiting through ${signName} (${savVal} SAV). Creative harmony. Brings comfort, romance, luxury, and smooth social relations in the matters of this house.`;
      } else if (selectedTransitPlanet === "mercury") {
        desc = `Mercury (☿) transiting through ${signName} (${savVal} SAV). Intellectual excellence. Sharp logic, successful business transactions, and clean, effective communication.`;
      } else { // Moon
        desc = `Moon (☽) transiting through ${signName} (${savVal} SAV). Emotional stability. Peaceful mind, comfort, and deep emotional satisfaction in this area of life.`;
      }
    } else if (savVal >= 22) {
      rating = "Moderate Transit";
      color = GOLD; // Gold
      if (selectedTransitPlanet === "saturn") {
        desc = `Saturn (♄) transiting through ${signName} (${savVal} SAV). Standard discipline. Growth is steady but requires methodical, structured efforts. Be patient.`;
      } else if (selectedTransitPlanet === "jupiter") {
        desc = `Jupiter (♃) transiting through ${signName} (${savVal} SAV). Stable growth. Normal blessings and opportunities are present, requiring proactive work to fully capture.`;
      } else if (selectedTransitPlanet === "mars") {
        desc = `Mars (♂) transiting through ${signName} (${savVal} SAV). Balanced effort. Active pursuit of goals; take calculated steps and avoid rash impatience.`;
      } else if (selectedTransitPlanet === "sun") {
        desc = `Sun (☉) transiting through ${signName} (${savVal} SAV). Clear focus. Standard opportunities to organize and show leadership in house matters.`;
      } else if (selectedTransitPlanet === "venus") {
        desc = `Venus (♀) transiting through ${signName} (${savVal} SAV). Balanced pleasure. Normal comfort and positive, stable social connections.`;
      } else if (selectedTransitPlanet === "mercury") {
        desc = `Mercury (☿) transiting through ${signName} (${savVal} SAV). Standard transactions. Good time for normal studies, organization, and regular correspondence.`;
      } else { // Moon
        desc = `Moon (☽) transiting through ${signName} (${savVal} SAV). Balanced mood. Standard day-to-day focus, with normal emotional ups and downs.`;
      }
    } else {
      rating = "Vulnerable Transit";
      color = "#ef4444"; // Red
      if (selectedTransitPlanet === "saturn") {
        desc = `Saturn (♄) transiting through ${signName} (${savVal} SAV). Vulnerable transit. Low SAV offers no buffer. Expect obstacles, delays, heavy workload, fatigue, and lessons in patience. Rest and remedies are recommended.`;
      } else if (selectedTransitPlanet === "jupiter") {
        desc = `Jupiter (♃) transiting through ${signName} (${savVal} SAV). Bottlenecked expansion. Jupiter wishes to bless, but the low SAV sign acts as a bottleneck. Luck is delayed or manifests in a muted way.`;
      } else if (selectedTransitPlanet === "mars") {
        desc = `Mars (♂) transiting through ${signName} (${savVal} SAV). Friction & burnout. High drive meeting a restrictive wall. Prone to arguments, accidents, frustration, and wasted energy. Channel energy with extra caution.`;
      } else if (selectedTransitPlanet === "sun") {
        desc = `Sun (☉) transiting through ${signName} (${savVal} SAV). Ego clashes. Lack of house support makes authority figures hostile or leaves your efforts unrecognized. Maintain a low profile.`;
      } else if (selectedTransitPlanet === "venus") {
        desc = `Venus (♀) transiting through ${signName} (${savVal} SAV). Relationship friction. Discontent or lack of satisfaction in partnerships or creative fields. Needs extra patience.`;
      } else if (selectedTransitPlanet === "mercury") {
        desc = `Mercury (☿) transiting through ${signName} (${savVal} SAV). Miscommunication. Details getting lost, cognitive fatigue, or minor errors in calculations and agreements.`;
      } else { // Moon
        desc = `Moon (☽) transiting through ${signName} (${savVal} SAV). Mental turbulence. Prone to anxiety, mood swings, or feeling unsupported. Take time for self-care.`;
      }
    }
    
    return { rating, color, desc };
  }, [transitSignNum, selectedTransitPlanet]);

  const activePlanetObj = useMemo(() => {
    return PLANETS.find(p => p.key === selectedTransitPlanet) || PLANETS[1];
  }, [selectedTransitPlanet]);

  return (
    <div style={{ padding: "20px", borderRadius: "18px", background: "rgba(255, 253, 248, 0.8)", backdropFilter: "blur(16px)", border: "1px solid rgba(156, 122, 47, 0.2)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 10px 30px rgba(156, 122, 47, 0.05)" }}>
      
      <style>{`
        .sav-sector {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .sav-sector:hover {
          opacity: 0.95 !important;
          filter: brightness(1.05);
        }
        .interactive-btn {
          transition: all 0.2s ease;
        }
        .interactive-btn:hover {
          background-color: rgba(156, 122, 47, 0.08) !important;
          border-color: ${GOLD_DEEP} !important;
        }
        .tab-button {
          transition: all 0.25s ease;
        }
        .tab-button:hover {
          color: ${GOLD_DEEP} !important;
          background: rgba(156, 122, 47, 0.04);
        }
        .planet-btn {
          transition: all 0.2s ease;
          border: 1px solid rgba(156, 122, 47, 0.15);
        }
        .planet-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(156, 122, 47, 0.1);
        }
      `}</style>

      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", borderBottom: "1.5px solid rgba(156,122,47,0.1)", paddingBottom: "12px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "-0.02em" }}>
            SAV Interpreter & Transit Grader
          </h2>
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>
            Analyze composite house strength relative to the 28-bindu average, evaluate planet-specific BAV synthesis, and simulate transits.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setShowThresholdHelp(!showThresholdHelp)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.2)", borderRadius: "8px", background: showThresholdHelp ? "rgba(156,122,47,0.1)" : "#ffffff", color: GOLD_DEEP, fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
            className="interactive-btn"
          >
            <HelpCircle size={13} /> Thresholds Guide
          </button>
          <button
            onClick={handleReset}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.2)", borderRadius: "8px", background: "#ffffff", color: INK_SECONDARY, fontSize: "11px", fontWeight: 700, cursor: "pointer" }}
            className="interactive-btn"
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* THRESHOLD QUICK HELP */}
      {showThresholdHelp && (
        <div style={{ background: "rgba(255, 255, 255, 0.95)", border: `1.5px solid ${GOLD}`, borderRadius: "12px", padding: "14px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", boxShadow: "0 6px 15px rgba(0,0,0,0.03)" }}>
          <div style={{ padding: "8px", borderLeft: "4px solid #16a34a", background: "rgba(22, 163, 74, 0.04)", borderRadius: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#16a34a", display: "block" }}>ABUNDANT (30+)</span>
            <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Exceptional support. Matters go extremely well with high ease.</span>
          </div>
          <div style={{ padding: "8px", borderLeft: "4px solid #84cc16", background: "rgba(132, 204, 22, 0.04)", borderRadius: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#84cc16", display: "block" }}>STRONG (25–29)</span>
            <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Auspicious support. Steady outcomes manifest with regular efforts.</span>
          </div>
          <div style={{ padding: "8px", borderLeft: "4px solid #eab308", background: "rgba(234, 179, 8, 0.04)", borderRadius: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#eab308", display: "block" }}>MODERATE (22–24)</span>
            <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Mixed results. Active work is required to structure opportunities.</span>
          </div>
          <div style={{ padding: "8px", borderLeft: "4px solid #f97316", background: "rgba(249, 115, 22, 0.04)", borderRadius: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#f97316", display: "block" }}>WEAK (18–21)</span>
            <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Restricted flow. Susceptible to delay, obstacles, and frustration.</span>
          </div>
          <div style={{ padding: "8px", borderLeft: "4px solid #ef4444", background: "rgba(239, 68, 68, 0.04)", borderRadius: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#ef4444", display: "block" }}>RESTRICTED (&lt; 18)</span>
            <span style={{ fontSize: "11px", color: INK_SECONDARY }}>Difficulty & structural stress. Requires caution and remedies.</span>
          </div>
        </div>
      )}

      {/* TABS */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(156,122,47,0.15)", gap: "6px" }}>
        <button
          onClick={() => setActiveTab("natal")}
          style={{
            padding: "10px 16px",
            background: activeTab === "natal" ? "rgba(156, 122, 47, 0.06)" : "transparent",
            border: "none",
            borderBottom: activeTab === "natal" ? `3px solid ${GOLD_DEEP}` : "3px solid transparent",
            color: activeTab === "natal" ? GOLD_DEEP : INK_SECONDARY,
            fontSize: "13px",
            fontWeight: 800,
            cursor: "pointer",
            borderRadius: "8px 8px 0 0"
          }}
          className="tab-button"
        >
          <Award size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} /> 1. Natal House Evaluation
        </button>
        <button
          onClick={() => setActiveTab("transit")}
          style={{
            padding: "10px 16px",
            background: activeTab === "transit" ? "rgba(156, 122, 47, 0.06)" : "transparent",
            border: "none",
            borderBottom: activeTab === "transit" ? `3px solid ${GOLD_DEEP}` : "3px solid transparent",
            color: activeTab === "transit" ? GOLD_DEEP : INK_SECONDARY,
            fontSize: "13px",
            fontWeight: 800,
            cursor: "pointer",
            borderRadius: "8px 8px 0 0"
          }}
          className="tab-button"
        >
          <Navigation size={14} style={{ marginRight: "4px", verticalAlign: "middle" }} /> 2. Transit Simulator
        </button>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        
        {/* Left Column: Interactive SVG Wheel */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "16px", borderRadius: "16px", border: "1px solid rgba(156,122,47,0.12)", minWidth: 0, justifyContent: "center" }}>
          <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: 750, color: GOLD_DEEP }}>
            Sarvāṣṭakavarga Map
          </h4>
          <p style={{ margin: "0 0 10px 0", fontSize: "10.5px", color: INK_MUTED, textAlign: "center" }}>
            {activeTab === "natal" ? "Click any sign/house to focus evaluation" : "Click any sign to snap transiting planet"}
          </p>

          <div style={{ position: "relative", width: "260px", height: "260px" }}>
            <svg width="260" height="260" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="132" fill="none" stroke="rgba(156,122,47,0.2)" strokeWidth="2" />
              <circle cx="150" cy="150" r="70" fill="none" stroke="rgba(156,122,47,0.12)" strokeWidth="1" />
              
              {/* Sector Division Lines */}
              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx = 150 + 132 * Math.cos(angleRad);
                const ly = 150 + 132 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1="150" y1="150" x2={lx} y2={ly} stroke="rgba(156,122,47,0.12)" strokeWidth="1.2" />;
              })}

              {/* Segment highlights based on SAV strength */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const savVal = SAV_GRID[num - 1];
                
                const isSelectedHouse = activeTab === "natal" && num === selectedHouse;
                const isTransitHouse = activeTab === "transit" && num === transitSignNum;

                let fill = getThresholdColor(savVal, true);
                let stroke = "none";
                let strokeW = "0.5";

                if (isSelectedHouse) {
                  stroke = GOLD_DEEP;
                  strokeW = "3.5";
                } else if (isTransitHouse) {
                  stroke = SLATE_BLUE;
                  strokeW = "3.5";
                }

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 150 + 132 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 132 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 150 + 132 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 132 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 150 + 70 * Math.cos((startAngle * Math.PI) / 180), y: 150 + 70 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 150 + 70 * Math.cos((endAngle * Math.PI) / 180), y: 150 + 70 * Math.sin((endAngle * Math.PI) / 180) };
                
                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 132 132 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 70 70 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`ipath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeW}
                    className={`sav-sector ${isSelectedHouse ? 'sav-sector-selected' : ''} ${isTransitHouse ? 'sav-sector-transit' : ''}`}
                    style={{ cursor: "pointer", opacity: (isSelectedHouse || isTransitHouse) ? 0.95 : 0.7 }}
                    onClick={() => {
                      if (activeTab === "natal") {
                        handleHouseChange(num);
                      } else {
                        setTransitSignNum(num);
                      }
                    }}
                  />
                );
              })}

              {/* Transit planet indicator node */}
              {activeTab === "transit" && (() => {
                const idx = transitSignNum - 1;
                const angleDeg = idx * 30 - 90;
                const angleRad = (angleDeg * Math.PI) / 180;
                const pt = { x: 150 + 104 * Math.cos(angleRad), y: 150 + 104 * Math.sin(angleRad) };

                return (
                  <g style={{ transition: "all 0.3s ease" }}>
                    <circle cx={pt.x} cy={pt.y} r="11" fill={SLATE_BLUE} stroke="#ffffff" strokeWidth="1.5" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
                    <text x={pt.x} y={pt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "11px", fontWeight: 700, fill: "#ffffff", fontFamily: "'Inter', sans-serif" }}>
                      {activePlanetObj.symbol}
                    </text>
                  </g>
                );
              })()}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiNum - 1];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 150 + 116 * Math.cos(angleRad), y: 150 + 116 * Math.sin(angleRad) };
                const ptBindu = { x: 150 + 86 * Math.cos(angleRad), y: 150 + 86 * Math.sin(angleRad) };

                const savVal = SAV_GRID[p.rashiNum - 1];
                const isFocused = (activeTab === "natal" && p.rashiNum === selectedHouse) || (activeTab === "transit" && p.rashiNum === transitSignNum);

                return (
                  <g key={`ilabel-${p.rashiNum}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "8.5px", fontWeight: isFocused ? 900 : 700, fill: isFocused ? GOLD_DEEP : INK_PRIMARY, letterSpacing: "-0.01em" }}
                    >
                      {r.nameEnglish}
                    </text>
                    
                    <g
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (activeTab === "natal") {
                          handleHouseChange(p.rashiNum);
                        } else {
                          setTransitSignNum(p.rashiNum);
                        }
                      }}
                    >
                      <circle
                        cx={ptBindu.x}
                        cy={ptBindu.y}
                        r="10.5"
                        fill={getThresholdColor(savVal)}
                        stroke={isFocused ? "#ffffff" : "rgba(255, 255, 255, 0.8)"}
                        strokeWidth="1.2"
                        style={{ filter: isFocused ? "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" : "none" }}
                      />
                      <text
                        x={ptBindu.x}
                        y={ptBindu.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "8.5px", fontWeight: 800, fill: "#ffffff" }}
                      >
                        {savVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="150" cy="150" r="32" fill="#ffffff" stroke="rgba(156,122,47,0.2)" strokeWidth="1.5" />
              <text x="150" y="141" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>TOTAL</text>
              <text x="150" y="156" textAnchor="middle" style={{ fontSize: "12px", fontWeight: 900, fill: GOLD_DEEP }}>337</text>
              <text x="150" y="167" textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: INK_MUTED }}>BINDUS</text>
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", fontSize: "9px", fontWeight: 800, marginTop: "12px" }}>
            <span style={{ color: "#16a34a", display: "flex", alignItems: "center", gap: "2px" }}><span style={{ fontSize: "12px" }}>●</span> 30+</span>
            <span style={{ color: "#84cc16", display: "flex", alignItems: "center", gap: "2px" }}><span style={{ fontSize: "12px" }}>●</span> 25-29</span>
            <span style={{ color: "#eab308", display: "flex", alignItems: "center", gap: "2px" }}><span style={{ fontSize: "12px" }}>●</span> 22-24</span>
            <span style={{ color: "#f97316", display: "flex", alignItems: "center", gap: "2px" }}><span style={{ fontSize: "12px" }}>●</span> 18-21</span>
            <span style={{ color: "#ef4444", display: "flex", alignItems: "center", gap: "2px" }}><span style={{ fontSize: "12px" }}>●</span> &lt;18</span>
          </div>

          <div style={{ marginTop: "14px", borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "8px", width: "100%", textAlign: "center" }}>
            <span style={{ fontSize: "9.5px", color: INK_MUTED, fontStyle: "italic" }}>
              Assuming Aries Lagna (Sign 1 = House 1) for lesson consistency.
            </span>
          </div>
        </div>

        {/* Right Column: Dynamic Evaluation Workspaces */}
        <div style={{ flex: "1 1 360px", display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
          
          {/* TAB 1: NATAL EVALUATION */}
          {activeTab === "natal" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              {/* House Focus Selector Card */}
              <div style={{ background: "#ffffff", padding: "14px", borderRadius: "14px", border: "1px solid rgba(156,122,47,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP }}>
                    Select Natal House Focus:
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      onClick={() => handleHouseChange(selectedHouse === 1 ? 12 : selectedHouse - 1)}
                      style={{ padding: "4px", background: "none", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "4px", color: INK_SECONDARY, cursor: "pointer" }}
                      className="interactive-btn"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => handleHouseChange(selectedHouse === 12 ? 1 : selectedHouse + 1)}
                      style={{ padding: "4px", background: "none", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "4px", color: INK_SECONDARY, cursor: "pointer" }}
                      className="interactive-btn"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
                
                <select
                  value={selectedHouse}
                  onChange={(e) => handleHouseChange(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid rgba(156,122,47,0.2)",
                    fontSize: "12px",
                    color: INK_PRIMARY,
                    background: "#ffffff",
                    cursor: "pointer",
                    fontWeight: 700
                  }}
                >
                  {HOUSE_DATA.map(h => (
                    <option key={h.number} value={h.number}>
                      {h.number}H: {h.signName} — {h.sanskritName} ({getThresholdText(SAV_GRID[h.number - 1])} {SAV_GRID[h.number - 1]})
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: "10px", display: "flex", gap: "6px", alignItems: "flex-start", background: "rgba(156, 122, 47, 0.03)", padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.06)" }}>
                  <Info size={14} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <strong style={{ fontSize: "11px", color: GOLD_DEEP, display: "block" }}>Significations:</strong>
                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.45 }}>
                      {currentHouseObj.signification}
                    </p>
                  </div>
                </div>
              </div>

              {/* SAV Metric & BAV Synthesizer Card */}
              <div style={{ background: "rgba(156,122,47,0.03)", border: "1px solid rgba(156,122,47,0.18)", padding: "16px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Sparkles size={12} /> Live Astro Synthesis Engine
                  </span>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px", flexWrap: "wrap", gap: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700 }}>
                      House SAV Score ({currentHouseObj.number}H / {currentHouseObj.signName}):
                    </span>
                    <strong style={{ fontSize: "16px", color: getThresholdColor(SAV_GRID[selectedHouse - 1]), display: "flex", alignItems: "center", gap: "4px" }}>
                      {SAV_GRID[selectedHouse - 1]} ({getThresholdText(SAV_GRID[selectedHouse - 1])})
                    </strong>
                  </div>
                </div>

                {/* BAV Slider Layer */}
                <div style={{ borderTop: "1px dashed rgba(156,122,47,0.15)", paddingTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 750, color: INK_SECONDARY, display: "flex", alignItems: "center", gap: "4px" }}>
                      Adjust Karaka BAV ({currentHouseObj.karakaSymbol} {currentHouseObj.karaka} BAV):
                    </span>
                    <strong style={{ fontSize: "13px", color: GOLD_DEEP }}>{bavValue} / 8 bindus</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    value={bavValue}
                    onChange={(e) => setBavValue(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: GOLD_DEEP,
                      cursor: "pointer",
                      height: "6px",
                      borderRadius: "3px",
                      background: "rgba(156,122,47,0.15)"
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>
                    <span>0 (Extremely Weak)</span>
                    <span>4 (Moderate)</span>
                    <span>8 (Ideal Strength)</span>
                  </div>
                </div>

                {/* Synthesis Output Pane */}
                <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.15)", borderLeft: `4px solid ${getThresholdColor(SAV_GRID[selectedHouse - 1])}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                    <Award size={13} style={{ color: GOLD_DEEP }} />
                    <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
                      {synthesisFeedback.relationText}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
                    {synthesisFeedback.detailsText}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            
            /* TAB 2: TRANSIT SIMULATOR */
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              {/* Planet Selector Grid */}
              <div style={{ background: "#ffffff", padding: "14px", borderRadius: "14px", border: "1px solid rgba(156,122,47,0.12)" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP, display: "block", marginBottom: "8px" }}>
                  Select Transiting Planet:
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
                  {PLANETS.map(p => {
                    const isSelected = selectedTransitPlanet === p.key;
                    return (
                      <button
                        key={p.key}
                        onClick={() => setSelectedTransitPlanet(p.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "6px 0",
                          borderRadius: "8px",
                          background: isSelected ? SLATE_BLUE : "rgba(255, 253, 248, 0.6)",
                          color: isSelected ? "#ffffff" : INK_PRIMARY,
                          cursor: "pointer",
                          fontWeight: 750,
                          fontSize: "11px",
                          border: isSelected ? `1px solid ${SLATE_BLUE}` : "1px solid rgba(156,122,47,0.15)"
                        }}
                        className="planet-btn"
                        title={p.name}
                      >
                        <span style={{ fontSize: "13px", fontWeight: 800 }}>{p.symbol}</span>
                        <span style={{ fontSize: "7.5px", opacity: 0.8, marginTop: "2px" }}>{p.name.substring(0, 3)}</span>
                      </button>
                    );
                  })}
                </div>
                <p style={{ margin: "8px 0 0 0", fontSize: "10.5px", color: INK_MUTED, fontStyle: "italic", lineHeight: 1.4 }}>
                  {activePlanetObj.description}
                </p>
              </div>

              {/* Transit Position Slider Card */}
              <div style={{ background: "#ffffff", padding: "14px", borderRadius: "14px", border: "1px solid rgba(156,122,47,0.12)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 800, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "4px" }}>
                    <Navigation size={12} /> Transit Sign Position:
                  </span>
                  <strong style={{ fontSize: "12px", color: SLATE_BLUE }}>
                    {RASHIS[transitSignNum - 1].nameEnglish} ({transitSignNum}H) — {SAV_GRID[transitSignNum - 1]} SAV
                  </strong>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => setTransitSignNum(transitSignNum === 1 ? 12 : transitSignNum - 1)}
                    style={{ padding: "6px", background: "none", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", color: INK_SECONDARY, cursor: "pointer" }}
                    className="interactive-btn"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={transitSignNum}
                    onChange={(e) => setTransitSignNum(Number(e.target.value))}
                    style={{
                      flex: 1,
                      accentColor: SLATE_BLUE,
                      cursor: "pointer",
                      height: "6px",
                      borderRadius: "3px",
                      background: "rgba(59, 130, 246, 0.15)"
                    }}
                  />
                  <button
                    onClick={() => setTransitSignNum(transitSignNum === 12 ? 1 : transitSignNum + 1)}
                    style={{ padding: "6px", background: "none", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "6px", color: INK_SECONDARY, cursor: "pointer" }}
                    className="interactive-btn"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Transit Feedback Card */}
              <div style={{ background: "rgba(59, 130, 246, 0.03)", border: "1.5px solid rgba(59, 130, 246, 0.2)", padding: "14px", borderRadius: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 800, marginBottom: "6px", borderBottom: "1px solid rgba(59,130,246,0.1)", paddingBottom: "4px" }}>
                  <span style={{ color: INK_PRIMARY, display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldAlert size={14} style={{ color: transitFeedback.color }} /> Transit Verdict:
                  </span>
                  <span style={{ color: transitFeedback.color }}>{transitFeedback.rating}</span>
                </div>
                <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.5", color: INK_SECONDARY }}>
                  {transitFeedback.desc}
                </p>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* FOOTER & SOURCE */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156, 122, 47, 0.18)", borderRadius: "10px", padding: "12px", fontSize: "10px", color: INK_MUTED, lineHeight: 1.45, display: "flex", gap: "8px", alignItems: "flex-start" }}>
        <CheckSquare size={16} style={{ color: GOLD_DEEP, flexShrink: 0, marginTop: "1px" }} />
        <div>
          <strong>Astrological Source Reference:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (Aṣṭakavarga adhyāya). Composite support of signs guides natal potential and transit strength. Cross-referencing chart-wide SAV support with individual planet BAV reveals whether opportunities (SAV) will successfully manifest via individual drive (BAV).
        </div>
      </div>
    </div>
  );
}
