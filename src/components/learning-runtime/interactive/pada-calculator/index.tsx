"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileText,
  FolderOpen,
  Lock,
  Moon,
  RotateCcw,
  Scale,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { DRILL_SCENARIOS, type DrillScenario } from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #3D3115)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #5C4A2A)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-manuscript-cream, #F5EDD8)";
const GOLD = "var(--gl-gold, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GOLD_LIGHT = "var(--gl-gold-light, #F4C77B)";
const VERMILION = "var(--gl-vermilion-on-cream, #A23A1E)";
const JADE = "#2F7D55";
const INDIGO = "#4F6FA8";
const TEAL = "#2E7D7B";

const PADA_COLORS = ["#C28220", "#4F6FA8", "#3A8C5A", "#A23A1E"] as const;
const PADA_RANGES = [
  "0°00′ – 3°20′",
  "3°20′ – 6°40′",
  "6°40′ – 10°00′",
  "10°00′ – 13°20′",
] as const;

const NAVAMSHA_SIGNS = [
  "Meṣa (Aries)",
  "Vṛṣabha (Taurus)",
  "Mithuna (Gemini)",
  "Karkaṭa (Cancer)",
  "Siṁha (Leo)",
  "Kanyā (Virgo)",
  "Tulā (Libra)",
  "Vṛścika (Scorpio)",
  "Dhanus (Sagittarius)",
  "Makara (Capricorn)",
  "Kumbha (Aquarius)",
  "Mīna (Pisces)",
] as const;

type TabKey = "dial" | "bridge" | "cases";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "dial", label: "Precision Dial", sublabel: "Interactive calculation", icon: <Target size={15} /> },
  { key: "bridge", label: "Navāṁśa Bridge", sublabel: "108 = 108", icon: <Scale size={15} /> },
  { key: "cases", label: "Case Files", sublabel: "3 evaluation scenarios", icon: <FolderOpen size={15} /> },
];

/* ── Utility helpers ───────────────────────────────────── */
function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : `rgba(156,122,47,${parseInt(alphaHex, 16) / 255})`;
}

function formatDMS(minutes: number): string {
  const d = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${d}°${m.toString().padStart(2, "0")}′`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */

export function PadaCalculator() {
  const [tab, setTab] = useState<TabKey>("dial");
  const [resetKey, setResetKey] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setTab("dial");
  };

  return (
    <div
      data-interactive="pada-calculator"
      style={{
        display: "grid",
        gap: "1rem",
        color: INK_PRIMARY,
      }}
    >
      {/* Header */}
      <section
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.1rem 1.25rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 120,
            height: 120,
            background: `radial-gradient(circle at 100% 0%, ${wash(GOLD, "10")} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap", position: "relative" }}>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: GOLD_DEEP,
              }}
            >
              Lesson 23.2.4 — Nakṣatra-Pāda Precision
            </p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "1.55rem",
                color: GOLD_DEEP,
                fontWeight: 600,
              }}
            >
              Precision Pāda Dial & Calculator
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 780,
                fontSize: "0.92rem",
              }}
            >
              Explore how each 13°20′ nakṣatra divides into four 3°20′ pādas, and how pāda maps to Navāṁśa (D-9) through the 108-segment identity.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="gl-focus-ring gl-clickable"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.5rem 0.85rem",
              borderRadius: 8,
              border: `1px solid ${HAIRLINE}`,
              background: SURFACE_2,
              color: INK_SECONDARY,
              fontWeight: 700,
              fontSize: "0.82rem",
              cursor: "pointer",
              transition: reducedMotion ? "none" : "all 200ms ease",
            }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </section>

      {/* Tab Bar */}
      <TabBar active={tab} onChange={setTab} reducedMotion={reducedMotion} />

      {/* Tab Content */}
      <div key={resetKey}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reducedMotion ? 0 : -6 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
          >
            {tab === "dial" && <DialTab reducedMotion={reducedMotion} />}
            {tab === "bridge" && <BridgeTab reducedMotion={reducedMotion} />}
            {tab === "cases" && <CasesTab reducedMotion={reducedMotion} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Tab Bar ───────────────────────────────────────────── */

function TabBar({
  active,
  onChange,
  reducedMotion,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="flex gap-1 rounded-xl p-1"
      style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            aria-pressed={isActive}
            className="gl-focus-ring gl-clickable flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? GOLD_DEEP : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
              transition: reducedMotion ? "none" : "all 200ms ease",
            }}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.sublabel}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DIAL TAB — Interactive SVG semi-circular precision dial
   ══════════════════════════════════════════════════════════ */

const DIAL_SIZE = 560;
const DIAL_CX = DIAL_SIZE / 2;
const DIAL_CY = DIAL_SIZE * 0.78;
const DIAL_R = 210;
const DIAL_TRACK_R = 236;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToXY(cx, cy, r, startAngle);
  const e = polarToXY(cx, cy, r, endAngle);
  const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return [`M ${s.x} ${s.y}`, `A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`].join(" ");
}

function DialTab({ reducedMotion }: { reducedMotion: boolean }) {
  const [minutes, setMinutes] = useState(250);
  const trackRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredPada, setHoveredPada] = useState<number | null>(null);

  const maxMinutes = 800;
  const padaIndex = Math.floor(minutes / 200);
  const padaNumber = padaIndex + 1;
  const rawDivision = (minutes / 200).toFixed(2);

  const percentage = minutes / maxMinutes;
  const sweepAngle = 180 * percentage;

  const handleMove = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pt = trackRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = rect.top + rect.height / 2;
    const svgP = pt.matrixTransform(trackRef.current.getScreenCTM()?.inverse());
    const dx = svgP.x - DIAL_CX;
    const dy = svgP.y - DIAL_CY;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 180;
    if (angle < 0) angle += 360;
    if (angle > 180) angle = 180;
    const newMins = Math.round((angle / 180) * maxMinutes);
    setMinutes(clamp(newMins, 0, maxMinutes));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: PointerEvent) => handleMove(e.clientX);
    const up = () => setIsDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [isDragging]);

  const thumbPos = polarToXY(DIAL_CX, DIAL_CY, DIAL_R, sweepAngle);
  const boundaryProximity = minutes % 200;
  const nearBoundary = boundaryProximity <= 5 || boundaryProximity >= 195;

  return (
    <section style={{ display: "grid", gap: "1.1rem" }}>
      {/* Dial Surface */}
      <article
        className="relative overflow-hidden"
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 20,
          background: `linear-gradient(180deg, ${SURFACE} 0%, ${SURFACE_2} 100%)`,
          padding: "1.5rem 1rem 1rem",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${wash(GOLD, "08")} 0%, transparent 60%)`,
          }}
        />

        <div style={{ textAlign: "center", position: "relative", marginBottom: "0.5rem" }}>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.45rem",
              color: GOLD_DEEP,
              fontWeight: 600,
            }}
          >
            Position within Nakṣatra
          </h3>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
            }}
          >
            Drag the Moon orb along the dial to set longitude (0°00′ to 13°20′)
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            ref={trackRef}
            viewBox={`0 0 ${DIAL_SIZE} ${DIAL_CY + 40}`}
            width="100%"
            style={{ maxWidth: DIAL_SIZE, cursor: isDragging ? "grabbing" : "pointer", userSelect: "none" }}
            onPointerDown={handlePointerDown}
            role="img"
            aria-label="Semi-circular dial showing 0 to 13 degrees 20 minutes within a nakshatra"
          >
            <defs>
              <radialGradient id="dial-center" cx="50%" cy="100%" r="80%">
                <stop offset="0%" stopColor={SURFACE} />
                <stop offset="100%" stopColor={SURFACE_2} />
              </radialGradient>
              <filter id="moon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outer decorative ring */}
            <path
              d={arcPath(DIAL_CX, DIAL_CY, DIAL_TRACK_R, 0, 180)}
              fill="none"
              stroke={HAIRLINE}
              strokeWidth={1}
              strokeDasharray="4 6"
            />

            {/* Four Pāda zone arcs */}
            {[0, 1, 2, 3].map((i) => {
              const start = i * 45;
              const end = (i + 1) * 45;
              const isActive = i === padaIndex;
              const isHover = hoveredPada === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredPada(i)}
                  onMouseLeave={() => setHoveredPada(null)}
                >
                  <path
                    d={arcPath(DIAL_CX, DIAL_CY, DIAL_R, start, end)}
                    fill="none"
                    stroke={isActive || isHover ? PADA_COLORS[i] : wash(PADA_COLORS[i], "50")}
                    strokeWidth={isActive ? 24 : isHover ? 20 : 14}
                    strokeLinecap="butt"
                    style={{ transition: reducedMotion ? "none" : "all 220ms ease" }}
                  />
                  {/* Pāda zone label */}
                  <text
                    x={polarToXY(DIAL_CX, DIAL_CY, DIAL_R - 38, start + 22.5).x}
                    y={polarToXY(DIAL_CX, DIAL_CY, DIAL_R - 38, start + 22.5).y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isActive ? PADA_COLORS[i] : INK_MUTED}
                    fontSize={11}
                    fontWeight={isActive ? 800 : 600}
                    style={{ pointerEvents: "none", transition: reducedMotion ? "none" : "all 220ms ease" }}
                  >
                    P{i + 1}
                  </text>
                </g>
              );
            })}

            {/* Boundary markers */}
            {[45, 90, 135].map((angle) => {
              const outer = polarToXY(DIAL_CX, DIAL_CY, DIAL_R + 16, angle);
              const inner = polarToXY(DIAL_CX, DIAL_CY, DIAL_R - 16, angle);
              const labelPos = polarToXY(DIAL_CX, DIAL_CY, DIAL_R + 32, angle);
              const boundaryMins = (angle / 180) * 800;
              return (
                <g key={angle}>
                  <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke={GOLD_DEEP} strokeWidth={2} />
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={GOLD_DEEP}
                    fontSize={10}
                    fontWeight={700}
                  >
                    {formatDMS(boundaryMins)}
                  </text>
                </g>
              );
            })}

            {/* Start / End labels */}
            <text x={polarToXY(DIAL_CX, DIAL_CY, DIAL_R + 32, 0).x} y={polarToXY(DIAL_CX, DIAL_CY, DIAL_R + 32, 0).y} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={700}>
              0°00′
            </text>
            <text x={polarToXY(DIAL_CX, DIAL_CY, DIAL_R + 32, 180).x} y={polarToXY(DIAL_CX, DIAL_CY, DIAL_R + 32, 180).y} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={700}>
              13°20′
            </text>

            {/* Active sweep indicator */}
            <path
              d={arcPath(DIAL_CX, DIAL_CY, DIAL_R, 0, sweepAngle)}
              fill="none"
              stroke={PADA_COLORS[padaIndex]}
              strokeWidth={4}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 4px rgba(0,0,0,0.15))", transition: reducedMotion ? "none" : "all 80ms linear" }}
            />

            {/* Draggable Moon thumb */}
            <g
              transform={`translate(${thumbPos.x}, ${thumbPos.y})`}
              style={{ cursor: isDragging ? "grabbing" : "grab", transition: reducedMotion ? "none" : "transform 80ms linear" }}
            >
              <circle r={22} fill={SURFACE} stroke={PADA_COLORS[padaIndex]} strokeWidth={3} filter="url(#moon-glow)" />
              <circle r={8} fill={PADA_COLORS[padaIndex]} />
              <Moon size={14} color={PADA_COLORS[padaIndex]} style={{ transform: "translate(-7px, -7px)" }} />

              {/* Tooltip */}
              <g transform="translate(0, -42)">
                <rect x={-42} y={-22} width={84} height={28} rx={14} fill={GOLD_DEEP} />
                <text x={0} y={-4} textAnchor="middle" fill="#FFF" fontSize={12} fontWeight={800}>
                  {formatDMS(minutes)}
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Zone Legend */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.5rem",
            marginTop: "0.75rem",
          }}
        >
          {[0, 1, 2, 3].map((i) => {
            const active = i === padaIndex;
            return (
              <motion.div
                key={i}
                animate={{
                  scale: active ? 1.02 : 1,
                  backgroundColor: active ? wash(PADA_COLORS[i], "14") : "transparent",
                }}
                transition={{ duration: reducedMotion ? 0 : 0.2 }}
                style={{
                  borderRadius: 10,
                  padding: "0.65rem 0.4rem",
                  textAlign: "center",
                  border: active ? `1.5px solid ${PADA_COLORS[i]}` : `1px solid ${HAIRLINE}`,
                }}
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: active ? 800 : 600,
                    color: active ? PADA_COLORS[i] : INK_SECONDARY,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Pāda {i + 1}
                </div>
                <div style={{ fontSize: "0.7rem", color: INK_MUTED, marginTop: 2 }}>{PADA_RANGES[i]}</div>
              </motion.div>
            );
          })}
        </div>
      </article>

      {/* Verdict Banner */}
      <VerdictCard minutes={minutes} padaNumber={padaNumber} nearBoundary={nearBoundary} reducedMotion={reducedMotion} />

      {/* Calculation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "0.85rem",
        }}
      >
        <CalcCard
          step="Step 1"
          title="Convert to Minutes"
          formula={`(${Math.floor(minutes / 60)} × 60) + ${minutes % 60} = ${minutes}′`}
          note="Convert the position within the Nakṣatra purely into arc-minutes."
          color={INK_SECONDARY}
          reducedMotion={reducedMotion}
        />
        <CalcCard
          step="Step 2"
          title="Floor Division"
          formula={`⌊${minutes} ÷ 200⌋ = ${padaIndex}`}
          note={`Raw division is ${rawDivision}. Take the floor to get the Pāda index (0–3).`}
          color={INDIGO}
          reducedMotion={reducedMotion}
        />
        <CalcCard
          step="Step 3"
          title="Add One"
          formula={`${padaIndex} + 1 = Pāda ${padaNumber}`}
          note="Always add 1 to the floor index to get the final human-readable Pāda."
          color={GOLD}
          reducedMotion={reducedMotion}
          highlighted
        />
      </div>
    </section>
  );
}

/* ── Verdict Card ──────────────────────────────────────── */

function VerdictCard({
  minutes,
  padaNumber,
  nearBoundary,
  reducedMotion,
}: {
  minutes: number;
  padaNumber: number;
  nearBoundary: boolean;
  reducedMotion: boolean;
}) {
  const color = PADA_COLORS[padaNumber - 1];
  const navIndex = (padaNumber - 1) % 12;

  return (
    <motion.article
      layout
      initial={false}
      animate={{ borderColor: color, backgroundColor: wash(color, "08") }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
      style={{
        border: `1.5px solid ${color}`,
        borderRadius: 14,
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${GOLD_DEEP})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "1.6rem",
            fontWeight: 700,
            boxShadow: `0 4px 14px ${wash(color, "40")}`,
          }}
        >
          {padaNumber}
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 800, color }}>Pāda {padaNumber}</span>
            <span style={{ fontSize: "0.82rem", color: INK_MUTED }}>({PADA_RANGES[padaNumber - 1]})</span>
          </div>
          <div style={{ fontSize: "0.88rem", color: INK_SECONDARY, marginTop: 2 }}>
            Moon at <strong style={{ color: INK_PRIMARY }}>{formatDMS(minutes)}</strong> within the Nakṣatra
          </div>
          <div style={{ fontSize: "0.82rem", color: INK_MUTED, marginTop: 2 }}>
            Corresponds to <strong style={{ color: color }}>{NAVAMSHA_SIGNS[navIndex]}</strong> Navāṁśa
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {nearBoundary ? (
          <motion.div
            key="boundary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.75rem",
              borderRadius: 20,
              background: wash(VERMILION, "10"),
              border: `1px solid ${wash(VERMILION, "30")}`,
              color: VERMILION,
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            <AlertIcon size={14} />
            Boundary zone — avoid exact seams
          </motion.div>
        ) : (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.45rem 0.75rem",
              borderRadius: 20,
              background: wash(JADE, "10"),
              border: `1px solid ${wash(JADE, "30")}`,
              color: JADE,
              fontSize: "0.78rem",
              fontWeight: 700,
            }}
          >
            <Check size={14} />
            Comfortably inside Pāda {padaNumber}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ── Calculation Card ──────────────────────────────────── */

function CalcCard({
  step,
  title,
  formula,
  note,
  color,
  highlighted = false,
  reducedMotion,
}: {
  step: string;
  title: string;
  formula: string;
  note: string;
  color: string;
  highlighted?: boolean;
  reducedMotion: boolean;
}) {
  return (
    <motion.div
      whileHover={reducedMotion ? {} : { y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        padding: "1.15rem",
        borderRadius: 14,
        border: highlighted ? `1.5px solid ${color}` : `1px solid ${HAIRLINE}`,
        background: highlighted ? wash(color, "12") : SURFACE,
        boxShadow: highlighted ? `0 8px 24px ${wash(color, "18")}` : "0 2px 8px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {highlighted && (
        <Sparkles
          size={42}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            color,
            opacity: 0.12,
          }}
        />
      )}
      <div
        style={{
          fontSize: "0.68rem",
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: highlighted ? color : INK_MUTED,
        }}
      >
        {step}
      </div>
      <div
        style={{
          fontSize: "1.35rem",
          fontFamily: "var(--font-cormorant), serif",
          color: INK_PRIMARY,
          fontWeight: 600,
          lineHeight: 1.25,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "1.15rem",
          fontFamily: "var(--font-cormorant), serif",
          color: highlighted ? GOLD_DEEP : color,
          fontWeight: 700,
          wordBreak: "break-word",
        }}
      >
        {formula}
      </div>
      <div style={{ fontSize: "0.84rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{note}</div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   BRIDGE TAB — Pāda ↔ Navāṁśa Isomorphism
   ══════════════════════════════════════════════════════════ */

function BridgeTab({ reducedMotion }: { reducedMotion: boolean }) {
  const [selectedPada, setSelectedPada] = useState(1);
  const [selectedNakshatra, setSelectedNakshatra] = useState(1);

  const k = (selectedNakshatra - 1) * 4 + (selectedPada - 1);
  const navIndex = k % 12;
  const signIndex = Math.floor(k / 9) % 12;
  const isVargottama = navIndex === signIndex;

  return (
    <section style={{ display: "grid", gap: "1.1rem" }}>
      <article
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.25rem",
          display: "grid",
          gap: "1rem",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "1.35rem",
              color: GOLD_DEEP,
              fontWeight: 600,
            }}
          >
            The 108-Segment Identity
          </h3>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
            27 nakṣatras × 4 pādas = 108 pādas. 12 rāśis × 9 navāṁśas = 108 navāṁśas. Each pāda IS one navāṁśa segment.
          </p>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "0.85rem",
          }}
        >
          <Selector
            label="Nakṣatra number"
            value={selectedNakshatra}
            onChange={setSelectedNakshatra}
            min={1}
            max={27}
          />
          <Selector
            label="Pāda"
            value={selectedPada}
            onChange={setSelectedPada}
            min={1}
            max={4}
          />
        </div>

        {/* Visual equation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            padding: "1rem",
            borderRadius: 14,
            background: SURFACE_2,
            border: `1px dashed ${HAIRLINE}`,
          }}
        >
          <EquationTile label="Nakṣatra" value={`N = ${selectedNakshatra}`} color={INDIGO} />
          <span style={{ color: INK_MUTED, fontWeight: 800 }}>×4 +</span>
          <EquationTile label="Pāda" value={`p = ${selectedPada}`} color={PADA_COLORS[selectedPada - 1]} />
          <span style={{ color: INK_MUTED, fontWeight: 800 }}>=</span>
          <EquationTile label="Global index" value={`k = ${k}`} color={GOLD} />
          <span style={{ color: INK_MUTED, fontWeight: 800 }}>→</span>
          <EquationTile
            label="Navāṁśa sign"
            value={NAVAMSHA_SIGNS[navIndex].split(" ")[0]}
            subvalue={NAVAMSHA_SIGNS[navIndex].split(" ")[1].replace(/[()]/g, "")}
            color={TEAL}
            large
          />
        </div>

        {/* Result card */}
        <motion.div
          key={`${selectedNakshatra}-${selectedPada}`}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.25 }}
          style={{
            borderRadius: 14,
            padding: "1rem 1.25rem",
            background: isVargottama ? wash(GOLD, "12") : wash(TEAL, "08"),
            border: `1.5px solid ${isVargottama ? GOLD : TEAL}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: isVargottama ? GOLD_DEEP : TEAL }}>
              Result
            </div>
            <div style={{ fontSize: "1.05rem", color: INK_PRIMARY, marginTop: 4, fontWeight: 600 }}>
              Nakṣatra {selectedNakshatra}, Pāda {selectedPada} →{" "}
              <span style={{ color: isVargottama ? GOLD_DEEP : TEAL }}>{NAVAMSHA_SIGNS[navIndex]}</span>
            </div>
            <div style={{ fontSize: "0.84rem", color: INK_SECONDARY, marginTop: 2 }}>
              Falls in rāśi {NAVAMSHA_SIGNS[signIndex].split(" ")[0]} · Global index {k} mod 12 = {navIndex}
            </div>
          </div>
          {isVargottama && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.75rem",
                borderRadius: 20,
                background: wash(GOLD, "20"),
                color: GOLD_DEEP,
                fontSize: "0.78rem",
                fontWeight: 800,
              }}
            >
              <Sparkles size={13} />
              Vargottama
            </span>
          )}
        </motion.div>
      </article>

      {/* Mini grid of 108 */}
      <article
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 16,
          background: SURFACE,
          padding: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <GridIcon size={18} color={GOLD_DEEP} />
          <h3 style={{ margin: 0, fontFamily: "var(--font-cormorant), serif", fontSize: "1.2rem", color: GOLD_DEEP }}>108-Segment Map</h3>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(34px, 1fr))",
            gap: "3px",
            maxHeight: 220,
            overflowY: "auto",
            padding: "0.25rem",
          }}
        >
          {Array.from({ length: 108 }, (_, i) => {
            const isSelected = i === k;
            const nav = i % 12;
            const isVarg = i % 9 === 0;
            return (
              <motion.button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedNakshatra(Math.floor(i / 4) + 1);
                  setSelectedPada((i % 4) + 1);
                }}
                whileHover={reducedMotion ? {} : { scale: 1.15, zIndex: 10 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
                title={`k=${i} · ${NAVAMSHA_SIGNS[nav].split(" ")[0]}`}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 5,
                  border: isSelected ? `2px solid ${INK_PRIMARY}` : "1px solid transparent",
                  background: isSelected ? GOLD : isVarg ? wash(GOLD, "25") : wash(TEAL, "10"),
                  color: isSelected ? "#FFF" : INK_MUTED,
                  fontSize: "0.6rem",
                  fontWeight: isSelected ? 800 : 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i + 1}
              </motion.button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", flexWrap: "wrap", fontSize: "0.75rem", color: INK_MUTED }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: wash(TEAL, "10"), border: `1px solid ${wash(TEAL, "25")}` }} />
            Standard segment
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: wash(GOLD, "25"), border: `1px solid ${wash(GOLD, "40")}` }} />
            Rāśi boundary (potential vargottama)
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: GOLD }} />
            Selected
          </span>
        </div>
      </article>
    </section>
  );
}

function Selector({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
      }}
    >
      <label style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: INK_MUTED }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value === min}
          className="gl-focus-ring gl-clickable"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: `1px solid ${HAIRLINE}`,
            background: SURFACE,
            color: INK_PRIMARY,
            fontWeight: 800,
            cursor: value === min ? "not-allowed" : "pointer",
            opacity: value === min ? 0.5 : 1,
          }}
        >
          −
        </button>
        <div
          style={{
            flex: 1,
            height: 34,
            borderRadius: 8,
            border: `1px solid ${HAIRLINE}`,
            background: SURFACE,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: INK_PRIMARY,
          }}
        >
          {value}
        </div>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value === max}
          className="gl-focus-ring gl-clickable"
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            border: `1px solid ${HAIRLINE}`,
            background: SURFACE,
            color: INK_PRIMARY,
            fontWeight: 800,
            cursor: value === max ? "not-allowed" : "pointer",
            opacity: value === max ? 0.5 : 1,
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}

function EquationTile({
  label,
  value,
  subvalue,
  color,
  large = false,
}: {
  label: string;
  value: string;
  subvalue?: string;
  color: string;
  large?: boolean;
}) {
  return (
    <div
      style={{
        minWidth: 70,
        padding: "0.5rem 0.75rem",
        borderRadius: 10,
        background: wash(color, "10"),
        border: `1px solid ${wash(color, "25")}`,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", color }}>{label}</div>
      <div style={{ fontSize: large ? "1.15rem" : "0.95rem", fontWeight: 800, color: INK_PRIMARY }}>{value}</div>
      {subvalue && <div style={{ fontSize: "0.68rem", color: INK_MUTED }}>{subvalue}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CASE FILES TAB — Envelope-style drill scenarios
   ══════════════════════════════════════════════════════════ */

function CasesTab({ reducedMotion }: { reducedMotion: boolean }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selected: string | null; submitted: boolean }>>({});

  const progress = useMemo(() => {
    const submitted = DRILL_SCENARIOS.filter((_, i) => answers[i]?.submitted).length;
    return { submitted, total: DRILL_SCENARIOS.length };
  }, [answers]);

  const handleSelect = (scenarioIndex: number, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [scenarioIndex]: { selected: optionId, submitted: false },
    }));
  };

  const handleSubmit = (scenarioIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [scenarioIndex]: { ...prev[scenarioIndex], submitted: true },
    }));
  };

  const handleResetCase = (scenarioIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [scenarioIndex]: { selected: null, submitted: false },
    }));
  };

  return (
    <section style={{ display: "grid", gap: "1rem" }}>
      {/* Progress header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          padding: "0.85rem 1rem",
          borderRadius: 12,
          background: SURFACE,
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <FileText size={18} color={GOLD_DEEP} />
          <span style={{ fontWeight: 700, color: INK_PRIMARY, fontSize: "0.92rem" }}>Case Files</span>
          <span style={{ fontSize: "0.8rem", color: INK_MUTED }}>
            {progress.submitted} of {progress.total} resolved
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          {DRILL_SCENARIOS.map((_, i) => {
            const state = answers[i];
            const correct = state?.submitted && DRILL_SCENARIOS[i].options.find((o) => o.id === state.selected)?.isCorrect;
            const wrong = state?.submitted && !correct;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setOpenIndex(i)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: `1.5px solid ${openIndex === i ? GOLD : HAIRLINE}`,
                  background: correct ? JADE : wrong ? VERMILION : openIndex === i ? wash(GOLD, "20") : SURFACE,
                  color: correct || wrong ? "#FFF" : openIndex === i ? GOLD_DEEP : INK_MUTED,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {correct ? <Check size={14} /> : wrong ? <X size={14} /> : i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Case file stack */}
      <div style={{ display: "grid", gap: "0.85rem" }}>
        {DRILL_SCENARIOS.map((scenario, i) => (
          <CaseFileCard
            key={scenario.slug}
            index={i}
            scenario={scenario}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            selected={answers[i]?.selected ?? null}
            submitted={answers[i]?.submitted ?? false}
            onSelect={(id) => handleSelect(i, id)}
            onSubmit={() => handleSubmit(i)}
            onReset={() => handleResetCase(i)}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}

function CaseFileCard({
  index,
  scenario,
  isOpen,
  onToggle,
  selected,
  submitted,
  onSelect,
  onSubmit,
  onReset,
  reducedMotion,
}: {
  index: number;
  scenario: DrillScenario;
  isOpen: boolean;
  onToggle: () => void;
  selected: string | null;
  submitted: boolean;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  reducedMotion: boolean;
}) {
  const correctOption = scenario.options.find((o) => o.isCorrect);
  const selectedOption = scenario.options.find((o) => o.id === selected);
  const isCorrect = submitted && selectedOption?.isCorrect;
  const isWrong = submitted && selectedOption && !selectedOption.isCorrect;

  return (
    <motion.article
      layout
      initial={false}
      animate={{
        borderColor: isCorrect ? JADE : isWrong ? VERMILION : HAIRLINE,
        backgroundColor: isCorrect ? wash(JADE, "06") : isWrong ? wash(VERMILION, "06") : SURFACE,
      }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
      style={{
        border: `1.5px solid ${isCorrect ? JADE : isWrong ? VERMILION : HAIRLINE}`,
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Envelope header */}
      <button
        type="button"
        onClick={onToggle}
        className="gl-focus-ring gl-clickable"
        style={{
          width: "100%",
          padding: "1rem 1.15rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: isCorrect ? wash(JADE, "15") : isWrong ? wash(VERMILION, "15") : wash(GOLD, "12"),
              border: `1px solid ${isCorrect ? JADE : isWrong ? VERMILION : HAIRLINE}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isCorrect ? JADE : isWrong ? VERMILION : GOLD_DEEP,
            }}
          >
            {isCorrect ? <Check size={18} /> : isWrong ? <X size={18} /> : <FolderOpen size={18} />}
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: INK_MUTED }}>
              Case File {index + 1}
            </div>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: INK_PRIMARY, marginTop: 1 }}>{scenario.question}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          {submitted && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
                padding: "0.25rem 0.6rem",
                borderRadius: 12,
                background: isCorrect ? wash(JADE, "15") : wash(VERMILION, "15"),
                color: isCorrect ? JADE : VERMILION,
                fontSize: "0.72rem",
                fontWeight: 800,
              }}
            >
              {isCorrect ? <Check size={12} /> : <X size={12} />}
              {isCorrect ? "Correct" : "Review"}
            </span>
          )}
          <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}>
            <ChevronRight size={20} color={INK_MUTED} />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1.15rem 1.15rem", display: "grid", gap: "0.85rem" }}>
              {scenario.context && (
                <div
                  style={{
                    padding: "0.75rem 0.9rem",
                    borderRadius: 10,
                    background: SURFACE_2,
                    border: `1px dashed ${HAIRLINE}`,
                    color: INK_SECONDARY,
                    fontSize: "0.88rem",
                    fontStyle: "italic",
                  }}
                >
                  <Lock size={14} style={{ verticalAlign: "middle", marginRight: 6, color: GOLD_DEEP }} />
                  {scenario.context}
                </div>
              )}

              {/* Options */}
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {scenario.options.map((opt) => {
                  const isSelected = selected === opt.id;
                  const showCorrect = submitted && opt.isCorrect;
                  const showWrong = submitted && isSelected && !opt.isCorrect;

                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      disabled={submitted}
                      onClick={() => onSelect(opt.id)}
                      whileHover={submitted || reducedMotion ? {} : { x: 3 }}
                      animate={{
                        backgroundColor: showCorrect
                          ? wash(JADE, "10")
                          : showWrong
                          ? wash(VERMILION, "10")
                          : isSelected
                          ? wash(INDIGO, "08")
                          : SURFACE,
                        borderColor: showCorrect ? JADE : showWrong ? VERMILION : isSelected ? INDIGO : HAIRLINE,
                      }}
                      transition={{ duration: reducedMotion ? 0 : 0.15 }}
                      className="gl-focus-ring gl-clickable"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "0.85rem 1rem",
                        borderRadius: 10,
                        border: `1.5px solid ${showCorrect ? JADE : showWrong ? VERMILION : isSelected ? INDIGO : HAIRLINE}`,
                        background: showCorrect
                          ? wash(JADE, "10")
                          : showWrong
                          ? wash(VERMILION, "10")
                          : isSelected
                          ? wash(INDIGO, "08")
                          : SURFACE,
                        cursor: submitted ? "default" : "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          background: showCorrect ? JADE : showWrong ? VERMILION : isSelected ? INDIGO : wash(GOLD, "15"),
                          color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                        }}
                      >
                        {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : opt.id}
                      </span>
                      <span style={{ display: "flex", flexDirection: "column", gap: "0.2rem", flex: 1 }}>
                        <span style={{ fontSize: "0.92rem", fontWeight: isSelected ? 700 : 500, color: INK_PRIMARY }}>{opt.label}</span>
                        {submitted && (
                          <motion.span
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                              fontSize: "0.82rem",
                              color: opt.isCorrect ? JADE : showWrong ? VERMILION : INK_MUTED,
                              lineHeight: 1.5,
                            }}
                          >
                            {opt.explanation}
                          </motion.span>
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action bar */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.25rem" }}>
                {submitted ? (
                  <button
                    type="button"
                    onClick={onReset}
                    className="gl-focus-ring gl-clickable"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      padding: "0.55rem 1rem",
                      borderRadius: 8,
                      border: `1px solid ${HAIRLINE}`,
                      background: SURFACE_2,
                      color: INK_SECONDARY,
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                    }}
                  >
                    <RotateCcw size={14} />
                    Reopen case
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!selected}
                    className="gl-focus-ring gl-clickable"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.55rem 1.1rem",
                      borderRadius: 8,
                      border: "none",
                      background: selected
                        ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`
                        : wash(GOLD, "15"),
                      color: selected ? INK_PRIMARY : GOLD_DEEP,
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      cursor: selected ? "pointer" : "not-allowed",
                    }}
                  >
                    Render verdict
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* Final verdict card */}
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: reducedMotion ? 0 : 0.25 }}
                    style={{
                      borderRadius: 12,
                      padding: "0.85rem 1rem",
                      background: isCorrect ? wash(JADE, "10") : wash(VERMILION, "10"),
                      border: `1.5px solid ${isCorrect ? JADE : VERMILION}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: isCorrect ? JADE : VERMILION,
                        color: "#FFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isCorrect ? <Check size={18} /> : <X size={18} />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: isCorrect ? JADE : VERMILION, fontSize: "0.92rem" }}>
                        {isCorrect ? "Verdict: Correct" : "Verdict: Needs review"}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: INK_SECONDARY }}>
                        {isCorrect
                          ? "This answer honours the boundary and off-by-one disciplines."
                          : `The correct resolution is "${correctOption?.label}" — ${correctOption?.explanation}`}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ── Shared icons ──────────────────────────────────────── */

function AlertIcon({ size = 16, color = VERMILION }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function GridIcon({ size = 16, color = GOLD }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
