"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCircle2,
  Compass,
  FileText,
  Home,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Sparkles,
  Sun,
  Wind,
  XCircle,
} from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  ACTIVITIES,
  CANCELLATION_DOSHAS,
  CASE_FILES,
  NAKSHATRAS,
  TRADITION_NOTES,
  type NakshatraKey,
  type Tradition,
  type Verdict,
  findActivity,
  findNakshatra,
  getPanchakaVerdict,
} from "./data";

/* ── Design Tokens ─────────────────────────────────────── */
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.30))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-manuscript-cream, #F5EDD8)";
const SURFACE_3 = "var(--gl-surface-warm, #FAF6ED)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #3D3115)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #5C4A2A)";
const GOLD = "var(--gl-gold, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const VERMILION = ink.vermilionAccent ?? "#A23A1E";
const JADE = "#2F7D55";
const AMBER = "#B9801E";
const INDIGO = "#4F6FA8";


/* ── Helpers ───────────────────────────────────────────── */
function wash(color: string, alphaHex = "12") {
  return color.startsWith("#")
    ? `${color}${alphaHex}`
    : `rgba(156,122,47,${Number.parseInt(alphaHex, 16) / 255})`;
}

function categoryColor(category: string) {
  if (category === "departure") return VERMILION;
  if (category === "foundation") return AMBER;
  return JADE;
}

function categoryBg(category: string) {
  if (category === "departure") return wash(VERMILION, "14");
  if (category === "foundation") return wash(AMBER, "14");
  return wash(JADE, "12");
}

function verdictLabel(verdict: Verdict) {
  if (verdict === "cancelled") return "Pañcaka-CANCELLED";
  if (verdict === "allowed") return "NOT Cancelled";
  return "Depends on Tradition";
}

/* ── SVG Wheel geometry ────────────────────────────────── */
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

/* ── Nakṣatra Wheel ────────────────────────────────────── */
function NakshatraWheel({ activeKey, onHover }: { activeKey: NakshatraKey | null; onHover: (key: NakshatraKey | null) => void }) {
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 205;
  const rInner = 132;
  const rLabel = (rOuter + rInner) / 2;
  const step = 360 / NAKSHATRAS.length;
  const gap = 1;

  const active = activeKey ? findNakshatra(activeKey) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="27 nakṣatra wheel with Pañcaka window highlighted"
        style={{ maxWidth: size, overflow: "visible" }}
      >
        <defs>
          <radialGradient id="panchaka-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={AMBER} stopOpacity="0.18" />
            <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background ring */}
        <circle cx={cx} cy={cy} r={rOuter + 3} fill="none" stroke={HAIRLINE} strokeWidth={1} />

        {NAKSHATRAS.map((n, i) => {
          const start = i * step + gap / 2;
          const end = (i + 1) * step - gap / 2;
          const mid = (start + end) / 2;
          const isActive = activeKey === n.key;
          const isPanchaka = n.inPanchaka;
          const labelPos = polar(cx, cy, rLabel, mid);
          const numberPos = polar(cx, cy, rInner - 18, mid);

          return (
            <g key={n.key}>
              <path
                d={arcPath(cx, cy, rInner, rOuter, start, end)}
                fill={isPanchaka ? wash(AMBER, isActive ? "28" : "18") : isActive ? wash(INDIGO, "16") : SURFACE_3}
                stroke={isActive ? GOLD : isPanchaka ? AMBER : HAIRLINE}
                strokeWidth={isActive ? 2.5 : isPanchaka ? 1.5 : 1}
                style={{ cursor: "pointer", transition: "all 180ms ease" }}
                onMouseEnter={() => onHover(n.key)}
                onMouseLeave={() => onHover(null)}
                onClick={() => onHover(n.key)}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid > 180 ? mid + 90 : mid - 90}, ${labelPos.x}, ${labelPos.y})`}
                style={{
                  fontSize: isPanchaka ? "0.66rem" : "0.6rem",
                  fontWeight: isActive ? 800 : isPanchaka ? 800 : 600,
                  fill: isPanchaka ? GOLD_DEEP : INK_PRIMARY,
                  pointerEvents: "none",
                  letterSpacing: "0.01em",
                }}
              >
                {n.abbrev}
              </text>
              <text
                x={numberPos.x}
                y={numberPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${mid > 180 ? mid + 90 : mid - 90}, ${numberPos.x}, ${numberPos.y})`}
                style={{ fontSize: "0.52rem", fontWeight: 700, fill: isPanchaka ? AMBER : INK_MUTED, pointerEvents: "none" }}
              >
                {n.number}
              </text>
            </g>
          );
        })}

        {/* Center disc */}
        <circle cx={cx} cy={cy} r={rInner - 8} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1} />
        <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "0.78rem", fontWeight: 800, fill: GOLD_DEEP, letterSpacing: "0.04em" }}>
          Pañcaka
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "0.62rem", fontWeight: 600, fill: INK_MUTED }}>
          5 nakṣatras
        </text>
      </svg>

      {/* Info card */}
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 14,
          background: SURFACE,
          padding: "1rem 1.1rem",
          minHeight: 110,
        }}
      >
        {active ? (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} key={active.key}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
              <span style={{ fontSize: "1.3rem", fontWeight: 700, color: GOLD_DEEP }}>{active.devanagari}</span>
              <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "1.05rem" }}>{active.name}</span>
              <span style={{ marginLeft: "auto", fontSize: "0.7rem", fontWeight: 800, color: INK_MUTED }}>#{active.number}</span>
            </div>
            {active.inPanchaka ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: 999,
                  background: wash(AMBER, "14"),
                  color: AMBER,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <Sparkles size={11} />
                Inside Pañcaka {active.panchakaExtent === "partial" ? "(partial)" : ""}
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.2rem 0.55rem",
                  borderRadius: 999,
                  background: wash(JADE, "12"),
                  color: JADE,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <Check size={11} />
                Outside Pañcaka
              </span>
            )}
            {active.panchakaNote && (
              <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>{active.panchakaNote}</p>
            )}
          </motion.div>
        ) : (
          <div style={{ color: INK_MUTED, fontSize: "0.85rem", textAlign: "center", paddingTop: "0.5rem" }}>
            Hover or click a nakṣatra on the wheel to see its Pañcaka status.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Case-file envelope card ───────────────────────────── */
function CaseFileCard({
  caseFile,
  selected,
  solved,
  onClick,
}: {
  caseFile: (typeof CASE_FILES)[number];
  selected: boolean;
  solved: boolean;
  onClick: () => void;
}) {
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
      <div style={{ height: 5, background: solved ? JADE : selected ? GOLD : HAIRLINE, opacity: solved ? 0.9 : 1 }} />
      <div style={{ padding: "0.85rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileText size={16} style={{ color: GOLD }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {caseFile.family}
            </span>
          </div>
          {solved && <CheckCircle2 size={18} style={{ color: JADE }} />}
        </div>
        <p style={{ margin: "0.35rem 0 0", fontWeight: 700, color: INK_PRIMARY, fontSize: "0.92rem", lineHeight: 1.4 }}>{caseFile.request}</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>{caseFile.context}</p>
      </div>
    </button>
  );
}

/* ── Verdict selector ──────────────────────────────────── */
function VerdictSelector({
  correct,
  selected,
  onSelect,
  disabled,
}: {
  correct: Verdict;
  selected: Verdict | null;
  onSelect: (v: Verdict) => void;
  disabled: boolean;
}) {
  const options: Verdict[] = ["cancelled", "allowed", "depends"];
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {options.map((opt) => {
        const isSelected = selected === opt;
        const showResult = selected !== null;
        const isCorrect = opt === correct;
        return (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(opt)}
            style={{
              flex: "1 1 100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              padding: "0.55rem 0.7rem",
              borderRadius: 10,
              border: `1.5px solid ${showResult ? (isCorrect ? JADE : isSelected ? VERMILION : HAIRLINE) : isSelected ? GOLD : HAIRLINE}`,
              background: showResult
                ? isCorrect
                  ? wash(JADE, "18")
                  : isSelected
                    ? wash(VERMILION, "14")
                    : SURFACE
                : isSelected
                  ? wash(GOLD, "14")
                  : SURFACE,
              color: showResult ? (isCorrect ? JADE : isSelected ? VERMILION : INK_MUTED) : isSelected ? GOLD_DEEP : INK_PRIMARY,
              fontWeight: 800,
              fontSize: "0.78rem",
              cursor: disabled ? "default" : "pointer",
              transition: "all 150ms ease",
            }}
          >
            {showResult && (isCorrect ? <CheckCircle2 size={14} /> : isSelected ? <XCircle size={14} /> : null)}
            {opt === "cancelled" ? "CANCELLED" : opt === "allowed" ? "ALLOWED" : "DEPENDS"}
          </button>
        );
      })}
    </div>
  );
}

/* ── Distinction comparison cards ──────────────────────── */
function DistinctionCard({ dosa }: { dosa: (typeof CANCELLATION_DOSHAS)[number] }) {
  const isActivitySpecific = dosa.scope === "activity-specific";
  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 14,
        background: isActivitySpecific ? wash(AMBER, "10") : SURFACE,
        padding: "0.9rem 1rem",
        borderLeft: `4px solid ${isActivitySpecific ? AMBER : VERMILION}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
        <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.92rem" }}>{dosa.label}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.18rem 0.5rem",
            borderRadius: 999,
            background: isActivitySpecific ? wash(AMBER, "16") : wash(VERMILION, "12"),
            color: isActivitySpecific ? AMBER : VERMILION,
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
          }}
        >
          {isActivitySpecific ? <Sparkles size={10} /> : <Scale size={10} />}
          {dosa.scopeLabel}
        </span>
      </div>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>{dosa.description}</p>
    </div>
  );
}

/* ── Mitigation card ───────────────────────────────────── */
function MitigationCard({ activity }: { activity: (typeof ACTIVITIES)[number] }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 14, background: SURFACE, padding: "0.85rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: "0.15rem 0.45rem",
            borderRadius: 999,
            background: categoryBg(activity.category),
            color: categoryColor(activity.category),
            fontSize: "0.65rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          {activity.category === "departure" ? <Compass size={10} /> : activity.category === "foundation" ? <Home size={10} /> : <Sparkles size={10} />}
          {activity.category}
        </span>
        <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.9rem" }}>{activity.label}</span>
      </div>
      <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.8rem", lineHeight: 1.5 }}>{activity.mitigation}</p>
    </div>
  );
}

/* ── Progress dots ─────────────────────────────────────── */
function ProgressDots({ total, solved }: { total: number; solved: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i < solved ? JADE : wash(GOLD, "20"),
            transition: "background 200ms ease",
          }}
        />
      ))}
    </div>
  );
}

/* ── Main component ────────────────────────────────────── */
type TabKey = "wheel" | "cases" | "distinction" | "mitigation";

const TABS: { key: TabKey; label: string; sublabel: string; icon: React.ReactNode }[] = [
  { key: "wheel", label: "Nakṣatra Wheel", sublabel: "5-nakṣatra window", icon: <Compass size={15} /> },
  { key: "cases", label: "Case Files", sublabel: "Activity verdicts", icon: <FileText size={15} /> },
  { key: "distinction", label: "Distinction", sublabel: "Specific vs general", icon: <Scale size={15} /> },
  { key: "mitigation", label: "Mitigation", sublabel: "When unavoidable", icon: <ShieldAlert size={15} /> },
];

export function PanchakaCancellation() {
  const [tab, setTab] = useState<TabKey>("wheel");
  const [hoveredNakshatra, setHoveredNakshatra] = useState<NakshatraKey | null>(null);
  const [selectedCase, setSelectedCase] = useState<string>(CASE_FILES[0].id);
  const [caseAnswers, setCaseAnswers] = useState<Record<string, Verdict | null>>({});
  const [tradition, setTradition] = useState<Tradition>("southern");

  const solvedCount = useMemo(
    () =>
      CASE_FILES.filter((cf) => {
        const ans = caseAnswers[cf.id];
        if (!ans) return false;
        return getPanchakaVerdict(cf.activityKey, cf.tradition).verdict === ans;
      }).length,
    [caseAnswers]
  );

  const activeCase = CASE_FILES.find((c) => c.id === selectedCase) ?? CASE_FILES[0];
  const activeActivity = findActivity(activeCase.activityKey);
  const activeCorrect = getPanchakaVerdict(activeCase.activityKey, activeCase.tradition);
  const caseAnswered = caseAnswers[activeCase.id];
  const caseCorrect = caseAnswered === activeCorrect.verdict;

  return (
    <div
      style={{
        width: "100%",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 18,
        background: SURFACE,
        overflow: "hidden",
        fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.1rem 1.25rem",
          borderBottom: `1px solid ${HAIRLINE}`,
          background: "linear-gradient(135deg, #FFFDF8 0%, #F9F2E3 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", flexWrap: "wrap" }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "1.35rem",
                fontWeight: 700,
                color: INK_PRIMARY,
                fontFamily: "var(--font-cormorant), serif",
              }}
            >
              Pañcaka Cancellation Workbench
            </h2>
            <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
              Identify the 5-nakṣatra window and apply activity-specific cancellation discipline.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ProgressDots total={CASE_FILES.length} solved={solvedCount} />
            <span style={{ fontSize: "0.75rem", fontWeight: 800, color: GOLD_DEEP }}>
              {solvedCount}/{CASE_FILES.length} cases
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${HAIRLINE}`, background: SURFACE_2 }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              style={{
                flex: 1,
                padding: "0.7rem 0.5rem",
                background: active ? SURFACE : "transparent",
                border: "none",
                borderBottom: active ? `2px solid ${GOLD}` : "2px solid transparent",
                color: active ? GOLD_DEEP : INK_MUTED,
                fontWeight: active ? 800 : 700,
                fontSize: "0.78rem",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
                transition: "all 150ms ease",
              }}
            >
              {t.icon}
              <span>{t.label}</span>
              <span style={{ fontSize: "0.65rem", opacity: 0.8, fontWeight: 600 }}>{t.sublabel}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "1.25rem" }}>
        <AnimatePresence mode="wait">
          {tab === "wheel" && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(280px, 340px)", gap: "1.5rem", alignItems: "start" }}>
                <NakshatraWheel activeKey={hoveredNakshatra} onHover={setHoveredNakshatra} />
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 14, background: SURFACE, padding: "1rem 1.1rem" }}>
                    <h3 style={{ margin: "0 0 0.6rem", fontSize: "0.85rem", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      The Pañcaka Window
                    </h3>
                    <p style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                      Moon transits the 5 nakṣatras from Dhaniṣṭhā 3rd-pāda through Revatī. This takes approximately 5 days and
                      recurs every ~27.3 days.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      {NAKSHATRAS.filter((n) => n.inPanchaka).map((n) => (
                        <span
                          key={n.key}
                          style={{
                            padding: "0.25rem 0.55rem",
                            borderRadius: 999,
                            background: wash(AMBER, "14"),
                            color: GOLD_DEEP,
                            fontSize: "0.72rem",
                            fontWeight: 800,
                          }}
                        >
                          {n.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 14, background: SURFACE, padding: "1rem 1.1rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                      Śloka Reminder
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "1.1rem",
                        fontStyle: "italic",
                        color: INK_PRIMARY,
                        lineHeight: 1.5,
                      }}
                    >
                      “dhaniṣṭhā-tṛtīyādeḥ revatī-paryantakāḥ kramāt | pañca-nakṣatra-vyāptaḥ pañcakaḥ kāla ucyate ||”
                    </p>
                    <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
                      From Dhaniṣṭhā’s third pāda onward through Revatī — the time spanning these five nakṣatras is called Pañcaka.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "cases" && (
            <motion.div
              key="cases"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 320px) 1fr", gap: "1.25rem", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {CASE_FILES.map((cf) => (
                    <CaseFileCard
                      key={cf.id}
                      caseFile={cf}
                      selected={selectedCase === cf.id}
                      solved={caseAnswers[cf.id] === getPanchakaVerdict(cf.activityKey, cf.tradition).verdict}
                      onClick={() => {
                        setSelectedCase(cf.id);
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => setCaseAnswers({})}
                    style={{
                      marginTop: "0.25rem",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.35rem",
                      padding: "0.55rem 1rem",
                      borderRadius: 10,
                      border: `1px dashed ${HAIRLINE}`,
                      background: "transparent",
                      color: INK_MUTED,
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <RefreshCcw size={13} />
                    Reset cases
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 16, background: SURFACE, overflow: "hidden" }}>
                    <div
                      style={{
                        padding: "0.85rem 1.1rem",
                        borderBottom: `1px solid ${HAIRLINE}`,
                        background: SURFACE_2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                      }}
                    >
                      <span style={{ fontWeight: 800, color: GOLD_DEEP, fontSize: "0.82rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        Active Case File
                      </span>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: 999,
                          background: activeCase.tradition === "northern" ? wash(INDIGO, "12") : wash(VERMILION, "12"),
                          color: activeCase.tradition === "northern" ? INDIGO : VERMILION,
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        {activeCase.tradition === "northern" ? <Wind size={10} /> : <Sun size={10} />}
                        {activeCase.tradition}
                      </span>
                    </div>
                    <div style={{ padding: "1.1rem" }}>
                      <p style={{ margin: "0 0 0.2rem", fontSize: "0.8rem", color: INK_MUTED, fontWeight: 700 }}>{activeCase.family}</p>
                      <p style={{ margin: "0 0 0.7rem", fontWeight: 800, color: INK_PRIMARY, fontSize: "1.05rem", lineHeight: 1.4 }}>
                        {activeCase.request}
                      </p>
                      <p style={{ margin: "0 0 1rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{activeCase.context}</p>

                      <div style={{ marginBottom: "1rem" }}>
                        <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Activity Category
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              padding: "0.2rem 0.55rem",
                              borderRadius: 999,
                              background: categoryBg(activeActivity.category),
                              color: categoryColor(activeActivity.category),
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {activeActivity.category}
                          </span>
                          <span style={{ fontSize: "0.85rem", color: INK_PRIMARY, fontWeight: 700 }}>
                            {activeActivity.sanskrit} · {activeActivity.devanagari}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          Your Verdict
                        </p>
                        <VerdictSelector
                          correct={activeCorrect.verdict}
                          selected={caseAnswered}
                          onSelect={(v) => setCaseAnswers((prev) => ({ ...prev, [activeCase.id]: v }))}
                          disabled={!!caseAnswered}
                        />
                      </div>

                      {caseAnswered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          style={{
                            borderRadius: 12,
                            padding: "0.85rem 1rem",
                            background: caseCorrect ? wash(JADE, "12") : wash(VERMILION, "12"),
                            border: `1px solid ${caseCorrect ? wash(JADE, "30") : wash(VERMILION, "30")}`,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            {caseCorrect ? <CheckCircle2 size={18} style={{ color: JADE }} /> : <XCircle size={18} style={{ color: VERMILION }} />}
                            <span
                              style={{
                                fontWeight: 800,
                                color: caseCorrect ? JADE : VERMILION,
                                fontSize: "0.92rem",
                              }}
                            >
                              {caseCorrect ? "Correct" : "Not quite"} — {verdictLabel(activeCorrect.verdict)}
                            </span>
                          </div>
                          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>{activeCorrect.note}</p>
                          {activeActivity.mitigation && (
                            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.78rem", lineHeight: 1.5 }}>
                              <strong>Mitigation:</strong> {activeActivity.mitigation}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "distinction" && (
            <motion.div
              key="distinction"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.85rem" }}>
                {CANCELLATION_DOSHAS.map((dosa) => (
                  <DistinctionCard key={dosa.key} dosa={dosa} />
                ))}
              </div>

              <div
                style={{
                  marginTop: "1.25rem",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 14,
                  background: SURFACE,
                  padding: "1rem 1.1rem",
                }}
              >
                <h3 style={{ margin: "0 0 0.6rem", fontSize: "0.85rem", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Why the distinction matters
                </h3>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.6 }}>
                  A client might ask: “Does Pañcaka cancel my wedding-muhūrta?” The answer is no. Pañcaka is{" "}
                  <strong>activity-specific</strong> — it cancels only the five forbidden actions. General cancellation-doṣas
                  (Vyatīpāta/Vaidhṛti, Bhadrā-mukha, Riktā-tithi) are <strong>cross-activity</strong> and apply broadly. Do not
                  conflate the two scopes.
                </p>
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.75rem",
                }}
              >
                {ACTIVITIES.filter((a) => a.verdict === "allowed").map((a) => (
                  <div
                    key={a.key}
                    style={{
                      border: `1px solid ${wash(JADE, "30")}`,
                      borderRadius: 12,
                      background: wash(JADE, "10"),
                      padding: "0.75rem 1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: JADE }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.85rem" }}>{a.label}</p>
                      <p style={{ margin: "0.1rem 0 0", color: INK_MUTED, fontSize: "0.72rem" }}>Pañcaka does NOT cancel</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "mitigation" && (
            <motion.div
              key="mitigation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div
                style={{
                  marginBottom: "1rem",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 14,
                  background: SURFACE,
                  padding: "0.85rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: INK_PRIMARY, fontSize: "0.9rem" }}>Regional-tradition variant</p>
                  <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
                    Choose which 5th forbidden action your family context follows.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", background: SURFACE_2, padding: "0.25rem", borderRadius: 10 }}>
                  {(["northern", "southern"] as Tradition[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTradition(t)}
                      style={{
                        padding: "0.4rem 0.8rem",
                        borderRadius: 8,
                        border: "none",
                        background: tradition === t ? SURFACE : "transparent",
                        color: tradition === t ? GOLD_DEEP : INK_MUTED,
                        fontWeight: tradition === t ? 800 : 700,
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        boxShadow: tradition === t ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                        textTransform: "capitalize",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginBottom: "1rem",
                  border: `1px solid ${wash(AMBER, "30")}`,
                  borderRadius: 14,
                  background: wash(AMBER, "10"),
                  padding: "0.85rem 1rem",
                }}
              >
                <p style={{ margin: 0, fontWeight: 800, color: GOLD_DEEP, fontSize: "0.85rem" }}>{TRADITION_NOTES[tradition].label}</p>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                  {TRADITION_NOTES[tradition].note} The 5th forbidden action is{" "}
                  <strong>{TRADITION_NOTES[tradition].fifthLabel}</strong>.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
                {ACTIVITIES.filter((a) => a.verdict === "cancelled" || a.verdict === "depends").map((a) => {
                  const effective = a.key === "funeral-pyre" || a.key === "grass-thatching" ? getPanchakaVerdict(a.key, tradition).verdict !== "allowed" : true;
                  return (
                    <div
                      key={a.key}
                      style={{
                        opacity: effective ? 1 : 0.5,
                        transition: "opacity 200ms ease",
                      }}
                    >
                      <MitigationCard activity={a} />
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: "1rem",
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 14,
                  background: SURFACE,
                  padding: "0.85rem 1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                  <ShieldAlert size={16} style={{ color: VERMILION }} />
                  <span style={{ fontWeight: 800, color: INK_PRIMARY, fontSize: "0.9rem" }}>Emergency-context priority</span>
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                  Medical-emergency South-travel or required construction-initiation overrides Pañcaka-cancellation per
                  safety-context priority discipline. Document the safety rationale and offer post-emergency remediation if
                  appropriate.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
