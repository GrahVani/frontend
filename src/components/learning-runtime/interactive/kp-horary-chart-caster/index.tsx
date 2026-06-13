"use client";

import { useState, useMemo } from "react";
import { generate249Subs, formatZodiac, SIGNS } from "../kp-horary-utils";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const RED = "#A23A1E";

// Pre-calculated cusps for Example 1 (Number 137, time 14:52 Bengaluru, Virgo Lagna)
const EXAMPLE_CUSPS_CORRECT = [
  { house: 1, signIdx: 5, longitude: "24°13′20″ Kanyā", starLord: "Sun", subLord: "Moon" },
  { house: 2, signIdx: 6, longitude: "22°40′00″ Tulā", starLord: "Jupiter", subLord: "Saturn" },
  { house: 3, signIdx: 7, longitude: "23°15′10″ Vṛścika", starLord: "Mercury", subLord: "Moon" },
  { house: 4, signIdx: 8, longitude: "25°10′30″ Dhanus", starLord: "Venus", subLord: "Mercury" },
  { house: 5, signIdx: 9, longitude: "27°30′00″ Makara", starLord: "Mars", subLord: "Jupiter" },
  { house: 6, signIdx: 10, longitude: "29°12′40″ Kumbha", starLord: "Jupiter", subLord: "Sun" },
  { house: 7, signIdx: 11, longitude: "24°13′20″ Mīna", starLord: "Mercury", subLord: "Moon" },
  { house: 8, signIdx: 0, longitude: "22°40′00″ Meṣa", starLord: "Venus", subLord: "Saturn" },
  { house: 9, signIdx: 1, longitude: "23°15′10″ Vṛṣabha", starLord: "Moon", subLord: "Moon" },
  { house: 10, signIdx: 2, longitude: "25°10′30″ Mithuna", starLord: "Rahu", subLord: "Mercury" },
  { house: 11, signIdx: 3, longitude: "27°30′00″ Karka", starLord: "Mercury", subLord: "Jupiter" },
  { house: 12, signIdx: 4, longitude: "29°12′40″ Siṁha", starLord: "Sun", subLord: "Sun" }
];

// If using rising sign instead of number (Gemini Lagna at 14:52 Bengaluru)
const EXAMPLE_CUSPS_WRONG = [
  { house: 1, signIdx: 2, longitude: "12°15′40″ Mithuna", starLord: "Rahu", subLord: "Saturn" },
  { house: 2, signIdx: 3, longitude: "08°45′20″ Karka", starLord: "Saturn", subLord: "Venus" },
  { house: 3, signIdx: 4, longitude: "05°10′00″ Siṁha", starLord: "Ketu", starLord2: "Sun", subLord: "Mercury" },
  { house: 4, signIdx: 5, longitude: "04°50′10″ Kanyā", starLord: "Sun", subLord: "Saturn" },
  { house: 5, signIdx: 6, longitude: "07°30′00″ Tulā", starLord: "Rahu", subLord: "Rahu" },
  { house: 6, signIdx: 7, longitude: "11°12′40″ Vṛścika", starLord: "Saturn", subLord: "Moon" },
  { house: 7, signIdx: 8, longitude: "12°15′40″ Dhanus", starLord: "Ketu", subLord: "Saturn" },
  { house: 8, signIdx: 9, longitude: "08°45′20″ Makara", starLord: "Sun", subLord: "Venus" },
  { house: 9, signIdx: 10, longitude: "05°10′00″ Kumbha", starLord: "Mars", subLord: "Mercury" },
  { house: 10, signIdx: 11, longitude: "04°50′10″ Mīna", starLord: "Saturn", subLord: "Saturn" },
  { house: 11, signIdx: 0, longitude: "07°30′00″ Meṣa", starLord: "Ketu", subLord: "Rahu" },
  { house: 12, signIdx: 1, longitude: "11°12′40″ Vṛṣabha", starLord: "Moon", subLord: "Moon" }
];

const EXAMPLE_PLANETS = [
  { name: "Sun", longitude: "13°41′ Taurus", house: 9 },
  { name: "Moon", longitude: "09°22′ Capricorn", house: 5 },
  { name: "Mars", longitude: "04°06′ Cancer", house: 11 },
  { name: "Mercury", longitude: "22°12′ Aries", house: 8 },
  { name: "Jupiter", longitude: "16°08′ Taurus", house: 9 },
  { name: "Venus", longitude: "29°10′ Gemini", house: 10 },
  { name: "Saturn", longitude: "28°15′ Aquarius", house: 6 },
  { name: "Rahu", longitude: "09°12′ Capricorn", house: 5 },
  { name: "Ketu", longitude: "09°12′ Cancer", house: 11 }
];

export function KpHoraryChartCaster() {
  const allSubs = useMemo(() => generate249Subs(), []);
  
  const [horaryNum, setHoraryNum] = useState<number>(137);
  const [timeOffset, setTimeOffset] = useState<number>(0); // sliders to nudge time
  const [isCorrectMethod, setIsCorrectMethod] = useState<boolean>(true);

  const activeSub = useMemo(() => {
    return allSubs.find((s) => s.number === horaryNum) || allSubs[0];
  }, [allSubs, horaryNum]);

  // Checklist computation based on user input state
  const checklist = useMemo(() => {
    return [
      { id: 1, text: "Record Question Time & Place (Bengaluru, 14:52)", done: true },
      { id: 2, text: `Receive named number from querent (${horaryNum})`, done: horaryNum >= 1 && horaryNum <= 249 },
      { id: 3, text: `Anchor Ascendant to ${isCorrectMethod ? "number-fixed sub-arc" : "rising sign (wrong method)"}`, done: true },
      { id: 4, text: "Calculate remaining Placidus cusps & planets", done: true },
      { id: 5, text: `Compile Ruling Planets (Day: Mars, Moon: Saturn)`, done: true }
    ];
  }, [horaryNum, isCorrectMethod]);

  const activeCusps = useMemo(() => {
    const listCorrect = [10453.33, 12160, 13995.17, 15910.5, 17850, 19752.67, 21253.33, 1360, 3195.17, 5110.5, 7050, 8952.67];
    const listWrong = [4335.67, 5925.33, 7510, 9290.17, 11250, 13272.67, 15135.67, 16725.33, 18310, 20090.17, 450, 2472.67];

    return Array.from({ length: 12 }, (_, idx) => {
      const houseNum = idx + 1;
      let absMin = 0;

      if (isCorrectMethod) {
        if (houseNum === 1) {
          // Locked to the selected sub
          absMin = activeSub.absFrom;
        } else {
          // Other houses shift with time offset (15 arc minutes per minute of time)
          const baseMin = listCorrect[idx];
          absMin = (baseMin + timeOffset * 15 + 360 * 60) % (360 * 60);
        }
      } else {
        // Wrong method: all houses shift with time offset
        const baseMin = listWrong[idx];
        absMin = (baseMin + timeOffset * 15 + 360 * 60) % (360 * 60);
      }

      // Find the resolved 249 sub
      const sub = allSubs.find(s => absMin >= s.absFrom && absMin < s.absTo) || allSubs[0];

      return {
        house: houseNum,
        signIdx: Math.floor(absMin / 1800) % 12,
        longitude: formatZodiac(absMin),
        starLord: sub.starLord,
        subLord: sub.subLord
      };
    });
  }, [activeSub, isCorrectMethod, timeOffset, allSubs]);

  const lagnaRashiIdx = activeCusps[0].signIdx;

  // North Indian Kundali SVG Paths (400x400)
  const housePaths = [
    { id: 1, path: "M 200,200 L 100,100 L 200,0 L 300,100 Z", textX: 200, textY: 70, numberX: 200, numberY: 30 },
    { id: 2, path: "M 0,0 L 200,0 L 100,100 Z", textX: 100, textY: 40, numberX: 50, numberY: 30 },
    { id: 3, path: "M 0,0 L 0,200 L 100,100 Z", textX: 40, textY: 100, numberX: 30, numberY: 50 },
    { id: 4, path: "M 200,200 L 100,100 L 0,200 L 100,300 Z", textX: 70, textY: 200, numberX: 30, numberY: 200 },
    { id: 5, path: "M 0,400 L 0,200 L 100,300 Z", textX: 40, textY: 300, numberX: 30, numberY: 350 },
    { id: 6, path: "M 0,400 L 200,400 L 100,300 Z", textX: 100, textY: 360, numberX: 50, numberY: 375 },
    { id: 7, path: "M 200,200 L 100,300 L 200,400 L 300,300 Z", textX: 200, textY: 330, numberX: 200, numberY: 370 },
    { id: 8, path: "M 400,400 L 200,400 L 300,300 Z", textX: 300, textY: 360, numberX: 350, numberY: 375 },
    { id: 9, path: "M 400,400 L 400,200 L 300,300 Z", textX: 360, textY: 300, numberX: 370, numberY: 350 },
    { id: 10, path: "M 200,200 L 300,300 L 400,200 L 300,100 Z", textX: 330, textY: 200, numberX: 370, numberY: 200 },
    { id: 11, path: "M 400,0 L 400,200 L 300,100 Z", textX: 360, textY: 100, numberX: 370, numberY: 50 },
    { id: 12, path: "M 400,0 L 200,0 L 300,100 Z", textX: 300, textY: 40, numberX: 350, numberY: 30 }
  ];

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "24px", color: INK_PRIMARY }} data-interactive="kp-horary-chart-caster">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1rem", marginBottom: "1.5rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 7 · Lesson 2</span>
        <h1 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.5rem", fontWeight: 700 }}>KP Horary Chart Caster Workbench</h1>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left Column: Caster Controls, Checklist, and Tables */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Controls Panel */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0 0 12px" }}>1. Casting Inputs</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>Horary Number (1-249)</label>
                <input
                  type="number"
                  min="1"
                  max="249"
                  value={horaryNum}
                  onChange={(e) => setHoraryNum(Math.max(1, Math.min(249, parseInt(e.target.value) || 1)))}
                  style={{ width: "100%", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontSize: "0.85rem" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>Casting Method</label>
                <select
                  value={isCorrectMethod ? "correct" : "wrong"}
                  onChange={(e) => setIsCorrectMethod(e.target.value === "correct")}
                  style={{ width: "100%", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontWeight: 700, fontSize: "0.8rem" }}
                >
                  <option value="correct">KP (Number Lagna)</option>
                  <option value="wrong">Moment (Rising Lagna)</option>
                </select>
              </div>
            </div>

            {/* Time Nudge Slider */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: INK_SECONDARY, marginBottom: "4px" }}>
                <span>Nudge Cusp Moment:</span>
                <span style={{ color: GOLD, fontWeight: 700 }}>{timeOffset >= 0 ? `+${timeOffset}` : timeOffset} minutes</span>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                value={timeOffset}
                onChange={(e) => setTimeOffset(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: GOLD }}
              />
            </div>
          </div>

          {/* 5-Step Checklist */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
            <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0 0 12px" }}>2. Casting Progress</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {checklist.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.88rem" }}>
                  <span style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: `1.5px solid ${GOLD}`,
                    background: item.done ? GOLD : "transparent",
                    color: item.done ? SURFACE : GOLD,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.65rem",
                    fontWeight: 900
                  }}>
                    {item.done ? "✓" : item.id}
                  </span>
                  <span style={{ color: item.done ? INK_PRIMARY : INK_MUTED, textDecoration: item.done ? "none" : "line-through" }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Visual North Indian Chart */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.1rem", color: GOLD, margin: "0 0 12px", width: "100%" }}>3. Visual Cusp Caster</h2>
          
          <div style={{ position: "relative", width: "260px", height: "260px", background: SURFACE }}>
            <svg viewBox="0 0 400 400" width="100%" height="100%">
              {/* Outer frame */}
              <rect x="0" y="0" width="400" height="400" fill="none" stroke={GOLD} strokeWidth="3" />
              
              {/* Diagonals */}
              <line x1="0" y1="0" x2="400" y2="400" stroke={GOLD} strokeWidth="1.5" />
              <line x1="400" y1="0" x2="0" y2="400" stroke={GOLD} strokeWidth="1.5" />
              
              {/* Inner Diamond */}
              <path d="M 200,0 L 400,200 L 200,400 L 0,200 Z" fill="none" stroke={GOLD} strokeWidth="1.5" />

              {/* Renders sign index inside cells */}
              {housePaths.map((hp) => {
                const currentSignNum = ((lagnaRashiIdx + hp.id - 1) % 12) + 1;
                const isLagna = hp.id === 1;
                return (
                  <g key={hp.id}>
                    {isLagna && (
                      <path d={hp.path} fill={`${GOLD}1a`} stroke={GOLD} strokeWidth="2.5" />
                    )}
                    <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="12" fill={isLagna ? GOLD : INK_MUTED} fontWeight="900">
                      {currentSignNum}
                    </text>
                    <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="12" fill={isLagna ? GOLD : INK_PRIMARY} fontWeight="bold">
                      H{hp.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          <div style={{ marginTop: "12px", textAlign: "center", fontSize: "0.8rem", color: INK_SECONDARY }}>
            Ascendant Sign: <strong style={{ color: GOLD }}>{SIGNS[lagnaRashiIdx]}</strong> ({isCorrectMethod ? "Fixed from Selector" : "Moment's Rising"})
          </div>
        </div>

      </div>

      {/* Footer Tables: Cusps & Planets (replaces developer console logs) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
        
        {/* Cusp Table */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
          <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 10px" }}>Cuspal Positions (Placidus)</h3>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
                  <th style={{ textAlign: "left", padding: "6px" }}>House</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Cusp Longitude</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Star Lord</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Sub Lord</th>
                </tr>
              </thead>
              <tbody>
                {activeCusps.map((c) => (
                  <tr key={c.house} style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                    <td style={{ padding: "6px", fontWeight: 700 }}>H{c.house}</td>
                    <td style={{ padding: "6px" }}>{c.longitude}</td>
                    <td style={{ padding: "6px" }}>{c.starLord}</td>
                    <td style={{ padding: "6px", color: GOLD, fontWeight: 700 }}>{c.subLord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Planet Table */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "16px", background: SURFACE }}>
          <h3 style={{ fontSize: "1rem", color: GOLD, margin: "0 0 10px" }}>Planetary Longitudes</h3>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD }}>
                  <th style={{ textAlign: "left", padding: "6px" }}>Graha</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>Longitude</th>
                  <th style={{ textAlign: "left", padding: "6px" }}>KP House Cusp</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_PLANETS.map((p) => {
                  // Adjust planet house based on Lagna method
                  const resolvedHouse = isCorrectMethod ? p.house : ((p.house + 8) % 12 || 12);
                  return (
                    <tr key={p.name} style={{ borderBottom: `1px dashed ${HAIRLINE}` }}>
                      <td style={{ padding: "6px", fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: "6px" }}>{p.longitude}</td>
                      <td style={{ padding: "6px", fontWeight: 700 }}>House {resolvedHouse}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
