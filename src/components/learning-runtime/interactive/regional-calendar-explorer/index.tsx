"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Info } from "lucide-react";

const GOLD = "#C28220";
const INDIGO = "#4A6FA5";
const JADE = "#2F8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const CALENDARS = [
  {
    key: "vikrama",
    name: "Vikrama Saṁvat",
    region: "North India",
    start: "Caitra Śukla Pratipad",
    startMonth: "March–April",
    offset: "CE + 57",
    note: "Widely used in North India for festivals and religious dates.",
    color: INDIGO,
  },
  {
    key: "saka",
    name: "Śaka Saṁvat",
    region: "Official / Government",
    start: "Caitra Śukla Pratipad",
    startMonth: "March–April",
    offset: "CE − 78",
    note: "Official civil calendar of India since 1957. Modified by government to start 22 March.",
    color: GOLD,
  },
  {
    key: "kollam",
    name: "Kollam Era",
    region: "Kerala",
    start: "Siṁha Saṅkrānti",
    startMonth: "August–September",
    offset: "CE − 825",
    note: "Named after the city of Kollam (Quilon). Begins when Sun enters Leo, not Aries.",
    color: VERMILION,
  },
  {
    key: "tamil",
    name: "Tamil Calendar",
    region: "Tamil Nadu",
    start: "Meṣa Saṅkrānti",
    startMonth: "April",
    offset: "Solar",
    note: "Solar calendar tied to Meṣa Saṅkrānti. Month names follow the nakṣatra of the full moon.",
    color: JADE,
  },
  {
    key: "bengali",
    name: "Bengali Calendar",
    region: "Bengal",
    start: "Meṣa Saṅkrānti",
    startMonth: "April",
    offset: "Solar-lunar hybrid",
    note: "Hybrid solar-lunar system. Used for Bengali New Year (Pohela Boishakh).",
    color: INDIGO,
  },
  {
    key: "assamese",
    name: "Assamese Calendar",
    region: "Assam",
    start: "Meṣa Saṅkrānti",
    startMonth: "April",
    offset: "Solar-lunar hybrid",
    note: "Bihu festivals are anchored to this calendar. Bohag Bihu marks the new year.",
    color: JADE,
  },
  {
    key: "odia",
    name: "Odia Calendar",
    region: "Odisha",
    start: "Meṣa Saṅkrānti",
    startMonth: "April",
    offset: "Solar-lunar hybrid",
    note: "Follows the same solar-lunar structure as Bengali and Assamese calendars.",
    color: VERMILION,
  },
  {
    key: "gregorian",
    name: "Gregorian",
    region: "All India (civil)",
    start: "1 January",
    startMonth: "January",
    offset: "Base reference",
    note: "The universal civil calendar used for all official, legal, and commercial purposes.",
    color: INK_MUTED,
  },
];

function IndiaMapSVG({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
  const w = 320;
  const h = 380;

  // Simplified region paths (stylized India)
  const regions = [
    {
      key: "vikrama",
      path: "M 120 40 L 180 35 L 200 60 L 190 100 L 160 110 L 130 100 L 110 70 Z",
      label: { x: 155, y: 75 },
    },
    {
      key: "saka",
      path: "M 130 100 L 160 110 L 170 140 L 140 150 L 110 130 Z",
      label: { x: 140, y: 125 },
    },
    {
      key: "kollam",
      path: "M 130 220 L 160 215 L 170 245 L 145 255 L 125 240 Z",
      label: { x: 147, y: 235 },
    },
    {
      key: "tamil",
      path: "M 140 255 L 170 245 L 175 275 L 150 285 L 135 270 Z",
      label: { x: 155, y: 265 },
    },
    {
      key: "bengali",
      path: "M 210 100 L 240 95 L 250 120 L 230 135 L 205 125 Z",
      label: { x: 227, y: 115 },
    },
    {
      key: "assamese",
      path: "M 230 60 L 270 50 L 280 75 L 260 90 L 235 80 Z",
      label: { x: 255, y: 70 },
    },
    {
      key: "odia",
      path: "M 190 140 L 220 135 L 230 160 L 205 170 L 185 155 Z",
      label: { x: 207, y: 152 },
    },
  ];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto max-w-[320px] mx-auto">
      {/* India outline (simplified) */}
      <path
        d="M 140 20 L 190 25 L 230 45 L 280 55 L 290 90 L 270 130 L 250 160 L 240 200 L 220 250 L 190 290 L 160 300 L 130 280 L 110 240 L 100 200 L 90 150 L 95 100 L 110 60 Z"
        fill={`${INDIGO}05`}
        stroke={`${INK_MUTED}20`}
        strokeWidth={1.5}
      />

      {/* Regions */}
      {regions.map((r) => {
        const cal = CALENDARS.find((c) => c.key === r.key)!;
        const isSelected = selected === r.key;
        return (
          <g key={r.key}>
            <path
              d={r.path}
              fill={isSelected ? `${cal.color}25` : `${cal.color}10`}
              stroke={isSelected ? cal.color : `${cal.color}50`}
              strokeWidth={isSelected ? 2.5 : 1}
              className="cursor-pointer transition-all"
              onClick={() => onSelect(r.key)}
            />
            <text
              x={r.label.x}
              y={r.label.y}
              textAnchor="middle"
              fill={isSelected ? cal.color : `${cal.color}90`}
              fontSize={9}
              fontWeight={isSelected ? 700 : 500}
              className="cursor-pointer"
              onClick={() => onSelect(r.key)}
            >
              {cal.region}
            </text>
          </g>
        );
      })}

      {/* Gregory label (all India) */}
      <text x={180} y={340} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        Gregorian — All India
      </text>

      {/* Title */}
      <text x={w / 2} y={18} textAnchor="middle" fill={INK_MUTED} fontSize={11} fontWeight={600}>
        Click a region to explore its calendar
      </text>
    </svg>
  );
}

export function RegionalCalendarExplorer() {
  const [selected, setSelected] = useState("vikrama");

  const active = CALENDARS.find((c) => c.key === selected)!;

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left: Map */}
        <div className="gl-surface-twilight-glass p-4 flex items-center justify-center">
          <IndiaMapSVG selected={selected} onSelect={setSelected} />
        </div>

        {/* Right: Detail + Grid */}
        <div className="space-y-4">
          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0.24, 1] }}
              className="gl-surface-twilight-glass p-5"
              style={{ borderLeft: `3px solid ${active.color}` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div
                    className="text-xl font-medium"
                    style={{ fontFamily: "var(--font-cormorant), serif", color: INK_PRIMARY }}
                  >
                    {active.name}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: INK_MUTED }}>
                    <MapPin size={12} />
                    {active.region}
                  </div>
                </div>
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${active.color}15`,
                    color: active.color,
                  }}
                >
                  {active.startMonth}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
                  <div className="text-xs mb-1" style={{ color: INK_MUTED }}>Year start</div>
                  <div className="text-sm font-medium">{active.start}</div>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--gl-surface-2, #F5EDD8)" }}>
                  <div className="text-xs mb-1" style={{ color: INK_MUTED }}>CE relation</div>
                  <div className="text-sm font-medium">{active.offset}</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Info size={14} style={{ color: INK_MUTED }} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm" style={{ color: INK_SECONDARY }}>{active.note}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Calendar grid */}
          <div className="gl-surface-twilight-glass p-5">
            <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: INK_MUTED }}>
              All calendars
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CALENDARS.map((cal) => (
                <button
                  key={cal.key}
                  onClick={() => setSelected(cal.key)}
                  className="p-3 rounded-lg text-left transition-all"
                  style={{
                    backgroundColor: selected === cal.key ? `${cal.color}12` : "var(--gl-surface-2, #F5EDD8)",
                    border: selected === cal.key ? `1px solid ${cal.color}40` : "1px solid transparent",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-1"
                    style={{ color: selected === cal.key ? cal.color : INK_PRIMARY }}
                  >
                    {cal.name}
                  </div>
                  <div className="text-[10px]" style={{ color: INK_MUTED }}>
                    {cal.startMonth}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison strip */}
      <div className="mt-4 gl-surface-twilight-glass p-5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} style={{ color: INK_MUTED }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: INK_MUTED }}>
            Year-start comparison
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${INK_MUTED}30` }}>
                <th className="text-left py-2 px-2 text-xs" style={{ color: INK_MUTED }}>Calendar</th>
                <th className="text-left py-2 px-2 text-xs" style={{ color: INK_MUTED }}>Year starts on</th>
                <th className="text-left py-2 px-2 text-xs" style={{ color: INK_MUTED }}>Month</th>
                <th className="text-left py-2 px-2 text-xs" style={{ color: INK_MUTED }}>CE relation</th>
              </tr>
            </thead>
            <tbody>
              {CALENDARS.map((cal) => (
                <tr
                  key={cal.key}
                  className="cursor-pointer transition-colors"
                  style={{
                    borderBottom: `1px solid ${INK_MUTED}15`,
                    backgroundColor: selected === cal.key ? `${cal.color}06` : "transparent",
                  }}
                  onClick={() => setSelected(cal.key)}
                >
                  <td className="py-2 px-2 font-medium" style={{ color: cal.key === selected ? cal.color : INK_PRIMARY }}>
                    {cal.name}
                  </td>
                  <td className="py-2 px-2" style={{ color: INK_SECONDARY }}>{cal.start}</td>
                  <td className="py-2 px-2" style={{ color: INK_SECONDARY }}>{cal.startMonth}</td>
                  <td className="py-2 px-2" style={{ color: INK_SECONDARY }}>{cal.offset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
