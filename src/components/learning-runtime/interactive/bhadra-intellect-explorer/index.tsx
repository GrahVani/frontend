"use client";

import React, { useState, useMemo } from "react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const BUDHA_GREEN = "#0f766e"; // Teal green for Mercury
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

export function BhadraIntellectExplorer() {
  const [mercurySignNum, setMercurySignNum] = useState<number>(6); // 3 (Gemini), 6 (Virgo), 12 (Pisces), 9 (Sagittarius)
  const [degree, setDegree] = useState<number>(8); // 0-30
  const [mercuryHouse, setMercuryHouse] = useState<number>(1); // 1, 4, 7, 10 or 9
  const [isCombust, setIsCombust] = useState<boolean>(false);
  const [isAfflicted, setIsAfflicted] = useState<boolean>(false);

  // Derived Lagna to position Mercury correctly in selected sign and house
  const calculatedLagnaSign = useMemo(() => {
    return ((mercurySignNum - mercuryHouse + 12) % 12) + 1;
  }, [mercurySignNum, mercuryHouse]);

  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((calculatedLagnaSign + h - 2) % 12) + 1;
    }
    return map;
  }, [calculatedLagnaSign]);

  // Determine detailed sub-dignity within Gemini / Virgo
  const subDignity = useMemo(() => {
    if (mercurySignNum === 3) {
      return { type: "Own Sign", text: "Gemini — Own Sign (Svakṣetra)" };
    }
    if (mercurySignNum === 6) {
      if (degree <= 15) {
        return { type: "Exalted & Mūlatrikoṇa", text: "Virgo 0°-15° — Exalted & Mūlatrikoṇa (Peak)" };
      }
      if (degree <= 20) {
        return { type: "Mūlatrikoṇa", text: "Virgo 15°-20° — Mūlatrikoṇa boundary" };
      }
      return { type: "Own Sign", text: "Virgo 20°-30° — Own Sign" };
    }
    if (mercurySignNum === 12) {
      return { type: "Debilitated", text: "Pisces — Debilitated (Nīca)" };
    }
    return { type: "Neutral", text: "Sagittarius — Neutral" };
  }, [mercurySignNum, degree]);

  const isKendra = [1, 4, 7, 10].includes(mercuryHouse);
  const isDignified = [3, 6].includes(mercurySignNum);
  const isBhadraActive = isKendra && isDignified;

  // Compute Gauges
  const scores = useMemo(() => {
    let analytical = 40;
    let eloquence = 45;
    let deceit = 15;
    let symmetry = 50;
    let title = "Standard Intellect";
    let desc = "Mercury's logic is functional but does not form a major yoga. Rationality is average.";

    if (mercurySignNum === 12) {
      analytical = 15;
      eloquence = 25;
      deceit = 40;
      symmetry = 30;
      title = "Debilitated Mercury (Nīca)";
      desc = "Mercury in Pisces. Fails the rational test; thinking is poetic, highly subjective, and prone to communication confusion or logical gaps.";
    } else if (isBhadraActive) {
      symmetry = 95;
      // High-grade Bhadra Yoga
      if (mercurySignNum === 6) {
        if (degree <= 15) {
          analytical = 100;
          eloquence = 90;
          deceit = 8;
          title = "Bhadra Yoga: Supreme Exaltation";
          desc = "Mercury is in its peak degree zone of Virgo. Gives exceptional analytical genius, scientific discernment, mathematical intelligence, and refined speech.";
        } else if (degree <= 20) {
          analytical = 92;
          eloquence = 92;
          deceit = 10;
          title = "Bhadra Yoga: Mūlatrikoṇa Zone";
          desc = "Mercury in Virgo's Mūlatrikoṇa. Represents sharp wit, intense logical drive, pragmatic thinking, and clear verbal presentation.";
        } else {
          analytical = 85;
          eloquence = 95;
          deceit = 12;
          title = "Bhadra Yoga: Own Sign Virgo";
          desc = "Mercury in Virgo's own-sign zone. Confers eloquent speech, strong discrimination, and administrative capability.";
        }
      } else {
        // Gemini Own Sign
        analytical = 80;
        eloquence = 100;
        deceit = 15;
        title = "Bhadra Yoga: Gemini Eloquence";
        desc = "Mercury in Gemini in a Kendra. Fosters extreme verbal speed, wit, literary talents, social adaptation, and versatile communicative skills.";
      }

      // Modify scores if combust or afflicted
      if (isAfflicted) {
        analytical -= 20;
        deceit += 60;
        symmetry = 45;
        title += " (Afflicted)";
        desc = "Saturn or Rāhu afflicts Mercury. The brilliant intellect tilts toward craftiness, over-cleverness, deceit, and highly manipulative communication.";
      }
      if (isCombust) {
        eloquence -= 30;
        analytical -= 10;
        deceit += 30;
        symmetry = 60;
        title += " (Combust)";
        desc = "Mercury is combust by the Sun. The intellect is brilliant but the expression is anxious, restless, and occasionally prone to stuttering or intellectual arrogance.";
      }
    } else {
      // Dignified but not in Kendra
      analytical = mercurySignNum === 6 ? 75 : 60;
      eloquence = mercurySignNum === 3 ? 75 : 65;
      deceit = 20;
      symmetry = 70;
      title = "Dignified Mercury (Off-Kendra)";
      desc = "Mercury is strong in own-sign/exaltation, but placed in a non-kendra house (like H9). Represents a smart, studious native, but lacks the angular pillars to manifest a public Bhadra Yoga.";
      if (isCombust) {
        eloquence -= 20;
      }
    }

    return { analytical, eloquence, deceit, symmetry, title, desc };
  }, [mercurySignNum, degree, isBhadraActive, isCombust, isAfflicted]);

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
        <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: BUDHA_GREEN, letterSpacing: "0.02em" }}>
          Bhadra Chart (Lagna Sign: {calculatedLagnaSign})
        </h3>

        <div style={{ position: "relative", width: "100%", maxWidth: "380px", aspectRatio: "1/1" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", overflow: "visible" }}>
            {/* Render Houses */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isKendra = [1, 4, 7, 10].includes(h);
              const hasMercury = mercuryHouse === h;

              return (
                <g key={`bhadra-h-${h}`}>
                  <polygon
                    points={HOUSE_POLYGONS[h]}
                    fill={hasMercury ? "rgba(15, 118, 110, 0.04)" : "transparent"}
                    stroke={hasMercury ? BUDHA_GREEN : (isKendra ? "rgba(156, 122, 47, 0.3)" : "rgba(156, 122, 47, 0.12)")}
                    strokeWidth={hasMercury ? 2 : (isKendra ? 1.5 : 1)}
                  />
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.15)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={getModalityColor(getModality(signNum))} fontSize="10.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Mercury badge */}
                  {hasMercury && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`}>
                      <rect x="-22" y="-10" width="44" height="20" rx="4" fill={BUDHA_GREEN} stroke="#ffffff" strokeWidth="1" />
                      <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="700">Me(बु)</text>
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
            <text x="200" y="203" textAnchor="middle" fill={GOLD_DEEP} fontSize="10" fontWeight="900" letterSpacing="0.05em">BHADRA</text>
          </svg>
        </div>
      </div>

      {/* Control and Slider Column */}
      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Controls Block */}
        <div style={{
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(156, 122, 47, 0.1)",
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>1. Mercury Sign</label>
            <div style={{ display: "flex", gap: "6px" }}>
              {[
                { label: "Virgo (6) [Double]", val: 6 },
                { label: "Gemini (3) [Own]", val: 3 },
                { label: "Pisces (12) [Deb]", val: 12 },
                { label: "Sagittarius (9)", val: 9 }
              ].map(x => (
                <button
                  key={x.val}
                  onClick={() => setMercurySignNum(x.val)}
                  style={{
                    flex: "1",
                    padding: "6px 4px",
                    borderRadius: "6px",
                    border: mercurySignNum === x.val ? `1.5px solid ${BUDHA_GREEN}` : "1.5px solid rgba(156,122,47,0.15)",
                    background: mercurySignNum === x.val ? `${BUDHA_GREEN}15` : "#ffffff",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: mercurySignNum === x.val ? BUDHA_GREEN : INK_SECONDARY
                  }}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>2. Longitude (Degree)</label>
              <span style={{ fontSize: "12px", fontWeight: 700, color: BUDHA_GREEN }}>{degree}° {subDignity.type}</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={degree}
              onChange={(e) => setDegree(Number(e.target.value))}
              style={{
                width: "100%",
                accentColor: BUDHA_GREEN,
                height: "6px",
                background: "rgba(0,0,0,0.08)",
                borderRadius: "3px"
              }}
            />
            {mercurySignNum === 6 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9.5px", color: INK_MUTED, marginTop: "4px" }}>
                <span>0° (Exalt/MT)</span>
                <span>15° (MT boundary)</span>
                <span>20° (Own Sign)</span>
                <span>30°</span>
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>3. House Position</label>
            <div style={{ display: "flex", gap: "6px" }}>
              {[1, 4, 7, 10, 9].map(h => (
                <button
                  key={`mh-${h}`}
                  onClick={() => setMercuryHouse(h)}
                  style={{
                    flex: "1",
                    padding: "8px 0",
                    borderRadius: "6px",
                    border: mercuryHouse === h ? `2px solid ${BUDHA_GREEN}` : "1px solid rgba(156,122,47,0.15)",
                    background: mercuryHouse === h ? "rgba(15,118,110,0.06)" : "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: mercuryHouse === h ? BUDHA_GREEN : INK_SECONDARY
                  }}
                >
                  H{h} {[1, 4, 7, 10].includes(h) ? "(Kendra)" : ""}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isCombust}
                onChange={(e) => setIsCombust(e.target.checked)}
                style={{ accentColor: BUDHA_GREEN }}
              />
              Combust (Budha-Aditya combustion)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={isAfflicted}
                onChange={(e) => setIsAfflicted(e.target.checked)}
                style={{ accentColor: BUDHA_GREEN }}
              />
              Afflicted by Saturn/Rāhu
            </label>
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
          gap: "16px"
        }}>
          <div>
            <h4 style={{ fontSize: "14.5px", fontWeight: 850, margin: "0 0 4px 0", color: BUDHA_GREEN }}>
              {scores.title}
            </h4>
            <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "8px" }}>
              {subDignity.text}
            </span>
            <p style={{ fontSize: "13px", lineHeight: "1.45", color: INK_SECONDARY, margin: 0 }}>
              {scores.desc}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "12px" }}>
            {/* Analytical Clarity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>🧠 ANALYTICAL CLARITY</span>
                <span>{scores.analytical}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.analytical}%`, height: "100%", background: BUDHA_GREEN, borderRadius: "3px" }} />
              </div>
            </div>

            {/* Eloquence & Wit */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>🗣️ ELOQUENCE & WIT</span>
                <span>{scores.eloquence}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.eloquence}%`, height: "100%", background: GOLD_DEEP, borderRadius: "3px" }} />
              </div>
            </div>

            {/* Deceit / Over-cleverness */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>🎭 CUNNING & DECEIT</span>
                <span>{scores.deceit}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.deceit}%`, height: "100%", background: scores.deceit > 40 ? "#be123c" : "#eab308", borderRadius: "3px" }} />
              </div>
            </div>

            {/* Physical Symmetry */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, marginBottom: "2px" }}>
                <span>📐 PHYSICAL SYMMETRY (SAMA-GĀTRA)</span>
                <span>{scores.symmetry}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "rgba(0,0,0,0.05)", borderRadius: "3px" }}>
                <div style={{ width: `${scores.symmetry}%`, height: "100%", background: "#4f46e5", borderRadius: "3px" }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
