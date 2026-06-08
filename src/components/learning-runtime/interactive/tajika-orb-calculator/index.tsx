"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, CheckCircle2, AlertCircle, ArrowRightLeft } from "lucide-react";

export interface TajikaPlanet {
  id: string;
  name: string;
  sanskrit: string;
  devanagari: string;
  abbr: string;
  deepta: number;
  color: string;
  glyph: string;
  defaultLong: number;
}

export const TAJIKA_PLANETS: TajikaPlanet[] = [
  { id: "sun", name: "Sun", sanskrit: "Sūrya", devanagari: "सूर्य", abbr: "Su", deepta: 15, color: "#A8821E", glyph: "☉", defaultLong: 10 },
  { id: "moon", name: "Moon", sanskrit: "Candra", devanagari: "चन्द्र", abbr: "Mo", deepta: 12, color: "#4F6FA8", glyph: "☽", defaultLong: 130 },
  { id: "mars", name: "Mars", sanskrit: "Maṅgala", devanagari: "मङ्गल", abbr: "Ma", deepta: 8, color: "#A23A1E", glyph: "♂", defaultLong: 100 },
  { id: "mercury", name: "Mercury", sanskrit: "Budha", devanagari: "बुध", abbr: "Me", deepta: 7, color: "#3A8C5A", glyph: "☿", defaultLong: 17 },
  { id: "jupiter", name: "Jupiter", sanskrit: "Guru", devanagari: "गुरु", abbr: "Ju", deepta: 9, color: "#C28220", glyph: "♃", defaultLong: 130 },
  { id: "venus", name: "Venus", sanskrit: "Śukra", devanagari: "शुक्र", abbr: "Ve", deepta: 7, color: "#9D174D", glyph: "♀", defaultLong: 25 },
  { id: "saturn", name: "Saturn", sanskrit: "Śani", devanagari: "शनि", abbr: "Sa", deepta: 9, color: "#2C2C3E", glyph: "♄", defaultLong: 190 },
];

export interface TajikaAngle {
  angle: number;
  name: string;
  sanskrit: string;
  nature: string;
  isBenefic: boolean;
  description: string;
}

export const TAJIKA_ANGLES: TajikaAngle[] = [
  { angle: 0, name: "Conjunction", sanskrit: "Yuti", nature: "Neutral Union", isBenefic: true, description: "Direct union of planetary light within orb." },
  { angle: 60, name: "Sextile", sanskrit: "Pratyakṣa-Dṛṣṭi", nature: "Mild Benefic", isBenefic: true, description: "Friendly and supportive flow of planetary rays." },
  { angle: 90, name: "Square", sanskrit: "Kendra-Dṛṣṭi", nature: "Adverse / Tense", isBenefic: false, description: "Friction, challenges, and dynamic action required." },
  { angle: 120, name: "Trine", sanskrit: "Trikoṇa-Dṛṣṭi", nature: "Strong Benefic", isBenefic: true, description: "Harmonious flow, effortless coordination, and support." },
  { angle: 180, name: "Opposition", sanskrit: "Sammukha-Dṛṣṭi", nature: "Hostile", isBenefic: false, description: "Direct confrontation, intense pull, requiring balance." },
];

// Presets representing the lesson's worked examples + interesting configurations
export interface TajikaPreset {
  id: string;
  label: string;
  planetAId: string;
  planetBId: string;
  separation: number;
  description: string;
}

const PRESETS: TajikaPreset[] = [
  {
    id: "sun-jupiter",
    label: "Sun–Jupiter Trine Near-Miss",
    planetAId: "sun",
    planetBId: "jupiter",
    separation: 117,
    description: "Sun (15°) & Jupiter (9°) allowed orb is 12°. Separation 117° is within 12° of a 120° trine (gap of 3°)."
  },
  {
    id: "mercury-venus",
    label: "Mercury–Venus Sextile Miss",
    planetAId: "mercury",
    planetBId: "venus",
    separation: 69,
    description: "Mercury (7°) & Venus (7°) allowed orb is 7°. Separation 69° is outside 7° of a 60° sextile (gap of 9°)."
  },
  {
    id: "sun-mars",
    label: "Sun–Mars Conjunction Edge",
    planetAId: "sun",
    planetBId: "mars",
    separation: 11.5,
    description: "Sun (15°) & Mars (8°) allowed orb is 11.5°. Separation 11.5° hits the exact outer boundary of conjunction."
  },
  {
    id: "moon-saturn",
    label: "Moon–Saturn Square Aspect",
    planetAId: "moon",
    planetBId: "saturn",
    separation: 95,
    description: "Moon (12°) & Saturn (9°) allowed orb is 10.5°. Separation 95° is within 10.5° of a 90° square (gap of 5°)."
  }
];

export function TajikaOrbCalculator() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const [planetAId, setPlanetAId] = useState<string>("sun");
  const [planetBId, setPlanetBId] = useState<string>("jupiter");
  const [separation, setSeparation] = useState<number>(117);

  const [isDropdownAOpen, setIsDropdownAOpen] = useState(false);
  const [isDropdownBOpen, setIsDropdownBOpen] = useState(false);

  const dropdownARef = useRef<HTMLDivElement>(null);
  const dropdownBRef = useRef<HTMLDivElement>(null);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownARef.current && !dropdownARef.current.contains(event.target as Node)) {
        setIsDropdownAOpen(false);
      }
      if (dropdownBRef.current && !dropdownBRef.current.contains(event.target as Node)) {
        setIsDropdownBOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const planetA = useMemo(() => TAJIKA_PLANETS.find(p => p.id === planetAId) ?? TAJIKA_PLANETS[0], [planetAId]);
  const planetB = useMemo(() => TAJIKA_PLANETS.find(p => p.id === planetBId) ?? TAJIKA_PLANETS[4], [planetBId]);

  // Handle smart swapping to ensure two different planets and update separation based on default longitudes
  const handleSelectPlanetA = (id: string) => {
    let nextBId = planetBId;
    if (id === planetBId) {
      nextBId = planetAId;
      setPlanetBId(planetAId);
    }
    setPlanetAId(id);
    setIsDropdownAOpen(false);

    const pA = TAJIKA_PLANETS.find(p => p.id === id)!;
    const pB = TAJIKA_PLANETS.find(p => p.id === nextBId)!;
    const diff = Math.abs(pA.defaultLong - pB.defaultLong);
    const sep = diff > 180 ? 360 - diff : diff;
    setSeparation(sep);
  };

  const handleSelectPlanetB = (id: string) => {
    let nextAId = planetAId;
    if (id === planetAId) {
      nextAId = planetBId;
      setPlanetAId(planetBId);
    }
    setPlanetBId(id);
    setIsDropdownBOpen(false);

    const pA = TAJIKA_PLANETS.find(p => p.id === nextAId)!;
    const pB = TAJIKA_PLANETS.find(p => p.id === id)!;
    const diff = Math.abs(pA.defaultLong - pB.defaultLong);
    const sep = diff > 180 ? 360 - diff : diff;
    setSeparation(sep);
  };

  const allowedOrb = useMemo(() => {
    return (planetA.deepta + planetB.deepta) / 2;
  }, [planetA, planetB]);

  const nearestAngle = useMemo(() => {
    return TAJIKA_ANGLES.reduce((prev, curr) => 
      Math.abs(curr.angle - separation) < Math.abs(prev.angle - separation) ? curr : prev
    );
  }, [separation]);

  const gap = useMemo(() => {
    return Math.abs(separation - nearestAngle.angle);
  }, [separation, nearestAngle]);

  const aspectFormed = useMemo(() => {
    return gap <= allowedOrb;
  }, [gap, allowedOrb]);

  // Compute active preset dynamically (verdict-driven active tab state)
  const activePresetId = useMemo(() => {
    const matched = PRESETS.find(p => 
      p.planetAId === planetAId && 
      p.planetBId === planetBId && 
      Math.abs(p.separation - separation) < 0.01
    );
    return matched ? matched.id : null;
  }, [planetAId, planetBId, separation]);

  const loadPreset = (preset: TajikaPreset) => {
    setPlanetAId(preset.planetAId);
    setPlanetBId(preset.planetBId);
    setSeparation(preset.separation);
  };

  // SVG coordinate helpers for 180° gauge
  const cx = 160;
  const cy = 145;
  const rOut = 115;
  const rIn = 95;

  const getArcPath = (startDeg: number, endDeg: number) => {
    const s = Math.max(0, Math.min(180, startDeg));
    const e = Math.max(0, Math.min(180, endDeg));
    
    const thetaStart = Math.PI - (s * Math.PI / 180);
    const thetaEnd = Math.PI - (e * Math.PI / 180);
    
    const x1_out = cx + rOut * Math.cos(thetaStart);
    const y1_out = cy - rOut * Math.sin(thetaStart);
    const x2_out = cx + rOut * Math.cos(thetaEnd);
    const y2_out = cy - rOut * Math.sin(thetaEnd);
    
    const x1_in = cx + rIn * Math.cos(thetaStart);
    const y1_in = cy - rIn * Math.sin(thetaStart);
    const x2_in = cx + rIn * Math.cos(thetaEnd);
    const y2_in = cy - rIn * Math.sin(thetaEnd);
    
    return `M ${x1_out} ${y1_out} A ${rOut} ${rOut} 0 0 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${rIn} ${rIn} 0 0 0 ${x1_in} ${y1_in} Z`;
  };

  const needleAngleRad = Math.PI - (separation * Math.PI / 180);
  const xNeedle = cx + (rOut - 5) * Math.cos(needleAngleRad);
  const yNeedle = cy - (rOut - 5) * Math.sin(needleAngleRad);

  return (
    <div 
      className="gl-surface-twilight-glass" 
      style={{ 
        padding: "24px", 
        color: "var(--gl-ink-primary)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
      data-interactive="tajika-orb-calculator"
    >
      {/* Brand styles matching Chapters 1 & 2 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tajika-preset-btn {
          background: rgba(156, 122, 47, 0.04);
          border: 1px solid rgba(156, 122, 47, 0.18);
          color: var(--gl-ink-secondary);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 13px;
        }
        .tajika-preset-btn:hover {
          background: rgba(156, 122, 47, 0.08);
          border-color: rgba(156, 122, 47, 0.35);
        }
        .tajika-preset-btn.active {
          background: rgba(156, 122, 47, 0.12);
          border-color: var(--gl-gold-accent);
          box-shadow: 0 0 8px rgba(156, 122, 47, 0.15);
          color: var(--gl-ink-primary);
        }

        .tajika-dropdown-btn {
          background: rgba(255, 255, 255, 0.65);
          border: 1px solid var(--gl-gold-hairline);
          color: var(--gl-ink-primary);
          transition: all 0.2s ease;
        }
        .tajika-dropdown-btn:hover {
          border-color: var(--gl-gold-accent);
          background: rgba(255, 255, 255, 0.95);
        }

        .tajika-slider-input {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          background: rgba(156, 122, 47, 0.15);
          border-radius: 3px;
          outline: none;
        }
        .tajika-slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--gl-gold-accent);
          border: 2px solid var(--gl-gold-light);
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(62, 42, 31, 0.15);
          transition: transform 0.1s ease;
        }
        .tajika-slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        .tajika-slider-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: none;
          border-radius: 50%;
          background: var(--gl-gold-accent);
          border: 2px solid var(--gl-gold-light);
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(62, 42, 31, 0.15);
          transition: transform 0.1s ease;
        }
        .tajika-slider-input::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}} />

      {/* Header and Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--gl-gold-accent)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} style={{ color: "var(--gl-copper)" }} />
            Tājika Orb Calculator
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--gl-ink-muted)" }}>
            Perso-Arabic degree-precision aspect checker
          </p>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button 
            onClick={() => {
              setPlanetAId("sun");
              setPlanetBId("jupiter");
              setSeparation(120);
            }}
            title="Reset to default (Sun-Jupiter Conjunction)"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--gl-ink-muted)",
              padding: "4px"
            }}
            className="hover:text-[var(--gl-gold-accent)] transition-colors"
          >
            <ArrowRightLeft size={16} />
          </button>
        </div>
      </div>

      {/* Preset Worked Examples tabs */}
      <div style={{ marginBottom: "24px" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Lesson Worked Examples
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`tajika-preset-btn px-3 py-2 rounded-lg font-medium text-left ${activePresetId === preset.id ? "active" : ""}`}
            >
              <div style={{ fontWeight: 600, fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                <span>{preset.label.split(" ")[0]}</span>
                <span style={{ color: "var(--gl-gold-accent)" }}>{preset.separation}°</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--gl-ink-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {preset.label.split(" ").slice(1).join(" ")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        
        {/* Planet Selectors & Allowed Orb Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", alignItems: "stretch" }}>
          
          {/* Planet A selector */}
          <div ref={dropdownARef} style={{ position: "relative" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>
              Planet A
            </label>
            <button
              onClick={() => {
                setIsDropdownAOpen(!isDropdownAOpen);
                setIsDropdownBOpen(false);
              }}
              className="tajika-dropdown-btn w-full p-3 rounded-xl flex items-center justify-between text-left"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px", color: planetA.color, lineHeight: 1 }}>{planetA.glyph}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--gl-ink-primary)" }}>{planetA.name} <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>({planetA.sanskrit})</span></div>
                  <div style={{ fontSize: "11px", color: "var(--gl-copper)", fontWeight: 500 }}>Deeptāṁśa: {planetA.deepta}°</div>
                </div>
              </div>
              <span style={{ color: "var(--gl-gold-accent)", fontSize: "12px" }}>▼</span>
            </button>
            
            <AnimatePresence>
              {isDropdownAOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    background: "var(--gl-card-surface-solid, #FFF9F0)",
                    border: "1px solid var(--gl-gold-accent)",
                    borderRadius: "12px",
                    marginTop: "6px",
                    zIndex: 50,
                    boxShadow: "0 10px 25px rgba(62,42,31,0.15)",
                    maxHeight: "260px",
                    overflowY: "auto"
                  }}
                >
                  {TAJIKA_PLANETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPlanetA(p.id)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: p.id === planetAId ? "rgba(156, 122, 47, 0.08)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--gl-ink-primary)",
                        textAlign: "left"
                      }}
                      className="hover:bg-[#F5EDD8] transition-colors"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "20px", color: p.color }}>{p.glyph}</span>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{p.name} <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>({p.sanskrit})</span></span>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--gl-gold-accent)", fontWeight: 600 }}>{p.deepta}°</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Allowed Orb Output */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(156, 122, 47, 0.08), rgba(255, 255, 255, 0.35))", 
            border: "1px dashed var(--gl-gold-hairline)",
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px"
          }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", marginBottom: "4px", fontWeight: 600 }}>
              Mean Allowed Orb
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--gl-gold-accent)" }}>
              {allowedOrb}°
            </div>
            <div style={{ fontSize: "10px", color: "var(--gl-ink-muted)", textAlign: "center", marginTop: "2px" }}>
              ({planetA.deepta}° + {planetB.deepta}°) ÷ 2
            </div>
          </div>

          {/* Planet B selector */}
          <div ref={dropdownBRef} style={{ position: "relative" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>
              Planet B
            </label>
            <button
              onClick={() => {
                setIsDropdownBOpen(!isDropdownBOpen);
                setIsDropdownAOpen(false);
              }}
              className="tajika-dropdown-btn w-full p-3 rounded-xl flex items-center justify-between text-left"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px", color: planetB.color, lineHeight: 1 }}>{planetB.glyph}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--gl-ink-primary)" }}>{planetB.name} <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>({planetB.sanskrit})</span></div>
                  <div style={{ fontSize: "11px", color: "var(--gl-copper)", fontWeight: 500 }}>Deeptāṁśa: {planetB.deepta}°</div>
                </div>
              </div>
              <span style={{ color: "var(--gl-gold-accent)", fontSize: "12px" }}>▼</span>
            </button>
            
            <AnimatePresence>
              {isDropdownBOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    background: "var(--gl-card-surface-solid, #FFF9F0)",
                    border: "1px solid var(--gl-gold-accent)",
                    borderRadius: "12px",
                    marginTop: "6px",
                    zIndex: 50,
                    boxShadow: "0 10px 25px rgba(62,42,31,0.15)",
                    maxHeight: "260px",
                    overflowY: "auto"
                  }}
                >
                  {TAJIKA_PLANETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleSelectPlanetB(p.id)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: p.id === planetBId ? "rgba(156, 122, 47, 0.08)" : "transparent",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--gl-ink-primary)",
                        textAlign: "left"
                      }}
                      className="hover:bg-[#F5EDD8] transition-colors"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "20px", color: p.color }}>{p.glyph}</span>
                        <span style={{ fontSize: "13px", fontWeight: 600 }}>{p.name} <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>({p.sanskrit})</span></span>
                      </div>
                      <span style={{ fontSize: "12px", color: "var(--gl-gold-accent)", fontWeight: 600 }}>{p.deepta}°</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Central Display: SVG Semicircle Instrument Gauge & Slider */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.3)", 
          border: "1px solid var(--gl-gold-hairline)",
          borderRadius: "16px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          
          {/* SVG Arc Instrument */}
          <div style={{ width: "100%", maxWidth: "320px", position: "relative" }}>
            <svg 
              viewBox="0 0 320 190" 
              width="100%" 
              height="100%"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="activeGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3A8C5A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2D6B45" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Semicircular Track Background */}
              <path 
                d={getArcPath(0, 180)} 
                fill="rgba(156, 122, 47, 0.05)" 
                stroke="var(--gl-gold-hairline)" 
                strokeWidth="1"
              />

              {/* Tājika Aspect Allowed-Orb Windows (drawn as bands) */}
              {TAJIKA_ANGLES.map((t) => {
                const start = t.angle - allowedOrb;
                const end = t.angle + allowedOrb;
                const isActive = nearestAngle.angle === t.angle && aspectFormed;

                return (
                  <path
                    key={t.angle}
                    d={getArcPath(start, end)}
                    fill={isActive ? "url(#activeGreenGrad)" : "rgba(156, 122, 47, 0.08)"}
                    stroke={isActive ? "#3A8C5A" : "rgba(156, 122, 47, 0.22)"}
                    strokeWidth="1"
                    style={{ 
                      transition: "fill 0.3s ease, stroke 0.3s ease",
                    }}
                  />
                );
              })}

              {/* Tājika Aspect Angle Mark Ticks */}
              {TAJIKA_ANGLES.map((t) => {
                const theta = Math.PI - (t.angle * Math.PI / 180);
                const x1 = cx + (rIn - 4) * Math.cos(theta);
                const y1 = cy - (rIn - 4) * Math.sin(theta);
                const x2 = cx + (rOut + 4) * Math.cos(theta);
                const y2 = cy - (rOut + 4) * Math.sin(theta);

                const xLabel = cx + (rOut + 18) * Math.cos(theta);
                const yLabel = cy - (rOut + 18) * Math.sin(theta);

                const isActive = nearestAngle.angle === t.angle && aspectFormed;

                return (
                  <g key={t.angle}>
                    {/* Tick line */}
                    <line 
                      x1={x1} y1={y1} x2={x2} y2={y2} 
                      stroke={isActive ? "#3A8C5A" : "var(--gl-gold-hairline)"} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                      style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                    />
                    
                    {/* Degree Label */}
                    <text
                      x={xLabel}
                      y={yLabel}
                      fill={isActive ? "#3A8C5A" : "var(--gl-ink-secondary)"}
                      fontSize="9.5"
                      fontWeight={isActive ? 800 : 600}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ transition: "fill 0.3s ease, font-weight 0.3s ease" }}
                    >
                      {t.angle}°
                    </text>
                  </g>
                );
              })}

              {/* Instrument Center Hub */}
              <circle cx={cx} cy={cy} r="14" fill="#FFF9F0" stroke="var(--gl-gold-accent)" strokeWidth="2" />
              <circle cx={cx} cy={cy} r="6" fill="var(--gl-gold-accent)" />

              {/* Needle */}
              <g>
                {/* Needle Ray */}
                <line 
                  x1={cx} 
                  y1={cy} 
                  x2={xNeedle} 
                  y2={yNeedle} 
                  stroke={aspectFormed ? "#3A8C5A" : "var(--gl-gold-accent)"} 
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  style={{ transition: reducedMotion ? "none" : "stroke 0.2s ease" }}
                />
                {/* Needle Tip Indicator */}
                <circle 
                  cx={xNeedle} 
                  cy={yNeedle} 
                  r="5" 
                  fill={aspectFormed ? "#3A8C5A" : "var(--gl-gold-accent)"} 
                  stroke="#FFF" 
                  strokeWidth="1.5"
                  style={{ transition: reducedMotion ? "none" : "fill 0.2s ease" }}
                />
              </g>

              {/* Clean Separation text readout (placed safely below baseline and center hub) */}
              <text 
                x="160" 
                y="166" 
                fill="var(--gl-ink-muted)" 
                fontSize="9" 
                fontWeight="600" 
                letterSpacing="0.05em" 
                textAnchor="middle"
                opacity="0.8"
              >
                SEPARATION
              </text>
              <text 
                x="160" 
                y="186" 
                fill="var(--gl-ink-primary)" 
                fontSize="20" 
                fontWeight="800" 
                textAnchor="middle"
              >
                {separation}°
              </text>
            </svg>
          </div>

          {/* Interactive slider + precise manual number input */}
          <div style={{ width: "100%", marginTop: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <input
                type="range"
                min="0"
                max="180"
                step="0.5"
                value={separation}
                onChange={(e) => setSeparation(parseFloat(e.target.value))}
                className="tajika-slider-input"
                aria-label="Planet Separation Degree Slider"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--gl-ink-muted)", marginTop: "4px", fontWeight: 500 }}>
                <span>0° (Conjunction)</span>
                <span>90° (Square)</span>
                <span>180° (Opposition)</span>
              </div>
            </div>

            {/* Precise Degree Input */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", marginBottom: "4px", fontWeight: 600 }}>Degrees</span>
              <input
                type="number"
                min="0"
                max="180"
                step="0.5"
                value={separation}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  setSeparation(Math.max(0, Math.min(180, val)));
                }}
                style={{
                  width: "70px",
                  background: "#FFF9F0",
                  border: "1px solid var(--gl-gold-hairline)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  color: "var(--gl-ink-primary)",
                  fontWeight: 600,
                  fontSize: "13px",
                  textAlign: "center"
                }}
              />
            </div>
          </div>

          {/* Legend of Tājika aspect angles */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", width: "100%", marginTop: "20px", borderTop: "1px solid var(--gl-gold-hairline)", paddingTop: "16px" }}>
            {TAJIKA_ANGLES.map(a => {
              const isActive = nearestAngle.angle === a.angle && aspectFormed;
              return (
                <div 
                  key={a.angle} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px", 
                    fontSize: "11px", 
                    background: isActive ? "rgba(58, 140, 90, 0.08)" : "rgba(156, 122, 47, 0.03)", 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    border: isActive ? "1px solid rgba(58, 140, 90, 0.4)" : "1px solid var(--gl-gold-hairline)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <span style={{ fontWeight: 800, color: isActive ? "#3A8C5A" : "var(--gl-gold-accent)" }}>{a.angle}°</span>
                  <span style={{ color: isActive ? "var(--gl-ink-primary)" : "var(--gl-ink-secondary)", fontWeight: isActive ? 600 : 500 }}>
                    {a.name} ({a.sanskrit})
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom Section: Verdict Panel */}
        <div style={{ 
          background: aspectFormed 
            ? "linear-gradient(135deg, rgba(58, 140, 90, 0.07), rgba(255, 255, 255, 0.45))" 
            : "linear-gradient(135deg, rgba(162, 58, 30, 0.03), rgba(255, 255, 255, 0.45))", 
          border: aspectFormed 
            ? "1px solid rgba(58, 140, 90, 0.35)" 
            : "1px solid rgba(162, 58, 30, 0.22)",
          borderRadius: "14px",
          padding: "20px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4" style={{ width: "100%" }}>
            
            {/* Aspect formed / no aspect result badge */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
              <div 
                style={{
                  background: aspectFormed ? "#3A8C5A" : "rgba(62, 42, 31, 0.08)",
                  color: aspectFormed ? "#FFF" : "var(--gl-ink-secondary)",
                  padding: "6px 14px",
                  borderRadius: "30px",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.3s ease"
                }}
              >
                {aspectFormed ? (
                  <>
                    <CheckCircle2 size={13} />
                    Aspect Formed
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} />
                    No Aspect
                  </>
                )}
              </div>

              {aspectFormed && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gl-ink-primary)" }}>
                    {nearestAngle.name} ({nearestAngle.sanskrit})
                  </span>
                  <span style={{ fontSize: "11px", color: nearestAngle.isBenefic ? "#3A8C5A" : "var(--gl-vermilion-on-cream)", fontWeight: 600 }}>
                    • {nearestAngle.nature}
                  </span>
                </div>
              )}
            </div>

            {/* Worked parameters detail list */}
            <div style={{ width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
              <div style={{ borderLeft: "2px solid var(--gl-gold-hairline)", paddingLeft: "10px" }}>
                <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", display: "block", fontWeight: 600 }}>Nearest Aspect</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gl-ink-primary)" }}>{nearestAngle.angle}° ({nearestAngle.name})</span>
              </div>
              <div style={{ borderLeft: "2px solid var(--gl-gold-hairline)", paddingLeft: "10px" }}>
                <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", display: "block", fontWeight: 600 }}>Deviation Gap</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: gap <= allowedOrb ? "#3A8C5A" : "var(--gl-vermilion-on-cream)" }}>{gap.toFixed(1)}°</span>
              </div>
              <div style={{ borderLeft: "2px solid var(--gl-gold-hairline)", paddingLeft: "10px" }}>
                <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", display: "block", fontWeight: 600 }}>Allowed Orb</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--gl-gold-accent)" }}>±{allowedOrb.toFixed(1)}°</span>
              </div>
            </div>

          </div>

          <div style={{ borderTop: "1px solid var(--gl-gold-hairline)", marginTop: "16px", paddingTop: "14px", fontSize: "12.5px", color: "var(--gl-ink-secondary)", lineHeight: "1.5" }}>
            {aspectFormed ? (
              <p style={{ margin: 0 }}>
                <strong>How it works:</strong> The exact {nearestAngle.name.toLowerCase()} aspect forms at {nearestAngle.angle}°. The actual separation is {separation}°, leaving a deviation gap of <strong>{gap.toFixed(1)}°</strong>. Because this gap is less than or equal to the allowed mean orb of <strong>{allowedOrb}°</strong>, the planetary rays merge and aspect is active.
              </p>
            ) : (
              <p style={{ margin: 0 }}>
                <strong>How it works:</strong> The nearest Tājika aspect is the {nearestAngle.name.toLowerCase()} ({nearestAngle.angle}°). The separation of {separation}° gives a deviation gap of <strong>{gap.toFixed(1)}°</strong>. Because this is wider than the allowed mean orb of <strong>{allowedOrb}°</strong>, the planets are too far apart for their light to interact, resulting in <strong>no aspect</strong>.
              </p>
            )}
          </div>

          {/* Quick learning tip */}
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "12px", background: "rgba(156, 122, 47, 0.04)", padding: "8px 12px", borderRadius: "8px" }}>
            <Info size={14} style={{ color: "var(--gl-copper)", marginTop: "2px", flexShrink: 0 }} />
            <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>
              In Tājika (Perso-Arabic astrology), aspects are based on degree-precise orb boundaries around these five exact angles. Unlike Parāśari, it does not use whole signs, and unlike Jaimini, it is not modality-based.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
