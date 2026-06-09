"use client";

import React, { useState, useMemo } from "react";
import { Info, RotateCcw, CheckCircle2, XCircle, ShieldAlert, Sparkles, Sliders } from "lucide-react";
import { RASHIS, polarToCartesian } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface YogaPreset {
  name: string;
  description: string;
  sav: number[];
}

const PRESETS: YogaPreset[] = [
  {
    name: "Standard Chart (Balanced Yogas)",
    description: "Moderate SAV distribution across houses, where some yogas are well-funded and others are underfunded.",
    sav: [32, 28, 30, 25, 35, 22, 26, 24, 31, 28, 30, 26] // Lesson 4 values
  },
  {
    name: "Afflicted Houses (Low-SAV Yogas)",
    description: "Starved SAV distribution, highlighting how promised yogas are underfunded and struggle to manifest.",
    sav: [18, 19, 21, 22, 20, 17, 18, 22, 21, 18, 20, 19]
  },
  {
    name: "Dignified Houses (High-SAV Yogas)",
    description: "Highly energized houses, funding all yogas to manifest their maximum potential.",
    sav: [36, 32, 33, 34, 35, 31, 32, 30, 32, 34, 33, 31]
  }
];

interface Yoga {
  name: string;
  sanskrit: string;
  houses: number[]; // 1-indexed houses (1-12)
  signs: number[];  // 0-indexed indices into RASHIS
  promise: string;
  interpretation: string;
}

const YOGAS_LIST: Yoga[] = [
  {
    name: "Gaja-Kesari Yoga",
    sanskrit: "गजकेसरी योग",
    houses: [1, 4, 7, 10], // Forms in Kendras from Lagna
    signs: [0, 3, 6, 9],   // Aries, Cancer, Libra, Capricorn (with Aries Lagna)
    promise: "Brings royal status, intelligence, wisdom, wealth, and lasting fame.",
    interpretation: "Jupiter and Moon sit in kendras. If the houses have high SAV, the native manifests high intellect and institutional leadership. If SAV is starved, the promise remains a conceptual interest in wisdom without active institutional authority."
  },
  {
    name: "Ruchaka Yoga",
    sanskrit: "रुचक योग",
    houses: [1, 8],
    signs: [0, 7],         // Aries and Scorpio (Mars owned)
    promise: "Pañcamahāpuruṣa yoga giving exceptional courage, leadership, physical strength, and military command.",
    interpretation: "Mars in own sign. High SAV manifests as actual leadership, strategic victories, and physical vitality. Low SAV manifests as inner ambition and fiery tendencies, but with limited material success or recognition."
  },
  {
    name: "Budhāditya Yoga",
    sanskrit: "बुधादित्य योग",
    houses: [1, 5, 9],     // Dharma-houses
    signs: [0, 4, 8],      // Aries, Leo, Sagittarius
    promise: "Fuses intelligence (Mercury) and soul radiance (Sun) to produce scholarly skill, fame, and sharp analytical ability.",
    interpretation: "Forms in trines. High SAV channels this conjunction into recognized academic success and administrative sharpness. Low SAV leads to overthinking or analysis paralysis without manifest real-world results."
  },
  {
    name: "Dharma-Karmādhipati Yoga",
    sanskrit: "धर्मकर्माधिपति योग",
    houses: [9, 10],       // 9th (Dharma) and 10th (Karma)
    signs: [8, 9],         // Sagittarius and Capricorn (Aries Lagna)
    promise: "The highest rāja-yoga of purpose, linking moral duty (9th) with professional action (10th) to bring status, power, and ethical destiny.",
    interpretation: "High SAV funding in these houses secures key career breakthroughs and administrative authority. Low SAV causes career shifts or a sense of unfulfilled professional destiny despite qualifications."
  }
];

export function YogaSavAuditor() {
  const [sav, setSav] = useState<number[]>(PRESETS[0].sav);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [selectedYogaIndex, setSelectedYogaIndex] = useState<number>(0);

  const activePreset = PRESETS[selectedPresetIndex];
  const activeYoga = YOGAS_LIST[selectedYogaIndex];

  const handlePresetSelect = (presetIndex: number) => {
    setSelectedPresetIndex(presetIndex);
    setSav(PRESETS[presetIndex].sav);
  };

  const resetValues = () => {
    handlePresetSelect(0);
    setSelectedYogaIndex(0);
  };

  const handleSavChange = (index: number, delta: number) => {
    setSav(prev => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(99, next[index] + delta));
      return next;
    });
  };

  // Calculate funding statistics for the active yoga
  const fundingStats = useMemo(() => {
    const values = activeYoga.signs.map(idx => sav[idx]);
    const avgSav = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
    const minSav = Math.min(...values);
    const maxSav = Math.max(...values);

    let grade: "Strong" | "Moderate" | "Weak";
    let color: string;
    let icon: React.ReactNode;
    let summary: string;

    if (avgSav >= 28) {
      grade = "Strong";
      color = "#16a34a"; // Green
      icon = <CheckCircle2 size={16} style={{ color }} />;
      summary = `Well-Funded (Grade A): The yoga's average house support is ${avgSav} bindus. The environment has ample operational strength to manifest the promise fully.`;
    } else if (avgSav >= 23) {
      grade = "Moderate";
      color = GOLD_DEEP;
      icon = <Sparkles size={16} style={{ color }} />;
      summary = `Moderately Funded (Grade B): The average support of ${avgSav} bindus is adequate. The yoga manifests during favourable transit peaks but may face minor delays.`;
    } else {
      grade = "Weak";
      color = "#ef4444"; // Red
      icon = <ShieldAlert size={16} style={{ color }} />;
      summary = `Underfunded / Starved (Grade C): The average support is only ${avgSav} bindus. The yoga lacks the material funding to deliver; results remain largely potential.`;
    }

    return { avgSav, minSav, maxSav, grade, color, icon, summary };
  }, [sav, activeYoga]);

  const circlePoints = useMemo(() => {
    const points = [];
    const cx = 200, cy = 200, r = 126;
    for (let i = 0; i < 12; i++) {
      const angleDeg = i * 30 - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      points.push({ x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad), angleDeg, rashiIndex: i });
    }
    return points;
  }, []);

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", borderBottom: "1px solid rgba(156,122,47,0.1)", paddingBottom: "10px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Yoga-SAV Auditor Component
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Grade a qualitative yoga promise against the quantitative funding of its house-SAV counts.
          </p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP }}>Chart Preset:</span>
          <select
            value={selectedPresetIndex}
            onChange={(e) => handlePresetSelect(Number(e.target.value))}
            style={{
              padding: "6px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(156,122,47,0.2)",
              fontSize: "11px",
              background: "#ffffff",
              color: INK_PRIMARY,
              cursor: "pointer"
            }}
          >
            {PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={resetValues}
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", border: "1px solid rgba(156,122,47,0.15)", borderRadius: "8px", background: "transparent", color: INK_SECONDARY, fontSize: "11px", fontWeight: 750, cursor: "pointer" }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        </div>
      </div>

      {/* SPLIT VIEW */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        
        {/* Left Column: Interactive SVG SAV Wheel */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", alignItems: "center", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
                Sarvāṣṭakavarga (SAV) Wheel
              </h4>
              <span style={{ fontSize: "10px", color: INK_MUTED, fontWeight: 700, display: "flex", alignItems: "center", gap: "3px", whiteSpace: "nowrap" }}>
                <Sliders size={11} /> Click to scrub
              </span>
            </div>
            <div style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
              Left-click to +1, Shift-click/Right-click to -1
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", maxWidth: "320px", aspectRatio: "1 / 1" }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400">
              <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="2" />
              <circle cx="200" cy="200" r="70" fill="none" stroke="rgba(156,122,47,0.1)" strokeWidth="1" />
              
              {/* Sector Division Lines */}
              {RASHIS.map((_, i) => {
                const angleDeg = i * 30 - 105;
                const angleRad = (angleDeg * Math.PI) / 180;
                const lx1 = 200 + 70 * Math.cos(angleRad);
                const ly1 = 200 + 70 * Math.sin(angleRad);
                const lx2 = 200 + 188 * Math.cos(angleRad);
                const ly2 = 200 + 188 * Math.sin(angleRad);
                return <line key={`line-${i}`} x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="rgba(156,122,47,0.08)" strokeWidth="1.2" />;
              })}

              {/* Wedge highlights for active yoga signs */}
              {RASHIS.map((r, i) => {
                const num = r.number;
                const isYogaSign = activeYoga.signs.includes(i);
                
                let fill = "rgba(255,255,255,0.02)";
                let stroke = "none";

                if (isYogaSign) {
                  fill = "color-mix(in srgb, var(--gl-gold-accent, #9C7A2F) 12%, transparent)";
                  stroke = GOLD;
                }

                const startAngle = i * 30 - 105;
                const endAngle = i * 30 - 75;
                const so = { x: 200 + 188 * Math.cos((startAngle * Math.PI) / 180), y: 200 + 188 * Math.sin((startAngle * Math.PI) / 180) };
                const eo = { x: 200 + 188 * Math.cos((endAngle * Math.PI) / 180), y: 200 + 188 * Math.sin((endAngle * Math.PI) / 180) };
                const si = { x: 200 + 70 * Math.cos((startAngle * Math.PI) / 180), y: 200 + 70 * Math.sin((startAngle * Math.PI) / 180) };
                const ei = { x: 200 + 70 * Math.cos((endAngle * Math.PI) / 180), y: 200 + 70 * Math.sin((endAngle * Math.PI) / 180) };
                
                const pathData = [
                  `M ${si.x} ${si.y}`,
                  `L ${so.x} ${so.y}`,
                  `A 188 188 0 0 1 ${eo.x} ${eo.y}`,
                  `L ${ei.x} ${ei.y}`,
                  `A 70 70 0 0 0 ${si.x} ${si.y}`,
                  "Z"
                ].join(" ");

                return (
                  <path
                    key={`ypath-${num}`}
                    d={pathData}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isYogaSign ? "2" : "0.5"}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSavChange(i, e.shiftKey ? -1 : 1);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleSavChange(i, -1);
                    }}
                  >
                    <title>Wedge {r.nameEnglish}: Left-click to +1, Shift-click or Right-click to -1 SAV</title>
                  </path>
                );
              })}

              {/* Labels and values */}
              {circlePoints.map(p => {
                const r = RASHIS[p.rashiIndex];
                const angleDeg = p.angleDeg;
                const angleRad = (angleDeg * Math.PI) / 180;
                const ptEng = { x: 200 + 166 * Math.cos(angleRad), y: 200 + 166 * Math.sin(angleRad) };
                const ptValue = { x: 200 + 106 * Math.cos(angleRad), y: 200 + 106 * Math.sin(angleRad) };

                const rawVal = sav[p.rashiIndex];
                const isYogaSign = activeYoga.signs.includes(p.rashiIndex);
                const shortSign = r.nameEnglish.slice(0, 3);

                return (
                  <g key={`ylabel-${p.rashiIndex}`}>
                    <text
                      x={ptEng.x}
                      y={ptEng.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize: "10px", fontWeight: 800, fill: INK_PRIMARY, cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSavChange(p.rashiIndex, e.shiftKey ? -1 : 1);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleSavChange(p.rashiIndex, -1);
                      }}
                    >
                      <title>{r.nameEnglish}: Left-click to +1, Shift-click or Right-click to -1 SAV</title>
                      {shortSign}
                    </text>
                    
                    <g
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSavChange(p.rashiIndex, e.shiftKey ? -1 : 1);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        handleSavChange(p.rashiIndex, -1);
                      }}
                    >
                      <title>{r.nameEnglish} Value: Left-click to +1, Shift-click or Right-click to -1 SAV</title>
                      <circle
                        cx={ptValue.x}
                        cy={ptValue.y}
                        r="18"
                        fill="#ffffff"
                        stroke={isYogaSign ? GOLD : "rgba(0,0,0,0.1)"}
                        strokeWidth={isYogaSign ? "2.5" : "1.5"}
                      />
                      <text
                        x={ptValue.x}
                        y={ptValue.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontSize: "11px", fontWeight: 900, fill: isYogaSign ? GOLD_DEEP : INK_SECONDARY }}
                      >
                        {rawVal}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Central Circle */}
              <circle cx="200" cy="200" r="40" fill="#ffffff" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <text x="200" y="195" textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 800, fill: INK_MUTED }}>YOGA SAV</text>
              <text x="200" y="206" textAnchor="middle" style={{ fontSize: "9.5px", fontWeight: 900, fill: GOLD_DEEP }}>AUDITOR</text>
              <text x="200" y="215" textAnchor="middle" style={{ fontSize: "6.5px", fontWeight: 800, fill: INK_MUTED }}>ENGINE</text>
            </svg>
          </div>
        </div>

        {/* Right Column: Yoga List and Audit Feedback */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          
          {/* Yoga Selection List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Select a Yoga to Audit
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {YOGAS_LIST.map((yoga, idx) => {
                const isSelected = selectedYogaIndex === idx;
                return (
                  <div
                    key={yoga.name}
                    onClick={() => setSelectedYogaIndex(idx)}
                    style={{
                      background: isSelected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                      border: isSelected ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.05)",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "all 0.15s"
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: isSelected ? GOLD_DEEP : INK_PRIMARY }}>
                        {yoga.name}
                      </div>
                      <div style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>
                        {yoga.sanskrit} (Aries Lagna)
                      </div>
                    </div>
                    <span style={{ fontSize: "9.5px", color: GOLD, fontWeight: 750 }}>
                      Signs: {yoga.signs.map(i => RASHIS[i].nameEnglish.slice(0,3)).join("/")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Yoga Promise Panel */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP }}>
              Qualitative Promise
            </span>
            <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
              {activeYoga.promise}
            </p>
          </div>

          {/* House SAV controls */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED }}>
              Tweak Involved Houses' SAV
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {activeYoga.signs.map((rIdx, i) => {
                const r = RASHIS[rIdx];
                return (
                  <div key={r.number} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.02)", padding: "4px 8px", borderRadius: "6px" }}>
                    <span style={{ fontSize: "10.5px", fontWeight: 750, color: INK_SECONDARY }}>
                      House {activeYoga.houses[i]} ({r.nameEnglish})
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <button
                        onClick={() => handleSavChange(rIdx, -1)}
                        style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "10px", cursor: "pointer" }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: "11px", fontWeight: 900, minWidth: "16px", textAlign: "center" }}>
                        {sav[rIdx]}
                      </span>
                      <button
                        onClick={() => handleSavChange(rIdx, 1)}
                        style={{ width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "4px", background: "#ffffff", fontSize: "10px", cursor: "pointer" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* DYNAMIC AUDIT RESULTS */}
      <div style={{ background: SURFACE_MANUSCRIPT, border: `1.5px solid ${fundingStats.color}`, borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {fundingStats.icon}
          <span style={{ fontSize: "13px", fontWeight: 850, color: fundingStats.color }}>
            SAV Audit Result: {fundingStats.grade}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: "11.5px", lineHeight: "1.45", color: INK_PRIMARY }}>
          <strong>{fundingStats.summary}</strong>
        </p>
        <div style={{ borderTop: "1px dashed rgba(156,122,47,0.2)", paddingTop: "6px", marginTop: "2px" }}>
          <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: GOLD_DEEP, display: "block", marginBottom: "2px" }}>
            Senior Astrologer & UI/UX Synthesis
          </span>
          <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: INK_SECONDARY }}>
            {activeYoga.interpretation}
          </p>
        </div>
      </div>
    </div>
  );
}
