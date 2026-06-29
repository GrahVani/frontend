"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { IAST } from "../../chrome/typography";
import { RASHIS, polarToCartesian, describeArc, midAngle, GRAHA_SYMBOLS, type RashiData } from "../rashi-data";

const PRESETS = [
  { label: "Meṣa 0°", deg: 0, desc: "0° — Aries start (spring equinox point)" },
  { label: "Meṣa 15°", deg: 15, desc: "15° — Heart of Aries" },
  { label: "Tulā 0°", deg: 180, desc: "180° — Libra start (opposite axis)" },
  { label: "Makara 0°", deg: 270, desc: "270° — Capricorn start (winter solstice)" },
  { label: "Mithuna 15°", deg: 75, desc: "75° — Gemini mid-point" },
  { label: "Mīna 30°", deg: 359.99, desc: "359.99° — Pisces end / zodiac close" },
  { label: "Siṁha 5°", deg: 125, desc: "125° — Leo 5° (Sun mūla-trikoṇa)" },
  { label: "Karka 5°", deg: 95, desc: "95° — Cancer 5° (Jupiter exalted)" },
];

/* ─── Element badge colours (design-token aligned) ─── */
const ELEMENT_META: Record<string, { icon: string; glow: string }> = {
  Fire: { icon: "🔥", glow: "#C9A24D" },
  Earth: { icon: "🜃", glow: "#6B8E6B" },
  Air: { icon: "🜁", glow: "#7BA7C0" },
  Water: { icon: "🜄", glow: "#5A8A9A" },
};

/* ─── 3D wheel constants ─── */
const CX = 210;
const CY = 210;
const R_OUTER = 190;
const R_INNER = 95;
const R_HUB = 55;
const WHEEL_TEXT = "#3F2D1D";
const WHEEL_MUTED = "#5C4630";
const WHEEL_GOLD = "#8F6818";

/* Smooth step helper for colour interpolation */
function hexToRgb(hex: string) {
  const n = hex.replace("#", "");
  return {
    r: parseInt(n.slice(0, 2), 16),
    g: parseInt(n.slice(2, 4), 16),
    b: parseInt(n.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function blendWithBase(color: string, base: string, alpha: number) {
  const c = hexToRgb(color);
  const b = hexToRgb(base);
  return rgbToHex(
    c.r * alpha + b.r * (1 - alpha),
    c.g * alpha + b.g * (1 - alpha),
    c.b * alpha + b.b * (1 - alpha)
  );
}

/* ─── Step-by-step formula breakdown ─── */
function StepByStepFormula({
  rawLongitude,
  siderealLongitude,
  mode,
  ayanamsa,
}: {
  rawLongitude: number;
  siderealLongitude: number;
  mode: "sidereal" | "tropical";
  ayanamsa: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const step2 = siderealLongitude / 30;
  const step3 = Math.floor(step2);
  const step4 = step3 + 1;
  const rashi = RASHIS[Math.min(step3, 11)];
  const degInRashi = siderealLongitude % 30;
  const steps = [
    ...(mode === "tropical"
      ? [{ n: 0, color: "#5A8A9A", text: `Convert tropical → sidereal: ${rawLongitude.toFixed(2)}° − ${ayanamsa}° (ayanāṁśa) = ${siderealLongitude.toFixed(2)}°` }]
      : []),
    { n: 1, color: "var(--gl-gold-accent)", text: `Sidereal longitude: ${siderealLongitude.toFixed(2)}°` },
    { n: 2, color: "var(--gl-gold-accent)", text: `Divide by 30°: ${siderealLongitude.toFixed(2)} / 30 = ${step2.toFixed(4)}` },
    { n: 3, color: "var(--gl-gold-accent)", text: `Floor (integer part): floor(${step2.toFixed(4)}) = ${step3} (0-indexed)` },
    { n: 4, color: "var(--gl-gold-accent)", text: `Add 1 for 1-based: ${step3} + 1 = Rāśi #${step4}` },
    { n: 5, color: "#A23A1E", text: `Lookup: ${rashi.nameDevanagari} ${rashi.nameIAST}` },
    { n: 6, color: "#4A90A4", text: `Degrees within rāśi: ${degInRashi.toFixed(2)}° of ${rashi.nameIAST}` },
  ];

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--gl-gold-hairline)" }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors hover:bg-[var(--gl-surface-manuscript)]"
        style={{ background: "var(--gl-surface-twilight-glass)", color: "var(--gl-ink-secondary)" }}
      >
        <span className="flex items-center gap-2">
          <span style={{ color: "var(--gl-gold-accent)" }}>📐</span>
          Step-by-step formula breakdown
        </span>
        <motion.span animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-2.5 text-xs" style={{ background: "var(--gl-surface-manuscript)" }}>
              {steps.map((s) => (
                <div key={s.n} className="flex items-center gap-2.5">
                  <span
                    className="px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0"
                    style={{ background: s.color, color: "#fff" }}
                  >
                    {s.n === 0 ? "Δ" : s.n}
                  </span>
                  <span style={{ color: "var(--gl-ink-primary)" }}>{s.text}</span>
                </div>
              ))}
              <div className="pt-2 text-[11px]" style={{ color: "var(--gl-ink-muted)" }}>
                Formula:{" "}
                <code
                  className="px-2 py-1 rounded-md"
                  style={{ background: "var(--gl-surface-twilight-glass)", fontSize: 11 }}
                >
                  rāśi = floor(longitude / 30) + 1
                </code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Main component ─── */
export function RashiBoundaryWheel() {
  const shouldReduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(1);
  const [longitude, setLongitude] = useState<number>(15);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showNakshatras, setShowNakshatras] = useState(false);
  const [mode, setMode] = useState<"sidereal" | "tropical">("sidereal");
  const [hovered, setHovered] = useState<number | null>(null);
  const [focusedSegment, setFocusedSegment] = useState<number | null>(null);

  // Lahiri ayanāṁśa ≈ 24° in 2026 (lesson §4.3 + Worked Ex2). The wheel is ALWAYS the
  // sidereal zodiac; "tropical" mode interprets the typed longitude as tropical and
  // subtracts the ayanāṁśa — so a near-boundary planet visibly jumps a sign (§7 try-it #3).
  const AYANAMSA = 24;
  const siderealLongitude = useMemo(
    () => (mode === "tropical" ? (((longitude - AYANAMSA) % 360) + 360) % 360 : longitude),
    [longitude, mode]
  );

  const computedRashi = useMemo(
    () => Math.min(Math.floor(siderealLongitude / 30), 11),
    [siderealLongitude]
  );

  const activeRashi = RASHIS[computedRashi];

  // Keep the highlighted segment in lock-step with the computed (sidereal) rāśi,
  // so it stays correct when the sidereal/tropical mode is toggled.
  useEffect(() => {
    setSelected(computedRashi + 1);
  }, [computedRashi]);

  // Raw longitude (per current mode) that lands a planet at the centre of rāśi n.
  const rawForRashi = useCallback(
    (n: number) => {
      const center = RASHIS[n - 1].startDegree + 15;
      return mode === "tropical" ? (center + AYANAMSA) % 360 : center;
    },
    [mode]
  );

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const prev = selected === null ? 1 : ((selected - 2 + 12) % 12) + 1;
        setLongitude(rawForRashi(prev));
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        const next = selected === null ? 1 : (selected % 12) + 1;
        setLongitude(rawForRashi(next));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, rawForRashi]);

  const handleSegmentClick = useCallback(
    (rashi: RashiData) => {
      setLongitude(rawForRashi(rashi.number));
    },
    [rawForRashi]
  );

  const handleSegmentHover = useCallback(
    (rashi: RashiData | null) => {
      setHovered(rashi ? rashi.number : null);
    },
    []
  );

  /* 3D depth base colour (parchment-ish) */
  const BASE_BG = "#FAEFD8";

  return (
    <div className="w-full" style={{ fontFamily: "var(--font-sans)" }}>
      {/* ── Preset pills ── */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {PRESETS.map((p) => {
          const isActive = Math.abs(longitude - p.deg) < 0.1;
          return (
            <motion.button
              key={p.label}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={() => setLongitude(p.deg)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: isActive ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
                color: isActive ? "#1a1a2e" : "var(--gl-ink-secondary)",
                border: `1px solid ${isActive ? "var(--gl-gold-accent)" : "var(--gl-gold-hairline)"}`,
                boxShadow: isActive ? `0 2px 12px var(--gl-gold-accent)40` : "none",
              }}
              title={p.desc}
            >
              {p.label}
            </motion.button>
          );
        })}
      </div>

      {/* ── Controls bar ── */}
      <div
        className="flex flex-wrap gap-4 mb-5 items-center p-4 rounded-xl"
        style={{
          background: "var(--gl-surface-twilight-glass)",
          border: "1px solid var(--gl-gold-hairline)",
        }}
      >
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium" style={{ color: "var(--gl-ink-secondary)" }}>
            Longitude
          </label>
          <input
            type="number"
            min={0}
            max={360}
            step={0.01}
            value={longitude}
            onChange={(e) => {
              const v = Math.min(360, Math.max(0, parseFloat(e.target.value) || 0));
              setLongitude(v);
            }}
            className="px-3 py-1.5 rounded-lg text-sm w-24 outline-none"
            style={{
              background: "var(--gl-surface-manuscript)",
              border: "1px solid var(--gl-gold-hairline)",
              color: "var(--gl-ink-primary)",
            }}
          />
          <span className="text-sm font-semibold" style={{ color: "var(--gl-gold-accent)" }}>
            °
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          step={0.1}
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          className="flex-1 min-w-[140px] accent-[var(--gl-gold-accent)]"
          style={{ accentColor: "var(--gl-gold-accent)" }}
        />
        <motion.button
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          onClick={() => setShowBoundaries((s) => !s)}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: showBoundaries ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
            color: showBoundaries ? "#1a1a2e" : "var(--gl-ink-primary)",
            border: "1px solid var(--gl-gold-accent)",
          }}
        >
          {showBoundaries ? "Hide" : "Show"} Boundaries
        </motion.button>
        <motion.button
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          onClick={() => setShowNakshatras((s) => !s)}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: showNakshatras ? "#5A8A9A" : "var(--gl-surface-manuscript)",
            color: showNakshatras ? "#fff" : "var(--gl-ink-primary)",
            border: "1px solid #5A8A9A",
          }}
        >
          {showNakshatras ? "Hide" : "Show"} Nakṣatras
        </motion.button>
        <div
          className="flex rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--gl-gold-accent)" }}
          role="group"
          aria-label="Zodiac reference frame"
        >
          {(["sidereal", "tropical"] as const).map((m) => (
            <motion.button
              key={m}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              onClick={() => setMode(m)}
              className="px-3 py-1.5 text-xs font-semibold capitalize"
              style={{
                background: mode === m ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
                color: mode === m ? "#1a1a2e" : "var(--gl-ink-primary)",
              }}
              title={
                m === "tropical"
                  ? "Interpret the typed longitude as tropical — subtracts the ~24° ayanāṁśa before assigning a rāśi"
                  : "Interpret the typed longitude as sidereal (nirayana) — the Jyotiṣa convention"
              }
            >
              {m}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Formula banner ── */}
      <div
        className="mb-6 p-4 rounded-xl"
        style={{
          background: "var(--gl-surface-twilight-glass)",
          border: "1px solid var(--gl-gold-hairline)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
            {mode === "tropical" && (
              <code
                className="px-2 py-1 rounded-md text-xs mr-2"
                style={{ background: "#5A8A9A20", color: "#3F6B7A", border: "1px solid #5A8A9A55" }}
              >
                tropical {longitude.toFixed(2)}° − {AYANAMSA}° = sidereal {siderealLongitude.toFixed(2)}°
              </code>
            )}
            <code
              className="px-2 py-1 rounded-md text-xs mr-2"
              style={{ background: "var(--gl-surface-manuscript)", color: "var(--gl-ink-primary)" }}
            >
              rāśi = floor({siderealLongitude.toFixed(2)} / 30) + 1
            </code>
            ={" "}
            <strong style={{ color: "var(--gl-gold-accent)", fontSize: 18 }}>
              {computedRashi + 1}
            </strong>
            <span className="mx-2" style={{ color: "var(--gl-ink-muted)" }}>·</span>
            <span style={{ fontFamily: "var(--font-devanagari)", color: activeRashi.color, fontSize: 16 }}>
              {activeRashi.nameDevanagari}
            </span>
            <span className="mx-1.5" style={{ color: "var(--gl-ink-muted)" }}>
              <IAST>{activeRashi.nameIAST}</IAST>
            </span>
            <span style={{ color: "var(--gl-ink-muted)", fontSize: 12 }}>
              (remainder: {(siderealLongitude % 30).toFixed(2)}°)
            </span>
          </span>
        </div>
        <StepByStepFormula
          rawLongitude={longitude}
          siderealLongitude={siderealLongitude}
          mode={mode}
          ayanamsa={AYANAMSA}
        />
      </div>

      {/* ── Main layout: wheel + detail ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Wheel ── */}
        <div className="flex-shrink-0 mx-auto lg:mx-0" style={{ maxWidth: 560 }}>
          <svg
            viewBox="0 0 420 420"
            className="w-full"
            role="img"
            aria-label="Interactive 12-segment Sidereal Zodiac Wheel representing rashi boundaries"
            style={{ maxWidth: 560, filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.12))" }}
          >
            <defs>
              {/* 3D bevel filter */}
              <filter id="bevel" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
                <feOffset in="blur" dx="1" dy="2" result="offsetBlur" />
                <feSpecularLighting
                  in="blur"
                  surfaceScale="3"
                  specularConstant="0.8"
                  specularExponent="16"
                  result="specOut"
                >
                  <fePointLight x="-500" y="-500" z="400" />
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                <feComposite
                  in="SourceGraphic"
                  in2="specOut"
                  operator="arithmetic"
                  k1="0"
                  k2="1"
                  k3="0.4"
                  k4="0"
                  result="litPaint"
                />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="litPaint" />
                </feMerge>
              </filter>

              {/* Glow filter for selected segments */}
              <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Inner hub gradient */}
              <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF9F0" />
                <stop offset="60%" stopColor="#F2E6D0" />
                <stop offset="100%" stopColor="#E7D6B8" />
              </radialGradient>

              {/* Outer rim gradient */}
              <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--gl-gold-light, #F4C77B)" />
                <stop offset="50%" stopColor="var(--gl-gold-accent, #9C7A2F)" />
                <stop offset="100%" stopColor="var(--gl-gold-deep, #7A5E1E)" />
              </linearGradient>

              {/* Shadow for depth */}
              <filter id="wheelShadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.15" />
              </filter>
            </defs>

            {/* Outer decorative rim */}
            <circle
              cx={CX}
              cy={CY}
              r={R_OUTER + 8}
              fill="none"
              stroke="url(#rimGrad)"
              strokeWidth={3}
              opacity={0.6}
            />
            <circle
              cx={CX}
              cy={CY}
              r={R_OUTER + 4}
              fill="none"
              stroke="var(--gl-gold-hairline)"
              strokeWidth={1}
            />

            {/* Background disc */}
            <circle
              cx={CX}
              cy={CY}
              r={R_OUTER}
              fill={BASE_BG}
              stroke={WHEEL_GOLD}
              strokeOpacity={0.75}
              strokeWidth={2}
              filter="url(#wheelShadow)"
            />

            {/* Inner ring guide */}
            <circle
              cx={CX}
              cy={CY}
              r={R_INNER}
              fill="none"
              stroke={WHEEL_GOLD}
              strokeOpacity={0.45}
              strokeWidth={1.25}
              strokeDasharray="4 4"
            />

            {/* ── Boundary ticks ── */}
            <AnimatePresence>
              {showBoundaries &&
                Array.from({ length: 12 }).map((_, i) => {
                  const angle = i * 30;
                  const outer = polarToCartesian(CX, CY, R_OUTER + 14, angle);
                  const inner = polarToCartesian(CX, CY, R_OUTER, angle);
                  return (
                    <g key={`tick-${i}`}>
                      <line
                        x1={inner.x}
                        y1={inner.y}
                        x2={outer.x}
                        y2={outer.y}
                        stroke={WHEEL_GOLD}
                        strokeWidth={2}
                        opacity={0.95}
                      />
                      <text
                        x={outer.x}
                        y={outer.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={WHEEL_GOLD}
                        fontSize={12}
                        fontWeight={900}
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {i * 30}°
                      </text>
                    </g>
                  );
                })}
            </AnimatePresence>

            {/* ── Nakṣatra overlay: 27 ticks, grouped 9-per-4-rāśi block (§4.4) ── */}
            {showNakshatras &&
              Array.from({ length: 27 }).map((_, i) => {
                const angle = i * (360 / 27); // 13°20′ each
                const block = Math.floor(i / 9); // 3 blocks of 9 = 3 × (4 rāśis)
                const blockColors = ["#5A8A9A", "#8B5FC0", "#C9A24D"];
                const c = blockColors[block];
                const out = polarToCartesian(CX, CY, R_OUTER - 1, angle);
                const inn = polarToCartesian(CX, CY, R_OUTER - 13, angle);
                const isBlockStart = i % 9 === 0; // coincides with rāśi boundaries 0°/120°/240°
                return (
                  <line
                    key={`nak-${i}`}
                    x1={inn.x}
                    y1={inn.y}
                    x2={out.x}
                    y2={out.y}
                    stroke={c}
                    strokeWidth={isBlockStart ? 2.5 : 1.2}
                    opacity={isBlockStart ? 0.95 : 0.6}
                  />
                );
              })}

            {/* ── Rashi segments ── */}
            {RASHIS.map((rashi) => {
              const startAngle = rashi.startDegree;
              const endAngle = rashi.endDegree;
              const isSelected = selected === rashi.number;
              const isHovered = hovered === rashi.number;
              const isFocused = focusedSegment === rashi.number;
              const isActiveComputed = computedRashi + 1 === rashi.number;

              const path = describeArc(CX, CY, R_OUTER, startAngle, endAngle);
              const m = midAngle(startAngle, endAngle);
              const labelPos = polarToCartesian(CX, CY, (R_OUTER + R_INNER) / 2, m);
              const lordPos = polarToCartesian(CX, CY, (R_INNER + R_HUB) / 2 + 8, m);

              /* Colour intensity based on state */
              const fillAlpha = isSelected ? 0.42 : isHovered ? 0.32 : isActiveComputed ? 0.26 : 0.16;
              const fillColor = blendWithBase(rashi.color, BASE_BG, fillAlpha);
              const strokeColor = isSelected ? rashi.color : isHovered ? rashi.color : `${rashi.color}85`;
              const strokeWidth = isSelected ? 3.5 : isHovered ? 2.5 : 1.25;

              return (
                <g 
                  key={rashi.number}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${rashi.nameDevanagari} ${rashi.nameIAST} (${rashi.nameEnglish}) segment, spanning from ${rashi.startDegree} to ${rashi.endDegree} degrees`}
                  style={{ cursor: "pointer", outline: "none" }}
                  onClick={() => handleSegmentClick(rashi)}
                  onMouseEnter={() => handleSegmentHover(rashi)}
                  onMouseLeave={() => handleSegmentHover(null)}
                  onFocus={() => setFocusedSegment(rashi.number)}
                  onBlur={() => setFocusedSegment(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSegmentClick(rashi);
                      e.preventDefault();
                    }
                  }}
                >
                  {/* Segment path */}
                  <motion.path
                    d={path}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={isSelected ? "url(#glow)" : undefined}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    /* Note: SVG transform-origin needs to be set via CSS for Framer */
                    initial={false}
                    style={{ pointerEvents: "auto" }}
                  />

                  {/* Focused segment outline */}
                  {isFocused && (
                    <path
                      d={path}
                      fill="none"
                      stroke="var(--gl-gold-accent)"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      style={{ pointerEvents: "none" }}
                    />
                  )}

                  {/* Devanagari name */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={WHEEL_TEXT}
                    fontSize={18}
                    fontWeight={900}
                    fontFamily="var(--font-devanagari)"
                    style={{ pointerEvents: "none" }}
                  >
                    {rashi.nameDevanagari}
                  </text>

                  {/* IAST name (small) */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={WHEEL_TEXT}
                    fontSize={12}
                    fontWeight={800}
                    fontFamily="var(--font-cormorant)"
                    style={{ pointerEvents: "none" }}
                  >
                    {rashi.nameIAST}
                  </text>

                  {/* Degree range */}
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 22}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={WHEEL_MUTED}
                    fontSize={10.5}
                    fontWeight={800}
                    style={{ pointerEvents: "none" }}
                  >
                    {rashi.startDegree}°–{rashi.endDegree}°
                  </text>

                  {/* Lord symbol in inner ring */}
                  <text
                    x={lordPos.x}
                    y={lordPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={WHEEL_TEXT}
                    fontSize={14}
                    fontWeight={900}
                    style={{ pointerEvents: "none", fontFamily: "var(--font-sans)" }}
                  >
                    {rashi.lord.slice(0, 3)}
                  </text>
                </g>
              );
            })}

            {/* ── Center hub ── */}
            <circle cx={CX} cy={CY} r={R_HUB} fill="url(#hubGrad)" stroke={WHEEL_GOLD} strokeOpacity={0.85} strokeWidth={2} filter="url(#bevel)" />
            <circle cx={CX} cy={CY} r={R_HUB - 6} fill="none" stroke={WHEEL_GOLD} strokeOpacity={0.35} strokeWidth={1.25} />

            {/* Hub text */}
            <text
              x={CX}
              y={CY - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={WHEEL_GOLD}
              fontSize={15}
              fontFamily="var(--font-cormorant)"
              fontWeight={700}
              letterSpacing={1}
            >
              Sidereal
            </text>
            <text
              x={CX}
              y={CY + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={WHEEL_TEXT}
              fontSize={12}
              fontWeight={800}
              fontFamily="var(--font-sans)"
            >
              0° – 360°
            </text>

            {/* ── Longitude marker with trail ── */}
            {(() => {
              const markerAngle = siderealLongitude;
              const pos = polarToCartesian(CX, CY, R_OUTER - 8, markerAngle);
              const innerPos = polarToCartesian(CX, CY, R_INNER + 4, markerAngle);
              return (
                <g>
                  {/* Trail line */}
                  <line
                    x1={innerPos.x}
                    y1={innerPos.y}
                    x2={pos.x}
                    y2={pos.y}
                    stroke="#A23A1E"
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={0.6}
                  />
                  {/* Pulsing marker */}
                  <circle cx={pos.x} cy={pos.y} r={6} fill="#A23A1E" stroke="#fff" strokeWidth={2.5}>
                    <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.7;1" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Degree label near marker */}
                  <text
                    x={pos.x + (pos.x > CX ? 14 : -14)}
                    y={pos.y - 10}
                    textAnchor={pos.x > CX ? "start" : "end"}
                    dominantBaseline="middle"
                    fill="#A23A1E"
                    fontSize={13}
                    fontWeight={900}
                  >
                    {siderealLongitude.toFixed(1)}°
                  </text>
                </g>
              );
            })()}

            {/* No tooltip — detail panel on the right provides all info */}
          </svg>

          {/* ── Nav buttons ── */}
          <div className="flex gap-3 mt-4 justify-center">
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
              onClick={() => {
                const prev = selected === null ? 1 : ((selected - 2 + 12) % 12) + 1;
                setLongitude(rawForRashi(prev));
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
              style={{
                background: "var(--gl-surface-manuscript)",
                border: "1px solid var(--gl-gold-hairline)",
                color: "var(--gl-ink-primary)",
              }}
            >
              ← Prev
            </motion.button>
            <motion.button
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
              onClick={() => {
                const next = selected === null ? 1 : (selected % 12) + 1;
                setLongitude(rawForRashi(next));
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1"
              style={{
                background: "var(--gl-surface-manuscript)",
                border: "1px solid var(--gl-gold-hairline)",
                color: "var(--gl-ink-primary)",
              }}
            >
              Next →
            </motion.button>
          </div>

          {/* Nakṣatra overlay caption */}
          {showNakshatras && (
            <p className="text-center mt-3 text-[11px]" style={{ color: "var(--gl-ink-secondary)" }}>
              <span style={{ color: "#5A8A9A", fontWeight: 700 }}>27 nakṣatra ticks</span> · 2.25 per rāśi · each
              colour-block = <strong>9 nakṣatras = 4 rāśis = 120°</strong> (the thick ticks at 0°/120°/240° fall on rāśi boundaries).
            </p>
          )}

          {/* Keyboard hint */}
          <p className="text-center mt-2 text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>
            Use ← → arrow keys or Tab/Enter to navigate segments
          </p>
        </div>

        {/* ── Detail card ── */}
        <div className="flex-1 min-w-0 w-full">
          <AnimatePresence mode="wait">
            {activeRashi && (
              <motion.div
                key={activeRashi.number}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-6 rounded-2xl space-y-4"
                style={{
                  background: "var(--gl-surface-card, #FFF9F0)",
                  border: `2px solid ${activeRashi.color}50`,
                  boxShadow: `0 8px 32px ${activeRashi.color}18`,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0"
                    style={{
                      background: `${activeRashi.color}20`,
                      color: activeRashi.color,
                      fontFamily: "var(--font-devanagari)",
                      border: `2px solid ${activeRashi.color}40`,
                    }}
                  >
                    {activeRashi.nameDevanagari}
                  </motion.div>
                  <div>
                    <h3
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}
                    >
                      <IAST>{activeRashi.nameIAST}</IAST> — {activeRashi.nameEnglish}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--gl-ink-muted)" }}>
                      #{activeRashi.number} · {activeRashi.startDegree}°–{activeRashi.endDegree}° sidereal ·{" "}
                      {activeRashi.element} · {activeRashi.modality}
                    </p>
                  </div>
                </div>

                {/* Attribute grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Lord", value: activeRashi.lord, icon: GRAHA_SYMBOLS[activeRashi.lord] ?? "☉" },
                    { label: "Element", value: activeRashi.element, icon: ELEMENT_META[activeRashi.element].icon },
                    { label: "Modality", value: activeRashi.modality, icon: "◈" },
                    { label: "Direction", value: activeRashi.direction, icon: "🧭" },
                    { label: "Gender", value: activeRashi.gender, icon: "⚥" },
                    { label: "Body Part", value: activeRashi.bodyPart, icon: "🫀" },
                  ].map((a) => (
                    <motion.div
                      key={a.label}
                      whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                      className="p-3 rounded-xl transition-colors"
                      style={{
                        background: "var(--gl-surface-manuscript)",
                        border: "1px solid var(--gl-gold-hairline)",
                      }}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span style={{ fontSize: 10 }}>{a.icon}</span>
                        <span
                          className="text-[10px] uppercase tracking-wider font-bold"
                          style={{ color: "var(--gl-ink-muted)" }}
                        >
                          {a.label}
                        </span>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                        {a.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mnemonic */}
                <div
                  className="p-3 rounded-xl text-sm italic"
                  style={{
                    background: `${activeRashi.color}10`,
                    border: `1px dashed ${activeRashi.color}35`,
                    color: "var(--gl-ink-secondary)",
                    fontFamily: "var(--font-cormorant)",
                  }}
                >
                  “{activeRashi.mnemonic}”
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5">
                  {activeRashi.keywords.split(", ").map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                      style={{
                        background: `${activeRashi.color}15`,
                        color: activeRashi.color,
                        border: `1px solid ${activeRashi.color}30`,
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Boundary explanation */}
                <div className="text-xs leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                  Each rāśi spans exactly <strong style={{ color: "var(--gl-gold-accent)" }}>30°</strong> of the sidereal ecliptic. The
                  boundary between <IAST>{activeRashi.nameIAST}</IAST> and its neighbour is a sharp categorical divide — a planet at{" "}
                  {activeRashi.endDegree - 1}°59′ is still in <IAST>{activeRashi.nameIAST}</IAST>, but at {activeRashi.endDegree}°01′ it
                  belongs to the next rāśi entirely.
                </div>

                {/* Cross-references */}
                <div
                  className="pt-3 border-t text-xs"
                  style={{ borderColor: "var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}
                >
                  Cross-references:{" "}
                  <span style={{ color: "var(--gl-ink-secondary)" }}>
                    Why boundaries matter → Lesson 4.1.3 · Dignity shifts → Module 05 · Nakṣatra overlap → Module 07 · Bhāva cusp
                    calculation → Module 06
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
