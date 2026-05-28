"use client";

import { useState, useMemo } from "react";
import { Clock, Calendar, RotateCcw } from "lucide-react";

const INDIGO = "#4A6FA5";
const GOLD = "#C28220";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

const SIDEREAL_RATE = 360.985647366; // degrees per sāvana day
const SAVANA_RATE = 360.0;
const DIFF_PER_HOUR = (SIDEREAL_RATE - SAVANA_RATE) / 24; // ~0.041068 degrees per hour
const DIFF_PER_DAY_MINS = 3 + 56 / 60; // ~3.933 minutes

const CONTEXTS = [
  {
    key: "single-chart",
    label: "Single natal chart",
    dayType: "sidereal",
    reason: "Planetary positions computed against sidereal zodiac via ayanāṁśa. Sidereal-day framework prevents position drift.",
  },
  {
    key: "transit",
    label: "Multi-decade transit prediction",
    dayType: "sidereal",
    reason: "Over decades, using sāvana days would accumulate ~1°/year error. Sidereal-day reckoning maintains accuracy.",
  },
  {
    key: "nakshatra",
    label: "Nakṣatra-timing for muhūrta",
    dayType: "sidereal",
    reason: "Moon's transit through 27 nakṣatras is measured against the sidereal reference frame.",
  },
  {
    key: "civil",
    label: "Civil timekeeping + vāra",
    dayType: "savana",
    reason: "Civil time, vāra determination, and daily scheduling operate against sunrise (sāvana day).",
  },
];

function EarthSVG({ hours }: { hours: number }) {
  const W = 280;
  const H = 280;
  const cx = W / 2;
  const cy = H / 2;
  const earthR = 50;
  const sunDist = 120;
  const starDist = 160;

  // Earth rotation: starts with star at top (0°), rotates counter-clockwise
  const earthRot = -(hours * SIDEREAL_RATE) / 24;
  // Sun angle: starts at slight offset, moves ~1° per day
  const sunAngle = 15 + (hours * 360) / 24 / 365.25;

  // Marker on Earth's surface (to show rotation)
  const markerAngle = (earthRot * Math.PI) / 180;
  const mx = cx + earthR * 0.6 * Math.cos(markerAngle);
  const my = cy + earthR * 0.6 * Math.sin(markerAngle);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto max-w-[280px] mx-auto">
      {/* Orbit circle */}
      <circle cx={cx} cy={cy} r={sunDist} fill="none" stroke={`${INK_MUTED}30`} strokeWidth={1} strokeDasharray="4 4" />

      {/* Fixed star */}
      <g>
        <line x1={cx} y1={cy} x2={cx} y2={cy - starDist} stroke={`${GOLD}40`} strokeWidth={1} />
        <circle cx={cx} cy={cy - starDist} r={4} fill={GOLD} />
        <text x={cx} y={cy - starDist - 10} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>★ Fixed Star</text>
      </g>

      {/* Sun */}
      <g>
        <circle
          cx={cx + sunDist * Math.cos((sunAngle * Math.PI) / 180)}
          cy={cy + sunDist * Math.sin((sunAngle * Math.PI) / 180)}
          r={14}
          fill={GOLD}
          opacity={0.9}
        />
        <text
          x={cx + sunDist * Math.cos((sunAngle * Math.PI) / 180)}
          y={cy + sunDist * Math.sin((sunAngle * Math.PI) / 180) + 28}
          textAnchor="middle"
          fill={GOLD}
          fontSize={10}
          fontWeight={600}
        >
          Sun
        </text>
      </g>

      {/* Earth */}
      <g>
        <circle cx={cx} cy={cy} r={earthR} fill={`${INDIGO}25`} stroke={INDIGO} strokeWidth={2} />
        {/* Rotation indicator */}
        <line x1={cx} y1={cy} x2={mx} y2={my} stroke={INDIGO} strokeWidth={1.5} />
        <circle cx={mx} cy={my} r={3} fill={INDIGO} />
        {/* Meridian line (vertical) */}
        <line x1={cx} y1={cy - earthR} x2={cx} y2={cy + earthR} stroke={`${INK_MUTED}50`} strokeWidth={1} strokeDasharray="3 2" />
      </g>

      {/* Labels */}
      <text x={cx} y={cy + earthR + 18} textAnchor="middle" fill={INK_SECONDARY} fontSize={10}>Earth</text>
    </svg>
  );
}

export function SiderealDayExplorer() {
  const [hours, setHours] = useState(0);
  const [showAnnual, setShowAnnual] = useState(false);
  const [selectedContext, setSelectedContext] = useState("single-chart");

  const siderealRot = (hours * SIDEREAL_RATE) / 24;
  const savanaRot = (hours * SAVANA_RATE) / 24;
  const diffDeg = siderealRot - savanaRot;
  const diffMins = (hours * DIFF_PER_DAY_MINS) / 24;

  const annualDays = showAnnual ? 365.25 : 0;
  const annualSidereal = (annualDays * SIDEREAL_RATE) / 360;
  const annualSavana = annualDays;

  const activeContext = CONTEXTS.find((c) => c.key === selectedContext)!;

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Scrubber */}
      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Sāvana hours elapsed</label>
          <span className="text-lg font-bold tabular-nums" style={{ color: INDIGO }}>{hours.toFixed(1)}h</span>
        </div>
        <input
          type="range"
          min={0}
          max={48}
          step={0.5}
          value={hours}
          onChange={(e) => setHours(parseFloat(e.target.value))}
          className="w-full accent-[#4A6FA5]"
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: INK_MUTED }}>
          <span>0h</span>
          <span>24h</span>
          <span>48h</span>
        </div>
      </div>

      {/* Earth visual */}
      <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <EarthSVG hours={hours} />

        {/* Rotation stats */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-center">
          <div className="p-2 rounded" style={{ backgroundColor: `${INDIGO}10` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Sidereal rotation</div>
            <div className="text-sm font-bold" style={{ color: INDIGO }}>{siderealRot.toFixed(2)}°</div>
          </div>
          <div className="p-2 rounded" style={{ backgroundColor: `${GOLD}10` }}>
            <div className="text-xs" style={{ color: INK_MUTED }}>Sāvana rotation</div>
            <div className="text-sm font-bold" style={{ color: GOLD }}>{savanaRot.toFixed(2)}°</div>
          </div>
        </div>

        <div className="mt-3 p-2 rounded text-center" style={{ backgroundColor: `${VERMILION}10` }}>
          <div className="text-xs" style={{ color: INK_MUTED }}>Differential</div>
          <div className="text-sm font-bold" style={{ color: VERMILION }}>
            {diffDeg.toFixed(3)}° = ~{diffMins.toFixed(1)} min
          </div>
        </div>
      </div>

      {/* Annual accumulation toggle */}
      <div className="mb-4">
        <button
          onClick={() => setShowAnnual((s) => !s)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium"
          style={{
            backgroundColor: showAnnual ? `${JADE}18` : "var(--gl-surface-2)",
            color: showAnnual ? JADE : INK_SECONDARY,
          }}
        >
          <Calendar size={14} />
          {showAnnual ? "Hide annual accumulation" : "Show annual accumulation"}
        </button>
      </div>

      {showAnnual && (
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "var(--gl-surface-1)" }}>
          <div className="text-sm font-semibold mb-2">Annual Accumulation</div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="p-2 rounded text-center" style={{ backgroundColor: `${GOLD}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>Sāvana days</div>
              <div className="text-sm font-bold" style={{ color: GOLD }}>{annualSavana.toFixed(2)}</div>
            </div>
            <div className="p-2 rounded text-center" style={{ backgroundColor: `${INDIGO}10` }}>
              <div className="text-xs" style={{ color: INK_MUTED }}>Sidereal rotations</div>
              <div className="text-sm font-bold" style={{ color: INDIGO }}>{annualSidereal.toFixed(2)}</div>
            </div>
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>
            In one year: Earth completes {annualSavana.toFixed(2)} sāvana days but {annualSidereal.toFixed(2)} sidereal rotations.
            The extra ~1 rotation is why the same stars rise ~4 minutes earlier each night.
          </p>
        </div>
      )}

      {/* Context picker */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={16} style={{ color: INDIGO }} />
          <span className="text-sm font-semibold">Which day-type for which context?</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {CONTEXTS.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedContext(c.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: selectedContext === c.key ? INDIGO : "var(--gl-surface-2)",
                color: selectedContext === c.key ? "#fff" : INK_SECONDARY,
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: activeContext.dayType === "sidereal" ? `${INDIGO}10` : `${GOLD}10`,
            borderLeft: `3px solid ${activeContext.dayType === "sidereal" ? INDIGO : GOLD}`,
          }}
        >
          <div className="text-xs font-semibold mb-1" style={{ color: activeContext.dayType === "sidereal" ? INDIGO : GOLD }}>
            Use {activeContext.dayType === "sidereal" ? "Sidereal day" : "Sāvana day"}
          </div>
          <p className="text-xs" style={{ color: INK_SECONDARY }}>{activeContext.reason}</p>
        </div>
      </div>

      {/* Reset */}
      <div className="mt-3 text-center">
        <button
          onClick={() => { setHours(0); setShowAnnual(false); }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
          style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>
    </div>
  );
}
