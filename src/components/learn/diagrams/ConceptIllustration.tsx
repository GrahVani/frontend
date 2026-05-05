"use client";

import React from "react";

const PALETTES: Record<string, { primary: string; bg: string; light: string; accent: string }> = {
  "zodiac": { primary: "#d97706", bg: "#fffbeb", light: "#fef3c7", accent: "#f59e0b" },
  "planet": { primary: "#dc2626", bg: "#fef2f2", light: "#fee2e2", accent: "#ef4444" },
  "house": { primary: "#7c3aed", bg: "#f5f3ff", light: "#ede9fe", accent: "#8b5cf6" },
  "nakshatra": { primary: "#059669", bg: "#ecfdf5", light: "#d1fae5", accent: "#10b981" },
  "ayanamsa": { primary: "#0891b2", bg: "#ecfeff", light: "#cffafe", accent: "#06b6d4" },
  "panchang": { primary: "#c2410c", bg: "#fff7ed", light: "#ffedd5", accent: "#ea580c" },
  "drishti": { primary: "#4f46e5", bg: "#eef2ff", light: "#e0e7ff", accent: "#6366f1" },
  "default": { primary: "#d97706", bg: "#fffbeb", light: "#fef3c7", accent: "#f59e0b" },
};

function getPalette(title: string) {
  const t = title.toLowerCase();
  if (t.includes("zodiac") || t.includes("rashi")) return PALETTES.zodiac;
  if (t.includes("planet") || t.includes("navagraha") || t.includes("graha")) return PALETTES.planet;
  if (t.includes("house") || t.includes("bhava")) return PALETTES.house;
  if (t.includes("nakshatra")) return PALETTES.nakshatra;
  if (t.includes("ayanamsa")) return PALETTES.ayanamsa;
  if (t.includes("panchang") || t.includes("tithi") || t.includes("nakshatra")) return PALETTES.panchang;
  if (t.includes("drishti") || t.includes("aspect")) return PALETTES.drishti;
  return PALETTES.default;
}

function getInitials(title: string) {
  return title
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase())
    .join("")
    .slice(0, 3);
}

export default function ConceptIllustration({
  title,
  subtitle,
  size = 480,
}: {
  title: string;
  subtitle?: string;
  size?: number;
}) {
  // Guard: don't render if title is just the diagram type keyword
  const isRawKeyword = /^[a-z]+-[a-z]+$/.test(title) && title.length < 25;
  const displayTitle = isRawKeyword ? "Interactive Concept" : title;
  const displaySubtitle = subtitle && subtitle !== "Interactive concept visualization." ? subtitle : "Tap to explore this concept in detail.";

  const colors = getPalette(displayTitle);
  const initials = getInitials(displayTitle);
  const words = displayTitle.replace(/["']/g, "").split(" ").filter(Boolean);

  return (
    <svg viewBox={`0 0 ${size} ${size * 0.55}`} className="w-full h-auto max-w-[520px] mx-auto">
      <defs>
        <filter id="ciShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodOpacity="0.12" />
        </filter>
        <linearGradient id="ciGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.bg} />
          <stop offset="100%" stopColor={colors.light} />
        </linearGradient>
        <linearGradient id="ciBar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
      </defs>

      {/* Card background */}
      <rect x={size * 0.03} y={size * 0.03} width={size * 0.94} height={size * 0.49} rx={size * 0.035} fill="url(#ciGrad)" stroke={colors.primary} strokeWidth="1.5" filter="url(#ciShadow)" />

      {/* Decorative orbs */}
      <circle cx={size * 0.15} cy={size * 0.15} r={size * 0.09} fill={colors.primary} opacity="0.06" />
      <circle cx={size * 0.85} cy={size * 0.38} r={size * 0.11} fill={colors.accent} opacity="0.05" />

      {/* Left accent bar */}
      <rect x={size * 0.03} y={size * 0.10} width={size * 0.018} height={size * 0.35} rx={size * 0.009} fill="url(#ciBar)" />

      {/* Initials circle */}
      <circle cx={size * 0.76} cy={size * 0.20} r={size * 0.10} fill="#fff" stroke={colors.primary} strokeWidth="2" />
      <text x={size * 0.76} y={size * 0.20} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.065} fontWeight="800" fill={colors.primary}>
        {initials}
      </text>

      {/* Title */}
      <text x={size * 0.1} y={size * 0.17} fontSize={size * 0.05} fontWeight="800" fill="#1f2937">
        {words[0] || "Concept"}
      </text>
      {words[1] && (
        <text x={size * 0.1} y={size * 0.24} fontSize={size * 0.035} fontWeight="600" fill={colors.primary}>
          {words.slice(1).join(" ")}
        </text>
      )}

      {/* Subtitle */}
      <text x={size * 0.1} y={size * 0.32} fontSize={size * 0.026} fill="#6b7280">
        {displaySubtitle.length > 55 ? displaySubtitle.slice(0, 55) + "..." : displaySubtitle}
      </text>

      {/* Bottom line */}
      <line x1={size * 0.1} y1={size * 0.40} x2={size * 0.55} y2={size * 0.40} stroke={colors.primary} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />

      {/* Bottom tag */}
      <rect x={size * 0.1} y={size * 0.42} width={size * 0.24} height={size * 0.055} rx={size * 0.027} fill={colors.primary} opacity="0.9" />
      <text x={size * 0.22} y={size * 0.447} textAnchor="middle" dominantBaseline="central" fontSize={size * 0.022} fontWeight="600" fill="#fff">
        Vedic Astrology
      </text>
    </svg>
  );
}
