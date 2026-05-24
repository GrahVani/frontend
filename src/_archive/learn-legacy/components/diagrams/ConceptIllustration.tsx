"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Lightbulb, ArrowRight } from "lucide-react";

const PALETTES: Record<string, { from: string; to: string; accent: string; border: string; text: string }> = {
  "zodiac": { from: "#fef3c7", to: "#fffbeb", accent: "#f59e0b", border: "#fcd34d", text: "#b45309" },
  "planet": { from: "#fee2e2", to: "#fef2f2", accent: "#ef4444", border: "#fca5a5", text: "#b91c1c" },
  "house": { from: "#ede9fe", to: "#f5f3ff", accent: "#8b5cf6", border: "#c4b5fd", text: "#6d28d9" },
  "nakshatra": { from: "#d1fae5", to: "#ecfdf5", accent: "#10b981", border: "#6ee7b7", text: "#047857" },
  "ayanamsa": { from: "#cffafe", to: "#ecfeff", accent: "#06b6d4", border: "#67e8f9", text: "#0e7490" },
  "panchang": { from: "#ffedd5", to: "#fff7ed", accent: "#ea580c", border: "#fdba74", text: "#c2410c" },
  "drishti": { from: "#e0e7ff", to: "#eef2ff", accent: "#6366f1", border: "#a5b4fc", text: "#4338ca" },
  "yoga": { from: "#fce7f3", to: "#fdf2f8", accent: "#ec4899", border: "#f9a8d4", text: "#be185d" },
  "dignity": { from: "#dbeafe", to: "#eff6ff", accent: "#3b82f6", border: "#93c5fd", text: "#1d4ed8" },
  "transit": { from: "#f3e8ff", to: "#faf5ff", accent: "#a855f7", border: "#d8b4fe", text: "#7e22ce" },
  "default": { from: "#f1f5f9", to: "#f8fafc", accent: "#64748b", border: "#cbd5e1", text: "#334155" },
};

function getPalette(title: string) {
  const t = title.toLowerCase();
  if (t.includes("zodiac") || t.includes("rashi")) return PALETTES.zodiac;
  if (t.includes("planet") || t.includes("navagraha") || t.includes("graha")) return PALETTES.planet;
  if (t.includes("house") || t.includes("bhava")) return PALETTES.house;
  if (t.includes("nakshatra")) return PALETTES.nakshatra;
  if (t.includes("ayanamsa")) return PALETTES.ayanamsa;
  if (t.includes("panchang") || t.includes("tithi")) return PALETTES.panchang;
  if (t.includes("drishti") || t.includes("aspect")) return PALETTES.drishti;
  if (t.includes("yoga")) return PALETTES.yoga;
  if (t.includes("dignity") || t.includes("exalt")) return PALETTES.dignity;
  if (t.includes("transit") || t.includes("gochara")) return PALETTES.transit;
  return PALETTES.default;
}

function getIcon(title: string) {
  const t = title.toLowerCase();
  if (t.includes("definition")) return "BookOpen";
  if (t.includes("logic")) return "Lightbulb";
  if (t.includes("use case")) return "Target";
  if (t.includes("software")) return "Code";
  return "Sparkles";
}

export default function ConceptIllustration({
  title,
  subtitle,
  size = 640,
}: {
  title: string;
  subtitle?: string;
  size?: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRawKeyword = /^[a-z]+-[a-z]+$/.test(title) && title.length < 25;
  const displayTitle = isRawKeyword ? "Interactive Concept" : title;
  const displaySubtitle = subtitle && subtitle !== "Interactive concept visualization." ? subtitle : "Tap to explore this concept in detail.";

  // Skip rendering for generic structural labels that have no visual meaning
  const genericLabels = ["the definition", "the logic", "the concept", "the use case", "software logic"];
  const isGenericLabel = genericLabels.some(l => displayTitle.toLowerCase().startsWith(l));
  if (isGenericLabel) {
    return (
      <div className="w-full max-w-[640px] mx-auto p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100 text-center">
        <p className="text-xs text-gray-400 italic">Interactive concept visualization available in the lesson content above.</p>
      </div>
    );
  }

  const colors = getPalette(displayTitle);
  const words = displayTitle.replace(/["']/g, "").split(" ").filter(Boolean);
  const mainWord = words[0] || "Concept";
  const restWords = words.slice(1).join(" ") || "";

  return (
    <div
      className={`relative w-full max-w-[640px] mx-auto transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative rounded-3xl border p-6 sm:p-8 overflow-hidden transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
          borderColor: colors.border,
          boxShadow: hovered
            ? `0 20px 60px -15px ${colors.accent}30, 0 0 0 1px ${colors.border}60`
            : `0 4px 24px -8px ${colors.accent}20, 0 0 0 1px ${colors.border}40`,
        }}
      >
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-pulse"
              style={{
                width: `${20 + i * 15}px`,
                height: `${20 + i * 15}px`,
                background: colors.accent,
                left: `${10 + i * 15}%`,
                top: `${15 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Glass overlay */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 100%)",
            backdropFilter: "blur(1px)",
          }}
        />

        <div className="relative z-10">
          {/* Top row: icon + category badge */}
          <div className="flex items-center justify-between mb-5">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
              style={{ background: `${colors.accent}15`, color: colors.text, border: `1px solid ${colors.border}` }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Vedic Astrology
            </div>
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-extrabold"
              style={{ background: `${colors.accent}15`, color: colors.text, border: `2px solid ${colors.border}` }}
            >
              {mainWord[0]?.toUpperCase()}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
            {mainWord}
            {restWords && (
              <span className="block text-lg sm:text-xl font-semibold mt-1" style={{ color: colors.text }}>
                {restWords}
              </span>
            )}
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[90%]">
            {displaySubtitle.length > 100 ? displaySubtitle.slice(0, 100) + "..." : displaySubtitle}
          </p>

          {/* Action bar */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
              style={{
                background: colors.accent,
                color: "#fff",
                boxShadow: hovered ? `0 8px 24px -8px ${colors.accent}80` : "none",
                transform: hovered ? "translateX(4px)" : "translateX(0)",
              }}
            >
              <Lightbulb className="w-4 h-4" />
              Explore Concept
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: colors.accent }} />
              Interactive Diagram
            </div>
          </div>
        </div>

        {/* Bottom decorative line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl transition-all duration-300"
          style={{
            background: `linear-gradient(90deg, ${colors.accent}60, ${colors.accent}, ${colors.accent}60)`,
            opacity: hovered ? 1 : 0.5,
          }}
        />
      </div>
    </div>
  );
}
