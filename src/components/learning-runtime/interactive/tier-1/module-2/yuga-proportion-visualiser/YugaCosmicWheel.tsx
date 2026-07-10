"use client";

import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import {
  YUGAS,
  SECTOR_GEOMS,
  TOTAL_PROPORTION,
  type YugaData,
  type VisualMode,
  polarToCartesian,
  donutSectorPath,
  subdivideArc,
  CX,
  CY,
} from "./yuga-data";

/* ─── Props ─── */
interface YugaCosmicWheelProps {
  mode: VisualMode;
  selectedYuga: string | null;
  onSelectYuga: (key: string) => void;
  isAutoPlaying: boolean;
  reducedMotion: boolean;
  feedbackState: { key: string | null; isCorrect: boolean | null } | null;
}

/* ─── Constants ─── */
const R_OUTER = 280;
const R_INNER = 90;
const R_ORBIT = 310;
const R_HUB = 78;

const AMBIENT_PARTICLES = Array.from({ length: 12 }, (_, i) => {
  const seed = i + 1;
  return {
    id: i,
    angle: (i / 12) * 360,
    distance: 340 + ((seed * 17) % 40),
    size: 1.5 + ((seed * 11) % 20) / 10,
    duration: 10 + ((seed * 7) % 8),
    delay: ((seed * 13) % 50) / 10,
    opacity: 0.15 + ((seed * 19) % 25) / 100,
  };
});

/* ─── Sub-components ─── */

/** Decorative ambient particles floating around the wheel */
function AmbientParticles({ reducedMotion }: { reducedMotion: boolean }) {
  if (reducedMotion) return null;
  return (
    <g aria-hidden="true">
      {AMBIENT_PARTICLES.map((p) => {
        const pos = polarToCartesian(CX, CY, p.distance, p.angle);
        return (
          <circle
            key={p.id}
            cx={pos.x}
            cy={pos.y}
            r={p.size}
            fill="#C9A24D"
            opacity={p.opacity}
            style={{
              animation: `yugaParticleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        );
      })}
    </g>
  );
}

/** Orbital marker that travels along the wheel perimeter */
function OrbitalMarker({
  angle,
  reducedMotion,
}: {
  angle: number;
  reducedMotion: boolean;
}) {
  const pos = polarToCartesian(CX, CY, R_ORBIT, angle);
  return (
    <g style={{ transition: reducedMotion ? "none" : "transform 800ms cubic-bezier(0.32, 0.72, 0.24, 1)" }}>
      <circle
        cx={pos.x}
        cy={pos.y}
        r={10}
        fill="#F4C77B"
        opacity={0.9}
        filter="url(#orbitalGlow)"
        style={{
          transition: reducedMotion ? "none" : "all 400ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        }}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={4}
        fill="#fff"
        style={{ pointerEvents: "none" }}
      />
    </g>
  );
}

/** Hub text display in the centre of the wheel */
function HubDisplay({
  selectedYuga,
  mode,
}: {
  selectedYuga: YugaData | null;
  mode: VisualMode;
}) {
  const modeLabel = useMemo(() => {
    switch (mode) {
      case "proportion":
        return "4 : 3 : 2 : 1";
      case "absolute":
        return "4.32M years";
      case "divya":
        return "12,000 d.v.";
      case "sandhya":
        return "Saṁdhyā";
      case "dharma":
        return "Dharma";
    }
  }, [mode]);

  if (selectedYuga) {
    return (
      <g>
        <text
          x={CX}
          y={CY - 10}
          textAnchor="middle"
          fill={selectedYuga.color}
          fontSize={26}
          fontWeight={700}
          style={{ fontFamily: "var(--font-devanagari), serif", pointerEvents: "none" }}
        >
          {selectedYuga.devanagari}
        </text>
        <text
          x={CX}
          y={CY + 18}
          textAnchor="middle"
          fill="#5C3D26"
          fontSize={13}
          fontWeight={600}
          letterSpacing={0.08}
          style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none", textTransform: "uppercase" }}
        >
          {selectedYuga.name}
        </text>
      </g>
    );
  }

  return (
    <g>
      <text
        x={CX}
        y={CY + 6}
        textAnchor="middle"
        fill="#9C7A2F"
        fontSize={20}
        fontWeight={700}
        letterSpacing={0.06}
        style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none" }}
      >
        {modeLabel}
      </text>
      <text
        x={CX}
        y={CY + 26}
        textAnchor="middle"
        fill="#9C7A2F"
        fontSize={10}
        fontWeight={600}
        letterSpacing={0.12}
        opacity={0.7}
        style={{ fontFamily: "var(--font-sans), sans-serif", pointerEvents: "none", textTransform: "uppercase" }}
      >
        Mahā-Yuga
      </text>
    </g>
  );
}

/** Saṁdhyā subdivision arcs within a sector */
function SandhyaOverlay({
  yuga,
  geom,
  reducedMotion,
}: {
  yuga: YugaData;
  geom: (typeof SECTOR_GEOMS)[number];
  reducedMotion: boolean;
}) {
  const bands = useMemo(
    () => subdivideArc(geom.startAngle, geom.endAngle, [1, 10, 1]),
    [geom]
  );

  const rMid1 = R_OUTER - 30;
  const rMid2 = R_INNER + 30;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* saṁdhyā (dawn) */}
      <path
        d={donutSectorPath(CX, CY, R_OUTER, rMid1, bands[0][0], bands[0][1])}
        fill={`${yuga.color}40`}
        stroke={yuga.color}
        strokeWidth={0.5}
        strokeOpacity={0.4}
        style={{ transition: reducedMotion ? "none" : "all 500ms cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
      <path
        d={donutSectorPath(CX, CY, R_OUTER, rMid1, bands[0][0], bands[0][1])}
        fill="url(#sandhyaHatch)"
        fillOpacity={0.25}
        style={{ transition: reducedMotion ? "none" : "all 500ms cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
      {/* core */}
      <path
        d={donutSectorPath(CX, CY, rMid1, rMid2, bands[1][0], bands[1][1])}
        fill={`url(#grad-${yuga.key})`}
        fillOpacity={0.85}
        style={{ transition: reducedMotion ? "none" : "all 500ms cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
      {/* saṁdhyāṁśa (dusk) */}
      <path
        d={donutSectorPath(CX, CY, rMid2, R_INNER, bands[2][0], bands[2][1])}
        fill={`${yuga.color}40`}
        stroke={yuga.color}
        strokeWidth={0.5}
        strokeOpacity={0.4}
        style={{ transition: reducedMotion ? "none" : "all 500ms cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
      <path
        d={donutSectorPath(CX, CY, rMid2, R_INNER, bands[2][0], bands[2][1])}
        fill="url(#sandhyaHatch)"
        fillOpacity={0.25}
        style={{ transition: reducedMotion ? "none" : "all 500ms cubic-bezier(0.65, 0, 0.35, 1)" }}
      />
    </g>
  );
}

/** Dharma leg count icons rendered in sectors */
function DharmaOverlay({
  yuga,
  geom,
}: {
  yuga: YugaData;
  geom: (typeof SECTOR_GEOMS)[number];
}) {
  const legs = yuga.dharmaLegs;
  const positions = useMemo(() => {
    const arr: { x: number; y: number }[] = [];
    const step = 18;
    const startOffset = -((legs - 1) * step) / 2;
    for (let i = 0; i < legs; i++) {
      const a = geom.midAngle + startOffset + i * step;
      const r = (R_OUTER + R_INNER) / 2 + 20;
      arr.push(polarToCartesian(CX, CY, r, a));
    }
    return arr;
  }, [geom.midAngle, legs]);

  return (
    <g style={{ pointerEvents: "none" }}>
      {positions.map((p, i) => (
        <g key={i}>
          {/* simple leg icon: vertical line with foot */}
          <line x1={p.x} y1={p.y - 10} x2={p.x} y2={p.y + 6} stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.9} />
          <line x1={p.x - 4} y1={p.y + 6} x2={p.x + 4} y2={p.y + 6} stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.9} />
        </g>
      ))}
      <text
        x={geom.labelX}
        y={geom.labelY + 18}
        textAnchor="middle"
        fill="#fff"
        fontSize={11}
        fontWeight={700}
        opacity={0.95}
        style={{ fontFamily: "var(--font-sans), sans-serif", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
      >
        {legs} leg{legs > 1 ? "s" : ""}
      </text>
    </g>
  );
}

/* ─── Main Component ─── */

export const YugaCosmicWheel = React.memo(function YugaCosmicWheel({
  mode,
  selectedYuga,
  onSelectYuga,
  isAutoPlaying,
  reducedMotion,
  feedbackState,
}: YugaCosmicWheelProps) {
  const [hoveredYuga, setHoveredYuga] = useState<string | null>(null);
  const [orbitalAngle, setOrbitalAngle] = useState(0);
  const rafRef = useRef<number | null>(null);
  const autoPlayRef = useRef({ active: false, startTime: 0, duration: 8000 });
  const selectedOrbitalAngle = useMemo(() => {
    if (!selectedYuga) return 0;
    return SECTOR_GEOMS.find((s) => s.key === selectedYuga)?.midAngle ?? 0;
  }, [selectedYuga]);
  const displayOrbitalAngle = isAutoPlaying ? orbitalAngle : selectedOrbitalAngle;

  /* Auto-play orbital animation using rAF (no re-renders during loop) */
  useEffect(() => {
    if (!isAutoPlaying || reducedMotion) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      autoPlayRef.current.active = false;
      return;
    }

    const autoPlayState = autoPlayRef.current;
    autoPlayState.active = true;
    autoPlayState.startTime = performance.now();

    const loop = (now: number) => {
      if (!autoPlayState.active) return;
      const elapsed = now - autoPlayState.startTime;
      const progress = (elapsed % autoPlayState.duration) / autoPlayState.duration;
      setOrbitalAngle(progress * 360);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      const frame = rafRef.current;
      if (frame) cancelAnimationFrame(frame);
      autoPlayState.active = false;
    };
  }, [isAutoPlaying, reducedMotion]);

  const activeYugaData = useMemo(
    () => YUGAS.find((y) => y.key === selectedYuga) ?? null,
    [selectedYuga]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectYuga(YUGAS[idx].key);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const next = (idx + 1) % YUGAS.length;
        document.getElementById(`yuga-sector-${YUGAS[next].key}`)?.focus();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const prev = (idx - 1 + YUGAS.length) % YUGAS.length;
        document.getElementById(`yuga-sector-${YUGAS[prev].key}`)?.focus();
      }
    },
    [onSelectYuga]
  );

  const isFeedbackTarget = (key: string) => feedbackState?.key === key;
  const showCorrectPulse = (key: string) => isFeedbackTarget(key) && feedbackState?.isCorrect === true;
  const showIncorrectShake = (key: string) => isFeedbackTarget(key) && feedbackState?.isCorrect === false;

  return (
    <div className="relative w-full" style={{ maxWidth: 640, margin: "0 auto" }}>
      <svg
        viewBox="0 0 800 800"
        className="w-full h-auto"
        role="img"
        aria-label="Interactive cosmic wheel showing the four yugas within one Mahā-Yuga. Click a sector to explore."
        style={{ display: "block" }}
      >
        <defs>
          {/* Per-yuga gradients */}
          {YUGAS.map((y) => (
            <linearGradient id={`grad-${y.key}`} key={y.key} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={y.color} stopOpacity={0.95} />
              <stop offset="100%" stopColor={y.color} stopOpacity={0.65} />
            </linearGradient>
          ))}

          {/* Selection glow filter */}
          <filter id="sectorGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={6} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Orbital marker glow */}
          <filter id="orbitalGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={4} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Sandhya hatch pattern */}
          <pattern id="sandhyaHatch" width={6} height={6} patternUnits="userSpaceOnUse">
            <path d="M0 6L6 0" stroke="rgba(255,255,255,0.35)" strokeWidth={0.8} />
          </pattern>

          {/* Hub shadow */}
          <filter id="hubShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx={0} dy={2} stdDeviation={4} floodColor="#6B4423" floodOpacity={0.2} />
          </filter>
        </defs>

        {/* Decorative outer rings */}
        <g aria-hidden="true">
          <circle cx={CX} cy={CY} r={R_OUTER + 20} fill="none" stroke="#E8DCC8" strokeWidth={1} opacity={0.3} />
          <circle cx={CX} cy={CY} r={R_OUTER + 10} fill="none" stroke="#E8DCC8" strokeWidth={0.5} opacity={0.2} strokeDasharray="4 4" />
          <circle cx={CX} cy={CY} r={R_ORBIT} fill="none" stroke="#C9A24D" strokeWidth={0.8} opacity={0.25} strokeDasharray="6 4" />
        </g>

        {/* Ambient particles */}
        <AmbientParticles reducedMotion={reducedMotion} />

        {/* Yuga sectors */}
        {YUGAS.map((yuga, i) => {
          const geom = SECTOR_GEOMS[i];
          const isSelected = selectedYuga === yuga.key;
          const isHovered = hoveredYuga === yuga.key;
          const pct = (yuga.proportion / TOTAL_PROPORTION) * 100;

          return (
            <g
              key={yuga.key}
              id={`yuga-sector-${yuga.key}`}
              role="button"
              tabIndex={0}
              aria-label={`${yuga.name} — ${yuga.devanagari}. ${yuga.proportion} of ${TOTAL_PROPORTION} parts, ${pct}% of Mahā-Yuga. ${yuga.humanYears.toLocaleString()} human years.`}
              aria-pressed={isSelected}
              onClick={() => onSelectYuga(yuga.key)}
              onMouseEnter={() => setHoveredYuga(yuga.key)}
              onMouseLeave={() => setHoveredYuga(null)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              style={{
                cursor: "pointer",
                outline: "none",
                transformOrigin: `${CX}px ${CY}px`,
                animation: showIncorrectShake(yuga.key)
                  ? "yugaShake 300ms ease-in-out"
                  : undefined,
              }}
              className="gl-focus-ring"
            >
              {/* Base sector */}
              <path
                d={geom.path}
                fill={`url(#grad-${yuga.key})`}
                stroke={isSelected ? "#F4C77B" : isHovered ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                opacity={isSelected ? 1 : isHovered ? 0.95 : 0.88}
                style={{
                  transition: reducedMotion ? "none" : "all 400ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                  filter: isSelected ? "url(#sectorGlow)" : undefined,
                }}
              />

              {/* Correct feedback pulse ring */}
              {showCorrectPulse(yuga.key) && (
                <circle
                  cx={geom.labelX}
                  cy={geom.labelY}
                  r={0}
                  fill="none"
                  stroke="#3A8C5A"
                  strokeWidth={3}
                  opacity={0.8}
                  style={{
                    animation: "yugaCorrectPulse 600ms ease-out forwards",
                  }}
                />
              )}

              {/* Sector label — name */}
              <text
                x={geom.labelX}
                y={geom.labelY - 6}
                textAnchor="middle"
                fill="#fff"
                fontSize={14}
                fontWeight={700}
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  pointerEvents: "none",
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  transition: reducedMotion ? "none" : "opacity 300ms ease",
                }}
              >
                {yuga.name}
              </text>

              {/* Sector label — proportion or value */}
              <text
                x={geom.labelX}
                y={geom.labelY + 10}
                textAnchor="middle"
                fill="rgba(255,255,255,0.9)"
                fontSize={12}
                fontWeight={600}
                style={{
                  fontFamily: "var(--font-sans), sans-serif",
                  pointerEvents: "none",
                  textShadow: "0 1px 2px rgba(0,0,0,0.35)",
                  transition: reducedMotion ? "none" : "opacity 300ms ease",
                }}
              >
                {mode === "proportion" && `${yuga.proportion}:1`}
                {mode === "absolute" && `${(yuga.humanYears / 1_000_000).toFixed(3)}M yrs`}
                {mode === "divya" && `${yuga.divyaYears.toLocaleString()} d.v.`}
                {mode === "sandhya" && `${yuga.proportion}:1`}
                {mode === "dharma" && `${yuga.proportion}:1`}
              </text>

              {/* Devanagari sub-label (only in proportion / dharma modes) */}
              {(mode === "proportion" || mode === "dharma") && (
                <text
                  x={geom.labelX}
                  y={geom.labelY + 26}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.75)"
                  fontSize={11}
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    pointerEvents: "none",
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {yuga.devanagari}
                </text>
              )}

              {/* Mode overlays */}
              {mode === "sandhya" && (
                <SandhyaOverlay yuga={yuga} geom={geom} reducedMotion={reducedMotion} />
              )}
              {mode === "dharma" && <DharmaOverlay yuga={yuga} geom={geom} />}
            </g>
          );
        })}

        {/* Hub circle */}
        <circle
          cx={CX}
          cy={CY}
          r={R_HUB}
          fill="#FFF9F0"
          stroke="#C9A24D"
          strokeWidth={1.5}
          strokeOpacity={0.35}
          filter="url(#hubShadow)"
          style={{ pointerEvents: "none" }}
        />
        <HubDisplay selectedYuga={activeYugaData} mode={mode} />

        {/* Orbital marker */}
        <OrbitalMarker angle={displayOrbitalAngle} reducedMotion={reducedMotion} />

        {/* Decorative corner marks */}
        <g aria-hidden="true" opacity={0.25}>
          <circle cx={CX} cy={CY - R_OUTER - 20} r={3} fill="#C9A24D" />
          <circle cx={CX} cy={CY + R_OUTER + 20} r={3} fill="#C9A24D" />
          <circle cx={CX - R_OUTER - 20} cy={CY} r={3} fill="#C9A24D" />
          <circle cx={CX + R_OUTER + 20} cy={CY} r={3} fill="#C9A24D" />
        </g>
      </svg>

      {/* CSS keyframe animations (injected via style tag for scoped use) */}
      <style>{`
        @keyframes yugaCorrectPulse {
          0% { r: 0; opacity: 0.9; stroke-width: 4; }
          100% { r: 60; opacity: 0; stroke-width: 0; }
        }
        @keyframes yugaShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        @keyframes yugaParticleFloat {
          0% { transform: translateY(0px) scale(1); opacity: 0.15; }
          50% { transform: translateY(-8px) scale(1.2); opacity: 0.35; }
          100% { transform: translateY(0px) scale(1); opacity: 0.15; }
        }
      `}</style>
    </div>
  );
});
