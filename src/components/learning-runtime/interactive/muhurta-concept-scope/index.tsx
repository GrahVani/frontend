"use client";

import { useMemo, useState, useCallback } from "react";
import type React from "react";
import type { CSSProperties } from "react";
import {
  BadgeCheck,
  CalendarClock,
  Clock3,
  HelpCircle,
  RotateCcw,
  ShieldCheck,
  Sun,
  Moon,
  Star,
  Inbox,
  Mail,
  MailOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  DISCIPLINES,
  MUHURTA_UNITS,
  REQUESTS,
  evaluateScope,
  findDiscipline,
  findRequest,
  type DisciplineKey,
  type MuhurtaUnit,
  type RequestCase,
  type RequestKey,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

/* ── Helpers ───────────────────────────────────────────── */
function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function disciplineColor(key: DisciplineKey) {
  if (key === "muhurta") return GREEN;
  if (key === "prashna") return AMBER;
  if (key === "jataka") return BLUE;
  return VERMILION;
}

function qualityColor(quality: string) {
  if (quality === "highly-auspicious") return "#C5961A";
  if (quality === "auspicious") return GREEN;
  return VERMILION;
}

function qualityLabel(quality: string) {
  if (quality === "highly-auspicious") return "Highly Auspicious";
  if (quality === "auspicious") return "Auspicious";
  return "Inauspicious";
}

/* ── SVG Circular Dial ──────────────────────────────────── */
const DIAL_SIZE = 380;
const CENTER = DIAL_SIZE / 2;
const OUTER_R = 165;
const INNER_R = 80;
const LABEL_R = (OUTER_R + INNER_R) / 2;
const TICK_R = OUTER_R + 8;
const TOTAL_MUHURTAS = 30;
const WEDGE_ANGLE = 360 / TOTAL_MUHURTAS; // 12 degrees each

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, rOuter: number, rInner: number, startAngle: number, endAngle: number) {
  const outerStart = polarToCartesian(cx, cy, rOuter, startAngle);
  const outerEnd = polarToCartesian(cx, cy, rOuter, endAngle);
  const innerStart = polarToCartesian(cx, cy, rInner, endAngle);
  const innerEnd = polarToCartesian(cx, cy, rInner, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerStart.x} ${innerStart.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
    `Z`,
  ].join(" ");
}

/* Day colors: warm amber gradient  ·  Night colors: deep indigo gradient */
const DAY_COLORS = ["#F5C842", "#E8A832", "#D4942A", "#C88426"];
const NIGHT_COLORS = ["#3B4C8A", "#2E3D72", "#283465", "#1E2750"];

function wedgeFill(index: number, isDay: boolean): string {
  const palette = isDay ? DAY_COLORS : NIGHT_COLORS;
  return palette[index % palette.length];
}

function MuhurtaClockDial({
  selected,
  onSelect,
}: {
  selected: number;
  onSelect: (index: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const unit = MUHURTA_UNITS[(selected || 1) - 1];
  const isDay = selected <= 15;

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        viewBox={`0 0 ${DIAL_SIZE} ${DIAL_SIZE}`}
        width="100%"
        style={{ maxWidth: DIAL_SIZE, overflow: "visible" }}
        role="img"
        aria-label="24-hour Muhūrta Clock Dial showing 30 wedges"
      >
        <defs>
          {/* Glow filter for selected wedge */}
          <filter id="wedge-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Radial gradient for day half */}
          <radialGradient id="day-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7E0" />
            <stop offset="100%" stopColor="#F5EDD8" />
          </radialGradient>
          {/* Radial gradient for night half */}
          <radialGradient id="night-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E2750" />
            <stop offset="100%" stopColor="#0F1730" />
          </radialGradient>
        </defs>

        {/* Background ring */}
        <circle cx={CENTER} cy={CENTER} r={OUTER_R + 2} fill="none" stroke={HAIRLINE} strokeWidth={1} />

        {/* Wedges */}
        {MUHURTA_UNITS.map((mu, i) => {
          const startAngle = i * WEDGE_ANGLE;
          const endAngle = startAngle + WEDGE_ANGLE;
          const isActive = mu.index === selected;
          const isHover = mu.index === hovered;
          const isDayWedge = i < 15;
          const fill = wedgeFill(i, isDayWedge);

          return (
            <g key={mu.index}>
              <path
                d={describeArc(CENTER, CENTER, OUTER_R, INNER_R, startAngle, endAngle)}
                fill={fill}
                stroke={isActive ? "#FFF" : "rgba(255,255,255,0.15)"}
                strokeWidth={isActive ? 2.5 : 0.5}
                opacity={isActive ? 1 : isHover ? 0.92 : 0.78}
                style={{
                  cursor: "pointer",
                  transition: "opacity 0.2s, stroke-width 0.15s",
                  filter: isActive ? "url(#wedge-glow)" : "none",
                }}
                onClick={() => onSelect(mu.index)}
                onMouseEnter={() => setHovered(mu.index)}
                onMouseLeave={() => setHovered(null)}
              />
              {/* Wedge label */}
              {(() => {
                const midAngle = startAngle + WEDGE_ANGLE / 2;
                const pos = polarToCartesian(CENTER, CENTER, LABEL_R, midAngle);
                return (
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isDayWedge ? "#4A3000" : "#C5D0F0"}
                    fontSize={9.5}
                    fontWeight={isActive ? 800 : 600}
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {mu.index}
                  </text>
                );
              })()}
            </g>
          );
        })}

        {/* Outer tick marks and time labels */}
        {[0, 6, 12, 18].map((hour) => {
          const muhurtaIndex = (hour / 24) * 30;
          const angle = muhurtaIndex * WEDGE_ANGLE;
          const outerPos = polarToCartesian(CENTER, CENTER, TICK_R + 12, angle);
          const label = `${String(hour).padStart(2, "0")}:00`;
          return (
            <g key={hour}>
              <text
                x={outerPos.x}
                y={outerPos.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={INK_SECONDARY}
                fontSize={10}
                fontWeight={600}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* DAY / NIGHT arc labels */}
        <text
          x={CENTER}
          y={CENTER - OUTER_R - 18}
          textAnchor="middle"
          dominantBaseline="central"
          fill={AMBER}
          fontSize={9}
          fontWeight={700}
          letterSpacing="0.12em"
        >
          SUNRISE · 06:00
        </text>
        <text
          x={CENTER}
          y={CENTER + OUTER_R + 20}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#5566AA"
          fontSize={9}
          fontWeight={700}
          letterSpacing="0.12em"
        >
          SUNSET · 18:00
        </text>

        {/* Center circle */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_R - 2}
          fill={isDay ? "url(#day-center)" : "url(#night-center)"}
          stroke={isDay ? "#E8C84020" : "#4455AA30"}
          strokeWidth={2}
        />

        {/* Center icon */}
        {isDay ? (
          <>
            <circle cx={CENTER} cy={CENTER - 14} r={14} fill="#F5C842" opacity={0.85} />
            {/* Sun rays */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = i * 45;
              const inner = polarToCartesian(CENTER, CENTER - 14, 17, angle);
              const outer = polarToCartesian(CENTER, CENTER - 14, 23, angle);
              return (
                <line key={i} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} stroke="#F5C842" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
              );
            })}
          </>
        ) : (
          <>
            {/* Moon crescent */}
            <circle cx={CENTER - 4} cy={CENTER - 14} r={12} fill="#C5D0F0" opacity={0.9} />
            <circle cx={CENTER + 5} cy={CENTER - 18} r={9} fill={isDay ? "#FFF7E0" : "#1E2750"} />
            {/* Stars */}
            {[
              { x: CENTER + 20, y: CENTER - 25 },
              { x: CENTER - 18, y: CENTER - 30 },
              { x: CENTER + 14, y: CENTER - 5 },
            ].map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={1.5} fill="#C5D0F0" opacity={0.8} />
            ))}
          </>
        )}

        {/* Center info text */}
        <text x={CENTER} y={CENTER + 10} textAnchor="middle" fill={isDay ? "#4A3000" : "#C5D0F0"} fontSize={12} fontWeight={800}>
          {unit?.nameDevanagari}
        </text>
        <text x={CENTER} y={CENTER + 26} textAnchor="middle" fill={isDay ? "#7A6030" : "#8899CC"} fontSize={9.5} fontWeight={600}>
          {unit?.name}
        </text>
        <text x={CENTER} y={CENTER + 40} textAnchor="middle" fill={isDay ? "#9A8050" : "#6677AA"} fontSize={8.5} fontWeight={500}>
          {unit?.range}
        </text>
      </svg>
    </div>
  );
}

/* ── Selected Muhūrta Detail Card ──────────────────────── */
function MuhurtaDetailCard({ unit }: { unit: MuhurtaUnit }) {
  const qColor = qualityColor(unit.quality);
  const isDay = unit.index <= 15;

  return (
    <article
      className="min-w-0 rounded-xl p-5"
      style={{
        background: isDay
          ? "linear-gradient(135deg, #FFFBF0 0%, #FFF5DC 100%)"
          : "linear-gradient(135deg, #1E2750 0%, #15203E 100%)",
        border: `1px solid ${isDay ? "rgba(232,199,114,0.35)" : "rgba(85,102,170,0.35)"}`,
        color: isDay ? INK_PRIMARY : "#C5D0F0",
      }}
    >
      {/* Badge row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase"
          style={{
            background: wash(qColor, "20"),
            color: unit.quality === "inauspicious" && !isDay ? "#FF9A8A" : qColor,
            letterSpacing: "0.06em",
          }}
        >
          <Sparkles size={12} />
          {qualityLabel(unit.quality)}
        </span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: isDay ? "rgba(232,199,114,0.12)" : "rgba(85,102,170,0.2)",
            color: isDay ? AMBER : "#8899CC",
          }}
        >
          {isDay ? <Sun size={12} /> : <Moon size={12} />}
          {unit.dayHalf}
        </span>
      </div>

      {/* Name */}
      <h3
        className="m-0 text-3xl font-semibold"
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        <span style={{ marginRight: 8, fontSize: "1.1em" }}>{unit.nameDevanagari}</span>
        <span style={{ opacity: 0.7, fontSize: "0.8em" }}>{unit.name}</span>
      </h3>

      {/* Meta */}
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-1.5 font-semibold">
          <Clock3 size={14} />
          {unit.range}
        </span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span className="font-medium">Muhūrta #{unit.index} of 30</span>
      </div>

      {/* Deity */}
      <div
        className="mt-4 rounded-lg p-3 text-sm"
        style={{
          background: isDay ? "rgba(232,199,114,0.10)" : "rgba(85,102,170,0.15)",
          border: `1px solid ${isDay ? "rgba(232,199,114,0.2)" : "rgba(85,102,170,0.25)"}`,
        }}
      >
        <p className="m-0 text-xs font-bold uppercase" style={{ color: isDay ? GOLD : "#8899CC", letterSpacing: "0.06em", marginBottom: 4 }}>
          Presiding Deity
        </p>
        <p className="m-0 font-semibold">{unit.deity}</p>
      </div>

      {/* Classical measure */}
      <p className="mb-0 mt-3 text-xs" style={{ opacity: 0.6 }}>
        1 Muhūrta = 2 Ghaṭikā = 48 minutes · 15 Day + 15 Night = 30 per day
      </p>
    </article>
  );
}

/* ── Client Request Envelope Card ──────────────────────── */
function ClientEnvelopeCard({
  request,
  isActive,
  isProcessed,
  onClick,
}: {
  request: RequestCase;
  isActive: boolean;
  isProcessed: boolean;
  onClick: () => void;
}) {
  const result = evaluateScope(request);
  const Icon = isProcessed ? MailOpen : Mail;
  const statusColor = isProcessed ? (result.accepted ? GREEN : VERMILION) : GOLD;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-w-0 items-start gap-3 rounded-xl p-4 text-left transition-all duration-200"
      style={{
        background: isActive
          ? wash(statusColor, "14")
          : SURFACE,
        border: `1.5px solid ${isActive ? statusColor : HAIRLINE}`,
        cursor: "pointer",
        transform: isActive ? "scale(1.01)" : "scale(1)",
      }}
    >
      {/* Envelope icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{
          background: wash(statusColor, "18"),
          color: statusColor,
        }}
      >
        <Icon size={20} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>
          {request.label}
        </p>
        <p className="m-0 mt-1 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
          "{request.note}"
        </p>
        {isProcessed && (
          <div className="mt-2 flex items-center gap-1.5">
            {result.accepted ? (
              <CheckCircle2 size={13} color={GREEN} />
            ) : (
              <XCircle size={13} color={VERMILION} />
            )}
            <span className="text-xs font-semibold" style={{ color: result.accepted ? GREEN : VERMILION }}>
              {result.accepted ? "In scope" : "Out of scope"}
            </span>
          </div>
        )}
      </div>

      {/* Arrow indicator */}
      <ArrowRight
        size={16}
        className="mt-1 shrink-0 transition-transform group-hover:translate-x-0.5"
        style={{ color: isActive ? statusColor : INK_SECONDARY, opacity: isActive ? 1 : 0.4 }}
      />
    </button>
  );
}

/* ── Scope Verdict Card ────────────────────────────────── */
function ScopeVerdictCard({ request }: { request: RequestCase }) {
  const result = evaluateScope(request);
  const correctDisc = findDiscipline(request.correctDiscipline);
  const color = result.accepted ? GREEN : disciplineColor(request.correctDiscipline);

  return (
    <article
      className="min-w-0 rounded-xl p-5"
      style={{
        background: wash(color, "08"),
        border: `1.5px solid ${color}`,
      }}
    >
      {/* Status badge */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase"
          style={{
            background: wash(color, "20"),
            color,
            letterSpacing: "0.06em",
          }}
        >
          {result.accepted ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
          {result.accepted ? "In Scope · Muhūrta" : "Reclassify"}
        </span>
        <BadgeCheck size={20} color={color} />
      </div>

      {/* Title */}
      <h3
        className="m-0 text-2xl font-semibold"
        style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}
      >
        {result.title}
      </h3>

      {/* Scope explanation */}
      <p className="mb-0 mt-3 text-sm leading-relaxed" style={{ color: INK_PRIMARY }}>
        {result.scopeLine}
      </p>

      {/* Honest scope line */}
      <div
        className="mt-4 rounded-lg p-3"
        style={{
          background: wash(color, "10"),
          border: `1px solid ${wash(color, "25")}`,
        }}
      >
        <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em", marginBottom: 4 }}>
          Honest Scope Statement
        </p>
        <p className="m-0 text-sm font-semibold" style={{ color }}>
          {result.honestLine}
        </p>
      </div>

      {/* Correct domain info */}
      {!result.accepted && (
        <div className="mt-4 flex items-start gap-3 rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <ShieldCheck size={18} color={color} className="mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em" }}>
              Correct Domain: {correctDisc.label}
            </p>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY }}>
              {correctDisc.note}
            </p>
            <p className="m-0 mt-1 text-xs italic" style={{ color: INK_SECONDARY }}>
              Premise: {correctDisc.premise} · Time relation: {correctDisc.timeRelation}
            </p>
          </div>
        </div>
      )}

      {/* Two-test checklist for muhūrta validation */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <ChecklistItem
          label="Can the time shift?"
          passed={request.canShift}
          passLabel="Yes — moveable"
          failLabel="No — fixed event"
        />
        <ChecklistItem
          label="Future initiation?"
          passed={request.futureInitiation}
          passLabel="Yes — agentive"
          failLabel="No — past/reactive"
        />
      </div>
    </article>
  );
}

function ChecklistItem({
  label,
  passed,
  passLabel,
  failLabel,
}: {
  label: string;
  passed: boolean;
  passLabel: string;
  failLabel: string;
}) {
  const color = passed ? GREEN : VERMILION;
  return (
    <div
      className="flex items-center gap-2 rounded-lg p-2.5"
      style={{ background: wash(color, "10"), border: `1px solid ${wash(color, "20")}` }}
    >
      {passed ? <CheckCircle2 size={15} color={GREEN} /> : <XCircle size={15} color={VERMILION} />}
      <div className="min-w-0">
        <p className="m-0 text-xs font-bold" style={{ color: INK_PRIMARY }}>{label}</p>
        <p className="m-0 text-xs" style={{ color }}>{passed ? passLabel : failLabel}</p>
      </div>
    </div>
  );
}

/* ── Discipline Lens Selector ──────────────────────────── */
function DisciplineLensGrid({
  selected,
  correctKey,
  onChange,
}: {
  selected: DisciplineKey;
  correctKey: DisciplineKey;
  onChange: (key: DisciplineKey) => void;
}) {
  return (
    <div className="grid min-w-0 gap-2 sm:grid-cols-2">
      {DISCIPLINES.map((disc) => {
        const isActive = disc.key === selected;
        const isCorrect = disc.key === correctKey;
        const color = disciplineColor(disc.key);

        return (
          <button
            key={disc.key}
            type="button"
            onClick={() => onChange(disc.key)}
            className="min-w-0 rounded-xl p-3 text-left transition-all duration-150"
            style={{
              background: isActive ? wash(color, "14") : SURFACE,
              border: `1.5px solid ${isActive ? color : HAIRLINE}`,
              cursor: "pointer",
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: isActive ? color : INK_PRIMARY }}>
                {disc.label}
              </span>
              {isCorrect && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  style={{ background: wash(color, "20"), color, letterSpacing: "0.05em" }}
                >
                  Correct
                </span>
              )}
            </div>
            <p className="m-0 mt-1.5 text-xs leading-relaxed" style={{ color: INK_SECONDARY }}>
              {disc.note}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: SURFACE_2, color: INK_SECONDARY }}>
                {disc.premise}
              </span>
              <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: SURFACE_2, color: INK_SECONDARY }}>
                {disc.timeRelation}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Tab Navigation ────────────────────────────────────── */
type TabKey = "clock" | "clinic";

function TabBar({ active, onChange }: { active: TabKey; onChange: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "clock", label: "Muhūrta Clock", icon: <Clock3 size={15} /> },
    { key: "clinic", label: "Scope Classifier", icon: <Inbox size={15} /> },
  ];

  return (
    <div className="mb-5 flex gap-1 rounded-xl p-1" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
      {tabs.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200"
            style={{
              background: isActive ? SURFACE : "transparent",
              color: isActive ? GOLD : INK_SECONDARY,
              border: isActive ? `1px solid ${HAIRLINE}` : "1px solid transparent",
              boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */
export function MuhurtaConceptScope() {
  const [activeTab, setActiveTab] = useState<TabKey>("clock");
  const [selectedUnit, setSelectedUnit] = useState(12);
  const [requestKey, setRequestKey] = useState<RequestKey>("wedding");
  const [disciplineKey, setDisciplineKey] = useState<DisciplineKey>("muhurta");
  const [processedRequests, setProcessedRequests] = useState<Set<RequestKey>>(new Set());

  const request = useMemo(() => findRequest(requestKey), [requestKey]);
  const unit = MUHURTA_UNITS[selectedUnit - 1] ?? MUHURTA_UNITS[0];

  const chooseRequest = useCallback((key: RequestKey) => {
    const next = findRequest(key);
    setRequestKey(key);
    setDisciplineKey(next.correctDiscipline);
    setProcessedRequests((prev) => new Set(prev).add(key));
  }, []);

  const reset = () => {
    setActiveTab("clock");
    setSelectedUnit(12);
    setRequestKey("wedding");
    setDisciplineKey("muhurta");
    setProcessedRequests(new Set());
  };

  const processedCount = processedRequests.size;
  const totalRequests = REQUESTS.length;

  return (
    <div
      className="w-full min-w-0"
      data-interactive="muhurta-concept-scope"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Muhūrta concept gate
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Time-unit first, discipline-scope second
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Explore the 30 classical Muhūrtas on the interactive clock dial, then classify client requests through the scope clinic.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, cursor: "pointer" }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* ── Tabs ────────────────────────────────────── */}
      <TabBar active={activeTab} onChange={setActiveTab} />

      {/* ── Tab 1: Muhūrta Clock ────────────────────── */}
      {activeTab === "clock" && (
        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Clock Dial */}
          <div className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center gap-2">
              <Clock3 size={17} color={GOLD} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                24-Hour Muhūrta Dial
              </p>
            </div>
            <p className="m-0 mb-4 text-xs" style={{ color: INK_SECONDARY }}>
              Click any wedge to explore. Warm (amber) = Day · Cool (indigo) = Night.
            </p>
            <MuhurtaClockDial selected={selectedUnit} onSelect={setSelectedUnit} />
          </div>

          {/* Detail card */}
          <div className="min-w-0">
            <MuhurtaDetailCard unit={unit} />

            {/* Quick legend */}
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {(["highly-auspicious", "auspicious", "inauspicious"] as const).map((q) => (
                <div
                  key={q}
                  className="flex items-center gap-2 rounded-lg p-2"
                  style={{ background: wash(qualityColor(q), "10"), border: `1px solid ${wash(qualityColor(q), "20")}` }}
                >
                  <div className="h-3 w-3 rounded-full" style={{ background: qualityColor(q) }} />
                  <span className="text-xs font-semibold" style={{ color: qualityColor(q) }}>
                    {qualityLabel(q)}
                  </span>
                </div>
              ))}
            </div>

            {/* Day/Night summary */}
            <div
              className="mt-3 rounded-lg p-3"
              style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}
            >
              <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
                <strong>Day half (M1–M15):</strong> 06:00 to 18:00 · Predominantly amber-warm wedges.
              </p>
              <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                <strong>Night half (M16–M30):</strong> 18:00 to 06:00 · Predominantly indigo-cool wedges.
              </p>
              <p className="m-0 mt-2 text-xs italic" style={{ color: INK_SECONDARY }}>
                1 Muhūrta = 2 Ghaṭikā = 48 minutes · classical reckoning assumes equinoctial sunrise at 06:00.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Tab 2: Scope Classifier Clinic ──────────── */}
      {activeTab === "clinic" && (
        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          {/* Inbox console */}
          <div className="min-w-0">
            <div className="mb-3 flex items-center justify-between gap-2 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="flex items-center gap-2">
                <Inbox size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                  Client inbox
                </p>
              </div>
              <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: wash(GREEN, "16"), color: GREEN }}>
                {processedCount}/{totalRequests} reviewed
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {REQUESTS.map((req) => (
                <ClientEnvelopeCard
                  key={req.key}
                  request={req}
                  isActive={req.key === requestKey}
                  isProcessed={processedRequests.has(req.key)}
                  onClick={() => chooseRequest(req.key)}
                />
              ))}
            </div>
          </div>

          {/* Verdict and lens */}
          <div className="min-w-0">
            <ScopeVerdictCard request={request} />

            {/* Discipline lens grid */}
            <div className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
              <div className="mb-3 flex items-center gap-2">
                <HelpCircle size={16} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
                  Four Jyotiṣa disciplines
                </p>
              </div>
              <p className="m-0 mb-3 text-xs" style={{ color: INK_SECONDARY }}>
                Each request belongs to one discipline. The correct one is marked.
              </p>
              <DisciplineLensGrid
                selected={disciplineKey}
                correctKey={request.correctDiscipline}
                onChange={setDisciplineKey}
              />
            </div>

            {/* Progress feedback */}
            {processedCount === totalRequests && (
              <div
                className="mt-4 flex items-center gap-3 rounded-xl p-4"
                style={{
                  background: wash(GREEN, "10"),
                  border: `1.5px solid ${GREEN}`,
                }}
              >
                <CheckCircle2 size={22} color={GREEN} />
                <div>
                  <p className="m-0 text-sm font-bold" style={{ color: GREEN }}>All requests classified!</p>
                  <p className="m-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>
                    You've reviewed all {totalRequests} client requests. Muhūrta is electional astrology for agentive, future-shiftable actions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
