"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { ink, goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

interface Loanword {
  term: string;
  sanskrit: string;
  source: string;
  arabic: string;
  meaning: string;
  description: string;
  mechanismText: string;
}

const LOANWORDS: Loanword[] = [
  {
    term: "Ithaśāla & Iśrāphā",
    sanskrit: "इत्थशाल और ईश्राफा",
    source: "Arabic: ittiṣāl & iṣrāf",
    arabic: "إtṣāl / iṣrāf",
    meaning: "Application vs Separation",
    description: "Ithaśāla occurs when a faster planet (e.g. Moon) is behind a slower planet (e.g. Mars) within aspect range and is catching up. Once the Moon passes the exact degree, it becomes Iśrāphā (Separation).",
    mechanismText: "Drag the Moon Degree slider. Watch the aspect shift from applying (Gold line) to exact, then separating (Red dashed line) as the degree passes Mars.",
  },
  {
    term: "Munthā",
    sanskrit: "मुन्था",
    source: "Arabic: muntahā",
    arabic: "muntahā",
    meaning: "Culmination / Progressed Point",
    description: "A sensitive point that starts at the natal Ascendant and progresses exactly one sign/house per year of the native's life, highlighting the active issues of that year.",
    mechanismText: "Drag the age slider to see the Munthā progress through the 12 chart houses. It resets every 12 years (e.g., age 12, 24, 36).",
  },
  {
    term: "Sahama",
    sanskrit: "सहम",
    source: "Arabic: sahm",
    arabic: "sahm",
    meaning: "Arrow / Lot",
    description: "Algebraic points calculated by taking the longitude of the Ascendant plus the distance between two planets: Ascendant + Moon - Sun = Saham.",
    mechanismText: "Observe the coordinate addition on the chart. The arc distance between the Sun and Moon is projected from the Ascendant to calculate the Saham house.",
  },
  {
    term: "Kambūla",
    sanskrit: "कम्बूल",
    source: "Arabic: qabūl",
    arabic: "qabūl",
    meaning: "Reception / Acceptance",
    description: "Occurs when an aspecting planet is situated in the sign/house ruled by the planet it aspects (mutual reception), which facilitates the prediction's success.",
    mechanismText: "Mars is in Leo (ruled by Sun) and Sun is in Scorpio (ruled by Mars). The double-headed arrow highlights their mutual reception.",
  },
];

// Exact centroids/centers for the East Indian Square Chart (220x220 container, x: 10-230, y: 10-230)
const HOUSE_CENTROIDS: Record<number, { x: number; y: number }> = {
  1: { x: 120, y: 65 },
  2: { x: 65, y: 28.33 },
  3: { x: 28.33, y: 65 },
  4: { x: 65, y: 120 },
  5: { x: 28.33, y: 175 },
  6: { x: 65, y: 211.67 },
  7: { x: 120, y: 175 },
  8: { x: 175, y: 211.67 },
  9: { x: 211.67, y: 175 },
  10: { x: 175, y: 120 },
  11: { x: 211.67, y: 65 },
  12: { x: 175, y: 28.33 }
};

// Perfect corner/apex coordinates for house labels to avoid overlaps with centered planets
const PERFECT_LABEL_POS: Record<number, { x: number; y: number }> = {
  1: { x: 120, y: 32 },
  2: { x: 42, y: 22 },
  3: { x: 22, y: 42 },
  4: { x: 32, y: 120 },
  5: { x: 22, y: 198 },
  6: { x: 42, y: 218 },
  7: { x: 120, y: 208 },
  8: { x: 198, y: 218 },
  9: { x: 218, y: 198 },
  10: { x: 208, y: 120 },
  11: { x: 218, y: 42 },
  12: { x: 198, y: 22 }
};

// Get house label position (permanently located at outer corners)
const getHouseLabelPos = (houseNum: number, _hasPlanet: boolean) => {
  return PERFECT_LABEL_POS[houseNum] || HOUSE_CENTROIDS[houseNum];
};

// Get planet node center coordinate (always centered exactly in the house centroid)
const getPlanetPos = (houseNum: number) => {
  return HOUSE_CENTROIDS[houseNum];
};


export function TajikaLoanwordTranslator() {
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);
  const [moonDeg, setMoonDeg] = useState<number>(8); // Moon degree for Ithasala (Mars is fixed at 12)
  const [age, setAge] = useState<number>(25); // Age for Muntha (25 -> house 1)

  const activeWord = LOANWORDS[activeWordIdx];

  // Calculations for Ithasala / Israpha
  const marsDeg = 12;
  const aspectDiff = marsDeg - moonDeg;
  const isIthasala = aspectDiff > 0;
  const isExact = aspectDiff === 0;
  const isIsrapha = aspectDiff < 0;

  // Calculation for Muntha house
  const munthaHouse = ((age - 1) % 12) + 1;

  // Helper to check if a house has a planet/marker in the current mode
  const hasPlanetInHouse = (houseNum: number) => {
    if (activeWord.term === "Ithaśāla & Iśrāphā") {
      return houseNum === 1 || houseNum === 5;
    }
    if (activeWord.term === "Munthā") {
      return houseNum === munthaHouse;
    }
    if (activeWord.term === "Sahama") {
      return houseNum === 1 || houseNum === 2 || houseNum === 10 || houseNum === 5;
    }
    if (activeWord.term === "Kambūla") {
      return houseNum === 5 || houseNum === 9;
    }
    return false;
  };

  return (
    <div
      className="gl-surface-twilight-glass w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
              Terminology & Mechanics
            </p>
          </div>
          <h2 className="mt-1 m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Tājika Loanword Translator & Visualizer
          </h2>
          <p className="mt-1 m-0 text-xs text-stone-600" style={{ color: INK_SECONDARY }}>
            Translate Sanskrit Tājika terms back to their Arabic roots and inspect their mathematical structures on a live chart board.
          </p>
        </div>
      </div>

      {/* Loanwords selectors */}
      <div className="flex flex-wrap gap-1 bg-stone-100 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {LOANWORDS.map((w, idx) => (
          <button
            key={w.term}
            onClick={() => setActiveWordIdx(idx)}
            className="flex-1 min-w-[110px] py-2 px-3 rounded-lg border text-center transition-all flex flex-col items-center justify-center hover:bg-white/50"
            style={{
              background: activeWordIdx === idx ? SURFACE : "transparent",
              borderColor: activeWordIdx === idx ? GOLD : "transparent",
            }}
          >
            <span className="text-xs font-bold" style={{ color: activeWordIdx === idx ? INK_PRIMARY : INK_SECONDARY }}>
              {w.term}
            </span>
            <span className="text-[10px] font-devanagari" style={{ color: GOLD }}>
              {w.sanskrit}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-stretch">
        
        {/* Animated mechanics visualizer */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Interactive Chart Drawing
              </span>
              <span className="text-[10px] text-stone-500 italic">
                {activeWord.mechanismText}
              </span>
            </div>

            {/* East Indian Square Chart (Daylight Parchment theme, matching the rest of the app) */}
            <div className="flex justify-center rounded-xl p-4 my-4 relative overflow-hidden border" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
              <svg viewBox="0 0 240 240" className="w-full max-w-[220px] h-auto block">
                {/* Main Outer Box */}
                <rect x="10" y="10" width="220" height="220" fill="none" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />
                
                {/* Diagonal lines crossing (standard Diamond chart) */}
                <line x1="10" y1="10" x2="230" y2="230" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />
                <line x1="230" y1="10" x2="10" y2="230" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />
                
                {/* Inner diamond box lines */}
                <line x1="120" y1="10" x2="10" y2="120" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />
                <line x1="10" y1="120" x2="120" y2="230" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />
                <line x1="120" y1="230" x2="230" y2="120" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />
                <line x1="230" y1="120" x2="120" y2="10" stroke="rgba(168, 130, 30, 0.35)" strokeWidth="1.5" />

                {/* House numbering labels (rendered at exact centroids, or stacked if planet is present) */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
                  const hasP = hasPlanetInHouse(h);
                  const pos = getHouseLabelPos(h, hasP);
                  return (
                    <text
                      key={h}
                      x={pos.x}
                      y={pos.y + 3}
                      textAnchor="middle"
                      fill="rgba(168, 130, 30, 0.4)"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      H{h}
                    </text>
                  );
                })}

                {/* 1. Ithasala & Israpha Visualization */}
                {activeWord.term === "Ithaśāla & Iśrāphā" && (
                  <>
                    {/* Fast Planet (Moon) placed at custom offset H1 position */}
                    {(() => {
                      const pos = getPlanetPos(1);
                      return (
                        <g transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle cx="0" cy="0" r="14" fill="#E3F2FD" stroke="#1565C0" strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#0D47A1" fontSize="9" fontWeight="bold">Ch</text>
                          <text x="0" y="-18" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="bold">Moon {moonDeg}°</text>
                        </g>
                      );
                    })()}
                    
                    {/* Slow Planet (Mars) placed at custom offset H5 position */}
                    {(() => {
                      const pos = getPlanetPos(5);
                      return (
                        <g transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle cx="0" cy="0" r="14" fill="#FFEBEE" stroke="#C8412E" strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#B71C1C" fontSize="9" fontWeight="bold">Ma</text>
                          <text x="0" y="22" textAnchor="middle" fill={INK_SECONDARY} fontSize="8" fontWeight="bold">Mars 12°</text>
                        </g>
                      );
                    })()}
                    
                    {/* Aspect Line between Moon and Mars nodes */}
                    {(() => {
                      const p1 = getPlanetPos(1);
                      const p5 = getPlanetPos(5);
                      return (
                        <line
                          x1={p1.x}
                          y1={p1.y}
                          x2={p5.x}
                          y2={p5.y}
                          stroke={isIthasala ? GOLD : isExact ? GREEN : VERMILION}
                          strokeWidth={isExact ? 3.0 : 1.8}
                          strokeDasharray={isIsrapha ? "3 3" : "none"}
                        />
                      );
                    })()}
                    
                    {/* Aspect State HUD */}
                    <rect x="70" y="110" width="100" height="20" rx="4" fill={SURFACE} stroke={GOLD} strokeWidth="1" />
                    <text x="120" y="123" textAnchor="middle" fill={isIthasala ? GOLD : isExact ? GREEN : VERMILION} fontSize="8" fontWeight="bold">
                      {isIthasala ? "Applying (Ithaśāla)" : isExact ? "Exact Aspect!" : "Separating (Iśrāphā)"}
                    </text>
                  </>
                )}

                {/* 2. Munthā Visualization */}
                {activeWord.term === "Munthā" && (
                  <>
                    {/* Draw Muntha marker in offset house position */}
                    {(() => {
                      const pos = getPlanetPos(munthaHouse);
                      return (
                        <g>
                          <circle cx={pos.x} cy={pos.y} r="14" fill="#FFE082" stroke={GOLD} strokeWidth="1.5" />
                          <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="#5D4037" fontSize="11" fontWeight="bold">M</text>
                          
                          {/* HUD information box */}
                          <rect x="75" y="105" width="90" height="30" rx="4" fill={SURFACE} stroke={GOLD} strokeWidth="1" />
                          <text x="120" y="117" textAnchor="middle" fill={INK_PRIMARY} fontSize="8" fontWeight="bold">Age: {age} Years</text>
                          <text x="120" y="128" textAnchor="middle" fill={GOLD} fontSize="8" fontWeight="bold">Munthā in H{munthaHouse}</text>
                        </g>
                      );
                    })()}
                  </>
                )}

                {/* 3. Sahama (Lot) Visualization */}
                {activeWord.term === "Sahama" && (
                  <>
                    {/* Ascendant at H1 planet position */}
                    {(() => {
                      const pos = getPlanetPos(1);
                      return (
                        <g>
                          <circle cx={pos.x} cy={pos.y} r="10" fill={SURFACE} stroke={GOLD} strokeWidth="1" />
                          <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="bold">Asc</text>
                        </g>
                      );
                    })()}
                    
                    {/* Sun at H10 planet position */}
                    {(() => {
                      const pos = getPlanetPos(10);
                      return (
                        <g>
                          <circle cx={pos.x} cy={pos.y} r="10" fill="#FFFDE7" stroke="#E65100" strokeWidth="1" />
                          <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#E65100" fontSize="7" fontWeight="bold">Su</text>
                        </g>
                      );
                    })()}

                    {/* Moon at H2 planet position */}
                    {(() => {
                      const pos = getPlanetPos(2);
                      return (
                        <g>
                          <circle cx={pos.x} cy={pos.y} r="10" fill="#E3F2FD" stroke="#0D47A1" strokeWidth="1" />
                          <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill="#0D47A1" fontSize="7" fontWeight="bold">Mo</text>
                        </g>
                      );
                    })()}

                    {/* Result Saham at H5 planet position */}
                    {(() => {
                      const pos = getPlanetPos(5);
                      return (
                        <g>
                          <circle cx={pos.x} cy={pos.y} r="12" fill="#FFEBEE" stroke={VERMILION} strokeWidth="1.5" />
                          <text x={pos.x} y={pos.y + 3} textAnchor="middle" fill={VERMILION} fontSize="8" fontWeight="bold">S</text>
                        </g>
                      );
                    })()}

                    {/* Formula hud */}
                    <rect x="50" y="95" width="140" height="48" rx="4" fill={SURFACE} stroke={GOLD} strokeWidth="1.2" />
                    <text x="120" y="108" textAnchor="middle" fill={GOLD} fontSize="9" fontWeight="bold">Punya Sahama (Fortune)</text>
                    <text x="120" y="121" textAnchor="middle" fill={INK_PRIMARY} fontSize="8" fontFamily="monospace" fontWeight="bold">Asc + Mo - Su = Saham</text>
                    <text x="120" y="133" textAnchor="middle" fill={GREEN} fontSize="8" fontWeight="bold">Placed in 5th House (S)</text>
                  </>
                )}

                {/* 4. Kambula Reception Visualization */}
                {activeWord.term === "Kambūla" && (
                  <>
                    {/* Mars placed at offset H5 position */}
                    {(() => {
                      const pos = getPlanetPos(5);
                      return (
                        <g transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle cx="0" cy="0" r="14" fill="#FFEBEE" stroke="#C8412E" strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#B71C1C" fontSize="8" fontWeight="bold">Ma</text>
                          <text x="0" y="24" textAnchor="middle" fill={INK_SECONDARY} fontSize="7" fontWeight="bold">In Leo (Sun)</text>
                        </g>
                      );
                    })()}

                    {/* Sun placed at offset H9 position */}
                    {(() => {
                      const pos = getPlanetPos(9);
                      return (
                        <g transform={`translate(${pos.x}, ${pos.y})`}>
                          <circle cx="0" cy="0" r="14" fill="#FFFDE7" stroke="#E65100" strokeWidth="1.5" />
                          <text x="0" y="3" textAnchor="middle" fill="#5D4037" fontSize="8" fontWeight="bold">Su</text>
                          <text x="0" y="24" textAnchor="middle" fill={INK_SECONDARY} fontSize="7" fontWeight="bold">In Sco (Mars)</text>
                        </g>
                      );
                    })()}

                    {/* Mutual reception arrow between Mars and Sun node positions */}
                    {(() => {
                      const p5 = getPlanetPos(5);
                      const p9 = getPlanetPos(9);
                      return (
                        <path
                          d={`M ${p5.x + 14} ${p5.y} C 100 135, 140 135, ${p9.x - 14} ${p9.y}`}
                          fill="none"
                          stroke={GREEN}
                          strokeWidth="2.2"
                          strokeDasharray="4 2"
                        />
                      );
                    })()}

                    {/* Description card */}
                    <rect x="60" y="95" width="120" height="38" rx="4" fill={SURFACE} stroke={GOLD} strokeWidth="1" />
                    <text x="120" y="108" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="bold">Mutual Reception</text>
                    <text x="120" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="7" fontWeight="500">Mars rules Scorpio · Sun rules Leo</text>
                    <text x="120" y="128" textAnchor="middle" fill={GOLD} fontSize="7" fontWeight="bold">Kambūla accepts aspect fruit</text>
                  </>
                )}
              </svg>
            </div>

            {/* Sub-controls for sliders */}
            {activeWord.term === "Ithaśāla & Iśrāphā" && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Modulate Moon Degree:</span>
                  <span style={{ color: GOLD }}>Moon Longitude: {moonDeg}°</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="22"
                  value={moonDeg}
                  onChange={(e) => setMoonDeg(Number(e.target.value))}
                  className="w-full h-1 appearance-none cursor-pointer bg-stone-300 rounded-lg animate-fadeIn"
                  style={{ accentColor: GOLD }}
                />
              </div>
            )}

            {activeWord.term === "Munthā" && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Modulate Native Age:</span>
                  <span style={{ color: GOLD }}>Age: {age} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full h-1 appearance-none cursor-pointer bg-stone-300 rounded-lg animate-fadeIn"
                  style={{ accentColor: GOLD }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Text Details & Translations */}
        <div className="flex flex-col justify-between gap-4">
          <div className="rounded-xl p-5 border flex-1" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-100" style={{ color: GOLD }}>
              Etymology Mapping
            </span>
            <h3 className="mt-2.5 m-0 text-base font-bold" style={{ color: INK_PRIMARY }}>
              {activeWord.term}
            </h3>
            <div className="flex gap-2 items-baseline text-xs italic mt-1" style={{ color: GOLD }}>
              <span className="font-devanagari font-normal">{activeWord.sanskrit}</span>
              <span>—</span>
              <span>{activeWord.source}</span>
            </div>

            <div style={{ height: "1px", background: `${GOLD}22`, margin: "14px 0" }} />

            <div className="space-y-3">
              <div>
                <span className="text-[10px] block font-bold text-stone-500 uppercase">Arabic Source Term</span>
                <span className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>{activeWord.arabic} ({activeWord.source.split(": ")[1]})</span>
              </div>
              <div>
                <span className="text-[10px] block font-bold text-stone-500 uppercase">Astrological Translation</span>
                <span className="text-xs font-semibold" style={{ color: INK_PRIMARY }}>{activeWord.meaning}</span>
              </div>
              <div>
                <span className="text-[10px] block font-bold text-stone-500 uppercase">Conceptual Definition</span>
                <p className="m-0 mt-0.5 text-xs leading-normal" style={{ color: INK_SECONDARY }}>
                  {activeWord.description}
                </p>
              </div>
            </div>
          </div>

          {/* Two-layer holding prompt */}
          <div className="rounded-xl p-4 border flex flex-col gap-1 bg-stone-50 text-xs shadow-sm" style={{
            background: SURFACE,
            borderColor: HAIRLINE,
          }}>
            <div className="flex items-center gap-1.5 font-bold" style={{ color: GOLD }}>
              <Compass size={13} />
              <span>Two-Layer Holding Audit</span>
            </div>
            <p className="m-0 text-[11px] leading-normal" style={{ color: INK_SECONDARY }}>
              Preserve Tājika's Vedic legitimacy (Layer 1) while acknowledging its Persian-Arabic linguistic fingerprint (Layer 2) as a beautiful, integrated synthesis.
            </p>
            <button
              onClick={() => {
                const nextIdx = (activeWordIdx + 1) % LOANWORDS.length;
                setActiveWordIdx(nextIdx);
              }}
              className="mt-2 w-full inline-flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold text-white uppercase tracking-wider active:scale-95"
              style={{ background: GOLD }}
            >
              Next Term
              <ArrowRight size={10} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
