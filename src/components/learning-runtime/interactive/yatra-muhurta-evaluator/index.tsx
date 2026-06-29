"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Crown,
  Heart,
  Info,
  MapPin,
  Moon,
  RefreshCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  CANDIDATES,
  CANCELLATION_DOSHAS,
  DAY_PROFILES,
  DIRECTION_LABELS,
  DISHA_SULA_RULES,
  HOUSE_BALA_NOTES,
  LAGNA_PROFILES,
  MOON_MERCURY_JUPITER_RULES,
  PANCHANGA_RULES,
  type Candidate,
  type DayKey,
  type DirectionKey,
  type PanchangaFactor,
  type Quality,
  scoreCandidate,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #3D3115)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #5C4A2A)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-manuscript-cream, #F5EDD8)";
const SURFACE_3 = "var(--gl-surface-warm, #FAF6ED)";
const GOLD = "var(--gl-gold, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const VERMILION = "var(--gl-vermilion-on-cream, #A23A1E)";
const JADE = "#2F7D55";
const INDIGO = "#4F6FA8";
const AMBER = "#B9801E";
const MOON_SILVER = "#7A8A9A";
const JUPITER_SAFFRON = "#D68C2E";
const MERCURY_TEAL = "#2A7A7A";

const DIRECTION_COLOUR: Record<DirectionKey, string> = {
  east: JUPITER_SAFFRON,
  south: VERMILION,
  west: INDIGO,
  north: JADE,
};

type TabKey = "evaluate" | "rules" | "disha" | "safety";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "evaluate", label: "Evaluate", sublabel: "4 candidate windows", icon: <Scale size={15} /> },
  { key: "rules", label: "Yātrā Rules", sublabel: "Pañcāṅga + pairing", icon: <Sparkles size={15} /> },
  { key: "disha", label: "Disha-Śūla", sublabel: "Direction compass", icon: <Compass size={15} /> },
  { key: "safety", label: "Safety First", sublabel: "Context priority", icon: <ShieldAlert size={15} /> },
];

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#")
    ? `${color}${alphaHex}`
    : `rgba(156,122,47,${Number.parseInt(alphaHex, 16) / 255})`;
}

function qualityColor(q: Quality) {
  if (q === "favourable") return JADE;
  if (q === "mixed") return AMBER;
  if (q === "unfavourable") return VERMILION;
  return INK_MUTED;
}

function qualityBg(q: Quality) {
  if (q === "favourable") return wash(JADE, "12");
  if (q === "mixed") return wash(AMBER, "14");
  if (q === "unfavourable") return wash(VERMILION, "12");
  return wash(GOLD, "10");
}

function verdictColor(verdict: "proceed" | "mixed" | "avoid") {
  if (verdict === "proceed") return JADE;
  if (verdict === "mixed") return AMBER;
  return VERMILION;
}

function verdictBg(verdict: "proceed" | "mixed" | "avoid") {
  if (verdict === "proceed") return wash(JADE, "14");
  if (verdict === "mixed") return wash(AMBER, "16");
  return wash(VERMILION, "12");
}

function gaugeAngle(q: Quality) {
  if (q === "favourable") return 150;
  if (q === "mixed") return 95;
  if (q === "unfavourable") return 45;
  return 90;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, rInner: number, rOuter: number, startDeg: number, endDeg: number) {
  const startOuter = polar(cx, cy, rOuter, startDeg);
  const endOuter = polar(cx, cy, rOuter, endDeg);
  const startInner = polar(cx, cy, rInner, endDeg);
  const endInner = polar(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

/* ── Shared primitives ─────────────────────────────────── */

function QualityBadge({ quality, label }: { quality: Quality; label?: string }) {
  const text =
    label ??
    (quality === "favourable"
      ? "Favourable"
      : quality === "mixed"
        ? "Mixed"
        : quality === "unfavourable"
          ? "Unfavourable"
          : "Neutral");
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        padding: "0.18rem 0.55rem",
        borderRadius: 999,
        background: qualityBg(quality),
        color: qualityColor(quality),
        fontSize: "0.72rem",
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {quality === "favourable" ? <Check size={11} /> : quality === "unfavourable" ? <X size={11} /> : <AlertTriangle size={11} />}
      {text}
    </span>
  );
}

function SectionCard({ children, title, icon }: { children: React.ReactNode; title: string; icon?: React.ReactNode }) {
  return (
    <section
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        background: SURFACE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.85rem 1.1rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          background: SURFACE_2,
          color: GOLD_DEEP,
          fontWeight: 800,
          fontSize: "0.8rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ padding: "1rem 1.1rem" }}>{children}</div>
    </section>
  );
}

function CandidateFileCard({
  candidate,
  selected,
  onClick,
}: {
  candidate: Candidate;
  selected: boolean;
  onClick: () => void;
}) {
  const { verdict, label } = useMemo(() => scoreCandidate(candidate), [candidate]);
  const triggered = candidate.doshas.filter((d) => d.triggered).length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="gl-focus-ring gl-clickable"
      style={{
        width: "100%",
        textAlign: "left",
        border: `1px solid ${selected ? GOLD : HAIRLINE}`,
        borderRadius: 14,
        background: selected ? "#FFFCF7" : SURFACE,
        padding: 0,
        cursor: "pointer",
        transition: "all 180ms ease",
        boxShadow: selected ? `0 0 0 2px ${wash(GOLD, "20")}` : "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: 6,
          background: verdictColor(verdict),
          opacity: 0.85,
        }}
      />
      <div style={{ padding: "0.85rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.72rem", color: INK_MUTED, fontWeight: 700 }}>
              {candidate.date} · {candidate.time}
            </p>
            <p style={{ margin: "0.15rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "0.98rem" }}>{candidate.label}</p>
          </div>
          <span
            style={{
              padding: "0.2rem 0.55rem",
              borderRadius: 999,
              background: verdictBg(verdict),
              color: verdictColor(verdict),
              fontSize: "0.68rem",
              fontWeight: 800,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>{candidate.tagline}</p>
        <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {candidate.panchanga.map((f) => (
            <span
              key={f.key}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: qualityColor(f.quality),
                display: "inline-block",
              }}
              title={`${f.label}: ${f.value}`}
            />
          ))}
          {candidate.dishaSula.triggered && (
            <span
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: VERMILION,
                textTransform: "uppercase",
              }}
            >
              <Compass size={10} />
              Disha-Śūla
            </span>
          )}
          {triggered > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.2rem",
                fontSize: "0.65rem",
                fontWeight: 800,
                color: VERMILION,
                textTransform: "uppercase",
              }}
            >
              <XCircle size={10} />
              {triggered} doṣa
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

/* ── Visual diagrams ───────────────────────────────────── */

function PanchangaWheel({
  panchanga,
  activeKey,
  onHover,
}: {
  panchanga: PanchangaFactor[];
  activeKey?: string;
  onHover: (key: string | null) => void;
}) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 100;
  const rInner = 64;
  const gap = 3;
  const step = 360 / panchanga.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Pañcāṅga wheel">
        {panchanga.map((factor, i) => {
          const start = i * step + gap / 2;
          const end = (i + 1) * step - gap / 2;
          const mid = (start + end) / 2;
          const isActive = activeKey === factor.key;
          const pos = polar(cx, cy, 82, mid);
          const labelPos = polar(cx, cy, 50, mid);
          return (
            <g key={factor.key}>
              <path
                d={arcPath(cx, cy, rInner, rOuter, start, end)}
                fill={qualityBg(factor.quality)}
                stroke={isActive ? qualityColor(factor.quality) : HAIRLINE}
                strokeWidth={isActive ? 2.5 : 1}
                style={{ cursor: "pointer", transition: "all 180ms ease" }}
                onMouseEnter={() => onHover(factor.key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onHover(factor.key)}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: "0.62rem",
                  fontWeight: 800,
                  fill: INK_PRIMARY,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  pointerEvents: "none",
                }}
              >
                {factor.label}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: "0.6rem", fontWeight: 700, fill: qualityColor(factor.quality), pointerEvents: "none" }}
              >
                {factor.quality === "favourable" ? "✓" : factor.quality === "unfavourable" ? "✗" : "~"}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={rInner - 6} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: "0.7rem", fontWeight: 800, fill: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em" }}
        >
          Pañcāṅga
        </text>
      </svg>
    </div>
  );
}

function PanchangaDetail({ factor }: { factor: PanchangaFactor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      key={factor.key}
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 12,
        background: qualityBg(factor.quality),
        padding: "0.85rem 1rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
        <span style={{ fontWeight: 800, color: GOLD_DEEP, fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {factor.label}
        </span>
        <QualityBadge quality={factor.quality} />
      </div>
      <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "1rem" }}>{factor.value}</p>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>{factor.note}</p>
    </motion.div>
  );
}

function Gauge({ label, color, quality, note }: { label: string; color: string; quality: Quality; note: string }) {
  const width = 120;
  const height = 78;
  const cx = width / 2;
  const cy = height - 10;
  const r = 52;
  const angle = gaugeAngle(quality);
  const bgPath = arcPath(cx, cy, r - 14, r, 0, 180);
  const fillPath = arcPath(cx, cy, r - 14, r, 0, angle);
  const needle = polar(cx, cy, r - 4, angle);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${label} strength gauge`}>
        <path d={bgPath} fill={wash(color, "14")} stroke={HAIRLINE} strokeWidth={1} />
        <path d={fillPath} fill={wash(color, "30")} stroke={color} strokeWidth={2} />
        <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={4} fill={color} />
      </svg>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontWeight: 800, color, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {label}
        </p>
        <div style={{ marginTop: "0.2rem" }}>
          <QualityBadge quality={quality} />
        </div>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.74rem", lineHeight: 1.45, maxWidth: 150 }}>{note}</p>
      </div>
    </div>
  );
}

function TravelSignificatorDials({ candidate }: { candidate: Candidate }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: "0.75rem",
        justifyItems: "center",
      }}
    >
      <Gauge label="Moon" color={MOON_SILVER} quality={candidate.moonState} note={candidate.moonNote} />
      <Gauge label="Mercury" color={MERCURY_TEAL} quality={candidate.mercuryState} note={candidate.mercuryNote} />
      <Gauge label="Jupiter" color={JUPITER_SAFFRON} quality={candidate.jupiterState} note={candidate.jupiterNote} />
    </div>
  );
}

function ordinalSuffix(n: number) {
  if (n === 1 || n === 21 || n === 31) return "st";
  if (n === 2 || n === 22) return "nd";
  if (n === 3 || n === 23) return "rd";
  return "th";
}

function HouseFoundationChart({ houses }: { houses: Candidate["houses"] }) {
  const boxW = 110;
  const boxH = 72;
  const positions = [
    { x: 20, y: 28 },
    { x: 190, y: 28 },
    { x: 20, y: 128 },
    { x: 190, y: 128 },
  ];

  return (
    <svg width="100%" height={220} viewBox="0 0 320 220" role="img" aria-label="Travel house bala foundation chart">
      <rect x={15} y={20} width={290} height={180} rx={12} fill={SURFACE_2} stroke={HAIRLINE} strokeWidth={1} />
      {houses.map((h, i) => {
        const { x, y } = positions[i];
        const isCentral = h.house === 9;
        return (
          <g key={h.house}>
            <rect
              x={x}
              y={y}
              width={boxW}
              height={boxH}
              rx={10}
              fill={qualityBg(h.quality)}
              stroke={isCentral ? GOLD : qualityColor(h.quality)}
              strokeWidth={isCentral ? 2.5 : 1.5}
              strokeDasharray={isCentral ? "4 2" : undefined}
            />
            <foreignObject x={x} y={y} width={boxW} height={boxH}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.35rem",
                  boxSizing: "border-box",
                  textAlign: "center",
                  lineHeight: 1.25,
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 800, color: INK_PRIMARY }}>
                  {h.house}
                  {ordinalSuffix(h.house)} · {h.label}
                </div>
                <div
                  style={{
                    marginTop: "0.25rem",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    color: isCentral ? GOLD_DEEP : qualityColor(h.quality),
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  {isCentral ? "★ MOST-CENTRAL" : h.quality}
                </div>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}

function DirectionCompass({ direction, blocked }: { direction: DirectionKey; blocked: boolean }) {
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const armLength = 62;
  const armWidth = 18;

  const arms: { key: DirectionKey; angle: number; label: string; devanagari: string }[] = [
    { key: "east", angle: 90, label: "E", devanagari: "पू" },
    { key: "south", angle: 180, label: "S", devanagari: "द" },
    { key: "west", angle: 270, label: "W", devanagari: "प" },
    { key: "north", angle: 0, label: "N", devanagari: "उ" },
  ];

  const activeArm = arms.find((a) => a.key === direction)!;
  const tip = polar(cx, cy, armLength, activeArm.angle);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Direction compass">
        <circle cx={cx} cy={cy} r={armLength + 14} fill={SURFACE_3} stroke={HAIRLINE} strokeWidth={1} />
        {arms.map((arm) => {
          const end = polar(cx, cy, armLength - 6, arm.angle);
          const isActive = arm.key === direction;
          return (
            <g key={arm.key}>
              <line
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke={isActive ? (blocked ? VERMILION : DIRECTION_COLOUR[arm.key]) : HAIRLINE}
                strokeWidth={isActive ? 3 : 1.5}
              />
              <text
                x={polar(cx, cy, armLength + 8, arm.angle).x}
                y={polar(cx, cy, armLength + 8, arm.angle).y}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  fill: isActive ? (blocked ? VERMILION : DIRECTION_COLOUR[arm.key]) : INK_MUTED,
                }}
              >
                {arm.label}
              </text>
            </g>
          );
        })}
        {/* Active direction arrow */}
        <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke={blocked ? VERMILION : DIRECTION_COLOUR[direction]} strokeWidth={4} strokeLinecap="round" />
        <circle cx={tip.x} cy={tip.y} r={6} fill={blocked ? VERMILION : DIRECTION_COLOUR[direction]} />
        <circle cx={cx} cy={cy} r={8} fill={SURFACE} stroke={blocked ? VERMILION : DIRECTION_COLOUR[direction]} strokeWidth={2} />
      </svg>
      <div
        style={{
          border: `1px solid ${blocked ? VERMILION : DIRECTION_COLOUR[direction]}`,
          borderRadius: 12,
          background: blocked ? wash(VERMILION, "12") : wash(DIRECTION_COLOUR[direction], "12"),
          padding: "0.6rem 1rem",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: 800, color: blocked ? VERMILION : DIRECTION_COLOUR[direction], fontSize: "0.9rem" }}>
          {DIRECTION_LABELS[direction].label} direction {blocked ? "BLOCKED" : "clear"}
        </p>
      </div>
    </div>
  );
}

function BrahmaMuhurtaIndicator({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.7rem",
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        borderRadius: 12,
        background: active ? wash(GOLD, "12") : SURFACE,
        padding: "0.85rem 1rem",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: active ? wash(GOLD, "25") : wash(GOLD, "10"),
          display: "grid",
          placeItems: "center",
        }}
      >
        <Sun size={20} color={active ? GOLD_DEEP : INK_MUTED} />
      </div>
      <div>
        <p style={{ margin: 0, fontWeight: 800, color: active ? GOLD_DEEP : INK_PRIMARY, fontSize: "0.88rem" }}>
          Brahma-muhūrta {active ? "active" : "not active"}
        </p>
        <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.45 }}>
          {active
            ? "Pre-dawn ~48-minute window (~96-48 min before sunrise). Universally favourable for travel; Disha-Śūla override varies by tradition."
            : "Outside Brahma-muhūrta window. Direction-day-pairing and Disha-Śūla apply normally."}
        </p>
      </div>
    </div>
  );
}

function TravellerCards({ travellers }: { travellers: Candidate["travellers"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
      {travellers.map((traveller) => (
        <div
          key={traveller.name}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            background: SURFACE,
            padding: "0.9rem 1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.45rem" }}>
            <Heart size={16} color={GOLD_DEEP} />
            <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{traveller.name}</span>
            <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>({traveller.role})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>Tārā-bala</p>
              <div style={{ marginTop: "0.2rem" }}>
                <QualityBadge quality={traveller.taraQuality} />
              </div>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{traveller.taraNote}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>Lagna-śuddhi ({traveller.lagnaSign})</p>
              <div style={{ marginTop: "0.2rem" }}>
                <QualityBadge quality={traveller.lagnaQuality} />
              </div>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{traveller.lagnaNote}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>Navāṁśa correspondence</p>
              <div style={{ marginTop: "0.2rem" }}>
                <QualityBadge quality={traveller.navamshaQuality} />
              </div>
              <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{traveller.navamshaNote}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DoshaList({ doshas }: { doshas: Candidate["doshas"] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
      {doshas.map((dosha) => (
        <div
          key={dosha.key}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.7rem",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            background: dosha.triggered ? wash(VERMILION, "10") : wash(JADE, "10"),
            padding: "0.75rem 0.9rem",
          }}
        >
          <div style={{ marginTop: "0.05rem" }}>
            {dosha.triggered ? <XCircle size={18} color={VERMILION} /> : <CheckCircle2 size={18} color={JADE} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.88rem" }}>{dosha.label}</span>
              <span
                style={{
                  padding: "0.12rem 0.45rem",
                  borderRadius: 999,
                  background: dosha.triggered ? wash(VERMILION, "18") : wash(JADE, "14"),
                  color: dosha.triggered ? VERMILION : JADE,
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                }}
              >
                {dosha.triggered ? "Triggered" : "Clear"}
              </span>
            </div>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{dosha.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function VerdictCard({ candidate }: { candidate: Candidate }) {
  const result = useMemo(() => scoreCandidate(candidate), [candidate]);
  const triggered = candidate.doshas.filter((d) => d.triggered).length;

  return (
    <div
      style={{
        border: `1px solid ${verdictColor(result.verdict)}`,
        borderRadius: 16,
        background: verdictBg(result.verdict),
        padding: "1.1rem 1.25rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Crown size={22} color={verdictColor(result.verdict)} />
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "0.72rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: verdictColor(result.verdict),
              }}
            >
              Integrated Verdict
            </p>
            <p style={{ margin: "0.1rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "1.2rem" }}>{result.label}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "0.75rem", color: INK_MUTED, fontWeight: 700 }}>Score</p>
          <p style={{ margin: "0.1rem 0 0", fontWeight: 800, color: INK_PRIMARY, fontSize: "1.1rem" }}>
            {result.score} / {result.max}
          </p>
          {triggered > 0 && (
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.7rem", color: VERMILION, fontWeight: 700 }}>{triggered} cancellation doṣa(s)</p>
          )}
          {candidate.dishaSula.triggered && (
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.7rem", color: VERMILION, fontWeight: 700 }}>Disha-Śūla triggered</p>
          )}
        </div>
      </div>
      <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{candidate.recommendation}</p>
    </div>
  );
}

function ProgressBar({ candidate }: { candidate: Candidate }) {
  const result = useMemo(() => scoreCandidate(candidate), [candidate]);
  const pct = result.max > 0 ? (result.score / result.max) * 100 : 0;
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: INK_MUTED,
          marginBottom: "0.25rem",
        }}
      >
        <span>Integrated score</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: wash(GOLD, "14"), overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
          style={{ height: "100%", background: verdictColor(result.verdict), borderRadius: 999 }}
        />
      </div>
    </div>
  );
}


/* ── Tab views ─────────────────────────────────────────── */

function RulesWheelView() {
  const [activeKey, setActiveKey] = useState<string | null>("vara");
  const synthetic = useMemo(
    () =>
      ([
        { key: "tithi", label: "Tithi", value: "", quality: "neutral", note: "" },
        { key: "vara", label: "Vāra", value: "", quality: "neutral", note: "" },
        { key: "nakshatra", label: "Nakṣatra", value: "", quality: "neutral", note: "" },
        { key: "yoga", label: "Yoga", value: "", quality: "neutral", note: "" },
        { key: "karana", label: "Karaṇa", value: "", quality: "neutral", note: "" },
      ] as PanchangaFactor[]),
    [],
  );

  const activeRule = activeKey ? PANCHANGA_RULES[activeKey as keyof typeof PANCHANGA_RULES] : null;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <SectionCard title="Yātrā-muhūrta pañcāṅga weighting wheel" icon={<Scale size={16} />}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <PanchangaWheel panchanga={synthetic} activeKey={activeKey ?? undefined} onHover={setActiveKey} />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {activeRule ? (
              <>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{activeRule.note}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: wash(JADE, "10"), padding: "0.65rem 0.85rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: JADE, textTransform: "uppercase" }}>Prefer</span>
                    <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.45 }}>
                      {activeRule.favourable.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: wash(VERMILION, "10"), padding: "0.65rem 0.85rem" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 800, color: VERMILION, textTransform: "uppercase" }}>Avoid</span>
                    <ul style={{ margin: "0.3rem 0 0", paddingLeft: "1rem", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.45 }}>
                      {activeRule.avoid.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem" }}>Hover or click a wheel segment to see the yātrā rule.</p>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Direction-day pairing discipline" icon={<Compass size={16} />}>
        <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
          Direction-of-travel modulates vāra-selection. Thursday is universally favourable, but must still pass Disha-Śūla screening.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem" }}>
          {(Object.keys(DAY_PROFILES) as DayKey[]).map((day) => {
            const profile = DAY_PROFILES[day];
            const favoured = profile.favouredDirection;
            return (
              <div
                key={day}
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 10,
                  background: favoured === "avoid" ? wash(VERMILION, "10") : wash(JADE, "10"),
                  padding: "0.65rem 0.75rem",
                  textAlign: "center",
                }}
              >
                <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.9rem" }}>{profile.label}</p>
                <p style={{ margin: "0.1rem 0 0", fontSize: "0.7rem", color: INK_MUTED }}>{profile.lord}</p>
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    color: favoured === "avoid" ? VERMILION : JADE,
                    textTransform: "uppercase",
                  }}
                >
                  {favoured === "avoid" ? "Avoid travel" : favoured === "all" ? "All directions" : `→ ${DIRECTION_LABELS[favoured].label}`}
                </p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="Moon-Mercury-Jupiter importance discipline" icon={<Crown size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(MOON_SILVER, "10"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: MOON_SILVER, fontSize: "0.8rem", textTransform: "uppercase" }}>Moon = momentum + comfort</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Nurturing-substance for comfortable travel and momentum.
            </p>
          </div>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(MERCURY_TEAL, "10"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: MERCURY_TEAL, fontSize: "0.8rem", textTransform: "uppercase" }}>Mercury = movement + communication</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              The classical travel-significator for movement and logistics.
            </p>
          </div>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(JUPITER_SAFFRON, "12"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: JUPITER_SAFFRON, fontSize: "0.8rem", textTransform: "uppercase" }}>Jupiter = dharma + pilgrimage</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Sacred-tradition and wisdom for pilgrimage-travel particularly.
            </p>
          </div>
        </div>
        <div style={{ marginTop: "0.85rem", border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "0.85rem 1rem" }}>
          <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.85rem" }}>All three should be strong</p>
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.55 }}>
            {MOON_MERCURY_JUPITER_RULES.strongSigns.map((r) => (
              <li key={r}>{r}</li>
            ))}
            {MOON_MERCURY_JUPITER_RULES.weakSigns.map((r) => (
              <li key={r} style={{ color: VERMILION }}>
                {r}
              </li>
            ))}
            {MOON_MERCURY_JUPITER_RULES.placement.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p style={{ margin: "0.55rem 0 0", fontSize: "0.78rem", color: INK_MUTED, lineHeight: 1.45 }}>{MOON_MERCURY_JUPITER_RULES.note}</p>
        </div>
      </SectionCard>

      <SectionCard title="Lagna-śuddhi for yātrā" icon={<Star size={16} />}>
        <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
          Cara-rāśi (movable signs) are most favoured for movement-momentum matching travel. Mithuna/Dhanu/Mīna are acceptable; fixed signs less aligned.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem" }}>
          {LAGNA_PROFILES.map((lagna) => (
            <div
              key={lagna.sign}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 10,
                background: qualityBg(lagna.quality),
                padding: "0.65rem 0.75rem",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.95rem" }}>{lagna.sign}</p>
              <p style={{ margin: "0.1rem 0 0", fontSize: "0.7rem", color: INK_MUTED }}>{lagna.ruler}</p>
              <div style={{ marginTop: "0.3rem" }}>
                <QualityBadge quality={lagna.quality} />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DoshaScreenerView() {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CANCELLATION_DOSHAS.forEach((d) => {
      initial[d.key] = false;
    });
    return initial;
  });

  const triggered = CANCELLATION_DOSHAS.filter((d) => checked[d.key]);

  return (
    <SectionCard title="Interactive cancellation-doṣa screener" icon={<ShieldCheck size={16} />}>
      <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
        Toggle the yātrā-specific cancellation doṣas that apply to a candidate. Any triggered doṣa heavily penalises the recommendation; multiple
        triggered doṣas generally rule the candidate out.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {CANCELLATION_DOSHAS.map((dosha) => (
          <label
            key={dosha.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.7rem",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: checked[dosha.key] ? wash(VERMILION, "10") : SURFACE,
              padding: "0.8rem 0.95rem",
              cursor: "pointer",
              transition: "background 150ms ease",
            }}
          >
            <input
              type="checkbox"
              checked={checked[dosha.key]}
              onChange={(e) => setChecked((prev) => ({ ...prev, [dosha.key]: e.target.checked }))}
              style={{ marginTop: "0.15rem", accentColor: VERMILION, cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.88rem" }}>{dosha.label}</p>
              <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{dosha.description}</p>
            </div>
          </label>
        ))}
      </div>
      <div
        style={{
          marginTop: "0.85rem",
          border: `1px solid ${triggered.length > 0 ? VERMILION : JADE}`,
          borderRadius: 12,
          background: triggered.length > 0 ? wash(VERMILION, "12") : wash(JADE, "12"),
          padding: "0.85rem 1rem",
        }}
      >
        <p style={{ margin: 0, fontWeight: 800, color: triggered.length > 0 ? VERMILION : JADE, fontSize: "0.9rem" }}>
          {triggered.length === 0
            ? "No cancellation doṣas selected — candidate passes first-pass exclusion."
            : `${triggered.length} doṣa${triggered.length > 1 ? "s" : ""} selected: ${triggered.map((d) => d.label).join("; ")}. Recommendation is heavily modulated or disqualified.`}
        </p>
      </div>
    </SectionCard>
  );
}

function DishaSulaExplorerView() {
  const [selectedDay, setSelectedDay] = useState<DayKey>("thursday");
  const [selectedDirection, setSelectedDirection] = useState<DirectionKey>("south");

  const blockedDirection = DISHA_SULA_RULES[selectedDay];
  const isBlocked = blockedDirection === selectedDirection;
  const pairing = DAY_PROFILES[selectedDay];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <SectionCard title="Disha-Śūla direction-blocked-by-day explorer" icon={<Compass size={16} />}>
        <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
          Select a weekday and a direction-of-travel. Disha-Śūla operates as a pre-evaluation filter: if the selected direction is blocked for that
          weekday, the combination is AVOIDED regardless of other favourable factors. Disha-Śūla overrides direction-day-pairing when they conflict
          (e.g., Thursday is universally favourable, but Thursday-South is blocked).
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div>
              <p style={{ margin: "0 0 0.4rem", fontWeight: 800, color: GOLD_DEEP, fontSize: "0.8rem", textTransform: "uppercase" }}>Weekday</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "0.45rem" }}>
                {(Object.keys(DAY_PROFILES) as DayKey[]).map((day) => {
                  const active = selectedDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className="gl-focus-ring gl-clickable"
                      style={{
                        border: `1px solid ${active ? GOLD : HAIRLINE}`,
                        borderRadius: 8,
                        background: active ? "#FFFCF7" : SURFACE,
                        padding: "0.5rem 0.4rem",
                        cursor: "pointer",
                        fontWeight: active ? 800 : 700,
                        fontSize: "0.78rem",
                        color: active ? GOLD_DEEP : INK_SECONDARY,
                        transition: "all 150ms ease",
                      }}
                    >
                      {DAY_PROFILES[day].label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p style={{ margin: "0.5rem 0 0.4rem", fontWeight: 800, color: GOLD_DEEP, fontSize: "0.8rem", textTransform: "uppercase" }}>
                Direction
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "0.45rem" }}>
                {(["east", "south", "west", "north"] as DirectionKey[]).map((dir) => {
                  const active = selectedDirection === dir;
                  return (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setSelectedDirection(dir)}
                      className="gl-focus-ring gl-clickable"
                      style={{
                        border: `1px solid ${active ? DIRECTION_COLOUR[dir] : HAIRLINE}`,
                        borderRadius: 8,
                        background: active ? wash(DIRECTION_COLOUR[dir], "12") : SURFACE,
                        padding: "0.5rem 0.4rem",
                        cursor: "pointer",
                        fontWeight: active ? 800 : 700,
                        fontSize: "0.78rem",
                        color: active ? DIRECTION_COLOUR[dir] : INK_SECONDARY,
                        transition: "all 150ms ease",
                      }}
                    >
                      {DIRECTION_LABELS[dir].label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 14,
              background: SURFACE,
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <DirectionCompass direction={selectedDirection} blocked={isBlocked} />
          </div>
        </div>

        <motion.div
          key={`${selectedDay}-${selectedDirection}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "1rem",
            border: `1px solid ${isBlocked ? VERMILION : JADE}`,
            borderRadius: 12,
            background: isBlocked ? wash(VERMILION, "12") : wash(JADE, "12"),
            padding: "0.85rem 1rem",
          }}
        >
          <p style={{ margin: 0, fontWeight: 800, color: isBlocked ? VERMILION : JADE, fontSize: "0.95rem" }}>
            {isBlocked
              ? `${DAY_PROFILES[selectedDay].label} + ${DIRECTION_LABELS[selectedDirection].label} = Disha-Śūla — AVOID`
              : `${DAY_PROFILES[selectedDay].label} + ${DIRECTION_LABELS[selectedDirection].label} = Clear — not blocked by Disha-Śūla`}
          </p>
          <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
            {isBlocked
              ? `${DAY_PROFILES[selectedDay].label} blocks ${DIRECTION_LABELS[selectedDirection].label}-direction travel. Disha-Śūla is a pre-evaluation filter: this combination is classically avoided regardless of other favourable factors.`
              : `${DAY_PROFILES[selectedDay].label}'s Disha-Śūla is ${DIRECTION_LABELS[blockedDirection].label}, not ${DIRECTION_LABELS[selectedDirection].label}. This combination is not blocked; now check direction-day-pairing and integrated four-pillar evaluation.`}
          </p>
          {!isBlocked && pairing.favouredDirection !== "avoid" && (
            <p style={{ margin: "0.3rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.45 }}>
              Direction-day-pairing: {pairing.favouredDirection === "all"
                ? `${DAY_PROFILES[selectedDay].label} is universally favourable.`
                : `${DAY_PROFILES[selectedDay].label} favours ${DIRECTION_LABELS[pairing.favouredDirection].label} direction.`}
            </p>
          )}
        </motion.div>
      </SectionCard>

      <SectionCard title="Disha-Śūla reference matrix" icon={<MapPin size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
          {[
            { days: "Monday + Saturday", direction: "east" },
            { days: "Tuesday + Wednesday", direction: "north" },
            { days: "Thursday", direction: "south" },
            { days: "Friday + Sunday", direction: "west" },
          ].map((rule) => (
            <div
              key={rule.days}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 12,
                background: wash(DIRECTION_COLOUR[rule.direction as DirectionKey], "10"),
                padding: "0.75rem 0.9rem",
              }}
            >
              <p style={{ margin: 0, fontWeight: 800, color: DIRECTION_COLOUR[rule.direction as DirectionKey], fontSize: "0.85rem" }}>
                {rule.days}
              </p>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem" }}>
                Avoid {DIRECTION_LABELS[rule.direction as DirectionKey].label}-direction travel ({DIRECTION_LABELS[rule.direction as DirectionKey].devanagari})
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SafetyPriorityView() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    "flight-schedule": false,
    "driving-safety": false,
    "medical-emergency": false,
    "natural-hazard": false,
  });

  const items = [
    {
      key: "flight-schedule",
      title: "Flight / train schedule constraints",
      body: "The muhūrta-window operates within available departure windows, not against them. Practitioner recommends within feasible candidate-set.",
    },
    {
      key: "driving-safety",
      title: "Driving-safety hours",
      body: "Unsafe driving-hours (late-night fatigue; pre-dawn visibility; monsoon hazards) override muhūrta-optimisation.",
    },
    {
      key: "medical-emergency",
      title: "Medical-emergency travel",
      body: "Medical-urgency overrides muhūrta-optimisation entirely. Medical-team judgment is paramount; muhūrta supports process, not outcome.",
    },
    {
      key: "natural-hazard",
      title: "Natural-hazard avoidance",
      body: "Cyclone / flood / earthquake / landslide context overrides muhūrta-optimisation per safety-priority.",
    },
  ];

  const allChecked = items.every((i) => checked[i.key]);
  const count = items.filter((i) => checked[i.key]).length;

  return (
    <SectionCard title="Safety-context priority pledge" icon={<ShieldAlert size={16} />}>
      <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
        Before recommending a yātrā-muhūrta, the practitioner must acknowledge that safety-context priorities override muhūrta-optimisation. Muhūrta
        expertise is NOT safety-engineering or medical-judgment per Lesson 24.2.4 competence-boundary.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {items.map((item) => (
          <label
            key={item.key}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.7rem",
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 12,
              background: checked[item.key] ? wash(JADE, "10") : SURFACE,
              padding: "0.8rem 0.95rem",
              cursor: "pointer",
              transition: "background 150ms ease",
            }}
          >
            <input
              type="checkbox"
              checked={checked[item.key]}
              onChange={(e) => setChecked((prev) => ({ ...prev, [item.key]: e.target.checked }))}
              style={{ marginTop: "0.15rem", accentColor: JADE, cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.88rem" }}>{item.title}</p>
              <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.45 }}>{item.body}</p>
            </div>
          </label>
        ))}
      </div>

      <div style={{ marginTop: "0.85rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.72rem",
            fontWeight: 700,
            color: INK_MUTED,
            marginBottom: "0.25rem",
          }}
        >
          <span>Pledge progress</span>
          <span>
            {count}/{items.length}
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: wash(GOLD, "14"), overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(count / items.length) * 100}%` }}
            transition={{ duration: 0.35 }}
            style={{ height: "100%", background: allChecked ? JADE : AMBER, borderRadius: 999 }}
          />
        </div>
      </div>

      {allChecked && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: "0.85rem",
            border: `1px solid ${JADE}`,
            borderRadius: 12,
            background: wash(JADE, "12"),
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <CheckCircle2 size={20} color={JADE} />
          <p style={{ margin: 0, fontWeight: 800, color: JADE, fontSize: "0.9rem" }}>
            Pledge acknowledged. Recommendation will respect safety-context priority over muhūrta-optimisation.
          </p>
        </motion.div>
      )}
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */

export function YatraMuhurtaEvaluator() {
  const [tab, setTab] = useState<TabKey>("evaluate");
  const [selectedId, setSelectedId] = useState<string>(CANDIDATES[0].id);
  const [activePanchangaKey, setActivePanchangaKey] = useState<string | null>(null);
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

  const selectedCandidate = useMemo(() => CANDIDATES.find((c) => c.id === selectedId) ?? CANDIDATES[0], [selectedId]);
  const activePanchanga = useMemo(
    () => selectedCandidate.panchanga.find((p) => p.key === activePanchangaKey),
    [selectedCandidate, activePanchangaKey],
  );

  const handleReset = () => {
    setTab("evaluate");
    setSelectedId(CANDIDATES[0].id);
    setActivePanchangaKey(null);
    setResetKey((k) => k + 1);
  };

  return (
    <div
      data-interactive="yatra-muhurta-evaluator"
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
            width: 140,
            height: 140,
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
              Lesson 23.4.4 — Yātrā-Muhūrta
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
              Yātrā-Muhūrta Evaluator
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 820,
                fontSize: "0.92rem",
              }}
            >
              Apply the travel-commencement event-type framework: direction-day-pairing, Disha-Śūla avoidance, Brahma-muhūrta universal-window,
              travel-specific pañcāṅga weighting, 9th-house-most-central bala, Moon-Mercury-Jupiter discipline, and safety-context priority.
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
            <RefreshCcw size={14} />
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Yātrā-Muhūrta evaluator tabs"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "0.5rem",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className="gl-focus-ring gl-clickable"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.7rem 0.85rem",
                borderRadius: 12,
                border: `1px solid ${active ? GOLD : HAIRLINE}`,
                background: active ? "#FFFCF7" : SURFACE,
                color: active ? GOLD_DEEP : INK_SECONDARY,
                fontWeight: active ? 800 : 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: reducedMotion ? "none" : "all 180ms ease",
                boxShadow: active ? `0 0 0 2px ${wash(GOLD, "18")}` : "none",
              }}
            >
              <span style={{ color: active ? GOLD : INK_MUTED }}>{t.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div>{t.label}</div>
                <div style={{ fontSize: "0.68rem", fontWeight: 600, opacity: 0.82 }}>{t.sublabel}</div>
              </div>
              <ChevronRight
                size={14}
                style={{
                  marginLeft: "auto",
                  opacity: active ? 1 : 0,
                  transform: active ? "translateX(0)" : "translateX(-4px)",
                  transition: reducedMotion ? "none" : "all 180ms ease",
                }}
              />
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${tab}-${resetKey}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          style={{ display: "grid", gap: "1rem" }}
        >
          {tab === "evaluate" && (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(260px, 320px) 1fr",
                  gap: "1rem",
                  alignItems: "start",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SectionCard title="Candidate windows" icon={<Compass size={16} />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {CANDIDATES.map((candidate) => (
                        <CandidateFileCard
                          key={candidate.id}
                          candidate={candidate}
                          selected={selectedId === candidate.id}
                          onClick={() => setSelectedId(candidate.id)}
                        />
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Moon-Mercury-Jupiter importance" icon={<Crown size={16} />}>
                    <TravelSignificatorDials candidate={selectedCandidate} />
                  </SectionCard>

                  <SectionCard title="Yātrā house-bala (9th most-central)" icon={<MapPin size={16} />}>
                    <HouseFoundationChart houses={selectedCandidate.houses} />
                  </SectionCard>

                  <VerdictCard candidate={selectedCandidate} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SectionCard title="Pañcāṅga evaluation" icon={<Scale size={16} />}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1rem",
                        alignItems: "start",
                      }}
                    >
                      <PanchangaWheel
                        panchanga={selectedCandidate.panchanga}
                        activeKey={activePanchangaKey ?? undefined}
                        onHover={setActivePanchangaKey}
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                        {activePanchanga ? (
                          <PanchangaDetail factor={activePanchanga} />
                        ) : (
                          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", lineHeight: 1.5 }}>
                            Hover or click a wheel segment to see the candidate&apos;s pañcāṅga factor detail.
                          </p>
                        )}
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="Direction + Disha-Śūla" icon={<Compass size={16} />}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "1rem",
                        alignItems: "center",
                      }}
                    >
                      <DirectionCompass
                        direction={selectedCandidate.direction}
                        blocked={selectedCandidate.dishaSula.triggered}
                      />
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.75rem 0.9rem" }}>
                          <p style={{ margin: 0, fontWeight: 800, color: GOLD_DEEP, fontSize: "0.78rem", textTransform: "uppercase" }}>
                            Direction-day pairing
                          </p>
                          <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                            {DAY_PROFILES[selectedCandidate.day].note}
                          </p>
                        </div>
                        <BrahmaMuhurtaIndicator active={selectedCandidate.brahmaMuhurta} />
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="Traveller synergy" icon={<Users size={16} />}>
                    <TravellerCards travellers={selectedCandidate.travellers} />
                  </SectionCard>

                  <SectionCard title="Cancellation doṣas" icon={<ShieldCheck size={16} />}>
                    <DoshaList doshas={selectedCandidate.doshas} />
                  </SectionCard>

                  <SectionCard title="Safety-context priority" icon={<ShieldAlert size={16} />}>
                    <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{selectedCandidate.safetyContext}</p>
                  </SectionCard>

                  <ProgressBar candidate={selectedCandidate} />
                </div>
              </div>
            </>
          )}

          {tab === "rules" && <RulesWheelView />}

          {tab === "disha" && <DishaSulaExplorerView />}

          {tab === "safety" && <SafetyPriorityView />}
        </motion.div>
      </AnimatePresence>

      {/* Footer note */}
      <footer
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: "0.75rem",
          color: INK_MUTED,
          fontSize: "0.76rem",
          lineHeight: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: "0.5rem",
        }}
      >
        <Info size={14} style={{ marginTop: "0.15rem", flexShrink: 0 }} />
        <span>
          This evaluator is a pedagogical synthesis drill, not a personal muhūrta calculator. Real yātrā-muhūrta selection requires full ephemeris
          computation, regional-tradition variance awareness, Disha-Śūla discipline, Brahma-muhūrta timing, and the M24 ethics framework including
          safety-context priority (medical-emergency / natural-hazard / driving-safety override).
        </span>
      </footer>
    </div>
  );
}
