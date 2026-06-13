"use client";

import { useState, useMemo } from "react";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";

interface PlanetInfo {
  name: string;
  house: number;
  sign: string;
  nak: string;
  starLord: string;
}

interface Preset {
  name: string;
  houseOfInterest: number;
  cuspSign: string;
  cuspLord: string;
  planets: PlanetInfo[];
}

const PRESETS: Preset[] = [
  {
    name: "Scenario A: 7th House (Venus Lord, Saturn Occupies)",
    houseOfInterest: 7,
    cuspSign: "Libra",
    cuspLord: "Venus",
    planets: [
      { name: "Saturn", house: 7, sign: "Libra", nak: "Puṣya", starLord: "Saturn" },
      { name: "Venus", house: 9, sign: "Sagittarius", nak: "Anurādhā", starLord: "Saturn" },
      { name: "Moon", house: 5, sign: "Leo", nak: "Uttara-bhādrapadā", starLord: "Saturn" },
      { name: "Mars", house: 2, sign: "Scorpio", nak: "Bharaṇī", starLord: "Venus" },
      { name: "Sun", house: 10, sign: "Cancer", nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 11, sign: "Leo", nak: "Jyeṣṭhā", starLord: "Mercury" },
      { name: "Jupiter", house: 4, sign: "Aries", nak: "Rohiṇī", starLord: "Moon" },
      { name: "Rahu", house: 12, sign: "Pisces", nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 6, sign: "Virgo", nak: "Mūla", starLord: "Ketu" }
    ]
  },
  {
    name: "Scenario B: 10th House (Moon Lord, Empty House)",
    houseOfInterest: 10,
    cuspSign: "Cancer",
    cuspLord: "Moon",
    planets: [
      { name: "Saturn", house: 2, sign: "Leo", nak: "Puṣya", starLord: "Saturn" },
      { name: "Moon", house: 8, sign: "Virgo", nak: "Anurādhā", starLord: "Saturn" },
      { name: "Venus", house: 3, sign: "Libra", nak: "Uttara-bhādrapadā", starLord: "Saturn" },
      { name: "Mars", house: 12, sign: "Scorpio", nak: "Bharaṇī", starLord: "Venus" },
      { name: "Sun", house: 5, sign: "Sagittarius", nak: "Maghā", starLord: "Ketu" },
      { name: "Mercury", house: 4, sign: "Capricorn", nak: "Jyeṣṭhā", starLord: "Mercury" },
      { name: "Jupiter", house: 11, sign: "Aquarius", nak: "Rohiṇī", starLord: "Moon" },
      { name: "Rahu", house: 1, sign: "Aries", nak: "Ardrā", starLord: "Rahu" },
      { name: "Ketu", house: 7, sign: "Libra", nak: "Mūla", starLord: "Ketu" }
    ]
  }
];

export function SecondOrderSignificatorWorkbench() {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const activePreset = PRESETS[selectedPresetIdx];

  const activeHouse = activePreset.houseOfInterest;
  const activeCuspLord = activePreset.cuspLord;
  const activePlanets = activePreset.planets;

  // Manual Conjunction & Aspect settings
  const [conjoinedPlanets, setConjoinedPlanets] = useState<Record<string, boolean>>({
    Mars: false,
    Rahu: false,
    Ketu: false
  });
  const [aspectingPlanets, setAspectingPlanets] = useState<Record<string, boolean>>({
    Jupiter: true,
    Sun: false,
    Saturn: false
  });

  // Highlight state for stellar network nodes
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 1st-Order significators: occupants + lord
  const occupants = useMemo(() => {
    return activePlanets.filter((p) => p.house === activeHouse).map((p) => p.name);
  }, [activePlanets, activeHouse]);

  const firstOrderSet = useMemo(() => {
    const list = [...occupants];
    if (!list.includes(activeCuspLord)) {
      list.push(activeCuspLord);
    }
    return list;
  }, [occupants, activeCuspLord]);

  // Level 3 (2nd-Order): planets in nakṣatras of 1st-order significators
  const level3Significators = useMemo(() => {
    return activePlanets
      .filter((p) => firstOrderSet.includes(p.starLord))
      .map((p) => ({
        planet: p.name,
        starLord: p.starLord,
        reason: `Tenants star of ${p.starLord}`
      }));
  }, [activePlanets, firstOrderSet]);

  // Level 4 (A-significators): aspects & conjunctions to 1st/2nd order significators
  const level4Significators = useMemo(() => {
    const list: { planet: string; reason: string }[] = [];

    Object.entries(conjoinedPlanets).forEach(([pName, val]) => {
      if (val) {
        list.push({ planet: pName, reason: `Conjoined with occupant/lord` });
      }
    });

    Object.entries(aspectingPlanets).forEach(([pName, val]) => {
      if (val) {
        list.push({ planet: pName, reason: `Aspects occupant/lord` });
      }
    });

    return list;
  }, [conjoinedPlanets, aspectingPlanets]);

  // De-duplicated and Ranked list
  const deDuplicatedRanked = useMemo(() => {
    const list: { name: string; strongestLvl: number; reason: string }[] = [];
    const planetMap: Record<string, { level: number; reason: string }[]> = {};

    occupants.forEach((p) => {
      if (!planetMap[p]) planetMap[p] = [];
      planetMap[p].push({ level: 2, reason: "1st-Order Occupant" });
    });

    if (!planetMap[activeCuspLord]) planetMap[activeCuspLord] = [];
    planetMap[activeCuspLord].push({ level: 4, reason: "1st-Order Lord" });

    level3Significators.forEach((item) => {
      if (!planetMap[item.planet]) planetMap[item.planet] = [];
      planetMap[item.planet].push({ level: 3, reason: `2nd-Order (${item.reason})` });
    });

    level4Significators.forEach((item) => {
      if (!planetMap[item.planet]) planetMap[item.planet] = [];
      planetMap[item.planet].push({ level: 4, reason: `A-Significator (${item.reason})` });
    });

    Object.entries(planetMap).forEach(([pName, entries]) => {
      const strongest = entries.reduce((min, e) => (e.level < min.level ? e : min), { level: 99, reason: "" });
      list.push({
        name: pName,
        strongestLvl: strongest.level,
        reason: strongest.reason
      });
    });

    return list.sort((a, b) => a.strongestLvl - b.strongestLvl);
  }, [occupants, activeCuspLord, level3Significators, level4Significators]);

  // Network Nodes Coordinates mapping for dynamic SVG layout (viewBox 0 0 460 340)
  const networkNodes = useMemo(() => {
    const nodes: { id: string; label: string; x: number; y: number; fill: string; border: string }[] = [];

    // House Cusp Node (Center top)
    nodes.push({ id: "Cusp", label: `House ${activeHouse}`, x: 230, y: 35, fill: "#9C7A2F15", border: GOLD });

    // 1st-Order Lord Node (Left middle)
    nodes.push({ id: activeCuspLord, label: `${activeCuspLord} (Lord)`, x: 100, y: 95, fill: "#FFF", border: GOLD });

    // 1st-Order Occupant Nodes (Right middle)
    occupants.forEach((occ, idx) => {
      nodes.push({ id: occ, label: `${occ} (Occ)`, x: 360, y: 95 + idx * 55, fill: "#FFF", border: GOLD });
    });

    // 2nd-Order (Level 3) star-tenant nodes (Middle horizontal row)
    const uniqueL3: typeof level3Significators = [];
    level3Significators.forEach((item) => {
      if (!nodes.some((n) => n.id === item.planet) && !uniqueL3.some((u) => u.planet === item.planet)) {
        uniqueL3.push(item);
      }
    });

    // Sort unique L3 nodes: Lord-connecting planets on the left, Occupant-connecting on the right
    const getStarLordWeight = (lord: string) => lord === activeCuspLord ? 0 : 1;
    uniqueL3.sort((a, b) => getStarLordWeight(a.starLord) - getStarLordWeight(b.starLord));

    const nL3 = uniqueL3.length;
    const startXL3 = 230 - ((nL3 - 1) * 35);
    uniqueL3.forEach((item, idx) => {
      nodes.push({
        id: item.planet,
        label: `${item.planet} (L3)`,
        x: nL3 > 1 ? startXL3 + idx * 70 : 230,
        y: 185,
        fill: `${INDIGO}15`,
        border: INDIGO
      });
    });

    // Level 4 (A-significators) nodes (Bottom horizontal row)
    const uniqueL4: typeof level4Significators = [];
    level4Significators.forEach((item) => {
      if (!nodes.some((n) => n.id === item.planet) && !uniqueL4.some((u) => u.planet === item.planet)) {
        uniqueL4.push(item);
      }
    });

    const nL4 = uniqueL4.length;
    const startXL4 = 230 - ((nL4 - 1) * 40);
    uniqueL4.forEach((item, idx) => {
      nodes.push({
        id: item.planet,
        label: `${item.planet} (L4)`,
        x: nL4 > 1 ? startXL4 + idx * 80 : 230,
        y: 270,
        fill: "transparent",
        border: "#A08060"
      });
    });

    return nodes;
  }, [activeHouse, activeCuspLord, occupants, level3Significators, level4Significators]);

  // Network Edges (connecting lines)
  const networkEdges = useMemo(() => {
    const edges: { fromX: number; fromY: number; toX: number; toY: number; type: "solid" | "dashed" }[] = [];

    const getCoords = (id: string) => {
      const n = networkNodes.find((node) => node.id === id);
      return n ? { x: n.x, y: n.y } : null;
    };

    const cusp = getCoords("Cusp");
    if (!cusp) return edges;

    // Cusp to Lord
    const lord = getCoords(activeCuspLord);
    if (lord) edges.push({ fromX: cusp.x, fromY: cusp.y, toX: lord.x, toY: lord.y, type: "solid" });

    // Cusp to Occupants
    occupants.forEach((occ) => {
      const occupant = getCoords(occ);
      if (occupant) edges.push({ fromX: cusp.x, fromY: cusp.y, toX: occupant.x, toY: occupant.y, type: "solid" });
    });

    // Level 3 (Star Tenants) to their star-lords
    level3Significators.forEach((item) => {
      const tenant = getCoords(item.planet);
      const starRuler = getCoords(item.starLord);
      if (tenant && starRuler) {
        edges.push({ fromX: tenant.x, fromY: tenant.y, toX: starRuler.x, toY: starRuler.y, type: "solid" });
      }
    });

    // Level 4 (Conjoined/Aspecting) to their targets
    level4Significators.forEach((item) => {
      const source = getCoords(item.planet);
      if (source) {
        // Connect to Lord (left) if source node is on the left, else to Occupant (right)
        const targetName = source.x < 230 ? activeCuspLord : (occupants[0] || activeCuspLord);
        const target = getCoords(targetName);
        if (target) {
          edges.push({ fromX: source.x, fromY: source.y, toX: target.x, toY: target.y, type: "dashed" });
        }
      }
    });

    return edges;
  }, [networkNodes, activeCuspLord, occupants, level3Significators, level4Significators]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "28px 24px", color: INK_PRIMARY, minHeight: "650px" }} data-interactive="second-order-significator-workbench">
      
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "1.2rem", marginBottom: "1.8rem" }}>
        <span style={{ color: GOLD, fontSize: "10px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.1em" }}>Module 16 · Chapter 6 · Lesson 3</span>
        <h1 style={{ margin: "0.3rem 0 0", color: GOLD, fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em" }}>2nd-Order &amp; A-Significators Workbench</h1>
        <p style={{ margin: "0.4rem 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.5" }}>
          Analyze how the star-tenants of occupants and lords form Level 3 significators, and how conjunctions or aspects compile into Level 4 A-significators.
        </p>
      </section>

      {/* Preset Selectors */}
      <section style={{ marginBottom: "1.8rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase" }}>Select Preset Chart Scenario:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPresetIdx(idx)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: `1px solid ${HAIRLINE}`,
              background: selectedPresetIdx === idx ? `${GOLD}20` : "transparent",
              color: GOLD,
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {p.name}
          </button>
        ))}
      </section>

      {/* Two-Column Layout utilizing space inside the component */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "2.4rem" }}>
        
        {/* Left Column: Planet Coordinate Nakshatra Matrix */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "18px" }}>
          <h3 style={{ margin: "0 0 14px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
            Planet Nakṣatra &amp; Star-Lords
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {activePlanets.map((p) => {
              const isFirstOrder = firstOrderSet.includes(p.name);
              return (
                <div
                  key={p.name}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: `1px solid ${isFirstOrder ? GOLD : HAIRLINE}`,
                    background: isFirstOrder ? `${GOLD}06` : "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{p.name}</span>
                    <div style={{ fontSize: "10px", color: INK_SECONDARY }}>House {p.house} · {p.nak}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "10px", color: INK_SECONDARY, display: "block" }}>Star Lord</span>
                    <span style={{ fontWeight: 700, color: GOLD, fontSize: "12px" }}>{p.starLord}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Controls + Resolved Pool + SVG Network Map */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Row 1: Controls & De-duplicated Pool Side-by-Side */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.2rem" }}>
            
            {/* Association Controls Box */}
            <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "18px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
                Association Controls
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD, display: "block", marginBottom: "4px" }}>Conjoined</span>
                  {Object.keys(conjoinedPlanets).map((pName) => (
                    <label key={pName} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", marginBottom: "3px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={conjoinedPlanets[pName]}
                        onChange={(e) => setConjoinedPlanets((prev) => ({ ...prev, [pName]: e.target.checked }))}
                      />
                      {pName}
                    </label>
                  ))}
                </div>

                <div style={{ borderTop: `1px solid ${HAIRLINE}33`, paddingTop: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD, display: "block", marginBottom: "4px" }}>Aspecting</span>
                  {Object.keys(aspectingPlanets).map((pName) => (
                    <label key={pName} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", marginBottom: "3px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={aspectingPlanets[pName]}
                        onChange={(e) => setAspectingPlanets((prev) => ({ ...prev, [pName]: e.target.checked }))}
                      />
                      {pName}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Resolved De-duplicated Ranked Pool Box */}
            <div style={{ background: SURFACE, border: `1.5px solid ${GOLD}`, borderRadius: "10px", padding: "18px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 900, textTransform: "uppercase" }}>
                Ranked Pool
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {deDuplicatedRanked.map((item, idx) => (
                  <div key={item.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: `${GOLD}04` }}>
                    <span style={{ fontWeight: 850, fontSize: "11.5px" }}>#{idx + 1} {item.name}</span>
                    <span style={{ fontSize: "10px", color: GOLD, fontWeight: 700 }}>L{item.strongestLvl === 5 ? "A" : item.strongestLvl}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Row 2: Stellar Network Map Box (Utilizing the space below controls) */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "18px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
              Stellar Network Map
            </h3>
            
            {/* SVG width and height adjusted for clear layout, nodes coordinated to prevent border overlap */}
            <svg width="100%" height="340" viewBox="0 0 460 340" style={{ background: "#FFFBF2", borderRadius: "8px", border: `1px solid ${HAIRLINE}` }}>
              {/* Draw Edges */}
              {networkEdges.map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.fromX}
                  y1={edge.fromY}
                  x2={edge.toX}
                  y2={edge.toY}
                  stroke={GOLD}
                  strokeWidth={edge.type === "solid" ? 2 : 1.5}
                  strokeDasharray={edge.type === "dashed" ? "4,4" : "0"}
                />
              ))}

              {/* Draw Nodes */}
              {networkNodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.id === "Cusp" ? 18 : 14}
                      fill={node.fill === "transparent" ? "#FFF" : node.fill}
                      stroke={node.border}
                      strokeWidth={isHovered ? 3 : 1.5}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill={node.border}
                      style={{ fontSize: "9px", fontWeight: 900 }}
                    >
                      {node.id === "Cusp" ? "H" : node.id.substring(0, 2)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Details Panel */}
            <div style={{ marginTop: "12px", width: "100%", padding: "10px", background: "#FFFBF2", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", minHeight: "44px" }}>
              {hoveredNode ? (
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD }}>
                  {networkNodes.find((n) => n.id === hoveredNode)?.label} — Active node in stellar chain calculation.
                </span>
              ) : (
                <span style={{ fontSize: "11px", color: INK_SECONDARY, fontStyle: "italic" }}>
                  Hover over network nodes to reveal active significator attributes.
                </span>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Styled Parameters Table replacing developer VIX logs */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Astronomical Parameters Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}`, textAlign: "left", color: GOLD }}>
              <th style={{ padding: "8px" }}>Parameter</th>
              <th style={{ padding: "8px" }}>Value</th>
              <th style={{ padding: "8px" }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Selected House</td>
              <td style={{ padding: "8px" }}>{activeHouse}</td>
              <td style={{ padding: "8px" }}>House under analysis (7th, 10th, etc.)</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>1st-Order Base</td>
              <td style={{ padding: "8px" }}>{firstOrderSet.join(", ")}</td>
              <td style={{ padding: "8px" }}>Occupants and Lord combined</td>
            </tr>
            <tr style={{ borderBottom: `1px solid ${HAIRLINE}33` }}>
              <td style={{ padding: "8px", fontWeight: 700 }}>Level 3 Count</td>
              <td style={{ padding: "8px" }}>{level3Significators.length} planets</td>
              <td style={{ padding: "8px" }}>Planets located in the nakṣatra of any 1st-order planet</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", fontWeight: 700 }}>Conjoined / Aspecting Count</td>
              <td style={{ padding: "8px" }}>{level4Significators.length} planets</td>
              <td style={{ padding: "8px" }}>Planets linked via conjunction or aspects</td>
            </tr>
          </tbody>
        </table>
      </section>

    </div>
  );
}
