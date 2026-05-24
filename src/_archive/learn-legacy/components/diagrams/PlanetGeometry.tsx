"use client";

import React, { useState } from "react";
import { Shapes } from "lucide-react";

interface GeoData {
  planet: string;
  symbol: string;
  color: string;
  shape: string;
  element: string;
  meaning: string;
}

const GEOS: GeoData[] = [
  { planet: "Sun", symbol: "Su", color: "#f59e0b", shape: "circle", element: "Fire", meaning: "Bindu — the center point. Wholeness, core identity, radiance." },
  { planet: "Moon", symbol: "Mo", color: "#94a3b8", shape: "crescent", element: "Water", meaning: "Crescent and flowing waves. Reflection, emotion, receptivity." },
  { planet: "Mars", symbol: "Ma", color: "#ef4444", shape: "triangle", element: "Fire", meaning: "Upward triangle. Directional force, penetration, defense." },
  { planet: "Mercury", symbol: "Me", color: "#22c55e", shape: "arrow", element: "Earth/Air", meaning: "Arrow or interlocking polygons. Networking, pathways, intellect." },
  { planet: "Jupiter", symbol: "Ju", color: "#f97316", shape: "square", element: "Ether", meaning: "Expanding squares and upward triangles. Expansion, foundation, wisdom." },
  { planet: "Venus", symbol: "Ve", color: "#a855f7", shape: "hexagram", element: "Water", meaning: "Hexagram (Vesica Piscis) or Lotus. Perfect symmetry, union of opposites." },
  { planet: "Saturn", symbol: "Sa", color: "#475569", shape: "cross", element: "Air", meaning: "Square, cross, or labyrinth. Structure, boundaries, restriction." },
];

function ShapeSVG({ shape, color, size = 80 }: { shape: string; color: string; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.35;

  switch (shape) {
    case "circle":
      return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3" />;
    case "crescent":
      return (
        <g>
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r * 0.7} ${r * 0.7} 0 1 0 ${cx - r} ${cy}`} fill="none" stroke={color} strokeWidth="3" />
        </g>
      );
    case "triangle":
      return <polygon points={`${cx},${cy - r} ${cx - r * 0.866},${cy + r * 0.5} ${cx + r * 0.866},${cy + r * 0.5}`} fill="none" stroke={color} strokeWidth="3" />;
    case "arrow":
      return (
        <g>
          <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={color} strokeWidth="3" strokeLinecap="round" />
          <polygon points={`${cx + r},${cy} ${cx + r - 10},${cy - 7} ${cx + r - 10},${cy + 7}`} fill={color} />
        </g>
      );
    case "square":
      return <rect x={cx - r * 0.7} y={cy - r * 0.7} width={r * 1.4} height={r * 1.4} fill="none" stroke={color} strokeWidth="3" />;
    case "hexagram":
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = (i * 60 - 90) * Math.PI / 180;
        pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
      }
      return (
        <g>
          <polygon points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" />
          <polygon points={pts.slice(3).concat(pts.slice(0, 3)).join(" ")} fill="none" stroke={color} strokeWidth="2.5" />
        </g>
      );
    case "cross":
      return (
        <g>
          <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke={color} strokeWidth="3" strokeLinecap="round" />
          <line x1={cx - r * 0.6} y1={cy} x2={cx + r * 0.6} y2={cy} stroke={color} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    default:
      return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="3" />;
  }
}

export default function PlanetGeometry({ size = 640 }: { size?: number }) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="relative w-full max-w-[680px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 via-gray-50/30 to-zinc-50/10 border border-slate-200/40 shadow-2xl shadow-slate-900/5 p-6 sm:p-8">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-gray-700">
            Planetary Geometric Primitives
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-medium">
            Each planet governs a sacred geometric shape based on its elemental nature
          </p>
        </div>

        {/* Geometry grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {GEOS.map((g, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className={`p-3 rounded-2xl border text-center transition-all duration-200 ${isSelected ? "shadow-md" : "hover:shadow-sm"}`}
                style={{
                  background: isSelected ? `${g.color}08` : "#fff",
                  borderColor: isSelected ? g.color : "#e2e8f0",
                }}
              >
                <div className="w-16 h-16 mx-auto mb-2">
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <ShapeSVG shape={g.shape} color={g.color} size={80} />
                  </svg>
                </div>
                <div className="text-xs font-extrabold" style={{ color: g.color }}>{g.planet}</div>
                <div className="text-[9px] text-gray-400 font-bold uppercase">{g.shape}</div>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        {selected !== null && (() => {
          const g = GEOS[selected];
          return (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12">
                  <svg viewBox="0 0 80 80" className="w-full h-full">
                    <ShapeSVG shape={g.shape} color={g.color} size={80} />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-extrabold text-gray-900">{g.planet}</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: g.color }}>{g.element} — {g.shape}</div>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{g.meaning}</p>
            </div>
          );
        })()}

        {!selected && (
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
            <Shapes className="w-5 h-5 text-slate-400 mx-auto mb-1" />
            <p className="text-sm text-gray-500">Tap any shape to explore its planetary meaning and elemental nature.</p>
          </div>
        )}
      </div>
    </div>
  );
}
