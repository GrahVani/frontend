"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Calendar, FileText, ChevronRight, ChevronLeft, RefreshCw, AlertOctagon, Heart } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface DayConfig {
  id: string;
  name: string;
  sanskrit: string;
  graha: string;
  pujas: string[];
  danaItems: string;
  planetColor: string;
}

const DAYS_CONFIG: DayConfig[] = [
  { id: "sunday", name: "Sunday", sanskrit: "Ravivāra", graha: "Sun (Sūrya)", pujas: ["Sūrya Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Wheat, jaggery, copper, gold to father-figures, leaders", planetColor: "#ff4d4d" },
  { id: "monday", name: "Monday", sanskrit: "Somavāra", graha: "Moon (Candra)", pujas: ["Candra Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Rice, milk, silver, white cloth to mothers, women", planetColor: "#e0dacb" },
  { id: "tuesday", name: "Tuesday", sanskrit: "Maṅgalavāra", graha: "Mars (Maṅgala)", pujas: ["Maṅgala Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Red lentils (masoor), copper, red cloth to the brave, soldiers", planetColor: "#ff7a5c" },
  { id: "wednesday", name: "Wednesday", sanskrit: "Budhavāra", graha: "Mercury (Budha)", pujas: ["Budha Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Green gram (moong), green cloth to students", planetColor: "#39e678" },
  { id: "thursday", name: "Thursday", sanskrit: "Guruvāra", graha: "Jupiter (Guru)", pujas: ["Guru Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Turmeric, chanā dāl, yellow items, gold to teachers, priests", planetColor: "#fbc02d" },
  { id: "friday", name: "Friday", sanskrit: "Śukravāra", graha: "Venus (Śukra)", pujas: ["Śukra Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "White/silk cloth, sugar, perfume to women, artists", planetColor: "#b3e5fc" },
  { id: "saturday", name: "Saturday", sanskrit: "Śanivāra", graha: "Saturn (Śani)", pujas: ["Śani Pūjā (Individual)", "Navagraha Pūjā (General Planetary Harmony)"], danaItems: "Black sesame, iron, mustard oil, black/blue cloth to laborers, the elderly, the needy/disabled", planetColor: "#448aff" }
];

export function PujaVrataGuide() {
  const [step, setStep] = useState<number>(1);
  const [selectedDayId, setSelectedDayId] = useState<string>("saturday");
  const [fastType, setFastType] = useState<string>("Fruit Fast");
  const [selectedPuja, setSelectedPuja] = useState<string>("");
  const [selectedDana, setSelectedDana] = useState<string>("");

  const currentDayConfig = DAYS_CONFIG.find(d => d.id === selectedDayId) || DAYS_CONFIG[6];

  // Initialize selected puja/dana when day changes
  useEffect(() => {
    setSelectedPuja(currentDayConfig.pujas[0]);
    setSelectedDana(currentDayConfig.danaItems);
  }, [selectedDayId, currentDayConfig]);

  const handleNextStep = () => {
    setStep(prev => prev + 1);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleSelectDay = (id: string) => {
    setSelectedDayId(id);
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(8);
    }
  };

  const resetBuilder = () => {
    setStep(1);
    setSelectedDayId("saturday");
    setFastType("Fruit Fast");
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // SVG Altar Drawing Component
  const renderPujaAltar = () => {
    const showFood = step >= 2;
    const showWorship = step >= 3;
    const showWater = step >= 4;
    const showScroll = step === 5;

    return (
      <svg
        viewBox="0 0 400 180"
        style={{
          width: "100%",
          maxHeight: "190px",
          background: "var(--gl-cream-light, #fdfcf7)",
          borderRadius: "12px",
          border: "1px solid rgba(156,122,47,0.15)",
          boxShadow: "inset 0 0 16px rgba(156, 122, 47, 0.05)"
        }}
        aria-label="Sattvic Altar Visual Workspace"
      >
        <style>{`
          @keyframes flicker {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.1) translate(-0.5px, -1px); opacity: 1; }
            100% { transform: scale(0.95) translate(0.5px, 0.5px); opacity: 0.85; }
          }
          @keyframes smoke {
            0% { transform: translate(0, 0) scale(1); opacity: 0; }
            30% { transform: translate(-3px, -10px) scale(1.2); opacity: 0.4; }
            60% { transform: translate(4px, -20px) scale(1.4); opacity: 0.2; }
            100% { transform: translate(-6px, -35px) scale(1.6); opacity: 0; }
          }
          .flame {
            animation: flicker 0.15s infinite alternate;
            transform-origin: 290px 105px;
          }
          .smoke-line {
            animation: smoke 3s infinite linear;
            transform-origin: 110px 100px;
          }
          .smoke-line-2 {
            animation: smoke 3.5s infinite linear 1s;
            transform-origin: 110px 100px;
          }
          .altar-fade-in {
            transition: opacity 0.5s ease-in-out;
          }
        `}</style>

        <defs>
          <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f5efe6" />
            <stop offset="30%" stopColor="#e8dfd0" />
            <stop offset="100%" stopColor="#cabda7" />
          </linearGradient>
          <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe082" />
            <stop offset="60%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ffb300" />
          </linearGradient>
          <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dd7b55" />
            <stop offset="40%" stopColor="#f09675" />
            <stop offset="100%" stopColor="#a34824" />
          </linearGradient>
          <radialGradient id="altarHaze" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={currentDayConfig.planetColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dynamic planetary haze behind the altar */}
        <circle cx="200" cy="70" r="70" fill="url(#altarHaze)" />

        {/* Decorative Temple Arch Backdrop */}
        <path d="M 100 130 A 100 100 0 0 1 300 130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
        <path d="M 95 130 A 105 105 0 0 1 305 130" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" strokeDasharray="3,3" />

        {/* Central Planetary Glyph/Vrata indicator */}
        <g transform="translate(200, 65)">
          <circle cx="0" cy="0" r="18" fill="none" stroke={currentDayConfig.planetColor} strokeWidth="1.5" filter="drop-shadow(0 0 3px rgba(0,0,0,0.1))" />
          <text x="0" y="3" fontSize="8" fontWeight="bold" fill={INK_SECONDARY} textAnchor="middle" style={{ fontFamily: "'Inter', sans-serif" }}>
            {currentDayConfig.name.substring(0, 3).toUpperCase()}
          </text>
          <circle cx="0" cy="0" r="21" fill="none" stroke={currentDayConfig.planetColor} strokeWidth="0.5" strokeDasharray="2,2" />
        </g>

        {/* Altar Pedestal (The Altar Platform) */}
        <rect x="70" y="120" width="260" height="15" rx="3" fill="url(#pedestalGrad)" stroke="rgba(156,122,47,0.2)" strokeWidth="1" />
        <rect x="60" y="135" width="280" height="10" rx="2" fill="#ab9b82" />

        {/* 1. WATER (Glowing Copper Kalasha Cup) - Left side */}
        <g opacity={showWater ? 1 : 0.15} className="altar-fade-in" style={{ transition: "opacity 0.5s ease" }}>
          {/* Copper Kalash shape */}
          <path d="M 100 120 L 97 106 Q 97 100 102 96 Q 106 93 110 93 Q 114 93 118 96 Q 123 100 123 106 L 120 120 Z" fill="url(#copperGrad)" stroke="#a34824" strokeWidth="0.5" />
          {/* Rim of cup */}
          <ellipse cx="110" cy="94" rx="7" ry="1.5" fill="#f09675" stroke="#a34824" strokeWidth="0.5" />
          {/* Mango leaves sticking out */}
          {showWater && (
            <path d="M 107 93 Q 104 80 101 86 M 113 93 Q 116 80 119 86 M 110 93 V 80" fill="none" stroke="#2e7d32" strokeWidth="1.5" strokeLinecap="round" />
          )}
          <text x="110" y="143" fontSize="7" fill={INK_MUTED} textAnchor="middle" fontWeight="bold">Water</text>
        </g>

        {/* 2. FOOD (Fruit Plate / Milk Cup) - Right side */}
        <g opacity={showFood ? 1 : 0.15} className="altar-fade-in" style={{ transition: "opacity 0.5s ease" }}>
          {/* Plate */}
          <ellipse cx="160" cy="120" rx="16" ry="3.5" fill="url(#pedestalGrad)" stroke="rgba(156,122,47,0.3)" strokeWidth="0.75" />
          {/* Fruits (Three small circles) */}
          {showFood && (
            <>
              <circle cx="154" cy="116" r="4.5" fill="#e57373" stroke="#b71c1c" strokeWidth="0.5" /> {/* Red apple */}
              <circle cx="166" cy="116" r="4.5" fill="#ffe082" stroke="#f57f17" strokeWidth="0.5" /> {/* Orange */}
              <circle cx="160" cy="114" r="3.8" fill="#81c784" stroke="#2e7d32" strokeWidth="0.5" /> {/* Green lime */}
            </>
          )}
          <text x="160" y="143" fontSize="7" fill={INK_MUTED} textAnchor="middle" fontWeight="bold">Food Fast</text>
        </g>

        {/* 3. INCENSE & LIGHT (Worship) - Back positions */}
        {/* Incense (Left back) */}
        <g opacity={showWorship ? 1 : 0.15} className="altar-fade-in" style={{ transition: "opacity 0.5s ease" }}>
          {/* Incense holder */}
          <rect x="235" y="115" width="10" height="5" rx="1.5" fill="url(#brassGrad)" />
          {/* Incense stick */}
          <line x1="240" y1="115" x2="232" y2="90" stroke="#795548" strokeWidth="1" strokeLinecap="round" />
          {/* Smoke vectors */}
          {showWorship && (
            <>
              <path d="M 232 90 Q 230 75 233 70 T 228 50" fill="none" stroke="#b0bec5" strokeWidth="0.75" className="smoke-line" opacity="0.6" />
              <path d="M 232 90 Q 235 78 230 73 T 235 55" fill="none" stroke="#cfd8dc" strokeWidth="0.5" className="smoke-line-2" opacity="0.4" />
            </>
          )}
          <text x="240" y="143" fontSize="7" fill={INK_MUTED} textAnchor="middle" fontWeight="bold">Incense</text>
        </g>

        {/* Light / Diya (Right back) */}
        <g opacity={showWorship ? 1 : 0.15} className="altar-fade-in" style={{ transition: "opacity 0.5s ease" }}>
          {/* Clay Diya body */}
          <path d="M 276 120 Q 274 112 284 108 Q 290 106 296 112 Q 306 114 304 120 Z" fill="#b0bec5" stroke="#78909c" strokeWidth="0.5" />
          {/* Golden oil inside */}
          <ellipse cx="290" cy="111" rx="8" ry="2" fill="url(#brassGrad)" />
          {/* Wick tip */}
          <line x1="290" y1="110" x2="290" y2="105" stroke="#212121" strokeWidth="1" />
          {/* Flickering Diya Flame */}
          {showWorship && (
            <path d="M 290 105 C 287 98 286 92 290 85 C 294 92 293 98 290 105 Z" fill="#ffb300" stroke="#ff3d00" strokeWidth="0.5" className="flame" filter="drop-shadow(0 0 3px #ff9100)" />
          )}
          <text x="290" y="143" fontSize="7" fill={INK_MUTED} textAnchor="middle" fontWeight="bold">Diya Light</text>
        </g>

        {/* 5. VRATA SCROLL ASSEMBLED (Center overlay) */}
        {showScroll && (
          <g className="altar-fade-in" style={{ transition: "opacity 0.6s ease" }}>
            {/* Large Brass Plate under scroll */}
            <ellipse cx="200" cy="120" rx="35" ry="8" fill="url(#brassGrad)" stroke="#ffb300" strokeWidth="1" />
            <ellipse cx="200" cy="120" rx="32" ry="6" fill="#ffe082" opacity="0.4" />
            
            {/* Scroll body */}
            <rect x="180" y="104" width="40" height="12" rx="2" fill="#fffaf0" stroke="#cabda7" strokeWidth="0.5" transform="rotate(-3, 200, 110)" />
            {/* Tied ribbon */}
            <rect x="197" y="103" width="6" height="13" fill="#b71c1c" transform="rotate(-3, 200, 110)" />
            <circle cx="200" cy="109.5" r="2.2" fill="#ffd54f" />
            
            {/* Spiritual star sparkles */}
            <path d="M 160 90 L 162 93 L 165 93 L 162 95 L 163 98 L 160 96 L 157 98 L 158 95 L 155 93 L 158 93 Z" fill="#ffe082" />
            <path d="M 240 85 L 241.5 87 L 244 87 L 242 89 L 243 91.5 L 240 90 L 237 91.5 L 238 89 L 236 87 L 238.5 87 Z" fill="#ffe082" />
          </g>
        )}

      </svg>
    );
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
      gap: "16px"
    }}>
      <style>{`
        .step-bubble {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid rgba(156,122,47,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 800;
          color: ${INK_SECONDARY};
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .step-bubble.active {
          background: ${GOLD_DEEP};
          color: #ffffff;
          border-color: ${GOLD_DEEP};
        }
        .step-bubble.completed {
          background: rgba(78, 112, 55, 0.1);
          border-color: #4e7037;
          color: #4e7037;
        }
        .builder-btn {
          border: 1px solid rgba(156,122,47,0.2);
          background: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.15s ease;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          color: ${INK_SECONDARY};
          text-align: left;
        }
        .builder-btn:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.7);
        }
        .builder-btn.active {
          border-color: ${GOLD_DEEP};
          background: rgba(156, 122, 47, 0.08);
          color: ${GOLD_DEEP};
          font-weight: 750;
        }
        .parchment-scroll {
          background: #fbf8f3;
          border: 2px solid #e2d3bb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), inset 0 0 20px rgba(156, 122, 47, 0.04);
          border-radius: 12px;
          padding: 16px;
          position: relative;
        }
        .scroll-border {
          border: 1px solid rgba(156, 122, 47, 0.15);
          border-radius: 8px;
          padding: 14px;
        }
        button:focus-visible, .builder-btn:focus-visible {
          outline: 2px solid ${GOLD_DEEP};
          outline-offset: 2px;
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        borderBottom: "1px solid rgba(156, 122, 47, 0.1)",
        paddingBottom: "10px"
      }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          Remedy Integration & Vrata Builder
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          Define pūjā and vrata concepts and build an integrated planetary vow combining fasting, worship, and charity.
        </p>
      </div>

      {/* STEP PROGRESS TRACKER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "rgba(0,0,0,0.03)",
        borderRadius: "10px",
        padding: "8px 12px"
      }}>
        <span style={{ fontSize: "11px", fontWeight: 800 }}>
          {step === 5 ? "Vrata Assembled" : `Step ${step} of 4: ${
            step === 1 ? "Select Target Day & Graha" :
            step === 2 ? "Select Fasting Discipline" :
            step === 3 ? "Select Devotional Worship" :
            "Select Charity Signification"
          }`}
        </span>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }} role="group" aria-label="Creation Steps Progress">
          {[1, 2, 3, 4].map(s => {
            const isActive = s === step;
            const isCompleted = s < step;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {s > 1 && <div style={{ width: "12px", height: "1px", background: "rgba(0,0,0,0.15)" }} />}
                <div 
                  className={`step-bubble ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {s}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RITUAL ALTAR INTERACTIVE PREVIEW */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={{ fontSize: "9.5px", fontWeight: 800, textTransform: "uppercase", color: INK_MUTED, letterSpacing: "0.5px" }}>
          Puja Altar Vrata Construction
        </span>
        {renderPujaAltar()}
      </div>

      {/* WORK AREA */}
      <div style={{ minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        {/* STEP 1: SELECT DAY */}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Choose the day of the week corresponding to the planet you wish to align with.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }} role="radiogroup" aria-label="Planetary Target Day">
              {DAYS_CONFIG.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDay(d.id)}
                  aria-pressed={d.id === selectedDayId}
                  className={`builder-btn ${d.id === selectedDayId ? "active" : ""}`}
                >
                  <div style={{ fontSize: "12px", fontWeight: 800 }}>{d.name}</div>
                  <div style={{ fontSize: "10px", opacity: 0.9 }}>{d.sanskrit}</div>
                  <div style={{ fontSize: "9px", color: INK_MUTED, marginTop: "2px" }}>{d.graha}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SELECT FASTING */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Select a safe, modified fasting discipline (safe default) as your physical purification restraint.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "8px" }} role="radiogroup" aria-label="Fasting Discipline">
              {[
                { name: "Fruit Fast", desc: "Eating only fresh fruits throughout the day. Milder, very safe." },
                { name: "Milk Fast", desc: "Taking only fresh milk. Nourishing and grounding." },
                { name: "Single Sattvic Meal Fast", desc: "Abstaining from grains until sunset, then taking a single light, pure vegetarian meal." }
              ].map((f) => (
                <button
                  key={f.name}
                  onClick={() => setFastType(f.name)}
                  aria-pressed={f.name === fastType}
                  className={`builder-btn ${f.name === fastType ? "active" : ""}`}
                  style={{ display: "flex", flexDirection: "column", gap: "4px" }}
                >
                  <strong style={{ fontSize: "12px" }}>{f.name}</strong>
                  <span style={{ fontSize: "10px", fontWeight: "normal", color: INK_SECONDARY }}>{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: SELECT WORSHIP (PUJA) */}
        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Choose a specific ritual pūjā or prayer dedicated to {currentDayConfig.graha}.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="radiogroup" aria-label="Devotional Puja">
              {currentDayConfig.pujas.map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPuja(p)}
                  aria-pressed={p === selectedPuja}
                  className={`builder-btn ${p === selectedPuja ? "active" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: SELECT CHARITY (DANA) */}
        {step === 4 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY }}>
              Select the matching dāna charity item to be distributed to appropriate recipients.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }} role="radiogroup" aria-label="Charity Item">
              <button
                onClick={() => setSelectedDana(currentDayConfig.danaItems)}
                aria-pressed={selectedDana === currentDayConfig.danaItems}
                className={`builder-btn ${selectedDana === currentDayConfig.danaItems ? "active" : ""}`}
              >
                {currentDayConfig.danaItems}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS SCREEN */}
        {step === 5 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            
            {/* THE PARCHMENT SCROLL CARD */}
            <div className="parchment-scroll">
              <div className="scroll-border">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px dashed rgba(156,122,47,0.25)", paddingBottom: "6px", marginBottom: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: GOLD_DEEP }}>
                    {currentDayConfig.name} {currentDayConfig.graha.split(" ")[0]} Vrata
                  </h4>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD }}>
                    {currentDayConfig.sanskrit} Vrata
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11.5px", textAlign: "left" }}>
                  <div>
                    <strong style={{ color: GOLD_DEEP }}>1. Upavāsa (Fasting Restraint):</strong>
                    <div style={{ marginLeft: "12px", color: INK_SECONDARY }}>{fastType}</div>
                  </div>
                  <div>
                    <strong style={{ color: GOLD_DEEP }}>2. Pūjā (Ritual Devotion):</strong>
                    <div style={{ marginLeft: "12px", color: INK_SECONDARY }}>{selectedPuja}</div>
                  </div>
                  <div>
                    <strong style={{ color: GOLD_DEEP }}>3. Dāna (Charity Offering):</strong>
                    <div style={{ marginLeft: "12px", color: INK_SECONDARY }}>{selectedDana}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* PEDAGOGICAL INSIGHT CARD */}
            <div style={{
              background: "rgba(78, 112, 55, 0.04)",
              border: "1px solid rgba(78, 112, 55, 0.2)",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              gap: "8px",
              alignItems: "flex-start"
            }} role="status">
              <Heart size={16} style={{ color: "#4e7037", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: "11px", color: "#4e7037" }}>The Kept Vow Principle (Kriyamāṇa)</strong>
                <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#344e24" }}>
                  An integrated vrata integrates three remedy categories into a single vow. The primary efficacy lies in the **integrity of keeping the commitment** (vow), which builds focus and calibrates present conduct (kriyamāṇa), rather than simply performing the physical ritual.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* FOOTER CONTROLS */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "10px"
      }}>
        {step > 1 && step < 5 ? (
          <button
            onClick={handlePrevStep}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "1px solid rgba(156,122,47,0.2)",
              background: "#ffffff",
              borderRadius: "6px",
              padding: "6px 12px",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              color: INK_SECONDARY
            }}
          >
            <ChevronLeft size={12} /> Back
          </button>
        ) : step === 5 ? (
          <button
            onClick={resetBuilder}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "none",
              background: GOLD_DEEP,
              color: "#ffffff",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "11px",
              fontWeight: 750,
              cursor: "pointer"
            }}
          >
            <RefreshCw size={10} /> Reset Vrata Builder
          </button>
        ) : (
          <div /> // Spacer
        )}

        {step < 5 && (
          <button
            onClick={handleNextStep}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              border: "none",
              background: GOLD_DEEP,
              color: "#ffffff",
              borderRadius: "6px",
              padding: "8px 14px",
              fontSize: "11px",
              fontWeight: 750,
              cursor: "pointer"
            }}
          >
            {step === 4 ? "Assemble Vrata" : "Next"} <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* TIER-1 ETHICAL BOUNDARY REMINDER */}
      <div style={{
        background: "rgba(173, 75, 55, 0.05)",
        border: "1.5px solid rgba(173, 75, 55, 0.25)",
        borderRadius: "12px",
        padding: "12px",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px"
      }}>
        <AlertOctagon size={16} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <span style={{ fontSize: "10.5px", fontWeight: 800, color: "#ad4b37", textTransform: "uppercase" }}>
            Devotional Remedy Warning
          </span>
          <p style={{ margin: "2px 0 0 0", fontSize: "10.5px", lineHeight: "1.4", color: "#762e21" }}>
            Pūjā and Vratas are devotional and faith-based practices. Astrologers must **never coerce** clients into religious rites. Under cross-cultural care guidelines (Lesson 4), always offer secular alternatives that carry the same intent.
          </p>
        </div>
      </div>
    </div>
  );
}
