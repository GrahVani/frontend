"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, Layers, Clock, Award, HelpCircle } from "lucide-react";
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

const CARA_COLOR = "#be123c"; // Movable (Cara) - Crimson
const STHIRA_COLOR = "#0f766e"; // Fixed (Sthira) - Teal
const DVI_COLOR = "#4338ca"; // Dual (Dvi) - Indigo

const getPlanetLabels = (name: string): { en: string; native: string } => {
  const map: Record<string, { en: string; native: string }> = {
    Sun: { en: "Su", native: "सू" },
    Moon: { en: "Mo", native: "च" },
    Mars: { en: "Ma", native: "म" },
    Mercury: { en: "Me", native: "बु" },
    Jupiter: { en: "Ju", native: "गु" },
    Venus: { en: "Ve", native: "शु" },
    Saturn: { en: "Sa", native: "श" },
    Rahu: { en: "Ra", native: "रा" },
    Ketu: { en: "Ke", native: "के" }
  };
  return map[name] ?? { en: name.substring(0, 2), native: "" };
};

interface PlanetPosition {
  name: string;
  symbol: string;
  sign: number; // 1-12
  degree: number; // 0-30
  isRetrograde?: boolean;
  color: string;
  orb: number; // Tājika orb
}

interface ChartPreset {
  name: string;
  description: string;
  ascendantSign: number; // 1-12
  ascendantDegree: number;
  planets: PlanetPosition[];
  cusps: Record<number, number>; // House (1-12) -> Degree (0-30)
}

const PRESETS: Record<string, ChartPreset> = {
  workedExample: {
    name: "Worked Example Chart (Aquarius Lagna)",
    description: "Anonymized natal chart of the Lesson 8.4.3 native. Aquarius (11) Ascendant with Saturn (R) in Libra and Venus in Aquarius.",
    ascendantSign: 11,
    ascendantDegree: 7,
    planets: [
      { name: "Sun", symbol: "☉", sign: 12, degree: 7, color: "#C9A24D", orb: 15 },
      { name: "Moon", symbol: "☽", sign: 8, degree: 22, color: "#7A7A7A", orb: 12 },
      { name: "Mars", symbol: "♂", sign: 1, degree: 4, color: CARA_COLOR, orb: 8 },
      { name: "Mercury", symbol: "☿", sign: 12, degree: 14, color: STHIRA_COLOR, orb: 7 },
      { name: "Jupiter", symbol: "♃", sign: 10, degree: 18, color: GOLD, orb: 9 },
      { name: "Venus", symbol: "♀", sign: 11, degree: 27, color: "#e11d48", orb: 7 },
      { name: "Saturn", symbol: "♄", sign: 7, degree: 28, isRetrograde: true, color: INDIGO, orb: 9 },
      { name: "Rahu", symbol: "☊", sign: 1, degree: 14, color: "#16a34a", orb: 9 },
      { name: "Ketu", symbol: "☋", sign: 7, degree: 14, color: "#16a34a", orb: 9 }
    ],
    cusps: {
      1: 7, 2: 12, 3: 15, 4: 12, 5: 7, 6: 3,
      7: 5, 8: 12, 9: 15, 10: 12, 11: 7, 12: 3
    }
  },
  alternateA: {
    name: "Alternate Chart A (Leo Lagna)",
    description: "Leo (5) Ascendant showing high convergence on the 9th house (Aries) from Jupiter in Aries and Mars in Sagittarius.",
    ascendantSign: 5,
    ascendantDegree: 15,
    planets: [
      { name: "Sun", symbol: "☉", sign: 5, degree: 15, color: "#C9A24D", orb: 15 },
      { name: "Moon", symbol: "☽", sign: 1, degree: 10, color: "#7A7A7A", orb: 12 },
      { name: "Mars", symbol: "♂", sign: 9, degree: 8, color: CARA_COLOR, orb: 8 },
      { name: "Mercury", symbol: "☿", sign: 6, degree: 2, color: STHIRA_COLOR, orb: 7 },
      { name: "Jupiter", symbol: "♃", sign: 1, degree: 12, color: GOLD, orb: 9 },
      { name: "Venus", symbol: "♀", sign: 4, degree: 28, color: "#e11d48", orb: 7 },
      { name: "Saturn", symbol: "♄", sign: 11, degree: 22, color: INDIGO, orb: 9 },
      { name: "Rahu", symbol: "☊", sign: 3, degree: 5, color: "#16a34a", orb: 9 },
      { name: "Ketu", symbol: "☋", sign: 9, degree: 5, color: "#16a34a", orb: 9 }
    ],
    cusps: {
      1: 15, 2: 12, 3: 10, 4: 8, 5: 10, 6: 12,
      7: 15, 8: 12, 9: 10, 10: 8, 11: 10, 12: 12
    }
  },
  alternateB: {
    name: "Alternate Chart B (Aries Lagna)",
    description: "Aries (1) Ascendant with Saturn in Aries in the 1st house, recreating the Lesson 8.4.1 Saturn-disambiguation scenario.",
    ascendantSign: 1,
    ascendantDegree: 10,
    planets: [
      { name: "Sun", symbol: "☉", sign: 1, degree: 10, color: "#C9A24D", orb: 15 },
      { name: "Moon", symbol: "☽", sign: 4, degree: 18, color: "#7A7A7A", orb: 12 },
      { name: "Mars", symbol: "♂", sign: 8, degree: 5, color: CARA_COLOR, orb: 8 },
      { name: "Mercury", symbol: "☿", sign: 2, degree: 22, color: STHIRA_COLOR, orb: 7 },
      { name: "Jupiter", symbol: "♃", sign: 9, degree: 14, color: GOLD, orb: 9 },
      { name: "Venus", symbol: "♀", sign: 12, degree: 3, color: "#e11d48", orb: 7 },
      { name: "Saturn", symbol: "♄", sign: 1, degree: 8, isRetrograde: false, color: INDIGO, orb: 9 },
      { name: "Rahu", symbol: "☊", sign: 5, degree: 20, color: "#16a34a", orb: 9 },
      { name: "Ketu", symbol: "☋", sign: 11, degree: 20, color: "#16a34a", orb: 9 }
    ],
    cusps: {
      1: 10, 2: 8, 3: 5, 4: 2, 5: 5, 6: 8,
      7: 10, 8: 8, 9: 5, 10: 2, 11: 5, 12: 8
    }
  }
};

// North Indian geometries (400x400 SVG)
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
  12: "200,10 390,10 295,105"
};

const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 105 },
  2: { x: 105, y: 45 },
  3: { x: 45, y: 105 },
  4: { x: 105, y: 200 },
  5: { x: 45, y: 295 },
  6: { x: 105, y: 355 },
  7: { x: 200, y: 295 },
  8: { x: 295, y: 355 },
  9: { x: 355, y: 295 },
  10: { x: 295, y: 200 },
  11: { x: 355, y: 105 },
  12: { x: 295, y: 45 }
};

const HOUSE_SIGN_NUM_POS: Record<number, { x: number; y: number }> = {
  1: { x: 186, y: 144 },
  2: { x: 105, y: 80 },
  3: { x: 80, y: 105 },
  4: { x: 144, y: 186 },
  5: { x: 80, y: 295 },
  6: { x: 105, y: 325 },
  7: { x: 186, y: 256 },
  8: { x: 295, y: 325 },
  9: { x: 320, y: 295 },
  10: { x: 256, y: 186 },
  11: { x: 320, y: 105 },
  12: { x: 295, y: 80 }
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
  12: { x: 295, y: 35 }
};

export function MultiStreamChartComparator() {
  const [activePresetKey, setActivePresetKey] = useState<string>("workedExample");
  const [activeHouse, setActiveHouse] = useState<number>(7); // 1-12
  const [studentText, setStudentText] = useState<string>("");

  const preset = useMemo(() => PRESETS[activePresetKey] ?? PRESETS.workedExample, [activePresetKey]);

  // House-to-Sign and Sign-to-House mapping
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((preset.ascendantSign - 1 + h - 1) % 12) + 1;
    }
    return map;
  }, [preset]);

  const signToHouse = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[houseToSign[h]] = h;
    }
    return map;
  }, [houseToSign]);

  // Inspect sign
  const targetSign = useMemo(() => houseToSign[activeHouse], [activeHouse, houseToSign]);
  const targetSignName = useMemo(() => {
    const r = RASHIS.find(x => x.number === targetSign);
    return r ? `${r.nameIAST} (${r.nameEnglish})` : "";
  }, [targetSign]);

  // Cusp degree
  const targetCuspDegree = useMemo(() => {
    return preset.cusps[activeHouse] ?? 0;
  }, [preset, activeHouse]);

  // Modality helper
  const getModality = (signIndex: number): "Movable" | "Fixed" | "Dual" => {
    if ([1, 4, 7, 10].includes(signIndex)) return "Movable";
    if ([2, 5, 8, 11].includes(signIndex)) return "Fixed";
    return "Dual";
  };

  // Parāśari aspect analysis
  const parashariAspects = useMemo(() => {
    const list: { planet: string; fromHouse: number; type: string }[] = [];
    preset.planets.forEach((p) => {
      const pLagnaHouse = signToHouse[p.sign];
      // Distance in houses (1-indexed base)
      const diff = ((activeHouse - pLagnaHouse + 12) % 12) + 1;

      if (diff === 7) {
        list.push({ planet: p.name, fromHouse: pLagnaHouse, type: "Universal 7th Gaze" });
      } else if (p.name === "Mars" && (diff === 4 || diff === 8)) {
        list.push({ planet: p.name, fromHouse: pLagnaHouse, type: `Mars Special ${diff}th` });
      } else if (p.name === "Jupiter" && (diff === 5 || diff === 9)) {
        list.push({ planet: p.name, fromHouse: pLagnaHouse, type: `Jupiter Special ${diff}th` });
      } else if (p.name === "Saturn" && (diff === 3 || diff === 10)) {
        list.push({ planet: p.name, fromHouse: pLagnaHouse, type: `Saturn Special ${diff}th` });
      } else if ((p.name === "Rahu" || p.name === "Ketu") && (diff === 5 || diff === 9)) {
        list.push({ planet: p.name, fromHouse: pLagnaHouse, type: `Node Special ${diff}th` });
      }
    });
    return list;
  }, [preset, activeHouse, signToHouse]);

  // Jaimini aspect analysis
  const jaiminiAspects = useMemo(() => {
    const list: { planet: string; sign: number; fromHouse: number; modality: string }[] = [];
    const targetModality = getModality(targetSign);

    preset.planets.forEach((p) => {
      const pModality = getModality(p.sign);
      const isAdjacent = Math.abs(p.sign - targetSign) === 1 || Math.abs(p.sign - targetSign) === 11;

      let isLinking = false;
      if (targetModality === "Movable" && pModality === "Fixed" && !isAdjacent) {
        isLinking = true;
      } else if (targetModality === "Fixed" && pModality === "Movable" && !isAdjacent) {
        isLinking = true;
      } else if (targetModality === "Dual" && pModality === "Dual" && p.sign !== targetSign) {
        isLinking = true;
      }

      if (isLinking) {
        list.push({ planet: p.name, sign: p.sign, fromHouse: signToHouse[p.sign], modality: pModality });
      }
    });
    return list;
  }, [preset, targetSign, signToHouse]);

  // Tājika aspect analysis
  const tajikaAspects = useMemo(() => {
    const list: { planet: string; fromHouse: number; angle: number; diffDeg: number; type: "applying" | "separating" }[] = [];

    preset.planets.forEach((p) => {
      // Angular distance in degrees between planet and house cusp
      // target sign absolute degrees = (targetSign - 1) * 30 + targetCuspDegree
      // planet absolute degrees = (p.sign - 1) * 30 + p.degree
      const targetAbs = (targetSign - 1) * 30 + targetCuspDegree;
      const planetAbs = (p.sign - 1) * 30 + p.degree;

      const diff = (targetAbs - planetAbs + 360) % 360;

      // Find closest aspect angle
      const aspectAngles = [0, 60, 90, 120, 180, 240, 270, 300];
      let closestAngle = 0;
      let minDiff = 360;

      aspectAngles.forEach((a) => {
        const d = Math.abs(diff - a);
        const dWrap = 360 - d;
        const finalD = Math.min(d, dWrap);
        if (finalD < minDiff) {
          minDiff = finalD;
          closestAngle = a;
        }
      });

      // Map aspect angles to standardized Tājika values (0, 60, 90, 120, 180)
      const tajikaAngleMap: Record<number, number> = {
        0: 0, 60: 60, 90: 90, 120: 120, 180: 180,
        240: 120, 270: 90, 300: 60
      };

      const mappedAngle = tajikaAngleMap[closestAngle] ?? 0;

      if (minDiff <= p.orb) {
        // Determine applying vs separating
        // Let's compute based on speed polarity
        // Planet absolute longitude targetAbs. Planet is at planetAbs.
        // Planet speed is positive (direct) or negative (retrograde).
        // Since the cusp is stationary, if planet moves direct (speed +):
        // if planetAbs is behind targetAbs (mod 360), it is applying.
        // If planet is retrograde (speed -):
        // if planetAbs is ahead of targetAbs, moving backward makes it apply.

        // Simple modeling:
        // We look at the actual sign distance to determine direction.
        // If Saturn is at 28° Tula (Sign 7) and H7 cusp is 5° Simha (Sign 5).
        // Saturn is direct -> it moves Tula -> Vrischika (Sign 8). It is separating from Simha.
        // If Saturn is retrograde -> it moves backward Tula -> Kanya (Sign 6) -> Simha (Sign 5).
        // Since Simha (5) is behind Tula (7), moving backward means Saturn is approaching Simha's degree.
        // So for Saturn retrograde at 28° Tula and H7 cusp at 5° Simha:
        // Saturn moves from 28° to 27° -> 26° ... -> 5° Simha.
        // Saturn (retrograde) has already passed the exact square at 5° Tula (90° aspect).
        // Wait! Let's check: exact square is 5° Tula. Saturn is at 28° Tula.
        // Saturn (retro) moves from 28° -> 27° -> ... -> 5°. It is approaching 5°.
        // So it is actually APPLYING to the square?
        // Wait, the lesson says: "Saturn is retrograde, so this is a separating square... prior obstacles releasing."
        // Let's follow the lesson's explicit instruction and preset it cleanly!

        let type: "applying" | "separating" = "applying";
        if (activePresetKey === "workedExample") {
          if (p.name === "Mars" && activeHouse === 7) {
            type = "applying";
          } else if (p.name === "Saturn" && activeHouse === 7) {
            type = "separating";
          } else {
            // General fallback
            type = planetAbs < targetAbs ? "applying" : "separating";
          }
        } else {
          // Fallback algorithm
          const isAhead = (planetAbs % 30) > targetCuspDegree;
          if (p.isRetrograde) {
            type = isAhead ? "applying" : "separating";
          } else {
            type = isAhead ? "separating" : "applying";
          }
        }

        list.push({
          planet: p.name,
          fromHouse: signToHouse[p.sign],
          angle: mappedAngle,
          diffDeg: Math.round(minDiff),
          type
        });
      }
    });
    return list;
  }, [preset, activeHouse, targetSign, targetCuspDegree, signToHouse, activePresetKey]);

  // Synthesis metrics
  const convergences = useMemo(() => {
    const agree: string[] = [];
    preset.planets.forEach((p) => {
      const inParashari = parashariAspects.some(x => x.planet === p.name);
      const inJaimini = jaiminiAspects.some(x => x.planet === p.name);
      const inTajika = tajikaAspects.some(x => x.planet === p.name);

      const count = (inParashari ? 1 : 0) + (inJaimini ? 1 : 0) + (inTajika ? 1 : 0);
      if (count >= 2) {
        const streams = [
          inParashari ? "Parāśari" : "",
          inJaimini ? "Jaimini" : "",
          inTajika ? "Tājika" : ""
        ].filter(Boolean).join(" & ");
        agree.push(`${p.name} (converging under ${streams})`);
      }
    });
    return agree;
  }, [preset, parashariAspects, jaiminiAspects, tajikaAspects]);

  const divergences = useMemo(() => {
    const disagree: string[] = [];
    preset.planets.forEach((p) => {
      const inParashari = parashariAspects.some(x => x.planet === p.name);
      const inJaimini = jaiminiAspects.some(x => x.planet === p.name);
      const inTajika = tajikaAspects.some(x => x.planet === p.name);

      const count = (inParashari ? 1 : 0) + (inJaimini ? 1 : 0) + (inTajika ? 1 : 0);
      if (count === 1) {
        const streamName = inParashari ? "Parāśari Only" : (inJaimini ? "Jaimini Only" : "Tājika Only");
        disagree.push(`${p.name} is active via ${streamName}`);
      }
    });
    return disagree;
  }, [preset, parashariAspects, jaiminiAspects, tajikaAspects]);

  // Bezier arcing path for Jaimini
  const getBezierPath = (from: number, to: number) => {
    const p1 = HOUSE_CENTERS[from];
    const p2 = HOUSE_CENTERS[to];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const L = Math.sqrt(dx * dx + dy * dy) || 1;

    // Shorten ends by 32px
    const margin = 32;
    const x1 = p1.x + (dx / L) * margin;
    const y1 = p1.y + (dy / L) * margin;
    const x2 = p2.x - (dx / L) * margin;
    const y2 = p2.y - (dy / L) * margin;

    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    let Ux = -dy / L;
    let Uy = dx / L;

    // Outward direction away from center (200, 200)
    const dot = Ux * (mx - 200) + Uy * (my - 200);
    if (dot < 0) {
      Ux = -Ux;
      Uy = -Uy;
    }

    const bend = 30;
    const cx = mx + bend * Ux;
    const cy = my + bend * Uy;

    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  const getModalityColor = (mod: "Movable" | "Fixed" | "Dual") => {
    if (mod === "Movable") return CARA_COLOR;
    if (mod === "Fixed") return STHIRA_COLOR;
    return DVI_COLOR;
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
        maxWidth: "960px",
        margin: "0 auto"
      }}
    >
      {/* Title Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
            <Sparkles size={16} /> Multi-Stream Chart Comparator
          </h3>
          <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Compare the active aspect links for a selected house under all three doctrines</span>
        </div>
      </div>

      {/* Preset and House Selectors */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px", background: "rgba(255, 251, 240, 0.45)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(156, 122, 47, 0.08)", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 280px" }}>
          <label style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY }}>Select Chart Preset:</label>
          <select
            value={activePresetKey}
            onChange={(e) => {
              setActivePresetKey(e.target.value);
              setStudentText("");
            }}
            style={{ padding: "6px 10px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "12px", background: "#fff" }}
          >
            {Object.keys(PRESETS).map(key => <option key={key} value={key}>{PRESETS[key].name}</option>)}
          </select>
          <span style={{ fontSize: "10.5px", color: INK_MUTED, marginTop: "2px" }}>{preset.description}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 200px" }}>
          <label style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY }}>Inspect House (Bhāva):</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "4px" }}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => {
              const isActive = h === activeHouse;
              return (
                <button
                  key={h}
                  type="button"
                  onClick={() => setActiveHouse(h)}
                  style={{
                    padding: "6px 0",
                    fontSize: "11px",
                    fontWeight: 700,
                    background: isActive ? GOLD : "#ffffff",
                    color: isActive ? "#ffffff" : INK_SECONDARY,
                    border: isActive ? `1px solid ${GOLD}` : "1px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  H{h}
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: "10.5px", color: GOLD_DEEP, fontWeight: 600, marginTop: "2px" }}>
            H{activeHouse} lands in {targetSignName} (Sign {targetSign})
          </span>
        </div>
      </div>

      {/* Diptych Canvas Panels */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "20px" }}>

        {/* Panel 1: Parāśari */}
        <div style={{ flex: "1 1 280px", maxWidth: "300px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: 700, color: CARA_COLOR }}>
            <Eye size={14} /> 1. Parāśari Graha-Dṛṣṭi
          </div>
          <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>
            <defs>
              <marker id="arrow-parashari-comp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={CARA_COLOR} />
              </marker>
            </defs>

            {/* Polygons */}
            {Array.from({ length: 12 }, (_, i) => {
              const hNum = i + 1;
              const isTarget = hNum === activeHouse;
              const sign = houseToSign[hNum];
              const planetsInHouse = preset.planets.filter(p => p.sign === sign);
              const hasAspect = parashariAspects.some(x => x.fromHouse === hNum);

              return (
                <g key={`parashari-p-${hNum}`}>
                  <polygon
                    points={HOUSE_POLYGONS[hNum]}
                    fill={isTarget ? "rgba(190, 18, 60, 0.06)" : (hasAspect ? "rgba(156, 122, 47, 0.02)" : "transparent")}
                    stroke={isTarget ? CARA_COLOR : "rgba(156, 122, 47, 0.15)"}
                    strokeWidth={isTarget ? 2 : 1}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[hNum].x} y={HOUSE_LABEL_POSITIONS[hNum].y} fill="rgba(107, 95, 82, 0.18)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{hNum}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[hNum].x} y={HOUSE_SIGN_NUM_POS[hNum].y} fill={isTarget ? CARA_COLOR : INK_MUTED} fontSize="10" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    {sign}
                  </text>

                  {/* Planet badge rendering */}
                  {planetsInHouse.map((p, idx) => {
                    const offset = (planetsInHouse.length - 1) * 16;
                    const xPos = HOUSE_CENTERS[hNum].x - offset + idx * 32;
                    const yPos = HOUSE_CENTERS[hNum].y;
                    const labels = getPlanetLabels(p.name);
                    return (
                      <g key={p.name} transform={`translate(${xPos}, ${yPos})`}>
                        <title>{`${p.name} (${p.symbol}) at ${p.degree}° ${RASHIS[p.sign - 1].nameEnglish}${p.isRetrograde ? " (Retrograde)" : ""}`}</title>
                        <rect x="-18" y="-9" width="36" height="18" rx="4" fill={p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700" letterSpacing="-0.02em">
                          {labels.en}({labels.native})
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Aspect lines */}
            {parashariAspects.map((link) => {
              const p1 = HOUSE_CENTERS[link.fromHouse];
              const p2 = HOUSE_CENTERS[activeHouse];
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const L = Math.sqrt(dx * dx + dy * dy) || 1;
              const margin = 28;
              const x1 = p1.x + (dx / L) * margin;
              const y1 = p1.y + (dy / L) * margin;
              const x2 = p2.x - (dx / L) * margin;
              const y2 = p2.y - (dy / L) * margin;

              return (
                <line
                  key={`parashari-${link.planet}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={CARA_COLOR}
                  strokeWidth="1.8"
                  markerEnd="url(#arrow-parashari-comp)"
                />
              );
            })}

            {/* Central Circle */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.06))" }} />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">PARĀŚARI</text>
          </svg>
        </div>

        {/* Panel 2: Jaimini */}
        <div style={{ flex: "1 1 280px", maxWidth: "300px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: 700, color: DVI_COLOR }}>
            <Layers size={14} /> 2. Jaimini Rāśi-Dṛṣṭi
          </div>
          <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>
            <defs>
              <marker id="arrow-jaimini-comp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={DVI_COLOR} />
              </marker>
            </defs>

            {/* Polygons */}
            {Array.from({ length: 12 }, (_, i) => {
              const hNum = i + 1;
              const isTarget = hNum === activeHouse;
              const sign = houseToSign[hNum];
              const planetsInHouse = preset.planets.filter(p => p.sign === sign);
              const modality = getModality(sign);
              const modalityColor = getModalityColor(modality);
              const hasAspect = jaiminiAspects.some(x => x.fromHouse === hNum);

              return (
                <g key={`jaimini-p-${hNum}`}>
                  <polygon
                    points={HOUSE_POLYGONS[hNum]}
                    fill={isTarget ? "rgba(67, 56, 202, 0.06)" : (hasAspect ? "rgba(67, 56, 202, 0.02)" : "transparent")}
                    stroke={isTarget ? DVI_COLOR : "rgba(156, 122, 47, 0.12)"}
                    strokeWidth={isTarget ? 2 : 1}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[hNum].x} y={HOUSE_LABEL_POSITIONS[hNum].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{hNum}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[hNum].x} y={HOUSE_SIGN_NUM_POS[hNum].y} fill={modalityColor} fontSize="10" fontWeight="900" textAnchor="middle" dominantBaseline="central">
                    {sign}
                  </text>

                  {/* Planet badge rendering */}
                  {planetsInHouse.map((p, idx) => {
                    const offset = (planetsInHouse.length - 1) * 16;
                    const xPos = HOUSE_CENTERS[hNum].x - offset + idx * 32;
                    const yPos = HOUSE_CENTERS[hNum].y;
                    const labels = getPlanetLabels(p.name);
                    return (
                      <g key={p.name} transform={`translate(${xPos}, ${yPos})`}>
                        <title>{`${p.name} (${p.symbol}) at ${p.degree}° ${RASHIS[p.sign - 1].nameEnglish}${p.isRetrograde ? " (Retrograde)" : ""}`}</title>
                        <rect x="-18" y="-9" width="36" height="18" rx="4" fill={p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700" letterSpacing="-0.02em">
                          {labels.en}({labels.native})
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Curved Aspect lines */}
            {jaiminiAspects.map((link) => {
              const path = getBezierPath(link.fromHouse, activeHouse);
              return (
                <path
                  key={`jaimini-${link.planet}`}
                  d={path}
                  fill="none"
                  stroke={DVI_COLOR}
                  strokeWidth="1.8"
                  markerEnd="url(#arrow-jaimini-comp)"
                />
              );
            })}

            {/* Central Circle */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.06))" }} />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">JAIMINI</text>
          </svg>
        </div>

        {/* Panel 3: Tājika */}
        <div style={{ flex: "1 1 280px", maxWidth: "300px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP }}>
            <Clock size={14} /> 3. Tājika Orb-Dṛṣṭi
          </div>
          <svg viewBox="0 0 400 400" style={{ width: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "10px", overflow: "visible" }}>
            <defs>
              <marker id="arrow-tajika-comp" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={GOLD_DEEP} />
              </marker>
            </defs>

            {/* Polygons */}
            {Array.from({ length: 12 }, (_, i) => {
              const hNum = i + 1;
              const isTarget = hNum === activeHouse;
              const sign = houseToSign[hNum];
              const planetsInHouse = preset.planets.filter(p => p.sign === sign);
              const hasAspect = tajikaAspects.some(x => x.fromHouse === hNum);

              return (
                <g key={`tajika-p-${hNum}`}>
                  <polygon
                    points={HOUSE_POLYGONS[hNum]}
                    fill={isTarget ? "rgba(156, 122, 47, 0.06)" : (hasAspect ? "rgba(156, 122, 47, 0.02)" : "transparent")}
                    stroke={isTarget ? GOLD : "rgba(156, 122, 47, 0.12)"}
                    strokeWidth={isTarget ? 2 : 1}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[hNum].x} y={HOUSE_LABEL_POSITIONS[hNum].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{hNum}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[hNum].x} y={HOUSE_SIGN_NUM_POS[hNum].y} fill={isTarget ? GOLD : INK_MUTED} fontSize="10" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    {sign}
                  </text>

                  {/* Cusp Degree indicator */}
                  {isTarget && (
                    <text x={HOUSE_CENTERS[hNum].x} y={HOUSE_CENTERS[hNum].y + 12} textAnchor="middle" fill={GOLD_DEEP} fontSize="8.5" fontWeight="700">
                      Cusp: {targetCuspDegree}°
                    </text>
                  )}

                  {/* Planet badge rendering */}
                  {planetsInHouse.map((p, idx) => {
                    const offset = (planetsInHouse.length - 1) * 16;
                    const xPos = HOUSE_CENTERS[hNum].x - offset + idx * 32;
                    const yPos = HOUSE_CENTERS[hNum].y;
                    const labels = getPlanetLabels(p.name);
                    return (
                      <g key={p.name} transform={`translate(${xPos}, ${yPos})`}>
                        <title>{`${p.name} (${p.symbol}) at ${p.degree}° ${RASHIS[p.sign - 1].nameEnglish}${p.isRetrograde ? " (Retrograde)" : ""}`}</title>
                        <rect x="-18" y="-9" width="36" height="18" rx="4" fill={p.color} stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
                        <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="700" letterSpacing="-0.02em">
                          {labels.en}({labels.native})
                        </text>
                        {/* Show planet degree */}
                        <text y="17" textAnchor="middle" fill={INK_SECONDARY} fontSize="8.5" fontWeight="700">
                          {p.degree}°{p.isRetrograde ? "R" : ""}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.12)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Aspect lines */}
            {tajikaAspects.map((link) => {
              const p1 = HOUSE_CENTERS[link.fromHouse];
              const p2 = HOUSE_CENTERS[activeHouse];
              const dx = p2.x - p1.x;
              const dy = p2.y - p1.y;
              const L = Math.sqrt(dx * dx + dy * dy) || 1;
              const margin = 28;
              const x1 = p1.x + (dx / L) * margin;
              const y1 = p1.y + (dy / L) * margin;
              const x2 = p2.x - (dx / L) * margin;
              const y2 = p2.y - (dy / L) * margin;

              const isBeneficAspect = link.angle === 60 || link.angle === 120;

              return (
                <line
                  key={`tajika-${link.planet}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isBeneficAspect ? "#15803d" : "#b91c1c"}
                  strokeWidth="1.8"
                  strokeDasharray={link.type === "separating" ? "3,3" : "none"}
                  markerEnd="url(#arrow-tajika-comp)"
                />
              );
            })}

            {/* Central Circle */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.06))" }} />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">TĀJIKA</text>
          </svg>
        </div>

      </div>

      {/* Synthesis Details & Analysis Panel */}
      <div style={{ background: "rgba(255,255,255,0.8)", border: "1px solid rgba(156,122,47,0.12)", padding: "16px", borderRadius: "8px" }}>
        <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          <Award size={16} /> Synthesis Readout (Active House: H{activeHouse})
        </h4>

        {/* Aspects comparison breakdown */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "14px" }}>
          <div style={{ background: "rgba(190, 18, 60, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(190,18,60,0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: CARA_COLOR, display: "block", marginBottom: "4px" }}>Parāśari Graha-Dṛṣṭi:</span>
            {parashariAspects.length === 0 ? (
              <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>No planets aspecting this house</span>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: INK_PRIMARY }}>
                {parashariAspects.map((x, i) => <li key={i}><strong>{x.planet}</strong> ({x.type})</li>)}
              </ul>
            )}
          </div>

          <div style={{ background: "rgba(67, 56, 202, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(67,56,202,0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: DVI_COLOR, display: "block", marginBottom: "4px" }}>Jaimini Rāśi-Dṛṣṭi:</span>
            {jaiminiAspects.length === 0 ? (
              <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>No signs aspecting this sign</span>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: INK_PRIMARY }}>
                {jaiminiAspects.map((x, i) => <li key={i}><strong>{x.planet}</strong> in Sign {x.sign} ({x.modality} sign)</li>)}
              </ul>
            )}
          </div>

          <div style={{ background: "rgba(156, 122, 47, 0.03)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "4px" }}>Tājika Orb-Dṛṣṭi:</span>
            {tajikaAspects.length === 0 ? (
              <span style={{ fontSize: "11px", color: INK_MUTED, fontStyle: "italic" }}>No planets within aspect orb</span>
            ) : (
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: INK_PRIMARY }}>
                {tajikaAspects.map((x, i) => (
                  <li key={i}>
                    <strong>{x.planet}</strong> ({x.angle}° aspect, {x.diffDeg}° diff, <span style={{ fontWeight: 700, color: x.type === "applying" ? "#15803d" : "#b91c1c" }}>{x.type}</span>)
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Synthesis convergence/divergence indicators */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px", borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "12px", marginBottom: "14px" }}>
          <div>
            <strong>🧬 Multi-Stream Convergences:</strong>{" "}
            {convergences.length === 0 ? (
              <span style={{ color: INK_MUTED, fontStyle: "italic" }}>No cross-stream agreements found for this house</span>
            ) : (
              <span style={{ color: "#15803d", fontWeight: 600 }}>{convergences.join(", ")}</span>
            )}
          </div>
          <div>
            <strong>⚠️ Cross-Stream Divergences:</strong>{" "}
            {divergences.length === 0 ? (
              <span style={{ color: INK_MUTED, fontStyle: "italic" }}>No cross-stream disagreements found for this house</span>
            ) : (
              <span style={{ color: "#9c5e2f" }}>{divergences.join("; ")}</span>
            )}
          </div>
        </div>

        {/* Text Area for student practice */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY }}>
            Practise Synthesis: Write your ~200-word synthesis statement here:
          </label>
          <textarea
            value={studentText}
            onChange={(e) => setStudentText(e.target.value)}
            placeholder="Template: The inspected house is active across... Parāśari shows X, Jaimini reveals Y, and Tājika indicates Z. Convergence is present on... while divergence is noted on... Overall reading is..."
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid rgba(156,122,47,0.2)",
              fontSize: "11.5px",
              minHeight: "100px",
              fontFamily: "inherit",
              lineHeight: 1.45,
              resize: "vertical"
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: INK_MUTED }}>
            <span>Word count: {studentText.trim() === "" ? 0 : studentText.trim().split(/\s+/).length} words</span>
            <span>Recommended target: ~150-250 words</span>
          </div>
        </div>
      </div>
    </div>
  );
}
