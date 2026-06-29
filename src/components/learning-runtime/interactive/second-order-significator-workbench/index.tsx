"use client";

import { useState, useMemo } from "react";
import { RASHIS } from "../rashi-data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const INDIGO = "#4F6FA8";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const BLUE = "#356CAB";

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

  // Network Nodes Coordinates mapped in orbits around the center Cusp (viewBox 0 0 460 340)
  const networkNodes = useMemo(() => {
    const nodes: { id: string; label: string; x: number; y: number; fill: string; border: string; ring: number }[] = [];
    const cx = 230;
    const cy = 160;

    // Center Cusp Node (Ring 0)
    nodes.push({ id: "Cusp", label: `House ${activeHouse}`, x: cx, y: cy, fill: `${GOLD}18`, border: GOLD, ring: 0 });

    // Ring 1 (Radius 50): 1st-Order significators (Lord and Occupants)
    const ring1Items = [...firstOrderSet];
    const n1 = ring1Items.length;
    ring1Items.forEach((item, idx) => {
      const angle = (idx * 360) / n1 - 90;
      const rad = (angle * Math.PI) / 180;
      nodes.push({
        id: item,
        label: `${item} (1st-Order)`,
        x: cx + 55 * Math.cos(rad),
        y: cy + 55 * Math.sin(rad),
        fill: SURFACE,
        border: GOLD,
        ring: 1
      });
    });

    // Ring 2 (Radius 95): 2nd-Order star-tenants
    const uniqueL3: string[] = [];
    level3Significators.forEach((item) => {
      if (!uniqueL3.includes(item.planet) && !ring1Items.includes(item.planet)) {
        uniqueL3.push(item.planet);
      }
    });
    const n2 = uniqueL3.length;
    uniqueL3.forEach((planet, idx) => {
      const angle = (idx * 360) / (n2 || 1) - 45;
      const rad = (angle * Math.PI) / 180;
      nodes.push({
        id: planet,
        label: `${planet} (2nd-Order)`,
        x: cx + 95 * Math.cos(rad),
        y: cy + 95 * Math.sin(rad),
        fill: `${INDIGO}15`,
        border: INDIGO,
        ring: 2
      });
    });

    // Ring 3 (Radius 135): Level 4 (Aspects / Conjunctions)
    const uniqueL4: string[] = [];
    level4Significators.forEach((item) => {
      if (!nodes.some(n => n.id === item.planet) && !uniqueL4.includes(item.planet)) {
        uniqueL4.push(item.planet);
      }
    });
    const n3 = uniqueL4.length;
    uniqueL4.forEach((planet, idx) => {
      const angle = (idx * 360) / (n3 || 1) + 15;
      const rad = (angle * Math.PI) / 180;
      nodes.push({
        id: planet,
        label: `${planet} (Level 4 Aspect/Conj)`,
        x: cx + 135 * Math.cos(rad),
        y: cy + 135 * Math.sin(rad),
        fill: `${RED}10`,
        border: RED,
        ring: 3
      });
    });

    return nodes;
  }, [activeHouse, firstOrderSet, level3Significators, level4Significators]);

  // Network Edges (connecting lines)
  const networkEdges = useMemo(() => {
    const edges: { fromX: number; fromY: number; toX: number; toY: number; type: "solid" | "dashed"; color: string }[] = [];

    const getCoords = (id: string) => {
      const n = networkNodes.find((node) => node.id === id);
      return n ? { x: n.x, y: n.y, border: n.border } : null;
    };

    const cusp = getCoords("Cusp");
    if (!cusp) return edges;

    // Connect Center to Ring 1 Nodes (Solid Gold)
    firstOrderSet.forEach((occ) => {
      const target = getCoords(occ);
      if (target) {
        edges.push({ fromX: cusp.x, fromY: cusp.y, toX: target.x, toY: target.y, type: "solid", color: GOLD });
      }
    });

    // Level 3 Nodes to their respective Star Lords (Solid Indigo)
    level3Significators.forEach((item) => {
      const tenant = getCoords(item.planet);
      const starRuler = getCoords(item.starLord);
      if (tenant && starRuler) {
        edges.push({ fromX: tenant.x, fromY: tenant.y, toX: starRuler.x, toY: starRuler.y, type: "solid", color: INDIGO });
      }
    });

    // Level 4 (Conjoined/Aspecting) to 1st-order targets (Dashed Red/Orange)
    level4Significators.forEach((item) => {
      const source = getCoords(item.planet);
      if (source) {
        // Find nearest 1st-order node as target or just use cusp lord
        const target = getCoords(activeCuspLord);
        if (target) {
          edges.push({ fromX: source.x, fromY: source.y, toX: target.x, toY: target.y, type: "dashed", color: RED });
        }
      }
    });

    return edges;
  }, [networkNodes, firstOrderSet, level3Significators, level4Significators, activeCuspLord]);

  return (
    <div style={{ color: INK_PRIMARY, fontFamily: "var(--font-sans), system-ui, sans-serif" }} data-interactive="second-order-significator-workbench">
      
      {/* Header Banner */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "1.25rem", marginBottom: "1rem", boxShadow: "0 4px 20px -2px rgba(47, 125, 85, 0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GREEN, fontWeight: 900, background: `${GREEN}15`, padding: "2px 8px", borderRadius: "4px" }}>Proxy Gate Workbench</span>
          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.1em", color: GOLD, fontWeight: 900, background: `${GOLD}15`, padding: "2px 8px", borderRadius: "4px" }}>Chapter 6, Lesson 3</span>
        </div>
        <h2 style={{ margin: "0.4rem 0 0.2rem", color: GOLD, fontSize: "1.45rem", fontFamily: "var(--font-cormorant), serif", fontWeight: 700 }}>
          2nd-Order &amp; A-Significators Workbench
        </h2>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "13px", lineHeight: 1.55 }}>
          Analyze how the star-tenants of occupants and lords form Level 3 significators, and how conjunctions or aspects compile into Level 4 A-significators.
        </p>
      </section>

      {/* Preset Selectors */}
      <section style={{ marginBottom: "1rem", display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color: INK_SECONDARY, textTransform: "uppercase" }}>Select Preset Chart Scenario:</span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedPresetIdx(idx)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "6px",
              border: `1.5px solid ${selectedPresetIdx === idx ? GOLD : HAIRLINE}`,
              background: selectedPresetIdx === idx ? `${GOLD}15` : "transparent",
              color: GOLD,
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {p.name}
          </button>
        ))}
      </section>

      {/* Two-Column Workspace Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", marginBottom: "1.25rem" }}>
        
        {/* Left Column: Planet Coordinate Nakshatra Matrix */}
        <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Planet Nakṣatra &amp; Star-Lords Registry
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {activePlanets.map((p) => {
              const isFirstOrder = firstOrderSet.includes(p.name);
              const isHovered = hoveredNode === p.name;
              return (
                <div
                  key={p.name}
                  onMouseEnter={() => setHoveredNode(p.name)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${isHovered ? GOLD : isFirstOrder ? `${GOLD}80` : HAIRLINE}`,
                    background: isHovered ? `${GOLD}12` : isFirstOrder ? `${GOLD}05` : "transparent",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 150ms ease"
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{p.name}</span>
                    <div style={{ fontSize: "10.5px", color: INK_SECONDARY }}>House {p.house} · {p.sign} · {p.nak}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "10px", color: INK_MUTED, display: "block" }}>Star Lord</span>
                    <span style={{ fontWeight: 800, color: GOLD, fontSize: "12px" }}>{p.starLord}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dynamic SVG 2nd-Order Gate Board & Interactive Checkboxes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr sm:1.2fr", gap: "1rem" }}>
            
            {/* Association Controls */}
            <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "11px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>
                Association Modifier Gates
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: RED, display: "block", marginBottom: "4px" }}>Conjoined (Orbital Transfer)</span>
                  {Object.keys(conjoinedPlanets).map((pName) => (
                    <label key={pName} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", marginBottom: "3px", cursor: "pointer", fontWeight: "600" }}>
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
                  <span style={{ fontSize: "11px", fontWeight: 700, color: BLUE, display: "block", marginBottom: "4px" }}>Aspecting (Drishthi Rays)</span>
                  {Object.keys(aspectingPlanets).map((pName) => (
                    <label key={pName} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", marginBottom: "3px", cursor: "pointer", fontWeight: "600" }}>
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

            {/* Resolved Pool list */}
            <div style={{ background: SURFACE, border: `1.5px solid ${GOLD}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "11px", color: GOLD, fontWeight: 900, textTransform: "uppercase" }}>
                Resolved Ranked Pool
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {deDuplicatedRanked.map((item, idx) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => setHoveredNode(item.name)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", background: hoveredNode === item.name ? `${GOLD}12` : `${GOLD}04`, transition: "all 150ms ease" }}
                  >
                    <span style={{ fontWeight: 800, fontSize: "11.5px" }}>#{idx + 1} {item.name}</span>
                    <span style={{ fontSize: "10px", color: GOLD, fontWeight: 800, background: `${GOLD}15`, padding: "2px 6px", borderRadius: 4 }}>
                      L{item.strongestLvl === 5 ? "A" : item.strongestLvl}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Draggable Redesigned experience: The 2nd-Order Significator Gate Board SVG */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Stellar Orbital Gate Map
            </span>
            
            <svg width="100%" height="320" viewBox="0 0 460 320" style={{ background: "#FFFBF2", borderRadius: "8px", border: `1px solid ${HAIRLINE}`, overflow: "visible" }}>
              <defs>
                <filter id="gateGlow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Orbit Guide Rings */}
              <circle cx="230" cy="160" r="55" fill="none" stroke={`${HAIRLINE}50`} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="230" cy="160" r="95" fill="none" stroke={`${HAIRLINE}30`} strokeWidth="1" />
              <circle cx="230" cy="160" r="135" fill="none" stroke={`${HAIRLINE}20`} strokeWidth="1" />

              {/* Draw Edges / Transfer Rays */}
              {networkEdges.map((edge, idx) => (
                <line
                  key={idx}
                  x1={edge.fromX}
                  y1={edge.fromY}
                  x2={edge.toX}
                  y2={edge.toY}
                  stroke={edge.color}
                  strokeWidth={edge.type === "solid" ? 2 : 2.5}
                  strokeDasharray={edge.type === "dashed" ? "3,3" : "0"}
                  filter={edge.type === "dashed" ? "url(#gateGlow)" : undefined}
                />
              ))}

              {/* Draw Nodes */}
              {networkNodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                
                // Adjust size based on orbit tier
                let radius = 13;
                if (node.id === "Cusp") radius = 22;
                else if (node.ring === 1) radius = 15;

                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {/* Glowing aura if hovered */}
                    {isHovered && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={radius + 4}
                        fill="none"
                        stroke={node.border}
                        strokeWidth="1.5"
                        filter="url(#gateGlow)"
                      />
                    )}
                    
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius}
                      fill={node.fill === "transparent" ? SURFACE : node.fill}
                      stroke={node.border}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      style={{ transition: "all 150ms ease" }}
                    />
                    
                    <text
                      x={node.x}
                      y={node.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={node.border}
                      fontSize={node.id === "Cusp" ? "10" : "8"}
                      fontWeight="900"
                    >
                      {node.id === "Cusp" ? `H${activeHouse}` : node.id.substring(0, 3)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Live Hover Inspection Dashboard */}
            <div style={{ marginTop: "0.75rem", width: "100%", padding: "8px 12px", background: "#FFFBF2", border: `1px solid ${HAIRLINE}`, borderRadius: "6px", minHeight: "44px" }}>
              {hoveredNode ? (
                <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD }}>
                  {networkNodes.find((n) => n.id === hoveredNode)?.label} — Hovering highlights coordinate connections.
                </span>
              ) : (
                <span style={{ fontSize: "11px", color: INK_SECONDARY, fontStyle: "italic" }}>
                  Hover over the gateway orbit nodes to trace aspects, conjunctions, and transfer pathways.
                </span>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Parametric Data Log Table */}
      <section style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: "12px", padding: "1.25rem", boxShadow: "0 2px 10px rgba(0,0,0,0.01)" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "12px", color: GOLD, fontWeight: 800, textTransform: "uppercase" }}>Astronomical Parameters Table</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", color: INK_SECONDARY }}>
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
              <td style={{ padding: "8px", fontWeight: 700 }}>1st-Order Base Set</td>
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
