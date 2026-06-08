"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Info, Play, Pause, RotateCcw, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

// Tājika Classical Planets and their Speed Hierarchy (Fastest to Slowest)
export interface TajikaSpeedPlanet {
  id: string;
  name: string;
  sanskrit: string;
  abbr: string;
  deepta: number;
  speedOrder: number; // 7 = fastest (Moon), 1 = slowest (Saturn)
  color: string;
  glyph: string;
}

export const SPEED_PLANETS: TajikaSpeedPlanet[] = [
  { id: "moon", name: "Moon", sanskrit: "Candra", abbr: "Mo", deepta: 12, speedOrder: 7, color: "#4F6FA8", glyph: "☽" },
  { id: "mercury", name: "Mercury", sanskrit: "Budha", abbr: "Me", deepta: 7, speedOrder: 6, color: "#3A8C5A", glyph: "☿" },
  { id: "venus", name: "Venus", sanskrit: "Śukra", abbr: "Ve", deepta: 7, speedOrder: 5, color: "#9D174D", glyph: "♀" },
  { id: "sun", name: "Sun", sanskrit: "Sūrya", abbr: "Su", deepta: 15, speedOrder: 4, color: "#A8821E", glyph: "☉" },
  { id: "mars", name: "Mars", sanskrit: "Maṅgala", abbr: "Ma", deepta: 8, speedOrder: 3, color: "#A23A1E", glyph: "♂" },
  { id: "jupiter", name: "Jupiter", sanskrit: "Guru", abbr: "Ju", deepta: 9, speedOrder: 2, color: "#C28220", glyph: "♃" },
  { id: "saturn", name: "Saturn", sanskrit: "Śani", abbr: "Sa", deepta: 9, speedOrder: 1, color: "#2C2C3E", glyph: "♄" },
];

export interface ApplyingSeparatingPreset {
  id: string;
  label: string;
  planetAId: string;
  planetBId: string;
  offset: number;
  isRetrograde: boolean;
  description: string;
}

const PRESETS: ApplyingSeparatingPreset[] = [
  {
    id: "moon-saturn-applying",
    label: "Moon-Saturn Applying Trine",
    planetAId: "moon",
    planetBId: "saturn",
    offset: -4,
    isRetrograde: false,
    description: "Moon (faster) is 4° before the exact aspect and moving direct. Within the 10.5° allowed orb, it is approaching exactness → Itthaśāla."
  },
  {
    id: "mars-saturn-separating",
    label: "Mars-Saturn Separating Square",
    planetAId: "mars",
    planetBId: "saturn",
    offset: 2,
    isRetrograde: false,
    description: "Mars (faster) has crossed the exact aspect point by 2° and is pulling away direct. Within the 8.5° allowed orb, it is receding → Iśrāf."
  },
  {
    id: "mars-saturn-retro-applying",
    label: "Mars Retrograde Applying Conjunction",
    planetAId: "mars",
    planetBId: "saturn",
    offset: 3,
    isRetrograde: true,
    description: "Mars (faster) is 3° past exact but is retrograde (moving backward). It is closing the distance back toward exactness → Itthaśāla."
  }
];

export function TajikaApplyingSeparating() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const [planetAId, setPlanetAId] = useState<string>("moon");
  const [planetBId, setPlanetBId] = useState<string>("saturn");
  
  // offset represents degrees from exact aspect (-25° to +25°)
  const [offset, setOffset] = useState<number>(-4);
  const [isRetrograde, setIsRetrograde] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(0.15);

  const [isDropdownAOpen, setIsDropdownAOpen] = useState(false);
  const [isDropdownBOpen, setIsDropdownBOpen] = useState(false);

  const dropdownARef = useRef<HTMLDivElement>(null);
  const dropdownBRef = useRef<HTMLDivElement>(null);

  // Pointer Drag State & Handlers
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const newX = clientX - rect.left;
    const newPercentage = Math.max(0, Math.min(newX / rect.width, 1));
    const newOffset = -25 + (newPercentage * 50);
    setOffset(parseFloat(newOffset.toFixed(2)));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setIsPlaying(false); // Pause simulation when dragging
    handleMove(e.clientX);
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMove = (e: PointerEvent) => handleMove(e.clientX);
      const handleGlobalUp = () => setIsDragging(false);
      window.addEventListener("pointermove", handleGlobalMove);
      window.addEventListener("pointerup", handleGlobalUp);
      return () => {
        window.removeEventListener("pointermove", handleGlobalMove);
        window.removeEventListener("pointerup", handleGlobalUp);
      };
    }
  }, [isDragging]);

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

  const planetA = useMemo(() => SPEED_PLANETS.find(p => p.id === planetAId) ?? SPEED_PLANETS[0], [planetAId]);
  const planetB = useMemo(() => SPEED_PLANETS.find(p => p.id === planetBId) ?? SPEED_PLANETS[6], [planetBId]);

  // Enforce relative speed ordering: Planet A must be faster than Planet B
  const handleSelectPlanetA = (id: string) => {
    const selected = SPEED_PLANETS.find(p => p.id === id)!;
    if (selected.speedOrder <= planetB.speedOrder) {
      // Auto-swap or pick a slower planet B
      const slower = SPEED_PLANETS.find(p => p.speedOrder < selected.speedOrder);
      if (slower) {
        setPlanetBId(slower.id);
      } else {
        // Selected planet is Saturn (slowest), so set Planet B to Saturn and A to Jupiter
        setPlanetAId("jupiter");
        setPlanetBId("saturn");
        setIsDropdownAOpen(false);
        return;
      }
    }
    setPlanetAId(id);
    setIsDropdownAOpen(false);
  };

  const handleSelectPlanetB = (id: string) => {
    const selected = SPEED_PLANETS.find(p => p.id === id)!;
    if (selected.speedOrder >= planetA.speedOrder) {
      // Auto-swap or pick a faster planet A
      const faster = SPEED_PLANETS.find(p => p.speedOrder > selected.speedOrder);
      if (faster) {
        setPlanetAId(faster.id);
      } else {
        // Selected is Moon (fastest), so set Planet A to Moon and B to Mercury
        setPlanetAId("moon");
        setPlanetBId("mercury");
        setIsDropdownBOpen(false);
        return;
      }
    }
    setPlanetBId(id);
    setIsDropdownBOpen(false);
  };

  const allowedOrb = useMemo(() => {
    return (planetA.deepta + planetB.deepta) / 2;
  }, [planetA, planetB]);

  // Simulation animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let frameId: number;

    const tick = () => {
      setOffset((prev) => {
        let next = prev + (isRetrograde ? -simSpeed : simSpeed);
        if (next > 25) next = -25;
        if (next < -25) next = 25;
        return parseFloat(next.toFixed(2));
      });
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, isRetrograde, simSpeed]);

  const inOrb = useMemo(() => {
    return Math.abs(offset) <= allowedOrb;
  }, [offset, allowedOrb]);

  // Tājika State: Itthaśāla (applying) vs Iśrāf (separating) vs Out of Orb
  const aspectState = useMemo(() => {
    if (!inOrb) return "out";
    if (offset === 0) return "exact";

    if (isRetrograde) {
      // Retrograde: moves from right (+25) to left (-25)
      // If offset > 0, it is moving from right toward 0 -> Applying (Itthaśāla)
      // If offset < 0, it has passed 0 and is moving away toward left -> Separating (Iśrāf)
      return offset > 0 ? "applying" : "separating";
    } else {
      // Direct: moves from left (-25) to right (+25)
      // If offset < 0, it is moving from left toward 0 -> Applying (Itthaśāla)
      // If offset > 0, it has passed 0 and is moving away toward right -> Separating (Iśrāf)
      return offset < 0 ? "applying" : "separating";
    }
  }, [offset, inOrb, isRetrograde]);

  // Compute active preset dynamically (verdict-driven active tab state)
  const activePresetId = useMemo(() => {
    const matched = PRESETS.find(p => 
      p.planetAId === planetAId && 
      p.planetBId === planetBId && 
      p.isRetrograde === isRetrograde &&
      Math.abs(p.offset - offset) < 0.1
    );
    return matched ? matched.id : null;
  }, [planetAId, planetBId, isRetrograde, offset]);

  const loadPreset = (preset: ApplyingSeparatingPreset) => {
    setIsPlaying(false);
    setPlanetAId(preset.planetAId);
    setPlanetBId(preset.planetBId);
    setOffset(preset.offset);
    setIsRetrograde(preset.isRetrograde);
  };

  // Convert degree offset (-25 to +25) to SVG relative X (50 to 550)
  const scaleDegToX = (deg: number) => {
    // -25 deg maps to 50, 0 deg maps to 300, +25 deg maps to 550
    return 300 + (deg * 10);
  };

  const xPlanetA = scaleDegToX(offset);
  const xPlanetB = 300; // Fixed at center 0

  const xOrbStart = scaleDegToX(-allowedOrb);
  const xOrbEnd = scaleDegToX(allowedOrb);

  return (
    <div 
      className="gl-surface-twilight-glass" 
      style={{ 
        padding: "24px", 
        color: "var(--gl-ink-primary)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
      }}
      data-interactive="tajika-applying-separating"
    >
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

        .toggle-switch-checkbox {
          display: none;
        }
        .toggle-switch-label {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          background: rgba(156, 122, 47, 0.08);
          border: 1px solid var(--gl-gold-hairline);
          border-radius: 20px;
          padding: 3px 6px;
          transition: background 0.3s;
        }
        .toggle-switch-circle {
          width: 14px;
          height: 14px;
          background: var(--gl-ink-muted);
          border-radius: 50%;
          transition: transform 0.3s, background 0.3s;
        }
        .toggle-switch-checkbox:checked + .toggle-switch-label .toggle-switch-circle {
          transform: translateX(18px);
          background: var(--gl-vermilion-on-cream);
        }
        .toggle-switch-checkbox:checked + .toggle-switch-label {
          background: rgba(212, 80, 46, 0.08);
          border-color: rgba(212, 80, 46, 0.35);
        }
      `}} />

      {/* Header and Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "var(--gl-gold-accent)", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} style={{ color: "var(--gl-copper)" }} />
            Tājika Applying vs Separating Visualizer
          </h3>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--gl-ink-muted)" }}>
            Learn to identify Itthaśāla (forming) and Iśrāf (fading) dynamic aspects
          </p>
        </div>
      </div>

      {/* Presets Row */}
      <div style={{ marginBottom: "24px" }}>
        <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "8px", fontWeight: 600 }}>
          Worked Example Presets
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "8px" }}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className={`tajika-preset-btn px-3 py-2 rounded-lg font-medium text-left ${activePresetId === preset.id ? "active" : ""}`}
            >
              <div style={{ fontWeight: 600, fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
                <span>{preset.label.split(" ")[0]}</span>
                <span style={{ color: "var(--gl-gold-accent)" }}>{preset.offset > 0 ? `+${preset.offset}` : preset.offset}°</span>
              </div>
              <div style={{ fontSize: "10px", color: "var(--gl-ink-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {preset.isRetrograde ? "Retrograde" : "Direct"} • {preset.label.split(" ").slice(1).join(" ")}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Panel */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
        
        {/* Top Control Panel: Selectors, Retrograde Toggle, Play Simulation */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", alignItems: "center" }}>
          
          {/* Planet A selector */}
          <div ref={dropdownARef} style={{ position: "relative" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>
              Planet A (Faster Planet)
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
                  <div style={{ fontSize: "11px", color: "var(--gl-copper)", fontWeight: 500 }}>Speed Rank: {planetA.speedOrder} (Fast)</div>
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
                  {SPEED_PLANETS.map((p) => (
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
                      <span style={{ fontSize: "11px", color: "var(--gl-gold-accent)", fontWeight: 600 }}>Rank {p.speedOrder}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Planet B selector */}
          <div ref={dropdownBRef} style={{ position: "relative" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>
              Planet B (Slower Planet)
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
                  <div style={{ fontSize: "11px", color: "var(--gl-copper)", fontWeight: 500 }}>Speed Rank: {planetB.speedOrder} (Slow)</div>
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
                  {SPEED_PLANETS.map((p) => (
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
                      <span style={{ fontSize: "11px", color: "var(--gl-gold-accent)", fontWeight: 600 }}>Rank {p.speedOrder}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Retrograde Toggle & Simulation Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
            
            {/* Retrograde switch */}
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>
                Planet A Status
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input
                  type="checkbox"
                  id="retrogradeToggle"
                  checked={isRetrograde}
                  onChange={(e) => {
                    setIsRetrograde(e.target.checked);
                    setIsPlaying(false); // pause to let them observe
                  }}
                  className="toggle-switch-checkbox"
                />
                <label htmlFor="retrogradeToggle" className="toggle-switch-label" style={{ width: "42px" }}>
                  <div className="toggle-switch-circle" />
                </label>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: isRetrograde ? "var(--gl-vermilion-on-cream)" : "var(--gl-ink-primary)" }}>
                  {isRetrograde ? "Retrograde (Rx)" : "Direct (D)"}
                </span>
              </div>
            </div>

            {/* Play/Pause */}
            <div>
              <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--gl-ink-muted)", display: "block", marginBottom: "6px", fontWeight: 600 }}>
                Simulation
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    background: isPlaying ? "rgba(156,122,47,0.1)" : "var(--gl-gold-accent)",
                    color: isPlaying ? "var(--gl-gold-accent)" : "#FFF",
                    border: "1px solid var(--gl-gold-accent)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer"
                  }}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} fill="currentColor" /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" /> Play
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setOffset(isRetrograde ? 20 : -20);
                  }}
                  title="Reset positions"
                  style={{
                    background: "rgba(156,122,47,0.05)",
                    border: "1px solid var(--gl-gold-hairline)",
                    borderRadius: "8px",
                    padding: "6px",
                    cursor: "pointer",
                    color: "var(--gl-ink-secondary)"
                  }}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Central Display: Overtaking Track (Horizontal Axis) */}
        <div style={{ 
          background: "rgba(255, 255, 255, 0.3)", 
          border: "1px solid var(--gl-gold-hairline)",
          borderRadius: "16px",
          padding: "28px 24px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden"
        }}>
          
          {/* Legend indicator above axis */}
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--gl-ink-muted)", marginBottom: "8px", fontWeight: 600, letterSpacing: "0.02em" }}>
            <span>← DECREASING DEGREES</span>
            <span style={{ color: "var(--gl-gold-accent)" }}>RELATIVE LONGITUDE OFFSET FROM EXACT ASPECT</span>
            <span>INCREASING DEGREES →</span>
          </div>

          {/* SVG relative motion track */}
          <div 
            ref={trackRef}
            onPointerDown={handlePointerDown}
            style={{ 
              width: "100%", 
              position: "relative",
              cursor: isDragging ? "grabbing" : "grab",
              touchAction: "none"
            }}
          >
            <svg 
              viewBox="0 0 600 130" 
              width="100%" 
              height="100%"
              style={{ overflow: "visible", userSelect: "none" }}
            >
              {/* Linear Track Baseline Axis */}
              <line x1="20" y1="80" x2="580" y2="80" stroke="var(--gl-gold-hairline)" strokeWidth="1.5" />

              {/* Ticks on Axis */}
              {[-20, -15, -10, -5, 0, 5, 10, 15, 20].map((t) => {
                const x = scaleDegToX(t);
                const isCenter = t === 0;

                return (
                  <g key={t}>
                    <line 
                      x1={x} y1={80} x2={x} y2={88} 
                      stroke={isCenter ? "var(--gl-gold-accent)" : "var(--gl-gold-hairline)"} 
                      strokeWidth={isCenter ? 2.5 : 1} 
                    />
                    <text
                      x={x}
                      y={104}
                      fill={isCenter ? "var(--gl-gold-accent)" : "var(--gl-ink-muted)"}
                      fontSize="9.5"
                      fontWeight={isCenter ? 750 : 500}
                      textAnchor="middle"
                    >
                      {t > 0 ? `+${t}` : t}°
                    </text>
                  </g>
                );
              })}

              {/* Allowed Orb Window Highlight (The Bubble) */}
              <rect
                x={xOrbStart}
                y="20"
                width={xOrbEnd - xOrbStart}
                height="60"
                fill={inOrb ? "rgba(58, 140, 90, 0.06)" : "rgba(156, 122, 47, 0.03)"}
                stroke={inOrb ? "rgba(58, 140, 90, 0.25)" : "var(--gl-gold-hairline)"}
                strokeWidth="1"
                strokeDasharray="4 3"
                rx="6"
                style={{ transition: "fill 0.3s ease, stroke 0.3s ease" }}
              />

              {/* Orb Boundary labels */}
              <text x={xOrbStart} y="120" fill="var(--gl-ink-muted)" fontSize="8.5" textAnchor="middle" opacity="0.8">
                -{allowedOrb}° Orb Edge
              </text>
              <text x={xOrbEnd} y="120" fill="var(--gl-ink-muted)" fontSize="8.5" textAnchor="middle" opacity="0.8">
                +{allowedOrb}° Orb Edge
              </text>

              {/* Central Exact Aspect Label */}
              <text x="300" y="120" fill="var(--gl-gold-accent)" fontSize="9.5" fontWeight="700" textAnchor="middle">
                0° Exact Aspect
              </text>

              {/* Planet B Node (Anchored Slower Planet) */}
              <g transform="translate(280, 20)">
                <rect width="40" height="40" rx="8" fill="#FFF9F0" stroke="var(--gl-gold-accent)" strokeWidth="1.5" />
                <text x="20" y="22" fill="var(--gl-ink-primary)" fontSize="18" textAnchor="middle" dominantBaseline="middle">
                  {planetB.glyph}
                </text>
                <text x="20" y="-8" fill="var(--gl-ink-secondary)" fontSize="9.5" fontWeight="700" textAnchor="middle">
                  {planetB.abbr} (Slow)
                </text>
              </g>

              {/* Aspect Ray Vector Connection */}
              {inOrb && (
                <line
                  x1={xPlanetA}
                  y1="40"
                  x2={xPlanetB}
                  y2="40"
                  stroke={aspectState === "applying" || aspectState === "exact" ? "#3A8C5A" : "var(--gl-copper)"}
                  strokeWidth="2.5"
                  strokeDasharray={aspectState === "separating" ? "4 3" : "none"}
                  opacity={offset === 0 ? 1 : Math.max(0.2, 1 - Math.abs(offset) / allowedOrb)}
                  style={{ transition: "stroke 0.2s ease" }}
                />
              )}

              {/* Planet A Node (Moving Faster Planet) */}
              <g transform={`translate(${xPlanetA - 20}, 20)`}>
                <rect width="40" height="40" rx="8" fill="#FFF9F0" stroke={planetA.color} strokeWidth="2" />
                <text x="20" y="22" fill={planetA.color} fontSize="18" textAnchor="middle" dominantBaseline="middle">
                  {planetA.glyph}
                </text>
                <text x="20" y="-8" fill="var(--gl-ink-secondary)" fontSize="9.5" fontWeight="700" textAnchor="middle">
                  {planetA.abbr} (Fast)
                </text>

                {/* Motion Direction Arrow indicator */}
                <text x="20" y="54" fill={isRetrograde ? "var(--gl-vermilion-on-cream)" : "var(--gl-gold-accent)"} fontSize="11.5" fontWeight="800" textAnchor="middle">
                  {isRetrograde ? "← Rx" : "→ D"}
                </text>
              </g>
            </svg>
          </div>

          {/* Interactive slider controller */}
          <div style={{ width: "100%", marginTop: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <input
                type="range"
                min="-25"
                max="25"
                step="0.25"
                value={offset}
                onChange={(e) => {
                  setOffset(parseFloat(e.target.value));
                  setIsPlaying(false); // Pause on slider scrub
                }}
                className="tajika-slider-input"
                aria-label="Separation offset degree scrubber"
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--gl-ink-muted)", marginTop: "4px", fontWeight: 600 }}>
                <span>-25° (Before Aspect)</span>
                <span>0° (Exact Peak)</span>
                <span>+25° (After Aspect)</span>
              </div>
            </div>

            {/* Current relative degree separation readout */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={{ fontSize: "10px", color: "var(--gl-ink-muted)", marginBottom: "4px", fontWeight: 600 }}>Offset</span>
              <input
                type="number"
                min="-25"
                max="25"
                step="0.5"
                value={offset}
                onChange={(e) => {
                  let val = parseFloat(e.target.value);
                  if (isNaN(val)) val = 0;
                  setOffset(Math.max(-25, Math.min(25, val)));
                  setIsPlaying(false);
                }}
                style={{
                  width: "75px",
                  background: "#FFF9F0",
                  border: "1px solid var(--gl-gold-hairline)",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  color: "var(--gl-ink-primary)",
                  fontWeight: 700,
                  fontSize: "13px",
                  textAlign: "center"
                }}
              />
            </div>
          </div>

        </div>

        {/* Bottom Section: Time-Arc Verdict Panel */}
        <div style={{ 
          background: aspectState === "applying"
            ? "linear-gradient(135deg, rgba(58, 140, 90, 0.07), rgba(255, 255, 255, 0.45))" 
            : aspectState === "separating"
            ? "linear-gradient(135deg, rgba(156, 122, 47, 0.05), rgba(255, 255, 255, 0.45))"
            : "linear-gradient(135deg, rgba(62, 42, 31, 0.02), rgba(255, 255, 255, 0.45))", 
          border: aspectState === "applying"
            ? "1px solid rgba(58, 140, 90, 0.35)" 
            : aspectState === "separating"
            ? "1px solid rgba(156, 122, 47, 0.35)"
            : "1px solid var(--gl-gold-hairline)",
          borderRadius: "14px",
          padding: "20px",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        }}>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Aspect status title & badge */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div 
                  style={{
                    background: aspectState === "applying" 
                      ? "#3A8C5A" 
                      : aspectState === "separating"
                      ? "var(--gl-gold-accent)"
                      : "rgba(62, 42, 31, 0.08)",
                    color: aspectState === "applying" ? "#FFF" : aspectState === "separating" ? "#FFF" : "var(--gl-ink-secondary)",
                    padding: "6px 14px",
                    borderRadius: "30px",
                    fontWeight: 750,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  {aspectState === "applying" ? (
                    <>
                      <CheckCircle2 size={13} />
                      Itthaśāla (Applying)
                    </>
                  ) : aspectState === "separating" ? (
                    <>
                      <CheckCircle2 size={13} />
                      Iśrāf (Separating)
                    </>
                  ) : aspectState === "exact" ? (
                    <>
                      <CheckCircle2 size={13} fill="currentColor" />
                      Exact Aspect
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} />
                      Out of Orb
                    </>
                  )}
                </div>

                <span style={{ fontSize: "13.5px", fontWeight: 700, color: "var(--gl-ink-primary)" }}>
                  {planetA.name} {isRetrograde ? "Rx" : ""} ⇄ {planetB.name}
                </span>
              </div>

              {/* Allowed Orb indicator */}
              <div style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 600 }}>
                Allowed Orb: <span style={{ color: "var(--gl-gold-accent)", fontSize: "13px", fontWeight: 750 }}>±{allowedOrb}°</span>
              </div>
            </div>

            {/* Time-Arc graphic readout */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", width: "100%", padding: "10px 0", borderTop: "1px solid var(--gl-gold-hairline)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>
              <div style={{ textAlign: "center", borderRight: "1px solid var(--gl-gold-hairline)" }}>
                <div style={{ fontSize: "9px", color: "var(--gl-ink-muted)", fontWeight: 600, textTransform: "uppercase" }}>Past / Releasing</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: aspectState === "separating" ? "var(--gl-gold-accent)" : "var(--gl-ink-muted)" }}>Iśrāf</div>
              </div>
              <div style={{ textAlign: "center", borderRight: "1px solid var(--gl-gold-hairline)" }}>
                <div style={{ fontSize: "9px", color: "var(--gl-ink-muted)", fontWeight: 600, textTransform: "uppercase" }}>Present Peak</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: aspectState === "exact" ? "#3A8C5A" : "var(--gl-ink-muted)" }}>Exact (0°)</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "9px", color: "var(--gl-ink-muted)", fontWeight: 600, textTransform: "uppercase" }}>Future / Forming</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: aspectState === "applying" ? "#3A8C5A" : "var(--gl-ink-muted)" }}>Itthaśāla</div>
              </div>
            </div>

            {/* Worked Calculation Details */}
            <div style={{ fontSize: "13px", color: "var(--gl-ink-secondary)", lineHeight: "1.55" }}>
              {aspectState === "applying" ? (
                <p style={{ margin: 0 }}>
                  <strong>Pedagogical Explanation:</strong> The faster planet, the <strong>{planetA.name}</strong> (Rank {planetA.speedOrder}), is positioned at <strong>{offset > 0 ? `+${offset}` : offset}°</strong> relative to {planetB.name}. Because it is within the allowed orb of <strong>{allowedOrb}°</strong> and {isRetrograde ? "retrograding back toward" : "moving direct toward"} exactness, the aspect is <strong>forming (Itthaśāla)</strong>. This reads as a <strong>future outcome approaching fruition</strong>.
                </p>
              ) : aspectState === "separating" ? (
                <p style={{ margin: 0 }}>
                  <strong>Pedagogical Explanation:</strong> The faster planet, the <strong>{planetA.name}</strong> (Rank {planetA.speedOrder}), is positioned at <strong>{offset > 0 ? `+${offset}` : offset}°</strong> relative to {planetB.name}. Although within the allowed orb of <strong>{allowedOrb}°</strong>, it has crossed exactness and is {isRetrograde ? "retrograding away from" : "moving direct away from"} the exact degree. The aspect is <strong>separating (Iśrāf)</strong>. This reads as a <strong>fading past influence</strong>.
                </p>
              ) : aspectState === "exact" ? (
                <p style={{ margin: 0 }}>
                  <strong>Pedagogical Explanation:</strong> The planets are exactly at the aspect angle (offset <strong>0.0°</strong>). The aspect is at its peak strength.
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  <strong>Pedagogical Explanation:</strong> The relative offset is <strong>{offset > 0 ? `+${offset}` : offset}°</strong>, which exceeds the allowed mean orb of <strong>{allowedOrb}°</strong>. The planetary rays are too far apart to interact. There is <strong>no aspect active</strong>.
                </p>
              )}
            </div>

            {/* Quick Speed Reference table */}
            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "4px", background: "rgba(156, 122, 47, 0.04)", padding: "8px 12px", borderRadius: "8px" }}>
              <Info size={14} style={{ color: "var(--gl-copper)", marginTop: "2px", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", color: "var(--gl-ink-muted)", fontWeight: 500 }}>
                <strong>Astrology speed order check:</strong> Moon (fastest) → Mercury → Venus → Sun → Mars → Jupiter → Saturn (slowest). When judging application, always isolate the faster planet's direction relative to the exact degree.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
