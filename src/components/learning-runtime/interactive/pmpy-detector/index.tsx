"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, CheckCircle, HelpCircle, Info } from "lucide-react";
import { RASHIS } from "../rashi-data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
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

// Planet short-code maps
const PLANET_DATA = [
  { name: "Mars", labelEn: "Ma", labelNative: "म", isTara: true, color: CARA_COLOR },
  { name: "Mercury", labelEn: "Me", labelNative: "बु", isTara: true, color: STHIRA_COLOR },
  { name: "Jupiter", labelEn: "Ju", labelNative: "गु", isTara: true, color: GOLD },
  { name: "Venus", labelEn: "Ve", labelNative: "शु", isTara: true, color: "#e11d48" },
  { name: "Saturn", labelEn: "Sa", labelNative: "श", isTara: true, color: INDIGO },
  { name: "Sun", labelEn: "Su", labelNative: "सू", isTara: false, color: "#C9A24D" },
  { name: "Moon", labelEn: "Mo", labelNative: "च", isTara: false, color: "#7A7A7A" },
  { name: "Rahu", labelEn: "Ra", labelNative: "रा", isTara: false, color: "#16a34a" }
];

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

export function PmpyDetector() {
  const [lagnaSign, setLagnaSign] = useState<number>(1); // 1-12
  const [selectedPlanetName, setSelectedPlanetName] = useState<string>("Jupiter");
  const [planetHouse, setPlanetHouse] = useState<number>(4); // 1-12
  const [isCombust, setIsCombust] = useState<boolean>(false);
  const [isAfflicted, setIsAfflicted] = useState<boolean>(false);

  const selectedPlanet = useMemo(() => {
    return PLANET_DATA.find(p => p.name === selectedPlanetName) || PLANET_DATA[2];
  }, [selectedPlanetName]);

  // Map each house to its rashi sign number based on Lagna sign
  const houseToSign = useMemo(() => {
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      map[h] = ((lagnaSign + h - 2) % 12) + 1;
    }
    return map;
  }, [lagnaSign]);

  // Planet sign is determined by its house placement
  const planetSign = useMemo(() => {
    return houseToSign[planetHouse];
  }, [planetHouse, houseToSign]);

  const planetSignName = useMemo(() => {
    const r = RASHIS.find(x => x.number === planetSign);
    return r ? `${r.nameIAST} (${r.nameEnglish})` : "";
  }, [planetSign]);

  // Calculate Dignity of the selected planet in its current sign
  const dignityResult = useMemo(() => {
    if (!selectedPlanet.isTara && selectedPlanet.name !== "Sun" && selectedPlanet.name !== "Moon") {
      return { label: "No Standard Dignity", isDignified: false, detail: "Nodes do not have agreed exaltation/own signs." };
    }

    const name = selectedPlanet.name;
    const sign = planetSign;

    // Exaltation signs
    const exaltations: Record<string, number> = {
      Sun: 1, Moon: 2, Mars: 10, Mercury: 6, Jupiter: 4, Venus: 12, Saturn: 7
    };
    // Own signs
    const ownSigns: Record<string, number[]> = {
      Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6], Jupiter: [9, 12], Venus: [2, 7], Saturn: [10, 11]
    };
    // Debilitation signs
    const debilitations: Record<string, number> = {
      Sun: 7, Moon: 8, Mars: 4, Mercury: 12, Jupiter: 10, Venus: 6, Saturn: 1
    };

    if (exaltations[name] === sign) {
      return { label: "Exalted", isDignified: true, detail: "Exalted (Utcha) — maximum primary strength." };
    }
    if (ownSigns[name]?.includes(sign)) {
      return {
        label: "Own Sign",
        isDignified: true,
        detail: name === "Mercury" && sign === 6
          ? "Virgo (Double Dignity: Own sign & Exaltation!)"
          : "Own Sign (Svakṣetra) — strong and stable."
      };
    }
    if (debilitations[name] === sign) {
      return { label: "Debilitated", isDignified: false, detail: "Debilitated (Nīca) — severely weakened." };
    }
    return { label: "Neutral / Other", isDignified: false, detail: "In a neutral, friendly, or enemy sign." };
  }, [selectedPlanet, planetSign]);

  // PMPY Logic Evaluation
  const yogaResult = useMemo(() => {
    if (!selectedPlanet.isTara) {
      return {
        status: "NONE",
        title: "No Yoga",
        reason: `${selectedPlanet.name} is excluded. Only the five tārā-grahas (Mars, Mercury, Jupiter, Venus, Saturn) can form a Pañca-Mahāpuruṣa Yoga.`
      };
    }

    const isKendra = [1, 4, 7, 10].includes(planetHouse);
    const isDignified = dignityResult.isDignified;

    if (!isKendra && !isDignified) {
      return {
        status: "NONE",
        title: "No Yoga",
        reason: "Both conditions failed. The planet is neither in a Kendra nor in a dignified sign (own/exalted)."
      };
    }
    if (!isDignified) {
      return {
        status: "NONE",
        title: "No Yoga",
        reason: `Placed in a Kendra (House ${planetHouse}), but fails the dignity requirement. It must be in its own sign or exalted.`
      };
    }
    if (!isKendra) {
      return {
        status: "NONE",
        title: "No Yoga",
        reason: `Strong in dignity (${dignityResult.label}), but fails the location requirement. It must be in a Kendra (1st, 4th, 7th, or 10th house).`
      };
    }

    // Yoga names mapping
    const yogaNames: Record<string, string> = {
      Mars: "Ruchaka Yoga",
      Mercury: "Bhadra Yoga",
      Jupiter: "Haṁsa Yoga",
      Venus: "Mālavya Yoga",
      Saturn: "Śaśa Yoga"
    };

    const name = yogaNames[selectedPlanet.name] || "Mahāpuruṣa Yoga";

    if (isCombust || isAfflicted) {
      return {
        status: "MARRED",
        title: `${name} (Marred)`,
        reason: `Forms structurally! However, because the planet is ${isCombust && isAfflicted ? "combust and afflicted" : isCombust ? "combust (too close to Sun)" : "afflicted by malefics"}, the quality of the yoga is spoiled or significantly reduced.`
      };
    }

    return {
      status: "ACTIVE",
      title: `${name} Active!`,
      reason: `Excellent! Placed in a Kendra (House ${planetHouse}) and dignified in ${planetSignName} (${dignityResult.label}). The classical qualities of ${selectedPlanet.name} are highly elevated.`
    };
  }, [selectedPlanet, planetHouse, dignityResult, planetSignName, isCombust, isAfflicted]);

  return (
    <div style={{
      background: "rgba(255, 253, 248, 0.6)",
      backdropFilter: "blur(12px)",
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
      {/* Visual Chart Column */}
      <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: GOLD_DEEP, letterSpacing: "0.02em" }}>
          Lagna: {RASHIS[lagnaSign - 1].nameIAST} Ascendant
        </h3>

        <div style={{ position: "relative", width: "100%", maxWidth: "380px", aspectRatio: "1/1" }}>
          <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%", background: "#fffdf8", border: "1px solid rgba(156,122,47,0.12)", borderRadius: "12px", overflow: "visible" }}>
            <defs>
              <filter id="shadow-pmpy" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.08" floodColor="#483010" />
              </filter>
            </defs>

            {/* Render Houses */}
            {Array.from({ length: 12 }, (_, i) => {
              const h = i + 1;
              const signNum = houseToSign[h];
              const isKendra = [1, 4, 7, 10].includes(h);
              const hasPlanet = planetHouse === h;

              return (
                <g key={`house-${h}`}>
                  <polygon
                    points={HOUSE_POLYGONS[h]}
                    fill={hasPlanet ? "rgba(156, 122, 47, 0.05)" : "transparent"}
                    stroke={hasPlanet ? GOLD : (isKendra ? "rgba(156, 122, 47, 0.3)" : "rgba(156, 122, 47, 0.12)")}
                    strokeWidth={hasPlanet ? 2.5 : (isKendra ? 1.6 : 1)}
                    style={{ transition: "stroke 0.2s" }}
                  />

                  {/* House Label */}
                  <text x={HOUSE_LABEL_POSITIONS[h].x} y={HOUSE_LABEL_POSITIONS[h].y} fill="rgba(107, 95, 82, 0.18)" fontSize="8.5" fontWeight="700" textAnchor="middle" dominantBaseline="central">
                    H{h}
                  </text>

                  {/* Sign Number */}
                  <text x={HOUSE_SIGN_NUM_POS[h].x} y={HOUSE_SIGN_NUM_POS[h].y} fill={getModalityColor(getModality(signNum))} fontSize="10.5" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                    {signNum}
                  </text>

                  {/* Planet Badge */}
                  {hasPlanet && (
                    <g transform={`translate(${HOUSE_CENTERS[h].x}, ${HOUSE_CENTERS[h].y})`} filter="url(#shadow-pmpy)">
                      <rect
                        x="-22"
                        y="-10"
                        width="44"
                        height="20"
                        rx="5"
                        fill={selectedPlanet.color}
                        stroke="rgba(255, 255, 255, 0.35)"
                        strokeWidth="1.2"
                      />
                      <text
                        y="3.5"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9.5"
                        fontWeight="700"
                        letterSpacing="-0.01em"
                      >
                        {selectedPlanet.labelEn}({selectedPlanet.labelNative})
                      </text>
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

            {/* Central Masking Medallion */}
            <circle cx="200" cy="200" r="44" fill="#fffdf8" stroke={GOLD} strokeWidth="1.2" style={{ filter: "drop-shadow(0px 3px 6px rgba(72,48,16,0.08))" }} />
            <text x="200" y="196" textAnchor="middle" fill={GOLD_DEEP} fontSize="9" fontWeight="900" letterSpacing="0.06em">PAÑCA</text>
            <text x="200" y="209" textAnchor="middle" fill={GOLD_DEEP} fontSize="9" fontWeight="900" letterSpacing="0.06em">MAHĀPURUṢA</text>
          </svg>
        </div>
      </div>

      {/* Control Panel Column */}
      <div style={{ flex: "1 1 420px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Lagna and Planet selection */}
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
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>1. Lagna Sign (Ascendant)</label>
            <select
              value={lagnaSign}
              onChange={(e) => setLagnaSign(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(156,122,47,0.2)",
                background: "#ffffff",
                fontSize: "13px",
                color: INK_PRIMARY,
                fontWeight: 600,
                outline: "none"
              }}
            >
              {RASHIS.map(r => (
                <option key={r.number} value={r.number}>Sign {r.number} — {r.nameIAST} ({r.nameEnglish})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>2. Select Graha (Planet)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PLANET_DATA.map(p => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlanetName(p.name)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: selectedPlanetName === p.name ? `1.5px solid ${p.color}` : "1.5px solid rgba(156,122,47,0.15)",
                    background: selectedPlanetName === p.name ? `${p.color}15` : "#ffffff",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: selectedPlanetName === p.name ? p.color : INK_SECONDARY,
                    transition: "all 0.15s ease"
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY, display: "block", marginBottom: "6px" }}>3. House Position</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "6px" }}>
              {Array.from({ length: 12 }, (_, idx) => {
                const h = idx + 1;
                const isKendra = [1, 4, 7, 10].includes(h);
                return (
                  <button
                    key={`btn-h-${h}`}
                    onClick={() => setPlanetHouse(h)}
                    style={{
                      padding: "8px 0",
                      borderRadius: "6px",
                      border: planetHouse === h ? `2px solid ${GOLD}` : "1px solid rgba(156,122,47,0.15)",
                      background: planetHouse === h ? "rgba(156,122,47,0.08)" : (isKendra ? "rgba(156,122,47,0.03)" : "#ffffff"),
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      color: planetHouse === h ? GOLD_DEEP : INK_SECONDARY,
                      textAlign: "center"
                    }}
                  >
                    H{h} {isKendra && "⭐"}
                  </button>
                );
              })}
            </div>
            <span style={{ fontSize: "10.5px", color: INK_MUTED, marginTop: "4px", display: "inline-block" }}>
              ⭐ denotes Kendras (1st, 4th, 7th, 10th houses).
            </span>
          </div>
        </div>

        {/* Condition Checkboxes */}
        <div style={{
          display: "flex",
          gap: "12px",
          background: "rgba(255, 255, 255, 0.4)",
          border: "1px solid rgba(156, 122, 47, 0.1)",
          borderRadius: "12px",
          padding: "12px 16px"
        }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isCombust}
              onChange={(e) => setIsCombust(e.target.checked)}
              style={{ accentColor: GOLD }}
            />
            Combust (spoils dignity)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={isAfflicted}
              onChange={(e) => setIsAfflicted(e.target.checked)}
              style={{ accentColor: GOLD }}
            />
            Heavily Afflicted (mars yoga)
          </label>
        </div>

        {/* Verdict Box */}
        <div style={{
          background: yogaResult.status === "ACTIVE"
            ? "linear-gradient(to bottom right, rgba(156, 122, 47, 0.12), rgba(156, 122, 47, 0.03))"
            : yogaResult.status === "MARRED"
              ? "linear-gradient(to bottom right, rgba(234, 88, 12, 0.12), rgba(234, 88, 12, 0.03))"
              : "rgba(255, 255, 255, 0.4)",
          border: yogaResult.status === "ACTIVE"
            ? `1.5px solid ${GOLD}`
            : yogaResult.status === "MARRED"
              ? "1.5px solid #ea580c"
              : "1px solid rgba(156, 122, 47, 0.15)",
          borderRadius: "14px",
          padding: "20px",
          boxShadow: "0 4px 16px rgba(72,48,16,0.02)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            {yogaResult.status === "ACTIVE" ? (
              <CheckCircle size={20} color={GOLD_DEEP} />
            ) : yogaResult.status === "MARRED" ? (
              <AlertCircle size={20} color="#ea580c" />
            ) : (
              <Info size={20} color={INK_MUTED} />
            )}
            <h4 style={{
              fontSize: "16px",
              fontWeight: 800,
              margin: 0,
              color: yogaResult.status === "ACTIVE" ? GOLD_DEEP : yogaResult.status === "MARRED" ? "#ea580c" : INK_PRIMARY
            }}>
              {yogaResult.title}
            </h4>
          </div>

          <p style={{ fontSize: "13.5px", lineHeight: "1.5", margin: "0 0 16px 0", color: INK_SECONDARY }}>
            {yogaResult.reason}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid rgba(156,122,47,0.1)", paddingTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: INK_MUTED, fontWeight: 500 }}>Current Sign:</span>
              <span style={{ fontWeight: 700 }}>{planetSignName} (Sign {planetSign})</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: INK_MUTED, fontWeight: 500 }}>Dignity:</span>
              <span style={{ fontWeight: 700, color: dignityResult.isDignified ? GOLD_DEEP : INK_SECONDARY }}>{dignityResult.label}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
              <span style={{ color: INK_MUTED, fontWeight: 500 }}>House Location:</span>
              <span style={{ fontWeight: 700 }}>House {planetHouse} ({[1, 4, 7, 10].includes(planetHouse) ? "Kendra" : "Non-Kendra"})</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
