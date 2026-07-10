"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, Square, Award, Volume2, HelpCircle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface GrahaYantraData {
  id: string;
  name: string;
  devanagari: string;
  iast: string;
  constant: number;
  offset: number; // Starting number P
  grid: number[][]; // 3x3 grid
  bija: string;
  bijaDevanagari: string;
  theme: string;
  color: string;
  bgLight: string;
}

const GRAHA_YANTRAS: GrahaYantraData[] = [
  {
    id: "surya",
    name: "Sūrya (Sun)",
    devanagari: "सूर्य यन्त्र",
    iast: "Sūrya",
    constant: 15,
    offset: 1,
    grid: [
      [6, 1, 8],
      [7, 5, 3],
      [2, 9, 4]
    ],
    bija: "Oṁ Hrāṁ Hrīṁ Hrauṁ Saḥ Sūryāya Namaḥ",
    bijaDevanagari: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    theme: "Vitality, leadership, identity alignment, and soul-force reinforcement.",
    color: "#ca8a04",
    bgLight: "rgba(202, 138, 4, 0.05)"
  },
  {
    id: "chandra",
    name: "Candra (Moon)",
    devanagari: "चन्द्र यन्त्र",
    iast: "Candra",
    constant: 18,
    offset: 2,
    grid: [
      [7, 2, 9],
      [8, 6, 4],
      [3, 10, 5]
    ],
    bija: "Oṁ Śrāṁ Śrīṁ Śrauṁ Saḥ Candrāya Namaḥ",
    bijaDevanagari: "ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः",
    theme: "Emotional harmony, mental peace, nurturing capacity, and mind calibration.",
    color: "#475569",
    bgLight: "rgba(71, 85, 105, 0.05)"
  },
  {
    id: "mangala",
    name: "Maṅgala (Mars)",
    devanagari: "मङ्गल यन्त्र",
    iast: "Maṅgala",
    constant: 21,
    offset: 3,
    grid: [
      [8, 3, 10],
      [9, 7, 5],
      [4, 11, 6]
    ],
    bija: "Oṁ Krāṁ Krīṁ Krauṁ Saḥ Bhaumāya Namaḥ",
    bijaDevanagari: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    theme: "Courage, kinetic energy, logical drive, and friction mitigation.",
    color: "#dc2626",
    bgLight: "rgba(220, 38, 38, 0.05)"
  },
  {
    id: "budha",
    name: "Budha (Mercury)",
    devanagari: "बुध यन्त्र",
    iast: "Budha",
    constant: 24,
    offset: 4,
    grid: [
      [9, 4, 11],
      [10, 8, 6],
      [5, 12, 7]
    ],
    bija: "Oṁ Brāṁ Brīṁ Brauṁ Saḥ Budhāya Namaḥ",
    bijaDevanagari: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    theme: "Cognitive intellect, discrimination, speech articulation, and commercial trade.",
    color: "#059669",
    bgLight: "rgba(5, 150, 105, 0.05)"
  },
  {
    id: "guru",
    name: "Guru (Jupiter)",
    devanagari: "गुरु यन्त्र",
    iast: "Guru",
    constant: 27,
    offset: 5,
    grid: [
      [10, 5, 12],
      [11, 9, 7],
      [6, 13, 8]
    ],
    bija: "Oṁ Grāṁ Grīṁ Grauṁ Saḥ Gurave Namaḥ",
    bijaDevanagari: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    theme: "Wisdom, expansion, higher knowledge, spiritual grace, and ethical values.",
    color: "#d97706",
    bgLight: "rgba(217, 119, 6, 0.05)"
  },
  {
    id: "shukra",
    name: "Śukra (Venus)",
    devanagari: "शुक्र यन्त्र",
    iast: "Śukra",
    constant: 30,
    offset: 6,
    grid: [
      [11, 6, 13],
      [12, 10, 8],
      [7, 14, 9]
    ],
    bija: "Oṁ Drāṁ Drīṁ Drauṁ Saḥ Śukrāya Namaḥ",
    bijaDevanagari: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    theme: "Devotion, aesthetic beauty, relationship synthesis, and refined vitality.",
    color: "#db2777",
    bgLight: "rgba(219, 39, 119, 0.05)"
  },
  {
    id: "shani",
    name: "Śani (Saturn)",
    devanagari: "शनि यन्त्र",
    iast: "Śani",
    constant: 33,
    offset: 7,
    grid: [
      [12, 7, 14],
      [13, 11, 9],
      [8, 15, 10]
    ],
    bija: "Oṁ Prāṁ Prīṁ Prauṁ Saḥ Śanaye Namaḥ",
    bijaDevanagari: "ॐ प्रां प्रीं प्रौं सः शनये नमः",
    theme: "Discipline, structural duty, patience, endurance, and delay management.",
    color: "#4f46e5",
    bgLight: "rgba(79, 70, 229, 0.05)"
  },
  {
    id: "rahu",
    name: "Rāhu (North Node)",
    devanagari: "राहु यन्त्र",
    iast: "Rāhu",
    constant: 36,
    offset: 8,
    grid: [
      [13, 8, 15],
      [14, 12, 10],
      [9, 16, 11]
    ],
    bija: "Oṁ Bhrāṁ Bhrīṁ Bhrauṁ Saḥ Rāhave Namaḥ",
    bijaDevanagari: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    theme: "Ambition modulation, projection parsing, and exotic/sudden disruption buffers.",
    color: "#4b5563",
    bgLight: "rgba(75, 85, 99, 0.05)"
  },
  {
    id: "ketu",
    name: "Ketu (South Node)",
    devanagari: "केतु यन्त्र",
    iast: "Ketu",
    constant: 39,
    offset: 9,
    grid: [
      [14, 9, 16],
      [15, 13, 11],
      [10, 17, 12]
    ],
    bija: "Oṁ Srāṁ Srīṁ Srauṁ Saḥ Ketave Namaḥ",
    bijaDevanagari: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    theme: "Spiritual liberation, non-attachment cultivation, and sudden insight triggers.",
    color: "#78350f",
    bgLight: "rgba(120, 53, 15, 0.05)"
  }
];

type TargetLine = "none" | "row0" | "row1" | "row2" | "col0" | "col1" | "col2" | "diag0" | "diag1";

export function GrahaYantraGallery() {
  const [selectedId, setSelectedId] = useState<string>("surya");
  const [activeLine, setActiveLine] = useState<TargetLine>("none");
  const [isChanting, setIsChanting] = useState<boolean>(false);
  const [isConsecrated, setIsConsecrated] = useState<boolean>(false);
  const [chantTimer, setChantTimer] = useState<NodeJS.Timeout | null>(null);

  const activeYantra = GRAHA_YANTRAS.find(y => y.id === selectedId) || GRAHA_YANTRAS[0];

  useEffect(() => {
    // Reset states when planet changes
    setActiveLine("none");
    setIsChanting(false);
    if (chantTimer) {
      clearTimeout(chantTimer);
    }
  }, [selectedId]);

  const toggleChant = () => {
    if (isChanting) {
      setIsChanting(false);
      if (chantTimer) clearTimeout(chantTimer);
    } else {
      setIsChanting(true);
      const timer = setTimeout(() => {
        setIsChanting(false);
      }, 6000);
      setChantTimer(timer);
    }
  };

  // Check if cell is highlighted based on the active line
  const isCellHighlighted = (row: number, col: number) => {
    switch (activeLine) {
      case "row0": return row === 0;
      case "row1": return row === 1;
      case "row2": return row === 2;
      case "col0": return col === 0;
      case "col1": return col === 1;
      case "col2": return col === 2;
      case "diag0": return row === col;
      case "diag1": return row + col === 2;
      default: return false;
    }
  };

  const getLineMathText = () => {
    let indices: [number, number][] = [];
    switch (activeLine) {
      case "row0": indices = [[0,0], [0,1], [0,2]]; break;
      case "row1": indices = [[1,0], [1,1], [1,2]]; break;
      case "row2": indices = [[2,0], [2,1], [2,2]]; break;
      case "col0": indices = [[0,0], [1,0], [2,0]]; break;
      case "col1": indices = [[0,1], [1,1], [2,1]]; break;
      case "col2": indices = [[0,2], [1,2], [2,2]]; break;
      case "diag0": indices = [[0,0], [1,1], [2,2]]; break;
      case "diag1": indices = [[0,2], [1,1], [2,0]]; break;
      default: return "";
    }
    const vals = indices.map(([r, c]) => activeYantra.grid[r][c]);
    return `${vals[0]} + ${vals[1]} + ${vals[2]} = ${activeYantra.constant}`;
  };

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "14px"
    }}>
      <style>{`
        .planet-btn {
          border: 1px solid rgba(156, 122, 47, 0.12);
          background: rgba(255, 255, 255, 0.45);
          transition: all 0.2s ease-in-out;
        }
        .planet-btn:hover {
          border-color: ${GOLD};
          background: rgba(251, 248, 243, 0.7);
        }
        .yantra-cell {
          transition: all 0.2s ease;
          border: 1.5px solid rgba(156, 122, 47, 0.25);
        }
        .yantra-cell.highlighted {
          background: ${activeYantra.bgLight} !important;
          border-color: ${activeYantra.color} !important;
          box-shadow: 0 0 6px ${activeYantra.color}25;
          transform: scale(1.02);
        }
        .math-trigger {
          border: 1px solid rgba(156, 122, 47, 0.1);
          background: rgba(255, 255, 255, 0.3);
          transition: all 0.15s ease-in-out;
        }
        .math-trigger:hover, .math-trigger.active {
          border-color: ${activeYantra.color};
          background: ${activeYantra.bgLight};
          color: ${activeYantra.color};
        }
        @keyframes soundWave {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
        .sound-bar {
          animation: soundWave 0.8s ease-in-out infinite;
          background-color: ${activeYantra.color};
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        borderBottom: "1px solid rgba(156,122,47,0.1)",
        paddingBottom: "10px"
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Nine Graha Yantra Gallery
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Explore the geometric magic-square numbers and tantric bīja sounds of the planetary remedies.
          </p>
        </div>
      </div>

      {/* PLANET TABS GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))",
        gap: "6px"
      }}>
        {GRAHA_YANTRAS.map((y) => {
          const isSelected = selectedId === y.id;
          return (
            <button
              key={y.id}
              onClick={() => setSelectedId(y.id)}
              className="planet-btn"
              style={{
                padding: "8px 6px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: isSelected ? 800 : 500,
                cursor: "pointer",
                border: isSelected ? `2px solid ${y.color}` : undefined,
                background: isSelected ? "#ffffff" : undefined,
                color: isSelected ? y.color : INK_PRIMARY,
                textAlign: "center"
              }}
            >
              <div>{y.name.split(" ")[0]}</div>
              <div style={{ fontSize: "8.5px", opacity: 0.6, marginTop: "2px" }}>
                Σ = {y.constant}
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* LEFT COLUMN: Magic Square Grid */}
        <div style={{
          flex: "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px"
        }}>
          <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
            Planetary Metal Plate (Tāmra-Patra)
          </span>

          <div style={{
            position: "relative",
            width: "200px",
            height: "200px",
            background: "rgba(251,248,243,0.9)",
            border: `3px solid ${activeYantra.color}`,
            borderRadius: "14px",
            display: "grid",
            gridTemplateRows: "repeat(3, 1fr)",
            gridTemplateColumns: "repeat(3, 1fr)",
            padding: "8px",
            boxShadow: `0 4px 16px ${activeYantra.color}15`
          }}>
            {activeYantra.grid.map((row, rIdx) => 
              row.map((val, cIdx) => {
                const highlighted = isCellHighlighted(rIdx, cIdx);
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`yantra-cell ${highlighted ? "highlighted" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: highlighted ? activeYantra.color : INK_PRIMARY,
                      background: "rgba(255, 255, 255, 0.4)",
                      margin: "4px",
                      borderRadius: "6px"
                    }}
                  >
                    {val}
                  </div>
                );
              })
            )}
          </div>

          {/* Magic Square Formula Decoder */}
          <div style={{
            background: SURFACE_MANUSCRIPT,
            border: `1.5px solid rgba(156, 122, 47, 0.15)`,
            borderRadius: "10px",
            padding: "10px",
            width: "100%",
            fontSize: "11px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            boxSizing: "border-box"
          }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
              Grid Formula Decoder
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", color: INK_SECONDARY }}>
              <div>Offset (<span style={{ fontWeight: 800, color: activeYantra.color }}>P</span>) = {activeYantra.offset}</div>
              <div>Center Cell (<span style={{ fontWeight: 800, color: activeYantra.color }}>P + 4</span>) = {activeYantra.offset} + 4 = {activeYantra.offset + 4}</div>
              <div style={{ fontWeight: 750, color: INK_PRIMARY }}>
                Constant Sum (<span style={{ color: activeYantra.color }}>3 &times; Center</span>) = 3 &times; {activeYantra.offset + 4} = {activeYantra.constant}
              </div>
            </div>
          </div>

          {/* Math Trigger List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Inspect Grid Sum (Constant: {activeYantra.constant})
            </span>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
              {["row0", "row1", "row2", "col0", "col1", "col2", "diag0", "diag1"].map((line) => {
                const isActive = activeLine === line;
                let label = "";
                if (line.startsWith("row")) label = `Row ${Number(line[3]) + 1}`;
                else if (line.startsWith("col")) label = `Col ${Number(line[3]) + 1}`;
                else if (line === "diag0") label = "Diag \u2198";
                else if (line === "diag1") label = "Diag \u2197";

                return (
                  <button
                    key={line}
                    onClick={() => setActiveLine(isActive ? "none" : line as TargetLine)}
                    className={`math-trigger ${isActive ? "active" : ""}`}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Sum check block */}
            {activeLine !== "none" && (
              <div style={{
                background: "rgba(22, 163, 74, 0.05)",
                border: "1px solid rgba(22, 163, 74, 0.2)",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "11px",
                fontWeight: 750,
                color: "#16a34a",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{getLineMathText()}</span>
                <span>Verified Constant \u2714</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Details & Mantras */}
        <div style={{
          flex: "1 1 360px",
          background: SURFACE_MANUSCRIPT,
          border: `1.5px solid ${activeYantra.color}40`,
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          
          {/* Header */}
          <div style={{ borderBottom: "1px dashed rgba(156,122,47,0.15)", paddingBottom: "6px" }}>
            <span style={{ fontSize: "16px", fontWeight: 800, color: activeYantra.color }}>
              {activeYantra.name}
            </span>
            <div style={{ fontSize: "9px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 750, marginTop: "2px" }}>
              Magic Square Constant: {activeYantra.constant} | Numeric offset P: {activeYantra.offset}
            </div>
          </div>

          {/* Theme description */}
          <div>
            <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
              Remedial Theme
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
              {activeYantra.theme}
            </p>
          </div>

          {/* Bija Card */}
          <div style={{
            background: "rgba(255, 255, 255, 0.55)",
            border: `1px solid rgba(156, 122, 47, 0.15)`,
            borderRadius: "10px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}>
            <div>
              <span style={{ fontSize: "9px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
                Sonic Bīja-Mantra
              </span>
              <div style={{
                fontSize: "14px",
                fontWeight: 900,
                color: activeYantra.color,
                fontFamily: "'Noto Serif Devanagari', serif",
                marginTop: "2px"
              }}>
                {activeYantra.bijaDevanagari}
              </div>
              <div style={{ fontSize: "10.5px", fontWeight: 700, color: INK_PRIMARY, marginTop: "2px" }}>
                {activeYantra.bija}
              </div>
            </div>

            {/* Listen button & wave visual */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={toggleChant}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  background: activeYantra.color,
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "10.5px",
                  fontWeight: 750,
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)"
                }}
              >
                {isChanting ? <Volume2 size={12} /> : <Play size={12} />}
                {isChanting ? "Chanting..." : "Listen to Vibration"}
              </button>

              {isChanting && (
                <div style={{ display: "flex", alignItems: "center", gap: "2.5px" }}>
                  <div className="sound-bar" style={{ width: "3px", animationDelay: "0.1s" }} />
                  <div className="sound-bar" style={{ width: "3px", animationDelay: "0.3s" }} />
                  <div className="sound-bar" style={{ width: "3px", animationDelay: "0.2s" }} />
                  <div className="sound-bar" style={{ width: "3px", animationDelay: "0.5s" }} />
                  <div className="sound-bar" style={{ width: "3px", animationDelay: "0.4s" }} />
                  <div className="sound-bar" style={{ width: "3px", animationDelay: "0.7s" }} />
                </div>
              )}
            </div>
          </div>

          {/* Consecration Toggle Box */}
          <div style={{
            background: isConsecrated ? "rgba(78, 112, 55, 0.05)" : "rgba(156, 122, 47, 0.04)",
            border: isConsecrated ? "1px dashed #4e7037" : "1px dashed rgba(156,122,47,0.25)",
            padding: "10px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "9.5px", fontWeight: 800, color: isConsecrated ? "#4e7037" : GOLD_DEEP }}>
                Ritual Consecration (Prāṇa-Pratiṣṭhā)
              </span>
              <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", fontWeight: 750, cursor: "pointer", color: isConsecrated ? "#4e7037" : INK_SECONDARY }}>
                <input
                  type="checkbox"
                  checked={isConsecrated}
                  onChange={(e) => setIsConsecrated(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                Consecrated
              </label>
            </div>
            <p style={{ margin: 0, fontSize: "10px", color: isConsecrated ? "#4e7037" : INK_MUTED, lineHeight: "1.35" }}>
              {isConsecrated 
                ? "Active Instrument: The numbers are aligned, seed-sounds have been chanted, and prāṇa (life-force) is enlivened."
                : "Static Picture: Without ritual consecration, this remains a representation, not an active remedy."
              }
            </p>
          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 3)</span>
        <span>Magic-Square Explorer</span>
      </div>
    </div>
  );
}
