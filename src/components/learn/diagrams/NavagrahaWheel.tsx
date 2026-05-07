"use client";

import React, { useState, useCallback } from "react";

// ─── Planet Data ──────────────────────────────────────────────
interface PlanetData {
  id: string;
  sanskrit: string;
  english: string;
  symbol: string;
  role: string;
  nature: "benefic" | "malefic" | "neutral";
  color: string;
  bgColor: string;
  ring: "center" | "luminary" | "visible" | "shadow";
  angle: number; // degrees around the ring
  karakatwas: string[];
  exaltation: string;
  debilitation: string;
  ownSigns: string[];
  description: string;
}

const PLANETS: PlanetData[] = [
  {
    id: "surya", sanskrit: "Surya", english: "Sun", symbol: "☉",
    role: "The King", nature: "malefic", color: "#E65100", bgColor: "#FFF3E0",
    ring: "center", angle: 0,
    karakatwas: ["Soul (Atma)", "Ego & Identity", "Father", "Authority & Government", "Vitality & Health", "Leadership"],
    exaltation: "Aries (Mesha) 10°", debilitation: "Libra (Tula) 10°",
    ownSigns: ["Leo (Simha)"],
    description: "The Sun is the King of the celestial cabinet — the source of all light, authority, and life force. It represents the soul (Atma), the core identity of a person."
  },
  {
    id: "chandra", sanskrit: "Chandra", english: "Moon", symbol: "☽",
    role: "The Queen", nature: "benefic", color: "#1565C0", bgColor: "#E3F2FD",
    ring: "luminary", angle: 180,
    karakatwas: ["Mind (Manas)", "Emotions", "Mother", "Nourishment", "Public Reception", "Intuition"],
    exaltation: "Taurus (Vrishabha) 3°", debilitation: "Scorpio (Vrishchika) 3°",
    ownSigns: ["Cancer (Karka)"],
    description: "The Moon is the Queen — governing the mind, emotions, and how we perceive the world. It's the most important planet for mental well-being and daily life."
  },
  {
    id: "mangala", sanskrit: "Mangala", english: "Mars", symbol: "♂",
    role: "The Commander", nature: "malefic", color: "#C62828", bgColor: "#FFEBEE",
    ring: "visible", angle: 200,
    karakatwas: ["Courage & Valor", "Logic & Analysis", "Siblings", "Real Estate", "Technology", "Physical Strength"],
    exaltation: "Capricorn (Makara) 28°", debilitation: "Cancer (Karka) 28°",
    ownSigns: ["Aries (Mesha)", "Scorpio (Vrishchika)"],
    description: "Mars is the Commander — the planet of action, courage, and execution. It drives ambition, physical energy, and the warrior instinct."
  },
  {
    id: "budha", sanskrit: "Budha", english: "Mercury", symbol: "☿",
    role: "The Prince", nature: "neutral", color: "#2E7D32", bgColor: "#E8F5E9",
    ring: "visible", angle: 272,
    karakatwas: ["Intellect", "Communication", "Commerce & Trade", "Speech", "Analytics", "Adaptability"],
    exaltation: "Virgo (Kanya) 15°", debilitation: "Pisces (Meena) 15°",
    ownSigns: ["Gemini (Mithuna)", "Virgo (Kanya)"],
    description: "Mercury is the Prince — young, curious, and highly adaptable. It governs intellect, speech, and the ability to process and communicate information."
  },
  {
    id: "guru", sanskrit: "Guru", english: "Jupiter", symbol: "♃",
    role: "The Teacher", nature: "benefic", color: "#E65100", bgColor: "#FFF8E1",
    ring: "visible", angle: 344,
    karakatwas: ["Wisdom & Knowledge", "Wealth & Prosperity", "Children", "Expansion", "Philosophy", "Divine Grace"],
    exaltation: "Cancer (Karka) 5°", debilitation: "Capricorn (Makara) 5°",
    ownSigns: ["Sagittarius (Dhanu)", "Pisces (Meena)"],
    description: "Jupiter is the Great Teacher (Guru) — the most benefic planet. It represents wisdom, wealth, expansion, and divine blessings. Where Jupiter sits, that area of life grows."
  },
  {
    id: "shukra", sanskrit: "Shukra", english: "Venus", symbol: "♀",
    role: "The Counselor", nature: "benefic", color: "#AD1457", bgColor: "#FCE4EC",
    ring: "visible", angle: 56,
    karakatwas: ["Relationships & Love", "Luxury & Comfort", "Art & Beauty", "Diplomacy", "Vehicles", "Sensual Pleasure"],
    exaltation: "Pisces (Meena) 27°", debilitation: "Virgo (Kanya) 27°",
    ownSigns: ["Taurus (Vrishabha)", "Libra (Tula)"],
    description: "Venus is the Royal Counselor — refined, diplomatic, and aesthetic. It governs all matters of love, beauty, luxury, and material comforts."
  },
  {
    id: "shani", sanskrit: "Shani", english: "Saturn", symbol: "♄",
    role: "The Judge", nature: "malefic", color: "#37474F", bgColor: "#ECEFF1",
    ring: "visible", angle: 128,
    karakatwas: ["Discipline & Structure", "Karma & Justice", "Delay & Patience", "Hard Work", "The Masses", "Longevity"],
    exaltation: "Libra (Tula) 20°", debilitation: "Aries (Mesha) 20°",
    ownSigns: ["Capricorn (Makara)", "Aquarius (Kumbha)"],
    description: "Saturn is the Judge — slow, methodical, and absolutely fair. It delivers karmic results through discipline, hard work, and patience. Delays are its signature tool."
  },
  {
    id: "rahu", sanskrit: "Rahu", english: "North Node", symbol: "☊",
    role: "The Rebel", nature: "malefic", color: "#4A148C", bgColor: "#F3E5F5",
    ring: "shadow", angle: 225,
    karakatwas: ["Obsession & Desire", "Illusion (Maya)", "Foreign Connections", "Amplification", "Unconventional Methods", "Material Ambition"],
    exaltation: "Taurus/Gemini", debilitation: "Scorpio/Sagittarius",
    ownSigns: ["(No own sign — co-lords debated)"],
    description: "Rahu is the Rebel — the North Lunar Node. It amplifies whatever it touches, creates obsessive desires, and pulls toward uncharted territory. It's the mathematical point where eclipses begin."
  },
  {
    id: "ketu", sanskrit: "Ketu", english: "South Node", symbol: "☋",
    role: "The Monk", nature: "malefic", color: "#795548", bgColor: "#EFEBE9",
    ring: "shadow", angle: 315,
    karakatwas: ["Detachment & Liberation", "Past-Life Mastery", "Spirituality", "Sudden Events", "Isolation", "Mysticism"],
    exaltation: "Scorpio/Sagittarius", debilitation: "Taurus/Gemini",
    ownSigns: ["(No own sign — co-lords debated)"],
    description: "Ketu is the Monk — the South Lunar Node. It detaches, spiritualizes, and strips away material attachment. It represents past-life mastery and sudden, unexpected events."
  },
];

// ─── Ring configuration ─── (wider spacing to prevent overlaps)
const RING_RADII = {
  center: 0,
  luminary: 90,
  visible: 190,
  shadow: 275,
};

interface NavagrahaWheelProps {
  size?: number;
}

export default function NavagrahaWheel({ size = 660 }: NavagrahaWheelProps) {
  const [selected, setSelected] = useState<PlanetData | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 660;

  const getPlanetPosition = useCallback((planet: PlanetData) => {
    if (planet.ring === "center") return { x: cx, y: cy };
    const r = RING_RADII[planet.ring] * scale;
    const rad = (planet.angle - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }, [cx, cy, scale]);

  const planetRadius = 22 * scale;
  const centerRadius = 30 * scale;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title — above SVG */}
      <div className="text-center mb-2">
        <h3 className="text-xl font-extrabold text-amber-900 tracking-tight">The Solar Court</h3>
        <p className="text-xs text-amber-600">Click any planet to explore its role, significations & dignity</p>
      </div>

      {/* Ring Legend — below title, above wheel */}
      <div className="flex items-center gap-4 mb-3 text-[10px] font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-amber-400 rounded" /> <span className="text-amber-600">Luminaries</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-orange-300 rounded" /> <span className="text-orange-500">Visible Planets</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-[2px] bg-purple-400 rounded border-b border-dashed border-purple-400" /> <span className="text-purple-600">Shadow Nodes</span>
        </span>
      </div>

      {/* SVG Wheel */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[660px] h-auto"
        role="img"
        aria-label="Navagraha Solar Court Diagram"
      >
        <defs>
          <filter id="nv-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="nv-sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD54F" />
            <stop offset="60%" stopColor="#FF8F00" />
            <stop offset="100%" stopColor="#E65100" />
          </radialGradient>
          <radialGradient id="nv-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDE7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FFF8E1" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background */}
        <circle cx={cx} cy={cy} r={cx - 5} fill="url(#nv-bg)" />

        {/* ─── Orbit Rings ─── */}
        <circle cx={cx} cy={cy} r={RING_RADII.luminary * scale}
          fill="none" stroke="#FFA726" strokeWidth={1} strokeOpacity={0.35} />
        <circle cx={cx} cy={cy} r={RING_RADII.visible * scale}
          fill="none" stroke="#FFB74D" strokeWidth={1.2} strokeOpacity={0.25} />
        <circle cx={cx} cy={cy} r={RING_RADII.shadow * scale}
          fill="none" stroke="#9C27B0" strokeWidth={1.2} strokeOpacity={0.2}
          strokeDasharray="8 6" />

        {/* ─── Connection Lines ─── */}
        {PLANETS.filter(p => p.ring !== "center").map((planet) => {
          const pos = getPlanetPosition(planet);
          return (
            <line
              key={`line-${planet.id}`}
              x1={cx} y1={cy} x2={pos.x} y2={pos.y}
              stroke={planet.color}
              strokeWidth={0.6}
              strokeOpacity={selected?.id === planet.id ? 0.35 : 0.06}
              strokeDasharray={planet.ring === "shadow" ? "4 4" : "none"}
            />
          );
        })}

        {/* ─── Planet Nodes ─── */}
        {PLANETS.map((planet) => {
          const pos = getPlanetPosition(planet);
          const isCenter = planet.ring === "center";
          const r = isCenter ? centerRadius : planetRadius;
          const isSelected = selected?.id === planet.id;
          const isShadow = planet.ring === "shadow";

          // Labels position: above or below depending on angle
          const angleRad = (planet.angle - 90) * (Math.PI / 180);
          const isTopHalf = Math.sin(angleRad) < 0;
          const labelDir = isCenter ? 1 : (isTopHalf ? -1 : 1);
          const labelBase = isCenter
            ? pos.y + r + 6 * scale
            : (isTopHalf ? pos.y - r - 32 * scale : pos.y + r + 10 * scale);

          return (
            <g
              key={planet.id}
              onClick={() => setSelected(isSelected ? null : planet)}
              className="cursor-pointer"
              role="button"
              aria-label={`${planet.sanskrit} (${planet.english}) — ${planet.role}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(isSelected ? null : planet);
                }
              }}
            >
              {/* Selection pulse */}
              {isSelected && (
                <circle
                  cx={pos.x} cy={pos.y} r={r + 5}
                  fill="none" stroke={planet.color} strokeWidth={2}
                  opacity={0.6} filter="url(#nv-glow)"
                >
                  <animate attributeName="r" values={`${r + 4};${r + 8};${r + 4}`} dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Planet body */}
              {isCenter ? (
                <circle cx={pos.x} cy={pos.y} r={r}
                  fill="url(#nv-sun-grad)" stroke="#E65100" strokeWidth={2} />
              ) : (
                <circle cx={pos.x} cy={pos.y} r={r}
                  fill={planet.bgColor} stroke={planet.color}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  strokeDasharray={isShadow ? "4 3" : "none"}
                  opacity={isSelected ? 1 : 0.92} />
              )}

              {/* Symbol inside circle */}
              <text
                x={pos.x} y={pos.y}
                textAnchor="middle" dominantBaseline="central"
                fontSize={isCenter ? 18 * scale : 14 * scale}
                fill={isCenter ? "#FFF" : planet.color}
                fontWeight="bold"
              >
                {planet.symbol}
              </text>

              {/* Nature dot */}
              {!isCenter && (
                <circle
                  cx={pos.x + r - 2} cy={pos.y - r + 2} r={3.5 * scale}
                  fill={planet.nature === "benefic" ? "#4CAF50" : planet.nature === "malefic" ? "#F44336" : "#9E9E9E"}
                  stroke="#fff" strokeWidth={1.5}
                />
              )}

              {/* Labels — positioned above or below to avoid overlaps */}
              <text
                x={pos.x} y={labelBase}
                textAnchor="middle"
                fontSize={isCenter ? 10 * scale : 9 * scale}
                fontWeight="800"
                fill={planet.color}
              >
                {planet.sanskrit}
              </text>
              <text
                x={pos.x} y={labelBase + 10 * scale * labelDir}
                textAnchor="middle"
                fontSize={7.5 * scale}
                fill="#666"
              >
                {planet.english}
              </text>
              {!isCenter && (
                <text
                  x={pos.x} y={labelBase + 20 * scale * labelDir}
                  textAnchor="middle"
                  fontSize={7 * scale}
                  fontWeight="600"
                  fontStyle="italic"
                  fill={planet.nature === "benefic" ? "#2E7D32" : planet.nature === "malefic" ? "#C62828" : "#757575"}
                >
                  {planet.role}
                </text>
              )}
              {isCenter && (
                <text
                  x={pos.x} y={labelBase + 10 * scale}
                  textAnchor="middle"
                  fontSize={7 * scale}
                  fontWeight="600"
                  fill="#BF360C"
                >
                  The King · Soul
                </text>
              )}
            </g>
          );
        })}

        {/* ─── Bottom Legend ─── */}
        <g transform={`translate(${cx - 75 * scale}, ${size - 18 * scale})`}>
          <circle cx={0} cy={0} r={3.5 * scale} fill="#4CAF50" />
          <text x={7 * scale} y={3 * scale} fontSize={8 * scale} fill="#4CAF50" fontWeight="600">Benefic</text>
          <circle cx={55 * scale} cy={0} r={3.5 * scale} fill="#F44336" />
          <text x={62 * scale} y={3 * scale} fontSize={8 * scale} fill="#F44336" fontWeight="600">Malefic</text>
          <circle cx={118 * scale} cy={0} r={3.5 * scale} fill="#9E9E9E" />
          <text x={125 * scale} y={3 * scale} fontSize={8 * scale} fill="#9E9E9E" fontWeight="600">Neutral</text>
        </g>
      </svg>

      {/* ─── Detail Panel ─── */}
      {selected && (
        <div
          className="mt-4 w-full max-w-[660px] rounded-2xl border-2 overflow-hidden shadow-lg animate-in slide-in-from-bottom-4 duration-300"
          style={{ borderColor: selected.color + "40", backgroundColor: selected.bgColor }}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${selected.color}15, ${selected.color}08)` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold border-2"
              style={{ borderColor: selected.color, color: selected.color, backgroundColor: selected.bgColor }}
            >
              {selected.symbol}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold" style={{ color: selected.color }}>
                  {selected.sanskrit} ({selected.english})
                </h3>
                <span
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                  style={{
                    color: selected.nature === "benefic" ? "#2E7D32" : selected.nature === "malefic" ? "#C62828" : "#757575",
                    borderColor: selected.nature === "benefic" ? "#A5D6A7" : selected.nature === "malefic" ? "#EF9A9A" : "#E0E0E0",
                    backgroundColor: selected.nature === "benefic" ? "#E8F5E9" : selected.nature === "malefic" ? "#FFEBEE" : "#F5F5F5",
                  }}
                >
                  {selected.nature}
                </span>
              </div>
              <p className="text-sm font-medium" style={{ color: selected.color + "CC" }}>
                {selected.role}
              </p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-colors"
              aria-label="Close detail panel"
            >
              ✕
            </button>
          </div>

          {/* Description */}
          <div className="px-4 pb-3">
            <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
          </div>

          {/* Karakatwas */}
          <div className="px-4 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: selected.color }}>
              Karakatwas (Significations)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selected.karakatwas.map((k, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-full font-medium border"
                  style={{ color: selected.color, borderColor: selected.color + "30", backgroundColor: selected.color + "08" }}
                >
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Dignity */}
          <div className="px-4 pb-4 grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100">
              <div className="text-[10px] font-bold text-green-700 uppercase tracking-wide mb-0.5">Exaltation</div>
              <div className="text-xs font-semibold text-gray-800">{selected.exaltation}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100">
              <div className="text-[10px] font-bold text-red-700 uppercase tracking-wide mb-0.5">Debilitation</div>
              <div className="text-xs font-semibold text-gray-800">{selected.debilitation}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-white/70 border border-gray-100">
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-0.5">Own Sign(s)</div>
              <div className="text-xs font-semibold text-gray-800">{selected.ownSigns.join(", ")}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
