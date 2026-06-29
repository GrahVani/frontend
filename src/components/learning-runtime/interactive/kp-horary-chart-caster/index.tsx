"use client";

import { useState, useMemo } from "react";
import { generate249Subs, formatZodiac, SIGNS } from "../kp-horary-utils";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const BLUE = "#356CAB";

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
  const [timeOffset, setTimeOffset] = useState<number>(0); // in minutes
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

  // Compute active cusps dynamically based on timeOffset and selected method
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

  // Compute alternative wrong method cusps for the side-by-side visual sandbox comparison
  const driftingCusps = useMemo(() => {
    const listWrong = [4335.67, 5925.33, 7510, 9290.17, 11250, 13272.67, 15135.67, 16725.33, 18310, 20090.17, 450, 2472.67];
    return Array.from({ length: 12 }, (_, idx) => {
      const houseNum = idx + 1;
      const baseMin = listWrong[idx];
      const absMin = (baseMin + timeOffset * 15 + 360 * 60) % (360 * 60);
      return {
        house: houseNum,
        signIdx: Math.floor(absMin / 1800) % 12,
        longitude: formatZodiac(absMin)
      };
    });
  }, [timeOffset]);

  const lagnaRashiIdx = activeCusps[0].signIdx;
  const driftLagnaRashiIdx = driftingCusps[0].signIdx;

  const housePaths = [
    { id: 1, path: "M 100,100 L 50,50 L 100,0 L 150,50 Z", textX: 100, textY: 35, numberX: 100, numberY: 15 },
    { id: 2, path: "M 0,0 L 100,0 L 50,50 Z", textX: 50, textY: 20, numberX: 25, numberY: 15 },
    { id: 3, path: "M 0,0 L 0,100 L 50,50 Z", textX: 20, textY: 50, numberX: 15, numberY: 25 },
    { id: 4, path: "M 100,100 L 50,50 L 0,100 L 50,150 Z", textX: 35, textY: 100, numberX: 15, numberY: 100 },
    { id: 5, path: "M 0,200 L 0,100 L 50,150 Z", textX: 20, textY: 150, numberX: 15, numberY: 175 },
    { id: 6, path: "M 0,200 L 100,200 L 50,150 Z", textX: 50, textY: 180, numberX: 25, numberY: 187 },
    { id: 7, path: "M 100,100 L 50,150 L 100,200 L 150,150 Z", textX: 100, textY: 165, numberX: 100, numberY: 185 },
    { id: 8, path: "M 200,200 L 100,200 L 150,150 Z", textX: 150, textY: 180, numberX: 175, numberY: 187 },
    { id: 9, path: "M 200,200 L 200,100 L 150,150 Z", textX: 180, textY: 150, numberX: 185, numberY: 175 },
    { id: 10, path: "M 100,100 L 150,150 L 200,100 L 150,50 Z", textX: 165, textY: 100, numberX: 185, numberY: 100 },
    { id: 11, path: "M 200,0 L 200,100 L 150,50 Z", textX: 180, textY: 50, numberX: 185, numberY: 25 },
    { id: 12, path: "M 200,0 L 100,0 L 150,50 Z", textX: 150, textY: 20, numberX: 175, numberY: 15 }
  ];

  return (
    <div style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }} data-interactive="kp-horary-chart-caster">
      
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Cusp Anchor Sandbox</span>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 7, Lesson 2</span>
        </div>
        <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          KP Horary Chart Caster Workbench
        </h2>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
          Compare the differences between the correct KP Number Cusp anchoring method and the incorrect Rising-time method under dynamic time offsets.
        </p>
      </section>

      {/* Split diagnostic sandbox workspace */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.25rem", alignItems: "start", marginBottom: "1.25rem" }}>
        
        {/* Left: Input, slider and comparison info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              1. Casting &amp; Time-Nudge Controls
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px", marginBottom: "1rem" }}>
              <div>
                <label style={{ fontSize: "11px", color: INK_SECONDARY, display: "block", marginBottom: "4px", fontWeight: "700" }}>Querent Horary Number (1-249)</label>
                <input
                  type="number"
                  min="1"
                  max="249"
                  value={horaryNum}
                  onChange={(e) => setHoraryNum(Math.max(1, Math.min(249, parseInt(e.target.value) || 1)))}
                  style={{ width: "100%", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontSize: "13px", fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: INK_SECONDARY, display: "block", marginBottom: "4px", fontWeight: "700" }}>Active Workbench Method</label>
                <select
                  value={isCorrectMethod ? "correct" : "wrong"}
                  onChange={(e) => setIsCorrectMethod(e.target.value === "correct")}
                  style={{ width: "100%", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, fontWeight: 700, fontSize: "13px" }}
                >
                  <option value="correct">KP Correct (Lagna Anchored)</option>
                  <option value="wrong">Incorrect (Lagna Drifts with Time)</option>
                </select>
              </div>
            </div>

            {/* Time Nudge slider */}
            <div style={{ borderTop: `1px dashed ${HAIRLINE}`, paddingTop: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: INK_SECONDARY, marginBottom: "4px" }}>
                <span>Nudge Cusp Moment (Time Drift):</span>
                <strong style={{ color: RED, fontFamily: "monospace" }}>{timeOffset >= 0 ? `+${timeOffset}` : timeOffset} minutes</strong>
              </div>
              <input
                type="range"
                min="-15"
                max="15"
                value={timeOffset}
                onChange={(e) => setTimeOffset(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: RED, cursor: "pointer" }}
                aria-label="Time Drift Slider"
              />
              <span style={{ fontSize: "11px", color: INK_MUTED, display: "block", marginTop: "4px" }}>
                Dragging the slider simulates a query timezone deviation or calculation time lag.
              </span>
            </div>
          </div>

          {/* 5-Step casting roadmap checklist */}
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
            <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
              2. Casting Progress Checklist
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {checklist.map((item) => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px" }}>
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
                    fontSize: "10px",
                    fontWeight: 900
                  }}>
                    {item.done ? "✓" : item.id}
                  </span>
                  <span style={{ color: item.done ? INK_PRIMARY : INK_MUTED }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Split Sandbox Kundali comparison */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, display: "flex", flexDirection: "column", alignItems: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 12px", width: "100%", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
            3. Lagna Anchor Diagnostic Sandbox
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", width: "100%" }}>
            
            {/* Left Box: Locked Cusp Method */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: `1px solid ${GREEN}44`, borderRadius: 8, padding: "8px", background: `${GREEN}02` }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: GREEN, marginBottom: "6px", display: "flex", alignItems: "center", gap: "2px" }}>
                <span>🔒 KP ANCHORED (CORRECT)</span>
              </div>
              <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ border: `1px stroke ${HAIRLINE}`, background: SURFACE }}>
                <rect x="0" y="0" width="200" height="200" fill="none" stroke={GOLD} strokeWidth="1.5" />
                <line x1="0" y1="0" x2="200" y2="200" stroke={GOLD} strokeWidth="0.75" />
                <line x1="200" y1="0" x2="0" y2="200" stroke={GOLD} strokeWidth="0.75" />
                <path d="M 100,0 L 200,100 L 100,200 L 0,100 Z" fill="none" stroke={GOLD} strokeWidth="0.75" />
                
                {housePaths.map((hp) => {
                  // Ascendant is locked to correct example lagna cusp rashi index (Virgo = 6)
                  const correctedLagnaRashiIdx = activeSub.rashiName === "Libra" ? 7 : (activeSub.rashiName === "Cancer" ? 4 : 6);
                  const currentSignNum = ((correctedLagnaRashiIdx + hp.id - 1) % 12) + 1;
                  const isLagna = hp.id === 1;
                  return (
                    <g key={hp.id}>
                      {isLagna && (
                        <path d={hp.path} fill={`${GREEN}15`} stroke={GREEN} strokeWidth="1.5" />
                      )}
                      <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="8.5" fill={isLagna ? GREEN : INK_MUTED} fontWeight="900">
                        {currentSignNum}
                      </text>
                      <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="8.5" fill={isLagna ? GREEN : INK_PRIMARY} fontWeight="700">
                        H{hp.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <span style={{ fontSize: "9.5px", color: INK_SECONDARY, marginTop: "6px", textAlign: "center" }}>
                Lagna stays locked to <strong>{activeSub.rashiName}</strong> sub-arc.
              </span>
            </div>

            {/* Right Box: Drifting Cusp Method */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", border: `1px solid ${RED}44`, borderRadius: 8, padding: "8px", background: `${RED}02` }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: RED, marginBottom: "6px", display: "flex", alignItems: "center", gap: "2px" }}>
                <span>⚠️ TIME DRIFT (WRONG)</span>
              </div>
              <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ border: `1px stroke ${HAIRLINE}`, background: SURFACE }}>
                <rect x="0" y="0" width="200" height="200" fill="none" stroke={GOLD} strokeWidth="1.5" />
                <line x1="0" y1="0" x2="200" y2="200" stroke={GOLD} strokeWidth="0.75" />
                <line x1="200" y1="0" x2="0" y2="200" stroke={GOLD} strokeWidth="0.75" />
                <path d="M 100,0 L 200,100 L 100,200 L 0,100 Z" fill="none" stroke={GOLD} strokeWidth="0.75" />
                
                {housePaths.map((hp) => {
                  const currentSignNum = ((driftLagnaRashiIdx + hp.id - 1) % 12) + 1;
                  const isLagna = hp.id === 1;
                  return (
                    <g key={hp.id}>
                      {isLagna && (
                        <path d={hp.path} fill={`${RED}15`} stroke={RED} strokeWidth="1.5" />
                      )}
                      <text x={hp.numberX} y={hp.numberY} textAnchor="middle" fontSize="8.5" fill={isLagna ? RED : INK_MUTED} fontWeight="900">
                        {currentSignNum}
                      </text>
                      <text x={hp.textX} y={hp.textY} textAnchor="middle" fontSize="8.5" fill={isLagna ? RED : INK_PRIMARY} fontWeight="700">
                        H{hp.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <span style={{ fontSize: "9.5px", color: INK_SECONDARY, marginTop: "6px", textAlign: "center" }}>
                Lagna drifts to <strong>{SIGNS[driftLagnaRashiIdx]}</strong>.
              </span>
            </div>

          </div>

          <div style={{ marginTop: "10px", width: "100%", borderTop: `1px solid ${HAIRLINE}`, paddingTop: "8px", fontSize: "11px", color: INK_MUTED, fontStyle: "italic", textAlign: "center" }}>
            Note: Drag the Time Drift slider above to observe how the Lagna cusp shifts signs under the wrong method while remaining anchored under the correct method!
          </div>
        </div>

      </div>

      {/* Numerical tabular logs comparing cusps and planetary longitudes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.25rem" }}>
        
        {/* Cuspal Positions table */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
            Cuspal Positions (Placidus Grid)
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: INK_SECONDARY }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD, textAlign: "left" }}>
                  <th style={{ padding: "6px" }}>Cusp</th>
                  <th style={{ padding: "6px" }}>Longitude</th>
                  <th style={{ padding: "6px" }}>Star Lord</th>
                  <th style={{ padding: "6px" }}>Sub Lord</th>
                </tr>
              </thead>
              <tbody>
                {activeCusps.map((c) => (
                  <tr key={c.house} style={{ borderBottom: `1px dashed ${HAIRLINE}50` }}>
                    <td style={{ padding: "6px", fontWeight: 700 }}>House {c.house}</td>
                    <td style={{ padding: "6px", fontFamily: "monospace" }}>{c.longitude}</td>
                    <td style={{ padding: "6px" }}>{c.starLord}</td>
                    <td style={{ padding: "6px", color: RED, fontWeight: 700 }}>{c.subLord}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Planet Table */}
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1.25rem", background: SURFACE, boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <h3 style={{ fontSize: "0.95rem", color: GOLD, margin: "0 0 10px", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
            Planetary Longitudes
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", color: INK_SECONDARY }}>
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}`, color: GOLD, textAlign: "left" }}>
                  <th style={{ padding: "6px" }}>Graha</th>
                  <th style={{ padding: "6px" }}>Longitude</th>
                  <th style={{ padding: "6px" }}>KP House Placement</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_PLANETS.map((p) => {
                  const resolvedHouse = isCorrectMethod ? p.house : ((p.house + 8) % 12 || 12);
                  return (
                    <tr key={p.name} style={{ borderBottom: `1px dashed ${HAIRLINE}50` }}>
                      <td style={{ padding: "6px", fontWeight: 700 }}>{p.name}</td>
                      <td style={{ padding: "6px", fontFamily: "monospace" }}>{p.longitude}</td>
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
