"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

const CARA_COLOR = "#be123c"; // Crimson red for Movable (Cara)
const STHIRA_COLOR = "#0f766e"; // Teal/Green for Fixed (Sthira)
const DVI_COLOR = "#4338ca"; // Indigo for Dual (Dvi-svabhāva)

interface Planet {
  name: string;
  symbol: string;
  color: string;
  badgeLabel: string;
}

const PLANETS: Planet[] = [
  { name: "Sun", symbol: "☉", color: "#C9A24D", badgeLabel: "Su(सू)" },
  { name: "Moon", symbol: "☽", color: "#7A7A7A", badgeLabel: "Mo(च)" },
  { name: "Mars", symbol: "♂", color: CARA_COLOR, badgeLabel: "Ma(म)" },
  { name: "Mercury", symbol: "☿", color: STHIRA_COLOR, badgeLabel: "Me(बु)" },
  { name: "Jupiter", symbol: "♃", color: GOLD, badgeLabel: "Ju(गु)" },
  { name: "Venus", symbol: "♀", color: "#9d174d", badgeLabel: "Ve(शु)" },
  { name: "Saturn", symbol: "♄", color: INDIGO, badgeLabel: "Sa(श)" }
];

interface Preset {
  name: string;
  description: string;
  planetA: string;
  signA: number;
  planetB: string;
  signB: number;
  verdictKey: "both" | "parashari-only" | "jaimini-only" | "neither";
}

interface VerdictTab {
  key: "both" | "parashari-only" | "jaimini-only" | "neither";
  label: string;
  shortLabel: string;
  icon: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}

const VERDICT_TABS: VerdictTab[] = [
  {
    key: "both",
    label: "Both Agree (Reinforced)",
    shortLabel: "Both",
    icon: "★",
    accentColor: "#7A5E1E",
    accentBg: "rgba(156, 122, 47, 0.1)",
    accentBorder: "rgba(156, 122, 47, 0.35)"
  },
  {
    key: "jaimini-only",
    label: "Rāśi-Dṛṣṭi Only",
    shortLabel: "Rāśi",
    icon: "🧭",
    accentColor: "#4338ca",
    accentBg: "rgba(67, 56, 202, 0.08)",
    accentBorder: "rgba(67, 56, 202, 0.3)"
  },
  {
    key: "parashari-only",
    label: "Graha-Dṛṣṭi Only",
    shortLabel: "Graha",
    icon: "🪐",
    accentColor: "#be123c",
    accentBg: "rgba(190, 18, 60, 0.08)",
    accentBorder: "rgba(190, 18, 60, 0.3)"
  },
  {
    key: "neither",
    label: "No Connection",
    shortLabel: "None",
    icon: "❌",
    accentColor: "#6b7280",
    accentBg: "rgba(107, 114, 128, 0.06)",
    accentBorder: "rgba(107, 114, 128, 0.2)"
  }
];

const PRESETS: Preset[] = [
  {
    name: "Both Agree (Reinforcing)",
    description: "Mars in Aries aspects Saturn in Scorpio: Mars has 8th house aspect to Scorpio. Aries (movable) aspects Scorpio (fixed, skipping Taurus). Both systems active.",
    planetA: "Mars",
    signA: 1,
    planetB: "Saturn",
    signB: 8,
    verdictKey: "both"
  },
  {
    name: "Rāśi-Dṛṣṭi Only",
    description: "Mars in Aries aspects Saturn in Aquarius: Aries aspects Aquarius (movable to fixed). But Mars has no house aspect to Aquarius (aspects 4, 7, 8). Only Jaimini active.",
    planetA: "Mars",
    signA: 1,
    planetB: "Saturn",
    signB: 11,
    verdictKey: "jaimini-only"
  },
  {
    name: "Graha-Dṛṣṭi Only",
    description: "Sun in Aries aspects Saturn in Libra: Sun has 7th house aspect to Libra. But Aries and Libra do not aspect (both are Movable signs). Only Parāśari active.",
    planetA: "Sun",
    signA: 1,
    planetB: "Saturn",
    signB: 7,
    verdictKey: "parashari-only"
  },
  {
    name: "Unconnected (Neither)",
    description: "Sun in Aries, Moon in Taurus: No house aspects exist between Aries and Taurus. Modality skips adjacent Taurus. No connection active.",
    planetA: "Sun",
    signA: 1,
    planetB: "Moon",
    signB: 2,
    verdictKey: "neither"
  }
];

// North Indian Chart Geometries (400x400 SVG)
const HOUSE_POLYGONS: Record<number, string> = {
  1: "200,10 105,105 200,200 295,105",
  2: "10,10 200,10 105,105",
  3: "10,10 105,105 10,200",
  4: "10,200 105,105 200,200 105,295",
  5: "10,200 105,295 10,390",
  6: "10,390 105,295 200,390",
  7: "200,390 105,295 200,200 295,295",
  8: "200,390 295,295 390,390",
  9: "390,200 295,295 390,390",
  10: "390,200 295,105 200,200 295,295",
  11: "390,10 295,105 390,200",
  12: "200,10 390,10 295,105",
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },  // Top Diamond
  2: { x: 105, y: 45 },   // Top Left Triangle
  3: { x: 45, y: 105 },   // Top Left Triangle
  4: { x: 105, y: 200 },  // Left Diamond
  5: { x: 45, y: 295 },   // Bottom Left Triangle
  6: { x: 105, y: 355 },  // Bottom Left Triangle
  7: { x: 200, y: 295 },  // Bottom Diamond
  8: { x: 295, y: 355 },  // Bottom Right Triangle
  9: { x: 355, y: 295 },  // Bottom Right Triangle
  10: { x: 295, y: 200 }, // Right Diamond
  11: { x: 355, y: 105 }, // Top Right Triangle
  12: { x: 295, y: 45 },  // Top Right Triangle
};

const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 144 },  // Moved to avoid central circle
  2: { x: 105, y: 85 },
  3: { x: 85, y: 105 },
  4: { x: 144, y: 200 },  // Moved to avoid central circle
  5: { x: 90, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 200, y: 256 },  // Moved to avoid central circle
  8: { x: 295, y: 325 },
  9: { x: 315, y: 295 },
  10: { x: 256, y: 200 }, // Moved to avoid central circle
  11: { x: 315, y: 105 },
  12: { x: 295, y: 85 },
};

const HOUSE_LABEL_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 35 },
  2: { x: 105, y: 35 },
  3: { x: 35, y: 80 },
  4: { x: 35, y: 200 },
  5: { x: 35, y: 320 },
  6: { x: 105, y: 365 },
  7: { x: 200, y: 365 },
  8: { x: 295, y: 365 },
  9: { x: 365, y: 320 },
  10: { x: 365, y: 200 },
  11: { x: 365, y: 80 },
  12: { x: 295, y: 35 },
};

// Calculation helpers
function getRashiModality(signIndex: number): "Movable" | "Fixed" | "Dual" {
  const movable = [1, 4, 7, 10];
  const fixed = [2, 5, 8, 11];
  if (movable.includes(signIndex)) return "Movable";
  if (fixed.includes(signIndex)) return "Fixed";
  return "Dual";
}

function getRashiDrishtiTargets(signIndex: number): { aspected: number[]; skipped: number | null } {
  const movable = [1, 4, 7, 10];
  const fixed = [2, 5, 8, 11];
  const dual = [3, 6, 9, 12];

  if (movable.includes(signIndex)) {
    const skipped = (signIndex % 12) + 1; // adjacent fixed sign
    const aspected = fixed.filter(f => f !== skipped);
    return { aspected, skipped };
  }

  if (fixed.includes(signIndex)) {
    const skipped = signIndex === 2 ? 1 : signIndex - 1; // adjacent movable sign
    const aspected = movable.filter(m => m !== skipped);
    return { aspected, skipped };
  }

  const aspected = dual.filter(d => d !== signIndex);
  return { aspected, skipped: null };
}

function getGrahaDrishtiTargets(planet: string, fromSign: number): number[] {
  const targets = [(fromSign + 6) % 12 || 12]; // Universal 7th aspect

  if (planet === "Mars") {
    targets.push((fromSign + 3) % 12 || 12); // 4th
    targets.push((fromSign + 7) % 12 || 12); // 8th
  } else if (planet === "Jupiter") {
    targets.push((fromSign + 4) % 12 || 12); // 5th
    targets.push((fromSign + 8) % 12 || 12); // 9th
  } else if (planet === "Saturn") {
    targets.push((fromSign + 2) % 12 || 12); // 3rd
    targets.push((fromSign + 9) % 12 || 12); // 10th
  }

  return Array.from(new Set(targets));
}

export function AspectDoctrineComparator() {
  const [planetAName, setPlanetAName] = useState<string>("Mars");
  const [planetBName, setPlanetBName] = useState<string>("Saturn");
  const [signA, setSignA] = useState<number>(1);
  const [signB, setSignB] = useState<number>(8);

  // Find objects
  const planetA = useMemo(() => PLANETS.find(p => p.name === planetAName) ?? PLANETS[0], [planetAName]);
  const planetB = useMemo(() => PLANETS.find(p => p.name === planetBName) ?? PLANETS[1], [planetBName]);

  const signAObj = useMemo(() => RASHIS.find(r => r.number === signA) ?? RASHIS[0], [signA]);
  const signBObj = useMemo(() => RASHIS.find(r => r.number === signB) ?? RASHIS[0], [signB]);

  // Modalities
  const modA = useMemo(() => getRashiModality(signA), [signA]);
  const modB = useMemo(() => getRashiModality(signB), [signB]);

  // Calculations
  const parashariTargets = useMemo(() => getGrahaDrishtiTargets(planetA.name, signA), [planetA, signA]);
  const jaiminiTargets = useMemo(() => getRashiDrishtiTargets(signA).aspected, [signA]);

  const hasParashariAspect = useMemo(() => parashariTargets.includes(signB), [parashariTargets, signB]);
  const hasJaiminiAspect = useMemo(() => jaiminiTargets.includes(signB), [jaiminiTargets, signB]);

  const verdict = useMemo(() => {
    if (hasParashariAspect && hasJaiminiAspect) return "both";
    if (hasParashariAspect) return "parashari-only";
    if (hasJaiminiAspect) return "jaimini-only";
    return "neither";
  }, [hasParashariAspect, hasJaiminiAspect]);

  // Active tab is always driven by the computed verdict
  const activeTab = useMemo(() => VERDICT_TABS.find(t => t.key === verdict) ?? VERDICT_TABS[0], [verdict]);

  // Dynamic description based on current state
  const activeDescription = useMemo(() => {
    const pA = planetA.name;
    const pB = planetB.name;
    const sAName = `${signAObj.nameIAST} (${signAObj.nameEnglish})`;
    const sBName = `${signBObj.nameIAST} (${signBObj.nameEnglish})`;

    if (verdict === "both") {
      return `${pA} in ${sAName} and ${pB} in ${sBName}: Both Parāśari graha-dṛṣṭi and Jaimini rāśi-dṛṣṭi are active — a reinforced, double-channel link.`;
    }
    if (verdict === "parashari-only") {
      return `${pA} in ${sAName} and ${pB} in ${sBName}: Only Parāśari graha-dṛṣṭi is active. The signs do not aspect under Jaimini's modality rule.`;
    }
    if (verdict === "jaimini-only") {
      return `${pA} in ${sAName} and ${pB} in ${sBName}: Only Jaimini rāśi-dṛṣṭi is active. No planetary house-aspect exists under Parāśari.`;
    }
    return `${pA} in ${sAName} and ${pB} in ${sBName}: No aspect channel is active under either system.`;
  }, [planetA, planetB, signAObj, signBObj, verdict]);

  // Load a preset example for a given verdict category
  const loadPresetForVerdict = (verdictKey: string) => {
    const preset = PRESETS.find(p => p.verdictKey === verdictKey);
    if (preset) {
      setPlanetAName(preset.planetA);
      setPlanetBName(preset.planetB);
      setSignA(preset.signA);
      setSignB(preset.signB);
    }
  };

  const getModalityColor = (mod: "Movable" | "Fixed" | "Dual") => {
    if (mod === "Movable") return CARA_COLOR;
    if (mod === "Fixed") return STHIRA_COLOR;
    return DVI_COLOR;
  };

  // Bezier curve computation for Jaimini arcing outward relative to center (200, 200), shortened at ends
  const getBezierPath = (from: number, to: number) => {
    const p1 = HOUSE_CENTERS[from];
    const p2 = HOUSE_CENTERS[to];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const L = Math.sqrt(dx * dx + dy * dy);

    if (L < 0.1) {
      return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
    }

    // Shorten path by 32px at both ends to cleanly clear cell text & badges
    const margin = 32;
    const x1 = p1.x + (dx / L) * margin;
    const y1 = p1.y + (dy / L) * margin;
    const x2 = p2.x - (dx / L) * margin;
    const y2 = p2.y - (dy / L) * margin;

    // Midpoint of shortened path
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Calculate perpendicular unit normal vector
    let Ux = -dy / L;
    let Uy = dx / L;

    // Vector from center (200, 200) to midpoint
    const vx = mx - 200;
    const vy = my - 200;

    // Direct curve outward (away from center)
    const dot = Ux * vx + Uy * vy;
    if (dot < 0) {
      Ux = -Ux;
      Uy = -Uy;
    }

    // Outward bend height of 30 pixels creates a beautiful orbiting effect
    const bend = 30;
    const cx = mx + bend * Ux;
    const cy = my + bend * Uy;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.65)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "860px",
        margin: "0 auto"
      }}
    >
      {/* Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} /> Aspect Doctrine Comparator
          </h3>
          <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Side-by-side comparison of the same chart placements under each doctrine</span>
        </div>
        <button
          type="button"
          onClick={() => loadPresetForVerdict("both")}
          style={{
            background: "transparent",
            border: "none",
            color: GOLD_DEEP,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: "4px",
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(156, 122, 47, 0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <RotateCcw size={12} /> Reset to Default
        </button>
      </div>

      {/* Verdict-driven category tabs — always shows active state based on computed verdict */}
      <div style={{ marginBottom: "18px" }}>
        <label style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "8px" }}>
          Active Verdict Category · <span style={{ fontWeight: 500, color: INK_MUTED }}>Click a tab to load its example scenario</span>
        </label>
        <div style={{ display: "flex", gap: "0", borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(156, 122, 47, 0.12)", background: "rgba(255, 255, 255, 0.5)" }}>
          {VERDICT_TABS.map((tab) => {
            const isActive = verdict === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => loadPresetForVerdict(tab.key)}
                style={{
                  flex: 1,
                  padding: "10px 8px 12px",
                  border: "none",
                  borderBottom: isActive ? `3px solid ${tab.accentColor}` : "3px solid transparent",
                  background: isActive ? tab.accentBg : "transparent",
                  color: isActive ? tab.accentColor : INK_MUTED,
                  fontSize: "11px",
                  fontWeight: isActive ? 800 : 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "4px",
                  position: "relative",
                  letterSpacing: isActive ? "0.02em" : "0",
                  borderRight: "1px solid rgba(156, 122, 47, 0.06)"
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(156, 122, 47, 0.03)";
                    e.currentTarget.style.color = tab.accentColor;
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = INK_MUTED;
                  }
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>{tab.icon}</span>
                <span>{tab.label}</span>
                {/* Active glow dot */}
                {isActive && (
                  <motion.div
                    layoutId="active-verdict-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: tab.accentColor,
                      boxShadow: `0 0 8px ${tab.accentColor}40`
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        {/* Dynamic description bar */}
        <motion.div
          key={verdict}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            fontSize: "11px",
            color: activeTab.accentColor,
            marginTop: "8px",
            background: activeTab.accentBg,
            padding: "8px 12px",
            borderRadius: "6px",
            borderLeft: `3px solid ${activeTab.accentColor}`,
            lineHeight: 1.5
          }}
        >
          {activeTab.icon} {activeDescription}
        </motion.div>
      </div>

      {/* Manual Controls */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", background: "rgba(255, 251, 240, 0.4)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.08)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 200px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 700 }}>Planet A:</span>
          <select
            value={planetAName}
            onChange={(e) => setPlanetAName(e.target.value)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff", flex: 1 }}
          >
            {PLANETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          <span style={{ fontSize: "11.5px" }}>in Sign:</span>
          <select
            value={signA}
            onChange={(e) => setSignA(Number(e.target.value))}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
          >
            {RASHIS.map(r => <option key={r.number} value={r.number}>{r.number}. {r.nameIAST} ({r.nameEnglish})</option>)}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: "1 1 200px" }}>
          <span style={{ fontSize: "11.5px", fontWeight: 700 }}>Planet B:</span>
          <select
            value={planetBName}
            onChange={(e) => setPlanetBName(e.target.value)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff", flex: 1 }}
          >
            {PLANETS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          <span style={{ fontSize: "11.5px" }}>in Sign:</span>
          <select
            value={signB}
            onChange={(e) => setSignB(Number(e.target.value))}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}
          >
            {RASHIS.map(r => <option key={r.number} value={r.number}>{r.number}. {r.nameIAST} ({r.nameEnglish})</option>)}
          </select>
        </div>
      </div>

      {/* Side-by-Side Canvas diptych */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>
        
        {/* Left Column: Parāśari */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: "1 1 280px", maxWidth: "340px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, borderBottom: `2px solid ${GOLD_DEEP}`, paddingBottom: "2px" }}>
            Parāśari Graha-Dṛṣṭi (Planetary Gaze)
          </span>
          <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}>
            <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ background: "rgba(255, 251, 240, 0.2)", borderRadius: "12px", overflow: "visible" }}>
              <defs>
                <marker id="arrow-parashari" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD_DEEP} />
                </marker>
                <marker id="arrow-parashari-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={CARA_COLOR} />
                </marker>
              </defs>

              {/* Draw 12 House Polygons */}
              {Array.from({ length: 12 }, (_, idx) => {
                const sNum = idx + 1; // Aries Lagna means Sign == House
                const isSignA = sNum === signA;
                const isSignB = sNum === signB;
                const isAspected = parashariTargets.includes(sNum);

                let cellBg = "transparent";
                let cellStroke = "rgba(156, 122, 47, 0.15)";
                let borderThickness = 1.0;

                if (isSignA) {
                  cellBg = "rgba(156, 122, 47, 0.08)";
                  cellStroke = GOLD;
                  borderThickness = 2.0;
                } else if (isSignB) {
                  cellBg = "rgba(79, 111, 168, 0.08)";
                  cellStroke = INDIGO;
                  borderThickness = 2.0;
                } else if (isAspected) {
                  cellBg = "rgba(156, 122, 47, 0.01)";
                  cellStroke = "rgba(156, 122, 47, 0.25)";
                  borderThickness = 1.2;
                }

                return (
                  <g key={`parashari-house-${sNum}`}>
                    {/* House Polygon */}
                    <polygon
                      points={HOUSE_POLYGONS[sNum]}
                      fill={cellBg}
                      stroke={cellStroke}
                      strokeWidth={borderThickness}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    
                    {/* Fixed House Label H1-H12 */}
                    <text
                      x={HOUSE_LABEL_POSITIONS[sNum].x}
                      y={HOUSE_LABEL_POSITIONS[sNum].y}
                      fill="rgba(107, 95, 82, 0.22)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      H{sNum}
                    </text>

                    {/* Sign Number */}
                    <text
                      x={HOUSE_SIGN_NUM_POS[sNum].x}
                      y={HOUSE_SIGN_NUM_POS[sNum].y}
                      fill={isSignA ? GOLD : (isSignB ? INDIGO : INK_MUTED)}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      {sNum}
                    </text>

                    {/* Sign English Name */}
                    <text
                      x={HOUSE_CENTERS[sNum].x}
                      y={HOUSE_CENTERS[sNum].y - 8}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSignA ? GOLD : (isSignB ? INDIGO : INK_PRIMARY)}
                      fontSize="12.5"
                      fontWeight="800"
                    >
                      {RASHIS[sNum - 1].nameEnglish}
                    </text>

                    {/* Sign Sanskrit IAST Name */}
                    <text
                      x={HOUSE_CENTERS[sNum].x}
                      y={HOUSE_CENTERS[sNum].y + 8}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={INK_SECONDARY}
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      ({RASHIS[sNum - 1].nameIAST})
                    </text>

                    {/* Planet representation at the house center */}
                    {isSignA && (
                      <g transform={`translate(${HOUSE_CENTERS[sNum].x - (isSignB ? 18 : 0)}, ${HOUSE_CENTERS[sNum].y - 28})`}>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={planetA.color} stroke="#ffffff" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                          {planetA.badgeLabel}
                        </text>
                      </g>
                    )}
                    {isSignB && (
                      <g transform={`translate(${HOUSE_CENTERS[sNum].x + (isSignA ? 18 : 0)}, ${HOUSE_CENTERS[sNum].y - 28})`}>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={planetB.color} stroke="#ffffff" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                          {planetB.badgeLabel}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Draw North Indian Lines */}
              <g stroke="var(--gl-gold-accent, #9C7A2F)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ pointerEvents: "none" }}>
                <rect x="10" y="10" width="380" height="380" />
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
              </g>

              {/* Central Text Medallion */}
              <circle cx="200" cy="200" r="44" fill="rgba(255, 251, 240, 0.95)" stroke={GOLD} strokeWidth="1.5" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.1))" }} />
              <text x="200" y="196" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">PARĀŚARI</text>
              <text x="200" y="209" textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="700" letterSpacing="0.05em">GRAHA-DṚṢṬI</text>

              {/* Draw Graha aspect lines */}
              {parashariTargets.map((target) => {
                const p1 = HOUSE_CENTERS[signA];
                const p2 = HOUSE_CENTERS[target];
                const isActiveLink = target === signB;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const L = Math.sqrt(dx * dx + dy * dy) || 1;
                const margin = 32;
                const x1 = p1.x + (dx / L) * margin;
                const y1 = p1.y + (dy / L) * margin;
                const x2 = p2.x - (dx / L) * margin;
                const y2 = p2.y - (dy / L) * margin;

                return (
                  <line
                    key={`parashari-line-${target}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isActiveLink ? CARA_COLOR : "rgba(156, 122, 47, 0.28)"}
                    strokeWidth={isActiveLink ? 2.5 : 1}
                    strokeDasharray={isActiveLink ? "none" : "3,3"}
                    markerEnd={isActiveLink ? "url(#arrow-parashari-active)" : "url(#arrow-parashari)"}
                    style={{ pointerEvents: "none" }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Jaimini */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flex: "1 1 280px", maxWidth: "340px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: INDIGO, borderBottom: `2px solid ${INDIGO}`, paddingBottom: "2px" }}>
            Jaimini Rāśi-Dṛṣṭi (Sign-to-Sign Gaze)
          </span>
          <div style={{ width: "100%", aspectRatio: "1/1", position: "relative" }}>
            <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ background: "rgba(255, 251, 240, 0.2)", borderRadius: "12px", overflow: "visible" }}>
              <defs>
                <marker id="arrow-jaimini" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={INDIGO} />
                </marker>
                <marker id="arrow-jaimini-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={DVI_COLOR} />
                </marker>
              </defs>

              {/* Draw 12 House Polygons */}
              {Array.from({ length: 12 }, (_, idx) => {
                const sNum = idx + 1; // Aries Lagna
                const isSignA = sNum === signA;
                const isSignB = sNum === signB;
                const isAspected = jaiminiTargets.includes(sNum);

                const currentMod = getRashiModality(sNum);
                const currentModColor = getModalityColor(currentMod);

                let cellBg = "transparent";
                let cellStroke = "rgba(156, 122, 47, 0.15)";
                let borderThickness = 1.0;

                if (isSignA) {
                  cellBg = "rgba(156, 122, 47, 0.08)";
                  cellStroke = GOLD;
                  borderThickness = 2.0;
                } else if (isSignB) {
                  cellBg = "rgba(79, 111, 168, 0.08)";
                  cellStroke = INDIGO;
                  borderThickness = 2.0;
                } else if (isAspected) {
                  cellBg = "rgba(79, 111, 168, 0.01)";
                  cellStroke = "rgba(79, 111, 168, 0.25)";
                  borderThickness = 1.2;
                }

                return (
                  <g key={`jaimini-house-${sNum}`}>
                    {/* House Polygon */}
                    <polygon
                      points={HOUSE_POLYGONS[sNum]}
                      fill={cellBg}
                      stroke={cellStroke}
                      strokeWidth={borderThickness}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    
                    {/* Fixed House Label H1-H12 */}
                    <text
                      x={HOUSE_LABEL_POSITIONS[sNum].x}
                      y={HOUSE_LABEL_POSITIONS[sNum].y}
                      fill="rgba(107, 95, 82, 0.22)"
                      fontSize="9"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      H{sNum}
                    </text>

                    {/* Sign Number */}
                    <text
                      x={HOUSE_SIGN_NUM_POS[sNum].x}
                      y={HOUSE_SIGN_NUM_POS[sNum].y}
                      fill={isSignA ? GOLD : (isSignB ? INDIGO : INK_MUTED)}
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="select-none pointer-events-none"
                    >
                      {sNum}
                    </text>

                    {/* Sign English Name */}
                    <text
                      x={HOUSE_CENTERS[sNum].x}
                      y={HOUSE_CENTERS[sNum].y - 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSignA ? GOLD : (isSignB ? INDIGO : INK_PRIMARY)}
                      fontSize="12.5"
                      fontWeight="800"
                      style={{ letterSpacing: "0.02em" }}
                    >
                      {RASHIS[sNum - 1].nameEnglish}
                    </text>

                    {/* Sign Sanskrit IAST Name */}
                    <text
                      x={HOUSE_CENTERS[sNum].x}
                      y={HOUSE_CENTERS[sNum].y + 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isSignA ? GOLD : (isSignB ? INDIGO : INK_SECONDARY)}
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      ({RASHIS[sNum - 1].nameIAST})
                    </text>

                    {/* Modality Badge inside House */}
                    <g transform={`translate(${HOUSE_CENTERS[sNum].x}, ${HOUSE_CENTERS[sNum].y + 16})`}>
                      <rect x="-20" y="-7" width="40" height="14" rx="7" fill={currentModColor} opacity={isSignA || isSignB ? 1 : 0.8} />
                      <text y="1" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" letterSpacing="0.05em">
                        {currentMod === "Movable" ? "CARA" : (currentMod === "Fixed" ? "STHI" : "DVI")}
                      </text>
                    </g>

                    {/* Planet representation at the house center */}
                    {isSignA && (
                      <g transform={`translate(${HOUSE_CENTERS[sNum].x - (isSignB ? 18 : 0)}, ${HOUSE_CENTERS[sNum].y - 28})`}>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={planetA.color} stroke="#ffffff" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                          {planetA.badgeLabel}
                        </text>
                      </g>
                    )}
                    {isSignB && (
                      <g transform={`translate(${HOUSE_CENTERS[sNum].x + (isSignA ? 18 : 0)}, ${HOUSE_CENTERS[sNum].y - 28})`}>
                        <rect x="-20" y="-9" width="40" height="18" rx="4" fill={planetB.color} stroke="#ffffff" strokeWidth="0.8" />
                        <text y="3.5" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700">
                          {planetB.badgeLabel}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Draw North Indian Lines */}
              <g stroke="var(--gl-gold-accent, #9C7A2F)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ pointerEvents: "none" }}>
                <rect x="10" y="10" width="380" height="380" />
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
              </g>

              {/* Central Text Medallion */}
              <circle cx="200" cy="200" r="44" fill="rgba(255, 251, 240, 0.95)" stroke={INDIGO} strokeWidth="1.5" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.1))" }} />
              <text x="200" y="196" textAnchor="middle" fill={INDIGO} fontSize="10" fontWeight="900" letterSpacing="0.05em">JAIMINI</text>
              <text x="200" y="209" textAnchor="middle" fill={INK_MUTED} fontSize="8" fontWeight="700" letterSpacing="0.05em">RĀŚI-DṚṢṬI</text>

              {/* Draw Jaimini curved aspect lines */}
              {jaiminiTargets.map((target) => {
                const path = getBezierPath(signA, target);
                const isActiveLink = target === signB;

                return (
                  <path
                    key={`jaimini-line-${target}`}
                    d={path}
                    fill="none"
                    stroke={isActiveLink ? DVI_COLOR : "rgba(79, 111, 168, 0.28)"}
                    strokeWidth={isActiveLink ? 2.5 : 1}
                    strokeDasharray={isActiveLink ? "none" : "3,3"}
                    markerEnd={isActiveLink ? "url(#arrow-jaimini-active)" : "url(#arrow-jaimini)"}
                    style={{ pointerEvents: "none" }}
                  />
                );
              })}
            </svg>
          </div>
        </div>

      </div>

      {/* Bottom Verdict Panel */}
      <div style={{
        marginTop: "16px",
        padding: "16px",
        borderRadius: "8px",
        background: "rgba(255, 255, 255, 0.5)",
        border: "1px solid rgba(156, 122, 47, 0.12)"
      }}>
        {/* Aspect Badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(156,122,47,0.08)", paddingBottom: "10px" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: INK_SECONDARY }}>Active Doctrine Aspect Status:</span>
          
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            background: verdict === "both"
              ? "rgba(156, 122, 47, 0.12)"
              : verdict === "parashari-only"
                ? "rgba(190, 18, 60, 0.1)"
                : verdict === "jaimini-only"
                  ? "rgba(67, 56, 202, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            color: verdict === "both"
              ? GOLD_DEEP
              : verdict === "parashari-only"
                ? CARA_COLOR
                : verdict === "jaimini-only"
                  ? DVI_COLOR
                  : INK_MUTED,
            border: "1px solid",
            borderColor: verdict === "both"
              ? GOLD
              : verdict === "parashari-only"
                ? "rgba(190, 18, 60, 0.25)"
                : verdict === "jaimini-only"
                  ? "rgba(67, 56, 202, 0.25)"
                  : "rgba(0, 0, 0, 0.1)"
          }}>
            {verdict === "both" && "★ Both Agree (Reinforced)"}
            {verdict === "parashari-only" && "🪐 Parāśari Graha-Dṛṣṭi Only"}
            {verdict === "jaimini-only" && "🧭 Jaimini Rāśi-Dṛṣṭi Only"}
            {verdict === "neither" && "❌ No Connection (Neither)"}
          </div>
        </div>

        {/* Detailed textual breakdown */}
        <div style={{ fontSize: "12px", lineHeight: "1.5", color: INK_SECONDARY }}>
          {verdict === "both" && (
            <div>
              <strong>Both doctrines connect these points:</strong>
              <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                <li><span style={{ color: CARA_COLOR }}>Parāśari Graha-Dṛṣṭi:</span> {planetA.name} ({planetA.symbol}) in {signAObj.nameIAST} casts an aspect to {signBObj.nameIAST} (house-count aspects align).</li>
                <li><span style={{ color: DVI_COLOR }}>Jaimini Rāśi-Dṛṣṭi:</span> {signAObj.nameIAST} ({modA} modality) has sign-aspect with {signBObj.nameIAST} ({modB} modality).</li>
              </ul>
              <div style={{ marginTop: "10px", padding: "8px", background: "rgba(156, 122, 47, 0.05)", borderRadius: "6px", border: "1px dashed rgba(156, 122, 47, 0.2)" }}>
                🔥 <strong>Interpretation Strength:</strong> This creates a highly reinforced, double-channel link. You can declare this connection with high interpretive confidence in your chart readings.
              </div>
            </div>
          )}

          {verdict === "parashari-only" && (
            <div>
              <strong>Only the Parāśari planet-gaze connects these points:</strong>
              <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                <li><span style={{ color: CARA_COLOR }}>Parāśari Graha-Dṛṣṭi:</span> {planetA.name} ({planetA.symbol}) in {signAObj.nameIAST} aspects {signBObj.nameIAST} via house-count rule.</li>
                <li><span style={{ color: INK_MUTED }}>Jaimini Rāśi-Dṛṣṭi:</span> {signAObj.nameIAST} ({modA}) and {signBObj.nameIAST} ({modB}) do not aspect Jaimini-style (both are {modA === modB ? `the same modality (${modA})` : `adjacent signs or mismatched modalities`}).</li>
              </ul>
              <div style={{ marginTop: "10px", padding: "8px", background: "rgba(190, 18, 60, 0.04)", borderRadius: "6px", border: "1px dashed rgba(190, 18, 60, 0.15)" }}>
                💡 <strong>Practitioner Note:</strong> State this as a Parāśari aspect. When writing or explaining the reading, declare: <em>&quot;Connected via Parāśari graha-dṛṣṭi; Jaimini sign aspect is silent here.&quot;</em>
              </div>
            </div>
          )}

          {verdict === "jaimini-only" && (
            <div>
              <strong>Only the Jaimini sign-modality rule connects these points:</strong>
              <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                <li><span style={{ color: INK_MUTED }}>Parāśari Graha-Dṛṣṭi:</span> {planetA.name} ({planetA.symbol}) in {signAObj.nameIAST} has no house-count aspect to {signBObj.nameIAST}.</li>
                <li><span style={{ color: DVI_COLOR }}>Jaimini Rāśi-Dṛṣṭi:</span> {signAObj.nameIAST} ({modA}) aspects {signBObj.nameIAST} ({modB}) according to the Jaimini modality grid rules.</li>
              </ul>
              <div style={{ marginTop: "10px", padding: "8px", background: "rgba(67, 56, 202, 0.04)", borderRadius: "6px", border: "1px dashed rgba(67, 56, 202, 0.15)" }}>
                🧭 <strong>Practitioner Note:</strong> This is a classic Jaimini link that a standard Parāśari reading would completely miss. When interpreting Jaimini yogas or dasha systems, utilize this connection, naming it as <em>&quot;rāśi-dṛṣṭi&quot;</em>.
              </div>
            </div>
          )}

          {verdict === "neither" && (
            <div>
              <strong>These two placements are completely unconnected by aspect:</strong>
              <ul style={{ margin: "6px 0 0 16px", padding: 0 }}>
                <li>No Parāśari graha-dṛṣṭi exists from {planetA.name} in {signAObj.nameIAST} to {signBObj.nameIAST}.</li>
                <li>No Jaimini rāśi-dṛṣṭi exists between {signAObj.nameIAST} ({modA}) and {signBObj.nameIAST} ({modB}).</li>
              </ul>
              <div style={{ marginTop: "10px", padding: "8px", background: "rgba(0, 0, 0, 0.02)", borderRadius: "6px", border: "1px dashed rgba(0, 0, 0, 0.08)" }}>
                ❌ <strong>No active channel:</strong> In a reading, these two placements do not interact via aspect. Try choosing another scenario preset or moving the signs to check other interactions.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
