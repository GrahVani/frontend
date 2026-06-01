"use client";

import { useMemo } from "react";

/**
 * CelestialBackground — Ambient SVG starfield + floating orbs
 *
 * Responsive, resolution-independent, respects reduced motion.
 * Pure presentational component; no interaction state.
 */

function generateStars(count: number, seed: number) {
  const stars = [];
  let s = seed;
  const random = () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      cx: random() * 1200,
      cy: random() * 600,
      r: 0.5 + random() * 1.5,
      opacity: 0.2 + random() * 0.6,
      delay: random() * 5,
      duration: 2 + random() * 4,
    });
  }
  return stars;
}

interface CelestialBackgroundProps {
  reducedMotion?: boolean;
}

export function CelestialBackground({ reducedMotion = false }: CelestialBackgroundProps) {
  const stars = useMemo(() => generateStars(60, 42), []);

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.6 }}
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8B845" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#E8B845" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#E8B845" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D8DBE8" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#D8DBE8" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#D8DBE8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nebulaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C28220" stopOpacity="0.04" />
          <stop offset="50%" stopColor="#4A6FA5" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#A23A1E" stopOpacity="0.04" />
        </linearGradient>
      </defs>

      {/* Nebula wash */}
      <rect x="0" y="0" width="1200" height="600" fill="url(#nebulaGrad)" />

      {/* Stars */}
      {stars.map((star, i) => (
        <circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#FEFAEA"
          opacity={star.opacity}
        >
          {!reducedMotion && (
            <animate
              attributeName="opacity"
              values={`${star.opacity * 0.4};${star.opacity};${star.opacity * 0.4}`}
              dur={`${star.duration}s`}
              begin={`${star.delay}s`}
              repeatCount="indefinite"
            />
          )}
        </circle>
      ))}

      {/* Floating Sun orb */}
      <g>
        {!reducedMotion ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,-12; 0,0"
            dur="22s"
            repeatCount="indefinite"
          />
        ) : null}
        <circle cx="180" cy="140" r="60" fill="url(#sunGlow)" />
        <circle cx="180" cy="140" r="14" fill="#E8B845" opacity="0.9" />
        <circle cx="180" cy="140" r="6" fill="#FFE9A8" opacity="0.7" />
      </g>

      {/* Floating Moon orb */}
      <g>
        {!reducedMotion ? (
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0,0; 0,10; 0,0"
            dur="18s"
            repeatCount="indefinite"
          />
        ) : null}
        <circle cx="1020" cy="180" r="50" fill="url(#moonGlow)" />
        <circle cx="1020" cy="180" r="10" fill="#D8DBE8" opacity="0.85" />
        <path
          d="M 1018 175 A 6 6 0 1 1 1018 185 A 4 4 0 1 0 1018 175"
          fill="#B8BBCC"
          opacity="0.5"
        />
      </g>

      {/* Decorative orbital arcs (background only) */}
      <g fill="none" stroke="#C28220" strokeWidth="0.5" opacity="0.12">
        <ellipse cx="600" cy="300" rx="320" ry="180" />
        <ellipse cx="600" cy="300" rx="400" ry="220" opacity="0.08" />
      </g>
    </svg>
  );
}
