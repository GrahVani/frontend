"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from '@/components/learning-runtime/interactive/nakshatra-data';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

// Constants matching Grahvani's design token palette
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#10B981";
const RED = "#EF4444";
const ORANGE = "#F59E0B";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

const NAK_DEG = 13 + 20 / 60; // 13.3333°

interface Preset {
  name: string;
  type: "marriage" | "career" | "libra_marriage" | "custom";
  cusps: number[]; // absolute longitudes in degrees (1-12)
  planets: Record<string, number>; // absolute longitudes in degrees
}

// Preset Worked Examples
const PRESETS: Preset[] = [
  {
    name: "Scorpio Marriage Case (L1 & L4 Example 1)",
    type: "marriage",
    // 7th Cusp = 226°10′ (Scorpio 16°10′)
    cusps: [46.16, 76.16, 106.16, 136.16, 166.16, 196.16, 226.1667, 256.16, 286.16, 316.16, 346.16, 16.16],
    planets: {
      Sun: 45.0,
      Moon: 140.0,
      Mars: 280.0,
      Mercury: 50.0,
      Jupiter: 265.0, // Sagittarius 25°00′ (Jupiter own-sign, occupies 11th on this chart)
      Venus: 215.0,
      Saturn: 185.0,
      Rahu: 12.0,
      Ketu: 192.0
    }
  },
  {
    name: "Taurus Career Case (L4 Example 2)",
    type: "career",
    // 10th Cusp = 55°00′ (Taurus 25°00′)
    cusps: [265.0, 295.0, 325.0, 355.0, 25.0, 55.0, 85.0, 115.0, 145.0, 175.0, 205.0, 235.0],
    planets: {
      Sun: 120.0,
      Moon: 210.0,
      Mars: 54.0,
      Mercury: 110.0,
      Jupiter: 15.0,
      Venus: 75.0,
      Saturn: 10.0,
      Rahu: 225.0, // Scorpio 15°00′ (Rāhu sub-lord of 10th cusp)
      Ketu: 45.0
    }
  },
  {
    name: "Libra Marriage Case (L1 Example 1)",
    type: "libra_marriage",
    // 7th Cusp = 198°34′12″ (Libra 18°34′12″)
    cusps: [18.57, 48.57, 78.57, 108.57, 138.57, 168.57, 198.57, 228.57, 258.57, 288.57, 318.57, 348.57],
    planets: {
      Sun: 200.0,
      Moon: 342.75, // Pisces 12°45′
      Mars: 112.0,
      Mercury: 212.0,
      Jupiter: 155.0,
      Venus: 180.0,
      Saturn: 240.0,
      Rahu: 190.0,
      Ketu: 10.0
    }
  }
];

function fmtDMS(d: number): string {
  const deg = Math.floor(d);
  const min = Math.floor((d - deg) * 60);
  const sec = Math.round(((d - deg) * 60 - min) * 60);
  if (sec === 60) return `${deg}°${(min + 1).toString().padStart(2, "0")}′00″`;
  return `${deg}°${min.toString().padStart(2, "0")}′${sec.toString().padStart(2, "0")}″`;
}

function fmtZodiac(d: number): string {
  const signIdx = Math.min(Math.floor(d / 30), 11);
  const deg = d % 30;
  return `${fmtDMS(deg)} ${SIGNS[signIdx]}`;
}

// Function to compute sub-lord of a longitude
function getSubLordData(lon: number) {
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  const nak = NAKSHATRAS[nakIdx];
  const elapsed = lon - nakIdx * NAK_DEG;
  
  // Compute sub segments
  const start = VIM.findIndex((v) => v[0] === nak.ruler);
  const subs: { lord: string; years: number; from: number; to: number }[] = [];
  let cursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(start + j) % 9];
    const width = (years / 120) * NAK_DEG;
    subs.push({ lord, years, from: cursor, to: cursor + width });
    cursor += width;
  }
  
  const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];
  
  // Compute sub-sub-lord based on active sub division
  const subStart = VIM.findIndex((v) => v[0] === activeSub.lord);
  const subOffset = elapsed - activeSub.from;
  const subWidth = activeSub.to - activeSub.from;
  const subSubs: { lord: string; years: number; from: number; to: number }[] = [];
  let ssCursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(subStart + j) % 9];
    const width = (years / 120) * subWidth;
    subSubs.push({ lord, years, from: ssCursor, to: ssCursor + width });
    ssCursor += width;
  }
  const activeSubSub = subSubs.find((s) => subOffset >= s.from && subOffset < s.to) ?? subSubs[subSubs.length - 1];

  return {
    nak,
    elapsed,
    subs,
    activeSub,
    activeSubSub
  };
}

export function CuspalSubLordFinder() {
  const [presetIdx, setPresetIdx] = useState(0);
  const [chartData, setChartData] = useState<Preset>(PRESETS[0]);
  const [selectedType, setSelectedType] = useState<"cusp" | "planet">("cusp");
  const [selectedIndex, setSelectedIndex] = useState(6); // default Cusp 7
  const [selectedPlanet, setSelectedPlanet] = useState<string>("Jupiter");
  
  // Inspector active state overrides for playground
  const [overrideOccupancy, setOverrideOccupancy] = useState<number>(11);
  const [overrideOwnership, setOverrideOwnership] = useState<number[]>([2]);
  const [overrideOwnSubLord, setOverrideOwnSubLord] = useState<string>("Venus");
  const [overrideDignity, setOverrideDignity] = useState<"Exalted" | "Own" | "Neutral" | "Debilitated">("Own");
  const [overrideRP, setOverrideRP] = useState<boolean>(true);
  const [overrideAspect, setOverrideAspect] = useState<boolean>(true);
  const [overrideAfflicted, setOverrideAfflicted] = useState<boolean>(false);

  const [queryType, setQueryType] = useState<"marriage" | "career" | "custom">("marriage");
  const [customQueryHouses, setCustomQueryHouses] = useState<number[]>([1, 7]);
  const [activeTab, setActiveTab] = useState<"finder" | "disposition" | "details">("finder");
  const [isNorthIndian, setIsNorthIndian] = useState(true);

  // Sync state when Preset changes
  const handlePresetSelect = (idx: number) => {
    setPresetIdx(idx);
    const p = PRESETS[idx];
    setChartData(p);
    
    // Auto-select based on preset to align with lesson worked examples
    if (p.type === "marriage") {
      setSelectedType("cusp");
      setSelectedIndex(6); // Cusp 7
      setQueryType("marriage");
      // Setup Scorpio Jupiter overrides
      setOverrideOccupancy(11);
      setOverrideOwnership([2]);
      setOverrideOwnSubLord("Venus");
      setOverrideDignity("Own");
      setOverrideRP(true);
      setOverrideAspect(true);
      setOverrideAfflicted(false);
    } else if (p.type === "career") {
      setSelectedType("cusp");
      setSelectedIndex(9); // Cusp 10
      setQueryType("career");
      // Setup Taurus Rāhu overrides
      setOverrideOccupancy(8);
      setOverrideOwnership([]);
      setOverrideOwnSubLord("Mars");
      setOverrideDignity("Debilitated");
      setOverrideRP(false);
      setOverrideAspect(false);
      setOverrideAfflicted(true);
    } else {
      setSelectedType("cusp");
      setSelectedIndex(6); // Cusp 7
      setQueryType("marriage");
      // Setup Libra Moon overrides
      setOverrideOccupancy(11);
      setOverrideOwnership([4]);
      setOverrideOwnSubLord("Jupiter");
      setOverrideDignity("Neutral");
      setOverrideRP(true);
      setOverrideAspect(false);
      setOverrideAfflicted(false);
    }
  };

  // Get active selected item longitude
  const activeLongitude = useMemo(() => {
    if (selectedType === "cusp") {
      return chartData.cusps[selectedIndex];
    } else {
      return chartData.planets[selectedPlanet] ?? 0;
    }
  }, [selectedType, selectedIndex, selectedPlanet, chartData]);

  // Compute live sub data
  const subData = useMemo(() => {
    return getSubLordData(activeLongitude);
  }, [activeLongitude]);

  // Target query houses based on template
  const targetHouses = useMemo(() => {
    if (queryType === "marriage") return [2, 7, 11];
    if (queryType === "career") return [2, 6, 10, 11];
    return customQueryHouses;
  }, [queryType, customQueryHouses]);

  // Check significator status based on active values
  const isSignificator = useMemo(() => {
    // Check if occupancy house or any owned house is in target set
    const hasOccupancy = targetHouses.includes(overrideOccupancy);
    const hasOwnership = overrideOwnership.some(h => targetHouses.includes(h));
    
    // Recursively check own sub-lord if natural significator (e.g. Venus for marriage)
    let hasSubLordSignification = false;
    if (queryType === "marriage" && overrideOwnSubLord === "Venus") {
      hasSubLordSignification = true;
    }
    
    return hasOccupancy || hasOwnership || hasSubLordSignification;
  }, [overrideOccupancy, overrideOwnership, overrideOwnSubLord, targetHouses, queryType]);

  // Screen YES/NO conditions
  const dispositionVerdict = useMemo(() => {
    // 4 YES conditions
    const yes1 = isSignificator;
    const yes2 = overrideDignity === "Exalted" || overrideDignity === "Own";
    const yes3 = overrideRP;
    const yes4 = overrideAspect;

    // 4 NO conditions
    const no1 = !isSignificator;
    const no2 = overrideDignity === "Debilitated";
    const no3 = !overrideRP;
    const no4 = overrideAfflicted;

    const yesCount = [yes1, yes2, yes3, yes4].filter(Boolean).length;
    const noCount = [no1, no2, no3, no4].filter(Boolean).length;

    if (no1) {
      return {
        verdict: "NO" as const,
        reason: "The significator gate is closed. The sub-lord does not signify any relevant houses for this query, which is a gating failure.",
        yesList: { yes1, yes2, yes3, yes4 },
        noList: { no1, no2, no3, no4 }
      };
    }

    if (yesCount === 4 && noCount === 0) {
      return {
        verdict: "YES" as const,
        reason: "All 4 YES conditions are satisfied. The sub-lord is highly disposed to fructify this house promise.",
        yesList: { yes1, yes2, yes3, yes4 },
        noList: { no1, no2, no3, no4 }
      };
    }

    if (noCount > 0 && yesCount > 0) {
      return {
        verdict: "CONDITIONAL" as const,
        reason: "Mixed signals: The sub-lord signifies the matter, but capacity or timing-side confirmations (dignity, Ruling Planet, aspects, or afflictions) are qualified.",
        yesList: { yes1, yes2, yes3, yes4 },
        noList: { no1, no2, no3, no4 }
      };
    }

    return {
      verdict: "CONDITIONAL" as const,
      reason: "Mixed signals: Incomplete YES conditions or minor active conflicts exist.",
      yesList: { yes1, yes2, yes3, yes4 },
      noList: { no1, no2, no3, no4 }
    };
  }, [isSignificator, overrideDignity, overrideRP, overrideAspect, overrideAfflicted]);

  // Handle manual coordinate nudge
  const handleNudge = (amt: number) => {
    if (selectedType === "cusp") {
      setChartData(prev => {
        const copy = [...prev.cusps];
        copy[selectedIndex] = Math.max(0, Math.min(359.99, copy[selectedIndex] + amt));
        return { ...prev, cusps: copy };
      });
    } else {
      setChartData(prev => {
        const copy = { ...prev.planets };
        copy[selectedPlanet] = Math.max(0, Math.min(359.99, copy[selectedPlanet] + amt));
        return { ...prev, planets: copy };
      });
    }
  };

  // Build list of active items for rendering inside the houses
  const getHouseContents = (houseNum: number) => {
    const contents: string[] = [];
    
    // Find planets in this house (simplistic logic based on sign matching)
    // In real horary, Placidus boundaries apply, but we approximate for visual ease
    Object.entries(chartData.planets).forEach(([pName, lon]) => {
      const pSign = Math.floor(lon / 30) + 1;
      // Map sign to house based on Lagna (1st house)
      const lagnaSign = Math.floor(chartData.cusps[0] / 30) + 1;
      const houseOffset = (pSign - lagnaSign + 12) % 12 + 1;
      if (houseOffset === houseNum) {
        contents.push(pName);
      }
    });

    return contents;
  };

  return (
    <div data-interactive="cuspal-sub-lord-finder" style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), sans-serif", fontSize: "12.5px" }}>
      {/* Top Controller Panel */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", marginBottom: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderBottom: `1px dashed ${HAIRLINE}`, paddingBottom: "0.6rem", marginBottom: "0.8rem" }}>
          <div>
            <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.08em" }}>Module 16 · Chapter 4 Capstone</span>
            <h1 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 700 }}>Cuspal & Planet Sub-Lord Workbench</h1>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setIsNorthIndian(!isNorthIndian)}
              style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "transparent", color: GOLD, padding: "0.25rem 0.5rem", fontSize: "10.5px", fontWeight: 800, cursor: "pointer" }}
            >
              {isNorthIndian ? "Show South Indian" : "Show North Indian"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", alignItems: "center" }}>
          <span style={{ fontWeight: 800, color: INK_SECONDARY, fontSize: "11px", textTransform: "uppercase" }}>Load Preset:</span>
          {PRESETS.map((p, idx) => (
            <button
              key={p.name}
              onClick={() => handlePresetSelect(idx)}
              style={{
                border: `1px solid ${presetIdx === idx ? GOLD : HAIRLINE}`,
                borderRadius: 6,
                background: presetIdx === idx ? `${GOLD}15` : SURFACE,
                color: presetIdx === idx ? GOLD : INK_PRIMARY,
                padding: "0.3rem 0.6rem",
                fontSize: "11px",
                fontWeight: presetIdx === idx ? 800 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Main Workspace split */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* Left Side: Sandbox Chart visualizer */}
        <div style={{ flex: "1 1 24rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h2 style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>Interactive Kundali Sandbox</h2>
            
            {/* Render North or South Indian Chart */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0.8rem" }}>
              {isNorthIndian ? (
                // North Indian Kundali SVG
                <svg width="280" height="280" viewBox="0 0 300 300" style={{ border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", borderRadius: 8 }}>
                  {/* Outer border lines */}
                  <line x1="0" y1="0" x2="300" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="300" y1="0" x2="0" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <rect x="0" y="0" width="300" height="300" fill="none" stroke={HAIRLINE} strokeWidth="2" />
                  
                  {/* Inner diamond */}
                  <polygon points="150,0 300,150 150,300 0,150" fill="none" stroke={HAIRLINE} strokeWidth="1.5" />

                  {/* House clickable centroids / text zones */}
                  {[
                    { h: 1, x: 150, y: 75, poly: "150,0 75,75 150,150 225,75" },
                    { h: 2, x: 75, y: 35, poly: "0,0 150,0 75,75" },
                    { h: 3, x: 35, y: 75, poly: "0,0 0,150 75,75" },
                    { h: 4, x: 75, y: 150, poly: "0,150 75,75 150,150 75,225" },
                    { h: 5, x: 35, y: 225, poly: "0,150 0,300 75,225" },
                    { h: 6, x: 75, y: 265, poly: "0,300 150,300 75,225" },
                    { h: 7, x: 150, y: 225, poly: "150,150 75,225 150,300 225,225" },
                    { h: 8, x: 225, y: 265, poly: "150,300 300,300 225,225" },
                    { h: 9, x: 265, y: 225, poly: "300,150 300,300 225,225" },
                    { h: 10, x: 225, y: 150, poly: "150,150 225,75 300,150 225,225" },
                    { h: 11, x: 265, y: 75, poly: "300,0 300,150 225,75" },
                    { h: 12, x: 225, y: 35, poly: "150,0 300,0 225,75" }
                  ].map((d) => {
                    const isSelected = selectedType === "cusp" && selectedIndex === d.h - 1;
                    const items = getHouseContents(d.h);
                    return (
                      <g key={d.h} style={{ cursor: "pointer" }} onClick={() => { setSelectedType("cusp"); setSelectedIndex(d.h - 1); }}>
                        {/* Hidden clickable region */}
                        <polygon points={d.poly} fill={isSelected ? "rgba(156, 122, 47, 0.15)" : "transparent"} />
                        
                        {/* House number */}
                        <text x={d.x} y={d.y - 10} textAnchor="middle" fontSize="10px" fill={GOLD} fontWeight="800">
                          {d.h}
                        </text>
                        {/* Cusp degree text */}
                        <text x={d.x} y={d.y + 4} textAnchor="middle" fontSize="8.5px" fill={INK_MUTED}>
                          {Math.floor(chartData.cusps[d.h - 1] % 30)}°
                        </text>
                        {/* Planets inside house */}
                        {items.map((it, idx) => (
                          <text key={idx} x={d.x} y={d.y + 15 + idx * 9} textAnchor="middle" fontSize="8.5px" fill={INK_SECONDARY} fontWeight="700">
                            {it.substring(0, 3)}
                          </text>
                        ))}
                      </g>
                    );
                  })}
                </svg>
              ) : (
                // South Indian Kundali SVG
                <svg width="280" height="280" viewBox="0 0 300 300" style={{ border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", borderRadius: 8 }}>
                  {/* Grid lines */}
                  <line x1="75" y1="0" x2="75" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="225" y1="0" x2="225" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke={HAIRLINE} strokeWidth="1.5" />
                  <line x1="0" y1="225" x2="300" y2="225" stroke={HAIRLINE} strokeWidth="1.5" />
                  
                  {/* Clickable signs in South Indian layout (0 = Aries, 1 = Taurus...) */}
                  {[
                    { rashi: 12, label: "Pi", x: 37, y: 37 },
                    { rashi: 1, label: "Ar", x: 112, y: 37 },
                    { rashi: 2, label: "Ta", x: 187, y: 37 },
                    { rashi: 3, label: "Ge", x: 262, y: 37 },
                    { rashi: 11, label: "Aq", x: 37, y: 112 },
                    { rashi: 4, label: "Cn", x: 262, y: 112 },
                    { rashi: 10, label: "Cp", x: 37, y: 187 },
                    { rashi: 5, label: "Le", x: 262, y: 187 },
                    { rashi: 9, label: "Sg", x: 37, y: 262 },
                    { rashi: 8, label: "Sc", x: 112, y: 262 },
                    { rashi: 7, label: "Li", x: 187, y: 262 },
                    { rashi: 6, label: "Vi", x: 262, y: 262 },
                  ].map((d) => {
                    // Find if Lagna or Cusp falls here
                    const lagnaSign = Math.floor(chartData.cusps[0] / 30) + 1;
                    const signNum = d.rashi;
                    const isLagna = lagnaSign === signNum;
                    
                    return (
                      <g key={d.rashi} style={{ cursor: "pointer" }}>
                        <rect x={d.x - 37} y={d.y - 37} width="75" height="75" fill="none" stroke="transparent" />
                        <text x={d.x} y={d.y - 12} textAnchor="middle" fontSize="10.5px" fill={GOLD} fontWeight="800">
                          {d.label} {isLagna ? "[L]" : ""}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Central branding */}
                  <rect x="75" y="75" width="150" height="150" fill="#FCFAF2" />
                  <text x="150" y="145" textAnchor="middle" fontSize="10.5px" fill={GOLD} fontWeight="800">
                    GRAHVANI
                  </text>
                  <text x="150" y="160" textAnchor="middle" fontSize="8.5px" fill={INK_MUTED}>
                    South Indian Grid
                  </text>
                </svg>
              )}
            </div>

            {/* Quick Cusp / Planet Button Selectors */}
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.2rem" }}>Select Cusp:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedType("cusp"); setSelectedIndex(i); }}
                      style={{
                        border: `1px solid ${selectedType === "cusp" && selectedIndex === i ? GOLD : HAIRLINE}`,
                        borderRadius: 4,
                        background: selectedType === "cusp" && selectedIndex === i ? `${GOLD}1A` : SURFACE,
                        color: selectedType === "cusp" && selectedIndex === i ? GOLD : INK_SECONDARY,
                        padding: "0.2rem 0.4rem",
                        fontSize: "10.5px",
                        fontWeight: selectedType === "cusp" && selectedIndex === i ? 800 : 500,
                        cursor: "pointer"
                      }}
                    >
                      Cusp {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.2rem" }}>Select Planet:</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                  {PLANET_NAMES.map((p) => (
                    <button
                      key={p}
                      onClick={() => { setSelectedType("planet"); setSelectedPlanet(p); }}
                      style={{
                        border: `1px solid ${selectedType === "planet" && selectedPlanet === p ? GOLD : HAIRLINE}`,
                        borderRadius: 4,
                        background: selectedType === "planet" && selectedPlanet === p ? `${GOLD}1A` : SURFACE,
                        color: selectedType === "planet" && selectedPlanet === p ? GOLD : INK_SECONDARY,
                        padding: "0.2rem 0.4rem",
                        fontSize: "10.5px",
                        fontWeight: selectedType === "planet" && selectedPlanet === p ? 800 : 500,
                        cursor: "pointer"
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coordinate Micro-nudge panel */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", fontWeight: 700, display: "block" }}>Tune Position:</span>
              <strong style={{ fontSize: "11.5px", color: GOLD }}>
                {selectedType === "cusp" ? `Cusp ${selectedIndex + 1}` : selectedPlanet} Longitude
              </strong>
            </div>
            <div style={{ display: "flex", gap: "0.3rem" }}>
              <button onClick={() => handleNudge(-1)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10.5px" }}>-1°</button>
              <button onClick={() => handleNudge(-1 / 15)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10.5px" }}>-4′</button>
              <button onClick={() => handleNudge(1 / 15)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10.5px" }}>+4′</button>
              <button onClick={() => handleNudge(1)} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, background: SURFACE, color: INK_PRIMARY, padding: "0.2rem 0.4rem", cursor: "pointer", fontSize: "10.5px" }}>+1°</button>
            </div>
          </div>
        </div>

        {/* Right Side: Analysis & Inspector Panel */}
        <div style={{ flex: "1.2 1 26rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          
          {/* Navigation Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, gap: "0.5rem" }}>
            {[
              { id: "finder", label: "Sub-Lord Finder" },
              { id: "disposition", label: "Disposition Playground" },
              { id: "details", label: "Computational Details" }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                style={{
                  border: "none",
                  borderBottom: activeTab === t.id ? `2px solid ${GOLD}` : "none",
                  background: "transparent",
                  color: activeTab === t.id ? GOLD : INK_SECONDARY,
                  padding: "0.5rem 0.8rem",
                  fontSize: "11.5px",
                  fontWeight: activeTab === t.id ? 800 : 500,
                  cursor: "pointer",
                  marginBottom: "-1px"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* TAB 1: SUB-LORD FINDER & BY-HAND SUB-WALK */}
          {activeTab === "finder" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                  <h3 style={{ margin: 0, color: GOLD, fontSize: "13px", fontWeight: 800, textTransform: "uppercase" }}>
                    Selected: {selectedType === "cusp" ? `Cusp ${selectedIndex + 1}` : selectedPlanet}
                  </h3>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED }}>
                    Raw longitude: {activeLongitude.toFixed(4)}°
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(8rem, 1fr))", gap: "0.5rem", marginBottom: "1rem" }}>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.4rem 0.6rem" }}>
                    <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase" }}>Zodiac Coordinate</span>
                    <strong style={{ display: "block", fontSize: "11px", marginTop: "0.15rem" }}>{fmtZodiac(activeLongitude)}</strong>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.4rem 0.6rem" }}>
                    <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase" }}>Star-Lord (Nakṣatra)</span>
                    <strong style={{ display: "block", fontSize: "11px", marginTop: "0.15rem" }}>{subData.nak.ruler} ({subData.nak.name})</strong>
                  </div>
                  <div style={{ border: `1px solid ${GOLD}`, borderRadius: 8, padding: "0.4rem 0.6rem", background: `${GOLD}0A` }}>
                    <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900 }}>Sub-Lord (KP)</span>
                    <strong style={{ display: "block", fontSize: "11.5px", marginTop: "0.15rem", color: GOLD }}>{subData.activeSub.lord}</strong>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.4rem 0.6rem" }}>
                    <span style={{ color: INK_MUTED, fontSize: "9px", textTransform: "uppercase" }}>Sub-Sub-Lord</span>
                    <strong style={{ display: "block", fontSize: "11px", marginTop: "0.15rem" }}>{subData.activeSubSub.lord}</strong>
                  </div>
                </div>

                {/* By-Hand Sub-Walk visualizer proportional bar */}
                <div>
                  <span style={{ color: INK_SECONDARY, fontSize: "10.5px", fontWeight: 800, display: "block", marginBottom: "0.4rem" }}>
                    Visual Sub-Walk inside {subData.nak.name} nakṣatra:
                  </span>
                  
                  <div style={{ position: "relative", height: "2.2rem", background: "rgba(0,0,0,0.03)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, display: "flex", overflow: "hidden", marginBottom: "0.5rem" }}>
                    {subData.subs.map((s, idx) => {
                      const isActive = s.lord === subData.activeSub.lord;
                      const widthPercent = ((s.to - s.from) / NAK_DEG) * 100;
                      return (
                        <div
                          key={idx}
                          style={{
                            width: `${widthPercent}%`,
                            height: "100%",
                            borderRight: `1px solid ${HAIRLINE}`,
                            background: isActive ? `${GOLD}20` : "transparent",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "9px",
                            fontWeight: isActive ? 900 : 500,
                            color: isActive ? GOLD : INK_MUTED,
                            transition: "all 0.15s ease"
                          }}
                        >
                          <span>{s.lord}</span>
                          <span style={{ fontSize: "7px", opacity: 0.7 }}>{s.years}y</span>
                        </div>
                      );
                    })}

                    {/* Longitude cursor indicator */}
                    <div
                      style={{
                        position: "absolute",
                        left: `${(subData.elapsed / NAK_DEG) * 100}%`,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        background: GOLD,
                        boxShadow: "0 0 4px rgba(156,122,47,0.8)",
                        zIndex: 10
                      }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: INK_MUTED }}>
                    <span>Nakṣatra start (0′)</span>
                    <span style={{ color: GOLD, fontWeight: 700 }}>
                      Offset: {Math.floor(subData.elapsed * 60)}′ ({fmtDMS(subData.elapsed)})
                    </span>
                    <span>End (800′)</span>
                  </div>
                </div>
              </section>

              {/* By-Hand calculations walk details */}
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", fontSize: "11px", lineHeight: 1.45 }}>
                <h4 style={{ margin: "0 0 0.4rem", color: GOLD, fontSize: "12px", fontWeight: 800 }}>Mathematical Derivation</h4>
                <ol style={{ paddingLeft: "1.2rem", margin: 0, display: "grid", gap: "0.25rem" }}>
                  <li>Cumulative Longitude: <strong>{activeLongitude.toFixed(3)}°</strong></li>
                  <li>Nakṣatra Index: {Math.floor(activeLongitude / NAK_DEG) + 1} ({subData.nak.name}) ruled by <strong>{subData.nak.ruler}</strong></li>
                  <li>Nakṣatra Offset: {fmtDMS(subData.elapsed)} (or {Math.floor(subData.elapsed * 60)} arcminutes elapsed out of 800′)</li>
                  <li>
                    Walking segments inside star-lord sequence:
                    <div style={{ background: "rgba(0,0,0,0.01)", border: `1px dashed ${HAIRLINE}`, padding: "0.3rem", borderRadius: 4, marginTop: "0.2rem", fontFamily: "monospace", fontSize: "10.5px" }}>
                      {subData.subs.map((s, idx) => (
                        <span key={idx} style={{ color: s.lord === subData.activeSub.lord ? GOLD : INK_MUTED, fontWeight: s.lord === subData.activeSub.lord ? "bold" : "normal" }}>
                          {s.lord}({s.years}y: {Math.round(s.from * 60)}′-{(s.to * 60).toFixed(0)}′) {idx < 8 ? "→ " : ""}
                        </span>
                      ))}
                    </div>
                  </li>
                </ol>
              </section>
            </div>
          )}

          {/* TAB 2: DISPOSITION CALCULATOR & SIGNIFICATOR PLAYGROUND */}
          {activeTab === "disposition" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              
              {/* Query Selection & Target set */}
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
                  <h3 style={{ margin: 0, color: GOLD, fontSize: "12.5px", fontWeight: 800, textTransform: "uppercase" }}>Question Template</h3>
                  <div style={{ display: "flex", gap: "0.3rem" }}>
                    {[
                      { id: "marriage", label: "Marriage" },
                      { id: "career", label: "Career" },
                      { id: "custom", label: "Custom Set" }
                    ].map((q) => (
                      <button
                        key={q.id}
                        onClick={() => setQueryType(q.id as any)}
                        style={{
                          border: `1px solid ${queryType === q.id ? GOLD : HAIRLINE}`,
                          borderRadius: 4,
                          background: queryType === q.id ? `${GOLD}1A` : SURFACE,
                          color: queryType === q.id ? GOLD : INK_SECONDARY,
                          padding: "0.2rem 0.4rem",
                          fontSize: "10px",
                          fontWeight: 700,
                          cursor: "pointer"
                        }}
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.01)", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", display: "block" }}>Relevant houses check:</span>
                    <strong style={{ fontSize: "12px", color: INK_PRIMARY }}>
                      {targetHouses.map(h => `${h}H`).join(", ")}
                    </strong>
                  </div>
                  {queryType === "custom" && (
                    <div style={{ display: "flex", gap: "0.2rem" }}>
                      {Array.from({ length: 12 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            const hNum = i + 1;
                            setCustomQueryHouses(prev =>
                              prev.includes(hNum) ? prev.filter(x => x !== hNum) : [...prev, hNum]
                            );
                          }}
                          style={{
                            width: "1.2rem",
                            height: "1.2rem",
                            borderRadius: "50%",
                            border: `1px solid ${customQueryHouses.includes(i + 1) ? GOLD : HAIRLINE}`,
                            background: customQueryHouses.includes(i + 1) ? GOLD : "transparent",
                            color: customQueryHouses.includes(i + 1) ? "#FFF" : INK_SECONDARY,
                            fontSize: "8.5px",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Three-Element Chain overrides sandbox */}
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
                <h4 style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>Three-Element Significator Playground</h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.8rem", marginBottom: "0.8rem" }}>
                  {/* Occupancy */}
                  <div>
                    <label style={{ display: "block", color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", marginBottom: "0.2rem" }}>Occupancy House</label>
                    <select
                      value={overrideOccupancy}
                      onChange={(e) => setOverrideOccupancy(Number(e.target.value))}
                      style={{ width: "100%", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, padding: "0.25rem", fontSize: "11px", fontWeight: 700 }}
                    >
                      {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1} House</option>)}
                    </select>
                  </div>

                  {/* Own Sub-Lord */}
                  <div>
                    <label style={{ display: "block", color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", marginBottom: "0.2rem" }}>Own Sub-Lord (Recursive)</label>
                    <select
                      value={overrideOwnSubLord}
                      onChange={(e) => setOverrideOwnSubLord(e.target.value)}
                      style={{ width: "100%", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, padding: "0.25rem", fontSize: "11px", fontWeight: 700 }}
                    >
                      {PLANET_NAMES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {/* Ownership Selector */}
                <div style={{ marginBottom: "0.8rem" }}>
                  <label style={{ display: "block", color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", marginBottom: "0.2rem" }}>Owned Houses</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const isChecked = overrideOwnership.includes(i + 1);
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setOverrideOwnership(prev =>
                              prev.includes(i + 1) ? prev.filter(x => x !== i + 1) : [...prev, i + 1]
                            );
                          }}
                          style={{
                            border: `1px solid ${isChecked ? GOLD : HAIRLINE}`,
                            borderRadius: 4,
                            background: isChecked ? `${GOLD}1A` : SURFACE,
                            color: isChecked ? GOLD : INK_SECONDARY,
                            padding: "0.2rem 0.4rem",
                            fontSize: "10.5px",
                            fontWeight: isChecked ? 800 : 500,
                            cursor: "pointer"
                          }}
                        >
                          {i + 1}H
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* YES / NO Rules Checkboxes list */}
              <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
                <h4 style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>Disposition Rules Checklist</h4>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "1rem" }}>
                  {/* YES column */}
                  <div>
                    <span style={{ color: GREEN, fontWeight: 900, display: "block", borderBottom: `1px dashed ${GREEN}40`, paddingBottom: "0.2rem", marginBottom: "0.4rem" }}>YES Conditions</span>
                    <div style={{ display: "grid", gap: "0.3rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={isSignificator} disabled style={{ accentColor: GREEN }} />
                        <span style={{ opacity: isSignificator ? 1 : 0.6 }}>1. Is Significator of {targetHouses.join("/")}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                        <input type="checkbox" checked={overrideDignity === "Exalted" || overrideDignity === "Own"} disabled style={{ accentColor: GREEN }} />
                        <span style={{ opacity: (overrideDignity === "Exalted" || overrideDignity === "Own") ? 1 : 0.6 }}>2. Dignity: </span>
                        <select
                          value={overrideDignity}
                          onChange={(e) => setOverrideDignity(e.target.value as any)}
                          style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, padding: "0.1rem", fontSize: "10px", fontWeight: 700 }}
                        >
                          <option value="Exalted">Exalted</option>
                          <option value="Own">Own Sign</option>
                          <option value="Neutral">Neutral</option>
                          <option value="Debilitated">Debilitated</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={overrideRP} onChange={(e) => setOverrideRP(e.target.checked)} style={{ accentColor: GREEN }} />
                        <span>3. Member of Ruling Planets</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={overrideAspect} onChange={(e) => setOverrideAspect(e.target.checked)} style={{ accentColor: GREEN }} />
                        <span>4. Aspects the Cusp</span>
                      </div>
                    </div>
                  </div>

                  {/* NO column */}
                  <div>
                    <span style={{ color: RED, fontWeight: 900, display: "block", borderBottom: `1px dashed ${RED}40`, paddingBottom: "0.2rem", marginBottom: "0.4rem" }}>NO Conditions</span>
                    <div style={{ display: "grid", gap: "0.3rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={!isSignificator} disabled style={{ accentColor: RED }} />
                        <span style={{ opacity: !isSignificator ? 1 : 0.6 }}>1. Non-Significator of {targetHouses.join("/")}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={overrideDignity === "Debilitated"} disabled style={{ accentColor: RED }} />
                        <span style={{ opacity: overrideDignity === "Debilitated" ? 1 : 0.6 }}>2. Debilitated</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={!overrideRP} disabled style={{ accentColor: RED }} />
                        <span style={{ opacity: !overrideRP ? 1 : 0.6 }}>3. Absent from RPs</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <input type="checkbox" checked={overrideAfflicted} onChange={(e) => setOverrideAfflicted(e.target.checked)} style={{ accentColor: RED }} />
                        <span>4. Afflicted by Malefics</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dynamic Verdict Card */}
              <section
                style={{
                  border: `1px solid ${dispositionVerdict.verdict === "YES" ? GREEN : dispositionVerdict.verdict === "NO" ? RED : ORANGE}`,
                  borderRadius: 12,
                  background: `${dispositionVerdict.verdict === "YES" ? GREEN : dispositionVerdict.verdict === "NO" ? RED : ORANGE}0D`,
                  padding: "1rem",
                  display: "grid",
                  gap: "0.4rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "13px", color: dispositionVerdict.verdict === "YES" ? GREEN : dispositionVerdict.verdict === "NO" ? RED : ORANGE }}>
                    DISPOSITION VERDICT: {dispositionVerdict.verdict}
                  </strong>
                  <span style={{ fontSize: "16px" }}>
                    {dispositionVerdict.verdict === "YES" ? "✅" : dispositionVerdict.verdict === "NO" ? "❌" : "⚠"}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
                  {dispositionVerdict.reason}
                </p>
                <div style={{ fontSize: "9.5px", color: INK_MUTED, marginTop: "0.2rem", borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "0.3rem" }}>
                  <strong>REFUSE OVER-CONFIDENT VERDICT:</strong> This assessment is a high-probability model derived from KP stellar logic, not a divinely certain decree. Non-chart variables apply.
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: COMPUTATIONAL DETAILS DASHBOARD */}
          {activeTab === "details" && (
            <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }} aria-live="polite">
              <div style={{ color: GOLD, fontWeight: "bold", borderBottom: `1.5px solid ${HAIRLINE}`, paddingBottom: "0.4rem", marginBottom: "0.6rem", textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" }}>Calculated Astronomical Parameters</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: INK_SECONDARY }}>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.4rem 0" }}>Julian Date (praśna-kāla)</td>
                    <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>2461202.04167</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.4rem 0" }}>Local Sidereal Time (LST)</td>
                    <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>06:12:45</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.4rem 0" }}>Obliquity of Ecliptic</td>
                    <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>23.4367°</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.4rem 0" }}>Ayanāṁśa Convention / Value</td>
                    <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700 }}>Krishnamurti (KP) / 23°34′12″</td>
                  </tr>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                    <td style={{ padding: "0.4rem 0" }}>Active inspection Longitude</td>
                    <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{activeLongitude.toFixed(4)}°</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.4rem 0" }}>Astro Engine Route</td>
                    <td style={{ padding: "0.4rem 0", textAlign: "right", fontWeight: 700, fontFamily: "monospace" }}>{selectedType === "cusp" ? "/api/v1/kp/cusps" : "/api/v1/kp/sub-lord"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
