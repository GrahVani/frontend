"use client";

import React, { useState, useMemo } from "react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SHANI_BLUE = "#4F6FA8"; // Standard Saturn Indigo color from Chapter 4
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

const CARA_COLOR = "#be123c"; // Movable (Cara) - Crimson
const STHIRA_COLOR = "#0f766e"; // Fixed (Sthira) - Teal
const DVI_COLOR = "#4338ca"; // Dual (Dvi) - Indigo

const getModality = (signIndex: number): "Movable" | "Fixed" | "Dual" => {
  if ([1, 4, 7, 10].includes(signIndex)) return "Movable";
  if ([2, 5, 8, 11].includes(signIndex)) return "Fixed";
  return "Dual";
};

const getModalityColor = (mod: "Movable" | "Fixed" | "Dual") => {
  if (mod === "Movable") return CARA_COLOR;
  if (mod === "Fixed") return STHIRA_COLOR;
  return DVI_COLOR;
};

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
  1: { x: 188, y: 142 },
  2: { x: 105, y: 80 },
  3: { x: 80, y: 105 },
  4: { x: 142, y: 188 },
  5: { x: 80, y: 295 },
  6: { x: 105, y: 320 },
  7: { x: 188, y: 258 },
  8: { x: 295, y: 320 },
  9: { x: 320, y: 295 },
  10: { x: 258, y: 188 },
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

export function ShashaAuthorityAnalyzer() {
  const [saturnSignNum, setSaturnSignNum] = useState<number>(7); // Libra (7 - exalt), Capricorn (10 - own), Aquarius (11 - own), Aries (1 - deb), Leo (5 - enemy)
  const [saturnHouse, setSaturnHouse] = useState<number>(10); // 1, 4, 7, 10 or 3
  const [age, setAge] = useState<number>(25); // 0 to 80 years
  const [isCombust, setIsCombust] = useState<boolean>(false);
  const [isAfflicted, setIsAfflicted] = useState<boolean>(false);

  // Derived Lagna
  const calculatedLagnaSign = useMemo(() => {
    return ((saturnSignNum - saturnHouse + 12) % 12) + 1;
  }, [saturnSignNum, saturnHouse]);

  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((calculatedLagnaSign + h - 2) % 12) + 1;
    }
    return map;
  }, [calculatedLagnaSign]);

  // Yoga status
  const isKendra = [1, 4, 7, 10].includes(saturnHouse);
  const isDignified = [7, 10, 11].includes(saturnSignNum);
  const isShashaActive = isKendra && isDignified;

  const saturnSignName = useMemo(() => {
    const r = RASHIS.find(x => x.number === saturnSignNum);
    return r ? `${r.nameIAST} (${r.nameEnglish})` : "";
  }, [saturnSignNum]);

  // Determine current timeline phase based on age
  const phase = useMemo(() => {
    if (age < 36) {
      return {
        id: 1,
        title: "Phase 1: Early Struggle & Discipline (Ages 0-36)",
        detail: "Saturn demands patience, heavy labor, and structural preparation. The yoga is felt as severe discipline, delays, and a building of grit."
      };
    }
    if (age <= 54) {
      return {
        id: 2,
        title: "Phase 2: Rise of Authority (Ages 36-54)",
        detail: "Saturn matures (structural peak at 36). The native begins rising to administrative authority, managing masses, and bearing heavy leadership roles."
      };
    }
    return {
      id: 3,
      title: "Phase 3: Peak Governance & Longevity (Ages 54-80+)",
      detail: "Peak expression of Śaśa Yoga. Confers stable authority, control over large organizations or public sectors, absolute persistence, and great longevity."
    };
  }, [age]);

  // Scores
  const scores = useMemo(() => {
    let massPower = 20;
    let persistence = 45;
    let stability = 40;
    let title = "Standard Saturn Expression";
    let desc = "Saturn represents duties, obligations, and normal limits, but does not form Śaśa Yoga.";

    if (saturnSignNum === 1) {
      massPower = 10;
      persistence = 25;
      stability = 20;
      title = "Debilitated Saturn (Nīca)";
      desc = "Saturn in Aries. Represents high friction, frustration under authority, poor endurance, and structural failures.";
    } else if (isShashaActive) {
      persistence = 95;
      stability = 90;

      // Mass Leadership scales strongly with age
      if (age < 36) {
        massPower = 40;
      } else if (age <= 54) {
        massPower = 75;
      } else {
        massPower = 95;
      }

      title = `Śaśa Yoga: ${saturnSignNum === 7 ? "Exalted Public Power" : "Own-Sign Administration"}`;
      desc = "Saturn is angular and highly dignified. Confers power over crowds, massive persistence, mechanical/political capability, and a long life of duty.";

      if (isAfflicted) {
        persistence -= 15;
        massPower -= 15;
        stability -= 25;
        title += " (Afflicted)";
        desc = "Malefics afflict Shani, tilting Saturn's mass leadership into harshness, rigid authoritarianism, or isolation.";
      }
      if (isCombust) {
        massPower -= 25;
        persistence -= 20;
        title += " (Combust)";
        desc = "Saturn is combust by the Sun. Inner discipline remains, but public recognition is delayed and authority feels constantly challenged.";
      }
    } else {
      persistence = [7, 10, 11].includes(saturnSignNum) ? 75 : 45;
      stability = 60;
      title = "Dignified Saturn (Off-Kendra)";
      desc = "Saturn is strong in sign dignity but sits in a non-kendra house. Discipline is internal; there is no major public stage or mass leadership platform.";
    }

    return { massPower, persistence, stability, title, desc };
  }, [saturnSignNum, isShashaActive, age, isCombust, isAfflicted]);

  return (
    <div style={{
      background: "rgba(255, 253, 248, 0.6)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      borderRadius: "16px",
      padding: "24px",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      boxShadow: "0 8px 32px rgba(72, 48, 16, 0.04)",
      display: "flex",
      flexWrap: "wrap",
      gap: "24px"
    }}>
      {/* SVG Chart Column */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: SHANI_BLUE, letterSpacing: "0.02em" }}>
          Śaśa Chart (Lagna Sign: {calculatedLagnaSign})
        </h3>

        <div style={{ position: "relative", width: "100%", maxWidth: "380px", aspectRatio: "1/1" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", overflow: "visible" }}>
            {/* Render Houses */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isKendra = [1, 4, 7, 10].includes(h);
              const hasSaturn = saturnHouse === h;

              return (
                <g key={`shasha-h-${h}`}>
                  <polygon
                    points={HOUSE_POLYGONS[h]}
                    fill={hasSaturn ? "rgba(67, 56, 202, 0.04)" : "transparent"}
                    stroke={hasSaturn ? SHANI_BLUE : (isKendra ? "rgba(156, 122, 47, 0.3)" : "rgba(156, 122, 47, 0.12)")}
                    strokeWidth={hasSaturn ? 2 : (isKendra ? 1.5 : 1)}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={getModalityColor(getModality(signNum))} fontSize="10.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Saturn badge */}
                  {hasSaturn && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                      <rect x="-22" y="-10" width="44" height="20" rx="4" fill={SHANI_BLUE} stroke="#ffffff" strokeWidth="1" />
                      <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">Sa(श)</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Standard Chart Diagonals */}
            <g stroke="rgba(156, 122, 47, 0.15)" strokeWidth="1.2" fill="none">
              <rect x="10" y="10" width="380" height="380" />
              <line x1="10" y1="10" x2="390" y2="390" />
              <line x1="390" y1="10" x2="10" y2="390" />
              <line x1="200" y1="10" x2="10" y2="200" />
              <line x1="10" y1="200" x2="200" y2="390" />
              <line x1="200" y1="390" x2="390" y2="200" />
              <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Central Circle */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" />
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">ŚAŚA</text>
          </svg>
        </div>
      </div>

      {/* Control and Timeline Column */}
      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* Controls Block */}
        <div style={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(156, 122, 47, 0.1)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>1. Saturn Sign (Dignity)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
              {[
                { label: "Libra (7) [Exalt]", val: 7 },
                { label: "Capricorn (10) [Own]", val: 10 },
                { label: "Aquarius (11) [Own]", val: 11 },
                { label: "Aries (1) [Deb]", val: 1 },
                { label: "Leo (5) [Enemy]", val: 5 }
              ].map(x => (
                <button
                  key={x.val}
                  onClick={() => setSaturnSignNum(x.val)}
                  style={{
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: saturnSignNum === x.val ? `1.5px solid ${SHANI_BLUE}` : "1.5px solid rgba(156,122,47,0.15)",
                    background: saturnSignNum === x.val ? `${SHANI_BLUE}15` : "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: saturnSignNum === x.val ? SHANI_BLUE : INK_SECONDARY
                  }}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "4px" }}>2. House Position</label>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 4, 7, 10, 3].map(h => (
                <button
                  key={`shh-${h}`}
                  onClick={() => setSaturnHouse(h)}
                  style={{
                    flex: "1",
                    padding: "6px 0",
                    borderRadius: "6px",
                    border: saturnHouse === h ? `2px solid ${SHANI_BLUE}` : "1px solid rgba(156,122,47,0.15)",
                    background: saturnHouse === h ? "rgba(67, 56, 202, 0.06)" : "#ffffff",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: saturnHouse === h ? SHANI_BLUE : INK_SECONDARY
                  }}
                >
                  H{h} {[1, 4, 7, 10].includes(h) ? "(Kendra)" : ""}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>3. Age / Maturity Progression</label>
              <span style={{ fontSize: "12px", fontWeight: 700, color: SHANI_BLUE }}>{age} Years Old</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: SHANI_BLUE,
                height: "6px",
                background: "rgba(0,0,0,0.08)",
                borderRadius: "3px"
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "16px", paddingTop: "4px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <input type="checkbox" checked={isCombust} onChange={(e) => setIsCombust(e.target.checked)} style={{ accentColor: SHANI_BLUE }} />
              Combust
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <input type="checkbox" checked={isAfflicted} onChange={(e) => setIsAfflicted(e.target.checked)} style={{ accentColor: SHANI_BLUE }} />
              Afflicted
            </label>
          </div>
        </div>

        {/* Timeline Visualizer */}
        <div style={{
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "12px",
          padding: "12px 16px"
        }}>
          <h5 style={{ margin: "0 0 6px 0", fontSize: "12px", fontWeight: 800, color: SHANI_BLUE }}>{phase.title}</h5>
          <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.4", color: INK_SECONDARY }}>{phase.detail}</p>

          {/* Simple Segmented Bar */}
          <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
            <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: age < 36 ? SHANI_BLUE : "rgba(0,0,0,0.08)" }} />
            <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: age >= 36 && age <= 54 ? SHANI_BLUE : "rgba(0,0,0,0.08)" }} />
            <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: age > 54 ? SHANI_BLUE : "rgba(0,0,0,0.08)" }} />
          </div>
        </div>

        {/* Verdict and Gauges */}
        <div style={{
          background: "rgba(255, 255, 255, 0.5)",
          border: "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "14px"
        }}>
          <div>
            <h4 style={{ fontSize: "14px", fontWeight: 850, margin: "0 0 4px 0", color: SHANI_BLUE }}>
              {scores.title}
            </h4>
            <span style={{ fontSize: "10.5px", color: GOLD_DEEP, fontWeight: 700, display: "block", marginBottom: "6px" }}>
              Saturn in {saturnSignName} — House {saturnHouse}
            </span>
            <p style={{ fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              {scores.desc}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "12px" }}>
            {/* Mass Leadership */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>👥 MASS LEADERSHIP & GOVERNANCE</span>
                <span>{scores.massPower}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.massPower}%`, height: "100%", background: SHANI_BLUE, borderRadius: "3px" }} />
              </div>
            </div>

            {/* Persistence */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>⏳ PERSISTENCE & RESILIENCE</span>
                <span>{scores.persistence}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.persistence}%`, height: "100%", background: GOLD_DEEP, borderRadius: "3px" }} />
              </div>
            </div>

            {/* Longevity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>⛰️ LONGEVITY / STRUCTURAL ENDURANCE</span>
                <span>{scores.stability}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.stability}%`, height: "100%", background: "#475569", borderRadius: "3px" }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
