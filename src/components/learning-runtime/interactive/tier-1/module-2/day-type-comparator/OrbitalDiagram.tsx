"use client";

import { useMemo } from "react";
import type { DayType } from "./data";
import { DAY_TYPES, GOLD, INDIGO, VERMILION, JADE } from "./data";

// Short ring labels + glyphs, keyed by day-type. Durations/radii/colours are
// driven from DAY_TYPES so the diagram stays in sync with the canonical data
// (e.g. the saura day animates at the sāvana ~24h rate, not a ~30-day orbit).
const RING_LABEL: Record<DayType["key"], string> = {
  savana: "Sāvana",
  sidereal: "Sidereal",
  lunar: "Lunar",
  solar: "Solar",
};
const RING_ICON: Record<DayType["key"], string> = {
  savana: "☉",
  sidereal: "✦",
  lunar: "☽",
  solar: "⟲",
};

interface OrbitalDiagramProps {
  selected: DayType["key"] | null;
  explored: Set<DayType["key"]>;
  onSelect: (key: DayType["key"]) => void;
  reducedMotion?: boolean;
  guidedHighlight?: DayType["key"] | null;
}

const COLORS: Record<DayType["key"], string> = {
  savana: GOLD,
  sidereal: INDIGO,
  lunar: VERMILION,
  solar: JADE,
};

export function OrbitalDiagram({
  selected,
  explored,
  onSelect,
  reducedMotion = false,
  guidedHighlight,
}: OrbitalDiagramProps) {
  const cx = 300;
  const cy = 260;

  const rings = useMemo(
    () =>
      DAY_TYPES.map((dt) => ({
        key: dt.key,
        r: dt.orbitalRadius,
        color: COLORS[dt.key],
        dur: `${dt.orbitalDurationSec}s`,
        label: RING_LABEL[dt.key],
        icon: RING_ICON[dt.key],
      })),
    []
  );

  return (
    <svg
      viewBox="0 0 600 520"
      className="w-full h-auto"
      role="img"
      aria-label="Orbital diagram showing four day-types as concentric rings around Earth"
    >
      <defs>
        <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A6FA5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4A6FA5" stopOpacity="0.05" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background field */}
      <circle cx={cx} cy={cy} r="285" fill="none" stroke="#9C6A1B" strokeWidth="0.8" opacity="0.18" />

      {/* Rings */}
      {rings.map((ring) => {
        const isSel = selected === ring.key;
        const isExplored = explored.has(ring.key);
        const isGuided = guidedHighlight === ring.key;
        return (
          <g key={ring.key}>
            {/* Orbital path */}
            <circle
              cx={cx}
              cy={cy}
              r={ring.r}
              fill="none"
              stroke={ring.color}
              strokeWidth={isSel ? 2.4 : 1.6}
              strokeDasharray={isSel ? "none" : "4 4"}
              opacity={isSel ? 0.78 : 0.48}
            />

            {/* Animated orbital marker */}
            <g>
              {!reducedMotion && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${cx} ${cy}`}
                  to={`360 ${cx} ${cy}`}
                  dur={ring.dur}
                  repeatCount="indefinite"
                />
              )}
              <g transform={`translate(${cx + ring.r}, ${cy})`}>
                {/* Marker body */}
                <circle
                  r={isSel ? 14 : 10}
                  fill={ring.color}
                  opacity={isSel ? 0.96 : 0.88}
                  filter={isSel ? "url(#glow)" : undefined}
                  style={{ cursor: "pointer" }}
                  onClick={() => onSelect(ring.key)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Select ${ring.label} day-type`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect(ring.key);
                  }}
                >
                  {isGuided && !reducedMotion && (
                    <animate
                      attributeName="r"
                      values={`${isSel ? 14 : 10};${isSel ? 18 : 14};${isSel ? 14 : 10}`}
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
                {/* Icon */}
                <text
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#FEFAEA"
                  fontSize={isSel ? 11 : 9}
                  fontFamily="serif"
                  pointerEvents="none"
                >
                  {ring.icon}
                </text>
                {/* Explored indicator */}
                {isExplored && (
                  <circle
                    r={isSel ? 18 : 14}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth={1.5}
                    opacity={0.6}
                  />
                )}
              </g>
            </g>

            {/* Label */}
            <text
              x={cx}
              y={cy - ring.r - 8}
              textAnchor="middle"
              fill={isSel ? ring.color : "var(--gl-ink-muted)"}
              fontSize={isSel ? 13 : 11}
              fontWeight={isSel ? 600 : 400}
              fontFamily="var(--font-sans), system-ui, sans-serif"
              style={{ transition: "all 300ms ease" }}
            >
              {ring.label}
            </text>
          </g>
        );
      })}

      {/* Central Earth */}
      <g>
        <circle cx={cx} cy={cy} r="32" fill="url(#earthGrad)" />
        <circle
          cx={cx}
          cy={cy}
          r="28"
          fill="none"
          stroke="#4A6FA5"
          strokeWidth="1.4"
          opacity="0.65"
        />
        {/* Axis tilt */}
        <line
          x1={cx}
          y1={cy - 28}
          x2={cx}
          y2={cy + 28}
          stroke="#4A6FA5"
          strokeWidth="1"
          opacity="0.55"
          transform={`rotate(23.5 ${cx} ${cy})`}
        />
        {/* Earth label */}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="var(--gl-ink-secondary)"
          fontSize={10}
          fontFamily="var(--font-sans), system-ui, sans-serif"
          opacity="0.7"
        >
          Earth
        </text>
      </g>

      {/* Reference-event callouts (dynamic) */}
      {selected && (
        <g>
          <animate attributeName="opacity" from="0" to="1" dur="300ms" fill="freeze" />
          {(() => {
            const ring = rings.find((r) => r.key === selected)!;
            const angle = -45; // position at upper-right
            const rad = (angle * Math.PI) / 180;
            const lx = cx + (ring.r + 40) * Math.cos(rad);
            const ly = cy + (ring.r + 40) * Math.sin(rad);
            return (
              <g>
                <line
                  x1={cx + ring.r * Math.cos(rad)}
                  y1={cy + ring.r * Math.sin(rad)}
                  x2={lx}
                  y2={ly}
                  stroke={ring.color}
                  strokeWidth="1.5"
                  opacity="0.75"
                />
                <circle cx={lx} cy={ly} r="4" fill={ring.color} opacity="0.8" />
              </g>
            );
          })()}
        </g>
      )}
    </svg>
  );
}
