"use client";

import { useMemo } from "react";

interface CelestialSphereProps {
  latitude: number;
  declination: number;
  reducedMotion?: boolean;
}

export function CelestialSphere({ latitude, declination, reducedMotion = false }: CelestialSphereProps) {
  const cx = 200;
  const cy = 200;
  const r = 160; // sphere radius

  // Compute sunrise hour angle for visualization
  const phiRad = (latitude * Math.PI) / 180;
  const deltaRad = (declination * Math.PI) / 180;
  const cosH = -Math.tan(phiRad) * Math.tan(deltaRad);
  const Hdeg = cosH >= -1 && cosH <= 1 ? (Math.acos(cosH) * 180) / Math.PI : null;

  // Sun path: tilted circle. At latitude φ, the celestial equator is tilted by (90-φ) from vertical.
  // For visualization, we show a cross-section.
  const tiltDeg = 90 - latitude;

  // Sun position on the daily path (simplified arc representation)
  const sunX = useMemo(() => {
    if (Hdeg === null) return null;
    const angle = (Hdeg * Math.PI) / 180;
    // Project onto the sphere cross-section
    const x = cx - r * Math.cos(angle) * Math.cos((tiltDeg * Math.PI) / 180);
    const y = cy - r * Math.sin(angle);
    return { x, y };
  }, [Hdeg, tiltDeg]);

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full h-auto"
      role="img"
      aria-label={`Celestial sphere diagram showing Earth at centre, horizon plane, and Sun path at latitude ${latitude.toFixed(1)} degrees`}
    >
      <defs>
        <radialGradient id="earthGrad2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4A6FA5" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4A6FA5" stopOpacity="0.08" />
        </radialGradient>
        <linearGradient id="horizonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C28220" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#C28220" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C28220" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Celestial sphere outline */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#C28220" strokeWidth="0.5" opacity="0.15" />

      {/* Horizon plane (great circle, horizontal) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={r}
        ry={r * 0.15}
        fill="url(#horizonGrad)"
        stroke="#C28220"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Celestial equator (tilted by latitude) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={r * Math.cos((tiltDeg * Math.PI) / 180)}
        ry={r}
        fill="none"
        stroke="#4A6FA5"
        strokeWidth="0.75"
        opacity="0.35"
        transform={`rotate(${tiltDeg > 90 ? tiltDeg - 180 : tiltDeg} ${cx} ${cy})`}
      />

      {/* Sun's daily path (simplified arc) */}
      {Hdeg !== null && (
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r * 0.6} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#E8B845"
          strokeWidth="1.5"
          opacity="0.5"
          transform={`rotate(${-tiltDeg} ${cx} ${cy})`}
        />
      )}

      {/* Earth at centre */}
      <circle cx={cx} cy={cy} r="24" fill="url(#earthGrad2)" />
      <circle cx={cx} cy={cy} r="20" fill="none" stroke="#4A6FA5" strokeWidth="0.75" opacity="0.4" />
      {/* Axis tilt indicator */}
      <line
        x1={cx}
        y1={cy - 20}
        x2={cx}
        y2={cy + 20}
        stroke="#4A6FA5"
        strokeWidth="0.5"
        opacity="0.3"
        transform={`rotate(23.5 ${cx} ${cy})`}
      />

      {/* Sun at sunrise position */}
      {sunX && Hdeg !== null && (
        <g>
          <circle cx={sunX.x} cy={sunX.y} r="8" fill="#E8B845" opacity="0.9">
            {!reducedMotion && (
              <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
            )}
          </circle>
          <circle cx={sunX.x} cy={sunX.y} r="4" fill="#FFE9A8" opacity="0.8" />
        </g>
      )}

      {/* Hour angle arc label */}
      {Hdeg !== null && (
        <text
          x={cx - r * 0.5}
          y={cy - 12}
          textAnchor="middle"
          fill="#4A6FA5"
          fontSize="10"
          fontFamily="var(--font-sans), system-ui, sans-serif"
          opacity="0.8"
        >
          H ≈ {Hdeg.toFixed(1)}°
        </text>
      )}

      {/* Labels */}
      <text x={cx} y={cy + r + 18} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize="9" opacity="0.7">
        Horizon
      </text>
      <text x={cx - r - 8} y={cy} textAnchor="end" fill="#4A6FA5" fontSize="9" opacity="0.6">
        West
      </text>
      <text x={cx + r + 8} y={cy} textAnchor="start" fill="#4A6FA5" fontSize="9" opacity="0.6">
        East
      </text>

      {/* Polar day/night indicator */}
      {Hdeg === null && (
        <g>
          <rect x={cx - 70} y={cy - 20} width="140" height="40" rx="6" fill="#A23A1E15" stroke="#A23A1E" strokeWidth="1" opacity="0.8" />
          <text x={cx} y={cy - 2} textAnchor="middle" fill="#A23A1E" fontSize="11" fontWeight="600">
            {cosH > 1 ? "Polar Night" : "Polar Day"}
          </text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#A23A1E" fontSize="9" opacity="0.8">
            No sunrise on this date
          </text>
        </g>
      )}
    </svg>
  );
}
