"use client";

import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface HouseInfo { num: number; sanskrit: string; meaning: string; keywords: string[]; }

const HOUSES: HouseInfo[] = [
  { num: 1,  sanskrit: "Tanu",    meaning: "Body / Self",       keywords: ["Personality", "Physical body", "Lagna", "Life path"] },
  { num: 2,  sanskrit: "Dhana",   meaning: "Wealth",            keywords: ["Money", "Family", "Speech", "Food"] },
  { num: 3,  sanskrit: "Sahaja",  meaning: "Siblings",          keywords: ["Courage", "Younger siblings", "Communication", "Skills"] },
  { num: 4,  sanskrit: "Bandhu",  meaning: "Home / Mother",     keywords: ["Mother", "Property", "Vehicle", "Happiness"] },
  { num: 5,  sanskrit: "Putra",   meaning: "Children",          keywords: ["Children", "Intelligence", "Speculation", "Mantra"] },
  { num: 6,  sanskrit: "Ari",     meaning: "Enemies / Disease", keywords: ["Disease", "Debt", "Enemies", "Service"] },
  { num: 7,  sanskrit: "Yuvati",  meaning: "Spouse",            keywords: ["Marriage", "Partnership", "Business", "Foreign lands"] },
  { num: 8,  sanskrit: "Randhra", meaning: "Death / Occult",    keywords: ["Longevity", "Occult", "Sudden events", "Inheritance"] },
  { num: 9,  sanskrit: "Dharma",  meaning: "Fortune / Father",  keywords: ["Father", "Higher learning", "Luck", "Religion"] },
  { num: 10, sanskrit: "Karma",   meaning: "Career",            keywords: ["Career", "Status", "Power", "Government"] },
  { num: 11, sanskrit: "Labha",   meaning: "Gains",             keywords: ["Income", "Elder siblings", "Friends", "Ambition"] },
  { num: 12, sanskrit: "Vyaya",   meaning: "Loss / Liberation", keywords: ["Expenses", "Foreign settlement", "Liberation", "Sleep"] },
];

const GROUPS = [
  { key: "kendras",    label: "Kendras (Angular)",     houses: [1, 4, 7, 10], color: "#dc2626", bg: "#fef2f2", desc: "The 4 pillars — high visibility, high activity" },
  { key: "trikonas",   label: "Trikonas (Trines)",     houses: [1, 5, 9],     color: "#16a34a", bg: "#f0fdf4", desc: "The luckiest houses — dharma, blessings, protection" },
  { key: "dusthanas",  label: "Dusthanas (Suffering)", houses: [6, 8, 12],    color: "#7c3aed", bg: "#f5f3ff", desc: "Houses of hardship — but also transformation" },
  { key: "upachayas",  label: "Upachayas (Growth)",    houses: [3, 6, 10, 11],color: "#ea580c", bg: "#fff7ed", desc: "Improve with age — malefics do well here" },
];

function gColor(n: number) { for (const g of GROUPS) if (g.houses.includes(n)) return g.color; return "#92400e"; }
function gBg(n: number)    { for (const g of GROUPS) if (g.houses.includes(n)) return g.bg; return "#fffbeb"; }
function info(n: number)   { return HOUSES.find(h => h.num === n)!; }
function ord(n: number)    { return n === 1 ? "st" : n === 2 ? "nd" : n === 3 ? "rd" : "th"; }

export default function HouseChart({ size = 560 }: { size?: number }) {
  const [selected, setSelected] = useState<HouseInfo | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>("none");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const S = size, pad = S * 0.1;
  const x0 = pad, y0 = pad, x1 = S - pad, y1 = S - pad;
  const cx = S / 2, cy = S / 2;

  // Outer square corners
  const TL = `${x0},${y0}`, TR = `${x1},${y0}`, BR = `${x1},${y1}`, BL = `${x0},${y1}`;
  // Side midpoints (inner diamond vertices)
  const mT = `${cx},${y0}`, mR = `${x1},${cy}`, mB = `${cx},${y1}`, mL = `${x0},${cy}`;
  // Center
  const C = `${cx},${cy}`;
  // Quarter-points: where diagonals intersect diamond edges
  const qx0 = (x0 + cx) / 2, qy0 = (y0 + cy) / 2;
  const qx1 = (cx + x1) / 2, qy1 = (cy + y1) / 2;
  const QNW = `${qx0},${qy0}`, QNE = `${qx1},${qy0}`;
  const QSW = `${qx0},${qy1}`, QSE = `${qx1},${qy1}`;

  // 12 houses: path + label centroid
  // Anti-clockwise from Lagna: 1(top)→2(top-left)→3(left-up)→4(left)→...→12(top-right)
  const houses: { n: number; d: string; lx: number; ly: number }[] = [
    { n: 1,  d: `M${mT}L${QNE}L${C}L${QNW}Z`,  lx: cx,  ly: (y0 + qy0 + cy + qy0) / 4 },
    { n: 2,  d: `M${TL}L${mT}L${QNW}Z`,         lx: (x0 + cx + qx0) / 3, ly: (y0 + y0 + qy0) / 3 },
    { n: 3,  d: `M${TL}L${QNW}L${mL}Z`,          lx: (x0 + qx0 + x0) / 3, ly: (y0 + qy0 + cy) / 3 },
    { n: 4,  d: `M${mL}L${QNW}L${C}L${QSW}Z`,   lx: (x0 + qx0 + cx + qx0) / 4, ly: cy },
    { n: 5,  d: `M${BL}L${mL}L${QSW}Z`,          lx: (x0 + x0 + qx0) / 3, ly: (y1 + cy + qy1) / 3 },
    { n: 6,  d: `M${BL}L${QSW}L${mB}Z`,          lx: (x0 + qx0 + cx) / 3, ly: (y1 + qy1 + y1) / 3 },
    { n: 7,  d: `M${mB}L${QSW}L${C}L${QSE}Z`,   lx: cx, ly: (y1 + qy1 + cy + qy1) / 4 },
    { n: 8,  d: `M${BR}L${mB}L${QSE}Z`,          lx: (x1 + cx + qx1) / 3, ly: (y1 + y1 + qy1) / 3 },
    { n: 9,  d: `M${BR}L${QSE}L${mR}Z`,          lx: (x1 + qx1 + x1) / 3, ly: (y1 + qy1 + cy) / 3 },
    { n: 10, d: `M${mR}L${QSE}L${C}L${QNE}Z`,   lx: (x1 + qx1 + cx + qx1) / 4, ly: cy },
    { n: 11, d: `M${TR}L${mR}L${QNE}Z`,          lx: (x1 + x1 + qx1) / 3, ly: (y0 + cy + qy0) / 3 },
    { n: 12, d: `M${TR}L${QNE}L${mT}Z`,          lx: (x1 + qx1 + cx) / 3, ly: (y0 + qy0 + y0) / 3 },
  ];

  // Determine which houses are highlighted by the active group filter
  const activeGroupData = GROUPS.find(g => g.key === activeGroup);
  const highlightedHouses = activeGroupData ? activeGroupData.houses : [];

  // Check if a house should be visually active
  const isActive = (n: number) => {
    if (hovered === n || selected?.num === n) return true;
    if (highlightedHouses.includes(n)) return true;
    return false;
  };

  // Get fill color for a house
  const getFill = (n: number) => {
    if (hovered === n || selected?.num === n) return gBg(n);
    if (activeGroupData && highlightedHouses.includes(n)) return activeGroupData.bg;
    return "transparent";
  };

  // Get stroke color for a house
  const getStroke = (n: number) => {
    if (hovered === n || selected?.num === n) return gColor(n);
    if (activeGroupData && highlightedHouses.includes(n)) return activeGroupData.color;
    return "transparent";
  };

  // Dimmed houses (when a group is selected, non-group houses are dimmed)
  const isDimmed = (n: number) => {
    return activeGroupData && !highlightedHouses.includes(n);
  };

  return (
    <div className="relative w-full max-w-[640px] mx-auto select-none">
      <div className="rounded-3xl bg-gradient-to-br from-[#fdfcfa] to-[#f5f2ee] border border-amber-100/80 shadow-lg shadow-amber-900/5 p-4 sm:p-6">
        <div className="text-center mb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-600">North Indian Kundli Chart</h2>
          <p className="text-xs text-gray-500 mt-0.5">The 12 Bhavas · Tap any house to explore its domain</p>
        </div>

        {/* Group Filter Dropdown */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter Groups</span>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-amber-200 rounded-xl text-sm font-semibold text-amber-800 hover:border-amber-400 transition-colors min-w-[180px] justify-between shadow-sm"
            >
              <span>{activeGroupData ? activeGroupData.label.split(" (")[0] : "None"}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => { setActiveGroup("none"); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${activeGroup === "none" ? "bg-amber-50 text-amber-700" : "text-gray-600"}`}
                >
                  None
                </button>
                {GROUPS.map(g => (
                  <button
                    key={g.key}
                    onClick={() => { setActiveGroup(g.key); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 ${activeGroup === g.key ? "text-white" : "text-gray-700"}`}
                    style={activeGroup === g.key ? { backgroundColor: g.color, color: "#fff" } : {}}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: activeGroup === g.key ? "#fff" : g.color }} />
                    {g.label.split(" (")[0]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Group description banner */}
        {activeGroupData && (
          <div
            className="mb-3 px-4 py-2.5 rounded-xl text-center text-sm font-semibold border animate-in fade-in duration-200"
            style={{ backgroundColor: activeGroupData.bg, color: activeGroupData.color, borderColor: activeGroupData.color + "40" }}
          >
            <span className="font-bold">{activeGroupData.label}</span>
            <span className="mx-2">·</span>
            Houses {activeGroupData.houses.join(", ")}
            <p className="text-xs font-medium mt-0.5 opacity-80">{activeGroupData.desc}</p>
          </div>
        )}

        <svg viewBox={`0 0 ${S} ${S}`} className="w-full h-auto">
          <defs>
            <filter id="hcSh"><feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#78350f" floodOpacity="0.08" /></filter>
            {/* Glow filter for highlighted houses */}
            {GROUPS.map(g => (
              <filter key={g.key} id={`glow-${g.key}`} x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={g.color} floodOpacity="0.35" />
              </filter>
            ))}
          </defs>

          {/* Outer square */}
          <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#fffbeb" stroke="#c9956b" strokeWidth="2.5" filter="url(#hcSh)" />

          {/* Interactive house regions */}
          {houses.map(({ n, d }) => {
            const active = isActive(n);
            const dimmed = isDimmed(n);
            const groupHighlight = activeGroupData && highlightedHouses.includes(n) && hovered !== n && selected?.num !== n;
            return (
              <path key={n} d={d}
                fill={active ? getFill(n) : "transparent"}
                stroke={active ? getStroke(n) : "transparent"}
                strokeWidth={active ? 2.5 : 0}
                opacity={dimmed ? 0.3 : active ? 0.9 : 0}
                filter={groupHighlight ? `url(#glow-${activeGroup})` : undefined}
                className="cursor-pointer transition-all duration-300"
                onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(info(n))} />
            );
          })}

          {/* Structural lines: 2 diagonals */}
          <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="#c9956b" strokeWidth="1.5" />
          <line x1={x1} y1={y0} x2={x0} y2={y1} stroke="#c9956b" strokeWidth="1.5" />
          {/* Inner diamond */}
          <polygon points={`${mT} ${mR} ${mB} ${mL}`} fill="none" stroke="#c9956b" strokeWidth="1.5" />

          {/* House numbers */}
          {houses.map(({ n, lx, ly }) => {
            const isKendra = [1, 4, 7, 10].includes(n);
            const dimmed = isDimmed(n);
            const groupHl = activeGroupData && highlightedHouses.includes(n);
            return (
              <text key={`t${n}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                fontSize={isKendra ? S * 0.042 : S * 0.034}
                fontWeight={isKendra || groupHl ? 800 : 700}
                fill={groupHl ? activeGroupData!.color : gColor(n)}
                opacity={dimmed ? 0.25 : 1}
                className="pointer-events-none transition-all duration-300">{n}</text>
            );
          })}

          {/* Axis labels */}
          <text x={cx} y={y0 - 10} textAnchor="middle" fontSize={S * 0.024} fontWeight="700" fill="#92400e">1st House · Lagna</text>
          <text x={cx} y={y1 + S * 0.05} textAnchor="middle" fontSize={S * 0.024} fontWeight="700" fill="#92400e">7th House · Yuvati</text>
          <text x={x0 - 10} y={cy} textAnchor="end" dominantBaseline="central" fontSize={S * 0.024} fontWeight="700" fill="#92400e">4th</text>
          <text x={x1 + 10} y={cy} textAnchor="start" dominantBaseline="central" fontSize={S * 0.024} fontWeight="700" fill="#92400e">10th</text>
        </svg>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {GROUPS.map(g => (
            <button
              key={g.label}
              onClick={() => setActiveGroup(activeGroup === g.key ? "none" : g.key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-sm border transition-all duration-200 ${activeGroup === g.key ? "ring-2 scale-105" : "bg-white border-gray-100 hover:border-gray-300"}`}
              style={activeGroup === g.key ? { backgroundColor: g.bg, borderColor: g.color } : {}}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
              <span className="text-[11px] font-semibold" style={activeGroup === g.key ? { color: g.color } : { color: "#374151" }}>{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detail popup */}
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-3xl" onClick={() => setSelected(null)} />
          <div className="relative bg-white rounded-2xl border-2 shadow-2xl p-5 w-full max-w-[360px] animate-in zoom-in-95 duration-200"
            style={{ borderColor: gColor(selected.num) }}>
            <button onClick={() => setSelected(null)} className="absolute right-3 top-3 p-1.5 rounded-lg hover:bg-gray-100">
              <X className="w-4 h-4 text-gray-400" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                style={{ background: gColor(selected.num) }}>{selected.num}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.num}{ord(selected.num)} House</h3>
                <p className="text-sm font-medium" style={{ color: gColor(selected.num) }}>{selected.sanskrit} · {selected.meaning}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.keywords.map(k => (
                <span key={k} className="text-[11px] font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-600">{k}</span>
              ))}
            </div>
            {GROUPS.filter(g => g.houses.includes(selected.num)).map(g => (
              <div key={g.label} className="p-2.5 rounded-lg mb-2 text-xs font-bold" style={{ background: g.bg, color: g.color }}>
                {g.label} ({g.houses.join(", ")})
              </div>
            ))}
          </div>
        </div>
      )}

      {hovered !== null && !selected && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-amber-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none">
          {info(hovered).sanskrit} · {info(hovered).meaning} — Click to explore
        </div>
      )}
    </div>
  );
}
