"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Crown,
  Factory,
  Info,
  Landmark,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import {
  BUSINESS_TYPES,
  CANDIDATES,
  LAGNA_PROFILES,
  MERCURY_JUPITER_RULES,
  PANCHANGA_RULES,
  type BusinessTypeKey,
  type Candidate,
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
const GOLD = "var(--gl-gold, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const VERMILION = "var(--gl-vermilion-on-cream, #A23A1E)";
const JADE = "#2F7D55";
const INDIGO = "#4F6FA8";
const AMBER = "#B9801E";
const MERCURY_TEAL = "#2A7A7A";
const JUPITER_SAFFRON = "#D68C2E";

const BUSINESS_COLOUR: Record<BusinessTypeKey, string> = {
  commerce: JADE,
  financial: GOLD,
  manufacturing: VERMILION,
  technology: INDIGO,
  leadership: AMBER,
};

type TabKey = "evaluate" | "rules" | "business" | "ethics";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "evaluate", label: "Evaluate", sublabel: "4 candidate windows", icon: <Scale size={15} /> },
  { key: "rules", label: "Launch Rules", sublabel: "Pañcāṅga + planets", icon: <Sparkles size={15} /> },
  { key: "business", label: "Business Lens", sublabel: "5 industry types", icon: <Briefcase size={15} /> },
  { key: "ethics", label: "Nirlobha Pledge", sublabel: "M24 ethics", icon: <BadgeCheck size={15} /> },
];

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : `rgba(156,122,47,${Number.parseInt(alphaHex, 16) / 255})`;
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
    (quality === "favourable" ? "Favourable" : quality === "mixed" ? "Mixed" : quality === "unfavourable" ? "Unfavourable" : "Neutral");
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
        <div style={{ marginTop: "0.6rem", display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
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
  const width = 140;
  const height = 84;
  const cx = width / 2;
  const cy = height - 10;
  const r = 56;
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
        <QualityBadge quality={quality} />
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.76rem", lineHeight: 1.45, maxWidth: 160 }}>{note}</p>
      </div>
    </div>
  );
}

function MercuryJupiterDial({ candidate }: { candidate: Candidate }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1rem",
        justifyItems: "center",
      }}
    >
      <Gauge label="Mercury" color={MERCURY_TEAL} quality={candidate.mercuryState} note={candidate.mercuryNote} />
      <Gauge label="Jupiter" color={JUPITER_SAFFRON} quality={candidate.jupiterState} note={candidate.jupiterNote} />
    </div>
  );
}

function HouseFoundationChart({ houses }: { houses: Candidate["houses"] }) {
  return (
    <svg width="100%" height={180} viewBox="0 0 320 180" role="img" aria-label="House bala foundation chart">
      <rect x={20} y={20} width={280} height={140} rx={12} fill={SURFACE_2} stroke={HAIRLINE} strokeWidth={1} />
      <line x1={160} y1={20} x2={160} y2={160} stroke={HAIRLINE} strokeWidth={1} />
      <line x1={20} y1={90} x2={300} y2={90} stroke={HAIRLINE} strokeWidth={1} />
      {houses.map((h, i) => {
        const x = i % 2 === 0 ? 25 : 165;
        const y = i < 2 ? 25 : 95;
        return (
          <g key={h.house}>
            <rect x={x} y={y} width={130} height={60} rx={8} fill={qualityBg(h.quality)} stroke={qualityColor(h.quality)} strokeWidth={1.5} />
            <text x={x + 65} y={y + 22} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "0.75rem", fontWeight: 800, fill: INK_PRIMARY }}>
              {h.house}th · {h.label}
            </text>
            <text x={x + 65} y={y + 44} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "0.65rem", fontWeight: 700, fill: qualityColor(h.quality), textTransform: "uppercase" }}>
              {h.quality}
            </text>
          </g>
        );
      })}
      <rect x={120} y={70} width={80} height={40} rx={8} fill={SURFACE} stroke={GOLD} strokeWidth={1.5} />
      <text x={160} y={92} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "0.65rem", fontWeight: 800, fill: GOLD_DEEP, textTransform: "uppercase" }}>
        Business
      </text>
    </svg>
  );
}

function FounderCards({ founders }: { founders: Candidate["founders"] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
      {founders.map((founder) => (
        <div
          key={founder.name}
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 12,
            background: SURFACE,
            padding: "0.9rem 1rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.45rem" }}>
            <Users size={16} color={GOLD_DEEP} />
            <span style={{ fontWeight: 800, color: INK_PRIMARY }}>{founder.name}</span>
            <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>({founder.natalStar})</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {[
              { label: "Tārā-bala", quality: founder.taraQuality, note: founder.taraNote },
              { label: `Lagna-śuddhi (${founder.lagnaSign})`, quality: founder.lagnaQuality, note: founder.lagnaNote },
              { label: "Navāṁśa correspondence", quality: founder.navamshaQuality, note: founder.navamshaNote },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: INK_MUTED }}>{item.label}</p>
                <div style={{ marginTop: "0.2rem" }}>
                  <QualityBadge quality={item.quality} />
                </div>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.35 }}>{item.note}</p>
              </div>
            ))}
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
            <p style={{ margin: "0.15rem 0 0", fontSize: "0.7rem", color: VERMILION, fontWeight: 700 }}>{triggered} doṣa(s) triggered</p>
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
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, marginBottom: "0.25rem" }}>
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
      <SectionCard title="Business-launch pañcāṅga weighting wheel" icon={<Scale size={16} />}>
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
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem" }}>Hover or click a wheel segment to see the business-launch rule.</p>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Mercury-Jupiter importance discipline" icon={<Crown size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.85rem" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(MERCURY_TEAL, "10"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: MERCURY_TEAL, fontSize: "0.8rem", textTransform: "uppercase" }}>Mercury = vyāpāra-tattva</p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Commerce-principle, communication, intellectual activity — the classical business-significator.
            </p>
          </div>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: wash(JUPITER_SAFFRON, "12"), padding: "0.85rem 1rem" }}>
            <p style={{ margin: 0, fontWeight: 800, color: JUPITER_SAFFRON, fontSize: "0.8rem", textTransform: "uppercase" }}>
              Jupiter = prosperity-significator
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Wisdom, expansion, benediction, dhana + lakṣmī association — prosperity dimension.
            </p>
          </div>
        </div>
        <div style={{ marginTop: "0.85rem", border: `1px solid ${HAIRLINE}`, borderRadius: 12, background: SURFACE, padding: "0.85rem 1rem" }}>
          <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.85rem" }}>Both must be strong</p>
          <ul style={{ margin: "0.4rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.55 }}>
            {MERCURY_JUPITER_RULES.strongSigns.map((r) => (
              <li key={r}>{r}</li>
            ))}
            {MERCURY_JUPITER_RULES.weakSigns.map((r) => (
              <li key={r} style={{ color: VERMILION }}>
                {r}
              </li>
            ))}
            {MERCURY_JUPITER_RULES.placement.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p style={{ margin: "0.55rem 0 0", fontSize: "0.78rem", color: INK_MUTED, lineHeight: 1.45 }}>{MERCURY_JUPITER_RULES.note}</p>
        </div>
      </SectionCard>

      <SectionCard title="Lagna-śuddhi for business-launch" icon={<Target size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem" }}>
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

const BUSINESS_ICON: Record<BusinessTypeKey, React.ReactNode> = {
  commerce: <Building2 size={18} />,
  financial: <Landmark size={18} />,
  manufacturing: <Factory size={18} />,
  technology: <Cpu size={18} />,
  leadership: <Sun size={18} />,
};

function BusinessLensView() {
  const [selected, setSelected] = useState<BusinessTypeKey>("technology");
  const type = BUSINESS_TYPES.find((t) => t.key === selected)!;
  const colour = BUSINESS_COLOUR[selected];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <SectionCard title="Select a business-type refinement lens" icon={<Briefcase size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem" }}>
          {BUSINESS_TYPES.map((t) => {
            const active = selected === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelected(t.key)}
                className="gl-focus-ring gl-clickable"
                style={{
                  border: `1px solid ${active ? BUSINESS_COLOUR[t.key] : HAIRLINE}`,
                  borderRadius: 12,
                  background: active ? wash(BUSINESS_COLOUR[t.key], "12") : SURFACE,
                  padding: "0.75rem 0.85rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 150ms ease",
                  boxShadow: active ? `0 0 0 2px ${wash(BUSINESS_COLOUR[t.key], "18")}` : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: active ? BUSINESS_COLOUR[t.key] : INK_PRIMARY, fontWeight: 800, fontSize: "0.85rem" }}>
                  {BUSINESS_ICON[t.key]}
                  {t.label}
                </div>
                <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{t.tagline}</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title={`${type.label} refinement map`} icon={<TrendingUp size={16} />}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 14, background: wash(colour, "10"), padding: "1rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: wash(colour, "18") }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: colour, fontWeight: 800, fontSize: "1rem" }}>
                {BUSINESS_ICON[type.key]}
                {type.label}
              </div>
              <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.5 }}>{type.note}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.65rem 0.85rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: colour, textTransform: "uppercase" }}>Planetary emphasis</span>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem" }}>{type.planetEmphasis.join(" · ")}</p>
            </div>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.65rem 0.85rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: colour, textTransform: "uppercase" }}>Preferred vāra</span>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem" }}>{type.vara}</p>
            </div>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.65rem 0.85rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: colour, textTransform: "uppercase" }}>Favoured lagna</span>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem" }}>{type.lagna}</p>
            </div>
            <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: SURFACE, padding: "0.65rem 0.85rem" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 800, color: colour, textTransform: "uppercase" }}>House emphasis</span>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem" }}>{type.houses}</p>
            </div>
            {type.exceptions && (
              <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 10, background: wash(AMBER, "12"), padding: "0.65rem 0.85rem" }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, color: AMBER, textTransform: "uppercase" }}>Exception</span>
                <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem" }}>{type.exceptions}</p>
              </div>
            )}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function EthicsPledgeView() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    "no-overpromise": false,
    "standard-fee": false,
    "scope-boundary": false,
  });

  const items = [
    {
      key: "no-overpromise",
      title: "I will not over-promise commercial success",
      body: "Business-launch-muhūrta supports launch-conditions only. Commercial-success depends on strategy, execution, market-conditions, team-quality, product-quality, and broader context.",
    },
    {
      key: "standard-fee",
      title: "I will keep fees standard, not stakes-inflated",
      body: "Per nirlobha discipline, the fee corresponds to practitioner-effort + expertise + time — not to the magnitude of the client's business stakes.",
    },
    {
      key: "scope-boundary",
      title: "I will keep ongoing business decisions out-of-scope",
      body: "This consultation provides muhūrta-recommendation. Ongoing business-strategy/operations consultation is a life-coach/competence-boundary failure-mode.",
    },
  ];

  const allChecked = items.every((i) => checked[i.key]);
  const count = items.filter((i) => checked[i.key]).length;

  return (
    <SectionCard title="Nirlobha discipline pledge for business-launch" icon={<BadgeCheck size={16} />}>
      <p style={{ margin: "0 0 0.85rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
        Before recommending a business-launch muhūrta, the practitioner must internalise the M24-ethics extension. Check each commitment to acknowledge the discipline.
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
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", fontWeight: 700, color: INK_MUTED, marginBottom: "0.25rem" }}>
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
          <p style={{ margin: 0, fontWeight: 800, color: JADE, fontSize: "0.9rem" }}>Pledge acknowledged. Recommendation may be framed with honest articulation.</p>
        </motion.div>
      )}
    </SectionCard>
  );
}

/* ══════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════ */

export function VyaparaArambhMuhurtaEvaluator() {
  const [tab, setTab] = useState<TabKey>("evaluate");
  const [selectedId, setSelectedId] = useState<string>(CANDIDATES[1].id);
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

  const selectedCandidate = useMemo(() => CANDIDATES.find((c) => c.id === selectedId) ?? CANDIDATES[1], [selectedId]);
  const activePanchanga = useMemo(
    () => selectedCandidate.panchanga.find((p) => p.key === activePanchangaKey),
    [selectedCandidate, activePanchangaKey],
  );

  const handleReset = () => {
    setTab("evaluate");
    setSelectedId(CANDIDATES[1].id);
    setActivePanchangaKey(null);
    setResetKey((k) => k + 1);
  };

  return (
    <div
      data-interactive="vyapara-arambh-muhurta-evaluator"
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
              Lesson 23.4.2 — Vyāpāra-Ārambha-Muhūrta
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
              Business-Launch Muhūrta Evaluator
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
              Apply the business-launch event-type framework: pañcāṅga weighting, Mercury-Jupiter discipline, cancellation-doṣa screening,
              house-bala foundation, business-type refinement, and nirlobha ethics.
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
        aria-label="Business-launch muhūrta evaluator tabs"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
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
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                  <SectionCard title="Candidate case files" icon={<Briefcase size={16} />}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                      {CANDIDATES.map((candidate) => (
                        <CandidateFileCard
                          key={candidate.id}
                          candidate={candidate}
                          selected={selectedId === candidate.id}
                          onClick={() => {
                            setSelectedId(candidate.id);
                            setActivePanchangaKey(null);
                          }}
                        />
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <SectionCard title="Pañcāṅga wheel" icon={<Scale size={16} />}>
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
                      <div>{activePanchanga ? <PanchangaDetail factor={activePanchanga} /> : <PanchangaDetail factor={selectedCandidate.panchanga[0]} />}</div>
                    </div>
                    <ProgressBar candidate={selectedCandidate} />
                  </SectionCard>

                  <SectionCard title="Mercury-Jupiter importance dial" icon={<Crown size={16} />}>
                    <MercuryJupiterDial candidate={selectedCandidate} />
                  </SectionCard>

                  <SectionCard title="Business house-bala foundation" icon={<Building2 size={16} />}>
                    <HouseFoundationChart houses={selectedCandidate.houses} />
                  </SectionCard>

                  <SectionCard title="Multi-founder synergy" icon={<Users size={16} />}>
                    <FounderCards founders={selectedCandidate.founders} />
                  </SectionCard>

                  <SectionCard title="Cancellation-doṣa screen" icon={<ShieldCheck size={16} />}>
                    <DoshaList doshas={selectedCandidate.doshas} />
                  </SectionCard>

                  <VerdictCard candidate={selectedCandidate} />
                </div>
              </div>
            </>
          )}

          {tab === "rules" && <RulesWheelView />}

          {tab === "business" && <BusinessLensView />}

          {tab === "ethics" && <EthicsPledgeView />}
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
          This evaluator is a pedagogical synthesis drill, not a personal muhūrta calculator. Real business-launch selection requires full ephemeris computation,
          business-type clarification, and the M24 ethics framework (nirlobha fee discipline, scope-clarification, honest articulation).
        </span>
      </footer>
    </div>
  );
}
