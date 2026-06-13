"use client";

import { useState, useMemo } from "react";
import { NAKSHATRAS } from "../nakshatra-data";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

const SIGNS = ["Meṣa", "Vṛṣabha", "Mithuna", "Karka", "Siṁha", "Kanyā", "Tulā", "Vṛścika", "Dhanus", "Makara", "Kumbha", "Mīna"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

const VIM: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7],
  ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];
const NAK_DEG = 13 + 20 / 60; // 13.3333°

interface Preset {
  name: string;
  lagnaSignIdx: number;
  lagnaDeg: number;
  lagnaMin: number;
  moonSignIdx: number;
  moonDeg: number;
  moonMin: number;
  weekday: string;
  rahuSignIdx: number;
  nodesConjoin: Record<string, boolean>;
  nodesAspectLagnaMoon: Record<string, boolean>;
}

const PRESETS: Preset[] = [
  {
    name: "Worked Example 1 (Gemini Lagna, Scorpio Moon)",
    lagnaSignIdx: 2, // Gemini
    lagnaDeg: 8,
    lagnaMin: 20,
    moonSignIdx: 7, // Scorpio
    moonDeg: 22,
    moonMin: 10,
    weekday: "Thursday",
    rahuSignIdx: 2, // Rahu in Gemini
    nodesConjoin: {},
    nodesAspectLagnaMoon: {}
  },
  {
    name: "Example 2 (Cancer Lagna, Cancer Moon - Overlap!)",
    lagnaSignIdx: 3, // Cancer
    lagnaDeg: 5,
    lagnaMin: 0,
    moonSignIdx: 3, // Cancer
    moonDeg: 5,
    moonMin: 0,
    weekday: "Monday",
    rahuSignIdx: 10, // Rahu in Aquarius
    nodesConjoin: {},
    nodesAspectLagnaMoon: {}
  }
];

function getRuler(lon: number): string {
  const signIdx = Math.min(Math.floor(lon / 30), 11);
  return RASHIS[signIdx].lord;
}

function getStarLord(lon: number): string {
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  return NAKSHATRAS[nakIdx].ruler;
}

function getSubLord(lon: number): string {
  const nakIdx = Math.min(Math.floor(lon / NAK_DEG), 26);
  const nak = NAKSHATRAS[nakIdx];
  const elapsed = lon - nakIdx * NAK_DEG;
  
  const start = VIM.findIndex((v) => v[0] === nak.ruler);
  const subs: { lord: string; from: number; to: number }[] = [];
  let cursor = 0;
  for (let j = 0; j < 9; j++) {
    const [lord, years] = VIM[(start + j) % 9];
    const width = (years / 120) * NAK_DEG;
    subs.push({ lord, from: cursor, to: cursor + width });
    cursor += width;
  }
  const activeSub = subs.find((s) => elapsed >= s.from && elapsed < s.to) ?? subs[subs.length - 1];
  return activeSub.lord;
}

export function RulingPlanetsRoleExplorer() {
  const [lagnaSign, setLagnaSign] = useState(2); // Gemini
  const [lagnaDeg, setLagnaDeg] = useState(8);
  const [lagnaMin, setLagnaMin] = useState(20);

  const [moonSign, setMoonSign] = useState(7); // Scorpio
  const [moonDeg, setMoonDeg] = useState(22);
  const [moonMin, setMoonMin] = useState(10);

  const [weekday, setWeekday] = useState("Thursday");
  const [rahuSign, setRahuSign] = useState(2); // Gemini (Ketu is automatically +6, Sagittarius)

  // Node conditions toggles
  const [rahuConjoinsRole, setRahuConjoinsRole] = useState(false);
  const [ketuConjoinsRole, setKetuConjoinsRole] = useState(false);
  const [rahuAspectsLagnaMoon, setRahuAspectsLagnaMoon] = useState(false);
  const [ketuAspectsLagnaMoon, setKetuAspectsLagnaMoon] = useState(false);

  const loadPreset = (p: Preset) => {
    setLagnaSign(p.lagnaSignIdx);
    setLagnaDeg(p.lagnaDeg);
    setLagnaMin(p.lagnaMin);
    setMoonSign(p.moonSignIdx);
    setMoonDeg(p.moonDeg);
    setMoonMin(p.moonMin);
    setWeekday(p.weekday);
    setRahuSign(p.rahuSignIdx);
    setRahuConjoinsRole(p.nodesConjoin["Rahu"] || false);
    setKetuConjoinsRole(p.nodesConjoin["Ketu"] || false);
    setRahuAspectsLagnaMoon(p.nodesAspectLagnaMoon["Rahu"] || false);
    setKetuAspectsLagnaMoon(p.nodesAspectLagnaMoon["Ketu"] || false);
  };

  // Compute absolute longitudes
  const lagnaLon = useMemo(() => lagnaSign * 30 + lagnaDeg + lagnaMin / 60, [lagnaSign, lagnaDeg, lagnaMin]);
  const moonLon = useMemo(() => moonSign * 30 + moonDeg + moonMin / 60, [moonSign, moonDeg, moonMin]);
  const ketuSign = (rahuSign + 6) % 12;

  // Calculate roles
  const roles = useMemo(() => {
    const lSignLord = getRuler(lagnaLon);
    const lStarLord = getStarLord(lagnaLon);
    const mSignLord = getRuler(moonLon);
    const mStarLord = getStarLord(moonLon);
    const dLord = WEEKDAY_LORDS[WEEKDAYS.indexOf(weekday)];
    const lSubLord = getSubLord(lagnaLon);

    return {
      lagnaSignLord: lSignLord,
      lagnaStarLord: lStarLord,
      moonSignLord: mSignLord,
      moonStarLord: mStarLord,
      dayLord: dLord,
      lagnaSubLord: lSubLord,
    };
  }, [lagnaLon, moonLon, weekday]);

  // Compute node qualifications
  const nodesStatus = useMemo(() => {
    const primaryRps = [
      roles.lagnaSignLord,
      roles.lagnaStarLord,
      roles.moonSignLord,
      roles.moonStarLord,
      roles.dayLord,
      roles.lagnaSubLord
    ];

    const rahuDispositor = RASHIS[rahuSign].lord;
    const ketuDispositor = RASHIS[ketuSign].lord;

    const rahuDispositorMatch = primaryRps.includes(rahuDispositor);
    const rahuQualified = rahuDispositorMatch || rahuConjoinsRole || rahuAspectsLagnaMoon;

    const ketuDispositorMatch = primaryRps.includes(ketuDispositor);
    const ketuQualified = ketuDispositorMatch || ketuConjoinsRole || ketuAspectsLagnaMoon;

    return {
      rahuDispositor,
      ketuDispositor,
      rahuDispositorMatch,
      ketuDispositorMatch,
      rahuQualified,
      ketuQualified,
    };
  }, [roles, rahuSign, ketuSign, rahuConjoinsRole, ketuConjoinsRole, rahuAspectsLagnaMoon, ketuAspectsLagnaMoon]);

  // Combined Distinct RPs
  const distinctRps = useMemo(() => {
    const rMap: Record<string, string[]> = {};
    const addRole = (planet: string, roleName: string) => {
      if (!rMap[planet]) rMap[planet] = [];
      rMap[planet].push(roleName);
    };

    addRole(roles.lagnaSignLord, "Lagna Sign Lord");
    addRole(roles.lagnaStarLord, "Lagna Star Lord");
    addRole(roles.moonSignLord, "Moon Sign Lord");
    addRole(roles.moonStarLord, "Moon Star Lord");
    addRole(roles.dayLord, "Day Lord");
    addRole(roles.lagnaSubLord, "Lagna Sub Lord");

    if (nodesStatus.rahuQualified) {
      addRole("Rahu", `Node (Dispositor: ${nodesStatus.rahuDispositor})`);
    }
    if (nodesStatus.ketuQualified) {
      addRole("Ketu", `Node (Dispositor: ${nodesStatus.ketuDispositor})`);
    }

    return Object.entries(rMap).map(([name, roleList]) => ({
      name,
      roleList,
      count: roleList.length,
      isStrong: roleList.length >= 2,
    })).sort((a, b) => b.count - a.count);
  }, [roles, nodesStatus]);

  // Active Highlight State
  const [highlightedRoles, setHighlightedRoles] = useState<string[]>([]);

  // Kundali house helper to locate planets
  const getHouseContents = (houseNum: number) => {
    const contents: string[] = [];
    const houseSignIdx = (lagnaSign + houseNum - 1) % 12;

    if (houseSignIdx === moonSign) contents.push("Moon");
    if (houseSignIdx === rahuSign) contents.push("Rahu");
    if (houseSignIdx === ketuSign) contents.push("Ketu");

    return contents;
  };

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "600px" }} data-interactive="ruling-planets-role-explorer">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 5 · Lesson 1</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ruling Planets Role Explorer</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Explore how coordinates map to the five classical roles plus the ascendant sub-lord, and test node inclusion logic.
        </p>
      </section>

      {/* Preset Loaders */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase", letterSpacing: "0.05em" }}>Load Case Preset:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => loadPreset(p)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: `1px solid ${HAIRLINE}`,
              background: "transparent",
              color: GOLD,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = `${GOLD}10`}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            {p.name}
          </button>
        ))}
      </section>

      {/* Main Spacious Workspace Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "2rem", marginBottom: "2.4rem" }}>
        
        {/* Left Column: Spacious Inputs Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          
          {/* Lagna Inputs Card */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Ascendant (Lagna) Longitude</h3>
            <div style={{ display: "flex", gap: "0.8rem", marginBottom: "12px" }}>
              <label style={{ flex: 1.5, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Zodiac Sign</span>
                <select
                  value={lagnaSign}
                  onChange={(e) => setLagnaSign(Number(e.target.value))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                >
                  {SIGNS.map((s, idx) => (
                    <option key={idx} value={idx}>{idx + 1}. {s}</option>
                  ))}
                </select>
              </label>
              <label style={{ flex: 1, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Degrees</span>
                <input
                  type="number"
                  min="0"
                  max="29"
                  value={lagnaDeg}
                  onChange={(e) => setLagnaDeg(Math.max(0, Math.min(29, Number(e.target.value))))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                />
              </label>
              <label style={{ flex: 1, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Minutes</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={lagnaMin}
                  onChange={(e) => setLagnaMin(Math.max(0, Math.min(59, Number(e.target.value))))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                />
              </label>
            </div>
            <div style={{ fontSize: "11px", color: INK_MUTED, display: "flex", justifyContent: "space-between" }}>
              <span>Decimal Longitude: {lagnaLon.toFixed(4)}°</span>
              <span>Ruler: {roles.lagnaSignLord}</span>
            </div>
          </div>

          {/* Moon Inputs Card */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Moon Longitude</h3>
            <div style={{ display: "flex", gap: "0.8rem", marginBottom: "12px" }}>
              <label style={{ flex: 1.5, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Zodiac Sign</span>
                <select
                  value={moonSign}
                  onChange={(e) => setMoonSign(Number(e.target.value))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                >
                  {SIGNS.map((s, idx) => (
                    <option key={idx} value={idx}>{idx + 1}. {s}</option>
                  ))}
                </select>
              </label>
              <label style={{ flex: 1, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Degrees</span>
                <input
                  type="number"
                  min="0"
                  max="29"
                  value={moonDeg}
                  onChange={(e) => setMoonDeg(Math.max(0, Math.min(29, Number(e.target.value))))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                />
              </label>
              <label style={{ flex: 1, fontSize: "11px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Minutes</span>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={moonMin}
                  onChange={(e) => setMoonMin(Math.max(0, Math.min(59, Number(e.target.value))))}
                  style={{ padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
                />
              </label>
            </div>
            <div style={{ fontSize: "11px", color: INK_MUTED, display: "flex", justifyContent: "space-between" }}>
              <span>Decimal Longitude: {moonLon.toFixed(4)}°</span>
              <span>Ruler: {roles.moonSignLord}</span>
            </div>
          </div>

          {/* Weekday & Nodes Playground Card */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>Weekday & Node Interactions</h3>
            
            <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>Judgement Weekday:</span>
              <select
                value={weekday}
                onChange={(e) => setWeekday(e.target.value)}
                style={{ flex: 1, padding: "6px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "12px" }}
              >
                {WEEKDAYS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>

            <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                <span style={{ fontWeight: 700, color: INK_SECONDARY }}>Rahu House Placement:</span>
                <select
                  value={rahuSign}
                  onChange={(e) => setRahuSign(Number(e.target.value))}
                  style={{ padding: "4px 8px", borderRadius: "6px", border: `1px solid ${HAIRLINE}`, background: "#FFFBF2", color: INK_PRIMARY, fontSize: "11px" }}
                >
                  {SIGNS.map((s, idx) => (
                    <option key={idx} value={idx}>{s} (Ketu opposite)</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginTop: "4px" }}>
                <label style={{ fontSize: "10.5px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rahuConjoinsRole}
                    onChange={(e) => setRahuConjoinsRole(e.target.checked)}
                    style={{ accentColor: GOLD }}
                  />
                  Rahu conjoins RP
                </label>
                <label style={{ fontSize: "10.5px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={ketuConjoinsRole}
                    onChange={(e) => setKetuConjoinsRole(e.target.checked)}
                    style={{ accentColor: GOLD }}
                  />
                  Ketu conjoins RP
                </label>
                <label style={{ fontSize: "10.5px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rahuAspectsLagnaMoon}
                    onChange={(e) => setRahuAspectsLagnaMoon(e.target.checked)}
                    style={{ accentColor: GOLD }}
                  />
                  Rahu aspects Chart
                </label>
                <label style={{ fontSize: "10.5px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={ketuAspectsLagnaMoon}
                    onChange={(e) => setKetuAspectsLagnaMoon(e.target.checked)}
                    style={{ accentColor: GOLD }}
                  />
                  Ketu aspects Chart
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Beautiful SVG North Indian Kundali Chart */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>
            Visual Kundali Chart representation
          </h3>

          <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "300px" }}>
            <svg width="270" height="270" viewBox="0 0 300 300" style={{ border: `1.5px solid ${HAIRLINE}`, background: "#FFFBF2", borderRadius: "10px" }}>
              {/* Diagonals and diamonds */}
              <line x1="0" y1="0" x2="300" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
              <line x1="300" y1="0" x2="0" y2="300" stroke={HAIRLINE} strokeWidth="1.5" />
              <rect x="0" y="0" width="300" height="300" fill="none" stroke={HAIRLINE} strokeWidth="2.5" />
              <polygon points="150,0 300,150 150,300 0,150" fill="none" stroke={HAIRLINE} strokeWidth="1.5" />

              {/* Houses mapping */}
              {[
                { h: 1, x: 150, y: 85, poly: "150,0 75,75 150,150 225,75" },
                { h: 2, x: 75, y: 40, poly: "0,0 150,0 75,75" },
                { h: 3, x: 40, y: 75, poly: "0,0 0,150 75,75" },
                { h: 4, x: 75, y: 150, poly: "0,150 75,75 150,150 75,225" },
                { h: 5, x: 40, y: 225, poly: "0,150 0,300 75,225" },
                { h: 6, x: 75, y: 260, poly: "0,300 150,300 75,225" },
                { h: 7, x: 150, y: 215, poly: "150,150 75,225 150,300 225,225" },
                { h: 8, x: 225, y: 260, poly: "150,300 300,300 225,225" },
                { h: 9, x: 260, y: 225, poly: "300,150 300,300 225,225" },
                { h: 10, x: 225, y: 150, poly: "150,150 225,75 300,150 225,225" },
                { h: 11, x: 260, y: 75, poly: "300,0 300,150 225,75" },
                { h: 12, x: 225, y: 40, poly: "150,0 300,0 225,75" }
              ].map((house) => {
                const signIndex = (lagnaSign + house.h - 1) % 12;
                const signNum = signIndex + 1;
                const items = getHouseContents(house.h);
                const isLagnaHouse = house.h === 1;

                return (
                  <g key={house.h}>
                    {/* Render Sign number label */}
                    <text x={house.x} y={house.y - 12} textAnchor="middle" fontSize="11px" fill={GOLD} fontWeight="800">
                      {signNum}
                    </text>
                    
                    {/* House number marker */}
                    <text x={house.x} y={house.y - 2} textAnchor="middle" fontSize="8px" fill={INK_MUTED}>
                      H{house.h}
                    </text>

                    {/* Lagna badge in first house */}
                    {isLagnaHouse && (
                      <text x={house.x} y={house.y + 8} textAnchor="middle" fontSize="9px" fill={GOLD} fontWeight="900" letterSpacing="0.05em">
                        LAGNA
                      </text>
                    )}

                    {/* Planet labels */}
                    {items.length > 0 && (
                      <g transform={`translate(${house.x}, ${house.y + 16})`}>
                        {items.map((pt, pIdx) => (
                          <text
                            key={pt}
                            x="0"
                            y={pIdx * 10}
                            textAnchor="middle"
                            fontSize="9.5px"
                            fill={pt === "Moon" ? INDIGO : "#9E2A2B"}
                            fontWeight="800"
                          >
                            {pt}
                          </text>
                        ))}
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <p style={{ margin: "14px 0 0 0", fontSize: "11px", color: INK_MUTED, textAlign: "center" }}>
            Lagna sets H1 (top diamond). Sign numbers (1–12) cycle counter-clockwise.
          </p>
        </div>

      </div>

      {/* Role Cards Deck - High-end Grid */}
      <h2 style={{ fontSize: "13px", color: INK_SECONDARY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.8rem" }}>
        Active Position & Calendar Roles
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px", marginBottom: "2.4rem" }}>
        {[
          { key: "Lagna Sign Lord", role: "Lagna Sign Lord", planet: roles.lagnaSignLord, desc: `Ruler of ${SIGNS[lagnaSign]} (H1)` },
          { key: "Lagna Star Lord", role: "Lagna Star Lord", planet: roles.lagnaStarLord, desc: "Ruler of rising nakṣatra" },
          { key: "Moon Sign Lord", role: "Moon Sign Lord", planet: roles.moonSignLord, desc: `Ruler of Moon's sign (${SIGNS[moonSign]})` },
          { key: "Moon Star Lord", role: "Moon Star Lord", planet: roles.moonStarLord, desc: "Ruler of Moon's nakṣatra" },
          { key: "Day Lord", role: "Day (Vāra) Lord", planet: roles.dayLord, desc: `weekday lord (${weekday})` },
          { key: "Lagna Sub Lord", role: "Lagna Sub Lord (6th)", planet: roles.lagnaSubLord, desc: "Precision activation pointer" },
        ].map((r) => {
          const isHighlighted = highlightedRoles.includes(r.key);
          return (
            <div
              key={r.key}
              style={{
                background: SURFACE,
                border: `1.5px solid ${isHighlighted ? GOLD : HAIRLINE}`,
                borderRadius: "10px",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                boxShadow: isHighlighted ? `0 4px 12px ${GOLD}25` : "none",
                transform: isHighlighted ? "translateY(-3px)" : "none",
                transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              <span style={{ fontSize: "9.5px", color: GOLD, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.role}</span>
              <span style={{ fontSize: "17px", fontWeight: 800, color: INK_PRIMARY }}>{r.planet}</span>
              <span style={{ fontSize: "10.5px", color: INK_MUTED }}>{r.desc}</span>
            </div>
          );
        })}
      </div>

      {/* Collapse Dashboard & Node Explainer */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        
        {/* Collapse RPs List */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Role Overlap Collapse Dashboard
          </h3>
          <p style={{ fontSize: "11px", color: INK_MUTED, margin: "0 0 12px 0", lineHeight: "1.4" }}>
            Observe how duplicate roles condense. Hover over a planet to highlight the roles it rules.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {distinctRps.map((p) => (
              <div
                key={p.name}
                onMouseEnter={() => setHighlightedRoles(p.roleList)}
                onMouseLeave={() => setHighlightedRoles([])}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${p.isStrong ? GOLD : HAIRLINE}`,
                  background: p.isStrong ? `${GOLD}0B` : "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 800 }}>{p.name}</span>
                  {p.isStrong && (
                    <span style={{ fontSize: "8px", background: GOLD, color: "#FFFBF2", padding: "2px 6px", borderRadius: "4px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Strong RP ({p.count} Roles)
                    </span>
                  )}
                </div>
                <span style={{ fontSize: "11px", color: INK_SECONDARY, fontWeight: 500 }}>
                  {p.roleList.map(r => r.split(" Lord")[0]).join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Node inclusion criteria explainer */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "16px 20px" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Rāhu / Ketu Qualification Tracker
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "11.5px" }}>
            
            {/* Rahu Card */}
            <div style={{ borderLeft: `3px solid ${nodesStatus.rahuQualified ? GOLD : INK_MUTED}`, paddingLeft: "12px", paddingBottom: "2px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "13px" }}>Rāhu in {SIGNS[rahuSign]}</strong>
                <span style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  color: nodesStatus.rahuQualified ? GOLD : INK_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {nodesStatus.rahuQualified ? "Admitted" : "Excluded"}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: INK_SECONDARY, marginTop: "4px" }}>
                Dispositor Lord: <strong>{nodesStatus.rahuDispositor}</strong> {nodesStatus.rahuDispositorMatch ? "(Dispositor rules a role ✓)" : "(Dispositor not in RPs)"}
              </div>
              {nodesStatus.rahuQualified && (
                <div style={{ fontSize: "10px", color: GOLD, fontStyle: "italic", marginTop: "4px", background: `${GOLD}05`, padding: "4px 8px", borderRadius: "4px" }}>
                  Status: Rahu joins active set as agent for {nodesStatus.rahuDispositor}.
                </div>
              )}
            </div>

            {/* Ketu Card */}
            <div style={{ borderLeft: `3px solid ${nodesStatus.ketuQualified ? GOLD : INK_MUTED}`, paddingLeft: "12px", paddingBottom: "2px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "13px" }}>Ketu in {SIGNS[ketuSign]}</strong>
                <span style={{
                  fontSize: "9px",
                  fontWeight: 900,
                  color: nodesStatus.ketuQualified ? GOLD : INK_MUTED,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {nodesStatus.ketuQualified ? "Admitted" : "Excluded"}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: INK_SECONDARY, marginTop: "4px" }}>
                Dispositor Lord: <strong>{nodesStatus.ketuDispositor}</strong> {nodesStatus.ketuDispositorMatch ? "(Dispositor rules a role ✓)" : "(Dispositor not in RPs)"}
              </div>
              {nodesStatus.ketuQualified && (
                <div style={{ fontSize: "10px", color: GOLD, fontStyle: "italic", marginTop: "4px", background: `${GOLD}05`, padding: "4px 8px", borderRadius: "4px" }}>
                  Status: Ketu joins active set as agent for {nodesStatus.ketuDispositor}.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Computational Parameters Table (Replacing VIX JSON Console) */}
      <section style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "1.6rem" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: INK_SECONDARY, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Astronomical Parameters Table
        </h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px", color: INK_PRIMARY }}>
          <thead>
            <tr style={{ borderBottom: `1.5px solid ${HAIRLINE}` }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Computational Variable</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>Numeric Reading</th>
              <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 800 }}>KP Stellar Engine Context</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Krishnamurti Ayanāṁśa</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>24°06′42″</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Constant boundary offset subtraction for tropical-to-sidereal shift</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Ascendant Longitude</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{lagnaLon.toFixed(4)}°</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Calculates Lagna Sign-Lord ({roles.lagnaSignLord}) and Star-Lord ({roles.lagnaStarLord})</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Moon Longitude</td>
              <td style={{ padding: "8px 12px", fontFamily: "monospace" }}>{moonLon.toFixed(4)}°</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Calculates Moon Sign-Lord ({roles.moonSignLord}) and Star-Lord ({roles.moonStarLord})</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <td style={{ padding: "8px 12px", fontWeight: 700 }}>Judgement Weekday</td>
              <td style={{ padding: "8px 12px" }}>{weekday}</td>
              <td style={{ padding: "8px 12px", color: INK_MUTED }}>Calculates calendar Vāra Day-Lord ({roles.dayLord})</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
